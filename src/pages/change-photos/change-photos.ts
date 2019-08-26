import {Component} from "@angular/core";
import {
    NavController,
    NavParams,
    ActionSheetController,
    AlertController
} from "ionic-angular";
import {Camera} from "@ionic-native/camera";
import {FileTransfer} from "@ionic-native/file-transfer";
import {ImagePicker} from "@ionic-native/image-picker";
import {TermsPage} from "../terms/terms";
import {ApiProvider} from "../../providers/api/api";
import {HomePage} from "../home/home";


/**
 * Generated class for the ChangePhotosPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-change-photos',
    templateUrl: 'change-photos.html'
})
export class ChangePhotosPage {

    image: any;
    photos: any;
    imagePath: any;
    username: any = false;
    password: any = false;
    new_user: any = false;
    gender: any;
    dataPage: any;
    description: any;

    constructor(public actionSheetCtrl: ActionSheetController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public api: ApiProvider,
                public camera: Camera,
                public  fileTransfer: FileTransfer,
                public imagePicker: ImagePicker) {

        if (navParams.get('new_user')) {
            this.new_user = 1;
            this.api.storage.set('new_user', 1);
        }

        this.api.storage.get('username').then((username) => {
            this.api.storage.get('password').then((password) => {
                this.username = username;
                this.password = password;
            });
        });

        this.api.storage.get('new_user').then((val) => {
            if (val) {
                this.new_user = val;
            }else{
                this.new_user = false;
            }
        });

        if (navParams.get('username') && navParams.get('password')) {
            this.password = navParams.get('password');
            this.username = navParams.get('username');
        }

        this.getPageData();
        this.image = navParams.get('images');
    }

    delete(photo) {
        let confirm = this.alertCtrl.create({
            title: 'האם למחוק את התמונה?',
            buttons: [
                {
                    text: 'לא',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                }, {
                    text: 'כן',
                    handler: () => {
                        this.postPageData('deleteImage', photo);
                    }
                }
            ]
        });
        confirm.present();
    }


    getCount(num) {
        return parseInt(num) + 1;
    }

    getPageData() {

        this.api.http.get(this.api.url + '/user/images', this.api.setHeaders(true, this.username, this.password)).subscribe((data: any) => {

            this.dataPage = data;
            this.description = data.texts.description;
            this.photos = data.images.items;
            this.gender = data.gender;

        }, err => {
            //alert(JSON.stringify(err));
        });
    }

    getPage(id) {
        this.navCtrl.push(TermsPage, {id: id});
    }

    postPageData(type, params) {//not active
        let data: any, action;
        if (type == 'setMain') {
            action = "setMain";
            console.log('Param', params);
            data = JSON.stringify({setMain: params.id});

        } else if (type == 'deleteImage') {
            action = "delete";
            data = JSON.stringify({
                //delete: params.id
            });
        } else if (type == 'setPrivate'){
            action = "private";
            data = JSON.stringify({
                private: params.id,
                set: (params.private == '0') ? 1 : 0
            });
        }

        this.api.http.post(this.api.url + '/user/images/' + action + '/' + params.id, data, this.api.setHeaders(true, this.username, this.password)).subscribe((data: any) => {

            if (type != 'setMain') {
                this.dataPage = data;
            } else {
                this.dataPage.images = data.images;
            }
            this.photos = data.images.items;
            this.getPageData();
        }, err => {
            console.log("Oops!");
        });
    }

    edit(photo) {

        let mainOpt = [];

        if (photo.main == '0' && photo.isValid == '1') {

            mainOpt.push({
                    text: this.dataPage.texts.set_as_main_photo,
                    icon: 'contact',
                    handler: () => {
                        this.postPageData('setMain', photo);
                    }
                }
            );
        }

        if(this.dataPage.vip == '1'){
            mainOpt.push({
                    text: (photo.private == '0') ? this.dataPage.texts.set_as_private : this.dataPage.texts.set_as_not_private,
                    icon: (photo.private == '0') ? 'md-eye-off' : 'md-eye',
                    handler: () => {
                        this.postPageData('setPrivate', photo);
                    }
                }
            );
        }

        mainOpt.push({
            text: this.dataPage.texts.delete,
            role: 'destructive',
            icon: 'trash',
            handler: () => {
                this.delete(photo);
            }
        });
        mainOpt.push({
            text: this.dataPage.texts.cancel,
            role: 'destructive',
            icon: 'close',
            handler: () => {
                console.log('Cancel clicked');
            }
        });

        var status = photo.isValid == 1 ?
            this.dataPage.texts.approved : this.dataPage.texts.waiting_for_approval;

        let actionSheet = this.actionSheetCtrl.create({
            title: this.dataPage.texts.edit_photo,

            subTitle: this.dataPage.texts.status + ': ' + status,

            buttons: mainOpt
        });
        actionSheet.present();
    }

    add() {

        let actionSheet = this.actionSheetCtrl.create({
            title: this.dataPage.texts.add_photo,
            buttons: [
                {
                    text: this.dataPage.texts.choose_from_camera,
                    icon: 'aperture',
                    handler: () => {
                        this.openCamera();
                    }
                }, {
                    text: this.dataPage.texts.choose_from_gallery,
                    icon: 'photos',
                    handler: () => {
                        this.openGallery();
                    }
                }, {
                    text: this.dataPage.texts.cancel,
                    role: 'destructive',
                    icon: 'close',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        actionSheet.present();
    }

    openGallery() {

        let options = {
            maximumImagesCount: 1,
            width: 600,
            height: 600,
            quality: 100
        };

        this.imagePicker.getPictures(options).then(
            (file_uris) => {
                this.uploadPhoto(file_uris[0]);
            },

            (err) => {
                //alert(JSON.stringify(err))
            }
        );
    }

    openCamera() {
        let cameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.FILE_URI,
            sourceType: this.camera.PictureSourceType.CAMERA,
            encodingType: this.camera.EncodingType.JPEG,
            targetWidth: 600,
            targetHeight: 600,
            saveToPhotoAlbum: true,
            chunkedMode: true,
            correctOrientation: true
        };

        this.camera.getPicture(cameraOptions).then((imageData) => {
            this.uploadPhoto(imageData);
        }, (err) => {
            //alert(JSON.stringify(err));
        });
    }

    safeHtml(el): any {
        let html = this.description;
        let div: any = document.createElement('div');

        return html.innerHTML;

    }

    uploadPhoto(url) {

        this.api.showLoad();

        this.api.storage.get('user_id').then((val) => {

            let options = {
                fileKey: "photo",
                fileName: 'test.jpg',
                chunkedMode: false,
                mimeType: "image/jpg",
                headers: {Authorization: "Basic " + btoa(encodeURIComponent(this.username) + ":" + this.password)}/*@*/
            };

            const filetransfer = this.fileTransfer.create();

            filetransfer.upload(url, this.api.url + '/user/image', options).then((entry) => {
                this.navCtrl.push(ChangePhotosPage, {});
                this.api.hideLoad();
            }, (err) => {
                //alert(JSON.stringify(err));
                this.api.hideLoad();
            });
        });
    }

    onHomePage() {
        this.api.storage.remove('new_user');
        this.navCtrl.push(HomePage);
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChangePhotosPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'ChangePhotosPage';
    }
}

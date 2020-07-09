import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, Nav, ToastController, Content} from "ionic-angular";
import * as $ from "jquery";
import {FullScreenProfilePage} from "../full-screen-profile/full-screen-profile";
import {DialogPage} from "../dialog/dialog";
import {ApiProvider} from "../../providers/api/api";
/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-profile',
    templateUrl: 'profile.html',
})
export class ProfilePage {
    @ViewChild(Content) content: Content;
    @ViewChild(Nav) nav: Nav;

    isAbuseOpen: any = false;

    user: any = {};

    texts: any = {lock: '', unlock: ''};

    formReportAbuse: any =
    {title: '', buttons: {cancel: '', submit: ''}, text: {label: '', name: '', value: ''}};

    myId: any = false;

    imageClick: boolean = false;


    constructor(public toastCtrl: ToastController,
                public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiProvider) {

        let user = navParams.get('user');

        if( user && typeof user.photoLarge != 'undefined'){
            user.photos = [{url:user.photoLarge}];
        }

        if (user) {

            this.user = user;

            this.api.http.get(api.url + '/user/profile/' + this.user.id, api.setHeaders(true)).subscribe((data: any) => {
                this.user = data;
                this.formReportAbuse = data.formReportAbuse;
                this.texts = data.texts;
                this.api.hideLoad();
                this.imageClick = true;
            });
        } else {

            this.api.storage.get('user_id').then((val) => {
                if (val) {
                    this.myId = val;
                    this.api.http.get(api.url + '/user/profile/' + this.myId, api.setHeaders(true)).subscribe((data: any) => {
                        this.user = data;

                        this.formReportAbuse = data.formReportAbuse;
                        this.texts = data.texts;
                        this.api.hideLoad();
                        this.imageClick = true;
                    });
                }
            });
        }

        console.log(user);

    }

    setHtml(id, html) {
        if ($('.' + id).html() == '' && html != '') {
            let div: any = document.createElement('div');
            div.innerHTML = html;/*
            [].forEach.call(div.getElementsByTagName("a"), (a) => {
                var pageHref = a.getAttribute('onclick');
                if (pageHref) {
                    a.removeAttribute('onclick');
                    a.onclick = () => this.getPage(pageHref);
                }
            });*/
            $('.' + id).append(div);
        }
    }

    scrollToBottom() {
        this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, 300);
    }

    toVideoChat() {
      this.api.openVideoChat({id: this.user.userId, chatId: 0, alert: false, username: this.user.nickName});
    }

    addFavorites() {
        // this.user.isAddFavorite = true;
        let url, message;
        if (this.user.is_in_favorite_list  == true) {
            this.user.is_in_favorite_list  = false;
            url = this.api.url + '/user/favorites/' + this.user.userId+'/delete';
            message = 'has been removed from Favorites';
        } else {
            this.user.is_in_favorite_list  = true;
            url = this.api.url + '/user/favorites/' + this.user.userId;
            message = 'has been added to Favorites';
        }

        let toast = this.toastCtrl.create({
            message: this.user.nickName + ' ' + message,
            duration: 2000
        });

        console.log(url);

        toast.present();

        let params = JSON.stringify({
            list: 'Favorite',
        });

        this.api.http.post( url, params, this.api.setHeaders(true)).subscribe((data: any) => {
            console.log(data);
        });
    }

    blockSubmit() {
        var action;
        if (this.user.is_in_black_list == true) {
            this.user.is_in_black_list = false;
            action = 'delete';
        } else {
            this.user.is_in_black_list = true;
            action = 'create';
        }

        let params = JSON.stringify({
            list: 'BlackList',
            action: action
        });

        var act = this.user.is_in_black_list == 1 ? 1 : 0;

        this.api.http.post(this.api.url + '/user/managelists/black/' + act + '/' + this.user.userId, params, this.api.setHeaders(true)).subscribe((data: any) => {
            let toast = this.toastCtrl.create({
                message: data.success,
                duration: 3000
            });

            toast.present();

        });
    }

    addLike() {
        this.user.isAddLike = true;
        let toast = this.toastCtrl.create({
            message: ' עשית לייק ל' + this.user.nickName,
            duration: 2000
        });

        toast.present();

        let params = JSON.stringify({
            toUser: this.user.userId,
        });


        this.api.http.post(this.api.url + '/user/like/' + this.user.userId, params, this.api.setHeaders(true)).subscribe((data: any) => {
            console.log(data);
        }, err => {
            console.log("Oops!");
        });

    }

    fullPagePhotos() {
        if(this.user.photos[0].url != 'http://www.richdate.co.il/images/users/small/0.jpg') {
            this.navCtrl.push(FullScreenProfilePage, {
                user: this.user
            });
        }
    }

    toDialog() {
        this.navCtrl.push(DialogPage, {
            user: this.user
        });
    }

    reportAbuseShow() {
        this.isAbuseOpen = true;
        this.scrollToBottom();
    }

    reportAbuseClose() {
        this.isAbuseOpen = false;
        this.formReportAbuse.text.value = "";
    }

    abuseSubmit() {
        let params = JSON.stringify({
            abuseMessage: this.formReportAbuse.text.value,
        });

        this.api.http.post(this.api.url + '/user/abuse/' + this.user.userId, params, this.api.setHeaders(true)).subscribe((data: any) => {

            let toast = this.toastCtrl.create({
                message: 'הודעתך נשלחה בהצלחה להנהלת האתר',
                duration: 2000
            });

            toast.present();
        }, err => {
            console.log("Oops!");
        });
        this.reportAbuseClose();
    }

    ionViewDidLoad() {
        //console.log(this.user);
    }

    ionViewWillLeave() {
        $('.back-btn').hide();
    }

    ionViewWillEnter() {
        this.api.pageName = 'ProfilePage';
        $('.back-btn').show();
    }

}

import {Component} from "@angular/core";
import {NavController, NavParams, ToastController} from "ionic-angular";
import {ApiProvider} from "../../providers/api/api";

/*
 Generated class for the Settings page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {

    form: any = {newMessPushNotif: '', userGetMsgToEmail: ''};
    fingerprintAuth: any = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                private toastCtrl: ToastController,
                public api: ApiProvider) {

        this.api.http.get(api.url + '/user/settings', api.setHeaders(true)).subscribe((data: any) => {
            //this.form = data.json().settings;
            this.form.newMessPushNotif = Boolean(parseInt(data.settings.newMessPushNotif));
            this.form.userGetMsgToEmail = Boolean(parseInt(data.settings.userGetMsgToEmail));
        });



        this.api.storage.get('enableFingerAuth').then((enableFingerAuth) => {
            if (enableFingerAuth && enableFingerAuth == '1') {
                // alert('enableFingerAuth' + enableFingerAuth);
                this.form.fingerprint = 1;
            }
        });
    }

    presentToast() {
        let toast = this.toastCtrl.create({
            message: 'נשמר',
            duration: 3000
        });

        toast.present();
    }

    submit(type) {

        let name,value;

        if (type == 'email') {

            name = 'userGetMsgToEmail';
            value = this.form.userGetMsgToEmail;

            this.presentToast();

            this.api.http.post(this.api.url + '/user/settings/' + name + '/' + value, {}, this.api.setHeaders(true)).subscribe((data: any) => {
            });

        } else if (type == 'push') {
            name = 'newMessPushNotif';
            value = this.form.newMessPushNotif;

            this.presentToast();

            this.api.http.post(this.api.url + '/user/settings/' + name + '/' + value, {}, this.api.setHeaders(true)).subscribe((data: any) => {
            });
        } else if ('fingerprint') {
            if (this.form.fingerprint == true) {
                this.api.storage.set('enableFingerAuth', '1');
            } else {
                this.api.storage.set('enableFingerAuth', '0');
            }
        }
    }

    ionViewDidLoad() {
        this.api.pageName = 'SettingsPage';
        console.log('ionViewDidLoad SettingsPage');
    }

}

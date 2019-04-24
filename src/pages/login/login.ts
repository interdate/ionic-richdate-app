import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, ToastController, Platform} from "ionic-angular";
import {HomePage} from "../home/home";
import {ApiQuery} from "../../library/api-query";
import {Storage} from "@ionic/storage";
import {FingerprintAIO} from "@ionic-native/fingerprint-aio";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import {RegisterPage} from "../register/register";
import * as $ from "jquery";
import {SubscriptionPage} from "../subscription/subscription";
import {ChangePhotosPage} from "../change-photos/change-photos";
import {ActivationPage} from "../activation/activation";
import {HttpHeaders} from "@angular/common/http";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    form: { errors: any, login: any } = {errors: {}, login: {username: {label: ''}, password: {label: ''}}};
    errors: any;
    header: any;
    user: any = {id: '', name: ''};
    fingerAuth: any;
    enableFingerAuth: any;
    disableFingerAuthInit: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiQuery,
                public storage: Storage,
                public toastCtrl: ToastController,
                private faio: FingerprintAIO,
                private platform: Platform) {

        this.api.http.get(api.url + '/user/form/login', api.setHeaders1(false)).subscribe((data:any) => {
            this.form = data;

            this.storage.get('fingerAuth').then((val) => {
                this.faio.isAvailable().then(result => {
                    if (val.status) {
                        this.fingerAuth = true;
                    }
                });
            });

            this.storage.get('username').then((username) => {
                this.form.login.username.value = username;
                this.user.name = username;
            });
        });

        this.storage = storage;

        if (navParams.get('page') && navParams.get('page')._id == "logout") {

            this.api.setHeaders(false, null, null);
            this.api.setHeaders1(false, null, null);
            // Removing data storage
            this.api.username = null;
            this.api.password = null;
            this.api.status = '';
            this.storage.remove('status');
            this.storage.remove('password');
            this.storage.remove('user_id');
            this.storage.remove('user_photo');
        }

        if(navParams.get('error')){
            this.errors = navParams.get('error');
        }
    }

    formSubmit(type) {
        this.form.login.username.value = this.user.name;
        let username = encodeURIComponent(this.form.login.username.value);
        let password = encodeURIComponent(this.form.login.password.value);

        if (username == "") {
            username = "nologin";
        }

        if (password == "") {
            password = "nopassword";
        }

        this.api.http.post(this.api.url + '/user/login/', '', this.setHeaders(username,password)).subscribe(data => {

            setTimeout(function () {
                //this.errors = 'משתמש זה נחסם על ידי הנהלת האתר';
            }, 300);

            this.validate(data);

        }, err => {
            console.log(err);
            if(type != 'fingerprint'){
                this.errors = err.error;
            }

        });
    }

    setHeaders(username,password) {
        let myHeaders = new HttpHeaders();
        myHeaders = myHeaders.append('Content-type', 'application/json');
        myHeaders = myHeaders.append('Accept', '*/*');
        myHeaders = myHeaders.append('Access-Control-Allow-Origin', '*');
        myHeaders = myHeaders.append("Authorization", "Basic " + btoa(username + ':' + password));

        this.header = {
            headers: myHeaders
        };
        return this.header;
    }

    fingerAuthentication() {

        this.faio.show({
            clientId: 'com.interdate.richdate',
            //clientSecret: 'password', //Only necessary for Android
            clientSecret: 'password', //Only necessary for Android
            disableBackup:true,  //Only for Android(optional)
            localizedFallbackTitle: 'Use Pin', //Only for iOS
            localizedReason: 'כניסה לשידייט באמצעות טביעת אצבע' //Only for iOS
        })
            .then((result: any) => {
                if (result) {
                    this.storage.get('fingerAuth').then((val) => {
                        if (val.status) {
                            this.form.login.username.value = val.username;
                            this.form.login.password.value = val.password;
                            this.formSubmit('fingerprint');
                        }
                    });
                }
            })
            .catch((error: any) => console.log(error));
    }

    validate(response) {

        if (response.status != "not_activated") {
            this.storage.set('username', this.form.login.username.value);
            this.storage.set('password', this.form.login.password.value);
            this.storage.set('status', response.status);
            this.storage.set('user_id', response.id);
            this.storage.set('user_photo', response.photo);

            this.api.setHeaders(true, this.form.login.username.value, this.form.login.password.value);
            this.api.setHeaders1(true, this.form.login.username.value, this.form.login.password.value);
        }
        if (response.status) {
            let data = {
                status: 'init',
                username: this.form.login.username.value,
                password: this.form.login.password.value
            };

            this.storage.set('fingerAuth', data);

            this.storage.set('user_photo', response.photo);
         if (response.status == "notActivated") {
                /* let toast = this.toastCtrl.create({
                 message: response.texts.notActiveMessage,
                 showCloseButton: true,
                 closeButtonText: 'אישור'
                 });
                 toast.present();*/
                this.navCtrl.push(ActivationPage);
            }else if (response.status == "noimg") {
             this.user.id = response.id;
             let toast = this.toastCtrl.create({
                 message: "לכניסה לאתר ריצ'דייט יש להעלות תמונה‎",
                 duration: 3000
             });

             toast.present();
             this.navCtrl.push(ChangePhotosPage, {
                 user: this.user,
                 username: this.form.login.username.value,
                 password: this.form.login.password.value
             });
         }else if(response.userIsPaying == 0) {
                this.navCtrl.push(SubscriptionPage);
            }else{
                this.navCtrl.setRoot(HomePage, {
                    params: 'login',
                    username: this.form.login.username.value,
                    password: this.form.login.password.value
                });
            }

        } else if (response.status == "noimg") {
            this.user.id = response.id;

            this.navCtrl.push(ChangePhotosPage, {
                user: this.user,
                username: this.form.login.username.value,
                password: this.form.login.password.value
            });
        }
        this.storage.get('deviceToken').then((deviceToken) => {
            this.api.sendPhoneId(deviceToken);
        });
    }

    onRegistrationPage() {
        this.navCtrl.push(RegisterPage);
    }

    onPasswordRecoveryPage() {
        this.navCtrl.push('PasswordRecoveryPage');
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad LoginPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'LoginPage';
        $('.back-btn').hide();
    }

}

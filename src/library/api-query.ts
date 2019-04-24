import {Component} from "@angular/core";
import {Headers, RequestOptions, Http} from "@angular/http";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AlertController, LoadingController, Platform, ModalController, ToastController} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {DomSanitizer} from "@angular/platform-browser";
import {Geolocation} from "@ionic-native/geolocation";
import {Keyboard} from "@ionic-native/keyboard";


@Component({
    templateUrl: 'api.html'
})
export class ApiQuery {

    public url: any;
    public header: RequestOptions;
    public header1: any;
    public response: any;
    public username: any;
    public password: any;
    public status: any = '';
    public back: any = false;
    public storageRes: any;
    public footer: any = true;
    public pageName: any = '';
    public loading: any;
    public resultsPerPage: any = 20;
    public signupData: {  username: any, password: any };

    constructor(public storage: Storage,
                public alertCtrl: AlertController,
                public http1: Http,
                public http: HttpClient,
                public loadingCtrl: LoadingController,
                private sanitizer: DomSanitizer,
                public modalCtrl: ModalController,
                public toastCtrl: ToastController,
                private geolocation: Geolocation,
                public keyboard: Keyboard,
                public plt: Platform) {
      //this.url = 'http://10.0.0.12:8100';
      //this.url = 'http://localhost:8100';
      this.url = 'https://m.richdate.co.il/api/v8';

        this.storage.get('user_id').then((val) => {
            this.storage.get('username').then((username) => {
                this.username = username;
            });
            this.storage.get('password').then((password) => {
                this.password = password;
            });
        });
    }

    presentToast(txt, duration = 3000) {
        let toast = this.toastCtrl.create({
            message: txt,
            duration: duration,
        });

        toast.present();
    }


    safeHtml(html) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    sendPhoneId(idPhone) {
        let data = JSON.stringify({deviceId: idPhone});
        let os = (this.plt.is('ios')) ? 'iOS' : 'Android';
        this.http.post(this.url + '/user/deviceId/OS:' + os, data, this.setHeaders1(true)).subscribe(data => {
        });
    }

    setUserData(data) {
        this.setStorageData({label: 'username', value: data.username});
        this.setStorageData({label: 'password', value: data.password});
    }

    /**
     *  Set User's Current Location
     */
    setLocation() {

        this.geolocation.getCurrentPosition().then((pos) => {
            var params = JSON.stringify({
                latitude: ''+pos.coords.latitude+'',
                longitude: ''+pos.coords.longitude+''
            });

            if(this.password){
                this.http.post(this.url + '/user/location', params, this.setHeaders1(true)).subscribe(data => {
                });
            }
        });
    }

    setStorageData(data) {
        this.storage.set(data.label, data.value);
    }

    showLoad(txt = 'אנא המתן...') {
        if (this.isLoaderUndefined()) {
            this.loading = this.loadingCtrl.create({
                content: txt
            });

            this.loading.present();
        }
    }

    functiontofindIndexByKeyValue(arraytosearch, key, valuetosearch) {
        for (var i = 0; i < arraytosearch.length; i++) {
            if (arraytosearch[i][key] == valuetosearch) {
                return i;
            }
        }
        return null;
    }

    hideLoad() {
        if (!this.isLoaderUndefined())
            this.loading.dismiss();
        this.loading = undefined;
    }

    isLoaderUndefined(): boolean {
        return (this.loading == null || this.loading == undefined);
    }

    getUserData() {
        this.storage.get('user_id').then((val) => {
            this.storage.get('username').then((username) => {
                this.username = username;
            });
            this.storage.get('password').then((password) => {
                this.password = password;
            });
        });
        return {username: this.username, password: this.password}
    }

    setHeaders(is_auth = false, username = false, password = false, register = "0") {


        if (username != false) {
            this.username = username;
        }

        if (password != false) {
            this.password = password;
        }

        let myHeaders: Headers = new Headers;

        myHeaders.append('Content-type', 'application/json');
        myHeaders.append('Accept', '*/*');
        myHeaders.append('Access-Control-Allow-Origin', '*');


        if (is_auth == true) {
            myHeaders.append("Authorization", "Basic " + btoa(encodeURIComponent(this.username) + ':' + encodeURIComponent(this.password)));
            /*@encodeURIComponent(this.username)*/
        }
        this.header = new RequestOptions({
            headers: myHeaders
        });
        return this.header;
    }

    setHeaders1(is_auth = false, username = false, password = false) {

        if (username !== false) {
            this.username = username;
        }

        if (password !== false) {
            this.password = password;
        }

        let myHeaders = new HttpHeaders();

        myHeaders = myHeaders.append('Content-type', 'application/json');
        myHeaders = myHeaders.append('Accept', '*/*');
        myHeaders = myHeaders.append('Access-Control-Allow-Origin', '*');

        if (is_auth == true) {
            myHeaders = myHeaders.append("Authorization", "Basic " + btoa(encodeURIComponent(this.username) + ':' + encodeURIComponent(this.password)));
        }
        this.header1 = {
            headers: myHeaders
        };
        return this.header1;
    }

    ngAfterViewInit() {
        this.storage.get('user_id').then((val) => {
            this.storage.get('username').then((username) => {
                this.username = username;
            });
            this.storage.get('password').then((password) => {
                this.password = password;
            });
        });
    }
}

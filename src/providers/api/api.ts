import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import {AlertController, LoadingController, ModalController, Platform, ToastController} from "ionic-angular";
import {DomSanitizer} from "@angular/platform-browser";
import {Geolocation} from "@ionic-native/geolocation";
import {Keyboard} from "@ionic-native/keyboard";

/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class ApiProvider {

  public url: any;
  public header: any = {};
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
  public appVersion: any = 202;
  public isPay: any;
  public myPhotos: any;
  public isBanner: any = false;

  constructor(
    public storage: Storage,
    public alertCtrl: AlertController,
    public http: HttpClient,
    public loadingCtrl: LoadingController,
    private sanitizer: DomSanitizer,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private geolocation: Geolocation,
    public keyboard: Keyboard,
    public plt: Platform
  ) {
    //this.url = 'http://10.0.0.12:8100';
    //this.url = 'http://localhost:8100';
    this.url = 'https://m.richdate.co.il/api/v9';

      this.storage.get('username').then((username) => {
        this.storage.get('password').then((password) => {
          this.password = password;
          this.username = username;
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

  preview(navCtrl, url, component){
    navCtrl.push(component,{user: {userId:0,photos:[{url:url}]}});
  }

  safeHtml(html) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  sendPhoneId(idPhone) {
    if(this.username && this.password) {
      let data = JSON.stringify({deviceId: idPhone});
      let os = (this.plt.is('ios')) ? 'iOS' : 'Android';
      console.log('SEND DEVICE ID: ' + data);
      console.log('OS: ' + os);
      this.http.post(this.url + '/user/deviceId/OS:' + os, data, this.setHeaders(true)).subscribe(data => {
        console.log(JSON.stringify(data));
      }, error => {
        console.log("Error: " + JSON.stringify(error));
      });
    }
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
        this.http.post(this.url + '/user/location', params, this.setHeaders(true)).subscribe(data => {
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

  setHeaders(is_auth = false, username = false, password = false, register = "0") {

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
    this.header = {
      headers: myHeaders
    };
    return this.header;
  }

  ngAfterViewInit() {
    this.storage.get('username').then((username) => {
      this.storage.get('password').then((password) => {
        this.password = password;
        this.username = username;
      });
    });
  }

}

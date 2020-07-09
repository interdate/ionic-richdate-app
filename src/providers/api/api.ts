import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";
import {AlertController, LoadingController, ModalController, Platform, ToastController} from "ionic-angular";
import {DomSanitizer} from "@angular/platform-browser";
import {Geolocation} from "@ionic-native/geolocation";
import {Keyboard} from "@ionic-native/keyboard";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import * as $ from "jquery";
/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class ApiProvider {
  public videoShow: any = false;
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
  public appVersion: any = 203;
  public isPay: any;
  public myPhotos: any;
  public isBanner: any = false;
  public callAlertShow:any = false;
  public videoChat: any = null;
  public videoTimer: any = null;
  public callAlert: any;
  public audioCall: any;
  public audioWait: any;

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
    public plt: Platform,
    public iab: InAppBrowser,
  ) {
    //export JAVA_HOME=`/usr/libexec/java_home -v 1.8.0_221`

    //this.url = 'http://10.0.0.12:8100';
    //this.url = 'http://localhost:8101';
    this.url = 'https://m.richdate.co.il/api/v9';

      this.storage.get('username').then((username) => {
        this.storage.get('password').then((password) => {
          this.password = password;
          this.username = username;
        });
      });

  }

  openVideoChat(param){
    this.storage.get('user_id').then((id) => {
      if(this.callAlert && this.callAlert != null) {
        this.callAlert.dismiss();
        this.callAlert = null;
      }
      this.playAudio('call');

      this.http.post(this.url + '/user/call/' + param.id,{message: 'call', id: param.chatId}, this.setHeaders(true)).subscribe((res:any) => {
        this.stopAudio();
        console.log('init');
        console.log(res);
        if(res.error != '') {
          let toast = this.toastCtrl.create({
            message: res.error,
            showCloseButton: true,
            closeButtonText: 'אישור'
          });

          toast.present();
        } else {
          // /user/call/push/
          if(res.call.sendPush) {
            this.http.post(this.url + '/user/call/push/' + param.id, {}, this.setHeaders(true)).subscribe((data: any) => {

            });
          }
          param.chatId = res.call.msgId;
          $('#close-btn,#video-iframe').remove();
          const closeButton = document.createElement('button');
          closeButton.setAttribute('id', 'close-btn');
          closeButton.style.backgroundColor = 'transparent';
          closeButton.style.margin = '0 10px';
          closeButton.style.width = '40px';
          closeButton.style.height = '40px';
          closeButton.style['font-size'] = '0px';
          closeButton.style['text-align'] = 'center';
          closeButton.style.background = 'url(https://m.richdate.co.il/assets/img/video/buzi_b.png) no-repeat center';
          closeButton.style['background-size'] = '100%';
          closeButton.style.position = 'absolute';
          closeButton.style.bottom = '10px';
          closeButton.style.left = 'calc(50% - 25px)';
          closeButton.style.zIndex = '9999';
          closeButton.onclick = (e) => {
            console.log('close window');
            $('#close-btn,#video-iframe').remove();
            this.http.post(this.url + '/user/call/' + param.id,{message: 'close', id: param.chatId}, this.setHeaders(true)).subscribe((data:any) => {
              // let res = data.json();
            });
            this.videoChat = null;
          };

          this.videoChat = document.createElement('iframe');
          this.videoChat.setAttribute('id', 'video-iframe');
          this.videoChat.setAttribute('src', 'https://m.richdate.co.il/video.html?id='+id+'&to='+param.id);
          this.videoChat.setAttribute('allow','camera; microphone');
          this.videoChat.style.position = 'absolute';
          this.videoChat.style.top = '0';
          this.videoChat.style.left = '0';
          this.videoChat.style.boxSizing = 'border-box';
          this.videoChat.style.width = '100vw';
          this.videoChat.style.height = '101vh';
          this.videoChat.style.backgroundColor = 'transparent';
          this.videoChat.style.zIndex = '999';
          this.videoChat.style['text-align'] = 'center';

          document.body.appendChild(this.videoChat);
          document.body.appendChild(closeButton);
          // this.videoChat = this.iab.create('https://m.richdate.co.il/video.html?id='+id+'&to='+param.id, '_blank', 'location=no;clearcache=yes;zoom=no;hideurlbar=yes;hidenavigationbuttons=yes;footer=no;fullscreen=yes'); // window.open('https://m.richdate.co.il/video.html?id='+id+'&to='+param.id, '_parent', "fullscreen=yes");
          // const that = this;
          // closeButton.onclick = (e) => {
          //   setTimeout(function () {
          //     that.videoChat.close();
          //   }, 10);
          // };
          // this.videoChat.on('loadstop').subscribe(event => {
          //   this.videoChat.executeScript({code: "alert(123);document.body.appendChild(" + closeButton + ");"});
          // });
          // this.videoChat.insertCSS({ code:
          //     "#close-btn{" +
          //       "width:40px;" +
          //       "height:40px;" +
          //       "background:url(https://m.richdate.co.il/assets/img/video/buzi_b.png) no-repeat center;" +
          //       "background-size:100%;" +
          //       "text-align:center;" +
          //       "position:absolute;" +
          //       "bottom:5px;" +
          //       "left:calc(50% - 20px);" +
          //     "}" });


          // setTimeout(function () {
          //   that.videoChat.addEventListener('exit', function(){
          //     //alert('exit');
          //     console.log('close window');
          //     that.http.post(that.url + '/user/call/' + param.id,{message: 'close', id: param.chatId}, that.setHeaders(true)).subscribe((data:any) => {
          //       // let res = data.json();
          //     });
          //     that.videoChat = null;
          //   });
          //
          //
          // },1500);
          if(param.alert == false) {
            this.checkVideoStatus(param);
          }
        }
      }, error => {
        this.stopAudio();
      });


    });
  }

  playAudio(audio) {
    if(this.callAlertShow == false) {
      this.showLoad();
    }
    if(audio == 'call') {
      this.audioCall.play();
      this.audioCall.loop = true;
    } else {
      this.audioWait.play();
      this.audioWait.loop = true;
    }
  }

  stopAudio() {
    this.audioCall.pause();
    this.audioCall.currentTime = 0;
    this.audioWait.pause();
    this.audioWait.currentTime = 0;
    this.hideLoad();
  }

  checkVideoStatus(param){
    console.log('check call');
    console.log(param);
    this.http.get(this.url + '/user/call/status/' + param.chatId, this.setHeaders(true)).subscribe((res: any) => {
      // let res = data.json();
      console.log('check');
      console.log(res);
      this.status = res.status;
      if (res.status == 'answer') {
      }
      if (res.status == 'close' || res.status == 'not_answer') {


        this.stopAudio();
        if (this.videoChat != null || this.callAlert != null) {

          let toast = this.toastCtrl.create({
            message: (this.status == 'not_answer' && this.videoChat && this.videoChat != null) ? ('השיחה עם ' + param.username + ' נדחתה') : 'השיחה הסתיימה',
            showCloseButton: true,
            closeButtonText: 'אישור'
          });
          toast.present();
        }
        if(this.callAlert && this.callAlert != null) {
          this.callAlert.dismiss();
          this.callAlert = null;
        }
        if(this.videoChat && this.videoChat != null) {
          $('#close-btn,#video-iframe').remove();
          this.videoChat = null;
        }
      }

      if (this.videoChat != null || this.callAlert != null) {
        let that = this;
        setTimeout(function () {
          that.checkVideoStatus(param)
        }, 3000);
      }
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
    myHeaders = myHeaders.append('Access-Control-Allow-Credentials', 'true');

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

import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, Platform} from 'ionic-angular';
import {ApiQuery} from '../../library/api-query';
import {Http} from '@angular/http';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import {InAppBrowser} from "@ionic-native/in-app-browser";

/**
 * Generated class for the ActivationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activation',
  templateUrl: 'activation.html',
})
export class ActivationPage {

  form: { errorMessage: any, res: any, description: any, success: any, submit: any, phone: { label: any, value: any }, code: { label: any, value: any } } =
  {
      errorMessage: '',
      res: false,
      description: '',
      success: '',
      submit: false,
      phone: {label: '', value: ''},
      code: {label: '', value: ''}
  };

  os: any;

  constructor(public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              public api: ApiQuery,
              public  platform: Platform,
              public iab: InAppBrowser,
              public http: Http) {
      this.getForm()
  }

  getForm(data = '') {

      let loading = this.loadingCtrl.create({
          content: 'אנא המתן...'
      });

      //window.open('https://www.m.richdate.co.il/activateSMS/?app=1&&app=1', '_system');

      if(this.platform.is('android')) {
          this.os = 'android';
          window.open('https://www.m.richdate.co.il/activateSMS/?app=1&&app=1', '_blank');
      }else{
          this.os = 'iOS';
          this.http.post(this.api.url + '/user/activate', data, this.api.setHeaders(true)).subscribe(resp => {
              /*
               this.form = resp.json().form;
               this.form.res = resp.json().code;
               */
               this.form.errorMessage = resp.json().activation;



              loading.dismiss();
              /*
               if (this.form.res) {
               this.api.status = 'login';
               this.api.setStorageData({label: 'status', value: 'login'});
               //this.navCtrl.push(RegistrationFourPage, {new_user: resp.json().register_end_button});
               this.navCtrl.push(HomePage);
               }*/

          }, err => {
              this.navCtrl.push(LoginPage);
          });
      }
  }

  formSubmit() {
      let params = '';
          params = JSON.stringify({
              code: this.form.code.value
          });

      this.getForm(params);
  }

    ionViewWillEnter() {
        this.api.pageName = 'ActivationPage';
    }

  ionViewDidLoad() {
      console.log('ionViewDidLoad ActivationPage');
  }

}

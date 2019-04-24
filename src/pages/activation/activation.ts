import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
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
              public navParams: NavParams,
              public api: ApiQuery,
              public  platform: Platform,
              public iab: InAppBrowser,
              public http: Http) {
      this.getForm()
  }

  getForm(data = '') {


          this.http.post(this.api.url + '/user/activate', data, this.api.setHeaders(true)).subscribe(resp => {
              /*
               this.form = resp.json().form;
               this.form.res = resp.json().code;
               */
               this.form.errorMessage = resp.json().activation;



              this.api.hideLoad();
              /*
               if (this.form.res) {
               this.api.status = 'login';
               this.api.setStorageData({label: 'status', value: 'login'});
               //this.navCtrl.push(RegistrationFourPage, {new_user: resp.json().register_end_button});
               this.navCtrl.push(HomePage);
               }*/

          }, err => {
              this.api.hideLoad();
              this.navCtrl.push(LoginPage);
          });

  }

  formSubmit() {
      this.api.showLoad();
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

import {Component} from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';
import { LoginPage } from '../login/login';
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {ApiProvider} from "../../providers/api/api";
import {HomePage} from "../home/home";

/**
 * Generated class for the ActivationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
              public api: ApiProvider,
              public  platform: Platform,
              public iab: InAppBrowser) {
      this.getForm()
  }

  getForm(data = '') {


          this.api.http.post(this.api.url + '/user/activate', data, this.api.setHeaders(true)).subscribe((resp: any) => {

               this.form.errorMessage = resp.activation;
               if(!resp.activation && data != '') {
                   this.api.status = 1;
                   this.navCtrl.push(HomePage);
               }

              this.api.hideLoad();
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

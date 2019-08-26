import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import {LoginPage} from "../login/login";
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the FreezeAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-freeze-account',
  templateUrl: 'freeze-account.html',
})
export class FreezeAccountPage {

    public form: any = {text: {value: ''}, description: ''};

    public err: any = {status: '', text: ''};

    allfields = '';

    constructor(
      public navCtrl: NavController,
      private alertCtrl: AlertController,
      public navParams: NavParams,
      public api: ApiProvider
    ) {

    }

    submit() {

        if (this.form.text.value == '') {
            this.allfields = 'יש להכניס סיבה להקפאה';
        } else {
            var params = JSON.stringify({
               'freeze_account_reason': this.form.text.value });
            this.api.http.post(this.api.url + '/freeze', params, this.api.header).subscribe(data => this.validate(data));
        }
    }

    ionViewWillEnter() {
        this.api.pageName = 'FreezeAccountPage';
    }

    validate(response) {
        console.log(response);

        if(response.success) {
            let alert = this.alertCtrl.create({
                title: response.message,
                buttons: ['Ok']
            });
            alert.present();

            this.navCtrl.push(LoginPage, {page: {_id: "logout"}});
        }
    }
}

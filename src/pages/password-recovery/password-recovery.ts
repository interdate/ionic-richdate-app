import {Component} from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the PasswordRecoveryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-password-recovery',
    templateUrl: 'password-recovery.html',
})
export class PasswordRecoveryPage {

    form: { form: any } = {form: {email: { 'value': '', 'label': 'אימייל'}, submit: 'שלח'}};

    email_err: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiProvider,
                public toastCtrl: ToastController) {

    }

    formSubmit() {
        if( this.form.form.email.value != "") {
            this.api.http.get(this.api.url + '/recovery/' + this.form.form.email.value, this.api.header).subscribe(data => this.validate(data));
        }else{
            this.email_err = "כתובת האימייל שהזנת לא נמצאה במערכת";
        }
    }

    validate(response) {

        this.email_err = "";

        if (response.err == true) {
            this.email_err = response.text;

        } else {

            this.form.form.email.value = "";

            const toast = this.toastCtrl.create({
                message: response.text,
                showCloseButton: true,
                closeButtonText: 'אישור'
            });
            toast.present();
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad PasswordRecoveryPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'PasswordRecoveryPage';
    }

}

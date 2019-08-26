import {Component} from "@angular/core";
import {NavController, NavParams} from "ionic-angular";
import * as $ from "jquery";
import {ApiProvider} from "../../providers/api/api";


@Component({
    selector: 'page-admin-messages',
    templateUrl: 'admin-messages.html',
})
export class AdminMessagesPage {

    messages: any;

    user: any;

    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public api: ApiProvider) {

        this.user = navParams.get('user');

        console.log(this.user);

        this.getPage();
        this.setMessagesAsRead()
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad AdminMessagesPage');
    }

    ionViewWillEnter() {
        $('.back-btn').show();
        this.api.pageName = 'AdminMessagesPage';
    }

    ionViewWillLeave() {
        $('.back-btn').hide();
    }

    back() {
        this.api.back = true;
        this.navCtrl.pop();
    }

    getPage() {
        this.api.http.get(this.api.url + '/user/admin-messages', this.api.setHeaders(true)).subscribe((data: any) => {
            this.messages = data.messages;
        }, err => {
            console.log("Oops!");
        });
    }

    setMessagesAsRead(){
        this.api.http.post(this.api.url + '/user/admin-messages-as-read', {}, this.api.header).subscribe(data => {});
    }

}

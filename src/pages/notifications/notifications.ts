import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {DialogPage} from "../dialog/dialog";
import {ArenaPage} from "../arena/arena";
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the NotificationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {
    like: string = 'like';
    tabs: string = this.like;
    bingo: string = 'bingo';
    users: any;
    texts: any;
    data: any;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public api: ApiProvider)
    {
        this.getPage();
    }

    getPage() {
        this.api.http.get(this.api.url+'/user/likes/notifications',this.api.setHeaders(true)).subscribe((data: any) => {

            this.users = data.likesNotifications.items;
            //console.log('USERS: ' + JSON.stringify(this.users));

            this.data = data;

            this.texts = data.texts;
        },err => {
            console.log("Oops!");
        });
    }

    toDialog(user) {
        let user_id = user.userId;
        let bingo = user.bingo;
        this.api.http.post(this.api.url+'/user/notification/'+user.id+'/read',{},this.api.setHeaders(true)).subscribe((data: any) => {

            this.getPage();
            this.users = data.users;
            if( bingo == 1) {
                this.navCtrl.push(DialogPage, {
                    user: {'id': user_id }
                });
            }else {
                this.navCtrl.push(ArenaPage, {
                    user: user_id
                });
            }
        },err => {
            console.log("Oops!");
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad NotificationsPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'NotificationsPage';
    }

}

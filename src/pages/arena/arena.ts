import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, ToastController, Events } from 'ionic-angular';
import {ChangePhotosPage} from "../change-photos/change-photos";
import {ProfilePage} from "../profile/profile";
import {DialogPage} from "../dialog/dialog";
import {NotificationsPage} from "../notifications/notifications";
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the ArenaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
    selector: 'page-arena',
    templateUrl: 'arena.html',
})
export class ArenaPage {

    @ViewChild(Slides) slides: Slides;

    users: any;

    texts: { like: string, add: string, message: string, remove: string, unblock: string, no_results: string  };
    notifications: any;
    checkNotifications: any;

    constructor(public navCtrl: NavController,
                public toastCtrl: ToastController,
                public navParams: NavParams,
                public events: Events,
                public api: ApiProvider) {

        let user_id = 0;


        this.api.showLoad();

        if (navParams.get('user')) {
            user_id = navParams.get('user');
        }

        /*let params = JSON.stringify({
         action: 'arena',
         user_id: user_id
         });*/

        this.api.http.get(api.url + '/users/forLikes/'+user_id+'/0', api.setHeaders(true)).subscribe((data: any) => {
            this.api.hideLoad();
            this.users = data.users.items;
            this.texts = data.texts;


            // If there's message, than user can't be on this page
            if (data.userHasNoMainImage) {
                let toast = this.toastCtrl.create({
                    message: data.arenaStatus,
                    showCloseButton: true,
                    closeButtonText: 'אישור'
                });

                toast.present();
                this.navCtrl.push(ChangePhotosPage);
            }
        });
    }

    setNotifications() {
        this.events.subscribe('user:created', (notifications) => {
            console.log('Welcome', notifications, 'at');
            this.notifications = notifications;
        });
    }

    goToSlide(str) {

        let user = this.users[this.slides.getActiveIndex()];
        let index = this.slides.getActiveIndex();


        if (str == 'like') {

            let params = JSON.stringify({
                toUser: user.id,
            });

            this.api.http.post(this.api.url + '/user/like/' + user.id, params, this.api.setHeaders(true)).subscribe(data => {

            });

            this.users.splice(index, 1);
            this.slides.slideTo(index,1);

        } else {


            if (this.slides.isEnd()) {
                //this.slides.slideNext();
                //var that = this;
                //setTimeout(function () {
                this.slides.slideTo(0,1);
                //this.slides.update();
                //}, 10);
            } else {
                this.slides.slideNext();
            }
        }
    }

    slideChanged(event) {
        if(this.slides.getActiveIndex() == 1){
            console.log(this.users[this.slides.getActiveIndex()]);

            console.log(this.slides.getActiveIndex());
        }
    }

    toDialog() {
        let user = this.users[this.slides.getActiveIndex()];
        this.navCtrl.push(DialogPage, {
            user: user
        });
    }

    toProfile() {
        let user = this.users[this.slides.getActiveIndex()];
        this.navCtrl.push(ProfilePage, {
            user: user
        });
    }

    toNotifications() {
        this.navCtrl.push(NotificationsPage);
    }


    ionViewDidLoad() {
        console.log('ionViewDidLoad ArenaPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'ArenaPage';
    }

    ionViewDidEnter() {
        this.slides.update();
    }

}

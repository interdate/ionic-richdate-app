import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import {DialogPage} from "../dialog/dialog";
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the FullScreenProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-full-screen-profile',
  templateUrl: 'full-screen-profile.html',
})
export class FullScreenProfilePage {

  user:any;
  myId:any;
  defurl:any;

    constructor(
        public toastCtrl:ToastController,
        public navCtrl:NavController,
        public navParams:NavParams,
        public api: ApiProvider
    ) {
        this.user = navParams.get('user');

        this.api.storage.get('user_id').then((val) => {

            if (val) {
                this.myId = val;
            }
        });
    }

    goBack() {
        console.log('test');
        this.navCtrl.pop();
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FullScreenProfilePage');
    }


    toDialog() {
        this.navCtrl.push(DialogPage, {
            user: this.user
        });
    }

    addFavorites() {
        // this.user.isAddFavorite = true;
        let url, message;
        if (this.user.is_in_favorite_list  == true) {
            this.user.is_in_favorite_list  = false;
            url = this.api.url + '/user/favorites/' + this.user.userId+'/delete';
            message = 'has been removed from Favorites';
        } else {
            this.user.is_in_favorite_list  = true;
            url = this.api.url + '/user/favorites/' + this.user.userId;
            message = 'has been added to Favorites';
        }

        let toast = this.toastCtrl.create({
            message: this.user.nickName + ' ' + message,
            duration: 2000
        });

        console.log(url);

        toast.present();

        let params = JSON.stringify({
            list: 'Favorite',
        });

        this.api.http.post( url, params, this.api.setHeaders(true)).subscribe((data: any) => {
            console.log(data);
        });
    }

  addLike() {
      this.user.isAddLike = true;
      let toast = this.toastCtrl.create({
          message: ' עשית לייק ל' + this.user.username,
          duration: 2000
      });

      toast.present();

      let params = JSON.stringify({
          toUser: this.user.id,
      });

      this.api.http.post(this.api.url + '/api/v1/likes/' + this.user.id, params, this.api.setHeaders(true)).subscribe((data: any) => {
          console.log(data);
      }, err => {
          console.log("Oops!");
      });
  }

  ionViewWillEnter() {
      this.api.pageName = 'FullScreenProfilePage';
  }

}

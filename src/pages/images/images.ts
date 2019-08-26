import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {FullScreenProfilePage} from "../full-screen-profile/full-screen-profile";
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the ImagesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-images',
  templateUrl: 'images.html',
})
export class ImagesPage {

  public data: any;
  public title: any = 'תמונות לשליחה';
  public choose: any = [];
  public text: any = '';
  public photos: any = [];
  public click: any = 0;

  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public viewCtrl: ViewController,
      public api: ApiProvider
  ) {
    console.log("construct Images");
    this.photos = this.api.myPhotos.items;
    this.data = this.navParams.get('data');
    if(this.data.chat.texts.images.title != ''){
        this.title = this.data.chat.texts.images.title;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImagesPage');
  }

  close(){
    this.navCtrl.pop();
  }

  send(){
    let message = '';
    this.photos.forEach(function (photo) {
      if(photo.cheked == '1'){
        let src = 'https://m.richdate.co.il/userimg.php?n=' + photo.id;
        message += '<a href="' + src + '" target="_blank"><img src="' + src + '" style="width:45px;margin:5px 2px 0;float:left;" /></a>';
      }
    });

    this.data.message = message;

    this.viewCtrl.dismiss(this.data);
  }

  check(photo){
    this.click++;
    let that = this;
    setTimeout(function () {
      if(that.click == 2){
        that.api.preview(that.navCtrl,photo.url,FullScreenProfilePage);
      }else if(that.click == 1){
        let index = that.photos.indexOf(photo);
        if(that.photos[index].cheked && that.photos[index].cheked == '1'){
          that.photos[index].cheked = '0';
        }else{
          that.photos[index].cheked = '1';
        }
      }else{
        return false;
      }
      //console.log('Click'+ that.click);
      that.click = 0;
    },300);
    //console.log('Click');
  }

  preview(photo){
    this.navCtrl.push(FullScreenProfilePage,{user: {userId:0,photos:[{url:photo.url}]}});
  }

}

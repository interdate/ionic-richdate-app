import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiQuery } from '../../library/api-query';

/**
 * Generated class for the BingoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bingo',
  templateUrl: 'bingo.html',
})
export class BingoPage {

  data: { user: any, texts: any };
  
    constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public api: ApiQuery) {
  
      this.data = navParams.get('data');
      this.data.texts.text2 = this.data.texts.text2.replace('USERNAME',this.data.texts.items[0].nickName);
    }
  
    toDialog() {
      this.data.texts.items[0].user_id = this.data.texts.items[0].userId;
      this.navCtrl.push('DialogPage',{ user: this.data.texts.items[0] });
    }
  
    goBack() {
      this.navCtrl.pop();
    }
  
    ionViewWillEnter() {
      this.api.pageName = 'BingoPage';
    }
  
    ionViewDidLoad() {
      console.log('ionViewDidLoad BingoPage');
    }

}

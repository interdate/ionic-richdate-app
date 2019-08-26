import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the TermsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-terms',
  templateUrl: 'terms.html',
})
export class TermsPage {

  page: { title: any, content: any } = {title: '', content: ''};

      constructor(public navCtrl: NavController,
                  public navParams: NavParams,
                  public api: ApiProvider) {

          let id = navParams.get('id');

          this.api.http.get(api.url + id, this.api.setHeaders(false)).subscribe((data: any) => {
              this.page = data.page;
              console.log(this.page.title);

          }, err => {
              console.log("Oops!");
          });
      }

      back() {
          this.navCtrl.pop();
      }

      ionViewDidLoad() {
          console.log('ionViewDidLoad TermsPage');
      }

      ionViewWillEnter() {
          this.api.pageName = 'TermsPage';
      }

}

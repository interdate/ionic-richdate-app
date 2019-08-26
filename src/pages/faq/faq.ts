import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {ApiProvider} from "../../providers/api/api";

/**
 * Generated class for the FaqPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//import * as $ from "jquery";

@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

    page: any;//Array<{ name: string, faq: string }>;

    hightlightStatus: any = [];

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiProvider) {
        this.getPageData();
    }

    toggleAnswer(){

    }

    getPageData() {
        this.api.http.get(this.api.url + '/faq', this.api.header).subscribe((data: any) => {
            this.page = data;
            console.log(this.page);
        });
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad FaqPage');
    }

    ionViewWillEnter() {
        this.api.pageName = 'FaqPage';
    }

}

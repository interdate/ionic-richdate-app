import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, Platform} from "ionic-angular";
import {ApiQuery} from "../../library/api-query";
import {Http} from "@angular/http";
import {InAppPurchase} from "@ionic-native/in-app-purchase";
import {HomePage} from "../home/home";
import {Page} from "../page/page";
import {InAppBrowser} from "@ionic-native/in-app-browser";

/**
 * Generated class for the SubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {

  public dataPage : any;
  is_showed: any;
  checkStatus: any;
  public platform: any = 'ios';
  products: any = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public http: Http,
              public plt: Platform,
              public iap: InAppPurchase,
              private iab: InAppBrowser,
              public api: ApiQuery) {

    this.getRestore();

    this.getPage();

    /* this.api.storage.get('user_id').then((val) => {
       this.userId = val;

     });*/

    //this.navCtrl.push(HomePage);
  }

  page(pageId) {
    this.navCtrl.push(Page, {pageId: pageId});
  }

  subscribe(product) {

    switch(product.productId){
      case 'richdate.halfMonth':
        var monthsNumber = 0.5;
        break;

      case 'richdate.oneMonth':
        var monthsNumber = 1;
        break;

      case 'richdate.threeMonths':
        var monthsNumber = 3;
        break;

      case 'richdate.sixMonth':
        var monthsNumber = 6;
        break;

      case 'richdate.oneYear':
        var monthsNumber = 12;
        break;
    }
    this.iap
        .subscribe(product.productId)
        .then((data)=> {
          if(parseInt(data.transactionId) > 0){
            this.api.presentToast('Congratulations on your purchase of a paid subscription to richdate.co.il', 10000);
            this.http.post(this.api.url + '/user/subscription/monthsNumber:' + monthsNumber, data, this.api.setHeaders(true)).subscribe(data => {
              this.navCtrl.push(HomePage);
            }, err => {
            });
          }
          this.api.hideLoad();
        })
        .catch((err)=> {
          this.api.hideLoad();
        });
  }

  sendSubscribe(history){
    this.http.post(this.api.url + '/user/restore', JSON.stringify(history), this.api.setHeaders(true)).subscribe(data => {
      if(data.json().payment == 1) {
        this.navCtrl.push(HomePage);
      }
    });
  }

  goto(product){
    let browser = this.iab.create(product.url,'_blank');

    let that = this;

    let checkStatus = setInterval(
        function(){
          if(that.api.status == true) {
            clearInterval(checkStatus);
            setTimeout(
                function () {
                  browser.close();
                }, 12000
            )
          }
        }, 3000);
  }

  getRestore(){
    var that = this;
    this.iap.restorePurchases().then(function (data) {
      //this.restore = data;
      console.log(data);
      /*
       [{
       transactionId: ...
       productId: ...
       state: ...
       date: ...
       }]
       */

      var purchase = {};

      var timestemp = 0;

      for (var id in data) {

        var dateProd = new Date(data[id].date).getTime();

        if(dateProd > timestemp){

          timestemp = dateProd;

          purchase = data[id];
        }
      }

      that.sendSubscribe(purchase);
    }).catch(function (err) {
    });
  }

  getPage() {

    this.api.showLoad();

    this.http.get(this.api.url + '/user/subscriptions', this.api.setHeaders(true)).subscribe(data => {

      this.products = data.json().subscription.payments;
      this.dataPage = data.json().subscription;


      if (this.plt.is('android')) {

        this.platform = 'android';

        /*this.http.get(this.api.url + '/subscription', this.api.setHeaders(true)).subscribe(data => {

         this.dataPage = data.json();
         }, err => {
         //alert(JSON.stringify(err));
         });*/
        this.api.hideLoad();

      }else{


        this.products = ['richdate.halfMonth','richdate.oneMonth', 'richdate.threeMonths','richdate.sixMonth', 'richdate.oneYear'];


        this.iap
            .getProducts(['richdate.halfMonth','richdate.oneMonth', 'richdate.threeMonths','richdate.sixMonth', 'richdate.oneYear'])
            .then((products) => {
              products.forEach(product => {

                if(product.productId == 'richdate.halfMonth'){
                  product.id = 0;
                  product.title = 'מנוי שבועי מתחדש בריצ׳דייט';
                  product.description = 'מנוי מתחדש כל שבוע המאפשר לך לקרוא הודעות ללא הגבלה';
                }
                if(product.productId == 'richdate.oneMonth'){
                  product.id = 1;
                  product.title = 'מנוי חודשי מתחדש בריצ׳דייט';
                  product.description = 'מנוי מתחדש כל חודש המאפשר לך לקרוא הודעות ללא הגבלה';
                }
                if(product.productId == 'richdate.threeMonths'){
                  product.id = 2;
                  product.title = 'מנוי תלת חודשי מתחדש בריצ׳דייט';
                  product.description = 'מנוי מתחדש כל 3 חודשים המאפשר לך לקרוא הודעות ללא הגבלה';
                }
                if(product.productId == 'richdate.sixMonth'){
                  product.id = 3;
                  product.title = 'מנוי חצי שנתי מתחדש בריצ׳דייט';
                  product.description = 'מנוי מתחדש כל 6 חודשים המאפשר לך לקרוא הודעות ללא הגבלה';
                }
                if(product.productId == 'richdate.oneYear'){
                  product.id = 4;
                  product.title = 'מנוי שנתי מתחדש בריצ׳דייט';
                  product.description = 'מנוי מתחדש כל שנה המאפשר לך לקרוא הודעות ללא הגבלה';
                }

                this.products[product.id] = product;
              });

              //this.products = products;
            })
            .catch((err) => {
            });

        this.api.hideLoad();

      }

    });



  }

  ionViewDidLoad() {
    this.api.pageName = 'SubscriptionPage';
    console.log('ionViewDidLoad SubscriptionPage');
  }

}

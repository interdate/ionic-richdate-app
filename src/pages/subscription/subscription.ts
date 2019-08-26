import {Component, ViewChild} from "@angular/core";
import {Content, NavController, NavParams, Platform} from "ionic-angular";
import {InAppPurchase} from "@ionic-native/in-app-purchase";
import {Page} from "../page/page";
import {InAppBrowser} from "@ionic-native/in-app-browser";

/**
 * Generated class for the SubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
import * as $ from 'jquery';
import {ApiProvider} from "../../providers/api/api";
import {HomePage} from "../home/home";

@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {
  @ViewChild(Content) content: Content;

  public dataPage : any;
  is_showed: any;
  checkStatus: any;
  public platform: any = 'ios';
  products: any = [];
  public coupon: any;
  public chooseProduct: any;
  public call: any = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public plt: Platform,
              public iap: InAppPurchase,
              private iab: InAppBrowser,
              public api: ApiProvider) {

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
    let monthsNumber;
    switch(product.productId){
      case 'richdate.halfMonth':
        monthsNumber = 0.5;
        break;

      case 'richdate.oneMonth':
        monthsNumber = 1;
        break;

      case 'richdate.threeMonths':
        monthsNumber = 3;
        break;

      case 'richdate.sixMonth':
        monthsNumber = 6;
        break;

      case 'richdate.oneYear':
        monthsNumber = 12;
        break;
    }
    this.iap
        .subscribe(product.productId)
        .then((data)=> {
          if(parseInt(data.transactionId) > 0){
            this.api.presentToast('Congratulations on your purchase of a paid subscription to richdate.co.il', 10000);
            this.api.http.post(this.api.url + '/user/subscription/monthsNumber:' + monthsNumber, data, this.api.setHeaders(true)).subscribe(
              (data: any) => {
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
    this.api.http.post(this.api.url + '/user/restore', JSON.stringify(history), this.api.setHeaders(true)).subscribe((data: any) => {
      if(data.payment == 1) {
        this.navCtrl.push(HomePage);
      }
    });
  }

  chooseVip(product){
    if(!product.urlVip || product.urlVip == '') {
      this.goto(product, false);
    }else {
      this.chooseProduct = product;
      this.content.scrollToTop(300);
    }
  }

  goto(product, vip = false){
    delete this.chooseProduct;
    this.content.scrollToTop(300);
    let payUrl = (vip) ? product.urlVip : product.url;
    let browser = this.iab.create(payUrl,'_blank');

    let that = this;

    let checkStatus = setInterval(
        function(){
          console.log('Payment status: ' + that.api.isPay);
          that.api.http.post(that.api.url + '/user/login/', '', that.api.setHeaders(true)).subscribe((data: any) => {
            if(data.isPay == '1') {
              that.api.isPay = data.isPay;
              clearInterval(checkStatus);
              setTimeout(
                  function () {
                    $('ion-header .logo').click();
                    //that.navCtrl.push(HomePage);
                    browser.close();
                  }, 3000
              )
            }

          }, err => {
            console.log(err);

          });


        }, 2000);

  }

  backChoose(){
      delete this.chooseProduct;
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
    this.call++;
    this.api.showLoad();
    let coupon = !this.coupon ? '0' : this.coupon;
    this.coupon = '';
    this.api.http.get(this.api.url + '/user/subscriptions/' + coupon, this.api.setHeaders(true)).subscribe((data:any) => {

      delete this.chooseProduct;
      this.products = data.subscription.payments;
      this.dataPage = data.subscription;


      if (this.plt.is('android')) {

        this.platform = 'android';

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

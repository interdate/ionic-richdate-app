import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams} from "ionic-angular";
import {ApiQuery} from "../../library/api-query";
import {Http} from "@angular/http";

/**
 * Generated class for the InboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-inbox',
    templateUrl: 'inbox.html',
})
export class InboxPage {

    chatWith: any;
    userIndex : any;
    user: any;
    params = { results : { per_page: 20, current_page: 1, loader: true} , userIndex : 0 };
    users: Array<{ id: string, message: string, mainImage: string, nickName: string, newMessagesNumber: string, faceWebPath: string, noPhoto: string }>;
    texts: { no_results: string };
    loadMoreResults: any = true;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public http: Http,
                public api: ApiQuery) {

        this.api.showLoad();

        this.http.get(this.api.url + '/user/contacts/perPage:'+this.params.results.per_page+'/page:'+ this.params.results.current_page, this.api.setHeaders(true)).subscribe(data => {
            this.users = data.json().allChats;
            this.api.hideLoad();
        });
    }

    doInfinite(infiniteScroll) {
        console.log('Begin async operation');

        let that = this;

        //setTimeout(() => {
        if (that.params.results.loader) {
            ++that.params.results.current_page;
            if(that.loadMoreResults) {
                that.loadMoreResults = false;
                that.http.get(that.api.url + '/user/contacts/perPage:' + this.params.results.per_page + '/page:' + that.params.results.current_page, that.api.setHeaders(true)).subscribe(data => {
                    that.loadMoreResults = true;
                    for (let item of data.json().allChats) {
                        that.users.push(item);
                    }

                    if (data.json().allChats.length < this.params.results.per_page) {
                        that.params.results.loader = false;
                    }
                });
            }
            console.log('Async operation has ended');
            infiniteScroll.complete();
            //}, 500);
        }
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad InboxPage');
    }

    ionViewWillEnter() {
        if(this.chatWith){
            if(this.chatWith.user.userId == 0){
                this.users.slice(this.userIndex,1);
            }else {
                this.http.get(this.api.url + '/user/inbox/' + this.chatWith.user.userId, this.api.setHeaders(true)).subscribe(data => {
                    if (data.json().res) {
                        this.users[this.userIndex] = data.json().res;
                    } else {
                        this.users.slice(this.userIndex, 1);
                    }
                });
            }
        }

        this.api.pageName = 'InboxPage';
    }

    toDialogPage(user, index) {
        this.chatWith = user;
        this.userIndex = index;
        this.navCtrl.push('DialogPage', {user: user.user});
    }

}

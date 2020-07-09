import {Component, ViewChild} from "@angular/core";
import {ActionSheetController, Content, NavController, NavParams, Platform} from "ionic-angular";
import * as $ from "jquery";
import {Page} from "../page/page";
import {SelectPage} from "../select/select";
import {ChangePhotosPage} from "../change-photos/change-photos";
import {ApiProvider} from "../../providers/api/api";
import {HomePage} from "../home/home";

@Component({
    selector: 'page-register',
    templateUrl: 'register.html',
})
export class RegisterPage {
    @ViewChild(Content) content: Content;
    login: any = false;
    user: any = { register: false };
    form: any = {fields: []};
    errors: any;
    activePhoto: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public api: ApiProvider,
                public platform: Platform,
                public actionSheetCtrl: ActionSheetController) {
        api.storage.get('status').then((val) => {
            this.login = val;
            this.user = this.navParams.get('user');
            this.sendForm();
        });
    }

    getStep(step): void {
        this.user.step = step;
        this.sendForm();
    }

    sendForm() {
        this.api.showLoad();
        let header = this.api.setHeaders(this.login ? true : false);
        //if (typeof this.user != 'undefined') {
        this.form.fields.forEach(field => {

            if (field.type == 'selects') {
                field.sel.forEach(select => {
                    // this.user[select.name] = $('#' + select.name).val();
                    console.log(select);
                    console.log(this.user[field.name]);
                });
            }
        });
        //}


        this.api.http.post(this.api.url + '/user/register', this.user, header).subscribe(
          (data: any) => {

                //this.form = {};
                $('#labelconfirmMails').remove();
                this.form = data.form;
                this.user = data.user;

                this.errors = data.errors;

                if (this.user.step == 4) {
                    this.api.setHeaders(true, this.user.userNick, this.user.userPass);
                    this.login = 'login';
                    this.api.storage.set('userdata', {
                        username: this.user.userNick,
                        password: this.user.userPass,
                        user_id: this.user.userId,
                        status: 'login',
                        user_photo: 'https://www.shedate.co.il/images/users/small/0.jpg'
                    });
                    this.api.storage.set('status', 'login');
                    this.api.storage.set('user_id', this.user.userId);
                    this.api.storage.set('username', this.user.userNick);
                    this.api.storage.set('password', this.user.userPass);
                    let data = {
                        status: 'init',
                        username: this.user.userNick,
                        password: this.user.userPass
                    };
                    this.api.storage.set('fingerAuth', data);
                    //alert(JSON.stringify(this.user.photos));
                    let that = this;
                    setTimeout(function () {
                        that.api.hideLoad();
                    }, 1500);
                    this.api.storage.get('deviceToken').then((val) => {
                        this.api.sendPhoneId(val);
                    });
                    this.navCtrl.push(ChangePhotosPage, {});

                } else {
                    this.api.hideLoad();

                    if (this.user.step == 2 && !this.user.register) {
                        this.api.storage.set('username', this.user.userNick);
                        this.api.setHeaders(true, this.user.userNick);
                    } else if (this.user.step == 2 && this.user.register) {
                        this.api.storage.set('new_user', true);
                    }

                    this.content.scrollToTop(300);
                }
            }, err => {
                this.errors = err._body;
                this.api.hideLoad();
            }
        );
    }


    openSelect(field, index) {
        if(typeof field == 'undefined'){
            field = false;
        }

        let profileModal = this.api.modalCtrl.create(SelectPage, {data: field});
        profileModal.present();

        profileModal.onDidDismiss(data => {

            if (data) {
                let choosedVal = data.val.toString();
                this.user[field.name] = choosedVal;
                if(field.name.indexOf('userBirthday') == -1) {
                    this.form.fields[index]['valLabel'] = data.label.toString();
                    if(this.form.fields[index]['name'] == 'userCity'){
                        this.form.fields[index]['valLabel'] = data.label.toString();
                        this.form.fields[index]['val'] = data.label.toString();
                        this.user.userCity = data.label.toString();

                    }else{
                        this.form.fields[index]['valLabel'] = data.label.toString();
                        this.form.fields[index]['val'] = choosedVal;
                    }

                }else{
                    for(let i=0; i<3; i++){
                        if(field.name == this.form.fields[index]['sel'][i].name){
                            this.form.fields[index]['sel'][i]['valLabel'] = data.label;
                        }
                    }
                }
            }

            if(this.form.fields[index]['name'] == 'userGender' && this.form.fields[4].val == 1){
                this.form.fields[6].label = '*מספר טלפון';
                $(".tip.userPhone").show();
            }else if(this.form.fields[index]['name'] == 'userGender' && this.form.fields[4].val == 0){
                this.form.fields[6].label = 'מספר טלפון';
                $(".tip.userPhone").show();
            }
        });
    }

    stepBack() {
        this.user.step = this.user.step - 2;
        this.sendForm();
    }

    setHtml(id, html) {
        if ($('#' + id).html() == '' && html != '') {
            let div: any = document.createElement('div');
            div.innerHTML = html;
            [].forEach.call(div.getElementsByTagName("a"), (a) => {
                var pageHref = a.getAttribute('onclick');
                if (pageHref) {
                    a.removeAttribute('onclick');
                    a.onclick = () => this.getPage(pageHref);
                }
            });
            $('#' + id).append(div);
        }
    }

    getPage(pageId) {
        this.navCtrl.push(Page, {pageId: pageId});
    }

    ionViewWillEnter() {
        this.api.pageName = 'RegisterPage';


        //this.api.activePageName = 'ContactPage';
        $('#back').show();
        this.api.storage.get('status').then((val) => {
            this.login = val;
            if (val != 'login') {
                $('.footerMenu').hide();
            }
        });

        setTimeout(function () {
            if ($('div').hasClass('footerMenu')) {
            } else {
                $('#register .fixed-content,#register .scroll-content').css({'margin-bottom': '0'});
            }
        }, 100);

    }

    ionViewWillLeave() {
        $('#contact').removeAttr('style');
        if (this.login == 'login') {
            $('.mo-logo').click();
        }

    }

    inputClick(id) {

        let that = this;
        that.content.resize();
        setTimeout(function () {
            that.content.scrollTo(600, 0, 300);
            $('#' + id).focus();
        }, 400);

    }

    goToHome() {
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    }


}

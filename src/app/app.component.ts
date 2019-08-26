import {Component, ViewChild} from "@angular/core";
import {
    Platform,
    MenuController,
    Nav,
    ViewController,
    ToastController,
    Content,
    AlertController,
    Events
} from "ionic-angular";
import {Market} from "@ionic-native/market";
import {Push, PushObject, PushOptions} from "@ionic-native/push";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {LoginPage} from "../pages/login/login";
import {RegisterPage} from "../pages/register/register";
import {ChangePhotosPage} from "../pages/change-photos/change-photos";
import {SettingsPage} from "../pages/settings/settings";
import {InboxPage} from "../pages/inbox/inbox";
import {SubscriptionPage} from "../pages/subscription/subscription";
import {ProfilePage} from "../pages/profile/profile";
import {ActivationPage} from "../pages/activation/activation";


import * as $ from "jquery";
import {DialogPage} from "../pages/dialog/dialog";
import {PasswordRecoveryPage} from "../pages/password-recovery/password-recovery";
import {ContactUsPage} from "../pages/contact-us/contact-us";
import {ArenaPage} from "../pages/arena/arena";
import {NotificationsPage} from "../pages/notifications/notifications";
import {SearchPage} from "../pages/search/search";
import {ChangePasswordPage} from "../pages/change-password/change-password";
import {FreezeAccountPage} from "../pages/freeze-account/freeze-account";
import {BingoPage} from "../pages/bingo/bingo";
import {ApiProvider} from "../providers/api/api";
import {HomePage} from "../pages/home/home";

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    //rootPage:any = LoginPage;

    @ViewChild(Nav) nav: Nav;
    @ViewChild(ViewController) viewCtrl: ViewController;
    @ViewChild(Content) content: Content;

    // make HelloIonicPage the root (or first) page
    rootPage: any;// = HomePage;
    //rootPage = LoginPage;
    banner: {src: string; link: string};
    menu_items_logout: any;//Array<{_id: string, icon: string, title: string, count: any, component: any}>;
    menu_items_login: any;//Array<{_id: string, icon: string, title: string, count: any, component: any}>;
    menu_items: any;//Array<{_id: string, icon: string, title: string, count: any, component: any}>;
    menu_items_settings: any;//Array<{_id: string, icon: string, title: string, count: any, component: any}>;
    menu_items_contacts: any;//Array<{_id: string, list: string, icon: string, title: string, count: any, component: any}>;
    menu_items_footer1: any;//Array<{_id: string, src_img: string, list: string, icon: string, count: any, title: string, component: any}>;
    menu_items_footer2: any;//Array<{_id: string, src_img: string, list: string, icon: string, title: string, count: any, component: any}>;
    ajaxInterval: any;
    activeMenu: string;
    back: string;
    is_login: any = false;
    status: any = '';
    texts: any = {};
    new_message: any = '';
    message: any = {};
    avatar: string = '';
    is2D: any;
    stats: string = '';
    interval: any = true;
    push2: PushObject;

    constructor(public platform: Platform,
                public menu: MenuController,
                public splashScreen: SplashScreen,
                public statusBar: StatusBar,
                public api: ApiProvider,
                public toastCtrl: ToastController,
                public alertCtrl: AlertController,
                public events: Events,
                public market: Market,
                public push: Push) {

        this.closeMsg();
        var that = this;

        //alert(this.api.pageName);

        this.ajaxInterval = setInterval(function () {
            //let page = that.nav.getActive();

            if (!(that.api.pageName == 'LoginPage') && that.api.username != false && that.api.username != null) {
                that.getBingo();
                // New Message Notification
                //that.checkStatus();
                //that.getMessage();
                that.getStatistics();
            }
        }, 10000);

        this.initializeApp();
        this.getMenu();

        console.log("Constructor App");
        this.getAppVersion();
    }

    getMenu(){
      this.api.http.get(this.api.url + '/user/menu/', this.api.setHeaders()).subscribe((data: any) => {
        //data = data.json();
        let menu = data.menu;
        this.api.resultsPerPage = data.resultsPerPage;
        this.initMenuItems(menu);

        this.api.storage.get('user_id').then((val) => {

          this.initPushNotification();
          if (!val) {
            this.rootPage = LoginPage;
            this.menu_items = this.menu_items_logout;
          } else {
            this.menu_items = this.menu_items_login;
            this.getBingo();
            this.rootPage = HomePage;
          }
          this.menu1Active(false);
        });
      },error => {
        //alert(JSON.stringify(error));
        this.reload()
      });
    }

    reload(){
      //this.splashScreen.show();
      //window.location.reload();

      //this.splashScreen.show();
// Reload original app url (ie your index.html file)
      this.platform.exitApp();
      //window.location.href = 'market://details?id=com.interdate.richdate';
      //window.open('market://details?id=com.interdate.richdate', '_system');
      //window.location.href = 'richdate:///';
      //richdate://
      //this.splashScreen.hide();
      //this.nav.remove(index);
    }

    getAppVersion() {
        console.log("Version App");
        this.api.http.get(this.api.url + '/app/version', this.api.header).subscribe((data: any) => {

            console.log(data);

            if (parseInt(data.android.version) > parseInt(this.api.appVersion)) {
                let prompt = this.alertCtrl.create({
                    title: data.title,
                    message: data.message,
                    cssClass: 'new-version',
                    buttons: [
                        {
                            text: data.cancel,
                            handler: res => {
                                console.log('Cancel clicked');
                                if(data.android.update == '1'){
                                    this.getAppVersion();
                                }
                            }
                        },
                        {
                            text: data.update,
                            handler: res1 => {
                                window.open(data.android.url, '_system');
                                if(data.android.update == '1'){
                                    this.getAppVersion();
                                }
                            }
                        }
                    ]
                });
                prompt.present();
            }


        }, (err : any) => {
            console.log('Error version');
            console.log(err);
            this.api.hideLoad();

        });
    }

    closeMsg() {
        this.new_message = '';
    }

    goBack() {
        this.nav.pop();
    }

    getStatistics() {

        this.api.storage.get('user_id').then((id) => {
            if (id) {
                //let page = this.nav.getActive();
                let headers = this.api.setHeaders(true);
                // if (this.api.pageName == 'ChangePhotosPage') {
                //     headers = this.api.setHeaders(true, false, false, '1');
                // }

                this.api.http.get(this.api.url + '/user/statistics/', headers).subscribe((data: any) => {

                    let statistics = data.statistics;
                    if(typeof statistics != 'undefined') {
                        //this.status = data.status;
                        this.api.status = data.status;

                        this.menu_items_login.push();
                        if (typeof statistics.newNotificationsNumber != 'undefined') {
                            this.menu_items[2].count = statistics.newNotificationsNumber;
                        }
                        this.menu_items[0].count = statistics.newMessagesNumber;

                        // Contacts Sidebar Menu
                        this.menu_items_contacts[0].count = statistics.looked;//viewed
                        this.menu_items_contacts[1].count = statistics.lookedme;//viewedMe
                        this.menu_items_contacts[2].count = statistics.contacted;//connected
                        this.menu_items_contacts[3].count = statistics.contactedme;//connectedMe
                        this.menu_items_contacts[4].count = statistics.fav;//favorited
                        this.menu_items_contacts[5].count = statistics.favedme;//favoritedMe
                        this.menu_items_contacts[6].count = statistics.black;//blacklisted
                        //Footer Menu
                        this.menu_items_footer2[2].count = statistics.newNotificationsNumber;

                        //this.menu_items_footer2[2].count = 0;
                        this.menu_items_footer1[3].count = statistics.newMessagesNumber;
                        if(typeof this.push2 != 'undefined') {
                          this.push2.setApplicationIconBadgeNumber(statistics.newMessagesNumber);
                        }
                        this.menu_items_footer2[0].count = statistics.fav;//favorited
                        this.menu_items_footer2[1].count = statistics.favedme;//favoritedMe

                        this.is2D = data.is2D;
                        this.api.isPay = data.isPay;

                        if (this.api.pageName != 'LoginPage' && this.api.pageName != 'SubscriptionPage' && this.api.pageName != 'ContactUsPage' && this.api.pageName != 'PagePage' && this.api.isPay == 0 && this.is2D == 0) {
                            //this.status = 1;
                            this.nav.setRoot(SubscriptionPage);
                        } else if (this.api.pageName != 'ChangePhotosPage' && this.api.status === 'noimg') {
                            //this.status = 1;
                            let toast = this.toastCtrl.create({
                                message: "לכניסה לאתר ריצ'דייט יש להעלות תמונה",
                                duration: 3000
                            });

                            toast.present();
                            this.nav.setRoot(ChangePhotosPage);
                        } else if (this.api.pageName != 'ChangePhotosPage' && this.api.pageName != 'ActivationPage' && this.api.status === 'notActivated') {
                            //this.status = 1;
                            this.nav.setRoot(ActivationPage);
                        }

                        if (this.api.pageName == 'ActivationPage' && this.api.status != 'notActivated') {
                            this.nav.setRoot(HomePage);
                        }

                        //
                        if ((this.api.pageName == 'SubscriptionPage' && this.api.isPay == 1)) {
                            this.nav.setRoot(HomePage);
                        }

                    }
                }, err => {
                    //console.log('Statistics Error');
                    this.api.hideLoad();
                    if (err.status == 403) {

                        this.api.setHeaders(false, null, null);
                        // Removing data storage
                        this.api.storage.remove('status');
                        this.api.storage.remove('password');
                        this.api.storage.remove('user_id');
                        this.api.storage.remove('user_photo');
                        this.nav.setRoot(LoginPage, {error: err['_body']});
                        this.nav.popToRoot();
                    }

                    //this.nav.push(this.rootPage);
                    //this.clearLocalStorage(); //*********************************** put a message *************************
                });
            }
        });

        this.getMessage();
    }


    clearLocalStorage() {
        //this.api.setHeadersfalse, null, null);
        this.api.setHeaders(false, null, null);
        // Removing data storage
        this.api.storage.remove('status');
        this.api.storage.remove('password');
        this.api.storage.remove('user_id');
        this.api.storage.remove('user_photo');

        this.nav.push(LoginPage);
    }

    initMenuItems(menu) {

        this.back = menu.back;

        this.stats = menu.stats;

        this.menu_items_logout = [
            {_id: '', icon: 'log-in', title: menu.login, component: LoginPage, count: ''},
            {_id: 'blocked', icon: '', title: menu.forgot_password, component: PasswordRecoveryPage, count: ''},
            {_id: '', icon: 'mail', title: menu.contact_us, component: ContactUsPage, count: ''},
            {_id: '', icon: 'person-add', title: menu.join_free, component: RegisterPage, count: ''},
        ];

        this.menu_items = [
            {_id: 'inbox', icon: '', title: menu.inbox, component: InboxPage, count: ''},
            {_id: 'the_area', icon: '', title: menu.the_arena, component: ArenaPage, count: ''},
            {_id: 'notifications', icon: '', title: menu.notifications, component: NotificationsPage, count: ''},
            {_id: 'stats', icon: 'stats', title: menu.contacts, component: ProfilePage, count: ''},
            {_id: 'search', icon: '', title: menu.search, component: SearchPage, count: ''},
            /* {_id: '', icon: 'information-circle', title: 'שאלות נפוצות', component: 'FaqPage', count: ''},*/
        ];

        this.menu_items_login = [
            {_id: 'inbox', icon: '', title: menu.inbox, component: InboxPage, count: ''},
            {_id: 'the_area', icon: '', title: menu.the_arena, component: ArenaPage, count: ''},
            {_id: 'notifications', icon: '', title: menu.notifications, component: NotificationsPage, count: ''},
            {_id: 'stats', icon: 'stats', title: menu.contacts, component: ProfilePage, count: ''},
            {_id: 'search', icon: '', title: menu.search, component: SearchPage, count: ''},
            /*
             {_id: '', icon: 'information-circle', title: 'שאלות נפוצות', component: 'FaqPage', count: ''},
             */
            {_id: '', icon: 'mail', title: menu.contact_us, component: ContactUsPage, count: ''},
            {_id: 'subscribe', icon: 'ribbon', title: 'רכישת מנוי', component: SubscriptionPage, count: ''},


        ];

        this.menu_items_settings = [
            {_id: 'edit_profile', icon: '', title: menu.edit_profile, component: RegisterPage, count: ''},
            {_id: 'edit_photos', icon: '', title: menu.edit_photos, component: ChangePhotosPage, count: ''},
            {_id: '', icon: 'person', title: menu.view_my_profile, component: ProfilePage, count: ''},
            {_id: 'change_password', icon: '', title: menu.change_password, component: ChangePasswordPage, count: ''},
            {_id: 'freeze_account', icon: '', title: menu.freeze_account, component: FreezeAccountPage, count: ''},
            {_id: 'settings', icon: '', title: menu.settings, component: SettingsPage, count: ''},
            {_id: '', icon: 'mail', title: menu.contact_us, component: ContactUsPage, count: ''},
            {_id: 'logout', icon: 'log-out', title: menu.log_out, component: LoginPage, count: ''}
        ];


        this.menu_items_contacts = [
            {_id: 'viewed', icon: '', title: menu.viewed, component: HomePage, list: 'looked', count: ''},
            {
                _id: 'viewed_me',
                icon: '',
                title: menu.viewed_me,
                component: HomePage,
                list: 'lookedMe',
                count: ''
            },
            {
                _id: 'contacted',
                icon: '',
                title: menu.contacted,
                component: HomePage,
                list: 'contacted',
                count: ''
            },
            {
                _id: 'contacted_me',
                icon: '',
                title: menu.contacted_me,
                component: HomePage,
                list: 'contactedMe',
                count: ''
            },
            {
                _id: 'favorited',
                icon: '',
                title: menu.favorited,
                component: HomePage,
                list: 'fav',
                count: ''
            },
            {
                _id: 'favorited_me',
                icon: '',
                title: menu.favorited_me,
                component: HomePage,
                list: 'favedMe',
                count: ''
            },
            {_id: 'blocked', icon: '', title: menu.blocked, component: HomePage, list: 'black', count: ''}
        ];

        this.menu_items_footer1 = [
            {
                _id: 'online',
                src_img: 'assets/img/icons/online.png',
                icon: '',
                list: 'online',
                title: menu.online,
                component: HomePage,
                count: ''
            },
            {
                _id: 'viewed',
                src_img: 'assets/img/icons/new-arena.png',
                icon: '',
                list: 'viewed',
                title: menu.the_arena,
                component: ArenaPage,
                count: ''
            },
            {
                _id: 'near-me',
                src_img: '',
                title: 'קרובים אליי',
                list: 'distance',
                icon: 'pin',
                component: HomePage,
                count: ''
            },
            {
                _id: 'inbox',
                src_img: 'assets/img/icons/inbox.png',
                icon: '',
                list: '',
                title: menu.inbox,
                component: InboxPage,
                count: ''
            },
        ];

        this.menu_items_footer2 = [
            {
                _id: '',
                src_img: 'assets/img/icons/favorited.png',
                icon: '',
                list: 'fav',
                title: menu.favorited,
                component: HomePage,
                count: ''
            },
            {
                _id: '',
                src_img: 'assets/img/icons/favorited_me.png',
                icon: '',
                list: 'favedMe',
                title: menu.favorited_me,
                component: HomePage,
                count: ''
            },
            {
                _id: 'notifications',
                src_img: 'assets/img/icons/notifications_ft.png',
                list: '',
                icon: '',
                title: menu.notifications,
                component: NotificationsPage,
                count: ''
            },
            {
                _id: '',
                src_img: 'assets/img/icons/search.png',
                icon: '',
                title: menu.search,
                list: '',
                component: SearchPage,
                count: ''
            },
        ];
    }

    menu1Active(bool = true) {
        this.activeMenu = 'menu1';
        this.menu.enable(true, 'menu1');
        this.menu.enable(false, 'menu2');
        this.menu.enable(false, 'menu3');
        if (bool) {
            this.menu.toggle();
        }
    }


    menu2Active() {
        this.activeMenu = 'menu2';
        this.menu.enable(false, 'menu1');
        this.menu.enable(true, 'menu2');
        this.menu.enable(false, 'menu3');
        this.menu.open();
    }


    menu3Active() {
        this.activeMenu = 'menu3';
        this.menu.enable(false, 'menu1');
        this.menu.enable(false, 'menu2');
        this.menu.enable(true, 'menu3');
        this.menu.toggle();
    }


    menuCloseAll() {
        if (this.activeMenu != 'menu1') {
            this.menu.toggle();
            this.activeMenu = 'menu1';
            this.menu.enable(true, 'menu1');
            this.menu.enable(false, 'menu2');
            this.menu.enable(false, 'menu3');
            this.menu.close();
            //this.menu.toggle();
        }
    }

    initializeApp() {
        this.platform.ready().then((readySource) => {
            if(readySource == 'cordova') {
                // Okay, so the platform is ready and our plugins are available.
                // Here you can do any higher level native things you might need
                this.statusBar.show();
                this.statusBar.styleBlackOpaque();
                this.statusBar.backgroundColorByName('black');

                /*setTimeout(function () {
                 this.splashScreen.hide();
                 },1000);*/
            }
        });
    }

    initPushNotification() {
        if (!this.platform.is('cordova')) {
            console.log("Push notifications not initialized. Cordova is not available - Run in physical device");
            return;
        }

        const options: PushOptions = {
            android: {},
            ios: {
                alert: 'true',
                badge: true,
                sound: 'false'
            },
            windows: {},
            browser: {
                pushServiceURL: 'http://push.api.phonegap.com/v1/push'
            }
        };

        this.push2 = this.push.init(options);

        this.push2.on('registration').subscribe((data) => {
            //this.deviceToken = data.registrationId;
            this.api.storage.set('deviceToken', data.registrationId);
            this.api.sendPhoneId(data.registrationId);
            //TODO - send device token to server
            console.log('device token' + data.registrationId);
        });

        this.push2.on('notification').subscribe((data) => {
            //let self = this;
            //if user using app and push notification comes
                // this.api.storage.get('user_id').then((val) => {
                //     if (val) {
                //
                //         this.nav.push('InboxPage');
                //     } else {
                //         this.nav.push('LoginPage');
                //     }
                // });


            this.api.storage.get('user_id').then((val) => {
                console.log("NOTICE: " + JSON.stringify(data) + ' ' + val);
                if (val) {
                    if(data.additionalData.foreground == false){
                        this.openPushMessage(data);
                    }else{
                        if(this.api.pageName != 'DialogPage' && data.additionalData.onlyInBackgroundMode == '0') {
                            let alert = this.alertCtrl.create({
                                title: data.additionalData.titleMess,
                                message: data.message,
                                buttons: [
                                    {
                                        text: data.additionalData.buttons[0],
                                        role: 'cancel',
                                        handler: () => {
                                            console.log('Cancel clicked');
                                        }
                                    },
                                    {
                                      text: data.additionalData.buttons[1],
                                      handler: () => {
                                          this.openPushMessage(data)
                                      }
                                    }
                                ]
                            });
                            alert.present();
                        }
                    }
                } else {
                    this.nav.push(LoginPage);
                }
            });
        });
    }

    openPushMessage(dataOpen){
        console.log(JSON.stringify(dataOpen));

        if(typeof dataOpen.additionalData.urlRedirect == 'undefined'){
            //alert(typeof dataOpen.additionalData.userId == 'undefined');
            if(typeof dataOpen.additionalData.userId == 'undefined'){
                this.nav.push(InboxPage);
            }else{
                //alert(JSON.stringify(dataOpen));
                this.nav.push(DialogPage, {
                    user: {
                        userId: dataOpen.additionalData.userId,
                        userNick: dataOpen.additionalData.userNick
                    }
                });
            }
        }else{
          /*var ref = */window.open(dataOpen.additionalData.urlRedirect, '_system');
        }
    }

    swipeFooterMenu() {
        if ($('.more-btn').hasClass('menu-left')) {
            $('.more-btn').removeClass('menu-left');
            $('.more-btn .right-arrow').show();
            $('.more-btn .left-arrow').hide();

            $('.more-btn').parents('.menu-one').animate({
                'margin-right': '-92%'
            }, 1000);
        } else {
            $('.more-btn').addClass('menu-left');
            $('.more-btn .left-arrow').show();
            $('.more-btn .right-arrow').hide();
            $('.more-btn').parents('.menu-one').animate({
                'margin-right': '0'
            }, 1000);
        }
    }

    removeBackground() {
        $('#menu3, #menu2').find('ion-backdrop').remove();
    }

    getBanner() {
        this.api.http.get(this.api.url + '/user/banner_new', this.api.header).subscribe((data:any) => {
            this.banner = data;
            this.api.isBanner = (this.banner.src == '') ? false : true;
            console.log("isBanner: " + this.api.isBanner);
        });
    }

    goTo() {
        window.open(this.banner.link, '_blank');
        return false;
    }

    openPage(page) {

        if (page._id == 'logout') {
            this.api.status = '';
        }


        if (page._id == 'stats') {
            this.menu3Active();
        } else {
            // close the menu when clicking a link from the menu
            this.menu.close();

            let params = '';

            // navigate to the new page if it is not the current page
            if (page.list == 'online') {
                params = JSON.stringify({
                    action: 'online',
                    filter: 'lastActivity',
                    list: '',
                    page: 1,
                    searchparams: {region: '', agefrom: 0, ageto: 0, sexpreef: '', meritalstat: '', userNick: ''}
                });
            } else if (page.list == 'distance') {
                params = JSON.stringify({
                    action: 'search',
                    filter: page.list,
                    list: '',
                    page: 1,
                    searchparams: {region: '', agefrom: 0, ageto: 0, sexpreef: '', meritalstat: '', userNick: ''}
                });
            }

            else {

                params = JSON.stringify({
                    action: '',
                    list: page.list,
                    filter: 'lastActivity',
                    page: 1,
                    searchparams: {region: '', agefrom: 0, ageto: 0, sexpreef: '', meritalstat: '', userNick: ''}
                });
            }
            if (page._id == 'edit_profile') {
                let params = {user: {step: 0, register: false}};
                this.nav.push(RegisterPage, params);
            } else {
                this.nav.push(page.component, {page: page, action: 'list', params: params});
            }
        }
    }


    homePage() {
        this.api.storage.get('user_id').then((val) => {
            if (val) {
                this.nav.setRoot(HomePage);
            } else {
                this.nav.setRoot(LoginPage);
            }
            this.nav.popToRoot();
        });
    }

    getBingo() {
        this.api.storage.get('user_id').then((val) => {
            if (val && this.api.password) {
                this.api.http.get(this.api.url + '/user/bingo', this.api.setHeaders(true)).subscribe((data:any) => {
                    //this.api.storage.set('status', this.status);
                    this.texts = data.texts;
                    this.avatar = data.texts.avatar;
                    this.api.myPhotos = data.photos;
                    // DO NOT DELETE
                    /*if (this.status != data.status) {
                     this.status = data.status;
                     this.checkStatus();
                     } else {
                     this.status = data.status;
                     }*/
                    console.log(data);
                    if (data.texts.items && data.texts.items.length > 0) {
                        let params = JSON.stringify({
                            bingo: data.texts.items[0]
                        });
                        this.nav.push(BingoPage, {data: data});
                        this.api.http.post(this.api.url + '/user/bingo/splashed', params, this.api.setHeaders(true)).subscribe((data:any) => {
                        });
                    }
                });
            }
        });
    }

    dialogPage() {
        let user = {id: this.new_message.userId};
        this.closeMsg();
        this.nav.push(DialogPage, {user: user});
    }

    getMessage() {

    }

    checkStatus() {
        //let page = this.nav.getActive();

        if (!(this.api.pageName == 'ActivationPage') && !(this.api.pageName == 'ContactUsPage') && !(this.api.pageName == 'ChangePhotosPage') && !(this.api.pageName == 'RegistrationThreePage')
            && !(this.api.pageName == 'RegisterPage') && !(this.api.pageName == 'TermsPage')) {
            if (this.api.status == 'no_photo') {
                let toast = this.toastCtrl.create({
                    message: this.texts.photoMessage,
                    showCloseButton: true,
                    closeButtonText: 'אישור'
                });
                if (this.texts.photoMessage) {
                    toast.present();
                }
                //alert(page);
                this.nav.push(RegisterPage);
                this.nav.push(ChangePhotosPage);
            } else if (this.api.status == 'not_activated') {
                this.nav.push(ActivationPage);
            }
        }
        if (((this.api.pageName == 'ActivationPage') && this.api.status == 'login')) {
            this.nav.push(HomePage);
        }
    }

    alert(title, subTitle) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: [{
                text: 'אישור',
                handler: data => {
                    this.market.open('com.nysd');
                    //Market.open('com.nysd');
                }
            }]
        });
        alert.present();
    }

    ngAfterViewInit() {

        this.nav.viewDidEnter.subscribe((view) => {

            this.getBanner();
            var that = this;
            clearInterval(this.ajaxInterval);
            setTimeout(function () {
                that.getStatistics();
                that.getBingo();
            },300);

            this.ajaxInterval = setInterval(function () {
                //let page = that.nav.getActive();

                if (!(that.api.pageName == 'LoginPage') && that.api.username != false && that.api.username != null) {
                    that.getBingo();
                    that.getStatistics();
                }
            }, 10000);

            if (this.api.pageName != 'LoginPage' && this.api.pageName != 'SubscriptionPage' && this.api.pageName != 'ContactUsPage' && this.api.pageName != 'PagePage' && this.api.isPay == 0 && this.is2D == 0 && this.api.status == 1) {
                //this.status = 1;
                this.nav.setRoot(SubscriptionPage);
            } else if (this.api.pageName != 'ChangePhotosPage' && this.api.status === 'noimg') {
                //this.status = 1;
                let toast = this.toastCtrl.create({
                    message: "לכניסה לאתר ריצ'דייט יש להעלות תמונה",
                    duration: 3000
                });

                toast.present();
                this.nav.setRoot(ChangePhotosPage);
            } else if (this.api.pageName != 'ChangePhotosPage' && this.api.pageName != 'ActivationPage' && this.api.status === 'notActivated') {
                //this.status = 1;
                this.nav.setRoot(ActivationPage);
            }

            if (this.api.pageName == 'DialogPage' || this.api.pageName == 'SubscriptionPage') {
                $('.footerMenu').hide();
            } else {
                $('.footerMenu').show();
            }

            let el = this;
            window.addEventListener('native.keyboardshow', function () {

                $('.footerMenu, .back-btn, .link-banner').hide();

                $('.editional-btn').hide();

                if (el.api.pageName == 'DialogPage') {
                    this.content.scrollTo(0, 999999, 300);
                    setTimeout(function () {
                        $('.scroll-content, .fixed-content').css({'margin-bottom': '65px'});
                        this.content.scrollTo(0, 999999, 300);
                    }, 400);
                } else {
                    setTimeout(function () {
                        $('.scroll-content, .fixed-content').css({'margin-bottom': '0px'});
                    }, 400);
                }
            });
            window.addEventListener('native.keyboardhide', function () {

                $('.editional-btn').show();

                if (el.api.pageName == 'DialogPage') {
                    $('.back-btn').show();
                    $('.footerMenu').hide();

                    $('.scroll-content, .fixed-content').css({'margin-bottom': '65px'});
                    el.content.scrollTo(0, 999999, 300);

                } else {
                    if (el.is_login) {
                        $('.footerMenu').show();
                        $('.scroll-content, .fixed-content').css({'margin-bottom': '57px'});
                    } else {
                        $('.scroll-content, .fixed-content').css({'margin-bottom': '0px'});
                    }
                }

            });

            if (el.api.pageName == 'LoginPage') {
                this.interval = false;
            }
            if (el.api.pageName == 'HomePage' && this.interval == false) {
                //$('.link-banner').show();
                this.interval = true;
                this.getBingo();
            }
            //this.api.setHeaders(true);

            this.api.storage.get('status').then((val) => {
                if (this.api.status == '') {
                    this.api.status = val;
                }
                this.checkStatus();
                if (!val) {
                    this.menu_items = this.menu_items_logout;
                    this.is_login = false
                } else {
                    //this.getStatistics();
                    this.is_login = true;
                    this.menu_items = this.menu_items_login;
                }

            });
        });
    }
}


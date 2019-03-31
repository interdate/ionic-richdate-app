import {Component, ViewChild} from "@angular/core";
import {IonicPage, NavController, NavParams, ToastController, Content, AlertController, TextInput} from "ionic-angular";
import {ApiQuery} from "../../library/api-query";
import {Http} from "@angular/http";
import {Media} from "@ionic-native/media";
import {File} from "@ionic-native/file";
import {FileTransfer} from "@ionic-native/file-transfer";
import {Device} from "@ionic-native/device";
import {Storage} from "@ionic/storage";
import {SubscriptionPage} from "../subscription/subscription";
import {AdminMessagesPage} from "../admin-messages/admin-messages";
import {ProfilePage} from "../profile/profile";
/**
 * Generated class for the DialogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var $: any;

@IonicPage()
@Component({
    selector: 'page-dialog',
    templateUrl: 'dialog.html',
    providers: [FileTransfer]
})
export class DialogPage {
    @ViewChild(Content) content: Content;
    @ViewChild('dialog_msg') messageInput: TextInput;

    user: { id: string, userId: string, isOnline: string, nick_name: string, mainImage: {url: any} ,gender: string, photo};
    users: Array<{ id: string, isOnline: string, nick_name: string, image: string }>;
    texts: any = {a_conversation_with: '', title: '', photo: ''};
    message: any;
    messages: any; //Array<{ id: string, alert: '', isRead: any, text: string, dateTime: string, from: any, voiceUrl: string }>; //, duration:number
    checkChat: any;
    notReadMessage: any = [];
    mediaobject: any = false;
    check: boolean = false;
    filephat: string;
    data: any;
    filename: string;
    username: any = false;
    password: any = false;
    currentMsgPlay: any;
    isPlay: boolean = false;
    submitBtn: any = false;
    alert: '';
    micStatus: any = true;
    reciver_id: any;
    adminMessagesCount: any;
    userHasFreePoints: any;
    contactCurrentReadMessagesNumber: any = 0;
    countNewMess: any = 0;
    currentTime: any;
    audioDuration: any;
    recordLength: any = 0;
    recordLengthTimeout: any;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public http: Http,
                public toastCtrl: ToastController,
                public api: ApiQuery,
                public media: Media,
                public file: File,
                public alertCtrl: AlertController,
                public device: Device,
                public  fileTransfer: FileTransfer,
                public storage: Storage) {

        this.user = navParams.get('user');

        this.getPage();

        this.storage.get('user_id').then((val) => {
            this.storage.get('username').then((username) => {
                this.username = username;
            });
            this.storage.get('password').then((password) => {
                this.password = password;
            });
        });

        $("#target").focus(function () {
            alert("Handler for .focus() called.");
        });

        this.api.keyboard.onKeyboardShow().subscribe(data => {
            // $('.scroll-content, .fixed-content').css({'margin-bottom': '65px'});
            this.messageInput.setFocus();
            this.scrollToBottom();
        });
    }

    countCharacters(ev) {
        if (ev.target.value.length > 0) {
            this.submitBtn = true;
        } else {
            this.submitBtn = false;
        }
    }

    onFocus() {
        this.content.resize();
        this.scrollToBottom();
    }

    subscription() {
        this.storage.get('user_id').then((user_id) => {
            this.navCtrl.push(SubscriptionPage);
        });
    }

    turnMic() {
        this.micStatus === true ? this.micStatus = false : this.micStatus = true;
    }

    getPage() {
        var userId = typeof this.user.userId != "undefined" ? this.user.userId : this.user.id;
        this.reciver_id = userId;

        this.http.get(this.api.url + '/user/chat/' + userId, this.api.setHeaders(true)).subscribe(data => {
            this.user = data.json().user;
            /*this.texts = data.json().texts;*/
            this.messages = data.json().chat.items;
            this.data = data.json();
            this.countNewMess = data.json().chat.newMess;
            this.alert = data.json().blacklist != '' ? data.json().blacklist : '';
            this.contactCurrentReadMessagesNumber = data.json().contactCurrentReadMessagesNumber;

            this.scrollToBottom();
        }, err => {
            console.log("Oops!");
        });
    }

    deleteMsg(message) {
        this.http.post(this.api.url + '/user/message/delete/' + message.id, {}, this.api.setHeaders(true)).subscribe(data => {
            this.getPage();
        });
    }

    scrollToBottom() {
        let that = this;
        setTimeout(function () {
            that.content.scrollToBottom(300);
        }, 400);
        //this.content.scrollTo(0, 999999, 300);
    }

    useFreePointToReadMessage(message) {
        let index = this.api.functiontofindIndexByKeyValue(this.messages, 'id', message.id);
        this.http.get(this.api.url + '/user/chat/useFreePointToReadMessage/' + message.id, this.api.setHeaders(true)).subscribe(data => {
            this.messages[index].text = data.json().messageText;
            this.setMessagesAsRead([message.id]);
            if (!data.json().userHasFreePoints) {
                // Update page
                this.getPage();
            }
        });
    }

    setMessagesAsRead(unreadMessages) {
        let params = JSON.stringify({
            unreadMessages: unreadMessages
        });

        this.http.post(this.api.url + '/user/messenger/setMessagesAsRead', params, this.api.setHeaders(true)).subscribe(data => {
        });
    }

    /*  back() {
     this.mediaobject.stop();
     this.mediaobject.release();

     //this.api.footer = true;
     $('.footerMenu').show();
     //$('.scroll-content, .fixed-content').css({'margin-bottom': '57px'});
     setTimeout(function () {
     $('.scroll-content, .fixed-content').css({'margin-bottom': '57px'});
     }, 500);

     this.api.back = true;
     this.navCtrl.pop();
     }
     */
    sendPush() {
        var userId = typeof this.user.userId != "undefined" ? this.user.userId : this.user.id;
        this.http.post(this.api.url + '/user/push/' + userId, {}, this.api.setHeaders(true)).subscribe(data => {
        });
    }

    sendMessage(url: string = "") {

        if (!this.data.isBlacklisted) {

            this.submitBtn = false;

            if (this.alert != "") {
                let toast = this.toastCtrl.create({
                    message: this.alert,
                    duration: 5000
                });
                toast.present();
            }

            if (url != "") {
                let options = {
                    fileKey: "file",
                    fileName: 'test.mp3',
                    chunkedMode: false,
                    mimeType: "audio/mp3",
                    headers: {Authorization: "Basic " + btoa(encodeURIComponent(this.username) + ":" + this.password)}/*@*/
                };

                const filetransfer = this.fileTransfer.create();

                filetransfer.upload(url, this.api.url + '/user/message/audio/' + this.user.userId, options).then((voicemessage) => {
                    // alert(JSON.stringify(voicemessage));
                }, (error) => {
                    // handle error
                    alert('test:' + JSON.stringify(error));
                });

            } else {

                var params = JSON.stringify({
                    message: this.message
                });


                this.scrollToBottom();
                this.message = '';

                var userId = typeof this.user.userId != "undefined" ? this.user.userId : this.user.id;

                this.http.post(this.api.url + '/user/chat/' + userId, params, this.api.setHeaders(true)).subscribe(data => {

                    if (data.json().status == 'chat') {
                        this.messages.push({
                            id: 0,
                            date: '',
                            from: userId,
                            isRead: 0,
                            text: this.message,
                            time: '',
                            to: this.user.id
                        });
                        this.messages = data.json().chat.items;
                        this.countNewMess = data.json().chat.newMess;
                    } else if (data.json().status == 'blocked') {
                        let toast = this.toastCtrl.create({
                            message: data.json().message,
                            duration: 5000
                        });
                        toast.present();
                    }
                    this.messages = data.json().chat.items;
                    this.scrollToBottom();
                    this.sendPush();
                });
            }
        } else {
            let toast = this.toastCtrl.create({
                message: this.data.blackListText,
                duration: 2000
            });

            toast.present();
        }
    }

    sendVoiceMessage() {
        if (!this.data.isBlacklisted) {

            this.turnMic();

            if (!this.check) {
                this.check = true;
                let directory = '';
                if (this.device.platform == "iOS") {
                    this.filephat = this.file.tempDirectory.replace(/file:\/\//g, '');
                    this.filename = 'recordmg' + Math.random() + '.m4a';//3gp
                    //directory = this.filephat;
                    directory = this.file.tempDirectory;


                } else if (this.device.platform == "Android") {
                    this.filephat = "file:///storage/emulated/0/";
                    /*this.file.externalApplicationStorageDirectory;*/
                    this.filename = 'recordmg' + Math.random() + '.mp3';//3gp
                    directory = this.filephat;
                }

                // let audioObject: MediaObject;
                this.file.createFile(directory, this.filename, true).then(() => {
                    this.mediaobject = this.media.create(this.filephat + this.filename);
                    this.mediaobject.startRecord();

                    let that = this;
                    this.recordLength = 0;

                    this.recordLengthTimeout = setTimeout(function () {
                        that.recordLength = 1;
                    }, 1000);

                    this.audioDuration = window.setTimeout(() => {
                            that.mediaobject.stopRecord();
                            if (this.recordLength > 0) {
                                var d = new Date();
                                var time = d.getHours() + ':' + d.getMinutes();
                                var date = d.getDate() + '/' + this.addZero(d.getMonth() + 1) + '/' + d.getFullYear();
                                //alert(date);

                                let mess = {
                                    id: d.getSeconds(),
                                    date: date,
                                    from: 'idu4336bg',
                                    isRead: 0,
                                    text: 'לחצו להאזנה...',
                                    time: time,
                                    to: that.user.userId,
                                    audio: this.filephat + that.filename
                                };
                                this.messages.push(mess);
                                this.mediaobject.stopRecord();
                                this.mediaobject.release();
                                this.check = false;

                                setTimeout(function () {
                                    that.sendMessage(that.filephat + that.filename);
                                    that.scrollToBottom();
                                }, 10);
                            }
                            clearTimeout(that.recordLengthTimeout);
                        }
                        , 30000);

                }, function (error) {
                    alert('test233' + JSON.stringify(error));
                });

            } else {
                clearTimeout(this.audioDuration);
                this.mediaobject.stopRecord();
                this.mediaobject.release();
                this.check = false;
                //alert(this.recordLength);
                if (this.recordLength > 0) {
                    var d = new Date();
                    var time = d.getHours() + ':' + d.getMinutes();
                    var date = this.addZero(d.getDate()) + '/' + this.addZero(d.getMonth() + 1) + '/' + d.getFullYear();
                    //alert(date);

                    let mess = {
                        id: d.getSeconds(),
                        date: date,
                        from: 'idu4336bg',
                        isRead: 0,
                        text: 'לחצו להאזנה...',
                        time: time,
                        to: this.user.userId,
                        audio: this.filephat + this.filename
                    };
                    this.messages.push(mess);

                    let that = this;

                    setTimeout(function () {
                        that.sendMessage(that.filephat + that.filename);
                        that.content.scrollToBottom(300);
                        //}
                    }, 1000);
                }
                clearTimeout(this.recordLengthTimeout);
            }
        } else {
            let toast = this.toastCtrl.create({
                message: this.data.blackListText,
                duration: 2000
            });

            toast.present();
        }
    }

    addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }


    playrecord(msg) {

        if (this.mediaobject) {
            clearInterval(this.currentTime);
            this.isPlay = false;
            this.mediaobject.stop();
            $(".runner").css({'left': 0});
        }
        this.currentMsgPlay = msg.id;
        this.mediaobject = this.media.create(msg.audio);
        this.mediaobject.play();
        this.isPlay = true;

        var currentPosition = 0.25;

        let that = this;

        this.currentTime = setInterval(function () {
            var dur = that.mediaobject.getDuration();

            if (dur > 0) {
                dur = Math.floor(dur);
                if (dur == currentPosition) {
                    //$(".msg-" + msg.id + " .runner").css({'left': 95 + '%'});
                    //setTimeout(function () {
                    $(".msg-" + msg.id + " .runner").css({'left': 0});
                    clearInterval(that.currentTime);
                    that.isPlay = false;
                    this.mediaobject.release();
                    //}, 500);

                } else {
                    $(".msg-" + msg.id + " .runner").css({'left': (90 / dur * (currentPosition)) + '%'});
                    currentPosition += 0.25;
                    //alert(currentPosition);
                }
            }
        }, 250);

    }

    pauserecord() {
        this.mediaobject.pause();
        this.mediaobject.release();
        //this.isPlay = false;
    }

    getNewMessages() {

        this.http.get(this.api.url + '/user/chat/' + this.reciver_id + '/' + this.contactCurrentReadMessagesNumber + '/refresh', this.api.setHeaders(true)).subscribe(data => {
            this.contactCurrentReadMessagesNumber = data.json().contactCurrentReadMessagesNumber;
            if (data.json().chat) {
                this.messages = data.json().chat.items;
                this.countNewMess = data.json().chat.newMess;

                this.scrollToBottom();
                this.api.hideLoad();



                if (data.json().chat.abilityReadingMessages == 1 ) {

                    this.countNewMess = 0;
                    var arrMsg = [];
                    for (var _i = 0; _i < this.messages.length; _i++) {
                        if (this.messages[_i].isRead == 0 && this.messages[_i].to == this.reciver_id) {
                            arrMsg.push(this.messages[_i].id);
                        }
                    }

                    if(arrMsg.length != 0){
                        this.setMessagesAsRead(arrMsg);
                    }

                }
                this.userHasFreePoints = data.json().chat.userHasFreePoints;

                let that = this;


                if (data.json().isNewMess) {
                    this.scrollToBottom();
                }

            }
        }, err => {
            // alert(JSON.stringify(err));
        });
    }

    sandReadMessage() {
        var params = JSON.stringify({
            message: 'ok-1990234'
        });

        this.http.post(this.api.url + '/api/v1/sends/' + this.user.id + '/messages', params, this.api.setHeaders(true)).subscribe(data => {
        });
    }

    readMessagesStatus() {
        //alert(this.notReadMessage.length);
        if (this.notReadMessage.length > 0) {
            var params = JSON.stringify({
                messages: this.notReadMessage
            });

            this.http.post(this.api.url + '/api/v1/checks/messages', params, this.api.setHeaders(true)).subscribe(data => {

                for (let i = 0; i < this.messages.length; i++) {
                    //if (data.json().readMessages.indexOf(this.messages[i].id) !== '-1') {
                    //this.messages[i].isRead = 1;
                    //}
                }
                for (let e = 0; this.notReadMessage.length; e++) {
                    //if (data.json().readMessages.indexOf(this.notReadMessage[e]) !== '-1') {
                    //delete this.notReadMessage[e];
                    //}
                }
            });
        }
    }

    ionViewWillLeave() {
        if (this.mediaobject) {
            this.mediaobject.stop();
            this.mediaobject.release();
        }

        this.api.footer = true;
        $('.back-btn').hide();
        // enable the root left menu when leaving the tutorial page
        clearInterval(this.checkChat);
    }

    adminMessagesPage() {
        this.navCtrl.push(AdminMessagesPage, {
            user: this.user
        });
    }

    toProfilePage() {
        if(parseInt(this.user.userId) > 0) {
            this.user.id = this.user.userId;

            this.navCtrl.push(ProfilePage, {
                user: this.user
            });
        }

    }

    ionViewWillEnter() {
        this.api.footer = false;
        this.api.pageName = 'DialogPage';
        $('.back-btn').show();
        $('.footerMenu').hide();
    }

    ionViewDidLoad() {

        var that = this;

        that.checkChat = setInterval(function () {
                that.getNewMessages();
            }, 10000);


        $('button').click(function () {
            // clean textareaa after submit
            $('textarea').val('');
        });

    }

}

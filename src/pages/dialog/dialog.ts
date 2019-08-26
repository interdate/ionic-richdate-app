import {Component, ViewChild} from "@angular/core";
import {NavController, NavParams, ToastController, Content, AlertController, TextInput} from "ionic-angular";
import {Media} from "@ionic-native/media";
import {File} from "@ionic-native/file";
import {FileTransfer} from "@ionic-native/file-transfer";
import {Device} from "@ionic-native/device";
import {SubscriptionPage} from "../subscription/subscription";
import {AdminMessagesPage} from "../admin-messages/admin-messages";
import {ProfilePage} from "../profile/profile";
import {ImagesPage} from "../images/images";
import { DomSanitizer } from '@angular/platform-browser';
import * as $ from "jquery";
import {ApiProvider} from "../../providers/api/api";
import {HomePage} from "../home/home";
import {FullScreenProfilePage} from "../full-screen-profile/full-screen-profile";
//import set = Reflect.set;

@Component({
    selector: 'page-dialog',
    templateUrl: 'dialog.html'
})
export class DialogPage {
    @ViewChild(Content) content: Content;
    @ViewChild('dialog_msg') messageInput: TextInput;

    user: any;
    users: any;
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
                public toastCtrl: ToastController,
                public api: ApiProvider,
                public media: Media,
                public file: File,
                public alertCtrl: AlertController,
                public device: Device,
                public fileTransfer: FileTransfer,
                private sanitizer: DomSanitizer) {
        if(navParams.get('user')) {
            this.user = navParams.get('user');

            this.getPage();

            this.api.storage.get('user_id').then((val) => {
                this.api.storage.get('username').then((username) => {
                    this.username = username;
                });
                this.api.storage.get('password').then((password) => {
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
        }else{
            this.navCtrl.push(HomePage);
        }
    }

    preview(img){
      this.api.preview(this.navCtrl,img.src,FullScreenProfilePage);
    }

    checkedImg(html) {
        return ($('<div>' + html + '</div>').find('a img').length > 0) ? true : false;
    }

    msgToArr(html){
        let res: any = {photos: [], text: ''};
        let div: any = document.createElement('div');
        div.innerHTML = html;
        $(div).find('a img').each(function () {
            res.photos.push({src:$(this).attr('src')});
            $(this).parent('a').remove();
        });
        //$(div).find('a').remove();
        res.text = this.sanitizer.bypassSecurityTrustHtml(div.innerHTML);
        return res;
    }

    openMyPhotos(){
        console.log("start");
        let imageModal = this.api.modalCtrl.create(ImagesPage, {data: this.data});
        imageModal.present();

        imageModal.onDidDismiss(data => {
            console.log("end");
            if (data && data.message != '') {
                //let temp = this.message;
                this.message = data.message;
                this.sendMessage();
                // let that = this;
                // setTimeout(
                //     function () {
                //         that.message = temp;
                //     },100
                // );
            }
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
        this.api.storage.get('user_id').then((user_id) => {
            this.navCtrl.push(SubscriptionPage);
        });
    }

    turnMic() {
        this.micStatus === true ? this.micStatus = false : this.micStatus = true;
    }

    getPage() {
        var userId = typeof this.user.userId != "undefined" ? this.user.userId : this.user.id;
        this.reciver_id = userId;

        this.api.http.get(this.api.url + '/user/chat/' + userId, this.api.setHeaders(true)).subscribe((data: any) => {
            this.user = data.user;
            /*this.texts = data.json().texts;*/
            this.messages = data.chat.items;
            this.data = data;
            this.countNewMess = data.chat.newMess;
            this.alert = data.blacklist != '' ? data.blacklist : '';
            this.contactCurrentReadMessagesNumber = data.contactCurrentReadMessagesNumber;

            this.scrollToBottom();
        }, err => {
            console.log("Oops!");
        });
    }

    deleteMsg(message) {
        this.api.http.post(this.api.url + '/user/message/delete/' + message.id, {}, this.api.setHeaders(true)).subscribe((data: any) => {
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
        this.api.http.get(this.api.url + '/user/chat/useFreePointToReadMessage/' + message.id, this.api.setHeaders(true)).subscribe((data: any) => {
            this.messages[index].text = data.messageText;
            this.setMessagesAsRead([message.id]);
            if (!data.userHasFreePoints) {
                // Update page
                this.getPage();
            }
        });
    }

    setMessagesAsRead(unreadMessages) {
        let params = JSON.stringify({
            unreadMessages: unreadMessages
        });

        this.api.http.post(this.api.url + '/user/messenger/setMessagesAsRead', params, this.api.setHeaders(true)).subscribe((data: any) => {
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
        let userId = typeof this.user.userId != "undefined" ? this.user.userId : this.user.id;
        this.api.http.post(this.api.url + '/user/push/' + userId, {}, this.api.setHeaders(true)).subscribe((data: any) => {
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

                let userId = typeof this.user.userId != "undefined" ? this.user.userId : this.user.id;

                this.api.http.post(this.api.url + '/user/chat/' + userId, params, this.api.setHeaders(true)).subscribe((data: any) => {

                    if (data.status == 'chat') {
                        this.messages.push({
                            id: 0,
                            date: '',
                            from: userId,
                            isRead: 0,
                            text: this.message,
                            time: '',
                            to: this.user.id
                        });
                        this.messages = data.chat.items;
                        this.countNewMess = data.chat.newMess;
                    } else if (data.status == 'blocked') {
                        let toast = this.toastCtrl.create({
                            message: data.message,
                            duration: 5000
                        });
                        toast.present();
                    }
                    this.messages = data.chat.items;
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

        this.api.http.get(this.api.url + '/user/chat/' + this.reciver_id + '/' + this.contactCurrentReadMessagesNumber + '/refresh', this.api.setHeaders(true)).subscribe((data: any) => {
            this.contactCurrentReadMessagesNumber = data.contactCurrentReadMessagesNumber;
            if (data.chat) {
                this.messages = data.chat.items;
                this.countNewMess = data.chat.newMess;

                this.scrollToBottom();
                this.api.hideLoad();



                if (data.chat.abilityReadingMessages == 1 ) {

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
                this.userHasFreePoints = data.chat.userHasFreePoints;

                let that = this;


                if (data.isNewMess) {
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

        this.api.http.post(this.api.url + '/api/v1/sends/' + this.user.id + '/messages', params, this.api.setHeaders(true)).subscribe((data: any) => {
        });
    }

    readMessagesStatus() {
        //alert(this.notReadMessage.length);
        if (this.notReadMessage.length > 0) {
            var params = JSON.stringify({
                messages: this.notReadMessage
            });

            this.api.http.post(this.api.url + '/api/v1/checks/messages', params, this.api.setHeaders(true)).subscribe((data: any) => {

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

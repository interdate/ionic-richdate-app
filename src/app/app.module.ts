import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule, Nav} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {Media} from "@ionic-native/media";
import {File} from "@ionic-native/file";
import {ApiQuery} from "../library/api-query";
import {IonicStorageModule} from "@ionic/storage";
import {HttpModule} from "@angular/http";
import {Device} from "@ionic-native/device";
import {MyApp} from "./app.component";
import {HomePage} from "../pages/home/home";
import {LoginPage} from "../pages/login/login";
import {RegisterPageModule} from "../pages/register/register.module";
import {Camera} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import {FileTransfer} from "@ionic-native/file-transfer";
import {PageModule} from "../pages/page/page.module";
import {ChangePhotosPageModule} from "../pages/change-photos/change-photos.module";
import {AdvancedsearchPageModule} from "../pages/advancedsearch/advancedsearch.module";
import {Geolocation} from "@ionic-native/geolocation";
import {SettingsPageModule} from "../pages/settings/settings.module";
import {SubscriptionPageModule} from "../pages/subscription/subscription.module";
import {AdvancedSearchResultPageModule} from "../pages/advanced-search-result/advanced-search-result.module";
import {Keyboard} from "@ionic-native/keyboard";
import {FingerprintAIO} from "@ionic-native/fingerprint-aio";
import {AndroidFingerprintAuth} from "@ionic-native/android-fingerprint-auth";
import {AdminMessagesPageModule} from "../pages/admin-messages/admin-messages.module";
import {ProfilePage} from "../pages/profile/profile";
import {AppVersion} from "@ionic-native/app-version";
import {SelectPageModule} from "../pages/select/select.module";
import {InAppPurchase} from "@ionic-native/in-app-purchase";
import {ActivationPageModule} from "../pages/activation/activation.module";
import {InAppBrowser} from "@ionic-native/in-app-browser";

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LoginPage,
        ApiQuery,
        ProfilePage
    ],
    imports: [
        BrowserModule,
       IonicModule.forRoot(MyApp, {
            menuType: 'overlay',
            scrollAssist: false,
            autoFocusAssist: false
        }),
        IonicStorageModule.forRoot(),
        HttpModule,
        RegisterPageModule,
        PageModule,
        SelectPageModule,
        ChangePhotosPageModule,
        AdvancedsearchPageModule,
        AdvancedSearchResultPageModule,
        SettingsPageModule,
        SubscriptionPageModule,
        AdminMessagesPageModule,
        ActivationPageModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage,
        LoginPage,
        ProfilePage
    ],
    providers: [
        FingerprintAIO,
        Nav,
        Keyboard,
        StatusBar,
        SplashScreen,
        AndroidFingerprintAuth,
        InAppBrowser,
        Device,
        Geolocation,
        ImagePicker,
        InAppPurchase,
        FileTransfer,
        Camera,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        //{ provide: AndroidFingerprintAuth, useClass: FingerMock },
        ApiQuery, Media, File, AppVersion
    ]
})
export class AppModule {
}

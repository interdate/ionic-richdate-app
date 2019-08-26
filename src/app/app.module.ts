import {BrowserModule} from "@angular/platform-browser";
import {ErrorHandler, NgModule} from "@angular/core";
import {IonicApp, IonicErrorHandler, IonicModule, Nav} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen";
import {StatusBar} from "@ionic-native/status-bar";
import {Media} from "@ionic-native/media";
import {File} from "@ionic-native/file";
import {IonicStorageModule} from "@ionic/storage";
import {Device} from "@ionic-native/device";
import {MyApp} from "./app.component";
import {Camera} from "@ionic-native/camera";
import {ImagePicker} from "@ionic-native/image-picker";
import {FileTransfer} from "@ionic-native/file-transfer";
import {Geolocation} from "@ionic-native/geolocation";
import {Keyboard} from "@ionic-native/keyboard";
import { FingerprintAIO } from "@ionic-native/fingerprint-aio";
import {AppVersion} from "@ionic-native/app-version";
import {InAppPurchase} from "@ionic-native/in-app-purchase";
import {InAppBrowser} from "@ionic-native/in-app-browser";
import {HttpClientModule} from "@angular/common/http";
import {LoginPage} from "../pages/login/login";
import {Market} from "@ionic-native/market";
import {Push} from "@ionic-native/push";
import {TermsPage} from "../pages/terms/terms";
import {AdvancedSearchResultPage} from "../pages/advanced-search-result/advanced-search-result";
import {AdvancedsearchPage} from "../pages/advancedsearch/advancedsearch";
import {ArenaPage} from "../pages/arena/arena";
import {ChangePhotosPage} from "../pages/change-photos/change-photos";
import {ContactUsPage} from "../pages/contact-us/contact-us";
import {InboxPage} from "../pages/inbox/inbox";
import {NotificationsPage} from "../pages/notifications/notifications";
import {RegisterPage} from "../pages/register/register";
import {SearchPage} from "../pages/search/search";
import {ActivationPage} from "../pages/activation/activation";
import {AdminMessagesPage} from "../pages/admin-messages/admin-messages";
import {BingoPage} from "../pages/bingo/bingo";
import {ChangePasswordPage} from "../pages/change-password/change-password";
import {DialogPage} from "../pages/dialog/dialog";
import {FaqPage} from "../pages/faq/faq";
import {FreezeAccountPage} from "../pages/freeze-account/freeze-account";
import {FullScreenProfilePage} from "../pages/full-screen-profile/full-screen-profile";
import {ImagesPage} from "../pages/images/images";
import {Page} from "../pages/page/page";
import {PasswordRecoveryPage} from "../pages/password-recovery/password-recovery";
import {ProfilePage} from "../pages/profile/profile";
import {SelectPage} from "../pages/select/select";
import {SettingsPage} from "../pages/settings/settings";
import {SubscriptionPage} from "../pages/subscription/subscription";
import {HomePage} from "../pages/home/home";
import { ApiProvider } from '../providers/api/api';


@NgModule({
    declarations: [
      MyApp,
      LoginPage,
      HomePage,
      TermsPage,
      AdvancedSearchResultPage,
      AdvancedsearchPage,
      ArenaPage,
      ChangePhotosPage,
      ContactUsPage,
      InboxPage,
      NotificationsPage,
      RegisterPage,
      SearchPage,
      ActivationPage,
      AdminMessagesPage,
      BingoPage,
      ChangePasswordPage,
      DialogPage,
      FaqPage,
      FreezeAccountPage,
      FullScreenProfilePage,
      ImagesPage,
      Page,
      PasswordRecoveryPage,
      ProfilePage,
      SelectPage,
      SettingsPage,
      SubscriptionPage
    ],
    imports: [
      IonicStorageModule.forRoot(),
      IonicModule.forRoot(MyApp, {
        menuType: 'overlay',
        scrollAssist: false,
        autoFocusAssist: false
      }),
      BrowserModule,
      HttpClientModule,

    ],
    bootstrap: [IonicApp],
    entryComponents: [
      MyApp,
      LoginPage,
      HomePage,
      TermsPage,
      AdvancedSearchResultPage,
      AdvancedsearchPage,
      ArenaPage,
      ChangePhotosPage,
      ContactUsPage,
      InboxPage,
      NotificationsPage,
      RegisterPage,
      SearchPage,
      ActivationPage,
      AdminMessagesPage,
      BingoPage,
      ChangePasswordPage,
      DialogPage,
      FaqPage,
      FreezeAccountPage,
      FullScreenProfilePage,
      ImagesPage,
      Page,
      PasswordRecoveryPage,
      ProfilePage,
      SelectPage,
      SettingsPage,
      SubscriptionPage
    ],
    providers: [
        ApiProvider,
        FingerprintAIO,
        Nav,
        Keyboard,
        StatusBar,
        SplashScreen,
        InAppBrowser,
        Device,
        Geolocation,
        ImagePicker,
        InAppPurchase,
        FileTransfer,
        Camera,
        Market, Push,
        {provide: ErrorHandler, useClass: IonicErrorHandler},
        Media, File, AppVersion
    ]
})
export class AppModule {
}

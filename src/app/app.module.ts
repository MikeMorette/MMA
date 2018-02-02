import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { LoginPage } from '../pages/auth/login.component';
import { RegisterPage } from '../pages/auth/register.component';
import { JudgeMainPage } from '../pages/judge/judge.component';
import { FanMainPage } from '../pages/fan/fan.component';
import { SportsmanMainPage } from '../pages/sportsman/sportsman.component';
import { TrainerMainPage } from '../pages/trainer/trainer.component';
import { JudgeSTourPage } from '../pages/judge/stour/stour.component';

import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';

import { UserManager } from '../api/providers/user';
import { Api } from '../api/api';
import { HttpModule } from '@angular/http';
import { SecureStorage } from '@ionic-native/secure-storage';
import { NativeStorage } from '@ionic-native/native-storage';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HTTP } from '@ionic-native/http';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { MainPopover } from './main.popover';
import { RegisterTypePage } from '../pages/auth/reg.component';
import { JudgeSWeightPage } from '../pages/judge/sweight/sweight.component';
import { JudgeTournamentPage } from '../pages/judge/tournament/tournament.component';
import { AvatarModalPage } from './modals/avatar.modal';
import { Camera } from '@ionic-native/camera';
import { SVotePage } from '../pages/fan/svote/svote.component';
import { JVotePage } from '../pages/fan/jvote/jvote.component';
import { SupportPage } from '../pages/fan/support/support.component';
import { FundPage } from '../pages/fan/fund/fund.component';
import { JudgeManager } from '../api/providers/judge';
import { PayPage } from '../pages/fan/support/pay/pay.component';
import { FundPayPage } from '../pages/fan/fund/fund.pay';
import { JudgeVoteAPage } from '../pages/fan/jvote/judge.vote';
import { TrainerManager } from '../api/providers/trainer';
import { AddFighterPage } from '../pages/trainer/add/add.component';
import { ControlTournamentPage } from '../pages/judge/tournament/control/control.component';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    MyApp,
    MainPopover,
    LoginPage,
    RegisterPage,
    RegisterTypePage,
    JudgeMainPage,
    FanMainPage,
    SportsmanMainPage,
    TrainerMainPage,
    JudgeSTourPage,
    JudgeSWeightPage,
    JudgeTournamentPage,
    AvatarModalPage,
    SVotePage,
    JVotePage,
    SupportPage,
    FundPage,
    PayPage,
    FundPayPage,
    JudgeVoteAPage,
    AddFighterPage,
    ControlTournamentPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MainPopover,
    LoginPage,
    RegisterPage,
    RegisterTypePage,
    JudgeMainPage,
    FanMainPage,
    SportsmanMainPage,
    TrainerMainPage,
    JudgeSTourPage,
    JudgeSWeightPage,
    JudgeTournamentPage,
    AvatarModalPage,
    SVotePage,
    JVotePage,
    SupportPage,
    FundPage,
    PayPage,
    FundPayPage,
    JudgeVoteAPage,
    AddFighterPage,
    ControlTournamentPage
  ],
  providers: [
    Api,
    SecureStorage,
    NativeStorage,
    Camera,
    HTTP,
    LocalNotifications,
    FCM,
    InAppBrowser,
    UserManager, 
    JudgeManager,
    StatusBar,
    ScreenOrientation,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

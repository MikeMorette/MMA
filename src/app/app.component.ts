import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { LoginPage } from '../pages/auth/login.component';
import { JudgeMainPage } from '../pages/judge/judge.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { UserManager } from '../api/providers/user';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { TrainerMainPage } from '../pages/trainer/trainer.component';
import { SportsmanMainPage } from '../pages/sportsman/sportsman.component';
import { FanMainPage } from '../pages/fan/fan.component';
import { PopoverController } from 'ionic-angular';
import { MainPopover } from './main.popover';
import { PageTransition } from 'ionic-angular/transitions/page-transition';
import { ControlTournamentPage } from '../pages/judge/tournament/control/control.component';
import { NumberValueAccessor } from '@angular/forms/src/directives/number_value_accessor';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { NativeStorage } from '@ionic-native/native-storage';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make JudgeMainPage the root (or first) page
  
  rootPage = null;
  static title = "";
  isLogged = false;

  title = "MMA";

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private userManager: UserManager,
    private screenOrientation: ScreenOrientation,
    private secureStorage: SecureStorage,
    public popoverCtrl: PopoverController,
    public toastCtrl: ToastController,
    public nativeStorage: NativeStorage,
    private fcm: FCM,
    private uS: UserManager,
    private localNotifications: LocalNotifications
  ) {
    userManager.setTitle("MMA");
    this.initializeApp();


    this.nativeStorage.getItem('user_id').then(data => {
      //this.title = data;
      //this.toastCtrl.create({message: "user_id -> " + data, duration: 3000}).present();
      fcm.getToken().then(token=>{
        //this.toastCtrl.create({message: "getToken() -> " + token, duration: 3000}).present();
        uS.registerToken(data, token).subscribe(data => {
          //this.toastCtrl.create({message: "registerToken(token) -> " + JSON.stringify(data), duration: 3000}).present();
        }, err => {
          //this.toastCtrl.create({message: "registerToken(token) -> " + JSON.stringify(err), duration: 3000}).present();
        });
      })
  
      fcm.onNotification().subscribe(data => {
        if(data.wasTapped){
          this.toastCtrl.create({message: "onNotification() -> " + JSON.stringify(data.message), duration: 13000}).present();
          this.localNotifications.schedule({
            id: 1,
            text: data.message,
            data: { secret: "" }
          });
        } else {
          this.toastCtrl.create({message: "onNotification() -> " + JSON.stringify(data.message), duration: 13000}).present();
          this.localNotifications.schedule({
            id: 1,
            text: data.message,
            data: { secret: "" }
          });
        };
      })
      
      fcm.onTokenRefresh().subscribe(token=>{
        uS.registerToken(data, token).subscribe(data => {
          //this.toastCtrl.create({message: "registerToken(token) -> " + JSON.stringify(data), duration: 3000}).present();
        }, err => {
          //this.toastCtrl.create({message: "registerToken(token) -> " + JSON.stringify(err), duration: 3000}).present();
        });
      })
    });
    this.nativeStorage.getItem('type').then(data => {
      this.toastCtrl.create({message: "Type is: " + data, duration: 3000}).present();
      this.isLogged = true;
      this.rootPage = JudgeMainPage;
        switch (data) {
          case "1": this.rootPage = JudgeMainPage; break;
          case "2": this.rootPage = TrainerMainPage; break;
          case "3": this.rootPage = SportsmanMainPage; break;
          case "4": this.rootPage = FanMainPage; break;
        }
    }, error => {
      this.rootPage = LoginPage;
    });

    // set our app's pages
    this.pages = [
      { title: 'Hello Ionic', component: JudgeMainPage },
      { title: 'My First List', component: LoginPage }
    ];
  }

  public static setTitle(t: string) {
    this.title = t;
  }

  presentPopover(event) {
    if (this.isLogged) {
      this.popoverCtrl.create(MainPopover).present({ev: event});
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      this.statusBar.overlaysWebView(true);
      this.statusBar.backgroundColorByHexString("#171A1C");
      
      //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}

import { Component } from '@angular/core';

import { ViewController } from 'ionic-angular';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { LoginPage } from '../pages/auth/login.component';

@Component({
  template: `
  <style type="text/css">.list-md .item-block .item-inner {border-bottom: none !important;}</style>
  <ion-list style="margin-bottom:0;">
    <button ion-item (click)="goAboutPage()">О программе</button>
    <button ion-item (click)="logout()">Выход</button>
  </ion-list>
  `
})
export class MainPopover {
  constructor(public viewCtrl: ViewController, public secureStorage: SecureStorage, public navCtrl: NavController) {}

  rootPage = null

  goAboutPage() {

  }
  logout() {
    this.secureStorage.create('user_settings').then((storage: SecureStorageObject) => {
      storage.remove('auth');
      storage.remove('name')
      storage.remove('surname')
      storage.remove('password')
      storage.remove('type')
      storage.remove('user_id')
      this.rootPage = LoginPage;
      this.navCtrl.push(this.rootPage);
      this.navCtrl.setRoot(this.rootPage);
    });
  }
}
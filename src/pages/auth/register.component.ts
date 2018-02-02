import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { HTTP } from '@ionic-native/http';
import { Md5 } from 'ts-md5/dist/md5';
import { UserManager } from '../../api/providers/user';

import { ToastController } from 'ionic-angular';

import { LoginPage } from './login.component';
import { JudgeMainPage } from '../judge/judge.component';

import { User } from '../../_models/user';
import { Http, Headers, RequestOptions } from '@angular/http';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { TrainerMainPage } from '../trainer/trainer.component';
import { SportsmanMainPage } from '../sportsman/sportsman.component';
import { FanMainPage } from '../fan/fan.component';
import { RegisterTypePage } from './reg.component';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
  providers: [UserManager]
})
export class RegisterPage {
  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  rootPage = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userManager: UserManager, 
    public secureStorage: SecureStorage,
    public toastCtrl: ToastController) { }

  openLogin(event) {this.navCtrl.push(LoginPage)}

  register(event) {
    console.log("register");
    if (this.mUser.name && this.mUser.email && this.mUser.surname && this.mUser.password && this.mUser.rpassword) {
      if (this.mUser.password == this.mUser.rpassword) {
        let postParams = {name: this.mUser.name, surname: this.mUser.surname, email: this.mUser.email, password: Md5.hashStr(this.mUser.password)}
        //this.userManager.saveUser(this.mUser.build());
        this.rootPage = RegisterTypePage;
        this.navCtrl.push(RegisterTypePage, postParams);
        this.navCtrl.setRoot(RegisterTypePage, postParams);
        /*this.userManager.register(postParams).subscribe(data => {
            let result = JSON.parse(data['_body']);
            if (JSON.stringify(result.error) == "1") {
              this.toastCtrl.create({message: "Аккаунт с таким email уже существует!", duration: 3000}).present();
            } else {
              this.mUser.id = parseInt(JSON.stringify(result.id));
              this.userManager.saveUser(this.mUser.build());
              this.secureStorage.create('user_settings').then((storage: SecureStorageObject) => {
                storage.get("auth").then(data => {
                  storage.get("type").then(data => {
                    this.rootPage = JudgeMainPage;
                    switch (data) {
                      case "1": this.rootPage = JudgeMainPage; break;
                      case "2": this.rootPage = TrainerMainPage; break;
                      case "3": this.rootPage = SportsmanMainPage; break;
                      case "4": this.rootPage = FanMainPage; break;
                    }
                    this.navCtrl.push(this.rootPage);
                    this.navCtrl.setRoot(this.rootPage);
                  }, error => {
                    this.rootPage = LoginPage;
                    this.navCtrl.push(this.rootPage);
                    this.navCtrl.setRoot(this.rootPage);
                  });
                }, error => {
                  this.rootPage = LoginPage;
                  this.navCtrl.push(LoginPage);
                  this.navCtrl.setRoot(LoginPage);
                });
              });
            }
          }, error => {
            this.toastCtrl.create({message: "Res: " + JSON.stringify(error), duration: 3000}).present();
          });*/
      } else {
        this.toastCtrl.create({message: 'Пароли не совпадают!', duration: 3000}).present();
      }
    } else {
      this.toastCtrl.create({message: 'Заполните все поля!', duration: 3000}).present();
    }
  }
}
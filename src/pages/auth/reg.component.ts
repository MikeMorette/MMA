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
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'page-register-type',
  templateUrl: 'reg.component.html',
  providers: [UserManager]
})
export class RegisterTypePage {
  types;
  typeForm;

  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  rootPage = null;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userManager: UserManager, 
    public secureStorage: SecureStorage,
    public toastCtrl: ToastController) {
      this.typeForm = new FormGroup({
        "types": new FormControl({value: '3', disabled: false})
      });
    }

  openLogin(event) {this.navCtrl.push(LoginPage)}

  register(event) {
    console.log("register");
        let postParams = {
          name: this.navParams.get("name"), 
          surname: this.navParams.get("surname"), 
          email: this.navParams.get("email"), 
          type: this.typeForm.value.types, 
          password: Md5.hashStr(this.navParams.get("password"))
        }
        this.toastCtrl.create({message: "Type: " + JSON.stringify(postParams), duration: 3000}).present();

        this.userManager.register(postParams).subscribe(data => {
            let result = JSON.parse(data['_body']);
            if (JSON.stringify(result.error) == "1") {
              this.toastCtrl.create({message: "Аккаунт с таким email уже существует!", duration: 3000}).present();
            } else {
              this.mUser.id = parseInt(JSON.stringify(result.id));
              this.mUser.name = postParams.name;
              this.mUser.surname = postParams.surname;
              this.mUser.email = postParams.email;
              this.mUser.type = postParams.type;
              this.mUser.rating = "0";
              this.mUser.avatar = "http://n22.mikex.ru/uploads/images/default_avatar.png";
              this.mUser.password = JSON.stringify(Md5.hashStr(this.navParams.get("password")));
              this.userManager.saveUser(this.mUser.build());
                this.rootPage = JudgeMainPage;
                switch (postParams.type) {
                  case "1": this.rootPage = JudgeMainPage; break;
                  case "2": this.rootPage = TrainerMainPage; break;
                  case "3": this.rootPage = SportsmanMainPage; break;
                  case "4": this.rootPage = FanMainPage; break;
                }
                this.navCtrl.push(this.rootPage);
                this.navCtrl.setRoot(this.rootPage);
            }
          }, error => {
            this.toastCtrl.create({message: "Res: " + JSON.stringify(error), duration: 3000}).present();
          });
  }
}
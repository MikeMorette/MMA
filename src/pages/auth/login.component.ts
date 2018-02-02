import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';
import { UserManager } from '../../api/providers/user';

import { RegisterPage } from './register.component';
import { JudgeMainPage } from '../judge/judge.component';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { TrainerMainPage } from '../trainer/trainer.component';
import { SportsmanMainPage } from '../sportsman/sportsman.component';
import { FanMainPage } from '../fan/fan.component';
import { MyApp } from '../../app/app.component';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { App } from 'ionic-angular/components/app/app';
      
import { HTTP } from '@ionic-native/http';
import { NativeStorage } from '@ionic-native/native-storage';

class User {
  constructor(public login: string, public password: string) { }
}

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [UserManager]
})
export class LoginPage {
  mUser = new User("", "");
  rootPage = null;
  error = "";

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public toastCtrl: ToastController, 
    public secureStorage: SecureStorage,
    public userManager: UserManager,
    public viewCtrl: ViewController,
    private http: HTTP,
    public appCtrl: App,
    public nS: NativeStorage) { }

  openRegister(event) {
    this.navCtrl.push(RegisterPage);
  }

  login(event) {
    this.toastCtrl.create({message: "Click at LOGIN button", duration: 3000}).present();
    if (this.mUser.login && this.mUser.password) {
      let postParams = {login: this.mUser.login, password: Md5.hashStr(this.mUser.password)}
      /*this.http.post('http://n22.mikex.ru/v1/login', postParams, {"Authorization": 'MikeX_Az10TWlrZUxlZV9rZXkvY6BpL3NpdGUvYXBpw11jg2Mjk4OTIzNzg1ODIzNjc5'})
  .then(data => {

    this.toastCtrl.create({message: "Res: " + JSON.stringify(data.status), duration: 3000}).present();
    this.toastCtrl.create({message: "Res: " + JSON.stringify(data.data), duration: 3000}).present();
    this.toastCtrl.create({message: "Res: " + JSON.stringify(data.headers), duration: 3000}).present();
    this.error = "Res: " + JSON.stringify(data.status) + " | " + JSON.stringify(data.data) + " | " + JSON.stringify(data.headers);
    console.log(data.status);
    console.log(data.data); // data received by server
    console.log(data.headers);

  }).catch(error => {
    this.toastCtrl.create({message: "Res: " + JSON.stringify(error.status), duration: 3000}).present();
    this.toastCtrl.create({message: "Res: " + JSON.stringify(error.error), duration: 3000}).present();
    this.toastCtrl.create({message: "Res: " + JSON.stringify(error.headers), duration: 3000}).present();
    this.error = "Res: " + JSON.stringify(error.status) + " | " + JSON.stringify(error.error) + " | " + JSON.stringify(error.headers);
    console.log(error.status);
    console.log(error.error); // error message as string
    console.log(error.headers);

  });*/
      this.userManager.login(postParams)
        .subscribe(data => {
          let result = JSON.parse(data['_body']);
          this.toastCtrl.create({message: "Res: " + JSON.stringify(result), duration: 3000}).present();
          this.error = JSON.stringify(result);
          if (JSON.stringify(result.error) == "1") {
            this.toastCtrl.create({message: "Неверные логин и/или пароль", duration: 3000}).present();
          } else {
            //this.userManager.saveUser(result.user);
            this.nS.setItem('auth', "1");
            this.nS.setItem("user_id", JSON.stringify(result.user.id));
            this.nS.setItem("name", result.user.name);
            this.nS.setItem("surname", result.user.surname);
            this.nS.setItem("email", result.user.email);
            this.nS.setItem("avatar", "" + result.user.avatar);
            this.nS.setItem("rating", result.user.rating);
            this.nS.setItem("type", "" + result.user.type).then(data => {
              switch ("" + result.user.type) {
                case "1": this.rootPage = JudgeMainPage; break;
                case "2": this.rootPage = TrainerMainPage; break;
                case "3": this.rootPage = SportsmanMainPage; break;
                case "4": this.rootPage = FanMainPage; break;
              }
              this.toastCtrl.create({message: "Type is: " + result.user.type, duration: 3000}).present();
              //this.navCtrl.popToRoot(this.rootPage);
              this.navCtrl.push(this.rootPage);
              this.navCtrl.setRoot(this.rootPage);
              this.viewCtrl.dismiss();
              this.appCtrl.getRootNav().push(this.rootPage);
            }, err => {

              this.toastCtrl.create({message: "Type is: " + err, duration: 3000}).present();
            });
            //this.rootPage = JudgeMainPage;
                  
          }
        }, error => {
          this.error = JSON.stringify(error);
          this.toastCtrl.create({message: "Res: " + JSON.stringify(error), duration: 3000}).present();
        });
    } else {
      let toast = this.toastCtrl.create({
        message: 'Заполните все поля!',
        duration: 3000
      });
      toast.present();
    }
  }

}
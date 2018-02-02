import { Component } from '@angular/core';

import { UserManager } from '../../../api/providers/user';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { User } from '../../../_models/user';
import { SecureStorageObject } from '@ionic-native/secure-storage';
import { TrainerMainPage } from '../trainer.component';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-trainer-ionic',
  templateUrl: 'add.component.html',
  providers: [UserManager]
})
export class AddFighterPage {
  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  user = this.mUser.build();
  search: string = "";
  users = null;
  selectedUser = null;

  constructor(public uM: UserManager, public nS: NativeStorage, public tC: ToastController, public nav: NavController) {
      nS.getItem("user_id").then(data => {
        this.user.id = parseInt(data);
        this.uM.getSportsmans(this.search).subscribe(data => {
          let result = JSON.parse(data['_body']);
          this.users = result.users;
          this.tC.create({message: "getSportsmans() => " + JSON.stringify(result), duration: 3000}).present();
        }, err => {
          this.tC.create({message: "getSportsmans() => " + JSON.stringify(err), duration: 3000}).present();
        });
      });
      nS.getItem("name").then(data => {this.user.name = data;});
      nS.getItem("surname").then(data => {this.user.surname = data;});
      nS.getItem("email").then(data => {this.user.email = data;});
      nS.getItem("type").then(data => {this.user.type = data;});
      nS.getItem("avatar").then(data => {this.user.avatar = data;});
  }

  searchAction() {
    this.uM.getSportsmans(this.search).subscribe(data => {
      let result = JSON.parse(data['_body']);
      this.users = result.users;
      this.tC.create({message: "getSportsmans() => " + JSON.stringify(result), duration: 3000}).present();
    }, err => {
      this.tC.create({message: "getSportsmans() => " + JSON.stringify(err), duration: 3000}).present();
    });
  }

  selectUser(u) {
    this.selectedUser = u;
  }

  addFighter() {
    this.uM.sendNotify(this.user.id, this.selectedUser.id).subscribe(data => {
      let result = JSON.parse(data['_body']);
      
      this.tC.create({message: "Уведомление бойцу успешно отправлено", duration: 3000}).present();
      this.tC.create({message: "sendNotify() => " + JSON.stringify(result), duration: 3000}).present();
    }, err => {
      this.tC.create({message: "sendNotify() => " + JSON.stringify(err), duration: 3000}).present();
    });
    this.nav.push(TrainerMainPage);
    this.nav.setRoot(TrainerMainPage);
  }
}
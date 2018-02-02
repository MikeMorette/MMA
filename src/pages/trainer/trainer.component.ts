import { Component } from '@angular/core';

import { UserManager } from '../../api/providers/user';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { User } from '../../_models/user';
import { SecureStorageObject } from '@ionic-native/secure-storage';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { AddFighterPage } from './add/add.component';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-trainer-ionic',
  templateUrl: 'trainer.component.html',
  providers: [UserManager]
})
export class TrainerMainPage {
  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  user = this.mUser.build();

  fightersCount = "0";
  fightersList = null;
  fightersNulled = false;

  constructor(public uM: UserManager, public nS: NativeStorage, public toastCtrl: ToastController, public nav: NavController) {
    nS.getItem("user_id").then(data => {
      this.user.id = parseInt(data);
      uM.getRates(this.user.id).subscribe(data => {
        let result = JSON.parse(data['_body']);
        this.user.rating = result.rating;
        nS.setItem("rating", result.rating);
      }, err => {
        this.toastCtrl.create({message: "getRating() => " + JSON.stringify(err), duration: 3000}).present();
      });
        uM.getFighters(this.user.id).subscribe(data => {
          let result = JSON.parse(data['_body']);
          
          this.fightersList = result.fights.list;
          this.fightersCount = result.fights.count;

          if (result.fights.count == "0") {
            this.fightersNulled = true;
          }

          this.toastCtrl.create({message: "getFighters() => " + JSON.stringify(result), duration: 3000}).present();

        }, err => {
          this.toastCtrl.create({message: "getFighters() => " + JSON.stringify(err), duration: 3000}).present();
        });
    });
    nS.getItem("name").then(data => {this.user.name = data;});
    nS.getItem("surname").then(data => {this.user.surname = data;});
    nS.getItem("email").then(data => {this.user.email = data;});
    nS.getItem("type").then(data => {this.user.type = data;});
    nS.getItem("avatar").then(data => {this.user.avatar = data;});
  }

  addFighter() {
    this.nav.push(AddFighterPage);
  }

}
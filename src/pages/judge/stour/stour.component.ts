import { Component } from '@angular/core';

import { User } from "../../../_models/user";
import { JudgeManager } from "../../../api/providers/judge";
import { UserManager } from "../../../api/providers/user";
import { ToastController } from "ionic-angular/components/toast/toast-controller";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { SecureStorageObject } from '@ionic-native/secure-storage';
import { FormGroup, FormControl } from '@angular/forms';
import { JudgeSWeightPage } from '../sweight/sweight.component';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-judge-stour-ionic',
  templateUrl: 'stour.component.html',
  providers: [JudgeManager, UserManager]
})

export class JudgeSTourPage {
  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  user = this.mUser.build();

  isFan = false;

  types;
  typeForm;
  
  tournaments = null;

  constructor(public uM: UserManager, public nS: NativeStorage, public jM: JudgeManager, public toastCtrl: ToastController, public nav: NavController, public nP: NavParams) {
    this.typeForm = new FormGroup({
      "types": new FormControl({value: '1', disabled: false})
    });
    nS.getItem("user_id").then(data => {
        this.user.id = parseInt(data);
        jM.getTournaments().subscribe(data => {
          let result = JSON.parse(data['_body']);
          this.tournaments = result.tournaments;
          this.toastCtrl.create({message: "getTournaments() => " + JSON.stringify(result), duration: 3000}).present();
        }, error => {
          this.toastCtrl.create({message: "getTournaments() => " + JSON.stringify(error), duration: 3000}).present();
        });
      });
      nS.getItem("name").then(data => {this.user.name = data;});
      nS.getItem("surname").then(data => {this.user.surname = data;});
      nS.getItem("email").then(data => {this.user.email = data;});
      nS.getItem("type").then(data => {
        this.user.type = data;
        if (data == "4") {
          this.isFan = true;
        }
      });
      nS.getItem("avatar").then(data => {this.user.avatar = data;});
   
  }

  next() {
    if (this.nP.get("svote")) {
      this.nav.push(JudgeSWeightPage, {tournamentType: this.typeForm.value.types, svote: true});
    } else if (this.nP.get("jvote")) {
      this.nav.push(JudgeSWeightPage, {tournamentType: this.typeForm.value.types, jvote: true});
    } else if (this.nP.get("fund")) {
      this.nav.push(JudgeSWeightPage, {tournamentType: this.typeForm.value.types, fund: true});
    } else {
      this.nav.push(JudgeSWeightPage, {tournamentType: this.typeForm.value.types});
    }
  }

}
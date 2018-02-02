import { Component } from '@angular/core';

import { User } from "../../../_models/user";
import { JudgeManager } from "../../../api/providers/judge";
import { UserManager } from "../../../api/providers/user";
import { ToastController } from "ionic-angular/components/toast/toast-controller";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { SecureStorageObject } from '@ionic-native/secure-storage';
import { FormGroup, FormControl } from '@angular/forms';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { ControlTournamentPage } from './control/control.component';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-judge-tournament-ionic',
  templateUrl: 'tournament.component.html',
  providers: [JudgeManager, UserManager]
})

export class JudgeTournamentPage {
  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  user = this.mUser.build();

  tType;
  weight;
  stages;
  stagesRes;
  stagesNulled = false;
  selectedFight;

  constructor(public uM: UserManager, public nS: NativeStorage, public jM: JudgeManager, public toastCtrl: ToastController, public nav: NavController, public navParams: NavParams) {
    this.tType = navParams.get("tournamentType");
    this.weight = navParams.get("weight");
    //this.toastCtrl.create({message: "getStanding() => " + this.tType + " | " + this.weight, duration: 3000}).present();

    nS.getItem("user_id").then(data => {
        this.user.id = parseInt(data);
        this.jM.getStanding(this.tType, this.weight).subscribe(data => {
          let result = JSON.parse(data['_body']);
          this.tType = result.t.name;
          this.weight = result.w.weight;
          this.stages = result.stages;
          this.stagesRes = result;
          if (result.stages.length == 0) {
            this.stagesNulled = true;
          }
          this.toastCtrl.create({message: "getStanding() => " + JSON.stringify(result), duration: 3000}).present();
        }, err => {
          this.toastCtrl.create({message: "getStanding() => " + JSON.stringify(err), duration: 3000}).present();
        });
      });
      nS.getItem("name").then(data => {this.user.name = data;});
      nS.getItem("surname").then(data => {this.user.surname = data;});
      nS.getItem("email").then(data => {this.user.email = data;});
      nS.getItem("type").then(data => {this.user.type = data;});
      nS.getItem("avatar").then(data => {this.user.avatar = data;});
   
  }

  selectFight(item) {
    this.selectedFight = item;
    this.nav.push(ControlTournamentPage, {fight: item, stage_id: this.stagesRes.stage_id});
    this.toastCtrl.create({message: "selectFight() => " + JSON.stringify(item), duration: 3000}).present();
  }

}
import { Component } from '@angular/core';

import { User } from "../../../_models/user";
import { JudgeManager } from "../../../api/providers/judge";
import { UserManager } from "../../../api/providers/user";
import { ToastController } from "ionic-angular/components/toast/toast-controller";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { SecureStorageObject } from '@ionic-native/secure-storage';
import { FormGroup, FormControl } from '@angular/forms';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { JudgeTournamentPage } from '../tournament/tournament.component';
import { SVotePage } from '../../fan/svote/svote.component';
import { FundPage } from '../../fan/fund/fund.component';
import { JVotePage } from '../../fan/jvote/jvote.component';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-judge-sweight-ionic',
  templateUrl: 'sweight.component.html',
  providers: [JudgeManager, UserManager]
})

export class JudgeSWeightPage {
  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  user = this.mUser.build();

  isFan = false;

  weights;
  weightForm;
  
  weightsList = null;

  tournamentType;

  constructor(public uM: UserManager, public nS: NativeStorage, public jM: JudgeManager, public toastCtrl: ToastController, public nav: NavController, public nP: NavParams) {
    this.tournamentType = nP.get("tournamentType");
    this.weightForm = new FormGroup({
      "weights": new FormControl({value: '1', disabled: false})
    });
    nS.getItem("user_id").then(data => {
        this.user.id = parseInt(data);
        jM.getWeights().subscribe(data => {
          let result = JSON.parse(data['_body']);
          this.weightsList = result.weightsList;
          this.toastCtrl.create({message: "getWeights() => " + JSON.stringify(result), duration: 3000}).present();
        }, err => {
          this.toastCtrl.create({message: "getWeights() => " + JSON.stringify(err), duration: 3000}).present();
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
      this.nav.push(SVotePage, {tournamentType: this.tournamentType, weight: this.weightForm.value.weights});
    } else if (this.nP.get("jvote")) {
      this.nav.push(JVotePage, {tournamentType: this.tournamentType, weight: this.weightForm.value.weights});
    } else if (this.nP.get("fund")) {
      this.nav.push(FundPage, {tournamentType: this.tournamentType, weight: this.weightForm.value.weights});
    } else {
      this.nav.push(JudgeTournamentPage, {tournamentType: this.tournamentType, weight: this.weightForm.value.weights});
    }
  }

}
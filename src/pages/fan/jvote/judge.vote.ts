import { Component } from '@angular/core';

import { UserManager } from '../../../api/providers/user';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { User } from '../../../_models/user';
import { SecureStorageObject } from '@ionic-native/secure-storage';
import { JudgeManager } from '../../../api/providers/judge';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NativeStorage } from '@ionic-native/native-storage';

class Judge {
  constructor(public surname: string, public name: string) {}
}

@Component({
  selector: 'page-judge-vote-ionic',
  templateUrl: 'judge.vote.html'
})
export class JudgeVoteAPage {
  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  user = this.mUser.build();

  tType;
  weight;
  stage;

  judge = new Judge("", "");

  gradeValue;

  fightEnded = false;
  alreadyGraded = false;
  judgeGrade;
  stage_id;

  constructor(public uM: UserManager, public nS: NativeStorage, public jM: JudgeManager, public toastCtrl: ToastController, public nav: NavController, public navParams: NavParams) {
    this.stage = navParams.get("stage");
    this.tType = navParams.get("tournamentType");
    this.weight = navParams.get("weight");
    this.stage_id = navParams.get("stage_id");

    nS.getItem("user_id").then(data => {this.user.id = parseInt(data);});
    nS.getItem("name").then(data => {this.user.name = data;});
    nS.getItem("surname").then(data => {this.user.surname = data;});
    nS.getItem("email").then(data => {this.user.email = data;});
    nS.getItem("type").then(data => {this.user.type = data;});
    nS.getItem("avatar").then(data => {this.user.avatar = data;});
    nS.getItem("liked").then(data => {this.user.liked = data;});

    if (this.stage.status == '1') {
      this.fightEnded = true;
      this.judge.name = this.stage.judge.name;
      this.judge.surname = this.stage.judge.surname;

      nS.getItem("judge_grade_" + this.stage.stage_id).then(data => {
        this.alreadyGraded = true;
        this.judgeGrade = "+" + data;
      }, err => {
        this.toastCtrl.create({message: "judge_grade() => " + JSON.stringify(err), duration: 3000}).present();
      });
    }

    

  }

  setGrade() {
    this.uM.setGrade(this.stage.judge.id, this.gradeValue).subscribe(data => {
      let result = JSON.parse(data["_body"]);
      this.nS.setItem("judge_grade_" + this.stage.stage_id, this.gradeValue);
      this.alreadyGraded = true;
      this.judgeGrade = "+" + this.gradeValue;
      this.toastCtrl.create({message: "setGrade() => " + JSON.stringify(result), duration: 3000}).present();
    }, err => {
      this.toastCtrl.create({message: "setGrade() => " + JSON.stringify(err), duration: 3000}).present();
    });
  }

  setDownGrade(x) {
    this.uM.setDownGrade(this.stage.judge.id, x).subscribe(data => {
      let result = JSON.parse(data["_body"]);
      this.nS.setItem("judge_grade", x);
      this.alreadyGraded = true;
      this.judgeGrade = "-" + x;
      this.toastCtrl.create({message: "setGrade() => " + JSON.stringify(result), duration: 3000}).present();
    }, err => {
      this.toastCtrl.create({message: "setGrade() => " + JSON.stringify(err), duration: 3000}).present();
    });
  }
}
import { Component } from '@angular/core';

import { User } from "../../../../_models/user";
import { JudgeManager } from "../../../../api/providers/judge";
import { UserManager } from "../../../../api/providers/user";
import { ToastController } from "ionic-angular/components/toast/toast-controller";
import { NavController } from "ionic-angular/navigation/nav-controller";
import { SecureStorageObject } from '@ionic-native/secure-storage';
import { FormGroup, FormControl } from '@angular/forms';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { JudgeMainPage } from '../../judge.component';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-control-tournament-ionic',
  templateUrl: 'control.component.html',
  providers: [JudgeManager, UserManager]
})

export class ControlTournamentPage {
  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  user = this.mUser.build();

  selectedFight;
  stage_id;
  isActive = false;
  isFightClosed = false;
  winner;
  winnerId;
  fight_id;

  constructor(public uM: UserManager, public jM: JudgeManager, public nS: NativeStorage, public toastCtrl: ToastController, public alertCtrl: AlertController, public nav: NavController, public navParams: NavParams) {
    this.selectedFight = navParams.get("fight");
    this.stage_id = navParams.get("stage_id");
    nS.getItem("user_id").then(data => {
        this.user.id = parseInt(data);
        this.jM.checkFight(this.selectedFight, this.stage_id, this.user.id).subscribe(data => {
          let result = JSON.parse(data['_body']);
          if (result.fight_status == "1") {
            this.isFightClosed = true;
            this.winner = result.fight_winner;
            this.winnerId = result.fight_winner.id;
            this.toastCtrl.create({message: "checkFight() => " + JSON.stringify(this.winner), duration: 3000}).present();
          }
        }, err => {
          this.toastCtrl.create({message: "checkFight() => " + JSON.stringify(err), duration: 3000}).present();
        });
      });
      nS.getItem("name").then(data => {this.user.name = data;});
      nS.getItem("fight_id").then(data => {this.fight_id = data;});
      nS.getItem("surname").then(data => {this.user.surname = data;});
      nS.getItem("email").then(data => {this.user.email = data;});
      nS.getItem("type").then(data => {this.user.type = data;});
      nS.getItem("avatar").then(data => {this.user.avatar = data;});
      nS.getItem("fightGoing").then(data => {
        if (data == "1") {
          this.isActive = true;
        } else {
          this.isActive = false;
        }
    });
   
  }

  startFight() {
    //this.nav.setRoot(ControlTournamentPage);
    this.jM.startFight(this.selectedFight, this.stage_id, this.user.id).subscribe(data => {
      let result = JSON.parse(data['_body']);
        this.nS.setItem("fightGoing", "1");
        this.nS.setItem("fight_id", "" + result.fight_id);
        this.fight_id = result.fight_id;
        this.isActive = true;
    }, err => {
      this.toastCtrl.create({message: "startFight() => " + JSON.stringify(err), duration: 3000}).present();
    });
  }

  finishFight() {
    //this.nav.setRoot(JudgeMainPage);
    let alert = this.alertCtrl.create();
    alert.setTitle('Выберите победителя');

    alert.addInput({
      type: 'radio',
      label: this.selectedFight.user1.surname + " " + this.selectedFight.user1.name,
      value: "" + this.selectedFight.user1.id,
      checked: true
    });
    
    alert.addInput({
      type: 'radio',
      label: this.selectedFight.user2.surname + " " + this.selectedFight.user2.name,
      value: "" + this.selectedFight.user2.id,
      checked: false
    });

    alert.addButton('Отмена');
    alert.addButton({
      text: 'Выбрать',
      handler: res => {
        //this.testRadioOpen = false;
        //this.testRadioResult = data;
        this.toastCtrl.create({message: "alert() => " + JSON.stringify(res), duration: 3000}).present();
          this.nS.setItem("fightGoing", "0");
          this.jM.finishFight(this.fight_id, res).subscribe(data => {
            let result = JSON.parse(data['_body']);
              this.nS.setItem("fightGoing", "0");
              this.isActive = false;
              this.isFightClosed = true;
                  this.isFightClosed = true;
                  this.winner = result.fight_winner;
                  this.winnerId = result.fight_winner.id;
          }, err => {
            this.toastCtrl.create({message: "finishFight() => " + JSON.stringify(err), duration: 3000}).present();
          });
      }
    });
    alert.present();
    
  }

}
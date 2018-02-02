import { Component } from '@angular/core';

import { UserManager } from '../../api/providers/user';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { User } from '../../_models/user';
import { SecureStorageObject } from '@ionic-native/secure-storage';
import { JudgeManager } from '../../api/providers/judge';
import { Camera } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AvatarModalPage } from '../../app/modals/avatar.modal';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-sportsman-ionic',
  templateUrl: 'sportsman.component.html',
  providers: [JudgeManager, UserManager]
})
export class SportsmanMainPage {
  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  user = this.mUser.build();
  
  fightsType: string = "1";
  fightsNulled = false;
  fights = null;
  fightsFor = null;

  all = "0";
  win = "0";
  won = "0";

  constructor(public camera: Camera, public nS: NativeStorage, public uM: UserManager, public jM: JudgeManager, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public modalCtrl: ModalController) {
      nS.getItem("user_id").then(data => {
        this.user.id = parseInt(data);
        uM.getRate(this.user.id).subscribe(data => {
          let result = JSON.parse(data['_body']);
          this.user.rating = result.rating;
          nS.setItem("rating", result.rating);
        }, err => {
          this.toastCtrl.create({message: "getRating() => " + JSON.stringify(err), duration: 3000}).present();
        });
        jM.getSMFights(this.user.id, this.fightsType).subscribe(data => {
          let result = JSON.parse(data['_body']);
          
          this.fights = result.fights;
          this.fightsFor = result.fights.for;

          if (result.fights.for.length == 0) {
            this.fightsNulled = true;
          } else {
            this.fightsNulled = false;
          }
          this.all = result.fights.all;
          this.win = result.fights.win;
          this.won = result.fights.won;

          this.toastCtrl.create({message: "getSMFights() => " + JSON.stringify(result), duration: 3000}).present();

        }, err => {
          this.toastCtrl.create({message: "getSMFights() => " + JSON.stringify(err), duration: 3000}).present();
        });
      });
      nS.getItem("name").then(data => {this.user.name = data;});
      nS.getItem("surname").then(data => {this.user.surname = data;});
      nS.getItem("email").then(data => {this.user.email = data;});
      nS.getItem("type").then(data => {this.user.type = data;});
      nS.getItem("avatar").then(data => {this.user.avatar = data;});

  }

  onChange(opt) {
    this.toastCtrl.create({message: "stpSelect() => " + this.fightsType, duration: 3000}).present();
    this.jM.getSMFights(this.user.id, this.fightsType).subscribe(data => {
      let result = JSON.parse(data['_body']);
      
      this.fights = result.fights;
      this.fightsFor = result.fights.for;

      if (result.fights.for.length == 0) {
        this.fightsNulled = true;
      } else {
        this.fightsNulled = false;
      }

      this.all = result.fights.all;
      this.win = result.fights.win;
      this.won = result.fights.won;

      this.toastCtrl.create({message: "getSMFights() => " + JSON.stringify(result), duration: 3000}).present();

    }, err => {
      this.toastCtrl.create({message: "getSMFights() => " + JSON.stringify(err), duration: 3000}).present();
    });
  }

  openAvatarMenu() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Аватарка',
      buttons: [
        {
          text: 'Открыть',
          handler: () => {
            let modal = this.modalCtrl.create(AvatarModalPage, {url: this.user.avatar});
            modal.present();
            actionSheet.dismiss();
          }
        },{
          text: 'Обновить',
          handler: () => {
            //console.log('Archive clicked');
            if (Camera['installed']()) {
              this.camera.getPicture({
                destinationType: this.camera.DestinationType.DATA_URL,
                targetWidth: 400,
                targetHeight: 400
              }).then((data) => {
                //this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
                this.uM.updateAvatar(this.user.id, '' + data).subscribe(data => {
                  let result = JSON.parse(data['_body']);
                  this.user.avatar = result.avatar;
                  this.nS.setItem("avatar", result.avatar);
                  this.toastCtrl.create({message: "uM.updateAvatar() => " + JSON.stringify(result), duration: 3000}).present();
                }, err => {
                  this.toastCtrl.create({message: "uM.updateAvatar() => " + JSON.stringify(err), duration: 3000}).present();
                });
              }, (err) => {
                alert('Unable to take photo');
              })
            } else {
              //this.fileInput.nativeElement.click();
            }
          }
        },{
          text: 'Закрыть',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
            actionSheet.dismiss();
          }
        }
      ]
    });
    actionSheet.present();
  }
  
}
import { Component } from '@angular/core';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { User } from '../../_models/user';
import { SecureStorageObject } from '@ionic-native/secure-storage';
import { NavController } from 'ionic-angular/navigation/nav-controller';

import { UserManager } from '../../api/providers/user';
import { JudgeManager } from '../../api/providers/judge';
import { JudgeSTourPage } from './stour/stour.component';
import { MyApp } from '../../app/app.component';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { AvatarModalPage } from '../../app/modals/avatar.modal';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { Camera } from '@ionic-native/camera';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-judge-ionic',
  templateUrl: 'judge.component.html',
  providers: [JudgeManager, UserManager]
})

export class JudgeMainPage {
  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  user = this.mUser.build();

  fights = null;
  fightsNulled = false;

  constructor(public camera: Camera, public nS: NativeStorage, public userManager: UserManager, public jM: JudgeManager, public toastCtrl: ToastController, public nav: NavController, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController) {
    
    nS.getItem("user_id").then(data => {
        this.user.id = parseInt(data);
        userManager.getRating(this.user.id).subscribe(data => {
          let result = JSON.parse(data['_body']);
          this.user.rating = result.rating;
          nS.setItem("rating", result.rating);
          this.toastCtrl.create({message: "getRating() => " + JSON.stringify(result), duration: 3000}).present();
        }, err => {
          this.toastCtrl.create({message: "getRating() => " + JSON.stringify(err), duration: 3000}).present();
        });
        jM.getCompletedFights(this.user.id).subscribe(data => {
          let result = JSON.parse(data['_body']);
          
          this.fights = result.fights;

          if (result.fights.length == 0) {
            this.fightsNulled = true;
          }

          this.toastCtrl.create({message: "getCompletedFights() => " + result.fights.length, duration: 3000}).present();

        }, err => {
          this.toastCtrl.create({message: "getCompletedFights() => " + err, duration: 3000}).present();
        });
      });
      nS.getItem("name").then(data => {this.user.name = data;});
      nS.getItem("surname").then(data => {this.user.surname = data;});
      nS.getItem("email").then(data => {this.user.email = data;});
      nS.getItem("type").then(data => {this.user.type = data;});
      nS.getItem("avatar").then(data => {this.user.avatar = data;});
      
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
                this.userManager.updateAvatar(this.user.id, '' + data).subscribe(data => {
                  let result = JSON.parse(data['_body']);
                  this.user.avatar = result.avatar;
                    this.nS.setItem("avatar", result.avatar);
                  this.toastCtrl.create({message: "userManager.updateAvatar() => " + JSON.stringify(result), duration: 3000}).present();
                }, err => {
                  this.toastCtrl.create({message: "userManager.updateAvatar() => " + JSON.stringify(err), duration: 3000}).present();
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

  goJudge() {
    this.nav.push(JudgeSTourPage);
  }

}
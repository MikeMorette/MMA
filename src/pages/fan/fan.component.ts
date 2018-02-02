import { Component } from '@angular/core';

import { UserManager } from '../../api/providers/user';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { User } from '../../_models/user';
import { SecureStorageObject } from '@ionic-native/secure-storage';
import { SVotePage } from './svote/svote.component';
import { NavController } from 'ionic-angular/navigation/nav-controller';
import { JVotePage } from './jvote/jvote.component';
import { FundPage } from './fund/fund.component';
import { SupportPage } from './support/support.component';
import { Camera } from '@ionic-native/camera';
import { AvatarModalPage } from '../../app/modals/avatar.modal';
import { ModalController } from 'ionic-angular/components/modal/modal-controller';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { JudgeSTourPage } from '../judge/stour/stour.component';
import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: 'page-fan-ionic',
  templateUrl: 'fan.component.html'
})
export class FanMainPage {
  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  user = this.mUser.build();
  
  constructor(public uM: UserManager, public nS: NativeStorage, public tC: ToastController, public nav: NavController, public mC: ModalController, public aSC: ActionSheetController, public camera: Camera) {

    nS.getItem("user_id").then(data => {
        this.user.id = parseInt(data);
        
      });
      nS.getItem("name").then(data => {this.user.name = data;});
      nS.getItem("surname").then(data => {this.user.surname = data;});
      nS.getItem("email").then(data => {this.user.email = data;});
      nS.getItem("type").then(data => {this.user.type = data;});
      nS.getItem("avatar").then(data => {this.user.avatar = data;});

  }

  openPage(p) {
    let page = null;
    let params = null;
    switch (p) {
      case 1:
        page = JudgeSTourPage;
        params = {svote: true};
        break;
      case 2:
        page = JudgeSTourPage;
        params = {jvote: true};
        break;
      case 3:
        page = SupportPage;
        break;
      case 4:
        page = JudgeSTourPage;
        params = {fund: true};
        break;
    }
    this.nav.push(page, params);
    //this.nav.setRoot(page);
  }

  openAvatarMenu() {
    let actionSheet = this.aSC.create({
      title: 'Аватарка',
      buttons: [
        {
          text: 'Открыть',
          handler: () => {
            let modal = this.mC.create(AvatarModalPage, {url: this.user.avatar});
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
                  this.uM.getUser().then((storage: SecureStorageObject) => {
                    storage.set("avatar", result.avatar);
                  });
                  this.tC.create({message: "userManager.updateAvatar() => " + JSON.stringify(result), duration: 3000}).present();
                }, err => {
                  this.tC.create({message: "userManager.updateAvatar() => " + JSON.stringify(err), duration: 3000}).present();
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
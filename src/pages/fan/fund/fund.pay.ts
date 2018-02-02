import { Component } from '@angular/core';

import { UserManager } from '../../../api/providers/user';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { User } from '../../../_models/user';
import { SecureStorageObject } from '@ionic-native/secure-storage';
import { NavParams } from 'ionic-angular/navigation/nav-params';
import { NativeStorage } from '@ionic-native/native-storage';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-pay-ionic',
  templateUrl: 'fund.pay.html'
})
export class FundPayPage {
  mUser = new User(0, "", "", "", "", "", "", "", "", "", "");
  user = this.mUser.build();

  selectedUser = null;
  payCount = "0";
  
  constructor(public iab: InAppBrowser, public uM: UserManager, public nS: NativeStorage, public tC: ToastController, public nP: NavParams) {
    this.selectedUser = nP.get("stage");

    nS.getItem("user_id").then(data => {
        this.user.id = parseInt(data);
        
      });
      nS.getItem("name").then(data => {this.user.name = data;});
      nS.getItem("surname").then(data => {this.user.surname = data;});
      nS.getItem("email").then(data => {this.user.email = data;});
      nS.getItem("type").then(data => {this.user.type = data;});
      nS.getItem("avatar").then(data => {this.user.avatar = data;});
  }

  pay() {
    let desc = "Финансовая подждержка для боя: " + this.selectedUser.user1.surname + " " + this.selectedUser.user1.name + " VS " + this.selectedUser.user2.surname + " " + this.selectedUser.user2.name;
    this.uM.addPay(this.user.id, desc).subscribe((data: any) => {
      let result = JSON.parse(data['_body']);
      const browser = this.iab.create('https://sci.interkassa.com/?ik_co_id=5a72c6683b1eaf18508b456d&ik_pm_no='+result.pay_id+'&ik_am='+this.payCount+'&ik_cur=RUB&ik_desc='+desc+'&ik_exp=2018-02-02&ik_x_type=1&ik_x_ids='+this.selectedUser.user1.id+':'+this.selectedUser.user2.id);
    
    }, err => {

    });
  }
  
}
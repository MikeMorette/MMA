import { Component } from '@angular/core';

import { ModalController, Platform, NavParams, ViewController } from 'ionic-angular';

@Component({
  template: `
<ion-content style="background:#171a1c;margin-top:22px;text-align:center;">
  <img src="http://n22.mikex.ru/uploads/images/{{ avatar }}" style="text-align:center;" />
</ion-content>
`
})
export class AvatarModalPage {
  avatar;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController
  ) {
    this.avatar = params.get("url");
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}

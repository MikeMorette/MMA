import { Injectable } from "@angular/core";
import { Api } from "../api";
import { SecureStorage } from "@ionic-native/secure-storage";
import { ToastController } from "ionic-angular/components/toast/toast-controller";

@Injectable()
export class TrainerManager {
  constructor(public api: Api, public secureStorage: SecureStorage, public toastCtrl: ToastController) { }

  getFighters(uid) {
    return this.api.get('trainer/list/' + uid + '/');
  }

}
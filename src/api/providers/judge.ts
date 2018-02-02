import { Injectable } from "@angular/core";
import { Api } from "../api";
import { SecureStorage } from "@ionic-native/secure-storage";
import { ToastController } from "ionic-angular/components/toast/toast-controller";

@Injectable()
export class JudgeManager {
  constructor(public api: Api, public secureStorage: SecureStorage, public toastCtrl: ToastController) { }

  getTournaments() {
    return this.api.get('judge/fights/tournaments/');
  }

  getWeights() {
    return this.api.get('judge/fights/weights/');
  }

  getStanding(t, w) {
    return this.api.get('standing/pag/'+ t + "/" + w + "/1/");
  }

  startFight(sf, si, ui) {
    return this.api.get('judge/fights/start/?jid=' + ui + '&sid=' + si + '&u1=' + sf.user1.id + '&u2=' + sf.user2.id);
  }

  finishFight(fid, wid) {
    return this.api.get('judge/fights/finish/' + fid + '/?wid=' + wid);
  }

  checkFight(sf, si, ui) {
    return this.api.get('judge/fights/check/?jid=' + ui + '&sid=' + si + '&u1=' + sf.user1.id + '&u2=' + sf.user2.id);
  }

  getCompletedFights(uid) {
    return this.api.get('judge/fights/'+ uid +'/completed/');
  }

  getSMFights(uid, type) {
    return this.api.get('sportsman/fights/'+ uid +'/' + type + '/');
  }

}
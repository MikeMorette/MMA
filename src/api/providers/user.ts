import { Injectable } from '@angular/core';

import { Api } from '../api';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';
import { User } from '../../_models/user';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class UserManager {
  _user: any;
  rootPage = null;
  title = "asd";

  constructor(public api: Api, public secureStorage: SecureStorage, public toastCtrl: ToastController, public nS: NativeStorage) { }

  login(accountInfo: any) {
    return this.api.post('login', accountInfo);
  }

  register(accountInfo: any) {
    return this.api.post('register', accountInfo);
  }

  getFighters(uid) {
    return this.api.get('trainer/list/' + uid + '/');
  }

  registerToken(id, token) {
    return this.api.get('fcm/register/'+id+'/?fb=' + token);
  }

  getRating(uid) {
    return this.api.get('user/rating/' + uid + '/');
  }

  addPay(uid, desc) {
    return this.api.get('user/payment/' + uid + '/?desc=' + desc);
  }

  getRate(uid) {
    return this.api.get('user/rate/' + uid + '/');
  }

  getRates(uid) {
    return this.api.get('user/rates/' + uid + '/');
  }

  setGrade(jid, x) {
    return this.api.get('judge/grade/plus/' + jid + '/?rate=' + x);
  }

  setDownGrade(jid, x) {
    return this.api.get('judge/grade/minus/' + jid + '/?rate=' + x);
  }

  sendNotify(uid, fid) {
    return this.api.get('trainer/send/' + uid + '/' + fid + '/');
  }

  getUser() {
    return this.secureStorage.create('user_settings');
  }

  setLiked(myid, id) {
    return this.api.get('like?myid=' + myid + '&uid=' + id);
  }

  getSportsmans(search) {
    return this.api.get('sportsmans?s=' + search);
  }

  getTitle() {
    return this.title;
  }

  setTitle(t: string) {
    this.title = t;
  }
  
  controlPage() {
    
  }

  changeAvatar() {

  }

  updateAvatar(uid, imgB64Code) {
    return this.api.post('user/'+ uid +'/avatar/', {img: imgB64Code});
  }

  saveUser(data: any) {
    this.nS.setItem("auth", "1");
    this.nS.setItem("user_id", JSON.stringify(data.id));
    this.nS.setItem("name", data.name);
    this.nS.setItem("surname", data.surname);
    this.nS.setItem("email", data.email);
    this.nS.setItem("type", data.type);
    this.nS.setItem("avatar", data.avatar);
    this.nS.setItem("rating", data.rating);
  }
}

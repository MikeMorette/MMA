import { Md5 } from 'ts-md5/dist/md5';

export class User {
  constructor(
  public id: number,
  public auth: string,
  public avatar: string,
  public name: string,
  public surname: string,
  public email: string,
  public type: string,
  public liked: string,
  public rating: string,
  public password: string,
  public rpassword: string) {}
  build() {
    return {id: this.id, avatar: this.avatar, name: this.name, surname: this.surname, email: this.email, type: this.type, rating: this.rating, liked: this.liked, password: Md5.hashStr(this.password)};
  }
}
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  url: string = 'http://n22.mikex.ru/v1';
  headers: Headers;
  options: RequestOptions;

  constructor(public http: Http) {
    this.headers = new Headers();
    this.headers.append("Authorization", 'MikeX_Az10TWlrZUxlZV9rZXkvY6BpL3NpdGUvYXBpw11jg2Mjk4OTIzNzg1ODIzNjc5');
    this.headers.append("Accept", 'application/json');
    this.headers.append('Content-Type', 'application/json' );
    this.options = new RequestOptions({ headers: this.headers });
  }

  get(endpoint: string, params?: any) {
    /*let paramsObj = "?";
    if (params) {
      for (let k in params) {
        paramsObj += k + "=" + params[k] + "&";
      }
    }*/
    return this.http.get(this.url + '/' + endpoint, this.options);
  }

  post(endpoint: string, body: any) {
    return this.http.post(this.url + '/' + endpoint, body, this.options);
  }

}

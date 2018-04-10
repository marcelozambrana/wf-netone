import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const POST_API_AUTH = 'http://201.86.95.126:8081/app-web/api/auth';

@Injectable()
export class LoginProvider {

  constructor(public http: HttpClient) {
  }

  public login(email: string, password: string) {

    let isMock = false;
    if (isMock) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ token: 'asdero567hjaq33029dvnvz900mn2iofiAAA11a', email: email });
        }, 2000);
      });
    }

    return new Promise((resolve, reject) => {
      this.http.post(POST_API_AUTH + '/login',
        {
          usuario: email,
          senha: password
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }).subscribe(res => {
          resolve(res);
        }, err => {
          reject(err.error);
        });
    });
  }

  public autorizar() {
    return new Promise((resolve, reject) => {
      this.http.post(POST_API_AUTH + '/autorizar',
        {
          authToken: ''
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }).subscribe(res => {
          resolve(res);
        }, err => {
          reject(err.error);
        });
    });
  }

  public logout() {
    return new Promise((resolve, reject) => {
      this.http.post(POST_API_AUTH + '/logout',
        {},
        {
          headers: { 'Content-Type': 'application/json' }
        }).subscribe(res => {
          resolve(res);
        }, err => {
          reject(err.error);
        });
    });
  }

}

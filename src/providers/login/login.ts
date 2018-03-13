import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class LoginProvider {

  apiUrl = 'http://localhost:8580';

  constructor(public http: HttpClient) {
  }

  public login(email:string, password:string) {

    //Mock
    return new Promise(resolve => {
      setTimeout( () => {
        resolve({ token: 'asdero567hjaq33029dvnvz900mn2iofiAAA11a', email: email });
        }, 2000);
    });
  

    /*return new Promise(resolve => {
      this.http.get(this.apiUrl + '/login').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });*/
  }


}

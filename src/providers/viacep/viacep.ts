import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { timeout } from 'rxjs/operators/timeout';

@Injectable()
export class ViacepProvider {

  constructor(public http: HttpClient) {
    console.log('Hello ViacepProvider Provider');
  }

  callService(cep: String) {
    return new Promise((resolve, reject) => {
      this.http.get(`http://viacep.com.br/ws/` + cep + `/json/`)
        .subscribe(response => {
          resolve(response);
        }, err => {
          resolve({erro: true});
        })
    })
  }

}

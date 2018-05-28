import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

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

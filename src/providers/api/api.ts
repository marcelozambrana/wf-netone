import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { timeout } from 'rxjs/operators/timeout';
import { Cliente } from '../../models/cliente';

const API = 'http://201.86.95.126:8081/app-web/api/';
const AUTH = 'auth/';
const PRODUTO = 'produto/';
const CLIENTE = 'cliente/';
const PEDIDO = 'pedido/';
const FORMA_COBRANCA = 'formacobranca/';
const CONDICAO_PAGAMENTO = 'condicaopagamento/';
const CARTAO_CREDITO = 'cartaocredito/';
const CIDADE = 'cidade/';

@Injectable()
export class ApiProvider {

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
      this.http.post(API + AUTH + 'login',
        JSON.stringify({ usuario: email, senha: password }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).pipe(
          timeout(30000)
        )
        .subscribe(res => {
          resolve(res);
        }, err => {
          reject(err.error ? err.error : err);
        });

    });
  }

  public autorizar(next_token) {
    return new Promise((resolve, reject) => {
      this.http.post(API + AUTH + 'autorizar',
        {
          authToken: next_token
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }).subscribe(res => {
          resolve(res);
        }, err => {
          reject(err.error ? err.error : err);
        });
    });
  }

  public logout(auth_token, next_token) {
    return new Promise((resolve, reject) => {
      this.http.post(API + AUTH + 'logout',
        JSON.stringify({}),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'netone-auth-token': auth_token,
            'netone-next-request-token': next_token
          }
        }).subscribe(res => {
          console.log('logout success: ' + res);
          resolve(res);
        }, err => {
          console.log('logout error: ' + err);
          reject(err.error);
        });
    });
  }

  async syncCondicoes(auth_token, next_token, sequence) {
    return new Promise((resolve, reject) => {
      this.http.post(API + CONDICAO_PAGAMENTO + 'todos',
        JSON.stringify({ sequence: (!sequence ? 0 : sequence) }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'netone-auth-token': auth_token,
            'netone-next-request-token': next_token
          }
        }).subscribe(res => {
          resolve(res);
        }, err => {
          reject(err.error);
        });
    });
  }


  async syncCartoesPlanos(auth_token, next_token, sequence?) {
    return new Promise((resolve, reject) => {
      this.http.post(API + CARTAO_CREDITO + 'todos',
        JSON.stringify({ sequence: (!sequence ? 0 : sequence) }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'netone-auth-token': auth_token,
            'netone-next-request-token': next_token
          }
        }).subscribe(res => {
          resolve(res);
        }, err => {
          reject(err.error);
        });
    });
  }

  async syncFormas(auth_token, next_token, sequence) {
    return new Promise((resolve, reject) => {
      this.http.post(API + FORMA_COBRANCA + 'todos',
        JSON.stringify({ sequence: (!sequence ? 0 : sequence) }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'netone-auth-token': auth_token,
            'netone-next-request-token': next_token
          }
        }).subscribe(res => {
          resolve(res);
        }, err => {
          reject(err.error);
        });
    });
  }

  async syncClientes(auth_token, next_token, sequence) {
    return new Promise((resolve, reject) => {
      this.http.post(API + CLIENTE + 'todos',
        JSON.stringify({ sequence: (!sequence ? 0 : sequence) }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'netone-auth-token': auth_token,
            'netone-next-request-token': next_token
          }
        }).subscribe(res => {
          resolve(res);
        }, err => {
          reject(err.error);
        });
    });
  }

  async syncProdutos(auth_token, next_token, sequence) {
    return new Promise((resolve, reject) => {
      this.http.post(API + PRODUTO + 'todos',
        JSON.stringify({ sequence: (!sequence ? 0 : sequence) }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'netone-auth-token': auth_token,
            'netone-next-request-token': next_token
          }
        }).subscribe(res => {
          console.log('resolve cidades promise');
          resolve(res);
        }, err => {
          reject(err.error);
        });
    });
  }

  async getCidades(auth_token, next_token, sequence) {
    console.log("getCidadesAPI")
    return new Promise((resolve, reject) => {
      this.http.post(API + CIDADE + 'todos',
        JSON.stringify({ sequence: (!sequence ? 0 : sequence) }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'netone-auth-token': auth_token,
            'netone-next-request-token': next_token
          }
        }).subscribe(res => {
          console.log("getCidadesAPI resolve")
          console.log(res)
          resolve(res);
        }, err => {
          reject(err.error);
        });
    });
  }

  async criarCliente(auth_token, next_token, cliente: Cliente) {
    let clienteNovo = {
      cpfCnpj: cliente.cpfCnpj,
      rgInscricaoEstadual: cliente.rgInscricaoEstadual,
      nome: cliente.nome,
      fantasia: cliente.fantasia,
      telefone: cliente.telefone, //somente número
      celular: cliente.celular, //somente número
      email: cliente.email,
      endereco: {
        ibgeCidade: cliente.endereco.ibgeCidade,
        endereco: cliente.endereco.endereco,
        complemento: cliente.endereco.complemento,
        numero: cliente.endereco.numero,
        bairro: cliente.endereco.bairro,
        cep: cliente.endereco.cep //somente número
      }
    }

    return new Promise((resolve, reject) => {
      this.http.post(API + CLIENTE + 'novo',
        JSON.stringify(clienteNovo),
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'netone-auth-token': auth_token,
            'netone-next-request-token': next_token
          }
        }).subscribe(res => {
          resolve(res);
        }, err => {
          reject(err.error);
        });
    });
  }
}

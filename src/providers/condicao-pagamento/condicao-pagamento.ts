import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONDICOES_PAGAMENTO } from './mock-condicao-pagamento';
import { CondicaoPagamento } from '../../models/condicao-pagamento';

/*
  Generated class for the CondicaoPagamentoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CondicaoPagamentoProvider {

  constructor(public http: HttpClient) {
    console.log('Hello CondicaoPagamentoProvider Provider');
  }

  findOneByIntegration(id: number): CondicaoPagamento | any{
    CONDICOES_PAGAMENTO.filter(cond => {
      return cond.id === id;
    })
  }

  findAllByIntegration(): CondicaoPagamento[] | any[]{
    return CONDICOES_PAGAMENTO;
  }


  findOne(id: number): CondicaoPagamento | any{
  }  

  findAll(): CondicaoPagamento[] | any[]{
    return this.findAllByIntegration();
  }

  save(condicaoPgto: CondicaoPagamento){
  }

  // delete(condicaoPgto: CondicaoPagamento | number ){
  // }


}

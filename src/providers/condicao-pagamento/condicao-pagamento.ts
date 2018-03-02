import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CONDICOES_PAGAMENTO } from './mock-condicao-pagamento';
import { CondicaoPagamento } from '../../models/condicao-pagamento';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
/*
  Generated class for the CondicaoPagamentoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class CondicaoPagamentoProvider {

  private condicaoCollection: AngularFirestoreCollection<CondicaoPagamento>;

  public condicao: Observable<CondicaoPagamento[]>;

  constructor(public http: HttpClient, private afs: AngularFirestore) {
    console.log('Hello CondicaoPagamentoProvider Provider');
    this.condicaoCollection = this.afs.collection('condicoes');
    this.condicao = this.condicaoCollection.valueChanges();
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

  syncWithFirestore(){
    let condicoes : CondicaoPagamento[] = [this.findAllByIntegration()[0]];
    condicoes.forEach(cond => {
      this.condicaoCollection.add(cond);
    });
  }


}

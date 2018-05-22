import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { CondicaoPagamento } from '../../models/condicao-pagamento';
import { CartaoCredito } from '../../models/cartoes-credito';


@Injectable()
export class CondicaoPagamentoProvider {

  private condicaoCollection: AngularFirestoreCollection<CondicaoPagamento>;
  private condicaoDoc: AngularFirestoreDocument<CondicaoPagamento>;
  public condicoes: Observable<CondicaoPagamento[]>;

  private cartaoCollection: AngularFirestoreCollection<CartaoCredito>;
  private cartaoDoc: AngularFirestoreDocument<CartaoCredito>;
  public cartoes: Observable<CartaoCredito[]>;

  rootPathFirebase;
  
  constructor(private afs: AngularFirestore, private storage: Storage) { }

  async init() {
    await this.storage.get('caminhoFirestone').then((path) => {

      this.rootPathFirebase = path;

      this.condicaoCollection = this.afs.collection(this.rootPathFirebase + '/condicoes'); //ref()
      this.condicoes = this.condicaoCollection.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as CondicaoPagamento;
          data.idFirebase = a.payload.doc.id;
          return data;
        });
      });

      this.cartaoCollection = this.afs.collection(this.rootPathFirebase + '/cartoes'); //ref()
      this.cartoes = this.cartaoCollection.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as CartaoCredito;
          data.idFirebase = a.payload.doc.id;
          return data;
        });
      });
    });
  }

  todos() {
    return new Promise(resolve => {
      this.afs.collection(this.rootPathFirebase + '/condicoes')
        .snapshotChanges().map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data() as CondicaoPagamento;
            data.idFirebase = a.payload.doc.id;
            return data;
          })
        })
        .subscribe(docs => {
          if (docs.length === 0) {
            resolve(null)
          }
          resolve(docs)
        })
    })
  }

  adicionar(condicao: CondicaoPagamento) {
    return this.condicaoCollection.add(condicao);
  }

  atualizar(condicao: CondicaoPagamento) {
    this.condicaoDoc = this.afs.doc(this.rootPathFirebase + `/condicoes/${condicao.idFirebase}`);
    return this.condicaoDoc.update(condicao);
  }

  todosCartoes() {
    return new Promise(resolve => {
      this.afs.collection(this.rootPathFirebase + '/cartoes')
        .snapshotChanges().map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data() as CartaoCredito;
            data.idFirebase = a.payload.doc.id;
            return data;
          })
        })
        .subscribe(docs => {
          if (docs.length === 0) {
            resolve(null)
          }
          resolve(docs)
        })
    })
  }

  adicionarCartao(cartao: CartaoCredito) {
    return this.cartaoCollection.add(cartao);
  }

  atualizarCartao(cartao: CartaoCredito) {

    this.cartaoDoc = this.afs.doc(this.rootPathFirebase + `/cartoes/${cartao.idFirebase}`);
    return this.cartaoDoc.update(cartao);
  }

  /*findOneByIntegration(id: string): CondicaoPagamento | any {
    this.condicoes.filter(cond => {
      return cond.id === id;
    })
  }

  findAllByIntegration(): CondicaoPagamento[] | any[] {
    return this.condicoes;
  }


  findOne(id: string): CondicaoPagamento | any {
    return this.condicaoCollection.doc(id)
  }

  findAll(): CondicaoPagamento[] | any[] {
    return this.findAllByIntegration();
  }

  save(condicaoPgto: CondicaoPagamento) {
    this.condicaoCollection.doc(condicaoPgto.id).set(condicaoPgto);
  }

  syncWithFirestore() {
    let condicoes: CondicaoPagamento[] = this.findAllByIntegration();
    condicoes.forEach(cond => {
      this.save(cond);
    });
  }*/


}

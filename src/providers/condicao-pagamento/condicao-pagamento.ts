import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Storage } from '@ionic/storage';

import { CondicaoPagamento } from '../../models/condicao-pagamento';


@Injectable()
export class CondicaoPagamentoProvider {

  private condicaoCollection: AngularFirestoreCollection<CondicaoPagamento>;
  public condicoes: Observable<CondicaoPagamento[]>;
  condicaoDoc: AngularFirestoreDocument<CondicaoPagamento>;

  rootPathFirebase;
  
  constructor(private afs: AngularFirestore, private storage: Storage) { }

  async init() {
    await this.storage.get('caminhoFirestone').then((path) => {
      this.rootPathFirebase = path;
      console.log('Root path storage firebase: ' + this.rootPathFirebase);

      this.condicaoCollection = this.afs.collection(this.rootPathFirebase + '/condicoes'); //ref()

      this.condicoes = this.condicaoCollection.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as CondicaoPagamento;
          data.id = a.payload.doc.id;
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

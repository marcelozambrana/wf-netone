import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Storage } from '@ionic/storage';


import { FormaCobranca } from '../../models/forma-cobranca';

@Injectable()
export class FormaCobrancaProvider {


  private formaCobrancaCollection: AngularFirestoreCollection<FormaCobranca>;
  public formas: Observable<FormaCobranca[]>;
  formaDoc: AngularFirestoreDocument<FormaCobranca>;

  rootPathFirebase;

  constructor(private afs: AngularFirestore, private storage: Storage) { }

  async init() {
    await this.storage.get('caminhoFirestone').then((path) => {
      this.rootPathFirebase = path;
      console.log('Root path storage firebase: ' + this.rootPathFirebase);

      this.formaCobrancaCollection = this.afs.collection(this.rootPathFirebase + '/formascobranca'); //ref()

      this.formas = this.formaCobrancaCollection.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as FormaCobranca;
          data.id = a.payload.doc.id;
          return data;
        });
      });
    });
  }

  todos() {
    return new Promise(resolve => {
      this.afs.collection(this.rootPathFirebase + '/formascobranca')
        .snapshotChanges().map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data() as FormaCobranca;
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

  adicionar(forma: FormaCobranca) {
    return this.formaCobrancaCollection.add(forma);
  }

  atualizar(forma: FormaCobranca) {

    this.formaDoc = this.afs.doc(this.rootPathFirebase + `/formascobranca/${forma.idFirebase}`);
    return this.formaDoc.update(forma);
  }

}

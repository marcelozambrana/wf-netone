import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Produto } from '../../models/produto';

@Injectable()
export class ProdutosProvider {

  private produtosCollection: AngularFirestoreCollection<Produto>; //Firestore collection
  private produtoDoc: AngularFirestoreDocument<Produto>;
  public produtos: Observable<Produto[]>;

  rootPathFirebase;

  constructor(private afs: AngularFirestore, private storage: Storage) { }

  async init() {
    await this.storage.get('caminhoFirestone').then((path) => {

      this.rootPathFirebase = path;
      this.produtosCollection = this.afs.collection(this.rootPathFirebase + '/produtos'); //ref()

      this.produtos = this.produtosCollection.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Produto;
          data.id = a.payload.doc.id;
          return data;
        });
      });
    });
  }

  todos() {
    return new Promise(resolve => {
      this.afs.collection(this.rootPathFirebase + '/produtos')
        .snapshotChanges().map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data() as Produto;
            data.id = a.payload.doc.id;
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

  async adicionar(produto: Produto) {
    return this.produtosCollection.add(produto);
  }

  async atualizar(produto: Produto) {
    if (!produto || !produto.id) {
      console.log('Não é possível atualizar produto sem id');
    }

    this.produtoDoc = this.afs.doc(this.rootPathFirebase + `/produtos/${produto.id}`);
    return this.produtoDoc.update(produto);
  }

}

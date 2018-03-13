import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


import { Pedido } from '../../models/pedido';

@Injectable()
export class PedidosProvider {

  pedidosCollection: AngularFirestoreCollection<Pedido>; //Firestore collection
  pedidos: Observable<Pedido[]>;
  pedidoDoc: AngularFirestoreDocument<Pedido>;

  constructor(private afs: AngularFirestore) {
    this.pedidosCollection = this.afs.collection('pedidos'); //ref()

    this.pedidos = this.pedidosCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Pedido;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  todos() {
    return this.pedidos;
  }

  adicionar(pedidos: Pedido) {
    return this.pedidosCollection.add(pedidos);
  }

  remover(id:string) {
    this.pedidoDoc = this.afs.doc(`pedidos/${id}`);
    return this.pedidoDoc.delete();
  }

  atualizar(pedido:Pedido) {
    this.pedidoDoc = this.afs.doc(`pedidos/${pedido.id}`);
    return this.pedidoDoc.update(pedido);
  }

  public buscarPedidosDadoCpfCnpj(cpfCnpj:string) {
    return this.afs.collection('pedidos', ref => ref.where('cliente', '==', cpfCnpj)).valueChanges();
  }

  public buscarId(id:string) {
    return this.afs.doc(`pedidos/${id}`).valueChanges();
  }

}

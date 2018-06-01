import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Pedido } from '../../models/pedido';

@Injectable()
export class PedidosProvider {

  private pedidosCollection: AngularFirestoreCollection<Pedido>; //Firestore collection
  private pedidoDoc: AngularFirestoreDocument<Pedido>;
  public pedidos: Observable<Pedido[]>;

  rootPathFirebase;

  constructor(private afs: AngularFirestore, private storage: Storage) { }

  async init() {
    await this.storage.get('caminhoFirestone').then((path) => {

      this.rootPathFirebase = path;
      this.pedidosCollection = this.afs.collection(this.rootPathFirebase + '/pedidos'); //ref()

      this.pedidos = this.pedidosCollection.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Pedido;
          data.numero = a.payload.doc.id;
          return data;
        });
      });
    });
  }

  todos() {
    return this.pedidos;
  }

  adicionar(pedidos: Pedido) {
    return this.pedidosCollection.add(pedidos);
  }

  remover(id: string) {
    this.pedidoDoc = this.afs.doc(this.rootPathFirebase + `/pedidos/${id}`);
    return this.pedidoDoc.delete();
  }

  atualizar(pedido: Pedido) {
    this.pedidoDoc = this.afs.doc(this.rootPathFirebase + `/pedidos/${pedido.numero}`);
    return this.pedidoDoc.update(pedido);
  }

  public buscarPedidosDadoCpfCnpj(cpfCnpj: string) {
    return this.afs.collection(this.rootPathFirebase + '/pedidos', ref => ref.where('cliente', '==', cpfCnpj)).valueChanges();
  }

  public buscarPedidosPorStatus(enviado: boolean): Observable<Pedido[]> {
    let aux: AngularFirestoreCollection<Pedido>;
    if (enviado) {
      aux = this.afs.collection(this.rootPathFirebase + '/pedidos', ref => ref.where('enviado', '==', enviado).orderBy('numeroEnvio', 'desc'));
    } else {
      aux = this.afs.collection(this.rootPathFirebase + '/pedidos', ref => ref.where('enviado', '==', enviado).orderBy('emissao', 'desc'));
    }
    return aux.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Pedido;
        data.numero = a.payload.doc.id;
        return data;
      });
    });
  }

  public buscarId(id: string) {
    return this.afs.doc(this.rootPathFirebase + `/pedidos/${id}`).valueChanges();
  }

}

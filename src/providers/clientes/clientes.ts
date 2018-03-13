import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';


import { Cliente } from '../../models/cliente';

@Injectable()
export class ClientesProvider {

  cliCollection: AngularFirestoreCollection<Cliente>; //Firestore collection
  clientes: Observable<Cliente[]>;
  cliDoc: AngularFirestoreDocument<Cliente>;

  constructor(private afs: AngularFirestore) {
    this.cliCollection = this.afs.collection('clientes'); //ref()

    this.clientes = this.cliCollection.snapshotChanges().map(changes => {
      return changes.map(a => {
        const data = a.payload.doc.data() as Cliente;
        data.id = a.payload.doc.id;
        return data;
      });
    });
  }

  todos() {
    return this.clientes;
  }

  adicionar(cliente: Cliente) {
    return this.cliCollection.add(cliente);
  }

  remover(id:string) {
    this.cliDoc = this.afs.doc(`clientes/${id}`);
    return this.cliDoc.delete();
  }

  atualizar(cliente:Cliente) {
    this.cliDoc = this.afs.doc(`clientes/${cliente.id}`);
    return this.cliDoc.update(cliente);
  }

  public buscarCpfCnpj(cpfCnpj:string) {
    return this.afs.collection('clientes', ref => ref.where('cpfCnpj', '==', cpfCnpj)).valueChanges();
  }

  public buscarId(id:string) {
    return this.afs.doc(`clientes/${id}`).valueChanges();
  }

}

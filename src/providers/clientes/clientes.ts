import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Cliente } from '../../models/cliente';

@Injectable()
export class ClientesProvider {

  private cliCollection: AngularFirestoreCollection<Cliente>; //Firestore collection
  private cliDoc: AngularFirestoreDocument<Cliente>;
  public clientes: Observable<Cliente[]>;

  rootPathFirebase;

  constructor(private afs: AngularFirestore, private storage: Storage) { }

  async init() {
    await this.storage.get('caminhoFirestone').then(async (path) => {

      this.rootPathFirebase = path;

      this.cliCollection = this.afs.collection(this.rootPathFirebase + '/clientes'); //ref()
      this.clientes = this.cliCollection.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Cliente;
          data.id = a.payload.doc.id;
          return data;
        })
      })

      console.log("clientes:");
      console.log(this.clientes);
    });
  }

  todos() {
    return this.clientes;
  }

  todosParaPedido() {
    this.cliCollection = this.afs.collection(this.rootPathFirebase + '/clientes'); //ref()

    return new Promise(resolve => {
      this.cliCollection.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Cliente;
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

  async adicionar(cliente: Cliente) {
    cliente.isNovo = true;
    cliente.cpfCnpj = cliente.cpfCnpj.replace(/\D/g, "");
    return this.cliCollection.add(cliente);
  }

  async remover(id: string) {
    this.cliDoc = this.afs.doc(this.rootPathFirebase + `/clientes/${id}`);
    return this.cliDoc.delete();
  }

  async atualizar(cliente: Cliente) {
    cliente.cpfCnpj = cliente.cpfCnpj.replace(/\D/g, "");
    this.cliDoc = this.afs.doc(this.rootPathFirebase + `/clientes/${cliente.id}`);
    return this.cliDoc.update(cliente);
  }

  public buscarCpfCnpj(cpfCnpj: string) {
    return this.afs.collection(this.rootPathFirebase + '/clientes',
      ref => ref.where('cpfCnpj', '==', cpfCnpj)).valueChanges();
  }

  public buscarId(id: string) {
    return new Promise(resolve => {
      this.afs.doc(this.rootPathFirebase + `/clientes/${id}`).ref
        .get().then(function (doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            resolve(doc.data());
          } else {
            console.log("No such document!");
            resolve(null);
          }
        }).catch(function (error) {
          console.log("Error getting document:", error);
          resolve(null);
        });
    });
  }

}

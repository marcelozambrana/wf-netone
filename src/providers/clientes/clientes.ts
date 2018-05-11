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
    await this.storage.get('caminhoFirestone').then((path) => {

      this.rootPathFirebase = path;
      this.cliCollection = this.afs.collection(this.rootPathFirebase + '/clientes'); //ref()

      this.clientes = this.cliCollection.snapshotChanges().map(changes => {
        return changes.map(a => {
          const data = a.payload.doc.data() as Cliente;
          data.id = a.payload.doc.id;
          return data;
        });
      });
    });
  }

  todos() {
    return this.clientes;
  }

  todosParaPedido() {
    return new Promise(resolve => {
      this.afs.collection(this.rootPathFirebase + '/clientes')
        .snapshotChanges().map(changes => {
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

  adicionar(cliente: Cliente) {
    cliente.isNovo = true;
    cliente.cpfCnpj = cliente.cpfCnpj.replace(/\D/g, "");
    return this.cliCollection.add(cliente);
  }

  remover(id: string) {
    this.cliDoc = this.afs.doc(this.rootPathFirebase + `/clientes/${id}`);
    return this.cliDoc.delete();
  }

  atualizar(cliente: Cliente) {
    cliente.cpfCnpj = cliente.cpfCnpj.replace(/\D/g, "");

    this.cliDoc = this.afs.doc(this.rootPathFirebase + `/clientes/${cliente.id}`);
    return this.cliDoc.update(cliente);
  }

  public buscarCpfCnpj(cpfCnpj: string) {
    return this.afs.collection(this.rootPathFirebase + '/clientes', ref => ref.where('cpfCnpj', '==', cpfCnpj)).valueChanges();
  }

  public buscarId(id: string) {
    return this.afs.doc(this.rootPathFirebase + `/clientes/${id}`).valueChanges();
  }


  //TODO: move to user provider
  public async buscarUsuario(email: string) {

    return new Promise(resolve => {
      this.afs.collection('usuarios', ref => ref.where('email', '==', email))
        .snapshotChanges().map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data() as any;
            data.id = a.payload.doc.id;
            return data;
          })
        })
        .subscribe(docs => {
          if (docs.length === 0) {
            resolve(null)
          }
          docs.forEach(doc => {
            resolve(doc)
          })
        })
    });
  }

  public adicionarUsuario(email: string) {
    let user = {
      email: email,
      dataCriacao: new Date()
    }

    return this.afs.collection('usuarios').add(user);
  }

  public async buscarCidades(rootPathFirebase) {

    return new Promise(resolve => {
      this.afs.collection(rootPathFirebase + '/cidades')
        .snapshotChanges().map(changes => {
          return changes.map(a => {
            const data = a.payload.doc.data() as any;
            return data;
          })
        })
        .subscribe(docs => {
          if (docs.length === 0) {
            resolve(null)
          } else {
            resolve(docs)
          }
        })
    });
  }

  async adicionarCidades(rootPathFirebase, cidades) {
    console.log(rootPathFirebase)
    return new Promise(resolve => {
      cidades.forEach(c => {
        console.log("Adicionando cidade " + c.id);
        this.afs.collection(rootPathFirebase + '/cidades').add(c);
      })
      resolve(true);
    })
  }

}

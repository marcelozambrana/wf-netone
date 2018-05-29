import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable()
export class UsuariosProvider {

  constructor(private afs: AngularFirestore) { }

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
      dataCriacao: new Date(),
      sequencePedido: 1,
      sequenceApiProduto: null,
      sequenceApiCliente: null,
      sequenceApiFormaCob: null,
      sequenceApiCondPgto: null
    }

    return this.afs.collection('usuarios').add(user);
  }

  async atualizar(usuario: any) {
    return this.afs.doc(`/usuarios/${usuario.id}`).update(usuario);
  }
}

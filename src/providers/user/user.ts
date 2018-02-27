import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AuthProvider } from '../../providers/auth/auth';

import { User } from '../../models/user'

@Injectable()
export class UserProvider {

  private caminho: string = '';

  private userColllection: AngularFirestoreCollection<User>;

  user: Observable<User[]>;

  constructor(private afs: AngularFirestore, private auth: AuthProvider) {
    this.auth.user.subscribe(auth => {

      // Verifica se está logado e adiciona o caminho, usaremos o email como caminho
      if (auth != null) {
        this.caminho = '/' + auth.email;
        this.userColllection = afs.collection<User>(this.caminho, ref => {
          return ref;
        });
      } else {
        this.caminho = '';
      }
    });
  }

  pegarUsuarios(email: string) {
    return this.afs
      .collection<User>(this.caminho, ref => {
        return ref.where('email', '==', email);
      })
      .snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as User;
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      });
  }

  adicionar(user: User) {
    this.userColllection.add(user);
  }

  atualizar(id: string, user: User) {
    return this.atualizarAsync(this.userColllection, id, user);
  }

  private atualizarAsync(collection:any , id:string, user:User) {
    return new Promise(function(resolve, reject) {
      collection.doc(id).update(user);
      resolve(true);
    })
  }

  excluir(id: string) {
    this.userColllection.doc(id).delete();
  }


}

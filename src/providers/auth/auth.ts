import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UserAuth } from '../../models/userAuth';

@Injectable()
export class AuthProvider {

  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth) {
    this.user = firebaseAuth.authState;
  }

  register(user: UserAuth) {
    return this.firebaseAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  login(user: UserAuth) {
    return this.firebaseAuth.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  logout() {
    return this.firebaseAuth.auth.signOut();
  }

  isLogged() {
    return this.user;
  }

}

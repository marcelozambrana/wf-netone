import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { AuthProvider } from '../../providers/auth/auth';

import { LoginPage } from '../login/login';

import { User } from '../../models/user';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  usuarios: Observable<User[]>;
  public usuarioPerfil = {} as User;

  public perfilForm: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    private userProvider: UserProvider, private auth: AuthProvider, private alertCtrl: AlertController) {
    this.perfilForm = formBuilder.group({
      email: new FormControl({ value: '', disabled: true }),
      tokenAPI: ['']
    });

    this.auth.user.subscribe(auth => {
      if (auth != null) {
        this.usuarios = this.userProvider.pegarUsuarios(auth.email);

        //atribuindo usuário logado
        this.usuarios.subscribe(users => {
          this.usuarioPerfil = users[0];
          this.perfilForm.controls['email'].setValue(this.usuarioPerfil.email);
          this.perfilForm.controls['tokenAPI'].setValue(this.usuarioPerfil.tokenAPI);
        });

      } else {
        this.navCtrl.setRoot(LoginPage);
      }
    });
  }

  alert(title, message) {
    let al = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Fechar']
    });
    al.present();
  }

  ionViewDidLoad() {
  }

  async alterarUsuario() {
    this.usuarioPerfil.tokenAPI = this.perfilForm.controls.tokenAPI.value;
    const result = await this.userProvider.atualizar(this.usuarioPerfil.id, this.usuarioPerfil);
    if (result) {
      this.alert('Sucesso', 'TokenAPI atualizado com sucesso');
    }
  }

}

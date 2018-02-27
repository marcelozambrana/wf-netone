import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { HomePage } from '../home/home';
import { UsuarioPage } from '../usuario/usuario';

import { UserAuth } from '../../models/userAuth';

import { AuthProvider } from '../../providers/auth/auth';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user = {} as UserAuth;

  public loginForm: any;
  mensagemErroEmail = "";
  mensagemErroPassword = "";
  isErroEmail = false;
  isErroPassword = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController, private auth: AuthProvider, private alertCtrl: AlertController
  ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20),
      Validators.required])]
    })
  }

  alert(title, message) {
    let al = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Fechar']
    });
    al.present();
  }

  async login() {
    let { email, password } = this.loginForm.controls;

    if (!this.loginForm.valid) {
      if (!email.valid) {
        this.isErroEmail = true;
        this.mensagemErroEmail = 'Ops! E-mail inválido';
      } else {
        this.mensagemErroEmail = '';
      }

      if (!password.valid) {
        this.isErroPassword = true;
        this.mensagemErroPassword = 'A senha precisa ter de 6 a 20 caracteres.';
      } else {
        this.mensagemErroPassword = '';
      }
    } else {
      this.mensagemErroEmail = '';
      this.mensagemErroPassword = '';

      let loader = this.loadingCtrl.create({
        content: 'Loading...',
        dismissOnPageChange: true
      });

      loader.present();

      try {
        this.user.email = email.value;
        this.user.password = password.value;

        const result = await this.auth.login(this.user);
        if (result) {
          this.navCtrl.setRoot(HomePage);
        }
      } catch (e) {
        loader.dismiss();
        if (e.code === "auth/user-not-found") {
          this.alert('Erro ao logar', 'Usuário não registrado'); 
        } else if (e.code === "auth/wrong-password") {
          this.alert('Erro ao logar', 'Usuário ou senha incorreta'); 
        } else {
          this.alert('Erro ao logar', e.message);
        }
      }
    }
  }

  registrar() {
    this.navCtrl.push(UsuarioPage);
  }
}

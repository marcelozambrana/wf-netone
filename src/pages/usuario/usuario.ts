import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

import { UserAuth } from '../../models/userAuth';
import { User } from '../../models/user';

import { AuthProvider } from '../../providers/auth/auth';
import { UserProvider } from '../../providers/user/user';
;

@IonicPage()
@Component({
  selector: 'page-usuario',
  templateUrl: 'usuario.html',
})
export class UsuarioPage {

  userAuth = {} as UserAuth;
  userDatabase = {} as User;

  public registroUsuarioForm: any;
  mensagemErroEmail = "";
  mensagemErroPassword = "";
  mensagemErroConfirmPassword = "";

  isErroEmail = false;
  isErroPassword = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController, private auth: AuthProvider, private userProvider: UserProvider,
    private alertCtrl: AlertController
  ) {
    this.registroUsuarioForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20),
      Validators.required])],
      passwordConfirm: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20),
      Validators.required])
      ]
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

  async registrar() {
    let { email, password, passwordConfirm } = this.registroUsuarioForm.controls;

    if (this.registroUsuarioForm.valid && password.value === passwordConfirm.value) {
      this.mensagemErroEmail = '';
      this.mensagemErroPassword = '';
      this.mensagemErroConfirmPassword = '';
    } else {
      if (!email.valid) {
        this.isErroEmail = true;
        this.mensagemErroEmail = 'Ops! E-mail é um campo obrigatório';
      } else {
        this.mensagemErroEmail = '';
      }

      if (!password.valid) {
        this.isErroPassword = true;
        this.mensagemErroPassword = 'Ops! A senha precisa ter de 6 a 20 caracteres.';
      } else {
        this.mensagemErroPassword = '';
      }

      if (!passwordConfirm.valid) {
        this.isErroPassword = true;
        this.mensagemErroConfirmPassword = 'Ops! A senha precisa ter de 6 a 20 caracteres.';
      } else {
        if (password.value != passwordConfirm.value) {
          this.isErroPassword = true;
          this.mensagemErroConfirmPassword = 'Os valores informados no campo senha e confirmação de senha devem ser iguais.';
        } else {
          this.mensagemErroConfirmPassword = '';
        }
      }

      return;
    }

    let loader = this.loadingCtrl.create({
      content: 'Loading...',
      dismissOnPageChange: true
    });

    try {
      this.userAuth.email = email.value;
      this.userAuth.password = password.value;

      const result = await this.auth.register(this.userAuth);
      if (result) {
        this.userDatabase = {
          email: email.value,
          tokenAPI: '',
        }
        
        this.userProvider.adicionar(this.userDatabase);

        this.alert('Sucesso', "Usuário registrado com sucesso");
        this.navCtrl.setRoot(HomePage);
      }


    } catch (e) {
      loader.dismiss();
      if (e.code === "auth/email-already-in-use") {
        this.alert('Erro ao registrar', 'E-mail já cadastrado');
      } else {
        this.alert('Erro ao registrar', e.message);
      }
    }
  }

}
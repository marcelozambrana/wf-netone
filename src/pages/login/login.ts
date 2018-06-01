import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';

import { ApiProvider } from '../../providers/api/api';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: any;
  mensagemErroEmail: string = "";
  mensagemErroPassword: string = "";
  isErroEmail: boolean = false;
  isErroPassword: boolean = false;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private storage: Storage,
    private usuariosProvider: UsuariosProvider,
    private apiProvider: ApiProvider) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(20), Validators.required])]
    });

    this.storage.get('usuarioAutenticado').then((isAuth) => {

      console.log('isUsuarioAutenticado: ' + isAuth);
      if (isAuth) {
        this.navCtrl.setRoot(HomePage);
      }
    });
  }

  async login() {

    let { email, password } = this.loginForm.controls;

    if (!this.loginForm.valid) {
      if (!email.valid) {
        this.isErroEmail = true;
        this.mensagemErroEmail = 'Ops! Usuário inválido.';
      } else {
        this.mensagemErroEmail = '';
      }

      if (!password.valid) {
        this.isErroPassword = true;
        this.mensagemErroPassword = 'A senha precisa ter de 4 a 20 caracteres.';
      } else {
        this.mensagemErroPassword = '';
      }

    } else {
      this.mensagemErroEmail = '';
      this.mensagemErroPassword = '';

      let loader = this.loadingCtrl.create({
        content: 'Logando...',
        dismissOnPageChange: true
      });
      loader.present();

      try {

        const resultLogin: any = await this.apiProvider.login(email.value, password.value);
        if (resultLogin) {
          console.log('result token login: ' + resultLogin.token);

          const resultAutorizar: any = await this.apiProvider.autorizar(resultLogin.token);
          console.log('next token login: ' + resultAutorizar.requestToken);
          this.storage.set('usuarioAutenticado', true);
          this.storage.set('netone-auth-token', resultLogin.token);
          this.storage.set('netone-next-request-token', resultAutorizar.requestToken);

          let user: any = await this.usuariosProvider.buscarUsuario(email.value);
          console.log(user);

          if (user) {
            let rootPathFirebase = 'usuarios/' + user.id;
            this.storage.set('caminhoFirestone', rootPathFirebase);
          } else {
            console.log("Primeiro acesso, criando usuário: " + email.value);
            let newDocUser = await this.usuariosProvider.adicionarUsuario(email.value);
            this.storage.set('caminhoFirestone', newDocUser.path);
          }

          if (user == null) {
            user = await this.usuariosProvider.buscarUsuario(email.value);
          }
          this.storage.set('usuarioLogado', user);
          this.navCtrl.setRoot(HomePage);
        }

      } catch (e) {
        loader.dismiss();
        console.log(e);
        this.alert('Erro ao logar',
          e.message ? e.message : 'Não foi possível alcançar o servidor. Tente novamente.');
      }
    }
  }

  alert(title, message) {
    let al = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Fechar']
    });
    al.present();
  }

}

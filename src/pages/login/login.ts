import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { Storage } from '@ionic/storage';

import { HomePage } from '../home/home';

import { LoginProvider } from '../../providers/login/login';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: any;
  mensagemErroEmail = "";
  mensagemErroPassword = "";
  isErroEmail = false;
  isErroPassword = false;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public formBuilder: FormBuilder,
    private loadingCtrl: LoadingController, 
    private alertCtrl: AlertController,
    private storage: Storage,
    private loginProvider: LoginProvider) {

    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.minLength(4), Validators.maxLength(20),
      Validators.required])]
    });

    this.storage.get('usuarioAutenticado').then((result) => {
     
      console.log('isUsuarioAutenticado: ' + result);
     
      if (result) {
        this.navCtrl.setRoot(HomePage);
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

  async login() {
    let { email, password } = this.loginForm.controls;

    if (!this.loginForm.valid) {
      if (!email.valid) {
        this.isErroEmail = true;
        this.mensagemErroEmail = 'Ops! Usuário inválido';
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
        content: 'Loading...',
        dismissOnPageChange: true
      });

      loader.present();

      try {

        const result: any = await this.loginProvider.login(email.value, password.value);
        if (result) {
          console.log('result token login: ' + result.token);

          this.storage.set('usuarioAutenticado', true);
          this.storage.set('caminhoFirestone', email.value + '/');
          this.storage.set('netone-auth-token',  result.token);
          this.storage.set('netone-next-request-token', null);

          this.navCtrl.setRoot(HomePage);
        }
        
      } catch (e) {
        loader.dismiss();
        console.log(e)
        this.alert('Erro ao logar', e.message);

      }
    }
  }

}

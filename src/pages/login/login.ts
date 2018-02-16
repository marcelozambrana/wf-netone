import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginForm: any;
  messageEmail = "";
  messagePassword = "";
  errorEmail = false;
  errorPassword = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([ Validators.minLength(6), Validators.maxLength(20), 
        Validators.required ])]
    })
  }

  login() {
    let { email, password } = this.loginForm.controls;

    /*if (!this.loginForm.valid) {
      if (!email.valid) {
        this.errorEmail = true;
        this.messageEmail = 'Ops! E-mail inválido';
      } else {
        this.messageEmail = '';
      }

      if (!password.valid) {
        this.errorPassword = true;
        this.messagePassword = 'A senha precisa ter de 6 a 20 caracteres.';
      } else {
        this.messagePassword = '';
      }
    } else {
      alert('Login realizado com sucesso!')
      this.messageEmail = '';
      this.messagePassword = '';
    }*/

    this.navCtrl.setRoot(HomePage);
  }
}

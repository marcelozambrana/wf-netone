import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController) {
  }

  syncServer() {
    let loader = this.loadingCtrl.create({
      content: 'Sincronizando...',
    });

    loader.present().then(() => {
      setTimeout(()=>{
        loader.dismiss();
      },3000);
    })
  }

  novoPedido() {
  }

  goToCadastroCliente() {
  }

  goToCatalogo() {
  }

  goToPedidos() {
  }

  goToRelatorios() {
  }

  logoff() {
    this.navCtrl.setRoot(LoginPage);
  }



}

import { CondicaoPagamentoPage } from './../condicao-pagamento/condicao-pagamento';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { NovoPedidoPage } from '../novo-pedido/novo-pedido';
import { ClientesPage } from '../clientes/clientes';
import { CatalogoProdutoPage } from '../catalogo-produto/catalogo-produto';

import { LoginProvider } from '../../providers/login/login';
import { CondicaoPagamentoProvider } from '../../providers/condicao-pagamento/condicao-pagamento';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  caminhoFirebase = "";

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private condicaoPagamentoProvider: CondicaoPagamentoProvider,
    private loginProvider: LoginProvider) {

      this.storage.get('tokenApi').then((token) => {
        console.log('Your tokenApi is ' + token );
      });

      this.storage.get('caminhoFirestone').then((path) => {
        console.log('Root path storage firebase: ' + path );
      });

  }

  syncServer() {
    let loader = this.loadingCtrl.create({
      content: 'Sincronizando...',
      dismissOnPageChange: true
    });

    loader.present();
    
    this.condicaoPagamentoProvider.syncWithFirestore();
    setTimeout(() => {
      loader.dismiss();
    }, 3000);

  }

  novoPedido() {
    this.navCtrl.push(NovoPedidoPage);
  }

  clientes() {
    this.navCtrl.push(ClientesPage);
  }

  catalogo() {
    this.navCtrl.push(CatalogoProdutoPage);
  }

  pedidos() {
  }

  condicoesPagamento() {
    this.navCtrl.push(CondicaoPagamentoPage);
  }

  relatorios() {
  }

  async logout() {

    const result: any = await this.loginProvider.logout();

    this.storage.set('usuarioAutenticado', false);
    this.storage.set('caminhoFirestone', 'temp/');
    this.storage.set('netone-auth-token', null);
    this.storage.set('netone-next-request-token', null);

    this.navCtrl.setRoot(LoginPage);
  }

}

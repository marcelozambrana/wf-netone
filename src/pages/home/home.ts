import { CondicaoPagamentoPage } from './../condicao-pagamento/condicao-pagamento';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { NovoPedidoPage } from '../novo-pedido/novo-pedido';
import { ClientesPage } from '../clientes/clientes';
import { CatalogoProdutoPage } from '../catalogo-produto/catalogo-produto';

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
    private condicaoPagamentoProvider: CondicaoPagamentoProvider) {

      this.storage.get('tokenApi').then((token) => {
        console.log('Your tokenApi is ' + token );
      });

      this.storage.get('caminhoFirestone').then((path) => {
        console.log('root path storage firebase: ' + path );
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

  logout() {
    this.storage.set('usuarioAutenticado', false);
    this.navCtrl.setRoot(LoginPage);
  }

}

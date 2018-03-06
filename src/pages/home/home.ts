import { CondicaoPagamentoPage } from './../condicao-pagamento/condicao-pagamento';
import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { PerfilPage } from '../perfil/perfil';
import { NovoPedidoPage } from '../novo-pedido/novo-pedido';
import { ClientesPage } from '../clientes/clientes';
import { CatalogoProdutoPage } from '../catalogo-produto/catalogo-produto';

import { AuthProvider } from '../../providers/auth/auth';
import { CondicaoPagamentoProvider } from '../../providers/condicao-pagamento/condicao-pagamento';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  constructor(public navCtrl: NavController, 
              private loadingCtrl: LoadingController, 
              private auth: AuthProvider,
              private condicaoPagamentoProvider: CondicaoPagamentoProvider) {
    this.auth.user.subscribe(
      (auth) => {
        if (auth == null) {
          this.navCtrl.setRoot(LoginPage);
        }
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

  perfilUsuario() {
    this.navCtrl.push(PerfilPage);
  }

  async logout() {
    /*const result = await this.auth.logout();
    if (result) {
      this.navCtrl.setRoot(LoginPage);
    } */
    this.navCtrl.setRoot(LoginPage);
  }

}

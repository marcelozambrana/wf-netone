import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NovoClientePage } from '../novo-cliente/novo-cliente';

@IonicPage()
@Component({
  selector: 'page-novo-pedido',
  templateUrl: 'novo-pedido.html',
})
export class NovoPedidoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  adicionarCliente() {
    this.navCtrl.push(NovoClientePage, {titulo: 'Adicionar'});
  }

}

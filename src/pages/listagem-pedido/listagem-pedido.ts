import { NovoPedidoPage } from './../novo-pedido/novo-pedido';
import { NovoClientePage } from './../novo-cliente/novo-cliente';
import { Pedido } from './../../models/pedido';
import { PedidosProvider } from './../../providers/pedidos/pedidos';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the ListagemPedidoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listagem-pedido',
  templateUrl: 'listagem-pedido.html',
})
export class ListagemPedidoPage {

  status: String = 'done';
  
  public items: Observable<Pedido[]>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public pedidosProvider: PedidosProvider) {

    this.filter(status);

    this.items = pedidosProvider.buscarPedidosPorStatus(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListagemPedidoPage');
  }

  filter(status: string){     
    this.items = this.pedidosProvider.buscarPedidosPorStatus(status === 'sent');
  }

  visualizar(pedido: Pedido){
    this.navCtrl.push(NovoPedidoPage, {pedido : pedido});        
  }

  novoPedido() {
    this.navCtrl.push(NovoPedidoPage);
  }

  enviar(item){
    console.log(item);
  }


}

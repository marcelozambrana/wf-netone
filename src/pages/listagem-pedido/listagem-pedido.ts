import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Pedido } from './../../models/pedido';
import { CondicaoPagamento } from '../../models/condicao-pagamento';
import { FormaCobranca } from '../../models/forma-cobranca';

import { NovoPedidoPage } from './../novo-pedido/novo-pedido';
import { PedidosProvider } from './../../providers/pedidos/pedidos';


@IonicPage()
@Component({
  selector: 'page-listagem-pedido',
  templateUrl: 'listagem-pedido.html',
})
export class ListagemPedidoPage {

  status: String = 'done';
  
  public items: Observable<Pedido[]>;

  produtosSelect = [];
  public condicoesPagamentoSelect: CondicaoPagamento[];
  public formasCobrancaSelect: FormaCobranca[];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public pedidosProvider: PedidosProvider) {

    this.produtosSelect = this.navParams.get('produtos') || [];
    this.condicoesPagamentoSelect = this.navParams.get('condicoes') || [];
    this.formasCobrancaSelect = this.navParams.get('formasCobranca') || [];

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
    this.navCtrl.push(NovoPedidoPage, {pedido : pedido,
      produtos: this.produtosSelect, condicoes: this.condicoesPagamentoSelect, 
      formasCobranca: this.formasCobrancaSelect });        
  }

  novoPedido() {
    this.navCtrl.push(NovoPedidoPage);
  }

  enviar(item){
    console.log(item);
  }


}
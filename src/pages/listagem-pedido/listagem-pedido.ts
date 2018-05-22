import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Pedido } from './../../models/pedido';
import { CondicaoPagamento } from '../../models/condicao-pagamento';
import { FormaCobranca } from '../../models/forma-cobranca';
import { CartaoCredito } from '../../models/cartoes-credito';

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
  public cartoes: CartaoCredito[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public pedidosProvider: PedidosProvider) {

    this.produtosSelect = this.navParams.get('produtos') || [];
    this.condicoesPagamentoSelect = this.navParams.get('condicoes') || [];
    this.formasCobrancaSelect = this.navParams.get('formasCobranca') || [];
    this.cartoes = this.navParams.get('cartoes') || [];

    this.filter(status);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListagemPedidoPage');
  }

  filter(status: string) {
    this.items = this.pedidosProvider.buscarPedidosPorStatus(status === 'sent');
  }

  visualizar(pedido: Pedido) {
    let pedidoEdit:any =  JSON.parse(JSON.stringify(pedido));

    this.navCtrl.push(NovoPedidoPage, {
      pedido: pedidoEdit,
      produtos: this.produtosSelect,
      condicoes: this.condicoesPagamentoSelect,
      formasCobranca: this.formasCobrancaSelect,
      cartoes: this.cartoes
    });
  }

  enviar(pedido) {
    console.log(pedido);

    pedido.enviado = true;
    pedido.descontoTotal = pedido.descontoTotal.replace(',', '.');
    this.pedidosProvider.atualizar(pedido).then((result: any) => {
      console.log("Pedido enviado com sucesso!");
    }).catch((error) => {
        pedido.enviado = false;
        pedido.descontoTotal = pedido.descontoTotal.replace('.', ',');
        console.log("Falha ao enviar pedido!");
      });
  }


}

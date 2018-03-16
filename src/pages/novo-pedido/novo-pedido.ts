import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { NovoClientePage } from '../novo-cliente/novo-cliente';

import { Pedido } from '../../models/pedido';
import { CatalogoProdutoPage } from '../catalogo-produto/catalogo-produto';
import { HomePage } from '../home/home';
import { ItemsPedidoPage } from '../items-pedido/items-pedido';

@IonicPage()
@Component({
  selector: 'page-novo-pedido',
  templateUrl: 'novo-pedido.html',
})
export class NovoPedidoPage {

  pedido:any = { enderecoEntrega: {}, total: 0 } as Pedido;

  items:any = [];

  public pedidoForm: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, private ev: Events) {

    this.ev.subscribe('adicionarProdutoCarrinho', produto => {
      console.log('adicionou ao carrinho o produto ' + produto.titulo);
      let novoItem = { 'nome': produto.titulo, 'quantidade': 1, 'preco': produto.preco };
      this.items.push( novoItem );
      this.pedido.total = this.pedido.total + (novoItem.preco * novoItem.quantidade);
      console.log("total " + this.pedido.total);
    });

    this.pedidoForm = formBuilder.group({
      cliente: [''],
      dataPedido: [''],
      dataEntrega: [''],
      formaCobranca: [''],
      condicaoPagamento: [''],
      desconto: [''],
      logradouro: [''],
      complemento: [''],
      numero: [''],
      cep: [''],
      bairro: [''],
      cidade: [''],
      uf: ['']
    });
  }

  adicionarCliente() {
    this.navCtrl.push(NovoClientePage, { titulo: 'Adicionar' });
  }

  adicionarItemPedido() {
    this.navCtrl.push(CatalogoProdutoPage, { fromPedido: true });
  }
  
  cancelar() {
    this.navCtrl.push(HomePage);
  }

  salvar() {
  }

  itemsPedido() {
    this.navCtrl.push(ItemsPedidoPage, { "pedido": this.pedido, "items": this.items});
  }

}

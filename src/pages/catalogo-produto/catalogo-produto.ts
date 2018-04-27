import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events } from 'ionic-angular';

import { DetalhesProdutoPage } from '../detalhes-produto/detalhes-produto';

@IonicPage()
@Component({
  selector: 'page-catalogo-produto',
  templateUrl: 'catalogo-produto.html',
})
export class CatalogoProdutoPage {

  items = [];
  produtos = [];

  searchTerm: string = '';

  page = 0;
  totalPage = 0;
  quantidadeFetch = 5;

  isFromPedido = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private ev: Events, private alertCtrl: AlertController) {

    this.isFromPedido = this.navParams.get('fromPedido') || false;
    this.produtos = this.navParams.get('produtos') || [];
    this.totalPage = (this.produtos.length / this.quantidadeFetch) < 1 ? 1 : (this.produtos.length / this.quantidadeFetch);
    this.buscaMaisProdutos(this.page);
  }

  alert(title, message) {
    let al = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Fechar']
    });
    al.present();
  }

  filtrarProdutos() {
    console.log('filtrando produtos: ' + this.searchTerm);

    if (this.searchTerm === '') {
      this.page = 0;
      this.items = [];
      this.buscaMaisProdutos(this.page);
      return;
    }

    if (this.searchTerm.length < 3) {
      return;
    }

    this.items = this.produtos.filter((item) => {
      return item.descricao.toLowerCase().indexOf(
        this.searchTerm.toLowerCase()) > -1;
    })
  }

  buscaMaisProdutos(numeroPagina) {
    console.log('page: ' + numeroPagina + ', this.produtos.length: ' + this.produtos.length + ', quantidadeFetch: ' + this.quantidadeFetch)
    console.log('start index to fetch: ' + numeroPagina * this.quantidadeFetch)

    if (numeroPagina > this.totalPage)
      return;

    if (this.produtos.length > ((this.totalPage * this.quantidadeFetch) + this.quantidadeFetch)) {
      return;
    }

    let produtosTemp = [...this.produtos];
    let resultArray = produtosTemp.splice(numeroPagina * this.quantidadeFetch, this.quantidadeFetch);
    this.items.push(...resultArray);

  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {

      if (this.searchTerm != '') {
        infiniteScroll.complete();
        return;
      }
      this.page = this.page + 1;

      this.buscaMaisProdutos(this.page);

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }

  detalhes(produto) {
    this.navCtrl.push(DetalhesProdutoPage, { produtoParam: produto })
  }

  adicionarCarrinho(produto) {
    this.ev.publish('adicionarProdutoCarrinho', produto);
    this.alert("Sucesso", "Produto adicionado ao pedido");
  }

}

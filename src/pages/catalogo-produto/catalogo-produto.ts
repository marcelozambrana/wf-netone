import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Events, Platform, ModalController, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-catalogo-produto',
  templateUrl: 'catalogo-produto.html',
})
export class CatalogoProdutoPage {

  items = [];
  produtos = [];

  searchTerm: string = '';
  isFromPedido: boolean = false;

  page: number = 0;
  totalPage: number = 0;
  quantidadeFetch: number = 7;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private ev: Events) {

    this.isFromPedido = this.navParams.get('fromPedido') || false;
    this.produtos = this.navParams.get('produtos') || [];
    this.totalPage = (this.produtos.length / this.quantidadeFetch) < 1 ? 1 : (this.produtos.length / this.quantidadeFetch);
    this.buscaMaisProdutos(this.page);
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
      item.descricao.toLowerCase().contains(this.searchTerm.toLowerCase());
    })
  }

  buscaMaisProdutos(numeroPagina) {
    console.log('page: ' + numeroPagina + ', this.produtos.length: ' + this.produtos.length + ', quantidadeFetch: ' + this.quantidadeFetch)
    console.log('start index to fetch: ' + numeroPagina * this.quantidadeFetch)

    if (numeroPagina > this.totalPage) {
      return;
    }

    if (this.produtos.length > ((this.totalPage * this.quantidadeFetch) + this.quantidadeFetch)) {
      return;
    }

    let produtosTemp = [...this.produtos];
    let resultArray = produtosTemp
      .splice(numeroPagina * this.quantidadeFetch, this.quantidadeFetch)
      .map(prod => {
        let tamanhos = prod.agrupamento.reduce((x, prodReduce) => (prodReduce.tamanho.length === 0 || x.includes(prodReduce.tamanho[0])) ? x : [...x, prodReduce.tamanho[0]], []);
        let cores = prod.agrupamento.reduce((x, prodReduce) => (prodReduce.cor.length === 0 || x.includes(prodReduce.cor[0])) ? x : [...x, prodReduce.cor[0]], []);
        return {
          ...prod,
          tamanho: tamanhos.sort((a, b) => {
            return a > b ? -1 : 1;
          }),
          cor: cores.sort((a, b) => {
            return a > b ? -1 : 1;
          })
        }
      });

    console.log(resultArray);
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

  adicionarCarrinho(produto) {
    if (produto.tamanho.length > 1 || produto.cor.lenght > 1) {
      let modal = this.modalCtrl.create(ModalAdicionarProdutoPage,
        { produtoAdicionar: produto });
      modal.present();
    } else {
      this.ev.publish('adicionarProdutoCarrinho', produto);
      this.alert("Sucesso", "Produto adicionado ao pedido");
    }
  }

  alert(title, message) {
    let al = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Fechar']
    });
    al.present();
  }
}


@Component({
  template: `
<ion-header>
<ion-toolbar>
  <ion-title>
    Produto Adicionar
  </ion-title>
  <ion-buttons start>
    <button ion-button (click)="dismiss()">
      <span ion-text color="primary" showWhen="ios">Cancel</span>
      <ion-icon name="md-close" showWhen="android, windows"></ion-icon>
    </button>
  </ion-buttons>
</ion-toolbar>
</ion-header>

<ion-content style="background: darkmagenta">
  <ion-list>
      <ion-item style="background: darkmagenta">
        <h2 style="color: black">{{ produto.mascara }}</h2>
        <h2 style="font-weight: bold; color: black">{{ produto.descricao }}</h2>
      </ion-item>

      <ion-item *ngFor="let item of grade">
        <div style="padding: 5px">
          <span style="padding-right: 25px">Cor: {{ item.cor }}</span>
          <span style="padding-right: 25px">Tam: {{ item.tamanho }}</span> 
          <span>Valor Unit: {{ item.preco | number }}</span>
        </div>
        <div style="padding: 5px; display: flex; align-items: center;">
          <span>Qtde: {{ item.quantidade }}</span>
          <span style="padding-left: 25px; font-size: xx-large" (tap)="tapAddQtde(item)">
            <ion-icon name="add-circle"></ion-icon>
          </span>
          <span style="padding-left: 25px; font-size: xx-large" (tap)="tapRemoveQtde(item)">
            <ion-icon name="remove-circle"></ion-icon>
          </span>
        </div>
      </ion-item>
  </ion-list>
</ion-content>

<ion-footer>
  <ion-toolbar>
    <ion-buttons end>
      <button ion-button block (click)="dismiss()">Cancelar</button>
      <button ion-button block (click)="salvarModalAdicionar()">Adicionar</button>
    </ion-buttons>
  </ion-toolbar>
</ion-footer>
`
})
export class ModalAdicionarProdutoPage {

  produto;
  grade = [];

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    private alertCtrl: AlertController,
    private ev: Events) {

    this.produto = this.params.get('produtoAdicionar');
    console.log(this.produto);
    let gradeFilter = this.produto.agrupamento.filter(p => {
      return (p.preco && p.preco != null)
    });

    this.grade = gradeFilter.map(p => {
      return {
        mascara: p.mascara,
        idReduzido: p.idReduzido,
        descricao: p.descricao,
        preco: p.preco,
        tamanho: p.tamanho.length > 0 ? p.tamanho[0] : '',
        cor: p.tamanho.length > 0 ? p.cor[0] : '',
        quantidade: 0
      }
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  tapAddQtde(item) {
    item.quantidade++;
  }

  tapRemoveQtde(item) {
    if (item.quantidade > 0) {
      item.quantidade--;
    }
  }

  salvarModalAdicionar() {
    console.log(this.grade)
    let produtosAdicionados = this.grade.filter(p =>  p.quantidade > 0);

    produtosAdicionados.forEach(prodAdd => {
      this.ev.publish('adicionarProdutoCarrinho', prodAdd);
    })

    this.viewCtrl.dismiss();
    this.alert("Sucesso", "Produto adicionado ao pedido");
  }

  alert(title, message) {
    let al = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Fechar']
    });
    al.present();
  }
}
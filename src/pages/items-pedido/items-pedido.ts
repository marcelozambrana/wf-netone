import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-items-pedido',
  templateUrl: 'items-pedido.html',
})
export class ItemsPedidoPage {

  pedido: any = {};
  items: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pedido = this.navParams.get("pedido");
    this.items = this.navParams.get("items");
  }

  ionViewDidLoad() {
  }

  tapAddQuantidade(e, item) {
    item.quantidade++;
    this.pedido.total = this.pedido.total + (item.preco);
  }

  tapRemoveQuantidade(e, item) {
    if (item.quantidade > 0) {
      item.quantidade--;
      this.pedido.total = this.pedido.total - (item.preco);
    }
  }

  excluirItem(item) {
    this.pedido.total = this.pedido.total - (item.preco * item.quantidade);
    this.items.pop(item);
  }

}


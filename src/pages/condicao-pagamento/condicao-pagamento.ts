import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CondicaoPagamentoProvider } from '../../providers/condicao-pagamento/condicao-pagamento';
import { CondicaoPagamento } from '../../models/condicao-pagamento';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-condicao-pagamento',
  templateUrl: 'condicao-pagamento.html',
})
export class CondicaoPagamentoPage {

  public items: Observable<CondicaoPagamento[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public condicaoPagamentoProvider: CondicaoPagamentoProvider) {
  }

  ionViewDidLoad() {
    this.items = this.condicaoPagamentoProvider.condicoes;
  }

  itemSelected(item: CondicaoPagamento) {
    console.log(item);
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CondicaoPagamentoProvider } from '../../providers/condicao-pagamento/condicao-pagamento';
import { CondicaoPagamento } from '../../models/condicao-pagamento';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the CondicaoPagamentoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-condicao-pagamento',
  templateUrl: 'condicao-pagamento.html',
})
export class CondicaoPagamentoPage {

  // public items: CondicaoPagamento[] | any[];


  public items: Observable<CondicaoPagamento[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public condicaoPagamentoProvider: CondicaoPagamentoProvider) {
    // this.items = condicaoPagamentoProvider.findAll();
    this.items = this.condicaoPagamentoProvider.condicao;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CondicaoPagamentoPage');
  }


  itemSelected(item: CondicaoPagamento){
    console.log(item);
  }

}

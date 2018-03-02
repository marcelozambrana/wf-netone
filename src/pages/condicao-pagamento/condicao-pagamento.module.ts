import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CondicaoPagamentoPage } from './condicao-pagamento';

@NgModule({
  declarations: [
    CondicaoPagamentoPage
  ],
  imports: [
    IonicPageModule.forChild(CondicaoPagamentoPage),
  ]
})
export class CondicaoPagamentoPageModule {}

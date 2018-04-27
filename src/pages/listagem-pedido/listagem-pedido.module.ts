import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListagemPedidoPage } from './listagem-pedido';

@NgModule({
  declarations: [
    ListagemPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(ListagemPedidoPage),
  ],
})
export class ListagemPedidoPageModule {}

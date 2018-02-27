import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NovoPedidoPage } from './novo-pedido';

@NgModule({
  declarations: [
    NovoPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(NovoPedidoPage),
  ],
})
export class NovoPedidoPageModule {}

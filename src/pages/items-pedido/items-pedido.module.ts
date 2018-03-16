import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ItemsPedidoPage } from './items-pedido';

@NgModule({
  declarations: [
    ItemsPedidoPage,
  ],
  imports: [
    IonicPageModule.forChild(ItemsPedidoPage),
  ],
})
export class ItemsPedidoPageModule {}

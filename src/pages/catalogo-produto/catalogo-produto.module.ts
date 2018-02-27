import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CatalogoProdutoPage } from './catalogo-produto';

@NgModule({
  declarations: [
    CatalogoProdutoPage,
  ],
  imports: [
    IonicPageModule.forChild(CatalogoProdutoPage),
  ],
})
export class CatalogoProdutoPageModule {}

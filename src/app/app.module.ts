import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';

// Importações para funcionamento do Firebase e da Autenticação
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
// Para usar o serviço de banco de dados é necessário importar o AngularFirestoreModule
import { AngularFirestoreModule } from 'angularfire2/firestore';

// Configurações do FIREBASE
import { firebaseConfig } from '../config';

import { IonicStorageModule } from '@ionic/storage';

import { File } from '@ionic-native/file';

import { SelectSearchableModule } from 'ionic-select-searchable';
import { BrMaskerModule } from 'brmasker-ionic-3';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { NovoPedidoPage } from '../pages/novo-pedido/novo-pedido';
import { ListagemPedidoPage } from './../pages/listagem-pedido/listagem-pedido';
import { CatalogoProdutoPage } from '../pages/catalogo-produto/catalogo-produto';
import { ClientesPage } from '../pages/clientes/clientes';
import { NovoClientePage } from '../pages/novo-cliente/novo-cliente';
import { CondicaoPagamentoPage } from '../pages/condicao-pagamento/condicao-pagamento';
import { ModalAdicionarProdutoPage } from '../pages/catalogo-produto/catalogo-produto';

import { ApiProvider } from '../providers/api/api';
import { ClientesProvider } from '../providers/clientes/clientes';
import { CondicaoPagamentoProvider } from '../providers/condicao-pagamento/condicao-pagamento';
import { PedidosProvider } from '../providers/pedidos/pedidos';
import { ProdutosProvider } from '../providers/produtos/produtos';
import { FormaCobrancaProvider } from '../providers/forma-cobranca/forma-cobranca';
import { ViacepProvider } from '../providers/viacep/viacep';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    NovoPedidoPage,
    CatalogoProdutoPage,
    ClientesPage,
    NovoClientePage,
    CondicaoPagamentoPage,
    ListagemPedidoPage,
    ModalAdicionarProdutoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    // Configurações do Firebase
    AngularFireModule.initializeApp(firebaseConfig),
    //enables offline support in web browsers
    AngularFirestoreModule.enablePersistence(),
    // Configuração do serviço de banco de dados do firebase
    AngularFireDatabaseModule,
    BrMaskerModule,
    SelectSearchableModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    NovoPedidoPage,
    CatalogoProdutoPage,
    ClientesPage,
    NovoClientePage,
    CondicaoPagamentoPage,
    ListagemPedidoPage,
    ModalAdicionarProdutoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    File,
    ApiProvider,
    ClientesProvider,
    CondicaoPagamentoProvider,
    PedidosProvider,
    ProdutosProvider,
    FormaCobrancaProvider,
    ViacepProvider
  ]
})
export class AppModule { }

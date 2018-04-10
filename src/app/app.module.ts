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

import { BrMaskerModule } from 'brmasker-ionic-3';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { LoginProvider } from '../providers/login/login';

import { NovoPedidoPage } from '../pages/novo-pedido/novo-pedido';
import { PedidosProvider } from '../providers/pedidos/pedidos';

import { CatalogoProdutoPage } from '../pages/catalogo-produto/catalogo-produto';
import { DetalhesProdutoPage } from '../pages/detalhes-produto/detalhes-produto';

import { ClientesPage } from '../pages/clientes/clientes';
import { NovoClientePage } from '../pages/novo-cliente/novo-cliente';
import { ClientesProvider } from '../providers/clientes/clientes';

import { CondicaoPagamentoPage } from '../pages/condicao-pagamento/condicao-pagamento';
import { CondicaoPagamentoPageModule } from '../pages/condicao-pagamento/condicao-pagamento.module';
import { CondicaoPagamentoProvider } from '../providers/condicao-pagamento/condicao-pagamento';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    NovoPedidoPage,
    CatalogoProdutoPage,
    DetalhesProdutoPage,
    ClientesPage,
    NovoClientePage,
    CondicaoPagamentoPage,
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
    BrMaskerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    NovoPedidoPage,
    CatalogoProdutoPage,
    DetalhesProdutoPage,
    ClientesPage,
    NovoClientePage,
    CondicaoPagamentoPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ClientesProvider,
    CondicaoPagamentoProvider,
    LoginProvider,
    PedidosProvider
  ]
})
export class AppModule { }

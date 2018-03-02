import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { UsuarioPage } from '../pages/usuario/usuario';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';

// Importações para funcionamento do Firebase e da Autenticação
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

// Para usar o serviço de banco de dados é necessário importar o AngularFirestoreModule
import { AngularFirestoreModule } from 'angularfire2/firestore';

import { AuthProvider } from '../providers/auth/auth'
import { UserProvider } from '../providers/user/user';;
import { ClientesProvider } from '../providers/clientes/clientes';

// Configurações do FIREBASE
import { firebaseConfig } from '../config';

import { PerfilPage } from '../pages/perfil/perfil';
import { NovoPedidoPage } from '../pages/novo-pedido/novo-pedido';
import { CatalogoProdutoPage } from '../pages/catalogo-produto/catalogo-produto';
import { DetalhesProdutoPage } from '../pages/detalhes-produto/detalhes-produto';
import { ClientesPage } from '../pages/clientes/clientes';
import { NovoClientePage } from '../pages/novo-cliente/novo-cliente';
import { CondicaoPagamentoPageModule } from '../pages/condicao-pagamento/condicao-pagamento.module';
import { CondicaoPagamentoProvider } from '../providers/condicao-pagamento/condicao-pagamento';
import { CondicaoPagamentoPage } from '../pages/condicao-pagamento/condicao-pagamento';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    UsuarioPage,
    PerfilPage,
    NovoPedidoPage,
    CatalogoProdutoPage,
    DetalhesProdutoPage,
    ClientesPage,
    NovoClientePage,
    CondicaoPagamentoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    // Configurações do Firebase
    AngularFireModule.initializeApp(firebaseConfig),
    // Configuração do serviço de autenticação do firebase
    AngularFireAuthModule,
    // Configuração do serviço de banco de dados do firebase
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    UsuarioPage,
    PerfilPage,
    NovoPedidoPage,
    CatalogoProdutoPage,
    DetalhesProdutoPage,
    ClientesPage,
    NovoClientePage,
    CondicaoPagamentoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AuthProvider,
    UserProvider,
    ClientesProvider,
    CondicaoPagamentoProvider
  ]
})
export class AppModule { }

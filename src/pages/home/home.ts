import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { NovoPedidoPage } from '../novo-pedido/novo-pedido';
import { ClientesPage } from '../clientes/clientes';
import { CatalogoProdutoPage } from '../catalogo-produto/catalogo-produto';
import { ListagemPedidoPage } from './../listagem-pedido/listagem-pedido';

import { ApiProvider } from '../../providers/api/api';
import { ProdutosProvider } from '../../providers/produtos/produtos';
import { ClientesProvider } from '../../providers/clientes/clientes';
import { CondicaoPagamentoProvider } from '../../providers/condicao-pagamento/condicao-pagamento';
import { FormaCobrancaProvider } from '../../providers/forma-cobranca/forma-cobranca';
import { PedidosProvider } from '../../providers/pedidos/pedidos';

import { Cliente } from '../../models/cliente';
import { FormaCobranca } from '../../models/forma-cobranca';
import { CondicaoPagamento } from '../../models/condicao-pagamento';
import { CartaoCredito } from '../../models/cartoes-credito';
import { Produto } from '../../models/produto';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  mensagem: string;

  //storage properties
  netoneAuthToken;
  netoneNextToken;
  rootPathFirebase;
  sequenceApiProduto;
  sequenceApiCliente;
  sequenceApiCondicoes;
  sequenceApiFormas;

  cidades: any = [];
  produtos: any = [];
  clientes: any = [];
  formasCobranca: any = [];
  condicoesPagamento: any = [];
  cartoes: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private apiProvider: ApiProvider,
    private clientesProvider: ClientesProvider,
    private produtosProvider: ProdutosProvider,
    private condicoesProvider: CondicaoPagamentoProvider,
    private formasProvider: FormaCobrancaProvider,
    private pedidosProvider: PedidosProvider) {

    Promise.all([
      this.storage.get("caminhoFirestone"),
      this.storage.get("netone-auth-token"),
      this.storage.get("netone-next-request-token"),
      this.storage.get("sequenceApiProduto"),
      this.storage.get("sequenceApiCliente"),
      this.storage.get("sequenceApiCondicoes"),
      this.storage.get("sequenceApiFormas")
    ]).then(async values => {

      this.rootPathFirebase = values[0];
      this.netoneAuthToken = values[1];
      this.netoneNextToken = values[2];
      this.sequenceApiProduto = values[3];
      this.sequenceApiCliente = values[4];
      this.sequenceApiCondicoes = values[5];
      this.sequenceApiFormas = values[6];
      console.log('Root path storage firebase: ' + this.rootPathFirebase);
      console.log('Auth token: ' + this.netoneAuthToken);
      console.log('Next token: ' + this.netoneNextToken);
      console.log('sequenceApiProduto: ' + this.sequenceApiProduto);
      console.log('sequenceApiCliente: ' + this.sequenceApiCliente);
      console.log('sequenceApiCondicoes: ' + this.sequenceApiCondicoes);
      console.log('sequenceApiFormas: ' + this.sequenceApiFormas);

      await this.clientesProvider.init();
      await this.produtosProvider.init();
      await this.condicoesProvider.init();
      await this.formasProvider.init();
      await this.pedidosProvider.init();
      this.buscarProdutos();
      this.buscarCondicoesEPlanosOperadora();
      this.buscarFormas();
    });

    this.cidades = this.navParams.get('cidades');

  }

  async buscarProdutos() {
    let produtosTemp = await this.produtosProvider.todos();
    if (!this.produtos) {
      this.produtos = [];
      return;
    } 

    this.produtos = await this.agruparProdutosPorMascara(produtosTemp);
  }

  async agruparProdutosPorMascara(produtos) {
    return new Promise(resolve => {
      let pMascMap = new Map();

      if (!produtos) {
        resolve([]);
        return;
      }

      produtos.forEach(p => {
        let pMap = pMascMap.get(p.mascara);
        if (pMap) {
          pMap.agrupamento.push(p);
        } else {
          p.agrupamento = [{ ...p }];
          pMascMap.set(p.mascara, p);
        }
      })

      let retorno = [...Array.from(pMascMap.values()).slice(0)];
      resolve(retorno);
    })
  }

  async buscarCondicoesEPlanosOperadora() {
    this.condicoesPagamento = await this.condicoesProvider.todos();
    this.cartoes = await this.condicoesProvider.todosCartoes();
    
    this.condicoesPagamento = !this.condicoesPagamento ? [] : this.condicoesPagamento;
    this.cartoes = !this.cartoes ? [] : this.cartoes;

    console.log(this.condicoesPagamento);
    console.log(this.cartoes);
  }

  async buscarFormas() {
    this.formasCobranca = await this.formasProvider.todos();
    if (!this.formasCobranca) {
      this.formasCobranca = [];
    }
    console.log(this.formasCobranca);
  }

  clientesPage() {
    this.navCtrl.push(ClientesPage, {
        cidades: this.cidades
    });
  }

  catalogoPage() {
    if (this.produtos.length === 0) {
      this.buscarProdutos();
    }

    this.navCtrl.push(CatalogoProdutoPage,
      {
        produtos: this.produtos
      });
  }

  novoPedidoPage() {
    if (this.produtos.length === 0) {
      this.buscarProdutos();
    }

    this.navCtrl.push(NovoPedidoPage,
      {
        produtos: this.produtos,
        condicoes: this.condicoesPagamento,
        formasCobranca: this.formasCobranca,
        cartoes: this.cartoes,
        cidades: this.cidades
      });
  }

  pedidosPage() {
    this.navCtrl.push(ListagemPedidoPage,
      {
        produtos: this.produtos,
        condicoes: this.condicoesPagamento,
        formasCobranca: this.formasCobranca,
        cartoes: this.cartoes,
        cidades: this.cidades
      });
  }

  relatorios() {
  }

  async logout() {

    this.storage.set('usuarioAutenticado', false);
    this.storage.set('caminhoFirestone', null);
    this.storage.set('netone-auth-token', null);
    this.storage.set('netone-next-request-token', null);

    try {
      const result: any = await this.apiProvider.logout(this.netoneAuthToken, this.netoneNextToken);
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    this.navCtrl.setRoot(LoginPage);
  }

  async syncServer() {

    let loaderSync = this.loadingCtrl.create({
      content: 'Sincronizando Clientes e Produtos... Essa operação pode levar alguns minutos...',
      dismissOnPageChange: true
    });

    let resultSyncProdutos: any;
    let resultSyncClientes: any;
    let resultSyncFormas: any;
    let resultSyncCondicoes: any;
    let resultSyncCartoes: any;

    loaderSync.present();

    try {

      resultSyncProdutos = await this.apiProvider.syncProdutos(this.netoneAuthToken, this.netoneNextToken, this.sequenceApiProduto);
      resultSyncClientes = await this.apiProvider.syncClientes(this.netoneAuthToken, this.netoneNextToken, this.sequenceApiCliente);
      resultSyncFormas = await this.apiProvider.syncFormas(this.netoneAuthToken, this.netoneNextToken, this.sequenceApiFormas);
      resultSyncCondicoes = await this.apiProvider.syncCondicoes(this.netoneAuthToken, this.netoneNextToken, this.sequenceApiCondicoes);
      resultSyncCartoes = await this.apiProvider.syncCartoesPlanos(this.netoneAuthToken, this.netoneNextToken);

      console.log('sincronizando...')
      await this.processaProdutosAPI(resultSyncProdutos);
      await this.processaClientesAPI(resultSyncClientes);
      await this.processaFormasAPI(resultSyncFormas);
      await this.processaCondicoesAPI(resultSyncCondicoes);
      await this.processaCartoesPlanosAPI(resultSyncCartoes);
      console.log('final sincronizacao ...')
    } catch (error) {
      console.log(error);
      this.toastAlert(error.message);
    } finally {
      loaderSync.dismiss();
    }
  }

  async processaCondicoesAPI(result) {
    if (this.sequenceApiCondicoes != null && this.sequenceApiCondicoes >= result[0].sequence) {
      console.log('sequence atual = ' + this.sequenceApiCondicoes + ', sequence retornada = ' + result[0].sequence);
      console.log('Nenhuma atualização de condicoes de pagamento disponível');
      return false;
    }

    let self = this;

    let condicoesApi: CondicaoPagamento[] = result[0].result;

    await condicoesApi.forEach(async function (condicao) {

      let condicaoDadoId = self.condicoesPagamento.filter(element => {
        return element.id === condicao.id;
      })

      if (condicaoDadoId.length > 0) {
        let condicaoPagamento = { 'idFirebase': condicaoDadoId[0].idFirebase, ...condicao } as CondicaoPagamento;
        self.condicoesProvider.atualizar(condicaoPagamento).then((result: any) => {
          console.log("Atualizando condicao pagamento: " + condicaoPagamento.id);
        })
      } else {
        self.condicoesProvider.adicionar(condicao).then((result: any) => {
          console.log("Salvando novo condicao pagamento: " + condicao.id);
        })
      }
    })

    console.log('atualizando sequence condicoes pagamento de ' + this.sequenceApiCondicoes + ' para ' + result[0].sequence);
    this.storage.set('sequenceApiCondicoes', result[0].sequence);
    this.sequenceApiCondicoes = result[0].sequence;
  }

  async processaCartoesPlanosAPI(result) {
    console.log('sequence retornada api cartoescredito  = ' + result[0].sequence);

    let self = this;

    let cartoesCreditoApi: CartaoCredito[] = result[0].result;

    cartoesCreditoApi.forEach(function (cartao) {

      let planoDadoId = self.cartoes.filter(element => {
        return element.id === cartao.id;
      })

      if (planoDadoId.length > 0) {
        let cartaoCredito = { 'idFirebase': planoDadoId[0].idFirebase, ...cartao } as CartaoCredito;
        self.condicoesProvider.atualizarCartao(cartaoCredito).then((result: any) => {
          console.log("Atualizando cartão crédito: " + cartaoCredito.id);
        })
      } else {
        self.condicoesProvider.adicionarCartao(cartao).then((result: any) => {
          console.log("Salvando novo cartão crédito: " + cartao.id);
        })
      }
    })

    console.log('atualizando sequence condicoes pagamento de ' + this.sequenceApiCondicoes + ' para ' + result[0].sequence);
    this.storage.set('sequenceApiCondicoes', result[0].sequence);
    this.sequenceApiCondicoes = result[0].sequence;

  }

  async processaFormasAPI(result) {
    if (this.sequenceApiFormas != null && this.sequenceApiFormas >= result[0].sequence) {
      console.log('sequence atual = ' + this.sequenceApiFormas + ', sequence retornada = ' + result[0].sequence);
      console.log('Nenhuma atualização de formas de pagamento disponível');
      return false;
    }

    let self = this;

    let formasApi: FormaCobranca[] = result[0].result;

    formasApi.forEach(async function (forma) {

      let formaDadoId = self.formasCobranca.filter(element => {
        return element.id === forma.id;
      })

      if (formaDadoId.length > 0) {
        let formaCobranca = { 'idFirebase': formaDadoId[0].idFirebase, ...forma } as FormaCobranca;
        self.formasProvider.atualizar(formaCobranca).then((result: any) => {
          console.log("Atualizando forma cobranca: " + formaCobranca.id);
        })
      } else {
        self.formasProvider.adicionar(forma).then((result: any) => {
          console.log("Salvando novo forma cobranca: " + forma.id);
        })
      }
    })

    console.log('atualizando sequence formas cobranca de ' + this.sequenceApiFormas + ' para ' + result[0].sequence);
    this.storage.set('sequenceApiFormas', result[0].sequence);
    this.sequenceApiFormas = result[0].sequence;
  }

  async processaClientesAPI(result) {
    if (this.sequenceApiCliente != null && this.sequenceApiCliente >= result[0].sequence) {
      console.log('sequence atual = ' + this.sequenceApiCliente + ', sequence retornada = ' + result[0].sequence);
      console.log('Nenhuma atualização de clientes disponível');
      return false;
    }

    let self = this;

    let clientesApi: Cliente[] = result[0].result;

    clientesApi.forEach(function (cli) {

      let clientesDadoId = self.clientes.filter(element => {
        return element.cpfCnpj === cli.cpfCnpj;
      })
      
      cli.isNovo = false;

      if (clientesDadoId.length > 0) {
        let cliente = { 'id': clientesDadoId[0].id, ...cli } as Cliente;
        self.clientesProvider.atualizar(cliente).then((result: any) => {
          console.log("Atualizando cliente: " + cli.cpfCnpj);
        })
      } else {
        self.clientesProvider.adicionar(cli).then((result: any) => {
          console.log("Salvando novo cliente: " + cli.cpfCnpj);
        })
      }
    })

    console.log('atualizando sequence cliente de ' + this.sequenceApiCliente + ' para ' + result[0].sequence);
    this.storage.set('sequenceApiCliente', result[0].sequence);
    this.sequenceApiCliente = result[0].sequence;
  }

  async processaProdutosAPI(result) {
    if (this.sequenceApiProduto != null && this.sequenceApiProduto >= result[0].sequence) {
      console.log('sequence atual = ' + this.sequenceApiProduto + ', sequence retornada = ' + result[0].sequence);
      console.log('Nenhuma atualização de produtos disponível');
      return false;
    }

    let self = this;

    let produtosApiMap = result[0].result.map(p => {
      return {
        "idReduzido": p.idReduzido,
        "mascara": p.mascara,
        "descricao": p.descricao,
        "grupo": p.grupoDescricao,
        "subgrupo": p.subgrupoDescricao,
        "modelo": p.modelo,
        "cor": p.cor ? [p.cor] : [],
        "tamanho": p.tamanho ? [p.tamanho] : [],
        "largura": (p.largura && p.largura > 0) ? p.largura : null,
        "altura": (p.altura && p.altura > 0) ? p.altura : null,
        "comprimento": (p.comprimento && p.comprimento > 0) ? p.comprimento : null,
        "preco": p.valor,
        "urlImgs": p.urlImagens.length > 0 ? p.urlImagens : ['assets/imgs/no-product.jpg']
      }
    })

    produtosApiMap.forEach(function (item) {
      item.grupo = !item.grupo ? '' : item.grupo;
      item.subgrupo = !item.subgrupo ? '' : item.subgrupo;
      item.modelo = !item.modelo ? '' : item.modelo;

      let produtosDadoId = self.produtos.filter(element => {
        return element.idReduzido === item.idReduzido;
      })

      if (produtosDadoId.length > 0) {
        let prod = { 'id': produtosDadoId[0].id, ...item } as Produto;
        self.produtosProvider.atualizar(prod).then((result: any) => {
          console.log("Atualizando produto: " + item.idReduzido);
        })
      } else {
        self.produtosProvider.adicionar(item).then((result: any) => {
          console.log("Salvando novo produto: " + item.idReduzido);
        })
      }
    })

    console.log('atualizando sequence produto de ' + this.sequenceApiProduto + ' para ' + result[0].sequence);
    this.storage.set('sequenceApiProduto', result[0].sequence);
    this.sequenceApiProduto = result[0].sequence;
  }

  toastAlert(message) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 3000,
      closeButtonText: 'Fechar',
      dismissOnPageChange: true,
      cssClass: 'toast-error'
    });
    toast.present();
  }

  toastMessage(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      dismissOnPageChange: true,
      showCloseButton: true,
      closeButtonText: 'Fechar'
    });
    toast.present();
  }

}

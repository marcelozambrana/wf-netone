import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { LoginPage } from '../login/login';
import { NovoPedidoPage } from '../novo-pedido/novo-pedido';
import { ClientesPage } from '../clientes/clientes';
import { CatalogoProdutoPage } from '../catalogo-produto/catalogo-produto';
import { ListagemPedidoPage } from './../listagem-pedido/listagem-pedido';

import { ApiProvider } from '../../providers/api/api';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';
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

  usuarioLogado: any = null;

  //storage properties
  netoneAuthToken;
  netoneNextToken;
  rootPathFirebase;

  produtos: any = [];
  clientes: any = [];
  formasCobranca: any = [];
  condicoesPagamento: any = [];
  cartoes: any = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private apiProvider: ApiProvider,
    private usuariosProvider: UsuariosProvider,
    private clientesProvider: ClientesProvider,
    private produtosProvider: ProdutosProvider,
    private condicoesProvider: CondicaoPagamentoProvider,
    private formasProvider: FormaCobrancaProvider,
    private pedidosProvider: PedidosProvider) {

    let loaderInit = this.loadingCtrl.create({
      content: 'Carregando dados...',
    });
    loaderInit.present();

    this.usuarioLogado = this.navParams.get('usuarioLogado');

    Promise.all([
      this.storage.get("caminhoFirestone"),
      this.storage.get("netone-auth-token"),
      this.storage.get("netone-next-request-token"),
    ]).then(async values => {

      this.rootPathFirebase = values[0];
      this.netoneAuthToken = values[1];
      this.netoneNextToken = values[2];
      console.log('Root path storage firebase: ' + this.rootPathFirebase);
      console.log('Auth token: ' + this.netoneAuthToken);
      console.log('Next token: ' + this.netoneNextToken);

      await this.clientesProvider.init();
      await this.produtosProvider.init();
      await this.condicoesProvider.init();
      await this.formasProvider.init();
      await this.pedidosProvider.init();
      this.buscarProdutos();
      this.buscarCondicoesEPlanosOperadora();
      this.buscarFormas();

      loaderInit.dismiss();
    });
  }

  async buscarProdutos() {
    let produtosTemp = await this.produtosProvider.todos();
    if (!produtosTemp || produtosTemp == null) {
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

    this.condicoesPagamento = this.condicoesPagamento ? this.condicoesPagamento : [];
    this.cartoes = !this.cartoes ? [] : this.cartoes;

    console.log('condições pagamento:');
    console.log(this.condicoesPagamento);
    console.log('cartões:');
    console.log(this.cartoes);
  }

  async buscarFormas() {
    this.formasCobranca = await this.formasProvider.todos();
    if (!this.formasCobranca) {
      this.formasCobranca = [];
    }
    console.log('formas de cobrança:');
    console.log(this.formasCobranca);
  }

  clientesPage() {
    this.navCtrl.push(ClientesPage);
  }

  catalogoPage() {
    this.navCtrl.push(CatalogoProdutoPage, {
      produtos: this.produtos
    });
  }

  novoPedidoPage() {
    this.navCtrl.push(NovoPedidoPage,
      {
        produtos: this.produtos,
        condicoes: this.condicoesPagamento,
        formasCobranca: this.formasCobranca,
        cartoes: this.cartoes
      });
  }

  pedidosPage() {
    this.navCtrl.push(ListagemPedidoPage,
      {
        produtos: this.produtos,
        condicoes: this.condicoesPagamento,
        formasCobranca: this.formasCobranca,
        cartoes: this.cartoes,
        rootPathFirebase: this.rootPathFirebase,
        netoneAuthToken: this.netoneAuthToken,
        netoneNextToken: this.netoneNextToken,
        usuarioLogado: this.usuarioLogado
      });
  }

  async logout() {

    this.storage.set('usuarioAutenticado', false);
    this.storage.set('caminhoFirestone', null);
    this.storage.set('netone-auth-token', null);
    this.storage.set('netone-next-request-token', null);

    try {
      const result: any = await this.apiProvider.logout(this.netoneAuthToken,
        this.netoneNextToken);
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    this.navCtrl.setRoot(LoginPage);
  }

  async syncServer() {

    let resultSyncProdutos: any;
    let resultSyncClientes: any;
    let resultSyncFormas: any;
    let resultSyncCondicoes: any;
    let resultSyncCartoes: any;

    let loaderSync = this.loadingCtrl.create({
      content: 'Sincronizando dados com o servidor... Essa operação pode levar alguns minutos...',
      dismissOnPageChange: true
    });
    loaderSync.present();

    try {
      console.log('sincronizando...')

      resultSyncProdutos = await this.apiProvider.syncProdutos(this.netoneAuthToken,
        this.netoneNextToken, this.usuarioLogado.sequenceApiProduto);

      resultSyncClientes = await this.apiProvider.syncClientes(this.netoneAuthToken,
        this.netoneNextToken, this.usuarioLogado.sequenceApiCliente);

      resultSyncFormas = await this.apiProvider.syncFormas(this.netoneAuthToken,
        this.netoneNextToken, this.usuarioLogado.sequenceApiFormaCob);

      resultSyncCondicoes = await this.apiProvider.syncCondicoes(this.netoneAuthToken,
        this.netoneNextToken, this.usuarioLogado.sequenceApiCondPgto);

      resultSyncCartoes = await this.apiProvider.syncCartoesPlanos(this.netoneAuthToken,
        this.netoneNextToken);

      this.usuarioLogado.sequenceApiProduto = await this.processaProdutosAPI(resultSyncProdutos);
      this.usuarioLogado.sequenceApiCliente = await this.processaClientesAPI(resultSyncClientes);
      this.usuarioLogado.sequenceApiFormaCob = await this.processaFormasAPI(resultSyncFormas);
      this.usuarioLogado.sequenceApiCondPgto = await this.processaCondicoesAPI(resultSyncCondicoes);
      await this.processaCartoesPlanosAPI(resultSyncCartoes);

      await this.usuariosProvider.atualizar(this.usuarioLogado);
      console.log('final sincronizacao ...');

    } catch (error) {
      console.log(error);
      this.toastAlert(error.message);
    } finally {
      loaderSync.dismiss();
    }
  }

  async processaCondicoesAPI(result) {

    let sequenceCP = this.usuarioLogado.sequenceApiCondPgto;

    if (sequenceCP != null && sequenceCP >= result[0].sequence) {
      console.log('sequence atual = ' + sequenceCP + ', sequence retornada = ' + result[0].sequence);
      console.log('Nenhuma atualização de condicoes de pagamento disponível');
      return sequenceCP;
    }

    let self = this;
    let condicoesApi: CondicaoPagamento[] = result[0].result;

    await condicoesApi.forEach(async function (condicao) {

      let condicaoDadoId: any = self.condicoesPagamento.reduce((retorno, c) =>
        c.id == condicao.id ? c : retorno, null);

      await self.updateCondicao(condicaoDadoId, condicao);

    })

    console.log('atualizando sequence condicoes pagamento de ' + sequenceCP + ' para ' + result[0].sequence);
    return result[0].sequence;
  }

  async processaCartoesPlanosAPI(result) {

    console.log('sequence retornada api cartoescredito  = ' + result[0].sequence);

    let self = this;
    let cartoesCreditoApi: CartaoCredito[] = result[0].result;

    cartoesCreditoApi.forEach(async function (cartao) {

      let planoDadoId: any = self.cartoes.reduce((retorno, p) =>
        p.id == cartao.id ? p : retorno, null);

      await self.updateCartaoCred(planoDadoId, cartao);

    })

    console.log('atualizando sequence plano operadora  para ' + result[0].sequence);
    return result[0].sequence;
  }

  async processaFormasAPI(result) {

    let sequenceF = this.usuarioLogado.sequenceApiFormaCob;

    if (sequenceF != null && sequenceF >= result[0].sequence) {
      console.log('sequence atual = ' + sequenceF + ', sequence retornada = ' + result[0].sequence);
      console.log('Nenhuma atualização de formas de pagamento disponível');
      return sequenceF;
    }

    let self = this;
    let formasApi: FormaCobranca[] = result[0].result;

    formasApi.forEach(async function (forma) {

      let formaDadoId: any = self.formasCobranca.reduce((retorno, f) =>
        f.id == forma.id ? f : retorno, null);

      await self.updateForma(formaDadoId, forma);

    })

    console.log('atualizando sequence formas cobranca de ' + sequenceF + ' para ' + result[0].sequence);
    return result[0].sequence;
  }

  async processaClientesAPI(result) {

    let sequenceC = this.usuarioLogado.sequenceApiCliente;

    if (sequenceC != null && sequenceC >= result[0].sequence) {
      console.log('sequence atual = ' + sequenceC + ', sequence retornada = ' + result[0].sequence);
      console.log('Nenhuma atualização de clientes disponível');
      return sequenceC;
    }

    let self = this;
    let clientesApi: Cliente[] = result[0].result;

    clientesApi.forEach(async function (cli) {

      let clienteDadoId = null;
      self.clientes.forEach(c => {
        if (c.cpfCnpj == cli.cpfCnpj) {
          clienteDadoId = c;
        }
      });

      await self.updateCliente(clienteDadoId, cli);

    })

    console.log('atualizando sequence cliente de ' + sequenceC + ' para ' + result[0].sequence);
    return result[0].sequence;
  }

  async processaProdutosAPI(result) {

    let sequenceP = this.usuarioLogado.sequenceApiProduto;

    if (sequenceP != null && sequenceP >= result[0].sequence) {
      console.log('sequence atual = ' + sequenceP + ', sequence retornada = ' + result[0].sequence);
      console.log('Nenhuma atualização de produtos disponível');
      return sequenceP;
    }

    let self = this;
    let produtosApiMap = result[0].result.map(p => {
      return {
        "mascara": p.mascara,
        "idReduzido": p.idReduzido,
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

    let produtosTemp: any = await this.produtosProvider.todos();

    produtosApiMap.forEach(async function (item) {

      let produtoDadoId = null;

      if (produtosTemp && produtosTemp != null) {
        produtosTemp.forEach(p => {
          if (p.idReduzido == item.idReduzido) {
            produtoDadoId = p.id;
          }
        });
      }

      await self.updateProduto(produtoDadoId, item);
      
    })

    console.log('atualizando sequence produto de ' + sequenceP + ' para ' + result[0].sequence);
    return result[0].sequence;
  }

  async updateForma(formaDadoId, forma) {

    if (formaDadoId != null) {
      let formaCobranca = { 'idFirebase': formaDadoId.idFirebase, ...forma } as FormaCobranca;
      this.formasProvider.atualizar(formaCobranca);
    } else {
      this.formasProvider.adicionar(forma);
    }
  }

  async updateCartaoCred(planoDadoId, cartao) {

    if (planoDadoId != null) {
      let cartaoCredito = { 'idFirebase': planoDadoId.idFirebase, ...cartao } as CartaoCredito;
      this.condicoesProvider.atualizarCartao(cartaoCredito);
    } else {
      this.condicoesProvider.adicionarCartao(cartao);
    }
  }

  async updateCondicao(condicaoDadoId, condicao) {

    if (condicaoDadoId != null) {
      let condicaoPgto = { 'idFirebase': condicaoDadoId.idFirebase, ...condicao } as CondicaoPagamento;
      await this.condicoesProvider.atualizar(condicaoPgto);
    } else {
      await this.condicoesProvider.adicionar(condicao);
    }
  }

  async updateCliente(clienteDadoId, cli) {

    cli.isNovo = false;

    if (clienteDadoId != null) {
      let cliente = { 'id': clienteDadoId.id, ...cli } as Cliente;
      await this.clientesProvider.atualizar(cliente);
    } else {
      await this.clientesProvider.adicionar(cli);
    }
  }

  async updateProduto(prodId, prod) {

    prod.grupo = !prod.grupo ? '' : prod.grupo;
    prod.subgrupo = !prod.subgrupo ? '' : prod.subgrupo;
    prod.modelo = !prod.modelo ? '' : prod.modelo;

    if (prodId != null) {
      let prodUpdate = { 'id': prodId, ...prod } as Produto;
      await this.produtosProvider.atualizar(prodUpdate);
    } else {
      await this.produtosProvider.adicionar(prod);
    }
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

}

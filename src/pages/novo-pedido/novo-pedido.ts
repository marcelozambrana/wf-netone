import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { SelectSearchable } from 'ionic-select-searchable';

import { Cliente } from '../../models/cliente';
import { Pedido } from '../../models/pedido';
import { CondicaoPagamento } from '../../models/condicao-pagamento';
import { FormaCobranca } from '../../models/forma-cobranca';

import { HomePage } from '../home/home';
import { NovoClientePage } from '../novo-cliente/novo-cliente';
import { CatalogoProdutoPage } from '../catalogo-produto/catalogo-produto';

import { PedidosProvider } from '../../providers/pedidos/pedidos';
import { CondicaoPagamentoProvider } from '../../providers/condicao-pagamento/condicao-pagamento';
import { ClientesProvider } from '../../providers/clientes/clientes';
import { CartaoCredito } from '../../models/cartoes-credito';
import { PlanoOperadora } from '../../models/plano-operadora';

@IonicPage()
@Component({
  selector: 'page-novo-pedido',
  templateUrl: 'novo-pedido.html',
})
export class NovoPedidoPage {

  produtos = [];
  clientes: any = [];
  pedido: Pedido | any = { total: 0, itens: [] };

  anoEntregaMin = new Date().getFullYear();
  anoEntregaMax = new Date().getFullYear() + 1;
  isFormaCobrancaDinheiro = false;
  isFormaCobrancaCartao = false;

  passo: string = "selecionarCliente";
  pedirConfirmacaoParaSairDoPedido: boolean = true;

  mensagemClienteNaoEncontrado: string = "Cliente não encontrado";

  clientSearch: boolean = false;
  clientFound: boolean = false;
  qtdTotal: number = 0;

  public pedidoForm: any;
  public condicoesPagamento: CondicaoPagamento[];
  public formasCobranca: FormaCobranca[];
  public cartoes: CartaoCredito[];
  public planosCartao: PlanoOperadora[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public formBuilder: FormBuilder, private ev: Events,
    private loadingCtrl: LoadingController,
    private condicaoPagamentoService: CondicaoPagamentoProvider,
    private pedidoService: PedidosProvider,
    private clientesProvider: ClientesProvider,
    private alertCtrl: AlertController, private toastCtrl: ToastController) {

    this.produtos = this.navParams.get('produtos') || [];
    this.condicoesPagamento = this.navParams.get('condicoes') || [];
    this.formasCobranca = this.navParams.get('formasCobranca') || [];
    this.cartoes = this.navParams.get('cartoes') || [];
    this.planosCartao = [];

    let pedidoEdit = this.navParams.get('pedido');
    if (pedidoEdit) {
      console.log(pedidoEdit);
      this.passo = "produtos";
      this.pedido = pedidoEdit;
      this.calcQtde();
      this.calcFormaCobranca();
    } else {
      this.carregarClientes()
    }

    this.ev.subscribe('adicionarProdutoCarrinho', produto => {
      console.log('adicionou ao carrinho idReduzido ' + produto.idReduzido);
      let novoItem = {
        'mascara': produto.mascara,
        'idReduzido': produto.idReduzido,
        'nome': produto.descricao,
        'quantidade': produto.quantidade ? produto.quantidade : 1,
        'valor': produto.preco,
        'tamanho': produto.tamanho.length > 0 ? produto.tamanho : '',
        'cor': produto.cor.length > 0 ? produto.cor : ''
      };

      let result = this.pedido.itens.filter(element => {
        return element.idReduzido === produto.idReduzido
      })

      if (result.length > 0) {
        result[0].quantidade++;
        this.calcTotalPedido(result[0].valor);
        this.calcQtde();
      } else {
        this.pedido.itens.push(novoItem);
        this.calcTotalPedido(novoItem.valor * novoItem.quantidade);
        this.calcQtde();
      }
    });
  }

  async carregarClientes() {
    this.clientes = await this.clientesProvider.todosParaPedido();
  }

  adicionarCliente() {
    let cidadesParam = this.navParams.get('cidades')
    this.navCtrl.push(NovoClientePage, {
      titulo: 'Adicionar',
      cidades: cidadesParam,
      fromPedido: true
    });
  }

  adicionarItemPedido() {
    this.pedirConfirmacaoParaSairDoPedido = false;

    this.navCtrl.push(CatalogoProdutoPage, { fromPedido: true, produtos: this.produtos });
  }

  cancelar() {
    this.navCtrl.push(HomePage);
  }

  async validarPedido(ped) {

    if (!this.pedido.formaCobrancaId) {
      this.toastAlert("Informe uma forma de cobrança");
      return false;
    }

    if (!this.pedido.condicaoPagamentoId && !this.isFormaCobrancaCartao) {
      this.toastAlert("Informe uma condição de pagamento");
      return false;
    }

    if ((!this.pedido.cartaoId || !this.pedido.planoOperadoraId) && this.isFormaCobrancaCartao) {
      this.toastAlert("Informe um cartão e plano operadora");
      return false;
    }

    if (!ped.previsaoEntrega) {
      console.log(ped.previsaoEntrega)
      this.toastAlert("Data previsão entrega não informada");
      return false;
    }

    let descontoValido = await this.calcDesconto();

    if (ped.total <= 0) {
      this.toastAlert("Pedido não pode ter valor total menor ou igual a zero");
      return false;
    }

    return descontoValido;
  }

  async salvar() {
    let retorno = await this.validarPedido(this.pedido);
    if (!retorno) {
      return;
    }

    this.pedirConfirmacaoParaSairDoPedido = false;

    if (!this.pedido.numero) {
      this.pedido.enviado = false;

      this.pedidoService.adicionar(this.pedido).then((result: any) => {
        this.alert("Sucesso", "Pedido realizado com sucesso.");
        this.navCtrl.pop();
      })
        .catch((error) => {
          this.alert("Error", "Falha ao realizar pedido!");
        });
    } else {
      this.pedidoService.atualizar(this.pedido).then((result: any) => {
        this.alert("Sucesso", "Pedido realizado com sucesso.");
        this.navCtrl.pop();
      })
        .catch((error) => {
          this.alert("Error", "Falha ao realizar pedido!");
        });
    }
  }

  alert(title, message) {
    let al = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Fechar']
    });
    al.present();
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

  onBlurCpfCnpj(value) {

    if (!value) {
      this.clientSearch = true;
      return;
    }

    this.buscarCliente(value.replace(/\D/g, ""))
      .subscribe(queriedItems => {
        if (queriedItems.length > 0) {
          this.pedido.cliente = queriedItems[0];
          this.clientFound = true;
        } else {
          this.clientFound = false;
          this.toastAlert(this.mensagemClienteNaoEncontrado);
        }

        this.clientSearch = true;
      });
  }

  buscarCliente(cpfCnpj) {
    return this.clientesProvider.buscarCpfCnpj(cpfCnpj);
  }

  limparCliente() {
    this.pedido.cliente = null;
    this.clientFound = false;
    this.passo = "selecionarCliente";
  }

  selecionaClienteEContinua() {

    if (!this.pedido.cliente) {
      this.toastAlert("Informe um CPF/CNPJ");
    }

    if (!this.clientFound) {
      this.onBlurCpfCnpj(this.pedido.cliente);
    }

    if (!this.clientFound) {
      return;
    } else {
      this.pedido.emissao = new Date().toISOString();
      this.pedido.descontoTotal = '0,00';
      this.passo = "dataEmissao";
    }
  }

  selecionaPrevisaoEntregaEContinua() {
    if (!this.pedido.previsaoEntrega) {
      this.toastAlert("Data previsão entrega não preenchida");
      return;
    }

    let today = new Date();
    let dtPrevisao = new Date(this.pedido.previsaoEntrega + 'T00:00:00');
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    console.log(today);
    console.log(dtPrevisao);
    if (Math.floor(dtPrevisao.getTime() / 1000) < Math.floor(today.getTime() / 1000)) {
      this.toastAlert("Data previsão inválida");
      return;
    }

    this.passo = "produtos";
  }

  tapAddQuantidade(e, item) {
    item.quantidade++;
    this.calcTotalPedido(item.valor);
    this.calcQtde();
  }

  tapRemoveQuantidade(e, item) {
    if (item.quantidade > 0) {
      item.quantidade--;
      this.calcTotalPedido(-item.valor);
      this.calcQtde();
    }
  }

  excluirItem(item) {
    this.calcTotalPedido(-item.valor * item.quantidade);
    let index = this.pedido.itens.indexOf(item);
    if (index !== -1) this.pedido.itens.splice(index, 1);

    this.calcQtde();
  }

  editItem(item) {
    console.log(item);
  }

  async resumoPedido() {
    if (this.qtdTotal <= 0) {
      this.toastAlert("Informe pelo menos um produto!");
      return;
    }

    this.pedido.cliente.endereco.complemento =
      this.pedido.cliente.endereco.complemento ? this.pedido.cliente.endereco.complemento : '';

    console.log(this.pedido);

    await this.calcDesconto();

    this.passo = "dadosPagamento";
  }

  voltarAdicionarItens() {
    this.passo = "produtos";
  }

  calcTotalPedido(valorAdicionar) {
    if (!this.pedido.total || this.pedido.total < 0) {
      this.pedido.total = 0;
    }
    this.pedido.total = this.pedido.total + valorAdicionar;
    console.log("total " + this.pedido.total);
  }

  calcTotalPedidoCompleto() {
    let totalPedido = 0;

    this.pedido.itens.forEach(item => {
      totalPedido = totalPedido + (item.valor * item.quantidade);
    });

    return totalPedido;
  }

  calcQtde() {
    this.qtdTotal = 0;
    this.pedido.itens.forEach(item => {
      this.qtdTotal = this.qtdTotal + item.quantidade;
    });
  }

  async calcDesconto() {
    console.log('calculando desconto...');
    console.log(this.pedido.descontoTotal);
    let totalItens = this.calcTotalPedidoCompleto();
    let desconto = this.pedido.descontoTotal.replace(',', '.');
    let descontoMaximo = null;
    let percentualVariacao = null;

    if (this.pedido.condicaoPagamentoId) {
      let condicao: any = this.condicoesPagamento.reduce((retorno, c) => {
        if (c.id == this.pedido.condicaoPagamentoId) {
          return c;
        } else {
          return retorno;
        }
      }, null);
      console.log(condicao)
      if (condicao != null && condicao.percentualDescontoMaximo && condicao.percentualDescontoMaximo > 0) {
        descontoMaximo = totalItens * (condicao.percentualDescontoMaximo / 100);
        console.log('desconto máximo: ' + descontoMaximo);
        descontoMaximo = descontoMaximo.toFixed(2);
      }
    }

    if (this.pedido.planoOperadoraId) {
      let plano: any = this.planosCartao.reduce((retorno, c) => {
        if (c.id == this.pedido.planoOperadoraId) {
          return c;
        } else {
          return retorno;
        }
      }, null);
      console.log(plano)
      if (plano.percentualDescontoMaximo && plano.percentualDescontoMaximo > 0) {
        descontoMaximo = totalItens * (plano.percentualDescontoMaximo / 100);
        console.log('desconto máximo: ' + descontoMaximo);
        descontoMaximo = descontoMaximo.toFixed(2);
        console.log('percentual variacao: ' + plano.percentualVariacao);
        percentualVariacao = plano.percentualVariacao;
      }
    }

    console.log('desconto: ' + desconto);
    console.log(desconto);
    console.log('desconto máximo fixed: ' + descontoMaximo);
    console.log(descontoMaximo);
    console.log(+desconto > +descontoMaximo)
    if (desconto && descontoMaximo && + desconto > +descontoMaximo) {
      this.toastAlert('Desconto máximo para essas condições de pagamento é R$ ' + descontoMaximo)
      return false;
    }

    let total = totalItens - desconto;
    let totalVariacao = total + (total * (percentualVariacao / 100));
    if (total > 0) {
      this.pedido.percentualVariacao = (total * (percentualVariacao / 100));
      this.pedido.total = percentualVariacao > 0 ? totalVariacao : total;
    } else {
      this.pedido.descontoTotal = '0,00';
      this.toastAlert("Valor de desconto inválido");
      return false;
    }

    return true;
  }

  async calcPlanosCartao() {
    if (this.pedido.cartaoId) {
      let cardArray = this.cartoes.filter(c => c.id == this.pedido.cartaoId);
      this.planosCartao = cardArray.length > 0 ? cardArray[0].planos : [];
    }

    await this.calcDesconto();
  }

  async changePlano() {
    await this.calcDesconto();
  }

  calcCondicaoPgto() {
    this.isFormaCobrancaDinheiro = false;
    this.isFormaCobrancaCartao = false;
    this.pedido.condicaoPagamentoId = null;
    this.pedido.cartaoId = null;
    this.pedido.planoOperadoraId = null;

    if (!this.pedido.formaCobrancaId) {
      return;
    }

    let loader = this.loadingCtrl.create({
      content: 'Buscando condições pgto...',
      dismissOnPageChange: true
    });

    loader.present();
    this.calcFormaCobranca();
    loader.dismiss();
  }

  async calcFormaCobranca() {
    let formaDescricaoArray = this.formasCobranca.filter(
      f => f.id == this.pedido.formaCobrancaId);

    console.log(formaDescricaoArray)
    if (!formaDescricaoArray || formaDescricaoArray.length == 0) {
      return;
    }

    if (formaDescricaoArray[0].descricaoReduzido === 'DIN') {
      this.isFormaCobrancaDinheiro = true;

      let condicoes = this.condicoesPagamento.filter(c => c.descricao.toUpperCase().includes('VISTA'));
      if (condicoes && condicoes.length > 0) {
        this.pedido.condicaoPagamentoId = condicoes[0].id;
      }
    }

    if (formaDescricaoArray[0].descricaoReduzido === 'CRT') {
      this.isFormaCobrancaCartao = true;
    }

    await this.calcPlanosCartao();
    await this.calcDesconto();

  }

  ionViewCanEnter() {
    this.pedirConfirmacaoParaSairDoPedido = true;
  }

  clienteChange(event: { component: SelectSearchable, value: any }) {
    console.log('cliente selecionado:', event.value);
    this.clientFound = true;
  }

  clienteTemplate(cliente: Cliente) {
    return `${cliente.nome}`;
  }

  async ionViewCanLeave() {
    let podeSair = true;

    if (this.navParams.get('pedido')) {
      return true;
    }

    if (this.passo != "selecionarCliente" && this.pedirConfirmacaoParaSairDoPedido) {
      podeSair = await this.showConfirm().then((result) => {
        if (result) {
          return result;
        }
      })
    }

    return podeSair ? podeSair : false;
  }

  showConfirm(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.alertCtrl.create({
        title: 'Cancelar o pedido?',
        buttons: [
          {
            text: 'Sim',
            handler: _ => resolve(true)
          },
          {
            text: 'Não',
            handler: _ => resolve(false)
          }
        ]
      }).present();
    })
  }

}

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';

import { Observable } from 'rxjs/Observable';

import { Pedido } from '../../models/pedido';
import { CondicaoPagamento } from '../../models/condicao-pagamento';
import { FormaCobranca } from '../../models/forma-cobranca';

import { HomePage } from '../home/home';
import { NovoClientePage } from '../novo-cliente/novo-cliente';
import { CatalogoProdutoPage } from '../catalogo-produto/catalogo-produto';

import { PedidosProvider } from '../../providers/pedidos/pedidos';
import { CondicaoPagamentoProvider } from '../../providers/condicao-pagamento/condicao-pagamento';
import { ClientesProvider } from '../../providers/clientes/clientes';

@IonicPage()
@Component({
  selector: 'page-novo-pedido',
  templateUrl: 'novo-pedido.html',
})
export class NovoPedidoPage {

  produtos = [];
  
  pedido: Pedido | any = { total: 0, itens: [] };

  passo = "selecionarCliente";
  pedirConfirmacaoParaSairDoPedido = true;

  mensagemClienteNaoEncontrado = "Cliente não encontrado";

  clientSearch: boolean = false;
  clientFound: boolean = false;

  vlrTotal: number = 0;
  qtdTotal: number = 0;

  public pedidoForm: any;
  public condicoesPagamento: CondicaoPagamento[];
  public formasCobranca: FormaCobranca[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private ev: Events,
    private condicaoPagamentoService: CondicaoPagamentoProvider,
    public pedidoService: PedidosProvider,
    private clientesProvider: ClientesProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) {

    let pedidoEdit = this.navParams.get('pedido');
    console.log(pedidoEdit);

    if (pedidoEdit) {
      this.passo = "produtos";
      this.pedido = pedidoEdit;
      console.log(this.pedido);
      this.calcQtde();
    }

    this.produtos = this.navParams.get('produtos') || [];
    this.condicoesPagamento = this.navParams.get('condicoes') || [];
    this.formasCobranca = this.navParams.get('formasCobranca') || [];

    console.log(this.condicoesPagamento)
    console.log(this.formasCobranca)

    this.ev.subscribe('adicionarProdutoCarrinho', produto => {
      console.log('adicionou ao carrinho o produto ' + produto.descricao);
      let novoItem = { 'id': produto.id, 'nome': produto.descricao, 'quantidade': 1, 'preco': produto.preco };

      let result = this.pedido.itens.filter(element => {
        return element.id === produto.id
      })

      if (result.length > 0) {
        result[0].quantidade++;
        this.pedido.total = this.pedido.total + result[0].preco;
        this.calcQtde();
      } else {
        this.pedido.itens.push(novoItem);
        this.pedido.total = this.pedido.total + (novoItem.preco * novoItem.quantidade);
        console.log("total " + this.pedido.total);
        this.calcQtde();
      }
    });

    this.pedidoForm = formBuilder.group({
      cliente: [''],
      dataEmissao: [''],
      dataPrevisaoEntrega: [''],
      formaCobranca: [''],
      condicaoPagamento: [''],
      desconto: [''],
      logradouro: [''],
      complemento: [''],
      numero: [''],
      cep: [''],
      bairro: [''],
      cidade: [''],
      uf: ['']
    });
  }

  adicionarCliente() {
    this.navCtrl.push(NovoClientePage, { titulo: 'Adicionar' });
  }

  adicionarItemPedido() {
    this.pedirConfirmacaoParaSairDoPedido = false;

    this.navCtrl.push(CatalogoProdutoPage, { fromPedido: true, produtos: this.produtos });
  }

  cancelar() {
    this.navCtrl.push(HomePage);
  }

  validarPedido(ped) {

    if (!this.pedido.formaCobrancaId) {
      this.toastAlert("Informe uma forma de cobrança");
      return;
    }

    if (!this.pedido.condicaoPagamentoId) {
      this.toastAlert("Informe uma condição de pagamento");
      return;
    }

    if (ped.total <= 0) {
      this.toastAlert("Pedido não pode ter valor total igual a zero.");
      return false;
    }

    if (!ped.previsaoEntrega) {
      console.log(ped.previsaoEntrega)
      this.toastAlert("Data previsão entrega não informada");
      return false;
    }

    return true;
  }

  salvar() {

    if (!this.validarPedido(this.pedido)) {
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
      this.pedido.descontoTotal = 0;
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
    this.pedido.total = this.pedido.total + (item.preco);
    this.calcQtde();
  }

  tapRemoveQuantidade(e, item) {
    if (item.quantidade > 0) {
      item.quantidade--;
      this.pedido.total = this.pedido.total - (item.preco);
      this.calcQtde();
    }
  }

  excluirItem(item) {
    this.pedido.total = this.pedido.total - (item.preco * item.quantidade);

    let index = this.pedido.itens.indexOf(item);
    if (index !== -1) this.pedido.itens.splice(index, 1);

    this.calcQtde();
  }

  editItem(item) {
    console.log(item);
  }

  resumoPedido() {
    if (this.qtdTotal <= 0) {
      this.toastAlert("Informe pelo menos um produto!");
      return;
    }

    this.pedido.cliente.endereco.complemento =
      this.pedido.cliente.endereco.complemento ? this.pedido.cliente.endereco.complemento : '';

    console.log(this.pedido);

    this.passo = "dadosPagamento";
  }

  voltarAdicionarItens() {
    this.passo = "produtos";
  }

  calcQtde() {
    this.qtdTotal = 0;
    this.pedido.itens.forEach(item => {
      this.qtdTotal = this.qtdTotal + item.quantidade;
    });
  }

  ionViewCanEnter() {
    this.pedirConfirmacaoParaSairDoPedido = true;
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

import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { NovoClientePage } from '../novo-cliente/novo-cliente';

import { Pedido } from '../../models/pedido';
import { CatalogoProdutoPage } from '../catalogo-produto/catalogo-produto';
import { HomePage } from '../home/home';
import { CondicaoPagamentoProvider } from '../../providers/condicao-pagamento/condicao-pagamento';
import { Observable } from 'rxjs/Observable';
import { CondicaoPagamento } from '../../models/condicao-pagamento';
import { PedidosProvider } from '../../providers/pedidos/pedidos';
import { ClientesProvider } from '../../providers/clientes/clientes';

@IonicPage()
@Component({
  selector: 'page-novo-pedido',
  templateUrl: 'novo-pedido.html',
})
export class NovoPedidoPage {

  // pedido:any = { enderecoEntrega: {}, total: 0 , itens: []} as Pedido;
  pedido: Pedido | any = { total: 0, itens: [] };

  // items:any = [];

  passo = "1";

  mensagemClienteNaoEncontrado = "Cliente não encontrado";
  mensagemDadosCobrancaNaoPreenchidos = "";

  clientSearch: boolean = false;
  clientFound: boolean = false;

  vlrTotal: number = 0;
  qtdTotal: number = 0;


  public pedidoForm: any;
  public condicoes: Observable<CondicaoPagamento[]>;

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

    if (pedidoEdit){      
      this.passo = "5";
      this.pedido = pedidoEdit;
      this.calcQtde();
    }

    this.condicoes = condicaoPagamentoService.condicao;

    this.ev.subscribe('adicionarProdutoCarrinho', produto => {
      console.log('adicionou ao carrinho o produto ' + produto.titulo);
      let novoItem = { 'nome': produto.titulo, 'quantidade': 1, 'preco': produto.preco };
      this.pedido.itens.push(novoItem);
      this.pedido.total = this.pedido.total + (novoItem.preco * novoItem.quantidade);
      console.log("total " + this.pedido.total);
      this.calcQtde();
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
    this.navCtrl.push(CatalogoProdutoPage, { fromPedido: true });
  }

  cancelar() {
    this.navCtrl.push(HomePage);
  }

  validarPedido(ped) {

    if (ped.total <= 0) {
      this.alert("Erro", "Pedido não pode ter valor total igual a zero.");
      return false;
    }

    
    if (!ped.previsaoEntrega) {
      console.log(ped.previsaoEntrega)
      this.alert("Erro", "Data previsão entrega não informada");
      return false;
    }

    return true;
  }

  salvar() {

    if (!this.validarPedido(this.pedido)) {
      return;
    }

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


  toastAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
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

  selecionaClienteEContinua() {

    if (!this.clientFound) {
      this.onBlurCpfCnpj(this.pedido.cliente);
    }

    if (!this.clientFound) {
      return;
    } else {
      this.pedido.emissao = new Date().toISOString();
      this.pedido.descontoTotal = 0;
      this.passo = "2";
    }
  }

  selecionaDadoCobrancaEContinua() {
    if ( !this.pedido.previsaoEntrega ) {      
      this.mensagemDadosCobrancaNaoPreenchidos = "Todos os campos são de preenchimento obrigatório";
      this.toastAlert(this.mensagemDadosCobrancaNaoPreenchidos);
      return;
    }
    this.passo = "4";
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
    this.pedido.itens.pop(item);
    this.calcQtde();    
  }

  editItem(item) {
    console.log(item);
  }

  resumoPedido() {
    if (this.qtdTotal <= 0){
      this.toastAlert("Informe pelo menos um produto!");
      return;
    }

    this.passo = "5";
  }

  voltarAdicionarItens() {
    this.passo = "4";
  }


  calcQtde(){
    this.qtdTotal = 0;
    this.pedido.itens.forEach(item => {
      this.qtdTotal = this.qtdTotal + item.quantidade;
    });
  }

  exibirEndereco(){
    this.passo = "10";
    console.log(this.pedido);
  }


}

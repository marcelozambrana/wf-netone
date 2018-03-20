import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { NovoClientePage } from '../novo-cliente/novo-cliente';

import { Pedido } from '../../models/pedido';
import { CatalogoProdutoPage } from '../catalogo-produto/catalogo-produto';
import { HomePage } from '../home/home';
import { ItemsPedidoPage } from '../items-pedido/items-pedido';
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
  pedido: Pedido | any = { total: 0, itens: []};

  // items:any = [];

  typeSegment = 'pedido';

  clientFound :boolean = false;
  clientNotFound :boolean = false;


  public pedidoForm: any;
  public condicoes: Observable<CondicaoPagamento[]>;

  constructor(public navCtrl: NavController,
              public navParams: NavParams, 
              public formBuilder: FormBuilder, 
              private ev: Events,
              private condicaoPagamentoService: CondicaoPagamentoProvider,
              public pedidoService: PedidosProvider,
              private clientesProvider: ClientesProvider,
              private alertCtrl: AlertController) {

    this.condicoes = condicaoPagamentoService.condicao;

    this.ev.subscribe('adicionarProdutoCarrinho', produto => {
      console.log('adicionou ao carrinho o produto ' + produto.titulo);
      let novoItem = { 'nome': produto.titulo, 'quantidade': 1, 'preco': produto.preco };
      this.pedido.itens.push( novoItem );
      this.pedido.total = this.pedido.total + (novoItem.preco * novoItem.quantidade);
      console.log("total " + this.pedido.total);
    });

    this.pedidoForm = formBuilder.group({
      cliente: [''],
      dataPedido: [''],
      dataEntrega: [''],
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

  salvar() {
    if (!this.pedido.numero){
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

  itemsPedido() {
    this.navCtrl.push(ItemsPedidoPage, { "pedido": this.pedido, "items": this.pedido.itens});
  }

  onBlurCpfCnpj(value) {
    this.buscarCliente(value)
      .subscribe(queriedItems => {
        this.clientFound = false;
         if (queriedItems.length > 0) {
           this.pedido.cliente = queriedItems[0];
           this.clientFound = true;       
         } 
      });
  }

  buscarCliente(cpfCnpj) {
    return this.clientesProvider.buscarCpfCnpj(cpfCnpj);
  }  

  editItem(item){
    console.log(item);

  }

}

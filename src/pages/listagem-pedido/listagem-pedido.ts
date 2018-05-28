import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { File } from '@ionic-native/file';

import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { Pedido } from './../../models/pedido';
import { CondicaoPagamento } from '../../models/condicao-pagamento';
import { FormaCobranca } from '../../models/forma-cobranca';
import { CartaoCredito } from '../../models/cartoes-credito';

import { NovoPedidoPage } from './../novo-pedido/novo-pedido';
import { PedidosProvider } from './../../providers/pedidos/pedidos';
import { ApiProvider } from './../../providers/api/api';


@IonicPage()
@Component({
  selector: 'page-listagem-pedido',
  templateUrl: 'listagem-pedido.html',
})
export class ListagemPedidoPage {

  status: String = 'done';

  public items: Observable<Pedido[]>;

  produtosSelect = [];
  public condicoesPagamentoSelect: CondicaoPagamento[];
  public formasCobrancaSelect: FormaCobranca[];
  public cartoes: CartaoCredito[];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public file: File,
    public apiProvider: ApiProvider,
    public pedidosProvider: PedidosProvider) {

    this.produtosSelect = this.navParams.get('produtos') || [];
    this.condicoesPagamentoSelect = this.navParams.get('condicoes') || [];
    this.formasCobrancaSelect = this.navParams.get('formasCobranca') || [];
    this.cartoes = this.navParams.get('cartoes') || [];

    this.filter(status);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListagemPedidoPage');
  }

  filter(status: string) {
    this.items = this.pedidosProvider.buscarPedidosPorStatus(status === 'sent');
  }

  visualizar(pedido: Pedido) {

    if (pedido.enviado) {
      this.gerarPdfPedido(pedido);
      return;
    }

    let pedidoEdit: any = JSON.parse(JSON.stringify(pedido));

    this.navCtrl.push(NovoPedidoPage, {
      pedido: pedidoEdit,
      produtos: this.produtosSelect,
      condicoes: this.condicoesPagamentoSelect,
      formasCobranca: this.formasCobrancaSelect,
      cartoes: this.cartoes
    });
  }

  gerarPdfPedido(pedido: Pedido) {

    console.log(pedido)
    let formaCobranca = this.formasCobrancaSelect.filter(f => f.id == pedido.formaCobrancaId.toString());

    let itens: any = pedido.itens;
    let itensPdf = itens.map(item => [item.mascara, item.quantidade, item.valor]);

    pdfmake.vfs = pdfFonts.pdfMake.vfs;
    var docDefinition = {
      content: [
        { text: 'PEDIDO', style: 'header' },
        {
          text: new Date(pedido.emissao).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" }),
          alignment: 'right'
        },
        { text: 'Empresa', style: 'subheader' },
        'Empresa LTDA',
        '97.869.812/0001-00',
        'Avenida Brasil, 123 - Maringá/PR',
        '(44) 3030-3333',

        { text: 'Cliente', style: 'subheader' },
        pedido.cliente.nome,
        pedido.cliente.cpfCnpj,
        pedido.cliente.telefone,

        { text: 'Items', style: 'subheader' },
        {
          style: 'itemsTable',
          table: {
            widths: ['*', 75, 75],
            body: [
              [
                { text: 'Máscara', style: 'itemsTableHeader' },
                { text: 'Quantidade', style: 'itemsTableHeader' },
                { text: 'Valor Unit.', style: 'itemsTableHeader' },
              ]
            ].concat(itensPdf)
          }
        },
        {
          style: 'totalsTable',
          table: {
            widths: ['*', 115, 115],
            body: [
              [
                '',
                'Forma cobrança',
                formaCobranca[0].descricao,
              ],
              [
                '',
                'Desconto',
                pedido.descontoTotal,
              ],
              [
                '',
                'Total',
                pedido.total,
              ]
            ]
          },
          layout: 'noBorders'
        },
      ],
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'right'
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 20, 0, 5]
        },
        itemsTable: {
          margin: [0, 5, 0, 15]
        },
        itemsTableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        totalsTable: {
          bold: true,
          margin: [0, 30, 0, 0]
        }
      },
      defaultStyle: {
      }
    };
    pdfmake.createPdf(docDefinition).open();
  }

  async enviar(pedido) {
    console.log(pedido);

    pedido.descontoTotal = pedido.descontoTotal.replace(',', '.');
    /*pedido.cliente.celular = pedido.cliente.celular.replace('()-', '');
    pedido.cliente.telefone = pedido.cliente.telefone.replace('()-', '');

    await this.apiProvider.enviarPedido('', '', pedido);*/

    pedido.enviado = true;
    this.pedidosProvider.atualizar(pedido).then((result: any) => {
      console.log("Pedido enviado com sucesso!");
    }).catch((error) => {
      pedido.enviado = false;
      pedido.descontoTotal = pedido.descontoTotal.replace('.', ',');
      console.log("Falha ao enviar pedido!");
    });
  }

}

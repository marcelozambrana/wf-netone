import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

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

  constructor(public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private file: File,
    private fileOpener: FileOpener,
    private apiProvider: ApiProvider,
    private pedidosProvider: PedidosProvider) {

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

    let fileName = "teste1.pdf";

    if (this.platform.is('cordova')) {
      // FOR MOBILE DEVICES
      pdfmake.createPdf(docDefinition).getBuffer((buffer) => {
        var utf8 = new Uint8Array(buffer); // Convert to UTF-8...
        let binaryArray = utf8.buffer; // Convert to Binary...

        let dirPath = "";
        if (this.platform.is('android')) {
          dirPath = this.file.externalRootDirectory;
        } else if (this.platform.is('ios')) {
          dirPath = this.file.documentsDirectory;
        }

        let dirName = 'DailySheet';

        this.file.createDir(dirPath, dirName, true).then((dirEntry) => {
          let saveDir = dirPath + '/' + dirName + '/';
          this.file.createFile(saveDir, fileName, true).then((fileEntry) => {
            fileEntry.createWriter((fileWriter) => {
              fileWriter.onwriteend = () => {
                this.showAlert('Report downloaded', saveDir + fileName);
                this.fileOpener.open(saveDir + fileName, 'application/pdf')
                  .then(() => console.log('File is opened'))
                  .catch(e => console.log('Error openening file', e));
              };
              fileWriter.onerror = (e) => {
                this.showAlert('Cannot write report', e.toString());
              };
              fileWriter.write(binaryArray);
            });
          }).catch((error) => { this.showAlert('Cannot create file', error); });
        }).catch((error) => { this.showAlert('Cannot create folder', error); });
      }).catch((error) => { this.showAlert('Error while creating pdf', error); });
    }
    else {
      //FOR BROWSERS
      pdfmake.createPdf(docDefinition).download(fileName);
    }

  }

  async enviar(pedido) {
    console.log(pedido);

    pedido.descontoTotal = pedido.descontoTotal.replace(',', '.');
    pedido.cliente.celular = pedido.cliente.celular.replace('()-', '');
    pedido.cliente.telefone = pedido.cliente.telefone.replace('()-', '');
    pedido.cliente.endereco.cep = pedido.cliente.endereco.cep.replace('()-', '');
    await this.apiProvider.enviarPedido('', '', pedido);

    pedido.enviado = true;
    this.pedidosProvider.atualizar(pedido).then((result: any) => {
      console.log("Pedido enviado com sucesso!");
    }).catch((error) => {
      pedido.enviado = false;
      pedido.descontoTotal = pedido.descontoTotal.replace('.', ',');
      console.log("Falha ao enviar pedido!");
    });
  }

  showAlert(title, message) {
    let al = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Fechar']
    });
    al.present();
  }
  

}

import { Platform } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';

import * as pdfmake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

import { NovoPedidoPage } from './../novo-pedido/novo-pedido';

import { CIDADES } from '../../providers/cidades/cidades';
import { Pedido } from './../../models/pedido';
import { CondicaoPagamento } from '../../models/condicao-pagamento';
import { FormaCobranca } from '../../models/forma-cobranca';
import { CartaoCredito } from '../../models/cartoes-credito';

import { ApiProvider } from './../../providers/api/api';
import { PedidosProvider } from './../../providers/pedidos/pedidos';
import { UsuariosProvider } from '../../providers/usuarios/usuarios';


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

  private usuarioLogado: any = null;
  private netoneAuthToken: string = '';
  private netoneNextToken: string = '';

  constructor(public platform: Platform,
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private file: File,
    private fileOpener: FileOpener,
    private apiProvider: ApiProvider,
    private usuariosProvider: UsuariosProvider,
    private pedidosProvider: PedidosProvider) {

    this.produtosSelect = this.navParams.get('produtos') || [];
    this.condicoesPagamentoSelect = this.navParams.get('condicoes') || [];
    this.formasCobrancaSelect = this.navParams.get('formasCobranca') || [];
    this.cartoes = this.navParams.get('cartoes') || [];

    this.usuarioLogado = this.navParams.get('usuarioLogado');
    this.netoneAuthToken = this.navParams.get('netoneAuthToken');
    this.netoneNextToken = this.navParams.get('netoneNextToken');

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

    console.log(pedido);

    let loader = this.loadingCtrl.create({
      content: 'Aguarde...'
    });

    loader.present();

    if (!pedido.cliente.endereco.cidade) {
      let cidade = CIDADES.filter(c =>  pedido.cliente.endereco.ibgeCidade && c.codigoIbge == pedido.cliente.endereco.ibgeCidade);
      pedido.cliente.endereco.cidade =  { nome: cidade[0].nome };
    }
    let formaCobranca = this.formasCobrancaSelect.filter(f => f.id == pedido.formaCobrancaId.toString());

    let itens: any = pedido.itens;
    let itensPdf = itens.map(item =>
      [item.idReduzido,
      item.nome,
      (item.comprimento ? item.comprimento : '0') + 'x' +
      (item.largura ? item.largura : '0') + 'x' +
      (item.altura ? item.altura : '0') + 'cm',
      item.tamanho,
      item.quantidade,
      item.valor]);

    pdfmake.vfs = pdfFonts.pdfMake.vfs;
    var docDefinition = {
      content: [
        { text: 'Pedido de Venda', style: 'header' },
        { text: 'Nr. ' + pedido.numeroEnvio, style: 'header' },
        {
          text: new Date(pedido.emissao).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" }),
          alignment: 'right'
        },
        { text: 'Empresa', style: 'subheader' },
        {
          alignment: 'left',
          columns: [
            { text: 'Razão Social: ', width: 90 },
            { text: 'Empresa TESTE LTDA', width: 200 },
            { text: 'Fantasia: ', width: 90 },
            { text: 'CARRARO - Colchões', width: 200 }
          ]
        },
        {
          alignment: 'left',
          columns: [
            { text: 'Endereço: ', width: 90 },
            { text: 'Rua João Bettega 1586, Portão - Curitiba/PR - 81070-001', width: '*' }
          ]
        },
        {
          alignment: 'left',
          columns: [
            { text: 'Telefone: ', width: 90 },
            { text: '(41) 3333-3333', width: 200 },
            { text: 'Celular: ', width: 90 },
            { text: '(41) 99999-9999', width: 120 }
          ]
        },
        {
          alignment: 'left',
          columns: [
            { text: 'Email:', width: 90 },
            { text: 'carraro.ccj@gmail.com', width: 200 }
          ]
        },
        { text: 'Cliente', style: 'subheader' },
        {
          alignment: 'left',
          columns: [
            { text: 'Cliente: ', width: 90 },
            { text: pedido.cliente.nome, width: '*' }
          ]
        },
        {
          alignment: 'left',
          columns: [
            { text: 'CPF/CNPJ: ', width: 90 },
            { text: pedido.cliente.cpfCnpj, width: '*' }
          ]
        },
        {
          alignment: 'left',
          columns: [
            { text: 'Endereço: ', width: 90 },
            {
              text: pedido.cliente.endereco.endereco +
                ', ' + pedido.cliente.endereco.numero +
                ', ' + pedido.cliente.endereco.bairro +
                ' - ' + pedido.cliente.endereco.cidade.nome + '/' + pedido.cliente.endereco.uf +
                ' - ' + pedido.cliente.endereco.cep, width: '*'
            }
          ]
        },
        {
          alignment: 'left',
          columns: [
            { text: 'Telefone: ', width: 90 },
            { text: pedido.cliente.telefone, width: 200 },
            { text: 'Celular: ', width: 90 },
            { text: pedido.cliente.celular, width: 120 }
          ]
        },
        { text: 'Items', style: 'subheader' },
        {
          style: 'itemsTable',
          table: {
            widths: [65, 220, 85, 30, 35, 55],
            body: [
              [
                { text: 'Código', style: 'itemsTableHeader' },
                { text: 'Descrição dos Produtos / Serviços', style: 'itemsTableHeader' },
                { text: 'Medidas', style: 'itemsTableHeader' },
                { text: 'Tam.', style: 'itemsTableHeader' },
                { text: 'Qtde.', style: 'itemsTableHeader' },
                { text: 'R$ Unit.', style: 'itemsTableHeader' },
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

    let fileName = "pedido-" + pedido.numeroEnvio + ".pdf";

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

        let dirName = 'WfmNetone';

        this.file.createDir(dirPath, dirName, true).then((dirEntry) => {
          let saveDir = dirPath + '/' + dirName + '/';
          this.file.createFile(saveDir, fileName, true).then((fileEntry) => {
            fileEntry.createWriter((fileWriter) => {
              fileWriter.onwriteend = () => {
                this.fileOpener.open(saveDir + fileName, 'application/pdf')
                  .then(() => console.log('File is opened'))
                  .catch(e => console.log('Error openening file', e));
              };
              fileWriter.onerror = (e) => {
                this.showAlert('Cannot write report', e.toString());
              };
              fileWriter.write(binaryArray);
            });
          })
        })
      })
    }
    else {
      //FOR BROWSERS
      pdfmake.createPdf(docDefinition).download(fileName);
    }

    loader.dismiss();

  }

  async enviar(pedido) {

    let loader = this.loadingCtrl.create({
      content: 'Enviando pedido...'
    });

    loader.present();

    if (this.usuarioLogado == null) {
      loader.dismiss();
      this.showAlert("Error", "Falha ao enviar pedido - Sequência inválida.");
      return;
    }

    let desconto = parseFloat(pedido.descontoTotal.replace(',', '.'));
    let descontoPorItem: string = "0.00";
    let qtdeTotalItens = pedido.itens.length;
    if (desconto > 0) {
      descontoPorItem = (desconto / qtdeTotalItens).toFixed(2);
    }
    console.log(parseFloat(descontoPorItem));

    let emissao = new Date(pedido.emissao);
    emissao.setHours(0);
    emissao.setMinutes(0);
    emissao.setSeconds(0);
    emissao.setMilliseconds(0);

    let previsaoEntrega = new Date(pedido.previsaoEntrega+'T03:00:00.000Z');

    let pedidoEnviar = {
      numero: this.usuarioLogado.sequencePedido + 1,
      emissao: emissao.toISOString(),
      previsaoEntrega: previsaoEntrega.toISOString(),
      cliente: {
        nome: pedido.cliente.nome,
        email: pedido.cliente.email,
        cpfCnpj: pedido.cliente.cpfCnpj,
        rgInscricaoEstadual: pedido.cliente.rgInscricaoEstadual,
        fantasia: pedido.cliente.fantasia,
        telefone: pedido.cliente.telefone.replace(/\(|\)|-|\s/g, ''),
        celular: pedido.cliente.celular.replace(/\(|\)|-|\s/g, ''),
        endereco: {
          ibgeCidade: parseInt(pedido.cliente.endereco.ibgeCidade),
          cep: pedido.cliente.endereco.cep.replace(/\(|\)|-|\s/g, ''),
          endereco: pedido.cliente.endereco.endereco,
          bairro: pedido.cliente.endereco.bairro,
          numero: pedido.cliente.endereco.numero
        }
      },
      itens: pedido.itens.map((i) => {
        return {
          idReduzido: i.idReduzido,
          quantidade: i.quantidade,
          valor: i.valor,
          desconto: parseFloat(descontoPorItem)
        }
      }),
      formaCobrancaId: pedido.formaCobrancaId != null ? parseInt(pedido.formaCobrancaId) : null,
      condicaoPagamentoId: pedido.condicaoPagamentoId != null ? parseInt(pedido.condicaoPagamentoId) : null,
      planoOperadoraId: pedido.planoOperadoraId != null ? parseInt(pedido.planoOperadoraId) : null
    }

    //let dadosEmpresa = await this.apiProvider.getDadosEmpresa(this.netoneAuthToken, this.netoneNextToken);

    console.log(JSON.stringify(pedidoEnviar));

    let retornoEnvio: any = await this.apiProvider.enviarPedido(this.netoneAuthToken,
      this.netoneNextToken, [pedidoEnviar]);

    if (retornoEnvio.code != 200) {
      this.usuarioLogado.sequencePedido = this.usuarioLogado.sequencePedido + 1;
      pedido.enviado = false;
      pedido.descontoTotal = pedido.descontoTotal.replace('.', ',');
      console.log("Falha ao enviar pedido!");
      loader.dismiss();
      this.showAlert("Error", retornoEnvio.message);
      return;
    }

    console.log(retornoEnvio);
    pedido.enviado = true;
    pedido.descontoTotal = pedido.descontoTotal.replace(',', '.');
    pedido.numeroOrigem = parseInt(retornoEnvio.pedidos[0].numeroOrigem);
    pedido.numeroEnvio = parseInt(retornoEnvio.pedidos[0].numero);
    let self = this;
    this.pedidosProvider.atualizar(pedido).then((result: any) => {
      console.log("Pedido enviado com sucesso!");
      self.showAlert("Sucesso", "Pedido enviado com sucesso!");

      this.usuarioLogado.sequencePedido = parseInt(pedido.numeroOrigem);
      this.usuariosProvider.atualizar(this.usuarioLogado);
    }).catch((error) => {
      pedido.enviado = false;
      pedido.descontoTotal = pedido.descontoTotal.replace('.', ',');
      console.log("Falha ao enviar pedido!");
      self.showAlert("Error", "Falha ao enviar pedido!");
    });

    loader.dismiss();
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

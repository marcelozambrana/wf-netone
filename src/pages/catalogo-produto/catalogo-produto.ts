import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DetalhesProdutoPage } from '../detalhes-produto/detalhes-produto';

@IonicPage()
@Component({
  selector: 'page-catalogo-produto',
  templateUrl: 'catalogo-produto.html',
})
export class CatalogoProdutoPage {

  //Mock produtos
  produtos_img = [
    { urlImg: 'http://www.colchaocostarica.com.br/produtos/imagens/712-det-colchao-ortobom-freedom.jpg' },
    { urlImg: 'https://www.costaricacolchoes.com.br/produtos/adicionais/2492-58436-Conjunto-Box-Bau-Colchao-Ortobom-Molas-Pocket-Freedom---Cam.jpg' },
    { urlImg: 'https://static.onofreagora.com.br/onofreeletro/produto/multifotos/hd/605514_3.jpg' },
    { urlImg: 'https://www.costaricacolchoes.com.br/produtos/imagens/20228-det-Conjunto-Box-Colchao-Ortobom-Molas-Pocket-Light---Cama-Box-Nobuck-Ner.jpg' },
    { urlImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh2cfY15HdQ9jdrA51Hv8eDYCO_CMZRbAAgiTiKhe3e-jWJnof' },
    { urlImg: 'https://a-static.mlcdn.com.br/1500x1500/cama-box-box-colchao-casal-mola-138x188cm-ortobom-exclusive-diamond/magazineluiza/088903800/0e4a71d8586f84fc88dcaa3c73009968.jpg' },
    { urlImg: 'https://a-static.mlcdn.com.br/1500x1500/cama-box-box-colchao-casal-mola-138x188cm-ortobom/magazineluiza/219805900/8eda9bc4f24075bc1144dfa2e4416728.jpg' },
    { urlImg: 'http://appsisecommerces3.s3.amazonaws.com/clientes/cliente12013/produtos/4291/L4297.jpg' },
    { urlImg: 'https://static.carrefour.com.br/medias/sys_master/images/images/h5c/h6e/h00/h00/9618770133022.jpg' },
    { urlImg: 'https://static.carrefour.com.br/medias/sys_master/images/images/h65/hfa/h00/h00/9618769477662.jpg' },
  ];

  items = [];

  page = 1;
  totalPage = 5;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.buscaMaisProdutos(this.page, 12);
  }

  buscaMaisProdutos(numeroPagina, quantidade) {
    
    if (numeroPagina > 5)
      return;

    for (var i = 0; i < quantidade; i++) {
      var newUrlImg = this.produtos_img[Math.floor(Math.random() * this.produtos_img.length)];

      this.items.push({
        urlImg: newUrlImg.urlImg,
        titulo: "Colchão Ortobom " + this.items.length,
        resumoDescricao: "Colchão Ortobom Freedom Casal 138x188x32 Branco, com dimensões de 138x188x32cm",
        descricaoCompleta: "Colchão Ortobom Freedom Casal 138x188x32 Branco, com dimensões de 138x188x32cm. Ortobom Freedom: Tem sua estrutura composta por Molas Superpocket ensacadas individualmente, que fazem o peso de um corpo não interferir no conforto do outro." +
          "Possui manta de espuma Viscoelástica (desenvolvida pela NASA). Seu tecido é em malha hipersoft com elastano, oferecendo uma maior suavidade. O Freedom recebe um tratamento inovador, o Evo Care Vital, um composto de Óleo de Jojoba, Vitamina E e Aloe Vera, que protege a pele contra o envelhecimento precoce. Este tratamento funciona mesmo com a utilização do lençol, pois as fibras do colchão absorvem estes agentes. Possui respiros laterais que evitam a proliferação de ácaros, como também de bactérias e fungos. Devido a tecnologia No Turn, o Freedom não precisa ser virado.",
        largura: 138,
        comprimento: 188,
        altura: 32,
        cor: "Branco"
      });
    }
  }

  doInfinite(infiniteScroll) {
    console.log('Begin async operation');

    setTimeout(() => {
      this.page=this.page+1;
      
      this.buscaMaisProdutos(this.page, 4);

      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }

  detalhes(produto) {
    this.navCtrl.push(DetalhesProdutoPage, {produtoParam: produto})
  }

}

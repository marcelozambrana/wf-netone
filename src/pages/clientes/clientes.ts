import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { NovoClientePage } from '../novo-cliente/novo-cliente';
import { Cliente } from '../../models/cliente';
import { ClientesProvider } from '../../providers/clientes/clientes';


@IonicPage()
@Component({
  selector: 'page-clientes',
  templateUrl: 'clientes.html',
})
export class ClientesPage {

  searchTerm: string = '';

  clientesFiltro: Observable<Cliente[]>;
  clientes: Observable<Cliente[]>;

  cidades = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private clientesProvider: ClientesProvider) {

      this.clientes = this.clientesProvider.todos();
      this.clientesFiltro = this.clientes;
      this.cidades = this.navParams.get('cidades');
  }

  alert(title, message) {
    let al = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Fechar']
    });
    al.present();
  }

  adicionarCliente() {
    this.navCtrl.push(NovoClientePage, { 
      titulo: 'Novo',
      cidades: this.cidades 
    });
  }

  editar(id: string) {
    if (id) {
      this.navCtrl.push(NovoClientePage, { 
        titulo: 'Editar', 
        idCliente: id,
        cidades: this.cidades 
      });
    }
  }

  excluir(id: string) {
    console.log('excluir ' + id);
    if (id) {
      this.clientesProvider.remover(id)
        .then((result: any) => {
          this.alert("Sucesso", "Cliente excluído com sucesso.");
        })
        .catch((error) => {
          console.error("Error delete document: ", error);
          this.alert("Error", "Falha ao excluir cliente.");
        });
    }
  }

  filtrarClientes(event) {
    console.log('filtrando clientes: ' + this.searchTerm);
    
    this.clientes = this.clientes
    .map(clients => {
      let fl = clients.filter((cli) => {
        return cli.nome.toLowerCase().indexOf(
          this.searchTerm.toLowerCase()) > -1;
      })

      return fl;
    });
  }

}

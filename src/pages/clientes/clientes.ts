import { Component } from '@angular/core';

import { IonicPage, NavController, AlertController } from 'ionic-angular';

import { NovoClientePage } from '../novo-cliente/novo-cliente';

import { Observable } from 'rxjs/Observable';

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

  constructor(public navCtrl: NavController, private alertCtrl: AlertController,
    private clientesProvider: ClientesProvider) {

      this.clientes = this.clientesProvider.todos();
      this.clientesFiltro = this.clientes;
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
    this.navCtrl.push(NovoClientePage, { titulo: 'Novo' });
  }

  editar(id: string) {
    if (id) {
      this.navCtrl.push(NovoClientePage, { titulo: 'Editar', idCliente: id });
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

  filtrarClientes() {
    console.log('filtrando clientes: ' + this.searchTerm);
  }

}

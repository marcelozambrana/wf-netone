import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

import { NovoClientePage } from '../novo-cliente/novo-cliente';
import { ClientesProvider } from '../../providers/clientes/clientes';
import { Cliente } from '../../models/cliente';

@IonicPage()
@Component({
  selector: 'page-clientes',
  templateUrl: 'clientes.html',
})
export class ClientesPage {

  clientes: Observable<Cliente[]>;
  searchTerm: string = '';

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private clientesProvider: ClientesProvider) {

    this.clientes = this.clientesProvider.todos();
  }

  adicionarCliente() {
    this.navCtrl.push(NovoClientePage, {
      titulo: 'Novo'
    });
  }

  editar(cli: Cliente) {
    console.log('editando cliente ' + cli.id);
    let clienteEditar = { ...cli };
    clienteEditar.endereco = { ...cli.endereco };

    if (clienteEditar.id) {
      this.navCtrl.push(NovoClientePage, {
        titulo: 'Editar',
        clienteEdit: clienteEditar
      });
    }
  }

  excluir(cli: Cliente) {
    console.log('excluir ' + cli.id);
    if (cli.id) {
      this.clientesProvider.remover(cli.id)
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

    if (this.searchTerm.length === 0 || this.searchTerm.length > 2) {
      this.clientes = this.clientes.map(clientes => {
        return clientes.filter(cli => {
          return ((cli.nome.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1) ||
            (cli.cpfCnpj.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1));
        })
      })
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

  ionViewDidLoad() {
    this.filtrarClientes();
  }

}

import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { NovoClientePage } from '../novo-cliente/novo-cliente';

import { AuthProvider } from '../../providers/auth/auth';
import { ClientesProvider } from '../../providers/clientes/clientes';

import { Cliente } from '../../models/cliente';

@IonicPage()
@Component({
  selector: 'page-clientes',
  templateUrl: 'clientes.html',
})
export class ClientesPage {

  clientes = [];

  constructor(public navCtrl: NavController, private auth: AuthProvider, private clientesProvider: ClientesProvider) {
  }


  adicionarCliente() {
    this.navCtrl.push(NovoClientePage, { titulo: 'Adicionar' });
  }

  editar(idCliente) {
    this.navCtrl.push(NovoClientePage, { titulo: 'Editar' });
  }

  excluir(id: string) {
  }

  ionViewDidLoad() {
  }

}

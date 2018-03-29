import { Component } from '@angular/core';

import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';

import { NovoClientePage } from '../novo-cliente/novo-cliente';

import { AngularFireModule } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { ClientesProvider } from '../../providers/clientes/clientes';

import { Cliente } from '../../models/cliente';

@IonicPage()
@Component({
  selector: 'page-clientes',
  templateUrl: 'clientes.html',
})
export class ClientesPage {

  searchTerm: string = '';
  clientes: Observable<any[]>;

  constructor(public navCtrl: NavController, private clientesProvider: ClientesProvider, private alertCtrl: AlertController) {
    
    this.clientes = this.clientesProvider.todos();
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
    console.log('filtrar clientes');
  }

  ionViewDidLoad() {
    this.clientes = this.clientesProvider.todos();
    this.filtrarClientes();
   }

}

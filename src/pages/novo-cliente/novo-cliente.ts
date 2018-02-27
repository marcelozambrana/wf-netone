import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { AuthProvider } from '../../providers/auth/auth';
import { ClientesProvider } from '../../providers/clientes/clientes';

import { Cliente } from '../../models/cliente';

@IonicPage()
@Component({
  selector: 'page-novo-cliente',
  templateUrl: 'novo-cliente.html',
})
export class NovoClientePage {

  titulo:string = "";

  public clienteForm: any;

  constructor(public navCtrl: NavController,  public navParams: NavParams, private auth: AuthProvider, public formBuilder: FormBuilder,
    private clientesProvider: ClientesProvider) {

      this.titulo = this.navParams.get('titulo');

      this.clienteForm = formBuilder.group({
        nome: ['', Validators.required],
        email: ['', Validators.required],
        rg: ['', Validators.required],
        cpfCnpj: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20),
        Validators.required])],
        logradouro: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20),
        Validators.required])],
        numero: ['', Validators.required],
        cep: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(8),
          Validators.required])],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        uf: ['', Validators.required]
      })
  }

}

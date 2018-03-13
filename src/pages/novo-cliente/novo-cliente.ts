import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { ClientesProvider } from '../../providers/clientes/clientes';

import { Cliente } from '../../models/cliente';

@IonicPage()
@Component({
  selector: 'page-novo-cliente',
  templateUrl: 'novo-cliente.html',
})
export class NovoClientePage {

  mensagemClienteExistente = "Cliente cadastrado";
  msgIsClienteCpfExistente = false;
  isClienteCpfExistente = false;
 
  cliente:any = { endereco: {} } as Cliente;
  titulo: string = "";

  public clienteForm: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    private clientesProvider: ClientesProvider, private alertCtrl: AlertController) {

    this.titulo = this.navParams.get('titulo');

    let idCliente = this.navParams.get('idCliente');
    if (idCliente) {
      this.isClienteCpfExistente = true;

      this.clientesProvider.buscarId(idCliente).subscribe(cliente => {
        this.cliente = cliente;
        this.cliente.id = idCliente;
     });
    } 

    this.clienteForm = formBuilder.group({
      cpfCnpj: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20),
        Validators.required])],
      nome: ['', Validators.required],
      email: ['', Validators.required],
      fixo: [''],
      celular: [''],
      rg: [''],
      logradouro: ['', Validators.compose([Validators.minLength(6), Validators.maxLength(20),
      Validators.required])],
      numero: ['', Validators.required],
      cep: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(12),
      Validators.required])],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required]
    })
  }

  alert(title, message) {
    let al = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Fechar']
    });
    al.present();
  }

  atualizar(cliente:Cliente) {

    this.validaDadosPreSalvamento(cliente);

    this.clientesProvider.atualizar(cliente)
    .then((result: any) => {
      this.alert("Sucesso", "Cliente atualizado com sucesso.");
      this.navCtrl.pop();
    })
    .catch((error) => {
      console.error("Error update document: ", error);
      this.alert("Error", "Falha ao atualizar cliente.");
    });
  }

  adicionar(cliente:Cliente) {
    console.log('Entrou Adicionar cliente');

    this.validaDadosPreSalvamento(cliente);

    this.clientesProvider.adicionar(cliente)
      .then((result: any) => {
        console.log("Document addded with id >>> ", result.id);
        this.alert("Sucesso", "Cliente cadastrado com sucesso.");
        this.navCtrl.pop();
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        this.alert("Error", "Falha ao cadastrar cliente.");
      });
  }

  onBlurCpfCnpj(value) {
  
    this.buscarCliente(value)
      .subscribe(queriedItems => {
         if (queriedItems.length > 0) {
           this.cliente = queriedItems[0];
           this.msgIsClienteCpfExistente = true;
           this.isClienteCpfExistente = true;
         } else {
          this.isClienteCpfExistente = false;
         }
      });
  }

  buscarCliente(cpfCnpj) {
    return this.clientesProvider.buscarCpfCnpj(cpfCnpj);
  }

  buscarClienteId(id) {
    return this.clientesProvider.buscarId(id);
  }

  validaDadosPreSalvamento(cliente:Cliente) {

  }

  cancelar() {
    this.navCtrl.pop();
  }
}

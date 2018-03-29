import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { ClientesProvider } from '../../providers/clientes/clientes';

import { Cliente } from '../../models/cliente';

import { ValidarCpf } from '../../pages/novo-cliente/valida-cpf';

@IonicPage()
@Component({
  selector: 'page-novo-cliente',
  templateUrl: 'novo-cliente.html',
})
export class NovoClientePage {

  mensagemErro = "";
  isErro = false;

  msgIsClienteCpfExistente = false;
  isClienteCpfExistente = false;

  passo = "1";

  cliente: any = { endereco: {} } as Cliente;
  titulo: string = "";

  public clienteForm: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    private clientesProvider: ClientesProvider, private alertCtrl: AlertController) {

    this.titulo = this.navParams.get('titulo');

    let idCliente = this.navParams.get('idCliente');
    if (idCliente) {
      this.isClienteCpfExistente = true;
      this.passo = "2";

      this.clientesProvider.buscarId(idCliente).subscribe(cliente => {
        this.cliente = cliente;
        this.cliente.id = idCliente;
      });
    }

    this.clienteForm = formBuilder.group({
      cpfCnpj: ['', Validators.required],
      nome: ['', Validators.required],
      email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
      fixo: [''],
      celular: ['', Validators.required],
      rg: ['', Validators.required],
      logradouro: ['', Validators.compose([Validators.minLength(7), Validators.maxLength(70), Validators.required])],
      numero: ['', Validators.required],
      cep: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(12), Validators.required])],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.compose([Validators.minLength(1), Validators.maxLength(2), Validators.required])]
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

  atualizar(cliente: Cliente) {

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

  adicionar(cliente: Cliente) {

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

  validaCpfEContinua(cliente) {

    if (!this.cliente.cpfCnpj) {
      this.mensagemErro = "CPF/CNPJ é um campo obrigatório";
      this.isErro = true;
      return;
    }

    let cpfCnpj:string = this.cliente.cpfCnpj.replace(/\D/g, "");

    if (cpfCnpj.length != 11 && cpfCnpj.length != 14) {
      this.mensagemErro = "CPF/CNPJ com tamanho inválido";
      this.isErro = true;
      return;
    }

    if (cpfCnpj.length === 11) {

      let isValido = ValidarCpf.cpf(cpfCnpj);

      if (!isValido) {
        this.mensagemErro = "CPF inválido";
        this.isErro = true;
        return;
      }
    }

    if (cpfCnpj.length === 14) {

      let isValido = ValidarCpf.cnpj(cpfCnpj);

      if (!isValido) {
        this.mensagemErro = "CNPJ inválido";
        this.isErro = true;
        return;
      }
    }

    this.buscarCliente(cpfCnpj)
      .subscribe(queriedItems => {
        if (queriedItems.length > 0) {
          this.cliente = queriedItems[0];
          this.mensagemErro = "Cliente já cadastrado com esse CPF/CNPJ";
          this.isErro = true;
          this.isClienteCpfExistente = true;
          return;

        } else {
          this.isErro = false;
          this.isClienteCpfExistente = false;
        }
      });

    this.passo = "2";
  }

  validaDadosGeraisEContinua() {

    if (!this.clienteForm.controls.email.valid) {
      this.mensagemErro = "E-mail inválido";
      this.isErro = true;
      console.log('errr1');
      return;
    }

    this.passo = "3";
  }

  buscarCliente(cpfCnpj) {
    return this.clientesProvider.buscarCpfCnpj(cpfCnpj);
  }

  buscarClienteId(id) {
    return this.clientesProvider.buscarId(id);
  }

  validaDadosPreSalvamento(cliente: Cliente) {
    if (!this.clienteForm.valid) {

    }
  }

  cancelar() {
    this.navCtrl.pop();
  }
}

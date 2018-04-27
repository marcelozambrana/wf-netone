import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
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

  isClienteCpfExistente = false;

  passo = "1";

  cliente: any = { endereco: {} } as Cliente;
  titulo: string = "";
  isPessoaJuridica: boolean = false;

  public clienteForm: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private clientesProvider: ClientesProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) {

    this.titulo = this.navParams.get('titulo');

    this.isPessoaJuridica = false;

    let idCliente = this.navParams.get('idCliente');
    if (idCliente) {
      this.isClienteCpfExistente = true;
      this.passo = "2";

      this.clientesProvider.buscarId(idCliente).subscribe(cliente => {
        this.cliente = cliente;
        if (cliente) {
          this.cliente.id = idCliente;
          this.isPessoaJuridica = this.cliente.cpfCnpj.length === 14;
          console.log(this.isPessoaJuridica)
        }
      });
    }

    this.clienteForm = formBuilder.group({
      cpfCnpj: ['', Validators.required],
      nome: ['', Validators.required],
      fantasia: [''],
      rgInscricaoEstadual: [''],
      email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
      telefone: ['', Validators.required],
      celular: ['', Validators.required],
      endereco: ['', Validators.compose([Validators.minLength(5), Validators.maxLength(100), Validators.required])],
      numero: ['', Validators.required],
      bairro: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(40), Validators.required])],
      cep: ['', Validators.compose([Validators.minLength(8), Validators.maxLength(12), Validators.required])],
      cidade: ['', Validators.compose([Validators.minLength(2), Validators.maxLength(40), Validators.required])],
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

  toastAlert(message) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      duration: 3000,
      closeButtonText: 'Fechar',
      dismissOnPageChange: true,
      cssClass: 'toast-error'
    });
    toast.present();
  }

  atualizar(cliente: Cliente) {

    if (!this.validaDadosPreSalvamento(cliente)) {
      return;
    }

    this.normalizar(cliente);

    this.clientesProvider.atualizar(cliente)
      .then((result: any) => {
        this.alert("Sucesso", "Cliente atualizado com sucesso.");
        this.navCtrl.pop();
      })
      .catch((error) => {
        console.error("Error update document: ", error);
        this.toastAlert("Falha ao atualizar cliente." + ' Error: ' + error);
      });
  }

  adicionar(cliente: Cliente) {

    if (!this.validaDadosPreSalvamento(cliente)) {
      return;
    }

    this.normalizar(cliente);

    this.clientesProvider.adicionar(cliente)
      .then((result: any) => {
        console.log("Document addded with id >>> ", result.id);
        this.alert("Sucesso", "Cliente cadastrado com sucesso.");
        this.navCtrl.pop();
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        this.toastAlert("Falha ao salvar cliente." + ' Error: ' + error);
      });
  }

  normalizar(cliente: Cliente) {
    if (!cliente.fantasia) {
      cliente.fantasia = '';
    }
    if (!cliente.rgInscricaoEstadual) {
      cliente.rgInscricaoEstadual = '';
    }
  }

  validaCpfEContinua(cliente) {

    if (!this.cliente.cpfCnpj) {
      this.toastAlert("CPF/CNPJ é um campo obrigatório");
      return;
    }

    let cpfCnpj: string = this.cliente.cpfCnpj.replace(/\D/g, "");

    if (cpfCnpj.length != 11 && cpfCnpj.length != 14) {
      this.toastAlert("CPF/CNPJ com tamanho inválido");
      return;
    }

    if (cpfCnpj.length === 11) {

      let isValido = ValidarCpf.cpf(cpfCnpj);

      if (!isValido) {
        this.toastAlert("CPF inválido");
        return;
      }
    }

    if (cpfCnpj.length === 14) {

      let isValido = ValidarCpf.cnpj(cpfCnpj);

      if (!isValido) {
        this.toastAlert("CNPJ inválido");
        return;
      }
    }

    this.buscarCliente(cpfCnpj)
      .subscribe(queriedItems => {
        if (queriedItems.length > 0) {
          this.cliente = queriedItems[0];
          this.isClienteCpfExistente = true;
          return;

        } else {
          this.isClienteCpfExistente = false;
        }
      });

    let cpfCnpjTemp = this.cliente.cpfCnpj.replace(/\D/g, "");
    this.isPessoaJuridica = cpfCnpjTemp.length === 14;
    this.passo = "2";
  }

  validaDadosGeraisEContinua() {

    if (!this.clienteForm.controls.nome.valid) {
      this.toastAlert("Nome é um campo obrigatório");
      return false;
    }

    if (!this.clienteForm.controls.email.valid) {
      this.toastAlert("E-mail inválido");
      return false;
    }

    if (!this.clienteForm.controls.telefone.valid) {
      this.toastAlert("Telefone é um campo obrigatório");
      return false;
    }

    if (!this.clienteForm.controls.celular.valid) {
      this.toastAlert("Celular é um campo obrigatório");
      return false;
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
    if (!this.clienteForm.controls.endereco.valid) {
      this.toastAlert("Logradouro deve ter no mínimo 5 caracteres");
      return false;
    }

    if (!this.clienteForm.controls.numero.valid) {
      this.toastAlert("Número é um campo obrigatório");
      return false;
    }

    if (!this.clienteForm.controls.cep.valid) {
      this.toastAlert("CEP não preenchido ou com tamanho inválido");
      return false;
    }

    if (!this.clienteForm.controls.bairro.valid) {
      this.toastAlert("Bairro é um campo obrigatório");
      return false;
    }

    if (!this.clienteForm.controls.cidade.valid) {
      this.toastAlert("Cidade é um campo obrigatório");
      return false;
    }

    if (!this.clienteForm.controls.uf.valid) {
      this.toastAlert("UF é um campo obrigatório");
      return false;
    }

    if (!this.clienteForm.valid) {
      this.toastAlert("Existem campos obrigatórios não preenchidos");
      return false;
    }

    return true;
  }

  cancelar() {
    this.navCtrl.pop();
  }
}

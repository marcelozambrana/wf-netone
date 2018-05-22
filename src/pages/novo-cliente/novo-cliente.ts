import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { SelectSearchable } from 'ionic-select-searchable';

import { ClientesProvider } from '../../providers/clientes/clientes';
import { CIDADES } from '../../providers/cidades/cidades';
import { ESTADOS } from '../../providers/cidades/estados';

import { Cliente } from '../../models/cliente';
import { ValidarCpf } from '../../pages/novo-cliente/valida-cpf';

@IonicPage()
@Component({
  selector: 'page-novo-cliente',
  templateUrl: 'novo-cliente.html',
})
export class NovoClientePage {

  titulo: string = "";
  passo = "1";
  isClienteCpfExistente: boolean = false;
  isPessoaJuridica: boolean = false;

  public clienteForm: any;
  cliente: any = { endereco: {} } as Cliente;
  estados = ESTADOS;
  cidadesEstado = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    private clientesProvider: ClientesProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) {

    this.titulo = this.navParams.get('titulo');
    let clienteEdit = this.navParams.get('clienteEdit');
    console.log(clienteEdit);
    if (clienteEdit) {
      this.carregarCliente(clienteEdit);
    }

    this.clienteForm = formBuilder.group({
      cpfCnpj: ['', Validators.required],
      nome: ['', Validators.required],
      fantasia: [''],
      rgInscricaoEstadual: [''],
      email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])],
      telefone: ['', Validators.required],
      celular: ['', Validators.required],
      endereco: ['', Validators.compose([Validators.minLength(5), Validators.required])],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      cep: ['', Validators.required],
      cidade: [''],
      uf: ['', Validators.required]
    })
  }

  carregarCliente(cli) {
    this.cliente = cli;
    this.isClienteCpfExistente = true;
    this.avancaPasso2();
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
          this.carregarCliente(queriedItems[0]);
          return;
        } else {
          this.isClienteCpfExistente = false;
        }
      });

    this.avancaPasso2();

  }

  avancaPasso2() {
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

    this.onSelectChangeUf(true);
    this.passo = "3";
  }

  buscarCliente(cpfCnpj) {
    return this.clientesProvider.buscarCpfCnpj(cpfCnpj);
  }

  async buscarClienteId(id) {
    return await this.clientesProvider.buscarId(id);
  }

  validaDadosPreSalvamento(cliente: Cliente) {
    if (!this.cliente.endereco.endereco) {
      this.toastAlert("Logradouro deve ter no mínimo 5 caracteres");
      return false;
    }

    if (!this.cliente.endereco.numero) {
      this.toastAlert("Número é um campo obrigatório");
      return false;
    }

    if (!this.cliente.endereco.cep) {
      this.toastAlert("CEP não preenchido ou com tamanho inválido");
      return false;
    }

    if (!this.cliente.endereco.bairro) {
      this.toastAlert("Bairro é um campo obrigatório");
      return false;
    }

    if (!this.cliente.endereco.uf) {
      this.toastAlert("UF é um campo obrigatório");
      return false;
    }

    if (!this.cliente.endereco.codigoIbge) {
      this.toastAlert("Cidade é um campo obrigatório");
      return false;
    }

    if (!this.clienteForm.valid) {
      this.toastAlert("Existem campos obrigatórios não preenchidos");
      return false;
    }

    return true;
  }

  onSelectChangeUf(carregandoCliente) {
    let loader = this.loadingCtrl.create({
      content: 'Buscando cidades...',
      dismissOnPageChange: true
    });

    if (!carregandoCliente) {
      this.limparCidade();
    }

    loader.present();

    let cidades = CIDADES;
    this.cidadesEstado = cidades
      .filter(cid => cid.estado.sigla === this.cliente.endereco.uf)
      .sort((a, b) => {
        return a.nome > b.nome ? 1 : -1;
      });

    loader.dismiss();
  }

  cidadeChange(event: { component: SelectSearchable, value: any }) {
    console.log('cidade selecionada:', event.value);
    this.cliente.endereco.codigoIbge = event.value.codigoIbge;
    this.cliente.endereco.cidade = event.value;
  }

  limparCidade() {
    this.cliente.endereco.codigoIbge = null;
    this.cliente.endereco.cidade = null;
  }

  cancelar() {
    this.navCtrl.pop();
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

}

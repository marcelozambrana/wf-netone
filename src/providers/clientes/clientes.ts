import { Injectable } from '@angular/core';

import { AuthProvider } from '../../providers/auth/auth';

import { Cliente } from '../../models/cliente';

@Injectable()
export class ClientesProvider {


  constructor(private auth: AuthProvider) {
  }


}

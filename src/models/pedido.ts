import { Cliente } from './cliente';
import { ItemPedido } from './itempedido';

export interface Pedido {
    numero?: string;
    cliente: Cliente | any;
    emissao: Date;
    previsaoEntrega: Date;
    condicaoPagamentoId: number;
    desconto: number;
    itens: ItemPedido[] | any[];
    total: number;
}


// isFinalizado: boolean;
// enderecoEntrega: {
//     logradouro: string;
//     numero: string;
//     complemento: string;
//     bairro: string;
//     cep: number;
//     cidade: string;
//     uf: string;
// },
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
    enviado: boolean;
}
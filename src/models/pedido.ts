import { Cliente } from './cliente';
import { ItemPedido } from './itempedido';

export interface Pedido {
    cliente: Cliente | any;
    numero?: string;
    emissao: Date;
    previsaoEntrega: Date;
    itens: ItemPedido[] | any[];
    formaCobrancaId: number;
    condicaoPagamentoId?: number;
    cartaoId?: number;
    planoOperadoraId?: number;
    descontoTotal?: number;
    total: number;
    enviado: boolean;
}
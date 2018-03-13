export interface Pedido {
    id?: string;
    cliente: string;
    dataPedido: string;
    dataEntrega: string;
    formaCobranca: string;
    condicaoPagamento: string;
    desconto: number;
    isFinalizado: boolean;
    enderecoEntrega: {
        logradouro: string;
        numero: string;
        complemento: string;
        bairro: string;
        cep: number;
        cidade: string;
        uf: string;
    },
    total: number;

}
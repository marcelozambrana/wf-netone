export interface CondicaoPagamento {
    idFirebase?: string;
    id: string;
    numeroParcelas: string;
    descricao: string;
    percentualVariacao: number;
    percentualDescontoMaximo: number;
    validaDescontoMaximo: boolean;
}
export interface PlanoOperadora {
    idFirebase?: string;
    id: string;
    ordem: string;
    descricao: string;
    numeroParcelas: string;
    percentualVariacao: number;
    percentualDescontoMaximo: number;
    validaDescontoMaximo: boolean;
}
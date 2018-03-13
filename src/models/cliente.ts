export interface Cliente {
    id?: string;
    cpfCnpj: string;
    nome: string;
    rg: string;
    email: string;
    fixo: string;
    celular: string;
    endereco: {
        logradouro: string;
        numero: string;
        bairro: string;
        cep: number;
        cidade: string;
        uf: string;
    }
    versao: string;
}
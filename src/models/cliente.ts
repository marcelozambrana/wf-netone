export interface Cliente {
    id?: string;
    nome: string;
    cpfCnpj: string;
    rg: string;
    email: string;
    endereco: {
        logradouro: string;
        numero: string;
        bairro: string;
        cep: string;
        cidade: string;
        uf: string;
    }
    versao: string;
}
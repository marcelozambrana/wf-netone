export interface Cliente {
    id?: string;
    cpfCnpj: string;
    nome: string;
    fantasia: string;
    rgInscricaoEstadual: string;
    email: string;
    telefone: string;
    celular: string;
    endereco: {
        endereco: string;
        numero: string;
        bairro: string;
        cep: number;
        complemento: string;
        cidade: string;
        uf: string;
    }
    versao: string;
}
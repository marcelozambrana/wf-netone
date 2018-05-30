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
        ibgeCidade: string;
        endereco: string;
        complemento: string;
        numero: string;
        bairro: string;
        cep: number;
        uf: string;
    };
}
import { PlanoOperadora } from './plano-operadora';

export interface CartaoCredito {
    idFirebase?: string;
    id: string;
    bandeira: string;
    descricao: string;
    planos:  PlanoOperadora[] | any[];
}
import { Cidade } from "./cidade.model";
import { Estado } from "./estado.model";

export class Endereco {
    id!: number;
    logradouro!: string;
    bairro!: string;
    numero!: string;
    complemento!: string;
    cep!: string;
    cidade!: Cidade;
    estado!: Estado;
}

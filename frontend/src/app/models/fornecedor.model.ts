import { Endereco } from "./endereco.model";
import { Telefone } from "./telefone.model";

export class Fornecedor {
    id!: number;
    nome!: string;
    cnpj!: string;
    email!: string;
    telefones!: Telefone[];
    enderecos!: Endereco[];
}

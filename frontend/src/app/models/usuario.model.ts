import { Endereco } from "./endereco.model";
import { Perfil } from "./perfil.model";
import { Telefone } from "./telefone.model";

export class Usuario {
    id!: number;
    nome!: string;
    cpf!: string;
    dataNascimento!: Date;
    senha!: string;
    email!: string;
    telefones!: Telefone[];
    enderecos!: Endereco[];
    perfil!: Perfil;
}

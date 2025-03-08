import { Endereco } from "./endereco.model";
import { Telefone } from "./telefone.model";

export class Usuario {
    id!: number;
    nome!: string;
    cpf!: string;
    dataNascimento!: Date;
    senha!: string;
    email!: string;
    endereco!: Endereco;
    telefone!: Telefone;
    perfil!: string;
}

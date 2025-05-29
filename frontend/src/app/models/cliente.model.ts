import { Cartao } from './cartao.model';
import { Usuario } from './usuario.model';

export class Cliente {
  id!: number;
  dataCadastro!: Date;
  usuario!: Usuario;
  cartao!: Cartao[];
}

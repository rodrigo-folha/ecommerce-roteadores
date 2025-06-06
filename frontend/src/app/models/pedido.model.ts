import { Cupom } from './cupom.model';
import { Endereco } from './endereco.model';
import { ItemPedido } from './item-pedido.model';
import { Pagamento } from './pagamento.model';
import { StatusPedido } from './status-pedido.model';

export class Pedido {
  id!: number;
  data!: Date;
  valorTotal!: number;
  listaItemPedido!: ItemPedido[];
  statusPedidos!: StatusPedido[];
  enderecoEntrega!: Endereco;
  cupomDesconto!: Cupom;
  idCartao!: number;
  pagamento!: Pagamento;
  modalidadePagamento!: string;
  idCliente!: number;
}

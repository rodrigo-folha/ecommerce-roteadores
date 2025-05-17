import { BandaFrequencia } from "./banda-frequencia.model";
import { Fornecedor } from "./fornecedor.model";
import { ProtocoloSeguranca } from "./protocolo-seguranca.model";
import { QuantidadeAntena } from "./quantidade-antena.model";
import { SinalWireless } from "./sinal-wireless.model";
import { SistemaOperacional } from "./sistema-operacional.model";

export class Roteador {
    id!: number;
    nome!: string;
    descricao!: string;
    preco!: number;
    quantidadeEstoque!: number;
    sistemaOperacional!: SistemaOperacional;
    bandaFrequencia!: BandaFrequencia;
    protocoloSeguranca!: ProtocoloSeguranca;
    quantidadeAntena!: QuantidadeAntena;
    sinalWireless!: SinalWireless;
    fornecedor!: Fornecedor
    listaImagem!: string[];
}

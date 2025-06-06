export interface RoteadorFilterRequest {
  precoMin?: number;
  precoMax?: number;
  protocolosSeguranca?: string[];
  sistemasOperacionais?: string[];
  bandasFrequencia?: string[];
  qtdAntenas?: number[];
  sinaisWireless?: string[];
  sortBy?: string;
  nome?: string;
}

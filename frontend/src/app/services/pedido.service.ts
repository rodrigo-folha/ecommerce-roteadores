import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pedido } from '../models/pedido.model';
import { IPaginator } from '../interfaces/ipaginator';
import { PedidoResumido } from '../models/pedido-resumido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private baseUrl = 'http://localhost:8080/pedidos';

  constructor(private httpClient: HttpClient) { }

  findAll(page?: number, pageSize?: number): Observable<IPaginator<Pedido>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<Pedido>>(this.baseUrl, {params});
  }

  findByEmail(email?: string, page?: number, pageSize?: number): Observable<IPaginator<Pedido>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        email: email,
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<Pedido>>(this.baseUrl, {params});
  }

  findPedidoResumido(email?: string, page?: number, pageSize?: number): Observable<IPaginator<PedidoResumido>> {
    let params = {};

    if (page !== undefined && pageSize !== undefined) {
      params = {
        email: email,
        page: page.toString(),
        pageSize: pageSize.toString()
      }
    }
    return this.httpClient.get<IPaginator<PedidoResumido>>(`${this.baseUrl}/resumo`, {params});
  }

  findById(id: String): Observable<Pedido> {
    return this.httpClient.get<Pedido>(`${this.baseUrl}/${id}`);
  }

  insert(pedido: Pedido): Observable<Pedido> {
    const data: any = {
      valorTotal: pedido.valorTotal,
      listaItemPedido: pedido.listaItemPedido,
      idEndereco: pedido.enderecoEntrega.id,
      tipoPagamento: pedido.modalidadePagamento.toLowerCase(),
    }

    if (pedido.cupomDesconto && pedido.cupomDesconto.codigo !== null) {
      data.cupomDesconto = pedido.cupomDesconto.codigo;
    }

    if (pedido.modalidadePagamento.toLowerCase() == 'cartao') {
      data.idCartao = pedido.idCartao;
    }

    return this.httpClient.post<Pedido>(this.baseUrl, data);
  }

  cancelar(idPedido: number): Observable<Pedido> {
    return this.httpClient.patch<Pedido>(`${this.baseUrl}/cancelar/${idPedido}`, {});
  }

  devolver(idPedido: number): Observable<Pedido> {
    return this.httpClient.patch<Pedido>(`${this.baseUrl}/devolver/${idPedido}`, {});
  }

  getResumo(): Observable<Pedido> {
    return this.httpClient.get<Pedido>(`${this.baseUrl}/resumo`);
  }

  update(pedido: Pedido): Observable<any> {
    return this.httpClient.put<Pedido>(`${this.baseUrl}/${pedido.id}`, pedido);
  }

  delete(pedido: Pedido): Observable<any> {
    return this.httpClient.delete<Pedido>(`${this.baseUrl}/${pedido.id}`);
  }

  cancelarPedido(idPedido: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/cancelar/${idPedido}`, {});
  }

  devolverPedido(idPedido: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/devolver/${idPedido}`, {});
  }

  pagarBoleto(idPedido: number, idBoleto: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/${idPedido}/pagamento/pagar/boleto/${idBoleto}`, {});
  }

  pagarPix(idPedido: number, idPix: number): Observable<void> {
    return this.httpClient.patch<void>(`${this.baseUrl}/${idPedido}/pagamento/pagar/pix/${idPix}`, {});
  }
}

import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable({
  providedIn: 'root'
})
export class CustomPaginatorIntlService extends MatPaginatorIntl {

  override itemsPerPageLabel: string = 'Itens por página';
  override nextPageLabel: string = 'Próxima página';
  override previousPageLabel: string = 'Página anterior';
}

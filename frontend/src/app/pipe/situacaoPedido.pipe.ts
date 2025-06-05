import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'situacaoPedido'
})
export class SituacaoPedidoPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';

    return value
      .toLowerCase() // deixa tudo minúsculo
      .split('_')    // divide em palavras
      .map(p => p.charAt(0).toUpperCase() + p.slice(1)) // capitaliza
      .join(' ');    // junta com espaço
  }

}

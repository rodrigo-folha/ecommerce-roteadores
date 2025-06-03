import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatarCartao'
})
export class FormatarCartaoPipe implements PipeTransform {

  transform(value: string, mostrarTudo: boolean = false): string {
    if (!value) return '';

    const digits = value.replace(/\D/g, '');

    if (mostrarTudo) {
      // Formata com espaços a cada 4 dígitos
      return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    } else {
      const ultimos4 = digits.slice(-4);
      const ocultos = digits.length === 15 ? '**** ****** *' : '**** **** **** ';
      return ocultos + ultimos4;
    }
  }

}

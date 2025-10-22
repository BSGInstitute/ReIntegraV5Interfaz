import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nl2brPipe',
})
// Pipe para detectar y convertir saltos de línea (\\n) en etiquetas <br> en mensajes de WhatsApp
export class Nl2brPipePipe implements PipeTransform {
  // Metodo para detectar si la cadena es HTML
  private isHtml(str: string): boolean {
    if (!str) return false;
    return /<[a-z][\s\S]*>/i.test(str);
  }

  transform(value: string | undefined): string {
    if (!value) {
      return '';
    }
    // 1. Si el mensaje ya contiene HTML devuelve sin modificar
    if (this.isHtml(value)) {
      return value;
    }

    // 2. Si el mensaje es texto plano con '\\n' se reemplaza por la etiqueta <br>.
    return value.replace(/\\n/g, '<br>');
  }
}

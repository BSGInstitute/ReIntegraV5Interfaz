// export function ValidateSpace(control: AbstractControl) {
//   if (!control.value.startsWith('https') || !control.value.includes('.io')) {
//     return { invalidUrl: true };
//   }
//   return null;
// }

import { DatePipe } from '@angular/common';

/**
 * Transforma una fecha en una cadena con el formato proporcionado.
 * @author Flavio Rodrigo Mamani Fabian
 * @param {Date} date Fecha a transformar
 * @param {string} formato formato que presentara la fecha.
 * @param {string} locale
 * @return {string}
 * @example
 * datePipeTransform(new Date());
 * datePipeTransform(new Date(), 'yyyy-MM-dd');
 * datePipeTransform(new Date(), 'yyyy-MM-dd', 'en-US');
 */
export function datePipeTransform(
  date: Date,
  formato: string = 'yyyy-MM-ddTHH:mm:ss.SSS',
  locale: string = 'en-US'
): string {
  const pipe = new DatePipe(locale);
  const formatoFecha: string = formato;
  return pipe.transform(date, formatoFecha);
}
export function getFechaInicio(locale: string = 'en-US'): Date {
  const pipe = new DatePipe(locale);
  let fecha = pipe.transform(new Date(), 'yyyy-MM-dd');
  return new Date(`${fecha}T00:00:00.000`);
}
export function getFechaFin(locale: string = 'en-US'): Date {
  const pipe = new DatePipe(locale);
  let fecha = pipe.transform(new Date(), 'yyyy-MM-dd');
  return new Date(`${fecha}T23:59:59.000`);
}
/**
 * Da formato datetime para una cadena
 * @param _date {string}
 * @returns {Date}
 */
// function formatStrinDate(_date) {
//   if (!_date) {
//       return "00-00-0000 00:00";
//   }
//   var date = new Date(_date);
//   const zeroFormat = unit => (unit < 10) ? `0${unit}` : unit;

//   let day = zeroFormat(date.getDate());
//   let month = zeroFormat(date.getMonth() + 1);
//   let hours = zeroFormat(date.getHours());
//   let minutes = zeroFormat(date.getMinutes());
//   let year = String(date.getFullYear());
//   return `${year}-${month}-${day} ${hours}:${minutes}`;
// }

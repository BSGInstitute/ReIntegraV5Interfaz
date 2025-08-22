/**
 * 
 * @param numero 
 * @returns 
 */
function Unidades(numero: number) {
  switch (numero) {
    case 1:
      return 'UN';
    case 2:
      return 'DOS';
    case 3:
      return 'TRES';
    case 4:
      return 'CUATRO';
    case 5:
      return 'CINCO';
    case 6:
      return 'SEIS';
    case 7:
      return 'SIETE';
    case 8:
      return 'OCHO';
    case 9:
      return 'NUEVE';
  }
  return '';
}
/**
 * 
 * @param numero 
 * @returns 
 */
function Decenas(numero: number) {
  let decena = Math.floor(numero / 10);
  let unidad = numero - decena * 10;
  switch (decena) {
    case 1:
      switch (unidad) {
        case 0:
          return 'DIEZ';
        case 1:
          return 'ONCE';
        case 2:
          return 'DOCE';
        case 3:
          return 'TRECE';
        case 4:
          return 'CATORCE';
        case 5:
          return 'QUINCE';
        default:
          return `DIECI${Unidades(unidad)}`;
      }
    case 2:
      switch (unidad) {
        case 0:
          return 'VEINTE';
        default:
          return `VEINTI${Unidades(unidad)}`;
      }
    case 3:
      return DecenasY('TREINTA', unidad);
    case 4:
      return DecenasY('CUARENTA', unidad);
    case 5:
      return DecenasY('CINCUENTA', unidad);
    case 6:
      return DecenasY('SESENTA', unidad);
    case 7:
      return DecenasY('SETENTA', unidad);
    case 8:
      return DecenasY('OCHENTA', unidad);
    case 9:
      return DecenasY('NOVENTA', unidad);
    case 0:
      return Unidades(unidad);
  }
  return '';
}
/**
 * 
 * @param cadena 
 * @param unidad 
 * @returns 
 */
function DecenasY(cadena: string, unidad: number) {
  if (unidad > 0) return `${cadena} Y ${Unidades(unidad)}`;
  return cadena;
}
/**
 * 
 * @param numero 
 * @returns 
 */
function Centenas(numero: number) {
  let centenas = Math.floor(numero / 100);
  let decenas = numero - centenas * 100;
  switch (centenas) {
    case 1:
      if (decenas > 0) return `CIENTO ${Decenas(decenas)}`;
      return 'CIEN';
    case 2:
      return `DOSCIENTOS ${Decenas(decenas)}`;
    case 3:
      return `TRESCIENTOS ${Decenas(decenas)}`;
    case 4:
      return `CUATROCIENTOS ${Decenas(decenas)}`;
    case 5:
      return `QUINIENTOS ${Decenas(decenas)}`;
    case 6:
      return `SEISCIENTOS ${Decenas(decenas)}`;
    case 7:
      return `SETECIENTOS ${Decenas(decenas)}`;
    case 8:
      return `OCHOCIENTOS ${Decenas(decenas)}`;
    case 9:
      return `NOVECIENTOS ${Decenas(decenas)}`;
  }
  return Decenas(decenas);
}
/**
 * 
 * @param numero 
 * @param divisor 
 * @param strSingular 
 * @param strPlural 
 * @returns 
 */
function Seccion(
  numero: number,
  divisor: number,
  strSingular: string,
  strPlural: string
) {
  let cientos = Math.floor(numero / divisor);
  let resto = numero - cientos * divisor;
  let letras = '';
  if (cientos > 0)
    if (cientos > 1) letras = `${Centenas(cientos)} ${strPlural}`;
    else letras = strSingular;

  if (resto > 0) letras += '';

  return letras;
}
/**
 * 
 * @param num 
 * @returns 
 */
function Miles(num: number) {
  let divisor = 1000;
  let cientos = Math.floor(num / divisor);
  let resto = num - cientos * divisor;
  let strMiles = Seccion(num, divisor, 'UN MIL', 'MIL');
  let strCentenas = Centenas(resto);
  if (strMiles == '') return strCentenas;
  return `${strMiles} ${strCentenas}`;
}
/**
 * 
 * @param num 
 * @returns 
 */
function Millones(num: number) {
  let divisor = 1000000;
  let cientos = Math.floor(num / divisor);
  let resto = num - cientos * divisor;
  let cadenaMillones = Seccion(num, divisor, 'UN MILLON DE', 'MILLONES DE');
  let cadenaMiles = Miles(resto);
  if (cadenaMillones == '') return cadenaMiles;
  return `${cadenaMillones} ${cadenaMiles}`;
}
/**
 * Convierte el precion a cadena de texto
 * @param {number} numero 
 * @param {string} nombreSingular 
 * @param {string} nombrePlural 
 * @returns 
 */
export function precioALetras(
  precio: number,
  nombreSingular: string,
  nombrePlural: string
): string {
  let enteros: number = Math.floor(precio);
  let centavos: number = Math.round(precio * 100) - Math.floor(precio) * 100;
  let letrasCentavos = '';
  let resultado: string = '';
  if (centavos > 0) {
    letrasCentavos = 'CON ';
    if (centavos == 1) letrasCentavos += `${Millones(centavos)} CENTAVO`;
    else letrasCentavos += `${Millones(centavos)} CENTAVOS`;
  }
  if (enteros == 0) resultado = `CERO ${nombrePlural} ${letrasCentavos}`;
  if (enteros == 1)
    resultado = `${Millones(enteros)} ${nombreSingular} ${letrasCentavos}`;
  else resultado = `${Millones(enteros)} ${nombrePlural} ${letrasCentavos}`;
  return resultado.trim();
}

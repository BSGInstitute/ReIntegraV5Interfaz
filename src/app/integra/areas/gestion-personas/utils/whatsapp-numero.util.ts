/**
 * Validación y formateo de números WhatsApp para GP.
 *
 * Flujo:
 *  1. Limpiar `celular` — dejar solo dígitos (quita espacios, +, -, paréntesis, etc.)
 *  2. Si el número limpio ya empieza con el código de país → strippearlo para
 *     quedarse solo con el número local.
 *  3. Validar que el número LOCAL tenga la cantidad exacta de dígitos del país.
 *  4. Armar `waTo` = código de país + número local limpio.
 *  5. Devolver resultado con `valido`, `waTo` y `mensaje` de error si aplica.
 *
 * Países soportados:
 *   Perú     idPais=51  código=51  local=9 dígitos  → waTo 11 dígitos
 *   México   idPais=52  código=52  local=10 dígitos → waTo 12 dígitos
 *   Colombia idPais=57  código=57  local=10 dígitos → waTo 12 dígitos
 */

interface PaisConfig {
  nombre: string;
  codigo: string;
  digitosLocal: number;
}

const CONFIG_PAISES: Record<string, PaisConfig> = {
  '51': { nombre: 'Perú',     codigo: '51', digitosLocal: 9  },
  '52': { nombre: 'México',   codigo: '52', digitosLocal: 10 },
  '57': { nombre: 'Colombia', codigo: '57', digitosLocal: 10 },
};

export interface ValidacionNumeroResult {
  valido: boolean;
  waTo: string | null;
  /** Mensaje UX si `valido === false`. */
  mensaje?: string;
}

/**
 * Valida y formatea un número de celular para WhatsApp.
 */
export function validarYFormatearNumero(
  celularRaw: string | null | undefined,
  idPais: number | null | undefined
): ValidacionNumeroResult {

  // 1. Guardia: datos mínimos.
  if (!celularRaw?.trim()) {
    return { valido: false, waTo: null, mensaje: 'El postulante no tiene número de celular registrado.' };
  }
  if (!idPais) {
    return { valido: false, waTo: null, mensaje: 'El postulante no tiene país registrado.' };
  }

  const paisKey = `${idPais}`;
  const config = CONFIG_PAISES[paisKey];

  if (!config) {
    // País no soportado — solo limpiamos y devolvemos sin validar longitud.
    const soloDigitos = `${celularRaw}`.replace(/\D+/g, '');
    if (!soloDigitos) {
      return { valido: false, waTo: null, mensaje: 'El número de celular no contiene dígitos válidos.' };
    }
    return { valido: true, waTo: soloDigitos };
  }

  // 2. Limpiar: dejar solo dígitos.
  const soloDigitos = `${celularRaw}`.replace(/\D+/g, '');
  if (!soloDigitos) {
    return { valido: false, waTo: null, mensaje: 'El número de celular no contiene dígitos válidos.' };
  }

  // 3. Quitar código de país si ya viene embebido.
  //    Ej: '51991679312' con idPais=51 → local='991679312' (9 dígitos ✓)
  //    Ej: '991679312'   con idPais=51 → local='991679312' (9 dígitos ✓)
  let numeroLocal: string;
  if (soloDigitos.startsWith(config.codigo)) {
    numeroLocal = soloDigitos.slice(config.codigo.length);
  } else {
    numeroLocal = soloDigitos;
  }

  // 4. Validar longitud del número local.
  if (numeroLocal.length !== config.digitosLocal) {
    return {
      valido: false,
      waTo: null,
      mensaje: `El número ${celularRaw.trim()} no es válido para ${config.nombre}. `
        + `Se esperan ${config.digitosLocal} dígitos locales y tiene ${numeroLocal.length}.`,
    };
  }

  // 5. Armar waTo = código de país + número local limpio.
  const waTo = `${config.codigo}${numeroLocal}`;

  return { valido: true, waTo };
}

export interface CategoriaAsesor {
  id: number;
  nombre: string;
  montoVenta: number;
  idMonedaVenta: number;
  codigoMonedaVenta: string;
  idVisualizacionMonedaVenta: number;
  visualizacionMonedaVenta: string;
  montoPremio: number;
  idMonedaPremio: number;
  codigoMonedaPremio: string;
  visualizarMonedaLocal: boolean;
}

export interface CategoriaAsesorEnviar {
  id: number;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  nombre: string;
  montoVenta: number;
  idMonedaVenta: number;
  idTableroComercialUnidadVenta: number;
  montoPremio: number;
  idMonedaPremio: number;
  visualizarMonedaLocal: boolean;
}

export interface CategoriaAsesorCombosIniciales {
  readonly monedas: MonedasCombo[];
  readonly unidades: UnidadesCombo[];
}

export interface MonedasCombo {
  id: number;
  codigo: string;
  dolarAMoneda: number;
  monedaADolar: number;
}

export interface UnidadesCombo {
  readonly id: number;
  readonly nombre: string;
  readonly valor: number;
  readonly simbolo: string;
}

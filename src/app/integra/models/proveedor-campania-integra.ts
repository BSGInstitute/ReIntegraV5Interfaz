import { BooleanFilterMenuComponent } from "@progress/kendo-angular-grid";

export interface ProveedorCampaniaIntegra {
  id: number;
  nombre: string;
  porDefecto: boolean;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
}

export interface ProveedorCampaniaIntegraCombo {
  id: number;
  nombre: string
}
// POST PUT
export interface ProveedorCampaniaIntegraEnvio {

  id: number;
  nombre: string;
  porDefecto:  boolean;
  estado: boolean;
  usuarioCreacion: string;
  usuarioModificacion: string;
  fechaCreacion: Date | string;
  fechaModificacion: Date | string;
}

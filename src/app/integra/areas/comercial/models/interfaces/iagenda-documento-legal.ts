import { SafeResourceUrl } from '@angular/platform-browser';
export interface IAgendaDocumentoLegal {
  id: number;
  nombre: string;
  descripcion: string;
  idPais: number;
  pais: string;
  url: string;
  area: number;
  areas?: number[];
  paises?: number[];
  roles: string;
  visualizarAgenda: boolean;
  descargarAgenda: boolean;
  usuario?: string;
  documentoByte: string;
  // Solo para vistas
  urlSanitize?: SafeResourceUrl;
}

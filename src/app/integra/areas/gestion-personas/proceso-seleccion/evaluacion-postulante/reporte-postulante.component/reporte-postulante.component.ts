import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

import { KendoGrid } from '@shared/models/kendo-grid';
import { IClaveValor, IComboBase1 } from '@shared/models/interfaces/iglobal';
import { Postulante } from '@gestionPersonas/models/reporte-evaluacion-postulante';
import { SortDescriptor } from '@progress/kendo-data-query';
import { RowClassArgs } from '@progress/kendo-angular-grid';

interface ClaveValor {
  [key: string]: string | number | boolean;
}

@Component({
  selector: 'app-reporte-postulante',
  templateUrl: './reporte-postulante.component.html',
  styleUrls: ['./reporte-postulante.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReportePostulanteComponent {
  // Inputs
  @Input() gridReportePostulante: KendoGrid<ClaveValor>;
  @Input() postulantesTemp: Postulante[] = [];
  @Input() comboVersionCentil: IClaveValor[] = [];
  @Input() versionCentilTemp: string = '';
  @Input() sortPostulante: SortDescriptor[] = [];
  @Input() groupPostulante: any[] = [];
  @Input() colorEvaluaciones: { evaluacion: string; color: string }[] = [];
  @Input() showReportePostulante = false;
  @Input() loadingReportePostulante = false;

  // Output para que el padre envíe el acceso temporal
  @Output() enviarAccesoTemporalPostulante = new EventEmitter<{
    dataItem: ClaveValor;
    idPostulante: number;
  }>();

  trackByPostulante = (_: number, p: Postulante) => p.idPostulante;
  trackByVersionCentil = (_: number, v: IClaveValor) => v.clave;

  rowCallback = (context: RowClassArgs) => {
    const styles: { [key: string]: boolean } = {};

    if (
      (context.dataItem.evaluacion != null &&
        context.dataItem.grupo != null &&
        context.dataItem.examen == null) ||
      (context.dataItem.evaluacion != null &&
        context.dataItem.grupo == null &&
        context.dataItem.examen == null)
    ) {
      styles['fw-bold'] = true;
    }

    const categoria = (context.dataItem.categoria as string) || '';

    if (categoria.toLowerCase().includes('psicologico')) {
      styles['color5'] = true;
    } else if (categoria.toLowerCase().includes('psicotecnico')) {
      styles['color3'] = true;
    } else {
      const item = this.colorEvaluaciones.find(
        (x) => x.evaluacion === context.dataItem.evaluacion
      );
      if (item) {
        styles[item.color] = true;
      }
    }

    return styles;
  };

  templateEstadoPostulante(
    dataItem: ClaveValor,
    idPostulante: number,
    versionCentil: string
  ): string {
    const cantidadConfigurado = dataItem[
      `cantidadConfigurado_${idPostulante}`
    ] as number;
    const cantidadResuelto = dataItem[
      `cantidadResuelto_${idPostulante}`
    ] as number;

    const puntajeCurso = Number(dataItem[`puntajeCurso_${idPostulante}`]);
    const notaAprobatoria = dataItem[
      `notaAprobatoria_${idPostulante}_Centil_${versionCentil}`
    ] as string;

    const estado = dataItem[
      `estado_${idPostulante}_Centil_${versionCentil}`
    ] as boolean;

    const simbolo = dataItem['simbolo'] as string;

    if (estado && notaAprobatoria !== 'N.A') {
      return 'Aprobado';
    } else {
      if (cantidadConfigurado != null && cantidadResuelto != null) {
        if (
          this.evaluarCaso(
            simbolo,
            Number(puntajeCurso),
            Number(notaAprobatoria)
          )
        ) {
          return 'Aprobado';
        } else {
          return 'Desaprobado';
        }
      } else {
        if (estado !== true && notaAprobatoria !== 'N.A') {
          return 'Desaprobado';
        } else {
          return 'N.A';
        }
      }
    }
  }

  // ====== LÓGICA DE RECUPERACIÓN (PUNTAJE %) ======
  templateRecuperacionPostulante(
    dataItem: ClaveValor,
    idPostulante: number
  ): string {
    const cantidadConfigurado = dataItem[
      `cantidadConfigurado_${idPostulante}`
    ] as number;
    const cantidadResuelto = dataItem[
      `cantidadResuelto_${idPostulante}`
    ] as number;

    const puntajeCurso = Number(dataItem[`puntajeCurso_${idPostulante}`]);
    const notaAprobatoria = Number(dataItem[`notaAprobatoria`]);
    const simbolo = dataItem['simbolo'] as string;

    if (cantidadConfigurado != null && cantidadResuelto != null) {
      if (cantidadConfigurado <= cantidadResuelto) {
        if (
          this.evaluarCaso(
            simbolo,
            Number(puntajeCurso),
            Number(notaAprobatoria)
          )
        ) {
          return `${puntajeCurso}%`;
        } else {
          return `${puntajeCurso}%`;
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  // ====== LÓGICA DE ACCESO TEMPORAL ======
  // 0 = nada, 1 = mostrar botón enviar, 2 = aplica pero sin acceso aún
  templateAccesoTemporalPostulante(
    dataItem: ClaveValor,
    idPostulante: number
  ): number {
    const notaAprobatoria = dataItem[`notaAprobatoria`] as string;
    const estado = dataItem[`estado_${idPostulante}`] as boolean;
    const aplicaAcceso = dataItem[`aplicaAcceso_${idPostulante}`];
    const estadoAcceso = dataItem[`estadoAcceso_${idPostulante}`];

    if (estado && notaAprobatoria !== 'N.A') {
      return 0;
    } else {
      if (estado === false && notaAprobatoria !== 'N.A') {
        if (aplicaAcceso != null) {
          if (estadoAcceso) {
            return 1; // mostrar botón enviar
          } else {
            return 2;
          }
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    }
  }

  // Emite el evento al padre cuando se hace clic en Enviar
  onEnviarAccesoTemporalPostulante(
    dataItem: ClaveValor,
    idPostulante: number
  ): void {
    this.enviarAccesoTemporalPostulante.emit({ dataItem, idPostulante });
  }

  // ====== UTILIDAD PARA COMPARAR (MISMA QUE EN EL PADRE) ======
  private evaluarCaso(
    simbolo: string,
    puntajeCurso: number,
    notaAprobatoria: number
  ): boolean {
    let resultado = false;
    switch (simbolo) {
      case '<':
        resultado = puntajeCurso < notaAprobatoria;
        break;
      case '>':
        resultado = puntajeCurso > notaAprobatoria;
        break;
      case '<=':
        resultado = puntajeCurso <= notaAprobatoria;
        break;
      case '>=':
        resultado = puntajeCurso >= notaAprobatoria;
        break;
      case '=':
      case '==':
      case '===':
        resultado = puntajeCurso === notaAprobatoria;
        break;
      case '<>':
      case '!=':
      case '!==':
        resultado = puntajeCurso !== notaAprobatoria;
        break;
      default:
        resultado = false;
        break;
    }
    return resultado;
  }
}

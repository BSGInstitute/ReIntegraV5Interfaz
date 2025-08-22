import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import {
  GroupDescriptor,
  process as kendoProcess,
} from '@progress/kendo-data-query';
import { HttpResponse } from '@angular/common/http';
import { forkJoin, Subject } from 'rxjs';
import { finalize, map, takeUntil } from 'rxjs/operators';

import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiGestionPersonal } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';

import {
  ObtenerComboReporteDTO,
  ReportePrincipalAnalisisProcesoSeleccionDTO,
  ReporteAnalisisProcesoSeleccionDTO,
  ReporteAnalisisProcesoSeleccionPorcentajeDTO,
  PuestoTrabajoReporteDTO,
  ProcesoSeleccionReporteDTO,
} from '@gestionPersonas/models/ReporteAnalisisProcesoSeleccion';

// ================== Filas de los grids ==================
interface RowBase {
  nombreEtapa: string;
  numeroPostulante: number;
  contactados: number;
  aprobados: number;
  desaprobados: number;
  enProceso: number;
  abandonados: number;
  sinRendir: number;
}
interface RowProveedor {
  proveedor: string | null;
  nombreEtapa: string;
  numeroPostulante: string;
  contactados: string;
  aprobados: string;
  desaprobados: string;
  enProceso: string;
  abandonados: string;
  sinRendir: string;
  idProcesoSeleccion?: number;
}

// ================== Helpers ==================
const toNum = (v: unknown, d = 0) => {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) ? n : d;
};
const toStr = (v: unknown, d = '') => (v == null ? d : String(v));
const collator = new Intl.Collator('es', { sensitivity: 'base' });

@Component({
  selector: 'app-reporte-analisis-proceso-seleccion',
  templateUrl: './reporte-analisis-proceso-seleccion.component.html',
  styleUrls: ['./reporte-analisis-proceso-seleccion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReporteAnalisisProcesoSeleccionComponent
  implements OnInit, OnDestroy
{
  constructor(
    private fb: FormBuilder,
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private cdr: ChangeDetectorRef
  ) {}

  private destroy$ = new Subject<void>();

  formFiltro: FormGroup = this.fb.group({
    puestoTrabajo: [null],
    procesoSeleccion: [null],
    fechaInicio: [null],
    fechaFin: [null],
  });

  DataPuestoTrabajo: PuestoTrabajoReporteDTO[] = [];
  DataProcesoSeleccion: ProcesoSeleccionReporteDTO[] = [];
  DataProcesoSeleccionFiltrada: ProcesoSeleccionReporteDTO[] = [];
  disableProcSelect = true;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  // 🔹 Solo agrupamos por proveedor (no por proceso)
  groups: GroupDescriptor[] = [{ field: 'proveedor' }];

  gridAnalisisReporteTotalizado: KendoGrid = new KendoGrid();
  gridAnalisisReporteProveedor: KendoGrid = new KendoGrid();
  gridAnalisisReporteTotalizadoAgrupado: KendoGrid = new KendoGrid();
  gridAnalisisReporteProveedorAgrupado: KendoGrid = new KendoGrid();
  enProcesoSolicitud = false;
  exportProveedorAgrupado: GroupDescriptor[] = [];
  ExportAnalisisReporteTotalizadoAgrupado: GroupDescriptor[] = [];
  // =============== Utils ===============
  /** Lee la primera clave existente, tolerando PascalCase/camelCase */
  private pick<T = any>(o: any, ...keys: string[]): T {
    for (const k of keys) {
      const v = o?.[k];
      if (v !== undefined && v !== null) return v as T;
    }
    return undefined as unknown as T;
  }

  private toYmd(d: Date | null): string | null {
    if (!d) return null;
    const y = d.getFullYear();
    const m = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  // =============== Ciclo ===============
  ngOnInit(): void {
    this.obtenerCombos();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // =============== Combos ===============
  obtenerCombos(): void {
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.AnalisisProcesoSeleccionObtenerCombos
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (resp: HttpResponse<ObtenerComboReporteDTO>) => {
          const body = resp.body;

          const puestosRaw = body?.listaPuestoTrabajo ?? [];
          this.DataPuestoTrabajo = puestosRaw.map((x: any) => ({
            id: this.pick<number>(x, 'id', 'Id'),
            nombre: this.pick<string>(x, 'nombre', 'Nombre'),
            idPersonalAreaTrabajo: this.pick<number>(
              x,
              'idPersonalAreaTrabajo',
              'IdPersonalAreaTrabajo'
            ),
            personalAreaTrabajo:
              this.pick<string>(
                x,
                'personalAreaTrabajo',
                'PersonalAreaTrabajo'
              ) ?? '',
          }));

          const procesosRaw = body?.listaProcesoSeleccion ?? [];
          this.DataProcesoSeleccion = procesosRaw.map((x: any) => ({
            id: this.pick<number>(x, 'id', 'Id'),
            nombre: this.pick<string>(x, 'nombre', 'Nombre'),
            idPuestoTrabajo: this.pick<number>(
              x,
              'idPuestoTrabajo',
              'IdPuestoTrabajo'
            ),
            personalAreaTrabajo:
              this.pick<string>(
                x,
                'personalAreaTrabajo',
                'PersonalAreaTrabajo'
              ) ?? '',
          }));

          this.disableProcSelect = true;
          this.DataProcesoSeleccionFiltrada = [];
          this.cdr.markForCheck();
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  onPuestoChange(idPuesto: number | null) {
    this.formFiltro.patchValue(
      { procesoSeleccion: null },
      { emitEvent: false }
    );

    const arr =
      idPuesto == null
        ? []
        : this.DataProcesoSeleccion.filter(
            (p) => p.idPuestoTrabajo === idPuesto
          );

    this.DataProcesoSeleccionFiltrada = arr;
    this.disableProcSelect = arr.length === 0;
    this.cdr.markForCheck();
  }

  // =============== Mappers ===============

  private mapEtapas(
    items: (
      | ReporteAnalisisProcesoSeleccionDTO
      | ReporteAnalisisProcesoSeleccionPorcentajeDTO
    )[]
  ): RowBase[] {
    return (items ?? [])
      .map((x: any) => ({
        ordenEtapa: toNum(x.ordenEtapa),
        nombreEtapa: toStr(x.nombreEtapa, ''),
        numeroPostulante: toNum(x.numeroPostulante),
        contactados: toNum(x.contactados),
        aprobados: toNum(x.aprobados),
        desaprobados: toNum(x.desaprobados),
        enProceso: toNum(x.enProceso),
        abandonados: toNum(x.abandonados),
        sinRendir: toNum(x.sinRendir),
      }))
      .sort((a, b) => a.ordenEtapa - b.ordenEtapa)
      .map(({ ordenEtapa, ...rest }) => rest);
  }

  private mapEtapasProveedorKeepOrder(
    items: (
      | ReporteAnalisisProcesoSeleccionDTO
      | ReporteAnalisisProcesoSeleccionPorcentajeDTO
    )[]
  ): RowProveedor[] {
    const rows = (items ?? []).map((x: any, i: number) => ({
      __seq: i, // índice para preservar orden de llegada
      proveedor: (x.proveedor ?? null) as string | null,
      idProcesoSeleccion: toNum(x.idProcesoSeleccion),
      nombreEtapa: toStr(x.nombreEtapa, ''),
      numeroPostulante: toStr(x.numeroPostulante, ''),
      contactados: toStr(x.contactados, ''),
      aprobados: toStr(x.aprobados, ''),
      desaprobados: toStr(x.desaprobados, ''),
      enProceso: toStr(x.enProceso, ''),
      abandonados: toStr(x.abandonados, ''),
      sinRendir: toStr(x.sinRendir, ''),
    }));

    return rows
      .sort(
        (a, b) =>
          collator.compare(a.proveedor ?? '', b.proveedor ?? '') ||
          a.__seq - b.__seq
      )
      .map(({ __seq, ...r }) => r);
  }

  // =============== Buscar / Generar ===============
  generarReporte(): void {
    if (this.enProcesoSolicitud) return;

    this.enProcesoSolicitud = true;
    this.gridAnalisisReporteTotalizado.loading = true;
    this.gridAnalisisReporteProveedor.loading = true;
    this.gridAnalisisReporteTotalizadoAgrupado.loading = true;
    this.gridAnalisisReporteProveedorAgrupado.loading = true;

    const filtro = {
      IdpuestoTrabajo: this.formFiltro.value.puestoTrabajo,
      IdprocesoSeleccion: this.formFiltro.value.procesoSeleccion,
      FechaInicio: this.toYmd(this.formFiltro.value.fechaInicio),
      FechaFin: this.toYmd(this.formFiltro.value.fechaFin),
    };

    const req1$ = this._integraService
      .postJsonResponse(
        constApiGestionPersonal.AnalisisProcesoSeleccionGenerarReporte,
        filtro
      )
      .pipe(
        map(
          (r: HttpResponse<ReportePrincipalAnalisisProcesoSeleccionDTO>) =>
            (r.body ?? {
              listaEtapas: [],
              listaEtapasPorcentaje: [],
            }) as ReportePrincipalAnalisisProcesoSeleccionDTO
        )
      );

    const req2$ = this._integraService
      .postJsonResponse(
        constApiGestionPersonal.AnalisisProcesoSeleccionGenerarReporte_V2,
        filtro
      )
      .pipe(
        map(
          (r: HttpResponse<ReportePrincipalAnalisisProcesoSeleccionDTO>) =>
            (r.body ?? {
              listaEtapas: [],
              listaEtapasPorcentaje: [],
            }) as ReportePrincipalAnalisisProcesoSeleccionDTO
        )
      );

    forkJoin<
      [
        ReportePrincipalAnalisisProcesoSeleccionDTO,
        ReportePrincipalAnalisisProcesoSeleccionDTO
      ]
    >([req1$, req2$])
      .pipe(
        finalize(() => {
          this.enProcesoSolicitud = false;
          this.gridAnalisisReporteTotalizado.loading = false;
          this.gridAnalisisReporteProveedor.loading = false;
          this.gridAnalisisReporteTotalizadoAgrupado.loading = false;
          this.gridAnalisisReporteProveedorAgrupado.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: ([body1, body2]) => {
          // EP1
          const listaEtapas1 = body1.listaEtapas ?? [];
          const listaPorc1 = body1.listaEtapasPorcentaje ?? [];
          this.gridAnalisisReporteTotalizado.data =
            this.mapEtapas(listaEtapas1);
          this.gridAnalisisReporteProveedor.data =
            this.mapEtapasProveedorKeepOrder(listaPorc1);

          const listaEtapas2 = body2.listaEtapas ?? [];
          const listaPorc2 = body2.listaEtapasPorcentaje ?? [];
          this.gridAnalisisReporteTotalizadoAgrupado.data =
            this.mapEtapasProveedorKeepOrder(listaEtapas2);
          this.gridAnalisisReporteProveedorAgrupado.data =
            this.mapEtapasProveedorKeepOrder(listaPorc2);
          this.ExportAnalisisReporteTotalizadoAgrupado = kendoProcess(
            this.gridAnalisisReporteTotalizadoAgrupado.data,
            { group: this.groups }
          ).data as GroupDescriptor[];

          this.exportProveedorAgrupado = kendoProcess(
            this.gridAnalisisReporteProveedorAgrupado.data,
            { group: this.groups }
          ).data as GroupDescriptor[];

          this.cdr.markForCheck();
        },
        error: (error) => {
          const msg = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(msg);
        },
      });
  }

  pageChangeTotalizado(_: any) {}
  pageChangeProveedor(_: any) {}
}

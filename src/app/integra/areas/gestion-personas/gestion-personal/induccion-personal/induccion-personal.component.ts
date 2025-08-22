import {
  ComboInduccionPersonal,
  FormFiltroInduccion,
  IDCursoCalificacion,
  ReporteInduccionPersonal,
} from './../../models/InduccionPersonal';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiGestionPersonal } from '@environments/constApi';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import {
  ExcelExportEvent,
  FilterCellOperatorsComponent,
} from '@progress/kendo-angular-grid';
import { FilterOperator } from '@progress/kendo-angular-grid/common/filter-operator.interface';
import { FilterOperatorBase } from '@progress/kendo-angular-grid/filtering/operators/filter-operator.base';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { saveAs } from '@progress/kendo-file-saver';
import { getFechaFin, getFechaInicio } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Workbook } from '@progress/kendo-ooxml';
/**
 * @module GestionPersonas
 * @name InduccionPersonalComponent
 * @description componente para los reporte de induccion del personal
 * @author Eliot Roy Arias Flores
 * @version 1.0.0
 * @history
 * 26/12/2024 Implementacion de componente
 **/
@Component({
  selector: 'app-induccion-personal',
  templateUrl: './induccion-personal.component.html',
  styleUrls: ['./induccion-personal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InduccionPersonalComponent implements OnInit {
  comboInduccion: ComboInduccionPersonal;
  reporteInduccion: ReporteInduccionPersonal[];

  gridInduccionPersonal = new KendoGrid<ReporteInduccionPersonal>();
  public pageSize = 5;
  public buttonCount = 2;
  public sizes: any = [10, 20, 50, 'All'];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public format: FormatSettings = {
    displayFormat: 'yyyy-MM-dd',
    inputFormat: 'yyyy-MM-dd',
  };

  buttonDisable: boolean = false;
  loaderForm: boolean = true;

  formFiltro: FormGroup = this.formBuilder.group({
    IdArea: [[]],
    IdSede: [[]],
    IdProceso: [[]],
    FechaInicio: [getFechaInicio()],
    FechaFin: [getFechaFin()],
  });

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.traerCombo();
    this.traerReporteInduccionPersonal();
  }

  get fechaActual(): Date {
    return new Date();
  }

  traerCombo() {
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerCombosInduccion)
      .subscribe({
        next: (response: HttpResponse<ComboInduccionPersonal>) => {
          this.comboInduccion = response.body;
          console.log(this.comboInduccion);
          this.loaderForm = false;
        },
        error: (error: any) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
          console.log(error);
        },
      });
  }

  traerReporteInduccionPersonal() {
    this.gridInduccionPersonal.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerReporteInduccionPersonal)
      .subscribe({
        next: (response: HttpResponse<ReporteInduccionPersonal[]>) => {
          this.reporteInduccion = response.body;
          this.gridInduccionPersonal.data = this.reporteInduccion;
          this.gridInduccionPersonal.loading = false;
          console.log(this.reporteInduccion);
        },
        error: (error: any) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
          this.gridInduccionPersonal.loading = false;
          console.log(error);
        },
      });
  }

  ordenNotas(list: IDCursoCalificacion[], orden: number){
    if (!list || !Array.isArray(list)) {
      return ' - ';
    }
    const item = list.find((x) => x.ordenFilaSesion === orden);
    if (!item) {
      return ' - ';
    }else{
      return Math.trunc(item.calificacion);
    }
  }

  // Convertir a número y red

  // ordenNotas(list: IDCursoCalificacion[], orden: number): string {
  //   if (!list || !Array.isArray(list)) {
  //     return ' - ';
  //   }
  //   const item = list.find((x) => x.ordenFilaSesion === orden);
  //   if (!item) {
  //     return ' - ';
  //   }

  //   // Convertir a número y redondear a 1 decimal
  //   const cal = parseFloat(item.calificacion as string);
  //   if (isNaN(cal)) {
  //     return ' - ';
  //   }

  //   return cal.toFixed(1); // <= Redondea a 1 decimal, retorna string
  // }

  validarFechas() {
    const fechaInicio = this.formFiltro.get('FechaInicio')?.value;
    const fechaFin = this.formFiltro.get('FechaFin')?.value;
    if (fechaInicio > fechaFin) {
      this._alertaService.notificationWarning(
        'La fecha de inicio no puede ser mayor a la fecha de fin'
      );
    }
  }

  buscar() {
    const data = this.formFiltro.getRawValue() as FormFiltroInduccion;
    if (new Date(data.FechaFin) < new Date(data.FechaInicio)) {
      this._alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido',
      });
      return;
    }

    console.log(data);
    this.gridInduccionPersonal.loading = true;
    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.ObtenerReporteInduccionPersonalFiltro,
        data
      )
      .subscribe({
        next: (response: HttpResponse<ReporteInduccionPersonal[]>) => {
          this.reporteInduccion = response.body;
          this.gridInduccionPersonal.loading = false;
          this.gridInduccionPersonal.data = this.reporteInduccion;
          console.log(this.reporteInduccion);
        },
        error: (error: any) => {
          this.gridInduccionPersonal.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
          console.log(error);
        },
      });
  }

  // public onExcelExport(args: ExcelExportEvent): void {
  //   args.preventDefault();

  //   const workbook = args.workbook;
  //   const sheet = workbook.sheets[0];
  //   const rows = sheet.rows;

  //   const headerStyle = rows[0].cells[0];
  //   const data = this.gridInduccionPersonal.data;
  //   for (let idx = data.length - 1; idx >= 0; idx--) {
  //     const item = data[idx];

  //     rows.splice(idx + 1, 0, {
  //       cells: [
  //         { value: item.fechaRealizado },
  //         { value: item.nombreSede },
  //         { value: item.nombreArea },
  //         { value: item.nombrePuestoTrabajo },
  //         { value: item.nroDocumento },
  //         { value: item.nombrePostulante },
  //         { value: this.ordenNotas(item.idCursoCalificacion, 1) },
  //         { value: this.ordenNotas(item.idCursoCalificacion, 2) },
  //         { value: this.ordenNotas(item.idCursoCalificacion, 3) },
  //         { value: this.ordenNotas(item.idCursoCalificacion, 4) },
  //         { value: item.promedioGeneral },
  //       ],
  //     });
  //   }

  //   new Workbook(workbook).toDataURL().then((dataUrl: string) => {
  //     saveAs(dataUrl, 'ReporteInduccionPersonal.xlsx');
  //   });
  // }

  public onExcelExport(args: ExcelExportEvent): void {
    args.preventDefault();

    const headers = [
      'Fecha Realizado',
      'Sede',
      'Área',
      'Puesto Trabajo',
      'Nro Documento',
      'Nombres y Apellidos',
      'N. Presentación BSG',
      'N. Reglamento Interno',
      'N. Gestión de Calidad',
      'N. Seguridad y Salud',
      'Promedio',
    ];

    const workbook = new Workbook({
      sheets: [
        {
          name: 'ReporteInduccionPersonal',
          rows: [
            // Fila de cabeceras
            {
              cells: headers.map((header) => ({
                value: header,
                bold: true, // Estilo opcional para hacerlas negritas
              })),
            },
            // Datos de la tabla
            ...this.gridInduccionPersonal.data.map((item) => ({
              cells: [
                { value: item.fechaRealizado },
                { value: item.nombreSede },
                { value: item.nombreArea },
                { value: item.nombrePuestoTrabajo },
                { value: item.nroDocumento },
                { value: item.nombrePostulante },
                { value: this.ordenNotas(item.idCursoCalificacion, 1) },
                { value: this.ordenNotas(item.idCursoCalificacion, 2) },
                { value: this.ordenNotas(item.idCursoCalificacion, 3) },
                { value: this.ordenNotas(item.idCursoCalificacion, 4) },
                { value: item.promedioGeneral },
              ],
            })),
          ],
        },
      ],
    });

    workbook.toDataURL().then((dataUrl: string) => {
      saveAs(dataUrl, 'ReporteInduccionPersonal.xlsx');
    });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '../../../../../shared/models/interfaces/iglobal';
import { constApiPlanificacion } from '../../../../../../environments/constApi';
import { datePipeTransform } from '../../../../../shared/functions/date-pipe';
import { GridComponent, PageSizeItem } from '@progress/kendo-angular-grid';
import { IntegraService } from '../../../../../shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import * as he from 'he';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';

interface IFormFiltro {
  idsProgramasGenerales: number[];
  idsProgramasEspecificos: number[];
  idsDocentes: number[];
  version: number;
  fechaInicio: Date;
  fechaFin: Date;
}

/**
 * @module PlanificacionModule
 * @description Componente del Reporte Encuesta Final de cursos Sincrónicos
 * @author Max Mantilla Rodriguez - Jeremy Pacheco
 * @version 1.0.0
 * @history
   12/11/2024 Implementacion del Reporte Encuesta Final
   22/11/2024 Creacion de Grilla
 */

@Component({
  selector: 'app-reporte-encuesta-final-sincronico',
  templateUrl: './reporte-encuesta-final-sincronico.component.html',
  styleUrls: ['./reporte-encuesta-final-sincronico.component.scss'],
})
export class ReporteEncuestaFinalSincronicoComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private integraService: IntegraService,
    private alertaService: AlertaService
  ) {
    this.allData = this.allData.bind(this);
  }
  @ViewChild(GridComponent) grid!: GridComponent;

  dataProgramaGeneral: IComboBase1[] | null = [];
  dataProgramaEspecifico: IComboBase1[] | null = [];
  dataDocentes: IComboBase1[] | null = [];

  btnBuscarDisabled: boolean = false;

  gridReporteEncuestaFinalSincronico: KendoGrid = new KendoGrid();

  dataVersionesEncuesta: any[] | null = [];

  formFiltro: FormGroup = this.formBuilder.group({
    idsProgramasGenerales: [[]],
    idsProgramasEspecificos: [[]],
    idsDocentes: [[]],
    version: [null, Validators.required],
    fechaInicio: [new Date(), Validators.required],
    fechaFin: [new Date(), Validators.required],
  });

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  arrayColumnasExcel: {
    field: string;
    title: string;
  }[] = [];
  arrayColumnasPreguntas: {
    field: string;
    title: string;
  }[] = [];
  data: any[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  get obtenerFechaActual() {
    return new Date();
  }
  ngOnInit(): void {
    //Merge
    this.obtenerProgramasGenerales();
    this.obtenerDocentes();
    this.obtenerVersionesEncuesta();
    this.formFiltro.valueChanges.subscribe(() => {
      this.verificarFiltros();
    });
    this.verificarFiltros();
  }

  ngOnDestroy(): void {
    dataProgramaGeneral: null;
    dataProgramaEspecifico: null;
    dataDocente: null;
    btnBuscarDisabled: null;
    gridReporteEncuestaIntermediaSincronico: null;
    arrayColumnasExcel: [];
    data: [];
  }

  verificarFiltros() {
    const { version, fechaInicio, fechaFin } = this.formFiltro.value;
    const esVersionValida = this.dataVersionesEncuesta?.some(v => v.version === version);
    this.btnBuscarDisabled = !(esVersionValida && fechaInicio && fechaFin);
  }

  obtenerProgramasGenerales() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerProgramasGenerales}`
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.dataProgramaGeneral = resp.body;
        },
      });
  }

  obtenerCursoPEspecifico(idsPGenerales: number[]) {
    this.dataProgramaEspecifico = [];
    if (idsPGenerales.length > 0) {
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.PEspecificoObtenerCombosPEpecificoPorProgramaGeneral,
          JSON.stringify(idsPGenerales)
        )
        .subscribe({
          next: (resp: HttpResponse<IComboBase1[]>) => {
            this.dataProgramaEspecifico = resp.body;
          },
        });
    } else this.formFiltro.get('idsProgramasEspecificos').reset();
  }

  obtenerDocentes() {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.ReporteEncuestasSincronico}`)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.dataDocentes = resp.body;
        },
      });
  }

  obtenerVersionesEncuesta() {
    this.integraService
    .getJsonResponse(`${constApiPlanificacion.ObtenerVersionEncuestaSincronico}`)
    .subscribe({
      next: (resp: HttpResponse<any[]>) => {
        this.dataVersionesEncuesta = resp.body;
      },
    });
  }

  generarReporte() {
    if (this.formFiltro.valid) {
      this.gridReporteEncuestaFinalSincronico.loading = true;
      this.btnBuscarDisabled = true;
      const dataForm: IFormFiltro = this.formFiltro.getRawValue();
      const filtro = {
        idsProgramasGenerales: dataForm.idsProgramasGenerales,
        idsProgramasEspecificos: dataForm.idsProgramasEspecificos,
        idsDocentes: dataForm.idsDocentes,
        version: dataForm.version,
        fechaInicio: datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd'),
        fechaFin: datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd'),
      };
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.ReporteEncuestasGenerarReporteEncuestaFinalSincronico,
          JSON.stringify(filtro)
        )
        .subscribe({
          next: (resp: any) => {
            console.log('ResultadoReporte',resp);
            this.gridReporteEncuestaFinalSincronico.data = resp.body;
            this.calcularColumnaPreguntas(this.gridReporteEncuestaFinalSincronico.data);
            this.calcularColumnaExcelDesdeGrilla();
            this.gridReporteEncuestaFinalSincronico.loading = false;
            this.btnBuscarDisabled = false;
            if (resp.body.length) {
              this.alertaService.notificationSuccessBotom(
                'Reporte generado exitosamente'
              );
            } else {
              this.alertaService.notificationSuccessBotom('Reporte sin datos.');
            }
          },
          error: (error) => {
            this.btnBuscarDisabled = false;
            this.gridReporteEncuestaFinalSincronico.loading = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            if (mensaje) this.alertaService.notificationWarning(mensaje);
          },
        });
    }
  }

  calcularColumnaPreguntas(datos: any) {
    this.arrayColumnasPreguntas = [];
    if (!datos || datos.length === 0) return;
    const preguntas = datos[0].registroPreguntas;
    preguntas.forEach((pregunta: any, index: number) => {
      this.arrayColumnasPreguntas.push({
        field: `pregunta_${pregunta.idPreguntaEncuesta}`,
        title: pregunta.pregunta
      });
    });

    datos.forEach((registro: any) => {
      registro.registroPreguntas.forEach((pregunta: any) => {
        const fieldName = `pregunta_${pregunta.idPreguntaEncuesta}`;
        const valorRespuesta = pregunta.respuestas.map((r: any) => r.valor).join(', ');
        registro[fieldName] = valorRespuesta;
      });
    });
  }

  calcularColumnaExcelDesdeGrilla() {
    this.arrayColumnasExcel = [];
    if (!this.grid || !this.grid.columns) return;
    const columnasGrid = this.grid.columns.toArray();
    columnasGrid.forEach((col: any) => {
      if (!col.field || col.hidden) return;
      let titulo = col.title || this.formatearTituloColumna(col.field);
      const colDinamica = this.arrayColumnasPreguntas.find(p => p.field === col.field);
      if (colDinamica) {
        titulo = colDinamica.title;
      }
      this.arrayColumnasExcel.push({
        field: col.field,
        title: titulo,
      });
    });
    this.arrayColumnasPreguntas.forEach(col => {
      const yaIncluida = this.arrayColumnasExcel.some(c => c.field === col.field);
      if (!yaIncluida) {
        this.arrayColumnasExcel.push({
          field: col.field,
          title: col.title,
        });
      }
    });
  }

  formatearTituloColumna(campo: string): string {
    const columnaPregunta = this.arrayColumnasPreguntas?.find(p => p.field === campo);
    if (columnaPregunta) return columnaPregunta.title;
    return campo
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  }

  convertirHTML(html: string): string {
    let patron = /<[^>]+>/g;
    let textoSinEtiquetas = html.replace(patron, '');
    let textoDecodificado = he.decode(textoSinEtiquetas);
    return textoDecodificado;
  }

  allData(): ExcelExportData {
    this.crearDataParaExcel();
    const result: ExcelExportData = {
      data: this.data,
    };
    return result;
  }

  crearDataParaExcel() {
    this.data = [];
    const columnas = this.arrayColumnasExcel.map(col => col.field);
    this.gridReporteEncuestaFinalSincronico.data.forEach((x: any) => {
      const obj: any = {};
      columnas.forEach((columna) => {
        let valor = x[columna];
        if (columna === 'fechaIngreso' || columna === 'fechaRealizada') {
          valor = datePipeTransform(valor, 'yyyy-MM-dd HH:mm:ss');
        }
        obj[columna] = valor;
      });
      this.data.push(obj);
    });
  }
  
}

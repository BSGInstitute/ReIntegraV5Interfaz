import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { HttpResponse } from '@angular/common/http';
import { constApiFinanzas, constApiPlanificacion } from '@environments/constApi';
import {
  DropDownFilterSettings,
  VirtualizationSettings,
} from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { PageSizeItem } from '@progress/kendo-angular-grid';

interface Combo {
  obtenerCoordinadorasDocente: IComboBase1[];
  obtenerNombreProveedorParaHonorario: IComboBase1[];
  obtenerCombo: IComboBase1[];
  obtenerProgramaEspecifico: IComboBase1[];
}
interface ICodigoMatricula {
  id: number;
  codigoMatricula: string;
}
interface IFormFiltro {
  idsProgramaEspecifico: number[] | null;
  idsCentroCosto: number[] | null;
  idsDocente: number[] | null;
  idsCoordinadora: number[] | null;
  idCodigoMatricula: number | null;
  idEstadoRevision: number | null;
  fechaInicial: string;
  fechaFin: string;
}
interface ProyectoPresentadoPorAlumno {
  idEnvio: string;
  programaEspecifico: string;
  centroCosto: string;
  codigoMatricula: string;
  alumno: string;
  nombreArchivo: string;
  enlaceArchivo: string;
  fechaEnvio: string;
  horaEnvio: string;
  fechaCalificacion: string;
  horaCalificacion: string;
  nota: string;
  coordinadorAcademico: string;
  docente: string;
  responsableCoordinacion: string;
  nroEnvio: string;
  comentarios: string;
  docenteCalificacion: string;
  responsableCoordinacionDocenteCalificacion: string;
  nombreArchivoRetroalimentacion: string;
  urlArchivoSubidoRetroalimentacion: string;
  estadoDevuelto: boolean | null;
}
/*
 * @module PlanificacionModule
 * @description Componente del Reporte de proyectos presentados por alumnos
 * @author Gretel Danitza Canasa Condori
 * @version 1.0.0
 * @history
   23/04/2023 Implementacion del Reporte Docente Encargado de  revisión
   23/04/2023 Creacion de Grilla
 */
@Component({
  selector: 'app-proyecto-presentado-por-alumno',
  templateUrl: './proyecto-presentado-por-alumno.component.html',
  styleUrls: ['./proyecto-presentado-por-alumno.component.scss'],
})
export class ProyectoPresentadoPorAlumnoComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) {
    this.allData = this.allData.bind(this);
  }
  dataCoordinadorasDocente: IComboBase1[] = [];
  dataProveedor: IComboBase1[] = [];
  dataCentroCosto: IComboBase1[] = [];
  dataPEspecifico: IComboBase1[] = [];
  estadoRevision: IComboBase1[] = [];
  codigoMatricula: ICodigoMatricula[] = [];
  currentDate = new Date();
  DiasTrancurridos: number;

  gridReporteProyectoPresentadoPorAlumno: KendoGrid = new KendoGrid();

  formFiltro: FormGroup = this.formBuilder.group({
    idsProgramaEspecifico: [[]],
    idsCentroCosto: [[]],
    idsDocente: [[]],
    idsCoordinadora: [[]],
    idCodigoMatricula: null,
    idEstadoRevision: null,
    fechaInicial: [new Date()],
    fechaFin: [new Date()],
  });

  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };
  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  btnBuscarDisabled: boolean = false;

  allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: this.gridReporteProyectoPresentadoPorAlumno.data,
    };
    return result;
  }

  ngOnInit(): void {
    console.log(this.formFiltro);
    this.obtenerCombos();
    this.estadoRevision = [
      { nombre: 'Revisado', id: 1 },
      { nombre: 'Pendiente', id: 2 },
    ];
  }

  get obtenerFechaActual() {
    return new Date();
  }

  obtenerCombos() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProyectoPresentadoPorAlumnoObtenerCombosModulo}`
      )
      .subscribe({
        next: (resp: HttpResponse<Combo>) => {
          this.dataCoordinadorasDocente = resp.body.obtenerCoordinadorasDocente;
          this.dataProveedor = resp.body.obtenerNombreProveedorParaHonorario;
          this.dataCentroCosto = resp.body.obtenerCombo;
          this.dataPEspecifico = resp.body.obtenerProgramaEspecifico;
        },
      });
  }

  ObtenerIdsCodigoMatricula() {
    const filtro = {
      valor: this.formFiltro.get('nombreCodigoMatricula').value,
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ReportePagosIngresosObtenerCodigoMatriculaAutocomplete,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<ICodigoMatricula[]>) => {
          this.codigoMatricula = resp.body;
        },
      });
  }

  obtenerCodigoMatriculaAutocomplete(value:string) {
    console.log(value);
    if(value.length >= 4){
    this.integraService
      .obtenerPorFiltro(constApiFinanzas.MatriculaCabeceraObtenerCodigoMatriculaAutocomplete, {
        valor: value,
      })
      .subscribe({
        next: (response) => {
          this.codigoMatricula = response.body;
        },
      });
    }
  }

  generarReporte() {
    this.gridReporteProyectoPresentadoPorAlumno.loading = true;
    this.gridReporteProyectoPresentadoPorAlumno.data = [];
    this.gridReporteProyectoPresentadoPorAlumno.loadData();
    this.btnBuscarDisabled = true;

    const dataForm: IFormFiltro = this.formFiltro.getRawValue();
    const filtro = {
      ProgramaEspecifico: dataForm.idsProgramaEspecifico,
      CentroCosto: dataForm.idsCentroCosto,
      Docente: dataForm.idsDocente,
      Coordinadora: dataForm.idsCoordinadora,
      CodigoMatricula: dataForm.idCodigoMatricula,
      EstadoRevision: dataForm.idEstadoRevision,
      FechaInicial: dataForm.fechaInicial,
      FechaFin: dataForm.fechaFin,
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ProyectoPresentadoPorAlumnoGenerarReporte,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<ProyectoPresentadoPorAlumno[]>) => {
          this.gridReporteProyectoPresentadoPorAlumno.data = resp.body;
          this.gridReporteProyectoPresentadoPorAlumno.loadData();
          this.gridReporteProyectoPresentadoPorAlumno.loading = false;
          this.btnBuscarDisabled = false;
          if (resp.body.length)
            this.alertaService.notificationSuccessBotom(
              'Reporte generado exitosamente.'
            );
          else
            this.alertaService.notificationSuccessBotom('Reporte sin datos.');
        },
        error: (error) => {
          this.btnBuscarDisabled = false;
          this.gridReporteProyectoPresentadoPorAlumno.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerDiasTrancurridos(fEnvio: string, fRevisado: string) {

    const startDateStr = fEnvio;
    const startDateParts = startDateStr.split('-');
    const startDate = new Date(
      `${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`
    );

    let endDate
    if(fRevisado != null){
      const endDateStr = fRevisado;
      const endDateParts = endDateStr.split('-');
      endDate = new Date(
        `${startDateParts[2]}-${endDateParts[1]}-${endDateParts[0]}`
      );
    }
    else{
      endDate = new Date();
    }

    // Calculate the time difference in milliseconds
    const timeDifferenceMs = endDate.getTime() - startDate.getTime();
    // Convert milliseconds to days
    const differenceInDays = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));

    return differenceInDays;
  }
}

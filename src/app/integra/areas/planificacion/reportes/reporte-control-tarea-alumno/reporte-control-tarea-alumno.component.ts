import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiFinanzas, constApiGlobal, constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IReporteControlTareaAlumnoFiltro } from '@planificacion/models/interfaces/ireportes';
import { DropDownFilterSettings, VirtualizationSettings } from '@progress/kendo-angular-dropdowns';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

interface IFormFiltro {
  estadoTarea: boolean;
  fechaInicio: Date;
  fechaFin: Date;
  idsProgramasEspecificos: number[];
  idMatriculaCabecera: number;
  idsAlumnos: string;
}
interface IFormReasignar {
  alumno: string;
  curso: string;
  proveedor: number;
}
/**
 * @module PlanificacionModule
 * @description Componente del Reporte de Problemas del Aula Virtual
 * @author Jonathan Raúl Caipo Huacasi
 * @version 1.0.0
 * @history
   03/05/2023 Implementacion del Reporte Problemas del Aula Virtual
   03/05/2023 Creacion de Grilla
 */
@Component({
  selector: 'app-reporte-control-tarea-alumno',
  templateUrl: './reporte-control-tarea-alumno.component.html',
  styleUrls: ['./reporte-control-tarea-alumno.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ReporteControlTareaAlumnoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.allData = this.allData.bind(this);
   }

  dataPEspecificoAutocomplete: IComboBase1[] = [];
  dataAlumnoAutocomplete: IComboBase1[] = [];
  dataProveedor: IComboBase1[] = [];
  dataProveedorAux:  IComboBase1[] = [];
  dataCodigoMatriculacomplete: IComboBase1[] = [];

  dataEstadoTarea  = [
    { id: true, nombre: 'Revisadas' },
    { id: false, nombre: 'Sin Revisar' },
  ];

  isDisabled: boolean = false;
  estado: boolean;
  diasTranscurridos?: number; // add question mark to indicate optional property
  gridReporteControlTareaAlumno: KendoGrid = new KendoGrid();
  btnBuscarDisabled: boolean = false;
  btnReasignarDisabled: boolean = false;
  combodataProveedor:any;

  formFiltro: FormGroup = this.formBuilder.group({ 
    estadoTarea: null,
    fechaInicio: [new Date()],
    fechaFin:[new Date()],
    idMatriculaCabecera: 0,
    idsProgramasEspecificos: [],
    idsAlumnos: []
  });

  formReasigancion:FormGroup = this.formBuilder.group({ 
    alumno: null,
    curso: null,
    proveedor: null,
  });
  
  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]

  get obtenerFechaActual(){
    return new Date()
  }

  allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: this.gridReporteControlTareaAlumno.data,
    };
    return result;
  }

  ngOnInit(): void {
    this.obtenerProveedor();
  }

  ngOnDestroy(): void {
  }

  obtenerProveedor() {
    this.integraService
      .getJsonResponse(
        `${constApi.ProveedorObtenerProveedor}`
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.dataProveedor = resp.body;
          this.dataProveedorAux = resp.body;
        },
      });
  }


  filterProveedor(filterValue: string) {
    this.combodataProveedor = [];
    if (this.dataProveedor) {
      this.combodataProveedor = this.dataProveedorAux.filter((element: any) => {
        return element.nombre.toLowerCase().includes(filterValue.toLowerCase());
      });
    }
  }


  obtenerProgramaEspecificoAutocomplete(value:string) {
    console.log(value);
    if(value.length >= 4){
    this.integraService
      .obtenerPorFiltro(constApiPlanificacion.PEspecificoObtenerPorNombreAutocomplete, {
        valor: value,
      })
      .subscribe({
        next: (response) => {
          this.dataPEspecificoAutocomplete = response.body;
        },
      });
    }
  }

  obtenerAlumnoAutocomplete(value:string) {
    console.log(value);
    if(value.length >= 4){
    this.integraService
      .obtenerPorFiltro(constApiGlobal.AlumnoObtenerAlumnoAutocomplete, {
        valor: value,
      })
      .subscribe({
        next: (response) => {
          this.dataAlumnoAutocomplete = response.body;
        },
      });
    }
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
          this.dataCodigoMatriculacomplete = response.body;
        },
      });
    }
  }

  generarReporte(){
    if (this.formFiltro.valid) {
      this.gridReporteControlTareaAlumno.loading = true;
      this.btnBuscarDisabled = true;
      const dataForm: IFormFiltro = this.formFiltro.getRawValue();
      const filtro = {
        estadoTarea: dataForm.estadoTarea,
        idsProgramasEspecificos: dataForm.idsProgramasEspecificos,
        idMatriculaCabecera: dataForm.idMatriculaCabecera,
        idsAlumnos: dataForm.idsAlumnos,
        fechaInicio: datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd'),
        fechaFin: datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd'),
      };
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.ReporteControlTareaAlumnoGenerarReporteControlTareaAlumno,
          JSON.stringify(filtro)
        )
        .subscribe({
          next: (resp: HttpResponse<IReporteControlTareaAlumnoFiltro[]>) => {
            this.calcularDiasTranscurridos(resp.body)
            this.gridReporteControlTareaAlumno.data = resp.body;
            this.gridReporteControlTareaAlumno.loading = false;
            this.btnBuscarDisabled = false;
            if (resp.body.length)
              this.alertaService.notificationSuccessBotom("Reporte generado exitosamente.");
            else
              this.alertaService.notificationSuccessBotom("Reporte sin datos.");
          },
          error: (error) => {
            this.btnBuscarDisabled = false;
            this.gridReporteControlTareaAlumno.loading = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            if (mensaje) this.alertaService.notificationWarning(mensaje);
          },
      });
    } else {
      this.formFiltro.markAllAsTouched()
      Swal.fire('¡ERROR!', 'Filtro de fecha incorrecto.', 'warning');
    }
  }

  validacionFecha(fecha: Date){
    if(fecha)
      return datePipeTransform(fecha, 'dd-MM-yyyy')
    else
      return 'no existe'
   }

  calcularDiasTranscurridos(datos: IReporteControlTareaAlumnoFiltro[]){
    const listaFinal: IReporteControlTareaAlumnoFiltro[] = [];
    datos.forEach((d) => {
      if (this.estado == true) {
        if (d.fechaCalificacion != null) {
          let diffTiempo = Math.abs(new Date(d.fechaEnvio).getTime() - new Date(d.fechaCalificacion).getTime());
          let diffDias= Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
          d.diasTranscurridos = diffDias;
          listaFinal.push(d);
        }
      } else if (this.estado == false) {
        if (d.fechaCalificacion == null) {
          d.fechaCalificacion = '-';
          d.horaCalificacion = null;
          let diffTiempo = Math.abs(new Date(d.fechaEnvio).getTime() - new Date().getTime());
          let diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
          d.diasTranscurridos = diffDias;
          listaFinal.push(d);
        }
      } else {
        if (d.fechaCalificacion != null) {
          let diffTiempo = Math.abs(new Date(d.fechaEnvio).getTime() - new Date(d.fechaCalificacion).getTime());
          let diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
          d.diasTranscurridos = diffDias;
          listaFinal.push(d);
        }
        if (d.fechaCalificacion == null) {
          d.fechaCalificacion = null;
          d.horaCalificacion = null;
          let diffTiempo = Math.abs(new Date(d.fechaEnvio).getTime() - new Date().getTime());
          let diffDias = Math.ceil(diffTiempo / (1000 * 60 * 60 * 24));
          d.diasTranscurridos = diffDias;
          listaFinal.push(d);
        }
      }
    });
  }

  cerrarModal() {
    this.modalService.dismissAll();
  }
  
  dataItemTemp: IReporteControlTareaAlumnoFiltro
  abrirModalReasignacion(content: any, dataItem: IReporteControlTareaAlumnoFiltro) {
    this.formReasigancion.reset();
    this.dataItemTemp = dataItem;
    console.log("content", content);
    console.log("dataItem", dataItem);
    this.formReasigancion.get('alumno').setValue(dataItem.alumno);
    this.formReasigancion.get('curso').setValue(dataItem.curso);
    this.modalService.open(content, { size: 'lg', backdrop: 'static' });
  }

  reasignarDocente(){
    this.gridReporteControlTareaAlumno.loading = true;
    this.btnBuscarDisabled = true;
    const dataForm: IFormReasignar = this.formReasigancion.getRawValue();
    const filtro: {id: number, idProveedor: number} = {
      id: this.dataItemTemp.id,
      idProveedor: dataForm.proveedor,
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ReporteControlTareaAlumnoActualizarPersonaCalificacionControlTareaAlumno,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<{reasignar: any}>) => {
          this.gridReporteControlTareaAlumno.loading = false;
          this.btnReasignarDisabled = false;
          this.generarReporte();
          this.alertaService.notificationSuccessBotom("Reasignación exitosa.");
          this.cerrarModal();
          this.btnBuscarDisabled = false;
        },
        error: (error) => {
          this.btnReasignarDisabled = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }
}

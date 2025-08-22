import { PersonalAsignado } from './../../../comercial/models/interfaces/icontactabilidad';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { HttpResponse } from '@angular/common/http';
import { constApiPlanificacion } from '@environments/constApi';
import {
  DropDownFilterSettings,
  VirtualizationSettings,
} from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { IReporteProblemasAulaVirtualFiltro } from '@planificacion/models/interfaces/ireportes';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
interface ReporteConsultasForoAulaVirtual {
  idForoCurso: number;
  centroCosto: string;
  programa: string;
  curso: string;
  docente: string;
  coordinadorDocente: string;
  codigoMatricula: string;
  alumno: string;
  tema: string;
  consulta: string;
  fechaConsulta: string;
  horaConsulta: string;
  respuesta: string;
  fechaRespuesta: string;
  horaRespuesta: string;
  usuarioRespuesta: string;
  estadoAtendido: string;
  estadoCerrado: string;
  nombreCoordinadora: string;
}

interface IRespAsignacionDocente{
  docente: String,
  idDocente: number,
  idPersonalAsignado: number,
  personalAsignado: string
}
interface ICombo {
  programa: IComboBase1[];
  docente: IComboBase1[];
  curso: IComboBase1[];
}
interface IFormFiltro {
  idsProgramas: number[];
  idsCursos: number[];
  idsDocentes: number[];
  idEstado: number;
  fechaInicio: Date;
  fechaFin: Date;
}
interface IForosCorreoDTO {
  idForo: number;
  usuario: string;
  idProveedor: number;
  codigoMatricula: string;
  curso: string;
  titulo: string;
  contenido: string;
  fechaCreacion: string;
}
/**
 * @module PlanificacionModule
 * @description Componente del Reporte de Consultas en el foro  del Aula Virtual
 * @author Gretel Danitza Canasa Condori
 * @version 1.0.0
 * @history
   23/04/2023 Implementacion del Reporte Consultas en el foro del Aula Virtual
   23/04/2023 Creacion de Grilla
 */
@Component({
  selector: 'app-consulta-foro-aula-virtual',
  templateUrl: './consulta-foro-aula-virtual.component.html',
  styleUrls: ['./consulta-foro-aula-virtual.component.scss'],
})
export class ConsultaForoAulaVirtualComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    this.allData = this.allData.bind(this);
  }

  dataProgramas: IComboBase1[] = [];
  dataDocentes: IComboBase1[] = [];
  dataCursos: IComboBase1[] = [];
  dataEstado: IComboBase1[] = [];

  gridReporteConsultaForoAulaVirtual: KendoGrid = new KendoGrid();
  modalRef: any;
  loaderModal: boolean = false;

  formFiltro: FormGroup = this.formBuilder.group({
    idsProgramas: [[]],
    idsCursos: [[]],
    idsDocentes: [[]],
    idEstado: null,
    fechaInicio: [new Date()],
    fechaFin: [new Date()],
  });

  dataItemTemp: any;

  formAsignarDocente: FormGroup = this.formBuilder.group({
    idForoCurso: null,
    alumno: '',
    programa: '',
    idDocente: null,

    codigoMatricula: '',
    curso: '',
    titulo: '',
    contenido: '',
    fechaCreacion: '',
  });

  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };

  get obtenerFechaActual() {
    return new Date();
  }

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
      data: this.gridReporteConsultaForoAulaVirtual.data,
    };
    return result;
  }

  ngOnInit(): void {
    console.log(this.formFiltro);
    this.dataCursos = [];
    this.dataDocentes = [];
    this.dataProgramas = [];
    this.obtenerCombos();
    this.dataEstado = [
      { id: null, nombre: 'Todos' },
      { id: 0, nombre: 'Pendiente' },
      { id: 1, nombre: 'Atendido' },
    ];
  }

  ngOnDestroy(): void {}

  obtenerCombos() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.ReporteConsultasForoAulaVirtualObtenerCombo}`
      )
      .subscribe({
        next: (resp: HttpResponse<ICombo>) => {
          console.log('resp', resp.body);
          this.dataProgramas = resp.body.programa;
          this.dataDocentes = resp.body.docente;
          this.dataCursos = resp.body.curso;
          console.log(this.dataDocentes);
          console.log('resp cursos', resp.body.curso);
          console.log('DATAA: ', this.dataCursos);
        },
      });
  }

  generarReporte() {
    this.gridReporteConsultaForoAulaVirtual.loading = true;
    this.btnBuscarDisabled = true;
    const dataForm: IFormFiltro = this.formFiltro.getRawValue();
    const filtro = {
      Programa: dataForm.idsProgramas,
      Docente: dataForm.idsDocentes,
      Curso: dataForm.idsCursos,
      EstadoConsulta: dataForm.idEstado,
      FechaInicial: datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd'),
      fechaFin: datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd'),
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ReporteConsultasForoAulaVirtualGenerarReporteConsultasForo,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<ReporteConsultasForoAulaVirtual[]>) => {
          this.gridReporteConsultaForoAulaVirtual.data = resp.body;
          this.gridReporteConsultaForoAulaVirtual.loading = false;
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
          this.gridReporteConsultaForoAulaVirtual.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerDiasTrancurridos(dataItem: any) {
    let startDate: Date = null;
    let endDate: Date = null;

    if (dataItem.estadoAtendido == 'Atendido') {
      startDate = new Date(dataItem.fechaConsulta);
      endDate = new Date(dataItem.fechaRespuesta);
    }
    if (dataItem.estadoAtendido == 'Pendiente') {
      startDate = new Date(dataItem.fechaConsulta);
      endDate = new Date();
      endDate.setDate(endDate.getDate() - 1);
      endDate.setHours(19, 0, 0, 0);
    }
    if (startDate != null && endDate != null) {
      const timeDifferenceMs = endDate.getTime() - startDate.getTime();
      // Convert milliseconds to days
      const differenceInDays = timeDifferenceMs / (1000 * 60 * 60 * 24);
      return differenceInDays;
    } else return ' ';
  }

  abrirModalAsignarDocente(context: any, dataItem?: any) {
    this.formAsignarDocente.reset();
    this.formAsignarDocente.get('idForoCurso').setValue(dataItem.idForoCurso);
    this.formAsignarDocente.get('alumno').setValue(dataItem.alumno);
    this.formAsignarDocente.get('programa').setValue(dataItem.programa);

    this.formAsignarDocente.get('codigoMatricula').setValue(dataItem.codigoMatricula);
    this.formAsignarDocente.get('curso').setValue(dataItem.curso);
    this.formAsignarDocente.get('titulo').setValue(dataItem.tema);
    if(dataItem.respuesta != null){
      this.formAsignarDocente.get('contenido').setValue(dataItem.respuesta);
      this.formAsignarDocente.get('fechaCreacion').setValue(dataItem.fechaRespuesta);
    }
    else {
      this.formAsignarDocente.get('contenido').setValue(dataItem.consulta);
      this.formAsignarDocente.get('fechaCreacion').setValue(dataItem.fechaConsulta);
    }

    this.modalRef = this.modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  actualizarAperturaForo(_idForo: number, _estadoForo: boolean) {
    var mensaje: string;
    if (_estadoForo == true) {
      mensaje = 'cerrar';
    } else {
      mensaje = 'abrir';
    }
    console.log('grilla', this.gridReporteConsultaForoAulaVirtual.data);

    this.alertaService
      .warningMessageOptions('¿Desea ' + mensaje + ' el foro seleccionado?', '')
      .then((result) => {
        if (result.isConfirmed) {
          this.loaderModal = true;
          const DataEnvio = {
            idForo: _idForo,
            estadoForo: _estadoForo,
          };

          this.integraService
            .putJsonResponse(
              constApiPlanificacion.ReporteConsultasForoAulaVirtualActualizarAperturaForo,
              JSON.stringify(DataEnvio)
            )
            .subscribe({
              next: (resp: HttpResponse<any>) => {
                this.loaderModal = false;
                if (resp.body)
                  this.alertaService.notificationSuccessBotom(
                    'Se actualizo el foro correctamente!.'
                  );
                //this.modalRef.close();
                this.generarReporte();
              },
              error: (error) => {
                this.loaderModal = false;
                let mensaje = this.alertaService.getMessageErrorService(error);
                if (mensaje) this.alertaService.notificationWarning(mensaje);
              },
            });
        }
      });
  }

  actualizarEstadoAtencionForo(_idForo: number, _estadoForo: boolean) {
    this.alertaService
      .warningMessageOptions(
        '¿Desea cambiar de estado del foro seleccionado?',
        ''
      )
      .then((result) => {
        if (result.isConfirmed) {
          this.loaderModal = true;
          const DataEnvio = {
            idForo: _idForo,
            estadoAtendido: _estadoForo,
          };

          this.integraService
            .putJsonResponse(
              constApiPlanificacion.ReporteConsultasForoAulaVirtualActualizarEstadoAtencionForo,
              JSON.stringify(DataEnvio)
            )
            .subscribe({
              next: (resp: HttpResponse<any>) => {
                this.loaderModal = false;
                if (resp.body)
                  this.alertaService.notificationSuccessBotom(
                    'Se actualizo el foro correctamente!.'
                  );
                //this.modalRef.close();
                this.generarReporte();
              },
              error: (error) => {
                this.loaderModal = false;
                let mensaje = this.alertaService.getMessageErrorService(error);
                if (mensaje) this.alertaService.notificationWarning(mensaje);
              },
            });
        }
      });
  }

  asignarDocente() {
    this.loaderModal = true;
    const DataEnvio = {
      IdProveedor: this.formAsignarDocente.get('idDocente').value,
      IdForo: this.formAsignarDocente.get('idForoCurso').value,
    };


    this.integraService
      .putJsonResponse(
        constApiPlanificacion.ReporteConsultasForoAulaVirtualActualizarPersonaRevisionForo,
        JSON.stringify(DataEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<IRespAsignacionDocente>) => {
          this.loaderModal = false;

          if (resp.body){
            this.alertaService.notificationSuccessBotom(
              'El Docente se asigno correctamente!.'
            );
  //          console.log("Asig doc", resp.body);
  //          console.log("Asig doc",resp.body.docente);
          }

            this.envioCorreoAsignacionForoDocente();
            this.generarReporte()

          this.modalRef.close();
        },
        error: (error) => {
          this.loaderModal = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  eliminar(id: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.loaderModal = true;
        this.integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.ReporteConsultasForoAulaVirtualEliminarForo}/${id}`
          )
          .subscribe({
            next: (resp: HttpResponse<boolean>) => {
              console.log(resp.body);
              this.loaderModal = false;
              if (resp.body) {
                this.alertaService.mensajeIcon(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success'
                );
                this.generarReporte();
              }
            },
            error: (error) => {
              console.log(error);
              this.loaderModal = false;
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }

  envioCorreoAsignacionForoDocente() {
    this.loaderModal = true;
    const DataEnvio = {
      idForo: this.formAsignarDocente.get('idForoCurso').value,
      usuario: '',
      idProveedor: this.formAsignarDocente.get('idDocente').value,
      codigoMatricula: this.formAsignarDocente.get('codigoMatricula').value,
      curso: this.formAsignarDocente.get('curso').value,
      titulo: this.formAsignarDocente.get('titulo').value,
      contenido: this.formAsignarDocente.get('contenido').value,
      fechaCreacion: this.formAsignarDocente.get('fechaCreacion').value
    };

    this.integraService
      .postJsonResponse(
        constApiPlanificacion.ReporteConsultasForoAulaVirtualEnvioCorreoAsignacionForoDocente,
        JSON.stringify(DataEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          this.loaderModal = false;
          if (resp.body)
            this.alertaService.notificationSuccessBotom('Se envio correo!.');
        },
        error: (error) => {
          this.loaderModal = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }
}

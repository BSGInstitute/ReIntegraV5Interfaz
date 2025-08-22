import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  constApi,
  constApiFinanzas,
  constApiGlobal,
} from '@environments/constApi';
import {
  ControlDocEnviar,
  ControlDocumentos,
  ControlEstado,
} from '@integra/models/control-documentos';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CellClickEvent,
  CellCloseEvent,
  EditService,
} from '@progress/kendo-angular-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';

enum CheckBoxType {
  coordinadorC,
  asesorC,
  centroCostoC,
  alumnoC,
  matriculaC,
  NONE,
}

@Component({
  selector: 'app-control-documentos',
  templateUrl: './control-documentos.component.html',
  styleUrls: ['./control-documentos.component.scss'],
})
export class ControlDocumentosComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private FinanzasService: FinanzasServiceService
  ) {}

  ngOnInit(): void {
    this.ObtenerCoordinador();
    this.ObtenerAsesor();
    this.ObtenerCriterioCalificacion();
  }

  displayedColumns: string[] = ['estado', 'nombre'];

  //---------Variables--------------//

  TablaDocs: any;
  loading: boolean = false;
  coordinador = new FormControl([]);
  itemCoordinador: any;
  asesor = new FormControl([]);
  itemAsesor: any;
  centroCostos = new FormControl([]);
  itemCentroCostos: any;
  alumno = new FormControl([]);
  itemAlumno: any;
  matricula = new FormControl([]);
  itemMatricula: any;
  estado = new FormControl(null);
  estadoNombre: any;
  listaCoordinador: any;
  listaAsesor: any;
  listaCentroCostos: any;
  listaAlumno: any;
  listaMatricula: any;
  listaCriterioCalificacion: any;
  listaDocumentosPorMatricula: any;
  columTemp: any;
  check: boolean = true;
  guardarResponse: any;
  evento: any;
  loaderDocs=false

  listaEstado = [
    { id: 0, nombre: 'Todos' },
    { id: 1, nombre: 'Por Matricular' },
    { id: 2, nombre: 'Matriculado' },
  ];

  jsonEnvio: ControlDocumentos = {
    idAsesor: 0,
    idCoordinador: 0,
    idPEspecifico: 0,
    idAlumno: 0,
    idMatriculaCabecera: 0,
    estado: 0,
  };

  jsonActualizar: ControlDocEnviar = {
    idControlDocAlumno: 0,
    idCriterioCalificacion: 0,
    quienEntrego: '',
    fechaEntregaDocumento: '',
    observaciones: '',
    idMatriculaCabecera: 0,
    nombreUsuario: '',
  };

  //--------------Obtener Datos ---------------//

  ObtenerCoordinador() {
    this.integraService
      .obtenerTodo(constApiFinanzas.ObtenerCoordinadorPorApellidos)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response);
          this.listaCoordinador = response.body;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerAsesor() {
    this.integraService
      .obtenerTodo(constApiFinanzas.ObtenerAsesorPorApellidos)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response);
          this.listaAsesor = response.body;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerCentroCostos(centro: string) {
    this.integraService
      .obtenerPorFiltro(constApiFinanzas.ObtenerPEspecificoPorCentroCosto, {
        filtro: centro,
      })
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response);
          this.listaCentroCostos = response.body;
          this.itemCentroCostos = this.listaCentroCostos;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerAlumno(alumno: string) {
    this.integraService
      .obtenerPorFiltro(constApiFinanzas.ObtenerAlumnoPorValor, {
        valor: alumno,
      })
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response);
          this.listaAlumno = response.body;
          this.itemAlumno = this.listaAlumno;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerMatricula(matricula: string) {
    this.integraService
      .obtenerPorFiltro(constApiFinanzas.MatriculaCabeceraCombo, {
        valor: matricula,
      })
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response);
          this.listaMatricula = response.body;
          this.itemMatricula = this.listaMatricula;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerCriterioCalificacion() {
    this.integraService
      .obtenerTodo(constApiFinanzas.CriterioCalificacionObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response);
          this.listaCriterioCalificacion = response.body;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  //-----------Filtrar----------------//

  Coordinador(event: any) {
    if (event.length < 3) this.itemCoordinador = this.listaCoordinador;
    if (event.length > 3) {
      this.itemCoordinador = this.listaCoordinador.filter(
        (s: any) =>
          s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1
      );
    }
    console.log(event);
    console.log(this.itemCoordinador);
    console.log(this.coordinador);
  }

  Asesor(event: any) {
    if (event.length < 3) this.itemAsesor = this.listaAsesor;
    if (event.length > 3) {
      this.itemAsesor = this.listaAsesor.filter(
        (s: any) =>
          s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1
      );
    }
  }

  CentroCostos(event: any) {
    console.log(event);
    event = event.trim();
    if (event.length >= 4) this.ObtenerCentroCostos(event);
    else this.itemCentroCostos = [];
  }

  Alumno(event: any) {
    console.log(event);
    event = event.trim();
    if (event.length >= 4) this.ObtenerAlumno(event);
    else this.itemAlumno = [];
    console.log(this.alumno);
  }

  Matricula(event: any) {
    console.log(event);

    event = event.trim();
    if (event.length >= 4) this.ObtenerMatricula(event);
    else this.itemMatricula = [];
  }

  //-------------Funciones basicas ------------//

  //------------------------//

  gridEventsResponse(event: any) {
    console.log(event);
    this.listaDocumentosPorMatricula = [];
    this.evento = event;
    this.integraService
      .obtenerTodo(
        constApiFinanzas.ObtenerDocumentosPorMatricula +
          '/' +
          this.evento.dataItem.idMatriculaCabecera
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          console.log(response);
          this.listaDocumentosPorMatricula = response.body;
          this.listaDocumentosPorMatricula.forEach((e: any) => {
            if(e.recepcionado == null || e.recepcionado==false ){
            e.cheks = false;
          } else {
            e.cheks = true;
          }
          });
          event.dataItem.listaDocumentosPorMatricula =
            this.listaDocumentosPorMatricula;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  prueba(avent: any) {
    console.log(avent);
  }

  pruebita(dataItem: any) {
    console.log(dataItem);
    var event: { dataItem: any } = { dataItem: {} };
    event.dataItem = dataItem;
    this.gridEventsResponse(event);
  }

  limpiar() {
    this.jsonEnvio.idAsesor = undefined;
    this.jsonEnvio.idCoordinador = undefined;
    this.jsonEnvio.idPEspecifico = undefined;
    this.jsonEnvio.idAlumno = undefined;
    this.jsonEnvio.idMatriculaCabecera = undefined;
  }

  Buscar() {
    this.limpiar();
    console.log(this.coordinador);
    console.log(this.jsonEnvio);

    this.jsonEnvio.idAsesor =
      this.asesor.value == undefined ||
      this.asesor.value.id == undefined ||
      this.asesor.value.id == null
        ? 0
        : this.asesor.value.id;
    this.jsonEnvio.idCoordinador =
      this.coordinador.value == undefined ||
      this.coordinador.value.id == undefined ||
      this.coordinador.value.id == null
        ? 0
        : this.coordinador.value.id;
    this.jsonEnvio.idPEspecifico =
      this.centroCostos.value == undefined ||
      this.centroCostos.value.idPEspecifico == undefined ||
      this.centroCostos.value.idPEspecifico == null
        ? 0
        : this.centroCostos.value.idPEspecifico;
    this.jsonEnvio.idAlumno =
      this.alumno.value == undefined ||
      this.alumno.value.id == undefined ||
      this.alumno.value.id == null
        ? 0
        : this.alumno.value.id;
    this.jsonEnvio.idMatriculaCabecera =
      this.matricula.value == undefined ||
      this.matricula.value.id == undefined ||
      this.matricula.value.id == null
        ? 0
        : this.matricula.value.id;

    if (this.estadoNombre != undefined) {
      this.jsonEnvio.estado = this.estadoNombre.id;
    } else {
      this.jsonEnvio.estado = -1;
    }

    if (
      this.jsonEnvio.idAsesor == 0 &&
      this.jsonEnvio.idCoordinador == 0 &&
      this.jsonEnvio.idPEspecifico == 0 &&
      this.jsonEnvio.idAlumno == 0 &&
      this.jsonEnvio.idMatriculaCabecera == 0
    ) {
      this.alertaService.mensajeIcon(
        'Error',
        'Por favor seleccione un estado',
        'error'
      );
    } else {
      if (this.jsonEnvio.estado == -1 || this.estadoNombre.id == null) {
        this.alertaService.mensajeIcon(
          'Error',
          'Por favor seleccione un campo de busqueda',
          'error'
        );
      } else {
        this.loading = true;
        console.log(this.jsonEnvio);
        this.integraService
          .obtenerPorFiltro(
            constApiFinanzas.ObtenerDocumentosFiltrado,
            this.jsonEnvio
          )
          .subscribe({
            next: (response: HttpResponse<any[]>) => {
              console.log(response);
              this.TablaDocs = response.body;
            },
            error: (error) => {
              this.mostrarMensajeError(error);
              this.loading = false;
            },
            complete: () => {
              this.loading = false;
            },
          });
      }
    }
  }
  Guardar(d: any) {
    Swal.fire({
      title: '¿Está seguro que quieres guardar los cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Continuar!',
    }).then((result) => {
      if (result.isConfirmed)
      { 
        d.fechaEntregaDocumento = datePipeTransform(
          d.fechaEntregaDocumento,
          'yyyy-MM-dd' + 'T' + 'HH:mm:ss',
          'en-US'
        );
    
        this.jsonActualizar.idControlDocAlumno = d.idControlDocAlumno;
        this.jsonActualizar.idCriterioCalificacion = typeof d.idCriterioCalificacion!=="number"?0:d.idCriterioCalificacion;
        this.jsonActualizar.fechaEntregaDocumento = d.fechaEntregaDocumento;
        this.jsonActualizar.idMatriculaCabecera = d.idMatriculaCabecera;
        this.jsonActualizar.observaciones = d.observaciones;
        this.jsonActualizar.quienEntrego = d.quienEntrego;
    
        console.log(this.jsonActualizar);
        this.loaderDocs=true
        this.integraService
          .postJsonResponse(
            constApiFinanzas.ActualizarControlDocumentoAlumno,
            this.jsonActualizar
          )
          .subscribe({
            next: (response: HttpResponse<any[]>) => {
              this.loaderDocs=false
              Swal.fire(
                "!Operación Exitosa¡",
                "Los cambios se guardaron exitosamente!",
                "success"
              )
            },
            error: (error) => {
              this.loaderDocs=false
              this.FinanzasService.MensajeDeError(error,"Guardar cambios control documento");
            },
            complete: () => {
            },
          });
      }
    });
    
  }

  SeleccionEstado(event: any) {
    console.log(event);
    this.estadoNombre = event;
  }

  /// Otras FUnciones --------------------------------------------------------------
  mostrarMensajeError(error: any): void {
    Swal.fire({
      icon: 'error',
      html: `<p class=text-start>${error.error}</p>
              <p class=text-start text-danger fs-6>${error.message}</p>`,
      allowOutsideClick: false,
    });
  }

  //------------ Prueba Input ----------------------//

  check_box_type = CheckBoxType;

  currentlyChecked: CheckBoxType;

  disCord: boolean = true;
  disAse: boolean = true;
  disCen: boolean = true;
  disAlu: boolean = true;
  disMat: boolean = true;

  selectCheckBox(targetType: CheckBoxType) {
    this.coordinador.reset();
    this.asesor.reset();
    this.centroCostos.reset();
    this.alumno.reset();
    this.matricula.reset();

    this.disCord = true;
    this.disAse = true;
    this.disCen = true;
    this.disAlu = true;
    this.disMat = true;

    // If the checkbox was already checked, clear the currentlyChecked variable
    if (this.currentlyChecked === targetType) {
      this.currentlyChecked = CheckBoxType.NONE;
    }

    if (targetType == CheckBoxType.coordinadorC) {
      this.disCord = false;
    }
    if (targetType == CheckBoxType.asesorC) {
      this.disAse = false;
    }
    if (targetType == CheckBoxType.centroCostoC) {
      this.disCen = false;
    }
    if (targetType == CheckBoxType.alumnoC) {
      this.disAlu = false;
    }
    if (targetType == CheckBoxType.matriculaC) {
      this.disMat = false;
    }

    this.currentlyChecked = targetType;
  }

  //--------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------
  fechaTemplate(
    fechaEntregaDocumento: any,
    withTime?: boolean // obtiene la fechaEntregaDocumento formateada para el mostrado en la grilla
  ) {
    if (withTime) {
      if (typeof fechaEntregaDocumento == 'string') {
        return datePipeTransform(
          new Date(fechaEntregaDocumento),
          'dd-MM-yyyy HH:mm',
          'en-US'
        );
      } else if (
        fechaEntregaDocumento != null ||
        fechaEntregaDocumento != undefined
      ) {
        return datePipeTransform(
          fechaEntregaDocumento,
          'dd-MM-yyyy HH:mm',
          'en-US'
        );
      }
    } else if (typeof fechaEntregaDocumento == 'string') {
      return datePipeTransform(
        new Date(fechaEntregaDocumento),
        'dd-MM-yyyy',
        'en-US'
      );
    } else if (
      fechaEntregaDocumento != null ||
      fechaEntregaDocumento != undefined
    ) {
      return datePipeTransform(fechaEntregaDocumento, 'dd-MM-yyyy', 'en-US');
    } else return fechaEntregaDocumento;
  }

  criterioCalificacionTemplate(idCriterioCalificacion: any) {
    if (typeof idCriterioCalificacion == 'number') {
      return this.listaCriterioCalificacion.find(
        (e: any) => e.id == idCriterioCalificacion
      ).nombre;
    } else return idCriterioCalificacion;
  }

  //------------------------------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ,Grilla editable Cronograma Actual ------------------------------------------------------------------

  cellClickHandler({
    //click en la celda abrir editor
    sender,
    rowIndex,
    column,
    columnIndex,
    dataItem,
    isEdited,
  }: CellClickEvent): void {
    if (!isEdited && !this.isReadOnly(column.field)) {
      this.columTemp = column.field;
      sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
    }
  }

  cellCloseHandler(args: CellCloseEvent): void {
    console.log('hola LP');
    //evento cuando se cierra la celda
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
      // hace que la celda no se cierre mientras no sea valido.
      args.preventDefault();
    } else if (formGroup.dirty) {
      this.assignValues(dataItem, formGroup.value);
    }
  }
  isReadOnly(field: string): boolean {
    //fields de solo lectura
    const readOnlyColumns = [
      'estadoMatricula',
      'codigoMatricula',
      'nombreAlumno',
      'mes',
      'pagoAcumuladoCronogramaFinal',
      'nombreCoordinador',
      'nombreAsesor',
      'fechaPrimerPagoCronogramaFinal',
    ];
    return readOnlyColumns.indexOf(field) > -1;
  }
  createFormGroup(dataItem: any): FormGroup {
    // form group para las celdas editables
    return this.formBuilder.group({
      idCriterioCalificacion: [dataItem.idCriterioCalificacion],
      quienEntrego: [dataItem.quienEntrego],
      fechaEntregaDocumento: [
        typeof dataItem.fechaEntregaDocumento == 'string' &&
        dataItem.fechaEntregaDocumento.length > 1
          ? new Date(dataItem.fechaEntregaDocumento)
          : dataItem.fechaEntregaDocumento,
      ],
      observaciones: [dataItem.observaciones],
    });
  }
  assignValues(target: any, source: any): void {
    //asignar valores modificados
    Object.assign(target, source);
  }
  //------------------------------------------------------------------------------------------------------

}

import { HttpClient,HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiGestionPersonal } from '@environments/constApi';
import Swal from 'sweetalert2';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { PreguntaEvaluacion, RespuestaPregunta ,ComboTipoPregunta, ExamenDVTO, examenPregunta, intentoPregunta, RespuestaApi} from '@gestionPersonas/models/preguntaEvaluacion';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { SelectEvent } from '@progress/kendo-angular-upload';


interface PreguntaEvaluacionEnvio{
  Pregunta: PreguntaEvaluacion,
  RespuestaPregunta: RespuestaPregunta[],
  Examen: examenPregunta,
  PreguntaIntento?: intentoPregunta 
}
@Component({
  selector: 'app-preguntas-evaluacion',
  templateUrl: './preguntas-evaluacion.component.html',
  styleUrls: ['./preguntas-evaluacion.component.scss']
})
export class PreguntasEvaluacionComponent implements OnInit {

  constructor(private _integraService: IntegraService,
      private _alertaService: AlertaService,
      private _formBuilder: FormBuilder,
      private _modalService: NgbModal,
      private http: HttpClient) { }
  
  ngOnInit(): void {

    this.obtener();
    this.obtenerCombos();
    this.obtenerComboTipoRespuesta();
    this.obtenerExamen();
    this.obtenerTipoRespuestaCategoria();
    this.configurarRespuestasGrid();
  
  }
  DataCategoriaPregunta: IComboBase1[] = [];
  DataTipoRespuestaCategoria: IComboBase1[] = [];
  DataTipoPregunta: ComboTipoPregunta[] = [];
  DataExamen: ExamenDVTO[] = [];
  listaId2: any[] = [];
  listaId1: any[] = [];
  gridPregunta: KendoGrid = new KendoGrid();
  gridRespuestaPregunta: KendoGrid = new KendoGrid();
  gridData: any[] = [];
  enProcesoSolicitud: boolean = false;
  modalRespuesta:boolean = false;
  modalRef: NgbModalRef = null;
  modalRefImportar: NgbModalRef = null;
  isNew: boolean = false;
  dataItemTemp: PreguntaEvaluacion;
  archivoImportado = new FormControl(null);
  pageSizes: (number | PageSizeItem)[] = [
      { text: '5', value: 5 },
      { text: '10', value: 10 },
      { text: '20', value: 20 },
      { text: 'All', value: 'all' },
    ];

    tipoSeleccionado : string = "automatica"

    formPregunta: FormGroup = this._formBuilder.group({
    tipoCalificacion: ['automatica'],   // radio
      //TAB CATEGORIA
    id:0,
    idPreguntaCategoria: [null,[Validators.required]],
    //TAB GENERAL
    listaExamen: [[]],
    idTipoRespuesta: [null,[Validators.required]],
    //TAB PREGUNTA
    enunciado: ['',[Validators.required]],
    idTipoRespuestaCalificacion: [null,[Validators.required]],
    factorRespuesta: [0],
    minutosPorPregunta: [0],
    respuestaAleatoria: false,
    //TAB FEEDBACK
    activarFeedBackRespuestaCorrecta: [false],
    activarFeedBackRespuestaIncorrecta: false,
    mostrarFeedbackInmediato: [false],
    mostrarFeedbackPorPregunta: [false],
    //TAB INTENTOS
    numeroMaximoIntento: [0],
    activarFeedbackMaximoIntento: [false],
    mensajeFeedback: [''],   
    });


onChangeTipo(tipo: string) {
  this.tipoSeleccionado = tipo;

  if (tipo === 'automatica') {
    this.formPregunta.get('calificacionManual')?.reset();
  } else {
    this.formPregunta.get('calificacionAutomatica')?.reset();
  }
}


    obtener() {
    this.gridPregunta.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerPreguntaEvaluacion)
      .subscribe({
        next: (resp: HttpResponse<PreguntaEvaluacion[]>) => {
          this.gridPregunta.data = resp.body;
          this.gridPregunta.loading = false;
        },
        error: (error) => {
          this.gridPregunta.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

   obtenerCombos() {
      this._integraService
        .getJsonResponse(constApiGestionPersonal.ObtenerCategoriaPregunta)
        .subscribe({
          next: (resp: HttpResponse<IComboBase1[]>) => {
            this.DataCategoriaPregunta = resp.body;
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }

    obtenerExamen() {
      this._integraService
        .getJsonResponse(constApiGestionPersonal.ObtenerExamen)
        .subscribe({
          next: (resp: HttpResponse<ExamenDVTO[]>) => {
            this.DataExamen = resp.body;
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
    obtenerComboTipoRespuesta() {
      this._integraService
        .getJsonResponse(constApiGestionPersonal.ObtenerComboTipoPregunta)
        .subscribe({
          next: (resp: HttpResponse<ComboTipoPregunta[]>) => {
            this.DataTipoPregunta = resp.body;
             this.listaId2 = this.DataTipoPregunta.filter(x => x.idTipoRespuesta === 2);
  this.listaId1 = this.DataTipoPregunta.filter(x => x.idTipoRespuesta === 1);
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
    obtenerTipoRespuestaCategoria(){
      this._integraService
        .getJsonResponse(constApiGestionPersonal.ObtenerTipoRespuestaCategoria)
        .subscribe({
          next: (resp: HttpResponse<IComboBase1[]>) => {
            this.DataTipoRespuestaCategoria = resp.body;
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
  obtenerRespuestaPregunta(IdPregunta : number){
    this.gridRespuestaPregunta.loading = true;
    this._integraService
      .getJsonResponse(`${constApiGestionPersonal.ObtenerRespuestaPregunta}/${IdPregunta}`)
      .subscribe({
        next: (resp: HttpResponse<RespuestaPregunta[]>) => {
          this.gridRespuestaPregunta.data = resp.body;
          this.gridRespuestaPregunta.loading = false;
        },
        error: (error) => {
          this.gridRespuestaPregunta.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  configurarRespuestasGrid() {
      this.gridRespuestaPregunta.habilitarEstadoNewRow = true;
      this.gridRespuestaPregunta.formGroup = this._formBuilder.group({
        idPregunta: 0,
        respuestaCorrecta: false,
        nroOrden: [0,[Validators.required]],
        nroOrdenRespuesta: 0,
        enunciadoRespuesta: '',
        puntaje: 0,
        feedbackPositivo: '',
        feedbackNegativo: ''
            });
      this.gridRespuestaPregunta.cellClickEvent$.subscribe((resp) => {});
      this.gridRespuestaPregunta.cellCloseEvent$.subscribe((resp) => {
        resp.dataItem[resp.columnField] = resp.formGroup.get(
          resp.columnField
        ).value;
      });
      this.gridRespuestaPregunta.removeEvent$.subscribe((resp) => {
        this._alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.gridRespuestaPregunta.data.splice(resp.index, 1);
            this.gridRespuestaPregunta.data = [...this.gridRespuestaPregunta.data];
          }
        });
      });
      this.gridRespuestaPregunta.saveEvent$.subscribe((resp) => {
        let valorForm = resp.formGroup.getRawValue() as RespuestaPregunta;
        let item: RespuestaPregunta = {
          idPregunta: 0,
          respuestaCorrecta: !!valorForm.respuestaCorrecta,
          nroOrden: valorForm.nroOrden,
          nroOrdenRespuesta: valorForm.nroOrdenRespuesta,
          enunciadoRespuesta: valorForm.enunciadoRespuesta,
          puntaje: valorForm.puntaje,
          feedbackPositivo: valorForm.feedbackPositivo,
          feedbackNegativo: valorForm.feedbackNegativo,
        };
        this.gridRespuestaPregunta.data = [item, ...this.gridRespuestaPregunta.data];
        
      });
    }
    seleccionarAlmacenarArchivo(dataFile: SelectEvent) {
        this.archivoImportado.setValue(dataFile)
      }
    
      deseleccionarAlmacenarArchivo() {
        this.archivoImportado.setValue(null);
      }
    
    
      cargarRespuestasPregunta(idPregunta: number) {
        this._integraService
          .getJsonResponse(`${constApiGestionPersonal.ObtenerRespuestaPregunta}/${idPregunta}`)
    .subscribe((respuestas: HttpResponse<RespuestaPregunta[]>) => {
          this.gridRespuestaPregunta.data= respuestas.body; 
          this.gridRespuestaPregunta.loading= false;
    });
}
    importarExcelRespuestas(){
       this.modalRespuesta = true;
          var dataFile = new FormData();
          let archivo: File = this.archivoImportado.value.files[0].rawFile;
          dataFile.append('file', archivo)
          dataFile.append('IdPregunta', this.formPregunta.value.id); 
          this.modalRespuesta = true;
          this._integraService
            .insertarFormData2(
              constApiGestionPersonal.ObtenerRespuestaCSV,
              dataFile
            )
            .subscribe({ 
              next: (response: HttpResponse<boolean>) => {
                this.modalRespuesta = false;
                Swal.fire(
                  '¡Importado!',
                  'respuestas(s) subido(s) correctamente.',
                  'success' 
                );
                this.cargarRespuestasPregunta(this.formPregunta.value.id);
                this.modalRefImportar.close();
              },
              error: (error) => {
                this.modalRespuesta = false;
                let mensaje = this._alertaService.getMessageErrorService(error);
                this._alertaService.notificationWarning(mensaje);
              },
            });
    }


    abrirModalImportarExcel(context: any) {
      this.modalRefImportar = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
    abrirModal(context: any, isNew?: boolean, dataItem?: PreguntaEvaluacion ){
      this.formPregunta.reset();
      this.enProcesoSolicitud = false;
      if (isNew) {
        this.isNew = true;
        this.gridRespuestaPregunta.data = [];    
      } else {
        this.formPregunta.patchValue(dataItem);
        this.obtenerRespuestaPregunta(dataItem.id);
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    }
    
procesarPreguntaEvaluacion() {
    let dataFrom = this.formPregunta.getRawValue();
    let pregunta: PreguntaEvaluacion = {
    id: this.isNew ? 0 : dataFrom.id,
    //TAB CATEGORIA
    idPreguntaCategoria:dataFrom.idPreguntaCategoria,
    //TAB GENERAL
    idTipoRespuesta:dataFrom.idTipoRespuesta,
    idPreguntaTipo: Number(dataFrom.idPreguntaTipo),
    //TAB PREGUNTA
    enunciado:dataFrom.enunciado,
    idTipoRespuestaCalificacion: dataFrom.idTipoRespuestaCalificacion,
    factorRespuesta: dataFrom.factorRespuesta,
    minutosPorPregunta: dataFrom.minutosPorPregunta,
    respuestaAleatoria: !!dataFrom.respuestaAleatoria,
    //TAB FEEDBACK
    activarFeedBackRespuestaCorrecta: !!dataFrom.activarFeedbackRespuestaCorrecta,
    activarFeedBackRespuestaIncorrecta: !!dataFrom.activarFeedBackRespuestaIncorrecta,
    mostrarFeedbackInmediato: !!dataFrom.mostrarFeedbackInmediato,
    mostrarFeedbackPorPregunta: !!dataFrom.mostrarFeedbackPorPregunta,
    //TAB INTENTOS
    listaExamen:dataFrom.listaExamen
  }
    let intento: intentoPregunta = {
    numeroMaximoIntento: dataFrom.numeroMaximoIntento,
    activarFeedbackMaximoIntento:!!dataFrom.activarFeedbackMaximoIntento,
    mensajeFeedback: dataFrom.mensajeFeedback

    }
    let envio: PreguntaEvaluacionEnvio={
      
      Pregunta: pregunta,
      RespuestaPregunta: this.gridRespuestaPregunta.data,
      Examen: {
       listaExamen: dataFrom.listaExamen.filter((x: number | null) => x != null && x > 0)
      },
      PreguntaIntento: intento
    }
    
    return envio;
  }

  guardar() {
        if (this.formPregunta.valid) {
          let jsonEnvio = this.procesarPreguntaEvaluacion();
          this.gridPregunta.loading = true;
          this.enProcesoSolicitud = true;
          this._integraService
            .postJsonResponse(
              constApiGestionPersonal.InsertarPreguntaEvaluacion,
              JSON.stringify(jsonEnvio)
            )
            .subscribe({
              next: (resp: HttpResponse<boolean>) => {
                this.gridPregunta.loading = false;
                this.enProcesoSolicitud = false;
                this.gridPregunta.data.unshift(resp.body);
                this.gridPregunta.loadData();
                this.obtener();
                this.modalRef.close();
                this._alertaService.mensajeExitoso();
                
              },
              error: (error) => {
                this.gridPregunta.loading = false;
                this.enProcesoSolicitud = false;
                this._alertaService.notificationWarning(error.message);
                this._alertaService.swalFireOptions({
                  icon: 'error',
                  text: 'No se pudo guardar el Dato',
                });
              },
            });
        } else {
          this.formPregunta.markAllAsTouched();
          this.gridRespuestaPregunta.formGroup.markAllAsTouched();
          this.gridPregunta.loading = false;
          this.enProcesoSolicitud = false;
          this._alertaService.mensajeIcon(
            'Complete por favor los campos obligatorios!'
          );
        }
      }
  actualizar() {
    if (this.formPregunta.valid) {
      this.enProcesoSolicitud = true;

      const materialAccion = this.procesarPreguntaEvaluacion();

      this.gridPregunta.loading = true;
      this._integraService
        .putJsonResponse(
          constApiGestionPersonal.ActualizarPreguntaEvaluacion,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<PreguntaEvaluacion>) => {
            this.gridPregunta.loading = false;
            this.gridPregunta.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
            this.modalRef.close();
            this.obtener();
          },
          error: (error) => {
            this.gridPregunta.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formPregunta.markAllAsTouched();
      this.gridRespuestaPregunta.formGroup.markAllAsTouched();
      this.gridPregunta.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

/* ------------------------------Eliminar ----------------------------------------- */

eliminar(id: number) {
  // Usar SweetAlert para mostrar un mensaje de confirmación
  this.enProcesoSolicitud = true;
  Swal.fire({
    title: '¿Estás seguro de eliminar la pregunta?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
  }).then((result) => {
    if (result.isConfirmed) {
      let index = this.gridPregunta.data.findIndex(
        (x) => x.id === id
      );
      if (index != -1) {
      }
      this.gridPregunta.loading = true;
      this._integraService
        .deleteJsonResponse(
          `${constApiGestionPersonal.EliminarPreguntaEvaluacion}/${id}`
        )
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            this.gridPregunta.loading = false;
            if (response.body === true) {
              this.gridPregunta.data.splice(index, 1);
              this.gridPregunta.loadView();
              this._alertaService.mensajeIcon(
                '¡Eliminado!',
                'El registro ha sido eliminado.',
                'success'
              );
              this.obtener();
              this.enProcesoSolicitud = false;
            } else {
              this._alertaService.mensajeIcon(
                'Error!',
                'Ocurrió un problema al eliminar.',
                'warning'
              );
            }
          },
          error: (error) => {
            this.gridPregunta.loading = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
  });
}

}

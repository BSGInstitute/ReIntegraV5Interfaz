import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PgeneralProyectoAplicacionAnexo } from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-content-anexo-proyecto-aplicacion',
  templateUrl: './modal-content-anexo-proyecto-aplicacion.component.html',
  styleUrls: ['./modal-content-anexo-proyecto-aplicacion.component.scss'],
})
export class ModalContentAnexoProyectoAplicacionComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService
  ) {}

  @Input() pgeneralService: PgeneralService;
  @Input() pgeneralProyectoAplicacionAnexo: PgeneralProyectoAplicacionAnexo[] =
    [];
  subscriptions$: Subscription = new Subscription();
  programa: string = '';
  gridProyectoAplicacionAnexo =
    new KendoGrid<PgeneralProyectoAplicacionAnexo>();
  formRegistroAnexo: FormGroup = this._formBuilder.group({
    id: 0,
    idPgeneral: null,
    nombreArchivo: [null, Validators.required],
    esEnlace: false,
    rutaArchivo: [null, Validators.required],
    soloLectura: false,
    archivo: null,
  });

  files: any = null; //files: null;
  enlaceCreadoSubidaArchivo: string;
  myRestrictions: FileRestrictions = {
    allowedExtensions: ['.pdf'],
  };
  showRegistroAnexo: boolean = false;
  showSubirArchivo: boolean = false;
  esNuevo: boolean = true;

  ngOnInit(): void {
    this.programa = this.pgeneralService.dataItemPgeneral.nombre;
    this.obtenerListaPgeneralProyectoAplicacionAnexo();
  }
  obtenerListaPgeneralProyectoAplicacionAnexo() {
    this.gridProyectoAplicacionAnexo.loading = true;
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.PgeneralProyectoAplicacionAnexoObtenerListaPgeneralProyectoAplicacionAnexo}/${this.pgeneralService.dataItemPgeneral.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<PgeneralProyectoAplicacionAnexo[]>) => {
          this.gridProyectoAplicacionAnexo.loading = false;
          this.gridProyectoAplicacionAnexo.data = resp.body;
        },
        error: (error) => {
          this.gridProyectoAplicacionAnexo.loading = false;
          this.gridProyectoAplicacionAnexo.data = [];
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener los anexos!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
    this.subscriptions$.add(sub$);
  }
  agregarNuevoAnexo() {
    this.formRegistroAnexo.reset();
    this.showRegistroAnexo = true;
    this.showSubirArchivo = false;
  }
  guardarAnexo() {
    if (this.formRegistroAnexo.valid) {
      this.insertarAnexo();
    } else {
      this.formRegistroAnexo.markAllAsTouched();
      this._alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Complete los campos del formulario!',
      });
    }
  }
  insertarAnexo() {
    this.gridProyectoAplicacionAnexo.loading = true;

    let JsonEnvio = this.formRegistroAnexo.value;
    JsonEnvio.idPgeneral = this.pgeneralService.dataItemPgeneral.id;
    JsonEnvio.id == null ? (JsonEnvio.id = 0) : '';
    JsonEnvio.esEnlace == null ? (JsonEnvio.esEnlace = false) : '';
    JsonEnvio.soloLectura == null ? (JsonEnvio.soloLectura = false) : '';
    let sub$ = this._integraService
      .postJsonResponse(
        constApiPlanificacion.PgeneralProyectoAplicacionAnexoInsertar,
        JSON.stringify(JsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<PgeneralProyectoAplicacionAnexo>) => {
          this.gridProyectoAplicacionAnexo.loading = false;
          this.gridProyectoAplicacionAnexo.data.unshift(resp.body);
          console.log(
            'gridProyectoAplicacionAnexo',
            this.gridProyectoAplicacionAnexo.data
          );
          this.gridProyectoAplicacionAnexo.loadView();
          this._alertaService.mensajeExitoso();
          this.obtenerListaPgeneralProyectoAplicacionAnexo();
        },
        error: (error) => {
          this.gridProyectoAplicacionAnexo.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  actualizarAnexo() {
    if (this.formRegistroAnexo.valid) {
      let jsonEnvio = this.formRegistroAnexo.value;
      jsonEnvio.idPgeneral = this.pgeneralService.dataItemPgeneral.id;
      this.gridProyectoAplicacionAnexo.loading = true;
      let sub$ = this._integraService
        .postJsonResponse(
          constApiPlanificacion.PgeneralProyectoAplicacionAnexoActualizar,
          jsonEnvio
        )
        .subscribe({
          next: (resp: HttpResponse<PgeneralProyectoAplicacionAnexo>) => {
            this.gridProyectoAplicacionAnexo.loading = false;
            this.gridProyectoAplicacionAnexo.loadData();
            Swal.fire(
              '¡Actualizado!',
              'El registro ha sido actualizado correctamente.',
              'success'
            );
            this.obtenerListaPgeneralProyectoAplicacionAnexo();
            this.showRegistroAnexo = false;
            this.formRegistroAnexo.reset();
          },
          error: (error) => {
            this.gridProyectoAplicacionAnexo.loading = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formRegistroAnexo.markAllAsTouched();
    }
  }
  cancelarRegistroAnexo() {
    this.formRegistroAnexo.reset();
    this.showSubirArchivo = false;
    this.showRegistroAnexo = false;
  }
  onChangeEsEnlace(event: MatCheckboxChange) {
    this.showSubirArchivo = event.checked;
  }
  subirArchivo() {
    let archivo = this.formRegistroAnexo.get('archivo').value;
    if (archivo != null && archivo.length >= 1) {
      let formData = new FormData();
      formData.append('file', archivo[0]);
      let sub$ = this._integraService
        .postFormTextResponse(
          constApiPlanificacion.PgeneralProyectoAplicacionAnexoGuardarArchivo,
          formData
        )
        .subscribe({
          next: (resp: HttpResponse<string>) => {
            this.gridProyectoAplicacionAnexo.loading = false;
            this.enlaceCreadoSubidaArchivo = resp.body;
            this.formRegistroAnexo
              .get('rutaArchivo')
              .setValue(this.enlaceCreadoSubidaArchivo);
          },
          error: (error) => {
            this.gridProyectoAplicacionAnexo.loading = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
      this.subscriptions$.add(sub$);
    } else {
      this._alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Seleccione un Archivo!',
      });
    }
  }
  editarAnexo(dataItem: PgeneralProyectoAplicacionAnexo) {
    this.showSubirArchivo = false;
    this.showRegistroAnexo = true;
    this.esNuevo = false;
    this.formRegistroAnexo.get('id').setValue(dataItem.id);
    this.formRegistroAnexo
      .get('nombreArchivo')
      .setValue(dataItem.nombreArchivo);
    this.formRegistroAnexo.get('esEnlace').setValue(dataItem.esEnlace);
    this.formRegistroAnexo.get('rutaArchivo').setValue(dataItem.rutaArchivo);
    this.formRegistroAnexo.get('soloLectura').setValue(dataItem.soloLectura);
  }
  eliminarAnexo(dataItem: PgeneralProyectoAplicacionAnexo): void {
    Swal.fire({
      title: `¿Está seguro de eliminar el anexo ${dataItem.nombreArchivo}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
      cancelButtonText: '¡No, Cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.gridProyectoAplicacionAnexo.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.PgeneralProyectoAplicacionAnexoEliminar}/${dataItem.id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridProyectoAplicacionAnexo.loading = false;
              if (response.body == true) {
                this.gridProyectoAplicacionAnexo.data =
                  this.gridProyectoAplicacionAnexo.data.filter(
                    (x) => x.id != dataItem.id
                  );
                this._alertaService.swalFireOptions({
                  icon: 'success',
                  title: '¡El anexo ha sido eliminado correctamente!',
                });
                this.obtenerListaPgeneralProyectoAplicacionAnexo();
              } else {
                this._alertaService.swalFireOptions({
                  icon: 'info',
                  title: '¡No se pudo eliminar el anexo!',
                });
              }
            },
            error: (error) => {
              this.gridProyectoAplicacionAnexo.loading = false;
              let resp = this._alertaService.getErrorResponse(error);
              this._alertaService.swalFireOptions({
                icon: 'error',
                title: '¡Ocurrio un problema al eliminar el anexo!',
                text: `${resp.titulo}: ${resp.mensaje}`,
              });
            },
          });
      }
    });
  }
}

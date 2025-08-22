import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { IContenidoPlantilla } from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import { AlertaService } from '@shared/services/alerta.service';
import { emit } from 'process';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@shared/services/user.service';
import { truncate } from 'fs';
import { IOportunidadAgenda } from '@comercial/models/interfaces/iagenda-documento-programa';

@Component({
  selector: 'app-redaccion-correo',
  templateUrl: './redaccion-correo.component.html',
  styleUrls: ['./redaccion-correo.component.scss'],
})
export class RedaccionCorreoComponent implements OnInit, AfterViewInit {
  @Input() agendaService: AgendaOperacionesService;
  @Input() objetoRedaccionCorreo: any;
  @Input() esNuevo: boolean;
  @Input() informacionCorreo: any;
  @Output() cerraDataEvent = new EventEmitter<any>();
  @Output() formDataEvent = new EventEmitter<any>();

  @ViewChild('editor', { static: false }) editorElementRef: ElementRef;

  totalCorreos: number = 0;
  listaVersion: any = [];
  listaSubEstado: any = [];
  gridArchivosAdjuntos: any = [];
  pasteCleanupSettings = {
    convertMsLists: true,
    removeHtmlComments: true,
    removeMsClasses: true,
    removeMsStyles: true,
    removeInvalidHTML: false,
  };
  isButtonDisabled: boolean = false; // Propiedad para controlar el estado del botón


  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  formModalCorreo: FormGroup = this.formBuilder.group({
    asunto: '',
    asesor: '',
    destinatario: '',
    conCopia: '',
    versiones: [],
    estado: [],
    subestado: [],
    mensaje: '',
    adjunto: [],
    plantilla: null,
    centroCosto: null,
    destinatario2: '',
    conCopia2: '',
  });

  edicionCampos: boolean = false;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  esNuevoCorreoRedactado: boolean = true;
  dataAsesor: IOportunidadAgenda = null;

  ngOnInit(): void {
    this.cargarContenido();
    this.agendaService.agendaDocumentoProgramaOperacionesService.datosOportunidad$.subscribe(
      { next: (resp) => (this.dataAsesor = resp) });
  }
  ngAfterViewInit() {
    const editorWrapper =
      this.editorElementRef.nativeElement.querySelector('.k-editor');
    const toolbar = editorWrapper.querySelector('.k-editor-toolbar');
    const content = editorWrapper.querySelector('.k-editor-content');

    toolbar.classList.add('k-editor-toolbar-bottom');
    content.classList.add('k-editor-content');

    editorWrapper.appendChild(toolbar);
  }
  ocultar() {
    var contenido = document.getElementById('contenido');
    if (contenido.style.display === 'none') {
      contenido.style.display = 'block';
    } else {
      contenido.style.display = 'none';
    }
  }
  cargarContenido() {
    console.log('Objeto hijo: ', this.objetoRedaccionCorreo);
    this.formModalCorreo
      .get('asesor')
      ?.setValue(this.objetoRedaccionCorreo.correoEmisor);
    this.formModalCorreo
      .get('destinatario')
      ?.setValue(this.objetoRedaccionCorreo.correoDestinatario);
    this.formModalCorreo
      .get('destinatario2')
      ?.setValue(this.objetoRedaccionCorreo.correoDestinatario);
    this.edicionCampos = this.objetoRedaccionCorreo.esCoordinador;
    if (!this.esNuevo) {
      this.formModalCorreo
        .get('asunto')
        ?.setValue('RE: ' + this.informacionCorreo.asunto);
      // var emailBody =
      //   '<button class="btn botonEnvio mx-1" (click)="ocultar()">Ocultar mensaje</button> <div id="contenido">' +
      //   this.informacionCorreo.emailBody +
      //   '</div>';
      // this.formModalCorreo.get('mensaje')?.setValue(emailBody);
      this.formModalCorreo.get('mensaje')?.setValue(this.informacionCorreo.emailBody);
      this.formModalCorreo
        .get('adjunto')
        ?.setValue(this.informacionCorreo.correoDestinatario);

      // this.formModalCorreo.get('conCopia')?.setValue(this.informacionCorreo.correoDestinatario);
      // this.formModalCorreo.get('versiones')?.setValue(this.informacionCorreo.correoEmisor);
      // this.formModalCorreo.get('estado')?.setValue(this.informacionCorreo.correoDestinatario);
      // this.formModalCorreo.get('subestado')?.setValue(this.informacionCorreo.correoDestinatario);
      // this.formModalCorreo.get('mensaje')?.setValue(this.informacionCorreo.emailBody);
      // this.formModalCorreo.get('adjunto')?.setValue(this.informacionCorreo.correoDestinatario);
      // this.formModalCorreo.get('plantilla')?.setValue(this.informacionCorreo.correoDestinatario);
      // this.formModalCorreo.get('centroCosto')?.setValue(this.informacionCorreo.correoDestinatario);
      // this.formModalCorreo.get('destinatario2')?.setValue(this.informacionCorreo.correoDestinatario);
      // this.formModalCorreo.get('conCopia2')?.setValue(this.informacionCorreo.correoDestinatario);
    }
  }
  cerrarModal() {
    this.formModalCorreo.reset();
    this.cerraDataEvent.emit();
  }
  seleccionarContenidoPlantillaCorreo(idPlantilla: any) {
    if (idPlantilla === null) return;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaGenerarPlantillaMailing}/${this.objetoRedaccionCorreo.idOportunidad}/${idPlantilla}`
      )
      .subscribe({
        next: (response: HttpResponse<IContenidoPlantilla>) => {
          this.formModalCorreo.get('asunto').setValue(response.body.asunto);
          this.formModalCorreo
            .get('mensaje')
            .setValue(response.body.cuerpoHTML);
          console.log('remplazarPlantillaHistorial', response.body);
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error al obtener la plantilla de correo: ${error.error.message}`
          );
        },
      });
  }
  cargarVersionesCentroCosto(idCentroCosto: any) {
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.MontoPagoObtenerPaquetes}/${idCentroCosto}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('obtenerPaquetesMontoPago', response);
          this.listaVersion = response.body;
        },
      });
  }
  obtenerGrupoCentroCostoConVersion() {
    const listaIdVersiones = this.formModalCorreo.get('versiones').value;
    if (listaIdVersiones.length > 0) {
      const params: any = {
        idCentroCosto: this.formModalCorreo.get('centroCosto').value,
        paquete: listaIdVersiones,
        estado: [],
        subEstado: [],
      };
      this.integraService
        .postJsonResponse(
          `${constApiComercial.CorreoObtenerCorreosGrupos}`,
          params
        )
        .subscribe({
          next: (response: any) => {
            const destinatarios = response.body.errores
              ? this.objetoRedaccionCorreo.correoDestinatario
              : response.body.listaCorreos;
            this.totalCorreos = response.body.errores
              ? 0
              : response.body.totalCorreos;
            this.formModalCorreo.get('destinatario2').setValue(destinatarios);
          },
        });
    } else {
      this.totalCorreos = 0;
      this.formModalCorreo
        .get('destinatario2')
        .setValue(this.objetoRedaccionCorreo.correoDestinatario);
    }
  }
  cargarCentroCostoEstadoSubEstado(listaIdEstados: Array<number>) {
    if (listaIdEstados.length > 0) {
      let idCentroCostos = this.formModalCorreo.get('centroCosto').value;
      let listaPaquetes = this.formModalCorreo.get('versiones').value;
      let listaSubEstado = this.formModalCorreo.get('subestado').value;
      let listaEstado = listaIdEstados;
      if (idCentroCostos && listaPaquetes && listaEstado) {
        this.listaSubEstado = this.objetoRedaccionCorreo.listaSubEstado
          .map((subEstado: any) => ({
            ...subEstado,
            idEstadoMatricula:
              subEstado.idEstadoMatricula === 0
                ? 1
                : subEstado.idEstadoMatricula,
          }))
          .filter((subEstado: any) =>
            listaEstado.includes(subEstado.idEstadoMatricula)
          );

        let params = {
          idCentroCosto: idCentroCostos,
          paquete: listaPaquetes.length ? listaPaquetes : [],
          estado: listaEstado.length ? listaEstado : [],
          subEstado: listaSubEstado?.length ? listaSubEstado : [],
        };

        this.integraService
          .postJsonResponse(
            constApiComercial.CorreoObtenerCorreosGrupos,
            params
          )
          .subscribe({
            next: ({ body }) => {
              this.totalCorreos = body.errores ? 0 : body.totalCorreos;
              this.formModalCorreo
                .get('destinatario2')
                .setValue(body.errores ? null : body.listaCorreos);
            },
          });
      } else {
        this.alertaService.swal('Verificar los campos anteriores');
        this.formModalCorreo.get('estado').setValue(null);
        this.listaSubEstado = [];
      }
    } else {
      this.totalCorreos = 0;
    }
  }
  cargarCentroCostoEstadoSubEstadoIndependiente(
    listaIdSubestado: Array<number>
  ) {
    let idCentroCostos = this.formModalCorreo.get('centroCosto').value;
    let listaPaquetes = this.formModalCorreo.get('versiones').value;
    let listaEstado = this.formModalCorreo.get('estado').value;
    let listaSubEstado = listaIdSubestado;
    let params = {
      idCentroCosto: idCentroCostos,
      paquete: listaPaquetes.length ? listaPaquetes : [],
      estado: listaEstado.length ? listaEstado : [],
      subEstado: listaSubEstado.length ? listaSubEstado : [],
    };

    this.integraService
      .postJsonResponse(constApiComercial.CorreoObtenerCorreosGrupos, params)
      .subscribe({
        next: ({ body }) => {
          this.totalCorreos = body.errores ? 0 : body.totalCorreos;
          this.formModalCorreo
            .get('destinatario2')
            .setValue(body.errores ? null : body.listaCorreos);
        },
      });
  }
  cambiarArchivo(itemSeleccionado: any) {
    this.formModalCorreo.get('adjunto').setValue(itemSeleccionado.target.files);
  }
  descargarAdjunto(event: any) {}
  sendMessageApiGmail() {
    console.log('sendMessageApiGmail');
    console.log('formModalCorreo', this.formModalCorreo.value);
    this.formDataEvent.emit(this.formModalCorreo);
  }


  sendMessageAcrossMandrill(modal?: any) {
    this.isButtonDisabled = true;

    console.log("this formCorreo: ",this.formModalCorreo);
    let fdata = new FormData();
    let _asunto: string = this.formModalCorreo.get('asunto').value;
    let _mensaje: string = this.formModalCorreo.get('mensaje').value;
    let _destinatario: string = this.esNuevoCorreoRedactado
      ? this.formModalCorreo.get('destinatario2').value
      : this.agendaService.rowActual.email1;
    let _remitente: string = this.dataAsesor.email;
    let _centroCosto: number =
      this.esNuevoCorreoRedactado &&
      this.formModalCorreo.get('centroCosto').value != null
        ? this.formModalCorreo.get('centroCosto').value
        : this.agendaService.rowActual.idCentroCosto;
    fdata.append('IdActividadDetalle', String(this.agendaService.rowActual.id));
    fdata.append('Idcentrocosto', String(_centroCosto));
    fdata.append(
      'Idoportunidad',
      String(this.agendaService.rowActual.idOportunidad)
    );
    fdata.append('Remitente', _remitente);
    fdata.append('Destinatario', _destinatario);
    fdata.append('Asunto', !_asunto || _asunto == '' ? 'Sin Asunto' : _asunto);
    fdata.append(
      'Mensaje',
      window.btoa(unescape(encodeURIComponent(_mensaje)))
    );
    fdata.append(
      'DestinatarioCc',
      this.formModalCorreo.get('conCopia2').value == null
        ? ''
        : this.formModalCorreo.get('conCopia2').value
    );
    fdata.append('Usuario', this.userService.userData.userName);
    fdata.append('IdAsesor', String(this.userService.userData.idPersonal));

    if (
      this.formModalCorreo.get('adjunto').value != null &&
      this.formModalCorreo.get('adjunto').value.length > 0
    ) {
      for (
        let index = 0;
        index < this.formModalCorreo.get('adjunto').value.length;
        index++
      ) {
        fdata.append('Files', this.formModalCorreo.get('adjunto').value[index]);
      }
    }

    this.agendaService.agendaActividadesOperacionesService
      .sendMessageAcrossMandrill$(fdata)
      .subscribe({
        next: (response: boolean) => {
          if (response == true) {
            this.alertaService.swalFire(
              'Enviado',
              'El mensaje se envio correctamente',
              'success'
            );
            this.alertaService.mensajeCorreoExitoso();
            this.formModalCorreo.reset();
            //modal.dismiss();
            this.cerrarModal();
            // this.activeModal.close();

          }
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
          this.isButtonDisabled = false;
        },
      });
  }

  reconocerError(error: any): string {
    let mensaje: string;
    if (error.status == 0) {
      mensaje = 'Verifique la conexion con servicios (0)';
    } else if (error.status == 404) {
      mensaje = 'No se encontro el recurso (404)';
    } else if (error.status == 400) {
      mensaje = 'El servidor no pudo procesará la petición (400)';
    } else {
      mensaje = error.message;
    }
    return mensaje;
  }
}

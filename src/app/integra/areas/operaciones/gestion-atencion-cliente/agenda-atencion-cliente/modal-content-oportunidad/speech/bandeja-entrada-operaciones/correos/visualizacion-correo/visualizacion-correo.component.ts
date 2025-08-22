import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { IContenidoPlantilla, IDataDescarga } from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import { AlertaService } from '@shared/services/alerta.service';
import { emit } from 'process';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-visualizacion-correo',
  templateUrl: './visualizacion-correo.component.html',
  styleUrls: ['./visualizacion-correo.component.scss'],
})
export class VisualizacionCorreoComponent implements OnInit {
  @Input() objetoRedaccionCorreo: any;
  @Input() informacionCorreo: any;
  @Input() gridArchivosAdjuntos: any
  @Input() agendaService: AgendaOperacionesService;
  @Input() datosDescarga: any
  @Output() cerraDataEvent = new EventEmitter<any>();
  @Output() formDataEvent = new EventEmitter<any>();

  esResponder: boolean= false;
  loaderSendEmail: boolean=false;
  totalCorreos: number = 0;
  listaVersion: any = [];
  listaSubEstado: any = [];
  pasteCleanupSettings = {
    convertMsLists: true,
    removeHtmlComments: true,
    removeMsClasses: true,
    removeMsStyles: true,
    removeInvalidHTML: false,
  };

  constructor(
    private modalService: NgbModal,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService
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
  fechaCorreo: any;

  ngOnInit(): void {
    console.log('datos visualizar component', this.informacionCorreo);
    console.log('datos visualizar component archivos ad', this.gridArchivosAdjuntos);

    this.convertirFecha();

    //this.cargarContenido();
  }
  AfterViewInit() {
    this.convertirFecha();
  }
  convertirFecha() {
    var dateString = this.informacionCorreo.fecha;
    // Convert to Date object
    var date = new Date(dateString);
    // Days in Spanish
    var days = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sábado',
    ];
    // Months in Spanish
    var months = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    // Get day, month, and year
    var day = days[date.getDay()];
    var month = months[date.getMonth()];
    var dayOfMonth = date.getDate();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var time=date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Create formatted date string
    this.fechaCorreo =
      day +
      ' ' +
      dayOfMonth +
      ' ' +
      month +
      ' ' +
      year +
      ', ' +
      time
      console.log("fecha correo", this.fechaCorreo);
  }
  sendMessageApiGmail(){}
  descargarAdjunto(dataRow: any) {
    console.log("dtos descargar adjuntos",
      dataRow.idCorreo,
        dataRow.nombreArchivo,
          this.datosDescarga.asesorActual,
            this.datosDescarga.folderActual
    );
    try {
      location.assign(
        `https://integrav5-servicios-respaldo.bsginstitute.com/api/Correo/Descargar/${dataRow.idCorreo}/${dataRow.nombreArchivo}/${this.datosDescarga.asesorActual}/${this.datosDescarga.folderActual}`
      );
    } catch (e) {
      this.alertaService.notificationError(`Error: ${e}`);
    }
  }

  // cargarContenido() {
  // //   // console.log('Obejto hijo: ', this.objetoRedaccionCorreo);
  // //   // this.formModalCorreo
  // //   //   .get('asesor')
  // //   //   ?.setValue(this.objetoRedaccionCorreo.correoEmisor);
  // //   // this.formModalCorreo
  // //   //   .get('destinatario')
  // //   //   ?.setValue(this.objetoRedaccionCorreo.correoDestinatario);
  // //   // this.formModalCorreo
  // //   //   .get('destinatario2')
  // //   //   ?.setValue(this.objetoRedaccionCorreo.correoDestinatario);
  // //   // this.edicionCampos = this.objetoRedaccionCorreo.esCoordinador;
  //  }
  // cerrarModal() {
  //   this.formModalCorreo.reset();
  //   this.cerraDataEvent.emit();
  // }

  responder(modalResponderCorreo: any, esResponder: boolean){
    this.esResponder = esResponder;
    console.log("entro al visualizar modal");
    const modalRef = this.modalService.open(modalResponderCorreo, {
      size: 'lg',
      centered: true,
      backdrop: 'static',
      keyboard: false,
    });
  }
  cerrarModal(modal: any) {
    modal.dismiss();
  }
  // seleccionarContenidoPlantillaCorreo(idPlantilla: any) {
  //   this.integraService
  //     .getJsonResponse(
  //       `${constApiComercial.AgendaGenerarPlantillaMailing}/${this.objetoRedaccionCorreo.idOportunidad}/${idPlantilla}`
  //     )
  //     .subscribe({
  //       next: (response: HttpResponse<IContenidoPlantilla>) => {
  //         this.formModalCorreo.get('asunto').setValue(response.body.asunto);
  //         this.formModalCorreo
  //           .get('mensaje')
  //           .setValue(response.body.cuerpoHTML);
  //         console.log('remplazarPlantillaHistorial', response.body);
  //       },
  //       error: (error: any) => {
  //         this.alertaService.notificationError(
  //           `Error al obtener la plantilla de correo: ${error.error.message}`
  //         );
  //       },
  //     });
  // }
  // cargarVersionesCentroCosto(idCentroCosto: any) {
  //   this.integraService
  //     .getJsonResponse(
  //       `${constApiOperaciones.MontoPagoObtenerPaquetes}/${idCentroCosto}`
  //     )
  //     .subscribe({
  //       next: (response: HttpResponse<any>) => {
  //         console.log('obtenerPaquetesMontoPago', response);
  //         this.listaVersion = response.body;
  //       },
  //     });
  // }
  // obtenerGrupoCentroCostoConVersion() {
  //   const listaIdVersiones = this.formModalCorreo.get('versiones').value;
  //   if (listaIdVersiones.length > 0) {
  //     const params: any = {
  //       idCentroCosto: this.formModalCorreo.get('centroCosto').value,
  //       paquete: listaIdVersiones,
  //       estado: [],
  //       subEstado: [],
  //     };
  //     this.integraService
  //       .postJsonResponse(
  //         `${constApiComercial.CorreoObtenerCorreosGrupos}`,
  //         params
  //       )
  //       .subscribe({
  //         next: (response: any) => {
  //           const destinatarios = response.body.errores
  //             ? this.objetoRedaccionCorreo.correoDestinatario
  //             : response.body.listaCorreos;
  //           this.totalCorreos = response.body.errores
  //             ? 0
  //             : response.body.totalCorreos;
  //           this.formModalCorreo.get('destinatario2').setValue(destinatarios);
  //         },
  //       });
  //   } else {
  //     this.totalCorreos = 0;
  //     this.formModalCorreo
  //       .get('destinatario2')
  //       .setValue(this.objetoRedaccionCorreo.correoDestinatario);
  //   }
  // }
  // cargarCentroCostoEstadoSubEstado(listaIdEstados: Array<number>) {
  //   if (listaIdEstados.length > 0) {
  //     let idCentroCostos = this.formModalCorreo.get('centroCosto').value;
  //     let listaPaquetes = this.formModalCorreo.get('versiones').value;
  //     let listaSubEstado = this.formModalCorreo.get('subestado').value;
  //     let listaEstado = listaIdEstados;
  //     if (idCentroCostos && listaPaquetes && listaEstado) {
  //       this.listaSubEstado = this.objetoRedaccionCorreo.listaSubEstado
  //         .map((subEstado: any) => ({
  //           ...subEstado,
  //           idEstadoMatricula:
  //             subEstado.idEstadoMatricula === 0
  //               ? 1
  //               : subEstado.idEstadoMatricula,
  //         }))
  //         .filter((subEstado: any) =>
  //           listaEstado.includes(subEstado.idEstadoMatricula)
  //         );

  //       let params = {
  //         idCentroCosto: idCentroCostos,
  //         paquete: listaPaquetes.length ? listaPaquetes : [],
  //         estado: listaEstado.length ? listaEstado : [],
  //         subEstado: listaSubEstado?.length ? listaSubEstado : [],
  //       };

  //       this.integraService
  //         .postJsonResponse(
  //           constApiComercial.CorreoObtenerCorreosGrupos,
  //           params
  //         )
  //         .subscribe({
  //           next: ({ body }) => {
  //             this.totalCorreos = body.errores ? 0 : body.totalCorreos;
  //             this.formModalCorreo
  //               .get('destinatario2')
  //               .setValue(body.errores ? null : body.listaCorreos);
  //           },
  //         });
  //     } else {
  //       this.alertaService.swal('Verificar los campos anteriores');
  //       this.formModalCorreo.get('estado').setValue(null);
  //       this.listaSubEstado = [];
  //     }
  //   } else {
  //     this.totalCorreos = 0;
  //   }
  // }
  // cargarCentroCostoEstadoSubEstadoIndependiente(
  //   listaIdSubestado: Array<number>
  // ) {
  //   let idCentroCostos = this.formModalCorreo.get('centroCosto').value;
  //   let listaPaquetes = this.formModalCorreo.get('versiones').value;
  //   let listaEstado = this.formModalCorreo.get('estado').value;
  //   let listaSubEstado = listaIdSubestado;
  //   let params = {
  //     idCentroCosto: idCentroCostos,
  //     paquete: listaPaquetes.length ? listaPaquetes : [],
  //     estado: listaEstado.length ? listaEstado : [],
  //     subEstado: listaSubEstado.length ? listaSubEstado : [],
  //   };

  //   this.integraService
  //     .postJsonResponse(constApiComercial.CorreoObtenerCorreosGrupos, params)
  //     .subscribe({
  //       next: ({ body }) => {
  //         this.totalCorreos = body.errores ? 0 : body.totalCorreos;
  //         this.formModalCorreo
  //           .get('destinatario2')
  //           .setValue(body.errores ? null : body.listaCorreos);
  //       },
  //   });
  // }
  // cambiarArchivo(itemSeleccionado: any) {
  //   this.formModalCorreo.get('adjunto').setValue(itemSeleccionado.target.files);
  // }
  // descargarAdjunto(event: any) {}
  // sendMessageApiGmail() {
  //   console.log('sendMessageApiGmail');
  //   console.log('formModalCorreo', this.formModalCorreo.value);
  //   this.formDataEvent.emit(this.formModalCorreo);
  // }
}

import { HttpResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  constApiComercial,
  constApiGlobal,
  constApiOperaciones,
} from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {
  IHistorialCorreo,
  ICorreo,
  ICorreosEnviadosVentas,
  IArchivoAdjunto,
  IDataDescarga,
  ICorreoAdjunto,
  IPlantillaCorreoContenido,
  IPlantillaCorreo,
  IContenidoPlantilla,
  IPlantillaWhatsapp,
  IInteraccionChat,
  IInteraccionDetalleChat,
  IMensajesWhatsapp,
} from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import { IOportunidadAgenda } from '@comercial/models/interfaces/iagenda-documento-programa';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import * as signalR from '@microsoft/signalr';
import { IMontoPagoPaquete } from '@comercial/models/interfaces/iagenda-bandeja-entrada';
import {
  IAgendaDatosAlumno,
  IAlumnoInformacion,
} from '@comercial/models/interfaces/iagenda-datos-alumno';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

/**
    Modulo: Historial de Mensajes
    @autor Christian Quispe
  * @version 1.0.1
    History
  * fecha : 26/11/2022
    Descripcion : Creacion e implementacion de historial de chat.
*/
@Component({
  selector: 'app-historial-mensaje-recibido',
  templateUrl: './historial-mensaje-recibido.component.html',
  styleUrls: ['./historial-mensaje-recibido.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HistorialMensajeRecibidoComponent implements OnInit {
  public hubConnection: signalR.HubConnection;
  public message: string;
  esEnvioCorrecto:boolean;
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService
  ) {
    //   this.hubConnection = new signalR.HubConnectionBuilder()
    //   .withUrl(`https://integrav4-signalrcore.bsginstitute.com/hubChatWhatsapp_Peru`+'?idUsuario='+this.agendaService.idPersonal+'&&usuarioNombre='+this.agendaService.userName
    //   +'&&rooms=' +
    //   '' +
    //   '')
    //   .build();
    //   this.hubConnection.on('AgregarMensaje', (waTo: string, asesor: string, waBody: string, per: number) => {
    //     this.AgregarMensaje(waTo, asesor, waBody, per)
    //   });
    // this.startConnection();
  }

  // private startConnection(): void {
  //   this.hubConnection.start()
  //     .then(() => {
  //       console.log('Connection started');
  //     })
  //     .catch(err => {
  //       console.log('Error while starting connection: ' + err);
  //       setTimeout(() => this.startConnection(), 5000);
  //     });
  // }
  @Input() agendaService: AgendaOperacionesService;
  @ViewChild('modalSeleccionPlantilla') modalSeleccionPlantilla: any;
  @ViewChild('modalVisualizacionCorreo') modalVisualizacionCorreo: any;
  @ViewChild('modalSeleccionDocumento') modalSeleccionDocumento: any;
  @ViewChild('modalRedaccionCorreos') modalRedaccionCorreos: any;
  @ViewChild('modalCorreosVentas') modalCorreosVentas: any;
  @ViewChild('modalSeleccionarArchivo') modalSeleccionarArchivo: any;

  @ViewChildren('messages') messages: QueryList<any>;
  @ViewChild('content') content: ElementRef;

  gridHistorialCorreoInbox: KendoGrid = new KendoGrid();
  gridHistorialCorreoEnviados: KendoGrid = new KendoGrid();
  gridHistorialCorreoMasivos: KendoGrid = new KendoGrid();
  gridMensajesRecibidosWhatsapp: KendoGrid = new KendoGrid();
  gridHistorialCorreoVentas: KendoGrid = new KendoGrid();
  gridDocumentosWhatsapp: KendoGrid = new KendoGrid();

  gridHistorialPortalWeb: KendoGrid = new KendoGrid();
  gridHistorialMessenger: KendoGrid = new KendoGrid();
  gridArchivosAdjuntos: KendoGrid = new KendoGrid();
  tipoMensaje: string = 'text';
  bloquearTextArea: boolean = false;

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 100 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

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
  formRespondeVisualizacionCorreo: FormGroup = this.formBuilder.group({
    version: '',
    estado: '',
    subestado: '',
  });
  formEnviarWhatsapp: FormGroup = this.formBuilder.group({
    mensaje: '',
    plantilla: '',
    archivoAdjunto: [],
  });
  cantidadCaracteres: number = 0;
  sonido = new Audio();
  listaCentroCostos: any = null;
  listaCentroCostosFiltro: any = null;
  listaPlantillasWhatsapp: IPlantillaWhatsapp[] = null;
  listaPlantillasWhatsappFiltro: IPlantillaWhatsapp[] = null;
  historialMensajeRecibidosChat: IMensajesWhatsapp[] = [];
  historialMensajeRecibidosSoporte: any = null;
  plantillaSeleccionarWhatsapp: any = null;
  dataAsesor: IOportunidadAgenda = null;
  totalCorreos: number = 0;
  numeroCelular: any;
  cargaPlantilla: boolean;
  plantillaSeleccionada: IPlantillaWhatsapp;
  loadingCargarPlantilla: boolean;
  correoEnviadoVentas: ICorreo = {
    asunto: '',
    remitente: '',
    destinatarios: '',
    emailBody: '',
  };
  correoVisualizacion: ICorreo = {
    asunto: '',
    remitente: '',
    destinatarios: '',
    conCopia: '',
    emailBody: '',
    versiones: '',
    subestado: '',
    mensaje: '',
    archivosAdjuntos: null,
  };

  datosDescarga: IDataDescarga = { asesorActual: 0, folderActual: '' };

  listaEstado: any = [
    { id: 1, nombre: 'REGULAR' },
    { id: 2, nombre: 'RESERVADO' },
    { id: 3, nombre: 'RETIRO APROBADO' },
    { id: 4, nombre: 'BECA' },
    { id: 5, nombre: 'CULMINADO' },
    { id: 6, nombre: 'REINCOORPORADO' },
    { id: 7, nombre: 'CULMINADO-DEUDOR' },
    { id: 8, nombre: 'ABANDONO' },
    { id: 11, nombre: 'ABANDONO REINCORPORADO' },
    { id: 12, nombre: 'CERTIFICADO' },
    { id: 13, nombre: 'EN EVALUACION TRASLADO DE BENEFICIOS' },
    { id: 14, nombre: 'EN EVALUACION PERIODO DE GRACIA' },
    { id: 15, nombre: 'EN EVALUACION RETIRO' },
    { id: 20, nombre: 'POR ABANDONAR' },
    { id: 25, nombre: 'MOROSO' },
    { id: 26, nombre: 'EN EVALUACION' },
    { id: 28, nombre: 'MOROSO REPORTADO' },
  ];
  intervalId: any;
  tiempoIntervalo = 1000;
  listaSubEstado: any[] = [];
  listaVersion: any = null;
  listaPlantillas: IPlantillaCorreoContenido[] = [];
  listaPlantillasFiltrado: IPlantillaCorreoContenido[] = [];

  loaderHistorialMensajes: boolean = false;
  loaderHistorialMensajesSoporte: boolean = false;
  nombreYapellido: string = 'NOMBRE Y APELLIDOS';
  detalleChatSoporte = { nombres: 'NOMBRE Y APELLIDOS' };
  identificadorFolder: string = null;
  esNuevoCorreoRedactado: boolean = false;
  esCorreoRedactado: boolean = false;
  edicionCampos: boolean = false;
  bloquearEnvio: boolean = false;
  messengerUsuarioId: string = null;
  camposDisponibles: any = {
    estadoChat: false,
    btnAdjunto: false,
    btnEnvio: false,
    btnEliminar: false,
  };
  objetoPlantillasWhatsApp: any = null;
  nombreAsesor: any;
  alumno: IAlumnoInformacion;
  visualizarDatos: number = 0;
  chatWhatsapp: boolean = false;
  loaderChatWhatsapp: boolean = false;
  ngOnInit(): void {
    this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.subscribe({
      next: (resp: IAgendaDatosAlumno) => {
        // console.log('visualizarDatos');
        if (resp != null) {
          this.alumno = resp.alumno;
          // this.visualizarDatos = resp.visualizarDatos.valor;
          // this.cargarDatosAlumno(this.alumno);
          // string uri = "https://integrav4-servicios.bsginstitute.com/api/Personal/ObtenerConfiguracionOpenVox/" + IdPersonal;
          let configuracionOpenVox: any = null;
          if (
            this.alumno.idCodigoPais != null &&
            configuracionOpenVox != null
          ) {
            let listaPaisesPermitidos = configuracionOpenVox.map(
              (x: any) => x.IdPais
            );
            // mostrarOpenVoxFijo(listaPaisesPermitidos, DatosAlumno);
          }
        }
      },
    });

    this.cargarConfiguracionesGrillas();
    this.cargarHistorialChats();
    this.cargarListaPlantillas();
    this.conectar();

    const intervalo5 = setInterval(() => {
      // Definir la función a ejecutar
      this.hubConnection.onclose(async () => {
        console.log('Desconectado-Prueba miguel');
        // Aquí puedes agregar cualquier acción que quieras ejecutar cuando se pierde la conexión
        // por ejemplo, intentar reconectar.
        await this.startConnection();
      });
    }, 1000);
    const intervalo = setInterval(() => {
      // Definir la función a ejecutar
      this.revisarConexion();
    }, 50000);

    this.userService.nombrePersonal$.subscribe({
      next: (resp: any) => {
        this.nombreAsesor = resp.valor;
      },
    });
    this.agendaService.agendaDocumentoProgramaOperacionesService.datosOportunidad$.subscribe(
      { next: (resp) => (this.dataAsesor = resp) }
    );
  }
  ngAfterViewInit() {
    this.scrollToBottom();
    this.messages.changes.subscribe(this.scrollToBottom);
  }
  scrollToBottom = () => {
    try {
      this.content.nativeElement.scrollTop =
        this.content.nativeElement.scrollHeight;
    } catch (err) {}
  };
  cargarHistorialChats() {
    this.cargarHistorialCorreoInbox();
    this.cargarHistorialCorreoEnviados();
    this.cargarHistorialCorreoMasivos();
    this.cargarHistorialCorreoVentas();
    this.cargarMensajesRecibidosWhatsapp();
    this.cargarHistorialPortal();
    this.cargarHistorialMessenger();
    this.cargarHistorialSoporte();
  }
  cargarConfiguracionesGrillas() {
    this.configuracionInicialCorreoInbox();
    this.configuracionInicialCorreoEnviado();
    this.configuracionInicialCorreoMasivos();
    this.configuracionInicialCorreoVentas();
    this.configuracionInicialMensajesRecibidosWhatsapp();
    this.configuracionInicialPortalWeb();
    this.configuracionInicialMessenger();
    this.configuracionInicialDocumentosWhatsapp();
  }
  pasteCleanupSettings = {
    convertMsLists: true,
    removeHtmlComments: true,
    removeMsClasses: true,
    removeMsStyles: true,
    removeInvalidHTML: false,
  };
  separarCorreos(destinatarios: string, conCopia: string) {
    let contenido: any = { destinatarios: destinatarios, conCopia: '' };
    let cont: number = 0;
    let _remitente = destinatarios
      .split(',')
      .filter((o: string) => o.includes('>'));
    if (_remitente.length > 0) {
      _remitente.forEach((data: any) => {
        let rptaEmail = data;
        rptaEmail = data.split('<').filter((o: string) => o.includes('>'));
        rptaEmail = rptaEmail[0].split('>');
        _remitente[cont] = rptaEmail[0];
        cont = cont + 1;
      });
      contenido.destinatarios = _remitente.join();
    }
    if (conCopia.length > 0) {
      let _contCopia = 0;
      let _filtrarCopia = conCopia
        .split(',')
        .filter((o: string) => o.includes('>'));
      if (_filtrarCopia.length > 0) {
        _filtrarCopia.forEach((data: any) => {
          let rptaEmail = data;
          rptaEmail = data.split('<').filter((o: string) => o.includes('>'));
          rptaEmail = rptaEmail[0].split('>');
          _filtrarCopia[_contCopia] = rptaEmail[0];
          _contCopia = _contCopia + 1;
        });
        contenido.conCopia = _filtrarCopia.join();
      }
    }
    return contenido;
  }
  abrirModalCorreos(tipoModal: string, dataRow?: ICorreo) {
    console.log("historialMensajeRecibido", dataRow);
    let _asesor: number = 0;
    console.log("this.agendaService.areaTrabajo Recibidos antiguo",this.agendaService);
    if (this.agendaService.areaTrabajo == 'OP' || this.agendaService.idPersonal==213) {
      _asesor =
        dataRow && dataRow.idPersonal
          ? dataRow.idPersonal
          : this.agendaService.rowActual.idPersonal_Asignado;
    } else {
      _asesor = this.agendaService.rowActual.idPersonal_Asignado;
    }
    if (dataRow) {
      dataRow.conCopia = dataRow.conCopia ? dataRow.conCopia : 'Cc';
    }
    this.edicionCampos = this.agendaService.esCoordinadora$.value;
    if (tipoModal == 'redactar') {
      this.esNuevoCorreoRedactado = true;
      this.esCorreoRedactado = true;
      this.transferirDatosRedactar(dataRow);
      this.modalService.open(this.modalRedaccionCorreos, { size: 'lg' });
    } else if (tipoModal == 'recibidos') {
      this.esNuevoCorreoRedactado = false;
      this.esCorreoRedactado = true;
      this.gridHistorialCorreoInbox.loading = true;
      this.agendaService.agendaHistorialChatOperacionesService
        .correoInformacionDetallado$({
          idCorreo: dataRow.id,
          idAsesor: _asesor,
          folder: 'inbox',
        })
        .subscribe({
          next: (response: HttpResponse<ICorreoAdjunto>) => {
            this.datosDescarga = {
              asesorActual: _asesor,
              folderActual: 'inbox',
            };
            this.identificadorFolder = 'Recibido';
            dataRow.emailBody = response.body.emailBody
              ? response.body.emailBody
              : dataRow.emailBody;
            this.gridArchivosAdjuntos.data = response.body.archivosAdjuntos
              ? response.body.archivosAdjuntos
              : null;
            let dataSeparada = this.separarCorreos(
              dataRow.destinatarios,
              dataRow.conCopia
            );
            dataRow.destinatarios = dataSeparada.destinatarios;
            dataRow.conCopia = dataSeparada.conCopia
              ? dataSeparada.conCopia
              : 'Cc';
            this.transferirDatosResponder(dataRow);
            this.gridHistorialCorreoInbox.loading = false;
            this.modalService.open(this.modalVisualizacionCorreo, {
              size: 'lg',
            });
            console.log("historialMensajeRecibido2", dataRow);

          },
          error: (error: any) => {
            this.alertaService.notificationError(
              `Error: ${this.reconocerError(error)}`,
              'right',
              'bottom'
            );
            this.gridHistorialCorreoInbox.loading = false;
          },
        });
    } else if (tipoModal == 'masivos') {
      this.esNuevoCorreoRedactado = false;
      this.esCorreoRedactado = true;
      this.gridHistorialCorreoMasivos.loading = true;
      if (dataRow.envioMasivoMandrill) {
        this.agendaService.agendaHistorialChatOperacionesService
          .correoDetalladoMasivos$({
            idCorreo: dataRow.id,
            idAsesor: _asesor,
            folder: '[Gmail]/Enviados',
            destinatario: dataRow.destinatarios,
          })
          .subscribe({
            next: (response: HttpResponse<ICorreoAdjunto>) => {
              dataRow.emailBody = response.body.emailBody
                ? response.body.emailBody
                : dataRow.emailBody;
              this.gridArchivosAdjuntos.data = response.body.archivosAdjuntos
                ? response.body.archivosAdjuntos
                : null;
              this.transferirDatosResponder(dataRow);
              this.gridHistorialCorreoMasivos.loading = false;
              this.modalService.open(this.modalVisualizacionCorreo, {
                size: 'lg',
              });
            },
            error: (error: any) => {
              this.alertaService.notificationError(
                `Error: ${this.reconocerError(error)}`
              );
              this.gridHistorialCorreoMasivos.loading = false;
            },
          });
      } else {
        this.agendaService.agendaHistorialChatOperacionesService
          .correoInformacionDetallado$({
            idCorreo: dataRow.id,
            idAsesor: _asesor,
            folder: '[Gmail]/Enviados',
          })
          .subscribe({
            next: (response: HttpResponse<ICorreoAdjunto>) => {
              this.datosDescarga = {
                asesorActual: _asesor,
                folderActual: '[Gmail]/Enviados',
              };
              dataRow.emailBody = response.body.emailBody
                ? response.body.emailBody
                : dataRow.emailBody;
              this.gridArchivosAdjuntos.data = response.body.archivosAdjuntos
                ? response.body.archivosAdjuntos
                : null;
              this.transferirDatosResponder(dataRow);
              this.gridHistorialCorreoMasivos.loading = false;
              this.modalService.open(this.modalVisualizacionCorreo, {
                size: 'lg',
              });
            },
            error: (error: any) => {
              this.alertaService.notificationError(
                `Error: ${this.reconocerError(error)}`
              );
              this.gridHistorialCorreoMasivos.loading = false;
            },
          });
      }
    } else if (tipoModal == 'enviados') {
      this.esNuevoCorreoRedactado = false;
      this.esCorreoRedactado = true;
      this.gridHistorialCorreoEnviados.loading = true;
      this.agendaService.agendaHistorialChatOperacionesService
        .correoInformacionDetallado$({
          idCorreo: dataRow.id,
          idAsesor: _asesor,
          folder: '[Gmail]/Enviados',
        })
        .subscribe({
          next: (response: HttpResponse<ICorreoAdjunto>) => {
            this.datosDescarga = {
              asesorActual: _asesor,
              folderActual: '[Gmail]/Enviados',
            };
            dataRow.emailBody = response.body.emailBody
              ? response.body.emailBody
              : dataRow.emailBody;
            this.identificadorFolder = 'Enviado';
            this.gridArchivosAdjuntos.data = response.body.archivosAdjuntos
              ? response.body.archivosAdjuntos
              : null;
            this.transferirDatosResponder(dataRow);
            this.gridHistorialCorreoEnviados.loading = false;
            this.modalService.open(this.modalVisualizacionCorreo, {
              size: 'lg',
              centered: true,
              backdrop: 'static',
              keyboard: false,
            });
          },
          error: (error: any) => {
            this.gridHistorialCorreoEnviados.loading = false;
            this.alertaService.notificationError(
              `Error: ${this.reconocerError(error)}`,
              'right',
              'bottom'
            );
          },
        });
    } else if (tipoModal == 'ventas') {
      this.esNuevoCorreoRedactado = false;
      this.esCorreoRedactado = true;
      this.transferirDatosVentas(dataRow);
      this.modalService.open(this.modalCorreosVentas, { size: 'lg' });
    } else {
      this.esNuevoCorreoRedactado = false;
      this.esCorreoRedactado = true;
      alert(`Configuracion Por definir: ${tipoModal}`);
    }
  }
  sendMessageAcrossMandrill(nombreForm?: any) {
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
    fdata.append('DestinatarioCc', this.formModalCorreo.get('conCopia2').value == null ? '' : this.formModalCorreo.get('conCopia2').value);
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
            nombreForm.dismiss();
          }
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        }
      });
  }
  //TODO: Funciones que permiten setear datos de la fila dentro de su respectivo modal
  transferirDatosReenviar(dataRow: ICorreo) {
    let remitenteOfuscado: string =
      this.agendaService.agendaHistorialChatOperacionesService.ofuscarCorreo(
        dataRow.remitente
      );
    let destinatarioOfuscado: string =
      this.agendaService.agendaHistorialChatOperacionesService.ofuscarCorreo(
        dataRow.destinatarios
      );
    let destinatario2Ofuscado: string =
      this.agendaService.agendaHistorialChatOperacionesService.ofuscarCorreo(
        this.agendaService.rowActual.email1
      );
    this.formModalCorreo.get('asunto').setValue(dataRow.asunto);
    this.formModalCorreo.get('asesor').setValue(dataRow.remitente);
    this.formModalCorreo.get('destinatario').setValue(dataRow.destinatarios);
    this.formModalCorreo
      .get('destinatario2')
      .setValue(this.agendaService.rowActual.email1);
    this.formModalCorreo.get('conCopia').setValue(dataRow.conCopia);
    this.formModalCorreo.get('versiones').setValue(dataRow.versiones);
    this.formModalCorreo.get('plantilla').setValue(this.listaPlantillas[0].id);
    this.formModalCorreo.get('mensaje').setValue(dataRow.emailBody);

    let contenidoGridArchivoAdjunto = this.gridArchivosAdjuntos.data;
    this.gridArchivosAdjuntos.data =
      contenidoGridArchivoAdjunto != null ? contenidoGridArchivoAdjunto : null;
  }
  transferirDatosRedactar(dataRow: ICorreo) {
    let destinatarioDosOfuscado: string =
      this.agendaService.agendaHistorialChatOperacionesService.ofuscarCorreo(
        this.agendaService.rowActual.email1
      );
    if (this.esNuevoCorreoRedactado) {
      let destinatarioOfuscado: string =
        this.agendaService.agendaHistorialChatOperacionesService.ofuscarCorreo(
          this.agendaService.rowActual.email1
        );
      this.formModalCorreo.get('asesor').setValue(this.dataAsesor.email);
      this.formModalCorreo
        .get('plantilla')
        .setValue(this.listaPlantillas[0].id);
      this.formModalCorreo
        .get('destinatario')
        .setValue(this.agendaService.rowActual.email1);
      this.formModalCorreo
        .get('destinatario2')
        .setValue(this.agendaService.rowActual.email1);
      this.formModalCorreo
        .get('centroCosto')
        .setValue(this.agendaService.rowActual.idCentroCosto);
    } else {
      let remitenteOfuscado: string =
        this.agendaService.agendaHistorialChatOperacionesService.ofuscarCorreo(
          dataRow.remitente
        );
      let destinatarioOfuscado: string =
        this.agendaService.agendaHistorialChatOperacionesService.ofuscarCorreo(
          dataRow.destinatarios
        );

      this.formModalCorreo.get('asunto').setValue(dataRow.asunto);
      this.formModalCorreo.get('asesor').setValue(dataRow.remitente);
      this.formModalCorreo.get('destinatario').setValue(dataRow.destinatarios);
      this.formModalCorreo
        .get('destinatario2')
        .setValue(this.agendaService.rowActual.email1);
      this.formModalCorreo.get('conCopia').setValue(dataRow.conCopia);
      this.formModalCorreo.get('versiones').setValue(dataRow.versiones);
      this.formModalCorreo
        .get('plantilla')
        .setValue(this.listaPlantillas[0].id);
      this.formModalCorreo.get('mensaje').setValue(dataRow.emailBody);

      let contenidoGridArchivoAdjunto = this.gridArchivosAdjuntos.data;
      this.gridArchivosAdjuntos.data =
        contenidoGridArchivoAdjunto != null
          ? contenidoGridArchivoAdjunto
          : null;
    }
    console.log(
      'adnsajnjasndjasndjsanjdasn',
      this.formModalCorreo.getRawValue()
    );
  }
  transferirDatosResponder(dataRow: ICorreo) {
    this.correoVisualizacion.asunto = dataRow.asunto;
    this.correoVisualizacion.remitente = dataRow.remitente;
    this.correoVisualizacion.destinatarios = dataRow.destinatarios;
    this.correoVisualizacion.conCopia = dataRow.conCopia;
    this.correoVisualizacion.versiones = dataRow.versiones;
    this.correoVisualizacion.estado = dataRow.estado;
    this.correoVisualizacion.subestado = dataRow.subestado;
    this.correoVisualizacion.emailBody = dataRow.emailBody;
    this.correoVisualizacion.archivosAdjuntos = dataRow.archivosAdjuntos;
  }
  transferirDatosVentas(dataRow: ICorreo) {
    this.correoEnviadoVentas.asunto = dataRow.asunto;
    this.correoEnviadoVentas.remitente = dataRow.remitente;
    this.correoEnviadoVentas.destinatarios = dataRow.destinatarios;
    this.correoEnviadoVentas.emailBody = dataRow.emailBody;
  }
  //TODO:

  //TODO: Funciones que permiten la inicializacion de propiedades de las grillas
  configuracionInicialCorreoInbox() {
    this.gridHistorialCorreoInbox.loading = true;
    this.gridHistorialCorreoInbox.selectable = true;
    this.gridHistorialCorreoInbox.sortable = true;
    this.gridHistorialCorreoInbox.resizable = true;
    this.gridHistorialCorreoInbox.pageable = true;
    this.gridHistorialCorreoInbox.loading = true;
    this.gridHistorialCorreoInbox.pageSize = 5;
  }
  configuracionInicialCorreoEnviado() {
    this.gridHistorialCorreoEnviados.loading = true;
    this.gridHistorialCorreoEnviados.selectable = true;
    this.gridHistorialCorreoEnviados.sortable = true;
    this.gridHistorialCorreoEnviados.resizable = true;
    this.gridHistorialCorreoEnviados.pageable = true;
    this.gridHistorialCorreoEnviados.loading = true;
    this.gridHistorialCorreoEnviados.pageSize = 5;
  }
  configuracionInicialCorreoMasivos() {
    this.gridHistorialCorreoMasivos.selectable = true;
    this.gridHistorialCorreoMasivos.sortable = true;
    this.gridHistorialCorreoMasivos.resizable = true;
    this.gridHistorialCorreoMasivos.pageable = true;
    this.gridHistorialCorreoMasivos.loading = true;
    this.gridHistorialCorreoMasivos.pageSize = 5;
  }
  configuracionInicialMensajesRecibidosWhatsapp() {
    this.gridMensajesRecibidosWhatsapp.pageable = true;
    this.gridMensajesRecibidosWhatsapp.pageSize = 8;
    this.gridMensajesRecibidosWhatsapp.selectable = true;
    this.gridMensajesRecibidosWhatsapp.sortable = true;
    this.gridMensajesRecibidosWhatsapp.resizable = true;
  }
  configuracionInicialPortalWeb() {
    this.gridHistorialPortalWeb.selectable = true;
    this.gridHistorialPortalWeb.sortable = true;
    this.gridHistorialPortalWeb.resizable = true;
    this.gridHistorialPortalWeb.pageable = true;
    this.gridHistorialPortalWeb.loading = true;
    this.gridHistorialPortalWeb.pageSize = 5;
  }
  configuracionInicialMessenger() {
    this.gridHistorialMessenger.selectable = true;
    this.gridHistorialMessenger.sortable = true;
    this.gridHistorialMessenger.resizable = true;
    this.gridHistorialMessenger.pageable = true;
    this.gridHistorialMessenger.loading = true;
    this.gridHistorialMessenger.pageSize = 5;
  }
  configuracionInicialDocumentosWhatsapp() {
    this.gridDocumentosWhatsapp.selectable = true;
    this.gridDocumentosWhatsapp.sortable = true;
    this.gridDocumentosWhatsapp.resizable = true;
    this.gridDocumentosWhatsapp.pageable = true;
    this.gridDocumentosWhatsapp.pageSize = 10;
  }
  configuracionInicialCorreoVentas() {
    this.gridHistorialCorreoVentas.selectable = true;
    this.gridHistorialCorreoVentas.sortable = true;
    this.gridHistorialCorreoVentas.resizable = true;
    this.gridHistorialCorreoVentas.pageable = true;
    this.gridHistorialCorreoVentas.loading = true;
    this.gridHistorialCorreoVentas.pageSize = 5;
  }
  //TODO:

  //TODO: Funciones que inicializan la carga de las grillas
  prepararNotificacion() {
    this.sonido.src =
      '../../../../../../../../../assets/sounds/tono/whatsapp.mp3';
    this.sonido.load();
  }

  reproducirNotificacion() {
    this.sonido.play();
  }
  cargarHistorialCorreoInbox() {
    this.agendaService.agendaBandejaCorreoOperacionesService
      .cargarHistorialCorreoInboxOperaciones$()
      .subscribe({
        next: (response: HttpResponse<IHistorialCorreo>) => {
          response.body.listaCorreos.map(
            (data: ICorreo) => (data.fecha = new Date(data.fecha))
          );
          this.gridHistorialCorreoInbox.data = response.body.listaCorreos;
          this.gridHistorialCorreoInbox.loading = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`,
            'right',
            'bottom'
          );
          this.gridHistorialCorreoInbox.loading = false;
        },
      });
  }
  cargarHistorialCorreoEnviados() {
    this.agendaService.agendaBandejaCorreoOperacionesService
      .cargarEnviadosOperaciones$()
      .subscribe({
        next: (response: HttpResponse<IHistorialCorreo>) => {
          response.body.listaCorreos.map(
            (data: ICorreo) => (data.fecha = new Date(data.fecha))
          );
          this.gridHistorialCorreoEnviados.data = response.body.listaCorreos;
          this.gridHistorialCorreoEnviados.loading = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`,
            'right',
            'bottom'
          );
          this.gridHistorialCorreoEnviados.loading = false;
        },
      });
  }
  cargarHistorialCorreoMasivos() {
    this.agendaService.agendaBandejaCorreoOperacionesService
      .cargarHistorialCorreoMasivosOperaciones$()
      .subscribe({
        next: (response: HttpResponse<IHistorialCorreo>) => {
          console.log('cargarHistorialCorreoMasivos', response.body);
          response.body.listaCorreos.map(
            (data: ICorreo) => (data.fecha = new Date(data.fecha))
          );
          this.gridHistorialCorreoMasivos.data = response.body.listaCorreos;
          this.gridHistorialCorreoMasivos.loading = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`,
            'right',
            'bottom'
          );
          this.gridHistorialCorreoMasivos.loading = false;
        },
      });
  }
  cargarMensajesRecibidosWhatsapp() {
    this.gridMensajesRecibidosWhatsapp.data = [];
    console.log('cargarMensajesRecibidosWhatsapp');
    let celularLimpiado: string = this.obtenerNumero();
    this.gridMensajesRecibidosWhatsapp.loading = true;
    this.agendaService.agendaHistorialChatOperacionesService
      .obtenerHistorialMensajeRecibidoChat$(
        this.agendaService.rowActual.idPersonal_Asignado,
        celularLimpiado
      )
      .subscribe({
        next: (response: HttpResponse<IFilaWhatsapp[]>) => {
          if (response.body.length != 0) {
            this.messengerUsuarioId = celularLimpiado;
          } else {
            this.agendaService.agendaHistorialChatOperacionesService
              .obtenerHisotirialconPlantillas$(celularLimpiado)
              .subscribe({
                next: (response: any) => {
                  this.gridMensajesRecibidosWhatsapp.data = response.body;
                  this.gridMensajesRecibidosWhatsapp.loading = false;
                },
              });
            this.chatWhatsapp = true;
            this.consultaBloqueoRedactar();
          }
          response.body.map(
            (obj: IFilaWhatsapp) =>
              (obj.fechaCreacion = new Date(obj.fechaCreacion))
          );
          this.gridMensajesRecibidosWhatsapp.data = response.body;
          this.gridMensajesRecibidosWhatsapp.loading = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
          this.gridMensajesRecibidosWhatsapp.loading = false;
        },
      });
  }
  cargarHistorialCorreoVentas() {
    this.agendaService.agendaHistorialChatOperacionesService
      .obtenerCorreosEnviadosVentas$(this.agendaService.rowActual.email1)
      .subscribe({
        next: (response: HttpResponse<ICorreosEnviadosVentas[]>) => {
          response.body.map(
            (data: ICorreosEnviadosVentas) =>
              (data.fecha = new Date(data.fecha))
          );
          this.gridHistorialCorreoVentas.data = response.body;
          this.gridHistorialCorreoVentas.loading = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
          this.gridHistorialCorreoVentas.loading = false;
        },
      });
  }
  cargarHistorialPortal() {
    this.agendaService.agendaHistorialChatOperacionesService
      .obtenerHistorialChatPortal$(
        this.agendaService.rowActual.idPersonal_Asignado,
        this.agendaService.rowActual.idAlumno
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridHistorialPortalWeb.data = response.body;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      });
  }
  cargarHistorialMessenger() {
    let idUsuarioSeleccionado: any;
    let chatIdSelccionado: any;
    this.agendaService.agendaHistorialChatOperacionesService
      .obtenerHistorialMessenger$(
        this.agendaService.rowActual.idPersonal_Asignado,
        this.agendaService.rowActual.idAlumno
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body !== null && response.body.length !== 0) {
            idUsuarioSeleccionado = response.body[0].PSID;
            chatIdSelccionado = response.body[0].id;
            this.gridHistorialMessenger.data = response.body;
          }
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      });
  }
  cargarHistorialSoporte() {
    this.loaderHistorialMensajesSoporte = true;
    this.agendaService.agendaHistorialChatOperacionesService
      .obtenerHistorialSoporte$(this.agendaService.rowActual.idAlumno)
      .subscribe({
        next: (response: HttpResponse<IInteraccionChat[]>) => {
          if (response.body.length > 0) {
            this.detalleChatSoporte.nombres =
              response.body[0].nombreAlumno.toUpperCase();
            this.actualizardivchatSoporte(response.body[0].idInteraccionChat);
          } else {
            this.detalleChatSoporte.nombres = 'NO SE ENCONTRO CHAT';
          }
          this.loaderHistorialMensajesSoporte = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
          this.loaderHistorialMensajesSoporte = false;
        },
      });
  }

  //TODO:
  cargarListaPlantillas() {
    this.agendaService.agendaBandejaCorreoOperacionesService.listaPlantilla$.subscribe(
      {
        next: (response: IPlantillaCorreoContenido[]) => {
          this.listaPlantillasFiltrado = response;
          this.listaPlantillas = response;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      }
    );
  }
  responderSpeechCorreo(dataRow: ICorreo) {
    this.esNuevoCorreoRedactado = false;
    this.transferirDatosRedactar(dataRow);
    this.modalService.open(this.modalRedaccionCorreos, { size: 'lg' });
  }
  reenviarSpeechCorreo(dataRow: ICorreo) {
    this.esNuevoCorreoRedactado = false;
    this.transferirDatosReenviar(dataRow);
    this.modalService.open(this.modalRedaccionCorreos, { size: 'lg' });
  }
  dataGrillaMensajeWhatsappSeleccionado: any = null;
  actualizardivchat(dataRow: any) {
    console.log('esaqui3');
    this.loaderChatWhatsapp = true;
    this.dataGrillaMensajeWhatsappSeleccionado =
      dataRow.selectedRows[0].dataItem;
    this.loaderHistorialMensajes = true;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.WhatsAppMensajeEnviadoWhatsAppHistorialMensajeChat}/${this.agendaService.rowActual.idPersonal_Asignado}/${this.numeroCelular}/${this.agendaService.areaTrabajo}`
      )
      .subscribe({
        next: (response: HttpResponse<IMensajesWhatsapp[]>) => {
          this.chatWhatsapp = true;
          this.loaderChatWhatsapp = false;
          response.body.map(
            (data: any) => (data.fechaCreacion = new Date(data.fechaCreacion))
          );
          // this.bloquearEnvio = this.validarBloqueoEnvioMensaje(response.body)
          //this.camposDisponibles.estadoChat = this.bloquearEnvio;

          this.historialMensajeRecibidosChat = response.body;
          this.loaderHistorialMensajes = false;
          this.nombreYapellido =
            this.dataGrillaMensajeWhatsappSeleccionado.nombreAlumno.toLocaleUpperCase();
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
          this.loaderHistorialMensajes = false;
          this.loaderChatWhatsapp = false;
        },
      });

    this.consultaBloqueoRedactar();
  }
  consultarPlantillaEnviadaEn24Horas() {
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.WhatsAppMensajesValidarPlantillasEnviadas}/${this.plantillaSeleccionada.descripcion}/${this.numeroCelular}`
      )
      .subscribe({
        next: (response: any) => {
          console.log('llegofiltroPlantilla', response);
          //this.bloquearTextArea = response.body
          this.bloquearEnvio = response.body;
          //logica antigua
        },
        error: (error: any) => {},
      });
  }
  consultaBloqueoRedactar() {
    //nueva logica bloqueo
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.WhatsAppMensajesValidarMesajesEnviadosEn24Horas}/${this.numeroCelular}`
      )
      .subscribe({
        next: (response: any) => {
          console.log('llegofiltro', response);

          this.bloquearTextArea = response.body;
          this.camposDisponibles.btnAdjunto = response.body;
          this.camposDisponibles.btnEnvio = response.body;
          this.camposDisponibles.btnEliminar = false;
        },
        error: (error: any) => {},
      });
  }
  ocultarOportunidad() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadActualizarFechaOcultarWhatsApp}/${this.agendaService.rowActual.id}/${this.userService.userData.userName}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(
            this.agendaService.rowActual.id
          );
          this.agendaService.agendaControlPantallaOperacionesService.cerrarModalProgramarActividades();

          this.agendaService.agendaControlPantallaOperacionesService.cerrarModalProgramarActividades();

          // if ($('#gridMensajesWhatsAppCoordinador').data('kendoGrid')) {
          //     $('#gridMensajesWhatsAppCoordinador').data('kendoGrid').dataSource.read();
          // }
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      });
  }
  limpiarCerrar(nombreModal: any) {
    if (this.esCorreoRedactado) {
      this.formModalCorreo.reset();
    } else {
      this.formRespondeVisualizacionCorreo.reset();
    }
    this.totalCorreos = 0;
    nombreModal.dismiss();
  }
  actualizardivchatSoporte(idInteraccion: number) {
    this.integraService
      .getJsonResponse(
        `${constApiGlobal.PortalHistorialObtenerDetalleChatPorIdInteraccionControlMensajeSoporte}/${this.agendaService.rowActual.idAlumno}/${idInteraccion}`
      )
      .subscribe({
        next: (response: HttpResponse<IInteraccionDetalleChat[]>) => {
          response.body.map(
            (data: IInteraccionDetalleChat) =>
              (data.nombreRemitente = data.nombreRemitente.toLocaleUpperCase())
          );
          this.historialMensajeRecibidosSoporte = response.body;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      });
  }
  cambiarArchivo(itemSeleccionado: any) {
    this.formModalCorreo.get('adjunto').setValue(itemSeleccionado.target.files);
  }
  descargarAdjunto(dataRow: IArchivoAdjunto) {
    try {
      location.assign(
        `https://integrav5-servicios-respaldo.bsginstitute.com/api/Correo/Descargar/${dataRow.idCorreo}/${dataRow.nombreArchivo}/${this.datosDescarga.asesorActual}/${this.datosDescarga.folderActual}`
      );
    } catch (e) {
      this.alertaService.notificationError(`Error: ${e}`);
    }
  }
  cargarPlantillaWhatsAppAgendaOperaciones() {
    this.cargaPlantilla = true;
    this.integraService
      .postJsonResponse(
        `${constApiGlobal.AlumnoEstadoContactoWhatsApp}/${this.agendaService.rowActual.idAlumno}`,
        null
      )
      .subscribe({
        next: (response: HttpResponse<IDatosEstadoContactoWhatsapp>) => {
          let estadoWhatsapp: any = response.body.idEstadoContactoWhatsApp;
          this.cargarPlantillaWhatsAppAgendaOperacionesBoton(estadoWhatsapp);
          this.cargaPlantilla = false;
        },
        error: (error: any) => {
          this.cargaPlantilla = false;
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      });
  }
  cargarPlantillaWhatsAppAgendaOperacionesBoton(estadoWhatsapp: any) {
    if (estadoWhatsapp != 1) {
      this.alertaService.swalFire(
        'Error Whatsapp',
        'El alumno tiene Whatsapp Inhabilitado',
        'warning'
      );
    } else {
      this.integraService
        .getJsonResponse(
          `${constApiComercial.AgendaInformacionActividadObtenterPlantillaWhatsAppOperaciones}`
        )
        .subscribe({
          next: (response: HttpResponse<IPlantillaWhatsapp[]>) => {
            this.listaPlantillasWhatsapp = response.body;
            this.listaPlantillasWhatsappFiltro = response.body;
            this.modalService.open(this.modalSeleccionPlantilla, {
              size: 'md'
            });
            this.cargaPlantilla = false;
          },
          error: (error: any) => {
            this.alertaService.notificationError(
              `Error: ${this.reconocerError(error)}`
            );
          },
        });
    }
  }
  abrirModalSeleccionDocumento() {
    this.gridDocumentosWhatsapp.loading = true;
    this.agendaService.agendaHistorialChatOperacionesService
      .iniciarAgendaAlumnoDocumentos$(this.agendaService.rowActual.idAlumno)
      .subscribe({
        next: (response: HttpResponse<IDocumentosWhatsapp>) => {
          let nombrePrograma: string =
            response.body.Oportunidad.NombreProgramaGeneral;
          this.gridDocumentosWhatsapp.data = response.body.ListaDocumentos;
          this.gridDocumentosWhatsapp.loading = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      });
    this.modalService.open(this.modalSeleccionDocumento, {
      size: 'lg',
      backdrop: 'static',
    });
  }
  seleccionarContenidoPlantillaCorreo(item: number) {
    this.agendaService.agendaHistorialChatOperacionesService
      .remplazarPlantillaHistorial$(
        this.agendaService.rowActual.idOportunidad,
        item
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
            `Error: ${this.reconocerError(error)}`
          );
        },
      });
  }

  convertirPlantillaAgenda(modal: any) {
    //this.consultarPlantillaEnviadaEn24Horas()
    this.loadingCargarPlantilla = true;
    console.log('enviarmensaje');
    this.plantillaSeleccionada = this.plantillaSeleccionarWhatsapp;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaGenerarPlantillaWhatsapp}/${this.agendaService.rowActual.idOportunidad}/${this.plantillaSeleccionada.id}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loadingCargarPlantilla = false;
          if (response.body && response.body != undefined) {
            this.formEnviarWhatsapp
              .get('mensaje')
              .setValue(response.body.plantilla);
            this.tipoMensaje = 'hsm';
            //if (this.plantillaSeleccionada.tipoPlantilla == 8) {
            //this.camposDisponibles.estadoChat =  true;
            this.formEnviarWhatsapp.get('mensaje');
            this.bloquearTextArea = true;
            response.body.objetoplantilla.forEach((e: any) => {
              if (e.texto == null) {
                e.texto = ' ';
                console.log(e);
              }
            });
            this.objetoPlantillasWhatsApp = response.body.objetoplantilla;
            this.camposDisponibles.btnEnvio = false;
            // } else {
            //   //this.camposDisponibles.estadoChat =  false
            // }
          }
          this.consultarPlantillaEnviadaEn24Horas();
          //ksthis.camposDisponibles.btnEnvio = false
          //else { this.alertaService.swalFire("Error Whatsapp","El alumno tiene Whatsapp Inhabilitado","warning")  }
        },
        error: (error: any) => {
          this.loadingCargarPlantilla = false;
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
        },
      });
    modal.dismiss();
  }
  filtrarPlantillaWhatsapp(value: string) {
    this.listaPlantillasWhatsapp = this.listaPlantillasWhatsappFiltro.filter(
      (data: IPlantillaWhatsapp) =>
        data.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  filtrarPlantillaCorreo(value: string) {
    this.listaPlantillas = this.listaPlantillasFiltrado.filter(
      (data: IPlantillaCorreoContenido) =>
        data.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }
  filtrarGrupoCentroCosto(value: string) {
    if (value.length >= 4) {
      this.integraService
        .obtenerPorFiltro(constApiComercial.CentroCostoObtenerAutocomplete, {
          valor: value,
        })
        .subscribe({
          next: (response) => {
            this.listaCentroCostos = response.body;
            this.listaCentroCostosFiltro = response.body;
          },
        });
    } else {
      this.listaCentroCostos = [];
    }
  }
  cargarVersionesCentroCosto(idCentroCosto: any) {
    this.agendaService.agendaBandejaCorreoOperacionesService
      .obtenerPaquetesMontoPago$(idCentroCosto)
      .subscribe({
        next: (response: any) => {
          //HttpResponse<ICentroCosto[]>
          console.log('obtenerPaquetesMontoPago', response);
          this.listaVersion = response.body;
          // this.listaVersion = (response[0].Paquete) ? response : null;
        },
      });
    if (
      this.listaVersion.length > 0 ||
      this.listaVersion == null ||
      this.listaVersion == undefined
    ) {
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
  }
  obtenerGrupoCentroCostoConVersion() {
    let listaIdVersiones: Array<any> =
      this.formModalCorreo.get('versiones').value;
    if (listaIdVersiones.length > 0) {
      let params: any = {
        idCentroCosto: this.formModalCorreo.get('centroCosto').value,
        paquete: listaIdVersiones,
        estado: [],
        subEstado: [],
      };
      this.agendaService.agendaBandejaCorreoOperacionesService.obtenerGrupoCentroCostoSinVersion$(
        params
      );
      this.recargarCantidadCorreos();
    } else if (listaIdVersiones.length == 0) {
      this.totalCorreos = 0;
    }
  }
  recargarCantidadCorreos() {
    this.agendaService.agendaBandejaCorreoOperacionesService.cantidadTotalCorreos$.subscribe(
      {
        next: (resp: any) => {
          this.totalCorreos = resp;
        },
      }
    );
    this.agendaService.agendaBandejaCorreoOperacionesService.envioCorreoGrupos$.subscribe(
      {
        next: (resp: any) => {
          console.log('envioCorreoGrupos', resp);
          if (resp.length > 0) {
            this.formModalCorreo.get('destinatario2').setValue(resp);
          } else {
            this.formModalCorreo
              .get('destinatario2')
              .setValue(this.agendaService.rowActual.email1);
          }
        },
      }
    );
  }
  cargarCentroCostoEstadoSubEstado(listaIdEstados: Array<number>) {
    if (listaIdEstados.length > 0) {
      let idCentroCostos = this.formModalCorreo.get('centroCosto').value;
      let listaPaquetes = this.formModalCorreo.get('versiones').value;
      let listaEstado = listaIdEstados;
      let listaSubEstado = this.formModalCorreo.get('subestado').value;

      if (idCentroCostos && listaPaquetes && listaEstado) {
        this.agendaService.agendaBandejaCorreoOperacionesService.obtenerSubEstado(
          listaIdEstados
        );
        this.agendaService.agendaBandejaCorreoOperacionesService.listaSubEstados$.subscribe(
          {
            next: (resp: any) => {
              this.listaSubEstado = resp;
            },
          }
        );
        let recuperarValidado =
          this.agendaService.agendaBandejaCorreoOperacionesService.obtenerGrupoCentroCostoEstadoSubEstado$(
            idCentroCostos,
            listaPaquetes,
            listaEstado,
            listaSubEstado
          );
        if (!recuperarValidado) this.formModalCorreo.get('estado').setValue('');
        this.recargarCantidadCorreos();
      } else {
        this.alertaService.swal('Verificar los campos anteriores');
        this.formModalCorreo.get('estado').setValue(null);
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
    this.agendaService.agendaBandejaCorreoOperacionesService.obtenerGrupoCentroCostoEstadoSubEstado$(
      idCentroCostos,
      listaPaquetes,
      listaEstado,
      listaSubEstado
    );
    this.recargarCantidadCorreos();
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
  obtenerNumero(): string {
    let numero: string =
      //this.alumno.celular;
      this.agendaService.rowActual.celular;

    //numero
    numero = numero.replace('+', '');
    console.log('numerosincaracteres', numero);
    switch (this.agendaService.rowActual.idCodigoPais) {
      case 0: {
        if (numero.startsWith("00")) {
          if (numero.startsWith("0052")) {
            numero = numero.substring(4);
            numero = "521" + numero;
          } else {
            numero = numero.substring(2);
            numero = "" + numero;
          }
        } else {
          numero = "" + numero;
        }
        break;
      }
      case 51: {
        if (numero.startsWith('51')) {
          numero = `${numero}`;
        } else if (numero.startsWith('0051')) {
          numero = numero.substring(2);
          numero = `${numero}`;
        } else {
          numero = `51${numero}`;
        }
        break;
      }

      case 57: {
        if (numero.startsWith('57')) {
          numero = `${numero}`;
        } else if (numero.startsWith('0057')) {
          numero = numero.substring(2);
          numero = `${numero}`;
        } else {
          numero = `57${numero}`;
        }
        //numero = `57${numero}`;// Colombia
        break;
      }
      case 591: {
        if (numero.startsWith('591')) {
          numero = `${numero}`;
        } else if (numero.startsWith('00591')) {
          numero = numero.substring(2);
          numero = `${numero}`;
        } else {
          numero = `591${numero}`;
        }
        //numero = `591${numero}`;// Bolivia
        break;
      }
      case 52: {
        // Mexico
        if (numero.startsWith('0')) {
          numero = numero.substring(4);
          numero = `521${numero}`;
        } else if (numero.startsWith('52')) {
          if (numero.startsWith('521')) {
            numero = numero;
          } else {
            numero = numero.substring(2);
            numero = `521${numero}`;
          }
        } else if (
          !numero.startsWith('0') &&
          !numero.startsWith('521') &&
          !numero.startsWith('52')
        ) {
          //numero = numero.substring(2)
          numero = `521${numero}`;
        }
        break;
      }
      default: {
        if (numero.startsWith('00')) {
          numero = numero.substring(2);
        } else {
          numero = numero;
        }

        break;
      }
    }
    this.numeroCelular = numero;
    return numero;
  }
  edicionMensajeWhatsapp(contenido: string) {
    this.cantidadCaracteres = contenido ? contenido.length : 0;
  }
  enviarTexto() {
    //this.plantillaSeleccionada = ;
    this.consultaBloqueoRedactar();
    let mensaje = this.formEnviarWhatsapp.get('mensaje').value;
    if (this.plantillaSeleccionada && this.plantillaSeleccionada !== null) {
      if (
        this.plantillaSeleccionada.tipoPlantilla == 8 &&
        !this.bloquearEnvio
      ) {
        this.publicarMensaje(
          this.plantillaSeleccionada,
          mensaje,
          this.objetoPlantillasWhatsApp
        );
      } else if (
        this.plantillaSeleccionada.tipoPlantilla != 8 &&
        !this.bloquearEnvio
      ) {
        this.publicarMensaje(
          this.plantillaSeleccionada,
          mensaje,
          this.objetoPlantillasWhatsApp
        );
      } else {
        //this.publicarMensaje(this.plantillaSeleccionada, mensaje, this.objetoPlantillasWhatsApp);
        alert('Tiene que Pasar 24 horas desde el Ultimo mensaje del Cliente');
        this.plantillaSeleccionada = null;

        // EliminarContenido();
      }
    } else if (!this.camposDisponibles.btnEnvio) {
      this.publicarMensaje(
        this.plantillaSeleccionada,
        mensaje,
        this.objetoPlantillasWhatsApp
      );
    }
    this.formEnviarWhatsapp.reset();
    this.consultaBloqueoRedactar();
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  publicarMensaje(
    dataForm: IPlantillaWhatsapp,
    mensaje: any,
    objetoPlantillasWhatsApp: any
  ) {
    //let plantillaSeleccionada:IPlantillaWhatsapp = this.formEnviarWhatsapp.get('plantilla').value;
    let objeto: IDataEnvioWhatsapp;
    let codigoPaisEnvioWhatsapp = this.agendaService.rowActual.idCodigoPais;
    if (codigoPaisEnvioWhatsapp == 52) {
      codigoPaisEnvioWhatsapp = 0;
    }
    this.messengerUsuarioId = this.numeroCelular;
    if (this.plantillaSeleccionada && this.plantillaSeleccionada) {
      if (this.plantillaSeleccionada.tipoPlantilla == 8) {
        objeto = {
          Id: 0,
          WaTo: this.messengerUsuarioId,
          WaType: 'hsm',
          WaTypeMensaje: 8,
          WaRecipientType: 'hsm',
          WaBody: this.plantillaSeleccionada.descripcion,
          WaCaption: this.formEnviarWhatsapp.get('mensaje').value,
          IdPais: codigoPaisEnvioWhatsapp, // this.agendaService.rowActual.idCodigoPais,
          EsMigracion: true,
          IdMigracion: 0,
          IdPersonal: this.userService.userData.idPersonal,
          IdAlumno: this.agendaService.rowActual.idAlumno,
          usuario: this.userService.userName,
          datosPlantillaWhatsApp: this.objetoPlantillasWhatsApp,
        };
      } else {
        objeto = {
          Id: 0,
          WaTo: this.messengerUsuarioId,
          WaType: 'text',
          WaTypeMensaje: 1,
          WaRecipientType: 'individual',
          WaBody: this.formEnviarWhatsapp.get('mensaje').value,
          IdPais: codigoPaisEnvioWhatsapp, // this.agendaService.rowActual.idCodigoPais,
          IdPersonal: this.userService.userData.idPersonal,
          IdAlumno: this.agendaService.rowActual.idAlumno,
          EsMigracion: true,
          IdMigracion: 0,
          usuario: this.userService.userName,
        };
      }
    } else {
      objeto = {
        Id: 0,
        WaTo: this.messengerUsuarioId,
        WaType: 'text',
        WaTypeMensaje: 1,
        WaRecipientType: 'individual',
        WaBody: this.formEnviarWhatsapp.get('mensaje').value,
        IdPais: codigoPaisEnvioWhatsapp, //this.agendaService.rowActual.idCodigoPais,
        IdPersonal: this.userService.userData.idPersonal,
        IdAlumno: this.agendaService.rowActual.idAlumno,
        EsMigracion: true,
        IdMigracion: 0,
        usuario: this.userService.userName,
      };
    }

    console.log(objeto, 'pedritoselibre');
    // if (mensaje.substring(0, 1) === '/') {
    //   this.commandTriggered(mensaje);
    // } else {
    if (this.messengerUsuarioId != '' && mensaje != '') {
      if (objeto.WaType === 'hsm') {
        this.enviarMensajeValidado(objeto, this.plantillaSeleccionada);
      } else {
        this.enviarMensaje(objeto);
      }
      // EliminarContenido();
      this.plantillaSeleccionada = null;
    }
    // }
  }
  enviarMensajeValidado(objeto: IDataEnvioWhatsapp, plantillaEnviar: any) {
    //this.conectarAsesor();
    let param: IWhatsappNumeroValidado = {
      idAlumno: objeto.IdAlumno,
      numeroCelular: objeto.WaTo,
      idPais: objeto.IdPais,
      usuario: this.userService.userData.userName,
    };
    this.integraService
      .postJsonResponse(
        constApiComercial.WhatsAppNumeroValidadoVerificarInsertarNumeroValidado,
        param
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body) {
            if (objeto.WaTo == this.numeroCelular) {
              this.enviarMensaje(objeto);
              // this.integraService
              //   .postTextResponse(
              //     `${constApiOperaciones.WhatsAppMensajesWhatsAppMensaje}`,
              //     objeto
              //   ).subscribe({
              //     next: (response: HttpResponse<any>) => {
              //       console.log('llegadadewhatsappMorales', response.body);
              //     },
              //   });
              // // this.hubConnection.invoke('opSend', objeto);
              // this.consultaBloqueoRedactar();
            } else {
              this.integraService
                .getJsonResponse(
                  `${constApiComercial.WhatsAppMensajeEnviadoValidarPlantillasEnviadas}/${objeto.WaBody}/${objeto.WaTo}`
                )
                .subscribe({
                  next: (response: HttpResponse<any>) => {
                    console.log('enviarMensajeValidado', response.body);
                    if (
                      response.body == false
                      // ||
                      // plantillaEnviar.Nombre ===
                      //   'Respuesta de Seguimiento Operaciones' ||
                      // plantillaEnviar.Nombre ===
                      //   'Respuesta de Agradecimiento Operaciones' ||
                      // plantillaEnviar.Nombre ===
                      //   'Saludo de Apertura Canal Whatsapp'
                    ) {
                      this.enviarMensaje(objeto);
                      // this.integraService
                      //   .postTextResponse(
                      //     `${constApiOperaciones.WhatsAppMensajesWhatsAppMensaje}`,
                      //     objeto
                      //   )
                      //   .subscribe({
                      //     next: (response: HttpResponse<any>) => {
                      //       console.log('llegadadewhatsapp', response);
                      //     },
                      //   });
                      // // this.hubConnection.invoke('opSend', objeto);
                      // this.consultaBloqueoRedactar();
                    } else {
                      alert('Ya se Envio una plantilla Igual a Este Numero');
                    }
                  },
                });
            }
          } else {
            let param: any = {
              blocking: 'wait',
              contacts: [`+${objeto.WaTo}`],
            };
            this.integraService
              .postJsonResponse(
                `${constApiComercial.WhatsAppContactoWhatsAppValidarNumeros}/${this.userService.userData.idPersonal}/${objeto.IdPais}`,
                param
              )
              .subscribe({
                complete: () => {
                  this.integraService
                    .getJsonResponse(
                      `${constApiComercial.WhatsAppMensajeEnviadoValidarPlantillasEnviadas}/${objeto.WaBody}/${objeto.WaTo}`
                    )
                    .subscribe({
                      next: (response: HttpResponse<any>) => {
                        if (response.body) {
                          this.enviarMensaje(objeto);
                          // this.integraService
                          //   .postTextResponse(
                          //     `${constApiOperaciones.WhatsAppMensajesWhatsAppMensaje}`,
                          //     objeto
                          //   )
                          //   .subscribe({
                          //     next: (response: HttpResponse<any>) => {
                          //       console.log('llegadadewhatsapp', response.body);
                          //     },
                          //   });
                          // // this.hubConnection.invoke('opSend', objeto);
                          // this.consultaBloqueoRedactar();
                        } else {
                          alert(
                            'Ya se Envio una plantilla Igual a Este Numero'
                          );
                        }
                      },
                    });
                },
              });
          }
        },
      });
  }

  commandTriggered(cmd: string) {
    cmd = cmd.substring(1);
    let parts: string[] = cmd.split(' ');
    var msg = '';
    if (parts.length > 2) {
      for (var p = 2; p < parts.length; p++) msg += parts[p] + ' ';
    }

    // built-in command
    if (parts[0] === 'list') {
      var modalBody = 'asd'; //$('#modal-cmd').find('.modal-body');
      if (modalBody !== null) {
        var commands = this.obtenerComandos();
        var body =
          '<p><strong>/list</strong> list all available commands.</p>' +
          '<p><strong>/add command-name text to be sent</strong> add a new command.</p>' +
          '<p><strong>/edit command-name text to be sent</strong> edit an existing command.</p>' +
          '<p><strong>/del command-name</strong> remove an exising command.</p>' +
          '<p><strong>/transfer agent-name</strong> transfer the current chat to another agent.</p>';
        body += '<br />';
        for (var i = 0; i < commands.length; i++) {
          body +=
            '<p><strong>/' +
            commands[i].trigger +
            '</strong> ' +
            commands[i].msg +
            '</p>';
        }
        // modalBody.html(body);
        // $('#modal-cmd').modal({ keyboard: true });
      }
    } else if (parts[0] === 'add') {
      var exists = this.obtenerComando(parts[1]);
      if (exists === null) {
        exists = { trigger: parts[1], msg: msg };
        var commands = this.obtenerComandos();
        commands.push(exists);
        // AgregarComandos(commands);
        // $('#chatmsgs' + this.messengerUsuarioId).append('<p><strong>system</strong> ' + parts[1] + ' command added.</p>');
      } else {
        // $('#chatmsgs' + this.messengerUsuarioId).append('<p><strong>system</strong> The command <em>' + parts[1] + '</em> already exists, please use /edit instead.</p>');
      }
    } else if (parts[0] === 'edit') {
      var commands = this.obtenerComandos();
      for (var i = 0; i < commands.length; i++) {
        if (commands[i].trigger === parts[1]) commands[i].msg = msg;
      }
      // AgregarComandos(commands);
      // $('#chatmsgs' + this.messengerUsuarioId).append('<p><strong>system</strong> ' + parts[1] + ' has been changed.</p>');
    } else if (parts[0] === 'del') {
      var commands = this.obtenerComandos();
      var newCommands = [];
      for (var i = 0; i < commands.length; i++) {
        if (commands[i].trigger !== parts[1]) newCommands.push(commands[i]);
      }
      // this.agregarComandos(newCommands);
      // $('#chatmsgs' + this.messengerUsuarioId).append('<p><strong>system</strong> ' + parts[1] + ' has been removed.</p>');
    } else if (parts[0] === 'transfer') {
      var chatId = this.messengerUsuarioId;
      // _integraProxy.server.transfer(chatId, parts[1], $('#chatmsgs' + chatId).html());
      // setTimeout(function () {
      //   $("div[data-id='" + chatId + "']").remove();
      //   $('#chatmsgs' + chatId).remove();
      //   $('.chat-session').removeClass('active');
      //   MostrarChat('rt');
      // }, 2500);
    } else {
      var command = this.obtenerComando(parts[0]);
      var chatId = this.messengerUsuarioId;
      // if (command !== null && chatId !== '') {
      //     _integraProxy.server.opSend(chatId, command.msg);
      // } else {
      //     $('#chatmsgs' + chatId).append('<p><strong>system</strong> ' + parts[1] + ' is not a recongnized command, use /list to view available commands.</p>');
      // }
    }
  }
  validarBloqueoEnvioMensaje(objeto: IMensajesWhatsapp[]): boolean {
    let ultimoMensaje: IMensajesWhatsapp | any = null;
    if (objeto.length !== undefined) {
      ultimoMensaje = objeto[objeto.length - 1];
    } else {
      ultimoMensaje = objeto;
    }
    if (ultimoMensaje == undefined) return true;
    if (ultimoMensaje.tipo == 2) {
      let diferenciaDia =
        new Date().getTime() - ultimoMensaje.fechaCreacion.getTime();
      let cantidadHoras = diferenciaDia / (1000 * 60 * 60);
      return cantidadHoras >= 24 ? true : false;
    } else {
      let cantidad = objeto.length - 1;
      while (ultimoMensaje.tipo == 1 && cantidad != -1) {
        if (objeto[cantidad].tipo != 1) {
          ultimoMensaje = objeto[cantidad];
          ultimoMensaje.tipo = 2;
        }
        cantidad--;
      }
      let diferenciaDiaPorAsesor =
        new Date().getTime() - ultimoMensaje.fechaCreacion.getTime();
      let cantidadHorasPorAsesor = diferenciaDiaPorAsesor / (1000 * 60 * 60);
      return cantidadHorasPorAsesor >= 24 || cantidad === -1 ? true : false;
    }
  }
  obtenerComandos() {
    var cmdKey = this.getStoredCommands('lcsk-cmd');
    return cmdKey !== null && cmdKey !== '' ? JSON.parse(cmdKey) : [];
  }
  obtenerComando(trigger: any) {
    let commands = this.obtenerComandos();
    if (commands.length > 0) {
      for (let i = 0; i < commands.length; i++) {
        if (commands[i].trigger == trigger) return commands[i];
      }
    }
  }
  agregarComandos(commands: string) {
    this.setStoredCommands('lcsk-cmd', JSON.stringify(commands));
  }
  setStoredCommands(key: any, data: any) {
    if (this.hasStorage()) {
      localStorage.setItem(key, data);
    }
  }
  getStoredCommands(key: string): any {
    if (this.hasStorage()) {
      return localStorage.getItem(key);
    }
  }
  hasStorage() {
    return typeof Storage !== 'undefined';
  }

  // nombreCompleto = 'Vasquez Bravo Annie Gabriela';
  // idPersonal = 2;

  //local
  //urlSignal:'https://integrav4-signalrcore.bsginstitute.com'
  //produccion
  //urlSignal:'https://integrav4-signalrcore.bsginstitute.com'
  //urlSignal:'https://integrav4-signalrcore.bsginstitute.com/'

  eliminarMensaje() {
    //if (!this.bloquearEnvio){
    //this.alertaService.swalFire('Error', 'No se puede enviar mensajes, el asesor ya ha enviado un mensaje en las últimas 24 horas.', 'error');
    this.formEnviarWhatsapp.patchValue({ mensaje: '' });
    //this.consultaBloqueoRedactar()
    //}
    //else{
    //this.formEnviarWhatsapp.get('mensaje').enable();
    //this.formEnviarWhatsapp.patchValue({ mensaje: '' });
    //}
    this.consultaBloqueoRedactar();
  }
  enviarMensajes() {
    let plantillaSeleccionada: IPlantillaWhatsapp =
      this.formEnviarWhatsapp.get('plantilla').value;
    let objeto: IDataEnvioWhatsapp;
    this.messengerUsuarioId = this.numeroCelular;
    if (plantillaSeleccionada !== null && plantillaSeleccionada !== undefined) {
      if (plantillaSeleccionada.tipoPlantilla === 8) {
        objeto = {
          Id: 0,
          WaTo: this.messengerUsuarioId,
          WaType: 'hsm',
          WaTypeMensaje: 8,
          WaRecipientType: 'hsm',
          WaBody: plantillaSeleccionada.descripcion,
          WaCaption: this.formEnviarWhatsapp.get('mensaje').value,
          IdPais: this.agendaService.rowActual.idCodigoPais,
          EsMigracion: true,
          IdMigracion: 0,
          IdPersonal: this.userService.userData.idPersonal,
          IdAlumno: this.agendaService.rowActual.idAlumno,
          usuario: this.userService.userData.userName,
          datosPlantillaWhatsApp: this.objetoPlantillasWhatsApp,
        };
      } else {
        objeto = {
          Id: 0,
          WaTo: this.messengerUsuarioId,
          WaType: 'text',
          WaTypeMensaje: 1,
          WaRecipientType: 'individual',
          WaBody: this.formEnviarWhatsapp.get('mensaje').value,
          IdPais: this.agendaService.rowActual.idCodigoPais,
          IdPersonal: this.userService.userData.idPersonal,
          IdAlumno: this.agendaService.rowActual.idAlumno,
          EsMigracion: true,
          IdMigracion: 0,
          usuario: this.userService.userData.userName,
        };
      }
    } else {
      objeto = {
        Id: 0,
        WaTo: this.messengerUsuarioId,
        WaType: 'text',
        WaTypeMensaje: 1,
        WaRecipientType: 'individual',
        WaBody: this.formEnviarWhatsapp.get('mensaje').value,
        IdPais: this.agendaService.rowActual.idCodigoPais,
        IdPersonal: this.userService.userData.idPersonal,
        IdAlumno: this.agendaService.rowActual.idAlumno,
        EsMigracion: true,
        IdMigracion: 0,
        usuario: this.userService.userName,
      };
    }
    this.enviarMensaje(objeto);
  }
  AgregarMensaje(waTo: any, asesor: any, waBody: any, per: any) {
    console.log('mensajellegoComponenteWhatsapp');
    let mensajeIndicadorError: IMensajesWhatsapp = null;
    //if(per == 0) { this.alertaService.mensajeExitosoWhatsapp(`WhatsApp - Tienes un mensaje de: ${waTo} 23:13`) }
    if (waTo == 'internal') {
      // this.barraDesplazamiento();
      mensajeIndicadorError = {
        numero: waTo,
        tipo: 1,
        mensaje: waBody,
        idPersonal: null,
        fechaCreacion: new Date(),
        idAlumno: null,
      };
    } else if (waTo == this.numeroCelular) {
      switch (per) {
        case 0:
          this.agendaService.agendaHistorialChatOperacionesService
            .obtenerHistorialMensajeRecibidoChat$(
              this.agendaService.rowActual.idPersonal_Asignado,
              waTo
            )
            .subscribe({
              next: (response: HttpResponse<IFilaWhatsapp[]>) => {
                this.gridMensajesRecibidosWhatsapp.data = response.body;
              },
              error: (error: any) => {
                this.alertaService.notificationError(
                  `Error: ${this.reconocerError(error)}`
                );
              },
            });
          mensajeIndicadorError = {
            numero: waTo,
            tipo: 2,
            mensaje: waBody,
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: asesor,
          };
          //this.bloquearEnvio = false;
          this.bloquearTextArea = false;
          this.camposDisponibles.btnAdjunto = false;
          this.camposDisponibles.btnEnvio = false;
          this.camposDisponibles.btnEliminar = false;
          //this.consultaBloqueoRedactar()
          break;
        case 1:
          mensajeIndicadorError = {
            numero: waTo,
            tipo: 1,
            mensaje: waBody,
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: asesor,
          };
          break;
        case 2:
          break;
      }
      // this.barraDesplazamiento();
      this.historialMensajeRecibidosChat.push(mensajeIndicadorError);
    }
  }
  recargarHistorial(data: any) {
    // if ($('#gridMensajesWhatsAppCoordinador').data('kendoGrid')) { $('#gridMensajesWhatsAppCoordinador').data('kendoGrid').dataSource.read() }
    this.reproducirNotificacion();
    //this.consultaBloqueoRedactar()
  }
  dataArchivo: any = null;
  seleccionarArchivo(dataRow: any) {
    if (dataRow.target.files.length > 0) {
      this.dataArchivo = dataRow.target.files[0];
      this.modalService.open(this.modalSeleccionarArchivo, {
        size: 'sm',
        backdrop: 'static',
      });
    }
  }
  enviarMensaje(objeto: IDataEnvioWhatsapp) {
    //this.conectarAsesor();
    let mensajeEnvido: any = null;
    let mensajeIndicador: IMensajesWhatsapp = null;
    mensajeEnvido = objeto.WaBody;
    this.integraService
      .postJsonResponse(
        `${constApiOperaciones.WhatsAppMensajesWhatsAppMensaje}`,
        objeto
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('llegadadewhatsapp', response.body);
          this.esEnvioCorrecto = response.body.estadoMensaje
          if(this.esEnvioCorrecto==true){
            this.notificacionEnvioFallido('success', 'El mensaje fue enviado Correctamente');
          }else{
            this.notificacionEnvioFallido('error', 'El mensaje no fue enviado');
          }
          mensajeIndicador = {
            numero: this.numeroCelular,
            tipo: 1,
            mensaje: response.body.mensaje,
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: this.nombreAsesor,
          };
          // if (
          //   response.body ==
          //   'Error en credenciales de login o nrevise su conexcion de red para el servidor de whatsapp.'
          // ) {
          //   mensajeIndicador = {
          //     numero: this.numeroCelular,
          //     tipo: 1,

          //     mensaje:
          //       'Error en credenciales de login o nrevise su conexcion de red para el servidor de whatsapp.',
          //     idPersonal: null,
          //     fechaCreacion: new Date(),
          //     idAlumno: null,
          //     estadoMensaje: 1,
          //     nombrePersonal: this.nombreAsesor,
          //   };
          // } else if (response.body == 'El numero esta desuscrito') {
          //   mensajeIndicador = {
          //     numero: this.numeroCelular,
          //     tipo: 1,
          //     mensaje: 'El numero esta desuscrito',
          //     idPersonal: null,
          //     fechaCreacion: new Date(),
          //     idAlumno: null,
          //     estadoMensaje: 1,
          //     nombrePersonal: this.nombreAsesor,
          //   };
          // } else if (
          //   response.body ==
          //   'Los datos enviados no pueden ser nulos o estar vacios'
          // ) {
          //   mensajeIndicador = {
          //     numero: this.numeroCelular,
          //     tipo: 1,
          //     mensaje: 'Los datos enviados no pueden ser nulos o estar vacios',
          //     idPersonal: null,
          //     fechaCreacion: new Date(),
          //     idAlumno: null,
          //     estadoMensaje: 1,
          //     nombrePersonal: this.nombreAsesor,
          //   };
          // } else if (response.body == 'User is not valid') {
          //   mensajeIndicador = {
          //     numero: this.numeroCelular,
          //     tipo: 1,
          //     mensaje: 'El usuario no cuenta con el servicio actualmente',
          //     idPersonal: null,
          //     fechaCreacion: new Date(),
          //     idAlumno: null,
          //     estadoMensaje: 1,
          //     nombrePersonal: this.nombreAsesor,
          //   };
          // } else {
          //   mensajeIndicador = {
          //     numero: this.numeroCelular,
          //     tipo: 1,
          //     mensaje: mensajeEnvido,
          //     idPersonal: null,
          //     fechaCreacion: new Date(),
          //     idAlumno: null,
          //     estadoMensaje: 1,
          //     nombrePersonal: this.nombreAsesor,
          //   };
          // }

          this.historialMensajeRecibidosChat.push(mensajeIndicador);
        },
        error: (error: any) => {
          mensajeIndicador = {
            numero: this.numeroCelular,
            tipo: 1,
            mensaje: 'Problemas con el Servicio de whatsapp',
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: this.nombreAsesor,
          };
          this.historialMensajeRecibidosChat.push(mensajeIndicador);
          this.notificacionEnvioFallido('error', 'Fallo el servicio');
        },
      });
    // this.hubConnection.invoke('OpSend', ContenidoObjeto);
    this.consultaBloqueoRedactar();
  }
  notificacionEnvioFallido(icono: any, title: any) {
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: icono, //'error',
      title: title, // 'No Se Pudo enviar el Mensaje'
    });
  }
  dataDocumento: any = null;
  almacenarDataDocumento(dataRow: any) {
    this.dataDocumento = dataRow.selectedRows[0].dataItem;
  }
  estadoMensajeCaracteresInvalidos: boolean = false;
  estadoMensajeErrorCargarDocumentos: boolean = false;
  adjuntarArchivoWhatsapp(nombreModal: any) {
    var fdata = new FormData();
    this.messengerUsuarioId = this.numeroCelular;
    if (!this.bloquearEnvio) {
      let nombreTipoSelecionado: string = null;
      let WaType: string = null;
      let objetoArchivo: any = null;
      if (this.dataArchivo.type == 'application/pdf') {
        nombreTipoSelecionado = 'archivosubido';
        WaType = 'document';
      } else if (this.dataArchivo.type == 'image/png' || this.dataArchivo.type =='image/jpeg') {
        nombreTipoSelecionado = 'imagensubida';
        WaType = 'image';
      }
      fdata.append('file', this.dataArchivo);
      this.integraService
        .postFormJsonResponse(
          constApiOperaciones.WhatsAppMensajeRecibidoAdjuntarArchivoWhatsApp,
          fdata
        )
        .subscribe({
          next: (response: any) => {
            if (response.resultado != 'Error') {
              objetoArchivo = {
                WaId: '0',
                WaTo: this.messengerUsuarioId,
                WaType: WaType,
                WaTypeMensaje: 2,
                WaRecipientType: 'individual',
                WaLink: response.urlArchivo,
                WaFileName: response.nombreArchivo,
                IdPais: this.agendaService.rowActual.idCodigoPais,
                IdPersonal: this.userService.userData.idPersonal,
                IdAlumno: this.agendaService.rowActual.idAlumno,
                EsMigracion: true,
                IdMigracion: 0,
                usuario: this.userService.userName,
              };
              //sleep(2000);
              if (this.messengerUsuarioId != '') {
                this.enviarMensaje(objetoArchivo);
                this.dataArchivo = null;
              } else {
                this.estadoMensajeCaracteresInvalidos = true;
                this.dataArchivo = null;
              }
            } else {
              this.dataArchivo = null;
            }
          },
          error: (error: any) => {
            this.dataArchivo = null;
          },
        });
    } else {
      alert('Tiene que Pasar 24 horas desde el Ultimo mensaje del Cliente');
      this.dataArchivo = null;
    }
    nombreModal.dismiss();
  }
  recargarChatHistorial() {
    this.startConnection();
    this.consultaBloqueoRedactar();
    //this.consultaBloqueoRedactar()
    //this.consultarPlantillaEnviadaEn24Horas()
    console.log('esaqui4');
    let dataItem: any = this.dataGrillaMensajeWhatsappSeleccionado;
    this.loaderHistorialMensajes = true;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.WhatsAppMensajeEnviadoWhatsAppHistorialMensajeChat}/${this.agendaService.rowActual.idPersonal_Asignado}/${this.numeroCelular}/${this.agendaService.areaTrabajo}`
      )
      .subscribe({
        next: (response: HttpResponse<IMensajesWhatsapp[]>) => {
          response.body.map(
            (data: any) => (data.fechaCreacion = new Date(data.fechaCreacion))
          );
          this.historialMensajeRecibidosChat = response.body;
          console.log('historialMensajeRecibidosChat', response.body);
          this.loaderHistorialMensajes = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${this.reconocerError(error)}`
          );
          this.loaderHistorialMensajes = false;
        },
      });
  }
  cerrarMensajeCaracteresInvalidos() {
    this.estadoMensajeCaracteresInvalidos = false;
  }
  cerrarMensajeErrorCargaDocumentos() {
    this.estadoMensajeErrorCargarDocumentos = false;
  }
  enviarDocumentoAgendaModal(nombreModal: any) {
    if (!this.bloquearEnvio) {
      if (this.dataDocumento.Mensaje == 'Correcto') {
        let objeto: any = {
          WaTo: this.messengerUsuarioId,
          WaType: 'document',
          WaTypeMensaje: 2,
          WaRecipientType: 'individual',
          WaLink: this.dataDocumento.Url,
          WaFileName: this.dataDocumento.NombreDocumento,
          IdPais: this.agendaService.rowActual.idCodigoPais,
          IdPersonal: this.userService.userData.idPersonal,
          IdAlumno: this.agendaService.rowActual.idAlumno,
          EsMigracion: true,
          IdMigracion: 0,
          usuario: this.userService.userName,
        };
        if (this.messengerUsuarioId && this.dataDocumento.NombreDocumento) {
          this.enviarMensaje(objeto);
          nombreModal.dismiss();
        }
      } else {
        this.estadoMensajeErrorCargarDocumentos = true;
      }
    } else {
      this.alertaService.swalFire(
        'Envio Invalido',
        'Debe de Pasar 24 horas tras el Ultimo mensaje',
        'warning'
      );
    }
  }
  // conectar() {
  //   //this.hubWhatsap = this.SignalRService.connection('hubIntegraHub',this.agendaService.idPersonal,this.agendaService.userName)
  //   this.hubConnection = new signalR.HubConnectionBuilder()
  //     .withUrl(`https://integrav4-signalrcore.bsginstitute.com/hubChatWhatsapp_Peru`+'?idUsuario='+this.agendaService.idPersonal+'&&usuarioNombre='+this.agendaService.userName
  //     +'&&rooms=' +
  //     '' +
  //     '')
  //     .build();

  //   this.hubConnection.serverTimeoutInMilliseconds = 36000000;

  //   this.hubConnection.on('AgregarMensaje', (waTo: string, asesor: string, waBody: string, per: number) => {
  //     this.AgregarMensaje(waTo, asesor, waBody, per)
  //   });

  //   this.hubConnection.on('recargarHistorial', (data: number) => {

  //     this.recargarHistorial(data)
  //     //this.actualizardivchat()
  //   })

  //   this.hubConnection.start()
  //     .then(() => { console.log('Connection Started') })
  //     .catch((err:any) => { return console.error(err) });
  // }

  async conectar() {
    this.hubConnection = new signalR.HubConnectionBuilder()

      .withUrl(
        `https://integrav4-signalrcore.bsginstitute.com/hubChatWhatsapp_Peru?idUsuario=${this.agendaService.idPersonal}&usuarioNombre=${this.agendaService.userName}&rooms=""`
      )
      .withAutomaticReconnect()
      .build();
    this.hubConnection.serverTimeoutInMilliseconds = 300000;
    this.hubConnection.serverTimeoutInMilliseconds = 36000000;

    this.hubConnection.on('recargarHistorial', (data: number) => {
      this.recargarHistorial(data);
    });

    await this.startConnection();
  }

  private async startConnection(): Promise<void> {
    try {
      await this.hubConnection.start();
      console.log('Connection started - Componente Whatsapp ATC');
      this.hubConnection.invoke(
        'AsesorConectado',
        this.agendaService.userName,
        this.agendaService.idPersonal
      );
      this.hubConnection.on(
        'AgregarMensaje',
        (Numero: any, IdAlumno: any, value: string, per: number) => {
          this.AgregarMensaje(Numero, IdAlumno, value, per);
        }
      );
    } catch (err) {
      console.error(
        'Error while starting connection:  - Componente Whatsapp ATC ' + err
      );
    }

    this.hubConnection.onclose(() => {
      console.log('Connection closed - Componente Whatsapp ATC');
      setTimeout(() => this.startConnection(), 1000);
    });
  }

  revisarConexion() {
    if (this.hubConnection.state === 'Connected') {
      console.log('La conexión está activa Componente CHAT');
    } else {
      console.log('La conexión está inactiva Componente CHAT');
      this.startConnection();
    }
  }
}

interface ICentroCosto {
  IdPaquete: number;
  Paquete: string;
  IdCentroCosto: number;
}
interface IWhatsappNumeroValidado {
  idAlumno: number;
  numeroCelular: string;
  idPais: number;
  usuario: string;
}
interface IModeloMensaje {
  Id: number;
  WaTo: string;
  WaType: string;
  WaTypeMensaje: number;
  WaRecipientType: string;
  WaBody: string;
  IdPais: number;
  IdPersonal: number;
  IdAlumno: number;
  EsMigracion: boolean;
  IdMigracion: number;
  usuario: string;
  WaCaption?: string;
  datosPlantillaWhatsApp?: any;
}
interface IFilaWhatsapp {
  numero: string;
  mensaje?: string;
  idPersonal: number;
  idPais?: number;
  idAlumno?: number;
  fechaCreacion?: Date | string;
  nombreAlumno?: string;
}

interface IDatosEstadoContactoWhatsapp {
  idClasificacionPersona: number;
  id: number;
  nombre1: string;
  nombre2: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  DNI: string;
  direccion: string;
  fechaNacimiento: Date | string;
  telefono: string;
  celular: string;
  email1: string;
  email2: string;
  genero: any;
  parentesco: any;
  telefonoFamiliar: any;
  nombreFamiliar: any;
  empresa: any;
  idCargo: number;
  cargo: any;
  idAFormacion: number;
  aFormacion: any;
  idATrabajo: number;
  aTrabajo: any;
  idIndustria: number;
  industria: any;
  idReferido: number;
  referido: any;
  idCodigoPais: number;
  nombrePais: any;
  idCiudad: number;
  nombreCiudad: any;
  horaContacto: any;
  horaPeru: any;
  telefono2: any;
  celular2: any;
  idEmpresa: number;
  idOportunidad_Inicial: number;
  idTipoDocumento: number;
  nroDocumento: any;
  descripcionCargo: any;
  asociado: any;
  idEstadoContactoWhatsApp: number;
  idEstadoContactoWhatsAppSecundario: any;
  rutaBandera: any;
}

interface IDocumentosWhatsapp {
  PEspecifico: number;
  Oportunidad: IDatosOportunidad;
  ListaDocumentos: IDocumentos[];
  ContenidoCertificado: any;
}

interface IDatosOportunidad {
  Id: number;
  IdCentroCosto: number;
  IdPersonalAsignado: number;
  IdTipoDato: number;
  IdFaseOportunidad: number;
  IdOrigen: number;
  IdPgeneral: number;
  IdAlumno: number;
  UltimoComentario: string;
  IdActividadDetalleUltima: number;
  IdActividadCabeceraUltima: number;
  IdEstadoActividadDetalleUltimoEstado: number;
  UltimaFechaProgramada: Date | string;
  IdEstadoOportunidad: number;
  IdEstadoOcurrenciaUltimo: number;
  IdFaseOportunidadMaxima: number;
  IdFaseOportunidadInicial: number;
  IdCategoriaOrigen: number;
  CodigoPagoIC: string;
  NombrePatner: string;
  EncabezadoCorreoPartner: any;
  PrecioContado: any;
  NombreProgramaGeneral: string;
  CostoTotalConDescuento: any;
  pw_duracion: string;
  FechaEnvio: Date | string;
  IdMatricula: string;
  Central: string;
  UrlVersion: string;
  UrlBrochurePrograma: string;
  Anexo3CX: string;
  UrlFirmaCorreos: string;
  Email: string;
  urlPartner: string;
  NombreCiudad: string;
  Promocion25: any;
  IdCodigoPais: number;
}

interface IDocumentos {
  Id: number;
  NombreDocumento: string;
  Habilitado: boolean;
  Url: string;
  DocumentoByte: any;
  Mensaje: string;
  MensajeDetalle: string;
  ListadoAlertas: any;
}

interface IDataEnvioWhatsapp {
  Id: number;
  WaTo: string;
  WaId?: string;
  WaType: string;
  WaTypeMensaje?: number;
  WaRecipientType: string;
  WaBody: string;
  WaFile?: string;
  WaFileName?: string;
  WaMimeType?: string;
  WaSha256?: string;
  WaLink?: string;
  WaCaption?: string;
  IdPais: number;
  EsMigracion?: boolean;
  IdMigracion?: number;
  IdPersonal: number;
  IdAlumno: number;
  usuario: string;
  datosPlantillaWhatsApp?: IDatosPlantillaWhatsapp[];
}

interface IDatosPlantillaWhatsapp {
  codigo: string;
  texto: string;
}

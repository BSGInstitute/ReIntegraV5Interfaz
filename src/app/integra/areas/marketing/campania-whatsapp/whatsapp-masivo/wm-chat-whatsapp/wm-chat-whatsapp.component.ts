import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
  ViewChildren,
  QueryList,
  ChangeDetectorRef,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IntegraService } from '@shared/services/integra.service';
import { constApiComercial, constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ExpansionPanelComponent } from '@progress/kendo-angular-layout';
import { IOportunidadFormularioWhatsapp } from '@comercial/models/interfaces/imodulo-creacion-oportunidad';
import Swal from 'sweetalert2';
import { UserService } from '@shared/services/user.service';
import { NotificationService } from '@progress/kendo-angular-notification';
import { WmModalPlantillaComponent } from './wm-modal-plantilla/wm-modal-plantilla.component';
import { WHATSAPP_MENSAJE_ENVIADO } from '@apiIntegra/marketing/whatsapp/whatsapp-mensaje-enviado';
import { Combo, ComboModuloWhatsapp } from '../models/combo- modulo-whatsapp';
import {
  ChatWhatsAppMarketing,
  ChatWhatsAppMarketingPorCelular,
  ListaAlumnosPorCelular,
} from '../models/chat-whatsapp-marketing';
import {
  AlumnoWhatsapp,
  DatosAlumnoWhatsapp,
  HistorialAlumno,
} from '../models/atributos-alumno';
import { IMensajesWhatsapp } from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import { WhatsAppMensajeArchivo } from '@marketing/whatsapp-Facebook-masivo/whatsapp-facebook-oportunidad/whatsapp-facebook-oportunidad.component';
import { WhatsappFacebookService } from '@marketing/services/whatsapp-facebook.service';
import { el } from 'date-fns/locale';

interface DataDialog {
  chatPorCelular: ChatWhatsAppMarketingPorCelular[];
  dataItem: ChatWhatsAppMarketing;
}

@Component({
  selector: 'app-wm-chat-whatsapp',
  templateUrl: './wm-chat-whatsapp.component.html',
  styleUrls: ['./wm-chat-whatsapp.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WmChatWhatsAppComponent implements OnInit {
  @ViewChild('contentC', { static: true }) containerRef!: ElementRef;
  @ViewChild('modalOportunidad') modalOportunidad: DataDialog;
  @ViewChild('modalExtraerRegistros') modalExtraerRegistros: DataDialog;
  @ViewChild('modalSemaforoFinanciero') modalSemaforoFinanciero: any;
  @ViewChild('modalSeleccionarArchivo') modalSeleccionarArchivo: any;
  @ViewChildren(ExpansionPanelComponent)
  panels: QueryList<ExpansionPanelComponent>;
  @ViewChild('nroDoc') nroDoc: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DataDialog,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private userService: UserService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef,
    private whatsappFacebookService: WhatsappFacebookService,
    private cdr: ChangeDetectorRef
  ) {}

  usuario = JSON.parse(localStorage.getItem('userData'));
  focusedDate: Date = new Date();
  formProgramarActividad: FormGroup = this.formBuilder.group({
    comentario: ['', Validators.maxLength(500)],
    fechaProgramada: [null],
    idAsesor: [null, Validators.required],
  });

  formdni: FormGroup = this.formBuilder.group({
    dni: [
      '',
      [
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(8),
        Validators.maxLength(8),
      ],
    ],
  });

  formExtraccionRegistros: FormGroup;
  rangoExtraccionRegistros = [
    { label: '1 día', value: 1 },
    { label: '2 días', value: 2 },
    { label: '3 días', value: 3 },
    { label: '4 días', value: 4 },
    { label: '5 días', value: 5 },
    { label: '6 días', value: 6 },
    { label: '7 días', value: 7 },
  ];
  abrirModalFlag = false;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  formAlumno = this.formBuilder.group({
    nombre1: [''],
    nombre2: [''],
    apellidoPaterno: [''],
    apellidoMaterno: [''],
    celular1: [''],
    celular2: [''],
    email1: [''],
    email2: [''],
    areaFormacion: [null],
    cargo: [null],
    areaTrabajo: [null],
    industria: [null],
    dni: [''],
    tamanioEmpresa: [null],
  });

  dateTimeConfig = {
    format: 'yyyy-MM-dd HH:mm',
    min: new Date(),
    max: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    readonly: false,
  };
  onValueChangeComentario(event: string): void {
    let cant = event.length;
    this.counter = `${cant}/500`;
  }
  rangoProbabilidad: string = '';
  counter: string = '';
  programaNombre: string = '';
  mostrarPrimerModal: boolean = false;
  mostrarSegundoModal: boolean = false;
  probabilidadNivel: string = '';
  aptitud: boolean = false;
  mensaje: string = '';
  listaVentaCruzada: any[] = [];
  mostrarTercerModal: boolean = false;
  fechaLlamada: Date | null = null;
  horaLlamada: string = '';
  comentario: string = '';
  listaAsesores: any[] = [];
  asesorSeleccionado: any;
  programaSeleccionado: any;
  idOportunidad: number | undefined; // Propiedad de clase
  idAsesorActual: number | undefined; // Declara como propiedad de clase

  idAlumnoInput: number;
  dataCentroCosto: Combo[] = [];
  dataCentroCostoModal: Combo[] = [];
  sourceCentroCosto: Combo[] = [];
  sourceCentroCostoModal: Combo[] = [];

  dataAsesor: Combo[] = [];
  dataAsesorModal: Combo[] = [];
  sourceAsesor: Combo[] = [];
  sourceAsesorModal: Combo[] = [];
  EstadoAsignacion: number = 0;
  formOportunidad: FormGroup = this.formBuilder.group({
    idCentroCosto: ['', Validators.required],
    idPersonalAsignado: [null],
  });

  modalRef: any;
  loaderGeneral = false;
  alumnoTemp: any;

  existeSemaforo: boolean;

  datosChat: ChatWhatsAppMarketingPorCelular = null;
  alumnosPorCelular: ListaAlumnosPorCelular[] = [];
  mensajesWhats: any = [];

  newMessage: string;

  usario = JSON.parse(localStorage.getItem('userData'));
  wordCount: number = 0;
  idAlumno: any;
  celularAlumno = '';
  idPersonal: any;

  editar = false;

  listaAreaFormacion: Combo[] = [];
  listaAreaTrabajo: Combo[] = [];
  listaCargo: Combo[] = [];
  listaIndustria: Combo[] = [];
  listaTamanioEmpresa: Combo[] = [];

  historialAlumno: HistorialAlumno[] = [];
  loadingHistorialAlumno: boolean = false;

  showCrearOportunidadContenedor = false;
  loader: any = false;
  idAlumnoExpansion: any;
  panelAbierto: number | null = null;
  celularGrilla: any;
  idPais: any;
  idAlumnoEnvio: number;
  oportunidadCreada: boolean = false;

  archivoTemporal: File = null;
  fileWhatsapp: any;
  modalArchivoRef: NgbModalRef;
  dragOver: boolean = false;
  loaderChatWhatsapp: boolean = false;
  indexPanelAbierto: number = -1;

  ngOnInit(): void {
    this.loader = true;
    this.formAlumno.disable();
    if (this.data.dataItem != null) {
      this.idPersonal = this.data.dataItem.idPersonal;
      this.celularAlumno = this.data.dataItem.celular;
      this.idAlumno = this.data.dataItem.idAlumno ?? 0;
      this.AsignacionWhatsapp();
      this.obtenerChatWhatsAppMarketingPorCelular();
      this.obtenerAsesor();
      this.mostrarModalMotivoDerivacion(
        this.data.dataItem.requiereDerivacion,
        this.data.dataItem.estadoInteraccion,
        this.data.dataItem.mensajeParaAsesor
      );
    } else if (this.data.chatPorCelular != null) {
      if (this.data.chatPorCelular.length > 0) {
        this.celularAlumno = this.data.chatPorCelular[0].celularUM;
        this.idAlumno = this.data.chatPorCelular[0].idAlumnoUM;
        this.datosChat = this.data.chatPorCelular[0];
        this.idPersonal = 4659;
        this.rangoProbabilidad = this.data.chatPorCelular[0].rango;
      }
      this.alumnosPorCelular = this.datosChat.listaAlumnosPorCelular;
      this.mensajesWhats = this.datosChat.mensajePorCelular;
      this.loader = false;
    }
    this.obtenerCombos();

    this.formExtraccionRegistros = this.formBuilder.group({
      rangoExtraccion: [null, Validators.required],
    });
  }

  mostrarModalMotivoDerivacion(
    requiereDerivacion: boolean,
    estadoInteraccion: string,
    mensajeParaAsesor: string
  ) {
    if (requiereDerivacion) {
      Swal.fire({
        text: mensajeParaAsesor,
        confirmButtonText: 'OK',
      }).then((result) => {
        // Si el perfil esta completo, se abre el panel del alumno
        if (result.isConfirmed && estadoInteraccion.toLowerCase() === 'fin') {
          this.indexPanelAbierto = 0;
          const alumno = this.alumnosPorCelular[0];
          this.onExpandedChange(true, alumno);

          if (this.alumnosPorCelular[0].idAlumno > 0) {
            setTimeout(() => {
              this.onEdit();
              this.ObtenerDatosExtraidosInteraccionAutomatica();
            });
          } else {
            this.ObtenerDatosExtraidosInteraccionAutomatica();
          }
        }
      });
    }
  }

  ObtenerDatosExtraidosInteraccionAutomatica() {
    this.loader = true;
    this.integraService
      .obtener(
        `${WHATSAPP_MENSAJE_ENVIADO.ObtenerDatosExtraidosInteraccionAutomatica}/${this.celularAlumno}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          const datosExtraidos = response.body.datos_extraidos;

          if (
            this.formAlumno.get('nombre1').value == '' &&
            datosExtraidos.nombre != null
          ) {
            this.formAlumno.get('nombre1').setValue(datosExtraidos.nombre);
            console.log('in nombre1');
          }

          if (
            this.formAlumno.get('apellidoPaterno').value == '' &&
            datosExtraidos.apellido != null
          ) {
            this.formAlumno
              .get('apellidoPaterno')
              .setValue(datosExtraidos.apellido);
          }

          if (
            (this.formAlumno.get('areaFormacion').value == 0 ||
              this.formAlumno.get('areaFormacion').value == 153 ||
              this.formAlumno.get('areaFormacion').value == 3) &&
            datosExtraidos.idAFormacion != null
          ) {
            this.formAlumno
              .get('areaFormacion')
              .setValue(datosExtraidos.idAFormacion);
          }

          if (
            (this.formAlumno.get('cargo').value == 0 ||
              this.formAlumno.get('cargo').value == 24) &&
            datosExtraidos.idCargo != null
          ) {
            this.formAlumno.get('cargo').setValue(datosExtraidos.idCargo);
          }

          if (
            (this.formAlumno.get('areaTrabajo').value == 0 ||
              this.formAlumno.get('areaTrabajo').value == 27 ||
              this.formAlumno.get('areaTrabajo').value == 29) &&
            datosExtraidos.idATrabajo != null
          ) {
            this.formAlumno
              .get('areaTrabajo')
              .setValue(datosExtraidos.idATrabajo);
          }

          if (
            (this.formAlumno.get('industria').value == 0 ||
              this.formAlumno.get('industria').value == 22 ||
              this.formAlumno.get('industria').value == 48) &&
            datosExtraidos.idIndustria != null
          ) {
            this.formAlumno
              .get('industria')
              .setValue(datosExtraidos.idIndustria);
          }

          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }

  ngAfterViewInit() {
    this.scrollToEnd();
  }

  countWords() {
    const words = this.newMessage.trim().split(/\s+/);
    this.wordCount = words.length;
  }

  onEdit() {
    this.editar = true;
    this.formAlumno.enable();
    console.log('first', this.formAlumno);
  }
  onCancel() {
    this.editar = false;
    this.formAlumno.disable();
  }

  scrollToEnd() {
    if (this.containerRef && this.containerRef.nativeElement) {
      const container = this.containerRef.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  obtenerHistorialAlumno(idAlumno: number) {
    this.loadingHistorialAlumno = true;
    this.integraService
      .obtener(
        `${WHATSAPP_MENSAJE_ENVIADO.ObtenerDatosAlumnoWhatsApp}/${idAlumno}`
      )
      .subscribe({
        next: (response: HttpResponse<DatosAlumnoWhatsapp>) => {
          this.loadingHistorialAlumno = false;
          this.historialAlumno = response.body.historialAlumno;
        },
        error: (error) => {
          this.loadingHistorialAlumno = false;
        },
      });
  }

  AsignacionWhatsapp() {
    this.integraService
      .obtener(constApiMarketing.AsignacionDatosWhats)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.EstadoAsignacion = response.body;

          if (this.EstadoAsignacion === 1) {
            console.log(' Asignación completada.');
          }
        },
        error: (error) => {
          console.error('Error en la asignación:', error);
        },
      });
  }
  obtenerChatWhatsAppMarketingPorCelular() {
    this.loader = true;
    this.integraService
      .obtener(
        `${WHATSAPP_MENSAJE_ENVIADO.ObtenerChatWhatsAppMarketingPorCelular}/${this.celularAlumno}`
      )
      .subscribe({
        next: (response: HttpResponse<ChatWhatsAppMarketingPorCelular[]>) => {
          this.datosChat = response.body[0];
          this.alumnosPorCelular = this.datosChat.listaAlumnosPorCelular;
          this.mensajesWhats = this.datosChat.mensajePorCelular;
          this.idPais = this.datosChat.idPaisEmpresa;
          this.idAlumnoEnvio = this.datosChat.idAlumnoUM;
          this.rangoProbabilidad = this.datosChat.rango;

          setTimeout(() => {
            this.containerRef.nativeElement.scrollTop =
              this.containerRef.nativeElement.scrollHeight;
            this.loader = false;
          }, 1000);
        },
        error: (error) => {
          this.loader = false;
        },
        complete: () => {
          this.loader = false;
        },
      });
  }

  obtenerCombos() {
    this.integraService
      .obtener(WHATSAPP_MENSAJE_ENVIADO.ObtenerCombosAtributosAlumno)
      .subscribe({
        next: (response: HttpResponse<ComboModuloWhatsapp>) => {
          this.listaAreaFormacion = response.body.comboAreaFormacion;
          this.listaAreaTrabajo = response.body.comboAreaTrabajo;
          this.listaCargo = response.body.comboCargo;
          this.listaIndustria = response.body.comboIndustria;
          this.listaTamanioEmpresa = response.body.comboTamanioEmpresa;
        },
        error: (error) => {
          console.error('Error al obtener combos: ', error);
        },
      });
  }

  obtenerAsesor() {
    this.integraService
      .obtener(`${WHATSAPP_MENSAJE_ENVIADO.ObtenerPersonalOportunidad}`)
      .subscribe({
        next: (response: HttpResponse<Combo[]>) => {
          this.dataAsesorModal = response.body;
          const asesorPorDefecto = this.dataAsesorModal.find(
            (asesor: any) => asesor.id === 125
          );
          if (asesorPorDefecto) {
            this.formOportunidad
              .get('idPersonalAsignado')
              ?.setValue(asesorPorDefecto.id);
            this.cdRef.detectChanges(); // Fuerza la actualización de la vista
          } else {
          }
        },
        error: (error) => console.error('Error al obtener asesor: ', error),
      });
  }
  alumno: AlumnoWhatsapp = {};

  obtenerDatosAlumnoWhatsApp(idAlumno: number) {
    this.loader = true;
    this.integraService
      .obtener(
        `${WHATSAPP_MENSAJE_ENVIADO.ObtenerDatosAlumnoWhatsApp}/${idAlumno}`
      )
      .subscribe({
        next: (response: HttpResponse<DatosAlumnoWhatsapp>) => {
          this.alumno = response.body.obtenerAtributosAlumno;
          this.historialAlumno = response.body.historialAlumno;

          if (
            response.body != undefined ||
            response.body.obtenerAtributosAlumno != null
          ) {
            this.formAlumno.get('nombre1').setValue(this.alumno.nombre1);
            this.formAlumno.get('nombre2').setValue(this.alumno.nombre2);
            this.formAlumno
              .get('apellidoPaterno')
              .setValue(this.alumno.apellidoPaterno);
            this.formAlumno
              .get('apellidoMaterno')
              .setValue(this.alumno.apellidoMaterno);
            this.formAlumno.get('celular1').setValue(this.alumno.celular);
            this.formAlumno.get('celular2').setValue(this.alumno.celular2);
            this.formAlumno.get('email1').setValue(this.alumno.email1);
            this.formAlumno.get('email2').setValue(this.alumno.email2);
            this.formAlumno
              .get('areaFormacion')
              .setValue(this.alumno.idAFormacion);
            this.formAlumno.get('cargo').setValue(this.alumno.idCargo);
            this.formAlumno.get('areaTrabajo').setValue(this.alumno.idATrabajo);
            this.formAlumno.get('industria').setValue(this.alumno.idIndustria);
            this.formAlumno.get('dni').setValue(this.alumno.dni);
            this.formAlumno
              .get('tamanioEmpresa')
              .setValue(this.alumno.idTamanioEmpresaAgenda);
          }

          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }

  DesuscribirChat() {
    this.loader = true;
    this.integraService
      .post(
        `${
          constApiMarketing.DesuscribirChat +
          '/' +
          this.celularAlumno +
          '/' +
          this.idAlumno
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          Swal.fire('Success!', 'Se Desuscribio Chat  Exitosamente', 'success');
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }
  SuscribirChat() {
    this.loader = true;
    this.integraService
      .post(
        `${
          constApiMarketing.SuscribirAlumno +
          '/' +
          this.celularAlumno +
          '/' +
          this.idAlumno
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          Swal.fire('Éxito', 'Se suscribió el chat exitosamente', 'success');
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }

  ArchivarChat() {
    this.loader = false;
    this.integraService
      .post(
        `${
          constApiMarketing.ArchivarChat +
          '/' +
          this.celularAlumno +
          '/' +
          this.idAlumno
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          Swal.fire('Success!', 'Se archivo Chat Exitosamente', 'success');

          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }

  DesArchivarChat() {
    this.loader = false;
    this.integraService
      .post(
        `${
          constApiMarketing.DesArchivarChat +
          '/' +
          this.celularAlumno +
          '/' +
          this.idAlumno
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          Swal.fire('Success!', 'Se DesArchivo Chat Exitosamente', 'success');
          this.loader = false;
        },
        error: (error) => {},
      });
  }

  convertToAscii(text: string): string {
    let result = '';

    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      const asciiCode = char.charCodeAt(0);

      if (asciiCode >= 32 && asciiCode <= 126) {
        result += char;
      } else {
        result += `&#${asciiCode};`;
      }
    }
    return result;
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  sendMessage() {
    this.loaderChatWhatsapp = true;

    let jsonEnvio = {
      celularWhatsApp: this.celularAlumno,
      mensaje: this.newMessage,
      idPais: this.idPais,
      idAlumno: this.idAlumnoEnvio,
      idPersonal: this.idPersonal,
      usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.EnvioMensaje, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.obtenerChatWhatsAppMarketingPorCelular();
          this.newMessage = '';
          this.loaderChatWhatsapp = false;
        },

        error: (error) => {
          console.log(error);
          this.loaderChatWhatsapp = false;
        },
      });
  }

  //edson
  public onAction(index: number): void {
    this.panels.forEach((panel, idx) => {
      if (idx !== index && panel.expanded) {
        panel.toggle();
      }
    });
  }

  onExpandedChange(e: boolean, item: ListaAlumnosPorCelular) {
    this.idAlumnoInput = item.idAlumno;
    this.idAlumnoExpansion = item.idAlumno;
    if (item.idAlumno != 0) {
      this.obtenerHistorialAlumno(item.idAlumno);
      this.obtenerDatosAlumnoWhatsApp(item.idAlumno);
    }
    this.obtenerAsesor();
  }

  GuardarCambiosAlumno() {
    if (this.idPais === 51) {
      // if (this.dni && !/^\d{8}$/.test(this.dni)) {
      //   // Verifica que el DNI tenga exactamente 8 números solo si no está vacío
      //   Swal.fire(
      //     'Error!',
      //     'El DNI debe ser un número de 8 caracteres para Perú.',
      //     'error'
      //   );
      //   this.loader = false;
      //   return;
      // }
    }
    this.loader = true;
    var jsonEnvio = {
      id: this.alumno.id,
      nombre1: this.formAlumno.get('nombre1').value,
      nombre2: this.formAlumno.get('nombre2').value,
      apellidoPaterno: this.formAlumno.get('apellidoPaterno').value,
      apellidoMaterno: this.formAlumno.get('apellidoMaterno').value,
      celular: this.formAlumno.get('celular1').value,
      celular2: this.formAlumno.get('celular2').value,
      email1: this.formAlumno.get('email1').value,
      email2: this.formAlumno.get('email2').value,
      idIndustria: this.formAlumno.get('industria').value,
      idAFormacion: this.formAlumno.get('areaFormacion').value,
      idATrabajo: this.formAlumno.get('areaTrabajo').value,
      idCargo: this.formAlumno.get('cargo').value,
      idTamanioEmpresaAgenda: this.formAlumno.get('tamanioEmpresa').value,
      dni: this.formAlumno.get('dni').value,
      desuscrito: false,
      archivado: true,
    };

    if (this.data?.dataItem?.requiereDerivacion) {
      this.integraService
        .postJsonResponse(
          `${constApiMarketing.ValidarGuardadoDatosInteraccionAutomatica}/${this.celularAlumno}`,
          null
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Validacion: ', response);
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
    this.integraService
      .postJsonResponse(constApiMarketing.ActualizarAlumnoWhatsapp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (this.formAlumno.get('dni').value != null) {
            this.verificaSemaforo(this.formAlumno.get('dni').value);
          }
          this.alertaService.swalFireOptions({
            icon: 'success',
            title: '¡Exitoso!',
            text: 'Se guardaron los cambios correctamente',
          });
          this.obtenerChatWhatsAppMarketingPorCelular();
          this.newMessage = '';
          this.loader = false;
        },
        error: (error) => {
          this.loader = false;
          if (
            error &&
            error.error ==
              'No se puede actualizar el alumno más de dos veces en el mismo día.'
          ) {
            this.alertaService.swalFireOptions({
              icon: 'warning',
              title: '¡Límite de actualizaciones alcanzado!',
              text: 'El alumno ya fue actualizado dos veces hoy. No puede realizar más cambios',
            });
          } else {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          }
        },
      });
  }

  verificaSemaforo(dniValue: string) {
    this.integraService
      .getJsonResponse(`${constApiComercial.ObtenerSentinelPorDni}/${dniValue}`)
      .subscribe({
        next: (resp) => {
          let existeSemaforo = resp.body.id != 0;
          if (!existeSemaforo && this.idPais == 51) {
            this.generaSemaforoFinanciero(dniValue);
          }
        },
      });
  }
  generaSemaforoFinanciero(dniValue: string) {
    if (dniValue.length == 8) {
      this.mostrarMensajeSemaforoFinanciero();
      this.integraService
        .getJsonResponse(
          `${constApiComercial.AgendaInformacionActividadActualizarSentinelAlumno}/${dniValue}/${this.alumno.id}/${this.userService.userName}`
        )
        .subscribe({
          next: (resp: any) => {},
        });
    }
  }
  mostrarMensajeSemaforoFinanciero() {
    this.notificationService.show({
      content: 'Generando Semáforo Financiero',
      position: { horizontal: 'center', vertical: 'top' },
      animation: { type: 'fade', duration: 400 },
      type: { style: 'info', icon: true },
      hideAfter: 5000,
    });
  }

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }

  //---------------- Nueva Grilla ----------------//
  DescontarO(e: any) {
    this.loader = true;

    var jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      IdCentroCosto: e.idCentroCosto,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.RestaOportunidadWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        complete: () => {
          this.loader = false;
          this.obtenerHistorialAlumno(e.idAlumno);
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }

  ContadorO(e: any) {
    this.loader = true;

    var jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      IdCentroCosto: e.idCentroCosto,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.SumaOportunidadWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        complete: () => {
          this.loader = false;
          this.obtenerHistorialAlumno(e.idAlumno);
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }

  DescontarV(e: any) {
    this.loader = true;

    let jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.RestaChatValidoWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        complete: () => {
          this.loader = false;
          this.obtenerHistorialAlumno(e.idAlumno);
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }

  ContadorV(e: any) {
    this.loader = true;

    var jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.SumaChatValidoWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        complete: () => {
          this.loader = false;
          this.obtenerHistorialAlumno(e.idAlumno);
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }

  DescontarI(e: any) {
    this.loader = true;

    var jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.RestaChatInValidoWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        complete: () => {
          this.loader = false;
          this.obtenerHistorialAlumno(e.idAlumno);
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }

  ContadorI(e: any) {
    this.loader = true;

    var jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.SumaChatInValidoWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {},
        complete: () => {
          this.loader = false;
          this.obtenerHistorialAlumno(e.idAlumno);
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }

  //------------------ Modales ------------//

  abrirModalPlantilla() {
    const dialogRef = this.dialog.open(WmModalPlantillaComponent, {
      width: '1200px',
      height: '600px',
      panelClass: 'dialog-gestor',
      data: this.datosChat,
    });

    dialogRef.afterClosed().subscribe((result: any) => {});
  }
  isComboDisabled = true;
  abrirModalOPortunidad(modalOportunidad: any) {
    this.isComboDisabled = true;
    this.formOportunidad.reset();
    this.formOportunidad.get('idPersonalAsignado')?.setValue(125);

    this.modalRef = this.modalService.open(this.modalOportunidad, {
      backdrop: 'static',
    });
  }

  abrirModalSemaforoFinanciero() {
    this.modalRef = this.modalService.open(this.modalSemaforoFinanciero, {
      backdrop: 'static',
      size: 'xl',
    });
  }

  //------------------Nuevos Filtros ------------//
  filterCentroCosto(value: string, elementRef: any, esModal: boolean) {
    if (value.length >= 4) {
      elementRef.loading = true;
      this.integraService
        .postJsonResponse(
          constApiComercial.CentroCostoObtenerAutocomplete,
          JSON.stringify({
            valor: value,
          })
        )
        .subscribe({
          next: (response) => {
            elementRef.loading = false;
            if (esModal) {
              this.dataCentroCostoModal = response.body;
              this.sourceCentroCostoModal = response.body;
            } else {
              this.dataCentroCosto = response.body;
              this.sourceCentroCosto = response.body;
            }
          },
          error: (error) => {
            elementRef.loading = false;
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.notificationWarning(mensaje);
          },
        });
    } else if (value.length > 0) {
      if (esModal) this.dataCentroCostoModal = [];
      this.dataCentroCosto = [];
    } else {
      if (esModal) this.dataCentroCostoModal = this.sourceCentroCostoModal;
      else this.dataCentroCosto = this.sourceCentroCosto;
    }
  }

  filterAsesor(value: string, elementRef: any, esModal: boolean) {
    if (value.length >= 4) {
      elementRef.loading = true;
      this.integraService
        .postJsonResponse(
          constApiComercial.AgendaInformacionActividadObtenerPersonalAutocomplete,
          JSON.stringify({
            valor: value,
          })
        )
        .subscribe({
          next: (response) => {
            elementRef.loading = false;
            if (esModal) {
              this.dataAsesorModal = response.body;
              this.sourceAsesorModal = response.body;
            } else {
              this.dataAsesor = response.body;
              this.sourceAsesor = response.body;
            }
          },
          error: (error) => {
            elementRef.loading = false;
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.notificationWarning(mensaje);
          },
        });
    } else if (value.length > 0) {
      if (esModal) this.dataAsesorModal = [];
      this.dataAsesor = [];
    } else {
      if (esModal) this.dataAsesorModal = this.sourceAsesorModal;
      else this.dataAsesor = this.sourceAsesor;
    }
  }

  //------------------Validacion------------//
  validFormTipoDato(): boolean {
    if (this.formOportunidad.invalid) {
      this.formOportunidad.markAllAsTouched();
      return false;
    }
    return true;
  }

  //------------------Crear Oportunidad------------//
  CrearOportunidad() {
    this.esDesdeCrearOportunidad = true;
    this.esComboDisabled = false;
    this.esBotonAsignarDisabled = false;

    if (this.validFormTipoDato()) {
      this.loader = true;

      let dataForm = this.formOportunidad.getRawValue();
      let envio: IOportunidadFormularioWhatsapp = {
        idAlumno: this.idAlumno,
        idCentroCosto: dataForm.idCentroCosto,
        idPersonalAsignado: 125,
      };
      this.idAsesorActual = 125;

      this.integraService
        .postJsonResponse(constApiMarketing.CrearOportunidadWhatsapp, envio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            //Swal.fire('Success!', 'La Oportunidad se Creo Exitosamente', 'success');
            // this.dialog.closeAll();
            //this.loader=false;
            const idOportunidad = Number(response.body);
            if (!isNaN(idOportunidad)) {
              this.idOportunidad = idOportunidad;
              this.ObtenerProgramaPorOportunidadWhatsapp(idOportunidad);
            } else {
              console.error('idOportunidad no es un número válido.');
            }
          },
          error: (error) => {
            this.alertaService.notificationError(error.error);
          },
          complete: () => {
            this.modalRef.close('submitted');
            this.loader = false;
            //this.alertaService.mensajeExitoso();
          },
        });
    } else this.formOportunidad.markAllAsTouched();
  }

  ObtenerProgramaPorOportunidadWhatsapp(idOportunidad: number) {
    this.idOportunidad = idOportunidad;

    this.integraService
      .postJsonResponse(
        constApiMarketing.ObtenerProgramaPorOportunidadWhatsapp,
        JSON.stringify(idOportunidad)
      )

      .subscribe({
        next: (response: any) => {
          if (response.body && response.body.length > 0) {
            const programaData = response.body[0];
            this.programaNombre = programaData.programaNombre;
            const idOportunidad = programaData.idOportunidad;
            const idAlumno = programaData.idAlumno;
            const idClasificacionPersona = programaData.idClasificacionPersona;
            const idArea = programaData.idArea;
            const idPGeneral = programaData.idPGeneral;

            if (this.esDesdeActualizarCentroCosto) {
              this.ValidarProbabilidadOportunidadesRecalculo(
                idOportunidad,
                idAlumno,
                idClasificacionPersona,
                idArea,
                idPGeneral
              );
              this.esDesdeActualizarCentroCosto = false; //
            } else if (this.esDesdeAbrirModalCaso3) {
              this.ValidarProbabilidadOportunidadesModal3(
                idOportunidad,
                idAlumno,
                idClasificacionPersona,
                idArea,
                idPGeneral
              );
              this.esDesdeAbrirModalCaso3 = false;
            } else {
              this.ValidarProbabilidadOportunidades(
                idOportunidad,
                idAlumno,
                idClasificacionPersona,
                idArea,
                idPGeneral
              );
            }
          }
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }
  public esDesdeCrearOportunidad: boolean = false;

  ValidarProbabilidadOportunidades(
    idOportunidad: number,
    idAlumno: number,
    idClasificacioInPersona: number,
    idArea: number,
    idPGeneral: number
  ) {
    let ventaCruzada: any = {
      IdOportunidad: idOportunidad,
      IdAlumno: idAlumno,
      IdClasificacionPersona: idClasificacioInPersona,
      IdArea: idArea,
      IdPGeneral: idPGeneral,
    };

    this.integraService
      .postJsonResponse(
        constApiMarketing.ValidarProbabilidadOportunidades,
        ventaCruzada
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body) {
            const respuesta = response.body;
            this.probabilidadNivel = respuesta.probabilidad;
            this.aptitud = respuesta.apto;
            this.mensaje = respuesta.mensaje;
            this.listaVentaCruzada = response.body.listaVentaCruzada || [];

            if (this.esDesdeCrearOportunidad) {
              this.esComboDisabled = false;
              this.esBotonAsignarDisabled = false;
            }
            if (this.probabilidadNivel === 'Muy Alta') {
              //  const idAsesorActual = response.body.idAsesor || 0;
              //const idAsesorActual = this.idAsesorActual || response.body.idAsesor;
              const idAsesorActual = this.idAsesorActual || 125;

              this.esComboDisabled = idAsesorActual !== 125;
              this.esBotonAsignarDisabled = idAsesorActual !== 125;
              this.mostrarTercerModal = true;

              setTimeout(() => {
                document
                  .getElementById('idModalCaso3')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }, 180);
              this.mostrarPrimerModal = false;
              this.mostrarSegundoModal = false;
            } else if (
              this.probabilidadNivel === 'Media' ||
              this.probabilidadNivel === 'Alta'
            ) {
              if (
                this.listaVentaCruzada.some(
                  (programa) => programa.probabilidadTexto === 'Muy Alta'
                )
              ) {
                this.mostrarSegundoModal = true;
                setTimeout(() => {
                  document
                    .getElementById('idModalCaso2')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }, 180);
                this.mostrarPrimerModal = false;
                this.mostrarTercerModal = false;
              } else {
                this.mostrarPrimerModal = true;
                setTimeout(() => {
                  document
                    .getElementById('idModalCaso1')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }, 180);
                this.mostrarSegundoModal = false;
                this.mostrarTercerModal = false;
              }
            }
            this.cdRef.detectChanges();
          } else {
          }
          Swal.fire(
            'Success!',
            'La Oportunidad se Creo Exitosamente',
            'success'
          );
          this.loader = false;
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }

  ValidarProbabilidadOportunidadesRecalculo(
    idOportunidad: number,
    idAlumno: number,
    idClasificacioInPersona: number,
    idArea: number,
    idPGeneral: number
  ) {
    let ventaCruzada: any = {
      IdOportunidad: idOportunidad,
      IdAlumno: idAlumno,
      IdClasificacionPersona: idClasificacioInPersona,
      IdArea: idArea,
      IdPGeneral: idPGeneral,
    };

    this.integraService
      .postJsonResponse(
        constApiMarketing.ValidarProbabilidadOportunidadesRecalculo,
        ventaCruzada
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body) {
            const respuesta = response.body;
            this.probabilidadNivel = respuesta.probabilidad;
            this.aptitud = respuesta.apto;
            this.mensaje = respuesta.mensaje;
            this.listaVentaCruzada = response.body.listaVentaCruzada || [];

            if (this.probabilidadNivel === 'Muy Alta') {
              this.mostrarTercerModal = true;
              setTimeout(() => {
                document
                  .getElementById('idModalCaso3')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }, 180);
              this.mostrarPrimerModal = false;
              this.mostrarSegundoModal = false;
            } else if (
              this.probabilidadNivel === 'Media' ||
              this.probabilidadNivel === 'Alta'
            ) {
              Swal.fire(
                'Notificación',
                `El Alumno y Programa están configurados con el perfil antiguo. Probabilidad: ${this.probabilidadNivel}`,
                'warning'
              );
              this.mostrarSegundoModal = false;
              this.mostrarPrimerModal = false;
              this.mostrarTercerModal = false;
            }
            this.cdRef.detectChanges();
          } else {
          }
          Swal.fire(
            'Success!',
            'La Oportunidad se Creo Exitosamente',
            'success'
          );
          this.loader = false;
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }

  onProgramaSeleccionado(programa: any) {
    this.programaSeleccionado = programa;
  }

  public esDesdeActualizarCentroCosto: boolean = false;

  actualizarCentroCostoPragrama() {
    this.esDesdeActualizarCentroCosto = true;

    this.loader = true;
    if (this.programaSeleccionado && this.idOportunidad) {
      let jsonEnvio: any = {
        asignarAsesor: {
          idOportunidades: [this.idOportunidad],
          idAsesor: this.programaSeleccionado.idAsesor || null,
          fechaProgramada: null,
          IdCentroCosto: this.programaSeleccionado.idCentroCosto,
          segunMejorPro: false,
          envioWhats: false,
          VentaCruzadaMarketing: true,
        },
        usuario: this.usuario.userName,
      };
      this.integraService
        .postJsonResponse(
          constApiMarketing.AsignarCentroCostoPorPragramaAsesor,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            const asignaciones =
              response.body?.oportunidadesAsesorAsignacionAutomatica;

            if (asignaciones && asignaciones.length > 0) {
              this.idOportunidad = asignaciones[0].id;

              this.ObtenerProgramaPorOportunidadWhatsapp(this.idOportunidad);
            } else {
              console.error(
                'No se encontró un ID de oportunidad en la respuesta.'
              );
            }
          },
          error: (error) => {
            this.alertaService.notificationError(error.error);
          },
        });
    } else {
      console.error('No hay programa seleccionado');
    }
  }

  asignarAsesorYCerrarOportunidadRN5() {
    this.loader = true;
    if (this.idOportunidad) {
      let jsonEnvio: any = {
        asignarAsesor: {
          idOportunidades: [this.idOportunidad],
          idasesor: 4602,
          fechaProgramada: null,
          idcentroCosto: null,
          segunMejorPro: false,
          envioWhats: false,
        },
        usuario: this.usuario.userName,
      };

      this.integraService
        .postJsonResponse(
          constApiMarketing.AsignarCentroCostoPorPragramaAsesor,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.cerrarOportunidadRN5(
              this.idOportunidad,
              this.usuario.userName
            );
          },
          error: (error) => {
            this.alertaService.notificationError(error.error);
          },
        });
    } else {
      console.error('No hay oportunidad creada para asignar el asesor.');
    }
  }

  cerrarOportunidadRN5(idOportunidad: number, usuario: string) {
    let jsonEnvio: any = {
      IdOportunidades: [idOportunidad],
      Usuario: usuario,
    };

    this.integraService
      .postJsonResponse(
        constApiMarketing.CerrarOportunidadRN5,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          Swal.fire(
            'Success!',
            'Oportunidad cerrada exitosamente en RN5',
            'success'
          );
          this.loader = false;
          if (this.mostrarPrimerModal) {
            this.cerrarModal('caso1');
          } else if (this.mostrarSegundoModal) {
            this.cerrarModal('caso2');
          }
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
          this.loader = false;
        },
      });
  }

  actualizarFechaprogramadaComentario() {
    this.loader = true;
    if (this.idOportunidad) {
      let fechaProgramada = this.formProgramarActividad.value.fechaProgramada;
      if (fechaProgramada) {
        const fecha = new Date(fechaProgramada);

        fechaProgramada = `${fecha.getFullYear()}-${(fecha.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${fecha
          .getDate()
          .toString()
          .padStart(2, '0')}T${fecha
          .getHours()
          .toString()
          .padStart(2, '0')}:${fecha
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${fecha.getSeconds().toString().padStart(2, '0')}`;
      }

      let jsonEnvio: any = {
        asignarAsesor: {
          idOportunidades: [this.idOportunidad],
          idAsesor: null,
          fechaProgramada: fechaProgramada,
          idCentroCosto: null,
          comentario: this.formProgramarActividad.value.comentario,
          segunMejorPro: false,
          envioWhats: false,
        },
        usuario: this.usuario.userName,
      };

      this.integraService
        .postJsonResponse(
          constApiMarketing.AsignarAsesorFechaProgramacion,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.loader = false;
            Swal.fire('Success!', 'Datos   Actualizados con Exito', 'success');
          },
          error: (error) => {
            this.alertaService.notificationError(error.error);
            this.loader = false;
          },
        });
    } else {
      console.error('No hay programa seleccionado');
      this.loader = false;
    }
  }

  asignarAsesor() {
    this.loader = true;
    if (this.idOportunidad) {
      let jsonEnvio: any = {
        asignarAsesor: {
          idOportunidades: [this.idOportunidad],
          idAsesor: this.asesorSeleccionado,
          fechaProgramada: null,
          idCentroCosto: null,
          comentario: null,
          segunMejorPro: false,
          envioWhats: false,
        },
        usuario: this.usuario.userName,
      };

      this.integraService
        .postJsonResponse(
          constApiMarketing.AsignarAsesorFechaProgramacion,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            Swal.fire(
              'Success!',
              'La oportunidad ha sido asignada con Exito',
              'success'
            );
            this.loader = false;
            this.cerrarModal('caso3');
          },
          error: (error) => {
            this.alertaService.notificationError(error.error);
            this.loader = false;
          },
        });
    } else {
      console.error('No hay programa seleccionado');
      this.loader = false;
    }
  }

  cerrarModal(modal: string) {
    if (modal === 'caso1') {
      this.mostrarPrimerModal = false;
    } else if (modal === 'caso2') {
      this.mostrarSegundoModal = false;
    } else if (modal === 'caso3') {
      this.mostrarTercerModal = false;
    }
  }
  private esDesdeAbrirModalCaso3: boolean = false;
  public esFlujoDesdeAbrirModalCaso3: boolean = false;
  public esComboDisabled: boolean = false;
  public esBotonAsignarDisabled: boolean = false;

  AbrirModalCaso3(idOportunidad: number) {
    this.loader = true;
    this.esFlujoDesdeAbrirModalCaso3 = true;
    this.esDesdeAbrirModalCaso3 = true;
    this.ObtenerIdAsesorActual(idOportunidad);
    this.ObtenerProgramaPorOportunidadWhatsapp(idOportunidad);
  }

  ValidarProbabilidadOportunidadesModal3(
    idOportunidad: number,
    idAlumno: number,
    idClasificacioInPersona: number,
    idArea: number,
    idPGeneral: number
  ) {
    this.loader = true;
    let ventaCruzada: any = {
      IdOportunidad: idOportunidad,
      IdAlumno: idAlumno,
      IdClasificacionPersona: idClasificacioInPersona,
      IdArea: idArea,
      IdPGeneral: idPGeneral,
    };

    this.integraService
      .postJsonResponse(
        constApiMarketing.ValidarProbabilidadOportunidades,
        ventaCruzada
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body) {
            const respuesta = response.body;
            this.probabilidadNivel = respuesta.probabilidad;
            this.aptitud = respuesta.apto;
            this.mensaje = respuesta.mensaje;

            if (
              this.probabilidadNivel === null ||
              this.probabilidadNivel === ''
            ) {
              this.alertaService.mensajeWarning(
                'El Centro de Costo no tiene Probabilidad'
              );
              this.loader = false;
              return;
            }
            if (this.probabilidadNivel === 'Muy Alta') {
              this.esFlujoDesdeAbrirModalCaso3 = true;

              this.mostrarTercerModal = true;

              this.asesorSeleccionado = this.idAsesorActual;
              this.esComboDisabled = this.idAsesorActual !== 125;
              this.esBotonAsignarDisabled = this.idAsesorActual !== 125;
              this.alertaService.mensajeExitosomkt(
                'El Centro de Costo se Cargo Exitosamente'
              );

              setTimeout(() => {
                document
                  .getElementById('idModalCaso3')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }, 180);
            } else if (
              this.probabilidadNivel === 'Media' ||
              this.probabilidadNivel === 'Alta'
            ) {
              Swal.fire(
                'Notificación',
                `La probabilidad es ${this.probabilidadNivel}. No es apta para ser trabajada.`,
                'warning'
              );
            }

            this.cdRef.detectChanges();
          } else {
            Swal.fire(
              'Error',
              'No se encontró información de probabilidad.',
              'error'
            );
          }

          this.loader = false;
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }

  ObtenerIdAsesorActual(idOportunidad: number) {
    this.idOportunidad = idOportunidad;
    this.integraService
      .postJsonResponse(
        constApiMarketing.ObtenerIdAsesorActual,
        JSON.stringify(idOportunidad)
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response && response.body) {
            const { idAsesor } = response.body;
            this.idAsesorActual = idAsesor;

            this.esComboDisabled = idAsesor !== 125;
            this.esBotonAsignarDisabled = idAsesor !== 125;

            this.asesorSeleccionado = idAsesor;
          }
        },
        error: (error) => {
          console.error('Error al obtener el asesor actual:', error);
        },
      });
  }

  ObtenerModeloPredictivoPorAlumnoYPrograma(
    idAlumno: number,
    idPGeneral: number
  ) {
    const payload = { idAlumno, idPGeneral };

    this.integraService
      .postJsonResponse(
        constApiMarketing.ObtenerModeloPredictivoPorAlumnoYPrograma,
        JSON.stringify(payload)
      )
      .subscribe({
        next: (response: any) => {},
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }

  //------------------Seleccionar Archivo------------//
  seleccionarArchivo(event: any) {
    if (event.target.files.length > 0) {
      let dataFile = event.target.files[0];
      this.fileWhatsapp = dataFile;
      this.archivoTemporal = dataFile;
      this.modalArchivoRef = this.modalService.open(
        this.modalSeleccionarArchivo,
        {
          size: 'sm',
          backdrop: 'static',
        }
      );
    }
  }
  adjuntarArchivoWhatsapp() {
    let formData = new FormData();
    let documentoValido = ['application/pdf'];
    let imagenValida = ['image/png', 'image/jpeg'];
    console.log('Adjuntando archivo');
    let waType = '';
    if (documentoValido.includes(this.archivoTemporal.type)) {
      waType = 'document';
    } else if (imagenValida.includes(this.archivoTemporal.type)) {
      waType = 'image';
    }
    formData.append('file', this.archivoTemporal);
    this.whatsappFacebookService
      .adjuntarArchivoChatWhatsapp$(formData)
      .subscribe({
        next: (resp: any) => {
          if (resp.resultado != 'Error') {
            if (this.celularAlumno != '') {
              let obj: WhatsAppMensajeArchivo = {
                waTo: this.celularAlumno,
                waType: waType,
                waLink: resp.urlArchivo,
                waFileName: resp.nombreArchivo,
                idPais: 51,
                idPersonal: this.idPersonal,
                idAlumno: this.idAlumno,
              };
              this.sendFileMessage(obj);
            }
          }
          this.archivoTemporal = null;
          this.modalArchivoRef.close(); // Cerrar el modal después de enviar
        },
        error: (err) => {
          this.alertaService.mensajeWarning(err.error);
          this.archivoTemporal = null;
          this.modalArchivoRef.close(); // Cerrar el modal en caso de error
        },
      });
  }
  private sendFileMessage(objeto: WhatsAppMensajeArchivo): void {
    this.loaderChatWhatsapp = true;
    let mensajeIndicador: IMensajesWhatsapp = null;
    this.whatsappFacebookService
      .enviarMensajeApigraphWhatsappArchivo$(objeto)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.body) {
            mensajeIndicador = {
              numero: objeto.waTo,
              tipo: 2,
              mensaje:
                objeto.waType == 'image'
                  ? `<a href="${objeto.waLink}" download target=_blank><img src="${objeto.waLink}" height=200 alt=><span style=display: block;></span><a>`
                  : `<a href="${objeto.waLink}" download target=_blank><span style=font-size:32px; class=fa fa-file aria-hidden=false></span><span style=display: block;>${objeto.waFileName}</span><a>`,
              idPersonal: objeto.idPersonal,
              fechaCreacion: new Date(),
              idAlumno: objeto.idAlumno,
              estadoMensaje: 1,
            };
            this.obtenerChatWhatsAppMarketingPorCelular();
            this.loaderChatWhatsapp = false;
          } else {
            this.alertaService.mensajeWarning('El mensaje no fue enviado');
          }
        },
        error: (err) => {
          this.alertaService.mensajeWarning(`Fallo el servicio: ${err.error}`);
          this.loaderChatWhatsapp = false;
        },
      });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.dragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.dragOver = false;
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const validImages = ['image/png', 'image/jpeg', 'image/jpg'];
      const validPdf = ['application/pdf'];
      if (validImages.includes(file.type) || validPdf.includes(file.type)) {
        // Simula el evento de input para reutilizar seleccionarArchivo
        const fakeEvent = { target: { files: [file] } };
        this.seleccionarArchivo(fakeEvent);
      } else {
        this.alertaService.mensajeWarning(
          'Solo se permiten archivos PDF o imágenes (PNG, JPG, JPEG)'
        );
      }
    }
  }

  // Abrir modal para crear oportunidad cuando NO HAY EMAIL REGISTRADO
  toggleCrearOportunidadContenedor() {
    this.showCrearOportunidadContenedor = !this.showCrearOportunidadContenedor;
  }

  abrirModalCapturarRegistrosIA() {
    this.modalRef = this.modalService.open(this.modalExtraerRegistros, {
      backdrop: 'static',
    });
  }

  extraerRegistros() {
    this.modalRef.close();
    this.loader = true;

    const valorSeleccionado =
      this.formExtraccionRegistros.value.rangoExtraccion;

    let jsonRequest = {
      rango: valorSeleccionado,
      celularAlumno: this.celularAlumno,
    };

    this.integraService
      .postJsonResponse(
        constApiMarketing.CapturarRegistrosModeloIA,
        jsonRequest
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response);
          this.onEdit();

          if (this.formAlumno.get('nombre1').value == '') {
            this.formAlumno.get('nombre1').setValue(response.body.nombres);
          }
          if (this.formAlumno.get('apellidoPaterno').value == '') {
            this.formAlumno
              .get('apellidoPaterno')
              .setValue(response.body.apellidos);
          }
          if (
            this.formAlumno.get('areaFormacion').value == 0 ||
            this.formAlumno.get('areaFormacion').value == 153 ||
            this.formAlumno.get('areaFormacion').value == 3
          ) {
            this.formAlumno
              .get('areaFormacion')
              .setValue(response.body.area_De_Formacion.id);
          }
          if (
            this.formAlumno.get('cargo').value == 0 ||
            this.formAlumno.get('cargo').value == 24
          ) {
            this.formAlumno.get('cargo').setValue(response.body.cargo.id);
          }
          if (
            this.formAlumno.get('areaTrabajo').value == 0 ||
            this.formAlumno.get('areaTrabajo').value == 27 ||
            this.formAlumno.get('areaTrabajo').value == 29
          ) {
            this.formAlumno
              .get('areaTrabajo')
              .setValue(response.body.area_De_Trabajo.id);
          }
          if (
            this.formAlumno.get('industria').value == 0 ||
            this.formAlumno.get('industria').value == 22 ||
            this.formAlumno.get('industria').value == 48
          ) {
            this.formAlumno
              .get('industria')
              .setValue(response.body.industria.id);
          }

          this.cdr.detectChanges();
          this.alertaService.swalFireOptions({
            icon: 'success',
            title: '¡Exitoso!',
            text: 'Se capturaron los datos exitosamente.',
          });
          this.loader = false;
        },
        error: (error) => {
          this.alertaService.swalFireOptions({
            icon: 'warning',
            title: 'Error de Comunicación',
            text: 'Lo sentimos, no se pudo completar la acción.',
          });
          this.loader = false;
          this.cdr.detectChanges();
          console.error('Error al extraer registros: ', error);
        },
      });
  }

  emitirCapturarRegistrosIA() {
    this.abrirModalFlag = true;

    setTimeout(() => {
      this.abrirModalFlag = false;
    }, 100);
  }

  desactivarInteraccionIA() {
    Swal.fire({
      title:
        '¿Desea desactivar la interacción automática del Asistente Whatsapp?',
      icon: 'warning',
      showCancelButton: true,
      reverseButtons: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Desactivar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loader = true;

        // Buscar el idCampaniaGeneralDetalleWhatsApp más reciente que sea distinto de 0
        const ultimaCampania = this.historialAlumno.find(
          (item: any) => item.idCampaniaGeneralDetalleWhatsApp !== 0
        );

        if (ultimaCampania) {
          const idCampania = ultimaCampania.idCampaniaGeneralDetalleWhatsApp;
          this.integraService
            .postJsonResponse(
              `${constApiMarketing.DesactivarInteraccionAutomaticaWhatsapp}/${this.celularAlumno}/${idCampania}`,
              null
            )
            .subscribe({
              next: (response: HttpResponse<any>) => {
                Swal.fire({
                  title: response.body.descripcion,
                  icon: 'success',
                });
                this.loader = false;
                console.log(response);
              },
              error: (error) => {
                this.loader = false;
                console.error(
                  'Error al desactivar la interacipon automática:',
                  error
                );
                Swal.fire({
                  title: 'Error al desactivar la interacipon automática',
                  icon: 'error',
                });
              },
            });
        } else {
          Swal.fire({
            title: 'No se encontró una campaña válida.',
            icon: 'error',
          });
          this.loader = false;
        }
      }
    });
  }
}

import { HttpResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { IOportunidadFormularioWhatsapp } from '@comercial/models/interfaces/imodulo-creacion-oportunidad';
import { constApiComercial, constApiMarketing } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ExpansionPanelComponent } from '@progress/kendo-angular-layout';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { WhatsappFacebookModalPlantillaComponent } from '../whatsapp-facebook-modal-plantilla/whatsapp-facebook-modal-plantilla.component';
import { map, Observable, of, Subject, switchMap } from 'rxjs';
import { ISentinelEstado } from '@comercial/models/interfaces/iagenda-sentinel';
import { UserService } from '@shared/services/user.service';
import { NotificationService } from '@progress/kendo-angular-notification';
import { SafeHtml } from '@angular/platform-browser';
import { WhatsappFacebookService } from '@marketing/services/whatsapp-facebook.service';
import { IMensajesWhatsapp } from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
import { AgendaService } from '@comercial/services/agenda/agenda.service';
export interface WhatsAppMensajeArchivo {
  waTo: string;
  waType: string;
  waLink: string;
  waFileName: string;
  idPais: number;
  idAlumno: number;
  idPersonal: number;
}
@Component({
  selector: 'app-whatsapp-facebook-oportunidad',
  templateUrl: './whatsapp-facebook-oportunidad.component.html',
  styleUrls: ['./whatsapp-facebook-oportunidad.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WhatsappFacebookOportunidadComponent implements OnInit {
  @ViewChild('contentC', { static: true }) containerRef!: ElementRef;
  @ViewChild('modalOportunidad') modalOportunidad: any;
  @ViewChild('modalSemaforoFinanciero') modalSemaforoFinanciero: any;
  @ViewChild('modalSeleccionarArchivo') modalSeleccionarArchivo: any;
  @ViewChildren(ExpansionPanelComponent)
  panels: QueryList<ExpansionPanelComponent>;
  @ViewChild('nroDoc') nroDoc: ElementRef;

  @Input() agendaService: AgendaService;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private userService: UserService,
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private cdRef: ChangeDetectorRef,
    private whatsappFacebookService: WhatsappFacebookService
  ) {}
  usuario = JSON.parse(localStorage.getItem('userData'));
  private esDesdeAbrirModalCaso3: boolean = false;
  public esFlujoDesdeAbrirModalCaso3: boolean = false;
  public esComboDisabled: boolean = false;
  public esBotonAsignarDisabled: boolean = false;
  public esDesdeActualizarCentroCosto: boolean = false;
  public esDesdeCrearOportunidad: boolean = false;
  isComboDisabled = true;
  loaderChatWhatsapp: boolean = false;
  loaderMensajes: boolean = false;

  dateTimeConfig = {
    format: 'yyyy-MM-dd HH:mm',
    min: new Date(),
    max: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    readonly: false,
  };
  focusedDate: Date = new Date();
  formProgramarActividad: FormGroup = this.formBuilder.group({
    comentario: ['', Validators.maxLength(500)],
    fechaProgramada: [null],
    idAsesor: [null, Validators.required],
  });

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
  listaOportunidades: any[] = [];
  idAsesorActual: number | undefined; // Declara como propiedad de clase

  idAlumnoInput: number;
  dataCentroCosto: IComboBase1[] = [];
  dataCentroCostoModal: IComboBase1[] = [];
  sourceCentroCosto: IComboBase1[] = [];
  sourceCentroCostoModal: IComboBase1[] = [];

  dataAsesor: IComboBase1[] = [];
  dataAsesorModal: IComboBase1[] = [];
  sourceAsesor: IComboBase1[] = [];
  sourceAsesorModal: IComboBase1[] = [];

  formOportunidad: FormGroup = this.formBuilder.group({
    idCentroCosto: ['', Validators.required],
    idPersonalAsignado: [null],
  });

  modalRef: any;
  loaderGeneral = false;
  alumnoTemp: any;

  resetSentinel$ = new Subject<boolean>();
  existeSemaforo: boolean;
  archivoTemporal: File = null;
  modalArchivoRef: NgbModalRef;
  modalDocumentoRef: NgbModalRef;
  cantidadCaracterMensaje: number = 0;
  fileWhatsapp: any;
  previsualizacion: SafeHtml = '&nbsp;';
  modalPlantillaRef: NgbModalRef;
  nombrePersonal: string = 'Usuario';

  dragOver: boolean = false;
  showCrearOportunidadContenedor = false;

  ngOnInit(): void {
    this.loader = true;
    // Obtener el nombre del usuario actual
    if (this.usuario && this.usuario.nombreCompleto) {
      this.nombrePersonal = this.usuario.nombreCompleto;
    }

    if (this.data[1] == false) {
      this.idPersonal = this.data[0].idPersonal;
      this.celularAlumno = this.data[0].celular;

      if (this.data[0].idAlumno == null || this.data[0].idAlumno == undefined) {
        this.idAlumno = 0;
      } else {
        this.idAlumno = this.data[0].idAlumno;
      }
      this.obtenerChat();
      this.obtenerCombos();
    }
    if (this.data[1] == true) {
      this.loaderMensajes = true;
      this.celularAlumno = this.data[0][0].celularUM;
      this.idAlumno = this.data[0][0].idAlumnoUM;
      this.datosChat = this.data[0][0];
      this.idPersonal = 4659;
      this.loader = false;
      this.alumnosPorCelular = this.datosChat.listaAlumnosPorCelular;
      this.mensajesWhats = this.datosChat.mensajePorCelular;

      // Simular un pequeño delay para mostrar el loader
      setTimeout(() => {
        this.loaderMensajes = false;
      }, 500);
    }
  }

  ngAfterViewInit() {
    this.scrollToEnd();
  }

  wordCount: number = 0;
  datosAlumno: any = [];
  idAlumno: any;
  celularAlumno = '';
  idPersonal: any;
  isEditable = false;
  editar = false;
  archivado: any = false;
  desuscrito: any = false;
  listaCombos: any = [];
  listaProfesion: any = [];
  listaAreaFormacion: any = [];
  listaAreaTrabajo: any = [];
  listaCargo: any = [];
  listaIndustria: any = [];
  listaTamanioEmpresa: any = [];
  grilla: any = [];
  celular: any;
  celular2: any;
  loader: any = false;
  idAlumnoExpansion: any;
  panelAbierto: number | null = null;
  celularGrilla: any;
  idPais: any;
  idAlumnoEnvio: any;

  countWords() {
    const words = this.newMessage.trim().split(/\s+/);
    this.wordCount = words.length;
  }

  scrollToEnd() {
    if (this.containerRef && this.containerRef.nativeElement) {
      const container = this.containerRef.nativeElement;
      container.scrollTop = container.scrollHeight;
    }
  }

  obtenerGrilla() {
    this.integraService
      .obtener(
        `${
          constApiMarketing.ObtenerDatosAlumnoWhatsApp +
          '/' +
          this.idAlumnoExpansion
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.grilla = response.body.historialAlumno;
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
          this.loader = false;
        },
      });
  }

  obtenerChat() {
    this.loader = false;
    this.loaderMensajes = true;
    this.integraService
      .obtener(
        `${constApiMarketing.ObtenerChatsMasivo + '/' + this.celularAlumno}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body[0]);

          this.datosChat = response.body[0];
          this.alumnosPorCelular = this.datosChat.listaAlumnosPorCelular;
          this.mensajesWhats = this.datosChat.mensajePorCelular;

          this.idPais = this.datosChat.idPaisEmpresa;
          this.idAlumnoEnvio = this.datosChat.idAlumnoUM;

          setTimeout(() => {
            console.log(this.containerRef);
            this.containerRef.nativeElement.scrollTop =
              this.containerRef.nativeElement.scrollHeight;
          }, 1000);
          this.loader = false;
          this.loaderMensajes = false;
        },
        error: (error) => {
          console.log(error);
          this.loader = false;
          this.loaderMensajes = false;
        },
        complete: () => {
          this.loader = false;
          this.loaderMensajes = false;
        },
      });
  }

  obtenerCombos() {
    this.integraService.obtener(`${constApiMarketing.Combos}`).subscribe({
      next: (response: HttpResponse<any>) => {
        this.loader = false;
        this.listaCombos = response.body;
        this.listaAreaFormacion = this.listaCombos.comboAreaFormacion;
        this.listaAreaTrabajo = this.listaCombos.comboAreaTrabajo;
        this.listaCargo = this.listaCombos.comboCargo;
        this.listaIndustria = this.listaCombos.comboIndustria;
        this.listaTamanioEmpresa = this.listaCombos.comboTamanioEmpresa;
      },
      error: (error) => {
        console.log(error);
        this.loader = false;
      },
      complete: () => {
        this.loader = false;
      },
    });
  }

  handleFilter(value: any) {
    this.data = this.listaAreaFormacion.filter(
      (s: any) => s.text.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  ObtenerDatosAlumnoWhatsApp() {
    this.integraService
      .obtener(
        `${
          constApiMarketing.ObtenerDatosAlumnoWhatsApp +
          '/' +
          this.idAlumnoExpansion
        }`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.datosAlumno = response.body;

          if (
            this.datosAlumno != undefined ||
            this.datosAlumno.obtenerAtributosAlumno != null
          ) {
            this.nombre = this.datosAlumno.obtenerAtributosAlumno.nombre1;
            this.nombre2 = this.datosAlumno.obtenerAtributosAlumno.nombre2;
            this.celular = this.datosAlumno.obtenerAtributosAlumno.celular;
            //this.celular2 = this.datosAlumno.obtenerAtributosAlumno.celular2;
            this.celular2 = this.datosAlumno.obtenerAtributosAlumno.telefono;
            this.apellidoPaterno =
              this.datosAlumno.obtenerAtributosAlumno.apellidoPaterno;
            this.apellidoMaterno =
              this.datosAlumno.obtenerAtributosAlumno.apellidoMaterno;
            this.email1 = this.datosAlumno.obtenerAtributosAlumno.email1;
            this.email2 = this.datosAlumno.obtenerAtributosAlumno.email2;
            this.profesion =
              this.datosAlumno.obtenerAtributosAlumno.idAFormacion;
            this.cargo = this.datosAlumno.obtenerAtributosAlumno.idCargo;
            this.areaLaboral =
              this.datosAlumno.obtenerAtributosAlumno.idATrabajo;
            this.dni = this.datosAlumno.obtenerAtributosAlumno.dni;
            this.tamanioEmpresa =
              this.datosAlumno.obtenerAtributosAlumno.idTamanioEmpresaAgenda;
            this.industria =
              this.datosAlumno.obtenerAtributosAlumno.idIndustria;
            this.oportunidad =
              this.datosAlumno.obtenerAtributosAlumno.oportunidad;
            this.centroCosto =
              this.datosAlumno.obtenerAtributosAlumno.centroCosto;
            this.archivado = this.datosAlumno.obtenerAtributosAlumno.archivado;
            this.desuscrito =
              this.datosAlumno.obtenerAtributosAlumno.desuscrito;
          }
        },
        error: (error) => {
          console.log(error);
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
          console.log(response.body);
          Swal.fire('Success!', 'Se Desuscribio Chat  Exitosamente', 'success');
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
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
          console.log(response.body);
          Swal.fire('Éxito', 'Se suscribió el chat exitosamente', 'success');
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
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
          console.log(response.body);
          Swal.fire('Success!', 'Se archivo Chat Exitosamente', 'success');

          this.loader = false;
        },
        error: (error) => {
          console.log(error);
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
          console.log(response.body);
          Swal.fire('Success!', 'Se DesArchivo Chat Exitosamente', 'success');
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  datosChat: any = [];
  alumnosPorCelular: any = [];
  mensajesWhats: any = [];

  newMessage: string;
  nombre = '';
  nombre2 = '';
  apellidoPaterno = '';
  apellidoMaterno = '';
  email1 = '';
  email2 = '';
  profesion = 0;
  cargo = 0;
  areaLaboral = 0;
  industria = 0;
  tamanioEmpresa = 0;
  dni = '';
  oportunidad = '';
  centroCosto = '';

  limpiar() {
    this.nombre = '';
    this.nombre2 = '';
    this.apellidoPaterno = '';
    this.apellidoMaterno = '';
    this.email1 = '';
    this.email2 = '';
    this.profesion = 0;
    this.dni = '';
    this.cargo = 0;
    this.areaLaboral = 0;
    this.industria = 0;
    this.tamanioEmpresa = 0;
    this.oportunidad = '';
    this.centroCosto = '';
  }

  selectChat(e: any) {}

  mensajePrueba: any;

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

    this.mensajePrueba = result;

    return result;
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  sendMessage() {
    this.loaderChatWhatsapp = true;

    var jsonEnvioMensaje = {
      Id: 0,
      WaTo: this.celularAlumno,
      WaType: 'text',
      WaTypeMensaje: 1,
      WaRecipientType: 'individual',
      WaBody: this.newMessage,
      IdPais: 51,
      IdPersonal: this.idPersonal,
      IdAlumno: this.idAlumno,
      EsMigracion: true,
      IdMigracion: 0,
      usuario: 'autoperaciones',
    };

    var jsonEnvio = {
      celularWhatsApp: this.celularAlumno,
      mensaje: this.newMessage,
      idPais: this.idPais,
      idAlumno: this.idAlumnoEnvio,
      idPersonal: this.idPersonal,
      usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.EnvioMensajeFacebook, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.obtenerChat();
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

  onChange(e: any, id: any) {
    console.log(e);
    console.log(id);
    this.idAlumnoInput = id.idAlumno;
    this.idAlumnoExpansion = id.idAlumno;
    this.obtenerGrilla();
    this.ObtenerDatosAlumnoWhatsApp();
    this.obtenerAsesor();
  }

  Editar() {
    this.isEditable = !this.isEditable;
    this.editar = true;
    console.log(this.editar);
  }

  Cancelar() {
    this.editar = false;
    this.isEditable = false;
  }

  GuardarCambiosAlumno() {
    if (this.idPais === 51) {
      if (this.dni && !/^\d{8}$/.test(this.dni)) {
        // Verifica que el DNI tenga exactamente 8 números solo si no está vacío
        Swal.fire(
          'Error!',
          'El DNI debe ser un número de 8 caracteres para Perú.',
          'error'
        );
        this.loader = false;
        return;
      }
    }
    this.loader = true;
    var jsonEnvio = {
      id: this.datosAlumno.obtenerAtributosAlumno.id,
      nombre1: this.nombre,
      nombre2: this.nombre2,
      apellidoPaterno: this.apellidoPaterno,
      apellidoMaterno: this.apellidoMaterno,
      celular: this.celular,
      telefono: this.celular2,
      email1: this.email1,
      email2: this.email2,
      idIndustria: this.industria,
      idAFormacion: this.profesion,
      idATrabajo: this.areaLaboral,
      idCargo: this.cargo,
      idTamanioEmpresaAgenda: this.tamanioEmpresa,
      dni: this.dni,
      desuscrito: false,
      archivado: true,
    };
    const dniValue = this.nroDoc.nativeElement.value;
    this.integraService
      .postJsonResponse(constApiMarketing.ActualizarAlumnoWhatsapp, jsonEnvio)
      .pipe(
        switchMap(() => {
          if (dniValue) {
            return this.VerificaSemaforo(dniValue).pipe(
              switchMap((existeSemaforo: boolean) => {
                if (!existeSemaforo && this.idPais == 51) {
                  return this.GeneraSemaforoFinanciero(dniValue);
                }
                return of(null);
              })
            );
          }
          return of(null);
        })
      )
      .subscribe({
        next: (response) => {
          Swal.fire(
            'Success!',
            'Se Guardaron los Cambios Exitosamente',
            'success'
          );
          this.obtenerChat();
          this.newMessage = '';
          this.loader = false;
        },
        error: (error) => {
          // Manejar el error por límite de actualizaciones
          if (
            error &&
            error.error ===
              'No se puede actualizar el alumno más de dos veces en el mismo día.'
          ) {
            Swal.fire(
              'Límite de actualizaciones alcanzado',
              'El alumno ya fue actualizado dos veces hoy. No puede realizar más cambios.',
              'warning'
            );
          } else {
            console.log(error);
            Swal.fire(
              'Error!',
              'Ocurrió un error al guardar los cambios.',
              'error'
            );
          }
          this.loader = false;
        },
      });
  }

  VerificaSemaforo(dniValue: any): Observable<boolean> {
    return this.integraService
      .getJsonResponse(`${constApiComercial.ObtenerSentinelPorDni}/${dniValue}`)
      .pipe(
        map((resp) => {
          const id = resp.body.id?.toString().trim();
          this.existeSemaforo = id !== '0';
          return this.existeSemaforo;
        })
      );
  }

  GeneraSemaforoFinanciero(
    dniValue: any
  ): Observable<HttpResponse<ISentinelEstado>> {
    if (dniValue.length == 8) {
      this.mostrarMensajeSemaforoFinanciero();
      this.resetSentinel();
      return this.integraService.getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadActualizarSentinelAlumno}/${dniValue}/${this.alumnosPorCelular[0].idAlumno}/${this.userService.userName}`
      );
    } else {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'El numero de DNI a consultar debe tener 8 digitos',
      });
      return of(null);
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

  resetSentinel() {
    this.resetSentinel$.next(true);
  }

  selectionChangeP(e: any) {
    this.profesion = e.id;
  }

  selectionChangeC(e: any) {
    this.cargo = e.id;
  }

  selectionChangeA(e: any) {
    this.areaLaboral = e.id;
  }

  selectionChangeI(e: any) {
    this.industria = e.id;
  }

  selectionChangeT(e: any) {
    this.tamanioEmpresa = e.id;
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

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
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },
        complete: () => {
          this.loader = false;
          this.obtenerGrilla();
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
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },
        complete: () => {
          this.loader = false;
          this.obtenerGrilla();
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }

  DescontarV(e: any) {
    this.loader = true;
    var jsonEnvio = {
      IdAlumno: e.idAlumno,
      CelularWhatsApp: e.celularWhatsApp,
      IdCampaniaGeneralDetalleWhatsApp: e.idCampaniaGeneralDetalleWhatsApp,
      Usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.RestaChatValidoWhatsApp, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },
        complete: () => {
          this.loader = false;
          this.obtenerGrilla();
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
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },
        complete: () => {
          this.loader = false;
          this.obtenerGrilla();
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
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },
        complete: () => {
          this.loader = false;
          this.obtenerGrilla();
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
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },
        complete: () => {
          this.loader = false;
          this.obtenerGrilla();
        },
        error: (error) => {
          this.loader = false;
        },
      });
  }

  //------------------ Modales ------------//
  abrirModalPlantilla() {
    const dialogRef = this.dialog.open(
      WhatsappFacebookModalPlantillaComponent,
      {
        width: '1200px',
        height: '600px',
        panelClass: 'dialog-gestor',
        data: this.datosChat,
      }
    );

    dialogRef.afterClosed().subscribe((result: any) => {
      this.obtenerGrilla();
    });
  }

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
      console.log(this.formOportunidad.getRawValue());
      this.loader = true;

      let dataForm = this.formOportunidad.getRawValue();
      let envio: IOportunidadFormularioWhatsapp = {
        idAlumno: this.idAlumno,
        idCentroCosto: dataForm.idCentroCosto,
        idPersonalAsignado: 125,
      };

      this.idAsesorActual = 125;
      console.log(JSON.stringify(envio));

      this.integraService
        .postJsonResponse(constApiMarketing.CrearOportunidadWhatsapp, envio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            const idOportunidad = Number(response.body);
            console.log('Tipo de idOportunidad:', typeof idOportunidad);
            if (!isNaN(idOportunidad)) {
              this.idOportunidad = idOportunidad;
              this.ObtenerProgramaPorOportunidadWhatsapp(idOportunidad);
            } else {
              console.error('idOportunidad no es un número válido.');
            }
            console.log(response);
            console.log('Response body este es el id:', response.body);
          },
          error: (error) => {
            this.alertaService.notificationError(error.error);
          },
          complete: () => {
            this.modalRef.close('submitted');
            this.loader = false;
          },
        });
    } else this.formOportunidad.markAllAsTouched();
  }

  obtenerAsesor() {
    this.integraService
      .obtener(`${constApiMarketing.ObtenerAsesor}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loader = false;
          this.dataAsesorModal = response.body;
          const asesorPorDefecto = this.dataAsesorModal.find(
            (asesor: any) => asesor.id === 125
          );
          if (asesorPorDefecto) {
            console.log('Asesor por defecto encontrado:', asesorPorDefecto);
            this.formOportunidad
              .get('idPersonalAsignado')
              ?.setValue(asesorPorDefecto.id);
            this.cdRef.detectChanges(); // Fuerza la actualización de la vista
          } else {
            console.warn('El asesor con ID 125 no fue encontrado.');
          }
        },
        error: (error) => {
          console.log(error);
          this.loader = false;
        },
        complete: () => {
          this.loader = false;
        },
      });
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
  AbrirModalCaso3(idOportunidad: number) {
    console.log('ID Oportunidad seleccionado:', idOportunidad);
    this.loader = true;
    this.esFlujoDesdeAbrirModalCaso3 = true;
    this.esDesdeAbrirModalCaso3 = true;
    this.ObtenerIdAsesorActual(idOportunidad);
    this.ObtenerProgramaPorOportunidadWhatsapp(idOportunidad);
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
            console.log('ID del asesor actual:', this.idAsesorActual);

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
            console.log('Asignación de asesor exitosa:', response);
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
          console.log('Cierre de oportunidad en RN5 exitoso:', response);
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
      console.log(jsonEnvio);
      this.integraService
        .postJsonResponse(
          constApiMarketing.AsignarCentroCostoPorPragramaAsesor,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Oportunidad actualizada correctamente:', response);
            const asignaciones =
              response.body?.oportunidadesAsesorAsignacionAutomatica;

            if (asignaciones && asignaciones.length > 0) {
              this.idOportunidad = asignaciones[0].id;
              console.log('ID de la Oportunidad:', this.idOportunidad);

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
  onProgramaSeleccionado(programa: any) {
    this.programaSeleccionado = programa;
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
            console.log('Datos  actualizados correctamente:', response);
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
            console.log('Datos  actualizados correctamente:', response);
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
              nombrePersonal: this.nombrePersonal,
            };
            this.obtenerChat();
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
}

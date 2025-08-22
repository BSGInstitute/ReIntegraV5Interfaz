import { Subscription } from 'rxjs';
import { datePipeTransform } from '@shared/functions/date-pipe';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IArbolOcurrenciaAlterno,
  IPlantillaActividadOcurrencia,
  IReporteIncidencia,
} from '@integra/areas/comercial/models/interfaces/iarbol-ocurrencia-alterno';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IAlumnoInformacion } from '@integra/areas/comercial/models/interfaces/iagenda-datos-alumno';
import { HttpResponse } from '@angular/common/http';
import { CrmService } from '@shared/services/crm.service';
import { ModalContentVentaCruzadaComponent } from '../modal-content-venta-cruzada/modal-content-venta-cruzada.component';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { AlertaService } from '@shared/services/alerta.service';
import Swal from 'sweetalert2';
import {
  IComprobantePago,
  IDatoOportunidad,
  IFormProgramarActividad,
} from '@comercial/models/interfaces/iagenda-programacion';
import { FormService } from '@shared/services/form.service';
import { DateValidator } from '@shared/validators/date.validator';
import { IOportunidadAgenda } from '@comercial/models/interfaces/iagenda-documento-programa';
import { IPlantillaWhatsApp } from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { SharedService } from '@shared/services/shared.service';

/**
 * @module ComercialModule
 * @description Componente de Reporte de Incidencias, Arbol de Ocurrencias, Reprogramaciones
 * @author Flavio Rodrigo Mamani Fabian
 * @version 1.0.1
 * @history
 * * 03/10/2022 Implementacion de arbol de ocurrencias
 * * 06/12/2022 Creacion de interfaces de reprogramacion, implementacion de envio de mensajes de whatsapp
 * * 01/03/2024 Implementacion Ventana comentario
 */

@Component({
  selector: 'app-reporte-incidencia',
  templateUrl: './reporte-incidencia.component.html',
  styleUrls: ['./reporte-incidencia.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteIncidenciaComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private crmService: CrmService,
    private formBuilder: FormBuilder,
    private formService: FormService,
    private alertaService: AlertaService,
    private _sharedService: SharedService
  ) {}

  @ViewChild('modalProgramacionActividades') modalProgramacionActividades: any;
  @ViewChild('modalFormPrograma') modalFormPrograma: any;

  @Input() agendaService: AgendaService;

  private _rowActual: IRowActual;
  private _alumno: IAlumnoInformacion;

  btnProgramarActividad = {
    disabled: false,
    show: false,
  };
  btnCrearOportunidad = {
    disabled: false,
    show: false,
  };
  btnCerrarOportunidad = {
    disabled: false,
    show: false,
  };

  dataProblemaLlamada = [
    { id: 1, nombre: 'No ha habido ningun problema' },
    { id: 2, nombre: 'Ha habido Interferencias en la llamada' },
    { id: 3, nombre: 'No se puede escuchar al cliente' },
    { id: 4, nombre: 'El cliente no me puede escuchar' },
    { id: 5, nombre: 'Se corta la llamada' },
    { id: 6, nombre: 'Llamada al vacio' },
  ];
  dataCalidadLlamada = [
    { id: 1, nombre: '0 - Muy Mala' },
    { id: 2, nombre: '1 - Mala' },
    { id: 3, nombre: '2 - Normal' },
    { id: 4, nombre: '3 - Buena' },
    { id: 5, nombre: '4 - Muy Buena' },
    { id: 6, nombre: '5 - Excelente' },
  ];

  gridProgramarActividad: KendoGrid = new KendoGrid();
  focusedDate: Date = new Date();
  arbolOcurrencia: IArbolOcurrenciaAlterno[] = [];
  private _plantillaAutomaticaWhatsapp: IPlantillaActividadOcurrencia;
  private _diasSinContactoOportunidad: number = 0;
  private _tipoProgramacion: 1 | 2 | 3 = null;
  private _tipoProgramacionNombre: string = '';
  private _plantillaWhatsApp: IPlantillaWhatsApp[] = [];
  private _ocurrenciaLlamada: string[] = [];
  flagError: string = '';
  flagErrorAlumno: string[] = [];
  btnModalCerrarActividad: boolean = false;
  btnModalProgramarDisabled: boolean = false;
  showAlertModalProgramacion: boolean = false;
  programacionActividad = {
    titulo: '',
    show: false,
  };
  showInputFacturaPeru: boolean = false;
  showInputFacturaOtro: boolean = false;
  showInputFactura: boolean = false;
  showBoletaOtro: boolean = false;
  itemOcurrenciaTemp: IArbolOcurrenciaAlterno;
  showGrupoFecha: boolean = false;
  formBtnProgramarActividad = {
    show: false,
    disabled: false,
  };
  formBtnCerrarActividad = {
    show: false,
    disabled: false,
  };
  formProgramarActividad: FormGroup = this.formBuilder.group({
    comentario: '',
    fechaProgramada: [
      null,
      [Validators.required, DateValidator.noEsMayorFechaActual],
    ],
    problemaLlamada: 1,
    calidadLlamada: 1,
    fechaInicioPrograma: null,
    tipoComprobante: null,
    rutFactura: null,
    rucFactura: null,
    razonSocialFactura: null,
    direccionFactura: null,
    comentarioComprobante: null,
    estadoFaseIP: null,
    estadoFasePF: null,
    fechaEnvioFichaPF: new Date(),
    fechaPagoPF: new Date(),
    estadoFaseIC: null,
    fechaPagoIC: null,
    codigoPagoIC: null,
  });
  dateTimeConfig = {
    format: 'yyyy-MM-dd HH:mm',
    min: new Date(),
    max: new Date(),
    readonly: false,
  };
  dateTimeConfigIS = {
    format: 'yyyy-MM-dd HH:mm',
    min: new Date(),
    max: null as Date,
    readonly: false,
  };
  modalRef: any;
  estadoCargaOcurrencias: boolean = false;
  faseOportunidadIP: boolean = true;
  faseOportunidadPF: boolean = true;
  faseOportunidadIC: boolean = true;
  comprobantePagoIS: boolean = true;
  dataEstadoFase: Array<{ id: number; nombre: string }> = [
    { id: 1, nombre: 'Solido' },
    { id: 2, nombre: 'Dudoso' },
  ];
  steps: any = {
    minute: 15,
  };
  counter: string = '';
  datosOportunidad: IOportunidadAgenda;
  subscriptions$: Subscription = new Subscription();
  flagTabWhatsapp: boolean = false;
  flagTabCorreos: boolean = false;
  ngOnInit(): void {
    this._rowActual = this.agendaService.rowActual;
    this.initSubscribeObservables();
    this._ocurrenciaLlamada =
      this.agendaService.agendaArbolOcurrenciaService.ocurrenciaLlamada;
  }
  ngOnDestroy() {
    this.subscriptions$.unsubscribe();
  }

  onOpen() {
    this.focusedDate = new Date();
  }
  initSubscribeObservables() {
    let sub1$ = this.agendaService.agendaAlumnoService.alumno$.subscribe(
      (resp) => {
        if (resp != null) this._alumno = resp;
      }
    );
    let sub2$ =
      this.agendaService.agendaInformacionActividadOportunidadService.diasSinContactoOportunidad$.subscribe(
        (resp) => (this._diasSinContactoOportunidad = resp)
      );
    let sub3$ =
      this.agendaService.agendaDocumentosProgramaService.oportunidadPEspecifico$.subscribe(
        (resp) => (this.datosOportunidad = resp.oportunidad)
      );
    let sub4$ =
      this.agendaService.agendaInformacionActividadOportunidadService.plantillaWhatsApp$.subscribe(
        (resp) => {
          if (resp != null) {
            this._plantillaWhatsApp = resp;
          }
        }
      );
    let sub5$ =
      this.agendaService.agendaArbolOcurrenciaService.arbolOcurrencias$.subscribe(
        {
          next: (resp) => {
            if (resp != null) {
              if (
                this.agendaService.tabActual != null &&
                this.agendaService.tabActual.nombreTab == 'Whatsapp'
              ) {
                this.flagTabWhatsapp = true;
                if (resp != null && resp.length > 0) {
                  let arbol = resp.filter((x) =>
                    x.roles.split(',').includes(this.agendaService.tipoPersonal)
                  );
                  if (this.agendaService.tipoPersonal == 'Asesor') {
                    let index = arbol.findIndex(
                      (x) =>
                        x.nombreOcurrencia == 'Respuesta mediante otro medio'
                    );
                    if (index == -1) {
                      arbol.unshift(
                        resp.find(
                          (x) =>
                            x.nombreOcurrencia ==
                            'Respuesta mediante otro medio'
                        )
                      );
                    }
                  }
                  this.arbolOcurrencia = arbol;
                  this.estadoCargaOcurrencias = true;
                } else {
                  this.estadoCargaOcurrencias = false;
                }
              } else if (
                this.agendaService.tabActual != null &&
                this.agendaService.tabActual.nombreTab == 'Correos'
              ) {
                this.flagTabWhatsapp = false;
                this.flagTabCorreos = true;
                if (resp != null && resp.length > 0) {
                  let arbol = resp.filter((x) =>
                    x.roles.split(',').includes(this.agendaService.tipoPersonal)
                  );
                  if (this.agendaService.tipoPersonal == 'Asesor') {
                    let index = arbol.findIndex(
                      (x) =>
                        x.nombreOcurrencia == 'Respuesta mediante otro medio'
                    );
                    if (index == -1) {
                      arbol.unshift(
                        resp.find(
                          (x) =>
                            x.nombreOcurrencia ==
                            'Respuesta mediante otro medio'
                        )
                      );
                    }
                  }
                  this.arbolOcurrencia = arbol;
                  this.estadoCargaOcurrencias = true;
                } else {
                  this.estadoCargaOcurrencias = false;
                }
              } else {
                this.flagTabWhatsapp = false;
                this.flagTabCorreos = false;
                if (resp != null && resp.length > 0) {
                  this.arbolOcurrencia = resp.filter((x) =>
                    x.roles.split(',').includes(this.agendaService.tipoPersonal)
                  );
                  this.estadoCargaOcurrencias = true;
                } else {
                  this.estadoCargaOcurrencias = false;
                }
              }
            }
          },
        }
      );
    this.subscriptions$.add(sub1$);
    this.subscriptions$.add(sub2$);
    this.subscriptions$.add(sub3$);
    this.subscriptions$.add(sub4$);
    this.subscriptions$.add(sub5$);
  }
  get showOcurrencias$() {
    return this.crmService.showOcurrencias$;
  }
  get esWhatsappCorreos() {
    return this.agendaService.esWhatsappCorreos;
  }
  onOpenFechaReprogramacion() {
    this.focusedDate = new Date();
  }
  /**
   * Realiza el conteo de caracteres de comentario
   * @param {string} event
   */
  onValueChangeComentario(event: string): void {
    let cant = event.length;
    this.counter = `${cant}/500`;
  }
  /**
   * @description Habilitad y Deshabilita los opciones de reprogramacion.
   * @param {boolean} flag
   */
  disabledBotones(flag: boolean) {
    this.btnProgramarActividad.disabled = flag;
    this.btnCrearOportunidad.disabled = flag;
    this.btnCerrarOportunidad.disabled = flag;
  }
  /**
   * Oculta las opciones de reprogramacion de ocurrencias.
   */
  private ocultarBotones() {
    this.btnProgramarActividad.show = false;
    this.btnCrearOportunidad.show = false;
    this.btnCerrarOportunidad.show = false;
  }
  /**
   * Obtiene la plantilla de WhatsApp por el idOcurrenciaActividad
   */
  private obtenerPlantillaOcurrencia() {
    if (this.itemOcurrenciaTemp.plantilla != null) {
      this.itemOcurrenciaTemp.plantilla.toggle =
        this.itemOcurrenciaTemp.plantilla.toggle;
    } else {
      let filtroPlantilla =
        this.agendaService.agendaInicializarService.plantillasPorIdFaseOportunidad$.value.filter(
          (e) => e.idPlantilla === this.itemOcurrenciaTemp.idPlantillaSpeech
        );

      if (filtroPlantilla.length > 0) {
        this.itemOcurrenciaTemp.plantilla = {
          titulo: this.itemOcurrenciaTemp.nombreOcurrencia,
          contenido: filtroPlantilla[0].valor,
          toggle: true,
        };
      }
    }
  }
  showOcurrenciasWhatsapp: boolean = false;
  /**
   * Obtiene la plantilla de WhatsApp por el idOcurrenciaActividad
   */
  onClickItemOcurrencia(item: IArbolOcurrenciaAlterno, nivel: number) {
    this.itemOcurrenciaTemp = item;
    item.toggle = !item.toggle;
    let esHijo: boolean = false;
    if (nivel == 1) {
      if (item.nombreOcurrencia == 'Respuesta mediante otro medio') {
        if (this.flagTabWhatsapp) {
          this.showOcurrenciasWhatsapp = true;
        } else if (this.flagTabCorreos) {
          this.showOcurrenciasWhatsapp = true;
        } else {
          this.showOcurrenciasWhatsapp = false;
        }
      } else {
        this.showOcurrenciasWhatsapp = false;
      }
    }
    item.ocurrenciasHijos = null;
    if (item.toggle == true) {
      this.arbolOcurrencia.forEach((e) => {
        if (nivel == 1) {
          e.toggle = false;
          esHijo = true;
        }
        if (e.ocurrenciasHijos != null && e.ocurrenciasHijos.length > 0) {
          e.ocurrenciasHijos.forEach((f) => {
            if (nivel == 2 || esHijo == true) {
              f.toggle = false;
              esHijo = true;
            }
            if (f.ocurrenciasHijos != null && f.ocurrenciasHijos.length > 0) {
              f.ocurrenciasHijos.forEach((g) => {
                if (nivel == 3 || esHijo == true) {
                  g.toggle = false;
                  esHijo = false;
                }
              });
            }
          });
        }
      });
      item.toggle = true;
    }
    this.ocultarBotones();
    if (item.toggle) {
      if (item.tieneOcurrencias) {
        item.class = 'childShow';
      }
      this.cargarReporteIncidencia();
    }
  }
  private cargarReporteIncidencia() {
    let data: IReporteIncidencia = {
      idContacto: this._rowActual.idAlumno,
      idOcurrenciaReporte: this.itemOcurrenciaTemp.idOcurrenciaReporte,
      idFaseOportunidad: this._rowActual.idFaseOportunidad,
      idActividadOcurrencia: this.itemOcurrenciaTemp.idOcurrenciaActividad,
      diasSinContactoOportunidad: this._diasSinContactoOportunidad,
      idActividadCabecera: this._rowActual.idActividadCabecera,
      tieneOcurrencias: this.itemOcurrenciaTemp.tieneOcurrencias,
    };
    this.agendaService.agendaArbolOcurrenciaService
      .cargarReporteIncidencia$(data)
      .subscribe({
        next: (resp) => {
          this._plantillaAutomaticaWhatsapp =
            resp.body.plantillaAutomaticaWhatsapp;
          this.disabledBotones(false);

          if (this.itemOcurrenciaTemp.tieneOcurrencias) {
            if (resp.body.arbolOcurrencia.length > 0) {
              let tipoPersonal = this.agendaService.esCoordinadora$.value
                ? 'Coordinador'
                : 'Asesor';
              if (this.showOcurrenciasWhatsapp && tipoPersonal == 'Asesor') {
                tipoPersonal = 'Coordinador';
              }
              this.itemOcurrenciaTemp.ocurrenciasHijos =
                resp.body.arbolOcurrencia.filter((x: any) =>
                  x.roles.split(',').includes(tipoPersonal)
                );
            }
          } else {
            this.obtenerPlantillaOcurrencia();
          }
          if (
            this.itemOcurrenciaTemp.nombreEstadoOcurrencia == 'NO EJECUTADO' &&
            this.itemOcurrenciaTemp.idOcurrenciaReporte != 234 &&
            this.itemOcurrenciaTemp.idOcurrenciaReporte != 413 &&
            this.itemOcurrenciaTemp.tieneOcurrencias == false
          ) {
            this._tipoProgramacion = 2;
            this.btnProgramarActividad.show = true;
            this.btnCerrarOportunidad.show = false;
            this.btnCrearOportunidad.show = false;
          } else {
            this._tipoProgramacion = 1;
            if (
              this.itemOcurrenciaTemp.tieneActividades === 'NO' &&
              this.itemOcurrenciaTemp.tieneOcurrencias === false
            ) {
              // Cerrar Oportunidad
              this.btnCerrarOportunidad.show = true;
              this.btnProgramarActividad.show = false;
              // Crear una nueva oportunidad
              if (this.itemOcurrenciaTemp.crearOportunidad)
                this.btnCrearOportunidad.show = true;
            } else {
              if (
                this.itemOcurrenciaTemp.tieneOcurrencias === true &&
                this.itemOcurrenciaTemp.tieneActividades === 'SI'
              ) {
                // Programa Actividad Nodo Padre
                this.btnProgramarActividad.show = false;
                this.btnCrearOportunidad.show = true;
              }
              if (
                this.itemOcurrenciaTemp.tieneOcurrencias === false &&
                this.itemOcurrenciaTemp.tieneActividades === 'SI'
              ) {
                //Programar Actividad Nodo Hijo
                this.btnProgramarActividad.show = true;
                this.btnCerrarOportunidad.show = false;
              }
              if (
                this.itemOcurrenciaTemp.tieneOcurrencias === true &&
                this.itemOcurrenciaTemp.tieneActividades === 'NO'
              ) {
                // No Programar Actividad Nodo Padre
                this.btnProgramarActividad.show = false;
                this.btnCrearOportunidad.show = false;
              }
            }
          }
        },
        error: (error) => {
          if (error.status == 409) {
            this.alertaService.swalFireOptions({
              icon: 'info',
              text: 'Existen al menos una oportunidad en seguimiento',
            });
            this.disabledBotones(true);
          }
        },
      });
  }
  onFocusCalidadLlamada() {
    this.flagError = '';
    this.showAlertModalProgramacion = false;
  }
  onFocusFactura() {
    this.flagError = '';
    this.showAlertModalProgramacion = false;
  }
  /**
   * Obtiene la plantilla de WhatsApp por el idOcurrenciaActividad
   */
  changeTipoComprobante(event: any) {
    this.flagError = '';
    this.showAlertModalProgramacion = false;
    let index = event.target.value;
    if (index == 0) {
      this.showInputFactura = false;
      this.showInputFacturaPeru = false;
      this.showInputFacturaOtro = false;
      if (this._alumno.idCodigoPais != 51) {
        this.showBoletaOtro = true;
      }
    } else {
      this.showBoletaOtro = false;
      this.showInputFactura = true;
      if (this._alumno.idCodigoPais == 51) {
        this.showInputFacturaPeru = true;
      } else {
        this.showInputFacturaOtro = true;
      }
    }
  }
  /**
   * Obtiene la plantilla de WhatsApp por el idOcurrenciaActividad
   */
  abrirModalProgramarActividad() {
    if (this._tipoProgramacion === 1) {
      //Programar
      this.setProgramarActividad();
      this.modalService.open(this.modalProgramacionActividades, {
        backdrop: 'static',
        size: 'lg',
      });
    }
    if (this._tipoProgramacion === 2) {
      //Reprogramar
      if (
        this._rowActual.reprogramacionAutomatica === false &&
        this._rowActual.reprogramacionManual === false
      ) {
        alert('Error! ver consola');
        console.log(
          'reprogramacionAutomatica y reprogramacionManual estan en falso'
        );
        return;
      }
      if (
        this._rowActual.reprogramacionAutomatica === true &&
        this._rowActual.reprogramacionManual === true
      ) {
        this.modalService.open(this.modalProgramacionActividades, {
          backdrop: 'static',
          size: 'lg',
        });
        this.setReprogramarActividad();
      } else {
        if (this._rowActual.reprogramacionAutomatica) {
          this.abrirFormProgramarActividad('automatica');
        }
        if (this._rowActual.reprogramacionManual) {
          this.abrirFormProgramarActividad('manual');
        }
      }
    }
    if (this._tipoProgramacion == 3) {
      this.abrirFormProgramarActividad('cerrarOportunidad');
    }
  }
  /**
   * Obtiene la plantilla de WhatsApp por el idOcurrenciaActividad
   */
  cerrarOportunidad() {
    if (this.crmService.esMarcadorActivo$.value == true) {
      if (
        this.crmService.showVerFicha$.value == true ||
        this.crmService.showConfirmarLlamada$.value == true
      ) {
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Confirme las opciones del marcador para continuar',
        });
        return;
      }
    }
    this._tipoProgramacion = 3;
    this.abrirModalProgramarActividad();
  }
  flagSeguimientoWhatsapp: boolean = false;
  validarLlamada: boolean = false;
  /**
   * Obtiene la plantilla de WhatsApp por el idOcurrenciaActividad
   */
  programarActividad(
    flagSeguimientoWhatsapp: boolean,
    validarLlamada: boolean
  ) {
    this.flagSeguimientoWhatsapp = flagSeguimientoWhatsapp;
    this.validarLlamada = validarLlamada;
    if (this.crmService.esMarcadorActivo$.value == true) {
      if (
        this.crmService.showVerFicha$.value == true ||
        this.crmService.showConfirmarLlamada$.value == true
      ) {
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Confirme las opciones del marcador para continuar',
        });
        return;
      }
    }
    this.abrirModalProgramarActividad();
  }
  /**
   * Obtiene la plantilla de WhatsApp por el idOcurrenciaActividad
   */
  crearOportunidad() {
    this.agendaService.agendaVentaCruzadaService.modalRefVentaCruzada =
      this.modalService.open(ModalContentVentaCruzadaComponent, {
        size: 'xl',
        backdrop: 'static',
      });

    this.agendaService.agendaVentaCruzadaService.modalRefVentaCruzada.componentInstance.agendaService =
      this.agendaService;
    this.agendaService.agendaVentaCruzadaService.modalRefVentaCruzada.componentInstance.ocurrencia =
      this.itemOcurrenciaTemp;
  }
  /**
   * Obtiene la plantilla de WhatsApp por el idOcurrenciaActividad
   */
  setReprogramarActividad() {
    this.programacionActividad.show = true;
    this.programacionActividad.titulo = 'Reprogramar Actividad';
  }
  /**
   * Obtiene la plantilla de WhatsApp por el idOcurrenciaActividad
   */
  setProgramarActividad() {
    this.programacionActividad.show = true;
    this.programacionActividad.titulo = 'Programar Actividad';

    this.agendaService.agendaProgramacionActividadesService
      .obtenerHojaActividadesPorIdOcurrenciaAlterno$(
        this.itemOcurrenciaTemp.idOcurrenciaReporte
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.gridProgramarActividad.data = resp.body;
        },
      });
  }
  getErrorMessage(controlName: string): string {
    this.formService.erroMsj = {
      fechaProgramada: {
        required: 'Ingrese una fecha de reprogramacion',
        noEsMayorFechaActual: 'La fecha programada no es valida',
      },
    };
    return this.formService.errorMessage(
      this.formProgramarActividad.get(controlName) as FormControl,
      controlName
    );
  }
  private resetFormProgramarActividad(): void {
    this.formProgramarActividad.reset();
    this.formProgramarActividad.patchValue({
      comentario: '',
      problemaLlamada: 1,
      fechaEnvioFichaPF: new Date(),
      fechaPagoPF: new Date(),
    });
  }
  /**
   * Carga los datos iniciales al abri el formulario de reprogramacion
   */
  abrirFormProgramarActividad(tipo: string) {
    this.showAlertModalProgramacion = false;
    this.resetFormProgramarActividad();
    if (tipo == 'manual') {
      this._tipoProgramacionNombre = tipo;
      this.formBtnProgramarActividad.show = true;
      this.formBtnCerrarActividad.show = false;
      this.showGrupoFecha = true;

      this.dateTimeConfig.min = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        7,
        0,
        0
      );
      this.dateTimeConfig.readonly = false;
      this.dateTimeConfig.max = new Date(
        new Date().getFullYear() + 2,
        11,
        31,
        21,
        0,
        0
      );

      //if(this.itemOcurrenciaTemp.faseSiguiente)
      if (this.itemOcurrenciaTemp.faseSiguiente.includes('RN2-A')) {
        //RN2-A No mas de 2 meses
        this.dateTimeConfig.max = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 2,
          new Date().getDate()
        );
      }
      if (this.itemOcurrenciaTemp.faseSiguiente.includes('RN2-B')) {
        //RN2-B No mas de 6 meses
        this.dateTimeConfig.max = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 6,
          new Date().getDate()
        );
      }

      this.formProgramarActividad.get('fechaProgramada').enable();
      this.formProgramarActividad.get('fechaProgramada').setValue(new Date());
      this.btnModalProgramarDisabled = false;
      this.btnModalCerrarActividad = false;
      this.formProgramarActividad
        .get('comentario')
        .setValue(this.obtenerComentario());
      this.setCounterComentario();
      this.modalRef = this.modalService.open(this.modalFormPrograma, {
        backdrop: 'static',
      });
    }
    if (tipo == 'automatica') {
      this._tipoProgramacionNombre = tipo;
      this.formBtnProgramarActividad.show = true;
      this.formBtnCerrarActividad.show = false;
      this.showGrupoFecha = true;
      this.dateTimeConfig.max = null;
      this.dateTimeConfig.min = null;
      this.formBtnProgramarActividad.disabled = true;
      this.agendaService.agendaProgramacionActividadesService
        .obtenerFechaHoraActividadReprogramacionAutomatica$(
          this._rowActual.idOportunidad,
          this._rowActual.codigoFase,
          this.itemOcurrenciaTemp.idOcurrenciaReporte
        )
        .subscribe({
          next: (resp: any) => {
            console.log(resp);
            this.formProgramarActividad
              .get('fechaProgramada')
              .setValue(new Date(resp.body));
            this.formProgramarActividad.get('fechaProgramada').disable();
            this.formBtnProgramarActividad.disabled = false;

            this.dateTimeConfig.readonly = true;
            this.btnModalProgramarDisabled = false;
            this.btnModalCerrarActividad = false;

            this.formProgramarActividad
              .get('comentario')
              .setValue(this.obtenerComentario());
            this.setCounterComentario();
            this.modalRef = this.modalService.open(this.modalFormPrograma, {
              backdrop: 'static',
            });
            // NotificacionModule.showMensajeError(error, NotificacionId);
          },
          error: (error) => {
            let respuesta = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.notificationWarning(respuesta);
            Swal.fire({
              icon: 'error',
              title: 'No se pudo cargar la fecha de reprogramación',
              text: respuesta,
            });
            this.formBtnProgramarActividad.disabled = false;
            // NotificacionModule.showMensajeError(error, NotificacionId);
          },
        });
    }
    if (tipo === 'cerrarOportunidad') {
      this._tipoProgramacionNombre = tipo;
      this.formBtnProgramarActividad.show = false;
      this.formBtnCerrarActividad.show = true;
      this.showGrupoFecha = false;
      this.dateTimeConfig.max = null;
      this.dateTimeConfig.min = null;
      this.formProgramarActividad.get('fechaProgramada').setValue(new Date());
      this.dateTimeConfig.readonly = false;
      this.btnModalProgramarDisabled = false;
      this.btnModalCerrarActividad = false;
      this.formProgramarActividad
        .get('comentario')
        .setValue(this.obtenerComentario());
      this.setCounterComentario();
      this.modalRef = this.modalService.open(this.modalFormPrograma, {
        backdrop: 'static',
      });
    }
    this.mostrarInformacionAdicional(this.itemOcurrenciaTemp);
  }

  setCounterComentario() {
    let cant = this.formProgramarActividad.get('comentario').value;
    let counter = cant ? cant.length : 0;
    this.counter = `${counter}/500`;
  }
  /**
   * Carga los inputs adicionales de acuerdo a la fase siguiente de la ocurrencia seleccionada
   * @param {IArbolOcurrenciaAlterno} ocurrencia Ocurrencia seleccionada
   */
  mostrarInformacionAdicional(ocurrencia: IArbolOcurrenciaAlterno) {
    this.faseOportunidadIP = ocurrencia.faseSiguiente == 'IP';
    this.faseOportunidadPF = ocurrencia.faseSiguiente == 'PF';
    this.faseOportunidadIC = ocurrencia.faseSiguiente == 'IC';
    this.comprobantePagoIS = false;

    if (ocurrencia.faseSiguiente === 'PF') {
      this.formProgramarActividad.get('fechaEnvioFichaPF').setValue(new Date());
      this.formProgramarActividad.get('fechaPagoPF').setValue(new Date());
    }

    if (ocurrencia.faseSiguiente == 'IC') {
      if (this.datosOportunidad?.codigoPagoIC) {
        this.formProgramarActividad
          .get('codigoPagoIC')
          .setValue(this.datosOportunidad.codigoPagoIC);
        this.formProgramarActividad.get('codigoPagoIC').disable();
      } else {
        this.formProgramarActividad.get('codigoPagoIC').setValue('');
        this.formProgramarActividad.get('codigoPagoIC').enable();
      }
      this.formProgramarActividad.get('fechaPagoIC').setValue(new Date());
    }

    if (
      (ocurrencia.faseSiguiente == 'IS' &&
        ocurrencia.nombreOcurrencia ==
          'Confirma pago, se pacta fecha de grabación de contrato de voz (IS)') ||
      ocurrencia.nombreOcurrencia ==
        'Confirma pago, se pacta fecha de envío o entrega de contrato firmado (IS)'
    ) {
      this.formProgramarActividad
        .get('fechaInicioPrograma')
        .setValue(new Date());
      this.dateTimeConfigIS.min = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        7,
        0,
        0
      );

      this.comprobantePagoIS = true;
    }
  }
  /**
   * Procesa la actividad a una fase de cierre
   */
  cerrarActividad() {
    this.btnModalCerrarActividad = true;
    this.flagError = '';
    this.showAlertModalProgramacion = false;

    const comentario =
      this.formProgramarActividad.get('comentario').value ?? '';
    this.crmService.enReprogramacion = true;
    this.agendaService.agendaProgramacionActividadesService
      .cerrarActividad$(comentario, this.itemOcurrenciaTemp)
      .subscribe({
        next: (resp: any) => {
          this.envioAutomaticoPlantillaWhatsApp();
          this.btnModalCerrarActividad = false;
          if (this.agendaService.agendaActividadesService.validado) {
            if (
              this.agendaService.tabActual != null &&
              (this.agendaService.tabActual.nombreTab == 'NoProg1Solicitud' ||
                this.agendaService.tabActual.nombreTab == 'NoProgMas1Solicitud')
            ) {
              this.agendaService.agendaActividadesService.totalNoProgramadas--;
            }
          }
          this.agendaService.agendaVentaCruzadaService.actividadEjecutada(
            this._rowActual.id,
            resp.body.realizadas
          );
          if (this.flagTabWhatsapp) {
            this.agendaService.agendaActividadesService.obtenerWhatsapp(null);
          }
          if (this.flagTabCorreos) {
            this.agendaService.agendaActividadesService.obtenerCorreosComercial(
              null,
              true
            );
          }
          this.agendaService.agendaControlPantallaService.cerrarModalProgramarActividades();
        },
        error: (error) => {
          let title = '¡NO SE PUDO REPROGRAMAR!';
          if (error.status == 409) {
            title =
              '¡LA OPORTUNIDAD YA FUE TRABAJADA, RECARGAR LA OPORTUNIDAD!';
            this.agendaService.agendaControlPantallaService.cerrarModalProgramarActividades();
          }
          let respuesta = this.alertaService.getErrorResponse(error, title);
          this.alertaService.swalFireOptions({
            icon: respuesta.icon,
            title: respuesta.titulo,
            text: respuesta.mensaje,
          });
          this.limpiarFormProgramarActividad();
          this.btnModalCerrarActividad = false;
        },
      });
  }
  get dfProgramarActividad(): IFormProgramarActividad {
    return this.formProgramarActividad.getRawValue() as IFormProgramarActividad;
  }
  /**
   * Limpia valores del formulario al finalizar la reprogramacion.
   */
  limpiarFormProgramarActividad() {
    this.showAlertModalProgramacion = false;
    this.flagError = null;
    this.formProgramarActividad.get('comentario').setValue('');
    this.formProgramarActividad.get('rutFactura').setValue('');
    this.formProgramarActividad.get('rucFactura').setValue('');
    this.formProgramarActividad.get('razonSocialFactura').setValue('');
    this.formProgramarActividad.get('direccionFactura').setValue('');
    this.formProgramarActividad.get('comentarioComprobante').setValue('');
    this.formProgramarActividad.get('tipoComprobante').setValue(null);
  }
  /**
   * Proceso ejecutado al finalizar la reprogramacion de actividades.
   */
  finalizarReprogramacion() {
    if (this.agendaService.anexoAsesor == '9999') {
      this.agendaService.agendaProgramacionActividadesService
        .enviarIndividualSMSPorOcurrencia$(
          this.itemOcurrenciaTemp.idOcurrenciaReporte
        )
        .subscribe({
          next: (resp2: HttpResponse<boolean>) => {},
          error: (error) => {},
        });
    }
    this.envioAutomaticoPlantillaWhatsApp();
    this.btnModalProgramarDisabled = false;
    if (this.agendaService.agendaActividadesService.validado) {
      if (
        this.agendaService.tabActual != null &&
        (this.agendaService.tabActual.nombreTab == 'NoProg1Solicitud' ||
          this.agendaService.tabActual.nombreTab == 'NoProgMas1Solicitud')
      ) {
        this.agendaService.agendaActividadesService.totalNoProgramadas--;
      }
    }
  }
  /**
   * @description Valida los datos del comprobante de pago.
   */
  validarDatos() {
    const pais = this._alumno.idCodigoPais;
    const tipoComprobante = this.dfProgramarActividad.tipoComprobante;
    const rut = this.dfProgramarActividad.rutFactura ?? '';
    const razonSocial = this.dfProgramarActividad.razonSocialFactura ?? '';
    const direccion = this.dfProgramarActividad.direccionFactura ?? '';
    const ruc = this.dfProgramarActividad.rucFactura ?? '';
    if (tipoComprobante == null) {
      return false;
    } else {
      if (pais == 51 && tipoComprobante == 0) {
        //BOLETA peru no pide ningun dato
        return true;
      }
      if (pais == 51 && tipoComprobante == 1) {
        if (ruc.trim().length == 0 || razonSocial.trim().length == 0) {
          return false;
        }
      }
      if (pais != 51 && tipoComprobante == 0) {
        if (direccion.trim().length == 0) {
          return false;
        }
      }
      if (pais != 51 && tipoComprobante == 1) {
        if (
          direccion.trim().length == 0 ||
          rut.trim().length == 0 ||
          razonSocial.trim().length == 0
        ) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Envio Automatico de WhatsApp al finalizar la reprogramacion de actividad
   */

  MaxLengthValidator(palabra: string) {
    return (control: any) => {
      const value: string = control.value;
      if (value && value.length > 13) {
        return { stringLengthExceeded: true };
      }
      return null;
    };
  }
  validarAlumno() {
    this.flagErrorAlumno = [];
    if (this._alumno != null) {
      if (this._alumno.idCodigoPais == 52) {

        if (this._alumno.rfc != null && this._alumno.rfc != "") {
          if (
            (this._alumno.rfc.trim().length < 12) || (this._alumno.rfc.trim().length > 13)
          ) {
            this.flagErrorAlumno.push('RFC no es valido');
          }
        } else {
          if (this._alumno.curp != null && this._alumno.curp != "") {
            {
              if (this._alumno.curp.trim().length !=18) {
                this.flagErrorAlumno.push('Curp no es valido');
              }
            }
          } else {
            this.flagErrorAlumno.push('RFC');
          }
        }
        if (this._alumno.idCiudad == null || this._alumno.idCiudad == 0) {
          this.flagErrorAlumno.push('Estado');
        }
        if (
          this._alumno.idMunicipioMexico == null ||
          this._alumno.idMunicipioMexico == 0
        ) {
          this.flagErrorAlumno.push('Municipio');
        }
        if (
          this._alumno.idAsentamientoMexico == null ||
          this._alumno.idAsentamientoMexico == 0
        ) {
          this.flagErrorAlumno.push('Colonia');
        }

        if (
          this._alumno.codigoPostal == null ||
          this._alumno.codigoPostal == ''
        ) {
          this.flagErrorAlumno.push('Codigo Postal');
        }
      }
    }
  }

  /**
   * Envio Automatico de WhatsApp al finalizar la reprogramacion de actividad
   */
  envioAutomaticoPlantillaWhatsApp() {
    if (
      this._plantillaAutomaticaWhatsapp != null &&
      this.agendaService.tieneWhatsApp == true
    ) {
      let data = this._plantillaWhatsApp.find((e) => {
        e.id == this._plantillaAutomaticaWhatsapp.idPlantilla;
      });

      this.agendaService.agendaProgramacionActividadesService
        .verificarInsertarNumeroValidado$()
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            if (resp.body) {
              this.agendaService.agendaProgramacionActividadesService.enviarMensajeAutomatico(
                data
              );
            } else {
              this.agendaService.agendaProgramacionActividadesService
                .whatsAppValidarNumeros$()
                .subscribe({
                  next: (resp) => {
                    this.agendaService.agendaProgramacionActividadesService.enviarMensajeAutomatico(
                      data
                    );
                  },
                });
            }
          },
          error: (error) => {
            this.alertaService.notificationWarning(error.message);
          },
        });
    }
  }
  /**
   * @description Creacion del objeto oportunidad finalizar actividad
   * @returns {IDatoOportunidad} Datos de la oportunidad
   */
  obtenerDataAdicionalOportunidad(
    ocurrencia: IArbolOcurrenciaAlterno
  ): IDatoOportunidad {
    let datoOportunidad: IDatoOportunidad = {};

    if (ocurrencia.faseSiguiente == 'IP') {
      datoOportunidad.idFaseOportunidadIp =
        this.dfProgramarActividad.estadoFaseIP ?? 0;
      datoOportunidad.fasesActivas = true;
    }

    if (ocurrencia.faseSiguiente == 'PF') {
      datoOportunidad.idFaseOportunidadPf =
        this.dfProgramarActividad.estadoFasePF ?? 0;
      datoOportunidad.fechaEnvioFaseOportunidadPf = datePipeTransform(
        this.dfProgramarActividad.fechaEnvioFichaPF
      );
      datoOportunidad.fechaPagoFaseOportunidadPf = datePipeTransform(
        this.dfProgramarActividad.fechaPagoPF
      );
      datoOportunidad.fasesActivas = true;
    }

    if (ocurrencia.faseSiguiente == 'IC') {
      datoOportunidad.idFaseOportunidadIc =
        this.dfProgramarActividad.estadoFaseIC ?? 0;
      datoOportunidad.fechaPagoFaseOportunidadIc = datePipeTransform(
        this.dfProgramarActividad.fechaPagoIC
      );
      datoOportunidad.codigoPagoIc = this.dfProgramarActividad.codigoPagoIC;
      datoOportunidad.fasesActivas = true;
    }
    return datoOportunidad;
  }
  /**
   * Creacion del objeto comprobante de pago
   * @returns {IComprobantePago} comprobante de pago
   */
  obtenerComprobantePago(): IComprobantePago {
    let celular = this._alumno.celular ?? '';
    let email1 = this._alumno.email1 ?? '';
    let comprobantePago: IComprobantePago = {
      idContacto: 0,
      nombres: '',
      apellidos: '',
      celular: '',
      dni: '',
      correo: '',
      nombrePais: '',
      idPais: 0,
      nombreCiudad: '',
      tipoComprobante: '',
      nroDocumento: '',
      bitComprobante: 0,
      idAsesor: 0,
    };
    comprobantePago.idContacto = this._alumno.id;
    comprobantePago.nombres = `${this._alumno.nombre1} ${this._alumno.nombre2}`;
    comprobantePago.apellidos = `${this._alumno.apellidoMaterno} ${this._alumno.apellidoPaterno}`;
    comprobantePago.celular =
      celular == '' ? this._alumno?.celular2 ?? '' : celular;
    comprobantePago.dni = this._alumno?.dni ? this._alumno.dni : '';
    comprobantePago.correo = email1 == '' ? this._alumno?.email2 ?? '' : email1;
    comprobantePago.nombrePais = this._alumno?.nombrePais ?? '';
    comprobantePago.idPais = this._alumno?.idCodigoPais;
    comprobantePago.nombreCiudad = this._alumno?.nombreCiudad ?? '';
    comprobantePago.comentario =
      this.dfProgramarActividad.comentarioComprobante;

    comprobantePago.bitComprobante = this.dfProgramarActividad.tipoComprobante;
    if (this._alumno.idCodigoPais == 51) {
      comprobantePago.tipoComprobante =
        this.dfProgramarActividad.tipoComprobante == 0 ? 'Boleta' : 'Factura';
      comprobantePago.nroDocumento =
        this.dfProgramarActividad.tipoComprobante == 0
          ? this._alumno?.dni ?? ''
          : this.dfProgramarActividad.rucFactura ?? '';
      comprobantePago.nombreRazonSocial =
        this.dfProgramarActividad.razonSocialFactura;
      comprobantePago.direccion = this._alumno.direccion ?? '';
    } else {
      comprobantePago.tipoComprobante =
        this.dfProgramarActividad.tipoComprobante == 0 ? 'Boleta' : 'Factura';
      comprobantePago.nroDocumento =
        this.dfProgramarActividad.tipoComprobante == 0
          ? this._alumno?.dni ?? ''
          : this.dfProgramarActividad.rutFactura ?? '';
      comprobantePago.nombreRazonSocial =
        this.dfProgramarActividad.razonSocialFactura;
      comprobantePago.direccion =
        this.dfProgramarActividad.direccionFactura ?? '';
    }
    return comprobantePago;
  }
  onValueChange(event: string): void {
    let cant = event.length;
    this.counter = `${cant}/500`;
  }
  /**
   * Proceso de reprogramacion automatica o manual
   * @autor Flavio Rodrigo Mamani Fabian
   */
  guardarProgramacion2() {
    this.btnModalProgramarDisabled = true;
    this.flagError = '';
    this.showAlertModalProgramacion = false;

    // Validacion de formulario
    if (!this.formProgramarActividad.invalid) {
      let oportunidad = this.obtenerDataAdicionalOportunidad(
        this.itemOcurrenciaTemp
      );
      oportunidad.idFaseOportunidad = this._rowActual.idFaseOportunidad;
      oportunidad.ultimaFechaProgramada = datePipeTransform(
        this.dfProgramarActividad.fechaProgramada,
        'yyyy-MM-dd HH:mm:ss'
      );
      oportunidad.idTipoDato = this._rowActual.idTipoDato;
      oportunidad.idEstadoOportunidad = this._rowActual.idEstadoOportunidad;

      //let idLlamada = '1';
      let idLlamada = this.crmService.idLlamada$.value;
      if (this.agendaService.esTresCx || this.agendaService.esWhatsappCorreos) {
        idLlamada = '1';
      } else {
        idLlamada = this.agendaService.esPredictivo
          ? '1'
          : this.crmService.idLlamada$.value;
      }

      if (
        this.itemOcurrenciaTemp.requiereLlamada == 'Si' &&
        !this._ocurrenciaLlamada.includes(
          this.itemOcurrenciaTemp.nombreOcurrencia
        )
      ) {
        if (idLlamada == '0') {
          if (this.crmService.actualizarTotalIntentos$.value == 0) {
            this.showAlertModalProgramacion = true;
            this.flagError = 'Tiene que hacer una llamada';
            this.btnModalProgramarDisabled = false;
            return;
          } else {
            this.showAlertModalProgramacion = false;
          }
        } else {
          this.showAlertModalProgramacion = false;
        }
      } else if (this.itemOcurrenciaTemp.requiereLlamada === 'No') {
        idLlamada = '';
        this.showAlertModalProgramacion = false;
      }
      let datosComprobantePago: IComprobantePago;
      if (
        (this.itemOcurrenciaTemp.faseSiguiente == 'IS' &&
          this.itemOcurrenciaTemp.nombreOcurrencia ==
            'Confirma pago, se pacta fecha de grabación de contrato de voz (IS)') ||
        this.itemOcurrenciaTemp.nombreOcurrencia ==
          'Confirma pago, se pacta fecha de envío o entrega de contrato firmado (IS)'
      ) {
        if (this.validarDatos()) {
          datosComprobantePago = this.obtenerComprobantePago();
          datosComprobantePago.idOcurrencia =
            this.itemOcurrenciaTemp.idOcurrenciaReporte;
          datosComprobantePago.idAsesor = this._rowActual.idPersonal_Asignado;
          datosComprobantePago.idOportunidad = this._rowActual.idOportunidad;
          if (
            this.agendaService.agendaCronogramaPagoService.cronogramaAprobado$
              .value == false
          ) {
            this.flagError = 'Tiene que tener un cronograma aprobado';
            this.showAlertModalProgramacion = true;
            this.btnModalProgramarDisabled = false;
            this.validarAlumno();
            return;
          } else {
            this.showAlertModalProgramacion = false;
          }
        } else {
          this.flagError = 'Debe llenar los datos de Comprobante de Pago';
          this.showAlertModalProgramacion = true;
          this.btnModalProgramarDisabled = false;
          this.validarAlumno();
          return;
        }
      }
      let datosCalidadLlamada = {
        idProblemaLlamada: this.dfProgramarActividad.problemaLlamada,
        idCalidadLlamada: this.dfProgramarActividad.calidadLlamada ?? 0,
      };

      if (
        this.itemOcurrenciaTemp.nombreEstadoOcurrencia == 'EJECUTADO' &&
        datosCalidadLlamada.idCalidadLlamada == 0 &&
        !this._ocurrenciaLlamada.includes(
          this.itemOcurrenciaTemp.nombreOcurrencia
        ) &&
        this.agendaService.anexoAsesor != '1238'
      ) {
        if (this.agendaService.esWhatsappCorreos) {
          if (
            this.agendaService.tabActual != null &&
            this.validarLlamada &&
            this.agendaService.tabActual.nombreTab != 'Correos'
          ) {
            this.flagError = 'Tiene que calificar la llamada';
            this.showAlertModalProgramacion = true;
            this.btnModalProgramarDisabled = false;
            return;
          }
        } else {
          this.flagError = 'Tiene que calificar la llamada';
          this.showAlertModalProgramacion = true;
          this.btnModalProgramarDisabled = false;
          return;
        }
      } else {
        this.showAlertModalProgramacion = false;
      }
      this.btnModalProgramarDisabled = true;
      let dataForm = this.formProgramarActividad.getRawValue();
      console.log(dataForm);
      this.agendaService.agendaProgramacionActividadesService
        .guardarProgramacionActividad2$(
          dataForm.comentario,
          oportunidad,
          this.itemOcurrenciaTemp,
          this._tipoProgramacionNombre,
          datosComprobantePago,
          datosCalidadLlamada,
          this.flagSeguimientoWhatsapp
        )
        .subscribe({
          next: (resp: any) => {
            this.finalizarReprogramacion();
            this.agendaService.agendaVentaCruzadaService.actividadEjecutada(
              this._rowActual.id,
              resp.body.realizada
            );
            this.agendaService.agendaControlPantallaService.cerrarModalProgramarActividades();
          },
          error: (error) => {
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            if (error.status == 409) {
              this.limpiarFormProgramarActividad();
              this.alertaService.notificationWarning(mensaje);

              this.alertaService.swalFireOptions({
                icon: 'error',
                title:
                  'ERROR:LA OPORTUNIDAD FUE TRABAJADA POR OTRA PERSONA AL MISMO TIEMPO, RECARGAR LA OPORTUNIDAD!',
                text: mensaje,
              });
              this.agendaService.agendaControlPantallaService.cerrarModalProgramarActividades();
            } else {
              this.btnModalProgramarDisabled = false;
              this.alertaService.swalFireOptions({
                icon: 'error',
                title: '¡NO SE PUDO REPROGRAMAR!',
                text: mensaje,
              });
              this.alertaService.notificationWarning(mensaje);
            }
          },
        });
    } else {
      this.btnModalProgramarDisabled = false;
      this.formProgramarActividad.markAllAsTouched();
    }
  }
  obtenerComentario() {
    // this._sharedService.getComentario$.next();
    let comentario = this._sharedService.comentarioActividad$.value;
    this._sharedService.showComentarioFicha$.next(false);
    return comentario;
  }
  resetComentario() {}
  cerrarModalFormProgramar() {
    this._sharedService.comentarioActividad$.next(
      this.formProgramarActividad.get('comentario').value ?? ''
    );
    this._sharedService.showComentarioFicha$.next(true);
    this.modalRef.close();
  }
}

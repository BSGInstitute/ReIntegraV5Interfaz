import { Subscription } from 'rxjs';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import {
  AggregateDescriptor,
  aggregateBy,
  AggregateResult,
} from '@progress/kendo-data-query';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import {
  ICronograPagoEnvio,
  ICronograma,
  ICronogramaPago,
  IDetalleCronograma,
  IMetodoPagoMatricula,
  IMontoPagoCronograma,
  IPasarelaPago,
  ITextoBeneficios,
  ITipoDescuentoCronograma,
} from '@comercial/models/interfaces/iagenda-cronograma-pago';
import { AlertaService } from '@shared/services/alerta.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IClaveValor } from '@shared/models/interfaces/iglobal';

@Component({
  selector: 'app-modal-content-cronograma-pago',
  templateUrl: './modal-content-cronograma-pago.component.html',
  styleUrls: ['./modal-content-cronograma-pago.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalContentCronogramaPagoComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public sanitizer: DomSanitizer
  ) {}

  private _modalRef: NgbModalRef;
  _detalleCronogramaTemp: IDetalleCronograma;
  estadoMensaje = '';
  vistaPortal: SafeHtml = '';

  gridDetalleCronogramaPago: KendoGrid = new KendoGrid();
  cuadraSumatoria = false;
  estadoGuardado = 0;
  montoPagoFiltro: IMontoPagoCronograma[] = [];
  tipoDescuentoFiltro: ITipoDescuentoCronograma[] = [];
  medioPagoFiltro: any[] = [];
  detalleMontoPago: ITextoBeneficios[] = [];
  private _esContado: boolean = false;
  _esMontoPagoSeleccionado = false;
  _montoPagoCronogramaTemp: IMontoPagoCronograma = {};
  private _precioDescuentoTemp = 0;
  btnActualizarMetodoPagoDisabled: boolean = false;
  montoPagoSeleccionado: any[] = [];
  tipoDescuentoSeleccionado: any[] = [];
  tipoPagoSeleccionado: any[] = [];
  dataAsignacionCuota: IClaveValor[] = [];
  private _cronograma: ICronograma;
  estadoSMS = '';
  flagChangeMontoPago: number = 0;
  formCronogramapago: FormGroup = this.formBuilder.group({
    costoTotalSinDescuento: null,
    costoTotalConDescuento: null,
    montoDescuentoOtorgado: null,
    montoPago: [null, Validators.required],
    tipoDescuento: [null, Validators.required],
    medioPago: null,
  });
  private _aggregates: AggregateDescriptor[] = [
    { field: 'montoCuotaDescuento', aggregate: 'sum' },
  ];
  total: AggregateResult = aggregateBy(
    this.gridDetalleCronogramaPago.data,
    this._aggregates
  );
  formSubCuotas: FormGroup = this.formBuilder.group({
    nroSubCuotas: [null],
  });
  formEliminarCuota: FormGroup = this.formBuilder.group({
    monto: [null],
    asignarACuota: [null],
  });
  private _subscriptions: Subscription = new Subscription();
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  dataMedioPago: IPasarelaPago[] = [];
  btnVerCronogramaPortalDisabled: boolean = true;
  btnAprobarDisabled: boolean = false;
  btnElimnar = {
    disabled: false,
    show: true,
  };
  btnEnviarSMS = {
    disabled: false,
    show: true,
  };
  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  showCronogramaPortal = false;
  idMatriculaCabeceraTemp = 0;
  @Input() agendaService: AgendaService;
  @Input() rowActual: IRowActual;
  @ViewChild('modalFraccionarCuota') modalFraccionarCuota: any;
  @ViewChild('modalEliminarCuota') modalEliminarCuota: any;
  ngOnInit(): void {
    if (this.agendaService.tabActual.indexTab == 7) {
      this.btnElimnar.show = false;
    } else {
      this.btnElimnar.show = true;
    }
    this.configurarGrid();
    this.cargarCronogramaPagos();
    this.cargarMedioPago();
  }
  private cargarCronogramaPagos() {
    let sub$ = this.agendaService.agendaCronogramaPagoService
      .obtenerOportunidadCronogramaPago$(this.rowActual.idOportunidad)
      .subscribe({
        next: (resp) => {
          if (resp.body.cronograma.detalle != null) {
            resp.body.cronograma.detalle.map((data: any) => {
              data.fechaPago = new Date(data.fechaPago);
            });
          }
          this.montoPagoFiltro = resp.body.cronograma.montosPago;
          this.tipoDescuentoFiltro = resp.body.cronograma.tiposDescuento;
          if (resp.body.estadoMatricula == 'matriculado') {
            this.btnElimnar.show = false;
          }
          this.cargaInicial(resp.body);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '!Error al cargar cronograma de pagos¡',
            text: mensaje,
          });
        },
      });
    this._subscriptions.add(sub$);
  }
  private configurarGrid() {
    this.gridDetalleCronogramaPago.formGroup = this.formBuilder.group({
      fechaPago: [null],
      montoCuotaDescuento: [null],
    });
    this.gridDetalleCronogramaPago.readOnlyColumns = ['cuotaDescripcion'];
    this.gridDetalleCronogramaPago.cellCloseEvent$.subscribe({
      next: (respuesta) => {
        let celda: any;
        if (respuesta.columnField == 'montoCuotaDescuento') {
          respuesta.dataItem.montoCuotaDescuento =
            respuesta.formGroupValue.montoCuotaDescuento;
          celda = respuesta.dataItem;
          this.modificacionEnGrilla(celda);
        }
      },
    });
  }
  private cargarMedioPago() {
    let sub$ = this.agendaService.agendaCronogramaPagoService
      .cargarMedioPago$(this.rowActual.idAlumno)
      .subscribe({
        next: (resp) => {
          let idPagoPrioridad = 0;
          if (resp.body.length != 0) {
            idPagoPrioridad = resp.body[0].id;
          }
          this.dataMedioPago = resp.body;
          let sub1$ = this.agendaService.agendaCronogramaPagoService
            .obtenerMatriculaPorAlumnoCosto$(
              this.rowActual.idAlumno,
              this.rowActual.idCentroCosto
            )
            .subscribe({
              next: (resp2) => {
                if (resp2.body != null && resp2.body != 0) {
                  this.idMatriculaCabeceraTemp = resp2.body;
                  let sub2$ = this.agendaService.agendaCronogramaPagoService
                    .obtenerMetodoPagoPorIdMatriculaCabecera$(
                      this.idMatriculaCabeceraTemp
                    )
                    .subscribe({
                      next: (response) => {
                        if (response.body != null && response.body.idMedioPago != 0 && response.body.idMedioPago != null) {
                          this.formCronogramapago
                            .get('medioPago')
                            .setValue(
                              this.dataMedioPago.find(
                                (x) => x.id == response.body.idMedioPago
                              ).id
                            );
                        } else {
                          this.formCronogramapago
                            .get('medioPago')
                            .setValue(
                              this.dataMedioPago.find(
                                (x) => x.id == idPagoPrioridad
                              ).id
                            );
                        }
                      },
                    });
                  this._subscriptions.add(sub2$);
                }
              },
            });
          this._subscriptions.add(sub1$);
        },
      });
    this._subscriptions.add(sub$);
  }
  private cargaInicial(datos: ICronogramaPago) {
    this.estadoMensaje = '';
    this.formCronogramapago.get('tipoDescuento').disable();
    this.formCronogramapago.get('montoPago').enable();
    this._cronograma = null;
    this.btnEnviarSMS.show = false;
    if (datos.cronograma.id != 0) {
      this.vistaPortal = this.sanitizer.bypassSecurityTrustHtml(
        datos.vistaPortalWeb
      );
      this._cronograma = datos.cronograma;
      let tempCredito = this.montoPagoFiltro.filter(
        (r) => r.cuotasTipoPago == 1
      );
      if (tempCredito.length == 0) {
        this._esContado = true;
      }
      if (this._cronograma.esAprobado == true) {
        this.agendaService.agendaCronogramaPagoService.cronogramaAprobado$.next(
          true
        );
        this.estadoMensaje = 'Cronograma fue aprobado';
        this.btnAprobarDisabled = true;
        this.btnVerCronogramaPortalDisabled = false;
        this.formCronogramapago.get('tipoDescuento').disable();
        this.formCronogramapago.get('montoPago').disable();
        this.btnEnviarSMS.show = true;
      } else {
        this.formCronogramapago.get('tipoDescuento').enable();
      }
      if (
        this._cronograma.precioDescuento != 0 &&
        this._cronograma.precioDescuento != null
      ) {
        this._precioDescuentoTemp = this._cronograma.precioDescuento;
      } else {
        this._precioDescuentoTemp = this._cronograma.precio;
      }
      this.formCronogramapago
        .get('montoPago')
        .setValue(
          this.montoPagoFiltro.find((x) => x.id == this._cronograma.idMontoPago)
        );
      this.cargarDetalleCronogramaPago(datos.cronograma.detalle);
      this.configurarMontosTotales(this._cronograma);
    }
  }
  changeMontoPago(event: IMontoPagoCronograma) {
    this.flagChangeMontoPago = 1;
    this.gridDetalleCronogramaPago.data = [];
    this.formCronogramapago.get('tipoDescuento').setValue(null);
    this.total = null;
    this.formCronogramapago.get('tipoDescuento').enable();
    if (event.id != null) {
      this.agendaService.agendaCronogramaPagoService
        .obtenerDetalleMontoPago$(event.id)
        .subscribe({
          next: (resp) => {
            resp.body.forEach((x) => {
              let nuevoTexto = x.titulo.substring(
                x.titulo.indexOf('>') + 1,
                undefined
              );
              x.titulo = `<p> - ${nuevoTexto}`;
            });
            this.detalleMontoPago = resp.body;
          },
          error: (error) => {
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.detalleMontoPago = null;
    }
    /* Todo excepto credito */
    this._montoPagoCronogramaTemp = event;
    if (event.cuotasTipoPago != 1) {
      let tempCredito = this.montoPagoFiltro.filter(
        (r) => r.cuotasTipoPago == 1
      );
      if (tempCredito.length == 0) {
        this._esContado = true;
      }
      if (event.nroCuotas == 1 && event.matricula == 0) {
        this._esMontoPagoSeleccionado = true;
      } else {
        this._esMontoPagoSeleccionado = false;
      }
      let descuento = this.tipoDescuentoFiltro.filter(
        (d) => d.codigo == 'Contado Normal'
      );
      this._montoPagoCronogramaTemp.idTipoDescuento = descuento[0].id;
      this._montoPagoCronogramaTemp.formula = descuento[0].formula;
      this._montoPagoCronogramaTemp.cuotasAdicionales =
        descuento[0].cuotasAdicionales;
      this._montoPagoCronogramaTemp.fraccionesMatricula =
        descuento[0].fraccionesMatricula;
      this._montoPagoCronogramaTemp.porcentajeCuotas =
        descuento[0].porcentajeCuotas;
      this._montoPagoCronogramaTemp.porcentajeGeneral =
        descuento[0].porcentajeGeneral;
      this._montoPagoCronogramaTemp.porcentajeMatricula =
        descuento[0].porcentajeMatricula;
      this._precioDescuentoTemp = this.calcularPrecioInicialConDescuento(
        this._montoPagoCronogramaTemp
      );
      this.generarCronogramaPagos(this._montoPagoCronogramaTemp);
      if (event.id != null) {
        this.configurarMontosTotales(this._montoPagoCronogramaTemp);
      } else {
        this.formCronogramapago.get('costoTotalSinDescuento').setValue('');
        this.formCronogramapago.get('costoTotalConDescuento').setValue('');
        this.formCronogramapago.get('montoDescuentoOtorgado').setValue('');
        this.formCronogramapago.get('tipoDescuento').setValue(null);
      }
    } else {
      this._esContado = false;
      this._esMontoPagoSeleccionado = false;
    }
  }
  changeTipoDescuento(event: ITipoDescuentoCronograma) {
    if (event.codigo == 'Promoción 25% Descuento') {
      let creditoAplicarDescuento = this.montoPagoFiltro.filter(
        (x) =>
          x.idPais == this._montoPagoCronogramaTemp.idPais &&
          x.paquete == this._montoPagoCronogramaTemp.paquete &&
          x.cuotasTipoPago == 1
      );
      if (creditoAplicarDescuento.length != 0) {
        this._montoPagoCronogramaTemp = creditoAplicarDescuento[0];
        this._montoPagoCronogramaTemp.matricula =
          this._montoPagoCronogramaTemp.precio;
        this._montoPagoCronogramaTemp.cuotas = 0;
        this._montoPagoCronogramaTemp.nroCuotas = 0;
      }
    }
    if (event.formula != 5) {
      this._montoPagoCronogramaTemp.idTipoDescuento = event.id;
      this._montoPagoCronogramaTemp.formula = event.formula;
      this._montoPagoCronogramaTemp.cuotasAdicionales = event.cuotasAdicionales;
      this._montoPagoCronogramaTemp.fraccionesMatricula =
        event.fraccionesMatricula;
      this._montoPagoCronogramaTemp.porcentajeCuotas = event.porcentajeCuotas;
      this._montoPagoCronogramaTemp.porcentajeGeneral = event.porcentajeGeneral;
      this._montoPagoCronogramaTemp.porcentajeMatricula =
        event.porcentajeMatricula;
      this._precioDescuentoTemp = this.calcularPrecioInicialConDescuento(
        this._montoPagoCronogramaTemp
      );
      this.generarCronogramaPagos(this._montoPagoCronogramaTemp);
      this.configurarMontosTotales(this._montoPagoCronogramaTemp);
    } else {
      //contado
      this._montoPagoCronogramaTemp.idTipoDescuento = event.id;
      this._montoPagoCronogramaTemp.formula = event.formula;
      this._montoPagoCronogramaTemp.cuotasAdicionales = event.cuotasAdicionales;
      this._montoPagoCronogramaTemp.fraccionesMatricula =
        event.fraccionesMatricula;
      this._montoPagoCronogramaTemp.porcentajeCuotas = event.porcentajeCuotas;
      this._montoPagoCronogramaTemp.porcentajeGeneral = event.porcentajeGeneral;
      this._montoPagoCronogramaTemp.porcentajeMatricula =
        event.porcentajeMatricula;
      this._precioDescuentoTemp = this.calcularPrecioInicialConDescuento(
        this._montoPagoCronogramaTemp
      );
      this.generarCronogramaPagos(this._montoPagoCronogramaTemp);
      this.configurarMontosTotales(this._montoPagoCronogramaTemp);
    }
  }
  private calcularPrecioInicialConDescuento(data: IMontoPagoCronograma) {
    let descuento: string = '',
      matr: number,
      m: string,
      c: string,
      d: number;
    let cuotas = 0;
    let tamanioMatricula = 0;
    let tamaniocuotas = 0;
    let sinDescuento = 0;
    switch (data.formula) {
      case 0: //sin descuento
        matr = this.tipoDescuentoGeneral(
          data.matricula,
          data.porcentajeGeneral
        );
        cuotas = this.tipoDescuentoGeneral(data.cuotas, data.porcentajeGeneral);
        let numeroCuotas = Number(data.nroCuotas.toFixed(2));
        let ccu = (cuotas * numeroCuotas).toFixed(2);
        d = matr + parseFloat(ccu);
        descuento = d.toFixed(2);
        break;
      case 1: //matricula
        tamanioMatricula = data.fraccionesMatricula;
        if (tamanioMatricula === 0) tamanioMatricula = 1;
        matr = this.tipoDescuentoGeneral(
          data.matricula / tamanioMatricula,
          data.porcentajeMatricula
        );
        let tamanio = data.nroCuotas;
        cuotas = this.tipoDescuentoGeneral(data.cuotas, data.porcentajeCuotas);
        m = (matr * tamanioMatricula).toFixed(2);
        c = (cuotas * tamanio).toFixed(2);
        d = parseFloat(m) + parseFloat(c);
        descuento = d.toFixed(2);
        break;
      case 2: //cuotas
        let matri = this.tipoDescuentoGeneral(
          data.matricula,
          data.porcentajeGeneral
        );
        tamaniocuotas = data.nroCuotas + data.cuotasAdicionales;
        sinDescuento = data.precio - data.matricula;
        cuotas = this.tipoDescuentoGeneral(
          sinDescuento / tamaniocuotas,
          data.porcentajeCuotas
        );
        c = (cuotas * tamaniocuotas).toFixed(2);
        d = matri + parseFloat(c);
        descuento = d.toFixed(2);
        break;
      case 3: //ambos
        tamanioMatricula = data.fraccionesMatricula;
        if (tamanioMatricula === 0) tamanioMatricula = 1;
        matr = this.tipoDescuentoGeneral(
          data.matricula / tamanioMatricula,
          data.porcentajeMatricula
        );
        tamaniocuotas = data.nroCuotas + data.cuotasAdicionales;
        sinDescuento = data.precio - data.matricula;
        cuotas = this.tipoDescuentoGeneral(
          sinDescuento / tamaniocuotas,
          data.porcentajeCuotas
        );
        m = (matr * tamanioMatricula).toFixed(2);
        c = (cuotas * tamaniocuotas).toFixed(2);
        d = parseFloat(m) + parseFloat(c);
        descuento = d.toFixed(2);
        break;
      case 4: //general
        matr = this.tipoDescuentoGeneral(
          data.matricula,
          data.porcentajeGeneral
        );
        cuotas = this.tipoDescuentoGeneral(data.cuotas, data.porcentajeGeneral);
        c = (cuotas * data.nroCuotas).toFixed(2);
        d = matr + parseFloat(c);
        descuento = d.toFixed(2);
        break;
      case 5: //Normal
        let va: any = this.tipoDescuentoGeneral(
          data.cuotas,
          data.porcentajeGeneral
        );
        descuento = va.toFixed(2);
        break;
    }
    return parseFloat(descuento);
  }
  private tipoDescuentoGeneral(matricula: number, porcentaje: number) {
    let d = (matricula * porcentaje) / 100;
    let a = matricula - d;
    let b = a;
    return b;
  }
  private configurarMontosTotales(data: ICronograma | IMontoPagoCronograma) {
    this.formCronogramapago
      .get('costoTotalSinDescuento')
      .setValue(`${data.precio.toFixed(2)} - ${data.nombrePlural}`);
    let descuentoTotal = data.precio - this._precioDescuentoTemp;
    this.formCronogramapago
      .get('costoTotalConDescuento')
      .setValue(
        `${this._precioDescuentoTemp.toFixed(2)} - ${data.nombrePlural}`
      );
    this.formCronogramapago
      .get('montoDescuentoOtorgado')
      .setValue(`${descuentoTotal.toFixed(2)} - ${data.nombrePlural}`);
    this.formCronogramapago
      .get('tipoDescuento')
      .setValue(
        this.tipoDescuentoFiltro.find((x) => x.id == data.idTipoDescuento)
      );
  }
  private generarCronogramaPagos(data: IMontoPagoCronograma) {
    switch (data.formula) {
      case 0: //sin descuento
        if (this._esContado) {
          let tamanio = data.nroCuotas + data.cuotasAdicionales;
          this.generarGridNormal(data, tamanio);
        } else {
          if (this._esMontoPagoSeleccionado) {
            let tamanio = data.nroCuotas + data.cuotasAdicionales;
            this.generarGridNormal(data, tamanio);
          } else {
            this.generarGridSinDescuento(data);
          }
        }
        break;
      case 1: //matricula
        if (this._esContado) {
          let tamanio = data.nroCuotas + data.cuotasAdicionales;
          this.generarGridNormal(data, tamanio);
        } else {
          if (this._esMontoPagoSeleccionado) {
            this.generarGridCuotasAuxiliar(data);
          } else {
            this.generarGridMatricula(data);
          }
        }
        break;
      case 2: //cuotas
        if (this._esContado) {
          let tamanio = data.nroCuotas + data.cuotasAdicionales;
          this.generarGridNormal(data, tamanio);
        } else {
          if (this._esMontoPagoSeleccionado) {
            this.generarGridCuotasAuxiliar(data);
          } else {
            this.generarGridCuotas(data);
          }
        }
        break;
      case 3: //ambos
        if (this._esContado) {
          let tamanio = data.nroCuotas + data.cuotasAdicionales;
          this.generarGridNormal(data, tamanio);
        } else {
          if (this._esMontoPagoSeleccionado) {
            this.generarGridCuotasAuxiliar(data);
          } else {
            this.generarGridAmbos(data);
          }
        }
        break;
      case 4: //general
        if (this._esContado) {
          let tamanio = data.nroCuotas + data.cuotasAdicionales;
          this.generarGridNormal(data, tamanio);
        } else {
          this.generarGridGeneral(data);
        }
        break;
      case 5: //normal
        this.generarGridNormal(data, 1);
        break;
    }
  }
  private generarGridNormal(data: IMontoPagoCronograma, tamanioCuotas: number) {
    let listaDetalleCronograma: IDetalleCronograma[] = [];
    for (let i = 0; i < tamanioCuotas; i++) {
      let currentDate = new Date();
      let hoy = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()} 12:00:00`;
      let detalle: IDetalleCronograma = {
        id: 0,
        numeroCuota: i + 1,
        cuotaDescripcion: 'Contado',
        montoCuota: data.cuotas / tamanioCuotas,
        fechaPago: new Date(hoy),
        montoCuotaDescuento: this.tipoDescuentoGeneral(
          data.cuotas / tamanioCuotas,
          data.fraccionesMatricula
        ),
        pagado: false,
        matricula: true,
      };
      listaDetalleCronograma.push(detalle);
    }
    this.cargarDetalleCronogramaPago(listaDetalleCronograma);
  }
  private generarGridSinDescuento(data: IMontoPagoCronograma) {
    let tamanio = data.nroCuotas;
    let tamanioContador = 0;
    let numeroCuota = 1;
    let listaDetalleCronograma: IDetalleCronograma[] = [];
    let currentDate = new Date();
    let hoy = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()} 12:00:00`;
    let detalle: IDetalleCronograma = {
      id: 0,
      numeroCuota: numeroCuota,
      cuotaDescripcion: 'matricula ',
      montoCuota: data.matricula,
      fechaPago: new Date(hoy),
      montoCuotaDescuento: this.tipoDescuentoGeneral(
        data.matricula,
        data.fraccionesMatricula
      ),
      pagado: false,
      matricula: true,
    };
    listaDetalleCronograma.push(detalle);
    for (let i = 0; i < tamanio; i++) {
      numeroCuota++;
      tamanioContador++;
      let obj: IDetalleCronograma = {
        id: 0,
        numeroCuota: numeroCuota,
        cuotaDescripcion: 'Cuota - ' + (numeroCuota - 1),
        montoCuota: data.cuotas,
        montoCuotaDescuento: this.tipoDescuentoGeneral(
          data.cuotas,
          data.fraccionesMatricula
        ),
        pagado: false,
        matricula: false,
        fechaPago: this.calcularFechaInicial(i),
      };
      listaDetalleCronograma.push(obj);
      let fechaPago = obj.fechaPago as Date;
      if (tamanioContador != tamanio) {
        let mes = fechaPago.getMonth() + 1;
        if (data.cuotaDoble && (mes == 7 || mes == 12)) {
          numeroCuota++;
          let obj1: IDetalleCronograma = {
            id: 0,
            numeroCuota: numeroCuota,
            cuotaDescripcion: 'Cuota - ' + (numeroCuota - 1),
            montoCuota: data.cuotas,
            montoCuotaDescuento: this.tipoDescuentoGeneral(
              data.cuotas,
              data.fraccionesMatricula
            ),
            pagado: false,
            matricula: false,
            fechaPago: this.calcularFechaInicial(i),
          };
          listaDetalleCronograma.push(obj1);
          tamanio--;
        }
      }
    }
    this.cargarDetalleCronogramaPago(listaDetalleCronograma);
  }
  private generarGridCuotasAuxiliar(data: IMontoPagoCronograma) {
    let numeroCuota = 1;
    let listaDetalleCronograma: IDetalleCronograma[] = [];
    let tamanioContador = 0;
    let tamanio = data.nroCuotas + data.cuotasAdicionales;
    let tamaniocuotas = tamanio;
    let sinDescuento = data.precio - data.matricula;
    if (tamanio == 1 && data.matricula == 0) {
      let currentDate = new Date();
      let hoy = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()} 12:00:00`;
      let obj: IDetalleCronograma = {
        id: 0,
        numeroCuota: numeroCuota,
        cuotaDescripcion: 'Contado',
        montoCuota: data.cuotas,
        pagado: false,
        matricula: false,
        fechaPago: new Date(hoy),
        montoCuotaDescuento: this.tipoDescuentoGeneral(
          data.cuotas,
          data.porcentajeCuotas
        ),
      };
      listaDetalleCronograma.push(obj);
    } else {
      numeroCuota--;
      for (let i = 0; i < tamanio; i++) {
        if (numeroCuota == 0) {
          numeroCuota++;
          tamanioContador++;
          let obj: IDetalleCronograma = {
            id: 0,
            numeroCuota: numeroCuota,
            cuotaDescripcion: 'matricula ' + numeroCuota,
            montoCuota: data.cuotas,
            pagado: false,
            matricula: true,
            montoCuotaDescuento: this.tipoDescuentoGeneral(
              sinDescuento / tamaniocuotas,
              data.porcentajeCuotas
            ),
            fechaPago: this.calcularFechaInicial(i - 1),
          };
          listaDetalleCronograma.push(obj);
        } else {
          numeroCuota++;
          tamanioContador++;
          let obj: IDetalleCronograma = {
            id: 0,
            numeroCuota: numeroCuota,
            cuotaDescripcion: 'Cuota - ' + numeroCuota,
            montoCuota: data.cuotas,
            montoCuotaDescuento: this.tipoDescuentoGeneral(
              sinDescuento / tamaniocuotas,
              data.porcentajeCuotas
            ),
            pagado: false,
            matricula: false,
            fechaPago: this.calcularFechaInicial(i - 1),
          };
          listaDetalleCronograma.push(obj);
          let fechaPago = obj.fechaPago as Date;
          if (tamanioContador != tamanio) {
            let mes = fechaPago.getMonth() + 1;
            if (data.cuotaDoble && (mes === 7 || mes === 12)) {
              numeroCuota++;
              let obj1: IDetalleCronograma = {
                id: 0,
                numeroCuota: numeroCuota,
                cuotaDescripcion: 'Cuota - ' + numeroCuota,
                montoCuota: data.cuotas,
                montoCuotaDescuento: this.tipoDescuentoGeneral(
                  sinDescuento / tamaniocuotas,
                  data.porcentajeCuotas
                ),
                pagado: false,
                matricula: false,
                fechaPago: this.calcularFechaInicial(i - 1),
              };
              listaDetalleCronograma.push(obj1);
              tamanio--;
            }
          }
        }
      }
    }
    this.cargarDetalleCronogramaPago(listaDetalleCronograma);
  }
  private cargarDetalleCronogramaPago(data: IDetalleCronograma[]) {
    this.gridDetalleCronogramaPago.data = data;
    this.total = aggregateBy(
      this.gridDetalleCronogramaPago.data,
      this._aggregates
    );
    let total = this.total['montoCuotaDescuento'].sum.toFixed(2);
    if (this._precioDescuentoTemp == Number(total)) {
      this.cuadraSumatoria = true;
    } else {
      this.cuadraSumatoria = false;
    }
  }
  private calcularFechaInicial(i: number) {
    let myDate = new Date();
    let mes = myDate.getMonth();
    let contador = i + 1;
    myDate.setMonth(mes + contador);
    myDate.setHours(12);
    myDate.setMinutes(0);
    myDate.setSeconds(0);
    return myDate;
  }
  private generarGridMatricula(data: any) {
    let numeroCuota = 1;
    let lista: IDetalleCronograma[] = [];
    let tamanioMatricula = 0;
    tamanioMatricula = data.fraccionesMatricula;
    if (tamanioMatricula === 0) tamanioMatricula = 1;
    for (let j = 0; j < tamanioMatricula; j++) {
      let obj: IDetalleCronograma = {};
      obj.id = 0;
      obj.numeroCuota = numeroCuota;
      obj.cuotaDescripcion = 'matricula ' + numeroCuota;
      obj.montoCuota = data.matricula;
      let currentDate = new Date();
      let hoy = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()} 12:00:00`;
      obj.fechaPago = new Date(hoy);
      obj.montoCuotaDescuento = this.tipoDescuentoGeneral(
        data.matricula / tamanioMatricula,
        data.porcentajeMatricula
      );
      obj.pagado = false;
      obj.matricula = true;
      lista.push(obj);
      numeroCuota++;
    }
    let tamanioContador = 0;
    let tamanio = data.nroCuotas;
    numeroCuota--;
    for (let i = 0; i < tamanio; i++) {
      let obj: IDetalleCronograma = {};
      numeroCuota++;
      tamanioContador++;
      obj.id = 0;
      obj.numeroCuota = numeroCuota;
      obj.cuotaDescripcion = 'Cuota - ' + numeroCuota;
      obj.montoCuota = data.cuotas;
      obj.montoCuotaDescuento = this.tipoDescuentoGeneral(
        data.cuotas,
        data.porcentajeCuotas
      );
      obj.pagado = false;
      obj.matricula = false;
      let fecha = this.calcularFechaInicial(i);
      obj.fechaPago = fecha;
      lista.push(obj);
      if (tamanioContador !== tamanio) {
        let mes = fecha.getMonth() + 1;
        if (data.cuotaDoble && (mes == 7 || mes == 12)) {
          let obj1: IDetalleCronograma = {};
          numeroCuota++;
          obj1.id = 0;
          obj1.numeroCuota = numeroCuota;
          obj1.cuotaDescripcion = 'Cuota - ' + numeroCuota;
          obj1.montoCuota = data.cuotas;
          obj1.montoCuotaDescuento = this.tipoDescuentoGeneral(
            data.cuotas,
            data.porcentajeCuotas
          );
          obj1.pagado = false;
          obj1.matricula = false;
          obj1.fechaPago = this.calcularFechaInicial(i);
          lista.push(obj1);
          tamanio--;
        }
      }
    }
    this.cargarDetalleCronogramaPago(lista);
  }
  private generarGridCuotas(data: any) {
    let currentDate = new Date();
    let hoy = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()} 12:00:00`;
    let tamanio = data.nroCuotas;
    let numeroCuota = 1;
    let lista: IDetalleCronograma[] = [];
    let obj: IDetalleCronograma = {
      id: 0,
      numeroCuota: numeroCuota,
      cuotaDescripcion: 'matricula ',
      montoCuota: data.matricula,
      fechaPago: new Date(hoy),
      montoCuotaDescuento: this.tipoDescuentoGeneral(
        data.matricula,
        data.fraccionesMatricula
      ),
      pagado: false,
      matricula: true,
    };
    lista.push(obj);

    let tamanioContador = 0;
    tamanio = data.nroCuotas + data.cuotasAdicionales;
    let tamaniocuotas = tamanio;
    let sinDescuento = data.precio - data.matricula;
    for (let i = 0; i < tamanio; i++) {
      numeroCuota++;
      tamanioContador++;
      let obj: IDetalleCronograma = {
        id: 0,
        numeroCuota: numeroCuota,
        cuotaDescripcion: 'Cuota - ' + numeroCuota,
        montoCuota: data.cuotas,
        montoCuotaDescuento: this.tipoDescuentoGeneral(
          sinDescuento / tamaniocuotas,
          data.porcentajeCuotas
        ),
        pagado: false,
        matricula: false,
        fechaPago: this.calcularFechaInicial(i),
      };
      let fecha = obj.fechaPago as Date;
      lista.push(obj);
      if (tamanioContador !== tamanio) {
        let mes = fecha.getMonth() + 1;
        if (data.cuotaDoble && (mes == 7 || mes == 12)) {
          numeroCuota++;
          let obj1: IDetalleCronograma = {
            id: 0,
            numeroCuota: numeroCuota,
            cuotaDescripcion: 'Cuota - ' + numeroCuota,
            montoCuota: data.cuotas,
            montoCuotaDescuento: this.tipoDescuentoGeneral(
              sinDescuento / tamaniocuotas,
              data.porcentajeCuotas
            ),
            pagado: false,
            matricula: false,
            fechaPago: this.calcularFechaInicial(i),
          };
          lista.push(obj1);
          tamanio--;
        }
      }
    }
    this.cargarDetalleCronogramaPago(lista);
  }
  private generarGridAmbos(data: IMontoPagoCronograma) {
    let numeroCuota = 1;
    let lista: IDetalleCronograma[] = [];
    let tamanioMatricula = data.fraccionesMatricula;

    if (tamanioMatricula == 0) tamanioMatricula = 1;
    for (let j = 0; j < tamanioMatricula; j++) {
      let currentDate = new Date();
      let hoy = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()} 12:00:00`;
      let obj: IDetalleCronograma = {
        id: 0,
        numeroCuota: numeroCuota,
        cuotaDescripcion: 'matricula ' + numeroCuota.toString(),
        montoCuota: data.matricula,
        fechaPago: new Date(hoy),
        montoCuotaDescuento: this.tipoDescuentoGeneral(
          data.matricula / tamanioMatricula,
          data.porcentajeMatricula
        ),
        pagado: false,
        matricula: true,
      };
      lista.push(obj);
      numeroCuota++;
    }

    let tamanio = data.nroCuotas + data.cuotasAdicionales;
    let tamanioContador = 0;
    numeroCuota = numeroCuota - 1;
    let tamaniocuotas = tamanio;
    let sinDescuento = data.precio - data.matricula;

    for (let i = 0; i < tamanio; i++) {
      numeroCuota++;
      tamanioContador++;
      let fecha = this.calcularFechaInicial(i);
      let obj: IDetalleCronograma = {
        id: 0,
        numeroCuota: numeroCuota,
        cuotaDescripcion: 'Cuota - ' + numeroCuota,
        montoCuota: data.cuotas,
        montoCuotaDescuento: this.tipoDescuentoGeneral(
          sinDescuento / tamaniocuotas,
          data.porcentajeCuotas
        ),
        pagado: false,
        matricula: false,
        fechaPago: fecha,
      };
      lista.push(obj);
      if (tamanioContador != tamanio) {
        let mes = fecha.getMonth() + 1;
        if (data.cuotaDoble && (mes == 7 || mes == 12)) {
          numeroCuota++;
          let obj1: IDetalleCronograma = {
            id: 0,
            numeroCuota: numeroCuota,
            cuotaDescripcion: 'Cuota - ' + numeroCuota.toString(),
            montoCuota: data.cuotas,
            montoCuotaDescuento: this.tipoDescuentoGeneral(
              sinDescuento / tamaniocuotas,
              data.porcentajeCuotas
            ),
            pagado: false,
            matricula: false,
            fechaPago: this.calcularFechaInicial(i),
          };
          lista.push(obj1);
          tamanio--;
        }
      }
    }
    this.cargarDetalleCronogramaPago(lista);
  }
  private generarGridGeneral(data: IMontoPagoCronograma) {
    let tamanio = data.nroCuotas;
    let tamanioContador = 0;
    let numeroCuota = 1;
    let lista: IDetalleCronograma[] = [];
    let currentDate = new Date();
    let hoy = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()} 12:00:00`;
    let obj: IDetalleCronograma = {
      id: 0,
      numeroCuota: numeroCuota,
      cuotaDescripcion: 'matricula ',
      montoCuota: data.matricula,
      fechaPago: new Date(hoy),
      montoCuotaDescuento: this.tipoDescuentoGeneral(
        data.matricula,
        data.porcentajeGeneral
      ),
      pagado: false,
      matricula: true,
    };
    lista.push(obj);

    for (let i = 0; i < tamanio; i++) {
      numeroCuota++;
      tamanioContador++;
      let fecha = this.calcularFechaInicial(i);
      let obj: IDetalleCronograma = {
        id: 0,
        numeroCuota: numeroCuota,
        cuotaDescripcion: 'Cuota - ' + (numeroCuota - 1),
        montoCuota: data.cuotas,
        montoCuotaDescuento: this.tipoDescuentoGeneral(
          data.cuotas,
          data.porcentajeGeneral
        ),
        pagado: false,
        matricula: false,
        fechaPago: fecha,
      };
      lista.push(obj);
      if (tamanioContador !== tamanio) {
        let mes = fecha.getMonth() + 1;
        if (data.cuotaDoble && (mes === 7 || mes === 12)) {
          numeroCuota++;
          let obj1: IDetalleCronograma = {
            id: 0,
            numeroCuota: numeroCuota,
            cuotaDescripcion: 'Cuota - ' + (numeroCuota - 1),
            montoCuota: data.cuotas,
            montoCuotaDescuento: this.tipoDescuentoGeneral(
              data.cuotas,
              data.porcentajeGeneral
            ),
            pagado: false,
            matricula: false,
            fechaPago: this.calcularFechaInicial(i),
          };
          lista.push(obj1);
          tamanio--;
        }
      }
    }
    this.cargarDetalleCronogramaPago(lista);
  }
  modificacionEnGrilla(dataItem: IDetalleCronograma) {
    if (dataItem.numeroCuota > 0) {
      let lista: IDetalleCronograma[] = [];
      let gridRegistros = this.gridDetalleCronogramaPago
        .data as IDetalleCronograma[];
      let contador = 0;
      let ano: number;
      let mes: number;
      let dia: number;
      gridRegistros.forEach((element) => {
        let myDate = new Date();
        let obj: IDetalleCronograma = {
          id: element.id,
          numeroCuota: element.numeroCuota,
          montoCuota: element.montoCuota,
          cuotaDescripcion: element.cuotaDescripcion,
          montoCuotaDescuento: element.montoCuotaDescuento,
          matricula: element.matricula,
          pagado: element.pagado,
          fechaPago: null,
        };
        let fechaPago = element.fechaPago as Date;
        if (dataItem.numeroCuota == element.numeroCuota) {
          ano = fechaPago.getFullYear();
          mes = fechaPago.getMonth();
          dia = fechaPago.getDate();
        }
        if (element.numeroCuota > dataItem.numeroCuota) {
          contador = contador + 1;
          myDate.setFullYear(ano, mes + contador, dia);
          myDate.setHours(12);
          myDate.setMinutes(0);
          myDate.setSeconds(0);
          obj.fechaPago = myDate;
        } else {
          obj.fechaPago = element.fechaPago;
        }
        lista.push(obj);
      });
      this.cargarDetalleCronogramaPago(lista);
    }
  }
  dividirCuota() {
    let lista: any[] = [];
    let gridRegistros = this.gridDetalleCronogramaPago.data;
    let nroSubCuotasNuevas = this.formSubCuotas.get('nroSubCuotas').value + 1;
    let contNumeroCuota = 0;
    let contadorCuota = 0;
    let contadorMatricula = 0;
    let currentDate = this._detalleCronogramaTemp.fechaPago as Date;
    let auxDate = currentDate;
    let day = currentDate.getDate();
    let month = currentDate.getMonth();
    gridRegistros.forEach((element) => {
      let obj: any = {};
      if (this._detalleCronogramaTemp.numeroCuota === element.numeroCuota) {
        for (let i = 1; i <= nroSubCuotasNuevas; i++) {
          let obj_aux: any = {};
          obj_aux.Id = element.Id;
          contNumeroCuota = contNumeroCuota + 1;
          let montoAux = this._detalleCronogramaTemp.montoCuotaDescuento;
          currentDate = auxDate;
          month = currentDate.getMonth();
          day = currentDate.getDate();
          if (element.matricula === 1 || element.matricula === true) {
            contadorMatricula = contadorMatricula + 1;
            obj_aux.montoCuota = element.montoCuota / nroSubCuotasNuevas;
            obj_aux.cuotaDescripcion = 'matricula ' + contadorMatricula;
            currentDate.setMonth(month + contNumeroCuota, day);
            obj_aux.fechaPago = this.fechaCronograma(contNumeroCuota - 1, day);
            obj_aux.montoCuotaDescuento = montoAux / nroSubCuotasNuevas;
            obj_aux.matricula = true;
          } else {
            contadorCuota = contadorCuota + 1;
            obj_aux.montoCuota = element.montoCuota / nroSubCuotasNuevas;
            obj_aux.cuotaDescripcion = 'Cuota - ' + contadorCuota;
            currentDate.setMonth(month + contNumeroCuota, day);
            obj_aux.fechaPago = this.fechaCronograma(contNumeroCuota - 1, day);
            obj_aux.montoCuotaDescuento = montoAux / nroSubCuotasNuevas;
            obj_aux.matricula = false;
          }
          obj_aux.numeroCuota = contNumeroCuota;
          obj_aux.pagado = false;
          obj_aux.rowVersion = null;

          lista.push(obj_aux);
        }
      } else {
        contNumeroCuota = contNumeroCuota + 1;
        obj.Id = element.Id;
        if (element.matricula === 1 || element.matricula === true) {
          contadorMatricula = contadorMatricula + 1;
          obj.cuotaDescripcion = 'matricula ' + contadorMatricula;
          obj.montoCuotaDescuento = element.montoCuotaDescuento;
          obj.matricula = true;
        } else {
          contadorCuota = contadorCuota + 1;
          obj.cuotaDescripcion = 'Cuota - ' + contadorCuota;
          obj.montoCuotaDescuento = element.montoCuotaDescuento;
          obj.matricula = false;
        }
        currentDate = auxDate;
        month = currentDate.getMonth();
        day = currentDate.getDate();
        if (element.numeroCuota > this._detalleCronogramaTemp.numeroCuota) {
          currentDate.setMonth(month + contNumeroCuota, day);
          obj.fechaPago = this.fechaCronograma(contNumeroCuota - 1, day);
        } else {
          obj.fechaPago = element.fechaPago;
        }
        obj.numeroCuota = contNumeroCuota;
        obj.montoCuota = element.montoCuota;

        obj.pagado = false;
        obj.rowVersion = null;

        lista.push(obj);
      }
    });
    this.cargarDetalleCronogramaPago(lista);
    this.limpiarModalFraccionar();
  }
  eliminarCuota() {
    let lista: IDetalleCronograma[] = [];
    let gridRegistros = this.gridDetalleCronogramaPago
      .data as IDetalleCronograma[];
    let asignarCuota = this.formEliminarCuota.get('asignarACuota').value.Valor;
    let montoCuota = this.formEliminarCuota.get('monto').value;
    let auxMontoCuota = parseFloat(montoCuota);
    let contNumeroCuota = 0;
    let contadorCuota = 0;
    let contadorMatricula = 0;
    let currentDate = this._detalleCronogramaTemp.fechaPago as Date;
    let day = currentDate.getDate();
    gridRegistros.forEach((element) => {
      let obj: IDetalleCronograma = {};
      contNumeroCuota++;
      if (this._detalleCronogramaTemp.numeroCuota == element.numeroCuota) {
        contNumeroCuota--;
      } else if (asignarCuota == element.numeroCuota) {
        obj.id = element.id;
        if (element.matricula == true) {
          contadorMatricula = contadorMatricula + 1;
          obj.montoCuota = element.montoCuota + auxMontoCuota;
          obj.cuotaDescripcion = 'matricula ' + contadorMatricula;
          obj.fechaPago = this.fechaCronograma(contNumeroCuota - 1, day);
          obj.montoCuotaDescuento = element.montoCuotaDescuento + montoCuota;
          obj.matricula = true;
        } else {
          contadorCuota++;
          obj.montoCuota = element.montoCuota + auxMontoCuota;
          obj.cuotaDescripcion = 'Cuota - ' + contadorCuota;
          obj.fechaPago = this.fechaCronograma(contNumeroCuota - 1, day);
          obj.montoCuotaDescuento = element.montoCuotaDescuento + montoCuota;
          obj.matricula = false;
        }
        obj.numeroCuota = contNumeroCuota;
        obj.pagado = false;
        lista.push(obj);
      } else {
        obj.id = element.id;
        if (element.matricula == true) {
          contadorMatricula++;
          obj.cuotaDescripcion = 'matricula ' + contadorMatricula;
          obj.montoCuotaDescuento = element.montoCuotaDescuento;
          obj.matricula = true;
        } else {
          contadorCuota++;
          obj.cuotaDescripcion = 'Cuota - ' + contadorCuota;
          obj.montoCuotaDescuento = element.montoCuotaDescuento;
          obj.matricula = false;
        }
        if (element.numeroCuota >= this._detalleCronogramaTemp.numeroCuota) {
          obj.fechaPago = this.fechaCronograma(contNumeroCuota - 1, day);
        } else {
          obj.fechaPago = element.fechaPago;
        }
        obj.numeroCuota = contNumeroCuota;
        obj.montoCuota = element.montoCuota;
        obj.pagado = false;
        lista.push(obj);
      }
    });
    this.cargarDetalleCronogramaPago(lista);
    this._modalRef.close();
  }
  abrirModalFraccionar(dataItem: IDetalleCronograma) {
    this._detalleCronogramaTemp = dataItem;
    this._modalRef = this.modalService.open(this.modalFraccionarCuota, {
      size: 'small',
      animation: true,
      backdrop: 'static',
    });
  }
  abrirModalEliminar(celda: IDetalleCronograma) {
    this.formEliminarCuota.reset();
    this._detalleCronogramaTemp = celda;
    let objCuotas: IClaveValor[] = [];
    let gridRegistros = this.gridDetalleCronogramaPago
      .data as IDetalleCronograma[];
    gridRegistros.forEach((element) => {
      if (this._detalleCronogramaTemp.numeroCuota != element.numeroCuota) {
        objCuotas.push({
          clave: element.cuotaDescripcion,
          valor: element.numeroCuota,
        });
      }
    });
    this.dataAsignacionCuota = objCuotas;
    this.formEliminarCuota
      .get('monto')
      .setValue(this._detalleCronogramaTemp.montoCuotaDescuento);
    this._modalRef = this.modalService.open(this.modalEliminarCuota, {
      size: 'small',
      animation: true,
      backdrop: 'static',
    });
  }
  private fechaCronograma(i: number, dia: number) {
    let myDate = new Date();
    let mes = myDate.getMonth();
    let contador = i;
    myDate.setMonth(mes + contador, dia);
    myDate.setHours(12);
    myDate.setMinutes(0);
    myDate.setSeconds(0);
    return myDate;
  }
  limpiarModalFraccionar() {
    this.formSubCuotas.get('nroSubCuotas').setValue(0);
    this._modalRef.close();
  }
  guardarCronograma() {
    if (this.flagChangeMontoPago == 0) {
      this._montoPagoCronogramaTemp =
        this.formCronogramapago.get('montoPago').value;
    }
    this.estadoMensaje = '';
    if (this.estadoGuardado == 0) {
      this.estadoGuardado = 1;
      if (!this.cuadraSumatoria) {
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Los montos deben coincidir',
        });
        this.estadoGuardado = 0;
        return;
      }
      let obj: ICronograPagoEnvio = {};
      this.estadoMensaje = 'Guardando ...';
      if (this._cronograma != null) {
        obj.id = this._cronograma.id;
        obj.idOportunidad = this.rowActual.idOportunidad;
        obj.idPersonal = this.rowActual.idPersonal_Asignado;
        obj.idTipoDescuento = this._montoPagoCronogramaTemp.idTipoDescuento;
        obj.precio = this._montoPagoCronogramaTemp.precio;
        obj.idMoneda = this._montoPagoCronogramaTemp.idMoneda;
        obj.nombrePlural = this._montoPagoCronogramaTemp.nombrePlural;
        obj.precioDescuento = this._precioDescuentoTemp;
        obj.idMontoPago = this._montoPagoCronogramaTemp.id;
        obj.matriculaEnProceso = 0;
        obj.esAprobado = this.agendaService.esCoordinadora$.value;
        obj.formula = this._montoPagoCronogramaTemp.formula;
        obj.codigoMatricula = '';
      } else {
        obj.id = 0;
        obj.idOportunidad = this.rowActual.idOportunidad;
        obj.idPersonal = this.rowActual.idPersonal_Asignado;
        obj.idTipoDescuento = this._montoPagoCronogramaTemp.idTipoDescuento;
        obj.precio = this._montoPagoCronogramaTemp.precio;
        obj.idMoneda = this._montoPagoCronogramaTemp.idMoneda;
        obj.precioDescuento = this._precioDescuentoTemp;
        obj.nombrePlural = this._montoPagoCronogramaTemp.nombrePlural;
        obj.idMontoPago = this._montoPagoCronogramaTemp.id;
        obj.matriculaEnProceso = 0;
        obj.esAprobado = this.agendaService.esCoordinadora$.value;
        obj.formula = this._montoPagoCronogramaTemp.formula;
        obj.codigoMatricula = '';
      }
      let detalleCronogramaPago = this.gridDetalleCronogramaPago
        .data as IDetalleCronograma[];
      obj.listaDetalleCuotas = detalleCronogramaPago.map((x) => ({
        ...x,
        fechaPago: datePipeTransform(x.fechaPago as Date),
      }));
      obj.usuario = this.agendaService.userName;
      obj.idPersonal = this.rowActual.idPersonal_Asignado;
      obj.idMedioPago =
        this.formCronogramapago.get('medioPago').value == null
          ? 0
          : this.formCronogramapago.get('medioPago').value;
      this.agendaService.agendaCronogramaPagoService
        .guardarCronogramaPago$(
          this.rowActual.idOportunidad,
          this.rowActual.idAlumno,
          obj
        )
        .subscribe({
          next: (response) => {
            this.cargarCronogramaPagos();
            this.estadoGuardado = 0;
            if (this.agendaService.esCoordinadora$.value) {
              this._cronograma.esAprobado = true;
              this.estadoMensaje = 'El Cronograma se Aprobo Correctamente.';
            } else {
              this.estadoMensaje = 'Se Guardo Correctamente.';
            }
            this.agendaService.agendaCronogramaPagoService
              .congelarCronogramaAlumno$(
                response.body.cronograma.id,
                this.agendaService.userName
              )
              .subscribe({
                next: (respuesta: any) => {},
              });
          },
          error: (error) => {
            this.estadoGuardado = 0;
            if (this.agendaService.esCoordinadora$.value) {
              this.estadoMensaje = 'No se pudo Aprobar el Cronograma...';
            } else {
              this.estadoMensaje = 'No se pudo Guardar...';
            }
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: this.estadoMensaje,
              text: mensaje,
            });
          },
        });
    }
  }
  visualizarPortal() {
    this.showCronogramaPortal = true;
  }
  eliminarCronograma() {
    if (!this.cuadraSumatoria) {
      alert('Los Montos deben coincidir');
      return;
    }
    this.estadoMensaje = 'Eliminando ...';
    let obj: ICronograPagoEnvio = {};
    if (this._cronograma != null) {
      obj.id = this._cronograma.id;
      obj.idOportunidad = this.rowActual.idOportunidad;
      obj.idPersonal = this.rowActual.idPersonal_Asignado;
      obj.idTipoDescuento = this._montoPagoCronogramaTemp.idTipoDescuento;
      obj.precio = this._montoPagoCronogramaTemp.precio;
      obj.idMoneda = this._montoPagoCronogramaTemp.idMoneda;
      obj.nombrePlural = this._montoPagoCronogramaTemp.nombrePlural;
      obj.precioDescuento = this._precioDescuentoTemp;
      obj.idMontoPago = this._montoPagoCronogramaTemp.id;
      obj.matriculaEnProceso = 0;
      obj.esAprobado = false;
      obj.formula = this._montoPagoCronogramaTemp.formula;
      obj.codigoMatricula = '';
    } else {
      obj.id = 0;
      obj.idOportunidad = this.rowActual.idOportunidad;
      obj.idPersonal = this.rowActual.idPersonal_Asignado;
      obj.idTipoDescuento = this._montoPagoCronogramaTemp.idTipoDescuento;
      obj.precio = this._montoPagoCronogramaTemp.precio;
      obj.idMoneda = this._montoPagoCronogramaTemp.idMoneda;
      obj.precioDescuento = this._precioDescuentoTemp;
      obj.nombrePlural = this._montoPagoCronogramaTemp.nombrePlural;
      obj.idMontoPago = this._montoPagoCronogramaTemp.id;
      obj.matriculaEnProceso = 0;
      obj.esAprobado = false;
      obj.formula = this._montoPagoCronogramaTemp.formula;
      obj.codigoMatricula = '';
    }
    let listaCronograma = this.gridDetalleCronogramaPago.data;
    obj.listaDetalleCuotas = listaCronograma;
    obj.usuario = this.agendaService.userName;
    obj.idPersonal = this.rowActual.idPersonal_Asignado;
    this.agendaService.agendaCronogramaPagoService
      .eliminarCronogramaVentas$(this.rowActual.idAlumno, obj)
      .subscribe({
        next: (response) => {
          this.cargarCronogramaPagos();
          this.alertaService.swalFireOptions({
            icon: 'success',
            text: 'Se elimino el cronograma.',
          });
          this.estadoMensaje = 'Se elimino el cronograma.';
          this.btnElimnar.show = false;
          this.btnEnviarSMS.show = false;
          this.btnAprobarDisabled = true;
          this.formCronogramapago.get('tipoDescuento').enable();
          this.formCronogramapago.get('montoPago').enable();
          this.gridDetalleCronogramaPago.data = [];
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (error.status == 409) {
            this.alertaService.swalFireOptions({
              icon: 'info',
              title: 'No se puedo eliminar el cronograma',
              text: mensaje,
            });
          } else {
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se puedo eliminar el cronograma',
              text: mensaje,
            });
          }
          this.estadoMensaje = 'No se pudo eliminar el cronograma.';
        },
      });
  }
  actualizarMetodoPago() {
    if (this.idMatriculaCabeceraTemp > 0) {
      let obj: IMetodoPagoMatricula = {
        idMatriculaCabecera: this.idMatriculaCabeceraTemp,
        idMedioPago: this.formCronogramapago.get('medioPago').value,
        activo: true,
        usuario: this.agendaService.userName,
      };
      this.btnActualizarMetodoPagoDisabled = true;
      this.agendaService.agendaCronogramaPagoService
        .actualizarMedioPago$(obj)
        .subscribe({
          next: (response) => {
            if (response.body == true) {
              this.alertaService.swalFireOptions({
                icon: 'info',
                text: 'Exitoso!! Se actualizo el metodo de pago.',
              });
            } else {
              this.alertaService.swalFireOptions({
                icon: 'info',
                text: 'Error!! El metodo de pago ya se encuentra actualiado.',
              });
            }
            this.btnActualizarMetodoPagoDisabled = false;
          },
          error: (error) => {
            this.btnActualizarMetodoPagoDisabled = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'Error en la actualizacion de metodo de pago',
              text: mensaje,
            });
          },
        });
    } else {
      this.btnActualizarMetodoPagoDisabled = false;
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: '¡No se tiene el id de la matricula!',
      });
    }
  }
  modificacionFechaEnGrilla(fechaNueva: Date, celda: IDetalleCronograma) {
    celda.fechaPago = fechaNueva;
    this.modificacionEnGrilla(celda);
  }
  enviarSMS() {
    let obj: any = {};
    this.btnEnviarSMS.disabled = true;
    obj.idOportunidad = this.rowActual.idOportunidad;
    obj.idAlumno = this.rowActual.idAlumno;
    obj.usuario = this.agendaService.userName;
    this.agendaService.agendaCronogramaPagoService
      .enviarMensajeTexto$(obj)
      .subscribe({
        next: (response: any) => {
          this.estadoSMS = 'Mensaje enviado';
          this.btnEnviarSMS.disabled = false;
        },
      });
  }
}

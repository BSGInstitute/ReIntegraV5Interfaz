import { HttpResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AggregateDescriptor, aggregateBy } from '@progress/kendo-data-query';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import {
  ICronogramaPago,
  IMetodoPagoMatricula,
  IMontoPagoCronograma,
  IPasarelaPago,
  ITipoDescuentoCronograma,
} from '@comercial/models/interfaces/iagenda-cronograma-pago';
import { Subscription } from 'rxjs';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiFinanzas, constApiMarketing } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';

@Component({
  selector: 'app-cronograma-pago',
  templateUrl: './cronograma-pago.component.html',
  styleUrls: ['./cronograma-pago.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CronogramaPagoComponent implements OnInit {
  @ViewChild('modalTransaccionesPagos') modalTransaccionesPagos: any;

  modalRefTransaccionesPagos: any;
  grillaModalTransaccionesPagos: any;
  loaderModalTransPagos: boolean = true;

  inputCostoTotal = '';
  inputCostoDescuento = '';
  inputCostoDescuentoOtorgado = '';
  modalRef: any;
  cuotaActualFraccionar: any = {};
  estadoMensaje = '';
  rowActual: IRowActual;
  cronogramaAprobado = false;
  vistaPortal = '';

  gridCronogramaPago: KendoGrid = new KendoGrid();
  cuadraSumatoria = false;
  estadoGuardado = 0;

  montoPagoFiltro: IMontoPagoCronograma[] = [];
  montoPagoFiltroAux: IMontoPagoCronograma[] = [];
  tipoDescuentoFiltro: ITipoDescuentoCronograma[] = [];
  tipoDescuentoFiltroAux: ITipoDescuentoCronograma[] = [];
  medioPagoFiltro: any[] = [];
  textoDetalle: any;
  esContado = false;
  esMontoPagoSeleccionado = false;
  dataGrillaMontoPago: any = {};
  precioDescuento = 0;

  montoPagoSeleccionado: any[] = [];
  tipoDescuentoSeleccionado: any[] = [];
  tipoPagoSeleccionado: any[] = [];
  dataAsignacionCuota: any[] = [];
  dataAsignacionCuotaAux: any[] = [];
  dataCronogramaServicios: any = {};
  estadoSMS = '';
  flagChangeMontoPago: number = 0;
  esCoordinadora: boolean = false;
  formCronogramapago: FormGroup = this.formBuilder.group({
    idTipoDescuento: [null],
    idMontosPago: [null],
    idMedioPago: [null],
  });

  formSubCuotas: FormGroup = this.formBuilder.group({
    nroSubCuotas: [null],
  });

  formEliminarCuota: FormGroup = this.formBuilder.group({
    monto: [null],
    asignarACuota: [null],
  });
  subscriptions: Subscription = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private integraService: IntegraService
  ) {}

  dataMontoPago: any = {};
  dataMedioPago: IPasarelaPago[] = [];
  dataMedioPagoAux: IPasarelaPago[] = [];
  dataDetalleMontoPago: any[] = [];

  btnGuardar: any = {
    disabled: false,
    class: 'btn-warning text-white',
    html: 'Guardar Cronograma',
    show: true,
  };

  btnVerCronogramaPortal: any = {
    disabled: false,
    class: 'btn-warning text-white',
    html: 'Ver Cronog. Portal Web',
    show: true,
  };

  btnAprobar: any = {
    disabled: false,
    class: 'btn-primary text-white',
    html: 'Aprobar',
    show: true,
  };

  btnElimnar: any = {
    disabled: false,
    class: 'btn-warning text-white',
    html: '<span class="glyphicon glyphicon-comment"></span>Eliminar',
    show: true,
  };

  btnEnviarSMS: any = {
    disabled: false,
    class: 'btn-warning text-white',
    html: 'Enviar SMS',
    show: true,
  };

  verVistaPortal = false;
  metodoPagoIdMatriculaCabecera = 0;
  descuentoProfilingAprobado: boolean = false;
  cuponDescuentoProfiling: any;
  @Input() agendaService: AgendaService;
  @ViewChild('modalFraccionarCuota') modalFraccionarCuota: any;
  @ViewChild('modalEliminarCuota') modalEliminarCuota: any;

  ngOnInit(): void {
    console.log('CronogramaPagoComponent');
    this.rowActual = this.agendaService.rowActual;
    this.configGrid();
    this.initSubscribeObservables();
    this.cargarMedioPago();
    this.habilitarEdicionCelda();
    //this.agendaService.agendaCronogramaPagoService.datosMedioPago$.subscribe({
    //  next: (response:any) =>{
    //    this.dataMedioPago=response;
    //  }}
    //);
    //this.formCronogramapago.get('idTipoDescuento').disable();
  }

  habilitarEdicionCelda() {
    this.gridCronogramaPago.formGroup = this.formBuilder.group({
      fechaPago: [null],
      montoCuotaDescuento: [null],
    });
    this.gridCronogramaPago.getCellCloseEvent$().subscribe({
      next: (respuesta: any) => {
        //Modificar de formvaluedata
        let celda: any;
        if (respuesta.columnField == 'fechaPago') {
          // respuesta.dataItem.fechaPago=respuesta.formGroupValue.fechaPago;
        }
        if (respuesta.columnField == 'montoCuotaDescuento') {
          respuesta.dataItem.montoCuotaDescuento =
            respuesta.formGroupValue.montoCuotaDescuento;
          celda = respuesta.dataItem;
          this.modificacionEnGrilla(celda);
        }
      },
    });
  }

  initSubscribeObservables() {
    let sub1$ = this.agendaService.esCoordinadora$.subscribe(
      (resp) => (this.esCoordinadora = resp)
    );

    let sub2$ =
      this.agendaService.agendaCronogramaPagoService.oportunidadCronogramaPago$.subscribe(
        (resp) => {
          if (resp != null) {
            if (resp.cronograma.detalle != null) {
              resp.cronograma.detalle.map((data) => {
                data.fechaPago = new Date(data.fechaPago);
              });
            }
            this.dataMontoPago = resp;
            this.montoPagoFiltro = resp.cronograma.montosPago;
            this.montoPagoFiltroAux = resp.cronograma.montosPago;
            this.tipoDescuentoFiltro = resp.cronograma.tiposDescuento;
            this.tipoDescuentoFiltroAux = resp.cronograma.tiposDescuento;
            this.cargaInicial(resp);
          }
        }
      );
    let sub3$ = this.agendaService.agendaAlumnoService.alumno$.subscribe({
      next: (resp: IAlumnoInformacion) => {
        if (resp != null) {
          this.obtenerDescuentoProfiling(resp.email1);
        }
      },
    });
    this.subscriptions.add(sub1$);
    this.subscriptions.add(sub2$);
    this.subscriptions.add(sub3$);
  }

  configGrid() {
    this.gridCronogramaPago.formGroup = this.formBuilder.group({
      fechaPago: [null],
      montoCuotaDescuento: [null],
    });
    this.gridCronogramaPago.getCellCloseEvent$().subscribe({
      next: (respuesta: any) => {
        //console.log(respuesta);
        //Modificar de formvaluedata
        let celda: any;
        if (respuesta.columnField == 'fechaPago') {
          //respuesta.dataItem.fechaPago=respuesta.formGroupValue.fechaPago;
        }
        if (respuesta.columnField == 'montoCuotaDescuento') {
          respuesta.dataItem.montoCuotaDescuento =
            respuesta.formGroupValue.montoCuotaDescuento;
          celda = respuesta.dataItem;
          this.modificacionEnGrilla(celda);
        }
      },
    });

    this.gridCronogramaPago.readOnlyColumns = ['cuotaDescripcion'];
  }

  public aggregates: AggregateDescriptor[] = [
    { field: 'montoCuotaDescuento', aggregate: 'sum' },
  ];
  public total: any = aggregateBy(
    this.gridCronogramaPago.data,
    this.aggregates
  );

  cargarMedioPago() {
    let rowActual = this.rowActual;
    console.log('cargarMedioPago', rowActual);
    this.agendaService.agendaCronogramaPagoService
      .cargarMedioPago$(rowActual.idAlumno)
      .subscribe({
        next: (response: any) => {
          let idPagoPrioridad: any = null;
          if (response.body.length != 0) {
            idPagoPrioridad = response.body[0].id;
          }
          this.dataMedioPago = response.body;
          this.dataMedioPagoAux = response.body;
          this.agendaService.agendaCronogramaPagoService
            .obtenerMatriculaPorAlumnoCosto$(
              rowActual.idAlumno,
              rowActual.idCentroCosto
            )
            .subscribe({
              next: (response: HttpResponse<number>) => {
                if (response.body != null && response.body != 0) {
                  this.metodoPagoIdMatriculaCabecera = response.body;
                  this.agendaService.agendaCronogramaPagoService
                    .obtenerMetodoPagoPorIdMatriculaCabecera$(
                      this.metodoPagoIdMatriculaCabecera
                    )
                    .subscribe({
                      next: (response) => {
                        if (response.body != null) {
                          this.formCronogramapago
                            .get('idMedioPago')
                            .setValue(
                              this.dataMedioPago.find(
                                (x: any) => x.id == response.body.idMedioPago
                              )
                            );
                        } else {
                          this.formCronogramapago
                            .get('idMedioPago')
                            .setValue(
                              this.dataMedioPago.find(
                                (x: any) => x.id == idPagoPrioridad
                              )
                            );
                        }
                      },
                    });
                }
              },
            });
        },
      });
  }

  cargaInicial(datos: ICronogramaPago) {
    this.estadoMensaje = '';
    this.formCronogramapago.get('idTipoDescuento').disable();
    this.formCronogramapago.get('idMontosPago').enable();
    this.dataCronogramaServicios = null;
    this.btnGuardar.disabled = false;
    this.btnEnviarSMS.show = false;
    this.btnAprobar.disabled = false;
    this.btnVerCronogramaPortal.disabled = true;

    if (datos.cronograma.id !== 0) {
      this.vistaPortal = datos.vistaPortalWeb;
      this.dataCronogramaServicios = datos.cronograma;
      let tempCredito = this.montoPagoFiltro.filter(
        (r) => r.cuotasTipoPago == 1
      );
      if (tempCredito.length == 0) {
        this.esContado = true;
      }
      let dataMonotoPagoCronograma = datos.cronograma;
      if (dataMonotoPagoCronograma.esAprobado) {
        this.cronogramaAprobado = true;
        this.agendaService.agendaCronogramaPagoService.cronogramaAprobado$.next(
          true
        );
        this.estadoMensaje = 'Cronograma fue aprobado';
        this.btnAprobar.disabled = true;
        this.btnVerCronogramaPortal.disabled = false;
        this.btnGuardar.disabled = dataMonotoPagoCronograma.esAprobado;
        this.formCronogramapago.get('idTipoDescuento').disable();
        this.formCronogramapago.get('idMontosPago').disable();
        this.btnEnviarSMS.show = true;
      } else {
        this.formCronogramapago.get('idTipoDescuento').enable();
      }
      if (dataMonotoPagoCronograma.precioDescuento != 0) {
        this.precioDescuento = dataMonotoPagoCronograma.precioDescuento;
      } else {
        this.precioDescuento = dataMonotoPagoCronograma.precio;
      }
      this.setCronogramaPago(datos.cronograma.detalle);
      this.configurarMontosTotales(dataMonotoPagoCronograma);

      //this.formCronogramapago.get('idMontosPago').setValue(dataMonotoPagoCronograma.idMontoPago);
      this.formCronogramapago
        .get('idMontosPago')
        .setValue(
          this.montoPagoFiltro.find(
            (x) => x.id == dataMonotoPagoCronograma.idMontoPago
          )
        );
    }
  }

  unionHTML(texto: string): string {
    let nuevoTexto = texto.substring(texto.indexOf('>') + 1, undefined);
    return `<p> - ${nuevoTexto}`;
  }

  redondear(valor: number) {
    return isNaN(valor) ? valor : valor.toFixed(2);
  }

  changeMontoPago(event: any) {
    this.flagChangeMontoPago = 1;
    this.dataGrillaMontoPago = {};
    this.gridCronogramaPago.data = [];
    this.formCronogramapago.get('idTipoDescuento').setValue(null);
    this.total = null;

    this.inputCostoTotal = '';
    this.inputCostoDescuento = '';
    this.inputCostoDescuentoOtorgado = '';
    this.formCronogramapago.get('idTipoDescuento').enable();

    this.montoPagoFiltro = this.montoPagoFiltroAux;

    /*Buscar detalles */
    if (event.id != null) {
      this.agendaService.agendaCronogramaPagoService
        .obtenerDetalleMontoPago$(event.id)
        .subscribe({
          next: (response: any) => {
            this.textoDetalle = response.body;
          },
        });
    } else {
      this.textoDetalle = null;
    }

    if (event.cuotasTipoPago !== 1) {
      //var tempContado = this.montoPagoFiltro.filter(
      //  (c:any) => c.cuotasTipoPago==2
      //);

      let tempCredito = this.montoPagoFiltro.filter(
        (r: any) => r.cuotasTipoPago == 1
      );
      if (tempCredito.length == 0) {
        this.esContado = true;
      }
      if (event.nroCuotas === 1 && event.matricula === 0) {
        this.esMontoPagoSeleccionado = true;
      } else {
        this.esMontoPagoSeleccionado = false;
      }
      let descuento = this.tipoDescuentoFiltro.filter(
        (d) => d.codigo == 'Contado Normal'
      );
      event.idTipoDescuento = descuento[0].id;
      event.formula = descuento[0].formula;
      event.cuotasAdicionales = descuento[0].cuotasAdicionales;
      event.fraccionesMatricula = descuento[0].fraccionesMatricula;
      event.porcentajeCuotas = descuento[0].porcentajeCuotas;
      event.porcentajeGeneral = descuento[0].porcentajeGeneral;
      event.porcentajeMatricula = descuento[0].porcentajeMatricula;

      this.dataGrillaMontoPago = event;
      this.precioDescuento = this.calcularPrecioInicialConDescuento(
        this.dataGrillaMontoPago
      );
      this.generarCronogramaPagos(this.dataGrillaMontoPago);
      this.configurarMontosTotales(this.dataGrillaMontoPago);
    } else {
      this.esContado = false;
      this.esMontoPagoSeleccionado = false;
      this.dataGrillaMontoPago = event;
    }
  }

  changeTipoDescuento(event: any) {
    // TODO:Incoorporacion en revision
    // if(this.flagChangeMontoPago == 0){
    //   this.dataGrillaMontoPago = this.formCronogramapago.get('idMontosPago').value;
    // }
    // if (event.length >= 0) {

    this.filtrarMontosPagoPorDescuento(event);

    if (event.codigo === 'Promoción 25% Descuento') {
      let creditoAplicarDescuento = this.montoPagoFiltro.filter(
        (x: any) =>
          x.idPais == this.dataGrillaMontoPago.idPais &&
          x.paquete == this.dataGrillaMontoPago.paquete &&
          x.cuotasTipoPago == 1
      );
      if (creditoAplicarDescuento.length != 0) {
        this.dataGrillaMontoPago = creditoAplicarDescuento[0];
        this.dataGrillaMontoPago.matricula = this.dataGrillaMontoPago.precio;
        this.dataGrillaMontoPago.cuotas = 0;
        this.dataGrillaMontoPago.nroCuotas = 0;
      }
    }

    if (event.formula !== 5) {
      this.dataGrillaMontoPago.idTipoDescuento = event.id;
      this.dataGrillaMontoPago.formula = event.formula;
      this.dataGrillaMontoPago.cuotasAdicionales = event.cuotasAdicionales;
      this.dataGrillaMontoPago.fraccionesMatricula = event.fraccionesMatricula;
      this.dataGrillaMontoPago.porcentajeCuotas = event.porcentajeCuotas;
      this.dataGrillaMontoPago.porcentajeGeneral = event.porcentajeGeneral;
      this.dataGrillaMontoPago.porcentajeMatricula = event.porcentajeMatricula;
      this.precioDescuento = this.calcularPrecioInicialConDescuento(
        this.dataGrillaMontoPago
      );
      this.generarCronogramaPagos(this.dataGrillaMontoPago);
      this.configurarMontosTotales(this.dataGrillaMontoPago);
    } else {
      //contado
      this.dataGrillaMontoPago.idTipoDescuento = event.id;
      this.dataGrillaMontoPago.formula = event.formula;
      this.dataGrillaMontoPago.cuotasAdicionales = event.cuotasAdicionales;
      this.dataGrillaMontoPago.fraccionesMatricula = event.fraccionesMatricula;
      this.dataGrillaMontoPago.porcentajeCuotas = event.porcentajeCuotas;
      this.dataGrillaMontoPago.porcentajeGeneral = event.porcentajeGeneral;
      this.dataGrillaMontoPago.porcentajeMatricula = event.porcentajeMatricula;
      this.precioDescuento = this.calcularPrecioInicialConDescuento(
        this.dataGrillaMontoPago
      );
      this.generarCronogramaPagos(this.dataGrillaMontoPago);
      this.configurarMontosTotales(this.dataGrillaMontoPago);
    }
  }

  calcularPrecioInicialConDescuento(data: any) {
    let desc: string = '',
      matr: number,
      num: number,
      ccu: string,
      m: string,
      c: string,
      d: number;
    switch (data.formula) {
      case 0: //sin descuento
        matr = this.tipoDescuentoGeneral(
          data.matricula,
          data.porcentajeGeneral
        );
        var cuotas = this.tipoDescuentoGeneral(
          data.cuotas,
          data.porcentajeGeneral
        );
        num = data.nroCuotas.toFixed(2);
        ccu = (cuotas * Number(num)).toFixed(2);
        d = matr + parseFloat(ccu);
        desc = d.toFixed(2);
        break;
      case 1: //matricula
        var tamanioMatricula = data.fraccionesMatricula;
        if (tamanioMatricula === 0) tamanioMatricula = 1;
        matr = this.tipoDescuentoGeneral(
          data.matricula / tamanioMatricula,
          data.porcentajeMatricula
        );
        var tamanio = data.nroCuotas;
        var cuotas = this.tipoDescuentoGeneral(
          data.cuotas,
          data.porcentajeCuotas
        );
        m = (matr * tamanioMatricula).toFixed(2);
        c = (cuotas * tamanio).toFixed(2);
        d = parseFloat(m) + parseFloat(c);
        desc = d.toFixed(2);
        break;
      case 2: //cuotas
        var matri = this.tipoDescuentoGeneral(
          data.matricula,
          data.porcentajeGeneral
        );
        var tamaniocuotas = data.nroCuotas + data.cuotasAdicionales;
        var sindescuento = data.precio - data.matricula;
        var cuotas = this.tipoDescuentoGeneral(
          sindescuento / tamaniocuotas,
          data.porcentajeCuotas
        );
        c = (cuotas * tamaniocuotas).toFixed(2);
        d = matri + parseFloat(c);
        desc = d.toFixed(2);
        break;
      case 3: //ambos
        var tamanioMatricula = data.fraccionesMatricula;
        if (tamanioMatricula === 0) tamanioMatricula = 1;
        matr = this.tipoDescuentoGeneral(
          data.matricula / tamanioMatricula,
          data.porcentajeMatricula
        );
        var tamaniocuotas = data.nroCuotas + data.cuotasAdicionales;
        var sindescuento = data.precio - data.matricula;
        var cuotas = this.tipoDescuentoGeneral(
          sindescuento / tamaniocuotas,
          data.porcentajeCuotas
        );
        m = (matr * tamanioMatricula).toFixed(2);
        c = (cuotas * tamaniocuotas).toFixed(2);
        d = parseFloat(m) + parseFloat(c);
        desc = d.toFixed(2);
        break;
      case 4: //general
        matr = this.tipoDescuentoGeneral(
          data.matricula,
          data.porcentajeGeneral
        );
        var cuotas = this.tipoDescuentoGeneral(
          data.cuotas,
          data.porcentajeGeneral
        );
        c = (cuotas * data.nroCuotas).toFixed(2);
        d = matr + parseFloat(c);
        desc = d.toFixed(2);
        break;
      case 5: //Normal
        var va: any = this.tipoDescuentoGeneral(
          data.cuotas,
          data.porcentajeGeneral
        );
        desc = va.toFixed(2);
        break;
    }
    return parseFloat(desc);
  }

  tipoDescuentoGeneral(matricula: any, porcentaje: any) {
    var valor = parseFloat(matricula); //.toFixed(2);
    var porc = parseFloat(porcentaje);
    var d = (valor * porc) / 100; //.toFixed(2);
    var a = valor - d;
    var b = a; //.toFixed(2);
    return b;
  }
  configurarMontosTotales(data: any) {
    this.inputCostoTotal =
      data.precio.toFixed(2) + ' - ' + data.nombrePlural || null;
    this.inputCostoDescuento =
      this.precioDescuento.toFixed(2) + ' - ' + data.nombrePlural || null;
    let descuentoTotal: any = data.precio - this.precioDescuento;
    this.inputCostoDescuentoOtorgado =
      descuentoTotal.toFixed(2) + ' - ' + data.nombrePlural || null;
    this.formCronogramapago
      .get('idTipoDescuento')
      .setValue(
        this.tipoDescuentoFiltro.find((x) => x.id == data.idTipoDescuento)
      );
  }

  generarCronogramaPagos(data: any) {
    switch (data.formula) {
      case 0: //sin descuento
        if (this.esContado) {
          let tamanio = data.nroCuotas + data.cuotasAdicionales;
          this.generarGridNormal(data, tamanio);
        } else {
          if (this.esMontoPagoSeleccionado) {
            let tamanio = data.nroCuotas + data.cuotasAdicionales;
            this.generarGridNormal(data, tamanio);
          } else {
            this.generarGridSinDescuento(data);
          }
        }
        break;

      case 1: //matricula
        if (this.esContado) {
          let tamanio = data.nroCuotas + data.cuotasAdicionales;
          this.generarGridNormal(data, tamanio);
        } else {
          if (this.esMontoPagoSeleccionado) {
            this.generarGridCuotasAuxiliar(data);
          } else {
            this.generarGridMatricula(data);
          }
        }
        break;
      case 2: //cuotas
        if (this.esContado) {
          let tamanio = data.nroCuotas + data.cuotasAdicionales;
          this.generarGridNormal(data, tamanio);
        } else {
          if (this.esMontoPagoSeleccionado) {
            this.generarGridCuotasAuxiliar(data);
          } else {
            this.generarGridCuotas(data);
          }
        }
        break;

      case 3: //ambos
        if (this.esContado) {
          let tamanio = data.nroCuotas + data.cuotasAdicionales;
          this.generarGridNormal(data, tamanio);
        } else {
          if (this.esMontoPagoSeleccionado) {
            let tamanio = data.nroCuotas + data.cuotasAdicionales;
            this.generarGridCuotasAuxiliar(data);
          } else {
            this.generarGridAmbos(data);
          }
        }

        break;

      case 4: //general
        if (this.esContado) {
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

  generarGridNormal(data: any, tamanioCuotas: any) {
    let lista = [];

    let d = this.tipoDescuentoGeneral(
      data.cuotas / tamanioCuotas,
      data.fraccionesMatricula
    );

    for (let i = 0; i < tamanioCuotas; i++) {
      let currentDate = new Date();
      let hoy = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()} 12:00:00`;
      let obj: any = {};
      obj.Id = 0;
      obj.numeroCuota = i + 1;
      obj.cuotaDescripcion = 'Contado';
      obj.montoCuota = data.cuotas / tamanioCuotas;
      obj.fechaPago = new Date(hoy);
      obj.montoCuotaDescuento = d;
      obj.pagado = false;
      obj.matricula = true;
      obj.rowVersion = null;
      lista.push(obj);
    }
    this.setCronogramaPago(lista);
  }

  generarGridSinDescuento(data: any) {
    let tamanio = 0;
    let tamanioContador = 0;
    tamanio = data.nroCuotas;
    let numeroco = 1;
    let lista = [];
    let objeto: any = {};
    objeto.Id = 0;
    objeto.numeroCuota = numeroco;
    objeto.cuotaDescripcion = 'matricula ';
    objeto.montoCuota = data.matricula;

    let currentDate = new Date();
    let hoy = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()} 12:00:00`;

    objeto.fechaPago = new Date(hoy);

    let d = this.tipoDescuentoGeneral(data.matricula, data.fraccionesMatricula);
    objeto.montoCuotaDescuento = d;

    objeto.pagado = false;
    objeto.matricula = true;
    objeto.rowVersion = null;
    lista.push(objeto);

    for (let i = 0; i < tamanio; i++) {
      let obj: any = {};
      numeroco = numeroco + 1;
      tamanioContador = tamanioContador + 1;

      obj.Id = 0;
      obj.numeroCuota = numeroco;
      obj.cuotaDescripcion = 'Cuota - ' + (numeroco - 1);
      obj.montoCuota = data.cuotas;
      let d = this.tipoDescuentoGeneral(data.cuotas, data.fraccionesMatricula);
      obj.montoCuotaDescuento = d;

      obj.pagado = false;
      obj.rowVersion = null;
      obj.matricula = false;

      let fecha = this.calcularFechaInicial(data, i);
      obj.fechaPago = fecha;

      lista.push(obj);

      if (tamanioContador !== tamanio) {
        let mes = fecha.getMonth() + 1;
        if (data.cuotaDoble && (mes === 7 || mes === 12)) {
          let obj1: any = {};
          numeroco = numeroco + 1;
          obj1.Id = 0;
          obj1.numeroCuota = numeroco;
          obj1.cuotaDescripcion = 'Cuota - ' + (numeroco - 1);
          obj1.montoCuota = data.cuotas;

          let d1 = this.tipoDescuentoGeneral(
            data.cuotas,
            data.fraccionesMatricula
          );
          obj1.montoCuotaDescuento = d1;
          obj1.pagado = false;
          obj1.rowVersion = null;
          obj1.matricula = false;
          obj1.fechaPago = this.calcularFechaInicial(data, i);
          lista.push(obj1);
          tamanio = tamanio - 1;
        }
      }
    }
    this.setCronogramaPago(lista);
  }

  generarGridCuotasAuxiliar(data: any) {
    let numeroco = 1;
    let lista = [];
    let tamanio = 0;
    let tamanioContador = 0;
    tamanio = data.nroCuotas + data.cuotasAdicionales;

    let tamaniocuotas = tamanio;
    let sindescuento = data.precio - data.matricula;

    if (tamanio === 1 && data.matricula === 0) {
      let obj: any = {};
      obj.Id = 0;
      obj.numeroCuota = numeroco;
      obj.cuotaDescripcion = 'Contado';
      obj.montoCuota = data.cuotas; //$PrecioDescuento;
      let currentDate = new Date();
      let hoy = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()} 12:00:00`;
      obj.fechaPago = new Date(hoy);

      let d = this.tipoDescuentoGeneral(data.cuotas, data.porcentajeCuotas);
      obj.montoCuotaDescuento = d;

      obj.pagado = false;
      obj.matricula = false;
      obj.rowVersion = null;
      lista.push(obj);
    } else {
      numeroco = numeroco - 1;

      for (let i = 0; i < tamanio; i++) {
        if (numeroco === 0) {
          let obj: any = {};
          numeroco = numeroco + 1;
          tamanioContador = tamanioContador + 1;
          obj.Id = 0;
          obj.numeroCuota = numeroco;
          obj.cuotaDescripcion = 'matricula ' + numeroco;
          obj.montoCuota = data.cuotas;

          let d = this.tipoDescuentoGeneral(
            sindescuento / tamaniocuotas,
            data.porcentajeCuotas
          );
          obj.montoCuotaDescuento = d;

          obj.pagado = false;
          obj.rowVersion = null;
          obj.matricula = true;
          let fecha = this.calcularFechaInicial(data, i - 1);
          obj.fechaPago = fecha;
          lista.push(obj);
        } else {
          let obj: any = {};
          numeroco = numeroco + 1;
          tamanioContador = tamanioContador + 1;
          obj.Id = 0;
          obj.numeroCuota = numeroco;
          obj.cuotaDescripcion = 'Cuota - ' + numeroco;
          obj.montoCuota = data.cuotas;

          let d = this.tipoDescuentoGeneral(
            sindescuento / tamaniocuotas,
            data.porcentajeCuotas
          );
          obj.montoCuotaDescuento = d;

          obj.pagado = false;
          obj.rowVersion = null;
          obj.matricula = false;
          let fecha = this.calcularFechaInicial(data, i - 1);
          obj.fechaPago = fecha;
          lista.push(obj);

          if (tamanioContador !== tamanio) {
            let mes = fecha.getMonth() + 1;
            if (data.cuotaDoble && (mes === 7 || mes === 12)) {
              let obj1: any = {};
              numeroco = numeroco + 1;
              obj1.Id = 0;
              obj1.numeroCuota = numeroco;
              obj1.cuotaDescripcion = 'Cuota - ' + numeroco;
              obj1.montoCuota = data.cuotas;

              let d = this.tipoDescuentoGeneral(
                sindescuento / tamaniocuotas,
                data.porcentajeCuotas
              );
              obj1.montoCuotaDescuento = d;
              obj1.pagado = false;
              obj1.rowVersion = null;
              obj1.matricula = false;
              obj1.fechaPago = this.calcularFechaInicial(data, i - 1);
              lista.push(obj1);
              tamanio = tamanio - 1;
            }
          }
        }
      }
    }
    this.setCronogramaPago(lista);
  }

  setCronogramaPago(data: any) {
    this.setCronogramaPagoGeneral(data);
  }
  setCronogramaPagoGeneral(data: any) {
    //Aqui todo para la grilla
    //console.log("armar grilla")
    //console.log(data);
    this.gridCronogramaPago.data = data;
    this.total = aggregateBy(this.gridCronogramaPago.data, this.aggregates);
    if (this.precioDescuento == this.total['montoCuotaDescuento'].sum) {
      this.cuadraSumatoria = true;
    } else {
      this.cuadraSumatoria = false;
    }
  }
  calcularFechaInicial(objeto: any, i: any) {
    let myDate = new Date();

    let mes = myDate.getMonth();
    let contador = i + 1;
    myDate.setMonth(mes + contador);
    myDate.setHours(12);
    myDate.setMinutes(0);
    myDate.setSeconds(0);

    return myDate;
  }
  generarGridMatricula(data: any) {
    let numeroco = 1;
    let lista = [];

    //matriculas///////////////////////////////////////////////////7
    let tamanioMatricula = 0;
    tamanioMatricula = data.fraccionesMatricula;
    if (tamanioMatricula === 0) tamanioMatricula = 1;

    for (let j = 0; j < tamanioMatricula; j++) {
      let obj: any = {};
      obj.Id = 0;
      obj.numeroCuota = numeroco;
      obj.cuotaDescripcion = 'matricula ' + numeroco;
      obj.montoCuota = data.matricula;
      let currentDate = new Date();
      let hoy = `${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()} 12:00:00`;
      obj.fechaPago = new Date(hoy);

      let d = this.tipoDescuentoGeneral(
        data.matricula / tamanioMatricula,
        data.porcentajeMatricula
      );
      obj.montoCuotaDescuento = d;

      obj.pagado = false;
      obj.matricula = true;
      obj.rowVersion = null;
      lista.push(obj);
      numeroco = numeroco + 1;
    }

    /////cuotas///////////////////////////////////////////////////
    let tamanioContador = 0;
    let tamanio = data.nroCuotas;
    numeroco = numeroco - 1;
    let tamaniocuotas = tamanio;
    for (let i = 0; i < tamanio; i++) {
      let obj: any = {};
      numeroco = numeroco + 1;
      tamanioContador = tamanioContador + 1;
      obj.Id = 0;
      obj.numeroCuota = numeroco;
      obj.cuotaDescripcion = 'Cuota - ' + numeroco;
      obj.montoCuota = data.cuotas;

      let d = this.tipoDescuentoGeneral(data.cuotas, data.porcentajeCuotas);
      obj.montoCuotaDescuento = d;

      obj.pagado = false;
      obj.rowVersion = null;
      obj.matricula = false;
      let fecha = this.calcularFechaInicial(data, i);
      obj.fechaPago = fecha;
      lista.push(obj);

      if (tamanioContador !== tamanio) {
        let mes = fecha.getMonth() + 1;
        if (data.cuotaDoble && (mes === 7 || mes === 12)) {
          let obj1: any = {};
          numeroco = numeroco + 1;
          obj1.Id = 0;
          obj1.numeroCuota = numeroco;
          obj1.cuotaDescripcion = 'Cuota - ' + numeroco;
          obj1.montoCuota = data.cuotas;

          let d = this.tipoDescuentoGeneral(data.cuotas, data.porcentajeCuotas);
          obj1.montoCuotaDescuento = d;
          obj1.pagado = false;
          obj1.rowVersion = null;
          obj1.matricula = false;
          obj1.fechaPago = this.calcularFechaInicial(data, i);
          lista.push(obj1);
          tamanio = tamanio - 1;
        }
      }
    }
    this.setCronogramaPago(lista);
  }

  generarGridCuotas(data: any) {
    let tamanio = 0;
    let tamanioContador = 0;
    tamanio = data.nroCuotas;
    let numeroco = 1;
    let lista = [];
    let obj: any = {};
    obj.Id = 0;
    obj.numeroCuota = numeroco;
    obj.cuotaDescripcion = 'matricula ';
    obj.montoCuota = data.matricula;
    let currentDate = new Date();
    let hoy = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()} 12:00:00`;
    obj.fechaPago = new Date(hoy);

    let d = this.tipoDescuentoGeneral(data.matricula, data.fraccionesMatricula);
    obj.montoCuotaDescuento = d;

    obj.pagado = false;
    obj.matricula = true;
    obj.rowVersion = null;
    lista.push(obj);

    /////cuotas///////////////////////////////////////////////////
    tamanio = 0;
    tamanioContador = 0;
    tamanio = data.nroCuotas + data.cuotasAdicionales;
    let tamaniocuotas = tamanio;
    let sindescuento = data.precio - data.matricula;
    for (let i = 0; i < tamanio; i++) {
      let obj: any = {};
      numeroco = numeroco + 1;
      tamanioContador = tamanioContador + 1;
      obj.Id = 0;
      obj.numeroCuota = numeroco;
      obj.cuotaDescripcion = 'Cuota - ' + numeroco;
      obj.montoCuota = data.cuotas;

      let d = this.tipoDescuentoGeneral(
        sindescuento / tamaniocuotas,
        data.porcentajeCuotas
      );
      obj.montoCuotaDescuento = d;

      obj.pagado = false;
      obj.rowVersion = null;
      obj.matricula = false;
      let fecha = this.calcularFechaInicial(data, i);
      obj.fechaPago = fecha;
      lista.push(obj);

      if (tamanioContador !== tamanio) {
        let mes = fecha.getMonth() + 1;
        if (data.cuotaDoble && (mes === 7 || mes === 12)) {
          let obj1: any = {};
          numeroco = numeroco + 1;
          obj1.Id = 0;
          obj1.numeroCuota = numeroco;
          obj1.cuotaDescripcion = 'Cuota - ' + numeroco;
          obj1.montoCuota = data.cuotas;

          let d = this.tipoDescuentoGeneral(
            sindescuento / tamaniocuotas,
            data.porcentajeCuotas
          );
          obj1.montoCuotaDescuento = d;
          obj1.pagado = false;
          obj1.rowVersion = null;
          obj1.matricula = false;
          obj1.fechaPago = this.calcularFechaInicial(data, i);
          lista.push(obj1);
          tamanio = tamanio - 1;
        }
      }
    }
    this.setCronogramaPago(lista);
  }

  generarGridAmbos(data: any) {
    let numeroco = 1;
    let lista = [];
    //matriculas///////////////////////////////////////////////////
    let tamanioMatricula = 0;
    tamanioMatricula = data.fraccionesMatricula;

    if (tamanioMatricula === 0) tamanioMatricula = 1;
    for (let j = 0; j < tamanioMatricula; j++) {
      let obj: any = {};
      obj.Id = 0;
      obj.numeroCuota = numeroco;
      obj.cuotaDescripcion = 'matricula ' + numeroco.toString();
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

      let d = this.tipoDescuentoGeneral(
        data.matricula / tamanioMatricula,
        data.porcentajeMatricula
      );
      obj.montoCuotaDescuento = d;

      obj.pagado = false;
      obj.matricula = true;
      obj.rowVersion = null;
      lista.push(obj);
      numeroco = numeroco + 1;
    }

    /////cuotas///////////////////////////////////////////////////
    let tamanio = 0;
    let tamanioContador = 0;
    tamanio = data.nroCuotas + data.cuotasAdicionales;
    numeroco = numeroco - 1;
    let tamaniocuotas = tamanio;
    let sindescuento = data.precio - data.matricula;

    for (let i = 0; i < tamanio; i++) {
      let obj: any = {};
      numeroco = numeroco + 1;
      tamanioContador = tamanioContador + 1;
      obj.Id = 0;
      obj.numeroCuota = numeroco;
      obj.cuotaDescripcion = 'Cuota - ' + numeroco;
      obj.montoCuota = data.cuotas;

      let d = this.tipoDescuentoGeneral(
        sindescuento / tamaniocuotas,
        data.porcentajeCuotas
      );
      obj.montoCuotaDescuento = d;

      obj.pagado = false;
      obj.rowVersion = null;
      obj.matricula = false;
      let fecha = this.calcularFechaInicial(data, i);
      obj.fechaPago = fecha;
      lista.push(obj);

      if (tamanioContador !== tamanio) {
        let mes = fecha.getMonth() + 1;
        if (data.cuotaDoble && (mes === 7 || mes === 12)) {
          let obj1: any = {};
          numeroco = numeroco + 1;
          obj1.Id = 0;
          obj1.numeroCuota = numeroco;
          obj1.cuotaDescripcion = 'Cuota - ' + numeroco.toString();
          obj1.montoCuota = data.cuotas;

          let d = this.tipoDescuentoGeneral(
            sindescuento / tamaniocuotas,
            data.porcentajeCuotas
          );
          obj1.montoCuotaDescuento = d;
          obj1.pagado = false;
          obj1.rowVersion = null;
          obj1.matricula = false;
          obj1.fechaPago = this.calcularFechaInicial(data, i);
          lista.push(obj1);
          tamanio = tamanio - 1;
        }
      }
    }
    this.setCronogramaPago(lista);
  }
  generarGridGeneral(data: any) {
    let tamanio = 0;
    let tamanioContador = 0;
    tamanio = data.nroCuotas;
    let numeroco = 1;
    let lista = [];
    let obj: any = {};
    obj.Id = 0;
    obj.numeroCuota = numeroco;
    obj.cuotaDescripcion = 'matricula ';
    obj.montoCuota = data.matricula;
    let currentDate = new Date();
    let hoy = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }-${currentDate.getDate()} 12:00:00`;
    obj.fechaPago = new Date(hoy);

    let d = this.tipoDescuentoGeneral(data.matricula, data.porcentajeGeneral);
    obj.montoCuotaDescuento = d;

    obj.pagado = false;
    obj.matricula = true;
    obj.rowVersion = null;
    lista.push(obj);

    for (let i = 0; i < tamanio; i++) {
      let obj: any = {};
      numeroco = numeroco + 1;
      tamanioContador = tamanioContador + 1;
      obj.Id = 0;
      obj.numeroCuota = numeroco;
      obj.cuotaDescripcion = 'Cuota - ' + (numeroco - 1);
      obj.montoCuota = data.cuotas;

      let d = this.tipoDescuentoGeneral(data.cuotas, data.porcentajeGeneral);
      obj.montoCuotaDescuento = d;

      obj.pagado = false;
      obj.rowVersion = null;
      obj.matricula = false;
      let fecha = this.calcularFechaInicial(data, i);
      obj.fechaPago = fecha;
      lista.push(obj);

      if (tamanioContador !== tamanio) {
        let mes = fecha.getMonth() + 1;
        if (data.cuotaDoble && (mes === 7 || mes === 12)) {
          let obj1: any = {};
          numeroco = numeroco + 1;
          obj1.Id = 0;
          obj1.numeroCuota = numeroco;
          obj1.cuotaDescripcion = 'Cuota - ' + (numeroco - 1);
          obj1.montoCuota = data.cuotas;

          let d = this.tipoDescuentoGeneral(
            data.cuotas,
            data.porcentajeGeneral
          );
          obj1.montoCuotaDescuento = d;
          obj1.pagado = false;
          obj1.rowVersion = null;

          obj1.matricula = false;
          obj1.fechaPago = this.calcularFechaInicial(data, i);
          lista.push(obj1);
          tamanio = tamanio - 1;
        }
      }
    }

    this.setCronogramaPago(lista);
  }

  filtrarTipoDescuento(value: string) {
    this.tipoDescuentoFiltro = this.tipoDescuentoFiltroAux.filter(
      (x: ITipoDescuentoCronograma) =>
        x.codigo.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  filtrarMedioPago(value: string) {
    this.dataMedioPago = this.dataMedioPagoAux.filter(
      (x: IPasarelaPago) =>
        x.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  filtrarMontoPago(value: string) {
    this.montoPagoFiltro = this.montoPagoFiltroAux.filter(
      (x: IMontoPagoCronograma) =>
        x.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  filtrarMontosPagoPorDescuento(tipoDescuento: any) {
    // Si el tipo de descuento no tiene información o no tiene porcentajes, mostrar todos
    if (!tipoDescuento) {
      this.montoPagoFiltro = this.montoPagoFiltroAux;
      return;
    }

    // Verificar si algún porcentaje es mayor al 20%
    const porcentajeMayorA20 =
      (tipoDescuento.porcentajeGeneral &&
        tipoDescuento.porcentajeGeneral > 20) ||
      (tipoDescuento.porcentajeMatricula &&
        tipoDescuento.porcentajeMatricula > 20) ||
      (tipoDescuento.porcentajeCuotas && tipoDescuento.porcentajeCuotas > 20);

    if (porcentajeMayorA20) {
      // Filtrar solo los que contengan "Crédito" en el nombre
      this.montoPagoFiltro = this.montoPagoFiltroAux.filter(
        (x: IMontoPagoCronograma) =>
          x.nombre.toLowerCase().includes('crédito') ||
          x.nombre.toLowerCase().includes('credito')
      );
    } else {
      this.montoPagoFiltro = this.montoPagoFiltroAux;
    }

    if (this.montoPagoFiltro.length > 0) {
      this.formCronogramapago
        .get('idMontosPago')
        .setValue(this.montoPagoFiltro[0]);
    } else {
      this.formCronogramapago.get('idMontosPago').setValue(null);
    }
  }

  filtrarAsignarCuota(value: string) {
    this.dataAsignacionCuota = this.dataAsignacionCuotaAux.filter(
      (x: any) => x.Nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  modificacionEnGrilla(celda: any) {
    if (celda.numeroCuota > 0) {
      let lista: any[] = [];
      let gridRegistros = this.gridCronogramaPago.data;
      let contador = 0;
      let ano: any;
      let mes: any;
      let dia: any;
      gridRegistros.forEach((element) => {
        let obj: any = {};
        var myDate = new Date();
        obj.id = element.id;
        obj.numeroCuota = element.numeroCuota;
        obj.montoCuota = element.montoCuota;
        obj.cuotaDescripcion = element.cuotaDescripcion;

        obj.montoCuotaDescuento = element.montoCuotaDescuento;
        obj.matricula = element.matricula;
        obj.pagado = element.pagado;
        obj.rowVersion = element.rowVersion;
        if (celda.numeroCuota === element.numeroCuota) {
          ano = element.fechaPago.getFullYear();
          mes = element.fechaPago.getMonth();
          dia = element.fechaPago.getDate();
        }
        if (element.numeroCuota > celda.numeroCuota) {
          contador = contador + 1;

          myDate.setFullYear(ano, mes + contador, dia);
          myDate.setHours(12);
          myDate.setMinutes(0);
          myDate.setSeconds(0);
          let fecha = myDate;
          obj.fechaPago = fecha;
        } else {
          obj.fechaPago = element.fechaPago;
        }
        lista.push(obj);
      });
      //console.log(lista);
      this.setCronogramaPago(lista);
    }
  }
  modificacionFechaEnGrilla(fechaNueva: any, celda: any) {
    celda.fechaPago = fechaNueva;
    this.modificacionEnGrilla(celda);
  }

  dividirCuota() {
    let lista: any[] = [];
    let gridRegistros = this.gridCronogramaPago.data;
    let nroSubCuotasNuevas = this.formSubCuotas.get('nroSubCuotas').value + 1;

    let contNumeroCuota = 0;
    let contadorCuota = 0;
    let contadorMatricula = 0;
    let currentDate = this.cuotaActualFraccionar.fechaPago;
    let auxDate = currentDate;
    let day = currentDate.getDate();
    let month = currentDate.getMonth();
    gridRegistros.forEach((element) => {
      let obj: any = {};

      if (this.cuotaActualFraccionar.numeroCuota === element.numeroCuota) {
        for (let i = 1; i <= nroSubCuotasNuevas; i++) {
          let obj_aux: any = {};
          obj_aux.Id = element.Id;
          contNumeroCuota = contNumeroCuota + 1;
          var montoAux = this.cuotaActualFraccionar.montoCuotaDescuento;
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
        if (element.numeroCuota > this.cuotaActualFraccionar.numeroCuota) {
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
    this.setCronogramaPagoGeneral(lista);
    this.limpiarModalFraccionar();
  }
  eliminarCuota() {
    let lista: any[] = [];
    let gridRegistros = this.gridCronogramaPago.data;
    let asignarCuota = this.formEliminarCuota.get('asignarACuota').value.Valor;
    let montoCuota = this.formEliminarCuota.get('monto').value;
    let auxMontoCuota = parseFloat(montoCuota);
    let contNumeroCuota = 0;
    let contadorCuota = 0;
    let contadorMatricula = 0;

    let currentDate = this.cuotaActualFraccionar.fechaPago;
    let day = currentDate.getDate();

    gridRegistros.forEach((element) => {
      let obj: any = {};
      contNumeroCuota = contNumeroCuota + 1;
      if (this.cuotaActualFraccionar.numeroCuota === element.numeroCuota) {
        contNumeroCuota = contNumeroCuota - 1;
      } else if (asignarCuota === element.numeroCuota) {
        obj.Id = element.Id;
        if (element.matricula === 1 || element.matricula === true) {
          contadorMatricula = contadorMatricula + 1;
          obj.montoCuota = element.montoCuota + auxMontoCuota;
          obj.cuotaDescripcion = 'matricula ' + contadorMatricula;
          obj.fechaPago = this.fechaCronograma(contNumeroCuota - 1, day);
          obj.montoCuotaDescuento = element.montoCuotaDescuento + montoCuota;
          obj.matricula = true;
        } else {
          contadorCuota = contadorCuota + 1;
          obj.montoCuota = element.montoCuota + auxMontoCuota;
          obj.cuotaDescripcion = 'Cuota - ' + contadorCuota;
          obj.fechaPago = this.fechaCronograma(contNumeroCuota - 1, day);
          obj.montoCuotaDescuento = element.montoCuotaDescuento + montoCuota;
          obj.matricula = false;
        }
        obj.numeroCuota = contNumeroCuota;
        obj.pagado = false;
        obj.rowVersion = null;

        lista.push(obj);
      } else {
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
        if (element.numeroCuota >= this.cuotaActualFraccionar.numeroCuota) {
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
    this.setCronogramaPagoGeneral(lista);
    this.limpiarModalEliminar();
  }
  abrirModalFraccionar(celda: any) {
    this.cuotaActualFraccionar = celda;
    this.modalRef = this.modalService.open(this.modalFraccionarCuota, {
      size: 'small',
      animation: true,
    });
  }

  abrirModalEliminar(celda: any) {
    this.cuotaActualFraccionar = celda;
    this.modalRef = this.modalService.open(this.modalEliminarCuota, {
      size: 'small',
      animation: true,
    });
    let objCuotas: any[] = [];
    let gridRegistros = this.gridCronogramaPago.data;
    gridRegistros.forEach((element) => {
      let obj: any = {};
      if (this.cuotaActualFraccionar.numeroCuota !== element.numeroCuota) {
        obj.Nombre = element.cuotaDescripcion;
        obj.Valor = element.numeroCuota;
        objCuotas.push(obj);
      }
    });
    this.dataAsignacionCuota = objCuotas;
    this.dataAsignacionCuotaAux = objCuotas;
    this.formEliminarCuota
      .get('monto')
      .setValue(this.cuotaActualFraccionar.montoCuotaDescuento);
  }

  fechaCronograma(i: any, dia: any) {
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
    this.modalRef.close();
  }
  limpiarModalEliminar() {
    this.formEliminarCuota.get('monto').setValue(null);
    this.formEliminarCuota.get('asignarACuota').setValue(null);
    this.modalRef.close();
  }
  guardarCronograma() {
    if (this.flagChangeMontoPago == 0) {
      this.dataGrillaMontoPago =
        this.formCronogramapago.get('idMontosPago').value;
    }
    this.estadoMensaje = '';
    if (this.estadoGuardado == 0) {
      this.estadoGuardado = 1;
      if (!this.cuadraSumatoria) {
        alert('Los Montos deben coincidir');
        this.estadoGuardado = 0;
        return;
      }
      let obj: any = {};
      this.estadoMensaje = 'Guardando ...';
      if (this.dataCronogramaServicios !== null) {
        obj.id = this.dataCronogramaServicios.id;
        obj.idOportunidad = this.rowActual.idOportunidad;
        obj.idPersonal = this.rowActual.idPersonal_Asignado;
        obj.idTipoDescuento = this.dataGrillaMontoPago.idTipoDescuento;
        obj.precio = this.dataGrillaMontoPago.precio;
        obj.IdMoneda = this.dataGrillaMontoPago.idMoneda;
        obj.nombrePlural = this.dataGrillaMontoPago.nombrePlural;
        obj.precioDescuento = this.precioDescuento;
        obj.idMontoPago = this.dataGrillaMontoPago.id;
        obj.matriculaEnProceso = 0;
        if (this.agendaService.esCoordinadora$) {
          obj.esAprobado = true;
        } else {
          obj.esAprobado = false;
        }
        obj.formula = this.dataGrillaMontoPago.formula;
        obj.codigoMatricula = '';
        obj.rowVersion = this.dataGrillaMontoPago.rowVersion;
      } else {
        obj.Id = 0;
        obj.IdOportunidad = this.rowActual.idOportunidad;
        obj.IdPersonal = this.rowActual.idPersonal_Asignado;
        obj.IdTipoDescuento = this.dataGrillaMontoPago.idTipoDescuento;
        obj.Precio = this.dataGrillaMontoPago.precio;
        obj.IdMoneda = this.dataGrillaMontoPago.idMoneda;
        obj.PrecioDescuento = this.precioDescuento;
        obj.NombrePlural = this.dataGrillaMontoPago.nombrePlural;
        obj.IdMontoPago = this.dataGrillaMontoPago.id;
        obj.MatriculaEnProceso = 0;
        if (this.agendaService.esCoordinadora$) {
          obj.EsAprobado = true;
        } else {
          obj.EsAprobado = false;
        }
        obj.Formula = this.dataGrillaMontoPago.formula;
        obj.CodigoMatricula = '';
        obj.rowVersion = null;
      }

      let listaCronograma = this.gridCronogramaPago.data;
      obj.ListaDetalleCuotas = listaCronograma;
      obj.Usuario = this.agendaService.userName;
      obj.IdPersonal = this.rowActual.idPersonal_Asignado;
      obj.IdMedioPago =
        this.formCronogramapago.get('idMedioPago').value == null
          ? 0
          : this.formCronogramapago.get('idMedioPago').value.id;

      this.agendaService.agendaCronogramaPagoService
        .guardarCronogramaPago$(
          this.rowActual.idOportunidad,
          this.rowActual.idAlumno,
          obj
        )
        .subscribe({
          next: (response: any) => {
            this.estadoGuardado = 0;
            this.dataCronogramaServicios = response.cronograma;
            if (this.agendaService.esCoordinadora$) {
              this.cronogramaAprobado = true;
              this.agendaService.agendaCronogramaPagoService.cronogramaAprobado$.next(
                true
              );
              this.vistaPortal = response.vistaPortalWeb;
              this.estadoMensaje = 'El Cronograma se Aprobo Correctamente.';
              this.alertaService.notificationSuccess(
                'El Cronograma se Aprobo Correctamente.'
              );
              this.formCronogramapago.get('idTipoDescuento').disable();
              this.formCronogramapago.get('idMontosPago').disable();
              this.btnAprobar.disabled = true;
              this.btnVerCronogramaPortal.disabled = true;
              this.btnEnviarSMS.show = true;
            } else {
              this.estadoMensaje = 'Se Guardo Correctamente.';
            }
            if (response.idMatriculaCabecera > 0) {
            }
            this.agendaService.agendaCronogramaPagoService
              .congelarCronogramaAlumno$(
                response.body.cronograma.id,
                this.agendaService.userName
              )
              .subscribe({
                next: (respuesta: any) => {
                  //console.log("Se congela cronograma");
                },
              });
          },
          error: (error) => {
            if (this.agendaService.esCoordinadora$) {
              this.estadoMensaje = 'No se pudo Aprobar el Cronograma.....';
            } else {
              this.estadoMensaje = 'No se pudo Guardar.....';
            }
            this.estadoGuardado = 0;
            this.alertaService.notificationError(error.error);
          },
        });
    }
  }
  visualizarPortal() {
    this.verVistaPortal = true;
  }
  eliminarCronograma() {
    if (!this.cuadraSumatoria) {
      alert('Los Montos deben coincidir');
      return;
    }
    this.estadoMensaje = 'Eliminando ...';
    let obj: any = {};
    if (this.dataCronogramaServicios !== null) {
      obj.Id = this.dataCronogramaServicios.id;
      obj.IdOportunidad = this.rowActual.idOportunidad;
      obj.IdPersonal = this.rowActual.idPersonal_Asignado;
      obj.IdTipoDescuento = this.dataGrillaMontoPago.idTipoDescuento;
      obj.Precio = this.dataGrillaMontoPago.precio;
      obj.IdMoneda = this.dataGrillaMontoPago.idMoneda;
      obj.NombrePlural = this.dataGrillaMontoPago.nombrePlural;
      obj.PrecioDescuento = this.precioDescuento;
      obj.IdMontoPago = this.dataGrillaMontoPago.id;
      obj.MatriculaEnProceso = 0;
      obj.EsAprobado = false;
      obj.Formula = this.dataGrillaMontoPago.formula;
      obj.CodigoMatricula = '';
      obj.rowVersion = this.dataGrillaMontoPago.rowVersion;
    } else {
      obj.Id = 0;
      obj.IdOportunidad = this.rowActual.idOportunidad;
      obj.IdPersonal = this.rowActual.idPersonal_Asignado;
      obj.IdTipoDescuento = this.dataGrillaMontoPago.idTipoDescuento;
      obj.Precio = this.dataGrillaMontoPago.precio;
      obj.IdMoneda = this.dataGrillaMontoPago.idMoneda;
      obj.PrecioDescuento = this.precioDescuento;
      obj.NombrePlural = this.dataGrillaMontoPago.nombrePlural;
      obj.IdMontoPago = this.dataGrillaMontoPago.id;
      obj.MatriculaEnProceso = 0;
      obj.EsAprobado = false;
      obj.Formula = this.dataGrillaMontoPago.formula;
      obj.CodigoMatricula = '';
      obj.rowVersion = null;
    }
    let listaCronograma = this.gridCronogramaPago.data;
    obj.ListaDetalleCuotas = listaCronograma;
    obj.Usuario = this.agendaService.userName;
    obj.IdPersonal = this.rowActual.idPersonal_Asignado;
    this.agendaService.agendaCronogramaPagoService
      .eliminarCronogramaVentas$(this.rowActual.idAlumno, obj)
      .subscribe({
        // this.agendaService.agendaCronogramaPagoService.eliminarCronogramaPago$(this.rowActual.idOportunidad,this.rowActual.idAlumno, obj).subscribe({
        next: (response: any) => {
          this.dataCronogramaServicios = response.cronograma;
          this.estadoMensaje = 'Se Elimino el cronograma.';
          this.btnElimnar.show = false;
          this.btnEnviarSMS = false;
          this.btnAprobar.disabled = true;
          this.btnVerCronogramaPortal.disabled = true;
          this.formCronogramapago.get('idTipoDescuento').enable();
          this.formCronogramapago.get('idMontosPago').enable();
        },
        error: (error: any) => {
          if (error.status == 409) {
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se puedo realizar la eliminacion',
              text: 'El alumno ya se encuentra en estado matriculado',
            });
          }
          this.estadoMensaje = 'No se pudo realizar la eliminacion.';
        },
      });
  }
  actualizarMetodoPago() {
    if (this.metodoPagoIdMatriculaCabecera > 0) {
      let obj: IMetodoPagoMatricula;

      obj.idMatriculaCabecera = this.metodoPagoIdMatriculaCabecera;
      obj.idMedioPago = this.formCronogramapago.get('idMedioPago').value.id;
      obj.activo = true;
      obj.usuario = this.agendaService.userName;
      this.agendaService.agendaCronogramaPagoService
        .actualizarMedioPago$(obj)
        .subscribe({
          next: (response: any) => {
            if (response) {
              alert('Exitoso!! Se actualizo el metodo de pago. ');
            } else {
              alert('Error!! El metodo de pago ya se encuentra actualiado. ');
            }
          },
        });
    } else {
      alert('Error!! No se tiene el id de la matricula ');
    }
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

  abrirModalTransacciones(e: any) {
    this.loaderModalTransPagos = true;
    this.grillaModalTransaccionesPagos = '';
    let params: any;
    params = {
      idMontoPagoCronograma: e.idMontoPagoCronograma,
      nroCuota: e.numeroCuota,
    };
    this.integraService
      .obtenerPorFiltro(
        constApiFinanzas.ObtenerDetalleMatriculaTransaccionAuditoria,
        params
      )
      .subscribe({
        next: (response: any) => {
          console.log('Detalle Transacción:', response);
          if (response.body != null) {
            this.modalRefTransaccionesPagos = this.modalService.open(
              this.modalTransaccionesPagos,
              { size: 'xl' }
            );
            this.grillaModalTransaccionesPagos = response.body;
            this.loaderModalTransPagos = false;
          } else {
            this.mostrarMensajeTransacciones();
            this.loaderModalTransPagos = false;
          }
        },
        error: () => {
          this.mostrarMensajeTransacciones();
          this.loaderModalTransPagos = false;
        },
      });
  }

  mostrarMensajeTransacciones() {
    this.alertaService.mensajeIcon('', 'El pago está pendiente', null);
  }
  obtenerDescuentoProfiling(email: string) {
    this.descuentoProfilingAprobado = false;
    this.cuponDescuentoProfiling = undefined;
    var parametros: any[] = [{ clave: 'EmailUsuario', valor: email }];
    this.integraService
      .obtenerPorPathParams(
        constApiMarketing.ObtenerDescuentoProfiling,
        parametros
      )
      .subscribe({
        next: (response: any) => {
          if (response.body != null) {
            this.descuentoProfilingAprobado = true;
            this.cuponDescuentoProfiling = response.body;
          }
        },
        error: (error) => {},
        complete: () => {},
      });
  }
}

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiComercial } from '@environments/constApi';
import {
  datePipeTransform,
  getFechaFin,
  getFechaInicio,
} from '@shared/functions/date-pipe';
import { IKendoPivotGrid } from '@shared/models/interfaces/ikendo-pivot-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import { IntegraService } from '@shared/services/integra.service';
import {
  ConteoDatosFasePais,
  ControlCambioFase,
  ControlOportunidadPredictiva,
  IActividadEjecutadaFaseActual,
  IActividadVencidaPorTab,
  IAcumuladoTiempoContactoEfectivo,
  ICalidadProcesamientoAlterno,
  IComboAsesor,
  IComboReporteCambioFase,
  IControlCambioFase,
  IEjecutadaSinCambioFase,
  IFormFiltro,
  ILlamadaObservada,
  IReporteCalidadProcesamientoCambioFase,
  IReporteCambioFase,
  IReporteCambioFaseOportunidad,
  IReporteConteoDatosFase,
  IReporteTasaCambio,
  IReporteTasaCambioPredictivo,
  IReporteTasaContacto,
  IReporteTasaContactoAmbos,
  IReporteTasaContactoConySinLlamada,
  ItemConteoFasePais,
  ReporteTasaCambio,
  ReporteTasaCambioPredictivo,
  ReporteV2Integra,
} from '../../models/interfaces/ireporte-cambio-fase-3cx';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';
import { RowClassArgs } from '@progress/kendo-angular-grid';

/**
 * @module ComercialModule
 * @description Reporte de cambios de fase integra -3cx
 * @author Marco Villanueva
 * @author Flavio R. Mamani Fabian
 * @version 1.0.1
 * @history
 * * 01/12/2023 Configuracion de llamadas 3cx y nueva fase BNC-1
 */
@Component({
  selector: 'app-reporte-cambio-fase-tres-cx',
  templateUrl: './reporte-cambio-fase-tres-cx.component.html',
  styleUrls: ['./reporte-cambio-fase-tres-cx.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteCambioFaseTresCxComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private integraReplicaService: IntegraReplicaService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private userService: UserService,
  ) {}

  public rowCallback = (context: RowClassArgs) => {
    if (context.dataItem.caso =='Reprogramacion manual mayor a 1 min') {
       return { gold: true };
    } else if (context.dataItem.caso =='Reprogramacion automatica mayor a 1 min'){
       return { green: true };
    } else if (context.dataItem.caso =='Reprogramacion automatica mayor o igual a 30 seg y menor o igual a 1 min'){
      return { green: true };
    } else if (context.dataItem.caso =='Ejecutada menor a 1 min sin cambio de fase'){
      return { blue: true };
    } else if (context.dataItem.caso =='Ejecutada menor a 1 min con cambio de fase'){
      return { blue: true };
    } else if (context.dataItem.caso =='Ejecutada de 1 a 2 mins sin cambio de fase'){
      return { red: true };
    } else if (context.dataItem.caso =='Ejecutada de 1 a 2 mins con cambio de fase'){
      return { red: true };
    } else if (context.dataItem.caso =='Ejecutada de 8 a 12 mins sin cambio de fase'){
      return { orange: true };
    } else if (context.dataItem.caso =='Ejecutada mayor a 12 mins sin cambio de fase'){
      return { brown: true };
    }
    return { blue: true };
  };
  public rowCallback2 = (context: RowClassArgs) => {
    if (context.dataItem.descripcion =='Actividades Totales' || context.dataItem.descripcion =='Tiempo Util') {
       return { white: true };
    }
    return { other: true };
  };

  formFiltroCambioFase: FormGroup = this.formBuilder.group({
    asesores: [null],
    centroCosto: [[]],
    estadoPersonal: [1],
    fechaInicio: [getFechaInicio()],
    fechaFin: [getFechaFin()],
    acumulado: [true],
  });

  virtual: any = {
    itemHeight: 28,
  };

  gridTasaContacto: KendoGrid = new KendoGrid();
  gridTasaContactoOtroMedio: KendoGrid = new KendoGrid();
  gridTasaContactoV2: KendoGrid = new KendoGrid();
  gridTasaFaseFinal: KendoGrid = new KendoGrid();

  gridControlActividades: KendoGrid = new KendoGrid();
  gridTasaConversion: KendoGrid = new KendoGrid();
  gridTasaConversionPredictiva: KendoGrid = new KendoGrid();
  gridControl: KendoGrid = new KendoGrid();
  gridControlRN: KendoGrid = new KendoGrid();
  gridRN5: KendoGrid = new KendoGrid();
  gridOM: KendoGrid = new KendoGrid();
  gridActividadesVencidas: KendoGrid = new KendoGrid();
  gridConteoDatosFase: KendoGrid = new KendoGrid();
  gridConteoDatosFaseAlterno: KendoGrid = new KendoGrid();
  gridControlCambiodeFase: KendoGrid = new KendoGrid();
  gridActividadEjecutadaSinCambioFase: KendoGrid = new KendoGrid();
  gridCalidadProcesamiento: KendoGrid = new KendoGrid();
  gridDiferenciaLlamadasBloque: KendoGrid = new KendoGrid();
  gridActividadesinLlamadaRegistrada: KendoGrid = new KendoGrid();
  gridActividadesPorOtroMedio: KendoGrid= new KendoGrid();
  gridControlOportunidadPredictiva: KendoGrid = new KendoGrid();

  gridLlamadaObservada = new KendoGrid();
  gridLlamadaObservadaDuracionAtipica = new KendoGrid();
  gridActividadEjecutadaFaseActual = new KendoGrid();
  gridAcumuladoLlamadas = new KendoGrid();
  gridAcumuladoTiempoContacto = new KendoGrid();

  columnGridActividadesVencidas: any[] = [];

  sourceAsesores: Array<IComboAsesor> = [];
  asesorFiltro: Array<IComboAsesor> = [];
  dataCentroCosto: Array<{ id: number; nombre: string }> = [];
  dataCentroCostoFiltro: Array<{ id: number; nombre: string }> = [];

  fechaConteoInicio: Date;
  fechaConteoMomento: Date;

  fechaConteoInicioPeru: Date;
  fechaConteoInicioColombia: Date;
  fechaConteoInicioMexico: Date;
  fechaConteoInicioChile: Date;
  fechaConteoInicioWhatsapp: Date;
  fechaConteoInicioOtros: Date;
  fechaConteoInicioTotal: Date;
  fechaConteoMomentoPeru: Date;
  fechaConteoMomentoColombia: Date;
  fechaConteoMomentoMexico: Date;
  fechaConteoMomentoChile: Date;
  fechaConteoMomentoWhatsapp: Date;
  fechaConteoMomentoOtros: Date;
  fechaConteoMomentoTotal: Date;

  subTasaContacto$: Subscription = new Subscription();

  flagGridConteoDatosFase: boolean = false;

  basePivotGridFase: IKendoPivotGrid = {
    loading: false,
    showPopup: false,
    data: [],
    dimensions: {
      faseOrigen: {
        caption: 'Fase Origen',
        displayValue: (item) => item.faseOrigen,
        sortValue: (displayValue: any) => displayValue,
      },
      faseDestino: {
        caption: 'Fase Destino',
        displayValue: (item) => item.faseDestino,
        sortValue: (displayValue: any) => displayValue,
      },
    },
    measures: [
      {
        name: 'Sum',
        value: (item: any): any => item.numeroRegistros,
        aggregate: {
          init: (data) => {
            data.sum = 'sum' in data ? data.sum : 0;
          },
          accumulate: (data, value) => {
            data.sum += value;
          },
          merge: (src, dest) => {
            dest.sum += src.sum;
          },
          result: (data) => data.sum,
          format: (value: number) => value.toFixed(0),
        },
      },
    ],
    columnAxes: [{ name: ['faseOrigen'], expand: true }],
    rowAxes: [{ name: ['faseDestino'], expand: true }],
    measureAxes: [{ name: ['Sum'] }],
  };
  get fechaActual(): Date {
    return new Date();
  }
  basePivotGridFase2: IKendoPivotGrid = {
    loading: false,
    showPopup: false,
    data: [],
    dimensions: {
      faseOrigen: {
        caption: 'Fase Origen',
        displayValue: (item) => item.faseOrigen,
        sortValue: (displayValue: any) => displayValue,
      },
      faseDestino: {
        caption: 'Fase Destino',
        displayValue: (item) => item.faseDestino,
        sortValue: (displayValue: any) => displayValue,
      },
    },
    measures: [
      {
        name: 'Sum',
        value: (item: any): any => item.numeroRegistros,
        aggregate: {
          init: (data) => {
            data.sum = 'sum' in data ? data.sum : 0;
          },
          accumulate: (data, value) => {
            data.sum += value;
          },
          merge: (src, dest) => {
            dest.sum += src.sum;
          },
          result: (data) => data.sum,
          format: (value: number) => value.toFixed(0),
        },
      },
      {
        name: 'Porcentaje',
        value: (item: any): any => item.metaLanzamiento,
        aggregate: {
          init: (data) => {
            data.sumPercentaje =
              'sumPercentaje' in data ? data.sumPercentaje : 0;
          },
          accumulate: (data, value) => {
            data.sumPercentaje += value;
          },
          merge: (src, dest) => {
            dest.sumPercentaje += src.sumPercentaje;
          },
          result: (data) => {
            return data.sumPercentaje;
          },
          format: (value: number) => Math.floor(value) + '%',
        },
      },
    ],
    columnAxes: [{ name: ['faseOrigen'], expand: true }],
    rowAxes: [{ name: ['faseDestino'], expand: true }],
    measureAxes: [{ name: ['Porcentaje'] }, { name: ['Sum'] }],
  };

  pivotGridCambioFase: IKendoPivotGrid = Object.assign(
    {},
    this.basePivotGridFase2
  );
  pivotGridCambioFasePredictivo: IKendoPivotGrid = Object.assign(
    {},
    this.basePivotGridFase2
  );
  pivotGridConLlamada: IKendoPivotGrid = Object.assign(
    {},
    this.basePivotGridFase
  );
  pivotGridSinLlamada: IKendoPivotGrid = Object.assign(
    {},
    this.basePivotGridFase
  );
  pivotGridRN5: IKendoPivotGrid = Object.assign({}, this.basePivotGridFase);
  pivotGridOM: IKendoPivotGrid = Object.assign({}, this.basePivotGridFase);
  pivotGridRNyRN1: IKendoPivotGrid = Object.assign({}, this.basePivotGridFase);
  pivotGridControlBIC_E_NS: IKendoPivotGrid = Object.assign(
    {},
    this.basePivotGridFase
  );

  totalIS: any = 0;
  estadoAsesores: Array<{ id: boolean; nombre: string }> = [
    { id: true, nombre: 'Activos' },
    { id: false, nombre: 'Inactivos' },
  ];

  btnBuscarDisabled: boolean = true;
  urlApi: string;
  flagReload: boolean = false;
  ngOnInit(): void {
    if(this.userService.idPersonal != 213){
      this.formFiltroCambioFase.get('asesores').setValidators(Validators.required);
    }
    this.obtenerCombosCambioFase();
  }
  get formFiltro(): IFormFiltro {
    return this.formFiltroCambioFase.getRawValue() as IFormFiltro;
  }
  /**
   * Obtiene los combos para el reporte
   */
  obtenerCombosCambioFase() {
    this.integraService
      .getJsonResponse(constApiComercial.ReporteCambioDeFaseObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<IComboReporteCambioFase>) => {
          this.sourceAsesores = resp.body.asesores;
          this.asesorFiltro = resp.body.asesores;
          this.dataCentroCosto = resp.body.centroCostos;
          this.dataCentroCostoFiltro = resp.body.centroCostos;
          this.btnBuscarDisabled = false;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationError(mensaje);
        },
      });
  }
  /**
   * Filtro de personal por estado y cadena
   * @param value
   */
  filterAsesor(value: string) {
    if (value.length >= 1) {
      let contains;
      if (this.formFiltro.estadoPersonal != null) {
        contains = (value: string) => (s: IComboAsesor) =>
          s.nombreCompleto.toLowerCase().includes(value.toLowerCase().trim()) &&
          this.formFiltro.estadoPersonal == s.activo;
      } else {
        contains = (value: string) => (s: IComboAsesor) =>
          s.nombreCompleto
            .toLowerCase()
            .trim()
            .includes(value.toLowerCase().trim());
      }
      this.asesorFiltro = this.sourceAsesores.filter(contains(value));
    } else {
      this.asesorFiltro = this.sourceAsesores;
    }
  }
  /**
   * Carga los asesores de acuerdo al estado del personal
   * @param estado
   */
  changeEstadoPersonal(estado: boolean) {
    if (estado != null) {
      this.asesorFiltro = this.sourceAsesores.filter((e) => e.activo == estado);
    } else {
      this.asesorFiltro = this.sourceAsesores;
    }
    this.formFiltroCambioFase
      .get('asesores')
      .setValue(
        this.formFiltro.asesores.filter((e) =>
          this.asesorFiltro.map((x) => x.id).includes(e)
        )
      );
  }
  /**
   * Filtro de centros de costos
   * @param value
   */
  filterCentroCosto(value: string) {
    if (value.length >= 1) {
      this.dataCentroCostoFiltro = this.dataCentroCosto.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.dataCentroCostoFiltro = this.dataCentroCosto;
    }
  }
  private get filtroForm() {
    const dataForm: IFormFiltro = this.formFiltroCambioFase.getRawValue();
    const filtro = {
      acumulado: dataForm.acumulado,
      centroCostos: dataForm.centroCosto,
      asesores: dataForm.asesores ?? [],
      fechaInicio: datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd'),
      fechaFin: datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd'),
    };
    return filtro;
  }
  /**
   * Genera el reporte general de cambios de fase
   */
  generarReporteCobertura() {
    // let filtro = this.filtroForm;
    if (
      new Date(this.filtroForm.fechaFin) < new Date(this.filtroForm.fechaInicio)
    ) {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: '¡Rango de fechas no valido!',
      });
    } else {
      if (this.userService.idPersonal == 213 || this.userService.idPersonal == 4648 || this.formFiltroCambioFase.valid) {
        this.btnBuscarDisabled = true;
        this.iniciarLoading();
        this.generarReporteTasaContactoV2AsyncReplica();
        this.generarReporteTasaContactoOtroMedioAsyncReplica();
        this.generarReporteV2ControlBicYEAcumuladoAsyncReplica();
        this.generarReporteV2AsyncReplica();
        this.generarReporteCalidadProcesamientoReplica();
        const dataForm: IFormFiltro = this.formFiltroCambioFase.getRawValue();
        if (dataForm.fechaFin < new Date('2023-10-12T00:00:00')) {
          this.flagGridConteoDatosFase = true;
          this.obtenerReporteConteoDatosFase(); //Replica
        } else {
          this.flagGridConteoDatosFase = false;
          this.obtenerReporteConteoDatosFaseAlterno(); //Replica
        }
        this.generarReporteV2IntegraAsync();
        this.obtenerControlOportunidadPredictiva();
      } else {
        if (
          this.formFiltro.asesores == null ||
          this.formFiltro.asesores.length == 0
          && this.userService.idPersonal != 213
        ) {
          this.alertaService.swalFireOptions({
            icon: 'warning',
            text: '¡Seleccione un asesor!',
          });
        }
        this.formFiltroCambioFase.markAllAsTouched();
      }
    }
  }

  iniciarLoading() {
    this.fechaConteoInicio = null;
    this.fechaConteoMomento = null;

    this.fechaConteoInicioPeru = null;
    this.fechaConteoInicioColombia = null;
    this.fechaConteoInicioMexico = null;
    this.fechaConteoInicioChile = null;
    this.fechaConteoInicioWhatsapp = null;
    this.fechaConteoInicioOtros = null;
    this.fechaConteoInicioTotal = null;
    this.fechaConteoMomentoPeru = null;
    this.fechaConteoMomentoColombia = null;
    this.fechaConteoMomentoMexico = null;
    this.fechaConteoMomentoChile = null;
    this.fechaConteoMomentoWhatsapp = null;
    this.fechaConteoMomentoOtros = null;
    this.fechaConteoMomentoTotal = null;

    this.gridTasaContacto.loading = true;
    this.gridTasaContacto.showPopup = false;
    this.gridTasaContacto.data = [];
    this.gridTasaContactoOtroMedio.loading = true;
    this.gridTasaContactoOtroMedio.showPopup = false;
    this.gridTasaContactoOtroMedio.data = [];
    this.gridTasaContactoV2.loading = true;
    this.gridTasaContactoV2.showPopup = false;
    this.gridTasaContactoV2.data = [];

    this.gridTasaFaseFinal.loading=true;
    this.gridTasaFaseFinal.showPopup = false;
    this.gridTasaFaseFinal.data = [];

    this.gridControlCambiodeFase.loading = true;
    this.gridControlCambiodeFase.showPopup = false;
    this.gridControlCambiodeFase.data = [];
    this.gridActividadEjecutadaSinCambioFase.loading = true;
    this.gridActividadEjecutadaSinCambioFase.showPopup = false;
    this.gridActividadEjecutadaSinCambioFase.data = [];
    this.gridActividadesVencidas.loading = true;
    this.gridActividadesVencidas.showPopup = false;
    this.gridActividadesVencidas.data = [];
    this.gridDiferenciaLlamadasBloque.loading = true;
    this.gridDiferenciaLlamadasBloque.showPopup = false;
    this.gridDiferenciaLlamadasBloque.data = [];
    this.gridActividadesinLlamadaRegistrada.loading = true;
    this.gridActividadesinLlamadaRegistrada.showPopup = false;
    this.gridActividadesinLlamadaRegistrada.data = [];
    this.gridActividadesPorOtroMedio.loading = true;
    this.gridActividadesPorOtroMedio.showPopup = false;
    this.gridActividadesPorOtroMedio.data = [];
    this.gridConteoDatosFase.loading = true;
    this.gridConteoDatosFase.showPopup = false;
    this.gridConteoDatosFase.data = [];
    this.gridConteoDatosFaseAlterno.loading = true;
    this.gridConteoDatosFaseAlterno.showPopup = false;
    this.gridConteoDatosFaseAlterno.data = [];
    this.flagPaisesConteoDatosFase.contadorPeru = true;
    this.flagPaisesConteoDatosFase.contadorChile = true;
    this.flagPaisesConteoDatosFase.contadorWhatsapp = true;
    this.flagPaisesConteoDatosFase.contadorColombia = true;
    this.flagPaisesConteoDatosFase.contadorMexico = true;
    this.flagPaisesConteoDatosFase.contadorOtros = true;
    this.flagColumnsTasaConversion.flagColumnPeru = true;
    this.flagColumnsTasaConversion.flagColumnColombia = true;
    this.flagColumnsTasaConversion.flagColumnBolivia = true;
    this.flagColumnsTasaConversion.flagColumnMexico = true;
    this.flagColumnsTasaConversion.flagColumnChile = true;
    this.flagColumnsTasaConversion.flagColumnWhatsapp = true;
    this.gridTasaConversion.data = [];
    this.gridTasaConversion.loading = true;
    this.gridTasaConversion.showPopup = false;
    this.gridTasaConversionPredictiva.data = [];
    this.gridTasaConversionPredictiva.loading = true;
    this.gridTasaConversionPredictiva.showPopup = false;
    this.gridControlOportunidadPredictiva.data = [];
    this.gridControlOportunidadPredictiva.loading = true;
    this.gridControlOportunidadPredictiva.showPopup = false;
    this.gridCalidadProcesamiento.data = [];
    this.gridCalidadProcesamiento.loading = true;
    this.gridCalidadProcesamiento.showPopup = false;

    this.pivotGridCambioFase.loading = true;
    this.pivotGridCambioFase.showPopup = false;
    this.pivotGridCambioFase.data = [];

    this.pivotGridCambioFasePredictivo.loading = true;
    this.pivotGridCambioFasePredictivo.showPopup = false;
    this.pivotGridCambioFasePredictivo.data = [];
    
    this.pivotGridRN5.loading = true;
    this.pivotGridRN5.showPopup = false;
    this.pivotGridRN5.data = [];
    this.pivotGridControlBIC_E_NS.loading = true;
    this.pivotGridControlBIC_E_NS.showPopup = false;
    this.pivotGridControlBIC_E_NS.data = [];
    this.pivotGridRNyRN1.loading = true;
    this.pivotGridRNyRN1.showPopup = false;
    this.pivotGridRNyRN1.data = [];
    this.pivotGridSinLlamada.loading = true;
    this.pivotGridSinLlamada.showPopup = false;
    this.pivotGridSinLlamada.data = [];

    this.pivotGridConLlamada.loading = true;
    this.pivotGridConLlamada.showPopup = false;
    this.pivotGridConLlamada.data = [];

    this.gridLlamadaObservada.data = [];
    this.gridLlamadaObservada.loading = true;
    this.gridLlamadaObservada.showPopup = false;

    this.gridLlamadaObservadaDuracionAtipica.data = [];
    this.gridLlamadaObservadaDuracionAtipica.loading = true;
    this.gridLlamadaObservadaDuracionAtipica.showPopup = false;
    
    // this.gridActividadEjecutadaFaseActual.data = [];
    // this.gridActividadEjecutadaFaseActual.loading = true;
    // this.gridActividadEjecutadaFaseActual.showPopup = false;
    this.gridAcumuladoLlamadas.data = [];
    this.gridAcumuladoLlamadas.loading = true;
    this.gridAcumuladoLlamadas.showPopup = false;
    this.gridAcumuladoTiempoContacto.data = [];
    this.gridAcumuladoTiempoContacto.loading = true;
    this.gridAcumuladoTiempoContacto.showPopup = false;
  }

  generarReporteV2ControlBicYEAcumuladoAsyncReplica() {
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxGenerarReporteV2ControlBICYEAcumuladoAsync,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<IReporteCambioFaseOportunidad[]>) => {
          this.btnBuscarDisabled = false;
          if (resp.body != null) {
            this.pivotGridControlBIC_E_NS.data = resp.body;
            this.pivotGridControlBIC_E_NS.loading = false;
          }
        },
        error: (error) => {
          this.pivotGridControlBIC_E_NS.loading = false;
        },
      });
  }
  generarReporteTasaContactoAsyncReplica(reload?: boolean) {
    this.gridTasaContacto.loading = true;
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxGenerarReporteTasaContactoTresCxAsync,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<IReporteTasaContactoAmbos>) => {
          this.btnBuscarDisabled = false;
          if (resp.body != null) {
            this.setDataGridTasaContacto(
              resp.body.reporteTasaContacto,
              resp.body.reporteTasaContactoConySinLlamada
            );
          }
          if (!reload) {
            this.generarReporteLlamadaActividad();
          }
        },
        error: (error) => {
          this.gridTasaContacto.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  generarReporteTasaContactoV2AsyncReplica(reload?: boolean) {
    this.gridTasaContactoV2.loading = true;
    this.gridTasaFaseFinal.loading = true;
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxGenerarReporteTasaContactoTresCxV2Async,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<IReporteTasaContactoAmbos>) => {
          this.btnBuscarDisabled = false;
          if (resp.body != null) {
            this.setDataGridTasaContactoV2(
              resp.body.reporteTasaContacto,
              resp.body.reporteTasaContactoConySinLlamada
            );

            this.setDataGridPasadasFaseFinal(resp.body.reporteTasaContactoConySinLlamada);

          }
          if (!reload) {
            this.generarReporteLlamadaActividad();
          }
        },
        error: (error) => {
          this.gridTasaContactoV2.loading = false;
          this.gridTasaFaseFinal.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }


  generarReporteTasaContactoOtroMedioAsyncReplica(reload?: boolean) {
    this.gridTasaContactoOtroMedio.loading = true;
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxGenerarReporteTasaContactoTresCxOtroMedioAsync,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<IReporteTasaContactoAmbos>) => {
          this.btnBuscarDisabled = false;
          if (resp.body != null) {
            this.setDataGridTasaContactoOtroMedio(
              resp.body.reporteTasaContacto,
              resp.body.reporteTasaContactoConySinLlamada
            );
          }
        },
        error: (error) => {
          this.gridTasaContactoOtroMedio.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**
   * Reporte Control de Actividades
   */
  generarReporteV2AsyncReplica() {
    this.pivotGridCambioFase.loading = true;
    this.pivotGridRN5.loading = true;
    this.pivotGridOM.loading = true;
    this.pivotGridRNyRN1.loading = true;
    this.gridControlCambiodeFase.loading = true;
    this.gridActividadesinLlamadaRegistrada.loading = true;
    this.gridActividadesPorOtroMedio.loading=true;

    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxGenerarReporteV2Async,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<IReporteCambioFase>) => {
          this.btnBuscarDisabled = false;
          if (resp.body != null) {
            this.totalIS = resp.body.reporteMetasObtenerTotalIS;
            this.setDataReporteGeneral(
              resp.body.reporteCambiosDeFaseOportunidad,
              resp.body.reporteCambiosDeFaseOportunidadPredictivo
            );
            this.setDataReporteGeneralConLlamada(
              resp.body.reporteCambiosDeFaseOportunidadConLlamada
            );
            this.setDataReporteGeneralSinLlamada(
              resp.body.reporteCambiosDeFaseOportunidadSinLlamada
            );
            this.setDataReporteControlRNyRN1(resp.body.reporteControlRN1yRN2);
            this.setDataGridControlActividades(resp.body.controlCambiodeFase);
            this.setDataGridControlActividadesOtroMedio(resp.body.reporteOtroMedio);
          }
        },
        error: (error) => {
          this.btnBuscarDisabled = false;
          this.pivotGridCambioFase.loading = false;
          this.pivotGridRN5.loading = false;
          this.pivotGridOM.loading = false;
          this.pivotGridRNyRN1.loading = false;
          this.gridControlCambiodeFase.loading = false;
          this.gridActividadesinLlamadaRegistrada.loading = false;
          this.gridActividadesPorOtroMedio.loading=false;
        },
      });
  }
  generarReporteV2IntegraAsync() {
    this.integraService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxGenerarReporteV2IntegraAsync,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<ReporteV2Integra>) => {
          this.btnBuscarDisabled = false;
          if (resp.body != null) {
            this.setDataGridActividadEjecutadaSinCambioFase(
              resp.body.ejecutadasSinCambiodeFase
            );
            this.setDataGridActividadVencida(resp.body.actividadVencidaporTab);
            this.setDataGridTasaConversion(resp.body.reporteTasaDeCambio);
            this.setDataGridTasaConversionPredictiva(
              resp.body.reporteTasaDeCambioPredictivo
            );
          }
        },
        error: (error) => {
          this.btnBuscarDisabled = false;
          this.gridActividadEjecutadaSinCambioFase.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  generarReporteCalidadProcesamiento(filtro: any) {
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxGenerarReporteCalidadProcesamiento,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<IReporteCalidadProcesamientoCambioFase>) => {
          this.btnBuscarDisabled = false;
          if (resp.body != null) {
            if (resp.body.reporteCalidadProcesamiento.length != 0) {
              this.setDataGridCalidadAlterno(
                resp.body.reporteCalidadProcesamiento
              );
            } else {
              this.gridCalidadProcesamiento.loading = false;
            }
            this.setDataDiferenciaLlamadasBloque(
              resp.body.diferenciaLlamadasBloque
            );
          }
        },
        error: (error: any) => {
          this.btnBuscarDisabled = false;
        },
      });
  }
  //Nuevo
  obtenerReporteConteoDatosFase() {
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseObtenerReporteConteoDatosFase,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<IReporteConteoDatosFase>) => {
          this.btnBuscarDisabled = false;
          if (resp.body != null) {
            this.setDataConteoDatosFase(resp.body.conteoDatosFase);
            this.fechaConteoInicio = resp.body.fechaConteoInicio;
            this.fechaConteoMomento = resp.body.fechaConteoMomento;
          }
        },
        error: (error: any) => {
          this.btnBuscarDisabled = false;
        },
      });
  }
  obtenerReporteConteoDatosFaseAlterno() {
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxObtenerReporteConteoDatosFaseAlterno,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<ConteoDatosFasePais[]>) => {
          this.btnBuscarDisabled = false;
          if (resp.body != null) {
            this.setDataConteoDatosFaseAlterno(resp.body);
          }
        },
        error: (error: any) => {
          this.btnBuscarDisabled = false;
        },
      });
  }
  generarReporteCalidadProcesamientoReplica() {
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseGenerarReporteCalidadProcesamiento,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<IReporteCalidadProcesamientoCambioFase>) => {
          this.btnBuscarDisabled = false;
          if (resp.body != null) {
            if (resp.body.reporteCalidadProcesamiento.length != 0) {
              this.setDataGridCalidadAlterno(
                resp.body.reporteCalidadProcesamiento
              );
            } else {
              this.gridCalidadProcesamiento.loading = false;
            }
            this.setDataDiferenciaLlamadasBloque(
              resp.body.diferenciaLlamadasBloque
            );
          }
        },
        error: (error: any) => {
          this.btnBuscarDisabled = false;
        },
      });
  }
  setDataGridCalidadAlterno(
    reporteCalidadProcesamiento: ICalidadProcesamientoAlterno[]
  ) {
    let asesorArreglo: ICalidadProcesamientoAlterno[] =
      reporteCalidadProcesamiento.filter(
        (asesor) => asesor.datosAsesor != null
      );
    asesorArreglo = asesorArreglo.sort((a, b) =>
      a.datosAsesor.localeCompare(b.datosAsesor)
    );

    const uniqueArray = asesorArreglo
      .map((x) => x.datosAsesor)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });

    let calidad: ICalidadProcesamientoAlterno[] = [];

    uniqueArray.forEach((nombreAsesor) => {
      let lista = asesorArreglo.filter((s) => s.datosAsesor == nombreAsesor);
      let item = lista.find((x) => x.nombreFase == 'IT');
      let calidadTemp: ICalidadProcesamientoAlterno[] = [];
      if (item != null) {
        calidadTemp = [...calidadTemp, item];
      }
      item = lista.find((x) => x.nombreFase == 'RN');
      if (item != null) {
        calidadTemp = [...calidadTemp, item];
      }
      item = lista.find((x) => x.nombreFase == 'IP');
      if (item != null) {
        calidadTemp = [...calidadTemp, item];
      }
      item = lista.find((x) => x.nombreFase == 'PF');
      if (item != null) {
        calidadTemp = [...calidadTemp, item];
      }
      item = lista.find((x) => x.nombreFase == 'IC');
      if (item != null) {
        calidadTemp = [...calidadTemp, item];
      }
      if (calidadTemp.length > 0) {
        calidadTemp.forEach((s) => {
          s.datosAsesor = '';
        });
        calidadTemp[0].datosAsesor = nombreAsesor;
      }
      calidad = [...calidad, ...calidadTemp];
    });
    this.gridCalidadProcesamiento.data = calidad;
    this.gridCalidadProcesamiento.loading = false;
  }
  setDataDiferenciaLlamadasBloque(
    diferenciaLlamadasBloque: Array<{
      valuecantidad: number;
      descripcion: string;
    }>
  ) {
    let res: Array<{
      valuecantidad: number;
      descripcion: string;
    }> = [];
    let dias: string[] = [
      '0 días',
      '1 día',
      '2 días',
      // '3 días',
      // '4 días',
      // '5 días',
      'Mas de 2 días',
      'Total',
    ];
    dias.forEach((dia) => {
      let item = diferenciaLlamadasBloque.find((e) => e.descripcion == dia);
      if (item) {
        res.push(item);
      }
    });
    this.gridDiferenciaLlamadasBloque.data = res;
    this.gridDiferenciaLlamadasBloque.loading = false;
  }
  setDataConteoDatosFase(
    conteoDatosFase: Array<{
      fase: string;
      inicio: number;
      momento: number;
    }>
  ) {
    let res: Array<{
      fase: string;
      inicio: number;
      momento: number;
    }> = [];
    let fases: string[] = [
      'BNC',
      'BNC-1',
      'IT',
      'IP',
      'PF',
      'IC',
      'RN',
      'Total',
    ];
    fases.forEach((fase) => {
      let item = conteoDatosFase.find((e) => e.fase == fase);
      if (item) {
        res.push(item);
      }
    });
    this.gridConteoDatosFase.data = res;
    this.gridConteoDatosFase.loading = false;
  }
  setDataConteoDatosFaseAlterno(conteoDatosFase: ConteoDatosFasePais[]) {
    let res: Array<ItemConteoFasePais> = [];
    let fases: string[] = [
      'BNC',
      // 'BNC-1',
      'IT',
      'IP',
      'PF',
      'IC',
      'RN',
      'Total',
    ];
    let paises: number[] = [51, 57, 52, 56, 0];
    fases.forEach((fase) => {
      let flagPush = false;
      let faseTemp: ItemConteoFasePais = {
        fase: fase,
        inicioPeru: 0,
        momentoPeru: 0,
        inicioColombia: 0,
        momentoColombia: 0,
        inicioMexico: 0,
        momentoMexico: 0,
        inicioChile: 0,
        momentoChile: 0,
        inicioWhatsapp: 0,
        momentoWhatsapp: 0,
        inicioOtros: 0,
        momentoOtros: 0,
        inicioTotal: 0,
        momentoTotal: 0,
      };
      let item = conteoDatosFase.find((e) => e.idPais == 51);
      if (item) {
        if (item.fechaInicio != null) {
          this.fechaConteoInicioPeru = new Date(item.fechaInicio);
        }
        if (item.fechaMomento != null) {
          this.fechaConteoMomentoPeru = new Date(item.fechaMomento);
        }
        let datoFase = item.conteoDatosFase.find((e) => e.fase == fase);
        if (datoFase != null) {
          flagPush = true;
          faseTemp.inicioPeru = datoFase.inicio ?? 0;
          faseTemp.momentoPeru = datoFase.momento ?? 0;
        }
      }
      item = conteoDatosFase.find((e) => e.idPais == 57);
      if (item) {
        if (item.fechaInicio != null) {
          this.fechaConteoInicioColombia = new Date(item.fechaInicio);
        }
        if (item.fechaMomento != null) {
          this.fechaConteoMomentoColombia = new Date(item.fechaMomento);
        }
        let datoFase = item.conteoDatosFase.find((e) => e.fase == fase);
        if (datoFase != null) {
          flagPush = true;
          faseTemp.inicioColombia = datoFase.inicio ?? 0;
          faseTemp.momentoColombia = datoFase.momento ?? 0;
        }
      }
      item = conteoDatosFase.find((e) => e.idPais == 52);
      if (item) {
        if (item.fechaInicio != null) {
          this.fechaConteoInicioMexico = new Date(item.fechaInicio);
        }
        if (item.fechaMomento != null) {
          this.fechaConteoMomentoMexico = new Date(item.fechaMomento);
        }
        let datoFase = item.conteoDatosFase.find((e) => e.fase == fase);
        if (datoFase != null) {
          flagPush = true;
          faseTemp.inicioMexico = datoFase.inicio ?? 0;
          faseTemp.momentoMexico = datoFase.momento ?? 0;
        }
      }
      item = conteoDatosFase.find((e) => e.idPais == 56);
      if (item) {
        if (item.fechaInicio != null) {
          this.fechaConteoInicioChile = new Date(item.fechaInicio);
        }
        if (item.fechaMomento != null) {
          this.fechaConteoMomentoChile = new Date(item.fechaMomento);
        }
        let datoFase = item.conteoDatosFase.find((e) => e.fase == fase);
        if (datoFase != null) {
          flagPush = true;
          faseTemp.inicioChile = datoFase.inicio ?? 0;
          faseTemp.momentoChile = datoFase.momento ?? 0;
        }
      }
      item = conteoDatosFase.find((e) => e.idPais == -1);
      if (item) {
        if (item.fechaInicio != null) {
          this.fechaConteoInicioWhatsapp = new Date(item.fechaInicio);
        }
        if (item.fechaMomento != null) {
          this.fechaConteoMomentoWhatsapp = new Date(item.fechaMomento);
        }
        let datoFase = item.conteoDatosFase.find((e) => e.fase == fase);
        if (datoFase != null) {
          flagPush = true;
          faseTemp.inicioWhatsapp = datoFase.inicio ?? 0;
          faseTemp.momentoWhatsapp = datoFase.momento ?? 0;
        }
      }
      item = conteoDatosFase.find((e) => e.idPais == 0);
      if (item) {
        if (item.fechaInicio != null) {
          this.fechaConteoInicioOtros = new Date(item.fechaInicio);
        }
        if (item.fechaMomento != null) {
          this.fechaConteoMomentoOtros = new Date(item.fechaMomento);
        }
        let datoFase = item.conteoDatosFase.find((e) => e.fase == fase);
        if (datoFase != null) {
          flagPush = true;
          faseTemp.inicioOtros = datoFase.inicio ?? 0;
          faseTemp.momentoOtros = datoFase.momento ?? 0;
        }
      }
      if (flagPush == true) {
        res.push(faseTemp);
      }
    });
    let fechas1: Date[] = [];
    if (this.fechaConteoInicioPeru != null) {
      fechas1.push(this.fechaConteoInicioPeru);
    }
    if (this.fechaConteoInicioColombia != null) {
      fechas1.push(this.fechaConteoInicioColombia);
    }
    if (this.fechaConteoInicioMexico != null) {
      fechas1.push(this.fechaConteoInicioMexico);
    }
    if (this.fechaConteoInicioChile != null) {
      fechas1.push(this.fechaConteoInicioChile);
    }
    if (this.fechaConteoInicioWhatsapp != null) {
      fechas1.push(this.fechaConteoInicioWhatsapp);
    }
    if (this.fechaConteoInicioOtros != null) {
      fechas1.push(this.fechaConteoInicioOtros);
    }
    if (fechas1.length > 0) {
      fechas1 = fechas1.sort((a, b) => {
        return b.getTime() - a.getTime();
      });
      this.fechaConteoInicioTotal = fechas1[0];
    }

    let fechas2: Date[] = [];
    if (this.fechaConteoMomentoPeru != null) {
      fechas2.push(this.fechaConteoMomentoPeru);
    }
    if (this.fechaConteoMomentoColombia != null) {
      fechas2.push(this.fechaConteoMomentoColombia);
    }
    if (this.fechaConteoMomentoMexico != null) {
      fechas2.push(this.fechaConteoMomentoMexico);
    }
    if (this.fechaConteoMomentoChile != null) {
      fechas2.push(this.fechaConteoMomentoChile);
    }
    if (this.fechaConteoMomentoWhatsapp != null) {
      fechas2.push(this.fechaConteoMomentoWhatsapp);
    }
    if (this.fechaConteoMomentoOtros != null) {
      fechas2.push(this.fechaConteoMomentoOtros);
    }
    if (fechas2.length > 0) {
      fechas2 = fechas2.sort((a, b) => {
        return a.getTime() - b.getTime();
      });
      this.fechaConteoMomentoTotal = fechas2[0];
    }

    if (this.fechaConteoInicioPeru == null) {
      this.fechaConteoInicioPeru = this.fechaConteoInicioTotal;
    }
    if (this.fechaConteoInicioColombia == null) {
      this.fechaConteoInicioColombia = this.fechaConteoInicioTotal;
    }
    if (this.fechaConteoInicioMexico == null) {
      this.fechaConteoInicioMexico = this.fechaConteoInicioTotal;
    }
    if (this.fechaConteoInicioChile == null) {
      this.fechaConteoInicioChile = this.fechaConteoInicioTotal;
    }
    if (this.fechaConteoInicioWhatsapp == null) {
      this.fechaConteoInicioWhatsapp = this.fechaConteoInicioTotal;
    }
    if (this.fechaConteoInicioOtros == null) {
      this.fechaConteoInicioOtros = this.fechaConteoInicioTotal;
    }
    //
    if (this.fechaConteoMomentoPeru == null) {
      this.fechaConteoMomentoPeru = this.fechaConteoMomentoTotal;
    }
    if (this.fechaConteoMomentoColombia == null) {
      this.fechaConteoMomentoColombia = this.fechaConteoMomentoTotal;
    }
    if (this.fechaConteoMomentoMexico == null) {
      this.fechaConteoMomentoMexico = this.fechaConteoMomentoTotal;
    }
    if (this.fechaConteoMomentoChile == null) {
      this.fechaConteoMomentoChile = this.fechaConteoMomentoTotal;
    }
    if (this.fechaConteoMomentoWhatsapp == null) {
      this.fechaConteoMomentoWhatsapp = this.fechaConteoMomentoTotal;
    }
    if (this.fechaConteoMomentoOtros == null) {
      this.fechaConteoMomentoOtros = this.fechaConteoMomentoTotal;
    }
    res.forEach((x) => {
      x.inicioTotal =
        x.inicioPeru +
        x.inicioColombia +
        x.inicioMexico +
        x.inicioChile +
        x.inicioOtros;
      x.momentoTotal =
        x.momentoPeru +
        x.momentoColombia +
        x.momentoMexico +
        x.momentoChile +
        x.momentoOtros;
    });
    let contadorPeru = false;
    let contadorChile = false;
    let contadorWhatsapp = false;
    let contadorColombia = false;
    let contadorMexico = false;
    let contadorOtros = false;
    res.forEach((x) => {
      if (x.momentoPeru > 0) contadorPeru = true;
      if (x.momentoChile > 0) contadorChile = true;
      if (x.momentoWhatsapp > 0) contadorWhatsapp = true;
      if (x.momentoColombia > 0) contadorColombia = true;
      if (x.momentoMexico > 0) contadorMexico = true;
      if (x.momentoOtros > 0) contadorOtros = true;

      if (x.inicioPeru > 0) contadorPeru = true;
      if (x.inicioChile > 0) contadorChile = true;
      if (x.inicioWhatsapp > 0) contadorWhatsapp = true;
      if (x.inicioColombia > 0) contadorColombia = true;
      if (x.inicioMexico > 0) contadorMexico = true;
      if (x.inicioOtros > 0) contadorOtros = true;
    });
    this.flagPaisesConteoDatosFase.contadorPeru = contadorPeru;
    this.flagPaisesConteoDatosFase.contadorChile = contadorChile;
    this.flagPaisesConteoDatosFase.contadorWhatsapp = contadorWhatsapp;
    this.flagPaisesConteoDatosFase.contadorColombia = contadorColombia;
    this.flagPaisesConteoDatosFase.contadorMexico = contadorMexico;
    this.flagPaisesConteoDatosFase.contadorOtros = contadorOtros;

    this.gridConteoDatosFaseAlterno.data = res;
    this.gridConteoDatosFaseAlterno.loading = false;
  }
  flagPaisesConteoDatosFase = {
    contadorPeru: true,
    contadorChile: true,
    contadorWhatsapp: true,
    contadorColombia: true,
    contadorMexico: true,
    contadorOtros: true,
  };

  sumarEjecutadas(dataItem: IEjecutadaSinCambioFase) {
    let sumaEjecutadas: number = 0;

    if (dataItem.uno != null && dataItem.uno != 0) {
      sumaEjecutadas += dataItem.uno;
    }
    if (dataItem.dos != null && dataItem.dos != 0) {
      sumaEjecutadas += dataItem.dos;
    }
    if (dataItem.tres != null && dataItem.tres != 0) {
      sumaEjecutadas += dataItem.tres;
    }
    if (dataItem.cuatro != null && dataItem.cuatro != 0) {
      sumaEjecutadas += dataItem.cuatro;
    }
    if (dataItem.masDeCuatro != null && dataItem.masDeCuatro != 0) {
      sumaEjecutadas += dataItem.masDeCuatro;
    }
    if (sumaEjecutadas == 0) {
      sumaEjecutadas = 1;
    }
    // if (
    //   dataItem.duracionContesto == null &&
    //   dataItem.duracionLlamadaultimaActividad == null
    // ) {
    // }
    let resp = (dataItem.tiempoTotal / sumaEjecutadas / 60).toFixed(1);
    return resp;
    // if (
    //   dataItem.duracionContesto !== null &&
    //   dataItem.duracionLlamadaultimaActividad !== null
    // ) {
    //   let resp = (
    //     (dataItem.duracionLlamadaultimaActividad / sumaEjecutadas / 60).toFixed(
    //       1
    //     ) +
    //     ' - ' +
    //     (dataItem.tiempoTotal / sumaEjecutadas / 60).toFixed(1) +
    //     ' - ' +
    //     (dataItem.duracionContesto / sumaEjecutadas / 60).toFixed(1)
    //   );
    //   return resp;
    // }
  }
  /**
   * Carga los datos para la tabla de Tasa de contacto
   * @param reporteTasaContacto
   * @param reporteTasaContactoConySinLlamada
   */
  setDataGridTasaContacto(
    reporteTasaContacto: IReporteTasaContacto,
    reporteTasaContactoConySinLlamada: IReporteTasaContactoConySinLlamada
  ) {
    let tasaContacto =
      (reporteTasaContacto.totalLlamadasEjecutadasConLlamada /
        reporteTasaContacto.totalLlamadas) *
      100;
    let cambioFaseEjecutada =
      (reporteTasaContactoConySinLlamada.cambiosFaseConLlamada /
        reporteTasaContacto.totalLlamadasEjecutadasConLlamada) *
      100;
    this.gridTasaContacto.data = [
      {
        descripcion: 'Número de actividades totales',
        valor: reporteTasaContacto.totalLlamadas,
      },
      {
        descripcion: 'Número de actividades ejecutadas',
        valor: reporteTasaContacto.totalLlamadasEjecutadasConLlamada,
      },
      {
        descripcion: 'TASA DE CONTACTO',
        valor: !isNaN(tasaContacto) ? `${tasaContacto.toFixed(0)}%` : '0.0%',
      },
      {
        descripcion: 'Número de cambios de fase (solo con llamadas)',
        valor: reporteTasaContactoConySinLlamada.cambiosFaseConLlamada,
      },
      {
        descripcion: 'Número de cambios de fase (sin llamadas)',
        valor: reporteTasaContactoConySinLlamada.cambiosFaseSinLlamada,
      },
      {
        descripcion: '% CAMBIOS DE FASE EJECUTADAS',
        valor: !isNaN(cambioFaseEjecutada)
          ? `${cambioFaseEjecutada.toFixed(0)}%`
          : '0.0%',
      },
      {
        descripcion: 'Oportunidades pasadas a fase final (solo con llamadas)',
        valor: reporteTasaContactoConySinLlamada.cambiosFaseOCconLlamada,
      },
      {
        descripcion: 'Oportunidades pasadas a fase final (sin llamadas)',
        valor: reporteTasaContactoConySinLlamada.cambiosFaseOCsinLlamada,
      },
    ];
    this.gridTasaContacto.loading = false;
  }
  /**
   * Carga los datos para la tabla de Tasa de contacto
   * @param reporteTasaContacto
   * @param reporteTasaContactoConySinLlamada
   */
  setDataGridTasaContactoV2(
    reporteTasaContacto: IReporteTasaContacto,
    reporteTasaContactoConySinLlamada: IReporteTasaContactoConySinLlamada
  ) {
    let tasaContacto =
      (reporteTasaContacto.totalLlamadasEjecutadasConLlamada /
        reporteTasaContacto.totalLlamadas) *
      100;
    let tasaContactoEjecutadoManual =
      ((reporteTasaContacto.totalLlamadasEjecutadasConLlamada + reporteTasaContacto.totalLlamadasManual)/
        reporteTasaContacto.totalLlamadas) *
      100;
    let cambioFaseEjecutada =
      (reporteTasaContactoConySinLlamada.cambiosFaseConLlamada /
        reporteTasaContacto.totalLlamadasEjecutadasConLlamada) *
      100;
    this.gridTasaContactoV2.data = [
      {
        descripcion: 'Número de actividades totales',
        valor: reporteTasaContacto.totalLlamadas,
      },
      {
        descripcion: 'Número de actividades ejecutadas',
        valor: reporteTasaContacto.totalLlamadasEjecutadasConLlamada,
      },
      {
        descripcion: 'Actividades reprogramadas manuales',
        valor: reporteTasaContacto.totalLlamadasManual,
      },
      {
        descripcion: 'Tasa de contacto ejecutadas',
        valor: !isNaN(tasaContacto) ? `${tasaContacto.toFixed(0)}%` : '0.0%',
      },
      {
        descripcion: 'Tasa de contacto (Ejecutadas+Manuales)',
        valor: !isNaN(tasaContactoEjecutadoManual) ? `${tasaContactoEjecutadoManual.toFixed(0)}%` : '0.0%',
      },
      // {
      //   descripcion: 'Número de cambios de fase (solo con llamadas)',
      //   valor: reporteTasaContactoConySinLlamada.cambiosFaseConLlamada,
      // },
      // {
      //   descripcion: 'Número de cambios de fase (sin llamadas)',
      //   valor: reporteTasaContactoConySinLlamada.cambiosFaseSinLlamada,
      // },
      {
        descripcion: '% Cambios de fase ejecutadas',
        valor: !isNaN(cambioFaseEjecutada)
          ? `${cambioFaseEjecutada.toFixed(0)}%`
          : '0.0%',
      },
      {
        descripcion: 'Oportunidades pasadas a fase final (con llamada real asociada)',
        valor: reporteTasaContactoConySinLlamada.cambiosFaseOCconLlamada,
      },
      // {
      //   descripcion: 'Oportunidades pasadas a fase final (sin llamadas)',
      //   valor: reporteTasaContactoConySinLlamada.cambiosFaseOCsinLlamada,
      // },
    ];
    this.gridTasaContactoV2.loading = false;
  }

  /**
   * Carga los datos para la tabla de Tasa de contacto
   * @param reporteTasaContacto
   * @param reporteTasaContactoConySinLlamada
   */
  setDataGridPasadasFaseFinal(
    reporteTasaContactoConySinLlamada: IReporteTasaContactoConySinLlamada
  ) {
    
    this.gridTasaFaseFinal.data = [
      {
        descripcion: 'Oportunidades pasadas a fase final reportadas como respuestas telefonicas sin llamada real asociada',
        valor: reporteTasaContactoConySinLlamada.cambiosFaseOCsinLlamada,
      },
      {
        descripcion: 'Oportunidades pasadas a fase final reportadas como ejecutadas por otro medio',
        valor: reporteTasaContactoConySinLlamada.cambiosFaseOCotroMedio,
      }
    ];
    this.gridTasaFaseFinal.loading = false;
  }

  /**
   * Carga los datos para la tabla de Tasa de contacto
   * @param reporteTasaContacto
   * @param reporteTasaContactoConySinLlamada
   */
  setDataGridTasaContactoOtroMedio(
    reporteTasaContacto: IReporteTasaContacto,
    reporteTasaContactoConySinLlamada: IReporteTasaContactoConySinLlamada
  ) {
    let tasaContacto =
      (reporteTasaContacto.totalLlamadasEjecutadas /
        reporteTasaContacto.totalLlamadas) *
      100;
    let cambioFaseEjecutada =
      (reporteTasaContactoConySinLlamada.cambiosFaseSinLlamada /
        reporteTasaContacto.totalLlamadasEjecutadas) *
      100;
    // let cambioFaseEjecutada =
    //   (reporteTasaContactoConySinLlamada.cambiosFaseConLlamada /
    //     reporteTasaContacto.totalLlamadasEjecutadasConLlamada) *
    //   100;
    this.gridTasaContactoOtroMedio.data = [
      {
        descripcion: 'Número de actividades totales',
        valor: reporteTasaContacto.totalLlamadas,
      },
      {
        descripcion: 'Número de actividades ejecutadas',
        valor: reporteTasaContacto.totalLlamadasEjecutadasConLlamada,
      },
      {
        descripcion: 'Tasa de respuesta',
        valor: !isNaN(tasaContacto) ? `${tasaContacto.toFixed(0)}%` : '0.0%',
      },
      {
        descripcion: 'Número de cambios de fase (sin llamadas)',
        valor: reporteTasaContactoConySinLlamada.cambiosFaseSinLlamada,
      },
      {
        descripcion: '% Cambios de fase ejecutadas',
        valor: !isNaN(cambioFaseEjecutada)
          ? `${cambioFaseEjecutada.toFixed(0)}%`
          : '0.0%',
      },
      {
        descripcion: 'Oportunidades pasadas a fase final (sin llamadas)',
        valor: reporteTasaContactoConySinLlamada.cambiosFaseOCsinLlamada,
      },
    ];
    this.gridTasaContactoOtroMedio.loading = false;
  }
  setDataGridActividadEjecutadaSinCambioFase(
    dataEjecutadasSinCambiodeFase: IEjecutadaSinCambioFase[]
  ) {
    this.gridActividadEjecutadaSinCambioFase.data =
      dataEjecutadasSinCambiodeFase;
    this.gridActividadEjecutadaSinCambioFase.loading = false;
  }

  headerFecha(dia: any) {
    let formatofecha =
      dia.substring(0, 4) +
      '-' +
      dia.substring(4, 6) +
      '-' +
      dia.substring(6, 8);
    return formatofecha;
  }

  setDataGridActividadVencida(
    actividadVencidaPorTab: IActividadVencidaPorTab[]
  ) {
    let data_separada2: any = [];
    let columnasgrid2: any = [];
    actividadVencidaPorTab.forEach((actividadVencida) => {
      data_separada2.push({
        g: actividadVencida.dia,
        l_grid: actividadVencida.detalle.filter((e) => e.estado.length > 0),
      });

      columnasgrid2.push({
        title: actividadVencida.dia,
        width: 100,
        columns: [
          {
            field: 'dia_' + actividadVencida.dia,
            width: 70,
          },
        ],
      });
    });

    let mdata_grid2: any = {};
    let todoData_grid2: any = [];
    data_separada2.forEach((d: any) => {
      todoData_grid2 = todoData_grid2.concat(d.l_grid);
    });

    todoData_grid2.forEach((da: any) => {
      let orden = 0;
      if (da.estado == 'Programadas Automaticas') {
        orden = 1;
      } else if (da.estado == 'Programadas Manuales') {
        orden = 2;
      } else if (da.estado == 'No Prog. 1 Solicitud') {
        orden = 3;
      } else if (da.estado == 'No Prog. 1+ Solicitudes') {
        orden = 4;
      } else if (da.estado == 'No Prog. Altas y Medias') {
        orden = 5;
      } else if (da.estado == 'Vencidas [IP,IC,PF]') {
        orden = 6;
      // } else if (da.estado == 'Vencidas [IS,M]') {
      //   orden = 7;
      } else if (da.estado == 'RN2-A') {
        orden = 8;
      } else if (da.estado == 'RN2-B') {
        orden = 9;
      } 
      // else if (da.estado == 'Venta Cruzada') {
      //   orden = 10;
      // }

      let llave = da.estado;
      if (!mdata_grid2[llave]) {
        mdata_grid2[llave] = {
          estado: da.estado,
          orden: orden,
        };
        columnasgrid2.forEach((col: any) => {
          col.columns.forEach((c: any) => {
            mdata_grid2[llave][c.field] = null;
          });
        });
        mdata_grid2[llave]['dia_' + da.dia] = da.total;
        //nuevo
        mdata_grid2[llave]['total'] = null;
        if (llave == 'Tasa Contactabilidad') {
          mdata_grid2[llave]['total'] =
            Math.round(
              (mdata_grid2['Llamadas Efectivas']['total'] /
                mdata_grid2['Llamadas Totales']['total']) *
                100
            ) + '%';
        } else if (
          llave == 'Indicadores Operativos' ||
          llave == 'Actividades Vencidas (al termino del dia de la fecha)' ||
          llave == 'Cuotas pagadas' ||
          llave == 'Compromisos de Pago'
        ) {
          mdata_grid2[llave]['total'] = '';
        } else {
          mdata_grid2[llave]['total'] = da.total == null ? 0 : Number(da.total);
        }
      } else {
        mdata_grid2[llave]['dia_' + da.dia] = da.total;
        //nuevo
        if (llave == 'Tasa Contactabilidad') {
          mdata_grid2[llave]['total'] =
            Math.round(
              (mdata_grid2['Llamadas Efectivas']['total'] /
                mdata_grid2['Llamadas Totales']['total']) *
                100
            ) + '%';
        } else if (
          llave == 'Indicadores Operativos' ||
          llave == 'Actividades Vencidas (al termino del dia de la fecha)' ||
          llave == 'Cuotas pagadas' ||
          llave == 'Compromisos de Pago'
        ) {
          mdata_grid2[llave]['total'] = '';
        } else {
          mdata_grid2[llave]['total'] =
            mdata_grid2[llave]['total'] +
            (da.total == null ? 0 : Number(da.total));
        }
      }
    });

    let datos_grid2 = [];
    for (let dat in mdata_grid2) {
      datos_grid2.push(mdata_grid2[dat]);
    }

    datos_grid2 = datos_grid2.sort((a: any, b: any) => {
      if (a.orden < b.orden) return -1;
      if (a.orden > b.orden) return 1;
      return 0;
    });

    columnasgrid2 = columnasgrid2.sort((a: any, b: any) => {
      if (a.title < b.title) return -1;
      if (a.title > b.title) return 1;
      return 0;
    });
    this.columnGridActividadesVencidas = columnasgrid2;
    this.gridActividadesVencidas.data = datos_grid2;
    this.gridActividadesVencidas.loading = false;
  }

  createReporteTasaCambio(idCodigoPais: number): ReporteTasaCambio {
    let obj = new ReporteTasaCambio();
    obj.idCodigoPais = idCodigoPais == -1 ? 0 : idCodigoPais;
    return obj;
  }
  createReporteTasaCambioPredictivo(
    idCodigoPais: number
  ): ReporteTasaCambioPredictivo {
    let obj = new ReporteTasaCambioPredictivo();
    obj.idCodigoPais = idCodigoPais == -1 ? 0 : idCodigoPais;
    return obj;
  }

  reporteTasaDeCambioSemanal: IReporteTasaCambio[] = [];
  reporteTasaDeCambioMensual: IReporteTasaCambio[] = [];

  reporteTasaDeCambioSemanalPredictivo: IReporteTasaCambioPredictivo[] = [];
  reporteTasaDeCambioMensualPredictivo: IReporteTasaCambioPredictivo[] = []; //

  reporteTasaCambioSemanalPorPais(idCodigoPais: number): IReporteTasaCambio {
    let paisArreglo: IReporteTasaCambio[] =
      this.reporteTasaDeCambioSemanal.filter(
        (semanal) => semanal.idCodigoPais == idCodigoPais
      );
    if (paisArreglo.length != 0) {
      return paisArreglo[0];
    } else {
      return this.createReporteTasaCambio(idCodigoPais);
    }
  }
  reporteTasaCambioSemanalPorPaisPredictivo(
    idCodigoPais: number
  ): IReporteTasaCambioPredictivo {
    let paisArreglo: IReporteTasaCambioPredictivo[] =
      this.reporteTasaDeCambioSemanalPredictivo.filter(
        (semanal) => semanal.idCodigoPais == idCodigoPais
      );
    if (paisArreglo.length != 0) {
      return paisArreglo[0];
    } else {
      return this.createReporteTasaCambioPredictivo(idCodigoPais);
    }
  }
  reporteTasaCambioMensualPorPais(idCodigoPais: number): IReporteTasaCambio {
    let paisArreglo: IReporteTasaCambio[] =
      this.reporteTasaDeCambioMensual.filter(
        (semanal) => semanal.idCodigoPais == idCodigoPais
      );
    if (paisArreglo.length != 0) {
      return paisArreglo[0];
    } else {
      return this.createReporteTasaCambio(idCodigoPais);
    }
  }
  reporteTasaCambioMensualPorPaisPredictivo(
    idCodigoPais: number
  ): IReporteTasaCambioPredictivo {
    let paisArreglo: IReporteTasaCambioPredictivo[] =
      this.reporteTasaDeCambioMensualPredictivo.filter(
        (semanal) => semanal.idCodigoPais == idCodigoPais
      );
    if (paisArreglo.length != 0) {
      return paisArreglo[0];
    } else {
      return this.createReporteTasaCambioPredictivo(idCodigoPais);
    }
  }

  setDataGridTasaConversion(dataTasaConversion: {
    reporteTasaDeCambioMensual: Array<IReporteTasaCambio>;
    reporteTasaDeCambioSemanal: Array<IReporteTasaCambio>;
  }) {
    let peruSemanal: IReporteTasaCambio;
    let peruMensual: IReporteTasaCambio;
    let mexicoSemanal: IReporteTasaCambio;
    let mexicoMensual: IReporteTasaCambio;
    let boliviaSemanal: IReporteTasaCambio;
    let boliviaMensual: IReporteTasaCambio;
    let colombiaSemanal: IReporteTasaCambio;
    let colombiaMensual: IReporteTasaCambio;
    let chileSemanal: IReporteTasaCambio;
    let chileMensual: IReporteTasaCambio;
    let otroSemanal: IReporteTasaCambio;
    let otroMensual: IReporteTasaCambio;
    let totalSemanal: IReporteTasaCambio;
    let totalMensual: IReporteTasaCambio;

    /* Redondea los valores porcentuales a enteros */
    for (let dataPorPais of dataTasaConversion.reporteTasaDeCambioSemanal) {
      dataPorPais.tcReal = Number(dataPorPais.tcReal.toFixed(1));
      dataPorPais.tcMeta = Number(dataPorPais.tcMeta.toFixed(1));
      dataPorPais.tcReal_TCMeta = Math.round(dataPorPais.tcReal_TCMeta);
      dataPorPais.porcentajeIngresoMes = Math.round(
        dataPorPais.porcentajeIngresoMes
      );
      dataPorPais.descuentoPromedio = Math.round(dataPorPais.descuentoPromedio);
      dataPorPais.iR_IM = Math.round(dataPorPais.iR_IM);
    }
    for (let dataPorPais of dataTasaConversion.reporteTasaDeCambioMensual) {
      dataPorPais.tcReal = Number(dataPorPais.tcReal.toFixed(1));
      dataPorPais.tcMeta = Number(dataPorPais.tcMeta.toFixed(1));
      dataPorPais.tcReal_TCMeta = Math.round(dataPorPais.tcReal_TCMeta);
      dataPorPais.porcentajeIngresoMes = Math.round(
        dataPorPais.porcentajeIngresoMes
      );
      dataPorPais.descuentoPromedio = Math.round(dataPorPais.descuentoPromedio);
      dataPorPais.iR_IM = Math.round(dataPorPais.iR_IM);
    }
    this.reporteTasaDeCambioSemanal =
      dataTasaConversion.reporteTasaDeCambioSemanal;
    this.reporteTasaDeCambioMensual =
      dataTasaConversion.reporteTasaDeCambioMensual;
    peruSemanal = this.reporteTasaCambioSemanalPorPais(51);
    colombiaSemanal = this.reporteTasaCambioSemanalPorPais(57);
    boliviaSemanal = this.reporteTasaCambioSemanalPorPais(591);
    mexicoSemanal = this.reporteTasaCambioSemanalPorPais(52);
    chileSemanal = this.reporteTasaCambioSemanalPorPais(56);
    otroSemanal = this.reporteTasaCambioSemanalPorPais(0);
    totalSemanal = this.reporteTasaCambioSemanalPorPais(-1);

    //Mensual
    peruMensual = this.reporteTasaCambioMensualPorPais(51);
    colombiaMensual = this.reporteTasaCambioMensualPorPais(57);
    boliviaMensual = this.reporteTasaCambioMensualPorPais(591);
    mexicoMensual = this.reporteTasaCambioMensualPorPais(52);
    chileMensual = this.reporteTasaCambioMensualPorPais(56);
    otroMensual = this.reporteTasaCambioMensualPorPais(0);
    totalMensual = this.reporteTasaCambioMensualPorPais(-1);

    let divisionPromedios = {
      descripcion: 'Precio Promedio IS/M en USD / Precio Promedio OC en USD',
      peru7Dias: this.divideZero(peruSemanal.pP_IM_USD, peruSemanal.pP_OC_USD),
      peruMes: this.divideZero(peruMensual.pP_IM_USD, peruMensual.pP_OC_USD),
      colombia7Dias: this.divideZero(
        colombiaSemanal.pP_IM_USD,
        colombiaSemanal.pP_OC_USD
      ),
      colombiaMes: this.divideZero(
        colombiaMensual.pP_IM_USD,
        colombiaMensual.pP_OC_USD
      ),
      bolivia7Dias: this.divideZero(
        boliviaSemanal.pP_IM_USD,
        boliviaSemanal.pP_OC_USD
      ),
      boliviaMes: this.divideZero(
        boliviaMensual.pP_IM_USD,
        boliviaMensual.pP_OC_USD
      ),
      mexico7Dias: this.divideZero(
        mexicoSemanal.pP_IM_USD,
        mexicoSemanal.pP_OC_USD
      ),
      mexicoMes: this.divideZero(
        mexicoMensual.pP_IM_USD,
        mexicoMensual.pP_OC_USD
      ),
      chile7Dias: this.divideZero(
        chileSemanal.pP_IM_USD,
        chileSemanal.pP_OC_USD
      ),
      chileMes: this.divideZero(chileMensual.pP_IM_USD, chileMensual.pP_OC_USD),
      otro7Dias: this.divideZero(otroSemanal.pP_IM_USD, otroSemanal.pP_OC_USD),
      otroMes: this.divideZero(otroMensual.pP_IM_USD, otroMensual.pP_OC_USD),
      total7Dias: this.divideZero(
        totalSemanal.pP_IM_USD,
        totalSemanal.pP_OC_USD
      ),
      totalMes: this.divideZero(totalMensual.pP_IM_USD, totalMensual.pP_OC_USD),
    };
    let flagColumnPeru = false;
    let flagColumnColombia = false;
    let flagColumnBolivia = false;
    let flagColumnMexico = false;
    let flagColumnChile = false;
    let flagColumnWhatsapp = false;

    let flagColumnOtros = false;
    if (
      peruSemanal.oportunidadesOCAnyIS > 0 ||
      peruMensual.oportunidadesOCAnyIS > 0 ||
      peruSemanal.oportunidadesOCTotal > 0 ||
      peruMensual.oportunidadesOCTotal > 0
    ) {
      flagColumnPeru = true;
    }
    if (
      colombiaSemanal.oportunidadesOCAnyIS > 0 ||
      colombiaMensual.oportunidadesOCAnyIS > 0 ||
      colombiaSemanal.oportunidadesOCTotal > 0 ||
      colombiaMensual.oportunidadesOCTotal > 0
    ) {
      flagColumnColombia = true;
    }
    if (
      boliviaSemanal.oportunidadesOCAnyIS > 0 ||
      boliviaMensual.oportunidadesOCAnyIS > 0 ||
      boliviaSemanal.oportunidadesOCTotal > 0 ||
      boliviaMensual.oportunidadesOCTotal > 0
    ) {
      flagColumnBolivia = true;
    }
    if (
      mexicoSemanal.oportunidadesOCAnyIS > 0 ||
      mexicoMensual.oportunidadesOCAnyIS > 0 ||
      mexicoSemanal.oportunidadesOCTotal > 0 ||
      mexicoMensual.oportunidadesOCTotal > 0
    ) {
      flagColumnMexico = true;
    }
    if (
      chileSemanal.oportunidadesOCAnyIS > 0 ||
      chileMensual.oportunidadesOCAnyIS > 0 ||
      chileSemanal.oportunidadesOCTotal > 0 ||
      chileMensual.oportunidadesOCTotal > 0
    ) {
      flagColumnChile = true;
    }
    if (
      otroSemanal.oportunidadesOCAnyIS > 0 ||
      otroMensual.oportunidadesOCAnyIS > 0 ||
      otroSemanal.oportunidadesOCTotal > 0 ||
      otroMensual.oportunidadesOCTotal > 0
    ) {
      flagColumnOtros = true;
    }

    this.flagColumnsTasaConversion.flagColumnPeru = flagColumnPeru;
    this.flagColumnsTasaConversion.flagColumnColombia = flagColumnColombia;
    this.flagColumnsTasaConversion.flagColumnBolivia = flagColumnBolivia;
    this.flagColumnsTasaConversion.flagColumnMexico = flagColumnMexico;
    this.flagColumnsTasaConversion.flagColumnChile = flagColumnChile;
    this.flagColumnsTasaConversion.flagColumnOtros = flagColumnOtros;
    /* Datos para cada fila del Grid */
    let dataTemp = [
      {
        descripcion: 'Inscritos/Matriculados (IS/M)',
        peru7Dias: peruSemanal.oportunidadesOCAnyIS,
        peruMes: peruMensual.oportunidadesOCAnyIS,
        colombia7Dias: colombiaSemanal.oportunidadesOCAnyIS,
        colombiaMes: colombiaMensual.oportunidadesOCAnyIS,
        bolivia7Dias: boliviaSemanal.oportunidadesOCAnyIS,
        boliviaMes: boliviaMensual.oportunidadesOCAnyIS,
        mexico7Dias: mexicoSemanal.oportunidadesOCAnyIS,
        mexicoMes: mexicoMensual.oportunidadesOCAnyIS,
        chile7Dias: chileSemanal.oportunidadesOCAnyIS,
        chileMes: chileMensual.oportunidadesOCAnyIS,
        otro7Dias: otroSemanal.oportunidadesOCAnyIS,
        otroMes: otroMensual.oportunidadesOCAnyIS,
        total7Dias: totalSemanal.oportunidadesOCAnyIS,
        totalMes: totalMensual.oportunidadesOCAnyIS,
      },
      {
        descripcion: 'Oportunidades cerradas (OC)',
        peru7Dias: peruSemanal.oportunidadesOCTotal,
        peruMes: peruMensual.oportunidadesOCTotal,
        colombia7Dias: colombiaSemanal.oportunidadesOCTotal,
        colombiaMes: colombiaMensual.oportunidadesOCTotal,
        bolivia7Dias: boliviaSemanal.oportunidadesOCTotal,
        boliviaMes: boliviaMensual.oportunidadesOCTotal,
        mexico7Dias: mexicoSemanal.oportunidadesOCTotal,
        mexicoMes: mexicoMensual.oportunidadesOCTotal,
        chile7Dias: chileSemanal.oportunidadesOCTotal,
        chileMes: chileMensual.oportunidadesOCTotal,
        otro7Dias: otroSemanal.oportunidadesOCTotal,
        otroMes: otroMensual.oportunidadesOCTotal,
        total7Dias: totalSemanal.oportunidadesOCTotal,
        totalMes: totalMensual.oportunidadesOCTotal,
      },
      {
        descripcion: 'Tasa conversión real (TCR)',
        peru7Dias: peruSemanal.tcReal.toFixed(0) + ' %',
        peruMes: peruMensual.tcReal.toFixed(1) + ' %',
        colombia7Dias: colombiaSemanal.tcReal.toFixed(1) + ' %',
        colombiaMes: colombiaMensual.tcReal.toFixed(1) + ' %',
        bolivia7Dias: boliviaSemanal.tcReal.toFixed(1) + ' %',
        boliviaMes: boliviaMensual.tcReal.toFixed(1) + ' %',
        mexico7Dias: mexicoSemanal.tcReal.toFixed(1) + ' %',
        mexicoMes: mexicoMensual.tcReal.toFixed(1) + ' %',
        chile7Dias: chileSemanal.tcReal.toFixed(1) + ' %',
        chileMes: chileMensual.tcReal.toFixed(1) + ' %',
        otro7Dias: otroSemanal.tcReal.toFixed(1) + ' %',
        otroMes: otroMensual.tcReal.toFixed(1) + ' %',
        total7Dias: totalSemanal.tcReal.toFixed(1) + ' %',
        totalMes: totalMensual.tcReal.toFixed(1) + ' %',
      },
      {
        descripcion: 'Tasa conversión meta (TCM)',
        peru7Dias: peruSemanal.tcMeta.toFixed(1) + ' %',
        peruMes: peruMensual.tcMeta.toFixed(1) + ' %',
        colombia7Dias: colombiaSemanal.tcMeta.toFixed(1) + ' %',
        colombiaMes: colombiaMensual.tcMeta.toFixed(1) + ' %',
        bolivia7Dias: boliviaSemanal.tcMeta.toFixed(1) + ' %',
        boliviaMes: boliviaMensual.tcMeta.toFixed(1) + ' %',
        mexico7Dias: mexicoSemanal.tcMeta.toFixed(1) + ' %',
        mexicoMes: mexicoMensual.tcMeta.toFixed(1) + ' %',
        chile7Dias: chileSemanal.tcMeta.toFixed(1) + ' %',
        chileMes: chileMensual.tcMeta.toFixed(1) + ' %',
        otro7Dias: otroSemanal.tcMeta.toFixed(1) + ' %',
        otroMes: otroMensual.tcMeta.toFixed(1) + ' %',
        total7Dias: totalSemanal.tcMeta.toFixed(1) + ' %',
        totalMes: totalMensual.tcMeta.toFixed(1) + ' %',
      },
      {
        descripcion: 'TRC / TCM',
        peru7Dias: peruSemanal.tcReal_TCMeta + ' %',
        peruMes: peruMensual.tcReal_TCMeta + ' %',
        colombia7Dias: colombiaSemanal.tcReal_TCMeta + ' %',
        colombiaMes: colombiaMensual.tcReal_TCMeta + ' %',
        bolivia7Dias: boliviaSemanal.tcReal_TCMeta + ' %',
        boliviaMes: boliviaMensual.tcReal_TCMeta + ' %',
        mexico7Dias: mexicoSemanal.tcReal_TCMeta + ' %',
        mexicoMes: mexicoMensual.tcReal_TCMeta + ' %',
        chile7Dias: chileSemanal.tcReal_TCMeta + ' %',
        chileMes: chileMensual.tcReal_TCMeta + ' %',
        otro7Dias: otroSemanal.tcReal_TCMeta + ' %',
        otroMes: otroMensual.tcReal_TCMeta + ' %',
        total7Dias: totalSemanal.tcReal_TCMeta + ' %',
        totalMes: totalMensual.tcReal_TCMeta + ' %',
      },
      {
        descripcion: 'Precio Promedio IS/M en USD',
        peru7Dias: peruSemanal.pP_IM_USD,
        peruMes: peruMensual.pP_IM_USD,
        colombia7Dias: colombiaSemanal.pP_IM_USD,
        colombiaMes: colombiaMensual.pP_IM_USD,
        bolivia7Dias: boliviaSemanal.pP_IM_USD,
        boliviaMes: boliviaMensual.pP_IM_USD,
        mexico7Dias: mexicoSemanal.pP_IM_USD,
        mexicoMes: mexicoMensual.pP_IM_USD,
        chile7Dias: chileSemanal.pP_IM_USD,
        chileMes: chileMensual.pP_IM_USD,
        otro7Dias: otroSemanal.pP_IM_USD,
        otroMes: otroMensual.pP_IM_USD,
        total7Dias: totalSemanal.pP_IM_USD,
        totalMes: totalMensual.pP_IM_USD,
      },
      {
        descripcion: 'Precio Promedio OC en USD',
        peru7Dias: peruSemanal.pP_OC_USD,
        peruMes: peruMensual.pP_OC_USD,
        colombia7Dias: colombiaSemanal.pP_OC_USD,
        colombiaMes: colombiaMensual.pP_OC_USD,
        bolivia7Dias: boliviaSemanal.pP_OC_USD,
        boliviaMes: boliviaMensual.pP_OC_USD,
        mexico7Dias: mexicoSemanal.pP_OC_USD,
        mexicoMes: mexicoMensual.pP_OC_USD,
        chile7Dias: chileSemanal.pP_OC_USD,
        chileMes: chileMensual.pP_OC_USD,
        otro7Dias: otroSemanal.pP_OC_USD,
        otroMes: otroMensual.pP_OC_USD,
        total7Dias: totalSemanal.pP_OC_USD,
        totalMes: totalMensual.pP_OC_USD,
      },
      {
        descripcion: 'Precio Promedio IS/M en USD / Precio Promedio OC en USD',
        peru7Dias: divisionPromedios.peru7Dias,
        peruMes: divisionPromedios.peruMes,
        colombia7Dias: divisionPromedios.colombia7Dias,
        colombiaMes: divisionPromedios.colombiaMes,
        bolivia7Dias: divisionPromedios.bolivia7Dias,
        boliviaMes: divisionPromedios.boliviaMes,
        mexico7Dias: divisionPromedios.mexico7Dias,
        mexicoMes: divisionPromedios.mexicoMes,
        chile7Dias: divisionPromedios.chile7Dias,
        chileMes: divisionPromedios.chileMes,
        otro7Dias: divisionPromedios.otro7Dias,
        otroMes: divisionPromedios.otroMes,
        total7Dias: divisionPromedios.total7Dias,
        totalMes: divisionPromedios.totalMes,
      },
      {
        descripcion: 'Ingreso en el mes en USD',
        peru7Dias: peruSemanal.ingresoMes.toFixed(0),
        peruMes: peruMensual.ingresoMes.toFixed(0),
        colombia7Dias: colombiaSemanal.ingresoMes.toFixed(0),
        colombiaMes: colombiaMensual.ingresoMes.toFixed(0),
        bolivia7Dias: boliviaSemanal.ingresoMes.toFixed(0),
        boliviaMes: boliviaMensual.ingresoMes.toFixed(0),
        mexico7Dias: mexicoSemanal.ingresoMes.toFixed(0),
        mexicoMes: mexicoMensual.ingresoMes.toFixed(0),
        chile7Dias: chileSemanal.ingresoMes.toFixed(0),
        chileMes: chileMensual.ingresoMes.toFixed(0),
        otro7Dias: otroSemanal.ingresoMes.toFixed(0),
        otroMes: otroMensual.ingresoMes.toFixed(0),
        total7Dias: totalSemanal.ingresoMes.toFixed(0),
        totalMes: totalMensual.ingresoMes.toFixed(0),
      },
      {
        descripcion: 'Ingreso en el mes (%)',
        peru7Dias: peruSemanal.porcentajeIngresoMes + ' %',
        peruMes: peruMensual.porcentajeIngresoMes + ' %',
        colombia7Dias: colombiaSemanal.porcentajeIngresoMes + ' %',
        colombiaMes: colombiaMensual.porcentajeIngresoMes + ' %',
        bolivia7Dias: boliviaSemanal.porcentajeIngresoMes + ' %',
        boliviaMes: boliviaMensual.porcentajeIngresoMes + ' %',
        mexico7Dias: mexicoSemanal.porcentajeIngresoMes + ' %',
        mexicoMes: mexicoMensual.porcentajeIngresoMes + ' %',
        chile7Dias: chileSemanal.porcentajeIngresoMes + ' %',
        chileMes: chileMensual.porcentajeIngresoMes + ' %',
        otro7Dias: otroSemanal.porcentajeIngresoMes + ' %',
        otroMes: otroMensual.porcentajeIngresoMes + ' %',
        total7Dias: totalSemanal.porcentajeIngresoMes + ' %',
        totalMes: totalMensual.porcentajeIngresoMes + ' %',
      },
      {
        descripcion: 'descuento promedio (%)',
        peru7Dias: peruSemanal.descuentoPromedio + ' %',
        peruMes: peruMensual.descuentoPromedio + ' %',
        colombia7Dias: colombiaSemanal.descuentoPromedio + ' %',
        colombiaMes: colombiaMensual.descuentoPromedio + ' %',
        bolivia7Dias: boliviaSemanal.descuentoPromedio + ' %',
        boliviaMes: boliviaMensual.descuentoPromedio + ' %',
        mexico7Dias: mexicoSemanal.descuentoPromedio + ' %',
        mexicoMes: mexicoMensual.descuentoPromedio + ' %',
        chile7Dias: chileSemanal.descuentoPromedio + ' %',
        chileMes: chileMensual.descuentoPromedio + ' %',
        otro7Dias: otroSemanal.descuentoPromedio + ' %',
        otroMes: otroMensual.descuentoPromedio + ' %',
        total7Dias: totalSemanal.descuentoPromedio + ' %',
        totalMes: totalMensual.descuentoPromedio + ' %',
      },
      {
        descripcion: 'Ingreso real en USD (IR)',
        peru7Dias: peruSemanal.ingresoReal.toFixed(0),
        peruMes: peruMensual.ingresoReal.toFixed(0),
        colombia7Dias: colombiaSemanal.ingresoReal.toFixed(0),
        colombiaMes: colombiaMensual.ingresoReal.toFixed(0),
        bolivia7Dias: boliviaSemanal.ingresoReal.toFixed(0),
        boliviaMes: boliviaMensual.ingresoReal.toFixed(0),
        mexico7Dias: mexicoSemanal.ingresoReal.toFixed(0),
        mexicoMes: mexicoMensual.ingresoReal.toFixed(0),
        chile7Dias: chileSemanal.ingresoReal.toFixed(0),
        chileMes: chileMensual.ingresoReal.toFixed(0),
        otro7Dias: otroSemanal.ingresoReal.toFixed(0),
        otroMes: otroMensual.ingresoReal.toFixed(0),
        total7Dias: totalSemanal.ingresoReal.toFixed(0),
        totalMes: totalMensual.ingresoReal.toFixed(0),
      },
      {
        descripcion: 'Ingreso meta en USD (IM)',
        peru7Dias: peruSemanal.ingresoMeta,
        peruMes: peruMensual.ingresoMeta,
        colombia7Dias: colombiaSemanal.ingresoMeta,
        colombiaMes: colombiaMensual.ingresoMeta,
        bolivia7Dias: boliviaSemanal.ingresoMeta,
        boliviaMes: boliviaMensual.ingresoMeta,
        mexico7Dias: mexicoSemanal.ingresoMeta,
        mexicoMes: mexicoMensual.ingresoMeta,
        chile7Dias: chileSemanal.ingresoMeta,
        chileMes: chileMensual.ingresoMeta,
        otro7Dias: otroSemanal.ingresoMeta,
        otroMes: otroMensual.ingresoMeta,
        total7Dias: totalSemanal.ingresoMeta,
        totalMes: totalMensual.ingresoMeta,
      },
      {
        descripcion: 'IR/IM (%)',
        peru7Dias: peruSemanal.iR_IM + ' %',
        peruMes: peruMensual.iR_IM + ' %',
        colombia7Dias: colombiaSemanal.iR_IM + ' %',
        colombiaMes: colombiaMensual.iR_IM + ' %',
        bolivia7Dias: boliviaSemanal.iR_IM + ' %',
        boliviaMes: boliviaMensual.iR_IM + ' %',
        mexico7Dias: mexicoSemanal.iR_IM + ' %',
        mexicoMes: mexicoMensual.iR_IM + ' %',
        chile7Dias: chileSemanal.iR_IM + ' %',
        chileMes: chileMensual.iR_IM + ' %',
        otro7Dias: otroSemanal.iR_IM + ' %',
        otroMes: otroMensual.iR_IM + ' %',
        total7Dias: totalSemanal.iR_IM + ' %',
        totalMes: totalMensual.iR_IM + ' %',
      },
    ];
    this.gridTasaConversion.data = dataTemp;
    this.gridTasaConversion.loading = false;
  }
  flagColumnsTasaConversion = {
    flagColumnPeru: true,
    flagColumnColombia: true,
    flagColumnBolivia: true,
    flagColumnMexico: true,
    flagColumnChile: true,
    flagColumnWhatsapp: true,
    flagColumnOtros: true,
  };

  setDataGridTasaConversionPredictiva(dataTasaConversion: {
    reporteTasaDeCambioMensual: Array<IReporteTasaCambioPredictivo>;
    reporteTasaDeCambioSemanal: Array<IReporteTasaCambioPredictivo>;
  }) {
    let peruSemanal: IReporteTasaCambioPredictivo;
    let peruMensual: IReporteTasaCambioPredictivo;
    let mexicoSemanal: IReporteTasaCambioPredictivo;
    let mexicoMensual: IReporteTasaCambioPredictivo;
    let boliviaSemanal: IReporteTasaCambioPredictivo;
    let boliviaMensual: IReporteTasaCambioPredictivo;
    let colombiaSemanal: IReporteTasaCambioPredictivo;
    let colombiaMensual: IReporteTasaCambioPredictivo;
    let chileSemanal: IReporteTasaCambioPredictivo;
    let chileMensual: IReporteTasaCambioPredictivo;
    let otroSemanal: IReporteTasaCambioPredictivo;
    let otroMensual: IReporteTasaCambioPredictivo;
    let totalSemanal: IReporteTasaCambioPredictivo;
    let totalMensual: IReporteTasaCambioPredictivo;

    /* Redondea los valores porcentuales a enteros */
    for (let dataPorPais of dataTasaConversion.reporteTasaDeCambioSemanal) {
      dataPorPais.tcReal = Number(dataPorPais.tcReal.toFixed(1));
      dataPorPais.tcMeta = Number(dataPorPais.tcMeta.toFixed(1));
      dataPorPais.tcReal_TCMeta = Math.round(dataPorPais.tcReal_TCMeta);
    }
    for (let dataPorPais of dataTasaConversion.reporteTasaDeCambioMensual) {
      dataPorPais.tcReal = Number(dataPorPais.tcReal.toFixed(1));
      dataPorPais.tcMeta = Number(dataPorPais.tcMeta.toFixed(1));
      dataPorPais.tcReal_TCMeta = Math.round(dataPorPais.tcReal_TCMeta);
    }
    this.reporteTasaDeCambioSemanalPredictivo =
      dataTasaConversion.reporteTasaDeCambioSemanal;
    this.reporteTasaDeCambioMensualPredictivo =
      dataTasaConversion.reporteTasaDeCambioMensual;
    peruSemanal = this.reporteTasaCambioSemanalPorPaisPredictivo(51);
    colombiaSemanal = this.reporteTasaCambioSemanalPorPaisPredictivo(57);
    boliviaSemanal = this.reporteTasaCambioSemanalPorPaisPredictivo(591);
    mexicoSemanal = this.reporteTasaCambioSemanalPorPaisPredictivo(52);
    chileSemanal = this.reporteTasaCambioSemanalPorPaisPredictivo(56);
    otroSemanal = this.reporteTasaCambioSemanalPorPaisPredictivo(0);
    totalSemanal = this.reporteTasaCambioSemanalPorPaisPredictivo(-1);

    //Mensual
    peruMensual = this.reporteTasaCambioMensualPorPaisPredictivo(51);
    colombiaMensual = this.reporteTasaCambioMensualPorPaisPredictivo(57);
    boliviaMensual = this.reporteTasaCambioMensualPorPaisPredictivo(591);
    mexicoMensual = this.reporteTasaCambioMensualPorPaisPredictivo(52);
    chileMensual = this.reporteTasaCambioMensualPorPaisPredictivo(56);
    otroMensual = this.reporteTasaCambioMensualPorPaisPredictivo(0);
    totalMensual = this.reporteTasaCambioMensualPorPaisPredictivo(-1);

    let flagColumnPeru = false;
    let flagColumnColombia = false;
    let flagColumnBolivia = false;
    let flagColumnMexico = false;
    let flagColumnChile = false;
    let flagColumnOtros = false;
    if (
      peruSemanal.oportunidadesOCAnyIS > 0 ||
      peruMensual.oportunidadesOCAnyIS > 0 ||
      peruSemanal.oportunidadesOCTotal > 0 ||
      peruMensual.oportunidadesOCTotal > 0
    ) {
      flagColumnPeru = true;
    }
    if (
      colombiaSemanal.oportunidadesOCAnyIS > 0 ||
      colombiaMensual.oportunidadesOCAnyIS > 0 ||
      colombiaSemanal.oportunidadesOCTotal > 0 ||
      colombiaMensual.oportunidadesOCTotal > 0
    ) {
      flagColumnColombia = true;
    }
    if (
      boliviaSemanal.oportunidadesOCAnyIS > 0 ||
      boliviaMensual.oportunidadesOCAnyIS > 0 ||
      boliviaSemanal.oportunidadesOCTotal > 0 ||
      boliviaMensual.oportunidadesOCTotal > 0
    ) {
      flagColumnBolivia = true;
    }
    if (
      mexicoSemanal.oportunidadesOCAnyIS > 0 ||
      mexicoMensual.oportunidadesOCAnyIS > 0 ||
      mexicoSemanal.oportunidadesOCTotal > 0 ||
      mexicoMensual.oportunidadesOCTotal > 0
    ) {
      flagColumnMexico = true;
    }
    if (
      chileSemanal.oportunidadesOCAnyIS > 0 ||
      chileMensual.oportunidadesOCAnyIS > 0 ||
      chileSemanal.oportunidadesOCTotal > 0 ||
      chileMensual.oportunidadesOCTotal > 0
    ) {
      flagColumnChile = true;
    }
    if (
      otroSemanal.oportunidadesOCAnyIS > 0 ||
      otroMensual.oportunidadesOCAnyIS > 0 ||
      otroSemanal.oportunidadesOCTotal > 0 ||
      otroMensual.oportunidadesOCTotal > 0
    ) {
      flagColumnOtros = true;
    }

    this.flagColumnsTasaConversionPredictiva.flagColumnPeru = flagColumnPeru;
    this.flagColumnsTasaConversionPredictiva.flagColumnColombia =
      flagColumnColombia;
    this.flagColumnsTasaConversionPredictiva.flagColumnBolivia =
      flagColumnBolivia;
    this.flagColumnsTasaConversionPredictiva.flagColumnMexico =
      flagColumnMexico;
    this.flagColumnsTasaConversionPredictiva.flagColumnChile = flagColumnChile;
    this.flagColumnsTasaConversionPredictiva.flagColumnOtros = flagColumnOtros;
    /* Datos para cada fila del Grid */
    let dataTemp = [
      {
        descripcion: 'Inscritos/Matriculados (IS/M)',
        peru7Dias: peruSemanal.oportunidadesOCAnyIS,
        peruMes: peruMensual.oportunidadesOCAnyIS,
        colombia7Dias: colombiaSemanal.oportunidadesOCAnyIS,
        colombiaMes: colombiaMensual.oportunidadesOCAnyIS,
        bolivia7Dias: boliviaSemanal.oportunidadesOCAnyIS,
        boliviaMes: boliviaMensual.oportunidadesOCAnyIS,
        mexico7Dias: mexicoSemanal.oportunidadesOCAnyIS,
        mexicoMes: mexicoMensual.oportunidadesOCAnyIS,
        chile7Dias: chileSemanal.oportunidadesOCAnyIS,
        chileMes: chileMensual.oportunidadesOCAnyIS,
        otro7Dias: otroSemanal.oportunidadesOCAnyIS,
        otroMes: otroMensual.oportunidadesOCAnyIS,
        total7Dias: totalSemanal.oportunidadesOCAnyIS,
        totalMes: totalMensual.oportunidadesOCAnyIS,
      },
      {
        descripcion: 'Oportunidades cerradas (OC)',
        peru7Dias: peruSemanal.oportunidadesOCTotal,
        peruMes: peruMensual.oportunidadesOCTotal,
        colombia7Dias: colombiaSemanal.oportunidadesOCTotal,
        colombiaMes: colombiaMensual.oportunidadesOCTotal,
        bolivia7Dias: boliviaSemanal.oportunidadesOCTotal,
        boliviaMes: boliviaMensual.oportunidadesOCTotal,
        mexico7Dias: mexicoSemanal.oportunidadesOCTotal,
        mexicoMes: mexicoMensual.oportunidadesOCTotal,
        chile7Dias: chileSemanal.oportunidadesOCTotal,
        chileMes: chileMensual.oportunidadesOCTotal,
        otro7Dias: otroSemanal.oportunidadesOCTotal,
        otroMes: otroMensual.oportunidadesOCTotal,
        total7Dias: totalSemanal.oportunidadesOCTotal,
        totalMes: totalMensual.oportunidadesOCTotal,
      },
      {
        descripcion: 'Tasa conversión real (TCR)',
        peru7Dias: peruSemanal.tcReal.toFixed(0) + ' %',
        peruMes: peruMensual.tcReal.toFixed(1) + ' %',
        colombia7Dias: colombiaSemanal.tcReal.toFixed(1) + ' %',
        colombiaMes: colombiaMensual.tcReal.toFixed(1) + ' %',
        bolivia7Dias: boliviaSemanal.tcReal.toFixed(1) + ' %',
        boliviaMes: boliviaMensual.tcReal.toFixed(1) + ' %',
        mexico7Dias: mexicoSemanal.tcReal.toFixed(1) + ' %',
        mexicoMes: mexicoMensual.tcReal.toFixed(1) + ' %',
        chile7Dias: chileSemanal.tcReal.toFixed(1) + ' %',
        chileMes: chileMensual.tcReal.toFixed(1) + ' %',
        otro7Dias: otroSemanal.tcReal.toFixed(1) + ' %',
        otroMes: otroMensual.tcReal.toFixed(1) + ' %',
        total7Dias: totalSemanal.tcReal.toFixed(1) + ' %',
        totalMes: totalMensual.tcReal.toFixed(1) + ' %',
      },
      {
        descripcion: 'Tasa conversión meta (TCM)',
        peru7Dias: peruSemanal.tcMeta.toFixed(1) + ' %',
        peruMes: peruMensual.tcMeta.toFixed(1) + ' %',
        colombia7Dias: colombiaSemanal.tcMeta.toFixed(1) + ' %',
        colombiaMes: colombiaMensual.tcMeta.toFixed(1) + ' %',
        bolivia7Dias: boliviaSemanal.tcMeta.toFixed(1) + ' %',
        boliviaMes: boliviaMensual.tcMeta.toFixed(1) + ' %',
        mexico7Dias: mexicoSemanal.tcMeta.toFixed(1) + ' %',
        mexicoMes: mexicoMensual.tcMeta.toFixed(1) + ' %',
        chile7Dias: chileSemanal.tcMeta.toFixed(1) + ' %',
        chileMes: chileMensual.tcMeta.toFixed(1) + ' %',
        otro7Dias: otroSemanal.tcMeta.toFixed(1) + ' %',
        otroMes: otroMensual.tcMeta.toFixed(1) + ' %',
        total7Dias: totalSemanal.tcMeta.toFixed(1) + ' %',
        totalMes: totalMensual.tcMeta.toFixed(1) + ' %',
      },
      {
        descripcion: 'TRC / TCM',
        peru7Dias: peruSemanal.tcReal_TCMeta + ' %',
        peruMes: peruMensual.tcReal_TCMeta + ' %',
        colombia7Dias: colombiaSemanal.tcReal_TCMeta + ' %',
        colombiaMes: colombiaMensual.tcReal_TCMeta + ' %',
        bolivia7Dias: boliviaSemanal.tcReal_TCMeta + ' %',
        boliviaMes: boliviaMensual.tcReal_TCMeta + ' %',
        mexico7Dias: mexicoSemanal.tcReal_TCMeta + ' %',
        mexicoMes: mexicoMensual.tcReal_TCMeta + ' %',
        chile7Dias: chileSemanal.tcReal_TCMeta + ' %',
        chileMes: chileMensual.tcReal_TCMeta + ' %',
        otro7Dias: otroSemanal.tcReal_TCMeta + ' %',
        otroMes: otroMensual.tcReal_TCMeta + ' %',
        total7Dias: totalSemanal.tcReal_TCMeta + ' %',
        totalMes: totalMensual.tcReal_TCMeta + ' %',
      },
    ];
    this.gridTasaConversionPredictiva.data = dataTemp;
    this.gridTasaConversionPredictiva.loading = false;
  }
  flagColumnsTasaConversionPredictiva = {
    flagColumnPeru: true,
    flagColumnColombia: true,
    flagColumnBolivia: true,
    flagColumnMexico: true,
    flagColumnChile: true,
    flagColumnOtros: true,
  };

  setDataReporteGeneralConLlamada(
    reporteCambiosDeFaseOportunidadConLlamada: IReporteCambioFaseOportunidad[]
  ) {
    let respuesta: IReporteCambioFaseOportunidad[] = [];
    let fasesOrigen: string[] = [];

    reporteCambiosDeFaseOportunidadConLlamada.forEach((element) => {
      if (
        element.faseDestino !== 'RN5' &&
        element.faseDestino !== 'OM' &&
        element.faseDestino !== 'OD'
      ) {
        respuesta.push(element);
        if (fasesOrigen.indexOf(element.faseOrigen) == -1) {
          fasesOrigen.push(element.faseOrigen);
        }
      }
    });

    let myMap = new Map();
    fasesOrigen.forEach((element) => {
      myMap.set(element, {
        fase: element,
        suma: respuesta
          .filter((e) => e.faseOrigen == element)
          .reduce((a, b) => a + b.numeroRegistros, 0),
      });
    });

    this.pivotGridConLlamada.loading = false;
    this.pivotGridConLlamada.data = respuesta;
  }

  setDataReporteGeneralSinLlamada(
    reporteCambiosDeFaseOportunidadSinLlamada: IReporteCambioFaseOportunidad[]
  ) {
    let respuesta: IReporteCambioFaseOportunidad[] = [];
    let fasesOrigen: string[] = [];

    reporteCambiosDeFaseOportunidadSinLlamada.forEach((element) => {
      if (
        element.faseDestino !== 'BNC1' &&
        element.faseDestino !== 'E' &&
        element.faseDestino !== 'BIC' &&
        element.faseDestino !== 'RN5' &&
        element.faseDestino !== 'OM' &&
        element.faseDestino !== 'OD'
      ) {
        respuesta.push(element);
        if (fasesOrigen.indexOf(element.faseOrigen) == -1) {
          fasesOrigen.push(element.faseOrigen);
        }
      }
    });

    this.pivotGridSinLlamada.loading = false;
    this.pivotGridSinLlamada.data = respuesta;
  }

  setDataReporteControlRNyRN1(
    reporteControlRN1yRN2: IReporteCambioFaseOportunidad[]
  ) {
    this.pivotGridRNyRN1.data = reporteControlRN1yRN2;
    this.pivotGridRNyRN1.loading = false;
  }

  /* Calculo de Campo: Precio Promedio IS/M en USD / Precio Promedio OC en USD */
  divideZero(a: number, b: number) {
    if (b == 0) {
      return '-';
    } else {
      let res = (a / b) * 100;
      return `${res.toFixed(0)} %`;
    }
  }
  /**
   * Genera la informacion para el reporte de control de cambios de fase
   * @param controlCambiodeFase
   */
  private setDataGridControlActividades(
    controlCambiodeFase: IControlCambioFase[]
  ) {
    let arregloTemp: IControlCambioFase[] = [];
    let obj: ControlCambioFase = new ControlCambioFase();
    let faseTemporal: IControlCambioFase[] = [];
    faseTemporal = controlCambiodeFase.filter(
      (item) => item.faseOrigen == 'BNC'
    );
    if (faseTemporal.length > 0) {
      arregloTemp.push(faseTemporal[0]);
    } else {
      obj.faseOrigen = 'BNC';
      arregloTemp.push(obj);
    }

    faseTemporal = controlCambiodeFase.filter(
      (item) => item.faseOrigen == 'IT'
    );
    if (faseTemporal.length != 0) {
      arregloTemp.push(faseTemporal[0]);
    } else {
      obj.faseOrigen = 'IT';
      arregloTemp.push(obj);
    }

    faseTemporal = controlCambiodeFase.filter(
      (item: any) => item.faseOrigen == 'IP'
    );
    if (faseTemporal.length != 0) {
      arregloTemp.push(faseTemporal[0]);
    } else {
      obj.faseOrigen = 'IP';
      arregloTemp.push(obj);
    }

    faseTemporal = controlCambiodeFase.filter(
      (item) => item.faseOrigen == 'PF'
    );
    if (faseTemporal.length != 0) {
      arregloTemp.push(faseTemporal[0]);
    } else {
      obj.faseOrigen = 'PF';
      arregloTemp.push(obj);
    }

    // faseTemporal = controlCambiodeFase.filter(
    //   (item) => item.faseOrigen == 'BNC-1'
    // );
    // if (faseTemporal.length != 0) {
    //   arregloTemp.push(faseTemporal[0]);
    // } else {
    //   obj.faseOrigen = 'BNC-1';
    //   arregloTemp.push(obj);
    // }

    let contactabilidadBNC =
      (arregloTemp[0].actividadesEjecutadas /
        arregloTemp[0].actividadesTotales) *
      100;
    let contactabilidadIT =
      (arregloTemp[1].actividadesEjecutadas /
        arregloTemp[1].actividadesTotales) *
      100;
    let contactabilidadIP =
      (arregloTemp[2].actividadesEjecutadas /
        arregloTemp[2].actividadesTotales) *
      100;
    let contactabilidadPF =
      (arregloTemp[3].actividadesEjecutadas /
        arregloTemp[3].actividadesTotales) *
      100;
    // let contactabilidadBNC_1 =
    //   (arregloTemp[4].actividadesEjecutadas /
    //     arregloTemp[4].actividadesTotales) *
    //   100;

    this.gridControlCambiodeFase.data = [
      {
        descripcion: 'Valor de actividades ejecutadas',
        BNC: arregloTemp[0].actividadesEjecutadas,
        IT: arregloTemp[1].actividadesEjecutadas,
        IP: arregloTemp[2].actividadesEjecutadas,
        PF: arregloTemp[3].actividadesEjecutadas || 0,
        // BNC_1: arregloTemp[4].actividadesEjecutadas || 0,
      },
      {
        descripcion: 'Valor de actividades reprogramadas automaticas',
        BNC: arregloTemp[0].actividadesProgramadasAutomaticas,
        IT: arregloTemp[1].actividadesProgramadasAutomaticas,
        IP: arregloTemp[2].actividadesProgramadasAutomaticas,
        PF: arregloTemp[3].actividadesProgramadasAutomaticas,
        // BNC_1: arregloTemp[4].actividadesProgramadasAutomaticas,
      },
      {
        descripcion: 'Valor de actividades reprogramadas manuales',
        BNC: arregloTemp[0].actividadesProgramadasManuales,
        IT: arregloTemp[1].actividadesProgramadasManuales,
        IP: arregloTemp[2].actividadesProgramadasManuales,
        PF: arregloTemp[3].actividadesProgramadasManuales,
        // BNC_1: arregloTemp[4].actividadesProgramadasManuales,
      },
      {
        descripcion: 'Actividades Totales',
        BNC: arregloTemp[0].actividadesTotales,
        IT: arregloTemp[1].actividadesTotales,
        IP: arregloTemp[2].actividadesTotales,
        PF: arregloTemp[3].actividadesTotales,
        // BNC_1: arregloTemp[4].actividadesProgramadasManuales,
      },
      {
        descripcion: 'Contactabilidad (%)',
        BNC: !isNaN(contactabilidadBNC)
          ? `${contactabilidadBNC.toFixed(0)}%`
          : '0%',
        IT: !isNaN(contactabilidadIT)
          ? `${contactabilidadIT.toFixed(0)}%`
          : '0%',
        IP: !isNaN(contactabilidadIP)
          ? `${contactabilidadIP.toFixed(0)}%`
          : '0%',
        PF: !isNaN(contactabilidadPF)
          ? `${contactabilidadPF.toFixed(0)}%`
          : '0%',
        // BNC_1: !isNaN(contactabilidadBNC_1)
        //   ? `${contactabilidadBNC_1.toFixed(0)}%`
        //   : '0%',
      },
      {
        descripcion: 'Duración promedio de actividades ejecutadas en minutos',
        BNC: (arregloTemp[0].minPromedioEjecutadas / 60).toFixed(1),
        IT: (arregloTemp[1].minPromedioEjecutadas / 60).toFixed(1),
        IP: (arregloTemp[2].minPromedioEjecutadas / 60).toFixed(1),
        PF: (arregloTemp[3].minPromedioEjecutadas / 60).toFixed(1),
        // BNC_1: (arregloTemp[4].minPromedioEjecutadas / 60).toFixed(1),
      },
      {
        descripcion: 'Duración promedio de reprogramadas manuales en minutos',
        BNC: (arregloTemp[0].minPromedioprogramadasmanuales / 60).toFixed(1),
        IT: (arregloTemp[1].minPromedioprogramadasmanuales / 60).toFixed(1),
        IP: (arregloTemp[2].minPromedioprogramadasmanuales / 60).toFixed(1),
        PF: (arregloTemp[3].minPromedioprogramadasmanuales / 60).toFixed(1),
        // BNC_1: (arregloTemp[4].minPromedioprogramadasmanuales / 60).toFixed(1),
      },
      {
        descripcion:
          'Número promedio de intentos de llamadas en actividades reprogramadas automaticas',
        BNC: arregloTemp[0].numIntentoLlamadasPromedio.toFixed(1),
        IT: arregloTemp[1].numIntentoLlamadasPromedio.toFixed(1),
        IP: arregloTemp[2].numIntentoLlamadasPromedio.toFixed(1),
        PF: arregloTemp[3].numIntentoLlamadasPromedio.toFixed(1),
        // BNC_1: arregloTemp[4].numIntentoLlamadasPromedio.toFixed(1),
      },
      {
        descripcion:
          'Tiempo de trimbado promedio de llamadas en actividades reprogramadas automaticas en segundos',
        BNC: arregloTemp[0].totalTimbradoAutomatica,
        IT: arregloTemp[1].totalTimbradoAutomatica,
        IP: arregloTemp[2].totalTimbradoAutomatica,
        PF: arregloTemp[3].totalTimbradoAutomatica,
        // BNC_1: arregloTemp[4].totalTimbradoAutomatica,
      },
      {
        descripcion:
          'Tiempo Util',
        BNC: arregloTemp[0].tiempoUtil == null?'0 %':arregloTemp[0].tiempoUtil+' %',
        IT: arregloTemp[1].tiempoUtil == null?'0 %':arregloTemp[1].tiempoUtil+' %',
        IP: arregloTemp[2].tiempoUtil == null?'0 %':arregloTemp[2].tiempoUtil+' %',
        PF: arregloTemp[3].tiempoUtil == null?'0 %':arregloTemp[3].tiempoUtil+' %',
        // BNC_1: arregloTemp[4].totalTimbradoAutomatica,
      },
    ];


    this.gridActividadesinLlamadaRegistrada.data= [
      {
        descripcion: 'Actividades ejecutadas sin llamada',
        BNC: arregloTemp[0].programadasEjecutadasSinLlamada,
        IT: arregloTemp[1].programadasEjecutadasSinLlamada,
        IP: arregloTemp[2].programadasEjecutadasSinLlamada,
        PF: arregloTemp[3].programadasEjecutadasSinLlamada,
        // BNC_1: arregloTemp[4].programadasEjecutadasSinLlamada,
      },
      {
        descripcion: 'Actividades reprogramadas automaticas sin llamada',
        BNC: arregloTemp[0].programadasAutomaticasSinLlamada,
        IT: arregloTemp[1].programadasAutomaticasSinLlamada,
        IP: arregloTemp[2].programadasAutomaticasSinLlamada,
        PF: arregloTemp[3].programadasAutomaticasSinLlamada,
        // BNC_1: arregloTemp[4].programadasEjecutadasSinLlamada,
      },
      {
        descripcion: 'Actividades reprogramadas manuales sin llamada',
        BNC: arregloTemp[0].programadasManualesSinLlamada,
        IT: arregloTemp[1].programadasManualesSinLlamada,
        IP: arregloTemp[2].programadasManualesSinLlamada,
        PF: arregloTemp[3].programadasManualesSinLlamada,
        // BNC_1: arregloTemp[4].programadasEjecutadasSinLlamada,
      },
    ]

    this.gridControlCambiodeFase.loading = false;
    this.gridActividadesinLlamadaRegistrada.loading = false;
  }


    /**
   * Genera la informacion para el reporte de control de cambios de fase
   * @param controlCambiodeFase
   */
    private setDataGridControlActividadesOtroMedio(
      controlCambiodeFase: IControlCambioFase[]
    ) {
      let arregloTemp: IControlCambioFase[] = [];
      let obj: ControlCambioFase = new ControlCambioFase();
      let faseTemporal: IControlCambioFase[] = [];
      faseTemporal = controlCambiodeFase.filter(
        (item) => item.faseOrigen == 'BNC'
      );
      if (faseTemporal.length > 0) {
        arregloTemp.push(faseTemporal[0]);
      } else {
        obj.faseOrigen = 'BNC';
        arregloTemp.push(obj);
      }
  
      faseTemporal = controlCambiodeFase.filter(
        (item) => item.faseOrigen == 'IT'
      );
      if (faseTemporal.length != 0) {
        arregloTemp.push(faseTemporal[0]);
      } else {
        obj.faseOrigen = 'IT';
        arregloTemp.push(obj);
      }
  
      faseTemporal = controlCambiodeFase.filter(
        (item: any) => item.faseOrigen == 'IP'
      );
      if (faseTemporal.length != 0) {
        arregloTemp.push(faseTemporal[0]);
      } else {
        obj.faseOrigen = 'IP';
        arregloTemp.push(obj);
      }
  
      faseTemporal = controlCambiodeFase.filter(
        (item) => item.faseOrigen == 'PF'
      );
      if (faseTemporal.length != 0) {
        arregloTemp.push(faseTemporal[0]);
      } else {
        obj.faseOrigen = 'PF';
        arregloTemp.push(obj);
      }
  
      // faseTemporal = controlCambiodeFase.filter(
      //   (item) => item.faseOrigen == 'BNC-1'
      // );
      // if (faseTemporal.length != 0) {
      //   arregloTemp.push(faseTemporal[0]);
      // } else {
      //   obj.faseOrigen = 'BNC-1';
      //   arregloTemp.push(obj);
      // }
  
      let contactabilidadBNC =
        (arregloTemp[0].actividadesEjecutadas /
          arregloTemp[0].actividadesTotales) *
        100;
      let contactabilidadIT =
        (arregloTemp[1].actividadesEjecutadas /
          arregloTemp[1].actividadesTotales) *
        100;
      let contactabilidadIP =
        (arregloTemp[2].actividadesEjecutadas /
          arregloTemp[2].actividadesTotales) *
        100;
      let contactabilidadPF =
        (arregloTemp[3].actividadesEjecutadas /
          arregloTemp[3].actividadesTotales) *
        100;
      // let contactabilidadBNC_1 =
      //   (arregloTemp[4].actividadesEjecutadas /
      //     arregloTemp[4].actividadesTotales) *
      //   100;
  
  
      this.gridActividadesPorOtroMedio.data= [
        {
          descripcion: 'Actividades ejecutadas por otro medio',
          BNC: arregloTemp[0].programadasEjecutadasOtroMedio,
          IT: arregloTemp[1].programadasEjecutadasOtroMedio,
          IP: arregloTemp[2].programadasEjecutadasOtroMedio,
          PF: arregloTemp[3].programadasEjecutadasOtroMedio,
          // BNC_1: arregloTemp[4].programadasEjecutadasSinLlamada,
        },
        {
          descripcion: 'Actividades reprogramadas automaticas por otro medio',
          BNC: arregloTemp[0].programadasAutomaticasOtroMedio,
          IT: arregloTemp[1].programadasAutomaticasOtroMedio,
          IP: arregloTemp[2].programadasAutomaticasOtroMedio,
          PF: arregloTemp[3].programadasAutomaticasOtroMedio,
          // BNC_1: arregloTemp[4].programadasEjecutadasSinLlamada,
        },
        {
          descripcion: 'Actividades reprogramadas manuales por otro medio',
          BNC: arregloTemp[0].programadasManualesOtroMedio,
          IT: arregloTemp[1].programadasManualesOtroMedio,
          IP: arregloTemp[2].programadasManualesOtroMedio,
          PF: arregloTemp[3].programadasManualesOtroMedio,
          // BNC_1: arregloTemp[4].programadasEjecutadasSinLlamada,
        },
      ]
      this.gridActividadesPorOtroMedio.loading=false;
    }

  setDataReporteGeneral(
    reporteCambiosDeFaseOportunidad: IReporteCambioFaseOportunidad[],
    reporteCambiosDeFaseOportunidadPredictivo: IReporteCambioFaseOportunidad[]
  ) {
    let respuesta: IReporteCambioFaseOportunidad[] = [];
    let respuestaPredictivo: IReporteCambioFaseOportunidad[] = [];
    let fasesOrigen: string[] = [];
    let fasesOrigenPredictivo: string[] = [];

    let fasesDestinoRN5: IReporteCambioFaseOportunidad[] = [];
    let fasesOrigenRN5: string[] = [];

    // let fasesDestino_OM: IReporteCambioFaseOportunidad[] = [];
    // let fasesOrigen_OM: string[] = [];

    reporteCambiosDeFaseOportunidad.forEach((element) => {
      if (
        element.faseDestino !== 'RN5' &&
        element.faseDestino !== 'OM' &&
        element.faseDestino !== 'OD'
      ) {
        respuesta.push(element);
        if (fasesOrigen.indexOf(element.faseOrigen) == -1) {
          fasesOrigen.push(element.faseOrigen);
        }
      }
      if (element.faseDestino == 'RN5') {
        fasesDestinoRN5.push(element);
        if (fasesOrigenRN5.indexOf(element.faseOrigen) == -1) {
          fasesOrigenRN5.push(element.faseOrigen);
        }
      }

      // if (element.faseDestino == 'OM' || element.faseDestino == 'OD') {
      //   fasesDestino_OM.push(element);
      //   if (fasesOrigen_OM.indexOf(element.faseOrigen) == -1) {
      //     fasesOrigen_OM.push(element.faseOrigen);
      //   }
      // }
    });

    reporteCambiosDeFaseOportunidadPredictivo.forEach((element) => {
      if (
        element.faseDestino !== 'RN5' &&
        element.faseDestino !== 'OM' &&
        element.faseDestino !== 'OD'
      ) {
        respuestaPredictivo.push(element);
        if (fasesOrigenPredictivo.indexOf(element.faseOrigen) == -1) {
          fasesOrigenPredictivo.push(element.faseOrigen);
        }
      }
      if (element.faseDestino == 'RN5') {
        fasesDestinoRN5.push(element);
        if (fasesOrigenRN5.indexOf(element.faseOrigen) == -1) {
          fasesOrigenRN5.push(element.faseOrigen);
        }
      }
      // if (element.faseDestino == 'OM' || element.faseDestino == 'OD') {
      //   fasesDestino_OM.push(element);
      //   if (fasesOrigen_OM.indexOf(element.faseOrigen) == -1) {
      //     fasesOrigen_OM.push(element.faseOrigen);
      //   }
      // }
    });

    this.mostrarPivotGridRN5(fasesDestinoRN5, fasesOrigenRN5);
    // this.mostrarPivotGridOM(fasesDestino_OM, fasesOrigen_OM);

    let myMap = new Map();
    fasesOrigen.forEach((element) => {
      myMap.set(element, {
        fase: element,
        suma: respuesta
          .filter((e) => e.faseOrigen == element)
          .reduce((a, b) => a + b.numeroRegistros, 0),
      });
    });

    let respuestasMetas: {
      numeroRegistros: number;
      faseOrigen: string;
      faseDestino: string;
      tipoDato: string;
      metaLanzamiento: number;
    }[] = [];
    respuesta.forEach((element) => {
      let a = myMap.get(element.faseOrigen);
      let item = {
        numeroRegistros: element.numeroRegistros,
        faseOrigen: element.faseOrigen,
        faseDestino: element.faseDestino,
        tipoDato: element.tipoDato,
        metaLanzamiento: a ? (100 * element.numeroRegistros) / a.suma : 0,
      };
      respuestasMetas.push(item);
    });

    this.pivotGridCambioFase.data = respuestasMetas;
    this.pivotGridCambioFase.loading = false;

    let myMapPredictivo = new Map();
    fasesOrigenPredictivo.forEach((element) => {
      myMapPredictivo.set(element, {
        fase: element,
        suma: respuestaPredictivo
          .filter((e) => e.faseOrigen == element)
          .reduce((a, b) => a + b.numeroRegistros, 0),
      });
    });

    let respuestasMetasPredictivo: {
      numeroRegistros: number;
      faseOrigen: string;
      faseDestino: string;
      tipoDato: string;
      metaLanzamiento: number;
    }[] = [];
    respuestaPredictivo.forEach((element) => {
      let a = myMapPredictivo.get(element.faseOrigen);
      let item = {
        numeroRegistros: element.numeroRegistros,
        faseOrigen: element.faseOrigen,
        faseDestino: element.faseDestino,
        tipoDato: element.tipoDato,
        metaLanzamiento: a ? (100 * element.numeroRegistros) / a.suma : 0,
      };
      respuestasMetasPredictivo.push(item);
    });

    this.pivotGridCambioFasePredictivo.data = respuestasMetasPredictivo;
    this.pivotGridCambioFasePredictivo.loading = false;
  }

  mostrarPivotGridRN5(
    fasesDestino: IReporteCambioFaseOportunidad[],
    fasesOrigen: string[]
  ) {
    let myMapRN5 = new Map();
    fasesOrigen.forEach((element) => {
      myMapRN5.set(element, {
        fase: element,
        suma: fasesDestino
          .filter((e) => e.faseOrigen == element)
          .reduce((a, b) => a + b.numeroRegistros, 0),
      });
    });

    this.pivotGridRN5.data = fasesDestino;
    this.pivotGridRN5.loading = false;
  }

  private mostrarPivotGridOM(
    fasesDestino: IReporteCambioFaseOportunidad[],
    fasesOrigen: string[]
  ) {
    let myMapOM = new Map();
    fasesOrigen.forEach((element) => {
      myMapOM.set(element, {
        fase: element,
        suma: fasesDestino
          .filter((e) => e.faseOrigen == element)
          .reduce((a, b) => a + b.numeroRegistros, 0),
      });
    });
    this.pivotGridOM.data = fasesDestino;
    this.pivotGridOM.loading = false;
  }
  cargarLlamadasObservadas() {
    this.gridLlamadaObservada.loading = true;
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxGenerarReporteActividadEjecutadaLlamadaObservadaV2,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<ILlamadaObservada[]>) => {
          this.cargarGridLlamadaObservadasV2(resp.body);
          this.gridLlamadaObservada.loading = false;
        },
        error: (error) => {
          this.gridLlamadaObservada.loading = false;
        },
      });
  }
  cargarLlamadasObservadasDuracionAtipica() {
    this.gridLlamadaObservadaDuracionAtipica.loading = true;
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxGenerarReporteActividadEjecutadaLlamadaObservadaV2,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<ILlamadaObservada[]>) => {
          this.cargarGridLlamadaObservadasDuracionAtipicaV2(resp.body);
          this.gridLlamadaObservadaDuracionAtipica.loading = false;
        },
        error: (error) => {
          this.gridLlamadaObservadaDuracionAtipica.loading = false;
        },
      });
  }
  generarReporteLlamadaActividad() {
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxGenerarReporteActividadEjecutadaLlamadaObservadaV2,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<ILlamadaObservada[]>) => {
          this.cargarGridLlamadaObservadasV2(resp.body);
          this.cargarGridLlamadaObservadasDuracionAtipicaV2(resp.body);
          this.gridLlamadaObservada.loading = false;
          this.gridLlamadaObservadaDuracionAtipica.loading = false;


          this.btnBuscarDisabled = false;
        },
        error: (error) => {
          this.btnBuscarDisabled = false;
          this.gridLlamadaObservada.loading = false;
          this.gridLlamadaObservadaDuracionAtipica.loading = false;

        },
      });
    // this.integraReplicaService
    //   .postJsonResponse(
    //     constApiComercial.ReporteCambioDeFaseTresCxGenerarReporteActividadEjecutadaLlamadaObservada,
    //     JSON.stringify(this.filtroForm)
    //   )
    //   .subscribe({
    //     next: (resp: HttpResponse<ILlamadaObservada[]>) => {
    //       this.cargarGridLlamadaObservadas(resp.body);
    //       this.gridLlamadaObservada.loading = false;

    //       this.btnBuscarDisabled = false;
    //     },
    //     error: (error) => {
    //       this.btnBuscarDisabled = false;
    //       this.gridLlamadaObservada.loading = false;
    //     },
    //   });
    //Cambio a produccion
    this.integraService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxGenerarAcumuladoTiempoContactoEfectivo,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<IAcumuladoTiempoContactoEfectivo[]>) => {
          this.cargarGridAcumuladoTiempoContacto(resp.body);
          this.gridAcumuladoTiempoContacto.loading = false;
          this.btnBuscarDisabled = false;
        },
        error: (error) => {
          this.gridAcumuladoTiempoContacto.loading = false;
          this.btnBuscarDisabled = false;
        },
      });
    this.integraReplicaService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxGenerarAcumuladoLlamadasReprogramadasManualmente,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<ILlamadaObservada[]>) => {
          this.cargarGridAcumuladoLlamadas(resp.body);
          this.gridAcumuladoLlamadas.loading = false;
          this.btnBuscarDisabled = false;
        },
        error: (error) => {
          this.gridAcumuladoLlamadas.loading = false;
          this.btnBuscarDisabled = false;
        },
      });
    // Cambio a produccion
    // this.integraService
    //   .postJsonResponse(
    //     constApiComercial.ReporteCambioDeFaseTresCxGenerarActividadEjecutadaFaseActual,
    //     JSON.stringify(this.filtroForm)
    //   )
    //   .subscribe({
    //     next: (resp: HttpResponse<IActividadEjecutadaFaseActual[]>) => {
    //       this.cargarGridActividadesEjecutadasFaseActual(resp.body);
    //       this.gridActividadEjecutadaFaseActual.loading = false;
    //       this.btnBuscarDisabled = false;
    //     },
    //     error: (error) => {
    //       this.gridActividadEjecutadaFaseActual.loading = false;
    //       this.btnBuscarDisabled = false;
    //     },
    //   });
  }
  cargarGridLlamadaObservadas(
    actividadEjecutadaLlamadaObservada: ILlamadaObservada[]
  ) {
    let campos = [
      'Reprogramacion manual mayor a 1 min',
      'Reprogramacion automatica mayor a 1 min',
      'Ejecutada menor a 1 min sin cambio de fase',
      'Ejecutada menor a 1 min con cambio de fase',
      'Ejecutada de 1 a 2 mins sin cambio de fase',
      'Ejecutada de 1 a 2 mins con cambio de fase',
      'Ejecutada de 5 a 8 mins sin cambio de fase',
      'Ejecutada mayor a 8 min sin cambio de fase',


    ];
    let data: any = [];
    campos.forEach((e) => {
      let bnc = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'BNC' && x.caso == e
      );
      let bnc_1 = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'BNC-1' && x.caso == e
      );
      let it = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'IT' && x.caso == e
      );
      let ip = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'IP' && x.caso == e
      );
      let ic = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'IC' && x.caso == e
      );
      let pf = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'PF' && x.caso == e
      );
      let is = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'IS' && x.caso == e
      );
      let m = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'M' && x.caso == e
      );
      let cantidadIs = is != null ? is.cantidad : 0;
      let cantidadM = m != null ? m.cantidad : 0;
      data.push({
        caso: e,
        BNC: bnc != null ? bnc.cantidad : 0,
        BNC_1: bnc_1 != null ? bnc_1.cantidad : 0,
        IT: it != null ? it.cantidad : 0,
        IP: ip != null ? ip.cantidad : 0,
        IC: ic != null ? ic.cantidad : 0,
        PF: pf != null ? pf.cantidad : 0,
        ISM: cantidadIs + cantidadM,
      });
    });
    this.gridLlamadaObservada.data = data;
  }
  cargarGridLlamadaObservadasV2(
    actividadEjecutadaLlamadaObservada: ILlamadaObservada[]
  ) {
    let campos = [
      'Reprogramacion manual mayor a 1 min',
      //'Reprogramacion automatica mayor a 1 seg',
      'Reprogramacion automatica mayor o igual a 30 seg y menor o igual a 1 min',
      'Reprogramacion automatica mayor a 1 min',
      //'Ejecutada sin llamada sin cambio de fase',
      //'Ejecutada sin llamada con cambio de fase',
      //'Ejecutada menor a 30 seg sin cambio de fase',
      // 'Ejecutada menor a 1 min sin cambio de fase',
      // //'Ejecutada menor a 30 seg con cambio de fase',
      // 'Ejecutada menor a 1 min con cambio de fase',
      // //'Ejecutada mayor o igual a 30 seg y menor a 1 min sin cambio de fase',
      // //'Ejecutada mayor o igual a 30 seg y menor a 1 min con cambio de fase',
      // 'Ejecutada de 1 a 2 mins sin cambio de fase',
      // 'Ejecutada de 1 a 2 mins con cambio de fase',
      // //'Ejecutada de 5 a 8 mins sin cambio de fase',
      // 'Ejecutada mayor a 8 min sin cambio de fase',

      
      
      //'Ejecutada menor a 1 min con cambio de fase',
      //'Ejecutada menor a 1 min con cambio de fase',

    ];
    let data: any = [];
    campos.forEach((e) => {
      let bnc = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'BNC' && x.caso == e
      );
      let bnc_1 = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'BNC-1' && x.caso == e
      );
      let it = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'IT' && x.caso == e
      );
      let ip = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'IP' && x.caso == e
      );
      let ic = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'IC' && x.caso == e
      );
      let pf = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'PF' && x.caso == e
      );
      let is = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'IS' && x.caso == e
      );
      let m = actividadEjecutadaLlamadaObservada.find(
        (x) => x.faseOportunidad == 'M' && x.caso == e
      );
      let cantidadIs = is != null ? is.cantidad : 0;
      let cantidadM = m != null ? m.cantidad : 0;
      data.push({
        caso: e,
        BNC: bnc != null ? bnc.cantidad : 0,
        BNC_1: bnc_1 != null ? bnc_1.cantidad : 0,
        IT: it != null ? it.cantidad : 0,
        IP: ip != null ? ip.cantidad : 0,
        IC: ic != null ? ic.cantidad : 0,
        PF: pf != null ? pf.cantidad : 0,
        ISM: cantidadIs + cantidadM,
      });
    });
    this.gridLlamadaObservada.data = data;
  }

  cargarGridLlamadaObservadasDuracionAtipicaV2(
    actividadEjecutadaLlamadaObservadaDuracionAtipica: ILlamadaObservada[]
  ) {
    let campos = [
      'Ejecutada menor a 1 min sin cambio de fase',
      'Ejecutada menor a 1 min con cambio de fase',
      'Ejecutada de 1 a 2 mins sin cambio de fase',
      'Ejecutada de 1 a 2 mins con cambio de fase',
      'Ejecutada de 8 a 12 mins sin cambio de fase',//'Ejecutada de 8 a 12 mins sin cambio de fase'
      'Ejecutada mayor a 12 mins sin cambio de fase',

    ];
    let data: any = [];
    campos.forEach((e) => {
      let bnc = actividadEjecutadaLlamadaObservadaDuracionAtipica.find(
        (x) => x.faseOportunidad == 'BNC' && x.caso == e
      );
      let bnc_1 = actividadEjecutadaLlamadaObservadaDuracionAtipica.find(
        (x) => x.faseOportunidad == 'BNC-1' && x.caso == e
      );
      let it = actividadEjecutadaLlamadaObservadaDuracionAtipica.find(
        (x) => x.faseOportunidad == 'IT' && x.caso == e
      );
      let ip = actividadEjecutadaLlamadaObservadaDuracionAtipica.find(
        (x) => x.faseOportunidad == 'IP' && x.caso == e
      );
      let ic = actividadEjecutadaLlamadaObservadaDuracionAtipica.find(
        (x) => x.faseOportunidad == 'IC' && x.caso == e
      );
      let pf = actividadEjecutadaLlamadaObservadaDuracionAtipica.find(
        (x) => x.faseOportunidad == 'PF' && x.caso == e
      );
      let is = actividadEjecutadaLlamadaObservadaDuracionAtipica.find(
        (x) => x.faseOportunidad == 'IS' && x.caso == e
      );
      let m = actividadEjecutadaLlamadaObservadaDuracionAtipica.find(
        (x) => x.faseOportunidad == 'M' && x.caso == e
      );
      let cantidadIs = is != null ? is.cantidad : 0;
      let cantidadM = m != null ? m.cantidad : 0;
      data.push({
        caso: e,
        BNC: bnc != null ? bnc.cantidad : 0,
        BNC_1: bnc_1 != null ? bnc_1.cantidad : 0,
        IT: it != null ? it.cantidad : 0,
        IP: ip != null ? ip.cantidad : 0,
        IC: ic != null ? ic.cantidad : 0,
        PF: pf != null ? pf.cantidad : 0,
        ISM: cantidadIs + cantidadM,
      });
    });
    this.gridLlamadaObservadaDuracionAtipica.data = data;
  }

  cargarGridActividadesEjecutadasFaseActual(
    actividadEjecutadaFaseActual: IActividadEjecutadaFaseActual[]
  ) {
    let campos = ['0', '1', '2', '3', '4', '5', '6', '7', 'Más de 7'];
    let data: any = [];
    campos.forEach((e) => {
      let bnc = actividadEjecutadaFaseActual.find(
        (x) => x.faseOportunidad == 'BNC' && x.caso == e
      );
      let bnc_1 = actividadEjecutadaFaseActual.find(
        (x) => x.faseOportunidad == 'BNC-1' && x.caso == e
      );
      let it = actividadEjecutadaFaseActual.find(
        (x) => x.faseOportunidad == 'IT' && x.caso == e
      );
      let ip = actividadEjecutadaFaseActual.find(
        (x) => x.faseOportunidad == 'IP' && x.caso == e
      );
      let ic = actividadEjecutadaFaseActual.find(
        (x) => x.faseOportunidad == 'IC' && x.caso == e
      );
      let pf = actividadEjecutadaFaseActual.find(
        (x) => x.faseOportunidad == 'PF' && x.caso == e
      );
      let is = actividadEjecutadaFaseActual.find(
        (x) => x.faseOportunidad == 'IS' && x.caso == e
      );
      let m = actividadEjecutadaFaseActual.find(
        (x) => x.faseOportunidad == 'M' && x.caso == e
      );
      let cantidadIs = is != null ? is.cantidad : 0;
      let cantidadM = m != null ? m.cantidad : 0;
      let promedioLlamadaIs = is != null ? is.promedioLlamada : 0;
      let promedioLlamadaM = m != null ? m.promedioLlamada : 0;
      let cantidadISM = cantidadIs + cantidadM;
      let sumPromedio = promedioLlamadaIs + promedioLlamadaM;
      let promedioISM = sumPromedio != 0 ? sumPromedio / 2 : 0;
      data.push({
        caso: e,
        BNC:
          bnc != null
            ? `${bnc.cantidad} (${bnc.promedioLlamada.toFixed(1)}min)`
            : '0(0)',
        BNC_1:
          bnc_1 != null
            ? `${bnc_1.cantidad} (${bnc_1.promedioLlamada.toFixed(1)}min)`
            : '0(0)',
        IT:
          it != null
            ? `${it.cantidad} (${it.promedioLlamada.toFixed(1)} min)`
            : '0(0)',
        IP:
          ip != null
            ? `${ip.cantidad} (${ip.promedioLlamada.toFixed(1)} min)`
            : '0(0)',
        IC:
          ic != null
            ? `${ic.cantidad} (${ic.promedioLlamada.toFixed(1)} min)`
            : '0(0)',
        PF:
          pf != null
            ? `${pf.cantidad} (${pf.promedioLlamada.toFixed(1)} min)`
            : '0(0)',
        ISM: `${cantidadISM}(${promedioISM.toFixed(2)})`,
      });
    });
    this.gridActividadEjecutadaFaseActual.data = data;
  }

  cargarGridAcumuladoLlamadas(
    acumuladoLlamadasReprogramadasManualmente: ILlamadaObservada[]
  ) {
    let campos = ['1', '2', '3', '4', '5', 'Más de 5'];
    let data: any = [];
    campos.forEach((e) => {
      let bnc = acumuladoLlamadasReprogramadasManualmente.find(
        (x) => x.faseOportunidad == 'BNC' && x.caso == e
      );
      let bnc_1 = acumuladoLlamadasReprogramadasManualmente.find(
        (x) => x.faseOportunidad == 'BNC-1' && x.caso == e
      );
      let it = acumuladoLlamadasReprogramadasManualmente.find(
        (x) => x.faseOportunidad == 'IT' && x.caso == e
      );
      let ip = acumuladoLlamadasReprogramadasManualmente.find(
        (x) => x.faseOportunidad == 'IP' && x.caso == e
      );
      let ic = acumuladoLlamadasReprogramadasManualmente.find(
        (x) => x.faseOportunidad == 'IC' && x.caso == e
      );
      let pf = acumuladoLlamadasReprogramadasManualmente.find(
        (x) => x.faseOportunidad == 'PF' && x.caso == e
      );
      let is = acumuladoLlamadasReprogramadasManualmente.find(
        (x) => x.faseOportunidad == 'IS' && x.caso == e
      );
      let m = acumuladoLlamadasReprogramadasManualmente.find(
        (x) => x.faseOportunidad == 'M' && x.caso == e
      );
      let cantidadIs = is != null ? is.cantidad : 0;
      let cantidadM = m != null ? m.cantidad : 0;
      data.push({
        caso: e,
        BNC: bnc != null ? bnc.cantidad : 0,
        BNC_1: bnc_1 != null ? bnc_1.cantidad : 0,
        IT: it != null ? it.cantidad : 0,
        IP: ip != null ? ip.cantidad : 0,
        IC: ic != null ? ic.cantidad : 0,
        PF: pf != null ? pf.cantidad : 0,
        ISM: cantidadIs + cantidadM,
      });
    });
    this.gridAcumuladoLlamadas.data = data;
  }
  /**
   *
   * @param acumuladoTiempoContactoEfectivo
   */
  cargarGridAcumuladoTiempoContacto(
    acumuladoTiempoContactoEfectivo: IAcumuladoTiempoContactoEfectivo[]
  ) {
    let campos = [
      // 'Menos de 2',
      // '2.0-5.0',
      // '5.1-8.0',
      // '8.0-9.9',
      // '10.0-14.9',
      // '15.0-19.9',
      // '20.0-24.9',
      // '25.0-29.9',
      // '30.0-39.9',
      // '40.0-60',
      // 'Mas de 60',
      'Menos de 3',
      'de 3 a 5',
      'de 6 a 9',
      'de 10 a 14',
      'de 15 a 24',
      'de 25 a 34',
      'de 35 a 44',
      'de 45 a mas',
    ];
    let data: any = [];
    campos.forEach((e) => {
      let bnc = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'BNC' && x.tiempoContacto == e
      );
      let bnc_1 = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'BNC-1' && x.tiempoContacto == e
      );
      let it = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'IT' && x.tiempoContacto == e
      );
      let ip = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'IP' && x.tiempoContacto == e
      );
      let ic = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'IC' && x.tiempoContacto == e
      );
      let pf = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'PF' && x.tiempoContacto == e
      );
      let is = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'IS' && x.tiempoContacto == e
      );
      let m = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'M' && x.tiempoContacto == e
      );
      let cantidadIs = is != null ? is.total : 0;
      let cantidadM = m != null ? m.total : 0;

      let rn2a = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'RN2-A' && x.tiempoContacto == e
      );
      let rn2b = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'RN2-B' && x.tiempoContacto == e
      );
      let rn2c = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'RN2-C' && x.tiempoContacto == e
      );
      let rn3 = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'RN3' && x.tiempoContacto == e
      );
      let rn1 = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'RN1' && x.tiempoContacto == e
      );
      let eliminar = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'E' && x.tiempoContacto == e
      );
      let bic = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'BIC' && x.tiempoContacto == e
      );
      let nsi = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'NS' && x.tiempoContacto == e
      );
      let otros = acumuladoTiempoContactoEfectivo.find(
        (x) => x.faseOportunidad == 'OTROS' && x.tiempoContacto == e
      );

      data.push({
        caso: e,
        BNC: bnc != null ? bnc.total : 0,
        BNC_1: bnc_1 != null ? bnc_1.total : 0,
        IT: it != null ? it.total : 0,
        IP: ip != null ? ip.total : 0,
        IC: ic != null ? ic.total : 0,
        PF: pf != null ? pf.total : 0,
        ISM: cantidadIs + cantidadM,

        RN2A: rn2a != null ? rn2a.total : 0,
        RN2B: rn2b != null ? rn2b.total : 0,
        RN2C: rn2c != null ? rn2c.total : 0,
        RN3: rn3 != null ? rn3.total : 0,
        RN1: rn1 != null ? rn1.total : 0,
        E: eliminar != null ? eliminar.total : 0,
        BIC: bic != null ? bic.total : 0,
        NSI: nsi != null ? nsi.total : 0,
        OTROS: otros != null ? otros.total : 0,
      });
    });
    this.gridAcumuladoTiempoContacto.data = data;
  }
  /**
   * Obtiene el reporte de control de oportunidades predictivas
   */
  obtenerControlOportunidadPredictiva() {
    this.gridControlOportunidadPredictiva.loading = true;
    this.integraService
      .postJsonResponse(
        constApiComercial.ReporteCambioDeFaseTresCxObtenerControlOportunidadPredictiva,
        JSON.stringify(this.filtroForm)
      )
      .subscribe({
        next: (resp: HttpResponse<ControlOportunidadPredictiva[]>) => {
          this.btnBuscarDisabled = false;
          if (resp.body != null) {
            this.gridControlOportunidadPredictiva.data = resp.body;
            this.gridControlOportunidadPredictiva.loading = false;
          }
        },
        error: (error) => {
          this.btnBuscarDisabled = false;
          this.gridControlOportunidadPredictiva.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
}

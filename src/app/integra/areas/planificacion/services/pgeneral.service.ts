import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  BeneficioPreRequisitoDTO,
  CombosConfiguracionPlantilla,
  CombosModulo,
  CombosModuloMontoPago,
  ConfiguracionBeneficio,
  ConfiguracionPlantilla,
  DetalleMontoPago,
  DetalleProgramas,
  EsquemaAsociado,
  FormConfiguracionBase,
  FormDatosWeb,
  FormParametroSeo,
  Modalidad,
  MontoPago,
  PEspecificoCodigoPartner,
  PGeneralCriterioEvaluacion,
  PGeneralCursoCriterioHijo,
  PGeneralForoAsignacionProveedor,
  ParametrosSeoPgeneral,
  Pgeneral,
  PgeneralCodigoPartner,
  PgeneralModalidad,
  PgeneralProyectoAplicacion,
  PgeneralVersionPrograma,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { BehaviorSubject, map, Observable, ReplaySubject, Subject } from 'rxjs';
import { SweetAlertCustomClass } from 'sweetalert2';

@Injectable()
export class PgeneralService {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}

  // customClass25: SweetAlertCustomClass = {
  //   popup: 'pg-sweetAlert-popup-25',
  //   title: 'pg-sweetAlert-title',
  //   htmlContainer: 'pg-sweetAlert-htmlContainer',
  //   icon: 'pg-sweetAlert-icon',
  //   actions: 'pg-sweetAlert-actions',
  // };
  // customClass30: SweetAlertCustomClass = {
  //   popup: 'pg-sweetAlert-popup-30',
  //   title: 'pg-sweetAlert-title',
  //   htmlContainer: 'pg-sweetAlert-htmlContainer',
  //   icon: 'pg-sweetAlert-icon',
  //   actions: 'pg-sweetAlert-actions',
  // };
  // customClassError: SweetAlertCustomClass = {
  //   popup: 'pg-sweetAlert-popup-30',
  //   title: 'pg-sweetAlert-title',
  //   htmlContainer: 'pg-sweetAlert-htmlContainer',
  //   icon: 'pg-sweetAlert-icon',
  //   actions: 'pg-sweetAlert-actions',
  // };
  // customClassDelete: SweetAlertCustomClass = {
  //   popup: 'pg-sweetAlert-popup-30',
  //   title: 'pg-sweetAlert-title',
  //   htmlContainer: 'pg-sweetAlert-htmlContainer',
  //   icon: 'pg-sweetAlert-icon',
  //   actions: 'pg-sweetAlert-actions',
  //   confirmButton: "btn btn-sm btn-primary",
  //   cancelButton: "btn btn-sm btn-danger"
  // };
  combosModulo: CombosModulo = {
    areaCapacitacion: [],
    subAreaCapacitacion: [],
    parametroSeo: [],
    partnerPw: [],
    certificadoPartnerComplemento: [],
    expositor: [],
    categoriaPrograma: [],
    visualizacionBsPlay: [],
    titulo: [],
    cargo: [],
    areaFormacion: [],
    areaTrabajo: [],
    industria: [],
    ciudad: [],
    categoriaOrigenConHijos: [],
    tipoDato: [],
    pGeneral: [],
    perfilContactoProgramaColumna: [],
    modalidadCurso: [],
    paginaWebPw: [],
    versionPrograma: [],
    moduloPrograma: [],
    cicloPrograma: [],
    tipoPrograma: [],
    proveedor: [],
    pGeneralPeriodoAsincronico: [],
  };
  combosMontoPago: CombosModuloMontoPago = {
    areaCapacitacion: [],
    subAreaCapacitacion: [],
    tipoDescuento: [],
    pais: [],
    moneda: [],
    categoriaPrograma: [],
    suscripcionProgramaGeneral: [],
    tipoPago: [],
    plataformaPago: [],
  };
  combosConfiguracionPlantilla: CombosConfiguracionPlantilla = {
    plantilaCertificadoConstancia: [],
    modalidadCurso: [],
    estadoMatricula: [],
    operadorComparacion: [],
    subEstadoMatricula: [],
    pais: [],
    beneficioDatoAdicional: [],
  };
  comboEsquemaEvaluacion: IComboBase1[] = [];
  comboCriterioEvaluacion: IComboBase1[] = [];
  comboModalidades: Modalidad[] = [];
  comboProveedor: IComboBase1[] = [];
  isNewPgeneral: boolean = false;
  private _dataItemPgeneral: Pgeneral;

  addNuevoPgeneral$ = new Subject<Pgeneral>();

  //Datos Programa General
  detalleProgramas$ = new ReplaySubject<DetalleProgramas>(1);
  pgCriteriosEvaluacionOnline$ = new ReplaySubject<
    PGeneralCriterioEvaluacion[]
  >(1);
  pgCriteriosEvaluacionPresencial$ = new ReplaySubject<
    PGeneralCriterioEvaluacion[]
  >(1);
  pgCriteriosEvaluacionAonline$ = new ReplaySubject<
    PGeneralCriterioEvaluacion[]
  >(1);
  ppadreCEvaluacionOnline$ = new ReplaySubject<PGeneralCursoCriterioHijo[]>(1);
  ppadreCEvaluacionPresencial$ = new ReplaySubject<PGeneralCursoCriterioHijo[]>(
    1
  );

  ppPadreCEvaluacionAonline$ = new ReplaySubject<PGeneralCursoCriterioHijo[]>(
    1
  );
  pgeneralModalidad$ = new ReplaySubject<PgeneralModalidad[]>(1);
  detalleMontoPago$ = new ReplaySubject<DetalleMontoPago>(1);
  esquemaAsociado$ = new ReplaySubject<EsquemaAsociado[]>(1);
  configuracionCliente$ = new ReplaySubject<BeneficioPreRequisitoDTO>(1);

  obtenerDetalleEsquemaAsignado$: Subject<void> = new Subject<void>();

  /* #region ModalDatosPgeneral */
  getDatosModalPgeneral$ = new Subject<void>();

  dataFormConfiguracionBase$ = new BehaviorSubject<FormConfiguracionBase>(null);
  dataFormDatosWeb$ = new BehaviorSubject<FormDatosWeb>(null);
  dataFormParametroSeo$ = new BehaviorSubject<FormParametroSeo>(null);
  dataParametrosSeo$ = new BehaviorSubject<ParametrosSeoPgeneral[]>(null);
  dataExpositores$ = new BehaviorSubject<number[]>(null);
  dataModalidades$ = new BehaviorSubject<number[]>(null);
  dataProveedores$ = new BehaviorSubject<number[]>(null);
  dataDocentes$ = new BehaviorSubject<number[]>(null);

  dataPreRequisitos$ = new BehaviorSubject<number[]>(null);
  dataConfiguracionPlantilla$ = new BehaviorSubject<ConfiguracionPlantilla[]>(
    null
  );
  dataConfiguracionPlantillaConstancia$ = new BehaviorSubject<
    ConfiguracionPlantilla[]
  >(null);
  dataMontoPago$ = new BehaviorSubject<MontoPago[]>(null);
  dataConfiguracionBeneficio$ = new BehaviorSubject<ConfiguracionBeneficio[]>(
    null
  );
  dataPgeneralVersionPrograma$ = new BehaviorSubject<PgeneralVersionPrograma[]>(
    null
  );
  dataPgeneralCodigoPartner$ = new BehaviorSubject<PgeneralCodigoPartner[]>(
    null
  );
  dataPespecificoCodigoPartner$ = new BehaviorSubject<PEspecificoCodigoPartner[]>(
    null
  );
  dataPgeneralProyectoAplicacion$ = new BehaviorSubject<
    PgeneralProyectoAplicacion[]
  >(null);
  dataPgeneralForoAsignacionProveedor$ = new BehaviorSubject<
    PGeneralForoAsignacionProveedor[]
  >(null);
  validacionDatosPgeneral$ = new BehaviorSubject<{
    origen: string;
    error: string;
  }>(null);
  /* #endregion */

  addErroresDatosPgeneral(origen: string, error?: string) {
    this.validacionDatosPgeneral$.next({
      origen: origen,
      error: error,
    });
  }
  limpiarErroresDatosPgeneral() {
    this.validacionDatosPgeneral$ = new BehaviorSubject<{
      origen: string;
      error: string;
    }>(null);
  }

  get dataItemPgeneral() {
    return this._dataItemPgeneral;
  }
  set dataItemPgeneral(dataItem: Pgeneral) {
    this._dataItemPgeneral = dataItem;
  }
  get idProgramaGeneral() {
    if (this._dataItemPgeneral != null && !this.isNewPgeneral) {
      return this._dataItemPgeneral.idPgeneral;
    } else {
      return 0;
    }
  }
  ready() {
    this.obtenerCombosModulo();
    this.obtenerCombosMontoPago();
    this.obtenerCombosEvaluacion();
    this.obtenerComboCriterioEvaluacion();
    this.obtenerModalidadCurso();
    this.obtenerNombreProveedorParaHonorario();
    this.obtenerCombosConfiguracionPlantillaAsync();
  }
  readyAlterno() {
    if (this.combosModulo.areaCapacitacion.length == 0)
      this.obtenerCombosModulo();
    if (this.combosMontoPago.areaCapacitacion.length == 0)
      this.obtenerCombosMontoPago();
    if (this.comboEsquemaEvaluacion.length == 0)
      this.obtenerCombosEvaluacion();
    if (this.comboCriterioEvaluacion.length == 0)
      this.obtenerComboCriterioEvaluacion();
    if (this.comboModalidades.length == 0)
      this.obtenerModalidadCurso();
    if (this.comboProveedor.length == 0)
      this.obtenerNombreProveedorParaHonorario();
    if (
      this.combosConfiguracionPlantilla.plantilaCertificadoConstancia.length ==
      0
    )
      this.obtenerCombosConfiguracionPlantillaAsync();
  }
  private obtenerCombosConfiguracionPlantillaAsync() {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.ProgramaGeneralObtenerCombosConfiguracionPlantillaAsync
      )
      .subscribe({
        next: (resp: HttpResponse<CombosConfiguracionPlantilla>) => {
          this.combosConfiguracionPlantilla.plantilaCertificadoConstancia =
            resp.body.plantilaCertificadoConstancia;
          this.combosConfiguracionPlantilla.modalidadCurso =
            resp.body.modalidadCurso;
          this.combosConfiguracionPlantilla.estadoMatricula =
            resp.body.estadoMatricula;
          this.combosConfiguracionPlantilla.operadorComparacion =
            resp.body.operadorComparacion;
          this.combosConfiguracionPlantilla.subEstadoMatricula =
            resp.body.subEstadoMatricula;
          this.combosConfiguracionPlantilla.pais = resp.body.pais;
          this.combosConfiguracionPlantilla.beneficioDatoAdicional =
            resp.body.beneficioDatoAdicional;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  public obtenerCombosModulo() {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.ProgramaGeneralObtenerCombosModuloAsync
      )
      .subscribe({
        next: (resp: HttpResponse<CombosModulo>) => {
          console.log(resp.body);
          this.combosModulo.areaCapacitacion = resp.body.areaCapacitacion;
          this.combosModulo.subAreaCapacitacion = resp.body.subAreaCapacitacion;
          this.combosModulo.parametroSeo = resp.body.parametroSeo;
          this.combosModulo.partnerPw = resp.body.partnerPw;
          this.combosModulo.certificadoPartnerComplemento =
            resp.body.certificadoPartnerComplemento;
          this.combosModulo.expositor = resp.body.expositor;
          this.combosModulo.categoriaPrograma = resp.body.categoriaPrograma;
          this.combosModulo.visualizacionBsPlay = resp.body.visualizacionBsPlay;
          this.combosModulo.titulo = resp.body.titulo;
          this.combosModulo.cargo = resp.body.cargo;
          this.combosModulo.areaFormacion = resp.body.areaFormacion;
          this.combosModulo.areaTrabajo = resp.body.areaTrabajo;
          this.combosModulo.industria = resp.body.industria;
          this.combosModulo.ciudad = resp.body.ciudad;
          this.combosModulo.categoriaOrigenConHijos =
            resp.body.categoriaOrigenConHijos;
          this.combosModulo.tipoDato = resp.body.tipoDato;
          this.combosModulo.pGeneral = resp.body.pGeneral;
          this.combosModulo.perfilContactoProgramaColumna =
            resp.body.perfilContactoProgramaColumna;
          this.combosModulo.modalidadCurso = resp.body.modalidadCurso;
          this.combosModulo.paginaWebPw = resp.body.paginaWebPw;
          this.combosModulo.versionPrograma = resp.body.versionPrograma;
          this.combosModulo.moduloPrograma = resp.body.moduloPrograma;
          this.combosModulo.cicloPrograma = resp.body.cicloPrograma;
          this.combosModulo.tipoPrograma = resp.body.tipoPrograma;
          this.combosModulo.proveedor = resp.body.proveedor;
          this.combosModulo.pGeneralPeriodoAsincronico =
            resp.body.pGeneralPeriodoAsincronico;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  public obtenerCombosMontoPago() {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.MontoPagoObtenerCombosModuloMontoPagoAsync
      )
      .subscribe({
        next: (resp: HttpResponse<CombosModuloMontoPago>) => {
          this.combosMontoPago.areaCapacitacion = resp.body.areaCapacitacion;
          this.combosMontoPago.subAreaCapacitacion =
            resp.body.subAreaCapacitacion;
          this.combosMontoPago.tipoDescuento = resp.body.tipoDescuento;
          this.combosMontoPago.pais = resp.body.pais;
          this.combosMontoPago.moneda = resp.body.moneda;
          this.combosMontoPago.categoriaPrograma = resp.body.categoriaPrograma;
          this.combosMontoPago.suscripcionProgramaGeneral =
            resp.body.suscripcionProgramaGeneral;
          this.combosMontoPago.tipoPago = resp.body.tipoPago;
          this.combosMontoPago.plataformaPago = resp.body.plataformaPago;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  private obtenerCombosEvaluacion() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.EsquemaEvaluacionObtenerComboAsync)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.comboEsquemaEvaluacion = resp.body;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  private obtenerComboCriterioEvaluacion() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.CriterioEvaluacionObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.comboCriterioEvaluacion = resp.body;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  private obtenerModalidadCurso() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.ModalidadCursoObtener)
      .subscribe({
        next: (resp: HttpResponse<Modalidad[]>) => {
          this.comboModalidades = resp.body;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  private obtenerNombreProveedorParaHonorario() {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.ProveedorObtenerNombreProveedorParaHonorario
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.comboProveedor = resp.body;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerProgramasGeneral$(json: string): Observable<HttpResponse<Pgeneral[]>> {
    return this._integraService.postJsonResponse(
      constApiPlanificacion.ProgramaGeneralObtenerProgramasGeneral,
      json
    );
  }
  getNombreArea(idArea: number) {
    let item = this.combosModulo.areaCapacitacion.find((x) => x.id == idArea);
    if (item != null) {
      return item.nombre;
    } else {
      return '';
    }
  }
  getNombreSubArea(idSubArea: number) {
    let item = this.combosModulo.subAreaCapacitacion.find(
      (x) => x.id == idSubArea
    );
    if (item != null) {
      return item.nombre;
    } else {
      return '';
    }
  }
  getNombrePartner(idPartner: number) {
    let item = this.combosModulo.partnerPw.find((x) => x.id == idPartner);
    if (item != null) {
      return item.nombre;
    } else {
      return '';
    }
  }
  getNombreCertificadoPartnerComplemento(idCertificadoPartner: number) {
    let item = this.combosModulo.certificadoPartnerComplemento.find(
      (x) => x.id == idCertificadoPartner
    );
    if (item != null) {
      return item.nombre;
    } else {
      return '';
    }
  }
  getNombreTipoPrograma(idTipoPrograma: number) {
    let item = this.combosModulo.tipoPrograma.find(
      (x) => x.id == idTipoPrograma
    );
    if (item != null) {
      return item.nombre;
    } else {
      return '';
    }
  }
  initModalDatosPgeneral() {
    this.resetModalDatosPgeneral();
    this.obtenerDetalleMontoPago();
    this.obtenerDetalleProgramas();
    this.obtenerEsquemaAsociado();
    this.obtenerIdModalidad();
  }
  resetModalDatosPgeneral() {
    this.addNuevoPgeneral$ = new Subject<Pgeneral>();

    // Reiniciar detalle monto pago
    this.detalleMontoPago$ = new ReplaySubject<DetalleMontoPago>(1);
    // Reiniciar detalles programa
    this.detalleProgramas$ = new ReplaySubject<DetalleProgramas>(1);
    // Reiniciar esquema asociado
    this.esquemaAsociado$ = new ReplaySubject<EsquemaAsociado[]>(1);
    // Reiniciar pgeneral modalidades
    this.pgeneralModalidad$ = new ReplaySubject<PgeneralModalidad[]>(1);

    this.obtenerDetalleEsquemaAsignado$ = new Subject<void>();

    /* #region Criterio de evaluacion */
    this.pgCriteriosEvaluacionOnline$ = new ReplaySubject<
      PGeneralCriterioEvaluacion[]
    >(1);
    this.pgCriteriosEvaluacionPresencial$ = new ReplaySubject<
      PGeneralCriterioEvaluacion[]
    >(1);
    this.pgCriteriosEvaluacionAonline$ = new ReplaySubject<
      PGeneralCriterioEvaluacion[]
    >(1);

    this.ppadreCEvaluacionOnline$ = new ReplaySubject<
      PGeneralCursoCriterioHijo[]
    >(1);
    this.ppadreCEvaluacionPresencial$ = new ReplaySubject<
      PGeneralCursoCriterioHijo[]
    >(1);
    this.ppPadreCEvaluacionAonline$ = new ReplaySubject<
      PGeneralCursoCriterioHijo[]
    >(1);
    /* #endregion */

    /* #region Valores de recopilacion de datos */
    this.getDatosModalPgeneral$ = new Subject<void>();
    this.dataFormConfiguracionBase$ =
      new BehaviorSubject<FormConfiguracionBase>(null);
    this.dataFormDatosWeb$ = new BehaviorSubject<FormDatosWeb>(null);
    this.dataFormParametroSeo$ = new BehaviorSubject<FormParametroSeo>(null);
    this.dataParametrosSeo$ = new BehaviorSubject<ParametrosSeoPgeneral[]>(
      null
    );
    this.dataExpositores$ = new BehaviorSubject<number[]>(null);
    this.dataModalidades$ = new BehaviorSubject<number[]>(null);

    this.dataProveedores$ = new BehaviorSubject<number[]>(null);

    this.dataDocentes$ = new BehaviorSubject<number[]>(null);

    this.dataPreRequisitos$ = new BehaviorSubject<number[]>(null);
    this.dataConfiguracionPlantilla$ = new BehaviorSubject<
      ConfiguracionPlantilla[]
    >(null);
    this.dataConfiguracionPlantillaConstancia$ = new BehaviorSubject<
      ConfiguracionPlantilla[]
    >(null);
    this.dataMontoPago$ = new BehaviorSubject<MontoPago[]>(null);
    this.dataConfiguracionBeneficio$ = new BehaviorSubject<
      ConfiguracionBeneficio[]
    >(null);
    this.dataPgeneralVersionPrograma$ = new BehaviorSubject<
      PgeneralVersionPrograma[]
    >(null);
    this.dataPgeneralCodigoPartner$ = new BehaviorSubject<
      PgeneralCodigoPartner[]
    >(null);
    this.dataPespecificoCodigoPartner$ = new BehaviorSubject<
    PEspecificoCodigoPartner[]
  >(null);
    this.dataPgeneralProyectoAplicacion$ = new BehaviorSubject<
      PgeneralProyectoAplicacion[]
    >(null);
    this.dataPgeneralForoAsignacionProveedor$ = new BehaviorSubject<
      PGeneralForoAsignacionProveedor[]
    >(null);
    this.validacionDatosPgeneral$ = new BehaviorSubject<{
      origen: string;
      error: string;
    }>(null);
    /* #endregion */
  }
  obtenerDetalleMontoPago() {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.MontoPagoObtenerPgeneralMontoPagoDetalle}/${this._dataItemPgeneral.id}/${this._dataItemPgeneral.idCategoria}`
      )
      .subscribe({
        next: (resp: HttpResponse<DetalleMontoPago>) => {
          this.detalleMontoPago$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerDetalleProgramas() {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerDetalleProgramas}/${this._dataItemPgeneral.idPgeneral}`
      )
      .subscribe({
        next: (resp: HttpResponse<DetalleProgramas>) => {
          this.detalleProgramas$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerEsquemaAsociado() {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.EsquemaEvaluacionObtenerEsquemaAsociado}/${this._dataItemPgeneral.idPgeneral}`
      )
      .subscribe({
        next: (resp: HttpResponse<EsquemaAsociado[]>) => {
          this.esquemaAsociado$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerIdModalidad() {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerIdModalidad}/${this._dataItemPgeneral.idPgeneral}`
      )
      .subscribe({
        next: (resp: HttpResponse<PgeneralModalidad[]>) => {
          this.pgeneralModalidad$.next(resp.body);
          this.cargarCriteriosEvaluacion(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  private cargarCriteriosEvaluacion(pgeneralModalidad: PgeneralModalidad[]) {
    let tipoPrograma = this._dataItemPgeneral.idTipoPrograma;
    //Modulo - Padre
    if (tipoPrograma == 2 || tipoPrograma == 3) {
      // Presencial
      if (pgeneralModalidad.findIndex((x) => x.idModalidadCurso == 0) != -1) {
        this.obtenerPGCriteriosEvaluacionPresencial();
      }
      // Aonline
      if (pgeneralModalidad.findIndex((x) => x.idModalidadCurso == 1) != -1) {
        this.obtenerPGCriteriosEvaluacionAOnline();
      }
      // Online
      if (pgeneralModalidad.findIndex((x) => x.idModalidadCurso == 2) != -1) {
        this.obtenerPGCriteriosEvaluacionOnline();
      }
    } else if (tipoPrograma == 1) {
      // Presencial
      if (pgeneralModalidad.findIndex((x) => x.idModalidadCurso == 0) != -1) {
        this.obtenerPPadreCEvaluacionPresencial();
      }
      // Aonline
      if (pgeneralModalidad.findIndex((x) => x.idModalidadCurso == 1) != -1) {
        this.obtenerPPadreCEvaluacionAonline();
      }
      // Online
      if (pgeneralModalidad.findIndex((x) => x.idModalidadCurso == 2) != -1) {
        this.obtenerPPadreCEvaluacionOnline();
      }
    }
  }
  obtenerPGCriteriosEvaluacionOnline() {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerPGCriteriosEvaluacionOnline}/${this._dataItemPgeneral.idPgeneral}`
      )
      .subscribe({
        next: (resp: HttpResponse<PGeneralCriterioEvaluacion[]>) => {
          console.log(resp.body);
          this.pgCriteriosEvaluacionOnline$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerPGCriteriosEvaluacionAOnline() {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerPGCriteriosEvaluacionAOnline}/${this._dataItemPgeneral.idPgeneral}`
      )
      .subscribe({
        next: (resp: HttpResponse<PGeneralCriterioEvaluacion[]>) => {
          console.log(resp.body);
          this.pgCriteriosEvaluacionAonline$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerPGCriteriosEvaluacionPresencial() {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerPGCriteriosEvaluacionPresencial}/${this._dataItemPgeneral.idPgeneral}`
      )
      .subscribe({
        next: (resp: HttpResponse<PGeneralCriterioEvaluacion[]>) => {
          console.log(resp.body);
          this.pgCriteriosEvaluacionPresencial$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerPPadreCEvaluacionOnline() {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerPPadreCEvaluacionOnline}/${this._dataItemPgeneral.idPgeneral}`
      )
      .subscribe({
        next: (resp: HttpResponse<PGeneralCursoCriterioHijo[]>) => {
          console.log(resp.body);
          this.ppadreCEvaluacionOnline$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerPPadreCEvaluacionAonline() {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerPPadreCEvaluacionAonline}/${this._dataItemPgeneral.idPgeneral}`
      )
      .subscribe({
        next: (resp: HttpResponse<PGeneralCursoCriterioHijo[]>) => {
          console.log(resp.body);
          this.ppPadreCEvaluacionAonline$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerPPadreCEvaluacionPresencial() {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerPPadreCEvaluacionPresencial}/${this._dataItemPgeneral.idPgeneral}`
      )
      .subscribe({
        next: (resp: HttpResponse<PGeneralCursoCriterioHijo[]>) => {
          console.log(resp.body);
          this.ppadreCEvaluacionPresencial$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerInformacionConfiguracionCliente() {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.ProgramaGeneralObtenerBeneficiosYPreRequisitos +
          '/' +
          this.dataItemPgeneral.id
      )
      .subscribe({
        next: (resp: HttpResponse<BeneficioPreRequisitoDTO>) => {
          //this.configuracionCliente = resp.body;
          console.log('respuesta del endpoint', resp.body);
          this.configuracionCliente$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
}

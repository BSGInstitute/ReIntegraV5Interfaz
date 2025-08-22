import {
  CorreoInteraccionV2,
  IArgumentoDetalle,
  IArgumentoDetalleNuevaAgenda,
  IBeneficioCompetidor,
  IBeneficioRespuestaEnvio,
  ICertificacionRespuestaEnvio,
  IMotivacionRespuestaEnvio,
  IPreRequisitoOportunidad,
  IPrerequisitoRespuestaEnvio,
  IPresentacionArgumentoDetalle,
  IProblemaDetalleNuevaAgenda,
  IProblemaDetalleSolucionRespuesta,
  IProblemaDetalleSolucionRespuestaNuevaAgenda,
  IPublicoObjetivoRespuestaEnvio,
} from './../../models/interfaces/iagenda-modal';
import { Injectable } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { AgendaService } from './agenda.service';
import { constApiComercial } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Subscription, Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { IAlumnoInformacion } from '../../models/interfaces/iagenda-datos-alumno';
import {
  ICompetidorOportunidad,
  IPrerequisitoBeneficioCompetidor,
  IProblemaDetalle,
  ITiempoCapacitacion,
} from '../../models/interfaces/iagenda-modal';
import { AlertaService } from '@shared/services/alerta.service';
import {
  ICalidadProcesamiento,
  ICalidadProcesamientoAlterno,
  IDatoCompuesto,
  IOportunidadCompetidor,
} from '@comercial/models/interfaces/iagenda-programacion';
import {
  IArgumentoMotivacionPrograma,
  IPublicoObjetivoPrograma,
  IRequisitosCertificacionPrograma,
} from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
@Injectable()
export class AgendaModalService {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}
  private _variableRecargarProblema: boolean = true;
  private _variableRecargarPresentacionArgumento: boolean = true;
  private _agendaService: AgendaService;
  dataCompetidores$ = new ReplaySubject<{ id: number; nombre: string }[]>(1);
  tiempoCapacitacionPorIdOportunidad$ = new ReplaySubject<ITiempoCapacitacion>(
    1
  );
  competidorPorIdOportunidad$ = new ReplaySubject<ICompetidorOportunidad[]>(
    1
  );
  dataProblemaCliente$ = new BehaviorSubject<IProblemaDetalleNuevaAgenda[]>([]);
  dataPresentacionArgumentoCliente$ = new BehaviorSubject<IPresentacionArgumentoDetalle[]>([]);
  prerequisitosBeneficiosCompetidoresPorIdOportunidad$ =
    new ReplaySubject<IPrerequisitoBeneficioCompetidor>(1);
  paso56Correcto: boolean = false;
  private _oportunidadCompetidor: IOportunidadCompetidor;
  beneficioOportunidad$: BehaviorSubject<string> = new BehaviorSubject<string>(
    ''
  );
  dataGridBeneficios$ = new BehaviorSubject<IBeneficioCompetidor[]>([]);
  dataGridFactoresMotivacion$ = new BehaviorSubject<
    IArgumentoMotivacionPrograma[]
  >([]);
  dataGridPublicoObjetivo$ = new BehaviorSubject<IPublicoObjetivoPrograma[]>(
    []
  );
  dataGridCertificacionGeneral$ = new BehaviorSubject<
    IRequisitosCertificacionPrograma[]
  >([]);
  dataGridPrerequisitos$ = new BehaviorSubject<IPreRequisitoOportunidad[]>([]);
  dataGridProblemaCliente$ = new BehaviorSubject<IProblemaDetalleNuevaAgenda[]>([]);
  dataGridPresentacionArgumentoCliente$ = new BehaviorSubject<IPresentacionArgumentoDetalle[]>([]);
  dataTiemposCapacitacion$ = new BehaviorSubject<any[]>([]);
  checkCompetidorNO$ = new BehaviorSubject<boolean>(false);
  checkCompetidorSI$ = new BehaviorSubject<boolean>(false);
  competidor$ = new BehaviorSubject<number[]>([]);

  private _rowActual: IRowActual;
  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();

  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async ready() {
    this.cargarCompetidores();
  }
  async resetService() {
    await this.resetFicha();
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
    this.dataCompetidores$ = new ReplaySubject<{ id: number; nombre: string }[]>(1);
  }
  async initFicha() {
    this._rowActual = this._agendaService.rowActual;
    this.cargarRegistrosPantallaCompetidores();
  }
  async resetFicha() {
    this.paso56Correcto = false;
    this._oportunidadCompetidor = null;
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
    this.tiempoCapacitacionPorIdOportunidad$ =
      new ReplaySubject<ITiempoCapacitacion>(1);
    this.competidorPorIdOportunidad$ = new ReplaySubject<
      ICompetidorOportunidad[]
    >(1);
    this.dataProblemaCliente$ = new BehaviorSubject<IProblemaDetalleNuevaAgenda[]>([]);
    this.dataPresentacionArgumentoCliente$ = new BehaviorSubject<IPresentacionArgumentoDetalle[]>([]);
    this.prerequisitosBeneficiosCompetidoresPorIdOportunidad$ =
      new ReplaySubject<IPrerequisitoBeneficioCompetidor>(1);
    this.paso56Correcto = false;
    this._oportunidadCompetidor = null;
    this.beneficioOportunidad$ = new BehaviorSubject<string>('');
    this.dataGridBeneficios$ = new BehaviorSubject<IBeneficioCompetidor[]>([]);
    this.dataGridFactoresMotivacion$ = new BehaviorSubject<
      IArgumentoMotivacionPrograma[]
    >([]);
    this.dataGridPublicoObjetivo$ = new BehaviorSubject<
      IPublicoObjetivoPrograma[]
    >([]);
    this.dataGridCertificacionGeneral$ = new BehaviorSubject<
      IRequisitosCertificacionPrograma[]
    >([]);
    this.dataGridPrerequisitos$ = new BehaviorSubject<
      IPreRequisitoOportunidad[]
    >([]);
    this.dataGridProblemaCliente$ = new BehaviorSubject<IProblemaDetalleNuevaAgenda[]>([]);
    this.dataTiemposCapacitacion$ = new BehaviorSubject<any[]>([]);
    this.checkCompetidorNO$ = new BehaviorSubject<boolean>(false);
    this.checkCompetidorSI$ = new BehaviorSubject<boolean>(false);
    this.competidor$ = new BehaviorSubject<number[]>([]);
    this.prerequisitosBeneficiosCompetidoresPorIdOportunidad$ = new ReplaySubject<IPrerequisitoBeneficioCompetidor>(1);
  }
  private recargarProblema() {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerProgramaGeneralProblemaDetallePorIdOportunidadNuevaAgenda}/${this._rowActual.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IProblemaDetalleNuevaAgenda[]>) => {
          this._variableRecargarProblema = false;
          this.dataProblemaCliente$.next(response.body);
        },
        error: (error) => {
          if (this._variableRecargarProblema) {
            this.recargarProblema();
          } else {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          }
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }

  private recargarPresentacionArgumento() {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerProgramaGeneralPresentacionArgumentoDetallePorIdOportunidad}/${this._rowActual.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IPresentacionArgumentoDetalle[]>) => {
          this._variableRecargarPresentacionArgumento = false;
          this.dataPresentacionArgumentoCliente$.next(response.body);
        },
        error: (error) => {
          if (this._variableRecargarPresentacionArgumento) {
            this.recargarProblema();
          } else {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          }
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  private regularizarPaso56() {
    if (this.paso56Correcto == false) {
      let sub$ = this._integraService
        .getJsonResponse(
          `${constApiComercial.AgendaInformacionActividadObtenerPrerequisitosBeneficiosCompetidoresPorIdOportunidad}/${this._rowActual.idOportunidad}`
        )
        .subscribe({
          next: (rpta: HttpResponse<IPrerequisitoBeneficioCompetidor>) => {
            this.paso56Correcto = true;
            this.prerequisitosBeneficiosCompetidoresPorIdOportunidad$.next(
              rpta.body
            );
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
        this._subscriptionsFicha$.add(sub$);
    }
  }
  cargarPlazosInicioPrograma(idTiempo: number) {
    let params = {
      id: this._rowActual.idOportunidad,
      idTiempoCapacitacionValidacion: idTiempo,
      usuario: this._agendaService.userName,
    };
    let sub$ = this._integraService
      .postJsonResponse(
        constApiComercial.AgendaInformacionActividadActualizarTiempoCapacitacion,
        params
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this._alertaService.notificationSuccess('Se actualizo correctamente');
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
      this._subscriptionsFicha$.add(sub$);
  }
  private cargarCompetidores() {
    let sub$ = this._integraService
      .obtenerTodo(
        constApiComercial.AgendaInformacionActividadObtenerCompetidores
      )
      .subscribe({
        next: (response: HttpResponse<{ id: number; nombre: string }[]>) => {
          this.dataCompetidores$.next(response.body);
        },
      });
    this._subscriptions$.add(sub$);
  }
  private cargarRegistrosPantallaCompetidores() {
    this._variableRecargarProblema = true;
    this._variableRecargarPresentacionArgumento = true ;
    this.recargarProblema();
    this.recargarPresentacionArgumento();
    this.obtenerTiempoCapacitacion();
    // ? No utilizado
    // let sub1$ = this._integraService
    //   .getJsonResponse(
    //     `${constApiComercial.AgendaInformacionActividadObtenerCorreoInteraccionV2EnviadosPorPersonal}/${this.rowActual.idAlumno}/${this.rowActual.idPersonal_Asignado}`
    //   )
    //   .subscribe({
    //     next: (rpta: HttpResponse<CorreoInteraccionV2>) => {
    //       this.correoInteraccionV2EnviadosPorPersonal$.next(rpta.body);
    //     },
    //     error: (error) => {
    //       let mensaje = this._alertaService.getMessageErrorService(error);
    //       this._alertaService.notificationWarning(mensaje);
    //     },
    //   });
    let sub2$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerCompetidorPorIdOportunidad}/${this._rowActual.idOportunidad}`
      )
      .subscribe({
        next: (rpta: HttpResponse<ICompetidorOportunidad[]>) => {
          this.competidorPorIdOportunidad$.next(rpta.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    let sub3$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerPrerequisitosBeneficiosCompetidoresPorIdOportunidad}/${this._rowActual.idOportunidad}`
      )
      .subscribe({
        next: (rpta: HttpResponse<IPrerequisitoBeneficioCompetidor>) => {
          this.paso56Correcto = true;
          this.prerequisitosBeneficiosCompetidoresPorIdOportunidad$.next(
            rpta.body
          );
          this._oportunidadCompetidor = rpta.body.oportunidadCompetidor;
        },
        error: (error) => {
          this.regularizarPaso56();
        },
      });

    this._subscriptionsFicha$.add(sub2$);
    this._subscriptionsFicha$.add(sub3$);
  }
  private obtenerTiempoCapacitacion() {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerTiempoCapacitacionPorIdOportunidad}/${this._rowActual.idOportunidad}`
      )
      .subscribe({
        next: (rpta: HttpResponse<ITiempoCapacitacion>) => {
          this.tiempoCapacitacionPorIdOportunidad$.next(rpta.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptionsFicha$.add(sub$);
  }
  traerListas() {
    let oportunidadCompetidor: IOportunidadCompetidor = {};
    let objcheck: ICalidadProcesamientoAlterno = {
      id: 0,
      perfilCamposLlenos: 0,
      perfilCamposTotal: 0,
      tieneDni: false,
      sentinelVerificado: false,
      pgeneralMotivacionValidado: 0,
      pgeneralMotivacionTotal: 0,
      publicoObjetivoValidado: 0,
      publicoObjetivoTotal: 0,
      prerequisitoProgramaValidado: 0,
      prerequisitoProgramaTotal: 0,
      requisitoCertificacionValidado: 0,
      requisitoCertificacionTotal: 0,
      beneficiosValidados: 0,
      beneficiosTotales: 0,
      inicioProgramaVerificado: false,
      competidoresVerificacion: false,
      cantidadCompetidores: 0,
      problemaSeleccionados: 0,
      problemaSolucionados: 0,
    };
    let sub$ = this._agendaService.agendaSentinelService.resetSentinel$.subscribe(resp => {
      if(resp != null){
        objcheck.sentinelVerificado = true
      }
    });
    this._subscriptionsFicha$.add(sub$);
    let validarPerfil: any = 0;

    oportunidadCompetidor.idOportunidad = this._rowActual.idOportunidad;
    oportunidadCompetidor.otroBeneficio = this.beneficioOportunidad$.value;

    if (oportunidadCompetidor.otroBeneficio == '')
      oportunidadCompetidor.otroBeneficio = ' ';

    if (this.checkCompetidorSI$.value == true) {
      oportunidadCompetidor.respuesta = 1;
    } else if (this.checkCompetidorNO$.value == true) {
      oportunidadCompetidor.respuesta = 2;
    } else {
      oportunidadCompetidor.respuesta = 0;
    }
    oportunidadCompetidor.completado = 'Falta';

    if (
      this._oportunidadCompetidor != null &&
      this._oportunidadCompetidor?.id != null
    ) {
      oportunidadCompetidor.id = this._oportunidadCompetidor.id;
    } else {
      oportunidadCompetidor.id = 0;
      oportunidadCompetidor.completado = 'Falta';
    }
    let listaCompetidor: number[] = this.competidor$.value;

    let listaSolucionesAlterno: {
      idOportunidad: number;
      idProblema: number;
      // seleccionado: boolean;
      // solucionado: boolean;
      checkvalor: boolean;
    }[] = [];

    this._agendaService.agendaModalService.dataProblemaCliente$.value.forEach(
      (e) => {
        e.argumentos.forEach((x) => {
          // if (x.seleccionado == true) {
          //   listaSolucionesAlterno.push({
          //     idOportunidad: this._rowActual.idOportunidad,
          //     idProblema: x.id,
          //     seleccionado: x.seleccionado,
          //     solucionado: x.solucionado,
          //   });
          // }

          if (x.checkValor == true) {
            listaSolucionesAlterno.push({
              idOportunidad: this._rowActual.idOportunidad,
              idProblema: x.id,
              checkvalor: x.checkValor,
            });
          }
          
        });
      }
    );

    let listaPrerequisitoGeneralAlterno: {
      idOportunidad: number;
      idProgramaGeneralPrerequisito: number;
      respuesta: number;
    }[] = [];
    let objPrerequisitosEspecifico: any[] = [];
    let listaBeneficioAlterno: {
      idOportunidad: number;
      idBeneficio: number;
      respuesta: number;
    }[] = [];
    let listaMotivacion: {
      idOportunidad?: number;
      idMotivacion?: number;
      respuesta?: number;
    }[] = [];
    let listaPublicoObjetivo: {
      idOportunidad: number;
      idPublicoObjetivo: number;
      respuesta: number;
    }[] = [];

    let listaCertificacion: {
      idOportunidad: number;
      idCertificacion: number;
      respuesta: number;
    }[] = [];

    this.dataGridPrerequisitos$.value.forEach((item) => {
      listaPrerequisitoGeneralAlterno.push({
        idOportunidad: this._rowActual.idOportunidad,
        idProgramaGeneralPrerequisito: item.idPrerequisito,
        respuesta: item.respuesta,
      });
    });
    // listaPrerequisitoEsp.forEach((item: any) => {
    //   let obj: any = {};
    //   obj.idOportunidadCompetidor = 0;
    //   obj.idProgramaGeneralBeneficio = Number(item.idPrerequisito);
    //   obj.respuesta = item.respuesta;
    //   obj.completado = item.completado;
    //   objPrerequisitosEspecifico.push(obj);
    // });

    this.dataGridBeneficios$.value.forEach((item) => {
      listaBeneficioAlterno.push({
        idOportunidad: this._rowActual.idOportunidad,
        idBeneficio: item.id,
        respuesta: item.respuesta ?? 0,
      });
    });
    this.dataGridFactoresMotivacion$.value.forEach((item) => {
      listaMotivacion.push({
        idOportunidad: this._rowActual.idOportunidad,
        idMotivacion: item.idMotivacion,
        respuesta: item.respuesta ?? 0,
      });
    });
    this.dataGridPublicoObjetivo$.value.forEach((item) => {
      listaPublicoObjetivo.push({
        idOportunidad: this._rowActual.idOportunidad,
        idPublicoObjetivo: item.id,
        respuesta: item.respuesta ?? 0,
      });
    });
    this.dataGridCertificacionGeneral$.value.forEach((item) => {
      listaCertificacion.push({
        idOportunidad: this._rowActual.idOportunidad,
        idCertificacion: item.idCertificacion,
        respuesta: item.respuesta ?? 0,
      });
    });
    const alumno: IAlumnoInformacion =
      this._agendaService.agendaAlumnoService.alumno$.value;
    if (alumno?.dni != null && alumno?.dni != '') {
      objcheck.tieneDni = true;
    } else {
      if (alumno?.idCodigoPais != 51) {
        objcheck.tieneDni = true;
      } else {
        objcheck.tieneDni = false;
      }
    }
    if (alumno?.idAFormacion != 0 && alumno?.idAFormacion != null) {
      validarPerfil++;
    }
    if (alumno?.idCargo != 0 && alumno?.idCargo != null) {
      validarPerfil++;
    }
    if (alumno?.idIndustria != 0 && alumno?.idIndustria != null) {
      validarPerfil++;
    }
    if (alumno?.idATrabajo !== 0 && alumno?.idATrabajo != null) {
      validarPerfil++;
    }
    if (alumno?.idEmpresa !== 0 && alumno?.idATrabajo != null) {
      validarPerfil++;
    }
    objcheck.perfilCamposTotal = 5;
    objcheck.perfilCamposLlenos = validarPerfil;
    objcheck.pgeneralMotivacionTotal = this.dataGridFactoresMotivacion$.value.length;
    objcheck.pgeneralMotivacionValidado = this.dataGridFactoresMotivacion$.value.filter(
      (valor) => valor.respuesta != 0 && valor.respuesta != null
    ).length;

    objcheck.publicoObjetivoTotal = this.dataGridPublicoObjetivo$.value.length;
    objcheck.publicoObjetivoValidado = this.dataGridPublicoObjetivo$.value.filter(
      (valor) => valor.respuesta != 0 && valor.respuesta != null
    ).length;


    objcheck.prerequisitoProgramaTotal = this.dataGridPrerequisitos$.value.length;
    objcheck.prerequisitoProgramaValidado = this.dataGridPrerequisitos$.value.filter(
      (valor) => valor.respuesta != 0 && valor.respuesta != null
    ).length;

    objcheck.requisitoCertificacionTotal = this.dataGridCertificacionGeneral$.value.length;
    objcheck.requisitoCertificacionValidado = this.dataGridCertificacionGeneral$.value.filter(
      (valor) => valor.respuesta != 0 && valor.respuesta != null
    ).length;


    objcheck.beneficiosTotales = this.dataGridBeneficios$.value.length;
    objcheck.beneficiosValidados = this.dataGridBeneficios$.value.filter(
      (valor) => valor.respuesta == 1
      ).length;
    let itemVerificado = this.dataTiemposCapacitacion$.value.find(x => x.check == true);
    if(itemVerificado == null){
      objcheck.inicioProgramaVerificado = false
    }else{
      objcheck.inicioProgramaVerificado = true
    }
    if (
      oportunidadCompetidor.respuesta == 1 ||
      oportunidadCompetidor.respuesta == 2
    ) {
      objcheck.competidoresVerificacion = true;
    } else {
      objcheck.competidoresVerificacion = false;
    }

    objcheck.idOportunidad = oportunidadCompetidor.idOportunidad;
    objcheck.cantidadCompetidores = this.competidor$.value.length;
    // oportunidadCompetidor.calidadBO = objcheck;
    objcheck.problemaSeleccionados = listaSolucionesAlterno.filter(
      (valor) => valor.checkvalor == true
    ).length;
    // objcheck.problemaSolucionados = listaSolucionesAlterno.filter(
    //   (valor) => valor.solucionado == true
    // ).length;
    let objeto: IDatoCompuesto = {};
    objeto.calidadProcesamientoAlterno = objcheck;
    objeto.oportunidadCompetidor = oportunidadCompetidor;
    objeto.listaBeneficioAlterno = listaBeneficioAlterno;
    objeto.listaCompetidor = listaCompetidor;
    objeto.listaSolucionesAlterno = listaSolucionesAlterno;
    objeto.listaMotivacion = listaMotivacion;
    objeto.listaPublicoObjetivo = listaPublicoObjetivo;
    objeto.listaCertificacion = listaCertificacion;
    objeto.listaPrerequisitoGeneralAlterno = listaPrerequisitoGeneralAlterno;
    return objeto;
  }
  guardarFactorMotivacion$(
    respuesta: number,
    idMotivacion: number
  ): Observable<HttpResponse<IMotivacionRespuestaEnvio>> {
    let data: IMotivacionRespuestaEnvio = {
      id: 0,
      idOportunidad: this._rowActual.idOportunidad,
      IdProgramaGeneralMotivacion: idMotivacion,
      respuesta: respuesta ?? 0,
    };
    return this._integraService.postJsonResponse(
      constApiComercial.ProgramaGeneralMotivacionRespuestaInsertar,
      JSON.stringify(data)
    );
  }
  guardarPublicoObjetivo$(
    item: IPublicoObjetivoPrograma
  ): Observable<HttpResponse<IPublicoObjetivoRespuestaEnvio>> {
    let data: IPublicoObjetivoRespuestaEnvio = {
      id: 0,
      idOportunidad: this._rowActual.idOportunidad,
      idDocumentoSeccionPw: item.id,
      nivelCumplimiento: item.respuesta ?? 0,
    };
    return this._integraService.postJsonResponse(
      constApiComercial.PublicoObjetivoRespuestaInsertar,
      JSON.stringify(data)
    );
  }
  guardarPreRequisitosRespuesta$(
    item: IPreRequisitoOportunidad
  ): Observable<HttpResponse<IPublicoObjetivoRespuestaEnvio>> {
    let data: IPrerequisitoRespuestaEnvio = {
      id: 0,
      idOportunidad: this._rowActual.idOportunidad,
      idProgramaGeneralPrerequisito: item.idPrerequisito,
      respuesta: item.respuesta ?? 0,
    };
    return this._integraService.postJsonResponse(
      constApiComercial.ProgramaGeneralPrerequisitoRespuestaInsertar,
      JSON.stringify(data)
    );
  }
  guardarCertificacionRespuesta$(
    item: IRequisitosCertificacionPrograma
  ): Observable<HttpResponse<IPublicoObjetivoRespuestaEnvio>> {
    let data: ICertificacionRespuestaEnvio = {
      id: 0,
      idOportunidad: this._rowActual.idOportunidad,
      idProgramaGeneralCertificacion: item.idCertificacion,
      respuesta: item.respuesta ?? 0,
    };
    return this._integraService.postJsonResponse(
      constApiComercial.ProgramaGeneralCertificacionRespuestaInsertar,
      JSON.stringify(data)
    );
  }
  guardarBeneficioRespuesta$(
    dataItem: IBeneficioCompetidor
  ): Observable<HttpResponse<boolean>> {
    let data: IBeneficioRespuestaEnvio = {
      id: 0,
      idOportunidad: this._rowActual.idOportunidad,
      IdProgramaGeneralBeneficio: dataItem.id,
      respuesta: dataItem.respuesta ?? 0,
    };
    return this._integraService.postJsonResponse(
      constApiComercial.ProgramaGeneralBeneficioRespuestaGuardarCambiosAgenda,
      JSON.stringify(data)
    );
  }
  guardarProblemaDetalleRespuesta$(
    dataItem: IArgumentoDetalle
  ): Observable<HttpResponse<boolean>> {
    let data: IProblemaDetalleSolucionRespuesta = {
      id: 0,
      idOportunidad: this._rowActual.idOportunidad,
      idProgramaGeneralProblemaDetalleSolucion: dataItem.id,
      esSeleccionado: dataItem.seleccionado,
      esSolucionado: dataItem.solucionado,
    };
    return this._integraService.postJsonResponse(
      constApiComercial.ProgramaGeneralProblemaDetalleSolucionRespuestaGuardarCambiosAgenda,
      JSON.stringify(data)
    );
  }
  guardarProblemaDetalleRespuestaNuevaAgenda$(
    dataItem: IArgumentoDetalleNuevaAgenda
  ): Observable<HttpResponse<boolean>> {

      let seleccionado: boolean=false;
      let solucionado: boolean=false;


    if(dataItem.cabecera.includes("Solucion"))
    {
      seleccionado =dataItem.checkValor
      solucionado = dataItem.checkValor
    }
    else
    {
      seleccionado = dataItem.checkValor
    }

    let data: IProblemaDetalleSolucionRespuesta = {
      id: 0,
      idOportunidad: this._rowActual.idOportunidad,
      idProgramaGeneralProblemaDetalleSolucion: dataItem.id,
      esSeleccionado: seleccionado,
      esSolucionado: solucionado,
    };
    return this._integraService.postJsonResponse(
      constApiComercial.ProgramaGeneralProblemaDetalleSolucionRespuestaGuardarCambiosAgenda,
      JSON.stringify(data)
    );
  }
}

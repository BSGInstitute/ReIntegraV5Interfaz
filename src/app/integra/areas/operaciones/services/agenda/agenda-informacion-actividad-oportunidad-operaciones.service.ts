import { UserService } from './../../../../../shared/services/user.service';
import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';
import {
  IAgendaConfiguracion,
  IArgumentoMotivacionPrograma,
  ICabeceraSpeech,
  IHistorialOportunidad,
  IInformacionProgramaV1,
  IOportunidadInformacion,
  IOportunidadVentaCruzada,
  IPublicoObjetivoPrograma,
} from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { IHistorialInteracciones } from '@operaciones/models/interfaces/ihistorial-interacciones-oportunidad';
import {
  IHistorialProgramas,
  IIdsSolicitud,
  IPrograma,
  IProgramaVentaCruzada,
} from '@operaciones/models/interfaces/iventa-cruzada';
import { IntegraService } from '@shared/services/integra.service';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { AgendaOperacionesService } from './agenda-operaciones.service';
import Swal from 'sweetalert2';
import * as internal from 'stream';

@Injectable()
export class AgendaInformacionActividadOportunidadOperacionesService {
  rowActual: any = null;

  listaVentaCruzada$: Subject<IProgramaVentaCruzada[]> = new Subject<
    IProgramaVentaCruzada[]
  >();
  listaHistorialOportunidades$: Subject<IPrograma[]> = new Subject<
    IPrograma[]
  >();
  listaHistorialInteracciones$: Subject<IHistorialInteracciones[]> =
    new Subject<IHistorialInteracciones[]>();
  dataSourceDescuentos$: Subject<any> = new Subject<any>();
  versionCronograma$: ReplaySubject<any> = new ReplaySubject<any>(1);

  constructor(
    private integraService: IntegraService,
    private userService: UserService
  ) {}

  private agendaService: AgendaOperacionesService;

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  ready() {}

  ObtenerVentaCruzadaHistorialOportunidades() {
    let idAlumno: number = this.agendaService.rowActual.idAlumno;
    let idClasificacionPersona: number =
      this.agendaService.rowActual.idClasificacionPersona;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerOportunidadInformacion}/${idAlumno}/${idClasificacionPersona}`
      )
      .subscribe({
        next: (response: HttpResponse<IHistorialProgramas>) => {
          this.listaVentaCruzada$.next(response.body.listaVentaCruzada);
          this.listaHistorialOportunidades$.next(response.body.listaHistorial);
        },
      });
  }
  CargarHistorialInteraccionesOportunidad() {
    let idPadre: number = this.agendaService.rowActual.idPadre
      ? this.agendaService.rowActual.idPadre
      : 0;
    let idAlumno: number = this.agendaService.rowActual.idAlumno;
    let idOportunidad: number = this.agendaService.rowActual.idOportunidad;
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerHistorialInteraccionesOportunidadATC}/${idAlumno}/${idOportunidad}/${idPadre}`
      )
      .subscribe({
        next: (response: HttpResponse<IHistorialInteracciones[]>) => {
          this.listaHistorialInteracciones$.next(response.body);
        },
      });
  }

  RestablecerBeneficio$(dataItem: any): Observable<HttpResponse<any>> {
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadRestablecerSolicitudBeneficio}/${dataItem.id}/${this.agendaService.userName}`
    );
  }

  publicoObjetivoPrograma$: Subject<IPublicoObjetivoPrograma[]> = new Subject<
    IPublicoObjetivoPrograma[]
  >();
  cabeceraSpeech$: ReplaySubject<ICabeceraSpeech> =
    new ReplaySubject<ICabeceraSpeech>();
  oportunidadInformacion$: ReplaySubject<IOportunidadInformacion> =
    new ReplaySubject<IOportunidadInformacion>(1);
  obtenerBeneficiosAlumnoAgenda$: ReplaySubject<any> = new ReplaySubject<any>(
    1
  );
  montoPagoBeneficio$ = new ReplaySubject<any>(1);
  ventaCruzadaOportunidad$: ReplaySubject<IOportunidadVentaCruzada[]> =
    new ReplaySubject<IOportunidadVentaCruzada[]>(1);
  historialOportunidades$: ReplaySubject<IHistorialOportunidad[]> =
    new ReplaySubject<IHistorialOportunidad[]>(1);
  plantillaWhatsApp$: ReplaySubject<any> = new ReplaySubject<any>(1);
  cargarGridBeneficiosSolicitados$: ReplaySubject<any> = new ReplaySubject<any>(
    1
  );

  cronogramaEvaluacion$: ReplaySubject<any> = new ReplaySubject<any>(1);

  agendaConfiguraciones$: ReplaySubject<IAgendaConfiguracion> =
    new ReplaySubject<IAgendaConfiguracion>();
  informacionProgramaV1$: ReplaySubject<IInformacionProgramaV1> =
    new ReplaySubject<IInformacionProgramaV1>();
  historialInteraccionesPorIdOportunidad$: ReplaySubject<any> =
    new ReplaySubject<any>(1);

  diasSinContactoOportunidad$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  requisitosCertificacionProgramaPorIdOportunidad$: ReplaySubject<any> =
    new ReplaySubject<any>(null);
  objetoWhatsApp: any = new Object();

  argumentoMotivacionPrograma$: ReplaySubject<IArgumentoMotivacionPrograma[]> =
    new ReplaySubject<IArgumentoMotivacionPrograma[]>();
  dataSourceReporteCertificadoFisico$: ReplaySubject<any> = new ReplaySubject<any>(null);
  private alumno: IAlumnoInformacion;
  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
    this.obtenerPublicoObjetivoPrograma();
    this.configurarCabeceraSpeech(this.rowActual);
    //this.obtenerBeneficiosAlumno$()

    // this.obtenerMontoPagoCronogramaBeneficios$()
    this.obtenerOportunidadInformacion();
    this.obtenerDiasSinContacto();
    this.obtenerArgumentosMotivacionPrograma();
    this.ObtenerVentaCruzadaHistorialOportunidades();
    this.CargarHistorialInteraccionesOportunidad();
    this.agendaService.agendaAlumnoOperacionesService.alumno$.subscribe({
      next: (resp: IAlumnoInformacion) => {
        if (resp != null) {
          this.alumno = resp;
          this.obtenerConfiguraciones();
          // ///Carga Montos Complementarios
          if (this.rowActual.IdPadre !== null) {
            this.obtenerMontoPagoCronogramaBeneficios();
            this.cargarGridSolicitudDocumentos();
            this.cargarGridBeneficiosSolicitados();
            // $.ajax({
            //     url: 'https://integrav4-servicios.bsginstitute.com/api/MontoPagoCronograma/GetOportunidadMontoComplementarios/' + rowActual.IdPadre + '/' + TipoPersona + '/' + rowActual.IdMatriculaCabecera,
            //     type: 'GET',
            //     dataType: 'json',
            //     success: function (data) {
            //         //Lista Montos Complementarios
            //         CargarGridMontoComplementarios(data);
            //         //complementario
            //         montopagoCuotasComplementarios = data.Cronograma.MontoPago;
            //         $("#inputdescuentomontocomplementarios").data("kendoDropDownList").trigger('change');//para que cargeu por defecto el primero

            //     },
            //     error: function (xhr, textStatus, errorThrown) {
            //         console.log('Error al Cargar Datod Complentarios');
            //     }
            // });
          }
        }
      },
    });
    this.ObtenerCronogramaEvaluacion(this.rowActual.idMatriculaCabecera);
    this.ObtenerVersionesCronogramaEvaluacion(this.rowActual.idMatriculaCabecera);
    this.ObtenerDatosReporteCertificadoFisico();
  }
  realizadoSolicitudOperaciones$(obj:any){
    // console.log('realizarSolicitud')
    //   let form_data = new FormData();
    //   for(let key in obj ) {
    //     form_data.append(key, obj[key]);
    //   }
      return this.integraService.getJsonResponse(
        `${constApiOperaciones.SolicitudOperacionesRealizadoSolicitud}/${obj.idSolicitudOperaciones}/${obj.usuario}/${obj.observacion}`
      );
  }

  ObtenerCronogramaFinanzas() {
    var idPadre =
      this.rowActual.idPadre === null
        ? this.rowActual.idOportunidad
        : this.rowActual.idPadre;
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.MontoPagoCronogramaObtenerOportunidadCronogramaFinanzas}/${idPadre}/${this.agendaService.tipoPersonal}/${this.rowActual.idMatriculaCabecera}`
      )
      .subscribe({
        next: (response: any) => {
          this.dataSourceDescuentos$.next(response.body);
          //this.ObtenerListaMedioPago();

          console.log('descuentosgrillaks');
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se pudo obtener el cronograma de pagos',
          });
        },
      });
  }
  ObtenerDatosReporteCertificadoFisico() {
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.SolicitudCertificadoFisicoDatosReporteCertificadoEnvioFisicoPorId}/${this.rowActual.codigoMatricula}`
      )
      .subscribe({
        next: (response: any) => {
          this.dataSourceReporteCertificadoFisico$.next(response.body);
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se pudo obtener el cronograma de pagos',
          });
        },
      });
  }

  // ObtenerCronogramaFinanzas() {
  //   var idPadre =
  //     this.rowActual.idPadre === null
  //       ? this.rowActual.idOportunidad
  //       : this.rowActual.idPadre;
  //   this.integraService
  //     .getJsonResponse(
  //       `${constApiOperaciones.MontoPagoCronogramaObtenerOportunidadCronogramaFinanzas}/${idPadre}/${this.agendaService.tipoPersonal}/${this.rowActual.idMatriculaCabecera}`
  //     )
  //     .subscribe({
  //       next: (response: any) => {
  //         this.dataSourceDescuentos$.next(response.body);
  //         //this.ObtenerListaMedioPago();

  //         console.log('descuentosgrillaks');
  //       },
  //       error: (err) => {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Oops...',
  //           text: 'No se pudo obtener el cronograma de pagos',
  //         });
  //       },
  //     });
  // }

  // ObtenerCronogramaFinanzas() {
  //   var idPadre =
  //     this.rowActual.idPadre === null
  //       ? this.rowActual.idOportunidad
  //       : this.rowActual.idPadre;
  //   this.integraService
  //     .getJsonResponse(
  //       `${constApiOperaciones.MontoPagoCronogramaObtenerOportunidadCronogramaFinanzas}/${idPadre}/${this.agendaService.tipoPersonal}/${this.rowActual.idMatriculaCabecera}`
  //     )
  //     .subscribe({
  //       next: (response: any) => {
  //         this.dataSourceDescuentos$.next(response.body);
  //         //this.ObtenerListaMedioPago();

  //         console.log('descuentosgrillaks');
  //       },
  //       error: (err) => {
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Oops...',
  //           text: 'No se pudo obtener el cronograma de pagos',
  //         });
  //       },
  //     });
  // }
  resetFicha() {
    this.cabeceraSpeech$ = new ReplaySubject<ICabeceraSpeech>();
    this.agendaConfiguraciones$ = new ReplaySubject<IAgendaConfiguracion>();
    this.informacionProgramaV1$ = new ReplaySubject<IInformacionProgramaV1>();
    this.cronogramaEvaluacion$ = new ReplaySubject<any>();
    this.diasSinContactoOportunidad$ = new BehaviorSubject<number>(0);
    this.montoPagoBeneficio$ = new ReplaySubject<any>();
    this.versionCronograma$ = new ReplaySubject<any>();
    this.dataSourceReporteCertificadoFisico$ = new ReplaySubject<any>();
    this.cargarGridBeneficiosSolicitados$ = new ReplaySubject<any>();
    this.obtenerBeneficiosAlumnoAgenda$ = new ReplaySubject<any>();
  }
  formatStrinDate() {}

  // reiniciarObservables(){
  //   // this.agendaConfiguraciones$ = new BehaviorSubject<any>(null);
  // }

  obtenerPlantillaWhatsApp() {
    return this.integraService.getJsonResponse(
      constApiComercial.AgendaInformacionActividadObtenerPlantillaWhatsApp
    );
  }

  obtenerConfiguraciones() {
    this.integraService
      .obtenerTodo(constApiComercial.AgendaObtenerConfiguraciones)
      .subscribe({
        next: (response: HttpResponse<IAgendaConfiguracion>) => {
          console.log(response.body);
          this.agendaConfiguraciones$.next(response.body);
          this.obtenerInformacionProgramaV1();
        },
      });
  }

  cargarRegistros() {}
  buscarCuponAlumno(rowSelecionada: any) {}
  cargarPantalla1V4() {}
  obtenerInformacionProgramaV1() {
    console.log('obtenerInformacionProgramaV1');
    let param = {
      idCentroCosto: String(this.rowActual.idCentroCosto),
      codigoPais: String(this.alumno.idCodigoPais),
      idMatriculaCabecera: String(this.rowActual.idMatriculaCabecera),
      idOportunidad: String(this.rowActual.idAlumno),
    };
    // let param = {
    //   idCentroCosto: String(20827),
    //   codigoPais: String(51),
    //   idMatriculaCabecera: String(59061),
    //   idOportunidad: String(1917828),
    // };
    // this.idCentroCostoEnvioInformacion$ = new ReplaySubject<any>();
    this.integraService
      .obtenerPorFiltro(
        constApiOperaciones.AgendaInformacionActividadObtenerInformacionProgramav15M,
        param
      )
      .subscribe({
        next: (response: HttpResponse<IInformacionProgramaV1>) => {
          console.log("informacion programa v1",response.body);
          this.informacionProgramaV1$.next(response.body);
        },
      });
  }

  obtenerInformacionPrograma$(idPGeneral: string) {
    return this.integraService.postJsonResponse(
      constApiComercial.AgendaInformacionActividadObtenerInformacionPrograma,
      JSON.stringify({
        idPGeneral: idPGeneral,
        codigoPais: String(this.alumno.idCodigoPais),
      })
    );
  }

  obtenerInformacionProgramaV2$(idPGeneral: string) {
    return this.integraService.postJsonResponse(
      constApiComercial.AgendaInformacionActividadObtenerInformacionProgramaV2,
      JSON.stringify({
        idPGeneral: idPGeneral,
        codigoPais: String(this.alumno.idCodigoPais),
      })
    );
  }


  cargarGridSolicitudDocumentos() {
    return this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerBeneficiosPorMatricula}/${this.rowActual.codigoMatricula}`
        //`${constApiOperaciones.AgendaInformacionActividadObtenerBeneficiosPorMatricula}/${'307070A19582'}`
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          console.log('obtenerBeneficiosAlumnoAgenda$');
          this.obtenerBeneficiosAlumnoAgenda$.next(resp.body);
        },
      });
  }

  cargarGridBeneficiosSolicitados() {
    return this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerInformacionBeneficioSolicitado}/${this.rowActual.codigoMatricula}`
        //`${constApiOperaciones.AgendaInformacionActividadObtenerBeneficiosPorMatricula}/${'307070A19582'}`
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          console.log('cargarGridBeneficiosSolicitados$');
          this.cargarGridBeneficiosSolicitados$.next(resp.body);
        },
      });
  }



  obtenerMontoPagoCronogramaBeneficios() {
    console.log('ObtenerOportunidadMontoComplementarios');
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.MontoPagoCronogramaObtenerOportunidadMontoComplementarios}/${this.rowActual.idPadre}/${this.agendaService.tipoPersonal}/${this.rowActual.idMatriculaCabecera}`

        //  `${constApiOperaciones.MontoPagoCronogramaObtenerOportunidadMontoComplementarios}/${1672340}/${
        //  'Asesor'}/${53011}`
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          console.log('CargarGridMontoComplementarios');
          this.montoPagoBeneficio$.next(resp.body);
        },
      });
  }

  obtenerOportunidadInformacion() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerOportunidadInformacion}/${this.rowActual.idClasificacionPersona}/${this.rowActual.idAlumno}`
      )
      .subscribe({
        next: (resp: HttpResponse<IOportunidadInformacion>) => {
          if (resp.body) {
            this.oportunidadInformacion$.next(resp.body);
            this.ventaCruzadaOportunidad$.next(resp.body.listaVentaCruzada);
            this.historialOportunidades$.next(resp.body.listaHistorial);
          }
        },
      });
  }

  cargarHistorialInteraccionesOportunidad(idOportunidad: string) {
    console.log('cargarHistorialInteraccionesOportunidad');
    this.integraService
      .getJsonResponse(
        `${constApiOperaciones.AgendaInformacionActividadObtenerHistorialInteraccionesPorIdOportunidad}/${idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body) {
            this.historialInteraccionesPorIdOportunidad$.next(response.body);
          }
        },
      });
  }

  cargarPantalla1() {}
  colorTexto() {}
  cargarVentaCruzada(data: any) {}

  _setSubAreas() {}
  _setProgramasGeneralesInfor(ListaProgramaGeneral: any, codigoPais: any) {
    // this._informacionProgramaOnChange(ListaProgramaGeneral, codigoPais);
    console.log('_informacionProgramaOnChange123');
  }

  _objetoArea() {}
  _objetoSubArea() {}
  _objetoPais() {}
  // TODO migrado rresumenprogramcompo
  _generarResumen() {
    // var codigoPais = this.agendaAlumnoService.ObjetoDataAlumno.idCodigoPais;
    // $('#ResumenPrograma').html('');
    // $("#areaResumen").data("kendoMultiSelect").value();
    //  $("#subareaResumen").data("kendoMultiSelect").value();
    // areas = areas.length === 0 ? areas : areas.join(',');
    // subareas = subareas.length === 0 ? subareas : subareas.join(',');
    // var data;
    // if (subareas.length === 0 && areas.length === 0) {
    //     data = _objetoPais(codigoPais);
    // } else if (subareas.length === 0) {
    //     data = _objetoArea(areas, codigoPais);
    // } else if (areas.length !== 0) {
    //     data = _objetoSubArea(areas, subareas, codigoPais);
    // }
    // $.ajax({
    //     url: "http://localhost:63048/api/AgendaInformacionActividad/GetResumenProgramasV2",
    //     dataType: "json",
    //     data: JSON.stringify(data),
    //     contentType: "application/json; charset=utf-8",
    //     type: "POST",
    //     success: function (data) {
    //         setDataResumenProgramasByAreaV2(data);
    //         NotificacionModule.showMensajeExitoso("OK", NotificacionId);
    //     },
    //     error: function (error) {
    //         NotificacionModule.showMensajeError(error, NotificacionId);
    //     }
    // });
  }
  setDataResumenProgramasByArea() {}
  setDataResumenProgramasByAreaV2(parametros: any) {
    console.log('setDataResumenProgramasByAreaV2123');
    return this.integraService.obtenerPorFiltro(
      constApiComercial.AgendaInformacionActividadObtenerResumenProgramasV2,
      parametros
    );
  }
  ObtenerCronogramaEvaluacion(idMatriculaCabecera: number) {
    //falta metodo de limpiar grids
    this.integraService.getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerEvaluacionesPorMatriculaV2}/${idMatriculaCabecera}`
    ).subscribe({
      next: (resp: HttpResponse<any>) => {
        if (resp.body) {
          this.cronogramaEvaluacion$.next(resp.body.cronogramaUltimaVersion);
        }
      },
      error: (error) => {
        console.log('error', error);
        alert(error.message);
      }
    })
  }
  ObtenerVersionesCronogramaEvaluacion(idMatriculaCabecera:any){
    this.integraService.getJsonResponse(
      `${constApiOperaciones.AgendaInformacionActividadObtenerVersionesCronogramaPorMatricula}/${idMatriculaCabecera}`
    ).subscribe({
      next: (resp: HttpResponse<any>) => {
        if(resp.body){
          this.versionCronograma$.next(resp.body);
        }
      },
    })
  }
  cargarCronogramaMoodle$(codigoMatricula: string):Observable<HttpResponse<any>>{
    return this.integraService.getJsonResponse(
      constApiOperaciones.AgendaInformacionActividadObtenerCrongramaMoodle + '/' + codigoMatricula
    )
  }
  solicitarDocumento$(objRow:any){
    console.log('pruebassolicituddd')
    return this.integraService.getJsonResponse(`${constApiOperaciones.AgendaInformacionActividadActualizarEstadoMatriculaBeneficio}/${objRow.id}/${objRow.idConfiguracionBeneficioProgramaGeneral}/${this.agendaService.userName}`
    )

  }
  SetActividadesOportunidadV2() {}
  SetActividadesOportunidadNoEfectivoV2() {}
  reproducirLlamada() {}
  reproducirLlamadaNuevoWebPhone() {}
  reproducirLlamadaNuevoWebPhoneMigrado() {}
  OcultarModalGrabacion() {}
  reproducirLlamada3CX() {}
  SetActividadesOportunidad() {}
  // DiasSinCotactoOportunidad: any = null;
  obtenerDiasSinContacto() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaActividadObtenerDiasSinContactoPorOportunidad}/${this.rowActual.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<{ id: number; valor: number }>) => {
          this.diasSinContactoOportunidad$.next(response.body.valor);
        },
      });
  }

  remove_character2() {}
  CargarPlantillasWhatsApp() {}

  configurarCabeceraSpeech(rowActual: any) {
    console.log('configurarCabeceraSpeech');
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerCabeceraSpeech}/${rowActual.idOportunidad}/${rowActual.idCentroCosto}`
      )
      .subscribe({
        next: (response: HttpResponse<ICabeceraSpeech>) => {
          this.cabeceraSpeech$.next(response.body);
        },
      });
  }

  obtenerPublicoObjetivoPrograma() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerPublicoObjetivoPrograma}/${this.rowActual.idCentroCosto}/${this.rowActual.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IPublicoObjetivoPrograma[]>) => {
          console.log(response.body);
          this.publicoObjetivoPrograma$.next(response.body);
          // TODO: Migrado component SPECHH
          // this.cargarGridPublicoObjetivo(response.body);
        },
      });
  }

  cargarGridPublicoObjetivo(data: any) {}

  columnTemplateFunction() {}
  columnTemplateFunctionV4() {}
  onDDLChange() {}
  onDDLChangeV4() {}
  configurarCertificacionGeneral(rowSeleccionada: any) {
    console.log('configurarCertificacionGeneral');
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerRequisitosCertificacionProgramaPorIdOportunidad}/${rowSeleccionada.idOportunidad}`
      )
      .subscribe((response: any) => {
        this.requisitosCertificacionProgramaPorIdOportunidad$.next(
          response.body
        );
      });
    //   $.ajax({
    //     url: 'http://localhost:63048/api/AgendaInformacionActividad/ObtenerRequisitosCertificacionPrograma/' + rowSelecionada.IdOportunidad,
    //     type: 'GET',
    //     dataType: 'json',
    //     success: function (data) {
    //         llenarGrillaCertificacion(data);
    //     },
    //     error: function (error) {
    //         NotificacionModule.showMensajeError(error, NotificacionId);
    //     }
    // });
  }

  llenarGrillaCertificacion() {}
  getCertificacionRiquisitos() {}

  obtenerArgumentosMotivacionPrograma() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerArgumentosMotivacionProgramaPorIdOportunidad}/${this.rowActual.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IArgumentoMotivacionPrograma[]>) => {
          this.argumentoMotivacionPrograma$.next(response.body);
        },
      });
  }

  checkboxSeleccionMotivacion() {}
  getMotivacionRiquisitos() {}
  cargarHistorialComentariosOportunidad(rowSeleccionada: any) {}
  SetComentariosOportunidad() {}

  obtenerFechaPagoCategoria$(idMatriculaCabecera: any) {
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.CategoriaAlumnoObtenerFechaPagoCategoria}/${idMatriculaCabecera}`
    );
  }
  obtenerCategoriaAlumno$() {
    return this.integraService.postJsonResponse(
      constApiOperaciones.CategoriaAlumnoObtenerCategoriaAlumno,
      null
    );
  }

  obtenerDatosReporteCertificadoEnvioFisicoPorId$(codigoMatricula: any) {
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.SolicitudCertificadoFisicoDatosReporteCertificadoEnvioFisicoPorId}/${codigoMatricula}`
    );
  }
  obtenerNombreEsquemaEvaluacionPorMatricula$(idMatriculaCabecera: any) {
    return this.integraService.getTextResponse(
      `${constApiOperaciones.EsquemaEvaluacionObtenerNombreEsquemaEvaluacionPorMatricula}/${idMatriculaCabecera}`
    );
  }
  insertarSolicitudOperaciones$(objeto: any) {
    console.log('insertarSolicitudOperaciones')
    let form_data = new FormData();
    for(let key in objeto ) {
      form_data.append(key, objeto[key]);
    }
    return this.integraService.postFormDataResponse(
      constApiOperaciones.SolicitudOperacionesInsertarSolicitudOperaciones,
      form_data
    );
    // return this.integraService.postJsonResponse(
    //   constApiOperaciones.SolicitudOperacionesInsertarSolicitudOperaciones,
    //   JSON.stringify(objeto)
    // );
  }
// realizadoSolicitudOperaciones$(obj:any){
//   // console.log('realizarSolicitud')
//   //   let form_data = new FormData();
//   //   for(let key in obj ) {
//   //     form_data.append(key, obj[key]);
//   //   }
//     return this.integraService.getJsonResponse(
//       `${constApiOperaciones.SolicitudOperacionesRealizadoSolicitud}/${obj.idSolicitudOperaciones}/${obj.usuario}/${obj.observacion}`
//     );
// }


  obtenerEsquemaEvaluacionPorMatricula$(idMatriculaCabecera: any) {
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.EsquemaEvaluacionObtenerEsquemaEvaluacionPorMatricula}/${idMatriculaCabecera}`
    );
  }
  actualizarEsquema$(objeto: any) {
    return this.integraService.postJsonResponse(
      constApiOperaciones.EsquemaEvaluacionActualizarCongelamientoEsquemaEvaluacion,
      JSON.stringify(objeto)
    );
  }

  ObtenerCronogramaEvaluacionV3$(IdCursoMoodle:any, idMatriculaCabecera:number):Observable<HttpResponse<any>> {
    return this.integraService.getJsonResponse(
      constApiOperaciones.AgendaInformacionActividadObtenerEvaluacionesPorMatriculaV3 + '/'+idMatriculaCabecera + '/' + IdCursoMoodle
    )
  }
  AprobarSolicitudBeneficio$(id:any){
    return this.integraService.getJsonResponse(`${constApiOperaciones.AgendaInformacionActividadAprobarSolicitudBeneficio}/${id}/${this.userService.userName}/${4}`)
  }
  RechazarSolicitudBeneficio$(id:any){
    return this.integraService.getJsonResponse(`${constApiOperaciones.AgendaInformacionActividadRechazarSolicitudBeneficio}/${id}/${this.userService.userName}/${7}/${3}`)
  }
  // limpiarContenido() {}

  /**
   * Limpia las cadenas de texto que modifican la vista en agenda
   * @param cadena {string}
   * @return {string}
   */
}

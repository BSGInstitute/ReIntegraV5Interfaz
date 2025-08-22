import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IArbolOcurrenciaAlterno } from '@comercial/models/interfaces/iarbol-ocurrencia-alterno';
import { constApiComercial, constApiGlobal, constApiMarketing } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AnyARecord } from 'dns';
import { ReplaySubject, Subject } from 'rxjs';
import { AgendaOperacionesService } from './agenda-operaciones.service';

@Injectable()
export class AgendaVentaCruzadaOperacionesService {

  constructor(private integraService:IntegraService, private modalService: NgbModal) { }

  private agendaService: AgendaOperacionesService;
  modalRefVentaCruzada: any
  public dataTipoDato$: ReplaySubject<any> = new ReplaySubject<any>();
  public dataFaseOportunidad$: ReplaySubject<
    { codigo: string; id: number; nombre: string }[]
  > = new ReplaySubject<{ codigo: string; id: number; nombre: string }[]>();
  public dataCentroCosto$: ReplaySubject<{ id: number; nombre: string }[]> =
    new ReplaySubject<{ id: number; nombre: string }[]>();
  public listaPais$: ReplaySubject<any> = new ReplaySubject<any>();
  public listaCiudad$: ReplaySubject<any> = new ReplaySubject<any>();

  public tabActual$: Subject<any> = new Subject<any>();
  gridProgramadas: any;
  opciones: any;
  rowActual: any;
  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  ready() {}

  obtenerTipoDatoCombo() {
    this.integraService
      .obtenerTodo(constApiMarketing.TipoDatoObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.dataTipoDato$.next(response.body);
        },
      });
  }
  esCoordinadora: boolean = false
  ocurrencia: any
  validado: boolean = false;
  totalNoProgramadas: number = 0;
  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
    // this.agendaService.agendaActividadesOperacionesService.validado$.subscribe({
    //   next: (response: boolean) => {
    //       this.validado = response;
    //   }
    // });
    // this.agendaService.agendaActividadesOperacionesService.totalNoProgramadas$.subscribe({
    //   next: (response: number) => {
    //       this.totalNoProgramadas = response;
    //   }
    // });
    this.obtenerTipoDatoCombo();
    this.obtenerCentroCosto();
    this.obtenerFaseOportunidad();
  }

  resetFicha() {
    this.dataTipoDato$ = new ReplaySubject<any>();
    this.dataFaseOportunidad$ = new ReplaySubject<
      { codigo: string; id: number; nombre: string }[]
    >();
    this.dataCentroCosto$ = new ReplaySubject<
      { id: number; nombre: string }[]
    >();
    this.listaPais$ = new ReplaySubject<any>();
    this.listaCiudad$ = new ReplaySubject<any>();
  }

  obtenerFaseOportunidad() {
    this.integraService
      .obtenerTodo(constApiComercial.FaseOportunidadObtenerCombo)
      .subscribe({
        next: (
          response: HttpResponse<
            { codigo: string; id: number; nombre: string }[]
          >
        ) => {
          this.dataFaseOportunidad$.next(response.body);
        },
      });
  }
  obtenerCentroCosto() {
    this.integraService
      .getJsonResponse(constApiComercial.CentroCostoObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<{ id: number; nombre: string }[]>) => {
          this.dataCentroCosto$.next(response.body);
        },
      });
  }

  obtenerCentroCostoAutocomplete(value: any) {
    this.integraService
      .postJsonResponse(
        constApiComercial.CentroCostoObtenerAutocomplete,
        JSON.stringify({
          valor: value,
        })
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.dataCentroCosto$.next(response.body);
        },
      });
  }

  obtenerPais() {
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (response: HttpResponse<any>) => {
        this.listaPais$.next(response.body);
      },
    });
  }

  obtenerCiudad() {
    this.integraService
      .obtenerTodo(constApiGlobal.CiudadObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaCiudad$.next(response.body);
        },
      });
  }



  setOpciones() {
    if (this.opciones === undefined) this.opciones = {};
    if (this.opciones.enableCentroCosto === undefined)
      this.opciones.enableCentroCosto = false;
    if (this.opciones.enableAsignadoA === undefined)
      this.opciones.enableAsignadoA = false;
    if (this.opciones.conservarTipoDatoOportunidadAnterior === undefined)
      this.opciones.conservarTipoDatoOportunidadAnterior = false;

    if (this.opciones.controlesParaFinalizarActividad === undefined)
      this.opciones.controlesParaFinalizarActividad = false;
    // $centroCosto = $("#referido_CentroCostos").data("kendoMultiSelect");
    // $centroCosto.enable(this.opciones.enableCentroCosto);
    // $asignadoA = $("#referido_AsignadoA").data("kendoAutoComplete");
    // $asignadoA = $("#referido_AsignadoA").data("kendoAutoComplete");
    // $asignadoA.enable(this.opciones.enableAsignadoA);
    // $("#formGroupComentario").toggle(this.opciones.controlesParaFinalizarActividad);
  }

  /**
   * Obtiene todos los correos recibidos por ambas partes
   * @param idAsesor
   * @param idAlumno
   * @returns object<any>
   */
  cargarRecibidos(idAsesor: number = 633, idAlumno: number = 10261126): object {
    let correosRecibidos: any;
    let paramsTemp: any = {
      idAsesor: idAsesor,
      idAlumno: idAlumno,
      Folder: 'inbox',
      FiltroKendo: {
        filters: [
          {
            Field: 'Remitente',
            Operator: 'contains',
            value: 'ruthjgutierrezr@gmail.com',
          },
        ],
        logic: 'and',
      },
    };
    console.log('mefalla4');
    this.integraService
      .obtenerPorFiltro(
        constApiComercial.CorreoObtenerCorreoRecibido,
        paramsTemp
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          correosRecibidos = response.body.listaCorreos;
        },
      });
    return correosRecibidos;
  }

  clearFieldsFormRef() {}
  actividadEjecutadaOperaciones(idActividadEjecutada:number) {
    let gridAgendas = this.agendaService.agendaInicializarOperacionesService.obtenerDataGrids();
    gridAgendas.forEach((grid) => {
      let index = grid.data.findIndex(
        (item: any) => item.id == idActividadEjecutada
      );
      if (index != -1) {
        //Si existe la actividad la Eliminamos
        grid.data.splice(index, 1);
        grid.loadView();
        //Si no hay ams elementos recargamos
        if (grid.data.length == 0) {
          if (!this.esCoordinadora) {
            this.agendaService.recargarActividades(true);
          }
        }
      }
    });
  }
  _getDataSource_AgendaRealizada() {}
  cargarPantalla1V4() {}

  llenarCentroCosto() {}
  diferenciaHoraria() {}
  dateAdd() {}

  // centroCostoNombre: string;
  // idReferidoPor: string;
  // centroCostoNombre: string;
  // centroCostoNombre: string;
  alumno: any;

  callAjaxRef() {}
  displayLoadingRef() {}
  hideLoadingRef() {}
  showMensajeRef() {}

  //Funcion disparadora de los eventos--Incoorporar en componente

  newEditarVentaCruzada() {
    this.nuevaOportunidadVentaCruzada(this.agendaService.rowActual);
  }

  nuevaOportunidadVentaCruzada(ocurrencia: any) {
    // let opciones: any = {
    //   conservarTipoDatoOportunidadAnterior: false,
    //   controlesParaFinalizarActividad: true,
    //   enableCentroCosto: true,
    //   tipoDato: this.rowActual.idTipoDato,
    //   Origen: this.rowActual.origen,
    // };
    // let dataAlumno = {
    //   pais: this.datosAlumno.idCodigoPais,
    //   ciudad: this.datosAlumno.idCiudad,
    // };
    // this.setModo(2, opciones);
    // this.mostrarModalConFinalizarActividad(this.agendaService.rowActual, ocurrencia, dataAlumno)
  }

  mostrarModalConFinalizarActividad(
    _actividad: any,
    _ocurrencia: any,
    datosAlumno: any
  ) {
    // this.asignarValoresToFormRef(datosAlumno);
    // this.ocurrencia = _ocurrencia;
    // this.actividad = _actividad;
  }
  obtenerConfiguracionReferidos() {}

  obtenerConfiguracionContacto() {
    return this.integraService.getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerConfiguracionContacto}/${this.rowActual.idTipoDato}`
    );
  }

  //   return {
  //     nuevaOportunidadVentaCruzada: nuevaOportunidadVentaCruzada,
  //     clearFieldsFormRef: clearFieldsFormRef,
  //     initCombos: _initCombos,
  //     datasourceContacto: function (args) {
  //         DatosAlumnos = args;
  //     },
  //     setDatosOportunidad: setDatosOportunidad,
  //     RealizarVentaCruzada: RealizarVentaCruzada,
  //     ActividadEjecutada: ActividadEjecutada,
  //     ActividadEjecutadaOperaciones: ActividadEjecutadaOperaciones
  // };

  itemOcurrenciaTemp: IArbolOcurrenciaAlterno;
  actividadAntigua: any = [];

  recuperarActividad() {
    // let ocurrencia = this.agendaService.rowActual.ocurrencia;
    var actividadAntigua: any = {
      idOcurrencia: (this.ocurrencia == null) ? 62 : this.ocurrencia.idOcurrenciaReporte,//55
      idOcurrenciaActividad: (this.ocurrencia  == null) ? 3274: this.ocurrencia.idOcurrenciaActividad,//1363
      id: this.rowActual.id,
      comentario:
        this.dataFormularioOportunidad.comentarioActividad != null
          ? this.dataFormularioOportunidad.comentarioActividad
          : '',
      idAlumno: this.agendaService.rowActual.idAlumno,
      idOportunidad: this.agendaService.rowActual.idOportunidad,
      idAsignado: this.rowActual.idPersonal_Asignado,
      idCentralLlamada: 7205,
    };
    return actividadAntigua;
  }
  loader: boolean = false
  public visualizarModal: boolean = false;
  private dataFormularioOportunidad: any;
  RealizarVentaCruzada(obj: any, ocurrencia?: any): void {
    this.ocurrencia = ocurrencia
    this.dataFormularioOportunidad = obj;
    if (
      obj.ocurrencia == null &&
      obj.idCentroCosto == 0
    ) {
      alert('Seleccione un centro de costo');
      return;
    }
    // let objeto: any = {
    //   idPersonalAsignado: obj.idPersonalAsignado,
    //   idTipoDato: obj.tipoDato,
    //   idFaseOportunidad: 13,
    //   idOrigen: 135,
    //   idAlumno: this.agendaService.rowActual.idAlumno,
    //   ultimaFechaProgramada: obj.horaContacto,
    //   idCentroCosto: obj.idCentroCosto[0],
    //   ultimoComentario: 'Sin Comentario',
    //   idContacto: this.agendaService.rowActual.idAlumno,
    //   idTipoInteraccion: 17, //Formulario Enviado Completo
    //   idSubCategoriaDato: this.agendaService.rowActual.idSubCategoriaDato,
    // };
    // let objeto;
    this.opciones.conservarTipoDatoOportunidadAnterior = false;
    this.opciones.controlesParaFinalizarActividad = true;
    this.opciones.enableCentroCosto = true;
    this.opciones.tipoDato = this.agendaService.rowActual.idTipoDato;
    this.opciones.origen = this.agendaService.rowActual.origen;

    //Se debe de deshabilitar el boton de Realizar venta hasta que se culmine con el proceso
    this.loader = true;
    if (this.opciones.controlesParaFinalizarActividad) {
      let actAntigua: any = this.recuperarActividad();
      let params: any = {
        actividadAntigua: actAntigua,
        datosOportunidad: obj,
        idFaseOportunidad: this.agendaService.rowActual.idFaseOportunidad,
        datosCompuesto: this.agendaService.agendaModalOperacionesService.traerListas(),
        usuario: this.agendaService.userName,
      };
      this.integraService
        .postJsonResponse(
          constApiComercial.OportunidadFinalizarActividadCrearOportunidadAlterno,
          JSON.stringify(params)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            //EnvioAutomaticoPlantillaWhatsApp();
            // localStorage.clear();
            let tabActual = this.agendaService.tabActual;
            if(this.validado){
              if(tabActual.nombreTab == 'NoProg1Solicitud' || tabActual.nombreTab == 'NoProgMas1Solicitud'){
                this.totalNoProgramadas--;
                // this.agendaService.agendaActividadesOperacionesService.totalNoProgramadas = this.totalNoProgramadas
                // this.agendaService.agendaActividadesOperacionesService.totalNoProgramadas$.next(this.totalNoProgramadas)
              }
            }
            this.actividadEjecutada(
              this.agendaService.rowActual.id,
              response.body.ActividadEjecutada
            );
            this.modalService.dismissAll();
            this.loader = false;
          },
          error: (error) => {
            alert('Ocurrio un problema al realizar Venta Cruzada');
            this.loader = false;
            this.modalRefVentaCruzada.close();
          }
        });
    } else {
      //SI TIENE QUE CREAR UNA OPORUTNIDAD SIN FILTRO DE FASE EN SEGUIMIENTO
      console.log('Error Log');
      this.modalService.dismissAll();
      this.loader = false;
      // let oportunidad: any = {
      //   idPersonalAsignado: obj.idPersonalAsignado,
      //   idTipoDato: this.agendaService.rowActual.idTipoDato,
      //   idFaseOportunidad: 13,
      //   idOrigen: this.agendaService.rowActual.origen,
      //   idAlumno: this.agendaService.rowActual.idAlumno,
      //   ultimaFechaProgramada: obj.ultimaFechaProgramada,
      //   ultimoComentario: 'Sin Comentario',
      //   idContacto: this.agendaService.rowActual.idAlumno,
      //   idTipoInteraccion: 15,
      //   idSubCategoriaDato: this.agendaService.rowActual.idSubCategoriaDato,
      // };
      this.integraService
        .postJsonResponse(
          constApiComercial.AgendaInformacionActividadCrearOportunidadSinValidarOportunidadEnSeguimientoActualizarAlumno,
          JSON.stringify(obj)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            // localStorage.clear();
            //Se debe de habilitar el boton de Realizar venta
            if (response.body.Respuesta == 'ERROR') {
              alert('Hubo un error, revisar consola');
              alert('NO SE PUDO CREAR VENTA CRUZADA');
              return;
            }
            this.modalService.dismissAll();
          },
          error: (error) => {
            alert('Ocurrio un problema al realizar Venta Cruzada');
            this.loader = false;
            this.modalRefVentaCruzada.close();
          }
        });
    }
  }

  actividadEjecutada(idActividadEjecutada: any, dataActividadEjecutada: any) {
    console.log('idActividadEjecutada');
    // var agendas = [$('#gridProgramadas').data("kendoGrid"), $('#gridProgramadasAutomatica').data("kendoGrid"), $('#gridNoProgUnaSolic').data("kendoGrid"), $('#gridMultipleSolicitud').data("kendoGrid"), $('#gridWorkshop').data("kendoGrid"), $('#gridNoProgAltasMedias').data("kendoGrid"), $('#gridVencidasIpIcPf').data("kendoGrid"), $('#gridVencidasIsM').data("kendoGrid"), $('#gridPreLanzamiento').data("kendoGrid"), $('#gridRn2').data("kendoGrid"), $('#gridVentaCruzada').data("kendoGrid")];//gridagenda_ism
    let gridAgendas: any[] =
      this.agendaService.agendaInicializarOperacionesService.obtenerDataGrids();
    gridAgendas.forEach((grid: any) => {
      let index = grid.data.findIndex(
        (item: any) => item.id == idActividadEjecutada
      );
      if (index != -1) {
        // let index= items.findIndex((element: any) => element.id == idActividadEjecutada);
        //Si existe la actividad la Eliminamos
        grid.data.splice(index, 1);
        grid.loadView();
        //Si no hay ams elementos recargamos
        if (grid.data.length == 0) {
          if (!this.esCoordinadora) {
            // this.agendaService.agendaActividadesOperacionesService.recargarActividades(
            //   true
            // );
          }
          if (this.esCoordinadora) {
            // $("#btnFiltrarISM").click();
          }

          //agenda.dataSource.read();
        }
      }
    });

  }

  recargaractividades(flag: any) {
    let EstadoCargarTabs = flag;
    // $.ajax({
    //     url: 'https://integrav4-servicios.bsginstitute.com/api/Agenda/ObtenerActividadesAgenda/' + IdPersonal + '/' + flag + '/' + AreaTrabajo,
    //     type: 'GET',
    //     dataType: 'json',
    //     success: function (data, textStatus, xhr) {
    //         cargarTabs(data);
    //         habilitarClassTabs(data.estadosTabs);
    //     },
    //     error: function (error) {
    //         NotificacionModule.showMensajeError(error, NotificacionId);
    //     }
    // });
  }
}

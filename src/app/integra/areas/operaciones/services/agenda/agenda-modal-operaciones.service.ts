import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';
import { IPrerequisitoBeneficioCompetidor, IProblemaDetalle, ITiempoCapacitacion } from '@comercial/models/interfaces/iagenda-modal';
import { AgendaService } from '@comercial/services/agenda/agenda.service';
import { constApiComercial } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { AgendaOperacionesService } from './agenda-operaciones.service';

@Injectable()
export class AgendaModalOperacionesService {

  constructor(private integraService:IntegraService) { }

  private agendaService: AgendaOperacionesService;

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  public variableRecargarProblema: boolean = true;
  public arregloPreGlobal: any = null;
  public $dataOpoCom: any = null;
  public _rbtOptionAuxiliar: any = null;
  public cargarPaso56$: ReplaySubject<any> = new ReplaySubject<any>();
  public dataCompetidores$: ReplaySubject<{ id: number; nombre: string }[]> =
    new ReplaySubject<{ id: number; nombre: string }[]>();
  public tiempoCapacitacionPorIdOportunidad$: ReplaySubject<ITiempoCapacitacion> =
    new ReplaySubject<ITiempoCapacitacion>();
  public correoInteraccionV2EnviadosPorPersonal$: ReplaySubject<any> =
    new ReplaySubject<any>();
  public competidorPorIdOportunidad$: ReplaySubject<any> =
    new ReplaySubject<any>();
  public dataProblemaCliente$: BehaviorSubject<IProblemaDetalle[]> = new BehaviorSubject<IProblemaDetalle[]>(
    []
  );
  public prerequisitosBeneficiosCompetidoresPorIdOportunidad$: ReplaySubject<any> =
    new ReplaySubject<any>(1);
  paso56Correcto: boolean = false;

  beneficioOportunidad$: BehaviorSubject<string> = new BehaviorSubject<any>('');
  dataGridBeneficios$: BehaviorSubject<any> = new BehaviorSubject<any>(
    new KendoGrid()
  );
  dataGridFactoresMotivacion$: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  dataGridPublicoObjetivo$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  dataGridCertificacionGeneral$: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  dataGridPrerequisitos$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  dataGridProblemaCliente$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  dataTiemposCapacitacion$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(
    []
  );
  checkCompetidorNO$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  checkCompetidorSI$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  competidor$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);

  private rowActual: any;
  async initFicha() {
    this.rowActual = this.agendaService.rowActual;
  }

  async resetFicha() {
    this.checkCompetidorNO$ = new BehaviorSubject<boolean>(false);
    this.checkCompetidorSI$ = new BehaviorSubject<boolean>(false);
    this.beneficioOportunidad$ = new BehaviorSubject<string>('');
    this.tiempoCapacitacionPorIdOportunidad$ = new ReplaySubject<ITiempoCapacitacion>();
    this.dataGridFactoresMotivacion$ = new BehaviorSubject<any[]>([]);
    this.dataGridPublicoObjetivo$ = new BehaviorSubject<any[]>([]);
    this.dataGridCertificacionGeneral$ = new BehaviorSubject<any[]>([]);
    this.dataGridPrerequisitos$ = new BehaviorSubject<any[]>([]);
    this.dataGridProblemaCliente$ = new BehaviorSubject<any[]>([]);
    this.dataTiemposCapacitacion$ = new BehaviorSubject<any[]>([]);
    this.dataGridCertificacionGeneral$ = new BehaviorSubject<any[]>([]);
    this.dataProblemaCliente$ = new BehaviorSubject<IProblemaDetalle[]>([]);
    this.competidor$ = new BehaviorSubject<number[]>([]);
  }
  async ready() {
    this.cargarCompetidores();
  }
  recargarProblema() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerProgramaGeneralProblemaDetallePorIdOportunidad}/${this.rowActual.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IProblemaDetalle[]>) => {
          this.variableRecargarProblema = false;
          this.dataProblemaCliente$.next(response.body);
        },
        error: () => {
          if (this.variableRecargarProblema) {
            this.recargarProblema();
          }
        },
      });
  }

  regularizarPaso56() {
    if (this.paso56Correcto == false) {
      this.integraService
        .getJsonResponse(
          `${constApiComercial.AgendaInformacionActividadObtenerPrerequisitosBeneficiosCompetidoresPorIdOportunidad}/${this.rowActual.idOportunidad}`
        )
        .subscribe({
          next: (rpta: any) => {
            this.paso56Correcto = true;
            this.prerequisitosBeneficiosCompetidoresPorIdOportunidad$.next(
              rpta.body
            );
            // cargarPaso56(rpta);
          },
          error: (err: any) => {
            this.regularizarPaso56();
          },
        });
    }
  }
  _onSelectValidacion(idTiempoCapacitacionValidacion: any) {}
  cargarPlazosInicioPrograma(idTiempo: any) {
    let params = {
      id: this.rowActual.idOportunidad,
      idTiempoCapacitacionValidacion: idTiempo,
      usuario: this.agendaService.userName
    }
    this.integraService
    .postJsonResponse(constApiComercial.AgendaInformacionActividadActualizarTiempoCapacitacion, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log("Se actualizo correctamente")
        },
      })
  }

  cargarCompetidores() {
    this.integraService
      .obtenerTodo(
        constApiComercial.AgendaInformacionActividadObtenerCompetidores
      )
      .subscribe({
        next: (response: HttpResponse<{ id: number; nombre: string }[]>) => {
          this.dataCompetidores$.next(response.body);
        },
      });
  }

  ClosusePrerequisitos() {}
  cargarGridInteracciones(data: any) {}
  verInteraccionesCorreo(e: any) {}
  verContenidoCorreo(e: any) {}
  abrirModalContenido(data: any) {}
  abrirModalContenidoAlterno(data: any) {}
  abrirModalInteracciones(data: any) {}
  cerrarModalVerInteraccionesCorreo(data: any) {}

  cargarRegistrosPantallaCompetidores() {
    this.variableRecargarProblema = true;
    this.recargarProblema();

    this.obtenerTiempoCapacitacion();

    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerCorreoInteraccionV2EnviadosPorPersonal}/${this.rowActual.idAlumno}/${this.rowActual.idPersonal_Asignado}`
      )
      .subscribe({
        next: (rpta: any) => {
          this.correoInteraccionV2EnviadosPorPersonal$.next(rpta.body);
        },
      });

    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerCompetidorPorIdOportunidad}/${this.rowActual.idOportunidad}`
      )
      .subscribe({
        next: (rpta: any) => {
          this.competidorPorIdOportunidad$.next(rpta.body);
        },
      });

    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerPrerequisitosBeneficiosCompetidoresPorIdOportunidad}/${this.rowActual.idOportunidad}`
      )
      .subscribe({
        next: (rpta: HttpResponse<IPrerequisitoBeneficioCompetidor>) => {
          this.paso56Correcto = true;
          this.prerequisitosBeneficiosCompetidoresPorIdOportunidad$.next(
            rpta.body
          );
          this.cargarPaso56$.next(rpta.body);

          this.oportunidadCompetidor = rpta.body.oportunidadCompetidor;

          let arregloPre = [
            {
              nombre: 'Pre-requisitos Generales',
              contenido: rpta.body.prerequisitosGenerales,
            },
            {
              nombre: 'Pre-requisitos Especificos',
              contenido: rpta.body.prerequisitosEspecificos,
            },
          ];
          this.arregloPreGlobal = arregloPre;

          // cargarPaso56(rpta);
        },
        error: (err: any) => {
          this.regularizarPaso56();
        },
      });
  }

  obtenerTiempoCapacitacion(){
    this.integraService
    .getJsonResponse(
      `${constApiComercial.AgendaInformacionActividadObtenerTiempoCapacitacionPorIdOportunidad}/${this.rowActual.idOportunidad}`
    )
    .subscribe({
      next: (rpta: HttpResponse<ITiempoCapacitacion>) => {
        this.tiempoCapacitacionPorIdOportunidad$.next(rpta.body);
      },
    });
  }
  oportunidadCompetidor: any = {};
  cargarPaso56(rpta: any) {
    // var $validarCompetidor = $("#Validado");
    if (rpta.oportunidadCompetidor != null) {
      // $("#inputBeneficiosOportunidad").val(rpta.OportunidadCompetidor.OtroBeneficio);
      if (rpta.oportunidadCompetidor.respuesta === 1) {
        // $("#opcionnro1").prop('checked', true);
      } else if (rpta.oportunidadCompetidor.respuesta === 2) {
        // $("#opcionnro2").prop('checked', true);
      }
      // $("#Validado").val(rpta.OportunidadCompetidor.Completado);
      if (rpta.oportunidadCompetidor.respuesta === 0) {
        // $("#Validado").html('<div style="color: #a94442;" data-val="Falta"><strong style="color:#a94442;">Falta Verificar</strong></div>');
      } else if (rpta.oportunidadCompetidor.respuesta === 1) {
        // $("#Validado").html('<i class="glyphicon glyphicon-ok" style="color: #4caf50;" data-val="Si"><strong style="color:#4caf50;">Aplica</strong></i>');
      } else {
        // $("#Validado").html('<i class="glyphicon glyphicon-remove" style="color: #a94442;" data-val="No"><strong style="color:#a94442;">No Aplica</strong></i>');
      }
      // this.$dataOpoCom = rpta.OportunidadCompetidor;
      let arregloPre = [
        { nombre: 'Pre-requisitos Generales', contenido: rpta.listaPreGeneral },
        {
          nombre: 'Pre-requisitos Especificos',
          contenido: rpta.listaPreEspecifico,
        },
      ];
      // arregloPreGlobal = arregloPre;
      // _cargarPrerequisitos(rpta.ListaPreGeneral);
      // _cargarPrerequisitosByOportunidad(rpta.ListaPreGeneral || []);
      // _cargarPrerequisitosEspecificosByOportunidad(rpta.ListaPreEspecifico || []);
      // this._cargarBeneficiosByOportunidad(rpta.ListaBeneficios || []);
      // _cargarArgumentos(rpta.ListaBeneficios || []);

      // this.agendaService.agendaInformacionActividadOportunidadService.obtenerPublicoObjetivo(
      //   registroOportunidad
      // );

      if (rpta.listaCompetidores !== null) {
        // var multiSelect = $("#inputCompetidores").data("kendoMultiSelect");
        // multiSelect.value(rpta.ListaCompetidores);
      }
    } else {
      if (rpta !== null) {
        // $("#inputBeneficiosOportunidad").val(" ");
        // this.$validarCompetidor.val("Falta");
        var arregloPre = [
          {
            Nombre: 'Pre-requisitos Generales',
            Contenido: rpta.listaPreGeneral,
          },
          {
            Nombre: 'Pre-requisitos Especificos',
            Contenido: rpta.listaBeneficios,
          },
        ];
        // this.arregloPreGlobal = arregloPre;
        // _cargarPrerequisitos(rpta.ListaPreGeneral);
        // _cargarPrerequisitosByOportunidad(rpta.ListaPreGeneral);
        // _cargarPrerequisitosEspecificosByOportunidad(rpta.ListaPreEspecifico);
        // this._cargarBeneficiosByOportunidad(rpta.ListaBeneficios);
        // _cargarArgumentos(rpta.ListaBeneficios);
      }
    }
  }

  _cargarBeneficiosByOportunidad(data: any) {
    let _gridSistemas = data;
  }

  traerListas() {
    console.log('traerListas');
    let objG: any = {};
    let objcheck: any = {};
    let validarPerfil: any = 0;

    objG.idOportunidad = this.rowActual.idOportunidad;
    objG.otroBeneficio = this.beneficioOportunidad$.value;

    if (objG.otroBeneficio == '') objG.otroBeneficio = ' ';
    //obj.respuesta = $("#inputOpciones").val();
    if (this.checkCompetidorSI$.value == true) {
      objG.respuesta = 1;
    } else if (this.checkCompetidorNO$.value == true) {
      objG.respuesta = 2;
    } else {
      objG.respuesta = 0;
    }

    // obj.completado = $("#Validado").children().data("val");
    objG.completado = 'Falta';
    // if (obj.Completado === null || obj.Completado === undefined) {
    // }

    if (
      this.oportunidadCompetidor != null &&
      this.oportunidadCompetidor?.id != null
    ) {
      objG.id = this.oportunidadCompetidor.id;
      //obj.RowVersion = $dataOpoCom.RowVersion;
    } else {
      objG.id = 0;
      //obj.RowVersion = null;
      objG.completado = 'Falta';
    }
    //
    let listaPrerequisito: any[] = [];
    let listaPrerequisitoEsp: any[] = [];
    // if ($("#GridPrerequisitos").data("kendoGrid") == undefined) {
    //     listaPrerequisito = arregloPreGlobal.filter(x => x.Nombre == "Pre-requisitos Generales")[0].Contenido;
    // }
    // else {
    // }
    listaPrerequisito = this.dataGridPrerequisitos$.value;
    // if ($("#GridPrerequisitosEsp").data("kendoGrid") == undefined) {
    //     listaPrerequisitoEsp = arregloPreGlobal.filter(x => x.Nombre == "Pre-requisitos Especificos")[0].Contenido;
    // }
    // else {
    //     listaPrerequisitoEsp = $("#GridPrerequisitosEsp").data("kendoGrid").dataSource.data();
    //   }
    // listaPrerequisitoEsp = this.arregloPreGlobal.filter(
    //   (x: any) => x.nombre == 'Pre-requisitos Especificos'
    // )[0].contenido;

    let listaPrerequisitoAlterno: any = this.dataGridPrerequisitos$.value;
    let listaBeneficio: any = this.dataGridBeneficios$.value;
    let listaBeneficioAlterno: any = this.dataGridBeneficios$.value;
    let listaCompetidor: any = this.competidor$.value;

    let listaSoluciones: any[] = [];
    let listaSolucionesAlterno: any[] = [];
    // var listaSoluciones = traerCausaSolucionLista();
    // var listaSolucionesAlterno = traerCausaSolucionListaAlterno();

    let listaMotivacion: any[] = this.dataGridFactoresMotivacion$.value;
    let listaPublicoObjetivo: any[] = this.dataGridPublicoObjetivo$.value;
    let listaCertificacion: any[] = this.dataGridCertificacionGeneral$.value;

    let objPrerequisitos: any[] = [];
    let objPrerequisitosAlterno: any[] = [];
    let objPrerequisitosEspecifico: any[] = [];
    let objListaBeneficios: any[] = [];
    let objListaBeneficiosAlterno: any[] = [];
    let objListaBeneficios2: any[] = [];
    let objListaMotivacion: any[] = [];
    let objListaPublicoObjetivo: any[] = [];
    let objListaCertificacion: any[] = [];

    listaPrerequisito.forEach((item: any) => {
      let obj: any = {};
      obj.idOportunidadCompetidor = 0;
      obj.idProgramaGeneralBeneficio = Number(item.idPrerequisito);
      obj.respuesta = item.respuesta;
      obj.completado = item.completado;
      objPrerequisitos.push(obj);
    });
    listaPrerequisitoAlterno.forEach((item: any) => {
      let obj: any = {};
      obj.idOportunidad = this.rowActual.idOportunidad;
      obj.idProgramaGeneralPrerequisito = Number(item.idPrerequisito);
      obj.respuesta = item.respuesta;
      objPrerequisitosAlterno.push(obj);
    });
    listaPrerequisitoEsp.forEach((item: any) => {
      let obj: any = {};
      obj.idOportunidadCompetidor = 0;
      obj.idProgramaGeneralBeneficio = Number(item.idPrerequisito);
      obj.respuesta = item.respuesta;
      obj.completado = item.completado;
      objPrerequisitosEspecifico.push(obj);
    });
    listaBeneficio.forEach((item: any) => {
      let obj: any = {};
      obj.idOportunidadCompetidor = 0;
      obj.idBeneficio = Number(item.id);
      obj.respuesta = item.respuesta;
      obj.completado = item.completado;
      objListaBeneficios.push(obj);
    });

    listaBeneficioAlterno.forEach((item: any) => {
      let obj: any = {};
      obj.idOportunidad = this.rowActual.idOportunidad;
      obj.idBeneficio = Number(item.id);
      obj.respuesta = item.respuesta;
      objListaBeneficiosAlterno.push(obj);
    });

    listaMotivacion.forEach((item: any) => {
      let obj: any = {};
      obj.idOportunidad = this.rowActual.idOportunidad;
      obj.idMotivacion = Number(item.idMotivacion);
      obj.respuesta = item.respuesta;
      objListaMotivacion.push(obj);
    });

    listaPublicoObjetivo.forEach((item: any) => {
      let obj: any = {};
      obj.idOportunidad = this.rowActual.idOportunidad;
      obj.idPublicoObjetivo = Number(item.id);
      obj.respuesta = item.respuesta;
      objListaPublicoObjetivo.push(obj);
    });

    listaCertificacion.forEach((item: any) => {
      let obj: any = {};
      obj.idOportunidad = this.rowActual.idOportunidad;
      obj.idCertificacion = Number(item.idCertificacion);
      obj.respuesta = item.respuesta;
      objListaCertificacion.push(obj);
    });
    const alumno: IAlumnoInformacion =
      this.agendaService.agendaAlumnoOperacionesService.alumno$.value;
    if (alumno.dni !=  '') {
      objcheck.dni = true;
    } else {
      if (alumno.idCodigoPais != 51) {
        objcheck.dni = true;
      } else {
        objcheck.dni = false;
      }
    }
    if (alumno.idAFormacion !== 0) {
      validarPerfil++;
    }
    if (alumno.idCargo !== 0) {
      validarPerfil++;
    }
    if (alumno.idIndustria !== 0) {
      validarPerfil++;
    }
    if (alumno.idATrabajo !== 0) {
      validarPerfil++;
    }
    if (alumno.idEmpresa !== 0) {
      validarPerfil++;
    }
    objcheck.id = '0';
    objcheck.perfilCamposTotal = 5;
    objcheck.perfilCamposLlenos = validarPerfil;
    objcheck.pGeneralTotal = listaPrerequisito.length;
    objcheck.pGeneralValidados = listaPrerequisito.filter(
      (valor: any) => valor.Respuesta === 1 || valor.Respuesta === 2
    ).length;
    objcheck.pEspecificoTotal = listaPrerequisitoEsp.length;
    objcheck.pEspecificoValidados = listaPrerequisitoEsp.filter(
      (valor: any) => valor.Respuesta === 1 || valor.Respuesta === 2
    ).length;
    objcheck.beneficiosTotales = listaBeneficio.length;
    objcheck.beneficiosValidados = listaBeneficio.filter(
      (valor: any) => valor.Respuesta === 1 || valor.Respuesta === 2
    ).length;

    if (objG.respuesta == 1 || objG.respuesta == 2) {
      objcheck.CompetidoresVerificacion = true;
    } else {
      objcheck.CompetidoresVerificacion = false;
    }

    objcheck.idOportunidad = objG.idOportunidad;
    objG.calidadBO = objcheck;
    objcheck.problemaSeleccionados = listaSoluciones.filter(
      (valor: any) => valor.idProblemaCliente !== '0'
    ).length;
    objcheck.problemaSolucionados = listaSoluciones.filter(
      (valor: any) => valor.solucionado
    ).length;
    let objeto: any = {};
    objeto.oportunidadCompetidor = objG;
    objeto.listaBeneficioAlterno = objListaBeneficiosAlterno;
    objeto.listaCompetidor = listaCompetidor;
    objeto.listaSolucionesAlterno = listaSolucionesAlterno;
    objeto.listaMotivacion = objListaMotivacion;
    objeto.listaPublicoObjetivo = objListaPublicoObjetivo;
    objeto.listaCertificacion = objListaCertificacion;
    objeto.listaPrerequisitoGeneralAlterno = objPrerequisitosAlterno;
    return objeto;
  }

  siCumple(valor: any) {
    if (valor.Respuesta === 1 || valor.Respuesta === 2) return true;
    else return false;
  }
}

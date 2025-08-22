import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOportunidadInformacion, IArgumentoMotivacionPrograma, IPublicoObjetivoPrograma } from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { IPrerequisitoBeneficioCompetidor, IProblemaDetalle, ITiempoCapacitacion } from '@comercial/models/interfaces/iagenda-modal';
import { IDatosSentinelAlumno, ILineaCredito, ILineaDeuda, ISemaforoSentinelAlumno } from '@comercial/models/interfaces/isemaforo-financiero';
import { constApiComercial, constApiGlobal } from '@environments/constApi';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RowArgs } from '@progress/kendo-angular-grid';
import { IDatosAlumno, IInformacionOportunidadFicha, IInteraccionAlumno } from '@shared/models/interfaces/ificha-alumno';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-ficha-alumno',
  templateUrl: './ficha-alumno.component.html',
  styleUrls: ['./ficha-alumno.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FichaAlumnoComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal,
    private route: ActivatedRoute
  ) {}

  idAlumno: number = 0;
  idOportunidad: number = 0;
  nombreCentroCosto: string = '';
  
  flagConsultaCR: boolean = false;
  nombreCompletoAlumno = 'Cargando...';
  datosAlumno: any;
  cabeceraSpeech: any = {};
  alumno: IDatosAlumno = {
    idClasificacionPersona: 0,
    id: 0,
    nombre1: '',
    nombre2: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    dni: '',
    fechaNacimiento: undefined,
    telefono: '',
    celular: '',
    email1: '',
    email2: '',
    idCargo: 0,
    cargo: '',
    idAFormacion: 0,
    aFormacion: '',
    idATrabajo: 0,
    aTrabajo: '',
    idIndustria: 0,
    industria: '',
    idCodigoPais: 0,
    nombrePais: '',
    idCiudad: 0,
    nombreCiudad: '',
    idEstadoContactoWhatsApp: 0,
    rutaBandera: '',
    codigoMatricula: ''
  };
  faseActual = '';
  centroCosto = '';
  ciudadCabecera = '';
  tipoInput = 'password';
  cabeceraSemaforoFinanciero: any = {};
  edadClienteSentinel = '';
  monedaCliente = '';
  competidor: any[] = [];
  gridCreditos = new KendoGrid();
  gridDeudas = new KendoGrid();
  gridDeudasVencidas = new KendoGrid();
  gridFactoresMotivacion = new KendoGrid();
  gridPrerequisitos = new KendoGrid();
  gridCertificacionGeneral = new KendoGrid();
  gridPublicoObjetivo = new KendoGrid();

  gridHistorialOportunidades = new KendoGrid();
  gridHistorialInteraccionesEfectivo = new KendoGrid();
  gridBeneficios = new KendoGrid();
  gridVentaCruzada = new KendoGrid();
  urlGrabacion = '';
  dataTiemposCapacitacion: any[] = [];
  programaGeneral = '';
  checkCompetidorSI = false;
  checkCompetidorNO = false;
  beneficioOportunidad: string = '';
  correoRecibidos: any;
  sentinelAlumno: any;
  informacionOportunidad: IInformacionOportunidadFicha = {
    listaOportunidadVentaCruzada: [],
    datosAlumno: undefined,
    programaGeneralPreBen: undefined,
    listaProblemaCliente: [],
    oportunidadComplementos: undefined,
    probabilidadsueldo: undefined,
    idFaseOportunidad: undefined,
    idActividadDetalle: undefined,
    nombresPersonal: undefined,
    apellidosPersonal: undefined,

  };

  dataNivelCumplimiento = [
    { id: 1, nombre: 'Cumple al 100%' },
    { id: 2, nombre: 'Cumple al 75%' },
    { id: 3, nombre: 'Cumple al 50%' },
    { id: 4, nombre: 'Cumple al 25%' },
    { id: 5, nombre: 'No cumple en absoluto' },
  ];

  optionCertificacion = [
    { id: 1, nombre: 'Si, cumple ahora' },
    { id: 2, nombre: 'Cumple en 6 meses' },
    { id: 3, nombre: 'Cumple en 1 año' },
    { id: 4, nombre: 'Cumple en mas de 1 año' },
    { id: 5, nombre: 'No cumple' },
  ];

  gridHistorialMensajes = new KendoGrid();
  gridHistorialCorreo = new KendoGrid();
  buttons: any = null;
  categoriaDescripcion = ''
  ngOnInit(): void {
    this.idOportunidad = Number(this.route.snapshot.paramMap.get('idOportunidad'));
    this.obtenerDatos();
  }
  obtenerDatos(){
    this.integraService
      .getJsonResponse(
        `${constApiComercial.OportunidadObtenerDatosOportunidad}/${this.idOportunidad}`
      ).subscribe(
      {
        next: (resp: HttpResponse<any>) => {
          if(resp != null){
            this.idAlumno = resp.body.idAlumno
            this.nombreCentroCosto = resp.body.nombreCentroCosto
            this.cargarGrids();
            this.obtenerInformacionOportunidad();
            this.obtenerReferidos();
            this.obtenerInteraccionesAlumno();
            this.obtenerOportunidadesAnteriores();
            this.iniciarSentinel();
            this.cargarHistorialInteraccionesOportunidad();
            this.obtenerArgumentosMotivacionPrograma();
            this.obtenerPrerequisitosBeneficiosCompetidoresPorIdOportunidad();
            this.obtenerProblemaDetalle();
            this.obtenerTiempoCapacitacion();
            this.configurarCertificacionGeneral();


            this.cabeceraSpeech = resp.body;
          }
        },
        error: (error) => {
          console.log(error);
        }
      }
    );

  }

  cargarCabeceraSpeech() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerCabeceraSpeech}/${this.idOportunidad}/${this.informacionOportunidad.oportunidadComplementos.idCentroCosto}`
      ).subscribe(
      {
        next: (resp: HttpResponse<any>) => {
          if(resp != null){
            this.cabeceraSpeech = resp.body;
          }
        },
      }
    );
  }

  cargarGrids() {
    this.gridBeneficios.isDetailExpanded = function (args: RowArgs) {
      return args.dataItem.checked;
    };
    this.gridBeneficios.kendoGridDetailTemplateShowIf = function (
      dataItem: any
    ) {
      return dataItem.checked;
    };
  }
  obtenerInformacionOportunidad() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteSeguimientoOportunidadesObtenerInformacionOportunidad}/${this.idOportunidad}/${this.idAlumno}`
      )
      .subscribe({
        next: (resp: HttpResponse<IInformacionOportunidadFicha>) => {
          console.log(resp.body);
          this.informacionOportunidad = resp.body;
          this.competidor = this.informacionOportunidad.programaGeneralPreBen.listaCompetidores
          this.alumno = resp.body.datosAlumno;
          this.categoriaDescripcion = resp.body.oportunidadComplementos.categoriaOrigen;
          this.cargarDatosAlumno();
          this.cargarCabeceraSpeech();
          this.obtenerOportunidadInformacion();
          this.obtenerPublicoObjetivoPrograma();
        },
      });
  }

  cargarDatosAlumno() {
    let nombreCompleto = this.alumno.nombre1.trim();
    if (this.alumno.nombre2 != null && this.alumno.nombre2.trim() != '')
      nombreCompleto = nombreCompleto.concat(' ', this.alumno.nombre2);
    nombreCompleto = nombreCompleto.concat(' ', this.alumno.apellidoPaterno);
    if (
      this.alumno.apellidoMaterno != null &&
      this.alumno.apellidoMaterno.trim() != ''
    )
      nombreCompleto = nombreCompleto.concat(' ', this.alumno.apellidoMaterno);
    this.nombreCompletoAlumno = nombreCompleto.trim();
    // this.nombreCompletoAlumno = `${data.nombre1} ${data.nombre2} ${data.apellidoPaterno} ${data.apellidoMaterno}`
    if (this.alumno.nombreCiudad != null) {
      this.ciudadCabecera = ` - ${this.alumno.nombreCiudad}`;
    }
    this.faseActual = `Fase Actual: ${this.informacionOportunidad.oportunidadComplementos.codigoFase}`;
  }

  obtenerReferidos() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteSeguimientoOportunidadesObtenerReferidos}/${this.idAlumno}`
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
        },
      });
  }

  obtenerInteraccionesAlumno() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteSeguimientoOportunidadesObtenerInteraccionesAlumno}/${this.idAlumno}`
      )
      .subscribe({
        next: (resp: HttpResponse<IInteraccionAlumno>) => {
          console.log(resp.body);
        },
      });
  }

  obtenerOportunidadesAnteriores() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteSeguimientoOportunidadesObtenerOportunidadesAnteriores}/${this.idAlumno}`
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp);
        },
      });
  }

  obtenerTT(tiempoDuracionMinutos: any) {
    return tiempoDuracionMinutos.substr(
      0,
      tiempoDuracionMinutos.indexOf('&nbsp')
    );
  }

  obtenerDatosAlumno() {
    // this.integraService
    //   .getJsonResponse(
    //     `${constApiComercial.AgendaInformacionActividadObtenerDatosAlumno}/${this.idClasificacionPersona}/${this.idOportunidad}/${this.idPersonal_Asignado}`
    //   )
    //   .subscribe({
    //     next: (response: HttpResponse<IAgendaDatosAlumno>) => {
    //       this.alumno = response.body.alumno;
    //       this.datosAlumno = response.body;
    //       this.cargarHistorialCorreo();
    //       this.cargarHistorialCorreoEnviados();
    //     },
    //   });
  }

  correoEnviado: any;
  destinatarioEncode: any;
  iniciarSentinel() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerDatoSentinelAlumno}/${this.idAlumno}`
      )
      .subscribe({
        next: (response: HttpResponse<IDatosSentinelAlumno>) => {
        console.log('response.body',)

          if (response != null) {
            this.flagConsultaCR=true;
            this.cargarSemaforoFinanciero(response.body);
          }
          else
          {
            this.flagConsultaCR=false;
          }
        }
      });
  }

  calcularEdadClienteSentinel(fechaNacimiento: any) {
    if (fechaNacimiento != null) {
      fechaNacimiento = new Date(fechaNacimiento);
      const fechaActual = new Date();
      // let years: any = durationInYears(fechaNacimiento, fechaActual);
      let years = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
      let months = fechaActual.getMonth() - fechaNacimiento.getMonth();
      if (
        months < 0 ||
        (months == 0 && fechaActual.getDate() < fechaNacimiento.getDate())
      ) {
        this.edadClienteSentinel = `Edad: ${years--}`;
      }
      this.edadClienteSentinel = `Edad: ${years}`;
    } else {
      this.edadClienteSentinel = 'Edad:';
    }
  }

  cargarGridCreditos(lineaCredito: ILineaCredito[]) {
    if (lineaCredito != null && lineaCredito.length > 0) {
      this.gridCreditos.data = lineaCredito;
    } else {
      this.gridCreditos.data = [];
    }
  }
  cargarGridDeudas(lineaDeuda: ILineaDeuda[]) {
    if (lineaDeuda != null && lineaDeuda.length > 0) {
      this.gridDeudas.data = lineaDeuda.filter((x: any) => x.diasVencidos == 0);
    } else {
      this.gridDeudas.data = [];
    }
  }

  cargarGridDeudasVencidas(lineaDeuda: any) {
    if (lineaDeuda != null && lineaDeuda.length > 0) {
      this.gridDeudasVencidas.data = lineaDeuda.filter(
        (e: any) => e.diasVencidos > 0
      );
    } else {
      this.gridDeudasVencidas.data = [];
    }
  }

  cargarCabeceraSemaforo() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerSemaforoSentinelAlumno}/${this.idAlumno}`
      )
      .subscribe({
        next: (resp: HttpResponse<ISemaforoSentinelAlumno>) => {
          if (resp.body !== null) {
            this.cabeceraSemaforoFinanciero.color = resp.body.color;
            this.cabeceraSemaforoFinanciero.mensaje = resp.body.mensaje;
            if (
              this.cabeceraSemaforoFinanciero.color == null ||
              this.cabeceraSemaforoFinanciero.mensaje == null
            ) {
              this.cabeceraSemaforoFinanciero.color = '#ff0303';
              this.cabeceraSemaforoFinanciero.mensaje = 'Aun no se consulto';
            }
          }
        },
      });
  }

  cargarSemaforoFinanciero(resp: IDatosSentinelAlumno) {
    if (resp != null) {
      this.sentinelAlumno = resp;
      this.calcularEdadClienteSentinel(this.sentinelAlumno.fechaNacimiento);

      this.cargarGridCreditos(resp.lineaCredito);
      this.cargarGridDeudas(resp.lineaDeuda);
      this.cargarGridDeudasVencidas(resp.lineaDeudaVencida);
      this.cargarCabeceraSemaforo();

      this.gridCreditos.data = resp.lineaCredito;
      this.gridDeudas.data = resp.lineaDeuda.filter(
        (e: any) => e.diasVencidos == 0
      );
      this.gridDeudasVencidas.data = resp.lineaDeudaVencida.filter(
        (e: any) => e.diasVencidos > 0
      );
      this.cargarGridDeudas(resp.lineaDeuda);
    } else {
      // this.validarPaisAlumno(this.idAlumno);
    }
  }

  showSentinelHelp: boolean = false;

  configurarSentinel(resp: IDatosSentinelAlumno) {
    // this.sentinelAlumno = resp;
    // const fechaProximaConsulta = new Date(resp.fechaUltimaActualizacion);
    // fechaProximaConsulta.setMonth(fechaProximaConsulta.getMonth() + 6);
    // this.agendaService.agendaSentinelService.showSentinelHelp$.next(true);
    // this.agendaService.agendaSentinelService.btnVerDetalleSentinel$.next({
    //   show: true,
    // });
    // this.agendaService.agendaSentinelService.sentinelHelp$.next(
    //   this.getSentinelHelp(this.sentinelAlumno, 'DNI')
    // );
  }

  cargarHistorialCorreo() {
    // let filtro = {
    //   idAsesor: this.idPersonal_Asignado,
    //   filtroKendo: {
    //     filters: [
    //       {
    //         field: 'Remitente',
    //         operator: 'contains',
    //         value: this.alumno.email1,
    //       },
    //     ],
    //     logic: 'and',
    //   },
    //   folder: 'inbox',
    //   idAlumno: this.alumno.id,
    // };
    // this.integraService
    //   .obtenerPorFiltro(constApiComercial.CorreoObtenerCorreoRecibido, filtro)
    //   .subscribe({
    //     next: (response: HttpResponse<any>) => {
    //       if (response.body) {
    //         this.correoRecibidos = response.body;
    //       }
    //     },
    //   });
  }

  cargarHistorialCorreoEnviados() {}

  reproducirAudio(context: any, element: any) {
    console.log(element);
    if (element.nombreGrabacion) {
      switch (element.webphone) {
        case 'Mizutech':
          console.log('Mizutech');
          break;
        case 'Silcom':
          this.reproducirLlamadaNuevoWebPhone(element.nombreGrabacion);
          break;
        case 'Silcom Migrado':
          this.reproducirLlamadaNuevoWebPhoneMigrado(element.nombreGrabacion);
          break;
      }
      this.modalService.open(context, { size: 'md', backdrop: 'static' });
    } else {
      alert('No contiene grabacion');
    }
  }

  reproducirLlamadaNuevoWebPhone(nombreGrabacion: string) {
    console.log('Silcom');
    this.urlGrabacion = `https://integrav4-ast-llamadas.bsginstitute.com/play.php?nombreArchivo=${nombreGrabacion}`;
    // let params: any = { nombreArchivo: nombreGrabacion }
    // this.integraService.
    //   postTextResponse(`https://integrav4-ast-llamadas.bsginstitute.com/exist.php`, params).
    //   subscribe({
    //     next: () => {
    //     },
    //     error: () => {
    //       alert("No se encontro grabacion")
    //     }
    //   })
  }

  reproducirLlamadaNuevoWebPhoneMigrado(nombreGrabacion: string) {
    console.log('Silcom Migrado');
    this.urlGrabacion = nombreGrabacion;
  }

  obtenerTC(tiempoDuracionMinutos: any) {
    return tiempoDuracionMinutos.substr(
      tiempoDuracionMinutos.indexOf('&nbsp') + 15
    );
  }

  obtenerOportunidadInformacion() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerOportunidadInformacion}/${this.idAlumno}/${this.alumno.idClasificacionPersona}`
      )
      .subscribe({
        next: (resp: HttpResponse<IOportunidadInformacion>) => {
          if (resp.body) {
            // this.oportunidadInformacion$.next(resp.body);
            this.gridVentaCruzada.data = resp.body.listaVentaCruzada;
            this.gridHistorialOportunidades.data = resp.body.listaHistorial;
          }
        },
      });
  }

  cargarHistorialInteraccionesOportunidad() {
    this.gridHistorialInteraccionesEfectivo.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaActividadObtenerHistorialInteraccionesPorIdOportunidad}/${this.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body) {
            this.gridHistorialInteraccionesEfectivo.data = response.body;
            this.gridHistorialInteraccionesEfectivo.loading = false;
          }
        },
      });
  }

  obtenerArgumentosMotivacionPrograma() {
    this.gridFactoresMotivacion.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerArgumentosMotivacionProgramaPorIdOportunidad}/${this.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IArgumentoMotivacionPrograma[]>) => {
          response.body.forEach((element) => {
            element.checked = element.respuesta == 1 ? true : false;
          });
          this.gridFactoresMotivacion.data = response.body;
          this.gridFactoresMotivacion.loading = false;
        },
      });
  }

  obtenerPublicoObjetivoPrograma() {
    this.gridPublicoObjetivo.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerPublicoObjetivoPrograma}/${this.informacionOportunidad.oportunidadComplementos.idCentroCosto}/${this.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IPublicoObjetivoPrograma[]>) => {
          console.log(response.body);

          let publicoObjetivo = response.body as any;
          publicoObjetivo.forEach((element: any) => {
            let item = this.dataNivelCumplimiento.find(
              (e) => e.id == element.respuesta
            );
            if (item) {
              element.nombreRespuesta = item.nombre;
            } else {
              element.nombreRespuesta = 'Falta Verificar';
            }
          });
          this.gridPublicoObjetivo.data = publicoObjetivo;

          this.gridPublicoObjetivo.loading = false;
        },
        error: (error) => {
          this.gridPublicoObjetivo.loading = false;
        },
      });
  }

  limpiarContenido(cadena: any) {
    let flag = true;
    while (flag) {
      let indice = cadena.indexOf('font-family');
      if (indice != -1) {
        let sub1 = cadena.substr(0, indice);
        cadena = cadena.substr(indice);
        indice = cadena.indexOf(';');
        let sub2 = cadena.substr(indice);
        cadena = sub1 + sub2;
      } else {
        flag = false;
      }
    }
    flag = true;
    while (flag) {
      let indice = cadena.indexOf('font-size');
      if (indice != -1) {
        let sub1 = cadena.substr(0, indice);
        cadena = cadena.substr(indice);
        indice = cadena.indexOf(';');
        let sub2 = cadena.substr(indice);
        cadena = sub1 + sub2;
      } else {
        flag = false;
      }
    }
    flag = true;
    while (flag) {
      let indice = cadena.indexOf('background-color');
      if (indice != -1) {
        let sub1 = cadena.substr(0, indice);
        cadena = cadena.substr(indice);
        indice = cadena.indexOf(';');
        let sub2 = cadena.substr(indice);
        cadena = sub1 + sub2;
      } else {
        flag = false;
      }
    }
    flag = true;
    while (flag) {
      let indice = cadena.indexOf('color');
      if (indice != -1) {
        let sub1 = cadena.substr(0, indice);
        cadena = cadena.substr(indice);
        indice = cadena.indexOf(';');
        let sub2 = cadena.substr(indice);
        cadena = sub1 + sub2;
      } else {
        flag = false;
      }
    }
    return cadena;
  }
  paso56Correcto: boolean = false;
  obtenerPrerequisitosBeneficiosCompetidoresPorIdOportunidad() {
    this.paso56Correcto = false;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerPrerequisitosBeneficiosCompetidoresPorIdOportunidad}/${this.idOportunidad}`
      )
      .subscribe({
        next: (resp: HttpResponse<IPrerequisitoBeneficioCompetidor>) => {
          this.paso56Correcto = true;

          let prereq = resp.body.prerequisitosGenerales as any;
          prereq.forEach((e: any) => {
            let item = this.dataNivelCumplimiento.find(
              (x) => x.id == e.respuesta
            );
            if (item) {
              e.nombreRespuesta = item.nombre;
            } else {
              e.nombreRespuesta = 'Falta Verificar';
            }
          });

          this.gridPrerequisitos.data = prereq;

          if (resp.body.oportunidadCompetidor != null) {
            this.beneficioOportunidad =
              resp.body.oportunidadCompetidor.otroBeneficio;

            if (resp.body.oportunidadCompetidor.respuesta === 1) {
              this.checkCompetidorSI = true;
              this.checkCompetidorNO = false;
            } else if (resp.body.oportunidadCompetidor.respuesta === 2) {
              this.checkCompetidorSI = false;
              this.checkCompetidorNO = true;
            }
          }

          resp.body.beneficios.forEach((e) => {
            e.checked = e.respuesta == 0 ? false : true;
          });
          this.gridBeneficios.data = resp.body.beneficios;
        },
        error: (error) => {
          this.regularizarPaso56();
        },
      });
  }

  regularizarPaso56() {
    if (this.paso56Correcto == false) {
      this.integraService
        .getJsonResponse(
          `${constApiComercial.AgendaInformacionActividadObtenerPrerequisitosBeneficiosCompetidoresPorIdOportunidad}/${this.idOportunidad}`
        )
        .subscribe({
          next: (resp: HttpResponse<IPrerequisitoBeneficioCompetidor>) => {
            this.paso56Correcto = true;
            let prereq = resp.body.prerequisitosGenerales as any;
            prereq.forEach((e: any) => {
              let item = this.dataNivelCumplimiento.find(
                (x) => x.id == e.respuesta
              );
              if (item) {
                e.nombreRespuesta = item.nombre;
              } else {
                e.nombreRespuesta = 'Falta Verificar';
              }
            });
            this.gridPrerequisitos.data = prereq;

            if (resp.body.oportunidadCompetidor != null) {
              this.beneficioOportunidad =
                resp.body.oportunidadCompetidor.otroBeneficio;
            }

            resp.body.beneficios.forEach((e) => {
              e.checked = e.respuesta == 0 ? false : true;
            });
            this.gridBeneficios.data = resp.body.beneficios;
          },
          error: (error) => {
            this.regularizarPaso56();
          },
        });
    }
  }
  variableRecargarProblema = true;
  gridProblemaCliente = new KendoGrid();
  obtenerProblemaDetalle() {
    this.variableRecargarProblema = true;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerProgramaGeneralProblemaDetallePorIdOportunidad}/${this.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<IProblemaDetalle[]>) => {
          this.variableRecargarProblema = false;

          response.body.forEach((e) => {
            e.class = this.colorearLabel(e);
            e.argumentos.forEach((element) => {
              element.flagSeleccionado = element.seleccionado == true;
              element.flagSolucionado = element.solucionado == true;
            });
          });
          this.gridProblemaCliente.data = response.body;
        },
        error: () => {
          if (this.variableRecargarProblema) {
            this.obtenerProblemaDetalle();
          }
        },
      });
  }

  colorearLabel(dataItem: IProblemaDetalle) {
    let data = dataItem.argumentos.find(
      (e) => !e.solucionado && e.seleccionado
    );
    if (data) {
      return 'danger';
    } else {
      data = dataItem.argumentos.find((e) => e.solucionado && e.seleccionado);
      if (data) {
        return 'success';
      } else {
        return 'default';
      }
    }
  }

  obtenerTiempoCapacitacion() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerTiempoCapacitacionPorIdOportunidad}/${this.idOportunidad}`
      )
      .subscribe({
        next: (resp: HttpResponse<ITiempoCapacitacion>) => {
          this.dataTiemposCapacitacion = resp.body.records.map((e) => {
            let rpta = {
              id: e.id,
              nombre: e.nombre,
              check: resp.body.recordValidado == e.id ? true : false,
            };
            return rpta;
          });
        },
      });
  }

  configurarCertificacionGeneral() {
    this.gridCertificacionGeneral.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerRequisitosCertificacionProgramaPorIdOportunidad}/${this.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          response.body.forEach((element) => {
            let item = this.optionCertificacion.find(
              (e) => e.id == element.respuesta
            );
            if (item) {
              element.nombreRespuesta = item.nombre;
            } else {
              element.nombreRespuesta = 'Falta Verificar';
            }
          });
          this.gridCertificacionGeneral.data = response.body;
          this.gridCertificacionGeneral.loading = false;
        },
        error: (error) => {
          this.gridCertificacionGeneral.loading = false;
        },
      });
  }

  onSelectedChat(data: any) {

  }
  mensajesPortal: any;
  obtenerMensajesRecibidosChatPortal(idAsesor: number, idAlumno: number) {
    this.integraService
      .getJsonResponse(
        `${constApiGlobal.PortalMesajesRecibidosChat}/${idAsesor}/${idAlumno}`
      )
      .subscribe({
        next: (response: any) => {
          if (
            response.body.idInteraccionChat != undefined &&
            response.body.idInteraccionChat != 0
          ) {
            this.obtenerHistorialMensajesRecibidosChatPortalTemp(
              response.body.idInteraccionChat
            );
          } else {
            this.mensajesPortal = null;
          }
        },
      });
  }

  private obtenerHistorialMensajesRecibidosChatPortalTemp(
    idInteraccion: number
  ) {
    this.integraService
      .getJsonResponse(
        `${constApiGlobal.PortalHistorialMensajesRecibidosChat}/${idInteraccion}`
      )
      .subscribe({
        next: (response: any) => {
          if (response.body.length != 0) {
            this.mensajesPortal = response.body;
          } else {
            this.mensajesPortal = null;
          }
        },
      });
  }
  historialMensajeRecibidosChat: any;
  cargarChatWhatsAppOportunidad() {
    // this.agendaService.agendaAlumnoService.numeroWhatsApp$.subscribe({
    //   next: (resp) => {
    //     if (resp != null) {
    //       this.agendaService.agendaHistorialChatsService
    //         .obtenerHistorialMensajeChat$(resp)
    //         .subscribe({
    //           next: (resp: any) => {
    //             if (resp.body != null && resp.body.length > 0) {
    //               this.historialMensajeRecibidosChat = resp.body;
    //             }
    //           },
    //         });
    //     }
    //   },
    // });
  }

  verInteraccionesCorreo(dataItem: any, content: any) {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.CorreoObtenerInteraccionesCorreosEnviados}/${dataItem.idAlumno}/${dataItem.idPersonal}/${dataItem.messageId}`
      )
      .subscribe({
        next: (resp: any) => {
          this.gridHistorialCorreo.data = resp.body;
          this.modalService.open(content, { size: 'md' });
        },
      });
  }

  verHistorialInbox(dataItem: any) {
    if (dataItem.tipo == null) {
      // this.agendaService.agendaHistorialChatsService
      //   .obtenerInformacionGmail$(dataItem.id)
      //   .subscribe({
      //     next: (resp: any) => {
      //       console.log(resp);
      //     },
      //   });
    } else {
      // this.agendaService.agendaHistorialChatsService
      //   .obtenerCorreosEnviadosSpeech$(dataItem)
      //   .subscribe({
      //     next: (resp: any) => {
      //       console.log(resp);
      //       if (resp.body.asunto != null) {
      //         this.destinatarioEncode = '';
      //         this.correoEnviado = resp.body;
      //         for (
      //           let index = 0;
      //           index < this.correoEnviado.destinatarios.length;
      //           index++
      //         ) {
      //           this.destinatarioEncode += '*';
      //         }
      //         this.modalService.open(this.modalPreviaVistaCorreos, {
      //           size: 'xl',
      //           backdrop: 'static',
      //         });
      //       } else {
      //         this.modalService.open(this.modalVerCorreoAlternoSpeech, {
      //           size: 'md',
      //           backdrop: 'static',
      //         });
      //       }
      //     },
      //   });
    }
  }
}

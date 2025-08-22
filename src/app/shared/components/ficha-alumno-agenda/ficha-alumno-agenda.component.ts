import { RowArgs } from '@progress/kendo-angular-grid';
import {
  IDatosSentinelAlumno,
  ILineaCredito,
  ILineaDeuda,
  ISemaforoSentinelAlumno,
} from '@comercial/models/interfaces/isemaforo-financiero';
import { HttpResponse } from '@angular/common/http';
import { constApiComercial } from './../../../../environments/constApi';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import {
  IDatosAlumno,
  IInformacionOportunidadFicha,
  IInteraccionAlumno,
} from '@shared/models/interfaces/ificha-alumno';
import {
  HistorialInteraccionOportunidad,
  IArgumentoMotivacionPrograma,
  IOportunidadInformacion,
  IPublicoObjetivoPrograma,
  IRequisitosCertificacionPrograma,
  LlamadasIntegra3cx,
} from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import {
  IPrerequisitoBeneficioCompetidor,
  IProblemaDetalle,
  ITiempoCapacitacion,
} from '@comercial/models/interfaces/iagenda-modal';
import { constApiGlobal } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { CorreoRecibido } from '@comercial/models/interfaces/iagenda-historial-chat';
import {
  ColorPerfilPrograma
} from '@comercial/models/interfaces/iagenda-alumno';
import { IPlantillasPorIdFaseOportunidad, ISpeechBienvenidaDespedida } from '@comercial/models/interfaces/iagenda-activad';
import { cloneData } from '@shared/functions/clone-data';
import { IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';


@Component({
  selector: 'app-ficha-alumno-agenda',
  templateUrl: './ficha-alumno-agenda.component.html',
  styleUrls: ['./ficha-alumno-agenda.component.scss'],
})
export class FichaAlumnoAgendaComponent implements OnInit {
  private _dict: Map<any, any>;
  constructor(
    public activeModal: NgbActiveModal,
    private integraService: IntegraService,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}
  
  @ViewChild('chwcBlockMessage') chwcBlockMessage: ElementRef;

  @Input() idAlumno: number = 0;
  @Input() idOportunidad: number = 0;
  @Input() nombreCentroCosto: string = '';
  @ViewChild('modalVerCorreoAlternoSpeech') modalVerCorreoAlternoSpeech: any;
  @ViewChild('modalPreviaVistaCorreos') modalPreviaVistaCorreos: any;

  flagConsultaCR: boolean = false;
  nombreCompletoAlumno = 'Cargando...';
  datosAlumno: any;
  DatosOportunidad: any = {};
  celularWhatsApp: string = '';
  cabeceraSpeech: any = {};
  speechBienvenida: string = 'Cargando...';
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
    celularOriginal: '',
    emailOriginal: '',
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
    idTiempoExperiencia: 0,
    idTamanioEmpresa: 0,
    tiempoExperiencia: '',
    tamanioEmpresa: '',
    principalResponsabilidadProfesional: '',
    idCodigoPais: 0,
    nombrePais: '',
    idCiudad: 0,
    nombreCiudad: '',
    idEstadoContactoWhatsApp: 0,
    rutaBandera: '',
    codigoMatricula: '',
  };
  faseActual = '';
  centroCosto = '';
  ciudadCabecera = '';
  loaderChatAndGridWhatsapp: boolean = false;
  bloquearSeleccion: boolean = false;
  gridHistorialWhatsapp: KendoGrid = new KendoGrid();
  gridDocumentosPrograma: KendoGrid = new KendoGrid();
  tipoInput = 'text';
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
  emailOriginalTmp: any;
  gridHistorialOportunidades = new KendoGrid();
  gridHistorialInteraccionesEfectivo = new KendoGrid();
  gridResumenComentario = new KendoGrid();
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
    idFaseOportunidad: 0,
    idActividadDetalle: 0,
    nombresPersonal:"",
    apellidosPersonal:""
  };
  colorAreaFormacion = '';
  colorAreaTrabajo = '';
  colorCargo = '';
  colorIndustria = '';

  dataListaPlantilla: any = null;

  listaTemplateV2ReemplazoEtiqueta: Array<{
    clave: string;
    valor: string;
  }> = [];

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
  origenLlamada: string = '';
  categoriaDescripcion = '';
  idPersonal: number;
  ngOnInit(): void {
    this.cargarGrids();
    this.obtenerInformacionOportunidad();
    this.obtenerReferidos();
    this.obtenerInteraccionesAlumno();
    this.obtenerOportunidadesAnteriores();
    this.iniciarSentinel();
    this.cargarHistorialInteraccionesOportunidad();
    //this.cargarResumenComentario();
    this.obtenerArgumentosMotivacionPrograma();
    this.obtenerPrerequisitosBeneficiosCompetidoresPorIdOportunidad();
    this.obtenerProblemaDetalle();
    this.obtenerTiempoCapacitacion();
    this.configurarCertificacionGeneral();
    this.obtenerColorPerfilProgramaPorIdOportunidad();
  }

  cargarCabeceraSpeech() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerCabeceraSpeech}/${this.idOportunidad}/${this.informacionOportunidad.oportunidadComplementos.idCentroCosto}`
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          if (resp != null) {
            this.cabeceraSpeech = resp.body;
          }
        },
      });
  }

  ///////////////////////////////////
  cargarPlantillasInicio() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerPlantillasPorIdFaseOportunidad}/${this.informacionOportunidad.idFaseOportunidad}`
      )
      .subscribe({
        next: (resp: HttpResponse<Array<IPlantillasPorIdFaseOportunidad>>) => {
          if (resp != null) {
            //this.cabeceraSpeech = resp.body;
            this.cargarSpeech(resp.body);
          }
        },
      });
  }
  cargarSpeech(plantillaPorFase: IPlantillasPorIdFaseOportunidad[]){
    this.integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerIdSpeechBienvenidaDespedida}/${this.informacionOportunidad.idActividadDetalle}`
      )
      .subscribe({
        next: (response: HttpResponse<ISpeechBienvenidaDespedida>) => {
          // this.speechBienvenidaDespedida$.next({
          //   plantillaPorFase: plantillaPorFase,
          //   speech: response.body,
          // });
          this.speechBienvenidaDespedida({
            plantillaPorFase: plantillaPorFase,
            speech: response.body,
          })
        },
        error: (error) => {
          let mensaje = this.alertaService.getErrorResponse(error).mensaje;
          this.alertaService.notificationWarning(mensaje);
        },
      });

  }
  speechBienvenidaDespedida(response: {plantillaPorFase: IPlantillasPorIdFaseOportunidad[];speech: ISpeechBienvenidaDespedida;}){
    if (response != null) {
      let speechBienvenida = response.plantillaPorFase.filter(
        (item) =>
          response.speech.data.idPlantillaBienvenida ==
          item.idPlantilla
      );
      this.valoresEtiquetasComercial();
      let speech =
        this.cargarValoresEtiqueta(
          cloneData(speechBienvenida)
        );
      if (speech?.length > 0) {
        this.speechBienvenida = speech[0].valor;
      }
      speech = [];
    }
  }
  valoresEtiquetasComercial(){
    this._dict = new Map();
    if (this.alumno != null) {
      this._dict.set('tAlumnos.nombre1', this.alumno.nombre1);
      this._dict.set('<strong>tAlumnos.nombre1</strong>', this.alumno.nombre1);
      this._dict.set('tAlumnos.nombre2', this.alumno.nombre2);
      this._dict.set('tAlumnos.apepaterno', this.alumno.apellidoPaterno);
      this._dict.set('tAlumnos.apematerno', this.alumno.apellidoMaterno);
      this._dict.set('tAlumnos.email1', this.alumno.email1);
      //this._dict.set('TCRM_CausaCliente.nombre', this.obtenerCausaProblema());
      this._dict.set('tPersonal.nombres', this.informacionOportunidad.nombresPersonal);
      this._dict.set('tPersonal.apellidos', this.informacionOportunidad.apellidosPersonal);
      // this._dict.set(
      //   'TPW_MontoPago.Versiones',
      //   this.etiquetaMontosPagoPaquetesEtiqueta
      // );
      //this._dict.set('NoTabla.reloj', this.reloj());

      // this._dict.set(
      //   'tPEspecifico.DuracionAndHorarios',
      //   this.etiquetaDuracionHorarios
      // );
      // this._dict.set('tPLA_PGeneral.Expositores', this.etiquetaExpositores);
      // this._dict.set(
      //   'TCRM_CategoriaOrigen.ca_descripcion',
      //   this._rowActual.categoriaDescripcion
      // );
      // this._dict.set(
      //   'tPLA_PGeneral.CursosRelacionados',
      //   this.cursosRelacionadosUrls()
      // );

      // if (this.datosOportunidadEtiquetaPrueba.encabezadoCorreoPartner != null) {
      //   this._dict.set(
      //     'TPW_Partner.EncabezadoCorreoPartner',
      //     this.datosOportunidadEtiquetaPrueba.encabezadoCorreoPartner
      //   );
      // } else {
      //   this._dict.set('TPW_Partner.EncabezadoCorreoPartner', '');
      // }

      // this._dict.set(
      //   'tpla_pgeneral.pw_duracion',
      //   this.datosOportunidadEtiquetaPrueba.pwDuracion
      // );

      // if (this.datosOportunidadEtiquetaPrueba.costoTotalConDescuento != null)
      //   this._dict.set(
      //     'tPLA_Pgeneral.CostoTotalConDescuento',
      //     this.datosOportunidadEtiquetaPrueba.costoTotalConDescuento
      //   );
      // else this._dict.set('tPLA_Pgeneral.CostoTotalConDescuento', '');

      // this._dict.set(
      //   'tPLA_PGeneral.CronogramaPagos',
      //   this.cronogramaPagoEtiqueta
      // );
      // if (this.datosOportunidadEtiquetaPrueba.fechaEnvio != null)
      //   this._dict.set(
      //     'TPW_DocumentoEnviadoWeb.FechaEnvio',
      //     datePipeTransform(
      //       new Date(this.datosOportunidadEtiquetaPrueba.fechaEnvio)
      //     )
      //   );
      // else
      //   this._dict.set(
      //     'TPW_DocumentoEnviadoWeb.FechaEnvio',
      //     "<span style='color: #ff0000;'>Fecha de envio no registrada</span></strong></span>"
      //   );

      // this._dict.set(
      //   'tMatriculaCabecera.Id',
      //   this.datosOportunidadEtiquetaPrueba.idMatricula
      // );
      // this._dict.set(
      //   'TPW_Partner.NombrePatner',
      //   this.datosOportunidadEtiquetaPrueba.nombrePartner
      // );
      this._dict.set(
        'tPLA_PGeneral.Nombre',
        this.cabeceraSpeech.programaGeneral
      );
      // this._dict.set('tPLA_PGeneral.urlPartner', this.urlPartner());
      // this._dict.set('tPLA_PGeneral.Descuento', this.promocionDescuento());

      // if (this.datosOportunidadEtiquetaPrueba != null) {
      //   this._dict.set('tPLA_PGeneral.urlVersion', this.urlVersion());

      //   this._dict.set(
      //     'tPLA_PGeneral.UrlBrochurePrograma',
      //     this.urlBrochurePrograma()
      //   );
      //   this._dict.set('tPersonal.UrlFirmaCorreos', this.firmaPersonal());
      //   this._dict.set(
      //     'tPEspecifico.FechaInicioPrograma',
      //     this.fechaInicioProgramaEtiqueta
      //   );
      //   this._dict.set('tPersonal.Telefono', this.telefonoPersonal());

      //   this._dict.set('tPEspecifico.nombre', this._pEspecifico.nombre);
      //   this._dict.set(
      //     'tPEspecifico.ciud<span style="font-size: 10pt;">ad',
      //     this._pEspecifico.ciudad
      //   );
      //   this._dict.set('tPEspecifico.ciudad', this._pEspecifico.ciudad);
      //   this._dict.set(
      //     'tPEspecifico.UrlDocumentoCronograma',
      //     this.urlDocumentoCronograma()
      //   );
      // }
      // if (this.datosOportunidadAlumnoEtiqueta) {
      //   this._dict.set(
      //     'T_MatriculaCabecera.MontoTotal',
      //     this.datosOportunidadAlumnoEtiqueta.montoTotal
      //   );
      //   this._dict.set(
      //     'T_MatriculaCabecera.CronogramaPagoCompletoTabla',
      //     this.datosOportunidadAlumnoEtiqueta.cronogramaPagoCompleto
      //   );
      //   this._dict.set(
      //     'ValorDinamico.DiaFechaActual',
      //     this.datosOportunidadAlumnoEtiqueta.diaFechaActual
      //   );
      //   this._dict.set(
      //     'ValorDinamico.NombreMesFechaActual',
      //     this.datosOportunidadAlumnoEtiqueta.nombreMesFechaActual
      //   );
      //   this._dict.set(
      //     'ValorDinamico.AnioFechaActual',
      //     this.datosOportunidadAlumnoEtiqueta.anioFechaActual
      //   );
      //   this._dict.set(
      //     'T_MatriculaCabecera.Anexo1EstructuraCurricular',
      //     this.datosOportunidadAlumnoEtiqueta.anexo1EstructuraCurricular
      //   );
      //   this._dict.set(
      //     'T_MatriculaCabecera.Anexo2Certificacion',
      //     this.datosOportunidadAlumnoEtiqueta.anexo2Certificacion
      //   );
      //   this._dict.set(
      //     'T_MatriculaCabecera.Version',
      //     this.datosOportunidadAlumnoEtiqueta.version
      //   );
      //   if (this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno) {
      //     this._dict.set(
      //       'T_Alumno.NombreCompleto',
      //       this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nombreCompleto
      //     );
      //     this._dict.set(
      //       'T_Alumno.NroDocumento',
      //       this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nroDocumento
      //     );
      //     this._dict.set(
      //       'tAlumnos.direccion',
      //       this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.direccion
      //     );
      //     this._dict.set(
      //       'tAlumnos.NombreCiudad',
      //       this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nombreCiudad
      //     );
      //     this._dict.set(
      //       'tAlumnos.NombrePais',
      //       this.datosOportunidadAlumnoEtiqueta.oportunidadAlumno.nombrePais
      //     );
      //   }
      // }
    }
  }
  cargarValoresEtiqueta(plantilla: IPlantillasPorIdFaseOportunidad[]){
    let resultado = plantilla;
    if (plantilla != null) {
      if (plantilla.length > 0) {
        let data = plantilla[0].valor;

        let etiquetas = [];
        let etiquetas1 = [];
        let etqValores = [];
        etiquetas = data.split('{').filter((o) => o.includes('}'));
        let cantidad = etiquetas.length;
        for (let i = 0; i < cantidad; i++) {
          etiquetas1 = etiquetas[i].split('}');
          etiquetas[i] = etiquetas1[0];
        }
        for (let x = 0; x <= cantidad - 1; x++) {
          if (etiquetas[x].includes('TemplateV2.Duracion y Horarios')) {
            etqValores[x] = '';
            data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
          }
          if (etiquetas[x].includes('TemplateV2')) {
            etqValores[x] = this.ReemplazartemplatesV2(etiquetas[x]);
            data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
          } else if (
            etiquetas[x].includes('Template') &&
            !etiquetas[x].includes('V2')
          ) {
            etqValores[x] = this.remplazartemplates$(etiquetas[x]);
            data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
          } else {
            if (etiquetas[x].includes('NoTabla.Lista')) {
              etqValores[x] = this.dataListaPlantilla;
              data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
            } else {
              etqValores[x] = this._dict.get(etiquetas[x]);
              data = data.replace('{' + etiquetas[x] + '}', etqValores[x]);
            }
          }
          data = data.replace('undefined', '');
        }
        resultado[0].valor = data;
        return resultado;
      }
    }
    return resultado;
  }

  /**
 * Remplaza templates version 2
 * @param Template {string}
 */
  ReemplazartemplatesV2(Template: any) {
    let array = Template.split('.');
    let nombreColumna = array[array.length - 1];
    let resultado = this.listaTemplateV2ReemplazoEtiqueta.find(
      (o) => o.clave === nombreColumna
    );
    if (resultado === undefined) return '';
    return resultado.valor;
  }

  /**
   * Remplaza templates
   * @param Template {string}
   * @return {string}
   */
  remplazartemplates$(template: any) {
    if (template.includes('Perfil del Programa.Duraci&oacute;n y Horarios'))
      return '';
    if (template.includes('Silabo.Duraci&oacute;n y Horarios')) return '';
    let IdPlantilla = '';
    let IdColumna = '';
    let array = template.split('.');
    IdPlantilla = array[3];
    IdColumna = array[4];
    let Etiquetatemp = IdPlantilla + '.' + IdColumna;
    // let templatecontenido = temporal.filter((item: any) => {
    //   let plantilla;
    //   if (
    //     item.IdPlantillaPW === IdPlantilla.toLowerCase() &&
    //     item.IdSeccionPW === IdColumna.toLowerCase() &&
    //     item.IdCentroCosto === this._rowActual.idCentroCosto
    //   ) {
    //     plantilla = item;
    //     return plantilla;
    //   }
    // });
    // if (templatecontenido.length !== 0) {
    //   return templatecontenido[0].Valor.replace('#$%', '<br>');
    // } else {
    // }
    return '';
  }

  // private cargarPlantillasInicio(idFaseOportunidad: number) {
  //   let sub$ = this._integraService
  //     .getJsonResponse(
  //       `${constApiComercial.AgendaInformacionActividadObtenerPlantillasPorIdFaseOportunidad}/${idFaseOportunidad}`
  //     )
  //     .subscribe({
  //       next: (
  //         response: HttpResponse<Array<IPlantillasPorIdFaseOportunidad>>
  //       ) => {
  //         this.plantillasPorIdFaseOportunidad$.next(response.body);
  //         this._agendaService.agendaActividadesService.cargarSpeech(response.body);
  //       },
  //       error: (error) => {
  //         let mensaje = this._alertaService.getMessageErrorService(error);
  //         this._alertaService.notificationWarning(mensaje)
  //       }
  //     });
  //   this._subscriptionsFicha$.add(sub$)
  // }
  // ////////////////////////////////////

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
          this.competidor =
            this.informacionOportunidad.programaGeneralPreBen.listaCompetidores;
          this.alumno = resp.body.datosAlumno;
          this.categoriaDescripcion =
            resp.body.oportunidadComplementos.categoriaOrigen;
          this.idPersonal =
            resp.body.oportunidadComplementos.idPersonalAsignado;
          this.emailOriginalTmp = this.alumno.emailOriginal;
          this.cargarDatosAlumno();
          this.cargarCabeceraSpeech();
          this.cargarPlantillasInicio();
          this.obtenerOportunidadInformacion();
          this.obtenerPublicoObjetivoPrograma();

          this.obtenerHistorialMensajeChat();
          this.cargarHistorialCorreo();
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
          console.log('response.body');

          if (response != null) {
            this.flagConsultaCR = true;
            this.cargarSemaforoFinanciero(response.body);
          } else {
            this.flagConsultaCR = false;
          }
        },
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
    let filtro = {
      idAsesor: this.idPersonal,
      filtroKendo: {
        filters: [
          {
            field: 'remitente',
            operator: 'contains',
            value: this.emailOriginalTmp,
          },
        ],
        logic: 'and',
      },
      folder: 'inbox',
      idAlumno: this.alumno.id,
      pageSize: 1000,
      skip: 0,
      page: 1,
      take: 1000,
    };
    this.integraService
      .obtenerPorFiltro(constApiComercial.CorreoObtenerCorreoRecibido, filtro)
      .subscribe({
        next: (response: HttpResponse<CorreoRecibido>) => {
          if (response.body) {
            this.gridHistorialMensajes.data = response.body.listaCorreos;
          }
        },
      });
  }
  cargarHistorialCorreoEnviados() {}
  reproducirAudio(context: any, dataItem: LlamadasIntegra3cx) {
    this.origenLlamada = dataItem.origenLlamada;
    let flagReproducir: boolean = false;
    this.urlGrabacion = null;
    switch (dataItem.webphone) {
      case 'Mizutech':
        break;
      case 'Silcom':
        flagReproducir = true;
        this.urlGrabacion = dataItem.nombreGrabacion;
        break;
      case 'Silcom Migrado':
        flagReproducir = true;
        this.urlGrabacion = dataItem.nombreGrabacion;
        break;
      case 'TresCx Migrado':
        flagReproducir = true;
        this.urlGrabacion = dataItem.nombreGrabacion;
        break;
      case 'TresCx':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio 3cx aun no disponible',
        });
        break;
      case 'TresCx Sin Grabacion':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
      case 'Ringover Migrado':
        flagReproducir = true;
        this.urlGrabacion = dataItem.nombreGrabacion;
        break;
      case 'Ringover':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio Ringover aun no disponible',
        });
        break;
      case 'Ringover Sin Grabacion':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
      case 'Wavix':
          this.alertaService.swalFireOptions({
            icon: 'info',
            text: 'Audio Wavix aun no disponible',
          });
          break;
      case 'Wavix Migrado':
            flagReproducir = true;
            this.urlGrabacion = dataItem.nombreGrabacion;
            break;
      case 'Wavix Sin Grabacion':
          this.alertaService.swalFireOptions({
            icon: 'info',
            text: 'No contiene grabación',
          });
          break;
      case 'Wolkbox':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio aun no disponible',
        });
        break;
      case 'Wolkbox Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'Wolkbox Sin Grabacion':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
    }
    if (flagReproducir) {
      this.modalService.open(context, { size: 'md', backdrop: 'static' });
    }
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
        `${constApiComercial.AgendaActividadObtenerHistorialInteraccionesPorIdOportunidad3cx}/${this.idOportunidad}`
      )
      .subscribe({
        next: (response: HttpResponse<HistorialInteraccionOportunidad[]>) => {
          if (response.body) {
            this.gridHistorialInteraccionesEfectivo.data = response.body;
            this.gridHistorialInteraccionesEfectivo.loading = false;


            //resumen-comentario
            this.gridResumenComentario.loading = true;
            if(response.body != null){
              let data = response.body.map((x) => {
                let item = {
                  comentarioActividad: x.comentarioActividad ?? '',
                  fechaModificacion: x.fechaModificacion,
                  duracionMinutos: '<vacio>',
                  estadoOcurrencia: x.estado,
                  nombreOcurrencia: x.nombreOcurrencia,
                  faseInicio: x.faseInicio,
                  faseDestino: x.faseDestino,
                };
                if (
                  x.llamadasIntegra3cx != null &&
                  x.llamadasIntegra3cx.length > 0
                  ) {
                  let duracionTotal = 0;
                  x.llamadasIntegra3cx.forEach((l) => {
                    duracionTotal += l.duracionContesto;
                  });
                  // let duracionMinutos = (duracionTotal / 60).toFixed(1) + ' m';
                  let duracionMinutos = Math.round((duracionTotal / 60) * 10) / 10
                  item.duracionMinutos = duracionMinutos.toString() + ' m';
                }
                return item;
              });
              this.gridResumenComentario.data = data.filter(
                (x) => x.estadoOcurrencia != 'NO EJECUTADO'
              );
            }
            this.gridResumenComentario.loading = false;
          }
        },
      });
  }

  // cargarResumenComentario(){
  //   this.gridResumenComentario.loading = true;
  //   this.integraService
  //     .getJsonResponse(
  //       `${constApiComercial.AgendaActividadObtenerHistorialInteraccionesPorIdOportunidad3cx}/${this.idOportunidad}`
  //     )
  //     .subscribe({
  //       next: (response: HttpResponse<HistorialInteraccionOportunidad[]>) => {
  //         if (response.body) {
  //           this.gridResumenComentario.data = response.body;
  //           this.gridResumenComentario.loading = false;
  //         }
  //       },
  //     });
  // }

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

  obtenerColorPerfilProgramaPorIdOportunidad(){
    this.integraService.getJsonResponse(`${constApiComercial.AgendaActividadObtenerColorPerfilProgramaPorIdOportunidad}/${this.idOportunidad}`).subscribe({
      next: (response: HttpResponse<Array<ColorPerfilPrograma>>) => {
        //this.colorPerfilPrograma$.next(response.body)
        let porDefecto = response.body.find(x => x.tipoRegistro == 'PorDefecto')
        let item = response.body.find(x => x.tipoRegistro == 'AreaFormacion')
        if(item != null){
          this.colorAreaFormacion = item.colorHex;
        }else{
          this.colorAreaFormacion = porDefecto.colorHex;
        }

        item = response.body.find(x => x.tipoRegistro == 'AreaTrabajo')
        if(item != null){
          this.colorAreaTrabajo = item.colorHex;
        }else{
          this.colorAreaTrabajo = porDefecto.colorHex
        }

        item = response.body.find(x => x.tipoRegistro == 'Cargo')
        if(item != null){
          this.colorCargo = item.colorHex;
        }else{
          this.colorCargo = porDefecto.colorHex
        }

        item = response.body.find(x => x.tipoRegistro == 'Industria')
        if(item != null){
          this.colorIndustria = item.colorHex;
        }else{
          this.colorIndustria = porDefecto.colorHex
        }
      }
    })
  }

  onSelectedChat(data: any) {}
  mensajesPortal: any;
  obtenerMensajesRecibidosChatPortal(idAsesor: number, idAlumno: number) {
    this.integraService
      .getJsonResponse(
        `${constApiGlobal.ChatDetalleIntegraObtenerHistorialChatPortal}/${idAsesor}/${idAlumno}`
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
        `${constApiGlobal.ChatDetalleIntegraObtenerDetalleChatPorIdInteraccion}/${idInteraccion}`
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
    // this.integraService
    //   .getJsonResponse(
    //     `${constApiComercial.CorreoObtenerInteraccionesCorreosEnviados}/${dataItem.idAlumno}/${dataItem.idPersonal}/${dataItem.messageId}`
    //   )
    //   .subscribe({
    //     next: (resp: any) => {
    //       this.gridHistorialCorreo.data = resp.body;
    //       this.modalService.open(content, { size: 'md' });
    //     },
    //   });
  }

  verHistorialInbox(dataItem: any) {
    console.log(dataItem);
    if (dataItem.tipo == null) {
      this.integraService
        .getJsonResponse(
          `${constApiComercial.CorreoObtenerInformacionGmail}?idCorreo=${dataItem.idCorreo}&idAsesor=${dataItem.idAsesor}&folder=inbox`
        )
        .subscribe({
          next: (resp: any) => {
            console.log(resp);
          },
        });
    } else {
      this.integraService
        .getJsonResponse(
          `${constApiComercial.CorreoObtenerCorreosEnviadosSpeech}/${dataItem.destinatarios}/${dataItem.messageId}`
        )
        .subscribe({
          next: (resp: any) => {
            console.log(resp);
            if (resp.body.asunto != null) {
              this.destinatarioEncode = '';
              this.correoEnviado = resp.body;
              for (
                let index = 0;
                index < this.correoEnviado.destinatarios.length;
                index++
              ) {
                this.destinatarioEncode += '*';
              }
              this.modalService.open(this.modalPreviaVistaCorreos, {
                size: 'xl',
                backdrop: 'static',
              });
            } else {
              this.modalService.open(this.modalVerCorreoAlternoSpeech, {
                size: 'md',
                backdrop: 'static',
              });
            }
          },
        });
    }
  }

  obtenerHistorialMensajeChat() {
    let CelularOrigen = this.limpiarCelular(
      this.alumno.celularOriginal,
      this.alumno.idCodigoPais
    );

    this.integraService
      .getJsonResponse(
        `${constApiComercial.WhatsAppMensajeEnviadoWhatsAppHistorialMensajeChat}/${this.idPersonal}/${CelularOrigen}/VE`
      )
      .subscribe({
        next: (resp: HttpResponse<any[]>) => {
          this.loaderChatAndGridWhatsapp = false;
          this.historialMensajeRecibidosChat = resp.body;
          this.bloquearSeleccion = false;
          this.posicionarUltimoMensaje();
        },
        error: (error) => {
          this.loaderChatAndGridWhatsapp = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  posicionarUltimoMensaje() {
    try {
      this.chwcBlockMessage.nativeElement.scrollTop =
        this.chwcBlockMessage.nativeElement.scrollHeight;
    } catch (err) {
      console.log(err);
    }
  }

  private limpiarCelular(celularOriginal: string, idCodigoPais: number) {
    celularOriginal = celularOriginal ?? '';
    celularOriginal = celularOriginal.trim();
    celularOriginal = celularOriginal
      .replace('+', '')
      .replace('-', '')
      .replace('_', '')
      .replace(' ', '')
      .replace('/', '');
    if (celularOriginal.substring(0, 1) == '0') {
      for (let i = 0; i < celularOriginal.length; i++) {
        let caracter = celularOriginal.substring(0, 1);
        if (caracter == '0') {
          celularOriginal = celularOriginal.substring(1);
        } else {
          break;
        }
      }
    }

    switch (idCodigoPais) {
      case 57:
        if (!celularOriginal.startsWith('57') && celularOriginal != '') {
          celularOriginal = '57' + celularOriginal;
        }
        break;
      case 591:
        if (!celularOriginal.startsWith('591') && celularOriginal !== '') {
          celularOriginal = '591' + celularOriginal;
        }

        break;

      case 52:
        if (!celularOriginal.startsWith('52') && celularOriginal !== '') {
          celularOriginal = '52' + celularOriginal;
        } else {
          if (
            celularOriginal.startsWith('521') &&
            celularOriginal.trim().length > 10
          ) {
            celularOriginal = '52' + celularOriginal.substring(3);
          }
        }

        break;
      case 56:
        if (!celularOriginal.startsWith('56') && celularOriginal !== '') {
          celularOriginal = '56' + celularOriginal;
        }

        break;
      case 51:
        if (celularOriginal.startsWith('51') && celularOriginal != '') {
          celularOriginal = celularOriginal.substring(2);
        } else {
          const listaTexto = ['050151', '060151', '040151'];
          // Generar un índice aleatorio];
          const indiceAleatorio = Math.floor(Math.random() * listaTexto.length);
          const elementoAleatorio = listaTexto[indiceAleatorio];
        }
        break;
      default:
        if (
          idCodigoPais != null &&
          idCodigoPais > 0 &&
          !celularOriginal.startsWith(idCodigoPais.toString()) &&
          celularOriginal !== ''
        ) {
          celularOriginal = `00${idCodigoPais}${celularOriginal}`;
        }

        break;
    }

    let idPais = 0;
    let numero = '';
    if (celularOriginal.substring(0, 1) == '0') {
      for (let i = 0; i < celularOriginal.length; i++) {
        let caracter = celularOriginal.substring(0, 1);
        if (caracter == '0') {
          celularOriginal = celularOriginal.substring(1);
        } else {
          break;
        }
      }
    }

    if (this.alumno.idCodigoPais == 51) {
      idPais = 51;
      if (!celularOriginal.startsWith('51')) {
        numero = `51${celularOriginal}`;
      } else {
        numero = celularOriginal;
      }
    } else if (this.alumno.idCodigoPais == 57) {
      // Colombia
      idPais = 57;
      if (!celularOriginal.startsWith('57')) {
        numero = `57${celularOriginal}`;
      } else {
        numero = celularOriginal;
      }
    } else if (this.alumno.idCodigoPais == 591) {
      // Bolivia
      idPais = 591;
      if (!celularOriginal.startsWith('591')) {
        numero = `591${celularOriginal}`;
      } else {
        numero = celularOriginal;
      }
    } else if (this.alumno.idCodigoPais == 52) {
      // Mexico
      idPais = 52;
      if (!celularOriginal.startsWith('52')) {
        numero = `521${numero}`;
      } else if (
        celularOriginal.startsWith('52') &&
        !celularOriginal.startsWith('521')
      ) {
        numero = celularOriginal.substring(2);
        numero = `521${numero}`;
      } else {
        numero = celularOriginal;
      }
    } else if (this.alumno.idCodigoPais == 56) {
      // Chile
      idPais = 56;
      if (!celularOriginal.startsWith('56')) {
        numero = `56${celularOriginal}`;
      } else {
        numero = celularOriginal;
      }
    } else {
      idPais = 0;
      if (
        this.alumno.idCodigoPais != null &&
        this.alumno.idCodigoPais != 0 &&
        !celularOriginal.startsWith(this.alumno.idCodigoPais.toString())
      ) {
        numero = `${this.alumno.idCodigoPais}${celularOriginal}`;
      } else {
        numero = celularOriginal;
      }
    }

    return numero;
  }
}

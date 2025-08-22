import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
  constApiPlanificacion,
} from '@environments/constApi';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { filter, find, map, Observable, startWith } from 'rxjs';
import { COMMA, ENTER, F, I } from '@angular/cdk/keycodes';
import { EnvioFiltroSegmen, Subestado } from '@integra/models/filtro-segmento';
import { PaisYCiudadComponent } from './pais-yciudad/pais-yciudad.component';
import { PagosComponent } from './pagos/pagos.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { LlamadasTelefonicasComponent } from './llamadas-telefonicas/llamadas-telefonicas.component';
import { GestionDeFechasComponent } from './gestion-de-fechas/gestion-de-fechas.component';
import { OportunidadesHistoricasComponent } from '../actualizar-filtro-segmento/oportunidades-historicas/oportunidades-historicas.component';
import { TarifariosComponent } from './tarifarios/tarifarios.component';
import { AvanceAcademicoComponent } from './avance-academico/avance-academico.component';
import { CumpleaniosComponent } from './cumpleanios/cumpleanios.component';
import { EnvioAutomaticoComponent } from '../actualizar-filtro-segmento/envio-automatico/envio-automatico.component';
import { SesionesComponent } from './sesiones/sesiones.component';
import { WebinarComponent } from './webinar/webinar.component';
import { TrabajoAlumnoComponent } from './trabajo-alumno/trabajo-alumno.component';
import { EstadoAvanceAcademicoComponent } from './estado-avance-academico/estado-avance-academico.component';
import { MetodosContactoComponent } from './metodos-contacto/metodos-contacto.component';
import { InterOfflineSitiowebComponent } from '../actualizar-filtro-segmento/inter-offline-sitioweb/inter-offline-sitioweb.component';
import { PerfilesComponent } from '../actualizar-filtro-segmento/perfiles/perfiles.component';
import { CategoriaDatoComponent } from '../actualizar-filtro-segmento/categoria-dato/categoria-dato.component';
import { VentaCruzadaComponent } from '../actualizar-filtro-segmento/venta-cruzada/venta-cruzada.component';
import { InterCorreoComponent } from '../actualizar-filtro-segmento/inter-correo/inter-correo.component';
import { InterChatPortalWebComponent } from '../actualizar-filtro-segmento/inter-chat-portal-web/inter-chat-portal-web.component';
import { FormulariosComponent } from '../actualizar-filtro-segmento/formularios/formularios.component';
import { HistorialFinComponent } from '../actualizar-filtro-segmento/historial-fin/historial-fin.component';
import { InterOfflineOnlineComponent } from '../actualizar-filtro-segmento/inter-offline-online/inter-offline-online.component';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-nuevo-filtro-segmento',
  templateUrl: './nuevo-filtro-segmento.component.html',
  styleUrls: ['./nuevo-filtro-segmento.component.scss'],
})
export class NuevoFiltroSegmentoComponent implements OnInit, AfterViewInit {
  //----------Autocomplete -----------------//

  @ViewChild('multiselect') public multiselect: MultiSelectComponent;
  @ViewChild('subestadomatricula')
  public subestadomatricula: MultiSelectComponent;
  @ViewChild('modalidad') public modalidad: MultiSelectComponent;
  @ViewChild('area') public area: MultiSelectComponent;
  @ViewChild('subarea') public subarea: MultiSelectComponent;
  @ViewChild('programag') public programag: MultiSelectComponent;
  @ViewChild('programae') public programae: MultiSelectComponent;
  @ViewChild('filtro') public filtro: MultiSelectComponent;

  @ViewChild(PaisYCiudadComponent) paisYCiudad: any;
  @ViewChild(PagosComponent) pagos: any;
  @ViewChild(DocumentosComponent) documentos: any;
  @ViewChild(LlamadasTelefonicasComponent) llamadas: any;
  @ViewChild(GestionDeFechasComponent) gestionFechas: any;
  @ViewChild(OportunidadesHistoricasComponent) oportunidad: any;
  @ViewChild(TarifariosComponent) tarifario: any;
  @ViewChild(AvanceAcademicoComponent) avanceAcademico: any;
  @ViewChild(CumpleaniosComponent) cumpleanios: any;
  @ViewChild(EnvioAutomaticoComponent) envioAutomatico: any;
  @ViewChild(SesionesComponent) sesion: any;
  @ViewChild(WebinarComponent) webinar: any;
  @ViewChild(TrabajoAlumnoComponent) trabajoAlumno: any;
  @ViewChild(EstadoAvanceAcademicoComponent) estadoAvance: any;
  @ViewChild(MetodosContactoComponent) metodoContacto: any;
  @ViewChild(InterOfflineSitiowebComponent) sitioWeb: any;
  @ViewChild(PerfilesComponent) perfiles: any;
  @ViewChild(CategoriaDatoComponent) categoriaDato: any;
  @ViewChild(VentaCruzadaComponent) ventaCruzada: any;
  @ViewChild(InterCorreoComponent) correo: any;
  @ViewChild(InterChatPortalWebComponent) chatPortal: any;
  @ViewChild(FormulariosComponent) formularios: any;
  @ViewChild(HistorialFinComponent) historial: any;
  @ViewChild(InterOfflineOnlineComponent) offlineOnline: any;

  Ciudad: any;
  Pais: any;
  Pago: any;
  Documentos: any;
  Llamadas: any;
  GestionFechas: any;
  GestionFechasFechaInicioMatriculaAlumno: any;
  GestionFechasFechaFinMatriculaAlumno: any;
  ConsiderarOportunidad: any;
  ActividadCabeceraLlamadas: any;
  OcurrenciasLlamadas: any;
  Tarifario: any;
  AvanceAcademico: any;
  CumpleaniosCantidad: any;

  CumpleaniosTiempo: any;
  EnvioAutomaticoEnvioAplica: any;
  EnvioAutomaticoAplicaUltima: any;
  Sesiones: any;
  Webinar: any;
  ConsiderarFiltroGeneral: any = false;
  ConsiderarFiltroEspecifico: any = false;
  ConsiderarAlumnosAsignacionAutomaticaOperaciones: any = false;
  ExcluirMatriculados: any = false;
  loader: boolean = false;
  virtual: any = {
    itemHeight: 28,
  };

  ngAfterViewInit(): void {}

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<NuevoFiltroSegmentoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.listaSubEstadoFiltrada = [];
  }

  Nombre: any = '';
  Descripcion: any = '';
  EstadoMatricula: any;
  SubestadoMatricula: any;
  Modalidad: any;
  estado: any;
  Subestados: any;
  ProgramaGeneral: any;
  ProgramaEspecificos: any;
  FiltroExcluido: any;
  loading: any;
  listaEstadoMatricula: any;
  listaModalidad: any;
  listaFiltro: any;
  listaArea: any;


  listaSubArea: any;
  listaPrograma: any;
  listaProgramaEspecifico: any;

  enviolistaArea = '';
  enviolistaSubArea = '';
  enviolistaPGeneral = '';

  dataSourceEP: Array<any> = [];
  actualizarDatos: any;
  estadoMatPrueba: any;

  programaEEnvio: Array<any> = [];
  programaEnvio: Array<any> = [];
  subAreaEnvio: Array<any> = [];
  areaEnvio: Array<any> = [];
  filtroEnvio: Array<any> = [];
  modalidadEnvio: Array<any> = [];
  subEstadoEnvio: Array<any> = [];
  estadoEnvio: Array<any> = [];
  listaSubestado : any = []

  //----Funcion recorrer modalidades ----------//

  presencial: boolean;
  sincronico: boolean;
  asincronico: boolean;

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  //----AutocompleteEstadoMatricula---------//

  estados: any = [];
  listaEstadoFiltrada: Array<{ id: string; estadoMatricula: number }>;

  //----AutocompleteSubEstadoMatricula---------//

  subestados: any = [];
  listaSubEstadoFiltrada: Array<{ Id: string; Nombre: number }>;

  //----AutocompleteModalidad---------//

  modalidades: any = [];
  modalidadesListaId: any = [];
  listaModalidadFiltrada: Array<{ id: string; nombre: number }>;

  //----AutocompleteFiltroSegmento---------//

  filtros: any = [];
  listaFiltroFiltrada: Array<{ id: string; nombre: number }>;

  //----AutocompleteArea---------//

  areas: any = [];
  areasListaId: Array<any> = [];
  listaAreaFiltrada: Array<{ id: string; nombre: number }>;

  //----AutocompleteSubArea---------//

  subareas: any = [];
  subareasListaId: Array<any> = [];
  listaSubAreaFiltrada: Array<{ id: string; nombre: number }>;

  //----AutocompletePrograma---------//

  programas: any = [];
  programasListaId: Array<any> = [];
  listaProgramaGFiltrada: Array<{ id: string; nombre: number }>;

  //----AutocompleteProgramaEspecifico---------//

  programasE: any = [];
  listaProgramaEFiltrada: Array<{ id: string; nombre: number }>;

  //-------Combos-----------------//

  subestado: Array<Subestado> = [
    {
      Id: 1,
      Nombre: 'PF calificado por emitir certificado',
      IdEstadoMatricula: 5,
    },
    { Id: 2, Nombre: 'PF en calificación', IdEstadoMatricula: 5 },
    { Id: 4, Nombre: 'PF pendiente de envio', IdEstadoMatricula: 5 },
    {
      Id: 5,
      Nombre: 'Por emitir certificado aprobado (No aplica PF)',
      IdEstadoMatricula: 5,
    },
    {
      Id: 6,
      Nombre: 'Por emitir certificado completado',
      IdEstadoMatricula: 5,
    },
    { Id: 7, Nombre: 'Por emitir certificado modulos', IdEstadoMatricula: 5 },

    { Id: 8, Nombre: 'Aprobado BSGI + Partner', IdEstadoMatricula: 12 },
    {
      Id: 9,
      Nombre: 'Aprobado BSGI - Pendiente Partner',
      IdEstadoMatricula: 12,
    },
    { Id: 10, Nombre: 'Aprobado BSGI', IdEstadoMatricula: 12 },
    {
      Id: 11,
      Nombre: 'Completado BSGI (solo es para casos donde hay PF)',
      IdEstadoMatricula: 12,
    },
    { Id: 12, Nombre: 'Modulos BSGI', IdEstadoMatricula: 12 },

    { Id: 13, Nombre: 'Cuota Atraso', IdEstadoMatricula: 1 },
    { Id: 14, Nombre: 'Cuota AlDia', IdEstadoMatricula: 1 },
    { Id: 15, Nombre: 'Seguimiento Academico', IdEstadoMatricula: 1 },
  ];

  filtroSubestado(){
    this.listaSubestado = []
    console.log(this.estadoEnvio)
      this.estadoEnvio.forEach((e:any) => {
        console.log(e.Valor)
        var r=this.subestado.filter(s => s.IdEstadoMatricula === e.Valor);
        r.forEach((a:any) => {
          this.listaSubestado.push(a)  
        });
        
        console.log(this.listaSubestado)
      });
       console.log(this.listaSubestado)
  }

  public jsonEnvio: EnvioFiltroSegmen = {
    Id: 0,
    IdFiltroSegmentoTipoContacto: 0,
    Nombre: '',
    Descripcion: '',
    IdOperadorComparacionNroSolicitudInformacion: null,
    NroSolicitudInformacion: null,
    IdOperadorComparacionNroOportunidades: null,
    NroOportunidades: null,

    FechaInicioCreacionUltimaOportunidad: null,
    FechaFinCreacionUltimaOportunidad: null,
    FechaInicioModificacionUltimaActividadDetalle: null,
    FechaFinModificacionUltimaActividadDetalle: null,

    EsRn2: false,
    FechaInicioProgramacionUltimaActividadDetalleRn2: null,
    FechaFinProgramacionUltimaActividadDetalleRn2: null,

    //Fecha formulario
    FechaInicioFormulario: null,
    FechaFinFormulario: null,
    //Fecha chat
    FechaInicioChatIntegra: null,
    FechaFinChatIntegra: null,
    IdOperadorComparacionTiempoMaximoRespuestaChatOnline: null,
    TiempoMaximoRespuestaChatOnline: null,
    IdOperadorComparacionNroPalabrasClienteChatOnline: null,
    NroPalabrasClienteChatOnline: null,
    IdOperadorComparacionTiempoPromedioRespuestaChatOnline: null,
    TiempoPromedioRespuestaChatOnline: null,
    IdOperadorComparacionNroPalabrasClienteChatOffline: null,
    NroPalabrasClienteChatOffline: null,
    //correo
    FechaInicioCorreo: null,
    FechaFinCorreo: null,
    IdOperadorComparacionNroCorreosAbiertos: null,
    NroCorreosAbiertos: null,
    IdOperadorComparacionNroCorreosNoAbiertos: null,
    NroCorreosNoAbiertos: null,
    IdOperadorComparacionNroClicksEnlace: null,
    NroClicksEnlace: null,
    EsSuscribirme: false,
    EsDesuscribirme: false,

    IdOperadorComparacionNroCorreosAbiertosMailChimp: null,
    NroCorreosAbiertosMailChimp: null,
    IdOperadorComparacionNroCorreosNoAbiertosMailChimp: null,
    NroCorreosNoAbiertosMailChimp: null,
    IdOperadorComparacionNroClicksEnlaceMailChimp: null,
    NroClicksEnlaceMailChimp: null,

    ConsiderarFiltroGeneral: false,
    ConsiderarFiltroEspecifico: false,
    TieneVentaCruzada: false,
    IdOperadorComparacionNroTotalLineaCreditoVigente: null,
    NroTotalLineaCreditoVigente: null,
    IdOperadorComparacionMontoTotalLineaCreditoVigente: null,
    MontoTotalLineaCreditoVigente: null,
    IdOperadorComparacionMontoMaximoOtorgadoLineaCreditoVigente: null,
    MontoMaximoOtorgadoLineaCreditoVigente: null,
    IdOperadorComparacionMontoMinimoOtorgadoLineaCreditoVigente: null,
    MontoMinimoOtorgadoLineaCreditoVigente: null,
    IdOperadorComparacionNroTotalLineaCreditoVigenteVencida: null,
    NroTotalLineaCreditoVigenteVencida: null,
    IdOperadorComparacionMontoTotalLineaCreditoVigenteVencida: null,
    MontoTotalLineaCreditoVigenteVencida: null,
    IdOperadorComparacionNroTcOtorgada: null,
    NroTcOtorgada: null,
    IdOperadorComparacionMontoTotalOtorgadoEnTcs: null,
    MontoTotalOtorgadoEnTcs: null,
    IdOperadorComparacionMontoMaximoOtorgadoEnUnaTc: null,
    MontoMaximoOtorgadoEnUnaTc: null,
    IdOperadorComparacionMontoMinimoOtorgadoEnUnaTc: null,
    MontoMinimoOtorgadoEnUnaTc: null,
    IdOperadorComparacionMontoDisponibleTotalEnTcs: null,
    MontoDisponibleTotalEnTcs: null,
    FechaInicioLlamada: null,
    FechaFinLlamada: null,
    IdOperadorComparacionDuracionPromedioLlamadaPorOportunidad: null,
    DuracionPromedioLlamadaPorOportunidad: null,
    IdOperadorComparacionDuracionTotalLlamadaPorOportunidad: null,
    DuracionTotalLlamadaPorOportunidad: null,
    IdOperadorComparacionNroLlamada: null,
    NroLlamada: null,
    IdOperadorComparacionDuracionLlamada: null,
    DuracionLlamada: null,
    IdOperadorComparacionTasaEjecucionLlamada: null,
    TasaEjecucionLlamada: null,

    //Tab interaccion sitio web
    FechaInicioInteraccionSitioWeb: null,
    FechaFinInteraccionSitioWeb: null,
    IdOperadorComparacionTiempoVisualizacionTotalSitioWeb: null,
    TiempoVisualizacionTotalSitioWeb: null,
    IdOperadorComparacionNroClickEnlaceTodoSitioWeb: null,
    NroClickEnlaceTodoSitioWeb: null,
    IdOperadorComparacionTiempoVisualizacionTotalPaginaPrograma: null,
    TiempoVisualizacionTotalPaginaPrograma: null,
    IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas:
      null,
    TiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas: null,
    IdOperadorComparacionNroClickEnlacePaginaPrograma: null,
    NroClickEnlacePaginaPrograma: null,
    ConsiderarVisualizacionVideoVistaPreviaPaginaPrograma: false,
    ConsiderarClickBotonMatricularmePaginaPrograma: false,
    ConsiderarClickBotonVersionPruebaPaginaPrograma: false,
    IdOperadorComparacionTiempoVisualizacionTotalPaginaBscampus: null,
    TiempoVisualizacionTotalPaginaBscampus: null,
    IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus:
      null,
    TiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus: null,
    IdOperadorComparacionNroVisitasDirectorioTagAreaSubArea: null,
    NroVisitasDirectorioTagAreaSubArea: null,
    IdOperadorComparacionTiempoVisualizacionTotalDirectorioTagAreaSubArea: null,
    TiempoVisualizacionTotalDirectorioTagAreaSubArea: null,
    IdOperadorComparacionNroClickEnlaceDirectorioTagAreaSubArea: null,
    NroClickEnlaceDirectorioTagAreaSubArea: null,
    IdOperadorComparacionNroVisitasPaginaMisCursos: null,
    NroVisitasPaginaMisCursos: null,
    IdOperadorComparacionTiempoVisualizacionTotalPaginaMisCursos: null,
    TiempoVisualizacionTotalPaginaMisCursos: null,
    IdOperadorComparacionNroClickEnlacePaginaMisCursos: null,
    NroClickEnlacePaginaMisCursos: null,
    IdOperadorComparacionNroVisitaPaginaCursoDiplomado: null,
    NroVisitaPaginaCursoDiplomado: null,
    IdOperadorComparacionTiempoVisualizacionTotalPaginaCursoDiplomado: null,
    TiempoVisualizacionTotalPaginaCursoDiplomado: null,
    IdOperadorComparacionNroClicksEnlacePaginaCursoDiplomado: null,
    NroClicksEnlacePaginaCursoDiplomado: null,
    ConsiderarClickFiltroPaginaCursoDiplomado: false,

    IdOperadorComparacionNroSolicitudInformacionPg: null,
    NroSolicitudInformacionPg: null,
    IdOperadorComparacionNroSolicitudInformacionArea: null,
    NroSolicitudInformacionArea: null,
    IdOperadorComparacionNroSolicitudInformacionSubArea: null,
    NroSolicitudInformacionSubArea: null,

    IdCampaniaGeneral: null,
    TipoAsociacion: null,
    CantidadPeriodoSinRecibirCorreo: null,
    TipoPeriodoSinRecibirCorreo: null,
    IdProbabilidadOportunidad: null,
    NumeroSegmento: null,
    IdPrioridadMailChimpLista: null,
    IdCategoriaObjetoFiltro: null,

    ConsiderarOportunidadHistorica: false,
    ConsiderarCategoriaDato: false,
    ConsiderarInteraccionOfflineOnline: false,
    ConsiderarInteraccionSitioWeb: false,
    ConsiderarInteraccionFormularios: false,
    ConsiderarInteraccionChatPw: false,
    ConsiderarInteraccionCorreo: false,
    ConsiderarHistorialFinanciero: false,
    ConsiderarInteraccionWhatsApp: false,
    ConsiderarInteraccionChatMessenger: false,
    ConsiderarEnvioAutomatico: false,
    ExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal: false,
    FechaInicioExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal: null,
    FechaFinExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal: null,

    IdTiempoFrecuenciaMatriculaAlumno: null,
    CantidadTiempoMatriculaAlumno: null,

    ConsiderarConMessengerValido: false,
    ConsiderarConWhatsAppValido: false,
    ConsiderarConEmailValido: false,

    IdTiempoFrecuenciaCumpleaniosContactoDentroDe: null,
    CantidadTiempoCumpleaniosContactoDentroDe: null,

    FechaInicioMatriculaAlumno: null,
    FechaFinMatriculaAlumno: null,
    ConsiderarAlumnosAsignacionAutomaticaOperaciones: false,
    ExcluirMatriculados: false,

    AplicaSobreCreacionOportunidad: false,
    IdOperadorMedidaTiempoCreacionOportunidad: null,
    NroMedidaTiempoCreacionOportunidad: null,
    AplicaSobreUltimaActividad: false,
    IdOperadorMedidaTiempoUltimaActividadEjecutada: null,
    NroMedidaTiempoUltimaActividadEjecutada: null,
    EnvioAutomaticoEstadoActividadDetalle: null,
    ConsiderarYaEnviados: false,

    ListaArea: [],
    ListaSubArea: [],
    ListaProgramaGeneral: [],
    ListaProgramaEspecifico: [],
    ListaOportunidadInicialFaseMaxima: [],
    ListaOportunidadInicialFaseActual: [],
    ListaOportunidadActualFaseMaxima: [],
    ListaOportunidadActualFaseActual: [],
    ListaPais: [],
    ListaCiudad: [],
    ListaTipoCategoriaOrigen: [],
    ListaCategoriaOrigen: [],
    ListaCargo: [],
    ListaIndustria: [],
    ListaAreaFormacion: [],
    ListaAreaTrabajo: [],

    ListaTipoFormulario: [],
    ListaTipoInteraccionFormulario: [],
    ListaProbabilidadOportunidad: [],
    ListaActividadLlamada: [],

    ListaVCArea: [],
    ListaVCSubArea: [],
    ListaVCPGeneral: [],

    ListaProbabilidadVentaCruzada: [],
    ListaProgramaGeneralPrincipalExcluirPorMismoCorreoEnviado: [],
    ListaExcluirPorFiltroSegmento: [],
    ListaExcluirPorConjuntoLista: [],
    ListaExcluirPorCampaniaMailing: [],

    ListaActividadCabecera: [],
    ListaOcurrencia: [],
    ListaDocumentoAlumno: [],
    ListaEstadoMatricula: [],
    ListaSubEstadoMatricula: [],
    ListaModalidadCurso: [],

    ListaSesion: [],
    ListaEstadoAcademico: [],
    ListaEstadoPago: [],
    ListaPorcentajeAvance: [],

    ListaEstadoLlamada: [],

    ListaSesionWebinar: [],
    ListaTrabajoAlumno: [],
    ListaTrabajoAlumnoFinal: [],
    ListaTarifario: [],

    ListaEnvioAutomaticoOportunidadFaseActual: [],

    NombreUsuario: '',
    IdCampaniaMailing: null,
    IdCampaniaMailingLista: null,

    IdConjuntoListaDetalle: null,
    NroListasRepeticionContacto: null,
    NroEjecucion: null,
  };

  ngOnInit(): void {
    this.obtenerEstadoMatricula();
    this.obtenerModalidadCurso();
    this.obtenerComboFiltro();
    this.obtenerAreaCapacitacion();

    if (this.data[1] == 1) {
      this.obtenerFiltroSegmentoPorId();
    }

    console.log(this.data[1]);
    console.log(this.data);
  }



  //-------------------Funciones Obtener ---------------------//

  obtenerFiltroSegmentoPorId() {
    this.loading = true;
    this.integraService
      .obtener(
        constApiMarketing.FiltroSegmentoObtenerPorId + '/' + this.data[2]
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.actualizarDatos = response.body;
          this.data[0] = this.actualizarDatos.idFiltroSegmentoTipoContacto;
          this.Nombre = this.actualizarDatos.nombre;
          this.Descripcion = this.actualizarDatos.descripcion;

          this.obtenerComboFiltro();

          this.ConsiderarFiltroGeneral =
            this.actualizarDatos.considerarFiltroGeneral;
          this.ConsiderarFiltroEspecifico =
            this.actualizarDatos.considerarFiltroEspecifico;
          this.ConsiderarAlumnosAsignacionAutomaticaOperaciones =
            this.actualizarDatos.considerarAlumnosAsignacionAutomaticaOperaciones;
          this.ExcluirMatriculados = this.actualizarDatos.excluirMatriculados;

          this.listaEstadoMatricula.forEach((p: any) => {
            this.actualizarDatos.listaEstadoMatricula.forEach((e: any) => {
              if (p.id == e.valor) {
                this.estados.push(p);
              }
            });
          });

          this.subEstadoEnvio = [];
          this.subestado.forEach((p: any) => {
            this.actualizarDatos.listaSubEstadoMatricula.forEach((e: any) => {
              if (p.Id == e.valor) {
                this.subestados.push(p);
                this.subEstadoEnvio.push({ Valor: e.valor });
              }
            });
          });

          this.listaModalidad.forEach((p: any) => {
            this.actualizarDatos.listaModalidadCurso.forEach((e: any) => {
              if (p.id == e.valor) {
                this.modalidades.push(p);
                this.modalidadesListaId.push(p.id);

                this.modalidadRecorrer();
              }
            });
          });

          this.obtenerEstadoMatricula();
          this.obtenerModalidadCurso();
          this.obtenerAreaCapacitacion();
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }

  obtenerEstadoMatricula() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerEstadoMatricula)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaEstadoMatricula = response.body;
          this.listaEstadoFiltrada = this.listaEstadoMatricula;
          this.estadoEnvio = [];

          if (this.actualizarDatos != undefined) {
            this.estados.forEach((e: any) => {
              this.estadoEnvio.push({ Valor: e.id });
            });
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerModalidadCurso() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerModalidadCurso)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaModalidad = response.body;
          this.modalidadEnvio = [];
          this.listaModalidadFiltrada = this.listaModalidad;
          if (this.actualizarDatos != undefined) {
            this.modalidades.forEach((e: any) => {
              this.modalidadEnvio.push({ Valor: e.id });
            });
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerComboFiltro() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerComboFiltroSegmento)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaFiltro = response.body;
          this.listaFiltroFiltrada = this.listaFiltro;
          if (this.actualizarDatos != undefined) {
            this.filtroEnvio = [];
            this.listaFiltro.forEach((p: any) => {
              this.actualizarDatos.listaExcluirPorFiltroSegmento.forEach(
                (e: any) => {
                  if (p.id == e.valor) {
                    this.filtros.push(p);
                  }
                }
              );
            });
            this.filtros.forEach((e: any) => {
              this.filtroEnvio.push({ Valor: e.id });
            });

            this.actualizarDatos.listaExcluirPorFiltroSegmento = [];
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerAreaCapacitacion() {
    this.loading = true;
    this.integraService
      .obtener(constApiPlanificacion.AreaCapacitacionObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaArea = response.body;
          this.areaEnvio = [];
          this.enviolistaArea = '';
          this.listaAreaFiltrada = this.listaArea;
          if (this.actualizarDatos != undefined) {
            this.listaArea.forEach((p: any) => {
              this.actualizarDatos.listaArea.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.areas.push(p);
                  this.areasListaId.push(p.id);
                  this.enviolistaArea = this.areasListaId.join(',');
                }
              });
            });

            if (this.actualizarDatos.listaArea.length > 0) {
              this.obtenerSubAreaCapacitacion();
              this.obtenerComboFiltro();
            }
            this.areas.forEach((e: any) => {
              this.areaEnvio.push({ Valor: e.id });
            });
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerSubAreaCapacitacion() {
    this.loading = true;
    this.integraService
      .post(
        constApiMarketing.ObtenerSubAreaCapacitacion +
          '?idAreas=' +
          this.enviolistaArea
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaSubArea = response.body;
          this.listaSubAreaFiltrada = this.listaSubArea;

          if (this.actualizarDatos != undefined) {
            this.subAreaEnvio = [];
            this.subareas = [];
            this.listaSubArea.forEach((p: any) => {
              this.actualizarDatos.listaSubArea.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.subareas.push(p);
                  this.subareasListaId.push(p.id);
                  this.enviolistaArea = this.areasListaId.join(',');
                  this.enviolistaSubArea = this.subareasListaId.join(',');
                }
              });
            });
            this.subareas.forEach((e: any) => {
              this.subAreaEnvio.push({ Valor: e.id });
            });
            if (
              this.actualizarDatos.listaSubArea.length > 0 &&
              this.actualizarDatos.listaArea.length > 0
            ) {
              this.obtenerProgramaGeneral();
            }
            this.actualizarDatos.listaSubArea = [];
            this.actualizarDatos.listaArea = [];
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerProgramaGeneral() {
    this.enviolistaArea = this.areasListaId.join(',');
    this.enviolistaSubArea = this.subareasListaId.join(',');
    this.loading = true;
    this.integraService
      .post(
        constApiMarketing.ObtenerProgramaGeneral +
          '?idAreas=' +
          this.enviolistaArea +
          '&idSubAreas=' +
          this.enviolistaSubArea
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaPrograma = response.body;
          this.listaProgramaGFiltrada = this.listaPrograma;

          if (this.actualizarDatos != undefined) {
            this.programas = [];
            this.programaEnvio = [];
            this.listaPrograma.forEach((p: any) => {
              this.actualizarDatos.listaProgramaGeneral.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.programas.push(p);
                  this.programasListaId.push(p.id);
                  this.enviolistaPGeneral = this.programasListaId.join(',');
                }
              });
            });
            this.programas.forEach((e: any) => {
              this.programaEnvio.push({ Valor: e.id });
            });
            if (this.actualizarDatos.listaProgramaGeneral.length > 0) {
              this.obtenerProgramaEspecifico();
            }

            this.actualizarDatos.listaProgramaGeneral = [];
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerProgramaEspecifico() {
    this.enviolistaPGeneral = this.programasListaId.join(',');
    this.loading = true;
    this.integraService
      .post(
        constApiMarketing.ObtenerProgramaEspecifico +
          '?idProgramaGeneral=' +
          this.enviolistaPGeneral
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaProgramaEspecifico = response.body;
          this.listaProgramaEFiltrada = this.listaProgramaEspecifico;
          if (this.actualizarDatos != undefined) {
            if (this.actualizarDatos != undefined) {
              this.programaEEnvio = [];
              this.programasE = [];
              this.listaProgramaEspecifico.forEach((p: any) => {
                this.actualizarDatos.listaProgramaEspecifico.forEach(
                  (e: any) => {
                    if (p.id == e.valor) {
                      this.programasE.push(p);
                    }
                  }
                );
              });
              this.programasE.forEach((e: any) => {
                this.programaEEnvio.push({ Valor: e.id });
              });
            }
            this.actualizarDatos.listaProgramaEspecifico = [];
            this.obtenerComboFiltro();
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  //---------AutocompleteEstadoFuncion----------------//

  valueChange(e: any) {
    this.estadoEnvio = [];
    e.forEach((f: any) => {
      this.estadoEnvio.push({ Valor: f.id });
    });

    this.filtroSubestado()
  }

  filterChange(e: any) {
    this.listaEstadoFiltrada = this.listaEstadoMatricula;
    if (e.length >= 1) {
      this.listaEstadoFiltrada = this.listaEstadoMatricula.filter(
        (s: any) =>
          s.estadoMatricula.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.multiselect.toggle(false);
    }
  }

  removeTag(e: any) {
    this.estadoEnvio.splice(e.id, 1);
  }

  //---------AutocompleteSubEstadoFuncion----------------//

  valueChangeSubEstado(e: any) {
    this.subEstadoEnvio = [];
    e.forEach((f: any) => {
      this.subEstadoEnvio.push({ Valor: f.Id });
    });
  }

  filterChangeSubEstado(e: any) {
    // this.listaSubEstadoFiltrada = this.subestado;
    // if (e.length >= 3) {
    //   this.listaSubEstadoFiltrada = this.subestado.filter(
    //     (s: any) => s.Nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
    //   );
    // } else {
    //   this.multiselect.toggle(false);
    // }
  }

  removeTagSubEstado(e: any) {
    this.subEstadoEnvio.splice(e.Id, 1);
  }

  //---------AutocompleteModalidadCurso----------------//

  valueChangeModalidad(e: any) {
    this.modalidadEnvio = [];
    this.modalidadesListaId = [];
    e.forEach((f: any) => {
      this.modalidadEnvio.push({ Valor: f.id });
      this.modalidadesListaId.push(f.id);
    });

    this.modalidadRecorrer();
  }

  filterChangeModalidad(e: any) {
    // this.listaModalidadFiltrada = this.listaModalidad;
    // if (e.length >= 1) {
    //   this.listaModalidadFiltrada = this.listaModalidad.filter(
    //     (s: any) => s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
    //   );
    // } else {
    //   this.multiselect.toggle(false);
    // }
  }

  removeTagModalidad(e: any) {
    this.modalidadEnvio.splice(e.id, 1);
  }

  modalidadRecorrer() {
    this.presencial = false;
    this.sincronico = false;
    this.asincronico = false;

    this.modalidades.forEach((item: any) => {
      if (item.id == 0) {
        this.presencial = true;
      }
      if (item.id == 1) {
        this.sincronico = true;
      }
      if (item.id == 2) {
        this.asincronico = true;
      }
    });
  }

  //---------AutocompleteFiltro----------------//

  valueChangeFil(e: any) {
    this.filtroEnvio = [];
    e.forEach((f: any) => {
      this.filtroEnvio.push({ Valor: f.id });
    });
  }

  filterChangeFil(e: any) {
    this.listaFiltroFiltrada = this.listaFiltro;
    if (e.length >= 1) {
      this.listaFiltroFiltrada = this.listaFiltro.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.filtro.toggle(false);
    }
  }

  removeTagFil(e: any) {
    this.filtroEnvio.splice(e.id, 1);
  }

  //---------AutocompleteArea----------------//

  valueChangeArea(e: any) {
    console.log(e);
    this.areaEnvio = [];
    this.listaSubArea = [];
    this.listaSubAreaFiltrada = [];
    this.areasListaId = [];
    this.enviolistaArea = '';
    this.subareas = [];
    this.programas = [];
    this.programasE = [];
    this.programaEEnvio = [];
    this.programaEnvio = [];
    this.listaProgramaEspecifico = [];
    this.listaProgramaEFiltrada = [];
    this.programasListaId = [];
    this.enviolistaPGeneral = '';
    this.subAreaEnvio = [];
    this.listaPrograma = [];
    this.subareasListaId = [];
    this.enviolistaSubArea = '';
    this.listaProgramaGFiltrada = [];
    if (e.length > 0) {
      e.forEach((f: any) => {
        this.areaEnvio.push({ Valor: f.id });
        this.areasListaId.push(f.id);
        this.enviolistaArea = this.areasListaId.join(',');
      });
      if (this.enviolistaArea.length > 0) {
        this.obtenerSubAreaCapacitacion();
      }
    }
  }

  filterChangeArea(e: any) {
    this.listaAreaFiltrada = this.listaArea;
    if (e.length >= 1) {
      this.listaAreaFiltrada = this.listaArea.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.area.toggle(false);
    }
  }

  removeTagArea(e: any) {
    this.areaEnvio.splice(e.id, 1);
    this.areaEnvio = [];
    this.listaSubArea = [];
    this.listaSubAreaFiltrada = [];
    this.areasListaId = [];
    this.enviolistaArea = '';
    this.subareas = [];
    this.programas = [];
    this.programasE = [];
    this.programaEEnvio = [];
    this.programaEnvio = [];
    this.listaProgramaEspecifico = [];
    this.listaProgramaEFiltrada = [];
    this.programasListaId = [];
    this.enviolistaPGeneral = '';
    this.subAreaEnvio = [];
    this.listaPrograma = [];
    this.subareasListaId = [];
    this.enviolistaSubArea = '';
    this.listaProgramaGFiltrada = [];
    this.programaEEnvio = [];
  }

  //---------AutocompleteSubArea----------------//

  valueChangeSubArea(e: any) {
    console.log(e);
    this.subAreaEnvio = [];
    this.listaPrograma = [];
    this.subareasListaId = [];
    this.enviolistaSubArea = '';
    this.listaProgramaGFiltrada = [];
    this.programas = [];
    this.programasE = [];
    this.programaEnvio = [];
    this.listaProgramaEspecifico = [];
    this.listaProgramaEFiltrada = [];
    this.programasListaId = [];
    this.enviolistaPGeneral = '';
    this.programaEEnvio = [];
    if (e.length > 0) {
      e.forEach((f: any) => {
        this.subAreaEnvio.push({ Valor: f.id });
        this.subareasListaId.push(f.id);
        this.enviolistaSubArea = this.subareasListaId.join(',');
      });

      this.obtenerProgramaGeneral();
    }
  }

  filterChangeSubArea(e: any) {
    this.listaSubAreaFiltrada = this.listaSubArea;
    if (e.length >= 1) {
      this.listaSubAreaFiltrada = this.listaSubArea.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.subarea.toggle(false);
    }
  }

  removeTagSubArea(e: any) {
    this.subAreaEnvio.splice(e.id, 1);
    this.subAreaEnvio = [];
    this.listaPrograma = [];
    this.subareasListaId = [];
    this.enviolistaSubArea = '';
    this.listaProgramaGFiltrada = [];
    this.programas = [];
    this.programasE = [];
    this.programaEnvio = [];
    this.listaProgramaEspecifico = [];
    this.listaProgramaEFiltrada = [];
    this.programasListaId = [];
    this.enviolistaPGeneral = '';
    this.programaEEnvio = [];
  }

  //---------AutocompleteProgramaGeneral----------------//

  valueChangePrograma(e: any) {
    this.programaEnvio = [];
    this.listaProgramaEspecifico = [];
    this.listaProgramaEFiltrada = [];
    this.programasListaId = [];
    this.enviolistaPGeneral = '';
    this.programasE = [];
    this.programaEEnvio = [];
    if (e.length > 0) {
      e.forEach((f: any) => {
        this.programaEnvio.push({ Valor: f.id });
        this.programasListaId.push(f.id);
        this.enviolistaPGeneral = this.programasListaId.join(',');
      });

      this.obtenerProgramaEspecifico();
    }
  }

  filterChangePrograma(e: any) {
    this.listaProgramaGFiltrada = this.listaPrograma;
    if (e.length >= 1) {
      this.listaProgramaGFiltrada = this.listaPrograma.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.programag.toggle(false);
    }
  }

  removeTagPrograma(e: any) {
    this.programaEnvio.splice(e.id, 1);
    this.programaEnvio = [];
    this.listaProgramaEspecifico = [];
    this.listaProgramaEFiltrada = [];
    this.programasListaId = [];
    this.enviolistaPGeneral = '';
    this.programasE = [];
    this.programaEEnvio = [];
  }

  //---------AutocompleteProgramaEspecifico----------------//

  valueChangeProgramaE(e: any) {
    this.programaEEnvio = [];
    e.forEach((f: any) => {
      this.programaEEnvio.push({ Valor: f.id });
    });
  }

  filterChangeProgramaE(e: any) {
    this.listaProgramaEFiltrada = this.listaProgramaEspecifico;
    if (e.length >= 1) {
      this.listaProgramaEFiltrada = this.listaProgramaEspecifico.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.programae.toggle(false);
    }
  }
  removeTagProgramaE(e: any) {
    this.programaEEnvio.splice(e.id, 1);
  }

  //-----------Funcion Crear----------------//

  Crear() {
    this.listaSubArea = [];
  

    if (this.Nombre == '') {
      this.alertaService.mensajeIcon(
        'Error',
        'Debe ingresar un nombre',
        'error'
      );
    } else {
      if (this.Descripcion == '') {
        this.alertaService.mensajeIcon(
          'Error',
          'Debe ingresar una descripcion',
          'error'
        );
      } else {
        this.loader = true;
        this.jsonEnvio.Id = 0;

        // - Filtro Principal (10) -//
        this.jsonEnvio.IdFiltroSegmentoTipoContacto = this.data[0];
        this.jsonEnvio.Nombre = this.Nombre;
        this.jsonEnvio.Descripcion = this.Descripcion;
        this.jsonEnvio.ConsiderarFiltroGeneral = this.ConsiderarFiltroGeneral;
        this.jsonEnvio.ConsiderarFiltroEspecifico =
          this.ConsiderarFiltroEspecifico;
        this.jsonEnvio.ConsiderarAlumnosAsignacionAutomaticaOperaciones =
          this.ConsiderarAlumnosAsignacionAutomaticaOperaciones;

        this.jsonEnvio.ListaEstadoMatricula =
          this.estadoEnvio == undefined ? [] : this.estadoEnvio;
        this.jsonEnvio.ListaSubEstadoMatricula =
          this.subEstadoEnvio == undefined ? [] : this.subEstadoEnvio;
        this.jsonEnvio.ListaModalidadCurso =
          this.modalidadEnvio == undefined ? [] : this.modalidadEnvio;

        this.jsonEnvio.ListaArea = this.areaEnvio;
        this.jsonEnvio.ListaSubArea = this.subAreaEnvio;
        this.jsonEnvio.ListaProgramaGeneral = this.programaEnvio;
        this.jsonEnvio.ListaProgramaEspecifico = this.programaEEnvio;
        this.jsonEnvio.ListaExcluirPorFiltroSegmento = this.filtroEnvio;

        this.jsonEnvio.ExcluirMatriculados = this.ExcluirMatriculados;

        //- Inter-offline-sitioweb (39) -//

        if (this.sitioWeb != undefined) {
          this.jsonEnvio.ConsiderarInteraccionSitioWeb =
            this.sitioWeb.datos == undefined ? false : this.sitioWeb.datos;

          this.jsonEnvio.FechaInicioInteraccionSitioWeb =
            this.sitioWeb.FechaInicioInteraccionSitioWeb;
          this.jsonEnvio.FechaFinInteraccionSitioWeb =
            this.sitioWeb.FechaFinInteraccionSitioWeb;
          this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionTotalSitioWeb =
            this.sitioWeb.IdOperadorComparacionTiempoVisualizacionTotalSitioWeb;
          this.jsonEnvio.TiempoVisualizacionTotalSitioWeb =
            this.sitioWeb.TiempoVisualizacionTotalSitioWeb;
          this.jsonEnvio.IdOperadorComparacionNroClickEnlaceTodoSitioWeb =
            this.sitioWeb.IdOperadorComparacionNroClickEnlaceTodoSitioWeb;
          this.jsonEnvio.NroClickEnlaceTodoSitioWeb =
            this.sitioWeb.NroClickEnlaceTodoSitioWeb;
          this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionTotalPaginaPrograma =
            this.sitioWeb.IdOperadorComparacionTiempoVisualizacionTotalPaginaPrograma;
          this.jsonEnvio.TiempoVisualizacionTotalPaginaPrograma =
            this.sitioWeb.TiempoVisualizacionTotalPaginaPrograma;
          this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas =
            this.sitioWeb.IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas;
          this.jsonEnvio.TiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas =
            this.sitioWeb.TiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas;
          this.jsonEnvio.IdOperadorComparacionNroClickEnlacePaginaPrograma =
            this.sitioWeb.IdOperadorComparacionNroClickEnlacePaginaPrograma;
          this.jsonEnvio.NroClickEnlacePaginaPrograma =
            this.sitioWeb.NroClickEnlacePaginaPrograma;
          this.jsonEnvio.ConsiderarVisualizacionVideoVistaPreviaPaginaPrograma =
            this.sitioWeb.ConsiderarVisualizacionVideoVistaPreviaPaginaPrograma;
          this.jsonEnvio.ConsiderarClickBotonMatricularmePaginaPrograma =
            this.sitioWeb.ConsiderarClickBotonMatricularmePaginaPrograma;
          this.jsonEnvio.ConsiderarClickBotonVersionPruebaPaginaPrograma =
            this.sitioWeb.ConsiderarClickBotonVersionPruebaPaginaPrograma; //
          this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionTotalPaginaBscampus =
            this.sitioWeb.IdOperadorComparacionTiempoVisualizacionTotalPaginaBscampus;
          this.jsonEnvio.TiempoVisualizacionTotalPaginaBscampus =
            this.sitioWeb.TiempoVisualizacionTotalPaginaBscampus;
          this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus =
            this.sitioWeb.IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus;
          this.jsonEnvio.TiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus =
            this.sitioWeb.TiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus; //
          this.jsonEnvio.IdOperadorComparacionNroVisitasDirectorioTagAreaSubArea =
            this.sitioWeb.IdOperadorComparacionNroVisitasDirectorioTagAreaSubArea;
          this.jsonEnvio.NroVisitasDirectorioTagAreaSubArea =
            this.sitioWeb.NroVisitasDirectorioTagAreaSubArea;
          this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionTotalDirectorioTagAreaSubArea =
            this.sitioWeb.IdOperadorComparacionTiempoVisualizacionTotalDirectorioTagAreaSubArea;
          this.jsonEnvio.TiempoVisualizacionTotalDirectorioTagAreaSubArea =
            this.sitioWeb.TiempoVisualizacionTotalDirectorioTagAreaSubArea;
          this.jsonEnvio.IdOperadorComparacionNroClickEnlaceDirectorioTagAreaSubArea =
            this.sitioWeb.IdOperadorComparacionNroClickEnlaceDirectorioTagAreaSubArea;
          this.jsonEnvio.NroClickEnlaceDirectorioTagAreaSubArea =
            this.sitioWeb.NroClickEnlaceDirectorioTagAreaSubArea; //
          this.jsonEnvio.IdOperadorComparacionNroVisitasPaginaMisCursos =
            this.sitioWeb.IdOperadorComparacionNroVisitasPaginaMisCursos;
          this.jsonEnvio.NroVisitasPaginaMisCursos =
            this.sitioWeb.NroVisitasPaginaMisCursos;
          this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionTotalPaginaMisCursos =
            this.sitioWeb.IdOperadorComparacionTiempoVisualizacionTotalPaginaMisCursos;
          this.jsonEnvio.TiempoVisualizacionTotalPaginaMisCursos =
            this.sitioWeb.TiempoVisualizacionTotalPaginaMisCursos;
          this.jsonEnvio.IdOperadorComparacionNroClickEnlacePaginaMisCursos =
            this.sitioWeb.IdOperadorComparacionNroClickEnlacePaginaMisCursos;
          this.jsonEnvio.NroClickEnlacePaginaMisCursos =
            this.sitioWeb.NroClickEnlacePaginaMisCursos; //
          this.jsonEnvio.IdOperadorComparacionNroVisitaPaginaCursoDiplomado =
            this.sitioWeb.IdOperadorComparacionNroVisitaPaginaCursoDiplomado;
          this.jsonEnvio.NroVisitaPaginaCursoDiplomado =
            this.sitioWeb.NroVisitaPaginaCursoDiplomado;
          this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionTotalPaginaCursoDiplomado =
            this.sitioWeb.IdOperadorComparacionTiempoVisualizacionTotalPaginaCursoDiplomado;
          this.jsonEnvio.TiempoVisualizacionTotalPaginaCursoDiplomado =
            this.sitioWeb.TiempoVisualizacionTotalPaginaCursoDiplomado;
          this.jsonEnvio.IdOperadorComparacionNroClicksEnlacePaginaCursoDiplomado =
            this.sitioWeb.IdOperadorComparacionNroClicksEnlacePaginaCursoDiplomado;
          this.jsonEnvio.NroClicksEnlacePaginaCursoDiplomado =
            this.sitioWeb.NroClicksEnlacePaginaCursoDiplomado;
          this.jsonEnvio.ConsiderarClickFiltroPaginaCursoDiplomado =
            this.sitioWeb.ConsiderarClickFiltroPaginaCursoDiplomado; //
        }

        if (this.oportunidad != undefined) {
          //- Oportunidades Historicas (15)-//

          this.jsonEnvio.ConsiderarOportunidadHistorica =
            this.oportunidad.datos;
          this.jsonEnvio.ListaProbabilidadOportunidad =
            this.oportunidad.probabilidadEnvio;
          this.jsonEnvio.IdProbabilidadOportunidad =
            this.oportunidad.IdProbabilidadOportunidad;
          this.jsonEnvio.ListaOportunidadActualFaseActual =
            this.oportunidad.faseEnvio1;
          this.jsonEnvio.ListaOportunidadActualFaseMaxima =
            this.oportunidad.faseEnvio;
          this.jsonEnvio.ListaOportunidadInicialFaseActual =
            this.oportunidad.faseEnvio3;
          this.jsonEnvio.ListaOportunidadInicialFaseMaxima =
            this.oportunidad.faseEnvio2;
          this.jsonEnvio.IdOperadorComparacionNroOportunidades =
            this.oportunidad.IdOperadorComparacionNroOportunidades;
          (this.jsonEnvio.IdOperadorComparacionNroSolicitudInformacion =
            this.oportunidad.IdOperadorComparacionNroSolicitudInformacion),
            (this.jsonEnvio.NroOportunidades =
              this.oportunidad.NroOportunidades);
          this.jsonEnvio.NroSolicitudInformacion =
            this.oportunidad.NroSolicitudInformacion;
          (this.jsonEnvio.FechaInicioCreacionUltimaOportunidad =
            this.oportunidad.FechaInicioCreacionUltimaOportunidad),
            (this.jsonEnvio.FechaFinCreacionUltimaOportunidad =
              this.oportunidad.FechaFinCreacionUltimaOportunidad);
          this.jsonEnvio.FechaInicioModificacionUltimaActividadDetalle =
            this.oportunidad.FechaInicioModificacionUltimaActividadDetalle;
          this.jsonEnvio.FechaFinModificacionUltimaActividadDetalle =
            this.oportunidad.FechaFinModificacionUltimaActividadDetalle;

          this.jsonEnvio.EsRn2 = this.oportunidad.EsRn2;
          this.jsonEnvio.FechaInicioProgramacionUltimaActividadDetalleRn2 =
            this.oportunidad.FechaInicioProgramacionUltimaActividadDetalleRn2;
          this.jsonEnvio.FechaFinProgramacionUltimaActividadDetalleRn2 =
            this.oportunidad.FechaFinProgramacionUltimaActividadDetalleRn2;
        }
        if (this.categoriaDato != undefined) {
          //-Categoria Dato (3)-//

          this.jsonEnvio.ConsiderarCategoriaDato = this.categoriaDato.datos;

          this.jsonEnvio.ListaCategoriaOrigen =
            this.categoriaDato.categoriaEnvio;
          this.jsonEnvio.ListaTipoCategoriaOrigen =
            this.categoriaDato.tipoCategoriaEnvio;
        }

        if (this.offlineOnline != undefined) {
          //-- Inter-offline-online (13) -//

          this.jsonEnvio.ConsiderarInteraccionOfflineOnline =
            this.offlineOnline.datos;

          this.jsonEnvio.FechaInicioLlamada =
            this.offlineOnline.FechaInicioLlamada;
          this.jsonEnvio.FechaFinLlamada = this.offlineOnline.FechaFinLlamada;
          this.jsonEnvio.IdOperadorComparacionDuracionPromedioLlamadaPorOportunidad =
            this.offlineOnline.IdOperadorComparacionDuracionPromedioLlamadaPorOportunidad;
          this.jsonEnvio.DuracionPromedioLlamadaPorOportunidad =
            this.offlineOnline.DuracionPromedioLlamadaPorOportunidad;
          this.jsonEnvio.IdOperadorComparacionDuracionTotalLlamadaPorOportunidad =
            this.offlineOnline.IdOperadorComparacionDuracionTotalLlamadaPorOportunidad;
          this.jsonEnvio.DuracionTotalLlamadaPorOportunidad =
            this.offlineOnline.DuracionTotalLlamadaPorOportunidad;
          this.jsonEnvio.IdOperadorComparacionNroLlamada =
            this.offlineOnline.IdOperadorComparacionNroLlamada;
          this.jsonEnvio.NroLlamada = this.offlineOnline.NroLlamada;
          this.jsonEnvio.IdOperadorComparacionDuracionLlamada =
            this.offlineOnline.IdOperadorComparacionDuracionLlamada;
          this.jsonEnvio.DuracionLlamada = this.offlineOnline.DuracionLlamada;
          this.jsonEnvio.IdOperadorComparacionTasaEjecucionLlamada =
            this.offlineOnline.IdOperadorComparacionTasaEjecucionLlamada;
          this.jsonEnvio.TasaEjecucionLlamada =
            this.offlineOnline.TasaEjecucionLlamada;

          this.jsonEnvio.ListaActividadCabecera =
            this.offlineOnline.actividadesEnvio;
        }

        if (this.formularios != undefined) {
          //- Formulario (5) -//

          this.jsonEnvio.ConsiderarInteraccionFormularios =
            this.formularios.datos;

          this.jsonEnvio.ListaTipoFormulario = this.formularios.formularioEnvio;
          this.jsonEnvio.ListaTipoInteraccionFormulario =
            this.formularios.tipoInteraccionEnvio;

          this.jsonEnvio.FechaInicioFormulario =
            this.formularios.FechaInicioFormulario;
          this.jsonEnvio.FechaFinFormulario =
            this.formularios.FechaFinFormulario;
        }

        if (this.chatPortal != undefined) {
          //- Inter-chat-portal.web (11)-//

          this.jsonEnvio.ConsiderarInteraccionChatPw = this.chatPortal.datos;

          this.jsonEnvio.FechaInicioChatIntegra =
            this.chatPortal.FechaInicioChatIntegra;
          this.jsonEnvio.FechaFinChatIntegra =
            this.chatPortal.FechaFinChatIntegra;
          this.jsonEnvio.IdOperadorComparacionTiempoMaximoRespuestaChatOnline =
            this.chatPortal.IdOperadorComparacionTiempoMaximoRespuestaChatOnline;
          this.jsonEnvio.TiempoMaximoRespuestaChatOnline =
            this.chatPortal.TiempoMaximoRespuestaChatOnline;
          this.jsonEnvio.IdOperadorComparacionNroPalabrasClienteChatOnline =
            this.chatPortal.IdOperadorComparacionNroPalabrasClienteChatOnline;
          this.jsonEnvio.NroPalabrasClienteChatOnline =
            this.chatPortal.NroPalabrasClienteChatOnline;
          this.jsonEnvio.IdOperadorComparacionTiempoPromedioRespuestaChatOnline =
            this.chatPortal.IdOperadorComparacionTiempoPromedioRespuestaChatOnline;
          this.jsonEnvio.TiempoPromedioRespuestaChatOnline =
            this.chatPortal.TiempoPromedioRespuestaChatOnline;
          this.jsonEnvio.IdOperadorComparacionNroPalabrasClienteChatOffline =
            this.chatPortal.IdOperadorComparacionNroPalabrasClienteChatOffline;
          this.jsonEnvio.NroPalabrasClienteChatOffline =
            this.chatPortal.NroPalabrasClienteChatOffline;
        }

        if (this.correo != undefined) {
          //- Inter-correo (20) -//

          this.jsonEnvio.ConsiderarInteraccionCorreo = this.correo.datos;

          this.jsonEnvio.FechaInicioCorreo = this.correo.FechaInicioCorreo;
          this.jsonEnvio.FechaFinCorreo = this.correo.FechaFinCorreo;
          this.jsonEnvio.EsSuscribirme = this.correo.EsSuscribirme;
          this.jsonEnvio.EsDesuscribirme = this.correo.EsDesuscribirme;

          this.jsonEnvio.IdOperadorComparacionNroCorreosAbiertos =
            this.correo.IdOperadorComparacionNroCorreosAbiertos;
          this.jsonEnvio.NroCorreosAbiertos = this.correo.NroCorreosAbiertos;
          this.jsonEnvio.IdOperadorComparacionNroCorreosNoAbiertos =
            this.correo.IdOperadorComparacionNroCorreosNoAbiertos;
          this.jsonEnvio.NroCorreosNoAbiertos =
            this.correo.NroCorreosNoAbiertos;
          this.jsonEnvio.IdOperadorComparacionNroClicksEnlace =
            this.correo.IdOperadorComparacionNroClicksEnlace;
          this.jsonEnvio.NroClicksEnlace = this.correo.NroClicksEnlace;

          this.jsonEnvio.IdOperadorComparacionNroCorreosAbiertosMailChimp =
            this.correo.IdOperadorComparacionNroCorreosAbiertosMailChimp;
          this.jsonEnvio.NroCorreosAbiertosMailChimp =
            this.correo.NroCorreosAbiertosMailChimp;
          this.jsonEnvio.IdOperadorComparacionNroCorreosNoAbiertosMailChimp =
            this.correo.IdOperadorComparacionNroCorreosNoAbiertosMailChimp;
          this.jsonEnvio.NroCorreosNoAbiertosMailChimp =
            this.correo.NroCorreosNoAbiertosMailChimp;
          this.jsonEnvio.IdOperadorComparacionNroClicksEnlaceMailChimp =
            this.correo.IdOperadorComparacionNroClicksEnlaceMailChimp;
          this.jsonEnvio.NroClicksEnlaceMailChimp =
            this.correo.NroClicksEnlaceMailChimp;

          this.jsonEnvio.ExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal =
            this.correo.ExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal;
          this.jsonEnvio.FechaInicioExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal =
            this.correo.FechaInicioExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal;
          this.jsonEnvio.FechaFinExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal =
            this.correo.FechaFinExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal;
        }

        if (this.historial != undefined) {
          //-Hitorial-fin (11)-//

          this.jsonEnvio.ConsiderarHistorialFinanciero = this.historial.datos;

          this.jsonEnvio.IdOperadorComparacionNroTotalLineaCreditoVigente =
            this.historial.IdOperadorComparacionNroTotalLineaCreditoVigente;
          this.jsonEnvio.NroTotalLineaCreditoVigente =
            this.historial.NroTotalLineaCreditoVigente;
          this.jsonEnvio.IdOperadorComparacionMontoTotalLineaCreditoVigente =
            this.historial.IdOperadorComparacionMontoTotalLineaCreditoVigente;
          this.jsonEnvio.MontoTotalLineaCreditoVigente =
            this.historial.MontoTotalLineaCreditoVigente;
          this.jsonEnvio.IdOperadorComparacionMontoMaximoOtorgadoLineaCreditoVigente =
            this.historial.IdOperadorComparacionMontoMaximoOtorgadoLineaCreditoVigente;
          this.jsonEnvio.MontoMaximoOtorgadoLineaCreditoVigente =
            this.historial.MontoMaximoOtorgadoLineaCreditoVigente;
          this.jsonEnvio.IdOperadorComparacionMontoMinimoOtorgadoLineaCreditoVigente =
            this.historial.IdOperadorComparacionMontoMinimoOtorgadoLineaCreditoVigente;
          this.jsonEnvio.MontoMinimoOtorgadoLineaCreditoVigente =
            this.historial.MontoMinimoOtorgadoLineaCreditoVigente;

          this.jsonEnvio.MontoDisponibleTotalEnTcs =
            this.historial.MontoDisponibleTotalEnTcs;
          this.jsonEnvio.IdOperadorComparacionMontoDisponibleTotalEnTcs =
            this.historial.IdOperadorComparacionMontoDisponibleTotalEnTcs;
        }

        if (this.ventaCruzada != undefined) {
          //- Venta Cruzada (11) -//

          this.jsonEnvio.TieneVentaCruzada = this.ventaCruzada.datos;

          this.jsonEnvio.IdOperadorComparacionNroSolicitudInformacionPg =
            this.ventaCruzada.IdOperadorComparacionNroSolicitudInformacionPg;
          this.jsonEnvio.NroSolicitudInformacionPg =
            this.ventaCruzada.NroSolicitudInformacionPg;
          this.jsonEnvio.IdOperadorComparacionNroSolicitudInformacionArea =
            this.ventaCruzada.IdOperadorComparacionNroSolicitudInformacionArea;
          this.jsonEnvio.NroSolicitudInformacionArea =
            this.ventaCruzada.NroSolicitudInformacionArea;
          this.jsonEnvio.IdOperadorComparacionNroSolicitudInformacionSubArea =
            this.ventaCruzada.IdOperadorComparacionNroSolicitudInformacionSubArea;
          this.jsonEnvio.NroSolicitudInformacionSubArea =
            this.ventaCruzada.NroSolicitudInformacionSubArea;

          this.jsonEnvio.ListaVCArea = this.ventaCruzada.areaVCEnvio;
          this.jsonEnvio.ListaVCSubArea = this.ventaCruzada.subareaVCEnvio;
          this.jsonEnvio.ListaVCPGeneral = this.ventaCruzada.programaVCEnvio;

          this.jsonEnvio.ListaProbabilidadVentaCruzada =
            this.ventaCruzada.probabilidadEnvio;
        }

        if (this.gestionFechas != undefined) {
          //-Gestion de fechas (4) -//

          this.jsonEnvio.IdTiempoFrecuenciaMatriculaAlumno =
            this.gestionFechas.tiempo;
          this.jsonEnvio.CantidadTiempoMatriculaAlumno =
            this.gestionFechas.cantidad;
          this.jsonEnvio.FechaInicioMatriculaAlumno =
            this.gestionFechas.FechaInicioMatriculaAlumno;
          this.jsonEnvio.FechaFinMatriculaAlumno =
            this.gestionFechas.FechaFinMatriculaAlumno;
        }

        if (this.metodoContacto) {
          //- Metodos de Contacto (3)-//

          this.jsonEnvio.ConsiderarConMessengerValido =
            this.metodoContacto.messenger;
          this.jsonEnvio.ConsiderarConWhatsAppValido =
            this.metodoContacto.whats;
          this.jsonEnvio.ConsiderarConEmailValido =
            this.metodoContacto.emailvalido;
        }

        if (this.cumpleanios) {
          //- Cumpleaños (2)-//

          this.jsonEnvio.IdTiempoFrecuenciaCumpleaniosContactoDentroDe =
            this.cumpleanios.tiempo;
          this.jsonEnvio.CantidadTiempoCumpleaniosContactoDentroDe =
            this.cumpleanios.cantidad;
        }

        if (this.envioAutomatico) {
          //- Envio Automatico (3)-//

          this.jsonEnvio.ConsiderarEnvioAutomatico = this.envioAutomatico.datos;
          this.jsonEnvio.AplicaSobreCreacionOportunidad =
            this.envioAutomatico.aplicaHora;
          this.jsonEnvio.AplicaSobreUltimaActividad =
            this.envioAutomatico.aplicaUltima;
          this.jsonEnvio.ListaEnvioAutomaticoOportunidadFaseActual =
            this.envioAutomatico.enviarFases;
        }

        if (this.perfiles != undefined) {
          //- Perfiles (4) -//

          this.jsonEnvio.ListaCargo = this.perfiles.cargoEnviar;
          this.jsonEnvio.ListaIndustria = this.perfiles.industriaEnviar;
          this.jsonEnvio.ListaAreaFormacion = this.perfiles.areaFormacionEnviar;
          this.jsonEnvio.ListaAreaTrabajo = this.perfiles.areaTrabajoEnviar;
        }

        if (this.trabajoAlumno != undefined) {
          //-Trabajo Alumno (2)-//

          this.jsonEnvio.ListaTrabajoAlumno = this.trabajoAlumno.dataSourceEP;
          this.jsonEnvio.ListaTrabajoAlumnoFinal =
            this.trabajoAlumno.dataSourceEPFinal;
        }

        if (this.documentos != undefined) {
          //- Documentos (1) -//

          this.jsonEnvio.ListaDocumentoAlumno = this.documentos.documentosEnvio;
        }

        if (this.tarifario != undefined) {
          //- Tarifario (1)-//

          this.jsonEnvio.ListaTarifario = this.tarifario.tarifariosEnvio;
        }

        if (this.webinar != undefined) {
          //- Webinar (1) -//

          this.jsonEnvio.ListaSesionWebinar = this.webinar.dataSourceEP;
        }

        if (this.paisYCiudad != undefined) {
          //- Pais y Ciudad (2) -//

          this.jsonEnvio.ListaPais = this.paisYCiudad.paisesEnvio;
          this.jsonEnvio.ListaCiudad = this.paisYCiudad.ciudadEnvio;
        }

        if (this.pagos != undefined) {
          //- Pagos (1)-//

          this.jsonEnvio.ListaEstadoPago = this.pagos.dataSourceEP;
        }

        if (this.avanceAcademico != undefined) {
          //- Porcentaje Avance (1)-//

          this.jsonEnvio.ListaPorcentajeAvance =
            this.avanceAcademico.dataSourceEP;
        }

        if (this.estadoAvance != undefined) {
          //- Estado Avance (1)-//

          this.jsonEnvio.ListaEstadoAcademico = this.estadoAvance.dataSourceEP;
        }

        if (this.llamadas != undefined) {
          //- Llamadas (3)-//

          this.jsonEnvio.ListaEstadoLlamada = this.llamadas.dataSourceEP;

          this.jsonEnvio.ListaActividadLlamada = this.llamadas.actividadEnvio;
          this.jsonEnvio.ListaOcurrencia = this.llamadas.ocurrenciaEnvio;
        }

        if (this.sesion != undefined) {
          //- Sesion (1)-//

          this.jsonEnvio.ListaSesion = this.sesion.dataSourceEP;
        }

        this.jsonEnvio.NombreUsuario = '';

        console.log(this.jsonEnvio);

        this.integraService
          .postJsonResponse(
            constApiMarketing.FiltroSegmentoInsertar,
            this.jsonEnvio
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {},

            error: (error) => {
              this.alertaService.mensajeError(error);
              this.loader = false;
            },

            complete: () => {
              this.alertaService.mensajeExitoso();
              this.alertaService.mensajeIcon(
                'Aviso',
                'La lista se agrego correctamente',
                'success'
              );
              this.estado = true;
              this.dialogRef.close(true);
              this.loader = false;
            },
          });
      }
    }
  }

  Actualizar() {
    this.loader = true;
    this.jsonEnvio.Id = this.data[2];

    // - Filtro Principal (10) -//
    this.jsonEnvio.IdFiltroSegmentoTipoContacto = this.data[0];
    this.jsonEnvio.Nombre = this.Nombre;
    this.jsonEnvio.Descripcion = this.Descripcion;
    this.jsonEnvio.ConsiderarFiltroGeneral = this.ConsiderarFiltroGeneral;
    this.jsonEnvio.ConsiderarFiltroEspecifico = this.ConsiderarFiltroEspecifico;
    this.jsonEnvio.ConsiderarAlumnosAsignacionAutomaticaOperaciones =
      this.ConsiderarAlumnosAsignacionAutomaticaOperaciones;

    this.jsonEnvio.ExcluirMatriculados = this.ExcluirMatriculados;

    this.jsonEnvio.ListaEstadoMatricula =
      this.estadoEnvio == undefined ? [] : this.estadoEnvio;
    this.jsonEnvio.ListaSubEstadoMatricula =
      this.subEstadoEnvio == undefined ? [] : this.subEstadoEnvio;
    this.jsonEnvio.ListaModalidadCurso =
      this.modalidadEnvio == undefined ? [] : this.modalidadEnvio;

    this.jsonEnvio.ListaArea = this.areaEnvio;
    this.jsonEnvio.ListaSubArea = this.subAreaEnvio;
    this.jsonEnvio.ListaProgramaGeneral = this.programaEnvio;
    this.jsonEnvio.ListaProgramaEspecifico = this.programaEEnvio;
    this.jsonEnvio.ListaExcluirPorFiltroSegmento = this.filtroEnvio;

    //- Inter-offline-sitioweb (39) -//

    if (this.sitioWeb != undefined) {
      this.jsonEnvio.ConsiderarInteraccionSitioWeb =
        this.sitioWeb.datos == undefined ? false : this.sitioWeb.datos;

      this.jsonEnvio.FechaInicioInteraccionSitioWeb =
        this.sitioWeb.FechaInicioInteraccionSitioWeb;
      this.jsonEnvio.FechaFinInteraccionSitioWeb =
        this.sitioWeb.FechaFinInteraccionSitioWeb;
      this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionTotalSitioWeb =
        this.sitioWeb.IdOperadorComparacionTiempoVisualizacionTotalSitioWeb;
      this.jsonEnvio.TiempoVisualizacionTotalSitioWeb =
        this.sitioWeb.TiempoVisualizacionTotalSitioWeb;
      this.jsonEnvio.IdOperadorComparacionNroClickEnlaceTodoSitioWeb =
        this.sitioWeb.IdOperadorComparacionNroClickEnlaceTodoSitioWeb;
      this.jsonEnvio.NroClickEnlaceTodoSitioWeb =
        this.sitioWeb.NroClickEnlaceTodoSitioWeb;
      this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionTotalPaginaPrograma =
        this.sitioWeb.IdOperadorComparacionTiempoVisualizacionTotalPaginaPrograma;
      this.jsonEnvio.TiempoVisualizacionTotalPaginaPrograma =
        this.sitioWeb.TiempoVisualizacionTotalPaginaPrograma;
      this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas =
        this.sitioWeb.IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas;
      this.jsonEnvio.TiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas =
        this.sitioWeb.TiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas;
      this.jsonEnvio.IdOperadorComparacionNroClickEnlacePaginaPrograma =
        this.sitioWeb.IdOperadorComparacionNroClickEnlacePaginaPrograma;
      this.jsonEnvio.NroClickEnlacePaginaPrograma =
        this.sitioWeb.NroClickEnlacePaginaPrograma;
      this.jsonEnvio.ConsiderarVisualizacionVideoVistaPreviaPaginaPrograma =
        this.sitioWeb.ConsiderarVisualizacionVideoVistaPreviaPaginaPrograma;
      this.jsonEnvio.ConsiderarClickBotonMatricularmePaginaPrograma =
        this.sitioWeb.ConsiderarClickBotonMatricularmePaginaPrograma;
      this.jsonEnvio.ConsiderarClickBotonVersionPruebaPaginaPrograma =
        this.sitioWeb.ConsiderarClickBotonVersionPruebaPaginaPrograma; //
      this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionTotalPaginaBscampus =
        this.sitioWeb.IdOperadorComparacionTiempoVisualizacionTotalPaginaBscampus;
      this.jsonEnvio.TiempoVisualizacionTotalPaginaBscampus =
        this.sitioWeb.TiempoVisualizacionTotalPaginaBscampus;
      this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus =
        this.sitioWeb.IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus;
      this.jsonEnvio.TiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus =
        this.sitioWeb.TiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus; //
      this.jsonEnvio.IdOperadorComparacionNroVisitasDirectorioTagAreaSubArea =
        this.sitioWeb.IdOperadorComparacionNroVisitasDirectorioTagAreaSubArea;
      this.jsonEnvio.NroVisitasDirectorioTagAreaSubArea =
        this.sitioWeb.NroVisitasDirectorioTagAreaSubArea;
      this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionTotalDirectorioTagAreaSubArea =
        this.sitioWeb.IdOperadorComparacionTiempoVisualizacionTotalDirectorioTagAreaSubArea;
      this.jsonEnvio.TiempoVisualizacionTotalDirectorioTagAreaSubArea =
        this.sitioWeb.TiempoVisualizacionTotalDirectorioTagAreaSubArea;
      this.jsonEnvio.IdOperadorComparacionNroClickEnlaceDirectorioTagAreaSubArea =
        this.sitioWeb.IdOperadorComparacionNroClickEnlaceDirectorioTagAreaSubArea;
      this.jsonEnvio.NroClickEnlaceDirectorioTagAreaSubArea =
        this.sitioWeb.NroClickEnlaceDirectorioTagAreaSubArea; //
      this.jsonEnvio.IdOperadorComparacionNroVisitasPaginaMisCursos =
        this.sitioWeb.IdOperadorComparacionNroVisitasPaginaMisCursos;
      this.jsonEnvio.NroVisitasPaginaMisCursos =
        this.sitioWeb.NroVisitasPaginaMisCursos;
      this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionTotalPaginaMisCursos =
        this.sitioWeb.IdOperadorComparacionTiempoVisualizacionTotalPaginaMisCursos;
      this.jsonEnvio.TiempoVisualizacionTotalPaginaMisCursos =
        this.sitioWeb.TiempoVisualizacionTotalPaginaMisCursos;
      this.jsonEnvio.IdOperadorComparacionNroClickEnlacePaginaMisCursos =
        this.sitioWeb.IdOperadorComparacionNroClickEnlacePaginaMisCursos;
      this.jsonEnvio.NroClickEnlacePaginaMisCursos =
        this.sitioWeb.NroClickEnlacePaginaMisCursos; //
      this.jsonEnvio.IdOperadorComparacionNroVisitaPaginaCursoDiplomado =
        this.sitioWeb.IdOperadorComparacionNroVisitaPaginaCursoDiplomado;
      this.jsonEnvio.NroVisitaPaginaCursoDiplomado =
        this.sitioWeb.NroVisitaPaginaCursoDiplomado;
      this.jsonEnvio.IdOperadorComparacionTiempoVisualizacionTotalPaginaCursoDiplomado =
        this.sitioWeb.IdOperadorComparacionTiempoVisualizacionTotalPaginaCursoDiplomado;
      this.jsonEnvio.TiempoVisualizacionTotalPaginaCursoDiplomado =
        this.sitioWeb.TiempoVisualizacionTotalPaginaCursoDiplomado;
      this.jsonEnvio.IdOperadorComparacionNroClicksEnlacePaginaCursoDiplomado =
        this.sitioWeb.IdOperadorComparacionNroClicksEnlacePaginaCursoDiplomado;
      this.jsonEnvio.NroClicksEnlacePaginaCursoDiplomado =
        this.sitioWeb.NroClicksEnlacePaginaCursoDiplomado;
      this.jsonEnvio.ConsiderarClickFiltroPaginaCursoDiplomado =
        this.sitioWeb.ConsiderarClickFiltroPaginaCursoDiplomado; //
    }

    if (this.oportunidad != undefined) {
      //- Oportunidades Historicas (15)-//

      this.jsonEnvio.ConsiderarOportunidadHistorica = this.oportunidad.datos;
      this.jsonEnvio.ListaProbabilidadOportunidad =
        this.oportunidad.probabilidadEnvio;
      this.jsonEnvio.IdProbabilidadOportunidad =
        this.oportunidad.IdProbabilidadOportunidad;
      this.jsonEnvio.ListaOportunidadActualFaseActual =
        this.oportunidad.faseEnvio1;
      this.jsonEnvio.ListaOportunidadActualFaseMaxima =
        this.oportunidad.faseEnvio;
      this.jsonEnvio.ListaOportunidadInicialFaseActual =
        this.oportunidad.faseEnvio3;
      this.jsonEnvio.ListaOportunidadInicialFaseMaxima =
        this.oportunidad.faseEnvio2;
      this.jsonEnvio.IdOperadorComparacionNroOportunidades =
        this.oportunidad.IdOperadorComparacionNroOportunidades;
      (this.jsonEnvio.IdOperadorComparacionNroSolicitudInformacion =
        this.oportunidad.IdOperadorComparacionNroSolicitudInformacion),
        (this.jsonEnvio.NroOportunidades = this.oportunidad.NroOportunidades);
      this.jsonEnvio.NroSolicitudInformacion =
        this.oportunidad.NroSolicitudInformacion;
      (this.jsonEnvio.FechaInicioCreacionUltimaOportunidad =
        this.oportunidad.FechaInicioCreacionUltimaOportunidad),
        (this.jsonEnvio.FechaFinCreacionUltimaOportunidad =
          this.oportunidad.FechaFinCreacionUltimaOportunidad);
      this.jsonEnvio.FechaInicioModificacionUltimaActividadDetalle =
        this.oportunidad.FechaInicioModificacionUltimaActividadDetalle;
      this.jsonEnvio.FechaFinModificacionUltimaActividadDetalle =
        this.oportunidad.FechaFinModificacionUltimaActividadDetalle;

      this.jsonEnvio.EsRn2 = this.oportunidad.EsRn2;
      this.jsonEnvio.FechaInicioProgramacionUltimaActividadDetalleRn2 =
        this.oportunidad.FechaInicioProgramacionUltimaActividadDetalleRn2;
      this.jsonEnvio.FechaFinProgramacionUltimaActividadDetalleRn2 =
        this.oportunidad.FechaFinProgramacionUltimaActividadDetalleRn2;
    }
    if (this.categoriaDato != undefined) {
      //-Categoria Dato (3)-//

      this.jsonEnvio.ConsiderarCategoriaDato = this.categoriaDato.datos;
      this.jsonEnvio.ListaTipoCategoriaOrigen =
        this.categoriaDato.tipoCategoriaEnvio;
      this.jsonEnvio.ListaCategoriaOrigen = this.categoriaDato.categoriaEnvio;
    }

    if (this.offlineOnline != undefined) {
      //-- Inter-offline-online (13) -//

      this.jsonEnvio.ConsiderarInteraccionOfflineOnline =
        this.offlineOnline.datos;

      this.jsonEnvio.FechaInicioLlamada = this.offlineOnline.FechaInicioLlamada;
      this.jsonEnvio.FechaFinLlamada = this.offlineOnline.FechaFinLlamada;
      this.jsonEnvio.IdOperadorComparacionDuracionPromedioLlamadaPorOportunidad =
        this.offlineOnline.IdOperadorComparacionDuracionPromedioLlamadaPorOportunidad;
      this.jsonEnvio.DuracionPromedioLlamadaPorOportunidad =
        this.offlineOnline.DuracionPromedioLlamadaPorOportunidad;
      this.jsonEnvio.IdOperadorComparacionDuracionTotalLlamadaPorOportunidad =
        this.offlineOnline.IdOperadorComparacionDuracionTotalLlamadaPorOportunidad;
      this.jsonEnvio.DuracionTotalLlamadaPorOportunidad =
        this.offlineOnline.DuracionTotalLlamadaPorOportunidad;
      this.jsonEnvio.IdOperadorComparacionNroLlamada =
        this.offlineOnline.IdOperadorComparacionNroLlamada;
      this.jsonEnvio.NroLlamada = this.offlineOnline.NroLlamada;
      this.jsonEnvio.IdOperadorComparacionDuracionLlamada =
        this.offlineOnline.IdOperadorComparacionDuracionLlamada;
      this.jsonEnvio.DuracionLlamada = this.offlineOnline.DuracionLlamada;
      this.jsonEnvio.IdOperadorComparacionTasaEjecucionLlamada =
        this.offlineOnline.IdOperadorComparacionTasaEjecucionLlamada;
      this.jsonEnvio.TasaEjecucionLlamada =
        this.offlineOnline.TasaEjecucionLlamada;

      this.jsonEnvio.ListaActividadCabecera =
        this.offlineOnline.actividadesEnvio;
    }

    if (this.formularios != undefined) {
      //- Formulario (5) -//

      this.jsonEnvio.ConsiderarInteraccionFormularios = this.formularios.datos;

      this.jsonEnvio.ListaTipoFormulario = this.formularios.formularioEnvio;
      this.jsonEnvio.ListaTipoInteraccionFormulario =
        this.formularios.tipoInteraccionEnvio;

      this.jsonEnvio.FechaInicioFormulario =
        this.formularios.FechaInicioFormulario;
      this.jsonEnvio.FechaFinFormulario = this.formularios.FechaFinFormulario;
    }

    if (this.chatPortal != undefined) {
      //- Inter-chat-portal.web (11)-//

      this.jsonEnvio.ConsiderarInteraccionChatPw = this.chatPortal.datos;

      this.jsonEnvio.FechaInicioChatIntegra =
        this.chatPortal.FechaInicioChatIntegra;
      this.jsonEnvio.FechaFinChatIntegra = this.chatPortal.FechaFinChatIntegra;
      this.jsonEnvio.IdOperadorComparacionTiempoMaximoRespuestaChatOnline =
        this.chatPortal.IdOperadorComparacionTiempoMaximoRespuestaChatOnline;
      this.jsonEnvio.TiempoMaximoRespuestaChatOnline =
        this.chatPortal.TiempoMaximoRespuestaChatOnline;
      this.jsonEnvio.IdOperadorComparacionNroPalabrasClienteChatOnline =
        this.chatPortal.IdOperadorComparacionNroPalabrasClienteChatOnline;
      this.jsonEnvio.NroPalabrasClienteChatOnline =
        this.chatPortal.NroPalabrasClienteChatOnline;
      this.jsonEnvio.IdOperadorComparacionTiempoPromedioRespuestaChatOnline =
        this.chatPortal.IdOperadorComparacionTiempoPromedioRespuestaChatOnline;
      this.jsonEnvio.TiempoPromedioRespuestaChatOnline =
        this.chatPortal.TiempoPromedioRespuestaChatOnline;
      this.jsonEnvio.IdOperadorComparacionNroPalabrasClienteChatOffline =
        this.chatPortal.IdOperadorComparacionNroPalabrasClienteChatOffline;
      this.jsonEnvio.NroPalabrasClienteChatOffline =
        this.chatPortal.NroPalabrasClienteChatOffline;
    }

    if (this.correo != undefined) {
      //- Inter-correo (20) -//

      this.jsonEnvio.ConsiderarInteraccionCorreo = this.correo.datos;

      this.jsonEnvio.FechaInicioCorreo = this.correo.FechaInicioCorreo;
      this.jsonEnvio.FechaFinCorreo = this.correo.FechaFinCorreo;
      this.jsonEnvio.EsSuscribirme = this.correo.EsSuscribirme;
      this.jsonEnvio.EsDesuscribirme = this.correo.EsDesuscribirme;

      this.jsonEnvio.IdOperadorComparacionNroCorreosAbiertos =
        this.correo.IdOperadorComparacionNroCorreosAbiertos;
      this.jsonEnvio.NroCorreosAbiertos = this.correo.NroCorreosAbiertos;
      this.jsonEnvio.IdOperadorComparacionNroCorreosNoAbiertos =
        this.correo.IdOperadorComparacionNroCorreosNoAbiertos;
      this.jsonEnvio.NroCorreosNoAbiertos = this.correo.NroCorreosNoAbiertos;
      this.jsonEnvio.IdOperadorComparacionNroClicksEnlace =
        this.correo.IdOperadorComparacionNroClicksEnlace;
      this.jsonEnvio.NroClicksEnlace = this.correo.NroClicksEnlace;

      this.jsonEnvio.IdOperadorComparacionNroCorreosAbiertosMailChimp =
        this.correo.IdOperadorComparacionNroCorreosAbiertosMailChimp;
      this.jsonEnvio.NroCorreosAbiertosMailChimp =
        this.correo.NroCorreosAbiertosMailChimp;
      this.jsonEnvio.IdOperadorComparacionNroCorreosNoAbiertosMailChimp =
        this.correo.IdOperadorComparacionNroCorreosNoAbiertosMailChimp;
      this.jsonEnvio.NroCorreosNoAbiertosMailChimp =
        this.correo.NroCorreosNoAbiertosMailChimp;
      this.jsonEnvio.IdOperadorComparacionNroClicksEnlaceMailChimp =
        this.correo.IdOperadorComparacionNroClicksEnlaceMailChimp;
      this.jsonEnvio.NroClicksEnlaceMailChimp =
        this.correo.NroClicksEnlaceMailChimp;

      this.jsonEnvio.ExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal =
        this.correo.ExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal;
      this.jsonEnvio.FechaInicioExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal =
        this.correo.FechaInicioExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal;
      this.jsonEnvio.FechaFinExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal =
        this.correo.FechaFinExcluirPorCorreoEnviadoMismoProgramaGeneralPrincipal;
    }

    if (this.historial != undefined) {
      //-Hitorial-fin (11)-//

      this.jsonEnvio.ConsiderarHistorialFinanciero = this.historial.datos;

      this.jsonEnvio.IdOperadorComparacionNroTotalLineaCreditoVigente =
        this.historial.IdOperadorComparacionNroTotalLineaCreditoVigente;
      this.jsonEnvio.NroTotalLineaCreditoVigente =
        this.historial.NroTotalLineaCreditoVigente;
      this.jsonEnvio.IdOperadorComparacionMontoTotalLineaCreditoVigente =
        this.historial.IdOperadorComparacionMontoTotalLineaCreditoVigente;
      this.jsonEnvio.MontoTotalLineaCreditoVigente =
        this.historial.MontoTotalLineaCreditoVigente;
      this.jsonEnvio.IdOperadorComparacionMontoMaximoOtorgadoLineaCreditoVigente =
        this.historial.IdOperadorComparacionMontoMaximoOtorgadoLineaCreditoVigente;
      this.jsonEnvio.MontoMaximoOtorgadoLineaCreditoVigente =
        this.historial.MontoMaximoOtorgadoLineaCreditoVigente;
      this.jsonEnvio.IdOperadorComparacionMontoMinimoOtorgadoLineaCreditoVigente =
        this.historial.IdOperadorComparacionMontoMinimoOtorgadoLineaCreditoVigente;
      this.jsonEnvio.MontoMinimoOtorgadoLineaCreditoVigente =
        this.historial.MontoMinimoOtorgadoLineaCreditoVigente;

      this.jsonEnvio.MontoDisponibleTotalEnTcs =
        this.historial.MontoDisponibleTotalEnTcs;
      this.jsonEnvio.IdOperadorComparacionMontoDisponibleTotalEnTcs =
        this.historial.IdOperadorComparacionMontoDisponibleTotalEnTcs;
    }

    if (this.ventaCruzada != undefined) {
      //- Venta Cruzada (11) -//

      this.jsonEnvio.TieneVentaCruzada = this.ventaCruzada.datos;

      this.jsonEnvio.IdOperadorComparacionNroSolicitudInformacionPg =
        this.ventaCruzada.IdOperadorComparacionNroSolicitudInformacionPg;
      this.jsonEnvio.NroSolicitudInformacionPg =
        this.ventaCruzada.NroSolicitudInformacionPg;
      this.jsonEnvio.IdOperadorComparacionNroSolicitudInformacionArea =
        this.ventaCruzada.IdOperadorComparacionNroSolicitudInformacionArea;
      this.jsonEnvio.NroSolicitudInformacionArea =
        this.ventaCruzada.NroSolicitudInformacionArea;
      this.jsonEnvio.IdOperadorComparacionNroSolicitudInformacionSubArea =
        this.ventaCruzada.IdOperadorComparacionNroSolicitudInformacionSubArea;
      this.jsonEnvio.NroSolicitudInformacionSubArea =
        this.ventaCruzada.NroSolicitudInformacionSubArea;

      this.jsonEnvio.ListaVCArea = this.ventaCruzada.areaVCEnvio;
      this.jsonEnvio.ListaVCSubArea = this.ventaCruzada.subareaVCEnvio;
      this.jsonEnvio.ListaVCPGeneral = this.ventaCruzada.programaVCEnvio;

      this.jsonEnvio.ListaProbabilidadVentaCruzada =
        this.ventaCruzada.probabilidadEnvio;
    }

    if (this.gestionFechas != undefined) {
      //-Gestion de fechas (4) -//

      this.jsonEnvio.IdTiempoFrecuenciaMatriculaAlumno =
        this.gestionFechas.tiempo;
      this.jsonEnvio.CantidadTiempoMatriculaAlumno =
        this.gestionFechas.cantidad;
      this.jsonEnvio.FechaInicioMatriculaAlumno =
        this.gestionFechas.FechaInicioMatriculaAlumno;
      this.jsonEnvio.FechaFinMatriculaAlumno =
        this.gestionFechas.FechaFinMatriculaAlumno;
    }

    if (this.metodoContacto) {
      //- Metodos de Contacto (3)-//

      this.jsonEnvio.ConsiderarConMessengerValido =
        this.metodoContacto.messenger;
      this.jsonEnvio.ConsiderarConWhatsAppValido = this.metodoContacto.whats;
      this.jsonEnvio.ConsiderarConEmailValido = this.metodoContacto.emailvalido;
    }

    if (this.cumpleanios) {
      //- Cumpleaños (2)-//

      this.jsonEnvio.IdTiempoFrecuenciaCumpleaniosContactoDentroDe =
        this.cumpleanios.tiempo;
      this.jsonEnvio.CantidadTiempoCumpleaniosContactoDentroDe =
        this.cumpleanios.cantidad;
    }

    if (this.envioAutomatico) {
      //- Envio Automatico (3)-//

      this.jsonEnvio.ConsiderarEnvioAutomatico = this.envioAutomatico.datos;
      this.jsonEnvio.AplicaSobreCreacionOportunidad =
        this.envioAutomatico.aplicaHora;
      this.jsonEnvio.AplicaSobreUltimaActividad =
        this.envioAutomatico.aplicaUltima;
      this.jsonEnvio.ListaEnvioAutomaticoOportunidadFaseActual =
        this.envioAutomatico.enviarFases;
    }

    if (this.perfiles != undefined) {
      //- Perfiles (4) -//

      this.jsonEnvio.ListaCargo = this.perfiles.cargoEnviar;
      this.jsonEnvio.ListaIndustria = this.perfiles.industriaEnviar;
      this.jsonEnvio.ListaAreaFormacion = this.perfiles.areaFormacionEnviar;
      this.jsonEnvio.ListaAreaTrabajo = this.perfiles.areaTrabajoEnviar;
    }

    if (this.trabajoAlumno != undefined) {
      //-Trabajo Alumno (2)-//

      this.jsonEnvio.ListaTrabajoAlumno = this.trabajoAlumno.dataSourceEP;
      this.jsonEnvio.ListaTrabajoAlumnoFinal =
        this.trabajoAlumno.dataSourceEPFinal;
    }

    if (this.documentos != undefined) {
      //- Documentos (1) -//

      this.jsonEnvio.ListaDocumentoAlumno = this.documentos.documentosEnvio;
    }

    if (this.tarifario != undefined) {
      //- Tarifario (1)-//

      this.jsonEnvio.ListaTarifario = this.tarifario.tarifariosEnvio;
    }

    if (this.webinar != undefined) {
      //- Webinar (1) -//

      this.jsonEnvio.ListaSesionWebinar = this.webinar.dataSourceEP;
    }

    if (this.paisYCiudad != undefined) {
      //- Pais y Ciudad (2) -//

      this.jsonEnvio.ListaPais = this.paisYCiudad.paisesEnvio;
      this.jsonEnvio.ListaCiudad = this.paisYCiudad.ciudadEnvio;
    }

    if (this.pagos != undefined) {
      //- Pagos (1)-//

      this.jsonEnvio.ListaEstadoPago = this.pagos.dataSourceEP;
    }

    if (this.avanceAcademico != undefined) {
      //- Porcentaje Avance (1)-//

      this.jsonEnvio.ListaPorcentajeAvance = this.avanceAcademico.dataSourceEP;
    }

    if (this.estadoAvance != undefined) {
      //- Estado Avance (1)-//

      this.jsonEnvio.ListaEstadoAcademico = this.estadoAvance.dataSourceEP;
    }

    if (this.llamadas != undefined) {
      //- Llamadas (3)-//

      this.jsonEnvio.ListaEstadoLlamada = this.llamadas.dataSourceEP;

      this.jsonEnvio.ListaActividadLlamada = this.llamadas.actividadEnvio;
      this.jsonEnvio.ListaOcurrencia = this.llamadas.ocurrenciaEnvio;
    }

    if (this.sesion != undefined) {
      //- Sesion (1)-//

      this.jsonEnvio.ListaSesion = this.sesion.dataSourceEP;
    }

    this.jsonEnvio.NombreUsuario = '';

    console.log(this.jsonEnvio);

    this.integraService
      .postJsonResponse(
        constApiMarketing.FilltroSegmentoActualizar,
        this.jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {},

        error: (error) => {
          this.alertaService.mensajeError(error);
        },

        complete: () => {
          this.alertaService.mensajeExitoso();
          this.alertaService.mensajeIcon(
            'Aviso',
            'La lista se actualizo correctamente',
            'success'
          );
          this.estado = true;
          this.dialogRef.close(true);
          this.loader = false;
        },
      });
  }

  Cerrar() {
    this.dialogRef.close();
  }
}

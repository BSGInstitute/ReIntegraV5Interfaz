import { AfterViewInit, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerComponent, DrawerSelectEvent } from '@progress/kendo-angular-layout';

interface Item {
  text: string;
  icon: string;
  expanded: boolean;
  children: boolean;
  selected: boolean;
  level?: number;
}

const items = {
  parents: [
    {
      text: 'COMERCIAL',
      icon: 'k-i-globe',
      expanded: false,
      children: true,
      selected: false,
    },
    {
      text: 'PLANIFICACION Y OPERACIONES',
      icon: 'k-i-track-changes-accept',
      expanded: false,
      children: true,
      selected: false,
    },
    {
      text: 'MARKETING',
      icon: 'k-i-share',
      expanded: false,
      children: true,
      selected: false,
    },
    {
      text: 'FINANZAS',
      icon: 'k-i-dollar',
      expanded: false,
      children: true,
      selected: false,
    },
    {
      text: 'GESTION DE PERSONAS',
      icon: 'k-i-myspace',
      expanded: false,
      children: true,
      selected: false,
    },
    {
      text: 'ATENCION AL CLIENTE',
      icon: 'k-i-track-changes-accept',
      expanded: false,
      children: true,
      selected: false,
    },
  ],

  comercialChild: [
    {
      text: 'Gestion Comercial',
      icon: 'k-i-arrow-60-right',
      children: true,
      selected: true,
      expanded: false,
      level: 1,
    },
    {
      text: 'Analítica de Ventas',
      icon: 'k-i-arrow-60-right',
      children: true,
      selected: true,
      expanded: false,
      level: 1,
    },
    {
      text: 'Configuraciones',
      icon: 'k-i-arrow-60-right',
      children: true,
      selected: true,
      expanded: false,
      level: 1,
    },
    {
      text: 'Area Trabajo',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Planificacion/AreaTrabajo',
    },
    {
      text: 'AgendaTab',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Planificacion/AgendaTab',
    },
    {
      text: 'Ciudad',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Planificacion/Ciudad',
    },
    {
      text: 'gestionPersonas',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'GestionPersonas/personal',
    },
  ],

  planificacionOpChild: [
    {
      text: 'Maestros OP y PL',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },
    {
      text: 'Reportes',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },
  ],
  marketingChild: [
    {
      text: 'Maestros Marketing',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },
    {
      text: 'Configuraciones Marketing',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },

    {
      text: 'Reportes',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },

    {
      text: 'Configuraciones Marketing',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },
    {
      text: 'Gestion de Oportunidades',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },

  ],
  finanzasChild: [
    {
      text: 'Maestros Finanzas',
      icon: 'k-i-arrow-60-right',
      selected: true,
      expanded: false,
      children: true,
      level: 1,
    },
    {
      text: 'Gestión de Finanzas',
      icon: 'k-i-arrow-60-right',
      selected: true,
      expanded: false,
      children: true,
      level: 1,
    },
    {
      text: 'FUR',
      icon: 'k-i-arrow-60-right',
      selected: true,
      expanded: false,
      children: true,
      level: 1,
    },
    {
      text: 'Caja',
      icon: 'k-i-arrow-60-right',
      selected: true,
      expanded: false,
      children: true,
      level: 1,
    },
    {
      text: 'Reportes',
      icon: 'k-i-arrow-60-right',
      selected: true,
      expanded: false,
      children: true,
      level: 1,
    },
  ],
  gpersonasChild: [
    {
      text: 'Maestros',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },
    {
      text: 'Reportes',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },
  ],
  atencionClienteChild: [
    {
      text: 'Maestros',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },
    {
      text: 'Reportes',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },
    {
      text: 'Gestion Atencion al Cliente',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },
  ],

  gestionComChild: [
    {
      text: 'TextArea',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },
    {
      text: 'Reportes',
      icon: 'k-i-arrow-60-right',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
    },
  ],
  comGestionComercialChild: [
    {
      text: '(O) Agenda V2',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Comercial/Agenda',
    },
    {
      text: '(O) Aprobación de visualizaciones',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Comercial/AprobarVisualizacion',
    },
  ],
  comAnaliticaVentasChild: [
    {
      text: '(R) Tasas de conversión consolidadas',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Comercial/TasaConversionConsolidada',
    },
  ],
  comConfiguracionChild: [
    {
      text: '(C) Tabs de Agenda',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Comercial/AgendaTab',
    },
    {
      text: '(C) Semaforo Financiero',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Comercial/SemaforoFinanciero',
    },

    {
      text: '(M) Categoria de Asesores - Beta',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Comercial/CategoriaAsesor',
    },
    {
      text: '(M) Problemas de Cliente',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Comercial/ProblemaCliente',
    },
    {
      text: '(M) Records de Area Comercial - Beta',
      icon: 'ks',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Comercial/RecordAreaComercial',
    },
  ],

  finGesFinChild: [
    {
      text: '(O) Beneficios laborales del área comercial',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/BeneficioLaboralComercial',
    },
    {
      text: '(O) Comisiones por matrículas',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/ComisionMatricula',
    },

    {
      text: '(C) Disponibilidad de Flujo Efectivo',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/DisponibilidadFlujoEfectivo',
    },


    {
      text: '(C) Otros Ingresos y Egresos',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/OtroIngresoEgreso',
    },
    {
      text: "(O) Comprobante Pago Alumno",
      icon: "",
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/ComprobantePagoAlumno'
    },

  ],

  finFurChild: [
    {
      text: '(O) Activar FUR',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/ActivarFur',
    },
    {
      text: '(O) Aprobar FUR',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/AprobarFur',
    },
    {
      text: '(O) Generar FUR',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/GenerarFur',
    },
    {
      text: '(O) Registrar FUR Pago',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/RegistrarFurPago',
    },
  ],

  finCajaChild: [
    {
      text: '(O) Nota Ingreso',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/NotaIngreso',
    },
    {
      text: '(O) Por Rendir',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/CajaPorRendir',
    },
    {
      text: '(O) Registro Egreso',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/CajaRegistroEgreso',
    },
    {
      text: '(R) Resumen Caja',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/ResumenCaja',
    },
  ],

  finMaestroChild: [
    {
      text: '(C) Cuenta Bancaria',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/CuentaBancaria',
    },
    {
      text: '(C) Cuenta Contable Padre',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/CuentaContablePadre',
    },
    {
      text: '(C) Tipo Cuenta',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/TipoCuenta',
    },
    {
      text: '(C) Entidad Financiera',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/EntidadFinanciera',
    },
    {
      text: '(C) Estados de Matricula',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/EstadoMatricula',
    },
    {
      text: '(C) Plan Contable',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/PlanContable',
    },
    {
      text: '(C) Subestados de Matricula',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/SubEstadoMatricula',
    },
    {
      text: '(C) Tasas de cambio multi moneda',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/TasaCambioMultimoneda',
    },
    {
      text: '(C) Tipo servicio proveedor',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/TipoServicioProveedor',
    },
    {
      text: '(C) Empresa Autorizada',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/EmpresaAutorizada',
    },
    {
      text: '(C) Retenciones',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/Retencion',
    },
    {
      text: '(C) Origen de Ingreso Caja',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/OrigenIngresoCaja',
    },
    {
      text: '(C) Tipos de Impuesto',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/TipoImpuesto',
    },
    {
      text: '(M) Medios de pago',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/MediosDePago',
    },
    {
      text: '(O) Productos',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/Producto',
    },
    {
      text: '(O) Proveedores',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/Proveedor',
    },
    {
      text: '(C) Cajas',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/Caja',
    },
    {
      text: '(C) Periodos Finanzas',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/Periodos',
    },
    {
      text: '(C) Documentos legales',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Finanzas/DocumentoLegal',
    },
  ],
  markMaestroChild: [
    {
      text: '(C) Grupos de Categoria Origen ',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/GruposCategoriaOrigen',
    },

    {
      text: '(C) Categoria Origen ',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/CategoriaOrigen',
    },

    {
      text: '(C) Origen de Datos ',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/OrigenDato',
    },
    {
      text: '(C) Tipo Interaccion',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/TipoInteraccion',
    },

    {
      text: '(C) Formulario de Procedencia',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/ProcedenciaFormulario',
    },

    {
      text: '(C) Proveedor Campania Integra',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/ProveedorCampaniaIntegra',
    },
    {
      text: '(C) Tipo Dato',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/TipoDato',
    },
    {
      text: '(C) Pais',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/Paises',
    },
    {
      text: '(C) Conjunto Anuncio',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/ConjuntoAnuncio',
    },

    {
      text: '(C) Region Ciudad',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/RegionCiudad',
    },

    {
      text: '(C) Ciudad',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/Ciudad',
    },

    {
      text: '(C) Subir Fuentes',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/SubirFuentes',
    },

    {
      text: '(C) EstilosCss',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/EstilosCss',
    },

    {
      text: '(C) Tags',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/Tags',
    },

    {
      text: '(C) Tipo LandingPage',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/TipoLandingPage',
    },

    {
      text: '(C) Seccion',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/Seccion',
    },

    {
      text: '(C) Formulario Respuesta',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/FormularioRespuesta',
    },

    {
      text: '(C) Formulario Solicitud Texto Boton',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/FormularioSolicitudTextoBoton',
    },
  ],

  markConfiguracionChild: [
    {
      text: '(C) Campo Contacto',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/CampoContacto',
    },
    {
      text: '(C) Subida de Archivo',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/RegistroArchivoStorage',
    },

    {
      text: '(C) Plantilla Landing Page V2',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/PlantillaV2',
    },

    {
      text: '(C) Formulario Landing Page',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/FormularioLandingPage',
    },

    {
      text: '(C) Formulario Solcitud',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/FormularioSolicitud',
    },
    {
      text: '(C) Dato de  Remarketing',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/DatoRemarketing',
    },

    {
      text: '(C) Artículos BS Campus',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/ArticulosBsCampus',
    },

    {
      text: '(C) Asignación de programas críticos',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/GrupoFiltroProgramaCritico',
    },
    {
      text: '(C) Punto De Corte De Programas',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/ProgramaGeneralPuntoCorte',
    },
  ],
  markGestiondeOportunidadChild: [
    {
      text: "(C)Asignar Manualmente Oportunidades",
      icon: "",
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/AsignarManualmenteOportunidad'
    },
    {
      text: "(O) Corregir registros erroneos",
      icon: "",
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/AsignacionAutomatica'
    },
    {
      text: "(C) Procesar Oportunidades",
      icon: "",
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/ProcesarOportunidad'
    },

    {
      text: "(C)Revertir Cambios Fase  ",
      icon: "",
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/RevertirCambioFase'
    },
    {
      text: "(O) Verificar manualmente datos",
      icon: "",
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/VerificacionManualDeDatos'
    },



  ],


  opeAprobarSolicitudesCambiosChild: [
    {
      text: '(O) Aprobar Solicitudes de cambios',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Operaciones/AprobarSolicitudesCambios',
    },
    {
      text: '(O) Aprobar visualización de datos',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Operaciones/AprobarVisualizacionDatos',
    },
  ],

  markRepofiguracionChild: [
    {
      text: '(C) Control de Conexion al Portal Web',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/ControlConexion',
    },

    {
      text: '(C) Monitoreo del Chat Portal Web',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/ReporteChat',
    },

    {
      text: '(C) Campania Facebook',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/ReporteCampaniaFacebook',
    },
  ],

  markConfChild: [
    {
      text: 'Asignación de Datos',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Marketing/AsignacionDeDatos',
    },
  ],
  plaMaestroChild: [
    {
      text: '(M) Empresas registradas en agendas ',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Planificacion/Empresa',
    },
    {
      text: '(M) Regiones registradas en integra ',
      icon: '',
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Planificacion/Region/',
    },

    //   {

    //     text: "(M) Pais ",
    //     icon: "",
    //     selected: false,
    //     expanded: false,
    //     children: false,
    //     levePaisl: 1,
    //     urlPath: 'Planificacion/Pais'

    // }
  ],
  plaConfPortalWebChild:[
    {
      text: "(C) Criterios de evaluación de programas específicos",
      icon: "",
      selected: false,
      expanded: false,
      children: false,
      level: 1,
      urlPath: 'Planificacion/CriteriosEvaluacionProgramasEspecificos'
    },
  ]
};



@Component({
  selector: 'app-menu-prueba',
  templateUrl: './menu-prueba.component.html',
  styleUrls: ['./menu-prueba.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MenuPruebaComponent implements OnInit, AfterViewInit {

  @ViewChild('drawer') drawer: DrawerComponent
  constructor(private router: Router) { }
  ngAfterViewInit(): void {
    this.drawer.toggle(this.toggle);
    this.flexBasis = 'flex-basis: 0px;'
  }

  ngOnInit(): void {

  }

  public selected: any;
  public items: any = items.parents;
  public itemIndex: any;
  flexBasis: string = 'flex-basis: 0px;'
  toggle = false;
  public onSelect(ev: DrawerSelectEvent): void {
    this.selected = ev.item.text;
    if(ev.item.urlPath){
      this.router.navigate([ev.item.urlPath])

    }
    const item = this.items.find((e: any, index: any) => {
      this.itemIndex = index;
      return e.text === ev.item.text;
    });

    // eslint-disable-next-line no-unused-expressions
    item.expanded ? (item.expanded = false) : (item.expanded = true);

    if (ev.item.text === "COMERCIAL") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.comercialChild)
        : this.removeChildren(items.comercialChild);
    }
    if (ev.item.text === "PLANIFICACION Y OPERACIONES") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.planificacionOpChild)
        : this.removeChildren(items.planificacionOpChild);
    }
    if (ev.item.text === "MARKETING") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.marketingChild)
        : this.removeChildren(items.marketingChild);
    }
    if (ev.item.text === "FINANZAS") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.finanzasChild)
        : this.removeChildren(items.finanzasChild);
    }
    if (ev.item.text === "GESTION DE PERSONAS") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.gpersonasChild)
        : this.removeChildren(items.gpersonasChild);
    }
    if (ev.item.text === "ATENCION AL CLIENTE") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.atencionClienteChild)
        : this.removeChildren(items.atencionClienteChild);
    }

    if (ev.item.text === "Configuraciones") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.comConfiguracionChild)
        : this.removeChildren(items.comConfiguracionChild);
    }
    if (ev.item.text === "Gestion Comercial") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.comGestionComercialChild)
        : this.removeChildren(items.comGestionComercialChild);
    }
    if (ev.item.text === "Analítica de Ventas") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.comAnaliticaVentasChild)
        : this.removeChildren(items.comAnaliticaVentasChild);
    }

    if (ev.item.text === "Maestros Finanzas") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.finMaestroChild)
        : this.removeChildren(items.finMaestroChild);
    }

     if (ev.item.text === "Gestión de Finanzas") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.finGesFinChild)
        : this.removeChildren(items.finGesFinChild);
    }
    if (ev.item.text === "Caja") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.finCajaChild)
        : this.removeChildren(items.finCajaChild);
    }

    if (ev.item.text === "Configuraciones Marketing") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.markConfChild)
        : this.removeChildren(items.markConfChild);
    }
    if (ev.item.text === "Maestros Marketing") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.markMaestroChild)
        : this.removeChildren(items.markMaestroChild);

    }
    if (ev.item.text === "Configuraciones Marketing") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.markConfiguracionChild)
        : this.removeChildren(items.markConfiguracionChild);
    }
    if (ev.item.text === "Gestion de Oportunidades") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.markGestiondeOportunidadChild)
        : this.removeChildren(items.markGestiondeOportunidadChild);
    }

    if (ev.item.text === "Reportes") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.markRepofiguracionChild)
        : this.removeChildren(items.markRepofiguracionChild);
    }


    if (ev.item.text === "Maestros OP y PL") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.plaMaestroChild)
        : this.removeChildren(items.plaMaestroChild);
    }

    if (ev.item.text === "Configuración de Portal Web") {
      // eslint-disable-next-line no-unused-expressions
      item.expanded
        ? this.addChildren(items.plaConfPortalWebChild)
        : this.removeChildren(items.plaConfPortalWebChild);
    }
  }

  public addChildren(children: Array<Item>): void {
    this.items.splice(this.itemIndex + 1, 0, ...children);
  }

  public removeChildren(children: Array<Item>): void {
    this.items.splice(this.itemIndex + 1, children.length);
  }

  public drawerToggle(){
    this.toggle = !this.toggle
    this.drawer.toggle(this.toggle);

    if(this.toggle == true){
      this.flexBasis = 'flex-basis: 270px;'
    } else {
      this.flexBasis = 'flex-basis: 0px;'
    }

  }

}

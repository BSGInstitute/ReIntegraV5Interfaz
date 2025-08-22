import { SubEstado } from './../../../../../../../models/sub-estado-matricula';
import { constApiComercial, constApiOperaciones } from 'src/environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  IPlantilla,
  IPlantillaMailing,
  IPlantillasPorIdFaseOportunidad,
} from '@comercial/models/interfaces/iagenda-activad';
import { IAlumnoAccesos, IAlumnoInformacion, IMatriculaAlumno } from '@comercial/models/interfaces/iagenda-datos-alumno';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { AlertaService } from '@shared/services/alerta.service';
import { CrmService } from '@shared/services/crm.service';
import { BehaviorSubject, Observable, ReplaySubject, combineLatest, forkJoin } from 'rxjs';
import { Buffer } from 'buffer';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { IntegraService } from '@shared/services/integra.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AvatarService } from '@integra/services/avatar.service';
import {
  IComboEstadoMatricula,
  IFormRedactarMensajeOperaciones,
  IMontoPagoPaquete,
} from '@comercial/models/interfaces/iagenda-bandeja-entrada';
import Swal from 'sweetalert2';
import { AgendaService } from '@comercial/services/agenda/agenda.service';
import { UserService } from '@shared/services/user.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Parametro } from '@shared/models/parametro';
import { DatePipe } from '@angular/common';
import { IDatosSentinelAlumno } from '@comercial/models/interfaces/isemaforo-financiero';
import { MatSelectModule } from '@angular/material/select';
import { threadId } from 'worker_threads';
import { RingoverSDKService } from '@shared/services/ringover-sdk.service';


@Component({
  selector: 'app-informacion-cliente',
  templateUrl: './informacion-cliente.component.html',
  styleUrls: ['./informacion-cliente.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InformacionClienteComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  @Input() agendaServiceComercial: AgendaService;
  @Output() OnScrol: EventEmitter<void>=new EventEmitter<void>();
  
  constructor(
    private formBuilder: FormBuilder,
    private crmService: CrmService,
    private modalService: NgbModal,
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private snackBar:MatSnackBar,
    private userService: UserService,
    private avatarService: AvatarService,
    private matSelectModule:MatSelectModule,
    private _ringoverSDKService: RingoverSDKService
  ) {}


/**/
botonAulaVirtualDisabled: boolean;
isLoading: boolean;
avatarObservable: Observable<HttpResponse<any>>;
avatarUrl: string;
panelOpenState = false;
estadoMatricula: any;
  subEstadoMatricula:any;
  centroCosto:any;
  tarifario:any;
  categoriaAlumno:any;
  objetoCategoriaAlumno:any;
  colorRankingOperaciones:any;
  solicitudEsquemasEvaluacion:any;
  fechaFinalizacion:any;
  matriculasAlumno:any;
  correoSeleccionado:string;
  formSolicitudes: FormGroup = this.formBuilder.group({
    nuevaFechaFinalizacion: [null],
    idEstadoMatricula: [null],
    idCategoriaAlumno: [null],
    idVersion: [null],
    idSubEstadoMatricula: [null],
    idCentroCosto: [null],
    comentarioSolicitud: [null],
  });
  formEsquemaEvaluacion: FormGroup = this.formBuilder.group({
    esquemaEvaluacion: [null],
  });
  modalRef: any;

  filterSettings_estados: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  filterSettings_subEstado: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  verEstado=false;
  verSubEstado=false;
  verCentroCosto=false;
  verFechaFinalizacion=false;
  verCategoriaAlumno=false;
  verCambioVersion=false;
  verCambioGeneral=false;
  verAdjuntarComprobante=false;
  conSubEstado=false;
  textoSubEstado="";
  idTipoCambioOperacionesGeneral:any;
  tituloModalSolicitudCambio:any;
  dataEstadoMatricula:any;
  dataCentroCosto: any;
  disableBotonSolicitarCambio=false;
  dataSubEstadoMatricula:any[];
  dataComboSubEstadoMatricula:any;
  personal:any;
  esCordinadora:any;
  informacionCursoPrograma:any[];
  idPEspecificoGlobal:any;
  listaEsquemaEvaluacion:any[];
  verContenedorEsquemasPorPEspecifico=false;
  dataEsquemaEvalueacion:any;
  inputFormaCalculoNota:any;
  dataEsquemaEvaluacionAlumno:any;
  buttonSolicitud:boolean=false;
  nroDocumento = '';
  email1Envio:string;
  email1Original:string;
  email2Envio:string;
  cuotaPendiente:number=0;
  btnConsultar: any = {
    disabled: false,
    show: false,
    text: 'Consultar',
    class: 'btn-success',
    color: 'success',
  };
  celularSeleccionado : any={};
  idVersion:number;
  version:string;
  
  email1 = '';
  email2 = '';
  celular1 = '';
  celular2 = '';
  celular1Temp = '';
  celular2Temp = '';
  telefono1 = '';
  telefono2 = '';


  listaVersionesTotal: any;
  listaVersion: any = [];
  
  @ViewChild('modalSolicitudCambio') modalSolicitudCambio: any;
  @ViewChild('modalMatriculas') modalMatriculas: any;
  @ViewChild('modalEsquemaEvaluacion') modalEsquemaEvaluacion: any;

  gridEsquemaEvaluacion: KendoGrid = new KendoGrid();
  gridEsquemaEvaluacionAlumno: KendoGrid = new KendoGrid();
  
  formInformacionCliente: FormGroup = this.formBuilder.group({
    nombresApellidos: '',
    ciudad: '',
    pais: '',
    emailPrincipal: '',
    emailSecundario: '',
    celularPrincipal: '',
    celularSecundario: '',
    telefonoPrincipal: '',
    telefonoSecundario: '',
    copyUser:'',
    copyPassword:'',
    cargo:'',
    areaTrabajo:'',
    profesion:'',
    industria:'',

  });
  cOmpromisosVencidos:number =0;
  cuotasAtrasadas:number =0;
  estadoCompromiso:string="-";
  fechaUltimoCompromiso:string;
  proximaFechaVencimiento:string;
  totalDolares:Number=0;
  ultimoCompromisoMOntoDolares:number=0;
  rankingColor:any;

  cont=1;
  alumno: IAlumnoInformacion;
  accesos: IAlumnoAccesos;
  rowActual: IRowActual;
  esCoordinadora: boolean = false;
  visualizarDatos: number = 0;
  tipoInput: string = 'text';
  operacionesEmailSemiOculto: boolean = false;
  _tabOperacion: number = 0;

  btnCelular1: any = {
    disabled: false,
    show: false,
    class: 'btn-outline-secondary',
    icon: 'phone',
    rotate: 135,
  };
  btnCelular1Ringover = {
    disabled: false,
    show: false,
    class: 'btn-outline-info',
    icon: 'phone',
    rotate: 135,
  };
  btnCelularFijo1: any = {
    disabled: false,
    show: false,
    class: 'btn-outline-secondary',
    icon: 'phone',
    rotate: 135,
  };
  btnCelular2: any = {
    disabled: false,
    show: false,
    class: 'btn-outline-secondary',
    icon: 'phone',
    rotate: 135,
  };
  btnCelular2Ringover: any = {
    disabled: false,
    show: false,
    class: 'btn-outline-info',
    icon: 'phone',
    rotate: 135,
  };
  btnCelularFijo2: any = {
    disabled: false,
    show: false,
    class: 'btn-outline-secondary',
    icon: 'phone',
    rotate: 135,
  };
  btnTelefono1: any = {
    disabled: false,
    show: false,
    class: 'btn-outline-secondary',
    icon: 'phone',
    rotate: 135,
  };
  btnTelefono2: any = {
    disabled: false,
    show: false,
    class: 'btn-outline-secondary',
    icon: 'phone',
    rotate: 135,
  };

  btnEmail1: any = {
    disabled: false,
    show: false,
    class: 'btn-outline-secondary',
    icon: 'phone',
    rotate: 135,
  };
  btnEmail2: any = {
    disabled: false,
    show: false,
    class: 'btn-outline-secondary',
    icon: 'phone',
    rotate: 135,
  };

  flagValorEtiqueta$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  pEspecifico: any;
  partes:any;
  resultado :any;
  crmActivo: boolean = false;
  isExpanded = true;
  celularWhatsApp: string = '';
  codigoMatricula: string='';
  DatosOportunidad: any = {};
  tPEspecifico: any = {};
  pasteCleanupSettings = {
    convertMsLists: false,
    removeHtmlComments: false,
    // stripTags: ['span', 'h1'],
    // removeAttributes: ['lang'],
    removeMsClasses: false,
    removeMsStyles: false,
    removeInvalidHTML: false,
  };
  loadingPlantilla: boolean = false;
  isMessageSending: boolean = false;
  destinatario: any = '';
  formRedactarMensaje: FormGroup = this.formBuilder.group({
    asunto: '',
    de: '',
    para: '',
    conCopia: '',
    plantilla: null,
    grupo: null,
    versiones: [[]],
    estados: [[]],
    subEstados: [[]],
    adjuntar: null,
    mensaje: '',
  });
  Asunto: any[] = [];
  btnEnviarMensajeDisabled: boolean = false;
  modalRefRedactarMensaje: any;
  controlPlantillaMensaje: any = null;
  modalRefPlantilla: NgbModalRef;
  plantillaMensajeFiltro: IPlantilla[] = [];
  sourcePlantillaMensaje: IPlantilla[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  nombreCompleto:any;

  dataEstados: IComboEstadoMatricula[] = [];
  dataSubEstados: any[] = [];
  dataVersiones: IMontoPagoPaquete[] = [];

  plantillasPorIdFaseOportunidad: IPlantillasPorIdFaseOportunidad[] = [];
  selectedEmail=1;
  selectedPhone=1;
  
  encuestasResuelto:number=0;
  encuestasPendiente:number=0;
  
  ngOnInit(): void {
    this.botonAulaVirtualDisabled = false;
    this.isLoading = true;
    this.rowActual = this.agendaService.rowActual;
    this.pEspecifico=this.rowActual.pEspecifico;
    this.codigoMatricula=this.rowActual.codigoMatricula;
    console.log('InformacionClienteComponent');
    this.obtenerPGeneralAlumno(this.rowActual.idMatriculaCabecera);
    this.initSubscribeObservables();
    // this.obtenerInversion();
    this.obtenerAvatar();
    console.log("ojito",this.rowActual);
    if ((this.rowActual.estadoMatricula.toUpperCase().includes('REGULAR') && this.rowActual.subEstadoMatricula.toUpperCase().includes('ATRASADO'))|| this.rowActual.estadoMatricula.toUpperCase().includes('MOROSO')){
      this.rankingColor="#FC0000"
    }
    else if(this.rowActual.estadoMatricula.toUpperCase().includes('REGULAR')){
      this.rankingColor="#00D807"
    }
    //this.ConteoEncuestas();
    /**/
    this.personal=this.agendaService.datosPersonal;
    this.agendaService.esCoordinadora$.subscribe({
      next:(response:any)=>{
        this.esCordinadora=response;
      }
    })
    this.obtenerCategoriaAlumno();
    this.agendaService.agendaAlumnoOperacionesService.estadosMatricula$.subscribe({
      next: (response: any) => {
        response?.forEach((x:any)=>{x['estadoMatricula'] = x['estadoMatricula'].toUpperCase();});
        response?.sort((a:any,b:any)=>this.sortAlphabetically(a,b,'estadoMatricula'));
        this.dataEstadoMatricula=response;
      }
    });
    this.agendaService.agendaAlumnoOperacionesService.subEstadoMatricula$.subscribe({
      next: (response: any) => {
        response?.forEach((x:any)=>{x['nombre'] = x['nombre'].toUpperCase()});
        response?.sort((a:any,b:any)=>this.sortAlphabetically(a,b,'nombre'));
        this.dataSubEstadoMatricula=response;
      }
    });
    
    this.cargarPantalla1();
    /**/
  }
  toggleExpansion() {
    this.isExpanded = !this.isExpanded;
  }
  initSubscribeObservables() {
    this.agendaService.esCoordinadora$.subscribe(
      (resp) => (this.esCoordinadora = resp)
    );
    let sub1$ = this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.subscribe({
      next: (resp) => {
        if (resp != null) {
          this.alumno = resp.alumno;
          // this.nroDocumento = resp.alumno.dni;
          this.formInformacionCliente
            .get('profesion')
            .setValue(this.alumno.aFormacion);
          this.formInformacionCliente.get('cargo').setValue(this.alumno.cargo);
          this.formInformacionCliente
          .get('areaTrabajo')
          .setValue(this.alumno.aTrabajo);
          this.formInformacionCliente
            .get('industria')
            .setValue(this.alumno.industria);
          // this.formInformacionCliente.get('empresa').setValue(this.alumno.empresa);
          // this.formInformacionCliente.get('docIdentidad').setValue(this.alumno.dni);
        }
      },
    });
    let sub2$ =
      this.agendaService.agendaInicializarOperacionesService.plantillasPorIdFaseOportunidad$.subscribe(
        {
          next: (resp) => {
            this.plantillasPorIdFaseOportunidad = resp;
          },
        }
      );

    this.flagValorEtiqueta$ =
      this.agendaService.agendaActividadesOperacionesService.flagValorEtiqueta$;

    this.crmService.esCrmActivo$.subscribe({
      next: (resp: boolean) => {
        this.crmActivo = resp;
        if(this.crmActivo==true){
          this.btnCelular1.disabled=false
        }else{this.btnCelular1.disabled=true}
      },
    });
    this.agendaService.agendaAlumnoOperacionesService.btnCelular1$.subscribe({
      next: (resp: any) => {
        this.btnCelular1 = Object.assign(this.btnCelular1, resp);
      },
    });
    this.agendaService.agendaAlumnoOperacionesService.btnCelular2$.subscribe({
      next: (resp: any) => {
        this.btnCelular2 = Object.assign(this.btnCelular2, resp);
      },
    });
    this.agendaService.agendaAlumnoOperacionesService.btnCelularFijo1$.subscribe(
      {
        next: (resp: any) => {
          this.btnCelularFijo1 = Object.assign(this.btnCelularFijo1, resp);
        },
      }
    );
    this.agendaService.agendaAlumnoOperacionesService.btnCelularFijo2$.subscribe(
      {
        next: (resp: any) => {
          this.btnCelularFijo2 = Object.assign(this.btnCelularFijo2, resp);
        },
      }
    );
    this.agendaService.agendaAlumnoOperacionesService.btnTelefono1$.subscribe({
      next: (resp: any) => {
        this.btnTelefono1 = Object.assign(this.btnTelefono1, resp);
      },
    });
    this.agendaService.agendaAlumnoOperacionesService.btnTelefono2$.subscribe({
      next: (resp: any) => {
        this.btnTelefono2 = Object.assign(this.btnTelefono2, resp);
      },
    });

    this.agendaService.agendaBandejaCorreoOperacionesService.listaEstados$.subscribe(
      {
        next: (resp) => {
          this.dataEstados = resp;
        },
      }
    );

    this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.subscribe({
      next: (resp) => {
        if (resp) {
          this.alumno = resp.alumno;
          this.visualizarDatos = resp.visualizarDatos.valor;
          this.cargarDatosAlumno();
          
          let configuracionOpenVox: any = null;
          if (
            this.alumno.idCodigoPais != null &&
            configuracionOpenVox != null
          ) {
            let listaPaisesPermitidos = configuracionOpenVox.map(
              (x: any) => x.IdPais
            );
            // mostrarOpenVoxFijo(listaPaisesPermitidos, DatosAlumno);
          }

          this.cargarPlantillasWhatsApp();
        }
      },
    });

    this.agendaService.agendaAlumnoOperacionesService.accesoAlumno$.subscribe({
      next: (resp) => {
        if (resp) {
          this.formInformacionCliente.get('copyUser').setValue(resp.usuario);
          this.formInformacionCliente.get('copyPassword').setValue(resp.contrasenia);

        }
      },
    });
    this.agendaService.agendaAlumnoOperacionesService.versionActual$.subscribe({
      next: (resp) => {
        if (resp) {
          this.idVersion=resp.idVersion
          this.version=resp.version
        }
      },
    });
    this.agendaService.agendaAlumnoOperacionesService.versionDisponible$.subscribe({
      next: (resp) => {
        if (resp) {
          this.listaVersion=resp
        }
      },
    });
    this.agendaService.agendaAlumnoOperacionesService.matriculaAlumno$.subscribe({
      next: (resp:any)=>{
        console.log("DATOSMATRICULA",resp)
        let filtroMatricula=resp.filter((item:any) => item.codigoMatricula !== this.rowActual.codigoMatricula);
       this.matriculasAlumno=filtroMatricula;

      }
    })
    this.agendaService.agendaAlumnoOperacionesService.datosCobranza$.subscribe({
      next: (resp) => {
        if (resp) {
          console.log("datosCobranza",resp)
          this.cOmpromisosVencidos=resp.compromisosVencidos
          this.cuotasAtrasadas=resp.cuotasAtrasadas
          this.estadoCompromiso=resp.estadoCompromiso
          this.fechaUltimoCompromiso = resp.fechaUltimoCompromiso ? resp.fechaUltimoCompromiso : 'No aplica';
          this.proximaFechaVencimiento=resp.proximaFechaVencimiento ? resp.proximaFechaVencimiento : 'No aplica';
          this.totalDolares=resp.totalDolares
          this.ultimoCompromisoMOntoDolares=resp.ultimoCompromisoMontoDolares
          this.cuotaPendiente=resp.cuotaPendiente-resp.cuotasAtrasadas;
        }
      if(this.cuotaPendiente<0){
        this.cuotaPendiente=0
      }
      },
    });


    this.integraService.obtenerPorFiltro(constApiComercial.CentroCostoObtenerAutocompleteCentroCosto, {valor: '',}).subscribe({
      next: (response) => {
        this.dataCentroCosto = response.body.filter((x:any)=>x.nombre.toLowerCase().includes('webinar') == false);
      },
    });

    this.agendaService.agendaDocumentoProgramaOperacionesService.oportunidadPEspecifico$.subscribe(
      {
        next: (resp: any) => {
          console.log(resp);
          this.DatosOportunidad = resp.oportunidad;
          this.tPEspecifico = resp.pEspecifico;
        },
      }
    );

    this.integraService.obtenerPorFiltro(constApiComercial.CentroCostoObtenerAutocompleteCentroCosto, {valor: '',})
    .subscribe({
      next: (response) => {
        this.comboCentroCosto = response.body;
        this.comboCentroCostoTemp = response.body;
      },
      error: (error) => {},
    });

    const interval = setInterval(()=>{
      if(this.agendaService.agendaAlumnoOperacionesService.datosAlumno$ == null || this.avatarObservable == null)
        return;
      clearInterval(interval);
      let obs = combineLatest([this.agendaService.agendaAlumnoOperacionesService.datosAlumno$,this.avatarObservable]
      ).subscribe({next: ([result1Value, result2Value])=>{
        if (result1Value !== undefined && result2Value !== undefined) 
          this.isLoading = false;
          obs.unsubscribe();
      }});
    },1000);

    this.agendaService.agendaAlumnoOperacionesService.encuestasPendiente$.subscribe({
      next: (resp) => {
        if (resp) {
          this.encuestasPendiente=resp;
        }
      }
    })

    this.agendaService.agendaAlumnoOperacionesService.encuestasResuelto$.subscribe({
      next: (resp) => {
        if (resp) {
          this.encuestasResuelto=resp;
        }
      }
    })

    
  }
  copiarCodigo(codigo: string) {
    navigator.clipboard.writeText(codigo).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Copiado!',
        timer: 500, 
        timerProgressBar: true, 
      });
    }).catch((error) => {
      console.error('ERROR', error);
    });
  }
  realizarLLamadaRingover(numeroAlumno: string) {
    this._ringoverSDKService.realizarLLamada(numeroAlumno);
  }
  
  realizarLlamada(numeroAlumno: string, telefonoSalida: number) {
    if(this.esRingover){
      this.realizarLLamadaRingover(numeroAlumno);
    }else{
      this.agendaService.agendaRealizarLlamadaOperacionesService.realizarLlamada(
        numeroAlumno,
        telefonoSalida
      );
    }
  }
  obtenerPGeneralAlumno(idMatriculaCabecera:any){
    let params: Parametro[] = [
      {
        clave: 'IdMatriculaCabecera',
        valor: idMatriculaCabecera,
      },
    ];
    this.integraService
    .obtenerPorPathParams(
      constApiOperaciones.ObtenerProgramaGeneralPorIdMatricula,
      params
    )
    .subscribe({
      next: (response) => {
        this.resultado=response.body.nombre
        },
        error: (error) => {

        },
        complete: () => {},
      });
  }
  get esRingover(){
    return this.agendaService.esRingover
  }
  get checkStatusRingover(){
    return this._ringoverSDKService.checkStatus();
  }
  cargarDatosAlumno() {
    if(this.agendaService.esRingover){
      this.btnCelular1Ringover.show = true;
      this.btnCelular2Ringover.show = true;
      // this.btnCelular1Ringover.disabled = false;
      // this.btnCelular2Ringover.disabled = false;
    }else{
      this.btnCelular1.show = true;
      this.btnCelular2.show = true;
    }

    if (this.alumno.idCodigoPais != null) {

      if(this.agendaService.esRingover){
        let celular1: string =
          this.alumno.celular != null ? this.alumno.celular.trim() : '';
        let res = this.limpiarCelularRingover(
          celular1,
          this.alumno.idCodigoPais
        );
        this.alumno.celular = res.numeroCelularRingover;
        this.alumno.celularTemp = res.numeroCelularRingover;
        
        this.celularWhatsApp = res.numeroCelular;
        let celular2: string =
          this.alumno.celular2 != null ? this.alumno.celular2.trim() : '';
        let res2 = this.limpiarCelularRingover(
          celular2,
          this.alumno.idCodigoPais
        );
        this.alumno.celular2 = res2.numeroCelularRingover;
        this.alumno.celular2Temp = res2.numeroCelularRingover;
      
      }else{
        let celular1: string =
          this.alumno.celular != null ? this.alumno.celular.trim() : '';
        let res = this.limpiarCelular(
          celular1,
          this.alumno.idCodigoPais
        );
        this.alumno.celular = res.numeroCelular;
        if(res.numeroCelular != null && res.numeroCelular.length > 0) {
          this.alumno.celularTemp = res.prefijo + res.numeroCelular;
        }else{
          this.alumno.celularTemp = res.numeroCelular;
        }
        this.celularWhatsApp = this.alumno.celular;
        let celular2: string =
          this.alumno.celular2 != null ? this.alumno.celular2.trim() : '';
        let res2 = this.limpiarCelular(
          celular2,
          this.alumno.idCodigoPais
        );
        this.alumno.celular2 = res2.numeroCelular;
        if(res.numeroCelular != null && res2.numeroCelular.length > 0) {
          this.alumno.celular2Temp = res2.prefijo + res2.numeroCelular;
        }else{
          this.alumno.celular2Temp = res2.numeroCelular;
        }
      }
    }

    if (this.alumno.celular == null || this.alumno.celular.trim() == '') {
      this.btnCelular1.show = false;
      this.btnCelularFijo1.show = false;
      this.btnCelular1Ringover.show = false;
    }
    if (this.alumno.celular2 == null || this.alumno.celular2.trim() == '') {
      this.btnCelular2.show = false;
      this.btnCelularFijo2.show = false;
      this.btnCelular2Ringover.show = false;
    }

    this.nombreCompleto = `${this.alumno.nombre1} ${this.alumno.nombre2} ${this.alumno.apellidoPaterno} ${this.alumno.apellidoMaterno}`;
    this.operacionesEmailSemiOculto = false;
    if (
      (this.agendaService.areaTrabajo == 'VE' &&
        this.rowActual.codigoFase != 'BNC') ||
      (this.agendaService.areaTrabajo == 'OP' &&
        this._tabOperacion != 12 &&
        this.esCoordinadora == false)
    ) {
      if (this.visualizarDatos == 1) {
        this.tipoInput = 'text';
      } else {
        if (this.agendaService.areaTrabajo == 'OP') {
          this.operacionesEmailSemiOculto = true;
          this.tipoInput = 'text';
        } else {
          this.tipoInput = 'password';
        }
      }
    }

    this.formInformacionCliente      .get('nombresApellidos')
      .setValue(this.rowActual.dni);
      this.nroDocumento = this.rowActual.dni;
    this.formInformacionCliente
      .get('ciudad')
      .setValue(this.alumno.nombreCiudad ?? '');
    this.formInformacionCliente
      .get('pais')
      .setValue(this.alumno.nombrePais ?? '');
      this.email1Envio=this.alumno.email1;
      this.email1Original=this.alumno.emailOriginal;
      this.email2Envio=this.alumno.email2 ; 
    if (this.operacionesEmailSemiOculto) {
      this.email1 = this.agendaService.agendaAlumnoOperacionesService.ofuscarCorreo(
        this.alumno.email1
      );
      this.email2 = this.agendaService.agendaAlumnoOperacionesService.ofuscarCorreo(
        this.alumno.email2
      );
      // celular1 =
      //   this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(
      //     this.alumno.celular
      //   );
      // celular2 =
      //   this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(
      //     this.alumno.celular2
      //   );
      this.celular1 =this.alumno.celular
      this.celular1Temp =this.alumno.celularTemp
      this.celular2 = this.alumno.celular2
      this.celular2Temp = this.alumno.celular2Temp
      this.telefono1 =
        this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(
          this.alumno.telefono
        );
      this.telefono2 =
        this.agendaService.agendaAlumnoOperacionesService.ofuscarNumero(
          this.alumno.telefono2
        );
    } else {
      this.email1 = this.alumno.email1;
      this.email2 = this.alumno.email2;
      this.celular1 = this.alumno.celular;
      this.celular1Temp =this.alumno.celularTemp
      this.celular2 = this.alumno.celular2;
      this.celular2Temp = this.alumno.celular2Temp
      this.telefono1 = this.alumno.telefono;
      this.telefono2 = this.alumno.telefono2;
    }

    if (this.alumno.email1 == null || this.alumno.email1.trim() == '') {
      this.btnEmail1.show = false;
    } else {
      this.btnEmail1.show = true;
    }
    if (this.alumno.email2 == null || this.alumno.email2.trim() == '') {
      this.btnEmail2.show = false;
    } else {
      this.btnEmail2.show = true;
    }

    if (this.alumno.telefono == null || this.alumno.telefono == '') {
      this.btnTelefono1.show = false;
    } else {
      this.btnTelefono1.show = true;
    }
    if (this.alumno.telefono2 == null || this.alumno.telefono2 == '') {
      this.btnTelefono2.show = false;
    } else {
      this.btnTelefono2.show = true;
    }

    this.formInformacionCliente.get('emailPrincipal').setValue(this.email1);
    this.formInformacionCliente.get('emailSecundario').setValue(this.email2);
    this.formInformacionCliente.get('celularPrincipal').setValue(this.celular1);
    this.formInformacionCliente.get('celularSecundario').setValue(this.celular2);
    this.formInformacionCliente.get('telefonoPrincipal').setValue(this.telefono1);
    this.formInformacionCliente.get('telefonoSecundario').setValue(this.telefono2);
   
    if (
      this.alumno.idCodigoPais != null &&
      this.agendaService.configuracionOpenVox != null
    ) {
      let listaPaisesPermitidos = this.agendaService.configuracionOpenVox.map(
        (x) => x.idPais
      );
      this.mostrarOpenVoxFijo(listaPaisesPermitidos, this.alumno);
    }
    this.selectedEmail=1;
    this.selectedPhone=1;
    this.correoSeleccionado=this.email1;
    this.celularSeleccionado = { celular: this.esRingover ? this.celular1Temp : this.celular1, telefonoSalida: 5 };
  }
  onPhoneSelectionChange(){
    if(this.selectedPhone==1){
      this.celularSeleccionado = { celular: this.esRingover ? this.celular1Temp : this.celular1, telefonoSalida: 5 };
    }
    else if(this.selectedPhone==2){
      this.celularSeleccionado = { celular: this.esRingover ? this.celular2Temp : this.celular2, telefonoSalida: 6 };
    }
  }
  onEmailSelectionChange() {
    if(this.selectedEmail==1){
      this.correoSeleccionado=this.email1
    }
    else if(this.selectedEmail==2){
      this.correoSeleccionado=this.email2
    }
  }

  mostrarOpenVoxFijo(listaIdPaises: number[], alumno: any) {
    if (listaIdPaises.find((x) => x == alumno.idCodigoPais) != null) {
      if (alumno.celular != null && alumno.celular.trim() != '') {
        this.btnCelularFijo1.show = true;
      }
      if (alumno.celular2 != null && alumno.celular2.trim() != '') {
        this.btnCelularFijo2.show = true;
      }
    } else {
      this.btnCelularFijo1.show = false;
      this.btnCelularFijo2.show = false;
    }
  }

  ocultarOpenVoxFijo() {
    // $('#pantalla2btn_celular_fijo').hide();
    // $('#pantalla2btn_celular2_fijo').hide();
    // $('#legendtelefonos').hide();
  }

  comboCentroCosto: any = [];
  comboCentroCostoTemp: any = [];
  // filterCentroCosto(value: string) {
    // console.log(value);
    // if (value.length >= 4) {
      
    // } else if (value.length > 0) {
    //   this.comboCentroCosto = [];
    // } else {
    //   this.comboCentroCosto = this.comboCentroCostoTemp;
    // }
  // }

  changeEstado(event: number[]) {
    this.dataSubEstados = [];
    this.agendaService.agendaBandejaCorreoOperacionesService
      .obtenerSubEstadosMatricula$(event)
      .subscribe({
        next: (resp: HttpResponse<any[]>) => {
          console.log(resp.body);
          if (resp.body.length > 0) {
            this.obtenerGrupoCentroCostoEstadoSubEstado();
            this.dataSubEstados = resp.body;
          }
        },
        error: (error) => {},
      });
  }
  envioCorreosGrupos = '';
  nroCorreosGrupo = 0;
  envioGrupo: boolean = false;
  changeCentroCosto(idCentroCosto: number) {
    this.dataVersiones = [];

    if (idCentroCosto != null) {
      this.agendaService.agendaBandejaCorreoOperacionesService
        .obtenerPaquetesMontoPago$(idCentroCosto)
        .subscribe({
          next: (resp) => {
            if (resp.body.length > 0) {
              this.dataVersiones = resp.body;
              this.formRedactarMensaje.get('para').setValue(this.destinatario);
              this.envioCorreosGrupos = '';
              this.nroCorreosGrupo = 0;
              this.envioGrupo = false;
            } else {
              this.obtenerGrupoCentroCostoSinVersion(idCentroCosto);
            }
          },
          error: (error) => {
            console.log(error);
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formRedactarMensaje.get('versiones').setValue([]);
      this.formRedactarMensaje.get('estado').setValue([]);
      this.formRedactarMensaje.get('subestado').setValue([]);
    }
  }

  obtenerGrupoCentroCostoSinVersion(idCentroCosto: number) {
    let param = {
      paquete: this.fRedactarMensaje.versiones,
      estado: this.fRedactarMensaje.estados,
      subEstado: this.fRedactarMensaje.subEstados,
      idCentroCosto: idCentroCosto,
    };
    this.agendaService.agendaBandejaCorreoOperacionesService
      .obtenerCorreosGrupos$(param)
      .subscribe({
        next: (resp) => {
          console.log(resp);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  get fRedactarMensaje(): IFormRedactarMensajeOperaciones {
    return this.formRedactarMensaje.getRawValue() as IFormRedactarMensajeOperaciones;
  }

  obtenerGrupoCentroCostoEstadoSubEstado() {
    if (
      this.dataVersiones.length > 0 &&
      this.fRedactarMensaje != null &&
      this.fRedactarMensaje.versiones.length == 0
    ) {
      alert('Seleccione al menos una Version');
      return;
    }

    let param = {
      paquete: this.fRedactarMensaje.versiones,
      estado: this.fRedactarMensaje.estados,
      subEstado: this.fRedactarMensaje.subEstados,
      idCentroCosto: this.fRedactarMensaje.grupo,
    };

    this.agendaService.agendaBandejaCorreoOperacionesService
      .obtenerCorreosGrupos$(param)
      .subscribe({
        next: (resp) => {
          console.log(resp.body);
          if(!resp.body.errores){
            this.envioCorreosGrupos = resp.body.listaCorreos;
            this.nroCorreosGrupo = resp.body.totalCorreos;
            this.envioGrupo = true;
            this.formRedactarMensaje.get('para').setValue(resp.body.listaCorreos);
          }else{
            this.envioCorreosGrupos = '';
            this.nroCorreosGrupo = 0;
            this.envioGrupo = false;
            this.formRedactarMensaje.get('para').setValue(this.destinatario);
          }
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
  /**
   * Limpieza del numero de celular del alumno
   * @param {string} numeroCelular
   * @param {number} idCodigoPais
   * @returns
   */
  private limpiarCelularRingover(numeroCelular: string, idCodigoPais: number) {
    numeroCelular = numeroCelular ?? '';
    numeroCelular = numeroCelular.trim();
    numeroCelular = numeroCelular
      .replace('+', '')
      .replace('-', '')
      .replace('_', '')
      .replace(' ', '')
      .replace('/', '');
    if (numeroCelular.substring(0, 1) == '0') {
      for (let i = 0; i < numeroCelular.length; i++) {
        let caracter = numeroCelular.substring(0, 1);
        if (caracter == '0') {
          numeroCelular = numeroCelular.substring(1);
        } else {
          break;
        }
      }
    }
    let numeroCelularRingover = numeroCelular;
    switch (idCodigoPais) {
      case 57:
        if (!numeroCelular.startsWith('57') && numeroCelular != '') {
          numeroCelular = '57' + numeroCelular;
        }
        break;
      case 591:
        if (!numeroCelular.startsWith('591') && numeroCelular !== '') {
          numeroCelular = '591' + numeroCelular;
        }
        break;
      case 52:
        if (!numeroCelular.startsWith('52') && numeroCelular !== '') {
          numeroCelular = '52' + numeroCelular;
        } else {
          if (
            numeroCelular.startsWith('521') &&
            numeroCelular.trim().length > 10
          ) {
            numeroCelular = '52' + numeroCelular.substring(3);
          }
        }
        break;
      case 56:
        if (!numeroCelular.startsWith('56') && numeroCelular !== '') {
          numeroCelular = '56' + numeroCelular;
        }
        break;
      case 51:
        if (numeroCelular.startsWith('51') && numeroCelular != '') {
          numeroCelular = numeroCelular.substring(2);
        }
        break;
      default:
        if (
          idCodigoPais != null &&
          idCodigoPais > 0 &&
          !numeroCelular.startsWith(idCodigoPais.toString()) &&
          numeroCelular !== ''
        ) {
          numeroCelularRingover = `+${idCodigoPais}${numeroCelular}`;
        } else {
          numeroCelularRingover = `+${numeroCelular}`;
        }
        break;
    }
    if (idCodigoPais == 51) {
      numeroCelularRingover = `+51${numeroCelular}`;
    } else if (
      idCodigoPais == 591 ||
      idCodigoPais == 57 ||
      idCodigoPais == 52 ||
      idCodigoPais == 51 ||
      idCodigoPais == 56
    ) {
      numeroCelularRingover = `+${numeroCelular}`;
    }
    let resultado = {
      numeroCelular: numeroCelular.trim(),
      numeroCelularRingover: numeroCelularRingover,
    };
    return resultado;
  }

  limpiarCelular(numeroCelular: any, idCodigoPais: any) {
    let prefijo = '';
    switch (idCodigoPais) {
      case 57:
        if (
          !numeroCelular.startsWith('0057') &&
          !numeroCelular.startsWith('57') &&
          !numeroCelular.startsWith('+57') &&
          !numeroCelular.startsWith('057') &&
          !numeroCelular.startsWith('+057') &&
          !numeroCelular.startsWith('+0057') &&
          numeroCelular != ''
        ) {
          numeroCelular = '0057' + numeroCelular;
        }
        // prefijo = '0801'
        break;
      case 591:
        if (
          !numeroCelular.startsWith('00591') &&
          !numeroCelular.startsWith('591') &&
          !numeroCelular.startsWith('+591') &&
          !numeroCelular.startsWith('0591') &&
          !numeroCelular.startsWith('+0591') &&
          !numeroCelular.startsWith('+00591') &&
          numeroCelular !== ''
        ) {
          numeroCelular = '00591' + numeroCelular;
        }
        // prefijo = '0701'
        break;
      case 52:
        if (
          !numeroCelular.startsWith('0052') &&
          !numeroCelular.startsWith('52') &&
          !numeroCelular.startsWith('+52') &&
          !numeroCelular.startsWith('052') &&
          !numeroCelular.startsWith('+052') &&
          !numeroCelular.startsWith('+0052') &&
          numeroCelular !== ''
        ) {
          numeroCelular = '0052' + numeroCelular;
        }
        // prefijo = '0901'
        break;
      case 56:
        if (
          !numeroCelular.startsWith('0056') &&
          !numeroCelular.startsWith('56') &&
          !numeroCelular.startsWith('+56') &&
          !numeroCelular.startsWith('056') &&
          !numeroCelular.startsWith('+056') &&
          !numeroCelular.startsWith('+0056') &&
          numeroCelular !== ''
        ) {
          numeroCelular = '0056' + numeroCelular;
        }
        // prefijo = '0301'
        break;
      case 51:
        if (numeroCelular.startsWith('0051')) {
          numeroCelular = numeroCelular.substring(4);
        }
        if (numeroCelular.startsWith('51')) {
          numeroCelular = numeroCelular.substring(2);
        }
        if (numeroCelular.startsWith('+51')) {
          numeroCelular = numeroCelular.substring(3);
        }
        if (numeroCelular.startsWith('051')) {
          numeroCelular = numeroCelular.substring(3);
        }
        if (numeroCelular.startsWith('+051')) {
          numeroCelular = numeroCelular.substring(4);
        }
        if (numeroCelular.startsWith('+0051')) {
          numeroCelular = numeroCelular.substring(5);
        }
        // const listaTexto = ['050151', '060151'];
        // // Generar un índice aleatorio
        // const indiceAleatorio = Math.floor(Math.random() * listaTexto.length);
        // // Obtener el elemento de la lista de texto
        // const elementoAleatorio = listaTexto[indiceAleatorio];
        // prefijo = elementoAleatorio
        break;
      default:
        break;
    }

    if (idCodigoPais == 591 || idCodigoPais == 57 || idCodigoPais == 52 || idCodigoPais == 56) {
      numeroCelular = numeroCelular
        .replace('+', '')
        .replace('-', '')
        .replace('_', '')
        .replace(' ', '')
        .replace('/', '');

      if (numeroCelular.substring(0, 1) == '0') {
        for (let i = 0; i < numeroCelular.length; i++) {
          let caracter = numeroCelular.substring(0, 1);
          if (caracter == '0') {
            numeroCelular = numeroCelular.substring(1);
          } else {
            break;
          }
        }
      }
    }
    let resultado = {
      numeroCelular: numeroCelular.trim(),
      prefijo: prefijo
    }
    return resultado;
  }

  cargarPlantillasWhatsApp() {
    let idPais: any = 0;
    let numero: any = '';
    if (this.alumno.idCodigoPais == 51) {
      idPais = 51;
      numero = `51${this.celularWhatsApp}`;
    } else if (this.alumno.idCodigoPais == 57) {
      // Colombia
      idPais = 57;
      numero = this.celularWhatsApp;
    } else if (this.alumno.idCodigoPais == 591) {
      // Bolivia
      idPais = 591;
      numero = this.celularWhatsApp;
    } else if (this.alumno.idCodigoPais == 52) {
      // Mexico
      idPais = 52;
      if (!this.celularWhatsApp.startsWith('521')) {
        numero = this.celularWhatsApp.substring(2);
        numero = `521${numero}`;
      } else {
        numero = this.celularWhatsApp;
      }
    } else {
      idPais = 0;
      numero = this.celularWhatsApp;
    }
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.objetoWhatsApp.idPais =
      idPais;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.objetoWhatsApp.numero =
      numero;
    this.agendaService.agendaAlumnoOperacionesService.numeroWhatsApp$.next(
      numero
    );
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService
      .obtenerPlantillaWhatsApp()
      .subscribe({
        next: (resp: any) => {
          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.plantillaWhatsApp$.next(
            resp.body
          );
          this.agendaService.agendaInformacionActividadOportunidadOperacionesService.objetoWhatsApp.plantillaWhatsApp =
            resp.body;
        },
      });
  }

  sendMessageAcrossMandrill() {
    console.log('sendMessageAcrossMandrill');
    this.btnEnviarMensajeDisabled = true;
    let formData = new FormData();
    
    // const mensaje = btoa(decodeURI(encodeURI(dataFormulario.mensaje)));
    //Llenamos el FormData
    const mensaje = Buffer.from(
      decodeURI(encodeURI(this.fRedactarMensaje.mensaje))
    ).toString('base64');
    formData.append('IdActividadDetalle', String(this.rowActual.id));
    formData.append('Idcentrocosto', String(this.rowActual.idCentroCosto));
    formData.append('Idoportunidad', String(this.rowActual.idOportunidad));
    formData.append('Remitente', this.fRedactarMensaje.de);
    formData.append('Destinatario', this.fRedactarMensaje.para);
    formData.append('Asunto', this.fRedactarMensaje.asunto);
    formData.append('Mensaje', mensaje);
    formData.append('DestinatarioCc', this.fRedactarMensaje.conCopia == null ? '' : this.fRedactarMensaje.conCopia);
    formData.append('DestinatarioBcc', '');
    formData.append('Usuario', this.agendaService.userName);
    formData.append('IdAsesor', String(this.agendaService.idPersonal));

    if(this.envioGrupo){
      formData.append('GrupoEmail', this.envioCorreosGrupos);
      formData.append('EnvioGrupo', 'true');
      }
      
      if (this.fRedactarMensaje.adjuntar != null && this.fRedactarMensaje.adjuntar.length > 0) {
        for (let index = 0; index < this.fRedactarMensaje.adjuntar.length; index++) {
          formData.append('Files', this.fRedactarMensaje.adjuntar[index]);
      }
      }
      this.formRedactarMensaje.get('mensaje').setValue('');
      
    this.isMessageSending = true;
    this.agendaService.agendaActividadesOperacionesService
      .sendMessageAcrossMandrill$(formData)
      .subscribe({
        next: (response: boolean) => {
          console.log(response);
          if (response == true) {
            // alert('mensaje enviado');
          }
          this.alertaService.mensajeCorreoExitoso();
          this.formRedactarMensaje.reset();
          this.btnEnviarMensajeDisabled = false;
          this.isMessageSending = false;
          this.modalRefRedactarMensaje.close('submitted');
        },
        error: (error) => {
          this.btnEnviarMensajeDisabled = false;
          this.isMessageSending = false;
          this.alertaService.notificationWarning(error);
          // ("#mensajeCorreo").html("");
          // $('#buttonShowEditMessage').removeClass('disabled');
        },
        complete: () => {},
      });
  }


  changePlantilla(idPlantilla: number) {
    this.formRedactarMensaje
            .get('mensaje')
            .setValue('');
    this.agendaService.agendaHistorialChatOperacionesService
      .remplazarPlantillaHistorial$(
        this.agendaService.rowActual.idOportunidad,
        idPlantilla
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.formRedactarMensaje.get('asunto').setValue(response.body.asunto);
          this.formRedactarMensaje
            .get('mensaje')
            .setValue(response.body.cuerpoHTML);
        },
        error: (error: any) => {
          console.log(error);
          // this.alertaService.notificationError(`Error: ${this.reconocerError(error)}`)
        },
      });
  }

  resetFormRedactarMensaje(){
    this.formRedactarMensaje.reset();
    this.formRedactarMensaje.patchValue({
      asunto: null,
      de: null,
      para: null,
      conCopia: null,
      plantilla: null,
      grupo: null,
      versiones: null,
      estados: [],
      subEstados: [],
      adjuntar: null,
      mensaje: null,
    });
  }

  generarPlantillaCorreo(context: any) {
    this.btnEnviarMensajeDisabled = false;
    // this.formRedactarMensaje.reset();
    this.formRedactarMensaje.get('mensaje').setValue('');
    this.modalRefPlantilla.close();
    this.agendaService.agendaValorEtiquetaOperacionesService.valoresEtiquetas();
    const plantillas = this.plantillasPorIdFaseOportunidad;
    if (
      this.controlPlantillaMensaje.id == 1227 ||
      this.controlPlantillaMensaje.id == 1245
    ) {
      this.formRedactarMensaje
        .get('conCopia')
        .setValue('matriculas@bsginstitute.com');
    }
    let PlantillaAsunto: any = plantillas.filter(
      (item) =>
        item.clave == 'Asunto' &&
        item.idPlantilla == this.controlPlantillaMensaje.id
    );
    let PlantillaMensaje: any = plantillas.filter(
      (item) =>
        item.clave == 'Texto' &&
        item.idPlantilla == this.controlPlantillaMensaje.id
    );

    this.Asunto =
      this.agendaService.agendaValorEtiquetaOperacionesService.cargarValoresEtiqueta(
        PlantillaAsunto
      );

    if (this.controlPlantillaMensaje.nombre.includes('Lista')) {
      let idPadre = this.rowActual.idPadre ?? this.rowActual.idOportunidad;
      this.agendaService.agendaValorEtiquetaOperacionesService
        .obtenerValorEtiquetaListas$(
          this.rowActual.idOportunidad,
          PlantillaMensaje[0].idAreaEtiqueta
        )
        .subscribe({
          next: (data: any) => {
            this.agendaService.agendaValorEtiquetaOperacionesService.dataListaPlantilla =
              data.body;
            PlantillaMensaje[0].valor;
            var MensajeContenido =
              this.agendaService.agendaValorEtiquetaOperacionesService.cargarValoresEtiqueta(
                PlantillaMensaje
              );
            // this.formRedactarMensaje.get('mensaje').setValue(dataListaPlantilla)
            this.formRedactarMensaje
              .get('mensaje')
              .setValue(MensajeContenido[0].valor);

            // $('#modalGeneraMensaje').modal('hide');
            // $('#modalMensaje').modal('show');
          },
        });
    } else {
      this.formRedactarMensaje
        .get('de')
        .setValue(this.agendaService.datosPersonal.email);
      this.formRedactarMensaje.get('para').setValue(this.destinatario);
      this.formRedactarMensaje
        .get('plantilla')
        .setValue(this.controlPlantillaMensaje.id);
      // this.formRedactarMensaje.get('plantilla').setValue(this.agendaService.datosPersonal.email);
      // this.formRedactarMensaje.get('grupo').setValue(this.agendaService.datosPersonal.email);
      // this.formRedactarMensaje.get('versiones').setValue(this.agendaService.datosPersonal.email);
      // this.formRedactarMensaje.get('estado').setValue(this.agendaService.datosPersonal.email);
      // this.formRedactarMensaje.get('subestado').setValue(this.agendaService.datosPersonal.email);
      // this.formRedactarMensaje.get('adjuntar').setValue(this.agendaService.datosPersonal.email);
      // this.formRedactarMensaje.get('mensaje').setValue(this.agendaService.datosPersonal.email);

      this.agendaService.agendaActividadesOperacionesService
        .generarPlantillaMailing$(
          this.rowActual.idOportunidad,
          this.controlPlantillaMensaje.id
        )
        .subscribe({
          next: (resp: HttpResponse<IPlantillaMailing>) => {
            this.formRedactarMensaje.get('asunto').setValue(resp.body.asunto);
            this.formRedactarMensaje
              .get('mensaje')
              .setValue(resp.body.cuerpoHTML);
          },
          error: (error) => {
            console.log(error);
            this.alertaService.notificationWarning(error.cuerpoHTML);
          },
        });
    }

    this.modalRefRedactarMensaje = this.modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
    });
  }
  filterPlantillas(value: string) {
    if (value.length >= 1) {
      this.plantillaMensajeFiltro = this.sourcePlantillaMensaje.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.plantillaMensajeFiltro = this.sourcePlantillaMensaje;
    }
  }

  abrirModalPlantilla(context: any, selectedEmail: number) {
    this.loadingPlantilla = true;
    this.modalRefPlantilla = this.modalService.open(context, {
      backdrop: 'static',
    });
    this.controlPlantillaMensaje = null;
    //this.destinatario = email;
    // this.esOcultarTexto
    //   ? (this.destinatario = this.agendaService.ocultarTexto(email))
    //   : (this.destinatario = email);
    if(selectedEmail==2){this.destinatario=this.email2Envio}else{this.destinatario=this.email1Envio}
    this.agendaService.agendaActividadesOperacionesService
      .obtenerPlantillaModuloAgenda$()
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.plantillaMensajeFiltro = response.body.data;
          this.sourcePlantillaMensaje = response.body.data;
          this.loadingPlantilla = false;
        },
        error: (error) => {
          this.loadingPlantilla = false;
          console.log(error);
        },
      });
  }

  toEditDatosPersonales() {
    console.log('pruebaedit');
    let selectEvent = new SelectEvent(1, 'Editar Datos Personales');
    this.agendaService.selectTabFicha$.emit(selectEvent);
  }
  solicitarVisualizacion() {
    let obj : any = {
      idOportunidad: this.rowActual.idOportunidad,
      idPersonal: this.agendaService.idPersonal,
    }
    this.integraService.postJsonResponse(constApiComercial.AgendaInformacionActividadValidarVisualizacionDatosOportunidad,obj).subscribe({
      next: (response: HttpResponse<any>) => {

      },
      error: (error) => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          text: error.error,
        })
      }
    });
  }
  copyToClipboard(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    Swal.fire({
      icon: 'success',
      position:'top-start',
      width: 250,
      title: '¡Texto copiado!',
      showConfirmButton: false,
      timer: 320
    });
  }
  /* */

  cargarPantalla1(){
    this.estadoMatricula=this.rowActual.estadoMatricula;
    this.subEstadoMatricula=this.rowActual.subEstadoMatricula;
    this.centroCosto=this.rowActual.centroCosto;
    this.tarifario=this.rowActual.tarifario;
    this.obtenerFechaPagoCategoria(this.rowActual.idMatriculaCabecera);
    this.obtenerNombreEsquemaEvaluacionPorMatricula(this.rowActual.idMatriculaCabecera);
    this.obtenerfechafinalizacionMatricula();
    if (this.rowActual.fechaGrabacion !== null) {
      // $("#RankingOperaciones").css('background', '#088A08');//verde
      this.colorRankingOperaciones='#088A08'
    }
    else if (this.rowActual.fechaVerificacion !== null) {
       var fechaactual = new Date();
      if ((this.calcularDiferenciaDiasFecha(new Date(), new Date(this.rowActual.fechaVerificacion)))<7
      ) {
          //$("#RankingOperaciones").css('background', '#3379a4');//azul
          this.colorRankingOperaciones='#3379a4'
      }
      if ((this.calcularDiferenciaDiasFecha(new Date(), new Date(this.rowActual.fechaVerificacion)))>= 7) {
          // $("#RankingOperaciones").css('background', '#FF0000');//rojo
          this.colorRankingOperaciones='#FF0000'
      }
    }
    else {
      // $("#RankingOperaciones").css('background', '#FF0000');//rojo
      this.colorRankingOperaciones='#FF0000'
    }
    console.log("here")
  }
  obtenerFechaPagoCategoria(idMatriculaCabecera:any){
    //obtenerFechaPagoCategoria$
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerFechaPagoCategoria$(idMatriculaCabecera)
      .subscribe({
        next: (response: any) => {
          let data=response.body;
          console.log(response.body);
          var valEstado = data[0].idEstado_matricula;
            var valSubestado = data[0].idSubEstadoMatricul;
            var fechaven = data[0].fechaVencimiento;
            var fechapag = data[0].fechaPago;
            var idCategoriaAlumno = data[0].idCategoriaAlumno;
            if (idCategoriaAlumno != null) {
                var aux = this.objetoCategoriaAlumno[idCategoriaAlumno]["nombre"];
                this.categoriaAlumno=aux;
                return aux;
            }
            var fecha2;
            if (fechapag == null) {
                const fecha = new Date();
                // fecha2 = moment(fecha.toISOString());
                fecha2 = fecha.toISOString();

            }
            else {
                // fecha2 = moment(fechapag);
                fecha2 = new Date(fechapag);

            }
            // var fecha1 = moment(fechaven);
            let fecha1 = new Date(fechaven);
            // let diferencia = new Date(fechapag).getDay()-new Date(fechaven).getDay();
            let diferencia = this.calcularDiferenciaDiasFecha(fecha2,fecha1);
            if (diferencia >= 0) {
              this.categoriaAlumno="Estandar";
                return "Estandar";
            }


            var valdias = diferencia * -1;

            for (let clave in this.objetoCategoriaAlumno) {
                let nombre = this.objetoCategoriaAlumno[clave]["nombre"];
                let idEstado:any[] = this.objetoCategoriaAlumno[clave]["idEstados"].split(',').map(Number);
                let aux = this.objetoCategoriaAlumno[clave]["idSubEstados"]
                let vencimiento = this.objetoCategoriaAlumno[clave]["cantidadDiasVencimiento"];
                let a = idEstado.find(val => val == valEstado);
                if (aux == null) {
                    if (a != undefined) {
                        if (vencimiento <= valdias) {
                            this.categoriaAlumno=nombre;
                            return nombre;
                        }
                    }
                    else {
                        this.categoriaAlumno="No definido";
                        return "No definido";
                    }
                }
                var idSubestado:any[] = this.objetoCategoriaAlumno[clave]["idSubEstados"].split(',').map(Number);

                if (a != undefined) {

                    var b = idSubestado.find(val => val == valSubestado);
                    if (b != undefined) {
                        if (vencimiento <= valdias) {
                            this.categoriaAlumno=nombre;
                            return nombre;
                        }
                    }
                    if (vencimiento <= valdias) {
                        this.categoriaAlumno=nombre;
                        return nombre;

                    }
                }
            }
            this.categoriaAlumno="No definido";
            return "No definido";
        },
      })
  }
  obtenerCategoriaAlumno(){
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerCategoriaAlumno$()
      .subscribe({
        next: (response: any) => {
          let data=response.body;
          this.objetoCategoriaAlumno = data;
        },
      })
  }
  calcularDiferenciaDiasFecha(fechaIni:any, fechaFin:any){
    return Math.floor((Date.UTC(fechaIni.getFullYear(), fechaIni.getMonth(), fechaIni.getDate()) - Date.UTC(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  obtenerNombreEsquemaEvaluacionPorMatricula(idMatriculaCabecera:any){
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerNombreEsquemaEvaluacionPorMatricula$(idMatriculaCabecera)
    .subscribe({
      next: (response: any) => {
        console.log(response);
        let data=response.body;
        this.solicitudEsquemasEvaluacion = data;
      },
    })
  }

  obtenerfechafinalizacionMatricula(){
    this.agendaService.agendaAlumnoOperacionesService.fechaFinalizacionMatricula$.subscribe(
      {
        next:(response:any)=>{
          console.log(response);
          this.fechaFinalizacion=response.rptas;
        }
      }
    )
  }

  limpiarModalSolicitudCambio()
  {
    this.verEstado=false;
    this.verSubEstado=false;
    this.verCentroCosto=false;
    this.verFechaFinalizacion=false;
    this.verCategoriaAlumno=false;
    this.verCambioVersion=false;
    this.verCambioGeneral=false;
    this.verAdjuntarComprobante=false;
    this.formSolicitudes.get('idEstadoMatricula').setValue(null);
    this.formSolicitudes.get('idCategoriaAlumno').setValue(null);
    this.formSolicitudes.get('idSubEstadoMatricula').setValue(null);
    this.formSolicitudes.get('comentarioSolicitud').setValue("");
    this.modalRef.close();
  }

  abrirModalSolicitudCambio(idTipoSolicitudOperaciones: any) {

    if (idTipoSolicitudOperaciones === 1) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.tituloModalSolicitudCambio="Solicitar Cambio Centro Costo";
      this.verCentroCosto=true;

  }
  else if (idTipoSolicitudOperaciones === 3) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.tituloModalSolicitudCambio="Solicitar Cambio de Version";
      this.verCambioVersion=true;

  }
  else if (idTipoSolicitudOperaciones === 4) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.verSubEstado=false;

      this.tituloModalSolicitudCambio="Solicitar Cambio Estado";
      //$("#lblValorNuevo").text("Nuevo Estado");
      this.verEstado=true;

  }
  else if (idTipoSolicitudOperaciones === 5) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      let subestadoActual = this.rowActual.subEstadoMatricula
      let dataItem = this.dataSubEstadoMatricula.filter(x => x.idEstadoMatricula === this.rowActual.idEstadoMatricula && x.nombre!==subestadoActual);
      this.dataComboSubEstadoMatricula=dataItem;

      if (dataItem.length === 0) {
        this.conSubEstado=false;
          this.textoSubEstado="El Sub Estado se  Genera Automaticamentes";
          this.disableBotonSolicitarCambio=true;
      }
      else {
        this.conSubEstado=true;
        this.textoSubEstado="";
        this.disableBotonSolicitarCambio=false;
      }

      this.tituloModalSolicitudCambio="Solicitar Cambio Sub Estado";
      //$("#lblValorNuevo").text("Nuevo Sub Estado");
      this.verSubEstado=true;
  }
  else if (idTipoSolicitudOperaciones === 6) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.tituloModalSolicitudCambio="Solicitar Cambio de AutoEvaluaciones";
      //$("#lblValorNuevo").text("AutoEvaluacion");
      this.verCambioGeneral=true;
  }
  else if (idTipoSolicitudOperaciones === 7) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.tituloModalSolicitudCambio="Solicitar Cambio de Fecha de Finalizacion";
      //$("#lblValorNuevo").text("AutoEvaluacion");
      this.verFechaFinalizacion=true;
  }
  else if (idTipoSolicitudOperaciones === 9) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.tituloModalSolicitudCambio="Solicitar Cambio Categoria";
      this.verCategoriaAlumno=true;
  }
    this.modalRef = this.modalService.open(this.modalSolicitudCambio, {
      size: 'small',
      animation: true,
      backdrop: 'static',
    });
  }

  abrirModalMatriculas() {
    this.modalRef = this.modalService.open(this.modalMatriculas, {
      size: 'xl',
      animation: true,
      backdrop: 'static',
    });
  }

  // filterByCentroCosto(value: string) {
  //   if (value.length >= 4) {
  //     this.integraService
  //       .obtenerPorFiltro(constApiComercial.CentroCostoObtenerAutocompleteCentroCosto, {
  //         valor: value,
  //       })
  //       .subscribe({
  //         next: (response) => {
  //           this.dataCentroCosto = response.body.filter((x:any)=>x.nombre.toLowerCase().includes('webinar') == false);
  //         },
  //       });
      
  //   } else if(value.length == 0) {
      
  //   }
  // }
  registrarSolicitudOperaciones() {
    this.buttonSolicitud=true;
    let cantidadSubEstado=0;
    if(this.formSolicitudes.get('comentarioSolicitud').value == null){
      return Swal.fire({
        icon: 'warning',
        title: "Ingrese un comentario Por favor",
      });
    }
    if (this.idTipoCambioOperacionesGeneral === 2) {}
    else{
      let objeto:any = new Object();
      objeto.idTipoSolicitudOperaciones = this.idTipoCambioOperacionesGeneral;
      objeto.idOportunidad = this.rowActual.idOportunidad;
      if (!this.esCordinadora) {
        objeto.aprobado = false;
        objeto.idPersonalSolicitante = this.rowActual.idPersonal_Asignado;
        objeto.idPersonalAprobacion = this.personal.idJefe;
      }
      else {
          objeto.aprobado = true;
          // objeto.idPersonalAprobacion = this.rowActual.idPersonal_Asignado;
          objeto.idPersonalSolicitante = this.userService.idPersonal;
          objeto.idPersonalAprobacion = this.userService.idPersonal;

      }
      if (this.idTipoCambioOperacionesGeneral === 1)/*1: Centro Costo*/ {
          if(this.formSolicitudes.get('idCentroCosto').value == null){
            return Swal.fire({
              icon: 'warning',
              title: "Ingrese un Centro de Costo Por favor",
            });
          }
          objeto.valorAnterior = this.rowActual.centroCosto;
          objeto.valorNuevo =this.formSolicitudes.get('idCentroCosto').value.nombre ;
          objeto.comentarioSolicitante =this.formSolicitudes.get('comentarioSolicitud').value;
          objeto.usuario = this.agendaService.userName;
      }
      else if (this.idTipoCambioOperacionesGeneral === 3)/*3: Version*/ {
          objeto.valorAnterior = this.version;
          objeto.valorNuevo = this.formSolicitudes.get('idVersion').value.nombre ;
          objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
          objeto.usuario = this.agendaService.userName;
      }
      else if (this.idTipoCambioOperacionesGeneral === 4)/*4: Estado*/ {
          let estado = this.formSolicitudes.get('idEstadoMatricula').value;
          // let subEstado = this.formSolicitudes.get('idSubEstadoMatricula').value;
          let subEstado = estado?.estadoMatricula == "ABANDONO" ?  {id: 20, nombre: 'Abandonado', idEstadoMatricula: 8}
          : this.formSolicitudes.get('idSubEstadoMatricula').value;
          if(
            this.dataComboSubEstadoMatricula?.length!==0 &&
            subEstado?.nombre == null &&
             estado?.estadoMatricula!=="REGULAR"
             ){
            Swal.fire({
              icon: 'warning',
              title: "Seleccione un Sub Estado",
            })
            return alert("Seleccione un Sub Estado");
          }
          if (this.conSubEstado) {
            cantidadSubEstado = this.dataComboSubEstadoMatricula.length;
          }

          objeto.valorAnterior = this.rowActual.estadoMatricula;
          objeto.valorNuevo = this.formSolicitudes.get('idEstadoMatricula').value.estadoMatricula;
          objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
          objeto.usuario = this.agendaService.userName;
          if (objeto.valorNuevo === 'ABANDONO' || (objeto.valorNuevo === 'REGULAR' && subEstado?.nombre != 'En Recuperación de Curso') )
          {
              cantidadSubEstado = 0;
          }
          else
          {
              objeto.valorNuevoSubestado = this.formSolicitudes.get('idSubEstadoMatricula').value.nombre;
          }

      }
      else if (this.idTipoCambioOperacionesGeneral === 5)/*5: SubEstado*/ {
          objeto.valorAnterior = this.rowActual.subEstadoMatricula === null ? "Sin SubEstado" : this.rowActual.subEstadoMatricula;
          objeto.valorNuevo = this.formSolicitudes.get('idSubEstadoMatricula').value.nombre;
          objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
          objeto.usuario = this.agendaService.userName;
      }
      // else if (this.idTipoCambioOperacionesGeneral === 6)/*6: Autoevaluaciones*/ {
      //     objeto.valorAnterior = this.rowActual.centroCosto;
      //     objeto.valorNuevo = $("#inputValor").val();
      //     objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
      //     objeto.usuario = this.agendaService.userName;
      // }
      else if (this.idTipoCambioOperacionesGeneral === 7)/*7: Fecha Finalizacion*/ {
          let datePipe = new DatePipe('en-US');
          objeto.valorAnterior = datePipe.transform(this.fechaFinalizacion, 'dd/MM/yyyy');
          objeto.valorNuevo =  datePipe.transform(this.formSolicitudes.get('nuevaFechaFinalizacion').value, 'dd/MM/yyyy');
          objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
          objeto.usuario = this.agendaService.userName;
      }
      else if (this.idTipoCambioOperacionesGeneral === 9)/*9: Categoria Alumno*/ {
          objeto.valorAnterior = this.categoriaAlumno;
          objeto.valorNuevo = this.formSolicitudes.get('idCategoriaAlumno').value.nombre;
          objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
          objeto.usuario = this.agendaService.userName;
      }

      //Insertar solicitud de operaciones
      this.agendaService.agendaInformacionActividadOportunidadOperacionesService.insertarSolicitudOperaciones$(objeto).subscribe({
        next:(response:any)=>{
          this.buttonSolicitud=false;
          console.log(response);
          let data=response;
          console.log("insercionsolicitudoperaciones");
          this.cargarHistorialSolicitudOperaciones()
          if(this.esCordinadora){
            if(this.idTipoCambioOperacionesGeneral==3){
              let obj: any = {};
            obj.idSolicitudOperaciones = response.id;
            obj.usuario = response.usuarioCreacion;
            obj.observacion = response.comentarioSolicitante;
            this.agendaService.agendaInformacionActividadOportunidadOperacionesService
              .realizadoSolicitudOperaciones$(obj)
              .subscribe({
                next: (response: any) => {
                  console.log(response);
                },
              });
            }
            this.aprobarSolicitudCoordinador(response);
            if(this.idTipoCambioOperacionesGeneral==4 && cantidadSubEstado!=0){
              objeto.idTipoSolicitudOperaciones=5;
              objeto.relacionEstadoSubEstado=data.id;
              objeto.valorAnterior=this.rowActual.subEstadoMatricula == null? "Sin SubEstado":this.rowActual.subEstadoMatricula;
              objeto.valorNuevo=this.formSolicitudes.get('idSubEstadoMatricula').value.nombre;
              objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
              objeto.idPersonalSolicitante
              this.agendaService.agendaInformacionActividadOportunidadOperacionesService.insertarSolicitudOperaciones$(objeto).subscribe({
                next:(response:any)=>{
                  this.cargarHistorialSolicitudOperaciones()
                  if(this.esCordinadora){
                    this.aprobarSolicitudCoordinador(response);
                  }
                  this.limpiarModalSolicitudCambio();
                  console.log("solicitudes");
                }
              });
            }
          }
          else{
            if(this.idTipoCambioOperacionesGeneral==4 && cantidadSubEstado!=0){
              objeto.idTipoSolicitudOperaciones=5;
              objeto.relacionEstadoSubEstado=data.id;
              objeto.valorAnterior=this.rowActual.subEstadoMatricula == null? "Sin SubEstado":this.rowActual.subEstadoMatricula;
              objeto.valorNuevo=this.formSolicitudes.get('idSubEstadoMatricula').value.nombre;
              objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
              this.agendaService.agendaInformacionActividadOportunidadOperacionesService.insertarSolicitudOperaciones$(objeto).subscribe({
                next:(response:any)=>{
                  this.cargarHistorialSolicitudOperaciones()
                }
              });
            }
          }
          this.limpiarModalSolicitudCambio();
        },
        error:(error:any)=>{
          Swal.fire({
            icon: 'error',
            title: error.error,
          })
        }
      });
    }
  }
  generarDataSubEstado(value: any){
    if(value.id!==8){
      let dataItem = this.dataSubEstadoMatricula.filter(x => x.idEstadoMatricula === value.id);
      this.dataComboSubEstadoMatricula=dataItem;
      if (dataItem.length === 0) {
          this.conSubEstado=false;
          this.textoSubEstado="El Sub Estado se  Genera Automaticamentes";
          this.disableBotonSolicitarCambio=true;
      }
      else {
        this.formSolicitudes.get('idSubEstadoMatricula').setValue(null);
        this.conSubEstado=true;
        this.textoSubEstado="";
        this.disableBotonSolicitarCambio=false;
      }
    }
    else{
      this.conSubEstado=false;
      this.textoSubEstado="No hay sub estados Asociados";
      this.disableBotonSolicitarCambio=true;
    }
    this.verSubEstado=true;
  }
  mostrarModalEsquemasEvaluacion(){
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerEsquemaEvaluacionPorMatricula$(this.rowActual.idMatriculaCabecera).subscribe({
      next:(response:any)=>{
        console.log('esquemasJST');
        console.log(response.body);
        this.informacionCursoPrograma=response.body;
        this.cargarGrillaProgramasHijos(response.body);
        this.modalRef = this.modalService.open(this.modalEsquemaEvaluacion, {
          size: 'xl',
          animation: true,
          backdrop: 'static',
        });
      }
    });
  }

  aprobarSolicitudCoordinador(objRow:any){
    this.integraService.getJsonResponse(constApiOperaciones.SolicitudOperacionesAprobarSolicitudOperaciones + '/' + objRow.id  + '/' + this.userService.userData.userName + '/' + this.personal.id ).subscribe({
      next:(response:any)=>{
        console.log(response);
        if(response.body.idTipoSolicitudOperaciones == 4){
          this.estadoMatricula = response.body.valorNuevo;
        }
        else if (response.body.idTipoSolicitudOperaciones == 5){
          this.subEstadoMatricula = response.body.valorNuevo;
        }
        Swal.fire({
          icon: 'success',
          title: "Solicitud Aprobada Correctamente",
        })
      },
      error:(error:any)=>{
        Swal.fire({
          icon: 'error',
          title: "Error al aprobar la solicitud",
        })
      }
    });

    this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudesRealizadas();
  }

  cargarHistorialSolicitudOperaciones(){
    this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
  }
  cargarGrillaProgramasHijos(data:any){
    this.gridEsquemaEvaluacion.data=data;
  }
  verEditarEsquemaEvaluacion(evento:any){
    console.log('ClickJST');
    console.log(evento.dataItem);
    let data=evento.dataItem;
    if (this.informacionCursoPrograma.length < 1) {
      //$("#inputEsquemaEvaluacion").prop("disabled", true);
    }
    this.idPEspecificoGlobal=data.idPEspecifico;
    this.listaEsquemaEvaluacion= this.informacionCursoPrograma.filter(x=>x.idPEspecifico==data.idPEspecifico);

    this.dataEsquemaEvalueacion=this.listaEsquemaEvaluacion[0].esquemasEvaluacion
    let temporal:any[]=this.listaEsquemaEvaluacion[0].esquemasEvaluacion;
    if (this.listaEsquemaEvaluacion[0].esquemasEvaluacion != null) {
      let esquemaEvaluacionSeleccionado = temporal.filter(x => x.idCongelamientoPEspecificoEsquemaEvaluacionMatriculaAlumno != 0);
      console.log(esquemaEvaluacionSeleccionado);
      if (esquemaEvaluacionSeleccionado[0].id != null) {
        this.formEsquemaEvaluacion.get('esquemaEvaluacion').setValue(esquemaEvaluacionSeleccionado[0].id);
        let criteriosEvaluacion = esquemaEvaluacionSeleccionado[0].esquemasEvaluacionDetalle;
        this.cargarEsquemaEvaluacionAlumno(criteriosEvaluacion);
        this.inputFormaCalculoNota=esquemaEvaluacionSeleccionado[0].formaCalculoEvaluacion
      }
      this.verContenedorEsquemasPorPEspecifico=true;
    }
      else {
      this.verContenedorEsquemasPorPEspecifico=false;
    }
  }

  cargarEsquemaEvaluacionAlumno(criterios:any){
    this.gridEsquemaEvaluacionAlumno.data=criterios;
  }
  cambiarEsquemaEvaluacion(event:any){
    let temporal:any[]=this.listaEsquemaEvaluacion[0].esquemasEvaluacion;
    var esquemaSeleccionado = temporal.filter(x => x.Id == event);
    if (esquemaSeleccionado.length != 0) {
        var criteriosEvaluacion = esquemaSeleccionado[0].EsquemasEvaluacionDetalle;
        this.cargarEsquemaEvaluacionAlumno(criteriosEvaluacion)
    }
  }
  cerrarDetalleEsquemaEvaluacion() {
    this.verContenedorEsquemasPorPEspecifico=false;
    this.dataEsquemaEvaluacionAlumno=null;
    this.dataEsquemaEvalueacion= null;
    this.idPEspecificoGlobal = 0;
    this.modalRef.close();
  }
  actualizarEsquema(){
    this.gridEsquemaEvaluacion.loading=true;
    let objetoEsquema:any;
    objetoEsquema.idPEspecifico = this.idPEspecificoGlobal;
    objetoEsquema.idMatriculaCabecera = this.rowActual.idMatriculaCabecera;
    objetoEsquema.idEsquemaEvaluacionGeneral =this.formEsquemaEvaluacion.get('esquemaEvaluacion').value;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.actualizarEsquema$(objetoEsquema).subscribe({
      next: (response: any) => {
        response?.forEach((x:any)=>{x['estadoMatricula'] = x['estadoMatricula'].toUpperCase()});
        response?.sort((a:any,b:any)=>this.sortAlphabetically(a,b,'estadoMatricula'));
        this.dataEstadoMatricula=response;
        this.cerrarDetalleEsquemaEvaluacion()
        this.gridEsquemaEvaluacion.loading=false;
        this.obtenerNombreEsquemaEvaluacionPorMatricula(this.rowActual.idMatriculaCabecera);
      }
    });
  }

  sortAlphabetically(a:any,b:any,field:string){
    let textA = a[field].toUpperCase();
    let textB = b[field].toUpperCase();
    if(textA < textB) return -1;
    if(textA > textB) return 1;
    return 0;
  }

  consultarNroDocumento() {
    // const dni = this.nroDocumento ? this.nroDocumento.trim() : '';
    const docIdentidad = this.nroDocumento.trim();
    const dni = docIdentidad ? docIdentidad.trim() : '';
    this.btnConsultar.disabled = true;
    if (dni.length == 8 && this.rowActual.idCodigoPais==51) {
      this.btnConsultar.disabled = true;
      this.btnConsultar.html = 'Consultar';
      this.btnConsultar.class = 'btn-warning';
      this.btnConsultar.color = 'warning';
      this.agendaService.agendaSentinelOperacionesService
        .actualizarSentinelAlumno$(dni, this.rowActual.idAlumno)
        .subscribe({
          next: (response) => {
            if (response.body.rpta == true) {
              this.alertaService.swalFireOptions({
                icon: 'success',
                text: 'La consulta se realizo satisfactoriamente',
              });
              this.recargarDatosSentinel();
            } else {
              this.alertaService.swalFireOptions({
                icon: 'info',
                text: 'No se encontró información',
              });
            }
          },
          error: (error) => {
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.swalFireOptions({
              icon: 'warning',
              title: 'No se pudo realizar la consulta',
              text: mensaje,
            })
            this.btnConsultar.disabled = false;
          },
        });
    } else {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        title: 'El numero de DNI a consultar debe tener 8 digitos',
      })
      this.btnConsultar.disabled = false;
    }
  }

  recargarDatosSentinel() {
    this.agendaService.agendaSentinelOperacionesService
      .recargarDatosSentinel$(this.rowActual.idAlumno)
      .subscribe({
        next: (resp: HttpResponse<IDatosSentinelAlumno>) => {
          this.agendaService.agendaSentinelOperacionesService.sentinelAlumno$.next(
            resp.body
          );
        },
        complete: () => {
          // Swal.fire({
          //   position: 'top-end',
          //   icon: 'success',
          //   title: 'Se cargo correctamente los datos de Sentinel',
          //   showConfirmButton: false,
          //   timer: 1500
          // })
        },
      });
  }
  obtenerAvatar(){
    this.avatarObservable = this.integraService.getJsonResponse(
      constApiOperaciones.AgendaObtenerAvatar  + '/' + this.rowActual.idAlumno
    );
    this.avatarObservable.subscribe((data:any) => {
      this.avatarUrl = this.avatarService.GetUrlImagenAvatar(data.body);
    });
  }
  /** */

  CrearLoginGuid(){
    this.botonAulaVirtualDisabled = true;
    this.integraService.getJsonResponse(constApiOperaciones.AgendaInformacionRegistrarLoginPortal+'/'+this.rowActual.idAlumno+'/'+this.userService.userData.userName).subscribe({
      next: (resp: HttpResponse<any>) => {
        if (resp && resp.body && resp.body.valor) {
          console.log("GUID CREADO DEL USUARIO LOGIN");
          console.log(resp.body.valor);
          const URL = `http://bsginstitute.com/LoginATC/${resp.body.valor}`;
          window.open(URL, "_blank");
        } else {
          console.error("No se pudo leer el guid");
        }
        this.botonAulaVirtualDisabled = false;
      },
      error: (error) => {
        console.error("Error al crear un login:", error);
        this.botonAulaVirtualDisabled = false;
      }
    });
  }

  

  // ConteoEncuestas(){
  //   this.integraService
  //       .getJsonResponse(constApiOperaciones.EncuestaAlumnoMatriculaCurso + "/" + this.rowActual.idMatriculaCabecera)
  //       .subscribe({
  //     next: (response: any) => {
  //       this.encuestasResuelto = 0;
  //       this.encuestasPendiente = 0;

  //       if(response.body.length>0 && response.body !== null){
  //         response.body.forEach((x:any)=>{
  //           console.log(x);
  //           if (x.estatus == 'Resuelto') {
  //             this.encuestasResuelto +=1;
  //           }else{
  //             this.encuestasPendiente +=1;
  //           }
  //         })

  //       }

  //     }
  //   })
    
  // }
 

}

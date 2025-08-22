import { AgendaProgramacionActividadOperacionesService } from '@operaciones/services/agenda/agenda-programacion-actividad-operaciones.service';
import { HttpResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IPlantillasPorIdFaseOportunidad } from '@comercial/models/interfaces/iagenda-activad';
import { IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';
import {
  IArbolOcurrenciaOperaciones,
  IPlantillaActividadOcurrencia,
} from '@comercial/models/interfaces/iarbol-ocurrencia-alterno';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { CrmService } from '@shared/services/crm.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Day } from '@progress/kendo-date-math';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-incidencia-llamada',
  templateUrl: './reporte-incidencia-llamada.component.html',
  styleUrls: ['./reporte-incidencia-llamada.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteIncidenciaLlamadaComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;

  @ViewChild('modalProgramacionActividades') modalProgramacionActividades: any;
  @ViewChild('modalFormPrograma') modalFormPrograma: any;
  @ViewChild('modalCerrarOportunidad') modalCerrarOportunidad: any;
  rowActual: any;
  alumno: IAlumnoInformacion;

  btnProgramarActividad = {
    disabled: false,
    show: false,
  };
  btnProgramarActividad1 = {
    disabled: false,
    show: false,
  };
  btnCrearOportunidad = {
    disabled: false,
    show: false,
  };
  btnCerrarOportunidad = {
    disabled: false,
    show: false,
  };
  public min: Date = new Date("2023-04-05T08:00:00");
  public max: Date = new Date("2023-04-05T21:00:00");
  public steps: any = { hour: 0, minute: 30};
  dataProblemaLlamada = [
    { id: 1, nombre: 'No ha habido ningun problema' },
    { id: 2, nombre: 'Ha habido Interferencias en la llamada' },
    { id: 3, nombre: 'No se puede escuchar al cliente' },
    { id: 4, nombre: 'El cliente no me puede escuchar' },
    { id: 5, nombre: 'Se corta la llamada' },
    { id: 6, nombre: 'Llamada al vacio' },
  ];
  dataCalidadLlamada = [
    { id: 1, nombre: '0 - Muy Mala' },
    { id: 2, nombre: '1 - Mala' },
    { id: 3, nombre: '2 - Normal' },
    { id: 4, nombre: '3 - Buena' },
    { id: 5, nombre: '4 - Muy Buena' },
    { id: 6, nombre: '5 - Excelente' },
  ];
  colorPanel=['#0079FF','#FF6113','#11C744','#6EC5FF']

  plantillasPorIdFaseOportunidad: IPlantillasPorIdFaseOportunidad[] = [];
  gridProgramarActividad: KendoGrid = new KendoGrid();

  PlantillaAutomaticaWhatsapp: any;
  diasSinContactoOportunidad: number = 0;
  arbolOcurrencia: IArbolOcurrenciaOperaciones[] = [];
  arbolOcurrenciaHijos: IArbolOcurrenciaOperaciones[] = [];
  arbolOcurrencia1: IArbolOcurrenciaOperaciones[] = [];
  arbolOcurrenciaHijos1: IArbolOcurrenciaOperaciones[] = [];
  tipoProgramacion: 1 | 2 | 3 = null;
  tipoProgramacion2: string = '';
  panelesBloqueados = false;
  itemClickeado:number=-1;
  migajas: any[] = [];
  cronogramaAprobado: boolean = false;
  arbolOcurrenciaHijos10: any[] = [];
  esCoordinadora: boolean = false;
  ocurrenciaPadre:any;
  ocurrenciaHija:any;

  migajaInicial: any;
  loadingModal: boolean;
  constructor(
    private modalService: NgbModal,
    private crmService: CrmService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    console.log('ReporteIncidenciaComponent');
    this.rowActual = this.agendaService.rowActual;
    this.migajaInicial = {
      nombre: 'Volver a Inicio',
      idActividadCabecera: this.rowActual.idActividadCabecera,
      idOcurrenciaActividad: 0,
    };

    this.migajas.push(this.migajaInicial);
    this.initSubscribeObservables();
    this.agendaService.agendaCronogramaOperacionesService.cronogramaAprobado$.subscribe(
      (resp) => {
        console.log(resp);
        this.cronogramaAprobado = resp;
      }
    );
  }
  crearOportunidad() {}
  initSubscribeObservables() {
    this.agendaService.esCoordinadora$.subscribe(
      (resp) => (this.esCoordinadora = resp)
    );

    this.agendaService.agendaInicializarOperacionesService.plantillasPorIdFaseOportunidad$.subscribe(
      (resp) => (this.plantillasPorIdFaseOportunidad = resp)
    );
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.diasSinContactoOportunidad$.subscribe(
      (resp) => (this.diasSinContactoOportunidad = resp)
    );

    this.agendaService.agendaAlumnoOperacionesService.alumno$.subscribe({
      next: (resp) => {
        if (resp != null) {
          this.alumno = resp;
        }
      },
    });

    this.agendaService.agendaArbolOcurrenciaOperacionesService.arbolOcurrencias$.subscribe(
      {
        next: (resp) => {
          if (resp != null) {
            this.arbolOcurrencia = resp.filter((x) =>
              x.roles.split(',').includes(this.agendaService.tipoPersonal)
            );
            this.arbolOcurrenciaHijos = resp.filter((x) =>
              x.roles.split(',').includes(this.agendaService.tipoPersonal)
            );
            this.arbolOcurrencia1 = resp.filter((x) =>
              x.roles.split(',').includes(this.agendaService.tipoPersonal)
            );
            this.arbolOcurrencia1.forEach((item, index) => {
          
              this.obtenerOcurrenciasHijos1(item,index); 
            });
            this.arbolOcurrenciaHijos1 = resp.filter((x) =>
              x.roles.split(',').includes(this.agendaService.tipoPersonal)
            );
          }
        },
      }
    );
  }

  onClickMigaja(item: any, index: number) {
    this.arbolOcurrencia = [];
    this.agendaService.agendaArbolOcurrenciaOperacionesService.cargarArbolOcurrencias(
      item.idActividadCabecera,
      item.idOcurrenciaActividad
    );
    this.migajas.splice(index + 1, this.migajas.length);
  }

  disabledBotones(flag: boolean) {
    this.btnProgramarActividad.disabled = flag;
    this.btnProgramarActividad1.show = flag;
    this.btnCrearOportunidad.disabled = flag;
    this.btnCerrarOportunidad.disabled = flag;
  }

  ocultarBotones() {
    this.btnProgramarActividad.show = false;
    this.btnProgramarActividad1.show = false;
    this.btnCrearOportunidad.show = false;
    this.btnCerrarOportunidad.show = false;
  }

  addMigaja() {
    this.migajas.push({
      nombre: this.itemOcurrenciaTemp.nombreOcurrencia,
      idActividadCabecera: this.rowActual.idActividadCabecera,
      idOcurrenciaActividad: this.itemOcurrenciaTemp.idOcurrenciaActividad,
    });
  }

  plantilla: any = {
    titulo: '',
    contenido: '',
  };

  tituloPlantilla = 'No hay una plantilla asociada';
  cuerpoPlantilla = 'No hay una plantilla asociada';
  obtenerPlantillaOcurrencia(item:IArbolOcurrenciaOperaciones) {
    var itemPlantilla=item;
    let filtroPlantilla = this.plantillasPorIdFaseOportunidad.filter(
      (e) => e.idPlantilla === itemPlantilla.idPlantilla_Speech
    );

    if (filtroPlantilla.length > 0) {
      // this.itemOcurrenciaTemp.plantilla = {
      //   titulo: this.itemOcurrenciaTemp.nombreOcurrencia,
      //   contenido: filtroPlantilla[0].valor,
      //   toggle: true,
      // };
      this.tituloPlantilla = itemPlantilla.nombreOcurrencia;
      this.cuerpoPlantilla = filtroPlantilla[0].valor;
    } else {
      this.tituloPlantilla = 'No hay una plantilla asociada';
      this.cuerpoPlantilla = 'No hay una plantilla asociada';
    }
  }

  obtenerPlantillaOcurrencia1(item:any) {
 
    let filtroPlantilla = this.plantillasPorIdFaseOportunidad.filter(
      (e) => e.idPlantilla === this.itemOcurrenciaTemp.idPlantilla_Speech
    );

    if (filtroPlantilla.length > 0) {
      // this.itemOcurrenciaTemp.plantilla = {
      //   titulo: this.itemOcurrenciaTemp.nombreOcurrencia,
      //   contenido: filtroPlantilla[0].valor,
      //   toggle: true,
      // };
      this.tituloPlantilla = this.itemOcurrenciaTemp.nombreOcurrencia;
      this.cuerpoPlantilla = filtroPlantilla[0].valor;
    } else {
      this.tituloPlantilla = 'No hay una plantilla asociada';
      this.cuerpoPlantilla = 'No hay una plantilla asociada';
    }
  }

  hideBtnProgramarActividad(){
    this.btnProgramarActividad1.show=false;
  }

  obtenerPlantillaOcurrenciaV2() {
    if (this.itemOcurrenciaTemp.plantilla != null) {
      this.itemOcurrenciaTemp.plantilla.toggle =
        this.itemOcurrenciaTemp.plantilla.toggle;
    } else {
      let filtroPlantilla = this.plantillasPorIdFaseOportunidad.filter(
        (e: any) => e.idPlantilla === this.itemOcurrenciaTemp.idPlantilla_Speech
      );

      if (filtroPlantilla.length > 0) {
        this.itemOcurrenciaTemp.plantilla = {
          titulo: this.itemOcurrenciaTemp.nombreOcurrencia,
          contenido: filtroPlantilla[0].valor,
          toggle: true,
        };
      }
    }
  }

  obtenerOcurrenciasHijos() {
    if (this.itemOcurrenciaTemp.ocurrenciasHijos != null) {
      this.itemOcurrenciaTemp.toggle = !this.itemOcurrenciaTemp.toggle;
    } else {
      this.agendaService.agendaArbolOcurrenciaOperacionesService
        .obtenerArbolOcurrencia$(
          this.rowActual.idActividadCabecera,
          this.itemOcurrenciaTemp.idOcurrenciaActividad
        )
        .subscribe({
          next: (resp: HttpResponse<IArbolOcurrenciaOperaciones[]>) => {
            console.log(resp.body);
            if (resp.body.length > 0) {
              let tipoPersonal = this.esCoordinadora ? 'Coordinador' : 'Asesor';
              this.arbolOcurrencia = [];
              this.arbolOcurrencia = resp.body.filter((x: any) =>
                x.roles.split(',').includes(tipoPersonal)
              );
              this.arbolOcurrenciaHijos = [];
              this.arbolOcurrenciaHijos = resp.body.filter((x: any) =>
                x.roles.split(',').includes(tipoPersonal)
              );
              let ObjetoCronogramaFinanzas = [{ estadoFinanciero: '' }];
              resp.body.forEach((e) => {
                if (e.idOcurrenciaReporte == 324) {
                  if (
                    [
                      'CULMINADO',
                      'CERTIFICADO',
                      'RETIRO APROBADO',
                      'ABANDONO',
                    ].includes(this.rowActual.estadoMatricula) &&
                    ObjetoCronogramaFinanzas[0].estadoFinanciero ===
                      ' <strong> Pago Completo </strong>'
                  ) {
                    //SEGUIMOS
                  } else {
                    return;
                  }

                  if (e.roles != null) {
                    e.roles.split(',').includes(tipoPersonal);
                    this.itemOcurrenciaTemp.ocurrenciasHijos.push(e);
                  }
                }
              });
            }
          },
        });
    }
  }
  isClicked(hijo: any) {
    return hijo.clicked;
  }

  verPlantillas(item:any){
    this.obtenerPlantillaOcurrencia(item);
    this.ocurrenciaPadre=item.nombreOcurrencia;
  }
  ver(item:any){
    console.log("VER",item);
    this.btnProgramarActividad1.show=true;
    console.log(item);
    this.itemOcurrenciaTemp = item;
    this.ocurrenciaHija=item.nombreOcurrencia
    item.toggle = !item.toggle;
    item.ocurrenciasHijos = null;
    item.seleccionado = true;
    this.ocultarBotones();
    if (this.itemOcurrenciaTemp.nombreEstadoOcurrencia == 'NO EJECUTADO') {
      this.tipoProgramacion = 2;
      this.btnProgramarActividad1.show = true;
      this.btnCerrarOportunidad.show = false;
      this.btnCrearOportunidad.show = false;
    } 
    else {
      this.tipoProgramacion = 1;
      if (this.itemOcurrenciaTemp.tieneOcurrencias == false) {
        // Cerrar Oportunidad
        this.btnProgramarActividad1.show = true;
        this.btnCrearOportunidad.show = false;
        // Crear una nueva oportunidad
        if (this.itemOcurrenciaTemp.crearOportunidad)
          this.btnCrearOportunidad.show = true;
      }

      
    }
    this.panelesBloqueados = true;
  }
  obtenerOcurrenciasHijos1(itemOcurrenciaTemp:any ,index:number) {
    if (itemOcurrenciaTemp.ocurrenciasHijos != null) {
      itemOcurrenciaTemp.toggle = !itemOcurrenciaTemp.toggle;
    } else {
      this.agendaService.agendaArbolOcurrenciaOperacionesService
        .obtenerArbolOcurrencia$(
          this.rowActual.idActividadCabecera,
          itemOcurrenciaTemp.idOcurrenciaActividad
        )
        .subscribe({
          next: (resp: HttpResponse<IArbolOcurrenciaOperaciones[]>) => {
            console.log(resp.body);
            if (resp.body.length > 0) {
              let tipoPersonal = this.esCoordinadora ? 'Coordinador' : 'Asesor';
              this.arbolOcurrencia = [];
              this.arbolOcurrencia = resp.body.filter((x: any) =>
                x.roles.split(',').includes(tipoPersonal)
              );
              this.arbolOcurrenciaHijos1 = [];
              this.arbolOcurrenciaHijos1 = resp.body.filter((x: any) =>
                x.roles.split(',').includes(tipoPersonal)
              );
              this.arbolOcurrenciaHijos10[index]=this.arbolOcurrenciaHijos1
              let ObjetoCronogramaFinanzas = [{ estadoFinanciero: '' }];
              resp.body.forEach((e) => {
                if (e.idOcurrenciaReporte == 324) {
                  if (
                    [
                      'CULMINADO',
                      'CERTIFICADO',
                      'RETIRO APROBADO',
                      'ABANDONO',
                    ].includes(this.rowActual.estadoMatricula) &&
                    ObjetoCronogramaFinanzas[0].estadoFinanciero ===
                      ' <strong> Pago Completo </strong>'
                  ) {
                    //SEGUIMOS
                  } else {
                    return;
                  }

                  if (e.roles != null) {
                    e.roles.split(',').includes(tipoPersonal);
                    itemOcurrenciaTemp.ocurrenciasHijos.push(e);
                  }
                }
              });
            }
          },
        });
    }
  }


  itemOcurrenciaTemp: IArbolOcurrenciaOperaciones;


  // onClickItemOcurrencia1(item: IArbolOcurrenciaOperaciones, nivel: number) {
  //   console.log(item);
  //   this.itemOcurrenciaTemp = item;
  //   item.toggle = !item.toggle;
  //   item.ocurrenciasHijos = null;

  //   // this.arbolOcurrencia.forEach((element) => {
  //   //   element.seleccionado = false;
  //   // });
  //   item.seleccionado = true;
  //   this.ocultarBotones();
  //   // this.obtenerPlantillaOcurrencia();
  //   if (item.tieneOcurrencias) {
  //     item.class = 'childShow';
  //     this.arbolOcurrencia = []
  //     // this.obtenerOcurrenciasHijos1(item);
  //     // this.migajas.push({
  //     //   nombre: item.nombreOcurrencia,
  //     //   idActividadCabecera: this.rowActual.idActividadCabecera,
  //     //   idOcurrenciaActividad: item.idOcurrenciaActividad,
  //     // });
  //   }


  //   if (this.itemOcurrenciaTemp.nombreEstadoOcurrencia == 'NO EJECUTADO') {
  //     this.tipoProgramacion = 2;
  //     this.btnProgramarActividad1.show = true;
  //     this.btnCerrarOportunidad.show = false;
  //     this.btnCrearOportunidad.show = false;
  //   } else {
  //     this.tipoProgramacion = 1;
  //     if (this.itemOcurrenciaTemp.tieneOcurrencias == false) {
  //       // Cerrar Oportunidad
  //       this.btnProgramarActividad1.show = true;
  //       this.btnCrearOportunidad.show = false;
  //       // Crear una nueva oportunidad
  //       if (this.itemOcurrenciaTemp.crearOportunidad)
  //         this.btnCrearOportunidad.show = true;
  //     }

      
  //   }
  //   this.panelesBloqueados = true;
  // }


  // onClickItemOcurrencia(item: IArbolOcurrenciaOperaciones, nivel: number) {
  //   console.log(item);
  //   this.itemOcurrenciaTemp = item;
  //   item.toggle = !item.toggle;
  //   item.ocurrenciasHijos = null;

  //   this.arbolOcurrencia.forEach((element) => {
  //     element.seleccionado = false;
  //   });
  //   item.seleccionado = true;
  //   this.ocultarBotones();
  //   // this.obtenerPlantillaOcurrencia();
  //   if (item.tieneOcurrencias) {
  //     item.class = 'childShow';
  //     this.arbolOcurrencia = []
  //     this.obtenerOcurrenciasHijos();
  //     this.migajas.push({
  //       nombre: item.nombreOcurrencia,
  //       idActividadCabecera: this.rowActual.idActividadCabecera,
  //       idOcurrenciaActividad: item.idOcurrenciaActividad,
  //     });
  //   }


  //   if (this.itemOcurrenciaTemp.nombreEstadoOcurrencia == 'NO EJECUTADO') {
  //     this.tipoProgramacion = 2;
  //     this.btnProgramarActividad.show = true;
  //     this.btnCerrarOportunidad.show = false;
  //     this.btnCrearOportunidad.show = false;
  //   } else {
  //     this.tipoProgramacion = 1;
  //     if (this.itemOcurrenciaTemp.tieneOcurrencias == false) {
  //       // Cerrar Oportunidad
  //       this.btnProgramarActividad.show = true;
  //       this.btnCrearOportunidad.show = false;
  //       // Crear una nueva oportunidad
  //       if (this.itemOcurrenciaTemp.crearOportunidad)
  //         this.btnCrearOportunidad.show = true;
  //     }
  //   }
  // }

  programacionActividad = {
    titulo: '',
    show: false,
  };

  showInputFacturaPeru: boolean = false;
  showInputFacturaOtro: boolean = false;
  showInputFactura: boolean = false;
  showBoletaOtro: boolean = false;

  changeTipoComprobante(event: any) {
    console.log(event.target.value);
    let index = event.target.value;
    if (index == 0) {
      this.showInputFactura = false;
      this.showInputFacturaPeru = false;
      this.showInputFacturaOtro = false;
      if (this.alumno.idCodigoPais != 51) {
        this.showBoletaOtro = true;
      }
    } else {
      this.showBoletaOtro = false;
      this.showInputFactura = true;
      if (this.alumno.idCodigoPais == 51) {
        this.showInputFacturaPeru = true;
      } else {
        this.showInputFacturaOtro = true;
      }
    }
    // this.showInputFactura =
  }

  setProgramarActividad() {}

  abrirModalProgramarActividad() {
    if (this.tipoProgramacion === 1) {
      this.abrirFormProgramarActividad('manualOp');
      // this.setProgramarActividad();
      // this.modalService.open(this.modalProgramacionActividades, {
      //   backdrop: 'static',
      //   size: 'lg',
      // });
    }
    if (this.tipoProgramacion === 2) {
      //Reprogramar
      if (
        this.rowActual.reprogramacionAutomatica == false &&
        this.rowActual.reprogramacionManual == false
      ) {
        alert('Error! ver consola');
        console.log(
          'reprogramacionAutomatica y reprogramacionManual estan en falso'
        );
        return;
      }

      if (
        this.rowActual.reprogramacionAutomatica === true &&
        this.rowActual.reprogramacionManual === true
      ) {
        this.modalService.open(this.modalProgramacionActividades, {
          backdrop: 'static',
          size: 'lg',
        });
        this.setReprogramarActividad();
      } else {
        if (this.rowActual.reprogramacionAutomatica) {
          this.abrirFormProgramarActividad('automatica');
        }
        if (this.rowActual.reprogramacionManual) {
          this.abrirFormProgramarActividad('manual');
        }
      }
    }
    if (this.tipoProgramacion == 3) {
      this.abrirFormProgramarActividad('cerrarOportunidad');
    }
  }

  cerrarOportunidad() {
    this.tipoProgramacion = 3;
    this.abrirModalProgramarActividad();
  }

  programarActividad() {
    this.abrirModalProgramarActividad();
    this.btnProgramarActividad1.show = false;
  }

  setReprogramarActividad() {
    this.programacionActividad.show = true;
    this.programacionActividad.titulo = 'Reprogramar Actividad';
  }

  formGrupoFecha: any = {
    show: false,
  };
  formBtnProgramarActividad: any = {
    show: false,
    disabled: false,
  };
  formBtnCerrarActividad: any = {
    show: false,
    disabled: false,
  };

  formProgramarActividad: FormGroup = this.formBuilder.group({
    comentario: '',
    fechaProgramada: null,
    horaProgramada: null,
    problemaLlamada: 1,
    calidadLlamada: 1,
    fechaInicioPrograma: null,
    tipoComprobante: null,
    rutFactura: null,
    rucFactura: null,
    razonSocialFactura: null,
    direccionFactura: null,
    comentarioComprobante: null,
    estadoFaseIP: null,
    estadoFasePF: null,
    fechaEnvioFichaPF: new Date(),
    fechaPagoPF: new Date(),
    estadoFaseIC: null,
    fechaPagoIC: null,
    codigoPagoIC: null,
  });

  dateTimeConfig: any = {
    format: 'yyyy-MM-dd HH:mm',
    min: null,
    max: null,
    readonly: false,
  };

  fechaProgramadaConfig: any = {
    min: null,
    max: null,
    readonly: false,
    format: 'dd/MM/yyyy',
    disabledDates: [Day.Sunday],
  };

  horaProgramadaConfig: any = {
    format: 'yyyy-MM-dd HH:mm',
    min: null,
    max: null,
    readonly: false,
  };

  dateTimeConfigIS: any = {
    format: 'HH:mm a',
    min: null,
    max: null,
    readonly: false,
  };

  disabledDates: Day[] = [Day.Sunday];

  get formValueProgramarActividad(): any {
    return this.formProgramarActividad.getRawValue();
  }
  abrirFormProgramarActividad(tipo: string) {
    console.log(tipo);
    this.formProgramarActividad.reset();
    // this.formProgramarActividad.get('fechaProgramada').setValue(new Date()); //NO SE CONTEMPLO ERROR DE CAIDA DE SERVICIOS
    this.formProgramarActividad.get('problemaLlamada').setValue(1);
    if (tipo === 'manual') {
      this.tipoProgramacion2 = tipo;
      this.formBtnProgramarActividad.show = true;
      this.formBtnCerrarActividad.show = false;
      this.formGrupoFecha.show = true;

      this.dateTimeConfig.min = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        7,
        0,
        0
      );
      this.dateTimeConfig.readonly = false;
      this.dateTimeConfig.max = new Date(
        new Date().getFullYear() + 2,
        11,
        31,
        21,
        0,
        0
      );
      this.formProgramarActividad.get('fechaProgramada').enable();
      this.formProgramarActividad.get('fechaProgramada').setValue(new Date());
      this.btnModalProgramar = false;
      this.btnModalCerrarActividad = false;
      this.modalService.open(this.modalFormPrograma, { backdrop: 'static' });
    }
    if (tipo === 'automatica') {
      this.tipoProgramacion2 = tipo;
      this.formBtnProgramarActividad.show = true;
      this.formBtnCerrarActividad.hide = true;
      this.formGrupoFecha.show = true;
      this.fechaProgramadaConfig.max = null;
      this.fechaProgramadaConfig.min = null;
      this.horaProgramadaConfig.max = null;
      this.horaProgramadaConfig.min = null;
      this.formBtnProgramarActividad.disabled = true;

      if (this.itemOcurrenciaTemp.idOcurrenciaReporte != 302) {
        this.agendaService.agendaProgramacionActividadOperacionesService
          .obtenerFechaReprogramacionAutomatica$(this.rowActual.idOportunidad)
          .subscribe({
            next: (resp) => {
              this.formProgramarActividad
                .get('fechaProgramada')
                .setValue(new Date(resp.body));
              this.formProgramarActividad
                .get('horaProgramada')
                .setValue(new Date(resp.body));
              this.formProgramarActividad.get('fechaProgramada').disable();
              this.formProgramarActividad.get('horaProgramada').disable();
              this.formBtnProgramarActividad.disabled = false;
              // NotificacionModule.showMensajeError(error, NotificacionId);
            },
            error: (error: any) => {
              let mensaje = this.alertaService.getErrorResponse(error).mensaje;
              this.alertaService.swalFireOptions({
                icon: 'error',
                title: 'No se pudo obtener la fecha de reprogramacion',
                text: mensaje,
              });
              this.formBtnProgramarActividad.disabled = false;
            },
          });

        this.dateTimeConfig.readonly = true;
        this.btnModalProgramar = false;
        this.btnModalCerrarActividad = false;
        this.modalService.open(this.modalFormPrograma, { backdrop: 'static' });
      } else {
        this.formProgramarActividad.get('fechaProgramada').setValue(new Date());
        this.formProgramarActividad.get('horaProgramada').setValue(new Date());

        this.formProgramarActividad.get('fechaProgramada').enable();
        this.formProgramarActividad.get('horaProgramada').enable();
        this.formBtnProgramarActividad.disabled = false;

        this.modalService.open(this.modalFormPrograma, { backdrop: 'static' });
      }
    }
    if (tipo === 'cerrarOportunidad') {
      this.tipoProgramacion2 = tipo;
      this.formBtnProgramarActividad.show = false;
      this.formBtnCerrarActividad.show = true;
      this.formGrupoFecha.show = false;
      this.dateTimeConfig.max = null;
      this.dateTimeConfig.min = null;
      this.formProgramarActividad.get('fechaProgramada').setValue(new Date());
      this.dateTimeConfig.readonly = false;
      this.btnModalProgramar = false;
      this.btnModalCerrarActividad = false;
      this.modalService.open(this.modalFormPrograma, { backdrop: 'static' });
    }

    if (tipo === 'manualOp') {
      this.tipoProgramacion2 = tipo;
      this.formBtnProgramarActividad.show = true;
      this.formBtnCerrarActividad.show = false;
      this.formGrupoFecha.show = true;

      this.dateTimeConfig.min = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        7,
        0,
        0
      );
      this.dateTimeConfig.readonly = false;
      this.dateTimeConfig.max = new Date(
        new Date().getFullYear() + 2,
        11,
        31,
        21,
        0,
        0
      );

      this.formProgramarActividad.get('fechaProgramada').enable();
      this.formProgramarActividad.get('fechaProgramada').setValue(new Date());
      this.obtenerFechaReprogramacionEjecutada();
      this.btnModalProgramar = false;
      this.btnModalCerrarActividad = false;
      if (this.itemOcurrenciaTemp.idOcurrenciaReporte == 324) {
        this.modalService.open(this.modalCerrarOportunidad, { backdrop: 'static' });
      }
      else{
        this.modalService.open(this.modalFormPrograma, { backdrop: 'static' });
      }
    }
    // this.mostrarInformacionAdicional(this.itemOcurrenciaTemp);
  }
  personalHorario: string[][] = [];
  obtenerFechaReprogramacionEjecutada() {
    this.agendaService.agendaProgramacionActividadOperacionesService
      .obtenerFechaReprogramacionEjecutada$(this.rowActual.idOportunidad)
      .subscribe({
        next: (resp) => {
          console.log(resp.body);

          //$fechaProgramada.value(new Date(resp.body.records.FechaProximaCuotaTexto));
          this.personalHorario = resp.body.records.personalHorario;
          let today = new Date();
          if (resp.body.records.fechaMaxima != null) {
            let fechatemp = new Date(resp.body.records.fechaMaxima);
            let dia = fechatemp.getDate();
            let mes = fechatemp.getMonth();
            let anio = fechatemp.getFullYear();
            var fecha3 = new Date(anio, mes, dia, 21, 0, 0);

            this.fechaProgramadaConfig.min = new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate()
            );
            this.fechaProgramadaConfig.max = new Date(anio, mes, dia, 21, 0, 0);

            this.formProgramarActividad
              .get('fechaProgramada')
              .setValue(new Date());

            //valido el dia de la semana y segun eso habilito la hora

            this.cargarConfiguracionHora();
          } 
          else {
            today.setDate(today.getDate() + resp.body.records.diasProgramacion);
            var dd = today.getDate();
            var mm = today.getMonth();
            var y = today.getFullYear();
            var fecha = new Date(y, mm, dd, 21, 0, 0);

            //contar los domingos
            var fechainicio1 = new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate()
            );
            var diferenciatiempo1 = Math.abs(
              fecha.getTime() - fechainicio1.getTime()
            );
            var diferenciadias1 = Math.ceil(
              diferenciatiempo1 / (1000 * 3600 * 24)
            );
            var domingos1 = 0;
            var array = new Array(diferenciadias1);
            for (var i = 0; i < diferenciadias1; i++) {
              //0 => Domingo |
              if (fechainicio1.getDay() === 0) {
                domingos1++;
              }
              fechainicio1.setDate(fechainicio1.getDate() + 1);
            }
            fecha.setDate(fecha.getDate() + domingos1);

            this.fechaProgramadaConfig.min = new Date(
              new Date().getFullYear(),
              new Date().getMonth(),
              new Date().getDate()
            );
            this.fechaProgramadaConfig.max = fecha;
            this.formProgramarActividad
              .get('fechaProgramada')
              .setValue(new Date());

            this.cargarConfiguracionHora();
          }

          this.formProgramarActividad.get('horaProgramada').enable();

          //$fechaProgramada.value(new Date(resp.body.rpta));
          if (this.itemOcurrenciaTemp.idOcurrenciaReporte == 324) {
            this.formProgramarActividad.get('fechaProgramada').disable();
            this.formProgramarActividad.get('horaProgramada').disable();
            // $('#ProgramacionActividades_btnProgramar').text(
            //   'Cerrar Oportunidad'
            // );
            // $('#ProgramacionActividades_btnProgramar').css(
            //   'background-color',
            //   'red'
            // );
            // $('#ProgramacionActividades_btnProgramar').css(
            //   'border-color',
            //   'red'
            // );
            // $('#ProgramacionActividades_grupoFecha').hide();
          } 
          else {
            this.formProgramarActividad.get('fechaProgramada').enable();
          }

          // $('#ProgramacionActividades_comentario').val(resp.body.Comentario);
          // $('#ProgramacionActividades_btnProgramar').prop('disabled', false);
          // $('#ProgramacionActividades_fechaProgramada').attr('readonly', false);
          // $('#ProgramacionActividades_horaProgramada').attr('readonly', false);
          // _modalForm.modal('show');
        },
        error: (error) => {},
      });
  }

  cargarConfiguracionHora() {
    var fechahorainicial3;
    var fechahorafinal3;
    let numDay = new Date().getDay();
    if (this.personalHorario[numDay][0] == null) {
      //si no hay horario de entrada para ese dia se entiende que no tiene en todo el dia
      fechahorainicial3 = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        9,
        0,
        0
      );
      fechahorafinal3 = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        19,
        0,
        0
      );
    } else if (this.personalHorario[numDay][3] === null) {
      fechahorainicial3 = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        Number(this.personalHorario[numDay][0].substring(0, 2)),
        Number(this.personalHorario[numDay][0].substring(3, 5)),
        0
      );
      fechahorafinal3 = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        Number(this.personalHorario[numDay][1].substring(0, 2)),
        Number(this.personalHorario[numDay][1].substring(3, 5)),
        0
      );
    } else {
      fechahorainicial3 = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        Number(this.personalHorario[numDay][0].substring(0, 2)),
        Number(this.personalHorario[numDay][0].substring(3, 5)),
        0
      );
      fechahorafinal3 = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        Number(this.personalHorario[numDay][3].substring(0, 2)),
        Number(this.personalHorario[numDay][3].substring(3, 5)),
        0
      );
    }

    this.horaProgramadaConfig.min = fechahorainicial3;
    this.horaProgramadaConfig.max = fechahorafinal3;
    this.formProgramarActividad
      .get('horaProgramada')
      .setValue(fechahorainicial3);
  }
  btnModalProgramarDisabled: boolean = false;

  faseOportunidadIP: boolean = true;
  faseOportunidadPF: boolean = true;
  faseOportunidadIC: boolean = true;
  comprobantePagoIS: boolean = true;

  dataEstadoFase: Array<{ id: number; nombre: string }> = [
    { id: 1, nombre: 'Solido' },
    { id: 2, nombre: 'Dudoso' },
  ];

  datosOportunidad: any;
  mostrarInformacionAdicional(ocurrencia: any) {
    this.faseOportunidadIP = ocurrencia.faseSiguiente === 'IP' ? true : false;
    this.faseOportunidadPF = ocurrencia.faseSiguiente === 'PF' ? true : false;
    this.faseOportunidadIC = ocurrencia.faseSiguiente === 'IC' ? true : false;
    this.comprobantePagoIS = false;

    if (ocurrencia.faseSiguiente === 'IC') {
      this.formProgramarActividad
        .get('codigoPagoIC')
        .setValue(this.datosOportunidad.codigoPagoIC);
      this.formProgramarActividad.get('codigoPagoIC').disable();
    } else {
      this.formProgramarActividad.get('codigoPagoIC').enable();
    }

    if (
      (ocurrencia.faseSiguiente === 'IS' &&
        ocurrencia.nombreOcurrencia ===
          'Confirma pago, se pacta fecha de grabación de contrato de voz (IS)') ||
      ocurrencia.nombreOcurrencia ===
        'Confirma pago, se pacta fecha de envío o entrega de contrato firmado (IS)'
    ) {
      this.formProgramarActividad
        .get('fechaInicioPrograma')
        .setValue(new Date());
      this.dateTimeConfigIS.min = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        7,
        0,
        0
      );

      this.comprobantePagoIS = true;
    }
  }

  cerrarActividad() {
    this.btnModalCerrarActividad = true;
    let comentario = this.formProgramarActividad.get('comentario').value;
    this.agendaService.agendaProgramacionActividadOperacionesService
      .cerrarActividad$(comentario, this.itemOcurrenciaTemp)
      .subscribe({
        next: (resp: any) => {
          // alert('se cerro la actividad')
          console.log(resp.body);
          this.btnModalCerrarActividad = false;

          // this.agendaService.agendaProgramacionActividadOperacionesService.cerrarActividad$( resp)envioAutomaticoPlantillaWhatsApp();
          // localStorage.clear();
          console.log('cerrarActividad');
          console.log(resp.body.realizadas);

          // if (this.agendaService.validado == true) {
          //     // if (getNombreCurrentTab() == "No Prog. 1 Solicitud" || getNombreCurrentTab() == "No Prog. 1+ Solicitudes") {
          //     //     // TotalTabsNoProgramadas--;
          //     // }
          // }
          // this.agendaService.agendaVentaCruzadaService.actividadEjecutada(
          //   this.rowActual.id,
          //   resp.body.realizadas
          // );
          // this.agendaService.agendaControlPantallaService.cerrarModalProgramarActividades();
          // ControlPantallasModule.cerrarModalProgramarActividades();
          // _destroyCierrePantallaDos();
        },
        error: (error) => {
          if (error.status == 409) {
            alert(error.message);
          } else {
            alert('ERROR: NO SE PUDO REPROGRAMAR');
            this.alertaService.notificationWarning(error.message);
          }
          this.btnModalCerrarActividad = false;
        },
      });
  }
  btnModalCerrarActividad: boolean = false;
  btnModalProgramar: boolean = false;
  showAlertModalProgramacion: boolean = true;

  guardarProgramacion() {
    let datosForm = this.formProgramarActividad.getRawValue();
    this.btnModalProgramar = true;
    if (datosForm.fechaProgramada == null || datosForm.fechaProgramada == '') {
      alert('Ingrese Una Fecha Correcta');
      // this.alertaService.mensajeWarning('Ingrese Una Fecha Correcta');
      this.btnModalProgramar = false;
      return;
    }
    // if (datosForm.fechaProgramada < new Date()) {
    //   alert('Ingrese Una Fecha Correcta');
    //   this.btnModalProgramar = false;
    //   return;
    // }
    let oportunidad = this.getDataAdicionalOportunidad(this.itemOcurrenciaTemp);

    oportunidad.idFaseOportunidad = this.rowActual.idFaseOportunidad;
    oportunidad.ultimaFechaProgramada = datePipeTransform(
      datosForm.fechaProgramada,
      'yyyy-MM-dd'
    );
    oportunidad.ultimaHoraProgramada = datePipeTransform(
      datosForm.horaProgramada,
      'HH:mm:ss'
    );
    oportunidad.idTipoDato = this.rowActual.idTipoDato;
    oportunidad.idEstadoOportunidad = this.rowActual.idEstadoOportunidad;
     let idLlamada = '1';
    //let idLlamada = this.crmService.idLlamada$.value;
    if (
      this.itemOcurrenciaTemp.requiereLlamada === 'Si' &&
      this.agendaService.anexoAsesor != '9999' &&
      this.itemOcurrenciaTemp.idOcurrenciaActividad_Padre != 1721 &&
      this.itemOcurrenciaTemp.idOcurrenciaActividad_Padre != 1722
    ) {
      // idLlamada = parent.ObtenerCallId();
      if (idLlamada == '0') {
        this.showAlertModalProgramacion = true;
        // this.flagError = 'Tiene que hacer una llamada';
        Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'Tiene que hacer una llamada',
          showConfirmButton: false,
          timer: 1500
        })
        this.btnModalProgramar = false;
        return;
      }
    } else if (this.itemOcurrenciaTemp.requiereLlamada === 'No') {
      idLlamada = '';
      this.crmService.idLlamada$.next('0');
    }

    // se comento debido a que no tenemos el sowphone
    //var idLlamada = getIdLlamada();
    //if (idLlamada === "0")
    //    return;
    //parent.ResetCallId()
    //parent.ObtenerCallId()
    //console.log('oportunidad', oportunidad);

    //modo de pago en Fase IS

    let datosCalidadLlamada: any = {};
    datosCalidadLlamada.idProblemaLlamada = datosForm.problemaLlamada;
    datosCalidadLlamada.idCalidadLlamada = datosForm.calidadLlamada;

    if (
      this.itemOcurrenciaTemp.nombreEstadoOcurrencia == 'EJECUTADO' &&
      datosCalidadLlamada.idCalidadLlamada == 0 &&
      this.itemOcurrenciaTemp.nombreOcurrencia !=
        '234. Cliente interesado, respuesta de interés mediante: correo, whatsapp, teléfono personal (IT)' &&
      datosCalidadLlamada.idCalidadLlamada == '0' &&
      this.agendaService.anexoAsesor !== '1238'
    ) {
      alert('TIENE QUE CALIFICAR LA LLAMADA');
      this.btnModalProgramar = false;
      return;
    }
    console.log(oportunidad);
    this.btnModalProgramar = true;
    let dataForm = this.formProgramarActividad.getRawValue();

    let tipoprog;
    if (this.itemOcurrenciaTemp.nombreEstadoOcurrencia == 'EJECUTADO') {
      tipoprog = 'manual';
    } else {
      tipoprog = 'automatica';
    }
    
    this.loadingModal = true;
    this.agendaService.agendaProgramacionActividadOperacionesService
      .guardarProgramacionActividad$(
        dataForm.comentario,
        oportunidad,
        this.itemOcurrenciaTemp,
        tipoprog,
        datosCalidadLlamada
      )
      .subscribe({
        next: (resp: any) => {
          // alert('se reprogramo')
          this.btnModalProgramar = false;
          this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(
            this.rowActual.id
          );
          this.agendaService.agendaControlPantallaOperacionesService.cerrarModalProgramarActividades();
          this.loadingModal = false;
        },
        error: (error) => {
          if (error.status == 409) {
            alert(
              'ERROR: LA OPORTUNIDAD FUE TRABAJA POR OTRA PERSONA AL MISMO TIEMPO, RECARGAR LA OPORTUNIDAD'
            );
          } else {
            alert('ERROR: NO SE PUDO REPROGRAMAR');
          }
          this.btnModalProgramar = false;
          console.log(error);
          this.loadingModal = false;
          this.alertaService.notificationWarning(error.message);
        },
      });
  }

  changeFechaProgramada(event: Date) {
    //valido el dia de la semana y segun eso habilito la hora
    let horaMinima;
    let horaMaxima;
    const _DIA = event.getDay();
    const _YEAR = event.getFullYear();
    const _MONTH = event.getMonth();
    const _DATE = event.getDate();
    const _HORARIO = this.personalHorario[_DIA];

    // si no hay horario de entrada para ese dia se entiende que no tiene en todo el dia
    if (_HORARIO[0] == null) {
      horaMinima = new Date(_YEAR, _MONTH, _DATE, 9, 0, 0);
      horaMaxima = new Date(_YEAR, _MONTH, _DATE, 19, 0, 0);
    } else if (_HORARIO[3] === null) {
      horaMinima = new Date(
        _YEAR,
        _MONTH,
        _DATE,
        Number(_HORARIO[0].substring(0, 2)),
        Number(_HORARIO[0].substring(3, 5)),
        0
      );
      horaMaxima = new Date(
        _YEAR,
        _MONTH,
        _DATE,
        Number(_HORARIO[1].substring(0, 2)),
        Number(_HORARIO[1].substring(3, 5)),
        0
      );
    } else {
      horaMinima = new Date(
        _YEAR,
        _MONTH,
        _DATE,
        Number(_HORARIO[0].substring(0, 2)),
        Number(_HORARIO[0].substring(3, 5)),
        0
      );
      horaMaxima = new Date(
        _YEAR,
        _MONTH,
        _DATE,
        Number(_HORARIO[3].substring(0, 2)),
        Number(_HORARIO[3].substring(3, 5)),
        0
      );
    }

    this.horaProgramadaConfig.min = horaMinima;
    this.horaProgramadaConfig.min = horaMaxima;
    this.formProgramarActividad.get('horaProgramada').setValue(horaMinima);
  }

  validarDatos() {
    let pais = this.alumno.idCodigoPais;
    let tipoComprobante =
      this.formProgramarActividad.get('tipoComprobante').value;
    let RUT = this.formProgramarActividad.get('rutFactura').value;
    let RZ = this.formProgramarActividad.get('razonSocialFactura').value;
    let DIR = this.formProgramarActividad.get('direccionFactura').value;
    let RUC = this.formProgramarActividad.get('rucFactura').value;
    if (tipoComprobante == null) {
      return false;
    } else {
      if (pais == 51 && tipoComprobante == 0) {
        //BOLETA peru no pide ningun dato
        return true;
      }
      if (pais == 51 && tipoComprobante == 1) {
        if (RUC.trim().length == 0 || RZ.trim().length == 0) {
          return false;
        }
      }
      if (pais != 51 && tipoComprobante == 0) {
        if (DIR.trim().length == 0) {
          return false;
        }
      }
      if (pais != 51 && tipoComprobante == 1) {
        if (
          DIR.trim().length == 0 ||
          RUT.trim().length == 0 ||
          RZ.trim().length == 0
        ) {
          return false;
        }
      }
    }
    return true;
  }
  getDataAdicionalOportunidad(obj: any) {
    let datosForm = this.formProgramarActividad.getRawValue();
    let data: any = new Object();
    data.fasesActivas = false;

    if (obj.faseSiguiente === 'IP') {
      let cd = datosForm.estadoFaseIP;
      if (cd == '' || cd == null) data.idFaseOportunidadIp = 0;
      else data.idFaseOportunidadIp = cd;
      data.fasesActivas = true;
    }

    if (obj.faseSiguiente === 'PF') {
      let cd = datosForm.estadoFasePF;
      if (cd == '' || cd == null) data.idFaseOportunidadIp = 0;
      else data.idFaseOportunidadIp = cd;
      data.fechaEnvioFaseOportunidadPf = datosForm.fechaEnvioFichaPF;
      data.fechaPagoFaseOportunidadPf = datosForm.fechaPagoPF;
      data.fasesActivas = true;
    }

    if (obj.faseSiguiente === 'IC') {
      let cc = datosForm.estadoFaseIC;
      if (cc == '' || cc == null) data.idFaseOportunidadIc = 0;
      else data.idFaseOportunidadIc = cc;
      data.fechaPagoFaseOportunidadIc = datosForm.fechaPagoIC;
      data.codigoPagoIc = datosForm.codigoPagoIC;
      data.fasesActivas = true;
    }

    return data;
  }

  getDataSourceContacto() {
    let datosForm = this.formProgramarActividad.getRawValue();
    var obj: any = {};
    obj.idContacto = this.alumno.id;
    obj.nombres = this.alumno.nombre1 + ' ' + this.alumno.nombre2;
    obj.apellidos =
      this.alumno.apellidoMaterno + ' ' + this.alumno.apellidoPaterno;
    obj.celular =
      this.alumno.celular == '' ? this.alumno.celular2 : this.alumno.celular;
    obj.dni = this.alumno.dni;
    obj.correo =
      this.alumno.email1 == '' ? this.alumno.email2 : this.alumno.email1;
    obj.nombrePais = this.alumno.nombrePais;
    obj.idPais = this.alumno.idCodigoPais;
    obj.nombreCiudad = this.alumno.nombreCiudad;

    obj.comentario = datosForm.comentarioComprobante;
    let tipoComprobante = datosForm.tipoComprobante;
    obj.bitComprobante = tipoComprobante;
    if (this.alumno.idCodigoPais == 51) {
      obj.tipoComprobante = tipoComprobante == 0 ? 'Boleta' : 'Factura';
      obj.nroDocumento =
        tipoComprobante == 0 ? this.alumno.dni : datosForm.rucFactura;
      obj.nombreRazonSocial = datosForm.razonSocialFactura;
      obj.direccion = this.alumno.direccion;
    } else {
      obj.tipoComprobante = tipoComprobante == 0 ? 'Boleta' : 'Factura';
      obj.nroDocumento =
        tipoComprobante == 0 ? this.alumno.dni : datosForm.rutFactura;
      obj.nombreRazonSocial = datosForm.razonSocialFactura;
      obj.direccion = datosForm.direccionFactura;
    }
    return obj;
  }
}

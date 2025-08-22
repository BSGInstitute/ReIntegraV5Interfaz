import { Component, Input, OnInit, ViewChild, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiComercial } from '@environments/constApi';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IFiltroEnvioOperaciones } from '@operaciones/models/interfaces/iagendaoperaciones';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { DropDownListComponent, MultiSelectComponent } from '@progress/kendo-angular-dropdowns';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { ModalAccesosTemporalesComponent } from '../modal-content-oportunidad/modal-accesos-temporales/modal-accesos-temporales.component';
import {ModalContentOportunidadComponent} from '../modal-content-oportunidad/modal-content-oportunidad.component'


@Component({
  selector: 'content-tab-agenda',
  templateUrl: './content-tab-agenda.component.html',
  styleUrls: ['./content-tab-agenda.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ContentTabAgendaComponent implements OnInit,OnChanges {
  idPersonal: any;
  esCoordinadora: boolean = false;
  buttonCount: number = 0;
  pageSizes: any = [5, 10, 20, 'All'];
  personalDatos: any;
  @Input() tab: any;
  @Input() toggleFiltro: boolean = false;
  @Input() agendaService: AgendaOperacionesService;

  @ViewChild('dropDownListContacto')
  dropDownListContacto: DropDownListComponent;

  @Input() gridAgenda: KendoGrid;
  @Input() loaderGrid: boolean = false;
  @Input() reload=0;
  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('-----------')
    console.log(changes['reload'])
    console.log(this.reload)
    if(changes['reload']){
      
    }
    console.log('-----------')
  }

  formFiltroAgenda: FormGroup = this.formBuilder.group({
    idAlumno: [null],
    idAsesor: [null],
    idCentroCosto: [null],
    codigoMatricula:[null],
    nroDocumento:[null],
  });
  public rowCallback(context: RowClassArgs) {
    if (context.dataItem.tipoMensaje) {   // change this condition as you need
      if (context.dataItem.tipoMensaje === 1) {
        return { msCorreo: true };
      }
      if (context.dataItem.tipoMensaje === 2) {
        return { msWhatsApp: true };
      }
      if (context.dataItem.tipoMensaje === 3) {
        return { msReclamo: true };
      }
      if (context.dataItem.tipoMensaje === 4) {
        return { msConstancia: true };
      }
     
      else{
        return { msReclamo: false };
      }
    }
    else{
      return {msReclamo: false};
    }
  }
  dataContacto: any[] = [];
  personalAsignadoFiltro: any[] = [];
  comboCentroCosto: any[] = [];
  filtrosAgenda: any = {
    listaEstadoOcurrencia: [],
    listaFaseOportunidad: [],
    listaTipoDato: [],
    listaOrigen: [],
    listaProbabilidadRegistro: [],
    listaCategoriaOrigen: [],
  };
  personalAsignado: any[] = [];
  sourceContacto: any[] = [];
  @ViewChild('multiselectPerAsignado')
  multiselectPerAsignado: MultiSelectComponent;
  alert = Swal.mixin({
    toast: true,
    position: 'bottom-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  ngOnInit(): void {
    this.agendaService.agendaPersonal$.subscribe({
      next: (response: any) => {
        console.log(response);
        this.personalAsignado = response.asignados;
        this.personalAsignadoFiltro = response.asignados;
        this.personalDatos = response.datosPersonal;
        this.formFiltroAgenda
          .get('idAsesor')
          .setValue([Number(this.agendaService.idPersonal)]);
      },
    });
    // this.cargarFicha();
    // this.cargarHistorial()
    this.idPersonal = this.agendaService.idPersonal;
    this.initSubscribeObservables()
    }

  ngAfterViewInit() {
    // let agendaInicializarOperacionesService = this.agendaService.agendaInicializarOperacionesService as any;
    // this.gridAgenda = agendaInicializarOperacionesService[this.nameGrid]
    // console.log(this.gridAgenda);
  }
  getIndexGridData (rowActual: any) : boolean{
    if (this.personalDatos.tipoPersonal!='Coordinador'){
      let data = this.gridAgenda.view$.value.data;
      if (this.personalDatos.tipoPersonal!='Coordinador' && this.tab.idTab != 46 && this.tab.idTab != 42 && this.tab.idTab != 43 && this.tab.idTab != 16 && this.tab.idTab != 17 && this.tab.idTab != 39 && this.tab.idTab != 52 && this.tab.idTab != 45 && this.tab.idTab != 54 ){
        let index = data.findIndex((item: any) => item.idOportunidad === rowActual.idOportunidad);
        if (index == 0 && this.gridAgenda.gridState.skip == 0 ) {
          return true;
        }
        else{
          return false;
        }
      }
    }
    return true;
  }
  initSubscribeObservables(){
    this.agendaService.esCoordinadora$.subscribe(resp => this.esCoordinadora = resp)
  }
  async cargarFicha(rowActual: any){
    console.log(rowActual);
    await this.agendaService.setRowActual(rowActual);
    this.agendaService.modalRefFichaOportunidad = this.modalService.open(
      ModalContentOportunidadComponent,
      {
        size: 'xxl',
        backdrop: 'static',
        keyboard: false
      }
    );
    this.agendaService.modalRefFichaOportunidad.componentInstance.agendaService = this.agendaService;
  }
  cargarModalAccesosTemporales(rowActual: any){
    console.log('row accesos temporales',rowActual);
    if (rowActual.validoAccesoTemporal == 0){
      this.alert.fire({
        icon: 'warning',
        title: 'El alumno no cumple con las condiciones'
      })
    }
    else if (rowActual.validoAccesoTemporal ==1 || rowActual.validoAccesoTemporal ==2){
      this.alert.fire({
        icon: 'success',
        title: rowActual.validoAccesoTemporal == 1 ? 'Accesos temporales': 'Ampliación de accesos temporales'
      })
      this.agendaService.setDataAccesosTemporales(rowActual);
      this.agendaService.modalRefAccesosTemporales = this.modalService.open(
        ModalAccesosTemporalesComponent,
        {
          size: 'xl',
          backdrop: 'static',
          keyboard: false
        }
      );
      this.agendaService.modalRefAccesosTemporales.componentInstance.agendaService = this.agendaService;
    }
  }
  cargarHistorial(){
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.ObtenerVentaCruzadaHistorialOportunidades();
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.CargarHistorialInteraccionesOportunidad();
  }
  

  filtroContacto(value: string) {
    if (value.length >= 4) {
      this.dropDownListContacto.loading = true;
      this.agendaService.agendaActividadesOperacionesService
        .ObtenerAlumnoAutocomplete$(value)
        .subscribe({
          next: (response: any) => {
            this.dropDownListContacto.loading = false;
            this.sourceContacto = response.body.slice();
            this.dataContacto = response.body.slice();
            // this.dropDownListContacto.toggle(true);
          },
        });
    } else if (value.length >= 1) {
      this.dataContacto = [];
    } else {
      this.dataContacto = this.sourceContacto;
      this.multiselectPerAsignado.toggle(false);
    }
  }

  filtroPersonalAsignado(value: any) {
    if (value.length >= 1) {
      // this.multiselectPerAsignado.toggle(true);
      this.personalAsignadoFiltro = this.personalAsignado.filter(
        (s) => s.nombres.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.personalAsignadoFiltro = this.personalAsignado;
      // this.multiselectPerAsignado.toggle(false);
    }
  }

  filtrarAgenda() {
    console.log('filtrarAgenda');
    const filtroTab = this.obtenerFiltroTab();
    switch (filtroTab.tab.nombreTab) {
      case 'MensajesRecibidos':
        this.agendaService.agendaInicializarOperacionesService.gridMensajesRecibidosWhatsApp.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerMensajesRecibidosWhatsApp();
        break;
      case 'Solicitudes':
        this.agendaService.agendaInicializarOperacionesService.gridSolicitudes.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudes();
        break;
      case 'AsignadosReasignados' :
        this.agendaService.agendaInicializarOperacionesService.gridReasignados.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerReasignados();
        break;
      case 'ProgramacionManual' :
        this.agendaService.agendaInicializarOperacionesService.gridProgramacionManual.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerProgramacionManual();
        break;
      case 'PagosAtrasados' :
        this.agendaService.agendaInicializarOperacionesService.gridPagosAtrasados.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerPagosAtrasados();
        break;
      case 'CompromisosPagos' :
        this.agendaService.agendaInicializarOperacionesService.gridCompromisoPago.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerCompromisoPago();
        break;
      case 'PreReporteCR' :
        this.agendaService.agendaInicializarOperacionesService.gridPreReporteCR.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerPreReporteCR();
        break;
      case 'ReportadoCR' :
        this.agendaService.agendaInicializarOperacionesService.gridReportadoCR.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerReportadoCR();
        break;
      case 'PagoAlDia' :
        this.agendaService.agendaInicializarOperacionesService.gridPagoAlDia.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerPagoAlDia();
        break;
      case 'SeguimientoAcademico' :
        this.agendaService.agendaInicializarOperacionesService.gridSeguimientoAcademico.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerSeguimientoAcademico();
        break;
      // case 'EnRecuperacionDeCurso' :
      //   this.agendaService.agendaInicializarOperacionesService.gridRecuperacionCurso.filtroTemp=filtroTab.filtro
      //   this.agendaService.agendaInicializarOperacionesService.obtenerRecuperacionCurso();
      //   break;
      // case 'CursoPendiente' :
      //   this.agendaService.agendaInicializarOperacionesService.gridCursoPendiente.filtroTemp=filtroTab.filtro
      //   this.agendaService.agendaInicializarOperacionesService.obtenerCursoPendiente();
      //   break;
      // case 'ProyectoAplicacionPendiente' :
      //   this.agendaService.agendaInicializarOperacionesService.gridProyectoPendiente.filtroTemp=filtroTab.filtro
      //   this.agendaService.agendaInicializarOperacionesService.obtenerProyectoPendiente();
      //   break;
      // case 'NotasPendientes' :
      //   this.agendaService.agendaInicializarOperacionesService.gridNotaPendiente.filtroTemp=filtroTab.filtro
      //   this.agendaService.agendaInicializarOperacionesService.obtenerNotaPendiente();
      //   break;
      case 'Culminados' :
        this.agendaService.agendaInicializarOperacionesService.gridCulminado.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerCulminado();
        break;
      // case 'CulminadoDeudor' :
      //   this.agendaService.agendaInicializarOperacionesService.gridCulminadoDeudor.filtroTemp=filtroTab.filtro
      //   this.agendaService.agendaInicializarOperacionesService.obtenerCulminadoDeudor();
      //   break;
      case 'Certificado' :
        this.agendaService.agendaInicializarOperacionesService.gridCertificado.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerCertificado();
        break;
      case 'BeneficiosPendientes' :
        this.agendaService.agendaInicializarOperacionesService.gridBeneficioPendiente.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerBeneficioPendiente();
        break;
      case 'ReservadosSinDeuda' :
        this.agendaService.agendaInicializarOperacionesService.gridReservadoSinDeuda.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerReservadoSinDeuda();
        break;
      case 'ReservadoConDeuda' :
        this.agendaService.agendaInicializarOperacionesService.gridReservadoConDeuda.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerReservadoConDeuda();
        break;
      case 'Retirado' :
        this.agendaService.agendaInicializarOperacionesService.gridRetirado.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerRetirado();
        break;
      case 'PorAbandonar' :
        this.agendaService.agendaInicializarOperacionesService.gridPorAbandonar.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerPorAbandonar();
        break;
      case 'Abandonado' :
        this.agendaService.agendaInicializarOperacionesService.gridAbandonado.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerAbandonado();
        break;
      case 'EnEvaluacion' :
        this.agendaService.agendaInicializarOperacionesService.gridEnEvaluacion.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerEnEvaluacion();
        break;
      case 'Bics' :
        this.agendaService.agendaInicializarOperacionesService.gridBics.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerBics();
        break;
      case 'SinContacto' :
        this.agendaService.agendaInicializarOperacionesService.gridSinContacto.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerSinContacto();
        break;
      case 'ClasesOnline' :
        this.agendaService.agendaInicializarOperacionesService.gridClasesOnline.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerClasesOnline();
        break;
      case 'PagosDelDia' :
        this.agendaService.agendaInicializarOperacionesService.gridPagosDelDia.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerPagosDelDia();
        break;
      case 'PagoAtrasadoMesActualPrevio' :
        this.agendaService.agendaInicializarOperacionesService.gridMesActualPrevio.filtroTemp=filtroTab.filtro
        this.agendaService.agendaInicializarOperacionesService.obtenerPagoAtrasadoMesActualPrevio();
        break;
      case 'ContestanCortan' :
          this.agendaService.agendaInicializarOperacionesService.gridContestanCortan.filtroTemp=filtroTab.filtro
          this.agendaService.agendaInicializarOperacionesService.obtenerContestanCortan();
        break;
        case 'BICsconDeuda' :
          this.agendaService.agendaInicializarOperacionesService.gridBicDeuda.filtroTemp=filtroTab.filtro
          this.agendaService.agendaInicializarOperacionesService.obtenerBicDeuda();
        break;
      
    }
  }




    filterByCentroCosto(value: string) {
      if (value.length >= 4) {
        this.integraService
          .obtenerPorFiltro(constApiComercial.CentroCostoObtenerAutocomplete, {
            valor: value,
          })
          .subscribe({
            next: (response) => {
              this.comboCentroCosto = response.body;
            },
          });
      } else {
        this.comboCentroCosto = [];
      }
    }


    obtenerFiltroTab() {
      let filtroFormulario = this.procesarFiltroEnvio();
      let filtro: any = {};
      this.gridAgenda.gridState.skip = 0;
      if (
        ['MensajesRecibidos'].includes(
          this.tab.nombreTab
        )
      ) {
        filtro = {
          idAsesor: filtroFormulario.idAsesor,
        };
      } else if (
        ['Solicitudes'].includes(
          this.tab.nombreTab
        )
      ) {
        filtro = {
          idAsesor: filtroFormulario.idAsesor,
        };
      }
      else {
        filtro = {
          idAlumno: filtroFormulario.idAlumno,
          idCentroCosto: filtroFormulario.idCentroCosto,
          idAsesor: filtroFormulario.idAsesor,
          codigoMatricula: filtroFormulario.codigoMatricula,
          dni: filtroFormulario.nroDocumento,
        };
      }
      return {
        filtro: filtro,
        tab: this.tab,
      };
    }

    procesarFiltroEnvio(): IFiltroEnvioOperaciones {
      let formulario = this.formFiltroAgenda.getRawValue();
      let filtroEnvio: IFiltroEnvioOperaciones = {};

      if (this.validControlFormulario(formulario.idAlumno))
        filtroEnvio.idAlumno = '';
      else filtroEnvio.idAlumno = String(formulario.idAlumno);

      if (this.validControlFormulario(formulario.idAsesor))
        filtroEnvio.idAsesor = String(this.idPersonal);
      else filtroEnvio.idAsesor = formulario.idAsesor.join(',');

      if (this.validControlFormulario(formulario.idCentroCosto))
        filtroEnvio.idCentroCosto = '';
      else filtroEnvio.idCentroCosto = String(formulario.idCentroCosto);

      if (this.validControlFormulario(formulario.codigoMatricula))
        filtroEnvio.codigoMatricula = '';
      else filtroEnvio.codigoMatricula = String(formulario.codigoMatricula);

      if (this.validControlFormulario(formulario.nroDocumento))
        filtroEnvio.nroDocumento = '';
      else filtroEnvio.nroDocumento = String(formulario.nroDocumento);
      return filtroEnvio;
    }

    validControlFormulario(valor: any): boolean {
      return (
        valor == null ||
        valor == undefined ||
        valor == 0 ||
        valor == '0' ||
        valor == 0
      );
    }
}

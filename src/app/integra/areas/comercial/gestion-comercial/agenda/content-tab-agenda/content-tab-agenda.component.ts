import { CrmService } from '@shared/services/crm.service';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IComboFiltroAgenda, IFiltroTabEnvio, IRowActual } from '@comercial/models/interfaces/iagenda';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { DatosPersonal } from '@integra/areas/models/global/personal';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DropDownFilterSettings,
  DropDownListComponent,
  MultiSelectComponent,
} from '@progress/kendo-angular-dropdowns';
import {
  GridComponent,
  GridDataResult,
  PagerSettings,
  RowClassArgs,
} from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Observable, Subscription } from 'rxjs';
import { ModalContentCronogramaPagoComponent } from '../modal-content-cronograma-pago/modal-content-cronograma-pago.component';
import { ModalContentOportunidadComponent } from '../modal-content-oportunidad/modal-content-oportunidad.component';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { AlertaService } from '@shared/services/alerta.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'content-tab-agenda',
  templateUrl: './content-tab-agenda.component.html',
  styleUrls: ['./content-tab-agenda.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDsetectionStrategy.OnPush,
})
export class ContentTabAgendaComponent implements OnInit {
  @ViewChild('grid') grid: GridComponent;
  @ViewChild('dropDownListContacto')
  dropDownListContacto: DropDownListComponent;
  @ViewChild('multiselectPerAsignado')
  multiselectPerAsignado: MultiSelectComponent;
  @ViewChild('dropCentroCosto')
  dropCentroCosto: DropDownListComponent;
  @Input() contentTab: any;
  @Input() tab: any;
  @Input() viewDatosPersonal: Observable<any>;
  @Input() datosPersonal: DatosPersonal = {
    datosPersonal: null,
    asignados: [],
  };
  @Input() gridViewAgenda: GridDataResult = {
    data: [],
    total: 0,
  };
  @Input() gridDataAgenda: any[];
  @Input() toggle: any;

  filtrosAgenda: IComboFiltroAgenda = {
    listaEstadoOcurrencia: [],
    listaFaseOportunidad: [],
    listaTipoDato: [],
    listaOrigen: [],
    listaProbabilidadRegistro: [],
    listaCategoriaOrigen: [],
  };
  estadoAbrirFicha = false;
  tabActual: any;
  loader: boolean = false;
  @Input() toggleFiltro: boolean = false;
  virtual: any = {
    itemHeight: 28,
  };

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  idPersonal: any;
  @Input() agendaService: AgendaService;
  subscriptions: Subscription = new Subscription();
  
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private crmService: CrmService,
    private alertaService: AlertaService,
    private _sharedService: SharedService
  ) {}
  @Input() gridAgenda: KendoGrid;
  @Input() loaderGrid: boolean = false;

  listaAgendaProgramadasAutomaticas: any = [];
  formFiltroAgenda: FormGroup = this.formBuilder.group({
    idAlumno: [null],
    idAsesor: [[]],
    idAsesorMR: [null],
    idCentroCosto: [null],
    idCategoriaOrigen: [null],
    idEstado: [null],
    idFaseOportunidad: [null],
    idTipoDato: [null],
    idOrigen: [null],
    idProbabilidad: [null],
    fecha: [null],
  });
  dataContacto: { id: number; nombreCompleto: string }[] = [];
  sourceContacto: { id: number; nombreCompleto: string }[] = [];
  personalDatos: any;
  personalAsignadoFiltro: any[] = [];
  sourceCentroCosto: IComboBase1[] = [];
  dataCentroCosto: IComboBase1[] = [];
  buttonCount: number = 0;
  pageSizes = [5, 10, 20];
  ngOnInit(): void {
    let gridPageable = this.gridAgenda.pageable as PagerSettings;
    this.buttonCount = gridPageable.buttonCount;
    this.initSubscribeObservables();
  }
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  get esCoordinadora$(){
    return this.agendaService.esCoordinadora$;
  }
  initSubscribeObservables() {
    let sub2$ = this.agendaService.agendaPersonal$.subscribe(resp => {
      if(resp != null){
        this.personalAsignadoFiltro = resp.asignados;
        this.personalDatos = resp.datosPersonal;
        this.idPersonal = this.agendaService.idPersonal;
        this.formFiltroAgenda
          .get('idAsesor')
          .setValue([this.agendaService.idPersonal]);
        this.formFiltroAgenda
          .get('idAsesorMR')
          .setValue(this.agendaService.idPersonal);
        this.gridAgenda.filtroTemp = this.obtenerFiltroTab().filtro;
      }
    });

    let sub3$ = this.agendaService.agendaActividadesService.agendaFiltro$.subscribe({
      next: (resp) => {
        this.filtrosAgenda = resp;
      },
    });

    let sub4$ = this.agendaService.filtrarAgenda$.subscribe({
      next: (resp) => {
        if (resp == this.tabActual.nombreTab) this.filtrarAgenda();
      },
    });
    this.subscriptions.add(sub2$);
    this.subscriptions.add(sub3$);
    this.subscriptions.add(sub4$);
  }

  get esMarcadorActivo$(){
    return this.crmService.esMarcadorActivo$;
  }
  obtenerFiltroTab() {
    let filtroFormulario = this.procesarFiltroEnvio();
    let filtro: any = {};
    this.gridAgenda.gridState.skip = 0;
    if (
      ['ProgramacionAutomatica', 'ProgramacionManual'].includes(
        this.tab.nombreTab
      )
    ) {
      filtro = {
        idAlumno: filtroFormulario.idAlumno,
        idAsesor: filtroFormulario.idAsesor,
        esWhatsApp: this.agendaService.esWhatsappCorreos ? 'SI': 'NO'
      };
    } else if (
      ['NoProg1Solicitud', 'NoProgMas1Solicitud', 'Workshop'].includes(
        this.tab.nombreTab
      )
    ) {
      filtro = {
        idEstado: filtroFormulario.idEstado,
        idFaseOportunidad: filtroFormulario.idFaseOportunidad,
        idAlumno: filtroFormulario.idAlumno,
        idTipoDato: filtroFormulario.idTipoDato,
        idCentroCosto: filtroFormulario.idCentroCosto,
        idOrigen: filtroFormulario.idOrigen,
        idAsesor: filtroFormulario.idAsesor,
        idCategoriaOrigen: filtroFormulario.idCategoriaOrigen,
        esWhatsApp: this.agendaService.esWhatsappCorreos ? 'SI': 'NO'
      };
    } else if (['NoProgAltasMedias'].includes(this.tab.nombreTab)) {
      filtro = {
        idEstado: filtroFormulario.idEstado,
        idFaseOportunidad: filtroFormulario.idFaseOportunidad,
        idAlumno: filtroFormulario.idAlumno,
        idTipoDato: filtroFormulario.idTipoDato,
        idCentroCosto: filtroFormulario.idCentroCosto,
        idAsesor: filtroFormulario.idAsesor,
        idCategoriaOrigen: filtroFormulario.idCategoriaOrigen,
        esWhatsApp: this.agendaService.esWhatsappCorreos ? 'SI': 'NO'
      };
    } else if (
      ['VencidasIpIcPf', 'VencidasIsM', 'PreLanzamiento'].includes(
        this.tab.nombreTab
      )
    ) {
      filtro = {
        idEstado: filtroFormulario.idEstado,
        idFaseOportunidad: filtroFormulario.idFaseOportunidad,
        idAlumno: filtroFormulario.idAlumno,
        idTipoDato: filtroFormulario.idTipoDato,
        idCentroCosto: filtroFormulario.idCentroCosto,
        idOrigen: filtroFormulario.idOrigen,
        idAsesor: filtroFormulario.idAsesor,
        idProbabilidadRegistroPW: filtroFormulario.idProbabilidad,
        idCategoriaOrigen: filtroFormulario.idCategoriaOrigen,
        esWhatsApp: this.agendaService.esWhatsappCorreos ? 'SI': 'NO'
      };
    } else if (['VentaCruzada'].includes(this.tab.nombreTab)) {
      filtro = {
        idEstado: filtroFormulario.idEstado,
        idFaseOportunidad: filtroFormulario.idFaseOportunidad,
        idAlumno: filtroFormulario.idAlumno,
        idTipoDato: filtroFormulario.idTipoDato,
        idCentroCosto: filtroFormulario.idCentroCosto,
        idAsesor: filtroFormulario.idAsesor,
        idProbabilidadRegistroPW: filtroFormulario.idProbabilidad,
        idCategoriaOrigen: filtroFormulario.idCategoriaOrigen,
        esWhatsApp: this.agendaService.esWhatsappCorreos ? 'SI': 'NO'
      };
    } else if (['RN2-B'].includes(this.tab.nombreTab)) {
      this.gridAgenda.gridState.skip = 0;
      filtro = {
        take: String(this.gridAgenda.gridState.take),
        skip: '0',
        page: '1',
        pageSize: String(this.gridAgenda.gridState.take),
        idEstado: filtroFormulario.idEstado,
        idAlumno: filtroFormulario.idAlumno,
        idAsesor: filtroFormulario.idAsesor,
        idTipoDato: filtroFormulario.idTipoDato,
        idOrigen: filtroFormulario.idOrigen,
        idCentroCosto: filtroFormulario.idCentroCosto,
        idCategoriaOrigen: filtroFormulario.idCategoriaOrigen,
        idProbabilidadRegistroPW: filtroFormulario.idProbabilidad,
        esWhatsApp: this.agendaService.esWhatsappCorreos ? 'SI': 'NO'
      };
      this.agendaService.agendaInicializarService.filtroFormularioTabRn2 = {
        filtro: filtro,
        tab: this.tab,
      };
    } else if (['RN2-A'].includes(this.tab.nombreTab)) {
      this.gridAgenda.gridState.skip = 0;
      filtro = {
        take: String(this.gridAgenda.gridState.take),
        skip: '0',
        page: '1',
        pageSize: String(this.gridAgenda.gridState.take),
        idEstado: filtroFormulario.idEstado,
        idAlumno: filtroFormulario.idAlumno,
        idAsesor: filtroFormulario.idAsesor,
        idTipoDato: filtroFormulario.idTipoDato,
        idOrigen: filtroFormulario.idOrigen,
        idCentroCosto: filtroFormulario.idCentroCosto,
        idCategoriaOrigen: filtroFormulario.idCategoriaOrigen,
        idProbabilidadRegistroPW: filtroFormulario.idProbabilidad,
        esWhatsApp: this.agendaService.esWhatsappCorreos ? 'SI': 'NO'
      };
      this.agendaService.agendaInicializarService.filtroFormularioTabRn2A = {
        filtro: filtro,
        tab: this.tab,
      };
    } else if (['Realizadas'].includes(this.tab.nombreTab)) {
      this.gridAgenda.gridState.skip = 0;
      filtro = {
        take: String(this.gridAgenda.gridState.take),
        skip: '0',
        page: '1',
        pageSize: String(this.gridAgenda.gridState.take),
        idEstado: filtroFormulario.idEstado,
        idAlumno: filtroFormulario.idAlumno,
        idsAsesores: filtroFormulario.idAsesor,
        idFaseOportunidad: filtroFormulario.idFaseOportunidad,
        idTipoDato: filtroFormulario.idTipoDato,
        idOrigen: filtroFormulario.idOrigen,
        idCentroCosto: filtroFormulario.idCentroCosto,
        fecha: datePipeTransform(filtroFormulario.fecha, 'yyyyMMdd'),
        categoria: filtroFormulario.idEstado,
        idProbabilidadActual: filtroFormulario.idProbabilidad,
      };
    }
    else if (['Whatsapp', 'Correos'].includes(this.tab.nombreTab)) {
      this.gridAgenda.gridState.skip = 0;
      filtro = {
        idsAsesores: filtroFormulario.idAsesorMR,
      };
    }
    return {
      filtro: filtro,
      tab: this.tab,
    };
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

  procesarFiltroEnvio(): IFiltroTabEnvio {
    let formulario = this.formFiltroAgenda.getRawValue();
    let filtroEnvio: IFiltroTabEnvio = {};

    if (this.validControlFormulario(formulario.idAlumno))
      filtroEnvio.idAlumno = '';
    else filtroEnvio.idAlumno = String(formulario.idAlumno);
    if (this.validControlFormulario(formulario.idAsesor))
      filtroEnvio.idAsesor = String(this.idPersonal);
    else filtroEnvio.idAsesor = formulario.idAsesor.join(',');
    if (this.validControlFormulario(formulario.idCentroCosto))
      filtroEnvio.idCentroCosto = '';
    else filtroEnvio.idCentroCosto = String(formulario.idCentroCosto);
    if (this.validControlFormulario(formulario.idCategoriaOrigen))
      filtroEnvio.idCategoriaOrigen = '';
    else filtroEnvio.idCategoriaOrigen = formulario.idCategoriaOrigen.join(',');
    if (this.validControlFormulario(formulario.idEstado))
      filtroEnvio.idEstado = '';
    else filtroEnvio.idEstado = String(formulario.idEstado);
    if (this.validControlFormulario(formulario.idFaseOportunidad))
      filtroEnvio.idFaseOportunidad = '';
    else filtroEnvio.idFaseOportunidad = String(formulario.idFaseOportunidad);
    if (this.validControlFormulario(formulario.idTipoDato))
      filtroEnvio.idTipoDato = '';
    else filtroEnvio.idTipoDato = String(formulario.idTipoDato);
    if (this.validControlFormulario(formulario.idOrigen))
      filtroEnvio.idOrigen = '';
    else filtroEnvio.idOrigen = String(formulario.idOrigen);
    if (this.validControlFormulario(formulario.idProbabilidad))
      filtroEnvio.idProbabilidad = '';
    else filtroEnvio.idProbabilidad = String(formulario.idProbabilidad);
    if (formulario.fecha == null) filtroEnvio.fecha = new Date();
    else filtroEnvio.fecha = formulario.fecha;
    filtroEnvio.idAsesorMR = this.formFiltroAgenda.get('idAsesorMR').value
    return filtroEnvio;
  }

  filterCentroCosto(value: string) {
    if (value.length >= 4) {
      this.dropCentroCosto.loading = true;
      this.agendaService.agendaVentaCruzadaService
        .obtenerCentroCostoAutocomplete$(value)
        .subscribe({
          next: (resp) => {
            this.dataCentroCosto = resp.body;
            this.sourceCentroCosto = resp.body;
            this.dropCentroCosto.loading = false;
          },
          error: (error) => {
            console.log(error);
            this.dropCentroCosto.loading = false;
          }
        });
    } else if (value.length >= 1) {
      this.dataContacto = [];
    } else {
      this.dataContacto = this.sourceContacto;
      this.multiselectPerAsignado.toggle(false);
    }
  }

  filterContacto(value: string) {
    if (value.length >= 4) {
      this.dropDownListContacto.loading = true;
      this.agendaService.agendaAlumnoService
        .obtenerAlumnoAutocomplete$(value)
        .subscribe({
          next: (resp) => {
            this.dropDownListContacto.loading = false;
            this.sourceContacto = resp.body.slice();
            this.dataContacto = resp.body.slice();
          },
        });
    } else if (value.length >= 1) {
      this.dataContacto = [];
    } else {
      this.dataContacto = this.sourceContacto;
      this.dropDownListContacto.toggle(false);
    }
  }

  abrirCronogramaPago(rowActual: IRowActual) {
    let modalContentOportunidad = this.modalService.open(
      ModalContentCronogramaPagoComponent,
      {
        size: 'xl',
        backdrop: 'static',
      }
    );
    modalContentOportunidad.componentInstance.agendaService =
      this.agendaService;
    modalContentOportunidad.componentInstance.rowActual = rowActual;
  }
  getIndexGridData(rowActual: any): boolean {
    if ((this.tab.nombreTab === 'ProgramacionManual' || this.tab.nombreTab === 'ProgramacionAutomatica') && !this.agendaService.esCoordinadora$.value) {
      let index = this.gridAgenda.data.findIndex((e) => e == rowActual);
      if (index == 0) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  }
  async cargarFicha(rowActual: any) {
    console.log(rowActual);
    this.estadoAbrirFicha = true;
    this.agendaService.agendaProgramacionActividadesService.validacionReprogramacion$
      (rowActual.idOportunidad, rowActual.idFaseOportunidad, rowActual.id).subscribe({
        next: (response) => {
          if(!response.body.existe)
          {
            this.filtrarAgenda();
            this.alertaService.swalFireOptions({
              title: '¡Esta Oportunidad ya ha sido trabajada y se encuentra en fase: ' + response.body.codigoFaseOportunidad + '!',
              text: 'Se actualizarán los datos.',
              icon: 'info',
              showCancelButton: false,
              confirmButtonColor: '#4C5FC0',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Aceptar',
              allowOutsideClick: false,
            });
          } else {
            this.agendaService.setRowActual(rowActual);
            this.agendaService.modalRefOportunidad = this.modalService.open(
              ModalContentOportunidadComponent,
              {
                size: 'xxl',
                backdrop: 'static',
                keyboard: false,
              }
            );
            this.agendaService.modalRefOportunidad.componentInstance.agendaService = this.agendaService;
            this._sharedService.showComentarioFicha$.next(true);
          }
          this.estadoAbrirFicha = false;
        },
        error:(error)=>{
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
          this.estadoAbrirFicha = false;
        }
      })
  }

  filtrarAgenda() {
    const filtroTab = this.obtenerFiltroTab();
    this.gridAgenda.filtroTemp = filtroTab;
    switch (filtroTab.tab.nombreTab) {
      case 'ProgramacionAutomatica':
        this.agendaService.agendaActividadesService.obtenerProgramacionAutomatica(
          filtroTab.filtro
        );
        break;
      case 'ProgramacionManual':
        this.agendaService.agendaActividadesService.obtenerProgramacionManual(
          filtroTab.filtro
        );
        break;
      case 'NoProg1Solicitud':
        this.agendaService.agendaActividadesService.obtenerNoProg1Solicitud(
          filtroTab.filtro
        );
        break;
      case 'NoProgMas1Solicitud':
        this.agendaService.agendaActividadesService.obtenerNoProgMas1Solicitud(
          filtroTab.filtro
        );
        break;
      case 'Workshop':
        this.agendaService.agendaActividadesService.obtenerWorkshop(
          filtroTab.filtro
        );
        break;
      case 'NoProgAltasMedias':
        this.agendaService.agendaActividadesService.obtenerNoProgAltasMedias(
          filtroTab.filtro
        );
        break;
      case 'VencidasIpIcPf':
        this.agendaService.agendaActividadesService.obtenerVencidasIpIcPf(
          filtroTab.filtro
        );
        break;
      case 'VencidasIsM':
        this.agendaService.agendaActividadesService.obtenerVencidasIsM(
          filtroTab.filtro
        );
        break;
      case 'PreLanzamiento':
        this.agendaService.agendaActividadesService.obtenerPreLanzamiento(
          filtroTab.filtro
        );
        break;
      case 'RN2-B':
        this.agendaService.agendaActividadesService.obtenerRN2(
          filtroTab.filtro
        );
        break;
      case 'RN2-A':
          this.agendaService.agendaActividadesService.obtenerRN2A(
            filtroTab.filtro
          );
          break;
      case 'VentaCruzada':
        this.agendaService.agendaActividadesService.obtenerVentaCruzada(
          filtroTab.filtro
        );
        break;
      case 'Realizadas':
        this.agendaService.agendaActividadesService.obtenerRealizadas(
          filtroTab.filtro
        );
        break;
      case 'Whatsapp':
        this.agendaService.agendaActividadesService.obtenerWhatsapp(
          this.formFiltroAgenda.get('idAsesorMR').value
        );
        break;
      case 'Correos':
        this.agendaService.agendaActividadesService.obtenerCorreosComercial(
          this.formFiltroAgenda.get('idAsesorMR').value
        );
        break;
    }
  }
  public rowCallback(context: RowClassArgs) {
    if(context.dataItem?.tipoRegistro != null ){
      if (context.dataItem?.tipoRegistro == 1) {
        return { msWhatsApp: true };
      }
      else{
        return { msWhatsApp: false };
      }
    }
    else{
      return {msWhatsApp: false};
    }
  }
}

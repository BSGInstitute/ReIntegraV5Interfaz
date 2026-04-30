import { data } from './../../../../models/agenda-tab-bandeja-entrada';
import { FooterComponent } from './../../../../../shared/components/footer/footer.component';
import { KendoGrid } from '@shared/models/kendo-grid';
import { MarketingModule } from './../../marketing.module';
import { constApiMarketing, constApiComercial } from '@environments/constApi';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import {
  ComboAsesores,
  ComboBusqueda,
  ComboCategoriaOrigenSector,
  ComboProgramaCritico,
  ComboProgramaGeneral,
  ConfiguracionAsesor,
  errorPersonalizado,
  ICategoriaOrigenSector,
  ICrearSector,
  ImodificarConfiguracion,
  IModificarSector,
  listaActualizarConfiguracionAgrupada,
  listaActualizarConfiguracionIndividual,
  listaBloqueConfiguracionOtrosProgramasGenerales,
  listaBloquePorProgramaCritico,
  listaBloqueProgramaGeneral,
  ListaBloqueProgramasOtrasAreas,
  listaConfiguracionPorProgramaCritico,
  ObtenerAsignacionOrigen,
  ObtenerOrigenSector,
  SumaadorPorProgramaGeneral,
  SumatoriaPorAsesor,
  SumatoriaPorConfiguracionDeAsesor,
} from '@integra/models/origenSector';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TextValidator } from '@shared/validators/text.validator';
import {
  CreateFormGroupArgs,
  GridDataResult,
  RowClassArgs,
} from '@progress/kendo-angular-grid';
import {
  gridAsignacionDatos,
  gridAsignacionRegular,
} from './grid-asignacion-datos';
import { Observable, pipe } from 'rxjs';
import { aggregateBy, AggregateDescriptor, AggregateResult, State } from '@progress/kendo-data-query';
import Swal from 'sweetalert2';
import { parseContent } from '@progress/kendo-editor-common';
import { Item } from '@progress/kendo-angular-charts/common/collection.service';
import { AlertaService } from '@shared/services/alerta.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
const cloneData = (data: any[]) => data.map((item) => Object.assign({}, item));
@Component({
  selector: 'app-asignacion-de-datos',
  templateUrl: './asignacion-de-datos.component.html',
  styleUrls: ['./asignacion-de-datos.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AsignacionDeDatosComponent implements OnInit {
  @ViewChild('modalCrearAsesor') modalCrearAsesor: any;
  @ViewChild('modalAgregarProgramaGeneral') modalAgregarProgramaGeneral: any;
  @ViewChild('modalCrearOrigenSector') modalCrearOrigenSector: any;

  @ViewChild('modalModificarConfiguracionAsesor') modalModificarConfiguracionAsesor: any;
  @ViewChild('modalAgregarCategoriaOrigen') modalAgregarCategoriaOrigen: any;
  @ViewChild('modalConfigurarCategoriaOrigen') modalConfigurarCategoriaOrigen: any;
  @ViewChild('modalAsiganarDatos') modalAsiganarDatos: any;


  ////////////////////////////////////////////////////////******    constructor   ******///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* #region  Constructor GENERAL */
  constructor(
    private integraService: IntegraService,
    private modalservice: NgbModal,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer


  ) {
    this.createFormGroup = this.createFormGroup.bind(this);
  }

  ngOnInit(): void {
    this.ObtenerBloqueAsesores();
    this.ObtenerProveedoresConfigurados();
    this.Fun_ObtenerOrigenSector();
    this. ObtenerComboAsesores();
    this.Fun_ObtenerComboListaProgramasGenerales();
    // this.Fun_ObtenerBloquePorProgramaCritico();
    // this.Fun_ObtenerBloqueProgramasOtrasAreas();
    // this.Fun_ObtenerComboListaBusqueda();
    // this.Fun_ObtenerComboListaBusqueda2();


    // this.Fun_ObtenerConfiguracionAsignacionRegular();
  }
  /* #endregion */

  ////////////////////////////////////////////////////////******    Variables    ******//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* #region  Variables TAB 1 */
  gridAsignacionDatos = gridAsignacionDatos;
  loaderGrid: boolean;
  contadorOrigenAsignados: number;
  contadorOrigenNoAsignados: number;
  listaContadorOrigenAsignados: any[];
  listaContadorOrigenNoAsignados: any[];
  itemsHistoricoProductoCombo: any[];
  listObtenerCategoriaOrigenSector: ICategoriaOrigenSector[];
  id: number;
  nombre: string;
  descripcion: string;
  orden: number;
  cantidadOportunidad: number;
  esAgrupado: boolean;
  @ViewChild('modalAgregarOrigenSector') modalAgregarOrigenSector: any;
  @ViewChild('modalCerrarOrigenSector') modalCerrarOrigenSector: any;
  public opened = false;
  ListaConfiguracionModificacion: ImodificarConfiguracion[];
  ListaDeactualizacion?: ImodificarConfiguracion[] = [];
  formCrearSectorMarkeitng: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    descripcion: ['', [Validators.required]],
    idProveedorCampaniaIntegra: ['', Validators.required],
    listaCategoriaOrigenIndividual: ['', Validators.required],
    listaCategoriaOrigenAgrupado: ['', Validators.required],
  });
  ListaObtenerOrigenSector: ObtenerOrigenSector[] = [];
  categoriaOrigenSector: ICategoriaOrigenSector = {
    origenDatoCalidadDetalleIndividual: [],
    origenDatoCalidadDetalleAgrupado: null,
  };


  isActive: boolean = true;

  loaderModal: boolean = false;
  openedAsignacionPaisAsesor: boolean = false;
  asignacionPaisAsesor: string = '';
  selectedAsesorId: number = null;
  createFormGroup(args: CreateFormGroupArgs): FormGroup {
    return this.formCrearSectorMarkeitng;
  }
  /* #endregion */
  gridAsignacionRegular = gridAsignacionRegular;
  ListaBloquePorProgramaCritico: listaBloquePorProgramaCritico[] = [];
  ListaBloquePorProgramaCriticoBusqueda: listaBloquePorProgramaCritico[] = [];
  public valorgit=1

  ListaBloqueConfiguracionOtrosProgramasGenerales: listaBloqueConfiguracionOtrosProgramasGenerales[] = [];


  ListaConfiguracionAsignacionRegular: listaConfiguracionPorProgramaCritico[] =
    [];
  ListaActualizacionAsignacionRegular: listaConfiguracionPorProgramaCritico[] =
    [];
  ListaBloqueProgramasOtrasAreas: listaBloqueConfiguracionOtrosProgramasGenerales[] = [];
  ListaBloqueProgramasOtrasAreasBusqueda: listaBloqueConfiguracionOtrosProgramasGenerales[] = [];
  listItems: Array<number> = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,
  ];

  ListaBloqueProgramaGeneral:listaBloqueProgramaGeneral[]=[];


  ListaCombo:ComboBusqueda;
  ListaCombo2:ComboBusqueda;
  EstadoAsignacion: number=0;



  FormularioProgramasOtros: FormGroup = this.formBuilder.group({
    comboProgramaCritico :'',
    comboProgramaGeneral:'',
    comboAsesor:'',
    comboCoordinador:'',

  });
  FormularioAsignacionRegular: FormGroup = this.formBuilder.group({
    comboProgramaCritico :'',
    comboProgramaGeneral:'',
    comboAsesor:'',
    comboCoordinador:'',

  });

    gridGrupoFiltroPrograma: KendoGrid = new KendoGrid();
    gridAsesorAsignacionAutomatica: KendoGrid = new KendoGrid();
    gridConfiguracionAsesorAsignacionAutomatica: KendoGrid = new KendoGrid();
    gridOrigenSector: KendoGrid = new KendoGrid();



    isNew: boolean = false;
    IdOrigenSector: number = null;

    EsAsignacion: boolean = false;


    dataEditTemporal: any = {}; //data original
    modalRef: any;
    ListaComboAsesores : ComboAsesores [] = [];
    ListaProgramaGeneral : ComboProgramaGeneral [] = [];
    ListaComboCategoriaOrigenSector : ComboCategoriaOrigenSector [] = [];

    ConfiguracionAsesor : ConfiguracionAsesor = {
      id :0 ,
      estadoAsesor :null ,
      coordinador :null ,
      asesor :null ,
      oportunidadesAbiertas :null  ,
      topeOportunidad :null ,
      activarAsignacionAutomatica :null ,
    };
    formAgregarAsesor: FormGroup = this.formBuilder.group({
      id: 0,
    });
    formCrearSector: FormGroup = this.formBuilder.group({
      id: 0,
      nombre: '',
      descripcion: ''
    });

    formAgregarCategoriaOrigen: FormGroup = this.formBuilder.group({
      id: 0    });
    formAgregarProgramaGeneral: FormGroup = this.formBuilder.group({
      idProgramaGeneral: 0,
    });


    total: AggregateResult = {
      cantidadTotal : { sum: 0},
      cantidadTotalPeru : { sum: 0},
      cantidadTotalColombia : { sum: 0},
      cantidadTotalMexico : { sum: 0},
      cantidadTotalBolivia : { sum: 0},
      cantidadTotalChile : { sum: 0},
      cantidadTotalInternacional : { sum: 0},
    };
    aggregates: AggregateDescriptor[] = [
      { field: 'cantidadTotal',  aggregate: 'sum' },
      { field: 'cantidadTotalPeru',  aggregate: 'sum' },
      { field: 'cantidadTotalColombia',  aggregate: 'sum' },
      { field: 'cantidadTotalMexico',  aggregate: 'sum' },
      { field: 'cantidadTotalBolivia',  aggregate: 'sum' },
      { field: 'cantidadTotalChile',  aggregate: 'sum' },
      { field: 'cantidadTotalInternacional',  aggregate: 'sum' }
    ]
  ////////////////////////////////////////////////////////******    Eventos Grillas    ******///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  AgregarCategoriaOrigenSector( ) {
    this.integraService
      .postJsonResponse(
        constApiMarketing.InsertarCategoriaOrigenPorSector+'/'+this.IdOrigenSector,JSON.stringify(this.formAgregarCategoriaOrigen.value)
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {

        },
        error: (error) => {
          this.ObtenerCategoriaOrigenPorSectorPorIdDirecto();
          this.Fun_ObtenerOrigenSector();
          this.alertaService.notificationError(error.error);

        },
        complete: () => {
          this.ObtenerCategoriaOrigenPorSectorPorIdDirecto();
          this.Fun_ObtenerOrigenSector();

          this.modalRef.close('submitted');

          this.alertaService.mensajeExitoso();
        },
      });
    }

    EliminarConfiguracionCategoriaOrigen( dataItem: any) {
      this.integraService
        .postJsonResponse(
          constApiMarketing.EliminarConfiguracionCategoriaOrigen+'/'+dataItem,null
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
          },
          error: (error) => {
            this.  ObtenerCategoriaOrigenPorSectorPorIdDirecto();
            this.Fun_ObtenerOrigenSector();

            this.alertaService.notificationError(error.error);
          },
          complete: () => {
            this.  ObtenerCategoriaOrigenPorSectorPorIdDirecto();
            this.Fun_ObtenerOrigenSector();

            this.alertaService.mensajeExitoso();
          },
        });
    }
  abrirModal6(isNew: boolean, dataItem?: any) {
    this.ObtenerCategoriaOrigen();
    this.isNew = isNew;
    this.formAgregarCategoriaOrigen.reset();
    if (isNew) {
      // this.formGrupoFiltroPrograma.reset();
    } else {
      this.loaderModal = false;
    }
    this.modalRef = this.modalService.open(this.modalAgregarCategoriaOrigen, {
      backdrop: 'static'
    });
  }
  ObtenerCategoriaOrigen() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerCategoriaOrigen}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.ListaComboCategoriaOrigenSector= response.body;
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);

        },
        complete: () => {
          this.alertaService.mensajeExitoso('Data cargada con exito');

        },

      });
  }
  ObtenerCategoriaOrigenPorSector(OrigenSector :any) {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerCategoriaOrigenPorSector+'/'+OrigenSector.id}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridOrigenSector.data= response.body;
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);

        },
        complete: () => {
          this.alertaService.mensajeExitoso('Data cargada con exito');

        },

      });
  }
  ObtenerCategoriaOrigenPorSectorPorIdDirecto() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerCategoriaOrigenPorSector+'/'+this.IdOrigenSector}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridOrigenSector.data= response.body;
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);

        },
        complete: () => {
          this.alertaService.mensajeExitoso('Data cargada con exito');

        },

      });
  }
  AbrirModalCateogriaOrigen(isNew: boolean, OrigenSector: ObtenerOrigenSector) {
    this.IdOrigenSector = OrigenSector.id;
    this.ObtenerCategoriaOrigenPorSector(OrigenSector);
    if (isNew) {
    } else {
      this.loaderModal = false;
    }
    this.modalRef = this.modalService.open(this.modalConfigurarCategoriaOrigen, {
      size: 'xl',
      backdrop: 'static'
    });
  }


  EliminarSector(origenSector: ObtenerOrigenSector): void {
    this.integraService
    .postJsonResponse(
      constApiMarketing.EliminarOrigenSectorPorParametro+'/'+origenSector.id,null
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
      },
      error: (error) => {
                this .opened= false;

        this.Fun_ObtenerOrigenSector();
        this.alertaService.notificationError(error.error);
      },
      complete: () => {
        this .opened= false;
        this.Fun_ObtenerOrigenSector();
      },
    });
  }
  ActualizarTopeOportunidad(e: KeyboardEvent, dataItem: any) {
    if (e.key === 'Enter') {
      this.integraService
        .postJsonResponse(
          constApiMarketing.ActualizarTopeOportunidad+'/'+dataItem.id+'/'+dataItem.topeOportunidad,null
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
          },
          error: (error) => {
            this. ObtenerBloqueAsesores();
            this.alertaService.notificationError(error.error);
          },
          complete: () => {
            this. ObtenerBloqueAsesores();
          },
        });

    }
  }


  ActualizarTopeAsignacionDiaria(e: KeyboardEvent, dataItem: any) {
    if (e.key === 'Enter') {
      this.integraService
        .postJsonResponse(
          constApiMarketing.ActualizarTopeAsignacionDiaria+'/'+dataItem.id+'/'+dataItem.topeAsignacionDiaria,null
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
          },
          error: (error) => {
            this. ObtenerBloqueAsesores();
            this.alertaService.notificationError(error.error);
          },
          complete: () => {
            this. ObtenerBloqueAsesores();
          },
        });

    }
  }



  ActualizarPrioridad(e: KeyboardEvent, dataItem: any) {
    if (e.key === 'Enter') {
      this.integraService
        .postJsonResponse(
          constApiMarketing.ActualizarPrioridad+'/'+dataItem.id+'/'+dataItem.prioridad,null
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
          },
          error: (error) => {
            this. ObtenerBloqueAsesores();
            this.alertaService.notificationError(error.error);
          },
          complete: () => {
            this. ObtenerBloqueAsesores();
          },
        });

    }
  }

  ActualizarConfiguracionPorPais( dataItem: any) {

      this.integraService
        .postJsonResponse(
          constApiMarketing.ActualizarConfiguracionAsignacionRegular,JSON.stringify(dataItem)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.ObtenerConfiguracionAsesorPorPais(this.ConfiguracionAsesor);

          },
          error: (error) => {
            this.alertaService.notificationError(error.error);
          },
          complete: () => {
            this.ObtenerConfiguracionAsesorPorPais(this.ConfiguracionAsesor);
            this.alertaService.mensajeExitoso();
          },
        });
    }

    AgregarSector( ) {
      console.log( JSON.stringify(this.formCrearSector.value));
      this.integraService
        .postJsonResponse(
          constApiMarketing.InsertarOrigenSector,JSON.stringify(this.formCrearSector.value)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {

          },
          error: (error) => {
            this.Fun_ObtenerOrigenSector();
            this.alertaService.notificationError(error.error);

          },
          complete: () => {
            this.Fun_ObtenerOrigenSector();
            this.modalRef.close('submitted');
            this.alertaService.mensajeExitoso();
          },
        });
      }

      ActualizaSector( ) {

        this.integraService
          .postJsonResponse(
            constApiMarketing.InsertarConfiguracionAsignacionRegular+'/'+this.ConfiguracionAsesor.id,JSON.stringify(this.formAgregarProgramaGeneral.value)

          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              this.ObtenerConfiguracionAsesorPorPais(this.ConfiguracionAsesor);

            },
            error: (error) => {
              this.alertaService.notificationError(error.error);
              this.ObtenerConfiguracionAsesorPorPais(this.ConfiguracionAsesor);

            },
            complete: () => {
              this.modalRef.close('submitted');
              this.alertaService.mensajeExitoso();
            },
          });
        }

    AgregarProgramasGenerales(  dataItem:any) {

      this.integraService
        .postJsonResponse(
          constApiMarketing.InsertarConfiguracionAsignacionRegular+'/'+this.ConfiguracionAsesor.id,JSON.stringify(this.formAgregarProgramaGeneral.value)

        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.ObtenerConfiguracionAsesorPorPais(this.ConfiguracionAsesor);

          },
          error: (error) => {
            this.alertaService.notificationError(error.error);
            this.ObtenerConfiguracionAsesorPorPais(this.ConfiguracionAsesor);

          },
          complete: () => {
            this.modalRef.close('submitted');
            this.alertaService.mensajeExitoso();
          },
        });
      }

    Fun_ObtenerComboListaProgramasGenerales() {
      this.loaderGrid = true;
      this.integraService
        .getJsonResponse(constApiMarketing.ObtenerComboListaProgramasGenerales)
        .subscribe({
          next: (response: HttpResponse<ComboProgramaGeneral[]>) => {
            this.ListaProgramaGeneral = response.body;
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {
          },
        });
    }


    EliminarAsesor(dataItem: any) {

      this.gridAsesorAsignacionAutomatica.loading = true;
      this.integraService
        .postJsonResponse(
          constApiMarketing.EliminarAsignacionRegular+'/'+dataItem.id,null
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.gridAsesorAsignacionAutomatica.loading = false;
            this. ObtenerBloqueAsesores();
          },
          error: (error) => {
            this.alertaService.notificationError(error.error);
          },
          complete: () => {
            this.alertaService.mensajeExitoso();
            this. ObtenerBloqueAsesores();

          },
        });
      }

      RecargarDataModal2(){
        this.ObtenerConfiguracionAsesorPorPais(this.ConfiguracionAsesor);

      }
      EliminarPaisConfiguracionAsignacionRegular(IdPaisAsignacionRegular: any) {

        this.gridConfiguracionAsesorAsignacionAutomatica.loading = true;
        this.integraService
          .postJsonResponse(
            constApiMarketing.EliminarPaisConfiguracionAsignacionRegular+'/'+IdPaisAsignacionRegular,null
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              this.gridConfiguracionAsesorAsignacionAutomatica.loading = false;
              this.ObtenerConfiguracionAsesorPorPais(this.ConfiguracionAsesor);

            },
            error: (error) => {
              this.alertaService.notificationError(error.error);
              this.ObtenerConfiguracionAsesorPorPais(this.ConfiguracionAsesor);

            },
            complete: () => {
              this.alertaService.mensajeExitoso();


            },
          });
        }
  ObtenerBloqueAsesores() {
    this.gridAsesorAsignacionAutomatica.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerListaAsesor}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridAsesorAsignacionAutomatica.data = response.body;
          this.gridAsesorAsignacionAutomatica.loading = false;
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
          this.gridAsesorAsignacionAutomatica.loading = false;

        },
        complete: () => {
          this.gridAsesorAsignacionAutomatica.loading = false;
          this.alertaService.mensajeExitoso('Data cargada con exito');

        },

      });
  }

  ObtenerComboAsesores() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerComboAsesores}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.ListaComboAsesores = response.body;
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
        complete: () => {},
      });
  }

  crearConfiguracionAsesor() {
    this.integraService
      .postJsonResponse(
        constApiMarketing.InsertarAsesorAsignacionRegular,
        JSON.stringify(this.formAgregarAsesor.value)
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
        },
        error: (error) => {
          this. ObtenerBloqueAsesores();
          this.alertaService.notificationError(error.error);
        },
        complete: () => {
          this.modalRef.close('submitted');
          this. ObtenerBloqueAsesores();
          this.alertaService.mensajeExitoso('');
        },
      });
    }


  public colorCode(code: string): SafeStyle {
    let result;

    switch (code) {
      case "Inactivo":
        result = "#FF0000";
        break;
      case "Activo":
        result = "#32FF00 ";
        break;
      default:
        result = "#FBFF00";
        break;
    }

    return this.sanitizer.bypassSecurityTrustStyle(result);
  }

  public ColorButton(): SafeStyle {
    let result;

    switch (this.EsAsignacion) {
      case true:
        result = "#EEF155 ";
        break;
        case false:
        result = "#1274AB";
        break;
      default:
        result = "#FBFF00";
        break;
    }

    return this.sanitizer.bypassSecurityTrustStyle(result);
  }

  abrirModal(isNew: boolean, dataItem?: any) {
    this.isNew = isNew;
    this.formAgregarAsesor.reset();
    if (isNew) {
      // this.formGrupoFiltroPrograma.reset();
    } else {
      this.loaderModal = false;
    }
    this.modalRef = this.modalService.open(this.modalCrearAsesor, {
      backdrop: 'static'
    });
  }
  abrirModal3(isNew: boolean, dataItem?: any) {
    this.isNew = isNew;
    this.formAgregarProgramaGeneral.reset();
    if (isNew) {
      // this.formGrupoFiltroPrograma.reset();
    } else {
      this.loaderModal = false;
    }
    this.modalRef = this.modalService.open(this.modalAgregarProgramaGeneral, {
      backdrop: 'static'
    });
  }

  abrirModal4(isNew: boolean, dataItem?: any) {
    this.isNew = isNew;
    this.formAgregarProgramaGeneral.reset();
    if (isNew) {
      // this.formGrupoFiltroPrograma.reset();
    } else {
      this.loaderModal = false;
    }
    this.modalRef = this.modalService.open(this.modalAgregarProgramaGeneral, {
      backdrop: 'static'
    });
  }
  abrirModal5(isNew: boolean) {
    this.isNew = isNew;
    this.formCrearSector.reset();
    if (isNew) {
      // this.formGrupoFiltroPrograma.reset();
    } else {
      this.loaderModal = false;
    }
    this.modalRef = this.modalService.open(this.modalCrearOrigenSector, {
      backdrop: 'static'
    });
  }
  abrirModal2(isNew: boolean, dataItem: any) {
    this.ObtenerConfiguracionAsesor(dataItem);
    this.ObtenerConfiguracionAsesorPorPais(dataItem);
    if (isNew) {
    } else {
      this.loaderModal = false;
    }
    this.modalRef = this.modalService.open(this.modalModificarConfiguracionAsesor, {
      size: 'fullscreen',
      backdrop: 'static'
    });
  }

  ActivarAsignacionAutomatica(event: any, dataItem: any) {
    this.integraService
      .postJsonResponse(
        constApiMarketing.ActivarAsignacionAutomatica+'/'+dataItem.id+'/'+dataItem.activarAsignacionAutomatica,null
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
        },
        error: (error) => {
          this. ObtenerBloqueAsesores();
          this.alertaService.notificationError(error.error);
        },
        complete: () => {
          this. ObtenerBloqueAsesores();
          this.alertaService.mensajeExitoso();
        },
      });
  }

  AgruparDatos(event: any, dataItem: any) {
    this.integraService
      .postJsonResponse(
        constApiMarketing.AgruparCategoriaOrigen+'/'+dataItem.id+'/'+dataItem.agruparCategoriaOrigen,null
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
        },
        error: (error) => {
          this.  ObtenerCategoriaOrigenPorSectorPorIdDirecto();
          this.Fun_ObtenerOrigenSector();

          this.alertaService.notificationError(error.error);
        },
        complete: () => {
          this.  ObtenerCategoriaOrigenPorSectorPorIdDirecto();
          this.Fun_ObtenerOrigenSector();

          this.alertaService.mensajeExitoso();
        },
      });
  }
  // gridConfiguracionAsesorAsignacionAutomatica


  AgregarTopeAsesor(event: any, dataItem: any) {
    this.integraService
      .postJsonResponse(
        constApiMarketing.ActivarAsignacionAutomatica+'/'+dataItem.id+'/'+dataItem.activarAsignacionAutomatica,null
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this. ObtenerBloqueAsesores();
        },
        error: (error) => {
          this. ObtenerBloqueAsesores();
          this.alertaService.notificationError(error.error);
        },
        complete: () => {
          this. ObtenerBloqueAsesores();
          this.alertaService.mensajeExitoso();
        },
      });
  }
  ObtenerConfiguracionAsesor( dataItem: any) {
    this.integraService
      .getJsonResponse(
        constApiMarketing.ObtenerAsesorConfiguracion+'/'+dataItem.id,null
      )
      .subscribe({
        next: (response: HttpResponse<ConfiguracionAsesor>) => {
          this.ConfiguracionAsesor = response.body;
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
        complete: () => {
        },
      });
  }







listaPaises = [
  { title :'Peru',idPais: 51, field: 'Peru' },
  { title :'Mexico',idPais: 52, field: 'Mexico' },
  { title : 'Colombia',idPais: 57, field: 'Colombia' },
  { title :'Bolivia',idPais: 591, field: 'Bolivia' },
  { title : 'Chile',idPais: 56, field: 'Chile' },
  { title : 'Internacional',idPais: 0, field: 'Internacional' },
];





  ObtenerConfiguracionAsesorPorPais( dataItem: any) {
    this.loaderModal = true;
    this.gridConfiguracionAsesorAsignacionAutomatica.data = [];
    this.integraService
    .getJsonResponse(
        constApiMarketing.ObtenerAsesorConfiguracionPorPais+'/'+dataItem.id
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {

          this.loaderModal = false;
          this.gridConfiguracionAsesorAsignacionAutomatica.data = response.body;
            if(response.body.length > 0){
              this.total = aggregateBy(response.body, this.aggregates);
            }else{
              this.total = {
                cantidadTotal : { sum: 0},
                cantidadTotalPeru : { sum: 0},
                cantidadTotalColombia : { sum: 0},
                cantidadTotalMexico : { sum: 0},
                cantidadTotalBolivia : { sum: 0},
                cantidadTotalChile : { sum: 0},
                cantidadTotalInternacional : { sum: 0},
              };
            }

        },
        error: (error) => {
          this.loaderModal = false;
          this.alertaService.notificationError(error.error);
        },
        complete: () => {
          this.loaderModal = false;
          this.alertaService.mensajeExitoso('Data obtenida con Exito');
        },
      });
  }





  ObtenerFiltroPersonal(id: number) {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.GrupoFiltroProgramaObtenerAsesoresPorGrupoId}/${id}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          //this.gridGrupoFiltroPrograma.data= response.body;
          let datos = response.body;
          let ids: number[] = [];
          datos.forEach((e: any) => {
            ids.push(e.id);
          });
          this.formAgregarAsesor.get('asesor').setValue(ids);
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
        complete: () => {},
      });
  }

  /* #region  Eventos a nivel de grillas TAB 1 */

  onChangeFooter(
    origenSector: any,
    OrigenSectorOriginal: any,
    idOrigenSector: number
  ) {
    let nuevaData = origenSector.footer;
    let dataorignalFooter: ImodificarConfiguracion = OrigenSectorOriginal;
    dataorignalFooter.idorigenSector = idOrigenSector;
    nuevaData.idorigenSector = idOrigenSector;
    if (origenSector.contadorCambios == undefined) {
      origenSector.contadorCambios = 0;
    }
    if (this.ObjCompare(nuevaData, dataorignalFooter)) {
      origenSector.contadorCambios = origenSector.contadorCambios - 1;
      this.ListaDeactualizacion.splice(
        this.ListaDeactualizacion.indexOf(nuevaData),
        1
      );
      return;
    }
    for (const obj of this.ListaDeactualizacion) {
      if (obj.idOrigenDatoCalidad == undefined) {
        this.ListaDeactualizacion.splice(
          this.ListaDeactualizacion.indexOf(obj),
          1
        );
        this.ListaDeactualizacion.push(nuevaData);
        return;
      }
    }

    if (!this.ObjCompare(nuevaData, dataorignalFooter)) {
      origenSector.contadorCambios = origenSector.contadorCambios + 1;
      this.ListaDeactualizacion.push(nuevaData);
      return;
    }
    //   this.ListaDeactualizacion. push(column);
  }
  getAlterado(origenSector: any, dataItem: any, field: any): boolean {
    let itemOriginal =
      origenSector.categoriaOrigenSector.origenDatoCalidadDetalleIndividual.find(
        (e: any) => e.idOrigenDatoCalidad == dataItem.idOrigenDatoCalidad
      );

    if (itemOriginal[field] == dataItem[field]) {
      return false;
    } else {
      return true;
    }
  }
  onChange(
    origenSector: ObtenerOrigenSector,
    dataItem: any,
    field: any = 'datosCalidad'
  ) {
    var indice = 0;
    if (origenSector.contadorCambios == undefined) {
      origenSector.contadorCambios = 0;
    }
    for (const item of origenSector.categoriaOrigenSector
      .origenDatoCalidadDetalleIndividual) {
      if (item.idOrigenDatoCalidad == dataItem.idOrigenDatoCalidad) {
        indice =
          origenSector.categoriaOrigenSector.origenDatoCalidadDetalleIndividual.indexOf(
            item
          );
      }
    }
    let conversion: any =
      origenSector.categoriaOrigenSector.origenDatoCalidadDetalleIndividual[
        indice
      ];
    let dataItemOriginal: ImodificarConfiguracion = conversion;
    dataItemOriginal.esAgrupado = false;
    dataItem.esAgrupado = false;
    dataItem.idorigenSector = origenSector.id;
    dataItemOriginal.idorigenSector = origenSector.id;
    for (const fila of this.ListaDeactualizacion) {
      if (fila.idOrigenDatoCalidad == dataItem.idOrigenDatoCalidad) {
        this.ListaDeactualizacion.splice(
          this.ListaDeactualizacion.indexOf(fila),
          1
        );
        this.ListaDeactualizacion.push(dataItem);
        var Existe = true;
        break;
      }
    }
    if (Existe) {
      if (this.ObjCompare(dataItem, dataItemOriginal)) {
        origenSector.contadorCambios = origenSector.contadorCambios - 1;
        this.ListaDeactualizacion.splice(
          this.ListaDeactualizacion.indexOf(dataItem),
          1
        );
        return;
      }
      return;
    }
    if (this.ListaDeactualizacion.length == 0) {
      origenSector.contadorCambios = 1;
      this.ListaDeactualizacion.push(dataItem);
    } else {
      if (!this.ObjCompare(dataItem, dataItemOriginal)) {
        for (const item of this.ListaDeactualizacion) {
          if (!this.ObjCompare(item, dataItem)) {
            origenSector.contadorCambios = origenSector.contadorCambios + 1;
            this.ListaDeactualizacion.push(dataItem);
            return;
          }
        }
      } else {
        for (const itemRestarCambio of this.ListaDeactualizacion) {
          //------------------**Bloque de comparacion de objetos
          if (this.ObjCompare(itemRestarCambio, dataItem)) {
            origenSector.contadorCambios = origenSector.contadorCambios - 1;
            this.ListaDeactualizacion.splice(
              this.ListaDeactualizacion.indexOf(dataItem)
            );
            return;
          }
        }
      }
    }
  }
  /* #region  Reddd */

  GuardarConfiguracionesCategoriaOrigen(origenSector: ObtenerOrigenSector) {
    var idorigenSector: number = origenSector.id;
    let listaActualizarConfiguracionAgrupada: listaActualizarConfiguracionAgrupada;
    let listaActualizarConfiguracionIndividual: listaActualizarConfiguracionIndividual[] =
      [];
    var contieneCambiosI: number = 0;
    var contieneCambiosA: number = 0;

    for (var obj of this.ListaDeactualizacion) {
      if (obj.idorigenSector == idorigenSector) {
        if (obj.idOrigenDatoCalidad == undefined) {
          contieneCambiosA = 1;
        }
        if (obj.idOrigenDatoCalidad != undefined) {
          contieneCambiosI = 1;
        }
      }
    }
    if (contieneCambiosI == 1 || contieneCambiosA == 1) {
      for (var obj of this.ListaDeactualizacion) {
        if (obj.idorigenSector == idorigenSector) {
          if (obj.idOrigenDatoCalidad == undefined) {
            let conversion: any = obj;
            let dataConvertidaAgrupados: listaActualizarConfiguracionAgrupada =
              conversion;
            listaActualizarConfiguracionAgrupada = dataConvertidaAgrupados;
            listaActualizarConfiguracionAgrupada.UsuarioModificacion =
              'emaytaVistasV5';
          }
          if (obj.idOrigenDatoCalidad != undefined) {
            let dataConvertida: listaActualizarConfiguracionIndividual = {
              idorigendatoCalidad: obj.idOrigenDatoCalidad,
              DatosCalidad: obj.datosCalidad,
              DatoCalidadWhatsapp:obj.datoCalidadWhatsapp,
              DatoCalidadMailing:obj.datoCalidadMailing,
              MuyAltaAr: obj.muyAltaAr,
              MuyAltaAd: obj.muyAltaAd,
              AltaAd: obj.altaAd,
              AltaAr: obj.altaAr,
              MediaAd: obj.mediaAd,
              MediaAr: obj.mediaAr,
              UsuarioModificacion: 'emaytaVistasV5',
            };
            listaActualizarConfiguracionIndividual.push(dataConvertida);
          }
        }
      }

      var estadoActualizacion: boolean = false;
      var estadoActualizacionI: boolean = false;
      if (contieneCambiosI == 1) {
        this.integraService
          .insertarLista(
            constApiMarketing.ActualizarConfiguracionCategoriaOrigen,
            listaActualizarConfiguracionIndividual
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              estadoActualizacionI = response.body;
              if (estadoActualizacionI == true) {
                this.mostrarMensajeExitoso('Actualizado correctamente');
                listaActualizarConfiguracionIndividual = [];
                this.DeshacerModificacionSector(origenSector);
              }
            },
            error: (error) => {
              this.mostrarMensajeError(error);
            },
            complete: () => {},
          });
      }
      estadoActualizacion = false;

      if (contieneCambiosA == 1) {

        this.integraService
          .insertar(
            constApiMarketing.ActualizarConfiguracionAgrupadaCategoriaOrigen,
            listaActualizarConfiguracionAgrupada
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              estadoActualizacion = response.body;
              if (estadoActualizacion == true) {
                this.mostrarMensajeExitoso(
                  'Configuracion agrupada Actualizado correctamente'
                );
                this.DeshacerModificacionSector(origenSector);
              }
            },
            error: (error) => {
              this.mostrarMensajeError(error);
            },
            complete: () => {},
          });
      }
    }
  }

  ObjCompare(obj1: any, obj2: any) {
    const Obj1_keys = Object.keys(obj1);
    const Obj2_keys = Object.keys(obj2);
    if (Obj1_keys.length !== Obj2_keys.length) {
      return false;
    }
    for (let k of Obj1_keys) {
      if (obj1[k] !== obj2[k]) {
        return false;
      }
    }
    return true;
  }
  /* #endregion */
  /* #endregion */

  ////////////////////////////////////////////////////////*****     Botones Sectores   ****//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* #region  Botones a nivel de sectores */
  DeshacerModificacionSector(OrigenSector: ObtenerOrigenSector): void {
    this.obtenerCategoriaOrigenConfiguraciones(OrigenSector.id);
    for (const item of this.ListaDeactualizacion) {
      if (item.idorigenSector == OrigenSector.id) {
        this.ListaDeactualizacion.splice(
          this.ListaDeactualizacion.indexOf(item)
        );
      }
    }

    OrigenSector.contadorCambios = 0;
  }

  public onExpand(idSector: number): void {
    this.ListaObtenerOrigenSector.forEach((element) => {
      if (element.id == idSector) {
        element.grid = new KendoGrid();
        element.grid.selectable = true;
        element.grid.resizable = true;
        element.grid.filterable = 'menu';
        // element.grid.height = 600;
        element.grid.gridState = {
          skip: 0,
          take: 20,
        };
        element.grid.columns = this.gridAsignacionDatos.columns;
        element.footer = {
          datosCalidad: null,
        datoCalidadWhatsapp :null,
         datoCalidadMailing:null,
          muyAltaAd: null,
          muyAltaAr: null,
          altaAd: null,
          altaAr: null,
          mediaAd: null,
          mediaAr: null,
        };
        element.grid.loading = true;
      }
    });

    this.obtenerCategoriaOrigenConfiguraciones(idSector);
  }


  public CancelarModificacionSector(event: boolean): void {
    // this.log(`expandedChange: ${event}`);
  }

  crearSector(): void {
    this.modalservice.open(this.modalAgregarOrigenSector);
  }

  cerrarModal(): void {
    this.modalservice.dismissAll(this.modalCerrarOrigenSector);
  }

  gridEventsAsignacion(e: any) {}
  /* #endregion */

  ////////////////////////////////////////////////////////******    Ecentos exitosos fallidos    ******///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /* #region  Eventos de exitoso */
  mostrarMensajeError(error: any): void {
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
    <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false,
    });
  }

  mostrarMensajeExitoso(mensaje: string) {
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: mensaje,
    });
  }
  public onCollapse(idSector: ObtenerOrigenSector): void {
    this.DeshacerModificacionSector(idSector);
  }
  /* #endregion */

  /////////////////////////////////////////////////////////******   Eventos Iniciales   ******///////////////////////////////////////////////////////

  /* #region  Eventos Iniciales al abrir pagina */
  ObtenerProveedoresConfigurados() {
    this.loaderGrid = true;
    this.integraService.obtenerTodo(constApiMarketing.OrigenSector).subscribe({
      next: (response: HttpResponse<any>) => {
        this.contadorOrigenAsignados = response.body.contadorConfigurado;
        this.contadorOrigenNoAsignados = response.body.contadorNoConfigurado;
        this.listaContadorOrigenAsignados =
          response.body.listaOrigenSectorConfigurado;
        this.listaContadorOrigenNoAsignados =
          response.body.listaOrigenSectorNoConfigurado;
        this.itemsHistoricoProductoCombo =
          response.body.listaOrigenSectorNoConfigurado;
        this.loaderGrid = false;
      },
      error: (error) => {
        // this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  VerData() {}

  getNombreAgrupado(OrigenSector: ObtenerOrigenSector): string {
    if (OrigenSector.categoriaOrigenSector) {
      let data =
        OrigenSector.categoriaOrigenSector.origenDatoCalidadDetalleAgrupado;
      return data?.nombreCantidadAgrupadoVarDTO.nombre;
    } else {
      return '';
    }
  }

  getCheckedAgrupado(OrigenSector: any, field: string): boolean {
    if (
      OrigenSector.categoriaOrigenSector.origenDatoCalidadDetalleAgrupado
        .listaOrigenesAgrupado
    ) {
      return OrigenSector.categoriaOrigenSector.origenDatoCalidadDetalleAgrupado
        .listaOrigenesAgrupado[field];
    } else {
      return false;
    }
  }

  obtenerCategoriaOrigenConfiguraciones(idSector: number) {
    // this.loaderGrid = true;

    var clave = [{ clave: 'id', valor: idSector }];
    this.integraService
      .obtenerPorPathParams(
        constApiMarketing.ObtenerCategoriaOrigenConfiguracion,
        clave
      )
      .subscribe({
        next: (response: HttpResponse<ICategoriaOrigenSector>) => {
          this.ListaObtenerOrigenSector.forEach((element: any) => {
            if (element.id == idSector) {
              element.categoriaOrigenSector = response.body;

              if (
                response.body.origenDatoCalidadDetalleAgrupado
                  .listaOrigenesAgrupado
              ) {
                let listaOrigenesAgrupado =
                  response.body.origenDatoCalidadDetalleAgrupado
                    .listaOrigenesAgrupado;
                element.footer = Object.assign(
                  element.footer,
                  listaOrigenesAgrupado
                );
              }

              element.grid.data = cloneData(
                response.body.origenDatoCalidadDetalleIndividual
              );
              element.grid.loading = false;
            }
          });
        },
        error: (error) => {},
        complete: () => {},
      });
  }

  Fun_ObtenerOrigenSector() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.ObtenerOrigenSector)
      .subscribe({
        next: (response: HttpResponse<ObtenerOrigenSector[]>) => {
          this.ListaObtenerOrigenSector = response.body;
        },
        error: (error) => {
          // this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  /* #endregion */

  /* #region  Tab 2 funciones */
  Fun_ObtenerBloquePorProgramaCritico() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.ObtenerBloquePorProgramaCritico)
      .subscribe({
        next: (response: HttpResponse<listaBloquePorProgramaCritico[]>) => {
          this.ListaBloquePorProgramaCritico = response.body;
        },
        error: (error) => {
          // this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  Fun_ObtenerBloquePorProgramaOtrasAreas() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.ObtenerBloquePorProgramaCritico)
      .subscribe({
        next: (response: HttpResponse<listaBloquePorProgramaCritico[]>) => {
          this.ListaBloquePorProgramaCritico = response.body;
        },
        error: (error) => {
        },
        complete: () => {},
      });
  }

  OnChangeColumn(event: any, dataItem: any) {
  }
  OnChangeColumnBusqueda(event: any, dataItem: any, indexGrid: any) {
    this.ValidarSumatoriasAsesorPorPais2(indexGrid);
  }
  CalcularErrores(indexGrid: any) {
    if (this.ListaBloquePorProgramaCritico[indexGrid].Errores == undefined) {
      this.ListaBloquePorProgramaCritico[indexGrid].Errores = [];
      this.ListaBloquePorProgramaCritico[indexGrid].Errores.push(
        'Primer Ingreso'
      );
    } else {
      this.ListaBloquePorProgramaCritico[indexGrid].Errores.push(
        'El porcentaje de asignacion regular para el asesor X está excediendo el 100%'
      );
    }
  }
  GuardarCambiosAsignacionRegular(indexGrid: any) {
    if (this.ListaBloquePorProgramaCritico[indexGrid].Errores.length == 0) {
      let estadoActualizacion: number = 0;
      this.ListaBloquePorProgramaCritico[indexGrid].grid.loading = true;
      this.integraService
        .insertar(
          constApiMarketing.ActualizarAsignacionRegular,
          this.ListaBloquePorProgramaCritico[indexGrid].grid.data
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            estadoActualizacion = response.body;
            if (estadoActualizacion == 1) {
              this.mostrarMensajeExitoso(
                'Configuracion Asignacion regular Actualizada correctamente'
              );
              this.ListaBloquePorProgramaCritico[indexGrid].grid.loading =
                false;
            }
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {},
        });
    } else {
      let estadoActualizacion = {} as errorPersonalizado;
      (estadoActualizacion.error = 'ERROR: Guardar cambios'),
        (estadoActualizacion.message =
          'Errores registrados en las configuraciones'),
        this.mostrarMensajeError(estadoActualizacion);
    }
  }

  GuardarCambiosAsignacionRegular2(indexGrid: any) {
    if (this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.length == 0) {
      let estadoActualizacion: number = 0;
      this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].grid.loading = true;
      this.integraService
        .insertar(
          constApiMarketing.ActualizarAsignacionRegular,
          this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].grid.data
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            estadoActualizacion = response.body;
            if (estadoActualizacion == 1) {
              this.mostrarMensajeExitoso(
                'Configuracion Asignacion regular Actualizada correctamente'
              );
              this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].grid.loading =
                false;
            }
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {},
        });
    } else {
      let estadoActualizacion = {} as errorPersonalizado;
      (estadoActualizacion.error = 'ERROR: Guardar cambios'),
        (estadoActualizacion.message =
          'Errores registrados en las configuraciones'),
        this.mostrarMensajeError(estadoActualizacion);
    }
  }




  ValidarSumatoriasAsesorPorPais(indexGrid: any) {
    let sum: any = 0;
    let switchError: any = 0;
    let switchError2: any = 0;
    for (const DatoEngrilla of this.ListaBloquePorProgramaCritico[indexGrid]
      .grid.data) {
      sum =
        DatoEngrilla.proporcionPorPaisPeru +
        DatoEngrilla.proporcionPorPaisColombia +
        DatoEngrilla.proporcionPorPaisMexico +
        DatoEngrilla.proporcionPorPaisBolivia +
        DatoEngrilla.proporcionPorPaisInternacional;
      if (sum > 100) {
        switchError = 1;
      }
    }
    if (switchError == 0) {
      if (
        this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf(
          'El porcentaje de asignacion por pais, está excediendo el 100 %'
        ) != -1
      ) {
        this.ListaBloquePorProgramaCritico[indexGrid].Errores.splice(
          this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf(
            'El porcentaje de asignacion por pais, está excediendo el 100 %'
          )
        );
      }
    }
    if (switchError == 1) {
      if (
        this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf(
          'El porcentaje de asignacion por pais, está excediendo el 100 %'
        ) != -1
      ) {
        this.ListaBloquePorProgramaCritico[indexGrid].Errores.splice(
          this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf(
            'El porcentaje de asignacion por pais, está excediendo el 100 %'
          )
        );
      }
      this.ListaBloquePorProgramaCritico[indexGrid].Errores.push(
        'El porcentaje de asignacion por pais, está excediendo el 100 %'
      );
    }
    for (const ProgramaGeneral of this.ListaBloquePorProgramaCritico[indexGrid]
      .ListaProgramasGenerales) {
      let SumatoriaPorProgramaGeneral = {} as SumaadorPorProgramaGeneral;
      SumatoriaPorProgramaGeneral.Codigo = ProgramaGeneral;
      SumatoriaPorProgramaGeneral.SumaProporcionPeru = 0;
      SumatoriaPorProgramaGeneral.SumaProporcionColombia = 0;
      SumatoriaPorProgramaGeneral.SumaProporcionMexico = 0;
      SumatoriaPorProgramaGeneral.SumaProporcionBolivia = 0;
      SumatoriaPorProgramaGeneral.SumaProporcionChile = 0;
      SumatoriaPorProgramaGeneral.SumaProporcionInternacional = 0;
      for (const Fila of this.ListaBloquePorProgramaCritico[indexGrid].grid
        .data) {
        if (Fila.codigo == SumatoriaPorProgramaGeneral.Codigo) {
          SumatoriaPorProgramaGeneral.SumaProporcionPeru =
            SumatoriaPorProgramaGeneral.SumaProporcionPeru +
            Fila.proporcionManualPeru;
          SumatoriaPorProgramaGeneral.SumaProporcionColombia =
            SumatoriaPorProgramaGeneral.SumaProporcionColombia +
            Fila.proporcionManualColombia;
          SumatoriaPorProgramaGeneral.SumaProporcionMexico =
            SumatoriaPorProgramaGeneral.SumaProporcionMexico +
            Fila.proporcionManualMexico;
          SumatoriaPorProgramaGeneral.SumaProporcionBolivia =
            SumatoriaPorProgramaGeneral.SumaProporcionBolivia +
            Fila.proporcionManualBolivia;
          SumatoriaPorProgramaGeneral.SumaProporcionChile =
            SumatoriaPorProgramaGeneral.SumaProporcionChile +
            Fila.proporcionManualChile;
          SumatoriaPorProgramaGeneral.SumaProporcionInternacional =
            SumatoriaPorProgramaGeneral.SumaProporcionInternacional +
            Fila.proporcionManualInternacional;
        }
      }
      if (SumatoriaPorProgramaGeneral.SumaProporcionPeru > 100) {
        switchError2 = 1;
      }
      if (SumatoriaPorProgramaGeneral.SumaProporcionColombia > 100) {
        switchError2 = 1;
      }
      if (SumatoriaPorProgramaGeneral.SumaProporcionMexico > 100) {
        switchError2 = 1;
      }
      if (SumatoriaPorProgramaGeneral.SumaProporcionBolivia > 100) {
        switchError2 = 1;
      }
      if (SumatoriaPorProgramaGeneral.SumaProporcionChile > 100) {
        switchError2 = 1;
      }
      if (SumatoriaPorProgramaGeneral.SumaProporcionInternacional > 100) {
        switchError2 = 1;
      }
    }
    if (switchError2 == 0) {
      if (
        this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf(
          'El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'
        ) != -1
      ) {
        this.ListaBloquePorProgramaCritico[indexGrid].Errores.splice(
          this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf(
            'El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'
          ),
          1
        );
      }
    }
    if (switchError2 == 1) {
      if (
        this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf(
          'El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'
        ) != -1
      ) {
        this.ListaBloquePorProgramaCritico[indexGrid].Errores.splice(
          this.ListaBloquePorProgramaCritico[indexGrid].Errores.indexOf(
            'El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'
          ),
          1
        );
      }
      this.ListaBloquePorProgramaCritico[indexGrid].Errores.push(
        'El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'
      );
    }
  }

  ValidarSumatoriasAsesorPorPais2(indexGrid: any) {
    let sum: any = 0;
    let switchError: any = 0;
    let switchError2: any = 0;
    for (const DatoEngrilla of this.ListaBloquePorProgramaCriticoBusqueda[indexGrid]
      .grid.data) {
      sum =
        DatoEngrilla.proporcionPorPaisPeru +
        DatoEngrilla.proporcionPorPaisColombia +
        DatoEngrilla.proporcionPorPaisMexico +
        DatoEngrilla.proporcionPorPaisBolivia +
        DatoEngrilla.proporcionPorPaisChile +
        DatoEngrilla.proporcionPorPaisInternacional;
      if (sum > 100) {
        switchError = 1;
      }
    }
    if (switchError == 0) {
      if (
        this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf(
          'El porcentaje de asignacion por pais, está excediendo el 100 %'
        ) != -1
      ) {
        this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.splice(
          this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf(
            'El porcentaje de asignacion por pais, está excediendo el 100 %'
          )
        );
      }
    }
    if (switchError == 1) {
      if (
        this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf(
          'El porcentaje de asignacion por pais, está excediendo el 100 %'
        ) != -1
      ) {
        this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.splice(
          this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf(
            'El porcentaje de asignacion por pais, está excediendo el 100 %'
          )
        );
      }
      this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.push(
        'El porcentaje de asignacion por pais, está excediendo el 100 %'
      );
    }
    for (const ProgramaGeneral of this.ListaBloquePorProgramaCriticoBusqueda[indexGrid]
      .ListaProgramasGenerales) {
      let SumatoriaPorProgramaGeneral = {} as SumaadorPorProgramaGeneral;
      SumatoriaPorProgramaGeneral.Codigo = ProgramaGeneral;
      SumatoriaPorProgramaGeneral.SumaProporcionPeru = 0;
      SumatoriaPorProgramaGeneral.SumaProporcionColombia = 0;
      SumatoriaPorProgramaGeneral.SumaProporcionMexico = 0;
      SumatoriaPorProgramaGeneral.SumaProporcionBolivia = 0;
      SumatoriaPorProgramaGeneral.SumaProporcionChile = 0;
      SumatoriaPorProgramaGeneral.SumaProporcionInternacional = 0;
      for (const Fila of this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].grid
        .data) {
        if (Fila.codigo == SumatoriaPorProgramaGeneral.Codigo) {
          SumatoriaPorProgramaGeneral.SumaProporcionPeru =
            SumatoriaPorProgramaGeneral.SumaProporcionPeru +
            Fila.proporcionManualPeru;
          SumatoriaPorProgramaGeneral.SumaProporcionColombia =
            SumatoriaPorProgramaGeneral.SumaProporcionColombia +
            Fila.proporcionManualColombia;
          SumatoriaPorProgramaGeneral.SumaProporcionMexico =
            SumatoriaPorProgramaGeneral.SumaProporcionMexico +
            Fila.proporcionManualMexico;
          SumatoriaPorProgramaGeneral.SumaProporcionBolivia =
            SumatoriaPorProgramaGeneral.SumaProporcionBolivia +
            Fila.proporcionManualBolivia;
          SumatoriaPorProgramaGeneral.SumaProporcionChile =
            SumatoriaPorProgramaGeneral.SumaProporcionChile +
            Fila.proporcionManualCChile;
          SumatoriaPorProgramaGeneral.SumaProporcionInternacional =
            SumatoriaPorProgramaGeneral.SumaProporcionInternacional +
            Fila.proporcionManualInternacional;
        }
      }
      if (SumatoriaPorProgramaGeneral.SumaProporcionPeru > 100) {
        switchError2 = 1;
      }
      if (SumatoriaPorProgramaGeneral.SumaProporcionColombia > 100) {
        switchError2 = 1;
      }
      if (SumatoriaPorProgramaGeneral.SumaProporcionMexico > 100) {
        switchError2 = 1;
      }
      if (SumatoriaPorProgramaGeneral.SumaProporcionBolivia > 100) {
        switchError2 = 1;
      }
      if (SumatoriaPorProgramaGeneral.SumaProporcionChile > 100) {
        switchError2 = 1;
      }
      if (SumatoriaPorProgramaGeneral.SumaProporcionInternacional > 100) {
        switchError2 = 1;
      }
    }
    if (switchError2 == 0) {
      if (
        this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf(
          'El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'
        ) != -1
      ) {
        this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.splice(
          this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf(
            'El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'
          ),
          1
        );
      }
    }
    if (switchError2 == 1) {
      if (
        this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf(
          'El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'
        ) != -1
      ) {
        this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.splice(
          this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.indexOf(
            'El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'
          ),
          1
        );
      }
      this.ListaBloquePorProgramaCriticoBusqueda[indexGrid].Errores.push(
        'El porcentaje de asignacion por Programa General y asesor, está excediendo el 100 %'
      );
    }
  }

  ObtenerListaProgramaGeneral2(indexGrid: any) {
    let ListaProgramasGenerales: string[] = [];
    for (const DatoEngrilla of this.ListaBloquePorProgramaCriticoBusqueda[indexGrid]
      .grid.data) {
      if (ListaProgramasGenerales.indexOf(DatoEngrilla.codigo) == -1) {
        ListaProgramasGenerales.push(DatoEngrilla.codigo);
      }
    }
    for (const ProgramaGeneral of ListaProgramasGenerales) {
      this.ListaBloquePorProgramaCriticoBusqueda[
        indexGrid
      ].ListaProgramasGenerales.push(ProgramaGeneral);
    }
  }

  mostrarMensajeEliminar(dataItem: any, index: number) {

  }



  MensajeConfirmacion() {
    return Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }
  public loadingPanelVisible = false;
  public buttonText = "Show Loading Panel";
  public onButtonClick(): void {
    this.loadingPanelVisible = !this.loadingPanelVisible;

    if (this.loadingPanelVisible) {
      this.buttonText = "Hide Loading Panel";
    } else {
      this.buttonText = "Show Loading Panel";
    }
  }

  ObtenerListaProgramaGeneral(indexGrid: any) {
    let ListaProgramasGenerales: string[] = [];
    for (const DatoEngrilla of this.ListaBloquePorProgramaCritico[indexGrid]
      .grid.data) {
      if (ListaProgramasGenerales.indexOf(DatoEngrilla.codigo) == -1) {
        ListaProgramasGenerales.push(DatoEngrilla.codigo);
      }
    }
    for (const ProgramaGeneral of ListaProgramasGenerales) {
      this.ListaBloquePorProgramaCritico[
        indexGrid
      ].ListaProgramasGenerales.push(ProgramaGeneral);
    }
  }

  public onExpandBloquePorCategoriaOrigen(item: any, indice: any): void {
    item.grid = new KendoGrid();
    item.grid.selectable = true;
    item.grid.resizable = true;
    item.grid.filterable = 'menu';
    item.grid.gridState = {
      skip: 0,
      take: 20,
    };
    item.grid.columns = this.gridAsignacionRegular.columns;
    item.grid.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.AsignacionRegularObtenerConfiguracionAsignacionRegular}/${item.idGrupoFiltroProgramaCritico}`
      )
      .subscribe({
        next: (resp: any) => {
          item.grid.data = resp.body.slice();
          item.dataOriginal = cloneData(resp.body);
          item.grid.loading = false;
          item.Errores = [];
          item.ListaProgramasGenerales = [];
          this.ObtenerListaProgramaGeneral(indice);
          this.ValidarSumatoriasAsesorPorPais(indice);
        },
      });
  }
  /* #endregion */



  Fun_ObtenerBloqueProgramasOtrasAreas() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.ObtenerBloquePorProgramaCritico)
      .subscribe({
        next: (response: HttpResponse<listaBloqueConfiguracionOtrosProgramasGenerales[]>) => {
          this.ListaBloqueProgramasOtrasAreas = response.body;
        },
        error: (error) => {
          // this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }


  Fun_ObtenerComboListaBusqueda() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.ObtenerComboBusqueda)
      .subscribe({
        next: (response: HttpResponse<ComboBusqueda>) => {
          this.ListaCombo = response.body;



        },
        error: (error) => {
          // this.mostrarMensajeError(error);
        },
        complete: () => {},
      });

      let LlistaBloqueConfiguracionOtrosProgramasGenerales = {} as listaBloqueConfiguracionOtrosProgramasGenerales;
      LlistaBloqueConfiguracionOtrosProgramasGenerales.nombre = 'Buscar';
      this.ListaBloqueProgramasOtrasAreasBusqueda.push(LlistaBloqueConfiguracionOtrosProgramasGenerales);

      let listaBloquePorProgramaCriticoBusqueda = {} as listaBloquePorProgramaCritico;
      listaBloquePorProgramaCriticoBusqueda.nombre = 'Buscar';
      this.ListaBloquePorProgramaCriticoBusqueda.push(listaBloquePorProgramaCriticoBusqueda);



  }

  Fun_ObtenerComboListaBusqueda2() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.ObtenerComboBusqueda)
      .subscribe({
        next: (response: HttpResponse<ComboBusqueda>) => {
          this.ListaCombo2 = response.body;



        },
        error: (error) => {
          // this.mostrarMensajeError(error);
        },
        complete: () => {},
      });


  }


  GuardarCambiosProgramasOtrasAreas(indexGrid: any) {

      let estadoActualizacion: number = 0;
      this.ListaBloqueProgramasOtrasAreas[indexGrid].grid.loading = true;
      this.integraService
        .insertar(
          constApiMarketing.ActualizarProgramasOtrasAreas,
          this.ListaBloqueProgramasOtrasAreas[indexGrid].grid.data
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            estadoActualizacion = response.body;
            if (estadoActualizacion == 1) {
              this.mostrarMensajeExitoso(
                'Configuracion Programas Otras Areas Actualizada correctamente'
              );
              this.ListaBloqueProgramasOtrasAreas[indexGrid].grid.loading =
                false;
            }
          },
          error: (error) => {
            this.mostrarMensajeError(error);
            this.ListaBloqueProgramasOtrasAreas[indexGrid].grid.loading =
            false;          },
          complete: () => {},
        });

  }

  GuardarCambiosProgramasOtrasAreas2(indexGrid: any) {

    let estadoActualizacion: number = 0;
    this.ListaBloqueProgramasOtrasAreasBusqueda[indexGrid].grid.loading = true;
    this.integraService
      .insertar(
        constApiMarketing.ActualizarProgramasOtrasAreas,
        this.ListaBloqueProgramasOtrasAreasBusqueda[indexGrid].grid.data
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          estadoActualizacion = response.body;
          if (estadoActualizacion == 1) {
            this.mostrarMensajeExitoso(
              'Configuracion Programas Otras Areas Actualizada correctamente'
            );
            this.ListaBloqueProgramasOtrasAreasBusqueda[indexGrid].grid.loading =
              false;
          }
        },
        error: (error) => {
          this.mostrarMensajeError(error);
          this.ListaBloqueProgramasOtrasAreasBusqueda[indexGrid].grid.loading =
          false;          },
        complete: () => {},
      });

}


public close(status: string): void {
  this.opened = false;
}

public open(): void {
  this.opened = true;
}
filterSettings: DropDownFilterSettings = {
  caseSensitive: false,
  operator: 'contains',
};

IniciarAsignacion() {
  this.EsAsignacion = true;
  this.close('No');
  this.integraService.obtener(
      constApiMarketing.AsignacionAutomatizadaAsesor
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        this .EstadoAsignacion = response.body;
        if (this.EstadoAsignacion == 1) {

          this.ObtenerBloqueAsesores();
          this.mostrarMensajeExitoso(
            'Se termino la asignacion'
          );
          this.EsAsignacion = false;
        }
        this.EsAsignacion = false;
      },
      error: (error) => {
        this.EsAsignacion = false;
        this.ObtenerBloqueAsesores();
        this.mostrarMensajeError(error);
      }
    });

}

BuscarCambiosProgramasOtrasAreas(item: any, indice: any){
  let obj = this.FormularioProgramasOtros.getRawValue();
  if (obj.comboProgramaGeneral == ""){
    obj.comboProgramaGeneral = 0;
  }
  if (obj.comboProgramaCritico== ""){
    obj.comboProgramaCritico = 0;
  }
  if (obj.comboAsesor== ""){
    obj.comboAsesor = 0;
  }
  if (obj.comboCoordinador == ""){
    obj.comboCoordinador = 0;
  }

    item.grid = new KendoGrid();
    item.grid.selectable = true;
    item.grid.resizable = true;
    item.grid.filterable = 'menu';
    item.grid.gridState = {
      skip: 0,
      take: 20,
    };
    item.grid.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.BuscarPorComboSeleccionadosProgramasOtrasAreas}/${obj.comboProgramaGeneral}/${obj.comboProgramaCritico}/${obj.comboAsesor}/${obj.comboCoordinador}`
      )
      .subscribe({
        next: (resp: any) => {
          item.grid.data = resp.body;
          item.dataOriginal = cloneData(resp.body);
          item.grid.loading = false;

        },
      });

}




BuscarCambiosAsignacionRegular(item: any, indice: any){
  let obj = this.FormularioAsignacionRegular.getRawValue();
  if (obj.comboProgramaGeneral == ""){
    obj.comboProgramaGeneral = 0;
  }
  if (obj.comboProgramaCritico== ""){
    obj.comboProgramaCritico = 0;
  }
  if (obj.comboAsesor== ""){
    obj.comboAsesor = 0;
  }
  if (obj.comboCoordinador == ""){
    obj.comboCoordinador = 0;
  }
    item.grid = new KendoGrid();
    item.grid.selectable = true;
    item.grid.resizable = true;
    item.grid.filterable = 'menu';
    item.grid.gridState = {
      skip: 0,
      take: 20,
    };
    item.grid.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.BuscarPorComboSeleccionadosProgramasCriticos}/${obj.comboProgramaGeneral}/${obj.comboProgramaCritico}/${obj.comboAsesor}/${obj.comboCoordinador}`
      )
      .subscribe({
        next: (resp: any) => {
          item.grid.data = resp.body.slice();
          item.dataOriginal = cloneData(resp.body);
          item.grid.loading = false;
          item.Errores = [];
          item.ListaProgramasGenerales = [];
          this.ObtenerListaProgramaGeneral2(indice);
          this.ValidarSumatoriasAsesorPorPais2(indice);

        },
      });

}




  OnChangeColumn2(indexGrid: any) {
  }


onExpandBloqueOtrosProgramas(item: any, indice: any): void {
    item.grid = new KendoGrid();
    item.grid.selectable = true;
    item.grid.resizable = true;
    item.grid.filterable = 'menu';
    item.grid.gridState = {
      skip: 0,
      take: 20,
    };
    item.grid.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerConfiguracionProgramasOtrasAreas}/${item.idGrupoFiltroProgramaCritico}`
      )
      .subscribe({
        next: (resp: any) => {
          item.grid.data = resp.body.slice();
          item.dataOriginal = cloneData(resp.body);
          item.grid.loading = false;

        },
      });
}

// Nuevo Modal para asihancio de datos
AbrirModalAsiganacionDatos(isNew: boolean, OrigenSector: ObtenerOrigenSector) {
  this.IdOrigenSector = OrigenSector.id;
  this.ObtenerCategoriaOrigenPorSector(OrigenSector);
  if (isNew) {
  } else {
    this.loaderModal = false;
  }
  this.modalRef = this.modalService.open(this.modalAsiganarDatos, {
    size: 'xl',
    backdrop: 'static'
  });
}

  // Modal y guardado de Asignacion Pais Asesor
  abrirModalModificarAsignacionPaisAsesor(id: number): void {
    this.selectedAsesorId = id;
    this.asignacionPaisAsesor = '';
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerAsignacionPaisAsesor}/${id}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.asignacionPaisAsesor = response.body.asignacionPais;
        },
        error: (error) => {
          this.loaderModal = false;
          this.alertaService.notificationError(error.error);
        },
        complete: () => {
          this.loaderModal = false;
          this.openedAsignacionPaisAsesor = true;
        },
      });
  }

  cerrarModalModificarAsignacionPaisAsesor(): void {
    this.openedAsignacionPaisAsesor = false;
    this.asignacionPaisAsesor = '';
    this.selectedAsesorId = null;
  }

  actualizarAsignacionPaisAsesor() {
    const jsonRequest = {
      idAsignacionRegular: this.selectedAsesorId,
      asignacionPais: this.asignacionPaisAsesor
    }

    this.loaderModal = true;
    this.integraService.postJsonResponse(
        constApiMarketing.ActualizarAsignacionPaisAsesor, jsonRequest
      )
      .subscribe({
        next: () => {
          this.alertaService.mensajeExitoso('Asignación de país actualizada correctamente');
        },
        error: (error) => {
          this.loaderModal = false;
          this.alertaService.notificationError('Ocurrio un problema al actualizar la asignación de pais');
        },
        complete: () => {
          this.loaderModal = false;
          this.cerrarModalModificarAsignacionPaisAsesor();
        },
      });
  }
}
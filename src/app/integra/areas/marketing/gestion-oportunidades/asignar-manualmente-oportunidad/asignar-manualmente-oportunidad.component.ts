import { KendoGrid } from '@shared/models/kendo-grid';
import {
  IAsiganacionManualData,
  IAsignacionManulaFiltro,
  IFiltroEnvioObtener,
  IFormFiltro,
} from './../../models/interfaces/asignar-manualmente-oportunidad';
import { AlertaService } from '@shared/services/alerta.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { CompositeFilterDescriptor, State } from '@progress/kendo-data-query';
import { PageChangeEvent } from '@progress/kendo-angular-grid';
import { BehaviorSubject } from 'rxjs';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
@Component({
  selector: 'app-asignar-manualmente-oportunidad',
  templateUrl: './asignar-manualmente-oportunidad.component.html',
  styleUrls: ['./asignar-manualmente-oportunidad.component.scss'],
  encapsulation: ViewEncapsulation.None,
})


export class AsignarManualmenteOportunidadComponent implements OnInit {
  @ViewChild(ExcelExportComponent, { static: false }) excelExport: ExcelExportComponent;

  public gridData: any[] = []; // Variable para almacenar todos los registros

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
  ) {}
  public model = {
    terms: false,
  };
   public isDisabled = true;
  //  exportarExcel(): void {
  //   this.excelExport.save();
  // }

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal


  loadingnModal: boolean = false;
  loaderModal: boolean = false;
  cambioFace: boolean = true;
  modalRef: NgbModalRef;
  loader = false;
  BtnBool = true;
  BtnAsignarFlag= false;
  envioWhats= false;
  pageSizes: any = [5, 10, 20, 100 , 'All'];

  formAsignarManualmente: FormGroup = this.formBuilder.group({
    asesores: [[]],
    centroCosto: [[]],
    tipoDato: [[]],
    programa: [[]],
    area: [[]],
    subArea: [[]],
    faseOportunidad: [[]],
    fechaInicio:new Date((new Date()).getFullYear(),(new Date()).getMonth(), 1),
    fechaFin:  new Date(),
    //categoriaDato: [[]],
    categoriaDato: [[]],
    filtroContacto: '',
    probabilidadActual: [[]],
    filtroUsuario: null,
    filtroEmail: '',
    grupo: [[]],
    pais: [[]],
    ventaCruzada: '',
    solicitudInformacion: [null],
    solicitudArea: [null],
    nroSolicitudInformacion: [null],
    nroSolicitudArea: [null],
    usuarioModificacion: '',
    fechaProgramacionInicio: [],
    fechaProgramacionFin: [],
  });

  formAsignarAsesor: FormGroup = this.formBuilder.group({
    // centroCosto: null,
    // asesor: null,
    // fechaProgramada: null,
    // asignarTab: false,
    // activo: true,
    // segunMejorPro:true,

    idAsesor: [],
    fechaProgramada: [new Date()],
    idCentroCosto: [],
    segunMejorPro: [],
    envioWhats: [],
    asignarTab: '',
  });

  filtros: IAsignacionManulaFiltro = {
    filtroAreaCapacitacion: [],
    filtroCategoriaOrigen: [],
    filtroCentroCosto: [],
    filtroFaseOportunidad: [],
    filtroOperadorComparacion: [],
    filtroOrigen: [],
    filtroPais: [],
    filtroPersonal: [],
    filtroProbabilidad: [],
    filtroSubAreaCapacitacion: [],
    filtroTipoCategoriaOrigen: [],
    filtroTipoDato: [],
    filtroPgeneral: [],
  };
  sourceFiltros: IAsignacionManulaFiltro;
  mySelection: number[];
  idFaseOportunidadCambio: any = null;

  gridAsignacionmanualOportinidad: KendoGrid = new KendoGrid();
  formCambioFace: FormGroup = this.formBuilder.group({
    asesores: [[]],
    centroCosto: [[]],
  });

  virtual: any = {
    itemHeight: 28,
  };

  dataCambioFase = [
    {
      id: 32,
      codigo: 'OD',
      urlApi: constApiMarketing.AsignarManualmenteCerrarOportunidadOD,
    },
    {
      id: 33,
      codigo: 'OM',
      urlApi: constApiMarketing.AsignarManualmenteCerrarOportunidadOM,
    },
    {
      id: 27,
      codigo: 'RN5',
      urlApi: constApiMarketing.AsignarManualmenteCerrarOportunidadRN5,
    },
    {
      id: 11,
      codigo: 'E',
      urlApi: constApiMarketing.AsignarManualmenteCerrarOportunidadE,
    },
    {
      id: 4,
      codigo: 'BIC',
      urlApi: constApiMarketing.AsignarManualmenteCerrarOportunidadBIC,
    },
    {
      id: 29,
      codigo: 'BRM1',
      urlApi: constApiMarketing.AsignarManualmenteCerrarOportunidadBRM1,
    },
    {
      id: 36,
      codigo: 'NS',
      urlApi: constApiMarketing.AsignarManualmenteCerrarOportunidadNS,
    },
  ];
  cambioFaseFiltro: any[] = this.dataCambioFase;
  dataVentaCruzada = [
    { clave: '1', valor: 'Si' },
    { clave: '0', valor: 'No' },
  ];

  ngOnInit(): void {
    this.obtenerFiltros();
    this.cargargrilla();
    this.obtenerRegistroasAsiganacionManual();

  }
  modalRefAsignarAsesor: any;
  modalRefCambioFace: any;
  abrirModalAsignarAsesor(context: any,dataItem?:any) {
    this.loadingnModal=true;

   //this.modalRefAsignarAsesor.close()
  //  reset es al formulario
   this.formAsignarAsesor.reset();

    this.modalRefAsignarAsesor = this.modalService.open(context, {
      backdrop: 'static',

    });

  }



  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      idAsesor: {

      },
      idCentroCosto: {},
      segunMejorPro: { required: 'Campo requerido' },
      nroSolicitudInformacion:{},


    };
    let formControl: FormControl = this.formAsignarAsesor.get(
      controlName
    ) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    return null;
  }

  get dataFormulario(): IFormFiltro {
    return this.formAsignarManualmente.getRawValue() as IFormFiltro;
  }

  filterChangeForm(value: string, nameCombo: string) {
    let sourceCombo = this.sourceFiltros as any;
    let filtros = this.filtros as any;
    if (value.length >= 1) {
      filtros[nameCombo] = sourceCombo[nameCombo].filter(
        (s: any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      filtros[nameCombo] = sourceCombo[nameCombo];
    }
  }


  filterChangeForm2(value: string, nameCombo: string) {
    let sourceCombo = this.sourceFiltros as any;
    let filtros = this.filtros as any;
    if (value.length >= 1) {
      filtros[nameCombo] = sourceCombo[nameCombo].filter(
        (s: any) => s.codigo.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      filtros[nameCombo] = sourceCombo[nameCombo];
    }
  }

  valueChangeArea(idAreas: number[]) {
    console.log(idAreas);
    if (idAreas.length > 0) {
      this.filtros.filtroSubAreaCapacitacion =
        this.sourceFiltros.filtroSubAreaCapacitacion.filter((e) =>
          idAreas.includes(e.idAreaCapacitacion)
        );
      let subArea = this.dataFormulario.subArea.filter((e) =>
        this.filtros.filtroSubAreaCapacitacion.map((x) => x.id).includes(e)
      );
      this.formAsignarManualmente.get('subArea').setValue(subArea);
    } else {
      this.filtros.filtroSubAreaCapacitacion = [];
      this.formAsignarManualmente.get('subArea').setValue([]);
    }
  }

  filterCambioFase(value: string) {
    if (value.length >= 1) {
      this.cambioFaseFiltro = this.dataCambioFase.filter(
        (s) => s.codigo.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.cambioFaseFiltro = this.dataCambioFase;
    }
  }

  obtenerFiltroEnvio(): IFiltroEnvioObtener {
    let dataForm: IFormFiltro = this.formAsignarManualmente.getRawValue() as IFormFiltro;
    let gridState = this.gridAsignacionmanualOportinidad.gridState as any;

    let page = (gridState.take + gridState.skip) / gridState.take;

    let filter: any = {
      skip: gridState.skip,
      take: gridState.take,
      sort: gridState.sort,
    };

    if (gridState.filter && gridState.filter.filters && gridState.filter.filters.length > 0) {
      let dataReporte: any[] = [];

      gridState.filter.filters.forEach((element: any) => {
        dataReporte.push({
          field: element.field,
          operator: element.operator,
          value: element.value,
        });
      });

      filter.Filter = {
        Filters: dataReporte,
        logic: 'and',
      };
    } else {
      filter.Filter = {
        Filters: [],
        logic: 'and',
      };
    }

    let filtro: IFiltroEnvioObtener = {
      paginador: {
        page: page,
        pageSize: gridState.take,
        skip: gridState.skip,
        take: gridState.take,
      },
      filtro: {
        centrosCosto: dataForm.centroCosto.length > 0 ? dataForm.centroCosto.join(',') : '',
        asesores: dataForm.asesores.length > 0 ? dataForm.asesores.join(',') : '',
        tiposDato: dataForm.tipoDato.length > 0 ? dataForm.tipoDato.join(',') : '',
        categorias: dataForm.categoriaDato.length > 0 ? dataForm.categoriaDato.join(',') : '',
        fasesOportunidad: dataForm.faseOportunidad.length > 0 ? dataForm.faseOportunidad.join(',') : '',
        programa: dataForm.programa.length > 0 ? dataForm.programa.join(',') : '',
        area: dataForm.area.length > 0 ? dataForm.area.join(',') : '',
        subArea: dataForm.subArea.length > 0 ? dataForm.subArea.join(',') : '',
        pais: dataForm.pais.length > 0 ? dataForm.pais.join(',') : '',
        tipoCategoriaOrigen: dataForm.grupo.length > 0 ? dataForm.grupo.join(',') : '',
        contacto: dataForm.filtroContacto,
        email: dataForm.filtroEmail,
        usuarioModificacion: dataForm.filtroUsuario ? dataForm.filtroUsuario.toString() : '',
        fechaInicio: dataForm.fechaInicio ? datePipeTransform(dataForm.fechaInicio, 'yyyy-MM-dd') : '',
        fechaFin: dataForm.fechaFin ? datePipeTransform(dataForm.fechaFin, 'yyyy-MM-dd') : '',
        fechaProgramacionInicio: dataForm.fechaProgramacionInicio
          ? datePipeTransform(dataForm.fechaProgramacionInicio, 'yyyy-MM-dd')
          : null,
        fechaProgramacionFin: dataForm.fechaProgramacionFin
          ? datePipeTransform(dataForm.fechaProgramacionFin, 'yyyy-MM-dd')
          : null,
        probabilidad: dataForm.probabilidadActual.length > 0 ? dataForm.probabilidadActual.join(',') : '',
        ventaCruzada: dataForm.ventaCruzada,
        nroOportunidades: dataForm.nroSolicitudInformacion,
        idOperadorComparacionNroOportunidades: dataForm.idOperadorComparacionNroOportunidades,
        nroSolicitud: dataForm.nroSolicitud,
        idOperadorComparacionNroSolicitud: dataForm.idOperadorComparacionNroSolicitud,
        nroSolicitudPorArea: dataForm.nroSolicitudArea,
        idOperadorComparacionNroSolicitudPorArea: dataForm.idOperadorComparacionNroSolicitudPorArea,
        nroSolicitudPorSubArea: dataForm.nroSolicitudPorSubArea,
        idOperadorComparacionNroSolicitudPorSubArea: dataForm.idOperadorComparacionNroSolicitudPorSubArea,
        nroSolicitudPorProgramaGeneral: dataForm.nroSolicitudPorProgramaGeneral,
        idOperadorComparacionNroSolicitudPorProgramaGeneral: dataForm.idOperadorComparacionNroSolicitudPorProgramaGeneral,
        nroSolicitudPorProgramaEspecifico: dataForm.nroSolicitudPorProgramaEspecifico,
        idOperadorComparacionNroSolicitudPorProgramaEspecifico: dataForm.idOperadorComparacionNroSolicitudPorProgramaEspecifico,
      },
      filter: filter,
    };

    console.log(filter);
    return filtro;
  }

  obtenerFiltros() {
    this.integraService
      .getJsonResponse(constApiMarketing.AsignacionManualObtenerFiltros)
      .subscribe({
        next: (resp: HttpResponse<IAsignacionManulaFiltro>) => {
          console.log(resp.body);
          this.sourceFiltros = resp.body;
          this.filtros = Object.assign({}, resp.body);

          this.filtros.filtroSubAreaCapacitacion = [];
          console.log(resp);
        },
      });
  }
  abrirModalCambioFace(context: any) {
    this.idFaseOportunidadCambio = null;
    this.modalRefCambioFace = this.modalService.open(context, {
      backdrop: 'static',
    });
  }

  cargargrilla() {

    /*this.gridAsignacionmanualOportinidad.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);

        // this.gridAsignacionmanualOportinidad.gridState = resp.gridState;
        // let filter: any = null;
        // if (resp.gridState.filter != null) {
        //   filter = resp.gridState.filter.filters[0];
        // }
        // let filtro = {
        //   paginador: {
        //     page:
        //       (resp.gridState.skip + resp.gridState.take) / resp.gridState.take,
        //     pageSize: this.gridAsignacionmanualOportinidad.gridState.take,
        //     skip: this.gridAsignacionmanualOportinidad.gridState.skip,
        //     take: this.gridAsignacionmanualOportinidad.gridState.take,
        //   },
        //   filter: filter,
        // };
       // console.log(filtro);
        this.obtenerRegistroasAsiganacionManual();
      },
    });*/
    this.gridAsignacionmanualOportinidad.filterable = 'menu';
    this.gridAsignacionmanualOportinidad.resizable = true;
    this.gridAsignacionmanualOportinidad.sortable = true;
    this.gridAsignacionmanualOportinidad.gridState = {
      skip: 0,
      take: 20,
      // sort: [
      //
      //     field: 'fechaModificacion',
      //     dir: 'desc',
      //   },
      // ],
    };
    this.gridAsignacionmanualOportinidad.pageable = {
      buttonCount: 10,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom'
    };
  }


  exportarExcel(): void {
    Swal.fire({
          icon: 'info',
          title: 'Se exporto correctamente!',
          text: 'El tiempo de descarga varía según la cantidad de datos y el ancho de red',
        })
    // Guardar el estado actual del grid para restaurarlo después
    const originalGridState = { ...this.gridAsignacionmanualOportinidad.gridState };

    // Limpiar filtros y paginación temporalmente
    this.gridAsignacionmanualOportinidad.gridState.filter = null;
    this.gridAsignacionmanualOportinidad.gridState.skip = 0;
    this.gridAsignacionmanualOportinidad.gridState.take = 999999; // Un valor alto para traer todo

    // Enviar la solicitud al backend sin filtros ni paginación
    this.integraService
      .postJsonResponse(
        `${constApiMarketing.AsignacionManualObtenerOportunidades}`,
        JSON.stringify(this.obtenerFiltroEnvio())
      )
      .subscribe({
        next: (response) => {
          // Asignar los datos recibidos a gridData para la exportación
          this.gridData = response.body.data;

          // Exportar a Excel
          setTimeout(() => this.excelExport.save(), 500);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          // Restaurar el estado original del grid
          this.gridAsignacionmanualOportinidad.gridState = originalGridState;
        },
      });
  }



  obtenerRegistroasAsiganacionManual() {
    console.log(this.gridAsignacionmanualOportinidad.gridState.filter)
this.gridAsignacionmanualOportinidad.loading=true;
    this.integraService
      .postJsonResponse(
        `${constApiMarketing.AsignacionManualObtenerOportunidades}`,
        JSON.stringify(this.obtenerFiltroEnvio())
      )
      .subscribe({
        next: (
          response: HttpResponse<{
            data: IAsiganacionManualData[];
            total: number;
          }>
        ) => {
          console.log(response.body)
          this.gridAsignacionmanualOportinidad.view = response.body;
          this.gridAsignacionmanualOportinidad.loading = false;
          console.log(this.gridAsignacionmanualOportinidad.gridState.filter)
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.gridAsignacionmanualOportinidad.loading=false;
        },
        complete: () => {},
      });
  }
  validFormREC(): any {
    if (this.formAsignarAsesor.invalid) {
      this.formAsignarAsesor.markAllAsTouched();
      return false;
    }
  }
  asignarAsesor(): any {
    this.loadingnModal=true;
    this.BtnAsignarFlag=true;
    if (this.formAsignarAsesor.valid) {
      let dataForm = this.formAsignarAsesor.getRawValue();
      console.log(dataForm);
      console.log('asignar');

      // if(this.formAsignarAsesor)
      // let dataAsignar = this.formAsignarAsesor.getRawValue()
      let jsonEnvio: any = {
        asignarAsesor: {
          IdOportunidades: this.mySelection,
          idasesor: dataForm.idAsesor,
          fechaProgramada: pipe.transform(
            dataForm.fechaProgramada,
            formatoFecha
          ),
          idcentroCosto: dataForm.idCentroCosto,
          segunMejorPro: dataForm.segunMejorPro,
          envioWhats: this.envioWhats
        },
        usuario: this.usuario.userName,
      };

      console.log(jsonEnvio)
      this.integraService
        .postJsonResponse(
          constApiMarketing.AsignarManualmenteAsesorAsignarAsesor,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
            this.loadingnModal = false;
            this.BtnAsignarFlag = false;
            this.integraService
              .postJsonResponse(
                constApiMarketing.AsignarManualmenteAsesorCambioActividadCabeceraAgenda,
                JSON.stringify({IdAsesor: dataForm.idAsesor})
              )
              .subscribe({
                next: (response: HttpResponse<any>) => {
                  console.log(response.body);
                }
              });

          },
          error: (error) => {
            console.log(error);
            this.loadingnModal = false;
            this.BtnAsignarFlag = false;
            this.alertaService.notificationError(error.message);
          },
          complete: () => {
            this.modalRefAsignarAsesor.close('submitted');
            this.alertaService.mensajeExitoso();
            this.obtenerRegistroasAsiganacionManual();
            this.formAsignarAsesor.reset();
            this.mySelection = [];
          },
        });
    } else this.formAsignarAsesor.markAllAsTouched(); // this
  }
  cerrarModal():any {
    this.modalRefAsignarAsesor.close('submitted');
    this.formAsignarAsesor.reset();
  }

  cambiarFase() {
    this.loadingnModal = true;
    console.log(this.mySelection);
    console.log(this.idFaseOportunidadCambio);


    this.integraService
      .postJsonResponse(
        this.idFaseOportunidadCambio.urlApi,
        JSON.stringify({
          idOportunidades: this.mySelection,
          usuario: this.usuario.userName,
        })
      )
      .subscribe({
        next: (resp: any) => {
          console.log(resp.body);
          this.loadingnModal = false;
        },

        error: (error) => {
          console.log(error);
          this.loadingnModal = false;
          this.alertaService.notificationError(error.message);
        },
        complete: () => {
          this.modalRefCambioFace.close('submitted');
          this.alertaService.mensajeExitoso();
          //this.cargargrilla()
          this.obtenerRegistroasAsiganacionManual();
          this.formAsignarAsesor.reset();
          this.mySelection=[];
        },
      });
  }

  limpiarSeleccion(filter: CompositeFilterDescriptor) {
    this.mySelection = [];
    this.ControlarBotones();
  }
  ControlarBotones() {
    if (this.mySelection.length > 0) {
      this.BtnBool = false;
    } else this.BtnBool = true;
  }

  fechaTemplate(fecha:any)// obtiene la fecha formateada para el mostrado en la grilla
  {
    if(typeof fecha=="string")
    {
      return datePipeTransform(new Date(fecha),'yyy-MM-dd', 'en-US')
    }
    else if(fecha!=null || fecha!=undefined)
    {
      return datePipeTransform(fecha,'yyy-MM-dd', 'en-US')
    }
    else return fecha
 }
 fechaTemplateHora(fecha:any)// obtiene la fecha formateada para el mostrado en la grilla
 {
   if(typeof fecha=="string")
   {
     return datePipeTransform(new Date(fecha),'yyy-MM-dd hh:mm:ss', 'en-US')
   }
   else if(fecha!=null || fecha!=undefined)
   {
     return datePipeTransform(fecha,'yyy-MM-dd hh:mm:ss', 'en-US')
   }
   else return fecha
}

  public filter: CompositeFilterDescriptor = {
    logic: "and",
    filters: [],
  };

  public filterChange(filter: CompositeFilterDescriptor): void {
    console.log(filter)
    this.filter = filter;
    this.obtenerRegistroasAsiganacionManual();
  }
  onStateChange(event:any)
  {
    this.gridAsignacionmanualOportinidad.gridState = event;
    this.obtenerRegistroasAsiganacionManual();
  }



}

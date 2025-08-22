import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { AsignacionChatService } from '@integra/areas/marketing/services/asignacion-chat.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Parametro } from '@shared/models/parametro';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-content-tab-asignacion-chat',
  templateUrl: './content-tab-asignacion-chat.component.html',
  styleUrls: ['./content-tab-asignacion-chat.component.scss']
})
export class ContentTabAsignacionChatComponent implements OnInit,OnChanges {

  @Input() asignacionChatService: AsignacionChatService;
  @ViewChild('modalAsignacionChat') modalAsignacionChat: any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal
  ) { }
  @Input() tab:any;
  @Input() activo=false;
  @Input() filtrosGenerales:any;
  areasCapacitacion: any[] = [];
  programasGenerales: any[] = [];
  subAreasCapacitacion: any[] = [];
  subAreasCapacitacionPorArea: any[] = [];
  programasPorSubArea: any[] = [];

  areasCapacitacionFiltro: any[] = [];
  subAreasCapacitacionFiltro: any[] = [];
  programasFiltro: any[] = [];
  modalRefAsesorChat: any;
  ListaErrores:any;
  ErrorTemp :any
  gridFormularioListaAsesores: KendoGrid = new KendoGrid();
  gridFormularioListaChats: KendoGrid = new KendoGrid();
  isNew: boolean = false;
  loaderModal: boolean = false;
  formFormularioAsesorChat: FormGroup = this.formBuilder.group({
    id: [0],
    idPersonal: ['', [Validators.required]],
    nombreAsesor:[''],
    area: [[], [Validators.required]],
    subArea: [[], [Validators.required]],
    programas: [[], [Validators.required]],
    paises: [[], [Validators.required]],
  });

  listaChats:any = []
  listaAsesores:any=[]
  pageSizes: any = [5, 10, 20, 'All'];
  ngOnInit(): void {
    this.ObtenerTodoChats();
    this. ObtenerTodoListaAsesores();
    this.cargarGrillaListaAsesores();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // if(this.activo==true){
    //   let TabActual = this.tab.indexTab;
    //   if(TabActual==0){
    //     this.cargarGrillaListaAsesores();
    //     this.obtenerListaAsesores();
    //   }
    //   else if(TabActual==1){
    //     this.cargarGrillaListaChats();
    //     this.obtenerListaChats();

    //   }
    // }
  }
  cargarGrillaListaAsesores(){
    this.gridFormularioListaAsesores.getRemoveEvent$().subscribe({
      next: (resp: any) => {
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminarAsesorChat(resp.dataItem, resp.index);
          }
        });
      },
    });
    this.gridFormularioListaAsesores.getDataStateChance$().subscribe({
      next: (resp: any) => {
        this.gridFormularioListaAsesores.gridState = resp.gridState;
        let filter: any = null;
        if (resp.gridState.filter != null) {
          filter = resp.gridState.filter.filters[0];
        }
        let filtro = {
          paginador: {
            page:
              (resp.gridState.skip + resp.gridState.take) / resp.gridState.take,
            pageSize: this.gridFormularioListaAsesores.gridState.take,
            skip: this.gridFormularioListaAsesores.gridState.skip,
            take: this.gridFormularioListaAsesores.gridState.take,
          },
          filter: filter,
        };
        this.ObtenerTodoListaAsesores();
      },
    });
    this.gridFormularioListaAsesores.filterable = 'menu';
    this.gridFormularioListaAsesores.resizable = true;
    this.gridFormularioListaAsesores.sortable = true;
    this.gridFormularioListaAsesores.gridState = {
      skip: 0,
      take: 5,
      sort: [
        {
          field: 'fechaModificacion',
          dir: 'desc',
        },
      ],
    };
    this.gridFormularioListaAsesores.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridFormularioListaAsesores.columns = [

      {
        title: 'Id',
        field: 'idPersonal',
        width: 70,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Asesor',
        field: 'nombreAsesor',
        width: 120,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Area',
        field: 'listaArea',
        width: 160,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'SubArea',
        field: 'listaSubArea',
        width: 180,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Programa General',
        field: 'listaProgramaGeneral',
        width: 230,
        filterable: true,
        headerClass: 'header-grid-integra innerHTML',
      },
      {
        title: 'País',
        field: 'listaPais',
        width: 150,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
    ];
  }
  // obtenerListaAsesores(filtroGrid?: any){
  //   this.gridFormularioListaAsesores.loading = true;
  //   let filtro: any;
  //   if (filtroGrid != null) {
  //     filtro = filtroGrid;
  //   } else {
  //     filtro = {
  //       paginador: {
  //         page: 1,
  //         pageSize: this.gridFormularioListaAsesores.gridState.take,
  //         skip: this.gridFormularioListaAsesores.gridState.skip,
  //         take: this.gridFormularioListaAsesores.gridState.take,
  //       },
  //     };
  //   }
  //   this.integraService
  //     .postJsonResponse(
  //       `${constApiMarketing.AsignacionChatObtenerChatListaAsesores}`,
  //       JSON.stringify(filtro)
  //     )
  //     .subscribe({
  //       next: (
  //         response: HttpResponse<{ data: any[]; total: number }>
  //       ) => {
  //         this.gridFormularioListaAsesores.view = response.body;

  //         this.gridFormularioListaAsesores.loading = false;
  //       },
  //       error: (error) => {
  //         this.alertaService.mensajeError(error);
  //       },
  //       complete: () => {},
  //     });
  // }
  // cargarGrillaListaChats(){
  //   this.gridFormularioListaChats.getDataStateChance$().subscribe({
  //     next: (resp: any) => {
  //       this.gridFormularioListaChats.gridState = resp.gridState;
  //       let filter: any = null;
  //       if (resp.gridState.filter != null) {
  //         filter = resp.gridState.filter.filters[0];
  //       }
  //       let filtro = {
  //         paginador: {
  //           page:
  //             (resp.gridState.skip + resp.gridState.take) / resp.gridState.take,
  //           pageSize: this.gridFormularioListaChats.gridState.take,
  //           skip: this.gridFormularioListaChats.gridState.skip,
  //           take: this.gridFormularioListaChats.gridState.take,
  //         },
  //         filter: filter,
  //       };
  //       console.log(filtro);
  //       this.obtenerListaChats(filtro);
  //     },
  //   });
  //   this.gridFormularioListaChats.filterable = 'menu';
  //   this.gridFormularioListaChats.resizable = true;
  //   this.gridFormularioListaChats.sortable = true;
  //   this.gridFormularioListaChats.gridState = {
  //     skip: 0,
  //     take: 15,
  //     sort: [
  //       {
  //         field: 'fechaModificacion',
  //         dir: 'desc',
  //       },
  //     ],
  //   };
  //   this.gridFormularioListaChats.pageable = {
  //     buttonCount: 5,
  //     info: true,
  //     type: 'numeric',
  //     pageSizes: true,
  //     previousNext: true,
  //     position: 'bottom',
  //   };
  //   this.gridFormularioListaChats.columns = [
  //     {
  //       title: 'Area',
  //       field: 'nombreArea',
  //       width: 190,
  //       filterable: true,
  //       headerClass: 'header-grid-integra',
  //     },
  //     {
  //       title: 'SubArea',
  //       field: 'nombreSubArea',
  //       width: 190,
  //       filterable: true,
  //       headerClass: 'header-grid-integra',
  //     },
  //     {
  //       title: 'Programa General',
  //       field: 'nombrePGeneral',
  //       width: 200,
  //       filterable: true,
  //       headerClass: 'header-grid-integra',
  //     },
  //     {
  //       title: 'País',
  //       field: 'nombrePais',
  //       width: 110,
  //       filterable: true,
  //       headerClass: 'header-grid-integra',
  //     },
  //     {
  //       title: 'Asignado',
  //       field: 'esAsignado',
  //       width: 130,
  //       filterable:true,
  //       headerClass: 'header-grid-integra',
  //     },
  //     {
  //       title: 'Asesor',
  //       field: 'nombrePersonal',
  //       width: 200,
  //       filterable: true,
  //       headerClass: 'header-grid-integra',
  //     },
  //   ];
  // }

  ObtenerTodoChats(){
    

    this.integraService
    .obtener(constApiMarketing.AsignacionChatObtenerTodosChats)
    .subscribe({
      next: (
        response: HttpResponse<{ data: any[]; total: number }>
      ) => {
        console.log(response.body)
        this.listaChats = response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  ObtenerTodoListaAsesores(){
    this.gridFormularioListaAsesores.loading = true;
    this.integraService
    .obtener(constApiMarketing.AsignacionChatObtenerTodosListaAsesores)
    .subscribe({
      next: (
        response: HttpResponse<any>
      ) => {
        console.log(response.body.asesorChat)
        this.gridFormularioListaAsesores.data = response.body.asesorChat.registros;
        //this.gridFormularioListaAsesores.view.total = response.body.asesorChat.total;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
        this.gridFormularioListaAsesores.loading = false;
      },
      complete: () => {
        this.gridFormularioListaAsesores.loading = false;
      },
    });
  }


  obtenerListaChats(filtroGrid?: any){
    this.gridFormularioListaChats.loading = true;
    let filtro: any;
    if (filtroGrid != null) {
      filtro = filtroGrid;
    } else {
      filtro = {
        paginador: {
          page: 1,
          pageSize: this.gridFormularioListaChats.gridState.take,
          skip: this.gridFormularioListaChats.gridState.skip,
          take: this.gridFormularioListaChats.gridState.take,
        },
      };
    }
    this.integraService
      .postJsonResponse(
        `${constApiMarketing.AsignacionChatObtenerChatAsignadosNoAsignados}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (
          response: HttpResponse<{ data: any[]; total: number }>
        ) => {
          this.gridFormularioListaChats.view = response.body;

          this.gridFormularioListaChats.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      idPersonal: {required: 'Asesor es Obligatorio'},
      area: { required: 'Area es Obligatorio' },
      subArea: { required: 'SubArea es Obligatorio'},
      programas: { required: 'Programa General es Obligatorio'},
      paises: { required: 'Texto Boton es Obligatorio'},
    };
    let formControl: FormControl = this.formFormularioAsesorChat.get(
      controlName
    ) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }

    return null;
  }
  crearAsesorChat(){
    this.gridFormularioListaAsesores.loading = true;
    if (this.validFormAsesorChat()){
      this.filtrosGenerales.listaAsesores.forEach((x:any) => {
        if(this.formFormularioAsesorChat.get('idPersonal').value==x.id){
          this.formFormularioAsesorChat.get('nombreAsesor').setValue(x.nombreCompleto);
        }      });
      this.formFormularioAsesorChat.get('id').setValue(0)
      let jsonEnvio = this.formFormularioAsesorChat.value
      this.integraService
      .insertar(
        constApiMarketing.AsignacionChatInsertarDetalles,jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.ObtenerTodoListaAsesores();
          this.gridFormularioListaAsesores.loadView();
          // this.listaFormularioSolicitud.unshift(formularioSolicitud);
          this.loaderModal = false;
        },
        error: (error) => {
          this.loaderModal = false;
          this.alertaService.mensajeError(error);
          this.gridFormularioListaAsesores.loading = false;;
        },
        complete: () => {
          this.modalRefAsesorChat.close('submitted');
          this.alertaService.mensajeExitoso();
          this.ObtenerTodoListaAsesores();
          this.gridFormularioListaAsesores.loading = false;
        },
    });
    }
    else this.formFormularioAsesorChat.markAllAsTouched();
  }
  actualizarAsesorChat(){
    
    if (this.validFormAsesorChat()){
      this.gridFormularioListaAsesores.loading = true;
      this.filtrosGenerales.listaAsesores.forEach((x:any) => {
        if(this.formFormularioAsesorChat.get('idPersonal').value==x.id){
          this.formFormularioAsesorChat.get('nombreAsesor').setValue(x.nombreCompleto);
        }
      });
      let jsonEnvio = this.formFormularioAsesorChat.value
      this.integraService
      .insertar(
        constApiMarketing.AsignacionChatActualizarDetalles,jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {

          this.ObtenerTodoListaAsesores();
          this.gridFormularioListaAsesores.loadView();
          // this.listaFormularioSolicitud.unshift(formularioSolicitud);
          this.loaderModal = false;
        },
        error: (error) => {
          this.loaderModal = false;
          this.alertaService.mensajeError(error);
          this.gridFormularioListaAsesores.loading = false;
        },
        complete: () => {
          this.modalRefAsesorChat.close('submitted');
          this.alertaService.mensajeExitoso();
          this.ObtenerTodoListaAsesores();
          this.gridFormularioListaAsesores.loading = false;
        },
    });
    }
    else this.formFormularioAsesorChat.markAllAsTouched();

  }
  /**
   * Funcion que permitira  Eleminar datos de grilla.
   */
   eliminarAsesorChat(dataItem: any, index: number) {
    //this.loaderGrid = true;
    this.gridFormularioListaAsesores.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'nombreUsuario', valor: '' },
    ];
    this.integraService
      .eliminarPorPathParams(
        constApiMarketing.AsignacionChatEliminarDetalles,
        params
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          //this.loaderGrid = false;
          if (response.body == true) {
            // this.listaFormulario.splice(index, 1);
            this.gridFormularioListaAsesores.data.splice(index, 1);
            this.gridFormularioListaAsesores.loading = false;
            this.ObtenerTodoListaAsesores();
            //this.gridFormularioSolicitud.loadView()
            // this. .splice(index, 1);

            Swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
          }
        },
        error: (error) => {
          // this.mostrarMensajeError(error);
        },
        complete: () => {
          this.ObtenerTodoListaAsesores()
        },
      });
  }
  /**
   * Funcion que permitira  Abrir modal  dende se mostraran los imputs.
   */
  abrirModal(isNew?: boolean, dataItem?: any)
  {
    this.areasCapacitacion = this.filtrosGenerales.listaAreas;
    this.areasCapacitacionFiltro = this.filtrosGenerales.listaAreas;
    this.subAreasCapacitacion = this.filtrosGenerales.listaSubAreas;
    this.programasGenerales = this.filtrosGenerales.listaProgramas;

    this.ListaErrores=undefined;
    this.formFormularioAsesorChat.reset();
    this.isNew = isNew;
    if (!isNew){
      this.integraService
        .getJsonResponse(
          `${constApiMarketing.AsignacionChatObtenerDetalleChatAsesor}/${dataItem.id}`
        )
        .subscribe({
          next: (response: any) => {
          let idsAreas: number[] = [];
          response.body.listadoIdsAreaCapacitacion.forEach((element: any) => {
            idsAreas.push(element.id);
          });
          let idsSubAreas: number[] = [];
          response.body.listadoIdsSubAreaCapacitacion.forEach((element: any) => {
            idsSubAreas.push(element.id);
          });
          let idsProgramas: number[] = [];
          response.body.listadoIdsProgramaGeneral.forEach((element: any) => {
            idsProgramas.push(element.id);
          });
          let idsPaises: number[] = [];
          response.body.listadoIdsPais.forEach((element: any) => {
            idsPaises.push(element.id);
          });
          this.formFormularioAsesorChat.get('idPersonal').setValue(dataItem.idPersonal);
          this.formFormularioAsesorChat.get('area').setValue(idsAreas);
          this.formFormularioAsesorChat.get('subArea').setValue(idsSubAreas);
          this.formFormularioAsesorChat.get('programas').setValue(idsProgramas);
          this.formFormularioAsesorChat.get('paises').setValue(idsPaises);
          //Campo SubArea
          this.subAreasCapacitacionFiltro = [];
          this.subAreasCapacitacionFiltro = this.filtrosGenerales.listaSubAreas.filter(
          (e: any) => idsAreas.includes(e.idAreaCapacitacion)
          );
          this.subAreasCapacitacionPorArea = this.subAreasCapacitacionFiltro;
          //Campo Programas
          this.programasFiltro = [];
          this.programasFiltro = this.filtrosGenerales.listaProgramas.filter(
          (e: any) => idsSubAreas.includes(e.idSubAreaCapacitacion)
          );
          this.programasPorSubArea = this.programasFiltro;
          console.log(this.programasFiltro)
          },
        });
      this.ErrorTemp = dataItem;
      this.ListaErrores = dataItem.errores
      this.formFormularioAsesorChat.patchValue(this.ErrorTemp);
    }
    else{

    }
    this.modalRefAsesorChat = this.modalService.open(
      this.modalAsignacionChat, { size: 'xl', backdrop: 'static'}
    );
  }
  filterAreas(value: any) {
    if (value.length >= 1) {
      this.areasCapacitacionFiltro = this.areasCapacitacion.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.areasCapacitacionFiltro = this.areasCapacitacion;
    }
  }
  changeArea(event: any) {
    if (event.length >= 0) {
      this.subAreasCapacitacionFiltro = [];
      this.subAreasCapacitacionFiltro = this.filtrosGenerales.listaSubAreas.filter(
        (e: any) => event.includes(e.idAreaCapacitacion)
      );
      this.subAreasCapacitacionPorArea = this.subAreasCapacitacionFiltro;
    } else {
      this.subAreasCapacitacionPorArea = [];
      this.subAreasCapacitacionFiltro = [];
    }
  }
  removeArea(event: any) {
    let idArea = event.dataItem.id;
    let lista = this.formFormularioAsesorChat.get('subArea').value;
    let dataFinal: number[] = [];
      lista.forEach((x:any) => {
        this.filtrosGenerales.listaSubAreas.forEach((element:any) => {
        if(x==element.id && element.idAreaCapacitacion !=idArea){
          dataFinal.push(x)
        }
        else if (x==element.id && element.idAreaCapacitacion ==idArea){
          let idSubArea = x;
          let lista = this.formFormularioAsesorChat.get('programas').value;
          let dataFinal: number[] = [];
          lista.forEach((x:any) => {
          this.filtrosGenerales.listaProgramas.forEach((element:any) => {
          if(x==element.id && element.idSubAreaCapacitacion !=idSubArea){
          dataFinal.push(x)
        }
      });
      });
    this.formFormularioAsesorChat.get('programas').setValue(dataFinal);
        }
      });
      });
    this.formFormularioAsesorChat.get('subArea').setValue(dataFinal);
  }

  filtroSubArea(value: any) {
    if (value.length >= 1) {
      this.subAreasCapacitacionFiltro = this.subAreasCapacitacion.filter(
        (s:any) =>{
          s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1}
      );
    } else {
      this.subAreasCapacitacionFiltro = this.subAreasCapacitacionPorArea;
    }
  }
  changeSubArea(event: any) {
    if (event.length >= 0) {
      this.programasFiltro = [];
      this.programasFiltro = this.filtrosGenerales.listaProgramas.filter(
        (e: any) => event.includes(e.idSubAreaCapacitacion)
      );
      this.programasPorSubArea = this.programasFiltro;
    } else {
      this.programasPorSubArea = [];
      this.programasFiltro = [];
    }
  }
  removeSubArea(event: any) {
    let idSubArea = event.dataItem.id;
    let lista = this.formFormularioAsesorChat.get('programas').value;
    let dataFinal: number[] = [];
      lista.forEach((x:any) => {
        this.filtrosGenerales.listaProgramas.forEach((element:any) => {
        if(x==element.id && element.idSubAreaCapacitacion !=idSubArea){
          dataFinal.push(x)
        }
      });
      });
    this.formFormularioAsesorChat.get('programas').setValue(dataFinal);
  }
  filtroPrograma(value: any) {
    if (value.length >= 1) {
      this.programasFiltro = this.programasPorSubArea.filter(
        (s:any) =>{
          s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1}
      );
    } else {
      this.programasFiltro = this.programasPorSubArea;
    }
  }
  validFormAsesorChat(): boolean {
    if (this.formFormularioAsesorChat.invalid) {
      this.formFormularioAsesorChat.markAllAsTouched();
      return false;
    }
    return true;
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "contains",
  };
}



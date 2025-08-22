import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Articulo, ArticuloEnvio, ArticuloPGeneralEnvio, ArticuloValor, ParametroSeo, programasAsociados, programasNoAsociados } from '@integra/models/articulo';
import { ArticuloTagEnvio } from '@integra/models/articulo-tag';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { constApiMarketing } from '@environments/constApi';
import { Parametro } from '@shared/models/parametro';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TextValidator } from '@shared/validators/text.validator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { SubAreaCombo } from '@integra/models/sub-area';
import { tagCombo } from '@integra/models/tag';
import { GridProgramasNoAsociados } from './grid-programas-no-asociados';
import { GridProgramasAsociados } from './grid-programas-asociados';

const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-articulos-bs-campus',
  templateUrl: './articulos-bs-campus.component.html',
  styleUrls: ['./articulos-bs-campus.component.scss']
})
export class ArticulosBsCampusComponent implements OnInit {
  @ViewChild('modalArticulo') modalArticulo: any;
  @ViewChild('modalVerArticulo') modalVerArticulo: any;
  @ViewChild('modalAsociarTags') modalAsociarTags: any;
  @ViewChild('modalAsociarProgramas') modalAsociarProgramas: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
  ) { }
  gridCampoFormulario: KendoGrid = new KendoGrid();
  gridFormularioArticulo:KendoGrid = new KendoGrid();
  GridProgramasNoAsociados: KendoGrid = new KendoGrid();
  GridProgramaAsociados: KendoGrid = new KendoGrid();

  formArticulo: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', Validators.required],
    titulo: ['', Validators.required],
    imgPortada: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,
    ]],
    imgPortadaAlt: ['', Validators.required],
    imgSecundaria: ['', [
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,
    ]],
    imgSecundariaAlt: [''],
    urlWeb: ['', [
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,
    ]],
    urlDocumento: ['', [
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,
    ]],
    autor: ['', Validators.required],
    idTipoArticulo: ['', [Validators.required]],
    idArea: ['', [Validators.required]],
    idSubArea: ['', [Validators.required]],
    idExpositor: ['', [Validators.required]],
    idCategoria: ['', [Validators.required]],
    parametroSeo: [null],
    descripcionGeneral: [''],
    contenido: [''],
    usuario:'mmantilla',
  });
  filtrosArticulo: any = {
    filtroTipoArticulo: [],
    filtroArea: [],
    filtroSubArea:[],
    filtroExpositor: [],
    filtroCategoria: [],
    filtroParametroSeo: [],
  };
  formResumenTag: FormGroup = this.formBuilder.group({
    idTag: [null],
  });
  idsParametrosSeo: ArticuloValor={
    lista:[null],
  }
  ArticulosPGeneralEnvio: ArticuloPGeneralEnvio={
    idArticulo:0,
    idsAsociados:[],
    usuario:''
  }
  ArticulosTagEnvio: ArticuloTagEnvio={
    idArticulo:0,
    idsAsociados:[],
    usuario:''
  }
  idsCamposTag: number[] = [];
  successIcon: string = iconInputValidation;
  modalRefTArticulo: any;
  modalRefTTag: any;
  articuloTemp :any
  isNew: boolean = false;
  loaderGrid: boolean = false;  //GRID SPINNER
  loaderModal: boolean = false; //MODAL SPINNER
  listaArticulo: Articulo[] = [];
  ParametroSeo:ParametroSeo[]=[];
  gridProgramasNoAsociados = new GridProgramasNoAsociados();
  gridProgramasAsociados = new GridProgramasAsociados();
  itemsSubArea:SubAreaCombo[] = [];
  listaTag:any[] = [];
  listaTagsFiltrados: any[] = [];
  listaTagsPorArticulo:tagCombo[] = [];
  listaProgramasNoAsociadosSeleccionados:any;
  listaProgramasAsociadosSeleccionados:any;
  listaProgramasNoAsociados:programasNoAsociados[] = [];
  listaProgramasAsociados:programasAsociados[] = [];
  ArticuloSeleccionado=0;
  listaArticulos: any = [];

  ngOnInit(): void {

    this.obtenerArticulo();
    this.ObtenerTagCombo();
    this.integraService
      .obtenerTodo(constApiMarketing.ArticuloObtenerFiltros)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.filtrosArticulo = response.body;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.CargarGrilla();
        },
      });
  }
  CargarGrilla(){
    this.gridFormularioArticulo.getRemoveEvent$().subscribe({
      next: (resp: any) => {
        this.mostrarMensajeEliminar(resp);
      },
    });
    this.gridFormularioArticulo.getDataStateChance$().subscribe({
      next: (resp: any) => {

        console.log(this.gridFormularioArticulo.gridState)
        // this.gridFormularioArticulo.gridState = resp.gridState;
        // let filter: any = null;
        // if (resp.gridState.filter != null) {
        //   filter = resp.gridState.filter.filters[0];
        // }

        let gridState = this.gridFormularioArticulo.gridState;

        let filter: any = null;
            if (gridState.filter != null) {
              filter = gridState.filter.filters;
            }
        let filtro = {
          paginador: {
            page:
              (gridState.skip + gridState.take) / gridState.take,
            pageSize: this.gridFormularioArticulo.gridState.take,
            skip: this.gridFormularioArticulo.gridState.skip,
            take: this.gridFormularioArticulo.gridState.take,
          },
          filter: filter,
        };
        this.obtenerArticulo(filtro);
      },
    });
    this.gridFormularioArticulo.filterable = 'menu';
    this.gridFormularioArticulo.resizable = true;
    this.gridFormularioArticulo.sortable = true;
    this.gridFormularioArticulo.gridState = {
      skip: 0,
      take: 15,
      sort: [
        {
          field: 'fechaModificacion',
          dir: 'desc',
        },
      ],
    };
    this.gridFormularioArticulo.pageable = {
      buttonCount: 15,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridFormularioArticulo.columns =[
      {
        title: 'Nombre',
      field: 'nombre',
      width: 120,
      editable: false,
      locked: false,
      sticky: false,
      filterable: true,
      autoFitColumn: false,
      headerClass: 'justify-content-center k-grid-header',
      columnClass: 'text-wrap',
      },
      {
        title: 'Título',
        field: 'titulo',
        width: 100,
        editable: false,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-wrap',
      },
      {
        title: 'Imagen portada',
        field: 'imgPortada',
        width: 110,
        editable: false,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-wrap',
      },
      {
        title: 'Autor',
        field: 'autor',
        width: 80,
        editable: false,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-wrap',
      },
      {
        title: 'Tipo',
        field: 'idTipoArticulo',
        width: 70,
        editable: false,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-wrap',
      },
      {
        title: 'Area',
        field: 'idArea',
        width: 100,
        editable: false,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-wrap',
      },
      {
        title: 'Sub Area',
        field: 'idSubArea',
        width: 90,
        editable: false,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-wrap',
      },
      {
        title: 'Expositor',
        field: 'idExpositor',
        width: 100,
        editable: false,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-wrap',
      },
      {
        title: 'Categoria',
        field: 'idCategoria',
        width: 110,
        editable: false,
        locked: false,
        sticky: false,
        filterable: true,
        autoFitColumn: false,
        headerClass: 'justify-content-center k-grid-header',
        columnClass: 'text-wrap',
      },
    ];
    this.gridCampoFormulario.formGroup = this.formBuilder.group({
      idArticulo: '',
      nombre: '',
      descripcion: '',
    });
    this.gridCampoFormulario.getCellCloseEvent$().subscribe({
      next: (resp: any) => {
        this.gridCampoFormulario.assignValues(
          resp.dataItem,
          resp.formGroup.value
        );
      },
    });
  }

  obtenerArticulo(filtroGrid?: any) {
    console.log(filtroGrid)
    this.loaderGrid = true;
    let filtro: any;
    if (filtroGrid != null) {
      filtro = filtroGrid
    }
    else{
      filtro = {
        paginador: {
          page: 1,
          pageSize: this.gridFormularioArticulo.gridState.take,
          skip: this.gridFormularioArticulo.gridState.skip,
          take: this.gridFormularioArticulo.gridState.take,
        },
      };
    }
    console.log(filtro)
    this.integraService
      .postJsonResponse(
        `${constApiMarketing.ArticuloObtenerArticulo}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (
          response: HttpResponse<{ data: Articulo[]; total: number }>
        ) => {

          this.gridFormularioArticulo.view.data = response.body.data;

          this.gridFormularioArticulo.view.total=response.body.total
          console.log(response.body)
          console.log(this.gridFormularioArticulo)
          this.gridFormularioArticulo.loading = false;

        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }



  gridEventsArticulo(e: any): void {
    switch (e.action) {
      case 'edit':
        this.abrirModalArticulo(e.isNew, e.dataItem);
        break;
      case 'add':
        this.abrirModalArticulo(e.isNew, e);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(e);
        break;
      case 'ver':
        this.abrirModalVerDatos(e.dataItem);
        break;
      case 'reload':
        this.obtenerArticulo();
        break;
      case 'asociarProgramas':
        this.abrirModalAsociarProgramas(e.dataItem);
        break;
      case 'asociarTags':
        this.abrirModalTag(e.dataItem);
        break;
    }
  }
  abrirModalVerDatos(data:any){
    this.articuloTemp = data;
    this.modalService.open(
      this.modalVerArticulo,
      { backdrop: 'static', size: 'lg' });
  }
  setDataArticulo(item: Articulo, itemValue: ArticuloEnvio): Articulo{
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.titulo = itemValue.titulo;
      item.imgPortada = itemValue.imgPortada;
      item.imgPortadaAlt = itemValue.imgPortadaAlt;
      item.imgSecundaria = itemValue.imgSecundaria;
      item.imgSecundariaAlt = itemValue.imgSecundariaAlt;
      item.urlWeb = itemValue.urlWeb;
      item.urlDocumento = itemValue.urlDocumento;
      item.autor = itemValue.autor;
      item.estado = itemValue.estado;
      item.usuarioCreacion = itemValue.usuarioCreacion;
      item.usuarioModificacion = itemValue.usuarioModificacion;
      item.fechaCreacion = itemValue.fechaCreacion;
      item.fechaModificacion = itemValue.fechaModificacion;
      item.idTipoArticulo = itemValue.idTipoArticulo;
      item.idArea = itemValue.idArea;
      item.idSubArea = itemValue.idSubArea;
      item.idExpositor = itemValue.idExpositor;
      item.idCategoria = itemValue.idCategoria;
      item.descripcionGeneral = itemValue.descripcionGeneral;
      item.contenido = itemValue.contenido;
      item.parametroSeo = item.parametroSeo;
    }
    return item;
  }
  crearArticulo() {
    if (this.validFormArticulo()) {
      this.loaderModal = true;
      let datosFormulario = this.formArticulo.getRawValue();
      let Articulo: Articulo = Object.assign({}, datosFormulario);
      let campos: any[] = [];
      this.gridCampoFormulario.data.forEach((e: any) => {
        campos.push({
          id:e.id,
          nombre: e.nombre,
          descripcion: e.descripcion,
          numeroCaracteres:500,
          idArticulo:0,
        });
      });
      datosFormulario.parametroSeo=campos;
      datosFormulario.usuario='mmantilla';

      let jsonEnvio: any = {
        formulario: datosFormulario,
        parametroSeo: campos,
      };
      this.integraService
        .insertar(constApiMarketing.ArticuloInsertar, jsonEnvio)
        .subscribe({
          next: (response: HttpResponse<ArticuloEnvio>) => {
            Articulo = this.setDataArticulo(Articulo, response.body);
            this.gridFormularioArticulo.data.unshift(Articulo);
            this.loaderModal = false;
            this.obtenerArticulo();

          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefTArticulo.close('submitted');
            this.mostrarMensajeExitoso();
          },
        });
    this.formArticulo.reset();

    } else {
      this.formArticulo.markAllAsTouched();
    }
  }
  validFormArticulo(): boolean {
    if(this.formArticulo.invalid){
      this.formArticulo.markAllAsTouched();
      return false;
    }
    return true;
  }
  abrirModalArticulo(isNew: boolean, dataItem?: Articulo) {
    this.loaderModal = false;
    this.formArticulo.reset();
    this.ParametroSeo=[],
      this.gridCampoFormulario.data=[];
      this.gridCampoFormulario.dataItemEditTemp = [];
      this.idsParametrosSeo.lista=[]
      this.articuloTemp = [];

    this.isNew = isNew;
    if (!isNew){
    this.itemsSubArea=[];
      this.llenarComboSubArea(dataItem.idArea)
      this.gridCampoFormulario.dataItemEditTemp = dataItem;
      this.articuloTemp = dataItem;
      this.formArticulo.patchValue(this.articuloTemp);
      this.integraService
      .obtenerPorIdCodigo(constApiMarketing.ArticuloObtenerParametroSeoArticulo,dataItem.id)
      .subscribe({
        next: (response: HttpResponse<ParametroSeo[]>) => {
          this.gridCampoFormulario.data = response.body;
          response.body.forEach((element:any)=>{
            this.idsParametrosSeo.lista.push(element.id)
          })
        this.formArticulo.get('parametroSeo').setValue(this.idsParametrosSeo.lista)
        },
    });
    }
    else {
      this.ParametroSeo.forEach((element: any) => {
        this.idsParametrosSeo.lista.push(element.id);
        let campoNuevo: any = {
          id: 0,
          nombre: element.nombre,
          numeroCaracteres: 500,
          descripcion:'',
        };
        this.gridCampoFormulario.data.push(campoNuevo);
      });
    }
    this.modalRefTArticulo = this.modalService.open(
      this.modalArticulo,
      { backdrop: 'static', size: 'xl' }
      );
  }
  changeCampo(dataCampo: any) {
    if (dataCampo.length == 0) {
      this.gridCampoFormulario.data = [];
    }
    if (dataCampo.length > 0) {
      const camposOriginal =
      this.gridCampoFormulario.dataItemEditTemp?.parametroSeo != null
      ? this.gridCampoFormulario.dataItemEditTemp?.parametroSeo
      : [];
      for (let i = 0; i < this.gridCampoFormulario.data.length; i++) {
        const campo = this.gridCampoFormulario.data[i];
        let index = dataCampo.findIndex((e: any) => e == campo.id);
        if (index == -1) {
          this.gridCampoFormulario.data.splice(i, 1);
        }
      }

      dataCampo.forEach((element: any) => {
        let campo = this.filtrosArticulo.filtroParametroSeo.find(
          (e: any) => e.id == element
        );
        let dataItemGrid = this.gridCampoFormulario.data.findIndex(
          (e: any) => e.id == element
        );
        if (campo != -1 && dataItemGrid == -1) {
          let campoOriginal = camposOriginal.find(
            (e: any) => e.id == campo.id
          );
          let campoNuevo: any = {
            id: campo.id,
            idArticulo: campo.idArticulo,
            nombre: campo.nombre,
            descripcion: campo.descripcion,
            numeroCaracteres:500,
          };
          if (campoOriginal != -1) {
            campoNuevo = Object.assign(campoNuevo, campoOriginal);
          }
          this.gridCampoFormulario.data.push(campoNuevo);
        }
      });
    }
  }

  actualizarArticulo() {
    if (this.validFormArticulo()) {
      this.loaderModal = true;
      let datosFormulario = this.formArticulo.getRawValue();
      let Articulo: Articulo = Object.assign({}, datosFormulario);
      let campos: any[] = [];
      this.gridCampoFormulario.data.forEach((e: any) => {
        campos.push({
          id:e.id,
          nombre: e.nombre,
          descripcion: e.descripcion,
          numeroCaracteres:500,
          idArticulo:0,
        });
      });
      datosFormulario.parametroSeo=campos;
      datosFormulario.usuario='mmantilla';
      let jsonEnvio: any = {
        formulario: datosFormulario,
        parametroSeo: campos,
      };
      this.integraService
        .insertar(constApiMarketing.ArticuloActualizar, jsonEnvio)
        .subscribe({
          next: (response: HttpResponse<ArticuloEnvio>) => {
            Articulo = this.setDataArticulo(Articulo, response.body);
            this.gridFormularioArticulo.data.unshift(Articulo);
            this.loaderModal = false;
            this.obtenerArticulo()
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefTArticulo.close('submitted');
            this.mostrarMensajeExitoso();
          },
        });
    this.formArticulo.reset();
    } else {
      this.formArticulo.markAllAsTouched();
    }
  }
  getNombreTipoArticulo(id: number) {
    let filtro: any[] = [];
    filtro = this.filtrosArticulo.filtroTipoArticulo;
    let data = filtro.find((e: any) => e.id === id);
    return (data != null) ? data.nombre : '';
  }
  getNombreArea(id: number) {
    let filtro: any[] = [];
    filtro = this.filtrosArticulo.filtroArea;
    let data = filtro.find((e: any) => e.id === id);
    return (data != null) ? data.nombre : '';
  }
  getNombreSubArea(id: number) {
    let filtro: any[] = [];
    filtro = this.filtrosArticulo.filtroSubArea;
    let data = filtro.find((e: any) => e.id === id);
    return (data != null) ? data.nombre : '';
  }
  getNombreExpositor(id: number) {
    let filtro: any[] = [];
    filtro = this.filtrosArticulo.filtroExpositor;
    let data = filtro.find((e: any) => e.id === id);
    return (data != null) ? data.nombre : '';
  }
  getNombreCategoria(id: number) {
    let filtro: any[] = [];
    filtro = this.filtrosArticulo.filtroCategoria;
    let data = filtro.find((e: any) => e.id === id);
    return (data != null) ? data.nombre : '';
  }
  public selectionChangeArea(value: any): void {
    this.llenarComboSubArea(value.id)
  }
  llenarComboSubArea(idArea:number)
  {
    this.formArticulo.patchValue({idSubArea:null});
    this.itemsSubArea=[];
    this.itemsSubArea= this.filtrosArticulo.filtroSubArea.filter((item:any)=> item.idAreaCapacitacion===idArea)
  }
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formArticulo.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formArticulo.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese el nombre del artículo',
      },
      titulo: {
        required: 'Ingrese el título del artículo' ,
      },
      imgPortada: {
        required: 'Ingrese la imagen de portada',
        noStartSpace: 'La imagen de portada no puede empezar con espacio',
        noEndSpace: 'La imagen de portada no puede terminar con espacio',
      },
      imgPortadaAlt:{
        required: 'Ingrese la descripción de la imagen de portada',
      },
      imgSecundaria: {
        noStartSpace: 'La imagen secundaria no puede empezar con espacio',
        noEndSpace: 'La imagen secundaria no puede terminar con espacio',
      },
      urlWeb: {
        noStartSpace: 'La url de página no puede empezar con espacio',
        noEndSpace: 'La url de página no puede terminar con espacio',
      },
      urlDocumento: {
        noStartSpace: 'La url de video/documento no puede empezar con espacio',
        noEndSpace: 'La url de video/documento no puede terminar con espacio',
      },
      autor: {
        required: 'El autor es obligatorio' ,
      },
      idTipoArticulo: {
        required: 'El tipo de artículo es obligatorio' ,
      },
      idArea: {
        required: 'La área es obligatoria' ,
      },
      idSubArea: {
        required: 'La sub área es obligatoria' ,
      },
      idExpositor: {
        required: 'El expositor es obligatorio' ,
      },
      idCategoria: {
        required: 'La categoría es obligatoria' ,
      },
    };
    let formControl: FormControl = this.formArticulo.get(
      controlName
    ) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }
    if (formControl.hasError('min')) {
      return erroMsj[controlName].min;
    }
    return null;
  }
  mostrarMensajeExitoso(){
    this.loaderGrid = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute'
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    Toast.fire({
      icon: 'success',
      title: 'Guardado con exito'
    })
  }

  mostrarMensajeEliminar(param: any) {
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarArticulo(param.dataItem, param.index);
      }
    });
  }
  eliminarArticulo(dataItem: Articulo, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: 'mmantilla' },
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.ArticuloEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if ((response.body == true)) {
            this.listaArticulo.splice(index, 1);
            this.loaderGrid = false;
            this.obtenerArticulo();
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
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.obtenerArticulo()
        },
      });
  }



  abrirModalTag(dataItem?: Articulo) {
    this.ArticuloSeleccionado=0;
    this.loaderModal = false;
    this.formResumenTag.reset();
    this.ArticuloSeleccionado=dataItem.id;
    this.loaderGrid = true;
    this.integraService
      .obtenerPorIdCodigo(constApiMarketing.ArticuloObtenerTagsPorArticulo,dataItem.id)
      .subscribe({
        next: (response: HttpResponse<Articulo[]>) => {
          this.listaTagsPorArticulo = response.body;
          this.idsCamposTag=[]
          this.loaderGrid = false;
          this.listaTagsPorArticulo.forEach((element:any)=>{
            this.idsCamposTag.push(element.id)
          })
        this.formResumenTag.get('idTag').setValue(this.idsCamposTag)
        },
      });
      this.modalRefTTag = this.modalService.open(
      this.modalAsociarTags);

  }
  ObtenerTagCombo(){
    this.integraService
      .obtenerTodo(constApiMarketing.ArticuloObtenerTag)
      .subscribe({
        next: (response: HttpResponse<Articulo[]>) => {
          this.listaTag = response.body;
          this.listaTagsFiltrados = [...this.listaTag];
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  filtrarTags(filtro: string) {
    if (!filtro) {
      this.listaTagsFiltrados = [...this.listaTag];
    } else {
      const filtroLower = filtro.toLowerCase();
      this.listaTagsFiltrados = this.listaTag.filter(tag =>
        tag.nombre.toLowerCase().includes(filtroLower)
      );
    }
  }
  AsociarTag(){
    this.ArticulosTagEnvio.idsAsociados=[]
    let idsAsociados=this.formResumenTag.value
      this.ArticulosTagEnvio.idArticulo=this.ArticuloSeleccionado;
      this.ArticulosTagEnvio.usuario='mmantilla';
      this.ArticulosTagEnvio.idsAsociados=idsAsociados.idTag;
      this.integraService
        .insertar(constApiMarketing.ArticuloAsociarTag, this.ArticulosTagEnvio)
        .subscribe({
          next: () => {
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefTTag.close('submitted');
            this.mostrarMensajeExitoso();
            this.obtenerArticulo()
          },
        });
  }
  abrirModalAsociarProgramas( dataItem?: Articulo) {
    this.ArticuloSeleccionado=0;
    this.loaderModal = false;
    this.formArticulo.reset();
    this.ArticuloSeleccionado=dataItem.id;
    this.modalRefTArticulo = this.modalService.open(
      this.modalAsociarProgramas,
      { backdrop: 'static', size: 'xl' }
      );
    this.obtenerProgramasAsociados(dataItem);
    this.obtenerProgramasNoAsociados(dataItem);
  }
  obtenerProgramasAsociados(dataItem?: Articulo){
    this.loaderGrid = true;
    let IdArticulo=dataItem.id
    this.integraService
      .obtenerPorIdCodigo(constApiMarketing.ArticuloObtenerProgramasAsociados,IdArticulo)
      .subscribe({
        next: (response: HttpResponse<Articulo[]>) => {
          this.listaProgramasAsociados = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  obtenerProgramasNoAsociados(dataItem?: Articulo){
    this.loaderGrid = true;
    let IdArticulo=dataItem.id
    this.integraService
      .obtenerPorIdCodigo(constApiMarketing.ArticuloObtenerProgramasNoAsociados,IdArticulo)
      .subscribe({
        next: (response: HttpResponse<Articulo[]>) => {
          this.listaProgramasNoAsociados = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  asociarDocumentos(){
    if(this.listaProgramasNoAsociadosSeleccionados!=undefined && this.listaProgramasNoAsociadosSeleccionados.id!=undefined){
    this.listaProgramasAsociados.unshift(this.listaProgramasNoAsociadosSeleccionados)
    let eliminar = this.listaProgramasNoAsociados.findIndex((item:any) => item.id == this.listaProgramasNoAsociadosSeleccionados.id)
    this.listaProgramasNoAsociados.splice(eliminar,1);
    }
    this.listaProgramasNoAsociadosSeleccionados=[];
  }
  gridEventsResponseAdd(e:any){
    if(e.action!='dataStateChange' && e.action!='pageChange'){
      this.listaProgramasNoAsociadosSeleccionados=[],
    this.listaProgramasNoAsociadosSeleccionados.id=e.dataItem.id,
    this.listaProgramasNoAsociadosSeleccionados.nombre=e.dataItem.nombre
    }
  }
  desasociarDocumentos(){
    if(this.listaProgramasAsociadosSeleccionados!=undefined && this.listaProgramasAsociadosSeleccionados.id!=undefined)
    {
      this.listaProgramasNoAsociados.unshift(this.listaProgramasAsociadosSeleccionados)
      let eliminar = this.listaProgramasAsociados.findIndex((item:any) => item.id == this.listaProgramasAsociadosSeleccionados.id)
      this.listaProgramasAsociados.splice(eliminar,1);
    }
    this.listaProgramasAsociadosSeleccionados=[];

  }
  gridEventsResponseRemove(e:any){
    if(e.action!='dataStateChange'&& e.action!='pageChange')
    {
      this.listaProgramasAsociadosSeleccionados=[],
    this.listaProgramasAsociadosSeleccionados.id=e.dataItem.id,
    this.listaProgramasAsociadosSeleccionados.nombre=e.dataItem.nombre
    }
  }
  AsociarProgramas(){
    this.ArticulosPGeneralEnvio.idsAsociados=[]
    this.ArticulosPGeneralEnvio.idArticulo=this.ArticuloSeleccionado,
    this.ArticulosPGeneralEnvio.usuario='mmantilla'
    this.listaProgramasAsociados.forEach((js:any) => {
      this.ArticulosPGeneralEnvio.idsAsociados.push(js.id)
    });
    this.integraService.insertar(constApiMarketing.ArticuloAsociarProgramas, this.ArticulosPGeneralEnvio)
        .subscribe({
          next: (response: HttpResponse<ArticuloEnvio>) => {
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefTArticulo.close('submitted');
            this.mostrarMensajeExitoso();
            this.obtenerArticulo()
          },
        });
  }
}

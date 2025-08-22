import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriaOrigen, CategoriaOrigenEnvio } from '@integra/models/categoria-origen';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { GridCategoriaOrigen } from './grid-categoria-origen';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { constApiMarketing } from '@environments/constApi';
import { Parametro } from '@shared/models/parametro';

const pipe = new DatePipe('en-US');
const formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente de Modulo Maestro ,Creacion de Categoria Origen
 * @author Margiory Ramirez Neyra
 * @version 1.0.1
 * @history
 * * 07/08/2022 Creacion de interfaces decategoria Origen, implementacion nuevos registros
 */

@Component({
  selector: 'app-categoria-origen',
  templateUrl: './categoria-origen.component.html',
  styleUrls: ['./categoria-origen.component.scss']
})
export class CategoriaOrigenComponent implements OnInit {

  @ViewChild('modalCategoriaOrigen') modalCategoriaOrigen: any;
  @ViewChild('modalVerCategoriaOrigen') modalVerCategoriaOrigen: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}
  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  /**
   * Varibles
   * */

  successIcon: string = iconInputValidation;

  formCategoriaOrigen: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,
    ]],
    descripcion: ['', Validators.required],
    meta: ['', [Validators.required, Validators.min(1)]],
    idTipoDato: ['', [Validators.required]],
    idTipoCategoriaOrigen: ['', [Validators.required]],
    idProveedorCampaniaIntegra: ['', [Validators.required]],
    considerar: [true],
    codigoOrigen: ['', [Validators.required]],
    idFormularioProcedencia: ['', [Validators.required]]
    // oportunidadMaxima: '',
    // estado: '',
    // usuarioModificacion: '',
    // fechaModificacion: '',
    // usuarioCreacion: '',
    // fechaCreacion: '',
  });

  categoriaOrigenTemp :any
  modalRefTCOrigen: any;
  loaderGrid: boolean = false;  //GRID SPINNER
  loaderModal: boolean = false; //MODAL SPINNER
  isNew: boolean = false;
  listaCategoriaOrigen: CategoriaOrigen[] = [];

  filtrosCategoriaOrigen: any = {
    filtroTipoDato: [],
    filtroProveedorCampania: [],
    filtroTipoInteraccion: [],
    filtroProcedenciaformulario: [],
    filtroTipoCategoriaOrigen: [],
    filtroTipoCategoriaOrigenTodo: [],
  };

  gridCategoriaOrigen = new GridCategoriaOrigen();
  tipoInteraccionPorFormulario: any[] = []
  ngOnInit(): void {
    this.obtenerCategoriaOrigen();
    this.integraService
      .obtenerTodo(constApiMarketing.CategoriaOrigenObtenerFiltros)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body)
          this.filtrosCategoriaOrigen = response.body;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formCategoriaOrigen.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formCategoriaOrigen.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  selectionChangeFormulario(event:any){
    // this.tipoInteraccionPorFormulario = [];
    // this.tipoInteraccionPorFormulario = this.filtrosCategoriaOrigen.filtroTipoInteraccion.filter((x: any)=>x.id==event.id)
  }
  cargarTipoInteraccion(event: any): void {
    this.tipoInteraccionPorFormulario = [];
    this.tipoInteraccionPorFormulario = this.filtrosCategoriaOrigen.filtroTipoInteraccion.filter((x: any)=>x.id==event)
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese Nombre de  Categoria Origen',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      descripcion: { required: 'Ingrese una descripcion' },
      meta: {
        required: 'Meta es obligatorio',
        min: 'El Valor de Meta no es valido',
      },
      idTipoDato: {
        required: 'Tipo de Dato es obligatorio',
      },
      idTipoCategoriaOrigen: {
        required: 'Tipo Categoria Origen es obligatorio',
      },
      idProveedorCampaniaIntegra: {
        required: 'Proveedor Campaña es obligatorio',
      },
      codigoOrigen: {
        required: 'Codigo Origen es obligatorio',
      },
      idFormularioProcedencia: {
        required: 'Formulario Procedencia es obligatorio',
      },
    };
    let formControl: FormControl = this.formCategoriaOrigen.get(
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

  validFormCategoriaOrigen(): boolean {
    if(this.formCategoriaOrigen.invalid){
      this.formCategoriaOrigen.markAllAsTouched();
      return false;
    }
    return true;
  }
    /**
   * Funciones CRUD Cabecera-
   * */
  setDataCategoriaOrigen(item: CategoriaOrigen, itemValue: CategoriaOrigenEnvio): CategoriaOrigen{
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.descripcion = itemValue.descripcion;
      item.idTipoDato = itemValue.idTipoDato;
      item.idTipoCategoriaOrigen = itemValue.idTipoCategoriaOrigen;
      item.meta = itemValue.meta;
      item.idProveedorCampaniaIntegra = itemValue.idProveedorCampaniaIntegra;
      item.idFormularioProcedencia = itemValue.idFormularioProcedencia;
      item.considerar = itemValue.considerar;
      item.codigoOrigen = itemValue.codigoOrigen;
      item.estado = itemValue.estado;
      item.usuarioCreacion = itemValue.usuarioCreacion;
      item.usuarioModificacion = itemValue.usuarioModificacion;
      item.fechaCreacion = itemValue.fechaCreacion;
      item.fechaModificacion = itemValue.fechaModificacion;
      item.codigoPublicidad = itemValue.codigoPublicidad;
    }
    return item;
  }

  procesarDataCategoriaOrigen(dataItem: CategoriaOrigen, isNew: boolean): CategoriaOrigenEnvio {
    let fechaActual = pipe.transform(new Date(), formatoFecha);
    let fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
    let fechaModificacion = fechaActual;

    let CategoriaOrigenEnvio: CategoriaOrigenEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      descripcion: dataItem.descripcion,
      idTipoDato: dataItem.idTipoDato,
      idTipoCategoriaOrigen: dataItem.idTipoCategoriaOrigen,
      meta: dataItem.meta,
      idProveedorCampaniaIntegra: dataItem.idProveedorCampaniaIntegra,
      idFormularioProcedencia: dataItem.idFormularioProcedencia,
      considerar: dataItem.considerar,
      codigoOrigen: dataItem.codigoOrigen,
      fechaCreacion: fechaCreacion,
      fechaModificacion: fechaModificacion,
      estado: true,
      usuarioCreacion: isNew ? this.usuario.userName: dataItem.usuarioCreacion,
      usuarioModificacion:this.usuario.userName,
      codigoPublicidad: dataItem.codigoPublicidad,
    };
    return CategoriaOrigenEnvio;
  }

  obtenerCategoriaOrigen() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.CategoriaOrigenObtenerCategoriaOrigen)
      .subscribe({
        next: (response: HttpResponse<CategoriaOrigen[]>) => {
          this.listaCategoriaOrigen = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  crearCategoriaOrigen() {
    if (this.validFormCategoriaOrigen()) {
      // this.modalRefTCOrigen.close('submitted');
      this.loaderModal = true;
      let datosFormulario = this.formCategoriaOrigen.getRawValue();

      let CategoriaOrigen: CategoriaOrigen = Object.assign({}, datosFormulario);
      let CategoriaOrigenEnvio: CategoriaOrigenEnvio;
      CategoriaOrigenEnvio = this.procesarDataCategoriaOrigen(CategoriaOrigen, true);
      this.integraService
        .insertar(constApiMarketing.CategoriaOrigenInsertar, CategoriaOrigenEnvio)
        .subscribe({
          next: (response: HttpResponse<CategoriaOrigenEnvio>) => {
            CategoriaOrigen = this.setDataCategoriaOrigen(CategoriaOrigen, response.body);
            this.listaCategoriaOrigen.unshift(CategoriaOrigen);
            // this.listaGruposCategoriaOrigen = this.listaGruposCategoriaOrigen.slice();
            // this.listaGruposCategoriaOrigen.push(response.body); //insetar
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefTCOrigen.close('submitted');
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formCategoriaOrigen.markAllAsTouched();
  }
/**
   * @description Actualiza el  objeto  de Categoria Origen
   * @autor Margiory Ramirez
   */
  actualizarCategoriaOrigen() {
    if (this.validFormCategoriaOrigen()) {
     ;
      this.loaderModal = true;
      let CategoriaOrigen: CategoriaOrigen = Object.assign(this.categoriaOrigenTemp, this.formCategoriaOrigen.getRawValue());

      let CategoriaOrigenEnvio: CategoriaOrigenEnvio = this.procesarDataCategoriaOrigen(
        CategoriaOrigen,
        false
      );

      this.integraService
        .actualizar(constApiMarketing.CategoriaOrigenActualizar, CategoriaOrigenEnvio)
        .subscribe({
          next: (response: HttpResponse<CategoriaOrigenEnvio>) => {
            this.categoriaOrigenTemp = this.setDataCategoriaOrigen(CategoriaOrigen, response.body);

          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalRefTCOrigen.close();
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formCategoriaOrigen.markAllAsTouched();
  }

/**
   * @description Elimina el  objeto  de Categoria Origen
   * @autor Margiory Ramirez
   */
  eliminarCategoriaOrigen(dataItem: CategoriaOrigen, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.CategoriaOrigenEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if ((response.body == true)) {
            this.listaCategoriaOrigen.splice(index, 1);
            //this.listaCategoriaOrigen = this.listaCategoriaOrigen.slice();
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
        complete: () => {},
      });
  }

  /**
   * Despliega de notificacion en validacion
   * @autor Margiory Ramirez
   */

  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
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
        this.eliminarCategoriaOrigen(param.dataItem, param.index);
      }
    });
  }
 /**
   * Despliega modal para registro de datos
   * @autor Margiory Ramirez
   */
  abrirModalCategoriaOrigen(isNew: boolean, dataItem?: CategoriaOrigen, index?: number) {
    this.loaderModal = false;
    this.formCategoriaOrigen.reset();
    this.formCategoriaOrigen.get('considerar').setValue(true);
    this.tipoInteraccionPorFormulario = [];
    this.isNew = isNew;
    if (dataItem != null){
      this.categoriaOrigenTemp = dataItem;
      this.formCategoriaOrigen.patchValue(this.categoriaOrigenTemp);
      this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
    }

    this.modalRefTCOrigen = this.modalService.open(this.modalCategoriaOrigen);
  }

   /**
   * Obtiene los filtros de categoria Origen por id de cada campo
   * @autor Margiory Ramirez Neyra
   */
  obtenerNombrePorIdFiltro(id: number, field: string): string{
    let filtro: any[] = [];
    switch (field) {
      case 'idTipoDato':
        filtro = this.filtrosCategoriaOrigen.filtroTipoDato;
        break;
      case 'idTipoCategoriaOrigen':
        filtro = this.filtrosCategoriaOrigen.filtroTipoCategoriaOrigen;
        break;
      case 'idProveedorCampaniaIntegra':
        filtro = this.filtrosCategoriaOrigen.filtroProveedorCampania;
        break;
    }

    if(id != null){
      let dataTipoData = filtro.find((e: any) => e.id == id);
      return (dataTipoData != null) ? dataTipoData.nombre : '';
    } else {
      return ''
    }
  }

   /**
   * Procesa las operaciones de insertar , agregar,editar,elimina,reFrescar
   * @autor Margiory Ramirez
   */
  gridEventsCategoriaOrigen(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'edit':
        this.abrirModalCategoriaOrigen(e.isNew, e.dataItem, e.index);
        break;
      case 'add':
        this.abrirModalCategoriaOrigen(e.isNew, e);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(e);
        break;
      case 'reload':
        this.obtenerCategoriaOrigen();
        break;
    }
  }
}

import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { GridCategoriaOrigen } from './grid-grupos-categoria-origen';
import { TipoCategoriaOrigen, TipoCategoriaOrigenEnvio } from '@integra/models/tipo-categoria-origen';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';

const pipe = new DatePipe('en-US');
const formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente de grupo Categoria Origen.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 10/08/2022 Creacion de interfaces de Grupos categoria Origen,
 * * 11/08/2022 Implementaccion de funciones logicas
 */
@Component({
  selector: 'app-grupos-categoria-origen',
  templateUrl: './grupos-categoria-origen.component.html',
  styleUrls: ['./grupos-categoria-origen.component.scss'],
})
export class GruposCategoriaOrigenComponent implements OnInit {

  @ViewChild('modalGrupoCategoriaOrigen') modalGrupoCategoriaOrigen: any;
  @ViewChild('modalVerGrupoCategoriaOrigen') modalVerGrupoCategoriaOrigen: any;

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
   * Variables
   * */
  successIcon: string = iconInputValidation;
  formGrupoCategoriaOrigen: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    descripcion: ['', Validators.required],
    meta: ['', [Validators.required, Validators.min(1)]],

  });

  tipoCategoriaOrigenTemp :any
  modalRefTCOrigen: any;
  loaderGrid: boolean = false;
  loaderModal: boolean = false;
  isNew: boolean = false;
  listaGruposCategoriaOrigen: TipoCategoriaOrigen[] = [];
  gridGruposCategoriaOrigen = new GridCategoriaOrigen();

  /**
   * Acciones
   * */

  ngOnInit(): void {
    this.obtenerGrupoCategoriaOrigen();
  }
/**
   * @description Funciones de validacion
   * @autor Margiory Ramirez
   * @param {string} controlName
   */
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formGrupoCategoriaOrigen.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGrupoCategoriaOrigen.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  /**
   * @description Funciones de validacion de Formulario para cada campo
   * @autor Margiory Ramirez
   * @param {string} controlName
   */
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese Nombre de Tipo Categoria Origen',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio' },
      descripcion: { required: 'Ingrese una descripcion' },
      meta: { required: 'Meta es obligatorio', min: 'El Valor de Meta no es valido' },
    };
    let formControl: FormControl = this.formGrupoCategoriaOrigen.get(controlName) as FormControl;
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

  validFormGrupoCategoriaOrigen(): boolean {
    if(this.formGrupoCategoriaOrigen.invalid){
      this.formGrupoCategoriaOrigen.markAllAsTouched();
      return false;
    }
    return true;
  }
/**
   * Crea un objeto de  envio TipoCategoriaOrigen
   * @autor Margiory Ramirez
   */
  setDataTipoCategoriaOrigen(item: TipoCategoriaOrigen, itemValue: TipoCategoriaOrigenEnvio): TipoCategoriaOrigen{
    if(itemValue != null){
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.descripcion = itemValue.descripcion;
      item.meta = itemValue.meta;
      item.orden = itemValue.orden;
      item.oportunidadMaxima = itemValue.oportunidadMaxima;
      item.estado = itemValue.estado;
      item.usuarioCreacion = itemValue.usuarioCreacion;
      item.usuarioModificacion = itemValue.usuarioModificacion;
      item.fechaCreacion = itemValue.fechaCreacion;
      item.fechaModificacion = itemValue.fechaModificacion;
    }
    return item;
  }
  procesarDataTipoCategoriaOrigen(dataItem: TipoCategoriaOrigen, isNew: boolean): TipoCategoriaOrigenEnvio {
    let fechaActual = pipe.transform(new Date(), formatoFecha);
    let fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
    let fechaModificacion = fechaActual;

    let tipoCategoriaOrigenEnvio: TipoCategoriaOrigenEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      fechaCreacion: fechaCreacion,
      fechaModificacion: fechaModificacion,
      estado: true,
      usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
      usuarioModificacion: this.usuario.userName,
      descripcion: dataItem.descripcion,
      meta: dataItem.meta,
      orden: 0,
      oportunidadMaxima: Math.round(1.0/(dataItem.meta/100.0)), //base de datos
    };
    return tipoCategoriaOrigenEnvio;
  }
/**
   * Obtiene data  grupo Tipo Categoria Origen para el llenado de  grilla princial
   * @autor Margiory Ramirez
   */
  obtenerGrupoCategoriaOrigen() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.TipoCateriaOrigenObtenerTipoCategoriaOrigen)
      .subscribe({
        next: (response: HttpResponse<TipoCategoriaOrigen[]>) => {
          this.listaGruposCategoriaOrigen = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
/**
   * @description Creacion del objeto  Grupos  Categoria Origen
   * @autor Margiory Ramirez
   */
  crearGrupoCategoriaOrigen() {
    if (this.validFormGrupoCategoriaOrigen()) {
      this.loaderModal = true;
      let datosFormulario = this.formGrupoCategoriaOrigen.getRawValue();

      let tipoCategoriaOrigen: TipoCategoriaOrigen = Object.assign({}, datosFormulario);
      let tipoCategoriaOrigenEnvio: TipoCategoriaOrigenEnvio;
      tipoCategoriaOrigenEnvio = this.procesarDataTipoCategoriaOrigen(tipoCategoriaOrigen, true);
      this.integraService
        .insertar(constApiMarketing.TipoCateriaOrigenInsertar, tipoCategoriaOrigenEnvio)
        .subscribe({
          next: (response: HttpResponse<TipoCategoriaOrigenEnvio>) => {
            tipoCategoriaOrigen = this.setDataTipoCategoriaOrigen(tipoCategoriaOrigen, response.body);
            this.listaGruposCategoriaOrigen.unshift(tipoCategoriaOrigen);
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
    } else this.formGrupoCategoriaOrigen.markAllAsTouched();
  }
/**
   * @description Actualiza el  objeto  de Categoria Origen
   * @autor Margiory Ramirez
   */
  actualizarGrupoCategoriaOrigen() {
    if (this.validFormGrupoCategoriaOrigen()) {
     ;
      this.loaderModal = true;
      let tipoCategoriaOrigen: TipoCategoriaOrigen = Object.assign(this.tipoCategoriaOrigenTemp, this.formGrupoCategoriaOrigen.getRawValue());

      let tipoCategoriaOrigenEnvio: TipoCategoriaOrigenEnvio = this.procesarDataTipoCategoriaOrigen(
        tipoCategoriaOrigen,
        false
      );

      this.integraService
        .actualizar(constApiMarketing.TipoCateriaOrigenActualizar, tipoCategoriaOrigenEnvio)
        .subscribe({
          next: (response: HttpResponse<TipoCategoriaOrigenEnvio>) => {

            this.tipoCategoriaOrigenTemp = this.setDataTipoCategoriaOrigen(tipoCategoriaOrigen, response.body);

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
    } else this.formGrupoCategoriaOrigen.markAllAsTouched();''
  }
/**
   * @description Elimina  el  objeto  de Categoria Origen  en la grilla principal por Id
   * @autor Margiory Ramirez
   */
  eliminarGrupoCategoriaOrigen(dataItem: TipoCategoriaOrigen, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor:this.usuario.userName},
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.TipoCateriaOrigenEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if ((response.body == true)) {
            this.listaGruposCategoriaOrigen.splice(index, 1);
            // this.listaGruposCategoriaOrigen = this.listaGruposCategoriaOrigen.slice();
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
        this.eliminarGrupoCategoriaOrigen(param.dataItem, param.index);
      }
    });
  }

 /**
   * Despliega modal para registro de datos
   * @autor Margiory Ramirez
   */
  abrirModalTipoCategoriaOrigen(isNew: boolean, dataItem?: TipoCategoriaOrigen, index?: number) {
    this.loaderModal = false;
    this.formGrupoCategoriaOrigen.reset();
    this.isNew = isNew;
    if (dataItem != null){
      this.tipoCategoriaOrigenTemp = dataItem;
      this.formGrupoCategoriaOrigen.patchValue(this.tipoCategoriaOrigenTemp);
    }

    this.modalRefTCOrigen = this.modalService.open(this.modalGrupoCategoriaOrigen);
  }

  abrirModalVerDatos(data:any){
    this.tipoCategoriaOrigenTemp = data;
    this.modalService.open(this.modalVerGrupoCategoriaOrigen);
  }

   /**
   * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
   * @autor Margiory Ramirez
   */
  gridEventsGrupoCategoriaOrigen(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'edit':
        this.abrirModalTipoCategoriaOrigen(e.isNew, e.dataItem, e.index);
        break;
      case 'add':
        this.abrirModalTipoCategoriaOrigen(e.isNew, e);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(e);
        break;
      case 'ver':
          this.abrirModalVerDatos(e.dataItem);
          break;
      case 'reload':
        this.obtenerGrupoCategoriaOrigen();
        break;
    }
  }
}


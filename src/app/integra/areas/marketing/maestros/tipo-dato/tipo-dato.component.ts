import { TipoDatoEnvio } from './../../../../models/tipo-dato';

import { Component, OnInit, ViewChild } from '@angular/core';
import { GridTipoDato } from './grid-tipo-dato';
import { IntegraService } from '@shared/services/integra.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { TextValidator } from '@shared/validators/text.validator';
import { TipoDato } from '@integra/models/tipo-dato';
import { constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { Parametro } from '@shared/models/parametro';
import Swal from 'sweetalert2';

const pipe = new DatePipe('en-US');
const formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente tipo Dato, modulo maestro.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 01/09/2022 Implementacion de interfaz
 * * 02/09/2022 Creacion de funciones Logicas
 */

@Component({
  selector: 'app-tipo-dato',
  templateUrl: './tipo-dato.component.html',
  styleUrls: ['./tipo-dato.component.scss']
})
export class TipoDatoComponent implements OnInit {
  @ViewChild('modalTipoDato') modalTipoDato: any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal


  ) { }

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal
/**
 * Variables
 */
  successIcon: string = iconInputValidation;
  formTipoDato: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    descripcion: ['', Validators.required],
    prioridad: ['', [Validators.required, Validators.min(1)]],

  });

  tipoDatoTemp :any
  modalRefTipoDato: any;
  loaderGrid: boolean = false;
  loaderModal: boolean = false;
  isNew: boolean = false;
  listaTipoDato: TipoDato[] = [];
  gridTipoDato = new GridTipoDato ();

  ngOnInit(): void {
    this.obtenerTipoDato();
  }

/**
 *
 * @param controlName
 * @returns
 */
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formTipoDato.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formTipoDato.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese Nombre de Tipo Dato',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio' },
      descripcion: { required: 'Ingrese una descripcion' },
      prioridad: { required: 'Prioridad es obligatorio', min: 'El Valor de Prioridad no es valido' },
    };
    let formControl: FormControl = this.formTipoDato.get(controlName) as FormControl;
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

  validFormTipoDato(): boolean {
    if(this.formTipoDato.invalid){
      this.formTipoDato.markAllAsTouched();
      return false;
    }
    return true;
  }
/**
 *
 * @param item
 * @param itemValue
 * @returns
 */
  setDataTipoData(item: TipoDato, itemValue: TipoDatoEnvio): TipoDato{
    if(itemValue != null){
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.descripcion = itemValue.descripcion;
      item.prioridad = itemValue.prioridad;
      item.estado = itemValue.estado;
      item.usuarioCreacion = itemValue.usuarioCreacion;
      item.usuarioModificacion = itemValue.usuarioModificacion;
      item.fechaCreacion = itemValue.fechaCreacion;
      item.fechaModificacion = itemValue.fechaModificacion;
    }
    return item;
  }

  procesarDataTipoDato(dataItem: TipoDato, isNew: boolean): TipoDatoEnvio {
    let fechaActual = pipe.transform(new Date(), formatoFecha);
    let fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
    let fechaModificacion = fechaActual;

    let tipoDatoEnvio: TipoDatoEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      descripcion: dataItem.descripcion,
      prioridad: dataItem.prioridad,
      fechaCreacion: fechaCreacion,
      fechaModificacion: fechaModificacion,
      estado: true,
      usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
      usuarioModificacion: this.usuario.userName,

    };
    return tipoDatoEnvio;
  }

  /**
   * Obtiene  data principal para el llenado  de griila
   * @autor Margiory Ramirez
   */
  obtenerTipoDato() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.TipoDatoObtenerTipoDato)
      .subscribe({
        next: (response: HttpResponse<TipoDato[]>) => {
          this.listaTipoDato = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  /**
   * @description Creacion del objeto Tipo Dato
   * @autor Margiory Ramirez
   */
  crearTipoDato() {
    if (this.validFormTipoDato()) {
      // this.modalRefTCOrigen.close('submitted');
      this.loaderModal = true;
      let datosFormulario = this.formTipoDato.getRawValue();

      let tipoDato: TipoDato = Object.assign({}, datosFormulario);
      let tipoDatoEnvio: TipoDatoEnvio;
      tipoDatoEnvio = this.procesarDataTipoDato(tipoDato, true);
      this.integraService
        .insertar(constApiMarketing.TipoDatoInsertarTipoDato, tipoDatoEnvio)
        .subscribe({
          next: (response: HttpResponse<TipoDatoEnvio>) => {
            tipoDato = this.setDataTipoData(tipoDato, response.body);
            this.listaTipoDato.unshift(tipoDato);

            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefTipoDato.close('submitted');
            this.mostrarMensajeExitoso();
            this.obtenerTipoDato()
          },
        });
    } else this.formTipoDato.markAllAsTouched();
  }
/**
   * @description Actualiza el  objeto  de Tipo Dato
   * @autor Margiory Ramirez
   */
  actualizarTipoDato() {
    if (this.validFormTipoDato()) {
     ;
      this.loaderModal = true;
      let tipoDato: TipoDato = Object.assign(this.tipoDatoTemp, this.formTipoDato.getRawValue());

      let tipoDatoEnvio: TipoDatoEnvio = this.procesarDataTipoDato(
        tipoDato,
        false
      );

      this.integraService
        .actualizar(constApiMarketing.TipoDatoActualizarTipoDato, tipoDatoEnvio)
        .subscribe({
          next: (response: HttpResponse<TipoDatoEnvio>) => {
            // this.listaGruposCategoriaOrigen.splice(index, 1);
            this.tipoDatoTemp = this.setDataTipoData(tipoDato, response.body);
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalRefTipoDato.close();
            this.mostrarMensajeExitoso();
            this.obtenerTipoDato()
          },
        });
    } else this.formTipoDato.markAllAsTouched();
  }
  /**
   * @description Elimina  el  objeto  de tipo Dato  en la grilla principal por Id
   * @autor Margiory Ramirez
   */
  eliminarTipoDato(dataItem: TipoDato, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.TipoDatoEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if ((response.body == true)) {
            this.listaTipoDato.splice(index, 1);
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
        complete: () => {
          this.obtenerTipoDato()
        },
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

  mostrarMensajeEliminar(data: any, index:any) {
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
        this.eliminarTipoDato(data, index);
      }
    });
  }
/**
   * Despliega modal para registro de datos
   * @autor Margiory Ramirez
   */
  abrirModalTipoDato(isNew: boolean, dataItem?: TipoDato, index?: number) {
    this.loaderModal = false;
    this.formTipoDato.reset();
    this.isNew = isNew;
    if (dataItem != null){
      this.tipoDatoTemp = dataItem;
      this.formTipoDato.patchValue(this.tipoDatoTemp);
    }
    this.modalRefTipoDato = this.modalService.open(this.modalTipoDato);
  }
    /**
    * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
    * @autor Margiory Ramirez
    */
  gridEventsTipoDato(e: any, n:any, data:any, index:any): void {
    console.log(e);
    switch (e) {
      case 'edit':
        this.abrirModalTipoDato(n, data, index);
        break;
      case 'add':
        this.abrirModalTipoDato(n);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(data, index);
        break;

      case 'reload':
        this.obtenerTipoDato();
        break;

    }

 
  }
}


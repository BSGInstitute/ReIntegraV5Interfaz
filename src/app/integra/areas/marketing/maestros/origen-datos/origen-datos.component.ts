import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { OrigenDato, OrigenDatoEnvio } from '@integra/models/origen-dato';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { GridOrigenDato } from './grid-origen-datos';
const pipe = new DatePipe('en-US');
const formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente de Origen Dato.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 27/08/2022 Creacion de interfaces de Grupos Origen Datos,
 * * 28/08/2022 Implementaccion de funciones logicas
 */
@Component({
  selector: 'app-origen-datos',
  templateUrl: './origen-datos.component.html',
  styleUrls: ['./origen-datos.component.scss']
})
export class OrigenDatosComponent implements OnInit {
  @ViewChild('modalOrigenDato') modalOrigenDato: any;
  @ViewChild('modalVerOrigenDato') modalVerOrigenDato: any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  )
  {
  }

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

/**
 * Variables
 */
  successIcon: string = iconInputValidation;
  formOrigenDato: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    descripcion: ['', Validators.required],
    prioridad: ['', [Validators.required, Validators.min(1)]],
  });

  origenDatoTemp :any

  modalRefTCOrigen: any;
  loaderGrid: boolean = false;
  loaderModal: boolean = false;
  isNew: boolean = false;
  listaOrigenDato: OrigenDato[] = [];
  gridOrigenDato = new GridOrigenDato();


/**
 * Acciones
 */
  ngOnInit(): void {
    this.obtenerOrigenDato();
  }

  /**
   * @description Funciones de validacion
   * @autor Margiory Ramirez
   * @param {string} controlName
   */
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formOrigenDato.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formOrigenDato.get(controlName) as FormControl;
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
        required: 'Ingrese Nombre de Origen Tato',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio' },
      descripcion: { required: 'Ingrese una descripcion' },
      prioridad: { required: 'Prioridad es obligatorio', min: 'El Valor de Meta no es valido' },

    };
    let formControl: FormControl = this.formOrigenDato.get(controlName) as FormControl;
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
  validformOrigenDato(): boolean {
    if(this.formOrigenDato.invalid){
      this.formOrigenDato.markAllAsTouched();
      return false;
    }
    return true;
  }
  /**
   * Crea un objeto de  envio Origen Dato
   * @autor Margiory Ramirez
   */
  setDataOrigenDato(item: OrigenDato, itemValue: OrigenDatoEnvio): OrigenDato{
    if(itemValue != null){
        item.id= itemValue.id;
        item.nombre= itemValue.nombre;
        item.descripcion=itemValue.descripcion;
        item.idTipodato=itemValue.idTipodato;
        item.prioridad=itemValue.prioridad;
        item.idCategoriaOrigen=itemValue.idCategoriaOrigen;
        item.estado=itemValue.estado;
        item.usuarioCreacion=itemValue.usuarioCreacion;
        item.usuarioModificacion=itemValue.usuarioModificacion;
        item.fechaModificacion=itemValue.fechaModificacion;
        item.fechaCreacion = itemValue.fechaCreacion;


    }
    return item;
  }
  procesarDataOrigenDato(dataItem: OrigenDato, isNew: boolean):  OrigenDatoEnvio {
    let fechaActual = pipe.transform(new Date(), formatoFecha);
    let fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
    let fechaModificacion = fechaActual;
    let OrigenDatoEnvio: OrigenDatoEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      fechaCreacion: fechaCreacion,
      fechaModificacion: fechaModificacion,
      estado: true,
      usuarioCreacion: isNew ? this.usuario.userName: dataItem.usuarioCreacion,
      usuarioModificacion: this.usuario.userName,
      descripcion: dataItem.descripcion,
      idTipodato: dataItem.idTipodato,
      idCategoriaOrigen:dataItem.idCategoriaOrigen,
      prioridad:dataItem.prioridad,

    };
    return OrigenDatoEnvio;
  }
/**
   * Obtiene data  Origen Dato Origen para el llenado de  grilla princial
   * @autor Margiory Ramirez
   */
  obtenerOrigenDato() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.OrigenObtenerOrigen)
      .subscribe({
        next: (response: HttpResponse<OrigenDato[]>) => {
          this.listaOrigenDato = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
/**
   * @description Creacion del objeto  origen dato
   * @autor Margiory Ramirez
   */
  crearOrigenDato() {
    if (this.validformOrigenDato()) {

      this.loaderModal = true;
      let datosFormulario = this.formOrigenDato.getRawValue();
      let origenDato: OrigenDato = Object.assign({}, datosFormulario);
      let  origenDatoEnvio: OrigenDatoEnvio;
      origenDatoEnvio = this.procesarDataOrigenDato(origenDato, true);
      this.integraService
        .insertar(constApiMarketing. OrigenIsertar,  origenDatoEnvio)
        .subscribe({
          next: (response: HttpResponse<OrigenDatoEnvio>) => {
            origenDato = this.setDataOrigenDato(origenDato, response.body);
            this.listaOrigenDato.unshift(origenDato);
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
    } else this.formOrigenDato.markAllAsTouched();
  }
/**
   * @description Actualiza el  objeto  de Origen Dato
   */
  actualizarOrigenDato() {
    if (this.validformOrigenDato()) {
     ;
      this.loaderModal = true;
      let origenDato: OrigenDato = Object.assign(this. origenDatoTemp , this.formOrigenDato.getRawValue());

      let origenDatoEnvio: OrigenDatoEnvio = this.procesarDataOrigenDato(
        origenDato,
        false
      );

      this.integraService
        .actualizar(constApiMarketing.OrigenActualizar, origenDatoEnvio)
        .subscribe({
          next: (response: HttpResponse<OrigenDatoEnvio>) => {


            this.origenDatoTemp = this.setDataOrigenDato(origenDato, response.body);

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
    } else this.formOrigenDato.markAllAsTouched();
  }
/**
   * @description Elimina  el  objeto  de  Origen Dato  en la grilla principal por Id
   * @autor Margiory Ramirez
   */
  eliminarOrigenDato(dataItem: OrigenDato, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName},
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing. OrigenEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if ((response.body == true)) {
            this.listaOrigenDato.splice(index, 1);
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
        this.eliminarOrigenDato(param.dataItem, param.index);
      }
    });
  }

  abrirModalOrigenDato(isNew: boolean, dataItem?: OrigenDato, index?: number) {
    this.loaderModal = false;
    this.formOrigenDato.reset();
    this.isNew = isNew;
    if (dataItem != null){
      this.origenDatoTemp = dataItem;
      this.formOrigenDato.patchValue(this.origenDatoTemp);
    }

    this.modalRefTCOrigen = this.modalService.open(this.modalOrigenDato);
  }

  abrirModalVerDatos(data:any){
    this.origenDatoTemp = data;
    this.modalService.open(this.modalVerOrigenDato);
  }
/**
   * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
   * @autor Margiory Ramirez
   */
  gridEventsOrigenDato(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'edit':
        this.abrirModalOrigenDato(e.isNew, e.dataItem, e.index);
        break;
      case 'add':
        this.abrirModalOrigenDato(e.isNew, e);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(e);
        break;
      case 'ver':
          this.abrirModalVerDatos(e.dataItem);
          break;
      case 'reload':
        this.obtenerOrigenDato();
        break;
    }
  }
}





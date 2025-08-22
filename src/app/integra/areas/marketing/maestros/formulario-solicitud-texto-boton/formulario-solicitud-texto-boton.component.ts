import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { FormularioSolicitudTextoBoton, FormularioSolicitudTextoBotonEnvio } from '@integra/models/formulario-solicitud-texto-boton';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { GridFormularioSolicitudTextoBoton } from './grid-formulario-solicitud-texto-boton';

/**
 * @module MarketingModule
 * @description Componente de Modulo Maestro ,Creacion de Categoria Origen
 * @author Margiory Ramirez Neyra
 * @version 1.0.1
 * @history
 * * 07/08/2022 Creacion de interfaces formulario Texto Boton, implementacion nuevos registros
 */
const pipe = new DatePipe('en-US');
const formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-formulario-solicitud-texto-boton',
  templateUrl: './formulario-solicitud-texto-boton.component.html',
  styleUrls: ['./formulario-solicitud-texto-boton.component.scss']
})
export class FormularioSolicitudTextoBotonComponent implements OnInit {
  @ViewChild('modalFormularioSolicitudTextoBoton') modalFormularioSolicitudTextoBoton: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }

    /**
   * Varibles
   * */
  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  successIcon: string = iconInputValidation;
  formFormularioTextoBoton: FormGroup = this.formBuilder.group({
    id: [0],
    textoBoton: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    descripcion: ['', Validators.required],
    porDefecto:[true],

  });


  formularioTextoBotonTemp :any
  modalRefFormulariotextoBoton: any;
  loaderGrid: boolean = false;
  loaderModal: boolean = false;
  isNew: boolean = false;
  listaFormularioSolicitudTextoBoton: FormularioSolicitudTextoBoton[] = [];
  gridFormularioSolicitudTextoBoton = new GridFormularioSolicitudTextoBoton ();

  ngOnInit(): void {

    this.obtenerFormularioSolicitudTextoBoton();
  }
  /**
   * Validaciones
   * @autor margioy Ramirez
   */
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formFormularioTextoBoton.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formFormularioTextoBoton.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      textoBoton: {
        required: 'Ingrese Nombre de Formulario Texto Boton',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio' },
      descripcion: { required: 'Ingrese una Descripcion' },

    };
    let formControl: FormControl = this.formFormularioTextoBoton.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }

    return null;
  }

  validFormFormulariotextoBoton(): boolean {
    if(this.formFormularioTextoBoton.invalid){
      this.formFormularioTextoBoton.markAllAsTouched();
      return false;
    }
    return true;
  }

 /**
   * Crea un objeto de envio para el formulario
   * @autor Margirory Ramirez
   */

  setDataFormularioSolicitudTextoBoton(item: FormularioSolicitudTextoBoton, itemValue: FormularioSolicitudTextoBotonEnvio): FormularioSolicitudTextoBoton{
    if(itemValue != null){
      item.id = itemValue.id;
      item.textoBoton = itemValue.textoBoton;
      item.descripcion = itemValue.descripcion;
      item.porDefecto = itemValue.porDefecto;
      item.estado = itemValue.estado;
      item.usuarioCreacion = itemValue.usuarioCreacion;
      item.usuarioModificacion = itemValue.usuarioModificacion;
      item.fechaCreacion = itemValue.fechaCreacion;
      item.fechaModificacion = itemValue.fechaModificacion;
    }
    return item;
  }

  procesarFormularioSolicitudTextoBoton(dataItem: FormularioSolicitudTextoBoton, isNew: boolean): FormularioSolicitudTextoBotonEnvio {
    let fechaActual = pipe.transform(new Date(), formatoFecha);
    let fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
    let fechaModificacion = fechaActual;

    let formularioSolicitudTextoBotonEnvio: FormularioSolicitudTextoBotonEnvio = {
      id: isNew ? 0 : dataItem.id,
      textoBoton: dataItem.textoBoton,
      descripcion: dataItem.descripcion,
      porDefecto: dataItem.porDefecto,
      fechaCreacion: fechaCreacion,
      fechaModificacion: fechaModificacion,
      estado: dataItem.estado,
      usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
      usuarioModificacion:this.usuario.userName,

    };
    return formularioSolicitudTextoBotonEnvio;
  }

  /**
   * Obtiene la data principal par la grilla
   * @autor Margiory Ramirez
   */
  obtenerFormularioSolicitudTextoBoton() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.FormularioSolicitudTextoBotonObtenerFormularioSolicitudTexto)
      .subscribe({
        next: (response: HttpResponse<FormularioSolicitudTextoBoton[]>) => {
          this.listaFormularioSolicitudTextoBoton = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

/**
   * Inserta data nueva en formulario solicitud
   * @autor Margiory Ramirez
   */
  crearFormularioSolicitudTextoBoton() {
    if (this.validFormFormulariotextoBoton()) {
      // this.modalRefTCOrigen.close('submitted');
      this.loaderModal = true;
      let datosFormulario = this.formFormularioTextoBoton.getRawValue();

      let formularioSolicitudTextoBoton: FormularioSolicitudTextoBoton = Object.assign({}, datosFormulario);
      let formularioSolicitudTextoBotonEnvio: FormularioSolicitudTextoBotonEnvio;
      formularioSolicitudTextoBotonEnvio = this.procesarFormularioSolicitudTextoBoton(formularioSolicitudTextoBoton, true);
      this.integraService
        .insertar(constApiMarketing.FormularioSolicitudTextoBotonInsertar,formularioSolicitudTextoBotonEnvio)
        .subscribe({
          next: (response: HttpResponse<FormularioSolicitudTextoBotonEnvio>) => {
            formularioSolicitudTextoBoton = this.setDataFormularioSolicitudTextoBoton(formularioSolicitudTextoBoton, response.body);
            this.listaFormularioSolicitudTextoBoton.unshift(formularioSolicitudTextoBoton);

            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefFormulariotextoBoton.close('submitted');
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formFormularioTextoBoton.markAllAsTouched();
  }
/**
   * Actulizacion del objeto FOrmulario texto Boton
   * @autor Margiory Ramirez
   */
  actualizarFormularioSolicitudTextoBoton() {
    if (this.validFormFormulariotextoBoton()) {
     ;
      this.loaderModal = true;
      let formularioSolicitudTextoBoton: FormularioSolicitudTextoBoton = Object.assign(this.formularioTextoBotonTemp, this.formFormularioTextoBoton.getRawValue());

      let formularioSolicitudTextoBotonEnvio: FormularioSolicitudTextoBotonEnvio = this.procesarFormularioSolicitudTextoBoton(
        formularioSolicitudTextoBoton,
        false
      );

      this.integraService
        .actualizar(constApiMarketing.FormularioSolicitudTextoBotonActualizar, formularioSolicitudTextoBotonEnvio)
        .subscribe({
          next: (response: HttpResponse<FormularioSolicitudTextoBotonEnvio>) => {
            // this.listaGruposCategoriaOrigen.splice(index, 1);
            this.formularioTextoBotonTemp = this.setDataFormularioSolicitudTextoBoton(formularioSolicitudTextoBoton, response.body);
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalRefFormulariotextoBoton.close();
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formFormularioTextoBoton.markAllAsTouched();
  }

  eliminarFormularioTextoBoton(dataItem: FormularioSolicitudTextoBoton, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.FormularioSolicitudTextoBotonEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if ((response.body == true)) {
            this.listaFormularioSolicitudTextoBoton.splice(index, 1);
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

  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  /**
   * Despliega  notificacion  de validacion
   * @autor Margiory Ramirez
   */

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
        this.eliminarFormularioTextoBoton(param.dataItem, param.index);
      }
    });
  }
 /**
   * Obtiene la plantilla de Formulario Texto Boton
   * @autor Margiory Ramirez
   */
  abrirModalFormularioTextoBoton(isNew: boolean, dataItem?: FormularioSolicitudTextoBoton, index?: number) {
    this.loaderModal = false;
    this.formFormularioTextoBoton.reset();
    this.formFormularioTextoBoton.get('porDefecto').setValue(true);
    this.isNew = isNew;
    if (dataItem != null){
      this.formularioTextoBotonTemp = dataItem;
      this.formFormularioTextoBoton.patchValue(this.formularioTextoBotonTemp);
    }

    this.modalRefFormulariotextoBoton = this.modalService.open(this.modalFormularioSolicitudTextoBoton);
  }
/**
   * Procesa las operaciones de insertar , agregar,editar,elimina,reFrescar
   * @autor Margiory Ramirez
   */
  gridEventsFormularioTextoBoton(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'edit':
        this.abrirModalFormularioTextoBoton(e.isNew, e.dataItem, e.index);
        break;
      case 'add':
        this.abrirModalFormularioTextoBoton(e.isNew, e);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(e);
        break;

      case 'reload':
        this.obtenerFormularioSolicitudTextoBoton();
        break;
    }
  }
}





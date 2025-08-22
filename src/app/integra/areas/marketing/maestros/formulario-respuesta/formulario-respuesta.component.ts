import { filter } from 'rxjs';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IntegraService } from '@shared/services/integra.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TextValidator } from '@shared/validators/text.validator';
import { constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { FormularioRespuesta, FormularioRespuestaEnvio } from '@integra/models/formulario-respuesta';
import { GridFormularioRespuesta } from './grid-formulario-respuesta';
import { Parametro } from '@shared/models/parametro';

const pipe = new DatePipe('en-US');
const formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';


/**
 * @module MarketingModule
 * @description Componente de Formulario Respuesta modulo maestro
 * @author Margiory Ramirez Neyra
 * @version 1.0.1
 * @history
 * * 06/08/2022 Implementacion de creacion de Formulario Respuesta
 * * 06/08/2022 Creacion de interfaces de Formulario Respuesta
 */

@Component({
  selector: 'app-formulario-respuesta',
  templateUrl: './formulario-respuesta.component.html',
  styleUrls: ['./formulario-respuesta.component.scss']
})
export class FormularioRespuestaComponent implements OnInit {
  @ViewChild('modalFormularioRespuesta') modalFormularioRespuesta: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal

  )
  { }

  /**
   * Variables
   * @autor Margiory Ramirez Neyra
   */
  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal
  successIcon: string = iconInputValidation;
  formFormularioRespuesta: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    codigo: ['', Validators.required],
    idPgeneral:[],


  });
  filtro:any
  formularioRespuestaTemp :any
  modalRefFormularioRespuesta: any;
  loaderGrid: boolean = false;
  loaderModal: boolean = false;
  isNew: boolean = false;
  listaFormularioRespuesta: FormularioRespuesta[] = [];
  gridFormularioRespuesta = new GridFormularioRespuesta ();
  filtroFormularioRespuesta:any={
    filtroProgramGeneral:[]
  }




  ngOnInit(): void {
    this.ObtenerFormularioRespuesta();
    this.ObtenerProgramaGenereal();
  }
 /**
   * @description validaciones de usuario  para funciones principales.
   * @autor Margiory Ramirez
   * @param {boolean} controlName
   */
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formFormularioRespuesta.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formFormularioRespuesta.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese Nombre de Formulario Respuesta',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio' },
      codigo: { required: 'Ingrese Codigo Formulario Respuesta' },
      idPgeneral:{ required: 'Programa genral es Requerido'},


    };
    let formControl: FormControl = this.formFormularioRespuesta.get(controlName) as FormControl;
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

  validFormFormularioTextoBoton(): boolean {
    if(this.formFormularioRespuesta.invalid){
      this.formFormularioRespuesta.markAllAsTouched();
      return false;
    }
    return true;
  }

  /**
   * Envia la data para  el Formulario Respueta
   * @autor Margiory Ramirez Neyra
   */
  setDataFormularioRespuesta(item: FormularioRespuesta, itemValue: FormularioRespuestaEnvio): FormularioRespuesta{
    if(itemValue != null){
      item.id = itemValue.id;
      item.idPgeneral = itemValue.idPgeneral;
      item.nombre = itemValue.nombre;
      item.programaGeneral = itemValue.programaGeneral;
      item.codigo = itemValue.codigo;
    }
    return item;
  }

  procesarDataFormularioRespuesta(dataItem: FormularioRespuesta, isNew: boolean): FormularioRespuestaEnvio {
    let fechaActual = pipe.transform(new Date(), formatoFecha);
    let fechaModificacion = fechaActual;
    let programa=this.filtro.filter((e :any)=>e.idPgeneral==dataItem.idPgeneral)
    console.log(programa);
    let formularioRespuestaEnvio: FormularioRespuestaEnvio = {
      id: isNew ? 0 : dataItem.id,
      idPgeneral:dataItem.idPgeneral,
      nombre: dataItem.nombre,
      codigo: dataItem.codigo,
      programaGeneral: programa[0].nombre,
      fechaModificacion: fechaModificacion,
      usuarioModificacion: this.usuario.userName,
    };
    return formularioRespuestaEnvio;
  }

 /**
   * Obtiene la Data para llenado de grilla principal
   * @autor Margiory Ramirez
   */

  ObtenerFormularioRespuesta(){
     this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.FormularioRespuestaObtenerFormularioRespueta)
      .subscribe({
        next: (response: HttpResponse<FormularioRespuesta[]>) => {
          this.listaFormularioRespuesta = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });

  }
  /**
   * Obtiene la Data de Programa General
   * @autor Margiory Ramirez
   */
  ObtenerProgramaGenereal(){

    this.loaderGrid = true;
   this.integraService
     .obtenerTodo(constApiMarketing.FormularioRespuestaObtenerComboDato)
     .subscribe({
       next: (response: HttpResponse<FormularioRespuesta[]>) => {
         this.filtro = response.body;
         this.loaderGrid = false;
       },
       error: (error) => {
         this.mostrarMensajeError(error);
       },
       complete: () => {},
     });

 }

   /**
   * @description Creacion del objeto formulario respueta
   * @autor Margiory Ramirez
   */

  crearFormularioRespuesta() {


    if (this.validFormFormularioTextoBoton()) {
      // this.modalRefTCOrigen.close('submitted');
      this.loaderModal = true;
      let datosFormulario = this.formFormularioRespuesta.getRawValue();

      let  formularioRespuesta = Object.assign({}, datosFormulario);
      let formularioRespuestaEnvio: FormularioRespuestaEnvio;
      formularioRespuestaEnvio = this.procesarDataFormularioRespuesta(datosFormulario, true);
      console.log(formularioRespuestaEnvio);
      this.integraService
        .insertar(constApiMarketing.FormularioRespuestaInsertar, formularioRespuestaEnvio)
        .subscribe({
          next: (response: HttpResponse<FormularioRespuestaEnvio>) => {
            formularioRespuesta = this.setDataFormularioRespuesta(formularioRespuesta, response.body);
            this.listaFormularioRespuesta.unshift(formularioRespuesta);
            // this.listaGruposCategoriaOrigen = this.listaGruposCategoriaOrigen.slice();
            // this.listaGruposCategoriaOrigen.push(response.body); //insetar
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefFormularioRespuesta.close('submitted');
            this.mostrarMensajeExitoso();
            this.ObtenerFormularioRespuesta();
          },
        });
    } else this.formFormularioRespuesta.markAllAsTouched();
  }


 /**
   * @description Actuliza del objeto formulario respueta
   * @autor Margiory Ramirez
   */

  actualizarFormularioRespuesta() {

    if (this.validFormFormularioTextoBoton()) {
     ;
      this.loaderModal = true;
      let formularioRespuesta: FormularioRespuesta = Object.assign(this.formularioRespuestaTemp, this.formFormularioRespuesta.getRawValue());
      let FormularioRespuestaEnvio: FormularioRespuestaEnvio = this.procesarDataFormularioRespuesta(
        formularioRespuesta,
        false
      );

      this.integraService
        .actualizar(constApiMarketing.FormularioRespuestaActualizar, FormularioRespuestaEnvio)
        .subscribe({
          next: (response: HttpResponse<FormularioRespuestaEnvio>) => {

            this.formularioRespuestaTemp = this.setDataFormularioRespuesta(formularioRespuesta, response.body);

          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalRefFormularioRespuesta.close();
            this.mostrarMensajeExitoso();
            this.ObtenerFormularioRespuesta();
          },
        });
    } else this.formFormularioRespuesta.markAllAsTouched();

  }

  /**
   * Proceso ejecutado al finalizar  el guardo de Datos Formulario Respuesta.
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


  mostrarMensajeError(error:any):void{
  Swal.fire(
    {
      icon:'error',
      html:`<p class="text-start">${error.error}</p>
      <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false

    }
  )

  }

  /**
   *  Elimina y Limpia valores del formulario Respuesta
   * @autor Margiory Ramirez
   */
  eliminarFormularioRespuesta(dataItem: FormularioRespuesta, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor:this.usuario.userName },
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.FormularioRespuestaEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if ((response.body == true)) {
            this.listaFormularioRespuesta.splice(index, 1);
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
          this.ObtenerFormularioRespuesta();
        },
      });
  }
 /**
   * Despliega de notificacion en validacion(eliminado)
   * @autor Margiory Ramirez
   */


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
        this.eliminarFormularioRespuesta(data, index);
      }
    });
  }
 /**
   * Carga los datos iniciales al abri el formulario respuesta
   * @autor Margiory Ramirez
   */
  abrirModalFormularioRespuesta(isNew: boolean, dataItem?: FormularioRespuesta, index?: number) {
    this.loaderModal = false;
    this.formFormularioRespuesta.reset();
    this.isNew = isNew;
    if (dataItem != null){
      this.formularioRespuestaTemp = dataItem;
      this.formFormularioRespuesta.patchValue(this.formularioRespuestaTemp);
    }

    this.modalRefFormularioRespuesta = this.modalService.open(this.modalFormularioRespuesta);
  }


      /**
      * Eventos Grid  editar , anadir,eliminar, refrescar
      * @autor Margiory Ramirez
      */
  gridEventsFormularioRespuesta(e: any, n:any, data:any, index:any): void {
    console.log(e);
    switch (e) {
      case 'edit':
        this.abrirModalFormularioRespuesta(n, data, index);
        break;
      case 'add':
        this.abrirModalFormularioRespuesta(n);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(data, index);
        break;

      case 'reload':
        this.ObtenerFormularioRespuesta();
        break;

    }
  }

  
}

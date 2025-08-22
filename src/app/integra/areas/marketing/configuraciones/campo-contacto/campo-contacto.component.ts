
import { GridCampoContacto } from './grid-campo-contacto';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { CampoContacto, CampoContactoEnvio } from '@integra/models/campo-contacto';
import { Parametro } from '@shared/models/parametro';
import Swal from 'sweetalert2';

const pipe = new DatePipe('en-US');
const formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente de grupo Campo Contacto.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 10/08/2022 Creacion de interfaces de Campo Contacto,
 * * 11/08/2022 Implementaccion de funciones logicas
 */

@Component({
  selector: 'app-campo-contacto',
  templateUrl: './campo-contacto.component.html',
  styleUrls: ['./campo-contacto.component.scss']
})
export class CampoContactoComponent implements OnInit {
  @ViewChild('modalCampoContacto') modalCampoContacto: any;

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
  successIcon: string = iconInputValidation;
  formCampoContacto: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    tipoControl: ['', Validators.required],
    procedimiento: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],


  });
/**
 * Variables
 */
  campoContactoTemp :any
  modalRefTCampoContacto: any;
  loaderGrid: boolean = false;
  loaderModal: boolean = false;
  isNew: boolean = false;
  listaCampoContacto: CampoContacto[] = [];
  gridCampoContacto = new GridCampoContacto()
/**
 * Funciones
 */
  ngOnInit(): void {
     this.ObtenerCampoContacto();
  }
/**
   * @description Funciones de validacion
   * @autor Margiory Ramirez
   * @param {string} controlName
   */
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formCampoContacto.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formCampoContacto.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese Nombre de Tipo Categoria Origen',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio' },
        tipoControl: { required: 'Ingrese una descripcion' },
        procedimiento:{
        required: 'Ingrese Nombre de Tipo Categoria Origen',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio'}
        //valoresPreEstablecidos: { required: 'Meta es obligatorio', min: 'El Valor de Meta no es valido' },
    };
    let formControl: FormControl = this.formCampoContacto.get(controlName) as FormControl;
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

  validCampoContacto(): boolean {
    if(this.formCampoContacto.invalid){
      this.formCampoContacto.markAllAsTouched();
      return false;
    }
    return true;
  }
/**
 * Crea un objeto de  envio  de  Campo Contacto
 * @param item
 * @param itemValue
 * @returns
 */
  setDataCampoContacto(item: CampoContacto, itemValue: CampoContactoEnvio): CampoContacto{
    if(itemValue != null){
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.tipoControl = itemValue.tipoControl;
      item.valoresPreEstablecidos = itemValue.valoresPreEstablecidos;
      item.procedimiento= itemValue.procedimiento;
      item.estado = itemValue.estado;
      item.usuarioCreacion = itemValue.usuarioCreacion;
      item.usuarioModificacion = itemValue.usuarioModificacion;
      item.fechaCreacion = itemValue.fechaCreacion;
      item.fechaModificacion = itemValue.fechaModificacion;
    }
    return item;
  }
  procesarDataCampoContacto(dataItem: CampoContacto, isNew: boolean): CampoContactoEnvio {
    let fechaActual = pipe.transform(new Date(), formatoFecha);
    let fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
    let fechaModificacion = fechaActual;

    let campoContactoEnvio: CampoContactoEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      tipoControl: dataItem.tipoControl,
      valoresPreEstablecidos: dataItem.valoresPreEstablecidos,
      procedimiento: dataItem.procedimiento,
      estado: true,
      fechaCreacion: fechaCreacion,
      fechaModificacion: fechaModificacion,
      usuarioCreacion: isNew ?this.usuario.userName : dataItem.usuarioCreacion,
      usuarioModificacion: this.usuario.userName,

    };
    return campoContactoEnvio;
  }
  /**
   * Obtiene data principal para llenado de Grilla
   * @autor Margiory Ramirez
   */
  ObtenerCampoContacto(){
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.CampoContactoObtenerCampoContacto)
      .subscribe({
        next: (response: HttpResponse<CampoContacto[]>) => {
          this.listaCampoContacto = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
        },
        complete: () => {},
      });
  }
/**
   * @description Inserta un nuevo objeto Campo Contacto
   * @autor Margiory Ramirez
   */
  crearCampoContacto() {
    if (this.validCampoContacto()) {
      // this.modalRefTCOrigen.close('submitted');
      this.loaderModal = true;
      let datosFormulario = this.formCampoContacto.getRawValue();


      let campoContacto: CampoContacto = Object.assign({}, datosFormulario);
      let campoContactoEnvio: CampoContactoEnvio;
      campoContactoEnvio = this.procesarDataCampoContacto(campoContacto, true);
      this.integraService
        .insertar(constApiMarketing.CampoContactoInsertar, campoContactoEnvio)
        .subscribe({
          next: (response: HttpResponse<CampoContactoEnvio>) => {
            campoContacto = this.setDataCampoContacto(campoContacto, response.body);
            this.listaCampoContacto.unshift(campoContacto);
            // this.listaGruposCategoriaOrigen = this.listaGruposCategoriaOrigen.slice();
            // this.listaGruposCategoriaOrigen.push(response.body); //insetar
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefTCampoContacto.close('submitted');
            this.mostrarMensajeExitoso();
            this.ObtenerCampoContacto();
          },
        });
    } else this.formCampoContacto.markAllAsTouched();
  }
/**
   * @description Actualiza un nuevo objeto Campo Contacto
   * @autor Margiory Ramirez
   */
  actualizarCampoContacto() {
    if (this.validCampoContacto()) {
     ;
      this.loaderModal = true;
      let campoContacto: CampoContacto = Object.assign(this.campoContactoTemp, this.formCampoContacto.getRawValue());

      let campoContactoEnvio: CampoContactoEnvio = this.procesarDataCampoContacto(
          campoContacto,
        false
      );
      this.integraService
        .actualizar(constApiMarketing.CampoContactoActualizar, campoContactoEnvio)
        .subscribe({
          next: (response: HttpResponse<CampoContactoEnvio>) => {
            this.campoContactoTemp = this.setDataCampoContacto(campoContacto, response.body);
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalRefTCampoContacto.close();
            this.mostrarMensajeExitoso();
            this.ObtenerCampoContacto();
          },
        });
    } else this.formCampoContacto.markAllAsTouched();
  }
/**
   * @description Elimina  el  objeto  de Campo Contacto  en la grilla principal por Id
   * @autor Margiory Ramirez
   */
  eliminarCampoContacto(dataItem: CampoContacto, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.CampoContactoEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if ((response.body == true)) {
            this.listaCampoContacto.splice(index, 1);
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
          this.ObtenerCampoContacto();
        }
        ,
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
        this.eliminarCampoContacto(data, index);
      }
    });
  }
/**
   * Despliega modal para registro de datos
   * @autor Margiory Ramirez
   */
  abrirModalCampoContacto(isNew: boolean, dataItem?: CampoContacto, index?: number) {
    this.loaderModal = false;
    this.formCampoContacto.reset();
    this.isNew = isNew;
    if (dataItem != null){
      this.campoContactoTemp = dataItem;
      this.formCampoContacto.patchValue(this.campoContactoTemp);
    }

    this.modalRefTCampoContacto = this.modalService.open(this.modalCampoContacto);
  }

  gridEventscampoContacto(e: any, n:any, data:any, index:any): void {
    console.log(e);
    switch (e) {
      case 'edit':
        this.abrirModalCampoContacto(n, data, index);
        break;
      case 'add':
        this.abrirModalCampoContacto(n);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(data, index);
        break;

      case 'reload':
        this.ObtenerCampoContacto();
        break;

    }
  }


}


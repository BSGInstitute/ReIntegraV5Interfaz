
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProveedorCampaniaIntegra, ProveedorCampaniaIntegraEnvio } from '@integra/models/proveedor-campania-integra';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { GridProveedorCamapaniaIntegra } from './grid-proveedor-campania-integra';
import { TextValidator } from '@shared/validators/text.validator';
import { constApiMarketing } from '@environments/constApi';
import { Parametro } from '@shared/models/parametro';


const pipe = new DatePipe('en-US');
const formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';

/**
 * @module MarketingModule
 * @description Componente de  Proveedor Campania .
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 27/08/2022 Creacion de interfaces de Proveedor Campania Integra  ,
 * * 29/08/2022 Implementaccion de funciones logicas
 */

@Component({
  selector: 'app-proveedor-campania-integra',
  templateUrl: './proveedor-campania-integra.component.html',
  styleUrls: ['./proveedor-campania-integra.component.scss']
})
export class ProveedorCampaniaIntegraComponent implements OnInit {
  @ViewChild('modalProveedorCampaniaIntegra') modalProveedorCampaniaIntegra: any;

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
   * */
  successIcon: string = iconInputValidation;
  formProveedorCampaniaIntegra: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ],
    porDefecto:[true],

  });
  proveedorcampaniaIntegraTemp :any
  modalRefTCOrigen: any;
  loaderGrid: boolean = false;
  loaderModal: boolean = false;
  isNew: boolean = false;
  listaProveedorCamapaniaIntegra: ProveedorCampaniaIntegra[] = [];
  gridProveedorCamapaniaIntegra = new GridProveedorCamapaniaIntegra();

/**
   * Acciones
   * */
  ngOnInit(): void {
    this.obtenerProveedorCampaniaIntegra();
  }
/**
   * @description Funciones de validacion
   * @autor Margiory Ramirez
   * @param {string} controlName
   */
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formProveedorCampaniaIntegra.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formProveedorCampaniaIntegra.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese Nombre ',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio' },
    };
    let formControl: FormControl = this.formProveedorCampaniaIntegra.get(controlName) as FormControl;
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
  validFormProveedorcampaniaIntegra(): boolean {
    if(this.formProveedorCampaniaIntegra.invalid){
      this.formProveedorCampaniaIntegra.markAllAsTouched();
      return false;
    }
    return true;
  }
/**
   * Crea un objeto de  envio  Proveedor Campania Integra
   * @autor Margiory Ramirez
   */
  setDataProveedorCampaniaIntegra(item:ProveedorCampaniaIntegra, itemValue: ProveedorCampaniaIntegraEnvio): ProveedorCampaniaIntegra{
    if(itemValue != null){
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.estado = itemValue.estado;
      item.usuarioCreacion = itemValue.usuarioCreacion;
      item.usuarioModificacion = itemValue.usuarioModificacion;
      item.fechaCreacion = itemValue.fechaCreacion;
      item.fechaModificacion = itemValue.fechaModificacion;
      item.porDefecto =itemValue.porDefecto;
    }
    return item;
  }
  procesarProveedorCampaniaIntegra(dataItem: ProveedorCampaniaIntegra, isNew: boolean): ProveedorCampaniaIntegraEnvio {
    let fechaActual = pipe.transform(new Date(), formatoFecha);
    let fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
    let fechaModificacion = fechaActual;

    let proveedorCampaniaIntegraEnvio: ProveedorCampaniaIntegraEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      estado: dataItem.estado,
      fechaCreacion: fechaCreacion,
      fechaModificacion: fechaModificacion,
      usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
      usuarioModificacion: this.usuario.userName,
      porDefecto: dataItem.porDefecto
    };
    return proveedorCampaniaIntegraEnvio;

  }
/**
   * Obtiene data  proveedor  campania integra para la grilla principal
   * @autor Margiory Ramirez
   */
  obtenerProveedorCampaniaIntegra(){
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.ProveedorCampaniaIntegraObtenerProveedorCampaniaIntegra)
      .subscribe({
        next: (response: HttpResponse<ProveedorCampaniaIntegra[]>) => {
          this.listaProveedorCamapaniaIntegra = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });

  }
  /**
   * @description Inserta un nuevo Registro para campania Integra
   * @autor Margiory Ramirez
   */
  crearProveedorCampaniaIntegra() {
    if (this.validFormProveedorcampaniaIntegra()) {
      this.loaderModal = true;
      let datosFormulario = this.formProveedorCampaniaIntegra.getRawValue();
      var proveedorCampaniaIntegra: ProveedorCampaniaIntegra = Object.assign({}, datosFormulario);
      let proveedorCampaniaIntegraEnvio: ProveedorCampaniaIntegraEnvio;
      proveedorCampaniaIntegraEnvio = this.procesarProveedorCampaniaIntegra(proveedorCampaniaIntegra, true);
      this.integraService
        .insertar(constApiMarketing.ProveedorCampaniaIntegraInsertar, proveedorCampaniaIntegraEnvio)
        .subscribe({
          next: (response: HttpResponse<ProveedorCampaniaIntegraEnvio>) => {
            proveedorCampaniaIntegra = this.setDataProveedorCampaniaIntegra(proveedorCampaniaIntegra, response.body);
            this.listaProveedorCamapaniaIntegra.unshift(proveedorCampaniaIntegra);
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefTCOrigen.close('submitted');
            this.mostrarMensajeExitoso();
            this.obtenerProveedorCampaniaIntegra();
          },
        });
    } else this.formProveedorCampaniaIntegra.markAllAsTouched();
  }
/**
   * @description Inserta un nuevo Registro para campania Integra
   * @autor Margiory Ramirez
   */
  actualizarProveedorCampaniaIntegra() {
    if (this.validFormProveedorcampaniaIntegra()) {
     ;
      this.loaderModal = true;
      let proveedorCampaniaIntegra: ProveedorCampaniaIntegra = Object.assign(this.proveedorcampaniaIntegraTemp, this.formProveedorCampaniaIntegra.getRawValue());

      let proveedorCampaniaIntegraEnvio:ProveedorCampaniaIntegraEnvio = this.procesarProveedorCampaniaIntegra(proveedorCampaniaIntegra, false
      );
      this.integraService
        .actualizar(constApiMarketing.ProveedorCampaniaIntegraActualizar, proveedorCampaniaIntegraEnvio)
        .subscribe({
          next: (response: HttpResponse<ProveedorCampaniaIntegraEnvio>) => {
            this.proveedorcampaniaIntegraTemp = this.setDataProveedorCampaniaIntegra(proveedorCampaniaIntegra, response.body);
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalRefTCOrigen.close();
            this.mostrarMensajeExitoso();
            this.obtenerProveedorCampaniaIntegra();
          },
        });
    } else this.formProveedorCampaniaIntegra.markAllAsTouched();
  }

/**
   * @description Elimina  el  objeto  de Proveedor Campania en la grilla principal por Id
   * @autor Margiory Ramirez
   */
  eliminarProveedorCampaniaIntegra(dataItem: ProveedorCampaniaIntegra, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.ProveedorCampaniaIntegraEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if ((response.body == true)) {
            this.listaProveedorCamapaniaIntegra.splice(index, 1);
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
          this.obtenerProveedorCampaniaIntegra();
        },
        complete: () => {
          this.obtenerProveedorCampaniaIntegra();
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

  mostrarMensajeEliminar(data: any, index: any) {
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
        this.eliminarProveedorCampaniaIntegra(data, index);
      }
    });
  }
  /**
   * Despliega modal para la cargar  datos
   * @autor Margiory Ramirez
   */
  abrirModalProveedorCampaniaIntegra(isNew: boolean, dataItem?: ProveedorCampaniaIntegra, index?: number) {
    this.loaderModal = false;
    this.formProveedorCampaniaIntegra.reset()
    this.formProveedorCampaniaIntegra.get('porDefecto').setValue(true);
    this.isNew = isNew;
    if (dataItem != null){
      this.proveedorcampaniaIntegraTemp = dataItem;
      this.formProveedorCampaniaIntegra.patchValue(this.proveedorcampaniaIntegraTemp);
    }

    this.modalRefTCOrigen = this.modalService.open(this.modalProveedorCampaniaIntegra);
  }
    /**
  * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
  * @autor Margiory Ramirez
  */


  gridEventsProveedorCampaniaIntegra(e: any, n:any, data:any, index:any): void {
    console.log(e);
    switch (e) {
      case 'edit':
        this.abrirModalProveedorCampaniaIntegra(n, data, index);
        break;
      case 'add':
        this.abrirModalProveedorCampaniaIntegra(n);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(data, index);
        break;

      case 'reload':
        this.obtenerProveedorCampaniaIntegra();
        break;

    }

  }
}



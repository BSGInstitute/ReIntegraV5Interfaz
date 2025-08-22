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
import {
  TipoInteraccion,
  TipoInteraccionEnvio,
} from '@integra/models/tipo-interaccion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { GridTipoInteraccion } from './grid-tipo-interaccion';
import { Parametro } from '@shared/models/parametro';

const pipe = new DatePipe('en-US');
const formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';
  /**
 * @module MarketingModule
 * @description Componente de tipo Interaccion.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 10/08/2022 Creacion de interfaces de Tipo Interaccion  ,
 * * 11/08/2022 Implementaccion de funciones Logicas
 */
@Component({
  selector: 'app-tipo-interaccion',
  templateUrl: './tipo-interaccion.component.html',
  styleUrls: ['./tipo-interaccion.component.scss'],
})
export class TipoInteraccionComponent implements OnInit {
  @ViewChild('modalTipoInteraccion') modalTipoInteraccion: any;

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


  listaCanal: any[] = ['chat', 'correo', 'formulario', 'Interaccion', 'pagina'];
  //comboCanal:TipoInteraccion [] = [];

  successIcon: string = iconInputValidation;
  formTipoInteraccion: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    canal: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
  });

  /**
   * variables
   */
  tipoInteracciontemp: any;
  modalRefTTipoInteraccion: any;
  loaderGrid: boolean = false;
  loaderModal: boolean = false;
  isNew: boolean = false;
  listaTipoInteraccion: TipoInteraccion[] = [];
  gridTipoInteracccion = new GridTipoInteraccion();

/**
 * Acciones
 */

  ngOnInit(): void {
    this.obtenerTipoInteraccion();

  }

/**
   * @description Funciones de validacion
   * @autor Margiory Ramirez
   * @param {string} controlName
   */
  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formTipoInteraccion.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formTipoInteraccion.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese Nombre de Origen Tato',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      canal: {
        required: 'Ingrese Nombre de Origen Tato',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
    };
    let formControl: FormControl = this.formTipoInteraccion.get(
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

    return null;
  }

  validformTipoInteraccion(): boolean {
    if (this.formTipoInteraccion.invalid) {
      this.formTipoInteraccion.markAllAsTouched();
      return false;
    }
    return true;
  }
  setDataTipoInteraccion(
    item: TipoInteraccion,
    itemValue: TipoInteraccionEnvio
  ): TipoInteraccion {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.canal = itemValue.canal;
      item.estado = itemValue.estado;
      item.usuarioCreacion = itemValue.usuarioCreacion;
      item.usuarioModificacion = itemValue.usuarioModificacion;
      item.fechaModificacion = itemValue.fechaModificacion;
      item.fechaCreacion = itemValue.fechaCreacion;
    }
    return item;
  }
/**
 * Crea un objeto de envio de Tipo Interaccion
 * @param dataItem
 * @param isNew
 * @returns
 */

  procesarDataTipoInteraccion(
    dataItem: TipoInteraccion,
    isNew: boolean
  ): TipoInteraccionEnvio {
    let fechaActual = pipe.transform(new Date(), formatoFecha);
    let fechaCreacion = isNew
      ? fechaActual
      : pipe.transform(dataItem.fechaCreacion, formatoFecha);
    let fechaModificacion = fechaActual;

    let tipoInteraccionEnvio: TipoInteraccionEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      fechaCreacion: fechaCreacion,
      fechaModificacion: fechaModificacion,
      estado: true,
      canal: dataItem.canal,
      usuarioCreacion: isNew ? this.usuario.userName: dataItem.usuarioCreacion,
      usuarioModificacion: this.usuario.userName,
    };
    return tipoInteraccionEnvio;
  }
  obtenerTipoInteraccion() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.TipoInteraccionObtenerTipoInteraccion)
      .subscribe({
        next: (response: HttpResponse<TipoInteraccion[]>) => {
          this.listaTipoInteraccion = response.body;
          this.loaderGrid = false;
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
      allowOutsideClick: false,
    });
  }
/**
 * Inserta  data de tipo ieteraccion
 */
  crearTipoInteraccion() {
    if (this.validformTipoInteraccion()) {
      this.loaderModal = true;
      let datosFormulario = this.formTipoInteraccion.getRawValue();

      let tipoCaInteraccion: TipoInteraccion = Object.assign(
        {},
        datosFormulario
      );
      let tipoInteraccionEnvio: TipoInteraccionEnvio;
      tipoInteraccionEnvio = this.procesarDataTipoInteraccion(
        tipoCaInteraccion,
        true
      );
      this.integraService
        .insertar(
          constApiMarketing.TipoInteraccionInsertar,
          tipoInteraccionEnvio
        )
        .subscribe({
          next: (response: HttpResponse<TipoInteraccionEnvio>) => {
            tipoCaInteraccion = this.setDataTipoInteraccion(
              tipoCaInteraccion,
              response.body
            );
            this.listaTipoInteraccion.unshift(tipoCaInteraccion);
            // this.listaGruposCategoriaOrigen = this.listaGruposCategoriaOrigen.slice();
            // this.listaGruposCategoriaOrigen.push(response.body); //insetar
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefTTipoInteraccion.close('submitted');
            this.mostrarMensajeExitoso();
            this.obtenerTipoInteraccion();
          },
        });
    } else this.formTipoInteraccion.markAllAsTouched();
  }
/**
   * @description Actualiza el  objeto  de  tipo Interaccion
   * @autor Margiory Ramirez
   */
  actualizarTipoInteraccion() {
    if (this.validformTipoInteraccion()) {
      this.loaderModal = true;
      let tipoInteraccion: TipoInteraccion = Object.assign(
        this.tipoInteracciontemp,
        this.formTipoInteraccion.getRawValue()
      );

      let tipoInteraccionEnvio: TipoInteraccionEnvio =
        this.procesarDataTipoInteraccion(tipoInteraccion, false);

      this.integraService
        .actualizar(
          constApiMarketing.TipoInteraccionActualizar,
          tipoInteraccionEnvio
        )
        .subscribe({
          next: (response: HttpResponse<TipoInteraccionEnvio>) => {
            this.tipoInteracciontemp = this.setDataTipoInteraccion(
              tipoInteraccion,
              response.body
            );
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalRefTTipoInteraccion.close();
            this.mostrarMensajeExitoso();
            this.obtenerTipoInteraccion();
          },
        });
    } else this.formTipoInteraccion.markAllAsTouched();
  }
/**
 * @description Elimina data inersertada
 * @param dataItem
 * @param index
 * @autor Margiory Ramirez
 */
  eliminarTipoInteraccion(dataItem: TipoInteraccion, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName},
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.TipoInteraccionEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if (response.body == true) {
            this.listaTipoInteraccion.splice(index, 1);
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
          this.obtenerTipoInteraccion() 
        },
      });
  }

/**
   * Despliega de notificacion en validacion
   * @autor Margiory Ramirez
   */
  mostrarMensajeExitoso() {
    this.loaderGrid = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Guardado con exito',
    });
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
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarTipoInteraccion(data, index);
      }
    });
  }

  abrirModalTipoInteracciones(
    isNew: boolean,
    dataItem?: TipoInteraccion,
    index?: number
  ) {
    console.log(isNew)
    this.loaderModal = false;
    this.formTipoInteraccion.reset();
    this.isNew = isNew;
    if (dataItem != null) {
      this.tipoInteracciontemp = dataItem;
      this.formTipoInteraccion.patchValue(this.tipoInteracciontemp);
    }

    this.modalRefTTipoInteraccion = this.modalService.open(
      this.modalTipoInteraccion
    );
  }

  obtnerCanal() {
    this.listaTipoInteraccion;
  }
    /**
     * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
     * @autor Margiory Ramirez
     */
  gridEventsTipoInteraccion(e: any, n:any, data:any, index:any): void {
    console.log(e);
    switch (e) {
      case 'edit':
        this.abrirModalTipoInteracciones(n, data, index);
        break;
      case 'add':
        this.abrirModalTipoInteracciones(n);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(data, index);
        break;

      case 'reload':
        this.obtenerTipoInteraccion();
        break;

    }
  }
}

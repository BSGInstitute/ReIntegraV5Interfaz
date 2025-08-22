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
  ProcedenciaFormulario,
  ProcedenciaFormularioEnvio,
} from '@integra/models/procedencia-formulario';
import {
  ProcedenciaFormularioDetalle,
  ProcedenciaFormularioDetalleEnvio,
} from '@integra/models/procedencia-formulario-detalle';
import { TipoInteraccionCombo } from '@integra/models/tipo-interaccion';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { GridProcedenciaFormulario } from './grid-procedencia-formulario';

const pipe = new DatePipe('en-US');
const formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';

/**
 * @module MarketingModule
 * @description Componente de Pais.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 23/08/2022 Creacion de interfaces de procedencia formulario,
 * * 25/08/2022 Implementaccion de funciones logicas
 */
@Component({
  selector: 'app-procedencia-formulario',
  templateUrl: './procedencia-formulario.component.html',
  styleUrls: ['./procedencia-formulario.component.scss'],
})
export class ProcedenciaFormularioComponent implements OnInit {
  @ViewChild('modalProcedenciaFormulario') modalProcedenciaFormulario: any;
  @ViewChild('modalVerProcedenciaFormulario')
  modalVerProcedenciaFormulario: any;
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
  formProcedenciaFormulario: FormGroup = this.formBuilder.group({
    id: [0],
    tipoInteraccion: [''],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    descripcion: ['', Validators.required],
  });
  procedenciaFormularioTemp: ProcedenciaFormulario;
  listaProcedenciaFormulario: ProcedenciaFormulario[] = [];
  procedenciaFormularioDetalleTemp: ProcedenciaFormularioDetalle[];
  listaTipoInteraccion: TipoInteraccionCombo[] = [];

  modalRefProcedenciaFormulario: any;
  loaderGrid: boolean = false;
  loaderModal: boolean = false;
  isNew: boolean = false;
  gridProcedenciaFormulario = new GridProcedenciaFormulario();

  /**
   *  Acciones
   * */
  ngOnInit(): void {
    // this.formProcedenciaFormulario.get('nombre').disable();
    this.obtenerProcedenciaFormulario();
    this.integraService
      .obtenerTodo(constApiMarketing.TipoInteraccionObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<TipoInteraccionCombo[]>) => {
          this.listaTipoInteraccion = response.body;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  /**
   * @description Funciones de validacion
   * @autor Margiory Ramirez
   * @param {string} controlName
   */
  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formProcedenciaFormulario.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formProcedenciaFormulario.get(
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
        required: 'Ingrese Nombre de Tipo Categoria Origen',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      descripcion: { required: 'Ingrese una descripcion' },
    };
    let formControl: FormControl = this.formProcedenciaFormulario.get(
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

  validFormProcedenciaFormulario(): boolean {
    if (this.formProcedenciaFormulario.invalid) {
      this.formProcedenciaFormulario.markAllAsTouched();
      return false;
    }
    return true;
  }

  setValueProcedenciaFormulario(
    procedenciaFormulario: ProcedenciaFormulario,
    procedenciaFormularioEnvio: ProcedenciaFormularioEnvio
  ): ProcedenciaFormulario {
    if (procedenciaFormularioEnvio != null) {
      procedenciaFormulario.id = procedenciaFormularioEnvio.id;
      procedenciaFormulario.nombre = procedenciaFormularioEnvio.nombre;
      procedenciaFormulario.descripcion = procedenciaFormularioEnvio.descripcion;
      procedenciaFormulario.estado = procedenciaFormularioEnvio.estado;
      procedenciaFormulario.usuarioCreacion = procedenciaFormularioEnvio.usuarioCreacion;
      procedenciaFormulario.usuarioModificacion = procedenciaFormularioEnvio.usuarioModificacion;
      procedenciaFormulario.fechaCreacion = procedenciaFormularioEnvio.fechaCreacion;
      procedenciaFormulario.fechaModificacion = procedenciaFormularioEnvio.fechaModificacion;
    }
    return procedenciaFormulario;
  }
    /**
   * Crea un objeto de  envio TipoCategoriaOrigen
   * @autor Margiory Ramirez
   */
  procesarProcedenciaFormularioEnvio(
    dataItem: ProcedenciaFormulario,
    isNew: boolean
  ): ProcedenciaFormularioEnvio {
    let fechaActual = pipe.transform(new Date(), formatoFecha);
    let fechaCreacion = isNew
      ? fechaActual
      : pipe.transform(dataItem.fechaCreacion, formatoFecha);
    let fechaModificacion = fechaActual;

    let procedenciaFormularioEnvio: ProcedenciaFormularioEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      descripcion: dataItem.descripcion,
      fechaCreacion: fechaCreacion,
      fechaModificacion: fechaModificacion,
      estado: true,
      usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
      usuarioModificacion:this.usuario.userName,
    };
    return procedenciaFormularioEnvio;
  }
  procesarProcedenciaFormularioDetalleEnvio(
    ids: number[] = [],
    procedenciaFormulario: ProcedenciaFormularioEnvio
  ): ProcedenciaFormularioDetalleEnvio[] {
    let procedenciaFormularioDetalleEnvio: ProcedenciaFormularioDetalleEnvio[] = [];

    if (ids != null && ids.length > 0) {
      ids.forEach((idInteraccion: number) => {
        let index = -1;
        if (!this.isNew) {
          index = this.procedenciaFormularioDetalleTemp.findIndex(
            (e) => e.idTipoInteraccion == idInteraccion
          );
        }
        if (index == -1) {
          let detalle: ProcedenciaFormularioDetalleEnvio = {
            id: 0,
            idProcedenciaFormulario: procedenciaFormulario.id,
            idTipoInteraccion: idInteraccion,
            estado: true,
            usuarioCreacion: this.usuario.userName,
            usuarioModificacion: this.usuario.userName,
            fechaCreacion: procedenciaFormulario.fechaModificacion,
            fechaModificacion: procedenciaFormulario.fechaModificacion,
          };
          procedenciaFormularioDetalleEnvio.push(detalle);
        }
      });
    }

    return procedenciaFormularioDetalleEnvio;
  }

/**
   * Obtiene data  grupo procedencia formulario el llenado de  grilla princial
   * @autor Margiory Ramirez
   */
  obtenerProcedenciaFormulario() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(
        constApiMarketing.ProcedenciaFormularioObtenerProcedenciaFormulario
      )
      .subscribe({
        next: (response: HttpResponse<ProcedenciaFormulario[]>) => {
          this.listaProcedenciaFormulario = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  /**
   * Obtiene  data tipo Interacion con idProcedenciaFormulario
   * @autor Margiory Ramirez
   */
  obtenerTipoInteraccion(idProcedenciaFormulario: number) {
    this.integraService
      .obtenerPorPathParams(
        constApiMarketing.ObtenerProcedenciaFormularioDetallePorIdProcedenciaFormulario,
        [{ clave: 'idProcedenciaFormulario', valor: idProcedenciaFormulario }]
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          // this.listaProcedenciaFormularioDetalle = response.body;
          let idInteraccion: any[] = [];
          response.body.forEach((element) => {
            idInteraccion.push(Number(element.idTipoInteraccion));
          });
          this.procedenciaFormularioDetalleTemp = response.body;
          this.formProcedenciaFormulario
            .get('tipoInteraccion')
            .setValue(idInteraccion);

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
  crearProcedenciaFormulario() {
    if (this.validFormProcedenciaFormulario()) {
      this.loaderModal = true;
      let datosFormulario = this.formProcedenciaFormulario.getRawValue();

      let procedenciaFormulario: ProcedenciaFormulario = {
        nombre: datosFormulario.nombre,
        descripcion: datosFormulario.descripcion,
      }
      let procedenciaFormularioEnvio: ProcedenciaFormularioEnvio;
      procedenciaFormularioEnvio = this.procesarProcedenciaFormularioEnvio(
        procedenciaFormulario,
        true
      );
      let procedenciaFormularioDetalleEnvio: ProcedenciaFormularioDetalleEnvio[] =
        this.procesarProcedenciaFormularioDetalleEnvio(
          datosFormulario.tipoInteraccion,
          procedenciaFormularioEnvio
      );

      this.integraService
        .insertar(
          constApiMarketing.ProcedenciaFormularioInsertar,
          procedenciaFormularioEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            procedenciaFormulario = this.setValueProcedenciaFormulario(
              procedenciaFormulario,
              response.body
            );
            this.loaderModal = false;
            procedenciaFormularioDetalleEnvio.forEach((element) => {
              element.idProcedenciaFormulario = response.body.id;
            });

            this.integraService
              .insertarLista(
                constApiMarketing.ProcedenciaFormularioDetalleInsertarLista,
                procedenciaFormularioDetalleEnvio
              )
              .subscribe({
                next: (response: HttpResponse<any>) => {
                  console.log(response.body);
                },
                error: (error) => {
                  this.loaderModal = false;
                  this.mostrarMensajeError(error);
                },
                complete: () => {
                  this.loaderModal = false;
                  this.modalRefProcedenciaFormulario.close();
                  this.mostrarMensajeExitoso();
                },
              });

            this.listaProcedenciaFormulario.unshift(procedenciaFormulario);
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefProcedenciaFormulario.close('submitted');
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formProcedenciaFormulario.markAllAsTouched();
  }
/**
   * @description Actualiza el  objeto   de Procedentcia Formulario
   * @autor Margiory Ramirez
   */
  actualizarProcedenciaFormulario() {
    if (this.validFormProcedenciaFormulario()) {
      let datosFormulario = this.formProcedenciaFormulario.getRawValue();
      this.procedenciaFormularioTemp.nombre = datosFormulario.nombre;
      this.procedenciaFormularioTemp.descripcion = datosFormulario.descripcion;

      let procedenciaFormularioEnvio: ProcedenciaFormularioEnvio =
        this.procesarProcedenciaFormularioEnvio(
          this.procedenciaFormularioTemp,
          false
        );
      let procedenciaFormularioDetalleEnvio: ProcedenciaFormularioDetalleEnvio[] =
        this.procesarProcedenciaFormularioDetalleEnvio(
          datosFormulario.tipoInteraccion,
          procedenciaFormularioEnvio
        );

      let idInteraccionEliminado: any[] = [];
      this.procedenciaFormularioDetalleTemp.forEach((element) => {
        let index = datosFormulario.tipoInteraccion.findIndex(
          (e: number) => e == element.idTipoInteraccion
        );
        if (index == -1) {
          idInteraccionEliminado.push(element.id);
        }
      });

      this.integraService
        .actualizar(
          constApiMarketing.ProcedenciaFormularioActualizar,
          procedenciaFormularioEnvio
        )
        .subscribe({
          next: (response: HttpResponse<ProcedenciaFormularioEnvio>) => {
            console.log(response.body)
            this.integraService
              .insertarLista(
                constApiMarketing.ProcedenciaFormularioDetalleInsertarLista,
                procedenciaFormularioDetalleEnvio
              )
              .subscribe({
                next: (response2: HttpResponse<any>) => {

                  this.integraService
                    .eliminarListadoPorPathParams(
                      constApiMarketing.ProcedenciaFormularioDetalleElimarninarListado,
                      [{ clave: 'usuario', valor: this.usuario.userName }],
                      idInteraccionEliminado
                    )
                    .subscribe({
                      next: (
                        response3: HttpResponse<ProcedenciaFormularioEnvio>
                      ) => {
                        // this.mostrarMensajeExitoso();
                      },
                      error: (error) => {
                        this.loaderModal = false;
                        // this.mostrarMensajeError(error);
                      },
                      complete: () => {
                        this.loaderModal = false;
                      },
                    });
                },
                error: (error) => {
                  this.loaderModal = false;
                  this.mostrarMensajeError(error);
                },
                complete: () => {
                  this.loaderModal = false;
                  this.modalRefProcedenciaFormulario.close();

                },
              });
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalRefProcedenciaFormulario.close();
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formProcedenciaFormulario.markAllAsTouched();
  }
/**
   * @description Elimina el  objeto   de Procedentcia Formulario de grilla pruncipal.
   * @autor Margiory Ramirez
   */
  eliminarProcedenciaFormulario(
    dataItem: ProcedenciaFormulario,
    index: number
  ) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor:this.usuario.userName},
    ];
    this.integraService
      .eliminarPorPathParams(
        constApiMarketing.ProcedenciaFormularioEliminar,
        params
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if (response.body == true) {
            this.listaProcedenciaFormulario.splice(index, 1);
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
      allowOutsideClick: false,
    });
  }

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
      timer: 5000,
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

  mostrarMensajeEliminar(param: any) {
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
        this.eliminarProcedenciaFormulario(param.dataItem, param.index);
      }
    });
  }
/**
   * Despliega modal para registro de datos
   * @autor Margiory Ramirez
   */
  abrirModalFormularioProcedencia(
    isNew: boolean,
    dataItem?: ProcedenciaFormulario,
    index?: number
  ) {
    this.loaderModal = false;
    this.formProcedenciaFormulario.reset();
    this.isNew = isNew;
    if (dataItem != null && isNew == false) {
      this.procedenciaFormularioTemp = dataItem;
      this.formProcedenciaFormulario.patchValue(this.procedenciaFormularioTemp);
      this.obtenerTipoInteraccion(dataItem.id);
    }
    this.modalRefProcedenciaFormulario = this.modalService.open(
      this.modalProcedenciaFormulario
    );
  }

  abrirModalVerDatos(data: any) {
    this.procedenciaFormularioTemp = data;
    this.modalService.open(this.modalVerProcedenciaFormulario);
  }

/**
   * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
   * @autor Margiory Ramirez
   */
  gridEventsProcedenciaFormulario(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'edit':
        this.abrirModalFormularioProcedencia(false, e.dataItem, e.index);
        break;
      case 'add':
        this.abrirModalFormularioProcedencia(true, e);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(e);
        break;
      case 'ver':
        this.abrirModalVerDatos(e.dataItem);
        break;
      case 'reload':
        this.obtenerProcedenciaFormulario();
        break;
      case 'verTipoInteraccion':
        this.obtenerTipoInteraccion(e.dataItem.id);
        break;
    }
  }
}

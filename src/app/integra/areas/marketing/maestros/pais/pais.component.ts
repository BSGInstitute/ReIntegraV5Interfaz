import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { constApiGlobal } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { PaisEnvio, Pais } from '@integra/models/pais';
import Swal from 'sweetalert2';
import { Parametro } from '@shared/models/parametro';
import { GridPais } from './grid-pais';

const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-pais',
  templateUrl: './pais.component.html',
  styleUrls: ['./pais.component.scss'],
})
export class PaisComponent implements OnInit {
  @ViewChild('modalPaises') modalPaises: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  successIcon: string = iconInputValidation;
  formPais: FormGroup = this.formBuilder.group({
    id: [0],
    codigoPais: ['', [Validators.required, Validators.min(1)]],
    codigoIso: ['', Validators.required],
    nombrePais: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    moneda: ['', Validators.required],
    zonaHoraria: ['', [Validators.required, Validators.min(1)]],
    estadoPublicacion: ['', [Validators.required, Validators.min(1)]],
    fileBandera: null,
    fileIcono: null,
  });

  paisTem: any;
  modalRefTCOrigen: any;
  loaderGrid: boolean = false;
  loaderModal: boolean = false;
  isNew: boolean = false;
  listaPais: Pais[] = [];
  gridPais = new GridPais();
  paisIcono: string =
    'https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg';
  showFileBandera: boolean = false;
  showFileIcono: boolean = false;
  showNameBandera: boolean = false;
  showNameIcono: boolean = false;
  //Acciones

  ngOnInit(): void {
    this.obtenerPais();
  }

  /**
   * @description Funciones de validacion
   * @autor Margiory Ramirez
   * @param {string} controlName
   */

  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formPais.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formPais.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      codigoPais: {
        required: 'Codigo Pais es obligatorio',
        min: 'El Valor de Codigo no es valido',
      },
      codigoIso: { required: 'Ingrese Codigo Iso' },
      nombrePais: {
        required: 'Ingrese Nombre de Pais',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      moneda: { required: 'Ingrese Moneda' },
      zonaHoraria: {
        required: 'Zona Horaria es obligatorio',
        min: 'El Valor de Zona Horaria no es valido',
      },
      estadoPublicacion: {
        required: 'Estado Publicacion es obligatorio',
        min: 'El Valor de Estado Publicacion no es valido',
      },
    };
    let formControl: FormControl = this.formPais.get(
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
  validFormPais(): boolean {
    if (this.formPais.invalid) {
      this.formPais.markAllAsTouched();
      return false;
    }
    return true;
  }
  /**
   * Obtiene lista general  de pais en la grilla principal
   * @autor Margiory Ramirez
   */
  obtenerPais() {
    this.loaderGrid = true;
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPais).subscribe({
      next: (response: HttpResponse<Pais[]>) => {
        this.listaPais = response.body;
        this.loaderGrid = false;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  registrarCambiosPais(isNew: boolean) {
    if (this.validFormPais()) {
      this.loaderModal = true;
      let datosFormulario = this.formPais.getRawValue();

      this.integraService
        .obtener(constApiGlobal.PaisObtenerRutaUrlBlockStoragePais)
        .subscribe({
          next: (
            response: HttpResponse<{
              rutaBandera: { rutaCompleta: string; rutaBlob: string };
              rutaIcono: { rutaCompleta: string; rutaBlob: string };
            }>
          ) => {

            let rutaBanderaCompleta: string =
              response.body.rutaBandera.rutaCompleta;
            let rutaBanderaBlob: string = response.body.rutaBandera.rutaBlob;
            let rutaIconoCompleta: string =
              response.body.rutaIcono.rutaCompleta;
            let rutaIconoBlob: string = response.body.rutaIcono.rutaBlob;

            let formData: FormData = new FormData();
            formData.append('id', isNew ? 0 : datosFormulario.id);
            formData.append('codigoPais', datosFormulario.codigoPais);
            formData.append('codigoIso', datosFormulario.codigoIso);
            formData.append('nombrePais', datosFormulario.nombrePais);
            formData.append('moneda', datosFormulario.moneda);
            formData.append('zonaHoraria', datosFormulario.zonaHoraria);
            formData.append(
              'estadoPublicacion',
              datosFormulario.estadoPublicacion
            );
            formData.append('RutaCompletaBandera', rutaBanderaCompleta);
            formData.append('RutaBlobBandera', rutaBanderaBlob);
            formData.append('RutaCompletaIcono', rutaIconoCompleta);
            formData.append('RutaBlobIcono', rutaIconoBlob);
            if (
              datosFormulario.fileBandera != null &&
              datosFormulario.fileBandera.length > 0
            )
              formData.append('Bandera', <File>datosFormulario.fileBandera[0]);
            if (
              datosFormulario.fileIcono != null &&
              datosFormulario.fileIcono.length > 0
            )
              formData.append('Icono', <File>datosFormulario.fileIcono[0]);

            this.integraService
              .insertarFormData2(constApiGlobal.PaisRegistrarPais, formData)
              .subscribe({
                next: (response: Pais) => {
                  console.log(response);
                  if (isNew) {
                    this.listaPais.unshift(response);
                  } else {
                    this.paisTem = response;
                  }
                  this.obtenerPais();
                  this.loaderModal = false;
                },
                error: (error) => {
                  this.loaderModal = false;
                  this.mostrarMensajeError(error);
                  console.log(error);
                },
                complete: () => {
                  this.modalRefTCOrigen.close('submitted');
                  this.mostrarMensajeExitoso();
                  this.obtenerPais();
                },
              });
          },
        });
    } else this.formPais.markAllAsTouched();
  }

  toggleFileBandera() {
    this.showFileBandera = !this.showFileBandera;
    if (!this.showFileBandera) {
      this.formPais.get('fileBandera').setValue(null);
    }
  }

  toggleFileIcono() {
    this.showFileIcono = !this.showFileIcono;
    if (!this.showFileIcono) {
      this.formPais.get('fileIcono').setValue(null);
    }
  }
  /**
   * @description Elimina  el  objeto  de Pais en la grilla principal por Id
   * @autor Margiory Ramirez
   */
  eliminarPais(dataItem: Pais, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [{ clave: 'id', valor: dataItem.id }];

    this.integraService
      .eliminarPorPathParams(constApiGlobal.PaisEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if (response.body == true) {
            this.listaPais.splice(index, 1);

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
          this.obtenerPais();
        },
      });
  }

  /**
   * Proceso insercion de ruta en el repositorio  para guardar la ruta url
   * @autor Margiory Ramirez
   */
  guardaRutaBandera() {
    let rutaBandera: string = '';
    console.log(this.formPais.getRawValue());
    let dataFormulario = this.formPais.getRawValue();
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPais).subscribe({
      next: (response: any) => {
        console.log(response.body);
        rutaBandera = response.body[0].rutaBandera.replace(/%20/g, ' ');
        rutaBandera =
          'https://repositorioweb.blob.core.windows.net/repositorioweb/flags/';
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
      timer: 2000,
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

  mostrarMensajeEliminar(data: any, index: any) {
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
        this.eliminarPais(data, index);
      }
    });
  }
  /**
   * Obtiene la plantilla delo formulario Pais  cuando es nuevo
   * @autor Margiory Ramirez
   */
  abrirModalPais(isNew: boolean, dataItem?: Pais, index?: number) {
    this.loaderModal = false;
    this.formPais.reset();
    this.isNew = isNew;
    if (!this.isNew) {
      this.paisTem = dataItem;
      this.showNameBandera = true;
      this.showNameIcono = true;
      this.showFileBandera = false;
      this.showFileIcono = false;
      this.formPais.patchValue(this.paisTem);
    } else {
      this.showNameBandera = false;
      this.showNameIcono = false;
      this.showFileBandera = true;
      this.showFileIcono = true;
    }

    this.modalRefTCOrigen = this.modalService.open(this.modalPaises);
  }

  extraerNombreArchivoUrl(url: string, tipo: string) {
    if (url != null) {
      let index = url.lastIndexOf('/') + 1;
      return url.substring(index);
    } else {
      if (tipo == 'bandera') {
        this.showNameBandera = false;
        this.showFileBandera = true;
      } else if (tipo == 'icono') {
        this.showFileIcono = true;
        this.showNameIcono = false;
      }
      return '';
    }
  }
  setDataPais(item: Pais, itemValue: PaisEnvio): Pais {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.codigoPais = item.codigoPais;
      item.codigoIso = item.codigoIso;
      item.nombrePais = item.nombrePais;
      item.moneda = item.moneda;
      item.zonaHoraria = item.zonaHoraria;
      item.estadoPublicacion = item.estadoPublicacion;
      item.rutaBandera = itemValue.rutaBandera;
    }
    return item;
  }
  procesarDataPais(dataItem: Pais, isNew: boolean): PaisEnvio {
    let paisEnvio: PaisEnvio = {
      id: isNew ? 0 : dataItem.id,
      codigoPais: dataItem.codigoPais,
      codigoIso: dataItem.codigoIso,
      nombrePais: dataItem.nombrePais,
      moneda: dataItem.moneda,
      zonaHoraria: dataItem.zonaHoraria,
      estadoPublicacion: dataItem.estadoPublicacion,
      rutaBandera: dataItem.rutaBandera,
    };
    return paisEnvio;
  }
  /**
   * Procesa las operaciones de insertar , agregar,editar,eliminar,refrescar
   * @autor Margiory Ramirez
   */
  gridEventsPais(e: any, n: any, data: any, index: any): void {
    console.log(e);
    switch (e) {
      case 'edit':
        this.abrirModalPais(n, data, index);
        break;
      case 'add':
        this.abrirModalPais(n);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(data, index);
        break;

      case 'reload':
        this.obtenerPais();
        break;
    }
  }
}

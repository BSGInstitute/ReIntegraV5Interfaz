import { DatePipe } from '@angular/common';
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

import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import {
  constApiMarketing,
} from '@environments/constApi';
import { Parametro } from '@shared/models/parametro';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { FuentesCrear, FuentesEnvio, SubirFuentes } from '@integra/models/subir-fuentes';
const iconInputValidation: string ='k-input-validation-icon k-icon k-i-check text-valid-success';


@Component({
  selector: 'app-subir-fuentes',
  templateUrl: './subir-fuentes.component.html',
  styleUrls: ['./subir-fuentes.component.scss']
})
export class SubirFuentesComponent implements OnInit {

  @ViewChild('modalFuentes') modalFuentes: any;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}

  /*variables */
  listaFuente: [] = []
  SubirFuentes: SubirFuentes[] = [];
  loaderModal: boolean = true; //MODAL SPINNER
  successIcon: string = iconInputValidation; 
  gridFuentes: KendoGrid = new KendoGrid();
  modalRef: any;
  isNew: boolean = false;

  formFuentes: FormGroup = this.formBuilder.group({
    id: [0],
    nombreArchivo: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    url: [],


  });

  /*form*/

  ngOnInit(): void {
    this.cargarGrilla()
    this.obtenerFuente() ;
  }

  cargarGrilla(){
    this.gridFuentes.filterable = 'menu'
    this.gridFuentes.gridState = {
      skip: 0,
      take: 20,
      sort: [],
    }
    this.gridFuentes.resizable = true
    this.gridFuentes.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom'
    }
  }
  
  public onFilter(input: Event): void {
    const inputValue = (input.target as HTMLInputElement).value;
    this.dataBinding.skip = 0;
  }

  /*Obtener*/

  obtenerFuente() {
    this.gridFuentes.loading = true;
    this.integraService
      .obtenerTodo(constApiMarketing.FuentesPortalWebObtener)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.gridFuentes.data = response.body;
          this.gridFuentes.loading = false;
          this.listaFuente = response.body;
          this.SubirFuentes = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }


  /*Datos*/

  setDataFuentes(item: SubirFuentes, itemValue: FuentesEnvio): SubirFuentes {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombreArchivo = itemValue.nombreArchivo;
      item.url = itemValue.url;
    }
    return item;
  }

  procesarDataFuente(dataItem: SubirFuentes, isNew: boolean): FuentesEnvio {
    let fuenteEnvio: any = {
      id: isNew ? 0 : dataItem.id,
      nombreArchivo: dataItem.nombreArchivo,
      url: dataItem.url,

    };
    return fuenteEnvio;
  }

  procesarData2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let fuenteEnvio: FuentesEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombreArchivo: dataItem.nombreArchivo,
      url: dataItem.url,
      usuario: this.usuario.userName,
    };
    return fuenteEnvio;
  }

  validformFuentes(): boolean {
    if (this.formFuentes.invalid) {
      this.formFuentes.markAllAsTouched();
      return false;
    }
    return true;
  }



  /*Funciones*/

  crearFuente() {
    if (this.validformFuentes()) {
      this.loaderModal = true;
      let dataformFuentes = this.formFuentes.getRawValue();
      let fuenteEnvio: FuentesEnvio = this.procesarData2(dataformFuentes, true);
      console.log(fuenteEnvio);

      this.integraService
        .insertar(constApiMarketing.FuentesPortalWebInsertar, fuenteEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
            let datosFuente = this.formFuentes.getRawValue();
            let fuenteEnvio: SubirFuentes;
            fuenteEnvio = this.procesarDataFuente(datosFuente, true);
            let fuente :SubirFuentes
            fuente= this.setDataFuentes(fuenteEnvio, response.body);

            let respuesta: FuentesCrear = {
              id: response.body.id,
              nombreArchivo: response.body.nombreArchivo,
              url: response.body.url,
            };

            this.obtenerFuente();
          },

          
          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
          },
        });
    } else this.formFuentes.markAllAsTouched();
  }

  actualizarFuente() {
    if (this.validformFuentes()) {
      this.loaderModal = true;

      let dataformFuentes = this.formFuentes.getRawValue();

      let fuenteEnvio: FuentesEnvio = this.procesarData2(dataformFuentes, false);
      console.log(fuenteEnvio);

      this.integraService
        .actualizar(constApiMarketing.FuentesPortalWebActualizar, fuenteEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {

            let fuente: SubirFuentes = Object.assign(this.gridFuentes.dataItemEditTemp, {
              id: response.body.id,
              nombreArchivo: response.body.nombreArchivo,
              url: response.body.url,
            });
            this.gridFuentes.dataItemEditTemp = this.setDataFuentes(fuente, response.body);
            this.obtenerFuente();
            console.log(response.body)
          },
          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
          },
        });
    } else this.formFuentes.markAllAsTouched();
  }

  usuario = JSON.parse(localStorage.getItem('userData'))

  eliminarFuente(dataItem: any, index: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridFuentes.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiMarketing.FuentesPortalWebEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.gridFuentes.loading = false;
          if (response.body == true) {
            // this.listaFuente.splice(index, 1);
            this.gridFuentes.data.splice(index, 1);
            this.gridFuentes.loading = false;
            this.obtenerFuente();
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
          this.gridFuentes.loading = false;
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.gridFuentes.loading = false;
        },
      });
      }
    });
  }

  reloadFuente() {
    this.obtenerFuente();
  }



  getErrorMessage(controlName: string): string {
    let erroMsj: any = {

      nombreArchivo: {
        required: 'Ingrese el nombre del Archivo',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      url: { },

    };


    let formControl: FormControl = this.formFuentes.get(
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

  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formFuentes.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formFuentes.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }


    /*Modales*/
  
    abrirmodalFuentes(
      isNew: boolean,
      dataItem?: SubirFuentes,
      index?: number
    ) {
      console.log(dataItem);
      this.loaderModal = false;
      this.formFuentes.reset();
      // this.tipoInteraccionPorFormulario = [];
      this.isNew = isNew;
      if (dataItem != null) {
        this.gridFuentes.dataItemEditTemp = dataItem;
        this.formFuentes.patchValue(this.gridFuentes.dataItemEditTemp);
      
        // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
      }
      this.modalRef = this.modalService.open(this.modalFuentes);
      console.log(this.listaFuente)
   }


}

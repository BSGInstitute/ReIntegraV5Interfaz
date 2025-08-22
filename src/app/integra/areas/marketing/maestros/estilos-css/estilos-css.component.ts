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
import { EstilosCss, EstilosCssCrear, EstilosCssEnvio } from '@integra/models/estilos-css';
const iconInputValidation: string ='k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-estilos-css',
  templateUrl: './estilos-css.component.html',
  styleUrls: ['./estilos-css.component.scss']
})
export class EstilosCssComponent implements OnInit {

  @ViewChild('modalEstilosCss') modalEstilosCss: any;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}

  /*variables */
  listaEstilosCss: [] = []
  EstilosCss: EstilosCss[] = [];
  loaderModal: boolean = true; //MODAL SPINNER
  successIcon: string = iconInputValidation; 
  gridEstilosCss: KendoGrid = new KendoGrid();
  modalRef: any;
  isNew: boolean = false;

  formEstilosCss: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    codigoCss: [ Validators.required,],
    nombreTipo: [ Validators.required,],

  });

  /*form*/

  ngOnInit(): void {
    this.cargarGrilla()
    this.obtenerEstilosCss() ;
  }

  cargarGrilla(){
    this.gridEstilosCss.filterable = 'menu'
    this.gridEstilosCss.gridState = {
      skip: 0,
      take: 20,
      sort: [],
    }
    this.gridEstilosCss.resizable = true
    this.gridEstilosCss.pageable = {
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

  obtenerEstilosCss() {
    this.gridEstilosCss.loading = true;
    this.integraService
      .obtenerTodo(constApiMarketing.EstilosCssObtener)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.gridEstilosCss.data = response.body;
          this.gridEstilosCss.loading = false;
          this.listaEstilosCss = response.body;
          this.EstilosCss = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }


  /*Datos*/

  setDataEstilosCss(item: EstilosCss, itemValue: EstilosCssEnvio): EstilosCss {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.codigoCss = itemValue.codigoCss;
      item.nombreTipo = itemValue.nombreTipo;
    }
    return item;
  }

  procesarDataEstilosCss(dataItem: EstilosCss, isNew: boolean): EstilosCssEnvio {
    let EstilosCssEnvio: any = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      codigoCss: dataItem.codigoCss,
      nombreTipo: dataItem.nombreTipo,
    };
    return EstilosCssEnvio;
  }

  procesarData2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let EstilosCssEnvio: EstilosCssEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      codigoCss: dataItem.codigoCss,
      nombreTipo: dataItem.nombreTipo,
      usuario: this.usuario.userName,
    };
    return EstilosCssEnvio;
  }

  validformEstilosCss(): boolean {
    if (this.formEstilosCss.invalid) {
      this.formEstilosCss.markAllAsTouched();
      return false;
    }
    return true;
  }



  /*Funciones*/

  crearEstilosCss() {
    if (this.validformEstilosCss()) {
      this.loaderModal = true;
      let dataformEstilosCss = this.formEstilosCss.getRawValue();
      let EstilosCssEnvio: EstilosCssEnvio = this.procesarData2(dataformEstilosCss, true);
      console.log(EstilosCssEnvio);

      this.integraService
        .insertar(constApiMarketing.EstilosCssInsertar, EstilosCssEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
            let datosEstilosCss = this.formEstilosCss.getRawValue();
            let EstilosCssEnvio: EstilosCss;
            EstilosCssEnvio = this.procesarDataEstilosCss(datosEstilosCss, true);
            let EstilosCss :EstilosCss
            EstilosCss= this.setDataEstilosCss(EstilosCssEnvio, response.body);

            let respuesta: EstilosCssCrear = {
              id: response.body.id,
              nombre: response.body.nombre,
              codigoCss: response.body.codigoCss,
              nombreTipo: response.body.nombreTipo,
            };

            this.obtenerEstilosCss();
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
    } else this.formEstilosCss.markAllAsTouched();
  }

  actualizarEstilosCss() {
    if (this.validformEstilosCss()) {
      this.loaderModal = true;

      let dataformEstilosCss = this.formEstilosCss.getRawValue();

      let EstilosCssEnvio: EstilosCssEnvio = this.procesarData2(dataformEstilosCss, false);
      console.log(EstilosCssEnvio);

      this.integraService
        .actualizar(constApiMarketing.EstilosCssActualizar, EstilosCssEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {

            let EstilosCss: EstilosCss = Object.assign(this.gridEstilosCss.dataItemEditTemp, {
              id: response.body.id,
              nombre: response.body.nombre,
              codigoCss: response.body.codigoCss,
            });
            this.gridEstilosCss.dataItemEditTemp = this.setDataEstilosCss(EstilosCss, response.body);
            this.obtenerEstilosCss();
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
    } else this.formEstilosCss.markAllAsTouched();
  }

  usuario = JSON.parse(localStorage.getItem('userData'))
  
  eliminarEstilosCss(dataItem: any, index: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridEstilosCss.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiMarketing.EstilosCssEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.gridEstilosCss.loading = false;
          if (response.body == true) {
            // this.listaEstilosCss.splice(index, 1);
            this.gridEstilosCss.data.splice(index, 1);
            this.gridEstilosCss.loading = false;
            this.obtenerEstilosCss();
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
          this.gridEstilosCss.loading = false;
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.gridEstilosCss.loading = false;
        },
      });
      }
    });
  }

  reloadEstilosCss() {
    this.obtenerEstilosCss();
  }



  getErrorMessage(controlName: string): string {
    let erroMsj: any = {

      nombre: {
        required: 'Ingrese el nombre del Archivo',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      codigoCss: {
        required: 'Ingrese el codigo Css',
       },
       nombreTipo: {
        required: 'Ingrese el codigo Css',
       },

    };


    let formControl: FormControl = this.formEstilosCss.get(
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
    let formControl: FormControl = this.formEstilosCss.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formEstilosCss.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }


    /*Modales*/
  
    abrirmodalEstilosCss(
      isNew: boolean,
      dataItem?: EstilosCss,
      index?: number
    ) {
      console.log(dataItem);
      this.loaderModal = false;
      this.formEstilosCss.reset();
      // this.tipoInteraccionPorFormulario = [];
      this.isNew = isNew;
      if (dataItem != null) {
        this.gridEstilosCss.dataItemEditTemp = dataItem;
        this.formEstilosCss.patchValue(this.gridEstilosCss.dataItemEditTemp);
      
        // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
      }
      this.modalRef = this.modalService.open(this.modalEstilosCss);
      console.log(this.listaEstilosCss)
   }


}

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
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { process } from "@progress/kendo-data-query";
import { Parametro } from '@shared/models/parametro';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { anyChanged } from '@progress/kendo-angular-common';
import { ReportesRoutingModule } from '@integra/areas/reportes/reportes-routing.module';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/utils';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { Seccion, SeccionCrear, SeccionEnvio } from '@integra/models/seccion';
const iconInputValidation: string ='k-input-validation-icon k-icon k-i-check text-valid-success';



@Component({
  selector: 'app-seccion',
  templateUrl: './seccion.component.html',
  styleUrls: ['./seccion.component.scss']
})
export class SeccionComponent implements OnInit {

  @ViewChild('modalSeccion') modalSeccion: any;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}

  /*variables */
  listaSeccion: [] = []
  Seccion: Seccion[] = [];
  loaderModal: boolean = true; //MODAL SPINNER
  successIcon: string = iconInputValidation; 
  gridSeccion: KendoGrid = new KendoGrid();
  modalRef: any;
  isNew: boolean = false;

  formSeccion: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    estadoTexto: [false],

  });
  public estado=false
  /*form*/

  ngOnInit(): void {
    this.cargarGrilla()
    this.obtenerSeccion() ;
    this.formSeccion.get('estadoTexto').setValue(false)
  }

  cargarGrilla(){
    this.gridSeccion.filterable = 'menu'
    this.gridSeccion.gridState = {
      skip: 0,
      take: 20,
      sort: [],
    }
    this.gridSeccion.resizable = true
    this.gridSeccion.pageable = {
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

  obtenerSeccion() {
    this.gridSeccion.loading = true;
    this.integraService
      .obtenerTodo(constApiMarketing.SeccionObtener)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.gridSeccion.data = response.body;
          this.gridSeccion.loading = false;
          this.listaSeccion = response.body;
          this.Seccion = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }


  /*Datos*/

  setDataSeccion(item: Seccion, itemValue: SeccionEnvio): Seccion {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.estadoTexto = itemValue.estadoTexto;
      
    }
    return item;
  }

  procesarDataSeccion(dataItem: Seccion, isNew: boolean): SeccionEnvio {
    let SeccionEnvio: any = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      estadoTexto: dataItem.estadoTexto,

    };
    return SeccionEnvio;
  }

  procesarData2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let SeccionEnvio: SeccionEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      estadoTexto: dataItem.estadoTexto,
      usuario: this.usuario.userName,
    };
    return SeccionEnvio;
  }

  validformSeccion(): boolean {
    if (this.formSeccion.invalid) {
      this.formSeccion.markAllAsTouched();
      return false;
    }
    return true;
  }



  /*Funciones*/

  crearSeccion() {
    if (this.validformSeccion()) {
      this.loaderModal = true;
      let dataformSeccion = this.formSeccion.getRawValue();
      console.log(dataformSeccion);
      let SeccionEnvio: SeccionEnvio = this.procesarData2(dataformSeccion, true);
      if(SeccionEnvio.estadoTexto==null)SeccionEnvio.estadoTexto=false;
      console.log(SeccionEnvio);

      this.integraService
        .insertar(constApiMarketing.SeccionInsertar, SeccionEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
            let datosSeccion = this.formSeccion.getRawValue();
            let SeccionEnvio: Seccion;
            SeccionEnvio = this.procesarDataSeccion(datosSeccion, true);
            let Seccion :Seccion
            Seccion= this.setDataSeccion(SeccionEnvio, response.body);

            let respuesta: SeccionCrear = {
              id: response.body.id,
              nombre: response.body.nombre,
              estadoTexto: response.body.estadoTexto,
              
            };

            this.obtenerSeccion();
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
    } else this.formSeccion.markAllAsTouched();
  }

  actualizarSeccion() {
    if (this.validformSeccion()) {
      this.loaderModal = true;

      let dataformSeccion = this.formSeccion.getRawValue();

      let SeccionEnvio: SeccionEnvio = this.procesarData2(dataformSeccion, false);
      console.log(SeccionEnvio);

      this.integraService
        .actualizar(constApiMarketing.SeccionActualizar, SeccionEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {

            let Seccion: Seccion = Object.assign(this.gridSeccion.dataItemEditTemp, {
              id: response.body.id,
              nombre: response.body.nombre,
              codigoCss: response.body.codigoCss,
            });
            this.gridSeccion.dataItemEditTemp = this.setDataSeccion(Seccion, response.body);
            this.obtenerSeccion();
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
    } else this.formSeccion.markAllAsTouched();
  }

  usuario = JSON.parse(localStorage.getItem('userData'))
  
  eliminarSeccion(dataItem: any, index: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridSeccion.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiMarketing.SeccionEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.gridSeccion.loading = false;
          if (response.body == true) {
            // this.listaSeccion.splice(index, 1);
            this.gridSeccion.data.splice(index, 1);
            this.gridSeccion.loading = false;
            this.obtenerSeccion();
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
          this.gridSeccion.loading = false;
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.gridSeccion.loading = false;
        },
      });
      }
    });
  }

  reloadSeccion() {
    this.obtenerSeccion();
  }



  getErrorMessage(controlName: string): string {
    let erroMsj: any = {

      nombre: {
        required: 'Ingrese el nombre del Archivo',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      estadoTexto: {
        required: 'Ingrese el estado',
       },

    };


    let formControl: FormControl = this.formSeccion.get(
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
    let formControl: FormControl = this.formSeccion.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formSeccion.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }


    /*Modales*/
  
    abrirmodalSeccion(
      isNew: boolean,
      dataItem?: Seccion,
      index?: number
    ) {
      console.log(dataItem);
      this.loaderModal = false;
      this.formSeccion.reset();
      // this.tipoInteraccionPorFormulario = [];
      this.isNew = isNew;
      if (dataItem != null) {
        this.gridSeccion.dataItemEditTemp = dataItem;
        this.formSeccion.patchValue(this.gridSeccion.dataItemEditTemp);
      
        // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
      }
      this.modalRef = this.modalService.open(this.modalSeccion);
      console.log(this.listaSeccion)
   }


}

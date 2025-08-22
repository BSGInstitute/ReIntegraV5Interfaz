import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { PlantillaV2, PlantillaV2Crear, PlantillaV2Envio } from '@integra/models/plantillaV2';
const iconInputValidation: string ='k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-plantilla-v2',
  templateUrl: './plantilla-v2.component.html',
  styleUrls: ['./plantilla-v2.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlantillaV2Component implements OnInit {

  @ViewChild('modalPlantillaV2') modalPlantillaV2: any;
  @ViewChild('modalSecciones') modalSecciones: any;

  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}

  /*variables */

  @Input() listaEstilo: any[] = [];
  @Input() listaSeccion:any[] = [];

  listaPlantillaV2: [] = []
  listaFuente: any[] = []
  PlantillaV2: PlantillaV2[] = [];
  loaderModal: boolean = true; //MODAL SPINNER
  successIcon: string = iconInputValidation; 
  gridPlantillaV2: KendoGrid = new KendoGrid();
  modalRef: any;
  isNew: boolean = false;



  formPlantillaV2: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    codigo: [Validators.required],

  });
  public estado=false
  /*form*/

  ngOnInit(): void {
    this.cargarGrilla()
    this.obtenerPlantillaV2() ;
    this.obtenerFuente();
    this.obtenerSeccion() 
  }

  cargarGrilla(){
    this.gridPlantillaV2.filterable = 'menu'
    this.gridPlantillaV2.gridState = {
      skip: 0,
      take: 20,
      sort: [],
    }
    this.gridPlantillaV2.resizable = true
    this.gridPlantillaV2.pageable = {
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
    this.integraService
      .getJsonResponse(constApiMarketing.SeccionObtenerCombo)
      .subscribe({
        next: (
          response: HttpResponse<
            {
              id: number;
              nombre: string;
            }[]
          >
        ) => {
          console.log(response.body);
          this.listaSeccion = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerPlantillaV2() {
   this.gridPlantillaV2.loading = true;
    this.integraService
      .obtenerTodo(constApiMarketing.PlantillaV2Obtener)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.gridPlantillaV2.data = response.body;
          this.gridPlantillaV2.loading = false;
          this.listaPlantillaV2 = response.body;
          this.PlantillaV2 = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }


  /*Datos*/

  setDataPlantillaV2(item: PlantillaV2, itemValue: PlantillaV2Envio): PlantillaV2 {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.codigo = itemValue.codigo;
      
    }
    return item;
  }

  procesarDataPlantillaV2(dataItem: PlantillaV2, isNew: boolean): PlantillaV2Envio {
    let PlantillaV2Envio: any = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      codigo: dataItem.codigo,

    };
    return PlantillaV2Envio;
  }

  procesarData2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let PlantillaV2Envio: PlantillaV2Envio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      codigo: dataItem.codigo,
      usuario: this.usuario.userName,
    };
    return PlantillaV2Envio;
  }

  validformPlantillaV2(): boolean {
    if (this.formPlantillaV2.invalid) {
      this.formPlantillaV2.markAllAsTouched();
      return false;
    }
    return true;
  }



  /*Funciones*/

  crearPlantillaV2() {
    if (this.validformPlantillaV2()) {
      this.loaderModal = true;
      let dataformPlantillaV2 = this.formPlantillaV2.getRawValue();
      console.log(dataformPlantillaV2);
      let PlantillaV2Envio: PlantillaV2Envio = this.procesarData2(dataformPlantillaV2, true);
      console.log(PlantillaV2Envio);

      this.integraService
        .insertar(constApiMarketing.PlantillaV2Insertar, PlantillaV2Envio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
            let datosPlantillaV2 = this.formPlantillaV2.getRawValue();
            let PlantillaV2Envio: PlantillaV2;
            PlantillaV2Envio = this.procesarDataPlantillaV2(datosPlantillaV2, true);
            let PlantillaV2 :PlantillaV2
            PlantillaV2= this.setDataPlantillaV2(PlantillaV2Envio, response.body);

            let respuesta: PlantillaV2Crear = {
              id: response.body.id,
              nombre: response.body.nombre,
              codigo: response.body.codigo,
              
            };

            this.obtenerPlantillaV2();
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
    } else this.formPlantillaV2.markAllAsTouched();
  }

  actualizarPlantillaV2() {
    if (this.validformPlantillaV2()) {
      this.loaderModal = true;

      let dataformPlantillaV2 = this.formPlantillaV2.getRawValue();

      let PlantillaV2Envio: PlantillaV2Envio = this.procesarData2(dataformPlantillaV2, false);
      console.log(PlantillaV2Envio);

      this.integraService
        .actualizar(constApiMarketing.PlantillaV2Actualizar, PlantillaV2Envio)
        .subscribe({
          next: (response: HttpResponse<any>) => {

            let PlantillaV2: PlantillaV2 = Object.assign(this.gridPlantillaV2.dataItemEditTemp, {
              id: response.body.id,
              nombre: response.body.nombre,
              codigo: response.body.codigo,
            });
            this.gridPlantillaV2.dataItemEditTemp = this.setDataPlantillaV2(PlantillaV2, response.body);
            this.obtenerPlantillaV2();
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
    } else this.formPlantillaV2.markAllAsTouched();
  }

  usuario = JSON.parse(localStorage.getItem('userData'))
  

  eliminarPlantillaV2(dataItem: any, index: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridPlantillaV2.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiMarketing.PlantillaV2Eliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.gridPlantillaV2.loading = false;
          if (response.body == true) {
            // this.listaPlantillaV2.splice(index, 1);
            this.gridPlantillaV2.data.splice(index, 1);
            this.gridPlantillaV2.loading = false;
            this.obtenerPlantillaV2();
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
          this.gridPlantillaV2.loading = false;
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.gridPlantillaV2.loading = false;
        },
      });
      }
    });
  }

  reloadPlantillaV2() {
    this.obtenerPlantillaV2();
  }

  obtenerFuente() {
    this.integraService.getJsonResponse(constApiMarketing.FuentesPortalWebCombo).subscribe({
      next: (
        response: HttpResponse<
          {
            id: number;
            nombre: string;
          }[]
        >
      ) => {
        console.log(response.body);
        this.listaFuente = response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }
 



  getErrorMessage(controlName: string): string {
    let erroMsj: any = {

      nombre: {
        required: 'Ingrese el nombre del Archivo',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      codigo: {
        required: 'Ingrese el codigo',
       },

    };


    let formControl: FormControl = this.formPlantillaV2.get(
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
    let formControl: FormControl = this.formPlantillaV2.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formPlantillaV2.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }


    /*Modales*/
  
    abrirmodalPlantillaV2(
      isNew: boolean,
      dataItem?: PlantillaV2,
      index?: number
    ) {
      console.log(dataItem);
      this.loaderModal = false;
      this.formPlantillaV2.reset();
      // this.tipoInteraccionPorFormulario = [];
      this.isNew = isNew;
      if (dataItem != null) {
        this.gridPlantillaV2.dataItemEditTemp = dataItem;
        this.formPlantillaV2.patchValue(this.gridPlantillaV2.dataItemEditTemp);
      
        // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
      }
      this.modalRef = this.modalService.open(this.modalPlantillaV2);
      console.log(this.listaPlantillaV2)
   }
   public id=0;
   AbrirSecciones(isNew: boolean,
    dataItem?: PlantillaV2,
    index?: number){
      console.log(dataItem)
    this.id=dataItem.id;
    this.modalRef = this.modalService.open(this.modalSecciones, { windowClass: 'clasePlantilla' });
  }
  cerrarModal(){
    this.modalRef.close()      
  }
}

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
import { LandingPage, LandingPageCrear, LandingPageEnvio } from '@integra/models/tipo-landingPage';
const iconInputValidation: string ='k-input-validation-icon k-icon k-i-check text-valid-success';


@Component({
  selector: 'app-tipo-landing-page',
  templateUrl: './tipo-landing-page.component.html',
  styleUrls: ['./tipo-landing-page.component.scss']
})
export class TipoLandingPageComponent implements OnInit {

  
  @ViewChild('modalLandingPage') modalLandingPage: any;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}

  /*variables */
  listaLandingPage: [] = []
  TipoLandingPage: LandingPage[] = [];
  loaderModal: boolean = true; //MODAL SPINNER
  successIcon: string = iconInputValidation; 
  gridLandingPage: KendoGrid = new KendoGrid();
  modalRef: any;
  isNew: boolean = false;

  formTipoLandingPage: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ]
  });

  /*form*/

  ngOnInit(): void {
    this.cargarGrilla()
    this.obtenerLandingPage() ;
  }

  cargarGrilla(){
    this.gridLandingPage.filterable = 'menu'
    this.gridLandingPage.gridState = {
      skip: 0,
      take: 20,
      sort: [],
    }
    this.gridLandingPage.resizable = true
    this.gridLandingPage.pageable = {
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

  obtenerLandingPage() {
    this.gridLandingPage.loading = true;
    this.integraService
      .obtenerTodo(constApiMarketing.TipoLandingPageObtener)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.gridLandingPage.data = response.body;
          this.gridLandingPage.loading = false;
          this.listaLandingPage = response.body;
          this.TipoLandingPage = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }


  /*Datos*/

  setDataLandingPage(item: LandingPage, itemValue: LandingPageEnvio): LandingPage {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
    }
    return item;
  }

  procesarDataLandingPage(dataItem: LandingPage, isNew: boolean): LandingPageEnvio {
    let LandingPageEnvio: any = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
    };
    return LandingPageEnvio;
  }

  procesarData2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let LandingPageEnvio: LandingPageEnvio = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      usuario: this.usuario.userName,
    };
    return LandingPageEnvio;
  }

  validformTipoLandingPage(): boolean {
    if (this.formTipoLandingPage.invalid) {
      this.formTipoLandingPage.markAllAsTouched();
      return false;
    }
    return true;
  }



  /*Funciones*/

  crearLandingPage() {
    if (this.validformTipoLandingPage()) {
      this.loaderModal = true;
      let dataformTipoLandingPage = this.formTipoLandingPage.getRawValue();
      let LandingPageEnvio: LandingPageCrear = this.procesarData2(dataformTipoLandingPage, true);
      console.log(LandingPageEnvio);

      this.integraService
        .insertar(constApiMarketing.TipoLandingInsertar, LandingPageEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
           
            let datosLandingPage = this.formTipoLandingPage.getRawValue();
            let LandingPageEnvio: LandingPage;
            LandingPageEnvio = this.procesarDataLandingPage(datosLandingPage, true);
            let LandingPage :LandingPage
            LandingPage= this.setDataLandingPage(LandingPageEnvio, response.body);

            let respuesta: LandingPageCrear = {
              id: response.body.id,
              nombre: response.body.nombre
            };

            this.obtenerLandingPage();
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
    } else this.formTipoLandingPage.markAllAsTouched();
  }

  actualizarLandingPage() {
    if (this.validformTipoLandingPage()) {
      this.loaderModal = true;

      let dataformTipoLandingPage = this.formTipoLandingPage.getRawValue();

      let LandingPageEnvio: LandingPageEnvio = this.procesarData2(dataformTipoLandingPage, false);
      console.log(LandingPageEnvio);

      this.integraService
        .actualizar(constApiMarketing.TipoLandingActualizar, LandingPageEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {

            let LandingPage: LandingPage = Object.assign(this.gridLandingPage.dataItemEditTemp, {
              id: response.body.id,
              nombre: response.body.nombre,
            });
            this.gridLandingPage.dataItemEditTemp = this.setDataLandingPage(LandingPage, response.body);
            this.obtenerLandingPage();
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
    } else this.formTipoLandingPage.markAllAsTouched();
  }

  usuario = JSON.parse(localStorage.getItem('userData'))

  eliminarLandingPage(dataItem: any, index: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridLandingPage.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiMarketing.TipoLandingEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.gridLandingPage.loading = false;
          if (response.body == true) {
            // this.listaLandingPage.splice(index, 1);
            this.gridLandingPage.data.splice(index, 1);
            this.gridLandingPage.loading = false;
            this.obtenerLandingPage();
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
          this.gridLandingPage.loading = false;
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.gridLandingPage.loading = false;
        },
      });
      }
    });
  }

  reloadLandingPage() {
    this.obtenerLandingPage();
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {

      nombre: {
        required: 'Ingrese el nombre del Archivo',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },

    };


    let formControl: FormControl = this.formTipoLandingPage.get(
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
    let formControl: FormControl = this.formTipoLandingPage.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formTipoLandingPage.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }


    /*Modales*/
  
    abrirmodalLandingPage(
      isNew: boolean,
      dataItem?: LandingPage,
      index?: number
    ) {
      console.log(dataItem);
      this.loaderModal = false;
      this.formTipoLandingPage.reset();
      // this.tipoInteraccionPorFormulario = [];
      this.isNew = isNew;
      if (dataItem != null) {
        this.gridLandingPage.dataItemEditTemp = dataItem;
        this.formTipoLandingPage.patchValue(this.gridLandingPage.dataItemEditTemp);
      
        // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
      }
      this.modalRef = this.modalService.open(this.modalLandingPage);
   }


}

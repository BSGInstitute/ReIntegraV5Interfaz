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
import { RegionCiudad } from '@integra/models/region-ciudad';
import { Ciudad, CiudadPorPais, CiudadEnvio, CiudadCambiar } from '@integra/models/ciudad';
import { ReportesRoutingModule } from '@integra/areas/reportes/reportes-routing.module';
import { isNullOrEmptyString } from '@progress/kendo-angular-grid/utils';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
const iconInputValidation: string ='k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.scss'],
})
export class CiudadComponent implements OnInit {
  @ViewChild('modalCiudad') modalCiudad: any;
  @ViewChild('modalVerCiudad') modalVerCiudad: any;
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}
  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  /*variables */
  listaPais: any[] = [];
  listaCiudad: any[] = [];
  Ciudad: Ciudad[] = [];
  idPaisc = -1;
  loaderModal: boolean = true; //MODAL SPINNER
  successIcon: string = iconInputValidation;
  gridCiudad: KendoGrid = new KendoGrid();
  modalRef: any;
  isNew: boolean = false;

  formCiudad: FormGroup = this.formBuilder.group({
    id: [0],
    codigo: ['', Validators.required],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    nombrePais: ['', [Validators.required]],
    longCelular: ['', Validators.required],
    longTelefono: ['', [Validators.required]],
    longCelularAlterno: ['', [Validators.required]],
  });

  /*form*/

  ngOnInit(): void {
    this.cargarGrilla()
    this.obtenerPais();
    this.obtenerCiudad(this.idPaisc) ;
  }

  cargarGrilla(){
    this.gridCiudad.filterable = 'menu'
    this.gridCiudad.gridState = {
      skip: 0,
      take: 20,
      sort: [],
    }
    this.gridCiudad.resizable = true
    this.gridCiudad.pageable = {
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

  obtenerCiudad(idPais: number) {
    this.gridCiudad.loading = true;
    this.integraService
      .getJsonResponse(`${constApiGlobal.CiudadObtenerIdPais}/${idPais}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.gridCiudad.data = response.body;
          this.gridCiudad.loading = false;
          this.listaCiudad = response.body;
          this.Ciudad = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }


  obtenerPais() {
    this.integraService.getJsonResponse(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (
        response: HttpResponse<
          {
            id: number;
            nombrePais: string;
          }[]
        >
      ) => {
        console.log(response.body);
        this.listaPais = response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  /*Datos*/

  setDataCiudad(item: Ciudad, itemValue: CiudadPorPais): Ciudad {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.longCelular = itemValue.longCelular;
      item.longTelefono = itemValue.longTelefono;
      item.longCelularAlterno = itemValue.longCelularAlterno;
      item.nombrePais = itemValue.nombrePais;
      item.idPais = itemValue.idPais;
    }
    return item;
  }

  procesarDataCiudad(dataItem: Ciudad, isNew: boolean): CiudadPorPais {
    let CiudadEnvio: any = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      longCelular: dataItem.longCelular,
      longTelefono: dataItem.longTelefono,
      longCelularAlterno: dataItem.longCelularAlterno,
      nombrePais: dataItem.nombrePais,
      idPais: dataItem.idPais
    };
    return CiudadEnvio;
  }

  procesarData2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let CiudadEnvio: CiudadEnvio = {
      id: isNew ? 0 : dataItem.id,
      codigo: dataItem.codigo,
      nombre: dataItem.nombre,
      longCelular: dataItem.longCelular,
      longTelefono: dataItem.longTelefono,
      longCelularAlterno: dataItem.longCelularAlterno,
      idPais:  dataItem.nombrePais,
      nombrePais: "",
      usuario: this.usuario.userName,
    };
    return CiudadEnvio;
  }

  validFormCiudad(): boolean {
    if (this.formCiudad.invalid) {
      this.formCiudad.markAllAsTouched();
      return false;
    }
    return true;
  }

  /*Imprimir*/

  imprimirPais(e: any) {

    this.idPaisc = e.id;

  }

  imprimirDatos() {
    if(this.idPaisc== null){
      this.idPaisc = -1
      this.cargarGrilla()
    }
    else{

    this.obtenerCiudad(this.idPaisc);
    this.cargarGrilla()
    }
  }



  /*Funciones*/

  crearCiudad() {
    if (this.validFormCiudad()) {
      this.loaderModal = true;
      let dataFormCiudad = this.formCiudad.getRawValue();
      let CiudadEnvio: CiudadEnvio = this.procesarData2(dataFormCiudad, true);
      console.log(CiudadEnvio);

      this.integraService
        .insertar(constApiGlobal.CiudadInsertar, CiudadEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);

            let pais = this.listaPais.find((e) => e.id == response.body.idPais);
            let datosCiudad = this.formCiudad.getRawValue();
            let ciudadEnvio: CiudadEnvio;
            ciudadEnvio = this.procesarDataCiudad(datosCiudad, true);
            let ciudad :Ciudad
            ciudad= this.setDataCiudad(ciudadEnvio, response.body);

            let respuesta: CiudadEnvio = {
              id: response.body.id,
              codigo: response.body.codigo,
              nombre: response.body.nombre,
              longCelular: response.body.longCelular,
              longTelefono: response.body.longTelefono,
              longCelularAlterno: response.body.longCelularAlterno,
              idPais: pais.nombrePais,
              nombrePais: pais.nombrePais,
              usuario:this.usuario.userName,
            };
            ciudad.id=response.body.id;
            this.listaCiudad.unshift(ciudad);

            this.obtenerCiudad(this.idPaisc);
            console.log(this.listaCiudad)
           console.log(respuesta)
           console.log(response.body)
            //this.gridCiudad.dataItemEditTemp = this.setDataCiudad(Ciudad, response.body);
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
    } else this.formCiudad.markAllAsTouched();
  }

  actualizarCiudad() {
    if (this.validFormCiudad()) {
      this.loaderModal = true;

      let dataFormCiudad = this.formCiudad.getRawValue();

      let CiudadEnvio: CiudadEnvio = this.procesarData2(dataFormCiudad, false);
      console.log(CiudadEnvio);

      this.integraService
        .actualizar(constApiGlobal.CiudadActualizar, CiudadEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            let pais = this.listaPais.find((e) => e.id == response.body.idPais);

            let ciudad: Ciudad = Object.assign(this.gridCiudad.dataItemEditTemp, {
              id: response.body.id,
              codigo: response.body.codigo,
              nombre: response.body.nombre,
              longCelular: response.body.longCelular,
              longTelefono: response.body.longTelefono,
              idPais: pais.id,
              nombrePais: pais.nombre,
              longCelularAlterno: response.body.longCelularAlterno,
            });
            this.gridCiudad.dataItemEditTemp = this.setDataCiudad(ciudad, response.body);
            this.obtenerCiudad(this.idPaisc);
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
    } else this.formCiudad.markAllAsTouched();
  }


  eliminarCiudad(dataItem: any, index: number) {
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridCiudad.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName},
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiGlobal.CiudadEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.gridCiudad.loading = false;
          if (response.body == true) {
            // this.listaCiudad.splice(index, 1);
            this.gridCiudad.data.splice(index, 1);
            this.gridCiudad.loading = false;
            this.obtenerCiudad(this.idPaisc);
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
          this.gridCiudad.loading = false;
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.gridCiudad.loading = false;
        },
      });
      }
    });
  }

  reloadCiudad() {
    this.idPaisc = -1;
    this.obtenerCiudad(this.idPaisc);
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      codigo: {
        required: 'Ingrese un codigo',
      },
      nombre: {
        required: 'Ingrese Nombre de la Ciudad',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      nombrePais: {
        required: 'Seleccione un Pais',
      },
      longCelular: {
        required: 'Ingrese la longitud del Codigo Celular',
      },
      longTelefono: {
        required: 'Ingrese la longitud del Codigo Telefono',
      },
      longCelularAlterno: {
        required: 'Ingrese la longitud del Celular Alterno',
      },

    };


    let formControl: FormControl = this.formCiudad.get(
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

  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formCiudad.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formCiudad.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }


    /*Modales*/

    abrirModalCiudad(
      isNew: boolean,
      dataItem?: Ciudad,
      index?: number
    ) {
      console.log(dataItem);
      this.loaderModal = false;
      this.formCiudad.reset();
      // this.tipoInteraccionPorFormulario = [];
      this.isNew = isNew;
      if (dataItem != null) {
        this.gridCiudad.dataItemEditTemp = dataItem;
        this.formCiudad.patchValue(this.gridCiudad.dataItemEditTemp);
        // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
      }
      this.modalRef = this.modalService.open(this.modalCiudad);
    }


  // gridEventsCiudad(e: any): void {
  //   console.log(e);
  //   switch (e.action) {
  //     case 'edit':
  //       this.abrirModalCiudad(e.isNew, e.dataItem, e.index);
  //       break;
  //     case 'add':
  //       this.abrirModalCiudad(e.isNew, e);
  //       break;
  //     case 'remove':
  //       // this.mostrarMensajeEliminar(e.dataItem, e.index);
  //       break;
  //     case 'reload':
  //       this.reloadCiudad();
  //       break;
  //   }
  // }
}

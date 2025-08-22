
import { FormGroup, Validators } from '@angular/forms';

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import {
  IComboCuentaContable,
  IComboAlumno,
  IComboCentroCosto,
  IComboFormaPago,
  IComboCuentaCorriente,
  IComboMoneda,
  IComboSubTipoMovimientoCaja,
  IComboTipoMovimientoCaja,
  IOtroIngresoEgreso,
  IFormOtroIngresoEgreso,
} from '@finanzas/models/interfaces/otro-ingreso-egreso';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { NOMEM } from 'dns';
import { identifierName } from '@angular/compiler/public_api';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { UserService } from '@shared/services/user.service';
@Component({
  selector: 'app-otro-ingreso-egreso',
  templateUrl: './otro-ingreso-egreso.component.html',
  styleUrls: ['./otro-ingreso-egreso.component.scss'],
})
export class OtroIngresoEgresoComponent implements OnInit {
  @ViewChild('modalOtroIngresoEgreso') modalOtroIngresoEgreso: any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    public finanzasService:FinanzasServiceService,
    private userService :UserService
  ) {}



  loader=false
  loaderModal: boolean = false;
  isNew: boolean = false;
  modalRef: any;
  carga = false;
  dataEditTemporal: any = {};
  horaCorte: any;
  gridOtroIngresoEgreso: KendoGrid = new KendoGrid();
  fechaInicio = new FormControl()

  formOtroIngresoEgreso: FormGroup = this.formBuilder.group({
    idTipoIngreso: [null, Validators.required],
    idCentroCosto: [null],
    idSubTipoMovimientoCaja: [null, Validators.required],
    idFormaPago: null,
    idAlumno: null,
    fechaPago:[new Date(),Validators.required],
    idNroCuentaBanco: [null, Validators.required],
    precio: [null, Validators.required],
    idCuentaContable: [null, Validators.required],
    idMoneda: [null, Validators.required],
    observaciones: null,
  });

  comboTipoMovimientoCaja: IComboTipoMovimientoCaja[] = [];
  comboCuentaCorriente: IComboCuentaCorriente[] = [];
  comboSubTipoMovimientoCaja: IComboSubTipoMovimientoCaja[] = [];
  comboMoneda: IComboMoneda[] = [];
  comboCentroCosto: IComboCentroCosto[] = []; //
  comboFormaPago: IComboFormaPago[] = [];
  comboAlumno: IComboAlumno[] = [];
  comboCuentaContable: IComboCuentaContable[] = [];

  ngOnInit(): void {
    this.ObtenerOtroIngresoEgreso();
    this.cargarGrilla();
    this.obtenerComboTipoMovimientoCaja();
    this.obtenerComboSubTipoMovimientoCaja();
    this.obtenerComboFormaPago();
    this.obtenerComboMoneda();
    this.obtenerComboCuentaCorriente();

  }

  ObtenerOtroIngresoEgreso() {
    this.loader=true;
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.OtroIngresoEgresoVisualizarOtroMovimientoCaja}`
      )
      .subscribe({
        next: (response: HttpResponse<{ records: IOtroIngresoEgreso[] }>) => {
          this.gridOtroIngresoEgreso.data = response.body.records;

          this.loader=false;
           
        },
        error: (error) => {
          this.loader=false;
          this.alertaService.notificationError(error.error);
        },
        complete: () => {},
      });
  }
  abrirModal(isNew: boolean, dataItem?: IOtroIngresoEgreso) {
     
    this.formOtroIngresoEgreso.reset();
    this.isNew = isNew;
    this.dataEditTemporal = dataItem;
    // this.formOtroIngresoEgreso.get("fechaNueva").setValue(new Date());




    if (dataItem != null) {

      this.formOtroIngresoEgreso.patchValue(dataItem);
      this.formOtroIngresoEgreso.get("fechaPago").setValue(new Date(dataItem.fechaPago));
      this.formOtroIngresoEgreso.get('idTipoIngreso').setValue(dataItem.idTipoMovimientoCaja);
      this.formOtroIngresoEgreso.get('idSubTipoMovimientoCaja').setValue(dataItem.idSubTipoMovimientoCaja);
      this.formOtroIngresoEgreso.get('idAlumno').setValue(dataItem.idAlumno);
      this.formOtroIngresoEgreso.get('idCentroCosto').setValue(dataItem.idCentroCosto );
      this.formOtroIngresoEgreso.get('idCuentaContable').setValue(dataItem.idPlanContable );
      this.formOtroIngresoEgreso.get('idNroCuentaBanco').setValue(dataItem.idCuentaCorriente);

        this.comboAlumno = [{
          nombreCompleto: dataItem.nombreAlumno,
          id: dataItem.idAlumno
        }]
        this.comboCentroCosto = [{
          nombreCentroCosto: dataItem.nombreCentroCosto,
          idCentroCosto: dataItem.idCentroCosto
        }]

      this.comboCuentaContable=[{
        nombre: dataItem.nombrePlanContable,
        id: dataItem.idPlanContable,
      }]


        // this.filtroCentroCosto(dataItem.nombreCentroCosto);
        // this.filtroAlumno(dataItem.nombreAlumno);

    }

    this.modalRef = this.modalService.open(this.modalOtroIngresoEgreso, {
      backdrop: 'static',
      size: 'xl',
    });
  }
  validFormGrupoFiltroPrograma(): boolean {
    if (this.formOtroIngresoEgreso.invalid) {
      this.formOtroIngresoEgreso.markAllAsTouched();
      return false;
    }
    return true;
  }

  cargarGrilla() {
    this.gridOtroIngresoEgreso.selectable = true;
    this.gridOtroIngresoEgreso.sortable = true;
    this.gridOtroIngresoEgreso.resizable = true;
    this.gridOtroIngresoEgreso.filterable = 'menu';

    this.gridOtroIngresoEgreso.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridOtroIngresoEgreso.gridState = {
      skip: 0,
      take: 15,
    };

    this.gridOtroIngresoEgreso.getDataStateChance$().subscribe({
      next: (resp: any) => {
         
        this.gridOtroIngresoEgreso.gridState = resp.gridState;

        this.ObtenerOtroIngresoEgreso();
      },
    });
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      idTipoIngreso: { required: 'Elija un tipo de ingresa' },
      idNroCuentaBanco: { required: 'Ingrese Cuenta Bancaria' },
      precio: { required: 'Ingrese un Precio' },
      idCuentaContable: { required: 'Ingrese una Cuenta' },
      idMoneda: { required: 'Elija un tipo de Moneda' },
      fechaPago:{required:'Registre Fecha'},
      idSubTipoMovimientoCaja:{required:'Ingrese Sub-Tipo Ingreso'}

    };

    let formControl: FormControl = this.formOtroIngresoEgreso.get(
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

  obtenerComboTipoMovimientoCaja() {
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.OtroIngresoEgresoObtenerListaTipoMovimientoCaja}`
      )
      .subscribe({
        next: (response: HttpResponse<IComboTipoMovimientoCaja[]>) => {
          this.comboTipoMovimientoCaja = response.body;
        },

        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }

  obtenerComboSubTipoMovimientoCaja() {
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.OtroIngresoEgresoObtenerListaSubTipoMovimientoCaja}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {

          this.comboSubTipoMovimientoCaja = response.body;
        },

        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }

  obtenerComboFormaPago() {
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.OtroIngresoEgresoObtenerListaFormaPago}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {

          this.comboFormaPago = response.body;
        },

        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }

  obtenerComboMoneda() {
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.OtroIngresoEgresoObtenerListaMoneda}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {

          this.comboMoneda = response.body;
        },

        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }
  obtenerComboCuentaCorriente() {
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.OtroIngresoEgresoObtenerListaCuentaCorriente}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {

          this.comboCuentaCorriente = response.body;
        },

        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }
  filtroCentroCosto(value: string) {
    if (value.length >= 4) {
      this.integraService
        .getJsonResponse(
          constApiFinanzas.OtroIngresoEgresoObtenerCentroCosto +
            '?NombreParcial=' +
            value
        )
        .subscribe({
          next: (response: HttpResponse<IComboCentroCosto[]>) => {
            this.comboCentroCosto = response.body;
          },

          error: (error) => {
            this.alertaService.notificationError(error.error);
          },
        });
    }
  }

  filtroAlumno(value: string) {
    if (value.length >= 4) {
      this.integraService
        .getJsonResponse(
          constApiFinanzas.OtroIngresoObtenerListaAlumnoAutocomplete +
            '?NombreParcial=' +
            value
        )
        .subscribe({
          next: (response: HttpResponse<IComboAlumno[]>) => {
            this.comboAlumno = response.body;
          },

          error: (error) => {
            this.alertaService.notificationError(error.error);
          },
        });
    }
  }
  filtroCuentaContable(value: string) {
    if (value.length >= 4) {
      this.integraService
        .getJsonResponse(
          constApiFinanzas.OtroIngresoObtenerListaPlanContableAutoComplete +
            '?NombreParcial=' +
            value
        )
        .subscribe({
          next: (response: HttpResponse<IComboCuentaContable[]>) => {
            this.comboCuentaContable = response.body;
          },

          error: (error) => {
            this.alertaService.notificationError(error.error);
          },
        });
    }
  }
  crearIngresoEgreso() {
    if (this.formOtroIngresoEgreso.valid) {
       this.loaderModal = true;
      let datosFormulario: any =
        this.formOtroIngresoEgreso.getRawValue();

      if(datosFormulario.observaciones==null)datosFormulario.observaciones=""

      let jsonEnvio: IOtroIngresoEgreso = {
        id: 0,
        idTipoMovimientoCaja: datosFormulario.idTipoIngreso,
        precio: datosFormulario.precio,
        idMoneda:datosFormulario.idMoneda,
        fechaPago: datePipeTransform(datosFormulario.fechaPago),
        idCuentaCorriente: (datosFormulario.idNroCuentaBanco),
        observaciones:datosFormulario.observaciones,
        idSubTipoMovimientoCaja:datosFormulario.idSubTipoMovimientoCaja,
        idCentroCosto:datosFormulario.idCentroCosto,
        idPlanContable:datosFormulario.idCuentaContable,
        idAlumno:datosFormulario.idAlumno,
        idFormaPago:datosFormulario.idFormaPago,

        usuario:this.userService.userName
      };

      this.integraService
        .insertar(
          constApiFinanzas.OtroIngresoInsertarOtroMovimientoCaja,
          jsonEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {

            this.ObtenerOtroIngresoEgreso();

            this.gridOtroIngresoEgreso.loadView();

            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            //  this.alertaService.notificationError(error.error);
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRef.close('submitted');
            this.alertaService.mensajeExitoso();
          },
        });
    } else this.formOtroIngresoEgreso.markAllAsTouched();
  }

  ActualizarIngresoEgreso() {
    if (this.validFormGrupoFiltroPrograma()) {
      this.loaderModal = true;
      let dataOriginal = this.dataEditTemporal;


      let datosFormulario  = this.formOtroIngresoEgreso.getRawValue();
      if(datosFormulario.observaciones==null)datosFormulario.observaciones=""
      let jsonEnvio: IOtroIngresoEgreso = {
        id: dataOriginal.id,
        idTipoMovimientoCaja: dataOriginal.idTipoIngreso,
        precio: datosFormulario.precio,
        idMoneda:datosFormulario.idMoneda,
        fechaPago: datePipeTransform(datosFormulario.fechaPago),
        idCuentaCorriente: datosFormulario.idNroCuentaBanco,
        observaciones:datosFormulario.observaciones,
        idSubTipoMovimientoCaja:datosFormulario.idSubTipoMovimientoCaja,
        idCentroCosto:datosFormulario.idCentroCosto,
        idPlanContable:datosFormulario.idCuentaContable,
        idAlumno:datosFormulario.idAlumno,
        idFormaPago:datosFormulario.idFormaPago,
        usuario:this.userService.userName

      };
      // resultado

      this.integraService
        .postJsonResponse(
          constApiFinanzas.OtroIngresoActualiOtroMovimientoCaja,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.ObtenerOtroIngresoEgreso();

            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.alertaService.notificationError(error.error);
          },
          complete: () => {
            this.modalRef.close('submitted');
            this.alertaService.mensajeExitoso();
          },
        });
    } else {
      this.formOtroIngresoEgreso.markAllAsTouched();
    }
  }

  mostrarMensajeError(error: any): void {
    this.loaderModal = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
          <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false,
    });
  }


  EliminarIngresoEgreso(dataItem: any) {
    this.loader=true
    let jsonEnvio : any = {
      id: dataItem.id,
      nombreUsuario:this.userService.userName

    };

    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridOtroIngresoEgreso.loading = true;
        this.integraService
          .postJsonResponse(
            constApiFinanzas.OtroIngresoEliminarOtroMovimientoCaja,
            JSON.stringify(jsonEnvio)
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
                    let index = this.gridOtroIngresoEgreso.data.findIndex(
                      (e: any) => e.id == dataItem.id
                    );

                    this.loader=false
              this.gridOtroIngresoEgreso.loading = false;
              if (response.body == true) {

                //this.gridOtroIngresoEgreso.data =this.gridOtroIngresoEgreso.data.filter((e: any) => e.id == dataItem.id);

                this.gridOtroIngresoEgreso.data.splice(index, 1);
                this.gridOtroIngresoEgreso.loadView()

                this.alertaService.swalFire(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success'
                );
              } else {
                this.alertaService.swalFire(
                  'Error!',
                  'Ocurrio un problema al eliminar.',
                  'warning'
                );
              }
            },
            error: (error) => {
              this.loader=false
              this.alertaService.notificationError(error.error);
            },
            complete: () => {},
          });
      }
    });
  }
}

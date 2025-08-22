import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiGlobal, constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

/**
 * @module PlanificacionModule
 * @description Componente de Maestro Regiones
 * @author Christian A. Quispe Mamani
 * @version 1.0.0
 * @history
 * * 28/04/2023 Implementacion de Crud de Maestro Regiones
 * * 28/04/2023 Creacion de Grilla
 */

interface Pais {
  id: number;
  moneda: string;
  nombre: string;
}

interface Ciudad {
  id: number;
  codigo: number;
  nombre: string;
  idPais: number;
  nombrePais: string;
  longCelular: number;
  longTelefono: number;
}

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {

  @ViewChild('modalModificarMasivo') modalModificarMasivo: any;
  @ViewChild('modalModificarIndividual') modalModificarIndividual: any;
  @ViewChild('modalVisualizador') modalVisualizador: any;

  gridCiudades: KendoGrid = new KendoGrid();
  seleccionados: string[] = [];
  comboPaises: Pais[] = [];
  nuevoRegistro: boolean = false;
  dataFila: Ciudad = null;
  loaderModal: boolean = false;

  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]

  modalRefMasivo: NgbModalRef = null;
  modalRefIndividual: NgbModalRef = null;

  contadorSeleccionados = new FormControl(0);
  formRegionMasivo: FormGroup = this.formBuilder.group({
    idPais: [0, [
      Validators.required]
    ],
    longCelular: ['', [
      Validators.required]
    ],
    longTelefono: ['', [
      Validators.required]
    ]
  });
  formRegionIndividual: FormGroup = this.formBuilder.group({
    id: [],
    codigo: ['', [
      Validators.required]
    ],
    nombre: ['', [
      Validators.required]
    ],
    idPais: [0, [
      Validators.required]
    ],
    longCelular: ['', [
      Validators.required]
    ],
    longTelefono: ['', [
      Validators.required]
    ]
  });
  formDataVisual: Ciudad;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) { }

  ngOnInit(): void {
    this.obtenerPaises();
    this.obtenerCiudades();
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  capturarSeleccionados(): void {
    let cantidadSeleccionados = this.seleccionados.length;
    if(cantidadSeleccionados > 0) {
      this.contadorSeleccionados.setValue(cantidadSeleccionados);
      this.modalRefMasivo = this.modalService.open(this.modalModificarMasivo, { size: 'md', backdrop: 'static' });
    } else {
      this.alertaService.notificationWarning("No se encontraron filas seleccionadas");
    }
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerPaises(): void {
    this.loaderModal = true;
    this.gridCiudades.loading = true;
    this.integraService
      .getJsonResponse(constApiGlobal.PaisObtenerComboConMoneda)
      .subscribe({
        next: (response: HttpResponse<Pais[]>) => {
          this.comboPaises = response.body;
          this.gridCiudades.loading = false;
          this.loaderModal = false;
          this.alertaService.notificationSuccessBotom("Informacion cargada correctamente");
        },
        error: (e:any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        }
      })
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerCiudades(): void {
    this.loaderModal = true;
    this.gridCiudades.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.CiudadVisualizarCiudad)
      .subscribe({
        next: (response: HttpResponse<Ciudad[]>) => {
          this.gridCiudades.data = response.body;
          this.gridCiudades.loading = false;
          this.loaderModal = false;
          this.alertaService.notificationSuccessBotom("Informacion cargada correctamente");
        }
      })
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalle(dataSource:Ciudad): void {
    this.loaderModal = true;
    this.formDataVisual = {
      id: 0,
      codigo: dataSource.codigo,
      nombre: dataSource.nombre,
      idPais: 0,
      nombrePais: dataSource.nombrePais,
      longCelular: dataSource.longCelular,
      longTelefono: dataSource.longTelefono
    };
    this.modalService.open(this.modalVisualizador, { size: 'md', backdrop: 'static' });
    this.loaderModal = false;
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formRegionIndividual.reset();
    this.modalRefIndividual = this.modalService.open(this.modalModificarIndividual, { size: 'md', backdrop: 'static' });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleActualizar(dataSource: Ciudad): void {
    this.nuevoRegistro = false;
    this.formRegionIndividual.setValue({
      id: dataSource.id,
      codigo: dataSource.codigo,
      nombre: dataSource.nombre,
      idPais: dataSource.idPais,
      longCelular: dataSource.longCelular,
      longTelefono: dataSource.longTelefono
    });
    this.modalRefIndividual = this.modalService.open(this.modalModificarIndividual, { size: 'md', backdrop: 'static' });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  eliminar(dataSource:Ciudad): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaderModal = true;
        this.integraService
          .deleteJsonResponse(`${constApiGlobal.CiudadEliminar}/${dataSource.id}`)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if(response.body) {
                let idIndice = this.gridCiudades.data.indexOf(dataSource);
                this.gridCiudades.data.splice(idIndice, 1);
                this.gridCiudades.loadData();
                Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
              } else {
                Swal.fire('Error', 'Surgio un error al eliminar el registro.', 'error');
              }
              this.loaderModal = false;
            },
            error: (e:any) => {
              this.loaderModal = false;
              this.alertaService.notificationWarning(`Surgio un error: ${e}`);
            }
          })
      }
    });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  insertar(): void {
    if(this.formRegionIndividual.valid) {
      let dataEnviada = this.formRegionIndividual.getRawValue();
          dataEnviada.id = 0;
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(constApiGlobal.CiudadInsertar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<Ciudad>) => {
            let nuevaFila: Ciudad = {
              id: response.body.id,
              codigo: response.body.codigo,
              nombre: response.body.nombre,
              idPais: response.body.idPais,
              nombrePais: this.comboPaises.find((x: Pais) => x.id == dataEnviada.idPais).nombre,
              longCelular: response.body.longCelular,
              longTelefono: response.body.longTelefono
            };
            this.gridCiudades.data.unshift(nuevaFila);
            this.gridCiudades.loadData();
            this.loaderModal = false;
            this.formRegionIndividual.reset();
            this.modalRefIndividual.close();
            Swal.fire('¡Registrado!', 'El registro ha sido creado correctamente.', 'success');
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          }
        });
    };
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  actualizar(): void {
    if(this.formRegionIndividual.valid) {
      let dataEnviada = this.formRegionIndividual.getRawValue();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(constApiGlobal.CiudadActualizar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<Ciudad>) => {
            let data = this.gridCiudades.data.find((x: Ciudad) => x.id == dataEnviada.id);
            let index = this.gridCiudades.data.indexOf(data);

            this.gridCiudades.data[index].id = response.body.id;
            this.gridCiudades.data[index].codigo = response.body.codigo;
            this.gridCiudades.data[index].nombre = response.body.nombre;
            this.gridCiudades.data[index].idPais = response.body.idPais;
            this.gridCiudades.data[index].nombrePais = this.comboPaises.find((x:Pais) => x.id == response.body.idPais).nombre;
            this.gridCiudades.data[index].longCelular = response.body.longCelular;
            this.gridCiudades.data[index].longTelefono = response.body.longTelefono
            this.gridCiudades.loadData();
            this.loaderModal = false;
            this.formRegionIndividual.reset();
            this.modalRefIndividual.close();
            Swal.fire('¡Actualizado!', 'El registro ha sido actualizado correctamente.', 'success');
          },
          error: (e:any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          }
        });
    };
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  actualizarMultiple(): void {
    if(this.formRegionMasivo.valid) {
      let dataEnviada = this.formRegionMasivo.getRawValue();
          dataEnviada.IdsCiudades = this.seleccionados;
      this.integraService
        .putJsonResponse(constApiPlanificacion.CiudadActualizarCiudadesMultiples, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            if(response.body) {
              this.obtenerCiudades();
              this.formRegionMasivo.reset();
              this.modalRefMasivo.close();
              Swal.fire('¡Actualizados!', 'Los registros han sido modificados correctamente.', 'success')
            } else {
              this.alertaService.notificationWarning(`Surgio un error: al realizar la actualizacion multiple`);
            }
          },
          error: (e:any) => {
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          }
        })
    }
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  limpiarCamposForm(): void {
    if( this.modalRefIndividual != null || this.modalRefMasivo != null) {
      ((this.modalRefIndividual == null) ? this.modalRefMasivo : this.modalRefIndividual).close();
      this.modalRefIndividual = null;
      this.modalRefMasivo = null;
    }
    this.formRegionIndividual.reset();
    this.formRegionMasivo.reset();
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  getErrorMessageMasivo(controlName: string): string {
    let erroMsj: any = {
      longCelular: {
        required: 'Ingrese Cantidad de digitos'
      },
      longTelefono: {
        required: 'Ingrese Cantidad de digitos'
      },
      idPais: {
        required: 'Elija un Pais'
      }
    };
    let formControl: FormControl = this.formRegionMasivo.get(controlName) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    }
    return errorMessage;
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  getErrorMessageIndividual(controlName: string): string {
    let erroMsj: any = {
      codigo: {
        required: 'El campo se encuentra vacio'
      },
      nombre: {
        required: 'El campo se encuentra vacio'
      },
      idPais: {
        required: 'Elija un Pais'
      },
      longCelular: {
        required: 'Ingrese Cantidad de digitos'
      },
      longTelefono: {
        required: 'Ingrese Cantidad de digitos'
      }
    };
    let formControl: FormControl = this.formRegionIndividual.get(controlName) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    }
    return errorMessage;
  }
}
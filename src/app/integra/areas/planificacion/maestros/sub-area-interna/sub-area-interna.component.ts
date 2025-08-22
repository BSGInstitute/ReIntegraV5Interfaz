import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

interface listaSubAreaInterna {
  data: subAreaInterna[];
  total: number;
}
interface subAreaInterna {
  total: number;
  id: number;
  nombre: string;
  codigo: string;
  idAreaCC: number;
}
interface areaCentroCosto {
  id: number;
  nombre: string;
  codigo: string;
  total: number;
}

interface filtroPrincipal {
  Filters: filtroContenido[];
  Logic: string;
}

interface filtroContenido {
  Field: string;
  Operator: string;
  Value: string;
}
@Component({
  selector: 'app-sub-area-interna',
  templateUrl: './sub-area-interna.component.html',
  styleUrls: ['./sub-area-interna.component.scss']
})
export class SubAreaInternaComponent implements OnInit {

  @ViewChild('modalSubAreaInternaEditar') modalSubAreaInternaEditar: any;

  gridSubAreasInternas: KendoGrid = new KendoGrid();
  listaAreasCentroCosto: areaCentroCosto[];
  formatoNumerico: string = "n0";
  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;
  
  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]
  
  modalRefEditar: NgbModalRef = null;

  formSubAreaEditar: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [
      Validators.required]
    ],
    codigo: ['', [
      Validators.required]
    ],
    idAreaCC: [0, [
      Validators.required]
    ]
  });

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) { }
  
  ngOnInit(): void {
    this.cargarGrilla();
    this.configuracionInicialGrid();
    this.obtenerSubAreasInternas();
    this.obtenerAreasCentroCosto();
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerAreasCentroCosto(): void {
    this.loaderModal = true;
    this.integraService
    .getJsonResponse(constApiPlanificacion.AreaCentroCostoObtener)
    .subscribe({
        next: (response: HttpResponse<areaCentroCosto[]>) => {
          this.listaAreasCentroCosto = response.body;
          this.loaderModal = false;
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
  configuracionInicialGrid(): void {
    this.gridSubAreasInternas.gridState.skip = 0;
    this.gridSubAreasInternas.gridState.take = 15;
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerSubAreasInternas(): void {
    this.gridSubAreasInternas.loading = true;
    let dataEnviada = {
      Skip: this.gridSubAreasInternas.gridState.skip,
      Take: this.gridSubAreasInternas.gridState.take,
      Sort: this.gridSubAreasInternas.gridState.sort,
      Filter: this.obtenerFiltrado()
    }
    this.integraService
    .postJsonResponse(constApiPlanificacion.SubNivelCcObtenerPorFiltro, dataEnviada)
    .subscribe({
        next: (response: HttpResponse<listaSubAreaInterna>) => {
          this.gridSubAreasInternas.view$.next({
            data: response.body.data,
            total: response.body.total,
          });
          this.gridSubAreasInternas.loading = false;
        },
        error: (e:any) => {
          this.gridSubAreasInternas.loading = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        }
      })
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formSubAreaEditar.reset();
    this.modalRefEditar = this.modalService.open(this.modalSubAreaInternaEditar, { size: 'md', backdrop: 'static' });
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleActualizar(dataSource: subAreaInterna): void {
    this.nuevoRegistro = false;
    this.formSubAreaEditar.setValue({
      id: dataSource.id,
      nombre: dataSource.nombre,
      codigo: Number(dataSource.codigo),
      idAreaCC: dataSource.idAreaCC
    });
    this.modalRefEditar = this.modalService.open(this.modalSubAreaInternaEditar, { size: 'md', backdrop: 'static' });
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  insertar(): void {
    if(this.formSubAreaEditar.valid) {
      let dataEnviada = this.formSubAreaEditar.getRawValue();
          dataEnviada.codigo = dataEnviada.codigo.toString();
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(constApiPlanificacion.SubNivelCcInsertar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<subAreaInterna>) => {
            if(response.body != null) {
              this.obtenerSubAreasInternas();
              this.loaderModal = false;
              this.limpiarCamposForm();
              Swal.fire('¡Registrado!', 'El registro ha sido creado correctamente.', 'success');
            }
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
          }
        });
    }
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  actualizar(): void {
    if(this.formSubAreaEditar.valid) {
      let dataEnviada = this.formSubAreaEditar.getRawValue();
          dataEnviada.codigo = dataEnviada.codigo.toString();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(constApiPlanificacion.SubNivelCcActualizar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<subAreaInterna>) => {
            if(response.body != null) {
              this.obtenerSubAreasInternas();
              this.loaderModal = false;
              this.limpiarCamposForm();
              Swal.fire('¡Actualizado!', 'El registro ha sido actualizado correctamente.', 'success');
            }
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
          }
        });
    }
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  eliminar(dataSource: subAreaInterna): void {
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
          .deleteJsonResponse(`${constApiPlanificacion.SubNivelCcEliminar}/${dataSource.id}`)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if(response.body) {
                this.obtenerSubAreasInternas();
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
  limpiarCamposForm(): void {
    if(this.modalRefEditar != null) {
      this.modalRefEditar.close();;
      this.modalRefEditar = null;
    }
    this.formSubAreaEditar.reset();
    this.loaderModal = false;
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  getErrorMessageEditar(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El campo se encuentra vacio'
      },
      codigo: {
        required: 'El campo se encuentra vacio'
      },
      idAreaCC: {
        required: 'Seleccione un area'
      }
    };
    let formControl: FormControl = this.formSubAreaEditar.get(controlName) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    }
    return errorMessage;
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  cargarGrilla(): void {
    this.gridSubAreasInternas.getDataStateChance$().subscribe({
      next: (resp: any) => {
        this.gridSubAreasInternas.gridState = resp.gridState;
        this.obtenerSubAreasInternas();
      },
    });
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerFiltrado(): filtroPrincipal {
    let gridState: any = this.gridSubAreasInternas.gridState;
    let filtrado: filtroPrincipal;
    if (gridState.filter != null) {
      if (gridState.filter.filters.length > 0) {
        filtrado = {
          Filters: [
            {
              Field: gridState.filter.filters[0].filters[0].field,
              Operator: gridState.filter.filters[0].filters[0].operator,
              Value: gridState.filter.filters[0].filters[0].value,
            }
          ],
          Logic: 'and'
        }
      };
    };
    return filtrado
  }
}
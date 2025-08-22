import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
interface materialAdicionalRegistro {
  id: number;
  idPGeneral: number;
  nombreArchivo: string;
  enlaceArchivo: string;
  esEnlace: boolean;
}
interface coleccionCombos {
  listaPgeneral: Array<IComboBase1>;
  listaPespecifico: Array<comboPespecificos>;
  listaTipoMarcador: Array<IComboBase1>;
}
interface comboPespecificos {
  id: number;
  nombre: string;
  idProgramaGeneral: number;
}
interface materialAdicionalDetalle {
  materialAdicional: Array<materialAdicionalRegistro>;
  listaEspecifico: Array<number>;
}
@Component({
  selector: 'app-material-adicional-aula-virtual',
  templateUrl: './material-adicional-aula-virtual.component.html',
  styleUrls: ['./material-adicional-aula-virtual.component.scss']
})
export class MaterialAdicionalAulaVirtualComponent implements OnInit {

  @ViewChild('modalMaterialAdicional') modalMaterialAdicional: any;
  @ViewChild('selector') selector: ElementRef;
  
  gridMaterialAdicional: KendoGrid = new KendoGrid();
  gridConfiguracionMaterialAdicional: KendoGrid = new KendoGrid();
  nuevoRegistro: boolean = false;
  bloquearPgeneral: boolean = false;
  loaderModal: boolean = false;

  listaCombos: coleccionCombos;
  listaCombosPespecifico: Array<comboPespecificos>;
  listaCombosPgeneral: Array<IComboBase1>;

  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]

  modalRefEditar: NgbModalRef = null;

  formMaterialAdicional: FormGroup = this.formBuilder.group({
    idPGeneral: [0, [
      Validators.required]
    ],
    idsPEspecificos: [0]
  });

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) { }

  ngOnInit(): void {
    this.obtenerMaterialAdicional();
    this.obtenerCombos();
    this.cargarConfiguracionGridMaterialAdicional();
  }
  

  obtenerMaterialAdicional(): void {
    this.gridMaterialAdicional.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.ProgramaGeneralMaterialEstudioAdicionalObtener)
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.gridMaterialAdicional.data = response.body;
          this.gridMaterialAdicional.loading = false;
        },
        error: (e:any) => {
          this.gridMaterialAdicional.loading = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        }
      })
  }
  obtenerCombos(): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.CrucigramaProgramaCapacitacionObtenerCombos)
      .subscribe({
        next: (response: HttpResponse<coleccionCombos>) => {
          this.listaCombos = response.body;
          this.listaCombosPespecifico = response.body.listaPespecifico;
          this.listaCombosPgeneral = response.body.listaPgeneral;
          this.loaderModal = false;
        },
        error: (e:any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        }
      })
  }

  obtenerDetalleConfiguracionMaterial(id: number): Observable<materialAdicionalDetalle> {
    return new Observable<materialAdicionalDetalle>(observer => {
      this.integraService
      .getJsonResponse(`${constApiPlanificacion.ProgramaGeneralMaterialEstudioAdicionalObtenerDetalle}/${id}`)
      .subscribe({
        next: (response: HttpResponse<materialAdicionalDetalle>) => {
          if (response.body) {
            observer.next(response.body);
          } else {
            observer.next(null);
          }
          observer.complete();
          observer.unsubscribe();
        }
      })
    })
  }

  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formMaterialAdicional.reset();
    this.filtrarPespecificos(0);
    this.gridConfiguracionMaterialAdicional.data = [];
    this.bloquearPgeneral = false;
    this.crearNuevoRegistro();
    this.modalRefEditar = this.modalService.open(this.modalMaterialAdicional, { size: 'xl', backdrop: 'static' });
  }

  abrirModalDetalleActualizar(dataSource: IComboBase1): void {
    this.nuevoRegistro = false;
    let detalleConfiguracionCondicion = this.obtenerDetalleConfiguracionMaterial(dataSource.id);
    detalleConfiguracionCondicion.subscribe({
      next: ((res: materialAdicionalDetalle) => {
        this.formMaterialAdicional.setValue({
          idPGeneral: dataSource.id,
          idsPEspecificos: res.listaEspecifico
        });
        this.filtrarPespecificos(dataSource.id);
        this.gridConfiguracionMaterialAdicional.data = res.materialAdicional
        this.bloquearPgeneral = true;

        this.modalRefEditar = this.modalService.open(this.modalMaterialAdicional, { size: 'xl', backdrop: 'static' });
      })
    });
  }
  insertar(): void {
    if(this.formMaterialAdicional.valid && this.gridConfiguracionMaterialAdicional.formGroup.valid) {
      let formMaterialAdicional = this.formMaterialAdicional.getRawValue();
      let formMaterialAdicionalDetalle = { materialRegistro: this.gridConfiguracionMaterialAdicional.data };
      let dataEnviada = Object.assign(formMaterialAdicional, formMaterialAdicionalDetalle);
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(constApiPlanificacion.ProgramaGeneralMaterialEstudioAdicionalInsertarActualizar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<Array<IComboBase1>>) => {
            this.gridMaterialAdicional.data = response.body;
            this.loaderModal = false;
            Swal.fire('¡Registrado!', 'El registro ha sido creado correctamente.', 'success');
            this.limpiarCamposForm();
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          }
        });
    }
  }

  actualizar(): void {
    if(this.formMaterialAdicional.valid) {
      let formMaterialAdicional = this.formMaterialAdicional.getRawValue();
      let formMaterialAdicionalDetalle = { materialRegistro: this.gridConfiguracionMaterialAdicional.data };
      let dataEnviada = Object.assign(formMaterialAdicional, formMaterialAdicionalDetalle);
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(constApiPlanificacion.ProgramaGeneralMaterialEstudioAdicionalInsertarActualizar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<Array<IComboBase1>>) => {
            this.gridMaterialAdicional.data = response.body;
            this.loaderModal = false;
            Swal.fire('¡Actualizado!', 'El registro ha sido actualizado correctamente.', 'success');
            this.limpiarCamposForm();
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          }
        });
    }
  }

  eliminar(dataSource: IComboBase1): void {
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
          .deleteJsonResponse(`${constApiPlanificacion.ProgramaGeneralMaterialEstudioAdicionalEliminar}/${dataSource.id}`)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if(response.body) {
                let idIndice = this.gridMaterialAdicional.data.indexOf(dataSource);
                this.gridMaterialAdicional.data.splice(idIndice, 1);
                this.gridMaterialAdicional.loadData();
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

  limpiarCamposForm(): void {
    if(this.modalRefEditar != null) {
      this.modalRefEditar.close();;
      this.modalRefEditar = null;
    }
    this.formMaterialAdicional.reset();
    this.loaderModal = false;
  }

  crearNuevoRegistro(): void {
    let fila:any = {
      id: 0,
      idPGeneral: 0,
      nombreArchivo: "",
      enlaceArchivo: "",
      esEnlace: false,
    }
    this.gridConfiguracionMaterialAdicional.data.push(fila)
  }
  
  cargarConfiguracionGridMaterialAdicional(): void {
    this.gridConfiguracionMaterialAdicional.cellCloseEvent$.subscribe({
      next: (rpta) => {
        this.gridConfiguracionMaterialAdicional.dataItemEditTemp = null
          rpta.dataItem.nombreArchivo = rpta.formGroupValue.nombreArchivo;
          rpta.dataItem.enlaceArchivo = rpta.formGroupValue.enlaceArchivo;
          rpta.dataItem.esEnlace = rpta.formGroupValue.esEnlace;
        }
      });
      this.gridConfiguracionMaterialAdicional.cellClickEvent$.subscribe({
        next: (rpta) => {
            this.gridConfiguracionMaterialAdicional.dataItemEditTemp = rpta.dataItem
          }
        });
    this.gridConfiguracionMaterialAdicional.formGroup = this.formBuilder.group({
      id: 0,
      idPGeneral: 0,
      nombreArchivo: "",
      enlaceArchivo: "",
      esEnlace: false,
    });
  }
  filtrarPespecificos(idPgeneral: number): void {
    if(idPgeneral != 0){
      this.listaCombos.listaPespecifico = this.listaCombosPespecifico;
      this.listaCombos.listaPespecifico = this.listaCombos.listaPespecifico.filter(x => idPgeneral == x.idProgramaGeneral);
    } else {
      this.listaCombos.listaPespecifico = [];
    }
  }
  filtrarPgeneralBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaCombos.listaPgeneral = this.listaCombosPgeneral.filter(
        s => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaCombos.listaPgeneral = this.listaCombosPgeneral;
    }
  }
  filtrarPespecificoBusqueda(value: string): void {
    let idPgeneral = this.formMaterialAdicional.get('idPGeneral').value;
    if(idPgeneral != null){
      if (value.length >= 1) {
        this.listaCombos.listaPespecifico = this.listaCombosPespecifico.filter(
          s => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 && s.idProgramaGeneral == idPgeneral
        );
      } else {
        this.listaCombos.listaPespecifico = this.listaCombosPespecifico.filter(x => idPgeneral == x.idProgramaGeneral);
      }
    }
  }

  eliminarConfiguracionMaterial(dataSource: materialAdicionalRegistro): void {
    let filaLimpia:boolean = (dataSource.nombreArchivo != "" || dataSource.enlaceArchivo != "") ? false : true
    let idIndice = this.gridConfiguracionMaterialAdicional.data.indexOf(dataSource);
    if(!filaLimpia) {
      Swal.fire({
        title: '¿Está seguro de quitar este archivo?',
        text: '¡Se perdera la informacion!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          this.gridConfiguracionMaterialAdicional.data.splice(idIndice, 1);
        }
      });
    } else {
      this.gridConfiguracionMaterialAdicional.data.splice(idIndice, 1);
    }
    this.gridConfiguracionMaterialAdicional.loadData();
  }
}
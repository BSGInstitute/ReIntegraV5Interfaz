import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
interface materialAdicionalRegistro {
  id: number;
  idMaterialAdicionalAulaVirtual: number;
  nombreArchivo: string;
  rutaArchivo: string;
  esEnlace: boolean;
  soloLectura: boolean;
}
interface materialAdicional {
  id: number;
  nombreConfiguracion: string;
  idPgeneral: number;
  nombre: string;
  esOnline: boolean;
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
  materialAdicional: materialAdicional;
  materialAdicionalRegistro: Array<materialAdicionalRegistro>;
  programaEspecifico: Array<number>;
}

@Component({
  selector: 'app-gestion-material-aula-virtual',
  templateUrl: './gestion-material-aula-virtual.component.html',
  styleUrls: ['./gestion-material-aula-virtual.component.scss']
})
export class GestionMaterialAulaVirtualComponent implements OnInit {

  @ViewChild('modalMaterial') modalMaterial: any;
  @ViewChild('selector') selector: ElementRef;

  gridMaterialAdicional: KendoGrid = new KendoGrid();
  gridConfiguracionMaterial: KendoGrid = new KendoGrid();
  nuevoRegistro: boolean = false;
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

  formMaterial: FormGroup = this.formBuilder.group({
    id: 0,
    nombreConfiguracion: ['', [
      Validators.required,
      TextValidator.noEndSpace,
      TextValidator.noStartSpace]
    ],
    idPgeneral: [[]],
    idsPespecifico: [[]],
    esOnline: [false]
  });
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) { }

  ngOnInit(): void {
    this.obtenerMaterial();
    this.obtenerCombos();
    this.cargarConfiguracionGridMaterial();
  }
  
  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerMaterial(): void {
    this.gridMaterialAdicional.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.MaterialAdicionalObtener)
      .subscribe({
        next: (response: HttpResponse<materialAdicional[]>) => {
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
  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerDetalleConfiguracionMaterial(id: number): Observable<materialAdicionalDetalle> {
    return new Observable<materialAdicionalDetalle>(observer => {
      this.integraService
      .getJsonResponse(`${constApiPlanificacion.MaterialAdicionalObtenerDetalle}/${id}`)
      .subscribe({
        next: (response: HttpResponse<materialAdicionalDetalle>) => {
          if (response.body) {
            response.body.materialAdicionalRegistro = response.body.materialAdicionalRegistro.map(x => {
              return {
                id: x.id,
                idMaterialAdicionalAulaVirtual: x.idMaterialAdicionalAulaVirtual,
                nombreArchivo: x.nombreArchivo,
                rutaArchivo: x.rutaArchivo.replace('%20', ' '),
                esEnlace: x.esEnlace,
                soloLectura: x.soloLectura
              }
            });
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
  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formMaterial.reset();
    this.filtrarPespecificos(0);
    this.gridConfiguracionMaterial.data = [];
    this.crearNuevoRegistro();
    this.modalRefEditar = this.modalService.open(this.modalMaterial, { size: 'xl', backdrop: 'static' });
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleActualizar(dataSource: materialAdicional): void {
    this.nuevoRegistro = false;
    let detalleConfiguracionCondicion = this.obtenerDetalleConfiguracionMaterial(dataSource.id);
    detalleConfiguracionCondicion.subscribe({
      next: ((res: materialAdicionalDetalle) => {
        this.formMaterial.setValue({
          id: dataSource.id,
          nombreConfiguracion: res.materialAdicional.nombreConfiguracion,
          idPgeneral: res.materialAdicional.idPgeneral,
          idsPespecifico: res.programaEspecifico,
          esOnline: res.materialAdicional.esOnline
        });
        this.filtrarPespecificos(res.materialAdicional.idPgeneral);
        this.gridConfiguracionMaterial.data = res.materialAdicionalRegistro

        this.modalRefEditar = this.modalService.open(this.modalMaterial, { size: 'xl', backdrop: 'static' });
      })
    });
  }
  insertar(elementRef: any): void {
    elementRef.focus();
    if(this.formMaterial.valid && this.gridConfiguracionMaterial.formGroup.valid) {
      let formMaterial = this.formMaterial.getRawValue();
          formMaterial.id = 0;
          formMaterial.esOnline = (formMaterial.esOnline != null) ? true : false;
      let formMaterialAdicionalDetalle = { MaterialAdicional: this.gridConfiguracionMaterial.data };
      let dataEnviada = Object.assign(formMaterial, formMaterialAdicionalDetalle);
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(constApiPlanificacion.MaterialAdicionalInsertar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<materialAdicional>) => {
            let nuevaFila: materialAdicional = {
              id: response.body.id,
              nombre: this.listaCombos.listaPgeneral.find(x => x.id == response.body.idPgeneral).nombre,
              nombreConfiguracion: response.body.nombreConfiguracion,
              esOnline: response.body.esOnline,
              idPgeneral: response.body.idPgeneral
            };
            this.gridMaterialAdicional.data.unshift(nuevaFila);
            this.gridMaterialAdicional.loadData();
            this.loaderModal = false;
            Swal.fire('¡Registrado!', 'El registro ha sido creado correctamente.', 'success');
            this.limpiarCamposForm();
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
  actualizar(elementRef: any): void {
    elementRef.focus();
    if(this.formMaterial.valid) {
      let formMaterial = this.formMaterial.getRawValue();
      let formMaterialAdicionalDetalle = { MaterialAdicional: this.gridConfiguracionMaterial.data };
      let dataEnviada = Object.assign(formMaterial, formMaterialAdicionalDetalle);
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(constApiPlanificacion.MaterialAdicionalActualizar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<materialAdicional>) => {
            let data = this.gridMaterialAdicional.data.find((x: materialAdicional) => x.id == dataEnviada.id);
            let index = this.gridMaterialAdicional.data.indexOf(data);
            this.gridMaterialAdicional.data[index].id = response.body.id,
            this.gridMaterialAdicional.data[index].nombre = this.listaCombos.listaPgeneral.find(x => x.id == response.body.idPgeneral).nombre,
            this.gridMaterialAdicional.data[index].nombreConfiguracion = response.body.nombreConfiguracion,
            this.gridMaterialAdicional.data[index].esOnline = response.body.esOnline,
            this.gridMaterialAdicional.data[index].idPgeneral = response.body.idPgeneral

            this.gridMaterialAdicional.loadData();
            this.loaderModal = false;
            Swal.fire('¡Actualizado!', 'El registro ha sido actualizado correctamente.', 'success');
            this.limpiarCamposForm();
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
  eliminar(dataSource: materialAdicional): void {
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
          .deleteJsonResponse(`${constApiPlanificacion.MaterialAdicionalEliminar}/${dataSource.id}`)
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
  /**
   * @author Christian A. Quispe Mamani
   */
  limpiarCamposForm(): void {
    if(this.modalRefEditar != null) {
      this.modalRefEditar.close();;
      this.modalRefEditar = null;
    }
    this.formMaterial.reset();
    this.loaderModal = false;
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  crearNuevoRegistro(): void {
    let fila:any = {
      id: 0,
      IdMaterialAdicionalAulaVirtual: 0,
      nombreArchivo: "",
      rutaArchivo: "",
      esEnlace: false,
      soloLectura: false
    }
    this.gridConfiguracionMaterial.data.push(fila)
  }
  /**
   * @author Christian A. Quispe Mamani
   */
  cargarConfiguracionGridMaterial(): void {
    this.gridConfiguracionMaterial.cellCloseEvent$.subscribe({
      next: (rpta) => {
        this.gridConfiguracionMaterial.dataItemEditTemp = null
          rpta.dataItem.nombreArchivo = rpta.formGroupValue.nombreArchivo;
          rpta.dataItem.rutaArchivo = rpta.formGroupValue.rutaArchivo;
          rpta.dataItem.esEnlace = rpta.formGroupValue.esEnlace;
          rpta.dataItem.soloLectura = rpta.formGroupValue.soloLectura;
        }
      });
    this.gridConfiguracionMaterial.cellClickEvent$.subscribe({
      next: (rpta) => {
          this.gridConfiguracionMaterial.dataItemEditTemp = rpta.dataItem
        }
      });
    this.gridConfiguracionMaterial.formGroup = this.formBuilder.group({
      id: 0,
      IdMaterialAdicionalAulaVirtual: 0,
      nombreArchivo: "",
      rutaArchivo: "",
      esEnlace: false,
      soloLectura: false
    });
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
    let idPgeneral = this.formMaterial.get('idPgeneral').value;
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
  filtrarPespecificos(idPgeneral: number): void {
    if(idPgeneral != 0){
      this.listaCombos.listaPespecifico = this.listaCombosPespecifico;
      this.listaCombos.listaPespecifico = this.listaCombos.listaPespecifico.filter(x => idPgeneral == x.idProgramaGeneral);
    } else {
      this.listaCombos.listaPespecifico = [];
    }
  }
  eliminarConfiguracionMaterial(dataSource: materialAdicionalRegistro): void {
    let filaLimpia:boolean = (dataSource.nombreArchivo != "" || dataSource.rutaArchivo != "") ? false : true
    let idIndice = this.gridConfiguracionMaterial.data.indexOf(dataSource);
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
          this.gridConfiguracionMaterial.data.splice(idIndice, 1);
        }
      });
    } else {
      this.gridConfiguracionMaterial.data.splice(idIndice, 1);
    }
    this.gridConfiguracionMaterial.loadData();
  }
}

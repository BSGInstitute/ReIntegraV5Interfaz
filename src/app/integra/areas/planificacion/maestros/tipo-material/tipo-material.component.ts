import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

interface materialTipo {
  id: number
  nombre: string
  descripcion: string
  listaMaterialAccion: Array<materialTipoAccion>
  listaMaterialVersion: Array<materialTipoVersion>
  listaMaterialCriterioVerificacion: Array<materialTipoCriterio>
}
interface materialTipoAccion {
  idAccion: number
  idMaterialAccion: number
  nombreMaterialAccion: string
}
interface materialTipoVersion {
  idVersion: number
  idMaterialVersion: number
  nombreMaterialVersion: string
}
interface materialTipoCriterio {
  idCriterio: number
  idMaterialCriterioVerificacion: number
  nombreMaterialCriterioVerificacion: string
}

interface coleccionCombos {
  materialAccion: IComboBase1[];
  materialVersion: IComboBase1[];
  materialCriterio: IComboBase1[];
}
@Component({
  selector: 'app-tipo-material',
  templateUrl: './tipo-material.component.html',
  styleUrls: ['./tipo-material.component.scss']
})
export class TipoMaterialComponent implements OnInit {

  @ViewChild('modalTipoMaterialEditar') modalTipoMaterialEditar: any;
  
  gridTipoMateriales: KendoGrid = new KendoGrid();

  listaCombos: coleccionCombos = null;

  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;

  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]

  modalRefEditar: NgbModalRef = null;

  formTipoMaterialEditar: FormGroup = this.formBuilder.group({
    id: [0],
    descripcion: [""],
    nombre: ['', [
      Validators.required]
    ],
    idsMaterialAsociacionVersion: [[]],
    idsMaterialAsociacionAccion: [[]],
    idsMaterialAsociacionCriterioVerificacion: [[]]
  });

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) { }

  ngOnInit(): void {
    this.obtenerTiposMateriales();
    this.obtenerCombos();
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerTiposMateriales(): void {
    this.loaderModal = true;
    this.integraService.getJsonResponse(constApiPlanificacion.MaterialTipoObtener).subscribe({
      next: (response: HttpResponse<materialTipo[]>) => {
        this.loaderModal = false;
        this.gridTipoMateriales.data = response.body;
      },
      error: (e:any) => {
        this.loaderModal = false;
        this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
      }
    })
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerCombos(): void {
    this.loaderModal = true;
    this.integraService.getJsonResponse(constApiPlanificacion.MaterialTipoObtenerCombosModulo).subscribe({
      next: (response: HttpResponse<coleccionCombos>) => {
        this.loaderModal = false;
        this.listaCombos = response.body;
      },
      error: (e:any) => {
        this.loaderModal = false;
        this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
      }
    })
  }
  
  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formTipoMaterialEditar.reset();
    this.formTipoMaterialEditar.patchValue({
      id: 0,
      descripcion: "",
      idsMaterialAsociacionVersion: [],
      idsMaterialAsociacionAccion: [],
      idsMaterialAsociacionCriterioVerificacion: []
    });
    this.modalRefEditar = this.modalService.open(this.modalTipoMaterialEditar, { size: 'md', backdrop: 'static' });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleActualizar(dataSource: materialTipo) {
    this.nuevoRegistro = false;
    let idsAcciones:number[] = dataSource.listaMaterialAccion.filter(x => x.idAccion != null).map(x => x.idMaterialAccion);
    let idsVersiones:number[] = dataSource.listaMaterialVersion.filter(x => x.idVersion != null).map(x => x.idMaterialVersion);
    let idsCriterios:number[] = dataSource.listaMaterialCriterioVerificacion.filter(x => x.idCriterio != null).map(x => x.idMaterialCriterioVerificacion);
    this.formTipoMaterialEditar.setValue({
      id: dataSource.id,
      nombre: dataSource.nombre,
      descripcion: "",
      idsMaterialAsociacionVersion: idsVersiones,
      idsMaterialAsociacionAccion: idsAcciones,
      idsMaterialAsociacionCriterioVerificacion: idsCriterios
    });
    this.modalRefEditar = this.modalService.open(this.modalTipoMaterialEditar, { size: 'md', backdrop: 'static' });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  eliminar(dataSource: materialTipo) {
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
          .deleteJsonResponse(`${constApiPlanificacion.MaterialTipoEliminar}/${dataSource.id}`)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if(response.body) {
                let idIndice = this.gridTipoMateriales.data.indexOf(dataSource);
                this.gridTipoMateriales.data.splice(idIndice, 1);
                this.gridTipoMateriales.loadData();
                Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
              } else {
                Swal.fire('Error', 'Surgio un error al eliminar el registro.', 'error');
              }
              this.loaderModal = false;
            },
            error: (e:any) => {
              this.loaderModal = false;
              this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
            }
          })
        }
    });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  insertar(): void {
    if(this.formTipoMaterialEditar.valid) {
      let dataEnviada = this.formTipoMaterialEditar.getRawValue();
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(constApiPlanificacion.MaterialTipoInsertar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<materialTipo>) => {
            let nuevaFila: materialTipo = {
              id: response.body.id,
              nombre: response.body.nombre, 
              descripcion: response.body.descripcion,
              listaMaterialAccion: response.body.listaMaterialAccion,
              listaMaterialVersion: response.body.listaMaterialVersion,
              listaMaterialCriterioVerificacion: response.body.listaMaterialCriterioVerificacion
            };
            this.gridTipoMateriales.data.unshift(nuevaFila);
            this.gridTipoMateriales.loadData();
            this.loaderModal = false;
            this.limpiarCamposForm();
            Swal.fire('¡Registrado!', 'El registro ha sido creado correctamente.', 'success');
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
    if(this.formTipoMaterialEditar.valid) {
      let dataEnviada = this.formTipoMaterialEditar.getRawValue();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(constApiPlanificacion.MaterialTipoActualizar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<materialTipo>) => {
            let data = this.gridTipoMateriales.data.find((x: materialTipo) => x.id == dataEnviada.id);
            let index = this.gridTipoMateriales.data.indexOf(data);

            this.gridTipoMateriales.data[index].id = response.body.id;
            this.gridTipoMateriales.data[index].nombre = response.body.nombre;
            this.gridTipoMateriales.data[index].descripcion = response.body.descripcion;
            this.gridTipoMateriales.data[index].listaMaterialAccion = response.body.listaMaterialAccion;
            this.gridTipoMateriales.data[index].listaMaterialVersion = response.body.listaMaterialVersion;
            this.gridTipoMateriales.data[index].listaMaterialCriterioVerificacion = response.body.listaMaterialCriterioVerificacion;
            
            this.gridTipoMateriales.loadData();
            this.loaderModal = false;
            this.limpiarCamposForm();
            Swal.fire('¡Actualizado!', 'El registro ha sido actualizado correctamente.', 'success')
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
  limpiarCamposForm(): void {
    if(this.modalRefEditar != null) {
      this.modalRefEditar.close();;
      this.modalRefEditar = null;
    }
    this.formTipoMaterialEditar.reset();
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
      idsMaterialAsociacionAccion: {
        required: 'Seleccione una opcion'
      },
      idsMaterialAsociacionVersion: {
        required: 'Seleccione una opcion'
      },
      idsMaterialAsociacionCriterioVerificacion: {
        required: 'Seleccione una opcion'
      }
    };
    let formControl: FormControl = this.formTipoMaterialEditar.get(controlName) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    }
    return errorMessage;
  }
}

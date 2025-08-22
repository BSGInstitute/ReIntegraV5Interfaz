import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';

interface versionMaterial {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-version-material',
  templateUrl: './version-material.component.html',
  styleUrls: ['./version-material.component.scss']
})
export class VersionMaterialComponent implements OnInit {

  @ViewChild('modalVersionMaterialEditar') modalVersionMaterialEditar: any;
  
  gridTipoMateriales: KendoGrid = new KendoGrid();

  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;

  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]

  modalRefEditar: NgbModalRef = null;

  formVersionMaterialEditar: FormGroup = this.formBuilder.group({
    id: [0],
    descripcion: [""],
    nombre: ['', [
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace]
    ]
  });

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) { }

  ngOnInit(): void {
    this.obtenerVerionesMateriales();
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerVerionesMateriales(): void {
    this.loaderModal = true;
    this.integraService.getJsonResponse(constApiPlanificacion.MaterialVersionObtener).subscribe({
      next: (response: HttpResponse<any[]>) => {
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
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formVersionMaterialEditar.reset();
    this.formVersionMaterialEditar.patchValue({
      id: 0,
      descripcion: ""
    });
    this.modalRefEditar = this.modalService.open(this.modalVersionMaterialEditar, { size: 'md', backdrop: 'static' });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleActualizar(dataSource: versionMaterial) {
    this.nuevoRegistro = false;
    this.formVersionMaterialEditar.setValue({
      id: dataSource.id,
      nombre: dataSource.nombre,
      descripcion: ""
    });
    this.modalRefEditar = this.modalService.open(this.modalVersionMaterialEditar, { size: 'md', backdrop: 'static' });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  eliminar(dataSource: versionMaterial) {
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
          .deleteJsonResponse(`${constApiPlanificacion.MaterialVersionEliminar}/${dataSource.id}`)
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
    if(this.formVersionMaterialEditar.valid) {
      let dataEnviada = this.formVersionMaterialEditar.getRawValue();
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(constApiPlanificacion.MaterialVersionInsertar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<versionMaterial>) => {
            let nuevaFila: versionMaterial = {
              id: response.body.id,
              nombre: response.body.nombre, 
              descripcion: response.body.descripcion
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
    if(this.formVersionMaterialEditar.valid) {
      let dataEnviada = this.formVersionMaterialEditar.getRawValue();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(constApiPlanificacion.MaterialVersionActualizar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<versionMaterial>) => {
            let data = this.gridTipoMateriales.data.find((x: versionMaterial) => x.id == dataEnviada.id);
            let index = this.gridTipoMateriales.data.indexOf(data);

            this.gridTipoMateriales.data[index].id = response.body.id;
            this.gridTipoMateriales.data[index].nombre = response.body.nombre;
            this.gridTipoMateriales.data[index].descripcion = response.body.descripcion;
            
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
    this.formVersionMaterialEditar.reset();
    this.loaderModal = false;
  }
  
  /**
   * @author Christian A. Quispe Mamani
   */
  getErrorMessageEditar(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El campo se encuentra vacio',
        noStartSpace: 'Caracter inicial invalido',
        noEndSpace: 'Caracter final invalido'
      }
    };
    let formControl: FormControl = this.formVersionMaterialEditar.get(controlName) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    }
    return errorMessage;
  }
}


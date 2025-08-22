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

interface tipoFeedback {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-tipo-feedback-aulavirtual',
  templateUrl: './tipo-feedback-aulavirtual.component.html',
  styleUrls: ['./tipo-feedback-aulavirtual.component.scss']
})
export class TipoFeedbackAulavirtualComponent implements OnInit {

  @ViewChild('modalTipoFeedbackEditar') modalTipoFeedbackEditar: any;

  gridTiposFeedback: KendoGrid = new KendoGrid();
  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;
  
  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]
  
  modalRefEditar: NgbModalRef = null;

  formTipoFeedback: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [
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
    this.obtenerTiposFeedback();
  }

  obtenerTiposFeedback(): void {
    this.gridTiposFeedback.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.FeedbackTipoObtener)
      .subscribe({
        next: (response: HttpResponse<tipoFeedback[]>) => {
          this.gridTiposFeedback.data = response.body;
          this.gridTiposFeedback.loading = false;
        },
        error: (e:any) => {
          this.gridTiposFeedback.loading = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        }
      })
  }

  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formTipoFeedback.reset();
    this.modalRefEditar = this.modalService.open(this.modalTipoFeedbackEditar, { size: 'md', backdrop: 'static' });
  }

  abrirModalDetalleActualizar(dataSource: tipoFeedback): void {
    this.nuevoRegistro = false;
    this.formTipoFeedback.setValue({
      id: dataSource.id,
      nombre: dataSource.nombre
    });
    this.modalRefEditar = this.modalService.open(this.modalTipoFeedbackEditar, { size: 'md', backdrop: 'static' });
  }

  insertar(): void {
    if(this.formTipoFeedback.valid) {
      let dataEnviada = this.formTipoFeedback.getRawValue();
          dataEnviada.id = 0;
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(constApiPlanificacion.FeedbackTipoInsertar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<tipoFeedback>) => {
            let nuevaFila: tipoFeedback = {
              id: response.body.id,
              nombre: response.body.nombre
            };
            this.gridTiposFeedback.data.unshift(nuevaFila);
            this.gridTiposFeedback.loadData();
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

  actualizar(): void {
    if(this.formTipoFeedback.valid) {
      let dataEnviada = this.formTipoFeedback.getRawValue();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(constApiPlanificacion.FeedbackTipoActualizar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<tipoFeedback>) => {
            let data = this.gridTiposFeedback.data.find((x: tipoFeedback) => x.id == dataEnviada.id);
            let index = this.gridTiposFeedback.data.indexOf(data);
            this.gridTiposFeedback.data[index].id = response.body.id;
            this.gridTiposFeedback.data[index].nombre = response.body.nombre;
            this.gridTiposFeedback.loadData();
            this.loaderModal = false;
            this.limpiarCamposForm();
            Swal.fire('¡Actualizado!', 'El registro ha sido actualizado correctamente.', 'success');
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
          }
        });
    }
  }
  
  eliminar(dataSource: tipoFeedback): void {
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
          .deleteJsonResponse(`${constApiPlanificacion.FeedbackTipoEliminar}/${dataSource.id}`)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if(response.body) {
                let idIndice = this.gridTiposFeedback.data.indexOf(dataSource);
                this.gridTiposFeedback.data.splice(idIndice, 1);
                this.gridTiposFeedback.loadData();
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
    this.formTipoFeedback.reset();
    this.loaderModal = false;
  }

  getErrorMessageEditar(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El campo se encuentra vacio'
      }
    };
    let formControl: FormControl = this.formTipoFeedback.get(controlName) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    }
    return errorMessage;
  }
}
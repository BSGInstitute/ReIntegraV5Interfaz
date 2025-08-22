import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';

interface EscalaCalificacionDetalle {
  id: number;
  nombre: string;
  valor: number;
}
interface EscalaCalificacion {
  id: number;
  nombre?: string;
  escalaCalificacionDetalles: EscalaCalificacionDetalle[];
}
/**
 * @module PlanificacionModule
 * @description Componente de Escala Calificacion
 * @author Gretel Canasa
 * @version 1.0.0
 * @history
 * * 05/02/2023 Implementacion de Crud de Escala Calificacion
 **/
@Component({
  selector: 'app-escala-calificacion',
  templateUrl: './escala-calificacion.component.html',
})
export class EscalaCalificacionComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef

  ) {}

  isNew: boolean = false;
  loaderModal: boolean = false;
  modalRef: any;
  gridEscalaCalificacion = new KendoGrid();
  gridEscalaCalificacionDetalle = new KendoGrid();
  subscription$: Subscription = new Subscription();
  controlNombreEscalaCalificacion = new FormControl([null, Validators.required])
  // nombreEscalaCalificacion = '';

  ngOnInit(): void {
    this.configurarGrid();
    this.obtener();
  }

  ngOnDestroy(): void {}

  obtener() {
    this.gridEscalaCalificacion.data = [];
    this.gridEscalaCalificacion.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.EscalaCalificacionObtener)
      .subscribe({
        next: (resp: HttpResponse<EscalaCalificacion[]>) => {
          this.gridEscalaCalificacion.loading = false;
          console.log(resp.body);
          this.gridEscalaCalificacion.data = resp.body;
          //this.gridEscalaCalificacionDetalle.data =
        },
        error: (error) => {
          console.log(error);
          this.gridEscalaCalificacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  abrirModalEscalaCalificacion(
    context: any,
    isNew: boolean,
    dataItem?: EscalaCalificacion
  ) {
    this.isNew = isNew;
    this.controlNombreEscalaCalificacion.reset();
    if (!isNew) {
      this.gridEscalaCalificacion.dataItemEditTemp = dataItem;
      this.gridEscalaCalificacionDetalle.data = dataItem.escalaCalificacionDetalles.map(x=>x)
      this.controlNombreEscalaCalificacion.setValue(dataItem.nombre);
    } else {
      this.gridEscalaCalificacionDetalle.data = []
      this.gridEscalaCalificacion.dataItemEditTemp = null;
    }
    this.modalRef = this.modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  guardarEscalaCalificacion() {
    console.log(
      'ingreso para insertarse',
      this.controlNombreEscalaCalificacion.value
    );
    if (this.controlNombreEscalaCalificacion.valid) {
      console.log('ENTRO IF', this.controlNombreEscalaCalificacion);
      let jsonEnvio = this.procesarEscalaCalificacion();
      this.gridEscalaCalificacion.loading = true;
      this.loaderModal = true;
      this.controlNombreEscalaCalificacion.disable();
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.EscalaCalificacionInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<EscalaCalificacion>) => {
            this.gridEscalaCalificacion.loading = false;
            this.loaderModal = false;
            this.gridEscalaCalificacion.data.unshift(resp.body);
            this.gridEscalaCalificacion.loadData();
            this.modalRef.close();
            this.alertaService.mensajeExitoso();
            this.controlNombreEscalaCalificacion.enable();
            //this.obtener();
          },
          error: (error) => {
            this.loaderModal = false;
            this.controlNombreEscalaCalificacion.enable();
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo guardar el Curso Moodle',
              text: mensaje,
            });
            this.gridEscalaCalificacion.loading = false;
          },
        });
    } else {
      this.controlNombreEscalaCalificacion.markAllAsTouched();
    }
  }

  actualizarEscalaCalificacion() {
    if (this.controlNombreEscalaCalificacion.valid) {
      let jsonEnvio = this.procesarEscalaCalificacion();
      this.gridEscalaCalificacion.loading = true;
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.EscalaCalificacionActualizar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<EscalaCalificacion>) => {
            this.gridEscalaCalificacion.loading = false;
            this.gridEscalaCalificacion.assignValues(
              this.gridEscalaCalificacion.dataItemEditTemp,
              resp.body
            );
            this.gridEscalaCalificacion.loadData();
            this.modalRef.close();
            this.loaderModal = false;
            this.alertaService.mensajeExitoso();
            //this.obtener();
          },
          error: (error) => {
            this.modalRef.close();
            this.loaderModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(error.message);
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'No se pudo actualizar el Curso Moodle',
              text: mensaje,
            });
            this.gridEscalaCalificacion.loading = false;
          },
        });
    } else {
      this.controlNombreEscalaCalificacion.markAllAsTouched();
    }
  }

  procesarEscalaCalificacion(): EscalaCalificacion {
    let EscalaCalificacion: EscalaCalificacion = {
      id: this.isNew ? 0 : this.gridEscalaCalificacion.dataItemEditTemp.id,
      nombre: this.controlNombreEscalaCalificacion.value as string,
      escalaCalificacionDetalles: this.gridEscalaCalificacionDetalle.data as EscalaCalificacionDetalle[]
    };
    return EscalaCalificacion;
  }

  eliminar(id: number, index: number) {
    this.gridEscalaCalificacion.loading = true;
    this.integraService
      .deleteJsonResponse(
        `${constApiPlanificacion.EscalaCalificacionEliminar}/${id}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          console.log(resp.body);
          this.gridEscalaCalificacion.loading = false;
          if (resp.body) {
            this.gridEscalaCalificacion.data.splice(index, 1);
            this.alertaService.mensajeIcon(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
            this.gridEscalaCalificacion.data = [ ...this.gridEscalaCalificacion.data ];
            //this.obtener();
          }
        },
        error: (error) => {
          console.log(error);
          this.gridEscalaCalificacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  configurarGrid() {
    this.gridEscalaCalificacion.getRemoveEvent$().subscribe({
      next: (resp) => {
        console.log(resp);
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminar(resp.dataItem.id, resp.index);
          }
        });
      },
    });
    this.gridEscalaCalificacionDetalle.formGroup = this.formBuilder.group({
      nombre: [null, [Validators.required]],
      valor: [null, [Validators.required]]
    });
    this.gridEscalaCalificacionDetalle.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.alertaService.mensajeEliminar().then((result) => {
          if(result.isConfirmed){
            this.gridEscalaCalificacionDetalle.data.splice(resp.index,1);
            this.gridEscalaCalificacionDetalle.data = [ ...this.gridEscalaCalificacionDetalle.data ];
          }
        });
      },
    });
    this.gridEscalaCalificacionDetalle.getSaveEvent$().subscribe({
      next: (resp) => {
        let newData = Object.assign({id: 0}, resp.dataForm)
        this.gridEscalaCalificacionDetalle.data = [newData, ...this.gridEscalaCalificacionDetalle.data ];
        //this.cdr.markForCheck();
      },
    });
  }
}

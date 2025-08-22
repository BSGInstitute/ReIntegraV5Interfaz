import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiComercial } from '@environments/constApi';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { gridSemaforoDetalle } from '../grid-columns-semaforo';
import { ModalContentSFDetalleVariableComponent } from '../modal-content-sfdetalle-variable/modal-content-sfdetalle-variable.component';

@Component({
  selector: 'app-modal-content-sfdetalle',
  templateUrl: './modal-content-sfdetalle.component.html',
  styleUrls: ['./modal-content-sfdetalle.component.scss'],
})

export class ModalContentSFDetalleComponent implements OnInit {
  @Input() isNew: boolean = false;
  @Input() listaMoneda: any[] = [];
  @Input() semaforoTemporal: any;
  @Input() listaPais: any[] = [];
  @Input() loaderModal: boolean = false;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal
  ) {}

  listaDetalleSemaforo: any[] = [];
  private deleteItemSemaforoDetalle: any[] = [];


  formSemaforoFinanciero: FormGroup = this.formBuilder.group({
    id: [0],
    codigoPais: [null, Validators.required],
    activo: [false],
  });
  semaforoDetalleTemporal: any;
  loaderGrid: boolean = false;
  gridSemaforoDetalle = gridSemaforoDetalle;
  // semaforoDetalleVariable: any[] = [];

  formGridEditable: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', Validators.required],
    mensaje: ['', Validators.required],
    color: [''],
  });

  modalRef: NgbModalRef;

  ngOnInit(): void {
    if (!this.isNew) {
      let params: Parametro[] = [
        { clave: 'id', valor: this.semaforoTemporal.id },
      ];
      this.integraService
        .obtenerPorPathParams(
          constApiComercial.SemaforoFinancieroDetalleObtener,
          params
        )
        .subscribe({
          next: (response: HttpResponse<any[]>) => {
            this.listaDetalleSemaforo = response.body;
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {},
        });
    } else {
      this.listaDetalleSemaforo = [];
    }
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formSemaforoFinanciero.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      codigoPais: { required: 'Seleccione un Pais' },
    };
    let formControl: FormControl = this.formSemaforoFinanciero.get(
      controlName
    ) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    return null;
  }

  openModalSemaforoDetalleConfiguracion(param: any) {
    console.log(param.dataItem);
    this.semaforoDetalleTemporal = param.dataItem;

    this.modalRef = this.modalService.open(
      ModalContentSFDetalleVariableComponent,
      { size: 'xl', backdrop: 'static' }
    );
    this.modalRef.componentInstance.listaMoneda =
      this.listaMoneda;
    this.modalRef.componentInstance.semaforoDetalleTemporal = param.dataItem;

    this.modalRef.componentInstance.obtenerSemaforoDetalle.subscribe({
      next: (response: any) => {
        console.log(response);
        this.listaDetalleSemaforo.forEach(element => {
          if(element.id == response.id){
            element = Object.assign(element, response);
            console.log(element);
          }
        });
      }
    });
  }

  addSemaforoFinancieroDetalle(param: any) {
    let data = param.dataForm;
    let semaforoDetalleNuevo = {
      id: 0,
      color: data.color,
      fechaCreacion: new Date(),
      fechaModificacion: new Date(),
      idSemaforoFinanciero: param.isNew ? 0 : this.semaforoTemporal.id,
      mensaje: data.mensaje,
      nombre: data.nombre,
      usuarioCreacion: 'fmamanif',
      usuarioModificacion: 'fmamanif',
    };

    this.listaDetalleSemaforo.splice(0, 0, semaforoDetalleNuevo);
    this.listaDetalleSemaforo = this.listaDetalleSemaforo.slice();
  }

  guardarSemaforoDetalle() {
    this.activeModal.close();
  }
  cerrarModalSemaforoDetalle() {
    this.activeModal.close();
  }

  eliminarSemaforoDetalle(dataItem: any, index: number){
    this.deleteItemSemaforoDetalle.push(dataItem);
    this.listaDetalleSemaforo.splice(index, 1);
  }

  gridEventsSemaforoDetalle(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'remove':
        this.alertaService.mensajeEliminarTemporal().then((result) => {
          if (result.isConfirmed) {
            this.eliminarSemaforoDetalle(e.dataItem, e.index);
          }
        });
        break;
      case 'cancelRemove':
        break;
      case 'save':
        this.addSemaforoFinancieroDetalle(e);
        break;
      case 'edit':
        this.openModalSemaforoDetalleConfiguracion(e);
        break;
    }
  }
}

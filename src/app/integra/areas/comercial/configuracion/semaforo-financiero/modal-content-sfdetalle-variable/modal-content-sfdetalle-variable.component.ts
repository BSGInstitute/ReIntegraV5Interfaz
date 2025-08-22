import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiComercial } from '@environments/constApi';
import { SemaforoFinancieroDetalleV2, SemaforoFinancieroDetalleVariable } from '@integra/models/semaforo-financiero';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { gridSemaforoDetalleConfiguracion } from '../grid-columns-semaforo';

const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';
const cloneData = (data: any[]) => data.map((item) => Object.assign({}, item));

function ObjCompare(obj1: any, obj2: any) {
  const Obj1_keys = Object.keys(obj1);
  const Obj2_keys = Object.keys(obj2);
  if (Obj1_keys.length !== Obj2_keys.length) {
    return false;
  }
  for (let k of Obj1_keys) {
    if (obj1[k] !== obj2[k]) {
      return false;
    }
  }
  return true;
}

@Component({
  selector: 'app-modal-content-sfdetalle-variable',
  templateUrl: './modal-content-sfdetalle-variable.component.html',
  styleUrls: ['./modal-content-sfdetalle-variable.component.scss'],
})
export class ModalContentSFDetalleVariableComponent implements OnInit {

  @Input() listaMoneda: any[] = [];
  @Input() semaforoDetalleTemporal: any;
  @Output() obtenerSemaforoDetalle = new EventEmitter<any>();;

  listaSemaforoDetalleVariable: any[] = [];
  listaSemaforoDetalleVariableOriginal: any[] = [];
  semaforoDetalle: SemaforoFinancieroDetalleV2;
  isNew: boolean = false;
  private updatedItemsDetalleConfiguracion: any[] = [];

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public alertaService: AlertaService,
  ) {}

  successIcon: string = iconInputValidation;
  loaderGrid: boolean = false;

  formSemaforoDetalleVariable: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', Validators.required],
    mensaje: ['', Validators.required],
    color: null,
  });

  gridSemaforoDetalleConfiguracion = gridSemaforoDetalleConfiguracion;
  formGridEditable: FormGroup = this.formBuilder.group({
    id: 0,
    variable: '',
    valorMinimo: 0,
    valorMaximo: 0,
    idMoneda: null,
    unidad: '',
  });

  ngOnInit(): void {
    console.log(this.semaforoDetalleTemporal);
    this.formSemaforoDetalleVariable.patchValue(this.semaforoDetalleTemporal);
    let params: Parametro[] = [
      {
        clave: 'IdSemaforoFinancieroDetalle',
        valor: this.semaforoDetalleTemporal.id,
      },
    ];
    this.loaderGrid = true;
    this.integraService
      .obtenerPorPathParams(
        constApiComercial.SemaforoFinancieroDetalleVariableObtenerPorIdSemaforoFinancieroDetalle,
        params
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listaSemaforoDetalleVariable = response.body;
          this.listaSemaforoDetalleVariableOriginal = cloneData(response.body);
          this.loaderGrid = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        }
      });
  }

  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formSemaforoDetalleVariable.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formSemaforoDetalleVariable.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }

  valueChangeMoneda(event: any){
    console.log(event);
    this.listaMoneda.find(e => e.id == event);

    // this.list
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: { required: 'Ingrese un Nombre' },
      mensaje: { required: 'Ingrese un Mensaje' },
    };
    let formControl: FormControl = this.formSemaforoDetalleVariable.get(
      controlName
    ) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    return null;
  }

  editarCeldaGridSemaforoDetalle(param: any) {
    let index = this.listaSemaforoDetalleVariable.findIndex(
      (e) => e.id == param.dataItem.id
    );
    if (
      param.formGroupValue.idMoneda != null &&
      param.formGroupValue.idMoneda != 0
    ) {
      let moneda = this.listaMoneda.find(
        (e) => e.id == param.formGroupValue.idMoneda
      );
      param.formGroupValue.unidad = moneda.nombrePlural;
      this.listaSemaforoDetalleVariable[index].unidad = moneda.nombrePlural;
    }
    const itemIndex = this.updatedItemsDetalleConfiguracion.findIndex(
      (e) => e.id == param.dataItem.id
    );
    let objExists = ObjCompare(
      param.formGroupValue,
      this.listaSemaforoDetalleVariableOriginal[index]
    );
    if (itemIndex != -1) {
      if (!objExists) {
        this.updatedItemsDetalleConfiguracion.splice(
          itemIndex,
          1,
          this.listaSemaforoDetalleVariable[index]
        );
      } else {
        this.updatedItemsDetalleConfiguracion.splice(itemIndex, 1);
      }
    } else {
      if (!objExists) {
        this.updatedItemsDetalleConfiguracion.push(
          this.listaSemaforoDetalleVariable[index]
        );
      }
    }
    console.log(this.updatedItemsDetalleConfiguracion);
    // this.updatedItemsDetalleConfiguracion;
  }

  guardarSemaforoDetalleVariable() {
    this.procesarSemafotoDetalle();
    this.obtenerSemaforoDetalle.emit(this.procesarSemafotoDetalle());
    this.activeModal.close();
  }

  cerrarModalSemaforoDetalleVariable() {
    this.activeModal.close();
  }

  procesarSemafotoDetalle(){
    let formValue = this.formSemaforoDetalleVariable.getRawValue();
    this.semaforoDetalle  = {
      id: this.semaforoDetalleTemporal.id,
      nombre: formValue.nombre,
      mensaje: formValue.mensaje,
      color: formValue.color,
      usuario: this.semaforoDetalleTemporal.usuarioCreacion,
      actualizar: this.isNew ? 0 : 1,
      variable: []
    }

    this.listaSemaforoDetalleVariable.forEach(element => {
      let data: SemaforoFinancieroDetalleVariable = {
        id: element.id,
        idSemaforoFinancieroDetalle: element.idSemaforoFinancieroDetalle,
        idSemaforoFinancieroVariable: element.idSemaforoFinancieroVariable,
        variable: element.variable,
        valorMinimo: element.valorMinimo,
        valorMaximo:element.valorMaximo,
        idMoneda: element.idMoneda,
        unidad: element.unidad,
        aplicaUnidad: element.aplicaUnidad,
      }
      this.semaforoDetalle.variable.push(data);
    });

    return this.semaforoDetalle;
  }

  gridEventsSemaforoDetalleVariable(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'remove':
        // this.eliminar(e.data);
        break;
      case 'cellClose':
        this.editarCeldaGridSemaforoDetalle(e);
        break;
    }
  }
}

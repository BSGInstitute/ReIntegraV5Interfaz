import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi } from '@environments/constApi';
import { Periodos,PeriodosEnvio } from '@integra/models/periodo';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { map } from 'rxjs';
import Swal from 'sweetalert2';
import { GridPeriodos } from './grid-periodos';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.scss']
})
export class PeriodosComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {}

  formGroupPeriodos: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['',[
      Validators.required,
      TextValidator.noStartSpace,
      TextValidator.noEndSpace,
      ]
    ],
    fechaInicial: ['', Validators.required],
    fechaFin:['', Validators.required],
    fechaInicialFinanzas: ['', Validators.required],
    fechaFinFinanzas: ['', Validators.required],
    fechaInicialRepIngresos:['', Validators.required],
    fechaFinRepIngresos: ['', Validators.required],

  });

//// variables------------------------------
  successIcon: string = iconInputValidation;
  loaderModal: boolean = false;
  modalRef:any;
  loader: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';

  listaPeriodos:Periodos[]=[]

  gridPeriodos = new GridPeriodos();
  @ViewChild('modalPeriodos') modalPeriodos: any;

  ngOnInit(): void {
    this.obtenerListaPeriodos()
  }

  //funciones---------------------
  obtenerListaPeriodos(){
    this.listaPeriodos=[];
    this.loader=true
    this.integraService.obtenerTodo(constApi.PeriodosObtener)
    .pipe(
      map((resp: any) =>
        resp.body.map((item: any) => ({
            ...item,
            fechaInicial: new Date(item.fechaInicial),
            fechaFin: new Date(item.fechaFin),
            fechaInicialFinanzas: new Date(item.fechaInicialFinanzas),
            fechaFinFinanzas: new Date(item.fechaFinFinanzas),
            fechaInicialRepIngresos: new Date(item.fechaInicialRepIngresos),
            fechaFinRepIngresos: new Date(item.fechaFinRepIngresos)
          }
        ))
      )
    )
    .subscribe({
      next: (response:Periodos[]) => {
        this.listaPeriodos=response;
        this.loader = false;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El nombre del periodo es necesario!',
        noStartSpace: 'El nombre del periodo  no puede empezar con espacio!',
        noEndSpace: 'El nombre del periodo  no puede terminar con espacio!',},
      fechaInicial: {
        required: 'Seleccione una fecha inicial, es necesario!'},
      fechaFin: {
        required: 'Seleccione una fecha fin, es necesario!'},
      fechaInicialFinanzas: {
        required: 'Seleccione una fecha inicial finanzas, es necesario!'},
      fechaFinFinanzas: {
        required: 'Seleccione una fecha fin(finanzas), es necesario!'},
      fechaInicialRepIngresos: {
        required: 'Seleccione una fecha inicial(Rep. Ingresos), es necesario!'},
      fechaFinRepIngresos: {
        required: 'Seleccione una fecha fin(Rep. Ingresos) es necesario!'}

    };
    let formControl: FormControl = this.formGroupPeriodos.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }
    if (formControl.hasError('validNumeroCuenta')) {
      return erroMsj[controlName].validNumeroCuenta;
    }
    return null;
  }
  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        console.log(this.formGroupPeriodos.getRawValue());
        this.insertarPeriodos();
        break;
      case 'Actualizar':
        console.log(this.formGroupPeriodos.getRawValue());
        this.actualizarPeriodos();

        break;
    }
  }

  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formGroupPeriodos.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGroupPeriodos.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }

  mostrarMensajeError(error: any): void {
    this.loader = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  msgEliminar(dataItem:Periodos,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el Periodo?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarPeriodos(dataItem,index);
      }
    });
  }
  openModalPeriodos(isNew: boolean, data?: any) {
    if (!isNew) {
      this.formGroupPeriodos.reset();
      this.formGroupPeriodos.patchValue(data.dataItem);
    } else {
      this.formGroupPeriodos.reset();
    }
    this.modalRef=this.modalService.open(this.modalPeriodos);
  }
  validFormPeriodos(): boolean {
    if(this.formGroupPeriodos.invalid){
      this.formGroupPeriodos.markAllAsTouched();
      return false;
    }
    return true;
  }
  mostrarMensajeExitoso(){
    this.loader = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute'
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    Toast.fire({
      icon: 'success',
      title: 'Guardado con exito'
    })
  }
  procesarDataPeriodos(item: Periodos, isNew: boolean): PeriodosEnvio {
    let PeriodosEnvio:PeriodosEnvio = {
      id: isNew ? 0 : item.id,
      nombre: item.nombre,
      fechaInicial: item.fechaInicial,
      fechaFin:item.fechaFin,
      fechaInicialFinanzas: item.fechaInicialFinanzas,
      fechaFinFinanzas:item.fechaFinFinanzas,
      fechaInicialRepIngresos: item.fechaInicialRepIngresos,
      fechaFinRepIngresos: item.fechaFinRepIngresos,
      usuario: '--'
    };
    return PeriodosEnvio;
  }

  /*---------------- Acciones CRUD Periodos------------------*/

  insertarPeriodos() {
    if(this.validFormPeriodos())
    {
      this.loaderModal = true;
      let datosFormularioCuentaBacaria = this.formGroupPeriodos.getRawValue();
      let PeriodosEnvio: PeriodosEnvio;
      PeriodosEnvio = this.procesarDataPeriodos(datosFormularioCuentaBacaria, true);
      this.integraService
        .insertar(constApi.PeriodosInsertar, PeriodosEnvio)
        .subscribe({
          next: (response: HttpResponse<Periodos>) => {
            PeriodosEnvio.id=response.body.id;
            this.listaPeriodos.unshift(PeriodosEnvio);
            this.loaderModal = true;
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalService.dismissAll(this.modalPeriodos);
            this.mostrarMensajeExitoso();

          },
      });
    }
  }

eliminarPeriodos(dataItem: Periodos, index: number) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: '--' },
    ];
    this.integraService
      .eliminarPorPathParams(constApi.PeriodosEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaPeriodos.splice(index, 1);
            this.loader = false;
            Swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
          }
        },
        error: (error) => {
          this.loader = false;
          this.mostrarMensajeError(error);
        },
        complete: () => { },
      });
  }
  actualizarPeriodos() {
    if (this.validFormPeriodos()) {
      this.loaderModal = true;
      let datosFormPeriodos=this.formGroupPeriodos.getRawValue();
      let PeriodosEnvio: PeriodosEnvio = this.procesarDataPeriodos(datosFormPeriodos, false);
      const index = this.listaPeriodos.findIndex(
        (e) => e.id === PeriodosEnvio.id
      );
      this.integraService
        .actualizar(constApi.PeriodosActualizar, PeriodosEnvio)
        .subscribe({
        next: (response: HttpResponse<Periodos>) => {
          this.listaPeriodos[index]=PeriodosEnvio;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.modalService.dismissAll(this.modalPeriodos);
          this.mostrarMensajeExitoso();
        }
      });
    }
  }
  //----------------// Control Grid-----------------------
    gridEventsResponse(e: any): void {
      console.log(e)
      switch (e.action) {
        case 'edit':
          this.nombreModal = 'Editar Periodo';
          this.btnModalNombre = 'Actualizar';
          this.openModalPeriodos(false, e);
          break;
        case 'remove':
          this.msgEliminar(e.dataItem,e.index);
          break;
        case 'add':
          this.nombreModal = 'Nuevo Periodo';
          this.btnModalNombre = 'Nuevo';
          this.openModalPeriodos(true, e);
          break;
        case 'reload':
          this.obtenerListaPeriodos();
          break;
      }
    }
}

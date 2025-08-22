import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@progress/kendo-angular-notification';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { GridCuentaContablePadre } from './grid-cuenta-contable-padre';

@Component({
  selector: 'app-cuenta-contable-padre',
  templateUrl: './cuenta-contable-padre.component.html',
  styleUrls: ['./cuenta-contable-padre.component.scss']
})
export class CuentaContablePadreComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private modalService: NgbModal
  ) {}

  formGroupData: FormGroup = this.formBuilder.group({
    id: [0],
    cuentaPadre: ['', Validators.required],
    descripcion: ['', Validators.required],
    usuarioModificacion: '',
    fechaModificacion: '',
    usuarioCreacion: '',
    fechaCreacion: '',
  });

  /*-------   Varibles -----------------*/
  pipe = new DatePipe('en-US');
  modalRef : any;
  loader: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';
  listaCuentaContablePadre: any[] = [];
  gridCuentaContablePadre = new GridCuentaContablePadre();
  @ViewChild('modalCuentaContablePadre') modalCuentaContablePadre: any;

  ngOnInit(): void {
    this.obtenerCuentaContablePadre()
  }


  obtenerCuentaContablePadre(){
    this.loader = true;
    this.integraService
      .obtenerTodo(constApiFinanzas.CuentaContablePadreObtener)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listaCuentaContablePadre = response.body;
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }
  /*---------------- Acciones CRUD Cuenta Bancaria------------------*/
 insertar() {
  if (this.validarForm()) {
    this.modalRef.close("submitted");
    var param = this.formGroupData.value;
    this.loader = true;
    let cuentaContablePadreData = this.procesarData(param, true);
    this.integraService
      .insertar(constApiFinanzas.CuentaContablePadreInsertar, cuentaContablePadreData)
      .subscribe({
        next: (response) => {
          this.listaCuentaContablePadre.push(response.body);
          this.loader = false;
          this.showSuccess();
        },
        error: (error) => {
          Swal.fire('Error!', 'Ocurrio un problema al guardar.', 'warning');
          console.log(error);
          this.loader = false;
        },
        complete: () => {},
      });
  } else this.formGroupData.markAllAsTouched();
}
eliminar(data: any) {
  this.loader = true;
  let param: Parametro[] = [
    { clave: 'id', valor: data.id },
    { clave: 'usuario', valor: '--' },
  ];
  this.integraService
    .eliminarPorPathParams(constApiFinanzas.CuentaContablePadreEliminar, param)
    .subscribe({
      next: (response) => {
        if ((response.body = true)) {
          const index = this.listaCuentaContablePadre.findIndex(
            (e) => e.id === data.id
          );
          this.listaCuentaContablePadre.splice(index, 1);
          this.listaCuentaContablePadre = this.listaCuentaContablePadre.slice();
          Swal.fire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
        } else {
          Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
        }
        this.loader = false;
      },
      error: (error) => {
        Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
        console.log(error);
        this.loader = false;
      },
      complete: () => {},
    });
}
editar() {
  if (this.validarForm()) {
    this.modalRef.close("submitted");
    var param = this.formGroupData.value;
    this.loader = true;
    let cuentaContablePadreData = this.procesarData(param, false);
    const index = this.listaCuentaContablePadre.findIndex(
      (e) => e.id === param.id
    );
    this.integraService
      .actualizar(constApiFinanzas.CuentaContablePadreEditar, cuentaContablePadreData)
      .subscribe({
        next: (response) => {
          this.listaCuentaContablePadre.splice(index, 1);
          this.listaCuentaContablePadre = this.listaCuentaContablePadre.slice();
          this.listaCuentaContablePadre.push(response.body);
          this.loader = false;
          this.showSuccess();
        },
        error: (error) => {
          Swal.fire('Error!', 'Ocurrio un problema al guardar.', 'warning');
          console.log(error);
          this.loader = false;
        },
        complete: () => {},
      });
  } else this.formGroupData.markAllAsTouched();
}


  /*-------------------------------------------Funciones------------------------------------------------------------------------------- */
  procesarData(dataItem: any, isNew: boolean) {
    var fechaActual = this.pipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss');
    var fechaCreacion = this.pipe.transform(dataItem.fechaCreacion, 'yyyy-MM-ddTHH:mm:ss');
    let Data = {
      id: isNew ? 0 : dataItem.id,
      fechaCreacion: isNew ? fechaActual : fechaCreacion,
      fechaModificacion: fechaActual,
      estado: true,
      usuarioCreacion: isNew ? '--' : dataItem.usuarioCreacion,
      usuarioModificacion: '--',
      cuentaPadre: dataItem.cuentaPadre,
      descripcion: dataItem.descripcion,
      rowVersion:"82387234"
    };
    return Data;
  }
  msgEliminar(data: any): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar la Cuenta Padre',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminar(data);
      }
    });
  }

  public showSuccess(): void {
    Swal.fire({
      icon: 'success',
      title: 'Guardado con exito!',
      showConfirmButton: false,
      timer: 2000,
    });
  }

  gridEventsResponse(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'edit':
        this.nombreModal = 'Editar Cuenta Contable Padre';
        this.btnModalNombre = 'Actualizar';
        this.openModal(false,e);
        break;
      case 'remove':
        this.msgEliminar(e.dataItem);
        break;
      case 'add':
        this.nombreModal = 'Nueva Cuenta Contable Padre';
        this.btnModalNombre = 'Nuevo';
        this.openModal(true,e);
        break;
      case 'reload':
        console.log(e)
        this.listaCuentaContablePadre=[];
        this.obtenerCuentaContablePadre();
        break;
    }
  }
  getControlFormRetencion(campo: string) {
    return this.formGroupData.get(campo) as FormControl;
  }
  openModal(isNew: boolean, data: any) {
    if (!isNew) {
      this.formGroupData.reset();
      this.formGroupData.patchValue(data.dataItem);
      console.log('Editar');
    } else {
      console.log('Nuevo');
      this.formGroupData.reset();
      this.formGroupData.patchValue({activo:true});
    }
    this.modalRef = this.modalService.open(this.modalCuentaContablePadre);
  }
  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        this.insertar();
        break;
      case 'Actualizar':
        this.editar();
        break;
    }
  }
  validarForm()
  {
    var error:number=0;
    var param = this.formGroupData.value;
    if(param.cuentaPadre== undefined) error=1;
    if(param.descripcion== undefined||param.descripcion.trim()=='') {this.formGroupData.patchValue({descripcion:''});error=1;}

    if(error===1) return false
    return true
  }
}

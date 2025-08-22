import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { PersonalActivoEmailCombo } from '@integra/models/personal';
import { RemitentesMailing, RemitentesMailingAsesores } from '@integra/models/remitente-mailing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { GridRemitenteMailing } from './grid-remitentes-mailing';
import { GridRemitenteMailingAsesores } from './grid-remitentes-mailing-asesores';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-remitentes-mailing',
  templateUrl: './remitentes-mailing.component.html',
  styleUrls: ['./remitentes-mailing.component.scss']
})
export class RemitentesMailingComponent implements OnInit {
  @ViewChild('modalRemitenteMailing') modalRemitenteMailing: any;
  @ViewChild('modalVerRemitenteMailing') modalVerRemitenteMailing: any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal
  ) { }
  loaderGrid: boolean = false;  //GRID SPINNER
  loaderModal: boolean = false; //MODAL SPINNER
  isNew: boolean = false;
  gridRemitenteMailing = new GridRemitenteMailing();
  gridRemitenteMailingAsesores = new GridRemitenteMailingAsesores();
  gridAsesorFormulario: KendoGrid = new KendoGrid();


  listaRemitenteMailing: RemitentesMailing[] = [];
  listaRemitenteMailingAsesores: RemitentesMailingAsesores[] = [];
  listaAsesores: PersonalActivoEmailCombo[] = [];
  remitenteMailingTemp :any
  modalRefTRMailing: any;
  formRemitenteMailing: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [ Validators.required]
    ],
    descripcion: ['', Validators.required],
    idAsesor: [null],
  });
  successIcon: string = iconInputValidation;


  ngOnInit(): void {
    this.obtenerRemitenteMailing();
    this.obtenerComboAsesores();
  }
  obtenerComboAsesores(){
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.RemitenteMailingObtenerComboAsesores)
      .subscribe({
        next: (response: HttpResponse<PersonalActivoEmailCombo[]>) => {
          console.log(response)
          this.listaAsesores = response.body;
          console.log(this.listaAsesores);
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  changeCampo(dataAsesor: any){
    console.log(dataAsesor)
    if (dataAsesor.length == 0) {
      this.gridAsesorFormulario.data = [];
    }
    if (dataAsesor.length > 0) {
      const camposOriginal =
      this.gridAsesorFormulario.dataItemEditTemp?.parametroSeo != null
      ? this.gridAsesorFormulario.dataItemEditTemp?.parametroSeo
      : [];
      console.log(this.gridAsesorFormulario.data)
      for (let i = 0; i < this.gridAsesorFormulario.data.length; i++) {
        const campo = this.gridAsesorFormulario.data[i];
        let index = dataAsesor.findIndex((e: any) => e == campo.idPersonal);
        if (index == -1) {
          this.gridAsesorFormulario.data.splice(i, 1);
        }
      }

      dataAsesor.forEach((element: any) => {
        console.log(this.listaAsesores)
        console.log(element)
        let campo = this.listaAsesores.find(
          (e: any) => e.id == element
        );
        let dataItemGrid = this.gridAsesorFormulario.data.findIndex(
          (e: any) => e.idPersonal == element
        );
        if (dataItemGrid == -1) {
          let campoOriginal = camposOriginal.find(
            (e: any) => e.idPersonal == campo.id
          );
          let campoNuevo: any = {
            idRemitenteMailing:1,
            idPersonal: campo.id,
            nombreCompleto: campo.apellidos + campo.nombres,
            correoElectronico: campo.email,
          };
          if (campoOriginal != -1) {
            campoNuevo = Object.assign(campoNuevo, campoOriginal);
          }
          this.gridAsesorFormulario.data.push(campoNuevo);
          console.log(this.gridAsesorFormulario.data)
        }
      });
      console.log(this.formRemitenteMailing);
    }
  }
  validFormFormularioSolicitud(): boolean {
    if (this.formRemitenteMailing.invalid) {
      this.formRemitenteMailing.markAllAsTouched();
      return false;
    }
    return true;
  }
  gridEventsRemitenteMailing(e: any, n:any, data:any, index:any): void {
    console.log(e);
    switch (e) {
      case 'edit':
        this.abrirModalRemitenteMailing(n, data, index);
        break;
      case 'add':
        this.abrirModalRemitenteMailing(n);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(data, index);
        break;
      case 'reload':
        this.obtenerRemitenteMailing();
        break;
      case 'ver':
      this.abrirModalVerRemitenteMailing(data);
        break;
    }
  }
  obtenerRemitenteMailing() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(constApiMarketing.RemitenteMailingObtenerRemitentesMailing)
      .subscribe({
        next: (response: HttpResponse<RemitentesMailing[]>) => {
          this.listaRemitenteMailing = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  obtenerRemitenteMailingAsesor(data:any){
    console.log(data)
    this.gridAsesorFormulario.data=[]
    this.loaderGrid = true;
    this.integraService
      .obtenerPorIdCodigo(constApiMarketing.RemitenteMailingObtenerRemitenteMailingAsesor,data.id)
      .subscribe({
        next: (response: HttpResponse<RemitentesMailingAsesores[]>) => {
          console.log(response)
          this.listaRemitenteMailingAsesores = response.body;
          this.gridAsesorFormulario.data=response.body;
          console.log(this.gridAsesorFormulario)
          console.log(this.listaRemitenteMailingAsesores);
          let idsAsesores: number[] = [];
            response.body.forEach((element: any) => {
              idsAsesores.push(element.idPersonal);
            });
          this.loaderGrid = false;
          this.formRemitenteMailing.get('idAsesor').setValue(idsAsesores);
          console.log(this.formRemitenteMailing)

        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  abrirModalRemitenteMailing(isNew: boolean, dataItem?: RemitentesMailing, index?: number) {
    this.gridAsesorFormulario.data=[]
    this.loaderModal = false;
    this.formRemitenteMailing.reset();
    this.isNew = isNew;
    if(!isNew){
      this.gridAsesorFormulario.dataItemEditTemp=dataItem
      this.remitenteMailingTemp = dataItem;
      this.formRemitenteMailing.patchValue(this.remitenteMailingTemp);
      this.obtenerRemitenteMailingAsesor(this.remitenteMailingTemp)
    }else {
      this.gridAsesorFormulario.dataItemEditTemp = null;
    }
    this.modalRefTRMailing = this.modalService.open(this.modalRemitenteMailing, { size: 'xl' });
  }
  abrirModalVerRemitenteMailing(data:any){
    console.log(data)
    this.remitenteMailingTemp = data;
    this.modalService.open(this.modalVerRemitenteMailing, { size: 'xl' });
    this.obtenerRemitenteMailingAsesor(this.remitenteMailingTemp)
  }
  setDataRemitenteMailing(item: RemitentesMailing, itemValue: any): RemitentesMailing{
    if(itemValue != null){
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.descripcion = itemValue.descripcion;
      item.estado = itemValue.estado;
      item.usuarioCreacion = itemValue.usuarioCreacion;
      item.usuarioModificacion = itemValue.usuarioModificacion;
      item.fechaCreacion = itemValue.fechaCreacion;
      item.fechaModificacion = itemValue.fechaModificacion;
    }
    return item;
  }
  crearRemitenteMailing(){
    if (this.validFormFormularioSolicitud()) {
      this.loaderModal = true;
      let datosFormulario = this.formRemitenteMailing.getRawValue();
      let formularioSolicitud: any = {
        id: 0,
        nombre: datosFormulario.nombre,
        descripcion: datosFormulario.descripcion,
      };
      let campos: any[] = [];
      let contador: number = 0;
      this.gridAsesorFormulario.data.forEach((e: any) => {
        campos.push({
          id: e.idPersonal,
          nombreCompleto: e.nombreCompleto,
          correoElectronico: e.correoElectronico,
        });
      });

      let jsonEnvio: any = {
        formulario: formularioSolicitud,
        asesores: campos,
      };
      let remitenteMailing: RemitentesMailing = Object.assign({}, datosFormulario);

      console.log(jsonEnvio);
      this.integraService
        .insertar(
          constApiMarketing.RemitenteMailingCrearRemitenteMailing,
          jsonEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response)
            remitenteMailing = this.setDataRemitenteMailing(remitenteMailing, response.body);
            this.listaRemitenteMailing.unshift(remitenteMailing);
            this.gridAsesorFormulario.loadView();
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefTRMailing.close('submitted');
            this.mostrarMensajeExitoso();
            this.obtenerRemitenteMailing()
          },
        });
    } else this.formRemitenteMailing.markAllAsTouched();
  }
  actualizarRemitenteMailing(){
    if (this.validFormFormularioSolicitud()) {
      this.loaderModal = true;
      let datosFormulario = this.formRemitenteMailing.getRawValue();
      let formularioSolicitud: any = {
        id: datosFormulario.id,
        nombre: datosFormulario.nombre,
        descripcion: datosFormulario.descripcion,
      };
      let campos: any[] = [];
      let contador: number = 0;
      this.gridAsesorFormulario.data.forEach((e: any) => {
        campos.push({
          id: e.idPersonal,
          nombreCompleto: e.nombreCompleto,
          correoElectronico: e.correoElectronico,
        });
      });

      let jsonEnvio: any = {
        formulario: formularioSolicitud,
        asesores: campos,
      };
      let remitenteMailing: RemitentesMailing = Object.assign(this.remitenteMailingTemp, this.formRemitenteMailing.getRawValue());

      console.log(jsonEnvio);
      this.integraService
        .insertar(
          constApiMarketing.RemitenteMailingActualizarRemitenteMailing,
          jsonEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.remitenteMailingTemp = this.setDataRemitenteMailing(remitenteMailing, response.body);
            this.obtenerRemitenteMailing();
            this.gridAsesorFormulario.loadView();
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.modalRefTRMailing.close('submitted');
            this.mostrarMensajeExitoso();
            this.obtenerRemitenteMailing()
          },
        });
    } else this.formRemitenteMailing.markAllAsTouched();
  }
  mostrarMensajeEliminar(data: any, index:any) {
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
      allowOutsideClick: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarRemitenteMailing(data, index);
      }
    });
  }
  eliminarRemitenteMailing(dataItem: RemitentesMailing, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.RemitenteMailingEliminarRemitenteMailing, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if ((response.body == true)) {
            this.listaRemitenteMailing.splice(index, 1);
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
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.obtenerRemitenteMailing()
        },
      });
  }
  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  mostrarMensajeExitoso(){
    this.loaderGrid = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute'
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
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
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formRemitenteMailing.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  getShowSuccessIcon(controlName: string): boolean{
    let formControl: FormControl = this.formRemitenteMailing.get(controlName) as FormControl;
    return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
  }
  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: { required: 'Ingrese Nombre de Tipo Categoria Origen'},
      descripcion: { required: 'Ingrese una descripcion' },
    };
    let formControl: FormControl = this.formRemitenteMailing.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }
    if (formControl.hasError('min')) {
      return erroMsj[controlName].min;
    }
    return null;
  }
}

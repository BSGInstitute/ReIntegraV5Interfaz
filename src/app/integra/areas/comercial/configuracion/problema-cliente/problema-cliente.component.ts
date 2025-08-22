import { UserService } from '@shared/services/user.service';
import { gridProblemaCliente } from './grid-problema-cliente';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiComercial } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { Parametro } from '@shared/models/parametro';
import {
  IProgramaGeneralProblema,
  ModalidadCliente,
  ModalidadClienteEnvio,
  ProblemaArgumentoModalidad,
  ProblemaCliente,
  ProblemasVentasV2Respuesta,
  ProblemaVentaV2Envio,
} from '@integra/models/problema-venta-v2';

@Component({
  selector: 'app-problema-cliente',
  templateUrl: './problema-cliente.component.html',
  styleUrls: ['./problema-cliente.component.scss'],
})
export class ProblemaClienteComponent implements OnInit {

  @ViewChild('modalProblemaCliente') modalProblemaCliente: any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  listaProblemaArgumentoModalidad: ProblemaArgumentoModalidad[];
  loaderGrid: boolean = false;
  isNew: boolean = false;
  valorModalidad: any[] = [];
  idProblemaClienteTemp: number;
  modalRef: any;
  listaEnviar: any[] = [];
  gridProblemaCliente = gridProblemaCliente;

  loaderModal: boolean = false;

  listaModalidades: ModalidadCliente[] = [
    { nombre: 'Presencial', id: 0, idModalidadCurso: 0 },
    { nombre: 'Online Asincronica', id: 0, idModalidadCurso: 1 },
    { nombre: 'Online Sincronica', id: 0, idModalidadCurso: 2 },
  ];
  value: any = [{ text: 'Medium', value: 2 }];
  formProblemaCliente: FormGroup = this.formBuilder.group({
    nombreProblema: ['', Validators.required],
    modalidades: [null, Validators.required],
    idPGeneral: 0,
    idProblema: 0,
  });
  idPersonalLogeo:number;
  idNombrePersonalLogeo:string;

  problemaArgumentoModalidadTemp: ProblemaArgumentoModalidad;
  ngOnInit(): void {
    this.idPersonalLogeo =this.userService.userData.idPersonal
    this.idNombrePersonalLogeo =this.userService.userData.userName

    this.obtenerListaProblemaCliente();
  }
  obtenerListaProblemaCliente() {
    this.loaderGrid = true;
    this.integraService
      .obtenerTodo(
        constApiComercial.ProgramaGeneralProblemaObtenerProgramaGeneralProblemaArgumentoModalidad
      )
      .subscribe({
        next: (response: HttpResponse<ProblemaArgumentoModalidad[]>) => {
          this.listaProblemaArgumentoModalidad = response.body;
          console.log(this.listaProblemaArgumentoModalidad);
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  openModalProblemaCliente(param: any) {
    console.log(param);
    this.formProblemaCliente.reset();
    this.problemaArgumentoModalidadTemp = param.dataItem;
    this.formProblemaCliente.patchValue(param.dataItem);
    // let modalidades: ModalidadCliente[] = [];
    // param.dataItem.modalidades.forEach((element: ModalidadCliente) => {
    //   modalidades.push({
    //     nombre: element.nombre,
    //     id: element.id,
    //     idModalidadCurso: element.idModalidadCurso,
    //   });
    // });
    // this.formProblemaCliente.get('modalidades').setValue(modalidades);
    // this.formProblemaCliente
    //   .get('idProblema')
    //   .setValue(param.dataItem.idProblema);
    // this.formProblemaCliente
    //   .get('nombreProblema')
    //   .setValue(param.dataItem.nombreProblema);
    // this.formProblemaCliente
    //   .get('idPGeneral')
    //   .setValue(param.dataItem.idPGeneral);
    this.modalRef = this.modalService.open(this.modalProblemaCliente);
  }

  validFormRecordAreaComercial(): boolean {
    if (this.formProblemaCliente.invalid) {
      this.formProblemaCliente.markAllAsTouched();
      return false;
    }
    return true;
  }

  setDataProblemaArgumentoModalidad(
    item: ProblemaArgumentoModalidad,
    itemValue: ProblemasVentasV2Respuesta
  ): ProblemaArgumentoModalidad {
    if (itemValue != null) {
      let modalidades: ModalidadCliente[] = [];
      itemValue.programaGeneralProblemaModalidad.forEach((element) => {
        modalidades.push({
          id: element.id,
          nombre: element.nombre,
          idModalidadCurso: element.idModalidadCurso,
        });
      });

      item.argumentos = [];
      item.idPGeneral = itemValue.idPgeneral;
      item.idProblema = itemValue.id;
      item.modalidades = modalidades;
      item.nombreProblema = itemValue.nombre;
    }
    return item;
  }

  procesarDataProblemaVentaV2Envio(
    item: ProblemaArgumentoModalidad,
    isNew: boolean
  ): ProblemaVentaV2Envio {
    let modalidadEnvio: ModalidadClienteEnvio[] = [];
    item.modalidades.forEach((element) => {
      modalidadEnvio.push({
        id: element.id,
        nombre: element.nombre,
        idModalidad: element.idModalidadCurso,
      });
    });
    let problemaCliente: ProblemaCliente = {
      idProblema: isNew ? 0 : item.idProblema,
      idPGeneral: isNew ? 0 : item.idPGeneral,
      nombreProblema: item.nombreProblema,
      esVisibleAgenda: false,
      problemasArgumentos: [],
      modalidades: modalidadEnvio,
    };
    let problemaVentaV2Envio: ProblemaVentaV2Envio = {
      problemas: problemaCliente,
      usuario: 'cavaldivia',
      idPGeneral: isNew ? 0 : item.idPGeneral,
    };

    return problemaVentaV2Envio;
  }

  guardarProblemaCliente() {
    if (this.validFormRecordAreaComercial()) {
      this.loaderModal = true;
      let datosFormulario = this.formProblemaCliente.getRawValue();
      let problemaArgumentoModalidad: ProblemaArgumentoModalidad =
        Object.assign({}, datosFormulario);
      let problemaVentaV2Envio: ProblemaVentaV2Envio;
      problemaVentaV2Envio = this.procesarDataProblemaVentaV2Envio(
        problemaArgumentoModalidad,
        true
      );
      this.integraService
        .insertar(
          constApiComercial.ProgramaGeneralGuardarProblemasVentasV2,
          problemaVentaV2Envio
        )
        .subscribe({
          next: (response: HttpResponse<ProblemasVentasV2Respuesta>) => {
            problemaArgumentoModalidad = this.setDataProblemaArgumentoModalidad(
              problemaArgumentoModalidad,
              response.body
            );
            this.listaProblemaArgumentoModalidad.unshift(problemaArgumentoModalidad);
            this.loaderModal = false;
          },
          error: (error) => {
            this.mostrarMensajeError(error);
            this.loaderGrid = false;
          },
          complete: () => {
            this.modalService.dismissAll(this.modalProblemaCliente);
            this.mostrarMensajeExitoso();
          },
        });
    }
  }
  actulizarProblemaCliente() {
    this.loaderModal = true;
    console.log(this.formProblemaCliente.getRawValue());
    let dataForm = this.formProblemaCliente.getRawValue();
    let problema: ProblemaCliente = {
      idProblema: dataForm.idProblema,
      idPGeneral: dataForm.idPGeneral,
      nombreProblema: dataForm.nombreProblema,
      esVisibleAgenda: true,
      problemasArgumentos: dataForm.argumentos,
      modalidades: dataForm.modalidades,
    };
    let problemaCliente: ProblemaVentaV2Envio = {
      problemas: problema,
      usuario: 'cavaldivia',
      idPGeneral: 5,
    };
    console.log(problemaCliente);
    this.integraService
      .actualizar(
        constApiComercial.ProgramaGeneralActualizarProblemasVentasV2,
        problemaCliente
      )
      .subscribe({
        next: (response: HttpResponse<IProgramaGeneralProblema[]>) => {
          console.log(response);
          this.loaderGrid = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.modalService.dismissAll(this.modalProblemaCliente);
          this.mostrarMensajeExitoso();
        },
      });
  }
  addOpenModalProblemaCliente(param: any) {
    this.formProblemaCliente.reset();
    this.modalRef = this.modalService.open(this.modalProblemaCliente);
  }

  obtenerCadenaModalidades(param: any[]) {
    let listaModalidad: any[] = [];
    param.forEach((element) => {
      listaModalidad.push(element.nombre);
    });
    return listaModalidad.join(',');
  }
  eliminarProblemaCliente(data: any) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      {
        clave: 'id',
        valor: data.idProblema,
      },
      {
        clave: 'Usuario',
        valor: 'cavaldivia',
      },
    ];
    Swal.fire({
      title: '¿Está seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, bórralo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .eliminarPorPathParams(
            constApiComercial.ProgramaGeneralProblemaEliminarProblemaVenta,
            params
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              console.log(response);
              //this.listaProblemaCliente = response.body;
              this.loaderGrid = false;
              if (response.body == true) {
                Swal.fire(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success'
                );
              } else {
                Swal.fire(
                  'Error!',
                  'Ocurrio un problema al eliminar.',
                  'warning'
                );
              }
            },
            error: (error) => {
              this.mostrarMensajeError(error);
            },
            complete: () => {},
          });
      }
    });
  }

  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false,
    });
  }
  mostrarMensajeExitoso() {
    this.loaderGrid = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Guardado con exito',
    });
  }

  gridEventsResponse(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'remove':
        this.eliminarProblemaCliente(e.dataItem);
        break;
      case 'cancelRemove':
        break;
      case 'add':
        this.isNew = true;
        console.log('Hola');
        this.formProblemaCliente.reset();
        this.addOpenModalProblemaCliente(e);
        break;
      case 'edit':
        this.isNew = false;
        this.openModalProblemaCliente(e);
        break;
      case 'pageChange':
        break;
      case 'sortChange':
        break;
      case 'dataStateChange':
        break;
      case 'reload':
        this.obtenerListaProblemaCliente();
        break;
    }
  }
}

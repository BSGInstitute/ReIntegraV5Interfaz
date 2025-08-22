import { constApiGestionPersonal, constApiGlobal, constApiMarketing } from '@environments/constApi';
import { Component, OnInit } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { FormBuilder,FormControl,FormGroup,Validators,} from '@angular/forms';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';
import { TextValidator } from '@shared/validators/text.validator';
import { SelectEvent } from '@progress/kendo-angular-layout';
export interface WhatsAppUsuariosDTO {
  idWhatsAppUsuario: number;
  idPersonal: number;
  rolUser: string;
  userUsername: string;
  userPassword: string;
  nombres?: string;
  esMigracion?: boolean | null;
  idMigracion?: number | null;
}
export interface WhatsAppUsuariosComDTO {
  idWhatsAppConfiguracionApi: number;
  idArea: number;
  area: string;
  idPersonal: number;
  personal: string;
  idPais: string;
  pais: string;
  numero: string;
  numeroWhatsApp: string;
  numeroIndentificador: string;
  cuentaIdentificadorWhatsApp: string;
  fechaExpiracion?: Date;
  vName: string;
  versionApi: string;
  bearer: string;
  esMigracion?: boolean | null;
  idMigracion?: number | null;
}
export interface WhatsAppPersonalDTO {
  id: number;
  nombres: string;
  rol: string;
  userName: string;
}
export interface WhatsAppAreaDTO {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
}

export interface WhatsAppPaisDTO {
  id: number;
  nombrePais: string;
}
@Component({
  selector: 'app-usuarios-whatsapp',
  templateUrl: './usuarios-whatsapp.component.html',
  styleUrls: ['./usuarios-whatsapp.component.scss']
})

export class UsuariosWhatsappComponent implements OnInit {
  constructor(
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.obtenerListaPersonal();
    this.obtenerArea();
    this.obtenerPais();
    this.obtenerCredencialesUsuarios();
    this.obtenerCredencialesUsuariosCom();
    this.personal=this.userService.userData.userName
  }

  selectedIndex: any = 0;
  idArea: number;
  codigoArea: string;
  gridUsuarioWhatsapp = new KendoGrid();
  gridUsuarioWhatsappCom = new KendoGrid();
  isNew: boolean = false;
  dataPersonal: WhatsAppPersonalDTO[] = [];
  dataPersonalFilter: WhatsAppPersonalDTO[] = [];
  dataArea: WhatsAppAreaDTO[] = [];
  dataPais: WhatsAppPaisDTO[] = [];
  loading: boolean = false;
  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formDataVisual: WhatsAppUsuariosDTO;
  formDataVisualCom: WhatsAppUsuariosComDTO;
  loaderModal: boolean = false;
  modalRefEditar: NgbModalRef = null;
  modalRefEditarCom: NgbModalRef = null;
  personal: any;

  formCrearActualizar: FormGroup = this.formBuilder.group({
    idWhatsAppUsuario: [0],
    idPersonal: [
      0,
      [
        Validators.required
      ]
    ],
    rolUser: "Rol_User",
    userUsername: "",
    userPassword: [
      "",
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]
    ],
  })

  formCrearActualizarCom: FormGroup = this.formBuilder.group({
    idWhatsAppConfiguracionApi: [0],
    idArea: [
      0,
      [
        Validators.required
      ]
    ],
    idPersonal: [
      0,
      [
        Validators.required
      ]
    ],
    idPais: [
      0,
      [
        Validators.required
      ]
    ],
    numero: [
      "",
      [
        Validators.required,
        Validators.maxLength(100),
      ]
    ],
    numeroWhatsApp: [
      "",
      [
        Validators.required,
        Validators.maxLength(100),
      ]
    ],
    numeroIndentificador: [
      "",
      [
        Validators.required
      ]
    ],
    cuentaIdentificadorWhatsApp: [
      "",
      [
        Validators.required,
        Validators.maxLength(20),
      ]
    ],
    fechaExpiracion: [null],
    vName: "",
    versionApi: "",
    bearer: "",
  })

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  virtual: any = {
    itemHeight: 28,
  };

  onTabSelect(event: SelectEvent): void {
    this.selectedIndex = event.index;
  }

  validFormCrearActualizar(): boolean {
    if (this.formCrearActualizar.invalid) {
      this.formCrearActualizar.markAllAsTouched();
      return false;
    }
    return true;
  }

  validFormCrearActualizarCom(): boolean {
    if (this.formCrearActualizarCom.invalid) {
      this.formCrearActualizarCom.markAllAsTouched();
      return false;
    }
    return true;
  }

  obtenerCredencialesUsuarios(){
    this.gridUsuarioWhatsapp.loading = true;
    this.integraService
      .getJsonResponse(constApiMarketing.WhatsAppUsuarioObtenerCredencialesUsuarios)
      .subscribe({
        next: (resp: HttpResponse<WhatsAppUsuariosDTO[]>) => {
          this.gridUsuarioWhatsapp.loading = false;
          this.gridUsuarioWhatsapp.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridUsuarioWhatsapp.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerCredencialesUsuariosCom(){
    this.gridUsuarioWhatsappCom.loading = true;
    this.integraService
      .getJsonResponse(constApiMarketing.WhatsAppUsuarioObtenerCredencialesUsuariosCom)
      .subscribe({
        next: (resp: HttpResponse<WhatsAppUsuariosComDTO[]>) => {
          this.gridUsuarioWhatsappCom.loading = false;
          this.gridUsuarioWhatsappCom.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridUsuarioWhatsappCom.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerListaPersonal(){
    this.loading = true;
    this.integraService
      .getJsonResponse(constApiMarketing.WhatsAppUsuarioObtenerListaPersonal)
      .subscribe({
        next: (resp: HttpResponse<WhatsAppPersonalDTO[]>) => {
          this.loading = false;
          this.dataPersonal = resp.body;
          this.dataPersonalFilter = this.dataPersonal
        },
        error: (error) => {
          console.log(error);
          this.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerArea(){
    this.integraService
      .getJsonResponse(constApiGestionPersonal.PersonalAreaTrabajoObtener)
      .subscribe({
        next: (resp: HttpResponse<WhatsAppAreaDTO[]>) => {
          this.loading = false;
          this.dataArea = resp.body;
        },
        error: (error) => {
          console.log(error);
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerPais(){
    this.integraService
      .getJsonResponse(constApiGlobal.PaisObtenerPaisCombo)
      .subscribe({
        next: (resp: HttpResponse<WhatsAppPaisDTO[]>) => {
          this.loading = false;
          this.dataPais = resp.body;
        },
        error: (error) => {
          console.log(error);
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerNombreUsuario(value: number){
    var username = this.dataPersonalFilter.find( x=> x.id==value);
    this.formCrearActualizar.get('userUsername').setValue(username.userName);
  }

  filtraPersonalPorArea(areaId: any){
    this.idArea = 0;
    this.codigoArea = "";
    this.dataPersonalFilter = [];
    this.formCrearActualizarCom.get('idPersonal')?.setValue(null);
    const selectedArea = this.dataArea.find((area: any) => area.id === areaId);
    if (selectedArea) {
      this.idArea = selectedArea.id;
      this.codigoArea = selectedArea.codigo;
      this.dataPersonalFilter = this.dataPersonal.filter(
        (s: any) => (selectedArea?.nombre?.toLowerCase() || '').toLowerCase() === (s?.rol?.toLowerCase() || '').toLowerCase()
      );
    }
  }

  iniciaAreaActualizar(areaId: any){
    this.idArea = 0;
    this.codigoArea = "";
    this.dataPersonalFilter = [];
    const selectedArea = this.dataArea.find((area: any) => area.id === areaId);
    if (selectedArea) {
      this.idArea = selectedArea.id;
      this.codigoArea = selectedArea.codigo;
      this.dataPersonalFilter = this.dataPersonal.filter(
        (s: any) => (selectedArea?.nombre?.toLowerCase() || '').toLowerCase() === (s?.rol?.toLowerCase() || '').toLowerCase()
      );
    }
  }

  obtenerNombrePais(value: number){
    var x = this.dataPais.find( x=> x.id==value);
    this.formCrearActualizarCom.get('idPais').setValue(x.id);
  }

  limpiarCamposForm(): void {
    if (this.modalRefEditar != null) {
      this.modalRefEditar.close();
      this.modalRefEditar = null;
    }
    this.formCrearActualizar.reset();
    this.loaderModal = false;
  }

  limpiarCamposFormCom(): void {
    if (this.modalRefEditarCom != null) {
      this.modalRefEditarCom.close();
      this.modalRefEditarCom = null;
    }
    this.formCrearActualizar.reset();
    this.loaderModal = false;
  }

  abrirModalDetalle(dataSource: WhatsAppUsuariosDTO, modalDetalle: any){
    this.formDataVisual =  dataSource;
    this.modalService.open(modalDetalle, {size: 'md', backdrop: 'static' });
    this.loaderModal = false;
  }

  abrirModalDetalleCom(dataSource: WhatsAppUsuariosComDTO, modalDetalle: any){
    this.formDataVisualCom =  dataSource;
    this.modalService.open(modalDetalle, {size: 'md', backdrop: 'static' });
    this.loaderModal = false;
  }

  abrirModalCrearActualizar(isNew: boolean, modalEditar: any, dataItem?: any): void{
    this.formCrearActualizar.reset();
    this.isNew = isNew;
    if (dataItem != null) { //Actualizar
      this.formCrearActualizar.patchValue(dataItem);
    }
    else{ //Nuevo
      this.formCrearActualizar.get('rolUser')?.setValue("Rol_User");
      this.formCrearActualizar.get('idWhatsAppUsuario').setValue(0);
    }
    this.modalRefEditar = this.modalService.open(modalEditar, { size: 'lg', backdrop: 'static' });
  }

  abrirModalCrearActualizarCom(isNew: boolean, modalEditar: any, dataItem?: any): void{
    this.formCrearActualizarCom.reset();
    this.isNew = isNew;
    if (dataItem != null) { //Actualizar
      this.formCrearActualizarCom.patchValue(dataItem);
      this.formCrearActualizarCom.get('fechaExpiracion').setValue(new Date(dataItem.fechaExpiracion));
      this.iniciaAreaActualizar(dataItem.idArea);
    }
    else{ //Nuevo
      this.formCrearActualizarCom.get('idWhatsAppConfiguracionApi').setValue(0);
      this.formCrearActualizarCom.get('bearer')?.setValue("EAB7E1KH121kBOzQctQKIdoU3YhPHHA1EScQfuyGCLnCkliE8zXfq6ZCPvVZBiJV5BK4SZAxKAxosROF7d6SXoR1ZCIuZBgqGa5AGI8oZBdeSZCHlAMmvWIcH2QE9vnHdZBE7HHn5Ha42xKN4QTHNi1PnooMKbttHwbWECVrOfPjQ5Pha9f2ZADRMSZCNGikEtf1Tgs");
      const today = new Date();
      this.formCrearActualizarCom.get('fechaExpiracion')?.setValue(today);
      this.formCrearActualizarCom.get('vName')?.setValue("BSG Institute");
      this.formCrearActualizarCom.get('versionApi')?.setValue("v17.0");
    }
    this.modalRefEditarCom = this.modalService.open(modalEditar, { size: 'lg', backdrop: 'static' });
  }

  insertarWhatsAppUsuario(){
    if (this.validFormCrearActualizar()) {
      let dataFormCrearActualizar = this.formCrearActualizar.getRawValue();
      let dataWhatsAppUsuario: any = this.procesarData(dataFormCrearActualizar, true);
      this.integraService
      .insertar(constApiMarketing.InsertarWhatsAppUsuario, dataWhatsAppUsuario)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.obtenerCredencialesUsuarios();
          },
          error: (error) => {
            this.loaderModal = false;
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.limpiarCamposForm();
            this.alertaService.mensajeExitoso();
          },
        });
    };
  }

  insertarWhatsAppUsuarioCom(){
    if (this.validFormCrearActualizarCom()) {
      let dataFormCrearActualizarCom = this.formCrearActualizarCom.getRawValue();
      let dataWhatsAppUsuarioCom: any = this.procesarDataCom(dataFormCrearActualizarCom, true);
      this.integraService
      .insertar(constApiMarketing.InsertarWhatsAppUsuarioCom, dataWhatsAppUsuarioCom)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.obtenerCredencialesUsuariosCom();
          },
          error: (error) => {
            this.loaderModal = false;
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.limpiarCamposFormCom();
            this.alertaService.mensajeExitoso();
          },
        });
    };
  }

  actualizarWhatsAppUsuario(){
    if (this.validFormCrearActualizar()) {
      let dataFormCrearActualizar = this.formCrearActualizar.getRawValue();
      let dataWhatsAppUsuario: any = this.procesarData(dataFormCrearActualizar, false);
      this.integraService
        .actualizar(constApiMarketing.ActualizarWhatsAppUsuario, dataWhatsAppUsuario)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.obtenerCredencialesUsuarios();
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.limpiarCamposForm();
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formCrearActualizar.markAllAsTouched();
  }

  actualizarWhatsAppUsuarioCom(){
    if (this.validFormCrearActualizarCom()) {
      let dataFormCrearActualizarCom = this.formCrearActualizarCom.getRawValue();
      let dataWhatsAppUsuarioCom: any = this.procesarDataCom(dataFormCrearActualizarCom, false);
      this.integraService
        .actualizar(constApiMarketing.ActualizarWhatsAppUsuarioCom, dataWhatsAppUsuarioCom)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.obtenerCredencialesUsuariosCom();
          },
          error: (error) => {
            this.loaderModal = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.limpiarCamposFormCom();
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formCrearActualizar.markAllAsTouched();
  }

  mostrarMensajeEliminar(dataItem: any, index: number){
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        if (this.selectedIndex == 0) {
          this.eliminarWhatsAppUsuario(dataItem.idWhatsAppUsuario, index);
          this.gridUsuarioWhatsapp.loading = false;
        }
        else{
          this.eliminarWhatsAppUsuarioCom(dataItem.idWhatsAppConfiguracionApi, index);
          this.gridUsuarioWhatsappCom.loading = false;
        }
      }
    });
  }

  eliminarWhatsAppUsuario(id: number, index: number) {
    this.gridUsuarioWhatsapp.loading = false;
    let params: any[] = [
      { clave: 'id', valor: id }
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.EliminarWhatsAppUsuario, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.body == true) {
            this.gridUsuarioWhatsapp.data.splice(index, 1);
            this.gridUsuarioWhatsapp.loading = false;            
            this.mostrarMensajeExitoso();
            this.limpiarCamposForm();
            this.obtenerCredencialesUsuarios();
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
          this.limpiarCamposForm();
          this.obtenerCredencialesUsuarios();
          this.gridUsuarioWhatsapp.loading = false;
        },
      });
  }

  eliminarWhatsAppUsuarioCom(id: number, index: number) {
    this.gridUsuarioWhatsappCom.loading = false;
    let params: any[] = [
      { clave: 'id', valor: id }
    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.EliminarWhatsAppUsuarioCom, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.body == true) {
            this.gridUsuarioWhatsappCom.data.splice(index, 1);
            this.gridUsuarioWhatsappCom.loading = false;            
            this.mostrarMensajeExitoso();
            this.limpiarCamposFormCom();
            this.obtenerCredencialesUsuariosCom();
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
          this.limpiarCamposFormCom();
          this.obtenerCredencialesUsuariosCom();
          this.gridUsuarioWhatsappCom.loading = false;
        },
      });
  }

  procesarData(dataItem: any, isNew: boolean) {
    let origenData: any = {
      id: isNew ? 0 : dataItem.idWhatsAppUsuario,
      idPersonal: dataItem.idPersonal,
      rolUser: dataItem.rolUser,
      userUsername: dataItem.userUsername,
      userPassword: dataItem.userPassword,
      usuarioSistema: this.personal,
    };
    return origenData;
  }

  procesarDataCom(dataItem: any, isNew: boolean) {
    const fechaExpiracion = dataItem.fechaExpiracion ? dataItem.fechaExpiracion : new Date().toISOString().split('T')[0];
    const vName = dataItem.vName ? dataItem.vName : "BSG Institute";
    const bearer = dataItem.bearer ? dataItem.bearer : "EAB7E1KH121kBOzQctQKIdoU3YhPHHA1EScQfuyGCLnCkliE8zXfq6ZCPvVZBiJV5BK4SZAxKAxosROF7d6SXoR1ZCIuZBgqGa5AGI8oZBdeSZCHlAMmvWIcH2QE9vnHdZBE7HHn5Ha42xKN4QTHNi1PnooMKbttHwbWECVrOfPjQ5Pha9f2ZADRMSZCNGikEtf1Tgs";
    const versionApi = dataItem.versionApi ? dataItem.versionApi : "v17.0";
    let origenData: any = {
      id: isNew ? 0 : dataItem.idWhatsAppConfiguracionApi,
      numero: dataItem.numero,
      vName: vName,
      idPais: dataItem.idPais,
      bearer: bearer,
      numeroIndentificador: dataItem.numeroIndentificador,
      versionApi: versionApi,
      fechaExpiracion: fechaExpiracion,
      UsuarioCreacion: this.personal,
      UsuarioModificacion: this.personal,
      numeroWhatsApp: dataItem.numeroWhatsApp,
      cuentaIdentificadorWhatsApp: dataItem.cuentaIdentificadorWhatsApp,
      idPersonalAreaTrabajo: this.idArea,
      codigoArea: this.codigoArea,
      idPersonal_Asignado: dataItem.idPersonal
    };
    return origenData;
  }

  formatDate(dateString: string): string {
    const parts = dateString.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    const formattedDate = date.toISOString().split('T')[0];
    return formattedDate;
}

  mostrarMensajeExitoso() {
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

  mostrarMensajeError(error: any): void {
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false,
    });
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      idPersonal: {
        required: 'Ingrese Personal'
      },
      userPassword: {
        required: 'Ingrese Contraseña',
        noStartSpace: 'La Contraseña no puede empezar con espacio',
        noEndSpace: 'La Contraseña no puede terminar con espacio',
      },
    };
    let formControl: FormControl = this.formCrearActualizar.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }
    return null;
  }

  getErrorMessageCom(controlName: string): string {
    let erroMsj: any = {
      idArea: {
        required: 'Ingrese Área'
      },
      idPersonal: {
        required: 'Ingrese Personal'
      },
      idPais: {
        required: 'Ingrese País'
      },
      numero: {
        required: 'Ingrese Número',
        maxlength: 'Número no puede tener más de 100 caracteres'
      },
      numeroWhatsApp: {
        required: 'Ingrese Número WhatsApp',
        maxlength: 'Número WhatsApp no puede tener más de 100 caracteres'
      },
      numeroIndentificador: {
        required: 'Ingrese Número Identificador'
      },
      cuentaIdentificadorWhatsApp: {
        required: 'Ingrese Cuenta Identificador WhatsApp',
        maxlength: 'Cuenta Identificador WhatsApp no puede tener más de 20 caracteres'
      }
    };
    let formControl: FormControl = this.formCrearActualizarCom.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('maxlength')) {
      return erroMsj[controlName].maxlength;
    }
    return null;
  }

}

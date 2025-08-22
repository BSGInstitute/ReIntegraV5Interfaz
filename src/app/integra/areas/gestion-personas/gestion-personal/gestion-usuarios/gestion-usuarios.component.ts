import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  constApiGestionPersonal,
  constApiGlobal,
} from '@environments/constApi';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { AlertaService } from '@shared/services/alerta.service';
import { coerceStringArray } from '@angular/cdk/coercion';
import Swal from 'sweetalert2';
interface Usuario {
  id: number;
  userName: string;
  email: string;
  nombre: string;
  rol: string;
  areaTrabajo: string;
  rolId: number;
  perId: number;
  usClave: string;
  idUsuario: number;
  usuarioCreacion: string;
  usuarioModificacion: string;
}
interface PaqueteModulo {
  id: number;
  nombre: string;
  idModuloSistema: string;
  descripcion: string;
}
interface Modulo {
  IdModulo: number;
  NombreGrupo: string;
  NombreModulo: string;
  URL: string;
}
@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss'],
})
export class GestionUsuariosComponent implements OnInit {
  @ViewChild('modalInformacionUsuario') modalInformacionUsuario: any;
  @ViewChild('modalAsignacionUsuario') modalAsignacionUsuario: any;

  gridUsuario: KendoGrid = new KendoGrid();
  gridListaModulos: KendoGrid = new KendoGrid();
  gridMisModulos: KendoGrid = new KendoGrid();
  gridListaPaqueteModulos: KendoGrid = new KendoGrid();

  listaRoles: IComboBase1[] = [];
  listaFiltroRoles: IComboBase1[] = [];
  listaUsuarios: IComboBase1[] = [];

  listaModulosDesasociar: number[] = [];
  listaModulosAsociar: number[] = [];
  paqueteAsociar: number[] = [];

  loader: boolean = false;
  esNuevo: boolean = false;
  formatoInput: string = 'password';
  usuario: Usuario = null;

  modalRefUsuario: NgbModalRef = null;
  modalRefAsignar: NgbModalRef = null;
  formUsuario: FormGroup = this._formBuilder.group({
    guid: null,
    personal: [{}, [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    idRol: [0, [Validators.required]],
    usuario: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _clipboard: Clipboard
  ) {}

  ngOnInit(): void {
    this.obtenerCombo();
    this.obtener();
  }

  obtenerCombo(): void {
    this._integraService
      .getJsonResponse(constApiGestionPersonal.UsuarioObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.listaRoles = resp.body;
          this.listaFiltroRoles = resp.body;
        },
        error: (err) => {
          console.log(`Surgio el error ${err.error}`);
        },
      });
  }

  asociarModulos(): void {
    let objetoEnviar = {
      IdUsuario: this.usuario.idUsuario,
      IdsModulo: this.listaModulosAsociar.join(','),
    };
    this.gridMisModulos.loading = true;
    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.ModuloSistemaAsignarModulos,
        objetoEnviar
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body) {
            this.obtenerMisModulos(this.usuario.idUsuario);
            this.obtenerListaModulos(this.usuario.idUsuario);
            this._alertaService.notificationSuccessBotom(
              `Asignacion de modulos exitosa`
            );
          }
        },
        error: (err) => {
          this.gridMisModulos.loading = false;
          this._alertaService.notificationWarning(
            `No se pudo asignar los modulos`
          );
        },
      });
    this.reestablecer();
  }
  desasociarModulos(): void {
    let objetoEnviar = {
      IdUsuario: this.usuario.idUsuario,
      IdsModulo: this.listaModulosDesasociar.join(','),
    };
    this.gridMisModulos.loading = true;
    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.ModuloSistemaDesasignarModulos,
        objetoEnviar
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body) {
            this.obtenerMisModulos(this.usuario.idUsuario);
            this.obtenerListaModulos(this.usuario.idUsuario);
            this._alertaService.notificationSuccessBotom(
              `Desasignacion de modulos exitosa`
            );
          }
        },
        error: (err) => {
          this.gridMisModulos.loading = false;
          this._alertaService.notificationWarning(
            `No se pudo desasignar los modulos`
          );
        },
      });
    this.reestablecer();
  }
  asociarPaqueteModulos(dataItem: PaqueteModulo): void {
    let objetoEnviar = {
      IdUsuario: this.usuario.idUsuario,
      IdsModulo: dataItem.idModuloSistema,
    };
    this.gridMisModulos.loading = true;
    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.ModuloSistemaAsignarModulos,
        objetoEnviar
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body) {
            this.obtenerMisModulos(this.usuario.idUsuario);
            this.obtenerListaModulos(this.usuario.idUsuario);
            this._alertaService.notificationSuccessBotom(
              `Asignacion de modulos exitosa`
            );
          }
        },
        error: (err) => {
          this.gridMisModulos.loading = false;
          this._alertaService.notificationWarning(
            `No se pudo asignar los modulos`
          );
        },
      });
    this.reestablecer();
  }
  desasociarPaqueteModulos(dataItem: PaqueteModulo): void {
    let objetoEnviar = {
      IdUsuario: this.usuario.idUsuario,
      IdsModulo: dataItem.idModuloSistema,
    };
    this.gridMisModulos.loading = true;
    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.ModuloSistemaDesasignarModulos,
        objetoEnviar
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body) {
            this.obtenerMisModulos(this.usuario.idUsuario);
            this.obtenerListaModulos(this.usuario.idUsuario);
            this._alertaService.notificationSuccessBotom(
              `Desasignacion de modulos exitosa`
            );
          }
        },
        error: (err) => {
          this.gridMisModulos.loading = false;
          this._alertaService.notificationWarning(
            `No se pudo desasignar los modulos`
          );
        },
      });
    this.reestablecer();
  }
  obtener(): void {
    this.gridUsuario.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.UsuarioObtenerTodo)
      .subscribe({
        next: (resp: HttpResponse<Usuario[]>) => {
          this.gridUsuario.data = resp.body;
          this.gridUsuario.loading = false;
        },
        error: (err) => {
          console.log(`Surgio el error ${err.error}`);
        },
      });
  }
  obtenerPaquetes(): void {
    this.gridListaPaqueteModulos.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ModuloSistemaPaqueteObtener)
      .subscribe({
        next: (resp: HttpResponse<PaqueteModulo[]>) => {
          this.gridListaPaqueteModulos.data = resp.body;
          this.gridListaPaqueteModulos.loading = false;
        },
        error: (err) => {
          console.log(`Surgio el error ${err.error}`);
        },
      });
  }
  abrirModalUsuarioAsignar(dataItem: Usuario): void {
    this.usuario = dataItem;
    this.obtenerPaquetes();
    this.obtenerMisModulos(this.usuario.idUsuario);
    this.obtenerListaModulos(this.usuario.idUsuario);
    this.modalRefAsignar = this._modalService.open(
      this.modalAsignacionUsuario,
      {
        backdrop: 'static',
        size: 'xl'
        // fullscreen: 'xxl',
      }
    );
  }

  obtenerMisModulos(idUsuario: number): void {
    this.gridMisModulos.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ModuloSistemaObtenerMisModulos}/${idUsuario}`
      )
      .subscribe({
        next: (resp: HttpResponse<Modulo[]>) => {
          this.gridMisModulos.data = resp.body;
          this.gridMisModulos.loading = false;
        },
        error: (err) => {
          this.gridMisModulos.loading = false;
          this._alertaService.notificationWarning(
            `No se pudo obtener mis modulos`
          );
        },
      });
  }

  obtenerListaModulos(idUsuario: number): void {
    this.gridListaModulos.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ModuloSistemaObtenerListaModulos}/${idUsuario}`
      )
      .subscribe({
        next: (resp: HttpResponse<Modulo[]>) => {
          this.gridListaModulos.data = resp.body;
          this.gridListaModulos.loading = false;
        },
        error: (err) => {
          this.gridListaModulos.loading = false;
          this._alertaService.notificationWarning(
            `No se pudo obtener lista de modulos`
          );
        },
      });
  }

  abrirModalUsuarioInsertar(): void {
    let nuevoPassword = this.generarPassword();
    this.generarPassword();
    this.listaUsuarios = [];
    this.formatoInput = 'password';
    this.esNuevo = true;
    this.formUsuario.reset();
    this.formUsuario.patchValue({
      guid: null,
      password: nuevoPassword,
    });
    this.modalRefUsuario = this._modalService.open(
      this.modalInformacionUsuario,
      {
        size: 'md',
        backdrop: 'static',
      }
    );
  }

  abrirModalUsuarioActualizar(dataItem: Usuario): void {
    console.log('abriendo modal', dataItem)
    this.formUsuario.reset();
    this.listaUsuarios = [];
    this.formatoInput = 'password';
    this.listaUsuarios.push({
      nombre: dataItem.nombre,
      id: dataItem.perId,
    });
    this.esNuevo = false;
    this.formUsuario.setValue({
      guid: dataItem.id,
      personal: { nombre: dataItem.nombre, id: dataItem.perId },
      email: dataItem.email,
      idRol: dataItem.rolId,
      usuario: dataItem.userName,
      password: dataItem.usClave,
    });
    this.modalRefUsuario = this._modalService.open(
      this.modalInformacionUsuario,
      {
        size: 'md',
        backdrop: 'static',
      }
    );
  }

  cerrarModalUsuario(): void {
    this.modalRefUsuario.close();
    this.formUsuario.reset();
  }

  cerrarModalAsignar(): void {
    this.modalRefAsignar.close();
  }

  insertar(): void {
    const objetoEnviar = this.formatearObjeto();
    this.loader = true;
    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.UsuarioInsertarUsuario,
        objetoEnviar
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body) {
            this.obtener();
            this.loader = false;
            this.modalRefUsuario.close();
          }
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Error: ${err.error}`);
          this.loader = false;
        },
      });
  }

  actualizar(): void {
    const objetoEnviar = this.formatearObjeto();
    this.loader = true;
    this._integraService
      .putJsonResponse(
        constApiGestionPersonal.UsuarioActualizarUsuario,
        objetoEnviar
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body) {
            this.obtener();
            this.loader = false;
            this.modalRefUsuario.close();
          }
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Error: ${err.error}`);
          this.loader = false;
        },
      });
  }
  formatearObjeto(): any {
    let objetoEnviar = this.formUsuario.getRawValue();
    return {
      guid: objetoEnviar.guid ? objetoEnviar.guid : null,
      email: objetoEnviar.email,
      idRol: objetoEnviar.idRol,
      password: objetoEnviar.password,
      idPersonal: objetoEnviar.personal.id,
      nombrePersonal: objetoEnviar.personal.nombre,
      usuario: objetoEnviar.usuario,
    };
  }
  filtrarRolesBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaRoles = this.listaFiltroRoles.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaRoles = this.listaFiltroRoles;
    }
  }

  filtrarPersonalBusqueda(value: string): void {
    if (value.length > 4) {
      this._integraService
        .getJsonResponse(
          `${constApiGlobal.PersonalObtenerPersonalAutocomplete}/${value}`
        )
        .subscribe({
          next: (resp: HttpResponse<IComboBase1[]>) => {
            this.listaUsuarios = resp.body;
          },
        });
    } else {
      this.listaUsuarios = [];
    }
  }

  mostrarPassword(): void {
    this.formatoInput = this.formatoInput == 'password' ? 'text' : 'password';
  }

  reestablecer(): void {
    this.listaModulosAsociar = [];
    this.listaModulosDesasociar = [];
    this.gridMisModulos.loadData();
    this.gridListaModulos.loadData();
  }

  asociarNuevoPassword(): void {
    let nuevoPassword = this.generarPassword();
    this.formUsuario.get('password').setValue(nuevoPassword);
    this._alertaService.notificationSuccess('Nueva contraseña generada');
  }

  copiarClipboard(): void {
    let form = this.formUsuario.getRawValue();
    this._clipboard.copy(
      `Personal: ${form.personal.nombre}\nE-mail:   ${form.email}\nUsuario:  ${form.usuario}\nPassword: ${form.password}`
    );
    this._alertaService.notificationSuccess(
      'Informacion copiada correctamente'
    );
  }

  generarPassword(): string {
    let longitud = 10;
    let result = '';
    let minusculas =
      'a b c d e f g h i j k l m n o p q r s t u v w x y z'.split(' ');
    let mayusculas =
      'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z'.split(' ');
    let numeros = '1 2 3 4 5 6 7 8 9 0'.split(' ');
    let especiales = '@ # _ ^ * % . + : ; ='.split(' ');
    const coleccion = minusculas.concat(
      mayusculas.concat(numeros.concat(especiales))
    );
    for (let i = 0; i <= longitud; i++) {
      const random = Math.floor(Math.random() * coleccion.length);
      result += coleccion[random];
    }
    return result;
  }
}

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiGestionPersonal } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
interface ModuloSistemaPaquete {
  id: number;
  nombre: string;
  idModuloSistema: string;
  descripcion: string;
}
interface ModuloSistemaDetalle {
  id: number;
  nombreGrupo: string;
  nombreModulo: string;
  url: string;
}
@Component({
  selector: 'app-gestion-modulos',
  templateUrl: './gestion-modulos.component.html',
  styleUrls: ['./gestion-modulos.component.scss'],
})
export class GestionModulosComponent implements OnInit {
  @ViewChild('modalAsociarModulos') modalAsociarModulos: any;

  gridPaqueteModulo: KendoGrid = new KendoGrid();
  gridPaqueteMisModulo: KendoGrid = new KendoGrid();
  gridPaqueteListaModulo: KendoGrid = new KendoGrid();

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  loaderModal: boolean = false;
  esNuevo: boolean = false;

  listaDesasociarModulo: number[] = [];
  listaAsociarModulo: number[] = [];

  modalRefEditar: NgbModalRef = null;

  formPaqueteModulos: FormGroup = this._formBuilder.group({
    id: 0,
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    idModuloSistema: '',
    descripcion: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
  });

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.obtener();
  }
  obtener(): void {
    this.gridPaqueteModulo.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ModuloSistemaPaqueteObtener)
      .subscribe({
        next: (resp: HttpResponse<ModuloSistemaPaquete[]>) => {
          this.gridPaqueteModulo.data = resp.body;
          this.gridPaqueteModulo.loading = false;
        },
        error: (err) => {
          this._alertaService.notificationWarning(
            `Surgio un error: ${err.error}`
          );
        },
      });
  }
  abrirModalInsertar(): void {
    this.gridPaqueteMisModulo.data = [];
    this.formPaqueteModulos.reset();
    this.modalRefEditar = this._modalService.open(this.modalAsociarModulos, {
      size: 'xl',
      backdrop: 'static',
    });
    this.obtenerModulosLista(0);
    this.esNuevo = true;
  }
  abrirModalActualizar(dataItem: ModuloSistemaPaquete): void {
    this.modalRefEditar = this._modalService.open(this.modalAsociarModulos, {
      size: 'xl',
      backdrop: 'static',
    });
    this.formPaqueteModulos.setValue({
      id: dataItem.id,
      nombre: dataItem.nombre,
      idModuloSistema: dataItem.idModuloSistema,
      descripcion: dataItem.descripcion,
    });
    const idPaquete = dataItem.id;
    this.obtenerModulosDelPaquete(idPaquete);
    this.obtenerModulosLista(idPaquete);
    this.esNuevo = false;
  }
  insertar(): void {
    this.gridPaqueteModulo.loading = true;
    let objetoEnviar = this.formPaqueteModulos.getRawValue();
    objetoEnviar.id = 0;
    objetoEnviar.idModuloSistema = this.gridPaqueteMisModulo.data
      .map((x) => {
        return x.id;
      })
      .join(',');
    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.ModuloSistemaPaqueteInsertar,
        objetoEnviar
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body) {
            this.loaderModal = false;
            this.modalRefEditar.close();
            this.obtener();
          }
        },
        error: (err) => {
          this._alertaService.notificationWarning(
            `Surgio un error: ${err.error}`
          );
          this.loaderModal = false;
        },
      });
  }
  actualizar(): void {
    this.loaderModal = true;
    let objetoEnviar = this.formPaqueteModulos.getRawValue();
    objetoEnviar.idModuloSistema = this.gridPaqueteMisModulo.data
      .map((x) => {
        return x.id;
      })
      .join(',');
    this._integraService
      .putJsonResponse(
        constApiGestionPersonal.ModuloSistemaPaqueteActualizar,
        objetoEnviar
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body) {
            this.loaderModal = false;
            this.modalRefEditar.close();
            this.obtener();
          }
        },
        error: (err) => {
          this._alertaService.notificationWarning(
            `Surgio un error: ${err.error}`
          );
          this.loaderModal = false;
        },
      });
  }
  eliminar(idPaquete: number): void {
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
        this.gridPaqueteModulo.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiGestionPersonal.ModuloSistemaPaqueteEliminar}/${idPaquete}`
          )
          .subscribe({
            next: (resp: HttpResponse<boolean>) => {
              if (resp.body) {
                this.obtener();
                this.gridPaqueteModulo.loading = false;
              }
            },
          });
      }
    });
  }
  asociarModulo(): void {
    const modulosAasociar: ModuloSistemaDetalle[] =
      this.gridPaqueteListaModulo.data.filter((x: ModuloSistemaDetalle) =>
        this.listaAsociarModulo.includes(x.id)
      );
    const modulosPermanecen: ModuloSistemaDetalle[] =
      this.gridPaqueteListaModulo.data.filter(
        (x: ModuloSistemaDetalle) => !this.listaAsociarModulo.includes(x.id)
      );
    modulosAasociar.forEach((x) => {
      this.gridPaqueteMisModulo.data.push({
        id: x.id,
        nombreGrupo: x.nombreGrupo,
        nombreModulo: x.nombreModulo,
        url: x.url,
      });
    });
    this.gridPaqueteListaModulo.data = modulosPermanecen;
    this.reestablecer();
  }
  desasociarModulo(): void {
    const modulosAdesasociar: ModuloSistemaDetalle[] =
      this.gridPaqueteMisModulo.data.filter((x: ModuloSistemaDetalle) =>
        this.listaDesasociarModulo.includes(x.id)
      );
    const modulosPermanecen: ModuloSistemaDetalle[] =
      this.gridPaqueteMisModulo.data.filter(
        (x: ModuloSistemaDetalle) => !this.listaDesasociarModulo.includes(x.id)
      );
    modulosAdesasociar.forEach((x) => {
      this.gridPaqueteListaModulo.data.push({
        id: x.id,
        nombreGrupo: x.nombreGrupo,
        nombreModulo: x.nombreModulo,
        url: x.url,
      });
    });
    this.gridPaqueteMisModulo.data = modulosPermanecen;
    this.reestablecer();
  }
  reestablecer(): void {
    this.listaAsociarModulo = [];
    this.listaDesasociarModulo = [];
    this.gridPaqueteListaModulo.loadData();
    this.gridPaqueteMisModulo.loadData();
  }
  obtenerModulosDelPaquete(idPaquete: number): void {
    this.gridPaqueteModulo.loading = true;
    this.gridPaqueteMisModulo.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ModuloSistemaPaqueteObtenerModulos}/${idPaquete}`
      )
      .subscribe({
        next: (resp: HttpResponse<ModuloSistemaDetalle[]>) => {
          this.gridPaqueteMisModulo.loading = false;
          this.gridPaqueteMisModulo.data = resp.body;
          this.gridPaqueteModulo.loading = false;
        },
        error: (err) => {
          this._alertaService.notificationWarning(
            `Surgio un error: ${err.error}`
          );
          this.gridPaqueteMisModulo.loading = false;
          this.gridPaqueteModulo.loading = false;
        },
      });
  }
  obtenerModulosLista(idPaquete: number): void {
    this.gridPaqueteModulo.loading = true;
    this.gridPaqueteListaModulo.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ModuloSistemaPaqueteObtenerListaModulos}/${idPaquete}`
      )
      .subscribe({
        next: (resp: HttpResponse<ModuloSistemaDetalle[]>) => {
          this.gridPaqueteListaModulo.loading = false;
          this.gridPaqueteListaModulo.data = resp.body;
          this.gridPaqueteModulo.loading = false;
        },
        error: (err) => {
          this._alertaService.notificationWarning(
            `Surgio un error: ${err.error}`
          );
          this.gridPaqueteListaModulo.loading = false;
          this.gridPaqueteModulo.loading = false;
        },
      });
  }
}

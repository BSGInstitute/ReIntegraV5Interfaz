import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
interface ColeccionCombos {
  comboModalidad: IComboBase1[];
  comboClasificacionUbicacion: IComboBase1[];
}
interface Flujo {
  id: number;
  nombre: string;
  idModalidadCurso: number;
  idClasificacionUbicacionDocente: number;
}
interface FlujoFase {
  id: number;
  idFlujo: number;
  nombre: string;
  orden: number;
}
interface FlujoActividad {
  id: number;
  idFlujoFase: number;
  orden: number;
  nombre: string;
}
interface FlujoOcurrencia {
  id: number;
  idFlujoActividad: number;
  orden: number;
  nombre: string;
  cerrarSeguimiento: boolean;
  idFase_Destino: number;
  idFlujoActividad_Siguiente: number;
  faseDestino: string;
  actividadSiguiente: string;
}
@Component({
  selector: 'app-flujo-proveedor-docente',
  templateUrl: './flujo-proveedor-docente.component.html',
  styleUrls: ['./flujo-proveedor-docente.component.scss']
})
export class FlujoProveedorDocenteComponent implements OnInit {
  @ViewChild('modalFlujoFase') modalFlujo_Fase: any;
  @ViewChild('modalFlujoFaseActividad') modalFlujo_Fase_Actividad: any;
  @ViewChild('modalFlujoFaseActividadOcurrencia') modalFlujo_Fase_Actividad_Ocurrencia: any;
  
  gridFlujoProveedores: KendoGrid = new KendoGrid();
  gridFlujoProveedoresFase: KendoGrid = new KendoGrid();
  gridFlujoProveedoresFaseActividad: KendoGrid = new KendoGrid();
  gridFlujoProveedoresFaseActividadOcurrencia: KendoGrid = new KendoGrid();

  coleccionCombos: ColeccionCombos;
  listaModalidades: IComboBase1[];
  listaClasificacionUbicacion: IComboBase1[];
  listaFases: IComboBase1[];
  listaActividades: IComboBase1[];

  loaderModalFlujo: boolean = false;
  loaderModalFlujoFase: boolean = false;
  loaderModalFlujoFaseActividad: boolean = false;
  loaderModalFlujoFaseActividadOcurrencia: boolean = false;

  idFlujo: number = 0;
  idFlujoFase: number = 0;
  idFlujoActividad: number = 0;
  idFlujoOcurrencia: number = 0;

  flagFlujo: boolean = true;
  flagFlujoFase: boolean = true;
  flagFlujoFaseActividad: boolean = true;
  flagFlujoFaseActividadOcurrencia: boolean = true;

  modalRefFase: NgbModalRef = null;
  modalRefFaseActividad: NgbModalRef = null;
  modalRefFaseActividadOcurrencia: NgbModalRef = null;

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  
  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtener();
    this.obtenerCombo();
    this.cargarConfiguracionGridFlujo();
    this.cargarConfiguracionGridFlujoFase();
    this.cargarConfiguracionGridFlujoActividad();
    this.cargarConfiguracionGridFlujoOcurrencia();
  }

  obtener(): void {
    this._integraService.getJsonResponse(constApiPlanificacion.FlujoObtener)
      .subscribe({
        next: (response: HttpResponse<Flujo[]>) => {
          this.gridFlujoProveedores.data = response.body;
          this.gridFlujoProveedores.data = this.gridFlujoProveedores.data.sort(
            (a, b) => b.id - a.id
          );
        }
      });
  }

  obtenerCombo(): void {
    this.loaderModalFlujo = true;
    this._integraService.getJsonResponse(constApiPlanificacion.FlujoObtenerCombos)
      .subscribe({
        next: (response: HttpResponse<ColeccionCombos>) => {
          this.coleccionCombos = response.body;
          this.listaModalidades = response.body.comboModalidad;
          this.listaClasificacionUbicacion = response.body.comboClasificacionUbicacion;
          this.loaderModalFlujo = false;
        }
      });
  }

  abrirModalFlujoFase(idFlujo: number): void {
    this.idFlujo = idFlujo;
    this.modalRefFase = this._modalService.open(
      this.modalFlujo_Fase,
      {
        size: 'lg',
        backdrop: 'static',
      }
    );
    this.obtenerFlujoFasePorIdFlujo(this.idFlujo);
  }
  obtenerFlujoFasePorIdFlujo(idFlujo: number): void {
    this.gridFlujoProveedoresFase.data = [];
    this._integraService.getJsonResponse(`${constApiPlanificacion.FlujoObtenerFlujoFase}/${idFlujo}`)
      .subscribe({
        next: (response: HttpResponse<FlujoFase[]>) => {
          this.gridFlujoProveedoresFase.data = response.body;
          this.listaFases = response.body;
        }
      });
  }

  abrirModalFlujoActividad(idFlujoFase: number): void {
    this.idFlujoFase = idFlujoFase;
    this.modalRefFaseActividad = this._modalService.open(
      this.modalFlujo_Fase_Actividad,
      {
        size: 'lg',
        backdrop: 'static',
      }
    );  
    this.obtenerFlujoActividadPorIdFlujoFase(idFlujoFase);
  }
  obtenerFlujoActividadPorIdFlujoFase(idFlujoFase: number): void {
    this.gridFlujoProveedoresFaseActividad.data = [];
    this._integraService.getJsonResponse(`${constApiPlanificacion.FlujoObtenerFlujoActividad}/${idFlujoFase}`)
      .subscribe({
        next: (response: HttpResponse<FlujoActividad[]>) => {
          this.gridFlujoProveedoresFaseActividad.data = response.body;
        }
      });
  }

  abrirModalFlujoOcurrencia(idFlujoActividad: number): void {
    this.idFlujoActividad = idFlujoActividad;
    this.modalRefFaseActividad = this._modalService.open(
      this.modalFlujo_Fase_Actividad_Ocurrencia,
      {
        size: 'xl',
        backdrop: 'static',
      }
    ); 
    this.obtenerFlujoOcurrenciaPorIdFlujoActividad(idFlujoActividad);
  }
  obtenerFlujoOcurrenciaPorIdFlujoActividad(idFlujoActividad: number): void {
    this.gridFlujoProveedoresFaseActividadOcurrencia.data = [];
    this._integraService.getJsonResponse(`${constApiPlanificacion.FlujoObtenerFlujoOcurrencia}/${idFlujoActividad}`)
      .subscribe({
        next: (response: HttpResponse<FlujoOcurrencia[]>) => {
          this.gridFlujoProveedoresFaseActividadOcurrencia.data = response.body;
        }
      });
  }
  
  //#region Metodos_y_configuracion_de_la_grilla_principal
  insertarFlujo(dataItem: Flujo): void {
    this.gridFlujoProveedores.loading = true;
    this._integraService.postJsonResponse(constApiPlanificacion.FlujoInsertar, dataItem)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if(response.body) {
            this.obtener();
            this.gridFlujoProveedores.loading = false;
          }
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.gridFlujoProveedores.loading = false;
        }
      });
  }
  actualizarFlujo(dataItem: Flujo): void {
    this.gridFlujoProveedores.loading = true;
    this._integraService.putJsonResponse(constApiPlanificacion.FlujoActualizar, dataItem)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if(response.body) {
            this.obtener();
            this.gridFlujoProveedores.loading = false;
          }
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.gridFlujoProveedores.loading = false;
        }
      });
  }
  eliminarFlujo(id: number): void {
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
        this.gridFlujoProveedores.loading = true;
        this._integraService.deleteJsonResponse(`${constApiPlanificacion.FlujoEliminar}/${id}`)
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            if(response.body) {
              this.obtener();
              this.gridFlujoProveedores.loading = false;
            }
          },
          error: (err) => {
            this._alertaService.notificationWarning(`Surgio un error: ${err}`);
            this.gridFlujoProveedores.loading = false;
          }
        });
      }
    });
  }
  cargarConfiguracionGridFlujo(): void {
    this.gridFlujoProveedores.formGroup = this._formBuilder.group({
      id: [0],
      nombreFlujo: [, [ Validators.required ]],
      idModalidadCurso: [0, [ Validators.required ]],
      idClasificacionUbicacionDocente: [0, [ Validators.required ]]
    });
    this.gridFlujoProveedores.getEditEvent$().subscribe({
      next: () => { this.flagFlujo = false }
    });
    this.gridFlujoProveedores.getAddEvent$().subscribe({
      next: () => { this.flagFlujo = false }
    });
    this.gridFlujoProveedores.getCancelEvent$().subscribe({
      next: () => { this.flagFlujo = true }
    });
    this.gridFlujoProveedores.getSaveEvent$().subscribe({
      next: (resp) => {
        let form = resp.dataForm;
        let dataEnviada = {
          id: 0,
          idClasificacionUbicacionDocente: form.idClasificacionUbicacionDocente,
          idModalidadCurso: form.idModalidadCurso,
          nombre: form.nombreFlujo
        }
        this.insertarFlujo(dataEnviada);
        this.flagFlujo = true;
      },
    });
    this.gridFlujoProveedores.getUpdateEvent$().subscribe({
      next: (resp) => {
        let form = resp.dataForm;
        let dataEnviada = {
          id: form.id,
          idClasificacionUbicacionDocente: form.idClasificacionUbicacionDocente,
          idModalidadCurso: form.idModalidadCurso,
          nombre: form.nombreFlujo
        }
        this.actualizarFlujo(dataEnviada);
        this.flagFlujo = true;
      },
    });
    this.gridFlujoProveedores.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.eliminarFlujo(resp.dataItem.id)
      },
    });
  }
  //#endregion Metodos_y_configuracion_de_la_grilla_principal

  //#region Metodos_y_configuracion_de_la_grilla_secundaria
  insertarFlujoFase(dataItem: FlujoFase): void {
    this.gridFlujoProveedoresFase.loading = true;
    this._integraService.postJsonResponse(constApiPlanificacion.FlujoInsertarFase, dataItem)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if(response.body) {
            this.obtenerFlujoFasePorIdFlujo(this.idFlujo);
            this.gridFlujoProveedoresFase.loading = false;
          }
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.gridFlujoProveedoresFase.loading = false;
        }
      });
  }
  actualizarFlujoFase(dataItem: FlujoFase): void {
    this.gridFlujoProveedoresFase.loading = true;
    this._integraService.putJsonResponse(constApiPlanificacion.FlujoActualizarFase, dataItem)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if(response.body) {
            this.obtenerFlujoFasePorIdFlujo(this.idFlujo);
            this.gridFlujoProveedoresFase.loading = false;
          }
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.gridFlujoProveedoresFase.loading = false;
        }
      });
  }
  eliminarFlujoFase(id: number): void {
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
        this.gridFlujoProveedoresFase.loading = true;
        this._integraService.deleteJsonResponse(`${constApiPlanificacion.FlujoEliminarFase}/${id}`)
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            if(response.body) {
              this.obtenerFlujoFasePorIdFlujo(this.idFlujo);
              this.gridFlujoProveedoresFase.loading = false;
            }
          },
          error: (err) => {
            this._alertaService.notificationWarning(`Surgio un error: ${err}`);
            this.gridFlujoProveedoresFase.loading = false;
          }
        });
      }
    });
  }
  cargarConfiguracionGridFlujoFase(): void {
    this.gridFlujoProveedoresFase.formGroup = this._formBuilder.group({
      id: [0],
      nombre: [, [ Validators.required ]],
      orden: [0, [ Validators.required ]]
    });
    this.gridFlujoProveedoresFase.getEditEvent$().subscribe({
      next: () => { this.flagFlujoFase = false }
    });
    this.gridFlujoProveedoresFase.getAddEvent$().subscribe({
      next: () => { this.flagFlujoFase = false }
    });
    this.gridFlujoProveedoresFase.getCancelEvent$().subscribe({
      next: () => { this.flagFlujoFase = true }
    });
    this.gridFlujoProveedoresFase.getSaveEvent$().subscribe({
      next: (resp) => {
        let dataEnviada = resp.dataForm;
        dataEnviada.id = 0;
        dataEnviada.idFlujo = this.idFlujo;
        this.insertarFlujoFase(dataEnviada);
        this.flagFlujoFase = true;
      },
    });
    this.gridFlujoProveedoresFase.getUpdateEvent$().subscribe({
      next: (resp) => {
        let dataEnviada = resp.dataForm;
        dataEnviada.idFlujo = this.idFlujo;
        this.actualizarFlujoFase(dataEnviada);
        this.flagFlujoFase = true;
      },
    });
    this.gridFlujoProveedoresFase.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.eliminarFlujoFase(resp.dataItem.id)
      },
    });
  }
  //#endregion Metodos_y_configuracion_de_la_grilla_secundaria

  //#region Metodos_y_configuracion_de_la_grilla_tercer
  insertarFlujoActividad(dataItem: FlujoActividad): void {
    this.gridFlujoProveedoresFaseActividad.loading = true;
    this._integraService.postJsonResponse(constApiPlanificacion.FlujoInsertarFaseActividad, dataItem)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if(response.body) {
            this.obtenerFlujoActividadPorIdFlujoFase(this.idFlujoFase);
            this.gridFlujoProveedoresFaseActividad.loading = false;
          }
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.gridFlujoProveedoresFaseActividad.loading = false;
        }
      });
  }
  actualizarFlujoActividad(dataItem: FlujoActividad): void {
    this.gridFlujoProveedoresFaseActividad.loading = true;
    this._integraService.putJsonResponse(constApiPlanificacion.FlujoActualizarFaseActividad, dataItem)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if(response.body) {
            this.obtenerFlujoActividadPorIdFlujoFase(this.idFlujoFase);
            this.gridFlujoProveedoresFaseActividad.loading = false;
          }
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.gridFlujoProveedoresFaseActividad.loading = false;
        }
      });
  }
  eliminarFlujoActividad(id: number): void {
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
      if (result.isConfirmed){
        this.gridFlujoProveedoresFaseActividad.loading = true;
        this._integraService.deleteJsonResponse(`${constApiPlanificacion.FlujoEliminarFaseActividad}/${id}`)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if(response.body) {
                this.obtenerFlujoActividadPorIdFlujoFase(this.idFlujoFase);
                this.gridFlujoProveedoresFaseActividad.loading = false;
              }
            },
            error: (err) => {
              this._alertaService.notificationWarning(`Surgio un error: ${err}`);
              this.gridFlujoProveedoresFaseActividad.loading = false;
            }
          });
      }
    });
  }
  cargarConfiguracionGridFlujoActividad(): void {
    this.gridFlujoProveedoresFaseActividad.formGroup = this._formBuilder.group({
      id: 0,
      nombre: [, [ Validators.required ]],
      orden: [0, [ Validators.required ]]
    });
    this.gridFlujoProveedoresFaseActividad.getEditEvent$().subscribe({
      next: () => { this.flagFlujoFaseActividad = false }
    });
    this.gridFlujoProveedoresFaseActividad.getAddEvent$().subscribe({
      next: () => { this.flagFlujoFaseActividad = false }
    });
    this.gridFlujoProveedoresFaseActividad.getCancelEvent$().subscribe({
      next: () => { this.flagFlujoFaseActividad = true }
    });
    this.gridFlujoProveedoresFaseActividad.getSaveEvent$().subscribe({
      next: (resp) => {
        let dataEnviada = resp.dataForm;
        dataEnviada.id = 0;
        dataEnviada.idFlujoFase = this.idFlujoFase;
        this.insertarFlujoActividad(dataEnviada);
        this.flagFlujoFaseActividad = true;
      },
    });
    this.gridFlujoProveedoresFaseActividad.getUpdateEvent$().subscribe({
      next: (resp) => {
        let dataEnviada = resp.dataForm;
        dataEnviada.idFlujoFase = this.idFlujoFase;
        this.actualizarFlujoActividad(dataEnviada);
        this.flagFlujoFaseActividad = true;
      },
    });
    this.gridFlujoProveedoresFaseActividad.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.eliminarFlujoActividad(resp.dataItem.id)
      },
    });
  }
  //#endregion Metodos_y_configuracion_de_la_grilla_tercer

  //#region Metodos_y_configuracion_de_la_grilla_tercer
  insertarFlujoOcurrencia(dataItem: FlujoOcurrencia): void {
    this.gridFlujoProveedoresFaseActividadOcurrencia.loading = true;
    this._integraService.postJsonResponse(constApiPlanificacion.FlujoInsertarFaseActividadOcurrencia, dataItem)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if(response.body) {
            this.obtenerFlujoOcurrenciaPorIdFlujoActividad(this.idFlujoActividad);
            this.gridFlujoProveedoresFaseActividadOcurrencia.loading = false;
          }
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.gridFlujoProveedoresFaseActividadOcurrencia.loading = false;
        }
      });
  }
  actualizarFlujoOcurrencia(dataItem: FlujoOcurrencia): void {
    this.gridFlujoProveedoresFaseActividadOcurrencia.loading = true;
    this._integraService.putJsonResponse(constApiPlanificacion.FlujoActualizarFaseActividadOcurrencia, dataItem)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if(response.body) {
            this.obtenerFlujoOcurrenciaPorIdFlujoActividad(this.idFlujoActividad);
            this.gridFlujoProveedoresFaseActividadOcurrencia.loading = false;
          }
        },
        error: (err) => {
          this._alertaService.notificationWarning(`Surgio un error: ${err}`);
          this.gridFlujoProveedoresFaseActividadOcurrencia.loading = false;
        }
      });
  }
  eliminarFlujoOcurrencia(id: number): void {
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
        this.gridFlujoProveedoresFaseActividadOcurrencia.loading = true;
        this._integraService.deleteJsonResponse(`${constApiPlanificacion.FlujoEliminarFaseActividadOcurrencia}/${id}`)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if(response.body) {
                this.obtenerFlujoOcurrenciaPorIdFlujoActividad(this.idFlujoActividad);
                this.gridFlujoProveedoresFaseActividadOcurrencia.loading = false;
              }
            },
            error: (err) => {
              this._alertaService.notificationWarning(`Surgio un error: ${err}`);
              this.gridFlujoProveedoresFaseActividadOcurrencia.loading = false;}
          });
      }
    });
  }
  cargarConfiguracionGridFlujoOcurrencia(): void {
    this.gridFlujoProveedoresFaseActividadOcurrencia.formGroup = this._formBuilder.group({
      id: 0,
      nombre: ['', [ Validators.required ]],
      orden: [0, [ Validators.required ]],
      idFase_Destino: 0,
      idFlujoActividad_Siguiente: 0,
      cerrarSeguimiento: false,
    });
    this.gridFlujoProveedoresFaseActividadOcurrencia.getEditEvent$().subscribe({
      next: () => { this.flagFlujoFaseActividadOcurrencia = false }
    });
    this.gridFlujoProveedoresFaseActividadOcurrencia.getAddEvent$().subscribe({
      next: () => { this.flagFlujoFaseActividadOcurrencia = false }
    });
    this.gridFlujoProveedoresFaseActividadOcurrencia.getCancelEvent$().subscribe({
      next: () => { this.flagFlujoFaseActividadOcurrencia = true }
    });
    this.gridFlujoProveedoresFaseActividadOcurrencia.getSaveEvent$().subscribe({
      next: (resp) => {
        let dataEnviada = resp.dataForm;
        dataEnviada.id = 0;
        dataEnviada.idFlujoActividad = this.idFlujoActividad;
        dataEnviada.cerrarSeguimiento = (dataEnviada.cerrarSeguimiento != null) ? dataEnviada.cerrarSeguimiento : false;
        dataEnviada.idFaseDestino = dataEnviada.idFase_Destino;
        dataEnviada.idFlujoActividadSiguiente = dataEnviada.idFlujoActividad_Siguiente;
        this.insertarFlujoOcurrencia(dataEnviada);
        this.flagFlujoFaseActividadOcurrencia = true;
      },
    });
    this.gridFlujoProveedoresFaseActividadOcurrencia.getUpdateEvent$().subscribe({
      next: (resp) => {
        let dataEnviada = resp.dataForm;
        dataEnviada.idFlujoActividad = this.idFlujoActividad;
        dataEnviada.cerrarSeguimiento = (dataEnviada.cerrarSeguimiento != null) ? dataEnviada.cerrarSeguimiento : false;
        dataEnviada.idFaseDestino = dataEnviada.idFase_Destino;
        dataEnviada.idFlujoActividadSiguiente = dataEnviada.idFlujoActividad_Siguiente;
        this.actualizarFlujoOcurrencia(dataEnviada);
        this.flagFlujoFaseActividadOcurrencia = true;
      },
    });
    this.gridFlujoProveedoresFaseActividadOcurrencia.getRemoveEvent$().subscribe({
      next: (resp) => {
        this.eliminarFlujoOcurrencia(resp.dataItem.id)
      },
    });
  }
  //#endregion Metodos_y_configuracion_de_la_grilla_tercer

  obtenerActividades(idFaseActividad: number): void{
    this.gridFlujoProveedoresFaseActividadOcurrencia.loading = true;
    this._integraService.getJsonResponse(`${constApiPlanificacion.FlujoObtenerFlujoActividad}/${idFaseActividad}`)
      .subscribe({
        next: (response: HttpResponse<FlujoActividad[]>) => {
          this.listaActividades = response.body;
          this.gridFlujoProveedoresFaseActividadOcurrencia.loading = false;
        }
      });
  }
}

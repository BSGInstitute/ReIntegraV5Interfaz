import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { constApiPlanificacion } from '@environments/constApi';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { TipoProgramaCarrera } from '@planificacion/models/enumPgeneral';

interface IPGeneralASubPGeneralCursoHijo {
  idTroncalGeneral: number;
  orden: number | null;
  nombre: string;
  idCurso: number;
  esVisiblePortal: boolean | null;
  idCiclo: number | null;
  idModulo: number | null;
  versiones: number[];
}
interface PGeneralASubPGeneralInsertar {
  idPgeneralPadre: number;
  idPgeneralHijo: number;
}
interface PGeneralASubPGeneralActualizar {
  id: number;
  orden: number | null;
  idCiclo: number | null;
  idModulo: number | null;
  versiones: number[];
}
/**
 * @module PgeneralModule
 * @description Componente de Programas Generales
 * @author Gretel Canasa, Flavio R.
 * @version 1.2.0
 * @history
 * * 26/04/2026 Implementacion de componente
 **/
@Component({
  selector: 'app-modal-content-pgeneral-cursos',
  templateUrl: './modal-content-pgeneral-cursos.component.html',
  styleUrls: ['./modal-content-pgeneral-cursos.component.scss'],
})
export class ModalContentPgeneralCursosComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}

  private _subscriptions$: Subscription = new Subscription();

  @Input() pgeneralService: PgeneralService;
  gridProgramasHijos = new KendoGrid<IPGeneralASubPGeneralCursoHijo>();
  esProgramaInstituto: boolean = false;
  formControlIdPgeneralNuevo = new FormControl([null, Validators.required]);
  private _modalRefInsertar: any;
  loaderModal: boolean = false;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  ngOnInit(): void {
    this.configurarGridProgramasHijos();
    this.esProgramaInstituto =
      this.dataItemPgeneral.idTipoProgramaCarrera ==
      TipoProgramaCarrera.INSTITUTO;
    this.obtenerCursosHijos();
  }
  get dataItemPgeneral() {
    return this.pgeneralService.dataItemPgeneral;
  }
  /**
   * Busca el nombre de la version por su id
   * @param idVersion
   * @returns Nombre de version
   */
  obtenerNombreVersionPrograma(idVersion: number) {
    let result = this.pgeneralService.combosModulo.versionPrograma.find(
      (x) => x.id == idVersion
    );
    return result.nombre;
  }
  /**
   * Busca el nombre del modulo por su id
   * @param idModulo
   * @returns Nombre del modulo
   */
  obtenerNombreModulo(idModulo: number) {
    let result = this.pgeneralService.combosModulo.moduloPrograma.find(
      (x) => x.id == idModulo
    );
    return result.nombre;
  }
  /**
   * Busca el nombre del ciclo por su id
   * @param idTipo
   * @returns
   */
  obtenerNombreCiclo(idCiclo: number) {
    let result = this.pgeneralService.combosModulo.cicloPrograma.find(
      (x) => x.id == idCiclo
    );
    return result.nombre;
  }
  /**
   * Abre el modal para insertar nuevo programa
   * @param modalInsertar template modal insertar
   */
  onClickAsignarNuevoPrograma(modalInsertar: any) {
    this._modalRefInsertar = this._modalService.open(modalInsertar, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
    });
  }
  /**
   * Configura el formulario y los eventos de la grilla
   */
  private configurarGridProgramasHijos() {
    this.gridProgramasHijos.formGroup = this._formBuilder.group({
      orden: [null, [Validators.required]],
      idCiclo: [null],
      idModulo: [null],
      versiones: [[]],
    });
    let subUpdate$ = this.gridProgramasHijos.updateEvent$.subscribe({
      next: (resp) => {
        let json: PGeneralASubPGeneralActualizar = {
          id: resp.dataItem.idCurso,
          orden: resp.dataForm.orden,
          idCiclo: resp.dataForm.idCiclo,
          idModulo: resp.dataForm.idModulo,
          versiones: resp.dataForm.versiones ?? [],
        };
        this.actualizarCurso(json);
      },
    });
    let subRemove$ = this.gridProgramasHijos.removeEvent$.subscribe((resp) => {
      this.eliminarCurso(resp.dataItem);
    });
    this._subscriptions$.add(subUpdate$);
    this._subscriptions$.add(subRemove$);
  }
  /**
   * Obtiene los cursos programas hijos por idPgeneral
   */
  obtenerCursosHijos() {
    this.gridProgramasHijos.loading = true;
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.PgeneralAsubPgeneralObtenerCursosHijosPorIdPgeneral}/${this.dataItemPgeneral.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<IPGeneralASubPGeneralCursoHijo[]>) => {
          this.gridProgramasHijos.loading = false;
          this.gridProgramasHijos.data = resp.body;
        },
        error: (error) => {
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService
            .swalFireOptions({
              icon: 'error',
              title: '¡Ocurrio un problema al obtener los cursos asignados!',
              text: `${resp.titulo}: ${resp.mensaje}`,
            })
            .then(() => {
              this.gridProgramasHijos.data = [];
              this.gridProgramasHijos.loading = false;
            });
        },
      });
    this._subscriptions$.add(sub$);
  }
  /**
   * Actualiza los datos del programa
   * @param dataEnviada
   */
  private actualizarCurso(dataEnviada: PGeneralASubPGeneralActualizar): void {
    let jsonEnviado = dataEnviada;
    if (this.gridProgramasHijos.formGroup.valid) {
      this.gridProgramasHijos.loading = true;
      this._integraService
        .putJsonResponse(
          constApiPlanificacion.PgeneralAsubPgeneralActualizar,
          jsonEnviado
        )
        .subscribe({
          next: (response: HttpResponse<IPGeneralASubPGeneralCursoHijo>) => {
            this.gridProgramasHijos.loading = false;
            this.obtenerCursosHijos();
            this.loaderModal = false;
            this._alertaService
              .swalFireOptions({
                icon: 'success',
                title: '!Registro actualizado!',
                text: 'Se guardaron los cambios correctamente.',
              })
              .then(() => {
                this._modalRefInsertar.close();
              });
          },
          error: (error) => {
            let resp = this._alertaService.getErrorResponse(error);
            this.gridProgramasHijos.loading = false;
            this._alertaService
              .swalFireOptions({
                icon: 'error',
                title: '¡Ocurrio un problema al obtener los cursos asignados!',
                text: `${resp.titulo}: ${resp.mensaje}`,
              })
              .then(() => {});
          },
        });
    }
  }
  /**
   * Elimina el curso asignado
   * @param dataItem
   */
  private eliminarCurso(dataItem: IPGeneralASubPGeneralCursoHijo): void {
    this._alertaService
      .swalFireOptions({
        title: '¿Está seguro de eliminar el registro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.gridProgramasHijos.loading = true;
          this._integraService
            .deleteJsonResponse(
              `${constApiPlanificacion.PgeneralAsubPgeneralEliminar}/${dataItem.idCurso}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridProgramasHijos.loading = false;
                if (response.body == true) {
                  let idIndice = this.gridProgramasHijos.data.indexOf(dataItem);
                  this.gridProgramasHijos.data.splice(idIndice, 1);
                  this.gridProgramasHijos.loadView();
                  this._alertaService.swalFireOptions({
                    icon: 'success',
                    title: '¡Registro eliminado!',
                    text: 'Se elimino el registro correctamente',
                  });
                } else {
                  this._alertaService.swalFireOptions({
                    icon: 'warning',
                    title: '¡No se pudo eliminar el registro!',
                  });
                }
              },
              error: (error) => {
                this.gridProgramasHijos.loading = false;
                let resp = this._alertaService.getErrorResponse(error);
                this._alertaService
                  .swalFireOptions({
                    icon: 'error',
                    title: '¡Ocurrio un problema al eliminar el registro!',
                    text: `${resp.titulo}: ${resp.mensaje}`,
                  })
                  .then(() => {
                  });
              },
            });
        }
      });
  }
  /**
   * Agrega un programa
   */
   agregarNuevoCurso() {
    if (this.formControlIdPgeneralNuevo.valid) {
      let jsonEnvio: PGeneralASubPGeneralInsertar = {
        idPgeneralPadre: this.dataItemPgeneral.idPgeneral,
        idPgeneralHijo: this.formControlIdPgeneralNuevo.value.id,
      };
      this.loaderModal = true;
      let sub$ = this._integraService
        .postJsonResponse(
          constApiPlanificacion.PgeneralAsubPgeneralInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<IPGeneralASubPGeneralCursoHijo>) => {
            this.obtenerCursosHijos();
            this.loaderModal = false;
            this._alertaService
              .swalFireOptions({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Se asigno el curso correctamente.',
              })
              .then(() => {
                this._modalRefInsertar.close();
              });
          },
          error: (error) => {
            this.gridProgramasHijos.loading = false;
            let resp = this._alertaService.getErrorResponse(error);
            this._alertaService
              .swalFireOptions({
                icon: 'error',
                title: '¡Ocurrio un problema al insertar el curso!',
                text: `${resp.titulo}: ${resp.mensaje}`,
              })
              .then(() => {});
          },
        });
      this._subscriptions$.add(sub$);
    } else {
      this._alertaService
        .swalFireOptions({
          icon: 'info',
          title: 'Seleccione un programa',
        })
        .then(() => {
          this.formControlIdPgeneralNuevo.markAllAsTouched();
        });
    }
  }
}

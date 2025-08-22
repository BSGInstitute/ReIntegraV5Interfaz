import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ModalidadCurso,
  TipoPrograma,
} from '@planificacion/models/enumPgeneral';
import {
  DetalleEsquemaAsignado,
  EsquemaAsociado,
  EsquemaEvaluacionDetalleCompuesto,
  EsquemaEvaluacionPgeneralDetalleCompuesto,
  EsquemaEvaluacionRegistrarAsignacion,
  Modalidad,
  PGeneralCriterioEvaluacion,
  PGeneralCursoCriterioHijo,
  PgeneralCriterioEvaluacionHijo,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';

interface FormAsociarEsquemaEvaluacion {
  esquemaEvaluacion: number;
  modalidades: number[];
  docentes: number[];
  validoDesde: Date;
  esEsquemaPredeterminado: boolean;
}
interface GridCriterioEvaluacion {
  titulo: string;
  idModalidad: number;
  grid: KendoGrid<PGeneralCriterioEvaluacion>;
  flag: boolean;
}
interface GridCriterioEvaluacionHijo {
  titulo: string;
  idModalidad: number;
  grid: KendoGrid<PGeneralCursoCriterioHijo>;
  flag: boolean;
}
interface GridFormGroup {}
/**
 * @module PlanificacionModule
 * @description Componente de Programas Generales
 * @author Flavio R. Mamani Fabian
 * @version 1.2.0
 * @history
 * * 16/07/2023 Implementacion de componente
 **/
@Component({
  selector: 'app-pg-criterio-evaluacion',
  templateUrl: './pg-criterio-evaluacion.component.html',
  styleUrls: ['./pg-criterio-evaluacion.component.scss'],
})
export class PgCriterioEvaluacionComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}
  @Input() pgeneralService: PgeneralService;
  gridCriterioEvaluacion: KendoGrid<EsquemaAsociado> =
    new KendoGrid<EsquemaAsociado>();
  // Modulo - Padre
  criteriosEvaluacionMW: GridCriterioEvaluacion[] = [
    {
      titulo: 'Aonline',
      idModalidad: 1,
      grid: new KendoGrid<PGeneralCriterioEvaluacion>(),
      flag: false,
    },
    {
      titulo: 'Online',
      idModalidad: 2,
      grid: new KendoGrid<PGeneralCriterioEvaluacion>(),
      flag: false,
    },
    {
      titulo: 'Presencial',
      idModalidad: 0,
      grid: new KendoGrid<PGeneralCriterioEvaluacion>(),
      flag: false,
    },
  ];

  criteriosEvaluacionP: GridCriterioEvaluacionHijo[] = [
    {
      titulo: 'Aonline',
      idModalidad: 1,
      grid: new KendoGrid<PGeneralCursoCriterioHijo>(),
      flag: false,
    },
    {
      titulo: 'Online',
      idModalidad: 2,
      grid: new KendoGrid<PGeneralCursoCriterioHijo>(),
      flag: false,
    },
    {
      titulo: 'Presencial',
      idModalidad: 0,
      grid: new KendoGrid<PGeneralCursoCriterioHijo>(),
      flag: false,
    },
  ];
  fcCriterioEvaluacion: FormControl = new FormControl(undefined);

  tipoPrograma: FormControl = new FormControl(undefined);
  tipoPromedio: FormControl = new FormControl(1);
  comboTipoPrograma: IComboBase1[] = [];
  comboTipoPromedio: IComboBase1[] = [
    {
      id: 1,
      nombre: 'Promedio Simple',
    },
    {
      id: 1,
      nombre: 'Promedio Ponderado',
    },
  ];
  private _modalRefAsociarEsquema: any;
  private _modalRefCriterioEvaluacion: any;
  comboEsquemaEvaluacion: IComboBase1[] = [];
  comboModalidades: Modalidad[] = [];
  comboDocentes: IComboBase1[] = [];
  comboCriterioEvaluacion: IComboBase1[] = [];
  comboCriterioEvaluacionModal: IComboBase1[] = [];
  items = {
    showGridMWAonline: false,
    showGridMWOnline: false,
    showGridMWPresencial: false,
  };
  enProcesoSolicitud: boolean = false;
  isNewEsquemaEvaluacion: boolean = false;

  formAsociarEsquemaEvaluacion: FormGroup = this._formBuilder.group({
    esquemaEvaluacion: undefined,
    modalidades: undefined,
    docentes: undefined,
    validoDesde: undefined,
    esEsquemaPredeterminado: undefined,
  });

  uploadSaveUrl = 'saveUrl'; // should represent an actual API endpoint
  uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  showDocentes: boolean = false;
  detalleEsquemaAsignado: DetalleEsquemaAsignado[] = [];
  listadoDetalleAsignacion: Array<
    Array<EsquemaEvaluacionPgeneralDetalleCompuesto>
  > = [];
  private _subscriptions$: Subscription = new Subscription();
  private _esquemaAsociadoTemp: EsquemaAsociado;
  flagCMPadre: boolean = false;
  flagCM_ModuloWR: boolean = false;
  ngOnInit(): void {
    this.configurarGridCriteriosEvaluacionMW();
    this.configurarGridCriteriosEvaluacionP();
    this.validarGridCriteriosEvaluacion();
    this.initCombos();
    this.initSubscribeObservables();
    if (!this.pgeneralService.isNewPgeneral) {
      this.asignarValoresForm();
    }
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  initCombos() {
    this.comboTipoPrograma = this.pgeneralService.combosModulo.tipoPrograma;
    this.comboEsquemaEvaluacion = this.pgeneralService.comboEsquemaEvaluacion;
    this.comboModalidades = this.pgeneralService.comboModalidades;
    this.comboDocentes = this.pgeneralService.comboProveedor;
  }
  validarGridCriteriosEvaluacion() {
    if (this.pgeneralService.isNewPgeneral) {
    } else {
      let sub$ = this.pgeneralService.pgeneralModalidad$.subscribe((resp) => {
        let tipoPrograma = this.pgeneralService.dataItemPgeneral.idTipoPrograma;
        if (
          tipoPrograma == TipoPrograma.MODULO ||
          tipoPrograma == TipoPrograma.WEBINAR_RECURRENTE
        ) {
          this.flagCM_ModuloWR = true;
          // Aonline
          this.criteriosEvaluacionMW[0].flag =
            resp.findIndex(
              (x) => x.idModalidadCurso == ModalidadCurso.ONLINE_ASINCRONICA
            ) != -1;
          // Online
          this.criteriosEvaluacionMW[1].flag =
            resp.findIndex(
              (x) => x.idModalidadCurso == ModalidadCurso.ONLINE_SINCRONICA
            ) != -1;
          // Presencial
          this.criteriosEvaluacionMW[2].flag =
            resp.findIndex(
              (x) => x.idModalidadCurso == ModalidadCurso.PRESENCIAL
            ) != -1;
        } else if (tipoPrograma == TipoPrograma.PADRE) {
          this.flagCMPadre = true;
          // Aonline
          this.criteriosEvaluacionP[0].flag =
            resp.findIndex(
              (x) => x.idModalidadCurso == ModalidadCurso.ONLINE_ASINCRONICA
            ) != -1;
          // Online
          this.criteriosEvaluacionP[1].flag =
            resp.findIndex(
              (x) => x.idModalidadCurso == ModalidadCurso.ONLINE_SINCRONICA
            ) != -1;
          // Presencial
          this.criteriosEvaluacionP[2].flag =
            resp.findIndex(
              (x) => x.idModalidadCurso == ModalidadCurso.PRESENCIAL
            ) != -1;
        }
      });
      this._subscriptions$.add(sub$);
    }
  }
  initSubscribeObservables(): void {
    if (!this.pgeneralService.isNewPgeneral) {
      this.gridCriterioEvaluacion.loading = true;
    }
    let sub1$ = this.pgeneralService.esquemaAsociado$.subscribe((resp) => {
      if (resp != undefined) {
        resp.forEach((x) => {
          if (x.fechaFin != undefined) {
            x.fechaFin = new Date(x.fechaFin);
          }
          if (x.fechaInicio != undefined) {
            x.fechaInicio = new Date(x.fechaInicio);
          }
        });
        this.gridCriterioEvaluacion.data = resp;
        this.gridCriterioEvaluacion.loading = false;
      }
    });
    let sub2$ = this.pgeneralService.pgCriteriosEvaluacionOnline$.subscribe(
      (resp) => {
        this.criteriosEvaluacionMW[1].grid.data = resp;
      }
    );
    let sub3$ = this.pgeneralService.pgCriteriosEvaluacionAonline$.subscribe(
      (resp) => {
        this.criteriosEvaluacionMW[0].grid.data = resp;
      }
    );
    let sub4$ = this.pgeneralService.pgCriteriosEvaluacionPresencial$.subscribe(
      (resp) => {
        this.criteriosEvaluacionMW[2].grid.data = resp;
      }
    );
    let sub5$ = this.pgeneralService.ppadreCEvaluacionOnline$.subscribe(
      (resp) => {
        this.criteriosEvaluacionP[1].grid.data = resp;
      }
    );
    let sub6$ = this.pgeneralService.ppPadreCEvaluacionAonline$.subscribe(
      (resp) => {
        this.criteriosEvaluacionP[0].grid.data = resp;
      }
    );
    let sub7$ = this.pgeneralService.ppadreCEvaluacionPresencial$.subscribe(
      (resp) => {
        this.criteriosEvaluacionP[2].grid.data = resp;
      }
    );
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
    this._subscriptions$.add(sub3$);
    this._subscriptions$.add(sub4$);
    this._subscriptions$.add(sub5$);
    this._subscriptions$.add(sub6$);
    this._subscriptions$.add(sub7$);
  }
  get idsModalidades() {
    return this.formAsociarEsquemaEvaluacion.get('modalidades')
      .value as number[];
  }
  cargarGridCriterioEvaluacion() {}
  asignarValoresForm() {
    let dataItem = this.pgeneralService.dataItemPgeneral;
    this.tipoPrograma.setValue(dataItem.idTipoPrograma);
  }
  private configurarGridCriteriosEvaluacionMW() {
    this.criteriosEvaluacionMW.forEach((x, i) => {
      x.grid.formGroup = this._formBuilder.group({
        idCriterioEvaluacion: [undefined, Validators.required],
        porcentaje: undefined,
      });
      x.grid.cellCloseEvent$.subscribe((resp) => {
        let flagActualizar = false;
        if (resp.columnField == 'idCriterioEvaluacion') {
          if (
            resp.dataItem.idCriterioEvaluacion !=
            resp.formGroup.get('idCriterioEvaluacion').value
          ) {
            resp.dataItem.idCriterioEvaluacion = resp.formGroup.get(
              'idCriterioEvaluacion'
            ).value;
            flagActualizar = true;
          }
        }
        if (resp.columnField == 'porcentaje') {
          if (
            resp.dataItem.porcentaje != resp.formGroup.get('porcentaje').value
          ) {
            resp.dataItem.porcentaje = resp.formGroup.get('porcentaje').value;
            flagActualizar = true;
          }
        }
        let total = 0;
        x.grid.data.forEach((s) => {
          total += s.porcentaje;
        });
        if (total > 100) {
          this._alertaService
            .swalFireOptions({
              icon: 'info',
              title: '¡Revisa tus datos, no puedes pasar del 100!',
            })
            .then(() => {});
        } else if (flagActualizar) {
          this.actualizarInsertarPGCEvaluacion(resp.dataItem, x.grid);
        }
      });
      x.grid.removeEvent$.subscribe((resp) => {
        this._alertaService
          .swalFireOptions({
            title: `¿Está seguro de eliminar el criterio ${resp.dataItem.nombre}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Eliminalo!',
            cancelButtonText: '¡No, Cancelar!',
            allowOutsideClick: false,
          })
          .then((result) => {
            if (result.isConfirmed) {
              x.grid.data.splice(resp.index, 1);
              x.grid.data = [...x.grid.data];
            }
          });
      });
    });
  }
  private configurarGridCriteriosEvaluacionP() {
    this.criteriosEvaluacionP.forEach((x, i) => {
      x.grid.formGroup = this._formBuilder.group({
        considerarNota: [undefined],
        porcentaje: undefined,
      });
      x.grid.cellClickEvent$.subscribe((resp) => {});
      x.grid.cellCloseEvent$.subscribe((resp) => {
        if (resp.columnField == 'considerarNota') {
          resp.dataItem.considerarNota =
            resp.formGroup.get('considerarNota').value ?? false;
        }
        if (resp.columnField == 'porcentaje') {
          resp.dataItem.porcentaje =
            resp.formGroup.get('porcentaje').value ?? 0;
        }
        let total = 0;
        x.grid.data.forEach((s) => {
          total += s.porcentaje;
        });
        if (total > 100) {
          this._alertaService
            .swalFireOptions({
              icon: 'info',
              title: '¡Revisa tus datos, no puedes pasar del 100!',
            })
            .then(() => {});
        } else {
          if (resp.dataItem.esCurso == 0) {
            this.actualizarInsertarPGCEvaluacion(resp.dataItem, x.grid);
          } else {
            this.actualizarInsertarPGCEvaluacionHijo(resp.dataItem, x.grid);
          }
        }
      });
      x.grid.removeEvent$.subscribe((resp) => {
        this._alertaService
          .swalFireOptions({
            title: `¿Está seguro de eliminar el criterio ${resp.dataItem.nombre}?`,
            // text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Eliminalo!',
            cancelButtonText: '¡No, Cancelar!',
            allowOutsideClick: false,
          })
          .then((result) => {
            if (result.isConfirmed) {
              x.grid.data.splice(resp.index, 1);
              x.grid.data = [...x.grid.data];
            }
          });
      });
    });
  }
  abrirModalEsquemaEvaluacion(
    modalAsociarEsquemaEvaluacion: any,
    dataItem?: EsquemaAsociado
  ) {
    this.isNewEsquemaEvaluacion = dataItem == undefined;
    this.gridCriterioEvaluacion.loading = true;
    this.formAsociarEsquemaEvaluacion.reset();
    this.detalleEsquemaAsignado = [];
    if (dataItem != undefined) {
      this._esquemaAsociadoTemp = dataItem;

      this._integraService
        .getJsonResponse(
          `${constApiPlanificacion.EsquemaEvaluacionObtenerDetalleEsquemaAsignado}/${dataItem.id}`
        )
        .subscribe({
          next: (resp: HttpResponse<DetalleEsquemaAsignado[]>) => {
            this.gridCriterioEvaluacion.loading = false;
            this.formAsociarEsquemaEvaluacion
              .get('esquemaEvaluacion')
              .setValue(dataItem.idEsquemaEvaluacion);
            this.formAsociarEsquemaEvaluacion
              .get('modalidades')
              .setValue(dataItem.listadoModalidad);
            this.changeValueModalidad(dataItem.listadoModalidad);
            this.formAsociarEsquemaEvaluacion
              .get('docentes')
              .setValue(dataItem.listadoProveedor);
            this.formAsociarEsquemaEvaluacion
              .get('validoDesde')
              .setValue(dataItem.fechaInicio);
            this.formAsociarEsquemaEvaluacion
              .get('esEsquemaPredeterminado')
              .setValue(dataItem.esquemaPredeterminado);

            resp.body.forEach((x) => {
              if (x.detalle != undefined && x.detalle.length > 0) {
                x.nombreCriterioEvaluacion =
                  x.detalle[0].nombreCriterioEvaluacion;
              }
            });
            this.detalleEsquemaAsignado = resp.body;
            this._modalRefAsociarEsquema = this._modalService.open(
              modalAsociarEsquemaEvaluacion,
              {
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
              }
            );
          },
          error: (error) => {
            this.gridCriterioEvaluacion.loading = false;
            let resp = this._alertaService.getErrorResponse(error);
            this._alertaService.swalFireOptions({
              icon: 'error',
              title:
                '¡Ocurrio un problema al obtener el detalle del esquema asignado!',
              text: `${resp.titulo}: ${resp.mensaje}`,
            });
          },
        });
    } else {
      this.gridCriterioEvaluacion.loading = false;
      this._esquemaAsociadoTemp = undefined;
      this._modalRefAsociarEsquema = this._modalService.open(
        modalAsociarEsquemaEvaluacion,
        {
          size: 'lg',
          backdrop: 'static',
          keyboard: false,
        }
      );
    }
  }
  changeValueModalidad(event: number[]) {
    if (event != undefined && event.length > 0) {
      if (event.includes(1)) {
        this.showDocentes = true;
      } else {
        this.showDocentes = false;
        //TODO
      }
    }
  }
  changeEsquemaEvaluacion(event: number) {
    if (event != undefined && event > 0) {
      this._integraService
        .getJsonResponse(
          `${constApiPlanificacion.EsquemaEvaluacionObtenerDetalleEsquema}/${event}`
        )
        .subscribe({
          next: (resp: HttpResponse<EsquemaEvaluacionDetalleCompuesto[]>) => {
            if (resp.body != undefined && resp.body.length > 0) {
              this.detalleEsquemaAsignado = resp.body.map((x) => {
                let item: DetalleEsquemaAsignado = {
                  idCriterioEvaluacion: x.idCriterioEvaluacion,
                  nombreCriterioEvaluacion: x.nombreCriterioEvaluacion,
                  detalle: [
                    {
                      id: 0,
                      idCriterioEvaluacion: x.idCriterioEvaluacion,
                      nombre: `${x.nombreCriterioEvaluacion} 1`,
                      urlArchivoInstrucciones: undefined,
                      idProveedor: undefined,
                      nombreCriterioEvaluacion: x.nombreCriterioEvaluacion,
                    },
                  ],
                };
                return item;
              });
            } else {
              this.detalleEsquemaAsignado = [];
            }
          },
          error: (error) => {
            let resp = this._alertaService.getErrorResponse(error);
            this._alertaService.swalFireOptions({
              icon: 'error',
              title: '¡Ocurrio un problema al obtener el detalle del esquema!',
              text: `${resp.titulo}: ${resp.mensaje}`,
            });
          },
        });
    } else {
      this.detalleEsquemaAsignado = [];
    }
  }
  private procesarValoresEsquemaEvaluacionAsociado() {
    let datosFormulario: FormAsociarEsquemaEvaluacion =
      this.formAsociarEsquemaEvaluacion.getRawValue();
    let registro: EsquemaEvaluacionRegistrarAsignacion = {
      id: this.isNewEsquemaEvaluacion ? 0 : this._esquemaAsociadoTemp.id,
      idEsquemaEvaluacion: datosFormulario.esquemaEvaluacion,
      idModalidad: datosFormulario.modalidades ?? [],
      idProveedor: datosFormulario.docentes ?? [],
      idPGeneral: this.pgeneralService.idProgramaGeneral,
      fechaInicio:
        datosFormulario.validoDesde != undefined
          ? datePipeTransform(datosFormulario.validoDesde)
          : undefined,
      esquemaPredeterminado: datosFormulario.esEsquemaPredeterminado ?? false ,
      listadoDetalleAsignacion: [],
    };
    if (this.detalleEsquemaAsignado.length > 0) {
      this.listadoDetalleAsignacion = this.detalleEsquemaAsignado.map(
        (x) => [] as EsquemaEvaluacionPgeneralDetalleCompuesto[]
      );
      this.pgeneralService.obtenerDetalleEsquemaAsignado$.next();
      let detalleFinal: EsquemaEvaluacionPgeneralDetalleCompuesto[] = [];
      this.listadoDetalleAsignacion.forEach((x) => {
        detalleFinal = detalleFinal.concat(x);
      });
      registro.listadoDetalleAsignacion = detalleFinal;
    }
    return registro;
  }
  guardarEsquemaEvaluacionAsociado() {
    let registro = this.procesarValoresEsquemaEvaluacionAsociado();
    this.enProcesoSolicitud = true;
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.EsquemaEvaluacionRegistrarAsignacion,
        JSON.stringify(registro)
      )
      .subscribe({
        next: (resp) => {
          this.enProcesoSolicitud = false;
          this.gridCriterioEvaluacion.loading = true;
          this.pgeneralService.obtenerEsquemaAsociado();
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              text: 'Se guardo el registro correctamente',
            })
            .then(() => {
              this._modalRefAsociarEsquema.close();
            });
        },
        error: (error) => {
          this.enProcesoSolicitud = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al registrar la asignación!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  actualizarEsquemaEvaluacionAsociado() {
    let registro = this.procesarValoresEsquemaEvaluacionAsociado();
    this.enProcesoSolicitud = true;
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.EsquemaEvaluacionActualizarAsignacion,
        JSON.stringify(registro)
      )
      .subscribe({
        next: (resp) => {
          this.gridCriterioEvaluacion.loading = true;
          this.pgeneralService.obtenerEsquemaAsociado();
          this.enProcesoSolicitud = false;
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              text: 'Se actualizo el registro correctamente',
            })
            .then(() => {
              this._modalRefAsociarEsquema.close();
            });
        },
        error: (error) => {
          let resp = this._alertaService.getErrorResponse(error);
          this.enProcesoSolicitud = false;
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al actualizar el esquema asignado!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  getEsquemaEvaluacionDetalle(
    event: EsquemaEvaluacionPgeneralDetalleCompuesto[],
    index: number
  ) {
    this.listadoDetalleAsignacion[index] = event;
  }
  idModalidadCriterioTemp: number;

  abrirModalCriterio(
    modalCriterioEvaluacion: any,
    item: GridCriterioEvaluacion
  ) {
    item.grid.loading = true;
    this.idModalidadCriterioTemp = item.idModalidad;
    let tipoPrograma = this.pgeneralService.dataItemPgeneral.idTipoPrograma;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.CriterioEvaluacionObtenerPGCriteriosEvaluacion}/${tipoPrograma}/${item.idModalidad}`
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          if (resp.body != null && resp.body.length > 0) {
            this.comboCriterioEvaluacionModal = resp.body;
            this.fcCriterioEvaluacion.setValue(resp.body[0].id);
            item.grid.loading = false;
            this._modalRefCriterioEvaluacion = this._modalService.open(
              modalCriterioEvaluacion,
              {
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                centered: true,
              }
            );
          } else {
            this._alertaService.swalFireOptions({
              icon: 'info',
              text: 'No se encontraron criterios disponibles',
            });
          }
        },
        error: (error) => {
          item.grid.loading = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener los criterios!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  abrirModalCriterioHijo(
    modalCriterioEvaluacion: any,
    item: GridCriterioEvaluacionHijo
  ) {
    item.grid.loading = true;
    let tipoPrograma = this.pgeneralService.dataItemPgeneral.idTipoPrograma;
    this.idModalidadCriterioTemp = item.idModalidad;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.CriterioEvaluacionObtenerPGCriteriosEvaluacion}/${tipoPrograma}/${item.idModalidad}`
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          if (resp.body != null && resp.body.length > 0) {
            this.comboCriterioEvaluacionModal = resp.body;
            this.fcCriterioEvaluacion.setValue(resp.body[0].id);
            item.grid.loading = false;
            this._modalRefCriterioEvaluacion = this._modalService.open(
              modalCriterioEvaluacion,
              {
                size: 'md',
                backdrop: 'static',
                keyboard: false,
                centered: true,
              }
            );
          } else {
            this._alertaService.swalFireOptions({
              icon: 'info',
              title: '¡No se encontraron criterios disponibles!',
            });
          }
        },
        error: (error) => {
          item.grid.loading = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener los criterios!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  insertarCriterio() {
    let nuevoItem: PGeneralCriterioEvaluacion = {
      id: 0,
      idPgeneral: this.pgeneralService.idProgramaGeneral,
      idModalidadCurso: this.idModalidadCriterioTemp,
      nombre: '',
      porcentaje: 0,
      idCriterioEvaluacion: this.fcCriterioEvaluacion.value,
      idTipoPromedio: this.tipoPromedio.value,
    };
    let tipoPrograma = this.pgeneralService.dataItemPgeneral.idTipoPrograma;
    let grid: KendoGrid;
    if (tipoPrograma == TipoPrograma.PADRE) {
      let item = this.criteriosEvaluacionP.find(
        (x) => x.idModalidad == this.idModalidadCriterioTemp
      );
      grid = item.grid;
    } else {
      let item = this.criteriosEvaluacionMW.find(
        (x) => x.idModalidad == this.idModalidadCriterioTemp
      );
      grid = item.grid;
    }
    grid.loading = true;
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.ProgramaGeneralActualizarInsertarPGCEvaluacion,
        JSON.stringify(nuevoItem)
      )
      .subscribe({
        next: (resp: HttpResponse<PGeneralCriterioEvaluacion>) => {
          if (tipoPrograma == TipoPrograma.PADRE) {
            let item = this.criteriosEvaluacionP.find(
              (x) => x.idModalidad == this.idModalidadCriterioTemp
            );
            item.grid.loading = false;
            let obj: PGeneralCursoCriterioHijo = {
              id: resp.body.id,
              idProgramaGeneralHijo: 0,
              nombre: '',
              considerarNota: false,
              idPGeneral_Padre: 0,
              porcentaje: 0,
              idModalidadCurso: 0,
              idCriterioEvaluacion: resp.body.idCriterioEvaluacion,
              esCurso: 0,
            };
            item.grid.data = [obj, ...item.grid.data];
          } else {
            let item = this.criteriosEvaluacionMW.find(
              (x) => x.idModalidad == this.idModalidadCriterioTemp
            );
            item.grid.loading = false;
            let obj: PGeneralCriterioEvaluacion = {
              id: resp.body.id,
              idPgeneral: 0,
              idModalidadCurso: 0,
              nombre: '',
              porcentaje: 0,
              idCriterioEvaluacion: resp.body.idCriterioEvaluacion,
              idTipoPromedio: 0,
            };
            item.grid.data = [obj, ...item.grid.data];
          }
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              text: 'Se guardo el registro correctamente',
            })
            .then(() => {
              this._modalRefCriterioEvaluacion.close();
            });
        },
        error: (error) => {
          grid.loading = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al guardar el criterio!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  getCriterioEvaluacion(idCriterioEvaluacion: number) {
    let item = this.pgeneralService.comboCriterioEvaluacion.find(
      (x) => x.id == idCriterioEvaluacion
    );
    if (item) {
      return item.nombre;
    } else {
      return '';
    }
  }
  getNombreCurso(dataItem: PGeneralCursoCriterioHijo) {
    if (dataItem.esCurso == 1) {
      return dataItem.nombre;
    } else {
      return this.getCriterioEvaluacion(dataItem.idCriterioEvaluacion);
    }
  }
  private actualizarInsertarPGCEvaluacionHijo(
    dataItem: PGeneralCursoCriterioHijo,
    grid: KendoGrid
  ) {
    let item: PgeneralCriterioEvaluacionHijo = {
      id: dataItem.id ?? 0,
      idPgeneral: dataItem.idPGeneral_Padre,
      considerarNota: dataItem.considerarNota,
      porcentaje: dataItem.porcentaje,
      idModalidadCurso: dataItem.idModalidadCurso,
      idTipoPromedio: this.tipoPromedio.value,
    };
    grid.loading = true;
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.ProgramaGeneralActualizarInsertarPGCEvaluacionHijo,
        JSON.stringify(item)
      )
      .subscribe({
        next: (resp) => {
          grid.loading = false;
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              text: 'Se guardaron los cambios correctamente',
            })
            .then(() => {});
        },
        error: (error) => {
          grid.loading = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al actualizar el registro!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  private actualizarInsertarPGCEvaluacion(
    dataItem: PGeneralCriterioEvaluacion | PGeneralCursoCriterioHijo,
    grid: KendoGrid
  ) {
    let item: PGeneralCriterioEvaluacion = {
      id: dataItem.id,
      idPgeneral: this.pgeneralService.idProgramaGeneral,
      idModalidadCurso: dataItem.idModalidadCurso,
      porcentaje: dataItem.porcentaje,
      idCriterioEvaluacion: dataItem.idCriterioEvaluacion,
      idTipoPromedio: this.tipoPromedio.value,
    };
    grid.loading = true;
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.ProgramaGeneralActualizarInsertarPGCEvaluacion,
        JSON.stringify(item)
      )
      .subscribe({
        next: (resp: HttpResponse<PGeneralCriterioEvaluacion>) => {
          grid.loading = false;
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              text: 'Se guardaron los cambios correctamente',
            })
            .then(() => {});
        },
        error: (error) => {
          grid.loading = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al actualizar el registro!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  reloadGridCriterioEvaluacion() {}
}

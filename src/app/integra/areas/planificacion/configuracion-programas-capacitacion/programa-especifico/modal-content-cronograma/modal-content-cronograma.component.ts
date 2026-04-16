import { HttpResponse } from '@angular/common/http';
import { GridDataResult, PageChangeEvent, SelectableSettings } from '@progress/kendo-angular-grid';
import { Component, Input, OnInit, ViewChild, TemplateRef, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

import { constApiPlanificacion, constApiGestionPersonal } from '@environments/constApi';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import {
  PEspecificoPadreIndividual,
  InformacionPespecificoHijo,
  CombosModulo,
  CronogramaGrupo,
  GenerarPDFEnvio,
  InformacionCronogramaSesiones,
  PespecificoSesionCompuesto,
  PEspecificoPadreFrecuenciaSesion,
  PEspecificoPadreFrecuencia,
  Ambiente,
  ConfigurarWebinar,
  ProgramaEspecificoFUR,
  DatosConfiguracionProgramasWebex,
  CruceSesionPEspecifico,
  InformacionPespecificoSesion,
  FiltroSesionEspecial,
  ReprogramarSesion,
} from '@planificacion/models/interfaces/pespecifico';
import { PespecificoService } from '@planificacion/services/pespecifico.service';
import { GridComponent, RowClassArgs } from '@progress/kendo-angular-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { ModalContentFrecuenciaComponent } from '../modal-content-frecuencia/modal-content-frecuencia.component';
import { ModalContentRegistroFurComponent } from '../modal-content-registro-fur/modal-content-registro-fur.component';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { forkJoin } from 'rxjs';
import { cloneData } from '@shared/functions/clone-data';
import { EstadoCurso } from '@integra/models/estado-curso';
import { ObservacionPorEstado, ObservacionDetalle } from '@integra/models/observacion-por-estado';
const idTemplate = '#modalCronograma';
interface FormCronograma {
  fechaHoraInicio: Date;
  idProveedor: number;
  idAmbiente: number;
  grupoSesion: number;
  idModalidadCurso: number;
  mostrarPortalWeb: boolean;
  idEstadoCurso: number;
  idObservacion: number;
}
interface FormInsertarSesion {
  tipo: string;
  idPespecifico: number;
  fecha: Date;
  duracion: number;
  grupo?:number;
}

interface IProveedorConPEspecificos extends IComboBase1 {
  idPEspecificos: number[];
}

@Component({
  selector: 'app-modal-content-cronograma',
  templateUrl: './modal-content-cronograma.component.html',
  styleUrls: ['./modal-content-cronograma.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalContentCronogramaComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _alertaService: AlertaService,
    public activeModal: NgbActiveModal
  ) { }

  @Input() pEspecificoService: PespecificoService;
  dataItemPespecificoTemp: PEspecificoPadreIndividual;
  @Input() pEspecificoHijos: InformacionPespecificoHijo[];
  @Input() cronogramaGrupo: CronogramaGrupo[];
  @Input() configuracionWebinar: ConfigurarWebinar[];
  @Input() programaEspecificoFUR: ProgramaEspecificoFUR[];
  @Input() esCronogramaGrupo: boolean = false;
  @Input() idsPespecificoSeleccionado: number[] = [];

  configurarWebinarOriginal: ConfigurarWebinar[] = [];
  aplicarConfigurarWebinar: boolean = false;
  sourceOperadorWebinar = [
    { nombre: 'Igual', id: 2 },
    { nombre: 'Menor Igual', id: 3 },
    { nombre: 'Mayor Igual', id: 4 },
    { nombre: 'Entre', id: 10 },
  ];
  sourceGrupos: IComboBase1[] = [];
  sourceCiclo: IComboBase1[] = [];
  sourcePeriodoLectivo: IComboBase1[] = [];
  sourceCronograma: CronogramaGrupo[];
  cronogramaSesionesSeleccionados: CronogramaGrupo[];
  combosModulo: CombosModulo;
  gridCronograma: KendoGrid = new KendoGrid();
  gridConfiguracionWebinar: KendoGrid = new KendoGrid();
  gridDefinirFrecuencia: KendoGrid = new KendoGrid();
  formDefinirFrecuencia: FormGroup = this._formBuilder.group({
    idFrecuencia: [null, Validators.required],
    tiempo: [null, Validators.required],
    nota: null,
  });
  formInsertarSesion: FormGroup = this._formBuilder.group({
    tipo: [null, Validators.required],
    idPespecifico: [null],
    fecha: [null, Validators.required],
    duracion: [null, Validators.required],
    grupo: [null],
  });
  formControlGrupo = new FormControl();
  formControlCiclo = new FormControl();
  formControlPeriodoLectivo = new FormControl();
  showCrucesCronograma: boolean = false;
  enProcesoClonarSesion: boolean = false;
  filtroAmbienteWebinar: Ambiente[] = [];
  showBtnEliminarGrupo: boolean = false;
  btnWebinarModificarCronograma = false;
  gridFurCronograma: KendoGrid = new KendoGrid();
  errorsDefinirFrecuencia: string[] = [];
  isNewFrecuencia: boolean = false;
  modalRefFrecuenca: NgbModalRef;
  pEspecificoPadreFrecuenciaTemp: PEspecificoPadreFrecuencia = null;
  showAlertDefinirFrecuencia: boolean = false;
  enProcesoDefinirFrecuencia: boolean = false;
  enProcesoInsertarSesion: boolean = false;
  esProgramaInstitutoTemp: boolean = false;
  modalRefInsertarSesion: NgbModalRef;
  @ViewChild('modalInsertarSesion') modalInsertarSesionRef: TemplateRef<any>;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  sourcePespecificos: IComboBase1[] = [];
  sourceProveedoresCurso: IProveedorConPEspecificos[] = [];
  listaEstadoCurso: EstadoCurso[] = [];
  listaObservacionPorEstado: ObservacionPorEstado[] = [];
  observacionesFiltradas: ObservacionDetalle[] = [];
  
  get showOpcionPespecifico() {
    if (this.formInsertarSesion.get('tipo').value == 'Programa Especifico') {
      return true;
    } else {
      return false;
    }
  }
  gridCruceCronograma: KendoGrid = new KendoGrid();
  showOpcionesInsertarSesion: boolean = false;
  sesionPorReprogramar: CronogramaGrupo = null;

  mySelection: number[] = [];

  ngOnInit(): void {
    this.dataItemPespecificoTemp =
      this.pEspecificoService.dataItemPespecificoTemp;

    this.aplicarConfigurarWebinar =
      this.pEspecificoService.aplicarConfigurarWebinar;
    if (
      this.configuracionWebinar != null &&
      this.configuracionWebinar.length > 0
    ) {
      this.configurarWebinarOriginal = cloneData(this.configuracionWebinar);
    }
    this.initSubscribeObservables();
    this.configurarGridCronograma();
    this.configurarGridConfiguracionWebinar();
    this.configurarGridDefinirFrecuencia();
    if (this.esCronogramaGrupo == true) {
      this.configuracionInicialGrupo();
    } else {
      this.configuracionInicial();
    }
    if (this.pEspecificoService.esCursoIndividual != true) {
      this.sourcePespecificos = this.pEspecificoService.pespecificosHijos
    }
    if (this.dataItemPespecificoTemp.idTipoProgramaCarrera == 2) {
      this.esProgramaInstitutoTemp = true;
    }
  }
  initSubscribeObservables() {
    this.pEspecificoService.combosModulo$.subscribe((resp) => {
      this.combosModulo = resp;
    });
    console.log("Combo Modulo", this.combosModulo);
    this.sourceCiclo = this.combosModulo.ciclo;
    this.sourcePeriodoLectivo = this.combosModulo.periodoLectivo;

    this.pEspecificoService.reloadPespecificoFur$.subscribe((resp) => {
      if (resp == true) {
        this.obtenerFurProgramaEspecifico();
      }
    });

    this.obtenerEstadosCurso();
    this.obtenerObservacionesPorEstado();
  }

  obtenerEstadosCurso() {
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerEstadoCurso)
      .subscribe({
        next: (resp: HttpResponse<EstadoCurso[]>) => {
          this.listaEstadoCurso = resp.body;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerObservacionesPorEstado() {
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerObservacionPorEstado)
      .subscribe({
        next: (resp: HttpResponse<ObservacionPorEstado[]>) => {
          this.listaObservacionPorEstado = resp.body;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  filtrarObservacionesPorEstado(idEstadoCurso: number): ObservacionDetalle[] {
    if (idEstadoCurso == null) {
      return [];
    }
    const observacionEstado = this.listaObservacionPorEstado.find(
      (obs) => obs.idPEspecificoSesionEstado === idEstadoCurso
    );
    if (observacionEstado && observacionEstado.observaciones) {
      return observacionEstado.observaciones;
    }
    return [];
  }

  obtenerNombreEstadoCurso(idEstadoCurso: number): string {
    const estado = this.listaEstadoCurso.find((e) => e.id === idEstadoCurso);
    return estado ? estado.nombre : '';
  }

  esCanceladaEstadoCurso(idEstadoCurso: number): boolean {
    const estado = this.listaEstadoCurso.find((e) => e.id === idEstadoCurso);
    return estado?.nombre?.toLowerCase().includes('cancel') ?? false;
  }
  esPorReprogramarEstadoCurso(idEstadoCurso: number): boolean {
    const estado = this.listaEstadoCurso.find((e) => e.id === idEstadoCurso);
    return estado?.nombre?.toLowerCase().includes('reprogramar') ?? false;
  }
  esEjecutadaEstadoCurso(idEstadoCurso: number): boolean {
    const estado = this.listaEstadoCurso.find((e) => e.id === idEstadoCurso);
    return estado?.nombre?.toLowerCase().includes('ejecuta') ?? false;
  }

  obtenerNombreObservacion(idObservacion: number): string {
    for (const obs of this.listaObservacionPorEstado) {
      if (obs.observaciones) {
        const detalle = obs.observaciones.find((d) => d.id === idObservacion);
        if (detalle) {
          return detalle.nombre;
        }
      }
    }
    return '';
  }

  onEstadoCursoChange(nuevoEstado: number, dataItem: CronogramaGrupo, formGroup: any) {
    // Filtrar observaciones según el nuevo estado
    this.observacionesFiltradas = this.filtrarObservacionesPorEstado(nuevoEstado);
    formGroup.get('idObservacion').setValue(null);

    // Si el estado no cambió, no hacer nada
    if (dataItem.idEstadoCurso === nuevoEstado) {
      return;
    }

    // Guardar estado anterior para revertir si falla
    const estadoAnterior = dataItem.idEstadoCurso;

    // Pre-actualizar dataItem para que cellClose no dispare guardarCambiosCronograma en paralelo
    dataItem.idEstadoCurso = nuevoEstado;
    dataItem.idPEspecificoSesionEstado = nuevoEstado;

    this.gridCronograma.loading = true;
    const dto = {
      Id: dataItem.id,
      IdPEspecificoSesionEstado: nuevoEstado
    };
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.PEspecificoSesionActualizarEstadoCurso,
        JSON.stringify(dto)
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          this.gridCronograma.loading = false;
          this._alertaService.toastOptions(
            'Actualizado correctamente',
            'success',
            'top-right',
            idTemplate
          );
          dataItem.idObservacion = null;
          dataItem.idPEspecificoSesionEstadoObservacionDetalle = null;
          // Si el estado es "Por-Reprogramar", abrir modal Nueva Sesion con datos precargados
          if (this.esPorReprogramarEstadoCurso(nuevoEstado)) {
            this.abrirModalInsertarSesion(this.modalInsertarSesionRef, dataItem);
          }
        },
        error: (error) => {
          this.gridCronograma.loading = false;
          // Revertir dataItem y formulario si falla
          dataItem.idEstadoCurso = estadoAnterior;
          dataItem.idPEspecificoSesionEstado = estadoAnterior;
          formGroup.get('idEstadoCurso').setValue(estadoAnterior);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  onObservacionChange(nuevaObservacion: number, dataItem: CronogramaGrupo, formGroup: any) {
    // Si la observación no cambió, no hacer nada
    if (dataItem.idObservacion === nuevaObservacion) {
      return;
    }

    // Llamar al endpoint para actualizar
    this.gridCronograma.loading = true;
    const dto = {
      Id: dataItem.id,
      IdPEspecificoSesionEstadoObservacionDetalle: nuevaObservacion
    };
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.PEspecificoSesionActualizarEstadoObservacion,
        JSON.stringify(dto)
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          this.gridCronograma.loading = false;
          this._alertaService.toastOptions(
            'Actualizado correctamente',
            'success',
            'top-right',
            idTemplate
          );
          // Actualizar el dataItem después de éxito
          dataItem.idObservacion = nuevaObservacion;
          dataItem.idPEspecificoSesionEstadoObservacionDetalle = nuevaObservacion;
        },
        error: (error) => {
          this.gridCronograma.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
          // Revertir el valor en el formulario si falla
          formGroup.get('idObservacion').setValue(dataItem.idObservacion);
        },
      });
  }

  actualizarEstadoCurso(idSesion: number, idEstadoCurso: number, dataItem: CronogramaGrupo, formValue: FormCronograma) {
    const dto = {
      Id: idSesion,
      IdPEspecificoSesionEstado: idEstadoCurso
    };
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.PEspecificoSesionActualizarEstadoCurso,
        JSON.stringify(dto)
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          this.gridCronograma.loading = false;
          this._alertaService.toastOptions(
            'Actualizado correctamente',
            'success',
            'top-right',
            idTemplate
          );
          dataItem.idEstadoCurso = formValue.idEstadoCurso;
          dataItem.idPEspecificoSesionEstado = formValue.idEstadoCurso;
          // Si cambia el estado, resetear la observación en el dataItem
          if (formValue.idObservacion == null) {
            dataItem.idObservacion = null;
            dataItem.idPEspecificoSesionEstadoObservacionDetalle = null;
          }
        },
        error: (error) => {
          this.gridCronograma.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  actualizarEstadoObservacion(idSesion: number, idObservacion: number, dataItem: CronogramaGrupo, formValue: FormCronograma) {
    const dto = {
      Id: idSesion,
      IdPEspecificoSesionEstadoObservacionDetalle: idObservacion
    };
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.PEspecificoSesionActualizarEstadoObservacion,
        JSON.stringify(dto)
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          this.gridCronograma.loading = false;
          this._alertaService.toastOptions(
            'Actualizado correctamente',
            'success',
            'top-right',
            idTemplate
          );
          dataItem.idObservacion = formValue.idObservacion;
          dataItem.idPEspecificoSesionEstadoObservacionDetalle = formValue.idObservacion;
        },
        error: (error) => {
          this.gridCronograma.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  private configuracionInicial() {
    if (this.pEspecificoService.esIndividual) {
      this.pEspecificoService.verificarEsPespecificoIndividual(
        this.dataItemPespecificoTemp.id
      );
    }
    if (this.pEspecificoService.tieneFrecuencia == true) {
      if (
        this.dataItemPespecificoTemp.tipoProgramaGeneral ==
        'Webinar Recurrente' ||
        this.dataItemPespecificoTemp.tipoProgramaGeneral == 'Padre' ||
        this.dataItemPespecificoTemp.tipoProgramaGeneral == 'Modulo'
      ) {
        this.btnWebinarModificarCronograma = true;
      } else {
        this.btnWebinarModificarCronograma = false;
      }
    }
    this.obtenerNumeroGrupos();
    this.cargarProveedoresPorPEspecifico();
    this.cargarCronogramaPespecifico(this.cronogramaGrupo, false);
    this.cargarConfiguracionWebinar(this.configuracionWebinar);
    this.gridFurCronograma.data = this.programaEspecificoFUR;
  }
  private configuracionInicialGrupo() {
    if (this.pEspecificoService.esIndividual) {
      this.pEspecificoService.verificarEsPespecificoIndividual(
        this.dataItemPespecificoTemp.id
      );
    }
    this.btnWebinarModificarCronograma = false;
    this.obtenerNumeroGrupos();
    this.cargarProveedoresPorPEspecifico();
    this.cargarCronogramaPespecifico(this.cronogramaGrupo, false);
    this.cargarConfiguracionWebinar(this.configuracionWebinar);
    this.gridFurCronograma.data = this.programaEspecificoFUR;
  }
  /**
   * Carga los proveedores asociados al PEspecifico actual.
   * Por defecto muestra solo el proveedor asignado al programa.
   */
  private cargarProveedoresPorPEspecifico(filtroNombre?: string) {
    this.pEspecificoService
      .obtenerProveedoresPorPEspecifico$(this.dataItemPespecificoTemp.id, filtroNombre)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          if (resp.body && resp.body.length > 0) {
            // Agrupar proveedores por idProveedor y mantener todos sus IdPEspecifico
            const proveedoresAgrupados = new Map<number, IProveedorConPEspecificos>();
            resp.body.forEach((p: any) => {
              if (proveedoresAgrupados.has(p.idProveedor)) {
                // Si ya existe, agregar el idPEspecifico al array
                const proveedor = proveedoresAgrupados.get(p.idProveedor);
                if (p.idPEspecifico && !proveedor.idPEspecificos.includes(p.idPEspecifico)) {
                  proveedor.idPEspecificos.push(p.idPEspecifico);
                }
              } else {
                // Si no existe, crear nuevo registro con array de idPEspecificos
                proveedoresAgrupados.set(p.idProveedor, {
                  id: p.idProveedor,
                  nombre: p.nombre,
                  idPEspecificos: p.idPEspecifico ? [p.idPEspecifico] : []
                });
              }
            });
            this.sourceProveedoresCurso = Array.from(proveedoresAgrupados.values());
          } else {
            // Si no hay proveedores asociados, usar los proveedores generales como fallback
            this.sourceProveedoresCurso = (this.combosModulo.proveedorCurso || []).map(p => ({
              ...p,
              idPEspecificos: []
            }));
          }
        },
        error: (error) => {
          console.error('Error al cargar proveedores por PEspecifico:', error);
          // En caso de error, usar los proveedores generales como fallback
          this.sourceProveedoresCurso = (this.combosModulo.proveedorCurso || []).map(p => ({
            ...p,
            idPEspecificos: []
          }));
        },
      });
  }

  /**
   * Maneja el evento de filtro del dropdown de proveedores.
   * Cuando el usuario escribe, busca proveedores que coincidan con el texto.
   */
  onProveedorFilterChange(filtro: string) {
    if (filtro && filtro.length >= 2) {
      this.cargarProveedoresPorPEspecifico(filtro);
    } else if (!filtro || filtro.length === 0) {
      // Si se borra el filtro, recargar solo los proveedores asignados
      this.cargarProveedoresPorPEspecifico();
    }
  }

  private configurarGridCronograma() {
    this.gridCronograma.rowCallback = (context: RowClassArgs) => {
      let dataItem = context.dataItem as CronogramaGrupo;
      const esReprogramada = dataItem.reprogramacion === true;
      let colorClass: any = {};
      if (dataItem.color == 'color0') {
        colorClass = { color0: true };
      } else if (dataItem.color == 'color1') {
        colorClass = { color1: true };
      } else if (dataItem.color == 'color2') {
        colorClass = { color2: true };
      } else if (dataItem.color == 'color3') {
        colorClass = { color3: true };
      } else if (dataItem.color == 'color4') {
        colorClass = { color4: true };
      } else if (dataItem.color == 'color5') {
        colorClass = { color5: true };
      } else if (dataItem.color == 'color6') {
        colorClass = { color6: true };
      } else if (dataItem.color == 'color7') {
        colorClass = { color7: true };
      } else if (dataItem.color == 'color8') {
        colorClass = { color8: true };
      } else {
        colorClass = { color9: true };
      }
      return { ...colorClass, 'fila-reprogramada': esReprogramada };
    };
    this.gridCronograma.formGroup = this._formBuilder.group({
      fechaHoraInicio: null,
      idProveedor: null,
      idAmbiente: null,
      grupoSesion: null,
      idModalidadCurso: null,
      mostrarPortalWeb: null,
      idEstadoCurso: null,
      idObservacion: null,
    });
    this.gridCronograma.cellClickEvent$.subscribe({
      next: (resp) => {
        let dataItem = resp.dataItem as CronogramaGrupo;
        switch (resp.column.field) {
          case 'idProveedor':
            if (dataItem.duracion == 0) {
              this.gridCronograma.formGroup.get('idProveedor').disable();
            } else {
              this.gridCronograma.formGroup.get('idProveedor').enable();
            }
            break;
          case 'idAmbiente':
            if (dataItem.duracion == 0) {
              this.gridCronograma.formGroup.get('idAmbiente').disable();
            } else {
              this.gridCronograma.formGroup.get('idAmbiente').enable();
              let ciudades = this.combosModulo.locacionTroncal.filter(
                (x) => x.codigoBS == dataItem.idCiudad
              );
              if (ciudades.length == 0) {
                ciudades = this.combosModulo.locacionTroncal.filter(
                  (x) => x.idCiudad == dataItem.idCiudad
                );
              }
              if (ciudades.length > 0) {
                this.filtroAmbienteWebinar = this.combosModulo.ambiente.filter(
                  (x) => x.idCiudad == ciudades[0].idCiudad
                );
              }
            }
            break;
          case 'idObservacion':
            const idEstado = dataItem.idEstadoCurso;
            this.observacionesFiltradas = this.filtrarObservacionesPorEstado(idEstado);
            break;
          default:
            break;
        }
      },
    });
    this.gridCronograma.cellCloseEvent$.subscribe((resp) => {
      if (
        resp.dataItem[resp.columnField] !=
        resp.formGroup.get(resp.columnField).value
      ) {
        this.gridCronograma.loading = true;
        this.guardarCambiosCronograma(resp.dataItem, resp.formGroupValue);
      }
    });
  }
  indexTemp: number = null;
  private configurarGridConfiguracionWebinar() {
    this.gridConfiguracionWebinar.formGroup = this._formBuilder.group({
      idPespecifico: null,
      idOperadorComparacionAvance: null,
      valorAvance: null,
      valorAvanceOpc: null,
      idOperadorComparacionPromedio: null,
      valorPromedio: null,
      valorPromedioOpc: null,
    });
    this.gridConfiguracionWebinar.editEvent$.subscribe((resp) => {
      this.indexTemp = resp.rowIndex;
    });
    this.gridConfiguracionWebinar.addEvent$.subscribe((resp) => {
      this.indexTemp = resp.rowIndex;
    });
    this.gridConfiguracionWebinar.saveEvent$.subscribe({
      next: (resp) => {
        this.insertarConfiguracionWebinar(resp.dataForm);
      },
    });
    this.gridConfiguracionWebinar.removeEvent$.subscribe({
      next: (resp) => {
        this._alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.disableGuardarCambios = false;
            this.gridConfiguracionWebinar.data.splice(resp.index, 1);
            this.gridConfiguracionWebinar.data = [
              ...this.gridConfiguracionWebinar.data,
            ];
          }
        });
      },
    });
    this.gridConfiguracionWebinar.updateEvent$.subscribe({
      next: (resp) => {
        this.disableGuardarCambios = false;
        Object.assign(resp.dataItem, resp.dataForm);
      },
    });
  }
  disableGuardarCambios: boolean = true;
  configurarGridDefinirFrecuencia() {
    this.gridDefinirFrecuencia.formGroup = this._formBuilder.group({
      idDiaSemana: [null, Validators.required],
      horaInicio: [null, Validators.required],
      horaFin: [null, Validators.required],
      duracion: [null, Validators.required],
    });
    this.gridDefinirFrecuencia.cellClickEvent$.subscribe((resp) => {
      console.log(resp);
    });
    this.gridDefinirFrecuencia.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
  }
  getNombreDia(idDia: number) {
    let item = this.combosModulo.dias.find((x) => x.id == idDia);
    if (item != null) {
      return item.nombre;
    } else {
      return '';
    }
  }
  obtenerConfiguracionWebinarPEspecifico(idPespecifico: number) {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.PEspecificoObtenerConfiguracionWebinarPEspecifico}/${idPespecifico}`
      )
      .subscribe({
        next: (resp: HttpResponse<DatosConfiguracionProgramasWebex>) => {
          const modalRef = this._modalService.open(
            ModalContentFrecuenciaComponent,
            {
              size: 'lg',
              backdrop: 'static',
              keyboard: false,
            }
          );
          modalRef.componentInstance.pEspecificoService =
            this.pEspecificoService;
          if (resp.body != null) {
            modalRef.componentInstance.configuracionProgramasWebex = resp.body;
            modalRef.componentInstance.isNew = true;
          } else {
            modalRef.componentInstance.isNew = true;
          }
          modalRef.componentInstance.esFrecuenciaWebinar = true;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationError(mensaje);
        },
      });
  }
  eliminarCronogramaDuplicado() {
    this.gridCronograma.loading = true;
    this._integraService
      .deleteJsonResponse(
        `${constApiPlanificacion.PEspecificoEliminarCronogramaDuplicado}/${this.dataItemPespecificoTemp.id}/${this.formControlGrupo.value}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.gridCronograma.loading = false;
          this.obtenerNumeroGrupos();
          this.recargarCronogramaPespecifico(null, 1);
        },
        error: (error) => {
          this.gridCronograma.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  get dataSesionPespecifico() {
    return this.pEspecificoHijos.map((x: InformacionPespecificoHijo) => {
      let item: IComboBase1 = {
        id: x.id,
        nombre: x.nombre,
      };
      return item;
    });
  }
  guardarCambiosCronograma(
    dataItem: CronogramaGrupo,
    formValue: FormCronograma
  ) {
    // Detectar si solo cambió el estado del curso
    const soloEstadoCurso = dataItem.idEstadoCurso != formValue.idEstadoCurso &&
      dataItem.idProveedor == formValue.idProveedor &&
      dataItem.idAmbiente == formValue.idAmbiente &&
      dataItem.grupoSesion == formValue.grupoSesion &&
      dataItem.fechaHoraInicio == formValue.fechaHoraInicio &&
      dataItem.idModalidadCurso == formValue.idModalidadCurso &&
      dataItem.mostrarPortalWeb == formValue.mostrarPortalWeb &&
      dataItem.idObservacion == formValue.idObservacion;

    // Detectar si solo cambió la observación
    const soloObservacion = dataItem.idObservacion != formValue.idObservacion &&
      dataItem.idProveedor == formValue.idProveedor &&
      dataItem.idAmbiente == formValue.idAmbiente &&
      dataItem.grupoSesion == formValue.grupoSesion &&
      dataItem.fechaHoraInicio == formValue.fechaHoraInicio &&
      dataItem.idModalidadCurso == formValue.idModalidadCurso &&
      dataItem.mostrarPortalWeb == formValue.mostrarPortalWeb &&
      dataItem.idEstadoCurso == formValue.idEstadoCurso;

    // Si solo cambió el estado del curso, usar endpoint específico
    if (soloEstadoCurso) {
      this.actualizarEstadoCurso(dataItem.id, formValue.idEstadoCurso, dataItem, formValue);
      return;
    }

    // Si solo cambió la observación, usar endpoint específico
    if (soloObservacion) {
      this.actualizarEstadoObservacion(dataItem.id, formValue.idObservacion, dataItem, formValue);
      return;
    }

    let jsonEnvio: InformacionCronogramaSesiones = {
      id: dataItem.id,
      fechaHoraInicio: datePipeTransform(dataItem.fechaHoraInicio),
      aplicarCambios: false,
      idExpositor: dataItem.idExpositor,
      idModalidadCurso: dataItem.idModalidadCurso,
      idAmbiente: dataItem.idAmbiente,
      idProveedor: dataItem.idProveedor,
      grupoSesion: dataItem.grupoSesion,
      mostrarPortalWeb: dataItem.mostrarPortalWeb,
      idEstadoCurso: dataItem.idEstadoCurso,
      idObservacion: dataItem.idObservacion,
    };
    if (dataItem.idProveedor != formValue.idProveedor) {
      jsonEnvio.idProveedor = formValue.idProveedor;
    }
    if (dataItem.idAmbiente != formValue.idAmbiente) {
      jsonEnvio.idAmbiente = formValue.idAmbiente;
    }
    if (dataItem.grupoSesion != formValue.grupoSesion) {
      jsonEnvio.grupoSesion = formValue.grupoSesion;
    }
    if (dataItem.fechaHoraInicio != formValue.fechaHoraInicio) {
      jsonEnvio.fechaHoraInicio = datePipeTransform(formValue.fechaHoraInicio);
    }
    if (dataItem.idModalidadCurso != formValue.idModalidadCurso) {
      jsonEnvio.idModalidadCurso = formValue.idModalidadCurso;
    }
    if (dataItem.mostrarPortalWeb != formValue.mostrarPortalWeb) {
      jsonEnvio.mostrarPortalWeb = formValue.mostrarPortalWeb;
    }
    if (dataItem.idEstadoCurso != formValue.idEstadoCurso) {
      jsonEnvio.idEstadoCurso = formValue.idEstadoCurso;
      // Si cambia el estado, resetear la observación
      if (formValue.idObservacion == null) {
        jsonEnvio.idObservacion = null;
      }
    }
    if (dataItem.idObservacion != formValue.idObservacion) {
      jsonEnvio.idObservacion = formValue.idObservacion;
    }
    if (
      dataItem.tieneFur != null &&
      formValue.grupoSesion == null &&
      formValue.idAmbiente == null
    ) {
      this._alertaService
        .swalFireOptions({
          title: '¿Desea asociar los cambios a los FUR asociados?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#4C5FC0',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si',
          cancelButtonText: 'No',
          allowOutsideClick: false,
        })
        .then((result) => {
          jsonEnvio.aplicarCambios = result.isConfirmed;
          this.actualizarDatosCronogramaSesiones(
            jsonEnvio,
            dataItem,
            formValue
          );
        });
    } else {
      jsonEnvio.aplicarCambios = false;
      this.actualizarDatosCronogramaSesiones(jsonEnvio, dataItem, formValue);
    }
  }
  actualizarDatosCronogramaSesiones(
    jsonEnvio: InformacionCronogramaSesiones,
    dataItem: CronogramaGrupo,
    formValue: FormCronograma
  ) {
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.PEspecificoSesionActualizarDatosCronogramaSesiones,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (
          resp: HttpResponse<{
            estadoCruce: boolean;
            cruces: CruceSesionPEspecifico[];
            detalle?: string;
          }>
        ) => {
          this.gridCronograma.loading = false;
          if (resp.body.estadoCruce == true) {
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'Se encontraron cruces en el cronograma',
            });
            this.showCrucesCronograma = true;
            this.gridCruceCronograma.data = resp.body.cruces;
          } else {
            this.showCrucesCronograma = false;
            this.gridCruceCronograma.data = [];
            this._alertaService
              .toastOptions(
                'Se realizaron los cambios correctamente',
                'success',
                'top-right',
                idTemplate
              )
              .then(() => {
                if (
                  resp.body.detalle != null &&
                  resp.body.detalle.trim() != ''
                ) {
                  let detalle = resp.body.detalle.replace(/;/g, '<br>');
                  this._alertaService.swalFireOptions({
                    icon: 'info',
                    html: `Se modifico el cronograma, los Furs asociados no se modificaron por las siguientes razones<br>${detalle}`,
                  });
                }
              });
            // this.asignarValoresGridCronograma();
            Object.assign(dataItem, formValue);
          }
        },
        error: (error) => {
          this.gridCronograma.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  asignarValoresGridCronograma() { }
  cargarConfiguracionWebinar(data: ConfigurarWebinar[]) {
    this.gridConfiguracionWebinar.data = data.slice();
    this.gridConfiguracionWebinar.loading = false;
    // programaEspecificoWebinar
  }
  insertarConfiguracionWebinar(datosForm: ConfigurarWebinar) {
    let json: ConfigurarWebinar = {
      id: 0,
      idPespecifico: datosForm.idPespecifico,
      modalidad: '',
      codigo: '',
      idOperadorComparacionAvance: datosForm.idOperadorComparacionAvance,
      valorAvance: datosForm.valorAvance,
      valorAvanceOpc: datosForm.valorAvanceOpc,
      idOperadorComparacionPromedio: datosForm.idOperadorComparacionPromedio,
      valorPromedio: datosForm.valorPromedio,
      valorPromedioOpc: datosForm.valorPromedioOpc,
      idPespecificoPadre: this.dataItemPespecificoTemp.id,
    };
    this.gridConfiguracionWebinar.loading = true;
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.ConfigurarWebinarInsertarConfiguracionWebinar,
        JSON.stringify(json)
      )
      .subscribe({
        next: (resp: HttpResponse<ConfigurarWebinar[]>) => {
          this._alertaService.toastOptions(
            'Se registro correctamente',
            'success',
            'top-right',
            idTemplate
          );
          this.obtenerConfiguracionWebinar();
        },
        error: (error) => {
          this.gridConfiguracionWebinar.loading = false;
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerConfiguracionWebinar(grid?: GridComponent) {
    if (grid != null) {
      grid.closeRow(this.indexTemp);
      this.indexTemp = null;
    }
    this.gridConfiguracionWebinar.loading = true;
    this.pEspecificoService
      .obtenerConfiguracionWebinar$(this.dataItemPespecificoTemp.id)
      .subscribe({
        next: (resp) => {
          this.gridConfiguracionWebinar.skip = 0;
          this.indexTemp = null;
          this.disableGuardarCambios = true;
          if (resp.body != null) {
            this.configurarWebinarOriginal = cloneData(resp.body);
            this.gridConfiguracionWebinar.data = resp.body.slice();
          } else {
            this.gridConfiguracionWebinar.data = [];
          }
          this.gridConfiguracionWebinar.loading = false;
        },
        error: (error) => {
          this.gridConfiguracionWebinar.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerNombreOperadorWebinar(idOperador: number) {
    let item = this.sourceOperadorWebinar.find((x) => x.id == idOperador);
    if (item != null) {
      return item.nombre;
    }
    return null;
  }
  generarPDFCronograma() {
    let jsonEnvio: GenerarPDFEnvio = {
      idPespecifico: this.dataItemPespecificoTemp.id,
      cursoIndividual: this.pEspecificoService.esCursoIndividual,
      cursoNombre: this.dataItemPespecificoTemp.nombre,
      grupo: this.formControlGrupo.value,
      sesion: [],
    };
    jsonEnvio.sesion = this.gridCronograma.data.map((x: CronogramaGrupo) => {
      let item: PespecificoSesionCompuesto = {
        id: x.id,
        // idPespecifico:  this.dataItemPespecificoTemp.id,
        pEspecificoHijoId: x.pEspecificoHijoId,
        fechaHoraInicio: datePipeTransform(x.fechaHoraInicio),
        duracion: x.duracion,
        duracionTotal: Number(x.duracionTotal),
        idExpositor: x.idExpositor,
        idProveedor: x.idProveedor,
        idCiudad: x.idCiudad,
        comentario: x.comentario,
        curso: x.curso,
        tipo: x.tipo,
        modalidadSesion: this.obtenerNombreCombo(
          x.idModalidadCurso,
          'modalidad'
        ),
        // sesionAutoGenerada: null,
        idAmbiente: x.idAmbiente,
        // predeterminado: x.predeterminado,
        esSesionInicial: x.esSesionInicio,
        // cruce:  x.cruce,
        // mostrarPDF:  x.mostrarPDF,
      };
      return item;
    });
    this._integraService
      .postTextResponse(
        constApiPlanificacion.PEspecificoGenerarPDFCronogramaModulo,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<string>) => {
          this._alertaService.notificationSuccessBotom(
            `Se guardo el pdf:  ${resp.body}`
          );
          window.open(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }


  //Hoario Semanalinstituto
  generarPDFCronogramaSemanal() {

    let nombreCurso: string = this.dataItemPespecificoTemp.nombre;
    if (this.formControlCiclo.value != null) {
      nombreCurso = nombreCurso + " /Ciclo:" + this.sourceCiclo.find(x => x.id == this.formControlCiclo.value).nombre;
    }
    if (this.formControlPeriodoLectivo.value != null) {
      nombreCurso = nombreCurso + " /Periodo Lectivo:" + this.sourcePeriodoLectivo.find(x => x.id == this.formControlPeriodoLectivo.value).nombre;
    }

    let jsonEnvio: GenerarPDFEnvio = {
      idPespecifico: this.dataItemPespecificoTemp.id,
      cursoIndividual: this.pEspecificoService.esCursoIndividual,
      cursoNombre: nombreCurso,
      grupo: this.formControlGrupo.value,
      sesion: [],
    };

    if (this.mySelection.length > 0) {
      this.cronogramaSesionesSeleccionados = this.gridCronograma.data.filter(
        (x) => this.mySelection.includes(x.id)
      );
    }
    else {
      this.cronogramaSesionesSeleccionados = this.gridCronograma.data;
    }

    console.log('seleccionados', this.cronogramaSesionesSeleccionados);

    jsonEnvio.sesion = this.cronogramaSesionesSeleccionados.map((x: CronogramaGrupo) => {
      let item: PespecificoSesionCompuesto = {
        id: x.id,
        // idPespecifico:  this.dataItemPespecificoTemp.id,
        pEspecificoHijoId: x.pEspecificoHijoId,
        fechaHoraInicio: datePipeTransform(x.fechaHoraInicio),
        duracion: x.duracion,
        duracionTotal: Number(x.duracionTotal),
        idExpositor: x.idExpositor,
        idProveedor: x.idProveedor,
        idCiudad: x.idCiudad,
        comentario: x.comentario,
        curso: x.curso,
        tipo: x.tipo,
        modalidadSesion: this.obtenerNombreCombo(
          x.idModalidadCurso,
          'modalidad'
        ),
        // sesionAutoGenerada: null,
        idAmbiente: x.idAmbiente,
        // predeterminado: x.predeterminado,
        esSesionInicial: x.esSesionInicio,
        // cruce:  x.cruce,
        // mostrarPDF:  x.mostrarPDF,
      };
      return item;
    });
    this._integraService
      .postTextResponse(
        constApiPlanificacion.PEspecificoGenerarPDFCronogramaSemanal,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<string>) => {
          this._alertaService.notificationSuccessBotom(
            `Se guardo el pdf:  ${resp.body}`
          );
          window.open(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  //Fin Horario Semanal instituto

  eliminarItemGridFrecuencia(sesion: number, grid: GridComponent) {
    if (this.gridDefinirFrecuencia.statusCelda == true) {
      this.gridDefinirFrecuencia.closeCell();
    }
    grid.closeCell();
    grid.cancelCell();
    this.gridDefinirFrecuencia.data = this.gridDefinirFrecuencia.data.filter(
      (x) => x.sesion != sesion
    );
    this.calcularNroSesiones();
  }
  calcularNroSesiones() {
    let contadorSesion = 1;
    this.gridDefinirFrecuencia.data.forEach((x) => {
      x.sesion = contadorSesion;
      contadorSesion++;
    });
  }
  agregarItemDefinirFrecuencia() {
    let item: PEspecificoPadreFrecuenciaSesion = {
      id: 0,
      idPespecificoPadreFrecuencia: 0,
      sesion: null,
      idDiaSemana: null,
      nombre: '',
      horaInicio: null,
      horaFin: null,
      duracion: 0,
      delete: false,
    };
    this.gridDefinirFrecuencia.data = [
      ...this.gridDefinirFrecuencia.data,
      item,
    ];
    this.calcularNroSesiones();
  }
  cambiarDuracionDefinirFrecuencia(
    event: Date,
    dataItem: PEspecificoPadreFrecuenciaSesion,
    tipo: number
  ) {
    if (tipo == 1) {
      if (dataItem.horaFin != null) {
        let horaFin = dataItem.horaFin as Date;
        const diferenciaEnMinutos = Math.floor(
          (horaFin.getTime() - event.getTime()) / (1000 * 60)
        );
        // let diferenciaEnMilisegundos = horaFin.getTime() - horaInicio.getTime();
        // const horas = Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60));
        // const minutos = Math.floor((diferenciaEnMilisegundos % (1000 * 60 * 60)) / (1000 * 60));
        dataItem.duracion = diferenciaEnMinutos;
      }
    } else {
      if (dataItem.horaInicio != null) {
        let horaInicio = dataItem.horaInicio as Date;
        const diferenciaEnMinutos = Math.floor(
          (event.getTime() - horaInicio.getTime()) / (1000 * 60)
        );
        dataItem.duracion = diferenciaEnMinutos;
      }
    }
  }
  guardarPEspecificoPadreFrecuencia() {
    try {
      this.errorsDefinirFrecuencia = [];
      this.showAlertDefinirFrecuencia = false;
      if (!this.formDefinirFrecuencia.valid) {
        this.formDefinirFrecuencia.markAllAsTouched();
        return;
      }
      let item = this.gridDefinirFrecuencia.data.find(
        (x: PEspecificoPadreFrecuenciaSesion) =>
          x.idDiaSemana == 0 || x.idDiaSemana == null
      );
      if (item != null) {
        this.errorsDefinirFrecuencia.push(
          'Las sesiones deben tener el dia seleccionado'
        );
      }
      item = this.gridDefinirFrecuencia.data.find(
        (x: PEspecificoPadreFrecuenciaSesion) => x.horaInicio == null
      );
      if (item != null) {
        this.errorsDefinirFrecuencia.push(
          'Las sesiones deben tener una hora de inicio'
        );
      }
      item = this.gridDefinirFrecuencia.data.find(
        (x: PEspecificoPadreFrecuenciaSesion) => x.horaFin == null
      );
      if (item != null) {
        this.errorsDefinirFrecuencia.push(
          'Las sesiones deben tener una hora final'
        );
      }
      item = this.gridDefinirFrecuencia.data.find(
        (x: PEspecificoPadreFrecuenciaSesion) => x.duracion <= 0
      );
      if (item != null) {
        this.errorsDefinirFrecuencia.push(
          'La hora final debe ser superior a la inicial'
        );
      }
      if (this.errorsDefinirFrecuencia.length > 0) {
        this.showAlertDefinirFrecuencia = true;
        return;
      } else {
        this.showAlertDefinirFrecuencia = false;
      }
      let datosFormulario = this.formDefinirFrecuencia.getRawValue() as {
        idFrecuencia: number;
        tiempo: number;
        nota: string;
      };
      let itemEnvio: PEspecificoPadreFrecuencia = {
        id:
          this.pEspecificoPadreFrecuenciaTemp != null
            ? this.pEspecificoPadreFrecuenciaTemp.id
            : 0,
        idFrecuencia: datosFormulario.idFrecuencia,
        idPespecifico: this.dataItemPespecificoTemp.id,
        idTiempoFrecuencia: datosFormulario.tiempo,
        nota: datosFormulario.nota ?? '',
        sesiones: [],
      };
      itemEnvio.sesiones = this.gridDefinirFrecuencia.data.map(
        (x: PEspecificoPadreFrecuenciaSesion) => {
          let sesion: PEspecificoPadreFrecuenciaSesion = {
            id: x.id,
            idPespecificoPadreFrecuencia: x.idPespecificoPadreFrecuencia,
            sesion: x.sesion,
            idDiaSemana: x.idDiaSemana,
            // nombre: x.nombre,
            horaInicio: datePipeTransform(x.horaInicio as Date, 'HH:mm:ss'),
            horaFin: datePipeTransform(x.horaFin as Date, 'HH:mm:ss'),
            duracion: x.duracion,
            delete: false,
          };
          return sesion;
        }
      );
      if (this.pEspecificoPadreFrecuenciaTemp != null) {
        let idsGrid = itemEnvio.sesiones
          .filter((x) => x.id != null && x.id > 0)
          .map((x) => x.id);
        let deletes = this.pEspecificoPadreFrecuenciaTemp.sesiones.filter(
          (x) => !idsGrid.includes(x.id)
        );
        itemEnvio.sesiones.push(
          ...deletes.map((x) => {
            let sesion: PEspecificoPadreFrecuenciaSesion = {
              id: x.id,
              idPespecificoPadreFrecuencia: x.idPespecificoPadreFrecuencia,
              sesion: x.sesion,
              idDiaSemana: x.idDiaSemana,
              // nombre: x.nombre,
              horaInicio: datePipeTransform(x.horaInicio as Date, 'HH:mm:ss'),
              horaFin: datePipeTransform(x.horaFin as Date, 'HH:mm:ss'),
              duracion: x.duracion,
              delete: false,
            };
            return sesion;
          })
        );
      }
      let api: string =
        constApiPlanificacion.PEspecificoPadreFrecuenciaActualizar;
      if (this.isNewFrecuencia == true) {
        api = constApiPlanificacion.PEspecificoPadreFrecuenciaInsertar;
      }
      this.enProcesoDefinirFrecuencia = true;
      this._integraService
        .postJsonResponse(api, JSON.stringify(itemEnvio))
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            this.modalRefFrecuenca.close();
            this.modalRefFrecuenca = null;
            this.enProcesoDefinirFrecuencia = false;
          },
          error: (error) => {
            this.enProcesoDefinirFrecuencia = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } catch (error) {
      console.log(error);
    }
  }
  abrirModalDefinirFrecuencia(context: any) {
    this.enProcesoDefinirFrecuencia = false;
    this.pEspecificoPadreFrecuenciaTemp = null;
    this.showAlertDefinirFrecuencia = false;
    this.errorsDefinirFrecuencia = [];
    this.gridDefinirFrecuencia.data = [];
    this.formDefinirFrecuencia.reset();
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.PEspecificoPadreFrecuenciaObtener}/${this.dataItemPespecificoTemp.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<PEspecificoPadreFrecuencia>) => {
          if (resp.body != null) {
            this.formDefinirFrecuencia
              .get('idFrecuencia')
              .setValue(resp.body.idFrecuencia);
            this.formDefinirFrecuencia.get('nota').setValue(resp.body.nota);
            resp.body.sesiones.forEach((x) => {
              if (x.horaFin != null) {
                x.horaFin = new Date(x.horaFin);
              }
              if (x.horaFin != null) {
                x.horaFin = new Date(x.horaFin);
              }
            });
            this.pEspecificoPadreFrecuenciaTemp = resp.body;
            this.gridDefinirFrecuencia.data = [...resp.body.sesiones];
            this.isNewFrecuencia = false;
          } else {
            this.isNewFrecuencia = true;
          }
          this.modalRefFrecuenca = this._modalService.open(context, {
            size: 'lg',
            backdrop: 'static',
            keyboard: false,
          });
        },
      });
  }
  eliminarSesion(dataItem: CronogramaGrupo) {
    if (dataItem.esSesionInicio) {
      this._alertaService.swalFireOptions({
        title: 'No se puede borrar una sesion que sea fecha de inicio',
        icon: 'warning',
      });
    }
    this._alertaService
      .swalFireOptions({
        title: '¿Está seguro de eliminar la sesion?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._integraService
            .deleteJsonResponse(
              `${constApiPlanificacion.PespecificoSesionEliminarSesion}/${this.dataItemPespecificoTemp.id}/${dataItem.id}`
            )
            .subscribe({
              next: (resp: HttpResponse<boolean>) => {
                if (resp.body == true) {
                  this._alertaService.toastOptions(
                    'Se elimino la sesión correctamente',
                    'success',
                    'top-right',
                    idTemplate
                  );
                }
                this.recargarCronogramaPespecifico();
              },
              error: (error) => {
                console.log(error);
              },
            });
        }
      });
  }
  clonarSesiones() {
    let idPespecifico = this.controlSesionPespecifico.value;
    if (idPespecifico == null) {
      if (this.pEspecificoService.esCursoIndividual != true) {
        this.showAlertDuplicarCurso = true;
        return;
      }
      idPespecifico = 0;
    }
    this.enProcesoClonarSesion = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.PEspecificoClonarSesiones}/${this.dataItemPespecificoTemp.id}/${idPespecifico}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.enProcesoClonarSesion = false;
          if (resp.body == true) {
            this.modalRefDuplicarGrupo.close();
            this.obtenerNumeroGrupos(true);
          } else {
            this._alertaService.notificationInfo(
              'No se pudo duplicar el grupo'
            );
          }
        },
        error: (error) => {
          this.enProcesoClonarSesion = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  private obtenerNumeroGrupos(esClonarSesiones?: boolean) {
    this.pEspecificoService.obtenerNumeroGrupos$().subscribe({
      next: (resp: HttpResponse<IComboBase1[]>) => {
        this.showBtnEliminarGrupo = resp.body.length > 1;
        this.sourceGrupos = resp.body;
        if (resp.body.length > 0) {
          if (esClonarSesiones == true) {
            this.formControlGrupo.setValue(resp.body[resp.body.length - 1].id);
            this.recargarCronogramaPespecifico();
          } else {
            this.formControlGrupo.setValue(resp.body[0].id);
          }
        }
      },
      error: (error) => {
        console.log(error);
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationWarning(mensaje);
      },
    });
  }
  controlSesionPespecifico: FormControl = new FormControl(null);
  showAlertDuplicarCurso: boolean = false;
  modalRefDuplicarGrupo: any;
  abrirModalDuplicarGrupo(context: any) {
    this.controlSesionPespecifico.reset();
    this.showAlertDuplicarCurso = false;
    this.modalRefDuplicarGrupo = this._modalService.open(context, {
      backdrop: 'static',
      keyboard: false,
    });
  }
  establecerSesionInicial(dataItem: CronogramaGrupo) {
    this.gridCronograma.loading = true;
    this._integraService
      .putJsonResponse(
        `${constApiPlanificacion.PespecificoSesionEstablecerSesionInicial}/${dataItem.id}`,
        null
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.gridCronograma.loading = false;
          this.recargarCronogramaPespecifico();
          this._alertaService.toastOptions(
            'Se establecio como fecha de inicio',
            'success',
            'top-right',
            idTemplate
          );
        },
        error: (error) => {
          this.gridCronograma.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  abrirModalInsertarSesion(context: any, dataItem?: CronogramaGrupo) {
    this.enProcesoInsertarSesion = false;
    this.sesionPorReprogramar = null;
    this.formInsertarSesion.reset();
    if (this.pEspecificoService.esCursoIndividual == true) {
      this.showOpcionesInsertarSesion = false;
      this.formInsertarSesion.get('tipo').setValue('Programa Especifico');
    } else {
      this.showOpcionesInsertarSesion = true;
    }
    if (dataItem) {
      this.sesionPorReprogramar = dataItem;
      this.showOpcionesInsertarSesion = false;
      this.formInsertarSesion.get('tipo').setValue('Programa Especifico');
      this.formInsertarSesion.get('fecha').setValue(dataItem.fechaHoraInicio);
      this.formInsertarSesion.get('duracion').setValue(dataItem.duracion);
      // No pre-cargar el grupo, se usará el grupo actual del cronograma (formControlGrupo)
      if (!this.pEspecificoService.esCursoIndividual) {
        this.formInsertarSesion.get('idPespecifico').setValue(dataItem.pEspecificoHijoId);
      }
    }
    this.modalRefInsertarSesion = this._modalService.open(context, {
      backdrop: 'static',
      keyboard: false,
    });
  }
  guardarCambiosWebinar(grid: GridComponent) {
    if (grid != null) {
      grid.closeRow(this.indexTemp);
      this.indexTemp = null;
    }
    let data = this.gridConfiguracionWebinar.data as ConfigurarWebinar[];
    let itemsModificados = data.filter((x) => {
      if (x.id != 0 && x.id != null) {
        let item = this.configurarWebinarOriginal.find((s) => s.id == x.id);
        if (item != null) {
          if (
            x.idPespecifico != item.idPespecifico ||
            x.idOperadorComparacionAvance != item.idOperadorComparacionAvance ||
            x.valorAvance != item.valorAvance ||
            x.valorAvanceOpc != item.valorAvanceOpc ||
            x.idOperadorComparacionPromedio !=
            item.idOperadorComparacionPromedio ||
            x.valorPromedio != item.valorPromedio ||
            x.valorPromedioOpc != item.valorPromedioOpc
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
    let idsDeletes = this.configurarWebinarOriginal
      .filter((x) => !data.map((y) => y.id).includes(x.id))
      .map((s) => s.id);
    if (
      itemsModificados != null &&
      itemsModificados.length > 0 &&
      idsDeletes != null &&
      idsDeletes.length > 0
    ) {
      this.gridConfiguracionWebinar.loading = true;
      let obs1$ = this._integraService.putJsonResponse(
        constApiPlanificacion.PEspecificoActualizarConfigurarWebinar,
        JSON.stringify(itemsModificados)
      );
      let obs2$ = this._integraService.deleteJsonResponse(
        constApiPlanificacion.PEspecificoEliminarConfiguracionWebinar,
        JSON.stringify(idsDeletes)
      );
      const combined$ = forkJoin([obs1$, obs2$]);
      combined$.subscribe({
        next: (resp) => {
          this.disableGuardarCambios = true;
          this.gridConfiguracionWebinar.loading = false;
          this._alertaService.toastOptions(
            'Se guardaron los cambios',
            'success',
            'top-right',
            idTemplate
          );
          this.obtenerConfiguracionWebinar();
        },
        error: (error) => {
          this.gridConfiguracionWebinar.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    } else {
      if (itemsModificados != null && itemsModificados.length > 0) {
        this.gridConfiguracionWebinar.loading = true;
        this._integraService
          .putJsonResponse(
            constApiPlanificacion.PEspecificoActualizarConfigurarWebinar,
            JSON.stringify(itemsModificados)
          )
          .subscribe({
            next: (resp) => {
              this.gridConfiguracionWebinar.loading = false;
              this._alertaService.toastOptions(
                'Se guardaron los cambios',
                'success',
                'top-right',
                idTemplate
              );
              this.obtenerConfiguracionWebinar();
            },
            error: (error) => {
              this.gridConfiguracionWebinar.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
      if (idsDeletes != null && idsDeletes.length > 0) {
        this.gridConfiguracionWebinar.loading = true;
        this._integraService
          .deleteJsonResponse(
            constApiPlanificacion.PEspecificoEliminarConfiguracionWebinar,
            JSON.stringify(idsDeletes)
          )
          .subscribe({
            next: (resp) => {
              this.gridConfiguracionWebinar.loading = false;
              this._alertaService.toastOptions(
                'Se guardaron los cambios',
                'success',
                'top-right',
                idTemplate
              );
              this.obtenerConfiguracionWebinar();
            },
            error: (error) => {
              this.gridConfiguracionWebinar.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    }
  }
  cargarCronogramaPespecifico(data: CronogramaGrupo[], esFur: boolean) {
    const uniqueArray = data
      .map((x) => x.pEspecificoHijoId)
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
    let contador = 0;
    let color = uniqueArray.map((x) => {
      let item = {
        pEspecificoHijoId: x,
        color: 'color' + contador,
      };
      contador++;
      if (contador > 9) {
        contador = 0;
      }
      return item;
    });

    data.forEach((x) => {
      if (x.fechaHoraInicio != null) {
        x.fechaHoraInicio = new Date(x.fechaHoraInicio);
        x.fechaHoraFin = new Date(x.fechaHoraInicio);
        x.fechaHoraFin.setMinutes(x.fechaHoraFin.getMinutes() + (x.duracion * 60));
      }
      // Mapear campos de estado y observación desde el backend
      x.idEstadoCurso = x.idPEspecificoSesionEstado;
      x.idObservacion = x.idPEspecificoSesionEstadoObservacionDetalle;
      // x.ciudad = this.pEspecificoService.obtenerNombreCiudad(x.idCiudad);
      // x.proveedor = this.pEspecificoService.obtenerNombreCombo(
      //   x.idProveedor,
      //   'proveedorCurso'
      // );
      // x.ambiente = this.pEspecificoService.obtenerNombreCombo(
      //   x.idAmbiente,
      //   'ambiente'
      // );
      // x.modalidad = this.pEspecificoService.obtenerNombreCombo(
      //   x.idModalidadCurso,
      //   'modalidad'
      // );
      // x.modalidad = this.pEspecificoService.obtenerNombreCombo(
      //   x.idModalidadCurso,
      //   'modalidad'
      // );
      x.color = color.find(
        (s) => s.pEspecificoHijoId == x.pEspecificoHijoId
      ).color;
    });
    this.gridCronograma.data = data;
    this.sourceCronograma = data;
    console.log('src crono ', this.sourceCronograma);

  }
  obtenerNombreCombo(id: number, keyCombo: keyof CombosModulo) {
    return this.pEspecificoService.obtenerNombreCombo(id, keyCombo);
  }
  obtenerNombreCiudad(idCiudad: number) {
    return this.pEspecificoService.obtenerNombreCiudad(idCiudad);
  }
  /**
   * Obtiene el nombre del proveedor.
   * Busca primero en sourceProveedoresCurso, luego en combosModulo.proveedorCurso.
   */
  obtenerNombreProveedor(idProveedor: number): string {
    if (idProveedor == null) return null;

    // Buscar en los proveedores del PEspecifico actual
    const proveedorPEspecifico = this.sourceProveedoresCurso.find(p => p.id === idProveedor);
    if (proveedorPEspecifico) return proveedorPEspecifico.nombre;

    // Si no se encuentra, buscar en los proveedores generales
    if (this.combosModulo?.proveedorCurso) {
      const proveedorGeneral = this.combosModulo.proveedorCurso.find(p => p.id === idProveedor);
      if (proveedorGeneral) return proveedorGeneral.nombre;
    }

    return null;
  }
  guardarNuevaSesion() {
    let datosForm = this.formInsertarSesion.getRawValue() as FormInsertarSesion;
    if (datosForm.tipo == 'Programa Especifico') {
      if (this.formInsertarSesion.valid) {
        if (this.pEspecificoService.esCursoIndividual) {
          this.insertarSesionEnCurso(this.dataItemPespecificoTemp.id);
        } else {
          if (datosForm.idPespecifico == null || datosForm.idPespecifico == 0) {
            this._alertaService.swalFireOptions({
              icon: 'info',
              title: 'Seleccione un Programa especifico',
            });
            return;
          }
          this.insertarSesionEnCurso(datosForm.idPespecifico);
        }
      } else {
        this.formInsertarSesion.markAllAsTouched();
      }
    }
    if (
      datosForm.tipo == 'Sesion Introductoria' ||
      (datosForm.tipo == 'Sesion Audiovisual' &&
        !this.pEspecificoService.esCursoIndividual)
    ) {
      this.insertarSesionEspecial();
    }
  }
  insertarSesionEnCurso(idPespecifico: number) {
    let datosForm = this.formInsertarSesion.getRawValue() as FormInsertarSesion;
    let ctrlGrupo = this.formControlGrupo.value;
    const grupoNuevaSesion = (ctrlGrupo != null) ? ctrlGrupo : 1;

    this.enProcesoInsertarSesion = true;

    // Usar endpoint específico para reprogramación si es una sesión reprogramada
    if (this.sesionPorReprogramar) {
      const jsonReprogramar: ReprogramarSesion = {
        idPespecifico: idPespecifico,
        fechaHoraInicio: datePipeTransform(datosForm.fecha),
        duracion: datosForm.duracion,
        idExpositor: this.sesionPorReprogramar.idProveedor,
        idAmbiente: this.sesionPorReprogramar.idAmbiente,
        comentario: '',
        grupo: grupoNuevaSesion,
        grupoSesion: this.sesionPorReprogramar.grupoSesion ?? 0,
        idModalidadCurso: this.sesionPorReprogramar.idModalidadCurso,
      };

      this._integraService
        .postJsonResponse(
          constApiPlanificacion.PEspecificoInsertarSesionReprogramada,
          JSON.stringify(jsonReprogramar)
        )
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            this._alertaService.toastOptions(
              'Sesión reprogramada correctamente',
              'success',
              'top-right',
              idTemplate
            );
            this.enProcesoInsertarSesion = false;
            this.modalRefInsertarSesion.close();
            const grupoActual = this.formControlGrupo.value;
            this.obtenerNumeroGrupos();
            this.actualizarGrupoSesionOriginal(this.sesionPorReprogramar, grupoActual);
            this.sesionPorReprogramar = null;
          },
          error: (error) => {
            this.enProcesoInsertarSesion = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      // Inserción normal de sesión
      const jsonEnvio: InformacionPespecificoSesion = {
        id: 0,
        idPespecifico: idPespecifico,
        fechaHoraInicio: datePipeTransform(datosForm.fecha),
        duracion: datosForm.duracion,
        comentario: '',
        sesionAutoGenerada: false,
        grupo: grupoNuevaSesion,
        grupoSesion: null,
      };

      this._integraService
        .postJsonResponse(
          constApiPlanificacion.PEspecificoActualizarDuracionInsertarSesion,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            if (resp.body == true) {
              this._alertaService.toastOptions(
                'Se registro correctamente',
                'success',
                'top-right',
                idTemplate
              );
            }
            this.enProcesoInsertarSesion = false;
            this.modalRefInsertarSesion.close();
            this.obtenerNumeroGrupos();
            this.recargarCronogramaPespecifico();
          },
          error: (error) => {
            this.enProcesoInsertarSesion = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
  }
  actualizarGrupoSesionOriginal(sesion: CronogramaGrupo, grupoARecargar?: number) {
    const jsonGrupo: InformacionCronogramaSesiones = {
      id: sesion.id,
      fechaHoraInicio: datePipeTransform(sesion.fechaHoraInicio),
      aplicarCambios: false,
      idExpositor: sesion.idExpositor,
      idModalidadCurso: sesion.idModalidadCurso,
      idAmbiente: sesion.idAmbiente,
      idProveedor: sesion.idProveedor,
      grupoSesion: sesion.grupoSesion,
      mostrarPortalWeb: sesion.mostrarPortalWeb,
      idObservacion: sesion.idObservacion,
    };
    const jsonEstado = {
      Id: sesion.id,
      IdPEspecificoSesionEstado: 2, // 2 = Cancelada
    };
    const actualizarDatos$ = this._integraService.putJsonResponse(
      constApiPlanificacion.PEspecificoSesionActualizarDatosCronogramaSesiones,
      JSON.stringify(jsonGrupo)
    );
    const actualizarEstado$ = this._integraService.putJsonResponse(
      constApiPlanificacion.PEspecificoSesionActualizarEstadoCurso,
      JSON.stringify(jsonEstado)
    );
    forkJoin([actualizarDatos$, actualizarEstado$]).subscribe({
      next: () => {
        sesion.idEstadoCurso = 2; // 2 = Cancelada
        sesion.idPEspecificoSesionEstado = 2; // 2 = Cancelada
        // Restaurar el valor del dropdown al grupo original para mantener consistencia en la UI
        if (grupoARecargar != null) {
          this.formControlGrupo.setValue(grupoARecargar);
        }
        // Usar el grupo específico si se proporciona, para mantener la vista del grupo correcto
        this.recargarCronogramaPespecifico(null, grupoARecargar);
      },
      error: (error) => {
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationWarning(mensaje);
        // Restaurar el valor del dropdown al grupo original para mantener consistencia en la UI
        if (grupoARecargar != null) {
          this.formControlGrupo.setValue(grupoARecargar);
        }
        this.recargarCronogramaPespecifico(null, grupoARecargar);
      },
    });
  }
  insertarSesionEspecial() {
    let datosForm = this.formInsertarSesion.getRawValue() as FormInsertarSesion;
    let jsonEnvio: FiltroSesionEspecial = {
      pEspecificoPadreId: this.dataItemPespecificoTemp.id,
      nombre: datosForm.tipo,
      fecha: datePipeTransform(datosForm.fecha),
      duracion: datosForm.duracion,
      grupo: this.formControlGrupo.value,
    };
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.PEspecificoInsertarEventoEspecial,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.recargarCronogramaPespecifico();
          this.modalRefInsertarSesion.close();
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  abrirModalRegistroFur() {
    this.registroFur();
  }
  registroFur() {
    const modalRef = this._modalService.open(ModalContentRegistroFurComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.pEspecificoService = this.pEspecificoService;
    modalRef.componentInstance.isNew = true;
  }
  modificarCronograma() {
    // this.pEspecificoService.modificarCronograma();
    this.obtenerConfiguracionWebinarPEspecifico(
      this.dataItemPespecificoTemp.id
    );
  }
  recargarCronogramaPespecifico(grid?: GridComponent, numeroGrupo?: number) {
    if (grid != null) {
      try {
        grid.closeCell();
      } catch (error) {
        console.log(error);
      }
    }
    this.gridCronograma.loading = true;
    this.pEspecificoService
      .obtenerCronogramaPEspecifico$(
        this.idsPespecificoSeleccionado,
        this.dataItemPespecificoTemp.id,
        this.pEspecificoService.esIndividual,
        numeroGrupo ?? this.formControlGrupo.value
      )
      .subscribe({
        next: (resp2: HttpResponse<CronogramaGrupo[]>) => {
          this.gridCronograma.loading = false;
          this.cargarCronogramaPespecifico(resp2.body, false);
        },
        error: (error) => {
          this.gridCronograma.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  cambiarNumeroGrupo(idGrupo: number) {
    if (this.pEspecificoService.esIndividual) {
      this.pEspecificoService.verificarEsPespecificoIndividual(
        this.dataItemPespecificoTemp.id
      );
    }
    this.gridCronograma.loading = true;
    this.pEspecificoService
      .obtenerCronogramaPEspecifico$(
        this.idsPespecificoSeleccionado,
        this.dataItemPespecificoTemp.id,
        this.pEspecificoService.esIndividual,
        idGrupo
      )
      .subscribe({
        next: (resp2: HttpResponse<CronogramaGrupo[]>) => {
          this.gridCronograma.loading = false;
          this.cargarCronogramaPespecifico(resp2.body, false);
        },
        error: (error) => {
          this.gridCronograma.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  reloadModal() { }
  eliminarFurSesion(dataItem: ProgramaEspecificoFUR) {
    this._alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        let index = this.gridFurCronograma.data.findIndex(
          (x) => x.id == dataItem.id
        );

        this.gridFurCronograma.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.PEspecificoConsumoEliminarSesionFur}/${dataItem.id}`
          )
          .subscribe({
            next: (resp: HttpResponse<boolean>) => {
              this.gridFurCronograma.data.splice(index, 1);
              this.gridFurCronograma.data = [...this.gridFurCronograma.data];
              this.gridFurCronograma.loading = false;
              if (resp.body == true) {
                this._alertaService.toastOptions(
                  'El registro se elimino correctamente',
                  'success',
                  'top-right',
                  idTemplate
                );
              }
            },
            error: (error) => {
              this.gridFurCronograma.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }
  editarFurSesion(dataItem: ProgramaEspecificoFUR) {
    const modalRef = this._modalService.open(ModalContentRegistroFurComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.pEspecificoService = this.pEspecificoService;
    modalRef.componentInstance.isNew = false;
    modalRef.componentInstance.dataItemProgramaEspecificoFUR = dataItem;
  }
  obtenerFurProgramaEspecifico() {
    this.gridFurCronograma.loading = true;
    this.pEspecificoService.obtenerFurProgramaEspecifico$().subscribe({
      next: (resp) => {
        this.gridFurCronograma.loading = false;
        this.gridFurCronograma.data = resp.body;
      },
      error: (error) => {
        this.gridFurCronograma.loading = false;
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationWarning(mensaje);
      },
    });
  }
  checkedRadioInserarSesion(event: any) {

  }

  filtrarSesionesCiclo(_idCiclo: number) {
    this.gridCronograma.loading = true;
    let filtroTemp;

    if (_idCiclo != null) {
      filtroTemp = this.sourceCronograma.filter(x => x.idCiclo == _idCiclo);
      this.gridCronograma.loading = false;
      this.gridCronograma.data = filtroTemp;
    }
    else {
      this.gridCronograma.loading = false;
      this.gridCronograma.data = this.sourceCronograma
    }
  }

  filtrarSesionesPeriodoLectivo(_idPeriodoLectivo: number) {
    this.gridCronograma.loading = true;
    let filtroTemp;

    if (_idPeriodoLectivo != null) {
      filtroTemp = this.sourceCronograma.filter(x => x.idPeriodoLectivo == _idPeriodoLectivo);
      this.gridCronograma.loading = false;
      this.gridCronograma.data = filtroTemp;
    }
    else {
      this.gridCronograma.loading = false;
      this.gridCronograma.data = this.sourceCronograma
    }
  }
  validarSoloNumerosPositivos(e: any, max: number = 999): void {
    const key = e.key;
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Home',
      'End',
    ];

    if (allowedKeys.includes(key)) {
      return;
    }
    const input = e.target;
    const currentValue = input.value || '';
    const selectionStart = input.selectionStart || 0;
    const selectionEnd = input.selectionEnd || 0;

    if (key === '.') {
      if (currentValue.includes('.')) {
        e.preventDefault();
      }
      return;
    }

    if (/^[0-9]$/.test(key)) {

      const newValueStr =
        currentValue.substring(0, selectionStart) +
        key +
        currentValue.substring(selectionEnd);

      const newValue = Number(newValueStr);

      if (newValue > max) {
        e.preventDefault();
      }
      return;
    }

    e.preventDefault();
  }

}

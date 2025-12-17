import { HttpResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { SortDescriptor } from '@progress/kendo-data-query';
import { of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

import { constApiGestionPersonal } from '@environments/constApi';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IClaveValor, IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

import {
  ClasificacionNeo,
  ComboModulo,
  EtapaAprobada,
  EvaluacionPortalPostulante,
  FiltroReporte,
  Postulante,
  Proceso,
  ProcesoSeleccionEtapa,
  ReporteEvaluacionPostulante,
  ReportePostulanteMatricula,
} from '@gestionPersonas/models/reporte-evaluacion-postulante';

interface FormFiltro {
  procesoSeleccion: number;
  etapasProceso: number[];
  estadoEtapas: number[];
  fechaInicio: Date;
  fechaFin: Date;
  versionCentil: string;
  grupoComparacion: number;
  filtroPorPostulante: boolean;
  postulantes: number[];
}

interface ClaveValor {
  [key: string]: string | number | boolean;
}

@Component({
  selector: 'app-evaluacion-postulante',
  templateUrl: './evaluacion-postulante.component.html',
  styleUrls: ['./evaluacion-postulante.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluacionPostulanteComponent implements OnInit, OnDestroy {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  private destroy$ = new Subject<void>();

  // ================== GRIDS ==================
  gridEtapaProcesoSeleccion = new KendoGrid<ClaveValor>();
  gridReportePostulante = new KendoGrid<ClaveValor>();
  gridCursoAsesorCapacitacion = new KendoGrid<any>();

  // ================== COMBOS ==================
  comboProcesoSeleccion: IComboBase1[] = [];
  comboEtapaProceso: ProcesoSeleccionEtapa[] = [];
  private _sourceEtapaProceso: ProcesoSeleccionEtapa[] = [];
  comboEstadoEtapa: IComboBase1[] = [];
  comboGrupoComparacion: IComboBase1[] = [];
  comboPostulante: IComboBase1[] = [];
  comboVersionCentil: IClaveValor[] = [];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  formFiltro = this.formBuilder.group({
    procesoSeleccion: null,
    etapasProceso: [[]],
    estadoEtapas: [[]],
    fechaInicio: [null],
    fechaFin: [null],
    versionCentil: ['0'],
    grupoComparacion: [null],
    filtroPorPostulante: [false],
    postulantes: [[]],
  });

  // ================== TEMP ==================
  versionCentilTemp: string = null;
  etapasAprobadas: EtapaAprobada[] = [];
  postulantesTemp: Postulante[] = [];

  // ================== SORT/GROUP ==================
  sortPostulante: SortDescriptor[] = [{ field: 'ordenReal', dir: 'asc' }];
  sortEtapa: SortDescriptor[] = [
    { field: 'procesoSeleccion', dir: 'asc' },
    { field: 'nroOrden', dir: 'asc' },
  ];
  groupPostulante = [{ field: 'categoria' }];

  // ================== FLAGS ==================
  showReportePostulante = false;
  showReporteEtapaProceso = false;
  showReporteAsesorCapacitacion = false;

  loadingReporteEtapaProceso = false;
  loadingReportePostulante = false;
  loadingReporteAsesorCapacitacion = false;

  filtroReporteTemporal: FiltroReporte = null;

  btnBuscarDisabled = false;
  colorEvaluaciones: { evaluacion: string; color: string }[] = [];

  // ================== ESTADO MAP ==================
  private estadoMap = new Map<number, string>();

  ngOnInit(): void {
    this.obtenerCombosModulo();
    this.initFiltroPostulante();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get fechaActual(): Date {
    return new Date();
  }

  // ---------------- FILTRO ----------------

  onChangeFiltroPostulate(event: boolean) {
    if (event) {
      this.formFiltro.get('procesoSeleccion')?.disable();
      this.formFiltro.get('etapasProceso')?.disable();
      this.comboEtapaProceso = [];
      this.formFiltro.get('estadoEtapas')?.disable();
      this.formFiltro.get('fechaInicio')?.disable();
      this.formFiltro.get('fechaFin')?.disable();

      this.formFiltro.get('procesoSeleccion')?.setValue(null);
      this.formFiltro.get('etapasProceso')?.setValue([]);
      this.formFiltro.get('estadoEtapas')?.setValue([]);
      this.formFiltro.get('fechaInicio')?.setValue(null);
      this.formFiltro.get('fechaFin')?.setValue(null);

      this.formFiltro.get('postulantes')?.enable();
    } else {
      this.formFiltro.get('procesoSeleccion')?.enable();
      this.formFiltro.get('etapasProceso')?.enable();
      this.formFiltro.get('estadoEtapas')?.enable();
      this.formFiltro.get('fechaInicio')?.enable();
      this.formFiltro.get('fechaFin')?.enable();
      this.formFiltro.get('postulantes')?.disable();

      this.formFiltro.get('postulantes')?.setValue([]);
    }

    this.cd.markForCheck();
  }

  valueChangeProcesoSeleccion(event: number) {
    this.comboEtapaProceso = this._sourceEtapaProceso.filter(
      (x) => x.idProcesoSeleccion == event
    );
    this.cd.markForCheck();
  }

  private obtenerCombosModulo() {
    this.integraService
      .getJsonResponse(constApiGestionPersonal.EvaluacionPostulanteObtenerCombosModulo)
      .subscribe({
        next: (resp: HttpResponse<ComboModulo>) => {
          this.comboProcesoSeleccion = resp.body.procesosDeSeleccion;
          this._sourceEtapaProceso = resp.body.procesoSeleccionEtapas;

          this.comboEstadoEtapa = resp.body.estadoEtapas;
          this.buildEstadoMap();

          this.comboGrupoComparacion = resp.body.gruposComparacion;

          this.comboVersionCentil = resp.body.versionesCentil.map((x) => {
            const item: IClaveValor = {
              clave: x.valor,
              valor: `Versión ${x.valor}`,
            };
            return item;
          });

          this.cd.markForCheck();
        },
        error: (error) => {
          const resp = this.alertaService.getErrorResponse(error);
          this.alertaService.notificationWarning(`${resp.titulo}: ${resp.mensaje}`);
        },
      });
  }

  private buildEstadoMap() {
    this.estadoMap = new Map(this.comboEstadoEtapa.map((x) => [x.id, x.nombre]));
  }

  getNombreEstadoEtapaProceso(id: number) {
    return id ? this.estadoMap.get(id) ?? null : null;
  }

  // ----------- AUTOCOMPLETE POSTULANTE (OPTIMIZADO) -----------

  private postulanteFilter$ = new Subject<string>();

  private initFiltroPostulante() {
    this.postulanteFilter$
      .pipe(
        map((v) => (v ?? '').trim()),
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((term) => {
          if (term.length < 3) return of([] as IComboBase1[]);
          const jsonEnvio = { valor: term };
          return this.integraService
            .postJsonResponse(
              constApiGestionPersonal.PostulanteObtenerPostulanteFiltroAutocomplete,
              JSON.stringify(jsonEnvio)
            )
            .pipe(
              map((resp: HttpResponse<IComboBase1[]>) => resp.body ?? []),
              catchError(() => of([] as IComboBase1[]))
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((list) => {
        this.comboPostulante = list;
        this.cd.markForCheck();
      });
  }

  onFilterChangePostulante(event: string) {
    this.postulanteFilter$.next(event);
  }

  // ---------------- REPORTE GENERAL ----------------

  generarReporte() {
    const formFiltro = this.formFiltro.getRawValue() as FormFiltro;

    if (formFiltro.filtroPorPostulante === true && formFiltro.postulantes.length === 0) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Seleccione al menos un postulante!',
      });
      return;
    }

    if (formFiltro.filtroPorPostulante === false && formFiltro.procesoSeleccion == null) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Seleccione un Proceso de Selección!',
      });
      return;
    }

    const jsonEnvio: FiltroReporte = {
      idsPostulantes: formFiltro.postulantes ?? [],
      idProcesoSeleccion: formFiltro.procesoSeleccion,
      idGrupoComparacion: formFiltro.grupoComparacion,
      idsProcesoEtapa: formFiltro.etapasProceso ?? [],
      idsEstadoEtapa: formFiltro.estadoEtapas ?? [],
      filtroPorPostulante: formFiltro.filtroPorPostulante,
    };

    this.versionCentilTemp = formFiltro.versionCentil;

    if (formFiltro.fechaInicio != null) {
      jsonEnvio.fechaInicio = datePipeTransform(formFiltro.fechaInicio, 'yyyy-MM-dd') + 'T00:00:00';
    }
    if (formFiltro.fechaFin != null) {
      jsonEnvio.fechaFin = datePipeTransform(formFiltro.fechaFin, 'yyyy-MM-dd') + 'T23:59:59';
    }

    // reset
    this.gridEtapaProcesoSeleccion.data = [];
    this.gridReportePostulante.data = [];
    this.gridCursoAsesorCapacitacion.data = [];
    this.etapasAprobadas = [];
    this.postulantesTemp = [];

    this.showReporteEtapaProceso = false;
    this.showReportePostulante = false;
    this.showReporteAsesorCapacitacion = false;

    this.loadingReporteEtapaProceso = true;
    this.loadingReportePostulante = true;
    this.loadingReporteAsesorCapacitacion = true;

    this.gridEtapaProcesoSeleccion.loading = true;
    this.gridReportePostulante.loading = true;
    this.gridCursoAsesorCapacitacion.loading = true;

    this.filtroReporteTemporal = jsonEnvio;
    this.btnBuscarDisabled = true;

    this.cd.markForCheck();

    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteGenerarReporte,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<ReporteEvaluacionPostulante>) => {
          this.btnBuscarDisabled = false;

          this.generarGridEtapas(resp.body.etapaAprobada);
          this.obtenerEvaluacionesPortalPostulante(jsonEnvio, resp.body);

          const idsMatricula = resp.body.matriculaPostulantes
            .filter((s) => s.valor != null && s.valor != 0)
            .map((x) => x.id);

          if (idsMatricula.length > 0) {
            this.obtenerNotasMatriculaReporte(idsMatricula);
          } else {
            this.loadingReporteAsesorCapacitacion = false;
            this.gridCursoAsesorCapacitacion.loading = false;
            this.cd.markForCheck();
          }
        },
        error: (error) => {
          this.btnBuscarDisabled = false;

          this.loadingReporteEtapaProceso = false;
          this.loadingReportePostulante = false;
          this.loadingReporteAsesorCapacitacion = false;

          this.gridEtapaProcesoSeleccion.loading = false;
          this.gridReportePostulante.loading = false;
          this.gridCursoAsesorCapacitacion.loading = false;

          this.cd.markForCheck();

          const resp = this.alertaService.getErrorResponse(error);
          if (error.status === 409) {
            this.alertaService.swalFireOptions({
              icon: 'success',
              title: `${resp.mensaje}`,
            });
          } else {
            this.alertaService.notificationInfo(`${resp.titulo}: ${resp.mensaje}`);
          }
        },
      });
  }

  // llamado desde el hijo cuando se actualiza algo en etapas
  generarReporteIntegra() {
    const jsonEnvio = this.filtroReporteTemporal;
    if (!jsonEnvio) return;

    this.gridEtapaProcesoSeleccion.loading = true;
    this.loadingReporteEtapaProceso = true;
    this.cd.markForCheck();

    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteGenerarReporte,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (
          resp: HttpResponse<{
            etapaAprobada: EtapaAprobada[];
            cantidadEtapaAprobada: number;
          }>
        ) => {
          this.generarGridEtapas(resp.body.etapaAprobada);
        },
        error: (error) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          this.loadingReporteEtapaProceso = false;
          this.cd.markForCheck();

          const resp = this.alertaService.getErrorResponse(error);
          if (error.status === 409) {
            this.alertaService.swalFireOptions({
              icon: 'success',
              title: `${resp.mensaje}`,
            });
          } else {
            this.alertaService.notificationInfo(`${resp.titulo}: ${resp.mensaje}`);
          }
        },
      });
  }

  // ---------------- REPORTE POSTULANTE ----------------

  obtenerEvaluacionesPortalPostulante(jsonEnvio: FiltroReporte, reporte: ReporteEvaluacionPostulante) {
    this.gridReportePostulante.loading = true;
    this.loadingReportePostulante = true;
    this.cd.markForCheck();

    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteObtenerEvaluacionesPortalPostulante,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<EvaluacionPortalPostulante[]>) => {
          (resp.body ?? []).forEach((epp) => {
            reporte.datosEvaluacionAgrupado.forEach((dato) => {
              const item = dato.proceso.find(
                (x) => x.idExamen === epp.idExamen && x.idPostulante === epp.idPostulante
              );
              if (item) {
                item.puntajeCurso = epp.puntajeCurso;
                item.cantidadConfigurado = epp.cantidadConfigurado;
                item.cantidadResuelto = epp.cantidadResuelto;
              }
            });
          });

          this.generarGridGmatPma(reporte);
        },
        error: (error) => {
          this.gridReportePostulante.loading = false;
          this.loadingReportePostulante = false;
          this.cd.markForCheck();

          const resp = this.alertaService.getErrorResponse(error);
          this.alertaService.notificationWarning(`${resp.mensaje}`);
        },
      });
  }

  generarGridGmatPma(reporte: ReporteEvaluacionPostulante) {
    this.ngZone.runOutsideAngular(() => {
      const { postulantesTemp, gridData, colorEvaluaciones } =
        this.buildPostulanteGridData(reporte);

      this.ngZone.run(() => {
        this.postulantesTemp = postulantesTemp;
        this.colorEvaluaciones = colorEvaluaciones;

        this.gridReportePostulante.data = gridData;
        this.gridReportePostulante.loading = false;
        this.loadingReportePostulante = false;
        this.showReportePostulante = true;

        this.cd.markForCheck();
      });
    });
  }

  private buildPostulanteGridData(
    reporte: ReporteEvaluacionPostulante
  ): {
    postulantesTemp: Postulante[];
    colorEvaluaciones: { evaluacion: string; color: string }[];
    gridData: ClaveValor[];
  } {
    if (!reporte?.postulantes?.length || !reporte?.datosEvaluacionAgrupado?.length) {
      return { postulantesTemp: [], colorEvaluaciones: [], gridData: [] };
    }

    // 1) clasificación NEO
    reporte.postulantes.forEach((x) => {
      const item = reporte.clasificacionNEO?.find((n) => n.idPostulante === x.idPostulante);
      const clasificacionNEO: ClasificacionNeo = {
        idProcesoSeleccion: item?.idProcesoSeleccion ?? 0,
        idPostulante: x.idPostulante,
        respuestaAlAzar: item?.respuestaAlAzar ?? false,
        aquiescenciaAq: item?.aquiescenciaAq ?? false,
        negacionesNe: item?.negacionesNe ?? false,
      };
      x.clasificacionNeo = clasificacionNEO;
    });

    const postulantesTemp = reporte.postulantes;

    // 2) juntar todoData
    const todoData: Proceso[] = [];
    for (const x of reporte.datosEvaluacionAgrupado) {
      if (x.proceso?.length) todoData.push(...x.proceso);
    }

    // 3) armar registroRP
    const registroRP: { [key: number]: ClaveValor } = {};

    todoData.forEach((x) => {
      const key = x.ordenReal;

      if (!registroRP[key]) {
        registroRP[key] = {
          categoria: x.categoria,
          etapa: x.etapa,
          evaluacion: x.evaluacion,
          ordenReal: x.ordenReal,
          grupo: x.grupo,
          examen: x.examen,
          calificaPorCentil: x.calificaPorCentil,
          calificaPorCentilText: x.calificaPorCentil ? 'Centil' : 'Directo',
          notaAprobatoria: x.notaAprobatoria,
          simbolo: x.simbolo,
          aplicaAcceso: x.configuracionComponenteCurso,
          idExamen: x.idExamen,
        };
      }

      registroRP[key][`postulante_${x.idPostulante}`] = x.registro;
      registroRP[key][`estado_${x.idPostulante}`] = x.esAprobado;
      registroRP[key][`estadoAcceso_${x.idPostulante}`] = x.estadoAcceso;
      registroRP[key][`cantidadConfigurado_${x.idPostulante}`] = x.cantidadConfigurado;
      registroRP[key][`cantidadResuelto_${x.idPostulante}`] = x.cantidadResuelto;
      registroRP[key][`puntajeCurso_${x.idPostulante}`] = x.puntajeCurso;
      registroRP[key][`aplicaAcceso_${x.idPostulante}`] = x.configuracionComponenteCurso;

      if (x.examenCentilVersion?.length) {
        x.examenCentilVersion.forEach((centil) => {
          registroRP[key][`postulante_${x.idPostulante}_Centil_${centil.version}`] = centil.registro;
          registroRP[key][`estado_${x.idPostulante}_Centil_${centil.version}`] = centil.esAprobado;
          registroRP[key][`notaAprobatoria_${x.idPostulante}_Centil_${centil.version}`] =
            centil.notaAprobatoria;
          registroRP[key][`simbolo_${x.idPostulante}_Centil_${centil.version}`] = centil.simbolo;
        });
      } else {
        this.comboVersionCentil.forEach((centil) => {
          registroRP[key][`postulante_${x.idPostulante}_Centil_${centil.clave}`] = x.registro;
          registroRP[key][`estado_${x.idPostulante}_Centil_${centil.clave}`] = x.esAprobado;
          registroRP[key][`notaAprobatoria_${x.idPostulante}_Centil_${centil.clave}`] =
            x.notaAprobatoria;
          registroRP[key][`simbolo_${x.idPostulante}_Centil_${centil.clave}`] = x.simbolo;
        });
      }
    });

    const gridData = Object.values(registroRP) as ClaveValor[];

    // 4) colores
    const evaluaciones = gridData.map((x) => (x['evaluacion'] as string) ?? '');
    const colores = ['color1', 'color2', 'color3', 'color4', 'color5', 'color6', 'color7', 'color8'];
    const evaluacionesUnicas = [...new Set(evaluaciones)].filter((x) => !!x);

    const colorEvaluaciones: { evaluacion: string; color: string }[] = [];
    let contadorColor = 0;

    for (const ev of evaluacionesUnicas) {
      if (contadorColor > 7) contadorColor = 0;
      colorEvaluaciones.push({ evaluacion: ev, color: colores[contadorColor] });
      contadorColor++;
    }

    return { postulantesTemp, colorEvaluaciones, gridData };
  }

  // ---------------- GRID ETAPAS ----------------

  generarGridEtapas(etapasAprobadas: EtapaAprobada[]) {
    this.ngZone.runOutsideAngular(() => {
      const { etapasOrdenadas, gridData } = this.buildEtapasData(etapasAprobadas);

      this.ngZone.run(() => {
        this.etapasAprobadas = etapasOrdenadas;
        this.gridEtapaProcesoSeleccion.data = gridData;

        this.gridEtapaProcesoSeleccion.loading = false;
        this.loadingReporteEtapaProceso = false;
        this.showReporteEtapaProceso = true;

        this.cd.markForCheck();
      });
    });
  }

  private buildEtapasData(etapasAprobadas: EtapaAprobada[]): {
    etapasOrdenadas: EtapaAprobada[];
    gridData: ClaveValor[];
  } {
    const etapasOrdenadas = [...(etapasAprobadas ?? [])].sort((a, b) =>
      a.postulante < b.postulante ? -1 : a.postulante > b.postulante ? 1 : 0
    );

    const registroEtapas: { [key: number]: ClaveValor } = {};

    etapasOrdenadas.forEach((x) => {
      x.etapas.forEach((e) => {
        const key = e.idEtapa;

        if (!registroEtapas[key]) {
          registroEtapas[key] = {
            idProcesoSeleccion: e.idProcesoSeleccion,
            procesoSeleccion: e.procesoSeleccion,
            idEtapa: e.idEtapa,
            etapa: e.etapa,
            nroOrden: e.nroOrden,
            esCalificadoPorPostulante: e.esCalificadoPorPostulante,
          };
        }

        registroEtapas[key][`idEstadoEtapaProceso_${x.idPostulante}`] = e.idEstadoEtapaProceso;
        registroEtapas[key][`estadoEtapaProceso_${x.idPostulante}`] = this.getNombreEstadoEtapaProceso(
          e.idEstadoEtapaProceso
        );
        registroEtapas[key][`etapaContactado_${x.idPostulante}`] = e.etapaContactado;
        registroEtapas[key][`etapaContactadoText_${x.idPostulante}`] =
          e.etapaContactado === true ? 'SI' : 'NO';
      });
    });

    const gridData = Object.values(registroEtapas) as ClaveValor[];
    return { etapasOrdenadas, gridData };
  }

  // ---------------- REPORTE CURSO / NOTAS ----------------

  private obtenerNotasMatriculaReporte(idsPostulantes: number[]) {
    this.gridCursoAsesorCapacitacion.loading = true;
    this.loadingReporteAsesorCapacitacion = true;
    this.cd.markForCheck();

    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteObtenerNotasMatriculaReporte,
        JSON.stringify(idsPostulantes)
      )
      .subscribe({
        next: (resp: HttpResponse<ReportePostulanteMatricula[]>) => {
          this.showReporteAsesorCapacitacion = true;
          this.loadingReporteAsesorCapacitacion = false;
          this.gridCursoAsesorCapacitacion.loading = false;
          this.gridCursoAsesorCapacitacion.data = resp.body;

          this.cd.markForCheck();
        },
        error: (error) => {
          this.showReporteAsesorCapacitacion = false;
          this.loadingReporteAsesorCapacitacion = false;
          this.gridCursoAsesorCapacitacion.loading = false;

          this.cd.markForCheck();

          const resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener las notas de matricula!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  confirmarReestablecerEnviar(dataItem: ReportePostulanteMatricula) {
    this.alertaService
      .swalFireOptions({
        title: `¿Desea restablecer la nota para volver a dar?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Confirmar!',
        cancelButtonText: '¡No, Cancelar!',
        allowOutsideClick: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.restablecerNotas(dataItem);
        }
      });
  }

  private restablecerNotas(dataItem: ReportePostulanteMatricula) {
    const jsonEnvio = {
      idPostulante: dataItem.idPostulante,
      IdProgramaGeneral: dataItem.programaGeneral,
    };

    this.gridCursoAsesorCapacitacion.loading = true;
    this.cd.markForCheck();

    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteRestablecerNotas,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: () => {
          this.gridCursoAsesorCapacitacion.loading = false;
          this.cd.markForCheck();

          this.alertaService.swalFireOptions({
            icon: 'success',
            title: '¡Se reestablecieron las notas exitosamente!',
          });
        },
        error: (error) => {
          this.gridCursoAsesorCapacitacion.loading = false;
          this.cd.markForCheck();

          const resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al reestablecer las notas!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  enviarAccesoTemporal(dataItem: ClaveValor, idPostulante: number): void {
    const idExamen = dataItem['idExamen'] as number;
    const idProcesoSeleccion = dataItem['idProcesoSeleccion'] as number;

    console.log('enviarAccesoTemporal()', {
      dataItem,
      idPostulante,
      idExamen,
      idProcesoSeleccion,
    });
  }
}

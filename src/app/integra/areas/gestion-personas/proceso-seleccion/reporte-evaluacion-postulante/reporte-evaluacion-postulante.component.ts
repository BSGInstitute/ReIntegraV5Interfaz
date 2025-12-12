import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { constApiGestionPersonal } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import {
  ComboModulo,
  ProcesoSeleccionEtapa,
  ReporteEvaluacionPostulante,
  EtapaAprobada,
  EvaluacionesAsignadasEvaluador,
  PreguntaTestAgrupado,
  FiltroReporte,
  Postulante,
  Proceso,
  ClasificacionNeo,
  RespuestaEvaluacionEvaluador,
  RespuestaDetalle,
  ReportePostulanteMatricula,
  EvaluacionPortalPostulante,
  InformacionPostulanteDTO,
} from '@gestionPersonas/models/reporte-evaluacion-postulante';
import { IClaveValor, IComboBase1 } from '@shared/models/interfaces/iglobal';
import { FormBuilder, FormControl } from '@angular/forms';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { AlertaService } from '@shared/services/alerta.service';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { SortDescriptor } from '@progress/kendo-data-query';
import { RowClassArgs } from '@progress/kendo-angular-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { retry } from 'rxjs';

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

/**
 * @module GestionPersonasModule
 * @description Componente de Reporte de Evaluacion de Postulantes
 * @author Flavio Rodrigo Mamani Fabian
 * @version 1.0.1
 * @history
 * * 13/06/2024 Implementacion de modulo
 */
@Component({
  selector: 'app-reporte-evaluacion-postulante',
  templateUrl: './reporte-evaluacion-postulante.component.html',
  styleUrls: ['./reporte-evaluacion-postulante.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteEvaluacionPostulanteComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal
  ) {}

  @ViewChild('modalTest') modalTest: any;
  @ViewChild('modalCalificarExamenAsignado')
  modalCalificarExamenAsignado: any;

  // Nuevo modal de información
  @ViewChild('modalInformacionPostulante')
  modalInformacionPostulante: any;

  gridEtapaProcesoSeleccion = new KendoGrid<ClaveValor>();
  gridReportePostulante = new KendoGrid<ClaveValor>();
  gridCursoAsesorCapacitacion = new KendoGrid<any>();

  modalRef: NgbModalRef;

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

  versionCentilTemp: string = null;
  etapasAprobadas: EtapaAprobada[] = [];
  postulantesTemp: Postulante[] = [];

  sortPostulante: SortDescriptor[] = [
    {
      field: 'ordenReal',
      dir: 'asc',
    },
  ];
  sortEtapa: SortDescriptor[] = [
    {
      field: 'procesoSeleccion',
      dir: 'asc',
    },
    {
      field: 'nroOrden',
      dir: 'asc',
    },
  ];
  groupPostulante = [{ field: 'categoria' }];
  showReportePostulante = false;
  showReporteEtapaProceso = false;
  showReporteAsesorCapacitacion = false;

  loadingReporteEtapaProceso = false;
  loadingReportePostulante = false;
  loadingReporteAsesorCapacitacion = false;

  enProcesoGuardarRespuesta: boolean = false;
  fcEstadoEvaluacion = new FormControl(null);
  fcEstadoEtapa = new FormControl(null);

  filtroReporteTemporal: FiltroReporte = null;

  btnBuscarDisabled: boolean = false;
  colorEvaluaciones: { evaluacion: string; color: string }[] = [];
  idEtapaTemp: number = null;
  idProcesoSeleccionTemp: number = null;
  idEstadoEtapaProcesoTemp: number = null;
  idPostulanteTemp: number = null;

  // DATA DEL MODAL DE INFORMACIÓN
  informacionPostulanteData: InformacionPostulanteDTO | null = null;
  loadingInformacionPostulante = false;
  activeInfoTab: 'cv' | 'equipo' = 'cv';

  dataItemEtapaProcesoSeleccion: ClaveValor = null;
  preguntaTestAgrupadoTemp: PreguntaTestAgrupado;
  evaluacionTemp: EvaluacionesAsignadasEvaluador;

  showTiempo: boolean = false;
  showBtnEnviarRespuesta: boolean = false;
  showBtnActualizarRespuesta: boolean = false;

  ngOnInit(): void {
    this.obtenerCombosModulo();
  }

  get fechaActual(): Date {
    return new Date();
  }

  /**
   * Filtro por servidor postulante
   * @param event Cadena string nombre postulante
   */
  onFilterChangePostulante(event: string) {
    if (event != null && event.length >= 3) {
      let jsonEnvio = {
        valor: event,
      };
      this.integraService
        .postJsonResponse(
          constApiGestionPersonal.PostulanteObtenerPostulanteFiltroAutocomplete,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<IComboBase1[]>) => {
            this.comboPostulante = resp.body;
          },
          error: () => {
            this.comboPostulante = [];
          },
        });
    } else {
      this.comboPostulante = [];
    }
  }

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
  }

  valueChangeProcesoSeleccion(event: number) {
    this.comboEtapaProceso = this._sourceEtapaProceso.filter(
      (x) => x.idProcesoSeleccion == event
    );
  }

  /**
   * Obtiene los combos utilizados en el modulo
   */
  private obtenerCombosModulo() {
    this.integraService
      .getJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteObtenerCombosModulo
      )
      .subscribe({
        next: (resp: HttpResponse<ComboModulo>) => {
          this.comboProcesoSeleccion = resp.body.procesosDeSeleccion;
          this._sourceEtapaProceso = resp.body.procesoSeleccionEtapas;
          this.comboEstadoEtapa = resp.body.estadoEtapas;
          this.comboGrupoComparacion = resp.body.gruposComparacion;
          this.comboVersionCentil = resp.body.versionesCentil.map((x) => {
            let item: IClaveValor = {
              clave: x.valor,
              valor: `Versión ${x.valor}`,
            };
            return item;
          });
        },
        error: (error) => {
          let resp = this.alertaService.getErrorResponse(error);
          this.alertaService.notificationWarning(
            `${resp.titulo}: ${resp.mensaje}`
          );
        },
      });
  }

  /**
   * Genera el reporte general
   */
  generarReporte() {
    let formFiltro = this.formFiltro.getRawValue() as FormFiltro;

    if (
      formFiltro.filtroPorPostulante == true &&
      formFiltro.postulantes.length == 0
    ) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Seleccione al menos un postulante!',
      });
      return;
    }
    if (
      formFiltro.filtroPorPostulante == false &&
      formFiltro.procesoSeleccion == null
    ) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Seleccione un Proceso de Selección!',
      });
      return;
    }

    let jsonEnvio: FiltroReporte = {
      idsPostulantes: formFiltro.postulantes ?? [],
      idProcesoSeleccion: formFiltro.procesoSeleccion,
      idGrupoComparacion: formFiltro.grupoComparacion,
      idsProcesoEtapa: formFiltro.etapasProceso ?? [],
      idsEstadoEtapa: formFiltro.estadoEtapas ?? [],
      filtroPorPostulante: formFiltro.filtroPorPostulante,
    };

    this.versionCentilTemp = formFiltro.versionCentil;

    if (formFiltro.fechaInicio != null) {
      jsonEnvio.fechaInicio =
        datePipeTransform(formFiltro.fechaInicio, 'yyyy-MM-dd') + 'T00:00:00';
    }
    if (formFiltro.fechaFin != null) {
      jsonEnvio.fechaFin =
        datePipeTransform(formFiltro.fechaFin, 'yyyy-MM-dd') + 'T23:59:59';
    }

    this.gridEtapaProcesoSeleccion.data = [];
    this.gridReportePostulante.data = [];
    this.gridCursoAsesorCapacitacion.data = [];

    this.etapasAprobadas = [];
    this.postulantesTemp = [];

    this.showReporteEtapaProceso = false;
    this.showReportePostulante = false;
    this.showReporteAsesorCapacitacion = false;

    // Activar loaders
    this.loadingReporteEtapaProceso = true;
    this.loadingReportePostulante = true;
    this.loadingReporteAsesorCapacitacion = true;

    this.gridEtapaProcesoSeleccion.loading = true;
    this.gridReportePostulante.loading = true;
    this.gridCursoAsesorCapacitacion.loading = true;

    this.filtroReporteTemporal = jsonEnvio;
    this.gridReportePostulante.data = [];
    this.btnBuscarDisabled = true;

    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteGenerarReporte,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<ReporteEvaluacionPostulante>) => {
          this.btnBuscarDisabled = false;

          // Etapas (ya se deja de cargar)
          this.generarGridEtapas(resp.body.etapaAprobada);

          // Reporte postulante (queda cargando hasta unir datos portal)
          this.obtenerEvaluacionesPortalPostulante(jsonEnvio, resp.body);

          // Curso asesor capacitación
          const idsMatricula = resp.body.matriculaPostulantes
            .filter((s) => s.valor != null && s.valor != 0)
            .map((x) => x.id);

          if (idsMatricula.length > 0) {
            this.obtenerNotasMatriculaReporte(idsMatricula);
          } else {
            this.loadingReporteAsesorCapacitacion = false;
            this.gridCursoAsesorCapacitacion.loading = false;
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

          let resp = this.alertaService.getErrorResponse(error);
          if (error.status == 409) {
            this.alertaService.swalFireOptions({
              icon: 'success',
              title: `${resp.mensaje}`,
            });
          } else {
            this.alertaService.notificationInfo(
              `${resp.titulo}: ${resp.mensaje}`
            );
          }
        },
      });
  }

  /**
   * Genera el reporte de etapas (solo etapas)
   */
  private generarReporteIntegra() {
    let jsonEnvio = this.filtroReporteTemporal;
    this.gridEtapaProcesoSeleccion.loading = true;
    this.loadingReporteEtapaProceso = true;

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
          let resp = this.alertaService.getErrorResponse(error);
          if (error.status == 409) {
            this.alertaService.swalFireOptions({
              icon: 'success',
              title: `${resp.mensaje}`,
            });
          } else {
            this.alertaService.notificationInfo(
              `${resp.titulo}: ${resp.mensaje}`
            );
          }
        },
      });
  }

  obtenerEvaluacionesPortalPostulante(
    jsonEnvio: FiltroReporte,
    reporte: ReporteEvaluacionPostulante
  ) {
    this.gridReportePostulante.loading = true;
    this.loadingReportePostulante = true;

    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteObtenerEvaluacionesPortalPostulante,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<EvaluacionPortalPostulante[]>) => {
          resp.body.forEach((epp) => {
            reporte.datosEvaluacionAgrupado.forEach((dato) => {
              let item = dato.proceso.find(
                (x) =>
                  x.idExamen == epp.idExamen &&
                  x.idPostulante == epp.idPostulante
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
          let resp = this.alertaService.getErrorResponse(error);
          this.alertaService.notificationWarning(`${resp.mensaje}`);
        },
      });
  }

  generarGridGmatPma(reporte: ReporteEvaluacionPostulante) {
    if (
      !reporte ||
      !reporte.postulantes ||
      reporte.postulantes.length === 0 ||
      !reporte.datosEvaluacionAgrupado ||
      reporte.datosEvaluacionAgrupado.length === 0
    ) {
      this.postulantesTemp = [];
      this.gridReportePostulante.data = [];
      this.loadingReportePostulante = false;
      this.gridReportePostulante.loading = false;
      this.showReportePostulante = false;

      this.alertaService.notificationInfo(
        'No se encontraron resultados para el reporte de postulantes.'
      );

      return;
    }

    // Clasificación NEO
    reporte.postulantes.forEach((x) => {
      let clasificacionNEO: ClasificacionNeo = {
        idProcesoSeleccion: 0,
        idPostulante: x.idPostulante,
        respuestaAlAzar: false,
        aquiescenciaAq: false,
        negacionesNe: false,
      };
      let item = reporte.clasificacionNEO.find(
        (n) => n.idPostulante == x.idPostulante
      );
      if (item) {
        clasificacionNEO.idProcesoSeleccion = item.idProcesoSeleccion;
        clasificacionNEO.idPostulante = item.idPostulante;
        clasificacionNEO.aquiescenciaAq = item.aquiescenciaAq;
        clasificacionNEO.negacionesNe = item.negacionesNe;
        clasificacionNEO.respuestaAlAzar = item.respuestaAlAzar;
      }
      x.clasificacionNeo = clasificacionNEO;
    });

    this.postulantesTemp = reporte.postulantes;

    // Unificamos todos los procesos
    const todoData: Proceso[] = [];
    for (const x of reporte.datosEvaluacionAgrupado) {
      if (x.proceso && x.proceso.length) {
        todoData.push(...x.proceso);
      }
    }

    let registroRP: {
      [key: number]: ClaveValor;
    } = {};

    todoData.forEach((x) => {
      let key = x.ordenReal;
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
      registroRP[key][`cantidadConfigurado_${x.idPostulante}`] =
        x.cantidadConfigurado;
      registroRP[key][`cantidadResuelto_${x.idPostulante}`] =
        x.cantidadResuelto;
      registroRP[key][`puntajeCurso_${x.idPostulante}`] = x.puntajeCurso;
      registroRP[key][`aplicaAcceso_${x.idPostulante}`] =
        x.configuracionComponenteCurso;

      if (x.examenCentilVersion != null && x.examenCentilVersion.length > 0) {
        x.examenCentilVersion.forEach((centil) => {
          registroRP[key][
            `postulante_${x.idPostulante}_Centil_${centil.version}`
          ] = centil.registro;
          registroRP[key][`estado_${x.idPostulante}_Centil_${centil.version}`] =
            centil.esAprobado;
          registroRP[key][
            `notaAprobatoria_${x.idPostulante}_Centil_${centil.version}`
          ] = centil.notaAprobatoria;
          registroRP[key][
            `simbolo_${x.idPostulante}_Centil_${centil.version}`
          ] = centil.simbolo;
        });
      } else {
        this.comboVersionCentil.forEach((centil) => {
          registroRP[key][
            `postulante_${x.idPostulante}_Centil_${centil.clave}`
          ] = x.registro;
          registroRP[key][`estado_${x.idPostulante}_Centil_${centil.clave}`] =
            x.esAprobado;
          registroRP[key][
            `notaAprobatoria_${x.idPostulante}_Centil_${centil.clave}`
          ] = x.notaAprobatoria;
          registroRP[key][`simbolo_${x.idPostulante}_Centil_${centil.clave}`] =
            x.simbolo;
        });
      }
    });

    const datosFinal = Object.values(registroRP) as ClaveValor[];

    let evaluaciones = datosFinal.map((x) => x['evaluacion']);
    let colores = [
      'color1',
      'color2',
      'color3',
      'color4',
      'color5',
      'color6',
      'color7',
      'color8',
    ];
    let evaluacionesUnicas = [...new Set(evaluaciones)];
    let contadorColor = 0;
    this.colorEvaluaciones = [];
    for (let index = 0; index < evaluacionesUnicas.length; index++) {
      if (contadorColor > 7) {
        contadorColor = 0;
      }
      let item = {
        evaluacion: evaluacionesUnicas[index] as string,
        color: colores[contadorColor],
      };
      contadorColor++;
      this.colorEvaluaciones.push(item);
    }

    this.gridReportePostulante.data = [...datosFinal];
    this.gridReportePostulante.loading = false;
    this.loadingReportePostulante = false;
    this.showReportePostulante = true;
  }

  /**
   * Template columna Recuperación
   */
  templateRecuperacionPostulante(dataItem: ClaveValor, idPostulante: number) {
    let cantidadConfigurado: number = dataItem[
      `cantidadConfigurado_${idPostulante}`
    ] as number;
    let cantidadResuelto: number = dataItem[
      `cantidadResuelto_${idPostulante}`
    ] as number;

    let puntajeCurso = Number(dataItem[`puntajeCurso_${idPostulante}`]);
    let notaAprobatoria = Number(dataItem[`notaAprobatoria`]);
    let simbolo = dataItem['simbolo'] as string;

    if (cantidadConfigurado != null && cantidadResuelto != null) {
      if (cantidadConfigurado <= cantidadResuelto) {
        if (
          this.evaluarCaso(
            simbolo,
            Number(puntajeCurso),
            Number(notaAprobatoria)
          )
        ) {
          return `${puntajeCurso}%`;
        } else {
          return `${puntajeCurso}%`;
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  }

  /**
   * Template para la grilla etapa estado postulante
   */
  templateEstadoPostulante(
    dataItem: ClaveValor,
    idPostulante: number,
    versionCentil: string
  ) {
    let cantidadConfigurado: number = dataItem[
      `cantidadConfigurado_${idPostulante}`
    ] as number;
    let cantidadResuelto: number = dataItem[
      `cantidadResuelto_${idPostulante}`
    ] as number;

    let puntajeCurso = Number(dataItem[`puntajeCurso_${idPostulante}`]);
    let notaAprobatoria = dataItem[
      `notaAprobatoria_${idPostulante}_Centil_${versionCentil}`
    ] as string;

    let estado = dataItem[
      `estado_${idPostulante}_Centil_${versionCentil}`
    ] as boolean;

    let simbolo = dataItem['simbolo'] as string;
    if (estado && notaAprobatoria != `N.A`) {
      return `Aprobado`;
    } else {
      if (cantidadConfigurado != null && cantidadResuelto != null) {
        if (
          this.evaluarCaso(
            simbolo,
            Number(puntajeCurso),
            Number(notaAprobatoria)
          )
        ) {
          return `Aprobado`;
        } else {
          return `Desaprobado`;
        }
      } else {
        if (estado != true && notaAprobatoria != `N.A`) {
          return `Desaprobado`;
        } else {
          return `N.A`;
        }
      }
    }
  }

  /**
   * Evalua caso de simbolo
   */
  evaluarCaso(simbolo: string, puntajeCurso: number, notaAprobatoria: number) {
    let resultado = false;
    switch (simbolo) {
      case '<':
        resultado = puntajeCurso < notaAprobatoria;
        break;
      case '>':
        resultado = puntajeCurso > notaAprobatoria;
        break;
      case '<=':
        resultado = puntajeCurso <= notaAprobatoria;
        break;
      case '>=':
        resultado = puntajeCurso >= notaAprobatoria;
        break;
      case '=':
        resultado = puntajeCurso == notaAprobatoria;
        break;
      case '==':
        resultado = puntajeCurso == notaAprobatoria;
        break;
      case '===':
        resultado = puntajeCurso === notaAprobatoria;
        break;
      case '<>':
        resultado = puntajeCurso != notaAprobatoria;
        break;
      case '!=':
        resultado = puntajeCurso != notaAprobatoria;
        break;
      case '!==':
        resultado = puntajeCurso != notaAprobatoria;
        break;
      default:
        break;
    }
    return resultado;
  }

  templateAccesoTemporalPostulante(dataItem: ClaveValor, idPostulante: number) {
    let notaAprobatoria = dataItem[`notaAprobatoria`] as string;
    let estado = dataItem[`estado_${idPostulante}`] as boolean;
    let aplicaAcceso = dataItem[`aplicaAcceso_${idPostulante}`];
    let estadoAcceso = dataItem[`estadoAcceso_${idPostulante}`];

    if (estado && notaAprobatoria != 'N.A') {
      return 0;
    } else {
      if (estado == false && notaAprobatoria != 'N.A') {
        if (aplicaAcceso != null) {
          if (estadoAcceso) {
            return 1;
          } else {
            return 2;
          }
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    }
  }

  enviarAccesoTemporal(dataItem: ClaveValor, idPostulante: number) {
    this.alertaService
      .swalFireOptions({
        title: `¿Está seguro de enviar el acceso temporal del curso seleccionado al postulante?`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar y Enviar',
        cancelButtonText: 'No, Cancelar',
        allowOutsideClick: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.enviarAccesoAulaVirtualPostulante(dataItem, idPostulante);
        }
      });
  }

  enviarAccesoAulaVirtualPostulante(
    dataItem: ClaveValor,
    idPostulante: number
  ) {
    let jsonEnvio = {
      idPostulante: idPostulante,
      idExamen: dataItem['idExamen'],
      idPlantilla: 1391,
    };
    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteEnviarAccesoAulaVirtualPostulante,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: () => {},
        error: () => {},
      });
  }

  /**
   * Genera la data para el grid de etapas
   */
  generarGridEtapas(etapasAprobadas: EtapaAprobada[]) {
    etapasAprobadas = etapasAprobadas.sort((a, b) => {
      if (a.postulante < b.postulante) return -1;
      if (a.postulante > b.postulante) return 1;
      return 0;
    });
    let registroEtapas: {
      [key: number]: ClaveValor;
    } = {};

    etapasAprobadas.forEach((x) => {
      x.etapas.forEach((e) => {
        let key = e.idEtapa;
        if (!registroEtapas[key]) {
          registroEtapas[key] = {
            idProcesoSeleccion: e.idProcesoSeleccion,
            procesoSeleccion: e.procesoSeleccion,
            idEtapa: e.idEtapa,
            etapa: e.etapa,
            nroOrden: e.nroOrden,
            esCalificadoPorPostulante: e.esCalificadoPorPostulante,
          };
          registroEtapas[key][`idEstadoEtapaProceso_${x.idPostulante}`] =
            e.idEstadoEtapaProceso;
          registroEtapas[key][`estadoEtapaProceso_${x.idPostulante}`] =
            this.getNombreEstadoEtapaProceso(e.idEstadoEtapaProceso);
          registroEtapas[key][`etapaContactado_${x.idPostulante}`] =
            e.etapaContactado;
          registroEtapas[key][`etapaContactadoText_${x.idPostulante}`] =
            e.etapaContactado == true ? 'SI' : 'NO';
        } else {
          registroEtapas[key][`idEstadoEtapaProceso_${x.idPostulante}`] =
            e.idEstadoEtapaProceso;
          registroEtapas[key][`estadoEtapaProceso_${x.idPostulante}`] =
            this.getNombreEstadoEtapaProceso(e.idEstadoEtapaProceso);
          registroEtapas[key][`etapaContactado_${x.idPostulante}`] =
            e.etapaContactado;
          registroEtapas[key][`etapaContactadoText_${x.idPostulante}`] =
            e.etapaContactado == true ? 'SI' : 'NO';
        }
      });
    });

    let registroEtapasFinal: ClaveValor[] = [];
    for (const key in registroEtapas) {
      const item = registroEtapas[key];
      registroEtapasFinal.push(item);
    }
    this.etapasAprobadas = etapasAprobadas;
    this.gridEtapaProcesoSeleccion.data = registroEtapasFinal;

    this.gridEtapaProcesoSeleccion.loading = false;
    this.loadingReporteEtapaProceso = false;
    this.showReporteEtapaProceso = true;
  }

  /**
   * Obtiene el nombre del estado etapa proceso
   */
  getNombreEstadoEtapaProceso(idEstadoEtapa: number) {
    if (idEstadoEtapa != null && idEstadoEtapa != 0) {
      let item = this.comboEstadoEtapa.find((x) => x.id === idEstadoEtapa);
      if (item != null) {
        return item.nombre;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  /**
   * Valida el tipo de evaluacion
   */
  funcionModalTipoEvaluacion(idPostulante: number, dataItem: ClaveValor) {
    this.enProcesoGuardarRespuesta = false;

    let idEtapa = dataItem['idEtapa'] as number;
    let idProcesoSeleccion = dataItem['idProcesoSeleccion'] as number;
    let idEstadoEtapaProceso = dataItem[
      `idEstadoEtapaProceso_${idPostulante}`
    ] as number;

    this.dataItemEtapaProcesoSeleccion = dataItem;
    this.idEtapaTemp = idEtapa;
    this.idProcesoSeleccionTemp = idProcesoSeleccion;
    this.idEstadoEtapaProcesoTemp = idEstadoEtapaProceso;

    this.idPostulanteTemp = idPostulante;

    let filtro = {
      idPostulante: idPostulante,
      idEtapa: idEtapa,
      idProcesoSeleccion: idProcesoSeleccion,
    };
    this.gridEtapaProcesoSeleccion.loading = true;
    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteObtenerTipoExamen,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (
          resp: HttpResponse<{ tipoEvaluacion: number; idEvaluacion: number }>
        ) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          if (resp.body.tipoEvaluacion == 1) {
            this.fcEstadoEtapa.setValue(idEstadoEtapaProceso);
            this.modalRef = this.modalService.open(
              this.modalCalificarExamenAsignado,
              {
                size: 'sm',
                backdrop: 'static',
              }
            );
          } else if (resp.body.tipoEvaluacion == 2) {
            this.fcEstadoEvaluacion.setValue(idEstadoEtapaProceso);
            this.obtenerEvaluacionesAsignadasEvaluador(resp.body);
          }
        },
        error: (error) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          let resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener el tipo evaluación!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  /**
   * Obtener evaluaciones asignadas evaluador
   */
  obtenerEvaluacionesAsignadasEvaluador(tipoExamen: {
    tipoEvaluacion: number;
    idEvaluacion: number;
  }) {
    this.gridEtapaProcesoSeleccion.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiGestionPersonal.EvaluacionPostulanteObtenerEvaluacionesAsignadasEvaluador}/${this.idPostulanteTemp}/${this.idProcesoSeleccionTemp}`,
        null
      )
      .subscribe({
        next: (resp: HttpResponse<EvaluacionesAsignadasEvaluador[]>) => {
          let evaluacion = resp.body.find(
            (x) => x.idEvaluacion == tipoExamen.idEvaluacion
          );
          this.gridEtapaProcesoSeleccion.loading = false;
          if (!evaluacion) {
            this.evaluacionTemp = null;
            this.alertaService.swalFireOptions({
              icon: 'info',
              text: 'No se encontró examen configurado',
            });
          } else {
            this.evaluacionTemp = evaluacion;
            if (evaluacion.estadoExamen) {
              this.showBtnEnviarRespuesta = false;
              this.showBtnActualizarRespuesta = true;
              this.obtenerPreguntasRespuestasRealizadasTestEvaluador(
                evaluacion
              );
            } else {
              this.showBtnEnviarRespuesta = true;
              this.showBtnActualizarRespuesta = false;
              this.obtenerPreguntasRespuestasTestEvaluador(evaluacion);
            }
          }
        },
        error: (error) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          let resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener el tipo evaluación!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  /**
   * Obtiene preguntas respuestas realizadas test evaluador
   */
  obtenerPreguntasRespuestasRealizadasTestEvaluador(
    evaluacion: EvaluacionesAsignadasEvaluador
  ) {
    let filtro: {
      idProcesoSeleccion: number;
      idPostulante: number;
      idTest: number;
      mostrarEvaluacionAgrupado: boolean;
      mostrarEvaluacionPorGrupo: boolean;
      mostrarEvaluacionPorComponente: boolean;
    } = {
      idProcesoSeleccion: evaluacion.idProcesoSeleccion,
      idPostulante: evaluacion.idPostulante,
      idTest: evaluacion.idExamen,
      mostrarEvaluacionAgrupado: evaluacion.mostrarEvaluacionAgrupado,
      mostrarEvaluacionPorGrupo: evaluacion.mostrarEvaluacionPorGrupo,
      mostrarEvaluacionPorComponente: evaluacion.mostrarEvaluacionPorComponente,
    };
    this.gridEtapaProcesoSeleccion.loading = true;
    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteObtenerPreguntasRespuestasRealizadasTestEvaluador,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<PreguntaTestAgrupado>) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          resp.body.listaPreguntas.forEach((pregunta) => {
            if (pregunta.idPreguntaTipo == 5) {
              pregunta.fcPregunta5 = new FormControl({
                value: pregunta.listaRespuestasRealizada[0].idRespuestaPregunta,
                disabled: true,
              });
            }
            if (pregunta.idPreguntaTipo == 4) {
              pregunta.fcPregunta4 = new FormControl({
                value: pregunta.listaRespuestasRealizada.map(
                  (x) => x.idRespuestaPregunta
                ),
                disabled: true,
              });
            }
            pregunta.listaRespuestas.forEach((respuesta) => {
              let existeRespuesta = pregunta.listaRespuestasRealizada.find(
                (rp) => rp.idRespuestaPregunta == respuesta.idRespuesta
              );
              if (existeRespuesta) {
                if (pregunta.idPreguntaTipo == 10) {
                  respuesta.fcRespuesta10 = new FormControl({
                    value: existeRespuesta.textoRespuesta,
                    disabled: true,
                  });
                }
                if (pregunta.idPreguntaTipo == 6) {
                  if (pregunta.enunciadoPregunta == '75 Registros') {
                  } else {
                    if (pregunta.idExamen == 93) {
                      respuesta.fcRespuesta93 = new FormControl({
                        value: existeRespuesta.textoRespuesta,
                        disabled: true,
                      });
                    } else {
                      respuesta.fcRespuesta = new FormControl({
                        value: existeRespuesta.textoRespuesta,
                        disabled: true,
                      });
                    }
                  }
                }
              }
            });
          });
          this.preguntaTestAgrupadoTemp = resp.body;
          this.modalRef = this.modalService.open(this.modalTest, {
            size: 'lg',
            backdrop: 'static',
          });
        },
        error: (error) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          let resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title:
              '¡Ocurrio un problema al obtener preguntas respuestas realizadas test evaluador!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  /**
   * Obtiene las preguntas respuesta test evaluador
   */
  private obtenerPreguntasRespuestasTestEvaluador(
    evaluacion: EvaluacionesAsignadasEvaluador
  ) {
    let filtro: {
      idProcesoSeleccion: number;
      idPostulante: number;
      idTest: number;
      mostrarEvaluacionAgrupado: boolean;
      mostrarEvaluacionPorGrupo: boolean;
      mostrarEvaluacionPorComponente: boolean;
    } = {
      idProcesoSeleccion: evaluacion.idProcesoSeleccion,
      idPostulante: evaluacion.idPostulante,
      idTest: evaluacion.idExamen,
      mostrarEvaluacionAgrupado: evaluacion.mostrarEvaluacionAgrupado,
      mostrarEvaluacionPorGrupo: evaluacion.mostrarEvaluacionPorGrupo,
      mostrarEvaluacionPorComponente: evaluacion.mostrarEvaluacionPorComponente,
    };
    this.gridEtapaProcesoSeleccion.loading = true;
    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteObtenerPreguntasRespuestasTestEvaluador,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<PreguntaTestAgrupado>) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          resp.body.listaPreguntas.forEach((pregunta) => {
            pregunta.fcPregunta5 = new FormControl(null);
            pregunta.fcPregunta4 = new FormControl([]);
            pregunta.listaRespuestas.forEach((respuesta) => {
              respuesta.fcRespuesta93 = new FormControl('');
              // respuesta.fcRespuesta75 = new FormControl('');
              respuesta.fcRespuesta = new FormControl('');
              respuesta.fcRespuesta10 = new FormControl('');
            });
          });
          this.preguntaTestAgrupadoTemp = resp.body;
          this.modalRef = this.modalService.open(this.modalTest, {
            size: 'lg',
            backdrop: 'static',
          });
        },
        error: (error) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          let resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title:
              '¡Ocurrio un problema al obtener preguntas respuestas test evaluador!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  /**
   * Colores row reporte postulante
   */
  rowCallback = (context: RowClassArgs) => {
    let styles: { [key: string]: boolean } = {};
    if (
      (context.dataItem.evaluacion != null &&
        context.dataItem.grupo != null &&
        context.dataItem.examen == null) ||
      (context.dataItem.evaluacion != null &&
        context.dataItem.grupo == null &&
        context.dataItem.examen == null)
    ) {
      styles['fw-bold'] = true;
    }
    let item = this.colorEvaluaciones.find(
      (x) => x.evaluacion == context.dataItem.evaluacion
    );
    if (item) {
      styles[item.color] = true;
    }
    return styles;
  };

  /**
   * Actualizacion de estado de etapa
   */
  actualizarEstadoEA() {
    if (this.fcEstadoEtapa.value == null || this.fcEstadoEtapa.value == 0) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Seleccione un estado de etapa!',
      });
      return;
    }
    let jsonEnvio: {
      idEstadoEA: number;
      idProcesoSeleccionEA: number;
      idProcesoSeleccionEtapaEA: number;
      idPostulanteEA: number;
    } = {
      idEstadoEA: this.fcEstadoEtapa.value,
      idProcesoSeleccionEA: this.idProcesoSeleccionTemp,
      idProcesoSeleccionEtapaEA: this.idEtapaTemp,
      idPostulanteEA: this.idPostulanteTemp,
    };
    this.gridEtapaProcesoSeleccion.loading = true;
    this.enProcesoGuardarRespuesta = true;
    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteActualizacionManualEtapaExamenAsignado,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: () => {
          this.gridEtapaProcesoSeleccion.loading = false;
          this.enProcesoGuardarRespuesta = false;
          this.modalRef.close();
          this.generarReporteIntegra();
        },
        error: (error) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          this.enProcesoGuardarRespuesta = false;
          let resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al reestablecer las notas!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  /**
   * Actualiza las respuestas
   */
  actualizarRespuestas() {
    let idEstadoEvaluacionEvaluador = this.fcEstadoEvaluacion.value as number;

    let jsonEnvio: RespuestaEvaluacionEvaluador = {
      listaRespuestasEvaluador: [],
      idEstadoEvaluacionEvaluador: idEstadoEvaluacionEvaluador,
      idProcesoSeleccionEvaluacionEvaluador: this.idProcesoSeleccionTemp,
      idExamenEvaluacionEvaluador: this.evaluacionTemp.idExamen,
      idPostulanteEvaluacionEvaluador: this.idPostulanteTemp,
    };

    this.gridEtapaProcesoSeleccion.loading = true;
    this.enProcesoGuardarRespuesta = true;

    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteEnviarRespuestasTest,
        JSON.stringify(jsonEnvio)
      )
      .pipe(
        retry(1)
      )
      .subscribe({
        next: () => {
          this.enProcesoGuardarRespuesta = false;
          this.gridEtapaProcesoSeleccion.loading = false;
          this.modalRef.close();
          this.generarReporteIntegra();
          this.alertaService.swalFireOptions({
            icon: 'success',
            title: 'Se registraron las respuestas correctamente',
          });
        },
        error: (error) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          this.enProcesoGuardarRespuesta = false;
          let resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrió un problema al registrar las respuestas!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  sendAnswers() {
    let idEstadoEvaluacionEvaluador = this.fcEstadoEvaluacion.value as number;
    let listaRespuestasEvaluador: RespuestaDetalle[] = [];

    this.preguntaTestAgrupadoTemp.listaPreguntas.forEach((pregunta) => {
      if (pregunta.idTipoRespuesta == 10) {
        pregunta.listaRespuestas.forEach((respuesta) => {
          let rpta = respuesta.fcRespuesta10.value;
          let item: RespuestaDetalle = {
            idExamen: pregunta.idExamen,
            idRespuesta: respuesta.idRespuesta,
            idPregunta: pregunta.idPregunta,
            idExamenAsignado: pregunta.idExamenAsignado,
            textoRespuesta: '',
            flag: false,
          };
          if (rpta == null || rpta.trim() == '') {
            if (
              idEstadoEvaluacionEvaluador != 3 &&
              idEstadoEvaluacionEvaluador != 4 &&
              idEstadoEvaluacionEvaluador != 9
            ) {
              this.alertaService.swalFireOptions({
                icon: 'info',
                title: '¡Tiene que responder todas las preguntas!',
              });
              return;
            } else {
              item.textoRespuesta = '';
              item.flag = false;
            }
          } else {
            item.textoRespuesta = rpta.trim();
            item.flag = true;
          }
          listaRespuestasEvaluador.push(item);
        });
      }

      if (pregunta.idTipoRespuesta == 6) {
        pregunta.listaRespuestas.forEach((respuesta) => {
          let rpta: string = null;

          if (pregunta.enunciadoPregunta == '75 Registros') {
          } else {
            if (pregunta.idExamen == 93) {
              rpta = respuesta.fcRespuesta93.value;
            } else {
              rpta = respuesta.fcRespuesta.value;
            }
            let item: RespuestaDetalle = {
              idExamen: pregunta.idExamen,
              idRespuesta: respuesta.idRespuesta,
              idPregunta: pregunta.idPregunta,
              idExamenAsignado: pregunta.idExamenAsignado,
              textoRespuesta: '',
              flag: false,
            };
            if (rpta == null || rpta.trim() == '') {
              if (
                idEstadoEvaluacionEvaluador != 3 &&
                idEstadoEvaluacionEvaluador != 4 &&
                idEstadoEvaluacionEvaluador != 9
              ) {
                this.alertaService.swalFireOptions({
                  icon: 'info',
                  title: '¡Tiene que responder todas las preguntas!',
                });
                return;
              } else {
                item.textoRespuesta = '';
                item.flag = false;
                listaRespuestasEvaluador.push(item);
              }
            } else {
              item.textoRespuesta = rpta;
              item.flag = true;
              listaRespuestasEvaluador.push(item);
            }
          }
        });
      }
      if (pregunta.idTipoRespuesta == 5) {
        let rpta = pregunta.fcPregunta5.value as number;
        if (rpta == null || rpta == 0) {
          if (
            idEstadoEvaluacionEvaluador != 3 &&
            idEstadoEvaluacionEvaluador != 4 &&
            idEstadoEvaluacionEvaluador != 9
          ) {
            this.alertaService.swalFireOptions({
              icon: 'info',
              title: '¡Tiene que responder todas las preguntas!',
            });
            return;
          } else {
            let item: RespuestaDetalle = {
              idExamen: pregunta.idExamen,
              idRespuesta: 0,
              idPregunta: pregunta.idPregunta,
              idExamenAsignado: pregunta.idExamenAsignado,
              textoRespuesta: '',
              flag: false,
            };
            listaRespuestasEvaluador.push(item);
          }
        } else {
          let item: RespuestaDetalle = {
            idExamen: pregunta.idExamen,
            idRespuesta: rpta,
            idPregunta: pregunta.idPregunta,
            idExamenAsignado: pregunta.idExamenAsignado,
            textoRespuesta: '',
            flag: true,
          };
          listaRespuestasEvaluador.push(item);
        }
      }
      if (pregunta.idTipoRespuesta == 4) {
        let rpta = pregunta.fcPregunta4.value as number[];
        if (rpta == null || rpta.length == 0) {
          if (
            idEstadoEvaluacionEvaluador != 3 &&
            idEstadoEvaluacionEvaluador != 4 &&
            idEstadoEvaluacionEvaluador != 9
          ) {
            this.alertaService.swalFireOptions({
              icon: 'info',
              title: '¡Tiene que responder todas las preguntas!',
            });
            return;
          } else {
            let item: RespuestaDetalle = {
              idExamen: pregunta.idExamen,
              idRespuesta: 0,
              idPregunta: pregunta.idPregunta,
              idExamenAsignado: pregunta.idExamenAsignado,
              textoRespuesta: '',
              flag: false,
            };
            listaRespuestasEvaluador.push(item);
          }
        } else {
          rpta.forEach((x) => {
            let item: RespuestaDetalle = {
              idExamen: pregunta.idExamen,
              idRespuesta: x,
              idPregunta: pregunta.idPregunta,
              idExamenAsignado: pregunta.idExamenAsignado,
              textoRespuesta: '',
              flag: true,
            };
            listaRespuestasEvaluador.push(item);
          });
        }
      }
    });

    let jsonEnvio: RespuestaEvaluacionEvaluador = {
      listaRespuestasEvaluador: listaRespuestasEvaluador,
      idEstadoEvaluacionEvaluador: idEstadoEvaluacionEvaluador,
      idProcesoSeleccionEvaluacionEvaluador: this.idProcesoSeleccionTemp,
      idExamenEvaluacionEvaluador: this.evaluacionTemp.idExamen,
      idPostulanteEvaluacionEvaluador: this.idPostulanteTemp,
    };
    this.gridEtapaProcesoSeleccion.loading = true;
    this.enProcesoGuardarRespuesta = true;
    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteEnviarRespuestasTest,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: () => {
          this.gridEtapaProcesoSeleccion.loading = false;
          this.enProcesoGuardarRespuesta = false;
          this.modalRef.close();
          this.generarReporteIntegra();
          this.alertaService.swalFireOptions({
            icon: 'success',
            title: 'Se registraron las respuestas correctamente',
          });
        },
        error: (error) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          this.enProcesoGuardarRespuesta = false;
          let resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al registrar las respuestas!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  private obtenerNotasMatriculaReporte(idsPostulantes: number[]) {
    this.gridCursoAsesorCapacitacion.loading = true;
    this.loadingReporteAsesorCapacitacion = true;
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
        },
        error: (error) => {
          this.showReporteAsesorCapacitacion = false;
          this.loadingReporteAsesorCapacitacion = false;

          this.gridCursoAsesorCapacitacion.loading = false;
          let resp = this.alertaService.getErrorResponse(error);
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
    let jsonEnvio = {
      idPostulante: dataItem.idPostulante,
      IdProgramaGeneral: dataItem.programaGeneral,
    };
    this.gridCursoAsesorCapacitacion.loading = true;
    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.EvaluacionPostulanteRestablecerNotas,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: () => {
          this.gridCursoAsesorCapacitacion.loading = false;
          this.alertaService.swalFireOptions({
            icon: 'success',
            title: '¡Se reestablecieron las notas exitosamente!',
          });
        },
        error: (error) => {
          this.gridCursoAsesorCapacitacion.loading = false;
          let resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al reestablecer las notas!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  getTiempoExperiencia(meses: number): string {
    if (!meses || meses <= 0) {
      return '-';
    }
    const anios = Math.floor(meses / 12);
    const restoMeses = meses % 12;
    const partes: string[] = [];
    if (anios > 0) {
      partes.push(`${anios} año${anios > 1 ? 's' : ''}`);
    }
    if (restoMeses > 0) {
      partes.push(`${restoMeses} mes${restoMeses > 1 ? 'es' : ''}`);
    }
    return partes.join(' ');
  }

  verInformacionPostulante(idPostulante: number) {
    this.activeInfoTab = 'cv';
    this.loadingInformacionPostulante = true;
    this.informacionPostulanteData = null;
    this.integraService
      .postJsonResponse(
        constApiGestionPersonal.PostulanteObtenerPostulantesInformacionV2,
        JSON.stringify(idPostulante)
      )
      .subscribe({
        next: (resp: HttpResponse<InformacionPostulanteDTO>) => {
          this.loadingInformacionPostulante = false;
          this.informacionPostulanteData = resp.body;

          this.modalRef = this.modalService.open(
            this.modalInformacionPostulante,
            {
              size: 'xl',
              backdrop: 'static',
              scrollable: true,
            }
          );
        },
        error: (error) => {
          this.loadingInformacionPostulante = false;
          const mensaje = this.alertaService.getMessageErrorService
            ? this.alertaService.getMessageErrorService(error)
            : this.alertaService.getErrorResponse(error).mensaje;

          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  trackByEtapa = (_: number, etapa: EtapaAprobada) => etapa.idPostulante;
  trackByPostulante = (_: number, p: Postulante) => p.idPostulante;
  trackByVersionCentil = (_: number, v: IClaveValor) => v.clave;
  trackByPregunta = (_: number, p: any) => p.idPregunta;
  trackByRespuesta = (_: number, r: any) => r.idRespuesta;
}

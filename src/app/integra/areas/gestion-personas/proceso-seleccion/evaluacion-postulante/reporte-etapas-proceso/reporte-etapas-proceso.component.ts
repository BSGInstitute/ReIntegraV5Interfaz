import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { SortDescriptor } from '@progress/kendo-data-query';
import { KendoGrid } from '@shared/models/kendo-grid';
import {
  EtapaAprobada,
  EvaluacionesAsignadasEvaluador,
  PreguntaTestAgrupado,
  RespuestaDetalle,
  RespuestaEvaluacionEvaluador,
  InformacionPostulanteDTO,
} from '@gestionPersonas/models/reporte-evaluacion-postulante';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { constApiGestionPersonal } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '@shared/services/alerta.service';
import { retry } from 'rxjs';

interface ClaveValor {
  [key: string]: string | number | boolean;
}

@Component({
  selector: 'app-reporte-etapas-proceso',
  templateUrl: './reporte-etapas-proceso.component.html',
  styleUrls: ['./reporte-etapas-proceso.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ReporteEtapasProcesoComponent {
  @Input() gridEtapaProcesoSeleccion: KendoGrid<ClaveValor>;
  @Input() etapasAprobadas: EtapaAprobada[] = [];
  @Input() sortEtapa: SortDescriptor[] = [];
  @Input() showReporteEtapaProceso = false;
  @Input() loadingReporteEtapaProceso = false;
  @Input() comboEstadoEtapa: IComboBase1[] = [];
  @Input() filterSettings: DropDownFilterSettings;

  // cuando el hijo termina de actualizar algo y quiere que el padre recargue
  @Output() refrescarEtapas = new EventEmitter<void>();

  // modales
  @ViewChild('modalTest') modalTest: any;
  @ViewChild('modalCalificarExamenAsignado')
  modalCalificarExamenAsignado: any;
  @ViewChild('modalInformacionPostulante')
  modalInformacionPostulante: any;

  modalRef: NgbModalRef | null = null;

  // estado / test
  fcEstadoEvaluacion = new FormControl(null);
  fcEstadoEtapa = new FormControl(null);

  dataItemEtapaProcesoSeleccion: ClaveValor | null = null;
  preguntaTestAgrupadoTemp: PreguntaTestAgrupado | null = null;
  evaluacionTemp: EvaluacionesAsignadasEvaluador | null = null;

  idEtapaTemp: number | null = null;
  idProcesoSeleccionTemp: number | null = null;
  idEstadoEtapaProcesoTemp: number | null = null;
  idPostulanteTemp: number | null = null;

  showTiempo = false;
  showBtnEnviarRespuesta = false;
  showBtnActualizarRespuesta = false;
  enProcesoGuardarRespuesta = false;

  // info postulante
  informacionPostulanteData: InformacionPostulanteDTO | null = null;
  loadingInformacionPostulante = false;
  activeInfoTab: 'cv' | 'equipo' = 'cv';

  // radios estado etapa
  estadosEtapaRadio = [
    { valor: 1, texto: 'Aprobado', idHtml: 'aprobado' },
    { valor: 2, texto: 'Desaprobado', idHtml: 'desaprobado' },
    { valor: 3, texto: 'En Proceso', idHtml: 'enProceso' },
    { valor: 4, texto: 'Abandonado', idHtml: 'abandonado' },
    { valor: 5, texto: 'Aprobado++', idHtml: 'aprobadoPlusPlus' },
    { valor: 6, texto: 'Aprobado+', idHtml: 'aprobadoPlus' },
    {
      valor: 7,
      texto: 'Aprobado con Observaciones',
      idHtml: 'aprobadoConObservaciones',
    },
    { valor: 9, texto: 'Sin Rendir', idHtml: 'sinRendir' },
  ];

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private modalService: NgbModal
  ) {}

  trackByEtapa = (_: number, etapa: EtapaAprobada) => etapa.idPostulante;
  trackByPregunta = (_: number, p: any) => p.idPregunta;
  trackByRespuesta = (_: number, r: any) => r.idRespuesta;

  // ------------- MODAL TIPO EVALUACIÓN / TEST -------------

  funcionModalTipoEvaluacion(idPostulante: number, dataItem: ClaveValor) {
    this.enProcesoGuardarRespuesta = false;

    const idEtapa = dataItem['idEtapa'] as number;
    const idProcesoSeleccion = dataItem['idProcesoSeleccion'] as number;
    const idEstadoEtapaProceso = dataItem[
      `idEstadoEtapaProceso_${idPostulante}`
    ] as number;

    this.dataItemEtapaProcesoSeleccion = dataItem;
    this.idEtapaTemp = idEtapa;
    this.idProcesoSeleccionTemp = idProcesoSeleccion;
    this.idEstadoEtapaProcesoTemp = idEstadoEtapaProceso;
    this.idPostulanteTemp = idPostulante;

    const filtro = {
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
          if (resp.body.tipoEvaluacion === 1) {
            this.fcEstadoEtapa.setValue(idEstadoEtapaProceso);
            this.modalRef = this.modalService.open(
              this.modalCalificarExamenAsignado,
              {
                size: 'sm',
                backdrop: 'static',
              }
            );
          } else if (resp.body.tipoEvaluacion === 2) {
            this.fcEstadoEvaluacion.setValue(idEstadoEtapaProceso);
            this.obtenerEvaluacionesAsignadasEvaluador(resp.body);
          }
        },
        error: (error) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          const resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener el tipo evaluación!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

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
          const evaluacion = resp.body.find(
            (x) => x.idEvaluacion === tipoExamen.idEvaluacion
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
          const resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener el tipo evaluación!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  obtenerPreguntasRespuestasRealizadasTestEvaluador(
    evaluacion: EvaluacionesAsignadasEvaluador
  ) {
    const filtro = {
      idProcesoSeleccion: evaluacion.idProcesoSeleccion,
      idPostulante: evaluacion.idPostulante,
      idTest: evaluacion.idExamen,
      mostrarEvaluacionAgrupado: evaluacion.mostrarEvaluacionAgrupado,
      mostrarEvaluacionPorGrupo: evaluacion.mostrarEvaluacionPorGrupo,
      mostrarEvaluacionPorComponente:
        evaluacion.mostrarEvaluacionPorComponente,
    };
    this.gridEtapaProcesoSeleccion.loading = true;
    this.integraService
      .postJsonResponse(
        constApiGestionPersonal
          .EvaluacionPostulanteObtenerPreguntasRespuestasRealizadasTestEvaluador,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<PreguntaTestAgrupado>) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          resp.body.listaPreguntas.forEach((pregunta) => {
            if (pregunta.idPreguntaTipo === 5) {
              pregunta.fcPregunta5 = new FormControl({
                value:
                  pregunta.listaRespuestasRealizada[0].idRespuestaPregunta,
                disabled: true,
              });
            }
            if (pregunta.idPreguntaTipo === 4) {
              pregunta.fcPregunta4 = new FormControl({
                value: pregunta.listaRespuestasRealizada.map(
                  (x) => x.idRespuestaPregunta
                ),
                disabled: true,
              });
            }
            pregunta.listaRespuestas.forEach((respuesta) => {
              const existeRespuesta = pregunta.listaRespuestasRealizada.find(
                (rp) => rp.idRespuestaPregunta === respuesta.idRespuesta
              );
              if (existeRespuesta) {
                if (pregunta.idPreguntaTipo === 10) {
                  respuesta.fcRespuesta10 = new FormControl({
                    value: existeRespuesta.textoRespuesta,
                    disabled: true,
                  });
                }
                if (pregunta.idPreguntaTipo === 6) {
                  if (pregunta.enunciadoPregunta === '75 Registros') {
                    // nada
                  } else {
                    if (pregunta.idExamen === 93) {
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
          const resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title:
              '¡Ocurrio un problema al obtener preguntas respuestas realizadas test evaluador!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  private obtenerPreguntasRespuestasTestEvaluador(
    evaluacion: EvaluacionesAsignadasEvaluador
  ) {
    const filtro = {
      idProcesoSeleccion: evaluacion.idProcesoSeleccion,
      idPostulante: evaluacion.idPostulante,
      idTest: evaluacion.idExamen,
      mostrarEvaluacionAgrupado: evaluacion.mostrarEvaluacionAgrupado,
      mostrarEvaluacionPorGrupo: evaluacion.mostrarEvaluacionPorGrupo,
      mostrarEvaluacionPorComponente:
        evaluacion.mostrarEvaluacionPorComponente,
    };
    this.gridEtapaProcesoSeleccion.loading = true;
    this.integraService
      .postJsonResponse(
        constApiGestionPersonal
          .EvaluacionPostulanteObtenerPreguntasRespuestasTestEvaluador,
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
          const resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title:
              '¡Ocurrio un problema al obtener preguntas respuestas test evaluador!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  // ---------------- ESTADO ETAPA EXAMEN ASIGNADO ----------------

  actualizarEstadoEA() {
    if (this.fcEstadoEtapa.value == null || this.fcEstadoEtapa.value === 0) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Seleccione un estado de etapa!',
      });
      return;
    }
    const jsonEnvio = {
      idEstadoEA: this.fcEstadoEtapa.value,
      idProcesoSeleccionEA: this.idProcesoSeleccionTemp,
      idProcesoSeleccionEtapaEA: this.idEtapaTemp,
      idPostulanteEA: this.idPostulanteTemp,
    };
    this.gridEtapaProcesoSeleccion.loading = true;
    this.enProcesoGuardarRespuesta = true;
    this.integraService
      .postJsonResponse(
        constApiGestionPersonal
          .EvaluacionPostulanteActualizacionManualEtapaExamenAsignado,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: () => {
          this.gridEtapaProcesoSeleccion.loading = false;
          this.enProcesoGuardarRespuesta = false;
          this.modalRef?.close();
          this.refrescarEtapas.emit();
        },
        error: () => {
          this.gridEtapaProcesoSeleccion.loading = false;
          this.enProcesoGuardarRespuesta = false;
          this.modalRef?.close();
          this.refrescarEtapas.emit();
        },
      });
  }

  // ---------------- ACTUALIZAR RESPUESTAS ----------------

  actualizarRespuestas() {
    const idEstadoEvaluacionEvaluador = this.fcEstadoEvaluacion.value as number;

    if (!idEstadoEvaluacionEvaluador) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: 'Seleccione el Estado de Evaluación',
      });
      return;
    }

    const listaRespuestasEvaluador: RespuestaDetalle[] = [];

    for (const pregunta of this.preguntaTestAgrupadoTemp.listaPreguntas) {
      if (pregunta.idPreguntaTipo === 10) {
        for (const respuesta of pregunta.listaRespuestas) {
          const rpta = ((respuesta.fcRespuesta10?.value ?? '') + '').trim();
          listaRespuestasEvaluador.push({
            idExamen: pregunta.idExamen,
            idRespuesta: respuesta.idRespuesta,
            idPregunta: pregunta.idPregunta,
            idExamenAsignado: pregunta.idExamenAsignado,
            textoRespuesta: rpta,
            flag: !!rpta,
          });
        }
      }

      if (pregunta.idPreguntaTipo === 6) {
        if (pregunta.enunciadoPregunta === '75 Registros') continue;

        for (const respuesta of pregunta.listaRespuestas) {
          const raw =
            (pregunta.idExamen === 93
              ? respuesta.fcRespuesta93?.value
              : respuesta.fcRespuesta?.value) ?? '';
          const rptaTrim = ('' + raw).trim();

          listaRespuestasEvaluador.push({
            idExamen: pregunta.idExamen,
            idRespuesta: respuesta.idRespuesta,
            idPregunta: pregunta.idPregunta,
            idExamenAsignado: pregunta.idExamenAsignado,
            textoRespuesta: rptaTrim,
            flag: !!rptaTrim,
          });
        }
      }

      if (pregunta.idPreguntaTipo === 5) {
        const rpta = Number(pregunta.fcPregunta5?.value ?? 0);

        listaRespuestasEvaluador.push({
          idExamen: pregunta.idExamen,
          idRespuesta: rpta || 0,
          idPregunta: pregunta.idPregunta,
          idExamenAsignado: pregunta.idExamenAsignado,
          textoRespuesta: '',
          flag: !!rpta,
        });
      }

      if (pregunta.idPreguntaTipo === 4) {
        const rpta = (pregunta.fcPregunta4?.value ?? []) as number[];

        if (!rpta || rpta.length === 0) {
          listaRespuestasEvaluador.push({
            idExamen: pregunta.idExamen,
            idRespuesta: 0,
            idPregunta: pregunta.idPregunta,
            idExamenAsignado: pregunta.idExamenAsignado,
            textoRespuesta: '',
            flag: false,
          });
        } else {
          for (const idRespuesta of rpta) {
            listaRespuestasEvaluador.push({
              idExamen: pregunta.idExamen,
              idRespuesta,
              idPregunta: pregunta.idPregunta,
              idExamenAsignado: pregunta.idExamenAsignado,
              textoRespuesta: '',
              flag: true,
            });
          }
        }
      }
    }

    const jsonEnvio: RespuestaEvaluacionEvaluador = {
      listaRespuestasEvaluador,
      idEstadoEvaluacionEvaluador,
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
      .pipe(retry(1))
      .subscribe({
        next: () => {
          this.enProcesoGuardarRespuesta = false;
          this.gridEtapaProcesoSeleccion.loading = false;
          this.modalRef?.close();
          this.refrescarEtapas.emit();
          this.alertaService.swalFireOptions({
            icon: 'success',
            title: 'Se registraron las respuestas correctamente',
          });
        },
        error: () => {
          this.gridEtapaProcesoSeleccion.loading = false;
          this.enProcesoGuardarRespuesta = false;
        },
      });
  }

  // ---------------- ENVIAR RESPUESTAS NUEVAS ----------------

  sendAnswers() {
    const idEstadoEvaluacionEvaluador = this.fcEstadoEvaluacion.value as number;

    if (!idEstadoEvaluacionEvaluador) {
      this.alertaService.swalFireOptions({
        icon: 'info',
        text: 'Seleccione el Estado de Evaluación',
      });
      return;
    }

    const listaRespuestasEvaluador: RespuestaDetalle[] = [];
    const permiteEnviarIncompleto =
      idEstadoEvaluacionEvaluador === 3 ||
      idEstadoEvaluacionEvaluador === 4 ||
      idEstadoEvaluacionEvaluador === 9;

    for (const pregunta of this.preguntaTestAgrupadoTemp.listaPreguntas) {
      if (pregunta.idPreguntaTipo === 10) {
        for (const respuesta of pregunta.listaRespuestas) {
          const rpta = ((respuesta.fcRespuesta10?.value ?? '') + '').trim();

          if (!rpta && !permiteEnviarIncompleto) {
            this.alertaService.swalFireOptions({
              icon: 'info',
              title: '¡Tiene que responder todas las preguntas!',
            });
            return;
          }

          listaRespuestasEvaluador.push({
            idExamen: pregunta.idExamen,
            idRespuesta: respuesta.idRespuesta,
            idPregunta: pregunta.idPregunta,
            idExamenAsignado: pregunta.idExamenAsignado,
            textoRespuesta: rpta,
            flag: !!rpta,
          });
        }
      }

      if (pregunta.idPreguntaTipo === 6) {
        if (pregunta.enunciadoPregunta === '75 Registros') continue;

        for (const respuesta of pregunta.listaRespuestas) {
          const raw =
            (pregunta.idExamen === 93
              ? respuesta.fcRespuesta93?.value
              : respuesta.fcRespuesta?.value) ?? '';
          const rptaTrim = ('' + raw).trim();

          if (!rptaTrim && !permiteEnviarIncompleto) {
            this.alertaService.swalFireOptions({
              icon: 'info',
              title: '¡Tiene que responder todas las preguntas!',
            });
            return;
          }

          listaRespuestasEvaluador.push({
            idExamen: pregunta.idExamen,
            idRespuesta: respuesta.idRespuesta,
            idPregunta: pregunta.idPregunta,
            idExamenAsignado: pregunta.idExamenAsignado,
            textoRespuesta: rptaTrim,
            flag: !!rptaTrim,
          });
        }
      }

      if (pregunta.idPreguntaTipo === 5) {
        const rpta = Number(pregunta.fcPregunta5?.value ?? 0);

        if ((!rpta || rpta === 0) && !permiteEnviarIncompleto) {
          this.alertaService.swalFireOptions({
            icon: 'info',
            title: '¡Tiene que responder todas las preguntas!',
          });
          return;
        }

        listaRespuestasEvaluador.push({
          idExamen: pregunta.idExamen,
          idRespuesta: rpta || 0,
          idPregunta: pregunta.idPregunta,
          idExamenAsignado: pregunta.idExamenAsignado,
          textoRespuesta: '',
          flag: !!rpta,
        });
      }

      if (pregunta.idPreguntaTipo === 4) {
        const rpta = (pregunta.fcPregunta4?.value ?? []) as number[];

        if ((!rpta || rpta.length === 0) && !permiteEnviarIncompleto) {
          this.alertaService.swalFireOptions({
            icon: 'info',
            title: '¡Tiene que responder todas las preguntas!',
          });
          return;
        }

        if (!rpta || rpta.length === 0) {
          listaRespuestasEvaluador.push({
            idExamen: pregunta.idExamen,
            idRespuesta: 0,
            idPregunta: pregunta.idPregunta,
            idExamenAsignado: pregunta.idExamenAsignado,
            textoRespuesta: '',
            flag: false,
          });
        } else {
          for (const idRespuesta of rpta) {
            listaRespuestasEvaluador.push({
              idExamen: pregunta.idExamen,
              idRespuesta,
              idPregunta: pregunta.idPregunta,
              idExamenAsignado: pregunta.idExamenAsignado,
              textoRespuesta: '',
              flag: true,
            });
          }
        }
      }
    }

    const jsonEnvio: RespuestaEvaluacionEvaluador = {
      listaRespuestasEvaluador,
      idEstadoEvaluacionEvaluador,
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
          this.modalRef?.close();
          this.refrescarEtapas.emit();
          this.alertaService.swalFireOptions({
            icon: 'success',
            title: 'Se registraron las respuestas correctamente',
          });
        },
        error: (error) => {
          this.gridEtapaProcesoSeleccion.loading = false;
          this.enProcesoGuardarRespuesta = false;
          const resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al registrar las respuestas!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  // ---------------- INFO POSTULANTE ----------------

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
}

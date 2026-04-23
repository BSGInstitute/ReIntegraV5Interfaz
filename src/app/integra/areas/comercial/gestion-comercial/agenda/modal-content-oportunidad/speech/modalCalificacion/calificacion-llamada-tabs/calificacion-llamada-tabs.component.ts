import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { AlertaService } from '@shared/services/alerta.service';
import { LoaderService } from '@shared/services/loader.service';
import { IVersion, ControlVersionService, ICalificacionLineamiento, ICalificacionLlamada, ICriterio, IFase } from '@comercial/services/analisis-llamada/control-version.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-calificacion-llamada-tabs',
  templateUrl: './calificacion-llamada-tabs.component.html',
  styleUrls: ['./calificacion-llamada-tabs.component.scss'],
  providers: [DecimalPipe]
})
export class CalificacionLlamadaTabsComponent implements OnInit, OnDestroy {
  @Input() idLlamada: number;

  evaluationForm: FormGroup;
  configuracionActiva: IVersion;
  puntajeTotal: number | null = null;
  faseActual: number = 0;
  guardando: boolean = false;
  mostrarPuntosGenerales: boolean = false;
  private _subscriptions$: Subscription = new Subscription();

  // Tab properties - Modificado para una sola pestaña principal
  activeTab: 'automatic' | 'comparison' = 'automatic';
  automaticScore: number | null = null;
  automaticAnalysis: any = null;
  isAnalyzing: boolean = false;

  // Propiedades para la comparativa
  calificacionAutomaticaData: any = null;
  calificacionManualData: any = null;
  mostrarTabComparativa: boolean = false;
  permitirCalificacionManual: boolean = false;
  tieneCalificacionManual: boolean = false;
  tieneCalificacionAutomatica: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    public controlVersionService: ControlVersionService,
    private alertaService: AlertaService,
    private loaderService: LoaderService,
    private decimalPipe: DecimalPipe
  ) {
    this.evaluationForm = this.fb.group({});
  }

  ngOnInit(): void {
    if (!this.idLlamada) {
      console.error('Error: idLlamada no fue proporcionado al componente CalificacionLlamadaTabsComponent.');
      this.alertaService.swalFireOptions({
        icon: 'error',
        title: 'Error de Configuración',
        text: 'No se pudo cargar la información de la llamada para calificar.'
      });
      this.close(false);
      return;
    }
    this.cargarConfiguracionActiva();
    this.verificarCalificacion();
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  private cargarConfiguracionActiva() {
    this._subscriptions$.add(
      this.controlVersionService.obtenerHistorialVersiones().subscribe({
        next: (versions) => {
          this.configuracionActiva = versions.find(v => v.estadoVersion === 'active');
          if (!this.configuracionActiva) {
            this.alertaService.swalFireOptions({
              icon: 'warning',
              text: 'No hay una configuración de calificación activa'
            });
            this.close(false);
            return;
          }
          this.initializeEvaluationForm();
        },
        error: (error) => {
          console.error('Error al cargar configuración:', error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            text: 'Error al cargar la configuración de calificación'
          });
          this.close(false);
        }
      })
    );
  }

  private initializeEvaluationForm() {
    if (!this.configuracionActiva) return;

    const formGroup: any = {};
    
    this.configuracionActiva.configuracion.fases.forEach(fase => {
      this.controlVersionService.getCriteriosForFase(this.configuracionActiva, fase.id).forEach(criterio => {
        formGroup[`criterio_${criterio.id}`] = [null, [Validators.required, Validators.min(0), Validators.max(10)]];
      });
    });
    
    if (this.configuracionActiva.configuracion.puntosGenerales && this.configuracionActiva.configuracion.puntosGenerales.length > 0) {
      this.configuracionActiva.configuracion.puntosGenerales.forEach((puntoGeneral: any) => {
        formGroup[`punto_general_${puntoGeneral.id}`] = [null, [Validators.min(0), Validators.max(10)]];
      });
    }

    this.evaluationForm = this.fb.group(formGroup);
    this.evaluationForm.valueChanges.subscribe(() => this.calcularPuntajeTotal());
    this.calcularPuntajeTotal();
  }

  calcularPuntajeTotal() {
    if (!this.evaluationForm || !this.configuracionActiva) return;

    let total = 0;
    let count = 0;

    Object.keys(this.evaluationForm.value).forEach(key => {
      if (key.startsWith('criterio_')) {
        const value = this.evaluationForm.get(key)?.value;
        if (value !== null && value !== undefined && !isNaN(Number(value)) && value > 0) {
          total += Number(value);
          count++;
        }
      }
    });

    if (this.configuracionActiva.configuracion.puntosGenerales && this.configuracionActiva.configuracion.puntosGenerales.length > 0) {
      this.configuracionActiva.configuracion.puntosGenerales.forEach((puntoGeneral: any) => {
        const value = this.evaluationForm.get(`punto_general_${puntoGeneral.id}`)?.value;
        if (value !== null && value !== undefined && !isNaN(Number(value)) && value > 0) {
          total += Number(value);
          count++;
        }
      });
    }

    this.puntajeTotal = count > 0 ? (total / count) : null;
  }

  calcularProgresoGeneral(): number {
    if (!this.configuracionActiva || !this.evaluationForm) return 0;
    
    let fasesEvaluadas = 0;
    let totalFases = this.configuracionActiva.configuracion.fases.length;
    
    for (const fase of this.configuracionActiva.configuracion.fases) {
      let faseTieneCalificacion = false;
      
      const criterios = this.controlVersionService.getCriteriosForFase(this.configuracionActiva, fase.id);
      for (const criterio of criterios) {
        const lineamientos = this.controlVersionService.getLineamientosForCriterio(this.configuracionActiva, criterio.id);
        for (const lineamiento of lineamientos) {
          const value = this.evaluationForm.get(`criterio_${criterio.id}`)?.value;
          if (value !== null && value !== undefined && !isNaN(Number(value)) && value > 0) {
            faseTieneCalificacion = true;
            break;
          }
        }
        if (faseTieneCalificacion) break;
      }
      
      if (faseTieneCalificacion) {
        fasesEvaluadas++;
      }
    }
    
    return totalFases > 0 ? (fasesEvaluadas / totalFases) * 100 : 0;
  }

  getFasePuntaje(fase: IFase): number | null {
    if (!this.evaluationForm || !this.configuracionActiva) return null;

    let total = 0;
    let count = 0;

    const criterios = this.controlVersionService.getCriteriosForFase(this.configuracionActiva, fase.id);
    criterios.forEach(criterio => {
      const value = this.evaluationForm.get(`criterio_${criterio.id}`)?.value;
      if (value !== null && value !== undefined && !isNaN(Number(value)) && value > 0) {
        total += Number(value);
        count++;
      }
    });

    return count > 0 ? (total / count) : null;
  }

  getCriterioPuntaje(criterioId: number): number | null {
    if (!this.evaluationForm || !this.configuracionActiva) return null;
    
    const value = this.evaluationForm.get(`criterio_${criterioId}`)?.value;
    return (value !== null && value !== undefined && !isNaN(Number(value)) && value > 0) ? Number(value) : null;
  }

  setCriterioScore(criterioId: number, score: number) {
    const control = this.evaluationForm.get(`criterio_${criterioId}`);
    if (control) {
      if (control.value === score) {
        control.setValue(null);
      } else {
        if (score !== 0 && (score < 2 || score > 10 || score % 2 !== 0)) {
          control.setValue(null);
        } else {
          control.setValue(score);
        }
      }
    }
  }

  getPuntosGeneralesPuntaje(): number | null {
    if (!this.evaluationForm || !this.configuracionActiva?.configuracion?.puntosGenerales || 
        this.configuracionActiva.configuracion.puntosGenerales.length === 0) return null;
    
    let total = 0;
    let count = 0;
    
    this.configuracionActiva.configuracion.puntosGenerales.forEach((puntoGeneral: any) => {
      const value = this.evaluationForm.get(`punto_general_${puntoGeneral.id}`)?.value;
      if (value !== null && value !== undefined && !isNaN(Number(value)) && value > 0) {
        total += Number(value);
        count++;
      }
    });

    return count > 0 ? (total / count) : null;
  }

  getPuntoGeneralPuntaje(puntoGeneralId: number): number | null {
    if (!this.evaluationForm) return null;
    
    const value = this.evaluationForm.get(`punto_general_${puntoGeneralId}`)?.value;
    return (value !== null && value !== undefined && !isNaN(Number(value)) && value > 0) ? Number(value) : null;
  }

  setPuntoGeneralScore(puntoGeneralId: number, score: number) {
    const control = this.evaluationForm.get(`punto_general_${puntoGeneralId}`);
    if (control) {
      if (control.value === score) {
        control.setValue(null);
      } else {
        if (score !== 0 && (score < 2 || score > 10 || score % 2 !== 0)) {
          control.setValue(null);
        } else {
          control.setValue(score);
        }
      }
    }
  }

  getScoreClass(score: number | null): string {
    if (score === null || score === 0) {
      return 'score-pending';
    }
    
    if (score >= 8) {
      return 'score-high';
    } else if (score >= 5) {
      return 'score-medium';
    } else {
      return 'score-low';
    }
  }

  getProgressBarClass(score: number | null): string {
    if (score === null || score === 0) {
      return 'progress-bar-poor';
    }
    
    if (score >= 8) {
      return 'progress-bar-excellent';
    } else if (score >= 5) {
      return 'progress-bar-good';
    } else {
      return 'progress-bar-poor';
    }
  }

  getScoreBadgeClass(score: number | null): string {
    if (score === null || score === 0) {
      return 'score-badge-poor';
    }
    
    if (score >= 8) {
      return 'score-badge-excellent';
    } else if (score >= 5) {
      return 'score-badge-good';
    } else {
      return 'score-badge-poor';
    }
  }

  /**
   * Cambia la pestaña activa del modal de calificación.
   * @param tab 'automatic' | 'comparison'
   */
  switchTab(tab: 'automatic' | 'comparison') {
    this.activeTab = tab;
    if (tab === 'comparison' && this.mostrarTabComparativa) {
      this.verificarCalificacion();
    }
  }

  /**
   * Verifica la existencia de calificaciones manual y automática.
   * Si existe calificación automática, permite calificación manual.
   * Si existen ambas, habilita el tab de comparativa.
   */
  verificarCalificacion() {
    // Por ahora, simular la verificación
    // En una implementación real, aquí harías la llamada al servicio
    this.tieneCalificacionManual = false;
    this.tieneCalificacionAutomatica = false;
    this.permitirCalificacionManual = false;
    this.mostrarTabComparativa = false;
  }

  async analyzeCall() {
    if (!this.idLlamada) return;
    
    this.isAnalyzing = true;
    this.loaderService.show();
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.automaticAnalysis = {
        score: 7.5,
        details: {
          sentiment: 'positive',
          keyPoints: [
            'Cliente mostró interés en el producto',
            'Asesor mantuvo un tono profesional',
            'Se resolvieron todas las dudas del cliente'
          ],
          recommendations: [
            'Mejorar el tiempo de respuesta inicial',
            'Incluir más detalles sobre beneficios del producto'
          ]
        }
      };
      
      this.automaticScore = this.automaticAnalysis.score;
      this.tieneCalificacionAutomatica = true;
      this.permitirCalificacionManual = true;
      
    } catch (error) {
      console.error('Error analyzing call:', error);
      this.alertaService.swalFireOptions({
        icon: 'error',
        text: 'Error al analizar la llamada automáticamente'
      });
    } finally {
      this.isAnalyzing = false;
      this.loaderService.hide();
    }
  }

  close(result: any = 'Cancel click'): void {
    this.activeModal.dismiss(result);
  }

  isFaseCompletamenteCalificada(fase: IFase): boolean {
    if (!this.evaluationForm || !this.configuracionActiva) return false;
    
    const criterios = this.controlVersionService.getCriteriosForFase(this.configuracionActiva, fase.id);
    if (criterios.length === 0) return false;
    
    return criterios.every(criterio => {
      const value = this.evaluationForm.get(`criterio_${criterio.id}`)?.value;
      return value !== null && value !== undefined && !isNaN(Number(value)) && value >= 0;
    });
  }

  isPuntosGeneralesCompletos(): boolean {
    if (!this.evaluationForm || !this.configuracionActiva?.configuracion?.puntosGenerales || 
        this.configuracionActiva.configuracion.puntosGenerales.length === 0) return false;
    
    return this.configuracionActiva.configuracion.puntosGenerales.every((puntoGeneral: any) => {
      const value = this.evaluationForm.get(`punto_general_${puntoGeneral.id}`)?.value;
      return value !== null && value !== undefined && !isNaN(Number(value)) && value >= 0;
    });
  }

  isFormularioValidoParaGuardar(): boolean {
    if (!this.configuracionActiva) return false;
    
    const tieneFaseCompleta = this.configuracionActiva.configuracion.fases.some(fase => 
      this.isFaseCompletamenteCalificada(fase)
    );
    
    const puntosGeneralesCompletos = this.isPuntosGeneralesCompletos();
    
    return tieneFaseCompleta || puntosGeneralesCompletos;
  }

  // Métodos para la comparativa
  getComparativaScore(tipo: 'manual' | 'automatic'): number | null {
    if (tipo === 'manual') {
      return this.puntajeTotal;
    }
    if (tipo === 'automatic') {
      return this.automaticScore;
    }
    return null;
  }

  getComparativaClass(tipo: 'manual' | 'automatic'): string {
    const score = this.getComparativaScore(tipo);
    if (score === null) return 'score-pending';
    if (score >= 8) return 'score-high';
    if (score >= 5) return 'score-medium';
    return 'score-low';
  }

  getDiferenciaPuntaje(): number | null {
    const manual = this.getComparativaScore('manual');
    const automatic = this.getComparativaScore('automatic');
    if (manual !== null && automatic !== null) {
      return Math.abs(manual - automatic);
    }
    return null;
  }

  getDiferenciaClass(): string {
    const diferencia = this.getDiferenciaPuntaje();
    if (diferencia === null) return 'diferencia-neutral';
    if (diferencia <= 1) return 'diferencia-baja';
    if (diferencia <= 2) return 'diferencia-media';
    return 'diferencia-alta';
  }
} 
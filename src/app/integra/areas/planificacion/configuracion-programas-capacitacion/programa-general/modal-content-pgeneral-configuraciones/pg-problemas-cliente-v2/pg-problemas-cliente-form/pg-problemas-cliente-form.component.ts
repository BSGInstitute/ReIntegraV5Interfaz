import { HttpResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import {
  IProgramaGeneralFactor,
  ProgramaGeneralProblemaFactor,
  ProgramaGeneralProblemaFactorDetalle,
  ProgramaGeneralProblemaFactorSolucion,
} from '@planificacion/models/interfaces/ProgramaGeneralProblemaFactor';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { IProblemaClienteSolucion } from '../pg-problemas-cliente-v2.component';

type Opcion = { id: number; nombre: string };

interface ISubSolucionItem {
  id: number;
  solucion?: string;   // nombre/etiqueta
  nombre?: string;     // por si el API lo devuelve así
  seleccionado?: boolean;
  // Puedes extender con más campos según tu API
}

@Component({
  selector: 'app-pg-problemas-cliente-form',
  templateUrl: './pg-problemas-cliente-form.component.html',
  styles: [],
})
export class PgProblemasClienteFormComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() esNuevo = true;
  @Input() dataProblema: any = null;
  @Input() idPGeneral!: number;
  @Output() cerrado = new EventEmitter<void>();

  // Combos raíz
  opcProblema: ProgramaGeneralProblemaFactor[] = [];
  opcDetalle: ProgramaGeneralProblemaFactorDetalle[] = [];

  // Base completa (sin filtrar) de soluciones
  private opcSolucionBase: ProgramaGeneralProblemaFactorSolucion[] = [];

  // Listas para los 3 dropdowns de solución
  descOptions: ProgramaGeneralProblemaFactorSolucion[] = [];  
  opcSolucionTituloFiltered: ProgramaGeneralProblemaFactorSolucion[] = [];
  opcSolucionSubTituloFiltered: ProgramaGeneralProblemaFactorSolucion[] = []; 

  // Form
  formProblema: FormGroup;

  // Subsoluciones (panel dual)
  mostrarCuadro = false;
  private registrosDisponiblesBase: ISubSolucionItem[] = [];
  registrosDisponibles: ISubSolucionItem[] = [];
  registrosSeleccionados: ISubSolucionItem[] = [];
  registrosPreSeleccionados: ISubSolucionItem[] = [];

  constructor(
    private fb: FormBuilder,
    private integraService: IntegraService,
    private alertaService: AlertaService
  ) {
    this.formProblema = this.fb.group({
      id: 0,
      idPGeneral: 0,
      problemaId: [null, Validators.required],
      detalleId: [null],
      detalleTituloId: [null],

      // Solución
      solucionDescripcionId: [null],
      solucionTituloId: [null],
      solucionSubTituloId: [null],

      // No se envían ids de solución en el payload final, solo flags y subsoluciones
      subSolucionesIds: [[] as number[]],
    });
  }

  // ========= Helpers de texto / dedupe =========
  private norm(s?: string | null): string {
    return (s ?? '').trim().toLowerCase();
  }
  private notEmpty(s?: string | null): boolean {
    return this.norm(s).length > 0;
  }
  private dedupeBy<T extends ProgramaGeneralProblemaFactorSolucion>(
    items: T[],
    prop: 'descripcion' | 'titulo' | 'subTitulo'
  ): T[] {
    const seen = new Set<string>();
    const out: T[] = [];
    for (const it of items) {
      const key = this.norm(it[prop] as any);
      if (!key) continue;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(it);
      }
    }
    return out;
  }
  private getById(id: number | null | undefined): ProgramaGeneralProblemaFactorSolucion | undefined {
    if (id == null) return undefined;
    return this.opcSolucionBase.find(x => x.id === id);
  }

  // ========= Ciclo de vida =========
  ngOnInit(): void {
    this.obtenerCombos();

    // Cambia problema ⇒ limpia detalle y títulos, y reinicia subtítulo + subsoluciones
    this.formProblema.get('problemaId')?.valueChanges.subscribe(() => {
      this.formProblema.patchValue({ detalleId: null, detalleTituloId: null }, { emitEvent: false });
      // Si tuvieses un combo dependiente para títulos de detalle, límpialo aquí.
      this.resetSubtituloYSubsoluciones();
      // Limpia también descripción/título de solución para evitar combinaciones residuales
      this.formProblema.patchValue({ solucionDescripcionId: null, solucionTituloId: null }, { emitEvent: false });
      this.refreshSubtituloOptions();
    });

    // Cambia detalle ⇒ carga títulos del detalle (si aplica) y limpia subtítulo + subsoluciones
    this.formProblema.get('detalleId')?.valueChanges.subscribe(id => {
      this.cargarTitulos(id);
      this.formProblema.patchValue({ detalleTituloId: null }, { emitEvent: false });
      this.resetSubtituloYSubsoluciones();
      this.refreshSubtituloOptions();
    });

    // Cambia detalle-título ⇒ (si aplicara) refresca y limpia subtítulo + subsoluciones
    this.formProblema.get('detalleTituloId')?.valueChanges.subscribe(() => {
      this.resetSubtituloYSubsoluciones();
      this.refreshSubtituloOptions();
    });

    // === Solución: Descripción ===
    this.formProblema.get('solucionDescripcionId')?.valueChanges.subscribe(id => {

      this.resetSubtituloYSubsoluciones();
      this.onDescripcionChange(id);
      this.evaluarCoincidenciaDescTitulo();
      this.refreshSubtituloOptions();
    });

    // === Solución: Título ===
    this.formProblema.get('solucionTituloId')?.valueChanges.subscribe(id => {
  
      this.resetSubtituloYSubsoluciones();
      this.onTituloChange(id);
      this.evaluarCoincidenciaDescTitulo();
      this.refreshSubtituloOptions();
    });

    // === Solución: Subtítulo ===
    this.formProblema.get('solucionSubTituloId')?.valueChanges.subscribe((id: number | null) => {
      if (id) {
        this.mostrarCuadroSubtitulo(id);
      } else {
        this.resetSubtituloYSubsoluciones();
      }
    });
    
    if (!this.esNuevo && this.dataProblema) {
      this.cargarFormulario(this.dataProblema);
    }
  }

  cargarFormulario(data: IProblemaClienteSolucion): void {
    this.formProblema.patchValue({
      problemaId: data.problema.problemaId,
      detalleId: data.problema.detalleId,
      detalleTituloId: data.problema.detalleTituloId,
      solucionDescripcionId: data.solucion.solucionDescripcionId,
      solucionTituloId: data.solucion.solucionTituloId,
      solucionSubTituloId: data.solucion.subTituloId,

      // id: data.problema.problemaId,
      // idPGeneral: this.idPGeneral,// todo: opcional con 0
      // problemaId: data.problema.problemaId,
      // detalleId: data.problema.detalleId,
      // detalleTituloId: [null],

      // // Solución
      // solucionDescripcionId: [null],
      // solucionTituloId: [null],
      // solucionSubTituloId: [null],

      // No se envían ids de solución en el payload final, solo flags y subsoluciones
      subSolucionesIds: [[] as number[]],
    });

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.dataProblema) {
      this.formProblema.patchValue(this.dataProblema);
      // reconstruye filtros si ya trae valores
      const d = this.formProblema.value.solucionDescripcionId;
      const t = this.formProblema.value.solucionTituloId;
      this.onDescripcionChange(d);
      this.onTituloChange(t);
      this.refreshSubtituloOptions();
    } else if (!this.visible) {
      this.formProblema.reset();
    }
  }

  // ========= Backend =========
  obtenerCombos(): void {
    this.integraService
      .getJsonResponse(constApiPlanificacion.ProgramaGeneralProblemaFactorObtenerCombos)
      .subscribe({
        next: (resp: HttpResponse<IProgramaGeneralFactor>) => {
          const body = resp.body;
          this.opcProblema = body?.problemaFactor ?? [];
          this.opcDetalle = body?.problemaFactorDetalle ?? [];
          this.opcSolucionBase = body?.problemaFactorSolucion ?? [];

        
          this.descOptions = this.dedupeBy(
            this.opcSolucionBase.filter(s => this.notEmpty(s.descripcion)),
            'descripcion'
          );

      
          this.opcSolucionTituloFiltered = [];
          this.opcSolucionSubTituloFiltered = [];

     
          this.refreshSubtituloOptions();
        },
        error: (error) => {
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  // ========= Filtros agrupados =========
  private onDescripcionChange(id: number | null): void {
    if (id == null) {
      this.opcSolucionTituloFiltered = [];
     
      return;
    }
    const item = this.getById(id);
    if (!item) return;

    const descTxt = this.norm(item.descripcion);


    this.opcSolucionTituloFiltered = this.dedupeBy(
      this.opcSolucionBase.filter(
        s => this.norm(s.descripcion) === descTxt && this.notEmpty(s.titulo)
      ),
      'titulo'
    );
  }

  private onTituloChange(id: number | null): void {
    // Subtítulo se calcula en refreshSubtituloOptions()
    // (si quieres mostrar títulos por descripción también aquí, mantén lo anterior)
  }


  private refreshSubtituloOptions(): void {
    const dId: number | null = this.formProblema.get('solucionDescripcionId')?.value ?? null;
    const tId: number | null = this.formProblema.get('solucionTituloId')?.value ?? null;

    const subNonEmpty = this.opcSolucionBase.filter(s => this.notEmpty(s.subTitulo));


    if (dId == null && tId == null) {
      this.opcSolucionSubTituloFiltered = this.dedupeBy(subNonEmpty, 'subTitulo');
      return;
    }

    if (dId != null && tId == null) {
      const d = this.getById(dId);
      if (!d) { this.opcSolucionSubTituloFiltered = []; return; }
      const descTxt = this.norm(d.descripcion);
      this.opcSolucionSubTituloFiltered = this.dedupeBy(
        subNonEmpty.filter(s => this.norm(s.descripcion) === descTxt),
        'subTitulo'
      );
      return;
    }

    
    if (tId != null && dId == null) {
      const t = this.getById(tId);
      if (!t) { this.opcSolucionSubTituloFiltered = []; return; }
      const titTxt = this.norm(t.titulo);
      this.opcSolucionSubTituloFiltered = this.dedupeBy(
        subNonEmpty.filter(s => this.norm(s.titulo) === titTxt),
        'subTitulo'
      );
      return;
    }

 
    const d = this.getById(dId);
    const t = this.getById(tId);
    if (!d || !t) { this.opcSolucionSubTituloFiltered = []; return; }
    const descTxt = this.norm(d.descripcion);
    const titTxt = this.norm(t.titulo);

    this.opcSolucionSubTituloFiltered = this.dedupeBy(
      subNonEmpty.filter(
        s => this.norm(s.descripcion) === descTxt && this.norm(s.titulo) === titTxt
      ),
      'subTitulo'
    );
  }

  
  private evaluarCoincidenciaDescTitulo(): void {
    const dId: number | null = this.formProblema.get('solucionDescripcionId')?.value ?? null;
    const tId: number | null = this.formProblema.get('solucionTituloId')?.value ?? null;

    if (dId != null && tId != null && dId === tId) {
      this.resetSubtituloYSubsoluciones();
    }
  }

  // ========= Otros (detalles) =========
  cargarTitulos(detalleId: number | null): void {
    // Si en tu flujo debes cargar títulos del detalle, hazlo aquí.
    // (Dejamos vacío a propósito; no siempre se necesita)
  }

  cerrar(): void {
    this.cerrado.emit();
  }

  // ========= SubSoluciones =========
  private resetSubtituloYSubsoluciones(): void {
    // Subtítulo a null (sin disparar valueChanges)
    this.formProblema.patchValue({ solucionSubTituloId: null }, { emitEvent: false });

    // Oculta y limpia panel de subsoluciones
    this.mostrarCuadro = false;
    this.registrosDisponiblesBase = [];
    this.registrosDisponibles = [];
    this.registrosSeleccionados = [];
    this.registrosPreSeleccionados = [];
  }

  private syncDisponiblesConBase(): void {
    const seleccionadosIds = new Set(this.registrosSeleccionados.map(r => r.id));
    this.registrosDisponibles = this.registrosDisponiblesBase
      .filter(r => !seleccionadosIds.has(r.id))
      .map(r => ({ ...r, seleccionado: false }));
  }

  mostrarCuadroSubtitulo(id: number): void {
    if (!id || id <= 0) {
      this.mostrarCuadro = false;
      this.registrosDisponiblesBase = [];
      this.syncDisponiblesConBase();
      return;
    }
    this.integraService
      .getJsonResponse(`/ProgramaGeneralProblemaFactorSubSolucion/ObtenerPorIdProgramaGeneralProblemaFactorSolucion/${id}`)
      .subscribe({
        next: (resp: HttpResponse<any[]>) => {
          const data = (resp.body ?? []).map(x => ({
            id: x.id,
            solucion: x.solucion ?? x.nombre ?? '',
            seleccionado: false
          })) as ISubSolucionItem[];

          this.registrosDisponiblesBase = data;
          this.mostrarCuadro = data.length > 0;
          this.syncDisponiblesConBase();
        },
        error: (error) => {
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(`Error al obtener subsoluciones: ${mensaje}`);
          this.registrosDisponiblesBase = [];
          this.mostrarCuadro = false;
          this.syncDisponiblesConBase();
        },
      });
  }

  // === Botones/acciones panel (sin ngModel en el form) ===
  marcarPreseleccion(item: ISubSolucionItem, checked: boolean): void {
    // úsalo desde (change) de un checkbox standalone
    const yaPre = this.registrosPreSeleccionados.some(x => x.id === item.id);
    if (checked && !yaPre) {
      this.registrosPreSeleccionados.push({ ...item, seleccionado: true });
    } else if (!checked && yaPre) {
      this.registrosPreSeleccionados = this.registrosPreSeleccionados.filter(x => x.id !== item.id);
    }
  }

  pasarASeleccionados(): void {
    if (this.registrosPreSeleccionados.length === 0) {
      this.alertaService.notificationInfo('Debe seleccionar al menos un registro.');
      return;
    }
    const nuevos = this.registrosPreSeleccionados.filter(
      pre => !this.registrosSeleccionados.some(sel => sel.id === pre.id)
    );
    // Agrega
    this.registrosSeleccionados.push(...nuevos);
    // Quita de disponibles
    const idsPasados = new Set(nuevos.map(n => n.id));
    this.registrosDisponibles = this.registrosDisponibles.filter(d => !idsPasados.has(d.id));
    // Limpia preselección
    this.registrosPreSeleccionados = [];
  }

  deseleccionar(item: ISubSolucionItem): void {
    const idx = this.registrosSeleccionados.findIndex(x => x.id === item.id);
    if (idx >= 0) {
      // devolver a disponibles si no existe ya
      if (!this.registrosDisponibles.some(d => d.id === item.id)) {
        this.registrosDisponibles.push({ ...item, seleccionado: false });
      }
      this.registrosSeleccionados.splice(idx, 1);
    }
  }

  revertirADisponibles(): void {
    if (this.registrosSeleccionados.length === 0) {
      this.alertaService.notificationInfo('No hay registros seleccionados para revertir.');
      return;
    }
    const devueltos = this.registrosSeleccionados.map(sel => ({ ...sel, seleccionado: false }));
    const existentes = new Set(this.registrosDisponibles.map(d => d.id));
    devueltos.forEach(r => { if (!existentes.has(r.id)) this.registrosDisponibles.push(r); });
    this.registrosSeleccionados = [];
    this.registrosPreSeleccionados = [];
  }

  revertirTodo(): void {
    this.registrosDisponibles = this.registrosDisponiblesBase.map(r => ({ ...r, seleccionado: false }));
    this.registrosSeleccionados = [];
    this.registrosPreSeleccionados = [];
  }

  // ========= Guardar =========
  guardar(): void {
    if (!this.formProblema.valid) {
      this.formProblema.markAllAsTouched();
      this.alertaService.notificationWarning('Por favor, completa los campos requeridos antes de guardar.');
      return;
    }

    const v = this.formProblema.value;

    const solucionesPayload = this.registrosSeleccionados.map(it => ({
      IdProgramaGeneralProblemaFactorSubSolucion: it.id
    }));

    if (solucionesPayload.length === 0) {
      this.alertaService.notificationWarning('Por favor, debe tener asignado al menos un registro de solución.');
      return;
    }

    const dataTransformada = {
      idPGeneral: this.idPGeneral,
      IdProgramaGeneralProblemaFactor: v.problemaId,
      IdProgramaGeneralProblemaFactorDetalle: v.detalleId,

      AplicaNombreDetalle: v.detalleId != null,
      AplicaTituloDetalle: v.detalleTituloId != null,
      AplicaPieDePagina: false,

      AplicaDescripcionSolucion: v.solucionDescripcionId != null,
      AplicaTituloSolucion: v.solucionTituloId != null,
      AplicaSubTituloSolucion: v.solucionSubTituloId != null,

      soluciones: solucionesPayload,
    };

    this.integraService
      .postJsonResponse('/ProgramaGeneralProblemaDetalle/Insertar', dataTransformada)
      .subscribe({
        next: () => {
          this.alertaService.notificationSuccess('Guardado correctamente.');
          this.cerrar();
        },
        error: () => this.alertaService.notificationError('Error al guardar.'),
      });
  }
}

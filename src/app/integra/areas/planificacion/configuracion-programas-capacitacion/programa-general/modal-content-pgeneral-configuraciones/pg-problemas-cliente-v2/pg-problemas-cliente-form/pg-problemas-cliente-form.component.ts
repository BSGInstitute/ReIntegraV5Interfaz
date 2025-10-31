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

interface ISubSolucionItem {
  id: number;
  solucion?: string;
  nombre?: string;
  seleccionado?: boolean;
  asignacionId?: number | null;
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

 
  @Output() cerrado = new EventEmitter<boolean>();

  formLoader: boolean = false;
  todosSeleccionadosCheckedDisponibles = false;
  opcProblema: ProgramaGeneralProblemaFactor[] = [];
  opcProblemaFiltro: ProgramaGeneralProblemaFactor[] = [];
  filtroSolucionCuadro: string = '';

  private opcDetalleAll: ProgramaGeneralProblemaFactorDetalle[] = [];
  detalleOptions: ProgramaGeneralProblemaFactorDetalle[] = [];
  detalleOptionsFiltro : ProgramaGeneralProblemaFactorDetalle[] = [];
  detalleTituloOptions: ProgramaGeneralProblemaFactorDetalle[] = [];
  detalleTituloOptionsFiltro : ProgramaGeneralProblemaFactorDetalle[] = [];

 
  private opcSolucionBase: ProgramaGeneralProblemaFactorSolucion[] = [];


  descOptions: ProgramaGeneralProblemaFactorSolucion[] = [];               // únicas por descripción
  descOptionsFiltro: ProgramaGeneralProblemaFactorSolucion[] = []; // filtradas por descripción
  opcSolucionTituloFiltered: ProgramaGeneralProblemaFactorSolucion[] = []; // únicas por título
  opcSolucionTituloFilteredFiltro: ProgramaGeneralProblemaFactorSolucion[] = []; // filtradas por título
  opcSolucionSubTituloFiltered: ProgramaGeneralProblemaFactorSolucion[] = []; // únicas por subtítulo
  opcSolucionSubTituloFilteredFiltro: ProgramaGeneralProblemaFactorSolucion[] = [];


  formProblema: FormGroup;


  mostrarCuadro = false;
  private registrosDisponiblesBase: ISubSolucionItem[] = [];
  registrosDisponibles: ISubSolucionItem[] = [];
  registrosDisponiblesFiltro: ISubSolucionItem[] = [];
  registrosSeleccionados: ISubSolucionItem[] = [];
  registrosPreSeleccionados: ISubSolucionItem[] = [];

  // Edición diferida (si combos no han cargado)
  private combosListos = false;
  private edicionPendiente:
    | {
        vals?: {
          problemaId: number | null;
          detalleId: number | null;
          detalleTituloId: number | null;
          solucionId: number | null;
          subSolucionIds: number[];
        };
      }
    | null = null;

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
      solucionDescripcionId: [null],
      solucionTituloId: [null],
      solucionSubTituloId: [null],
      subSolucionesIds: [[] as number[]],
    });
  }

  // ========= Helpers =========
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
      const key = this.norm((it as any)[prop]);
      if (!key) continue;
      if (!seen.has(key)) {
        seen.add(key);
        out.push(it);
      }
    }
    return out;
  }
  private getById(
    id: number | null | undefined
  ): ProgramaGeneralProblemaFactorSolucion | undefined {
    if (id == null) return undefined;
    return this.opcSolucionBase.find((x) => x.id === id);
  }

  private toNum(v: any): number | null {
    if (v === null || v === undefined || v === '') return null;
    const n = Number(v);
    if (!Number.isFinite(n) || n === 0) return null;
    return n;
  }

  private getRegistroIdFromData(d: any): number | null {
    return (
      this.toNum(d?.id) ??
      this.toNum(d?.Id) ??
      this.toNum(d?.idProgramaGeneralProblemaDetalle) ??
      this.toNum(d?.IdProgramaGeneralProblemaDetalle) ??
      null
    );
  }

  // ========= Ciclo de vida =========
  ngOnInit(): void {
    this.formLoader = true;
    this.obtenerCombos();
    this.formLoader = false;

    this.formProblema.get('problemaId')?.valueChanges.subscribe(() => {
      this.formProblema.patchValue(
        { detalleId: null, detalleTituloId: null },
        { emitEvent: false }
      );
      this.syncDetalleTituloLists();

 
      this.formProblema.patchValue(
        { solucionDescripcionId: null, solucionTituloId: null, solucionSubTituloId: null },
        { emitEvent: false }
      );
      this.resetSubtituloYSubsoluciones();
      this.onDescripcionChange(null);
      this.refreshSubtituloOptions();
    });


    this.formProblema.get('detalleId')?.valueChanges.subscribe((val) => {
      const id = this.toNum(val);
      if (id === null) {
        this.formProblema.patchValue({ detalleTituloId: null }, { emitEvent: false });
      }
      this.syncDetalleTituloLists();
    });


    this.formProblema.get('detalleTituloId')?.valueChanges.subscribe((val) => {
      const id = this.toNum(val);
      if (id === null) {
        this.formProblema.patchValue({ detalleId: null }, { emitEvent: false });
      }
      this.syncDetalleTituloLists();
    });

    // === Solución: Descripción ===
    this.formProblema.get('solucionDescripcionId')?.valueChanges.subscribe((id) => {
      this.resetSubtituloYSubsoluciones();
      this.onDescripcionChange(this.toNum(id));
      this.evaluarCoincidenciaDescTitulo();
      this.refreshSubtituloOptions();
    });

    // === Solución: Título ===
    this.formProblema.get('solucionTituloId')?.valueChanges.subscribe(() => {
      this.resetSubtituloYSubsoluciones();
      this.evaluarCoincidenciaDescTitulo();
      this.refreshSubtituloOptions();
    });

    // === Solución: Subtítulo ===
    this.formProblema
      .get('solucionSubTituloId')
      ?.valueChanges.subscribe((id: number | null) => {
        if (id) {
          this.mostrarCuadroSubtitulo(id);
        } else {
          this.resetSubtituloYSubsoluciones();
        }
      });

    // Edición si ya hay data y combos listos
    if (!this.esNuevo && this.dataProblema && this.combosListos) {
      this.aplicarEdicion(this.dataProblema);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('dataProblema' in changes) {
      if (!this.esNuevo && this.dataProblema) {
        if (!this.combosListos) {
          this.edicionPendiente = { vals: this.adaptarEntrada(this.dataProblema) };
        } else {
          this.aplicarEdicion(this.dataProblema);
        }
      } else if (!this.visible) {
        this.formProblema.reset();
      }
    }
  }

  // ========= Backend =========
  obtenerCombos(): void {
    this.integraService
      .getJsonResponse(constApiPlanificacion.ProgramaGeneralProblemaFactorObtenerCombos)
      .subscribe({
        next: (resp: HttpResponse<IProgramaGeneralFactor>) => {
          const body = resp.body;
          this.formLoader = false;
          this.opcProblema  = body?.problemaFactor ?? [];
          this.opcProblemaFiltro = body?.problemaFactor ?? [];
          this.opcDetalleAll = body?.problemaFactorDetalle ?? [];
          this.opcSolucionBase = body?.problemaFactorSolucion ?? [];

        
          this.detalleOptions = [...this.opcDetalleAll];
          this.detalleOptionsFiltro = [...this.opcDetalleAll];
          this.detalleTituloOptions = [...this.opcDetalleAll];
          this.detalleTituloOptionsFiltro = [...this.opcDetalleAll];

       
          this.descOptions = this.dedupeBy(
            this.opcSolucionBase.filter((s) => this.notEmpty(s.descripcion)),
            'descripcion'
          );

          this.descOptionsFiltro = this.descOptions;

       
          this.opcSolucionTituloFiltered = [];
          this.opcSolucionTituloFilteredFiltro = [];
          this.opcSolucionSubTituloFiltered = [];
          this.opcSolucionSubTituloFilteredFiltro = [];

          this.syncDetalleTituloLists();

       
          const descId = this.toNum(this.formProblema.get('solucionDescripcionId')?.value);
          this.onDescripcionChange(descId);
          this.refreshSubtituloOptions(); 

          this.combosListos = true;

     
          if (this.edicionPendiente?.vals) {
            const vals = this.edicionPendiente.vals;
            this.edicionPendiente = null;
            this.aplicarValoresEdicion(vals);
          }
        },
        error: (error) => {
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  // ========= Sincronizar Detalle <-> Título(Detalle) =========

  private syncDetalleTituloLists(): void {
    const dId = this.toNum(this.formProblema.get('detalleId')?.value);
    const tId = this.toNum(this.formProblema.get('detalleTituloId')?.value);
    const ALL = [...this.opcDetalleAll];

    if (dId === null && tId === null) {
      this.detalleOptions = ALL;
      this.detalleTituloOptions = ALL;
      return;
    }

    if (dId !== null && tId === null) {
      const match = this.opcDetalleAll.find((d) => d.id === dId);
      this.detalleOptions = ALL;
      this.detalleTituloOptions = match ? [match] : ALL;
      return;
    }

    if (tId !== null && dId === null) {
      const match = this.opcDetalleAll.find((d) => d.id === tId);
      this.detalleOptions = match ? [match] : ALL;
      this.detalleTituloOptions = ALL;
      return;
    }

    const dMatch = this.opcDetalleAll.find((d) => d.id === dId);
    const tMatch = this.opcDetalleAll.find((d) => d.id === tId);
    this.detalleOptions = dMatch ? [dMatch] : ALL;
    this.detalleTituloOptions = tMatch ? [tMatch] : ALL;
  }

  // ========= Filtros de Solución =========
  private onDescripcionChange(id: number | null): void {
    if (id == null) {
      // SIN DESCRIPCIÓN: todos los títulos únicos
      this.opcSolucionTituloFiltered = this.dedupeBy(
        this.opcSolucionBase.filter((s) => this.notEmpty(s.titulo)),
        'titulo'
      );
      this.opcSolucionTituloFilteredFiltro = this.opcSolucionTituloFiltered;
      return;
    }
    const item = this.getById(id);
    if (!item) return;

    const descTxt = this.norm(item.descripcion);

    this.opcSolucionTituloFiltered = this.dedupeBy(
      this.opcSolucionBase.filter(
        (s) => this.norm(s.descripcion) === descTxt && this.notEmpty(s.titulo)
      ),
      'titulo'
    );
    this.opcSolucionTituloFilteredFiltro = this.opcSolucionTituloFiltered;
  }

  private refreshSubtituloOptions(): void {
    const dId: number | null = this.toNum(this.formProblema.get('solucionDescripcionId')?.value);
    const tId: number | null = this.toNum(this.formProblema.get('solucionTituloId')?.value);

    const subNonEmpty = this.opcSolucionBase.filter((s) => this.notEmpty(s.subTitulo));

    if (dId === null && tId === null) {
      this.opcSolucionSubTituloFiltered = this.dedupeBy(subNonEmpty, 'subTitulo');
      this.opcSolucionSubTituloFilteredFiltro = this.opcSolucionSubTituloFiltered;
      return;
    }

    if (dId !== null && tId === null) {
      const d = this.getById(dId);
      if (!d) { this.opcSolucionSubTituloFiltered = []; this.opcSolucionSubTituloFilteredFiltro = []; return; }
      const descTxt = this.norm(d.descripcion);
      this.opcSolucionSubTituloFiltered = this.dedupeBy(
        subNonEmpty.filter((s) => this.norm(s.descripcion) === descTxt),
        'subTitulo'
      );
      this.opcSolucionSubTituloFilteredFiltro = this.opcSolucionSubTituloFiltered;
      return;
    }

    if (tId !== null && dId === null) {
      const t = this.getById(tId);
      if (!t) { this.opcSolucionSubTituloFiltered = []; this.opcSolucionSubTituloFilteredFiltro = []; return; }
      const titTxt = this.norm(t.titulo);
      this.opcSolucionSubTituloFiltered = this.dedupeBy(
        subNonEmpty.filter((s) => this.norm(s.titulo) === titTxt),
        'subTitulo'
      );
      this.opcSolucionSubTituloFilteredFiltro = this.opcSolucionSubTituloFiltered;
      return;
    }

    const d = this.getById(dId);
    const t = this.getById(tId);
    if (!d || !t) { this.opcSolucionSubTituloFiltered = []; this.opcSolucionSubTituloFilteredFiltro = []; return; }
    const descTxt = this.norm(d.descripcion);
    const titTxt = this.norm(t.titulo);

    this.opcSolucionSubTituloFiltered = this.dedupeBy(
      subNonEmpty.filter(
        (s) => this.norm(s.descripcion) === descTxt && this.norm(s.titulo) === titTxt
      ),
      'subTitulo'
    );
    this.opcSolucionSubTituloFilteredFiltro = this.opcSolucionSubTituloFiltered;
  }

  private evaluarCoincidenciaDescTitulo(): void {
    const dId: number | null = this.toNum(this.formProblema.get('solucionDescripcionId')?.value);
    const tId: number | null = this.toNum(this.formProblema.get('solucionTituloId')?.value);
    if (dId !== null && tId !== null && dId === tId) {
      this.resetSubtituloYSubsoluciones();
    }
  }

  // ========= SubSoluciones =========
  private resetSubtituloYSubsoluciones(): void {
    this.formProblema.patchValue({ solucionSubTituloId: null }, { emitEvent: false });
    this.mostrarCuadro = false;
    this.registrosDisponiblesBase = [];
    this.registrosDisponibles = [];
    this.registrosDisponiblesFiltro = [];
    this.registrosSeleccionados = [];
    this.registrosPreSeleccionados = [];
  }

  private syncDisponiblesConBase(): void {
    const seleccionadosIds = new Set(this.registrosSeleccionados.map((r) => r.id));
    this.registrosDisponibles = this.registrosDisponiblesBase
      .filter((r) => !seleccionadosIds.has(r.id))
      .map((r) => ({ ...r, seleccionado: false }));
    this.registrosDisponiblesFiltro = this.registrosDisponibles;
  }

  mostrarCuadroSubtitulo(
    id: number,
    preselectPairs: Array<{ asignacionId: number | null; subSolucionId: number }> = []
  ): void {
    if (!id || id <= 0) {
      this.mostrarCuadro = false;
      this.registrosDisponiblesBase = [];
      this.syncDisponiblesConBase();
      return;
    }
    this.integraService
      .getJsonResponse(
        `/ProgramaGeneralProblemaFactorSubSolucion/ObtenerPorIdProgramaGeneralProblemaFactorSolucion/${id}`
      )
      .subscribe({
        next: (resp: HttpResponse<any[]>) => {
          const data = (resp.body ?? []).map(
            (x) =>
              ({
                id: x.id,
                solucion: x.solucion ?? x.nombre ?? '',
                seleccionado: false,
              } as ISubSolucionItem)
          );

          this.registrosDisponiblesBase = data;
          this.mostrarCuadro = data.length > 0;

          if (preselectPairs.length > 0) {
            const map = new Map(
              preselectPairs.map((p) => [p.subSolucionId, p.asignacionId])
            );
            this.registrosSeleccionados = data
              .filter((d) => map.has(d.id)) // d.id = Id de SUBSOLUCIÓN
              .map((d) => ({
                ...d,
                asignacionId: map.get(d.id) ?? null, // Id de ASIGNACIÓN
              }));
          } else {
            this.registrosSeleccionados = [];
          }
          this.syncDisponiblesConBase();
        },
        error: (error) => {
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(
            `Error al obtener subsoluciones: ${mensaje}`
          );
          this.registrosDisponiblesBase = [];
          this.mostrarCuadro = false;
          this.syncDisponiblesConBase();
        },
      });
  }

  marcarPreseleccion(item: ISubSolucionItem, checked: boolean): void {
    const yaPre = this.registrosPreSeleccionados.some((x) => x.id === item.id);
    if (checked && !yaPre) {
      this.registrosPreSeleccionados.push({ ...item, seleccionado: true });
    } else if (!checked && yaPre) {
      this.registrosPreSeleccionados = this.registrosPreSeleccionados.filter(
        (x) => x.id !== item.id
      );
    }
  }
  marcarPreSeleccionarTodos(checked: boolean): void {
    this.todosSeleccionadosCheckedDisponibles = checked;
    this.registrosDisponiblesFiltro.forEach(item => {
      item.seleccionado = checked;
      this.marcarPreseleccion(item, checked);
    });

    if (!checked) {
      this.registrosPreSeleccionados = [];
    }
  }

  pasarASeleccionados(): void {
    if (this.registrosPreSeleccionados.length === 0) {
      this.alertaService.notificationInfo('Debe seleccionar al menos un registro.');
      return;
    }
    const nuevos = this.registrosPreSeleccionados.filter(
      (pre) => !this.registrosSeleccionados.some((sel) => sel.id === pre.id)
    );
    this.registrosSeleccionados.push(...nuevos);
    const idsPasados = new Set(nuevos.map((n) => n.id));
    this.registrosDisponibles = this.registrosDisponibles.filter(
      (d) => !idsPasados.has(d.id)
    );
    this.registrosDisponiblesFiltro = this.registrosDisponibles;
    this.registrosPreSeleccionados = [];
  }

  deseleccionar(item: ISubSolucionItem): void {
    const idx = this.registrosSeleccionados.findIndex((x) => x.id === item.id);
    if (idx >= 0) {
      if (!this.registrosDisponibles.some((d) => d.id === item.id)) {
        this.registrosDisponibles.push({ ...item, seleccionado: false });
        this.registrosDisponiblesFiltro = this.registrosDisponibles;
      }
      this.registrosSeleccionados.splice(idx, 1);
    }
  }

  revertirTodo(): void {
    this.registrosDisponibles = this.registrosDisponiblesBase.map((r) => ({
      ...r,
      seleccionado: false,
    }));
    this.registrosDisponiblesFiltro = this.registrosDisponibles;
    this.registrosSeleccionados = [];
    this.registrosPreSeleccionados = [];
  }

  // ========= Insertar / Actualizar =========

  private buildPayload(): any {
    const v = this.formProblema.value;

    const Soluciones = this.registrosSeleccionados.map((it) => ({
      Id: it.asignacionId ?? 0,
      IdProgramaGeneralProblemaFactorSubSolucion: it.id,
    }));

    const payload: any = {
      IdPGeneral: this.idPGeneral,
      IdProgramaGeneralProblemaFactor: v.problemaId,
      IdProgramaGeneralProblemaFactorDetalle: v.detalleId,

      AplicaNombreDetalle: v.detalleId != null,
      AplicaTituloDetalle: v.detalleTituloId != null,
      AplicaPieDePagina: false,

      AplicaDescripcionSolucion: v.solucionDescripcionId != null,
      AplicaTituloSolucion: v.solucionTituloId != null,
      AplicaSubTituloSolucion: v.solucionSubTituloId != null,

      Soluciones,
    };


    if (!this.esNuevo) {
      const idRegistro = this.getRegistroIdFromData(this.dataProblema);
      if (idRegistro != null) payload.Id = idRegistro;
    }

    return payload;
  }

  guardar(): void {
    this.formLoader = true;
    if (!this.formProblema.valid) {
      this.formProblema.markAllAsTouched();
      this.alertaService.notificationWarning(
        'Por favor, completa los campos requeridos antes de guardar.'
      );
      this.formLoader = false;
      return;
    }

    if (this.registrosSeleccionados.length === 0) {
      this.alertaService.notificationWarning(
        'Por favor, debe tener asignado al menos un registro de solución.'
      );
      this.formLoader = false;
      return;
    }

    const payload = this.buildPayload();

    if (this.esNuevo) {
      this.insertar(payload);
    } else {
      this.actualizar(payload);
    }
  }

  private insertar(payload: any): void {
    this.integraService
      .postJsonResponse('/ProgramaGeneralProblemaDetalle/Insertar', payload)
      .subscribe({
        next: () => {
          this.alertaService.notificationSuccess('Guardado correctamente.');
          this.formLoader = false;
          this.cerrar(true);
        },
        error: () => this.alertaService.notificationError('Error al guardar.'),
      });
  }

  private actualizar(payload: any): void {

    this.integraService
      .putJsonResponse('/ProgramaGeneralProblemaDetalle/Actualizar', payload)
      .subscribe({
        next: () => {
          this.alertaService.notificationSuccess('Actualizado correctamente.');
          this.formLoader = false;
          this.cerrar(true);
        },
        error: () => this.alertaService.notificationError('Error al actualizar.'),
      });
  }

  cerrar(refrescar = false): void {
    this.cerrado.emit(refrescar);
  }

  // ========= EDICIÓN =========
  private adaptarEntrada(data: any): {
    problemaId: number | null;
    detalleId: number | null;
    detalleTituloId: number | null;
    solucionId: number | null;
    subSolucionIds: number[];
  } {
    const problemaId =
      this.toNum(data?.problema?.problemaId) ??
      this.toNum(data?.factor?.id) ??
      this.toNum(data?.idProgramaGeneralProblemaFactor) ??
      null;

    const detalleId =
      this.toNum(data?.problema?.detalleId) ??
      this.toNum(data?.detalle?.id) ??
      this.toNum(data?.idProgramaGeneralProblemaFactorDetalle) ??
      null;

    const detalleTituloId =
      this.toNum(data?.problema?.detalleTituloId) ??
      this.toNum(data?.detalle?.id) ??
      detalleId;

    const solucionId =
      this.toNum(data?.solucion?.id) ??
      this.toNum(data?.solucion?.solucionId) ??
      this.toNum(data?.idProgramaGeneralProblemaFactorSolucion) ??
      null;

    const subSolucionIds = (Array.isArray(data?.subSoluciones) ? data.subSoluciones : [])
      .map((x: any) =>
        this.toNum(x?.idProgramaGeneralProblemaFactorSubSolucion ?? x?.id ?? x)
      )
      .filter((n: number | null) => n !== null) as number[];

    return { problemaId, detalleId, detalleTituloId, solucionId, subSolucionIds };
  }


  private resolveDescOptionIdFromSolucion(solId: number | null): number | null {
    if (solId == null) return null;
    const base = this.getById(solId);
    if (!base) return null;
    const descTxt = this.norm(base.descripcion);
    const opt = this.descOptions.find((o) => this.norm(o.descripcion) === descTxt);
    return opt ? opt.id : null;
  }


  private resolveTituloOptionIdFromSolucion(solId: number | null): number | null {
    if (solId == null) return null;
    const base = this.getById(solId);
    if (!base) return null;
    const titTxt = this.norm(base.titulo);
    const opt = this.opcSolucionTituloFiltered.find((o) => this.norm(o.titulo) === titTxt);
    this.opcSolucionTituloFilteredFiltro = opt ? [opt] : [];
    return opt ? opt.id : null;
  }


  private resolveSubtituloOptionIdFromSolucion(solId: number | null): number | null {
    if (solId == null) return null;
    const base = this.getById(solId);
    if (!base) return null;
    const subTxt = this.norm(base.subTitulo);
    const opt = this.opcSolucionSubTituloFiltered.find(
      (o) => this.norm(o.subTitulo) === subTxt
    );
    this.opcSolucionSubTituloFilteredFiltro = opt ? [opt] : [];
    return opt ? opt.id : null;
  }

  private aplicarEdicion(data: any): void {
    const vals = this.adaptarEntrada(data);
    if (!this.combosListos) {
      this.edicionPendiente = { vals };
      return;
    }
    this.aplicarValoresEdicion(vals);
  }

  private aplicarValoresEdicion(vals: {
    problemaId: number | null;
    detalleId: number | null;
    detalleTituloId: number | null;
    solucionId: number | null;
    subSolucionIds: number[];
  }): void {
    // Problema/Detalle
    this.formProblema.patchValue(
      {
        problemaId: vals.problemaId,
        detalleId: vals.detalleId,
        detalleTituloId: vals.detalleTituloId,
      },
      { emitEvent: false }
    );
    this.syncDetalleTituloLists();

    // Descripción (por texto, debido a dedupe)
    const descOptId = this.resolveDescOptionIdFromSolucion(vals.solucionId);
    this.formProblema.patchValue(
      { solucionDescripcionId: descOptId, solucionTituloId: null, solucionSubTituloId: null },
      { emitEvent: false }
    );

    this.onDescripcionChange(descOptId);
    this.refreshSubtituloOptions();

    // Título (por texto)
    const tituloOptId = this.resolveTituloOptionIdFromSolucion(vals.solucionId);
    this.formProblema.patchValue({ solucionTituloId: tituloOptId }, { emitEvent: false });
    this.refreshSubtituloOptions();

    // Subtítulo (por texto)
    const subOptId = this.resolveSubtituloOptionIdFromSolucion(vals.solucionId);
    this.formProblema.patchValue({ solucionSubTituloId: subOptId }, { emitEvent: false });

    // ===== Preselección de subsoluciones con Id de ASIGNACIÓN =====
    const preselectPairs =
      (Array.isArray(this.dataProblema?.subSoluciones)
        ? this.dataProblema.subSoluciones
        : []
      )
        .map((x: any) => ({
          asignacionId: this.toNum(x?.id) ?? null, // Id de ASIGNACIÓN
          subSolucionId:
            this.toNum(x?.idProgramaGeneralProblemaFactorSubSolucion) ??
            this.toNum(x?.id) ??
            0,
        }))
        .filter((p: any) => (p.subSolucionId ?? 0) > 0) as Array<{
        asignacionId: number | null;
        subSolucionId: number;
      }>;

    if (subOptId) {
      this.mostrarCuadroSubtitulo(subOptId, preselectPairs);
    } else {
      this.resetSubtituloYSubsoluciones();
    }
  }

  onFilterChangeProblema(value: any) {
    if (value.length >= 1) {
      this.opcProblemaFiltro = this.opcProblema.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.opcProblemaFiltro = this.opcProblema;
    }
  }

  onFilterChangeProblemaDetalle(value: any) {
    if (value.length >= 1) {
      this.detalleOptionsFiltro = this.detalleOptions.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.detalleOptionsFiltro = this.detalleOptions;
    }
  }

  onFilterChangeDetalleTitulo(value: any) {
    if (value.length >= 1) {
      this.detalleTituloOptionsFiltro = this.detalleTituloOptions.filter(
        (s: any) =>
          s.titulo.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.detalleTituloOptionsFiltro = this.detalleTituloOptions;
    }
  }
  onFilterChangeSolucionDescripcion(value: any) {
    if (value.length >= 1) {
      this.descOptionsFiltro = this.descOptions.filter(
        (s: any) =>
          s.descripcion.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.descOptionsFiltro = this.descOptions;
    }
  }
  onFilterChangeSolucionTitulo(value: any) {
    if (value.length >= 1) {
      this.opcSolucionTituloFilteredFiltro = this.opcSolucionTituloFiltered.filter(
        (s: any) =>
          s.titulo.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.opcSolucionTituloFilteredFiltro = this.opcSolucionTituloFiltered;
    }
  }
  onFilterChangeSolucionSubTitulo(value: any) {
    if (value.length >= 1) {
      this.opcSolucionSubTituloFilteredFiltro = this.opcSolucionSubTituloFiltered.filter(
        (s: any) =>
          s.subTitulo.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.opcSolucionSubTituloFilteredFiltro = this.opcSolucionSubTituloFiltered;
    }
  }
}

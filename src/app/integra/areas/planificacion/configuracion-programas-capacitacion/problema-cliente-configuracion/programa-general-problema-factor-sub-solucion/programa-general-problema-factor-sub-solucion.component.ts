import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { PageSizeItem, GridComponent, RowArgs } from '@progress/kendo-angular-grid';
import { constApiPlanificacion } from '@environments/constApi';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface ComboNoBase {
  id: number;
  subTitulo?: string;
  titulo?: string;
  descripcion?: string;
}
interface ComboBase { id: number; subTitulo: string; }

interface SubSolucionDTO {
  id: number;
  idProgramaGeneralProblemaFactorSolucion: number | null;
  solucion: string;
  orden: number;
  nivel: number;
}

interface DraftRow {
  tempId: string;
  id?: number;
  idSolucion: number | null;
  solucion: string;
  orden: number;
  nivel: number;
  parentTempId?: string;
  isNew?: boolean;
  isEditing?: boolean;
  expanded?: boolean;
}

interface SolucionGroup {
  solucionId: number;
  nombre: string;
}

@Component({
  selector: 'app-programa-general-problema-factor-sub-solucion',
  templateUrl: './programa-general-problema-factor-sub-solucion.component.html',
  styleUrls: ['./programa-general-problema-factor-sub-solucion.component.scss']
})
export class ProgramaGeneralProblemaFactorSubSolucionComponent implements OnInit {

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  @ViewChild('draftGrid') draftGrid?: GridComponent;

  griProblemaFactorSubSolucion: KendoGrid = new KendoGrid();
  enProcesoSolicitud = false;
  modalRef: NgbModalRef | null = null;
  isNew = true;

  dataComboSoluciones: ComboBase[] = [];
  dataComboSolucionesFiltro: ComboBase[] = [];
  selectedSolucionId: number | null = null;
  defaultSolucionItem: ComboBase = { id: null as any, subTitulo: 'Seleccione Solución' };

  draft: DraftRow[] = [];
  get draftParents(): DraftRow[] { return this.draft.filter(d => d.nivel === 1); }

  private initialExistingIds = new Set<number>();


  private solucionNombreMap = new Map<number, string>();

  get solucionesGroups(): SolucionGroup[] {
    const all = (this.griProblemaFactorSubSolucion.data as SubSolucionDTO[]) ?? [];
    const ids = new Set<number>();
    all.forEach(r => {
      if (r.idProgramaGeneralProblemaFactorSolucion != null) {
        ids.add(r.idProgramaGeneralProblemaFactorSolucion);
      }
    });

    const groups: SolucionGroup[] = Array.from(ids).map(id => ({
      solucionId: id,
      nombre: this.nombreSolucionPorId(id)
    }));

    groups.sort((a, b) => a.nombre.localeCompare(b.nombre));
    return groups;
  }

  get padres(): SubSolucionDTO[] {
    return (this.griProblemaFactorSubSolucion.data as SubSolucionDTO[]).filter(x => x.nivel === 1);
  }

  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  formProblemaFactorSubSolucion: FormGroup = this._formBuilder.group({});

  ngOnInit(): void {
    this.obtenerSubSoluciones();
    this.obtener();  
    this.configurarGrid();
  }

  private normalize(value?: string | null): string | null {
    if (value == null) return null;
    const v = String(value).trim();
    if (!v) return null;
    const lower = v.toLowerCase();
    if (lower === 'vacio' || lower === 'vacío') return null;
    return v;
  }

  private pickNombre(sol: ComboNoBase): string {
    const sub = this.normalize(sol.subTitulo);
    const tit = this.normalize(sol.titulo);
    const des = this.normalize(sol.descripcion);
    return sub ?? tit ?? des ?? '(Sin descripción)';
  }

  private nombreSolucionPorId(id: number): string {
    return this.solucionNombreMap.get(id) ?? `Solución #${id}`;
  }


  obtener(): void {
    this._integraService
      .getJsonResponse(constApiPlanificacion.ProgramageneralproblemaFactorSolucionObtener)
      .subscribe({
        next: (resp: HttpResponse<ComboNoBase[]>) => {
          const rpta = resp.body ?? [];

 
          this.dataComboSoluciones = rpta.map((s) => ({
            id: s.id,
            subTitulo: this.pickNombre(s)
          }));
          this.dataComboSolucionesFiltro = this.dataComboSoluciones;


          this.solucionNombreMap.clear();
          this.dataComboSoluciones.forEach(c => {
            if (c?.id != null) this.solucionNombreMap.set(c.id, c.subTitulo);
          });
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }


  obtenerSubSoluciones(): void {
    this.griProblemaFactorSubSolucion.loading = true;
    this._integraService
      .getJsonResponse(constApiPlanificacion.ProgramageneralproblemaFactorSubSolucionObtener)
      .subscribe({
        next: (resp: HttpResponse<SubSolucionDTO[]>) => {
          this.griProblemaFactorSubSolucion.data = resp.body ?? [];
          this.griProblemaFactorSubSolucion.loading = false;
        },
        error: (error) => {
          this.griProblemaFactorSubSolucion.loading = false;
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  getPadresBySolucion(solucionId: number): SubSolucionDTO[] {
    const all = (this.griProblemaFactorSubSolucion.data as SubSolucionDTO[]) ?? [];
    return all
      .filter(x => x.nivel === 1 && x.idProgramaGeneralProblemaFactorSolucion === solucionId)
      .sort((a, b) => a.orden - b.orden);
  }

  getChildren(padre: SubSolucionDTO): SubSolucionDTO[] {
    const all = (this.griProblemaFactorSubSolucion.data as SubSolucionDTO[]) ?? [];
    return all
      .filter(x =>
        x.nivel === 2 &&
        x.orden === padre.orden &&
        x.idProgramaGeneralProblemaFactorSolucion === padre.idProgramaGeneralProblemaFactorSolucion
      )
      .sort((a, b) => a.orden - b.orden);
  }

  configurarGrid(): void {
    this.griProblemaFactorSubSolucion.habilitarEstadoNewRow = true;
  }

  abrirModal(context: any, isNew: boolean, dataItem?: SubSolucionDTO): void {
    this.isNew = isNew;
    this.draft = [];
    this.initialExistingIds.clear();

    if (!isNew && dataItem) {
      this.selectedSolucionId = dataItem.idProgramaGeneralProblemaFactorSolucion ?? null;

      const padreTempId = rid();
      const padre: DraftRow = {
        tempId: padreTempId,
        id: dataItem.id,
        idSolucion: this.selectedSolucionId,
        solucion: dataItem.solucion,
        orden: dataItem.orden,
        nivel: 1,
        expanded: false
      };
      this.draft.push(padre);
      if (dataItem.id) this.initialExistingIds.add(dataItem.id);

      const hijos = this.getChildren(dataItem);
      hijos.forEach(h => {
        this.draft.push({
          tempId: rid(),
          id: h.id,
          idSolucion: this.selectedSolucionId,
          solucion: h.solucion,
          orden: padre.orden,
          nivel: 2,
          parentTempId: padreTempId,
          isNew: false,
          isEditing: false
        });
        if (h.id) this.initialExistingIds.add(h.id);
      });
    } else {
      this.selectedSolucionId = null;
    }

    this.modalRef = this._modalService.open(context, {
      backdrop: 'static',
      keyboard: false,
      centered: true,
      scrollable: true,
      size: 'xl',
      modalDialogClass: 'modal-xxl modal-dialog-scrollable'
    });
  }

  onFilterChangeComboSoluciones(value: any){
    if (value?.length >= 1) {
      const v = String(value).toLowerCase();
      this.dataComboSolucionesFiltro = this.dataComboSoluciones.filter(
        (s: any) => s.subTitulo.toLowerCase().indexOf(v) !== -1
      );
    } else {
      this.dataComboSolucionesFiltro = this.dataComboSoluciones;
    }
  }

  onSolucionChange(id: number | null): void {
    this.selectedSolucionId = id;
    this.draft = [];
    this.initialExistingIds.clear();

    if (!id) return;

    this.enProcesoSolicitud = true;

    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramageneralproblemaFactorSubSolucionObtenerPorIdProgramaGeneralProblemaFactorSolucion}/${id}`
      )
      .subscribe({
        next: (resp: HttpResponse<SubSolucionDTO[]>) => {
          const data = resp.body ?? [];
          if (data.length === 0) {
            this.isNew = true;
            this.enProcesoSolicitud = false;
            return;
          }

          this.isNew = false;

          const padres = data.filter(x => x.nivel === 1);
          padres.forEach(p => {
            const temp = rid();
            const padre: DraftRow = {
              tempId: temp,
              id: p.id,
              idSolucion: id,
              solucion: p.solucion,
              orden: p.orden,
              nivel: 1,
              expanded: true
            };
            this.draft.push(padre);
            if (p.id) this.initialExistingIds.add(p.id);

            data
              .filter(h => h.nivel === 2 && h.orden === p.orden && h.idProgramaGeneralProblemaFactorSolucion === id)
              .forEach(h => {
                this.draft.push({
                  tempId: rid(),
                  id: h.id,
                  idSolucion: id,
                  solucion: h.solucion,
                  orden: p.orden,
                  nivel: 2,
                  parentTempId: temp,
                  isNew: false,
                  isEditing: false
                });
                if (h.id) this.initialExistingIds.add(h.id);
              });
          });

          this.enProcesoSolicitud = false;
        },
        error: (error) => {
          this.enProcesoSolicitud = false;
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  public isDetailExpanded = (args: RowArgs): boolean =>
    !!(args.dataItem as DraftRow).expanded;

  public onDetailExpand(args: RowArgs): void {
    (args.dataItem as DraftRow).expanded = true;
  }

  public onDetailCollapse(args: RowArgs): void {
    (args.dataItem as DraftRow).expanded = false;
  }

  getDraftChildrenByParent(parent: DraftRow): DraftRow[] {
    return this.draft.filter(r => r.nivel === 2 && r.parentTempId === parent.tempId);
  }

  private nextParentOrder(): number {
    const orders = this.draftParents.map(p => p.orden);
    return orders.length ? Math.max(...orders) + 1 : 1;
  }

  addRootRow(): void {
    this.draft.push({
      tempId: rid(),
      idSolucion: this.selectedSolucionId,
      solucion: '',
      orden: this.nextParentOrder(),
      nivel: 1,
      isNew: true,
      expanded: false
    });
  }

  addChildRow(parent: DraftRow): void {
    this.draft.push({
      tempId: rid(),
      idSolucion: this.selectedSolucionId,
      solucion: '',
      orden: parent.orden,
      nivel: 2,
      parentTempId: parent.tempId,
      isNew: true,
      isEditing: true
    });
  }

  onAddChildAndExpand(parent: DraftRow): void {
    this.addChildRow(parent);
    parent.expanded = true;
  }

  editChild(child: DraftRow): void { child.isEditing = true; }
  finishEditChild(child: DraftRow): void { child.isEditing = false; }
  cancelEditChild(child: DraftRow): void {
    if (child.isNew && !child.id) this.removeRow(child);
    else child.isEditing = false;
  }

  removeRow(row: DraftRow): void {
    if (row.nivel === 1) {
      const toRemove = new Set<string>([row.tempId]);
      this.getDraftChildrenByParent(row).forEach(h => toRemove.add(h.tempId));
      this.draft = this.draft.filter(r => !toRemove.has(r.tempId));
    } else {
      this.draft = this.draft.filter(r => r.tempId !== row.tempId);
    }
  }

  clearDraft(): void { this.draft = []; }

  hasDraftErrors(requireSolution: boolean): boolean {
    if (requireSolution && !this.selectedSolucionId) return true;
    if (this.draft.some(r => !r.solucion || r.orden == null || r.orden < 1)) return true;

    const orders = this.draftParents.map(p => p.orden);
    const unique = new Set(orders);
    return unique.size !== orders.length;
  }

  onParentOrderChange(parent: DraftRow, newValue: number): void {
    if (!newValue || newValue < 1) newValue = 1;

    const parents = this.draftParents;
    const oldOrder = parent.orden;
    if (newValue === oldOrder) return;

    const other = parents.find(p => p !== parent && p.orden === newValue);
    parent.orden = newValue;

    if (other) {
      other.orden = oldOrder;
      this.getDraftChildrenByParent(other).forEach(h => (h.orden = other.orden));
    }
    this.getDraftChildrenByParent(parent).forEach(h => (h.orden = parent.orden));
  }
  guardarDraft(): void {
    if (this.hasDraftErrors(true)) {
      this._alertaService.mensajeIcon('Selecciona la Solución y verifica campos/órdenes.');
      return;
    }

    this.enProcesoSolicitud = true;
    this.griProblemaFactorSubSolucion.loading = true;

    const selId = this.selectedSolucionId!;
    const payload: SubSolucionDTO[] = this.draft.map(r => ({
      id: r.id ?? 0,
      idProgramaGeneralProblemaFactorSolucion: selId,
      solucion: r.solucion,
      orden: r.orden,
      nivel: r.nivel
    }));

    this._integraService
      .postJsonResponse(
        constApiPlanificacion.ProgramageneralproblemaFactorSubSolucionInsertar,
        JSON.stringify(payload)
      )
      .subscribe({
        next: (_resp: HttpResponse<SubSolucionDTO[]>) => this.finalizarGuardarActualizar(),
        error: (error) => this.finalizarConError(error)
      });
  }

  actualizarDraft(): void {
    if (this.hasDraftErrors(false)) {
      this._alertaService.mensajeIcon('Verifica campos/órdenes.');
      return;
    }

    this.enProcesoSolicitud = true;
    this.griProblemaFactorSubSolucion.loading = true;

    const selId = this.selectedSolucionId;

    const presentIds = new Set<number>(this.draft.filter(r => !!r.id).map(r => r.id as number));
    const toDeleteIds: number[] = [];
    this.initialExistingIds.forEach(id => { if (!presentIds.has(id)) toDeleteIds.push(id); });

    const toCreate = this.draft.filter(r => !r.id);
    const toUpdate = this.draft.filter(r => !!r.id);

    const createPayload: SubSolucionDTO[] = toCreate.map(r => ({
      id: 0,
      idProgramaGeneralProblemaFactorSolucion: selId ?? r.idSolucion ?? null,
      solucion: r.solucion,
      orden: r.orden,
      nivel: r.nivel
    }));

    const updatePayload: SubSolucionDTO[] = toUpdate.map(r => ({
      id: r.id!,
      idProgramaGeneralProblemaFactorSolucion: selId ?? r.idSolucion ?? null,
      solucion: r.solucion,
      orden: r.orden,
      nivel: r.nivel
    }));

    const calls = [];

    if (updatePayload.length) {
      calls.push(
        this._integraService.putJsonResponse(
          constApiPlanificacion.ProgramageneralproblemaFactorSubSolucionActualizar,
          JSON.stringify(updatePayload)
        ).pipe(catchError(err => of(err)))
      );
    }

    if (createPayload.length) {
      calls.push(
        this._integraService.postJsonResponse(
          constApiPlanificacion.ProgramageneralproblemaFactorSubSolucionInsertar,
          JSON.stringify(createPayload)
        ).pipe(catchError(err => of(err)))
      );
    }

    if (toDeleteIds.length) {
      calls.push(
        forkJoin(
          toDeleteIds.map(id =>
            this._integraService
              .deleteJsonResponse(`${constApiPlanificacion.ProgramageneralproblemaFactorSubSolucionEliminar}/${id}`)
              .pipe(catchError(err => of(err)))
          )
        )
      );
    }

    (calls.length ? forkJoin(calls) : of(null)).subscribe({
      next: () => this.finalizarGuardarActualizar(),
      error: (error) => this.finalizarConError(error)
    });
  }

  private finalizarGuardarActualizar(): void {
    this.enProcesoSolicitud = false;
    this.griProblemaFactorSubSolucion.loading = false;
    this.modalRef?.close();
    this.obtenerSubSoluciones();
    this._alertaService.mensajeExitoso();
  }

  private finalizarConError(error: any): void {
    this.enProcesoSolicitud = false;
    this.griProblemaFactorSubSolucion.loading = false;
    const mensaje = this._alertaService.getMessageErrorService(error);
    this._alertaService.notificationWarning(mensaje);
  }

  eliminarPadre(padre: SubSolucionDTO): void {
    const hijos = this.getChildren(padre);
    const ids = [padre.id, ...hijos.map(h => h.id)].filter(Boolean) as number[];
    const total = ids.length;

    Swal.fire({
      title: `¿Eliminar ${total} registro${total > 1 ? 's' : ''}?`,
      text: 'Se eliminará el padre y sus sub-soluciones asociadas.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.enProcesoSolicitud = true;
      this.griProblemaFactorSubSolucion.loading = true;

      forkJoin(
        ids.map(id =>
          this._integraService
            .deleteJsonResponse(`${constApiPlanificacion.ProgramageneralproblemaFactorSubSolucionEliminar}/${id}`)
            .pipe(catchError(err => of(err)))
        )
      ).subscribe({
        next: () => this.finalizarEliminarOk(),
        error: (error) => this.finalizarEliminarError(error)
      });
    });
  }

  eliminarHijo(hijo: SubSolucionDTO): void {
    Swal.fire({
      title: '¿Eliminar sub-solución?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) return;

      this.enProcesoSolicitud = true;
      this.griProblemaFactorSubSolucion.loading = true;

      this._integraService
        .deleteJsonResponse(`${constApiPlanificacion.ProgramageneralproblemaFactorSubSolucionEliminar}/${hijo.id}`)
        .subscribe({
          next: (_r: HttpResponse<boolean>) => this.finalizarEliminarOk(),
          error: (error) => this.finalizarEliminarError(error),
        });
    });
  }

  private finalizarEliminarOk(): void {
    this.griProblemaFactorSubSolucion.loading = false;
    this.enProcesoSolicitud = false;
    this._alertaService.mensajeIcon('¡Eliminado!', 'Se eliminaron los registros.', 'success');
    this.obtenerSubSoluciones();
  }

  private finalizarEliminarError(error: any): void {
    this.griProblemaFactorSubSolucion.loading = false;
    this.enProcesoSolicitud = false;
    const mensaje = this._alertaService.getMessageErrorService(error);
    this._alertaService.notificationWarning(mensaje);
  }
}

function rid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

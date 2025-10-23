import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';

import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormService } from '@shared/services/form.service';
import { PgeneralService } from '@planificacion/services/pgeneral.service';

import { CompuestoProblemaModalidadAlternoDTO } from '@planificacion/models/interfaces/pgeneral/pgeneral';

type Opcion = { id: number; nombre: string };

@Component({
  selector: 'app-pg-problemas-cliente-v2',
  templateUrl: './pg-problemas-cliente-v2.component.html',
  styleUrls: ['./pg-problemas-cliente-v2.component.scss'],
})
export class PgProblemasClienteV2Component implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService
  ) {}

  @Input() pgeneralService!: PgeneralService;


  gridProblemasCliente = new KendoGrid<CompuestoProblemaModalidadAlternoDTO>();

 
  modalRef: any;
  loaderModal = false;
  esNuevo = true;

  formProblema: FormGroup = this.formBuilder.group({
    id: 0,
    idPGeneral: 0,

    problemaId: [null, Validators.required],
    detalleId: [null, Validators.required],
    detalleTituloId: [null],
    solucionTituloId: [null],
    solucionSubTituloId: [null],
    solucionDescripcionId: [null],


    subSolucionesIds: [[] as number[]],
  });

  // ===== Combos (opciones) =====
  ddlDefault: Opcion = { id: null as unknown as number, nombre: 'Seleccionar...' };

  opcProblema: Opcion[] = [];
  opcDetalle: Opcion[] = [];
  opcDetalleTitulo: Opcion[] = [];
  opcSolucionTitulo: Opcion[] = [];
  opcSolucionSubTitulo: Opcion[] = [];
  opcSolucionDescripcion: Opcion[] = [];

  // ===== SubSoluciones (MultiSelect) =====
  subSolucionesCatalogo: Opcion[] = [];
  subSolucionesLoading = false;

  // ===== Ciclo de vida =====
  ngOnInit(): void {
    this.cargarGrid();
    this.cargarCombosBasicos();
    this.cargarSubSoluciones();
  }

  // ===== Helpers =====
  get dataItemPgeneral() {
    return this.pgeneralService?.dataItemPgeneral;
  }
  getErrorMessage(controlName: string): string {
    const c: FormControl = this.formProblema.get(controlName) as FormControl;
    return this.formService.errorMessage(c, controlName);
  }

  // ===== Grid =====
  cargarGrid() {
    this.gridProblemasCliente.data = [];
    this.pgeneralService.configuracionCliente$.subscribe((resp) => {
      if (resp != null) {
        this.gridProblemasCliente.data = resp.problemas ?? [];
      }
    });
  }

  // ===== Abrir modal (insertar / editar) =====
  abrirModal(context: any, esNuevo: boolean, dataItem?: any) {
    this.esNuevo = esNuevo;

    // Reset
    this.formProblema.reset({
      id: 0,
      idPGeneral: this.dataItemPgeneral?.id ?? 0,

      problemaId: null,
      detalleId: null,
      detalleTituloId: null,
      solucionTituloId: null,
      solucionSubTituloId: null,
      solucionDescripcionId: null,
      subSolucionesIds: [],
    });

    // Si es edición, preseleccionar
    if (!esNuevo && dataItem) {
      // Si tu item trae IDs, úsalos; si trae nombres, resolvemos ID por nombre.
      const getId = (lista: Opcion[], idField: any, nameField: any) =>
        this.resolveId(lista, idField, nameField);

      const subIds = (dataItem.subSoluciones ?? [])
        .map((s: any) => s?.id)
        .filter((x: any) => typeof x === 'number');

      this.formProblema.patchValue({
        id: dataItem.id ?? 0,
        idPGeneral: this.dataItemPgeneral?.id ?? 0,

        problemaId: getId(this.opcProblema, dataItem.problemaId, dataItem.nombreProblema),
        detalleId: getId(this.opcDetalle, dataItem.detalleId, dataItem.detalle),
        detalleTituloId: getId(this.opcDetalleTitulo, dataItem.detalleTituloId, dataItem.detalleTitulo),
        solucionTituloId: getId(this.opcSolucionTitulo, dataItem.solucionTituloId, dataItem.solucionTitulo),
        solucionSubTituloId: getId(this.opcSolucionSubTitulo, dataItem.solucionSubTituloId, dataItem.solucionSubTitulo),
        solucionDescripcionId: getId(this.opcSolucionDescripcion, dataItem.solucionDescripcionId, dataItem.solucionDescripcion),

        subSolucionesIds: subIds,
      });
    }


    if (!this.opcProblema.length) this.cargarCombosBasicos();
    if (!this.subSolucionesCatalogo.length) this.cargarSubSoluciones();

    // Abrir modal
    this.modalRef = this.modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });
  }

  // ===== Cargar combos =====
  private cargarCombosBasicos(): void {
    const idPG = this.dataItemPgeneral?.id ?? 0;


    const urls = {
      problema: `/planif/fake/opciones/problemas/${idPG}`,
      detalle: `/planif/fake/opciones/detalles/${idPG}`,
      detTitulo: `/planif/fake/opciones/detalle-titulos/${idPG}`,
      solTitulo: `/planif/fake/opciones/sol-titulos/${idPG}`,
      solSubTitulo: `/planif/fake/opciones/sol-subtitulos/${idPG}`,
      solDesc: `/planif/fake/opciones/sol-descripciones/${idPG}`,
    };


    this.loadCombo(urls.problema, this.getDummy('problema'), (data) => (this.opcProblema = data));
    this.loadCombo(urls.detalle, this.getDummy('detalle'), (data) => (this.opcDetalle = data));
    this.loadCombo(urls.detTitulo, this.getDummy('detalleTitulo'), (data) => (this.opcDetalleTitulo = data));
    this.loadCombo(urls.solTitulo, this.getDummy('solTitulo'), (data) => (this.opcSolucionTitulo = data));
    this.loadCombo(urls.solSubTitulo, this.getDummy('solSubTitulo'), (data) => (this.opcSolucionSubTitulo = data));
    this.loadCombo(urls.solDesc, this.getDummy('solDesc'), (data) => (this.opcSolucionDescripcion = data));
  }

  private loadCombo(url: string, fallback: Opcion[], assign: (data: Opcion[]) => void) {
    this.integraService.getJsonResponse(url).subscribe({
      next: (resp: HttpResponse<Opcion[]>) => assign((resp.body ?? []).length ? (resp.body as Opcion[]) : fallback),
      error: () => assign(fallback),
    });
  }

  private getDummy(tipo: string): Opcion[] {
    const make = (arr: string[]) => arr.map((n, i) => ({ id: 1000 + i, nombre: n }));
    switch (tipo) {
      case 'problema':
        return make(['Problema A', 'Problema B', 'Problema C']);
      case 'detalle':
        return make(['Detalle 1', 'Detalle 2', 'Detalle 3']);
      case 'detalleTitulo':
        return make(['Tit Det 1', 'Tit Det 2']);
      case 'solTitulo':
        return make(['Tit Sol 1', 'Tit Sol 2']);
      case 'solSubTitulo':
        return make(['SubTit 1', 'SubTit 2', 'SubTit 3']);
      case 'solDesc':
        return make(['Desc 1', 'Desc 2', 'Desc 3']);
      default:
        return [];
    }
  }

  private cargarSubSoluciones() {
    this.subSolucionesLoading = true;
    const idPG = this.dataItemPgeneral?.id ?? 0;
    const url = `/planif/fake/subsoluciones/${idPG}`; // Reemplaza por tu endpoint real

    this.integraService.getJsonResponse(url).subscribe({
      next: (resp: HttpResponse<Opcion[]>) => {
        const body = resp.body ?? [];
        this.subSolucionesCatalogo = body.length ? body : this.getDummySubSoluciones();
        this.subSolucionesLoading = false;
      },
      error: () => {
        this.subSolucionesCatalogo = this.getDummySubSoluciones();
        this.subSolucionesLoading = false;
      },
    });
  }

  private getDummySubSoluciones(): Opcion[] {
    return [
      { id: 201, nombre: 'SubSolución 1' },
      { id: 202, nombre: 'SubSolución 2' },
      { id: 203, nombre: 'SubSolución 3' },
      { id: 204, nombre: 'SubSolución 4' },
      { id: 205, nombre: 'SubSolución 5' },
      { id: 206, nombre: 'SubSolución 6' },
    ];
  }

  // ===== Guardar =====
  guardar() {
    if (this.formProblema.invalid) {
      this.formProblema.markAllAsTouched();
      return;
    }

    const v = this.formProblema.value;


    const subSolObjects = (v.subSolucionesIds as number[]).map((id) => ({
      id,
      nombre: this.subSolucionesCatalogo.find((s) => s.id === id)?.nombre ?? '',
    }));

    const payload = {
      id: v.id ?? 0,
      idPGeneral: v.idPGeneral ?? this.dataItemPgeneral?.id ?? 0,

      problemaId: v.problemaId,
      detalleId: v.detalleId,
      detalleTituloId: v.detalleTituloId,
      solucionTituloId: v.solucionTituloId,
      solucionSubTituloId: v.solucionSubTituloId,
      solucionDescripcionId: v.solucionDescripcionId,

      subSolucionesIds: v.subSolucionesIds as number[], 
      subSoluciones: subSolObjects,                  
    };

    this.loaderModal = true;
    const url = this.esNuevo ? '/planif/fake/problemas/insertar' : '/planif/fake/problemas/actualizar';

    this.integraService.postJsonResponse(url, JSON.stringify(payload)).subscribe({
      next: (_resp: HttpResponse<any>) => {
        this.loaderModal = false;
        this.modalRef?.close();
        this.alertaService.mensajeExitoso();
        this.cargarGrid();
      },
      error: (err) => {
        this.loaderModal = false;
        this.alertaService.notificationError(
          this.alertaService.getMessageErrorService(err) || 'No se pudo guardar'
        );
      },
    });
  }


  impresionModalidad(dataItem: CompuestoProblemaModalidadAlternoDTO): string {
    return (dataItem.modalidades ?? []).map((x: any) => x.nombre).join(', ');
  }


  private resolveId(lista: Opcion[], rawId: any, rawNombre: any): number | null {
    if (typeof rawId === 'number' && !isNaN(rawId)) return rawId;
    if (rawNombre == null || rawNombre === '') return null;
    const found = lista.find((x) => (x.nombre || '').toString().trim() === (rawNombre || '').toString().trim());
    return found?.id ?? null;
  }
}

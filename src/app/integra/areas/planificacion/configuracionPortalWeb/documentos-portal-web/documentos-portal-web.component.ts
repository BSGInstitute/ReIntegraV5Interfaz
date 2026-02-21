import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion, constApiGlobal } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  SeccionPlantillaPw,
  DocumentoSeccionPw,
  ColumnasReporte,
  IDocumentosPortaWeb,
  SubSeccionTipoDetallePw,
  ListaSubSeccionesPw,
  ListaGridListaSecciones,
  SeccionPwFiltroPlantillaPw,
  EnvioDocumento,
  DocumentoPw,
  VersionDocumentoBeneficio,
} from '@planificacion/models/interfaces/documentosportalweb';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

interface versionesDPW {
  Id: number;
  IdDocumentoPw: number;
  introduccion: string;
  idVersionPrograma: number;
}

type ModalidadId = number;
type InfoTipo = 'HORA' | 'BENEFICIO';

export interface ModalidadPortal {
  id: number;
  nombre: string;
  propiedad: string;
}

interface PaisCombo {
  id?: number;
  codigoPais: number;
  nombrePais: string;
}

interface InfoVM {
  idDetalle?: number;
  etiqueta: string;
  tipo: InfoTipo;
  valor: number | null;
  valorTexto: string;
  horario: string;
}

interface ModalidadVM {
  id?: number;
  idModalidad: ModalidadId | null;
  subtitulo: string;
  descripcion: string;
  informacion: InfoVM[];
  _prevIdModalidad?: ModalidadId | null;
}

interface DuracionDetalleVM {
  idDetalle?: number;
  idVersionPrograma: number | null;
  meses: string;
  horas: string;
  _prevIdVersionPrograma?: number | null;
}

interface FechaInicioDetalleVM {
  idDetalle?: number;
  idModo: number | null;
  fecha: any;
  horario: string;
  _prevIdModo?: number | null;
}

interface FechaInicioPaisVM {
  id?: number;
  idPais: number | null;
  detalles: FechaInicioDetalleVM[];
  _prevIdPais?: number | null;
}
type NotaInfoTipo = 'EXTRA' | 'HORA';

interface NotaDetalleVM {
  idDetalle?: number;
  etiqueta: string;
  tipo: NotaInfoTipo;
  valorTexto: string;
  idPais: number | null;
  horario: string;
}

interface NotaVM {
  id?: number;
  idNotaTipo: number | null;
  descripcion: string;
  detalles: NotaDetalleVM[];
  _prevIdNotaTipo?: number | null;
}
@Component({
  selector: 'app-documentos-portal-web',
  templateUrl: './documentos-portal-web.component.html',
  styleUrls: ['./documentos-portal-web.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DocumentosPortalWebComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) { }

  gridDocumentosPw = new KendoGrid();
  gridListaRevisionNivel = new KendoGrid();
  listaSeleccion: number[] = [];
  comboPlantilla: IComboBase1[];
  dataVersion: versionesDPW[] = [];
  plantillas: SeccionPlantillaPw[] = [];
  documentos: DocumentoSeccionPw[] = [];
  loaderModal: boolean = false;
  htmlPlantilla: any;
  esNuevo: boolean = false;
  modalRef: NgbModalRef = null;
  listaColumna: ColumnasReporte[] = [];
  notasMostrarEnLaWeb = false;

  programaGenerales: IComboBase1[] = [];
  ListaNotasTipo: IComboBase1[] = [];

  listaNotas: NotaVM[] = [];
  notaActivaIndex: number | null = null;

  notasEliminadas: number[] = [];
  notasDetallesEliminados: number[] = [];
  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  sort: SortDescriptor[] = [
    {
      field: 'idSeccionTipoDetallePw',
      dir: 'asc',
    },
  ];

  columnasReporte: any[] = [
    {
      field: null,
      title: null,
      width: 100,
    },
  ];

  idPlantilla!: number;

  introduccionModalidad = '';

  listaModalidad: ModalidadPortal[] = [];

  comboHoras: IComboBase1[] = [];

  listaModalidadHorarios: ModalidadVM[] = [];
  modalidadActivaIndex: number | null = null;

  modalidadesEliminadas: number[] = [];
  detallesEliminados: number[] = [];

  tituloDuracion = '';
  introduccionDuracion = '';
  pieDePaginaDuracion = '';
  comboVersionPrograma: IComboBase1[] = [];
  listaDuracionDetalle: DuracionDetalleVM[] = [];
  duracionDetallesEliminados: number[] = [];

  fechaInicioMostrarEnLaWeb = false;
  fechaInicioTitulo = '';
  fechaInicioSubTitulo = '';

  comboFechaInicioPaises: PaisCombo[] = [];

  listaFechaInicioPaises: FechaInicioPaisVM[] = [];
  fechaInicioPaisActivoIndex: number | null = null;

  fechaInicioPaisesEliminados: number[] = [];
  fechaInicioDetallesEliminados: number[] = [];

  obtenerModalidadPortal() {
    this.integraService
      .getJsonResponse(constApiPlanificacion.DocumentoPWObtenerModalidadPortal)
      .subscribe({
        next: (resp: HttpResponse<ModalidadPortal[]>) => {
          this.listaModalidad = resp.body ?? [];
          this.refrescarEtiquetasModalidad();
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  private refrescarEtiquetasModalidad() {
    (this.listaModalidadHorarios ?? []).forEach((m) => this.reindexEtiquetas(m));
  }

  private etiquetaBaseModalidadFallback(idModalidad: number | null, tipoFallback?: any): string {
    const base = this.etiquetaBaseModalidad(idModalidad);
    if (base && base !== 'Información') return base;

    const t = ((tipoFallback ?? '') + '').trim().toUpperCase();
    if (t.includes('HORA')) return 'Hora';
    if (t.includes('BENEF')) return 'Beneficio';
    return 'Información';
  }
  private propiedadModalidad(idModalidad: number | null): string {
    const m = (this.listaModalidad ?? []).find((x) => x.id === idModalidad);
    return (m?.propiedad ?? '').trim();
  }

  private textoPropiedadModalidad(idModalidad: number | null): string {
    const p = this.propiedadModalidad(idModalidad);
    if (!p) return '';
    if (p === p.toUpperCase()) {
      return p.charAt(0) + p.slice(1).toLowerCase();
    }
    return p;
  }

  private tipoPropiedadModalidad(idModalidad: number | null): InfoTipo | null {
    const p = this.propiedadModalidad(idModalidad).toUpperCase();
    if (!p) return null;
    if (p.includes('HORA')) return 'HORA';
    if (p.includes('BENEF')) return 'BENEFICIO';
    return 'BENEFICIO';
  }

  private etiquetaBaseModalidad(idModalidad: number | null): string {
    const t = this.textoPropiedadModalidad(idModalidad);
    return t || 'Información';
  }

  private modalidadesDisponibles(): ModalidadPortal[] {
    const usadas = new Set(
      this.listaModalidadHorarios
        .map((x) => x.idModalidad)
        .filter((x): x is number => x !== null && x !== undefined)
    );
    return (this.listaModalidad ?? []).filter((x) => !usadas.has(x.id));
  }

  obtenerComboModalidades(mi: number): ModalidadPortal[] {
    const combo = this.listaModalidad ?? [];
    if (!combo.length) return [];

    const actual = this.listaModalidadHorarios[mi]?.idModalidad ?? null;

    const usadas = new Set(
      this.listaModalidadHorarios
        .map((x, idx) => (idx === mi ? null : x.idModalidad))
        .filter((x): x is number => x !== null && x !== undefined)
    );

    return combo.filter((x) => x.id === actual || !usadas.has(x.id));
  }

  puedeAgregarModalidad(): boolean {
    const combo = this.listaModalidad ?? [];
    if (!combo.length) {
      return !this.listaModalidadHorarios.some((x) => x.idModalidad === null);
    }
    return (
      this.modalidadesDisponibles().length > 0 &&
      this.listaModalidadHorarios.length < combo.length
    );
  }

  puedeAgregarInformacion(): boolean {
    if (this.modalidadActivaIndex === null) return false;
    const mod = this.listaModalidadHorarios[this.modalidadActivaIndex];
    return mod?.idModalidad !== null && mod?.idModalidad !== undefined;
  }

  agregarModalidadHorario() {
    const combo = this.listaModalidad ?? [];

    if (!combo.length) {
      if (this.listaModalidadHorarios.some((x) => x.idModalidad === null)) return;

      const nueva: ModalidadVM = {
        idModalidad: null,
        subtitulo: '',
        descripcion: '',
        informacion: [],
        _prevIdModalidad: null,
      };

      this.listaModalidadHorarios.push(nueva);
      this.modalidadActivaIndex = this.listaModalidadHorarios.length - 1;
      return;
    }

    const disponibles = this.modalidadesDisponibles();
    if (!disponibles.length) return;

    const m = disponibles[0];

    const nuevaModalidad: ModalidadVM = {
      idModalidad: m.id,
      subtitulo: '',
      descripcion: '',
      informacion: [],
      _prevIdModalidad: m.id,
    };

    this.listaModalidadHorarios.push(nuevaModalidad);
    this.modalidadActivaIndex = this.listaModalidadHorarios.length - 1;

    this.inicializarInformacion(this.modalidadActivaIndex);
  }

  cambioModalidad(mi: number, nuevoValor: number | null) {
    const mod = this.listaModalidadHorarios[mi];
    if (!mod) return;

    if (nuevoValor !== null && nuevoValor !== undefined) {
      const duplicada = this.listaModalidadHorarios.some(
        (x, idx) => idx !== mi && x.idModalidad === nuevoValor
      );
      if (duplicada) {
        mod.idModalidad = mod._prevIdModalidad ?? null;
        alert('Ya existe esa modalidad. Solo se permite 1 de cada tipo.');
        return;
      }
    }

    mod.idModalidad = nuevoValor;
    mod._prevIdModalidad = nuevoValor;

    this.modalidadActivaIndex = mi;
    this.inicializarInformacion(mi);
  }

  private inicializarInformacion(mi: number) {
    const mod = this.listaModalidadHorarios[mi];
    if (!mod) return;

    mod.informacion = [];

    const tipo = this.tipoPropiedadModalidad(mod.idModalidad);
    if (!tipo) return;

    const base = this.etiquetaBaseModalidad(mod.idModalidad);

    mod.informacion.push({
      etiqueta: `${base} 1`,
      tipo,
      valor: null,
      valorTexto: '',
      horario: '',
    });
  }

  obtenerTextoAgregarInformacion() {
    if (this.modalidadActivaIndex === null) return 'Agregar Información';
    const mod = this.listaModalidadHorarios[this.modalidadActivaIndex];
    if (mod?.idModalidad === null || mod?.idModalidad === undefined) return 'Agregar Información';
    const base = this.etiquetaBaseModalidad(mod.idModalidad);
    return `Agregar ${base}`;
  }

  agregarInformacionHorario() {
    if (!this.puedeAgregarInformacion()) return;

    const idx = this.modalidadActivaIndex as number;
    const mod = this.listaModalidadHorarios[idx];
    if (!mod) return;

    if (!mod.informacion) mod.informacion = [];

    const tipo = this.tipoPropiedadModalidad(mod.idModalidad);
    if (!tipo) return;

    const base = this.etiquetaBaseModalidad(mod.idModalidad);
    const n = mod.informacion.filter((x) => x.tipo === tipo).length + 1;

    mod.informacion.push({
      etiqueta: `${base} ${n}`,
      tipo,
      valor: null,
      valorTexto: '',
      horario: '',
    });
  }

  seleccionarModalidad(mi: number) {
    this.modalidadActivaIndex = mi;
  }

  esOnlineEnVivo(idModalidad: number | null): boolean {
    const m = (this.listaModalidad ?? []).find(x => x.id === idModalidad);
    return (m?.nombre ?? '').toLowerCase().includes('online en vivo');
  }

  eliminarInformacionHorario(mi: number, ii: number) {
    const mod = this.listaModalidadHorarios[mi];
    if (!mod?.informacion) return;

    const item = mod.informacion[ii];
    if (item?.idDetalle && item.idDetalle > 0) {
      this.detallesEliminados.push(item.idDetalle);
    }

    mod.informacion.splice(ii, 1);
    this.reindexEtiquetas(mod);
  }

  eliminarModalidad(mi: number, ev?: MouseEvent) {
    ev?.stopPropagation();

    const mod = this.listaModalidadHorarios[mi];
    if (!mod) return;

    (mod.informacion ?? []).forEach((d) => {
      if (d?.idDetalle && d.idDetalle > 0) this.detallesEliminados.push(d.idDetalle);
    });

    if (mod.id && mod.id > 0) this.modalidadesEliminadas.push(mod.id);

    this.listaModalidadHorarios.splice(mi, 1);

    if (this.modalidadActivaIndex === null) return;
    if (this.listaModalidadHorarios.length === 0) {
      this.modalidadActivaIndex = null;
      return;
    }

    if (this.modalidadActivaIndex >= this.listaModalidadHorarios.length) {
      this.modalidadActivaIndex = this.listaModalidadHorarios.length - 1;
    }
  }

  private reindexEtiquetas(mod: ModalidadVM) {
    if (!mod?.informacion?.length) return;
    const base = this.etiquetaBaseModalidad(mod.idModalidad);
    mod.informacion.forEach((x, i) => {
      x.etiqueta = `${base} ${i + 1}`;
    });
  }

  obtenerComboVersionPrograma() {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.VersionProgramaObtener}`)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.comboVersionPrograma = resp.body ?? [];
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  private versionesDisponiblesDuracion(): IComboBase1[] {
    const usados = new Set(
      this.listaDuracionDetalle
        .map((x) => x.idVersionPrograma)
        .filter((x): x is number => x !== null && x !== undefined)
    );
    return (this.comboVersionPrograma ?? []).filter((x) => !usados.has(x.id));
  }

  obtenerComboVersionProgramaDuracion(di: number): IComboBase1[] {
    const actual = this.listaDuracionDetalle[di]?.idVersionPrograma ?? null;

    const usados = new Set(
      this.listaDuracionDetalle
        .map((x, idx) => (idx === di ? null : x.idVersionPrograma))
        .filter((x): x is number => x !== null && x !== undefined)
    );

    return (this.comboVersionPrograma ?? []).filter(
      (x) => x.id === actual || !usados.has(x.id)
    );
  }

  puedeAgregarDuracionDetalle(): boolean {
    return this.versionesDisponiblesDuracion().length > 0;
  }

  agregarDuracionDetalle() {
    const disponibles = this.versionesDisponiblesDuracion();
    if (!disponibles.length) return;

    const v = disponibles[0];

    this.listaDuracionDetalle.push({
      idVersionPrograma: v.id,
      meses: '',
      horas: '',
      _prevIdVersionPrograma: v.id,
    });
  }

  cambioVersionDuracion(di: number, nuevoId: number | null) {
    const det = this.listaDuracionDetalle[di];
    if (!det) return;

    if (nuevoId !== null && nuevoId !== undefined) {
      const duplicado = this.listaDuracionDetalle.some(
        (x, idx) => idx !== di && x.idVersionPrograma === nuevoId
      );
      if (duplicado) {
        det.idVersionPrograma = det._prevIdVersionPrograma ?? null;
        this.alertaService.notificationWarning(
          'Ya existe esa versión en Duración. Solo se permite 1 vez.'
        );
        return;
      }
    }

    det.idVersionPrograma = nuevoId;
    det._prevIdVersionPrograma = nuevoId;
  }

  eliminarDuracionDetalle(di: number, ev?: MouseEvent) {
    ev?.stopPropagation();

    const det = this.listaDuracionDetalle[di];
    if (!det) return;

    if (det.idDetalle && det.idDetalle > 0) {
      this.duracionDetallesEliminados.push(det.idDetalle);
    }

    this.listaDuracionDetalle.splice(di, 1);
  }

  obtenerComboPaisesFechaInicio(): void;
  obtenerComboPaisesFechaInicio(pi: number): IComboBase1[];
  obtenerComboPaisesFechaInicio(pi?: number): any {
    if (pi === undefined) {
      this.integraService.getJsonResponse(constApiGlobal.PaisObtenerPaisCombo).subscribe({
        next: (resp: HttpResponse<PaisCombo[]>) => {
          const raw: any[] = (resp.body as any) ?? [];
          this.comboFechaInicioPaises = raw.map((x: any) => ({
            id: x.id ?? x.Id ?? x.idPais ?? x.IdPais ?? x.codigoPais ?? x.CodigoPais ?? null,
            codigoPais: x.codigoPais ?? x.CodigoPais ?? 0,
            nombrePais: x.nombrePais ?? x.NombrePais ?? x.nombre ?? x.Nombre ?? '',
          }));
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
      return;
    }

    const combo = this.comboFechaInicioPaises ?? [];
    if (!combo.length) return [];

    const actual = this.listaFechaInicioPaises[pi]?.idPais ?? null;

    const usados = new Set(
      this.listaFechaInicioPaises
        .map((x, idx) => (idx === pi ? null : x.idPais))
        .filter((x): x is number => x !== null && x !== undefined)
    );

    return combo.filter((x) => x.id === actual || !usados.has(x.id));
  }

  private paisesDisponiblesFechaInicio(): PaisCombo[] {
    const usados = new Set(
      this.listaFechaInicioPaises
        .map((x) => x.idPais)
        .filter((x): x is number => x !== null && x !== undefined)
    );
    return (this.comboFechaInicioPaises ?? []).filter((x) => !usados.has(x.id));
  }

  puedeAgregarPaisFechaInicio(): boolean {
    const combo = this.comboFechaInicioPaises ?? [];
    if (!combo.length) {
      return !this.listaFechaInicioPaises.some((x) => x.idPais === null);
    }
    return this.paisesDisponiblesFechaInicio().length > 0;
  }

  agregarPaisFechaInicio() {
    const combo = this.comboFechaInicioPaises ?? [];

    if (!combo.length) {
      if (this.listaFechaInicioPaises.some((x) => x.idPais === null)) return;

      this.listaFechaInicioPaises.push({
        idPais: null,
        detalles: [],
        _prevIdPais: null,
      });

      this.fechaInicioPaisActivoIndex = this.listaFechaInicioPaises.length - 1;
      return;
    }

    const disponibles = this.paisesDisponiblesFechaInicio();
    if (!disponibles.length) return;

    const p = disponibles[0];

    this.listaFechaInicioPaises.push({
      idPais: p.id,
      detalles: [],
      _prevIdPais: p.id,
    });

    this.fechaInicioPaisActivoIndex = this.listaFechaInicioPaises.length - 1;
  }

  seleccionarPaisFechaInicio(pi: number) {
    this.fechaInicioPaisActivoIndex = pi;
  }

  cambioPaisFechaInicio(pi: number, nuevoIdPais: number | null) {
    this.fechaInicioPaisActivoIndex = pi;

    const pais = this.listaFechaInicioPaises[pi];
    if (!pais) return;

    if (nuevoIdPais !== null && nuevoIdPais !== undefined) {
      const duplicado = this.listaFechaInicioPaises.some(
        (x, idx) => idx !== pi && x.idPais === nuevoIdPais
      );
      if (duplicado) {
        pais.idPais = pais._prevIdPais ?? null;
        this.alertaService.notificationWarning('Ese país ya fue agregado.');
        return;
      }
    }

    pais.idPais = nuevoIdPais;
    pais._prevIdPais = nuevoIdPais;
  }

  private modosDisponiblesFechaInicio(pi: number): IComboBase1[] {
    const pais = this.listaFechaInicioPaises[pi];
    if (!pais) return [];

    const usados = new Set(
      (pais.detalles ?? [])
        .map((d) => d.idModo)
        .filter((x): x is number => x !== null && x !== undefined)
    );

    return (this.listaModoFechaInicio ?? []).filter((m) => !usados.has(m.id));
  }

  puedeAgregarModoFechaInicio(): boolean {
    if (this.fechaInicioPaisActivoIndex === null) return false;
    const pi = this.fechaInicioPaisActivoIndex as number;
    const pais = this.listaFechaInicioPaises[pi];
    if (!pais || pais.idPais === null || pais.idPais === undefined) return false;
    return this.modosDisponiblesFechaInicio(pi).length > 0;
  }

  agregarModoFechaInicio() {
    if (this.fechaInicioPaisActivoIndex === null) return;

    const pi = this.fechaInicioPaisActivoIndex as number;
    const pais = this.listaFechaInicioPaises[pi];
    if (!pais) return;

    const disponibles = this.modosDisponiblesFechaInicio(pi);
    if (!disponibles.length) return;

    const m = disponibles[0];

    if (!pais.detalles) pais.detalles = [];
    pais.detalles.push({
      idModo: m.id,
      fecha: null,
      horario: '',
      _prevIdModo: m.id,
    });
  }

  cambioModoFechaInicio(pi: number, di: number, nuevoIdModo: number | null) {
    const pais = this.listaFechaInicioPaises[pi];
    if (!pais?.detalles) return;

    const det = pais.detalles[di];
    if (!det) return;

    if (nuevoIdModo !== null && nuevoIdModo !== undefined) {
      const duplicado = pais.detalles.some(
        (x, idx) => idx !== di && x.idModo === nuevoIdModo
      );
      if (duplicado) {
        det.idModo = det._prevIdModo ?? null;
        this.alertaService.notificationWarning(
          'Ese modo ya fue agregado en este país.'
        );
        return;
      }
    }

    det.idModo = nuevoIdModo;
    det._prevIdModo = nuevoIdModo;
  }

  eliminarDetalleFechaInicio(pi: number, di: number, ev?: MouseEvent) {
    ev?.stopPropagation();

    const pais = this.listaFechaInicioPaises[pi];
    if (!pais?.detalles) return;

    const det = pais.detalles[di];
    if (det?.idDetalle && det.idDetalle > 0)
      this.fechaInicioDetallesEliminados.push(det.idDetalle);

    pais.detalles.splice(di, 1);
  }

  eliminarPaisFechaInicio(pi: number, ev?: MouseEvent) {
    ev?.stopPropagation();

    const pais = this.listaFechaInicioPaises[pi];
    if (!pais) return;

    (pais.detalles ?? []).forEach((d) => {
      if (d?.idDetalle && d.idDetalle > 0)
        this.fechaInicioDetallesEliminados.push(d.idDetalle);
    });

    if (pais.id && pais.id > 0) this.fechaInicioPaisesEliminados.push(pais.id);

    this.listaFechaInicioPaises.splice(pi, 1);

    if (this.fechaInicioPaisActivoIndex === null) return;
    if (this.listaFechaInicioPaises.length === 0) {
      this.fechaInicioPaisActivoIndex = null;
      return;
    }
    if (this.fechaInicioPaisActivoIndex >= this.listaFechaInicioPaises.length) {
      this.fechaInicioPaisActivoIndex = this.listaFechaInicioPaises.length - 1;
    }
  }

  formDatosDocumento: FormGroup = this.formBuilder.group({
    id: 0,
    nombre: [null, Validators.required],
    idPlantilla: [0, [Validators.required]],
  });

  formVersionBeneficios: FormGroup = this.formBuilder.group({
    Introduccion1: '',
    Introduccion2: '',
    Introduccion3: '',
  });

  ngOnInit(): void {
    this.obtenerComboPlantilla();
    this.obtenerModalidadPortal();
    this.obtenerComboVersionPrograma();
    this.obtenerComboPaisesFechaInicio();
    this.obtenerPaisesModalidad();
    this.generarReporte();
    this.obtenerModos();
    this.obtenerNotasTipo();
    this.obtenerProgramaGenerales();
  }

  obtenerComboPlantilla() {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.PlantillaPwObtenerPlantillaPw}`)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.comboPlantilla = resp.body;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerPlantillas(idPlantilla: number, documentos?: DocumentoSeccionPw[]) {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.PlantillaMaestroPwObtenerPlantillaSeccionMaestraPorIdPlantilla}/${idPlantilla}`
      )
      .subscribe({
        next: (resp: HttpResponse<SeccionPlantillaPw[]>) => {
          this.plantillas = [];
          if (documentos == null) {
            resp.body.forEach((e) => {
              if (e.idSeccionTipoContenido == 1) {
                e.cabecera = '';
                e.piePagina = '';
                e.idGrid = `grid_${e.id}_${e.id}`;
                e.listaSubSeccionesPw.forEach((f) => {
                  f.field = `_${f.idSeccionTipoDetallePw}_${e.id}`;
                });
                e.grid = new KendoGrid();
                this.configurarGridConsultasForo(e.grid, e.listaSubSeccionesPw);
              }
            });
          } else {
            resp.body.forEach((e) => {
              let seccionGrid = documentos.find((x) => x.idSeccionPW == e.id);
              if (e.idSeccionTipoContenido == 1) {
                if (seccionGrid != null) {
                  e.idGrid = `grid_${e.id}_${e.id}`;
                  e.listaSubSeccionesPw.forEach((f) => {
                    f.field = `_${f.idSeccionTipoDetallePw}_${e.id}`;
                  });
                  e.grid = new KendoGrid();
                  this.configurarGridConsultasForo(e.grid, e.listaSubSeccionesPw);
                  e.cabecera = seccionGrid.cabecera;
                  e.piePagina = seccionGrid.piePagina;
                  let numeroFilas = seccionGrid.listaSubSeccionesPw.map(
                    (x) => x.numeroFila
                  );
                  numeroFilas = Array.from(new Set(numeroFilas));
                  numeroFilas.forEach((x) => {
                    let fila = seccionGrid.listaSubSeccionesPw.filter(
                      (a) => a.numeroFila == x
                    );
                    let objGrid: { [key: string]: string } = {};
                    fila.forEach((i) => {
                      objGrid[
                        `_${i.idSeccionTipoDetallePw}_${seccionGrid.idSeccionPW}`
                      ] = i.contenidoSubSeccion;
                    });
                    e.grid.data.push(objGrid);
                  });
                } else {
                  e.idGrid = `grid_${e.id}_${e.id}`;
                  e.listaSubSeccionesPw = e.listaSubSeccionesPw;
                  e.grid = new KendoGrid();
                  e.cabecera = '';
                  e.piePagina = '';
                  e.listaSubSeccionesPw.forEach((f) => {
                    f.field = `_${f.idSeccionTipoDetallePw}_${e.id}`;
                  });
                  this.configurarGridConsultasForo(e.grid, e.listaSubSeccionesPw);
                }
              } else if (e.idSeccionTipoContenido == 2) {
                if (seccionGrid == undefined || seccionGrid == null) {
                  e.contenido = '';
                } else {
                  e.contenido = seccionGrid.contenido;
                }
              }
            });
          }
          this.plantillas = resp.body;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerDocumentosSeccionEditar(dataItem: IDocumentosPortaWeb) {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.DocumentoSeccionPwObtenerDocumentoSeccionEditar}/${dataItem.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<DocumentoSeccionPw[]>) => {
          this.documentos = [];
          this.documentos = resp.body;
          this.obtenerPlantillas(dataItem.idPlantillaPw, this.documentos);
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  crearObjetoDesdeLista(
    lista: ColumnasReporte[],
    data: SubSeccionTipoDetallePw[]
  ): Record<string, string> {
    const objetoResultado: Record<string, any> = {};

    for (const elemento of lista) {
      objetoResultado[elemento.field] = data.find(
        (e) => e.nombreSubSeccion == elemento.title
      ).contenidoSubSeccion;
    }
    0;
    return objetoResultado;
  }

  crearObjetoDesdeListaForm(
    lista: ListaSubSeccionesPw[]
  ): Record<string, string> {
    const objetoResultado: Record<string, any> = {};
    for (const elemento of lista) {
      objetoResultado[elemento.field] = null;
    }
    return objetoResultado;
  }

  generarReporte() {
    this.gridDocumentosPw.data = [];
    this.gridDocumentosPw.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.DocumentoPwObtenerTodo)
      .subscribe({
        next: (resp: HttpResponse<IDocumentosPortaWeb[]>) => {
          this.gridDocumentosPw.loading = false;
          this.gridDocumentosPw.data = resp.body;
          if (resp.body.length)
            this.alertaService.notificationSuccessBotom(
              'Documentos generados exitosamente.'
            );
          else this.alertaService.notificationSuccessBotom('Sin datos.');
        },
        error: (error) => {
          this.gridDocumentosPw.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  insertarDocumento() {
    if (this.formDatosDocumento.valid) {
      let data = this.objetoEnviar();
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.DocumentoPwInsertarDocumento,
          JSON.stringify(data)
        )
        .subscribe({
          next: (response: HttpResponse<DocumentoPw>) => {
            this.loaderModal = false;
            Swal.fire(
              '¡Creado!',
              'El documento ha sido creado correctamente.',
              'success'
            );
            this.generarReporte();
            this.modalRef.close();
          },
          error: (e) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          },
        });
    }
  }

  actualizarDocumento() {
    if (this.formDatosDocumento.valid) {
      let data = this.objetoEnviar();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.DocumentoPwActualizarDocumento,
          JSON.stringify(data)
        )
        .subscribe({
          next: (response: HttpResponse<DocumentoPw>) => {
            this.loaderModal = false;
            Swal.fire(
              '¡Actualizado!',
              'El documento ha sido modificado correctamente.',
              'success'
            );
            this.generarReporte();
            this.modalRef.close();
          },
          error: (e) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          },
        });
    }
  }

  eliminarDocumento(dataItem: IDocumentosPortaWeb) {
    this.alertaService
      .swalFireOptions({
        title: '¿Está seguro de Eliminar Documento?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.integraService
            .deleteJsonResponse(
              `${constApiPlanificacion.DocumentoPwEliminarDocumento}/${dataItem.id}`
            )
            .subscribe({
              next: (response: HttpResponse<Boolean[]>) => {
                this.loaderModal = false;
                Swal.fire(
                  '¡Eliminado!',
                  'Documento eliminado correctamente.',
                  'success'
                );
                this.generarReporte();
              },
              error: (error) => {
                this.loaderModal = false;
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
        }
      });
  }

  cargar: boolean = false;
  async abrirModalNuevoEditarDocumento(modal: any, dataItem?: IDocumentosPortaWeb) {
    this.formDatosDocumento.reset();
    this.formVersionBeneficios.reset();
    this.plantillas = [];
    this.documentos = [];

    this.introduccionModalidad = '';
    this.listaModalidadHorarios = [];
    this.modalidadActivaIndex = null;
    this.modalidadesEliminadas = [];
    this.detallesEliminados = [];

    this.tituloDuracion = '';
    this.introduccionDuracion = '';
    this.pieDePaginaDuracion = '';
    this.listaDuracionDetalle = [];
    this.duracionDetallesEliminados = [];

    this.fechaInicioMostrarEnLaWeb = false;
    this.fechaInicioTitulo = '';
    this.fechaInicioSubTitulo = '';
    this.listaFechaInicioPaises = [];
    this.fechaInicioPaisActivoIndex = null;
    this.fechaInicioPaisesEliminados = [];
    this.fechaInicioDetallesEliminados = [];

    if (dataItem) {
      this.esNuevo = false;
      this.formDatosDocumento.patchValue({
        id: dataItem.id,
        nombre: dataItem.nombre,
        idPlantilla: dataItem.idPlantillaPw,
      });
      this.obtenerDocumentosSeccionEditar(dataItem);
      const introducciones = await this.obtenerIntroduccion(dataItem.id);
      this.ObtenerDocumentoPWModalidad(dataItem.id);
      this.ObtenerDocumentoPWDuracion(dataItem.id);
      this.ObtenerDocumentoPWFechaInicio(dataItem.id);
      this.ObtenerDocumentoPWNotas(dataItem.id);
      this.asignarIntroducciones(introducciones);
    } else {
      this.esNuevo = true;
    }

    this.modalRef = this.modalService.open(modal, {
      size: 'xl',
      backdrop: 'static',
    });
  }

  obtenerNombrePlantilla(idPlantilla: number) {
    let item = this.comboPlantilla.find((x) => x.id === idPlantilla);
    return item?.nombre ?? 'Sin Plantilla';
  }

  configurarGridConsultasForo(gridPlantilla: KendoGrid, columnas: ListaSubSeccionesPw[]) {
    gridPlantilla.habilitarEstadoNewRow = true;
    gridPlantilla.formGroup = this.formBuilder.group(
      this.crearObjetoDesdeListaForm(columnas)
    );
    gridPlantilla.addEvent$.subscribe((resp) => { });
    gridPlantilla.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(resp.columnField).value;
    });
    gridPlantilla.removeEvent$.subscribe((resp) => {
      gridPlantilla.data.splice(resp.index, 1);
      gridPlantilla.data = [...gridPlantilla.data];
    });
    gridPlantilla.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as any;
      gridPlantilla.data = [valorForm, ...gridPlantilla.data];
    });
  }

  objetoEnviar() {
    let dataFrom = this.formDatosDocumento.getRawValue();
    let objDocumento: IDocumentosPortaWeb = {
      id: this.esNuevo ? 0 : dataFrom.id,
      nombre: dataFrom.nombre,
      idPlantillaPw: dataFrom.idPlantilla,
      estadoFlujo: 1,
    };

    let introduccionBasica: VersionDocumentoBeneficio = {
      IdVersionPrograma: 1,
      introduccion: this.formVersionBeneficios.get('Introduccion1').value,
    };
    let introduccionProfesional: VersionDocumentoBeneficio = {
      IdVersionPrograma: 2,
      introduccion: this.formVersionBeneficios.get('Introduccion2').value,
    };
    let introduccionGerencial: VersionDocumentoBeneficio = {
      IdVersionPrograma: 3,
      introduccion: this.formVersionBeneficios.get('Introduccion3').value,
    };

    let ListaIntroduccionVersiones: Array<VersionDocumentoBeneficio> = [];
    ListaIntroduccionVersiones.push(introduccionBasica);
    ListaIntroduccionVersiones.push(introduccionProfesional);
    ListaIntroduccionVersiones.push(introduccionGerencial);

    let listaPlantilla: SeccionPwFiltroPlantillaPw[] = [];
    this.plantillas.forEach((x) => {
      if (x.tipo == 0) {
        if (x.idSeccionTipoContenido == 2) {
          let objeto: SeccionPwFiltroPlantillaPw = {
            id: x.id,
            contenido: window.btoa(unescape(encodeURIComponent(x.contenido))),
            titulo: x.nombre,
            cabecera: x.cabecera ? x.cabecera : '',
            piePagina: '',
            idPlantillaPw: x.idPlantillaPw,
            idPlantilla: x.idPlantilla,
            posicion: x.posicion,
            tipo: x.tipo,
            idSeccionMaestroPw: x.idSeccionMaestraPw,
            nombreSeccionTipoContenido: 'Texto',
            zonaWeb: x.zonaWeb,
            visibleWeb: false,
            ordenEeb: x.ordenEeb,
            idSeccionTipoDetallePw: null,
            idSeccionPW: x.id,
            idSeccionTipoContenido: x.idSeccionTipoContenido,
          };

          objeto['listaGridListaSecciones'] = [];
          listaPlantilla.push(objeto);
        } else if (x.idSeccionTipoContenido == 1) {
          let valorListaSubSeccion;
          if (x.listaSubSeccionesPw[0] != undefined) {
            valorListaSubSeccion = x.listaSubSeccionesPw[0].idSeccionTipoDetallePw;
          } else {
            valorListaSubSeccion = 0;
          }
          let objeto: SeccionPwFiltroPlantillaPw = {
            id: x.id,
            contenido: '',
            titulo: x.nombre,
            cabecera: x.cabecera,
            piePagina: x.piePagina,
            idPlantillaPw: x.idPlantillaPw,
            idPlantilla: x.idPlantilla,
            posicion: x.posicion,
            tipo: x.tipo,
            idSeccionMaestroPw: x.idSeccionMaestraPw,
            nombreSeccionTipoContenido: 'Grilla',
            zonaWeb: x.zonaWeb,
            visibleWeb: false,
            ordenEeb: x.ordenEeb,
            idSeccionTipoDetallePw: valorListaSubSeccion,
            idSeccionPW: x.id,
            idSeccionTipoContenido: x.idSeccionTipoContenido,
            listaGridListaSecciones: [],
          };

          objeto['listaGridListaSecciones'] = [];

          let cont = 1;
          if (x.grid.data != undefined || x.grid.data != null) {
            x.grid.data.forEach((data: any) => {
              for (const key in data) {
                let dataGrilla: ListaGridListaSecciones = {
                  clave: key,
                  valor: data[key],
                  numeroFila: cont,
                };
                objeto.listaGridListaSecciones.push(dataGrilla);
              }
              cont++;
            });
          } else {
            x.grid.data.forEach((data: any) => {
              for (const key in data) {
                let dataGrilla: ListaGridListaSecciones = {
                  clave: '',
                  valor: '',
                  numeroFila: cont,
                };
                objeto.listaGridListaSecciones.push(dataGrilla);
              }
              cont++;
            });
          }

          listaPlantilla.push(objeto);
        }
      } else {
        let objeto: SeccionPwFiltroPlantillaPw = {
          id: x.id,
          contenido: window.btoa(unescape(encodeURIComponent(x.contenido))),
          titulo: x.nombre,
          cabecera: '',
          piePagina: '',
          idPlantillaPw: x.idPlantillaPw,
          idPlantilla: x.idPlantilla,
          posicion: x.posicion,
          tipo: x.tipo,
          idSeccionMaestroPw: x.idSeccionMaestraPw,
          zonaWeb: x.zonaWeb,
          visibleWeb: false,
          ordenEeb: x.ordenEeb,
          idSeccionTipoDetallePw: null,
          idSeccionPW: x.id,
          idSeccionTipoContenido: x.idSeccionTipoContenido,
        };

        objeto['listaGridListaSecciones'] = [];

        let cont = 1;
        if (x.grid.data != undefined || x.grid.data != null) {
          x.grid.data.forEach((data: any) => {
            for (const key in data) {
              let dataGrilla: ListaGridListaSecciones = {
                clave: key,
                valor: data[key],
                numeroFila: cont,
              };
              objeto.listaGridListaSecciones.push(dataGrilla);
            }
            cont++;
          });
        } else {
          x.grid.data.forEach((data: any) => {
            for (const key in data) {
              let dataGrilla: ListaGridListaSecciones = {
                clave: '',
                valor: '',
                numeroFila: cont,
              };
              objeto.listaGridListaSecciones.push(dataGrilla);
            }
            cont++;
          });
        }
        listaPlantilla.push(objeto);
      }
    });

    let envio: EnvioDocumento = {
      objetoDocumento: objDocumento,
      lista: listaPlantilla,
      listaIntroduccionBeneficios: ListaIntroduccionVersiones,
    };

    const hasModalidadHorario =
      (this.introduccionModalidad ?? '').trim().length > 0 ||
      (this.listaModalidadHorarios ?? []).some((m) => {
        const sub = (m.subtitulo ?? '').trim();
        const des = (m.descripcion ?? '').trim();
        const infoLen = (m.informacion ?? []).length;
        return (
          (m.id ?? 0) > 0 ||
          (m.idModalidad ?? null) !== null ||
          sub.length > 0 ||
          des.length > 0 ||
          infoLen > 0
        );
      }) ||
      (this.modalidadesEliminadas ?? []).length > 0 ||
      (this.detallesEliminados ?? []).length > 0;

    const seccionModalidadHorario = hasModalidadHorario
      ? {
        idDocumentoPw: objDocumento.id,
        introduccion: this.introduccionModalidad,
        modalidades: this.listaModalidadHorarios.map((m) => ({
          id: m.id ?? 0,
          idModalidad: m.idModalidad,
          subTitulo: m.subtitulo,
          descripcion: m.descripcion,
          detalles: (m.informacion ?? []).map((d, i) => ({
            id: d.idDetalle ?? 0,
            orden: i + 1,
            tipo: d.tipo,
            idPais: d.tipo === 'HORA' ? d.valor : null,
            beneficio: d.tipo === 'BENEFICIO' ? d.valorTexto : null,
            horario: d.horario ?? '',
          })),
        })),
        modalidadesEliminadas: this.modalidadesEliminadas,
        detallesEliminados: this.detallesEliminados,
      }
      : null;

    const hasDuracion =
      (this.tituloDuracion ?? '').trim().length > 0 ||
      (this.introduccionDuracion ?? '').trim().length > 0 ||
      (this.pieDePaginaDuracion ?? '').trim().length > 0 ||
      (this.listaDuracionDetalle ?? []).length > 0 ||
      (this.duracionDetallesEliminados ?? []).length > 0;

    const seccionDuracion = hasDuracion
      ? {
        idDocumentoPw: objDocumento.id,
        titulo: this.tituloDuracion,
        introduccion: this.introduccionDuracion,
        pieDePagina: this.pieDePaginaDuracion,
        detalles: this.listaDuracionDetalle.map((d) => ({
          id: d.idDetalle ?? 0,
          idVersionPrograma: d.idVersionPrograma,
          meses: d.meses,
          horas: d.horas,
        })),
        detallesEliminados: this.duracionDetallesEliminados,
      }
      : null;

    const paisesFechaInicioLimpios = (this.listaFechaInicioPaises ?? [])
      .map((p) => {
        const detallesLimpios = (p.detalles ?? []).filter((d) => {
          const tieneAlgo =
            (d.idDetalle ?? 0) > 0 ||
            (d.idModo !== null && d.idModo !== undefined) ||
            (d.fecha !== null && d.fecha !== undefined) ||
            (d.horario ?? '').trim().length > 0;
          return tieneAlgo;
        });

        return {
          ...p,
          detalles: detallesLimpios,
        };
      })
      .filter((p) => {
        const tieneAlgo =
          (p.id ?? 0) > 0 ||
          (p.idPais !== null && p.idPais !== undefined) ||
          (p.detalles ?? []).length > 0;
        return tieneAlgo;
      });

    const hasFechaInicio =
      this.fechaInicioMostrarEnLaWeb === true ||
      (this.fechaInicioTitulo ?? '').trim().length > 0 ||
      (this.fechaInicioSubTitulo ?? '').trim().length > 0 ||
      paisesFechaInicioLimpios.length > 0 ||
      (this.fechaInicioPaisesEliminados ?? []).length > 0 ||
      (this.fechaInicioDetallesEliminados ?? []).length > 0;

    const seccionFechaInicio = hasFechaInicio
      ? {
        idDocumentoPw: objDocumento.id,
        mostrarEnLaWeb: this.fechaInicioMostrarEnLaWeb,
        titulo: this.fechaInicioTitulo,
        subTitulo: this.fechaInicioSubTitulo,
        paises: paisesFechaInicioLimpios.map((p) => ({
          id: p.id ?? 0,
          idPais: p.idPais,
          detalles: (p.detalles ?? []).map((d) => ({
            id: d.idDetalle ?? 0,
            idModo: d.idModo,
            fecha: d.fecha,
            horario: d.horario,
          })),
        })),
        paisesEliminados: this.fechaInicioPaisesEliminados,
        detallesEliminados: this.fechaInicioDetallesEliminados,
      }
      : null;

    const notasLimpias = (this.listaNotas ?? [])
      .map((n) => {
        const detallesLimpios = (n.detalles ?? []).filter((d) => {
          if ((d.idDetalle ?? 0) > 0) return true;
          if (d.tipo === 'EXTRA') return (d.valorTexto ?? '').trim().length > 0;
          if (d.tipo === 'HORA') return d.idPais !== null && d.idPais !== undefined;
          return false;
        });

        return {
          ...n,
          detalles: detallesLimpios,
        };
      })
      .filter((n) => {
        const desc = (n.descripcion ?? '').trim();
        const tieneAlgo =
          (n.id ?? 0) > 0 ||
          desc.length > 0 ||
          (n.detalles ?? []).length > 0;
        return tieneAlgo;
      });

    const hasNotas =
      this.notasMostrarEnLaWeb === true ||
      notasLimpias.length > 0 ||
      (this.notasEliminadas ?? []).length > 0 ||
      (this.notasDetallesEliminados ?? []).length > 0;

    const seccionNotas = hasNotas
      ? {
        idDocumentoPw: objDocumento.id,
        mostrarEnLaWeb: this.notasMostrarEnLaWeb,
        notas: notasLimpias.map((n) => ({
          id: n.id ?? 0,
          idNotaTipo: n.idNotaTipo,
          descripcion: n.descripcion,
          detalles: (n.detalles ?? []).map((d, i) => ({
            id: d.idDetalle ?? 0,
            orden: i + 1,
            informacionExtra: d.tipo === 'EXTRA' ? d.valorTexto : null,
            idPais: d.tipo === 'HORA' ? d.idPais : null,
            horario: d.horario ?? '',
          })),
        })),
        notasEliminadas: this.notasEliminadas,
        detallesEliminados: this.notasDetallesEliminados,
      }
      : null;

    (envio as any).seccionModalidadHorario = seccionModalidadHorario;
    (envio as any).seccionDuracion = seccionDuracion;
    (envio as any).seccionFechaInicio = seccionFechaInicio;
    (envio as any).seccionNotas = seccionNotas;

    return envio;
  }



  asignarvalores(dataItem: IDocumentosPortaWeb) {
    this.obtenerIntroduccion(dataItem.id);
    if (this.dataVersion) {
      this.dataVersion.forEach((version) => {
        switch (version.idVersionPrograma) {
          case 1:
            this.formVersionBeneficios
              .get('Introduccion1')
              .setValue(version.introduccion);
            break;
          case 2:
            this.formVersionBeneficios
              .get('Introduccion2')
              .setValue(version.introduccion);
            break;
          case 3:
            this.formVersionBeneficios
              .get('Introduccion3')
              .setValue(version.introduccion);
            break;
        }
      });
    }
  }

  async obtenerIntroduccion(idDocumentoPw: number): Promise<versionesDPW[]> {
    try {
      const resp: HttpResponse<versionesDPW[]> = await this.integraService
        .getJsonResponse(
          `${constApiPlanificacion.DocumentoPwObtenerIntroduccionVersionDocumento}/${idDocumentoPw}`
        )
        .toPromise();

      return resp.body || [];
    } catch (error) {
      const mensaje = this.alertaService.getMessageErrorService(error);
      this.alertaService.notificationWarning(mensaje);
      return [];
    }
  }
  ObtenerDocumentoPWModalidad(id: number) {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.DocumentoPwObtenerDocumentoPWModalidad}/${id}`)
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          const body: any = resp.body ?? null;

          this.introduccionModalidad = '';
          this.listaModalidadHorarios = [];
          this.modalidadActivaIndex = null;
          this.modalidadesEliminadas = [];
          this.detallesEliminados = [];

          if (!body) return;

          const intro = body.introduccion ?? body.Introduccion ?? '';
          this.introduccionModalidad = intro ?? '';

          const modalidades = (body.modalidades ?? body.Modalidades ?? []) as any[];

          this.listaModalidadHorarios = (modalidades ?? []).map((m: any) => {
            const idModalidad = (m.idModalidad ?? m.IdModalidad ?? null) as number | null;

            const detallesRaw = (m.detalles ?? m.Detalles ?? []) as any[];
            const detallesOrdenados = (detallesRaw ?? [])
              .slice()
              .sort((a, b) => (a.orden ?? a.Orden ?? 0) - (b.orden ?? b.Orden ?? 0));

            const tipoFallback = detallesOrdenados?.[0]?.tipo ?? detallesOrdenados?.[0]?.Tipo ?? null;
            const baseEtiqueta = this.etiquetaBaseModalidadFallback(idModalidad, tipoFallback);

            const informacion: InfoVM[] = (detallesOrdenados ?? []).map((d: any, idx: number) => {
              const idDetalle = (d.id ?? d.Id ?? 0) as number;

              const orden = (d.orden ?? d.Orden ?? (idx + 1)) as number;

              const tipoRaw = ((d.tipo ?? d.Tipo ?? '') + '').trim().toUpperCase();
              const tipo: InfoTipo = tipoRaw.includes('HORA') ? 'HORA' : 'BENEFICIO';

              const idPais = (d.idPais ?? d.IdPais ?? null) as number | null;
              const beneficio = (d.beneficio ?? d.Beneficio ?? '') as string;

              const horario = (d.horario ?? d.horario ?? '') as string;

              return {
                idDetalle: idDetalle > 0 ? idDetalle : undefined,
                etiqueta: `${baseEtiqueta} ${orden}`,
                tipo,
                valor: tipo === 'HORA' ? idPais : null,
                valorTexto: tipo === 'BENEFICIO' ? (beneficio ?? '') : '',
                horario: horario ?? '',
              };
            });

            const id = (m.id ?? m.Id ?? 0) as number;
            const subTitulo = (m.subTitulo ?? m.SubTitulo ?? '') as string;
            const descripcion = (m.descripcion ?? m.Descripcion ?? '') as string;

            const vm: ModalidadVM = {
              id: id > 0 ? id : undefined,
              idModalidad,
              subtitulo: subTitulo ?? '',
              descripcion: descripcion ?? '',
              informacion,
              _prevIdModalidad: idModalidad,
            };

            return vm;
          });

          this.modalidadActivaIndex = this.listaModalidadHorarios.length ? 0 : null;

          this.refrescarEtiquetasModalidad();
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  asignarIntroducciones(introducciones: versionesDPW[]): void {
    introducciones.forEach((version) => {
      const controlName = `Introduccion${version.idVersionPrograma}`;
      if (this.formVersionBeneficios.get(controlName)) {
        this.formVersionBeneficios
          .get(controlName)
          .setValue(version.introduccion);
      }
    });
    if (!introducciones.some((v) => v.idVersionPrograma === 1)) {
      this.formVersionBeneficios.get('Introduccion1').setValue('');
    }
    if (!introducciones.some((v) => v.idVersionPrograma === 2)) {
      this.formVersionBeneficios.get('Introduccion2').setValue('');
    }
    if (!introducciones.some((v) => v.idVersionPrograma === 3)) {
      this.formVersionBeneficios.get('Introduccion3').setValue('');
    }
  }

  ListaPaises: PaisCombo[] = [];
  obtenerPaisesModalidad() {
    this.integraService
      .getJsonResponse(constApiGlobal.PaisObtenerPaisCombo)
      .subscribe({
        next: (resp: HttpResponse<PaisCombo[]>) => {
          const raw: any[] = (resp.body as any) ?? [];
          this.ListaPaises = raw.map((x: any) => ({
            id: x.id ?? x.Id ?? x.idPais ?? x.IdPais ?? x.codigoPais ?? x.CodigoPais ?? null,
            codigoPais: x.codigoPais ?? x.CodigoPais ?? 0,
            nombrePais: x.nombrePais ?? x.NombrePais ?? x.nombre ?? x.Nombre ?? '',
          }));

          this.comboHoras = (this.ListaPaises ?? []).map((x) => ({
            id: x.id ?? 0,
            nombre: x.nombrePais,
          }));
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }


  listaModoFechaInicio: IComboBase1[] = [];
  obtenerModos() {
    this.integraService
      .getJsonResponse(constApiPlanificacion.DocumentoPwObtenerModoFechaInicio)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.listaModoFechaInicio = resp.body ?? [];
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  programaGeneralesFiltrados: IComboBase1[] = [];
  obtenerProgramaGenerales() {
    this.integraService
      .getJsonResponse(constApiPlanificacion.ProgramaGeneralObtenerPGeneralActivo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.programaGenerales = resp.body ?? [];
          this.programaGeneralesFiltrados = [...this.programaGenerales];
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  filtrarProgramaGenerales(valor: string) {
    const v = (valor ?? '').toLowerCase().trim();
    if (!v) {
      this.programaGeneralesFiltrados = [...(this.programaGenerales ?? [])];
      return;
    }

    this.programaGeneralesFiltrados = (this.programaGenerales ?? []).filter((x) =>
      (x.nombre ?? '').toLowerCase().includes(v)
    );
  }
  obtenerNotasTipo() {
    this.integraService
      .getJsonResponse(constApiPlanificacion.DocumentoPWObtenerNotasTipo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.ListaNotasTipo = resp.body ?? [];
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  private tipoNota(idNotaTipo: number | null): NotaInfoTipo | null {
    if (idNotaTipo === null || idNotaTipo === undefined) return null;
    return idNotaTipo === 1 ? 'EXTRA' : 'HORA';
  }

  private etiquetaBaseNota(idNotaTipo: number | null): string {
    if (idNotaTipo === 1) return 'Extra';
    if (idNotaTipo === null || idNotaTipo === undefined) return 'Información';
    return 'Hora';
  }

  private inicializarDetalleNota(ni: number) {
    const n = this.listaNotas[ni];
    if (!n) return;

    const tipo = this.tipoNota(n.idNotaTipo);
    if (!tipo) {
      n.detalles = [];
      return;
    }

    const base = this.etiquetaBaseNota(n.idNotaTipo);
    n.detalles = [
      {
        etiqueta: `${base} 1`,
        tipo,
        valorTexto: '',
        idPais: null,
        horario: '',
      },
    ];
  }
  agregarNota() {
    const tipoPorDefecto = this.ListaNotasTipo?.length ? (this.ListaNotasTipo[0].id as number) : null;

    const nueva: NotaVM = {
      idNotaTipo: tipoPorDefecto,
      descripcion: '',
      detalles: [],
      _prevIdNotaTipo: tipoPorDefecto,
    };

    this.listaNotas.push(nueva);
    this.notaActivaIndex = this.listaNotas.length - 1;

    this.inicializarDetalleNota(this.notaActivaIndex);
  }

  seleccionarNota(ni: number) {
    this.notaActivaIndex = ni;
  }

  cambioTipoNota(ni: number, nuevoId: number | null) {
    const n = this.listaNotas[ni];
    if (!n) return;

    (n.detalles ?? []).forEach((d) => {
      if (d?.idDetalle && d.idDetalle > 0) this.notasDetallesEliminados.push(d.idDetalle);
    });

    n.idNotaTipo = nuevoId;
    n._prevIdNotaTipo = nuevoId;

    this.notaActivaIndex = ni;
    this.inicializarDetalleNota(ni);
  }

  puedeAgregarInformacionNota(): boolean {
    if (this.notaActivaIndex === null) return false;
    const n = this.listaNotas[this.notaActivaIndex];
    return n?.idNotaTipo !== null && n?.idNotaTipo !== undefined;
  }

  obtenerTextoAgregarInformacionNota(): string {
    if (this.notaActivaIndex === null) return 'Agregar Información';
    const n = this.listaNotas[this.notaActivaIndex];
    if (n?.idNotaTipo === null || n?.idNotaTipo === undefined) return 'Agregar Información';
    const base = this.etiquetaBaseNota(n.idNotaTipo);
    return `Agregar ${base}`;
  }

  agregarInformacionNota() {
    if (!this.puedeAgregarInformacionNota()) return;

    const ni = this.notaActivaIndex as number;
    const n = this.listaNotas[ni];
    if (!n) return;

    const tipo = this.tipoNota(n.idNotaTipo);
    if (!tipo) return;

    const base = this.etiquetaBaseNota(n.idNotaTipo);
    const next = (n.detalles ?? []).length + 1;

    if (!n.detalles) n.detalles = [];
    n.detalles.push({
      etiqueta: `${base} ${next}`,
      tipo,
      valorTexto: '',
      idPais: null,
      horario: '',
    });
  }

  private reindexNota(n: NotaVM) {
    const base = this.etiquetaBaseNota(n.idNotaTipo);
    (n.detalles ?? []).forEach((d, i) => {
      d.etiqueta = `${base} ${i + 1}`;
    });
  }

  eliminarDetalleNota(ni: number, di: number, ev?: MouseEvent) {
    ev?.stopPropagation();

    const n = this.listaNotas[ni];
    if (!n?.detalles) return;

    const det = n.detalles[di];
    if (det?.idDetalle && det.idDetalle > 0) this.notasDetallesEliminados.push(det.idDetalle);

    n.detalles.splice(di, 1);

    if (!n.detalles.length) {
      this.eliminarNota(ni);
      return;
    }

    this.reindexNota(n);
  }

  eliminarNota(ni: number, ev?: MouseEvent) {
    ev?.stopPropagation();

    const n = this.listaNotas[ni];
    if (!n) return;

    (n.detalles ?? []).forEach((d) => {
      if (d?.idDetalle && d.idDetalle > 0) this.notasDetallesEliminados.push(d.idDetalle);
    });

    if (n.id && n.id > 0) this.notasEliminadas.push(n.id);

    this.listaNotas.splice(ni, 1);

    if (this.notaActivaIndex === null) return;
    if (!this.listaNotas.length) {
      this.notaActivaIndex = null;
      return;
    }
    if (this.notaActivaIndex >= this.listaNotas.length) {
      this.notaActivaIndex = this.listaNotas.length - 1;
    }
  }


  ObtenerDocumentoPWDuracion(id: number) {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.DocumentoPwObtenerDocumentoPWDuracion}/${id}`)
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          const body: any = resp.body ?? null;

          this.tituloDuracion = '';
          this.introduccionDuracion = '';
          this.pieDePaginaDuracion = '';
          this.listaDuracionDetalle = [];
          this.duracionDetallesEliminados = [];

          if (!body) return;

          this.tituloDuracion = body.titulo ?? body.Titulo ?? '';
          this.introduccionDuracion = body.introduccion ?? body.Introduccion ?? '';
          this.pieDePaginaDuracion = body.pieDePagina ?? body.PieDePagina ?? '';

          const detalles = (body.detalles ?? body.Detalles ?? []) as any[];

          const ordenados = (detalles ?? [])
            .slice()
            .sort(
              (a, b) =>
                (a.idVersionPrograma ?? a.IdVersionPrograma ?? 0) -
                (b.idVersionPrograma ?? b.IdVersionPrograma ?? 0)
            );

          this.listaDuracionDetalle = ordenados.map((d: any) => {
            const idDetalle = (d.id ?? d.Id ?? 0) as number;
            const idVersionPrograma = (d.idVersionPrograma ?? d.IdVersionPrograma ?? null) as number | null;

            const vm: DuracionDetalleVM = {
              idDetalle: idDetalle > 0 ? idDetalle : undefined,
              idVersionPrograma,
              meses: d.meses ?? d.Meses ?? '',
              horas: d.horas ?? d.Horas ?? '',
              _prevIdVersionPrograma: idVersionPrograma,
            };

            return vm;
          });
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  ObtenerDocumentoPWFechaInicio(id: number) {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.DocumentoPwObtenerDocumentoPWFechaInicio}/${id}`)
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          const data = resp.body;
          if (!data) {
            this.fechaInicioMostrarEnLaWeb = false;
            this.fechaInicioTitulo = '';
            this.fechaInicioSubTitulo = '';
            this.listaFechaInicioPaises = [];
            this.fechaInicioPaisActivoIndex = null;
            this.fechaInicioPaisesEliminados = [];
            this.fechaInicioDetallesEliminados = [];
            return;
          }

          this.fechaInicioMostrarEnLaWeb = !!data.mostrarEnLaWeb;
          this.fechaInicioTitulo = data.titulo ?? '';
          this.fechaInicioSubTitulo = data.subTitulo ?? '';

          const paises = (data.paises ?? []) as any[];

          this.listaFechaInicioPaises = paises.map((p: any) => {
            const detalles = (p.detalles ?? []) as any[];
            const detallesVM: FechaInicioDetalleVM[] = detalles.map((d: any) => ({
              idDetalle: d.id ?? 0,
              idModo: d.idModo ?? null,
              fecha: d.fecha ? new Date(d.fecha) : null,
              horario: d.horario ?? '',
              _prevIdModo: d.idModo ?? null,
            }));

            return {
              id: p.id ?? 0,
              idPais: p.idPais ?? null,
              detalles: detallesVM,
              _prevIdPais: p.idPais ?? null,
            } as FechaInicioPaisVM;
          });

          this.fechaInicioPaisesEliminados = [];
          this.fechaInicioDetallesEliminados = [];

          if (this.listaFechaInicioPaises.length) {
            this.fechaInicioPaisActivoIndex = 0;
          } else {
            this.fechaInicioPaisActivoIndex = null;
          }
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

ObtenerDocumentoPWNotas(id: number) {
  this.integraService
    .getJsonResponse(`${constApiPlanificacion.DocumentoPwObtenerDocumentoPWNotas}/${id}`)
    .subscribe({
      next: (resp: HttpResponse<any>) => {
        const data = resp.body;

        this.notasEliminadas = [];
        this.notasDetallesEliminados = [];
        this.notaActivaIndex = null;

        if (!data) {
          this.notasMostrarEnLaWeb = false;
          this.listaNotas = [];
          return;
        }

        this.notasMostrarEnLaWeb = !!data.mostrarEnLaWeb;

        const notas = (data.notas ?? []) as any[];

        this.listaNotas = notas.map((n: any) => {
          const detalles = (n.detalles ?? []) as any[];

          const detallesVM: NotaDetalleVM[] = detalles
            .slice()
            .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
            .map((d: any, i: number) => {
              const isHora = d.idPais !== null && d.idPais !== undefined;
              const tipo: NotaInfoTipo = isHora ? 'HORA' : 'EXTRA';
              const base = n.idNotaTipo === 1 ? 'Extra' : 'Hora';

              return {
                idDetalle: d.id ?? 0,
                etiqueta: `${base} ${i + 1}`,
                tipo,
                valorTexto: d.informacionExtra ?? '',
                idPais: isHora ? d.idPais : null,
                horario: d.horario ?? d.horario ?? '',
              } as NotaDetalleVM;
            });

          return {
            id: n.id ?? 0,
            idNotaTipo: n.idNotaTipo ?? null,
            descripcion: n.descripcion ?? '',
            detalles: detallesVM,
            _prevIdNotaTipo: n.idNotaTipo ?? null,
          } as NotaVM;
        });

        if (this.listaNotas.length) this.notaActivaIndex = 0;
      },
      error: (error) => {
        let mensaje = this.alertaService.getMessageErrorService(error);
        this.alertaService.notificationWarning(mensaje);
      },
    });
}

}

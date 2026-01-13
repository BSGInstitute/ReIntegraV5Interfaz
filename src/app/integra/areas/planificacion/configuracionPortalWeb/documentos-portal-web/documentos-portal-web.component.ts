import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
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

type ModalidadId = 'VIVO' | 'RITMO';
type InfoTipo = 'HORA' | 'BENEFICIO';

interface InfoVM {
  idDetalle?: number;
  etiqueta: string;
  tipo: InfoTipo;
  valor: string | null;
  valorTexto: string;
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
  ) {}

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

  comboModalidades = [
    { id: 'VIVO', nombre: 'Online en Vivo' },
    { id: 'RITMO', nombre: 'Online a tu Ritmo' },
  ];

  comboHoras = [
    { id: 'PECO', nombre: 'Hora Perú y Colombia' },
    { id: 'MX', nombre: 'Hora México' },
    { id: 'CL', nombre: 'Hora Chile' },
  ];

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

  comboFechaInicioPaises: IComboBase1[] = [];
  comboFechaInicioModos: IComboBase1[] = [
    { id: 1, nombre: 'Regular' },
    { id: 2, nombre: 'Intensivo' },
  ];

  listaFechaInicioPaises: FechaInicioPaisVM[] = [];
  fechaInicioPaisActivoIndex: number | null = null;

  fechaInicioPaisesEliminados: number[] = [];
  fechaInicioDetallesEliminados: number[] = [];

  private modalidadesDisponibles(): ModalidadId[] {
    const usadas = new Set(
      this.listaModalidadHorarios
        .map((x) => x.idModalidad)
        .filter((x): x is ModalidadId => !!x)
    );

    const todas: ModalidadId[] = ['VIVO', 'RITMO'];
    return todas.filter((x) => !usadas.has(x));
  }

  puedeAgregarModalidad(): boolean {
    return (
      this.modalidadesDisponibles().length > 0 &&
      this.listaModalidadHorarios.length < 2
    );
  }

  puedeAgregarInformacion(): boolean {
    if (this.modalidadActivaIndex === null) return false;
    const mod = this.listaModalidadHorarios[this.modalidadActivaIndex];
    return !!mod && !!mod.idModalidad;
  }

  agregarModalidadHorario() {
    const disponibles = this.modalidadesDisponibles();
    if (disponibles.length === 0 || this.listaModalidadHorarios.length >= 2)
      return;

    const nuevaModalidad: ModalidadVM = {
      idModalidad: disponibles[0],
      subtitulo: '',
      descripcion: '',
      informacion: [],
      _prevIdModalidad: disponibles[0],
    };

    this.listaModalidadHorarios.push(nuevaModalidad);
    this.modalidadActivaIndex = this.listaModalidadHorarios.length - 1;

    this.inicializarInformacion(this.modalidadActivaIndex);
  }

  cambioModalidad(mi: number, nuevoValor: ModalidadId | null) {
    const mod = this.listaModalidadHorarios[mi];
    if (!mod) return;

    if (nuevoValor) {
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

    if (mod.idModalidad === 'VIVO') {
      mod.informacion.push({
        etiqueta: 'Hora 1',
        tipo: 'HORA',
        valor: null,
        valorTexto: '',
      });
    }

    if (mod.idModalidad === 'RITMO') {
      mod.informacion.push({
        etiqueta: 'Beneficio 1',
        tipo: 'BENEFICIO',
        valor: null,
        valorTexto: '',
      });
    }
  }

  obtenerTextoAgregarInformacion() {
    if (this.modalidadActivaIndex === null) return 'Agregar Información';
    const mod = this.listaModalidadHorarios[this.modalidadActivaIndex];
    if (!mod?.idModalidad) return 'Agregar Información';
    if (mod.idModalidad === 'VIVO') return 'Agregar Hora';
    if (mod.idModalidad === 'RITMO') return 'Agregar Beneficio';
    return 'Agregar Información';
  }

  agregarInformacionHorario() {
    if (!this.puedeAgregarInformacion()) return;

    const idx = this.modalidadActivaIndex as number;
    const mod = this.listaModalidadHorarios[idx];
    if (!mod) return;

    if (!mod.informacion) mod.informacion = [];

    if (mod.idModalidad === 'VIVO') {
      const n = mod.informacion.filter((x) => x.tipo === 'HORA').length + 1;
      mod.informacion.push({
        etiqueta: `Hora ${n}`,
        tipo: 'HORA',
        valor: null,
        valorTexto: '',
      });
    }

    if (mod.idModalidad === 'RITMO') {
      const n =
        mod.informacion.filter((x) => x.tipo === 'BENEFICIO').length + 1;
      mod.informacion.push({
        etiqueta: `Beneficio ${n}`,
        tipo: 'BENEFICIO',
        valor: null,
        valorTexto: '',
      });
    }
  }

  seleccionarModalidad(mi: number) {
    this.modalidadActivaIndex = mi;
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
    const tipo = mod.informacion[0]?.tipo;
    mod.informacion.forEach((x, i) => {
      x.etiqueta = tipo === 'HORA' ? `Hora ${i + 1}` : `Beneficio ${i + 1}`;
    });
  }

  cargarSeccionModalidad(idDocumentoPw: number) {
    this.idPlantilla = idDocumentoPw;

    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.DocumentoPWModalidadObtenerCombo}/${idDocumentoPw}`
      )
      .subscribe({
        next: (resp: any) => {
          this.introduccionModalidad = resp?.introduccion ?? '';

          this.listaModalidadHorarios = (resp?.modalidades ?? []).map((m: any) => {
            const vm: ModalidadVM = {
              id: m.id,
              idModalidad: m.modalidadCodigo ?? null,
              subtitulo: m.subTitulo ?? '',
              descripcion: m.descripcion ?? '',
              informacion: [],
              _prevIdModalidad: m.modalidadCodigo ?? null,
            };

            const detalles = m.detalles ?? [];
            vm.informacion = detalles.map((d: any) => ({
              idDetalle: d.id,
              etiqueta:
                d.tipo === 'HORA' ? `Hora ${d.orden}` : `Beneficio ${d.orden}`,
              tipo: d.tipo,
              valor: d.tipo === 'HORA' ? (d.idModalidadHorario ?? null) : null,
              valorTexto: d.tipo === 'BENEFICIO' ? (d.beneficio ?? '') : '',
            }));

            if (!vm.informacion.length && vm.idModalidad) {
              vm.informacion = [];
              if (vm.idModalidad === 'VIVO')
                vm.informacion.push({
                  etiqueta: 'Hora 1',
                  tipo: 'HORA',
                  valor: null,
                  valorTexto: '',
                });
              if (vm.idModalidad === 'RITMO')
                vm.informacion.push({
                  etiqueta: 'Beneficio 1',
                  tipo: 'BENEFICIO',
                  valor: null,
                  valorTexto: '',
                });
            }

            return vm;
          });

          this.modalidadActivaIndex = this.listaModalidadHorarios.length ? 0 : null;
        },
        error: (err: any) => console.error(err),
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

    if (nuevoId) {
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

  private paisesDisponiblesFechaInicio(): IComboBase1[] {
    const usados = new Set(
      this.listaFechaInicioPaises
        .map((x) => x.idPais)
        .filter((x): x is number => x !== null && x !== undefined)
    );
    return (this.comboFechaInicioPaises ?? []).filter((x) => !usados.has(x.id));
  }

  puedeAgregarPaisFechaInicio(): boolean {
    return this.paisesDisponiblesFechaInicio().length > 0;
  }

  agregarPaisFechaInicio() {
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

  obtenerComboPaisesFechaInicio(pi: number): IComboBase1[] {
    const actual = this.listaFechaInicioPaises[pi]?.idPais ?? null;

    const usados = new Set(
      this.listaFechaInicioPaises
        .map((x, idx) => (idx === pi ? null : x.idPais))
        .filter((x): x is number => x !== null && x !== undefined)
    );

    return (this.comboFechaInicioPaises ?? []).filter(
      (x) => x.id === actual || !usados.has(x.id)
    );
  }

  cambioPaisFechaInicio(pi: number, nuevoIdPais: number | null) {
    const pais = this.listaFechaInicioPaises[pi];
    if (!pais) return;

    if (nuevoIdPais) {
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

    return (this.comboFechaInicioModos ?? []).filter((m) => !usados.has(m.id));
  }

  puedeAgregarModoFechaInicio(): boolean {
    if (this.fechaInicioPaisActivoIndex === null) return false;
    const pi = this.fechaInicioPaisActivoIndex as number;
    const pais = this.listaFechaInicioPaises[pi];
    if (!pais || !pais.idPais) return false;
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

    if (nuevoIdModo) {
      const duplicado = pais.detalles.some(
        (x, idx) => idx !== di && x.idModo === nuevoIdModo
      );
      if (duplicado) {
        det.idModo = det._prevIdModo ?? null;
        this.alertaService.notificationWarning('Ese modo ya fue agregado en este país.');
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
    if (det?.idDetalle && det.idDetalle > 0) this.fechaInicioDetallesEliminados.push(det.idDetalle);

    pais.detalles.splice(di, 1);
  }

  eliminarPaisFechaInicio(pi: number, ev?: MouseEvent) {
    ev?.stopPropagation();

    const pais = this.listaFechaInicioPaises[pi];
    if (!pais) return;

    (pais.detalles ?? []).forEach((d) => {
      if (d?.idDetalle && d.idDetalle > 0) this.fechaInicioDetallesEliminados.push(d.idDetalle);
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
    this.obtenerComboVersionPrograma();
    this.generarReporte();
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
                  let numeroFilas = seccionGrid.listaSubSeccionesPw.map((x) => x.numeroFila);
                  numeroFilas = Array.from(new Set(numeroFilas));
                  numeroFilas.forEach((x) => {
                    let fila = seccionGrid.listaSubSeccionesPw.filter((a) => a.numeroFila == x);
                    let objGrid: { [key: string]: string } = {};
                    fila.forEach((i) => {
                      objGrid[`_${i.idSeccionTipoDetallePw}_${seccionGrid.idSeccionPW}`] =
                        i.contenidoSubSeccion;
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

  crearObjetoDesdeListaForm(lista: ListaSubSeccionesPw[]): Record<string, string> {
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
      this.asignarIntroducciones(introducciones);
      this.cargarSeccionModalidad(dataItem.id);
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

  configurarGridConsultasForo(
    gridPlantilla: KendoGrid,
    columnas: ListaSubSeccionesPw[]
  ) {
    gridPlantilla.habilitarEstadoNewRow = true;
    gridPlantilla.formGroup = this.formBuilder.group(
      this.crearObjetoDesdeListaForm(columnas)
    );
    gridPlantilla.addEvent$.subscribe((resp) => {
      console.log('Resp', resp);
      console.log(columnas);
      console.log(gridPlantilla);
    });
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

    const seccionModalidadHorario = {
      idDocumentoPw: objDocumento.id,
      introduccion: this.introduccionModalidad,
      modalidades: this.listaModalidadHorarios.map((m) => ({
        id: m.id ?? 0,
        modalidadCodigo: m.idModalidad,
        subTitulo: m.subtitulo,
        descripcion: m.descripcion,
        detalles: (m.informacion ?? []).map((d, i) => ({
          id: d.idDetalle ?? 0,
          orden: i + 1,
          tipo: d.tipo,
          horarioZona: d.tipo === 'HORA' ? d.valor : null,
          beneficio: d.tipo === 'BENEFICIO' ? d.valorTexto : null,
        })),
      })),
      modalidadesEliminadas: this.modalidadesEliminadas,
      detallesEliminados: this.detallesEliminados,
    };

    const seccionDuracion = {
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
    };

    const seccionFechaInicio = {
      idDocumentoPw: objDocumento.id,
      mostrarEnLaWeb: this.fechaInicioMostrarEnLaWeb,
      titulo: this.fechaInicioTitulo,
      subTitulo: this.fechaInicioSubTitulo,
      paises: this.listaFechaInicioPaises.map((p) => ({
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
    };

    (envio as any).seccionModalidadHorario = seccionModalidadHorario;
    (envio as any).seccionDuracion = seccionDuracion;
    (envio as any).seccionFechaInicio = seccionFechaInicio;

    return envio;
  }

  asignarvalores(dataItem: IDocumentosPortaWeb) {
    this.obtenerIntroduccion(dataItem.id);
    if (this.dataVersion) {
      this.dataVersion.forEach((version) => {
        console.log('Versiones:', version);
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

      console.log('Introducciones obtenidas:', resp.body);
      return resp.body || [];
    } catch (error) {
      console.error('Error al obtener introducciones:', error);
      const mensaje = this.alertaService.getMessageErrorService(error);
      this.alertaService.notificationWarning(mensaje);
      return [];
    }
  }

  asignarIntroducciones(introducciones: versionesDPW[]): void {
    introducciones.forEach((version) => {
      const controlName = `Introduccion${version.idVersionPrograma}`;
      if (this.formVersionBeneficios.get(controlName)) {
        this.formVersionBeneficios.get(controlName).setValue(version.introduccion);
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
}

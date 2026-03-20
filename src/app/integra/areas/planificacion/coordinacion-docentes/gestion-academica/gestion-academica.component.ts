import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

interface GestionAcademicaGrid {
  id: number;
  nombre: string;
  fechaAsignacion: string;
}

interface PEspecificoCatalogo {
  id: number;
  nombre: string;
  codigo: string | null;
}

interface ProveedorPEspecificoGrid {
  id: number;           // id del registro en T_ProveedorPEspecifico
  idProveedor: number;
  nombreDocente: string;
  idPespecifico: number;
  nombreCurso: string;
  fechaAsignacion: string;
}

@Component({
  selector: 'app-gestion-academica',
  templateUrl: './gestion-academica.component.html',
  styleUrls: ['./gestion-academica.component.scss'],
})
export class GestionAcademicaComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
  ) {}

  // ── Grilla principal ─────────────────────────────────────────────────────
  gridGestionAcademica: KendoGrid = new KendoGrid();

  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  // ── Modal ────────────────────────────────────────────────────────────────
  modalRef: NgbModalRef = null;
  enProcesoSolicitud: boolean = false;
  isNew: boolean = false;

  // ── Docentes ─────────────────────────────────────────────────────────────
  listaDocentes: IComboBase1[] = [];
  docenteBloqueado: boolean = false;
  // Almacena el id numérico del docente seleccionado de forma confiable
  // (kendo-dropdownlist puede guardar el objeto completo en el form)
  idProveedorActual: number = null;
  nombreDocenteActual: string = '';

  formGestionAcademica: FormGroup = this._formBuilder.group({
    idDocente: [null, Validators.required],
  });

  // ── Catálogo PEspecifico (carga única en memoria) ─────────────────────────
  private _catalogoPEspecifico: PEspecificoCatalogo[] = [];
  private _catalogoCargado: boolean = false;

  textoBusquedaCurso: string = '';
  listaCursosFiltrada: PEspecificoCatalogo[] = [];

  // ── Grilla cursos asignados en el modal ───────────────────────────────────
  cursosAsignados: ProveedorPEspecificoGrid[] = [];
  // Ids de registros ya guardados que se eliminarán al presionar Guardar
  private _idsAEliminar: number[] = [];

  ngOnInit(): void {
    this.obtener();
  }

  // ── Grilla principal ──────────────────────────────────────────────────────
  obtener() {
    this.gridGestionAcademica.loading = true;
    this._integraService
      .getJsonResponse(constApiPlanificacion.ProveedorObtenerActivoPEspecifico)
      .subscribe({
        next: (resp: HttpResponse<GestionAcademicaGrid[]>) => {
          this.gridGestionAcademica.data = resp.body ?? [];
          this.gridGestionAcademica.loading = false;
        },
        error: (error) => {
          this.gridGestionAcademica.loading = false;
          this._alertaService.notificationWarning(
            this._alertaService.getMessageErrorService(error),
          );
        },
      });
  }

  // ── Docentes ──────────────────────────────────────────────────────────────
  obtenerDocentes() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.ProveedorObtenerDocentesActivos)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.listaDocentes = resp.body ?? [];
        },
        error: (error) => {
          this._alertaService.notificationWarning(
            this._alertaService.getMessageErrorService(error),
          );
        },
      });
  }

  // ── Catálogo PEspecifico ──────────────────────────────────────────────────
  cargarCatalogoPEspecifico() {
    if (this._catalogoCargado) return;
    this._integraService
      .getJsonResponse(constApiPlanificacion.PEspecificoObtenerCatalogo)
      .subscribe({
        next: (resp: HttpResponse<PEspecificoCatalogo[]>) => {
          this._catalogoPEspecifico = resp.body ?? [];
          this._catalogoCargado = true;
        },
        error: (error) => {
          this._alertaService.notificationWarning(
            this._alertaService.getMessageErrorService(error),
          );
        },
      });
  }

  // ── Filtrado local ────────────────────────────────────────────────────────
  filtrarCursos(evento: Event) {
    const texto = (evento.target as HTMLInputElement).value;
    this.textoBusquedaCurso = texto;
    if (!texto || texto.trim().length < 3) {
      this.listaCursosFiltrada = [];
      return;
    }
    const termino = texto.trim().toLowerCase();
    const idsYaAsignados = new Set(this.cursosAsignados.map((c) => c.idPespecifico));
    this.listaCursosFiltrada = this._catalogoPEspecifico
      .filter(
        (c) =>
          !idsYaAsignados.has(c.id) &&
          (c.nombre.toLowerCase().includes(termino) ||
            (c.codigo && c.codigo.toLowerCase().includes(termino))),
      )
      .slice(0, 1000);
  }

  // ── Seleccionar curso de la lista ─────────────────────────────────────────
  seleccionarCurso(curso: PEspecificoCatalogo) {
    // Bloquear docente al agregar el primer curso
    if (!this.docenteBloqueado) {
      this.docenteBloqueado = true;
      this.formGestionAcademica.get('idDocente').disable();
    }

    this.cursosAsignados = [
      ...this.cursosAsignados,
      {
        id: 0, // 0 = pendiente de guardar
        idProveedor: this.idProveedorActual,
        nombreDocente: this.nombreDocenteActual,
        idPespecifico: curso.id,
        nombreCurso: curso.nombre,
        fechaAsignacion: new Date().toISOString(),
      },
    ];

    this.textoBusquedaCurso = '';
    this.listaCursosFiltrada = [];
  }

  // ── Eliminar de la grilla (solo visual; el DELETE real ocurre en guardar()) ──
  eliminarCursoAsignado(item: ProveedorPEspecificoGrid) {
    if (item.id > 0) {
      // Marcar para eliminar en el backend al guardar
      this._idsAEliminar.push(item.id);
    }
    // En ambos casos quitar visualmente de la grilla
    this.cursosAsignados = this.cursosAsignados.filter((c) => c !== item);
  }

  // ── Cargar cursos ya asignados al seleccionar docente ─────────────────────
  // value puede ser el objeto completo {id, nombre, ...} o solo el número,
  // dependiendo del modo en que Kendo tenga configurado el dropdown
  onDocenteChange(value: any) {
    // Extraer siempre el id numérico de forma segura
    const idProveedor: number =
      value !== null && typeof value === 'object' ? value.id : value;

    if (!idProveedor) {
      this.idProveedorActual = null;
      this.nombreDocenteActual = '';
      this.cursosAsignados = [];
      this.docenteBloqueado = false;
      return;
    }

    // Guardar id y nombre de forma confiable
    this.idProveedorActual = idProveedor;
    const docente =
      value !== null && typeof value === 'object'
        ? value
        : this.listaDocentes.find((d) => d.id === idProveedor);
    this.nombreDocenteActual = docente?.nombre ?? '';

    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProveedorPEspecificoObtenerPorIdProveedor}/${idProveedor}`,
      )
      .subscribe({
        next: (resp: HttpResponse<ProveedorPEspecificoGrid[]>) => {
          const asignados = resp.body ?? [];
          this.cursosAsignados = asignados;
          if (asignados.length > 0) {
            this.docenteBloqueado = true;
            this.formGestionAcademica.get('idDocente').disable();
          }
        },
        error: (error) => {
          this._alertaService.notificationWarning(
            this._alertaService.getMessageErrorService(error),
          );
        },
      });
  }

  // ── Abrir modal ───────────────────────────────────────────────────────────
  abrirModal(context: any, isNew: boolean, dataItem?: GestionAcademicaGrid) {
    this.isNew = isNew;
    this.formGestionAcademica.reset();
    this.formGestionAcademica.get('idDocente').enable();
    this.enProcesoSolicitud = false;
    this.cursosAsignados = [];
    this.listaCursosFiltrada = [];
    this.textoBusquedaCurso = '';
    this.docenteBloqueado = false;
    this.idProveedorActual = null;
    this.nombreDocenteActual = '';
    this._idsAEliminar = [];

    if (!isNew && dataItem) {
      this.idProveedorActual = dataItem.id;
      this.nombreDocenteActual = dataItem.nombre;
      this.formGestionAcademica.get('idDocente').setValue(dataItem.id);
      this.onDocenteChange(dataItem.id);
    }

    this.obtenerDocentes();
    this.cargarCatalogoPEspecifico();

    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  // ── Guardar: primero elimina los marcados, luego inserta los pendientes ────
  guardar() {
    if (!this.idProveedorActual) {
      this.formGestionAcademica.markAllAsTouched();
      this._alertaService.mensajeIcon('Seleccione un docente antes de guardar.');
      return;
    }

    const pendientesInsertar = this.cursosAsignados.filter((c) => c.id === 0);
    const pendientesEliminar = [...this._idsAEliminar];

    if (pendientesInsertar.length === 0 && pendientesEliminar.length === 0) {
      this.modalRef.close();
      return;
    }

    this.enProcesoSolicitud = true;
    const total = pendientesEliminar.length + pendientesInsertar.length;
    let completados = 0;

    const onCompleto = () => {
      completados++;
      if (completados === total) {
        this.enProcesoSolicitud = false;
        this._idsAEliminar = [];
        this.modalRef.close();
        this.obtener();
        this._alertaService.mensajeExitoso();
      }
    };

    const onError = (error: any) => {
      this.enProcesoSolicitud = false;
      this._alertaService.notificationWarning(
        this._alertaService.getMessageErrorService(error),
      );
    };

    // Eliminar registros marcados
    pendientesEliminar.forEach((id) => {
      this._integraService
        .deleteJsonResponse(`${constApiPlanificacion.ProveedorPEspecificoEliminar}/${id}`)
        .subscribe({ next: onCompleto, error: onError });
    });

    // Insertar registros nuevos
    pendientesInsertar.forEach((item) => {
      this._integraService
        .postJsonResponse(constApiPlanificacion.ProveedorPEspecificoInsertar, {
          id: 0,
          idProveedor: this.idProveedorActual,
          idPespecifico: item.idPespecifico,
        })
        .subscribe({ next: onCompleto, error: onError });
    });
  }
}

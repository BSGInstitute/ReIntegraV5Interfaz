import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { ICampaniaLinkedIn, IPendientesLinkedIn } from '@marketing/models/interfaces/campania-linkedin';
import { GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-registro-landing-page-linkedin',
  templateUrl: './registro-landing-page-linkedin.component.html',
  styleUrls: ['./registro-landing-page-linkedin.component.scss'],
})
export class RegistroLandingPageLinkedinComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  // ==== ViewChilds
  @ViewChild('kgridlinkedin') kgridlinkedin: GridComponent;
  @ViewChild('kgridPartner') kgridPartner: GridComponent;
  @ViewChild('modalSeleccionadosTpl') modalSeleccionadosTpl!: TemplateRef<any>;
  private modalRef: NgbModalRef | null = null;

  // ==== Estados/Modelos
  gridLinkedin: KendoGrid = new KendoGrid();
  gridPendientes: KendoGrid = new KendoGrid();
  enProcesoSolicitud = false;

  // ==== Filtros (General)
  fechaInicio = new FormControl(null);
  fechaFin = new FormControl(null);
  tipoFecha: number;

  // ==== Proceso LinkedIn
  subiendoOportunidades = true;
  estadoEnvio: boolean;

  // ==== Selección (Pendientes)
  selectedKeysPendientes: string[] = [];
  selectedItemsPendientes: any[] = [];
  verSoloSeleccionados = false;

  // ==== Tabs internos de cuenta
  cuentasTabs: string[] = ['Cuenta 1', 'Cuenta 2', 'Cuenta 6'];
  cuentaActiva: string = this.cuentasTabs[0];

  // Data filtrada por cuenta para bindear al grid de Pendientes
  pendientesFiltrados: any[] = [];

  ngOnInit(): void {}

  // =========================
  //   GENERAL - BÚSQUEDA
  // =========================
  BuscarPorFiltro() {
    if (!this.validarFechas()) {
      this.gridLinkedin.loading = false;
      return;
    }
    const paginado: PageChangeEvent = {
      skip: 0,
      take: this.kgridlinkedin.pageSize,
    };
    this.kgridlinkedin.pageChange.emit(paginado);

    this.gridLinkedin.loading = true;
    this.obtenerGrilalRegistroLandingPage();
  }

  private validarFechas(): boolean {
    if (this.fechaInicio.value == null || this.fechaFin.value == null) {
      this._alertaService.mensajeIcon('Ingrese rango de Fechas');
      return false;
    }
    if (this.fechaInicio.value > this.fechaFin.value) {
      this._alertaService.mensajeIcon('Rango de Fechas no valido');
      return false;
    }
    if (this.tipoFecha == 0 || this.tipoFecha == null) {
      this._alertaService.mensajeIcon('Seleccione una Tipo de Fecha');
      return false;
    }
    return true;
  }

  onDateOptionChange(value: any): void {
    this.tipoFecha = value.id;
  }

  obtenerGrilalRegistroLandingPage() {
    this.gridLinkedin.loading = true;
    const idTipoFecha = this.tipoFecha;

    const filtro = {
      fechaInicial: datePipeTransform(this.fechaInicio.value, 'yyyy-MM-ddT00:00:00'),
      fechaFinal: datePipeTransform(this.fechaFin.value, 'yyyy-MM-ddT23:59:59'),
      idTipoFecha,
      skip: this.gridLinkedin.gridState.skip,
      take: this.gridLinkedin.gridState.take,
    };

    this._integraService
      .postJsonResponse(constApiMarketing.ObtenerRegistroLandingPageLinkedInByFecha, JSON.stringify(filtro))
      .subscribe({
        next: (resp: HttpResponse<ICampaniaLinkedIn[]>) => {
          if (resp.body && resp.body.length > 0) {
            resp.body.forEach((x) => {
              x.oportunidadRegistradaTexto = x.oportunidadRegistrada ? 'Procesado' : 'Pendiente';
            });
            this.gridLinkedin.data = resp.body;
          } else {
            this._alertaService.mensajeIcon('No se encontró datos en este rango de fechas');
            this.gridLinkedin.data = [];
          }
          this.gridLinkedin.loading = false;
        },
        error: (error) => {
          this.gridLinkedin.loading = false;
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  // =========================
  //        PENDIENTES
  // =========================
  obtenerPendientes() {
    // Forzar vista normal (evita quedar vacío si no hay selección)
    this.verSoloSeleccionados = false;
    this.gridPendientes.loading = true;

    // 1) Validar si hay proceso de LinkedIn en ejecución
    this._integraService
      .getJsonResponse(constApiMarketing.ValidarObtencionLeadLinkedinEstado)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.subiendoOportunidades = resp.body;

          if (this.subiendoOportunidades) {
            // ⚠️ No vaciar la grilla: solo avisar
            this.gridPendientes.loading = false;
            this._alertaService.mensajeIcon(
              '¡Advertencia!',
              'Aún se están subiendo las oportunidades de LinkedIn, intente más tarde.',
              'warning'
            );
            return;
          }

          // 2) Consultar pendientes reales
          this._integraService
            .getJsonResponse(constApiMarketing.ObtenerRegistroPendientePageLinkedIn)
            .subscribe({
              next: (resp: HttpResponse<IPendientesLinkedIn[]>) => {
                this.gridPendientes.data = resp.body || [];
                this.aplicarFiltroCuenta();  // filtro por cuenta activa
                this.gridPendientes.loading = false;
                this.resyncSelection();
              },
              error: (error) => {
                this.gridPendientes.loading = false;
                const mensaje = this._alertaService.getMessageErrorService(error);
                this._alertaService.mensajeIcon('¡Error!', mensaje, 'error');
              },
            });
        },
        error: (error) => {
          this.gridPendientes.loading = false;
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  // === Crear oportunidades (backend) ===
  subirOportunidad() {
    this.gridPendientes.loading = true;

    // 1) Validar si hay proceso de LinkedIn en ejecución
    this._integraService
      .getJsonResponse(constApiMarketing.ValidarObtencionLeadLinkedinEstado)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.estadoEnvio = resp.body;

          if (this.estadoEnvio) {
            this.gridPendientes.loading = false;
            this._alertaService.mensajeIcon(
              '¡Advertencia!',
              'No se puede CrearOportunidades hasta que termine un proceso de LinkedIn que está en proceso',
              'warning'
            );
          } else {
            // 2) Lanzar creación
            this._alertaService.notificationInfo(
              'Se envió exitosamente. Espere por favor mientras se crean las oportunidades...'
            );

            this._integraService
              .getJsonResponse(constApiMarketing.SubirOportunidadesPendientesLinkedIn)
              .subscribe({
                next: (_: HttpResponse<any>) => {
                  this.gridPendientes.loading = false;
                  this._alertaService.notificationSuccess('Las oportunidades fueron creadas correctamente.');
                  this.obtenerPendientes(); // vuelve a cargar y filtra por cuenta activa
                },
                error: (error) => {
                  this.gridPendientes.loading = false;
                  const mensaje = this._alertaService.getMessageErrorService(error);
                  this._alertaService.notificationWarning(mensaje);
                },
              });
          }
        },
        error: (error) => {
          this.gridPendientes.loading = false;
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  // =========================
  //   EDICIÓN EN CELDA
  // =========================
  public cellClickHandler(args: any): void {
    const formGroup = this.createFormGroup(args.dataItem);
    this.kgridPartner.editCell(args.rowIndex, args.columnIndex, formGroup);
  }

  public cellCloseHandler(args: any): void {
    if (!args.formGroup.valid) {
      args.preventDefault();
      return;
    }

    const field = args.column.field as string;
    const isEditableField = ['cargo', 'areaFormacion', 'areaTrabajo', 'industria', 'pais'].includes(field);
    const control = args.formGroup.get(field);

    if (!isEditableField || !control?.dirty) return;

    const dto = {
      guidLinkedInLead: args.dataItem.guidLinkedInLead,
      cargo: args.formGroup.value.cargo,
      areaFormacion: args.formGroup.value.areaFormacion,
      areaTrabajo: args.formGroup.value.areaTrabajo,
      industria: args.formGroup.value.industria,
      pais: args.formGroup.value.pais,
    };
    Object.assign(args.dataItem, dto);
    this.enProcesoSolicitud = true;

    this._integraService
      .putJsonResponse(constApiMarketing.ActualizarRegistroLandingPageLinkedIn, JSON.stringify(dto))
      .subscribe({
        next: () => {
          this.obtenerPendientes();
          this._alertaService.mensajeExitoso();
          this.enProcesoSolicitud = false;
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
          this.enProcesoSolicitud = false;
        },
      });
  }

  public saveHandler({ dataItem, formGroup }: any): void {
    dataItem.cargo = formGroup.value.cargo;
    dataItem.areaFormacion = formGroup.value.areaFormacion;
    dataItem.areaTrabajo = formGroup.value.areaTrabajo;
    dataItem.industria = formGroup.value.industria;
    dataItem.pais = formGroup.value.pais;

    this.kgridPartner.closeCell();
    this.enProcesoSolicitud = true;

    const dto = {
      guidLinkedInLead: dataItem.guidLinkedInLead,
      cargo: formGroup.value.cargo,
      areaFormacion: formGroup.value.areaFormacion,
      areaTrabajo: formGroup.value.areaTrabajo,
      industria: formGroup.value.industria,
      pais: formGroup.value.pais,
    };

    this._integraService
      .putJsonResponse(constApiMarketing.ActualizarRegistroLandingPageLinkedIn, JSON.stringify(dto))
      .subscribe({
        next: () => {
          this.gridPendientes.loading = false;
          this.obtenerPendientes();
          this._alertaService.mensajeExitoso();
          this.enProcesoSolicitud = false;
        },
        error: (error) => {
          this.gridPendientes.loading = false;
          this.enProcesoSolicitud = false;
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  private createFormGroup(dataItem: any): FormGroup {
    return this._formBuilder.group({
      cargo: new FormControl(dataItem.cargo),
      areaFormacion: new FormControl(dataItem.areaFormacion),
      areaTrabajo: new FormControl(dataItem.areaTrabajo),
      industria: new FormControl(dataItem.industria),
      pais: new FormControl(dataItem.pais),
    });
  }

  // =========================
  //  SELECCIÓN + MODAL
  // =========================
  onSelectedKeysChange(keys: string[]): void {
    this.selectedKeysPendientes = keys;
    const set = new Set(keys);
    const data = this.gridPendientes?.data ?? [];
    this.selectedItemsPendientes = data.filter((row: any) => set.has(row.guidLinkedInLead));
  }

  toggleVerSoloSeleccionados(): void {
    this.verSoloSeleccionados = !this.verSoloSeleccionados;
  }

  enviarSeleccionados(): void {
    const payload = this.selectedItemsPendientes;
    if (!payload || !payload.length) {
      this._alertaService.mensajeIcon('Seleccione al menos un registro');
      return;
    }

    this.modalRef = this._modalService.open(this.modalSeleccionadosTpl, {
      size: 'xl',
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
    });
  }

  confirmarEnvioSeleccionados(): void {
    const payload = this.selectedItemsPendientes.map((x) => ({
      guidLinkedInLead: x.guidLinkedInLead,
      nombres: x.nombres,
      apellidos: x.apellidos,
      correo: x.correo,
      cargo: x.cargo,
      areaFormacion: x.areaFormacion,
      areaTrabajo: x.areaTrabajo,
      industria: x.industria,
      cuentaAsociada: x.cuentaAsociada,
    }));

    // this._integraService.postJsonResponse(url, JSON.stringify(payload)).subscribe(...)

    this._alertaService.notificationSuccess(`Se prepararon ${payload.length} registros.`);
    this.modalRef?.close();
  }

  // =========================
  //   TABS INTERNOS CUENTA
  // =========================
  onCuentaTabSelect(e: any): void {
    this.cuentaActiva = this.cuentasTabs[e.index] || this.cuentasTabs[0];
    this.refreshDentro();
  }

  // "refreshDentro": pediste que lo llamen los 3 tabs.
  // Refresca vista normal y aplica filtro; si aún no hay data, va a backend.
  refreshDentro(): void {
    this.verSoloSeleccionados = false;
    if (!this.gridPendientes.data || !this.gridPendientes.data.length) {
      this.obtenerPendientes();
    } else {
      this.aplicarFiltroCuenta();
      this.resyncSelection();
    }
  }

  // === Filtro robusto por cuenta ===
  private normalizaCuenta(v: any): string {
    if (v === null || v === undefined) return '';
    const s = String(v).toLowerCase().replace(/\s+/g, '');
    if (s === '1' || s === 'cuenta1') return 'cuenta1';
    if (s === '2' || s === 'cuenta2') return 'cuenta2';
    if (s === '6' || s === 'cuenta6') return 'cuenta6';
    return s;
  }

  private aplicarFiltroCuenta(): void {
    const base = this.gridPendientes?.data ?? [];
    const target = this.normalizaCuenta(this.cuentaActiva);
    this.pendientesFiltrados = base.filter(
      (r: any) => this.normalizaCuenta(r?.cuentaAsociada) === target
    );

    // Fallback: si no hay nada para esa cuenta, muestra todo para no dejar vacío.
    if (!this.pendientesFiltrados.length && base.length) {
      this.pendientesFiltrados = base;
      // Si prefieres avisar y NO mostrar todo, comenta la línea de arriba.
      // this._alertaService.mensajeIcon('Sin registros para ' + this.cuentaActiva);
    }
  }

  // Mantener selección tras refresh (limpia keys inexistentes)
  private resyncSelection(): void {
    const base = this.gridPendientes?.data ?? [];
    const existing = new Set(base.map((r: any) => r.guidLinkedInLead));

    const keptKeys = this.selectedKeysPendientes.filter(k => existing.has(k));
    if (keptKeys.length !== this.selectedKeysPendientes.length) {
      this.selectedKeysPendientes = keptKeys;
    }
    this.onSelectedKeysChange(this.selectedKeysPendientes);
  }
}

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  constApiGlobal,
  constApiMarketing,
  constApiPlanificacion,
} from '@environments/constApi';
import {
  ICampaniaLinkedIn,
  ICuentaLinkedin,
  IPendientesLinkedIn,
} from '@marketing/models/interfaces/campania-linkedin';
import { GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { FormService } from '@shared/services/form.service';
import Swal from 'sweetalert2';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

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
    private _modalService: NgbModal,
    private formService: FormService
  ) {}

  @ViewChild('kgridlinkedin') kgridlinkedin: GridComponent;
  @ViewChild('kgridPartner') kgridPartner: GridComponent;
  @ViewChild('modalSeleccionadosTpl') modalSeleccionadosTpl!: TemplateRef<any>;
  @ViewChild('kgridModal') kgridModal: GridComponent | undefined;

  private modalRef: NgbModalRef | null = null;

  gridLinkedin: KendoGrid = new KendoGrid();
  private gridPendientesMap: Record<number, KendoGrid> = {};
  cuentas: ICuentaLinkedin[] = [];
  cuentaActiva: ICuentaLinkedin | null = null;
  private loadedCuentas: Record<number, boolean> = {};

  Cargos: IComboBase1[] = [];
  AreasFormacion: IComboBase1[] = [];
  AreasTrabajo: IComboBase1[] = [];
  Industrias: IComboBase1[] = [];
  Paises: IComboBase1[] = [];

  private cargosAll: IComboBase1[] = [];
  private paisesAll: IComboBase1[] = [];
  private areasFormacionAll: IComboBase1[] = [];
  private areasTrabajoAll: IComboBase1[] = [];
  private industriasAll: IComboBase1[] = [];

  fechaInicio = new FormControl(null);
  fechaFin = new FormControl(null);
  tipoFecha: number;

  enProcesoSolicitud = false;
  subiendoOportunidades = true;
  estadoEnvio: boolean;

  private selectedKeysMap: Record<number, string[]> = {};
  private selectedItemsMap: Record<number, any[]> = {};
  verSoloSeleccionados = false;

  pendientesFiltrados: any[] = [];

  private touchSelectedKeys(nroCuenta: number): void {
    this.selectedKeysMap[nroCuenta] = [
      ...(this.selectedKeysMap[nroCuenta] ?? []),
    ];
  }

  private normalize(s: string): string {
    return (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '');
  }

  private filterData(src: IComboBase1[], term: string): IComboBase1[] {
    const t = this.normalize(term || '');
    if (!t) return [...src];
    return src.filter((x) => this.normalize(x.nombre).includes(t));
  }

  filtrarOpcionesDropDown(
    kind: 'cargo' | 'industria' | 'areaFormacion' | 'areaTrabajo' | 'pais',
    term: string
  ) {
    switch (kind) {
      case 'cargo':
        this.Cargos = this.filterData(this.cargosAll, term);
        break;
      case 'industria':
        this.Industrias = this.filterData(this.industriasAll, term);
        break;
      case 'areaFormacion':
        this.AreasFormacion = this.filterData(this.areasFormacionAll, term);
        break;
      case 'areaTrabajo':
        this.AreasTrabajo = this.filterData(this.areasTrabajoAll, term);
        break;
      case 'pais':
        this.Paises = this.filterData(this.paisesAll, term);
        break;
    }
  }

  restablecerOpcionesDropDown(
    kind: 'cargo' | 'industria' | 'areaFormacion' | 'areaTrabajo' | 'pais'
  ) {
    switch (kind) {
      case 'cargo':
        this.Cargos = [...this.cargosAll];
        break;
      case 'industria':
        this.Industrias = [...this.industriasAll];
        break;
      case 'areaFormacion':
        this.AreasFormacion = [...this.areasFormacionAll];
        break;
      case 'areaTrabajo':
        this.AreasTrabajo = [...this.areasTrabajoAll];
        break;
      case 'pais':
        this.Paises = [...this.paisesAll];
        break;
    }
  }

  getNroCuentaActiva(): number {
    return this.cuentaActiva?.nroCuenta ?? this.cuentas[0]?.nroCuenta ?? 0;
  }

  private getGrid(nroCuenta: number): KendoGrid {
    if (!this.gridPendientesMap[nroCuenta]) {
      this.gridPendientesMap[nroCuenta] = new KendoGrid();
    }
    return this.gridPendientesMap[nroCuenta];
  }

  get gridPendientesActivo(): KendoGrid {
    return this.getGrid(this.getNroCuentaActiva());
  }

  get selectedKeysActivo(): string[] {
    const id = this.getNroCuentaActiva();
    return this.selectedKeysMap[id] ?? [];
  }

  get selectedItemsActivo(): any[] {
    const id = this.getNroCuentaActiva();
    return this.selectedItemsMap[id] ?? [];
  }

  ngOnInit(): void {
    this.obtenerCuentas();
    this.ObtenerCargos();
    this.ObtenerIndustria();
    this.ObtenerAreaTrabajo();
    this.ObtenerAreaFormacion();
    this.ObtenerPais();
  }

  obtenerCuentas() {
    this._integraService
      .getJsonResponse(constApiMarketing.LinkedInObtenerCuentasActivas)
      .subscribe({
        next: (resp: HttpResponse<ICuentaLinkedin[]>) => {
          this.cuentas = resp.body ?? [];
          this.loadedCuentas = {};
          this.gridPendientesMap = {};
          this.selectedKeysMap = {};
          this.selectedItemsMap = {};
          for (const c of this.cuentas) {
            this.loadedCuentas[c.nroCuenta] = false;
            this.gridPendientesMap[c.nroCuenta] = new KendoGrid();
            this.selectedKeysMap[c.nroCuenta] = [];
            this.selectedItemsMap[c.nroCuenta] = [];
          }
          if (
            !this.cuentaActiva ||
            !this.cuentas.some(
              (x) => x.nroCuenta === this.cuentaActiva!.nroCuenta
            )
          ) {
            this.cuentaActiva = this.cuentas[0] ?? null;
          }
          if (this.cuentaActiva)
            this.touchSelectedKeys(this.cuentaActiva.nroCuenta);
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerCargos() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.CargoObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.cargosAll = resp.body ?? [];
          this.Cargos = [...this.cargosAll];
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  ObtenerPais() {
    this._integraService
      .getJsonResponse(constApiGlobal.PaisObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.paisesAll = resp.body ?? [];
          this.Paises = [...this.paisesAll];
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  ObtenerIndustria() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.IndustriaObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.industriasAll = resp.body ?? [];
          this.Industrias = [...this.industriasAll];
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerAreaTrabajo() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.AreaTrabajoObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.areasTrabajoAll = resp.body ?? [];
          this.AreasTrabajo = [...this.areasTrabajoAll];
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerAreaFormacion() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.AreaFormacionObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.areasFormacionAll = resp.body ?? [];
          this.AreasFormacion = [...this.areasFormacionAll];
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

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
      fechaInicial: datePipeTransform(
        this.fechaInicio.value,
        'yyyy-MM-ddT00:00:00'
      ),
      fechaFinal: datePipeTransform(this.fechaFin.value, 'yyyy-MM-ddT23:59:59'),
      idTipoFecha,
      skip: this.gridLinkedin.gridState.skip,
      take: this.gridLinkedin.gridState.take,
    };
    this._integraService
      .postJsonResponse(
        constApiMarketing.ObtenerRegistroLandingPageLinkedInByFecha,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<ICampaniaLinkedIn[]>) => {
          if (resp.body && resp.body.length > 0) {
            resp.body.forEach((x) => {
              x.oportunidadRegistradaTexto = x.oportunidadRegistrada
                ? 'Procesado'
                : 'Pendiente';
            });
            this.gridLinkedin.data = resp.body;
          } else {
            this._alertaService.mensajeIcon(
              'No se encontró datos en este rango de fechas'
            );
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

  obtenerPendientes(
    nroCuenta?: number,
    opts?: { markLoadedOnSuccess?: boolean }
  ) {
    this.verSoloSeleccionados = false;
    const targetNro = nroCuenta ?? this.getNroCuentaActiva();
    const grid = this.getGrid(targetNro);
    grid.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerRegistroPendientePageLinkedIn}/${targetNro}`
      )
      .subscribe({
        next: (resp: HttpResponse<IPendientesLinkedIn[]>) => {
          grid.data = resp.body || [];
          if (this.getNroCuentaActiva() === targetNro) {
            this.aplicarFiltroCuenta();
            this.resyncSelection(grid.data);
            this.touchSelectedKeys(targetNro);
          }
          if (opts?.markLoadedOnSuccess) {
            this.loadedCuentas[targetNro] = true;
          }
          grid.loading = false;
        },
        error: (error) => {
          grid.loading = false;
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.mensajeIcon('¡Error!', mensaje, 'error');
        },
      });
  }

  public cellClickHandler(args: any): void {
    const formGroup = this.createFormGroup(args.dataItem);
    this.kgridPartner.editCell(args.rowIndex, args.columnIndex, formGroup);
  }

  public cellCloseHandler(args: any): void {
    const field = args.column.field as string;
    const control = args.formGroup.get(field);
    // if (field === 'urlPerfilLinkedIn' && control?.invalid && control?.dirty) {
    //   control.setValue(args.dataItem.urlPerfilLinkedIn);
    //   control.markAsPristine();
    //   this._alertaService.mensajeIcon(
    //     'URL de LinkedIn inválida',
    //     'Por favor ingrese una URL válida de LinkedIn (ejemplo: https://linkedin.com/in/usuario)',
    //     'warning'
    //   );
    //   return;
    // }
    if (!args.formGroup.valid) {
      args.preventDefault();
      return;
    }
    const isEditableField = [
      'cargo',
      'areaFormacion',
      'areaTrabajo',
      'industria',
      'pais',
      // 'urlPerfilLinkedIn',
    ].includes(field);
    if (!isEditableField || !control?.dirty) return;
    const dto = {
      guidLinkedInLead: args.dataItem.guidLinkedInLead,
      cargo: args.formGroup.value.cargo,
      areaFormacion: args.formGroup.value.areaFormacion,
      areaTrabajo: args.formGroup.value.areaTrabajo,
      industria: args.formGroup.value.industria,
      pais: args.formGroup.value.pais,
      // urlPerfil: args.formGroup.value.urlPerfilLinkedIn,
    };
    Object.assign(args.dataItem, dto);
    this.enProcesoSolicitud = true;
    this._integraService
      .putJsonResponse(
        constApiMarketing.ActualizarRegistroLandingPageLinkedIn,
        JSON.stringify(dto)
      )
      .subscribe({
        next: () => {
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
    // if (!formGroup.valid) {
    //   const urlControl = formGroup.get('urlPerfilLinkedIn');
    //   if (urlControl?.invalid) {
    //     this._alertaService.mensajeIcon(
    //       'URL de LinkedIn inválida',
    //       'Por favor ingrese una URL válida de LinkedIn (ejemplo: https://linkedin.com/in/usuario)',
    //       'warning'
    //     );
    //   }
    //   return;
    // }
    dataItem.cargo = formGroup.value.cargo;
    dataItem.areaFormacion = formGroup.value.areaFormacion;
    dataItem.areaTrabajo = formGroup.value.areaTrabajo;
    dataItem.industria = formGroup.value.industria;
    dataItem.pais = formGroup.value.pais;
    // dataItem.urlPerfilLinkedIn = formGroup.value.urlPerfilLinkedIn;
    this.kgridPartner.closeCell();
    this.enProcesoSolicitud = true;
    const dto = {
      guidLinkedInLead: dataItem.guidLinkedInLead,
      cargo: formGroup.value.cargo,
      areaFormacion: formGroup.value.areaFormacion,
      areaTrabajo: formGroup.value.areaTrabajo,
      industria: formGroup.value.industria,
      pais: formGroup.value.pais,
      // urlPerfil: formGroup.value.urlPerfilLinkedIn,
    };
    this._integraService
      .putJsonResponse(
        constApiMarketing.ActualizarRegistroLandingPageLinkedIn,
        JSON.stringify(dto)
      )
      .subscribe({
        next: () => {
          this._alertaService.mensajeExitoso();
          this.enProcesoSolicitud = false;
        },
        error: (error) => {
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
      // urlPerfilLinkedIn: new FormControl(dataItem.urlPerfilLinkedIn, [
      //   Validators.pattern(
      //     /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]{3,}[^\s]*$/
      //   ),
      // ]),
    });
  }

  onSelectedKeysChange(keys: string[]): void {
    const id = this.getNroCuentaActiva();
    this.selectedKeysMap[id] = keys;
    const set = new Set(keys);
    const data = this.gridPendientesActivo?.data ?? [];
    this.selectedItemsMap[id] = data.filter((row: any) =>
      set.has(row.guidLinkedInLead)
    );
  }

  toggleVerSoloSeleccionados(): void {
    this.verSoloSeleccionados = !this.verSoloSeleccionados;
    this.touchSelectedKeys(this.getNroCuentaActiva());
  }
  modalEnviando = false;
  enviarSeleccionados(): void {
    const payload = this.selectedItemsActivo;
    if (!payload || !payload.length) {
      this._alertaService.mensajeIcon('Seleccione al menos un registro');
      return;
    }

    this.modalEnviando = false;
    this.modalRef = this._modalService.open(this.modalSeleccionadosTpl, {
      size: 'xl',
      scrollable: true,
      backdrop: 'static',
      keyboard: false,
      centered: true,
      beforeDismiss: () => !this.modalEnviando,
    });

    setTimeout(() => {
      this.kgridModal?.autoFitColumns();
    }, 0);
  }

  confirmarEnvioSeleccionados(): void {
    const nroCuenta = this.getNroCuentaActiva();
    const targetNro = nroCuenta ?? this.getNroCuentaActiva();
    const grid = this.getGrid(targetNro);
    const items = this.selectedItemsActivo;

    if (!items?.length) {
      this._alertaService.mensajeIcon('Seleccione al menos un registro');
      return;
    }

    const guids: string[] = Array.from(
      new Set(
        items
          .map((x) => (x?.guidLinkedInLead ?? '').toString().trim())
          .filter((s) => s.length > 0)
      )
    );

    if (!guids.length) {
      this._alertaService.mensajeIcon('No hay GUIDs válidos para enviar');
      return;
    }

    const payload = {
      guidLinkedinLead: guids,
      cuentaAsociada: nroCuenta,
      grupo: 1,
    };

    Swal.fire({
      title: '¿Seguro que deseas enviar a crear las oportunidades?',
      html: `Se enviarán <b>${guids.length}</b> registro(s) para la cuenta <b>${nroCuenta}</b>.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      heightAuto: false,
    }).then((res) => {
      if (!res.isConfirmed) return;

      this.modalEnviando = true;
      grid.loading = true;

      this._integraService
        .getJsonResponse(
          `${constApiMarketing.ValidarObtencionLeadLinkedinEstadoPorCuenta}/${targetNro}`
        )
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            this.subiendoOportunidades = resp.body;

            if (this.subiendoOportunidades) {
              grid.loading = false;
              this.modalEnviando = false; // << desbloquea modal
              this._alertaService.mensajeIcon(
                '¡Advertencia!',
                'Aún se están subiendo las oportunidades de LinkedIn, intente más tarde.',
                'warning'
              );
              return;
            }

            this._integraService
              .postJsonResponse(
                constApiMarketing.SubirOportunidadesPendientesSeleccionadasLinkedIn,
                JSON.stringify(payload)
              )
              .subscribe({
                next: (_: HttpResponse<any>) => {
                  this._alertaService.notificationSuccess(
                    'Envío realizado. Se procesarán las oportunidades.'
                  );
                  this.modalEnviando = false; // << desbloquea modal
                  this.modalRef?.close();
                  this.selectedKeysMap[nroCuenta] = [];
                  this.selectedItemsMap[nroCuenta] = [];
                  this.obtenerPendientes(nroCuenta);
                  grid.loading = false;
                },
                error: (error) => {
                  grid.loading = false;
                  this.modalEnviando = false; // << desbloquea modal
                  const msg = this._alertaService.getMessageErrorService(error);
                  this._alertaService.mensajeIcon('¡Error!', msg, 'error');
                },
              });
          },
          error: (error) => {
            grid.loading = false;
            this.modalEnviando = false; // << desbloquea modal
            const msg = this._alertaService.getMessageErrorService(error);
            this._alertaService.mensajeIcon('¡Error!', msg, 'error');
          },
        });
    });
  }

  onCuentaTabSelect(e: any): void {
    const cuenta = this.cuentas[e.index];
    if (!cuenta) return;
    this.cuentaActiva = cuenta;
    const nro = this.getNroCuentaActiva();
    if (!this.loadedCuentas[nro]) {
      this.obtenerPendientes(nro, { markLoadedOnSuccess: true });
    } else {
      this.verSoloSeleccionados = false;
      this.aplicarFiltroCuenta();
      this.resyncSelection();
      this.touchSelectedKeys(nro);
    }
  }

  refreshDentro(): void {
    this.verSoloSeleccionados = false;
    const grid = this.gridPendientesActivo;
    if (!grid.data || !grid.data.length) {
      this.obtenerPendientes(this.getNroCuentaActiva());
    } else {
      this.aplicarFiltroCuenta();
      this.resyncSelection(grid.data);
      this.touchSelectedKeys(this.getNroCuentaActiva());
    }
  }

  private aplicarFiltroCuenta(): void {
    const grid = this.gridPendientesActivo;
    this.pendientesFiltrados = grid?.data ?? [];
  }

  private resyncSelection(base?: any[]): void {
    const id = this.getNroCuentaActiva();
    const rows = base ?? this.gridPendientesActivo?.data ?? [];
    const existing = new Set(rows.map((r: any) => r.guidLinkedInLead));
    const prevKeys = this.selectedKeysMap[id] ?? [];
    const keptKeys = prevKeys.filter((k) => existing.has(k));
    if (keptKeys.length !== prevKeys.length) {
      this.selectedKeysMap[id] = keptKeys;
    }
    this.onSelectedKeysChange(this.selectedKeysMap[id]);
  }

  get modalItems(): any[] {
    const map = new Map<string, any>();
    for (const x of this.selectedItemsActivo) {
      const key = (x?.guidLinkedInLead ?? '').toString();
      if (!map.has(key)) map.set(key, x);
    }
    return Array.from(map.values());
  }

  get modalPageable(): boolean | any {
    const n = this.modalItems.length;
    return n > 10 ? { pageSizes: [10, 20, 50] } : false;
  }

  cleanText(v: any): string {
    if (v === null || v === undefined) return '';
    return String(v)
      .replace(/duplicado/gi, '')
      .trim();
  }

  actualizarCampoDesdeDropDown(
    field: 'cargo' | 'industria' | 'areaFormacion' | 'areaTrabajo' | 'pais',
    value: string | null,
    formGroup: FormGroup
  ): void {
    const ctrl = formGroup.get(field);
    if (!ctrl) return;

    const val =
      value === undefined || value === null || value === 'Seleccione…'
        ? null
        : value;

    ctrl.setValue(val);
    ctrl.markAsDirty();
    ctrl.updateValueAndValidity({ onlySelf: true, emitEvent: false });

    setTimeout(() => this.kgridPartner?.closeCell());
  }

  openUrlPopup(rawUrl: string | null | undefined, ev?: MouseEvent): void {
  ev?.stopPropagation();
  if (!this.isValidUrl(rawUrl)) return;

  const url = this.normalizeUrl(rawUrl!);
  window.open(
    url,
    'perfilLinkedIn',
    'width=1100,height=750,scrollbars=yes,resizable=yes,noopener,noreferrer'
  );
}

isValidUrl(rawUrl: string | null | undefined): boolean {
  if (!rawUrl) return false;
  const t = rawUrl.trim();
  if (!t) return false;
  try {
    new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    return true;
  } catch {
    return false;
  }
}

private normalizeUrl(rawUrl: string): string {
  const t = rawUrl.trim();
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}
}

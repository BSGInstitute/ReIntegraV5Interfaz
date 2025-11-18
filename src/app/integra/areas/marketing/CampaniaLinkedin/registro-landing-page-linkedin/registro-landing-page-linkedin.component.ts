import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import {
  ICampaniaLinkedIn,
  IPendientesLinkedIn,
} from '@marketing/models/interfaces/campania-linkedin';
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
    private _modalService: NgbModal,
    private formService: FormService
  ) { }
    private _modalService: NgbModal
  ) {}

  @ViewChild('kgridlinkedin') kgridlinkedin: GridComponent;
  @ViewChild('kgridPartner') kgridPartner: GridComponent;
  @ViewChild('modalSeleccionadosTpl') modalSeleccionadosTpl!: TemplateRef<any>;

  @ViewChild('kgridModal') kgridModal: GridComponent | undefined;

  private modalRef: NgbModalRef | null = null;

  gridLinkedin: KendoGrid = new KendoGrid();
  gridPendientesCuenta1: KendoGrid = new KendoGrid();
  gridPendientesCuenta2: KendoGrid = new KendoGrid();
  gridPendientesCuenta6: KendoGrid = new KendoGrid();
  enProcesoSolicitud = false;

  private readonly CUENTA_ID_MAP: Record<string, number> = {
    'Cuenta 1': 512131517,
    'Cuenta 2': 514207695,
    'Cuenta 6': 515120283,
  };

  private loadedCuentas: Record<number, boolean> = {
    512131517: false,
    514207695: false,
    515120283: false,
  };

  fechaInicio = new FormControl(null);
  fechaFin = new FormControl(null);
  tipoFecha: number;

  subiendoOportunidades = true;
  estadoEnvio: boolean;

  private selectedKeysMap: Record<number, string[]> = {
    512131517: [],
    514207695: [],
    515120283: [],
  };
  private selectedItemsMap: Record<number, any[]> = {
    512131517: [],
    514207695: [],
    515120283: [],
  };
  verSoloSeleccionados = false;

  cuentasTabs: string[] = ['Cuenta 1', 'Cuenta 2', 'Cuenta 6'];
  cuentaActiva: string = this.cuentasTabs[0];

  pendientesFiltrados: any[] = [];

  getIdCuentaActiva(): number {
    return this.CUENTA_ID_MAP[this.cuentaActiva] ?? 512131517;
  }
  private getGridActual(): KendoGrid {
    switch (this.cuentaActiva) {
      case 'Cuenta 1':
        return this.gridPendientesCuenta1;
      case 'Cuenta 2':
        return this.gridPendientesCuenta2;
      case 'Cuenta 6':
        return this.gridPendientesCuenta6;
      default:
        return this.gridPendientesCuenta1;
    }
  }
  private getGridByIdCuenta(idCuenta: number): KendoGrid {
    switch (idCuenta) {
      case 512131517:
        return this.gridPendientesCuenta1;
      case 514207695:
        return this.gridPendientesCuenta2;
      case 515120283:
        return this.gridPendientesCuenta6;
      default:
        return this.gridPendientesCuenta1;
    }
  }

  get gridPendientesActivo(): KendoGrid {
    return this.getGridActual();
  }
  get selectedKeysActivo(): string[] {
    const id = this.getIdCuentaActiva();
    return this.selectedKeysMap[id] ?? [];
  }
  get selectedItemsActivo(): any[] {
    const id = this.getIdCuentaActiva();
    return this.selectedItemsMap[id] ?? [];
  }

  ngOnInit(): void {}

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
    cuentaAsociada?: number,
    opts?: { markLoadedOnSuccess?: boolean }
  ) {
    this.verSoloSeleccionados = false;

    const targetId = cuentaAsociada ?? this.getIdCuentaActiva();
    const grid = this.getGridByIdCuenta(targetId);
    grid.loading = true;

    this._integraService
      .getJsonResponse(constApiMarketing.ValidarObtencionLeadLinkedinEstado)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.subiendoOportunidades = resp.body;

          if (this.subiendoOportunidades) {
            grid.loading = false;
            this._alertaService.mensajeIcon(
              '¡Advertencia!',
              'Aún se están subiendo las oportunidades de LinkedIn, intente más tarde.',
              'warning'
            );
            return;
          }

          this._integraService
            .getJsonResponse(
              `${constApiMarketing.ObtenerRegistroPendientePageLinkedIn}/${targetId}`
            )
            .subscribe({
              next: (resp: HttpResponse<IPendientesLinkedIn[]>) => {
                grid.data = resp.body || [];
                if (this.getIdCuentaActiva() === targetId) {
                  this.aplicarFiltroCuenta();
                  this.resyncSelection(grid.data);
                }
                if (opts?.markLoadedOnSuccess) {
                  this.loadedCuentas[targetId] = true;
                }

                grid.loading = false;
              },
              error: (error) => {
                grid.loading = false;
                const mensaje =
                  this._alertaService.getMessageErrorService(error);
                this._alertaService.mensajeIcon('¡Error!', mensaje, 'error');
              },
            });
        },
        error: (error) => {
          grid.loading = false;
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  subirOportunidad() {
    const grid = this.getGridActual();
    grid.loading = true;

    this._integraService
      .getJsonResponse(constApiMarketing.ValidarObtencionLeadLinkedinEstado)
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.estadoEnvio = resp.body;

          if (this.estadoEnvio) {
            grid.loading = false;
            this._alertaService.mensajeIcon(
              '¡Advertencia!',
              'No se puede CrearOportunidades hasta que termine un proceso de LinkedIn que está en proceso',
              'warning'
            );
          } else {
            this._alertaService.notificationInfo(
              'Se envió exitosamente. Espere por favor mientras se crean las oportunidades...'
            );

            this._integraService
              .getJsonResponse(
                constApiMarketing.SubirOportunidadesPendientesLinkedIn
              )
              .subscribe({
                next: (_: HttpResponse<any>) => {
                  grid.loading = false;
                  this._alertaService.notificationSuccess(
                    'Las oportunidades fueron creadas correctamente.'
                  );
                },
                error: (error) => {
                  grid.loading = false;
                  const mensaje =
                    this._alertaService.getMessageErrorService(error);
                  this._alertaService.notificationWarning(mensaje);
                },
              });
          }
        },
        error: (error) => {
          grid.loading = false;
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
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

    // Validar específicamente el campo urlPerfilLinkedIn
    if (field === 'urlPerfilLinkedIn' && control?.invalid && control?.dirty) {
      // Revertir al valor original
      control.setValue(args.dataItem.urlPerfilLinkedIn);
      control.markAsPristine();
      this._alertaService.mensajeIcon(
        'URL de LinkedIn inválida',
        'Por favor ingrese una URL válida de LinkedIn (ejemplo: https://linkedin.com/in/usuario)',
        'warning'
      );
      return;
    }

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
      'urlPerfilLinkedIn'
    ].includes(field);

    if (!isEditableField || !control?.dirty) return;

    const dto = {
      guidLinkedInLead: args.dataItem.guidLinkedInLead,
      cargo: args.formGroup.value.cargo,
      areaFormacion: args.formGroup.value.areaFormacion,
      areaTrabajo: args.formGroup.value.areaTrabajo,
      industria: args.formGroup.value.industria,
      pais: args.formGroup.value.pais,
      urlPerfil: args.formGroup.value.urlPerfilLinkedIn,
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
    console.log('Data Item: ', dataItem);

    // Validar el formulario antes de guardar
    if (!formGroup.valid) {
      const urlControl = formGroup.get('urlPerfilLinkedIn');
      if (urlControl?.invalid) {
        this._alertaService.mensajeIcon(
          'URL de LinkedIn inválida',
          'Por favor ingrese una URL válida de LinkedIn (ejemplo: https://linkedin.com/in/usuario)',
          'warning'
        );
      }
      return;
    }

    dataItem.cargo = formGroup.value.cargo;
    dataItem.areaFormacion = formGroup.value.areaFormacion;
    dataItem.areaTrabajo = formGroup.value.areaTrabajo;
    dataItem.industria = formGroup.value.industria;
    dataItem.pais = formGroup.value.pais;
    dataItem.urlPerfilLinkedIn = formGroup.value.urlPerfilLinkedIn;
    console.log(formGroup)

    this.kgridPartner.closeCell();
    this.enProcesoSolicitud = true;

    const dto = {
      guidLinkedInLead: dataItem.guidLinkedInLead,
      cargo: formGroup.value.cargo,
      areaFormacion: formGroup.value.areaFormacion,
      areaTrabajo: formGroup.value.areaTrabajo,
      industria: formGroup.value.industria,
      pais: formGroup.value.pais,
      urlPerfil: formGroup.value.urlPerfilLinkedIn,
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
      urlPerfilLinkedIn: new FormControl(dataItem.urlPerfilLinkedIn, [
        Validators.pattern(/^(https?:\/\/)?((www|www\.)\.)?linkedin\.com\/in\/[\w-]{3,}[^\s]*$/)
      ])
    });
  }

  onSelectedKeysChange(keys: string[]): void {
    const id = this.getIdCuentaActiva();
    this.selectedKeysMap[id] = keys;

    const set = new Set(keys);
    const data = this.getGridActual()?.data ?? [];
    this.selectedItemsMap[id] = data.filter((row: any) =>
      set.has(row.guidLinkedInLead)
    );
  }

  toggleVerSoloSeleccionados(): void {
    this.verSoloSeleccionados = !this.verSoloSeleccionados;
  }

  enviarSeleccionados(): void {
    const payload = this.selectedItemsActivo;
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
    setTimeout(() => {
      this.kgridModal?.autoFitColumns();
    }, 0);
  }
  confirmarEnvioSeleccionados(): void {
    const payload = this.selectedItemsActivo.map((x) => ({
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
    this._alertaService.notificationSuccess(
      `Se prepararon ${payload.length} registros.`
    );
    this.modalRef?.close();
  }

  onCuentaTabSelect(e: any): void {
    this.cuentaActiva = this.cuentasTabs[e.index] || this.cuentasTabs[0];

    const id = this.getIdCuentaActiva();
    if (!this.loadedCuentas[id]) {
      this.obtenerPendientes(id, { markLoadedOnSuccess: true });
    } else {
      this.verSoloSeleccionados = false;
      this.aplicarFiltroCuenta();
      this.resyncSelection();
    }
  }

  refreshDentro(): void {
    this.verSoloSeleccionados = false;
    const grid = this.getGridActual();
    if (!grid.data || !grid.data.length) {
      this.obtenerPendientes(this.getIdCuentaActiva());
    } else {
      this.aplicarFiltroCuenta();
      this.resyncSelection(grid.data);
    }
  }

  // Como el backend ya devuelve por cuenta, solo reflejamos el grid actual
  private aplicarFiltroCuenta(): void {
    const grid = this.getGridActual();
    this.pendientesFiltrados = grid?.data ?? [];
  }

  // Mantener selección tras refresh (limpia keys inexistentes) para la cuenta activa
  private resyncSelection(base?: any[]): void {
    const id = this.getIdCuentaActiva();
    const rows = base ?? this.getGridActual()?.data ?? [];
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
}

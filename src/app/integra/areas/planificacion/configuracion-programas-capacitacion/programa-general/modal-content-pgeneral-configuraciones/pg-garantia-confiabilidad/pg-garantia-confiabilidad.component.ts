import { Component, Input, OnInit } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiPlanificacion } from '@environments/constApi';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { TextValidator } from '@shared/validators/text.validator';
import { FormService } from '@shared/services/form.service';
import { PgeneralService } from '@planificacion/services/pgeneral.service';

import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ModalidadCursoAlternoDTO, PGeneralArgumentoMotivacion } from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { CompuestoArgumentoModalidadAlternoDTO } from '@planificacion/models/interfaces/programaGeneralArgumento';

@Component({
  selector: 'app-pg-garantia-confiabilidad',
  templateUrl: './pg-garantia-confiabilidad.component.html',
  styleUrls: ['./pg-garantia-confiabilidad.component.scss']
})
export class PgGarantiaConfiabilidadComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService
  ) {}

  @Input() pgeneralService: PgeneralService;

  gridArgumento = new KendoGrid<CompuestoArgumentoModalidadAlternoDTO>();
  gridArgumentoDetalleSolucion = new KendoGrid<any>();

  dataMotivaciones: PGeneralArgumentoMotivacion[] = [];
  motivacionesView: Array<{ id: number; nombre: string; idPGeneral: number }> = [];

  subscriptions$: Subscription = new Subscription();
  loaderModal = false;
  modalRef: any;
  modalRefArgumento: any;
  esNuevo = true;
  dataModalidad: any;
  esNuevoDetalleSolucion = true;
  indexArgumentoGridTemp = 0;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  formArgumento: FormGroup = this.formBuilder.group({
    idArgumento: 0, 
    nombre: ['', [Validators.required, TextValidator.noStartSpace, TextValidator.noEndSpace]],
    descripcion: '',
    esVisibleAgenda: false,
    modalidades: [[], Validators.required],
    ArgumentoDetalle: [],
    idPGeneral: 0,
  });

  formDetalleSolucion: FormGroup = this.formBuilder.group({
    id: 0,
    detalle: ['', Validators.required],
    motivacion: [null, Validators.required], 
  });

  ngOnInit(): void {
    this.esNuevo = true;
    this.esNuevoDetalleSolucion = true;

    this.formService.erroMsj = {
      nombre: {
        required: 'Ingrese nombre',
        noStartSpace: 'El nombre no puede empezar con espacio',
        noEndSpace: 'El nombre no puede terminar con espacio',
      },
      modalidades: { required: 'Seleccione una modalidad' },
      detalle: { required: 'Ingrese el detalle' },
      motivacion: { required: 'Seleccione una motivación' },
    };

    this.obtener();
    this.obtenerComboModalidad();
    this.obtenerMotivaciones();
  }

  get dataItemPgeneral() {
    return this.pgeneralService.dataItemPgeneral;
  }

  private normalizeMotivaciones(list: any[]): Array<{ id: number; nombre: string; idPGeneral: number }> {
    return (list || [])
      .map((m: any) => ({
        id: Number(m?.id ?? m?.idMotivacion ?? m?.idmotivacion ?? m?.value ?? m?.codigo),
        nombre: String(m?.nombre ?? m?.nombreMotivacion ?? m?.nombremotivacion ?? m?.label ?? m?.descripcion ?? '').trim(),
        idPGeneral: Number(m?.idPGeneral ?? this.dataItemPgeneral?.id ?? 0),
      }))
      .filter(x => !!x.id && !!x.nombre);
  }
  private getMotivacionById(id: number | null | undefined) {
    if (id == null) return null;
    const num = Number(id);
    return this.motivacionesView.find(x => x.id === num) ?? null;
  }
  private coerceNumber(val: any): number | null {
    if (val == null || val === '') return null;
    const n = Number(val);
    return isNaN(n) ? null : n;
  }

  obtenerMotivaciones() {
    const idPG = this.pgeneralService.dataItemPgeneral?.id;
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.ProgramaGeneralArgumentoObtenerMotivaciones}/${idPG}`)
      .subscribe({
        next: (resp: HttpResponse<PGeneralArgumentoMotivacion[]>) => {
          this.dataMotivaciones = resp.body ?? [];
          this.motivacionesView = this.normalizeMotivaciones(this.dataMotivaciones);
        },
        error: (error) => {
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  abrirModal(context: any, esNuevo: boolean, dataItem: any) {
    this.modalRef = this.modalService.open(context, {
      size: 'xxl',
      backdrop: 'static',
      keyboard: false,
    });

    this.gridArgumentoDetalleSolucion.data = [];

    this.formArgumento.reset({
      idArgumento: 0,
      nombre: '',
      descripcion: '',
      modalidades: [],
      idPGeneral: this.dataItemPgeneral?.id ?? 0,
      ArgumentoDetalle: [],
      esVisibleAgenda: false,
    });

    this.esNuevo = esNuevo;

    if (dataItem && esNuevo === false) {
      const idArg = dataItem.id ?? dataItem.idArgumento ?? dataItem.idPresentacionArgumento ?? 0;
      const modalidadesPreSel = (dataItem.modalidades ?? []).map((m: any) => ({
        id: 0,
        idModalidadCurso: m.idModalidad,
        nombre: m.nombre,
      }));

      const detalleRaw =
        dataItem.ArgumentoDetalle ?? dataItem.argumentoDetalle ?? dataItem.presentacionArgumento ?? dataItem.Argumento ?? [];

      const detalle = detalleRaw.map((r: any) => {
        const idMot = this.coerceNumber(r?.motivacion?.id);
        const mot = idMot
          ? { id: idMot, idPGeneral: this.dataItemPgeneral?.id ?? 0, nombre: r?.motivacion?.nombre ?? '' }
          : { id: null, idPGeneral: this.dataItemPgeneral?.id ?? 0, nombre: '' };
        return { id: r?.id ?? 0, detalle: r?.detalle ?? '', motivacion: mot };
      });

      this.formArgumento.patchValue({
        idArgumento: idArg,
        nombre: dataItem.nombre ?? dataItem.nombreArgumento ?? '',
        descripcion: dataItem.descripcion ?? dataItem.descripcionArgumento ?? '',
        modalidades: modalidadesPreSel,
        idPGeneral: this.dataItemPgeneral?.id ?? 0,
        ArgumentoDetalle: detalle,
        esVisibleAgenda: !!dataItem.esVisibleAgenda,
      });

      this.gridArgumentoDetalleSolucion.data = detalle;
    }
  }

  abrirModalArgumento(context: any, esNuevoDetalleSolucion: boolean, dataItem: any, index: number) {
    this.esNuevoDetalleSolucion = esNuevoDetalleSolucion;

    if (dataItem && !esNuevoDetalleSolucion) {
      const idMot = this.coerceNumber(dataItem?.motivacion?.id);
      this.formDetalleSolucion.setValue({
        id: dataItem.id ?? 0,
        detalle: dataItem.detalle ?? '',
        motivacion: idMot,
      });
      this.indexArgumentoGridTemp = index;
    } else {
      this.formDetalleSolucion.reset({ id: 0, detalle: '', motivacion: null });
    }

    this.modalRefArgumento = this.modalService.open(context, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      centered: true,
    });
  }

  getErrorMessage(controlName: string): string {
    const formControl: FormControl = this.formArgumento.get(controlName) as FormControl;
    return this.formService.errorMessage(formControl, controlName);
  }
  getErrorMessageDetalle(controlName: string): string {
    const formControl: FormControl = this.formDetalleSolucion.get(controlName) as FormControl;
    return this.formService.errorMessage(formControl, controlName);
  }

  obtener() {
    this.gridArgumento.data = [];
    this.gridArgumento.loading = true;
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.ProgramaGeneralArgumentoObtener}/${this.dataItemPgeneral.id}`)
      .subscribe({
        next: (resp: HttpResponse<CompuestoArgumentoModalidadAlternoDTO[]>) => {
          this.gridArgumento.data = resp.body ?? [];
          this.gridArgumento.loading = false;
        },
        error: (error) => {
          this.gridArgumento.loading = false;
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerComboModalidad() {
    this.dataModalidad = this.pgeneralService?.combosConfiguracionPlantilla?.modalidadCurso ?? [];
    this.dataModalidad = this.dataModalidad.map((obj: ModalidadCursoAlternoDTO) => ({
      id: 0,
      idModalidadCurso: obj.id,
      nombre: obj.nombre,
    }));
  }

  private buildInsertPayload(): any {
    const modalidades = (this.formArgumento.get('modalidades')?.value || []).map((item: any) => ({
      id: 0,
      nombre: item.nombre,
      idModalidad: item.idModalidadCurso,
    }));

    const argumentoDetalle = (this.gridArgumentoDetalleSolucion.data || []).map((r: any) => {
      const mot = r?.motivacion && typeof r.motivacion === 'object'
        ? r.motivacion
        : this.getMotivacionById(this.coerceNumber(r?.motivacion));
      return {
        id: r?.id ?? 0,
        detalle: r?.detalle ?? '',
        motivacion: {
          id: mot?.id ?? 0,
          idPGeneral: this.dataItemPgeneral?.id ?? 0,
          nombre: mot?.nombre ?? '',
        }
      };
    });

    return {
      idPGeneral: this.dataItemPgeneral?.id ?? 0,
      nombre: this.formArgumento.get('nombre')?.value,
      descripcion: this.formArgumento.get('descripcion')?.value,
      modalidades,
      ArgumentoDetalle: argumentoDetalle,
      esVisibleAgenda: this.formArgumento.get('esVisibleAgenda')?.value,
    };
  }

  private buildUpdatePayload(): any {
    const base = this.buildInsertPayload();
    return {
      ...base,
      id: this.formArgumento.get('idArgumento')?.value ?? 0, 
    };
  }

  insertar() {
    if (this.formArgumento.invalid) {
      this.formArgumento.markAllAsTouched();
      return;
    }

    const payload = this.buildInsertPayload();
    this.loaderModal = true;

    this.integraService
      .postJsonResponse(constApiPlanificacion.ProgramaGeneralArgumentoInsertar, JSON.stringify(payload))
      .subscribe({
        next: (_: HttpResponse<any>) => {
          this.modalRef?.close();
          this.loaderModal = false;
          this.alertaService.mensajeExitoso();
          this.pgeneralService.obtenerInformacionConfiguracionCliente();
          this.obtener();
        },
        error: (error: any) => {
          this.modalRef?.close();
          this.loaderModal = false;
          this.alertaService.notificationError(error.message);
        },
      });
  }

  actualizar() {
    if (this.formArgumento.invalid) {
      this.formArgumento.markAllAsTouched();
      return;
    }

    const payload = this.buildUpdatePayload();
    if (!payload.id || payload.id <= 0) {
      this.alertaService.notificationWarning('No se encontró el Id del argumento para actualizar.');
      return;
    }

    this.loaderModal = true;

    this.integraService
      .postJsonResponse(constApiPlanificacion.ProgramaGeneralArgumentoActualizar, JSON.stringify(payload))
      .subscribe({
        next: (_: HttpResponse<any>) => {
          this.modalRef?.close();
          this.loaderModal = false;
          this.alertaService.mensajeExitoso();
          this.pgeneralService.obtenerInformacionConfiguracionCliente();
          this.obtener();
        },
        error: (error: any) => {
          this.modalRef?.close();
          this.loaderModal = false;
          this.alertaService.notificationError(error.message);
        },
      });
  }

  eliminar(dataItem: any) {
    this.alertaService
      .swalFireOptions({
        title: '¿Está seguro de eliminar el registro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.gridArgumento.loading = true;
          const idEliminar = dataItem.id ?? dataItem.idArgumento ?? dataItem.idPresentacionArgumento ?? 0;

          this.integraService
            .deleteJsonResponse(`${constApiPlanificacion.ProgramaGeneralArgumentoEliminar}/${idEliminar}`)
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridArgumento.loading = false;
                if (response.body === true) {
                  const idIndice = this.gridArgumento.data.indexOf(dataItem);
                  this.gridArgumento.data.splice(idIndice, 1);
                  this.gridArgumento.loadView();
                  this.alertaService.mensajeIcon('¡Eliminado!', 'El registro ha sido eliminado', 'success');
                } else {
                  this.alertaService.mensajeIcon('¡Error!', 'Ocurrió un problema al eliminar', 'warning');
                }
              },
              error: (error: any) => {
                this.alertaService.notificationError(error.message);
              },
            });
        }
      });
  }

  guardarDetalle() {
    if (this.formDetalleSolucion.invalid) {
      this.formDetalleSolucion.markAllAsTouched();
      return;
    }

    const { id, detalle, motivacion } = this.formDetalleSolucion.value;
    const mot = this.getMotivacionById(motivacion);
    const motivacionObj = mot
      ? { id: mot.id, idPGeneral: this.dataItemPgeneral?.id ?? 0, nombre: mot.nombre }
      : { id: 0, idPGeneral: this.dataItemPgeneral?.id ?? 0, nombre: '' };

    const nuevoItem = { id: id || 0, detalle, motivacion: motivacionObj };

    if (this.esNuevoDetalleSolucion) {
      this.gridArgumentoDetalleSolucion.data = [ ...(this.gridArgumentoDetalleSolucion.data || []), nuevoItem ];
    } else {
      this.gridArgumentoDetalleSolucion.data.splice(this.indexArgumentoGridTemp, 1, nuevoItem);
    }

    this.formDetalleSolucion.reset({ id: 0, detalle: '', motivacion: null });
    this.modalRefArgumento?.close();
    const nombreMot = motivacionObj?.nombre || '';
    this.alertaService.mensajeIcon('Guardado', nombreMot ? `Motivación: ${nombreMot}` : 'Detalle agregado', 'success');
  }

  eliminarArgumento(index: number) {
    this.gridArgumentoDetalleSolucion.data.splice(index, 1);
  }

  impresionModalidad(dataItem: any): string {
    const mods = dataItem?.modalidades ?? [];
    if (!Array.isArray(mods) || mods.length === 0) return '—';
    return mods.map((m: any) => m?.nombre).filter(Boolean).join(', ');
  }
}

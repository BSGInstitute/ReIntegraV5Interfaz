import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { constApiGlobal, constApiPlanificacion } from '@environments/constApi';
import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-modal-content-pgeneral-historial-monto-pago',
  templateUrl: './modal-content-pgeneral-historial-monto-pago.component.html',
  styleUrls: ['./modal-content-pgeneral-historial-monto-pago.component.scss'],
})
export class ModalContentPgeneralHistorialMontoPagoComponent implements OnInit {
  gridHistorial: KendoGrid = new KendoGrid();
  formFiltros = this._formBuilder.group({
    fechaInicio: [null],
    fechaFin: [null],
    idPais: [null],
    idVersion: [null],
    idTipoPago: [null],
  });
  loaderModal: boolean = false;
  listaVersiones: IComboBase1[] = [];
  listaTiposPago: IComboBase1[] = [];
  listaPaises: IComboBase1[] = [];
  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}
  private _subscriptions$: Subscription = new Subscription();

  @Input() pgeneralService: PgeneralService;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  get dataItemPgeneral() {
    return this.pgeneralService.dataItemPgeneral;
  }
  ngOnInit(): void {
    this.cargarFiltros();
  }

  cargarFiltros() {
    this.listaTiposPago = [
      { id: 1, nombre: 'Contado' },
      { id: 2, nombre: 'Crédito' },
    ];
    this.ObtenerPais();
    this.ObtenerVersion();
  }

  Obtener() {
    this.gridHistorial.loading = true;
    const filtro = this.buildFiltro();
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.MontoPagoLogObtenerReporteMontoPagoHistorico,
        filtro
      )
      .subscribe({
        next: (resp: HttpResponse<any[]>) => {
          this.gridHistorial.data = resp.body;
          this.gridHistorial.loading = false;
        },
        error: (error) => {
          console.log('Error al obtener el historial');
          this.gridHistorial.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  ObtenerPais() {
    this._integraService
      .getJsonResponse(constApiGlobal.PaisObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.listaPaises = resp.body;
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  ObtenerVersion() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.VersionProgramaObtener)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.listaVersiones = resp.body;
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  buildFiltro(): any {
    return {
      fechaInicial: this.formFiltros.value.fechaInicio,
      fechaFinal: this.formFiltros.value.fechaFin,
      idPais: this.formFiltros.value.idPais,
      idVersion: this.formFiltros.value.idVersion,
      idTipoPago: this.formFiltros.value.idTipoPago,
      idPGeneral: this.dataItemPgeneral.id,
    };
  }
}

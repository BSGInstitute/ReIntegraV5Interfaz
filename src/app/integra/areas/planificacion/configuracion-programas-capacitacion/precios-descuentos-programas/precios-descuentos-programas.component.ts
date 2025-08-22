import { Component, OnInit, ViewChild } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { HttpResponse } from '@angular/common/http';
import { constApiPlanificacion } from '@environments/constApi';
import {
  DropDownFilterSettings,
  VirtualizationSettings,
} from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-treelist';

interface Programas {
  id: number;
  nombre: string;
  idArea: number;
  idSubArea: number;
  idCategoria: number;
}
interface SubArea {
  id: number;
  nombre: string;
  idAreaCapacitacion: number;
}
interface ITipoDescuento {
  id: number;
  codigo: string;
  descripcion: string;
  formula: number;
  porcentajeGeneral: number | null;
  porcentajeMatricula: number | null;
  fraccionesMatricula: number | null;
  porcentajeCuotas: number | null;
  cuotasAdicionales: number | null;
}
interface FormFiltro {
  idArea: number;
  idSubArea: number;
  idCategoria: number;
}
@Component({
  selector: 'app-precios-descuentos-programas',
  templateUrl: './precios-descuentos-programas.component.html',
  styleUrls: ['./precios-descuentos-programas.component.scss'],
})
export class PreciosDescuentosProgramasComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}
  @ViewChild('modalDescuentoAsociar') modalDescuentoAsociar: any;
  public defaultItemDescuentos: { codigo: string; id: number } = {
    codigo: 'Seleccionar',
    id: null,
  };
  formControlIdsAsociarDescuento: FormControl = new FormControl(null);
  idPgeneralTemp: number;
  gridPrograma = new KendoGrid<Programas>();
  private _sourcePGeneral: Programas[];
  enProcesoSolicitud: boolean = false;
  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  dataArea: IComboBase1[] = [];
  filtroSubArea: SubArea[] = [];
  private _sourceSubArea: SubArea[] = [];
  dataCategoria: IComboBase1[] = [];
  sourceCategoria: IComboBase1[] = [];
  dataTipoDescuento: ITipoDescuento[] = [];
  formFiltro: FormGroup = this.formBuilder.group({
    idArea: [null],
    idSubArea: [{ value: null, disabled: true }],
    idCategoria: [null],
  });

  modalRef: NgbModalRef = null;
  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  ngOnInit(): void {
    this.obtenerCombo();
    this.obtenerTipoDescuento();
    this.obtenerProgramasMontoPagoPanel();
  }
  filtrarProgramas() {
    let datosFiltro = this.formFiltro.getRawValue() as FormFiltro;
    let filtroTemp: Programas[] = [];
    filtroTemp = this._sourcePGeneral.map((x) => ({
      ...x,
    }));
    if (datosFiltro.idArea != null) {
      filtroTemp = filtroTemp.filter((x) => x.idArea == datosFiltro.idArea);
    }
    if (datosFiltro.idSubArea != null) {
      filtroTemp = filtroTemp.filter(
        (x) => x.idSubArea == datosFiltro.idSubArea
      );
    }
    if (datosFiltro.idCategoria != null) {
      filtroTemp = filtroTemp.filter(
        (x) => x.idCategoria == datosFiltro.idCategoria
      );
    }
    this.gridPrograma.data = filtroTemp;
  }
  obtenerProgramasMontoPagoPanel() {
    this.gridPrograma.loading = true;
    this.integraService
      .getJsonResponse(
        constApiPlanificacion.MontoPagoObtenerProgramasMontoPagoPanel
      )
      .subscribe({
        next: (resp: HttpResponse<Programas[]>) => {
          this.gridPrograma.loading = false;
          this.gridPrograma.data = resp.body;
          this._sourcePGeneral = [...resp.body];
        },
        error: (error) => {
          this.gridPrograma.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  getNombreAreaById(id: number) {
    let item = this.dataArea.find((x) => x.id === id);
    return item ? item.nombre : '';
  }
  obtenerCombo() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.MontoPagoObtenerCombosModuloAsync}`
      )
      .subscribe({
        next: (resp) => {
          this.dataArea = resp.body.areaCapacitacion;
          this.filtroSubArea = [...resp.body.subAreaCapacitacion];
          this._sourceSubArea = [...resp.body.subAreaCapacitacion];
          this.dataCategoria = resp.body.categoriaPrograma;
          this.sourceCategoria = [...resp.body.categoriaPrograma];
        },
      });
  }
  getNombreSubAreaById(id: number) {
    const item = this._sourceSubArea.find((obj) => obj.id === id);
    return item ? item.nombre : null;
  }
  obtenerTipoDescuento() {
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.ObtenerTipoDescuento}`)
      .subscribe({
        next: (resp: HttpResponse<ITipoDescuento[]>) => {
          this.dataTipoDescuento = resp.body;
        },
      });
  }
  abrirModalAsociarDescuentos(context: any, idPGeneral: number): void {
    this.idPgeneralTemp = idPGeneral;
    this.formControlIdsAsociarDescuento.reset();
    this.gridPrograma.loading = true;
    this.enProcesoSolicitud = false;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.PGeneralTipoDescuentoObtenerDescuentosPorPrograma}/${idPGeneral}`
      )
      .subscribe({
        next: (response: HttpResponse<{ idTipoDescuentos: number[] }>) => {
          this.gridPrograma.loading = false;
          if (response.body.idTipoDescuentos.length > 0) {
            this.formControlIdsAsociarDescuento.setValue(
              response.body.idTipoDescuentos
            );
          } else {
            this.formControlIdsAsociarDescuento.setValue([]);
          }
          this.modalRef = this.modalService.open(context, {
            size: 'md',
            backdrop: 'static',
            keyboard: false,
          });
        },
        error: (error) => {
          this.gridPrograma.loading = false;
          let resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title:
              '¡Ocurrio un problema al obtener los descuentos registrados!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  guardarDescuentosAsociados(): void {
    let dataEnviada: {
      idPgeneral: number;
      descuentos: number[];
    } = {
      idPgeneral: this.idPgeneralTemp,
      descuentos: this.formControlIdsAsociarDescuento.value ?? [],
    };
    this.enProcesoSolicitud = true;
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.PGeneralTipoDescuentoAsociarDescuentos,
        dataEnviada
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.enProcesoSolicitud = false;
          this.alertaService
            .swalFireOptions({
              icon: 'success',
              title: '¡Descuentos Asociados correctamente!',
            })
            .then(() => {
              this.modalRef.close();
            });
        },
        error: (error) => {
          this.enProcesoSolicitud = false;
          let resp = this.alertaService.getErrorResponse(error);
          this.alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al asociar los descuentos!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  cancelar(): void {
    if (this.modalRef != null) {
      this.modalRef.close();
      this.modalRef = null;
    }
    this.formControlIdsAsociarDescuento.reset();
  }
  onValueChangeArea(idArea: number) {
    this.formFiltro.get('idSubArea').setValue(null);
    if (idArea != null) {
      this.filtroSubArea = this._sourceSubArea.filter(
        (x) => idArea == x.idAreaCapacitacion
      );
      this.formFiltro.get('idSubArea').enable();
    } else {
      this.filtroSubArea = [];
      this.formFiltro.get('idSubArea').disable();
    }
  }
}

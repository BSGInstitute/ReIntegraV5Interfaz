import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ConfiguracionBeneficio,
  SubEstadoMatricula,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

interface ConfiguracionBeneficioProgramaGeneral {
  idPgeneral: number;
  idBeneficio: number;
  requisitos: string;
  procesoSolicitud: string;
  detallesAdicionales: string;
}
@Component({
  selector: 'app-pg-beneficios',
  templateUrl: './pg-beneficios.component.html',
  styleUrls: ['./pg-beneficios.component.scss'],
})
export class PgBeneficiosComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private _integraService: IntegraService,
    private _modalService: NgbModal,
    private _alertaService: AlertaService
  ) {}
  @Input() pgeneralService: PgeneralService;
  gridCriterioBeneficiosPgeneral = new KendoGrid<ConfiguracionBeneficio>();
  comboEstadoMatricula: IComboBase1[] = [];
  comboSubEstadoMatricula: SubEstadoMatricula[] = [];
  comboPaises: IComboBase1[] = [];
  comboDatoAdicional: IComboBase1[] = [];
  comboVersiones: IComboBase1[] = [];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  formBeneficio = this._formBuilder.group({
    requisitos: null,
    procesoSolicitudBeneficio: null,
    detallesAdicionales: null,
  });
  ngOnInit(): void {
    this.initCombos();
    this.configurarGridCriterioBeneficiosPgeneral();
    this.initSubscribeObservables();
  }
  private initCombos() {
    this.comboEstadoMatricula =
      this.pgeneralService.combosConfiguracionPlantilla.estadoMatricula.slice();
    // this.comboSubEstadoMatricula = this.pgeneralService.combosConfiguracionPlantilla.subEstadoMatricula.slice();
    this.comboPaises =
      this.pgeneralService.combosConfiguracionPlantilla.pais.slice();
    this.comboDatoAdicional =
      this.pgeneralService.combosConfiguracionPlantilla.beneficioDatoAdicional.slice();
    this.comboVersiones =
      this.pgeneralService.combosModulo.versionPrograma.slice();
  }
  private initSubscribeObservables() {
    this.pgeneralService.detalleProgramas$.subscribe((resp) => {
      if (resp != null) {
        let data: ConfiguracionBeneficio[] = resp.configuracionBeneficio.map(
          (e) => ({
            ...e,
            disabledEditar: e.asosiar != true,
          })
        );
        this.gridCriterioBeneficiosPgeneral.data = data;
      }
    });
    this.pgeneralService.getDatosModalPgeneral$.subscribe(() => {
      if (this.gridCriterioBeneficiosPgeneral.statusCelda) {
        this.gridCriterioBeneficiosPgeneral.closeCell();
      }
      this.pgeneralService.dataConfiguracionBeneficio$.next(
        this.gridCriterioBeneficiosPgeneral.data
      );
    });
  }
  obtenerNombreEstado(idEstadoMatricula: number) {
    let item =
      this.pgeneralService.combosConfiguracionPlantilla.estadoMatricula.find(
        (x) => x.id == idEstadoMatricula
      );
    if (item != null) {
      return item.nombre;
    }
    return null;
  }
  obtenerNombreSubEstado(idSubEstadoMatricula: number) {
    let item =
      this.pgeneralService.combosConfiguracionPlantilla.subEstadoMatricula.find(
        (x) => x.id == idSubEstadoMatricula
      );
    if (item != null) {
      return item.nombre;
    }
    return null;
  }
  obtenerNombrePais(idPais: number) {
    let item = this.pgeneralService.combosConfiguracionPlantilla.pais.find(
      (x) => x.id == idPais
    );
    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }
  obtenerNombreVersion(idVersion: number) {
    let item = this.pgeneralService.combosModulo.versionPrograma.find(
      (x) => x.id == idVersion
    );
    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }
  obtenerNombreDatoAdicional(idVersion: number) {
    let item =
      this.pgeneralService.combosConfiguracionPlantilla.beneficioDatoAdicional.find(
        (x) => x.id == idVersion
      );
    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }
  private configurarGridCriterioBeneficiosPgeneral() {
    this.gridCriterioBeneficiosPgeneral.formGroup = this._formBuilder.group({
      ordenBeneficio: null,
      estadosMatricula: null,
      subEstadosMatricula: null,
      paises: null,
      versiones: null,
      entrega: null,
      asosiar: null,
      avanceAcademico: null,
      deudaPendiente: null,
      datosAdicional: null,
      datosAdicionales: null,
    });
    this.gridCriterioBeneficiosPgeneral.cellClickEvent$.subscribe((resp) => {
      if (resp.column.field == 'subEstadosMatricula') {
        this.onValueChangeEstadoMatricula(resp.dataItem.estadosMatricula);
      }
    });
    this.gridCriterioBeneficiosPgeneral.cellCloseEvent$.subscribe((resp) => {
      let datosForm = resp.formGroup.value as ConfiguracionBeneficio;
      switch (resp.column.field) {
        case 'ordenBeneficio':
          resp.dataItem.ordenBeneficio = datosForm.ordenBeneficio;
          break;
        case 'estadosMatricula':
          resp.dataItem.estadosMatricula = datosForm.estadosMatricula;
          this.onValueChangeEstadoMatricula(
            resp.dataItem.estadosMatricula,
            resp.dataItem
          );
          break;
        case 'subEstadosMatricula':
          resp.dataItem.subEstadosMatricula = datosForm.subEstadosMatricula;
          break;
        case 'paises':
          resp.dataItem.paises = datosForm.paises;
          break;
        case 'versiones':
          resp.dataItem.versiones = datosForm.versiones;
          break;
        case 'entrega':
          resp.dataItem.entrega = datosForm.entrega ?? 0;
          break;
        case 'asosiar':
          resp.dataItem.asosiar = datosForm.asosiar;
          break;
        case 'avanceAcademico':
          resp.dataItem.avanceAcademico = datosForm.avanceAcademico;
          break;
        case 'deudaPendiente':
          resp.dataItem.deudaPendiente = datosForm.deudaPendiente;
          break;
        case 'datosAdicional':
          resp.dataItem.datosAdicional = datosForm.datosAdicional;
          break;
        case 'datosAdicionales':
          resp.dataItem.datosAdicionales = datosForm.datosAdicionales;
          break;
        default:
          break;
      }
    });
  }
  /**
   * Carga los subestados de acuerdo al idestado
   * @param idsEstado Array de numeros
   * @param dataItem Objeto de tipo ConfiguracionPlantillaDetalle
   */
  public onValueChangeEstadoMatricula(
    idsEstado: number[],
    dataItem?: ConfiguracionBeneficio
  ) {
    if (idsEstado != null && idsEstado.length > 0) {
      this.comboSubEstadoMatricula =
        this.pgeneralService.combosConfiguracionPlantilla.subEstadoMatricula.filter(
          (x) => idsEstado.includes(x.idEstadoMatricula)
        );
      if (dataItem != null) {
        dataItem.subEstadosMatricula = dataItem.subEstadosMatricula.filter(
          (x) => this.comboSubEstadoMatricula.map((s) => s.id).includes(x)
        );
      }
    } else {
      this.comboSubEstadoMatricula = [];
      if (dataItem != null) {
        dataItem.subEstadosMatricula = [];
      }
    }
  }
  public enProcesoSolicitud: boolean = false;
  public _configuracionBeneficioTemp: ConfiguracionBeneficio;
  public _modalRefMontoPago: any;

  public visualizarRequisitoDetalle(context: any, dataItem: ConfiguracionBeneficio) {
    this._configuracionBeneficioTemp = dataItem;
    let idPgeneral = this.pgeneralService.idProgramaGeneral;
    this.enProcesoSolicitud = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerInformacionBeneficioRequisitpDetalle}/${idPgeneral}/${dataItem.idBeneficio}`
      )
      .subscribe({
        next: (resp: HttpResponse<ConfiguracionBeneficioProgramaGeneral>) => {
          this.enProcesoSolicitud = false;
          if (resp.body) {
            this.formBeneficio.get('requisitos').setValue(resp.body.requisitos);
            this.formBeneficio
              .get('procesoSolicitudBeneficio')
              .setValue(resp.body.procesoSolicitud);
            this.formBeneficio
              .get('detallesAdicionales')
              .setValue(resp.body.detallesAdicionales);
            this._modalRefMontoPago = this._modalService.open(context, {
              keyboard: false,
              size: 'lg',
            });
          }
        },
        error: (error) => {
          this.enProcesoSolicitud = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener la configuración!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  public guardarDatosBeneficio() {
    let item: ConfiguracionBeneficioProgramaGeneral = {
      idPgeneral: this._configuracionBeneficioTemp.idPGeneral,
      idBeneficio: this._configuracionBeneficioTemp.idBeneficio,
      requisitos: this.formBeneficio.get('requisitos').value,
      procesoSolicitud: this.formBeneficio.get('procesoSolicitudBeneficio')
        .value,
      detallesAdicionales: this.formBeneficio.get('detallesAdicionales').value,
    };
    this.enProcesoSolicitud = true;
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.ProgramaGeneralActualizarInformacionBeneficioDetalleRequisito,
        JSON.stringify(item)
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.enProcesoSolicitud = false;
          this._alertaService
            .swalFireOptions({
              icon: 'success',
              title: '¡Se guardaron los cambios correctamente!',
            })
            .then(() => {
              this._modalRefMontoPago.close();
            });
        },
        error: (error) => {
          this.enProcesoSolicitud = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al guardar los cambios!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
}

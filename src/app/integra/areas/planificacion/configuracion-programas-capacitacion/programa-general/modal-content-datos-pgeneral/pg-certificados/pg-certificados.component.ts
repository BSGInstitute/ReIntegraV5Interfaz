import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PlantillaBase } from '@planificacion/models/enumPgeneral';
import {
  ConfiguracionPlantilla,
  ConfiguracionPlantillaDetalle,
  PlantilaCertificadoConstancum,
  SubEstadoMatricula,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { GridComponent } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';

interface FormAsociarPlantilla {
  plantillaFrontal: number;
  plantillaPosterior: number;
  modalidades: number[];
  remplazarCertificadosGenerados: boolean;
}

@Component({
  selector: 'app-pg-certificados',
  templateUrl: './pg-certificados.component.html',
  styleUrls: ['./pg-certificados.component.scss'],
})
export class PgCertificadosComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _modelService: NgbModal
  ) {}
  @Input() pgeneralService: PgeneralService;

  gridPlantillasAsociadasCertificado = new KendoGrid<ConfiguracionPlantilla>();
  gridCriterioConstancia = new KendoGrid<ConfiguracionPlantillaDetalle>();
  tipoPrograma: FormControl = new FormControl(null);
  modalRef: NgbModalRef;
  comboTipoPrograma = [
    { id: false, nombre: 'Padre' },
    { id: true, nombre: 'Modulo' },
  ];
  comboModalidades: IComboBase1[] = [];
  comboPlantilla: PlantilaCertificadoConstancum[] = [];
  comboEstados: IComboBase1[] = [];
  comboSubEstados: SubEstadoMatricula[] = [];
  comboOperadorComparacion: IComboBase1[] = [];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  enProcesoSolicitud: boolean = false;
  formAsociarPlantilla: FormGroup;
  isNew: boolean = false;
  disabledBtnVistaPrevia: boolean = false;
  dataItemTemp: ConfiguracionPlantilla;
  private _dataSubscription$: Subscription;

  ngOnInit(): void {

    this.configurarGrid();
    this.initFormAsociarPlantilla();
    this.initCombos();
    this.initSubscribeObservables();
    this.asignarValoresForm();
  }
  ngOnDestroy(): void {
    if (this._dataSubscription$ != null) {
      this._dataSubscription$.unsubscribe();
    }
  }
  /**
   * Creacion de formulario
   */
  private initFormAsociarPlantilla() {
    this.formAsociarPlantilla = this._formBuilder.group({
      plantillaFrontal: [null, Validators.required],
      plantillaPosterior: null,
      modalidades: null,
      remplazarCertificadosGenerados: null,
    });
  }
  /**
   * Inicia los valores de los combos;
   */
  private initCombos() {
    this.comboModalidades = this.pgeneralService.combosModulo.modalidadCurso;
    this.comboPlantilla =
      this.pgeneralService.combosConfiguracionPlantilla.plantilaCertificadoConstancia.filter(
        (x) => x.idPlantillaBase == PlantillaBase.CERTIFICADO
      );
    this.comboOperadorComparacion =
      this.pgeneralService.combosConfiguracionPlantilla.operadorComparacion
    this.comboEstados =
      this.pgeneralService.combosConfiguracionPlantilla.estadoMatricula;
  }
  /**
   * Inicia la suscripcion de observables
   */
  private initSubscribeObservables() {
    this._dataSubscription$ = new Subscription();
    let sub$ = this.pgeneralService.detalleProgramas$.subscribe((resp) => {
      if (resp != null) {
        let data = resp.configuracionPlantilla.filter(
          (x) => x.idPlantillaBase == PlantillaBase.CERTIFICADO
        );
        data.forEach((x) => {
          x.nombrePlantillaFrontal = this.obtenerNombrePlantillaConstancia(
            x.idPlantillaFrontal
          );
          x.nombrePlantillaPosterior = this.obtenerNombrePlantillaConstancia(
            x.idPlantillaPosterior
          );
        });
        this.gridPlantillasAsociadasCertificado.data = data;
      }
    });
    this.pgeneralService.getDatosModalPgeneral$.subscribe(() => {
      this.pgeneralService.dataConfiguracionPlantilla$.next(
        this.gridPlantillasAsociadasCertificado.data
      );
    });
    this._dataSubscription$.add(sub$);
  }
  /**
   * Inicia los valores del formulario
   */
  private asignarValoresForm() {
    let dataItem = this.pgeneralService.dataItemPgeneral;
    this.tipoPrograma.setValue(false);
  }
  /**
   * Obtiene el nombre de plantilla por su id
   * @param idPlantilla
   * @returns {string} Nombre de la plantilla
   */
  obtenerNombrePlantillaConstancia(idPlantilla: number) {
    let comboPlantilla =
      this.pgeneralService.combosConfiguracionPlantilla.plantilaCertificadoConstancia.filter(
        (x) => x.idPlantillaBase == PlantillaBase.CERTIFICADO
      );
    let item = comboPlantilla.find((x) => x.id == idPlantilla);
    if (item != null) {
      return item.nombre;
    }
    return null;
  }
  abrirModalAsociarPlantilla(context: any, dataItem?: ConfiguracionPlantilla) {
    this.formAsociarPlantilla.reset();
    this.disabledBtnVistaPrevia = false;
    if (dataItem != null) {
      this.isNew = false;
      this.dataItemTemp = dataItem;
      let idsModalidades = dataItem.detalle.map((x) => x.idModalidadCurso);
      this.formAsociarPlantilla.get('modalidades').setValue(idsModalidades);
      this.formAsociarPlantilla
        .get('plantillaFrontal')
        .setValue(dataItem.idPlantillaFrontal);
      this.formAsociarPlantilla
        .get('plantillaPosterior')
        .setValue(dataItem.idPlantillaPosterior);
      this.formAsociarPlantilla
        .get('remplazarCertificadosGenerados')
        .setValue(dataItem.remplazarCertificados);
      let detalle: ConfiguracionPlantillaDetalle[] = dataItem.detalle.map(
        (x) => ({
          ...x,
          estadosMatricula: [...x.estadosMatricula],
          subEstadosMatricula: [...x.subEstadosMatricula],
        })
      );
      this.gridCriterioConstancia.data = detalle;
    } else {
      this.isNew = true;
      this.dataItemTemp = null;
      this.gridCriterioConstancia.data = [];
    }
    this.modalRef = this._modelService.open(context, {
      size: 'xl',
      keyboard: false,
      backdrop: 'static',
      centered: true
    });
  }
  onValueChangeModalidad(idsModalidades: number[], grid: GridComponent) {
    if (grid != null) {
      try {
        grid.closeCell();
      } catch (error) {
        console.log(error);
      }
    }
    if (idsModalidades != null && idsModalidades.length > 0) {
      let data = this.gridCriterioConstancia
        .data as ConfiguracionPlantillaDetalle[];
      data = data.filter((x) => idsModalidades.includes(x.idModalidadCurso));
      let idsModalidadRestante = idsModalidades.filter(
        (x) => !data.map((s) => s.idModalidadCurso).includes(x)
      );
      if (idsModalidadRestante != null && idsModalidadRestante.length > 0) {
        let newItems = idsModalidadRestante.map((s) => {
          let item: ConfiguracionPlantillaDetalle = {
            id: 0,
            idPgeneralConfiguracionPlantilla: 0,
            idModalidadCurso: s,
            deudaPendiente: false,
            estadosMatricula: [],
            subEstadosMatricula: [],
            notaAprobatoria: 0
          };
          return item;
        });
        this.gridCriterioConstancia.data = [...data, ...newItems];
      } else {
        this.gridCriterioConstancia.data = [...data];
      }
    } else {
      this.gridCriterioConstancia.data = [];
    }
  }
  /**
   * Procesa los valores del formulario y la grilla
   * @returns {ConfiguracionPlantilla} La configuracion de la plantilla
   */
  recuperarValoresForm() {
    let datosForm =
      this.formAsociarPlantilla.getRawValue() as FormAsociarPlantilla;
    let dataDetalle = this.gridCriterioConstancia
      .data as ConfiguracionPlantillaDetalle[];
    let item: ConfiguracionPlantilla = {
      id: this.isNew ? 0 : this.dataItemTemp.id,
      idPlantillaFrontal: datosForm.plantillaFrontal,
      idPlantillaPosterior: datosForm.plantillaPosterior,
      idPlantillaBase: null,
      ultimaFechaRemplazarCertificado: null,
      remplazarCertificados: datosForm.remplazarCertificadosGenerados ?? false,
      detalle: dataDetalle,
      nombrePlantillaFrontal: this.obtenerNombrePlantillaConstancia(
        datosForm.plantillaFrontal
      ),
      nombrePlantillaPosterior: this.obtenerNombrePlantillaConstancia(
        datosForm.plantillaPosterior
      ),
    };
    return item;
  }
  /**
   * Inserta un nuevo registro a la grilla de plantillas asociadas
   */
  insertarConstancia() {
    if (this.formAsociarPlantilla.invalid) {
      this.formAsociarPlantilla.markAllAsTouched();
      return;
    }
    let item = this.recuperarValoresForm();
    let dataPrincipal = this.gridPlantillasAsociadasCertificado.data;
    this.gridPlantillasAsociadasCertificado.data = [...dataPrincipal, item];
    this.modalRef.close();
  }
  /**
   * Actualiza el registro de plantillas asociadas
   */
  actualizarConstancia() {
    if (this.formAsociarPlantilla.invalid) {
      this.formAsociarPlantilla.markAllAsTouched();
      return;
    }
    let item = this.recuperarValoresForm();
    this.dataItemTemp.idPlantillaFrontal = item.idPlantillaFrontal;
    this.dataItemTemp.idPlantillaPosterior = item.idPlantillaPosterior;
    (this.dataItemTemp.nombrePlantillaFrontal =
      this.obtenerNombrePlantillaConstancia(item.idPlantillaFrontal)),
      (this.dataItemTemp.nombrePlantillaPosterior =
        this.obtenerNombrePlantillaConstancia(item.idPlantillaPosterior)),
      (this.dataItemTemp.idPlantillaPosterior = item.idPlantillaPosterior);
    this.dataItemTemp.remplazarCertificados = item.remplazarCertificados;
    this.dataItemTemp.detalle = item.detalle;
    this.modalRef.close();
  }
  /**
   * Genera la vista previa del certificado
   * @returns
   */
  onClickVistaPrevia(): void {
    this.disabledBtnVistaPrevia = true;
    let datosForm =
      this.formAsociarPlantilla.getRawValue() as FormAsociarPlantilla;
    if (datosForm.plantillaFrontal == null || datosForm.plantillaFrontal == 0) {
      this._alertaService.swalFireOptions({
        icon: 'info',
        title: 'La plantilla frontal es obligatoria',
        allowOutsideClick: false,
      });
      this.disabledBtnVistaPrevia = false;
      return;
    }
    const api =
      constApiPlanificacion.ProgramaGeneralGenerarVistaPreviaCertificado;
    this._integraService
      .getJsonResponse(
        `${api}/${datosForm.plantillaFrontal}/${
          datosForm.plantillaPosterior ?? 0
        }/${this.pgeneralService.dataItemPgeneral.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<string>) => {
          this.disabledBtnVistaPrevia = false;
          this._generarDocumentoByte(resp.body);
        },
        error: (error) => {
          this.disabledBtnVistaPrevia = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  private _generarDocumentoByte(data: string) {
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.style.display = 'none';

    let base64str = data;
    let binary = atob(base64str.replace(/\s/g, ''));
    let len = binary.length;
    let buffer = new ArrayBuffer(len);
    let view = new Uint8Array(buffer);
    for (let i = 0; i < len; i++) {
      view[i] = binary.charCodeAt(i);
    }
    let blob = new Blob([view], { type: 'application/pdf' });
    let url = URL.createObjectURL(blob);
    window.open(url, 'EPrescription');
    a.href = url;
    a.download = 'Vista Previa';
    a.click();
    window.URL.revokeObjectURL(url);
  }
  /**
   * Obtiene el nombre de estado por su id
   * @param {number} idEstado
   * @returns {string} Nombre Estado
   */
  obtenerNombreEstado(idEstado: number): string {
    let item = this.comboEstados.find((x) => x.id == idEstado);
    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }
  /**
   * Obtiene el nombre del subestado por id
   * @param {number} idSubEstado
   * @returns Nombre del sub estado
   */
  obtenerNombreSubEstado(idSubEstado: number) {
    let item =
      this.pgeneralService.combosConfiguracionPlantilla.subEstadoMatricula.find(
        (x) => x.id == idSubEstado
      );
    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }
  /**
   * Obtiene el nombre de la modalidad por el id
   * @param idModalidad
   * @returns {string} Nombre de la modalidad
   */
  obtenerNombreModalidad(idModalidad: number): string {
    let item = this.comboModalidades.find((x) => x.id == idModalidad);
    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }
  /**
   * Obtiene el nombre de la modalidad por el id
   * @param idModalidad
   * @returns {string} Nombre de la modalidad
   */
  obtenerNombreOperadorComparacion(idOperador: number): string {
    let item = this.comboOperadorComparacion.find((x) => x.id == idOperador);
    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }
  private configurarGrid() {
    this.gridPlantillasAsociadasCertificado.removeEvent$.subscribe((resp) => {
      this._alertaService
        .swalFireOptions({
          title: '¿Está seguro de eliminar la plantilla asociada?',
          icon: 'warning',
          // confirmButtonColor: '#4C5FC0',
          showCancelButton: true,
          // cancelButtonColor: '#d33',
          confirmButtonText: 'Aceptar',
          cancelButtonText: 'Cancelar',
          allowOutsideClick: false,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.gridPlantillasAsociadasCertificado.data.splice(resp.index, 1);
            this.gridPlantillasAsociadasCertificado.data = [
              ...this.gridPlantillasAsociadasCertificado.data,
            ];
          }
        });
    });

    this.gridCriterioConstancia.formGroup = this._formBuilder.group({
      estadosMatricula: null,
      subEstadosMatricula: null,
      idOperadorComparacion: null,
      notaAprobatoria: null,
      deudaPendiente: null,
    });
    this.gridCriterioConstancia.cellClickEvent$.subscribe((resp) => {
      if (resp.column.field == 'subEstadosMatricula') {
        this.onValueChangeEstadoMatricula(resp.dataItem.estadosMatricula);
      }
    });
    this.gridCriterioConstancia.cellCloseEvent$.subscribe((resp) => {
      switch (resp.columnField) {
        case 'estadosMatricula':
          resp.dataItem.estadosMatricula = resp.formGroupValue.estadosMatricula;
          this.onValueChangeEstadoMatricula(resp.dataItem.estadosMatricula, resp.dataItem);
          break;
        case 'subEstadosMatricula':
          resp.dataItem.subEstadosMatricula =
            resp.formGroupValue.subEstadosMatricula;
          break;
        case 'idOperadorComparacion':
          resp.dataItem.idOperadorComparacion =
            resp.formGroupValue.idOperadorComparacion;
          break;
        case 'notaAprobatoria':
          resp.dataItem.notaAprobatoria =
            resp.formGroupValue.notaAprobatoria;
          break;
        case 'deudaPendiente':
          resp.dataItem.deudaPendiente =
            resp.formGroupValue.deudaPendiente;
          break;
      }
    });
  }
  /**
   * Carga los subestados de acuerdo al idestado
   * @param {number[]} idsEstado Array de numeros
   * @param {ConfiguracionPlantillaDetalle} dataItem Objeto de tipo ConfiguracionPlantillaDetalle
   */
  onValueChangeEstadoMatricula(
    idsEstado: number[],
    dataItem?: ConfiguracionPlantillaDetalle
  ) {
    if (idsEstado != null && idsEstado.length > 0) {
      this.comboSubEstados =
        this.pgeneralService.combosConfiguracionPlantilla.subEstadoMatricula.filter(
          (x) => idsEstado.includes(x.idEstadoMatricula)
        );
      if (dataItem != null) {
        dataItem.subEstadosMatricula = dataItem.subEstadosMatricula.filter(
          (x) => this.comboSubEstados.map((s) => s.id).includes(x)
        );
      }
    } else {
      this.comboSubEstados = [];
      if (dataItem != null) {
        dataItem.subEstadosMatricula = [];
      }
    }
  }
}

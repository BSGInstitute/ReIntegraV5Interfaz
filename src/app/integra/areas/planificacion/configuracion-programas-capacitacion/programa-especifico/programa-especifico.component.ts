import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  constApiComercial,
  constApiPlanificacion,
} from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  CentroCostoGenerado,
  CentroCostoP,
  CombosModulo,
  ConfigurarWebinar,
  CronogramaGrupo,
  InformacionPespecificoHijo,
  LocacionTroncal,
  PEspecificoPadreIndividual,
  ProgramaEspecifico,
  ProgramaEspecificoFUR,
  ProgramaGeneralP,
  SubAreaCapacitacion,
} from '@planificacion/models/interfaces/pespecifico';
import { PespecificoService } from '@planificacion/services/pespecifico.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { ModalContentCreacionPespecificoComponent } from './modal-content-creacion-pespecifico/modal-content-creacion-pespecifico.component';
import { ModalContentSubPespecificoComponent } from './modal-content-sub-pespecifico/modal-content-sub-pespecifico.component';
import { ModalContentCronogramaComponent } from './modal-content-cronograma/modal-content-cronograma.component';
import { ModalContentFrecuenciaComponent } from './modal-content-frecuencia/modal-content-frecuencia.component';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { environment } from '@environments/environment';
interface FormFiltro {
  idsAreas: number[];
  idsSubAreas: number[];
  idsProgramasGenerales: number[];
  idsProgramasEspecifico: number[];
  idsCentrosCosto: number[];
  idsEstadosPEspecifico: number[];
  idsCiudades: number[];
  idsModalidades: number[];
}
interface FormGeneracionAutomatica {
  idProgramaGeneral: number;
  modalidad: IComboBase1;
  locacionTroncal: LocacionTroncal;
  anio: number;
}
interface EnvioGeneracionAutomatica {
  idProgramaGeneral: number;
  modalidad: string;
  idCiudad: number;
  nombreCiudad: string;
  anio: number;
}
interface FiltroEnvioPespecifico {
  idProgramaEspecifico: string;
  idCentroCosto: string;
  codigoBs: string;
  idEstadoPEspecifico: string;
  idModalidadCurso: string;
  idPGeneral: string;
  idArea: string;
  idSubArea: string;
  idCentroCostoD?: number;
}

/**
 * @module PlanificacionModule
 * @description Componente de Programas especificos
 * @author Flavio R. Mamani Fabian
 * @version 1.2.0
 * @history
 * * 23/05/2023 Implementacion de grilla y formulario filtro
 * * 03/06/2023 Creacion de modales
 **/
@Component({
  providers: [PespecificoService],
  selector: 'app-programa-especifico',
  templateUrl: './programa-especifico.component.html',
  styleUrls: ['./programa-especifico.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgramaEspecificoComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _pEspecificoService: PespecificoService,
    private _alertaService: AlertaService
  ) {
    this.allData = this.allData.bind(this);
  }

  @ViewChild('modalGeneracionAutomatica') modalGeneracionAutomatica: any;

  private _subscriptions$: Subscription = new Subscription();
  formFiltro: FormGroup = this._formBuilder.group({
    idsAreas: [[]],
    idsSubAreas: [{ value: [], disabled: true }],
    idsProgramasGenerales: [{ value: [], disabled: true }],
    idsProgramasEspecifico: [{ value: [], disabled: true }],
    idsCentrosCosto: [{ value: [], disabled: true }],
    idsEstadosPEspecifico: [[]],
    idsCiudades: [[]],
    idsModalidades: [[]],
  });
  formGeneracionAutomatica: FormGroup = this._formBuilder.group({
    idProgramaGeneral: [null, Validators.required],
    modalidad: [null, Validators.required],
    locacionTroncal: [null, Validators.required],
    anio: [null, Validators.required],
  });
  centroCostoAutocomplete = new FormControl();
  gridProgramaEspecifico = new KendoGrid();
  dataItemPespecificoTemp: PEspecificoPadreIndividual;
  // Insertar Sesion
  loadingModalGeneracionAutomatica: boolean = false;
  modalRefGeneracionAutomatica: NgbModalRef;
  disablebBtnpPespecifico: boolean = false;
  loadingCcAutocomplete = false;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  combosModulo: CombosModulo;
  dataCentroCostoAutocomplete: IComboBase1[] = [];
  subAreasCapacitacion: SubAreaCapacitacion[] = [];
  programasGeneralP: ProgramaGeneralP[] = [];
  programasEspecifico: ProgramaEspecifico[] = [];
  centrosCostoP: CentroCostoP[] = [];
  ngOnInit(): void {
    this.initSubscribeObservables();
    this.configurarGridProgramaEspecifico();
    this._pEspecificoService.ready();
    this.obtenerPespecificos();
  }
  ngOnDestroy(): void {}
  initSubscribeObservables() {
    this._pEspecificoService.reloadPespecifico2$.subscribe((resp) => {
      this.obtenerPespecificos();
    });
    this._pEspecificoService.combosModulo$.subscribe((resp) => {
      this.combosModulo = resp;
    });
  }
  allData(): ExcelExportData {
    const result: ExcelExportData = {
      data: this.gridProgramaEspecifico.data,
    };
    return result;
  }
  /**
   * @description Retorna los valores del formulario filtro pespecifico
   * @return {FormFiltro} FormFiltro
   */
  private get dataFormFiltro(): FormFiltro {
    return this.formFiltro.getRawValue() as FormFiltro;
  }
  /**
   * @description Configura la grilla principal de programas especificos
   */
  private configurarGridProgramaEspecifico() {
    this.gridProgramaEspecifico.formGroup = this._formBuilder.group({
      estadoPespecifico: null,
    });
    this.gridProgramaEspecifico.readOnlyColumns = [
      'nombre',
      'tipo',
      'ciudad',
      'tipoSesion',
      'tipoProgramaGeneral',
    ];
    this.gridProgramaEspecifico.cellClickEvent$.subscribe({
      next: (resp) => {
        let dataItem = resp.dataItem as PEspecificoPadreIndividual;
        this.gridProgramaEspecifico.formGroup
          .get('estadoPespecifico')
          .setValue(
            this.combosModulo.estadoPEspecifico.find(
              (x) => x.id == dataItem.estadoPId
            )
          );
      },
    });
    this.gridProgramaEspecifico.cellCloseEvent$.subscribe({
      next: (resp) => {
        this.actualizarEstadoPrograma(
          resp.dataItem,
          resp.formGroupValue.estadoPespecifico
        );
      },
    });
  }
  procesarFiltro() {
    let filtro: FiltroEnvioPespecifico = {
      idProgramaEspecifico: null,
      idCentroCosto: null,
      codigoBs: null,
      idEstadoPEspecifico: null,
      idModalidadCurso: null,
      idPGeneral: null,
      idArea: null,
      idSubArea: null,
      idCentroCostoD: 0,
    };
    if (
      this.dataFormFiltro.idsProgramasEspecifico != null &&
      this.dataFormFiltro.idsProgramasEspecifico.length > 0
    ) {
      filtro.idProgramaEspecifico =
        this.dataFormFiltro.idsProgramasEspecifico.join(',');
    }
    if (
      this.dataFormFiltro.idsCentrosCosto != null &&
      this.dataFormFiltro.idsCentrosCosto.length > 0
    ) {
      filtro.idCentroCosto = this.dataFormFiltro.idsCentrosCosto.join(',');
    }
    if (
      this.dataFormFiltro.idsCiudades != null &&
      this.dataFormFiltro.idsCiudades.length > 0
    ) {
      filtro.codigoBs = this.dataFormFiltro.idsCiudades.join(',');
    }
    if (
      this.dataFormFiltro.idsEstadosPEspecifico != null &&
      this.dataFormFiltro.idsEstadosPEspecifico.length > 0
    ) {
      filtro.idEstadoPEspecifico =
        this.dataFormFiltro.idsEstadosPEspecifico.join(',');
    }
    if (
      this.dataFormFiltro.idsModalidades != null &&
      this.dataFormFiltro.idsModalidades.length > 0
    ) {
      filtro.idModalidadCurso = this.dataFormFiltro.idsModalidades.join(',');
    }
    if (
      this.dataFormFiltro.idsProgramasGenerales != null &&
      this.dataFormFiltro.idsProgramasGenerales.length > 0
    ) {
      filtro.idPGeneral = this.dataFormFiltro.idsProgramasGenerales.join(',');
    }
    if (
      this.dataFormFiltro.idsAreas != null &&
      this.dataFormFiltro.idsAreas.length > 0
    ) {
      filtro.idArea = this.dataFormFiltro.idsAreas.join(',');
    }
    if (
      this.dataFormFiltro.idsSubAreas != null &&
      this.dataFormFiltro.idsSubAreas.length > 0
    ) {
      filtro.idSubArea = this.dataFormFiltro.idsSubAreas.join(',');
    }
    if(this.centroCostoAutocomplete.value != null){
      filtro.idCentroCostoD = this.centroCostoAutocomplete.value as number
    }else{
      filtro.idCentroCostoD = 0;
    }
    return filtro;
  }
  obtenerPespecificos() {
    let filtro = this.procesarFiltro();
    this.gridProgramaEspecifico.loading = true;
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.PEspecificoObtenerProgramaEspecificoPadreIndividual,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<PEspecificoPadreIndividual[]>) => {
          this.gridProgramaEspecifico.data = resp.body;
          this.gridProgramaEspecifico.loading = false;
        },
        error: (error) => {
          this.gridProgramaEspecifico.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  generarReporteAmbienteExcel() {
    let filtro = this.procesarFiltro();
    let api = constApiPlanificacion.PEspecificoGenerarReporteAmbienteExcel;
    try {
      let urlFinal = `${environment.urlServicioAPI}${api}?idProgramaEspecifico=${filtro.idProgramaEspecifico}&idCentroCosto=${filtro.idCentroCosto}&CodigoBs=${filtro.codigoBs}&idEstadoPEspecifico=${filtro.idEstadoPEspecifico}&idModalidadCurso=${filtro.idModalidadCurso}&idPGeneral=${filtro.idPGeneral}&idArea=${filtro.idArea}&idSubArea=${filtro.idSubArea}&idCentroCostoD=${filtro.idCentroCostoD}`;
      window.open(urlFinal, '_blank');
    }
    catch {
        alert("Seleccione algun Filtro por Favor");
    }
    // this._integraService
    //   .postFileResponse(
    //     constApiPlanificacion.PEspecificoGenerarReporteAmbienteExcel,
    //     JSON.stringify(filtro)
    //   )
    //   .subscribe({
    //     next: (resp) => {
    //       console.log(resp);
    //     },
    //     error: (error) => {
    //       let mensaje = this._alertaService.getMessageErrorService(error);
    //       this._alertaService.notificationWarning(mensaje);
    //     },
    //   });
  }
  actualizarEstadoPrograma(
    dataItem: PEspecificoPadreIndividual,
    estadoPespecifo: IComboBase1
  ) {
    const idPespecifico = dataItem.id;
    const idEstadoPrograma = estadoPespecifo.id;
    if (dataItem.estadoPId != estadoPespecifo.id) {
      this.gridProgramaEspecifico.loading = true;
      this._integraService
        .putJsonResponse(
          `${constApiPlanificacion.PEspecificoActualizarEstadoPrograma}/${idPespecifico}/${idEstadoPrograma}`,
          null
        )
        .subscribe({
          next: (
            resp: HttpResponse<{
              estado: boolean;
              idProgramaEspecifico: number;
            }>
          ) => {
            console.log(resp.body);
            this.gridProgramaEspecifico.loading = false;
            if (resp.body.estado) {
              dataItem.estadoPId = estadoPespecifo.id;
              dataItem.estadoP = estadoPespecifo.nombre;
              this._alertaService.mensajeExitoso('Estado Actualizado');
            }
          },
          error: (error) => {
            this.gridProgramaEspecifico.loading = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.gridProgramaEspecifico.loading = false;
    }
  }
  existeSesionesPorIdPEspecifico(dataItem: PEspecificoPadreIndividual) {
    this._pEspecificoService.dataItemPespecificoTemp = dataItem;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.PEspecificoValidarPespecificoTieneSesiones}/${dataItem.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          const modalRef = this._modalService.open(
            ModalContentCreacionPespecificoComponent,
            {
              size: 'xl',
              backdrop: 'static',
              keyboard: false
            }
          );
          modalRef.componentInstance.pEspecificoService =
            this._pEspecificoService;
          modalRef.componentInstance.isNewPespecifico = false;
          modalRef.componentInstance.tieneSesiones = resp.body;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  crearPespecifico() {
    this.disablebBtnpPespecifico = true;
    this._alertaService
      .swalFireOptions({
        title: '¿Desea crear el Programa Especifico Automaticamente?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si',
        cancelButtonText: 'No',
        allowOutsideClick: false,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.formGeneracionAutomatica.reset();
          this.modalRefGeneracionAutomatica = this._modalService.open(
            this.modalGeneracionAutomatica,
            { size: 'md', backdrop: 'static' }
          );
          this.disablebBtnpPespecifico = false;
        } else {
          const modalRef = this._modalService.open(
            ModalContentCreacionPespecificoComponent,
            {
              size: 'lg',
              backdrop: 'static',
            }
          );
          modalRef.componentInstance.pEspecificoService =
            this._pEspecificoService;
          modalRef.componentInstance.isNewPespecifico = true;
          this.disablebBtnpPespecifico = false;
        }
      });
  }
  generarPespecificoAutomatico() {
    if (this.formGeneracionAutomatica.valid) {
      let datosForm =
        this.formGeneracionAutomatica.getRawValue() as FormGeneracionAutomatica;
      this.loadingModalGeneracionAutomatica = true;
      this.formGeneracionAutomatica.disable();
      let locacionTroncal = datosForm.locacionTroncal;
      if (
        locacionTroncal.codigoBS == null &&
        locacionTroncal.denominacionBS == null
      ) {
        this._erroresPespecificoAutomatico['ciudad'] =
          'La ciudad debe tener un CodigoBS y una DenominacionBS obligatoriamente';
        this.formGeneracionAutomatica.enable();
        this.loadingModalGeneracionAutomatica = false;
        return;
      }
      let jsonEnvio: EnvioGeneracionAutomatica = {
        idProgramaGeneral: datosForm.idProgramaGeneral,
        modalidad: datosForm.modalidad.nombre,
        idCiudad: datosForm.locacionTroncal.idCiudad,
        nombreCiudad: datosForm.locacionTroncal.denominacionBS,
        anio: datosForm.anio,
      };
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.PEspecificoGenerarCentroCostoCodigoNombre,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<CentroCostoGenerado>) => {
            this.formGeneracionAutomatica.enable();
            this.loadingModalGeneracionAutomatica = false;
            this.modalRefGeneracionAutomatica.close();
            if (resp.body != null) {
              const modalRef = this._modalService.open(
                ModalContentCreacionPespecificoComponent,
                {
                  size: 'xl',
                  backdrop: 'static',
                }
              );
              modalRef.componentInstance.pEspecificoService =
                this._pEspecificoService;
              modalRef.componentInstance.isNewPespecifico = true;
              modalRef.componentInstance.esProgramaEspecificoAutomatico = true;
              modalRef.componentInstance.ciudadSeleccionada = datosForm.locacionTroncal;
              modalRef.componentInstance.datosFormGeneracionAutomatica =
                datosForm;
              modalRef.componentInstance.centroCostoGenerado = resp.body;
              modalRef.componentInstance.limiteGruposAlcanzado = resp.body.haAlcanzadoLimiteGrupos;

            }
          },
          error: (error) => {
            this.formGeneracionAutomatica.enable();
            this.loadingModalGeneracionAutomatica = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.swalFireOptions({
              icon: error,
              title: 'Ocurrio un problema el procesar los datos',
              text: mensaje,
            });
          },
        });
    } else {
      this.formGeneracionAutomatica.markAllAsTouched();
    }
  }
  private _erroresPespecificoAutomatico: { [key: string]: string } = {};
  get erroresPespecificoAutomatico() {
    let errores: string[] = [];
    for (const key in this._erroresPespecificoAutomatico) {
      if (
        Object.prototype.hasOwnProperty.call(
          this._erroresPespecificoAutomatico,
          key
        )
      ) {
        const element = this._erroresPespecificoAutomatico[key];
        errores.push(element);
      }
    }
    return errores;
  }
  validarCiudadLocacionTroncal(locacionTroncal: LocacionTroncal) {
    if (
      locacionTroncal.codigoBS == null &&
      locacionTroncal.denominacionBS == null
    ) {
      this._erroresPespecificoAutomatico['ciudad'] =
        'La ciudad debe tener un CodigoBS y una DenominacionBS obligatoriamente';
    } else {
      delete this._erroresPespecificoAutomatico['ciudad'];
    }
  }
  cargarSubAreas(idsArea: number[]) {
    if (idsArea.length > 0) {
      this.subAreasCapacitacion = this.combosModulo.subAreaCapacitacion.filter(
        (x) => idsArea.includes(x.idAreaCapacitacion)
      );
      let filtro = this.dataFormFiltro.idsSubAreas.filter((x) =>
        this.subAreasCapacitacion.map((s) => s.id).includes(x)
      );
      this.formFiltro.get('idsSubAreas').enable();
      this.formFiltro.get('idsSubAreas').setValue(filtro);
      this.cargarPGenerales(filtro);
    } else {
      this.subAreasCapacitacion = [];
      this.formFiltro.get('idsSubAreas').disable();
      this.formFiltro.get('idsSubAreas').setValue([]);
      this.cargarPGenerales([]);
    }
  }
  cargarPGenerales(idsSubAreas: number[]) {
    if (idsSubAreas.length > 0) {
      this.programasGeneralP = this.combosModulo.programaGeneralP.filter((x) =>
        idsSubAreas.includes(x.idSubArea)
      );
      let filtro = this.dataFormFiltro.idsProgramasGenerales.filter((e) =>
        this.programasGeneralP.map((x) => x.id).includes(e)
      );
      this.formFiltro.get('idsProgramasGenerales').enable();
      this.formFiltro.get('idsProgramasGenerales').setValue(filtro);
      this.cargarPEspecificos(filtro);
    } else {
      this.programasGeneralP = [];
      this.formFiltro.get('idsProgramasGenerales').setValue([]);
      this.formFiltro.get('idsProgramasGenerales').disable();
      this.cargarPEspecificos([]);
    }
  }
  cargarPEspecificos(idsPgeneral: number[]) {
    if (idsPgeneral.length > 0) {
      this.programasEspecifico = this.combosModulo.programaEspecifico.filter(
        (x) => idsPgeneral.includes(x.idProgramaGeneral)
      );
      let filtro = this.dataFormFiltro.idsProgramasEspecifico.filter((e) =>
        this.programasEspecifico.map((x) => x.id).includes(e)
      );
      this.formFiltro.get('idsProgramasEspecifico').setValue(filtro);
      this.formFiltro.get('idsProgramasEspecifico').enable();
      this.cargarCentrosCosto(filtro);
    } else {
      this.programasEspecifico = [];
      this.formFiltro.get('idsProgramasEspecifico').setValue([]);
      this.formFiltro.get('idsProgramasEspecifico').disable();
      this.cargarCentrosCosto([]);
    }
  }
  cargarCentrosCosto(idsPespecificos: number[]) {
    if (idsPespecificos.length > 0) {
      this.centrosCostoP = this.combosModulo.centroCostoP.filter((x) =>
        idsPespecificos.includes(x.idPEspecifico)
      );
      let filtro = this.dataFormFiltro.idsCentrosCosto.filter((e) =>
        this.centrosCostoP.map((x) => x.id).includes(e)
      );
      this.formFiltro.get('idsCentrosCosto').setValue(filtro);
      this.formFiltro.get('idsCentrosCosto').enable();
    } else {
      this.centrosCostoP = [];
      this.formFiltro.get('idsCentrosCosto').setValue([]);
      this.formFiltro.get('idsCentrosCosto').disable();
    }
  }
  filtrarCentroCosto(event: string) {
    console.log(event);
    if (event.length >= 4) {
      this.loadingCcAutocomplete = true;
      this._integraService
        .postJsonResponse(
          `${constApiComercial.CentroCostoObtenerAutocompleteV2}`,
          JSON.stringify({ valor: event })
        )
        .subscribe({
          next: (response: HttpResponse<IComboBase1[]>) => {
            this.dataCentroCostoAutocomplete = response.body;
            this.loadingCcAutocomplete = false;
          },
          error: (error) => {
            this.loadingCcAutocomplete = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.dataCentroCostoAutocomplete = [];
    }
  }
  private validarModalidad() {
    if (
      this.dataItemPespecificoTemp.tipoProgramaGeneral == 'Webinar Recurrente'
    ) {
      this._pEspecificoService.aplicarConfigurarWebinar = true;
      this._pEspecificoService.esWebinarRecurrente = true;
    } else {
      this._pEspecificoService.esWebinarRecurrente = false;
      this._pEspecificoService.aplicarConfigurarWebinar = false;
    }
  }
  /**
   * Configuracion programa especifico
   * @param {PEspecificoPadreIndividual} dataItem
   */
  verConfiguracionPespecifico(dataItem: PEspecificoPadreIndividual) {
    this.gridProgramaEspecifico.loading = true;
    this.dataItemPespecificoTemp = dataItem;
    this._pEspecificoService.dataItemPespecificoTemp = dataItem;
    this.validarModalidad();
    this._pEspecificoService.esIndividual = false;
    if (dataItem.cursoIndividual == true) {
      this.ModuloSesionesCursoIndicidual();
    } else {
      this.abrirModalSubPespecifico();
    }
  }
  private abrirModalSubPespecifico() {
    let observable1$ = this._integraService.getJsonResponse(
      `${constApiPlanificacion.PEspecificoVerificarFrecuenciaPorIdPespecifico}/${this.dataItemPespecificoTemp.id}`
    ) as Observable<HttpResponse<boolean>>;
    let observable2$ =
      this._pEspecificoService.obtenerTodoPespecificosRelacionados$(
        this.dataItemPespecificoTemp.id
      );
    const combined$ = forkJoin([observable1$, observable2$]);
    combined$.subscribe({
      next: (
        resp: [
          HttpResponse<boolean>,
          HttpResponse<InformacionPespecificoHijo[]>
        ]
      ) => {
        if (resp[1].body != null) {
          this.gridProgramaEspecifico.loading = false;
          const modalRef = this._modalService.open(
            ModalContentSubPespecificoComponent,
            {
              size: 'xxl',
              backdrop: 'static',
              keyboard: false
            }
          );
          this._pEspecificoService.tieneFrecuencia = resp[0].body;
          modalRef.componentInstance.pEspecificoService =
            this._pEspecificoService;
          modalRef.componentInstance.dataGridSupGeneral = resp[1].body;
        }
      },
      error: (error) => {
        this.gridProgramaEspecifico.loading = false;
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationError(mensaje);
      },
    });
  }
  ModuloSesionesCursoIndicidual() {
    this._pEspecificoService.tieneFrecuencia = false;
    let observable1$ =
      this._pEspecificoService.verificarFrecuenciaPorIdPespecifico$();
    let observable2$ =
      this._pEspecificoService.verificarSiTienePadrePEspecifico$();
    const combined$ = forkJoin([observable1$, observable2$]);
    combined$.subscribe({
      next: (
        resp: [
          HttpResponse<boolean>,
          HttpResponse<{
            estado: boolean;
            nombre: string;
          }>
        ]
      ) => {
        this.gridProgramaEspecifico.loading = false;
        this._pEspecificoService.tieneFrecuencia = resp[0].body;
        let tienePadre = resp[1].body.estado;
        if (tienePadre == true) {
          this._alertaService.swalFireOptions({
            icon: 'info',
            title: '¡Error al Puntos de corte',
            html: `Este Curso esta asociado a otro Programa Especifico para poder ver su cronograma busque el Programa Especifico:<br><strong>${resp[1].body.estado}</strong>`,
          });
        } else if (this._pEspecificoService.tieneFrecuencia) {
          this._pEspecificoService.esIndividual = true;
          this.abrirModalCronograma();
        } else {
          this._pEspecificoService.esIndividual = false;
          const modalRef = this._modalService.open(
            ModalContentFrecuenciaComponent,
            {
              backdrop: 'static',
              size: 'xl',
              keyboard: false,
            }
          );
          modalRef.componentInstance.pEspecificoService =
            this._pEspecificoService;
          modalRef.componentInstance.isNew = true;
        }
      },
      error: (error) => {
        this.gridProgramaEspecifico.loading = false;
        this._pEspecificoService.esIndividual = false;
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationError(mensaje);
      },
    });
  }
  
  private abrirModalCronograma() {
    let observable1$ = this._pEspecificoService.obtenerCronogramaPEspecifico$(
      [],
      this.dataItemPespecificoTemp.id,
      this._pEspecificoService.esIndividual
    );
    let observable2$ = this._pEspecificoService.obtenerConfiguracionWebinar$(
      this.dataItemPespecificoTemp.id
    );
    let observable3$ = this._pEspecificoService.obtenerFurProgramaEspecifico$();
    const combined$ = forkJoin([observable1$, observable2$, observable3$]);
    combined$.subscribe({
      next: (
        resp: [
          HttpResponse<CronogramaGrupo[]>,
          HttpResponse<ConfigurarWebinar[]>,
          HttpResponse<ProgramaEspecificoFUR[]>
        ]
      ) => {
        const modalRef = this._modalService.open(
          ModalContentCronogramaComponent,
          {
            size: 'xxl',
            backdrop: 'static',
            keyboard: false,
          }
        );
        modalRef.componentInstance.pEspecificoService =
          this._pEspecificoService;
        modalRef.componentInstance.dataItemPespecificoTemp =
          this.dataItemPespecificoTemp;
        modalRef.componentInstance.pEspecificoHijos = [];
        modalRef.componentInstance.idsPespecificoSeleccionado = [];
        modalRef.componentInstance.cronogramaGrupo = resp[0].body;
        modalRef.componentInstance.configuracionWebinar = resp[1].body;
        modalRef.componentInstance.programaEspecificoFUR = resp[2].body;
      },
      error: (error) => {
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationWarning(mensaje);
      },
    });
  }
  // obtenerOperadorComparacionAvance(idOperadoAvance: number) {
  //   if (
  //     idOperadoAvance != null &&
  //     idOperadoAvance != 0 &&
  //     idOperadoAvance != -1
  //   ) {
  //     let item = this.sourceOperadorWebinar.find(
  //       (x) => x.id == idOperadoAvance
  //     );
  //     if (item != null) {
  //       return item.nombre;
  //     }
  //   }
  //   return null;
  // }
}

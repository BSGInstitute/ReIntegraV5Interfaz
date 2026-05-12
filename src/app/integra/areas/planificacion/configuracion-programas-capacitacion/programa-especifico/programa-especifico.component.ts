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
import { Observable, Subscription, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
interface FeriadoDTO {
  id: number;
  tipo: number;
  dia: string;
  motivo: string;
  frecuencia: number;
  idTroncalCiudad: number;
}
interface ComboCiudadDTO {
  id: number;
  nombre: string;
  idTroncalPais: number;
}
export interface FeriadoConPaisDTO {
  id: number;
  tipo: number;
  dia: string; // yyyy-MM-dd
  motivo: string;
  frecuencia: number; // 0 = Anual, 1 = Único
  idTroncalCiudad: number;
  idTroncalPais: number;
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
  @ViewChild('modalFeriados') modalFeriados: any;
  @ViewChild('modalFeriadoEdit') modalFeriadoEdit: any;

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

  // Feriados (CRUD)
  gridFeriados = new KendoGrid();
  modalRefFeriados: NgbModalRef;
  modalRefFeriadoEdit: NgbModalRef;
  loadingModalFeriados: boolean = false;
  comboPaisesFeriado: IComboBase1[] = [];
  comboCiudadesFeriadoTodas: ComboCiudadDTO[] = [];
  comboCiudadesFeriado: ComboCiudadDTO[] = [];
  esNuevoFeriado: boolean = false;
  comboFrecuenciaFeriado: IComboBase1[] = [
    { id: 0, nombre: 'Anual' },
    { id: 1, nombre: 'Único' },
  ];
  formFeriado: FormGroup = this._formBuilder.group({
    id: [0],
    dia: [null, Validators.required],
    motivo: [null, Validators.required],
    frecuencia: [0, Validators.required],
    idTroncalPais: [null, Validators.required],
    idTroncalCiudad: [{ value: null, disabled: true }, Validators.required],
  });

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
          `${constApiComercial.CentroCostoObtenerAutocompleteV3}`,
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
    console.log('[Feriados] verConfiguracionPespecifico iniciado', {
      idPespecifico: dataItem.id,
      cursoIndividual: dataItem.cursoIndividual,
    });
    if (dataItem.cursoIndividual == true) {
      console.log('[Feriados] cursoIndividual = true -> ModuloSesionesCursoIndicidual');
      this.ModuloSesionesCursoIndicidual();
    } else {
      console.warn('[Feriados] cursoIndividual = false -> NO se llamara a Feriado/ListarPorPaises (se abre modal sub-pespecifico)');
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
        console.log('[Feriados] ModuloSesionesCursoIndicidual checks', {
          tieneFrecuencia: this._pEspecificoService.tieneFrecuencia,
          tienePadre,
        });
        if (tienePadre == true) {
          console.warn('[Feriados] tienePadre = true -> NO se llamara a Feriado/ListarPorPaises (programa asociado a otro pespecifico)');
          this._alertaService.swalFireOptions({
            icon: 'info',
            title: '¡Error al Puntos de corte',
            html: `Este Curso esta asociado a otro Programa Especifico para poder ver su cronograma busque el Programa Especifico:<br><strong>${resp[1].body.estado}</strong>`,
          });
        } else if (this._pEspecificoService.tieneFrecuencia) {
          console.log('[Feriados] tieneFrecuencia = true y sin padre -> abrirModalCronograma');
          this._pEspecificoService.esIndividual = true;
          this.abrirModalCronograma();
        } else {
          console.warn('[Feriados] tieneFrecuencia = false -> NO se llamara a Feriado/ListarPorPaises (abre modal frecuencia)');
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
    const idPe = this.dataItemPespecificoTemp.id;
    console.log('[Feriados] abrirModalCronograma - solicitando idsTroncalPaisFeriado', { idPe });
    let observable1$ = this._pEspecificoService.obtenerCronogramaPEspecifico$(
      [],
      idPe,
      this._pEspecificoService.esIndividual
    );
    let observable2$ = this._pEspecificoService.obtenerConfiguracionWebinar$(
      idPe
    );
    let observable3$ = this._pEspecificoService.obtenerFurProgramaEspecifico$();
    let observable4$ = this._integraService.getJsonResponse(
      `${constApiPlanificacion.PEspecificoObtenerIdsTroncalPaisFeriado}/${idPe}`
    ) as Observable<HttpResponse<number[]>>;

    forkJoin([observable1$, observable2$, observable3$, observable4$])
      .pipe(
        switchMap(
          (resp: [
            HttpResponse<CronogramaGrupo[]>,
            HttpResponse<ConfigurarWebinar[]>,
            HttpResponse<ProgramaEspecificoFUR[]>,
            HttpResponse<number[]>
          ]) => {
            const idsPaises = resp[3].body ?? [];
            console.log('[Feriados] idsTroncalPaisFeriado recibidos', {
              idPe,
              cantidad: idsPaises.length,
              idsPaises,
            });
            let feriados$: Observable<HttpResponse<FeriadoConPaisDTO[]>>;
            if (idsPaises.length > 0) {
              const url = `${constApiPlanificacion.FeriadoListarPorPaises}?${idsPaises
                .map((id) => `idsTroncalPais=${id}`)
                .join('&')}`;
              console.log('[Feriados] SE LLAMARA a Feriado/ListarPorPaises', { url });
              feriados$ = this._integraService.getJsonResponse(
                url
              ) as Observable<HttpResponse<FeriadoConPaisDTO[]>>;
            } else {
              console.warn('[Feriados] idsPaises vacio -> NO se llamara a Feriado/ListarPorPaises (programa sin paises de feriado configurados)');
              feriados$ = of({ body: [] } as HttpResponse<FeriadoConPaisDTO[]>);
            }
            return forkJoin([
              of(resp[0]),
              of(resp[1]),
              of(resp[2]),
              feriados$,
            ]);
          }
        )
      )
      .subscribe({
        next: (resp: [
          HttpResponse<CronogramaGrupo[]>,
          HttpResponse<ConfigurarWebinar[]>,
          HttpResponse<ProgramaEspecificoFUR[]>,
          HttpResponse<FeriadoConPaisDTO[]>
        ]) => {
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
          const feriadosBody = resp[3].body ?? [];
          console.log('[Feriados] feriados cargados al modal cronograma', {
            cantidad: feriadosBody.length,
          });
          modalRef.componentInstance.feriados = feriadosBody;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  // #region FechasFeriadas (CRUD)
  abrirModalFeriados() {
    this.modalRefFeriados = this._modalService.open(this.modalFeriados, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
    this.cargarCombosFeriadoYListar();
  }
  private cargarCombosFeriadoYListar() {
    const yaCacheado =
      this.comboPaisesFeriado.length > 0 &&
      this.comboCiudadesFeriadoTodas.length > 0;
    if (yaCacheado) {
      this.obtenerFeriados();
      return;
    }
    this.gridFeriados.loading = true;
    forkJoin([
      this._integraService.getJsonResponse(
        constApiPlanificacion.FeriadoComboTroncalPais
      ),
      this._integraService.getJsonResponse(
        constApiPlanificacion.FeriadoComboTroncalCiudad
      ),
    ]).subscribe({
      next: (
        resp: [HttpResponse<IComboBase1[]>, HttpResponse<ComboCiudadDTO[]>]
      ) => {
        this.comboPaisesFeriado = resp[0].body ?? [];
        this.comboCiudadesFeriadoTodas = resp[1].body ?? [];
        this.obtenerFeriados();
      },
      error: (error) => {
        this.gridFeriados.loading = false;
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationWarning(mensaje);
      },
    });
  }
  obtenerFeriados() {
    this.gridFeriados.loading = true;
    this._integraService
      .getJsonResponse(constApiPlanificacion.FeriadoListar)
      .subscribe({
        next: (resp: HttpResponse<FeriadoDTO[]>) => {
          this.gridFeriados.data = (resp.body ?? []).map((f) => ({
            ...f,
            nombreCiudad:
              this.comboCiudadesFeriadoTodas.find(
                (c) => c.id == f.idTroncalCiudad
              )?.nombre ?? '',
            nombreFrecuencia:
              this.comboFrecuenciaFeriado.find((x) => x.id == f.frecuencia)
                ?.nombre ?? '',
          }));
          this.gridFeriados.loading = false;
        },
        error: (error) => {
          this.gridFeriados.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  onPaisFeriadoChange(idTroncalPais: number) {
    if (idTroncalPais == null) {
      this.comboCiudadesFeriado = [];
      this.formFeriado.get('idTroncalCiudad').setValue(null);
      this.formFeriado.get('idTroncalCiudad').disable();
      return;
    }
    this.comboCiudadesFeriado = this.comboCiudadesFeriadoTodas.filter(
      (c) => c.idTroncalPais === idTroncalPais
    );
    const ciudadActual = this.formFeriado.get('idTroncalCiudad').value;
    const ciudadValida = this.comboCiudadesFeriado.some(
      (c) => c.id === ciudadActual
    );
    if (!ciudadValida) {
      this.formFeriado.get('idTroncalCiudad').setValue(null);
    }
    this.formFeriado.get('idTroncalCiudad').enable();
  }
  nuevoFeriado() {
    this.esNuevoFeriado = true;
    this.comboCiudadesFeriado = [];
    this.formFeriado.reset({
      id: 0,
      dia: null,
      motivo: null,
      frecuencia: 0,
      idTroncalPais: null,
      idTroncalCiudad: null,
    });
    this.formFeriado.get('idTroncalCiudad').disable();
    this.modalRefFeriadoEdit = this._modalService.open(this.modalFeriadoEdit, {
      size: 'md',
      backdrop: 'static',
    });
  }
  editarFeriado(dataItem: any) {
    this.esNuevoFeriado = false;
    const ciudad = this.comboCiudadesFeriadoTodas.find(
      (c) => c.id === dataItem.idTroncalCiudad
    );
    const idPais = ciudad ? ciudad.idTroncalPais : null;
    this.comboCiudadesFeriado = idPais
      ? this.comboCiudadesFeriadoTodas.filter((c) => c.idTroncalPais === idPais)
      : [];
    this.formFeriado.setValue({
      id: dataItem.id,
      dia: dataItem.dia ? new Date(dataItem.dia) : null,
      motivo: dataItem.motivo,
      frecuencia: dataItem.frecuencia,
      idTroncalPais: idPais,
      idTroncalCiudad: dataItem.idTroncalCiudad,
    });
    if (idPais != null) {
      this.formFeriado.get('idTroncalCiudad').enable();
    } else {
      this.formFeriado.get('idTroncalCiudad').disable();
    }
    this.modalRefFeriadoEdit = this._modalService.open(this.modalFeriadoEdit, {
      size: 'md',
      backdrop: 'static',
    });
  }
  guardarFeriado() {
    if (this.formFeriado.invalid) {
      this.formFeriado.markAllAsTouched();
      return;
    }
    const raw = this.formFeriado.getRawValue();
    const fecha: Date = raw.dia;
    const yyyy = fecha.getFullYear();
    const mm = String(fecha.getMonth() + 1).padStart(2, '0');
    const dd = String(fecha.getDate()).padStart(2, '0');
    const body: FeriadoDTO = {
      id: raw.id ?? 0,
      tipo: 0,
      dia: `${yyyy}-${mm}-${dd}`,
      motivo: raw.motivo,
      frecuencia: raw.frecuencia,
      idTroncalCiudad: raw.idTroncalCiudad,
    };
    this.loadingModalFeriados = true;
    const obs$ = this.esNuevoFeriado
      ? this._integraService.postJsonResponse(
          constApiPlanificacion.FeriadoInsertar,
          JSON.stringify(body)
        )
      : this._integraService.putJsonResponse(
          constApiPlanificacion.FeriadoActualizar,
          JSON.stringify(body)
        );
    obs$.subscribe({
      next: (resp: HttpResponse<FeriadoDTO>) => {
        this.loadingModalFeriados = false;
        this.modalRefFeriadoEdit.close();
        this._alertaService.mensajeExitoso(
          this.esNuevoFeriado ? 'Feriado registrado' : 'Feriado actualizado'
        );
        this.obtenerFeriados();
      },
      error: (error) => {
        this.loadingModalFeriados = false;
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationWarning(mensaje);
      },
    });
  }
  eliminarFeriado(dataItem: FeriadoDTO) {
    this._alertaService
      .swalFireOptions({
        title: '¿Eliminar feriado?',
        text: `${dataItem.motivo}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      })
      .then((result) => {
        if (!result.isConfirmed) return;
        this.gridFeriados.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.FeriadoEliminar}/${dataItem.id}`
          )
          .subscribe({
            next: (resp: HttpResponse<boolean>) => {
              this.gridFeriados.loading = false;
              if (resp.body) {
                this._alertaService.mensajeExitoso('Feriado eliminado');
                this.obtenerFeriados();
              } else {
                this._alertaService.notificationWarning(
                  'No se pudo eliminar el feriado'
                );
              }
            },
            error: (error) => {
              this.gridFeriados.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      });
  }
  // #endregion FechasFeriadas

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

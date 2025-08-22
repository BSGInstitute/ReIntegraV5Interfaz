import { PespecificoService } from '@planificacion/services/pespecifico.service';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, RequiredValidator } from '@angular/forms';
import { constApiPlanificacion, constApiComercial } from '@environments/constApi';
import { environment } from '@environments/environment';
import { HttpResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentCreacionPespecificoComponent } from '@planificacion/configuracion-programas-capacitacion/programa-especifico/modal-content-creacion-pespecifico/modal-content-creacion-pespecifico.component';
import { ModalContentCronogramaComponent } from '@planificacion/configuracion-programas-capacitacion/programa-especifico/modal-content-cronograma/modal-content-cronograma.component';
import { ModalContentFrecuenciaComponent } from '@planificacion/configuracion-programas-capacitacion/programa-especifico/modal-content-frecuencia/modal-content-frecuencia.component';
import { ModalContentSubPespecificoComponent } from '@planificacion/configuracion-programas-capacitacion/programa-especifico/modal-content-sub-pespecifico/modal-content-sub-pespecifico.component';
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
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription, Observable, forkJoin } from 'rxjs';
import Swal from 'sweetalert2';
import { UserService } from '@shared/services/user.service';
import { RowArgs } from '@progress/kendo-angular-grid';
import { Parametro } from '@shared/models/parametro';
import { data } from 'jquery';


/**
 * @module PlanificacionModule
 * @description Componente de EncuestaProgramaOnline
 * @author Joseph Llanque
 * @version 1.0.0
 * @history
 * * 08/08/2024 Primera implementacion
 */


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
export interface IEncuestaPrograma {
  id : number,
  idPGeneral : number,
  idPEspecifico : number,
  idPEspecificoSesion : number,
  idEncuestaOnline : number,
  encuestaObligatoria: boolean,
  encuestaActiva : boolean,
  asignadoPara : string,
}

export interface IEncuestaProgramaEnvio {
  id : number,
  idPGeneral : number,
  idPEspecifico : number,
  idPEspecificoSesion : number,
  idEncuestaOnline : number,
  encuestaObligatoria: boolean,
  encuestaActiva : boolean,
  asignadoPara : boolean,
  usuario:string
}

export interface IEncuestaProgramaAsincronica {
  id : number,
  idPGeneral : number,
  idCapituloProgramaCapacitacion : number,
  ubicacionEncuesta : number,
  idExamen : number,
  encuestaObligatoria: boolean,
  encuestaActiva : boolean,
  idTipoPersona : string,
  
}

export interface IEncuestaProgramaAsincronicaEnvio {
  id : number,
  idPGeneral : number,
  idCapituloProgramaCapacitacion : number,
  ubicacionEncuesta : number,
  idExamen : number,
  encuestaObligatoria: boolean,
  encuestaActiva : boolean,
  idTipoPersona : number,
  usuario:string
}
@Component({
  providers: [PespecificoService],
  selector: 'app-encuesta-programa-online',
  templateUrl: './encuesta-programa-online.component.html',
  styleUrls: ['./encuesta-programa-online.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class EncuestaProgramaOnlineComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _pEspecificoService: PespecificoService,
    private _alertaService: AlertaService,
    private _userService: UserService
  ) {
    this.allData = this.allData.bind(this);
  }
  @Input() pEspecificoService: PespecificoService;
  @ViewChild('modalGeneracionAutomatica') modalGeneracionAutomatica: any;
  @ViewChild('modalPespecificoEncuesta') modalPespecificoEncuesta: any;
  @ViewChild('modalDetalleEncuestas') modalDetalleEncuestas: any;
  @ViewChild('modalDetalleEncuestasAsincronica') modalDetalleEncuestasAsincronica: any;

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
  formAsignarEncuesta: FormGroup = this._formBuilder.group({
    nombre:[],
    nombrePespecifico:[""],
    tipo:[""],
  });
  formEncuesta: FormGroup = this._formBuilder.group({
    idEncuestaOnline: [null, Validators.required],
    encuestaObligatoria:[],
    encuestaActiva:[],
    asignadoPara:['alumno'],
  });
  estados: { [key: number]: string } = {
    0: 'Cancelado',
    1: 'Concluido',
    2: 'Ejecución',
    3: 'Lanzamiento',
    4: 'Planificación',
    5: 'Por Ejecución'
  };
  modalidades: { [key: number]: string } = {
    0: 'Presencial',
    1: 'Online Asincrónica',
    2: 'Online Sincrónica'
  };
  formGeneracionAutomatica: FormGroup = this._formBuilder.group({
    idProgramaGeneral: [null, Validators.required],
    modalidad: [null, Validators.required],
    locacionTroncal: [null, Validators.required],
    anio: [null, Validators.required],
  });
  centroCostoAutocomplete = new FormControl();
  gridProgramaEspecifico = new KendoGrid();
  gridSesiones = new KendoGrid();
  dataItemPespecificoTemp: PEspecificoPadreIndividual;
  // Insertar Sesion
  loadingModalGeneracionAutomatica: boolean = false;
  modalRefGeneracionAutomatica: NgbModalRef;
  disablebBtnpPespecifico: boolean = false;
  loadingCcAutocomplete = false;
  loadingGridCursosHijos=false;
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
  dataCursosRelacionados:any;
  loadingGridSesiones:boolean=false;
  listaSesiones:any []=[];
  listaEncuesta:any []=[];
  listaEncuestaAsignada:any []=[];
  loadingGridAsignado:boolean=false;
  loaderModal:boolean=false;
  radio1 = {layout: "Landscape",};
  idPEspecifico:number;
  idGlobal:number;
  idPGeneral:number;
  idPEspecificoSesion:number;
  modalRefDetalletEncuesta:any;
  dataItemActual:any;

  modalRefDetalletEncuestaAsincronica:any;
  capitulos: any[] = [];
  listaEncuestaAsincronica:any []=[];
  idEncuestaAsincronica:number;

  formEncuestaAsincronica: FormGroup = this._formBuilder.group({
    idCapituloProgramaCapacitacion: [null, Validators.required],
    idExamen: [null, Validators.required],
    ubicacionEncuesta: [null, Validators.required],
    encuestaObligatoria:[],
    encuestaActiva:[],
    idTipoPersona:['alumno'],
  })

  ubicacionEncuesta = [{
    id:  1,
    nombre: 'Antes del Capítulo',
  },
  {
    id:  2,
    nombre: 'Después del Capítulo',
  }]

  ngOnInit(): void {
    this.initSubscribeObservables();
    this.configurarGridProgramaEspecifico();
    this._pEspecificoService.ready();
    this.obtenerPespecificos();
    this.getEncuestas();
    this.getEncuestasAsincronica();
    this.cargarGrid();
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
  cargarCursosRelacionados(dataItem:any) {
    this.gridSesiones.data=[];
    this.listaSesiones=[];

      this._pEspecificoService.obtenerTodoPespecificosRelacionados$(
        dataItem
      ).subscribe({
        next: (resp: HttpResponse<InformacionPespecificoHijo[]>) => {
          if (resp.body != null) {
            console.log(resp.body)
            this.gridSesiones.data=resp.body;
            this.loadingGridCursosHijos=false;
      }
    }
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
  abrirModalEncuesta(dataItem:any){
    console.log("modalencuesta",dataItem)
    this.idGlobal=dataItem.id;
    this.loadingGridCursosHijos=true;
    const regex = /^(.*?)(?=\s+ONLINE|\s+AONLINE)/;
    const programaGeneralReg = dataItem.nombre.match(regex)?.[0] || "";
    this.formAsignarEncuesta.get('nombre').setValue(programaGeneralReg);
    this.formAsignarEncuesta.get('nombrePespecifico').setValue(dataItem.nombre);
    this.formAsignarEncuesta.get('tipo').setValue(dataItem.tipoProgramaGeneral);
    this.cargarCursosRelacionados(dataItem.id)
    const modalRef = this._modalService.open(
      this.modalPespecificoEncuesta,
      {
        size: 'xl',
        backdrop: 'static',
        keyboard: false,
      }
    );
  }

expandedRowIndex: number | null = null;

onDetailExpand(event: any): void {
  this.dataItemActual = event.dataItem;
  const dataItem = event.dataItem;
  const idCurso = dataItem.id; 

  if (dataItem.idModalidadCurso == 1) {
    this.cargarSesionesAsincronica(dataItem);
    
  }else if (dataItem.idModalidadCurso == 2) {
    this.cargarSesiones(idCurso, dataItem);
  }
}


checkRespuesta(selectedItem: any) {
  // Desmarca todos los checkboxes excepto el que se acaba de marcar
  this.gridSesiones.data.forEach((item: any) => {
    if (item !== selectedItem) {
      item.checked = false;
    }
  });
  selectedItem.checked = !selectedItem.checked;
}

cargarGrid() {
  this.gridSesiones.isDetailExpanded = (args: RowArgs) => {
    return args.dataItem.checked;
  };
  
  this.gridSesiones.kendoGridDetailTemplateShowIf = (
    dataItem: any
  ) => {
    return dataItem.checked;
  };
}
cargarSesiones(idCurso: number, dataItem: any) {

  console.log(dataItem);

  dataItem.listaSesiones = [];
  dataItem.loadingSesiones = true;  

  let params: any = [
    { clave: 'valor', valor: idCurso },
  ];

  this._integraService.obtenerPorPathParams(constApiPlanificacion.ObtenerEncuestaSesionPrograma, params).subscribe({
    next: (response: any) => {
      dataItem.listaSesiones = response.body;  
      dataItem.loadingSesiones = false; 
    },
    error: (error) => {
      dataItem.loadingSesiones = false;
      this.mostrarMensajeError(error);
    },
    complete: () => {},
  });
}
mostrarMensajeError(error: any): void {

  Swal.fire({
    icon: 'error',
    html: `<p class="text-start">${error.error}</p>
          <p class="text-start text-danger fs-6">${error.message}</p>`,
    allowOutsideClick: false
  })}

registrarEncuesta(){
  let dataForm = this.formEncuesta.getRawValue();
  let encuestaAsignada: IEncuestaProgramaEnvio;
  encuestaAsignada = this.procesarDataEnvioPregunta(dataForm, true);
  this.insertarEncuestaAsignada(encuestaAsignada);
}
procesarDataEnvioPregunta(item: IEncuestaPrograma, isNew: boolean):IEncuestaProgramaEnvio  {
  let asignado: boolean = item.asignadoPara === 'alumno';
  let encuestaAsignada:IEncuestaProgramaEnvio = {
    id: isNew ? 0 : item.id,
    idPGeneral:this.idPGeneral,
    idPEspecifico:this.idPEspecifico,
    idPEspecificoSesion:this.idPEspecificoSesion,
    idEncuestaOnline:item.idEncuestaOnline,
    encuestaActiva:item.encuestaActiva?true:false,
    encuestaObligatoria:item.encuestaObligatoria?true:false,
    asignadoPara:asignado,
    usuario: this._userService.userData.userName,
    };
  return encuestaAsignada;
 };
logSwitch(){

}
getEncuestas(){
  this.listaEncuesta=[];
  this._integraService.obtenerTodo(constApiPlanificacion.ObtenerEncuestaOnline).subscribe({
    next: (response: any) => {
      this.listaEncuesta=response.body;
    },
    error: (error) => {
      this.mostrarMensajeError(error);
    },
    complete: () => {},
  });
}

asignarEncuesta(dataItem:any){
  this.idPEspecificoSesion=dataItem.idPEspecificoSesion
  this.listaEncuestaAsignada=[];
    this.loadingGridAsignado=true
    let params: any = [
      { clave: 'valor', valor: this.idPEspecificoSesion},
    ];
    this._integraService.obtenerPorPathParams(constApiPlanificacion.ObtenerEncuestaAsignada,params).subscribe({
      next: (response: any) => {
        this.listaEncuestaAsignada=response.body;
        console.log(this.listaEncuestaAsignada);
        this.loadingGridAsignado = false;
      },
      error: (error) => {
        this.loadingGridAsignado = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  this.modalRefDetalletEncuesta = this._modalService.open(
    this.modalDetalleEncuestas,
    {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    }
  );
}
validFormDetalleEncuesta(): boolean {
  if(this.formEncuesta.invalid){
    this.formEncuesta.markAllAsTouched();
    return false;
  }
  return true;
}
mostrarMensajeExitoso(){
  this.loaderModal = false;
  const Toast = Swal.mixin({
    toast: true,
    target: '#content-drawer-component',
    customClass: {
      container: 'position-absolute'
    },
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: false,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });
  Toast.fire({
    icon: 'success',
    title: 'Guardado con exito'
  })
}
cargarAsignacion(){
  let params: any = [
    { clave: 'valor', valor: this.idPEspecificoSesion},
  ];
  this._integraService.obtenerPorPathParams(constApiPlanificacion.ObtenerEncuestaAsignada,params).subscribe({
    next: (response: any) => {
      this.listaEncuestaAsignada=response.body;
      this.loadingGridAsignado = false;
    },
    error: (error) => {
      this.loadingGridAsignado = false;
      this.mostrarMensajeError(error);
    },
    complete: () => {},
  });
}
eliminarEncuesta(dateItem:any){
  this.loaderModal = true;
  this.deleteEncuestaAsignada(dateItem.idEncuestaSesionPrograma);
}
resetModalEncuesta(){
  this.formEncuesta.reset({
    idEncuestaOnline: null, 
    encuestaObligatoria: false,
    encuestaActiva: false, 
    asignadoPara: 'alumno' 
  });
}



/*======================Encuesta Sesion Programa CRUD==============================*/
insertarEncuestaAsignada(encuestaAsignada:IEncuestaProgramaEnvio){
    if(this.validFormDetalleEncuesta())
      {
        this.loaderModal = true;
        this._integraService
          .insertar(constApiPlanificacion.InsertarEncuestaSesionPrograma, encuestaAsignada)
          .subscribe({
            next: (response: any) => {
              this.loaderModal = true;
              this.cargarSesiones(this.dataItemActual.id, this.dataItemActual);  
            },
            error: (error) => {
              this.loaderModal = false;
              this.mostrarMensajeError(error);
            },
            complete: () => {
              this.loaderModal = false;
              this.mostrarMensajeExitoso();
              this.modalRefDetalletEncuesta.close();
              this.resetModalEncuesta();

            },
        });
      }
}

deleteEncuestaAsignada(id:any){
  this.loaderModal = true;
  let params: Parametro[] = [
    { clave: 'id', valor: id },
    { clave: 'usuario', valor: this._userService.userData.userName },
  ];
    this._integraService
      .eliminarPorPathParams(constApiPlanificacion.DeleteEncuestaSesionPrograma, params)
    .subscribe({
      next: (response: any) => {
        this.loaderModal = false;
        this.cargarSesiones(this.dataItemActual.id, this.dataItemActual);  
      },
      error: (error) => { 
        this.loaderModal = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {
        this.loaderModal = false;
        this.mostrarMensajeExitoso();
        //this.modalRefDetalletEncuesta.close();
        this.resetModalEncuesta();
      },
  });
}
/*======================FIN Encuesta Sesion Programa CRUD==============================*/

cargarSesionesAsincronica(dataItem: any) {
  console.log(dataItem);
  dataItem.listaSesiones = [];
  dataItem.loadingSesiones = true;  
  this.idPGeneral= dataItem.idProgramaGeneral

  this.ObtenerDatosSesionAsincronica(dataItem);

  this._integraService.getJsonResponse(constApiPlanificacion.ObtenerEncuestaAsincronicaAsignada +"/"+ dataItem.idProgramaGeneral).subscribe({
    next: (response: any) => {
      console.log(response);
      if(response.body.length >0){
        dataItem.listaSesiones = response.body;  
      }    
    },
    error: (error) => {
      dataItem.loadingSesiones = false;
      this.mostrarMensajeError(error);
    },
    complete: () => {
    },
  });
}

ObtenerDatosSesionAsincronica(dataItem:any){
  console.log(dataItem);
  this.idPGeneral=dataItem.idProgramaGeneral;

  this._integraService
      .getJsonResponse(constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtenerCapituloSesionesPGeneral + "/" + dataItem.idProgramaGeneral).subscribe({
        next: (resp: any) => {
          console.log(resp);
          this.capitulos= resp.body
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
        complete: () => {
          dataItem.listaSesiones.forEach((element:any) => {
            this.capitulos.forEach((capitulo:any) => {
              if (element.ordenCapitulo == capitulo.idCapituloProgramaCapacitacion) {
                element.nombreCapitulo = capitulo.capituloProgramaCapacitacion;
              }
            });
          })
          this.dataItemActual = dataItem;
          dataItem.loadingSesiones = false; 
        },
      });
  }

  validFormDetalleEncuestaAsincronica(): boolean {
    if(this.formEncuestaAsincronica.invalid){
      this.formEncuestaAsincronica.markAllAsTouched();
      return false;
    }
    return true;
  }

  AsignarEncuestaAsincronica(dataItem:any){
    console.log(dataItem);
    console.log(this.dataItemActual);
    this.idEncuestaAsincronica = 0;
    if (dataItem != true) { 
      this.idEncuestaAsincronica = dataItem.id;
      this.listaEncuestaAsignada=dataItem.listaSesiones;
      this.loadingGridAsignado=false
      this.formEncuestaAsincronica.get('idCapituloProgramaCapacitacion')?.setValue(dataItem.ordenCapitulo);
      this.formEncuestaAsincronica.get('idExamen')?.setValue(dataItem.idExamen);
      this.formEncuestaAsincronica.get('encuestaObligatoria')?.setValue(dataItem.encuestaObligatoria);
      this.formEncuestaAsincronica.get('encuestaActiva')?.setValue(dataItem.encuestaActiva);
      this.formEncuestaAsincronica.get('idTipoPersona')?.setValue(dataItem.idTipoPersona == 1 ? 'alumno' : 'docente');
      this.formEncuestaAsincronica.get('ubicacionEncuesta')?.setValue(dataItem.ubicacionEncuesta);
    }else{
      this.resetModalEncuestaAsincronica();
    }

    this.modalRefDetalletEncuestaAsincronica = this._modalService.open(
      this.modalDetalleEncuestasAsincronica,
      {
        size: 'xl',
        backdrop: 'static',
        keyboard: false,
      }
    );
  }

  onDetailExpandAsincronica(event: any): void {
    this.dataItemActual = event.dataItem;
    const dataItem = event.dataItem;
    this.cargarSesionesAsincronica(dataItem);
  }

  InsertarEncuestaAsignadaAsincronica(InsertarEncuestaAsignadaAsincronica:IEncuestaProgramaAsincronicaEnvio){
    if(this.validFormDetalleEncuestaAsincronica())
      {
        this.loaderModal = true;
        this._integraService
          .postFormJson(constApiPlanificacion.InsertarEncuestaProgramaAsincronica, InsertarEncuestaAsignadaAsincronica)
          .subscribe({
            next: (response: any) => {
              this.loaderModal = true;
              console.log(InsertarEncuestaAsignadaAsincronica.idPGeneral);
              this.cargarSesionesAsincronica(this.dataItemActual);
            },
            error: (error) => {
              this.loaderModal = false;
              this.mostrarMensajeError(error);
            },
            complete: () => {
              this.loaderModal = false;
              this.mostrarMensajeExitoso();
              this.modalRefDetalletEncuestaAsincronica.close();
              this.resetModalEncuestaAsincronica();
            },
        });
      }
  }

  registrarEncuestaAsincronica(){
    let dataForm = this.formEncuestaAsincronica.getRawValue();
    let encuestaAsignada: IEncuestaProgramaAsincronicaEnvio;
    encuestaAsignada = this.procesarDataEnvioPreguntaAsincronica(dataForm);
    this.InsertarEncuestaAsignadaAsincronica(encuestaAsignada);
  }

  procesarDataEnvioPreguntaAsincronica(dataForm: IEncuestaProgramaAsincronica):IEncuestaProgramaAsincronicaEnvio  {
    console.log(dataForm);
    let asignado = dataForm.idTipoPersona ;
    let encuestaAsignada:IEncuestaProgramaAsincronicaEnvio = {
      id: this.idEncuestaAsincronica == 0 ? 0 : this.idEncuestaAsincronica,
      idPGeneral:this.idPGeneral,
      idCapituloProgramaCapacitacion:dataForm.idCapituloProgramaCapacitacion,
      ubicacionEncuesta:dataForm.ubicacionEncuesta,
      idExamen:dataForm.idExamen,
      encuestaActiva:dataForm.encuestaActiva?true:false,
      encuestaObligatoria:dataForm.encuestaObligatoria?true:false,
      idTipoPersona: asignado == 'alumno' ? 1 : 4,
      usuario: this._userService.userData.userName,
      };
    return encuestaAsignada;
   };

  resetModalEncuestaAsincronica(){
    this.formEncuestaAsincronica.reset({
      idPGeneral: null,
      idCapituloProgramaCapacitacion: null,
      ubicacionEncuesta: null,
      idExamen: null, 
      encuestaObligatoria: false,
      encuestaActiva: false, 
      idTipoPersona: 'alumno'
    });
  }

  getEncuestasAsincronica(){
    this.listaEncuestaAsincronica=[];
    this._integraService.obtenerTodo(constApiPlanificacion.ObtenerEncuestaAsincronica).subscribe({
      next: (response: any) => {
        this.listaEncuestaAsincronica=response.body;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  eliminarEncuestaAsincronicaAsignada(dateItem:any){
    this.loaderModal = true;
    this.deleteEncuestaAsignadaAsincronica(dateItem.id);
  }

  deleteEncuestaAsignadaAsincronica(id:any){
    this.loaderModal = true;
    let params: Parametro[] = [
      { clave: 'id', valor: id },
      { clave: 'usuario', valor: this._userService.userData.userName },
    ];
      this._integraService
        .eliminarPorPathParams(constApiPlanificacion.EliminarEncuestaAsincronicaAsignada, params)
      .subscribe({
        next: (response: any) => {
          this.loaderModal = false;
          this.cargarSesionesAsincronica(this.dataItemActual);  
        },
        error: (error) => { 
          this.loaderModal = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModal = false;
          this.mostrarMensajeExitoso();
          this.modalRefDetalletEncuestaAsincronica.close();
          this.resetModalEncuestaAsincronica();
        },
    });
  }

}

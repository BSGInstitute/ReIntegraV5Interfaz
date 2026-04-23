import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CentroCosto,
  CentroCostoGenerado,
  CombosModulo,
  FiltroInsertarPEspecifico,
  LocacionTroncal,
  PEspecificoPadreIndividual,
  Pespecifico,
  RegistroProgramaEspecifico,
} from '@planificacion/models/interfaces/pespecifico';
import { PespecificoService } from '@planificacion/services/pespecifico.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

const AREQUIPA = 1;
const LIMA = 2;
const BOGOTA = 6;
const CDMEXICO = 10;
const SANTIAGOCL = 11;
const SANTA_CRUZ = 12;

interface FormPespecifico {
  idPgeneral: number;
  nombrePespecifico: string;
  idCentroCosto: number;
  idEstado: number;
  idOrigen: number;
  codigo: string;
  codigoBanco: string;
  modalidad: number;
  duracion: number;
  idTipoProgramaCarrera: number;
  esCursoIndividual: boolean;
  idPespecificoAdicional: number;
  ciudad: LocacionTroncal;
  urlDocumentoCronograma: string;
  urlDocumentoCronogramaM: string;
  urlDocumentoCronogramaB: string;
  urlDocumentoCronogramaI: string;
  urlDocumentoCronogramaGrupos: string;
  urlDocumentoCronogramaGruposM: string;
  urlDocumentoCronogramaGruposB: string;
  urlDocumentoCronogramaGruposI: string;
  resumenClaseActivo: boolean;
  tutorVirtualActivo: boolean;
  idEstadoCupos: number;
}
interface FormGeneracionAutomatica {
  idProgramaGeneral: number;
  modalidad: IComboBase1;
  locacionTroncal: LocacionTroncal;
  anio: number;
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
  selector: 'app-modal-content-creacion-pespecifico',
  templateUrl: './modal-content-creacion-pespecifico.component.html',
  styleUrls: ['./modal-content-creacion-pespecifico.component.scss'],
})
export class ModalContentCreacionPespecificoComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService,

  ) {}

  @Input() pEspecificoService: PespecificoService
  @Input() isNewPespecifico: boolean;
  @Input() tieneSesiones: boolean;
  @Input() esProgramaEspecificoAutomatico: boolean;
  @Input() centroCostoGenerado: CentroCostoGenerado;
  @Input() ciudadSeleccionada: LocacionTroncal;
  @Input() datosFormGeneracionAutomatica: FormGeneracionAutomatica;
  loadingCreacionPespecifico: boolean = false;
  centroCostoTemp: CentroCosto;
  dataItemPespecificoTemp: PEspecificoPadreIndividual;
  combosModulo: CombosModulo;
  formPespecifico: FormGroup = this._formBuilder.group({
    idPgeneral: [null, Validators.required],
    nombrePespecifico: [null, Validators.required],
    idCentroCosto: [null, Validators.required],
    idEstado: [null, Validators.required],
    idOrigen: [null, Validators.required],
    codigo: [null, Validators.required],
    codigoBanco: [null, Validators.required],
    modalidad: [null, Validators.required],
    duracion: [null],
    idTipoProgramaCarrera: [null],
    esCursoIndividual: [false],
    idPespecifico: [],
    ciudad: [null],
    tieneCursoAdicional: false,
    idPespecificoAdicional: null,
    urlDocumentoCronograma: [''],
    urlDocumentoCronogramaM: [''],
    urlDocumentoCronogramaB: [''],
    urlDocumentoCronogramaI: [''],
    urlDocumentoCronogramaGrupos: [''],
    urlDocumentoCronogramaGruposM: [''],
    urlDocumentoCronogramaGruposB: [''],
    urlDocumentoCronogramaGruposI: [''],
    resumenClaseActivo: [false],
    tutorVirtualActivo: [false],
    idEstadoCupos: [null],
  });
  estadosCupos: IComboBase1[] = [
    { id: 1, nombre: 'Con Cupos' },
    { id: 2, nombre: 'Sin Cupos' },
  ];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  centroCostoCreacion: IComboBase1[] = [];
  centroCostoFiltrado: IComboBase1[] = [];
  private readonly MIN_CARACTERES_FILTRO_CC = 3;
  controlesFormPespecifico = {
    showUrlDocumentoCronograma: true,
    showUrlDocumentoCronogramaM: false,
    showUrlDocumentoCronogramaB: false,
    showUrlDocumentoCronogramaI: false,
    showUrlDocumentoCronogramaGrupos: true,
    showUrlDocumentoCronogramaGruposM: false,
    showUrlDocumentoCronogramaGruposB: false,
    showUrlDocumentoCronogramaGruposI: false,
    showCiudad: false,
  };
  tipoCarrera: IComboBase1[] = [];

  ngOnInit(): void {
    this.dataItemPespecificoTemp = this.pEspecificoService.dataItemPespecificoTemp
    this.initSubscribeObservables();
    this.validarPespecificoNuevo();

    this.tipoCarrera = [
      {
        id: 1,
        nombre: "Formacion"
      },{
        id: 2,
        nombre: "Carrera"
      }
    ]

  }
  private validarPespecificoNuevo() {
    if (this.isNewPespecifico == true) {
      this.validarPespecificoAutomatico();
      this.obtenerPespecificosAdicionales();
    } else {
      if (this.tieneSesiones == true) {
        this.formPespecifico.get('duracion').disable();
      } else {
        this.formPespecifico.get('duracion').enable();
      }
      this.asignarValoresFormPespecifico(this.dataItemPespecificoTemp);
    }
  }
  private validarPespecificoAutomatico() {
    if (this.esProgramaEspecificoAutomatico == true) {
      this.formPespecifico.get('idPgeneral').disable();
      this.controlesFormPespecifico.showCiudad = false;
      this.centroCostoTemp = {
        id: 0,
        idPgeneral: this.centroCostoGenerado.centroCosto.idPgeneral,
        nombre: this.centroCostoGenerado.centroCosto.nombre,
        codigo: this.centroCostoGenerado.codigo,
        idAreaCc: this.centroCostoGenerado.centroCosto.idAreaCc,
        idArea: this.centroCostoGenerado.centroCosto.idArea,
        idSubArea: this.centroCostoGenerado.centroCosto.idSubArea,
        ismtotales: this.centroCostoGenerado.centroCosto.ismtotales,
        icpftotales: this.centroCostoGenerado.centroCosto.icpftotales,
      };
      let itemCentroCosto: IComboBase1 = {
        id: this.centroCostoGenerado.centroCosto.id,
        nombre: this.centroCostoGenerado.centroCosto.nombre,
      };
      this.centroCostoCreacion = [
        itemCentroCosto,
        ...this.combosModulo.centroCosto,
      ];
      this.centroCostoFiltrado = [itemCentroCosto];
      this.formPespecifico
        .get('nombrePespecifico')
        .setValue(this.centroCostoGenerado.nombreProgramaEspecifico);
      this.formPespecifico
        .get('codigo')
        .setValue(this.centroCostoGenerado.codigo);
      this.formPespecifico
        .get('codigoBanco')
        .setValue(this.centroCostoGenerado.codigoBanco);
      this.formPespecifico
        .get('idCentroCosto')
        .setValue(this.centroCostoGenerado.centroCosto.id);
      this.formPespecifico
        .get('idPgeneral')
        .setValue(this.datosFormGeneracionAutomatica.idProgramaGeneral);
      this.formPespecifico
        .get('modalidad')
        .setValue(this.datosFormGeneracionAutomatica.modalidad.id);
      this.formPespecifico
        .get('ciudad')
        .setValue(this.ciudadSeleccionada);

      this.controlesFormPespecifico.showUrlDocumentoCronograma = true;
      this.controlesFormPespecifico.showUrlDocumentoCronogramaGrupos = true;
    }else{
      this.controlesFormPespecifico.showCiudad = true;
      this.centroCostoCreacion = [...this.combosModulo.centroCosto];
      this.centroCostoFiltrado = [];
    }
  }
  initSubscribeObservables() {
    this.pEspecificoService.combosModulo$.subscribe((resp) => {
      this.combosModulo = resp;
    });
  }
  onFilterCentroCosto(filtro: string) {
    if (filtro.length >= this.MIN_CARACTERES_FILTRO_CC) {
      const textoFiltro = filtro.toLowerCase();
      this.centroCostoFiltrado = this.centroCostoCreacion.filter(
        (cc) => cc.nombre.toLowerCase().includes(textoFiltro)
      );
    } else {
      this.cargarCentroCostoInicial();
    }
  }
  private cargarCentroCostoInicial() {
    const idCentroCosto = this.formPespecifico.get('idCentroCosto')?.value;
    if (idCentroCosto != null) {
      const ccSeleccionado = this.centroCostoCreacion.find(
        (cc) => cc.id === idCentroCosto
      );
      this.centroCostoFiltrado = ccSeleccionado ? [ccSeleccionado] : [];
    } else {
      this.centroCostoFiltrado = [];
    }
  }
  generarUrlCronograma() {
    let idPespecifico = 0;
    if (!this.isNewPespecifico) {
      idPespecifico = this.dataItemPespecificoTemp.id;
    }
    this._integraService
      .getTextResponse(
        `${constApiPlanificacion.PEspecificoObtenerCronogramaParaModuloAlterno}/${idPespecifico}`
      )
      .subscribe({
        next: (resp: HttpResponse<string>) => {
          this.validacionInputActivo(resp.body, false);
          this._alertaService.swalFireOptions({
            icon: 'success',
            text: 'Se guardo el PDF correctamente',
          });
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  validacionInputActivo(url: string, esGrupal: boolean){
    let dataItem = this.dataItemPespecificoTemp;
    if (dataItem.idCiudad == LIMA || dataItem.idCiudad == BOGOTA) {
      if(!esGrupal){
        this.formPespecifico
          .get('urlDocumentoCronograma')
          .setValue(url);
      }else{
        this.formPespecifico
          .get('urlDocumentoCronogramaGrupos')
          .setValue(url);
      }
    } else if (dataItem.idCiudad == SANTA_CRUZ) {
      if(!esGrupal){
        this.formPespecifico
          .get('urlDocumentoCronogramaB')
          .setValue(url);
      }else{
        this.formPespecifico
          .get('urlDocumentoCronogramaGruposB')
          .setValue(url);
      }
    } else if (dataItem.idCiudad == CDMEXICO) {
      if(!esGrupal){
        this.formPespecifico
        .get('urlDocumentoCronogramaM')
        .setValue(url);
      }else{
        this.formPespecifico
        .get('urlDocumentoCronogramaGruposM')
        .setValue(url);
      }
    }
  }
  generarUrlCronogramaGrupal() {
    let idPespecifico = 0;
    if (!this.isNewPespecifico) {
      idPespecifico = this.dataItemPespecificoTemp.id;
    }
    this._integraService
      .getTextResponse(
        `${constApiPlanificacion.PEspecificoGenerarCronogramaGrupal}/${idPespecifico}`
      )
      .subscribe({
        next: (resp: HttpResponse<string>) => {
          this.validacionInputActivo(resp.body, true);
          this._alertaService.swalFireOptions({
            icon: 'success',
            text: 'Se guardo el PDF correctamente',
          });
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  insertarPespecifico() {
    if (!this.formPespecifico.valid) {
      this.formPespecifico.markAllAsTouched();
      this._alertaService.swalFireOptions({
        icon: 'info',
        text: 'Por favor completar campos obligatorios',
      });
      return;
    }
    let pespecifico = this.recuperarValoresFormPespecifico();
    if (pespecifico == null) {
      return;
    }
    if (this.isNewPespecifico) {
      pespecifico.categoria = 'Categoria';
    }
    let datosForm = this.formPespecifico.getRawValue() as FormPespecifico;

    let jsonEnvio: FiltroInsertarPEspecifico = {
      pespecifico: pespecifico,
      idCiudad: datosForm.ciudad.idCiudad
    };
    jsonEnvio.idPespecificoAdicional = datosForm.idPespecificoAdicional;

    if (this.centroCostoTemp != null) {
      jsonEnvio.centroCosto = this.centroCostoTemp;
    }
    this.loadingCreacionPespecifico = true
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.PEspecificoInsertarCrearCursosConCentroCosto,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<RegistroProgramaEspecifico>) => {
          if (resp.body != null) {
            this.pEspecificoService.obtenerPespecificos();
            this.pEspecificoService.obtenerCombosModulo().subscribe({
              next: () => {
                this.loadingCreacionPespecifico = false;
                this.activeModal.close();
              },
              error: () => {
                this.loadingCreacionPespecifico = false;
                this.activeModal.close();
              }
            });
            this._alertaService.mensajeExitoso(
              'El programa especifico se creo correctamente'
            );
          } else {
            this.formPespecifico.markAllAsTouched();
            this.loadingCreacionPespecifico = false;
            this.activeModal.close();
          }
        },
        error: (error) => {
          this.loadingCreacionPespecifico = false
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  actualizarPespecifico() {
    let pespecifico = this.recuperarValoresFormPespecifico();
    if (pespecifico == null) {
      return;
    }
    pespecifico.id = this.dataItemPespecificoTemp.id;
    this.loadingCreacionPespecifico = true
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.PEspecificoActualizarPespecifico,
        JSON.stringify(pespecifico)
      )
      .subscribe({
        next: (resp: HttpResponse<Pespecifico>) => {
          this.pEspecificoService.obtenerPespecificos();
          this._alertaService.swalFireOptions({
            icon: 'success',
            text: 'Se actualizo con exito',
          });
          this.loadingCreacionPespecifico = false
          this.activeModal.close();
        },
        error: (error) => {
          this.loadingCreacionPespecifico = false
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  private recuperarValoresFormPespecifico(): Pespecifico {
    let isNew = this.isNewPespecifico;
    let datosForm = this.formPespecifico.getRawValue() as FormPespecifico;
    let estadoP: string =
      this.pEspecificoService.obtenerNombreCombo(
        datosForm.idEstado,
        'estadoPEspecifico'
      ) ?? '';
    let modalidad: string =
      this.pEspecificoService.obtenerNombreCombo(
        datosForm.modalidad,
        'modalidad'
      ) ?? '';
    if (
      datosForm.ciudad.codigoBS == null ||
      datosForm.ciudad.denominacionBS == null
    ) {
      this._alertaService.swalFireOptions({
        icon: 'info',
        text: 'La ciudad seleccionada no tiene CodigoBS o DenominacionBS',
      });
    }
    let urlDocumentoCronograma: string;
    let urlDocumentoCronogramaGrupos: string;
    const idCiudad = datosForm.ciudad.codigoBS;
    if (idCiudad == SANTA_CRUZ) {
      urlDocumentoCronograma = datosForm.urlDocumentoCronogramaB;
      urlDocumentoCronogramaGrupos = datosForm.urlDocumentoCronogramaGruposB;
    } else if (idCiudad == CDMEXICO) {
      urlDocumentoCronograma = datosForm.urlDocumentoCronogramaM;
      urlDocumentoCronogramaGrupos = datosForm.urlDocumentoCronogramaGruposM;
    } else {
      urlDocumentoCronograma = datosForm.urlDocumentoCronograma;
      urlDocumentoCronogramaGrupos = datosForm.urlDocumentoCronogramaGrupos;
    }
    let pespecifico: Pespecifico = {
      id: isNew ? 0 : this.dataItemPespecificoTemp.id,
      nombre: datosForm.nombrePespecifico,
      ciudad: datosForm.ciudad.denominacionBS,
      idCiudad: datosForm.ciudad.codigoBS,
      codigo: datosForm.codigo,
      idCentroCosto: datosForm.idCentroCosto,
      estadoPid: datosForm.idEstado,
      estadoP: estadoP,
      tipo: modalidad,
      tipoId: datosForm.modalidad,
      tipoAmbiente: '-1',
      idProgramaGeneral: datosForm.idPgeneral,
      codigoBanco: datosForm.codigoBanco,
      origenPrograma: datosForm.idOrigen,
      duracion: datosForm.duracion != null ? String(datosForm.duracion) : null,
      idTipoProgramaCarrera: datosForm.idTipoProgramaCarrera,
      idCursoMoodle: null, //TODO: No se usa
      idCursoMoodlePrueba: null, //TODO: No se usa
      cursoIndividual: datosForm.esCursoIndividual ?? false,
      urlDocumentoCronograma: urlDocumentoCronograma,
      urlDocumentoCronogramaGrupos: urlDocumentoCronogramaGrupos,
      idCiclo: null,
      idPeriodoLectivo: null,
      resumenClaseActivo: datosForm.resumenClaseActivo,
      tutorVirtualActivo: datosForm.tutorVirtualActivo,
      idEstadoCupos: datosForm.idEstadoCupos,
    };
    return pespecifico;
  }
  private asignarValoresFormPespecifico(dataItem: PEspecificoPadreIndividual) {
    this.dataItemPespecificoTemp = dataItem;
    this.centroCostoCreacion = [...this.combosModulo.centroCosto];
    const ccActual = this.combosModulo.centroCosto.find(
      (cc) => cc.id === dataItem.idCentroCosto
    );
    this.centroCostoFiltrado = ccActual ? [ccActual] : [];
    this.controlesFormPespecifico.showUrlDocumentoCronogramaM = false;
    this.controlesFormPespecifico.showUrlDocumentoCronogramaB = false;
    this.controlesFormPespecifico.showUrlDocumentoCronogramaI = false;
    this.controlesFormPespecifico.showUrlDocumentoCronogramaGruposM = false;
    this.controlesFormPespecifico.showUrlDocumentoCronogramaGruposB = false;
    this.controlesFormPespecifico.showUrlDocumentoCronogramaGruposI = false;

    this.formPespecifico.get('idPgeneral').setValue(dataItem.idProgramaGeneral);
    this.formPespecifico.get('idPgeneral').disable();
    this.formPespecifico.get('nombrePespecifico').setValue(dataItem.nombre);
    this.formPespecifico.get('idCentroCosto').setValue(dataItem.idCentroCosto);
    this.formPespecifico.get('idEstado').setValue(dataItem.estadoPId);
    this.formPespecifico.get('idOrigen').setValue(dataItem.origenPrograma);
    this.formPespecifico.get('codigo').setValue(dataItem.codigo);
    this.formPespecifico.get('codigoBanco').setValue(dataItem.codigoBanco);
    this.formPespecifico.get('modalidad').setValue(dataItem.tipoId);
    this.formPespecifico.get('duracion').setValue(Number(dataItem.duracion));
    this.formPespecifico.get('idTipoProgramaCarrera').setValue(dataItem.idTipoProgramaCarrera);
    this.formPespecifico
      .get('esCursoIndividual').disable();
    this.formPespecifico
      .get('esCursoIndividual')
      .setValue(dataItem.cursoIndividual);
    //this.formPespecifico.get('tieneCursoAdicional').setValue(true);
    this.formPespecifico.get('tieneCursoAdicional').disable();
    //this.formPespecifico.get('pEspecificoAdicional').disable();

    if (dataItem.idCiudad == LIMA || dataItem.idCiudad == BOGOTA) {
      this.controlesFormPespecifico.showUrlDocumentoCronograma = true;
      this.controlesFormPespecifico.showUrlDocumentoCronogramaGrupos = true;
      this.formPespecifico
        .get('urlDocumentoCronograma')
        .setValue(dataItem.urlDocumentoCronograma);
      this.formPespecifico
        .get('urlDocumentoCronogramaGrupos')
        .setValue(dataItem.urlDocumentoCronogramaGrupos);

      if (
        dataItem.urlDocumentoCronogramaM != null &&
        dataItem.urlDocumentoCronogramaM.trim() != ''
      ) {
        this.formPespecifico
          .get('urlDocumentoCronogramaM')
          .setValue(dataItem.urlDocumentoCronogramaB);
        this.controlesFormPespecifico.showUrlDocumentoCronogramaM = true;
      }
      if (
        dataItem.urlDocumentoCronogramaB != null &&
        dataItem.urlDocumentoCronogramaB.trim() != ''
      ) {
        this.formPespecifico
          .get('urlDocumentoCronogramaB')
          .setValue(dataItem.urlDocumentoCronogramaB);
        this.controlesFormPespecifico.showUrlDocumentoCronogramaB = true;
      }
      if (
        dataItem.urlDocumentoCronogramaI != null &&
        dataItem.urlDocumentoCronogramaI.trim() != ''
      ) {
        this.formPespecifico
          .get('urlDocumentoCronogramaI')
          .setValue(dataItem.urlDocumentoCronogramaB);
        this.controlesFormPespecifico.showUrlDocumentoCronogramaI = true;
      }

      if (
        dataItem.urlDocumentoCronogramaGruposM != null &&
        dataItem.urlDocumentoCronogramaGruposM.trim() != ''
      ) {
        this.formPespecifico
          .get('urlDocumentoCronogramaGruposM')
          .setValue(dataItem.urlDocumentoCronogramaGruposM);
        this.controlesFormPespecifico.showUrlDocumentoCronogramaGruposM = true;
      }
      if (
        dataItem.urlDocumentoCronogramaGruposB != null &&
        dataItem.urlDocumentoCronogramaGruposB.trim() != ''
      ) {
        this.formPespecifico
          .get('urlDocumentoCronogramaGruposB')
          .setValue(dataItem.urlDocumentoCronogramaGruposB);
        this.controlesFormPespecifico.showUrlDocumentoCronogramaGruposB = true;
      }
      if (
        dataItem.urlDocumentoCronogramaGruposI != null &&
        dataItem.urlDocumentoCronogramaGruposI.trim() != ''
      ) {
        this.formPespecifico
          .get('urlDocumentoCronogramaGruposI')
          .setValue(dataItem.urlDocumentoCronogramaGruposI);
        this.controlesFormPespecifico.showUrlDocumentoCronogramaGruposI = true;
      }
    } else if (dataItem.idCiudad == SANTA_CRUZ) {
      this.controlesFormPespecifico.showUrlDocumentoCronograma = false;
      this.controlesFormPespecifico.showUrlDocumentoCronogramaGrupos = false;
      this.controlesFormPespecifico.showUrlDocumentoCronogramaB = true;
      this.controlesFormPespecifico.showUrlDocumentoCronogramaGruposB = true;
      this.formPespecifico
        .get('urlDocumentoCronogramaB')
        .setValue(dataItem.urlDocumentoCronograma);
      this.formPespecifico
        .get('urlDocumentoCronogramaGruposB')
        .setValue(dataItem.urlDocumentoCronogramaGrupos);
    } else if (dataItem.idCiudad == CDMEXICO) {
      this.controlesFormPespecifico.showUrlDocumentoCronograma = false;
      this.controlesFormPespecifico.showUrlDocumentoCronogramaGrupos = false;
      this.controlesFormPespecifico.showUrlDocumentoCronogramaM = true;
      this.controlesFormPespecifico.showUrlDocumentoCronogramaGruposM = true;
      this.formPespecifico
        .get('urlDocumentoCronogramaM')
        .setValue(dataItem.urlDocumentoCronograma);
      this.formPespecifico
        .get('urlDocumentoCronogramaGruposM')
        .setValue(dataItem.urlDocumentoCronogramaGrupos);
    }
    if (dataItem.idCiudad != null) {
      let location = this.combosModulo.locacionTroncal.find(
        (x) =>
          x.idCiudad == dataItem.idCiudad || x.codigoBS == dataItem.idCiudad
      );
      if (location != null) {
        this.formPespecifico.get('ciudad').setValue(location);
      }
    }
    this.formPespecifico.get('resumenClaseActivo').setValue(dataItem.resumenClaseActivo);
    this.formPespecifico.get('tutorVirtualActivo').setValue(dataItem.tutorVirtualActivo);
    this.formPespecifico.get('idEstadoCupos').setValue(dataItem.idEstadoCupos);

  }
  pEspecificosAdicional : IComboBase1[] = [];

  private obtenerPespecificosAdicionales() {
    // this.loadingCreacionPespecifico = true;
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.PEspecificoObtenerObtenerProgramasEspecificosAdicional
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.pEspecificosAdicional = resp.body;
          // this.loadingCreacionPespecifico = false;
        },
        error: (error) => {
          // this.loadingCreacionPespecifico = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
}

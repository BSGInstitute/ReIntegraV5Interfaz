import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PEspecificoPadreIndividual, DatosConfiguracionProgramasWebex, ParametrosInsertaFrecuencia, PespecificoFrecuenciaDetalle, CombosModulo } from '@planificacion/models/interfaces/pespecifico';
import { PespecificoService } from '@planificacion/services/pespecifico.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

interface FormFrecuencia {
  fechaInicio: Date;
  fechaFin: Date;
  frecuencia: number;
  aplicaEnvioCorreoConfirmacion: boolean;
  valorCorreoConfirmacion: number;
  tipoCorreoConfirmacion: null;
  plantillaCorreoConfirmacion: string;
  aplicaCreacionSesion: boolean;
  valorCreacionSesion: number;
  tipoCreacionSesion: null;
  aplicaEnvioCorreo: boolean;
  valorEnvioCorreo: number;
  tipoEnvioCorreo: null;
  plantillaEnvioCorreo: string;
  aplicaEnvioWhatsapp: boolean;
  valorEnvioWhatsapp: number;
  tipoEnvioWhatsapp: null;
  plantillaEnvioWhatsapp: string;
  aplicaEnvioCorreoDocente: boolean;
  valorEnvioCorreoDocente: number;
  tipoEnvioCorreoDocente: null;
  plantillaEnvioCorreoDocente: string;
  nroSesiones: number;
  sesionesFrecuencia: { dia: any; hora: Date; duracion: number }[];
}

@Component({
  selector: 'app-modal-content-frecuencia',
  templateUrl: './modal-content-frecuencia.component.html',
  styleUrls: ['./modal-content-frecuencia.component.scss']
})
export class ModalContentFrecuenciaComponent implements OnInit {

  constructor(    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService) { }
  @Input() pEspecificoService: PespecificoService
  @Input() configuracionProgramasWebex: DatosConfiguracionProgramasWebex;
  @Input() isNew: boolean = false;
  @Input() esFrecuenciaWebinar: boolean = false;
  @Input() idsPespecificoSeleccionado: number[] = [];
  dataItemPespecificoTemp: PEspecificoPadreIndividual;
  itemsClosureFrecuencia = {
    showBtnCrearCronograma: false,
    showBtnModificarCronograma: false,
    showConfigurarWebinarFrecuencia: false,
    showFechaFin: false,
    showEnvioCorreoConfirmacion: false,
    showCreacionSesionWebinar: false,
    showCreacionEnvioCorreo: false,
    showCreacionEnvioWhatsApp: false,
    showCreacionEnvioCorreoDocente: false,
    swowSesionModulos: false,
  };
  readonly sourceOpcionFrecuencia = [
    { nombre: 'Horas', id: 6 },
    { nombre: 'Dias', id: 2 },
    { nombre: 'Semanas', id: 3 },
  ];
  readonly sourceOpcionFrecuencia2 = [
    { nombre: 'Horas', id: 6 },
    { nombre: 'Dias', id: 2 },
  ];
  readonly sourceOperadorWebinar = [
    { nombre: 'Igual', id: 2 },
    { nombre: 'Menor Igual', id: 3 },
    { nombre: 'Mayor Igual', id: 4 },
    { nombre: 'Entre', id: 10 },
  ];
  formFrecuencia: FormGroup = this._formBuilder.group({
    fechaInicio: [null, Validators.required],
    fechaFin: null,
    frecuencia: [null, Validators.required],
    aplicaEnvioCorreoConfirmacion: null,
    valorCorreoConfirmacion: null,
    tipoCorreoConfirmacion: null,
    plantillaCorreoConfirmacion: null,
    aplicaCreacionSesion: null,
    valorCreacionSesion: null,
    tipoCreacionSesion: null,
    aplicaEnvioCorreo: null,
    valorEnvioCorreo: null,
    tipoEnvioCorreo: null,
    plantillaEnvioCorreo: null,
    aplicaEnvioWhatsapp: null,
    valorEnvioWhatsapp: null,
    tipoEnvioWhatsapp: null,
    plantillaEnvioWhatsapp: null,
    aplicaEnvioCorreoDocente: null,
    valorEnvioCorreoDocente: null,
    tipoEnvioCorreoDocente: null,
    plantillaEnvioCorreoDocente: null,
    nroSesiones: null,
    sesionesFrecuencia: this._formBuilder.array([]),
  });
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  loadingFrecuencia: boolean = false;
  combosModulo: CombosModulo
  ngOnInit(): void {
    this.dataItemPespecificoTemp = this.pEspecificoService.dataItemPespecificoTemp;
    this.initSubscribeObservables();
    if (this.isNew == true) {
      this.itemsClosureFrecuencia.showBtnCrearCronograma = true;
      this.itemsClosureFrecuencia.showBtnModificarCronograma = false;
      // ? No utilizado
      this.itemsClosureFrecuencia.showConfigurarWebinarFrecuencia = true;
    } else {
      this.itemsClosureFrecuencia.showBtnCrearCronograma = false;
      this.itemsClosureFrecuencia.showBtnModificarCronograma = true;
      // ? No utilizado
      this.itemsClosureFrecuencia.showConfigurarWebinarFrecuencia = false;
    }
    if(this.esFrecuenciaWebinar == true){
      this.configuracionInicialWebinar();
    }else{
      this.configuracionInicial();
    }
  }
  initSubscribeObservables() {
    this.pEspecificoService.combosModulo$.subscribe((resp) => {
      this.combosModulo = resp;
    });
  }
  get dataFormFrecuencia(): FormFrecuencia {
    return this.formFrecuencia.getRawValue() as FormFrecuencia;
  }
  get sesionesFrecuencia(): FormArray {
    return this.formFrecuencia.get('sesionesFrecuencia') as FormArray;
  }
  configuracionInicial() {
    // this.itemsClosureFrecuencia.showFechaFin = false;
    if (
      this.dataItemPespecificoTemp.tipo == 'Online Sincronica' &&
      this.dataItemPespecificoTemp.tipoSesion == 'PROGRAMA'
    ) {
      this.itemsClosureFrecuencia.showFechaFin = false;
      this.itemsClosureFrecuencia.showEnvioCorreoConfirmacion = false;
      this.itemsClosureFrecuencia.showCreacionSesionWebinar = true;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreo = true;
      this.itemsClosureFrecuencia.showCreacionEnvioWhatsApp = true;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreoDocente = true;
    } else if (
      this.dataItemPespecificoTemp.tipo == 'Online Sincronica' &&
      this.dataItemPespecificoTemp.tipoSesion == 'INDIVIDUAL' &&
      (this.dataItemPespecificoTemp.tipoProgramaGeneral == 'Modulo' ||
        this.dataItemPespecificoTemp.tipoProgramaGeneral == 'Padre')
    ) {
      this.itemsClosureFrecuencia.showEnvioCorreoConfirmacion = false;
      this.itemsClosureFrecuencia.showCreacionSesionWebinar = true;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreo = true;
      this.itemsClosureFrecuencia.showCreacionEnvioWhatsApp = true;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreoDocente = true;
    } else if (
      this.dataItemPespecificoTemp.tipoProgramaGeneral == 'Webinar Recurrente'
    ) {
      this.itemsClosureFrecuencia.showEnvioCorreoConfirmacion = true;
      this.itemsClosureFrecuencia.showCreacionSesionWebinar = true;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreo = true;
      this.itemsClosureFrecuencia.showCreacionEnvioWhatsApp = true;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreoDocente = true;
    } else {
      this.itemsClosureFrecuencia.showEnvioCorreoConfirmacion = false;
      this.itemsClosureFrecuencia.showCreacionSesionWebinar = false;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreo = false;
      this.itemsClosureFrecuencia.showCreacionEnvioWhatsApp = false;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreoDocente = false;
    }
  }
  private configuracionInicialWebinar(){
    if (
      this.dataItemPespecificoTemp.tipo == 'Online Sincronica' &&
      (this.dataItemPespecificoTemp.tipoSesion == 'PROGRAMA' ||
        this.dataItemPespecificoTemp.tipoSesion == 'INDIVIDUAL') &&
      this.dataItemPespecificoTemp.tipoProgramaGeneral != 'Webinar Recurrente'
    ) {
      this.itemsClosureFrecuencia.showFechaFin = false;
      this.itemsClosureFrecuencia.showEnvioCorreoConfirmacion = false;
      this.itemsClosureFrecuencia.showCreacionSesionWebinar = true;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreo = true;
      this.itemsClosureFrecuencia.showCreacionEnvioWhatsApp = true;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreoDocente = true;
    } else if (
      this.dataItemPespecificoTemp.tipoProgramaGeneral == 'Webinar Recurrente'
    ) {
      this.itemsClosureFrecuencia.showFechaFin = true;
      this.itemsClosureFrecuencia.showEnvioCorreoConfirmacion = true;
      this.itemsClosureFrecuencia.showCreacionSesionWebinar = true;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreo = true;
      this.itemsClosureFrecuencia.showCreacionEnvioWhatsApp = true;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreoDocente = true;
    } else {
      this.itemsClosureFrecuencia.showFechaFin = false;
      this.itemsClosureFrecuencia.showEnvioCorreoConfirmacion = false;
      this.itemsClosureFrecuencia.showCreacionSesionWebinar = false;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreo = false;
      this.itemsClosureFrecuencia.showCreacionEnvioWhatsApp = false;
      this.itemsClosureFrecuencia.showCreacionEnvioCorreoDocente = false;
    }
    if(this.configuracionProgramasWebex != null){
      this.asignarValoresWebinar(this.configuracionProgramasWebex);
    }
  }
  private asignarValoresWebinar(item: DatosConfiguracionProgramasWebex) {
    this.formFrecuencia
      .get('valorCorreoConfirmacion')
      .setValue(item.valorFrecuenciaCorreoConfirmacion);
    this.formFrecuencia
      .get('tipoCorreoConfirmacion')
      .setValue(item.idTiempoFrecuenciaCorreoConfirmacion);
    this.formFrecuencia
      .get('plantillaCorreoConfirmacion')
      .setValue(String(item.idPlantillaCorreoConfirmacion));
    this.formFrecuencia.get('valorCreacionSesion').setValue(item.valor);
    this.formFrecuencia
      .get('tipoCreacionSesion')
      .setValue(item.idTiempoFrecuencia);

    this.formFrecuencia
      .get('valorEnvioCorreo')
      .setValue(item.valorFrecuenciaCorreo);
    this.formFrecuencia
      .get('tipoEnvioCorreo')
      .setValue(item.idTiempoFrecuenciaCorreo);
    this.formFrecuencia
      .get('plantillaEnvioCorreo')
      .setValue(String(item.idPlantillaFrecuenciaCorreo));

    this.formFrecuencia
      .get('valorEnvioWhatsapp')
      .setValue(item.valorFrecuenciaWhatsapp);
    this.formFrecuencia
      .get('tipoEnvioWhatsapp')
      .setValue(item.idTiempoFrecuenciaWhatsapp);
    this.formFrecuencia
      .get('plantillaEnvioWhatsapp')
      .setValue(String(item.idPlantillaFrecuenciaWhatsapp));
    this.formFrecuencia
      .get('valorEnvioCorreoDocente')
      .setValue(item.valorFrecuenciaDocente);
    this.formFrecuencia
      .get('tipoEnvioCorreoDocente')
      .setValue(item.idTiempoFrecuenciaCorreoDocente);
    this.formFrecuencia
      .get('plantillaEnvioCorreoDocente')
      .setValue(String(item.idPlantillaDocente));

    this.formFrecuencia.get('fechaInicio').setValue(new Date(item.fechaInicio));
    if (item.fechaFin != null) {
      this.formFrecuencia.get('fechaFin').setValue(new Date(item.fechaFin));
    }
    this.formFrecuencia.get('frecuencia').setValue(item.idFrecuencia);

    this.formFrecuencia.get('aplicaEnvioCorreoConfirmacion').setValue(true);
    this.formFrecuencia.get('aplicaCreacionSesion').setValue(true);
    this.formFrecuencia.get('aplicaEnvioCorreo').setValue(true);
    this.formFrecuencia.get('aplicaEnvioWhatsapp').setValue(true);
    this.formFrecuencia.get('aplicaEnvioCorreoDocente').setValue(true);
  }

  private validarFrecuencia(): boolean {
    let sesiones = this.sesionesFrecuencia.getRawValue();
    if (!this.formFrecuencia.valid) {
      this.formFrecuencia.markAllAsTouched();
      this._alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Datos incorrectos!',
      });
      return false;
    }
    if (sesiones.length == 0) {
      this._alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Ingrese sesiones!',
      });
      return false;
    }
    if (!this.sesionesFrecuencia.valid) {
      this.sesionesFrecuencia.markAllAsTouched();
      this._alertaService.swalFireOptions({
        icon: 'info',
        text: '¡Datos incorrectos en sesiones!',
      });
      return false;
    }
    return true;
  }
   guardarFrecuencia() {
    if(this.validarFrecuencia()){
      let json = this.procesarParametrosInsertarFrecuencia();
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.PEspecificoInsertarFrecuencia,
          JSON.stringify(json)
        )
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            console.log(resp.body);
            if (resp.body) {
              if (
                this.dataItemPespecificoTemp.tipoProgramaGeneral ==
                  'Webinar Recurrente' ||
                this.dataItemPespecificoTemp.tipoProgramaGeneral ==
                  'Individual' ||
                this.dataItemPespecificoTemp.tipoProgramaGeneral == 'Modulo'
              ) {
                //TODO
                // this.verConfiguracionPespecifico(this.dataItemPespecificoTemp);
              }
              this.pEspecificoService.modificarFrecuencia$.next(true);
              this._alertaService.swalFireOptions({
                icon: 'success',
                text: 'Cronograma Creado Correctamente',
              });
            } else {
              this._alertaService.swalFireOptions({
                icon: 'success',
                text: 'Ocurrio un error al crear cronograma',
              });
            }
            this.activeModal.close();
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
  }
  modificarFrecuencia() {
    if(this.validarFrecuencia()){
      let json = this.procesarParametrosInsertarFrecuencia();
      if(json.listaPEspecificos.length == 0){
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'Seleccione Modulo o Webinar a Modificar',
        });
        return
      }
      if(json.listaPEspecificos.length > 1){
        this._alertaService.swalFireOptions({
          icon: 'info',
          text: 'Solo debe hacer una seleccion',
        });
        return
      }
      this.loadingFrecuencia = true;
      this._integraService
        .putJsonResponse(
          constApiPlanificacion.PEspecificoModificarFrecuencia,
          JSON.stringify(json)
        )
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            this.loadingFrecuencia = false;
            if (resp.body) {
              this.pEspecificoService.modificarFrecuencia$.next(true);
              this._alertaService.swalFireOptions({
                icon: 'success',
                text: 'Cronograma modificado correctamente',
              });
              this.activeModal.close();
            } else {
              this._alertaService.swalFireOptions({
                icon: 'success',
                text: 'Ocurrio un error al modificar el cronograma',
              });
              this.activeModal.close();
            }
          },
          error: (error) => {
            this.loadingFrecuencia = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
            //this.activeModal.close
          },
        });
    }
  }
  private procesarParametrosInsertarFrecuencia(): ParametrosInsertaFrecuencia {
    let jsonEnvio: ParametrosInsertaFrecuencia = {
      listaDetalles: [],
      listaDetallesWebinar: [],
      idPespecifico: 0,
      fechaInicio: '',
      idFrecuencia: 0,
      idFrecuenciaWebinar: 0,
      listaPEspecificos: [],
    };
    let sesiones = this.sesionesFrecuencia.getRawValue() as {
      dia: string;
      hora: Date;
      duracion: number;
    }[];
    jsonEnvio.listaDetalles = sesiones.map((x) => {
      let item: PespecificoFrecuenciaDetalle = {
        diaSemana: Number(x.dia),
        horaDia: datePipeTransform(x.hora, 'HH:mm:ss'),
        duracion: x.duracion,
      };
      return item;
    });

    if (
      this.dataItemPespecificoTemp.tipoProgramaGeneral ==
        'Webinar Recurrente' ||
      this.dataItemPespecificoTemp.tipoProgramaGeneral == 'Padre' ||
      this.dataItemPespecificoTemp.tipoProgramaGeneral == 'Modulo'
    ) {
      jsonEnvio.idPespecifico = this.dataItemPespecificoTemp.id;
    } else {
      jsonEnvio.idPespecifico = this.dataItemPespecificoTemp.id;
    }
    jsonEnvio.fechaInicio = datePipeTransform(
      this.dataFormFrecuencia.fechaInicio
    );
    jsonEnvio.fechaFin = datePipeTransform(this.dataFormFrecuencia.fechaFin);
    jsonEnvio.idFrecuencia = this.dataFormFrecuencia.frecuencia;
    // jsonEnvio.fechaInicioWebinar = this.dataFormFrecuencia.fechaInicioWebinar;
    // jsonEnvio.idFrecuenciaWebinar = this.dataFormFrecuencia.frecuenciaWebinar;
    jsonEnvio.listaPEspecificos = this.idsPespecificoSeleccionado ?? [];
    jsonEnvio.idTiempoFrecuencia = this.dataFormFrecuencia.valorEnvioWhatsapp;
    jsonEnvio.valorTiempoFrecuencia =
      this.dataFormFrecuencia.valorEnvioWhatsapp;
    jsonEnvio.idTiempoFrecuenciaCorreoConfirmacion =
      this.dataFormFrecuencia.tipoCorreoConfirmacion;
    jsonEnvio.valorFrecuenciaCorreoConfirmacion =
      this.dataFormFrecuencia.valorCorreoConfirmacion;
    jsonEnvio.idTiempoFrecuenciaCorreo =
      this.dataFormFrecuencia.tipoEnvioCorreo;
    jsonEnvio.valorFrecuenciaCorreo = this.dataFormFrecuencia.valorEnvioCorreo;
    jsonEnvio.idTiempoFrecuenciaWhatsapp =
      this.dataFormFrecuencia.tipoEnvioWhatsapp;
    jsonEnvio.valorFrecuenciaWhatsapp =
      this.dataFormFrecuencia.valorEnvioWhatsapp;
    jsonEnvio.idPlantillaFrecuenciaCorreo =
      this.dataFormFrecuencia.plantillaEnvioCorreo != null ? Number(this.dataFormFrecuencia.plantillaEnvioCorreo) : null;
    jsonEnvio.idPlantillaFrecuenciaWhatsapp =
      this.dataFormFrecuencia.plantillaEnvioWhatsapp != null ? Number(this.dataFormFrecuencia.plantillaEnvioWhatsapp) : null;
    jsonEnvio.idPlantillaCorreoConfirmacion =
      this.dataFormFrecuencia.plantillaCorreoConfirmacion != null ? Number(this.dataFormFrecuencia.plantillaCorreoConfirmacion) : null;
    jsonEnvio.idTiempoFrecuenciaCorreoDocente =
      this.dataFormFrecuencia.tipoEnvioCorreoDocente;
    jsonEnvio.valorFrecuenciaDocente =
      this.dataFormFrecuencia.valorEnvioCorreoDocente;
    jsonEnvio.idPlantillaDocente =
      this.dataFormFrecuencia.plantillaEnvioCorreoDocente != null ? Number(this.dataFormFrecuencia.plantillaEnvioCorreoDocente) : null;
    jsonEnvio.checkTiempoFrecuencia =
      this.dataFormFrecuencia.aplicaCreacionSesion;
    jsonEnvio.checkEnvioCorreo = this.dataFormFrecuencia.aplicaEnvioCorreo;
    jsonEnvio.checkEnvioWhatsApp = this.dataFormFrecuencia.aplicaEnvioWhatsapp;
    jsonEnvio.checkEnvioCorreoConfirmacion =
      this.dataFormFrecuencia.aplicaEnvioCorreoConfirmacion;
    jsonEnvio.checkEnvioCorreoDocente =
      this.dataFormFrecuencia.aplicaEnvioCorreoDocente;
    return jsonEnvio;
  }
  createSesionForm() {
    let nroSesiones = this.formFrecuencia.get('nroSesiones').value as number;
    this.sesionesFrecuencia.clear();
    if (nroSesiones <= 6 && nroSesiones > 0)
      for (let index = 0; index < nroSesiones; index++) {
        let formSesion = this._formBuilder.group({
          dia: [null, Validators.required],
          hora: [null, Validators.required],
          duracion: [null, Validators.required],
        });
        this.sesionesFrecuencia.push(formSesion);
        this.itemsClosureFrecuencia.swowSesionModulos = true;
      }
    else {
      this.itemsClosureFrecuencia.swowSesionModulos = false;
    }
  }
}

import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  constApiFinanzas,
  constApiPlanificacion,
} from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentFrecuenciaComponent } from '@planificacion/configuracion-programas-capacitacion/programa-especifico/modal-content-frecuencia/modal-content-frecuencia.component';
import {
  CombosModulo,
  ConfigurarWebinar,
  CronogramaGrupo,
  DatosConfiguracionProgramasWebex,
  EmpresaAutorizadaCombo,
  InformacionPespecificoHijo,
  PEspecificoPadreIndividual,
  ProgramaEspecificoFUR,
} from '@planificacion/models/interfaces/pespecifico';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';

@Injectable()
export class PespecificoService {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}
  private _subscriptions$: Subscription = new Subscription();
  private _reloadPespecifico$ = new Subject<boolean>();
  private _reloadPespecificoFur$ = new Subject<boolean>();
  modificarFrecuencia$ = new Subject<boolean>();
  private _sourceEmpresaAutorizada$ = new BehaviorSubject<
    EmpresaAutorizadaCombo[]
  >([]);
  private _dataItemPespecificoTemp: PEspecificoPadreIndividual;
  pespecificosHijos: InformacionPespecificoHijo[] = [];
  private _combosModulo$ = new BehaviorSubject<CombosModulo>({
    producto: [],
    proveedor: [],
    proveedorCurso: [],
    productoPresentacion: [],
    programaGeneral: [],
    centroCosto: [],
    modalidad: [],
    locacionTroncal: [],
    ambiente: [],
    origen: [],
    locacion: [],
    expositor: [],
    frecuencia: [],
    estadoPEspecifico: [],
    personalAreaTrabajo: [],
    ciudad: [],
    ciudadBS: [],
    areaCapacitacion: [],
    subAreaCapacitacion: [],
    programaGeneralP: [],
    programaEspecifico: [],
    programaEspecificoHijos: [],
    centroCostoP: [],
    programaEspecificoWebinar: [],
    plantillaCorreo: [],
    plantillaWhatsApp: [],
    tiempoFrecuencia: [],
    dias: [],
    periodoLectivo: [],
    ciclo: [],
  });
  esCursoIndividual: boolean = false;
  esIndividual: boolean = false;
  tieneFrecuencia: boolean = false;
  aplicarConfigurarWebinar: boolean = false;
  esWebinarRecurrente: boolean = false;
  get reloadPespecifico2$() {
    return this._reloadPespecifico$.asObservable();
  }
  get reloadPespecificoFur$() {
    return this._reloadPespecificoFur$.asObservable();
  }
  get combosModulo$() {
    return this._combosModulo$;
  }
  get sourceEmpresaAutorizada$() {
    return this._sourceEmpresaAutorizada$.asObservable();
  }
  set dataItemPespecificoTemp(valor: PEspecificoPadreIndividual) {
    this._dataItemPespecificoTemp = valor;
  }
  get dataItemPespecificoTemp() {
    return this._dataItemPespecificoTemp;
  }
  ready() {
    this.obtenerCombosModulo();
    this.obtenerComboEmpresaAutorizada();
  }
  obtenerPespecificos() {
    this._reloadPespecifico$.next(true);
  }
  obtenerPespecificoFur() {
    this._reloadPespecificoFur$.next(true);
  }
  private obtenerCombosModulo() {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.PEspecificoObtenerCombosModuloAsync
      )
      .subscribe({
        next: (resp: HttpResponse<CombosModulo>) => {
          let combos = resp.body as any;
          for (const key in combos) {
            combos[key] = combos[key].sort((a: any, b: any) =>
              a.nombre.localeCompare(b.nombre)
            );
          }
          let resultado = combos as CombosModulo;
          let combosModulo = this._combosModulo$.value;
          combosModulo.producto = resultado.producto.sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
          );
          combosModulo.proveedor = resultado.proveedor;
          combosModulo.proveedorCurso = resultado.proveedorCurso;
          combosModulo.productoPresentacion = resultado.productoPresentacion;
          combosModulo.programaGeneral = resultado.programaGeneral;
          combosModulo.centroCosto = resultado.centroCosto;
          combosModulo.modalidad = resultado.modalidad;
          combosModulo.locacionTroncal = resultado.locacionTroncal;
          combosModulo.ambiente = resultado.ambiente;
          combosModulo.origen = resultado.origen;
          combosModulo.locacion = resultado.locacion;
          combosModulo.expositor = resultado.expositor;
          combosModulo.frecuencia = resultado.frecuencia;
          combosModulo.estadoPEspecifico = resultado.estadoPEspecifico;
          combosModulo.personalAreaTrabajo = resultado.personalAreaTrabajo;
          combosModulo.ciudad = resultado.ciudad;
          combosModulo.ciudadBS = resultado.ciudadBS;
          combosModulo.areaCapacitacion = resultado.areaCapacitacion;
          combosModulo.subAreaCapacitacion = resultado.subAreaCapacitacion;
          combosModulo.programaGeneralP = resultado.programaGeneralP;
          combosModulo.programaEspecifico = resultado.programaEspecifico;
          combosModulo.programaEspecificoHijos =
            resultado.programaEspecificoHijos;
          combosModulo.centroCostoP = resultado.centroCostoP;
          combosModulo.programaEspecificoWebinar =
            resultado.programaEspecificoWebinar;
          combosModulo.plantillaCorreo = resultado.plantillaCorreo;
          combosModulo.plantillaWhatsApp = resultado.plantillaWhatsApp;
          combosModulo.tiempoFrecuencia = resultado.tiempoFrecuencia;
          combosModulo.dias = resultado.dias;
          combosModulo.periodoLectivo = resultado.periodoLectivo;
          combosModulo.ciclo = resultado.ciclo;
          this._combosModulo$.next(combosModulo);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  private obtenerComboEmpresaAutorizada() {
    let sub$ = this._integraService
      .getJsonResponse(constApiFinanzas.EmpresaAutorizadaObtenerCombo)
      .subscribe({
        next: (resp: HttpResponse<EmpresaAutorizadaCombo[]>) => {
          this._sourceEmpresaAutorizada$.next(resp.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    this._subscriptions$.add(sub$);
  }
  obtenerNombreCombo(id: number, keyCombo: keyof CombosModulo) {
    let combo = this._combosModulo$.value[keyCombo] as any[];
    if (id != null) {
      let item = combo.find((x) => x.id == id);
      if (item != null) return item.nombre;
    }
    return null;
  }
  obtenerTodoPespecificosRelacionados$(
    idPespecifico: number
  ): Observable<HttpResponse<InformacionPespecificoHijo[]>> {
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.PEspecificoObtenerTodoPespecificosRelacionados}/${idPespecifico}`
    ) as Observable<HttpResponse<InformacionPespecificoHijo[]>>;
  }
  obtenerNombreCiudad(idCiudad: number) {
    if (idCiudad != null) {
      let ciudades = this._combosModulo$.value.locacionTroncal.filter(
        (x) => x.codigoBS == idCiudad
      );
      if (ciudades.length == 0) {
        ciudades = this._combosModulo$.value.locacionTroncal.filter(
          (x) => x.idCiudad == idCiudad
        );
      }
      if (ciudades.length != 0) {
        return ciudades[0].nombre;
      }
    }
    return null;
  }
  modificarCronograma() {
    if (
      (this._dataItemPespecificoTemp.tipoProgramaGeneral ==
        'Webinar Recurrente' ||
        this._dataItemPespecificoTemp.tipoProgramaGeneral == 'Padre' ||
        this._dataItemPespecificoTemp.tipoProgramaGeneral == 'Modulo') &&
      this._dataItemPespecificoTemp.tipoSesion == 'INDIVIDUAL'
    ) {
      this.obtenerConfiguracionWebinarPEspecifico(
        this._dataItemPespecificoTemp.id
      );
    } else {
      this.verificarDuracion(false);
    }
  }
  verificarDuracion(isNew: boolean) {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.PEspecificoVerificarDuracionPorIdPespecificoPadre}/${this._dataItemPespecificoTemp.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body == true) {
            const modalRef = this._modalService.open(
              ModalContentFrecuenciaComponent,
              {
                size: 'lg',
                backdrop: 'static',
                keyboard: false,
              }
            );
            modalRef.componentInstance.pEspecificoService = this;
            modalRef.componentInstance.isNew = isNew;
          } else {
            this._alertaService.swalFireOptions({
              icon: 'info',
              text: 'La duracion de los cursos debe ser distinta de 0 ó debe tener cursos asociados',
              allowOutsideClick: false,
            });
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerConfiguracionWebinarPEspecifico(idPespecifico: number) {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.PEspecificoObtenerConfiguracionWebinarPEspecifico}/${idPespecifico}`
      )
      .subscribe({
        next: (resp: HttpResponse<DatosConfiguracionProgramasWebex>) => {
          const modalRef = this._modalService.open(
            ModalContentFrecuenciaComponent,
            {
              size: 'lg',
              backdrop: 'static',
            }
          );
          modalRef.componentInstance.pEspecificoService = this;
          if (resp.body != null) {
            modalRef.componentInstance.configuracionProgramasWebex = resp.body;
            modalRef.componentInstance.isNew = false;
          } else {
            modalRef.componentInstance.isNew = false;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationError(mensaje);
        },
      });
  }
  obtenerConfiguracionWebinar$(
    idPEspecificoPadre: number
  ): Observable<HttpResponse<ConfigurarWebinar[]>> {
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.ConfigurarWebinarObtenerPorIdPespecificoPadre}/${idPEspecificoPadre}`
    );
  }
  obtenerCronogramaPEspecifico$(
    idsPespecificoSeleccionado: number[],
    idPespecifico: number,
    esCursoIndividual: boolean,
    nroGrupo?: number
  ): Observable<HttpResponse<CronogramaGrupo[]>> {
    let jsonEnvio: {
      listaPEspecificos: number[];
      pEspecificoId: number;
      cursoIndividual: boolean;
      nroGrupo?: number;
    } = {
      listaPEspecificos: idsPespecificoSeleccionado,
      pEspecificoId: idPespecifico,
      cursoIndividual: esCursoIndividual,
      nroGrupo: nroGrupo ?? 1,
    };
    return this._integraService.postJsonResponse(
      constApiPlanificacion.PEspecificoObtenerCronogramaPEspecifico,
      JSON.stringify(jsonEnvio)
    );
  }
  obtenerDenominacionBSCiudad(idCiudad: number) {
    if (idCiudad != null) {
      let ciudades = this.combosModulo$.value.locacionTroncal.filter(
        (x) => x.codigoBS == idCiudad
      );
      if (ciudades.length == 0) {
        ciudades = this.combosModulo$.value.locacionTroncal.filter(
          (x) => x.idCiudad == idCiudad
        );
      }
      if (ciudades.length != 0) {
        return ciudades[0].denominacionBS;
      }
    }
    return null;
  }
  verificarEsPespecificoIndividual(idPespecifico: number) {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.PEspecificoVerificarEsPespecificoIndividual}/${idPespecifico}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body == true) {
            this.esCursoIndividual = true; //Si es curso individual
          } else {
            this.esCursoIndividual = false; //Curso Diplomado
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  verificarSiTienePadrePEspecifico$(): Observable<
    HttpResponse<{ estado: boolean; nombre: string }>
  > {
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.PEspecificoVerificarSiTienePadrePEspecifico}/${this.dataItemPespecificoTemp.id}`
    );
  }
  verificarFrecuenciaPorIdPespecifico$(): Observable<HttpResponse<boolean>> {
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.PEspecificoVerificarFrecuenciaPorIdPespecifico}/${this.dataItemPespecificoTemp.id}`
    );
  }
  obtenerFurProgramaEspecifico$(): Observable<
    HttpResponse<ProgramaEspecificoFUR[]>
  > {
    return this._integraService.getJsonResponse(
      `${constApiFinanzas.FurObtenerFurProgramaEspecifico}/${this.dataItemPespecificoTemp.id}`
    );
  }
  obtenerNumeroGrupos$(): Observable<HttpResponse<IComboBase1[]>> {
    return this._integraService.getJsonResponse(
      `${constApiPlanificacion.PEspecificoObtenerNumeroGrupos}/${this.dataItemPespecificoTemp.id}/${this.esIndividual}`
    );
  }
}

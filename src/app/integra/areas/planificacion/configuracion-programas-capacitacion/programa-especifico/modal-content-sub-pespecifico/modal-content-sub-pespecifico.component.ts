import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  constApiFinanzas,
  constApiPlanificacion,
} from '@environments/constApi';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import {
  Ambiente,
  CombosModulo,
  ConfigurarWebinar,
  CronogramaGrupo,
  CruceSesionPEspecifico,
  DatosConfiguracionProgramasWebex,
  DocenteAmbientePespecifico,
  InformacionPespecificoHijo,
  PEspecificoPadreIndividual,
  ProgramaEspecificoFUR,
  ProgramaEspecificoHijo,
} from '@planificacion/models/interfaces/pespecifico';
import { PespecificoService } from '@planificacion/services/pespecifico.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Observable, forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ModalContentRegistroFurComponent } from '../modal-content-registro-fur/modal-content-registro-fur.component';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { ModalContentCronogramaComponent } from '../modal-content-cronograma/modal-content-cronograma.component';
import type { FeriadoConPaisDTO } from '../programa-especifico.component';
import { ModalContentFrecuenciaComponent } from '../modal-content-frecuencia/modal-content-frecuencia.component';
import { GridComponent } from '@progress/kendo-angular-grid';
const idTemplate = '#modalSubPespecifico';
interface FormSupPgeneral {
  id: number;
  idPeriodoLectivo: number;
  idCiclo: number;
  idEstadoPEspecifico: number;
  idEstadoCupos: number;
  idModalidadCurso: number;
  idProveedor: number;
  idAmbiente: number;
  duracion: number;
  idCursoMoodle: number;
  idCursoMoodlePrueba: number;
}

@Component({
  selector: 'app-modal-content-sub-pespecifico',
  templateUrl: './modal-content-sub-pespecifico.component.html',
  styleUrls: ['./modal-content-sub-pespecifico.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalContentSubPespecificoComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    private _alertaService: AlertaService,
    private _modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {}

  @Input() pEspecificoService: PespecificoService;
  @Input() dataGridSupGeneral: InformacionPespecificoHijo[];

  dataItemPespecificoTemp: PEspecificoPadreIndividual;
  combosModulo: CombosModulo;
  gridSubPgeneral: KendoGrid = new KendoGrid();
  gridCruces = new KendoGrid();
  showCruces: boolean = false;
  filtroAmbienteWebinar: Ambiente[] = [];
  filtroPespecificoWebinar: ProgramaEspecificoHijo[] = [];
  btnClosureSubPEspecifico = {
    showBtnAsignarFrecuencia: false,
    showBtnVerCronograma: false,
    showBtnModificarCronograma: false,
    showBtnGenerarFur: false,
  };
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  idsPespecificoSeleccionado: number[] = [];
  esProgramaInstitutoTemp: boolean = false;
  estadosCupos: IComboBase1[] = [
    { id: 1, nombre: 'Con Cupos' },
    { id: 2, nombre: 'Sin Cupos' },
  ];

  ngOnInit(): void {
    this.dataItemPespecificoTemp =
      this.pEspecificoService.dataItemPespecificoTemp;
    this.initSubscribeObservables();
    this.configurarGridSubPgeneral();
    this.configuracionInicial();
    this.cargarGridSuPgeneral(this.dataGridSupGeneral);
    this.pEspecificoService.verificarEsPespecificoIndividual(
      this.dataItemPespecificoTemp.id
    );
    if (this.dataItemPespecificoTemp.idTipoProgramaCarrera == 2) {
      this.esProgramaInstitutoTemp = true;
    }
  }
  ngOnDestroy(): void {
    this.pEspecificoService.pespecificosHijos = [];
  }
  initSubscribeObservables() {
    this.pEspecificoService.combosModulo$.subscribe((resp) => {
      this.combosModulo = resp;
    });
    this.pEspecificoService.modificarFrecuencia$.subscribe((resp) => {
      if(resp == true){
        this.btnClosureSubPEspecifico.showBtnAsignarFrecuencia = false;
        this.btnClosureSubPEspecifico.showBtnVerCronograma = true;
      }
    });
  }
  private configuracionInicial() {
    this.btnClosureSubPEspecifico.showBtnAsignarFrecuencia =
      !this.pEspecificoService.tieneFrecuencia;
    this.btnClosureSubPEspecifico.showBtnVerCronograma =
      this.pEspecificoService.tieneFrecuencia;
    this.btnClosureSubPEspecifico.showBtnModificarCronograma =
      this.pEspecificoService.tieneFrecuencia;
    this.btnClosureSubPEspecifico.showBtnGenerarFur =
      this.pEspecificoService.tieneFrecuencia;
  }
  private configurarGridSubPgeneral() {
    this.gridSubPgeneral.formGroup = this._formBuilder.group({
      id: null,
      idPeriodoLectivo: null,
      idCiclo: null,
      idEstadoPEspecifico: null,
      idEstadoCupos: null,
      idModalidadCurso: null,
      idProveedor: null,
      idAmbiente: null,
      duracion: null,
      idCursoMoodle: null,
      idCursoMoodlePrueba: null,
    });
    this.gridSubPgeneral.cellClickEvent$.subscribe({
      next: (resp) => {
        let dataItem = resp.dataItem as InformacionPespecificoHijo;
        switch (resp.column.field) {
          case 'id':
            this.cargarComboPespecificos(dataItem);
            break;
          case 'idProveedor':
            if (dataItem.duracion == 0) {
              this.gridSubPgeneral.formGroup.get('idProveedor').disable();
            } else {
              this.gridSubPgeneral.formGroup.get('idProveedor').enable();
            }
            break;
          case 'idAmbiente':
            if (dataItem.duracion == 0) {
              this.gridSubPgeneral.formGroup.get('idAmbiente').disable();
            } else {
              this.gridSubPgeneral.formGroup.get('idAmbiente').enable();
              let ciudades = this.combosModulo.locacionTroncal.filter(
                (x) => x.codigoBS == dataItem.idCiudad
              );
              if (ciudades.length == 0) {
                ciudades = this.combosModulo.locacionTroncal.filter(
                  (x) => x.idCiudad == dataItem.idCiudad
                );
              }
              if (ciudades.length > 0) {
                this.filtroAmbienteWebinar = this.combosModulo.ambiente.filter(
                  (x) => x.idCiudad == ciudades[0].idCiudad
                );
              }
            }
            break;
          default:
            break;
        }
      },
    });
    this.gridSubPgeneral.cellCloseEvent$.subscribe({
      next: (resp) => {
        if (
          resp.dataItem[resp.column.field] !=
          resp.formGroup.get(resp.column.field).value
        ) {
          if (resp.column.field == 'id') {
            if (resp.dataItem.id != resp.formGroupValue.id) {
              this.actualizarInsertarModuloWebinar(
                resp.dataItem,
                resp.formGroupValue.id
              );
            }
          } else {
            if (resp.dataItem.id != null && resp.dataItem.id != 0) {
              this.actualizarDocenteAmbienteProgramaEspecifico(
                resp.dataItem,
                resp.formGroupValue,
                resp.column.field as keyof FormSupPgeneral
              );
            } else {
              this._alertaService.swalFireOptions({
                icon: 'info',
                title: 'Seleccione un programa especifico',
              });
            }
          }
        }
      },
    });
    this.gridSubPgeneral.removeEvent$.subscribe({
      next: (resp) => {
        this._alertaService
          .swalFireOptions({
            title: '¿Está seguro de eliminar el registro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.gridSubPgeneral.data.splice(resp.index, 1);
              this.gridSubPgeneral.loadData();
            }
          });
      },
    });
  }
  actualizarDocenteAmbienteProgramaEspecifico(
    dataItem: InformacionPespecificoHijo,
    formValue: FormSupPgeneral,
    field: keyof FormSupPgeneral
  ) {
    let jsonEnvio: DocenteAmbientePespecifico = {
      id: dataItem.id,
      duracion:
        formValue.duracion == null ? '0' : formValue.duracion.toString(),
    };
    if (field != 'duracion' && field != 'id') {
      jsonEnvio[field] = formValue[field];
    }
    this.gridSubPgeneral.loading = true;
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.PEspecificoActualizarDocenteAmbienteProgramaEspecifico,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (
          resp: HttpResponse<{
            estadoCruce: boolean;
            idPespecifico: number;
            cruces: CruceSesionPEspecifico[];
          }>
        ) => {
          if (resp.body.estadoCruce) {
            resp.body.cruces.forEach((x) => {
              if (x.fechaHoraInicio != null)
                x.fechaHoraInicio = new Date(x.fechaHoraInicio);
              if (x.fechaFin != null) x.fechaFin = new Date(x.fechaFin);
            });
            this.gridCruces.data = resp.body.cruces;
          } else {
            dataItem[field] = formValue[field];
            this._alertaService.toastOptions(
              'Se realizaron los cambios correctamente',
              'success',
              'top-right',
              idTemplate
            );
          }
          this.gridSubPgeneral.loading = false;
          this.showCruces = resp.body.estadoCruce;
        },
        error: (error) => {
          this.gridSubPgeneral.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerNombreCombo(idBusqueda: number, keyCombo: keyof CombosModulo) {
    return this.pEspecificoService.obtenerNombreCombo(idBusqueda, keyCombo);
  }
  /**
   * @param {InformacionPespecificoHijo} dataItem item InformacionPespecificoHijo
   */
  cargarComboPespecificos(dataItem: InformacionPespecificoHijo): void {
    let filtro: ProgramaEspecificoHijo[] = [];
    if (dataItem.id != null && dataItem.id != 0) {
      filtro = this.combosModulo.programaEspecificoHijos.filter(
        (x) => x.idProgramaGeneral == dataItem.idProgramaGeneral
      );
    } else {
      filtro = this.combosModulo.programaEspecificoHijos;
    }
    if (
      dataItem.idEstadoPEspecifico != null &&
      dataItem.idEstadoPEspecifico != 3
    ) {
      filtro.push({
        id: dataItem.id,
        nombre: dataItem.nombre,
        idProgramaGeneral: dataItem.idProgramaGeneral,
      });
    }
    this.filtroPespecificoWebinar = filtro;
  }
  actualizarInsertarModuloWebinar(
    dataItem: InformacionPespecificoHijo,
    idPespecifico: number
  ) {
    let jsonEnvio: {
      id: number;
      idPespecifico: number;
      idPespecificoPadre: number;
    } = {
      id: dataItem.id ?? 0,
      idPespecifico: idPespecifico,
      idPespecificoPadre: this.dataItemPespecificoTemp.id,
    };
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.PEspecificoActualizarInsertarModuloWebinar,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body) {
            this._alertaService.toastOptions(
              'Se realizaron los cambios correctamente',
              'success',
              'top-right',
              idTemplate
            );
            this.recargarConfiguracion();
          } else {

            this._alertaService.notificationWarning(
              'No se encontro el registro a actualizar'
            );
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  cargarGridSuPgeneral(data: InformacionPespecificoHijo[]) {
    data.forEach((x) => {
      x.fechaHoraInicio = new Date(x.fechaHoraInicio);
      x.duracion = Number(x.duracion);
    });
    this.gridSubPgeneral.data = data;
    this.gridSubPgeneral.loading = false;
    this.pEspecificoService.pespecificosHijos = data;
  }
  registroFur() {
    const modalRef = this._modalService.open(ModalContentRegistroFurComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.pEspecificoService = this.pEspecificoService;
    modalRef.componentInstance.isNew = true;
  }
  crearCronograma() {
    this.verificarDuracion(true);
  }
  generarDescargarCronogramaPorId(idPespecifico: number) {
    this._integraService
      .getTextResponse(
        `${constApiPlanificacion.PEspecificoObtenerCronogramaParaModulo}/${idPespecifico}`
      )
      .subscribe({
        next: (resp: HttpResponse<string>) => {
          if (resp.body != null && resp.body != '') {
            this._alertaService.notificationSuccess(
              'Se generó correctamente el cronograma'
            );
            window.open(resp.body);
          } else {
            this._alertaService.notificationInfo(
              'No se pudo generar el cronograma'
            );
          }
        },
        error: (error) => {
          console.log(error);
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationError(mensaje);
        },
      });
  }
  modificarCronograma() {
    if (
      (this.dataItemPespecificoTemp.tipoProgramaGeneral ==
        'Webinar Recurrente' ||
        this.dataItemPespecificoTemp.tipoProgramaGeneral == 'Padre' ||
        this.dataItemPespecificoTemp.tipoProgramaGeneral == 'Modulo') &&
      this.dataItemPespecificoTemp.tipoSesion == 'INDIVIDUAL'
    ) {
      this.obtenerConfiguracionWebinarPEspecifico(
        this.dataItemPespecificoTemp.id
      );
    } else {
      this.verificarDuracion(false);
    }
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
          modalRef.componentInstance.pEspecificoService = this.pEspecificoService;
          if (resp.body != null) {
            modalRef.componentInstance.configuracionProgramasWebex = resp.body;
            // modalRef.componentInstance.isNew = false;
            modalRef.componentInstance.isNew = true;
          }else{
            modalRef.componentInstance.isNew = true;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationError(mensaje);
        },
      });
  }
  verificarDuracion(isNew: boolean) {
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.PEspecificoVerificarDuracionPorIdPespecificoPadre}/${this.dataItemPespecificoTemp.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp.body == true) {
            const modalRef = this._modalService.open(
              ModalContentFrecuenciaComponent,
              {
                size: 'lg',
                backdrop: 'static',
                keyboard: false
              }
            );
            modalRef.componentInstance.pEspecificoService = this.pEspecificoService;
            modalRef.componentInstance.isNew = isNew;


            /*VER CRONOGRAMA*/
            if(this.idsPespecificoSeleccionado.length > 0){
              this.idsPespecificoSeleccionado = this.idsPespecificoSeleccionado.filter(x => x != 0 && x)
            }
                // modalRef.componentInstance.pEspecificoService = this.pEspecificoService;
                // modalRef.componentInstance.pEspecificoHijos = [];
                // modalRef.componentInstance.esCronogramaGrupo = true;
            modalRef.componentInstance.idsPespecificoSeleccionado = this.idsPespecificoSeleccionado;
                // modalRef.componentInstance.cronogramaGrupo = resp[0].body;
                // modalRef.componentInstance.configuracionWebinar = resp[1].body;
                // modalRef.componentInstance.programaEspecificoFUR = resp[2].body;


            /*FINAL VER CRONOGRAMA */

          } else {
            this._alertaService.swalFireOptions({
              icon: 'info',
              text: 'La duracion de los cursos debe ser distinta de 0 ó debe tener cursos asociados',
              allowOutsideClick: false
            });
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  verCronograma() {
    if(this.idsPespecificoSeleccionado.length > 0){
      this.idsPespecificoSeleccionado = this.idsPespecificoSeleccionado.filter(x => x != 0 && x)
    }
    const idPe = this.dataItemPespecificoTemp.id;
    console.log('[Feriados][SubPespecifico] verCronograma - solicitando idsTroncalPaisFeriado', { idPe });
    let observable1$ = this.pEspecificoService.obtenerCronogramaPEspecifico$(
      this.idsPespecificoSeleccionado,
      idPe,
      this.pEspecificoService.esIndividual
    );
    let observable2$ = this.pEspecificoService.obtenerConfiguracionWebinar$(
      idPe
    );
    let observable3$ = this._integraService.getJsonResponse(
      `${constApiFinanzas.FurObtenerFurProgramaEspecifico}/${idPe}`
    ) as Observable<HttpResponse<ProgramaEspecificoFUR[]>>;
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
            console.log('[Feriados][SubPespecifico] idsTroncalPaisFeriado recibidos', {
              idPe,
              cantidad: idsPaises.length,
              idsPaises,
            });
            let feriados$: Observable<HttpResponse<FeriadoConPaisDTO[]>>;
            if (idsPaises.length > 0) {
              const url = `${constApiPlanificacion.FeriadoListarPorPaises}?${idsPaises
                .map((id) => `idsTroncalPais=${id}`)
                .join('&')}`;
              console.log('[Feriados][SubPespecifico] SE LLAMARA a Feriado/ListarPorPaises', { url });
              feriados$ = this._integraService.getJsonResponse(
                url
              ) as Observable<HttpResponse<FeriadoConPaisDTO[]>>;
            } else {
              console.warn('[Feriados][SubPespecifico] idsPaises vacio -> NO se llamara a Feriado/ListarPorPaises');
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
              keyboard: false
            }
          );
          modalRef.componentInstance.pEspecificoService = this.pEspecificoService;
          modalRef.componentInstance.pEspecificoHijos = [];
          modalRef.componentInstance.esCronogramaGrupo = true;
          modalRef.componentInstance.idsPespecificoSeleccionado = this.idsPespecificoSeleccionado;
          modalRef.componentInstance.cronogramaGrupo = resp[0].body;
          modalRef.componentInstance.configuracionWebinar = resp[1].body;
          modalRef.componentInstance.programaEspecificoFUR = resp[2].body;
          const feriadosBody = resp[3].body ?? [];
          console.log('[Feriados][SubPespecifico] feriados cargados al modal cronograma', {
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
  agregarModuloCurso() {
    let item: InformacionPespecificoHijo = {
      id: 0,
      nombre: null,
      duracion: null,
      idCiudad: null,
      tipoAmbiente: null,
      idAmbiente: null,
      idExpositor_Referencia: null,
      idProgramaGeneral: null,
      fechaHoraInicio: null,
      idCentroCosto: null,
      idProveedor: null,
      idEstadoPEspecifico: null,
      idEstadoCupos: null,
      idModalidadCurso: null,
      idCursoMoodle: null,
      idCursoMoodlePrueba: null,
      codigo: null,
      grupos: [],
      gruposEdicion: [],
    };
    this.gridSubPgeneral.data = [item, ...this.gridSubPgeneral.data];
  }
  private recargarConfiguracion() {
    let observable1$ = this._integraService.getJsonResponse(
      `${constApiPlanificacion.PEspecificoVerificarFrecuenciaPorIdPespecifico}/${this.dataItemPespecificoTemp.id}`
    ) as Observable<HttpResponse<boolean>>;
    let observable2$ =
      this.pEspecificoService.obtenerTodoPespecificosRelacionados$(
        this.dataItemPespecificoTemp.id
      );
    this.gridSubPgeneral.loading = true;
    const combined$ = forkJoin([observable1$, observable2$]);
    combined$.subscribe({
      next: (
        resp: [
          HttpResponse<boolean>,
          HttpResponse<InformacionPespecificoHijo[]>
        ]
      ) => {
        if (resp[1].body != null) {
          this.pEspecificoService.tieneFrecuencia = resp[0].body;
          this.cargarGridSuPgeneral(resp[1].body);
          this.configuracionInicial();
          this.pEspecificoService.verificarEsPespecificoIndividual(
            this.dataItemPespecificoTemp.id
          );
        }
      },
      error: (error) => {
        this.gridSubPgeneral.loading = false;
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationError(mensaje);
      },
    });
  }
  reloadGridSupPgeneral(grid: GridComponent){
    if(grid != null){
      try{
        grid.closeCell();
      }
      catch(error){
        console.log(error)
      }
    }
    this.gridSubPgeneral.loading = true;
    this.pEspecificoService.obtenerTodoPespecificosRelacionados$(
      this.dataItemPespecificoTemp.id
      ).subscribe({
      next: (resp) => {
          this.gridSubPgeneral.loading = false;
          this.gridSubPgeneral.data = resp.body;
      },
      error: (error) => {
        this.gridSubPgeneral.loading = false;
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationError(mensaje);
      }
    });
  }
}

import { HttpResponse } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  constApiGestionPersonal,
  constApiPlanificacion,
} from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormService } from '@shared/services/form.service';
import {
  PuntajeEvaluacionAgrupadaComponenteDTO,
  CombosConfigurarProcesoSeleccion,
  ConfigurarProcesoSeleccion,
  EstructuraBasica,
  EtapaProcesoSeleccion,
  Evaluaciones,
  EvaluacionPuntaje,
  NombreEvaluacionAgrupadaCalificacion,
  NombreEvaluacionAgrupadaComponente,
  NombreEvaluacionesAgrupadaIndependiente,
  NombreEvaluacionAgrupadaC,
  ExamenAsignadoProceso,
  EtapaProcesoSeleccionActualizar,
  EvaluacionAsignadoProceso,
  ActualizarProcesoSeleccion,
  ProcesoSeleccionEtapa,
} from '@gestionPersonas/models/ConfigurarProcesoSeleccion';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import Swal from 'sweetalert2';

import {
  ProcesoSeleccionAgrupadoInsertarModificarDTO,
  ExamenAsignadoEtapa,
  EvaluacionAsignadoProcesos,
} from '@integra/models/proceso-seleccion';

interface FormNombreEvaluacionAgrupadaComponente {
  idProcesoSeleccion: number;
  calificacionTotal: boolean;
  idEvaluacion: number;
  nombreEvaluacion: string;
  idGrupo: number;
  nombreGrupo: string;
  idComponente: number;
  nombreComponente: string;
  puntaje?: number;
  calificaPorCentil: boolean;
  calificaAgrupadoNoIndependiente: boolean;
  idProcesoSeleccionRango: number;
  esCalificable: boolean;
}
interface GridEEEtapaProcesoSeleccion {
  nroOrden: number;
  nombre: string;
}

interface ConfigurarProcesoSeleccionAct {
  id: number;
  nombre: string;
  idPuestoTrabajo: number;
  puestoTrabajo: string;
  idSede: number;
  sede: string;
  codigo: number;
  url: string;
  activo: boolean;
  fechaInicioProceso: Date;
  fechaFinProceso: Date;
}
@Component({
  selector: 'app-configurar-proceso-seleccion',
  templateUrl: './configurar-proceso-seleccion.component.html',
  styleUrls: ['./configurar-proceso-seleccion.component.scss'],
})
export class ConfigurarProcesoSeleccionComponent implements OnInit {
  @ViewChild('modalAsignacionEvaluacionesPostulante')
  modalAsignacionEvaluacionesPostulante: any;
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private formService: FormService
  ) {}

  isNew: boolean = false;

  enProcesoSolicitud: boolean = false;

  listaEtapas: ExamenAsignadoEtapa[] = [];
  listaEvaluaciones: EvaluacionAsignadoProcesos[] = [];
  listaEvaluacionesEvaluador: EvaluacionAsignadoProcesos[] = [];
  gridEvaluacionNoAsociado: KendoGrid<EstructuraBasica> =
    new KendoGrid<EstructuraBasica>();
  gridEvaluacionAsociado: KendoGrid<EvaluacionAsignadoProceso> =
    new KendoGrid<EvaluacionAsignadoProceso>();
  listaEvaluacionNoAsociado: number[] = [];
  listaEvaluacionAsociado: number[] = [];
  gridProcesoSeleccion: KendoGrid = new KendoGrid();
  gridEvaluacionPuntaje: KendoGrid = new KendoGrid();
  gridEvaluacionAsociadoEvaluador: KendoGrid = new KendoGrid();
  gridEvaluacionNoAsociadoEvaluador: KendoGrid<EstructuraBasica> =
    new KendoGrid<EstructuraBasica>();
  listaEvaluacionAsociadoEvaluadorDesasociar: number[] = [];
  listaEvaluacionAsociadoEvaluadorAsociar: number[] = [];
  gridProcesoSeleccionEvaluacionesPuntaje: KendoGrid = new KendoGrid();
  gridListaComponentes: KendoGrid = new KendoGrid();
  gridExamen: KendoGrid = new KendoGrid();
  gridProcesoSeleccionEvaluaciones: KendoGrid = new KendoGrid();
  gridEtapaProcesoSeleccion: KendoGrid = new KendoGrid();

  dataPuestoTrabajo: IComboBase1[] = [];
  dataExamen: IComboBase1[] = [];
  dataCriterioSeleccion: IComboBase1[] = [];
  dataProcesoSeleccionRango: IComboBase1[] = [];
  dataListaComponentes: NombreEvaluacionAgrupadaComponente[] = [];
  dataProcesoSedeTrabajo: IComboBase1[] = [];
  listaEtapa: IComboBase1[] = [];
  EtapaProcesoLista: ProcesoSeleccionEtapa[] = [];
  esNuevo: boolean = false;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  formConfiguracionProcesoSeleccion = this._formBuilder.group({
    activo: [null],
    codigo: [null],
    fechaFinProceso: [null],
    fechaInicioProceso: [null],
    idPuestoTrabajo: [null],
    idSede: [null],
    nombre: [null],
    puestoTrabajo: [null],
    sede: [null],
    url: [null],
  });
  formListaEvaluaciones: FormGroup = this._formBuilder.group({
    nombre: [null],
    idProcesoSelecion: [null],
  });

  ngOnInit(): void {
    this.obtener();
    this.configurarGrid();
    this.ObtenerCombos();
  }

  configurarFormularios(): void {
    this.formConfiguracionProcesoSeleccion = this._formBuilder.group({
      activo: [null],
      codigo: [null],
      fechaFinProceso: [null],
      fechaInicioProceso: [null],
      idPuestoTrabajo: [null],
      idSede: [null],
      nombre: [null],
      puestoTrabajo: [null],
      sede: [null],
      url: [null],
    });
  }

  clonar: boolean = false;
  insertarProcesoSeleccion(): void {
    this.enProcesoSolicitud = true;
    let listaEtapasAct;
    if (this.clonar == true) {
      listaEtapasAct = this.ProcesarEtapasProcesoClonar();
    } else {
      listaEtapasAct = this.ProcesarEtapasProceso();
    }

    const listaEvaluacionesAct = this.ProcesarEvaluaciones();
    const listaEvaluacionesEvaluadorAct = this.ProcesarEvaluacionesEvaluador();
    if (this.formConfiguracionProcesoSeleccion.valid) {
      const dto: ActualizarProcesoSeleccion = {
        ConfiguracionProcesoSeleccion: {
          nombre: this.formConfiguracionProcesoSeleccion.get('nombre')?.value,
          idPuestoTrabajo:
            this.formConfiguracionProcesoSeleccion.get('idPuestoTrabajo')
              ?.value,
          idSede: this.formConfiguracionProcesoSeleccion.get('idSede')?.value,
          codigo: this.formConfiguracionProcesoSeleccion.get('codigo')?.value,
          fechaInicioProceso: this.formConfiguracionProcesoSeleccion
            .get('fechaInicioProceso')
            ?.value?.toISOString(),
          fechaFinProceso: this.formConfiguracionProcesoSeleccion
            .get('fechaFinProceso')
            ?.value?.toISOString(),
          url: this.formConfiguracionProcesoSeleccion.get('url')?.value,
          sede: this.formConfiguracionProcesoSeleccion.get('sede')?.value,
          puestoTrabajo:
            this.formConfiguracionProcesoSeleccion.get('puestoTrabajo')?.value,
          activo: this.formConfiguracionProcesoSeleccion.get('activo').value
            ? true
            : false,
          id: 0,
        },
        listaEtapas: listaEtapasAct,
        listaEvaluaciones: listaEvaluacionesAct,
        listaEvaluacionesEvaluador: listaEvaluacionesEvaluadorAct,
      };

      this._integraService
        .postJsonResponse(
          `${constApiGestionPersonal.ConfiguracionProcesoSeleccionInsertar}`,
          dto
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.modalRef.close();
            this.obtener();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            this.enProcesoSolicitud = false;
            console.error('Error al insertar proceso de selección:', error);
            Swal.fire(
              'Error',
              'Ocurrió un error al guardar el proceso de selección.',
              'error'
            );
          },
        });
    } else {
      console.log('Formulario no válido');
    }
  }

  reestablecer(): void {
    this.gridEvaluacionNoAsociado.loadData();
    this.gridEvaluacionAsociado.loadData();
  }

  obtener() {
    this.gridProcesoSeleccion.loading = true;
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.ConfiguracionProcesoSeleccionObtenerProcesoSeleccion
      )
      .subscribe({
        next: (resp: HttpResponse<ConfigurarProcesoSeleccion[]>) => {
          this.gridProcesoSeleccion.data = resp.body;
          this.gridProcesoSeleccion.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridProcesoSeleccion.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerCombos() {
    this.gridProcesoSeleccion.loading = true;
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.ConfiguracionProcesoSeleccionObtenerCombosProcesoSeleccion
      )
      .subscribe({
        next: (resp: HttpResponse<CombosConfigurarProcesoSeleccion>) => {
          this.dataPuestoTrabajo = resp.body.listaPuestoTrabajo;
          this.dataProcesoSedeTrabajo = resp.body.listaSedeTrabajo;
          this.dataProcesoSeleccionRango = resp.body.listaProcesoSeleccionRango;
          this.dataCriterioSeleccion = resp.body.listaCriterioSeleccion;
          this.dataExamen = resp.body.listaExamen;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridProcesoSeleccion.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerExamen() {
    this.gridExamen.loading = true;
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.ConfiguracionProcesoSeleccionObtenerExamen
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.gridExamen.data = resp.body;
          this.gridExamen.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridExamen.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  dataItemTemp: CombosConfigurarProcesoSeleccion;
  dataItemTemp2: EtapaProcesoSeleccion;
  dataItemTemp3: ConfigurarProcesoSeleccion;
  dataItemTempPuntaje: NombreEvaluacionAgrupadaComponente;

  modalRef: any;

  abrirModalClonar(context: any, dataItem?: ConfigurarProcesoSeleccion) {
    this.gridEvaluacionAsociadoEvaluador.data = [];
    this.gridEtapaProcesoSeleccion.data = [];
    this.formConfiguracionProcesoSeleccion.reset();
    this.dataItemTemp3 = dataItem;
    this.isNew = true;
    this.dataItemTemp3 = dataItem;
    this.clonar = true;
    this.asignarValoresToFormProcesoSeleccion(dataItem);
    this.obtenerEvaluaciones(dataItem.id);
    this.ObtenerExamenesNoAsociados(dataItem.id);
    this.ObtenerExamenesAsociados(dataItem.id);
    this.ObtenerEtapaProcesoSeleccion(dataItem.id);
    // this.asignarValoresToForm(dataItem);

    this.modalRef = this._modalService.open(context, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
  }
  abrirModalNuevo(
    context: any,
    isNew: boolean,
    dataItem?: ConfigurarProcesoSeleccion
  ) {
    this.gridEvaluacionAsociadoEvaluador.data = [];
    this.gridEvaluacionAsociado.data = [];
    this.clonar = false;
    this.gridEvaluacionNoAsociadoEvaluador.data = [];
    this.gridEvaluacionNoAsociado.data = [];
    this.listaEtapa = [];
    this.gridEtapaProcesoSeleccion.data = [];
    this.isNew = isNew;
    this.formConfiguracionProcesoSeleccion.reset();

    if (!isNew) {
      this.dataItemTemp3 = dataItem;
      this.asignarValoresToFormProcesoSeleccion(dataItem);
      this.obtenerEvaluaciones(dataItem.id);
      this.ObtenerExamenesNoAsociados(dataItem.id);
      this.ObtenerExamenesAsociados(dataItem.id);
      this.ObtenerEtapaProcesoSeleccion(dataItem.id);
      // this.asignarValoresToForm(dataItem);
    } else {
      this.dataItemTemp = null;
      this.obtenerEvaluaciones(0);
      this.ObtenerExamenesNoAsociados(0);
      this.ObtenerExamenesAsociados(0);
    }
    this.modalRef = this._modalService.open(context, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
  }
  modalRefAsignar: NgbModalRef = null;
  abrirModalAsignar(dataItem?: CombosConfigurarProcesoSeleccion) {
    this.modalRefAsignar = this._modalService.open(
      this.modalAsignacionEvaluacionesPostulante,
      {
        backdrop: 'static',
        size: 'xl',
        // fullscreen: 'xxl',
      }
    );
  }
  cerrarModalAsignar(): void {
    this.modalRefAsignar.close();
  }
  ObtenerExamenesNoAsociados(idProcesoSeleccion: number) {
    this.gridEvaluacionNoAsociado.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ConfiguracionProcesoSeleccionObtenerExamenesNoAsociados}/${idProcesoSeleccion}`
      )
      .subscribe({
        next: (resp: HttpResponse<EstructuraBasica[]>) => {
          this.gridEvaluacionNoAsociado.data = resp.body;
          this.gridEvaluacionNoAsociado.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridEvaluacionNoAsociado.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  ObtenerExamenesAsociados(idProcesoSeleccion: number) {
    this.gridEvaluacionAsociado.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ConfiguracionProcesoSeleccionObtenerExamenesAsociados}/${idProcesoSeleccion}`
      )
      .subscribe({
        next: (resp: HttpResponse<EvaluacionAsignadoProceso[]>) => {
          this.gridEvaluacionAsociado.data = resp.body;
          this.asociarEvaluacionPostulante();
          this.gridEvaluacionAsociado.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridEvaluacionAsociado.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  ObtenerEtapaProcesoSeleccion(idProcesoSeleccion: number) {
    this.gridEtapaProcesoSeleccion.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ConfiguracionProcesoSeleccionObtenerEtapaProcesoSeleccion}/${idProcesoSeleccion}`
      )
      .subscribe({
        next: (resp: HttpResponse<EtapaProcesoSeleccion[]>) => {
          this.gridEtapaProcesoSeleccion.data = resp.body;
          this.gridEtapaProcesoSeleccion.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridEtapaProcesoSeleccion.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  asignarValoresToFormProcesoSeleccion(dataItem: ConfigurarProcesoSeleccion) {
    if (this.clonar == true) {
      this.formConfiguracionProcesoSeleccion.get('nombre').setValue('');
      this.formConfiguracionProcesoSeleccion.get('codigo').setValue('');
    } else {
      this.formConfiguracionProcesoSeleccion
        .get('nombre')
        .setValue(dataItem.nombre);
      this.formConfiguracionProcesoSeleccion
        .get('codigo')
        .setValue(dataItem.codigo);
    }
    this.formConfiguracionProcesoSeleccion
      .get('idPuestoTrabajo')
      .setValue(dataItem.idPuestoTrabajo);

    this.formConfiguracionProcesoSeleccion
      .get('puestoTrabajo')
      .setValue(dataItem.puestoTrabajo);
    this.formConfiguracionProcesoSeleccion
      .get('idSede')
      .setValue(dataItem.idSede);
    this.formConfiguracionProcesoSeleccion.get('sede').setValue(dataItem.sede);

    this.formConfiguracionProcesoSeleccion
      .get('activo')
      .setValue(dataItem.activo ? 'si' : 'no');
    this.formConfiguracionProcesoSeleccion
      .get('fechaInicioProceso')
      .setValue(new Date(dataItem.fechaInicioProceso));
    this.formConfiguracionProcesoSeleccion
      .get('fechaFinProceso')
      .setValue(new Date(dataItem.fechaFinProceso));
  }

  /* --------------------- Configurar las grillas  --------------------------------*/
  configurarGrid() {
    this.gridEtapaProcesoSeleccion.habilitarEstadoNewRow = true;
    this.gridEvaluacionAsociado.habilitarEstadoNewRow = true;
    this.gridEvaluacionAsociadoEvaluador.habilitarEstadoNewRow = true;
    this.gridEtapaProcesoSeleccion.formGroup = this._formBuilder.group({
      nombre: [null],
      nroOrden: [null],
    });

    this.gridEtapaProcesoSeleccion.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridEtapaProcesoSeleccion.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridEtapaProcesoSeleccion.data.splice(resp.index, 1);
          this.gridEtapaProcesoSeleccion.data = [
            ...this.gridEtapaProcesoSeleccion.data,
          ];
        }
      });
    });
    this.gridEtapaProcesoSeleccion.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          nombre: number;
          nroOrden: string;
        };
        const index = this.gridEtapaProcesoSeleccion.data.findIndex(
          (detalles) => detalles.id === resp.dataItem.id
        );
        if (index !== -1) {
          this.gridEtapaProcesoSeleccion.data[index].nombre = valorForm.nombre;
          this.gridEtapaProcesoSeleccion.data[index].orden = valorForm.nroOrden;
        }
      },
    });

    this.gridEtapaProcesoSeleccion.saveEvent$.subscribe((resp) => {
      let valorForm =
        resp.formGroup.getRawValue() as GridEEEtapaProcesoSeleccion;

      let datafiltro = this.gridEtapaProcesoSeleccion.data.filter(
        (x) => x.id < 0
      );
      let id = (datafiltro.length + 1) * -1;

      let item: EtapaProcesoSeleccion = {
        id: id,
        idProcesoSeleccion: this.isNew ? 0 : this.dataItemTemp3.id,
        nombre: valorForm.nombre,
        nroOrden: valorForm.nroOrden,
      };

      this.gridEtapaProcesoSeleccion.data = [
        item,
        ...this.gridEtapaProcesoSeleccion.data,
      ];
      this.EtapaProcesoLista = this.gridEtapaProcesoSeleccion.data;
    });

    this.gridEvaluacionAsociado.formGroup = this._formBuilder.group({
      idProcesoSeleccionEtapa: [null, Validators.required],
    });

    this.gridEvaluacionAsociado.cellClickEvent$.subscribe((resp) => {
      if (resp.column.field === 'idProcesoSeleccionEtapa') {
        this.gridEvaluacionAsociado.formGroup.patchValue({
          idProcesoSeleccionEtapa: resp.dataItem.idProcesoSeleccionEtapa,
        });
      }
    });

    this.gridEvaluacionAsociado.cellCloseEvent$.subscribe((resp) => {
      const formData = resp.formGroup.value;
      resp.dataItem.idProcesoSeleccionEtapa = formData.idProcesoSeleccionEtapa;
      this.gridEvaluacionAsociado.data = [...this.gridEvaluacionAsociado.data];
    });

    /*Evaluador Examenes Asignados */

    this.gridEvaluacionAsociadoEvaluador.formGroup = this._formBuilder.group({
      idProcesoSeleccionEtapa: [null, Validators.required],
    });

    this.gridEvaluacionAsociadoEvaluador.cellClickEvent$.subscribe((resp) => {
      if (resp.column.field === 'idProcesoSeleccionEtapa') {
        this.gridEvaluacionAsociadoEvaluador.formGroup.patchValue({
          idProcesoSeleccionEtapa: resp.dataItem.idProcesoSeleccionEtapa,
        });
      }
    });

    this.gridEvaluacionAsociadoEvaluador.cellCloseEvent$.subscribe((resp) => {
      const formData = resp.formGroup.value;
      resp.dataItem.idProcesoSeleccionEtapa = formData.idProcesoSeleccionEtapa;
      this.gridEvaluacionAsociadoEvaluador.data = [
        ...this.gridEvaluacionAsociadoEvaluador.data,
      ]; // Refresca la vista
    });

    let countId = 0;
  }
  onDropdownValueChange(value: any, formGroup: FormGroup) {
    formGroup.patchValue({
      idProcesoSeleccionEtapa: value,
    });
  }

  public onValueChangeIdEtapa(
    id: number,
    dataItem?: EvaluacionAsignadoProceso
  ) {
    if (id != null) {
      this.EtapaProcesoLista = this.EtapaProcesoLista.filter(
        (x) => (x.id = id)
      );
    } else {
      this.EtapaProcesoLista = [];
    }
  }

  ObtenerNombreEtapa(idProcesoSeleccionEtapa: number) {
    console.log('idProcesoSeleccionEtapa : ', idProcesoSeleccionEtapa);
    let busqueda = this.EtapaProcesoLista.find(
      (x: any) => x.id === idProcesoSeleccionEtapa
    );
    if (busqueda != null) {
      return busqueda.nombre;
    } else {
      return 'Seleccionar';
    }
  }

  asociarEvaluacionPostulante(): void {
    const modulosAasociar: EstructuraBasica[] =
      this.gridEvaluacionNoAsociado.data.filter((x: EstructuraBasica) =>
        this.listaEvaluacionAsociado.includes(x.id)
      );

    const modulosPermanecen: EstructuraBasica[] =
      this.gridEvaluacionNoAsociado.data.filter(
        (x: EstructuraBasica) => !this.listaEvaluacionAsociado.includes(x.id)
      );

    let count = this.gridEvaluacionAsociado.data.length;

    modulosAasociar.forEach((x) => {
      count += 1;
      this.gridEvaluacionAsociado.data.push({
        id: x.id,
        idProcesoSeleccion: 0,
        idEvaluacion: x.id,
        nroOrden: count,
        nombre: x.nombre,
        esCalificadoPorPostulante: x.esCalificadoPorPostulante,
        idProcesoSeleccionEtapa: 0,
      });
    });

    this.gridEvaluacionNoAsociado.data = modulosPermanecen;
    this.reestablecer();
  }

  asociarEvaluacionEvaluador(): void {
    const modulosAasociar: EstructuraBasica[] =
      this.gridEvaluacionNoAsociadoEvaluador.data.filter(
        (x: EstructuraBasica) =>
          this.listaEvaluacionAsociadoEvaluadorAsociar.includes(x.id)
      );

    const modulosPermanecen: EstructuraBasica[] =
      this.gridEvaluacionNoAsociadoEvaluador.data.filter(
        (x: EstructuraBasica) =>
          !this.listaEvaluacionAsociadoEvaluadorAsociar.includes(x.id)
      );

    let count = this.gridEvaluacionAsociadoEvaluador.data.length;

    modulosAasociar.forEach((x) => {
      count += 1;
      this.gridEvaluacionAsociadoEvaluador.data.push({
        id: x.id,
        idProcesoSeleccion: 0,
        idEvaluacion: x.id,
        nroOrden: count,
        nombre: x.nombre,
        esCalificadoPorPostulante: x.esCalificadoPorPostulante,
        idProcesoSeleccionEtapa: 0, // O el valor correspondiente
      });
    });

    this.gridEvaluacionNoAsociadoEvaluador.data = modulosPermanecen;
    this.reestablecer();
  }

  desasociarEvaluacionPostulante(): void {
    const modulosAdesasociar: EstructuraBasica[] =
      this.gridEvaluacionAsociado.data.filter((x: EstructuraBasica) =>
        this.listaEvaluacionNoAsociado.includes(x.id)
      );

    const modulosPermanecen: EvaluacionAsignadoProceso[] =
      this.gridEvaluacionAsociado.data.filter(
        (x: EvaluacionAsignadoProceso) =>
          !this.listaEvaluacionNoAsociado.includes(x.id)
      );

    modulosAdesasociar.forEach((x) => {
      this.gridEvaluacionNoAsociado.data.push({
        id: x.id,
        nombre: x.nombre,
        esCalificadoPorPostulante: x.esCalificadoPorPostulante,
      });
    });
    this.gridEvaluacionAsociado.data = modulosPermanecen;

    let count = 0;
    const currentData = [...this.gridEvaluacionAsociado.data];
    this.gridEvaluacionAsociado.data = [];

    currentData.forEach((element) => {
      count += 1;
      this.gridEvaluacionAsociado.data.push({
        ...element,
        nroOrden: count,
      });
    });

    this.reestablecer();
  }
  desasociarEvaluacionEvaluador(): void {
    const modulosAdesasociar: EstructuraBasica[] =
      this.gridEvaluacionAsociadoEvaluador.data.filter((x: EstructuraBasica) =>
        this.listaEvaluacionAsociadoEvaluadorDesasociar.includes(x.id)
      );

    const modulosPermanecen: EstructuraBasica[] =
      this.gridEvaluacionAsociadoEvaluador.data.filter(
        (x: EstructuraBasica) =>
          !this.listaEvaluacionAsociadoEvaluadorDesasociar.includes(x.id)
      );

    modulosAdesasociar.forEach((x) => {
      this.gridEvaluacionNoAsociadoEvaluador.data.push({
        id: x.id,
        nombre: x.nombre,
        esCalificadoPorPostulante: x.esCalificadoPorPostulante,
      });
    });

    this.gridEvaluacionAsociadoEvaluador.data = modulosPermanecen;

    let count = 0;
    const currentData = [...this.gridEvaluacionAsociadoEvaluador.data];
    this.gridEvaluacionAsociadoEvaluador.data = [];

    currentData.forEach((element) => {
      count += 1;
      this.gridEvaluacionAsociadoEvaluador.data.push({
        ...element,
        nroOrden: count,
      });
    });

    this.reestablecer();
  }
  obtenerEvaluaciones(idProcesoSeleccion: number): void {
    this.gridEvaluacionNoAsociado.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ConfiguracionProcesoSeleccionObtenerEvaluacionesAsociacion}/${idProcesoSeleccion}`
      )
      .subscribe({
        next: (resp: HttpResponse<Evaluaciones>) => {
          this.gridEvaluacionNoAsociado.data =
            resp.body.listaEvaluacionNoAsociado;
          this.gridEvaluacionNoAsociadoEvaluador.data =
            resp.body.listaEvaluacionNoAsociadoEvaluador;
          this.gridEvaluacionAsociado.data = resp.body.listaEvaluacionAsociado;
          this.gridEvaluacionAsociadoEvaluador.data =
            resp.body.listaEvaluacionAsociadoEvaluador;
          this.EtapaProcesoLista = resp.body.listaEtapa;
          this.gridEtapaProcesoSeleccion.data = resp.body.listaEtapa;

          this.gridEvaluacionNoAsociado.loading = false;
        },
        error: (err) => {
          this._alertaService.notificationWarning(
            `Surgio un error: ${err.error}`
          );

          this.gridEvaluacionNoAsociado.loading = false;
        },
      });
  }

  abrirModalConfiguracion(context: any, dataItem?: ConfigurarProcesoSeleccion) {
    this.gridEvaluacionAsociadoEvaluador.data = [];
    this.gridEvaluacionesPuntaje.data = [];
    this.dataItemTemp3 = dataItem;

    this.ObtenerEvaluacionPuntaje(dataItem.id);
    this.modalRef = this._modalService.open(context, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
  }

  gridEvaluacionesPuntaje =
    new KendoGrid<NombreEvaluacionesAgrupadaIndependiente>();

  getEvaluacionPuntajeById(
    idEvaluacion: number
  ): NombreEvaluacionAgrupadaComponente[] {
    let result = this.gridProcesoSeleccionEvaluaciones.data.filter(
      (item) => item.idEvaluacion === idEvaluacion
    );
    return result;
  }

  mostrarData: boolean = false;
  ObtenerEvaluacionPuntaje(idProcesoSeleccion: number): void {
    this.enProcesoSolicitud = true;
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ConfiguracionProcesoSeleccionObtenerEvaluacionPuntaje}/${idProcesoSeleccion}`
      )
      .subscribe({
        next: (resp: HttpResponse<EvaluacionPuntaje>) => {
          let data = resp.body.listaEvaluaciones.map((x) => {
            let item: NombreEvaluacionesAgrupadaIndependiente = {
              id: x.id,
              nombre: x.nombre,
              calificacionTotal: x.calificacionTotal,
              calificaAgrupadoNoIndependiente:
                x.calificaAgrupadoNoIndependiente,
              gridDetallePuntajeCalificacion:
                new KendoGrid<NombreEvaluacionAgrupadaComponente>(),
            };

            let dataCalificacion =
              resp.body.listaEvaluacionesPuntajeCalificacion.filter(
                (s) => s.idEvaluacion === x.id
              );
            dataCalificacion = dataCalificacion.map((z) => {
              let item2: NombreEvaluacionAgrupadaCalificacion = {
                idProcesoSeleccion: z.idProcesoSeleccion,
                calificacionTotal: z.calificacionTotal,
                idEvaluacion: z.idEvaluacion,
                nombreEvaluacion: z.nombreEvaluacion,
                idGrupo: z.idGrupo,
                nombreGrupo: z.nombreGrupo,
                idComponente: z.idComponente,
                nombreComponente: z.nombreComponente,
                puntaje: z.puntaje,
                calificaPorCentil: z.calificaPorCentil,
                calificaAgrupadoNoIndependiente:
                  z.calificaAgrupadoNoIndependiente,
                idProcesoSeleccionRango: z.idProcesoSeleccionRango,
                esCalificable: z.esCalificable,
                idRango: z.idProcesoSeleccionRango,
                rangoProcesoSeleccionRango: this.obtenerNombreProcesoRango(
                  z.idProcesoSeleccionRango
                ),

                gridPuntajeCalificacion:
                  new KendoGrid<NombreEvaluacionAgrupadaComponente>(),
              };

              item2.gridPuntajeCalificacion.data =
                resp.body.listacomponentes.filter(
                  (y) =>
                    y.idEvaluacion === z.idEvaluacion &&
                    y.idGrupo === z.idGrupo &&
                    y.nombreComponente !== null &&
                    y.nombreComponente.trim() !== ''
                );

              item2.gridPuntajeCalificacion.formGroup = this._formBuilder.group(
                {
                  idProcesoSeleccionRango: null,
                  puntaje: null,
                  esCalificable: null,
                  calificaPorCentil: null,
                }
              );

              item2.gridPuntajeCalificacion.updateEvent$.subscribe((resp) => {
                let valorFormulario2 = resp.formGroup.getRawValue();
                resp.dataItem.idProcesoSeleccionRango =
                  valorFormulario2.idProcesoSeleccionRango;
                resp.dataItem.rangoProcesoSeleccionRango =
                  this.obtenerNombreProcesoRango(
                    valorFormulario2.idProcesoSeleccionRango
                  );
                resp.dataItem.puntaje = valorFormulario2.puntaje;
                resp.dataItem.esCalificable = valorFormulario2.esCalificable;
                resp.dataItem.calificaPorCentil =
                  valorFormulario2.calificaPorCentil;
                resp.dataItem.editar = true;
                console.log('Componente modificado:', resp.dataItem);
              });

              return item2;
            });

            item.gridDetallePuntajeCalificacion.formGroup =
              this._formBuilder.group({
                idProcesoSeleccionRango: null,
                puntaje: null,
                esCalificable: null,
                calificaPorCentil: null,
              });
            item.gridDetallePuntajeCalificacion.updateEvent$.subscribe(
              (resp) => {
                let valorFormulario = resp.formGroup.getRawValue();
                resp.dataItem.idProcesoSeleccionRango =
                  valorFormulario.idProcesoSeleccionRango;
                resp.dataItem.rangoProcesoSeleccionRango =
                  this.obtenerNombreProcesoRango(
                    valorFormulario.idProcesoSeleccionRango
                  );
                resp.dataItem.puntaje = valorFormulario.puntaje;
                resp.dataItem.esCalificable = valorFormulario.esCalificable;
                resp.dataItem.calificaPorCentil =
                  valorFormulario.calificaPorCentil;
                resp.dataItem.editar = true;
                // Object.assign(resp.dataItem, valorFormulario)

                if (resp.dataItem.calificaPorCentil) {
                  resp.dataItem.gridPuntajeCalificacion.data.forEach(
                    (componente) => {
                      componente.calificaPorCentil = true;
                      componente.editar = true;
                    }
                  );

                  resp.dataItem.gridPuntajeCalificacion.data = [
                    ...resp.dataItem.gridPuntajeCalificacion.data,
                  ];
                }
              }
            );

            item.gridDetallePuntajeCalificacion.data = dataCalificacion;

            return item;
          });

          this.gridEvaluacionesPuntaje.data = data;
          this.enProcesoSolicitud = false;
        },
        error: (err) => {
          this._alertaService.notificationWarning(
            `Surgió un error: ${err.error}`
          );
          this.gridEvaluacionesPuntaje.loading = false;
          this.enProcesoSolicitud = false;
        },
      });
  }

  obtenerNombreProcesoRango(idProcesoSeleccionRango: number) {
    let item = this.dataProcesoSeleccionRango.find(
      (x) => x.id == idProcesoSeleccionRango
    );
    if (item != null) {
      return item.nombre;
    }
    return null;
  }

  public showOnlyBeveragesDetails(dataItem: any): boolean {
    return dataItem.idEvaluacion == 55;
  }

  // procesarPuntajeComponente() {
  //   let listaFinal: NombreEvaluacionAgrupadaC[] = [];
  //   let calificarCentil : boolean = false;
  //   this.gridEvaluacionesPuntaje.data.forEach((x) => {
  //     let itemsSubPadre = x.gridDetallePuntajeCalificacion.data
  //     .map((n) => {
  //         calificarCentil = n.calificaPorCentil;
  //         let item: NombreEvaluacionAgrupadaC = {
  //           idProcesoSeleccion: n.idProcesoSeleccion,
  //           calificacionTotal: n.calificacionTotal,
  //           idEvaluacion: n.idEvaluacion,
  //           nombreEvaluacion: n.nombreEvaluacion,
  //           idGrupo: n.idGrupo,
  //           nombreGrupo: n.nombreGrupo,
  //           idComponente: n.idComponente,
  //           nombreComponente: n.nombreComponente,
  //           puntaje:n.puntaje? n.puntaje : null,
  //           calificaPorCentil: n.calificaPorCentil,
  //           calificaAgrupadoNoIndependiente: n.calificaAgrupadoNoIndependiente,
  //           idProcesoSeleccionRango: n.idProcesoSeleccionRango,
  //           esCalificable: n.esCalificable,
  //         };
  //         return item;
  //       });
  //     listaFinal = [...listaFinal, ...itemsSubPadre];

  //     x.gridDetallePuntajeCalificacion.data.forEach((z) => {
  //       let items2 = z.gridPuntajeCalificacion.data
  //         .filter((y) => y.editar == true)
  //         .map((n) => {
  //           let item: NombreEvaluacionAgrupadaC = {
  //             idProcesoSeleccion: n.idProcesoSeleccion,
  //             calificacionTotal: n.calificacionTotal,
  //             idEvaluacion: n.idEvaluacion,
  //             nombreEvaluacion: n.nombreEvaluacion,
  //             idGrupo: n.idGrupo,
  //             nombreGrupo: n.nombreGrupo,
  //             idComponente: n.idComponente,
  //             nombreComponente: n.nombreComponente,
  //             puntaje: n.puntaje? n.puntaje : null,
  //             calificaPorCentil: calificarCentil,
  //             calificaAgrupadoNoIndependiente:
  //               n.calificaAgrupadoNoIndependiente,
  //             idProcesoSeleccionRango: n.idProcesoSeleccionRango,
  //             esCalificable: n.esCalificable,
  //           };
  //           return item;
  //         });
  //       listaFinal = [...listaFinal, ...items2];
  //     });
  //   });
  //   let item = {
  //     ListaPuntaje: listaFinal,
  //   };
  //   return item;
  // }

  procesarPuntajeComponente() {
    let listaFinal: NombreEvaluacionAgrupadaC[] = [];
    let calificarCentil: boolean = false;
    this.gridEvaluacionesPuntaje.data.forEach((x) => {
      let itemsSubPadre = x.gridDetallePuntajeCalificacion.data
        .filter((y) => y.editar == true)
        .map((n) => {
          let item: NombreEvaluacionAgrupadaC = {
            idProcesoSeleccion: n.idProcesoSeleccion,
            calificacionTotal: n.calificacionTotal,
            idEvaluacion: n.idEvaluacion,
            nombreEvaluacion: n.nombreEvaluacion,
            idGrupo: n.idGrupo,
            nombreGrupo: n.nombreGrupo,
            idComponente: n.idComponente,
            nombreComponente: n.nombreComponente,
            puntaje: n.puntaje ? n.puntaje : null,
            calificaPorCentil: n.calificaPorCentil,
            calificaAgrupadoNoIndependiente: n.calificaAgrupadoNoIndependiente,
            idProcesoSeleccionRango: n.idProcesoSeleccionRango,
            esCalificable: n.esCalificable,
          };
          return item;
        });
      let nombresGrupo: string[] = itemsSubPadre.map(
        (item) => item.nombreGrupo
      );

      // Agregar elementos únicos de itemsSubPadre a listaFinal
      itemsSubPadre.forEach((item) => {
        if (!listaFinal.some((existing) => this.esDuplicado(existing, item))) {
          listaFinal.push(item);
        }
      });

      x.gridDetallePuntajeCalificacion.data.forEach((z) => {
        let items2 = z.gridPuntajeCalificacion.data
          .filter((y) => y.editar === true)
          .map((n) => {
            let item: NombreEvaluacionAgrupadaC = {
              idProcesoSeleccion: n.idProcesoSeleccion,
              calificacionTotal: n.calificacionTotal,
              idEvaluacion: n.idEvaluacion,
              nombreEvaluacion: n.nombreEvaluacion,
              idGrupo: n.idGrupo,
              nombreGrupo: n.nombreGrupo,
              idComponente: n.idComponente,
              nombreComponente: n.nombreComponente,
              puntaje: n.puntaje ? n.puntaje : null,
              calificaPorCentil: n.calificaPorCentil, // Valor por defecto
              calificaAgrupadoNoIndependiente:
                n.calificaAgrupadoNoIndependiente,
              idProcesoSeleccionRango: n.idProcesoSeleccionRango,
              esCalificable: n.esCalificable,
            };

            // Sincronizar calificaPorCentil con itemsSubPadre si nombreGrupo coincide
            let match = itemsSubPadre.find(
              (sub) => sub.nombreGrupo === item.nombreGrupo
            );
            if (match) {
              item.calificaPorCentil = match.calificaPorCentil;
            }

            return item;
          });

        // Agregar elementos únicos de items2 a listaFinal
        items2.forEach((item) => {
          if (
            !listaFinal.some((existing) => this.esDuplicado(existing, item))
          ) {
            listaFinal.push(item);
          }
        });
      });
    });
    let item = {
      ListaPuntaje: listaFinal,
    };
    return item;
  }

  esDuplicado(
    a: NombreEvaluacionAgrupadaC,
    b: NombreEvaluacionAgrupadaC
  ): boolean {
    return (
      a.idProcesoSeleccion === b.idProcesoSeleccion &&
      a.idEvaluacion === b.idEvaluacion &&
      a.idGrupo === b.idGrupo &&
      a.idComponente === b.idComponente
    );
  }
  /* --------------------------Actualizar Puntjae de ProcesoSeleccion --------------------------------------------- */
  actualizarConfigurarProcesoSeleccion() {
    const materialAccion = this.procesarPuntajeComponente();
    this.gridEvaluacionesPuntaje.loading = true;
    this.enProcesoSolicitud = true;
   
    this._integraService
      .putJsonResponse(
        constApiGestionPersonal.ConfiguracionProcesoSeleccionActualizarProcesoSeleccionConfiguracionCalificacion,
        JSON.stringify(materialAccion)
      )
      .subscribe({
        next: (resp: HttpResponse<PuntajeEvaluacionAgrupadaComponenteDTO>) => {
          this.gridEvaluacionesPuntaje.loading = false;
          this.enProcesoSolicitud = false;
          this.modalRef.close();
          this.obtener();
          this._alertaService.mensajeExitoso();
        },
        error: (error) => {
          console.log(error);
          this.enProcesoSolicitud = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /* --------------------------Actualizar Puntjae de ProcesoSeleccion --------------------------------------------- */

  ProcesarProcesoSeleccion(): ConfigurarProcesoSeleccion {
    let proceso: ConfigurarProcesoSeleccionAct = {
      id: this.isNew ? 0 : this.dataItemTemp3.id,
      nombre: this.formConfiguracionProcesoSeleccion.get('nombre')?.value,
      idPuestoTrabajo:
        this.formConfiguracionProcesoSeleccion.get('idPuestoTrabajo')?.value,
      puestoTrabajo:
        this.formConfiguracionProcesoSeleccion.get('puestoTrabajo')?.value,
      idSede: this.formConfiguracionProcesoSeleccion.get('idSede')?.value,
      sede: this.formConfiguracionProcesoSeleccion.get('sede')?.value,
      codigo: this.formConfiguracionProcesoSeleccion.get('codigo')?.value,
      url: this.formConfiguracionProcesoSeleccion.get('url')?.value,
      activo: this.formConfiguracionProcesoSeleccion.get('activo').value
        ? true
        : false,
      fechaInicioProceso: this.formConfiguracionProcesoSeleccion
        .get('fechaInicioProceso')
        ?.value?.toISOString(),
      fechaFinProceso: this.formConfiguracionProcesoSeleccion
        .get('fechaFinProceso')
        ?.value?.toISOString(),
    };

    return proceso;
  }

  ProcesarProcesoSeleccionClonar(): ConfigurarProcesoSeleccion {
    let proceso: ConfigurarProcesoSeleccionAct = {
      id: 0,
      nombre: '',
      idPuestoTrabajo: this.dataItemTemp3.idPuestoTrabajo,
      puestoTrabajo: this.dataItemTemp3.puestoTrabajo,
      idSede: this.dataItemTemp3.idSede,
      sede: this.dataItemTemp3.sede,
      codigo: this.dataItemTemp3.codigo,
      url: this.dataItemTemp3.url,
      activo: this.dataItemTemp3.activo,
      fechaInicioProceso: this.dataItemTemp3.fechaInicioProceso,
      fechaFinProceso: this.dataItemTemp3.fechaFinProceso,
    };

    return proceso;
  }
  ProcesarEtapasProceso() {
    let itemResult = this.gridEtapaProcesoSeleccion.data.map((y) => {
      let item: EtapaProcesoSeleccionActualizar = {
        id: y.id,
        idProcesoSeleccion: y.idProcesoSeleccion,
        nroOrden: y.nroOrden,
        nombre: y.nombre,
      };
      return item;
    });

    return itemResult;
  }
  ProcesarEtapasProcesoClonar() {
    let count = 0;
    let itemResult = this.gridEtapaProcesoSeleccion.data.map((y) => {
      count++;
      let item: EtapaProcesoSeleccionActualizar = {
        id: count * -1,
        idProcesoSeleccion: y.idProcesoSeleccion,
        nroOrden: y.nroOrden,
        nombre: y.nombre,
      };
      return item;
    });

    return itemResult;
  }
  ProcesarEvaluaciones() {
    console.log('Crear Evaluacion:  ', this.gridEvaluacionAsociado.data);
    let itemResult = this.gridEvaluacionAsociado.data.map((y) => {
      let item: EvaluacionAsignadoProceso = {
        id: y.id,
        idProcesoSeleccion: y.idProcesoSeleccion,
        idEvaluacion: y.idEvaluacion,
        nroOrden: y.nroOrden,
        nombre: y.nombre,
        esCalificadoPorPostulante: y.esCalificadoPorPostulante,
        idProcesoSeleccionEtapa: y.idProcesoSeleccionEtapa,
      };
      return item;
    });

    return itemResult;
  }
  ProcesarEvaluacionesEvaluador() {
    let itemResult = this.gridEvaluacionAsociadoEvaluador.data.map((y) => {
      let item: EvaluacionAsignadoProceso = {
        id: y.id,
        idProcesoSeleccion: y.idProcesoSeleccion,
        idEvaluacion: y.idEvaluacion,
        nroOrden: y.nroOrden,
        nombre: y.nombre,
        esCalificadoPorPostulante: y.esCalificadoPorPostulante,
        idProcesoSeleccionEtapa: y.idProcesoSeleccionEtapa,
      };
      return item;
    });

    return itemResult;
  }

  actualizarProcesoSeleccion() {
    this.enProcesoSolicitud = true;
    const configuracionProcesoSeleccionAct = this.ProcesarProcesoSeleccion();
    const listaEtapasAct = this.ProcesarEtapasProceso();
    const listaEvaluacionesAct = this.ProcesarEvaluaciones();
    const listaEvaluacionesEvaluadorAct = this.ProcesarEvaluacionesEvaluador();
    let jsonEnvio: ActualizarProcesoSeleccion = {
      ConfiguracionProcesoSeleccion: configuracionProcesoSeleccionAct,
      listaEtapas: listaEtapasAct,
      listaEvaluaciones: listaEvaluacionesAct,
      listaEvaluacionesEvaluador: listaEvaluacionesEvaluadorAct,
    };
    this._integraService
      .putJsonResponse(
        constApiGestionPersonal.ConfiguracionProcesoSeleccionActualizar,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<ActualizarProcesoSeleccion>) => {
          this.enProcesoSolicitud = false;
          this.modalRef.close();
          this.obtener();
          this._alertaService.mensajeExitoso();
        },
        error: (error) => {
          console.log(error);
          this.enProcesoSolicitud = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
}

import { ValidatorFn } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { FormService } from '@shared/services/form.service';
import {
  constApiGestionPersonal,
  constApiPlanificacion,
} from '@environments/constApi';
import {
  ComboPuestoTrabajo,
  FiltroIdNombrePKDTO,
  PerfilPuestoTrabajoInsertar,
  PuestoFuncion,
  PuestoTrabajo,
  PuestoTrabajoInsertar,
  PuestoTrabajoRelacionado,
  ReporteFuncion,
  CursoComplementario,
  ExamenesObtener,
  PuestoTrabajoRelacionCompuestoDTO,
  PuestoTrabajoNombreEvaluacionesAgrupadaIndependienteDTO,
  PuestoTrabajoNombreEvaluacionAgrupadaComponenteDTO,
  PuestoTrabajoNombreEvaluacionAgrupada,
  Experiencia,
  CaracteristicasPersonales,
  FormacionAcademica,
  PuestoTrabajoVersiones,
  InterfazModulo,
  PuestoTrabajoPuntajeEvaluacionAgrupadaComponente,
  PuestoTrabajoFuncion,
  PuestoTrabajoCursoComplementario,
  PuestoTrabajoFormacionAcademica,
  AsignarInterfazDTO,
  DataAprobacion,
} from './../../models/PuestoTrabajo';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

interface FormPuestoTabajo {
  id: number;
  nombre: string;
  idPersonalAreaTrabajo: number;
}
interface FormPerfilPuestoTabajo {
  id: number;
  descripcion: string;
  objetivo: string;
}
interface GridPuestoDependencia {
  id: number;
  nombre: string;
}
interface GridPuestoRelacion {
  id: number;
  idPerfilPuestoTrabajo: number;
  listaPuestoDependencia: FiltroIdNombrePKDTO[];
  listaPuestoRelacionInterna: FiltroIdNombrePKDTO[];
  listaPuestoACargo: FiltroIdNombrePKDTO[];
}
interface GridFuncionPuesto {
  id: number;
  idPerfilPuestoTrabajo: number;
  nroOrden: number;
  funcion: string;
  idPersonalTipoFuncion: number;
  personalTipoFuncion: string;
  idFrecuenciaPuestoTrabajo: number;
  frecuenciaPuestoTrabajo: string;
  version: number;
}
interface GridReportePuesto {
  nroOrden: number;
  reporte: string;
  idFrecuenciaPuestoTrabajo: number;
  frecuenciaPuestoTrabajo: string;
}
interface GridCursoComplementario {
  id: number;
  idPerfilPuestoTrabajo: number;
  idTipoCompetenciaTecnica: number;
  idCompetenciaTecnica: number;
  idNivelCompetenciaTecnica: number;
  tipoCompetenciaTecnica: string;
  competenciaTecnica: string;
  nivelCompetenciaTecnica: string;
  version?: string;
}
interface GridExperiencia {
  idExperiencia: number;
  idTipoExperiencia: number;
  nroPeriodo: number;
  idPeriodo: number;
  tipoExperiencia: string;
  experiencia: string;
  periodo: string;
}

interface GridCaracteristicasPersonales {
  idEdadMin: number;
  idEdadMax: number;
  idExperiencia: number;
  idEstadoCivil: number;
  idPerfilPuestoTrabajo: number;
  id: number;
  sexo: string;
  idSexo: number;
  estadoCivil: string;
}

interface GridFormacionAcademica {
  id: number;
  idPerfilPuestoTrabajo: number;
  idTipoFormacion: number[];
  idNivelEstudio: number[];
  idAreaFormacion: number[];
  idCentroEstudio: number[];
  idGradoEstudio: number[];
}

@Component({
  selector: 'app-puesto-trabajo',
  templateUrl: './puesto-trabajo.component.html',
  styleUrls: ['./puesto-trabajo.component.scss'],
})
export class PuestoTrabajoComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private formService: FormService
  ) {}
  ngOnInit(): void {
    this.obtener();
    this.obtenerCombos();
    this.configurarGrid();
    this.obtenerUsuarioAprobacion();
  }
  isNew: boolean = false;
  UsuarioAprobacion: any;
  enProcesoSolicitud: boolean = false;
  DataAreaTrabajo: IComboBase1[] = [];
  DataPuestoTrabajo: IComboBase1[] = [];
  DataTipoFuncion: IComboBase1[] = [];
  DataTipoFrecuencia: IComboBase1[] = [];
  DataTipoCursoComplementario: IComboBase1[] = [];
  DataCursoComplementario: IComboBase1[] = [];
  DataNivelCursoComplementario: IComboBase1[] = [];
  DataPuestoTrabajoRelacion: IComboBase1[] = [];
  DataExperiencia: IComboBase1[] = [];
  DataTipoExperiencia: IComboBase1[] = [];
  DataTipoFormacion: IComboBase1[] = [];
  DataNivelFormacion: IComboBase1[] = [];
  DataPeriodo: IComboBase1[] = [];
  DataSexo: IComboBase1[] = [];
  DataCombo: ComboPuestoTrabajo;
  DataAreaFormacion: IComboBase1[] = [];
  DataCentroEstudio: IComboBase1[] = [];
  DataEstadoFormacion: IComboBase1[] = [];
  DataEstadoCivil: IComboBase1[] = [];
  DataRango: IComboBase1[] = [];
  ListaPuestoTrabajo: IComboBase1[] = [];
  ListaAreaTrabajo: IComboBase1[] = [];
  dataItemModulo: PuestoTrabajo;
  dataItemListaPuestoDependencia: PerfilPuestoTrabajoInsertar;
  gridPuestoTrabajo: KendoGrid = new KendoGrid();
  gridFuncionPuesto: KendoGrid = new KendoGrid();
  gridReportePuesto: KendoGrid = new KendoGrid();
  gridCursoComplementario: KendoGrid = new KendoGrid();
  gridExperienciaLaboral: KendoGrid = new KendoGrid();
  gridRelacionesPuestoTrabajo: KendoGrid = new KendoGrid();
  gridCaracteristicasPersonales: KendoGrid = new KendoGrid();
  gridEvaluacionPuntaje: KendoGrid = new KendoGrid();
  gridFormacionAcademica: KendoGrid = new KendoGrid();
  gridEditarEvaluaciones: KendoGrid = new KendoGrid();
  gridEditarEvaluacionesFiltrado: KendoGrid = new KendoGrid();
  gridPuestoTrabajoVersiones: KendoGrid = new KendoGrid();
  gridAsignacionInterfaz: KendoGrid = new KendoGrid();
  DataUsuarioAprobacion: DataAprobacion[];
  esUsuarioAprobacionTmp: boolean = false;
  idPerfilPuestoTrabajoTmp: number = 0;
  modalRef: any;
  dataItemPuestoTrabajoTmp: PuestoTrabajo;
  formDatosPuestoTrabajo: FormGroup = this._formBuilder.group({
    nombre: [null, Validators.required],
    idPersonalAreaTrabajo: null,
  });
  formPerfilPuestoTrabajo: FormGroup = this._formBuilder.group({
    descripcion: [null, Validators.required],
    objetivo: [null, Validators.required],
  });
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  listaPeriodo: IComboBase1[] = [
    { id: 1, nombre: 'Mes' },
    { id: 2, nombre: 'Año' },
  ];
  obtener() {
    this.gridPuestoTrabajo.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.PuestoTrabajoObtener)
      .subscribe({
        next: (resp: HttpResponse<PuestoTrabajo[]>) => {
          this.gridPuestoTrabajo.data = resp.body;
          this.gridPuestoTrabajo.loading = false;
          this.DataPuestoTrabajo = resp.body;
          this.ListaPuestoTrabajo = resp.body;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridPuestoTrabajo.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**Modals para Edicion/Eliminacion/Informacion */
  abrirModalNuevo(context: any, isNew: boolean, dataItem?: PuestoTrabajo) {
    this.isNew = isNew;
    this.formDatosPuestoTrabajo.reset();
    this.enProcesoSolicitud = false;
    if (!isNew) {
      this.dataItemPuestoTrabajoTmp = dataItem;
      this.asignarValoresToFormPuestoTrabajo(dataItem);
    } else {
      this.dataItemPuestoTrabajoTmp = null;
      this.formDatosPuestoTrabajo.get('nombre').enable();
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  abrirModalPerfilPuestoTrabajo(
    context: any,
    isNew: boolean,
    dataItem?: PuestoTrabajo
  ) {
    Swal.fire({
      title: 'Advertencia',
      text: 'Las modificaciones realizadas modificarán la solicitud de cambio ya existente. ¿Desea continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // El usuario confirmó, proceder a abrir el modal
        this.isNew = isNew;
        this.formPerfilPuestoTrabajo.reset();
        this.gridRelacionesPuestoTrabajo.data = [];
        this.gridFuncionPuesto.data = [];
        this.gridReportePuesto.data = [];
        this.gridCursoComplementario.data = [];
        this.gridExperienciaLaboral.data = [];
        this.gridCaracteristicasPersonales.data = [];
        this.gridPuestoTrabajoVersiones.data = [];
        this.gridFormacionAcademica.data = [];
        this.enProcesoSolicitud = false;
        if (!isNew) {
          this.dataItemPuestoTrabajoTmp = dataItem;
          this.obtenerPerfilPuestoTrabajo(0);
        } else {
          this.dataItemPuestoTrabajoTmp = null;
        }
        this.modalRef = this._modalService.open(context, {
          size: 'lg',
          backdrop: 'static',
          keyboard: false,
        });
      } else {
        // El usuario canceló, no hacer nada
      }
    });
  }

  abrirModalADI(context: any, isNew: boolean, dataItem?: PuestoTrabajo) {
    console.log('ADI : ', dataItem);
    this.isNew = isNew;
    this.formPerfilPuestoTrabajo.reset();
    this.gridAsignacionInterfaz.data = [];
    this.dataItemModulo = dataItem;
    this.ObtenerGridAsignacionInterfaz(dataItem.id);
    this.enProcesoSolicitud = false;
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
  abrirModalVersionPerfil(
    context: any,
    isNew: boolean,
    dataItem?: PuestoTrabajo
  ) {
    console.log(dataItem);
    this.isNew = isNew;
    this.encontrarDatoAprobacion(dataItem.id);
    this.idPerfilPuestoTrabajoTmp = dataItem.idPerfilPuestoTrabajo;
    this.gridRelacionesPuestoTrabajo.data = [];
    this.gridFuncionPuesto.data = [];
    this.gridReportePuesto.data = [];
    this.gridCursoComplementario.data = [];
    this.gridExperienciaLaboral.data = [];
    this.gridCaracteristicasPersonales.data = [];
    this.gridPuestoTrabajoVersiones.data = [];
    this.gridFormacionAcademica.data = [];
    this.formPerfilPuestoTrabajo.reset();
    this.enProcesoSolicitud = false;
    this.obtenerVersionesPerfil(dataItem.id);

    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }
  abrirModalPerfilPuestoTrabajoVersion(
    context: any,
    isNew: boolean,
    dataItem?: PuestoTrabajoVersiones
  ) {
    console.log(dataItem);
    this.isNew = isNew;

    this.formPerfilPuestoTrabajo.reset();
    this.enProcesoSolicitud = false;
    this.asignarValoresToForm(dataItem);
    this.obtenerDatos(dataItem.id);
    this.obtenerPerfilPuestoTrabajo(dataItem.id);
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  get puestoTrabajoForm(): FormPuestoTabajo {
    return this.formDatosPuestoTrabajo.getRawValue() as FormPuestoTabajo;
  }

  get perfilPuestoTrabajoForm(): FormPerfilPuestoTabajo {
    return this.formPerfilPuestoTrabajo.getRawValue() as FormPerfilPuestoTabajo;
  }

  obtenerCombos() {
    this._integraService
      .getJsonResponse(constApiGestionPersonal.PuestoTrabajoObtenerCombos)
      .subscribe({
        next: (resp: HttpResponse<ComboPuestoTrabajo>) => {
          this.DataCombo = resp.body;
          this.DataAreaTrabajo = resp.body.listaPersonalAreaTrabajo;
          this.DataTipoFuncion = resp.body.listaTipoFuncion;
          this.DataTipoFrecuencia = resp.body.listaFrecuenciaPuestoTrabajo;
          this.DataPuestoTrabajoRelacion = resp.body.listaPuestoTrabajo;
          this.ListaAreaTrabajo = resp.body.listaPersonalAreaTrabajo;
          this.DataTipoCursoComplementario =
            resp.body.listaTipoCompetenciaTecnica;
          this.DataCursoComplementario = resp.body.listaCompetenciaTecnica;
          this.DataNivelCursoComplementario =
            resp.body.listaNivelCompetenciaTecnica;
          this.DataExperiencia = resp.body.listaExperiencia;
          this.DataTipoExperiencia = resp.body.listaTipoExperiencia;
          this.DataPeriodo = this.listaPeriodo;
          this.DataSexo = resp.body.listaSexo;
          this.DataTipoFormacion = resp.body.listaTipoFormacion;
          this.DataNivelFormacion = resp.body.listaNivelEstudio;
          this.DataAreaFormacion = resp.body.listaAreaFormacion;
          this.DataCentroEstudio = resp.body.listaCentroEstudio;
          this.DataEstadoFormacion = resp.body.listaGradoEstudio;
          this.DataEstadoCivil = resp.body.listaEstadoCivil;
          this.DataRango = resp.body.listaRango;
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerVersionesPerfil(idPuestoTrabajo: number) {
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.PuestoTrabajoObtenerListaHistoricoPerfilPuestoTrabajo +
          '/' +
          idPuestoTrabajo
      )
      .subscribe({
        next: (resp: HttpResponse<PuestoTrabajoVersiones[]>) => {
          this.gridPuestoTrabajoVersiones.data = resp.body;
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  procesarPuestoTrabajo(): PuestoTrabajoInsertar {
    let PuestoTrabajoD: PuestoTrabajoInsertar = {
      id: this.isNew ? 0 : this.dataItemPuestoTrabajoTmp.id,
      nombre: this.puestoTrabajoForm.nombre,
      idPersonalAreaTrabajo: this.puestoTrabajoForm.idPersonalAreaTrabajo,
    };
    return PuestoTrabajoD;
  }
  DataCursoComplementarioAux: IComboBase1[] = [];
  DataTipoFuncionAux: IComboBase1[] = [];
  obtenerCursoComplementarioByTipo(id: any) {
    this.DataCursoComplementarioAux = [];
    this.DataCursoComplementario.forEach((element: any) => {
      if (element.idTipoCursoComplementario == id) {
        this.DataCursoComplementarioAux.push(element);
      }
    });
  }

  ObtenerDataTipoFuncion(id: number) {
    let busquedatipoFuncion = this.DataTipoFuncion.find((x: any) => x.id == id);
    if (busquedatipoFuncion != null) {
      return busquedatipoFuncion.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreFrecuencia(id: number) {
    let busquedafrecuencia = this.DataTipoFrecuencia.find(
      (x: any) => x.id == id
    );
    if (busquedafrecuencia != null) {
      return busquedafrecuencia.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreTipoCursoComplementario(id: number) {
    let busquedaTipoCursoComplementario =
      this.DataNivelCursoComplementario.find((x: any) => x.id == id);
    if (busquedaTipoCursoComplementario != null) {
      return busquedaTipoCursoComplementario.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreCursoComplementario(id: number) {
    let busquedaCursoComplementario = this.DataCursoComplementarioAux.find(
      (x: any) => x.id == id
    );
    if (busquedaCursoComplementario != null) {
      return busquedaCursoComplementario.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreNivelCursoComplementario(id: number) {
    let busquedaNivelCursoComplementario =
      this.DataNivelCursoComplementario.find((x: any) => x.id == id);
    if (busquedaNivelCursoComplementario != null) {
      return busquedaNivelCursoComplementario.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreExperiencia(id: number) {
    let busquedaExperiencia = this.DataExperiencia.find((x: any) => x.id == id);
    if (busquedaExperiencia != null) {
      return busquedaExperiencia.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerTipoExperiencia(id: number) {
    let busquedaTipoExperiencia = this.DataTipoExperiencia.find(
      (x: any) => x.id == id
    );
    if (busquedaTipoExperiencia != null) {
      return busquedaTipoExperiencia.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombrePeriodo(id: number) {
    let busquedaPeriodo = this.DataPeriodo.find((x: any) => x.id == id);
    if (busquedaPeriodo != null) {
      return busquedaPeriodo.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreEstadoCivil(id: number) {
    let busquedaEstadoCivil = this.DataEstadoCivil.find((x: any) => x.id == id);
    if (busquedaEstadoCivil != null) {
      return busquedaEstadoCivil.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreTipoFormacion(id: number) {
    let busquedaTipoFormacion = this.DataTipoFormacion.find(
      (x: any) => x.id == id
    );
    if (busquedaTipoFormacion != null) {
      return busquedaTipoFormacion.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreNivelFormacion(id: number) {
    let busquedaNivelFormacion = this.DataNivelFormacion.find(
      (x: any) => x.id == id
    );
    if (busquedaNivelFormacion != null) {
      return busquedaNivelFormacion.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreNivelFormacionLista(id: any) {
    console.log('NivelFormacion : ', id);
    let busquedaNivelFormacion = this.DataNivelFormacion.find(
      (x: any) => x.id == id
    );
    if (busquedaNivelFormacion != null) {
      return busquedaNivelFormacion.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreAreaFormacion(id: number) {
    let busquedaAreaFormacion = this.DataAreaFormacion.find(
      (x: any) => x.id == id
    );
    if (busquedaAreaFormacion != null) {
      return busquedaAreaFormacion.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreCentroEstudio(id: number) {
    let busquedaCentroEstudio = this.DataCentroEstudio.find(
      (x: any) => x.id == id
    );
    if (busquedaCentroEstudio != null) {
      return busquedaCentroEstudio.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreCentroEstudioLista(valor: any) {
    console.log('valor de Centro Estudio : ', valor);
    let busquedaCentroEstudio = this.DataCentroEstudio.find(
      (x: any) => x.id == valor
    );
    if (busquedaCentroEstudio != null) {
      return busquedaCentroEstudio.nombre;
    } else {
      return '';
    }
  }
  ObtenerEstadoFormacion(id: number) {
    let busquedaEstadoFormacion = this.DataEstadoFormacion.find(
      (x: any) => x.id == id
    );
    if (busquedaEstadoFormacion != null) {
      return busquedaEstadoFormacion.nombre;
    } else {
      return 'No encontro';
    }
  }

  ObtenerEstadoFormacionLista(valor: any) {
    console.log('valor de DataEstadoFormacion : ', valor);
    let busquedaCentroEstudio = this.DataEstadoFormacion.find(
      (x: any) => x.id == valor
    );
    if (busquedaCentroEstudio != null) {
      return busquedaCentroEstudio.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerSexo(id: number) {
    let busquedaSexo = this.DataSexo.find((x: any) => x.id == id);
    if (busquedaSexo != null) {
      return busquedaSexo.nombre;
    } else {
      return 'No encontro';
    }
  }
  /* ---------------Guardar Nuevo Categoria Pregunta ------------------------*/
  guardar() {
    console.log(this.formDatosPuestoTrabajo.value);
    if (this.formDatosPuestoTrabajo.valid) {
      let jsonEnvio = this.procesarPuestoTrabajo();
      this.gridPuestoTrabajo.loading = true;

      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.PuestoTrabajoInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<PuestoTrabajo>) => {
            this.gridPuestoTrabajo.loading = false;

            this.enProcesoSolicitud = false;
            this.gridPuestoTrabajo.data.unshift(resp.body);
            this.gridPuestoTrabajo.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridPuestoTrabajo.loading = false;
            this.enProcesoSolicitud = false;
            this.formDatosPuestoTrabajo.markAllAsTouched();
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Dato',
            });
          },
        });
    } else {
      this.formDatosPuestoTrabajo.markAllAsTouched();
      this.gridPuestoTrabajo.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }
  /* -----------------------------------Actualizar ------------------------- */

  // Metodo se encarga de Actualizar la data de las tablas
  actualizar() {
    if (this.formDatosPuestoTrabajo.valid) {
      this.enProcesoSolicitud = true;

      const materialAccion = this.procesarPuestoTrabajo();

      this.gridPuestoTrabajo.loading = true;

      this._integraService
        .putJsonResponse(
          constApiGestionPersonal.PuestoTrabajoObtenerActualizar,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<PuestoTrabajo>) => {
            /*  this.dataItemTemp.estado = resp.body.estado; */
            this.gridPuestoTrabajo.loading = false;
            this.modalRef.close();
            this.obtener();
            this.gridPuestoTrabajo.loadData();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.gridPuestoTrabajo.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.formDatosPuestoTrabajo.markAllAsTouched();
      this.gridPuestoTrabajo.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

  configurarGrid() {
    this.gridRelacionesPuestoTrabajo.habilitarEstadoNewRow = true;
    this.gridFuncionPuesto.habilitarEstadoNewRow = true;
    this.gridReportePuesto.habilitarEstadoNewRow = true;
    this.gridCursoComplementario.habilitarEstadoNewRow = true;
    this.gridExperienciaLaboral.habilitarEstadoNewRow = true;
    this.gridFormacionAcademica.habilitarEstadoNewRow = true;
    this.gridCaracteristicasPersonales.habilitarEstadoNewRow = true;
    this.gridRelacionesPuestoTrabajo.formGroup = this._formBuilder.group({
      listaPuestoDependencia: [null],
      listaPuestoRelacionInterna: [null],
      listaPuestoACargo: [null],
    });
    this.gridFuncionPuesto.formGroup = this._formBuilder.group({
      nroOrden: [null],
      funcion: [null],
      idPersonalTipoFuncion: [null],
      idFrecuenciaPuestoTrabajo: [null],
    });
    this.gridReportePuesto.formGroup = this._formBuilder.group({
      nroOrden: [null],
      reporte: [null],
      idFrecuenciaPuestoTrabajo: [null],
    });
    this.gridCursoComplementario.formGroup = this._formBuilder.group({
      idTipoCompetenciaTecnica: [null],
      idCompetenciaTecnica: [null],
      idNivelCompetenciaTecnica: [null],
    });
    this.gridExperienciaLaboral.formGroup = this._formBuilder.group({
      idExperiencia: [null],
      idTipoExperiencia: [null],
      nroPeriodo: [null],
      idPeriodo: [null],
    });
    this.gridFormacionAcademica.formGroup = this._formBuilder.group({
      idTipoFormacion: [null],
      idNivelEstudio: [null],
      idAreaFormacion: [null],
      idCentroEstudio: [null],
      idGradoEstudio: [null],
    });
    this.gridCaracteristicasPersonales.formGroup = this._formBuilder.group({
      idEdadMin: [null],
      idEdadMax: [null],
      idSexo: [null],
      idEstadoCivil: [null],
    });
    // this.gridReportePuesto.formGroup = this._formBuilder.group({
    //   nroOrden: [null],
    //   funcion: [null],
    //   idFrecuencia: [null],
    // });
    this.gridRelacionesPuestoTrabajo.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridFuncionPuesto.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridReportePuesto.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridCursoComplementario.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridExperienciaLaboral.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridFormacionAcademica.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridCaracteristicasPersonales.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridRelacionesPuestoTrabajo.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridRelacionesPuestoTrabajo.data.splice(resp.index, 1);
          this.gridRelacionesPuestoTrabajo.data = [
            ...this.gridRelacionesPuestoTrabajo.data,
          ];
        }
      });
    });
    this.gridFuncionPuesto.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridFuncionPuesto.data.splice(resp.index, 1);
          this.gridFuncionPuesto.data = [...this.gridFuncionPuesto.data];
        }
      });
    });
    this.gridCursoComplementario.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridCursoComplementario.data.splice(resp.index, 1);
          this.gridCursoComplementario.data = [
            ...this.gridCursoComplementario.data,
          ];
        }
      });
    });
    this.gridExperienciaLaboral.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridExperienciaLaboral.data.splice(resp.index, 1);
          this.gridExperienciaLaboral.data = [
            ...this.gridExperienciaLaboral.data,
          ];
        }
      });
    });
    this.gridFormacionAcademica.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridFormacionAcademica.data.splice(resp.index, 1);
          this.gridFormacionAcademica.data = [
            ...this.gridFormacionAcademica.data,
          ];
        }
      });
    });
    this.gridCaracteristicasPersonales.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridCaracteristicasPersonales.data.splice(resp.index, 1);
          this.gridCaracteristicasPersonales.data = [
            ...this.gridCaracteristicasPersonales.data,
          ];
        }
      });
    });
    this.gridRelacionesPuestoTrabajo.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          listaPuestoDependencia: FiltroIdNombrePKDTO;
          listaPuestoRelacionInterna: FiltroIdNombrePKDTO;
          listaPuestoACargo: FiltroIdNombrePKDTO;
        };
        // Encuentra el índice del elemento modificado en "this.gridContactos.data"
        const index = this.gridRelacionesPuestoTrabajo.data.findIndex(
          (PuestoDependencia) => PuestoDependencia.id === resp.dataItem.id
        );

        // Actualiza el elemento en el array con el nuevo valor
        if (index !== -1) {
          this.gridRelacionesPuestoTrabajo.data[index].listaPuestoDependencia =
            valorForm.listaPuestoDependencia;
          this.gridRelacionesPuestoTrabajo.data[
            index
          ].listaPuestoRelacionInterna = valorForm.listaPuestoRelacionInterna;
          this.gridRelacionesPuestoTrabajo.data[index].listaPuestoACargo =
            valorForm.listaPuestoACargo;
        }
      },
    });

    this.gridFuncionPuesto.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          nroOrden: number;
          funcion: string;
          idPersonalTipoFuncion: number;
          idFrecuenciaPuestoTrabajo: number;
        };
        // Encuentra el índice del elemento modificado en "this.gridContactos.data"
        const index = this.gridFuncionPuesto.data.findIndex(
          (PuestoFuncion) => PuestoFuncion.id === resp.dataItem.id
        );

        // Actualiza el elemento en el array con el nuevo valor
        if (index !== -1) {
          this.gridFuncionPuesto.data[index].nroOrden = valorForm.nroOrden;
          this.gridFuncionPuesto.data[index].funcion = valorForm.funcion;
          this.gridFuncionPuesto.data[index].idPersonalTipoFuncion =
            valorForm.idPersonalTipoFuncion;
          this.gridFuncionPuesto.data[index].idFrecuenciaPuestoTrabajo =
            valorForm.idFrecuenciaPuestoTrabajo;
        }
      },
    });
    this.gridExperienciaLaboral.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          idExperiencia: number;
          idTipoExperiencia: string;
          nroPeriodo: number;
          idPeriodo: number;
        };
        // Encuentra el índice del elemento modificado en "this.gridContactos.data"
        const index = this.gridExperienciaLaboral.data.findIndex(
          (PuestoFuncion) => PuestoFuncion.id === resp.dataItem.id
        );

        // Actualiza el elemento en el array con el nuevo valor
        if (index !== -1) {
          this.gridExperienciaLaboral.data[index].idExperiencia =
            valorForm.idExperiencia;
          this.gridExperienciaLaboral.data[index].idTipoExperiencia =
            valorForm.idTipoExperiencia;
          this.gridExperienciaLaboral.data[index].nroPeriodo =
            valorForm.nroPeriodo;
          this.gridExperienciaLaboral.data[index].idPeriodo =
            valorForm.idPeriodo;
        }
      },
    });
    this.gridReportePuesto.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          nroOrden: number;
          reporte: string;
          idFrecuenciaPuestoTrabajo: number;
        };
        // Encuentra el índice del elemento modificado en "this.gridContactos.data"
        const index = this.gridReportePuesto.data.findIndex(
          (ReportePuesto) => ReportePuesto.id === resp.dataItem.id
        );

        // Actualiza el elemento en el array con el nuevo valor
        if (index !== -1) {
          this.gridReportePuesto.data[index].nroOrden = valorForm.nroOrden;
          this.gridReportePuesto.data[index].reporte = valorForm.reporte;
          this.gridReportePuesto.data[index].idFrecuenciaPuestoTrabajo =
            valorForm.idFrecuenciaPuestoTrabajo;
        }
      },
    });
    this.gridCursoComplementario.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          idTipoCompetenciaTecnica: number;
          idCompetenciaTecnica: number;
          idNivelCompetenciaTecnica: number;
        };
        // Encuentra el índice del elemento modificado en "this.gridContactos.data"
        const index = this.gridCursoComplementario.data.findIndex(
          (CursoComplementario) => CursoComplementario.id === resp.dataItem.id
        );

        // Actualiza el elemento en el array con el nuevo valor
        if (index !== -1) {
          this.gridCursoComplementario.data[index].idTipoCompetenciaTecnica =
            valorForm.idTipoCompetenciaTecnica;
          this.gridCursoComplementario.data[index].idCompetenciaTecnica =
            valorForm.idCompetenciaTecnica;
          this.gridCursoComplementario.data[index].idNivelCompetenciaTecnica =
            valorForm.idNivelCompetenciaTecnica;
        }
      },
    });
    this.gridCaracteristicasPersonales.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          idEdadMin: number;
          idEdadMax: number;
          idSexo: number;
          idEstadoCivil: number;
        };
        // Encuentra el índice del elemento modificado en "this.gridContactos.data"
        const index = this.gridCaracteristicasPersonales.data.findIndex(
          (CaracteristicasPersonales) =>
            CaracteristicasPersonales.id === resp.dataItem.id
        );

        // Actualiza el elemento en el array con el nuevo valor
        if (index !== -1) {
          this.gridCaracteristicasPersonales.data[index].idEdadMin =
            valorForm.idEdadMin;
          this.gridCaracteristicasPersonales.data[index].idEdadMax =
            valorForm.idEdadMax;
          this.gridCaracteristicasPersonales.data[index].idSexo =
            valorForm.idSexo;
          this.gridCaracteristicasPersonales.data[index].idEstadoCivil =
            valorForm.idEstadoCivil;
        }
      },
    });
    this.gridFormacionAcademica.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          idTipoFormacion: number;
          idNivelEstudio: number;
          idAreaFormacion: number;
          idCentroEstudio: number;
          idGradoEstudio: number;
        };
        // Encuentra el índice del elemento modificado en "this.gridContactos.data"
        const index = this.gridFormacionAcademica.data.findIndex(
          (FormacionAcademica) => FormacionAcademica.id === resp.dataItem.id
        );

        // Actualiza el elemento en el array con el nuevo valor
        if (index !== -1) {
          this.gridFormacionAcademica.data[index].idTipoFormacion =
            valorForm.idTipoFormacion;
          this.gridFormacionAcademica.data[index].idNivelEstudio =
            valorForm.idNivelEstudio;
          this.gridFormacionAcademica.data[index].idAreaFormacion =
            valorForm.idAreaFormacion;
          this.gridFormacionAcademica.data[index].idCentroEstudio =
            valorForm.idCentroEstudio;
          this.gridFormacionAcademica.data[index].idGradoEstudio =
            valorForm.idGradoEstudio;
        }
      },
    });
    this.gridRelacionesPuestoTrabajo.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridPuestoRelacion;

      let item: PuestoTrabajoRelacionCompuestoDTO = {
        listaPuestoDependencia: valorForm.listaPuestoDependencia,
        listaPuestoRelacionInterna: valorForm.listaPuestoRelacionInterna,
        listaPuestoACargo: valorForm.listaPuestoACargo,
        id: 0,
        idPerfilPuestoTrabajo: 0,
      };

      this.gridRelacionesPuestoTrabajo.data = [
        item,
        ...this.gridRelacionesPuestoTrabajo.data,
      ];
    });
    this.gridFuncionPuesto.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridFuncionPuesto;

      let item2: PuestoTrabajoFuncion = {
        nroOrden: valorForm.nroOrden,
        funcion: valorForm.funcion,
        idPersonalTipoFuncion: valorForm.idPersonalTipoFuncion,
        idFrecuenciaPuestoTrabajo: valorForm.idFrecuenciaPuestoTrabajo,
        id: 0,
        idPerfilPuestoTrabajo: 0,
        personalTipoFuncion: this.ObtenerDataTipoFuncion(
          valorForm.idPersonalTipoFuncion
        ),
        frecuenciaPuestoTrabajo: this.ObtenerNombreFrecuencia(
          valorForm.idFrecuenciaPuestoTrabajo
        ),
      };

      this.gridFuncionPuesto.data = [item2, ...this.gridFuncionPuesto.data];
    });
    this.gridReportePuesto.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridReportePuesto;

      let item2: ReporteFuncion = {
        nroOrden: valorForm.nroOrden,
        reporte: valorForm.reporte,
        idFrecuenciaPuestoTrabajo: valorForm.idFrecuenciaPuestoTrabajo,
        frecuenciaPuestoTrabajo: this.ObtenerNombreFrecuencia(
          valorForm.idFrecuenciaPuestoTrabajo
        ),
      };

      this.gridReportePuesto.data = [item2, ...this.gridReportePuesto.data];
    });
    this.gridCursoComplementario.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridCursoComplementario;

      let item2: PuestoTrabajoCursoComplementario = {
        id: 0,
        idPerfilPuestoTrabajo: 0,
        idTipoCompetenciaTecnica: valorForm.idTipoCompetenciaTecnica,
        idCompetenciaTecnica: valorForm.idCompetenciaTecnica,
        idNivelCompetenciaTecnica: valorForm.idNivelCompetenciaTecnica,
        tipoCompetenciaTecnica: this.ObtenerNombreTipoCursoComplementario(
          valorForm.idTipoCompetenciaTecnica
        ),
        competenciaTecnica: this.ObtenerNombreCursoComplementario(
          valorForm.idCompetenciaTecnica
        ),
        nivelCompetenciaTecnica: this.ObtenerNombreNivelCursoComplementario(
          valorForm.idNivelCompetenciaTecnica
        ),
      };

      this.gridCursoComplementario.data = [
        item2,
        ...this.gridCursoComplementario.data,
      ];
    });
    this.gridExperienciaLaboral.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridExperiencia;

      let item2: Experiencia = {
        idExperiencia: valorForm.idExperiencia,
        idTipoExperiencia: valorForm.idTipoExperiencia,
        nroPeriodo: valorForm.nroPeriodo,
        idPeriodo: valorForm.idPeriodo,
        tipoExperiencia: this.ObtenerTipoExperiencia(
          valorForm.idTipoExperiencia
        ),
        experiencia: this.ObtenerNombreExperiencia(valorForm.idExperiencia),
        periodo: this.ObtenerNombrePeriodo(valorForm.idPeriodo),
      };

      this.gridExperienciaLaboral.data = [
        item2,
        ...this.gridExperienciaLaboral.data,
      ];
    });
    this.gridCaracteristicasPersonales.saveEvent$.subscribe((resp) => {
      let valorForm =
        resp.formGroup.getRawValue() as GridCaracteristicasPersonales;

      let item2: CaracteristicasPersonales = {
        idEdadMin: valorForm.idEdadMin,
        idEdadMax: valorForm.idEdadMax,
        idSexo: valorForm.idSexo,
        idExperiencia: valorForm.idExperiencia,
        idEstadoCivil: valorForm.idEstadoCivil,
        idPerfilPuestoTrabajo: 0,
        id: 0,
        sexo: this.ObtenerSexo(valorForm.idSexo),
        estadoCivil: this.ObtenerNombreEstadoCivil(valorForm.idEstadoCivil),
      };

      this.gridCaracteristicasPersonales.data = [
        item2,
        ...this.gridCaracteristicasPersonales.data,
      ];
    });

    this.gridFormacionAcademica.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridFormacionAcademica;

      let item2: PuestoTrabajoFormacionAcademica = {
        idTipoFormacion: valorForm.idTipoFormacion,
        idNivelEstudio: valorForm.idNivelEstudio,
        idAreaFormacion: valorForm.idAreaFormacion,
        idCentroEstudio: valorForm.idCentroEstudio,
        idGradoEstudio: valorForm.idGradoEstudio,
        id: 0,
        idPerfilPuestoTrabajo: 0,
      };

      this.gridFormacionAcademica.data = [
        item2,
        ...this.gridFormacionAcademica.data,
      ];
    });
  }
  limpiarCamposForm(): void {
    if (this.modalRef != null) {
      this.modalRef.close();
      this.modalRef = null;
    }
    this.formDatosPuestoTrabajo.reset();
    this.enProcesoSolicitud = false;
  }
  ObtenerNombrePuestoTrabajo(id: any) {
    let busqueda = this.DataPuestoTrabajoRelacion.find((x: any) => x.id == id);
    if (busqueda != null) {
      return busqueda.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombrePuestoTrabajoLista(dato: any) {
    let busqueda1 = this.DataPuestoTrabajo.find((x: any) => x.id == dato.id);

    if (busqueda1 != null) {
      return busqueda1.nombre;
    } else {
      return 'No encontró';
    }
  }
  ObtenerNombreArea(id: number) {
    let busqueda1 = this.DataAreaTrabajo.find((x: any) => x.id == id);
    if (busqueda1 != null) {
      return busqueda1.nombre;
    } else {
      return 'No encontro';
    }
  }

  ObtenerNombrePuestoDependencia(dato: any) {
    let busqueda1 = this.DataPuestoTrabajo.find((x: any) => x.id == dato.id);
    if (busqueda1 != null) {
      return busqueda1.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreAreaLista(dato: any) {
    let busqueda = this.DataAreaTrabajo.find((x: any) => x.id == dato.id);
    if (busqueda != null) {
      return busqueda.nombre;
    } else {
      return 'No encontró';
    }
  }
  DataEvaluacionesPuntajeCalificacion: PuestoTrabajoNombreEvaluacionAgrupadaComponenteDTO[] =
    [];
  DataEvaluaciones: PuestoTrabajoNombreEvaluacionesAgrupadaIndependienteDTO[] =
    [];
  gridEvaluacion: KendoGrid = new KendoGrid();
  obtenerPerfilPuestoTrabajo(idPerfilPuestoTrabajo: number) {
    this.gridEvaluacion.loading = true;
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.PuestoTrabajoObtenerPerfilPuestoTrabajo +
          '/' +
          idPerfilPuestoTrabajo
      )
      .subscribe({
        next: (resp: HttpResponse<ExamenesObtener>) => {
          console.log('Datos  Totales: ', resp.body);

          let data = resp.body.listaEvaluaciones.map((x) => {
            let item: PuestoTrabajoNombreEvaluacionesAgrupadaIndependienteDTO =
              {
                id: x.id,
                nombre: x.nombre,
                calificacionTotal: x.calificacionTotal,
                calificaAgrupadoNoIndependiente:
                  x.calificaAgrupadoNoIndependiente,
                gridDetalleEvaluacion:
                  new KendoGrid<PuestoTrabajoNombreEvaluacionAgrupadaComponenteDTO>(),
              };

            let dataDetalle =
              resp.body.listaEvaluacionesPuntajeCalificacion.filter(
                (s) => s.idEvaluacion === x.id
              );
            dataDetalle = dataDetalle.map((y) => {
              let item2: PuestoTrabajoNombreEvaluacionAgrupadaComponenteDTO = {
                calificacionTotal: y.calificacionTotal,
                idEvaluacion: y.idEvaluacion,
                nombreEvaluacion: y.nombreEvaluacion,
                idGrupo: y.idGrupo,
                nombreGrupo: y.nombreGrupo,
                idComponente: y.idComponente,
                nombreComponente: y.nombreComponente,
                puntaje: y.puntaje,
                calificaPorCentil: y.calificaPorCentil,
                calificaAgrupadoNoIndependiente:
                  y.calificaAgrupadoNoIndependiente,
                idProcesoSeleccionRango: y.idProcesoSeleccionRango,
                esCalificable: y.esCalificable,
              };
              return item2;
            });
            item.gridDetalleEvaluacion.formGroup = this._formBuilder.group({
              calificacionTotal: null,
              idEvaluacion: null,
              nombreEvaluacion: null,
              idGrupo: null,
              nombreGrupo: null,
              idComponente: null,
              nombreComponente: null,
              puntaje: null,
              calificaPorCentil: null,
              calificaAgrupadoNoIndependiente: null,
              idProcesoSeleccionRango: null,
              esCalificable: null,
            });

            item.gridDetalleEvaluacion.updateEvent$.subscribe((resp) => {
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
            });
            item.gridDetalleEvaluacion.data = dataDetalle;

            return item;
          });

          this.gridEvaluacion.data = data;
          this.gridEvaluacion.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridEvaluacionPuntaje.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  onDetailExpand(event: any): void {
    const nombreSeleccionado = event.dataItem.id;

    // Filtra los datos para el segundo grid basándose en 'nombre'
    this.gridEditarEvaluacionesFiltrado.data =
      this.gridEditarEvaluaciones.data.filter(
        (item: any) => item.idEvaluacion === nombreSeleccionado
      );
  }

  obtenerNombreProcesoRango(idProcesoSeleccionRango: number) {
    let item = this.DataRango.find((x) => x.id == idProcesoSeleccionRango);
    if (item != null) {
      return item.nombre;
    }
    return null;
  }
  /* -----------Asignar Valores de Form PuestoTrabajo------------------- */
  asignarValoresToForm(dataItem: PuestoTrabajoVersiones) {
    this.formPerfilPuestoTrabajo
      .get('descripcion')
      .setValue(dataItem.descripcion);
    this.formPerfilPuestoTrabajo.get('objetivo').setValue(dataItem.objetivo);
  }
  asignarValoresToFormPuestoTrabajo(dataItem: PuestoTrabajo) {
    this.formDatosPuestoTrabajo.get('nombre').setValue(dataItem.nombre);
    this.formDatosPuestoTrabajo
      .get('idPersonalAreaTrabajo')
      .setValue(dataItem.idPersonalAreaTrabajo);
    this.formDatosPuestoTrabajo.get('nombre').disable();
  }
  obtenerDatos(idPerfilPuestoTrabajo: number) {
    this.gridRelacionesPuestoTrabajo.loading = true;
    this.gridFuncionPuesto.loading = true;
    this.gridReportePuesto.loading = true;
    this.gridCursoComplementario.loading = true;
    this.gridExperienciaLaboral.loading = true;
    this.gridCaracteristicasPersonales.loading = true;
    this.gridFormacionAcademica.loading = true;
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.PuestoTrabajoObtenerPerfilPuestoTrabajo +
          '/' +
          idPerfilPuestoTrabajo
      )
      .subscribe({
        next: (resp: HttpResponse<ExamenesObtener>) => {
          this.gridRelacionesPuestoTrabajo.data =
            resp.body.listaPuestoTrabajoRelacion;
          this.gridFuncionPuesto.data = resp.body.listaPuestoTrabajoFuncion;
          this.gridReportePuesto.data = resp.body.listaPuestoTrabajoReporte;
          this.gridCursoComplementario.data =
            resp.body.listaPuestoTrabajoCursoComplementario;
          (this.gridExperienciaLaboral.data =
            resp.body.listaPuestoTrabajoExperiencia),
            (this.gridCaracteristicasPersonales.data =
              resp.body.listaPuestoTrabajoCaracteristicaPersonal);
          this.gridFormacionAcademica.data =
            resp.body.listaPuestoTrabajoFormacionAcademica;

          this.gridFuncionPuesto.loading = false;
          this.gridRelacionesPuestoTrabajo.loading = false;
          this.gridReportePuesto.loading = false;
          this.gridCursoComplementario.loading = false;
          this.gridExperienciaLaboral.loading = false;
          this.gridCaracteristicasPersonales.loading = false;
          this.gridFormacionAcademica.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridFuncionPuesto.loading = false;
          this.gridRelacionesPuestoTrabajo.loading = false;
          this.gridReportePuesto.loading = false;
          this.gridCursoComplementario.loading = false;
          this.gridExperienciaLaboral.loading = false;
          this.gridCaracteristicasPersonales.loading = false;
          this.gridFormacionAcademica.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  InsertarActualizarPerfilPuestoTrabajo() {
    console.log(this.formPerfilPuestoTrabajo.value);
    if (this.formPerfilPuestoTrabajo.valid) {
      let jsonEnvio = this.procesarAsignacionDatos();
      this.gridPuestoTrabajo.loading = true;
      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.PuestoTrabajoInsertarActualizarPerfilPuestoTrabajo,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            this.gridPuestoTrabajo.loading = false;
            this.enProcesoSolicitud = false;
            this.gridPuestoTrabajo.data.unshift(resp.body);
            this.gridPuestoTrabajo.loadData();
            this.obtener();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridPuestoTrabajo.loading = false;
            this.enProcesoSolicitud = false;
            this.formPerfilPuestoTrabajo.markAllAsTouched();
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Dato',
            });
          },
        });
    } else {
      this.formPerfilPuestoTrabajo.markAllAsTouched();
      this.gridPuestoTrabajo.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }
  ObtenerGridAsignacionInterfaz(idPuestoTrabajo: number) {
    this.gridAsignacionInterfaz.loading = true;
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.PuestoTrabajoObtenerGridAsignacionInterfaz +
          '/' +
          idPuestoTrabajo
      )
      .subscribe({
        next: (resp: HttpResponse<InterfazModulo[]>) => {
          this.gridAsignacionInterfaz.data = resp.body;
          this.gridAsignacionInterfaz.loading = false;
          console.log('DataPuestoTrabajo ', this.DataPuestoTrabajo);
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridAsignacionInterfaz.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  procesarAsignacionDatos() {
    console.log(
      'dataItemPuestoTrabajoTmp : ',
      this.dataItemPuestoTrabajoTmp.idPerfilPuestoTrabajo
    );
    console.log(
      'dataItemPuestoTrabajoTmp : ',
      this.dataItemPuestoTrabajoTmp.id
    );
    let PuestoTrabajoAsignacion: PerfilPuestoTrabajoInsertar = {
      descripcion: this.perfilPuestoTrabajoForm.descripcion,
      objetivo: this.perfilPuestoTrabajoForm.objetivo,
      idPerfilPuestoTrabajo: 0,
      idPuestoTrabajo: this.dataItemPuestoTrabajoTmp.id,
      estadoPuestoTrabajoCaracteristicaPersonal: true,
      estadoPuestoTrabajoCursoComplementario: true,
      estadoPuestoTrabajoExperiencia: true,
      estadoPuestoTrabajoFormacionAcademica: true,
      estadoPuestoTrabajoFuncion: true,
      estadoPuestoTrabajoRelacion: true,
      estadoPuestoTrabajoReporte: true,
      crearNuevaVersion: true,
      esUsuarioAprobacion: false,
      idPersonal: 0,
      usuario: '',
      puestoTrabajoRelacion: this.gridRelacionesPuestoTrabajo.data,
      PuestoTrabajoCursoComplementario: this.gridCursoComplementario.data,
      PuestoTrabajoCaracteristicaPersonal:
        this.gridCaracteristicasPersonales.data,
      PuestoTrabajoExperiencia: this.gridExperienciaLaboral.data,
      PuestoTrabajoFormacion: this.gridFormacionAcademica.data,
      PuestoTrabajoFuncion: this.gridFuncionPuesto.data,
      PuestoTrabajoReporte: this.gridReportePuesto.data,
      Puntaje: this.ProcesarPuntaje(),
    };
    return PuestoTrabajoAsignacion;
  }
  ProcesarPuntaje() {
    let listaFinal: PuestoTrabajoNombreEvaluacionAgrupadaComponenteDTO[] = [];
    // this.gridEvaluacion.data.forEach((x) => {
    //   let itemsSubPadre = x.gridDetalleEvaluacion.data
    //     .map((y:any) => {
    //       let item: PuestoTrabajoNombreEvaluacionAgrupadaComponenteDTO = {
    //         calificacionTotal: y.calificacionTotal,
    //             idEvaluacion: y.idEvaluacion,
    //             nombreEvaluacion: y.nombreEvaluacion,
    //             idGrupo: y.idGrupo,
    //             nombreGrupo: y.nombreGrupo,
    //             idComponente: y.idComponente,
    //             nombreComponente: y.nombreComponente,
    //             puntaje: y.puntaje,
    //             calificaPorCentil: y.calificaPorCentil,
    //             calificaAgrupadoNoIndependiente:
    //               y.calificaAgrupadoNoIndependiente,
    //             idProcesoSeleccionRango: y.idProcesoSeleccionRango,
    //             esCalificable: y.esCalificable,
    //       };
    //       return item;
    //     });
    //   listaFinal = [...itemsSubPadre];
    // });
    let item = {
      listaPuntaje: listaFinal,
      usuario: 'Prueba',
    };
    return item;
  }

  eliminar(id: number) {
    // Usar SweetAlert para mostrar un mensaje de confirmación
    this.enProcesoSolicitud = true;
    Swal.fire({
      title: '¿Estás seguro de eliminar el Puesto Trabajo?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.gridPuestoTrabajo.data.findIndex((x) => x.id === id);
        if (index != -1) {
        }
        this.gridPuestoTrabajo.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiGestionPersonal.PuestoTrabajoEliminar}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridPuestoTrabajo.loading = false;
              if (response.body === true) {
                this.gridPuestoTrabajo.data.splice(index, 1);
                this.gridPuestoTrabajo.loadView();
                this._alertaService.mensajeIcon(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success'
                );
                this.obtener();
                this.enProcesoSolicitud = false;
              } else {
                this._alertaService.mensajeIcon(
                  'Error!',
                  'Ocurrió un problema al eliminar.',
                  'warning'
                );
              }
            },
            error: (error) => {
              console.log(error);
              this.gridPuestoTrabajo.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }

  guardarCambiosModulos() {
    const listaAgregar: any = [];
    const dataSource = this.gridAsignacionInterfaz.data;

    dataSource.forEach((dataItem) => {
      if (dataItem.estado) {
        dataItem.Modificar = true;
        listaAgregar.push(dataItem);
      }
    });
    console.log('DataItemModulo : ', this.dataItemModulo);
    const obj = {
      id: this.dataItemModulo.id ? this.dataItemModulo.id : 0,
      usuario: '',
      listaAsignacion: listaAgregar,
    };

    this.gridAsignacionInterfaz.loading = true;
    this.enProcesoSolicitud = true;

    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.PuestoTrabajoInsertarActualizarInterfaz,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<AsignarInterfazDTO>) => {
          this.gridAsignacionInterfaz.loading = false;
          this.enProcesoSolicitud = false;
          this.gridAsignacionInterfaz.data.unshift(resp.body);
          this.gridAsignacionInterfaz.loadData();
          this.gridPuestoTrabajo.data.unshift(resp.body);
          this.gridPuestoTrabajo.loadData();
          this.obtener();
          this.modalRef.close();
          this._alertaService.mensajeExitoso();
        },
        error: (error) => {
          this.gridAsignacionInterfaz.loading = false;
          this.enProcesoSolicitud = false;
          this._alertaService.notificationWarning(error.message);
          this._alertaService.swalFireOptions({
            icon: 'error',
            text: 'No se pudo guardar el Dato',
          });
        },
      });
  }
  onEstadoChange(dataItem: any) {
    dataItem.Modificar = true;
  }

  AprobarPerfil() {
    const obj = {
      idPerfilPuestoTrabajo: this.idPerfilPuestoTrabajoTmp,
      tipoBoton: true,
      observacion: '',
    };

    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.AprobarRechazarVersionPerfilPuestoTrabajoPuestoTrabajo,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<AsignarInterfazDTO>) => {
          this.obtener();
          this.modalRef.close();
          this._alertaService.mensajeExitoso();
        },
        error: (error) => {
          this.gridAsignacionInterfaz.loading = false;
          this.enProcesoSolicitud = false;
          this._alertaService.notificationWarning(error.message);
          this._alertaService.swalFireOptions({
            icon: 'error',
            text: 'No se pudo Aprobar el Dato',
          });
        },
      });
  }
  RechazarPerfil() {
    const obj = {
      idPerfilPuestoTrabajo: this.idPerfilPuestoTrabajoTmp,
      tipoBoton: false,
      observacion: '',
    };

    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.AprobarRechazarVersionPerfilPuestoTrabajoPuestoTrabajo,
        JSON.stringify(obj)
      )
      .subscribe({
        next: (resp: HttpResponse<AsignarInterfazDTO>) => {
          this.obtener();
          this.modalRef.close();
          this._alertaService.mensajeExitoso();
        },
        error: (error) => {
          this.gridAsignacionInterfaz.loading = false;
          this.enProcesoSolicitud = false;
          this._alertaService.notificationWarning(error.message);
          this._alertaService.swalFireOptions({
            icon: 'error',
            text: 'No se pudo Aprobar el Dato',
          });
        },
      });
  }

  obtenerUsuarioAprobacion() {
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.PuestoTrabajoEsPersonalAprobacionVersion
      )
      .subscribe({
        next: (resp: HttpResponse<DataAprobacion[]>) => {
          this.DataUsuarioAprobacion = resp.body;
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  encontrarDatoAprobacion(idPuestoTrabajo: number) {
    // Busca el dato en el arreglo
    let busqueda = this.DataUsuarioAprobacion.find(
      (x: any) => x.idPuestoTrabajo === idPuestoTrabajo
    );
  
    if (busqueda != null) {
      console.log("Coincidencia encontrada:", busqueda);
      this.esUsuarioAprobacionTmp = true;
    } else {
      console.log("No se encontró coincidencia.");
      this.esUsuarioAprobacionTmp = false;
    }
  }
}

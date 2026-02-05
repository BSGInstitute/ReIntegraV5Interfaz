import { HttpResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { constApiGestionPersonal } from '@environments/constApi';
import Swal from 'sweetalert2';
import {
  FichaDatosPersonal,
  FichaDatosPersonalCombo,
  HorarioDTO,
  FormacionAcademicaDTO,
  ConocimientoInformaticaDTO,
  IdiomasDTO,
  CertificacionesDTO,
  ExperienciaLaboralDTO,
  PersonalFamiliarDTO,
  PersonalInformacionMedicaDTO,
  PersonalHistorialMedicoDTO,
  AccesosPortal,
  ProgramasAsignadosAccesosPortalDTO,
  CursosAsignadosAccesosPortalDTO,
  DatosFichaDePersonal,
  DatosPersonal,
  PersonalCese,
  PersonalDireccion,
  PersonalRemuneracionV2,
  GuardarFichaDatosPersonal,
  PersonalSeguroSaludDTO,
  PersonalSistemaPensionarioDTO,
  PersonalDescanso,
  PersonalDTOv2,
  EntidadFinanciera,
  areaTrabajoDTO,
  TipoSangreDTO,
  DescargarArchivoDTO,
  ArchivoDTO,
  PersonalGrupoAccesoTemporalDTO,
  EliminarAccesosDto,
} from '@gestionPersonas/models/fichaDatosPersonal';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { GridDataResult } from '@progress/kendo-angular-grid';

interface GridFormacionAcademica {
  idCentroEstudio?: number;
  idEstadoEstudio?: number;
  idPersonalTipoFuncion?: number;
  idAreaFormacion?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  idPersonalArchivo?: boolean;
  idTipoEstudio?: number;
  alaActualidad?: boolean;
  logro?: string;
  idPersonal?: number;
}
interface GridConocimientoInformatica {
  idCentroEstudio?: number;
  idNivelCompetenciaTecnica?: number;
  idPersonalArchivo?: number;
  programa?: string;
}
interface GridIdiomas {
  idCentroEstudio: number;
  idIdioma: number;
  idNivelIdioma: number;
  idPersonalArchivo: number;
}
interface FormPersonalGrupoAccesoTemporal {
  idPersonal: number;
  idPEspecificoPadre: number;
  idPEspecificoHijo?: number;
  listaPEspecificoHijo?: number[];
  FechaFinAnterior?: number;
  FechaInicioAnterior?: number;
  evaluacionHabilitada: boolean;
  fechaInicio?: Date;
  fechaFin?: Date;
}
interface GridCertificaciones {
  idCentroEstudio?: number;
  fechaCertificacion?: number;
  idPersonalArchivo?: number;
  programa?: string;
  institucion?: string;
}

interface GridExperienciaLaboral {
  idEmpresa?: number;
  idAreaTrabajo?: number;
  idCargo?: number;
  fechaIngreso?: Date;
  fechaRetiro?: Date;
  motivoRetiro?: string;
  nombreJefeInmediato?: string;
  telefonoJefeInmediato?: string;
  idPersonalArchivo?: boolean;
  idPersonal?: number;
}
interface GridPersonalFamiliar {
  idParentescoPersonal?: number;
  nombres?: string;
  apellidos?: string;
  idSexo?: number;
  fechaNacimiento?: Date;
  idTipoDocumentoPersonal?: number;
  numeroDocumento?: string;
  numeroReferencia?: string;
  derechoHabiente?: boolean;
  esContactoInmediato?: boolean;
}
interface GridPersonalInformacionMedica {
  alergia?: string;
  precaucion?: string;
}
interface GridPersonalHistorialMedico {
  enfermedad?: string;
  detalleEnfermedad?: string;
  periodo?: string;
}

@Component({
  selector: 'app-ficha-datos-personal',
  templateUrl: './ficha-datos-personal.component.html',
  styleUrls: ['./ficha-datos-personal.component.scss'],
})
export class FichaDatosPersonalComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef
  ) {}

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  horarioForm: FormGroup;
  ngOnInit(): void {
    this.obtenerTodo();
    this.obtenerCombos();
    this.configurarGrid();
    this.ObtenerPEspecificoPersonalAccesoTemporalCombo();
    this.horarioForm = this._formBuilder.group(
      Object.fromEntries(
        this.diasSemana.flatMap((dia) => [
          [`${dia}1`, null],
          [`${dia}2`, null],
          [`${dia}3`, null],
          [`${dia}4`, null],
        ])
      )
    );
  }
  DataTipoVia = [
    {
      id: 1,
      nombre: 'Avenida',
    },
    {
      id: 2,
      nombre: 'Calle',
    },
    {
      id: 3,
      nombre: 'Jiron',
    },
    {
      id: 4,
      nombre: 'Pasaje',
    },
  ];
  DataEstado = [
    {
      id: 1,
      nombre: 'Activo',
    },
    {
      id: 2,
      nombre: 'Inactivo',
    },
  ];
  DataTipoZonaUrbana = [
    {
      id: 1,
      nombre: 'Urbanizacion',
    },
    {
      id: 2,
      nombre: 'Unidad Vecinal',
    },
    {
      id: 3,
      nombre: 'Pueblo Joven',
    },
    {
      id: 4,
      nombre: 'Asentamiento Humano',
    },
  ];
  formDatosPersonal: FormGroup = this._formBuilder.group({
    nombres: [null, Validators.required],
    apellidos: [null, Validators.required],
    telefonoMovil: null,
    telefonoFijo: null,
    emailReferencia: null,
    email: [null, Validators.required],
    idTipoDocumento: null,
    numeroDocumento: null,
    idEstadocivil: null,
    idSexo: null,
    idCiudadNacimiento: null,
    idPaisNacimiento: null,
    fechaNacimiento: null,
    distritoDireccion: null,
    idCiudadReferencia: null,
    idPaisReferencia: null,
    nombreDireccion: null,
    idZonaUrbana: null,
    idTipoViaUrbana: null,
    manzana: null,
    lote: null,
    idArea: [null, Validators.required],
    area: null,
    idPuestoTrabajo: [null, Validators.required],
    urlFirma: null,
    idPuestoTrabajoNivel: null,
    idTableroComercialCategoriaAsesor: null,
    idTipoEstado: null,
    idTipoSangre: null,
    idSede: [null, Validators.required],
    estadoPersonalActivo: null,
    idJefe: null,
    anexo3CX: null,
    central: null,
    codigoAfiliado: null,
    idEntidadSistemaPensionario: null,
    idSistemaPensionario: null,
    idEntidadSeguroSalud: null,
  });
  formPersonalDireccion: FormGroup = this._formBuilder.group({});

  formPersonalRemuneracion: FormGroup = this._formBuilder.group({
    idEntidadFinanciera: null,
    idTipoPagoRemuneracion: null,
    numeroCuenta: null,
  });
  formPersonalCese: FormGroup = this._formBuilder.group({
    fechaCese: null,
    idMotivoCese: null,
  });
  formPersonalDescanso: FormGroup = this._formBuilder.group({
    estadoContrato: null,
    idestadoContrato: null,
    fechaFinDescanso: null,
    fechaInicioDescanso: null,
    idMotivoInactividad: null,
  });
  formConfigurarAccesos: FormGroup = this._formBuilder.group({
    evaluacionHabilitada: null,
    fechaFin: null,
    fechaInicio: null,
    idPEspecificoPadre: null,
    idPEspecifico: null,
  });
  formPersonalSeguroSalud: FormGroup = this._formBuilder.group({
    idEntidadSeguroSalud: null,
  });
  formPersonalSistemaPensionario: FormGroup = this._formBuilder.group({
    codigoAfiliado: null,
    idEntidadSistemaPensionario: null,
    idSistemaPensionario: null,
  });
  virtual: any = {
    itemHeight: 28,
  };

  gridFichaDatosPersonal: KendoGrid = new KendoGrid();

  modalRef: any;
  enProcesoSolicitud: boolean = false;
  DataTipoDocumento: IComboBase1[] = [];
  DataEstadoCivil: IComboBase1[] = [];
  DataSexo: IComboBase1[] = [];
  DataCiudad: IComboBase1[] = [];
  DataPais: IComboBase1[] = [];
  DataSistemaPensionario: IComboBase1[] = [];
  DataEntidad: IComboBase1[] = [];
  DataEntidadSalud: IComboBase1[] = [];
  DataTipoPago: IComboBase1[] = [];
  DataEntidadFinanciera: EntidadFinanciera[] = [];
  DataAreaTrabajo: areaTrabajoDTO[] = [];
  DataPuestoTrabajo: IComboBase1[] = [];
  DataJefeInmediato: IComboBase1[] = [];
  DataTipoEstado: IComboBase1[] = [];
  DataPuestoTrabajoNivel: IComboBase1[] = [];
  DataCategoriaAsesor: IComboBase1[] = [];
  DataSede: IComboBase1[] = [];
  DataMotivoCese: IComboBase1[] = [];
  DataPEspecificosPersonal: AccesosPortal;
  DataPEspecificosPersonalProgramaAsignado: ProgramasAsignadosAccesosPortalDTO[] =
    [];
  DataPEspecificosPersonalCursosAsignados: CursosAsignadosAccesosPortalDTO[] =
    [];
  //Grillas
  gridAreasDeTrabajo: KendoGrid = new KendoGrid();
  gridTipoAsesorHistorico: KendoGrid = new KendoGrid();
  gridJefeInmediatoHistorico: KendoGrid = new KendoGrid();
  gridPeriodoInactivoHistorico: KendoGrid = new KendoGrid();
  //Grilla Tab Formacion => Formacion Academica
  gridPersonalFormacion: KendoGrid = new KendoGrid();
  DataFormacion: IComboBase1[] = [];
  DataTipoEstudio: IComboBase1[] = [];
  DataAreaFormacion: IComboBase1[] = [];
  DataEstadoEstudio: IComboBase1[] = [];
  //Grilla Tab Formacion => Conocimiento en Informatica
  gridPersonalInformatica: KendoGrid = new KendoGrid();
  DataNivelCompetenciaTecnica: IComboBase1[] = [];
  //Grilla Tab Formacion => PersonalIdiomas
  gridPersonalIdiomas: KendoGrid = new KendoGrid();
  DataIdioma: IComboBase1[] = [];
  DataNivelIdioma: IComboBase1[] = [];
  //Grilla Tab Certificaciones
  gridPersonalCertificacion: KendoGrid = new KendoGrid();
  //Grilla Tab Experiencia Laboral
  gridPersonalExperiencia: KendoGrid = new KendoGrid();
  DataEmpresa: IComboBase1[] = [];
  DataArea: IComboBase1[] = [];
  DataCargo: IComboBase1[] = [];
  //Grilla Tab Personal Familiar
  DataParentesco: IComboBase1[] = [];
  //Grilla Tab Datos Familiares
  gridPersonalFamiliar: KendoGrid = new KendoGrid();
  //Grilla Tab Informacion Medica
  DataTipoSangre: TipoSangreDTO[] = [];
  gridPersonalInformacionMedica: KendoGrid = new KendoGrid();
  gridPersonalHistorialMedico: KendoGrid = new KendoGrid();
  //Grilla Tab Accesos Portal
  gridAccesoTemporal: KendoGrid = new KendoGrid();
  acceso: boolean = false;
  DataPersonalFicha: DatosPersonal;
  isNew: boolean = false;
  isNewAccesoTemporal: boolean = true;
  dataItemTemp: FichaDatosPersonal;
  dataItemAccesoTemp: any = null;
  idPersonalTmp: number = 0;
  tmpcontrolviadireccion: boolean = false;
  valorEstado: boolean = true;
  obtenerTodo() {
    this.gridFichaDatosPersonal.loading = true;
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.PersonalObtenerFichaDatosPersonal
      )
      .subscribe({
        next: (resp: HttpResponse<FichaDatosPersonal[]>) => {
          this.gridFichaDatosPersonal.data = resp.body;
          this.gridFichaDatosPersonal.loading = false;
        },
        error: (error) => {
          this.gridFichaDatosPersonal.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  abrirModalEditar(
    context: any,
    isNew: boolean,
    dataItem?: FichaDatosPersonal
  ) {
    if (dataItem != null && dataItem != undefined) {
      this.idPersonalTmp = dataItem.id;
    }
    this.isNew = isNew;
    this.formDatosPersonal.reset();
    this.formPersonalSistemaPensionario.reset();
    this.formPersonalSeguroSalud.reset();
    this.formPersonalRemuneracion.reset();
    this.formPersonalCese.reset();
    this.formConfigurarAccesos.reset();
    this.formPersonalDescanso.reset();
    this.formPersonalDireccion.reset();
    this.gridAreasDeTrabajo.data = [];
    this.gridTipoAsesorHistorico.data = [];
    this.gridPersonalInformatica.data = [];
    this.gridJefeInmediatoHistorico.data = [];
    this.gridPersonalFormacion.data = [];
    this.gridJefeInmediatoHistorico.data = [];
    this.gridPersonalCertificacion.data = [];
    this.gridPersonalExperiencia.data = [];
    this.gridPersonalFamiliar.data = [];
    this.gridPersonalIdiomas.data = [];
    this.gridPersonalInformacionMedica.data = [];
    this.gridTipoAsesorHistorico.data = [];
    this.gridPersonalHistorialMedico.data = [];
    this.enProcesoSolicitud = false;
    if (!isNew) {
      this.dataItemTemp = dataItem;
      this.acceso = true;
      this.ObtenerDatosPersonal(dataItem.id);
    } else {
      this.dataItemTemp = null;
      this.acceso = false;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
  }
  abrirModalEditarAccesos(
    context: any,
    isNew: boolean,
    dataItem?: FichaDatosPersonal
  ) {
    this.isNew = isNew;
    this.formDatosPersonal.reset();

    this.enProcesoSolicitud = false;
    if (!isNew) {
      this.dataItemTemp = dataItem;
    } else {
      this.dataItemTemp = null;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  abrirModalNuevoAcceso(context: any): void {
    this.isNewAccesoTemporal = true;
    this.dataItemAccesoTemp = null;
    this.formConfigurarAccesos.reset();
    this.enProcesoSolicitud = false;
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  abrirModalEditarAccesoTemporal(context: any, dataItem: any): void {
    this.isNewAccesoTemporal = false;
    this.dataItemAccesoTemp = dataItem;
    this.formConfigurarAccesos.reset();
    this.enProcesoSolicitud = false;
    this.formConfigurarAccesos.patchValue({
      idPEspecificoPadre: dataItem.idPEspecificoPadre,
      fechaInicio: dataItem.fechaInicio ? new Date(dataItem.fechaInicio) : null,
      fechaFin: dataItem.fechaFin ? new Date(dataItem.fechaFin) : null,
      evaluacionHabilitada: dataItem.evaluacionHabilitada ?? false,
      FechaInicioAnterior: dataItem.fechaInicio ? new Date(dataItem.fechaInicio) : null,
      FechaFinAnterior: dataItem.fechaFin ? new Date(dataItem.fechaFin) : null
    });
    if (dataItem.idPEspecificoPadre) {
      this.onProgramSelectionChange(dataItem.idPEspecificoPadre);
      setTimeout(() => {
        if (dataItem.listaPEspecificoHijo && dataItem.listaPEspecificoHijo.length > 0) {
          this.formConfigurarAccesos.get('idPEspecifico')?.setValue(dataItem.listaPEspecificoHijo);
        }
      }, 500);
    }
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  limpiarCamposForm(): void {
    if (this.modalRef != null) {
      this.modalRef.close();
      this.modalRef = null;
    }
    this.formDatosPersonal.reset();
    this.enProcesoSolicitud = false;
  }
  obtenerCombos() {
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.PersonalObtenerCombosFichaDatosPersonal
      )
      .subscribe({
        next: (resp: HttpResponse<FichaDatosPersonalCombo>) => {
          //this.DataCombo = resp.body;
          this.DataTipoDocumento = resp.body.listaTipoDocumento;
          this.DataEstadoCivil = resp.body.listaEstadoCivil;
          this.DataSexo = resp.body.listaSexo;
          this.DataCiudad = resp.body.listaCiudad;
          this.DataPais = resp.body.listaPais;
          this.DataSistemaPensionario = resp.body.listaSistemaPensionario;
          this.DataEntidad = resp.body.listaEntidad;
          this.DataEntidadSalud = resp.body.listaEntidadSeguroSalud;
          this.DataTipoPago = resp.body.listaTipoPagoRemuneracion;
          this.DataEntidadFinanciera = resp.body.listaEntidadFinanciera;
          this.DataAreaTrabajo = resp.body.listaPersonalAreaTrabajo;
          this.DataPuestoTrabajo = resp.body.listaPuestoTrabajo;
          this.DataJefeInmediato = resp.body.listaPersonal;
          this.DataTipoEstado = resp.body.listaMotivoInactividad;
          this.DataPuestoTrabajoNivel = resp.body.listaPuestoTrabajoNivel;
          this.DataCategoriaAsesor = resp.body.listaCategoriaAsesor;
          this.DataSede = resp.body.listaSedeTrabajo;
          this.DataMotivoCese = resp.body.listaMotivoCese;
          this.DataFormacion = resp.body.listaCentroEstudio;
          this.DataTipoEstudio = resp.body.listaTipoEstudio;
          this.DataAreaFormacion = resp.body.listaAreaFormacion;

          this.DataEstadoEstudio = resp.body.listaEstadoEstudio;
          this.DataNivelCompetenciaTecnica =
            resp.body.listaNivelCompetenciaTecnica;
          this.DataIdioma = resp.body.listaIdioma;
          this.DataNivelIdioma = resp.body.listaNivelIdioma;
          this.DataEmpresa = resp.body.listaEmpresa;
          this.DataArea = resp.body.listaAreaTrabajo;
          this.DataCargo = resp.body.listaCargo;
          this.DataParentesco = resp.body.listaParentesco;
          this.DataTipoSangre = resp.body.listaTipoSangre;
          this.filteredEmpresas = this.DataEmpresa;
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  ObtenerNombreFormacion(id: number) {
    let busquedaFormacion = this.DataFormacion.find((x: any) => x.id == id);
    if (busquedaFormacion != null) {
      return busquedaFormacion.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreTipoEstudio(id: number) {
    let busquedaTipoEstudio = this.DataTipoEstudio.find((x: any) => x.id == id);
    if (busquedaTipoEstudio != null) {
      return busquedaTipoEstudio.nombre;
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
  ObtenerNombreAreaTrabajoV2(id: number): string {
    const busquedaAreaFormacion = this.DataAreaTrabajo.find(
      (x: any) => x.id == id
    );

    return busquedaAreaFormacion?.nombre ?? 'No encontró';
  }
  ObtenerNombreAbrevAreaTrabajo(id: number) {
    const busquedaAreaAbrevFormacion = this.DataAreaTrabajo.find(
      (x: any) => x.id == id
    );

    return busquedaAreaAbrevFormacion?.codigo ?? 'No encontró';
  }
  ObtenerNombreEstadoEstudio(id: number) {
    let busquedaEstadoEstudio = this.DataEstadoEstudio.find(
      (x: any) => x.id == id
    );
    if (busquedaEstadoEstudio != null) {
      return busquedaEstadoEstudio.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreNivelCompetenciaTecnica(id: number | null) {
    if (id === null || id === undefined || id === 0) {
      return '-Seleccione Nivel-';
    }

    let busquedaNivelCompetenciaTecnica = this.DataNivelCompetenciaTecnica.find(
      (x: any) => Number(x.id) === Number(id)
    );

    return busquedaNivelCompetenciaTecnica
      ? busquedaNivelCompetenciaTecnica.nombre
      : 'No encontró';
  }
  ObtenerNombreNivelIdioma(id: number) {
    let busquedaNivelIdioma = this.DataNivelIdioma.find((x: any) => x.id == id);
    if (busquedaNivelIdioma != null) {
      return busquedaNivelIdioma.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreIdioma(id: number) {
    let busquedaIdioma = this.DataIdioma.find((x: any) => x.id == id);
    if (busquedaIdioma != null) {
      return busquedaIdioma.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreEmpresa(id: number): string {
    const busquedaEmpresa = this.DataEmpresa?.find(
      (empresa: any) => empresa.id === id
    );
    return busquedaEmpresa ? busquedaEmpresa.nombre : 'No se encontró';
  }
  ObtenerIdViaUrbana(nombreDireccion: string) {
    const primeraPalabra = nombreDireccion.split(' ')[0];
    const busquedaIdioma = this.DataTipoVia.find(
      (x: any) => x.nombre.toLowerCase() === primeraPalabra.toLowerCase()
    );
    if (busquedaIdioma != null) {
      return busquedaIdioma.id;
    } else {
      return '';
    }
  }

  ObtenerZonaUrbana(idZonaUrbana: number): string {
    const zonaEncontrada = this.DataTipoZonaUrbana.find(
      (zona) => zona.id === idZonaUrbana
    );
    return zonaEncontrada ? zonaEncontrada.nombre : 'No encontrado';
  }
  ObtenerTipoVia(idTipoViaUrbana: number): string {
    const zonaEncontrada = this.DataTipoVia.find(
      (zona) => zona.id === idTipoViaUrbana
    );
    return zonaEncontrada ? zonaEncontrada.nombre : 'No encontrado';
  }
  ObtenerIdZonaUrbana(nombreDireccion: string) {
    const primeraPalabra = nombreDireccion.split(' ')[0];
    const busquedaIdioma = this.DataTipoZonaUrbana.find(
      (x: any) => x.nombre.toLowerCase() === primeraPalabra.toLowerCase()
    );
    if (busquedaIdioma != null) {
      return busquedaIdioma.id;
    } else {
      return '';
    }
  }
  ObtenerLoteZonaUrbana(nombreDireccion: string) {
    const partesDireccion = nombreDireccion.split(' ');
    const ultimoValor = partesDireccion[partesDireccion.length - 1];
    return ultimoValor;
  }
  ObtenerManzanaZonUrbana(nombreDireccion: string) {
    const partesDireccion = nombreDireccion.trim().split(/\s+/);

    if (partesDireccion.length < 3) {
      return '';
    }

    const manzana = partesDireccion[partesDireccion.length - 2];
    return isNaN(Number(manzana)) ? '' : manzana;
  }

  ObtenerDireccionZonaUrbana(nombreDireccion: string) {
    const partesDireccion = nombreDireccion.trim().split(/\s+/);
    if (partesDireccion.length < 3) {
      return '';
    }
    const textoExcluido = partesDireccion.slice(0, partesDireccion.length - 2);
    return textoExcluido.join(' ');
  }
  VerificarTipoVia(nombreDireccion?: string) {
    if (!nombreDireccion) {
      this.tmpcontrolviadireccion = false;
      return;
    }
    const primeraPalabra = nombreDireccion.split(' ')[0];
    const esTipoVia = this.DataTipoVia.some(
      (via) => via.nombre.toLowerCase() === primeraPalabra.toLowerCase()
    );
    if (esTipoVia) {
      this.tmpcontrolviadireccion = true;
    } else {
      this.tmpcontrolviadireccion = false;
    }
  }

  ObtenerDireccionSinTipoVia(nombreDireccion: string) {
    const partesDireccion = nombreDireccion.split(' ');
    partesDireccion.shift();
    return partesDireccion.join(' ');
  }

  ObtenerNombreAreadeEmpresa(id: number) {
    let busquedaAreadeEmpresa = this.DataArea.find((x: any) => x.id == id);
    if (busquedaAreadeEmpresa != null) {
      return busquedaAreadeEmpresa.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreCargo(id: number) {
    let busquedaCargo = this.DataCargo.find((x: any) => x.id == id);
    if (busquedaCargo != null) {
      return busquedaCargo.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreParentesco(id: number) {
    let busquedaParentesco = this.DataParentesco.find((x: any) => x.id == id);
    if (busquedaParentesco != null) {
      return busquedaParentesco.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreTipoDocumento(id: number) {
    let busquedaTipoDocumento = this.DataTipoDocumento.find(
      (x: any) => x.id == id
    );
    if (busquedaTipoDocumento != null) {
      return busquedaTipoDocumento.nombre;
    } else {
      return 'No encontro';
    }
  }
  ObtenerNombreSexo(id: number) {
    let busquedaSexo = this.DataSexo.find((x: any) => x.id == id);
    if (busquedaSexo != null) {
      return busquedaSexo.nombre;
    } else {
      return 'No encontro';
    }
  }
  filteredEmpresas: any[] = [];
  onEmpresaFilter(value: string): void {
    if (value.length < 3) {
      // Si escribe menos de 3 caracteres, la lista queda vacía
      this.filteredEmpresas = [];
    } else {
      // Filtra la lista si se escriben al menos 3 caracteres
      this.filteredEmpresas = this.DataEmpresa.filter((empresa: any) =>
        empresa.nombre.toLowerCase().includes(value.toLowerCase())
      );
    }
  }
  /*Grillas configurarGrid */
  configurarGrid() {
    this.gridPersonalFormacion.habilitarEstadoNewRow = true;
    this.gridPersonalInformatica.habilitarEstadoNewRow = true;
    this.gridPersonalIdiomas.habilitarEstadoNewRow = true;
    this.gridPersonalCertificacion.habilitarEstadoNewRow = true;
    this.gridPersonalExperiencia.habilitarEstadoNewRow = true;
    this.gridPersonalFamiliar.habilitarEstadoNewRow = true;
    this.gridPersonalInformacionMedica.habilitarEstadoNewRow = true;
    this.gridPersonalHistorialMedico.habilitarEstadoNewRow = true;
    this.gridAccesoTemporal.habilitarEstadoNewRow = true;
    this.gridPersonalFormacion.formGroup = this._formBuilder.group({
      idCentroEstudio: [null],
      idEstadoEstudio: [null],
      idPersonalTipoFuncion: [null],
      idAreaFormacion: [null],
      fechaInicio: [null],
      logro: [null],
      fechaFin: [null],
      idPersonalArchivo: [null],
      idTipoEstudio: [null],
      alaActualidad: [null],
    });
    this.gridPersonalInformatica.formGroup = this._formBuilder.group({
      idCentroEstudio: [null],
      idNivelCompetenciaTecnica: [null],
      idPersonalArchivo: [null],
      programa: [null],
    });
    this.gridPersonalIdiomas.formGroup = this._formBuilder.group({
      idCentroEstudio: [null],
      idIdioma: [null],
      idNivelIdioma: [null],
      idPersonalArchivo: [null],
    });

    this.gridPersonalCertificacion.formGroup = this._formBuilder.group({
      idCentroEstudio: [null],
      fechaCertificacion: [null],
      idPersonalArchivo: [null],
      programa: [null],
    });
    this.gridPersonalExperiencia.formGroup = this._formBuilder.group({
      idEmpresa: [null],
      idAreaTrabajo: [null],
      idCargo: [null],
      fechaIngreso: [null],
      fechaRetiro: [null],
      motivoRetiro: [null],
      nombreJefeInmediato: [null],
      telefonoJefeInmediato: [null],
      idPersonalArchivo: [null],
    });
    this.gridPersonalFamiliar.formGroup = this._formBuilder.group({
      idParentescoPersonal: [null],
      nombres: [null],
      apellidos: [null],
      idSexo: [null],
      fechaNacimiento: [null],
      idTipoDocumentoPersonal: [null],
      numeroDocumento: [null],
      numeroReferencia: [null],
      derechoHabiente: [null],
      esContactoInmediato: [null],
    });
    this.gridPersonalInformacionMedica.formGroup = this._formBuilder.group({
      alergia: [null],
      precaucion: [null],
    });
    this.gridPersonalHistorialMedico.formGroup = this._formBuilder.group({
      enfermedad: [null],
      detalleEnfermedad: [null],
      periodo: [''],
    });
    this.gridPersonalFormacion.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });

    this.gridPersonalInformatica.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridPersonalIdiomas.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridPersonalCertificacion.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridPersonalExperiencia.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridPersonalFamiliar.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridPersonalFormacion.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridPersonalFormacion.data.splice(resp.index, 1);
          this.gridPersonalFormacion.data = [
            ...this.gridPersonalFormacion.data,
          ];
        }
      });
    });
    this.gridPersonalInformatica.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridPersonalInformatica.data.splice(resp.index, 1);
          this.gridPersonalInformatica.data = [
            ...this.gridPersonalInformatica.data,
          ];
        }
      });
    });
    this.gridPersonalInformacionMedica.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridPersonalHistorialMedico.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridPersonalCertificacion.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridPersonalCertificacion.data.splice(resp.index, 1);
          this.gridPersonalCertificacion.data = [
            ...this.gridPersonalCertificacion.data,
          ];
        }
      });
    });
    this.gridPersonalIdiomas.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridPersonalIdiomas.data.splice(resp.index, 1);
          this.gridPersonalIdiomas.data = [...this.gridPersonalIdiomas.data];
        }
      });
    });
    this.gridPersonalExperiencia.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridPersonalExperiencia.data.splice(resp.index, 1);
          this.gridPersonalExperiencia.data = [
            ...this.gridPersonalExperiencia.data,
          ];
        }
      });
    });
    this.gridPersonalFamiliar.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridPersonalFamiliar.data.splice(resp.index, 1);
          this.gridPersonalFamiliar.data = [...this.gridPersonalFamiliar.data];
        }
      });
    });
    this.gridPersonalInformacionMedica.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridPersonalInformacionMedica.data.splice(resp.index, 1);
          this.gridPersonalInformacionMedica.data = [
            ...this.gridPersonalInformacionMedica.data,
          ];
        }
      });
    });
    this.gridPersonalHistorialMedico.removeEvent$.subscribe((resp) => {
      this._alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridPersonalHistorialMedico.data.splice(resp.index, 1);
          this.gridPersonalHistorialMedico.data = [
            ...this.gridPersonalHistorialMedico.data,
          ];
        }
      });
    });
    this.gridPersonalFormacion.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          idCentroEstudio: number;
          idEstadoEstudio: number;
          idPersonalTipoFuncion: number;
          idAreaFormacion: number;
          fechaInicio: Date;
          fechaFin: Date;
          idPersonalArchivo: boolean;
          idTipoEstudio: number;
          alaActualidad: boolean;
          logro: string;
        };
        // Encuentra el índice del elemento modificado en "this.gridContactos.data"
        const index = this.gridPersonalFormacion.data.findIndex(
          (PuestoDependencia) => PuestoDependencia.id === resp.dataItem.id
        );

        // Actualiza el elemento en el array con el nuevo valor
        if (index !== -1) {
          this.gridPersonalFormacion.data[index].idCentroEstudio =
            valorForm.idCentroEstudio;
          this.gridPersonalFormacion.data[index].idEstadoEstudio =
            valorForm.idEstadoEstudio;
          this.gridPersonalFormacion.data[index].idPersonalTipoFuncion =
            valorForm.idPersonalTipoFuncion;
          this.gridPersonalFormacion.data[index].idAreaFormacion =
            valorForm.idAreaFormacion;
          this.gridPersonalFormacion.data[index].fechaInicio =
            valorForm.fechaInicio;
          this.gridPersonalFormacion.data[index].fechaFin = valorForm.fechaFin;
          this.gridPersonalFormacion.data[index].idPersonalArchivo =
            valorForm.idPersonalArchivo;
          this.gridPersonalFormacion.data[index].idTipoEstudio =
            valorForm.idTipoEstudio;
          this.gridPersonalFormacion.data[index].alaActualidad =
            valorForm.alaActualidad;
          this.gridPersonalFormacion.data[index].logro = valorForm.logro;
        }
      },
    });
    this.gridPersonalExperiencia.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          idEmpresa: number;
          idAreaTrabajo: number;
          idCargo: number;
          fechaIngreso: Date;
          fechaRetiro: Date;
          motivoRetiro: string;
          nombreJefeInmediato: string;
          telefonoJefeInmediato: string;
          idPersonalArchivo: boolean;
        };
        const index = this.gridPersonalExperiencia.data.findIndex(
          (Experiencia) => Experiencia.id === resp.dataItem.id
        );
        if (index !== -1) {
          this.gridPersonalExperiencia.data[index].idEmpresa =
            valorForm.idEmpresa;
          this.gridPersonalExperiencia.data[index].idAreaTrabajo =
            valorForm.idAreaTrabajo;
          this.gridPersonalExperiencia.data[index].idCargo = valorForm.idCargo;
          this.gridPersonalExperiencia.data[index].fechaIngreso =
            valorForm.fechaIngreso;
          this.gridPersonalExperiencia.data[index].fechaRetiro =
            valorForm.fechaRetiro;
          this.gridPersonalExperiencia.data[index].motivoRetiro =
            valorForm.motivoRetiro;
          this.gridPersonalExperiencia.data[index].nombreJefeInmediato =
            valorForm.nombreJefeInmediato;
          this.gridPersonalExperiencia.data[index].telefonoJefeInmediato =
            valorForm.telefonoJefeInmediato;
          this.gridPersonalExperiencia.data[index].idPersonalArchivo =
            valorForm.idPersonalArchivo;
        }
      },
    });
    this.gridPersonalInformatica.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          idCentroEstudio: number;
          idNivelCompetenciaTecnica: number;
          idPersonalArchivo: number;
          programa: string;
        };
        const index = this.gridPersonalInformatica.data.findIndex(
          (PuestoDependencia) => PuestoDependencia.id === resp.dataItem.id
        );

        if (index !== -1) {
          this.gridPersonalInformatica.data[index].idCentroEstudio =
            valorForm.idCentroEstudio;
          this.gridPersonalInformatica.data[index].idNivelCompetenciaTecnica =
            valorForm.idNivelCompetenciaTecnica;
          this.gridPersonalInformatica.data[index].idPersonalArchivo =
            valorForm.idPersonalArchivo;
          this.gridPersonalInformatica.data[index].programa =
            valorForm.programa;
        }
      },
    });
    this.gridPersonalIdiomas.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          idCentroEstudio: number;
          idIdioma: number;
          idNivelIdioma: number;
          idPersonalArchivo: number;
        };

        const index = this.gridPersonalIdiomas.data.findIndex(
          (PersonalIdiomas) => PersonalIdiomas.id === resp.dataItem.id
        );
        if (index !== -1) {
          this.gridPersonalIdiomas.data[index].idCentroEstudio =
            valorForm.idCentroEstudio;
          this.gridPersonalIdiomas.data[index].idIdioma = valorForm.idIdioma;
          this.gridPersonalIdiomas.data[index].idNivelIdioma =
            valorForm.idNivelIdioma;
          this.gridPersonalIdiomas.data[index].idPersonalArchivo =
            valorForm.idPersonalArchivo;
        }
      },
    });
    this.gridPersonalCertificacion.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          idCentroEstudio: number;
          fechaCertificacion: Date;
          idPersonalArchivo: number;
          programa: string;
        };
        const index = this.gridPersonalCertificacion.data.findIndex(
          (PuestoDependencia) => PuestoDependencia.id === resp.dataItem.id
        );

        if (index !== -1) {
          this.gridPersonalCertificacion.data[index].idCentroEstudio =
            valorForm.idCentroEstudio;
          this.gridPersonalCertificacion.data[index].fechaCertificacion =
            valorForm.fechaCertificacion;
          this.gridPersonalCertificacion.data[index].idPersonalArchivo =
            valorForm.idPersonalArchivo;
          this.gridPersonalCertificacion.data[index].programa =
            valorForm.programa;
        }
      },
    });
    this.gridPersonalFamiliar.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          idParentescoPersonal: number;
          nombres: string;
          apellidos: string;
          idSexo: number;
          fechaNacimiento: Date;
          idTipoDocumentoPersonal: number;
          numeroDocumento: string;
          numeroReferencia: string;
          derechoHabiente: boolean;
          esContactoInmediato: boolean;
        };
        const index = this.gridPersonalFamiliar.data.findIndex(
          (PuestoDependencia) => PuestoDependencia.id === resp.dataItem.id
        );

        if (index !== -1) {
          this.gridPersonalFamiliar.data[index].idParentescoPersonal =
            valorForm.idParentescoPersonal;
          this.gridPersonalFamiliar.data[index].nombres = valorForm.nombres;
          this.gridPersonalFamiliar.data[index].apellidos = valorForm.apellidos;
          this.gridPersonalFamiliar.data[index].idSexo = valorForm.idSexo;
          this.gridPersonalFamiliar.data[index].fechaNacimiento =
            valorForm.fechaNacimiento;
          this.gridPersonalFamiliar.data[index].idTipoDocumentoPersonal =
            valorForm.idTipoDocumentoPersonal;
          this.gridPersonalFamiliar.data[index].numeroDocumento =
            valorForm.numeroDocumento;
          this.gridPersonalFamiliar.data[index].numeroReferencia =
            valorForm.numeroReferencia;
          this.gridPersonalFamiliar.data[index].derechoHabiente =
            valorForm.derechoHabiente;
          this.gridPersonalFamiliar.data[index].esContactoInmediato =
            valorForm.esContactoInmediato;
        }
      },
    });
    this.gridPersonalInformacionMedica.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          alergia: string;
          precaucion: string;
        };
        const index = this.gridPersonalInformacionMedica.data.findIndex(
          (PersonalInformacionMedica) =>
            PersonalInformacionMedica.id === resp.dataItem.id
        );

        if (index !== -1) {
          this.gridPersonalInformacionMedica.data[index].alergia =
            valorForm.alergia;
          this.gridPersonalInformacionMedica.data[index].precaucion =
            valorForm.precaucion;
        }
      },
    });
    this.gridPersonalHistorialMedico.getUpdateEvent$().subscribe({
      next: (resp) => {
        let valorForm = resp.formGroup.getRawValue() as {
          enfermedad: string;
          detalleEnfermedad: string;
        };
        const index = this.gridPersonalHistorialMedico.data.findIndex(
          (PersonalInformacionMedica) =>
            PersonalInformacionMedica.id === resp.dataItem.id
        );

        if (index !== -1) {
          this.gridPersonalHistorialMedico.data[index].enfermedad =
            valorForm.enfermedad;
          this.gridPersonalHistorialMedico.data[index].detalleEnfermedad =
            valorForm.detalleEnfermedad;
        }
      },
    });
    this.gridPersonalFormacion.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridFormacionAcademica;

      let item: FormacionAcademicaDTO = {
        idCentroEstudio: valorForm.idCentroEstudio,
        idEstadoEstudio: valorForm.idEstadoEstudio,
        idPersonalTipoFuncion: valorForm.idPersonalTipoFuncion,
        idAreaFormacion: valorForm.idAreaFormacion,
        fechaInicio: valorForm.fechaInicio,
        fechaFin: valorForm.fechaFin,
        idPersonalArchivo: valorForm.idPersonalArchivo,
        idTipoEstudio: valorForm.idTipoEstudio,
        alaActualidad: valorForm.alaActualidad,
        logro: valorForm.logro,
        idPersonal: this.isNew ? 0 : this.dataItemTemp.id,
      };

      this.gridPersonalFormacion.data = [
        item,
        ...this.gridPersonalFormacion.data,
      ];
    });
    this.gridPersonalInformatica.saveEvent$.subscribe((resp) => {
      let valorForm =
        resp.formGroup.getRawValue() as GridConocimientoInformatica;

      let item: ConocimientoInformaticaDTO = {
        idCentroEstudio: valorForm.idCentroEstudio,
        idNivelCompetenciaTecnica: valorForm.idNivelCompetenciaTecnica,
        idPersonalArchivo: valorForm.idPersonalArchivo,
        programa: valorForm.programa,
      };

      this.gridPersonalInformatica.data = [
        item,
        ...this.gridPersonalInformatica.data,
      ];
    });
    this.gridPersonalIdiomas.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridIdiomas;

      let item: IdiomasDTO = {
        idCentroEstudio: valorForm.idCentroEstudio,
        idIdioma: valorForm.idIdioma,
        idNivelIdioma: valorForm.idNivelIdioma,
        idPersonalArchivo: valorForm.idPersonalArchivo,
      };

      this.gridPersonalIdiomas.data = [item, ...this.gridPersonalIdiomas.data];
    });
    this.gridPersonalCertificacion.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridCertificaciones;

      let item: CertificacionesDTO = {
        idCentroEstudio: valorForm.idCentroEstudio,
        fechaCertificacion: valorForm.fechaCertificacion,
        idPersonalArchivo: valorForm.idPersonalArchivo,
        programa: valorForm.programa,
      };

      this.gridPersonalCertificacion.data = [
        item,
        ...this.gridPersonalCertificacion.data,
      ];
    });
    this.gridPersonalExperiencia.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridExperienciaLaboral;

      let item: ExperienciaLaboralDTO = {
        idEmpresa: valorForm.idEmpresa,
        idAreaTrabajo: valorForm.idAreaTrabajo,
        idCargo: valorForm.idCargo,
        fechaIngreso: valorForm.fechaIngreso,
        fechaRetiro: valorForm.fechaRetiro,
        motivoRetiro: valorForm.motivoRetiro,
        nombreJefeInmediato: valorForm.nombreJefeInmediato,
        telefonoJefeInmediato: valorForm.telefonoJefeInmediato,
        idPersonalArchivo: valorForm.idPersonalArchivo,
        idPersonal: 0,
      };

      this.gridPersonalExperiencia.data = [
        item,
        ...this.gridPersonalExperiencia.data,
      ];
    });
    this.gridPersonalFamiliar.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as GridPersonalFamiliar;

      let item: PersonalFamiliarDTO = {
        idParentescoPersonal: valorForm.idParentescoPersonal,
        nombres: valorForm.nombres,
        apellidos: valorForm.apellidos,
        idSexo: valorForm.idSexo,
        fechaNacimiento: valorForm.fechaNacimiento,
        idTipoDocumentoPersonal: valorForm.idTipoDocumentoPersonal,
        numeroDocumento: valorForm.numeroDocumento,
        numeroReferencia: valorForm.numeroReferencia,
        derechoHabiente: valorForm.derechoHabiente,
        esContactoInmediato: valorForm.esContactoInmediato,
      };

      this.gridPersonalFamiliar.data = [
        item,
        ...this.gridPersonalFamiliar.data,
      ];
    });
    this.gridPersonalInformacionMedica.saveEvent$.subscribe((resp) => {
      let valorForm =
        resp.formGroup.getRawValue() as GridPersonalInformacionMedica;

      let item: PersonalInformacionMedicaDTO = {
        alergia: valorForm.alergia,
        precaucion: valorForm.precaucion,
      };

      this.gridPersonalInformacionMedica.data = [
        item,
        ...this.gridPersonalInformacionMedica.data,
      ];
    });
    this.gridPersonalHistorialMedico.saveEvent$.subscribe((resp) => {
      let valorForm =
        resp.formGroup.getRawValue() as GridPersonalHistorialMedico;

      let item: PersonalHistorialMedicoDTO = {
        enfermedad: valorForm.enfermedad,
        detalleEnfermedad: valorForm.detalleEnfermedad,
      };

      this.gridPersonalHistorialMedico.data = [
        item,
        ...this.gridPersonalHistorialMedico.data,
      ];
    });
  }

  filteredCursos: CursosAsignadosAccesosPortalDTO[] = [];
  // Método para obtener los datos iniciales
  ObtenerPEspecificoPersonalAccesoTemporalCombo() {
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.PersonalObtenerPEspecificoPersonalAccesoTemporalCombo
      )
      .subscribe({
        next: (resp: HttpResponse<AccesosPortal>) => {
          this.DataPEspecificosPersonal = resp.body;
          this.DataPEspecificosPersonalProgramaAsignado =
            resp.body.programasAsignados;
          this.DataPEspecificosPersonalCursosAsignados =
            resp.body.cursosAsignados;

          // Inicializa el filtrado con todos los cursos disponibles
          this.filteredCursos = [
            ...this.DataPEspecificosPersonalCursosAsignados,
          ];
        },
        error: (error) => {
          console.log('Error al obtener datos');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  // Método para manejar el cambio en el programa seleccionado
  onProgramSelectionChange(selectedProgramId: number | null): void {
    if (selectedProgramId !== null) {
      // Filtra los cursos relacionados con el programa seleccionado
      this.filteredCursos = this.DataPEspecificosPersonalCursosAsignados.filter(
        (curso) => curso.idPEspecificoPadre === selectedProgramId
      );

      // Selecciona automáticamente el primer curso si existen cursos filtrados
      if (this.filteredCursos.length > 0) {
        const defaultCourseId = this.filteredCursos[0].idPEspecifico;
        this.formConfigurarAccesos
          .get('idPEspecifico')
          ?.setValue([defaultCourseId]);
      } else {
        // Limpia el multiselect si no hay cursos disponibles
        this.formConfigurarAccesos.get('idPEspecifico')?.setValue([]);
      }
    } else {
      this.filteredCursos = [];
      this.formConfigurarAccesos.get('idPEspecifico')?.setValue([]);
    }
  }

  ObtenerDatosPersonal(idPersonal: number) {
    this.gridAreasDeTrabajo.loading = true;
    this.gridTipoAsesorHistorico.loading = true;
    this.gridJefeInmediatoHistorico.loading = true;
    this.gridPeriodoInactivoHistorico.loading = true;
    this.gridPersonalFormacion.loading = true;
    this.gridPersonalInformatica.loading = true;
    this.gridPersonalIdiomas.loading = true;
    this.gridPersonalCertificacion.loading = true;

    this.gridPersonalExperiencia.loading = true;
    this.gridPersonalFamiliar.loading = true;
    this.gridPersonalInformacionMedica.loading = true;
    this.gridPersonalHistorialMedico.loading = true;
    this.gridAccesoTemporal.loading = true;
    this._integraService
      .getJsonResponse(
        constApiGestionPersonal.PersonalObtenerInformacionPersonal +
          '/' +
          idPersonal
      )
      .subscribe({
        next: (resp: HttpResponse<DatosFichaDePersonal>) => {
          this.gridAreasDeTrabajo.data = resp.body.listaPuestoTrabajo;
          this.gridTipoAsesorHistorico.data =
            resp.body.listaTipoAsesorHistorico;
          this.gridJefeInmediatoHistorico.data =
            resp.body.listaJefeInmediatoHistorico;
          this.gridPeriodoInactivoHistorico.data =
            resp.body.listaPeriodoInactivoHistorico;
          this.gridPersonalFormacion.data = resp.body.formacion;
          this.gridPersonalInformatica.data = resp.body.computo;
          this.gridPersonalIdiomas.data = resp.body.idioma;
          this.gridPersonalCertificacion.data = resp.body.certificacion;
          this.gridPersonalExperiencia.data = resp.body.experiencia;
          this.gridPersonalFamiliar.data = resp.body.datoFamiliar;
          this.gridPersonalInformacionMedica.data = resp.body.informacionMedica;
          this.gridPersonalHistorialMedico.data = resp.body.historialMedico;
          this.gridAccesoTemporal.data = resp.body.listaAccesoTemporal;
          this.DataPersonalFicha = resp.body.datosPersonal;
          this.formDatosPersonal
            .get('apellidos')
            .setValue(resp.body.datosPersonal.apellidos);
          this.formDatosPersonal
            .get('nombres')
            .setValue(resp.body.datosPersonal.nombres);
          this.formDatosPersonal
            .get('telefonoFijo')
            .setValue(resp.body.datosPersonal.fijoReferencia);
          this.formDatosPersonal
            .get('telefonoMovil')
            .setValue(resp.body.datosPersonal.movilReferencia);
          this.formDatosPersonal
            .get('emailReferencia')
            .setValue(resp.body.datosPersonal.emailReferencia);
          this.formDatosPersonal
            .get('idTipoDocumento')
            .setValue(resp.body.datosPersonal.idTipoDocumento);
          this.formDatosPersonal
            .get('numeroDocumento')
            .setValue(resp.body.datosPersonal.numeroDocumento);
          this.formDatosPersonal
            .get('idEstadocivil')
            .setValue(resp.body.datosPersonal.idEstadoCivil);
          this.formDatosPersonal
            .get('idSexo')
            .setValue(resp.body.datosPersonal.idSexo);
          this.formDatosPersonal
            .get('idPaisNacimiento')
            .setValue(resp.body.datosPersonal.idPaisNacimiento);
          this.formDatosPersonal
            .get('fechaNacimiento')
            .setValue(new Date(resp.body.datosPersonal.fechaNacimiento));
          this.formDatosPersonal
            .get('idCiudadNacimiento')
            .setValue(resp.body.datosPersonal.idCiudad);
          this.formDatosPersonal
            .get('idPaisReferencia')
            .setValue(resp.body.datosPersonal.idPaisDireccion);
          this.formDatosPersonal
            .get('idCiudadReferencia')
            .setValue(resp.body.datosPersonal.idRegionDireccion);
          this.formDatosPersonal
            .get('distritoDireccion')
            .setValue(resp.body.datosPersonal.distritoDireccion);
          if (resp.body.datosPersonal.nombreDireccion != null) {
            this.VerificarTipoVia(resp.body.datosPersonal.nombreDireccion);
            if (this.tmpcontrolviadireccion == true) {
              this.formDatosPersonal
                .get('idTipoViaUrbana')
                .setValue(
                  this.ObtenerIdViaUrbana(
                    resp.body.datosPersonal.nombreDireccion
                  )
                );
              if (resp.body.personalDireccion != null && resp.body.personalDireccion.length >0) {
                this.formDatosPersonal
                  .get('nombreDireccion')
                  .setValue(
                    resp.body.personalDireccion[
                      resp.body.personalDireccion.length - 1
                    ].nombreVia
                  );
              }
            } else {
              this.formDatosPersonal
                .get('idZonaUrbana')
                .setValue(
                  this.ObtenerIdZonaUrbana(
                    resp.body.datosPersonal.nombreDireccion
                  )
                );
              if (resp.body.personalDireccion != null && resp.body.personalDireccion.length >0) {
                this.formDatosPersonal
                  .get('manzana')
                  .setValue(
                    resp.body.personalDireccion[
                      resp.body.personalDireccion.length - 1
                    ].manzana
                  );
                this.formDatosPersonal
                  .get('lote')
                  .setValue(
                    resp.body.personalDireccion.length
                      ? resp.body.personalDireccion[
                          resp.body.personalDireccion.length - 1
                        ].lote || ''
                      : ''
                  );
                this.formDatosPersonal
                  .get('nombreDireccion')
                  .setValue(
                    resp.body.personalDireccion.length
                      ? resp.body.personalDireccion[
                          resp.body.personalDireccion.length - 1
                        ].nombreZonaUrbana || ''
                      : ''
                  );
              }

              this.formDatosPersonal.get('idTipoViaUrbana').setValue(null);
            }
          }
          this.formPersonalSistemaPensionario
            .get('idSistemaPensionario')
            .setValue(
              resp.body.sistemaPensionario[
                resp.body.sistemaPensionario.length - 1
              ]?.idSistemaPensionario
            );
          this.formPersonalSistemaPensionario
            .get('codigoAfiliado')
            .setValue(
              resp.body.sistemaPensionario?.length > 0
                ? resp.body.sistemaPensionario[
                    resp.body.sistemaPensionario.length - 1
                  ]?.codigoAfiliado
                : ''
            );
          this.formPersonalSistemaPensionario
            .get('idEntidadSistemaPensionario')
            .setValue(
              resp.body.sistemaPensionario[
                resp.body.sistemaPensionario.length - 1
              ]?.idEntidadSistemaPensionario
            );
          this.formPersonalSeguroSalud
            .get('idEntidadSeguroSalud')
            .setValue(resp.body.datosPersonal.idEntidadSeguroSalud);
          this.formPersonalRemuneracion
            .get('idTipoPagoRemuneracion')
            .setValue(
              resp.body.personalRemuneracion[
                resp.body.personalRemuneracion.length - 1
              ]?.idTipoPagoRemuneracion
            );
          this.formPersonalRemuneracion
            .get('idEntidadFinanciera')
            .setValue(
              resp.body.personalRemuneracion[
                resp.body.personalRemuneracion.length - 1
              ]?.idEntidadFinanciera
            );
          this.formPersonalRemuneracion
            .get('numeroCuenta')
            .setValue(
              resp.body?.personalRemuneracion?.length
                ? resp.body.personalRemuneracion[
                    resp.body.personalRemuneracion.length - 1
                  ].numeroCuenta || ''
                : ''
            );

          this.formDatosPersonal
            .get('email')
            .setValue(resp.body.datosPersonal.email);
          this.formDatosPersonal
            .get('idArea')
            .setValue(resp.body.datosPersonal.idPersonalAreaTrabajo);
          this.formDatosPersonal
            .get('idPuestoTrabajo')
            .setValue(resp.body.datosPersonal.idPuestoTrabajo);
          this.formDatosPersonal
            .get('idJefe')
            .setValue(resp.body.datosPersonal.idJefe);
          this.formDatosPersonal
            .get('idSede')
            .setValue(resp.body.datosPersonal.idSedeTrabajo);
          this.formDatosPersonal
            .get('idPuestoTrabajoNivel')
            .setValue(resp.body.datosPersonal.idPuestoTrabajoNivel);
          this.formDatosPersonal
            .get('idTableroComercialCategoriaAsesor')
            .setValue(
              resp.body.datosPersonal.idTableroComercialCategoriaAsesor
            );
          this.formDatosPersonal
            .get('central')
            .setValue(resp.body.datosPersonal.central);
          this.formDatosPersonal
            .get('anexo3CX')
            .setValue(resp.body.datosPersonal.anexo3CX);
          this.formDatosPersonal
            .get('urlFirma')
            .setValue(resp.body.datosPersonal.urlFirmaCorreos);
          let estadoId =
            this.DataEstado.find(
              (e) =>
                e.nombre.toLowerCase() ===
                (resp.body.datosPersonal.activo ? 'activo' : 'inactivo')
            )?.id || null;

          this.formDatosPersonal.get('estadoPersonalActivo').setValue(estadoId);
          if (resp.body.datosPersonal.activo == true) {
            if (estadoId != 1) {
              this.valorEstado = false;
            } else {
              this.valorEstado = true;
            }
          }
          this.formPersonalDescanso
            .get('idMotivoInactividad')
            .setValue(resp.body.datoPersonalDescanso?.motivoInactividad);
          this.formPersonalDescanso
            .get('fechaInicioDescanso')
            .setValue(new Date(resp.body.datoPersonalDescanso?.fechaInicio));
          this.formPersonalDescanso
            .get('fechaFinDescanso')
            .setValue(new Date(resp.body.datoPersonalDescanso?.fechaFin));
          //this.formPersonalCese.get('idestadoContrato').setValue(resp.body.datoPersonalDescanso?.estado);
          this.formPersonalCese
            .get('idMotivoCese')
            .setValue(resp.body.datosPersonalCese?.idMotivoCese);
          this.formPersonalCese
            .get('fechaCese')
            .setValue(new Date(resp.body.datosPersonalCese?.fechaCese));
          this.formDatosPersonal
            .get('idTipoSangre')
            .setValue(resp.body.datosPersonal.idTipoSangre);
          this.gridAreasDeTrabajo.loading = false;
          this.gridTipoAsesorHistorico.loading = false;
          this.gridJefeInmediatoHistorico.loading = false;
          this.gridPeriodoInactivoHistorico.loading = false;
          this.gridPersonalFormacion.loading = false;
          this.gridPersonalInformatica.loading = false;
          this.gridPersonalIdiomas.loading = false;
          this.gridPersonalCertificacion.loading = false;
          this.gridPersonalExperiencia.loading = false;
          this.gridPersonalFamiliar.loading = false;
          this.gridPersonalInformacionMedica.loading = false;
          this.gridPersonalHistorialMedico.loading = false;
          this.gridAccesoTemporal.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridFichaDatosPersonal.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  /* ---------------Guardar Nuevo Ficha Datos Personal ------------------------*/
  guardar() {
    console.log('click guardar');
    if (this.formDatosPersonal.valid) {
      this.formDatosPersonal.disable();
      this.formPersonalCese.disable();
      this.formPersonalDireccion.disable();
      this.formPersonalRemuneracion.disable();
      this.formPersonalSeguroSalud.disable();
      this.formPersonalSistemaPensionario.disable();
      this.formPersonalDescanso.disable();

      let jsonEnvio = this.procesarFichaDatosPersonal();
      this.gridFichaDatosPersonal.loading = true;
      this.enProcesoSolicitud = true;

      this._integraService
        .postJsonResponse(
          constApiGestionPersonal.PersonalInsertarFichaDatosPersonal,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<boolean>) => {
            this.gridFichaDatosPersonal.loading = false;
            this.enProcesoSolicitud = false;
            this.gridFichaDatosPersonal.data.unshift(resp.body);
            this.gridFichaDatosPersonal.loadData();
            this.obtenerTodo();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
            this.formDatosPersonal.enable();
            this.formPersonalCese.enable();
            this.formPersonalDireccion.enable();
            this.formPersonalRemuneracion.enable();
            this.formPersonalSeguroSalud.enable();
            this.formPersonalSistemaPensionario.enable();
            this.formPersonalDescanso.enable();
          },
          error: (error) => {
            this.gridFichaDatosPersonal.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el partner',
            });
            this.gridFichaDatosPersonal.loading = false;
          },
        });
    } else {
      this.formDatosPersonal.markAllAsTouched();
      this.gridFichaDatosPersonal.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
      this.formDatosPersonal.enable();
      this.formPersonalCese.enable();
      this.formPersonalDireccion.enable();
      this.formPersonalRemuneracion.enable();
      this.formPersonalSeguroSalud.enable();
      this.formPersonalSistemaPensionario.enable();
      this.formPersonalDescanso.enable();
    }
  }

  get personalForm(): PersonalDTOv2 {
    return this.formDatosPersonal.getRawValue() as PersonalDTOv2;
  }
  get personalCeseForm(): PersonalCese {
    return this.formPersonalCese.getRawValue() as PersonalCese;
  }
  get personalDireccionForm(): PersonalDireccion {
    return this.formDatosPersonal.getRawValue() as PersonalDireccion;
  }
  get personalRemuneracionForm(): PersonalRemuneracionV2 {
    return this.formPersonalRemuneracion.getRawValue() as PersonalRemuneracionV2;
  }
  get personalSeguroSaludForm(): PersonalSeguroSaludDTO {
    return this.formPersonalSeguroSalud.getRawValue() as PersonalSeguroSaludDTO;
  }
  get personalSistemaPensionarioForm(): PersonalSistemaPensionarioDTO {
    return this.formPersonalSistemaPensionario.getRawValue() as PersonalSistemaPensionarioDTO;
  }

  get personalDescansoForm(): PersonalDescanso {
    return this.formPersonalDescanso.getRawValue() as PersonalDescanso;
  }

  procesarFichaDatosPersonal() {
    let personal: PersonalDTOv2 = {
      id: this.isNew ? 0 : this.dataItemTemp.id, // Usa ?? para valores nulos o undefined
      apellidos: this.personalForm.apellidos,
      distritoDireccion: this.personalForm.distritoDireccion ?? '',
      emailReferencia: this.personalForm.emailReferencia ?? '',
      fechaNacimiento: this.personalForm.fechaNacimiento ?? null,
      idCiudadNacimiento: this.personalForm.idCiudadNacimiento ?? null,
      idCiudadReferencia: this.personalForm.idCiudadReferencia ?? null,
      idEstadocivil: this.personalForm.idEstadocivil ?? null,
      idPaisNacimiento: this.personalForm.idPaisNacimiento ?? null,
      idPaisReferencia: this.personalForm.idPaisReferencia ?? null,
      idSexo: this.personalForm.idSexo ?? null,
      idTipoDocumento: this.personalForm.idTipoDocumento ?? null,
      nombreDireccion:
        [
          this.ObtenerZonaUrbana(this.personalDireccionForm.idZonaUrbana),
          this.personalForm.nombreDireccion,
          this.personalForm.manzana,
          this.personalForm.lote,
        ]
          .filter(Boolean)
          .join(' ') || '',
      nombres: this.personalForm.nombres,
      numeroDocumento: this.personalForm.numeroDocumento ?? '',
      telefonoFijo: this.personalForm.telefonoFijo ?? '',
      telefonoMovil: this.personalForm.telefonoMovil ?? '',
      email: this.personalForm.email ?? '',
      idJefe: this.personalForm.idJefe ?? null,
      tipoPersonal: this.personalForm.tipoPersonal ?? '',
      central: this.personalForm.central ?? '',
      anexo3CX: this.personalForm.anexo3CX ?? '',
      urlFirmaCorreos: this.personalForm.urlFirmaCorreos ?? '',
      activo: this.personalForm.activo ?? true, // Se asegura que activo no sea undefined
      area: this.ObtenerNombreAreaTrabajoV2(this.personalForm.idArea) ?? '',
      areaAbrev:
        this.ObtenerNombreAbrevAreaTrabajo(this.personalForm.idArea) ?? '',
      idPuestoTrabajo: this.personalForm.idPuestoTrabajo ?? null,
      idSede: this.personalForm.idSede ?? null,
      idTipoSangre: this.personalForm.idTipoSangre ?? null,
      esCerrador: this.personalForm.esCerrador ?? false,
      idAsesorAsociado: this.personalForm.idAsesorAsociado ?? null,
      idPuestoTrabajoNivel: this.personalForm.idPuestoTrabajoNivel ?? null,
      idPersonalArchivo: this.personalForm.idPersonalArchivo ?? null,
      idPersonalAreaTrabajo: this.personalForm.idPersonalAreaTrabajo ?? null,
      idTableroComercialCategoriaAsesor:
        this.personalForm.idTableroComercialCategoriaAsesor ?? null,
    };
    let personalCese: PersonalCese = {
      id: this.personalCeseForm.id ? this.personalCeseForm.id : 0,
      idMotivoCese: this.personalCeseForm.idMotivoCese,
      fechaCese: this.personalCeseForm.fechaCese,
    };
    let personalDireccion: PersonalDireccion = {
      idPais: this.personalForm.idPaisReferencia ?? null,
      idCiudad: this.personalForm.idCiudadReferencia ?? null,
      distrito: this.personalDireccionForm.distrito ?? null,
      lote: this.personalForm.lote
        ? Number(this.personalDireccionForm.lote)
        : null, // Convierte a número o asigna null
      manzana: this.personalForm.manzana ?? null,
      nombreVia: this.personalForm.nombreDireccion ?? null,
      nombreZonaUrbana: this.personalForm.nombreDireccion ?? null,
      tipoVia:
        this.ObtenerTipoVia(this.personalDireccionForm.idTipoViaUrbana) ?? null,
      tipoZonaUrbana:
        this.ObtenerZonaUrbana(this.personalDireccionForm.idZonaUrbana) ?? null,
      esModificado: this.isNew ? this.personalDireccionForm.esModificado : true,
    };
    let personalRemuneracion: PersonalRemuneracionV2 = {
      idTipoPagoRemuneracion:
        this.personalRemuneracionForm.idTipoPagoRemuneracion,
      idEntidadFinanciera: this.personalRemuneracionForm.idEntidadFinanciera,
      numeroCuenta: this.personalRemuneracionForm.numeroCuenta,
      esModificado: this.isNew
        ? this.personalRemuneracionForm.esModificado
        : true,
    };
    let personalSeguroSalud: PersonalSeguroSaludDTO = {
      idEntidadSeguroSalud: this.personalSeguroSaludForm.idEntidadSeguroSalud,
      esModificado: this.isNew
        ? this.personalSeguroSaludForm.esModificado
        : true,
    };
    let personalSistemaPensionario: PersonalSistemaPensionarioDTO = {
      idSistemaPensionario:
        this.personalSistemaPensionarioForm.idSistemaPensionario,
      idEntidadSistemaPensionario:
        this.personalSistemaPensionarioForm.idEntidadSistemaPensionario,
      codigoAfiliado: this.personalSistemaPensionarioForm.codigoAfiliado,
      esModificado: this.isNew
        ? this.personalSistemaPensionarioForm.esModificado
        : true,
    };

    let personalDescanso: PersonalDescanso = {
      fechaInicioDescanso: this.personalDescansoForm.fechaInicioDescanso,
      fechaFinDescanso: this.personalDescansoForm.fechaFinDescanso,
      esModificado: this.personalDescansoForm.esModificado,
    };

    let FichaDatosPersonalJson: GuardarFichaDatosPersonal = {
      personal: personal,
      personalCese: personalCese,
      personalDescanso: personalDescanso,
      personalRemuneracion: personalRemuneracion,
      personalCertificacion: this.gridPersonalCertificacion.data,
      personalExperiencia: this.gridPersonalExperiencia.data,
      personalFamiliar: this.gridPersonalFamiliar.data,
      personalFormacion: this.gridPersonalFormacion.data,
      personalHistorialMedico: this.gridPersonalHistorialMedico.data,
      personalIdiomas: this.gridPersonalIdiomas.data,
      personalInformacionMedica: this.gridPersonalInformacionMedica.data,
      personalInformatica: this.gridPersonalInformatica.data,
      personalSeguroSalud: personalSeguroSalud,
      personalSistemaPensionario: personalSistemaPensionario,
      personalDireccion: personalDireccion,
    };
    return FichaDatosPersonalJson;
  }

  get AccesoTemporal(): FormPersonalGrupoAccesoTemporal {
    return this.formConfigurarAccesos.getRawValue() as FormPersonalGrupoAccesoTemporal;
  }

  procesarAccesoTemporal() {
    let lista: number[] = [];

    // Verifica si idPEspecificoHijo está definido y si es un array válido
    if (
      Array.isArray(this.AccesoTemporal?.idPEspecificoHijo) &&
      this.AccesoTemporal.idPEspecificoHijo.length > 0
    ) {
      lista = this.AccesoTemporal.idPEspecificoHijo;
    } else if (this.AccesoTemporal?.idPEspecificoHijo) {
      lista.push(this.AccesoTemporal.idPEspecificoHijo);
    } else {
      lista = [this.AccesoTemporal?.idPEspecificoPadre ?? 0]; // Usar idPEspecificoPadre como fallback
    }

    let accesos: PersonalGrupoAccesoTemporalDTO = {
      idPersonal: this.idPersonalTmp,
      idPEspecificoPadre: this.AccesoTemporal?.idPEspecificoPadre ?? null,
      idPEspecificoPadreAnterior: null,
      evaluacionHabilitada: !!this.AccesoTemporal?.evaluacionHabilitada,
      listaPEspecificoHijo: lista,
      fechaInicio: this.AccesoTemporal?.fechaInicio ?? null,
      fechaFin: this.AccesoTemporal?.fechaFin ?? null,
      fechaInicioAnterior: null,
      fechaFinAnterior: null,
    };

    console.log('Datos a enviar:', accesos);
    return accesos;
  }

  descargaArchivoDescarga: DescargarArchivoDTO;
  archivoMostrar: ArchivoDTO;

  BuscarArchivoMostrar(idPersonalArchivo: number) {
    if (idPersonalArchivo && idPersonalArchivo > 0) {
      this.gridFichaDatosPersonal.loading = true;
      this._integraService
        .getJsonResponse(
          constApiGestionPersonal.PersonalObtenerArchivoPersonal +
            '/' +
            idPersonalArchivo
        )
        .subscribe({
          next: (resp: HttpResponse<ArchivoDTO>) => {
            this.archivoMostrar = resp.body;
            if (this.archivoMostrar && this.archivoMostrar.datos.rutaArchivo) {
      
              const googleUrl = this.archivoMostrar.datos.rutaArchivo;
              console.log('Ruta : ', this.archivoMostrar.datos.rutaArchivo);
              window.open(
                googleUrl,
                '_blank',
                'width=800,height=600,scrollbars=yes,resizable=yes'
              );
            } else {
              this._alertaService.notificationWarning(
                'No se encontró el archivo solicitado.'
              );
            }
            this.gridFichaDatosPersonal.loading = false;
          },
          error: (error) => {
            console.log('Error en la carga del archivo', error);
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
            this.gridFichaDatosPersonal.loading = false;
          },
        });
    } else {
      this._alertaService.notificationWarning(
        'No se encontró archivo asociado.'
      );
    }
  }

  BuscarArchivoDescargar(idPersonalArchivo: number) {
    if (idPersonalArchivo && idPersonalArchivo > 0) {
      this.gridFichaDatosPersonal.loading = true;
      this._integraService
        .getJsonResponse(
          constApiGestionPersonal.PersonalDescargarArchivoPersonal +
            '/' +
            idPersonalArchivo
        )
        .subscribe({
          next: (resp: HttpResponse<DescargarArchivoDTO>) => {
            this.descargaArchivoDescarga = resp.body;
            if (this.descargaArchivoDescarga) {
              const numeroDocumento = this.personalForm.numeroDocumento || '';
              const link = document.createElement('a');
              link.hidden = true;
              document.body.appendChild(link);

              if (this.descargaArchivoDescarga.esImagen) {
                link.href = `data:image/png;base64,${this.descargaArchivoDescarga.rutaArchivo}`;
              } else {
                link.href = `data:application/pdf;base64,${this.descargaArchivoDescarga.rutaArchivo}`;
                link.target = '_blank';
              }

              link.download = `Archivo Personal ${numeroDocumento}`;
              link.click();
              document.body.removeChild(link);
            } else {
              this._alertaService.notificationWarning(
                this.descargaArchivoDescarga.mensaje
              );
            }
          },

          error: (error) => {
            console.log('aqui entro error');
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }
  }

  eliminar(id: number) {
    // Usar SweetAlert para mostrar un mensaje de confirmación
    this.enProcesoSolicitud = true;
    Swal.fire({
      title: '¿Estás seguro de eliminar el Registro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.gridFichaDatosPersonal.data.findIndex(
          (x) => x.id === id
        );
        if (index != -1) {
        }
        this.gridFichaDatosPersonal.loading = true;
        this._integraService
          .deleteJsonResponse(
            `${constApiGestionPersonal.PersonalEliminarPersonal}/${id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridFichaDatosPersonal.loading = false;
              if (response.body === true) {
                this.gridFichaDatosPersonal.data.splice(index, 1);
                this.gridFichaDatosPersonal.loadView();
                this._alertaService.mensajeIcon(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success'
                );
                this.obtenerTodo();
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
              this.gridFichaDatosPersonal.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              this._alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }

  /* ---------------Guardar Nuevo Ficha Datos Personal ------------------------*/
  async actualizar() {
    if (this.formDatosPersonal.valid) {
      this.formDatosPersonal.disable();
      this.formPersonalCese.disable();
      this.formPersonalDireccion.disable();
      this.formPersonalRemuneracion.disable();
      this.formPersonalSeguroSalud.disable();
      this.formPersonalSistemaPensionario.disable();
      this.formPersonalDescanso.disable();

      this.gridFichaDatosPersonal.loading = true;
      this.enProcesoSolicitud = true;

      try {
        // 🔹 1. Subir archivos antes de actualizar
        await this.subirArchivos();

        // 🔹 2. Procesar los datos después de subir los archivos
        let jsonEnvio = this.procesarFichaDatosPersonal();
        // 🔹 3. Enviar la solicitud de actualización
        this._integraService
          .putJsonResponse(
            constApiGestionPersonal.PersonalActualizarFichaDatosPersonal,
            JSON.stringify(jsonEnvio)
          )
          .subscribe({
            next: (resp: HttpResponse<boolean>) => {
              this.gridFichaDatosPersonal.loading = false;
              this.enProcesoSolicitud = false;
              this.gridFichaDatosPersonal.data.unshift(resp.body);
              this.gridFichaDatosPersonal.loadData();
              this.obtenerTodo();
              this.modalRef.close();
              this._alertaService.mensajeExitoso();
              this.formDatosPersonal.enable();
              this.formPersonalCese.enable();
              this.formPersonalDireccion.enable();
              this.formPersonalRemuneracion.enable();
              this.formPersonalSeguroSalud.enable();
              this.formPersonalSistemaPensionario.enable();
              this.formPersonalDescanso.enable();

              console.log('repuesta actualizar', resp.body);
            },
            error: (error) => {
              this.gridFichaDatosPersonal.loading = false;
              this.enProcesoSolicitud = false;
              this._alertaService.notificationWarning(error.message);
              this._alertaService.swalFireOptions({
                icon: 'error',
                text: 'No se pudo actualizar el dato',
              });
              this.formDatosPersonal.enable();
              this.formPersonalCese.enable();
              this.formPersonalDireccion.enable();
              this.formPersonalRemuneracion.enable();
              this.formPersonalSeguroSalud.enable();
              this.formPersonalSistemaPensionario.enable();
              this.formPersonalDescanso.enable();
            },
          });
      } catch (error) {
        console.error('Error al subir archivos:', error);
        this.gridFichaDatosPersonal.loading = false;
        this.enProcesoSolicitud = false;
        this._alertaService.notificationWarning(
          'Error al subir archivos. No se realizó la actualización.'
        );
      }
    } else {
      this.formDatosPersonal.markAllAsTouched();
      this.gridFichaDatosPersonal.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }
  guardarAccesosPortal() {
    let jsonEnvio = this.procesarAccesoTemporal();
    this.gridFichaDatosPersonal.loading = true;
    this.gridAccesoTemporal.loading = true;
    this.enProcesoSolicitud = true;

    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.PersonalActualizarAccesoTemporal,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.gridFichaDatosPersonal.loading = false;
          this.gridAccesoTemporal.loading = false;
          this.enProcesoSolicitud = false;
          this.gridFichaDatosPersonal.data.unshift(resp.body);
          this.gridFichaDatosPersonal.loadData();
          this.obtenerTodo();
          this.modalRef.close();
          this._alertaService.mensajeExitoso();
        },
        error: (error) => {
          this.gridFichaDatosPersonal.loading = false;
          this.gridAccesoTemporal.loading = false;
          this.enProcesoSolicitud = false;
          this._alertaService.notificationWarning(error.message);
          this._alertaService.swalFireOptions({
            icon: 'error',
            text: 'No se pudo guardar el Accesos',
          });
          this.gridFichaDatosPersonal.loading = false;
          this.gridAccesoTemporal.loading = false;
        },
      });
  }

  eliminarAcceso(dataItem: any) {
    let jsonEnvio: EliminarAccesosDto = {
      idPersonal: dataItem?.idPersonal ?? null,
      idPEspecificoPadre: dataItem?.idPEspecificoPadre ?? null,
      fechaFin: dataItem?.fechaFin ?? null,
      fechaInicio: dataItem?.fechaInicio ?? null,
    };

    // Usar SweetAlert para confirmar eliminación
    this.enProcesoSolicitud = true;
    Swal.fire({
      title: '¿Estás seguro de eliminar el acceso?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        let index = this.gridAccesoTemporal.data.findIndex(
          (x) => x.id === dataItem.id
        );
        if (index !== -1) {
          this.gridAccesoTemporal.loading = true;

          this._integraService
            .deleteJsonResponse(
              constApiGestionPersonal.PersonalEliminarAccesoTemporal,
              JSON.stringify(jsonEnvio)
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridAccesoTemporal.loading = false;
                if (response.body === true) {
                  // **Eliminamos el registro directamente de la grilla**
                  this.gridAccesoTemporal.data.splice(index, 1);

                  // **Forzar actualización de la vista**
                  this.gridAccesoTemporal.data = [
                    ...this.gridAccesoTemporal.data,
                  ];
                  this.gridAccesoTemporal.loadView();

                  this._alertaService.mensajeIcon(
                    '¡Eliminado!',
                    'El acceso ha sido eliminado correctamente.',
                    'success'
                  );

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
                this.gridAccesoTemporal.loading = false;
                let mensaje = this._alertaService.getMessageErrorService(error);
                this._alertaService.notificationWarning(mensaje);
              },
            });
        }
      }
    });
  }
  valorTipoEstado: boolean = true;
  valorTipoEstado2: boolean = true;
  ObtenerEstado(id: any) {
    if (id == 2) {
      this.valorEstado = false;
    } else {
      this.valorEstado = true;
    }
  }
  ObtenerTipoEstado(id: any) {
    if (id == null) {
      this.valorTipoEstado = true;
      this.valorTipoEstado2 = true;
    } else {
    }
    if (id == 1) {
      this.valorTipoEstado = false;
      this.valorTipoEstado2 = true;
    } else {
      this.valorTipoEstado2 = false;
      this.valorTipoEstado = true;
    }
  }

  listaArchivosFormacion: any[] = [];
  listaArchivosInformatica: any[] = [];
  listaArchivosIdioma: any[] = []; // 🔹 Aquí se define la lista para evitar el error
  listaArchivosCertificacion: any[] = [];
  listaArchivosExperiencia: any[] = [];
  onFileUploadSuccess(event: any, formGroup: FormGroup): void {
    console.log('eventUp', event);
    const archivoSubido = event.files[0];
    console.log('archivoSubido', archivoSubido);
    formGroup.get('archivo')?.setValue(archivoSubido);
  }
  onFileSelect(event: any, formGroup: FormGroup) {
    const archivo = event.files?.[0]?.rawFile;
  
    if (archivo) {
      console.log('Archivo seleccionado:', archivo);
      console.log('Tamaño del archivo:', archivo.size);
      console.log('Tipo de archivo:', archivo.type);
  
      formGroup.get('archivo')?.setValue(archivo);
  
      this.SubirArchivo(archivo)
        .then((idArchivo) => {
          console.log('ID de archivo recibido:', idArchivo);
          formGroup.get('idPersonalArchivo')?.setValue(idArchivo);
        })
        .catch((error) => {
          console.error('Error al subir el archivo:', error);
        });
    }
  }
  
  clickButton(){
    console.log('click')
  }
  async subirArchivos() {
    let listaSubida: Promise<void>[] = [];
    console.log('listaSubida', listaSubida);
    const asignarIdArchivo = async (
      listaDatos: any[],
      listaArchivos: any[]
    ) => {
      for (let item of listaDatos) {
        let archivo = listaArchivos.find((x) => x.uid === item.uid);
        if (archivo) {
          try {
            let idArchivo = await this.SubirArchivo(archivo);
            console.log('idArchivo', idArchivo);
            item.idPersonalArchivo = idArchivo;
          } catch (error) {
            console.error('Error asignando ID de archivo:', error);
          }
        }
      }
    };

    if (this.gridPersonalFormacion.data.length > 0) {
      listaSubida.push(
        asignarIdArchivo(
          this.gridPersonalFormacion.data,
          this.listaArchivosFormacion
        )
      );
    }
    if (this.gridPersonalInformatica.data.length > 0) {
      listaSubida.push(
        asignarIdArchivo(
          this.gridPersonalInformatica.data,
          this.listaArchivosInformatica
        )
      );
    }
    if (this.gridPersonalIdiomas.data.length > 0) {
      listaSubida.push(
        asignarIdArchivo(
          this.gridPersonalIdiomas.data,
          this.listaArchivosIdioma
        )
      );
    }
    if (this.gridPersonalCertificacion.data.length > 0) {
      listaSubida.push(
        asignarIdArchivo(
          this.gridPersonalCertificacion.data,
          this.listaArchivosCertificacion
        )
      );
    }
    if (this.gridPersonalExperiencia.data.length > 0) {
      listaSubida.push(
        asignarIdArchivo(
          this.gridPersonalExperiencia.data,
          this.listaArchivosExperiencia
        )
      );
    }

    await Promise.all(listaSubida);
    console.log('Todas las subidas de archivos han finalizado.');
  }

  async SubirArchivo(archivo: File): Promise<string> {
    console.log('subirArchivo-file', archivo);
    return new Promise((resolve, reject) => {
      try {
        console.log(' Intentando subir archivo:', archivo);

        let formData = new FormData();
        formData.append('File', archivo);

        console.log(
          'Enviando request a:',
          constApiGestionPersonal.PersonalAdjuntarArchivoPersonal
        );

        this._integraService
          .postFormDataResponse(
            constApiGestionPersonal.PersonalAdjuntarArchivoPersonal,
            formData
          )
          .subscribe({
            next: (resp: any) => {
              console.log('Respuesta recibida:', resp);
              console.log('idarchivo', resp.idArchivo);
              if (resp && resp.idArchivo) {
                console.log('📎 Archivo subido con ID:', resp.idArchivo);
                resolve(resp.idArchivo);
              } else {
                console.error(' No se recibió ID de archivo');
                reject('No se recibió ID de archivo');
              }
            },
            error: (error) => {
              console.error(' Error al subir archivo:', error);
              reject(error);
            },
          });

        console.log(' Request enviada, esperando respuesta...');
      } catch (error) {
        console.error(' Error en la función SubirArchivo:', error);
        reject(error);
      }
    });
  }

  /* ------------------Funcionamiento de Horario  ------------------------------*/
  abrirModalHorario(
    context: any,
    isNew: boolean,
    dataItem?: FichaDatosPersonal
  ) {
    this.horarioForm.reset();
    this.isNew = isNew;
    this.idPersonalTmp = dataItem.id;
    // this.cargarDias();
    this.obtenerHorarios(dataItem.id);
    this.modalRef = this._modalService.open(context, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
  }
  obtenerHorarios(id: number) {
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.PersonalObteneHorarioPorId}/${id}`
      )
      .subscribe({
        next: (resp: HttpResponse<HorarioDTO[]>) => {
          if (resp && resp.body) {
            let horarioData = resp.body[0];
            if (resp.body.length > 0) {
              horarioData = resp.body[resp.body.length - 1];
            }
            this.horarioForm.patchValue(horarioData);
            this.cdRef.detectChanges();
          }
        },
        error: (error) => {
          console.error('Error obteniendo horarios:', error);
        },
      });
  }

  diasSemana = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
    'domingo',
  ];

  guardarHorario() {
    const formValues = this.horarioForm.value;

    const convertirHora = (hora: string | null): string | null => {
      return hora ? `${hora}` : null;
    };
    let jsonEnvio = {
      IdPersonal: this.idPersonalTmp,
      Usuario: '',
      Id: 0,
      Lunes1: convertirHora(formValues.lunes1),
      Lunes2: convertirHora(formValues.lunes2),
      Lunes3: convertirHora(formValues.lunes3),
      Lunes4: convertirHora(formValues.lunes4),
      Martes1: convertirHora(formValues.martes1),
      Martes2: convertirHora(formValues.martes2),
      Martes3: convertirHora(formValues.martes3),
      Martes4: convertirHora(formValues.martes4),
      Miercoles1: convertirHora(formValues.miercoles1),
      Miercoles2: convertirHora(formValues.miercoles2),
      Miercoles3: convertirHora(formValues.miercoles3),
      Miercoles4: convertirHora(formValues.miercoles4),
      Jueves1: convertirHora(formValues.jueves1),
      Jueves2: convertirHora(formValues.jueves2),
      Jueves3: convertirHora(formValues.jueves3),
      Jueves4: convertirHora(formValues.jueves4),
      Viernes1: convertirHora(formValues.viernes1),
      Viernes2: convertirHora(formValues.viernes2),
      Viernes3: convertirHora(formValues.viernes3),
      Viernes4: convertirHora(formValues.viernes4),
      Sabado1: convertirHora(formValues.sabado1),
      Sabado2: convertirHora(formValues.sabado2),
      Sabado3: convertirHora(formValues.sabado3),
      Sabado4: convertirHora(formValues.sabado4),
      Domingo1: convertirHora(formValues.domingo1),
      Domingo2: convertirHora(formValues.domingo2),
      Domingo3: convertirHora(formValues.domingo3),
      Domingo4: convertirHora(formValues.domingo4),
    };

    this.gridFichaDatosPersonal.loading = true;
    this.enProcesoSolicitud = true;

    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.PersonalGuardarHorario,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.gridFichaDatosPersonal.loading = false;
          this.enProcesoSolicitud = false;
          this.gridFichaDatosPersonal.data.unshift(resp.body);
          this.gridFichaDatosPersonal.loadData();
          this.obtenerTodo();
          this.modalRef.close();
          this._alertaService.mensajeExitoso();
        },
        error: (error) => {
          this.gridFichaDatosPersonal.loading = false;
          this.enProcesoSolicitud = false;
          this._alertaService.notificationWarning(error.message);
          this._alertaService.swalFireOptions({
            icon: 'error',
            text: 'No se pudo guardar el Registro',
          });
          this.gridFichaDatosPersonal.loading = false;
        },
      });
  }
  actualizarAccesosPortal()
  {
    let jsonEnvio = this.procesarActualizarAccesoTemporal();
    this.gridFichaDatosPersonal.loading = true;
    this.gridAccesoTemporal.loading = true;
    this.enProcesoSolicitud = true;

    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.PersonalActualizarAccesoTemporal,
        JSON.stringify(jsonEnvio)
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          this.gridFichaDatosPersonal.loading = false;
          this.gridAccesoTemporal.loading = false;
          this.enProcesoSolicitud = false;
          this.gridFichaDatosPersonal.data.unshift(resp.body);
          this.gridFichaDatosPersonal.loadData();
          this.obtenerTodo();
          this.modalRef.close();
          this._alertaService.mensajeExitoso();
        },
        error: (error) => {
          this.gridFichaDatosPersonal.loading = false;
          this.gridAccesoTemporal.loading = false;
          this.enProcesoSolicitud = false;
          this._alertaService.notificationWarning(error.message);
          this._alertaService.swalFireOptions({
            icon: 'error',
            text: 'No se pudo guardar el Accesos',
          });
          this.gridFichaDatosPersonal.loading = false;
          this.gridAccesoTemporal.loading = false;
        },
      });
  }


  procesarActualizarAccesoTemporal() {
    let lista: number[] = [];

    if (
      Array.isArray(this.AccesoTemporal?.idPEspecificoHijo) &&
      this.AccesoTemporal.idPEspecificoHijo.length > 0
    ) {
      lista = this.AccesoTemporal.idPEspecificoHijo;
    } else if (this.AccesoTemporal?.idPEspecificoHijo) {
      lista.push(this.AccesoTemporal.idPEspecificoHijo);
    } else {
      lista = [this.AccesoTemporal?.idPEspecificoPadre ?? 0];
    }

    let accesos: PersonalGrupoAccesoTemporalDTO = {
      idPersonal: this.idPersonalTmp,
      idPEspecificoPadre: this.AccesoTemporal?.idPEspecificoPadre ?? null,
      idPEspecificoPadreAnterior: this.dataItemAccesoTemp?.idPEspecificoPadre ?? null,
      evaluacionHabilitada: !!this.AccesoTemporal?.evaluacionHabilitada,
      listaPEspecificoHijo: lista,
      fechaInicio: this.AccesoTemporal?.fechaInicio ?? null,
      fechaFin: this.AccesoTemporal?.fechaFin ?? null,
      fechaInicioAnterior: this.dataItemAccesoTemp?.fechaInicio ?? null,
      fechaFinAnterior: this.dataItemAccesoTemp?.fechaFin ?? null,
    };

    return accesos;
  }
}

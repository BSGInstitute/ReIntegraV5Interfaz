import { TipoDocumento } from './../../models/interfaces/expositor';

import { HttpResponse } from '@angular/common/http';
import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FileRestrictions } from '@progress/kendo-angular-upload';

import {
  Ciudades,
  CombosModulo,
  Expositor,
} from '@planificacion/models/interfaces/expositor';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

interface FormDatosPersonales {
  tipoDocumento: number;
  nroDocumento: string;
  primerNombre: string;
  segundoNombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  paisProcedencia: number;
  ciudadProcedencia: number;
  idReferidoPor: number;
  idPersonalAsignado: number;
  fotoDofotoDocentecente: string;
}
interface FormUbicacion {
  telfCelular1: string;
  telfCelular2: string;
  telfCelular3: string;
  email1: string;
  email2: string;
  email3: string;
  domicilio: string;
  paisDomicilio: number;
  ciudadDomicilio: number;
  lugarTrabajo: string;
  paisLugarTrabajo: number;
  ciudadLugarTrabajo: number;
}
interface FormfAsistenteContacto {
  asistenteNombre: string;
  asistenteTelefono: string;
  asistenteCelular: string;
}
@Component({
  selector: 'app-gestion-docentes',
  templateUrl: './gestion-docentes.component.html',
  styleUrls: ['./gestion-docentes.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class GestionDocentesComponent implements OnInit, OnDestroy {
  @ViewChild('hojaVidaResumidaPerfil', { static: true })
  hojaVidaResumidaPerfil: any;
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private datePipe: DatePipe
  ) {}

  selectedCountry: number | null = null;
  gridExpositores: KendoGrid = new KendoGrid();
  urlfotoDocenteText: string;
  textUrl: string;
  modalRef: any;
  isNew: boolean = false;
  dataItemTemp: Expositor;

  formDatosPersonales: FormGroup = this._formBuilder.group({
    tipoDocumento: [null, Validators.required],
    nroDocumento: [null, Validators.required],
    primerNombre: [null, Validators.required],
    segundoNombre: null,
    apellidoPaterno: [null, Validators.required],
    apellidoMaterno: [null, Validators.required],
    idPersonalAsignado: null,
    fechaNacimiento: [null, Validators.required],
    coordinador: null,
    paisProcedencia: [null, Validators.required],
    ciudadProcedencia: null,
    idReferidoPor: null,
    fotoDocente: null,
    archivofoto: null,
  });
  formDatosUbicacion: FormGroup = this._formBuilder.group({
    telfCelular1: [null, Validators.required],
    telfCelular2: null,
    telfCelular3: null,
    email1: [null, Validators.required],
    email2: null,
    email3: null,
    domicilio: null,
    paisDomicilio: null,
    ciudadDomicilio: null,
    lugarTrabajo: null,
    paisLugarTrabajo: null,
    ciudadLugarTrabajo: null,
  });
  formAsistenteContacto: FormGroup = this._formBuilder.group({
    asistenteNombre: null,
    asistenteTelefono: null,
    asistenteCelular: null,
  });

  formDetalles: FormGroup = this._formBuilder.group({
    hojaVidaResumidaPerfil: null,
    hojaVidaResumidaSpeech: null,
    formacionAcademica: null,
    experienciaProfesional: null,
    publicaciones: null,
    premiosDistinciones: null,
    otraInformacion: null,
  });
  comboinitCiudades: any;
  comboauxCiudades: any;
  enProcesoSolicitud: boolean = false;
  comboPaises: IComboBase1[] = [];
  comboCiudadesAll: Ciudades[] = [];
  comboCiudadesP: Ciudades[] = [];
  comboCiudadesD: Ciudades[] = [];
  comboCiudadesT: Ciudades[] = [];

  comboTipoDocumento: TipoDocumento[] = [];
  comboExpositores: IComboBase1[] = [];
  comboCoordinadores: IComboBase1[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  
  ngOnInit(): void {
    this.obtener();
    this._obtenerCombosModulo();
  }

  ngOnDestroy(): void {}
  obtener() {
    this.gridExpositores.loading = true;
    this._integraService
      .getJsonResponse(constApiPlanificacion.ExpositorObtener)
      .subscribe({
        next: (resp: HttpResponse<Expositor[]>) => {
          resp.body.forEach((element) => {
            element.paisProcedencia = this.obtenerNombrePais(
              element.idPaisProcedencia
            );
            element.ciudadProcedencia = this.obtenerNombreCiudad(
              element.idCiudadProcedencia
            );
            element.paisProcedencia = this.obtenerNombreTipoDocumento(
              element.idTipoDocumento
            );
          });
          this.gridExpositores.data = resp.body;
          this.gridExpositores.loading = false;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.gridExpositores.loading = false;
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  private _obtenerCombosModulo() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.ExpositorObtenerCombosModulo)
      .subscribe({
        next: (resp: HttpResponse<CombosModulo>) => {
          this.comboTipoDocumento = resp.body.tipoDocumentos;
          this.comboCoordinadores = resp.body.coordinadores;
          this.comboPaises = resp.body.paises;
          this.comboCiudadesAll = resp.body.ciudades;
          this.comboauxCiudades = resp.body.ciudades;
          this.comboExpositores = resp.body.expositores;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerCiudadesdeporIdPaisProcedencia(id: any) {
    this.comboCiudadesP = [];
    this.formDatosPersonales.get('ciudadProcedencia').setValue(null);
    this.comboauxCiudades.forEach((element: any) => {
      if (element.idPais == id) {
        this.comboCiudadesP.push(element);
      }
    });
  }

  obtenerCiudadesdeporIdPaisDomicilio(id: any) {
    this.comboCiudadesD = [];
    this.formDatosUbicacion.get('ciudadDomicilio').setValue(null);
    this.comboauxCiudades.forEach((element: any) => {
      if (element.idPais == id) {
        this.comboCiudadesD.push(element);
      }
    });
  }
  obtenerCiudadesdeporIdPaisTrabajo(id: any) {
    this.comboCiudadesT = [];
    this.formDatosUbicacion.get('ciudadLugarTrabajo').setValue(null);
    this.comboauxCiudades.forEach((element: any) => {
      if (element.idPais == id) {
        this.comboCiudadesT.push(element);
      }
    });
  }

  abrirModalExpositor(context: any, isNew: boolean, dataItem?: Expositor) {
    this.isNew = isNew;
    this.formAsistenteContacto.reset();
    this.formDatosPersonales.reset();
    this.formDatosUbicacion.reset();
    this.formDetalles.reset();
    this.enProcesoSolicitud = false;
    if (!isNew) {
      this.dataItemTemp = dataItem;
      this.asignarValoresToForm(dataItem);
      this.textUrl = this.urlfotoDocenteText;
    } else {
      this.dataItemTemp = null;
    }
    this.modalRef = this._modalService.open(context, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
  }
  obtenerNombrePais(idPais: number) {
    let item = this.comboPaises.find((x) => x.id == idPais);
    if (item != null) {
      return item.nombre;
    }
    return null;
  }

  filtrarNombrePais(idPais: number) {
    let item = this.comboCiudadesP.filter((x) => x.idPais == idPais);
    let item2 = this.comboCiudadesD.filter((x) => x.idPais == idPais);
    let item3 = this.comboCiudadesT.filter((x) => x.idPais == idPais);
    if (item != null) {
      return item;
    }
    if (item2 != null) {
      return item2;
    }
    if (item3 != null) {
      return item3;
    }

    return null;
  }

  obtenerNombreCiudad(idCiudad: number) {
    let item = this.comboCiudadesAll.find((x) => x.id == idCiudad);

    if (item != null) {
      return item.nombre;
    }
    return null;
  }
  obtenerNombreTipoDocumento(idTipoDocumento: number) {
    let item = this.comboTipoDocumento.find((x) => x.id == idTipoDocumento);
    if (item != null) {
      return item.descripcion;
    }
    return null;
  }

  insertar() {
    if (this.formDatosPersonales.valid && this.formDatosUbicacion.valid) {
      let jsonEnvio = this.procesarDocentes();
      this.gridExpositores.loading = true;
      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.ExpositorInsertar,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<Expositor>) => {
            this.gridExpositores.loading = false;
            this.enProcesoSolicitud = false;
            this.subirImagen();
            this.gridExpositores.data.unshift(resp.body);
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
            this.gridExpositores.loadData();
          },
          error: (error) => {
            this.gridExpositores.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar GestionDocentes',
            });
          },
        });
    } else {
      this.formDatosPersonales.markAllAsTouched();
      this.formDatosUbicacion.markAllAsTouched();
      this.enProcesoSolicitud = false;
      this.gridExpositores.loading = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
      this.gridExpositores.loadData();
    }
  }

  get DocentesDatospersonalesForm(): FormDatosPersonales {
    return this.formDatosPersonales.getRawValue() as FormDatosPersonales;
  }
  get DocenteDatosUbicacionForm(): FormUbicacion {
    return this.formDatosUbicacion.getRawValue() as FormUbicacion;
  }
  get DocenteAsistenteContacto(): FormfAsistenteContacto {
    return this.formAsistenteContacto.getRawValue() as FormfAsistenteContacto;
  }
  get DocenteDetalles(): Expositor {
    return this.formDetalles.getRawValue() as Expositor;
  }
  procesarDocentes(): Expositor {
    let docentes: Expositor = {
      id: this.isNew ? 0 : this.dataItemTemp.id, // Usa this.dataItemPartnerTmp.id si no es un nuevo registro
      idTipoDocumento: this.DocentesDatospersonalesForm.tipoDocumento,
      nroDocumento: this.DocentesDatospersonalesForm.nroDocumento,
      primerNombre: this.DocentesDatospersonalesForm.primerNombre,
      segundoNombre: this.DocentesDatospersonalesForm.segundoNombre,
      apellidoPaterno: this.DocentesDatospersonalesForm.apellidoPaterno,
      apellidoMaterno: this.DocentesDatospersonalesForm.apellidoMaterno,
      idPersonalAsignado: this.DocentesDatospersonalesForm.idPersonalAsignado,
      fechaNacimiento: this.DocentesDatospersonalesForm.fechaNacimiento,
      idPaisProcedencia: this.DocentesDatospersonalesForm.paisProcedencia,
      idCiudadProcedencia: this.DocentesDatospersonalesForm.ciudadProcedencia,
      idReferidoPor: this.DocentesDatospersonalesForm.idReferidoPor,
      telfCelular1: this.DocenteDatosUbicacionForm.telfCelular1,
      telfCelular2: this.DocenteDatosUbicacionForm.telfCelular2,
      telfCelular3: this.DocenteDatosUbicacionForm.telfCelular3,
      email1: this.DocenteDatosUbicacionForm.email1,
      email2: this.DocenteDatosUbicacionForm.email2,
      email3: this.DocenteDatosUbicacionForm.email3,
      domicilio: this.DocenteDatosUbicacionForm.domicilio,
      idPaisDomicilio: this.DocenteDatosUbicacionForm.paisDomicilio,
      idCiudadDomicilio: this.DocenteDatosUbicacionForm.ciudadDomicilio,
      lugarTrabajo: this.DocenteDatosUbicacionForm.lugarTrabajo,
      idPaisLugarTrabajo: this.DocenteDatosUbicacionForm.paisLugarTrabajo,
      idCiudadLugarTrabajo: this.DocenteDatosUbicacionForm.ciudadLugarTrabajo,
      asistenteNombre: this.DocenteAsistenteContacto.asistenteNombre,
      asistenteTelefono: this.DocenteAsistenteContacto.asistenteTelefono,
      asistenteCelular: this.DocenteAsistenteContacto.asistenteCelular,
      hojaVidaResumidaPerfil: btoa(
        unescape(
          encodeURIComponent(this.DocenteDetalles.hojaVidaResumidaPerfil)
        )
      ),
      hojaVidaResumidaSpeech: this.DocenteDetalles.hojaVidaResumidaSpeech,
      formacionAcademica: this.DocenteDetalles.formacionAcademica,
      experienciaProfesional: this.DocenteDetalles.experienciaProfesional,
      publicaciones: this.DocenteDetalles.publicaciones,
      premiosDistinciones: this.DocenteDetalles.premiosDistinciones,
      otraInformacion: this.DocenteDetalles.otraInformacion,
      // fotoDocente: this.selectedFile,
      // urlFotoDocente: this.selectedFile,
    };
    let foto = this.formDatosPersonales.get('archivofoto').value as File[];
    if (foto != null && foto.length >= 1) {
      docentes.fotoDocente = foto[0].name;
      docentes.urlFotoDocente = foto[0].name;
    }

    return docentes;
  }

  asignarValoresToForm(dataItem: Expositor) {
    this.formDatosPersonales
      .get('tipoDocumento')
      .setValue(dataItem.idTipoDocumento);
    this.formDatosPersonales
      .get('nroDocumento')
      .setValue(dataItem.nroDocumento);
    this.formDatosPersonales
      .get('primerNombre')
      .setValue(dataItem.primerNombre);
    this.formDatosPersonales
      .get('segundoNombre')
      .setValue(dataItem.segundoNombre);
    this.formDatosPersonales
      .get('apellidoPaterno')
      .setValue(dataItem.apellidoPaterno);
    this.formDatosPersonales
      .get('apellidoMaterno')
      .setValue(dataItem.apellidoMaterno);
    this.formDatosPersonales
      .get('fechaNacimiento')
      .setValue(new Date(dataItem.fechaNacimiento));
    this.formDatosPersonales
      .get('paisProcedencia')
      .setValue(dataItem.idPaisProcedencia);

    this.obtenerCiudadesdeporIdPaisProcedencia(dataItem.idPaisProcedencia);

    this.formDatosPersonales
      .get('ciudadProcedencia')
      .setValue(dataItem.idCiudadProcedencia);
    this.formDatosPersonales
      .get('idReferidoPor')
      .setValue(dataItem.idReferidoPor);
    this.formDatosPersonales
      .get('idPersonalAsignado')
      .setValue(dataItem.idPersonalAsignado);

    this.formDatosUbicacion.get('telfCelular1').setValue(dataItem.telfCelular1);
    this.formDatosUbicacion.get('telfCelular2').setValue(dataItem.telfCelular2);
    this.formDatosUbicacion.get('telfCelular3').setValue(dataItem.telfCelular3);
    this.formDatosUbicacion.get('email1').setValue(dataItem.email1);
    this.formDatosUbicacion.get('email2').setValue(dataItem.email2);
    this.formDatosUbicacion.get('email3').setValue(dataItem.email3);
    this.formDatosUbicacion.get('domicilio').setValue(dataItem.domicilio);
    this.formDatosUbicacion
      .get('paisDomicilio')
      .setValue(dataItem.idPaisDomicilio);
    this.obtenerCiudadesdeporIdPaisDomicilio(dataItem.idPaisDomicilio);
    this.formDatosUbicacion
      .get('ciudadDomicilio')
      .setValue(dataItem.idCiudadDomicilio);

    this.formDatosUbicacion.get('lugarTrabajo').setValue(dataItem.lugarTrabajo);
    this.formDatosUbicacion
      .get('paisLugarTrabajo')
      .setValue(dataItem.idPaisLugarTrabajo);
    this.obtenerCiudadesdeporIdPaisTrabajo(dataItem.idPaisLugarTrabajo);
    this.formDatosUbicacion
      .get('ciudadLugarTrabajo')
      .setValue(dataItem.idCiudadLugarTrabajo);
    this.formAsistenteContacto
      .get('asistenteNombre')
      .setValue(dataItem.asistenteNombre);
    this.formAsistenteContacto
      .get('asistenteTelefono')
      .setValue(dataItem.asistenteTelefono);
    this.formAsistenteContacto
      .get('asistenteCelular')
      .setValue(dataItem.asistenteCelular);
    this.formDetalles
      .get('hojaVidaResumidaPerfil')
      .setValue(dataItem.hojaVidaResumidaPerfil);
    this.formDetalles
      .get('hojaVidaResumidaSpeech')
      .setValue(dataItem.hojaVidaResumidaSpeech);
    this.formDetalles
      .get('formacionAcademica')
      .setValue(dataItem.formacionAcademica);
    this.formDetalles
      .get('experienciaProfesional')
      .setValue(dataItem.experienciaProfesional);
    this.formDetalles.get('publicaciones').setValue(dataItem.publicaciones);
    this.formDetalles
      .get('premiosDistinciones')
      .setValue(dataItem.premiosDistinciones);
    this.formDetalles.get('otraInformacion').setValue(dataItem.otraInformacion);
    this.formDatosPersonales.get('fotoDocente').setValue(dataItem.fotoDocente);

    /*  this.formDatosPersonales.get('esPersonaValida').setValue(dataItem.esPersonaValida);
    this.formDatosPersonales.get('idPersonalAsignado').setValue(dataItem.idPersonalAsignado);
    this.formDatosPersonales.get('urlFotoDocente').setValue(dataItem.urlFotoDocente); */
  }

  actualizar() {
    const materialAccion = this.procesarDocentes();
    this.gridExpositores.loading = true;
    this.enProcesoSolicitud = true;
    if (this.formDatosPersonales.valid && this.formDatosUbicacion.valid) {
      this._integraService
        .putJsonResponse(
          constApiPlanificacion.ExpositorActualizar,
          JSON.stringify(materialAccion)
        )
        .subscribe({
          next: (resp: HttpResponse<Expositor>) => {
            // Actualiza el objeto dataItem con la respuesta del servidor.
            this.dataItemTemp.idTipoDocumento = resp.body.idTipoDocumento;
            this.dataItemTemp.nroDocumento = resp.body.nroDocumento;
            this.dataItemTemp.primerNombre = resp.body.primerNombre;
            this.dataItemTemp.segundoNombre = resp.body.segundoNombre;
            this.dataItemTemp.apellidoPaterno = resp.body.apellidoPaterno;
            this.dataItemTemp.apellidoMaterno = resp.body.apellidoMaterno;
            this.dataItemTemp.fechaNacimiento = resp.body.fechaNacimiento;
            this.dataItemTemp.idPaisProcedencia = resp.body.idPaisProcedencia;
            this.dataItemTemp.idCiudadProcedencia =
              resp.body.idCiudadProcedencia;
            this.dataItemTemp.idReferidoPor = resp.body.idReferidoPor;
            this.dataItemTemp.telfCelular1 = resp.body.telfCelular1;
            this.dataItemTemp.telfCelular2 = resp.body.telfCelular2;
            this.dataItemTemp.telfCelular3 = resp.body.telfCelular3;
            this.dataItemTemp.email1 = resp.body.email1;
            this.dataItemTemp.email2 = resp.body.email2;
            this.dataItemTemp.email3 = resp.body.email3;
            this.dataItemTemp.domicilio = resp.body.domicilio;
            this.dataItemTemp.idPaisDomicilio = resp.body.idPaisDomicilio;
            this.dataItemTemp.idCiudadDomicilio = resp.body.idCiudadDomicilio;
            this.dataItemTemp.lugarTrabajo = resp.body.lugarTrabajo;
            this.dataItemTemp.idPaisLugarTrabajo = resp.body.idPaisLugarTrabajo;
            this.dataItemTemp.idCiudadLugarTrabajo =
              resp.body.idCiudadLugarTrabajo;
            this.dataItemTemp.asistenteNombre = resp.body.asistenteNombre;
            this.dataItemTemp.asistenteTelefono = resp.body.asistenteTelefono;
            this.dataItemTemp.asistenteCelular = resp.body.asistenteCelular;
            this.dataItemTemp.hojaVidaResumidaPerfil =
              resp.body.hojaVidaResumidaPerfil;
            this.dataItemTemp.hojaVidaResumidaSpeech =
              resp.body.hojaVidaResumidaSpeech;
            this.dataItemTemp.formacionAcademica = resp.body.formacionAcademica;
            this.dataItemTemp.experienciaProfesional =
              resp.body.experienciaProfesional;
            this.dataItemTemp.publicaciones = resp.body.publicaciones;
            this.dataItemTemp.premiosDistinciones =
              resp.body.premiosDistinciones;
            this.dataItemTemp.otraInformacion = resp.body.otraInformacion;
            this.dataItemTemp.esPersonaValida = resp.body.esPersonaValida;
            this.dataItemTemp.idPersonalAsignado = resp.body.idPersonalAsignado;
            this.dataItemTemp.fotoDocente = resp.body.fotoDocente;
            this.dataItemTemp.urlFotoDocente = resp.body.urlFotoDocente;
            this.subirImagen();
            this.gridExpositores.loading = false;
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            this.gridExpositores.loading = false;
            this.enProcesoSolicitud = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    } else {
      this.gridExpositores.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
      this.formDatosPersonales.markAllAsTouched();
      this.formDatosUbicacion.markAllAsTouched();
    }
  }

  myRestrictions: FileRestrictions = {
    allowedExtensions: ['.jpg', '.png', '.jpeg'],
  };

  subirImagen() {
    let foto = this.formDatosPersonales.get('archivofoto').value;
    if (foto != null && foto.length >= 1) {
      let formData = new FormData();
      formData.append('Files', foto[0]);

      this._integraService
        .insertarFormData2(
          constApiPlanificacion.ExpositorRegistrarArchivoFotoExpositor,
          formData
        )
        .subscribe({
          next: (response: boolean) => {
            console.log(response);
            if (response != null) {
              this._alertaService.mensajeExitoso();
            }
            // this.procesoEnvio = false;
          },
          error: (error) => {
            console.log('No de guatdo Archivo');
          },
          complete: () => {},
        });
    }
  }
}

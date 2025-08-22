import { Ciudad } from '@integra/models/ciudad';
import {
  IAreaTrabajoCombo,
  IFaseOportunidadCombo,
  IFormRegistroOportunidad,
  IRegistroOportunidadAlumno,
  ICiudadCombo,
} from './../../models/interfaces/imodulo-creacion-oportunidad';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpResponse } from '@angular/common/http';
import { constApiComercial, constApiGlobal, constApiPlanificacion } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { UserService } from '@shared/services/user.service';
import {
  IContactoOportunidad,
  IAlumnoInformacionMessenger,
  IFiltroEnvio,
  IFormFiltro,
  IOportunidadRegistro,
  IOportunidadFormulario,
  IAlumnoFormularioOportunidad,
  ITipoDatoCombo,
  IPaisZonaHoraria,
} from '../../models/interfaces/imodulo-creacion-oportunidad';

import { AlertaService } from '@shared/services/alerta.service';
import { IClaveValor, IComboBase1 } from '@shared/models/interfaces/iglobal';
import { PageSizeItem } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-creacion-oportunidad',
  templateUrl: './creacion-oportunidad.component.html',
  styleUrls: ['./creacion-oportunidad.component.scss'],
})
export class CreacionOportunidadComponent implements OnInit {
  public virtual: any = {
    itemHeight: 28,
  };
  constructor(
    private formBuilder: FormBuilder,
    public modalService: NgbModal,
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private _snackBar: MatSnackBar,
    private userService: UserService
  ) {}
  origenFiltro: any = '';
  gridOportunidades: any;
  fechaFinal: any;
  modalRef: any;

  dataCentroCosto: IComboBase1[] = [];
  dataCentroCostoModal: IComboBase1[] = [];
  sourceCentroCosto: IComboBase1[] = [];
  sourceCentroCostoModal: IComboBase1[] = [];

  dataAsesor: IComboBase1[] = [];
  dataAsesorModal: IComboBase1[] = [];
  sourceAsesor: IComboBase1[] = [];
  sourceAsesorModal: IComboBase1[] = [];

  dataApellidoPaterno: { id: string; nombreCompleto: string }[] = [];
  dataTipoDato: ITipoDatoCombo[] = [];
  dataCategoriaOrigen: IComboBase1[] = [];
  dataPais: IPaisZonaHoraria[] = [];
  dataEmpresa: IComboBase1[] = [];
  sourceEmpresa: IComboBase1[] = [];
  dataReferido: Array<{ id: number; nombreCompleto: string }> = [];
  dataFaseOportunidad: IFaseOportunidadCombo[] = [];
  gridOportunidad = new KendoGrid();
  dataCiudad: ICiudadCombo[] = [];
  sourceCiudad: ICiudadCombo[] = [];
  dataCargo: IComboBase1[] = [];
  dataAreaFormacion: IComboBase1[] = [];
  dataAreaTrabajo: IAreaTrabajoCombo[] = [];
  dataIndustria: IComboBase1[] = [];
  showComentario: boolean = false;
  showCodMailing: boolean = false;
  dataEmailAlumno: Array<{ id: string; nombreCompleto: string }>;
  idAlumnoTemp: number;

  formAgregarNuevo: FormGroup = this.formBuilder.group({
    nombre1: ['', Validators.required],
    nombre2: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email2: [''],
    email1: ['', Validators.required],
    direccion: '',
    telefono: '',
    celular: '',
    idCargo: null,
    idAFormacion: null,
    idATrabajo: null,
    idIndustria: null,
    idReferido: null,
    idCodigoPais: [null, Validators.required],
    idCodigoCiudad: [null, Validators.required],
    horaContacto: null,
    horaPeru: null,
    idEmpresa: null,
    comentario: '',
    idCentroCosto: [null, Validators.required],
    idPersonal_Asignado: [null, Validators.required],
    idTipoDato: [null, Validators.required],
    idOrigen: [null, Validators.required],
    idFaseOportunidad: [null, Validators.required],
    codigoMailing: '',
    fechaProgramada: null
  });

  formFiltroOportunidad: FormGroup = this.formBuilder.group({
    asesores: [[]],
    centrosCosto: [[]],
    tiposDato: [[]],
    origenes: [[]],
    fasesOportunidad: [[]],
    fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    contacto: '',
    fechaFin: new Date(),
  });

  pageSizes: (number | PageSizeItem)[] = [
    { text: 'All', value: 'all' },
    5,
    10,
    20,
  ];
  btnBuscarDisabled = false;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  subFilterComboAlumno$: Subscription = new Subscription();
  objErrorModal: any = {};
  btnGuardarDisabled: boolean = false;
  loadingModal: boolean = false;

  ngOnInit(): void {
    this.configurarGrilla();
    this.obtenerDatosFiltroRegistrarOportunidad();
    this.generarReporte();
  }

  get formFiltro(): IFormFiltro {
    return this.formFiltroOportunidad.getRawValue() as IFormFiltro;
  }
  get formRegistro(): IFormRegistroOportunidad {
    return this.formAgregarNuevo.getRawValue() as IFormRegistroOportunidad;
  }

  obtenerDatosFiltroRegistrarOportunidad() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.RegistrarOportunidadObtenerDatosFiltroRegistrarOportunidad}/${this.userService.userData.idPersonal}`
      )
      .subscribe({
        next: (response: HttpResponse<IContactoOportunidad>) => {
          this.dataTipoDato = response.body.tipoDatoChats;
          this.dataCategoriaOrigen = response.body.categoriaOrigenes;
          this.dataFaseOportunidad = response.body.faseOportunidades;
          this.dataPais = response.body.paises;
          this.sourceCiudad = response.body.ciudades;
          this.dataCargo = response.body.cargos;
          this.dataAreaFormacion = response.body.areasFormacion;
          this.dataAreaTrabajo = response.body.areasTrabajo;
          console.log(this.dataAreaTrabajo);
          
          this.dataIndustria = response.body.industrias;
        },
        error: (error) => {
          let mensaje = this.alertaService.getErrorResponse(error).mensaje;
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  generarReporte() {
    this.btnBuscarDisabled = true;
    const gridState = this.gridOportunidad.gridState;
    let page = (gridState.take + gridState.skip) / gridState.take;
    let fechaInicio = datePipeTransform(this.formFiltro.fechaInicio);
    let fechaFin = datePipeTransform(this.formFiltro.fechaFin);
    let param: IFiltroEnvio = {
      paginador: {
        page: page,
        pageSize: gridState.take,
        skip: gridState.skip,
        take: gridState.take,
      },
      filtro: {
        asesores: this.formFiltro.asesores.join(','),
        centrosCosto: this.formFiltro.centrosCosto.join(','),
        tiposDato: this.formFiltro.tiposDato.join(','),
        origenes: this.formFiltro.origenes.join(','),
        fasesOportunidad: this.formFiltro.fasesOportunidad.join(','),
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        contacto: this.formFiltro.contacto,
      },
    };

    this.gridOportunidad.loading = true;
    this.integraService
      .postJsonResponse(
        constApiComercial.RegistrarOportunidadObtenerOportunidadV2,
        // constApiComercial.RegistrarOportunidadObtenerOportunidad,
        param
      )
      .subscribe({
        next: (response: HttpResponse<IOportunidadRegistro>) => {
          console.log(response);
          let data = response.body.data.map((e) => ({
            ...e,
            nombreCompleto: `${e.apellidoPaterno} ${e.apellidoMaterno} ${e.nombre1} ${e.nombre2}`,
          }));
          this.gridOportunidad.view$.next({
            data: data,
            total: response.body.total,
          });
          this.gridOportunidad.loading = false;
          this.btnBuscarDisabled = false;
        },
        error: (error) => {
          console.log(error);
          let mensaje = this.alertaService.getErrorResponse(error).mensaje;
          this.alertaService.notificationWarning(mensaje);
          this.gridOportunidad.loading = false;
          this.btnBuscarDisabled = false;
        },
      });
  }

  filterEmpresa(value: string) {
    if (value.length >= 4) {
      this.integraService
        .postJsonResponse(
          constApiComercial.AgendaInformacionActividadObtenerEmpresaAutocomplete,
          JSON.stringify({
            valor: value,
          })
        )
        .subscribe({
          next: (response: HttpResponse<IComboBase1[]>) => {
            this.dataEmpresa = response.body;
            this.sourceEmpresa = response.body;
            
          },
          error: (error) => {
            console.log(error);
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.notificationWarning(mensaje);
          },
        });
    } else if (value.length >= 1) {
      this.dataEmpresa = [];
    } else {
      this.dataEmpresa = this.sourceEmpresa;
    }
  }


  ObtenerEmpresaporId(id: number) {
    this.integraService.getJsonResponse(`${constApiPlanificacion.EmpresaObtenerEmpresaPorId}/${id}`)
      .subscribe({
        next: (response: HttpResponse<IComboBase1>) => {
          this.dataEmpresa = [response.body];
         
        },
        error: (error) => {
          console.log(error);
          let mensaje = this.alertaService.getErrorResponse(error).mensaje;
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  filterApellidoPaterno(value: string) {
    this.subFilterComboAlumno$.unsubscribe();
    if (value.length >= 4) {
      this.subFilterComboAlumno$ = new Subscription();
      this.subFilterComboAlumno$ = this.integraService
        .postJsonResponse(
          constApiComercial.MessengerChatObtenerTodoComboAlumno,
          JSON.stringify({
            valor: value,
          })
        )
        .subscribe({
          next: (
            response: HttpResponse<{ id: number; nombreCompleto: string }[]>
          ) => {
            if (response.body.length > 0) {
              this.dataApellidoPaterno = response.body.map((element) => {
                return {
                  id: element.id.toString(),
                  nombreCompleto: element.nombreCompleto,
                };
              });
            }
          },
        });
    }
  }

  filterReferido(value: string) {
    if (value.length >= 4) {
      this.integraService
        .obtenerPorFiltro(
          constApiComercial.MessengerChatObtenerTodoComboAlumno,
          {
            valor: value,
          }
        )
        .subscribe({
          next: (
            response: HttpResponse<
              Array<{ id: number; nombreCompleto: string }>
            >
          ) => {
            if (response.body.length > 0) {
              this.dataReferido = response.body;
            }
          },
        });
    }
  }
  //OportunidadCrearOportunidadCrearAlumnoVentas

  validateEmail(email: any) {
    let emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if (!emailReg.test(email)) {
      return false;
    } else {
      return true;
    }
  }

  recuperarFormValueRef(): IRegistroOportunidadAlumno {
    //Campos Obligatorios

    if (!this.formRegistro.idCentroCosto)
      this.objErrorModal['idCentroCosto'] = 'SELECCIONE UN CENTRO DE COSTO';
    else delete this.objErrorModal['idCentroCosto'];
    if (!this.formRegistro.idPersonal_Asignado)
      this.objErrorModal['idPersonal_Asignado'] = 'SELECCIONE UN ASESOR';
    else delete this.objErrorModal['idPersonal_Asignado'];
    if (!this.formRegistro.idTipoDato)
      this.objErrorModal['idTipoDato'] = 'SELECCIONE UN TIPO DE DATO';
    else delete this.objErrorModal['idTipoDato'];
    if (!this.formRegistro.idFaseOportunidad)
      this.objErrorModal['idFaseOportunidad'] =
        'SELECCIONE UNA FASE OPORTUNIDAD';
    else delete this.objErrorModal['idFaseOportunidad'];
    if (!this.formRegistro.idOrigen)
      this.objErrorModal['idOrigen'] = 'SELECCIONE UN ORIGEN';
    else delete this.objErrorModal['idOrigen'];
    if (!this.formRegistro.email1)
      this.objErrorModal['email1'] = 'INGRESE UN EMAIL';
    else delete this.objErrorModal['email1'];
    if (!this.formRegistro.idCodigoPais)
      this.objErrorModal['idCodigoPais'] = 'Seleccione un Pais';
    else delete this.objErrorModal['idCodigoPais'];
    if (!this.formRegistro.idCodigoCiudad)
      this.objErrorModal['idCodigoCiudad'] = 'Seleccione una Ciudad';
    else delete this.objErrorModal['idCodigoCiudad'];

    let alumno: IAlumnoFormularioOportunidad = {
      id: this.idAlumnoTemp ?? 0,
      nombre1: this.formRegistro.nombre1,
      nombre2: this.formRegistro.nombre2,
      apellidoPaterno: this.formRegistro.apellidoPaterno,
      apellidoMaterno: this.formRegistro.apellidoMaterno,
      direccion: this.formRegistro.direccion,
      telefono: this.formRegistro.telefono,
      celular: this.formRegistro.celular,
      email1: this.formRegistro.email1,
      email2: this.formRegistro.email2,
      idCodigoPais: this.formRegistro.idCodigoPais,
      idCodigoCiudad: this.formRegistro.idCodigoCiudad,
      idCargo: this.formRegistro.idCargo ?? -1,
      idAFormacion: this.formRegistro.idAFormacion ?? -1,
      idATrabajo: this.formRegistro.idATrabajo ?? -1,
      idIndustria: this.formRegistro.idIndustria ?? -1,
      idReferido: this.formRegistro.idReferido,
      comentario: this.formRegistro.comentario,
      idEmpresa: this.formRegistro.idEmpresa ?? -1,
    };

    let _horaContacto = this.formRegistro.horaContacto;
    alumno.horaContacto = _horaContacto
      ? `${_horaContacto.getHours()}:${_horaContacto.getMinutes()}`
      : '';
    let _horaPeru = this.formRegistro.horaPeru;
    alumno.horaPeru = _horaPeru
      ? `${_horaPeru.getHours()}:${_horaPeru.getMinutes()}`
      : '';

    // Datos de Oportunidad
    let oportunidad: IOportunidadFormulario = {
      idCentroCosto: this.formRegistro.idCentroCosto,
      idPersonal_Asignado: this.formRegistro.idPersonal_Asignado,
      idTipoDato: this.formRegistro.idTipoDato,
      idFaseOportunidad: this.formRegistro.idFaseOportunidad,
      idOrigen: this.formRegistro.idOrigen,
      //codigoMailing = this.formRegistro.coidgoMailing;
      fk_id_tipointeraccion: 18,
      idAlumno: this.idAlumnoTemp,
      id: 0,
      ultimoComentario: 'Sin Comentario',
      // ultimaFechaProgramada: ''
    };

    return {
      alumno: alumno,
      oportunidad: oportunidad,
      usuario: this.userService.userName,
    };
  }

  get listaErroresModal(): string[] {
    let error: string[] = [];
    for (const key in this.objErrorModal) {
      error.push(this.objErrorModal[key]);
    }
    return error;
  }
  /**
   * Asigna el valor de guardar de la funcion
   * @return {void}
   */
  guardarModalCreacionOportunidad() {
    this.objErrorModal = {};
    if (this.formAgregarNuevo.valid) {
      if (!this.validateEmail(this.formRegistro.email1)) {
        this.objErrorModal['email1'] =
          'Ingrese un correo valido, campo: Email 1';
      } else {
        delete this.objErrorModal['email1'];
      }
      if (!this.validateEmail(this.formRegistro.email2)) {
        this.objErrorModal['email2'] =
          'Ingrese un correo valido, campo: Email 2';
      } else {
        delete this.objErrorModal['email2'];
      }
      if (this.listaErroresModal.length > 0) return;

      let form = this.recuperarFormValueRef();
      if (this.listaErroresModal.length > 0) return;

      if (!form) return;
      if (this.idAlumnoTemp != 0 && this.idAlumnoTemp != null) {
        this.validarExisteContacto(form.alumno);
      } else {
        this.validarExisteContacto(form.alumno);
      }
    } else {
      this.formAgregarNuevo.markAllAsTouched();
    }
  }

  validarExisteContacto(alumno: IAlumnoFormularioOportunidad) {
    let email1 = this.formRegistro.email1 ?? '';
    let email2 = this.formRegistro.email2 ?? '';

    //displayLoading("#myModal");

    let param = {
      id: alumno.id,
      email1: email1,
      email2: email2.trim() == '' ? email1 : email2.trim(),
    };
    this.integraService
      .postJsonResponse(
        constApiComercial.MessengerChatValidarAlumnoExiste,
        param
      )
      .subscribe({
        next: (response: HttpResponse<number>) => {
          if (response.body != 0 && response.body != null) {
            //alert("Ya Existe Contacto con los email");
            this.guardarContactoOportunidad(response.body);
          } else {
            this.guardarContactoOportunidad(0);
          }
        },
        error: (error) => {
          console.log(error);
          let mensaje = this.alertaService.getErrorResponse(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  guardarModalCreacionOportunidad123() {
    this.modalService.dismissAll();
    this.formAgregarNuevo.reset();
  }
  /**
   * Guarda el contacto y la oportunidad
   * @return {void}
   */
  guardarContactoOportunidad(idAlumno: number) {
    //Insertamos el alumno y IdOportunidad
    let jsonEnvio = this.recuperarFormValueRef();
    let constApi = '';
    jsonEnvio.alumno.id =
      jsonEnvio.alumno.id == 0 ? idAlumno : jsonEnvio.alumno.id;
    this.loadingModal = true;
    this.btnGuardarDisabled = true;
    this.formAgregarNuevo.disable();
    // http://localhost:63048/api/Oportunidad/CrearOportunidadCrearAlumnoVentas/
    // http://localhost:63048/api/Oportunidad/ActualizarAlumnoCrearOportunidadVentas/

    if (jsonEnvio.alumno.id == 0) {
      constApi = constApiComercial.OportunidadCrearOportunidadCrearAlumnoVentas;
    } else {
      constApi =
        constApiComercial.OportunidadActualizarAlumnoCrearOportunidadVentas;
    }

    this.integraService
      .postJsonResponse(constApi, JSON.stringify(jsonEnvio))
      .subscribe({
        next: (response: HttpResponse<{ rpta: string; records: any }>) => {
          if (response.body.rpta == 'Ok') {
            this.generarReporte();
            this.modalService.dismissAll();
            this.formAgregarNuevo.reset();
            this.alertaService.swalFireOptions({
              icon: 'success',
              title: 'Se creo correctamente la Oportunidad',
            });
          } else {
          }
          this.loadingModal = false;
          this.btnGuardarDisabled = false;
          this.formAgregarNuevo.enable();
        },
        error: (error) => {
          console.log(error);
          this.loadingModal = false;
          this.btnGuardarDisabled = false;
          this.formAgregarNuevo.enable();
          let mensaje = this.alertaService.getErrorResponse(error).mensaje;
          this.alertaService.notificationError(mensaje);
        },
      });

    // url = "http://localhost:63048/api/Oportunidad/ActualizarAlumnoCrearOportunidadVentas/";
  }

  filterEmailAlumno(value: string) {
    console.log(value);
    if (value.length >= 4) {
      this.integraService
        .postJsonResponse(
          constApiComercial.MessengerChatObtenerDatosAlumnoPorEmail,
          JSON.stringify({
            valor: value,
          })
        )
        .subscribe({
          next: (
            response: HttpResponse<{ id: number; nombreCompleto: string }[]>
          ) => {
            // this.apellidoPaterno = response.body;
            if (response.body.length > 0) {
              this.dataEmailAlumno = response.body.map((x) => {
                return {
                  id: x.id.toString(),
                  nombreCompleto: x.nombreCompleto,
                };
              });
            }
          },
        });
    }
  }

  changeOrigen(idOrigen: number) {
    if (idOrigen == 1314) {
      this.showComentario = true;
    } else {
      this.showComentario = false;
    }
    if (idOrigen == 131) {
      this.showCodMailing = true;
    } else {
      this.showCodMailing = false;
    }
  }

  filterAsesor(value: string, elementRef: any, esModal: boolean) {
    if (value.length >= 4) {
      elementRef.loading = true;
      this.integraService
        .postJsonResponse(
          constApiComercial.AgendaInformacionActividadObtenerPersonalAutocomplete,
          JSON.stringify({
            valor: value,
          })
        )
        .subscribe({
          next: (response) => {
            elementRef.loading = false;
            if (esModal) {
              this.dataAsesorModal = response.body;
              this.sourceAsesorModal = response.body;
            } else {
              this.dataAsesor = response.body;
              this.sourceAsesor = response.body;
            }
          },
          error: (error) => {
            elementRef.loading = false;
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.notificationWarning(mensaje);
          },
        });
    } else if (value.length > 0) {
      if (esModal) this.dataAsesorModal = [];
      this.dataAsesor = [];
    } else {
      if (esModal) this.dataAsesorModal = this.sourceAsesorModal;
      else this.dataAsesor = this.sourceAsesor;
    }
  }
  filterCentroCosto(value: string, elementRef: any, esModal: boolean) {
    if (value.length >= 4) {
      elementRef.loading = true;
      this.integraService
        .postJsonResponse(
          constApiComercial.CentroCostoObtenerAutocompleteV2,
          // constApiComercial.CentroCostoObtenerFiltroAutocomplete,
          JSON.stringify({
            valor: value,
          })
        )
        .subscribe({
          next: (response) => {
            elementRef.loading = false;
            if (esModal) {
              this.dataCentroCostoModal = response.body;
              this.sourceCentroCostoModal = response.body;
            } else {
              this.dataCentroCosto = response.body;
              this.sourceCentroCosto = response.body;
            }
          },
          error: (error) => {
            elementRef.loading = false;
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.notificationWarning(mensaje);
          },
        });
    } else if (value.length > 0) {
      if (esModal) this.dataCentroCostoModal = [];
      this.dataCentroCosto = [];
    } else {
      if (esModal) this.dataCentroCostoModal = this.sourceCentroCostoModal;
      else this.dataCentroCosto = this.sourceCentroCosto;
    }
  }

  resetFormularioRegistro() {
    this.formAgregarNuevo.reset();
    this.formAgregarNuevo.patchValue({
      nombre1: '',
      nombre2: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      email2: '',
      email1: '',
      direccion: '',
      telefono: '',
      celular: '',
    });
    this.formAgregarNuevo.enable();
    this.formAgregarNuevo.get('horaPeru').disable();
  }

  openModalAgregarNuevo(content: any) {
    this.resetFormularioRegistro();
    this.dataCiudad = [];
    this.dataEmpresa=[];
    this.modalRef = this.modalService.open(content, {
      size: 'lg',
      backdrop: 'static',
    });
  }

  changeEmailAlumno(id: string) {
    this.idAlumnoTemp = 0;
    if (!isNaN(this.formAgregarNuevo.get('email1').value)) {
      this.formAgregarNuevo.get('email1').setValue(' ');
      this.obtenerAlumnosMessengerPorId(Number(id));
    }
  }
  changeApellidoPaterno(id: string) {
    this.idAlumnoTemp = 0;
    if (!isNaN(this.formAgregarNuevo.get('apellidoPaterno').value)) {
      this.formAgregarNuevo.get('apellidoPaterno').setValue(' ');
      this.obtenerAlumnosMessengerPorId(Number(id));
    }
  }
  obtenerAlumnosMessengerPorId(idAlumno: number) {
    if(idAlumno != 0){
      this.integraService
        .getJsonResponse(
          `${constApiComercial.MessengerChatObtenerAlumnosMessengerPorId}/${idAlumno}`
        )
        .subscribe({
          next: (response: HttpResponse<IAlumnoInformacionMessenger>) => {
            this.sincronizarAlumno(response.body);
          },
        });
    }
  }
  sincronizarAlumno(alumno: IAlumnoInformacionMessenger) {
    this.obtenerDatosFiltroRegistrarOportunidad();
    this.idAlumnoTemp = alumno.id;
    this.formAgregarNuevo.get('nombre1').setValue(alumno.nombre1);
    this.formAgregarNuevo.get('nombre2').setValue(alumno.nombre2);
    this.formAgregarNuevo
      .get('apellidoPaterno')
      .setValue(alumno.apellidoPaterno);
    this.formAgregarNuevo
      .get('apellidoMaterno')
      .setValue(alumno.apellidoMaterno);
    this.formAgregarNuevo.get('direccion').setValue(alumno.direccion);
    this.formAgregarNuevo.get('telefono').setValue(alumno.telefono);
    this.formAgregarNuevo.get('celular').setValue(alumno.celular);
    this.formAgregarNuevo.get('email1').setValue(alumno.email1);
    this.formAgregarNuevo.get('email2').setValue(alumno.email2);
    this.formAgregarNuevo.get('idReferido').setValue(alumno.idReferido);
    this.formAgregarNuevo.get('idCodigoPais').setValue(alumno.idCodigoPais);

    if (alumno.idCodigoPais) {
      this.changePais(alumno.idCodigoPais)
      this.formAgregarNuevo.get('idCodigoCiudad').setValue(alumno.idCiudad);
    } else {
      this.formAgregarNuevo.get('idCodigoCiudad').setValue(null);
    }
    if (alumno.horaContacto && alumno.horaContacto.split(':').length === 2) {
      let hora = alumno.horaContacto.split(':').map((x) => Number(x));
      let actual = new Date();
      actual.setHours(hora[0]);
      actual.setMinutes(hora[1]);
      this.formAgregarNuevo.get('horaContacto').setValue(alumno.horaContacto);
    } else {
      this.formAgregarNuevo.get('horaContacto').setValue(null);
      this.formAgregarNuevo.get('horaPeru').setValue(null);
    }
    this.formAgregarNuevo.get('direccion').setValue(alumno.direccion);
    this.formAgregarNuevo.get('idCargo').setValue(alumno.idCargo);
    this.formAgregarNuevo.get('idAFormacion').setValue(alumno.idAFormacion);
    this.formAgregarNuevo.get('idATrabajo').setValue(alumno.idATrabajo);
    this.formAgregarNuevo.get('idIndustria').setValue(alumno.idIndustria);
    this.ObtenerEmpresaporId(Number(alumno.idEmpresa));
    this.formAgregarNuevo.get('idEmpresa').setValue(alumno.idEmpresa);
    this.idAlumnoTemp = alumno.id;
    this.habilitarDeshabilitarCampos(alumno.asociado);
    //   this.formCreacionOportunidadModal.get('').setValue(alumno.asociado);

    // if (alumno.idReferido == null) {
    //   this.formAgregarNuevo
    //     .get('referido')
    //     .setValue(alumno.idReferido);
    // } else {
    //   this.integraService
    //     .getJsonResponse(
    //       `${constApiComercial.MessengerChatObtenerTodoFiltroIdReferido}/${alumno.idReferido}`
    //     )
    //     .subscribe({
    //       next: (response) => {
    //         console.log(response);
    //         if (alumno.length !== 0 && alumno !== undefined)
    //           this.formAgregarNuevo
    //             .get('referido')
    //             .setValue(alumno[0].NombreCompleto);
    //       },
    //     });
    // }
  }

  txtNombre1 = { disabled: false, bgColor: '#fffff' };
  txtNombre2 = { disabled: false, bgColor: '#fffff' };
  txtApeMaterno = { disabled: false, bgColor: '#fffff' };

  habilitarDeshabilitarCampos(asociado: boolean) {
    if (asociado) {
      this.txtNombre1.disabled = true;
      this.txtNombre1.bgColor = '#FFF4B9';
      this.txtNombre2.disabled = true;
      this.txtNombre2.bgColor = '#FFF4B9';
      this.txtApeMaterno.disabled = true;
      this.txtApeMaterno.bgColor = '#FFF4B9';
    } else {
      this.txtNombre1.disabled = false;
      this.txtNombre1.bgColor = '#fff';
      this.txtNombre2.disabled = false;
      this.txtNombre2.bgColor = '#fff';
      this.txtApeMaterno.disabled = false;
      this.txtApeMaterno.bgColor = '#fff';
    }
  }

  changeHoraContacto(hora: Date) {
    console.log(hora);
    this.calcularDiferenciaHoraria();
    // this.formAgregarNuevo.get('horaPeru').setValue(hora);
    // this.formAgregarNuevo.get('inputfecha').setValue(hora);
  }

  calcularDiferenciaHoraria() {
    let idPais: number = this.formAgregarNuevo.get('idCodigoPais').value;
    let horaContacto: Date = this.formAgregarNuevo.get('horaContacto').value;
    let pais = this.dataPais.find((x) => x.id == idPais);
    if (horaContacto && pais) {
      let zonaHoraria = pais.zonaHoraria;
      if (Math.abs(zonaHoraria) == 0.3) {
        zonaHoraria = 0.5;
      }
      let fechaPeru = this.dateAdd(horaContacto, 'minuto', zonaHoraria * 60);
      this.formAgregarNuevo.get('horaPeru').setValue(fechaPeru)
      if(!this.formRegistro.fechaProgramada){
        this.formAgregarNuevo.get('fechaProgramada').setValue(fechaPeru)
      }
    } else {
      this.formAgregarNuevo.get('horaPeru').setValue(null)
    }
  }

  dateAdd(date: Date, interval: string, units: number) {
    let fecha = new Date(date);
    switch (interval.toLowerCase()) {
      case 'anio':
        fecha.setFullYear(fecha.getFullYear() + units);
        break;
      case 'mes':
        fecha.setMonth(fecha.getMonth() + units);
        break;
      case 'semana':
        fecha.setDate(fecha.getDate() + 7 * units);
        break;
      case 'dia':
        fecha.setDate(fecha.getDate() + units);
        break;
      case 'hora':
        fecha.setTime(fecha.getTime() + units * 3600000);
        break;
      case 'minuto':
        fecha.setTime(fecha.getTime() + units * 60000);
        break;
      case 'segundo':
        fecha.setTime(fecha.getTime() + units * 1000);
        break;
      default:
        fecha = null;
        break;
    }
    return fecha;
  }

  changePais(idPais: number) {
    this.formAgregarNuevo.get('idCodigoCiudad').setValue(null);
    this.dataCiudad = [];
    let pais = this.dataPais.find((x) => x.id == idPais);
    if (pais) {
      this.dataCiudad = this.sourceCiudad.filter((x) => x.idPais == idPais);
    
    } else {
      this.dataCiudad = [];
      
    }
    this.calcularDiferenciaHoraria();
  }


  

  sizes: any = [10, 50, 'all'];
  buttonCount: any = 1;
  pageSize: any = 10;

  configurarGrilla() {
    this.gridOportunidad.gridState.take = 10;
    this.gridOportunidad.serverFiltering = true;
    this.gridOportunidad.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridOportunidad.gridState = resp.gridState;
        this.generarReporte();
      },
    });
  }
}

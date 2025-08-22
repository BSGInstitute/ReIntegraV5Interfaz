import { Subscription } from 'rxjs';
import { FormService } from '@shared/services/form.service';
import { HttpResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  IComboCiudad,
  IComboAsentamiento,
  IComboMunicipio,
  IComboCodigoPostal,
} from '@comercial/models/interfaces/iagenda-alumno';
import {
  IAlumnoInformacion,
  IAgendaDatosAlumno,
  IAlumnoActualizar,
} from '@integra/areas/comercial/models/interfaces/iagenda-datos-alumno';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DropDownFilterSettings,
  DropDownListComponent,
} from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { CompareValidators } from '@shared/validators/compare.validator';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';

@Component({
  selector: 'app-datos-personal',
  templateUrl: './datos-personal.component.html',
  styleUrls: ['./datos-personal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DatosPersonalComponent implements OnInit {
  @ViewChild('cargo') cargo: DropDownListComponent;

  constructor(
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService
  ) {}
  formDatosPersonales: FormGroup = this.formBuilder.group({
    nombre1: '',
    apellidoPaterno: '',
    dni: [null],
    nombre2: '',
    apellidoMaterno: '',
    direccion: '',
    fechaNacimiento: '',
    nombreFamiliar: '',
    telefonoFamiliar: '',
    genero: '',
    parentesco: '',
    telefonoTrabajo: '',
    telefonoTrabajoAnexo: '',
    nombrePais: '',
    cargo: null,
    aFormacion: null,
    aTrabajo: null,
    industria: null,
    empresa: null,
    email1: '',
    email2: '',
    celular: [
      null,
      [Validators.required, CompareValidators.noMatchValidator('celular2')],
    ],
    celular2: [null, [CompareValidators.noMatchValidator('celular')]],
    telefono: [null, [CompareValidators.noMatchValidator('telefono2')]],
    telefono2: [null, [CompareValidators.noMatchValidator('telefono')]],
    ciudad: null,
    idMunicipioMexico: null,
    idAsentamientoMexico: null,
    idCiudadMexico: null,
    codigoPostal: '',
    estadoLugar: '',
    curp: '',
    rfc: '',
  });
  esIS: boolean = false;
  codigosPostales: IComboCodigoPostal[] = [];
  selectedCodigoPostal: string;
  dataSentinelAlumno: any = {};
  esOcultarTexto: boolean = true;
  loading: boolean = false;
  sourceCargo: any[] = [];
  filtroCargo: any[] = [];
  cambioCentroCosto: FormControl = new FormControl(null);

  sourceAreaTrabajo: any[] = [];
  filtroAreaTrabajo: any[] = [];
  dataEmpresa: any[] = [];
  filtroIndustria: any[] = [];
  sourceIndustria: any[] = [];
  filtroAreaFormacion: any[] = [];
  sourceAreaFormacion: any[] = [];
  dataPais: any[] = [];
  sourceCiudad: IComboCiudad[] = [];
  sourceMunicipio: IComboMunicipio[] = [];
  dataCiudadMexico: IComboBase1[] = [];
  dataMunicipio: IComboMunicipio[] = [];
  dataAsentamiento: IComboAsentamiento[] = [];
  dataAsentamientoTmp: IComboAsentamiento[] = [];
  dataCodigoPostal: IComboCodigoPostal[] = [];
  filtroCiudad: IComboCiudad[] = [];
  filtroMunicipio: IComboMunicipio[] = [];
  filtroAsentamiento: IComboAsentamiento[] = [];
  alumno: IAlumnoInformacion;
  _rowActual: IRowActual;
  gridHistorialModifcacionesContacto: KendoGrid = new KendoGrid();
  visualizarDatos: number = 0;
  email1 = '';
  celular = '';
  subscriptions: Subscription = new Subscription();
  pageSizes = [5, 10, 20];
  btnActualizar = false;
  flagActualizarAlumno: boolean = true;
  btnGuardarContacto: any = {
    disabled: false,
  };
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  showDatosMexico: boolean = false;
  btnActualizarCentroCosto = false;
  @Input() agendaService: AgendaService;

  comboCentroCosto: IComboBase1[] = [];
  ngOnInit(): void {
    this._rowActual = this.agendaService.rowActual;
    this.cambioCentroCosto.setValue(this.agendaService.rowActual.idCentroCosto);

    if (this._rowActual.codigoFase == 'IS') {
      this.esIS = true;
    }
    this.initSubscribeObservables();
    this.cargarHistorialModificacionesContacto();
    this.obtenerCentroCostoAgenda();
  }
  ngOnDestroy(): void {
    this.btnActualizar = false;
    this.subscriptions.unsubscribe();
  }
  ngAfterViewInit() {
    // this.cargo.toggle(true);
  }

  get esCoordinadora$() {
    return this.agendaService.esCoordinadora$;
  }
  esPaisMexico(idPais: number) {
    if (idPais == 52) {
      this.showDatosMexico = true;
    } else {
      this.showDatosMexico = false;
    }
  }

  obtenerCentroCostoAgenda() {
    this.agendaService.agendaAlumnoService
      .obtenerCentroCostoAgenda$()
      .subscribe({
        next: (resp) => {
          let iten = resp.body.findIndex(
            (x) => x.id == this._rowActual.idCentroCosto
          );
          this.comboCentroCosto = resp.body;
          if (iten == null) {
            this.comboCentroCosto = [
              {
                id: this._rowActual.idCentroCosto,
                nombre: this._rowActual.centroCosto,
              },
              ...this.comboCentroCosto,
            ];
          }
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  initSubscribeObservables() {
    let sub1$ = this.agendaService.agendaAlumnoService.comboCiudades$.subscribe(
      (resp) => {
        if (resp != null && resp.length > 0) {
          let data = resp.sort((a, b) => a.nombre.localeCompare(b.nombre));
          this.sourceCiudad = data;
        }
      }
    );
    let sub10$ =
      this.agendaService.agendaAlumnoService.comboMunicipios$.subscribe(
        (resp) => {
          if (resp != null && resp.length > 0) {
            let data = resp.sort((a, b) => a.nombre.localeCompare(b.nombre));

            this.sourceMunicipio = data;
            this.dataMunicipio = data;
          }
        }
      );

    let sub11$ =
      this.agendaService.agendaAlumnoService.comboAsentamientos$.subscribe(
        (resp) => {
          if (resp != null && resp.length > 0) {
            let data = resp.sort((a, b) =>
              a.asentamientoMexico.localeCompare(b.asentamientoMexico)
            );
            this.dataAsentamiento = data;
            this.dataAsentamientoTmp = data;
          }
        }
      );
    let sub12$ =
      this.agendaService.agendaAlumnoService.comboCiudadesMexico$.subscribe(
        (resp) => {
          if (resp != null && resp.length > 0) {
            let data = resp.sort((a, b) => a.nombre.localeCompare(b.nombre));
            this.dataCiudadMexico = data;
          }
        }
      );
    let sub3$ = this.agendaService.agendaAlumnoService.datosAlumno$.subscribe({
      next: (resp: IAgendaDatosAlumno) => {
        if (resp != null) {
          this.alumno = resp.alumno;
          this.visualizarDatos = resp.visualizarDatos.valor;
          this.formDatosPersonales.patchValue(resp.alumno);
          this.esPaisMexico(resp.alumno.idCodigoPais);
          this.formDatosPersonales.get('cargo').setValue({
            id: resp.alumno.idCargo == 11 ? null : resp.alumno.idCargo,
            nombre:
              resp.alumno.idCargo == 11 ? '-Sin Cargo-' : resp.alumno.cargo,
          });

          this.formDatosPersonales
            .get('email1')
            .setValue(resp.alumno.email1.trim());
          this.formDatosPersonales
            .get('email2')
            .setValue(resp.alumno.email2.trim());
          this.formDatosPersonales.get('ciudad').setValue(resp.alumno.idCiudad);
          this.formDatosPersonales
            .get('idCiudadMexico')
            .setValue(resp.alumno.idCiudadMexico);
          this.formDatosPersonales
            .get('idMunicipioMexico')
            .setValue(resp.alumno.idMunicipioMexico);
          this.formDatosPersonales
            .get('idAsentamientoMexico')
            .setValue(resp.alumno.idAsentamientoMexico);

          this.formDatosPersonales.get('aFormacion').setValue({
            id: resp.alumno.idAFormacion,
            nombre: resp.alumno.aFormacion,
          });
          this.formDatosPersonales.get('industria').setValue({
            id: resp.alumno.idIndustria == 48 ? null : resp.alumno.idIndustria,
            nombre:
              resp.alumno.idIndustria == 48
                ? '-Sin Industria-'
                : resp.alumno.industria,
          });

          this.formDatosPersonales.get('empresa').setValue({
            id: resp.alumno.idEmpresa,
            nombre: resp.alumno.empresa,
          });
          this.formDatosPersonales.get('aTrabajo').setValue({
            id: resp.alumno.idATrabajo,
            nombre: resp.alumno.aTrabajo,
          });
          if (
            this.agendaService.areaTrabajo == 'VE' &&
            this._rowActual.codigoFase != 'BNC' //&&
            //this.agendaService.esCoordinadora$.value == false
          ) {
            if (this.visualizarDatos != 1) {
              this.esOcultarTexto = true;
              this.email1 = this.ocultarTexto(this.alumno.email1);
              this.celular = this.ocultarTexto(this.alumno.celular);
            } else {
              this.esOcultarTexto = false;
              this.email1 = this.alumno.email1;
              this.celular = this.alumno.celular;
              
            }
          } else {
            this.email1 = this.alumno.email1;
            this.celular = this.alumno.celular;
            this.esOcultarTexto=false;
          }
          this.cargarCiudadPorCodigoPais(this.alumno.idCodigoPais);
        }
      },
    });

    let sub4$ =
      this.agendaService.agendaAlumnoService.actualizarEmail$.subscribe(
        (resp) => {
          if (resp != null)
            this.formDatosPersonales.get('email1').setValue(resp);
        }
      );

    let sub5$ =
      this.agendaService.agendaSentinelService.sentinelAlumno$.subscribe({
        next: (resp) => {
          if (resp != null) {
            if (resp.sentinelValidado == true) {
              this.dataSentinelAlumno = resp;
              this.formDatosPersonales.get('dni').setValue(resp.dni);
            }
          }
        },
      });

    let sub6$ =
      this.agendaService.agendaAlumnoService.comboCargoTrabajo$.subscribe({
        next: (resp: any) => {
          if (resp != null && resp.length > 0) {
            let data = resp.sort((a: any, b: any) =>
              a.nombre.localeCompare(b.nombre)
            );
            this.sourceCargo = data;
            this.filtroCargo = data;
          }
        },
      });
    let sub7$ =
      this.agendaService.agendaAlumnoService.comboIndustrias$.subscribe({
        next: (resp: any) => {
          if (resp != null && resp.length > 0) {
            let data = resp.sort((a: any, b: any) =>
              a.nombre.localeCompare(b.nombre)
            );
            this.filtroIndustria = data;
            this.sourceIndustria = data;
          }
        },
      });
    let sub8$ =
      this.agendaService.agendaAlumnoService.comboAreaTrabajo$.subscribe({
        next: (resp: any) => {
          if (resp != null && resp.length > 0) {
            let data = resp.sort((a: any, b: any) =>
              a.nombre.localeCompare(b.nombre)
            );
            this.sourceAreaTrabajo = data;
            this.filtroAreaTrabajo = data;
          }
        },
      });
    let sub9$ =
      this.agendaService.agendaAlumnoService.comboAreaFormacion$.subscribe({
        next: (resp: any) => {
          if (resp != null && resp.length > 0) {
            let data = resp.sort((a: any, b: any) =>
              a.nombre.localeCompare(b.nombre)
            );
            this.filtroAreaFormacion = data;
            this.sourceAreaFormacion = data;
          }
        },
      });

    this.subscriptions.add(sub1$);
    this.subscriptions.add(sub3$);
    this.subscriptions.add(sub4$);
    this.subscriptions.add(sub5$);
    this.subscriptions.add(sub6$);
    this.subscriptions.add(sub7$);
    this.subscriptions.add(sub8$);
    this.subscriptions.add(sub9$);
    this.subscriptions.add(sub10$);
    this.subscriptions.add(sub11$);
    this.subscriptions.add(sub12$);
  }
  ocultarTexto(texto: string): string {
    let stringOculto: string = '';
    if (texto != null) {
      for (let index = 0; index < texto.length; index++) {
        stringOculto += '*';
      }
    }
    return stringOculto;
  }

  getErrorMessage(controlName: string): string {
    this.formService.erroMsj = {
      celular: {
        required: 'Ingrese un número de Celular',
        noMatchValidator: 'Ingrese un número diferente al celular 2',
      },
      celular2: {
        noMatchValidator: 'Ingrese un número diferente al celular 1',
      },
      telefono: {
        noMatchValidator: 'Ingrese un número diferente al télefono 2',
      },
      telefono2: {
        noMatchValidator: 'Ingrese un número diferente al télefono 1',
      },
      email1: {
        noMatchValidator: 'El correo es igual al correo principal',
      },
      rfc: {
        minlength: 'Debe tener entre 12 a 13 caracteres',
        maxlength: 'Debe tener entre 12 a 13 caracteres',
      },

      curp: {
        minlength: 'Debe tener 18 a  caracteres',
        maxlength: 'Debe tener 18 a  caracteres',
      },
    };
    return this.formService.errorMessage(
      this.formDatosPersonales.get(controlName) as FormControl,
      controlName
    );
  }
  get datosAlumno() {
    return this.formDatosPersonales.getRawValue();
  }
  actualizarEmailAlumno() {
    // this.formDatosPersonales.get('email2').setValidators(CompareValidators.noMatchValidator('email1'));
    const email1 = this.datosAlumno.email1 ?? '';
    const email2 = this.datosAlumno.email2 ?? '';
    if (email1.trim() == email2.trim()) {
      // this.formDatosPersonales.get('email2').updateValueAndValidity();
      alert('El correo 2 es igual al correo principal');
      return;
    } else {
    }

    this.btnActualizar = true;
    this.agendaService.agendaAlumnoService
      .actualizarEmailPrincipal$({
        idAlumno: this._rowActual.idAlumno,
        emailAPrincipal: this.formDatosPersonales.get('email2').value.trim(),
      })
      .subscribe({
        next: (resp: HttpResponse<IAlumnoInformacion>) => {
          this.alertaService.swalFireOptions({
            icon: 'success',
            title: 'Se Actualizo el Correo correctamente',
          });
          this.agendaService.agendaAlumnoService.actualizarEmail$.next(
            resp.body.email1.trim()
          );
          this.agendaService.agendaAlumnoService.obtenerHistorialModificacionesContacto(
            this.alumno.id
          );
          this.btnActualizar = false;
        },
        error: (error) => {
          let mensaje = this.alertaService.getErrorResponse(error).mensaje;
          if (error.status == 409) {
            this.alertaService
              .swalFireOptions({
                title: '¿Desea realizar el cambio de correo de todas formas?',
                html:
                  mensaje +
                  '</br></br><h2 style="color: red;">Se eliminara este dato y se reasignara las oportunidades.<h2>',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: '#4C5FC0',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
              })
              .then((result) => {
                if (result.isConfirmed) {
                  this.reasignacionOportunidades();
                } else {
                  this.btnActualizar = false;
                }
              });
          } else {
            this.btnActualizar = false;
            this.alertaService.swalFireOptions({
              icon: 'warning',
              title: '¡No se pudo realizar el cambio de correo!',
              html:
                mensaje +
                '</br></br><h2>Informar a sistemas para su revisión</h2>',
            });
            this.alertaService.notificationWarning(mensaje);
          }
        },
      });
  }
  reasignacionOportunidades() {
    this.btnActualizar = true;
    this.agendaService.agendaAlumnoService
      .reasignacionOportunidadesEmail$({
        idAlumno: this._rowActual.idAlumno,
        emailAPrincipal: this.formDatosPersonales.get('email2').value,
      })
      .subscribe({
        next: (
          resp: HttpResponse<{
            idClasificacionPersona: number;
            estadoReasignacion: boolean;
          }>
        ) => {
          this.btnActualizar = false;
          if (resp.body.estadoReasignacion) {
            this.agendaService.agendaAlumnoService.actualizarEmail$.next(
              this.formDatosPersonales.get('email2').value
            );
            this.alertaService.swalFireOptions({
              icon: 'success',
              title:
                'Se reasignaron las oportunidades del Alumno Correctamente.',
            });
            this.recargarDatosModificadosAlumno(
              resp.body.idClasificacionPersona
            );
          } else {
            this.alertaService.swalFireOptions({
              icon: 'warning',
              title: 'No se pudo realizar la reasignacion, intente de nuevo',
            });
          }
        },
        error: (error) => {
          this.btnActualizar = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.swalFireOptions({
            icon: 'warning',
            title: '¡Error en la reasignacion de correo!',
            text: mensaje,
          });
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**
   * Carga la lista de ciudades por codigo pais sin consultar a servicios
   * @param {number} idCodigoPais
   */
  cargarCiudadPorCodigoPais(idCodigoPais: number) {
    this.filtroCiudad = this.sourceCiudad.filter(
      (c) => c.idPais == idCodigoPais
    );
    if (idCodigoPais == 52) {
      this.formDatosPersonales
        .get('rfc')
        .addValidators(Validators.minLength(12));
      this.formDatosPersonales
        .get('rfc')
        .addValidators(Validators.maxLength(13));
    }
    if (idCodigoPais == 52) {
      this.formDatosPersonales
        .get('curp')
        .addValidators(Validators.minLength(18));
      this.formDatosPersonales
        .get('curp')
        .addValidators(Validators.maxLength(18));
    }
    this.sourceCiudad = this.filtroCiudad;
    let ciudad = this.sourceCiudad.find((c) => c.id == this.alumno.idCiudad);
    if (this.alumno.idCiudad != null) {
      if (ciudad) {
        this.formDatosPersonales.get('ciudad').setValue(ciudad.id);
      } else {
        this.formDatosPersonales.get('ciudad').setValue(null);
      }
    } else {
      this.formDatosPersonales.get('ciudad').setValue(null);
    }
  }
  @ViewChild('dropDownListEmpresa')
  dropDownListEmpresa: DropDownListComponent;
  sourceEmpresa: any[] = [];
  filterEmpresa(value: any) {
    console.log(value);
    if (value.length >= 3) {
      this.dropDownListEmpresa.loading = true;
      this.agendaService.agendaAlumnoService
        .obtenerEmpreseAutocomplete$(value)
        .subscribe({
          next: (response: any) => {
            console.log(response.body);
            this.dataEmpresa = response.body.slice();
            this.sourceEmpresa = response.body.slice();
            this.dropDownListEmpresa.loading = false;
          },
        });
    } else if (value.length >= 1) {
      this.dataEmpresa = [];
    } else {
      this.dataEmpresa = this.sourceEmpresa;
    }
  }
  filterCargo(value: string) {
    if (value.length >= 1) {
      this.filtroCargo = this.sourceCargo.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.filtroCargo = this.sourceCargo;
    }
  }
  filterAreaTrabajo(value: string) {
    if (value.length >= 1) {
      this.filtroAreaTrabajo = this.sourceAreaTrabajo.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.filtroAreaTrabajo = this.sourceAreaTrabajo;
    }
  }
  filterAreaFormacion(value: string) {
    if (value.length >= 1) {
      this.filtroAreaFormacion = this.sourceAreaFormacion.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.filtroAreaFormacion = this.sourceAreaFormacion;
    }
  }
  filterCiudad(value: string) {
    if (value.length >= 1) {
      this.filtroCiudad = this.sourceCiudad.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.filtroCiudad = this.sourceCiudad;
    }
  }

  // filterAsentamiento(value: string) {
  //   console.log('Value Asentamiento : ', value);
  //   if (value.length >= 1) {
  //     this.filtroAsentamiento = this.dataAsentamiento.filter(
  //       (s: any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
  //     );
  //   } else {
  //     this.filtroAsentamiento = this.dataAsentamiento;
  //   }
  // }
  /**
   * Carga la lista de Municipios por codigo Ciudad sin consultar a servicios
   * @param {number} idCiudadRef
   */
  cargarMunicipioPorCodigoCiudad(idCiudadRef: any) {
    if (this.alumno.idCodigoPais == 52) {
      this.formDatosPersonales.get('idCiudadMexico').setValue(null);
      this.formDatosPersonales.get('idMunicipioMexico').setValue(null);
      this.formDatosPersonales.get('codigoPostal').setValue(null);
      this.formDatosPersonales.get('idAsentamientoMexico').setValue(null);
      if (idCiudadRef != null) {
        console.log('Ciudad', idCiudadRef);
        this.agendaService.agendaAlumnoService.obtenerComboMunicipios(
          idCiudadRef
        );
        this.agendaService.agendaAlumnoService.obtenerComboCiudadMexico(
          idCiudadRef
        );
      }
      if (idCiudadRef == null) {
        this.dataAsentamiento = [];
        this.dataMunicipio = [];
        this.dataCiudadMexico = [];
      }
    }
  }

  cargarMunicipioConCiudadMexico(idCiudadMexico: any) {
    if (this.alumno.idCodigoPais == 52) {
      let idEstado = this.formDatosPersonales.get('ciudad').value;
      this.formDatosPersonales.get('idMunicipioMexico').setValue(null);
      this.formDatosPersonales.get('idAsentamientoMexico').setValue(null);
      this.formDatosPersonales.get('codigoPostal').setValue(null);
      if (idCiudadMexico == null) {
        if (idEstado != null) {
          this.agendaService.agendaAlumnoService.obtenerComboMunicipios(
            idEstado
          );
        }
      }
      if (idCiudadMexico != null) {
        this.dataAsentamiento = [];
        console.log('Ciudad', idCiudadMexico);
        this.agendaService.agendaAlumnoService.obtenerComboMunicipiosByEstadoAndCiudad(
          idEstado,
          idCiudadMexico
        );
      }
    } else {
      return;
    }
  }
  /**
   * Carga la lista de Municipios por codigo Ciudad sin consultar a servicios
   * @param {number} idMunicipio
   */
  cargarAsentamientoPorMunicipio(municipio: any) {
    this.formDatosPersonales.get('codigoPostal').setValue(null);
    this.formDatosPersonales.get('idAsentamientoMexico').setValue(null);
    let estadoTmp = this.formDatosPersonales.get('ciudad').value;
    let ciudadTmp = this.formDatosPersonales.get('idCiudadMexico').value;
    if (estadoTmp != null && municipio != null) {
      if (ciudadTmp != null) {
        this.agendaService.agendaAlumnoService.ObtenerAsentamientoPorMunicipioyCiudadMexico(
          estadoTmp,
          municipio,
          ciudadTmp
        );
      } else {
        this.agendaService.agendaAlumnoService.obtenerComboAsentamiento(
          estadoTmp,
          municipio
        );
      }
    } else {
    }
  }
  dataCP: any;
  mostrarTabla: boolean = false;
  idMunicipio: number;
  // Filto por Codigo Postal
  filtroCodigoPostal(codigoPostal: string) {
    if (
      codigoPostal == null ||
      codigoPostal == undefined ||
      codigoPostal == ''
    ) {
      return;
    } else {
      this.agendaService.agendaAlumnoService
        .obtenerCodigoPostal$(codigoPostal)
        .subscribe({
          next: (response: HttpResponse<IComboCodigoPostal>) => {
            this.dataCP = response.body;
            console.log('DATA : ', this.dataCP);
            console.log('Response.body : ', response.body);
            this.mostrarTabla = this.dataCP.length > 0;
            if (this.dataCP.length == null || this.dataCP.length == 0) {
              this.alertaService.mensajeIcon(
                'CodigoPostal no existe, intente denuevo'
              );
              this.formDatosPersonales.get('codigoPostal').setValue(null);
            }
          },
        });
    }
  }

  seleccionarCodigoPostal(item: any): void {
    this.formDatosPersonales
      .get('idCiudadMexico')
      .setValue(item.idCiudadMexico);
    if (this.dataCiudadMexico.length == 0) {
      this.agendaService.agendaAlumnoService.obtenerComboCiudadMexico(
        item.idCiudad
      );
    } else {
      let ciudadMexico = this.dataCiudadMexico.find(
        (x) => x.id == item.idCiudadMexico
      );
      if (ciudadMexico == null) {
        this.agendaService.agendaAlumnoService.obtenerComboCiudadMexico(
          item.idCiudad
        );
      }
    }
    this.formDatosPersonales.get('ciudad').setValue(item.idCiudad);
    if (this.dataMunicipio.length == 0) {
      let ciudadMexico = this.formDatosPersonales.get('idCiudadMexico').value;
      if (ciudadMexico == null || item.idCiudadMexico == null) {
        this.agendaService.agendaAlumnoService.obtenerComboMunicipios(
          item.idCiudad
        );
      } else {
        this.agendaService.agendaAlumnoService.obtenerComboMunicipiosByEstadoAndCiudad(
          item.idCiudad,
          item.idCiudadMexico
        );
      }
    } else {
      let municipio = this.dataMunicipio.find(
        (x) => x.id == item.idMunicipioMexico
      );
      if (municipio == null) {
        let ciudadMexico = this.formDatosPersonales.get('idCiudadMexico').value;
        if (ciudadMexico == null || item.idCiudadMexico == null) {
          this.agendaService.agendaAlumnoService.obtenerComboMunicipios(
            item.idCiudad
          );
        } else {
          this.agendaService.agendaAlumnoService.obtenerComboMunicipiosByEstadoAndCiudad(
            item.idCiudad,
            item.idCiudadMexico
          );
        }
      }
    }

    this.formDatosPersonales
      .get('idMunicipioMexico')
      .setValue(item.idMunicipioMexico);
    if (this.dataAsentamiento.length == 0) {
      if (item.idCiudadMexico == null) {
        this.agendaService.agendaAlumnoService.obtenerComboAsentamiento(
          item.idCiudad,
          item.idMunicipioMexico
        );
      } else {
        this.agendaService.agendaAlumnoService.ObtenerAsentamientoPorMunicipioyCiudadMexico(
          item.idCiudad,
          item.idMunicipioMexico,
          item.idCiudadMexico
        );
      }
    } else {
      let asentamiento = this.dataAsentamiento.find(
        (x) => x.idAsentamientoMexico == item.idAsentamientoMexico
      );
      if (asentamiento == null) {
        if (item.idCiudadMexico == null) {
          this.agendaService.agendaAlumnoService.obtenerComboAsentamiento(
            item.idCiudad,
            item.idMunicipioMexico
          );
        } else {
          this.agendaService.agendaAlumnoService.ObtenerAsentamientoPorMunicipioyCiudadMexico(
            item.idCiudad,
            item.idMunicipioMexico,
            item.idCiudadMexico
          );
        }
      }
    }
    this.formDatosPersonales
      .get('idAsentamientoMexico')
      .setValue(item.idAsentamientoMexico);
    
      this.formDatosPersonales
        .get('codigoPostal')
        .setValue(item.codigoPostal);
    
    this.mostrarTabla = false;
  }

  // Carga el CodigoPostal cuando selecciona Asentamiento

  cargarCodigoPostal(asentamiento: any) {
    if (asentamiento == null) {
      this.formDatosPersonales.get('codigoPostal').setValue(null);
      return;
    }
    if (this.formDatosPersonales.get('idAsentamientoMexico').value == null) {
      this.formDatosPersonales.get('codigoPostal').setValue(null);
    }
    let codigoPostalTmp = this.dataAsentamiento.find(
      (x) => x.idAsentamientoMexico === asentamiento
    );

    console.log('CodigoPostal:', codigoPostalTmp);
    if (codigoPostalTmp && codigoPostalTmp.codigoPostal) {
      this.formDatosPersonales
        .get('codigoPostal')
        .setValue(codigoPostalTmp.codigoPostal);
    } else {
      this.formDatosPersonales.get('codigoPostal').setValue(null);
    }
  }
  filterCentroCosto(value: any) {}
  cargarHistorialModificacionesContacto() {
    let sub$ =
      this.agendaService.agendaAlumnoService.historialModificacionAlumnoPorIdAlumno$.subscribe(
        {
          next: (resp) => {
            if (resp != null) {
              resp.forEach((e) => {
                if (this.validateEmail(e.valorAnterior)) {
                  e.valorAnterior =
                    this.agendaService.agendaAlumnoService.ofuscarCorreo(
                      e.valorAnterior
                    );
                }
                if (this.validateEmail(e.valorNuevo)) {
                  e.valorNuevo =
                    this.agendaService.agendaAlumnoService.ofuscarCorreo(
                      e.valorNuevo
                    );
                }
                if (e.campoActualizado.includes('Celular')) {
                  if (e.valorAnterior != null) {
                    e.valorAnterior = this.ofuscarNumero(e.valorAnterior);
                  }
                  if (e.valorNuevo != null) {
                    e.valorNuevo = this.ofuscarNumero(e.valorNuevo);
                  }
                }
                if (e.campoActualizado.includes('Telefono')) {
                  if (e.valorAnterior != null) {
                    e.valorAnterior = this.ofuscarNumero(e.valorAnterior);
                  }
                  if (e.valorNuevo != null) {
                    e.valorNuevo = this.ofuscarNumero(e.valorNuevo);
                  }
                }
              });
              this.gridHistorialModifcacionesContacto.data = resp;
            }
          },
        }
      );
    this.subscriptions.add(sub$);
  }
  contenidoEmail: string = '';
  nombreEmail: string = '';
  validateEmail(email: string) {
    // let emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    let emailReg2 = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!emailReg2.test(email.trim())) {
      return false;
    } else {
      return true;
    }
  }
  ofuscarNumero(numero: string) {
    if (this.agendaService.esCoordinadora$.value) {
      return numero;
    } else {
      if (numero != '' && numero != null) {
        let contador = numero.length;
        let numeroNuevoModeloOcultar = numero.substring(0, contador - 3);
        let numeroNuevoModeloVisualizar = numero.substring(
          contador - 3,
          numero.length
        );
        let numeroOperacionesOculto = '';
        for (var i = 0; numeroNuevoModeloOcultar.length > i; i++) {
          numeroOperacionesOculto += '•';
        }
        let resultadoNumeroOcultoOperaciones =
          numeroOperacionesOculto + numeroNuevoModeloVisualizar;
        return resultadoNumeroOcultoOperaciones;
      } else if (numero == '' || numero == null) {
        return numero;
      }
      return '';
    }
  }

  /**
   * Verifica que el email tengo el nombre antes del correo
   * @param {string} correo
   * @return {boolean}
   */
  emailConNombre(correo: string) {
    if (correo.charAt(0) == '"' && correo.indexOf('<') != -1) {
      this.nombreEmail = correo.substring(0, correo.indexOf('<') + 1);
      this.contenidoEmail = correo.substring(
        correo.indexOf('<') + 1,
        correo.length - 1
      );
      return true;
    } else {
      return false;
    }
  }
  guardarContacto() {
    if (this.flagActualizarAlumno) {
      this.loading = true;
      this.btnGuardarContacto.disabled = true;
      let dataFormulario = this.formDatosPersonales.getRawValue();

      if (dataFormulario.celular2 === dataFormulario.celular) {
        alert('Ingrese un Numero Diferente, campo: Celular');
        this.flagActualizarAlumno = true;
        this.btnGuardarContacto.disabled = false;
        this.loading = false;
        return;
      }

      if (dataFormulario.celular === dataFormulario.celular2) {
        this.flagActualizarAlumno = true;
        this.alertaService.mensajeIcon(
          'Ingrese un Numero Diferente, campo: Celular'
        );

        this.loading = false;
        return;
      }

      if (dataFormulario.email1 == '' && dataFormulario.email1 == null) {
        this.alertaService.mensajeIcon(
          'Ingrese un correo valido, campo: Email 1'
        );

        this.flagActualizarAlumno = true;
        this.btnGuardarContacto.disabled = false;
        this.loading = false;
        return;
      }

      if (!this.validateEmail(dataFormulario.email1)) {
        this.alertaService.mensajeIcon(
          'Ingrese un correo valido, campo: Email 1'
        );

        this.flagActualizarAlumno = true;
        this.btnGuardarContacto.disabled = false;
        this.loading = false;
        return;
      }

      if (
        this.alumno.idCodigoPais == 52 &&
        dataFormulario.rfc != null &&
        this.esIS == false
      ) {
        if (dataFormulario.rfc.length < 12 && dataFormulario.rfc.length > 13) {
          this.alertaService.mensajeIcon('Ingrese un RFC Valido');

          this.flagActualizarAlumno = true;
          this.btnGuardarContacto.disabled = false;
          this.loading = false;
          return;
        }
      }
      if (
        this.alumno.idCodigoPais == 52 &&
        dataFormulario.curp != null &&
        this.esIS == false
      ) {
        if (
          dataFormulario.curp.length > 0 &&
          dataFormulario.curp.length != 18
        ) {
          this.alertaService.mensajeIcon('Ingrese un CURP Valido');

          this.flagActualizarAlumno = true;
          this.btnGuardarContacto.disabled = false;
          this.loading = false;
          return;
        }
      }

      if (!this.validateEmail(dataFormulario.email2)) {
        this.alertaService.mensajeIcon(
          'Ingrese un correo valido, campo: Email 2'
        );
        this.flagActualizarAlumno = true;
        this.btnGuardarContacto.disabled = false;
        this.loading = false;
        return;
      }
      if (dataFormulario.celular2 != '' && dataFormulario.celular2 != null) {
        let reg = /^(?!.*([0-9])\1{6})(?=.*[0-9])(?=.*\d){8,}[0-9]+$/;
        let celular2 = dataFormulario.celular2;
        let pais: number = this.alumno.idCodigoPais;
        let telefono2ok = reg.exec(celular2);
        if (!telefono2ok) {
          this.alertaService.mensajeIcon(
            'Ingrese un celular valido, campo: Celular 2'
          );
          this.flagActualizarAlumno = true;
          this.btnGuardarContacto.disabled = false;
          this.loading = false;
          return;
        } else {
          if (pais == 51) {
            let inicioCelular2 = celular2.charAt(0);
            if (inicioCelular2 != '9') {
              this.alertaService.mensajeIcon(
                'Ingrese un celular valido, campo: Celular 2'
              );
              this.flagActualizarAlumno = true;
              this.btnGuardarContacto.disabled = false;
              this.loading = false;
              return;
            }
          }
        }
      }
      // if (this.formDatosPersonales.valid) {
      let dataAlumno: IAlumnoActualizar = {
        id: this.alumno.id,
        nombre1: dataFormulario.nombre1,
        nombre2: dataFormulario.nombre2,
        apellidoPaterno: dataFormulario.apellidoPaterno,
        apellidoMaterno: dataFormulario.apellidoMaterno,
        dni: dataFormulario.dni != null ? dataFormulario.dni.trim() : '',
        email1:
          dataFormulario.email1 != null ? dataFormulario.email1.trim() : '',
        email2:
          dataFormulario.email2 != null ? dataFormulario.email2.trim() : '',
        celular: dataFormulario.celular,
        celular2: dataFormulario.celular2,
        telefono: dataFormulario.telefono,
        telefono2: dataFormulario.telefono2,
        genero: this.alumno.genero,
        parentesco: this.alumno.parentesco,
        nombreFamiliar: this.alumno.nombreFamiliar,
        telefonoFamiliar: this.alumno.telefonoFamiliar,
        fechaNacimiento:
          this.alumno.fechaNacimiento != null
            ? datePipeTransform(new Date(this.alumno.fechaNacimiento))
            : null,
        direccion: dataFormulario.direccion,
        //idCargo: dataFormulario.cargo?.id,
        //cargo: dataFormulario.cargo?.nombre,
        //idAtrabajo: dataFormulario.aTrabajo?.id,
        //atrabajo: dataFormulario.aTrabajo?.nombre,
        //idEmpresa: dataFormulario.empresa?.id,
        //empresa: dataFormulario.empresa?.nombre,
        //idAformacion: dataFormulario.aFormacion?.id,
        //aformacion: dataFormulario.aFormacion?.nombre,
        //idIndustria: dataFormulario.industria?.id,
        //industria: dataFormulario.industria?.nombre,
        idCiudad: dataFormulario.ciudad,
        idCodigoPais: this.alumno.idCodigoPais,
        idMunicipioMexico: dataFormulario.idMunicipioMexico,
        idAsentamientoMexico: dataFormulario.idAsentamientoMexico,
        idCiudadMexico: dataFormulario.idCiudadMexico,
        estadoLugar: dataFormulario.estadoLugar,
        curp: dataFormulario.curp,
        rfc: dataFormulario.rfc,
      };

      this.agendaService.agendaAlumnoService
        .actualizarAlumno$(dataAlumno)
        .subscribe({
          next: (resp: HttpResponse<IAlumnoInformacion>) => {
            this.flagActualizarAlumno = true;
            this.alertaService.swalFireOptions({
              icon: 'success',
              title: 'Se Actualizo el registro',
            });
            this.btnGuardarContacto.disabled = false;
            this.recargarDatosModificadosAlumno(
              this.agendaService.rowActual.idClasificacionPersona
            );
            this.agendaService.agendaAlumnoService.obtenerHistorialModificacionesContacto(
              this.alumno.id
            );
            this.agendaService.agendaAlumnoService.obtenerColorPerfilProgramaPorIdOportunidad(this.agendaService.rowActual.idOportunidad);
            this.loading = false;
          },
          error: (error) => {
            console.log(error);
            this.loading = false;
            let mensaje = this.alertaService.getErrorResponse(error).mensaje;
            this.alertaService.swalFireOptions({
              icon: 'warning',
              title: '¡Error al actualizar datos del alumno!',
              text: mensaje,
            });
            this.alertaService.notificationWarning(mensaje);
          },
        });
      // } else {
      //   this.formDatosPersonales.markAllAsTouched();
      //   this.alertaService.mensajeIcon(
      //     'Complete por favor los campos correctamente!'
      //   );
      //   this.loading = false;
      // }
    } else {
      this.formDatosPersonales.markAllAsTouched();
      this.alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
      this.loading = false;
    }
  }
  obtenerHistorialModificacionesContacto() {
    this.agendaService.agendaAlumnoService.obtenerHistorialModificacionesContacto(
      this.alumno.id
    );
  }
  abrirModuloEmpresa(context: any) {
    this.modalService.open(context, { size: 'xl', backdrop: 'static' });
  }
  recargarDatosModificadosAlumno(IdClasificacionPersona: any) {
    let rowActual = this.agendaService.rowActual;
    this.agendaService.agendaAlumnoService
      .recargarDatosModificadosAlumno$(
        IdClasificacionPersona,
        rowActual.idOportunidad
      )
      .subscribe({
        next: (response: HttpResponse<IAgendaDatosAlumno>) => {
          console.log(response.body);
          this.agendaService.agendaAlumnoService.datosAlumno$.next(
            response.body
          );
          this.agendaService.agendaAlumnoService.alumno$.next(
            response.body.alumno
          );
          var nombreCompleto =
            response.body.alumno.apellidoPaterno +
            ' ' +
            response.body.alumno.apellidoMaterno +
            ', ' +
            response.body.alumno.nombre1 +
            response.body.alumno.nombre2;
          this._rowActual.celular = response.body.alumno.celular;
          this._rowActual.contacto = nombreCompleto;
          this._rowActual.dni = response.body.alumno.dni;
          this._rowActual.email1 = response.body.alumno.email1;
          this._rowActual.idAlumno = response.body.alumno.id;
          this._rowActual.idClasificacionPersona = IdClasificacionPersona;
          this._rowActual.idCodigoPais = response.body.alumno.idCodigoPais;
          console.log(this._rowActual);
          let speech =
            this.agendaService.agendaActividadesService
              .speechBienvenidaDespedida$.value;
          this.agendaService.agendaActividadesService.speechBienvenidaDespedida$.next(
            speech
          );
          this.agendaService.agendaSentinelService.resetSentinel();
          this.agendaService.agendaSentinelService.iniciarSentinel();
          this.agendaService.agendaAlumnoService.obtenerHistorialModificacionesContacto(
            this.alumno.id
          );
        },
      });
  }
  realizarCambioCentroCosto() {
    if (this.cambioCentroCosto.value != null) {
      if (this.cambioCentroCosto.value != this._rowActual.idCentroCosto) {
        this.alertaService
          .swalFireOptions({
            title: '¿Desea realizar el cambio de centro de costo?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false,
          })
          .then((result) => {
            if (result.isConfirmed) {
              this.btnActualizarCentroCosto = true;
              this.agendaService.agendaProgramacionActividadesService
                .realizarCambioCentroCosto$(this.cambioCentroCosto.value)
                .subscribe({
                  next: (resp: HttpResponse<any>) => {
                    // this.rowActual = ;
                    this.btnActualizarCentroCosto = false;
                    this.alertaService.swalFireOptions({
                      icon: 'success',
                      title: 'Se realizo el cambio de centro de costo',
                    });
                    this.agendaService.setNewRowActual(resp.body);
                  },
                  error: (error) => {
                    this.btnActualizarCentroCosto = false;
                    let mensaje =
                      this.alertaService.getMessageErrorService(error);
                    this.alertaService.swalFireOptions({
                      icon: 'error',
                      title: '¡Error al cambiar de Centro de Costo!',
                      text:
                        mensaje ??
                        'Ocurrio un problema al realizar el cambio de centro de costo',
                    });
                  },
                });
            } else {
              this.btnActualizarCentroCosto = false;
            }
          });
      } else {
        this.alertaService.swalFireOptions({
          icon: 'info',
          title: '¡Eliga un centro de costo diferente al actual',
        });
      }
    }
  }
}

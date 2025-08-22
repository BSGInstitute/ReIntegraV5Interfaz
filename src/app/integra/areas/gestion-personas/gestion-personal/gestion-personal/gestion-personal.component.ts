import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiGestionPersonal, constApiGlobal } from '@environments/constApi';
import { HorarioDTO } from '@gestionPersonas/models/fichaDatosPersonal';


import { IcomboAreaTrabajo, IcomboCentralLlamada, IcomoboZonaHoraria, PersonalGlobal } from '@gestionPersonas/models/personal-global';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-gestion-personal',
  templateUrl: './gestion-personal.component.html',
  styleUrls: ['./gestion-personal.component.scss']
})
export class GestionPersonalComponent implements OnInit {
  @ViewChild('modalInsertarPersonal') modalInsertarPersonal: any;
  @ViewChild('modalInsertarHorario') modalInsertarHorario: any;

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private alertaService: AlertaService
  ) { }

  ngOnInit(): void {
    this.obtenerTodo();
    this.ObtenerAreaTrabajo();
    this.ObtenerCetralLlamada();
    this.ObtenerDominioPbx();
    this.ObtenerZonaHorariaActivo();
  }
  ngOnDestroy(): void { }

  // Variables
  gridGestionPersonal: KendoGrid = new KendoGrid();
  esNuevo: boolean = false;
  enProcesoSolicitud: boolean = false;
  dataItemTemp: PersonalGlobal
  personal: PersonalGlobal = null

  modalRefPersonal: NgbModalRef = null;
  formatoInput: string = 'password';

  listaPersonal: IComboBase1[] = [];
  listaArea: IcomboAreaTrabajo[] = [];
  listaFiltroAreas: IcomboAreaTrabajo[] = [];
  listaCentralLlamada: IcomboCentralLlamada[] = [];
  listaFiltroCentralLlamada: IcomboCentralLlamada[] = [];
  listaDominioPbx: IComboBase1[] = [];
  listaFiltroDominioPbx: IComboBase1[] = [];
  listaZonaHorariaActivo: IcomoboZonaHoraria[] = [];
  listaFiltroZonaHorariaActivo: IcomoboZonaHoraria[] = [];
  loader: boolean = false;
  loaderValidacion: boolean = false;
  listaJefe: IComboBase1[] = [];
  idPersonal: number = null;
  horarioPersonal: HorarioDTO[] = [];
  errorMessage: string;
  /*------------------------ Formularios ------------------------ */
  formPersonal: FormGroup = this._formBuilder.group({
    id: [null],
    nombres: [null, [Validators.required]],
    apellidos: [null, [Validators.required]],
    area: [null, [Validators.required]],
    idPersonalAreaTrabajo: [null],
    asesorCoordinador: [null],
    email: [null, [Validators.required, Validators.email]],
    anexo: [null, [Validators.required]],
    central: [null, [Validators.required]],
    idCentral: [null],
    jefe: [null],
    idJefe: [null],
    areaAbrev: [null],
    dominio: [null, [Validators.required]],
    idDominioPbx: [null],
    idPais: [null, [Validators.required]],
    ip1: [null],
    ip2: [null],
    activo: [],
    usuarioAsterisk: [null],
    contrasenaAsterisk: [null],
    passwordCorreo: [null],
  });

  formHorario: FormGroup = this._formBuilder.group({
    idPersonal: 0,
    lunes: this._formBuilder.group({
      entrada: '',
      recesoInicio: '',
      recesoRegreso: '',
      salida: ''
    }),
    martes: this._formBuilder.group({
      entrada: '',
      recesoInicio: '',
      recesoRegreso: '',
      salida: ''
    }),
    miercoles: this._formBuilder.group({
      entrada: '',
      recesoInicio: '',
      recesoRegreso: '',
      salida: ''
    }),
    jueves: this._formBuilder.group({
      entrada: '',
      recesoInicio: '',
      recesoRegreso: '',
      salida: ''
    }),
    viernes: this._formBuilder.group({
      entrada: '',
      recesoInicio: '',
      recesoRegreso: '',
      salida: ''
    }),
    sabado: this._formBuilder.group({
      entrada: '',
      recesoInicio: '',
      recesoRegreso: '',
      salida: ''
    }),
    domingo: this._formBuilder.group({
      entrada: '',
      recesoInicio: '',
      recesoRegreso: '',
      salida: ''
    })
  })

  validarClaveApp() {
    let userData = this.obtenerUserData()
    const data = this.formatearObjeto();

    let payload = {
      Usuario: userData.userName,
      EmailRemitente: data.email,
      PersonalRemitente: data.nombres,
      PasswordCorreo: data.passwordCorreo
    }
    this.loaderValidacion = true;

    this._integraService.postJsonResponse(
      constApiGestionPersonal.ValidarClaveAplicacion,
      payload
    ).subscribe({
      next: (response: HttpResponse<[]>) => {
        if (response.body) {
          this._alertaService.addSuccess("Exito", "Clave de aplicacion correcta");
          this.loaderValidacion = false;
        } else {
          this._alertaService.addWarning("Invalido", "Clave de aplicacion invalida")
          this.loaderValidacion = false;
        }
      }, error: (e) => {
        this._alertaService.notificationError(`Error: ${e.error.errorCode}`)
        this.loaderValidacion = false;
      }
    })
  }

  obtenerUserData(): {
    userName: string,
    idRol: number,
    idPersonal: number,
    areaTrabajo: string
  } {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')

    if (!userData) {
      this._alertaService.addWarning('Informacion', 'UserData no encontrado en local storage')
    }
    return userData
  }

  insertar(): void {
    if (this.formPersonal.invalid) {
      this.formPersonal.markAllAsTouched();
      return;
    }
    this.loader = true;
    const body = this.formatearObjeto();

    this._integraService.postJsonResponse(
      constApiGestionPersonal.InsertarNuevoPersonal,
      body
    ).subscribe({
      next: (resp: HttpResponse<boolean>) => {
        if (resp.body) {
          this._alertaService.addSuccess("Éxito", "Se creó correctamente el personal");
          this.obtenerTodo();
          this.loader = false;
          this.modalRefPersonal.close();
        }
      },
      error: (err) => {
        this._alertaService.notificationError(`Error: ${err.error.message}`);
        this.errorMessage = err.error.message;
        this.alertaService.swalFireOptions({
          icon: 'warning',
          text: err.error.message
        })
        this.loader = false;
      }
    });
  }

  actualizar() {
    const body = this.formatearObjeto();
    this.loader = true;

    this._integraService.postJsonResponse(
      constApiGestionPersonal.ActualizarPersonal,
      body
    )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.body) {
            this._alertaService.addSuccess("Exito", " Se actualizo Correctamente");
            this.obtenerTodo();
            this.loader = false
            this.modalRefPersonal.close();
          }
        },
        error: (err) => {
          this._alertaService.notificationError(`Error: ${err.error.message}`);
          this.loader = false;
          this.alertaService.swalFireOptions({
            icon: 'warning',
            text: err.error.message
          })
        }
      })
  }
  resetIps() {
    this.formPersonal.patchValue({
      ip1: "",
      ip2: ""
    })
    this._alertaService.addInfo('Informacion:', 'Se limpiaron correctamente las Ips')
  }

  insertarHorario() {
    const body = this.formatearObjetoHorario();
    this.loader = true;
    console.log('body', body);
    this._integraService.postJsonResponse(
      constApiGestionPersonal.PersonalGuardarHorario, body
    ).subscribe({
      next: (response: HttpResponse<[]>) => {
        if (response.body) {
          this._alertaService.addSuccess("Exito", "Se guardo correctamente el horario")
          this.loader = false
          this.modalRefPersonal.close();
        }
      },
      error: (e) => {
        this._alertaService.notificationWarning(`Error: ${e.error}`);
        this.loader = false
        console.log('Error al insertar horario', e)
      }
    })
  }
  formatearObjetoHorario(): any {
    let objetoEnviar = this.formHorario.getRawValue();
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const payload: any = {};

    dias.forEach(dia => {
      const horario = this.formHorario.get(dia)?.value;
      if (horario) {
        const DiaCapitalizado = dia.charAt(0) + dia.slice(1);
        payload[`${DiaCapitalizado}1`] = this.convertirHora(horario.entrada) || null;
        payload[`${DiaCapitalizado}2`] = this.convertirHora(horario.recesoInicio) || null;
        payload[`${DiaCapitalizado}3`] = this.convertirHora(horario.recesoRegreso) || null;
        payload[`${DiaCapitalizado}4`] = this.convertirHora(horario.salida) || null;
      }
    });
    payload.idPersonal = objetoEnviar.idPersonal;

    return payload;
  }

  formatearObjeto(): any {
    let objetoEnviar = this.formPersonal.getRawValue();
    let personalHorario = {
      usuarioCreacion: "",
      usuarioModificacion: ""
    }
    return {
      id: objetoEnviar.id || 0,
      nombres: objetoEnviar.nombres || null,
      apellidos: objetoEnviar.apellidos || null,
      area: objetoEnviar.area?.nombre || null,
      areaAbrev: objetoEnviar.area?.codigo || null,
      idPersonalAreaTrabajo: objetoEnviar.area?.id || null,
      asesorCoordinador: (objetoEnviar.asesorCoordinador || objetoEnviar.asesorCoordinador) || 'otro',
      email: objetoEnviar.email || null,
      anexo: objetoEnviar.anexo || null,
      central: objetoEnviar.central?.direccionIp || null,
      idCentral: objetoEnviar.central?.id || null,
      jefe: objetoEnviar.jefe?.nombre || null,
      idJefe: objetoEnviar.jefe?.id || 0,
      dominio: objetoEnviar.dominio?.nombre || null,
      idDominioPbx: objetoEnviar.dominio?.id || null,
      idPais: objetoEnviar.idPais?.codigo || null,
      ip1: objetoEnviar.ip1 || "",
      ip2: objetoEnviar.ip2 || "",
      activo: objetoEnviar.activo,
      usuarioAsterisk: objetoEnviar.usuarioAsterisk || null,
      contrasenaAsterisk: objetoEnviar.contrasenaAsterisk || null,
      passwordCorreo: objetoEnviar.passwordCorreo || "",
      personalHorario: personalHorario
    }
  }



  obtenerTodo() {
    this.gridGestionPersonal.loading = true;
    this._integraService.getJsonResponse(
      constApiGestionPersonal.ObtenerTodoPersonal
    ).subscribe({
      next: (resp: HttpResponse<PersonalGlobal[]>) => {
        this.gridGestionPersonal.data = resp.body;
        this.gridGestionPersonal.loading = false;
      },
      error: (error) => {
        this.gridGestionPersonal.loading = false;
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationWarning(mensaje);
      }
    })
  }
  ObtenerAreaTrabajo() {
    this._integraService.getJsonResponse(
      constApiGestionPersonal.ObtenerPersonaAreaTrabajo
    ).subscribe({
      next: (resp: HttpResponse<IcomboAreaTrabajo[]>) => {
        this.listaArea = resp.body;
        this.listaFiltroAreas = resp.body;
      },
      error: (error) => {
        let mensaje = this._alertaService.getMessageErrorService(error);
        this._alertaService.notificationWarning(mensaje);
      }
    });

  }

  ObtenerCetralLlamada() {
    this._integraService.getJsonResponse(
      constApiGestionPersonal.ObtenerDireccionCentralLlamada
    ).subscribe({
      next: (resp: HttpResponse<IcomboCentralLlamada[]>) => {
        this.listaCentralLlamada = resp.body;
        this.listaFiltroCentralLlamada = resp.body;
      },
      error: (error) => {
        let mensaje = this._alertaService.getMessageErrorService(error);

        this._alertaService.notificationWarning(mensaje);
      }
    })
  }

  ObtenerDominioPbx() {
    this._integraService.getJsonResponse(
      constApiGestionPersonal.ObtenerDominioPbx
    ).subscribe({
      next: (response: HttpResponse<[]>) => {
        this.listaDominioPbx = response.body;
        this.listaFiltroDominioPbx = response.body
      },
      error: (error) => {
        let mensaje = this._alertaService.getMessageErrorService(error);

        this._alertaService.notificationWarning(mensaje);
      }
    })
  }

  ObtenerZonaHorariaActivo() {
    this._integraService.getJsonResponse(
      constApiGestionPersonal.ObtenerZonaHorariaActivo
    ).subscribe({
      next: (response: HttpResponse<IcomoboZonaHoraria[]>) => {
        const lista = response.body?.map(item => ({
          ...item,
          nombreExtendido: `${item.nombre} (${~~Number(item.zonaHoraria)})`
        })) || [];

        this.listaZonaHorariaActivo = lista;
        this.listaFiltroZonaHorariaActivo = lista;
      },
      error: (error) => {
        let mensaje = this._alertaService.getMessageErrorService(error);

        this._alertaService.notificationWarning(mensaje);
      }
    })
  }



  FiltrarPersonalBusqueda(value: string) {
    if (value.length > 4) {
      this._integraService.getJsonResponse(
        `${constApiGlobal.PersonalObtenerPersonalAutocomplete}/${value}`
      )
        .subscribe({
          next: (resp: HttpResponse<IComboBase1[]>) => {
            this.listaPersonal = resp.body;
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          }
        });
    } else {
      this.listaPersonal = [];
    }
  }


  filtrarAreasBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaArea = this.listaFiltroAreas.filter(
        (i) => i.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaArea = this.listaFiltroAreas;
    }
  }
  filtrarDireccionCentralLlamada(value: string) {
    if (value.length >= 1) {
      this.listaCentralLlamada = this.listaFiltroCentralLlamada.filter(
        (i) => i.nombre.toLowerCase().indexOf(value.toLocaleLowerCase()) != -1
      );
    } else {
      this.listaCentralLlamada = this.listaFiltroCentralLlamada;
    }
  }

  FiltroDominioPbx(value: string) {
    if (value.length >= 1) {
      this.listaDominioPbx = this.listaFiltroDominioPbx.filter((i) => i.nombre.toLowerCase().indexOf(value.toLocaleLowerCase()) != -1
      );
    } else {
      this.listaDominioPbx = this.listaFiltroDominioPbx;
    }
  }

  FiltroZonaHorarioActivo(value: string) {
    if (value.length >= 1) {
      this.listaZonaHorariaActivo = this.listaFiltroZonaHorariaActivo.filter((i) => i.nombre.toLowerCase().indexOf(value.toLocaleLowerCase()) != -1
      );
    } else {
      this.listaZonaHorariaActivo = this.listaFiltroZonaHorariaActivo;
    }
  }
  /* ---------------- Abrir Modal--------------------- */

  limpiarDia(dia: string) {
    const grupo = this.formHorario.get(dia);
    if (grupo) {
      grupo.patchValue({
        entrada: '',
        recesoInicio: '',
        recesoRegreso: '',
        salida: ''
      });
    }
  }

  abrirModalInsertarPersonal(): void {
    this.listaPersonal = [];
    // this.listaArea = []

    this.formPersonal.reset({
      activo: true,
      asesorCoordinador: 'Otro'
    });
    this.esNuevo = true;
    this.modalRefPersonal = this._modalService.open(
      this.modalInsertarPersonal, {
      size: 'md',
      backdrop: 'static'
    }
    )

  }
  diasSemana: string[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
  obtenerHorarioPersonal(id: number): Observable<HorarioDTO> {
    return this._integraService.getJsonResponse(
      `${constApiGestionPersonal.PersonalObteneHorarioPorId}/${id}`
    ).pipe(
      map((res: HttpResponse<HorarioDTO[]>) => res.body?.[0])
    );
  }



  assetHorario() {
    let idPersonal = this.idPersonal;

    const patchValue: any = {
      idPersonal: idPersonal
    };

    const plantilla: Record<string, (string | null)[]> = {
      lunes: ['09:00', '14:00', '15:00', '19:00'],
      martes: ['09:00', '14:00', '15:00', '19:00'],
      miercoles: ['09:00', '14:00', '15:00', '19:00'],
      jueves: ['09:00', '14:00', '15:00', '19:00'],
      viernes: ['09:00', '14:00', '15:00', '19:00'],
      sabado: ['09:00', '12:00', null, null],
      domingo: [null, null, null, null]
    };

    for (const dia of Object.keys(plantilla)) {
      patchValue[dia] = {
        entrada: plantilla[dia][0],
        recesoInicio: plantilla[dia][1],
        recesoRegreso: plantilla[dia][2],
        salida: plantilla[dia][3]
      };
    }
    this.formHorario.patchValue(patchValue);
  }


  convertirHora(hora: string | null): string | null {
    if (!hora) return null;
    return hora.length === 5 ? `${hora}:00` : hora;
  }

  abrirModalHorario(dataItem: PersonalGlobal) {
    this.formHorario.reset();
    const idPersonal = dataItem.id;
    this.idPersonal = idPersonal;

    this.obtenerHorarioPersonal(idPersonal).subscribe(horario => {
      const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
      const patchValue: any = {
        idPersonal: horario.idPersonal
      };
      dias.forEach(dia => {
        patchValue[dia] = {
          entrada: (horario as any)[`${dia}1`],
          recesoInicio: (horario as any)[`${dia}2`],
          recesoRegreso: (horario as any)[`${dia}3`],
          salida: (horario as any)[`${dia}4`],
        };
      });
      this.formHorario.patchValue(patchValue);
    });

    this.modalRefPersonal = this._modalService.open(this.modalInsertarHorario, {
      size: 'xl',
      backdrop: 'static'
    });
  }



  abrirModalDetalle(dataItem: PersonalGlobal): void {
    this.formPersonal.reset();
    this.listaPersonal = [];

    this.listaJefe = []
    this.listaJefe.push({
      id: dataItem.idJefe,
      nombre: dataItem.jefe
    })

    let centralObjTemp = this.listaCentralLlamada.find(u => u.id === dataItem.idCentral)

    this.esNuevo = false;
    this.formPersonal.patchValue({
      id: dataItem.id,
      nombres: dataItem.nombres,
      apellidos: dataItem.apellidos,
      area: this.listaArea.find(i => i.nombre == dataItem.area),
      areaAbrev: this.listaArea.find(i => i.codigo == dataItem.areaAbrev),
      idPersonalAreaTrabajo: this.listaArea.find(i => i.id == dataItem.idPersonalAreaTrabajo),
      asesorCoordinador: dataItem.asesorCoordinador,
      email: dataItem.email,
      anexo: dataItem.anexo,
      central: centralObjTemp,
      idCentral: this.listaCentralLlamada.find(i => i.id == dataItem.idCentral),
      jefe: this.listaJefe.find(i => i.nombre == dataItem.jefe),
      idJefe: this.listaJefe.find(i => i.id == dataItem.idJefe),
      dominio: this.listaDominioPbx.find(i => i.nombre == dataItem.dominio),
      idDominioPbx: this.listaDominioPbx.find(i => i.id == dataItem.idDominioPbx),
      idPais: this.listaZonaHorariaActivo.find(i => i.codigo == dataItem.idPais),
      ip1: dataItem.ip1,
      ip2: dataItem.ip2,
      activo: dataItem.activo,
      usuarioAsterisk: dataItem.usuarioAsterisk,
      contrasenaAsterisk: dataItem.contrasenaAsterisk,
      passwordCorreo: dataItem.passwordCorreo,
      personalHorario: {
        usuarioCreacion: dataItem.personalHorario.usuarioCreacion,
        usuarioModificacion: dataItem.personalHorario.usuarioModificacion

      }
    })
    console.log('formPersonal', this.formPersonal)
    this.modalRefPersonal = this._modalService.open(
      this.modalInsertarPersonal, {
      size: 'md',
      backdrop: 'static'
    }
    )
  }

  mostrarPassword: { [key: string]: boolean } = {
    contrasenaAsterisk: false,
    passwordCorreo: false
  };

  getInputType(campo: string): string {
    return this.mostrarPassword[campo] ? 'text' : 'password';
  }

  togglePassword(campo: string): void {
    this.mostrarPassword[campo] = !this.mostrarPassword[campo];
  }


}

import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import {
  IDatosGenerales,
  IDatosVencidas,
  IDetalleSentinel,
  IDeuda,
  IDniRuc,
  IPosicionHistoria,
  ISentinelEstado,
  INuevosDatosPerfilAlumno,
  INuevosDatosPerfilAlumnoResponsabilidad
} from '@comercial/models/interfaces/iagenda-sentinel';
import {
  IDatosSentinelAlumno,
  ILineaCredito,
} from '@comercial/models/interfaces/isemaforo-financiero';
import {
  IAlumnoInformacion,
  IAgendaDatosAlumno,
} from '@integra/areas/comercial/models/interfaces/iagenda-datos-alumno';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import {
  DropDownFilterSettings,
  DropDownListComponent,
} from '@progress/kendo-angular-dropdowns';
import { FormGroup,FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-perfil-profesional',
  templateUrl: './perfil-profesional.component.html',
  styleUrls: ['./perfil-profesional.component.scss'],
})
export class PerfilProfesionalComponent implements OnInit {
  @Input() agendaService: AgendaService;
  sentinelAlumno: any = {};

  btnVerDetalleSentinel: any = {
    disabled: false,
    show: false,
  };
  
  btnConsultar: any = {
    disabled: false,
    show: false,
    text: 'Consultar',
    class: 'btn-success',
    color: 'success',
  };
  alumno: IAlumnoInformacion = {};
  nroDocumento = '';
  rowActual: IRowActual;
  showSentinelHelp: boolean = false;
  sentinelHelp: string = '';
  gridDNIRUC: KendoGrid = new KendoGrid();
  gridDocumentoConsultadoDetalleDeuda: KendoGrid = new KendoGrid();
  gridDocumentoDetalleVencidos: KendoGrid = new KendoGrid();
  gridDocumentoLineasCredito: KendoGrid = new KendoGrid();
  gridOtroDocumentoConsultadoDetalleDeuda: KendoGrid = new KendoGrid();
  gridOtroDocumentoDetalleVencidos: KendoGrid = new KendoGrid();
  gridOtroDocumentoLineasCredito: KendoGrid = new KendoGrid();
  gridDatosGenerales = new KendoGrid();
  gridDatosPrincipales1: KendoGrid = new KendoGrid();
  gridDatosPrincipales2: KendoGrid = new KendoGrid();
  gridDireccionesRegistradas: KendoGrid = new KendoGrid();
  gridPosicionHistorica: KendoGrid = new KendoGrid();
  subscriptions: Subscription = new Subscription();
  colorAreaFormacion = ''
  colorAreaTrabajo = ''
  colorCargo = ''
  colorIndustria = ''
  sourceCargo: any[] = [];
  filtroCargo: any[] = [];
  sourceAreaFormacion: any[] = [];
  filtroAreaFormacion: any[] = [];
  filtroIndustria: any[] = [];
  sourceIndustria: any[] = [];
  filtroTiempoExperiencia: any[] = [];
  sourceTiempoExperiencia: any[] = [];
  filtroTamanioEmpresa: any[] = [];
  sourceTamanioEmpresa: any[] = [];
  sourceAreaTrabajo: any[] = [];
  filtroAreaTrabajo: any[] = [];

  dataEmpresa: any[] = [];
  filtroEmpresa: any[] = [];
  showDatosMexico: boolean = false;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  responsabilidad = ''
  
  constructor(
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder,
    private _alertaService: AlertaService
  ) {}

  formDatosCarlos:FormGroup=this.formBuilder.group({
    cargoeditable:null,
    aFormacioneditable:null,
    industriaeditable:null,
    aTrabajoeditable:null,
    empresa:null,
    tiempoexperienciaeditable:null,
    tamanioempresaeditable:null
  });

  ngOnInit(): void {
    console.log('PerfilProfesionalComponent');
    this.rowActual = this.agendaService.rowActual;
    this.initSubscribeObservables();
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  initSubscribeObservables() {
    let sub1$ = this.agendaService.agendaAlumnoService.datosAlumno$.subscribe({
      next: (resp: IAgendaDatosAlumno) => {
        if (resp != null) {
          this.nroDocumento = resp.alumno.dni;
          this.esPaisMexico(resp.alumno.idCodigoPais);
        }
      },
    });
    let sub2$ = this.agendaService.agendaAlumnoService.alumno$.subscribe({
      next: (resp: IAlumnoInformacion) => {
        if (resp != null) {
          resp.aFormacion = resp.aFormacion ? resp.aFormacion : 'Sin Área de Formación'
          resp.cargo = resp.cargo ? resp.cargo : 'Sin Cargo'
          resp.industria = resp.industria ? resp.industria : 'Sin Industria'
          resp.aTrabajo = resp.aTrabajo ? resp.aTrabajo : 'Sin Área de Trabajo'
          resp.empresa = resp.empresa ? resp.empresa : 'Sin Empresa'

          this.formDatosCarlos.get('cargoeditable').setValue({
            id: resp.idCargo == 11 ? null : resp.idCargo,
            nombre:
            resp.idCargo == 11 ? '-Sin Cargo-' : resp.cargo,
          });

          this.formDatosCarlos.get('aFormacioneditable').setValue({
            id: resp.idAFormacion,
            nombre: resp.aFormacion,
          });

          this.formDatosCarlos.get('industriaeditable').setValue({
            id: resp.idIndustria,
            nombre: resp.industria,
          });

          this.formDatosCarlos.get('aTrabajoeditable').setValue({
            id: resp.idATrabajo,
            nombre: resp.aTrabajo,
          });

          this.formDatosCarlos.get('empresa').setValue({
            id: resp.idEmpresa,
            nombre: resp.empresa,
          });

          this.formDatosCarlos.get('tiempoexperienciaeditable').setValue({
            id: resp.idTiempoExperiencia,
            nombre: resp.tiempoexperiencia,
          });

          this.formDatosCarlos.get('tamanioempresaeditable').setValue({
            id: resp.idTamanioEmpresa,
            nombre: resp.tamanioempresa,
          });
          
          this.alumno = resp;

          //Inicializa con el valor cargado en 
          this.responsabilidad=resp.principalResponsabilidadProfesional==null?"":resp.principalResponsabilidadProfesional;
        }
      },
    });
    let sub3$ = this.agendaService.agendaSentinelService.sentinelAlumno$.subscribe({
      next: (resp) => {
        if (resp != null) {
          if (resp.sentinelValidado == true) {
            this.sentinelAlumno = resp;
            this.nroDocumento = resp.dni;
          }
        }
      },
    });
    let sub4$ = this.agendaService.agendaSentinelService.sentinelHelp$.subscribe((resp) => {
      this.sentinelHelp = resp;
    });
    let sub5$ = this.agendaService.agendaSentinelService.showSentinelHelp$.subscribe(
      (resp) => {
        this.showSentinelHelp = resp;
      }
    );
    let sub6$ = this.agendaService.agendaSentinelService.btnVerDetalleSentinel$.subscribe(
      (resp) => {
        this.btnVerDetalleSentinel = Object.assign(
          this.btnVerDetalleSentinel,
          resp
        );
      }
    );
    let sub7$ = this.agendaService.agendaSentinelService.btnConsultar$.subscribe((resp) => {
      this.btnConsultar = Object.assign(this.btnConsultar, resp);
    });
    let sub8$ = this.agendaService.agendaSentinelService.resetSentinel$.subscribe({
      next: (resp) => {
        if(resp == true){
          this.sentinelAlumno = {};
          this.sentinelHelp = '';
          this.showSentinelHelp = false;
          this.btnConsultar = {
            disabled: false,
            show: false,
            text: 'Consultar',
            color: 'success',
          };
          this.btnVerDetalleSentinel = {
            disabled: false,
            show: false,
          };
        }
      },
    });
    let sub9$ = this.agendaService.agendaAlumnoService.colorPerfilPrograma$.subscribe((resp) => {
      let porDefecto = resp.find(x => x.tipoRegistro == 'PorDefecto')
      let item = resp.find(x => x.tipoRegistro == 'AreaFormacion')
      if(item != null){
        this.colorAreaFormacion = item.colorHex;
      }else{
        this.colorAreaFormacion = porDefecto.colorHex;
      }

      item = resp.find(x => x.tipoRegistro == 'AreaTrabajo')
      if(item != null){
        this.colorAreaTrabajo = item.colorHex;
      }else{
        this.colorAreaTrabajo = porDefecto.colorHex
      }

      item = resp.find(x => x.tipoRegistro == 'Cargo')
      if(item != null){
        this.colorCargo = item.colorHex;
      }else{
        this.colorCargo = porDefecto.colorHex
      }

      item = resp.find(x => x.tipoRegistro == 'Industria')
      if(item != null){
        this.colorIndustria = item.colorHex;
      }else{
        this.colorIndustria = porDefecto.colorHex
      }
    });
    let sub10$ =
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
    let sub11$ =
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
    let sub12$ =
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
    let sub13$ =
      this.agendaService.agendaAlumnoService.comboAreaTrabajo$.subscribe({
        next: (resp: any) => {
          if (resp != null && resp.length > 0) {
            let data = resp.sort((a: any, b: any) =>
              a.nombre.localeCompare(b.nombre)
            );
            this.filtroAreaTrabajo = data;
            this.sourceAreaTrabajo = data;
          }
        },
      });
    let sub14$ =
      this.agendaService.agendaAlumnoService.comboTiempoExpericencia$.subscribe({
        next: (resp: any) => {
          if (resp != null && resp.length > 0) {
            let data = resp.sort((a: any, b: any) =>
              a.id-b.id
            );
            this.filtroTiempoExperiencia = data;
            this.sourceTiempoExperiencia = data;
          }
        },
      });
    let sub15$ =
      this.agendaService.agendaAlumnoService.comboTamanioEmpresa$.subscribe({
        next: (resp: any) => {
          if (resp != null && resp.length > 0) {
            let data = resp.sort((a: any, b: any) =>
              a.id-b.id
            );
            this.filtroTamanioEmpresa = data;
            this.sourceTamanioEmpresa = data;
          }
        },
      });

    this.subscriptions.add(sub1$);
    this.subscriptions.add(sub2$);
    this.subscriptions.add(sub3$);
    this.subscriptions.add(sub4$);
    this.subscriptions.add(sub5$);
    this.subscriptions.add(sub6$);
    this.subscriptions.add(sub7$);
    this.subscriptions.add(sub8$);
    this.subscriptions.add(sub9$);
  }
  consultarNroDocumento() {
    const CampoDni = this.nroDocumento.trim();
    if (this.agendaService.agendaSentinelService.paisGlobal == 'PE') {
      this.btnConsultar.disabled = true;
      this.btnConsultar.html = 'Consultar';
      this.btnConsultar.class = 'btn-warning';
      this.btnConsultar.color = 'warning';
      if (CampoDni.length == 8) {
        this.agendaService.agendaSentinelService.resetSentinel();
        this.agendaService.agendaSentinelService
          .actualizarSentinelAlumno$(CampoDni, this.rowActual.idAlumno)
          .subscribe({
            next: (response: HttpResponse<ISentinelEstado>) => {
              if (response.body.rpta == true) {
                this.recargarDatosSentinel();
              } else {
                Swal.fire('No se encontró información');
              }
            },
            error: (error) => {
              let mensaje = this.alertaService.getErrorResponse(error).mensaje;
              this.alertaService.notificationWarning(mensaje);
              Swal.fire({
                icon: 'error',
                title: 'Error al consultar los datos de Sentinel',
                text: mensaje,
              });
              this.btnConsultar.disabled = false;
            },
          });
      } else {
        this.btnConsultar.disabled = false;
        this.alertaService.swalFireOptions({
          icon: 'warning',
          text: 'El numero de DNI a consultar debe tener 8 digitos',
        });
      }
    } else {
      this.btnConsultar.disabled = true;
      this.btnConsultar.html = 'Consultar';
      this.btnConsultar.color = 'warning';
      if (CampoDni.length >= 9) {
        this.agendaService.agendaSentinelService.resetSentinel();
        this.agendaService.agendaSentinelService
          .actualizarInformacionDataCredito$(CampoDni, this.rowActual.idAlumno)
          .subscribe({
            next: (resp: HttpResponse<any>) => {
              this.agendaService.agendaSentinelService.obtenerInformacionDataCredito();
            },
            error: (error) => {
              this.alertaService.notificationWarning(error.message);
            },
          });
      } else {
        this.btnConsultar.disabled = false;
        this.alertaService.swalFireOptions({
          icon: 'warning',
          text: 'El numero de Cedula a consultar debe tener 10 digitos',
        });
      }
    }
  }

  recargarDatosSentinel() {
    this.agendaService.agendaSentinelService
      .recargarDatosSentinel$(this.rowActual.idAlumno)
      .subscribe({
        next: (resp: HttpResponse<IDatosSentinelAlumno>) => {
          if(resp.body != null){
            resp.body.sentinelValidado = true
            this.agendaService.agendaSentinelService.sentinelAlumno$.next(
              resp.body
            );
          }else{
            let item: IDatosSentinelAlumno = {
              sentinelValidado : false
            }
            this.agendaService.agendaSentinelService.sentinelAlumno$.next(
            item
            );
          }  
        },
        complete: () => {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Se cargo correctamente los datos de Sentinel',
            showConfirmButton: false,
            timer: 1500,
          });
        },
      });
  }

  verDetalleSemaforoFin(content: any) {
    const idSentinel = this.sentinelAlumno.idSentinel;
    this.agendaService.agendaSentinelService
      .obtenerDetalleSentinel$(idSentinel)
      .subscribe({
        next: (response: HttpResponse<IDetalleSentinel>) => {
          const data = response.body;
          let dniRuc = data.dniRuc.map((e) => ({
            ...e,
            fechaProceso: new Date(e.fechaProceso),
            fechaInicioActividad: new Date(e.fechaInicioActividad),
            fechaCreacion: new Date(e.fechaCreacion),
            fechaModificacion: new Date(e.fechaProceso),
          }));
          let datosGenerales = data.datosGenerales.map((e) => ({
            ...e,
            fechaActividad: new Date(e.fechaActividad),
            fechaNacimiento: new Date(e.fechaNacimiento),
            fechaCreacion: new Date(e.fechaCreacion),
            fechaModificacion: new Date(e.fechaModificacion),
          }));
          let deuda = data.deuda.map((e) => ({
            ...e,
            fechaReporte: new Date(e.fechaReporte),
            fechaCreacion: new Date(e.fechaCreacion),
            fechaModificacion: new Date(e.fechaModificacion),
          }));
          let lineaCredito = data.lineaCredito;
          let datosVencidas = data.datosVencidas.map((e) => ({
            ...e,
            fechaCreacion: new Date(e.fechaCreacion),
            fechaModificacion: new Date(e.fechaModificacion),
          }));
          let posicionHistoria = data.posicionHistoria.map((e) => ({
            ...e,
            fechaProceso: new Date(e.fechaProceso),
            fechaCreacion: new Date(e.fechaCreacion),
            fechaModificacion: new Date(e.fechaModificacion),
          }));
          this.cargarDNIRUC(dniRuc);
          this.cargarDocumentoConsultadoSemaforos(dniRuc);
          this.cargarDocumentoDetalleDeudaSBS(deuda);
          this.cargarDocumentoDetalleVencidos(datosVencidas);
          this.cargarDocumentoLineasCredito(lineaCredito);
          this.cargarOtroDocumentoConsultadoSemaforos(dniRuc);
          this.cargarOtroDocumentoDetalleDeudaSBS(deuda);
          this.cargarOtroDocumentoDetalleVencidos(datosVencidas);
          this.cargarOtroDocumentoLineasCredito(lineaCredito);
          this.cargarDatosGenerales(datosGenerales);
          this.cargarDatosPrincipales1(datosGenerales);
          this.cargarDatosPrincipales2(datosGenerales);
          this.cargarDireccionesRegistradas(datosGenerales);
          this.cargarPosicionHistorica(posicionHistoria);
        },
      });
    this.modalService.open(content, { backdrop: 'static', size: 'xl' });
  }
  _colorSemaforoAV(semaforo: any) {
    var color;
    switch (semaforo) {
      case 'R':
        color = 'red';
        break;
      case 'G':
        color = 'gray';
        break;
      case 'A':
        color = 'yellow';
        break;
      case 'V':
        color = 'green';
        break;
      default:
        color = 'transparent';
    }
    return color;
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
  filterAreaFormacion(value: string) {
    if (value.length >= 1) {
      this.filtroAreaFormacion = this.sourceAreaFormacion.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.filtroAreaFormacion = this.sourceAreaFormacion;
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

  //actualizaciones de campos de alumno en tiempo real
  cambioAFormacion(value:any){
    if (this.alumno.id != 0 && this.alumno.id != null) {
      
      let datos: INuevosDatosPerfilAlumno ={
        idAlumno:this.alumno.id,
        idNuevo:value.id
      }

      this.agendaService.agendaAlumnoService
        .actualizarAFormacion$(datos)
        .subscribe({
          next: (response: HttpResponse<ISentinelEstado>) => {
            if (response.body.rpta == true) {
              this._alertaService.notificationSuccess("Se actualizo Area Formacion Correctamente");
            } else {
              this._alertaService.notificationError("No se pudo actualizar");
            }
          },
          error: (error) => {
            this._alertaService.notificationError("No se pudo actualizar");
          },
        });
    }
  }
  cambioCargo(value:any){
    if (this.alumno.id != 0 && this.alumno.id != null) {
      
      let datos: INuevosDatosPerfilAlumno ={
        idAlumno:this.alumno.id,
        idNuevo:value.id
      }

      this.agendaService.agendaAlumnoService
        .actualizarCargo$(datos)
        .subscribe({
          next: (response: HttpResponse<ISentinelEstado>) => {
            if (response.body.rpta == true) {
              this._alertaService.notificationSuccess("Se actualizo Cargo Correctamente");
            } else {
              this._alertaService.notificationError("No se pudo actualizar");
            }
          },
          error: (error) => {
            this._alertaService.notificationError("No se pudo actualizar");
          },
        });
    }
  }
  actualizarResponsabilidad(value:any)
  {
    this.responsabilidad = value;
  }
  cambioResponsabilidad(value:any)
  {
    if (this.alumno.id != 0 && this.alumno.id != null) {
      let datos: INuevosDatosPerfilAlumnoResponsabilidad ={
        idAlumno:this.alumno.id,
        descripcion:this.responsabilidad
      }

      this.agendaService.agendaAlumnoService
        .actualizarPrincipalResponsabilidad$(datos)
        .subscribe({
          next: (response: HttpResponse<ISentinelEstado>) => {
            if (response.body.rpta == true) {
              this._alertaService.notificationSuccess("Se actualizo la Principal Responsabilidad");
            } else {
              this._alertaService.notificationError("No se pudo actualizar");
            }
          },
          error: (error) => {
            this._alertaService.notificationError("No se pudo actualizar");
          },
        });
    }
  }
  cambioTiempoexperiencia(value:any){
    if (this.alumno.id != 0 && this.alumno.id != null) {
      
      let datos: INuevosDatosPerfilAlumno ={
        idAlumno:this.alumno.id,
        idNuevo:value.id
      }

      this.agendaService.agendaAlumnoService
        .actualizarTiempoExperiencia$(datos)
        .subscribe({
          next: (response: HttpResponse<ISentinelEstado>) => {
            if (response.body.rpta == true) {
              this._alertaService.notificationSuccess("Se actualizo el Tiempo de Experiencia Correctamente");
            } else {
              this._alertaService.notificationError("No se pudo actualizar");
            }
          },
          error: (error) => {
            this._alertaService.notificationError("No se pudo actualizar");
          },
        });
    }
  }
  cambioIndustria(value:any){
    if (this.alumno.id != 0 && this.alumno.id != null) {
      
      let datos: INuevosDatosPerfilAlumno ={
        idAlumno:this.alumno.id,
        idNuevo:value.id
      }

      this.agendaService.agendaAlumnoService
        .actualizarIndustria$(datos)
        .subscribe({
          next: (response: HttpResponse<ISentinelEstado>) => {
            if (response.body.rpta == true) {
              this._alertaService.notificationSuccess("Se actualizo la Industria Correctamente");
            } else {
              this._alertaService.notificationError("No se pudo actualizar");
            }
          },
          error: (error) => {
            this._alertaService.notificationError("No se pudo actualizar");
          },
        });
    }
  }
  cambioATrabajo(value:any){
    if (this.alumno.id != 0 && this.alumno.id != null) {
      
      let datos: INuevosDatosPerfilAlumno ={
        idAlumno:this.alumno.id,
        idNuevo:value.id
      }

      this.agendaService.agendaAlumnoService
        .actualizarATrabajo$(datos)
        .subscribe({
          next: (response: HttpResponse<ISentinelEstado>) => {
            if (response.body.rpta == true) {
              this._alertaService.notificationSuccess("Se actualizo Area Trabajo Correctamente");
            } else {
              this._alertaService.notificationError("No se pudo actualizar");
            }
          },
          error: (error) => {
            this._alertaService.notificationError("No se pudo actualizar");
          },
        });
    }

  }
  cambioEmpresa(value:any){
    if (this.alumno.id != 0 && this.alumno.id != null) {
      
      let datos: INuevosDatosPerfilAlumno ={
        idAlumno:this.alumno.id,
        idNuevo:value.id
      }

      this.agendaService.agendaAlumnoService
        .actualizarEmpresa$(datos)
        .subscribe({
          next: (response: HttpResponse<ISentinelEstado>) => {
            if (response.body.rpta == true) {
              this._alertaService.notificationSuccess("Se actualizo la Empresa Correctamente");
            } else {
              this._alertaService.notificationError("No se pudo actualizar");
            }
          },
          error: (error) => {
            this._alertaService.notificationError("No se pudo actualizar");
          },
        });
    }
  }
  cambioTamanioempresa(value:any){
    if (this.alumno.id != 0 && this.alumno.id != null) {
      
      let datos: INuevosDatosPerfilAlumno ={
        idAlumno:this.alumno.id,
        idNuevo:value.id
      }

      this.agendaService.agendaAlumnoService
        .actualizarTamanioEmpresa$(datos)
        .subscribe({
          next: (response: HttpResponse<ISentinelEstado>) => {
            if (response.body.rpta == true) {
              this._alertaService.notificationSuccess("Se actualizo el Tamaño de Empresa Correctamente");
            } else {
              this._alertaService.notificationError("No se pudo actualizar");
            }
          },
          error: (error) => {
            this._alertaService.notificationError("No se pudo actualizar");
          },
        });
    }
  }
  esPaisMexico(idPais: number) {
    if (idPais == 52) {
      this.showDatosMexico = true;
    } else {
      this.showDatosMexico = false;
    }
  }
  abrirModuloEmpresa(context: any) {
    this.modalService.open(context, { size: 'xl', backdrop: 'static' });
  }

  cargarDNIRUC(dniRuc: IDniRuc[]) {
    this.gridDNIRUC.data = dniRuc;
  }
  semaforos: any[] = [];
  cargarDocumentoConsultadoSemaforos(dniRuc: IDniRuc[]) {
    let documentoConsultadoSemaforos = dniRuc.filter((item) => {
      return item.tipoDocumento == 'D' ? true : false;
    });
    let semaforos =
      documentoConsultadoSemaforos.length > 0
        ? documentoConsultadoSemaforos[0].semaforos
        : '';
    this.semaforos = semaforos.split('');
  }
 
  cargarDocumentoDetalleDeudaSBS(deuda: IDeuda[]) {
    let record = deuda.filter((item) => item.tipoDoc == 'D');
    this.gridDocumentoConsultadoDetalleDeuda.data = record;
  }
  cargarDocumentoDetalleVencidos(deuda: IDatosVencidas[]) {
    let record = deuda.filter((item) => item.tipoDocumento == 'D');
    this.gridDocumentoDetalleVencidos.data = record;
  }
  cargarDocumentoLineasCredito(lineaCredito: ILineaCredito[]) {
    let record = lineaCredito.filter((item) => item.tipoDocumento == 'D');
    this.gridDocumentoLineasCredito.data = record;
  }
  semaforos2: any[] = [];
  cargarOtroDocumentoConsultadoSemaforos(records: IDniRuc[]) {
    let documentoConsultadoSemaforos = records.filter(
      (item) => item.tipoDocumento == 'R'
    );
    let semaforos =
      documentoConsultadoSemaforos.length > 0
        ? documentoConsultadoSemaforos[0].semaforos
        : '';
    this.semaforos2 = semaforos.split('');
  }
  cargarOtroDocumentoDetalleDeudaSBS(deuda: IDeuda[]) {
    let record = deuda.filter((item) => item.tipoDoc == 'R');
    this.gridOtroDocumentoConsultadoDetalleDeuda.data = record;
  }
  cargarOtroDocumentoDetalleVencidos(datosVencidas: IDatosVencidas[]) {
    let record = datosVencidas.filter((item) => item.tipoDocumento == 'R');
    this.gridOtroDocumentoDetalleVencidos.data = record;
  }
  cargarOtroDocumentoLineasCredito(lineaCredito: ILineaCredito[]) {
    let record = lineaCredito.filter((item) => item.tipoDocumento == 'R');
    this.gridOtroDocumentoLineasCredito.data = record;
  }
  cargarDatosGenerales(datosGenerales: IDatosGenerales[]) {
    this.gridDatosGenerales.data = datosGenerales;
  }
  cargarDatosPrincipales1(datosGenerales: IDatosGenerales[]) {
    this.gridDatosPrincipales1.data = datosGenerales;
  }
  cargarDatosPrincipales2(datosGenerales: IDatosGenerales[]) {
    this.gridDatosPrincipales2.data = datosGenerales;
  }
  cargarDireccionesRegistradas(datosGenerales: IDatosGenerales[]) {
    this.gridDireccionesRegistradas.data = datosGenerales;
  }
  cargarPosicionHistorica(posicionHistoria: IPosicionHistoria[]) {
    this.gridPosicionHistorica.data = posicionHistoria;
  }
}

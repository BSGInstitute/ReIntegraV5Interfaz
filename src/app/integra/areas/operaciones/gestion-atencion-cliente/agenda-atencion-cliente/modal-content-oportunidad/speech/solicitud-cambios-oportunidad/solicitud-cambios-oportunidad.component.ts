import { AgendaActividadesOperacionesService } from '@operaciones/services/agenda/agenda-actividades-operaciones.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { SelectEvent } from "@progress/kendo-angular-layout";
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SignalRService } from '@shared/services/signal-r.service';
import { ISolicitudOperacionesPendientes,ISolicitudOperacionesRealizadas } from '@operaciones/models/interfaces/isolicitudes-operaciones';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { LocalizationPaginatorIntl } from '@shared/models/localization-mat-paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-solicitud-cambios-oportunidad',
  templateUrl: './solicitud-cambios-oportunidad.component.html',
  styleUrls: ['./solicitud-cambios-oportunidad.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: "es"},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: MatPaginatorIntl, useClass: LocalizationPaginatorIntl}
  ],
})
export class SolicitudCambiosOportunidadComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  rowActual: any;
  gridHistorialSolicitudOperaciones: KendoGrid = new KendoGrid();

  gridSolicitudesRealizadas: MatTableDataSource<any>;
  gridSolicitudesPendientes: KendoGrid = new KendoGrid();
  gridHistorialAsesora: MatTableDataSource<any>;
  gridEstadoMatriculado: KendoGrid = new KendoGrid();
  esCordinadora: any;
  columnsToDisplay=['tipo-solicitud','asesora-anterior','asesora-nueva','usuario-aprobacion','estado','fecha-inicio','fecha-fin'];
  columnsToDisplay2=['tipo-solicitud','valor-anterior','valor-nuevo','solicitante','aprobado','estado','fecha-aprobacion','observacion'];
  cantidadPendiente = 0;
  idTipoCambioOperacionesGeneral: any;
  grid_confirmacion: KendoGrid = new KendoGrid();
  modalRefmodalDetalleAprobacion: any;
  modalRefmodalConfirmacionAccesoTemporal: any;
  LoaderModalDetalleAprobacion: boolean;
  dataSubEstado: any;
  datainputRechazarSubEstado: any;
  ultimoEstado:any
  inputHiddenIdSolicitud:any
  SeccionRechazarConSubEstado: boolean = true;
  SeccionRechazarSinSubEstado: boolean = true;
  seccionRechazarSubEstado: boolean = true;
  seccionRechazarEstado: boolean = true;
  inputIdSolictudOperaciones:any
  // dataSoliciitudesRealizadas:any
  @ViewChild('modalConfirmacionAccesoTemporal')
  modalConfirmacionAccesoTemporal: any;
  @ViewChild('modalAprobacionAccesoTemporal')
  modalAprobacionAccesoTemporal: any;
  @ViewChild('historialAsesoraPaginator') historialAsesoraPaginator: MatPaginator;
  @ViewChild('solicitudesRealizadas') solicitudesRealizadasPaginator: MatPaginator;
  @ViewChild('modalDetalleAprobacion') modalDetalleAprobacion: any;
  @ViewChild('modalRechazarSolicitudCambio') modalRechazarSolicitudCambio: any;
  @ViewChild('modalmodalRechazarSolicitudCambio') modalmodalRechazarSolicitudCambio:any;
  modalRefmodalRechazarSolicitudCambio: any;
  modalRefmodalmodalRechazarSolicitudCambio:any

  dataSourceSolicitudesPendientesTable : ISolicitudOperacionesPendientes [] =  []
  dataSourceSolicitudesRealizadasTable : ISolicitudOperacionesRealizadas [] =  []

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    public signalRService: SignalRService,
  ) {}

  formModalRechazarSolicitudCambio: FormGroup = this.formBuilder.group({
    // inputRechazarSubEstado: [[]],
    // inputRechazarSubEstadoSin: '',
    observacion: ''
  });
  hub:any ;

  ngOnInit(): void {
    
  }
  ngAfterViewInit() {
    this.hub = this.signalRService.connection('hubIntegraHub',this.agendaService.idPersonal,this.agendaService.userName)
    this.rowActual = this.agendaService.rowActual;
    this.agendaService.esCoordinadora$.subscribe({
      next: (response: any) => {
        this.esCordinadora = response;
      },
    });
    this.agendaService.agendaAlumnoOperacionesService.subEstadoMatricula$.subscribe(
      {
        next: (Response: any) => {
          this.dataSubEstado = Response;
        },
      }
    );
    this.agendaService.agendaAlumnoOperacionesService.subEstadoMatricula$.subscribe({
      next:(Response:any)=>{
        this.dataSubEstado= Response;
      }
    })

    this.gridHistorialSolicitudOperaciones = this.agendaService.agendaInicializarOperacionesService.gridSolicitudOperaciones
    this.agendaService.agendaInicializarOperacionesService.gridSolicitudOperacioneRealizada.data$.subscribe({
        next: (res)=>{
          this.gridSolicitudesRealizadas = new MatTableDataSource(res);
          this.gridSolicitudesRealizadas.paginator = this.solicitudesRealizadasPaginator;
        }
      }
    );
    this.agendaService.agendaInicializarOperacionesService.gridHistorialAsesora.data$.subscribe({
      next: (res)=>{
        this.gridHistorialAsesora = new MatTableDataSource(res);
        this.gridHistorialAsesora.paginator = this.historialAsesoraPaginator;
      }
    }
    );


    this.cargarHistorialSolicitudOperacionesV2();

    this.agendaService.agendaActividadesOperacionesService
      .cargarEstadoMatriculado$()
      .subscribe({
        next: (resp: any) => {
          if (resp != null) {
            if (resp) {
              console.log('pruuuuu');
              this.gridEstadoMatriculado.data = resp.body;
            }
          }
        },
      });
  }

  cargarHistorialSolicitudOperacionesV2() {
    this.agendaService.agendaInicializarOperacionesService
    .obtenerSolicitudOperaciones$(this.rowActual.idOportunidad)
    .subscribe({
      next: (response: any) => {
        console.log('solicitudes');
        console.log(response.body);
        this.dataSourceSolicitudesPendientesTable = response.body;
        console.log("dataSourceSolicitudesPendientesTable",this.dataSourceSolicitudesPendientesTable)
      },
      error: (error) => {
        console.log(error);
      },
    })
  }
  cargarHistorialSolicitudOperaciones() {
    this.gridHistorialSolicitudOperaciones.data = null;
    this.gridHistorialSolicitudOperaciones.loading=true;
    this.agendaService.agendaInicializarOperacionesService
      .obtenerSolicitudOperaciones$(this.rowActual.idOportunidad)
      .subscribe({
        next: (response: any) => {
          console.log('solicitudes');
          console.log(response.body);
          this.dataSourceSolicitudesPendientesTable = response.body;
          console.log("dataSourceSolicitudesPendientesTable",this.dataSourceSolicitudesPendientesTable)
          this.gridHistorialSolicitudOperaciones.data = response.body;
          this.gridHistorialSolicitudOperaciones.loading=false;
        },
        error: (error) => {
          this.gridHistorialSolicitudOperaciones.loading=false;
          console.log(error);
        },
      });

  }

  cargarGridSolicitudRealizada() {
    this.gridSolicitudesRealizadas.data = null;
    this.agendaService.agendaInicializarOperacionesService
      .obtenerSolicitudOperacionesRealizadas$(this.rowActual.idOportunidad)
      .subscribe({
        next: (response: any) => {
          console.log('solicitudes realizadas');
          console.log(response.body);
          this.gridSolicitudesRealizadas.data = response.body;
        },
      });
  }
  cargarGridHistorialAsesoras() {
    this.gridHistorialAsesora.data = null;
    this.gridHistorialAsesora.data=null; 
    this.agendaService.agendaInicializarOperacionesService
      .obtenerHistorialAsesoras$(this.rowActual.idMatriculaCabecera)
      .subscribe({
        next: (response: any) => {
          console.log('solicitudes realizadas');
          console.log(response.body);
          this.gridHistorialAsesora.data=response.body;
        },
      });
  }

  calcularEstado(dataItem: any) {
    if (dataItem.esCancelado === true) {
      return 'Cancelado';
    } else if (dataItem.realizado === true) {
      return 'Realizado';
    } else {
      if (dataItem.aprobado === true) {
        return 'Aprobado';
      } else {
        this.cantidadPendiente = this.cantidadPendiente + 1;
        return 'Pendiente';
      }
    }
  }

  public onTabSelect(e: SelectEvent): void {
    console.log(e);
  }


  notificacionSeEnvioSolicitud() {
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Se Envio la Solicitud',
    });
  }
  notificacionSeRechazoSolicitud() {
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Se Rechazo la Solicitud',
    });
  }

  notificacionSeAproboAmpliacion() {
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Se aprobó la Ampliacion',
    });
  }

  /**
   * Aprueba el cambio de centro de costo
   * @param objRow {object}
   * @return {void}
   */
  aprobarCambioCentroCosto(objRow: any) {
    this.agendaService.agendaActividadesOperacionesService
      .aprobarCambioCentroCosto$(
        objRow.id,
        this.agendaService.userName,
        this.agendaService.idPersonal
      )
      .subscribe({
        next: (resp: any) => {
          if (resp != null) {


            this.hub.invoke('SolicitarCambio');
            this.notificacionSeAproboSolicitud();
            //NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
            this.cantidadPendiente = this.cantidadPendiente - 1;
            if (
              this.cantidadPendiente === 0 &&
              this.rowActual.idPersonal_Asignado !==
                this.agendaService.idPersonal
            ) {
              this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(
                this.rowActual.id
              );
              this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
              this.cancelarSolicitudOperaciones();
            } else {
              //this.cargarHistorialSolicitudOperaciones();
              this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
              this.cargarGridSolicitudRealizada();
            }
          }
        },
      });

    // $.ajax({
    //     url: 'http://localhost:63048/api/SolicitudOperaciones/AprobarSolicitudOperaciones/' + objRow.Id + "/" + this.agendaService.userName + "/" + this.agendaService.idPersonal,
    //     type: 'GET',
    //     success: function (data) {
    //         AgendaSocketModule.SolicitarCambio();
    //         NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
    //         CantidadPendiente = CantidadPendiente - 1;
    //         if (CantidadPendiente === 0 && rowActual.IdPersonal_Asignado !== IdPersonal) {
    //             VentaCruzadaModule.ActividadEjecutadaOperaciones(rowActual.Id);
    //             ControlPantallasModule.closeModalPantalla2();
    //             CancelarSolicitudOperaciones();
    //         }
    //         else {
    //             CargarHistorialSolicitudOperaciones();
    //             CargarGridSolicitudRealizada();
    //         }
    //     },
    //     error: function (error) {
    //         NotificacionModule.showMensajeError(error, NotificacionId);
    //     }
    // });
  }

  updateSolicitudCambio() {
    this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudes();
  }

  updateAccesosTemporales() {
    this.agendaService.agendaInicializarOperacionesService.obtenerSolicitudes();
  }
  habilitarAprobarSolicitud(dataItem: any) {
    if (!dataItem.aprobado && !dataItem.esCancelado) {
      return false;
    }
    return true;
  }

  habilitarRechazarSolicitud(dataItem: any) {
    if (!dataItem.aprobado && !dataItem.esCancelado) {
      return false;
    }
    return true;
  }

  RechazarSolicitudOperaciones() {
      this.LoaderModalDetalleAprobacion=true
      console.log('ROW ACTUAL', this.rowActual)
      console.log('AGENDA SERVICE', this.agendaService.idPersonal)
      console.log('RechazarSolicitudOperaciones')
      var objeto:any = {};

      objeto.IdTipoSolicitudOperaciones = this.idTipoCambioOperacionesGeneral;
      objeto.IdOportunidad = this.rowActual.idOportunidad;
      objeto.IdPersonalSolicitante = this.rowActual.idPersonal_Asignado;
      if (!this.esCordinadora) {
          objeto.Aprobado = false;
          objeto.IdPersonalAprobacion = this.agendaService.idPersonal
      }
      else {
          objeto.Aprobado = true;
          objeto.IdPersonalAprobacion = this.rowActual.idPersonal_Asignado;
      }
      console.log('SOlicitud', objeto)
      var IdSolicitud = this.inputIdSolictudOperaciones;

      let observacion = (this.formModalRechazarSolicitudCambio.get("observacion").value)

      if (observacion === undefined || observacion === "" || observacion ==null)
      {
        this.LoaderModalDetalleAprobacion=false
        return alert("Registre un comentario por favor")
      }
      this.agendaService.agendaActividadesOperacionesService.rechazarSolicitudOperaciones$(IdSolicitud,this.agendaService.userName,observacion)
      .subscribe({
        next:(resp:any) =>{
          this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
          this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudesRealizadas();
          this.LoaderModalDetalleAprobacion=false
          this.modalRefmodalmodalRechazarSolicitudCambio.close()

          this.notificacionSeRechazoSolicitud()
          this.cantidadPendiente = this.cantidadPendiente - 1;
          if (this.cantidadPendiente === 0) {
              if (this.idTipoCambioOperacionesGeneral === 4) {
                this.cargarHistorialSolicitudOperaciones();
              }
              else if (this.idTipoCambioOperacionesGeneral === 5) {
                this.cargarHistorialSolicitudOperaciones();
              }
              else {
                  this.CancelarRechazarSolicitudOperaciones();
              }
              this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(
                this.rowActual.Id
              );
              this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
          }
          else {

              if (this.idTipoCambioOperacionesGeneral === 4) {
                this.cargarHistorialSolicitudOperaciones();
              }
              else if (this.idTipoCambioOperacionesGeneral === 5) {
                this.cargarHistorialSolicitudOperaciones();
              }
              else {
                  this.cargarHistorialSolicitudOperaciones();
                  this.CancelarRechazarSolicitudOperaciones();
              }
          }
        },
        error: (error) => {
          this.LoaderModalDetalleAprobacion=false
          console.log(error);
        },
      })
  }

  /**
  * Rechazar el realizar el cambio solicitado por la coordinadora
  * @param objeto{object}
  * @return {void}
  */
  RechazarRealizarCambio(objeto:any) {
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.insertarSolicitudOperaciones$(objeto).subscribe({
      next:(response:any)=>{
        this.notificacionSeAproboSolicitud();
        this.AprobarSolicitudCoordinador(response.body);
      },
      error:(error:any)=>{
        Swal.fire({
          icon: 'error',
          title: error.error,
        })
        this.cargarHistorialSolicitudOperaciones();
        this.cargarGridSolicitudRealizada();
        this.CancelarRechazarSolicitudOperaciones();
      }
    });
  }

  /**
  * Cancela el modal de rechazo de solicitud de operaciones
  * @return {void}
  */
  CancelarRechazarSolicitudOperaciones() {
    this.modalRefmodalRechazarSolicitudCambio.close()
  }
  /**
  * Aprueba la solicitud del coordinado, segun el alumno seleccionado
  * @param objRow {object}
  * @return {void}
  */
  AprobarSolicitudCoordinador(objRow:any) {
    if (objRow.IdTipoSolicitudOperaciones === 1) {
        this.aprobarCambioCentroCosto(objRow);
    }
    else if (objRow.IdTipoSolicitudOperaciones === 2) {
        this.aprobarExoneracionMora(objRow);
    }
    else if (objRow.IdTipoSolicitudOperaciones === 3) {
        this.aprobarCambioVersion(objRow);
    }
    else if (objRow.IdTipoSolicitudOperaciones === 4) {
        this.AprobarCambioEstado(objRow);
    }
    else if (objRow.IdTipoSolicitudOperaciones === 5) {
        this.AprobarCambioSubEstado(objRow);
    }
    else if (objRow.IdTipoSolicitudOperaciones === 6) {
        this.aprobarCambioEvaluacion(objRow);
    }
    else if (objRow.IdTipoSolicitudOperaciones === 7) {
        this.aprobarCambioFechaFinalizacion(objRow);
    }
    else if (objRow.IdTipoSolicitudOperaciones === 8) {
        this.AprobarSolicitudAccesoTemporal(objRow);
    }
    else if (objRow.IdTipoSolicitudOperaciones === 9) {
        this.aprobarSolicitudCambioCategoria(objRow);
    }
  }
  CerrarModalConfirmacion() {
    this.modalRefmodalDetalleAprobacion.close()
    var grid_conf = $("#grid_confirmacion").data("kendoGrid");
    grid_conf.destroy();
  }
  /**
   * Aprueba soicitud de acceso temporal
  */
  AprobarSolicitudAccesoTemporal(objRow:any) {
    this.agendaService.agendaActividadesOperacionesService
    .aprobarCambioCentroCosto$(
      objRow.id,
      this.agendaService.userName,
      this.agendaService.idPersonal
    )
    .subscribe({
      next: (resp: any) => {
        if (resp != null) {
          this.notificacionSeAproboSolicitud();
          this.updateAccesosTemporales();
          this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
        }
      },
      error: (error) => {
        this.updateAccesosTemporales();
        this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
      },
    });
  }

  /**
  * Aprueba solicitudes en bloque
  * @return {void}
  */
  AprobarSolicitudesEnBloque() {
    let grid_data = this.grid_confirmacion.data
    let grid_length = grid_data.length;
    let i = 0;
    for (i; i < grid_length; i++) {
        let datoActual = grid_data[i];
        if (datoActual.idTipoSolicitudOperaciones == 4) {
            this.AprobarCambioEstado(grid_data[i])
        }
        else if (datoActual.idTipoSolicitudOperaciones == 5) {
            this.AprobarCambioSubEstado(grid_data[i])
        }
    }
    this.modalRefmodalDetalleAprobacion.close()
  }

  /**
  * Aprueba el cambio de subestado, segun el alumno seleccionado
  * @param objRow {object}
  * @return {void}
  */
  AprobarCambioSubEstado(objRow:any) {
    let _destinatario = 'fvaldez@bsginstitute.com';
    let _asunto = 'SOLICITUD DE CAMBIO SUB ESTADO - ' + this.rowActual.codigoMatricula;
    let _destinatarioCC = '';
    this.agendaService.agendaActividadesOperacionesService
    .aprobarCambioCentroCosto$(
      objRow.id,
      this.agendaService.userName,
      this.agendaService.idPersonal
    )
    .subscribe({
      next: (resp: any) => {
        if (resp != null) {
          this.notificacionSeAproboSolicitud();
          //NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
          this.cantidadPendiente = this.cantidadPendiente - 1;
          if (this.cantidadPendiente === 0) {
            this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(
              this.rowActual.Id
            );
              this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
              this.cancelarSolicitudOperaciones();
          }
          else {
              this.cargarHistorialSolicitudOperaciones();
              this.cargarGridSolicitudRealizada();
          }
          this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
                this.cargarGridSolicitudRealizada();
        }
      },
    });
  }

  ConfirmarSolicitudAccesoTemporal() {
      let dataComponent:any
    this.agendaService.agendaActividadesOperacionesService.gridAccesoTemporal$.subscribe({
      next:(response:any) =>{
        dataComponent = response
      }
    })

    var idSolicitud = this.inputHiddenIdSolicitud
    if (this.inputHiddenIdSolicitud == '') {
      dataComponent.forEach((i:any) => {
        if (dataComponent[i].idTipoSolicitudOperaciones == 8 && dataComponent[i].realizado != 1 && dataComponent[i].aprobado!=1) {
          idSolicitud = dataComponent[i].id;
          return;
      }
      });
        // for (i in dataComponent) {
        //     if (dataComponent[i].IdTipoSolicitudOperaciones == 8 & dataComponent[i].Realizado != 1 & dataComponent[i].Aprobado!=1) {
        //         idSolicitud = dataComponent[i].Id;
        //         continue;
        //     }
        // }
    }

    //displayLoading($('#modalConfirmacionAccesoTemporal'));

    this.agendaService.agendaActividadesOperacionesService
    .aprobarCambioCentroCosto$(idSolicitud.id,this.agendaService.userName,this.agendaService.idPersonal)
    .subscribe({
      next: (resp: any) => {
        if (resp != null) {
          this.notificacionSeAproboSolicitud();
          this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes()
          this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudesRealizadas()
          //NotificacionModule.showMensajeExitoso("Se aprobó la Solicitud");
          this.modalRefmodalConfirmacionAccesoTemporal.close()
          //$('#modalConfirmacionAccesoTemporal').modal('hide');

          //updateAccesosTemporales();
          //this.updateSolicitudCambio();

          //hideLoading($('#modalConfirmacionAccesoTemporal'));
          this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
        }
      },
      error: (error) => {
        //this.updateSolicitudCambio();
        //hideLoading($('#modalConfirmacionAccesoTemporal'));
        this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();

      }


    })


    // $.ajax({
    //     url: 'http://localhost:63048/api/SolicitudOperaciones/AprobarSolicitudOperaciones/' + idSolicitud + '/' + this.agendaService.userName + "/" + this.agendaService.idPersonal,
    //     type: 'GET',
    //     dataType: 'json',
    //     success: function (data) {
    //       this.notificacionSeAproboSolicitud();
    //         //NotificacionModule.showMensajeExitoso("Se aprobó la Solicitud");
    //         this.modalRefmodalConfirmacionAccesoTemporal.close()
    //         //$('#modalConfirmacionAccesoTemporal').modal('hide');

    //         //updateAccesosTemporales();
    //         this.updateSolicitudCambio();

    //         //hideLoading($('#modalConfirmacionAccesoTemporal'));
    //         this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
    //     },

    //     error: function (error, textStatus, errorThrown) {
    //        // NotificacionModule.showMensajeError(error, NotificacionId);

    //         /*updateAccesosTemporales();*/
    //         this.updateSolicitudCambio();
    //         //hideLoading($('#modalConfirmacionAccesoTemporal'));
    //         this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
    //     }
    // });
  }

  /**
  * Aprobar el cambio de estado, segun el alumno seleccionado
  * @param objRow {object}
  * @return {void}
  */
  AprobarCambioEstado(objRow:any) {
    var fdata = new FormData();

    let _destinatario = 'fvaldez@bsginstitute.com';
    let _asunto = 'SOLICITUD DE CAMBIO ESTADO - ' + this.rowActual.codigoMatricula;
    let _destinatarioCC = '';
    this.agendaService.agendaActividadesOperacionesService
    .aprobarCambioCentroCosto$(
      objRow.id,
      this.agendaService.userName,
      this.agendaService.idPersonal
    )
    .subscribe({
      next: (resp: any) => {
        if (resp != null) {
          this.notificacionSeAproboSolicitud();
          //NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
          this.cantidadPendiente = this.cantidadPendiente - 1;
          if (this.cantidadPendiente === 0) {
            this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(
              this.rowActual.Id
            );
              this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
              this.cancelarSolicitudOperaciones();
          }
          else {
              this.cargarHistorialSolicitudOperaciones();
              this.cargarGridSolicitudRealizada();
          }
          this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
          this.cargarHistorialSolicitudOperaciones(),
          this.cargarGridSolicitudRealizada();
        }
      },
    });


    // $.ajax({
    //     url: 'http://localhost:63048/api/SolicitudOperaciones/AprobarSolicitudOperaciones/' + objRow.Id + "/" + this.agendaService.userName + "/" + this.agendaService.idPersonal,
    //     type: 'GET',
    //     success: function (data) {
    //       this.notificacionSeAproboSolicitud();
    //         NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
    //         this.CantidadPendiente = this.CantidadPendiente - 1;
    //         if (this.CantidadPendiente === 0) {
    //           this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(
    //             this.rowActual.Id
    //           );
    //             this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
    //             this.CancelarSolicitudOperaciones();
    //         }
    //         else {
    //             this.CargarHistorialSolicitudOperaciones();
    //             this.CargarGridSolicitudRealizada();
    //         }
    //     },
    //     error: function (error) {
    //         NotificacionModule.showMensajeError(error, NotificacionId);
    //     }
    // });
  }


  notificacionSeAproboSolicitud(){
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    Toast.fire({
      icon: 'success',
      title: 'Se Aprobo la Solicitud'
    })
  }

  /**
  * Aprobar la solicitud, segun el alumno seleccionado
  * @param e {object}
  * @return {void}
  */
  aprobarSolicitud(objRow:any) {


    console.log ('temporales')
    this.inputHiddenIdSolicitud= objRow
    if (objRow.idTipoSolicitudOperaciones === 1) {
        this.aprobarCambioCentroCosto(objRow);
    }
    else if (objRow.idTipoSolicitudOperaciones === 2) {
        this.aprobarExoneracionMora(objRow);
    }
    else if (objRow.idTipoSolicitudOperaciones === 3) {
        this.aprobarCambioVersion(objRow);
    }
    else if (objRow.idTipoSolicitudOperaciones === 4) {
        this.mostrarConfirmacionSolicitud(objRow.id)
        //AprobarCambioEstado(objRow);
    }
    else if (objRow.idTipoSolicitudOperaciones === 5) {
        this.mostrarConfirmacionSolicitud(objRow.id)
        //AprobarCambioSubEstado(objRow);
    }
    else if (objRow.idTipoSolicitudOperaciones === 6) {
        this.aprobarCambioEvaluacion(objRow);
    }
    else if (objRow.idTipoSolicitudOperaciones === 7) {
        this.aprobarCambioFechaFinalizacion(objRow);
    }
    else if (objRow.idTipoSolicitudOperaciones === 9) {
        this.aprobarSolicitudCambioCategoria(objRow);
    }
    else if (objRow.idTipoSolicitudOperaciones === 8) {
      //falta
      //$('#modalConfirmacionAccesoTemporal').modal('show')
      this.modalRefmodalConfirmacionAccesoTemporal = this.modalService.open(this.modalConfirmacionAccesoTemporal, {
        size: 'lg',
        animation: true,
      });
    }
    else if (objRow.idTipoSolicitudOperaciones === 10) {
        this.aprobarAmpliacionAccesosTemporales(objRow.id);
    }

  }

  /**
  * Aprobar la exoneracion de mora, segun el alumno seleccionado
  * @param objRow {object}
  * @return {void}
  */
  aprobarExoneracionMora(objRow:any) {

    let cronograma = objRow.ComentarioSolicitante.split(",");
    let url = "https://repositorioweb.blob.core.windows.net/operaciones/comprobantes/" + objRow.nombreArchivo;
    let _destinatario = 'fvaldez@bsginstitute.com';
    let _asunto = 'SOLICITUD DE EXONERACION DE MORA - ' + this.rowActual.codigoMatricula;
    let _destinatarioCC = 'fvaldez@bsginstitute.com';



    this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow.id,this.agendaService.userName,this.agendaService.idPersonal)
    .subscribe({
      next:(resp:any) =>{
        if(resp != null){

          this.hub.invoke('SolicitarCambio');
          this.notificacionSeAproboSolicitud();
          //NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
          this.cantidadPendiente = this.cantidadPendiente - 1;
          if (this.cantidadPendiente === 0) {
            this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(this.rowActual.Id);
              this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
              this.cancelarSolicitudOperaciones();
          }
          else {
              this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
              //this.cargarHistorialSolicitudOperaciones();
              this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudesRealizadas();
              // //this.cargarGridSolicitudRealizada();
          }
        }
      }
    })
    // $.ajax({
    //     url: 'http://localhost:63048/api/SolicitudOperaciones/AprobarSolicitudOperaciones/' + objRow.Id + "/" + UserName + "/" + IdPersonal,
    //     type: 'GET',
    //     success: function (data) {

    //         AgendaSocketModule.SolicitarCambio();
    //         NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
    //         CantidadPendiente = CantidadPendiente - 1;
    //         if (CantidadPendiente === 0) {
    //             VentaCruzadaModule.ActividadEjecutadaOperaciones(rowActual.Id);
    //             ControlPantallasModule.closeModalPantalla2();
    //             CancelarSolicitudOperaciones();
    //         }
    //         else {
    //             CargarHistorialSolicitudOperaciones();
    //             CargarGridSolicitudRealizada();
    //         }
    //     },
    //     error: function (error) {
    //         NotificacionModule.showMensajeError(error, NotificacionId);
    //     }
    // });

  }

  /**
  * Aprobar el cambio de version, segun el alumno seleccionado
  * @param {object}
  * @return {void}
  */
  aprobarCambioVersion(objRow:any) {
    let fdata = new FormData();

    let _mensaje = "<p>Estimados,</p>" +
        "<p>Se Solicita Cambio de Version de Programa</p>" +
        "</br>" +
        "<p><strong>Informacion Requerida</strong></p>" +
        "<ul>" +
        "<li><strong>Codigo Matricula:</strong>" + this.rowActual.codigoMatricula + "</li>" +
        "<li><strong>Version Actual:</strong>" + objRow.ValorAnterior + "</li>" +
        "<li><strong>Version Nuevo:</strong>" + objRow.ValorNuevo + "</li>" +
        "<img src='https://repositorioweb.blob.core.windows.net/firmas/" + this.agendaService.userName + ".png' />";

    let _destinatario = 'bamontoya@bsginstitute.com';
    let _asunto = 'SOLICITUD DE CAMBIO DE VERSION DE PROGRAMA - ' + this.rowActual.codigoMatricula;
    let _destinatarioCC = 'mzegarraj@bsginstitute.com';

    fdata.append("IdActividadDetalle", this.rowActual.id);
    fdata.append("Idcentrocosto", this.rowActual.idCentroCosto);
    fdata.append("Idoportunidad", this.rowActual.idOportunidad);
    fdata.append("Remitente", this.agendaService.datosPersonal.email);
    fdata.append("Destinatario", _destinatario);
    fdata.append("Asunto", _asunto);
    fdata.append("Mensaje", window.btoa(unescape(encodeURIComponent(_mensaje))));
    fdata.append("DestinatarioCc", _destinatarioCC);
    fdata.append("Usuario", this.agendaService.userName);
    fdata.append("IdAsesor", this.rowActual.idPersonal_Asignado);


    this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow.id,this.agendaService.userName,this.agendaService.idPersonal)
    .subscribe({
      next:(resp:any) =>{
        if(resp != null){

          this.hub.invoke('SolicitarCambio');
          this.notificacionSeAproboSolicitud();
          this.cantidadPendiente = this.cantidadPendiente - 1;
          if (this.cantidadPendiente === 0) {
            this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(this.rowActual.id);
              this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
              this.cancelarSolicitudOperaciones();
          }
          else {
              this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
              this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudesRealizadas();
          }
        }
      }
    })
  }


  /**
  * Muestra la solicitud de confirmacion
  * @param Id {int}
  * @return {void}
  */
  mostrarConfirmacionSolicitud(Id:any) {
    this.modalRefmodalDetalleAprobacion = this.modalService.open(this.modalDetalleAprobacion, {
      size: 'lg',
      animation: true,
    });
    this.agendaService.agendaActividadesOperacionesService.mostrarConfirmacionSolicitud$(Id)
    .subscribe({
      next: (resp) => {
        if (resp != null){
          this.grid_confirmacion.data= resp.body
        }
      }
    })
  }

  /**
  * Aprobar el cambio de evaluacion, segun el alumno seleccionado
  * @param objRow {object}
  * @return {void}
  */
  aprobarCambioEvaluacion(objRow:any) {
    let _destinatario = 'fvaldez@bsginstitute.com';
    let _asunto = 'SOLICITUD DE CAMBIO AUTOEVALUACIONES - ' + this.rowActual.codigoMatricula;
    let _destinatarioCC = '';
    this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow.id,this.agendaService.userName,this.agendaService.idPersonal)
    .subscribe({
      next:(resp:any) =>{
        if(resp != null){
          this.notificacionSeAproboSolicitud();
          //NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
          this.cantidadPendiente = this.cantidadPendiente - 1;
          if (this.cantidadPendiente === 0) {
            this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(this.rowActual.id);
              this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
              this.cancelarSolicitudOperaciones();
          }
          else {
              this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
              this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudesRealizadas();
          }
        }
      }
    })
  }

  /**
  * Aprobar el cambio de fecha de finalizacion, segun el alumno seleccionado
  * @param objRow {object}
  * @return {void}
  */
  aprobarCambioFechaFinalizacion(objRow:any) {
    this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow.id,this.agendaService.userName,this.agendaService.idPersonal)
    .subscribe({
      next:(resp:any) =>{
        if(resp != null){
          this.notificacionSeAproboSolicitud()
          //NotificacionModule.showMensajeExitoso("Se Aprobo la Solicitud");
          this.cantidadPendiente = this.cantidadPendiente - 1;
          if (this.cantidadPendiente === 0 && this.rowActual.idPersonal_Asignado !== this.agendaService.idPersonal) {
            this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(this.rowActual.id);
              this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
              this.cancelarSolicitudOperaciones();
          }
          else {
              this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
              this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudesRealizadas();

          }
        }
      }
    })
  }


  /**
  * Aprueba el cambio de categoria alumno
  * @param objRow {object}
  * @return {void}
  */
  aprobarSolicitudCambioCategoria(objRow:any) {

    this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow.id,this.agendaService.userName,this.agendaService.idPersonal)
    .subscribe({
      next:(resp:any) =>{
        if(resp != null){


          this.hub.invoke('SolicitarCambio');
          this.notificacionSeAproboSolicitud();
          this.cantidadPendiente = this.cantidadPendiente - 1;
          if (this.cantidadPendiente === 0 && this.rowActual.IdPersonal_Asignado !== this.agendaService.idPersonal) {
            this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(this.rowActual.id);
              this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
              this.cancelarSolicitudOperaciones();
          }
          else {
              this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
              this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudesRealizadas();
          }
        }
      }
    })
  }


  /*
   * Apobrar Solicitud de
   * ampliacion de accesos temporales
   * */
  aprobarAmpliacionAccesosTemporales(objRow:any) {
    this.LoaderModalDetalleAprobacion=true
    this.agendaService.agendaActividadesOperacionesService.aprobarCambioCentroCosto$(objRow,this.agendaService.userName,this.agendaService.idPersonal)
    .subscribe({
      next:(resp:any) =>{
        if(resp != null){
          this.notificacionSeAproboAmpliacion()
            this.updateSolicitudCambio();
            this.LoaderModalDetalleAprobacion=false
            this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
            this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
            this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudesRealizadas();
          }
      },
        error: (error) => {
            this.updateAccesosTemporales();
            this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
          },

    })



    // $.ajax({
    //     url: 'http://localhost:63048/api/SolicitudOperaciones/AprobarSolicitudOperaciones/' + objRow + '/' + UserName + "/" + IdPersonal,
    //     type: 'GET',
    //     dataType: 'json',
    //     success: function (data) {
    //         NotificacionModule.showMensajeExitoso("Se aprobó la Ampliacion");
    //         $('#modalAprobacionAccesoTemporal').modal('hide');
    //         updateSolicitudCambio();
    //         hideLoading($('#modalAprobacionAccesoTemporal'));
    //         ControlPantallasModule.closeModalPantalla2();
    //     },
    //     error: function (error, textStatus, errorThrown) {
    //         NotificacionModule.showMensajeError(error, NotificacionId);
    //         updateAccesosTemporales();
    //         hideLoading($('#modalAprobacionAccesoTemporal'));
    //         ControlPantallasModule.closeModalPantalla2();
    //     }
    // });

  }

  /**
  * Rechazar la solicitud marcada en una grilla
  * @param e{object}
  * @return {void}
  */
  rechazarSolicitud(objRow:any) {
    console.log('rechazarSolicitud')
    this.inputIdSolictudOperaciones=objRow.id
    this.formModalRechazarSolicitudCambio.get("observacion").reset()

    if (objRow.idTipoSolicitudOperaciones === 4 || objRow.idTipoSolicitudOperaciones === 5) /*4:Estado ; 5:SubEstado*/
    {
        this.idTipoCambioOperacionesGeneral = objRow.idTipoSolicitudOperaciones;
        if (objRow.idTipoSolicitudOperaciones === 4) {
            this.modalRefmodalmodalRechazarSolicitudCambio = this.modalService.open(this.modalmodalRechazarSolicitudCambio, {
              animation: true,
            });
        }
        else if (objRow.idTipoSolicitudOperaciones === 5) {
            let ultimoIdEstado = 0;
            let ultimoEstado
            let dataSoliciitudesRealizadas = this.gridSolicitudesRealizadas.data
            let dataSolicitudes = this.gridHistorialSolicitudOperaciones.data$.value;
            let estadoSinAprobacion = dataSolicitudes = dataSolicitudes.filter((w:any) => w.idTipoSolicitudOperaciones === 4 && w.realizado === false);
            if (estadoSinAprobacion.length != 0) {
                return alert("Primero debe ver el Estado")
            }
            else {
              this.modalRefmodalmodalRechazarSolicitudCambio = this.modalService.open(this.modalmodalRechazarSolicitudCambio, {
                animation: true,
              });
                dataSoliciitudesRealizadas = dataSoliciitudesRealizadas.filter(w => w.idTipoSolicitudOperaciones === 4 && w.realizado === true);
                if (dataSoliciitudesRealizadas.length > 0) {
                    let fechaMaximaAprobacion = new Date("12/12/2000");
                    dataSoliciitudesRealizadas.forEach((data) => {
                        if (data.fechaAprobacion !== null && data.fechaAprobacion !== undefined) {
                            if (new Date(data.fechaAprobacion) > fechaMaximaAprobacion) {
                                fechaMaximaAprobacion = new Date(data.fechaAprobacion);
                                this.gridEstadoMatriculado.data$.value.forEach( (item:any)=> {
                                    if (item.nombre === data.valorNuevo) {
                                        ultimoIdEstado = item.id;
                                        ultimoEstado = item.nombre;
                                    }
                                });
                            }
                        }

                    });
                }
            }

            if (ultimoIdEstado === 0) {
                ultimoIdEstado = this.rowActual.idEstadoMatricula;
            }
        }
        this.inputIdSolictudOperaciones = objRow.id
    }
    else {
      this.seccionRechazarEstado=false
        this.seccionRechazarSubEstado=false
        this.inputIdSolictudOperaciones = objRow.id
        this.modalRefmodalmodalRechazarSolicitudCambio = this.modalService.open(this.modalmodalRechazarSolicitudCambio, {
          animation: true,
        });
    }
  }

  /**
  * Cancelar solicitud de operaciones ya activa
  * @return {void}
  */
  cancelarSolicitudOperaciones() {
    this.modalmodalRechazarSolicitudCambio.close()
  }

}

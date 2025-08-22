import { Observable, Subscription, combineLatest, take } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { AlertaService } from '@shared/services/alerta.service';
import { IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';
import { IDatosGenerales, IDatosVencidas, IDetalleSentinel, IDeuda, IDniRuc, IPosicionHistoria, ISentinelEstado } from '@comercial/models/interfaces/iagenda-sentinel';
import { HttpResponse } from '@angular/common/http';
import { IDatosSentinelAlumno, ILineaCredito, ILineaDeuda, IMoneda, ISemaforoSentinelAlumno } from '@comercial/models/interfaces/isemaforo-financiero';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { LabelFn } from '@progress/kendo-angular-progressbar';
import { SelectEvent } from '@progress/kendo-angular-layout';
import { constApiComercial } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.scss'],
})
export class PerfilClienteComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  // @Input() agendaServiceComercial: AgendaService;
  constructor(
  private alertaService: AlertaService,
  private formBuilder: FormBuilder,
  private modalService: NgbModal,
  private integraService: IntegraService    
) {}

formPerfilCliente: FormGroup = this.formBuilder.group({
  areaFormacion: '',
  cargo: '',
  industria: '',
  areaTrabajo: '',
  empresa: '',
  docIdentidad: '',
});

//loading
isLoading: boolean;
semaforoSentinelAlumnoObs$: Observable<any>;
///

alumno: IAlumnoInformacion;
// nroDocumento: string = '';
rowActual: any;

gridDNIRUC: KendoGrid = new KendoGrid();
gridDocumentoConsultadoDetalleDeuda: KendoGrid = new KendoGrid();
gridDocumentoDetalleVencidos: KendoGrid = new KendoGrid();
gridDocumentoLineasCredito: KendoGrid = new KendoGrid();
gridOtroDocumentoConsultadoDetalleDeuda: KendoGrid = new KendoGrid();
gridOtroDocumentoDetalleVencidos: KendoGrid = new KendoGrid();
gridOtroDocumentoLineasCredito: KendoGrid = new KendoGrid();
gridDatosGenerales: KendoGrid = new KendoGrid();
gridDatosPrincipales1: KendoGrid = new KendoGrid();
gridDatosPrincipales2: KendoGrid = new KendoGrid();
gridDireccionesRegistradas: KendoGrid = new KendoGrid();
gridPosicionHistorica: KendoGrid = new KendoGrid();
ultimaFechaConsulta: string = '';
semaforos: any[] = [];
semaforos2: any[] = [];
btnConsultar: any = {
  disabled: false,
  show: false,
  text: 'Consultar',
  class: 'btn-success',
  color: 'success',
};
sentinelAlumno: IDatosSentinelAlumno;
btnVerDetalleSentinel: any = {
  disabled: false,
  show: false,
};
gridCreditos: KendoGrid = new KendoGrid();
gridDeudas: KendoGrid = new KendoGrid();
gridDeudasVencidas: KendoGrid = new KendoGrid();

cabeceraSemaforoFinanciero: ISemaforoSentinelAlumno = {
  color: '#ff0303',
  mensaje: 'Solo aplica para Perú',
};
semaforoActivo:boolean=false;
monedaCliente: string = null;
edadClienteSentinel: any = '';

cuota = '';
sueldo = '';
sueldoReal = '';
sueldoEstimado = '';
showPanelSueldo: boolean = false;
showSueldoReal: boolean = false;
porcentaje = 0;
panelOpenState = false;
subscriptions: Subscription = new Subscription();
ngOnInit(): void {
  this.isLoading = true;
  console.log('PerfilClienteComponent');
  this.rowActual = this.agendaService.rowActual;
  this.initSubscribeObservables();
  // this.validarPaisAlumno(this.rowActual.ida)
  if (this.rowActual.idCodigoPais==51)this.semaforoActivo=true;
}
ngOnDestroy(): void {
  //Called once, before the instance is destroyed.
  //Add 'implements OnDestroy' to the class.
  this.subscriptions.unsubscribe();
}

probabilidadSueldo: {
  descripcion?: string;
  valor?: number;
};
initSubscribeObservables() {
  let sub1$ = this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.subscribe({
    next: (resp) => {
      if (resp != null) {
        this.probabilidadSueldo =  resp.probabilidadsueldo;
        this.alumno = resp.alumno;
        // this.nroDocumento = resp.alumno.dni;
        this.formPerfilCliente
          .get('areaFormacion')
          .setValue(this.alumno.aFormacion);
        this.formPerfilCliente.get('cargo').setValue(this.alumno.cargo);
        this.formPerfilCliente
          .get('industria')
          .setValue(this.alumno.industria);
        this.formPerfilCliente
          .get('areaTrabajo')
          .setValue(this.alumno.aTrabajo);
        this.formPerfilCliente.get('empresa').setValue(this.alumno.empresa);
        this.formPerfilCliente.get('docIdentidad').setValue(this.alumno.dni);
      }
    },
  });
  let tienePerfilFinanciero: boolean = null;
  let sub2$ = this.agendaService.agendaSentinelOperacionesService.sentinelAlumno$.subscribe(
    {
      next: (resp) => {
        this.sentinelAlumno = resp;
        if (resp != null) {
          tienePerfilFinanciero = true;
          this.cargarSemaforoFinanciero(resp);
        } else {
          tienePerfilFinanciero = false;
          this.btnConsultar.disabled = false;
          this.btnVerDetalleSentinel.show = false;
        }
      },
    }
  );
  let sub3$ = this.agendaService.agendaSentinelOperacionesService.btnVerDetalleSentinel$.subscribe(
    (resp) => {
      this.btnVerDetalleSentinel = Object.assign(this.btnVerDetalleSentinel,resp);
    }
  );

  let sub4$ = this.agendaService.agendaSentinelOperacionesService.sentinelHelp$.subscribe(
    (resp) => {
      // this.sentinelAlumno = resp;
    }
  );

  let sub5$ = this.agendaService.agendaAlumnoOperacionesService.probabilidadSueldo$.subscribe({
    next: (resp) => {
      this.setProbabilidadSueldo(resp);
      console.log('probabilidadSueldo')
    }
  })
  this.subscriptions.add(sub5$)
  this.subscriptions.add(sub1$);
  this.subscriptions.add(sub2$);
  this.subscriptions.add(sub3$);
  this.subscriptions.add(sub4$);

  let interval = setInterval(()=>{
    if(tienePerfilFinanciero === null)
      return;
    if(tienePerfilFinanciero === true && this.semaforoSentinelAlumnoObs$ == null)
      return;
    clearInterval(interval);
    const subs = [this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.pipe(take(1)),
      this.agendaService.agendaSentinelOperacionesService.sentinelAlumno$.pipe(take(1)),
      this.agendaService.agendaSentinelOperacionesService.btnVerDetalleSentinel$.pipe(take(1)),
      this.agendaService.agendaSentinelOperacionesService.sentinelHelp$.pipe(take(1)),
      this.agendaService.agendaAlumnoOperacionesService.probabilidadSueldo$.pipe(take(1))]

    if(tienePerfilFinanciero)
      subs.push(this.semaforoSentinelAlumnoObs$.pipe(take(1)));

    const combinedSub$ = combineLatest(subs).subscribe(()=>{
      this.isLoading = false;
      combinedSub$.unsubscribe();
    });
  }, 1000);
  
}

toEditDatosPersonales(){
  let selectEvent = new SelectEvent(1, 'Editar Datos Personales');
  this.agendaService.selectTabFicha$.emit(selectEvent);
}

setProbabilidadSueldo(resp: number){
  this.sueldo = '0.00%';
  if(resp != null || resp != 0){
    this.alumno.promedioSueldo = this.probabilidadSueldo.valor;
    this.alumno.promedioSueldoDesc = this.probabilidadSueldo.descripcion;

    if (this.alumno.promedioSueldo != null && this.alumno.promedioSueldoDesc != 'SD') {
      let promedio = `${this.alumno.promedioSueldo} - ${this.alumno.promedioSueldoDesc}`;
      this.sueldoReal = promedio
      this.sueldoEstimado = promedio.split('-')[0] ?? '-'
      let porcentaje = (resp * 100 / this.alumno.promedioSueldo).toFixed(2);
      this.sueldo = `${porcentaje}%`
      this.cuota = resp.toString();
      this.showPanelSueldo = true;
      this.showSueldoReal = true;
      this.porcentaje = Number(porcentaje);
    } else {
      this.showPanelSueldo = false;
      this.showSueldoReal = false;
    }

  }else{
    this.showPanelSueldo = false;
    this.showSueldoReal = false;
  }
}
edad: '';
progressStyles: { [key: string]: string } = {
  color: "white",
  background: "#A94442",
};
labelPercent: LabelFn = (value: number) => `${value}%`;


consultarNroDocumento() {
  // const dni = this.nroDocumento ? this.nroDocumento.trim() : '';
  const docIdentidad = this.formPerfilCliente.get('docIdentidad').value;
  const dni = docIdentidad ? docIdentidad.trim() : '';
  this.btnConsultar.disabled = true;
  if (dni.length == 8) {
    this.agendaService.agendaSentinelOperacionesService
      .actualizarSentinelAlumno$(dni, this.rowActual.idAlumno)
      .subscribe({
        next: (response) => {
          if (response.body.rpta == true) {
            this.alertaService.swalFireOptions({
              icon: 'success',
              text: 'La consulta se realizo satisfactoriamente',
            });
            this.recargarDatosSentinel();
          } else {
            this.alertaService.swalFireOptions({
              icon: 'info',
              text: 'No se encontró información',
            });
          }
        },
        error: (error) => {
          let mensaje = this.alertaService.getErrorResponse(error).mensaje;
          this.alertaService.swalFireOptions({
            icon: 'warning',
            title: 'No se pudo realizar la consulta',
            text: mensaje,
          })
          this.btnConsultar.disabled = false;
        },
      });
  } else {
    this.alertaService.swalFireOptions({
      icon: 'warning',
      title: 'El numero de DNI a consultar debe tener 8 digitos',
    })
    this.btnConsultar.disabled = false;
  }
}

validarPaisAlumno(idAlumno: number) {
  this.agendaService.agendaSentinelOperacionesService
    .obtenerCodigoMonedaPorIdAlumno$(idAlumno)
    .subscribe({
      next: (response: HttpResponse<IMoneda>) => {
        this.monedaCliente = response.body.valor;
        if (response.body != null) {
          if (response.body.valor == 'PEN') {
            this.semaforoActivo=true;
            this.cabeceraSemaforoFinanciero.color = '#808080';
            this.cabeceraSemaforoFinanciero.mensaje = 'Aun no se consulto';
          }
        }
        if (response.body.valor == 'COL') {
          this.agendaService.agendaSentinelOperacionesService.paisGlobal =
            'CO';
          this.iniciarDataCredito();
        }
      },
    });
}

iniciarDataCredito() {
  this.agendaService.agendaSentinelOperacionesService
    .obtenerInformacionDataCredito$(this.rowActual.idAlumno)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.body != null) {
          const data = response.body;
          this.cargarInformacionDataCreditoAlumno(data.informacion);
          this.cargarGridCreditos(data.tarjeta);
          this.cargarGridDeudas(data.credito);
          this.cargarGridDeudasVencidas(data.credito);
          this.agendaService.agendaSentinelOperacionesService.showSentinelHelp$.next(
            true
          );
          this.agendaService.agendaSentinelOperacionesService.sentinelHelp$.next(
            this.getSentinelHelp(data, '')
          );
        } else {
          this.btnConsultar.disabled = false;
          // this.btnVerDetalle.show = false;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
}

getSentinelHelp(
  sentinel: IDatosSentinelAlumno,
  tipoDocumento: string
): string {
  if (sentinel.fechaUltimaActualizacion) {
    const fechaUltimaActualizacion = new Date(
      sentinel.fechaUltimaActualizacion
    );
    return `Consulta exitosa realizada el ${datePipeTransform(
      fechaUltimaActualizacion,
      'dd/MM/yyyy'
    )} para ${sentinel.nombreAlterno}; con ${tipoDocumento} ${sentinel.dni}`;
  } else {
    return '';
  }
}

cargarInformacionDataCreditoAlumno(datos: any) {
  this.agendaService.agendaSentinelOperacionesService.btnConsultar$.next({
    disabled: true,
    text: 'Consultar',
    class: 'btn-warning',
    color: 'warning'
  });
}
cargarGridDeudasVencidas(lineaDeuda: any) {
  if (lineaDeuda != null && lineaDeuda.length > 0) {
    this.gridDeudasVencidas.data = lineaDeuda.filter(
      (e: any) => e.diasVencidos > 0
    );
  } else {
    this.gridDeudasVencidas.data = [];
  }
}

cargarSemaforoFinanciero(resp: IDatosSentinelAlumno) {
    this.sentinelAlumno = resp;
    this.configurarSentinel(resp);
    this.calcularEdadClienteSentinel(this.sentinelAlumno.fechaNacimiento);
    this.cargarGridDeudas(resp.lineaDeuda);
    this.cargarCabeceraSemaforo();
    this.gridCreditos.data = resp.lineaCredito;
    this.gridDeudas.data = resp.lineaDeuda;
    this.btnVerDetalleSentinel.show = true;
    this.ultimaFechaConsulta = resp.fechaUltimaActualizacion;
    this.btnConsultar.disabled = this.diferenciaMeses(new Date(resp.fechaUltimaActualizacion),new Date()) > 6 ? false : true;
}
diferenciaMeses(d1:any, d2:any) {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}
calcularEdadClienteSentinel(fechaNacimiento: any) {
  if (fechaNacimiento != null) {
    fechaNacimiento = new Date(fechaNacimiento);
    const fechaActual = new Date();
    // let years: any = durationInYears(fechaNacimiento, fechaActual);
    let years = fechaActual.getFullYear() - fechaNacimiento.getFullYear();
    let months = fechaActual.getMonth() - fechaNacimiento.getMonth();
    if (
      months < 0 ||
      (months == 0 && fechaActual.getDate() < fechaNacimiento.getDate())
    ) {
      this.edadClienteSentinel = `Edad: ${years--}`;
    }
    this.edadClienteSentinel = `Edad: ${years}`;
  } else {
    this.edadClienteSentinel = 'Edad:';
  }
}

cargarCabeceraSemaforo() {

  this.semaforoSentinelAlumnoObs$ = this.integraService.getJsonResponse(
    `${constApiComercial.AgendaInformacionActividadObtenerSemaforoSentinelAlumno}/${this.rowActual.idAlumno}`
  );
  this.semaforoSentinelAlumnoObs$.subscribe({
    next: (resp: HttpResponse<ISemaforoSentinelAlumno>) => {
      if (resp.body !== null) {
        this.cabeceraSemaforoFinanciero.color = resp.body.color;
        this.cabeceraSemaforoFinanciero.mensaje = resp.body.mensaje;
        if (
          this.cabeceraSemaforoFinanciero.color == null ||
          this.cabeceraSemaforoFinanciero.mensaje == null
        ) {
          this.cabeceraSemaforoFinanciero.color = '#ff0303';
          this.cabeceraSemaforoFinanciero.mensaje = 'Aun no se consulto';
        }
      }
    },
  });
}

configurarSentinel(resp: IDatosSentinelAlumno) {
  this.sentinelAlumno = resp;
  this.agendaService.agendaSentinelOperacionesService.btnConsultar$.next({
    disabled: true,
    text: 'Consultar',
    class: 'btn-warning segundaConsulta',
    color: 'warning'
  });
  this.agendaService.agendaSentinelOperacionesService.showSentinelHelp$.next(
    true
  );
  this.agendaService.agendaSentinelOperacionesService.btnVerDetalleSentinel$.next(
    {
      show: true,
    }
  );
  this.agendaService.agendaSentinelOperacionesService.sentinelHelp$.next(
    this.getSentinelHelp(this.sentinelAlumno, 'DNI')
  );
}

cargarGridCreditos(lineaCredito: ILineaCredito[]) {
  if (lineaCredito != null && lineaCredito.length > 0) {
    this.gridCreditos.data = lineaCredito;
  } else {
    this.gridCreditos.data = [];
  }
}
cargarGridDeudas(lineaDeuda: ILineaDeuda[]) {
  if (lineaDeuda != null && lineaDeuda.length > 0) {
    this.gridDeudas.data = lineaDeuda;
  } else {
    this.gridDeudas.data = [];
  }
}

recargarDatosSentinel() {
  this.agendaService.agendaSentinelOperacionesService
    .recargarDatosSentinel$(this.rowActual.idAlumno)
    .subscribe({
      next: (resp: HttpResponse<IDatosSentinelAlumno>) => {
        this.agendaService.agendaSentinelOperacionesService.sentinelAlumno$.next(
          resp.body
        );
      },
      complete: () => {
        // Swal.fire({
        //   position: 'top-end',
        //   icon: 'success',
        //   title: 'Se cargo correctamente los datos de Sentinel',
        //   showConfirmButton: false,
        //   timer: 1500
        // })
      },
    });
}

colorSemaforo(semaforo: string) {
  let color = '';
  if(this.sentinelAlumno != null){
    switch (semaforo.trim()) {
      case '1':
        color = 'red';
        break;
      case '3':
        color = 'gray';
        break;
      case '2':
        color = 'yellow';
        break;
      case '4':
        color = 'green';
        break;
      default:
        color = 'blue';
        // color = 'transparent';
    }
  }
  return color;
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

verDetalleSemaforoFin(content: any) {
  const idSentinel = this.sentinelAlumno.idSentinel;
  this.agendaService.agendaSentinelOperacionesService
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
        // let lineaCredito = data.lineaCredito.map((e: any) => {
        //   e.fechaProceso = new Date(e.fechaProceso);
        // });
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

cargarDNIRUC(dniRuc: IDniRuc[]) {
  this.gridDNIRUC.data = dniRuc;
}
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

cargarOtroDocumentoConsultadoSemaforos(records: IDniRuc[]) {
  let documentoConsultadoSemaforos = records.filter(
    (item) => item.tipoDocumento == 'R'
  );
  let semaforos =
    documentoConsultadoSemaforos.length > 0
      ? documentoConsultadoSemaforos[0].semaforos
      : '';
  // let container = $("#gridOtroDocumentoConsultadoSemaforos");
  this.semaforos2 = semaforos.split('');
  // container.empty();
  // items.forEach(function (item) {
  //     container.append(_colorSemaforoAV(item));
  // });
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

import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICodigoMatriculaPespecifico, ICronogramaPago, IEnvioSms, IMetodoPagoMatricula, IMontoPagoCronograma, ITextoBeneficios } from '@comercial/models/interfaces/iagenda-cronograma-pago';
import { constApiComercial } from '@environments/constApi';
import { constApiOperaciones } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import Swal from 'sweetalert2';
import { AgendaOperacionesService } from './agenda-operaciones.service';

@Injectable()
export class AgendaCronogramaOperacionesService {

  constructor(private integraService: IntegraService) { }

  private agendaService: AgendaOperacionesService;

  public datosMontoPagos$: ReplaySubject<ICronogramaPago> = new ReplaySubject<ICronogramaPago>(1);
  public datosCeonogramaPago$: ReplaySubject<ICodigoMatriculaPespecifico[]> = new ReplaySubject<ICodigoMatriculaPespecifico[]>(1);
  public datosCronogramaEvaluaciones$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public cronogramaDePagos$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public listaMedioPago$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public MetodoPago$: ReplaySubject<any> = new ReplaySubject<any>(1);
  public cronogramaAprobado$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  datosDetalleMontoPago$: ReplaySubject<any>= new ReplaySubject<any>(1);
  public cargarCronogramaPagos$: ReplaySubject<any>= new ReplaySubject<any>(1);
  public cargarCronogramaEvaluaciones$: ReplaySubject<any>= new ReplaySubject<any>(1);
  public datosCursosMoodle$: ReplaySubject<any>= new ReplaySubject<any>(1);
  private rowActual: any

  setAgendaService(agendaService: AgendaOperacionesService) {
    this.agendaService = agendaService;
    this.ready();
  }
  async initFicha(){
    this.rowActual = this.agendaService.rowActual;
    this.ObtenerCronogramaFinanzas();
    this.cargarCronogramaPagos(this.rowActual);
    this.cargarCronogramaEvaluaciones(this.rowActual);
  }
  async resetFicha(){
    this.datosMontoPagos$ = new ReplaySubject<ICronogramaPago>(1);
    this.datosCeonogramaPago$ = new ReplaySubject<ICodigoMatriculaPespecifico[]>(1);
    this.datosCronogramaEvaluaciones$ = new ReplaySubject<any>(1);
    this.cronogramaDePagos$ = new ReplaySubject<any>(1);
    this.cargarCronogramaEvaluaciones$ = new ReplaySubject<any>(1);
    this.cargarCronogramaPagos$ = new ReplaySubject<any>(1);
    this.listaMedioPago$ = new ReplaySubject<any>(1);
    this.MetodoPago$ = new ReplaySubject<any>(1);
    this.datosCursosMoodle$ = new ReplaySubject<any>(1);
  }

  ready() {}
  ObtenerCronogramaFinanzas(){
    var idPadre = this.rowActual.idPadre === null ? this.rowActual.idOportunidad : this.rowActual.idPadre;
    this.integraService.getJsonResponse(
      `${constApiOperaciones.MontoPagoCronogramaObtenerOportunidadCronogramaFinanzas}/${idPadre}/${this.agendaService.tipoPersonal}/${this.rowActual.idMatriculaCabecera}`
      ).subscribe({
      next: (response: any) => {
        this.cronogramaDePagos$.next(response.body);
        this.ObtenerListaMedioPago();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo obtener el cronograma de pagos',
        })
        
      }
    });
  }
  ObtenerListaMedioPago(){
    this.integraService.getJsonResponse(
      `${constApiComercial.PasarelaPagoPwObtenerPasarelaPagoPorIdAlumno}/${this.rowActual.idAlumno}`
    ).subscribe({
      next: (response: any) => {
        this.listaMedioPago$.next(response.body);
        this.ObtenerMedioPago();
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo obtener los medios de pago',
        })
      }
    });
  }
  ObtenerMedioPago(){
    this.integraService.getJsonResponse(
      `${constApiComercial.MedioPagoMatriculaCronogramaObtenerMedioPagoPorIdMatricula}/${this.rowActual.idMatriculaCabecera}`
    ).subscribe({
      next: (response: any) => {
        this.MetodoPago$.next(response.body);
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se pudo obtener los medios de pago',
        })
      }

    })
  }
  cargarCronogramaPagos(rowActual: any){
    this.integraService.getJsonResponse(
      `${constApiOperaciones.MatriculaCabeceraObtenerCodigoMatriculaPEspecificoPorAlumno}/${rowActual.idAlumno}`
    ).subscribe({
      next: (resp : HttpResponse<ICodigoMatriculaPespecifico[]>) => {
        this.datosCeonogramaPago$.next(resp.body);
        //this.cargarCronogramaPagos$.next(resp.body);
      },
      error: (err) => {
        console.log(err);
      }
    })

    this.integraService.getJsonResponse(
      `${constApiComercial.MontoPagoCronogramaObtenerOportunidadCronogramaPago}/${rowActual.idOportunidad}/${this.agendaService.tipoPersonal}`
    ).subscribe({
      next: (response: HttpResponse<ICronogramaPago>) => {
        this.datosMontoPagos$.next(response.body);
        if(response.body.cronograma.esAprobado){
          this.cronogramaAprobado$.next(true);
        }
      },
    });
  }
  cargarCronogramaEvaluaciones(rowActual: any){
    this.integraService.getJsonResponse(
      `${constApiOperaciones.MatriculaCabeceraObtenerIdentificadoresMatriculaComboPorAlumno}/${rowActual.idAlumno}`
    ).subscribe({
      next: (response: HttpResponse<any>) => {
        this.datosCronogramaEvaluaciones$.next(response.body);
      }
    });
    this.ObtenerComboCursosMoodlePorMatricula(rowActual.idMatriculaCabecera).subscribe({
      next: (response: HttpResponse<any>) => {
        this.datosCursosMoodle$.next(response.body);
      }
    });
  };
  ObtenerComboCursosMoodlePorMatricula(idMatriculaCabecera:any){
    return this.integraService.getJsonResponse(
      `${constApiOperaciones.MatriculaCabeceraObtenerComboCursosMoodlePorMatricula}/${idMatriculaCabecera}`
    )
  }
  SolicitarExoneracionCuota(e: any){
  }

  cargarMedioPago$(rowSeleccionada: any){
    console.log("cargarMedioPagorowSeleccionada",rowSeleccionada)
    return this.integraService.getJsonResponse(
      `${constApiComercial.PasarelaPagoPwObtenerPasarelaPagoPorIdAlumno}/${rowSeleccionada.idAlumno}`
    );
  }

  obtenerMatriculaPorAlumnoCosto$(rowSeleccionada: any){
    return this.integraService.getJsonResponse(
      `${constApiComercial.MatriculaCabeceraObtenerIdMatriculaPorAlumnoCentroCosto}/${rowSeleccionada.idAlumno}/${rowSeleccionada.idCentroCosto}`
    );
  }

  obtenerMetodoPagoPorIdMatriculaCabecera$(idMatriculaCabecera: number){
    return this.integraService.getJsonResponse(
      `${constApiComercial.MedioPagoMatriculaCronogramaObtenerMedioPagoPorIdMatricula}/${idMatriculaCabecera}`
    );
  }

  obtenerDetalleMontoPago$(IdMontoPago: number){
    this.datosDetalleMontoPago$ = new ReplaySubject<ITextoBeneficios[]>();
    return this.integraService.getJsonResponse(
      `${constApiComercial.MontoPagoCronogramaObtenerDetalleMontoPago}/${IdMontoPago}`
    )
    //.subscribe({
    //  next: (response: HttpResponse<any>) =>{
    //    this.datosDetalleMontoPago$.next(response.body);
    //  }
    //});
  }
  guardarCronogramaPago$(idOportunidad:number, idAlumno:number, cronogramaDTO: IMontoPagoCronograma){
    return this.integraService.postJsonResponse(
      `${constApiComercial.MontoPagoCronogramaGuardarCronogramaVentas}/${idOportunidad}/${idAlumno}`, JSON.stringify(cronogramaDTO));
  }
  congelarCronogramaAlumno$(idCronograma: number, usuario: string){
    return this.integraService.postJsonResponse(
      `${constApiComercial.MontoPagoCronogramaCongelarCronogramaAlumno}/${idCronograma}/${usuario}`, null
    );
  }
  eliminarCronogramaPago$(idOportunidad: number, idAlumno: number, cronograma: IMontoPagoCronograma){
    return this.integraService.postJsonResponse(
      `${constApiComercial.MontoPagoCronogramaEliminarCronogramaVentas}/${idOportunidad}/${idAlumno}`, JSON.stringify(cronograma)
    );
  }
  actualizarMedioPago$(data: IMetodoPagoMatricula){
    return this.integraService.postJsonResponse(constApiComercial.PasarelaPagoPWRegistroMedioPagoMatriculaCronograma, JSON.stringify(data));
  }
  enviarMensajeTexto$(data: IEnvioSms){
    return this.integraService.postJsonResponse(
      constApiComercial.AgendaInformacionActividadEnviarMensajeTexto, JSON.stringify(data)
    );
  }

  init(){}
}

import { IRowActual } from './../../../../models/interfaces/iagenda';
import { Subscription } from 'rxjs';
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { IAlumnoInformacion } from '@integra/areas/comercial/models/interfaces/iagenda-datos-alumno';
import { cloneData } from '@shared/functions/clone-data';
import { ICabeceraSpeech } from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { CrmService } from '@shared/services/crm.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiMarketing } from '@environments/constApi';

@Component({
  selector: 'app-speech',
  templateUrl: './speech.component.html',
  styleUrls: ['./speech.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SpeechComponent implements OnInit {
  @Input() agendaService: AgendaService;
  @ViewChild('modalHistorialCorreo') modalHistorialCorreo: any;
  @ViewChild('modalVentaCruzada') modalVentaCruzada: any;
  @ViewChild('modalSubirConvenioCapacitacion')
  modalSubirConvenioCapacitacion: any;
  subscriptions: Subscription = new Subscription();
  constructor(
    private _crmService: CrmService,
    private integraService: IntegraService,
  ) {}

  spanFaseActual: string = null;
  speechBienvenida: string = null;
  ciudadCabecera: string = '';
  alumno: IAlumnoInformacion;
  nombreCompletoAlumno: string = 'Cargando...';
  cabeceraSpeech: ICabeceraSpeech;
  rowActual: any = {};
  flagPeru: boolean = false;
  descuentoProfilingAprobado:boolean=false;
  cuponDescuentoProfiling:any;
  ngOnInit(): void {
    this.rowActual = this.agendaService.rowActual;
    this.initSubscribeObservables();
  }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
  cargarSpeechBienvenidaDespedida() {
    this.speechBienvenida = 'Cargando Speech...';
    let sub$ = this.agendaService.agendaValorEtiquetaService.flagSetValorEtiqueta$.subscribe(
      {
        next: (resp) => {
          if (resp == true) {
            let subSpeech$ =
              this.agendaService.agendaActividadesService.speechBienvenidaDespedida$.subscribe(
                {
                  next: (response) => {
                    if (response != null) {
                      let speechBienvenida = response.plantillaPorFase.filter(
                        (item) =>
                          response.speech.data.idPlantillaBienvenida ==
                          item.idPlantilla
                      );
                      this.agendaService.agendaValorEtiquetaService.valoresEtiquetasComercial();
                      let speech =
                        this.agendaService.agendaValorEtiquetaService.cargarValoresEtiqueta(
                          cloneData(speechBienvenida)
                        );
                      if (speech?.length > 0) {
                        this.speechBienvenida = speech[0].valor;
                      }
                      speech = [];
                    }
                  },
                }
              );
            this.subscriptions.add(subSpeech$);
          }
        },
      }
      );
      this.subscriptions.add(sub$);
  }
  initSubscribeObservables() {
    let sub1$ = this.agendaService.agendaAlumnoService.alumno$.subscribe({
      next: (resp: IAlumnoInformacion) => {
        if (resp != null) {
          this.cargarDatosAlumno(resp);
          if(resp.idCodigoPais!=null){
            this.flagPeru = resp.idCodigoPais==51 ? true : false;
          }
          this.obtenerDescuentoProfiling(resp.email1)
        }
      },
    });
    let sub2$ =
      this.agendaService.agendaInformacionActividadOportunidadService.cabeceraSpeech$.subscribe(
        (resp) => {
          if (resp != null) {
            this.cabeceraSpeech = resp;
          }
        }
      );
    this.subscriptions.add(sub1$);
    this.subscriptions.add(sub2$);
    this.cargarSpeechBienvenidaDespedida();
  }
  cargarDatosAlumno(alumno: IAlumnoInformacion) {
    this.alumno = alumno;
    let nombreCompleto = alumno.nombre1.trim();
    if (alumno.nombre2 != null && alumno.nombre2.trim() != '')
      nombreCompleto = nombreCompleto.concat(' ', alumno.nombre2);
    nombreCompleto = nombreCompleto.concat(' ', alumno.apellidoPaterno);
    if (alumno.apellidoMaterno != null && alumno.apellidoMaterno.trim() != '')
      nombreCompleto = nombreCompleto.concat(' ', alumno.apellidoMaterno);
    this.nombreCompletoAlumno = nombreCompleto.trim();
    if (alumno.nombreCiudad != null) {
      this.ciudadCabecera = ` - ${alumno.nombreCiudad}`;
    }
    this.spanFaseActual = `Fase Actual: ${this.agendaService.rowActual.codigoFase}`;
  }
  posicionar(el: HTMLElement) {
    el.scrollIntoView();
  }
  reloadArbolOcurrencias() {
    this.agendaService.agendaArbolOcurrenciaService.cargarArbolOcurrencias(
      this.agendaService.rowActual.idActividadCabecera,
      0
    );
    this._crmService.showOcurrencias$.next(true)
  }

  get esWhatsappCorreos(){
    return this.agendaService.esWhatsappCorreos;
  }
  obtenerDescuentoProfiling(email:string) {
    this.descuentoProfilingAprobado=false;
    this.cuponDescuentoProfiling=undefined;
    var parametros: any[] = [
          { clave: 'EmailUsuario', valor: email }
    ];
    this.integraService
      .obtenerPorPathParams(
        constApiMarketing.ObtenerDescuentoProfiling,
        parametros
      )
      .subscribe({
        next: (response: any) => {
          if(response.body!=null){
            this.descuentoProfilingAprobado=true
            this.cuponDescuentoProfiling=response.body
          }
        },
        error: (error) => {
        },
        complete: () => {},
      });
  }
}

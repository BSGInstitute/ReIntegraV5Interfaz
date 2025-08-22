import { Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { LlamadasIntegra3cx } from '@comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { AlertaService } from '@shared/services/alerta.service';

/**
 * @module ComercialModule
 * @description Registro de actividades de la oportunidad, reproduccion de llamadas
 * @author Christian Quispe M.
 * @author Flavio R. M. F.
 * @version 1.0.1
 * @history
 * * 27/11/2023 Implementacion de llamadas 3cx
 */
@Component({
  selector: 'app-resumen-contacto',
  templateUrl: './resumen-contacto.component.html',
  styleUrls: ['./resumen-contacto.component.scss'],
})
export class ResumenContactoComponent implements OnInit, OnDestroy {
  @Input() agendaService: AgendaService;
  private _subscriptions$: Subscription = new Subscription();

  gridHistorialInteraccionesEfectivo = new KendoGrid();
  urlGrabacion: string = '';
  _textoZonaHoraria: string = null;
  origenLlamada: string = '';
  constructor(
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.gridHistorialInteraccionesEfectivo.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.initSubscribeObservables();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  get textoZonaHoraria() {
    return this._textoZonaHoraria;
  }
  initSubscribeObservables() {
    this.gridHistorialInteraccionesEfectivo.loading = true;
    let sub1$ =
      this.agendaService.agendaInformacionActividadOportunidadService.historialInteraccionesPorIdOportunidad$.subscribe(
        (resp) => {
          this.gridHistorialInteraccionesEfectivo.data = resp;
          this.gridHistorialInteraccionesEfectivo.loading = false;
        }
      );
    let sub2$ = this.agendaService._idPaisSede$.subscribe((resp) => {
      this._textoZonaHoraria = null;
      if (resp == 52) {
        this._textoZonaHoraria = `* Hora de Reprogramacion y Llamadas ajustado a hora de "Mexico" (UTC-6)`;
      }
      if (resp == 51) {
        this._textoZonaHoraria = `* Hora de Reprogramacion y Llamadas ajustado a hora de "Perú" (UTC-5)`;
      }
      if (resp == 56) {
        this._textoZonaHoraria = `* Hora de Reprogramacion y Llamadas ajustado a hora de "Chile" (UTC-3 en verano y UTC-4 en invierno)`;
      }
      if (resp == 57) {
        this._textoZonaHoraria = `* Hora de Reprogramacion y Llamadas ajustado a hora de "Colombia" (UTC-5)`;
      }
    });
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
  }
  reproducirAudio(context: any, dataItem: LlamadasIntegra3cx) {
    this.origenLlamada = dataItem.origenLlamada;
    let flagReproducir: boolean = false;
    this.urlGrabacion = null;
    switch (dataItem.webphone) {
      case 'Mizutech':
        break;
      case 'Silcom':
        flagReproducir = true;
        this.urlGrabacion = dataItem.nombreGrabacion;
        break;
      case 'Silcom Migrado':
        flagReproducir = true;
        this.urlGrabacion = dataItem.nombreGrabacion;
        break;
      case 'TresCx Migrado':
        flagReproducir = true;
        this.urlGrabacion = dataItem.nombreGrabacion;
        break;
      case 'TresCx':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio 3cx aun no disponible',
        });
        break;
      case 'TresCx Sin Grabacion':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
      case 'Ringover Migrado':
        flagReproducir = true;
        this.urlGrabacion = dataItem.nombreGrabacion;
        break;
      case 'Ringover':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio Ringover aun no disponible',
        });
        break;
      case 'Ringover Sin Grabacion':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
      case 'Wolkbox':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio aun no disponible',
        });
        break;
      case 'Wolkbox Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'Wolkbox Sin Grabacion':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
      case 'Wavix':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'Audio aun no disponible',
        });
        break;
      case 'Wavix Migrado':
        this.urlGrabacion = dataItem.nombreGrabacion;
        flagReproducir = true;
        break;
      case 'Wavix Sin Grabacion':
        this.alertaService.swalFireOptions({
          icon: 'info',
          text: 'No contiene grabación',
        });
        break;
    }
    if (flagReproducir) {
      this.modalService.open(context, { size: 'md', backdrop: 'static' });
    }
  }
  reproducirLlamadaNuevoWebPhone(nombreGrabacion: string) {
    this.urlGrabacion = `https://integrav4-ast-llamadas.bsginstitute.com/play.php?nombreArchivo=${nombreGrabacion}`;
    // let params: any = { nombreArchivo: nombreGrabacion }
    // this.integraService.
    //   postTextResponse(`https://integrav4-ast-llamadas.bsginstitute.com/exist.php`, params).
    //   subscribe({
    //     next: () => {
    //     },
    //     error: () => {
    //       alert("No se encontro grabacion")
    //     }
    //   })
  }
}

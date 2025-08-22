import { Injectable } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AgendaService } from './agenda.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiComercial } from '@environments/constApi';
import { BehaviorSubject, Subscription } from 'rxjs';
import { IPlantillasPorIdFaseOportunidad } from '../../models/interfaces/iagenda-activad';
import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '@shared/services/alerta.service';
import { PagerSettings } from '@progress/kendo-angular-grid';
@Injectable()
export class AgendaInicializarService {
  // /Areas/Comercial/Content/Scripts/Agenda-Inicializar24112021.js
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  private _subscriptions$: Subscription = new Subscription();
  private _subscriptionsFicha$: Subscription = new Subscription();
  private _agendaService: AgendaService;
  gridProgramacionAutomatica: KendoGrid = new KendoGrid();
  gridProgramacionManual: KendoGrid = new KendoGrid();
  gridNoProg1Solicitud: KendoGrid = new KendoGrid();
  gridNoProgMas1Solicitud: KendoGrid = new KendoGrid();
  gridWorkshop: KendoGrid = new KendoGrid();
  gridNoProgAltasMedias: KendoGrid = new KendoGrid();
  gridVencidasIpIcPf: KendoGrid = new KendoGrid();
  gridVencidasIsM: KendoGrid = new KendoGrid();
  gridPreLanzamiento: KendoGrid = new KendoGrid();
  gridRN2: KendoGrid = new KendoGrid();
  gridRN2A: KendoGrid = new KendoGrid();
  gridVentaCruzada: KendoGrid = new KendoGrid();
  gridRealizadas: KendoGrid = new KendoGrid();
  // gridMensajesRecibidos: KendoGrid = new KendoGrid();
  gridWhatsapp: KendoGrid = new KendoGrid();
  gridCorreos: KendoGrid = new KendoGrid();
  filtroFormularioTabRn2: any = null;
  filtroFormularioTabRn2A: any = null;
  filtroFormularioTabRealizadas: any = {};
  plantillasPorIdFaseOportunidad$ = new BehaviorSubject<Array<IPlantillasPorIdFaseOportunidad>>(null);
  async setAgendaService(agendaService: AgendaService) {
    this._agendaService = agendaService;
    await this.ready();
  }
  async ready() {
    if(!this._agendaService.esPredictivo){
      this.cargarGrillas();
      // let sub2$ = this._integraService
      //   .getJsonResponse(
      //     `${constApiComercial.MessengerChatObtenerPlantillaMessengerParaAgenda}`
      //   )
      //   .subscribe({
      //     next: (response: any) => {
      //       this._plantillasMessenger$.next(response.body);
      //     },
      //   });
      //   this._subscriptions$.add(sub2$)
    }
    // this._subscriptions$.add(sub1$)
  }
  async resetService() {
    await this.resetFicha();
    this.gridProgramacionAutomatica = new KendoGrid();
    this.gridProgramacionManual = new KendoGrid();
    this.gridNoProg1Solicitud = new KendoGrid();
    this.gridNoProgMas1Solicitud = new KendoGrid();
    this.gridWorkshop = new KendoGrid();
    this.gridNoProgAltasMedias = new KendoGrid();
    this.gridVencidasIpIcPf = new KendoGrid();
    this.gridVencidasIsM = new KendoGrid();
    this.gridPreLanzamiento = new KendoGrid();
    this.gridRN2 = new KendoGrid();
    this.gridVentaCruzada = new KendoGrid();
    this.gridRealizadas = new KendoGrid();
    this.filtroFormularioTabRn2 = null;
    this.filtroFormularioTabRealizadas = {};
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = new Subscription();
  }
  async initFicha() {
    this.obtenerSedePersonal();
    this.cargarPlantillasInicio(
      this._agendaService.rowActual.idFaseOportunidad
    );
  }
  obtenerSedePersonal(){
    this._integraService.getJsonResponse(`${constApiComercial.PersonalObtenerPaisSedPersonal}/${this._agendaService.rowActual.idPersonal_Asignado}`).subscribe({
      next: (resp: HttpResponse<{idPaisSede: number}>) => {
        this._agendaService._idPaisSede$.next(resp.body.idPaisSede);
      }
    })
  }
  async resetFicha() {
    this._agendaService._idPaisSede$ = new BehaviorSubject<number>(null);
    this._subscriptionsFicha$.unsubscribe();
    this._subscriptionsFicha$ = new Subscription();
    this.plantillasPorIdFaseOportunidad$ = new BehaviorSubject<Array<IPlantillasPorIdFaseOportunidad>>(null)
  }
  reloadGrids(status: boolean) {
    this.gridProgramacionAutomatica.loading = status;
    this.gridProgramacionManual.loading = status;
    this.gridNoProg1Solicitud.loading = status;
    this.gridNoProgMas1Solicitud.loading = status;
    this.gridWorkshop.loading = status;
    this.gridNoProgAltasMedias.loading = status;
    this.gridVencidasIpIcPf.loading = status;
    this.gridVencidasIsM.loading = status;
    this.gridPreLanzamiento.loading = status;
    this.gridRN2.loading = status;
    this.gridVentaCruzada.loading = status;
    this.gridRealizadas.loading = status;
  }
  obtenerDataGrids(): KendoGrid[] {
    return [
      this.gridProgramacionAutomatica,
      this.gridProgramacionManual,
      this.gridNoProg1Solicitud,
      this.gridNoProgMas1Solicitud,
      this.gridWorkshop,
      this.gridNoProgAltasMedias,
      this.gridVencidasIpIcPf,
      this.gridVencidasIsM,
      this.gridPreLanzamiento,
      this.gridRN2,
      this.gridRN2A,
      this.gridVentaCruzada,
      this.gridRealizadas,
    ];
  }
  private cargarPlantillasInicio(idFaseOportunidad: number) {
    let sub$ = this._integraService
      .getJsonResponse(
        `${constApiComercial.AgendaInformacionActividadObtenerPlantillasPorIdFaseOportunidad}/${idFaseOportunidad}`
      )
      .subscribe({
        next: (
          response: HttpResponse<Array<IPlantillasPorIdFaseOportunidad>>
        ) => {
          this.plantillasPorIdFaseOportunidad$.next(response.body);
          this._agendaService.agendaActividadesService.cargarSpeech(response.body);
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje)
        }
      });
    this._subscriptionsFicha$.add(sub$)
  }
  private cargarGrillas() {
    // TODO: implement
    let columns = [];
    if (this._agendaService.esCoordinadora$.value) {
      columns.push({
        title: 'Asesor',
        field: 'asesor',
        width: 160,
        headerClass: 'header-grid-integra',
      });
    }
    let gridState = {
      skip: 0,
      take: 5,
    };
    let pageable: PagerSettings = {
      buttonCount: 10,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridProgramacionAutomatica = new KendoGrid();
    this.gridProgramacionAutomatica.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Actividad',
        field: 'ultimaFechaProgramada',
        width: 120,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Dias S/C<br>(Act. Hoy)<br>Mañana',
        field: 'diasSinContactoManhana',
        width: 100,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Dias S/C<br>(Act. Hoy) Tarde',
        field: 'diasSinContactoTarde',
        width: 100,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario Anterior',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridProgramacionAutomatica.gridState = gridState;
    this.gridProgramacionAutomatica.resizable = true;
    this.gridProgramacionAutomatica.height = 690;
    this.gridProgramacionAutomatica.pageable = pageable;

    this.gridProgramacionManual = new KendoGrid();
    this.gridProgramacionManual.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Actividad',
        field: 'ultimaFechaProgramada',
        width: 120,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Dias S/C<br>(Act. Hoy)<br>Mañana',
        field: 'diasSinContactoManhana',
        width: 100,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Dias S/C<br>(Act. Hoy) Tarde',
        field: 'diasSinContactoTarde',
        width: 100,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario Anterior',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridProgramacionManual.gridState = gridState;
    this.gridProgramacionManual.resizable = true;
    this.gridProgramacionManual.height = 690;
    this.gridProgramacionManual.pageable = pageable;

    this.gridNoProg1Solicitud = new KendoGrid();
    this.gridNoProg1Solicitud.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario Anterior',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridNoProg1Solicitud.gridState = gridState;
    this.gridNoProg1Solicitud.resizable = true;
    this.gridNoProg1Solicitud.height = 690;
    this.gridNoProg1Solicitud.pageable = pageable;

    this.gridNoProgMas1Solicitud = new KendoGrid();
    this.gridNoProgMas1Solicitud.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario Anterior',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridNoProgMas1Solicitud.gridState = gridState;
    this.gridNoProgMas1Solicitud.resizable = true;
    this.gridNoProgMas1Solicitud.height = 690;
    this.gridNoProgMas1Solicitud.pageable = pageable;

    this.gridWorkshop = new KendoGrid();
    this.gridWorkshop.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario Anterior',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridWorkshop.gridState = gridState;
    this.gridWorkshop.resizable = true;
    this.gridWorkshop.height = 690;
    this.gridWorkshop.pageable = pageable;

    this.gridNoProgAltasMedias = new KendoGrid();
    this.gridNoProgAltasMedias.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario Anterior',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridNoProgAltasMedias.gridState = gridState;
    this.gridNoProgAltasMedias.resizable = true;
    this.gridNoProgAltasMedias.height = 690;
    this.gridNoProgAltasMedias.pageable = pageable;

    this.gridVencidasIpIcPf = new KendoGrid();
    this.gridVencidasIpIcPf.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Actividad',
        field: 'ultimaFechaProgramada',
        width: 120,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Dias S/C<br>(Act. Hoy)<br>Mañana',
        field: 'diasSinContactoManhana',
        width: 100,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Dias S/C<br>(Act. Hoy) Tarde',
        field: 'diasSinContactoTarde',
        width: 100,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario Anterior',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridVencidasIpIcPf.gridState = gridState;
    this.gridVencidasIpIcPf.resizable = true;
    this.gridVencidasIpIcPf.height = 690;
    this.gridVencidasIpIcPf.pageable = pageable;

    this.gridVencidasIsM = new KendoGrid();
    this.gridVencidasIsM.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Actividad',
        field: 'ultimaFechaProgramada',
        width: 120,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario Anterior',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridVencidasIsM.gridState = gridState;
    this.gridVencidasIsM.resizable = true;
    this.gridVencidasIsM.height = 690;
    this.gridVencidasIsM.pageable = pageable;

    this.gridPreLanzamiento = new KendoGrid();
    this.gridPreLanzamiento.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario Anterior',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridPreLanzamiento.gridState = gridState;
    this.gridPreLanzamiento.resizable = true;
    this.gridPreLanzamiento.height = 690;
    this.gridPreLanzamiento.pageable = pageable;

    this.gridRN2 = new KendoGrid();
    this.gridRN2.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Actividad',
        field: 'ultimaFechaProgramada',
        width: 120,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario Anterior',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridRN2.gridState = {
      group: [],
      skip: 0,
      take: 10,
    };
    this.gridRN2.resizable = true;
    this.gridRN2.height = 690;
    this.gridRN2.pageable = pageable;

    //RN2A
    this.gridRN2A = new KendoGrid();
    this.gridRN2A.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Actividad',
        field: 'ultimaFechaProgramada',
        width: 120,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario Anterior',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridRN2A.gridState = {
      group: [],
      skip: 0,
      take: 10,
    };
    this.gridRN2A.resizable = true;
    this.gridRN2A.height = 690;
    this.gridRN2A.pageable = pageable;


    this.gridVentaCruzada = new KendoGrid();
    this.gridVentaCruzada.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario Anterior',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridVentaCruzada.gridState = gridState;
    this.gridVentaCruzada.resizable = true;
    this.gridVentaCruzada.height = 690;
    this.gridVentaCruzada.pageable = pageable;

    this.gridRealizadas = new KendoGrid();
    this.gridRealizadas.columns = [
      {
        title: 'Actividad',
        field: 'actividad',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Ocurrencia',
        field: 'ocurrencia',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Estado Ocurrencia',
        field: 'estado',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Estado Llamada',
        field: 'estadoLlamada',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Tiempo Integra',
        field: 'tiempoLlamadas',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Grabacion',
        field: 'nombreGrabacionTresCX',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Tiempo 3CX',
        field: 'nombreGrabacionTresCX',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Grabacion 3CX',
        field: 'nombreGrabacionTresCX',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha',
        field: 'fechaReal',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Comentario',
        field: 'comentario',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fase I.',
        field: 'faseInicial',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fase D.',
        field: 'faseMaxima',
        width: 160,
        headerClass: 'header-grid-integra',
      },
      {
        title: '# Llamadas Realizadas Fase I.',
        field: 'numeroLlamadas',
        width: 160,
        headerClass: 'header-grid-integra',
      },
    ];
    
    this.gridWhatsapp = new KendoGrid();
    this.gridWhatsapp.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Programada',
        field: 'ultimaFechaProgramada',
        width: 120,
        headerClass: 'header-grid-integra',
      },
      // {
      //   title: 'Dias S/C<br>(Act. Hoy)<br>Mañana',
      //   field: 'diasSinContactoManhana',
      //   width: 100,
      //   headerClass: 'header-grid-integra',
      // },
      // {
      //   title: 'Dias S/C<br>(Act. Hoy) Tarde',
      //   field: 'diasSinContactoTarde',
      //   width: 100,
      //   headerClass: 'header-grid-integra',
      // },
      {
        title: 'Mensaje',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridWhatsapp.gridState = gridState;
    this.gridWhatsapp.resizable = true;
    this.gridWhatsapp.height = 690;
    this.gridWhatsapp.pageable = pageable;



    this.gridCorreos = new KendoGrid();
    this.gridCorreos.columns = columns.concat([
      {
        title: 'Actividad',
        field: 'actividadCabecera',
        width: 220,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Contacto',
        field: 'contacto',
        width: 200,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Oportunidad',
        field: 'centroCosto',
        width: 350,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Fecha Programada',
        field: 'ultimaFechaProgramada',
        width: 120,
        headerClass: 'header-grid-integra',
      },
      // {
      //   title: 'Dias S/C<br>(Act. Hoy)<br>Mañana',
      //   field: 'diasSinContactoManhana',
      //   width: 100,
      //   headerClass: 'header-grid-integra',
      // },
      // {
      //   title: 'Dias S/C<br>(Act. Hoy) Tarde',
      //   field: 'diasSinContactoTarde',
      //   width: 100,
      //   headerClass: 'header-grid-integra',
      // },
      {
        title: 'Asunto',
        field: 'ultimoComentario',
        width: 150,
        headerClass: 'header-grid-integra',
      },
    ]);
    this.gridCorreos.gridState = gridState;
    this.gridCorreos.resizable = true;
    this.gridCorreos.height = 690;
    this.gridCorreos.pageable = pageable;


    



    this.gridRealizadas.gridState = gridState;
    this.gridRealizadas.resizable = true;
    this.gridRealizadas.height = 690;
    this.gridRealizadas.pageable = pageable;
    this.gridRealizadas.dataSourceType = 'gridView';

    this.gridRN2.getDataStateChance$().subscribe({
      next: (resp: any) => {
        let filtro;
        let page =
          (this.gridRN2.gridState.take + this.gridRN2.gridState.skip) /
          this.gridRN2.gridState.take;
        if (this.filtroFormularioTabRn2 != null) {
          let filtroTemp = this.filtroFormularioTabRn2.filtro;

          // const filtroTab = this.filtroFormularioTabRn2.filtro
          let asesores =
            filtroTemp.idAsesor != null && filtroTemp.idAsesor.trim() != ''
              ? filtroTemp.idAsesor
              : this._agendaService.idPersonal;
          this.filtroFormularioTabRn2;
          filtro = {
            take: String(this.gridRN2.gridState.take),
            skip: String(this.gridRN2.gridState.skip),
            page: String(page),
            pageSize: String(this.gridRN2.gridState.take),
            idEstado: filtroTemp.idEstado,
            idAlumno: filtroTemp?.idAlumno ? filtroTemp.idAlumno : '',
            idAsesor: asesores,
            idTipoDato: filtroTemp.idTipoDato,
            idOrigen: filtroTemp.idOrigen,
            idCentroCosto: filtroTemp?.idCentroCosto
              ? filtroTemp.idCentroCosto
              : '',
            idCategoriaOrigen: filtroTemp.idCategoriaOrigen,
            idProbabilidadRegistroPW: filtroTemp.idProbabilidadRegistroPW,
          };
        } else {
          filtro = {
            idAlumno: '',
            idAsesor: this._agendaService.idPersonal.toString(),
            take: String(this.gridRN2.gridState.take),
            skip: String(this.gridRN2.gridState.skip),
            page: String(page),
            pageSize: String(this.gridRN2.gridState.take),
          };
        }
        this._agendaService.agendaActividadesService.obtenerRN2(filtro);
      },
    });

    this.gridRN2A.getDataStateChance$().subscribe({
      next: (resp: any) => {
        let filtro;
        let page =
          (this.gridRN2A.gridState.take + this.gridRN2A.gridState.skip) /
          this.gridRN2A.gridState.take;
        if (this.filtroFormularioTabRn2A != null) {
          let filtroTemp = this.filtroFormularioTabRn2A.filtro;

          // const filtroTab = this.filtroFormularioTabRn2.filtro
          let asesores =
            filtroTemp.idAsesor != null && filtroTemp.idAsesor.trim() != ''
              ? filtroTemp.idAsesor
              : this._agendaService.idPersonal;
          this.filtroFormularioTabRn2A;
          filtro = {
            take: String(this.gridRN2A.gridState.take),
            skip: String(this.gridRN2A.gridState.skip),
            page: String(page),
            pageSize: String(this.gridRN2A.gridState.take),
            idEstado: filtroTemp.idEstado,
            idAlumno: filtroTemp?.idAlumno ? filtroTemp.idAlumno : '',
            idAsesor: asesores,
            idTipoDato: filtroTemp.idTipoDato,
            idOrigen: filtroTemp.idOrigen,
            idCentroCosto: filtroTemp?.idCentroCosto
              ? filtroTemp.idCentroCosto
              : '',
            idCategoriaOrigen: filtroTemp.idCategoriaOrigen,
            idProbabilidadRegistroPW: filtroTemp.idProbabilidadRegistroPW,
          };
        } else {
          filtro = {
            idAlumno: '',
            idAsesor: this._agendaService.idPersonal.toString(),
            take: String(this.gridRN2A.gridState.take),
            skip: String(this.gridRN2A.gridState.skip),
            page: String(page),
            pageSize: String(this.gridRN2A.gridState.take),
          };
        }
        this._agendaService.agendaActividadesService.obtenerRN2A(filtro);
      },
    });
    
    this._agendaService.agendaActividadesService.obtenerActividades();
    this._agendaService.agendaActividadesService.obtenerRN2({
      idAlumno: '',
      idAsesor: this._agendaService.idPersonal.toString(),
      skip: '0',
      page: '1',
      pageSize: String(
        this._agendaService.agendaInicializarService.gridRN2.gridState.take
      ),
      take: String(
        this._agendaService.agendaInicializarService.gridRN2.gridState.take
      ),
    });
    this._agendaService.agendaActividadesService.obtenerRN2A({
      idAlumno: '',
      idAsesor: this._agendaService.idPersonal.toString(),
      skip: '0',
      page: '1',
      pageSize: String(
        this._agendaService.agendaInicializarService.gridRN2A.gridState.take
      ),
      take: String(
        this._agendaService.agendaInicializarService.gridRN2A.gridState.take
      ),
    });
    this._agendaService.agendaActividadesService.obtenerWhatsapp(this._agendaService.idPersonal);
    this._agendaService.agendaActividadesService.obtenerCorreosComercial(this._agendaService.idPersonal);
  }
}

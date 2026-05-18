import { ModalContentEditarPostulanteComponent } from './modal-content-editar-postulante/modal-content-editar-postulante.component';
import { ModalContentAgregarPostulanteComponent } from './modal-content-agregar-postulante/modal-content-agregar-postulante.component';
import { DpWhatsappV2Component } from '../dp-whatsapp-v2/dp-whatsapp-v2.component';
import { Component, Injector, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import {
  ComboAreaFormacionExperiencia,
  ComboPostulante,
  DatosPostulante,
  IFiltroPostulanteObtener,
} from '@gestionPersonas/models/DatosPostulante';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { WhatsAppPostulanteV2Service } from '@gestionPersonas/services/whatsapp-postulante-v2.service';
import { AlertaService } from '@shared/services/alerta.service';
import { UserService } from '@shared/services/user.service';
import { constApiGestionPersonal } from '@environments/constApi';
import { ModalContentContactoComponent } from './modal-content-contacto/modal-content-contacto.component';
import { ModalContentImportExcelComponent } from './modal-content-import-excel/modal-content-import-excel.component';
import { ModalContentaGregarProcesoComponent } from './modal-contenta-gregar-proceso/modal-contenta-gregar-proceso.component';

@Component({
  selector: 'app-dp-tabla-postulante',
  templateUrl: './dp-tabla-postulante.component.html',
  styleUrls: ['./dp-tabla-postulante.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DpTablaPostulanteComponent implements OnInit, OnDestroy {
  //Seleccion
  mySelection: number[] = [];

  //ToolBar
  BtnBool = true;

  datosPostulante: DatosPostulante[];
  comboPostulante: ComboPostulante;
  comboAreaFormacionExperiencia: ComboAreaFormacionExperiencia;

  loadinGrid: boolean;
  loadingCambio: boolean = false;

  public pageSizeOptions: number[] = [5, 10, 20, 30, 50];
  //mySelection: number[];
  public filter: CompositeFilterDescriptor = {
    logic: 'and',
    filters: [],
  };

  public colorColumnasEstaticas: { [Key: string]: string } = {
    'border-left-width': '0',
    'background-color': '#4584a7',
    'text-align': 'center',
  };

  gridDatosPostulante: KendoGrid = new KendoGrid();

  /** Para limpiar las suscripciones SignalR al salir del módulo. */
  private readonly _destroy$ = new Subject<void>();

  /** Stack de notificaciones WhatsApp estilo card (top-center). */
  waNotificaciones: Array<{
    id: number;
    nombrePostulante: string;
    cuerpo: string;
    hora: string;
  }> = [];
  private _waNotifId = 0;
  /** Auto-dismiss tras 6s. */
  private static readonly WA_TOAST_TTL_MS = 6000;

  constructor(
    private _integraService: IntegraService,
    private _datosPostulanteService: DatosDelPostulanteService,
    private _alertaService: AlertaService,
    private _userService: UserService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _injector: Injector,
    private _whatsappV2: WhatsAppPostulanteV2Service
  ) {
    this._datosPostulanteService.getComboPostulante().subscribe({
      next: (data) => {
        this.comboPostulante = data;
        //console.log('asdsadasdkjasdjhasldkjhaslkdjhasdl');

        console.log(this.comboPostulante);
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
  }

  ngOnInit(): void {
    //this.ObtenerCombosPostulante();
    this.traerComboAreaFormacionExperiencia();
    this.cargargrilla();
    this.recargaDeDatos();
    this.obtenerPostulantesFiltroManual();

    // Hub WhatsApp V2: conectar al entrar al módulo GP para que el asesor reciba
    // notificaciones de mensajes entrantes (`AgregarMensaje`, `recargarHistorial`)
    // aun sin tener un chat abierto. `connect()` es idempotente: si ya está
    // conectado, no-op. Si el modal de chat se abre luego, no re-conecta.
    this._whatsappV2.connect().catch(() => {
      /* la UI degrada vía `hubConnected$`; no bloqueamos la grilla por esto */
    });

    // Toast estilo WhatsApp en top-center. El service ya filtra por
    // `idPostulanteActivo`: solo emite cuando el postulante NO es el actualmente
    // abierto (evita ruido cuando ya estás viendo el chat).
    this._whatsappV2.notificarMensaje$
      .pipe(takeUntil(this._destroy$))
      .subscribe((notif) => this.pushNotificacionWhatsApp(notif));
  }

  /**
   * Resuelve el nombre del postulante para el toast. Prefiere los datos de la
   * grilla (que ya viste/cargaste), cae al `waFrom` (número) como último recurso.
   */
  private resolverNombrePostulanteToast(
    idPostulante: number | null,
    waFrom: string | null
  ): string {
    if (idPostulante != null) {
      const dataView: any = this.gridDatosPostulante?.view;
      const data: DatosPostulante[] = Array.isArray(dataView)
        ? dataView
        : dataView?.data ?? [];
      const match = data.find((d) => d.idPostulante === idPostulante);
      if (match) {
        const partes = [
          match.nombre,
          match.apellidoPaterno,
          match.apellidoMaterno,
        ]
          .filter((s) => !!s && `${s}`.trim().length > 0)
          .join(' ')
          .trim();
        if (partes) return partes;
      }
    }
    return waFrom || 'Postulante';
  }

  /**
   * Convierte el `waBody` del evento SignalR en texto legible para el toast.
   * Si el body es una URL de blob (media), muestra el tipo de archivo en lugar
   * de la URL cruda.
   */
  private resolverCuerpoToast(
    waBody: string | null | undefined,
    waType?: string | null
  ): string {
    if (!waBody) return 'Nuevo mensaje recibido';
    // Si waType está disponible, usarlo directamente.
    if (waType) {
      const tipos: Record<string, string> = {
        image: '📷 Imagen',
        document: '📄 Documento',
        audio: '🎵 Audio',
        video: '🎬 Video',
        hsm: '📋 Plantilla',
        template: '📋 Plantilla',
      };
      return tipos[waType] ?? waBody;
    }
    // Heurística: si parece una URL → es media.
    if (/^https?:\/\//i.test(waBody.trim())) {
      return '📎 Multimedia';
    }
    return waBody;
  }

  /** Inserta una notificación en el stack y programa el auto-dismiss. */
  private pushNotificacionWhatsApp(notif: {
    waFrom?: string | null;
    idPostulante?: number | null;
    waBody?: string | null;
    waType?: string | null;
  } | null): void {
    if (!notif) return;
    const id = ++this._waNotifId;
    const item = {
      id,
      nombrePostulante: this.resolverNombrePostulanteToast(
        notif.idPostulante ?? null,
        notif.waFrom ?? null
      ),
      cuerpo: this.resolverCuerpoToast(notif.waBody, notif.waType),
      hora: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    this.waNotificaciones = [item, ...this.waNotificaciones];
    setTimeout(
      () => this.cerrarNotificacionWhatsApp(id),
      DpTablaPostulanteComponent.WA_TOAST_TTL_MS
    );
  }

  /** Botón X de la card. */
  cerrarNotificacionWhatsApp(id: number): void {
    this.waNotificaciones = this.waNotificaciones.filter((n) => n.id !== id);
  }

  /** trackBy para *ngFor del stack de notificaciones. */
  trackWaNotif(_idx: number, n: { id: number }): number {
    return n.id;
  }

  ngOnDestroy(): void {
    // Cerrar suscripciones y la conexión SignalR cuando el asesor sale del módulo.
    this._destroy$.next();
    this._destroy$.complete();
    this._whatsappV2.disconnect();
  }

  //comboAreaFormacionExperiencia: ComboAreaFormacionExperiencia;
  traerComboAreaFormacionExperiencia(){
    this._datosPostulanteService.getComboAreaFormacionExperiencia().subscribe({
      next: (data) => {
        this.comboAreaFormacionExperiencia = data;
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
  }


  //Para recargar los datos al insertar o actualizar
  recargaDeDatos() {
    this._datosPostulanteService.postulanteInsertado$.subscribe((success) => {
      if (success) {
        this.obtenerPostulantesFiltroManual();
      }
    });
    this._datosPostulanteService.cambioProceso$.subscribe((success) => {
      if (success) {
        this.obtenerPostulantesFiltroManual();
      }
    });
  }

  //Filtro
  onStateChange(event: any) {
    this.gridDatosPostulante.gridState = event;
    this.obtenerPostulantesFiltroManual();
  }

  //Controlar botones del ToolBar
  ControlarBotones() {
    if (this.mySelection.length > 0) {
      this.BtnBool = false;
    } else this.BtnBool = true;
  }

  //Función para llenar la columna de Tipo Doc...
  obtenerTipoDocumentoPorID(id: number) {
    //if (!this.comboPostulante) return 'Cargando...';
    const tipoDoc = this.comboPostulante?.documento?.find(
      (element) => element.id === id
    );
    return tipoDoc ? tipoDoc.nombre : 'Seleccion Tipo Documento';
  }

  //Función para llenar la columna de Pais...
  obtenerNombrePaisPorId(id: number) {
    const pais = this.comboPostulante?.pais?.find(
      (element) => element.id === id
    );
    return pais ? pais.nombre : 'Seleccione Pais';
  }

  //Función para llenar la columna de Ciudad...
  obtenerNombreCiudadPorId(id: number) {
    const ciudad = this.comboPostulante?.ciudad?.find(
      (element) => element.id === id
    );
    return ciudad ? ciudad.nombre : 'Seleccione Ciudad';
  }

  //Función para llenar la columna de Estado Prceos Seleccion...
  obtenerNombreEstadoProcesoSeleccionPorId(id: number) {
    const estadoPS = this.comboPostulante?.estadoProcesoSeleccion?.find(
      (element) => element.id === id
    );
    return estadoPS ? estadoPS.nombre : 'Seleccione Estado Proceso Seleccion';
  }

  //Función para llenar la columna de Etapa Prceos Seleccion...
  obtenerNombreEtapaProcesoSeleccionPorId(id: number) {
    const etapaPS = this.comboPostulante?.listaEtapasProcesoSeleccion?.find(
      (element) => element.id === id
    );
    return etapaPS ? etapaPS.nombre : 'Seleccione Etapa Proceso Seleccion';
  }

  //Función para llenar la columna de Estado Etapa Proceso Seleccion...
  obtenerNombreEstadoEtapaProcesoSeleccionPorId(id: number) {
    const estadoEtapaPS = this.comboPostulante?.listaEstadoEtapas?.find(
      (element) => element.id === id
    );
    return estadoEtapaPS ? estadoEtapaPS.nombre : 'Seleccione Estado Etapa';
  }

  //Función para llenar la columna de Estado Etapa Proceso Seleccion...
  obtenerNombreFactorDesaprobatorioPorId(id: number) {
    const estadoEtapaPS = this.comboPostulante?.listaEstadoEtapas?.find(
      (element) => element.id === id
    );
    return estadoEtapaPS ? estadoEtapaPS.nombre : 'Seleccione Estado Etapa';
  }

  //Función para llenar la columna de Potencial Prceos Seleccion...
  obtenerNombrePotencialProcesoSeleccionPorId(id: number) {
    const PotencialPS = this.comboPostulante?.listaNivelPotencial?.find(
      (element) => element.id === id
    );
    return PotencialPS ? PotencialPS.nombre : 'Seleccione Potencial';
  }

  //Función para llenar la columna de Proveedor...
  obtenerNombreProveedorPorId(id: number) {
    const provedor = this.comboPostulante?.listaProveedor?.find(
      (element) => element.id === id
    );
    return provedor ? provedor.nombre : 'Seleccione Proveedor';
  }

  //Función para llenar la columna de Operador...
  obtenerNombreOperadorPorId(id: number) {
    const operador = this.comboPostulante?.listaPersonal?.find(
      (element) => element.id === id
    );
    return operador ? operador.nombre : 'Seleccione Operador';
  }

  //Función para llenar la columna de Factor Desaprovatorio...
  //SE comento por peticion de GP
  // obtenerNombreFactorDesaprovatorioPorId(ids: string): string {
  //   const intArr = ids ? ids.split(',').map((id) => parseInt(id.trim())) : [];

  //   if (intArr.length === 0 || (intArr.length === 1 && isNaN(intArr[0]))) {
  //     return '<ul><li>Seleccione factor desaprobatorio</li></ul>';
  //   }

  //   let salida = intArr
  //     .map((id) => {
  //       const factor = this.comboPostulante?.listaRespuestaDesaprobatoria?.find(
  //         (element) => element.idRespuestaDesaprovatoria === id
  //       );
  //       return factor ? `<li>${factor.nombre}</li>` : null;
  //     })
  //     .filter((item) => item !== null)
  //     .join('');

  //   return salida
  //     ? `<ul>${salida}</ul>`
  //     : '<ul><li>Seleccione factor desaprobatorio</li></ul>';
  // }

  //Funcion para obtener codigo Nombre combocatoria...
  obtenerNombreCodigoCombocatoriaPorId(id: number) {
    const nombreCodComboc = this.comboPostulante?.listaCodigoConvocatoria?.find(
      (element) => element.idProcesoSeleccion === id
    );
    return nombreCodComboc
      ? nombreCodComboc.nombreConvocatoria
      : 'Seleccione Combocatoria';
  }
  /*
  //Alternativa a la funcion obtenerTipoDocumentoPorID() || fallo :(
  mapearTiposDocumento(): void {
    if (this.comboPostulante?.documento) {
      this.comboPostulante.documento.forEach(doc => {
        this.tipoDocumentoMap[doc.id] = doc.nombre;
      });
    }
  }
*/
  obtenerFiltroEnvio(): IFiltroPostulanteObtener {
    let gridState = this.gridDatosPostulante.gridState as any;

    let page = (gridState.take + gridState.skip) / gridState.take;

    let filter: any = {
      skip: gridState.skip,
      take: gridState.take,
      sort: gridState.sort,
    };
    if (gridState.filter != null) {
      let dataReporte: any[] = [];
      if (gridState.filter.filters.length > 0) {
        gridState.filter.filters.forEach((element: any) => {
          dataReporte.push({
            field: element.field,
            operator: element.operator,
            value: element.value,
          });
        });
      }
      filter.Filter = {
        Filters: dataReporte,
        logic: 'and',
      };
    }
    // // pasar todo al filtro
    //let filtro: IFiltroEnvioObtener
    let filtro: IFiltroPostulanteObtener = {
      paginador: {
        page: page,
        pageSize: gridState.take,
        skip: gridState.skip,
        take: gridState.take,
      },
      filtro: {
        idPostulante: 0,
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        nroDocumento: '',
        telefono: '',
        celular: '',
        email: '',
        idTipoDocumento: 0,
        idPais: 0,
        idCiudad: 0,
        idPostulanteProcesoSeleccion: 0,
        idEstadoProcesoSeleccion: 0,
        idProcesoSeleccion: 0,
        procesoSeleccion: '',
        fechaRendicionExamen: '2024-11-20T12:36:21.527',
        fechaEnvioAccesos: '2024-11-20T12:36:21.527',
        idPostulanteNivelPotencial: 0,
        idProveedor: 0,
        idPersonal_OperadorProceso: 0,
        idConvocatoriaPersonal: 0,
        idProcesoSeleccionEtapa: 0,
        idEstadoEtapaProcesoSeleccion: 0,
        esProcesoAnterior: false,
        idRespuestas: '',
        idSexo: 0,
        fechaNacimiento: '2024-11-20T12:36:21.527',
        tieneHijo: false,
        cantidadHijo: 0,
        urlPerfilFacebook: '',
        urlPerfilLinkedin: '',
        codigo: '',
        nombreCombocatoria: '',
        telefono2: '',
        celular2: '',
        celular3: '',
        email2: '',
        email3: '',
        edad: 0,
        idPersonalOperadorProceso: 0,
        idPaginaReclutadoraPersonal: 0,
      },
      filter: filter,
    };
    //console.log(filter)
    return filtro;
  }

  obtenerPostulantesFiltroManual() {
    //console.log(this.gridDatosPostulante.gridState.filter);
    this.gridDatosPostulante.loading = true;
    this._integraService
      .postJsonResponse(
        `${constApiGestionPersonal.ObtenerFiltroDatosPostulanteManual}`,
        JSON.stringify(this.obtenerFiltroEnvio())
      )
      .subscribe({
        next: (
          response: HttpResponse<{
            data: DatosPostulante[];
            total: number;
          }>
        ) => {
          console.log(response.body);
          this.gridDatosPostulante.view = response.body;
          this.gridDatosPostulante.loading = false;
          //console.log(this.gridDatosPostulante.gridState.filter);
        },
        error: (error) => {
          this._alertaService.mensajeError(error);
          this.gridDatosPostulante.loading = false;
        },
        complete: () => {},
      });
  }

  cargargrilla() {
    this.gridDatosPostulante.filterable = 'menu';
    this.gridDatosPostulante.resizable = true;
    this.gridDatosPostulante.sortable = true;
    this.gridDatosPostulante.gridState = {
      skip: 0,
      take: 10,
    };
    this.gridDatosPostulante.pageable = {
      buttonCount: 10,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
  }

  public filterChange(filter: CompositeFilterDescriptor): void {
    console.log(filter);
    this.filter = filter;
    this.obtenerPostulantesFiltroManual();
  }

  eliminarPostulante(idPostulante: number) {
    const usuario = this._userService.userData.userName;

    const JsonEliminar = {
      Id: idPostulante,
      NombreUsuario: usuario,
    };

    this._alertaService.mensajeEliminar().then((resultado) => {
      if (resultado.value) {
        console.log(`Se eliminara el postulante con id ${idPostulante}`);
        this._datosPostulanteService.eliminarPostulante(JsonEliminar);
      } else {
        console.log(`Ya no Se eliminara el postulante con id ${idPostulante}`);
      }
    });
  }

  abrirModalAgregarPostulante() {
    const modalRef = this._modalService.open(
      ModalContentAgregarPostulanteComponent,
      {
        size: 'xl',
        backdrop: 'static',
        keyboard: false,
      }
    );
    modalRef.componentInstance.datosPostulanteService =
      this._datosPostulanteService;
  }

  abrirModalEditarPostulante(postulante: DatosPostulante): void {
    this._datosPostulanteService.ObtenerPostulanteExperiencia(
      postulante.idPostulante
    );
    this._datosPostulanteService.ObtenerPostulanteFormacion(
      postulante.idPostulante
    );
    const modalRef = this._modalService.open(
      ModalContentEditarPostulanteComponent,
      {
        size: 'xl',
        backdrop: 'static',
        keyboard: false,
      }
    );
    modalRef.componentInstance.postulante = postulante;
    modalRef.componentInstance.datosPostulanteService =
      this._datosPostulanteService;
  }

  abrirModalContactoPostulante(id: number, tipoContacto: string): void;
  abrirModalContactoPostulante(lisId: number[], tipoContacto: string): void;

  abrirModalContactoPostulante(
    param: number | number[],
    tipoContacto: string
  ): void {
    // if (typeof param === 'number') {
    //   // Lógica para manejar un solo ID
    //   console.log(`Abriendo modal para el ID: ${param}`);
    // } else {
    //   // Lógica para manejar una lista de IDs
    //   console.log(`Abriendo modal para los IDs: ${param.join(', ')}`);
    // }
    const modalRef = this._modalService.open(ModalContentContactoComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.datosPostulanteService =
      this._datosPostulanteService;
    modalRef.componentInstance.tipoContacto = tipoContacto;
    modalRef.componentInstance.param = param;
  }

  abrirModalImportacionDePostulantes(): void {
    // if (typeof param === 'number') {
    //   // Lógica para manejar un solo ID
    //   console.log(`Abriendo modal para el ID: ${param}`);
    // } else {
    //   // Lógica para manejar una lista de IDs
    //   console.log(`Abriendo modal para los IDs: ${param.join(', ')}`);
    // }
    const modalRef = this._modalService.open(ModalContentImportExcelComponent, {
      size: 'xl',
      backdrop: 'static',
      keyboard: false,
    });
    modalRef.componentInstance.datosPostulanteService =
      this._datosPostulanteService;
  }

  abrirModalNuevoProcesoSeleccion(postulante: DatosPostulante) {
    const modalRef = this._modalService.open(
      ModalContentaGregarProcesoComponent,
      {
        size: 'lg',
        backdrop: 'static',
        keyboard: false,
      }
    );
    modalRef.componentInstance.datosPostulanteService =
      this._datosPostulanteService;
    modalRef.componentInstance.postulante = postulante;
  }

  /**
   * Abre el chat 1-a-1 de WhatsApp V2 contra el postulante de la fila.
   * El modal queda dueño del lifecycle del hub (idempotente) y de la UI
   * de mensajería. NO toca V1 (botón "Enviar Whatsapp" de la toolbar y
   * tab "Chat Whatsapp" del datos-postulante siguen funcionando).
   */
  abrirChatWhatsappV2(postulante: DatosPostulante): void {
    const nombre = [
      postulante?.nombre,
      postulante?.apellidoPaterno,
      postulante?.apellidoMaterno,
    ]
      .filter((s) => !!s && `${s}`.trim().length > 0)
      .join(' ')
      .trim();

    const modalRef = this._modalService.open(DpWhatsappV2Component, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      windowClass: 'wa-chat-modal',
      injector: this._injector,
    });
    modalRef.componentInstance.idPostulante = postulante?.idPostulante;
    modalRef.componentInstance.nombrePostulante = nombre || null;
    modalRef.componentInstance.idPais = postulante?.idPais ?? null;
    // El modal sanitiza internamente (solo dígitos). Pasamos crudo.
    modalRef.componentInstance.celular = postulante?.celular ?? null;
  }
}

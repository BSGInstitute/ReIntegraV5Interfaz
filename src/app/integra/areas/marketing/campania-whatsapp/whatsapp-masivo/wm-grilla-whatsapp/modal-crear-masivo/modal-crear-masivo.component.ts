import { Component, OnInit, OnDestroy, Inject, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '@shared/services/alerta.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { WhatsappMasivoOportunidadService } from '@marketing/services/whatsapp-masivo-oportunidad.service';
import { WhatsappFacebookService } from '@marketing/services/whatsapp-facebook.service';
import { LeadMasivoVM, MensajeChat, ResultadoCreacion, ExtraccionBatchRequest, ExtraccionMensaje, CalificacionLlamadaRequest, CalificacionLeadPayload, HistorialOportunidadMasivo } from '../../models/modal-masivo';
import { ChatWhatsAppMarketing } from '../../models/chat-whatsapp-marketing';
import { Combo } from '../../models/combo- modulo-whatsapp';
import { forkJoin, interval, Subscription } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { IntegraService } from '@shared/services/integra.service';
import { constApiMarketing } from '@environments/constApi';
import { WhatsAppMensajeArchivoCom } from '@comercial/models/interfaces/iagenda-historial-chat';

@Component({
  selector: 'app-modal-crear-masivo',
  templateUrl: './modal-crear-masivo.component.html',
  styleUrls: ['./modal-crear-masivo.component.scss'],
})
export class ModalCrearMasivoComponent implements OnInit, OnDestroy {

  constructor(
    public dialogRef: MatDialogRef<ModalCrearMasivoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChatWhatsAppMarketing[],
    private service: WhatsappMasivoOportunidadService,
    private alertaService: AlertaService,
    private cdr: ChangeDetectorRef,
    private whatsappFacebookService: WhatsappFacebookService,
    private integraService: IntegraService
  ) {}

  // Estado general
  loader = false;
  loadingPrecarga = true;
  creandoOportunidades = false;
  refreshando = false;
  progresoActual = 0;
  progresoTotal = 0;
  progresoNombreActual = '';

  // Catalogos
  listaCombosAtributos: any = {};
  listaAsesores: Combo[] = [];
  listaOrigen: Combo[] = [];
  listaPlantillas: any[] = [];

  // Leads
  leads: LeadMasivoVM[] = [];

  // Asesor masivo
  asesorMasivoId: number | null = null;

  // Plantilla masiva
  plantillaMasivaId: number | null = null;

  // Resultados creacion
  resultados: ResultadoCreacion[] = [];
  mostrarResultados = false;

  // Kendo filter
  filterSettings: DropDownFilterSettings = { caseSensitive: false, operator: 'contains' };

  // Inputs ocultos para archivo/imagen masivos
  @ViewChild('inputArchivoMasivo') inputArchivoMasivo!: ElementRef;
  @ViewChild('inputImagenMasiva') inputImagenMasiva!: ElementRef;

  archivoMasivoSeleccionado: File | null = null;
  imagenMasivaSeleccionada: File | null = null;

  archivoMasivoStaged: { url: string; nombre: string; tipo: 'doc' | 'img' } | null = null;
  enviandoMensajes = false;

  // Estado extraccion IA
  procesandoIA = false;
  iaProgreso = { completados: 0, total: 0 };
  private _iaPollingSubscription: Subscription | null = null;

  // Estado calificacion IA
  procesandoCalificacion = false;
  calificacionProgreso = { completados: 0, total: 0 };
  private _calificacionPollingSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  // Getters de contadores
  get totalActivos(): number {
    return this.leads.filter(l => l.seleccionado && !l.excluido).length;
  }

  get totalExcluidos(): number {
    return this.leads.filter(l => l.excluido || !l.seleccionado).length;
  }

  get totalConCamposCompletos(): number {
    return this.leads.filter(l =>
      l.seleccionado && !l.excluido &&
      l.idCentroCosto && l.idOrigen && l.idAsesor
    ).length;
  }

  get puedeCrear(): boolean {
    return this.totalConCamposCompletos > 0 && !this.creandoOportunidades;
  }

  cargarCatalogos(): void {
    forkJoin({
      combos: this.service.obtenerCombosAtributosAlumno(),
      asesores: this.service.obtenerPersonalOportunidad(),
      origen: this.service.obtenerOrigenCombo(),
      plantillas: this.service.obtenerComboRespuestaWhatsApp(),
    }).subscribe({
      next: (res) => {
        this.listaCombosAtributos = res.combos.body || {};
        this.listaAsesores = res.asesores.body || [];
        this.listaOrigen = res.origen.body || [];
        this.listaPlantillas = res.plantillas.body?.idPlantilla || [];
        this.precargarLeads();
      },
      error: () => {
        this.alertaService.swalFireOptions({ icon: 'error', title: 'Error al cargar catalogos' });
        this.loadingPrecarga = false;
      }
    });
  }

  precargarLeads(): void {
    const idsAlumno = this.data.map(d => d.idAlumno);
    const celulares = this.data.map(d => d.celular);   // celular ya tiene prefijo de país (ej: 5218119932463)
    this.service.obtenerDatosPreCargaMasiva({ idsAlumno, celulares, horasAtras: 48 }).subscribe({
      next: (response: HttpResponse<any>) => {
        const datos = response.body || [];
        this.leads = this.data.map(item => {
          const cargado = datos.find((d: any) => d.idAlumno === item.idAlumno);
          return this.mapearLeadVM(item, cargado);
        });
        this.resolverTextoCentroCosto();
        // Cargar historial de oportunidades V2 para cada lead (fire-and-forget)
        this.leads.forEach(lead => this._cargarHistorialLead(lead));
        this.loadingPrecarga = false;
        this.cdr.detectChanges();
      },
      error: () => {
        // Si el endpoint no existe aun (404), igual construimos los leads con datos basicos
        this.leads = this.data.map(item => this.mapearLeadVM(item, null));
        // Cargar historial de oportunidades V2 para cada lead (fire-and-forget)
        this.leads.forEach(lead => this._cargarHistorialLead(lead));
        this.loadingPrecarga = false;
        this.cdr.detectChanges();
      }
    });
  }

  /** Refresca SOLO mensajes, historial y fechaUltimaCaptura de los leads actuales.
   *  Conserva toda la configuracion del usuario (CC, Origen, Asesor, perfilConfirmado,
   *  iaDatosExtraidos, calificacionResultado, seleccionado, excluido, etc.). */
  refrescarLeads(): void {
    if (!this.leads.length) return;
    this.refreshando = true;
    const idsAlumno = this.leads.map(l => l.idAlumno);
    const celulares = this.leads.map(l => l.celular);
    this.service.obtenerDatosPreCargaMasiva({ idsAlumno, celulares, horasAtras: 48 }).subscribe({
      next: (response: HttpResponse<any>) => {
        const datos = response.body || [];
        datos.forEach((resultado: any) => {
          const lead = this.leads.find(l => l.idAlumno === resultado.idAlumno);
          if (!lead) return;
          lead.mensajes = (resultado.mensajes || []).map((m: any): MensajeChat => ({
            tipoMensaje:      m.tipoMensaje      ?? m.TipoMensaje      ?? 1,
            mensajeHtml:      m.mensajeHtml      ?? m.MensajeHtml      ?? '',
            waType:           m.waType           ?? m.WaType,
            archivo:          m.archivo          ?? m.Archivo,
            nombreArchivo:    m.nombreArchivo    ?? m.NombreArchivo,
            fechaMensaje:     m.fechaMensaje     ?? m.FechaMensaje     ?? '',
            personalFiltrado: m.personalFiltrado ?? m.PersonalFiltrado ?? ''
          }));
          lead.fechaUltimaCaptura = resultado.fechaUltimaCaptura
            ? new Date(resultado.fechaUltimaCaptura)
            : lead.fechaUltimaCaptura;
        });
        // Refrescar historial de oportunidades V2 para cada lead (fire-and-forget)
        this.leads.forEach(lead => this._cargarHistorialLead(lead));
        this.refreshando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.refreshando = false;
        this.cdr.detectChanges();
      }
    });
  }

  /** Para cada lead con idCentroCosto pre-cargado pero sin nombre resuelto,
   *  llama al autocomplete como fallback para poblar centroCostoItems.
   *  Normalmente el backend ya incluye NombreCentroCosto en la precarga,
   *  por lo que este método solo actúa en casos edge (ej: datos migrados). */
  private resolverTextoCentroCosto(): void {
    this.leads.forEach(lead => {
      // Si el backend ya resolvió el nombre, no hace falta llamar al autocomplete
      if (!lead.idCentroCosto || lead.centroCostoItems.length > 0) return;

      // Fallback: buscar por nombre usando el ID — esto puede no devolver resultados
      // si el autocomplete busca por texto de nombre, no por ID numérico.
      // Este bloque queda como safety net pero NO es el flujo principal.
      this.cdr.detectChanges();
    });
  }

  /** Carga el historial de oportunidades V2 para un lead individual. */
  private _cargarHistorialLead(lead: LeadMasivoVM): void {
    if (!lead.idAlumno) return;
    this.service.obtenerHistorialOportunidades(lead.idAlumno)
      .subscribe({
        next: (response: HttpResponse<HistorialOportunidadMasivo[]>) => {
          lead.historialOportunidadesV2 = response.body || [];
          this.cdr.detectChanges();
        },
        error: () => {
          lead.historialOportunidadesV2 = [];
        }
      });
  }

  /** Llamado por (filterChange) del kendo-combobox de CC en cada card. */
  buscarCentroCosto(valor: string, lead: LeadMasivoVM): void {
    if (!valor || valor.trim().length < 2) return;
    this.service.obtenerCentroCostoAutocomplete(valor.trim()).subscribe({
      next: (res: HttpResponse<any>) => {
        lead.centroCostoItems = res.body || [];
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  mapearLeadVM(item: ChatWhatsAppMarketing, cargado: any): LeadMasivoVM {
    return {
      idAlumno: item.idAlumno,
      celular: item.celular,
      celularCompleto: item.numeroWhatsApp ?? item.celular,
      nombre: cargado?.alumno?.nombre1 || (cargado?.alumno as any)?.Nombre1 || item.alumno,
      apellidoPaterno: cargado?.alumno?.apellidoPaterno || (cargado?.alumno as any)?.ApellidoPaterno || '',
      pais: item.pais || '',
      idPaisEmpresa: item.idPaisEmpresa || 51,
      email: cargado?.alumno?.email1 || '',
      seleccionado: true,
      expandido: false,
      excluido: false,
      mensajes: (cargado?.mensajes || []).map((m: any): MensajeChat => ({
        tipoMensaje: m.tipoMensaje ?? m.TipoMensaje ?? 1,
        mensajeHtml: m.mensajeHtml ?? m.MensajeHtml ?? '',
        waType:         m.waType         ?? m.WaType,
        archivo:        m.archivo        ?? m.Archivo,
        nombreArchivo:  m.nombreArchivo  ?? m.NombreArchivo,
        fechaMensaje:   m.fechaMensaje   ?? m.FechaMensaje ?? '',
        personalFiltrado: m.personalFiltrado ?? m.PersonalFiltrado ?? ''
      })),
      historialOportunidades: cargado?.historialOportunidades || [],
      cargo: cargado?.alumno?.idCargo || null,
      areaFormacion: cargado?.alumno?.idAFormacion || null,
      areaTrabajo: cargado?.alumno?.idATrabajo || null,
      industria: cargado?.alumno?.idIndustria || null,
      perfilModificado: false,
      perfilConfirmado: false,
      idCentroCosto: cargado?.idCentroCosto ?? null,
      centroCostoItems: (cargado?.idCentroCosto && cargado?.nombreCentroCosto)
        ? [{ id: cargado.idCentroCosto, nombre: cargado.nombreCentroCosto }]
        : [],
      idOrigen: null,
      idAsesor: 125,
      asesorTocadoIndividualmente: false,
      horario: '',
      activo: true,
      badgeCalificacion: null,
      fechaUltimaCaptura: cargado?.fechaUltimaCaptura ? new Date(cargado.fechaUltimaCaptura) : null,
      oportunidadCreada: false,
      idOportunidadCreada: null,
      errorCreacion: null,
      mostrarInputManual: false,
      mensajeManual: '',
      idPlantillaIndividual: null,
    };
  }

  // Acciones sobre cards
  toggleExpand(lead: LeadMasivoVM): void {
    lead.expandido = !lead.expandido;
  }

  toggleSeleccion(lead: LeadMasivoVM): void {
    if (lead.excluido) return;
    lead.seleccionado = !lead.seleccionado;
  }

  excluirLead(lead: LeadMasivoVM): void {
    lead.excluido = true;
    lead.seleccionado = false;
  }

  reincluirLead(lead: LeadMasivoVM): void {
    lead.excluido = false;
    lead.seleccionado = true;
  }

  onPerfilCambiado(lead: LeadMasivoVM): void {
    lead.perfilModificado = true;
    lead.perfilConfirmado = false;
  }

  onAsesorIndividualCambiado(lead: LeadMasivoVM): void {
    lead.asesorTocadoIndividualmente = true;
  }

  // Asesor masivo
  aplicarAsesorMasivo(): void {
    if (!this.asesorMasivoId) return;
    this.leads
      .filter(l => l.seleccionado && !l.excluido && !l.asesorTocadoIndividualmente)
      .forEach(l => { l.idAsesor = this.asesorMasivoId; });
  }

  // Confirmar perfiles
  confirmarPerfilesMasivo(): void {
    const modificados = this.leads.filter(
      l => l.seleccionado && !l.excluido && l.perfilModificado && !l.perfilConfirmado
    );
    if (modificados.length === 0) {
      this.alertaService.swalFireOptions({ icon: 'info', title: 'Sin cambios de perfil que guardar' });
      return;
    }
    const payload = modificados.map(l => ({
      id: l.idAlumno,
      idCargo: l.cargo,
      idAFormacion: l.areaFormacion,
      idATrabajo: l.areaTrabajo,
      idIndustria: l.industria,
      nombre1: l.iaNombreAceptado && l.iaDatosExtraidos?.nombre?.value
        ? l.iaDatosExtraidos.nombre.value
        : null,
      apellidoPaterno: l.iaApellidoAceptado && l.iaDatosExtraidos?.apellido?.value
        ? l.iaDatosExtraidos.apellido.value
        : null,
      email2: l.iaEmailAceptado && l.iaDatosExtraidos?.email?.value
        ? l.iaDatosExtraidos.email.value
        : null,
    }));
    this.loader = true;
    this.service.actualizarDatosAlumnoMasivo(payload as any).subscribe({
      next: () => {
        modificados.forEach(l => { l.perfilConfirmado = true; l.perfilModificado = false; });
        this.alertaService.swalFireOptions({ icon: 'success', title: `${modificados.length} perfiles actualizados` });
      },
      error: () => {
        this.alertaService.swalFireOptions({ icon: 'error', title: 'Error al actualizar perfiles', text: 'El endpoint aun no existe en el backend' });
      },
      complete: () => { this.loader = false; }
    });
  }

  // Ejecutar todos los envíos staged al presionar "Enviar seleccionados"
  async ejecutarEnviosSeleccionados(): Promise<void> {
    const seleccionados = this.leads.filter(l => l.seleccionado && !l.excluido);
    if (seleccionados.length === 0) {
      this.alertaService.swalFireOptions({ icon: 'info', title: 'No hay leads seleccionados' });
      return;
    }

    this.enviandoMensajes = true;
    this.loader = true;
    let totalEnviados = 0;

    try {
      // 1. Plantilla masiva → todos los seleccionados
      if (this.plantillaMasivaId) {
        const primerLead = seleccionados[0];
        const payloadMasivo = {
          idPlantilla: this.plantillaMasivaId,
          listaAlumnos: seleccionados.map(l => ({
            idAlumno: l.idAlumno,
            celularWhatsApp: l.celular,
          }))
        };
        await this.service.enviarPlantillaMasiva(payloadMasivo).toPromise();
        totalEnviados += seleccionados.length;
      }

      // 2. Archivo masivo → todos los seleccionados
      if (this.archivoMasivoStaged) {
        const staged = this.archivoMasivoStaged;
        await this.enviarArchivoMasivoALeads(seleccionados, staged.url, staged.tipo, staged.nombre);
        this.archivoMasivoStaged = null;
        totalEnviados += seleccionados.length;
      }

      // 3. Envíos individuales por lead
      const enviosFallidos: { nombre: string; celular: string; motivo: string }[] = [];

      for (const lead of seleccionados) {
        // 3a. Plantilla individual confirmada
        if (lead.plantillaPendiente && lead.idPlantillaIndividual) {
          try {
            const payload = {
              idPlantilla: lead.idPlantillaIndividual,
              idCentroCosto: lead.idCentroCosto ?? null,
              celularWhatsApp: lead.celular,
              idPais: lead.idPaisEmpresa,
              idAlumno: lead.idAlumno,
              idPersonal: lead.idAsesor ?? 0,
              usuario: '',
            };
            await this.integraService.postJsonResponse(constApiMarketing.EnvioPlantillas, payload).toPromise();
            lead.plantillaPendiente = false;
            lead.idPlantillaIndividual = null;
            totalEnviados++;
          } catch (err: any) {
            enviosFallidos.push({ nombre: lead.nombre, celular: lead.celular, motivo: err?.message || 'Error al enviar' });
          }
        }

        // 3b. Archivo individual staged
        if (lead.archivoStagedUrl) {
          try {
            const waType = lead.archivoStagedTipo === 'img' ? 'image' : 'document';
            const obj: WhatsAppMensajeArchivoCom = {
              waTo: lead.celular,
              waType,
              waLink: lead.archivoStagedUrl,
              waFileName: lead.archivoStagedNombre ?? '',
              idPais: lead.idPaisEmpresa,
              idAlumno: lead.idAlumno,
              idPersonal: lead.idAsesor ?? 0,
            };
            await this.whatsappFacebookService.enviarMensajeApigraphWhatsappArchivo$(obj).toPromise();
            lead.archivoStagedUrl = undefined;
            lead.archivoStagedNombre = undefined;
            lead.archivoStagedTipo = undefined;
            totalEnviados++;
          } catch (err: any) {
            enviosFallidos.push({ nombre: lead.nombre, celular: lead.celular, motivo: err?.message || 'Error al enviar' });
          }
        }

        // 3c. Mensaje manual pendiente
        if (lead.mensajePendiente?.trim()) {
          try {
            const payload = {
              celularWhatsApp: lead.celular,
              mensaje: lead.mensajePendiente,
              idPais: lead.idPaisEmpresa,
              idAlumno: lead.idAlumno,
              idPersonal: lead.idAsesor ?? 0,
              usuario: '',
            };
            await this.integraService.postJsonResponse(constApiMarketing.EnvioMensaje, payload).toPromise();
            lead.mensajePendiente = undefined;
            totalEnviados++;
          } catch (err: any) {
            enviosFallidos.push({ nombre: lead.nombre, celular: lead.celular, motivo: err?.message || 'Error al enviar' });
          }
        }
      }

      if (enviosFallidos.length > 0) {
        const filas = enviosFallidos
          .map(f => `<tr><td style="padding:4px 8px">${f.nombre}</td><td style="padding:4px 8px">${f.celular}</td><td style="padding:4px 8px">${f.motivo}</td></tr>`)
          .join('');
        const html = `<table style="width:100%;border-collapse:collapse;font-size:13px">
          <thead><tr style="background:#f5f5f5">
            <th style="padding:4px 8px;text-align:left">Nombre</th>
            <th style="padding:4px 8px;text-align:left">Celular</th>
            <th style="padding:4px 8px;text-align:left">Motivo</th>
          </tr></thead>
          <tbody>${filas}</tbody>
        </table>`;
        this.alertaService.swalFireOptions({ icon: 'warning', title: 'Algunos envíos fallaron', html });
      }

      if (totalEnviados > 0) {
        this.alertaService.swalFireOptions({ icon: 'success', title: `${totalEnviados} envíos completados` });
      } else {
        this.alertaService.swalFireOptions({
          icon: 'info',
          title: 'No había envíos configurados',
          text: 'Seleccioná una plantilla, cargá un archivo o escribí un mensaje primero.'
        });
      }

    } catch (err) {
      this.alertaService.swalFireOptions({ icon: 'error', title: 'Error durante los envíos' });
    } finally {
      this.enviandoMensajes = false;
      this.loader = false;
    }
  }

  // Validar antes de crear
  validarLeads(): { validos: LeadMasivoVM[]; invalidos: { lead: LeadMasivoVM; campos: string[] }[] } {
    const activos = this.leads.filter(l => l.seleccionado && !l.excluido && !l.oportunidadCreada);
    const validos: LeadMasivoVM[] = [];
    const invalidos: { lead: LeadMasivoVM; campos: string[] }[] = [];

    activos.forEach(l => {
      const camposFaltantes: string[] = [];
      if (!l.idCentroCosto) camposFaltantes.push('Centro de Costo');
      if (!l.idOrigen) camposFaltantes.push('Origen');
      if (!l.idAsesor) camposFaltantes.push('Asesor');
      if (camposFaltantes.length > 0) invalidos.push({ lead: l, campos: camposFaltantes });
      else validos.push(l);
    });

    return { validos, invalidos };
  }

  // Crear oportunidades (loop secuencial)
  async iniciarCreacionMasiva(): Promise<void> {
    const { validos, invalidos } = this.validarLeads();

    if (invalidos.length > 0) {
      const detalle = invalidos.map(i => `${i.lead.nombre}: falta ${i.campos.join(', ')}`).join('\n');
      this.alertaService.swalFireOptions({
        icon: 'warning',
        title: `${invalidos.length} lead(s) incompletos`,
        text: detalle
      });
      return;
    }

    if (validos.length === 0) {
      this.alertaService.swalFireOptions({ icon: 'info', title: 'No hay leads para crear' });
      return;
    }

    this.creandoOportunidades = true;
    this.progresoTotal = validos.length;
    this.progresoActual = 0;
    this.resultados = [];

    for (const lead of validos) {
      this.progresoActual++;
      this.progresoNombreActual = lead.nombre;
      this.cdr.detectChanges();

      try {
        await this.crearOportunidadLead(lead);
      } catch (e) {
        lead.errorCreacion = 'Error inesperado';
        this.resultados.push({ idAlumno: lead.idAlumno, nombre: lead.nombre, exito: false, error: 'Error inesperado' });
      }
    }

    this.creandoOportunidades = false;
    this.mostrarResultados = true;
    this.cdr.detectChanges();
  }

  private crearOportunidadLead(lead: LeadMasivoVM): Promise<void> {
    return new Promise((resolve) => {
      this.service.crearOportunidadWhatsapp({
        idAlumno: lead.idAlumno,
        idCentroCosto: lead.idCentroCosto!,
        idPersonalAsignado: lead.idAsesor!,
        activo: lead.activo,
        idOrigen: lead.idOrigen!,
      }).subscribe({
        next: (response: HttpResponse<any>) => {
          const idOportunidad = Number(response.body);
          lead.oportunidadCreada = true;
          lead.idOportunidadCreada = idOportunidad;
          lead.errorCreacion = null;
          this.resultados.push({ idAlumno: lead.idAlumno, nombre: lead.nombre, exito: true, idOportunidad });
          // Sumar contador oportunidad
          this.service.sumaOportunidad({ IdAlumno: lead.idAlumno, CelularWhatsApp: lead.celularCompleto }).subscribe();
          // Validar probabilidad oportunidades (fire-and-forget — igual que flujo unitario)
          this.service.obtenerProgramaPorOportunidadWhatsapp(idOportunidad).subscribe({
            next: (progResponse: HttpResponse<any>) => {
              if (progResponse.body && progResponse.body.length > 0) {
                const programaData = progResponse.body[0];
                this.service.validarProbabilidadOportunidades({
                  IdOportunidad: programaData.idOportunidad,
                  IdAlumno: programaData.idAlumno,
                  IdClasificacionPersona: programaData.idClasificacionPersona,
                  IdArea: programaData.idArea,
                  IdPGeneral: programaData.idPGeneral,
                }).subscribe();
              }
            },
            error: () => {}
          });
        },
        error: (err) => {
          lead.errorCreacion = err?.error || 'Error al crear';
          this.resultados.push({ idAlumno: lead.idAlumno, nombre: lead.nombre, exito: false, error: lead.errorCreacion! });
          resolve();
        },
        complete: () => resolve()
      });
    });
  }

  // Respuesta individual — archivos
  abrirSelectorArchivo(lead: LeadMasivoVM, tipo: 'doc' | 'img'): void {
    const id = tipo === 'doc' ? `inputDoc_${lead.idAlumno}` : `inputImg_${lead.idAlumno}`;
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) { input.value = ''; input.click(); }
  }

  onArchivoSeleccionado(event: Event, lead: LeadMasivoVM, tipo: 'doc' | 'img'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) { return; }
    const archivo = input.files[0];

    // Validar tamaño
    const maxBytes = tipo === 'img' ? 5 * 1024 * 1024 : 16 * 1024 * 1024;
    if (archivo.size > maxBytes) {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        title: `El archivo supera el limite de ${tipo === 'img' ? '5MB' : '16MB'}`,
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', archivo);

    this.loader = true;
    this.whatsappFacebookService.adjuntarArchivoChatWhatsapp$(formData).subscribe({
      next: (resp: any) => {
        if (resp.resultado === 'Error') {
          this.alertaService.swalFireOptions({ icon: 'error', title: 'Error al subir el archivo' });
          this.loader = false;
          return;
        }
        lead.archivoStagedUrl = resp.urlArchivo;
        lead.archivoStagedNombre = resp.nombreArchivo;
        lead.archivoStagedTipo = tipo;
        this.loader = false;
      },
      error: (err) => {
        this.alertaService.swalFireOptions({ icon: 'error', title: 'Error al subir el archivo', text: err?.error });
        this.loader = false;
      },
    });
  }

  // Respuesta individual — mensaje manual
  toggleMensajeManual(lead: LeadMasivoVM): void {
    lead.mostrarInputManual = !lead.mostrarInputManual;
    if (!lead.mostrarInputManual) { lead.mensajeManual = ''; }
  }

  enviarMensajeManual(lead: LeadMasivoVM): void {
    if (!lead.mensajeManual?.trim()) { return; }
    lead.mensajePendiente = lead.mensajeManual.trim();
    lead.mensajeManual = '';
    lead.mostrarInputManual = false;
    // No HTTP — se enviará al presionar "Enviar seleccionados"
  }

  // Respuesta individual — plantilla
  enviarPlantillaIndividual(lead: LeadMasivoVM): void {
    if (!lead.idPlantillaIndividual) {
      this.alertaService.swalFireOptions({ icon: 'warning', title: 'Seleccioná una plantilla primero' });
      return;
    }
    lead.plantillaPendiente = true;
    // No HTTP — se enviará al presionar "Enviar seleccionados"
  }

  // Archivo/Imagen masivos (toolbar)
  abrirSelectorArchivoMasivo(): void {
    this.inputArchivoMasivo.nativeElement.click();
  }

  abrirSelectorImagenMasiva(): void {
    this.inputImagenMasiva.nativeElement.click();
  }

  onArchivoMasivoSeleccionado(event: Event, tipo: 'doc' | 'img'): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    const archivo = input.files[0];
    const maxSize = tipo === 'img' ? 5 * 1024 * 1024 : 16 * 1024 * 1024;
    if (archivo.size > maxSize) {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        title: tipo === 'img' ? 'Imagen maxima 5MB' : 'Archivo maximo 16MB'
      });
      return;
    }
    const seleccionados = this.leads.filter(l => l.seleccionado && !l.excluido);
    if (seleccionados.length === 0) {
      this.alertaService.swalFireOptions({ icon: 'warning', title: 'No hay leads seleccionados' });
      return;
    }
    this.loader = true;
    const formData = new FormData();
    formData.append('file', archivo);
    this.whatsappFacebookService.adjuntarArchivoChatWhatsapp$(formData).subscribe({
      next: (resp: any) => {
        if (resp.resultado === 'Error') {
          this.loader = false;
          this.alertaService.swalFireOptions({ icon: 'error', title: 'Error al subir el archivo' });
          return;
        }
        this.archivoMasivoStaged = { url: resp.urlArchivo, nombre: resp.nombreArchivo, tipo };
        this.loader = false;
        this.alertaService.swalFireOptions({
          icon: 'info',
          title: `${tipo === 'img' ? 'Imagen' : 'Archivo'} cargado`,
          text: 'Presioná "Enviar seleccionados" para enviar a los leads.'
        });
      },
      error: () => {
        this.loader = false;
        this.alertaService.swalFireOptions({ icon: 'error', title: 'Error al subir el archivo' });
      }
    });
    input.value = '';
  }

  private enviarArchivoMasivoALeads(leads: LeadMasivoVM[], urlArchivo: string, tipo: 'doc' | 'img', nombreArchivo: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const waType = tipo === 'img' ? 'image' : 'document';
      let index = 0;
      const enviarSiguiente = () => {
        if (index >= leads.length) {
          resolve();
          return;
        }
        const lead = leads[index];
        const obj: WhatsAppMensajeArchivoCom = {
          waTo: lead.celular,
          waType,
          waLink: urlArchivo,
          waFileName: nombreArchivo,
          idPais: lead.idPaisEmpresa,
          idAlumno: lead.idAlumno,
          idPersonal: lead.idAsesor ?? 0,
        };
        this.whatsappFacebookService.enviarMensajeApigraphWhatsappArchivo$(obj).subscribe({
          next: () => { index++; enviarSiguiente(); },
          error: () => { index++; enviarSiguiente(); }
        });
      };
      enviarSiguiente();
    });
  }

  ngOnDestroy(): void {
    this._iaPollingSubscription?.unsubscribe();
    this._calificacionPollingSubscription?.unsubscribe();
  }

  // ---------------------------------------------------------------------------
  // Extraccion IA
  // ---------------------------------------------------------------------------

  private getPaisCode(idPais: number): string {
    const map: Record<number, string> = { 51: 'PE', 52: 'MX', 57: 'CO', 54: 'AR' };
    return map[idPais] || 'PE';
  }

  private mapearMensajesParaIA(lead: LeadMasivoVM): any[] {
    return (lead.mensajes || [])
      .slice() // no mutar el array original
      .sort((a, b) => {
        const fa = a.fechaMensaje ? new Date(a.fechaMensaje).getTime() : 0;
        const fb = b.fechaMensaje ? new Date(b.fechaMensaje).getTime() : 0;
        return fa - fb;
      })
      .filter(m => m.tipoMensaje === 1 || m.tipoMensaje === 2)
      .map(m => ({
        Role: m.tipoMensaje === 2 ? 'agent' : 'lead',
        Content: m.mensajeHtml || '',
        Timestamp: m.fechaMensaje || undefined
      }));
  }

  async capturarDatosIA(): Promise<void> {
    const seleccionados = this.leads.filter(l => l.seleccionado && l.iaEstado !== 'completado');
    if (!seleccionados.length) return;

    this.procesandoIA = true;
    seleccionados.forEach(l => l.iaEstado = 'procesando');
    this.iaProgreso = { completados: 0, total: seleccionados.length };

    const payload: any = {
      TenantId: 'BSG_PERU',
      Conversations: seleccionados.map(lead => {
        const mensajesOrdenados = this.mapearMensajesParaIA(lead);
        return {
          ConvId: '+' + lead.celular,
          AgentId: lead.idAsesor?.toString() || '125',
          Channel: 'whatsapp',
          Pais: this.getPaisCode(lead.idPaisEmpresa || 51),
          ChatDatetime: mensajesOrdenados.length > 0 ? mensajesOrdenados[0].Timestamp : new Date().toISOString(),
          Messages: mensajesOrdenados
        };
      })
    };

    try {
      const httpResp = await this.service.iniciarExtraccionBatch(payload).toPromise();
      console.log('[IA] Response completo:', JSON.stringify(httpResp?.body));
      const call_id: string | undefined = httpResp?.body?.call_id ?? (httpResp?.body as any)?.data?.call_id;
      console.log('[IA] call_id extraído:', call_id, typeof call_id);
      if (!call_id) {
        console.error('call_id no encontrado en la respuesta de extraccion. Estructura:', httpResp?.body);
        seleccionados.forEach(l => l.iaEstado = 'error');
        this.procesandoIA = false;
        return;
      }
      this._iniciarPollingExtraccion(call_id, seleccionados);
    } catch (err) {
      console.error('Error al iniciar extraccion IA', err);
      seleccionados.forEach(l => l.iaEstado = 'error');
      this.procesandoIA = false;
    }
  }

  private _iniciarPollingExtraccion(callId: string, leads: LeadMasivoVM[]): void {
    console.log('[Polling Extraccion] callId recibido:', callId, typeof callId);
    if (!callId || callId === 'undefined' || callId === 'null') {
      console.error('[Polling Extraccion] callId inválido — abortando polling');
      leads.forEach(l => l.iaEstado = 'error');
      this.procesandoIA = false;
      return;
    }
    this._iaPollingSubscription = interval(5000).pipe(
      switchMap(() => this.service.obtenerEstadoExtraccion(callId)),
      takeWhile(resp => (resp.body.pending + resp.body.processing) > 0, true)
    ).subscribe({
      next: (resp) => {
        const status = resp.body;
        this.iaProgreso.completados = status.completed;
        if ((status.pending + status.processing) === 0) {
          this._aplicarResultadosExtraccion(callId, leads);
        }
      },
      error: (err) => {
        console.error('Error en polling extraccion', err);
        leads.forEach(l => l.iaEstado = 'error');
        this.procesandoIA = false;
      }
    });
  }

  private getLabelFromList(lista: any[], id: number | null, field: string = 'nombre'): string | null {
    if (!id || !lista?.length) return null;
    return lista.find(i => i.id === id)?.[field] || null;
  }

  /** Busca el label en una lista por idField/labelField arbitrarios (para calificacion V2). */
  private getLabelByField(lista: any[], id: number | null, idField: string, labelField: string): string | null {
    if (id == null || !lista?.length) return null;
    return lista.find(i => i[idField] === id)?.[labelField] || null;
  }

  private async _aplicarResultadosExtraccion(callId: string, leads: LeadMasivoVM[]): Promise<void> {
    try {
      const httpResp = await this.service.obtenerResultadosExtraccion(callId).toPromise();

      // El response es un array directo, no { resultados: [] }
      const resultados: any[] = Array.isArray(httpResp?.body)
        ? httpResp.body
        : (httpResp?.body as any)?.resultados || [];

      resultados.forEach((resultado: any) => {
        const lead = leads.find(l => ('+' + l.celular) === resultado.conv_id);
        if (!lead) return;

        if (resultado.status === 'NO_CREABLE') {
          lead.iaEstado = 'no_creable';
          lead.seleccionado = false;
        } else if (resultado.status === 'done') {
          lead.iaEstado = 'completado';
          lead.iaDatosExtraidos = {
            nombre:            resultado.nombre?.value           ? { value: resultado.nombre.value }   : null,
            apellido:          resultado.apellido?.value         ? { value: resultado.apellido.value } : null,
            email:             resultado.email?.value            ? { value: resultado.email.value }    : null,
            horaContacto:      resultado.hora_contacto_preferida?.value || null,
            origenLead:        resultado.origen_lead?.value      || null,
            areaFormacionId:   resultado.area_formacion?.normalized_id   || null,
            areaFormacion:     resultado.area_formacion?.normalized_value || null,
            cargoActualId:     resultado.cargo_actual?.normalized_id     || null,
            cargoActual:       resultado.cargo_actual?.normalized_value   || null,
            areaTrabajoId:     resultado.area_trabajo?.normalized_id     || null,
            areaTrabajo:       resultado.area_trabajo?.normalized_value   || null,
            industriaId:       resultado.industria?.normalized_id        || null,
            industria:         resultado.industria?.normalized_value      || null,
          };

          // Capturar comparativo antes → después para cada campo auto-rellenado
          const cambios: { campo: string; antes: string | null; despues: string }[] = [];
          const registrarCambio = (campo: string, antesLabel: string | null, despuesLabel: string | null) => {
            if (despuesLabel) {
              cambios.push({ campo, antes: antesLabel, despues: despuesLabel });
            }
          };

          registrarCambio(
            'Área formación',
            this.getLabelFromList(this.listaCombosAtributos.comboAreaFormacion || [], lead.areaFormacion),
            resultado.area_formacion?.normalized_value || null
          );
          registrarCambio(
            'Cargo',
            this.getLabelFromList(this.listaCombosAtributos.comboCargo || [], lead.cargo),
            resultado.cargo_actual?.normalized_value || null
          );
          registrarCambio(
            'Área trabajo',
            this.getLabelFromList(this.listaCombosAtributos.comboAreaTrabajo || [], lead.areaTrabajo),
            resultado.area_trabajo?.normalized_value || null
          );
          registrarCambio(
            'Industria',
            this.getLabelFromList(this.listaCombosAtributos.comboIndustria || [], lead.industria),
            resultado.industria?.normalized_value || null
          );
          registrarCambio(
            'Horario',
            lead.horario || null,
            resultado.hora_contacto_preferida?.value || null
          );
          registrarCambio(
            'Origen',
            this.getLabelFromList(this.listaOrigen, lead.idOrigen),
            resultado.origen_lead?.value || null
          );

          lead.iaCambios = cambios;

          // Inicializar flags de aceptación de datos personales detectados por IA
          lead.iaNombreAceptado = !!resultado.nombre?.value;
          lead.iaApellidoAceptado = !!resultado.apellido?.value;
          lead.iaEmailAceptado = !!resultado.email?.value;

          // Auto-fill campos del formulario con datos IA (solo si la IA devolvió un ID normalizado)
          if (resultado.area_formacion?.normalized_id) {
            lead.areaFormacion = resultado.area_formacion.normalized_id;
          }
          if (resultado.cargo_actual?.normalized_id) {
            lead.cargo = resultado.cargo_actual.normalized_id;
          }
          if (resultado.area_trabajo?.normalized_id) {
            lead.areaTrabajo = resultado.area_trabajo.normalized_id;
          }
          if (resultado.industria?.normalized_id) {
            lead.industria = resultado.industria.normalized_id;
          }
          if (resultado.hora_contacto_preferida?.value) {
            lead.horario = resultado.hora_contacto_preferida.value;
          }
          // Auto-fill ORIGEN — scoring para preferir el match más específico
          if (resultado.origen_lead?.value && this.listaOrigen?.length) {
            const origenIA = resultado.origen_lead.value.toLowerCase().trim();

            // Calcular score para cada opción del catálogo
            let mejorMatch: Combo | null = null;
            let mejorScore = 0;

            for (const o of this.listaOrigen) {
              const catNombre = o.nombre?.toLowerCase().trim() || '';
              if (!catNombre) continue;

              let score = 0;

              // Exact match — máxima prioridad
              if (origenIA === catNombre) {
                score = 1000;
              }
              // El catálogo está contenido en la IA Y tiene mínimo 6 caracteres
              else if (catNombre.length >= 6 && origenIA.includes(catNombre)) {
                score = catNombre.length; // más largo = más específico
              }
              // La IA está contenida en el catálogo
              else if (catNombre.includes(origenIA)) {
                score = origenIA.length;
              }

              if (score > mejorScore) {
                mejorScore = score;
                mejorMatch = o;
              }
            }

            if (mejorMatch) {
              lead.idOrigen = mejorMatch.id;
            }
          }

          // Marcar como modificado para que "Confirmar perfiles" lo procese
          lead.perfilModificado = true;
          lead.perfilConfirmado = false;
        } else {
          lead.iaEstado = 'error';
        }
      });
    } catch (err) {
      console.error('Error al obtener resultados extraccion', err);
      leads.forEach(l => { if (l.iaEstado === 'procesando') l.iaEstado = 'error'; });
    } finally {
      this.procesandoIA = false;
      this._iaPollingSubscription = null;
      this.cdr.detectChanges();
    }
  }

  // ---------------------------------------------------------------------------
  // Calificacion IA
  // ---------------------------------------------------------------------------

  private mapearPerfilParaCalificacion(lead: LeadMasivoVM): any {
    // Usar texto extraído por IA si está disponible, sino buscar label en catálogos
    const areaFormacion = lead.iaDatosExtraidos?.areaFormacion
      || this.getLabelByField(this.listaCombosAtributos.comboAreaFormacion || [], lead.areaFormacion, 'id', 'nombre')
      || '';
    const cargo = lead.iaDatosExtraidos?.cargoActual
      || this.getLabelByField(this.listaCombosAtributos.comboCargo || [], lead.cargo, 'id', 'nombre')
      || '';
    const areaTrabajo = lead.iaDatosExtraidos?.areaTrabajo
      || this.getLabelByField(this.listaCombosAtributos.comboAreaTrabajo || [], lead.areaTrabajo, 'id', 'nombre')
      || '';
    const industria = lead.iaDatosExtraidos?.industria
      || this.getLabelByField(this.listaCombosAtributos.comboIndustria || [], lead.industria, 'id', 'nombre')
      || '';

    return {
      AreaFormacion: areaFormacion,
      CargoActual: cargo,
      AreaTrabajo: areaTrabajo,
      Industria: industria
    };
  }

  private mapearHistorialParaCalificacion(lead: LeadMasivoVM): any[] {
    if (!lead.historialOportunidadesV2?.length) return [];
    return lead.historialOportunidadesV2.map(h => ({
      IdOportunidad: h.idOportunidad.toString(),
      FaseMaxima: h.faseMaxima || '',
      FaseCierre: h.faseOportunidad || ''
    }));
  }

  async calificarConIA(): Promise<void> {
    const seleccionados = this.leads.filter(l => l.seleccionado && l.calificacionEstado !== 'completado');
    if (!seleccionados.length) return;

    this.procesandoCalificacion = true;
    seleccionados.forEach(l => l.calificacionEstado = 'procesando');
    this.calificacionProgreso = { completados: 0, total: seleccionados.length };

    const payload: any = {
      TenantId: 'bsg',
      Oportunidades: seleccionados.map(lead => {
        const mensajesOrdenados = this.mapearMensajesParaIA(lead);
        // Obtener origen como texto desde el catálogo (no como ID)
        const origenLabel = this.getLabelFromList(this.listaOrigen, lead.idOrigen) || 'Whatsapp';
        return {
          IdentificadorLead: '+' + lead.celular,
          AgentId: lead.idAsesor?.toString() || '125',
          Origen: origenLabel,
          PerfilLead: this.mapearPerfilParaCalificacion(lead),
          HistorialOportunidades: this.mapearHistorialParaCalificacion(lead),
          Mensajes: mensajesOrdenados.map((m: any) => ({
            Role: m.Role || m.role,
            Content: m.Content || m.content,
            Timestamp: m.Timestamp || m.timestamp
          }))
        };
      })
    };

    try {
      const httpResp = await this.service.iniciarCalificacionBatchV2(payload).toPromise();
      console.log('Respuesta calificacion V2:', httpResp, 'body:', httpResp?.body);
      const llamada_id: string | undefined = httpResp?.body?.llamada_id ?? (httpResp?.body as any)?.data?.llamada_id;
      if (!llamada_id) {
        console.error('llamada_id no encontrado en la respuesta de calificacion V2. Estructura:', httpResp?.body);
        seleccionados.forEach(l => l.calificacionEstado = 'error');
        this.procesandoCalificacion = false;
        return;
      }
      this._iniciarPollingCalificacion(llamada_id, seleccionados);
    } catch (err) {
      console.error('Error al iniciar calificacion IA V2', err);
      seleccionados.forEach(l => l.calificacionEstado = 'error');
      this.procesandoCalificacion = false;
    }
  }

  private _iniciarPollingCalificacion(llamadaId: string, leads: LeadMasivoVM[]): void {
    this._calificacionPollingSubscription = interval(5000).pipe(
      switchMap(() => this.service.obtenerEstadoCalificacionV2(llamadaId)),
      takeWhile(resp => (resp.body.pending + resp.body.processing) > 0, true)
    ).subscribe({
      next: (resp) => {
        const status = resp.body;
        this.calificacionProgreso.completados = status.completed;
        if ((status.pending + status.processing) === 0) {
          this._aplicarResultadosCalificacion(llamadaId, leads);
        }
      },
      error: (err) => {
        console.error('Error en polling calificacion V2', err);
        leads.forEach(l => l.calificacionEstado = 'error');
        this.procesandoCalificacion = false;
      }
    });
  }

  private async _aplicarResultadosCalificacion(llamadaId: string, leads: LeadMasivoVM[]): Promise<void> {
    try {
      const httpResp = await this.service.obtenerResultadosCalificacionV2(llamadaId).toPromise();

      // El response es un array directo, no { resultados: [] }
      const resultados: any[] = Array.isArray(httpResp?.body)
        ? httpResp.body
        : (httpResp?.body as any)?.resultados || [];

      resultados.forEach((resultado: any) => {
        const lead = leads.find(l => ('+' + l.celular) === resultado.identificador_lead);
        if (!lead) return;

        // calificacion es un string: "NO_CREABLE", "CREABLE_FILTRADO", etc.
        if (resultado.calificacion === 'NO_CREABLE') {
          lead.calificacionEstado = 'no_creable';
          lead.seleccionado = false;
        } else if (resultado.status === 'done') {
          lead.calificacionEstado = 'completado';
          lead.calificacionResultado = {
            calificacion:       resultado.calificacion,
            escenario:          resultado.escenario,
            capaAplicada:       resultado.capa_aplicada,
            motivoCalificacion: resultado.motivo_calificacion,
            motivoEscenario:    resultado.motivo_escenario,
            needsReview:        resultado.needs_review,
            scoreTotal:         resultado.score_total,
          };
        } else {
          lead.calificacionEstado = 'error';
        }
      });
    } catch (err) {
      console.error('Error al obtener resultados calificacion', err);
      leads.forEach(l => { if (l.calificacionEstado === 'procesando') l.calificacionEstado = 'error'; });
    } finally {
      this.procesandoCalificacion = false;
      this._calificacionPollingSubscription = null;
    }
  }

  // Cierre
  cerrarModal(): void {
    const hayPendientes = this.leads.some(l => l.perfilModificado && !l.perfilConfirmado);
    if (hayPendientes) {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        title: 'Seguro que queres salir?',
        text: 'Hay perfiles modificados sin confirmar. Los cambios se perderan.',
        showCancelButton: true,
        confirmButtonText: 'Si, salir',
        cancelButtonText: 'No, volver'
      }).then(result => {
        if (result.isConfirmed) this.dialogRef.close();
      });
    } else {
      this.dialogRef.close();
    }
  }

  // Helpers visuales
  getBadgeCalificacionClass(badge: string | null): string {
    if (!badge) return '';
    if (badge.startsWith('Creable')) return 'badge-creable';
    if (badge.startsWith('No Creable')) return 'badge-no-creable';
    return 'badge-revision';
  }

  reemplazarGuion(texto: string | null | undefined): string {
    return texto ? texto.replace(/_/g, ' ') : '';
  }

  // Helpers renderizado de mensajes multimedia
  private readonly _tiposTexto = ['text', 'button', 'hsm', 'template', 'extendedtext'];

  private readonly _configMultimedia: Record<string, { label: string; icono: string }> = {
    image:    { label: 'Ver imagen',      icono: '🖼️' },
    audio:    { label: 'Escuchar audio',  icono: '🎵' },
    voice:    { label: 'Escuchar audio',  icono: '🎵' },
    video:    { label: 'Ver video',       icono: '🎬' },
    sticker:  { label: 'Ver sticker',     icono: '🖼️' },
    document: { label: 'Ver documento',   icono: '📄' },
  };

  esMensajeTexto(msg: MensajeChat): boolean {
    return !msg.waType || this._tiposTexto.includes(msg.waType.toLowerCase());
  }

  getMensajeTexto(msg: MensajeChat): string {
    const html = msg.mensajeHtml || (msg as any)['Mensaje'] || (msg as any)['mensaje'] || '';
    // Reemplazar cualquier <img> embebido por un link (ej: plantillas masivas con imagen en el cuerpo)
    return html.replace(
      /<img\s[^>]*src=["']([^"']+)["'][^>]*\/?>/gi,
      (_: string, src: string) => `<a href="${src}" target="_blank" rel="noopener noreferrer">🖼️ Ver imagen</a>`
    );
  }

  getMensajeUrl(msg: MensajeChat): string {
    return msg.archivo || '';
  }

  getMensajeLabel(msg: MensajeChat): string {
    if (!msg.waType) { return msg.nombreArchivo || 'Ver archivo'; }
    const tipo = msg.waType.toLowerCase();
    const cfg = this._configMultimedia[tipo] || { label: 'Ver archivo', icono: '📎' };
    const nombre = msg.nombreArchivo || cfg.label;
    return `${cfg.icono} ${nombre}`;
  }

  get exitoCreacion(): number { return this.resultados.filter(r => r.exito).length; }
  get errorCreacionCount(): number { return this.resultados.filter(r => !r.exito).length; }
  get porcentajeProgreso(): number {
    return this.progresoTotal > 0 ? Math.round((this.progresoActual / this.progresoTotal) * 100) : 0;
  }
}

import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { constApiMarketing } from '@environments/constApi';
import {
  CampaniaRemarketingGeneralEditar,
  CombosConfiguracionCampaniaDTO,
  EstadoEjecucionLlamadaIA,
  SegmentoCreado,
} from '@marketing/models/interfaces/campania-remarketing-general';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-crear-editar-campania',
  templateUrl: './crear-editar-campania.component.html',
  styleUrls: ['./crear-editar-campania.component.scss'],
})
export class CrearEditarCampaniaComponent implements OnInit {
  envioSeleccionado: 'no programado' | 'enviar ahora' | 'programado' = 'no programado';
  formularioValido = false;
  minDate = new Date();

  isLoadingCombos = true;
  isLoadingSegmentos = true;
  isLoadingEjecutarEnvio = false;
  isLoadingGenerarTextos = false;
  get isLoading() {
    return (
      this.isLoadingCombos ||
      this.isLoadingSegmentos ||
      this.isLoadingEjecutarEnvio ||
      this.isLoadingDatosEditar ||
      this.isLoadingGenerarTextos
    );
  }

  campaniaForm: FormGroup;

  listadoSegmentos: SegmentoCreado[] = [];
  segmentoSeleccionado: SegmentoCreado | null = null;
  segmentosFiltrados$: Observable<SegmentoCreado[]>;
  combosConfiguracionCampania: CombosConfiguracionCampaniaDTO;
  mediosEnvioSeleccionados: number[] = [];
  tipoMensajeSeleccionado: number | null = null;
  logicaEnvioSeleccionada: number | null = null;
  categoriaArgumentoSeleccionada: number | null = null;
  prioridadesSeleccionadas: number[] = [];

  isLoadingResultadosGeneracionTexto = false;
  resultadosGeneracionTexto: EstadoEjecucionLlamadaIA;
  mensajeGeneradoSeleccionado: string | null = null;

  datosEditar: CampaniaRemarketingGeneralEditar;
  isLoadingDatosEditar = false;

  // Canvas Plantilla
  mostrarCanvasPlantilla = false;
  isLoadingCanvas = false;
  isSavingCanvas = false;
  canvasExistente = false;
  canvasId: number | null = null;
  canvasContenidoSuperior = '';
  canvasContenidoInferior = '';

  @ViewChild('contenidoSuperiorEditor') contenidoSuperiorEditor: ElementRef;
  @ViewChild('contenidoInferiorEditor') contenidoInferiorEditor: ElementRef;

  displaySegmentoFn(segmento?: SegmentoCreado): string {
    return segmento ? segmento.nombre : '';
  }

  constructor(
    public dialogRef: MatDialogRef<CrearEditarCampaniaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.ObtenerListadoSegmentosCreados();
    this.ObtenerCombosConfiguracionCampania();

    this.campaniaForm = new FormGroup({
      // Campaña Remarketing
      segmentoSeleccionado: new FormControl(null, Validators.required),
      mediosEnvioSeleccionados: new FormControl(null, Validators.required),
      tipoMensajeSeleccionado: new FormControl(null, Validators.required),
      logicaEnvioSeleccionada: new FormControl(null, Validators.required),
      categoriaArgumentoSeleccionada: new FormControl(null, Validators.required),
      prioridadesSeleccionadas: new FormControl([], Validators.required),
      // Configurar remitente
      remitenteCorreo: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      remitenteNombre: new FormControl('', Validators.required),
      asunto: new FormControl('', Validators.required),
      // Configuración de envío
      envioSeleccionado: new FormControl('no programado', Validators.required),
      fechaEnvio: new FormControl(''),
      horaEnvio: new FormControl(''),
    });

    // Filtrado de segmentos
    this.segmentosFiltrados$ = this.campaniaForm
      .get('segmentoSeleccionado')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filterSegmentos(value))
      );
    this.campaniaForm
      .get('segmentoSeleccionado')
      .valueChanges.subscribe((val) => {
        this.segmentoSeleccionado = val;
      });

    if (this.data && this.data.modo === 'editar' && this.data.id) {
      this.ObtenerCampaniaRemarketingPorId();
    }
  }

  private _filterSegmentos(value: string | SegmentoCreado): SegmentoCreado[] {
    const filterValue =
      typeof value === 'string'
        ? value.toLowerCase()
        : value?.nombre?.toLowerCase() || '';
    return this.listadoSegmentos.filter((seg) =>
      seg.nombre.toLowerCase().includes(filterValue)
    );
  }

  ObtenerListadoSegmentosCreados() {
    this.isLoadingSegmentos = true;
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerListadoSegmentosCreados}`)
      .subscribe({
        next: (data: any) => {
          this.listadoSegmentos = data.body as SegmentoCreado[];
          this.isLoadingSegmentos = false;
          // Seteo segmento para modo edición
          if (this.data && this.data.modo === 'editar' && this.datosEditar) {
            const segmento =
              this.listadoSegmentos.find(
                (seg) => seg.id === this.datosEditar.idFiltroSegmento
              ) || null;
            this.campaniaForm.get('segmentoSeleccionado').setValue(segmento);
          }
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoadingSegmentos = false;
        },
      });
  }

  ObtenerCombosConfiguracionCampania() {
    this.isLoadingCombos = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerCombosConfiguracionCampania}`
      )
      .subscribe({
        next: (data: any) => {
          this.combosConfiguracionCampania =
            data.body as CombosConfiguracionCampaniaDTO;
          this.isLoadingCombos = false;
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoadingCombos = false;
        },
      });
  }

  ObtenerCampaniaRemarketingPorId() {
    this.isLoadingDatosEditar = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerCampaniaRemarketingPorId}/${this.data.id}`
      )
      .subscribe({
        next: (data: any) => {
          this.datosEditar = data.body as CampaniaRemarketingGeneralEditar;

          // Setear valores en el formulario y variables auxiliares
          const medioEnvioValue = this.datosEditar.mediosEnvio?.length > 0
            ? this.datosEditar.mediosEnvio[0]
            : null;

          this.campaniaForm.patchValue({
            mediosEnvioSeleccionados: medioEnvioValue,
            tipoMensajeSeleccionado: this.datosEditar.tipoMensaje || null,
            logicaEnvioSeleccionada: this.datosEditar.logicaEnvio || null,
            categoriaArgumentoSeleccionada: this.datosEditar.categoriaArgumento || null,
            prioridadesSeleccionadas: this.datosEditar.prioridades || [],
            remitenteCorreo: this.datosEditar.remitenteCorreo || '',
            remitenteNombre: this.datosEditar.remitenteNombre || '',
            asunto: this.datosEditar.asunto || '',
            envioSeleccionado: this.datosEditar.envioConfigurado || 'no programado',
            fechaEnvio: this.datosEditar.fechaEnvioProgramada
              ? new Date(this.datosEditar.fechaEnvioProgramada)
              : '',
            horaEnvio: this.datosEditar.fechaEnvioProgramada
              ? this.datosEditar.fechaEnvioProgramada
                  .toString()
                  .substring(11, 16)
              : '',
          });
          this.mediosEnvioSeleccionados = this.datosEditar.mediosEnvio || [];
          this.tipoMensajeSeleccionado = this.datosEditar.tipoMensaje || null;
          this.logicaEnvioSeleccionada = this.datosEditar.logicaEnvio || null;
          this.categoriaArgumentoSeleccionada = this.datosEditar.categoriaArgumento || null;
          this.prioridadesSeleccionadas = this.datosEditar.prioridades || [];
          this.envioSeleccionado =
            (this.datosEditar.envioConfigurado as any) || 'no programado';

          // Si los segmentos ya están cargados, setear el segmento
          if (this.listadoSegmentos && this.listadoSegmentos.length > 0) {
            const segmento =
              this.listadoSegmentos.find(
                (seg) => seg.id === this.datosEditar.idFiltroSegmento
              ) || null;
            this.campaniaForm.get('segmentoSeleccionado').setValue(segmento);
          }

          this.isLoadingDatosEditar = false;
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoadingDatosEditar = false;
        },
      });
  }

  ObtenerResultadosGeneracionTexto() {
    const valid = !!this.segmentoSeleccionado;
    if (!valid) {
      this._alertaService.notificationError('Debe seleccionar un segmento');
      return;
    }

    this.isLoadingResultadosGeneracionTexto = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerResultadosGeneracionTexto}/${this.datosEditar.identificadorLlamadaIA}`
      )
      .subscribe({
        next: (data: any) => {
          this.resultadosGeneracionTexto =
            data.body as EstadoEjecucionLlamadaIA;
          this.isLoadingResultadosGeneracionTexto = false;
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoadingResultadosGeneracionTexto = false;
        },
      });
  }

  generarTextos() {
    const medioEnvioSeleccionado = this.campaniaForm.get('mediosEnvioSeleccionados').value;

    const valid = !!(
      this.segmentoSeleccionado &&
      medioEnvioSeleccionado != null &&
      this.tipoMensajeSeleccionado &&
      this.logicaEnvioSeleccionada &&
      this.categoriaArgumentoSeleccionada &&
      this.prioridadesSeleccionadas &&
      this.prioridadesSeleccionadas.length > 0
    );

    if (!valid) {
      this._alertaService.notificationError(
        'Debe completar todos los campos requeridos para generar los textos.'
      );
      return;
    }

    const medioEnvioCompleto = this.combosConfiguracionCampania.medioEnvio.find(
      (m) => m.id === medioEnvioSeleccionado
    );
    const tipoMensajeCompleto = this.combosConfiguracionCampania.tipoMensaje.find(
      (t) => t.id === this.tipoMensajeSeleccionado
    );
    const logicaEnvioCompleta = this.combosConfiguracionCampania.logicaEnvio.find(
      (l) => l.id === this.logicaEnvioSeleccionada
    );
    const categoriaArgumentoCompleta = this.combosConfiguracionCampania.categoriaArgumento.find(
      (c) => c.id === this.categoriaArgumentoSeleccionada
    );

    const payload = {
      id: this.data.id || null,
      segmento: this.segmentoSeleccionado,
      mediosEnvio: [medioEnvioCompleto],
      tipoMensaje: tipoMensajeCompleto,
      logicaEnvio: logicaEnvioCompleta,
      categoriaArgumento: categoriaArgumentoCompleta,
      prioridades: this.prioridadesSeleccionadas,
      identificadorLlamadaIA: '',
      envioSeleccionado: "no programado",
      flagEditar: false,
    };

    this.isLoadingGenerarTextos = true; 

    if (this.data && this.data.modo === 'editar' ) {
      payload.flagEditar = true
      payload.identificadorLlamadaIA = this.datosEditar.identificadorLlamadaIA
    }

    this.integraService
        .postJsonResponse(
          `${constApiMarketing.GenerarListadoTextosRemarketing}`,
          payload
        )
        .subscribe({
          next: (data: any) => {
            if(data.body.resultado){
              this._alertaService.mensajeIcon(
                '¡Exito!',
                'Se inicio correctamente la generacion de textos',
                'success'
              );
              this.dialogRef.close('refresh');
            } else {
              this._alertaService.mensajeIcon(
                '¡Alerta!',
                'Ya existe una generacion en curso para esta campaña',
                'warning'
              );
            }

            this.isLoadingGenerarTextos = false;
          },
          error: (err) => {
            this._alertaService.mensajeIcon(
              'Error',
              'Hubo un error al intentar generar los textos.',
              'error'
            );

            this.isLoadingGenerarTextos = false;
          },
        });
  }

  cerrar(): void {
    this.dialogRef.close();
  }

  cerrarModalMensajeGenerado() {
    this.mensajeGeneradoSeleccionado = null;
  }

  iniciarEnvio() {
    this.campaniaForm.patchValue({
      segmentoSeleccionado: this.segmentoSeleccionado,
      mediosEnvioSeleccionados: this.mediosEnvioSeleccionados?.[0] || null,
      tipoMensajeSeleccionado: this.tipoMensajeSeleccionado,
      logicaEnvioSeleccionada: this.logicaEnvioSeleccionada,
      categoriaArgumentoSeleccionada: this.categoriaArgumentoSeleccionada,
      prioridadesSeleccionadas: this.prioridadesSeleccionadas,
      envioSeleccionado: this.envioSeleccionado,
    });

    // Validaciones del formulario
    const form = this.campaniaForm;
    const envioProgramado = form.value.envioSeleccionado === 'programado';
    if (form.get('remitenteCorreo').invalid) {
      this._alertaService.notificationError(
        'Debe ingresar un correo válido en "De".'
      );
      return;
    }
    if (form.get('remitenteNombre').invalid) {
      this._alertaService.notificationError(
        'Debe ingresar el nombre del remitente.'
      );
      return;
    }
    if (form.get('asunto').invalid) {
      this._alertaService.notificationError('Debe ingresar el asunto.');
      return;
    }

    // Validar sección campaña remarketing
    if (
      !form.value.segmentoSeleccionado ||
      !form.value.mediosEnvioSeleccionados ||
      !form.value.tipoMensajeSeleccionado ||
      !form.value.logicaEnvioSeleccionada ||
      !form.value.categoriaArgumentoSeleccionada ||
      !form.value.prioridadesSeleccionadas ||
      form.value.prioridadesSeleccionadas.length === 0
    ) {
      this._alertaService.notificationError(
        'Debe completar todos los campos de la sección Campaña Remarketing.'
      );
      return;
    }

    // Validar configuración de envío
    if (envioProgramado) {
      const fecha = form.get('fechaEnvio').value;
      const hora = form.get('horaEnvio').value;
      if (!fecha || fecha === '' || fecha === null) {
        this._alertaService.notificationError(
          'Debe seleccionar la fecha de envío.'
        );
        return;
      }
      if (!hora || hora === '' || hora === null) {
        this._alertaService.notificationError(
          'Debe seleccionar la hora de envío.'
        );
        return;
      }
      // Validar que la fecha programada sea en el futuro
      const fechaStr =
        typeof fecha === 'string' ? fecha : fecha.toISOString().slice(0, 10);
      const fechaHoraProgramada = new Date(`${fechaStr}T${hora}:00`);
      if (fechaHoraProgramada <= new Date()) {
        this._alertaService.notificationError(
          'La fecha y hora de envío deben ser posteriores a la fecha y hora actual.'
        );
        return;
      }
    }

    // Si todo es válido, mostrar los datos configurados
    let fechaEnvioFinal = null;
    if (form.value.envioSeleccionado === 'programado') {
      const fecha = form.get('fechaEnvio').value;
      const hora = form.get('horaEnvio').value;
      if (fecha && hora) {
        // Unir fecha y hora
        const fechaStr =
          typeof fecha === 'string' ? fecha : fecha.toISOString().slice(0, 10);
        fechaEnvioFinal = `${fechaStr}T${hora}:00`;
      }
    }
    
    // Recuperar IDs desde el form
    const medioEnvioId = this.campaniaForm.get('mediosEnvioSeleccionados').value;
    const tipoMensajeId = this.campaniaForm.get('tipoMensajeSeleccionado').value;
    const logicaEnvioId = this.campaniaForm.get('logicaEnvioSeleccionada').value;
    const categoriaArgumentoId = this.campaniaForm.get('categoriaArgumentoSeleccionada').value;

    // Buscar objetos completos en combos
    const medioEnvioCompleto = this.combosConfiguracionCampania.medioEnvio
      .find(m => m.id === medioEnvioId);
    const tipoMensajeCompleto = this.combosConfiguracionCampania.tipoMensaje
      .find(t => t.id === tipoMensajeId);
    const logicaEnvioCompleta = this.combosConfiguracionCampania.logicaEnvio
      .find(l => l.id === logicaEnvioId);
    const categoriaArgumentoCompleta = this.combosConfiguracionCampania.categoriaArgumento
      .find(c => c.id === categoriaArgumentoId);

    // Seguridad extra
    if (
      !medioEnvioCompleto ||
      !tipoMensajeCompleto ||
      !logicaEnvioCompleta ||
      !categoriaArgumentoCompleta
    ) {
      this._alertaService.notificationError(
        'Error al obtener la configuración seleccionada.'
      );
      return;
    }

    const datosConfigurados = {
      id: this.data.id || null,
      segmento: this.segmentoSeleccionado,
      mediosEnvio: [medioEnvioCompleto],
      tipoMensaje: tipoMensajeCompleto,
      logicaEnvio: logicaEnvioCompleta,
      categoriaArgumento: categoriaArgumentoCompleta,
      prioridades: this.prioridadesSeleccionadas,
      remitenteCorreo: this.campaniaForm.value.remitenteCorreo,
      remitenteNombre: this.campaniaForm.value.remitenteNombre,
      asunto: this.campaniaForm.value.asunto,
      envioSeleccionado: this.campaniaForm.value.envioSeleccionado,
      fechaEnvio: fechaEnvioFinal,
      identificadorLlamadaIA: this.datosEditar.identificadorLlamadaIA
    };

    this.isLoadingEjecutarEnvio = true;

      this.integraService
        .postJsonResponse(
          `${constApiMarketing.ActualizarEjecutarEnvioCampaniaRemarketing}`,
          datosConfigurados
        )
        .subscribe({
          next: (data: any) => {
               if(data.body){
              this._alertaService.mensajeIcon(
                '¡Exito!',
                'La campaña fue programada exitosamente.',
                'success'
              );
              this.dialogRef.close('refresh');
            } else {
              this._alertaService.mensajeIcon(
                '¡Alerta!',
                'Hubo un error al configurar la campaña, no se iniciará el envio',
                'warning'
              );
            }

            this.isLoadingEjecutarEnvio = false;
            this.dialogRef.close('refresh');
          },
          error: (err) => {
            this._alertaService.mensajeIcon(
              'Error',
              'Hubo un error al intentar programar la campaña.',
              'error'
            );

            this.isLoadingEjecutarEnvio = false;
          },
        });
  }

  onHoraEnvioChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.campaniaForm.get('horaEnvio').setValue(value);
  }

  // === Canvas Plantilla ===

  abrirCanvasPlantilla() {
    this.mostrarCanvasPlantilla = true;
    this.canvasContenidoSuperior = '';
    this.canvasContenidoInferior = '';
    this.canvasExistente = false;
    this.canvasId = null;
    this.obtenerCanvas();
  }

  cerrarCanvasPlantilla() {
    this.mostrarCanvasPlantilla = false;
  }

  obtenerCanvas() {
    if (!this.data.id) return;
    this.isLoadingCanvas = true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ObtenerCampaniaCanvas}/${this.data.id}`
      )
      .subscribe({
        next: (data: any) => {
          if (data.body) {
            const canvas = data.body;
            this.canvasId = canvas.id;
            this.canvasContenidoSuperior = canvas.contenidoSuperior || '';
            this.canvasContenidoInferior = canvas.contenidoInferior || '';
            this.canvasExistente = true;
          }
          this.isLoadingCanvas = false;
          this.cargarContenidoEditores();
        },
        error: (err) => {
          console.error('Error fetching canvas:', err);
          this.isLoadingCanvas = false;
          this.cargarContenidoEditores();
        },
      });
  }

  private cargarContenidoEditores() {
    setTimeout(() => {
      if (this.contenidoSuperiorEditor?.nativeElement) {
        this.contenidoSuperiorEditor.nativeElement.innerHTML = this.canvasContenidoSuperior;
      }
      if (this.contenidoInferiorEditor?.nativeElement) {
        this.contenidoInferiorEditor.nativeElement.innerHTML = this.canvasContenidoInferior;
      }
    });
  }

  onContenidoSuperiorChange(event: Event) {
    this.canvasContenidoSuperior = (event.target as HTMLElement).innerHTML;
  }

  onContenidoInferiorChange(event: Event) {
    this.canvasContenidoInferior = (event.target as HTMLElement).innerHTML;
  }

  aplicarFormato(comando: string) {
    document.execCommand(comando, false, null);
  }

  guardarCanvas() {
    const payload = {
      id: this.canvasId,
      idRemarketingCampaniaGeneral: this.data.id,
      contenidoSuperior: this.canvasContenidoSuperior,
      contenidoInferior: this.canvasContenidoInferior,
    };

    this.isSavingCanvas = true;
    const endpoint = this.canvasExistente
      ? constApiMarketing.ActualizarCampaniaCanvas
      : constApiMarketing.InsertarCampaniaCanvas;

    this.integraService
      .postJsonResponse(`${endpoint}`, payload)
      .subscribe({
        next: (data: any) => {
          if (data.body) {
            this._alertaService.mensajeIcon(
              '¡Éxito!',
              this.canvasExistente
                ? 'Plantilla actualizada correctamente.'
                : 'Plantilla guardada correctamente.',
              'success'
            );
            this.canvasExistente = true;
          } else {
            this._alertaService.mensajeIcon(
              '¡Alerta!',
              'No se pudo guardar la plantilla.',
              'warning'
            );
          }
          this.isSavingCanvas = false;
        },
        error: (err) => {
          console.error('Error saving canvas:', err);
          this._alertaService.mensajeIcon(
            'Error',
            'Hubo un error al guardar la plantilla.',
            'error'
          );
          this.isSavingCanvas = false;
        },
      });
  }

  eliminarCanvas() {
    if (!this.data.id) return;
    this.isSavingCanvas = true;
    this.integraService
      .postJsonResponse(
        `${constApiMarketing.EliminarCampaniaCanvas}`,
        this.data.id
      )
      .subscribe({
        next: (data: any) => {
          if (data.body) {
            this._alertaService.mensajeIcon(
              '¡Éxito!',
              'Plantilla eliminada correctamente.',
              'success'
            );
            this.canvasContenidoSuperior = '';
            this.canvasContenidoInferior = '';
            this.canvasExistente = false;
            this.canvasId = null;
            this.cerrarCanvasPlantilla();
          } else {
            this._alertaService.mensajeIcon(
              '¡Alerta!',
              'No se pudo eliminar la plantilla.',
              'warning'
            );
          }
          this.isSavingCanvas = false;
        },
        error: (err) => {
          console.error('Error deleting canvas:', err);
          this._alertaService.mensajeIcon(
            'Error',
            'Hubo un error al eliminar la plantilla.',
            'error'
          );
          this.isSavingCanvas = false;
        },
      });
  }
}

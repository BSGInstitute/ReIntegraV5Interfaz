import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { constApiMarketing } from '@environments/constApi';
import {
  CampaniaRemarketingGeneralEditar,
  CombosConfiguracionCampaniaDTO,
  ResultadoGeneracionTexto,
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
  envioSeleccionado: 'enviar ahora' | 'programado' = 'enviar ahora';
  formularioValido = false;

  isLoadingCombos = true;
  isLoadingSegmentos = true;
  isLoadingEjecutarEnvio = false;
  get isLoading() {
    return (
      this.isLoadingCombos ||
      this.isLoadingSegmentos ||
      this.isLoadingEjecutarEnvio ||
      this.isLoadingDatosEditar
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
  argumentosSeleccionados: number[] = [];

  isLoadingResultadosGeneracionTexto = false;
  resultadosGeneracionTexto: ResultadoGeneracionTexto[] = [];
  mensajeGeneradoSeleccionado: string | null = null;

  datosEditar: CampaniaRemarketingGeneralEditar;
  isLoadingDatosEditar = false;

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
      mediosEnvioSeleccionados: new FormControl([], Validators.required),
      tipoMensajeSeleccionado: new FormControl(null, Validators.required),
      logicaEnvioSeleccionada: new FormControl(null, Validators.required),
      argumentosSeleccionados: new FormControl([], Validators.required),
      // Configurar remitente
      remitenteCorreo: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      remitenteNombre: new FormControl('', Validators.required),
      asunto: new FormControl('', Validators.required),
      // Configuración de envío
      envioSeleccionado: new FormControl('ahora', Validators.required),
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
          this.campaniaForm.patchValue({
            mediosEnvioSeleccionados: this.datosEditar.mediosEnvio || [],
            tipoMensajeSeleccionado: this.datosEditar.tipoMensaje || null,
            logicaEnvioSeleccionada: this.datosEditar.logicaEnvio || null,
            argumentosSeleccionados: this.datosEditar.argumentos || [],
            remitenteCorreo: this.datosEditar.remitenteCorreo || '',
            remitenteNombre: this.datosEditar.remitenteNombre || '',
            asunto: this.datosEditar.asunto || '',
            envioSeleccionado: this.datosEditar.envioConfigurado || 'ahora',
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
          this.argumentosSeleccionados = this.datosEditar.argumentos || [];
          this.envioSeleccionado =
            (this.datosEditar.envioConfigurado as any) || 'enviar ahora';

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
        `${constApiMarketing.ObtenerResultadosGeneracionTexto}/${this.segmentoSeleccionado.id}`
      )
      .subscribe({
        next: (data: any) => {
          this.resultadosGeneracionTexto =
            data.body as ResultadoGeneracionTexto[];
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
    const valid = !!(
      this.segmentoSeleccionado &&
      this.mediosEnvioSeleccionados &&
      this.mediosEnvioSeleccionados.length > 0 &&
      this.tipoMensajeSeleccionado &&
      this.logicaEnvioSeleccionada &&
      this.argumentosSeleccionados &&
      this.argumentosSeleccionados.length > 0
    );
    if (!valid) {
      this._alertaService.notificationError(
        'Debe completar todos los campos requeridos para generar los textos.'
      );
      return;
    }

    const payload = {
      segmento: this.segmentoSeleccionado,
      mediosEnvio: this.mediosEnvioSeleccionados,
      tipoMensaje: this.tipoMensajeSeleccionado,
      logicaEnvio: this.logicaEnvioSeleccionada,
      argumentos: this.argumentosSeleccionados,
    };
    console.log('Payload para API:', payload);
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
      mediosEnvioSeleccionados: this.mediosEnvioSeleccionados,
      tipoMensajeSeleccionado: this.tipoMensajeSeleccionado,
      logicaEnvioSeleccionada: this.logicaEnvioSeleccionada,
      argumentosSeleccionados: this.argumentosSeleccionados,
      envioSeleccionado: this.envioSeleccionado,
    });

    // Validaciones del formulario
    const form = this.campaniaForm;
    const envioProgramado = form.value.envioSeleccionado === 'programar';
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
      form.value.mediosEnvioSeleccionados.length === 0 ||
      !form.value.tipoMensajeSeleccionado ||
      !form.value.logicaEnvioSeleccionada ||
      !form.value.argumentosSeleccionados ||
      form.value.argumentosSeleccionados.length === 0
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
    }

    // Si todo es válido, mostrar los datos configurados
    let fechaEnvioFinal = null;
    if (form.value.envioSeleccionado === 'programar') {
      const fecha = form.get('fechaEnvio').value;
      const hora = form.get('horaEnvio').value;
      if (fecha && hora) {
        // Unir fecha y hora
        const fechaStr =
          typeof fecha === 'string' ? fecha : fecha.toISOString().slice(0, 10);
        fechaEnvioFinal = `${fechaStr}T${hora}:00`;
      }
    }
    const datosConfigurados = {
      id: this.data.id || null,
      segmento: form.value.segmentoSeleccionado,
      mediosEnvio: form.value.mediosEnvioSeleccionados,
      tipoMensaje: form.value.tipoMensajeSeleccionado,
      logicaEnvio: form.value.logicaEnvioSeleccionada,
      argumentos: form.value.argumentosSeleccionados,
      remitenteCorreo: form.value.remitenteCorreo,
      remitenteNombre: form.value.remitenteNombre,
      asunto: form.value.asunto,
      envioSeleccionado: form.value.envioSeleccionado,
      fechaEnvio: fechaEnvioFinal,
    };

    this.isLoadingEjecutarEnvio = true;

    if (this.data.modo === 'editar') {
      this.integraService
        .postJsonResponse(
          `${constApiMarketing.EditarEjecutarEnvioCampaniaRemarketing}`,
          datosConfigurados
        )
        .subscribe({
          next: () => {
            this._alertaService.mensajeIcon(
              '¡Exito!',
              'La campaña fue programada exitosamente.',
              'success'
            );
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
    } else {
      this.integraService
        .postJsonResponse(
          `${constApiMarketing.GuardarEjecutarEnvioCampaniaRemarketing}`,
          datosConfigurados
        )
        .subscribe({
          next: () => {
            this._alertaService.mensajeIcon(
              '¡Exito!',
              'La campaña fue programada exitosamente.',
              'success'
            );
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
  }

  onHoraEnvioChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.campaniaForm.get('horaEnvio').setValue(value);
  }
}

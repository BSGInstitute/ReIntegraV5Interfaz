import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { constApiPlanificacion } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {
  ConfiguracionVideoPrincipal,
  ConfiguracionVideoTutorVirtual,
} from '../video-evaluaciones-estructura-programa.component';

@Component({
  selector: 'app-modal-configuracion-tutor-virtual',
  templateUrl: './modal-configuracion-tutor-virtual.component.html',
  styleUrls: ['./modal-configuracion-tutor-virtual.component.scss'],
})
export class ModalConfiguracionTutorVirtualComponent
  implements OnInit, OnDestroy
{
  public configuracionVideoPrincipal: ConfiguracionVideoPrincipal;
  public configuracionVideo: ConfiguracionVideoTutorVirtual[];
  public modalContext: NgbModalRef;

  gridConfiguracionSecuenciaVideo: KendoGrid = new KendoGrid();

  loaderModal: boolean = false;

  // Variables para selección múltiple
  videosSeleccionados: Array<{ video_id: string; plataforma: number }> = [];
  todosSeleccionados: boolean = false;

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
  ) {}

  ngOnInit(): void {
    this.obtenerConfiguracionVideo();
  }

  ngOnDestroy(): void {
    this.gridConfiguracionSecuenciaVideo.data = [];
    this.videosSeleccionados = [];
    this.todosSeleccionados = false;
  }

  obtenerConfiguracionVideo(): void {
    if (this.configuracionVideo != null) {
      // Asegurar que los campos existan
      this.gridConfiguracionSecuenciaVideo.data = this.configuracionVideo.map(
        (item) => ({
          ...item,
          videoIdBrightcove: item.videoIdBrightcove || '',
          estadoProcesamiento: item.estadoProcesamiento,
          fechaProcesamiento: item.fechaProcesamiento || null,
          idVideoProcesamiento:
            item.reproduccionVideo === 2
              ? (item.videoIdVimeo || '')
              : item.reproduccionVideo === 1
              ? (item.videoIdBrightcove || '')
              : '',
        }),
      );
      this.gridConfiguracionSecuenciaVideo.loading = false;
    }
  }

  refrescarDatos(): void {
    this.loaderModal = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ConfigurarVideoProgramaObtenerConfiguracionTutorVirtualAonline}/${this.configuracionVideoPrincipal.idPgeneral}`,
      )
      .subscribe({
        next: (response: HttpResponse<ConfiguracionVideoTutorVirtual[]>) => {
          this.configuracionVideo = response.body;
          this.obtenerConfiguracionVideo();
          // Limpiar selección al refrescar
          this.videosSeleccionados = [];
          this.todosSeleccionados = false;
          this.loaderModal = false;
          this._alertaService.notificationSuccess(
            'Datos actualizados correctamente',
          );
        },
        error: (err) => {
          this.loaderModal = false;
          this._alertaService.notificationWarning(
            'Error al actualizar los datos',
          );
        },
      });
  }

  // Métodos para selección múltiple
  estaSeleccionado(videoId: string): boolean {
    return this.videosSeleccionados.some((video) => video.video_id === videoId);
  }

  toggleSeleccion(dataItem: ConfiguracionVideoTutorVirtual): void {
    console.log('Data Item:', dataItem);
    if (
      !dataItem.idVideoProcesamiento ||
      dataItem.idVideoProcesamiento === 'Sin Video'
    ) {
      this._alertaService.notificationWarning(
        'Este registro no tiene ID Video válido',
      );
      return;
    }

    const index = this.videosSeleccionados.findIndex(
      (video) => video.video_id === dataItem.idVideoProcesamiento,
    );

    if (index > -1) {
      this.videosSeleccionados.splice(index, 1);
    } else {
      this.videosSeleccionados.push({
        video_id: dataItem.idVideoProcesamiento,
        plataforma: dataItem.reproduccionVideo,
      });
    }

    // Actualizar estado de "todos seleccionados"
    this.verificarTodosSeleccionados();
  }

  seleccionarTodos(event: any): void {
    const checked = event.target.checked;

    // Filtrar solo los videos que tienen idVideoProcesamiento válido y NO están "En Proceso"
    const videosValidos = this.gridConfiguracionSecuenciaVideo.data.filter(
      (item) =>
        item.idVideoProcesamiento &&
        item.idVideoProcesamiento !== 'Sin Video' &&
        item.idVideoProcesamiento.trim() !== '' &&
        item.estadoProcesamiento !== 'En Proceso'
    );

    // Si no hay videos válidos y se intenta seleccionar, mostrar alerta
    if (checked && videosValidos.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Sin videos disponibles',
        text: 'No hay videos configurados para seleccionar.',
        confirmButtonText: 'Entendido',
      });

      // Restablecer el estado del checkbox
      this.todosSeleccionados = false;
      if (event.target) {
        event.target.checked = false;
      }
      return;
    }

    if (checked && videosValidos.length > 0) {
      // Seleccionar todos los videos válidos con el formato correcto
      this.videosSeleccionados = videosValidos.map((item) => ({
        video_id: item.idVideoProcesamiento,
        plataforma: item.reproduccionVideo,
      }));
    } else {
      // Deseleccionar todos
      this.videosSeleccionados = [];
    }

    this.todosSeleccionados = checked;
  }

  verificarTodosSeleccionados(): void {
    const videosValidos = this.gridConfiguracionSecuenciaVideo.data.filter(
      (item) =>
        item.idVideoProcesamiento &&
        item.idVideoProcesamiento !== 'Sin Video' &&
        item.idVideoProcesamiento.trim() !== '',
    ).length;

    this.todosSeleccionados =
      videosValidos > 0 && this.videosSeleccionados.length === videosValidos;
  }

  procesarSeleccionados(): void {
    if (this.videosSeleccionados.length === 0) {
      this._alertaService.notificationWarning(
        'No hay videos seleccionados para procesar',
      );
      return;
    }

    Swal.fire({
      title: '¿Procesar videos seleccionados?',
      text: `Se procesarán ${this.videosSeleccionados.length} video(s) seleccionados`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, procesar',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.ejecutarProcesamiento(this.videosSeleccionados);
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // this.refrescarDatos();
      }
    });
  }

  procesarIndividual(dataItem: ConfiguracionVideoTutorVirtual): void {
    if (
      !dataItem.idVideoProcesamiento ||
      dataItem.idVideoProcesamiento === 'Sin Video'
    ) {
      this._alertaService.notificationWarning(
        'El video no tiene ID Video válido',
      );
      return;
    }

    const videos = [
      {
        video_id: dataItem.idVideoProcesamiento,
        plataforma: dataItem.reproduccionVideo,
      },
    ];

    if (dataItem.estadoProcesamiento === 'Completado') {
      Swal.fire({
        title: 'El video ya fue procesado',
        text: '¿Desea reprocesar este video?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, reprocesar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.ejecutarProcesamiento(videos);
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // this.refrescarDatos();
        }
      });
    } else {
      Swal.fire({
        title: 'Se procesará el video',
        text: '¿Desea procesar este video?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, procesar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: () => {
          return this.ejecutarProcesamiento(videos);
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // this.refrescarDatos();
        }
      });
    }
  }

  private ejecutarProcesamiento(
    videos: Array<{ video_id: string; plataforma: number }>,
  ): Promise<any> {
    const videosEnvio = { Videos: videos }; // Enviar como objeto con propiedad Videos (array)
    // El backend espera un objeto con propiedad Videos (array) y Usuario (opcional)
    // Usuario lo llenará el backend, así que solo enviamos Videos

    return new Promise((resolve, reject) => {
      this._integraService.postJsonResponse(constApiPlanificacion.ConfigurarVideoProgramaProcesarTutorVirtualAonline, videosEnvio)
        .subscribe({
          next: () => {
            Swal.fire("Éxito!", "Se inició el procesamiento", "success");
            setTimeout(() => {
              this.refrescarDatos();
              resolve({ success: true });
            }, 1000);
          },
          error: (err) => {
            Swal.fire('Error!', 'Ocurrió un problema al iniciar el procesamiento', 'warning');
            reject(err);
          },
        });
    });
  }

  // Método para formatear fecha (formato DD-MM-YYYY HH:mm:ss)
  formatDate(dateString: any): string {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');

      return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    } catch (error) {
      return 'Fecha inválida';
    }
  }
}

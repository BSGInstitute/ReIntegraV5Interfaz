import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import {
  ConfiguracionVideo,
  ConfiguracionVideoPrincipal,
} from '../video-evaluaciones-estructura-programa.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '@environments/environment';

interface EnvioDTO {
  reproduccionVideo: number;
  descargaVideo: number;
  idPGeneral: number;
}
interface ConteosVideo {
  idPGeneral: number;
  descargaBrightcove: number;
  descargaVimeo: number;
  reproduccionBrightcove: number;
  reproduccionVimeo: number;
}
@Component({
  selector: 'app-modal-configuracion-reproduccion-descarga',
  templateUrl: './modal-configuracion-reproduccion-descarga.component.html',
})
export class ModalConfiguracionReproduccionDescargaComponent implements OnInit {
  modalContext: NgbModalRef;
  enProcesoSolicitud: boolean = false;
  configuracionVideoPrincipal: ConfiguracionVideoPrincipal;
  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  formConfiguracionVideo: FormGroup = this._formBuilder.group({
    reproduccionVideo: [null, Validators.required],
    descargaVideo: [null, Validators.required],
  });

  conteos: ConteosVideo = {
  idPGeneral: 0,
  descargaBrightcove: 0,
  descargaVimeo: 0,
  reproduccionBrightcove: 0,
  reproduccionVimeo: 0,
  };

  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    private _alertaService: AlertaService,
    private _modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.cargarConteos(this.configuracionVideoPrincipal.idPgeneral);
  }
  get envioForm(): EnvioDTO {
    return this.formConfiguracionVideo.getRawValue() as EnvioDTO;
  }
  procesarDescargaReproduccion(): EnvioDTO {
    let DescargaReproduccion: EnvioDTO = {
      idPGeneral: this.configuracionVideoPrincipal.idPgeneral,
      reproduccionVideo: this.envioForm.reproduccionVideo,
      descargaVideo: this.envioForm.descargaVideo,
    };
    return DescargaReproduccion;
  }

  actualizar() {
    if (!this.formConfiguracionVideo.valid) {
      this.formConfiguracionVideo.markAllAsTouched();
      this._alertaService.mensajeIcon(
        'Complete todos los campos por favor'
      );
      return;
    }

    const materialAccion = this.procesarDescargaReproduccion();

    Swal.fire({
      title: '¿Estás seguro de configurar masivamente el Programa?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, Confirmo',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (!result.isConfirmed) {
        // Usuario canceló: no hacemos nada y no mostramos mensajes de validación
        return;
      }

      this.enProcesoSolicitud = true;

      this._integraService
        .putJsonResponse(
          constApiPlanificacion.ConfigurarVideoProgramaActualizarDescargaReproduccionVideo,
          JSON.stringify(materialAccion) 
        )
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            console.log(resp.body);
            this.modalContext.close();
            this._alertaService.mensajeExitoso();
            this.enProcesoSolicitud = false;
          },
          error: (error) => {
            console.log(error);
            this.enProcesoSolicitud = false;
            const mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    });
  }

    cargarConteos(idPGeneral: number): void {
    this.enProcesoSolicitud = true;

    this._integraService.getJsonResponse(
              constApiPlanificacion.ConfigurarVideoProgramaActualizarObtenerConteosdeVideosTipo +
                '/' +
                idPGeneral
            )
      .subscribe({
        next: (resp: any) => {
          const data = (resp?.body ?? resp) as any;

          // Mapeo defensivo (ajusta nombres si tu API devuelve otros)
          this.conteos = {
            idPGeneral: +data?.idPGeneral || idPGeneral,
            descargaBrightcove: +data?.cantidadDescarga_Brightcove || 0,
            descargaVimeo: +data?.cantidadDescarga_Vimeo || 0,
            reproduccionBrightcove: +data?.cantidadReproduccion_Brightcove || 0,
            reproduccionVimeo: +data?.cantidadReproduccion_Vimeo || 0,
          };

          this.enProcesoSolicitud = false;
        },
        error: (e) => {
          console.error(e);
          this.enProcesoSolicitud = false;
          const msg = this._alertaService.getMessageErrorService(e);
          this._alertaService.notificationWarning(msg);
        },
      });
  }
}

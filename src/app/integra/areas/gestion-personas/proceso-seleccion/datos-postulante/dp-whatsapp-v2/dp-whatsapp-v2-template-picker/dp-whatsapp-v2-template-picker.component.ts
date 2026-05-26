import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AlertaService } from '@shared/services/alerta.service';
import { UserService } from '@shared/services/user.service';
import {
  WhatsAppPostulanteV2Service,
  WhatsAppPostulanteV2Error,
} from '@gestionPersonas/services/whatsapp-postulante-v2.service';
import {
  PlantillaWhatsApp,
  PlantillaWhatsAppPostulante,
  WhatsAppMensajePostulantePlantillaComDTO,
} from '@gestionPersonas/models/whatsapp-postulante-v2.models';

/**
 * @component DpWhatsappV2TemplatePickerComponent (GP — WhatsApp V2)
 * @description
 *   Picker de plantillas WhatsApp para el chat 1-a-1 con el postulante.
 *
 *   Se abre como modal NgbModal secundario desde `DpWhatsappV2Component`
 *   (el modal principal del chat). Implementa una state machine de 3 vistas
 *   en el MISMO modal:
 *     - `lista`       → combo de plantillas disponibles
 *     - `preview`     → render read-only del texto + etiquetas
 *     - `confirmando` → spinner mientras se hace POST EnvioMensajePlantilla
 *
 *   IMPORTANTE: el body enviado a `enviarPlantilla` debe coincidir EXACTO con
 *   el preview recibido del backend (`waBody = preview.plantilla`,
 *   `datosPlantillaWhatsApp = preview.listaEtiquetas`). El backend ya hizo el
 *   reemplazo de etiquetas; el front NO debe editarlo.
 *
 *   No tests por design (Strict TDD desactivado, no spec file).
 */
@Component({
  selector: 'app-dp-whatsapp-v2-template-picker',
  templateUrl: './dp-whatsapp-v2-template-picker.component.html',
  styleUrls: ['./dp-whatsapp-v2-template-picker.component.scss'],
})
export class DpWhatsappV2TemplatePickerComponent implements OnInit {
  /** Postulante destinatario — provisto por el caller (container chat). */
  @Input() idPostulante!: number;
  /** País del postulante — se incluye en el body de envío. */
  @Input() idPais: number | null = null;
  /** Número WhatsApp destino — provisto por el caller. */
  @Input() waTo!: string;
  /** Nombre para mostrar en el header del picker. */
  @Input() nombrePostulante: string | null = null;

  // State machine
  paso: 'lista' | 'preview' | 'confirmando' = 'lista';

  // Lista
  plantillas: PlantillaWhatsApp[] = [];
  cargandoLista = false;

  // Preview
  plantillaSeleccionada: PlantillaWhatsApp | null = null;
  preview: PlantillaWhatsAppPostulante | null = null;
  cargandoPreview = false;

  // Error visible en cualquier paso (la UI elige dónde mostrarlo)
  error: string | null = null;

  constructor(
    public activeModal: NgbActiveModal,
    private readonly _whatsapp: WhatsAppPostulanteV2Service,
    private readonly _userService: UserService,
    private readonly _alerta: AlertaService,
    private readonly _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarPlantillas();
  }

  /** Vuelve del preview a la lista. Limpia selección y error. */
  volver(): void {
    this.paso = 'lista';
    this.plantillaSeleccionada = null;
    this.preview = null;
    this.error = null;
  }

  /** Cierra el modal sin enviar (botón X o "Cancelar"). */
  cerrar(): void {
    this.activeModal.dismiss();
  }

  /** State 1 → 2: usuario elige una plantilla, generamos el preview. */
  seleccionarPlantilla(p: PlantillaWhatsApp): void {
    this.plantillaSeleccionada = p;
    this.paso = 'preview';
    this.preview = null;
    this.error = null;
    this.cargandoPreview = true;

    this._whatsapp
      .generarPreviewPlantilla({
        // Coerción defensiva: backend devuelve idPlantilla como string en el combo.
        idPlantilla: Number(p.idPlantilla),
        idPersonal: this._userService.idPersonal,
        idPostulante: this.idPostulante,
        usuario: this._userService.userName,
        fecha: null,
      })
      .subscribe({
        next: (resp) => {
          this.preview = resp ?? null;
          this.cargandoPreview = false;
          this._cdr.markForCheck();
        },
        error: (err: WhatsAppPostulanteV2Error) => {
          this.cargandoPreview = false;
          this.error =
            err?.mensaje ?? 'No se pudo generar el preview, reintentá';
          this._cdr.markForCheck();
        },
      });
  }

  /** State 2 → 3: confirma el envío. Body == preview EXACTO. */
  confirmar(): void {
    if (
      !this.preview ||
      !this.plantillaSeleccionada ||
      !this.waTo ||
      this.cargandoPreview
    ) {
      return;
    }

    // Mapeo verificado con DB real + V1 dp-whatsapp-postulantes líneas 594-600:
    //   - waBody    = preview.descripcion (nombre/code de la plantilla)
    //   - waCaption = preview.plantilla   (texto rendered al postulante)
    //   - waType    = 'hsm'               (literal Meta)
    const body: WhatsAppMensajePostulantePlantillaComDTO = {
      waTo: this.waTo,
      waType: 'hsm',
      waCaption: this.preview.plantilla,
      waBody: this.preview.descripcion,
      waTypeMensaje: 8,
      // Coerción defensiva: backend devuelve idPlantilla como string en el combo.
      idPlantilla: Number(this.plantillaSeleccionada.idPlantilla),
      idPais: this.idPais ?? null,
      idPostulante: this.idPostulante,
      idPersonal: this._userService.idPersonal,
      usuario: this._userService.userName,
      datosPlantillaWhatsApp: this.preview.listaEtiquetas ?? [],
    };

    this.paso = 'confirmando';
    this.error = null;

    this._whatsapp.enviarPlantilla(body).subscribe({
      next: () => {
        this.activeModal.close({ ok: true });
      },
      error: (err: WhatsAppPostulanteV2Error) => {
        // Volvemos al preview para que el asesor pueda reintentar.
        this.paso = 'preview';
        this.error = err?.mensaje ?? 'No se pudo enviar la plantilla, reintentá';
        this._cdr.markForCheck();
      },
    });
  }

  private cargarPlantillas(): void {
    this.cargandoLista = true;
    this.error = null;

    this._whatsapp.obtenerPlantillas().subscribe({
      next: (lista) => {
        this.plantillas = lista ?? [];
        this.cargandoLista = false;
        this._cdr.markForCheck();
      },
      error: (err: WhatsAppPostulanteV2Error) => {
        this.cargandoLista = false;
        if (err?.mensaje) this._alerta.notificationWarning(err.mensaje);
        this.activeModal.dismiss('error');
      },
    });
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { constApiMarketing } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// === Modelo de datos ===

type TipoBloque = 'imagen' | 'texto' | 'contenido-ia' | 'boton' | 'tres-columnas' | 'redes-sociales';

interface BloqueBase {
  id: string;
  tipo: TipoBloque;
  orden: number;
}

interface BloqueImagen extends BloqueBase {
  tipo: 'imagen';
  urlImagen: string;
  altTexto: string;
  urlRedireccionamiento: string;
}

interface BloqueTexto extends BloqueBase {
  tipo: 'texto';
  contenidoHtml: string;
}

interface BloqueContenidoIA extends BloqueBase {
  tipo: 'contenido-ia';
}

interface BloqueBoton extends BloqueBase {
  tipo: 'boton';
  texto: string;
  enlace: string;
  colorFondo: string;
  colorTexto: string;
  alineamiento: string;
}

interface BloqueTresColumnas extends BloqueBase {
  tipo: 'tres-columnas';
  titulo: string;
  columnas: {
    urlImagen: string;
    descripcion: string;
    enlace: string;
  }[];
}

interface BloqueRedesSociales extends BloqueBase {
  tipo: 'redes-sociales';
  redes: {
    nombre: string;
    url: string;
    icono: string;
  }[];
}

type Bloque = BloqueImagen | BloqueTexto | BloqueContenidoIA | BloqueBoton | BloqueTresColumnas | BloqueRedesSociales;

@Component({
  selector: 'app-canvas-plantilla',
  templateUrl: './canvas-plantilla.component.html',
  styleUrls: ['./canvas-plantilla.component.scss'],
})
export class CanvasPlantillaComponent implements OnInit {
  @Input() idCampania: number;
  @Input() visible = false;
  @Output() cerrar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  bloques: Bloque[] = [];
  isLoadingCanvas = false;
  isSavingCanvas = false;
  canvasExistente = false;
  canvasId: number | null = null;

  // Imágenes de storage
  listaImagenes: any[] = [];
  uploadStates: { [key: string]: { preview: string | null; file: File | null; uploading: boolean } } = {};

  // Redes sociales
  readonly redesColores: { [key: string]: string } = {
    'Instagram': '#E4405F',
    'Facebook': '#1877F2',
    'Twitter/X': '#000000',
    'LinkedIn': '#0A66C2',
    'YouTube': '#FF0000',
  };

  private readonly redesIconoUrlMap: { [key: string]: string } = {
    'Instagram': 'https://img.icons8.com/color/48/instagram-new.png',
    'Facebook': 'https://img.icons8.com/color/48/facebook.png',
    'Twitter/X': 'https://img.icons8.com/color/48/twitter--v1.png',
    'LinkedIn': 'https://img.icons8.com/color/48/linkedin.png',
    'YouTube': 'https://img.icons8.com/color/48/youtube-play.png',
  };

  private readonly FIRMA_HTML = '<div style="text-align:center;margin:24px 0 8px;">' +
    '<img src="https://img.mailinblue.com/4995647/images/content_library/original/642b3c39df855a04962152cc.png" ' +
    'alt="Firma" style="max-width:30%;height:auto;" /></div>';

  private readonly FIRMA_IMG_ID = '642b3c39df855a04962152cc.png';

  private conFirma(html: string): string {
    return html.includes(this.FIRMA_IMG_ID) ? html : html + this.FIRMA_HTML;
  }

  // CKEditor
  Editor = ClassicEditor;
  editorConfig = {
    toolbar: {
      items: [
        'undo', 'redo', '|', 'heading', '|', 'bold', 'italic', '|', 'link', 'blockQuote', 'insertTable', '|', 'bulletedList', 'numberedList', 'outdent', 'indent'
      ],
      shouldNotGroupWhenFull: true
    },
    table: {
      contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
    }
  };

  constructor(
    private integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtenerCanvas();
    this.obtenerImagenes();
  }

  private generarId(): string {
    return 'bloque-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now();
  }

  private actualizarOrdenes(): void {
    this.bloques.forEach((b, i) => (b.orden = i));
  }

  agregarBloque(tipo: TipoBloque): void {
    let bloque: Bloque;
    const id = this.generarId();
    const orden = this.bloques.length;

    switch (tipo) {
      case 'imagen':
        bloque = { id, tipo, orden, urlImagen: '', altTexto: '', urlRedireccionamiento: '' };
        break;
      case 'texto':
        bloque = { id, tipo, orden, contenidoHtml: '' };
        break;
      case 'boton':
        bloque = { id, tipo, orden, texto: 'Click aquí', enlace: '', colorFondo: '#3f51b5', colorTexto: '#ffffff', alineamiento: 'center' };
        break;
      case 'tres-columnas':
        bloque = {
          id, tipo, orden,
          titulo: '',
          columnas: [
            { urlImagen: '', descripcion: '', enlace: '' },
            { urlImagen: '', descripcion: '', enlace: '' },
            { urlImagen: '', descripcion: '', enlace: '' },
          ],
        };
        break;
      case 'redes-sociales':
        bloque = {
          id, tipo, orden,
          redes: [
            { nombre: 'Instagram', url: '', icono: 'fa-instagram' },
            { nombre: 'Facebook', url: '', icono: 'fa-facebook' },
            { nombre: 'Twitter/X', url: '', icono: 'fa-twitter' },
            { nombre: 'LinkedIn', url: '', icono: 'fa-linkedin' },
            { nombre: 'YouTube', url: '', icono: 'fa-youtube' },
          ],
        };
        break;
      default:
        return;
    }

    this.bloques.push(bloque);
    this.actualizarOrdenes();
  }

  eliminarBloque(id: string): void {
    this.bloques = this.bloques.filter((b) => b.id !== id);
    this.actualizarOrdenes();
  }

  drop(event: CdkDragDrop<Bloque[]>): void {
    moveItemInArray(this.bloques, event.previousIndex, event.currentIndex);
    this.actualizarOrdenes();
  }

  // === Serialización a HTML ===

  private bloqueAHtml(bloque: Bloque): string {
    switch (bloque.tipo) {
      case 'imagen': {
        if (!bloque.urlImagen) return '';
        const imgTag = `<img src="${this.escaparHtml(bloque.urlImagen)}" alt="${this.escaparHtml(bloque.altTexto)}" style="max-width:100%;height:auto;" />`;
        const imgContent = bloque.urlRedireccionamiento
          ? `<a href="${this.escaparHtml(bloque.urlRedireccionamiento)}">${imgTag}</a>`
          : imgTag;
        return `<div style="text-align:center;margin:16px 0;">${imgContent}</div>`;
      }
      case 'texto':
        return bloque.contenidoHtml ? `<div style="margin:16px 0;">${bloque.contenidoHtml}</div>` : '';
      case 'boton':
        return `<div style="text-align:${bloque.alineamiento || 'center'};margin:16px 0;"><a href="${this.escaparHtml(bloque.enlace)}" style="display:inline-block;padding:12px 24px;background-color:${bloque.colorFondo};color:${bloque.colorTexto};text-decoration:none;border-radius:4px;font-weight:600;">${this.escaparHtml(bloque.texto)}</a></div>`;
      case 'tres-columnas': {
        const tituloHtml = bloque.titulo
          ? `<h3 style="text-align:center;margin:0 0 12px 0;">${this.escaparHtml(bloque.titulo)}</h3>`
          : '';
        const cols = bloque.columnas
          .map(
            (c) =>
              `<td style="width:33.33%;padding:8px;vertical-align:top;text-align:center;">` +
              (c.urlImagen
                ? c.enlace
                  ? `<a href="${this.escaparHtml(c.enlace)}"><img src="${this.escaparHtml(c.urlImagen)}" style="max-width:100%;height:auto;margin-bottom:8px;" /></a>`
                  : `<img src="${this.escaparHtml(c.urlImagen)}" style="max-width:100%;height:auto;margin-bottom:8px;" />`
                : '') +
              (c.enlace
                ? `<p style="font-size:13px;color:#555;"><a href="${this.escaparHtml(c.enlace)}" style="color:inherit;text-decoration:none;">${this.escaparHtml(c.descripcion)}</a></p>`
                : `<p style="font-size:13px;color:#555;">${this.escaparHtml(c.descripcion)}</p>`) +
              (c.enlace ? `<a href="${this.escaparHtml(c.enlace)}" style="color:#3f51b5;font-weight:600;">Leer más</a>` : '') +
              `</td>`
          )
          .join('');
        return `<div style="margin:16px 0;">${tituloHtml}<table style="width:100%;border-collapse:collapse;"><tr>${cols}</tr></table></div>`;
      }
      case 'redes-sociales': {
        const redesHtml = bloque.redes
          .filter((r) => r.url)
          .map((r) => {
            const iconUrl = this.redesIconoUrlMap[r.nombre];
            const contenido = iconUrl
              ? `<img src="${iconUrl}" alt="${this.escaparHtml(r.nombre)}" width="36" height="36" style="vertical-align:middle;border-radius:50%;" />`
              : `<span style="font-weight:600;">${this.escaparHtml(r.nombre)}</span>`;
            return `<a href="${this.escaparHtml(r.url)}" style="display:inline-block;margin:0 6px;text-decoration:none;">${contenido}</a>`;
          })
          .join('');
        return redesHtml ? `<div style="text-align:center;margin:16px 0;">${redesHtml}</div>` : '';
      }
      default:
        return '';
    }
  }

  private escaparHtml(texto: string): string {
    if (!texto) return '';
    return texto
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // === Guardado ===

  guardar(): void {
    const indiceIA = this.bloques.findIndex((b) => b.tipo === 'contenido-ia');
    let contenidoSuperior = '';
    let contenidoInferior = '';

    if (indiceIA === -1) {
      // Si no hay bloque IA (no debería pasar), todo va a superior
      contenidoSuperior = this.conFirma(this.bloques.map((b) => this.bloqueAHtml(b)).join(''));
    } else {
      contenidoSuperior = this.bloques
        .slice(0, indiceIA)
        .map((b) => this.bloqueAHtml(b))
        .join('');
      contenidoInferior = this.conFirma(
        this.bloques
          .slice(indiceIA + 1)
          .map((b) => this.bloqueAHtml(b))
          .join('')
      );
    }

    const configuracionBloques = JSON.stringify(this.bloques);

    const payload = {
      id: this.canvasId,
      idRemarketingCampaniaGeneral: this.idCampania,
      contenidoSuperior,
      contenidoInferior,
      configuracionBloques,
    };

    this.isSavingCanvas = true;
    const endpoint = this.canvasExistente
      ? constApiMarketing.ActualizarCampaniaCanvas
      : constApiMarketing.InsertarCampaniaCanvas;

    this.integraService.postJsonResponse(`${endpoint}`, payload).subscribe({
      next: (data: any) => {
        if (data.body) {
          this._alertaService.mensajeIcon(
            '¡Éxito!',
            this.canvasExistente ? 'Plantilla actualizada correctamente.' : 'Plantilla guardada correctamente.',
            'success'
          );
          this.canvasExistente = true;
          if (data.body.id) {
            this.canvasId = data.body.id;
          }
          this.guardado.emit();
        } else {
          this._alertaService.mensajeIcon('¡Alerta!', 'No se pudo guardar la plantilla.', 'warning');
        }
        this.isSavingCanvas = false;
      },
      error: () => {
        this._alertaService.mensajeIcon('Error', 'Hubo un error al guardar la plantilla.', 'error');
        this.isSavingCanvas = false;
      },
    });
  }

  // === Obtener canvas existente ===

  obtenerCanvas(): void {
    if (!this.idCampania) return;
    this.isLoadingCanvas = true;
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerCampaniaCanvas}/${this.idCampania}`)
      .subscribe({
        next: (data: any) => {
          if (data.body) {
            const canvas = data.body;
            this.canvasId = canvas.id;
            this.canvasExistente = true;

            if (canvas.configuracionBloques) {
              // Nuevo formato: reconstruir bloques desde JSON
              try {
                this.bloques = JSON.parse(canvas.configuracionBloques);
              } catch {
                this.cargarDesdeFormatoAntiguo(canvas);
              }
            } else {
              // Backward compatibility: formato antiguo
              this.cargarDesdeFormatoAntiguo(canvas);
            }
          } else {
            this.inicializarBloquesDefault();
          }
          this.isLoadingCanvas = false;
        },
        error: () => {
          this.inicializarBloquesDefault();
          this.isLoadingCanvas = false;
        },
      });
  }

  private cargarDesdeFormatoAntiguo(canvas: any): void {
    this.bloques = [];
    if (canvas.contenidoSuperior) {
      this.bloques.push({
        id: this.generarId(),
        tipo: 'texto',
        orden: 0,
        contenidoHtml: canvas.contenidoSuperior,
      });
    }
    this.bloques.push({
      id: this.generarId(),
      tipo: 'contenido-ia',
      orden: this.bloques.length,
    });
    if (canvas.contenidoInferior) {
      this.bloques.push({
        id: this.generarId(),
        tipo: 'texto',
        orden: this.bloques.length,
        contenidoHtml: canvas.contenidoInferior,
      });
    }
    this.actualizarOrdenes();
  }

  private inicializarBloquesDefault(): void {
    this.bloques = [
      {
        id: this.generarId(),
        tipo: 'contenido-ia',
        orden: 0,
      },
    ];
  }

  // === Eliminar canvas ===

  eliminarCanvas(): void {
    if (!this.idCampania) return;
    this.isSavingCanvas = true;
    this.integraService
      .postJsonResponse(`${constApiMarketing.EliminarCampaniaCanvas}`, this.idCampania)
      .subscribe({
        next: (data: any) => {
          if (data.body) {
            this._alertaService.mensajeIcon('¡Éxito!', 'Plantilla eliminada correctamente.', 'success');
            this.canvasExistente = false;
            this.canvasId = null;
            this.inicializarBloquesDefault();
            this.cerrar.emit();
          } else {
            this._alertaService.mensajeIcon('¡Alerta!', 'No se pudo eliminar la plantilla.', 'warning');
          }
          this.isSavingCanvas = false;
        },
        error: () => {
          this._alertaService.mensajeIcon('Error', 'Hubo un error al eliminar la plantilla.', 'error');
          this.isSavingCanvas = false;
        },
      });
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  // === Gestión de imágenes de storage ===

  obtenerImagenes(): void {
    this.integraService.obtener(constApiMarketing.ObtenerImagenesPlantilla).subscribe({
      next: (response: any) => {
        this.listaImagenes = response.body || [];
      },
      error: () => {},
    });
  }

  getUploadState(key: string) {
    if (!this.uploadStates[key]) {
      this.uploadStates[key] = { preview: null, file: null, uploading: false };
    }
    return this.uploadStates[key];
  }

  onFileSelectedBloque(event: any, key: string): void {
    const file: File = event.target.files[0];
    if (!file) return;
    const state = this.getUploadState(key);
    state.file = file;
    const reader = new FileReader();
    reader.onload = (e: any) => { state.preview = e.target.result; };
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  getIconoFA(icono: string): IconProp {
    return ['fab', icono.replace('fa-', '')] as IconProp;
  }

  getRedColor(nombre: string): string {
    return this.redesColores[nombre] || '#555555';
  }

  subirImagenBloque(key: string): void {
    const state = this.uploadStates[key];
    if (!state?.file) return;
    state.uploading = true;
    const fdata = new FormData();
    fdata.append('file', state.file);
    this.integraService.postFormJson(constApiMarketing.InsertarImagen, fdata).subscribe({
      next: () => {},
      error: () => {
        this._alertaService.mensajeIcon('Error', 'No se pudo subir la imagen.', 'error');
        state.uploading = false;
      },
      complete: () => {
        this._alertaService.mensajeIcon('¡Éxito!', 'Imagen subida correctamente. Selecciónela del listado.', 'success');
        state.uploading = false;
        state.preview = null;
        state.file = null;
        this.obtenerImagenes();
      },
    });
  }
}

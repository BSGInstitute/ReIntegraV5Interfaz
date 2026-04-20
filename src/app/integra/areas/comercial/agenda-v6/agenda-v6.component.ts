import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-agenda-v6',
  templateUrl: './agenda-v6.component.html',
  styleUrls: ['./agenda-v6.component.scss']
})
export class AgendaV6Component implements OnInit, OnDestroy {
  @ViewChild('iframeAgenda', { static: true }) iframeRef!: ElementRef<HTMLIFrameElement>;

  private readonly URL_AGENDA_V6 =
    'https://integrav5-nuevaagendaia.bsginstitute.com/comercial/agenda/';

  private readonly ORIGEN_V6 = 'https://integrav5-nuevaagendaia.bsginstitute.com';

  urlSegura!: SafeResourceUrl;
  cargando = true;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.urlSegura = this.sanitizer.bypassSecurityTrustResourceUrl(this.URL_AGENDA_V6);
    window.addEventListener('message', this.manejarMensaje);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.manejarMensaje);
  }

  alCargar(): void {
    this.cargando = false;
  }

  private manejarMensaje = (event: MessageEvent): void => {
    if (event.origin !== this.ORIGEN_V6) {
      return;
    }
    console.log('[AgendaV6] mensaje recibido:', event.data);
  };

  enviarMensajeAV6(mensaje: unknown): void {
    this.iframeRef.nativeElement.contentWindow?.postMessage(mensaje, this.ORIGEN_V6);
  }
}

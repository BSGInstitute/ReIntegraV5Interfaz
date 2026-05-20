import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-nueva-agenda-atc',
  templateUrl: './nueva-agenda-atc.component.html',
  styleUrls: ['./nueva-agenda-atc.component.scss']
})
export class NuevaAgendaAtcComponent implements OnInit, OnDestroy {
  @ViewChild('iframeAgendaAtc', { static: true }) iframeRef!: ElementRef<HTMLIFrameElement>;

  private readonly URL_AGENDA_ATC =
    'https://integrav5-nuevaagendaatc.bsginstitute.com/atencion-Cliente/home/';

  private readonly ORIGEN_ATC = 'https://integrav5-nuevaagendaatc.bsginstitute.com';

  urlSegura!: SafeResourceUrl;
  cargando = true;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.urlSegura = this.sanitizer.bypassSecurityTrustResourceUrl(this.URL_AGENDA_ATC);
    window.addEventListener('message', this.manejarMensaje);
  }

  ngOnDestroy(): void {
    window.removeEventListener('message', this.manejarMensaje);
  }

  alCargar(): void {
    this.cargando = false;
  }

  private manejarMensaje = (event: MessageEvent): void => {
    if (event.origin !== this.ORIGEN_ATC) {
      return;
    }
    console.log('[NuevaAgendaAtc] mensaje recibido:', event.data);
  };

  enviarMensajeAAtc(mensaje: unknown): void {
    this.iframeRef.nativeElement.contentWindow?.postMessage(mensaje, this.ORIGEN_ATC);
  }
}

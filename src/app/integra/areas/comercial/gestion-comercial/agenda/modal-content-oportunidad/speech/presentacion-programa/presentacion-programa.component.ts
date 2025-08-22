import { Subscription } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-presentacion-programa',
  templateUrl: './presentacion-programa.component.html',
  styleUrls: ['./presentacion-programa.component.scss']
})
export class PresentacionProgramaComponent implements OnInit {
  @Input() agendaService: AgendaService;
  dataProgramaGeneralSpeech: Array<{ id: number; nombre: string }>;
  idPGeneral: number = 0;
  informacionProgramaSpeech: SafeHtml = '';
  private _subscriptions$: Subscription = new Subscription();
  loadingPrograma: boolean = false;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  constructor(private _sanitizer: DomSanitizer) {}
  ngOnInit(): void {
    this.initSubscribeObservables();
  }
  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
    this._subscriptions$ = null;
  }
  private initSubscribeObservables() {
    this.loadingPrograma = true;

    let sub1$ =
      this.agendaService.agendaInformacionActividadOportunidadService.agendaConfiguraciones$.subscribe(
        (resp) => {
          if (resp != null) {
            this.dataProgramaGeneralSpeech = resp.programasGenerales;
          }
        }
      );
      let sub2$ =
      this.agendaService.agendaInformacionActividadOportunidadService.informacionProgramaAgendaV2$.subscribe(
        (resp) => {
          if (resp != null) {
            this.loadingPrograma = false;
            this.idPGeneral = resp.respuesta.idPGeneral;
            this.informacionProgramaSpeech = this._sanitizer.bypassSecurityTrustHtml(
              resp.respuesta.informacionPrograma
            );
          }
        }
      );
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
  }
  changeProgramaGeneral(idPgeneral: number) {
    this.loadingPrograma = true;
    this.informacionProgramaSpeech = '';
    if (idPgeneral) {
      this.agendaService.agendaInformacionActividadOportunidadService
        .obtenerInformacionProgramaSpeech$(String(idPgeneral))
        .subscribe({
          next: (resp: HttpResponse<{ informacionPrograma: string }>) => {
            this.informacionProgramaSpeech = this._sanitizer.bypassSecurityTrustHtml(
              resp.body.informacionPrograma
            );
            this.loadingPrograma = false;
          },
        });
    }
  }
}

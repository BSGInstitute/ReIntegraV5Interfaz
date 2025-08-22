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
/**
  Modulo InformacionProgramaComponent ***
  @autor Miguel Quiñones ***
 * @version 1.0.1
   History
 * 15/111/2022 Migracion Modulo de V4
 */
@Component({
  selector: 'app-informacion-programa',
  templateUrl: './informacion-programa.component.html',
  styleUrls: ['./informacion-programa.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class InformacionProgramaComponent implements OnInit, OnDestroy {
  @Input() agendaService: AgendaService;
  dataProgramaGeneral: Array<{ id: number; nombre: string }>;
  idPGeneral: number = 0;
  informacionPrograma: SafeHtml = '';
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
      this.agendaService.agendaInformacionActividadOportunidadService.informacionProgramaV1$.subscribe(
        (resp) => {
          if (resp != null) {
            this.loadingPrograma = false;
            this.idPGeneral = resp.respuesta.idPGeneral;
            this.informacionPrograma = this._sanitizer.bypassSecurityTrustHtml(
              resp.respuesta.informacionPrograma
            );
          }
        }
      );
    let sub2$ =
      this.agendaService.agendaInformacionActividadOportunidadService.agendaConfiguraciones$.subscribe(
        (resp) => {
          if (resp != null) {
            this.dataProgramaGeneral = resp.programasGenerales;
          }
        }
      );
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
  }
  changeProgramaGeneral(idPgeneral: number) {
    this.loadingPrograma = true;
    this.informacionPrograma = '';
    if (idPgeneral) {
      this.agendaService.agendaInformacionActividadOportunidadService
        .obtenerInformacionPrograma$(String(idPgeneral))
        .subscribe({
          next: (resp: HttpResponse<{ informacionPrograma: string }>) => {
            this.informacionPrograma = this._sanitizer.bypassSecurityTrustHtml(
              resp.body.informacionPrograma
            );
            this.loadingPrograma = false;
          },
        });
    }
  }
}

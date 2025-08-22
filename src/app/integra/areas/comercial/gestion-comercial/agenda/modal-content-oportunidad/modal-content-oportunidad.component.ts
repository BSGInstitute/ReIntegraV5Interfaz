import { Subscription } from 'rxjs';
import {
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CrmService } from '@shared/services/crm.service';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-modal-content-oportunidad',
  templateUrl: './modal-content-oportunidad.component.html',
  styleUrls: ['./modal-content-oportunidad.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalContentOportunidadComponent implements OnInit {
  @Input() agendaService: AgendaService;
  constructor(
    private _crmService: CrmService,
    public _activeModal: NgbActiveModal,
    private _alertaService: AlertaService,
    private _sharedService: SharedService
  ) {}
  totalIntentos: number = 0
  private _subscriptions$: Subscription = new Subscription();
  ngOnInit(): void {
    this._crmService.esFichaAbierta = true;
    this.agendaService.esFichaAbierta = true;
  }
  get totalIntentos$(){
    return this._crmService.actualizarTotalIntentos$
  }
  get tabActual(){
    return this.agendaService.tabOrigen ?? this.agendaService.obtenerNombreTab();
  }
  ngOnDestroy(){
    this._subscriptions$.unsubscribe();
    this._crmService.esFichaAbierta = false;
    this.agendaService.esFichaAbierta = false;
  }
  cerrarModalOportunidad(){
    if(!this._crmService.esMarcadorActivo$.value){
      this._sharedService.showComentarioFicha$.next(false);
      this._sharedService.guardarComentarioTemporal();
      this._sharedService.comentarioActividad$.next('');
      this.agendaService.closeModalOportunidad();
    }else{
      this._alertaService.swalFireOptions({
        icon: 'info',
        text: 'No puede cerrar la ficha, porque debe programar el dato'
      })
    }
  }
  recargarFicha(){
    this.agendaService.initFichas();
  }
}

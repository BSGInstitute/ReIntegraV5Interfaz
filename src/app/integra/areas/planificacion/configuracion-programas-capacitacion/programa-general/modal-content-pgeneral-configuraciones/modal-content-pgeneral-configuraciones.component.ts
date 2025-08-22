import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-content-pgeneral-configuraciones',
  templateUrl: './modal-content-pgeneral-configuraciones.component.html',
  styleUrls: ['./modal-content-pgeneral-configuraciones.component.scss'],
})
export class ModalContentPgeneralConfiguracionesComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal) {}
  @Input() pgeneralService: PgeneralService;

  modalRef: any;
  loaderModal: boolean = false;
  nombrePgeneral: string = '';
  subscriptions$: Subscription = new Subscription();

  ngOnInit(): void {
    this.nombrePgeneral = this.dataItemPgeneral.nombre;
  }
  get dataItemPgeneral() {
    return this.pgeneralService.dataItemPgeneral;
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
@Component({
  selector: 'app-modal-content-pgeneral-modelo-predictivo',
  templateUrl: './modal-content-pgeneral-modelo-predictivo.component.html',
  styleUrls: ['./modal-content-pgeneral-modelo-predictivo.component.scss']
})
export class ModalContentPgeneralModeloPredictivoComponent implements OnInit {

  constructor(private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService) { }
    @Input() pgeneralService: PgeneralService;
  ngOnInit(): void {
  }

}

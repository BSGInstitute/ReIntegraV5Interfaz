import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
@Component({
  selector: 'app-registro-marcador-fecha',
  templateUrl: './registro-marcador-fecha.component.html',
  styleUrls: ['./registro-marcador-fecha.component.scss'],
})
export class RegistroMarcadorFechaComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}
  enProcesoSolicitud: boolean = false;
  gridMarcaciones: KendoGrid = new KendoGrid();
  ngOnInit(): void {}
}

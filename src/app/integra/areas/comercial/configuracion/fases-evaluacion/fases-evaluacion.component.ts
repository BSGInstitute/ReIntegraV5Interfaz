
import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiComercial } from '@environments/constApi';
import Swal from 'sweetalert2';
import { PageSizeItem } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-fases-evaluacion',
  templateUrl: './fases-evaluacion.component.html',
  styleUrls: ['./fases-evaluacion.component.scss']
})
export class FasesEvaluacionComponent implements OnInit {

  constructor(
      private _integraService: IntegraService,
      private _alertaService: AlertaService,
      private _formBuilder: FormBuilder,
      private _modalService: NgbModal

  ) { }

  ngOnInit(): void {
  }

}

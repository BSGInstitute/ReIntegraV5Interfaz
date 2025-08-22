
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';



@Component({
  selector: 'app-desglosable-revertir-cambio-fase',
  templateUrl: './desglosable-revertir-cambio-fase.component.html',
  styleUrls: ['./desglosable-revertir-cambio-fase.component.scss']
})
export class DesglosableRevertirCambioFaseComponent implements OnInit, OnChanges {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.row)

    if(this.row!= undefined){
      this.listaDetalle= this.row
    }
  }

  listaDetalle:any=[]
  loader=false
  @Input() row:any;
  ngOnInit(): void {
    console.log(this.row)
  }

}

import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DRAWER_DEFAULT_AUTOSIZE_FACTORY } from '@angular/material/sidenav';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import {
  ListaSede,
  ReporteEgresoPorRubro,
} from '@integra/models/reporte-egreso-por-rubro';
import { ReporteEstadoCuentaProveedor } from '@integra/models/reporte-estado-cuenta-proveedor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';


@Component({
  selector: 'app-visualizacion-desglose-reporte',
  templateUrl: './visualizacion-desglose-reporte.component.html',
  styleUrls: ['./visualizacion-desglose-reporte.component.scss']
})
export class VisualizacionDesgloseReporteComponent implements OnInit ,OnChanges{

  constructor(   
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    ) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.row)

    if(this.row!= undefined){
      this.listaDesglose= this.row.listaDesglose
    }
  }

  listaDesglose:any=[]
  loader=false
  @Input() row:any;
  ngOnInit(): void {
    console.log(this.row)
  }

}

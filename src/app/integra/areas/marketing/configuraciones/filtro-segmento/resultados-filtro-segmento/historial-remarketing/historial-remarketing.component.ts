import { Component, OnInit, Inject, ViewChild, Input, AfterViewInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-historial-remarketing',
  templateUrl: './historial-remarketing.component.html',
  styleUrls: ['./historial-remarketing.component.scss']
})
export class HistorialRemarketingComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
  ) { }

  displayedColumns: string[] = ['cuenta', 'facebookId','nombre','fecha', 'subtype', 'acciones','lookalikePeru','lookalikeCol'];
  loading:any
  dataSourceEP:any
  Lengt:any
  listaHistorial:any

  @Input() id: any;

  ngOnInit(): void {
    this.obtenerHistorialAudiencia()
    setInterval(() => {
      this.obtenerHistorialAudiencia();
    }, 5000); // Se actualizará cada 4 segundos
  }

  //----------------------------Funciones Obtener---------------------------------------//

  obtenerHistorialAudiencia(){
    this.loading = true;
    this.integraService.post(constApiMarketing.ObtenerHistorialAudiencia + '?IdFiltroSegmento=' + this.id).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.body);
        this.loading = false;
        this.listaHistorial = response.body;
      },

      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

//---------------------CONTROL GRID ---------------------------------------------
gridEventsResponse(action:string,dataItem?:any,rowIndex?:any): void {
  console.log(action)
  switch (action) {
    case 'compartir':
      console.log(dataItem);
      console.log(rowIndex);

      break;
    case 'crear':
      console.log(dataItem);
      // this.openModalRECEditar(dataItem);
      break;
    case 'crear2':
      console.log(dataItem);
      // this.cambiarEsCancelado(dataItem);
      break;

  }
}


}

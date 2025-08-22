import {
  Component,
  OnInit,
  Inject,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { SendinblueComponent } from '../sendinblue.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';

import { HttpResponse } from '@angular/common/http';
import {
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { estadoEnvio } from '@integra/models/campania-sendinblue';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-estado-en-proceso',
  templateUrl: './estado-en-proceso.component.html',
  styleUrls: ['./estado-en-proceso.component.scss']
})
export class EstadoEnProcesoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  displayedColumns: string[] = ['numero', 'nombre', 'fecha','fechaEnvio', 'tipo','acciones'];

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
  ) { }

  ngOnInit(): void {
    this.estadoEnProceso()
  }

  public estadoEnvioEP: estadoEnvio = {
    type: 'classic',
    status: 'inProcess',
    limit: 20,
    offset: 0
  };

  offset: number
  loading:boolean
  listaEnProceso:any
  listaEnProceso2:any
  dataSourceEP: any;
  current=0;

  Lengt=0;

  Paginador(a: any) {
    this.current=a.pageIndex;
    this.estadoEnProceso()
  }



  estadoEnProceso(){
    // this.estadoEnvio.offset= offset*20;
    this.integraService
    .insertar(
      constApiMarketing.SendinblueObtener,
      this.estadoEnvioEP
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('Datos respuesta', response.body);
        this.listaEnProceso = response.body;
        this.listaEnProceso2 = JSON.parse(
          this.listaEnProceso.sendingblueRespuesta
        );
        console.log(this.listaEnProceso2)
        this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
          var js = this.listaEnProceso2;
          console.log(js);
          console.log(js.count);
          this.dataSourceEP = new MatTableDataSource(js.campaigns);
          this.dataSourceEP.sort = this.sort;
          setTimeout(() => {
            this.paginator.pageIndex = this.current;
            this.paginator._intl.getRangeLabel = (
              page: number,
              pageSize: number,
              length: number
            ) => {
              return `Pagina ${page + 1} de ${length}`;
            };
          });

          console.log(this.paginator)
          this.dataSourceEP.paginator = this.paginator;
      },

      error: (error) => {
        console.log(error);
        this.alertaService.mensajeError(error);
      },

      complete: () => {
      },
    });
  }

}


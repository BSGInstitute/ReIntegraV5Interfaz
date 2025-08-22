import {
  Component,
  OnInit,
  Inject,
  OnChanges,
  SimpleChanges,
  ViewChild,
  EventEmitter,
  Output,
  Input,
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
  selector: 'app-estado-en-cola',
  templateUrl: './estado-en-cola.component.html',
  styleUrls: ['./estado-en-cola.component.scss']
})
export class EstadoEnColaComponent implements OnInit, OnChanges  {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

    
  displayedColumns: string[] = ['numero', 'nombre', 'fecha','fechaEnvio', 'tipo', 'acciones'];


  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
  ) { }

  ngOnInit(): void {
    this.estadoEnCola()
  }

  ngOnChanges(): void {

    if(this.actualizar<this.item){
      this.estadoEnCola()
      console.log("si funca");
      console.log(this.item)

    }
  }

  @Output() funcionEditar = new EventEmitter<any>();
  @Output() funcionCambiarE= new EventEmitter<any>();
  @Input() item:any;

  public estadoEnvioEC: estadoEnvio = {
    type: 'classic',
    status: 'queued',
    limit: 20,
    offset: 0
  };

  actualizar=0;

  offset: number
  loading:boolean
  listaEnCola:any
  listaEnCola2:any
  dataSource: any;
  current=0;

  Lengt=0;

  Paginador(a: any) {
    this.current=a.pageIndex;
    this.estadoEnCola()
  }



  estadoEnCola(){
    // this.estadoEnvio.offset= offset*20;
    this.loading=true;
    this.integraService
    .insertar(
      constApiMarketing.SendinblueObtener,
      this.estadoEnvioEC
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('Datos respuesta', response.body);
        this.listaEnCola = response.body;
        this.listaEnCola2 = JSON.parse(
          this.listaEnCola.sendingblueRespuesta
        );
        console.log(this.listaEnCola2)
        this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
          var js = this.listaEnCola2;
          console.log(js);
          console.log(js.count);
          this.dataSource = new MatTableDataSource(js.campaigns);
          this.dataSource.sort = this.sort;
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
          this.dataSource.paginator = this.paginator;
      },

      error: (error) => {
        console.log(error);
        this.alertaService.mensajeError(error);
        this.loading=false;
      },

      complete: () => {
        this.loading=false;
      },
    });
  }

}


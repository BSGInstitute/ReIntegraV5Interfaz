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
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { EstadoCampaniaComponent } from '../estado-campania/estado-campania.component';

@Component({
  selector: 'app-estado-borrador',
  templateUrl: './estado-borrador.component.html',
  styleUrls: ['./estado-borrador.component.scss']
})
export class EstadoBorradorComponent implements OnInit, OnChanges {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  displayedColumns: string[] = ['numero', 'nombre', 'fecha','tipo','acciones'];

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.estadoBorrador()
  }

  ngOnChanges(): void {

    if(this.actualizar<this.item){
      this.estadoBorrador()
      console.log("si funca");
      console.log(this.item)

    }
  }

  public estadoEnvio: estadoEnvio = {
    type: 'classic',
    status: 'draft',
    limit: 20,
    offset: 0
  };
  @Output() funcionEditar = new EventEmitter<any>();
  @Output() funcionCambiarE= new EventEmitter<any>();
  @Input() item:any;

  actualizar=0;

  offset: number
  loading:boolean
  listaBorrador:any
  listaBorrador2:any
  dataSource: any;
  current=0;

  Lengt=0;
  IdTabla:any;
  estado:any;

  Paginador(a: any) {
    this.current=a.pageIndex;
    this.estadoBorrador()
  }

  cambiarEstado(e:string, estado:string) {
    this.IdTabla=e;
    this.estado=estado;
    const dialogRef = this.dialog.open(EstadoCampaniaComponent, {
      width: '500px',
      maxHeight: '90vh',
      data:[this.IdTabla, this.estado]
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(+result );
      // this.obtenerSendinblue(this.offset);

    });
  }



  estadoBorrador(){
    // this.estadoEnvio.offset= offset*20;
    this.loading= true;
    this.integraService
    .insertar(
      constApiMarketing.SendinblueObtener,
      this.estadoEnvio
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('Datos respuesta', response.body);
        this.listaBorrador = response.body;
        this.listaBorrador2 = JSON.parse(
          this.listaBorrador.sendingblueRespuesta
        );
        console.log(this.listaBorrador2)
        this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
          var js = this.listaBorrador2;
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
        this.loading= false;
      },

      complete: () => {
        this.loading=false;
      },
    });
  }

}

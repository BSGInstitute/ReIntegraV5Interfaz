import { Component, OnInit, Inject, ViewChild, Input, AfterViewInit, SimpleChanges } from '@angular/core';
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
  selector: 'app-historial-ejecutado',
  templateUrl: './historial-ejecutado.component.html',
  styleUrls: ['./historial-ejecutado.component.scss']
})
export class HistorialEjecutadoComponent implements OnInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
  ) { }


  loading:any
  dataSourceEP:any
  Lengt=0;
  listaHistorialEjecutado:any
  dataSource: any;
  current=0

  @Input() id: any;

  displayedColumns: string[] = ['centroCosto', 'origen','tipoDato','faseOportunidad', 'nroOperacionesCreadas', 'usuarioCreacion','usuarioModificacion','fechaCreacion','fechaModificacion'];
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && changes['id'].currentValue) {
      console.log('Cambio detectado en id:', this.id);
      this.obtenerHistorialEjecutado(); // Se ejecuta cada vez que cambia el id
    }
    setInterval(() => {
      this.obtenerHistorialEjecutado();
    }, 60000);
  }

  ngOnInit(): void {
    this.obtenerHistorialEjecutado()
  }

  Paginador(e:any){

  }

  obtenerHistorialEjecutado(){
    this.loading = true;
    this.integraService.post(`${constApiMarketing.ObtenerHistorialEjecutado}?idFiltroSegmento=${this.id}`)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.body);
        this.loading = false;
        this.listaHistorialEjecutado = response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }




}

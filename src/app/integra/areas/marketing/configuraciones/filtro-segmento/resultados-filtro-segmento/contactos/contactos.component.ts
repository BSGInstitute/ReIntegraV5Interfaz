import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  Input,
  AfterViewInit,
  Output,
  EventEmitter,
} from '@angular/core';
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
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SelectAllCheckboxState } from '@progress/kendo-angular-grid';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.scss'],
})
export class ContactosComponent implements OnInit {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}

  loading: any;
  dataSourceEP: any;
  Lengt = 0;
  listaContactos: any;
  dataSource: any;
  current = 0;
  mySelection: any;
  checkB = false;
  total = 0;
  listaEnvioContactos: any = [];
  allSeleccionados: any = false;

  listaSeleccion: any = [];
  tamanioLista: any = 0

  @Input() id: any;
  @Input() idFiltroSegmentoTipoContacto: any;
  @Output() newItemEvent = new EventEmitter<any>();




  displayedColumns: string[] = [
    'check',
    'idAlumno',
    'nombreAlumno',
    'email',
    'email2',
    'telefono',
    'celular',
    'pais',
    'ciudad',
    'areaFormacion',
    'areaTrabajo',
    'industria',
    'cargo',
    'enVentaCruzada',
  ];

  ngOnInit(): void {
    this.obtenerContactos();
    console.log(this.idFiltroSegmentoTipoContacto)
  }

  obtenerContactos() {
    this.loading = true;
    this.integraService
      .obtener(
        constApiMarketing.ObtenerContactos +
          '/' +
          this.id +
          '/' +
          this.idFiltroSegmentoTipoContacto
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);

          this.tamanioLista=response.body.length
          this.loading = false;
          this.listaContactos = response.body;

          this.listaContactos.forEach((e: any) => {
            e.select = false;
          });
        },

        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.loading = false;
        },
      });
  }



Seleccionar(e: any) {
  if (this.listaContactos[e.selectedRows[0].index].select == true) {
    this.total--;
  } else {
    this.total++;
  }
  this.listaContactos[e.selectedRows[0].index].select = !this.listaContactos[e.selectedRows[0].index].select;

  // Obtener la lista seleccionada
  this.listaEnvioContactos = this.listaContactos
    .filter((d: any) => d.select == true)
    .map((d: any) => d.idAlumno);

  // Emitir lista seleccionada usando newItemEvent
  this.newItemEvent.emit(this.listaEnvioContactos);
}

SeleccionarTodos() {
  this.allSeleccionados = !this.allSeleccionados;

  this.listaContactos.forEach((e: any) => {
    e.select = this.allSeleccionados;
  });

  this.listaEnvioContactos = this.listaContactos
    .filter((d: any) => d.select == true)
    .map((d: any) => d.idAlumno);

  this.newItemEvent.emit(this.listaEnvioContactos);
}

}

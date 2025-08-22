import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import { PlantillaHtmlComponent } from '../plantilla-html/plantilla-html.component';
import { AgregarFolderComponent } from '../agregar-folder/agregar-folder.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-mostrar-contactos-listas',
  templateUrl: './mostrar-contactos-listas.component.html',
  styleUrls: ['./mostrar-contactos-listas.component.scss']
})
export class MostrarContactosListasComponent implements OnInit {

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialogRef: MatDialogRef<MostrarContactosListasComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.obtenerContactosPorLista(this.data,this.offset2)
    this.dataSource = new MatTableDataSource(this.tableData);
  }

  displayedColumns: string[] = ['id', 'nombre', 'email', 'telefono'];

  tableData: Array<any> = [];
  listaContactos:any;
  listaJsonContactos:any;
  dataSource: any;
  current=0
  Lengt=0;
  offset2: number = 0;
  limit=20;

  obtenerContactosPorLista(idLista: number, offset2: number) {
    this.integraService
      .obtener(constApiMarketing.ObtenerContactosPorLista + '/' + idLista +  '/' + this.limit + '/'  + offset2 * 20)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaContactos = response.body;
          this.paginator._intl.itemsPerPageLabel = 'Items por pagina';
          this.listaJsonContactos = JSON.parse(
            this.listaContactos.sendingblueRespuesta
          );
          this.dataSource = new MatTableDataSource(this.listaJsonContactos.contacts);
          this.dataSource.sort = this.sort;
          this.paginator.length=this.listaJsonContactos.count
          this.paginator.pageIndex=this.current
          this.Lengt=this.listaJsonContactos.count;
          setTimeout(() => {
            this.paginator.pageIndex = this.current;
            this.paginator.length = this.listaJsonContactos.count;
            this.paginator._intl.getRangeLabel = (
              page: number,
              pageSize: number,
              length: number
            ) => {
              return `Pagina ${page + 1} de ${length}`;
            };
          });
          console.log(this.listaJsonContactos);
          this.dataSource.paginator = this.paginator;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  Paginador(a: any) {
    this.current=a.pageIndex;
    // this.dataSource.paginator.length=200
    // this.paginator._intl.getRangeLabel = (
    //   page: number,
    //   pageSize: number,
    //   length: number
    // ) => {
    //   return `Pagina ${page + 1} de ${length}`;
    // };
    this.obtenerContactosPorLista(this.data, this.current);
  }

}

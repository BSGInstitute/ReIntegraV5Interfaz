import { Component, OnInit, Inject, ViewChild, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
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
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-resultados-filtro-segmento',
  templateUrl: './resultados-filtro-segmento.component.html',
  styleUrls: ['./resultados-filtro-segmento.component.scss']
})
export class ResultadosFiltroSegmentoComponent implements OnInit, OnChanges {


  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ResultadosFiltroSegmentoComponent>,
  ) { }
  ngOnChanges(): void {
    console.log()

  }

  listaContactoEnvio: any
  longitudlistaContactoEnvio: number

  addNewItem(value: any) {
    console.log(value);
    this.listaContactoEnvio = value
    this.longitudlistaContactoEnvio = value.length
  }

  loading:any
  listaContactos:any
  id:any
  idFiltroSegmentoTipoContacto:any

  ngOnInit(): void {
    console.log(this.data[0])
    console.log(this.data[1])

    this.id = this.data[0]
    this.idFiltroSegmentoTipoContacto = this.data[1]
  }


  Cerrar(){
    this.dialogRef.close()
  }

}

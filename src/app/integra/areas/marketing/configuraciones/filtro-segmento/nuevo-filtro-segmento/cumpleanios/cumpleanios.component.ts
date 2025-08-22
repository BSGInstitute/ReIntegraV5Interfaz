import { EstadoPago } from '@integra/models/filtro-segmento';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
import {MatDialog} from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';


@Component({
  selector: 'app-cumpleanios',
  templateUrl: './cumpleanios.component.html',
  styleUrls: ['./cumpleanios.component.scss']
})
export class CumpleaniosComponent implements OnInit {
  
  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
  ) { }

  listaFrecuencia:any
  loading:any
  cantidad:any
  tiempo:any

  ngOnInit(): void {
    this.ObtenerFrecuenciaTiempo() 

    if(this.datosActualizar!= undefined){
      this.cantidad = this.datosActualizar.cantidadTiempoCumpleaniosContactoDentroDe
      this.tiempo = this.datosActualizar.idTiempoFrecuenciaCumpleaniosContactoDentroDe
    }
  }


  
  ObtenerFrecuenciaTiempo() {
    this.loading = true;
    this.integraService.obtener(constApiMarketing.ObtenerFrecuenciaTiempo).subscribe({
      next: (response: HttpResponse<any>) => {
        this.loading = false;
        this.listaFrecuencia = response.body;
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

}

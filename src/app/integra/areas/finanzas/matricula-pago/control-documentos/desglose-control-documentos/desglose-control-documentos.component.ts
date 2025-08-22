import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  constApi,
  constApiFinanzas,
  constApiGlobal,
} from '@environments/constApi';
import { ControlDocEnviar, ControlDocumentos, ControlEstado } from '@integra/models/control-documentos';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { datePipeTransform } from '@shared/functions/date-pipe';

@Component({
  selector: 'app-desglose-control-documentos',
  templateUrl: './desglose-control-documentos.component.html',
  styleUrls: ['./desglose-control-documentos.component.scss']
})
export class DesgloseControlDocumentosComponent implements OnInit,OnChanges {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) { }

  guardarResponse:any
  loading:any
  listaDocumentosPorMatricula:any


  ngOnInit(): void {
    console.log(this.row)
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.row)

    if(this.row!= undefined){
      this.listaDocumentosPorMatricula= this.row
    }
  }


  @Input() row:any;

  @Output() Updates = new EventEmitter<void>();

  jsonEstado: ControlEstado = {
    idControlDoc: 0,
    idMatriculaCabecera: 0,
    estadoDocumento: true,
    idCriterioDoc: 0,
    nombreUsuario: "",
    recepcionado: false
  }

  mensajeActualizar() {
    return Swal.fire({
      title: '¿Está seguro de actualizar el registro?',
      text: '¡El documento cambiara de estado!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    });
  }



  checkCheckBoxvalue(e:any){
    console.log(e)
    this.jsonEstado.idControlDoc = e.idControlDoc
    this.jsonEstado.idCriterioDoc = e.idCriterioDoc
    this.jsonEstado.idMatriculaCabecera = e.idMatriculaCabecera
    this.jsonEstado.estadoDocumento= e.estadoDocumento

    

    if(e.recepcionado == null || e.recepcionado==false){
      this.jsonEstado.recepcionado = true
    }
    else{
      this.jsonEstado.recepcionado = false
    }

    console.log(this.jsonEstado)

    this.mensajeActualizar().then((result) => {
      if (result.isConfirmed) {
    this.integraService
    .postJsonResponse(
      constApiFinanzas.ActualizarControlDocumento,
      this.jsonEstado
    )
    .subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response);
        this.guardarResponse = response.body; 
        
      },
      error: (error) => {
        this.mostrarMensajeError(error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.Updates.emit()  
      },
    });
  } 
  else{
    this.Updates.emit()  
  }

  });

  }


    /// Otras FUnciones --------------------------------------------------------------
    mostrarMensajeError(error: any): void {
      Swal.fire({
        icon: 'error',
        html: `<p class=text-start>${error.error}</p>
                <p class=text-start text-danger fs-6>${error.message}</p>`,
        allowOutsideClick: false,
      });
    }
  

}

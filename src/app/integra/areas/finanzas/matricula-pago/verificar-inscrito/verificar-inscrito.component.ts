import { data } from './../../../../models/agenda-tab-bandeja-entrada';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { faBullseye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-verificar-inscrito',
  templateUrl: './verificar-inscrito.component.html',
  styleUrls: ['./verificar-inscrito.component.scss']
})
export class VerificarInscritoComponent implements OnInit {


  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
  ) { }
  usuario = JSON.parse(localStorage.getItem('userData'))
   //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  formOportunidadVerificada= this.formBuilder.group({
  idOportunidad: null,
  idMatriculaCabecera: null,
  verificado :false,
  usuario: '',

  })


  gridVerificarInscrito:KendoGrid = new KendoGrid();
  gridOportunidadesVerificadas:KendoGrid = new KendoGrid();
  loaderGridfinal=false
  loaderGrid=false
  loaderGeneral =false

  ngOnInit(): void {
    this.ObtenerOportunidadesISM();
    this.ObtenerOportunidadesVerificadas();
  }
  verificar(data:any): void {
    Swal.fire({
      title: '¿Verificar Oportunidad?',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Verificar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.insertarOportunidadesVerificadas(data);
      }
    });
  }
insertarOportunidadesVerificadas(data:any){
  this.loaderGeneral= true;
let jsonEnvio = {
  idOportunidad: data.idOportunidad,
  idMatriculaCabecera: data.idMatriculaCabecera,
  verificado :false,
  usuario:this.usuario.userName,
}

  this.integraService
    .postJsonResponse(
      `${constApiFinanzas.VerificacionOportunidadISMInsertarOportunidadVerificadaV2}`, JSON.stringify(jsonEnvio)
    )
    .subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.gridOportunidadesVerificadas.data = response.body;
        this.ObtenerOportunidadesISM() 
        this.ObtenerOportunidadesVerificadas()
        this.loaderGrid= false;
        this.alertaService.mensajeExitoso("Se procesaron los Datos");

        this.loaderGeneral= false;
        console.log(response.body)
      },
      error: (error) => {
        this.loaderGeneral= false;
        console.log(error);
        this.alertaService.notificationWarning(
          ''+error.error.text
        );

      },
    });

}

  // Pasardata(json: any){
  //   console.log(json)
  //   console.log(this.gridVerificarInscrito.data)
  //   console.log(this.gridOportunidadesVerificadas.data)
  //   var opr=this.gridVerificarInscrito.data.find(x=>x.IdMatriculaCabecera==json.idMatriculaCabecera)
  //    this.gridVerificarInscrito.data=this.gridVerificarInscrito.data.filter(x=>x.IdMatriculaCabecera!=json.idMatriculaCabecera);
  //   this.gridOportunidadesVerificadas.data.push({
  //     Coordinador: opr.Asesor,
  //     Alumno: opr.Alumno,
  //     CentroCosto: opr.CentroCosto,
  //     FaseOportunidad: opr.CodigoFaseOportunidad,
  //     CodigoMatricula: opr.CodigoMatricula
  // })
  // }




  ObtenerOportunidadesISM() {
    this.loaderGrid= true;
  this.integraService
    .getJsonResponse(
      `${constApiFinanzas.VerificacionOportunidadISMObtenerOportunidadesISM}`
    )
    .subscribe({
      next: (response: HttpResponse<any[]>) => {

        this.gridVerificarInscrito.data= response.body;

        this.loaderGrid= false;

      },
      error: (error) => {
        this.alertaService.notificationError(error.error);
      },
      complete: () => {},
    });
}

ObtenerOportunidadesVerificadas() {
  this.loaderGridfinal= true;
  this.integraService
    .getJsonResponse(
      `${constApiFinanzas.VerificacionOportunidadISMObtenerOportunidadesVerificadas}`
    )
    .subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.gridOportunidadesVerificadas.data= response.body;

        this.loaderGridfinal= false;

      },
      error: (error) => {
        this.alertaService.notificationError(error.error);
      },
      complete: () => {},
    });
}



fechaTemplate(fecha:any)// obtiene la fecha formateada para el mostrado en la grilla
{
  if(typeof fecha=="string")
  {
    return datePipeTransform(new Date(fecha),'yyy/MM/dd', 'en-US')
  }
  else if(fecha!=null || fecha!=undefined)
  {
    return datePipeTransform(fecha,'yyy/MM/dd', 'en-US')
  }
  else return fecha
}
refrescarGrilla(){
  this.ObtenerOportunidadesISM();
  this.ObtenerOportunidadesVerificadas();
}

}


import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { ISolicitudCambio } from '@finanzas/models/interfaces/isolicitud-cambio-cronograma';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-cambio-cronograma',
  templateUrl: './solicitud-cambio-cronograma.component.html',
  styleUrls: ['./solicitud-cambio-cronograma.component.scss']
})
export class SolicitudCambioCronogramaComponent implements OnInit {
  @ViewChild('modalCronogramaFinal') modalCronogramaFinal: any;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    public userService: UserService
  ) { }


  rowActual: any;

  gridCambioCronograma:KendoGrid = new KendoGrid();
  gridCronograma:KendoGrid=new KendoGrid();
  gridCronogramaCambio:KendoGrid=new KendoGrid();

  gridLoaderGeneral=false;
  loaderModal: boolean = false;
  loaderGrid=false
  loaderGeneral=false;
  color: '#ff0303'

  ngOnInit(): void {
    this.ObtenerSolicitudCambioCronogrma(this.userService.userData.idPersonal);

  }



  ObtenerSolicitudCambioCronogrma(idPersonal:number) {
    this.loaderGrid= true;
  this.integraService
    .getJsonResponse(
      `${constApiFinanzas.CronogramaCabeceraCambioObtenerSolicitudesCambios}/${idPersonal}`

    )
    .subscribe({
      next: (response: HttpResponse<ISolicitudCambio[]>) => {
        console.log(response.body,"hola");
        response.body.forEach(e => {
          e.listaCambios = e.cambios.split(',');
          e.listaCambios.forEach(e => {
            e = e.trim();
          })
        })
        this.gridCambioCronograma.data= response.body;

        this.loaderGrid= false;

      },
      error: (error) => {
        this.loaderGrid= true;
        this.alertaService.notificationError(error.error);
      },
      complete: () => {},
    });
}


abrirModalCronogramaFinal(idMatriculaCabecera:number) {

  this.loaderModal = false;

 // this.dataEditTemporal = dataItem;
  //this.modalRef = this.modalService.open(this.detallemodalGrupoFiltroFormulario);
  this.modalService.open(this.modalCronogramaFinal,{
    backdrop: 'static',
    size: 'xl',

  });

this.ObtenerCronogramaPagoFinal(idMatriculaCabecera);
//this.ObtenerCronogramaNoAprobado(idMatriculaCabecera);

}



ObtenerCronogramaPagoFinal(idMatriculaCabecera:number) {
this.loaderGeneral= true;

  this.integraService

    .getJsonResponse(
      `${constApiFinanzas.CronogramaCabeceraCambioObtenerCronogramaFinal}/${idMatriculaCabecera}`
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response);
        this.gridCronograma.data = response.body.listaCronogramaPagoDetalleFinal;

        this.gridCronogramaCambio.data = response.body.listaCronogramaNoAprobado;
        this.gridCronogramaCambio.data.forEach((x:any)=>{
          x.existe=false;
          var ex=this.gridCronograma.data.find((item: any) => {
            return (item.nroCuota == x.nroCuota && item.nroSubCuota == x.nroSubCuota && item.mora == x.mora
              && item.cuota == x.cuota && item.fechaVencimiento == x.fechaVencimiento);
          });
          if(ex!==undefined && ex!=null)  {
            x.existe=true;
          }
        })

        if(this.gridCronograma.data !== this.gridCronogramaCambio.data){
          this.color=response.body.listaCronogramaNoAprobado
        }
        this.loaderGeneral= false;
      },
      error: (error) => {
        this.loaderGeneral= false;
        this.alertaService.notificationError(error.error);
      },
      complete: () => {},
    });
}
AprobarCronogramaFinal(data:any,index: number){
  this.loaderGrid= true;
let jsonEnvio = {

  codigoMatricula:data.codigoMatricula,
  idsCambios: data.idsCambios,
  version:data.version,
  nombreSolicitante:data.nombreSolicitante,
  idPersonalAprobador:this.userService.idPersonal,
  observacion:data.observacion,
  cambios:data.cambios
}

  this.integraService
    .postJsonResponse(
      `${constApiFinanzas.CronogramaCabeceraCambioAprobar}`, JSON.stringify(jsonEnvio)
    )
    .subscribe({
      next: (response: HttpResponse<any[]>) => {

        this.gridCambioCronograma.data.splice(index, 1);
        this.gridCambioCronograma.data = this.gridCambioCronograma.data.slice()
        this.gridCambioCronograma.loadView();
        this.alertaService.mensajeExitoso("Se procesaron los Datos");

        this.loaderGrid= false;
        console.log(response.body)
      },
      error: (error) => {
        this.loaderGeneral= false;
        console.log(error);
        this.alertaService.notificationError(error.message);


      },
    });

}

RechazarCronogramaFinal(data:any,index: number){
  this.loaderGrid= true;
 let jsonEnvio = {

   codigoMatricula:data.codigoMatricula,
   idsCambios: data.idsCambios,
   version:data.version,
   nombreSolicitante:data.nombreSolicitante,
   idPersonalAprobador:this.userService.idPersonal,
   observacion:data.observacion,
   cambios:data.cambios
 }

   this.integraService
     .postJsonResponse(
       `${constApiFinanzas.CronogramaCabeceraCambioRechazar}`, JSON.stringify(jsonEnvio)
     )
     .subscribe({
       next: (response: HttpResponse<any[]>) => {

        this.gridCambioCronograma.data.splice(index, 1);
        this.gridCambioCronograma.data = this.gridCambioCronograma.data.slice()
        this.gridCambioCronograma.loadView();
         this.alertaService.mensajeExitoso("Se Rechazo Cronograma");

        this.loaderGrid= false;
         console.log(response.body)
       },
       error: (error) => {
         this.loaderGrid= false;
         console.log(error);
         this.alertaService.notificationError(error.message);


       },
     });

 }





AprobarCronograma(data:any,index:number): void {
  Swal.fire({
    title: '¿Aprobar Cronograma?',
    showCancelButton: true,
    confirmButtonColor: '#4C5FC0',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Aprobar',
  }).then((result) => {
    if (result.isConfirmed) {
      this.AprobarCronogramaFinal(data,index);
    }
  });
}
RechazarCronogra(data:any, index:number): void {
  Swal.fire({
    title: '¿Rechazar Cronograma?',
    showCancelButton: true,
    confirmButtonColor: '#4C5FC0',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Rechazar',
  }).then((result) => {
    if (result.isConfirmed) {
     this.RechazarCronogramaFinal(data,index);
    }
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

};



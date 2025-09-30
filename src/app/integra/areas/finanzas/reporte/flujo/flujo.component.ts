import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-flujo',
  templateUrl: './flujo.component.html',
  styleUrls: ['./flujo.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class FlujoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private integraReplicaService: IntegraReplicaService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    public finanzasService:FinanzasServiceService,
    private cdr: ChangeDetectorRef
  ) {}
  // Variables usadas en el componente ------------------------------------------------------------------

  pageSizes: any = [5, 10, 20, 'All'];
  listaReporte:any[]=[]

  formGroupFiltro = this.formBuilder.group({
    fechaInicio:[null,Validators.required],
    fechaFin:[null,Validators.required]
  });

  loader=false
  dataExport:any[] =[]

  blobExport:any

  ngOnInit(): void {
  }
  generarExcel(envio:any){
    try{
      let byteCharacters = atob(envio); //data.file there
      let byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          let slice = byteCharacters.slice(offset, offset + 512);

          let byteNumbers = new Array(slice.length);
          for (var i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }
          let byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      this.blobExport = blob
    }
    catch{
      this.finanzasService.MensajeDeError({
        error:{title:"el exportador de excel no ha cargado correctamente"}},"Exportar a Excel")
    } 
  }


  generarReporte(){
    if(this.formGroupFiltro.valid){
      this.loader=true
      let dataFiltro = this.formGroupFiltro.getRawValue()
      let envio={
        fechaInicio: datePipeTransform(dataFiltro.fechaInicio ,'yyyy-MM-ddT00:00:00','en-US'),
        fechaFin: datePipeTransform(dataFiltro.fechaFin ,'yyyy-MM-ddT23:59:00','en-US'),
      }
      this.integraReplicaService
      .postJsonResponse(constApiFinanzas.ObtenerReporteFlujos,envio)
      .subscribe({
        next: (response) => {
          response.body.reporteFlujo.forEach((e:any)=>{
            if(e.fechavencimientoOriginal!=null){
              e.fechavencimientoOriginal = new Date(e.fechavencimientoOriginal),
              e.fechavencimientoOriginal.setHours(0, 0, 0, 0);
            }
            if(e.fechavencimiento!=null){
              e.fechavencimiento = new Date(e.fechavencimiento),
              e.fechavencimiento.setHours(0, 0, 0, 0);
            }
            if(e.fechaPago!=null){
              e.fechaPago = new Date(e.fechaPago),
              e.fechaPago.setHours(0, 0, 0, 0);
            }
          })
          this.generarExcel(response.body.dataExport)
            
          this.listaReporte =response.body.reporteFlujo
          this.loader=false
        },
        error: (error) => {
          this.loader=false
          this.finanzasService.MensajeDeError(error,"obtener reporte flujo")
        },
        complete: () => {},
      });
    }
    else this.formGroupFiltro.markAllAsTouched()
  }
  ActividadLoading(valor:boolean){
    this.loader=valor
  }


  exportarAExcel(blob:any){
    if(blob!=undefined && blob!=null){
      const fileName = 'ReporteFlujo.xlsx';
      FileSaver.saveAs(blob, fileName);
    }
  }


}


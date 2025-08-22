import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
const currentDate = new Date();

@Component({
  selector: 'app-reporte-ingresos',
  templateUrl: './reporte-ingresos.component.html',
  styleUrls: ['./reporte-ingresos.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class ReporteIngresosComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    public finanzasService:FinanzasServiceService,
    private modalService: NgbModal,
  ) {}

  @ViewChild("modalReporteIngresoCongelado") modalReporteIngresoCongelado:any;

  fun1=false;fun2=false;fun3=false;fun4=false;fun5=false
  fun6=false;fun7=false;fun8=false;fun9=false;fun10=false
  fun11=false

  pageSizes: any = [5, 10, 20, 'All'];
  loader=false
  listaReporte:any[]=[]
  listaReporteCongelado:any[]=[]
  nombreFiltroTemp =""

  listaIVentas:any[]=[]
  listaIOperaciones:any[]=[]
  listaIOperacionesTipoCambio:any[]=[]
  listaIOtrosIngresos:any[]=[]
  listaIPagosIngresos:any[]=[]
  listaIPagosIngresosPosterior:any[]=[]
  listaIPagosIngresosAnterior:any[]=[]
  listaIGestionCobranza:any[]=[]
  listaITasasAcademicas:any[]=[]
  listaIAnteriorConDeposito:any[]=[]
  listaIPosteriorConDeposito:any[]=[]

  formGroupFiltro = this.formBuilder.group({
    fechaInicio:[new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),Validators.required],
    fechaFin:[new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0),Validators.required]
  });

  filtroTemp:any
  sumaFoter =0
  ngOnInit(): void {
  }

  obtenerDataReporteIngresos(){
    if(this.formGroupFiltro.valid){
      this.sumaFoter=0
      let envio = this.formGroupFiltro.getRawValue() 
      
      this.nombreFiltroTemp = datePipeTransform(envio.fechaInicio, 'dd/MM/yyyy', 'en-US')+" - "+ datePipeTransform(envio.fechaFin, 'dd/MM/yyyy', 'en-US');
      envio.fechaInicio = datePipeTransform(envio.fechaInicio, 'yyyy-MM-ddT00:00:00.000', 'en-US');
      envio.fechaFin = datePipeTransform(envio.fechaFin, 'yyyy-MM-ddT23:59:59.000', 'en-US');

      this.loader=true
      this.filtroTemp=envio
      this.ObtenerReporteIngresosVentas(envio)
      this.ObtenerReporteIngresosOperaciones(envio)
      this.ObtenerReporteIngresosOperacionesTipoCambio(envio)
      this.ObtenerReporteIngresosOtrosIngresos(envio)
      this.ObtenerPagosIngresos(envio)
      this.ObtenerPagosIngresosPosterior(envio)
      this.ObtenerPagosIngresosAnterior(envio)
      this.ObtenerPagosIngresosGestionCobranza(envio)
      this.ObtenerPagosTasasAcademicas(envio)
      this.ObtenerPagosIngresosAnteriorConDeposito(envio)
      this.ObtenerPagosIngresosPosteriorConDeposito(envio)
    }
    else this.formGroupFiltro.markAllAsTouched()
    
  }


  ObtenerReporteIngresosVentas(filtro:any){
    this.fun1=false
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteIngresosVentas,filtro
        ).subscribe({
          next: (response: HttpResponse<any>) => {
           this.listaIVentas = response.body
            this.fun1=true
            this.ValidarObtencionDeDatos()
          },
          error: (error) => {
            this.fun1=true
            this.loader=false
            this.ValidarObtencionDeDatos()
            this.finanzasService.MensajeDeError(error, 'ObtenerReporteIngresosVentas');
          },
          complete: () => { },
        });
  }

  ObtenerReporteIngresosOperaciones(filtro:any){
    this.fun2=false
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteIngresosOperaciones,filtro
        ).subscribe({
          next: (response: HttpResponse<any>) => {
           this.listaIOperaciones = response.body
            this.fun2=true
            this.ValidarObtencionDeDatos()
          },
          error: (error) => {
            this.fun2=true
            this.loader=false
            this.ValidarObtencionDeDatos()
            this.finanzasService.MensajeDeError(error, 'ObtenerReporteIngresosOperaciones');
          },
          complete: () => { },
        });
  }

  ObtenerReporteIngresosOperacionesTipoCambio(filtro:any){
    this.fun3=false
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteIngresosOperacionesTipoCambio,filtro
        ).subscribe({
          next: (response: HttpResponse<any>) => {
           this.listaIOperacionesTipoCambio = response.body
            this.fun3=true
            this.ValidarObtencionDeDatos()
          },
          error: (error) => {
            this.fun3=true
            this.loader=false
            this.ValidarObtencionDeDatos()
            this.finanzasService.MensajeDeError(error, 'ObtenerReporteIngresosOperacionesTipoCambio');
          },
          complete: () => { },
        });
  }
  ObtenerReporteIngresosOtrosIngresos(filtro:any){
    this.fun4=false
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteIngresosOtrosIngresos,filtro
        ).subscribe({
          next: (response: HttpResponse<any>) => {
           this.listaIOtrosIngresos= response.body
            this.fun4=true
            this.ValidarObtencionDeDatos()
          },
          error: (error) => {
            this.fun4=true
            this.loader=false
            this.ValidarObtencionDeDatos()
            this.finanzasService.MensajeDeError(error, 'ObtenerReporteIngresosOtrosIngresos');
          },
          complete: () => { },
        });
  }

  ObtenerPagosIngresos(filtro:any){
    this.fun5=false
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerPagosIngresos,filtro
        ).subscribe({
          next: (response: HttpResponse<any>) => {
           this.listaIPagosIngresos= response.body
            this.fun5=true
            this.ValidarObtencionDeDatos()
          },
          error: (error) => {
            this.fun5=true
            this.loader=false
            this.ValidarObtencionDeDatos()
            this.finanzasService.MensajeDeError(error, 'ObtenerPagosIngresos');
          },
          complete: () => { },
        });
  }

  ObtenerPagosIngresosPosterior(filtro:any){
    this.fun6=false
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerPagosIngresosPosterior,filtro
        ).subscribe({
          next: (response: HttpResponse<any>) => {
           this.listaIPagosIngresosPosterior= response.body
            this.fun6=true
            this.ValidarObtencionDeDatos()
          },
          error: (error) => {
            this.fun6=true
            this.loader=false
            this.ValidarObtencionDeDatos()
            this.finanzasService.MensajeDeError(error, 'ObtenerPagosIngresosPosterior');
          },
          complete: () => { },
        });
  }

  ObtenerPagosIngresosAnterior(filtro:any){
    this.fun7=false
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerPagosIngresosAnterior,filtro
        ).subscribe({
          next: (response: HttpResponse<any>) => {
           this.listaIPagosIngresosAnterior= response.body
            this.fun7=true
            this.ValidarObtencionDeDatos()
          },
          error: (error) => {
            this.fun7=true
            this.loader=false
            this.ValidarObtencionDeDatos()
            this.finanzasService.MensajeDeError(error, 'ObtenerPagosIngresosAnterior');
          },
          complete: () => { },
        });
  }

  ObtenerPagosIngresosGestionCobranza(filtro:any){
    this.fun8=false
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerPagosIngresosGestionCobranza,filtro
        ).subscribe({
          next: (response: HttpResponse<any>) => {
           this.listaIGestionCobranza= response.body
            this.fun8=true
            this.ValidarObtencionDeDatos()
          },
          error: (error) => {
            this.fun8=true
            this.loader=false
            this.ValidarObtencionDeDatos()
            this.finanzasService.MensajeDeError(error, 'ObtenerPagosIngresosGestionCobranza');
          },
          complete: () => { },
        });
  }

  ObtenerPagosTasasAcademicas(filtro:any){
    this.fun9=false
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerPagosTasasAcademicas,filtro
        ).subscribe({
          next: (response: HttpResponse<any>) => {
           this.listaITasasAcademicas= response.body
            this.fun9=true
            this.ValidarObtencionDeDatos()
          },
          error: (error) => {
            this.fun9=true
            this.loader=false
            this.ValidarObtencionDeDatos()
            this.finanzasService.MensajeDeError(error, 'ObtenerPagosTasasAcademicas');
          },
          complete: () => { },
        });
  }

  ObtenerPagosIngresosAnteriorConDeposito(filtro:any){
    this.fun10=false
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerPagosIngresosAnteriorConDeposito,filtro
        ).subscribe({
          next: (response: HttpResponse<any>) => {
           this.listaIAnteriorConDeposito= response.body
            this.fun10=true
            this.ValidarObtencionDeDatos()
          },
          error: (error) => {
            this.fun10=true
            this.loader=false
            this.ValidarObtencionDeDatos()
            this.finanzasService.MensajeDeError(error, 'ObtenerPagosIngresosAnteriorConDeposito');
          },
          complete: () => { },
        });
  }

  ObtenerPagosIngresosPosteriorConDeposito(filtro:any){
    this.fun11=false
      this.integraService.postJsonResponse(constApiFinanzas.ObtenerPagosIngresosPosteriorConDeposito,filtro
        ).subscribe({
          next: (response: HttpResponse<any>) => {
           this.listaIPosteriorConDeposito= response.body
            this.fun11=true
            this.ValidarObtencionDeDatos()
          },
          error: (error) => {
            this.fun11=true
            this.loader=false
            this.ValidarObtencionDeDatos()
            this.finanzasService.MensajeDeError(error, 'ObtenerPagosIngresosPosteriorConDeposito');
          },
          complete: () => { },
        });
  }

  ValidarObtencionDeDatos(){
    if(this.loader==true){
      if(this.fun1==true && this.fun2==true && this.fun3==true && this.fun4==true && this.fun5==true &&
        this.fun6==true && this.fun7==true && this.fun8==true && this.fun9==true && this.fun10==true &&
        this.fun11==true ){
          this.ProcesarDatosParaGrilla()
      }else  this.loader=true
    }
  }

  ProcesarDatosParaGrilla(){
    let envio ={
      resultVentas:this.listaIVentas,
      resultOperaciones : this.listaIOperaciones,
      resultOperacionesTipoCambio : this.listaIOperacionesTipoCambio,
      resultOtrosIngresosEgresos : this.listaIOtrosIngresos,
      resultReportePagos : this.listaIPagosIngresos,
      resultReportePagosPosterior : this.listaIPagosIngresosPosterior,
      resultReportePagosAnterior : this.listaIPagosIngresosAnterior,
      resultReporteGestionCobranza : this.listaIGestionCobranza,
      resultReporteTasasAcademicas : this.listaITasasAcademicas,
      resultReportePagosAnteriorDeposito : this.listaIAnteriorConDeposito,
      resultReportePagosPosteriorDeposito : this.listaIPosteriorConDeposito,
      filtro: this.filtroTemp
    }

    this.integraService.postJsonResponse(constApiFinanzas.ObtenerReporteIngresosFinal,envio
      ).subscribe({
        next: (response: HttpResponse<any>) => {
         this.listaReporte= response.body

         this.sumaFoter = this.listaReporte.map((x:any) => x.valor).reduce((a, b) => a + b) - this.listaReporte[8].valor;
         
         this.loader=false
        },
        error: (error) => {
          this.loader=false
          this.listaReporte=[]
          this.finanzasService.MensajeDeError(error, 'Obtener reporte ingresos');
        },
        complete: () => { },
      });

  }
  
  
  CongelarReporteIngresos(){
    if(this.listaReporte.length>0){
      Swal.fire({
        title: '¿Está seguro que quieres congelar el reporte ingresos en este rango de fechas '+this.nombreFiltroTemp+'?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Continuar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loader=true
          const ObjectData ={
            nombreFiltro:this.nombreFiltroTemp,
            detalleCongelado:JSON.stringify(this.listaReporte)
          } 
          this.integraService.postJsonResponse(constApiFinanzas.InsertarReporteIngresoCongelamiento,ObjectData
          ).subscribe({
            next: (response: HttpResponse<any>) => {
              Swal.fire("Reporte Congelado!.","El reporte ingresos se ha congelado correctamente.","success");
              this.loader=false
            },
            error: (error) => {
              this.loader=false
              this.finanzasService.MensajeDeError(error, 'congelar reporte ingresos');
            },
            complete: () => { },
          });
          
        }
      });
      
    }
    else Swal.fire("Reporte sin datos!.","Se requiere que el reporte este cargado previamente.","warning");
  }

  ObtenerReportesCongelados(){
    this.loader=true
    this.integraService.getJsonResponse(constApiFinanzas.ObtenerReporteIngresoCongelamiento
    ).subscribe({
      next: (response: HttpResponse<any>) => {
        this.listaReporteCongelado = response.body
        this.AbrirModalReporteCongelado()
        this.loader=false
      },
      error: (error) => {
        this.loader=false
        this.finanzasService.MensajeDeError(error, 'Obtener reporte ingresos congelados');
      },
      complete: () => { },
    });
  }

  AbrirModalReporteCongelado(){
    this.modalService.open(this.modalReporteIngresoCongelado,{size:"xl",backdrop:"static"});
  }
}

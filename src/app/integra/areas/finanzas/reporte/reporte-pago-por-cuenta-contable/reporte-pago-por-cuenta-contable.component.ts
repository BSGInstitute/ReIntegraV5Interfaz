import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AggregateDescriptor } from '@progress/kendo-data-query';
import { IntegraService } from '@shared/services/integra.service';
import { ifError } from 'assert';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-pago-por-cuenta-contable',
  templateUrl: './reporte-pago-por-cuenta-contable.component.html',
  styleUrls: ['./reporte-pago-por-cuenta-contable.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class ReportePagoPorCuentaContableComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    public finanzasService : FinanzasServiceService,
    private modalService: NgbModal

  ) { }

  @ViewChild('ModalDetalle') modalDetalle: any;


  Anios  = new FormControl(null,Validators.required)
  listaAnios:any[] = []

  reportePagos:any
  detalleDeuda:any

  listaDetalle:any[]=[]
  anioSelectTemp=0
  listaPeriodosSelect:any[]=[]
  listaReportePagosGeneral:any
  listaReportePagosDetalle:any[]=[]

  anioPago=""
  group=[{ field: "Rubro" }]

  
  loader=false

  ngOnInit(): void {
    this.listaAnios = this.ObtenerAniosDesde2019()
  }

  ObtenerAniosDesde2019(): number[] {
    const currentYear = new Date().getFullYear();
    const startYear = 2019;
    const years: any[] = [];
  
    for (let year = currentYear; year >= startYear; year--) {
      years.push({anio:year});
    }
    return years;
  }

  generarReporte(){
    if(this.Anios.valid){
      let aniosFiltro = this.Anios.value.filter((x:number)=> x >= 2023)
      let envio  = aniosFiltro.toString()
      if(envio.length>0){
        this.loader=true
        this.integraService
          .postJsonResponse(constApiFinanzas.ObtenerTasaCambioReportePagoACuenta+"/"+envio, null)
          .subscribe({
            next: (response) => {
              console.log(response.body)
              const existeFalso = response.body.some((objeto:any) => objeto.existe === false);
              if(existeFalso){
                let mensaje:string="Antes de generar el reporte, en el módulo 'Tipo de Cambio por Meses', se requiere la regularización de las siguientes tasas de cambio :<br><br>"
                response.body.forEach((e:any) => {
                  if(e.existe==false){
                    mensaje+= e.periodo + " -> "+ e.moneda +"<br>"
                  }
                });
                this.loader = false
                Swal.fire({
                  icon: 'warning',
                  title: 'Tasas de cambio no encontradas',
                  html: `
                    <p >${mensaje}</p>
                    `,
                })
              }
              else{
                this.ObtenerDataReporte()
              }
            },
            error: (error) => {
              this.loader = false
              this.finanzasService.MensajeDeError(error, "obtener tasas de cambio")
            },
            complete: () => { },
          });
      }
      else {
        this.loader=true
        this.ObtenerDataReporte()
      }
      
    }
    else this.Anios.markAllAsTouched()
  }

  ObtenerDataReporte(){
    if(this.Anios.valid){
      let envio  = this.Anios.value.toString()
      this.integraService
        .postJsonResponse(constApiFinanzas.ObtenerReportePagosACuenta+"/"+envio, null)
        .subscribe({
          next: (response) => {
            console.log(response.body)
            this.reportePagos = response.body           
            this.armarGrillaReporteGeneral()
            this.armarGrillaReportesDetallados()
            this.loader = false
          },
          error: (error) => {
            this.loader = false
            this.finanzasService.MensajeDeError(error, "obtener reporte pagos")
          },
          complete: () => { },
        });
    }
    else this.Anios.markAllAsTouched()
  }

  armarGrillaReportesDetallados(){
    if(this.reportePagos.reporteDetallado.length>0){
      
      this.reportePagos.reporteDetallado.forEach((e:any) => {
        e.periodos.sort((a:any, b:any) => {
          const fechaA = this.finanzasService.convertirFecha(a.periodo);
          const fechaB = this.finanzasService.convertirFecha(b.periodo);
          return fechaA.getTime() - fechaB.getTime();
        });
        e.periodos.forEach((p:any)=>{
          p.aniosDeuda.forEach((anio:any)=>{
            anio.periodosDeuda.sort((c:any, d:any) => {
              const fechaA = this.finanzasService.convertirFecha(c.mesDeuda);
              const fechaB = this.finanzasService.convertirFecha(d.mesDeuda);
              return fechaA.getTime() - fechaB.getTime();
            });
          })
        })
      });
    }
  }
  

  armarGrillaReporteGeneral(){
    if(this.reportePagos.reporteGeneral.anios.length>0 && this.reportePagos.reporteGeneral.listaPrincipal.length>0){
      this.reportePagos.reporteGeneral.anios.forEach((e:any) => {
        e.periodos.sort((a:any, b:any) => {
          const fechaA = this.finanzasService.convertirFecha(a.mesPago);
          const fechaB = this.finanzasService.convertirFecha(b.mesPago);
          return fechaA.getTime() - fechaB.getTime();
        });
      });

      this.listaReportePagosGeneral =  this.reportePagos.reporteGeneral.listaPrincipal.map((reporte: any) => {
        const nuevoReporte: any = { ...reporte }; 
        this.reportePagos.reporteGeneral.anios.forEach((item: any) => {
          let sumaTotalMes = 0
          item.periodos.forEach((p:any) => {
            let monto = this.obtenerMontoPago(p.detalles,nuevoReporte.nroCuenta,nuevoReporte.cuenta);
            nuevoReporte[p.mesPago] = monto;
            sumaTotalMes = sumaTotalMes + monto
          });
          nuevoReporte[item.anioPago] = Math.round(sumaTotalMes*100)/100
          nuevoReporte['Rubro'] = nuevoReporte.rubro;
        });
        return nuevoReporte;
      });

      console.log("GRILLA ARMADA",this.listaReportePagosGeneral)
    }
    else this.listaReportePagosGeneral=[]
  }

  

  obtenerMontoPago(detalle:any[],nroCuenta:string,cuenta:string){
    let data  = detalle.find((e:any)=> e.nroCuenta===nroCuenta && e.cuenta===cuenta)
    if (!data)return 0;
    return data.montoPago
  }

  hederTemplateSumaColum(group:any,periodo:any){
    try {
      let suma=0
      group.items.forEach((e:any) => {
        suma = suma+ e[periodo]
      });
      return Math.round(suma*100)/100
    } catch (error) {
      return 0
    }
  }
  hederTemplateSumaTotal(group:any,anio:any){
    try {
      let suma=0
      group.items.forEach((e:any) => {
        suma = suma+ e[anio]
      });
      return Math.round(suma*100)/100
    } catch (error) {
      return 0
    }
  }

  footerSumaPeriodo(detalle:any[]){
    let suma=0
    detalle.forEach((e:any)=>{
      suma = suma +e.montoPago
    })
    suma = Math.round(suma*100)/100
    return suma 
  }

  footerSumaAnio(anio:any){
    let suma =0
    this.listaReportePagosGeneral.forEach((e:any) => {
      suma = suma + e[anio]
    });
    suma = Math.round(suma*100)/100
    return suma 
  }

  abrirModalDetalle(anio:number){
    setTimeout(() => {
      this.detalleDeuda = { ...(this.reportePagos.reporteDetallado.find((e:any)=>e.anioPago===anio))}
      if(this.listaPeriodosSelect.length>0)
        this.detalleDeuda.periodos = this.detalleDeuda.periodos.filter((e:any)=>
        this.listaPeriodosSelect.includes(e.periodo)
        )
      this.anioPago = anio.toString()
      console.log(this.detalleDeuda)
      this.listaDetalle = this.detalleDeuda.listaPrincipal.map((reporte: any) => {
        const nuevoReporte: any = { ...reporte };
        
        this.detalleDeuda.periodos.forEach((periodoPago: any) => {
          let suma = 0;
          
          periodoPago.aniosDeuda.forEach((anioDeuda: any) => {
            anioDeuda.periodosDeuda.forEach((periodoDeuda: any) => {
              const key = periodoPago.periodo + '_' + periodoDeuda.mesDeuda;
              nuevoReporte[key] = this.obtenerMontoPagoDeuda(periodoDeuda.detallesDeuda, nuevoReporte.nroCuenta, nuevoReporte.cuenta);
              suma += nuevoReporte[key];
            });
          });
          
          nuevoReporte['total_' + periodoPago.periodo] = Math.round(suma * 100) / 100;
        });
        
        nuevoReporte['Rubro'] = nuevoReporte.rubro;
        return nuevoReporte;
      });
      
      console.log(this.detalleDeuda)
      console.log(this.listaDetalle)
      
      this.modalService.open(this.modalDetalle, {
        backdrop: 'static',
        size: 'xl',
      });
    }, 200);
    
  }

  obtenerMontoPagoDeuda(detalle:any[],nroCuenta:string,cuenta:string){
    let data  = detalle.find((e:any)=> e.nroCuenta===nroCuenta && e.cuenta===cuenta)
    if (!data) return 0;
    return data.montoDeuda
  }

  sumaHeaderDetalle(group:any,key:string){
    try {
      let suma=0
      group.items.forEach((e:any) => {
        suma = suma+ e[key]
      });
      return Math.round(suma*100)/100
    } catch (error) {
      return 0
    }
  }

  sumaFooterDetalle(key:string){
    let suma=0
    this.listaDetalle.forEach((e:any)=>{
      suma = suma + e[key]
    })
    suma = Math.round(suma*100)/100
    return suma 
  }

  seleccionar(periodPago:string,anioPago:any){
    if(anioPago!=this.anioSelectTemp){
      this.anioSelectTemp=anioPago
      this.listaPeriodosSelect=[]
    }
    if(!this.listaPeriodosSelect.includes(periodPago))
      this.listaPeriodosSelect.push(periodPago)
    else 
      this.listaPeriodosSelect =this.listaPeriodosSelect.filter((e:any)=> e!=periodPago)

    console.log(this.listaPeriodosSelect)

  }

}

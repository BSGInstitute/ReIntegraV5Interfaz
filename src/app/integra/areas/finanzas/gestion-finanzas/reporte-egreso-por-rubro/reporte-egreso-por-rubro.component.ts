import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { constApi, constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { ListaSede, ListaSede2, ReporteEgresoPorRubro, ROW_ITEM, ROW_ITEM_DESGLOSABLE} from '@integra/models/reporte-egreso-por-rubro';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { AnyCnameRecord } from 'dns';
import Swal from 'sweetalert2';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { ExportExcelService } from '@shared/services/excelReporteEgresoPorRubro.service';


@Component({
  selector: 'app-reporte-egreso-por-rubro',
  templateUrl: './reporte-egreso-por-rubro.component.html',
  styleUrls: ['./reporte-egreso-por-rubro.component.scss']
})
export class ReporteEgresoPorRubroComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public ete: ExportExcelService,
  ) {}

  ngOnInit(): void {
    this.ObtenerSedes();
    // this.ObtenerEmpresa();
    this.ObtenerMoneda();


  }

  formReporteEgresoPorRubro: FormGroup = this.formBuilder.group({
    anio: null,

  });

  //---Variables -------
  
  sede= new FormControl([])
  fechaInicio = new Date()
  fechaFin = new Date()
  public anio :any = 0
  listaSedes: ListaSede2[] = []
  listaEmpresas: ListaSede[] = []
  itemSede:ListaSede2[]=[]
  itemEmpresa: ListaSede[]=[]
  listaGrilla:any=[]
  loader=false
  mesNombreInicio:any
  mesNombreFin:any
  gridView:any
  listaDesglose:any
  listaMoneda:any
  listaTipoCambio:any
  ilstaPaises:any

  listaMes=[
    { id: 1, nombre: "Enero" }, 
    { id: 2, nombre: "Febrero"}, 
    { id: 3, nombre: "Marzo"}, 
    { id: 4, nombre: "Abril"}, 
    { id: 5, nombre: "Mayo"}, 
    { id: 6, nombre: "Junio"}, 
    { id: 7, nombre: "Julio"}, 
    { id: 8, nombre: "Agosto"}, 
    { id: 9, nombre: "Septiembre"}, 
    { id: 10, nombre: "Octubre"}, 
    { id: 11, nombre: "Noviembre"}, 
    { id: 12, nombre: "Diciembre"}, 
  ]


  Sedes(event:string){
    if(event.length<3)this.itemSede = this.listaSedes
    if(event.length>3)
    {
      this.itemSede = this.listaSedes.filter(
        (s:any) => s.razonSocial.toLowerCase().indexOf(event.toLowerCase()) !== -1
        )
    }
  }

  Empresas(event:string){
    if(event.length<3)this.itemEmpresa = this.listaEmpresas
    if(event.length>3)
    {
      this.itemEmpresa = this.listaEmpresas.filter(
        (s:any) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1
        )
    }
  }


  SeleccionMesInicio(event:string){
    console.log(event)
    this.mesNombreInicio = event
  }

  SeleccionMesFin(event:string){
    console.log(event)
    this.mesNombreFin = event
  }



  /// Funciones para obtener Datos ------------------------------------------------
  ObtenerSedes(){
    this.integraService.obtenerTodo(constApiFinanzas.EmpresaAutorizadaObtenerCombo).subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response)
        this.listaSedes=response.body;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  // ObtenerEmpresa(){
  //   this.integraService.obtenerTodo(constApiFinanzas.EmpresaAutorizadaObtenerCombo).subscribe({
  //     next: (response: HttpResponse<any[]>) => {
  //       console.log(response)
  //       this.listaEmpresas=response.body;
  //     },
  //     error: (error) => {
  //       this.mostrarMensajeError(error);
  //     },
  //     complete: () => {},
  //   });
  // }
 


  ObtenerMoneda(){
    this.integraService.obtenerTodo(constApi.MonedaObtenerMoneda).subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response)
        this.listaMoneda=response.body;
        let validacion = ''
        this.integraService.obtenerTodo(constApiFinanzas.TipoCambioObtenerMeses).subscribe({
          next: (response: HttpResponse<any[]>) => {
            console.log(response)
            this.listaTipoCambio=response.body;
            var existe=''
            this.listaMoneda.forEach((e:any) => {
             
              if(existe==''){
                existe=e.nombrePlural
                this.listaTipoCambio.forEach((f:any) => {

                  // console.log(f.mes)
                  // console.log(new Date().getMonth()+1)
                    
                  if(e.id == f.idMoneda){
                    existe=''
                    
                    if(f.mes == (new Date().getMonth()+1) && f.anio == (new Date().getFullYear())){

                    }
                    else{ 
                      validacion = e.nombrePlural
                    }
                  }
               
                })
                
              }
           
            });
            console.log(validacion, existe)
            if(validacion!='' ||  existe!=''){
              this.alertaService.mensajeIcon(
                'Advertencia',
                'Debe llenar todos los tipos de cambio o se tomara el anterior por defecto',
                'warning'
              );
            }
          },
          error: (error) => {
            this.mostrarMensajeError(error);
          },
          complete: () => {},
        });

    
        
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

 

  convertirObjectToString(data:Array<number>):string{
    let lista:string=""
    data.forEach(element => {
      lista+= element.toString() +","
    });
    lista = lista.substring(0,lista.length-1)
    return lista
  }

   /// Otras FUnciones --------------------------------------------------------------
   mostrarMensajeError(error: any): void {
    Swal.fire({
      icon: 'error',
      html: `<p class=text-start>${error.error}</p>
            <p class=text-start text-danger fs-6>${error.message}</p>`,
      allowOutsideClick: false
    })
  }

  dataEnvioDesglosable :any 
  listaEmpresa:any
  listaPais:any = []

  GenerarReporte(){
    console.log(this.listaSedes)
    this.listaGrilla = []
    let dataSede:number[]=[]
    console.log(this.sede)
          if(this.sede.value.length==0) 
          {
            this.listaSedes.forEach(e=>{
              dataSede.push(e.id)
              console.log(dataSede)
            })
          }
          else {
            (dataSede = this.sede.value); 
          }


          this.loader=true
          this.listaEmpresa=this.convertirObjectToString(dataSede)

    let dataEnvio: any={
      idEmpresa: this.listaEmpresa,
      fechaInicio: datePipeTransform(
        new Date(this.fechaInicio),
        'yyyy-MM-ddTHH:mm:ss.SSS'
      ),
      fechaFin:datePipeTransform(
        new Date(this.fechaFin),
        'yyyy-MM-ddTHH:mm:ss.SSS'
      ),


    }

    console.log(dataEnvio)

    this.integraService
    .insertar(
      constApiFinanzas.VizualizarReporteEgresoPorRubro, dataEnvio
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('Datos respuesta', response.body);
        this.listaGrilla = response.body
      },

      error: (error) => {
        console.log(error);
        this.alertaService.mensajeError(error);
        this.loader = false;
      },

      complete: () => {
        console.log('Proceso');
        this.loader=false

        this.dataEnvioDesglosable = dataEnvio
      },
    });
       
  }

  fechaMaxima: Date=new Date()

  MaximoFecha(event:any){
    console.log(event)
    var f="12-31-" + event.getFullYear().toString();
    this.fechaMaxima = new Date(f)

    console.log(this.fechaMaxima)
  }


  gridEventsResponse(event:any){

    console.log(event)
    let dataItem = this.listaGrilla[event.dataItem]
    
    console.log("DATA ITEM",dataItem)
    let dataEnvioDesglose: any={
      idRubro: event.dataItem.idRubro,
      idEmpresa: this.listaEmpresa,
      fechaInicio: this.dataEnvioDesglosable.fechaInicio,
      fechaFin:this.dataEnvioDesglosable.fechaFin
    }

    console.log(dataEnvioDesglose)

    this.integraService
    .insertar(
      constApiFinanzas.VizualizarDesgloseReporteEgresoPorRubro, dataEnvioDesglose
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('Datos respuesta', response.body);
        this.listaDesglose = response.body
        this.listaGrilla[event.index].listaDesglose=response.body
        console.log(this.listaGrilla)
      },

      error: (error) => {
        console.log(error);
        this.alertaService.mensajeError(error);
        this.loader = false;
      },

      complete: () => {
        console.log('Proceso');
        this.loader=false

      },
    });

       
  }

  //Excel -------------------------------------------------------------------

  dataForExcel: any[] = [];

  dataForExcelDetalle: any[] = [];
  headers: ROW_ITEM = {
    Rubro: "",
    Enero: "",
    Febrero: "",
    Marzo: "",
    Abril: "",
    Mayo: "",
    Junio: "",
    Julio: "",
    Agosto:"",
    Septiembre:"",
    Octubre:"",
    Noviembre:"",
    Diciembre:"",
    Total:"",
    Exceso:"",
    TotalProyectado:""
  }
  headers2: ROW_ITEM_DESGLOSABLE = {
    NombreCuenta: "",
    NumeroCuenta:"",
    Enero: "",
    Febrero: "",
    Marzo: "",
    Abril: "",
    Mayo: "",
    Junio: "",
    Julio: "",
    Agosto:"",
    Septiembre:"",
    Octubre:"",
    Noviembre:"",
    Diciembre:"",
    Total:"",
    Exceso:"",
    TotalProyectado:""
  }
  exportarExcel(){
    this.dataForExcel = []
    this.dataForExcelDetalle = []
    this.listaGrilla.forEach((row: any) => {
      this.dataForExcel.push(row);
    });

    this.listaGrilla.forEach((row: any) => {
      if(row.listaDesglose!=undefined && row.listaDesglose!=null){
        row.listaDesglose.forEach((ld:any) => {
          this.dataForExcelDetalle.push(ld);
        });
      }
    });
    let reportData = {
      title: 'Reporte Egreso por Rubro',
      data: this.dataForExcel,
      headers: Object.keys(this.headers),
      headers2: Object.keys(this.headers2),
      data2: this.dataForExcelDetalle
    };

    this.ete.exportExcel(reportData);
  }

}

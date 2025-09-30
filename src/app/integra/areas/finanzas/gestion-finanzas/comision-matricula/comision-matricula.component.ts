import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { ComboAsesoresVenta, ReporteComisionMatriculaGrilla } from '@integra/models/comision-matricula';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IntegraService } from '@shared/services/integra.service';
import { IntegraReplicaService } from '@shared/services/integra-replica.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comsion-matricula',
  templateUrl: './comision-matricula.component.html',
  styleUrls: ['./comision-matricula.component.scss']
})
export class ComsionMatriculaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private integraReplicaService: IntegraReplicaService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public finanzasService:FinanzasServiceService
  ) {}

  //---Variables -------
  loader=false
  asesor= new FormControl([])
  fechaInicio = new FormControl()
  fechaFin = new FormControl()
  estado = new FormControl()
  subestado= new FormControl(null)
  pageSizes: any = [5, 10, 20, 'All'];
  activarSubEstado=false;
  listaAsesores:ComboAsesoresVenta[]=[]
  itemslistaAsesores:ComboAsesoresVenta[]=[]
  listaGrilla:ReporteComisionMatriculaGrilla[]=[]
  listaEstado=[
    { id: 0, nombre: "EVALUACIÓN PENDIENTE" }, 
    { id: 1, nombre: "COMISIONABLE"}, 
    { id: 2, nombre: "NO SE PAGA"}
  ]
  listaSubestado:any[]=[]

  ngOnInit(): void {
    this.ObtenerComboAsesores()
    this.ObtenerComboSubestado()
  }


  /// Funciones para obtener Datos ------------------------------------------------
  ObtenerComboAsesores(){
    this.integraService.obtenerTodo(constApiGlobal.PersonalObtenerDatosPersonalVentas).subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response)
        this.listaAsesores=response.body;
        this.itemslistaAsesores = response.body.slice(0,130)
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Combo Periodo');
      },
      complete: () => {},
    });
  }

  ObtenerComboSubestado(){
    this.integraService.obtenerTodo(constApiFinanzas.ReporteComisionPorMatriculaObtenerSubestados,
    ).subscribe({
      next: (response: HttpResponse<{id:number,nombre:string}[]>) => {
        console.log(response)
        this.listaSubestado=response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Combo Subestado');
      },
      complete: () => {},
    });
  }
  /// Funciones ------------------FIN -------------------------------------------------------
  /// Otras FUnciones --------------------------------------------------------------
  FiltrarAsesores(event:string){
    if(event.length<3)this.itemslistaAsesores = this.listaAsesores
    if(event.length>3)
    {
      this.itemslistaAsesores = this.listaAsesores.filter(
        (s) => s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1
        )
    }
  }
  SeleccionEstado(e:any){
    this.activarSubEstado=e.id==1?true:false;
  }
  convertirObjectToString(data:Array<number>):string{
    let lista:string=""
    data.forEach(element => {
      lista+= element.toString() +","
    });
    lista = lista.substring(0,lista.length-1)
    return lista
  }

  //--------FUNCIONES DE GENERACION DE DATOS --------------------------------------

  GenerarReporte(){
    if(this.fechaInicio.valid && this.fechaFin.valid &&
      this.fechaInicio.value!=null && this.fechaFin.value!=null  &&
      typeof this.estado.value == "number"
      )
      {
        let validarSubEstado = true
        if(this.activarSubEstado==true )
        {
          if(typeof this.subestado.value == "number")
            validarSubEstado=true
          else validarSubEstado = false
        }

        if(validarSubEstado)
        {
          let dataAsesor:number[]=[]
          if(this.asesor.value.length==0) 
          {
            this.listaAsesores.forEach(e=>{
              dataAsesor.push(e.id)
            })
          }
          else dataAsesor = this.asesor.value
          this.loader=true
          let listaAsesor=this.convertirObjectToString(dataAsesor)
          let dataEnvio={
            listaAsesores: listaAsesor,
            fechaInicio: datePipeTransform(this.fechaInicio.value,'yyyy-MM-dd'),
            fechaFin: datePipeTransform(this.fechaFin.value,'yyyy-MM-dd'),
            idEstadoComision: this.estado.value,
            idSubEstadoComision: this.subestado.value==null?0:this.subestado.value
          }
          this.integraReplicaService.obtenerPorFiltro(constApiFinanzas.ReporteComisionPorMatriculaGenerarReporte,dataEnvio)
          .subscribe({
            next: (response:HttpResponse<ReporteComisionMatriculaGrilla[]>) => {
              this.loader=false
              if(response.body)
              {
                response.body.forEach(e=>{
                  e.fechaMatricula=new Date(e.fechaMatricula)
                })
                this.listaGrilla = response.body
              }
              
              
            },
            error: (error) => {
              this.loader=false
              this.finanzasService.MensajeDeError(error,'Obtener reporte');
            },
            complete: () => {
              this.loader=false
            },
          });
          
        }
        else{
          Swal.fire(
            "¡Alerta!",
            "Seleccione un Subestado, es necesario!",
            "warning"
          )
        }

      }
      else{
        Swal.fire(
          "¡Alerta!",
          "Seleccione una Fecha de Inicio, una Fecha Fin y un Estado, es necesario!",
          "warning"
        )
      }
  }
}

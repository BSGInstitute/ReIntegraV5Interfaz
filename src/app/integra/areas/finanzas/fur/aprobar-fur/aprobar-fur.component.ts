import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { constApiFinanzas, constApiGestionPersonal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { FurPorAprobar, ParametrosAprobarFUR,AprobarObservarFUR } from '@integra/models/aprobar-fur';
import { State } from '@progress/kendo-data-query';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-aprobar-fur',
  templateUrl: './aprobar-fur.component.html',
  styleUrls: ['./aprobar-fur.component.scss']
})
export class AprobarFurComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    public finanzasService: FinanzasServiceService
  ) {}

  //--Variables------------
  loader:boolean=false
  EsJefeFinanzas=false
  ControlRadioButtom=new FormControl(0);
  inputObservar=new FormControl("");

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal
  //

  pageSizes: any = [5, 10, 20, 'All'];
  gridState: State = {
    sort: [
      {
        field: 'id',
        dir: 'desc', 
      },
    ],
  };

  listaFurPorAprobar:FurPorAprobar[]=[]
  listaSeleccion:number[]=[]
  listaAreas:{
    readonly id:number, 
    readonly codigo:string
    }[]=[]

  totalFur = 0
  totalDolares = 0

  parametro:ParametrosAprobarFUR={
    idArea: 0,
    codigo: "",
    idRol: 0,
    tipo: 0
  }

  ngOnInit(): void {
    this.validarListador(this.usuario.idRol)
    this.obtenerComboAreas();
  }

  //// Funciones para la Obtencion de Datos---------INICIO----------------------
  obtenerDatosGrilla(parametro:ParametrosAprobarFUR){//Obtiene Los datos para la grilla
    this.loader=true
    this.integraService.obtenerPorFiltro(constApiFinanzas.AprobarFurObtenerDatosGrilla,parametro)
    .pipe(
      map((resp: any) =>
        resp.body.map((item: any) => ({
            ...item,
            fechaLimite: datePipeTransform(item.fechaLimite, 'dd-MM-yyyy'),
          }
        ))
      )
    )
    .subscribe({
      next: (response: FurPorAprobar[]) => {
        this.listaFurPorAprobar=response
        this.loader=false
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }
  obtenerComboAreas(){//Obtiene Combo de Areas
    this.integraService.obtenerTodo(constApiGestionPersonal.PersonalAreaTrabajoObtener).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly codigo:string}[]>) => {
        console.log(response.body)
        this.listaAreas=response.body
        this.parametro.idArea=this.listaAreas.find(e=>e.codigo.toLowerCase()===this.usuario.areaTrabajo.toLowerCase()).id
        this.obtenerDatosGrilla(this.parametro)
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }
  //// Funciones para la Obtencion de Datos---------FIN-------------------------

  //// Funciones auxiliares--------------- INCIO----------------------------- 
  mostrarMensajeError(error: any): void {//Muestra un Mensaje de error
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }

  buscar(){//Busca segun el tipo Jefe de Area=0,Jefe de finanzas=1
    this.parametro.tipo=this.ControlRadioButtom.value
    this.obtenerDatosGrilla(this.parametro)
  }

  CalcularTotal(){//Calcula el total de FURS y Efectivo Dolares de los seleccionados
    this.totalFur = 0
    this.totalDolares = 0
    let seleccion = this.listaSeleccion
    seleccion.forEach((e:any) => {
      this.totalFur+=1
      this.totalDolares += this.listaFurPorAprobar.find(cp=>cp.id===e).precioTotalDolares
    });
  }

  limpiarSeleccion(){// Limpia la selección
    this.listaSeleccion=[]
    this.CalcularTotal()
  }
  refrescarGrilla(){//Reinicia la grilla
    this.parametro.tipo=this.ControlRadioButtom.value
    this.limpiarSeleccion()
    this.obtenerDatosGrilla(this.parametro)
  }

  msgEliminar(dataItem:FurPorAprobar): void {//mensaje para eliminar
    Swal.fire({
      title: '¿Está seguro de querer eliminar el FUR?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarFur(dataItem);
      }
    });
  }

  LimpiarGrilla(){
    this.limpiarSeleccion()
    this.listaFurPorAprobar=[]
  }

  validarListador(idRol:number){
    if(idRol==19)//19 es el ROl de JefeFinanzas
    this.EsJefeFinanzas=true;
  }
  //// Funciones auxiliares--------------- FIN------------------------------- 
  //// Acciones CRUD -----------------------INICIO--------------------------------------------------

  aprobarObservarFUR(isAprobar:boolean,data?:FurPorAprobar){
    let observacion=""
    let ids:number[]=[]
    let noError: boolean = true
    if(isAprobar) observacion ="Ninguna"
    else {
      if(this.inputObservar.value.length>0)
        observacion = this.inputObservar.value;
      else{
        noError =false
        Swal.fire(
          "¡Alerta!",
          "Ingresa el detalle de la Observación!",
          "warning"
        )
      }
    }
    if(data){
      ids=[data.id]
    }
    else{
      if(this.listaSeleccion.length!=0)
        ids=this.listaSeleccion;
      else{
        noError =false
        Swal.fire(
          "¡Alerta!",
          "Debe seleccionar al menos un registro!",
          "warning"
        )
      }
    }
    let dataEnvio:AprobarObservarFUR={
      ids:ids,
      usuario: this.usuario.userName,
      idRol: this.parametro.idRol,
      checkedIsFurGeneral: this.ControlRadioButtom.value,
      isAprobar: isAprobar,
      observacion: observacion
    }
    if(noError)
    {
      let sms=""
      if(isAprobar)sms="Aprobar"
      else sms="Observar"
      Swal.fire({
        title: '¿Está seguro de realizar la operación de '+sms+' FUR?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Realizar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loader=true
          this.integraService
            .insertar(constApiFinanzas.AprobarFurObservarAprobar, dataEnvio)
            .subscribe({
            next: (response: HttpResponse<any>) => {
              this.loader=false
              if(response.body.result)
              {
                ids.forEach(e=>{
                  this.listaFurPorAprobar = this.listaFurPorAprobar.filter(lf => lf.id!==e)
                });
                this.limpiarSeleccion()
                let mensaje=""
                if(isAprobar)
                {
                  if(data)mensaje="El registro FUR fue aprobado!"
                  else mensaje="Los registros FUR fueron aprobados!"
                }else{
                  if(data)mensaje="El registro FUR paso a estado Observado!"
                  else mensaje="Los registros FUR pasaron a estado Observado!"
                }
                this.inputObservar.reset()
                Swal.fire(
                  '¡Operación exitosa!',
                    mensaje,
                  'success'
                );
              }
              else{
                Swal.fire(
                  '¡Operación fallida!',
                    response.body.error,
                  'error'
                );
              }
            },
            error: (error) => {
              this.loader=false
              console.log(error)
              this.mostrarMensajeError(error);
            },
            complete: () => {
              this.loader=false
            }
          });
        }
      });
      
    }
  }

  eliminarListaFur(){
    if(this.listaSeleccion.length>0)
    {
      Swal.fire({
        title: '¿Está seguro de realizar la operación de Eliminar FURS?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Realizar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.loader = true;
          let params: Parametro[] = [
            { clave: 'usuario', valor: "--" }
          ];
          this.integraService
            .eliminarListadoPorPathParams(constApiFinanzas.FurEliminarLista, params,this.listaSeleccion)
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                if ((response.body == true)) {
                  this.listaSeleccion.forEach(e=>{
                    this.listaFurPorAprobar = this.listaFurPorAprobar.filter(lf => lf.id!==e)
                  });
                  this.limpiarSeleccion()            
                  this.loader = false;
                  Swal.fire(
                    '¡Eliminado!',
                    'Los registros han sido eliminados.',
                    'success'
                  );
                } else {
                  Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                }
              },
              error: (error) => {
                this.loader = false;
                this.mostrarMensajeError(error);
              },
              complete: () => { },
            });
        }
      });
    }else{
      Swal.fire(
        "¡Alerta!",
        "Debe seleccionar al menos un registro!",
        "warning"
      )
    }
    
  }

  eliminarFur(dataItem: FurPorAprobar) {
    this.loader = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName},
    ];
    this.integraService
      .eliminarPorPathParams(constApiFinanzas.FurEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.listaFurPorAprobar = this.listaFurPorAprobar.filter(e=>e.id!==dataItem.id)
            this.loader = false;
            this.limpiarSeleccion()
            Swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
          }
        },
        error: (error) => {
          this.loader = false;
          this.mostrarMensajeError(error);
        },
        complete: () => { },
      });
  }
  //// Acciones CRUD -----------------------FIN--------------------------------------------------
  
  //// Controlador de Acciones_---------------INICIO-----------------------------------------
  
  ControlAccionesGrilla(accion:string,data?:FurPorAprobar,rowIndex?:number){
    //Control de Acciones de Grilla
    switch (accion){
      case 'eliminar':
        this.msgEliminar(data);
        break;
      case 'refrescar':
        this.refrescarGrilla()
        break;
      case 'aprobar':
        this.aprobarObservarFUR(true,data)
        break;
    }
  }
  //// Controlador de Acciones----------------FIN---------------------------------------------

}

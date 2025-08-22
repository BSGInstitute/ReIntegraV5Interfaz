import {  HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { constApiFinanzas } from '@environments/constApi';
import { environment } from '@environments/environment';
import { ActivarFur } from '@integra/models/activar-fur';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { map } from 'rxjs';
import Swal from 'sweetalert2';

const baseURL = environment.urlServicioAPI;
@Component({
  selector: 'app-activar-fur',
  templateUrl: './activar-fur.component.html',
  styleUrls: ['./activar-fur.component.scss']
})
export class ActivarFurComponent implements OnInit {
  

  constructor(
    private integraService: IntegraService
  ) { }
  ////Variable-------------------------
  loader=false
  listaSeleccion:number[] =[]
  listaFursPorActivar: ActivarFur[] =[]

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal
  //

  func(){}

  ngOnInit(): void {
    this.loader=true
    this.obtenerDatosGrillaFursPorActivar()
  }

  //// Funciones para la Obtencion de Datos---------INICIO----------------------
  obtenerDatosGrillaFursPorActivar(){//Obtiene Los Datos para la Grilla
    this.loader=true
    this.integraService.obtenerTodo(constApiFinanzas.ActivarFurObtenerDatos)
    .pipe(
      map((resp: any) =>
        resp.body.map((item: any) => ({
            ...item,
            fechaLimite: datePipeTransform(item.fechaLimite, 'dd-MM-yyyy'),
            fechaAprobacionJefeFinanzas: datePipeTransform(item.fechaAprobacionJefeFinanzas, 'dd-MM-yyyy'),
          }
        ))
      )
    )
    .subscribe({
      next: (response: ActivarFur[]) => {
        this.loader=false
        this.listaFursPorActivar=response
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
    });
  }
  
  
  //// Funciones para la Obtencion de Datos---------FIN----------------------------

  //// Funciones auxiliares--------------- INCIO-------------------------------------
  mostrarMensajeError(error: any): void {//Muestra un Mensaje de error
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }

  msgEliminar(): void {
    if(this.listaSeleccion.length>0)
    {
      Swal.fire({
        title: '¿Está seguro de querer eliminar los FURS?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Eliminalo!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.eliminarListaFur()
        }
      });
    }
    else{
      Swal.fire(
        "!Alerta¡",
        "Selecciona los FURS a eliminar, es necesario!",
        "warning"
      )
    }
    
  }

  msgActivar(): void {
    if(this.listaSeleccion.length>0)
    {
      Swal.fire({
        title: '¿Está seguro de querer activar los FURS?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Activar!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.activarFurs()
        }
      });
    }
    else{
      Swal.fire(
        "!Alerta¡",
        "Selecciona los FURS a aprobar, es necesario!",
        "warning"
      )
    }
    
  }
  limpiarSeleccion(){
    this.listaSeleccion=[]
  }


  //// Funciones auxiliares--------------- FIN   -------------------------------------
  //// Acciones CRUD -----------------------INICIO--------------------------------------------------


  activarFurs(){
    this.loader=true
    let params: Parametro[] = [
      { clave: 'usuario', valor: this.usuario.userName }
    ];
    this.integraService
    .obtenerPorPathParamsFilto(constApiFinanzas.ACtivarFurActivar, params,this.listaSeleccion)
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        if ((response.body == true)) {
          this.listaSeleccion.forEach(e=>{
            this.listaFursPorActivar = this.listaFursPorActivar.filter(lf => lf.id!==e)
          });
          this.listaSeleccion=[]           
          this.loader = false;
          Swal.fire(
            '¡Proceso Exitoso!',
            'Los registros han sido activado correctamente!.',
            'success'
          );
        } else {
          Swal.fire('Error!', 'Ocurrio un problema al activar.', 'warning');
        }
      },
      error: (error) => {
        this.loader = false;
        this.mostrarMensajeError(error);
      },
      complete: () => { },
    });       
  }

  eliminarListaFur(){
      this.loader = true;
      let params: Parametro[] = [
        { clave: 'usuario', valor: this.usuario.userName}
      ];
      this.integraService
        .eliminarListadoPorPathParams(constApiFinanzas.FurEliminarLista, params,this.listaSeleccion)
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            if ((response.body == true)) {
              this.listaSeleccion.forEach(e=>{
                this.listaFursPorActivar = this.listaFursPorActivar.filter(lf => lf.id!==e)
              });
              this.listaSeleccion=[]       
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
  //// Acciones CRUD -----------------------FIN --------------------------------------------------

}

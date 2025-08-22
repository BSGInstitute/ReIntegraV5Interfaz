import { HttpResponse } from '@angular/common/http';
import { Injectable, ViewChild, ViewContainerRef } from '@angular/core';
import { constApi } from '@environments/constApi';
import { NotificationService } from '@progress/kendo-angular-notification';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { ComboPaisDTO } from '@shared/models/combo';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

@Injectable({
  providedIn: 'root'
})
export class FinanzasServiceService {

  constructor(
    private notificationService: NotificationService
  ) { }
  //----------------------------------------------------------------------------------------------------------------
  // Variables ----------------------------------------------------------------------------------------------------------------
  @ViewChild('contentDrawer', { read: ViewContainerRef })
  contentDrawer: ViewContainerRef;

  //----------------------------------------------------------------------------------------------------------------
  // Funciones Auxiliares ----------------------------------------------------------------------------------------------------------------
  MensajeDeError(error:any,control:string){//Muestra mensajes de error
    try{
        let errorText = error.error.title?error.error.title:error.error
        console.log(errorText)
        control = control.toLocaleUpperCase()
        switch(error.status)
        {
          case 500:
            this.notificationError(
              "( "+control+" ) ERROR "+error.status+": Usuario no autorizado, vuelve a iniciar sesión ( "+errorText+" )",
              "center",
              "bottom")
            break;
          case 400:
            this.notificationError(
              "( "+control+" ) ERROR "+error.status+": Ocurrio un error al ejecutar al servicio ( "+errorText+" )",
              "center",
              "bottom")
            break;
          case 0:
            this.notificationError(
              "( "+control+" ) ERROR "+error.status+": Revisar la conexión con el servicio ( Posible error de petición HTTP ó conección )",
              "center",
              "bottom")
              break;
          default:
            this.notificationError(
              "( "+control+" ) ERROR "+error.status+": Ocurrio un error inesperado ( "+errorText+" )",
              "center",
              "bottom")
            break;
        }
    }
    catch{
      this.notificationError(
        "( "+control+" ) ERROR PIPE: Ocurrio un error inesperado ( "+error+" )",
        "center",
        "bottom")
    }
  }

  notificationError(
    content: any,
    horizontal: 'left' | 'center' | 'right' = 'right',
    vertical: 'top' | 'bottom' = 'bottom',
    viewContainerRef?: ViewContainerRef
  ): void {
    this.notificationService.show({
      appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
      content: content,
      hideAfter: 1000,
      closable: true,
      cssClass: 'button-notification',
      position: { horizontal: horizontal, vertical: vertical },
      animation: { type: 'fade', duration: 400 },
      type: { style: 'error', icon: true },
    });
  }

  convertirFecha(cadenaFecha:string) {
    const meses: { [key: string]: number } = {
      'Enero': 0, 'Febrero': 1, 'Marzo': 2, 'Abril': 3,
      'Mayo': 4, 'Junio': 5, 'Julio': 6, 'Agosto': 7, 'Septiembre': 8,
      'Setiembre': 8,
      'Octubre': 9, 'Noviembre': 10, 'Diciembre': 11
    };
    const partes = cadenaFecha.split(' ');
    const mes = meses[partes[0]];
    const año = Number(partes[1]);
    const fecha = new Date(año, mes, 1);
    return fecha;
  }

  // -------------------------------------------------------------------------------------------
  // Funciones Template ----------------------------------------------------------------
  fechaTemplate(fecha:any,withTime?:boolean)// obtiene la fecha formateada para el mostrado en la grilla
  {
    try{
      if(withTime)
      {
        if(typeof fecha=="string")
        {
          return datePipeTransform(new Date(fecha),'dd-MM-yyyy HH:mm', 'en-US')
        }
        else if(fecha!=null || fecha!=undefined)
        {
          return datePipeTransform(fecha,'dd-MM-yyyy HH:mm', 'en-US')
        }
      }
      else if(typeof fecha=="string")
      {
        return datePipeTransform(new Date(fecha),'dd-MM-yyyy', 'en-US')
      }
      else if(fecha!=null || fecha!=undefined)
      {
        return datePipeTransform(fecha,'dd-MM-yyyy', 'en-US')
      }
      else return fecha
    
    }
    catch{
      return fecha
    }
    
  }
}

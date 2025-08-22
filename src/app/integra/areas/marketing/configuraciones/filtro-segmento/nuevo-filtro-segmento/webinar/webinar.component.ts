import { EstadoPago } from '@integra/models/filtro-segmento';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import {MatDialog} from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { timingSafeEqual } from 'crypto';


@Component({
  selector: 'app-webinar',
  templateUrl: './webinar.component.html',
  styleUrls: ['./webinar.component.scss']
})
export class WebinarComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
  ) {}

  @Input() datosActualizar: any;

  ngOnInit(): void {

    this.obtenerOperador();

  }

  Lengt:any
  displayedColumns: string[] = ['estadoAcademico', 'operador','cantidad', 'unidadDeTiempor', 'acciones'];
  dataSourceEP: Array<any> = [];
  loading:any
  listaOperadores:any
  listaFrecuencia:any
  estado: any = 0;
  operadores: any = 0;
  frecuencia: any = 0;
  cantidad: any = 0;
  times =true


  estadoWebinar: Array<EstadoPago> = [
    { Id : 1, Nombre : "Sesiones webinar por confirmar dentro de " },
    { Id : 2, Nombre : "Recordatorio asistencia webinar dentro de" },
    { Id : 3, Nombre : "Sesion webinar dentro de (almenos un alumno webinar confirmado)" },
 ];

 

   //-------------------Funciones Obtener ---------------------//

   obtenerOperador() {
    this.loading = true;
    this.integraService.obtener(constApiMarketing.ObtenerOperadorCombo).subscribe({
      next: (response: HttpResponse<any>) => {
        this.loading = false;
        this.listaOperadores = response.body;

        this.ObtenerFrecuenciaTiempo();
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }

  ObtenerFrecuenciaTiempo() {
    this.loading = true;
    this.times=false
    this.integraService.obtener(constApiMarketing.ObtenerFrecuenciaTiempo).subscribe({
      next: (response: HttpResponse<any>) => {
        this.loading = false;
        this.listaFrecuencia = response.body;

        if (this.datosActualizar != undefined) {
          this.datosActualizar.listaSesionWebinar.forEach((e: any) => {
            this.estadoWebinar.forEach((f: any) => {
              if (e.valor == f.Id) {
                this.listaFrecuencia.forEach((lf: any) => {
                  if (e.idTiempoFrecuencia == lf.id) {
                    this.listaOperadores.forEach((op: any) => {
                      if (e.idOperadorComparacion == op.id) {
                        this.dataSourceEP.push({
                          id: op.id,
                          valor: f.Id,
                          estadoNombre: f.Nombre,
                          idTiempoFrecuencia: lf.id,
                          frecuenciaNombre: lf.nombre,
                          cantidadTiempoFrecuencia: e.cantidadTiempoFrecuencia,
                          idOperadorComparacion: op.id,
                          operadorNombre: op.nombre,
                        });
                        setTimeout(() => {
                          this.times = true;
                        }, 250);
                      }
                    });
                  }
                });
              }
            });
           
           
          });
        }
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {},
    });
  }


  
  Agregar() {
    if (this.estado == 0) {
      this.alertaService.mensajeIcon(
        'Error',
        'Debe seleccionar un estado',
        'error'
      );
    } else {
      if (this.operadores == 0) {
        this.alertaService.mensajeIcon(
          'Error',
          'Debe seleccionar un operador',
          'error'
        );
      } else {
        if (this.cantidad == 0) {
          this.alertaService.mensajeIcon(
            'Error',
            'Debe seleccionar una cantidad',
            'error'
          );
        } else {
          if (this.frecuencia == 0) {
            this.alertaService.mensajeIcon(
              'Error',
              'Debe seleccionar una frecuencia',
              'error'
            );
          } else {
            this.times=false
            this.dataSourceEP.push(
              {
                id:0,
                valor: this.estado.Id,
                estadoNombre: this.estado.Nombre,
                idTiempoFrecuencia: this.frecuencia.id,
                frecuenciaNombre: this.frecuencia.nombre,
                cantidadTiempoFrecuencia: this.cantidad,
                idOperadorComparacion: this.operadores.id,
                operadorNombre: this.operadores.nombre,
              }
            );
            setTimeout(() => {
              this.times=true
            }, 250);
          }
        }
      }
    }
  }

  
  eliminarWebinar(index: any) {
    this.times=false
    this.dataSourceEP.splice(index, 1);
    setTimeout(() => {
      this.times=true
    }, 150);

  }

  //---------------------CONTROL GRID ---------------------------------------------
  gridEventsResponse(action: string, dataItem?: any, rowIndex?: any): void {
    switch (action) {
      case 'eliminar':
        this.eliminarWebinar(rowIndex)
        break;
    }
  }
}

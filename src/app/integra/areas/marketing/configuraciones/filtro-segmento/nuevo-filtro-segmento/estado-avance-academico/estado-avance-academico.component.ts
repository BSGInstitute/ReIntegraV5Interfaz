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


@Component({
  selector: 'app-estado-avance-academico',
  templateUrl: './estado-avance-academico.component.html',
  styleUrls: ['./estado-avance-academico.component.scss']
})
export class EstadoAvanceAcademicoComponent implements OnInit {

  
  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog,
  ) {}

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
  times= true

  estadoAcademico: Array<EstadoPago> = [
    { Id : 1, Nombre : "Autoevaluaciones vencidas hace" },
    { Id : 2, Nombre : "Autoevaluaciones por vencer dentro de" },
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
          this.datosActualizar.listaEstadoPago.forEach((e: any) => {
            this.estadoAcademico.forEach((f: any) => {
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

  
  eliminarAvance(index: any) {
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
        this.eliminarAvance(rowIndex)
        break;
    }
  }
}

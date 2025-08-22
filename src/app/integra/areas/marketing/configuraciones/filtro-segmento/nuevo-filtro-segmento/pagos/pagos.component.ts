import { EstadoPago } from '@integra/models/filtro-segmento';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.scss'],
})
export class PagosComponent implements OnInit, OnChanges {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  @Input() datosActualizar: any;

  ngOnInit(): void {
    this.obtenerOperador();
  }

  ngOnChanges(): void {
    this.obtenerOperador();
  }

  Lengt: any;
  displayedColumns: string[] = [
    'estadoPago',
    'operador',
    'cantidad',
    'unidadDeTiempor',
    'acciones',
  ];
  dataSourceEP: Array<any> = [];
  loading: any;
  listaOperadores: any;
  listaFrecuencia: any;
  estado: any = 0;
  operadores: any = 0;
  frecuencia: any = 0;
  cantidad: any = 0;
  dataSource: any;
  listaPagosTexto: any;
  times = true;

  estadoPago: Array<EstadoPago> = [
    { Id: 1, Nombre: 'Cuotas vencidas hace' },
    { Id: 2, Nombre: 'Cuotas por vencer dentro de' },
  ];

  //-------------------Funciones Obtener ---------------------//

  obtenerOperador() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerOperadorCombo)
      .subscribe({
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
    this.integraService
      .obtener(constApiMarketing.ObtenerFrecuenciaTiempo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaFrecuencia = response.body;

          this.dataSourceEP = []
          if (this.datosActualizar != undefined) {
            this.datosActualizar.listaEstadoPago.forEach((e: any) => {  
              this.estadoPago.forEach((f: any) => {
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
            this.times = false;
            this.dataSourceEP.push({
              id: 0,
              valor: this.estado.Id,
              estadoNombre: this.estado.Nombre,
              idTiempoFrecuencia: this.frecuencia.id,
              frecuenciaNombre: this.frecuencia.nombre,
              cantidadTiempoFrecuencia: this.cantidad,
              idOperadorComparacion: this.operadores.id,
              operadorNombre: this.operadores.nombre,
            });
            setTimeout(() => {
              this.times = true;
            }, 250);
          }
        }
      }
    }
  }

  eliminarPago(index: any) {
    this.times = false;
    this.dataSourceEP.splice(index, 1);
    setTimeout(() => {
      this.times = true;
    }, 150);
  }

  //---------------------CONTROL GRID ---------------------------------------------
  gridEventsResponse(action: string, dataItem?: any, rowIndex?: any): void {
    switch (action) {
      case 'eliminar':
        this.eliminarPago(rowIndex);
        break;
    }
  }
}

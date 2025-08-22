import { EstadoPago } from '@integra/models/filtro-segmento';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
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
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-trabajo-alumno',
  templateUrl: './trabajo-alumno.component.html',
  styleUrls: ['./trabajo-alumno.component.scss'],
})
export class TrabajoAlumnoComponent implements OnInit {
  @ViewChild('actividadInput') actividadesInput: ElementRef<HTMLInputElement>;
  @ViewChild('ocurrenciaInput') ocurrenciaInput: ElementRef<HTMLInputElement>;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  @Input() datosActualizar: any;

  displayedColumns: string[] = [
    'estado',
    'cantidad',
    'unidadDeTiempo',
    'acciones',
  ];
  displayedColumns2: string[] = [
    'estado',
    'cantidad',
    'unidadDeTiempo',
    'acciones',
  ];

  loading: any;
  dataSourceEP: Array<any> = [];
  dataSourceEPFinal: Array<any> = [];
  Lengt: any;
  listaFrecuencia: any;
  cantidad: any = 0;
  tiempo: any = 0;
  cantidadFinal: any = 0;
  tiempoFinal: any = 0;
  times = true;

  estadoTrabajo: Array<EstadoPago> = [
    { Id: 1, Nombre: 'Trabajo alumno dentro de' },
    { Id: 2, Nombre: 'Trabajo final alumno dentro de' },
  ];

  ngOnInit(): void {
    this.ObtenerFrecuenciaTiempo();
  }

  //-------------Funciones Obtener-----------------------//

  ObtenerFrecuenciaTiempo() {
    this.loading = true;
    this.times = false;
    this.integraService
      .obtener(constApiMarketing.ObtenerFrecuenciaTiempo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaFrecuencia = response.body;

          this.dataSourceEP=[]
          if (this.datosActualizar != undefined) {
            this.datosActualizar.listaTrabajoAlumno.forEach((e: any) => {
              this.estadoTrabajo.forEach((f: any) => {
                if (e.valor == f.Id) {
                  this.listaFrecuencia.forEach((lf: any) => {
                    if (e.idTiempoFrecuencia == lf.id) {
                      this.dataSourceEP.push({  
                        id: e.id,
                        valor: 0,
                        estado: f.Nombre,
                        idTiempoFrecuencia: lf.id,
                        frecuenciaNombre: lf.nombre,
                        cantidadTiempoFrecuencia: e.cantidadTiempoFrecuencia,
                        idOperadorComparacion: 0,
                        operadorNombre: 0,
                      });
                      setTimeout(() => {
                        this.times = true;
                      }, 250);
                    }
                  });
                }
              });
            });

            this.dataSourceEPFinal = []
            this.datosActualizar.listaTrabajoAlumnoFinal.forEach((e: any) => {
              this.estadoTrabajo.forEach((f: any) => {
                if (e.valor == f.Id) {
                  this.listaFrecuencia.forEach((lf: any) => {
                    if (e.idTiempoFrecuencia == lf.id) {
                      this.dataSourceEPFinal.push({
                        id: e.id,
                        valor: 0,
                        estado:f.Nombre,
                        idTiempoFrecuencia: lf.id,
                        frecuenciaNombre: lf.nombre,
                        cantidadTiempoFrecuencia: e.cantidadTiempoFrecuencia,
                        idOperadorComparacion: 0,
                        operadorNombre: 0,
                      });
                      setTimeout(() => {
                        this.times = true;
                      }, 250);
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

  //--------------Otras funciones--------------------//

  Agregar() {
    if (this.cantidad == 0) {
      this.alertaService.mensajeIcon(
        'Error',
        'Debe seleccionar una cantidad',
        'error'
      );
    } else {
      if (this.tiempo == 0) {
        this.alertaService.mensajeIcon(
          'Error',
          'Debe seleccionar un tiempo',
          'error'
        );
      } else {
        this.times = false;

        this.dataSourceEP.push({
          id: 0,
          valor: 1,
          estado: 'Trabajos por entregar',
          idTiempoFrecuencia: this.tiempo.id,
          frecuenciaNombre: this.tiempo.nombre,
          cantidadTiempoFrecuencia: this.cantidad,
          idOperadorComparacion: 0,
          operadorNombre: 0,
        });

        setTimeout(() => {
          this.times = true;
        }, 250);
      }
    }
  }

  AgregarFinal() {
    if (this.cantidadFinal == 0) {
      this.alertaService.mensajeIcon(
        'Error',
        'Debe seleccionar una cantidad',
        'error'
      );
    } else {
      if (this.tiempoFinal == 0) {
        this.alertaService.mensajeIcon(
          'Error',
          'Debe seleccionar un tiempo',
          'error'
        );
      } else {
        this.times = false;

        this.dataSourceEPFinal.push({
          id: 0,
          valor: 2,
          estado: 'Trabajos por entregar',
          idTiempoFrecuencia: this.tiempoFinal.id,
          frecuenciaNombre: this.tiempoFinal.nombre,
          cantidadTiempoFrecuencia: this.cantidadFinal,
          idOperadorComparacion: 0,
          operadorNombre: 0,
        });

        setTimeout(() => {
          this.times = true;
        }, 250);
      }
    }
  }

  eliminarTrabajo(index: any) {
    this.times = false;
    this.dataSourceEP.splice(index, 1);
    setTimeout(() => {
      this.times = true;
    }, 150);
  }

  eliminarTrabajoFinal(index: any) {
    this.times = false;
    this.dataSourceEPFinal.splice(index, 1);
    setTimeout(() => {
      this.times = true;
    }, 150);
  }

  //---------------------CONTROL GRID ---------------------------------------------
  gridEventsResponse(action: string, dataItem?: any, rowIndex?: any): void {
    console.log(action);
    switch (action) {
      case 'eliminar':
        this.eliminarTrabajo(rowIndex);
        break;
      case 'eliminarFinal':
        this.eliminarTrabajoFinal(rowIndex);
        break;
    }
  }
}

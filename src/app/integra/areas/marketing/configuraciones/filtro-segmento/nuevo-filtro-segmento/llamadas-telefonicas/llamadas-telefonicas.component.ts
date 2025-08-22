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
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-llamadas-telefonicas',
  templateUrl: './llamadas-telefonicas.component.html',
  styleUrls: ['./llamadas-telefonicas.component.scss'],
})
export class LlamadasTelefonicasComponent implements OnInit {
  @ViewChild('actividadInput') actividadesInput: ElementRef<HTMLInputElement>;
  @ViewChild('ocurrenciaInput') ocurrenciaInput: ElementRef<HTMLInputElement>;
  @ViewChild('actividadFiltro') public actividadFiltro: MultiSelectComponent;
  @ViewChild('ocurrenciaFiltro') public ocurrenciaFiltro: MultiSelectComponent;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  displayedColumns: string[] = [
    'estadoLlamada',
    'cantidad',
    'unidadDeTiempo',
    'acciones',
  ];

  @Input() datosActualizar: any;

  loading: any;
  dataSourceEP: Array<any> = [];

  Lengt: any;
  listaFrecuencia: any;
  listaActividadCabecera: any = [];
  listaOcurrencia: any = [];

  cantidad: any = 0;
  tiempo: any = 0;
  cantidadFinal: any = 0;
  tiempoFinal: any = 0;

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  actividadEnvio: Array<any> = [];
  listaActividadFiltro : any = [];
  ocurrenciaEnvio: Array<any> = [];
  listaOcurrenciaFiltro : any = [];

  times =true 

  estadoLlamada: Array<EstadoPago> = [
    { Id: 1, Nombre: 'Con llamada efectiva en los ultimos' },
    { Id: 2, Nombre: 'Con llamada efectiva en los ultimos' },
  ];


  //----AutocompleteActividad---------//

  actividades: any = [];

  //----AutocompleteOcurrencia---------//

  ocurrencias: any = [];

  ngOnInit(): void {
    this.ObtenerFrecuenciaTiempo();
    this.ObtenerActividadCabecera();
    this.ObtenerOcurrencia();
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

          if (this.datosActualizar != undefined) {
            this.datosActualizar.listaEstadoLlamada.forEach((e: any) => {
              this.estadoLlamada.forEach((f: any) => {
                if (e.valor == f.Id) {
                  this.listaFrecuencia.forEach((lf: any) => {
                    if (e.idTiempoFrecuencia == lf.id) {
                          this.dataSourceEP.push({
                            id: e.id,
                            valor: f.Id,
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
          }
          
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerActividadCabecera() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerActividadCabecera)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaActividadCabecera = response.body;
          this.listaActividadFiltro   = this.listaActividadCabecera
          if (this.datosActualizar != undefined) {
            this.listaActividadCabecera.forEach((p: any) => {
              this.datosActualizar.listaActividadLlamada.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.actividades.push(p);
                }
              });
            });


            this.ObtenerOcurrencia();
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerOcurrencia() {
    this.loading = true;
    this.integraService.obtener(constApiMarketing.ObtenerOcurrencia).subscribe({
      next: (response: HttpResponse<any>) => {
        this.loading = false;
        this.listaOcurrencia = response.body;
        this.ocurrencias = []
        this.listaOcurrenciaFiltro = this.listaOcurrencia
        if (this.datosActualizar != undefined) {
          this.listaOcurrencia.forEach((p: any) => {
            this.datosActualizar.listaOcurrencia.forEach((e: any) => {
              if (p.id == e.valor) {
                this.ocurrencias.push(p);
              }
            });
          });
        }
      },
      error: (error) => {
        this.alertaService.mensajeError(error);
      },
      complete: () => {

        this.actividades.forEach((e:any) => {
          this.actividadEnvio.push({Valor: e.id })
        });

        this.ocurrencias.forEach((e:any) => {
          this.ocurrenciaEnvio.push({Valor: e.id })
        });

      },
    });
  }

  //---------AutocompleteActividadCabecera----------------//

  valueChangeActividad(e: any) {
    this.actividadEnvio = [];
    e.forEach((f: any) => {
      this.actividadEnvio.push({ Valor: f.id });
    });

  }

  filterChangeActividad(e: any) {
    this.listaActividadFiltro = this.listaActividadCabecera;
    if (e.length >= 1) {
      this.listaActividadFiltro = this.listaActividadCabecera.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.actividadFiltro.toggle(false);
  }
  }

  removeTagActividad(e: any) {
    this.actividadEnvio.splice(e.id, 1);
  }

  //---------AutocompleteOcurrencia----------------//

  valueChangeOcurrencia(e: any) {

    this.ocurrenciaEnvio = [];
    e.forEach((f: any) => {
      this.ocurrenciaEnvio.push({ Valor: f.id });
    });

  }

  filterChangeOcurrencia(e: any) {
    this.listaOcurrenciaFiltro = this.listaOcurrencia;
    if (e.length >= 1) {
      this.listaOcurrenciaFiltro = this.listaOcurrencia.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.ocurrenciaFiltro.toggle(false);
  }
  }

  removeTagOcurrencia(e: any) {
    this.ocurrenciaEnvio.splice(e.id, 1);
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
        this.times=false
        this.dataSourceEP.push({

          id:0,
          valor: 1,
          estado:  'Llamada efectiva hace',
          idTiempoFrecuencia: this.tiempo.id,
          frecuenciaNombre: this.tiempo.nombre,
          cantidadTiempoFrecuencia: this.cantidad,
          idOperadorComparacion: 0,
          operadorNombre: 0,

        });

        setTimeout(() => {
          this.times=true
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
        this.times=false
        this.dataSourceEP.push({

          id:0,
          valor: 2,
          estado:  'Llamada no efectiva hace',
          idTiempoFrecuencia: this.tiempoFinal.id,
          frecuenciaNombre: this.tiempoFinal.nombre,
          cantidadTiempoFrecuencia: this.cantidadFinal,
          idOperadorComparacion: 0,
          operadorNombre: 0,
          
        });
        setTimeout(() => {
          this.times=true
        }, 250);
      }
    }
  }

  eliminarTrabajo(index: any) {
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
        this.eliminarTrabajo(rowIndex);
        break;
    }
  }
}

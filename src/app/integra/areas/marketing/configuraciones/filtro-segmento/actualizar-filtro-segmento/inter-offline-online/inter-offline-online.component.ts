import { EstadoPago } from '@integra/models/filtro-segmento';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
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
  selector: 'app-inter-offline-online',
  templateUrl: './inter-offline-online.component.html',
  styleUrls: ['./inter-offline-online.component.scss'],
})
export class InterOfflineOnlineComponent implements OnInit, OnChanges {

  @ViewChild('multiselect') public multiselect: MultiSelectComponent;
  @ViewChild('actividadInput') actividadesInput: ElementRef<HTMLInputElement>;

  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  ngOnChanges(): void {
    if (this.datosActualizar != undefined) {
      this.datos = this.datosActualizar.considerarInteraccionOfflineOnline;

      if(this.datosActualizar.fechaInicioLlamada != null){
        this.FechaInicioLlamada =
        new Date(this.datosActualizar.fechaInicioLlamada);
      }
      else{
        this.FechaInicioLlamada = null
      }

      if(this.datosActualizar.fechaFinLlamada != null){
        this.FechaFinLlamada =
        new Date(this.datosActualizar.fechaFinLlamada);
      }
      else{
        this.FechaFinLlamada = null
      }

      this.IdOperadorComparacionDuracionPromedioLlamadaPorOportunidad =
        this.datosActualizar.idOperadorComparacionDuracionPromedioLlamadaPorOportunidad;
      this.DuracionPromedioLlamadaPorOportunidad =
        this.datosActualizar.duracionPromedioLlamadaPorOportunidad;
      this.IdOperadorComparacionDuracionTotalLlamadaPorOportunidad =
        this.datosActualizar.idOperadorComparacionDuracionTotalLlamadaPorOportunidad;
      this.DuracionTotalLlamadaPorOportunidad =
        this.datosActualizar.duracionTotalLlamadaPorOportunidad;
      this.IdOperadorComparacionNroLlamada =
        this.datosActualizar.idOperadorComparacionNroLlamada;
      this.NroLlamada = this.datosActualizar.nroLlamada;
      this.IdOperadorComparacionDuracionLlamada =
        this.datosActualizar.idOperadorComparacionDuracionLlamada;
      this.DuracionLlamada = this.datosActualizar.duracionLlamada;
      this.IdOperadorComparacionTasaEjecucionLlamada =
        this.datosActualizar.idOperadorComparacionTasaEjecucionLlamada;
      this.TasaEjecucionLlamada = this.datosActualizar.tasaEjecucionLlamada;
    }

    this.obtenerOperador();
    this.ObtenerActividadCabecera();
  }

  ngOnInit(): void {
    this.obtenerOperador();
    this.ObtenerActividadCabecera();
  }

  datos = false;
  loading: any;
  listaOperadores: any;
  listaActividadCabecera: any = [];

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  actividadesEnvio: Array<any> = [];

  FechaInicioLlamada: any = null;
  FechaFinLlamada: any = null;
  IdOperadorComparacionDuracionPromedioLlamadaPorOportunidad: any = null;
  DuracionPromedioLlamadaPorOportunidad: any = null;
  IdOperadorComparacionDuracionTotalLlamadaPorOportunidad: any = null;
  DuracionTotalLlamadaPorOportunidad: any = null;
  IdOperadorComparacionNroLlamada: any = null;
  NroLlamada: any = null;
  IdOperadorComparacionDuracionLlamada: any = null;
  DuracionLlamada: any = null;
  IdOperadorComparacionTasaEjecucionLlamada: any = null;
  TasaEjecucionLlamada: any = null;

  //----AutocompleteActividad---------//

  actividades: any = [];
  listaActividadFiltrada: any = [];
  setAll(e: any) {
    this.datos = e;
  }

  //-------------------Funciones Obtener ---------------------//

  obtenerOperador() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerOperadorCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaOperadores = response.body;
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
          this.listaActividadFiltrada= this.listaActividadCabecera;
          this.actividades = []
          this.actividadesEnvio = []
          if (this.datosActualizar != undefined) {
            this.listaActividadCabecera.forEach((p: any) => {
              this.datosActualizar.listaActividadCabecera.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.actividades.push(p);
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
            this.actividadesEnvio.push({Valor: e.id })
          });
    
        },
      });
  }

  //---------AutocompleteActividadCabecera----------------//

  valueChangeActividad(e: any) {
    this.actividadesEnvio = [];
    e.forEach((f: any) => {
      this.actividadesEnvio.push({ Valor: f.id });
    });
  }

  filterChangeActividad(e: any) {
    this.listaActividadFiltrada = this.listaActividadCabecera;
    if (e.length >= 1) {
      this.listaActividadFiltrada = this.listaActividadCabecera.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.multiselect.toggle(false);
    }
  }

  removeTagActividad(e: any) {
    this.actividadesEnvio.splice(e.id, 1);
  }
}

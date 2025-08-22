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
  ViewEncapsulation,
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
import { map, Observable, startWith } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-oportunidades-historicas',
  templateUrl: './oportunidades-historicas.component.html',
  styleUrls: ['./oportunidades-historicas.component.scss'],
})
export class OportunidadesHistoricasComponent implements OnInit, OnChanges {
  @ViewChild('faseActualInput')
  fasesActualesInput: ElementRef<HTMLInputElement>;

  @ViewChild('faseActual') public faseActual: MultiSelectComponent;
  @ViewChild('faseMaxima') public faseMaxima: MultiSelectComponent;
  @ViewChild('inicialFaseActual') public inicialFaseActual: MultiSelectComponent;
  @ViewChild('inicialFaseMaxima') public inicialFaseMaxima: MultiSelectComponent;

  @Input() datosActualizar: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}
  ngOnChanges(): void {
    this.obtenerOperador();
    this.ObtenerFasesActuales();
    this.obtenerProbabilidad();

    if (this.datosActualizar != undefined) {
      this.obtenerProbabilidad();
      this.setAll(this.datosActualizar.considerarOportunidadHistorica);
      this.datos = this.datosActualizar.considerarOportunidadHistorica;
      this.IdOperadorComparacionNroOportunidades =
        this.datosActualizar.idOperadorComparacionNroOportunidades;
      this.IdOperadorComparacionNroSolicitudInformacion =
        this.datosActualizar.idOperadorComparacionNroSolicitudInformacion;
      this.NroOportunidades = this.datosActualizar.nroOportunidades;
      this.NroSolicitudInformacion =
        this.datosActualizar.nroSolicitudInformacion;
    

        if(this.datosActualizar.fechaInicioCreacionUltimaOportunidad != null){
          this.FechaInicioCreacionUltimaOportunidad =
          new Date(this.datosActualizar.fechaInicioCreacionUltimaOportunidad);
        }
        else{
          this.FechaInicioCreacionUltimaOportunidad = null
        }

        if(this.datosActualizar.fechaFinCreacionUltimaOportunidad != null){
          this.FechaFinCreacionUltimaOportunidad =
          new Date(this.datosActualizar.fechaFinCreacionUltimaOportunidad);
        }
        else{
          this.FechaFinCreacionUltimaOportunidad = null
        }

        if(this.datosActualizar.fechaInicioModificacionUltimaActividadDetalle != null){
          this.FechaInicioModificacionUltimaActividadDetalle =
          new Date(this.datosActualizar.fechaInicioModificacionUltimaActividadDetalle);
        }
        else{
          this.FechaInicioModificacionUltimaActividadDetalle = null
        }


        if(this.datosActualizar.fechaInicioProgramacionUltimaActividadDetalleRn2 != null){
          this.FechaInicioProgramacionUltimaActividadDetalleRn2 =
          new Date(this.datosActualizar.fechaInicioProgramacionUltimaActividadDetalleRn2);
        }
        else{
          this.FechaInicioProgramacionUltimaActividadDetalleRn2 = null
        }

        if(this.datosActualizar.fechaFinModificacionUltimaActividadDetalle != null){
          this.FechaFinModificacionUltimaActividadDetalle =
          new Date(this.datosActualizar.fechaFinModificacionUltimaActividadDetalle);
        }
        else{
          this.FechaFinModificacionUltimaActividadDetalle = null
        }

        if(this.datosActualizar.fechaFinProgramacionUltimaActividadDetalleRn2 != null){
          this.FechaFinProgramacionUltimaActividadDetalleRn2 =
          new Date(this.datosActualizar.fechaFinProgramacionUltimaActividadDetalleRn2);
        }
        else{
          this.FechaFinProgramacionUltimaActividadDetalleRn2 = null
        }

      this.EsRn2 = this.datosActualizar.esRn2;
    }
  }

  ngOnInit(): void {
    this.obtenerOperador();
    this.ObtenerFasesActuales();
    this.obtenerProbabilidad();
  }

  //----AutocompleteProbabilidad---------//

  probabilidades: any = [];
  probabilidadEnvio: Array<any> = [];

  datos: boolean = false;
  loading: any;
  listaOperadores: any;
  listaFase: any = [];
  listaProbabilidad: any;

  ListaOportunidadActualFaseMaxima: any = [];
  ListaOportunidadActualFaseActual: any = [];
  ListaOportunidadInicialFaseMaxima: any = [];
  ListaOportunidadInicialFaseActual: any = [];

  IdOperadorComparacionNroOportunidades: any = null;
  IdOperadorComparacionNroSolicitudInformacion: any = null;
  NroOportunidades: any = null;
  NroSolicitudInformacion: any = null;

  IdProbabilidadOportunidad: any = null;

  EsRn2 = false;

  faseEnvio: any = [];
  faseEnvio1: any = [];
  faseEnvio2: any = [];
  faseEnvio3: any = [];

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  FechaInicioCreacionUltimaOportunidad: any = null;
  FechaFinCreacionUltimaOportunidad: any = null;
  FechaInicioModificacionUltimaActividadDetalle: any = null;
  FechaFinModificacionUltimaActividadDetalle: any = null;
  FechaInicioProgramacionUltimaActividadDetalleRn2: any = null;
  FechaFinProgramacionUltimaActividadDetalleRn2: any = null;

  listafaseActual : any = [];
  listafaseMaximo: any = [];
  listainicialFaseActual : any = [];
  listainicialFaseMaxima : any = [];

  //----AutocompleteFases---------//

  fases: any = [];

  setAll(e: any) {
    this.datos = e;
  }

  setAllRn2(e:any){
    this.EsRn2 = e;
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
          this.obtenerProbabilidad();
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  ObtenerFasesActuales() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerComboFase)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaFase = response.body;
          this.ListaOportunidadActualFaseMaxima = [];
          this.ListaOportunidadActualFaseActual = [];
          this.ListaOportunidadInicialFaseMaxima = [];
          this.ListaOportunidadInicialFaseActual = [];

          this.listafaseActual = this.listaFase;
          this.listafaseMaximo= this.listaFase;
          this.listainicialFaseActual = this.listaFase;
          this.listainicialFaseMaxima = this.listaFase;

          if (this.datosActualizar != undefined) {
            this.listaFase.forEach((p: any) => {
              this.datosActualizar.listaOportunidadActualFaseActual.forEach(
                (e: any) => {
                  if (p.id == e.valor) {
                    this.ListaOportunidadActualFaseActual.push(p);
                  }
                }
              );
            });

            this.listaFase.forEach((p: any) => {
              this.datosActualizar.listaOportunidadActualFaseMaxima.forEach(
                (e: any) => {
                  if (p.id == e.valor) {
                    this.ListaOportunidadActualFaseMaxima.push(p);
                  }
                }
              );
            });

            this.listaFase.forEach((p: any) => {
              this.datosActualizar.listaOportunidadInicialFaseActual.forEach(
                (e: any) => {
                  if (p.id == e.valor) {
                    this.ListaOportunidadInicialFaseActual.push(p);
                  }
                }
              );
            });

            this.listaFase.forEach((p: any) => {
              this.datosActualizar.listaOportunidadInicialFaseMaxima.forEach(
                (e: any) => {
                  if (p.id == e.valor) {
                    this.ListaOportunidadInicialFaseMaxima.push(p);
                  }
                }
              );
            });
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerProbabilidad() {
    this.loading = true;
    console.log(this.probabilidades)
    this.integraService
      .obtener(constApiMarketing.ObtenerProbabilidad)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaProbabilidad = response.body;

          if (this.datosActualizar != undefined) {
            this.probabilidades = [ ]
            this.probabilidadEnvio = []
            this.listaProbabilidad.forEach((p: any) => {
              this.datosActualizar.listaProbabilidadOportunidad.forEach(
                (e: any) => {
                  if (p.id == e.valor) {
                    this.probabilidades.push(p);
                    console.log(this.probabilidades)
                  }
                }
              );
            });
          }

          this.ObtenerFasesActuales;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {

          this.probabilidades.forEach((e:any) => {
            this.probabilidadEnvio.push({Valor: e.id })
          });


          this.faseEnvio = []
          this.faseEnvio1 = []
          this.faseEnvio2 = []
          this.faseEnvio3 = []

          this.ListaOportunidadActualFaseMaxima.forEach((e: any) => {
            this.faseEnvio.push({ Valor: e.id });
          });

          this.ListaOportunidadActualFaseActual.forEach((e: any) => {
            this.faseEnvio1.push({ Valor: e.id });
          });
         

          this.ListaOportunidadInicialFaseMaxima.forEach((e: any) => {
            this.faseEnvio2.push({ Valor: e.id });
          });
         

          this.ListaOportunidadInicialFaseActual.forEach((e: any) => {
            this.faseEnvio3.push({ Valor: e.id });
          });
         
         
      
        },
      });
  }

  //---------AutocompleteFase----------------//

  valueChangeFase(e: any) {
    this.faseEnvio = [];
    e.forEach((f: any) => {
      this.faseEnvio.push({ Valor: f.id });
    });
  }

  filterChangeFase(e: any) {
    this.listafaseMaximo = this.listaFase;
    if (e.length >= 1) {
      this.listafaseMaximo = this.listaFase.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.faseMaxima.toggle(false);
    }
  }

  removeTagFase(e: any) {
    this.faseEnvio.splice(e.id, 1);
  }

  //---------AutocompleteFase----------------//

  valueChangeFase1(e: any) {
    this.faseEnvio1 = [];
    e.forEach((f: any) => {
      this.faseEnvio1.push({ Valor: f.id });
    });
  }

  filterChangeFase1(e: any) {
    this.listafaseActual = this.listaFase;
    if (e.length >= 1) {
      this.listafaseActual = this.listaFase.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.faseActual.toggle(false);
    }
  }

  removeTagFase1(e: any) {
    this.faseEnvio1.splice(e.id, 1);
  }

  //---------AutocompleteFase----------------//

  valueChangeFase2(e: any) {
    this.faseEnvio2 = [];
    e.forEach((f: any) => {
      this.faseEnvio2.push({ Valor: f.id });
    });
  }

  filterChangeFase2(e: any) {
    this.listainicialFaseMaxima = this.listaFase;
    if (e.length >= 1) {
      this.listainicialFaseMaxima = this.listaFase.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.inicialFaseMaxima.toggle(false);
    }
  }


  removeTagFase2(e: any) {
    this.faseEnvio2.splice(e.id, 1);
  }

  //---------AutocompleteFase----------------//

  valueChangeFase3(e: any) {
    this.faseEnvio3 = [];
    e.forEach((f: any) => {
      this.faseEnvio3.push({ Valor: f.id });
    });
  }

  filterChangeFase3(e: any) {
    this.listainicialFaseActual = this.listaFase;
    if (e.length >= 1) {
      this.listainicialFaseActual = this.listaFase.filter(
        (s: any) =>
          s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.inicialFaseActual.toggle(false);
    }
  }

  removeTagFase3(e: any) {
    this.faseEnvio3.splice(e.id, 1);
  }

  //---------AutocompleteProgramaGeneral----------------//

  valueChangeProbabilidad(e: any) {
    this.probabilidadEnvio = [];
    e.forEach((f: any) => {
      this.probabilidadEnvio.push({ Valor: f.id });
    });
  }

  filterChangeProbabilidad(e: any) {}
  removeTagProbabilidad(e: any) {
    this.probabilidadEnvio.splice(e.id, 1);
  }
}

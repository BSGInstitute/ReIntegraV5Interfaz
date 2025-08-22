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
  constApiPlanificacion,
} from '@environments/constApi';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-venta-cruzada',
  templateUrl: './venta-cruzada.component.html',
  styleUrls: ['./venta-cruzada.component.scss'],
})
export class VentaCruzadaComponent implements OnInit, OnChanges {
  @ViewChild('areaInput') areasInput: ElementRef<HTMLInputElement>;
  @ViewChild('subareaInput') subareasInput: ElementRef<HTMLInputElement>;
  @ViewChild('programaInput') programasInput: ElementRef<HTMLInputElement>;

  @ViewChild('areaFiltro') public areaFiltro: MultiSelectComponent;
  @ViewChild('subareaFiltro') public subareaFiltro: MultiSelectComponent;
  @ViewChild('programaFiltro') public programaFiltro: MultiSelectComponent;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}
  ngOnChanges(): void {
    this.obtenerOperador();
    this.obtenerAreaCapacitacion();
    this.obtenerProbabilidad();

    if (this.datosActualizar != undefined) {
      this.datos = this.datosActualizar.tieneVentaCruzada;
      this.IdOperadorComparacionNroSolicitudInformacionPg =
        this.datosActualizar.idOperadorComparacionNroSolicitudInformacionPg;
      this.NroSolicitudInformacionPg =
        this.datosActualizar.nroSolicitudInformacionPg;
      this.IdOperadorComparacionNroSolicitudInformacionArea =
        this.datosActualizar.idOperadorComparacionNroSolicitudInformacionArea;
      this.NroSolicitudInformacionArea =
        this.datosActualizar.nroSolicitudInformacionArea;
      this.IdOperadorComparacionNroSolicitudInformacionSubArea =
        this.datosActualizar.idOperadorComparacionNroSolicitudInformacionSubArea;
      this.NroSolicitudInformacionSubArea =
        this.datosActualizar.nroSolicitudInformacionSubArea;
    }
  }

  @Input() datosActualizar: any;

  ngOnInit(): void {
    this.obtenerOperador();
    this.obtenerAreaCapacitacion();
    this.obtenerProbabilidad();
  }

  datos = false;
  loading: any;
  listaOperadores: any;
  listaProbabilidad: any;

  listaArea: any = [];
  listaSubArea: any = [];
  listaPrograma: any = [];

  enviolistaArea = '';
  enviolistaSubArea = '';
  enviolistaPGeneral = '';

  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  areaVCEnvio: Array<any> = [];
  subareaVCEnvio: Array<any> = [];
  programaVCEnvio: Array<any> = [];
  probabilidadEnvio: Array<any> = [];

  areaFiltrada: any = [];
  subareaFiltrada: any = [];
  programaFiltrada: any = [];

  IdOperadorComparacionNroSolicitudInformacionPg: any = null;
  NroSolicitudInformacionPg: any = null;
  IdOperadorComparacionNroSolicitudInformacionArea: any = null;
  NroSolicitudInformacionArea: any = null;
  IdOperadorComparacionNroSolicitudInformacionSubArea: any = null;
  NroSolicitudInformacionSubArea: any = null;

  DuracionTotalLlamadaPorOportunidad: any = null;
  IdOperadorComparacionNroLlamada: any = null;

  //----AutocompleteArea---------//

  areas: any = [];
  areasListaId: Array<any> = [];

  //----AutocompleteSubArea---------//

  subareas: any = [];
  subareasListaId: Array<any> = [];

  //----AutocompletePrograma---------//

  programas: any = [];

  //----AutocompleteProbabilidad---------//

  probabilidades: any = [];

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

  obtenerProbabilidad() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerProbabilidad)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaProbabilidad = response.body;

          if (this.datosActualizar != undefined) {
            this.probabilidades = [];
            this.probabilidadEnvio = [];
            this.listaProbabilidad.forEach((p: any) => {
              this.datosActualizar.listaProbabilidadVentaCruzada.forEach(
                (e: any) => {
                  if (p.id == e.valor) {
                    this.probabilidades.push(p);
                    console.log(this.probabilidades);
                  }
                }
              );
            });
            this.probabilidades.forEach((e: any) => {
              this.probabilidadEnvio.push({ Valor: e.id });
            });
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerAreaCapacitacion() {
    this.loading = true;
    this.integraService
      .obtener(constApiPlanificacion.AreaCapacitacionObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaArea = response.body;
          this.areas = [];
          this.areaVCEnvio = [];
          this.areaFiltrada = this.listaArea;

          if (this.datosActualizar != undefined) {
            this.listaArea.forEach((p: any) => {
              this.datosActualizar.listaVCArea.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.areas.push(p);
                  this.areasListaId.push(p.id);
                  this.enviolistaArea = this.areasListaId.join(',');
                  this.obtenerSubAreaCapacitacion();
                }
              });
            });

            this.areas.forEach((e: any) => {
              this.areaVCEnvio.push({ Valor: e.id });
            });
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerSubAreaCapacitacion() {
    this.loading = true;
    this.integraService
      .post(
        constApiMarketing.ObtenerSubAreaCapacitacion +
          '?idAreas=' +
          this.enviolistaArea
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaSubArea = response.body;
          this.subareaFiltrada = this.listaSubArea;

          if (this.datosActualizar != undefined) {
            this.subareaVCEnvio = [];
            this.listaSubArea.forEach((p: any) => {
              this.datosActualizar.listaVCSubArea.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.subareas.push(p);
                  this.subareasListaId.push(p.id);
                  this.enviolistaArea = this.areasListaId.join(',');
                  this.enviolistaSubArea = this.subareasListaId.join(',');
                  this.obtenerProgramaGeneral();
                }
              });
            });

            this.subareas.forEach((e: any) => {
              this.subareaVCEnvio.push({ Valor: e.id });
            });

            this.datosActualizar.listaVCSubArea = [];
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerProgramaGeneral() {
    this.enviolistaArea = this.areasListaId.join(',');
    this.enviolistaSubArea = this.subareasListaId.join(',');
    this.loading = true;
    this.integraService
      .post(
        constApiMarketing.ObtenerProgramaGeneral +
          '?idAreas=' +
          this.enviolistaArea +
          '&idSubAreas=' +
          this.enviolistaSubArea
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaPrograma = response.body;
          this.programaFiltrada = this.listaPrograma;
          if (this.datosActualizar != undefined) {
            this.programaVCEnvio = [];
            this.listaPrograma.forEach((p: any) => {
              this.datosActualizar.listaVCPGeneral.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.programas.push(p);
                }
              });
            });

            this.programas.forEach((e: any) => {
              this.programaVCEnvio.push({ Valor: e.id });
            });

            this.datosActualizar.listaVCPGeneral = [];
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }
  //---------AutocompleteArea----------------//

  valueChangeArea(e: any) {
    this.areaVCEnvio = [];
    this.listaSubArea=[]
    this.areasListaId = []
    this.enviolistaArea=''
    this.subareaVCEnvio = [];
    this.subareaFiltrada=[]
    this.subareas = []
    this.subareasListaId = []
    this.enviolistaSubArea=''
    this.programas = []
    this.listaPrograma=[]
    this.programaFiltrada=[]
    this.programaVCEnvio = []
    if (e.length >0){
    e.forEach((f: any) => {
      this.areaVCEnvio.push({ Valor: f.id });
      this.areasListaId.push(f.id);
      this.enviolistaArea = this.areasListaId.join(',');
    });

    this.obtenerSubAreaCapacitacion();
  }
  }

  filterChangeArea(e: any) {
    this.areaFiltrada = this.listaArea;
    if (e.length >= 1) {
      this.areaFiltrada = this.listaArea.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.areaFiltro.toggle(false);
    }
  }
  removeTagArea(e: any) {
    this.areaVCEnvio.splice(e.id, 1);
    this.listaSubArea=[]
    this.areasListaId = []
    this.enviolistaArea=''
    this.subareaVCEnvio = [];
    this.subareaFiltrada=[]
    this.subareas = []
    this.subareasListaId = []
    this.enviolistaSubArea=''
    this.programas = []
    this.listaPrograma=[]
    this.programaFiltrada=[]
    this.programaVCEnvio = []
  }

  //---------AutocompleteSubArea----------------//

  valueChangeSubArea(e: any) {

    this.subareaVCEnvio = [];
    this.subareasListaId = []
    this.enviolistaSubArea=''
    this.programas = []
    this.listaPrograma=[]
    this.programaFiltrada=[]
    this.programaVCEnvio = []
    if (e.length >0){
    e.forEach((f: any) => {
      this.subareaVCEnvio.push({ Valor: f.id });
      this.subareasListaId.push(f.id);
      this.enviolistaSubArea = this.subareasListaId.join(',');
    });

    this.obtenerProgramaGeneral();
  }
  }

  filterChangeSubArea(e: any) {
    this.subareaFiltrada = this.listaSubArea;
    if (e.length >= 1) {
      this.subareaFiltrada = this.listaSubArea.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.subareaFiltro.toggle(false);
    }
  }
  removeTagSubArea(e: any) {
    this.subareaVCEnvio.splice(e.id, 1);
    this.subareaFiltrada=[]
    this.subareas = []
    this.subareasListaId = []
    this.enviolistaSubArea=''
  }

  //---------AutocompleteProgramaGeneral----------------//

  valueChangePrograma(e: any) {
    this.programaVCEnvio = [];

    e.forEach((f: any) => {
      this.programaVCEnvio.push({ Valor: f.id });
    });
  }

  filterChangePrograma(e: any) {
    this.programaFiltrada = this.listaPrograma;
    if (e.length >= 1) {
      this.programaFiltrada = this.listaPrograma.filter(
        (s: any) => s.nombre.toLowerCase().indexOf(e.toLowerCase()) !== -1
      );
    } else {
      this.programaFiltro.toggle(false);
    }
  }
  removeTagPrograma(e: any) {
    this.programaVCEnvio.splice(e.id, 1);
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

import {
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { MatDialog } from '@angular/material/dialog';
import {
  constApiMarketing,
  constApiPlanificacion,
} from '@environments/constApi';
import { MultiSelectComponent } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-probabilidad',
  templateUrl: './probabilidad.component.html',
  styleUrls: ['./probabilidad.component.scss']
})
export class ProbabilidadComponent implements OnInit, OnChanges {

  @ViewChild('areaFiltro') public areaFiltro: MultiSelectComponent;
  @ViewChild('subareaFiltro') public subareaFiltro: MultiSelectComponent;
  @ViewChild('programaFiltro') public programaFiltro: MultiSelectComponent;

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}
  ngOnChanges(): void {
    if (this.datosActualizar != undefined) {
      this.considerarProbabilidad = this.datosActualizar.considerarProbabilidad;
      this.considerarProbabilidadVentaCruzada = this.datosActualizar.considerarProbabilidadVentaCruzada;
    }
    this.obtenerAreaCapacitacion();
    this.obtenerProbabilidad();
  }

  @Input() datosActualizar: any;

  ngOnInit(): void {
  }

  considerarProbabilidad = false;
  considerarProbabilidadVentaCruzada = false;
  loading: any;
  listaProbabilidad: any;

  listaArea: any = [];
  listaSubArea: any = [];
  listaPrograma: any = [];

  enviolistaArea = '';
  enviolistaSubArea = '';
  enviolistaPGeneral = '';

  areaProbabilidadEnvio: Array<any> = [];
  subareaProbabilidadEnvio: Array<any> = [];
  programaProbabilidadEnvio: Array<any> = [];
  valorProbabilidadEnvio: Array<any> = [];

  areaFiltrada: any = [];
  subareaFiltrada: any = [];
  programaFiltrada: any = [];

  //----AutocompleteProbabilidad---------//

  probabilidades: any = [];

  //----AutocompleteArea---------//

  areas: any = [];
  areasListaId: Array<any> = [];

  //----AutocompleteSubArea---------//

  subareas: any = [];
  subareasListaId: Array<any> = [];

  //----AutocompletePrograma---------//

  programas: any = [];
  //---------------Seteo de ConsiderarProbabilidad------------------//
  setConsiderarProbabilidad(e: any) {
    if(e){
      this.considerarProbabilidad = e;
    }
    else{
      this.considerarProbabilidad = false;
      this.considerarProbabilidadVentaCruzada = false;
    }
  }
  //---------------Seteo de ConsiderarProbabilidadVentaCruzada------------------//
  setConsiderarProbabilidadVentaCruzada(e: any) {
    if(e){
      this.considerarProbabilidad = e;
      this.considerarProbabilidadVentaCruzada = e;
    }
    else{
      this.considerarProbabilidadVentaCruzada = false;
    }
  }

  //-------------------Funciones Obtener ---------------------//

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
            this.valorProbabilidadEnvio = [];
            this.listaProbabilidad.forEach((p: any) => {
              this.datosActualizar.listaProbabilidadValor.forEach(
                (e: any) => {
                  if (p.id == e.valor) {
                    this.probabilidades.push(p);
                  }
                }
              );
            });
            this.probabilidades.forEach((e: any) => {
              this.valorProbabilidadEnvio.push({ Valor: e.id });
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
          this.areaProbabilidadEnvio = [];
          this.areaFiltrada = this.listaArea;

          if (this.datosActualizar != undefined) {
            this.listaArea.forEach((p: any) => {
              this.datosActualizar.listaProbabilidadArea.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.areas.push(p);
                  this.areasListaId.push(p.id);
                  this.enviolistaArea = this.areasListaId.join(',');
                }
              });
            });
            if(this.datosActualizar.listaProbabilidadArea.length>0){
              this.obtenerSubAreaCapacitacion();
            }

            this.areas.forEach((e: any) => {
              this.areaProbabilidadEnvio.push({ Valor: e.id });
            });
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {
        },
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
            this.subareaProbabilidadEnvio = [];
            this.listaSubArea.forEach((p: any) => {
              this.datosActualizar.listaProbabilidadSubArea.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.subareas.push(p);
                  this.subareasListaId.push(p.id);
                  this.enviolistaArea = this.areasListaId.join(',');
                  this.enviolistaSubArea = this.subareasListaId.join(',');
                }
              });
            });
            if(this.datosActualizar.listaProbabilidadSubArea.length>0){
              this.obtenerProgramaGeneral();
            }

            this.subareas.forEach((e: any) => {
              this.subareaProbabilidadEnvio.push({ Valor: e.id });
            });

            this.datosActualizar.listaProbabilidadSubArea = [];
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {
        },
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
            this.programaProbabilidadEnvio = [];
            this.listaPrograma.forEach((p: any) => {
              this.datosActualizar.listaProbabilidadPGeneral.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.programas.push(p);
                }
              });
            });

            this.programas.forEach((e: any) => {
              this.programaProbabilidadEnvio.push({ Valor: e.id });
            });

            this.datosActualizar.listaProbabilidadPGeneral = [];
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
    this.areaProbabilidadEnvio = [];
    this.listaSubArea=[]
    this.areasListaId = []
    this.enviolistaArea=''
    this.subareaProbabilidadEnvio = [];
    this.subareaFiltrada=[]
    this.subareas = []
    this.subareasListaId = []
    this.enviolistaSubArea=''
    this.programas = []
    this.listaPrograma=[]
    this.programaFiltrada=[]
    this.programaProbabilidadEnvio = []
    if (e.length >0){
    e.forEach((f: any) => {
      this.areaProbabilidadEnvio.push({ Valor: f.id });
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
    this.areaProbabilidadEnvio.splice(e.id, 1);
    this.listaSubArea=[]
    this.areasListaId = []
    this.enviolistaArea=''
    this.subareaProbabilidadEnvio = [];
    this.subareaFiltrada=[]
    this.subareas = []
    this.subareasListaId = []
    this.enviolistaSubArea=''
    this.programas = []
    this.listaPrograma=[]
    this.programaFiltrada=[]
    this.programaProbabilidadEnvio = []
  }

  //---------AutocompleteSubArea----------------//

  valueChangeSubArea(e: any) {

    this.subareaProbabilidadEnvio = [];
    this.subareasListaId = []
    this.enviolistaSubArea=''
    this.programas = []
    this.listaPrograma=[]
    this.programaFiltrada=[]
    this.programaProbabilidadEnvio = []
    if (e.length >0){
    e.forEach((f: any) => {
      this.subareaProbabilidadEnvio.push({ Valor: f.id });
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
    this.subareaProbabilidadEnvio.splice(e.id, 1);
    this.subareaFiltrada=[]
    this.subareas = []
    this.subareasListaId = []
    this.enviolistaSubArea=''
  }

  //---------AutocompleteProgramaGeneral----------------//

  valueChangePrograma(e: any) {
    this.programaProbabilidadEnvio = [];

    e.forEach((f: any) => {
      this.programaProbabilidadEnvio.push({ Valor: f.id });
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
    this.programaProbabilidadEnvio.splice(e.id, 1);
  }

  //---------AutocompleteProbabilidad----------------//

  valueChangeProbabilidad(e: any) {
    this.valorProbabilidadEnvio = [];
    e.forEach((f: any) => {
      this.valorProbabilidadEnvio.push({ Valor: f.id });
    });
  }

  filterChangeProbabilidad(e: any) {}
  removeTagProbabilidad(e: any) {
    this.valorProbabilidadEnvio.splice(e.id, 1);
  }

}


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
  selector: 'app-ultima-oportunidad',
  templateUrl: './ultima-oportunidad.component.html',
  styleUrls: ['./ultima-oportunidad.component.scss']
})
export class UltimaOportunidadComponent implements OnInit, OnChanges {

  @ViewChild('areaFiltro') public areaFiltro: MultiSelectComponent;
  @ViewChild('subareaFiltro') public subareaFiltro: MultiSelectComponent;
  @ViewChild('programaFiltro') public programaFiltro: MultiSelectComponent;

  constructor(
    private integraService: IntegraService,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}
  ngOnChanges(): void {
    this.obtenerAreaCapacitacion();
    if (this.datosActualizar != undefined) {
      console.log(this.datosActualizar);
      this.datos = this.datosActualizar.considerarUltimaOportunidad;
    }
  }

  @Input() datosActualizar: any;

  ngOnInit(): void {
    this.obtenerAreaCapacitacion();
  }

  datos = false;
  loading: any;

  listaArea: any = [];
  listaSubArea: any = [];
  listaPrograma: any = [];

  enviolistaArea = '';
  enviolistaSubArea = '';
  enviolistaPGeneral = '';

  areaUOEnvio: Array<any> = [];
  subareaUOEnvio: Array<any> = [];
  programaUOEnvio: Array<any> = [];
  probabilidadEnvio: Array<any> = [];

  areaFiltrada: any = [];
  subareaFiltrada: any = [];
  programaFiltrada: any = [];

  //----AutocompleteArea---------//

  areas: any = [];
  areasListaId: Array<any> = [];

  //----AutocompleteSubArea---------//

  subareas: any = [];
  subareasListaId: Array<any> = [];

  //----AutocompletePrograma---------//

  programas: any = [];
  //---------------Seteo de Datos------------------//
  setAll(e: any) {
    this.datos = e;
  }

  //-------------------Funciones Obtener ---------------------//

  obtenerAreaCapacitacion() {
    this.loading = true;
    this.integraService
      .obtener(constApiPlanificacion.AreaCapacitacionObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaArea = response.body;
          this.areas = [];
          this.areaUOEnvio = [];
          this.areaFiltrada = this.listaArea;

          if (this.datosActualizar != undefined) {
            this.listaArea.forEach((p: any) => {
              this.datosActualizar.listaUOArea.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.areas.push(p);
                  this.areasListaId.push(p.id);
                  this.enviolistaArea = this.areasListaId.join(',');
                  this.obtenerSubAreaCapacitacion();
                }
              });
            });

            this.areas.forEach((e: any) => {
              this.areaUOEnvio.push({ Valor: e.id });
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
            this.subareaUOEnvio = [];
            this.listaSubArea.forEach((p: any) => {
              this.datosActualizar.listaUOSubArea.forEach((e: any) => {
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
              this.subareaUOEnvio.push({ Valor: e.id });
            });

            this.datosActualizar.listaUOSubArea = [];
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
            this.programaUOEnvio = [];
            this.listaPrograma.forEach((p: any) => {
              this.datosActualizar.listaUOPGeneral.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.programas.push(p);
                }
              });
            });

            this.programas.forEach((e: any) => {
              this.programaUOEnvio.push({ Valor: e.id });
            });

            this.datosActualizar.listaUOPGeneral = [];
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
    this.areaUOEnvio = [];
    this.listaSubArea=[]
    this.areasListaId = []
    this.enviolistaArea=''
    this.subareaUOEnvio = [];
    this.subareaFiltrada=[]
    this.subareas = []
    this.subareasListaId = []
    this.enviolistaSubArea=''
    this.programas = []
    this.listaPrograma=[]
    this.programaFiltrada=[]
    this.programaUOEnvio = []
    if (e.length >0){
    e.forEach((f: any) => {
      this.areaUOEnvio.push({ Valor: f.id });
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
    this.areaUOEnvio.splice(e.id, 1);
    this.listaSubArea=[]
    this.areasListaId = []
    this.enviolistaArea=''
    this.subareaUOEnvio = [];
    this.subareaFiltrada=[]
    this.subareas = []
    this.subareasListaId = []
    this.enviolistaSubArea=''
    this.programas = []
    this.listaPrograma=[]
    this.programaFiltrada=[]
    this.programaUOEnvio = []
  }

  //---------AutocompleteSubArea----------------//

  valueChangeSubArea(e: any) {

    this.subareaUOEnvio = [];
    this.subareasListaId = []
    this.enviolistaSubArea=''
    this.programas = []
    this.listaPrograma=[]
    this.programaFiltrada=[]
    this.programaUOEnvio = []
    if (e.length >0){
    e.forEach((f: any) => {
      this.subareaUOEnvio.push({ Valor: f.id });
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
    this.subareaUOEnvio.splice(e.id, 1);
    this.subareaFiltrada=[]
    this.subareas = []
    this.subareasListaId = []
    this.enviolistaSubArea=''
  }

  //---------AutocompleteProgramaGeneral----------------//

  valueChangePrograma(e: any) {
    this.programaUOEnvio = [];

    e.forEach((f: any) => {
      this.programaUOEnvio.push({ Valor: f.id });
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
    this.programaUOEnvio.splice(e.id, 1);
  }
}

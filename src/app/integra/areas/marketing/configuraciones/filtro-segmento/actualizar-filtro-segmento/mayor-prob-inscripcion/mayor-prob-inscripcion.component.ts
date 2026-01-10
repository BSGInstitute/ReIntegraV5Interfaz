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
  selector: 'app-mayor-prob-inscripcion',
  templateUrl: './mayor-prob-inscripcion.component.html',
  styleUrls: ['./mayor-prob-inscripcion.component.scss']
})
export class MayorProbInscripcionComponent implements OnInit, OnChanges {

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
      this.considerarMayorProbabilidadInscripcion = this.datosActualizar.considerarMayorProbabilidadInscripcion;
      this.considerarMayorProbabilidadInscripcionVentaCruzada = this.datosActualizar.considerarMayorProbabilidadInscripcionVentaCruzada;
    }
    this.obtenerAreaCapacitacion();
  }

  @Input() datosActualizar: any;

  ngOnInit(): void {
  }

  considerarMayorProbabilidadInscripcion = false;
  considerarMayorProbabilidadInscripcionVentaCruzada = false;
  loading: any;

  listaArea: any = [];
  listaSubArea: any = [];
  listaPrograma: any = [];

  enviolistaArea = '';
  enviolistaSubArea = '';
  enviolistaPGeneral = '';

  areaMPIEnvio: Array<any> = [];
  subareaMPIEnvio: Array<any> = [];
  programaMPIEnvio: Array<any> = [];

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
  //---------------Seteo de ConsiderarMayorProbabilidadInscripcion------------------//
  setConsiderarMayorProbabilidadInscripcion(e: any) {
    if(e){
      this.considerarMayorProbabilidadInscripcion = e;
    }
    else{
      this.considerarMayorProbabilidadInscripcion = false;
      this.considerarMayorProbabilidadInscripcionVentaCruzada = false;
    }
  }
  //---------------Seteo de ConsiderarMayorProbabilidadInscripcionVentaCruzada------------------//
  setConsiderarMayorProbabilidadInscripcionVentaCruzada(e: any) {
    if(e){
      this.considerarMayorProbabilidadInscripcion = e;
      this.considerarMayorProbabilidadInscripcionVentaCruzada = e;
    }
    else{
      this.considerarMayorProbabilidadInscripcionVentaCruzada = false;
    }
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
          this.areaMPIEnvio = [];
          this.areaFiltrada = this.listaArea;

          if (this.datosActualizar != undefined) {
            this.listaArea.forEach((p: any) => {
              this.datosActualizar.listaMPIArea.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.areas.push(p);
                  this.areasListaId.push(p.id);
                  this.enviolistaArea = this.areasListaId.join(',');
                }
              });
            });
            if(this.datosActualizar.listaMPIArea.length>0){
              this.obtenerSubAreaCapacitacion();
            }

            this.areas.forEach((e: any) => {
              this.areaMPIEnvio.push({ Valor: e.id });
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
            this.subareaMPIEnvio = [];
            this.listaSubArea.forEach((p: any) => {
              this.datosActualizar.listaMPISubArea.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.subareas.push(p);
                  this.subareasListaId.push(p.id);
                  this.enviolistaArea = this.areasListaId.join(',');
                  this.enviolistaSubArea = this.subareasListaId.join(',');
                }
              });
            });
            if(this.datosActualizar.listaMPISubArea.length>0){
              this.obtenerProgramaGeneral();
            }
            this.subareas.forEach((e: any) => {
              this.subareaMPIEnvio.push({ Valor: e.id });
            });

            this.datosActualizar.listaMPISubArea = [];
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
            this.programaMPIEnvio = [];
            this.listaPrograma.forEach((p: any) => {
              this.datosActualizar.listaMPIPGeneral.forEach((e: any) => {
                if (p.id == e.valor) {
                  this.programas.push(p);
                }
              });
            });

            this.programas.forEach((e: any) => {
              this.programaMPIEnvio.push({ Valor: e.id });
            });

            this.datosActualizar.listaMPIPGeneral = [];
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
    this.areaMPIEnvio = [];
    this.listaSubArea=[]
    this.areasListaId = []
    this.enviolistaArea=''
    this.subareaMPIEnvio = [];
    this.subareaFiltrada=[]
    this.subareas = []
    this.subareasListaId = []
    this.enviolistaSubArea=''
    this.programas = []
    this.listaPrograma=[]
    this.programaFiltrada=[]
    this.programaMPIEnvio = []
    if (e.length >0){
    e.forEach((f: any) => {
      this.areaMPIEnvio.push({ Valor: f.id });
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
    this.areaMPIEnvio.splice(e.id, 1);
    this.listaSubArea=[]
    this.areasListaId = []
    this.enviolistaArea=''
    this.subareaMPIEnvio = [];
    this.subareaFiltrada=[]
    this.subareas = []
    this.subareasListaId = []
    this.enviolistaSubArea=''
    this.programas = []
    this.listaPrograma=[]
    this.programaFiltrada=[]
    this.programaMPIEnvio = []
  }

  //---------AutocompleteSubArea----------------//

  valueChangeSubArea(e: any) {

    this.subareaMPIEnvio = [];
    this.subareasListaId = []
    this.enviolistaSubArea=''
    this.programas = []
    this.listaPrograma=[]
    this.programaFiltrada=[]
    this.programaMPIEnvio = []
    if (e.length >0){
    e.forEach((f: any) => {
      this.subareaMPIEnvio.push({ Valor: f.id });
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
    this.subareaMPIEnvio.splice(e.id, 1);
    this.subareaFiltrada=[]
    this.subareas = []
    this.subareasListaId = []
    this.enviolistaSubArea=''
  }

  //---------AutocompleteProgramaGeneral----------------//

  valueChangePrograma(e: any) {
    this.programaMPIEnvio = [];

    e.forEach((f: any) => {
      this.programaMPIEnvio.push({ Valor: f.id });
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
    this.programaMPIEnvio.splice(e.id, 1);
  }


}


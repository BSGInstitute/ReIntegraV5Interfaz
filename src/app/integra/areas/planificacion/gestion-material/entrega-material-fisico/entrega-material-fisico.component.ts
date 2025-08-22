import { IntegraService } from '@shared/services/integra.service';
import { Component, OnInit } from '@angular/core';
import { AlertaService } from '@shared/services/alerta.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AreaCapacitacion, SubAreaCapacitacion } from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { ProgramaEspecifico, ProgramaGeneralP } from '@planificacion/models/interfaces/pespecifico';
import { CombosModulo, ProgramaEspecificoCurso } from '@planificacion/models/interfaces/materialPEspecifico';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { HttpResponse } from '@angular/common/http';
import { constApiPlanificacion } from '@environments/constApi';

interface IFormFiltro {
  idsAreas: number[];
  idsSubAreas: number[];
  idsProgramasGenerales: number[];
  idsProgramasEspecificoPadreIndividual: number[];
  idsProgramasEspecificoCurso: number[];
  idsGrupos: number[];
  idsEstadosPEspecifico: number[];
  idsCiudades: number[];
  idsModalidades: number[];
  idsEstadosMateriales: number[];
}
@Component({
  selector: 'app-entrega-material-fisico',
  templateUrl: './entrega-material-fisico.component.html',
  styleUrls: ['./entrega-material-fisico.component.scss']
})
export class EntregaMaterialFisicoComponent implements OnInit {

  constructor(

    private integraService: IntegraService,
    private alertaService: AlertaService,
    private formBuilder: FormBuilder
  ) { }

  dataArea: AreaCapacitacion[]
  dataSubArea: SubAreaCapacitacion[]
  dataProgramaGeneral: ProgramaGeneralP[]
  dataProgramaEspecifico: ProgramaEspecifico[]
  dataPEspecificoCurso: ProgramaEspecificoCurso[]
  dataGrupo: IComboBase1[]
  dataEstadoPEspecifico: IComboBase1[]
  dataCiudadBS: IComboBase1[]
  dataModalidad: IComboBase1[]
  dataMaterialEstado: IComboBase1[]



  formFiltro: FormGroup = this.formBuilder.group({
    idsAreas: [[]],
    idsSubAreas: [[]],
    idsProgramasGenerales: [[]],
    idsProgramasEspecificoPadreIndividual: [[]],
    idsProgramasEspecificoCurso: [[]],
    idsGrupos: [[]],
    idsEstadosPEspecifico: [[]],
    idsCiudades: [[]],
    idsModalidades: [[]],
    idsEstadosMateriales: [[]],
  });



  // Variable Globales
  gridRevisarAprobarMaterial = new KendoGrid();
  btnBuscarDisabled: boolean = false;
  isDisabledSubArea = true;
  isDisabledPGeneral = true;
  isDisabledPEspecifico = true;
  isDisabledPEspecificoCurso = true;
  subAreasCapacitacion: SubAreaCapacitacion[] = [];
  programasGeneralP: ProgramaGeneralP[] = [];
  programasEspecifico: ProgramaEspecifico[] = [];
  programaEspecificoCurso: ProgramaEspecificoCurso[] = [];

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  private get dataFormFiltro(): IFormFiltro {
    return this.formFiltro.getRawValue() as IFormFiltro;
  }

  ngOnInit(): void {
    this.obtenerCombosModulo()
  }
  obtenerCombosModulo() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.MaterialPespecificoObtenerCombos}`
      )
      .subscribe({
        next: (resp: HttpResponse<CombosModulo>) => {
          this.dataArea = resp.body.listaArea;
          this.dataSubArea = resp.body.listaSubArea;
          this.dataProgramaGeneral = resp.body.listaProgramaGeneral;
          this.dataProgramaEspecifico = resp.body.listaProgramaEspecifico;
          this.dataPEspecificoCurso = resp.body.listaPEspecificoCurso;
          this.dataEstadoPEspecifico = resp.body.listaEstadoPEspecifico;
          this.dataGrupo = resp.body.listaGrupo;
          this.dataModalidad = resp.body.listaModalidad;
          this.dataCiudadBS = resp.body.listaCiudadBS;
          this.dataMaterialEstado = resp.body.listaMaterialEstado;
          //this.formFiltro.get('idsEstadosMateriales').setValue([2]);
                },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  cargarSubAreas(idsArea: number[]) {
    console.log("idsArea", idsArea)
    if (idsArea.length > 0) {
      this.isDisabledSubArea = false;
      this.subAreasCapacitacion = this.dataSubArea.filter(
        (x) => idsArea.includes(x.idAreaCapacitacion)
      );
      let filtro = this.dataFormFiltro.idsSubAreas.filter((x) =>
        this.subAreasCapacitacion.map((s) => s.id).includes(x)
      );
      this.formFiltro.get('idsSubAreas').setValue(filtro);
      this.cargarPGenerales(filtro);
    } else {
      this.isDisabledSubArea = true;
      this.subAreasCapacitacion = [];
      this.formFiltro.get('idsSubAreas').setValue([]);
      this.cargarPGenerales([]);
    }
  }

  cargarPGenerales(idsSubAreas: number[]) {
    console.log("idsSubAreas", idsSubAreas)
    if (idsSubAreas.length > 0) {
      this.isDisabledPGeneral = false;
      this.programasGeneralP = this.dataProgramaGeneral.filter((x) =>
        idsSubAreas.includes(x.idSubArea)
      );
      let filtro = this.dataFormFiltro.idsProgramasGenerales.filter((e) =>
        this.programasGeneralP.map((x) => x.id).includes(e)
      );
      this.formFiltro.get('idsProgramasGenerales').setValue(filtro);
      this.cargarPEspecificos(filtro);
    } else {
      this.isDisabledPGeneral = true;
      this.programasGeneralP = [];
      this.formFiltro.get('idsProgramasGenerales').setValue([]);
      this.cargarPEspecificos([]);
    }
  }


  cargarPEspecificos(idsPgeneral: number[]) {
    console.log("idsPgeneral", idsPgeneral)
    if (idsPgeneral.length > 0) {
      this.isDisabledPEspecifico = false;
      this.programasEspecifico = this.dataProgramaEspecifico.filter(
        (x) => idsPgeneral.includes(x.idProgramaGeneral)
      );
      let filtro = this.dataFormFiltro.idsProgramasEspecificoPadreIndividual.filter((e) =>
        this.programasEspecifico.map((x) => x.id).includes(e)
      );
      this.formFiltro.get('idsProgramasEspecificoPadreIndividual').setValue(filtro);
      this.cargarPEspecificoCurso(filtro);
    } else {
      this.isDisabledPEspecifico = true;
      this.programasEspecifico = [];
      this.formFiltro.get('idsProgramasEspecificoPadreIndividual').setValue([]);
      this.cargarPEspecificoCurso([]);
    }
  }


  cargarPEspecificoCurso(idsPespecificos: number[]) {
    console.log("idsPespecificos", idsPespecificos)
    if (idsPespecificos.length > 0) {
      this.isDisabledPEspecificoCurso = false;
      this.programaEspecificoCurso = this.dataPEspecificoCurso.filter((x) =>
        idsPespecificos.includes(x.idPEspecificoPadre)
      );
      let filtro = this.dataFormFiltro.idsProgramasEspecificoCurso.filter((e) =>
        this.programaEspecificoCurso.map((x) => x.id).includes(e)
      );
      this.formFiltro.get('idsProgramasEspecificoCurso').setValue(filtro);
    } else {
      this.isDisabledPEspecificoCurso = true;
      this.programaEspecificoCurso = [];
      this.formFiltro.get('idsProgramasEspecificoCurso').setValue([]);
    }
  }

  generarReporte() {
    this.gridRevisarAprobarMaterial.loading = true;
    this.btnBuscarDisabled = true;
    const dataForm: IFormFiltro = this.formFiltro.getRawValue();
    this.gridRevisarAprobarMaterial.gridState.skip = 0;
    const filtro = {
      idsAreas: dataForm.idsAreas,
      idsSubAreas: dataForm.idsSubAreas,
      idsProgramasGenerales: dataForm.idsProgramasGenerales,
      idsProgramasEspecificoPadreIndividual: dataForm.idsProgramasEspecificoPadreIndividual,
      idsProgramasEspecificoCurso: dataForm.idsProgramasEspecificoCurso,
      idsGrupos: dataForm.idsGrupos,
      idsEstadosPEspecifico: dataForm.idsEstadosPEspecifico,
      idsCiudades: dataForm.idsCiudades,
      idsModalidades: dataForm.idsModalidades,
      idsEstadosMateriales: dataForm.idsEstadosMateriales,
    };
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.EntregaMaterialFisicoObtenerCriteriosMaterialesProgramaEspecifico,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<[]>) => {
          this.gridRevisarAprobarMaterial.data = resp.body;
          this.gridRevisarAprobarMaterial.loadView()
          this.gridRevisarAprobarMaterial.loading = false;
          this.btnBuscarDisabled = false;
          if (resp.body.length)
            this.alertaService.notificationSuccessBotom("Reporte generado exitosamente.");
          else
            this.alertaService.notificationSuccessBotom("Reporte sin datos.");
        },
        error: (error) => {
          this.btnBuscarDisabled = false;
          this.gridRevisarAprobarMaterial.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

}

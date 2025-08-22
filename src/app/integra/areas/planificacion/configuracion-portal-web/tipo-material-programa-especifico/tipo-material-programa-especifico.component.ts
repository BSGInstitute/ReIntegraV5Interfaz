import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApiPlanificacion } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { KendoGrid } from '@shared/models/kendo-grid';
import { PageSizeItem } from '@progress/kendo-angular-grid';
interface PadreContenidoGrid {
  id: number;
  nombre: string;
  duracion: string;
  idCiudad: number;
  tipoAmbiente: string;
  idAmbiente: number;
  idExpositor_Referencia: number;
  idProgramaGeneral: number;
  fechaHoraInicio: string;
  idCentroCosto: number;
  idProveedor: number;
  idEstadoPEspecifico: number;
  idModalidadCurso: number;
  idCursoMoodle: number;
  idCursoMoodlePrueba: number;
  codigo: string;
  grupos: IComboBase1[];
  gruposEdicion: IComboBase1[];
}
interface CentroCostoPadreCombo {
  id: number;
  nombre: string;
  idPEspecifico: number;
}
interface ProgramaGeneralPadreCombo {
  id: number;
  nombre: string;
  idSubArea: number;
}
interface ProgramaEspecificoPadreCombo {
  id: number;
  nombre: string;
  idPGeneral: number;
}
interface AreaCapacitacionCombo {
  id: number;
  idAreaCapacitacionFacebook: number;
  nombre: string;
}
interface SubAreaCapacitacionCombo {
  id: number;
  nombre: string;
  idAreaCapacitacion: number;
}

interface ColeccionCombos {
  obtenerCentroCostoPadres: CentroCostoPadreCombo[];
  obtenerCiudadBs: IComboBase1[];
  obtenerComboEstado: IComboBase1[];
  obtenerComboMaterial: IComboBase1[];
  obtenerComboModalidad: IComboBase1[];
  obtenerFiltroArea: AreaCapacitacionCombo[];
  obtenerFiltroSubArea: SubAreaCapacitacionCombo[];
  obtenerProgramaGeneralPadre: ProgramaGeneralPadreCombo[];
  obtenerProgramasEspecificosPadres: ProgramaEspecificoPadreCombo[];
}

@Component({
  selector: 'app-tipo-material-programa-especifico',
  templateUrl: './tipo-material-programa-especifico.component.html',
  styleUrls: ['./tipo-material-programa-especifico.component.scss'],
})
export class TipoMaterialProgramaEspecificoComponent implements OnInit {
  @ViewChild('modalConfiguracionProgramasEspecificosAsociados')
  modalConfiguracionProgramasEspecificosAsociados: any;

  gridProgramaEspecificoMaterial: KendoGrid = new KendoGrid();
  gridProgramaEspecificoMaterialDetalle: KendoGrid = new KendoGrid();

  loaderFiltro: boolean = false;
  loaderModal: boolean = false;
  nombrePrograma: string = "";

  listaCombos: ColeccionCombos = null;
  listaCiudades: IComboBase1[];
  listaAreas: AreaCapacitacionCombo[];
  listaSubAreas: SubAreaCapacitacionCombo[];
  listaModalidades: IComboBase1[];
  listaMaterialTipo: IComboBase1[];
  listaCentroCostos: CentroCostoPadreCombo[];
  listaEstadoProgramas: IComboBase1[];
  listaPgeneral: ProgramaGeneralPadreCombo[];
  listaPespecificos: ProgramaEspecificoPadreCombo[];

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '10', value: 15 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  formFiltro: FormGroup = this._formBuilder.group({
    areas: [[]],
    subareas: [[]],
    pgenerales: [[]],
    pespecificos: [[]],
    centroCostos: [[]],
    estadoProgramas: [[]],
    ciudades: [[]],
    modalidades: [[]],
  });

  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtenerFiltro();
    this.obtenerCombos();
  }
  obtenerCombos(): void {
    this.loaderFiltro = true;
    this._integraService
      .postJsonResponse(constApiPlanificacion.MaterialPespecificoObtenerComboMaterial, {})
      .subscribe({
        next: (response: HttpResponse<ColeccionCombos>) => {
          this.listaCombos = response.body;
          this.listaAreas = response.body.obtenerFiltroArea;
          this.listaCiudades = response.body.obtenerCiudadBs;
          this.listaModalidades = response.body.obtenerComboModalidad;
          this.listaMaterialTipo = response.body.obtenerComboMaterial;
          this.listaEstadoProgramas = response.body.obtenerComboEstado;
          this.loaderFiltro = false;
        },
        error: (err) => {
          this.loaderFiltro = false;
        }
      });
  }
  obtenerFiltro(): void {
    this.gridProgramaEspecificoMaterial.loading = true;
    let dataEnviada = this.formatearObjeto();
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.PEspecificoObtenerPorFiltro,
        dataEnviada
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.gridProgramaEspecificoMaterial.data = response.body.sort(
            (a, b) => b.idProgramaEspecifico - a.idProgramaEspecifico
          );
          this.gridProgramaEspecificoMaterial.loading = false;
        },
        error: (err) => {},
      });
  }
  abrirModalProgramasEspecificosAsociados(dataSource: any): void {
    this.loaderModal = true;
    this._integraService
      .getJsonResponse(`${constApiPlanificacion.PEspecificoObtenerTodoPespecificosRelacionados}/${dataSource.idProgramaEspecifico}`)
      .subscribe({
        next: (response: HttpResponse<PadreContenidoGrid[]>) => {
          const modalRef = this._modalService.open(
            this.modalConfiguracionProgramasEspecificosAsociados,
            {
              size: 'lg',
              backdrop: 'static',
            }
          );
          this.nombrePrograma = dataSource.programaEspecifico;
          this.gridProgramaEspecificoMaterialDetalle.data = response.body;
          this.loaderModal = false;
        }
      })
    
  }
  formatearObjeto(): any {
    let dataForm = this.formFiltro.getRawValue();
    return {
      idPGeneral:
        dataForm.pgenerales.length > 0 ? dataForm.pgenerales.join(',') : null,
      idCentroCosto:
        dataForm.centroCostos.length > 0
          ? dataForm.centroCostos.join(',')
          : null,
      idEstadoPEspecifico:
        dataForm.estadoProgramas.length > 0
          ? dataForm.estadoProgramas.join(',')
          : null,
      idArea: dataForm.areas.length > 0 ? dataForm.areas.join(',') : null,
      idProgramaEspecifico:
        dataForm.pespecificos.length > 0
          ? dataForm.pespecificos.join(',')
          : null,
      codigoBs:
        dataForm.ciudades.length > 0 ? dataForm.ciudades.join(',') : null,
      idModalidadCurso:
        dataForm.modalidades.length > 0 ? dataForm.modalidades.join(',') : null,
      idSubArea:
        dataForm.subareas.length > 0 ? dataForm.subareas.join(',') : null,
    };
  }
  //Funciones de filtrado en cascada para el filtro
  filtrarAreaBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaAreas = this.listaCombos.obtenerFiltroArea.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaAreas = this.listaCombos.obtenerFiltroArea;
    }
  }
  filtrarSubAreasPorAreas(items: number[]): void {
    if (items.length > 0) {
      this.listaSubAreas = this.listaCombos.obtenerFiltroSubArea.filter((x) =>
        items.includes(x.idAreaCapacitacion)
      );
    } else {
      this.listaSubAreas = [];
      this.listaPgeneral = [];
      this.listaPespecificos = [];
      this.listaCentroCostos = [];
      this.formFiltro.patchValue({
        subareas: [],
        pgenerales: [],
        pespecificos: [],
        centroCostos: []
      });
    }
  }
  removerSubAreasPorAreas(item: any): void {
    let idAreasActuales = this.formFiltro.get('subareas').value;
    let entidadesAreaActuales = this.listaCombos.obtenerFiltroSubArea.filter(
      (x) => idAreasActuales.includes(x.id)
    );
    idAreasActuales = entidadesAreaActuales
      .filter((x) => {
        return x.idAreaCapacitacion != item.dataItem.id;
      })
      .map((y) => y.id);
    this.formFiltro.get('subareas').setValue(idAreasActuales);
  }

  filtrarSubAreaBusqueda(value: string): void {
    let idArea: number[] = this.formFiltro.get('areas').value;
    if (value.length >= 1) {
      this.listaSubAreas = this.listaCombos.obtenerFiltroSubArea.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 && idArea.includes(s.idAreaCapacitacion)
      );
    } else {
      this.listaSubAreas = this.listaCombos.obtenerFiltroSubArea.filter((x) =>
        idArea.includes(x.idAreaCapacitacion)
      );
    }
  }
  filtrarPgeneralPorSubAreas(items: number[]): void {
    if (items.length > 0) {
      this.listaPgeneral = this.listaCombos.obtenerProgramaGeneralPadre.filter((x) =>
        items.includes(x.idSubArea)
      );
    } else {
      this.listaPgeneral = [];
      this.listaPespecificos = [];
      this.listaCentroCostos = [];
      this.formFiltro.patchValue({
        pgenerales: [],
        pespecificos: [],
        centroCostos: []
      });
    }
  }
  removerPgeneralPorSubAreas(item: any): void {
    let idPgeneralesActuales = this.formFiltro.get('pgenerales').value;
    let entidadesPgeneralActuales = this.listaCombos.obtenerProgramaGeneralPadre.filter(
      (x) => idPgeneralesActuales.includes(x.id)
    );
    idPgeneralesActuales = entidadesPgeneralActuales
      .filter((x) => {
        return x.idSubArea != item.dataItem.id;
      })
      .map((y) => y.id);
    this.formFiltro.get('pgenerales').setValue(idPgeneralesActuales);
  }

  filtrarPgeneralBusqueda(value: string): void {
    let idArea: number[] = this.formFiltro.get('subareas').value;
    if (value.length >= 1) {
      this.listaPgeneral = this.listaCombos.obtenerProgramaGeneralPadre.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 && idArea.includes(s.idSubArea)
      );
    } else {
      this.listaPgeneral = this.listaCombos.obtenerProgramaGeneralPadre.filter((x) =>
        idArea.includes(x.idSubArea)
      );
    }
  }
  filtrarPespecificoPorPgeneral(items: number[]): void {
    if (items.length > 0) {
      this.listaPespecificos = this.listaCombos.obtenerProgramasEspecificosPadres.filter((x) =>
        items.includes(x.idPGeneral)
      );
    } else {
      this.listaPespecificos = [];
      this.listaCentroCostos = [];
      this.formFiltro.patchValue({
        pespecificos: [],
        centroCostos: []
      });
    }
  }
  removerPespecificoPorPgeneral(item: any): void {
    let idPespecificosActuales = this.formFiltro.get('pespecificos').value;
    let entidadesPgeneralActuales = this.listaCombos.obtenerProgramasEspecificosPadres.filter(
      (x) => idPespecificosActuales.includes(x.id)
    );
    idPespecificosActuales = entidadesPgeneralActuales
      .filter((x) => {
        return x.idPGeneral != item.dataItem.id;
      })
      .map((y) => y.id);
    this.formFiltro.get('pespecificos').setValue(idPespecificosActuales);
  }

  filtrarPespecificoBusqueda(value: string): void {
    let idPgenerales: number[] = this.formFiltro.get('pgenerales').value;
    if (value.length >= 1) {
      this.listaPespecificos = this.listaCombos.obtenerProgramasEspecificosPadres.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 && idPgenerales.includes(s.idPGeneral)
      );
    } else {
      this.listaPespecificos = this.listaCombos.obtenerProgramasEspecificosPadres.filter((x) =>
        idPgenerales.includes(x.idPGeneral)
      );
    }
  }
  filtrarCentroCostoPorPespecifico(items: number[]): void {
  if (items.length > 0) {
    this.listaCentroCostos = this.listaCombos.obtenerCentroCostoPadres.filter((x) =>
      items.includes(x.idPEspecifico)
    );
  } else {
    this.listaCentroCostos = [];
      this.formFiltro.patchValue({
        centroCostos: []
      });
    }
  }
  removerCentroCostoPorPespecifico(item: any): void {
  let idCentroCostosActuales = this.formFiltro.get('centroCostos').value;
  let entidadesPespecificoActuales = this.listaCombos.obtenerCentroCostoPadres.filter(
    (x) => idCentroCostosActuales.includes(x.id)
  );
  idCentroCostosActuales = entidadesPespecificoActuales
    .filter((x) => {
      return x.idPEspecifico != item.dataItem.id;
    })
    .map((y) => y.id);
  this.formFiltro.get('centroCostos').setValue(idCentroCostosActuales);
  }

  filtrarCentroCostoBusqueda(value: string): void {
    let idPespecificos: number[] = this.formFiltro.get('pespecificos').value;
    if (value.length >= 1) {
      this.listaCentroCostos = this.listaCombos.obtenerCentroCostoPadres.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 && idPespecificos.includes(s.idPEspecifico)
      );
    } else {
      this.listaCentroCostos = this.listaCombos.obtenerCentroCostoPadres.filter((x) =>
      idPespecificos.includes(x.idPEspecifico)
      );
    }
  }

  filtrarEstadoBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaEstadoProgramas = this.listaCombos.obtenerComboEstado.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else this.listaEstadoProgramas = this.listaCombos.obtenerComboEstado;
  }
  
  filtrarCiudadBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaCiudades = this.listaCombos.obtenerCiudadBs.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else this.listaCiudades = this.listaCombos.obtenerCiudadBs;
  }

  filtrarModalidadBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaModalidades = this.listaCombos.obtenerComboModalidad.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else this.listaModalidades = this.listaCombos.obtenerComboModalidad;
  }
}

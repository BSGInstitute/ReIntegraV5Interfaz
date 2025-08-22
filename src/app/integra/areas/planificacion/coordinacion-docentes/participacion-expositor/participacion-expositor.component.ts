import { filter, map } from 'rxjs';
import { IDataAsesor } from './../../../comercial/models/interfaces/ireporte-ingreso-asesor';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import {
  constApiPlanificacion,
  constApiComercial,
} from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { GridComponent, PageSizeItem } from '@progress/kendo-angular-grid';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';
import {
  CompositeFilterDescriptor,
  FilterDescriptor,
} from '@progress/kendo-data-query';
import { ExcelExportComponent } from '@progress/kendo-angular-excel-export';
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
interface ParticipacionExpositorConfirmacion {
  id: number;
  idProveedorOperacionesGrupoConfirmado?: number;
}

interface ColeccionCombos {
  areas: AreaCapacitacionCombo[];
  centroCostos: CentroCostoPadreCombo[];
  ciudadesBs: IComboBase1[];
  estados: IComboBase1[];
  expositores: IComboBase1[];
  modalidades: IComboBase1[];
  pEspecificos: ProgramaEspecificoPadreCombo[];
  pGenerales: ProgramaGeneralPadreCombo[];
  proovedorHonorarios: IComboBase1[];
  subareas: SubAreaCapacitacionCombo[];
  idPersonal: number;
}
interface ProveedorExpositor {
  id: number;
  anho: number;
  idPEspecificoPadre: number;
  pEspecificoPadre: string;
  estadoPrograma: string;
  idPEspecifico: number;
  pEspecifico: string;
  estadoCurso: string;
  modalidad: string;
  modalidadPrograma: string;
  idCentroCostoPrograma: number;
  centroCostoPrograma: string;
  ciudad: string;
  orden: number;
  grupo: number;
  estadoParticipacion: string;
  expositorPlanificacion: string;
  expositorV3: string;
  expositorConfirmado: string;
  idExpositorConfirmado: number;
  idProveedorPlanificacionGrupo: number;
  idProveedorOperacionesGrupoConfirmado: number;
  idProveedorFur: number;
  proveedorFur: any;
  fechaInicio: string;
  fechaTermino: string;
  esNotaAprobada: any;
  esAsistenciaAprobada: any;
  aplicaCierreAsistencia: boolean;
}
@Component({
  selector: 'app-participacion-expositor',
  templateUrl: './participacion-expositor.component.html',
  styleUrls: ['./participacion-expositor.component.scss'],
})
export class ParticipacionExpositorComponent implements OnInit {
  gridParticipacionExpositores = new KendoGrid<ProveedorExpositor>();

  loaderFiltro: boolean = false;

  listaCombos: ColeccionCombos = null;
  listaAreas: AreaCapacitacionCombo[];
  listaCentroCostos: CentroCostoPadreCombo[];
  listaCiudades: IComboBase1[];
  listaEstadoProgramas: IComboBase1[];
  listaExpositores: IComboBase1[];
  listaModalidades: IComboBase1[];
  listaPespecificos: ProgramaEspecificoPadreCombo[];
  listaPgeneral: ProgramaGeneralPadreCombo[];
  listaSubAreas: SubAreaCapacitacionCombo[];
  listaProveedores: IComboBase1[];
  listaCentroCostoIndividual: IComboBase1[];

  expositorConfirmado: boolean = false;
  expositorFur: boolean = false;

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '10', value: 15 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  formFiltro: FormGroup = this._formBuilder.group({
    idArea: [[]],
    idSubArea: [[]],
    idPGeneral: [[]],
    idProgramaEspecifico: [[]],
    idEstadoPEspecifico: [[]],
    idCentroCosto: [[]],
    idCentroCostoD: [''],
    idCodigoBSCiudad: [[]],
    idModalidadCurso: [[]],
    proveedorPla: [[]],
    proveedorOpe: [[]],
    proveedorFur: [[]],
  });

  constructor(
    private _integraService: IntegraService,
    private _formBuilder: FormBuilder,
    private _alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.cargarConfiguracionGrid();

    this.obtenerCombos();
    this.obtenerFiltro();
  }

  cargarConfiguracionGrid(): void {
    this.gridParticipacionExpositores.getCellCloseEvent$().subscribe({
      next: (rpta) => {
        let form = rpta.formGroupValue;
        switch (rpta.columnField) {
          case 'expositorConfirmado':
            if (form.expositorConfirmado != 0) {
              let expositor = this.listaProveedores.find(
                (x) => x.id == form.expositorConfirmado
              );
              if (expositor) {
                this.actualizarAsignacionDocente(
                  rpta.dataItem.id,
                  expositor.id
                );
              }
              rpta.dataItem.expositorConfirmado = expositor.nombre;
            }
            break;
          case 'proveedorFur':
            if (form.proveedorFur != 0) {
              let expositor = this.listaProveedores.find(
                (x) => x.id == form.proveedorFur
              );
              if (expositor && rpta.dataItem.proveedorFur == expositor.nombre) {
                this.actualizarProveedor(rpta.dataItem.id, expositor.id);
              }
            }
            break;
        }
      },
    });
    this.gridParticipacionExpositores.getCellClickEvent$().subscribe({
      next: (res) => {
        this.gridParticipacionExpositores.formGroup.setValue({
          expositorConfirmado: res.dataItem.expositorConfirmado,
          proveedorFur: res.dataItem.proveedorFur,
        });
      },
    });
    this.gridParticipacionExpositores.formGroup = this._formBuilder.group({
      expositorConfirmado: [0],
      proveedorFur: [0],
    });
  }

  exportarExcel(excelexport: ExcelExportComponent, grid: GridComponent) {
    let data = this.gridParticipacionExpositores.data;
    console.log("DATA : ",data)

    if (grid.filter && grid.filter.filters) {
      grid.filter.filters.forEach((filterGroup) => {
        const filters = filterGroup as CompositeFilterDescriptor;
  
        if (filters && filters.filters) {
          filters.filters.forEach((x) => {
            const item = x as FilterDescriptor;
  
            if (item.field === 'ciudad' && item.value) {
              data = data.filter((s) => s.ciudad?.includes(item.value));
            }
            if (item.field === "pEspecificoPadre" && item.value) {
              data = data.filter((s) => s.pEspecificoPadre?.includes(item.value));
            }
            if (item.field === "centroCostoPrograma" && item.value) {
              data = data.filter((s) => s.centroCostoPrograma?.includes(item.value));
            }
            if (item.field === "estadoPrograma" && item.value) {
              data = data.filter((s) => s.estadoPrograma?.includes(item.value));
            }
            if (item.field === "pEspecifico" && item.value) {
              data = data.filter((s) => s.pEspecifico?.includes(item.value));
            }
            if (item.field === "grupo" && item.value) {
              data = data.filter((s) => s.grupo?.toString().includes(item.value.toString()));
            }
            if (item.field === "estadoCurso" && item.value) {
              data = data.filter((s) => s.estadoCurso?.includes(item.value));
            }
            if (item.field === "modalidad" && item.value) {
              data = data.filter((s) => s.modalidad?.includes(item.value));
            }
            if (item.field === "estadoParticipacion" && item.value) {
              data = data.filter((s) => s.estadoParticipacion?.includes(item.value));
            }
            if (item.field === "expositorPlanificacion" && item.value) {
              console.log(item.value);
              data = data.filter((s) => s.expositorPlanificacion?.includes(item.value));
              console.log("Filtrado : ",data);
            }
            if (item.field === "expositorV3" && item.value) {
              data = data.filter((s) => s.expositorV3?.includes(item.value));
            }
            if (item.field === "expositorConfirmado" && item.value) {
              console.log(item.value);
              data = data.filter((s) => s.expositorConfirmado?.includes(item.value));
              console.log("Filtrado 2: ",data);
            }
            if (item.field === "proveedorFur" && item.value) {
              data = data.filter((s) => s.proveedorFur?.includes(item.value));
            }
            if (item.field === "esNotaAprobada" && item.value) {
              data = data.filter((s) => s.esNotaAprobada?.includes(item.value));
            }
          });
        }
      });
    }
  

    excelexport.data = data;

    console.log('ExcelExport:', excelexport);
    console.log('Grilla:', grid);
  
    // Iniciar la exportación
    excelexport.save();
  }
  

  obtenerFiltro(): void {
    let centroCostoD = this.formFiltro.get('idCentroCostoD').value;
    let dataEnviada = null;
    if (centroCostoD != null && centroCostoD != '') {
      let idCentroCosto = this.listaCombos.centroCostos.find(
        (x) => x.nombre == centroCostoD
      ).id;
      this.formFiltro.reset();
      dataEnviada = this.formatearObjeto();
      dataEnviada.idCentroCostoD = idCentroCosto;
      this.formFiltro.get('idCentroCostoD').setValue(centroCostoD);
    } else {
      dataEnviada = this.formatearObjeto();
    }
    this.gridParticipacionExpositores.loading = true;
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.PespecificoParticipacionExpositorObtenerReporteExpositor,
        dataEnviada
      )
      .subscribe({
        next: (response: HttpResponse<ProveedorExpositor[]>) => {
          this.gridParticipacionExpositores.data = response.body;
          this.gridParticipacionExpositores.loading = false;
        },
      });
  }
  obtenerCombos(): void {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.PespecificoParticipacionExpositorObtenerCombosProgramaEspecificoProveedor
      )
      .subscribe({
        next: (response: HttpResponse<ColeccionCombos>) => {
          this.listaCombos = response.body;
          this.listaAreas = response.body.areas;
          this.listaModalidades = response.body.modalidades;
          this.listaCiudades = response.body.ciudadesBs;
          this.listaEstadoProgramas = response.body.estados;
          this.listaProveedores = response.body.proovedorHonorarios;

          this.expositorConfirmado = response.body.idPersonal != 7;
          this.expositorFur =
            response.body.idPersonal == 7 || response.body.idPersonal == 213;
        },
      });
  }
  actualizarAsignacionDocente(id: number, idProv: number): void {
    let dataEnviada = {
      idProveedorOperacionesGrupoConfirmado: idProv,
      id: id,
    };
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.PespecificoParticipacionExpositorActualizarProveedorConfirmacion,
        dataEnviada
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.body) {
            console.log('Se realizaron los cambios correctamente');
          }
        },
      });
  }
  actualizarProveedor(id: number, idProv: number): void {
    let dataEnviada = {
      IdProveedorFur: idProv,
      id: id,
    };
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.PespecificoParticipacionExpositorActualizarProveedor,
        dataEnviada
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.body) {
            console.log('Se realizaron los cambios correctamente');
          }
        },
      });
  }
  habilitarAsistencia(idCursoActual: number): void {
    this._integraService
      .putJsonResponse(
        `${constApiPlanificacion.PespecificoParticipacionExpositorActualizarRegistroAsistencia}/${idCursoActual}`
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.body) {
            this.obtenerFiltro();
          }
        },
      });
  }
  habilitarNota(idCursoActual: number): void {
    this._integraService
      .putJsonResponse(
        `${constApiPlanificacion.PespecificoParticipacionExpositorActualizarRegistroNotas}/${idCursoActual}`
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if (response.body) {
            this.obtenerFiltro();
          }
        },
      });
  }
  formatearObjeto(): any {
    let form = this.formFiltro.getRawValue();
    return {
      idCentroCostoD: 0,
      idPGeneral: form.idPGeneral != null ? form.idPGeneral.join() : '',
      idEstadoPEspecifico:
        form.idEstadoPEspecifico != null ? form.idEstadoPEspecifico.join() : '',
      idProgramaEspecifico:
        form.idProgramaEspecifico != null
          ? form.idProgramaEspecifico.join()
          : '',
      idArea: form.idArea != null ? form.idArea.join() : '',
      idSubArea: form.idSubArea != null ? form.idSubArea.join() : '',
      idCentroCosto:
        form.idCentroCosto != null ? form.idCentroCosto.join() : '',
      idCodigoBSCiudad:
        form.idCodigoBSCiudad != null ? form.idCodigoBSCiudad.join() : '',
      idModalidadCurso:
        form.idModalidadCurso != null ? form.idModalidadCurso.join() : '',
      idProveedorPlanificacion:
        form.proveedorPla != null ? form.proveedorPla.join() : '',
      idProveedorOperaciones:
        form.proveedorOpe != null ? form.proveedorOpe.join() : '',
      idProveedorFur: form.proveedorFur != null ? form.proveedorFur.join() : '',
    };
  }
  //Funciones de filtrado en cascada para el filtro
  filtrarAreaBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaAreas = this.listaCombos.areas.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaAreas = this.listaCombos.areas;
    }
  }
  filtrarSubAreasPorAreas(items: number[]): void {
    if (items.length > 0) {
      this.listaSubAreas = this.listaCombos.subareas.filter((x) =>
        items.includes(x.idAreaCapacitacion)
      );
    } else {
      this.listaSubAreas = [];
      this.listaPgeneral = [];
      this.listaPespecificos = [];
      this.listaCentroCostos = [];
      this.formFiltro.patchValue({
        idSubArea: [],
        idPGeneral: [],
        idProgramaEspecifico: [],
        idCentroCosto: [],
      });
    }
  }
  removerSubAreasPorAreas(item: any): void {
    let idAreasActuales = this.formFiltro.get('idSubArea').value;
    let entidadesAreaActuales = this.listaCombos.subareas.filter((x) =>
      idAreasActuales.includes(x.id)
    );
    idAreasActuales = entidadesAreaActuales
      .filter((x) => {
        return x.idAreaCapacitacion != item.dataItem.id;
      })
      .map((y) => y.id);
    this.formFiltro.get('idSubArea').setValue(idAreasActuales);
  }

  filtrarSubAreaBusqueda(value: string): void {
    let idArea: number[] = this.formFiltro.get('idArea').value;
    if (value.length >= 1) {
      this.listaSubAreas = this.listaCombos.subareas.filter(
        (s) =>
          s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 &&
          idArea.includes(s.idAreaCapacitacion)
      );
    } else {
      this.listaSubAreas = this.listaCombos.subareas.filter((x) =>
        idArea.includes(x.idAreaCapacitacion)
      );
    }
  }
  filtrarPgeneralPorSubAreas(items: number[]): void {
    if (items.length > 0) {
      this.listaPgeneral = this.listaCombos.pGenerales.filter((x) =>
        items.includes(x.idSubArea)
      );
    } else {
      this.listaPgeneral = [];
      this.listaPespecificos = [];
      this.listaCentroCostos = [];
      this.formFiltro.patchValue({
        idPGeneral: [],
        idProgramaEspecifico: [],
        idCentroCosto: [],
      });
    }
  }
  removerPgeneralPorSubAreas(item: any): void {
    let idPgeneralesActuales = this.formFiltro.get('idPGeneral').value;
    let entidadesPgeneralActuales = this.listaCombos.pGenerales.filter((x) =>
      idPgeneralesActuales.includes(x.id)
    );
    idPgeneralesActuales = entidadesPgeneralActuales
      .filter((x) => {
        return x.idSubArea != item.dataItem.id;
      })
      .map((y) => y.id);
    this.formFiltro.get('idPGeneral').setValue(idPgeneralesActuales);
  }

  actualizarExpositorConfirmado(
    idExpositorConfirmado: number,
    dataItem: ProveedorExpositor
  ) {
    let valorActual: number;
    let endpoint: string;
    console.log('DataItem Modificar : ', dataItem.id);
    endpoint =
      constApiPlanificacion.PespecificoParticipacionExpositorActualizarProveedorConfirmacion;
    let jsonEnvio = {
      id: dataItem.id,
      idProveedorOperacionesGrupoConfirmado: idExpositorConfirmado,
    };
    if (idExpositorConfirmado != valorActual) {
      this._integraService.putJsonResponse(endpoint, jsonEnvio).subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });

            let mensaje = 'Se actualizo el ExpositorConfirmado correctamente';
            Toast.fire({
              icon: 'success',
              title: mensaje,
            });
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: 'Error en la solicitud',
            text: mensaje,
          });
        },
      });
    }
  }

  filtrarPgeneralBusqueda(value: string): void {
    let idArea: number[] = this.formFiltro.get('idSubArea').value;
    if (value.length >= 1) {
      this.listaPgeneral = this.listaCombos.pGenerales.filter(
        (s) =>
          s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 &&
          idArea.includes(s.idSubArea)
      );
    } else {
      this.listaPgeneral = this.listaCombos.pGenerales.filter((x) =>
        idArea.includes(x.idSubArea)
      );
    }
  }
  filtrarPespecificoPorPgeneral(items: number[]): void {
    if (items.length > 0) {
      this.listaPespecificos = this.listaCombos.pEspecificos.filter((x) =>
        items.includes(x.idPGeneral)
      );
    } else {
      this.listaPespecificos = [];
      this.listaCentroCostos = [];
      this.formFiltro.patchValue({
        idProgramaEspecifico: [],
        idCentroCosto: [],
      });
    }
  }
  removerPespecificoPorPgeneral(item: any): void {
    let idPespecificosActuales = this.formFiltro.get(
      'idProgramaEspecifico'
    ).value;
    let entidadesPgeneralActuales = this.listaCombos.pEspecificos.filter((x) =>
      idPespecificosActuales.includes(x.id)
    );
    idPespecificosActuales = entidadesPgeneralActuales
      .filter((x) => {
        return x.idPGeneral != item.dataItem.id;
      })
      .map((y) => y.id);
    this.formFiltro
      .get('idProgramaEspecifico')
      .setValue(idPespecificosActuales);
  }

  filtrarPespecificoBusqueda(value: string): void {
    let idPgenerales: number[] = this.formFiltro.get('idPGeneral').value;
    if (value.length >= 1) {
      this.listaPespecificos = this.listaCombos.pEspecificos.filter(
        (s) =>
          s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 &&
          idPgenerales.includes(s.idPGeneral)
      );
    } else {
      this.listaPespecificos = this.listaCombos.pEspecificos.filter((x) =>
        idPgenerales.includes(x.idPGeneral)
      );
    }
  }
  filtrarCentroCostoPorPespecifico(items: number[]): void {
    if (items.length > 0) {
      this.listaCentroCostos = this.listaCombos.centroCostos.filter((x) =>
        items.includes(x.idPEspecifico)
      );
    } else {
      this.listaCentroCostos = [];
      this.formFiltro.patchValue({
        idCentroCosto: [],
      });
    }
  }
  removerCentroCostoPorPespecifico(item: any): void {
    let idCentroCostosActuales = this.formFiltro.get('idCentroCosto').value;
    let entidadesPespecificoActuales = this.listaCombos.centroCostos.filter(
      (x) => idCentroCostosActuales.includes(x.id)
    );
    idCentroCostosActuales = entidadesPespecificoActuales
      .filter((x) => {
        return x.idPEspecifico != item.dataItem.id;
      })
      .map((y) => y.id);
    this.formFiltro.get('idCentroCosto').setValue(idCentroCostosActuales);
  }

  filtrarEstadoBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaEstadoProgramas = this.listaCombos.estados.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else this.listaEstadoProgramas = this.listaCombos.estados;
  }

  filtrarCiudadBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaCiudades = this.listaCombos.ciudadesBs.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else this.listaCiudades = this.listaCombos.ciudadesBs;
  }

  filtrarModalidadBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaModalidades = this.listaCombos.modalidades.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else this.listaModalidades = this.listaCombos.modalidades;
  }

  filtrarCentroCostoBusqueda(value: string): void {
    let idPespecificos: number[] = this.formFiltro.get(
      'idProgramaEspecifico'
    ).value;
    if (value.length >= 1) {
      this.listaCentroCostos = this.listaCombos.centroCostos.filter(
        (s) =>
          s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 &&
          idPespecificos.includes(s.idPEspecifico)
      );
    } else {
      this.listaCentroCostos = this.listaCombos.centroCostos.filter((x) =>
        idPespecificos.includes(x.idPEspecifico)
      );
    }
  }

  filtrarCentroCostoIndividualBusqueda(value: string): void {
    this.formFiltro.reset();
    if (value.length >= 4) {
      this._integraService
        .postJsonResponse(
          constApiComercial.CentroCostoObtenerFiltroAutocomplete,
          { valor: value }
        )
        .subscribe({
          next: (response: HttpResponse<IComboBase1[]>) => {
            this.listaCentroCostoIndividual = response.body;
          },
        });
    } else this.listaCentroCostoIndividual = [];
  }
}

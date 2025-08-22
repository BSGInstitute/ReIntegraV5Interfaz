import { HttpResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

interface AreaCapacitacionCombo {
  id: number;
  idAreaCapacitacionFacebook: number;
  nombre: string;
}
interface PgeneralSubAreaCombo {
  id: number;
  nombre: string;
  idSubArea: number;
}
interface SubAreaCapacitacionCombo {
  id: number;
  idAreaCapacitacion: number;
  nombre: string;
}
interface ColeccionCombos {
  areaCapacitacion: Array<AreaCapacitacionCombo>;
  modalidadCurso: Array<IComboBase1>;
  pGeneralSubArea: Array<PgeneralSubAreaCombo>;
  seccionPreguntaFrecuente: Array<IComboBase1>;
  subAreaCapacitacion: Array<SubAreaCapacitacionCombo>;
}
interface PreguntaFrecuentePrincipal {
  id: number;
  idSeccionPreguntaFrecuente: number;
  pregunta: string;
  respuesta: string;
}
interface PreguntaFrecuenteEnviar {
  preguntaFrecuente: PreguntaFrecuentePrincipal;
  preguntaFrecuenteAreas: number[];
  preguntaFrecuenteSubAreas: number[];
  preguntaFrecuentePGenerals: number[];
  preguntaFrecuenteTipos: number[];
}
interface PreguntaFrecuente {
  id: number;
  pregunta: string;
  respuesta: string;
  tipo: number;
  idSeccion: number;
  idsAreas: Array<number>;
  idsSubareas: Array<number>;
  idsPgenerales: Array<number>;
  idsTipos: Array<number>;
}
@Component({
  selector: 'app-pregunta-frecuente-aula-virtual',
  templateUrl: './pregunta-frecuente-aula-virtual.component.html',
  styleUrls: ['./pregunta-frecuente-aula-virtual.component.scss'],
})
export class PreguntaFrecuenteAulaVirtualComponent implements OnInit {
  @ViewChild('modalPreguntasFrecuentes') modalPreguntasFrecuentes: any;

  gridPreguntasFrecuentes: KendoGrid = new KendoGrid();
  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;

  //Combos dentro de filtros
  listaCombos: ColeccionCombos;
  listaAreas: Array<AreaCapacitacionCombo>;
  listaSubAreas: Array<SubAreaCapacitacionCombo>;
  listaPgeneral: Array<PgeneralSubAreaCombo>;

  //Combos dentro de modal
  listaCombosModal: ColeccionCombos;
  listaAreasModal: Array<AreaCapacitacionCombo>;
  listaSubAreasModal: Array<SubAreaCapacitacionCombo>;
  listaPgeneralModal: Array<PgeneralSubAreaCombo>;

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  modalRefEditar: NgbModalRef = null;

  formFiltro: FormGroup = this.formBuilder.group({
    areas: [[]],
    subareas: [[]],
    pgenerales: [[]],
  });

  formPreguntaFrecuente: FormGroup = this.formBuilder.group({
    id: [[]],
    pregunta: ['', [Validators.required]],
    respuesta: [''],
    seccionPregunta: [3],
    area: [[]],
    subarea: [[]],
    pgeneral: [[]],
    modalidad: [[]],
  });

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtener();
    this.obtenerCombos();
  }
  obtener(): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.PreguntaFrecuenteObtener)
      .subscribe({
        next: (response: HttpResponse<Array<PreguntaFrecuente>>) => {
          this.gridPreguntasFrecuentes.data = response.body;
          this.loaderModal = false;
        },
        error: (e: any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        },
      });
  }
  obtenerCombos(): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(
        constApiPlanificacion.PreguntaFrecuenteObtenerCombosModulo
      )
      .subscribe({
        next: (response: HttpResponse<ColeccionCombos>) => {
          this.loaderModal = false;
          this.listaCombos = response.body;
          this.listaAreas = response.body.areaCapacitacion;

          this.listaCombosModal = response.body;
          this.listaAreasModal = response.body.areaCapacitacion;
        },
        error: (e: any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        },
      });
  }
  obtenerFiltros(): void {
    this.loaderModal = true;
    let dataEnviada = this.formFiltro.getRawValue();
    dataEnviada.areas = dataEnviada.areas != null ? dataEnviada.areas : [];
    dataEnviada.subareas =
      dataEnviada.subareas != null ? dataEnviada.subareas : [];
    dataEnviada.pgenerales =
      dataEnviada.pgenerales != null ? dataEnviada.pgenerales : [];
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.PreguntaFrecuenteObtenerPorFiltro,
        dataEnviada
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridPreguntasFrecuentes.data = response.body;
          this.loaderModal = false;
        },
        error: (e: any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        },
      });
  }
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formPreguntaFrecuente.reset();
    this.formPreguntaFrecuente.patchValue({
      id: 0,
      seccionPregunta: 3,
      respuesta: '',
      area: [],
      subarea: [],
      pgeneral: [],
      modalidad: [],
    });
    this.modalRefEditar = this.modalService.open(
      this.modalPreguntasFrecuentes,
      { size: 'lg', backdrop: 'static' }
    );
  }
  abrirModalDetalleActualizar(dataSource: PreguntaFrecuente): void {
    this.nuevoRegistro = false;
    this.formPreguntaFrecuente.setValue({
      id: dataSource.id,
      pregunta: dataSource.pregunta,
      respuesta: dataSource.respuesta,
      seccionPregunta: dataSource.idSeccion,
      area: dataSource.idsAreas != null ? dataSource.idsAreas : [],
      subarea: dataSource.idsSubareas != null ? dataSource.idsSubareas : [],
      pgeneral:
        dataSource.idsPgenerales != null ? dataSource.idsPgenerales : [],
      modalidad: dataSource.idsTipos[0] != null ? dataSource.idsTipos : [],
    });
    this.modalRefEditar = this.modalService.open(
      this.modalPreguntasFrecuentes,
      { size: 'lg', backdrop: 'static' }
    );
    this.filtrarSubAreasPorAreasModal(dataSource.idsAreas);
    this.filtrarPgeneralPorSubAreasModal(dataSource.idsSubareas);
  }
  insertar(): void {
    if (this.formPreguntaFrecuente.valid) {
      let dataEnviada = this.formatearObjeto();
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.PreguntaFrecuenteInsertar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<Array<PreguntaFrecuente>>) => {
            this.gridPreguntasFrecuentes.data = response.body;
            this.limpiarCamposForm();
            Swal.fire(
              '¡Registrado!',
              'El registro ha sido creado correctamente.',
              'success'
            );
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(
              `Surgio un error: ${e.error}`
            );
          },
        });
    }
  }
  actualizar(): void {
    if (this.formPreguntaFrecuente.valid) {
      let dataEnviada = this.formatearObjeto();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.PreguntaFrecuenteActualizar,
          JSON.stringify(dataEnviada)
        )
        .subscribe({
          next: (response: HttpResponse<Array<PreguntaFrecuente>>) => {
            this.gridPreguntasFrecuentes.data = response.body;
            this.limpiarCamposForm();
            Swal.fire(
              '¡Actualizado!',
              'El registro ha sido actualizado correctamente.',
              'success'
            );
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(
              `Surgio un error: ${e.error}`
            );
          },
        });
    }
  }
  eliminar(dataSource: PreguntaFrecuente): void {
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaderModal = true;
        this.integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.PreguntaFrecuenteEliminar}/${dataSource.id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if (response.body) {
                let idIndice =
                  this.gridPreguntasFrecuentes.data.indexOf(dataSource);
                this.gridPreguntasFrecuentes.data.splice(idIndice, 1);
                this.gridPreguntasFrecuentes.loadData();
                Swal.fire(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success'
                );
              } else {
                Swal.fire(
                  'Error',
                  'Surgio un error al eliminar el registro.',
                  'error'
                );
              }
              this.loaderModal = false;
            },
            error: (e: any) => {
              this.loaderModal = false;
              this.alertaService.notificationWarning(`Surgio un error: ${e}`);
            },
          });
      }
    });
  }
  formatearObjeto(): PreguntaFrecuenteEnviar {
    let dataForm = this.formPreguntaFrecuente.getRawValue();
    let areas: number[] = dataForm.area
      .map((a: number) => (a != null ? a : null))
      .filter((a: number) => a != null);
    let subareas: number[] = dataForm.subarea
      .map((a: number) => (a != null ? a : null))
      .filter((a: number) => a != null);
    let pgenerales: number[] = dataForm.pgeneral
      .map((a: number) => (a != null ? a : null))
      .filter((a: number) => a != null);
    let modalidades: number[] = dataForm.modalidad
      .map((a: number) => (a != null ? a : null))
      .filter((a: number) => a != null);
    let objetoCompleto: PreguntaFrecuenteEnviar = {
      preguntaFrecuente: {
        id: dataForm.id,
        idSeccionPreguntaFrecuente: dataForm.seccionPregunta,
        pregunta: dataForm.pregunta,
        respuesta: dataForm.respuesta,
      },
      preguntaFrecuenteAreas: areas,
      preguntaFrecuenteSubAreas: subareas,
      preguntaFrecuentePGenerals: pgenerales,
      preguntaFrecuenteTipos: modalidades,
    };
    return objetoCompleto;
  }
  limpiarCamposForm(): void {
    if (this.modalRefEditar != null) {
      this.modalRefEditar.close();
      this.modalRefEditar = null;
    }
    this.formPreguntaFrecuente.reset();
    this.loaderModal = false;
  }
  //Funciones de filtrado en cascada para el filtro
  filtrarAreaBusqueda(value: string): void {
    if (value.length >= 1) {
      this.listaAreas = this.listaCombos.areaCapacitacion.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaAreas = this.listaCombos.areaCapacitacion;
    }
  }
  filtrarSubAreasPorAreas(items: number[]): void {
    if (items.length > 0) {
      this.listaSubAreas = this.listaCombos.subAreaCapacitacion.filter((x) =>
        items.includes(x.idAreaCapacitacion)
      );
    } else {
      this.listaSubAreas = [];
    }
  }
  removerSubAreasPorAreas(item: any): void {
    let idAreasActuales = this.formFiltro.get('subareas').value;
    let entidadesAreaActuales = this.listaCombos.subAreaCapacitacion.filter(
      (x) => idAreasActuales.includes(x.id)
    );
    idAreasActuales = entidadesAreaActuales
      .filter((x) => {
        return x.idAreaCapacitacion != item.dataItem.id;
      })
      .map((y) => y.id);
    this.formFiltro.get('subareas').setValue(idAreasActuales);
    this.formFiltro.get('pgenerales').setValue([]);
  }

  filtrarSubAreaBusqueda(value: string): void {
    let idArea: number[] = this.formFiltro.get('areas').value;
    if (value.length >= 1) {
      this.listaSubAreas = this.listaCombos.subAreaCapacitacion.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 && idArea.includes(s.idAreaCapacitacion)
      );
    } else {
      this.listaSubAreas = this.listaCombos.subAreaCapacitacion.filter((x) =>
        idArea.includes(x.idAreaCapacitacion)
      );
    }
  }
  filtrarPgeneralPorSubAreas(items: number[]): void {
    if (items.length > 0) {
      this.listaPgeneral = this.listaCombos.pGeneralSubArea.filter((x) =>
        items.includes(x.idSubArea)
      );
    } else {
      this.listaPgeneral = [];
    }
  }
  removerPgeneralPorSubAreas(item: any): void {
    let idPgeneralesActuales = this.formFiltro.get('pgenerales').value;
    let entidadesActuales = this.listaCombos.pGeneralSubArea.filter((x) =>
      idPgeneralesActuales.includes(x.id)
    );
    idPgeneralesActuales = entidadesActuales
      .filter((x) => {
        return x.idSubArea != item.dataItem.id;
      })
      .map((y) => y.id);
    this.formFiltro.get('pgenerales').setValue(idPgeneralesActuales);
  }

  filtrarPgeneralBusqueda(value: string): void {
    let idSubArea: number[] = this.formFiltro.get('subareas').value;
    if (idSubArea != null) {
      if (value.length >= 1) {
        this.listaPgeneral = this.listaCombos.pGeneralSubArea.filter(
          (s) =>
            s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 &&
            idSubArea.includes(s.idSubArea)
        );
      } else {
        this.listaPgeneral = this.listaCombos.pGeneralSubArea.filter((x) =>
          idSubArea.includes(x.idSubArea)
        );
      }
    }
  }

  //Funciones de filtrado en cascada para el Modal
  filtrarAreaBusquedaModal(value: string): void {
    if (value.length >= 1) {
      this.listaAreasModal = this.listaCombosModal.areaCapacitacion.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.listaAreasModal = this.listaCombosModal.areaCapacitacion;
    }
  }
  filtrarSubAreasPorAreasModal(items: number[]): void {
    if (items.length > 0) {
      this.listaSubAreasModal =
        this.listaCombosModal.subAreaCapacitacion.filter((x) =>
          items.includes(x.idAreaCapacitacion)
        );
    } else {
      this.listaSubAreasModal = [];
    }
  }
  removerSubAreasPorAreasModal(item: any): void {
    let idAreasActuales = this.formPreguntaFrecuente.get('subarea').value;
    let entidadesActuales = this.listaCombos.subAreaCapacitacion.filter((x) =>
      idAreasActuales.includes(x.id)
    );
    idAreasActuales = entidadesActuales
      .filter((x) => {
        return x.idAreaCapacitacion != item.dataItem.id;
      })
      .map((y) => y.id);
    this.formPreguntaFrecuente.get('subarea').setValue(idAreasActuales);
    this.formPreguntaFrecuente.get('pgeneral').setValue([]);
  }

  filtrarSubAreaBusquedaModal(value: string): void {
    let idArea: number[] = this.formPreguntaFrecuente.get('area').value;
    if (value.length >= 1) {
      this.listaSubAreasModal =
        this.listaCombosModal.subAreaCapacitacion.filter(
          (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
    } else {
      this.listaSubAreasModal =
        this.listaCombosModal.subAreaCapacitacion.filter((x) =>
          idArea.includes(x.idAreaCapacitacion)
        );
    }
  }
  filtrarPgeneralPorSubAreasModal(items: number[]): void {
    if (items.length > 0) {
      this.listaPgeneralModal = this.listaCombosModal.pGeneralSubArea.filter(
        (x) => items.includes(x.idSubArea)
      );
    } else {
      this.listaPgeneralModal = [];
    }
  }
  removerPgeneralPorSubAreasModal(item: any): void {
    let idPgeneralesActuales = this.formPreguntaFrecuente.get('pgeneral').value;
    let entidadesActuales = this.listaCombos.pGeneralSubArea.filter((x) =>
      idPgeneralesActuales.includes(x.id)
    );
    idPgeneralesActuales = entidadesActuales
      .filter((x) => {
        return x.idSubArea != item.dataItem.id;
      })
      .map((y) => y.id);
    this.formPreguntaFrecuente.get('pgeneral').setValue(idPgeneralesActuales);
  }

  filtrarPgeneralBusquedaModal(value: string): void {
    let idSubArea: number[] = this.formPreguntaFrecuente.get('subarea').value;
    if (idSubArea != null) {
      if (value.length >= 1) {
        this.listaPgeneralModal = this.listaCombosModal.pGeneralSubArea.filter(
          (s) =>
            s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1 &&
            idSubArea.includes(s.idSubArea)
        );
      } else {
        this.listaPgeneralModal = this.listaCombosModal.pGeneralSubArea.filter(
          (x) => idSubArea.includes(x.idSubArea)
        );
      }
    }
  }
}

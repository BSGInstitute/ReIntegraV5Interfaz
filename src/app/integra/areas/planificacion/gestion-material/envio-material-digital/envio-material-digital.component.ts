import { AlertaService } from '@shared/services/alerta.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  CombosModulo,
  MaterialPEspecifico,
  ProgramaEspecificoCurso,
} from '@planificacion/models/interfaces/materialPEspecifico';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { constApiPlanificacion } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AreaCapacitacion, IEnvioMaterial, ProgramaEspecifico, ProgramaGeneralP, SubAreaCapacitacion } from '@planificacion/models/interfaces/enviomaterial';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

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

/**
 * @module PlanificacionModule
 * @description Componente del Módulo Envio Materia Digital
 * @author Margiory Ramirez
 * @version 1.0.0
 * @history
   18/10/2023 Implementacion del Módulo  Módulo Envio Materia Digital
   18/10/2023 Creacion de Grilla
 */
@Component({
  selector: 'app-envio-material-digital',
  templateUrl: './envio-material-digital.component.html',
  styleUrls: ['./envio-material-digital.component.scss'],
})
export class EnvioMaterialDigitalComponent implements OnInit {
  @ViewChild('modalEnvioMaterial') modalEnvioMaterial: any;

  constructor(
    private integraService: IntegraService,
    private AlertaService: AlertaService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private changeDetectorRef: ChangeDetectorRef
  ) {}
  dataArea: AreaCapacitacion[];
  dataSubArea: SubAreaCapacitacion[];
  dataProgramaGeneral: ProgramaGeneralP[];
  dataProgramaEspecifico: ProgramaEspecifico[];
  dataPEspecificoCurso: ProgramaEspecificoCurso[];
  dataGrupo: IComboBase1[];
  dataEstadoPEspecifico: IComboBase1[];
  dataCiudadBS: IComboBase1[];
  dataModalidad: IComboBase1[];
  dataListaMaterialTipo: IComboBase1[];
  dataListaMaterialVersion: IComboBase1[];
  dataMaterialEstado: IComboBase1[];

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
  dataItem1: any;

  // Variable Globales
  gridGestionarEnvioMateriales = new KendoGrid();
  gridDetalleEnvioMateriales: KendoGrid = new KendoGrid();
  btnBuscarDisabled: boolean = false;
  isDisabledSubArea = true;
  isDisabledPGeneral = true;
  isDisabledPEspecifico = true;
  isDisabledPEspecificoCurso = true;

  prueba: any;
  prueba2: any;
  //disabledEnviarCorreo = false;

  subAreasCapacitacion: SubAreaCapacitacion[] = [];
  programasGeneralP: ProgramaGeneralP[] = [];
  programasEspecifico: ProgramaEspecifico[] = [];
  programaEspecificoCurso: ProgramaEspecificoCurso[] = [];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  loaderModal: boolean = false;
  loaderGeneral = false;
  modalRef: any;
  BtnBool = true;
  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  tipoOrientacion: IComboBase1[] = [
    { id: 1, nombre: 'Horizontal' },
    { id: 2, nombre: 'Vertical' },
  ];
  mySelection: number[];

  private get dataFormFiltro(): IFormFiltro {
    return this.formFiltro.getRawValue() as IFormFiltro;
  }

  ngOnInit(): void {
    this.gridGestionarEnvioMateriales.gridState.skip = 0;
    this.gridGestionarEnvioMateriales.gridState.take = 15;
    this.obtenerCombosModulo();
    this.gridDetalleEnvioMateriales.gridState.skip = 0;
    this.gridDetalleEnvioMateriales.gridState.take = 15;

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
          this.dataListaMaterialTipo = resp.body.listaMaterialTipo;
          this.dataListaMaterialVersion = resp.body.listaMaterialVersion;
          this.dataMaterialEstado = resp.body.listaMaterialEstado;
          this.formFiltro.get('idsEstadosMateriales').setValue([3]);
          this.generarReporte();
        },
        error: (error) => {
          let mensaje = this.AlertaService.getMessageErrorService(error);
          if (mensaje) this.AlertaService.notificationWarning(mensaje);
        },
      });
  }
  generarReporte() {
    this.gridGestionarEnvioMateriales.loading = true;
    this.btnBuscarDisabled = true;
    const dataForm: IFormFiltro = this.formFiltro.getRawValue();
    this.gridGestionarEnvioMateriales.gridState.skip = 0;
    const filtro = {
      idsAreas: dataForm.idsAreas,
      idsSubAreas: dataForm.idsSubAreas,
      idsProgramasGenerales: dataForm.idsProgramasGenerales,
      idsProgramasEspecificoPadreIndividual:
        dataForm.idsProgramasEspecificoPadreIndividual,
      idsProgramasEspecificoCurso: dataForm.idsProgramasEspecificoCurso,
      idsGrupos: dataForm.idsGrupos,
      idsEstadosPEspecifico: dataForm.idsEstadosPEspecifico,
      idsCiudades: dataForm.idsCiudades,
      idsModalidades: dataForm.idsModalidades,
      idsEstadosMateriales: dataForm.idsEstadosMateriales,
    };

    this.integraService
      .postJsonResponse(
        constApiPlanificacion.GestionMaterialObtenerMaterialesGestionEnvio,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<MaterialPEspecifico[]>) => {
          console.log(resp.body);
          this.gridGestionarEnvioMateriales.data = resp.body;

          this.gridGestionarEnvioMateriales.loadView();
          this.gridGestionarEnvioMateriales.loading = false;
          this.btnBuscarDisabled = false;
          if (resp.body.length)
            this.AlertaService.notificationSuccessBotom(
              'Reporte generado exitosamente.'
            );
          else
            this.AlertaService.notificationSuccessBotom('Reporte sin datos.');
        },
        error: (error) => {
          this.btnBuscarDisabled = false;
          this.gridGestionarEnvioMateriales.loading = false;
          let mensaje = this.AlertaService.getMessageErrorService(error);
          if (mensaje) this.AlertaService.notificationWarning(mensaje);
        },
      });
  }
  cargarSubAreas(idsArea: number[]) {
    console.log('idsArea', idsArea);
    if (idsArea.length > 0) {
      this.isDisabledSubArea = false;
      this.subAreasCapacitacion = this.dataSubArea.filter((x) =>
        idsArea.includes(x.idAreaCapacitacion)
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
    console.log('idsSubAreas', idsSubAreas);
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
    console.log('idsPgeneral', idsPgeneral);
    if (idsPgeneral.length > 0) {
      this.isDisabledPEspecifico = false;
      this.programasEspecifico = this.dataProgramaEspecifico.filter((x) =>
        idsPgeneral.includes(x.idProgramaGeneral)
      );
      let filtro =
        this.dataFormFiltro.idsProgramasEspecificoPadreIndividual.filter((e) =>
          this.programasEspecifico.map((x) => x.id).includes(e)
        );
      this.formFiltro
        .get('idsProgramasEspecificoPadreIndividual')
        .setValue(filtro);
      this.cargarPEspecificoCurso(filtro);
    } else {
      this.isDisabledPEspecifico = true;
      this.programasEspecifico = [];
      this.formFiltro.get('idsProgramasEspecificoPadreIndividual').setValue([]);
      this.cargarPEspecificoCurso([]);
    }
  }
  cargarPEspecificoCurso(idsPespecificos: number[]) {
    console.log('idsPespecificos', idsPespecificos);
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

  calcularTieneFurAsociado(dataItem: any) {
    if (dataItem.IdMaterialVersion == 2) {
      if (!dataItem.TieneFurAsociado) {
        return 'No';
      } else {
        return 'Si';
      }
    } else {
      return 'No aplica';
    }
  }

  generarDetalleEnvioMaterial(idMaterialPEspecifico: number) {
    this.loaderGeneral = true;

    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.GestionMaterialObtenerMaterialesAlumnoDigital}/${idMaterialPEspecifico}`
      )
      .subscribe({
        next: (response: HttpResponse<IEnvioMaterial[]>) => {
          console.log(response.body);
          response.body.forEach((element) => {
            element.estado = false;
          });

          this.gridDetalleEnvioMateriales.data = response.body;
          this.gridDetalleEnvioMateriales.loadView();
          this.gridDetalleEnvioMateriales.loading = false;

          this.loaderGeneral = false;
        },
        error: (error) => {
          this.loaderGeneral = false;
          this.AlertaService.notificationError(error.error);
        },
        complete: () => {},
      });

    //this.disabledEnviarCorreo = true;
  }

  abrirModalDetalleEnvioMaterial(dataItem: any) {
    console.log('dataItem abrirModalDetalleEnvioMaterial', dataItem);
    this.loaderModal = false;
    this.selectAll= false;
    this.cantidad=0;

    this.modalRef = this.modalService.open(this.modalEnvioMaterial, {
      backdrop: 'static',
      size: 'xl',
    });
    this.generarDetalleEnvioMaterial(dataItem.idMaterialPEspecifico);
  }

  obtenerNombreTipo(idTipo: number) {
    let item = this.dataListaMaterialTipo.find((x) => x.id == idTipo);

    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }
  obtenerNombreVersion(idMaterialVersion: number) {
    let item = this.dataListaMaterialVersion.find(
      (x) => x.id == idMaterialVersion
    );

    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }
  obtenerNombreEstado(idMaterialEstado: number) {
    let item = this.dataMaterialEstado.find((x) => x.id == idMaterialEstado);
    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }

  limpiarSeleccion(filter: CompositeFilterDescriptor) {
    this.mySelection = [];
    this.ControlarBotones();
  }
  ControlarBotones() {
    if (this.mySelection.length > 0) {
      this.BtnBool = false;
    } else this.BtnBool = true;
  }

  enviarMaterialDigitales() {
    this.gridDetalleEnvioMateriales.loading = true;
    // this.toggle();
    console.log(this.jsonIds);
    console.log('entro');
    // this.integraService;
    this.integraService
      .postJsonResponse(
        constApiPlanificacion.GestionMaterialNotificarListaMaterialVersionAlumnoPorCorreo,
        this.jsonIds
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log(response);
          this.gridDetalleEnvioMateriales.loading = false;

          Swal.fire(
            '¡Enviado!',
            'Material Digital Enviado Correctamente.',
            'success'
          );


          this.generarReporte();
          console.log(response.body);

          this.modalRef.close();


        },
        error: (error) => {
          this.gridDetalleEnvioMateriales.loading = false;
          let mensaje = this.AlertaService.getMessageErrorService(error);
          this.AlertaService.notificationWarning(`Surgio un error: ${error}`);

        },
      });
  }
  seleccionarTodo = false;
  jsonIds: any = [];


  enviarMaterialFisicoProveedorImpresion(idMaterialPEspecifico?: number) {
    //console.log(dataItem);
    this.gridGestionarEnvioMateriales.loading = true;
    this.integraService
      .postJsonResponse(
        `${constApiPlanificacion.GestionMaterialNotificarMaterialVersionAlumnoImpresoPorCorreoAProveedor}/${idMaterialPEspecifico}`,
        null
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log(response.body);
          Swal.fire(
            '¡Enviado!',
            'Material  Fisico Proveedor Enviado  Correctamente.',
            'success'
          );

          this.gridGestionarEnvioMateriales.loading = false;
          this.generarReporte();
          this.AlertaService.notificationSuccessBotom(
            'Material fisico proveedor enviado Correctamente.'
          );
          this.modalRef.close();
        },
        error: (error) => {
          this.gridGestionarEnvioMateriales.loading = false;
          let mensaje = this.AlertaService.getMessageErrorService(error);
          this.AlertaService.notificationWarning(`Surgio un error: ${error}`);
        },
      });
  }
  encotrarId(data: any): boolean {
    return data.listaMaterialAccion.find((x: any) => x.id == 1);
  }
  encortrarIdDes(data: any): boolean {
    return (
      data.listaMaterialAccion.find((x: any) => x.Id == 2) &&
      data.dataItem.idMaterialVersion == 2
    );
  }
  cambioSeleccion(E: any) {
    console.log(this.seleccionarTodo);

    console.log(this.prueba);
    console.log(this.prueba2);
    console.log(E);
    this.gridDetalleEnvioMateriales.data.forEach((element) => {
      element.estado = this.seleccionarTodo;
    });
  }

  //Nueva seleccion

  selectAll = false;
  cantidad =0;

  cambioSeleccion2(dataItem: any) {
    console.log(this.gridDetalleEnvioMateriales.data)

    this.cantidad= 0;
    this.gridDetalleEnvioMateriales.data.forEach(element => {
      if (element.isSelected) {
        this.cantidad ++;
      }
    });
    if (dataItem.isSelected) {
      if (!this.jsonIds.includes(dataItem.id)) {
        this.jsonIds.push(dataItem.id);
      }
    } else {

      this.jsonIds = this.jsonIds.filter((id:any) => id !== dataItem.id);
    }
    this.selectAll = this.gridDetalleEnvioMateriales.data.every(item => item.isSelected);
    console.log(this.jsonIds)
    this.changeDetectorRef.detectChanges();
  }

  seleccionarTodo2() {

    this.gridDetalleEnvioMateriales.data.forEach(item => (item.isSelected = this.selectAll));
    this.jsonIds = this.gridDetalleEnvioMateriales.data
      .filter(item => item.isSelected)
      .map(item => item.id);
    console.log('IDs seleccionados:', this.jsonIds);
    this.changeDetectorRef.detectChanges();
    this.cantidad= 0;
    this.gridDetalleEnvioMateriales.data.forEach(element => {
      if (element.isSelected) {
        this.cantidad ++;
      }
    });


  }


}

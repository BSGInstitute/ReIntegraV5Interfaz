import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { constApiPlanificacion } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { SortDescriptor } from '@progress/kendo-data-query';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { ProgramaEspecifico } from '@planificacion/models/interfaces/pespecifico';
import { DropDownFilterSettings, VirtualizationSettings } from '@progress/kendo-angular-dropdowns';
import { SelectEvent } from '@progress/kendo-angular-upload';
import { ExcelExportData } from '@progress/kendo-angular-excel-export';
import Swal from 'sweetalert2';

export interface ICrucigramaAulaVirtual {
  id: number
  codigoCrucigrama: string
  idPgeneral: number
  idPespecifico: number
  pGeneral?: string
  idCapitulo: number
  idSesion: number
  idTipoMarcador: number
  valorMarcador: number
  cantidadFila: number
  cantidadColumna: number
}
export interface ICrucigramaRespuesta {
  id: number
  numeroPalabra: number
  palabra: string
  definicion: string
  tipo: number
  columnaInicio: number
  filaInicio: number
}
export interface IExportarExcelCrucigrama {
  id: number
  idPGeneral: number
  idPEspecifico: number
  ordenFilaCapitulo: number
  sesion: string
  subSesion: string
  idTipoMarcador: number
  valorMarcador: number
  codigoCrucigrama: string
  cantidadFila: number
  cantidadColumna: number
  columnaInicio: number
  filaInicio: number
  numeroPalabra: number
  tipo: number
  definicion: string
  palabra: string
}
export interface ICrucigramaEnvio {
  crucigrama: ICrucigramaAulaVirtual
  crucigramaDetalle: ICrucigramaRespuesta[] 
}
export interface IComboModulo {
  listaPgeneral: IComboBase1[]
  listaTipoMarcador: IComboBase1[]
  listaPespecifico: ProgramaEspecifico[]
}
interface CapituloSesionesPgeneral {
  idPGeneral: number;
  idCapituloProgramaCapacitacion: number;
  capituloProgramaCapacitacion: string;
  listaSesionesProgramaCapacitacion: SesionProgramaCapacitacion[];
}
interface SesionProgramaCapacitacion {
  idSesionProgramaCapacitacion: number;
  sesionProgramaCapacitacion: string;
  listaSubSeccionProgramaCapacitacion?: SubsesionProgramaCapacitacion[];
}
interface SubsesionProgramaCapacitacion {
  idSesionProgramaCapacitacion: number;
  subSeccionProgramaCapacitacion: string;
}

/**
 * @module PlanificacionModule
 * @description Componente del Módulo Revisar y Aprobar Material por Programa Específico
 * @author Jonathan Raúl Caipo Huacasi
 * @version 1.0.0
 * @history
   08/09/2023 Implementacion del Módulo Revisar y Aprobar Material por Pograma Específico
   08/09/2023 Creacion de Grilla
 */
@Component({
  selector: 'app-crucigrama-aula-virtual',
  templateUrl: './crucigrama-aula-virtual.component.html',
  styleUrls: ['./crucigrama-aula-virtual.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CrucigramaAulaVirtualComponent implements OnInit {
  constructor(
    private integraService: IntegraService, 
    private alertaService: AlertaService,
    private modalService: NgbModal, 
    private formBuilder: FormBuilder,
    private cd :ChangeDetectorRef
  ) { 
    this.allData = this.allData.bind(this);
  }

  private listaProgramaEspecifico: ProgramaEspecifico[] = []

  dataPGeneral: IComboBase1[]
  dataTipoMarcador: IComboBase1[]
  dataPEspecifico: ProgramaEspecifico[]

  // Variable Globales
  gridCrucigramaAulaVirtual = new KendoGrid();
  gridRespuestaCrucigrama = new KendoGrid();
  archivoImportado = new FormControl(null);
  modalRef: NgbModalRef = null; 
  loaderModal: boolean = false; 
  esNuevo: boolean = false;
  listaExportarExcel: IExportarExcelCrucigrama[] = [];
  btnNuevoActualizarCrucigramaDisabled: boolean = false;
  listaSeleccion: number[] = [];
  listaCapituloSesion: CapituloSesionesPgeneral[] = [];
  listaSesion: SesionProgramaCapacitacion[] = [];
  listaSubSesion: SubsesionProgramaCapacitacion[] = [];
  comboTipo: IComboBase1[] = [];
  dataTemp1: ICrucigramaAulaVirtual;
  modalTem1: any;
  idSesionTemp: number = 0;
  data: any;

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

  formDatosCrucigrama: FormGroup = this.formBuilder.group({
    //TAB - PROGRAMA CAPACITACIÓN
    id: 0,
    pGeneral: [0, [Validators.required]], 
    programaEspecifico: [0, [Validators.required]],
    capitulo: [0, [Validators.required]],
    sesion: [0, [Validators.required]],
    subsesion: 0,
    tipoMarcador: [0, [Validators.required]],
    valorMarcador: [0, [Validators.required]],
    //TAB - CRUCIGRAMA
    codigoCrucigrama: ['', [Validators.required]],
    nroFilas: [0, [Validators.required]],
    nroColumnas: [0, [Validators.required]],
  });

  formRespuestaCrucigrama: FormGroup = this.formBuilder.group({ 
    id: 0,
    numeroPalabra: 0, 
    palabra: [[]],
    definicion: [[]],
    tipo: 0,
    columnaInicio: 0,
    filaInicio: 0,
  });

  virtual: VirtualizationSettings = { 
    itemHeight: 28, 
  };

  tipoOrientacion: IComboBase1[] = [
    { id: 1, nombre: "Horizontal" },
    { id: 2, nombre: "Vertical" } 
  ];

  arrayColumnas: {
    field: string,
    title: string
  }[]= [];

  sort: SortDescriptor[] = [
    {
      field: "id",
      dir: "desc",
    },
  ];

  listaExportar:any[]=[]

  ngOnInit(): void {
    this.obtenerCombos();
    this.generarReporte();
    this.configurarGridConsultasForo();
    this.obtenerReporteCrucigramasExportacionExcel()
  }

  obtenerCombos() {
    this.gridCrucigramaAulaVirtual.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.CrucigramaProgramaCapacitacionObtenerCombos}`
      )
      .subscribe({
        next: (resp: HttpResponse<IComboModulo>) => {
          this.gridCrucigramaAulaVirtual.loading = false;
          this.dataPGeneral = resp.body.listaPgeneral;
          this.listaProgramaEspecifico = resp.body.listaPespecifico;
          this.dataTipoMarcador = resp.body.listaTipoMarcador;
        },
        error: (error) => {
          this.gridCrucigramaAulaVirtual.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  generarReporte() {
    this.gridCrucigramaAulaVirtual.data = [];
    this.gridCrucigramaAulaVirtual.loading = true;
    this.integraService
    .getJsonResponse(constApiPlanificacion.CrucigramaProgramaCapacitacionObtenerCrucigramas)
    .subscribe({
      next: (resp: HttpResponse<ICrucigramaAulaVirtual[]>) => {
          console.log(resp.body);
          this.gridCrucigramaAulaVirtual.loading = false;
          this.gridCrucigramaAulaVirtual.data = resp.body;
          if (resp.body.length)
            this.alertaService.notificationSuccessBotom("Crucigramas generado exitosamente.");
          else
            this.alertaService.notificationSuccessBotom("Sin datos.");
        },
        error: (error) => {
          console.log(error);
          this.gridCrucigramaAulaVirtual.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        }
      });
  }

  obtenerReporteCrucigramasExportacionExcel() {
    this.gridCrucigramaAulaVirtual.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.CrucigramaProgramaCapacitacionObtenerReporteCrucigramasExportacionExcel}`
      )
      .subscribe({
        next: (resp: HttpResponse<IExportarExcelCrucigrama[]>) => {
          this.gridCrucigramaAulaVirtual.loading = false;
          this.listaExportarExcel = resp.body;
        },
        error: (error) => {
          this.gridCrucigramaAulaVirtual.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerCapituloSesiones(idPGeneral: number, tipo?: boolean) {
    this.gridCrucigramaAulaVirtual.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.MaestroPreguntaProgramaCapacitacionObtenerCapituloSesionesPGeneral}/${idPGeneral}`
      )
      .subscribe({
        next: (response: HttpResponse<CapituloSesionesPgeneral[]>) => {
          this.gridCrucigramaAulaVirtual.loading = false;
          this.listaCapituloSesion = response.body;
          this.data = response.body;
          if(tipo === true){
            this.formDatosCrucigrama.get('programaEspecifico').setValue(this.dataTemp1.idPespecifico);
            this.cargarSesiones(this.dataTemp1.idCapitulo)
            this.formDatosCrucigrama.get('capitulo').setValue(this.dataTemp1.idCapitulo);
      
            this.formDatosCrucigrama.get('sesion').setValue(this.dataTemp1.idSesion);
            this.cargarSubsesiones(this.dataTemp1.idSesion)


            // var elementoEspecifico = null;
            // this.listaSubSesion.forEach((subSeccion) => {
            //   if (subSeccion.idSesionProgramaCapacitacion != null) {
            //     elementoEspecifico = subSeccion;
            //     this.idSesionTemp = elementoEspecifico.idSesionProgramaCapacitacion

            //   }
            // });    

            // console.log("elementoEspecifico", elementoEspecifico)
            // console.log("this.listaSubSesion.length", this.listaSubSesion.length)
            // console.log("this.listaSubSesion", this.listaSubSesion)

            this.formDatosCrucigrama.get('subsesion').setValue(this.listaSubSesion.length > 0 ? this.listaSubSesion[0].idSesionProgramaCapacitacion : null);
      
            this.formDatosCrucigrama.get('tipoMarcador').setValue(this.dataTemp1.idTipoMarcador);
            this.formDatosCrucigrama.get('valorMarcador').setValue(this.dataTemp1.valorMarcador);
            
            this.formDatosCrucigrama.get('codigoCrucigrama').setValue(this.dataTemp1.codigoCrucigrama);
            this.formDatosCrucigrama.get('nroFilas').setValue(this.dataTemp1.cantidadFila);
            this.formDatosCrucigrama.get('nroColumnas').setValue(this.dataTemp1.cantidadColumna);
            this.modalRef = this.modalService.open(this.modalTem1, { size: 'lg', backdrop: 'static' });
          }
          console.log(response.body);
        },
        error: (error) => {
          this.gridCrucigramaAulaVirtual.loading = false;
          this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(`Surgio un error: ${error}`);
        },
      });
  }

  obtenerRespuestasCrucigrama(id: number) {
    this.gridRespuestaCrucigrama.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.CrucigramaProgramaCapacitacionObtenerRespuestasCrucigrama}/${id}`
      )
      .subscribe({
        next: (response: HttpResponse<ICrucigramaRespuesta[]>) => {
          this.gridRespuestaCrucigrama.loading = false;
          console.log("RESPUESTA CRUCIGRAMA", response.body);
          this.gridRespuestaCrucigrama.data = response.body;
        },
        error: (error) => {
          this.gridRespuestaCrucigrama.loading = false;
          this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(`Surgio un error: ${error}`);
        },
      });
  }

  obtenerRespuestasCrucigramaExcel(id: number) {
    this.gridRespuestaCrucigrama.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.CrucigramaProgramaCapacitacionObtenerRespuestasCrucigrama}/${id}`
      )
      .subscribe({
        next: (response: HttpResponse<ICrucigramaRespuesta[]>) => {
          this.gridRespuestaCrucigrama.loading = false;
          return response.body
        },
        error: (error) => {
          this.gridRespuestaCrucigrama.loading = false;
          this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(`Surgio un error: ${error}`);
        },
      });
  }

  insertarCrucigrama() {
    this.btnNuevoActualizarCrucigramaDisabled = true;
    if (this.formDatosCrucigrama.valid) {
      let data = this.objetoEnviar();
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.CrucigramaProgramaCapacitacionInsertarCrucigrama,
          JSON.stringify(data)
        )
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            this.btnNuevoActualizarCrucigramaDisabled = false;
            this.loaderModal = false;
            Swal.fire(
              '¡Creado!',
              'El crucigrama ha sido creado correctamente.',
              'success'
            );
            this.generarReporte();
            this.modalRef.close();
          },
          error: (e) => {
            this.btnNuevoActualizarCrucigramaDisabled = false;
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          },
        });
    }
  }

  actualizarCrucigrama() {
    this.btnNuevoActualizarCrucigramaDisabled = true;
    if (this.formDatosCrucigrama.valid) {
      let data = this.objetoEnviar();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.CrucigramaProgramaCapacitacionActualizarCrucigrama,
          JSON.stringify(data)
        )
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            this.btnNuevoActualizarCrucigramaDisabled = false;
            this.loaderModal = false;
            Swal.fire(
              '¡Actualizado!',
              'El crucigrama ha sido modificado correctamente.',
              'success'
            );
            this.generarReporte();
            this.modalRef.close();
          },
          error: (e) => {
            this.btnNuevoActualizarCrucigramaDisabled = false;
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          },
        });
    }
  }

  eliminarCrucigrama(dataItem: ICrucigramaAulaVirtual) {
    console.log("DataItem", dataItem)
    this.gridCrucigramaAulaVirtual.loading = true;
    this.alertaService.swalFireOptions({
      title: '¿Está seguro de Eliminar Crucigrama?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .deleteJsonResponse(
            `${constApiPlanificacion.CrucigramaProgramaCapacitacionEliminarCrucigrama}/${dataItem.id}`
          )
          .subscribe({
            next: (response: HttpResponse<Boolean[]>) => {
              console.log(response.body);
              this.gridCrucigramaAulaVirtual.loading = false;
              Swal.fire(
                '¡Eliminado!',
                'Crucigrama eliminado correctamente.',
                'success' 
              );
              this.generarReporte();
            },
            error: (error) => {
              this.gridCrucigramaAulaVirtual.loading = false;
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje); 
            },
          });
      }
    });
  }

  eliminarCrucigramaSeleccionados() {
    if(this.listaSeleccion.length > 0) {
      this.gridCrucigramaAulaVirtual.loading = true;
      this.alertaService.swalFireOptions({
        title: '¿Seguro de eliminar crucigrama(s) seleccionado(s)?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          this.integraService
            .deleteJsonResponse(
              constApiPlanificacion.CrucigramaProgramaCapacitacionEliminarCrucigramasSeleccionados,
              JSON.stringify(this.listaSeleccion)
            )
            .subscribe({
              next: (response: HttpResponse<Boolean[]>) => {
                console.log(response.body);
                this.gridCrucigramaAulaVirtual.loading = false;
                Swal.fire(
                  '¡Eliminado(s)!',
                  'Crucigrama(s) eliminado(s) correctamente.',
                  'success' 
                );
                this.generarReporte();
              },
              error: (error) => {
                this.gridCrucigramaAulaVirtual.loading = false;
                let mensaje = this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje); 
              },
            });
        }
      });
    } else {
      Swal.fire('¡Sin selección!', 'Debe seleccionar alguna(s) casilla(s) para eliminar.', 'info')
    }
  }

  importarExcel() {
    // this.gridCrucigramaAulaVirtual.gridState.skip = 0;
    this.loaderModal = true;
    var dataFile = new FormData();
    let archivo: File = this.archivoImportado.value.files[0].rawFile;
    dataFile.append('files', archivo)
    this.loaderModal = true;
    this.integraService
      .insertarFormData2(
        constApiPlanificacion.CrucigramaProgramaCapacitacionImportarExcel,
        dataFile
      )
      .subscribe({ 
        next: (response: HttpResponse<boolean>) => {
          this.loaderModal = false;
          Swal.fire(
            '¡Importado!',
            'Crucigrama(s) subido(s) correctamente.',
            'success' 
          );
          this.modalRef.close();
          this.generarReporte();
        },
        error: (error) => {
          this.loaderModal = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  calcularColumnaPreguntas(data: IExportarExcelCrucigrama[]){
    this.arrayColumnas = []
    this.arrayColumnas.push({
      field: 'idPGeneral',
      title: 'IdPGeneral'
    })
    this.arrayColumnas.push({
      field: 'idPEspecifico',
      title: 'IdPEspecifico'
    })
    this.arrayColumnas.push({
      field: 'ordenFilaCapitulo',
      title: 'OrdenFilaCapitulo'
    })
    this.arrayColumnas.push({
      field: 'sesion',
      title: 'Sesion'
    })
    this.arrayColumnas.push({
      field: 'subSesion',
      title: 'SubSesion'
    })
    this.arrayColumnas.push({
      field: 'idTipoMarcador',
      title: 'IdTipoMarcador'
    })
    this.arrayColumnas.push({
      field: 'valorMarcador',
      title: 'ValorMarcador'
    })
    this.arrayColumnas.push({
      field: 'codigoCrucigrama',
      title: 'CodigoCrucigrama'
    })
    this.arrayColumnas.push({
      field: 'cantidadFila',
      title: 'CantidadFila'
    })
    this.arrayColumnas.push({
      field: 'cantidadColumna',
      title: 'CantidadColumna'
    })
    this.arrayColumnas.push({
      field: 'columnaInicio',
      title: 'ColumnaInicio'
    })
    this.arrayColumnas.push({
      field: 'filaInicio',
      title: 'FilaInicio'
    })
    this.arrayColumnas.push({
      field: 'numeroPalabra',
      title: 'NumeroPalabra'
    })
    this.arrayColumnas.push({
      field: 'tipo',
      title: 'Tipo'
    })
    this.arrayColumnas.push({
      field: 'definicion',
      title: 'Definicion'
    })
    this.arrayColumnas.push({
      field: 'palabra',
      title: 'Palabra'
    })
  }

  crearDataParaExcel(){
    this.data = [];
    this.gridCrucigramaAulaVirtual.data.forEach((x: IExportarExcelCrucigrama) => {
      let obj: any = {}
      obj.idPGeneral = x.idPGeneral;
      obj.idPEspecifico = x.idPEspecifico;
      obj.ordenFilaCapitulo = x.ordenFilaCapitulo;
      obj.sesion = x.sesion;
      obj.subSesion = x.subSesion;
      obj.idTipoMarcador = x.idTipoMarcador;
      obj.valorMarcador = x.valorMarcador;
      obj.codigoCrucigrama = x.codigoCrucigrama;
      obj.cantidadFila = x.cantidadFila;
      obj.cantidadColumna = x.cantidadColumna;
      obj.columnaInicio = x.columnaInicio;
      obj.filaInicio = x.filaInicio;
      obj.numeroPalabra = x.numeroPalabra;
      obj.tipo = x.tipo;
      obj.definicion = x.definicion;
      obj.palabra = x.palabra;
      
      this.data.push(obj);
    })
  }
 
  allData(): ExcelExportData {
    this.crearDataParaExcel();
    const result: ExcelExportData = {
      data: this.data,
    };
    return result;
  }

  //ABRIR MODALES
  
  abrirModalImportarExcel(modal: any) {
    this.modalRef = this.modalService.open(modal, { size: 'm', backdrop: 'static' });
  }

  abrirModalNuevoEditarCrucigrama(modal: any, dataItem?: ICrucigramaAulaVirtual) {
    this.formDatosCrucigrama.setValue({
      //TAB - PROGRAMA DE CAPACITACIÓN
      id: 0,
      pGeneral: null, 
      programaEspecifico: null,
      capitulo: null,
      sesion: null,
      subsesion: null,
      tipoMarcador: null,
      valorMarcador: 0,
      //TAB - CRUCIGRAMA
      codigoCrucigrama: null,
      nroFilas: 0,
      nroColumnas: 0,
    });

    if(dataItem != null) {
      //ACTUALIZAR
      this.esNuevo = false;
      this.obtenerRespuestasCrucigrama(dataItem.id);
      this.formDatosCrucigrama.get('id').setValue(dataItem.id);
      this.formDatosCrucigrama.get('pGeneral').setValue(dataItem.idPgeneral);
      this.dataTemp1 = dataItem;
      this.modalTem1 = modal;
      this.cargarPEspecifico(dataItem.idPgeneral,true);
    } else {
      //NUEVO
      this.formDatosCrucigrama.reset();
      this.esNuevo = true;
      this.gridRespuestaCrucigrama.data = [];
      this.modalRef = this.modalService.open(modal, { size: 'lg', backdrop: 'static' });

    }
    console.log("FROM",this.formDatosCrucigrama.getRawValue())

  }

  //OTROS
  
  objetoEnviar() {
    let dataFrom = this.formDatosCrucigrama.getRawValue();
    let idSesionTemp = dataFrom.sesion
    console.log("IDSESIONTEMP",idSesionTemp)
    let idSubSeccionTemporal = dataFrom.subsesion
    console.log("IDSUBSESIONTEMP",idSubSeccionTemporal)
    if (idSubSeccionTemporal > 0 && idSubSeccionTemporal != undefined) {
      idSesionTemp = idSubSeccionTemporal
    }
    let objCrucigrama: ICrucigramaAulaVirtual = {
      id: this.esNuevo ? 0 : dataFrom.id,
      idPgeneral: dataFrom.pGeneral,
      idPespecifico: dataFrom.programaEspecifico,
      idCapitulo: dataFrom.capitulo,
      idSesion: idSesionTemp,
      idTipoMarcador: dataFrom.tipoMarcador,
      valorMarcador: dataFrom.valorMarcador,
      
      codigoCrucigrama: dataFrom.codigoCrucigrama,
      cantidadFila: dataFrom.nroFilas,
      cantidadColumna: dataFrom.nroColumnas,
    }

    let envio: ICrucigramaEnvio = {
      crucigrama: objCrucigrama,
      crucigramaDetalle: this.gridRespuestaCrucigrama.data
    }
    console.log(envio);
    return envio
  }

  configurarGridConsultasForo() {
    this.gridRespuestaCrucigrama.habilitarEstadoNewRow = true;
    this.gridRespuestaCrucigrama.formGroup = this.formBuilder.group({
      id: 0,
      numeroPalabra: 0,
      palabra: '',
      definicion: '',
      tipo: null,
      columnaInicio: 0,
      filaInicio: 0,
    });
    this.gridRespuestaCrucigrama.cellClickEvent$.subscribe((resp) => {});
    this.gridRespuestaCrucigrama.cellCloseEvent$.subscribe((resp) => {
      resp.dataItem[resp.columnField] = resp.formGroup.get(
        resp.columnField
      ).value;
    });
    this.gridRespuestaCrucigrama.removeEvent$.subscribe((resp) => {
      this.alertaService.mensajeEliminar().then((result) => {
        if (result.isConfirmed) {
          this.gridRespuestaCrucigrama.data.splice(resp.index, 1);
          this.gridRespuestaCrucigrama.data = [...this.gridRespuestaCrucigrama.data];
        }
      });
    });
    this.gridRespuestaCrucigrama.saveEvent$.subscribe((resp) => {
      let valorForm = resp.formGroup.getRawValue() as ICrucigramaRespuesta;
      let item: ICrucigramaRespuesta = {
        id: 0,
        numeroPalabra: valorForm.numeroPalabra,
        palabra: valorForm.palabra,
        definicion: valorForm.definicion,
        tipo: valorForm.tipo,
        columnaInicio: valorForm.columnaInicio,
        filaInicio: valorForm.filaInicio,
      };
      this.gridRespuestaCrucigrama.data = [item, ...this.gridRespuestaCrucigrama.data];
    });
  }

  obtenerNombreTipo(idTipo: number) {
    let item = this.tipoOrientacion.find((x) => x.id == idTipo);
    if (item != null) {
      return item.nombre;
    } else {
      return null;
    }
  }

  seleccionarAlmacenarArchivo(dataFile: SelectEvent) {
    this.archivoImportado.setValue(dataFile)
  }

  deseleccionarAlmacenarArchivo() {
    this.archivoImportado.setValue(null);
  }

  //FILTRO CASCADA
  
  cargarPEspecifico(idPGeneral: number,tipo?:boolean) {
    let idPGeneralAnt = idPGeneral
    console.log("idPGeneral", idPGeneral)
    this.formDatosCrucigrama.get('programaEspecifico').setValue(null)
    if (idPGeneral == null) {
      this.dataPEspecifico = [];
      this.listaCapituloSesion = [];
      this.listaSesion = [];
      this.listaSubSesion = [];
    }
    else {
      this.obtenerCapituloSesiones(idPGeneral,tipo);
      this.formDatosCrucigrama.get('programaEspecifico').enable()
      this.dataPEspecifico = this.listaProgramaEspecifico.filter(
        (s) => s.idProgramaGeneral === idPGeneral
      );
    }
    this.formDatosCrucigrama.get('programaEspecifico').reset()
      this.formDatosCrucigrama.get('capitulo').reset()
      this.formDatosCrucigrama.get('sesion').reset()
      this.formDatosCrucigrama.get('subsesion').reset()
  }
  
  cargarSesiones(idCapitulo: number) {
    if(idCapitulo == null) {
      this.listaSesion = [];
      this.formDatosCrucigrama.get('sesion').reset()
      this.formDatosCrucigrama.get('subsesion').reset()
    }
    else {
      this.listaSesion = this.listaCapituloSesion.find(
        (e) => e.idCapituloProgramaCapacitacion === idCapitulo).listaSesionesProgramaCapacitacion;
    }
  }
  
  cargarSubsesiones(idSesion: number) {
    if(idSesion == null) {
      this.listaSubSesion = [];
      this.formDatosCrucigrama.get('subsesion').reset()
    }
    else {
      let prub = this.listaSesion.find(
        (e) => e.idSesionProgramaCapacitacion === idSesion)
      if (prub == undefined) {
        this.listaSesion = []
      } else {
        this.listaSubSesion = this.listaSesion.find(
          (e) => e.idSesionProgramaCapacitacion === idSesion).listaSubSeccionProgramaCapacitacion;
      }
    }
  }

  crearExcelExport(excel: any){
    if(this.listaSeleccion.length > 0) {
      let dataSelect = this.listaExportarExcel.filter((e)=>
        this.listaSeleccion.includes(e.id)
      )
      excel.data = dataSelect;
      excel.save();
    } else {
      this.alertaService.swalFireOptions({
        title: 'No se ha seleccionado ningun registro',
        text: '¿Deseas exportar todos los registros?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          excel.data = this.listaExportarExcel;
          excel.save();
        }
      });    
    }
  }
}

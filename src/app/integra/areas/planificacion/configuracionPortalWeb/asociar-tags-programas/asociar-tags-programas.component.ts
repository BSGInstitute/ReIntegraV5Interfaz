import { Component, OnInit, ViewChild } from '@angular/core'; 
import { IntegraService } from '@shared/services/integra.service'; 
import { IComboBase1 } from '@shared/models/interfaces/iglobal'; 
import { HttpResponse } from '@angular/common/http'; 
import { constApiPlanificacion } from '@environments/constApi'; 
import { DropDownFilterSettings, VirtualizationSettings } from '@progress/kendo-angular-dropdowns'; 
import { KendoGrid } from '@shared/models/kendo-grid'; 
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'; 
import { AlertaService } from '@shared/services/alerta.service'; 
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'; 
import { PageSizeItem } from '@progress/kendo-angular-treelist'; 
import { distinct } from '@progress/kendo-data-query'; 
import { AsociarTagPrograma } from '@planificacion/models/interfaces/pgeneral/pgeneral';
import Swal from 'sweetalert2'; 
import { SubAreaCombo } from '@integra/models/sub-area';

interface ComboModulo {
  area: IComboBase1[];
  subArea: SubAreaCombo[];
  categoriaPrograma: IComboBase1[];
  parametroSeo: IComboBase1[];
}
interface AsociarTags{
  nombre: string; 
  idArea: number;
  nombreArea: string | null;
  idSubArea: number; 
  nombreSubArea: string | null;
}
interface ParametroSEO{
  id: number;
  nombre: string;
  numeroCaracteres: number;
}
interface TodoParametroSEO {
  id: number;
  idTag: number;
  idParametroSeo: number;
  nombreParametroSeo: string;
  contenido: string;
}
interface IFormFiltro {
  idArea: number;
  idSubArea: number;
  idCategoria: number;
}
interface Tags {
  idPGeneral: number;
  objetoTag: TagPw;
  listaParametro?: ParametroSeoAsociados[];
}
interface TagPw {
  id: number;
  nombre: string;
  descripcion: string;
  tagWebId: number;
  codigo: string;
}
interface ParametroSeoAsociados {
  id: number;
  nombre: string;
  contenido: string;
}
interface DatosTag {
  id: number;
  nombre: string;
  descripcion: string;
}
/**
 * @module PlanificacionModule
 * @description Componente del Módulo Asociar Tags a Programas
 * @author Jonathan Raúl Caipo Huacasi
 * @version 1.0.0
 * @history
   29/06/2023 Implementacion del Módulo Asociar Tags a Programas
   29/05/2023 Creacion de Grilla
 */
@Component({ 
  selector: 'app-asociar-tags-programas', 
  templateUrl: './asociar-tags-programas.component.html', 
  styleUrls: ['./asociar-tags-programas.component.scss'] 
}) 
export class AsociarTagsProgramasComponent implements OnInit { 
  @ViewChild('modalTipoTagAsociar') modalTipoTagAsociar: any; 
  gridTodo = new KendoGrid(); 

  public defaultItemTag: { nombre: string; id: number } = { 
    nombre: "<Todas>", 
    id: null, 
  }; 
 
  formControlIdsAsociarTag: FormControl = new FormControl([]) 
  formControlContenido: FormControl = new FormControl([]) 

  formDatosTag: FormGroup = this.formBuilder.group({ 
    nombre: ['', [Validators.required]], 
    descripcion: '',
    parametroSeoAsociados: [null],
  });

  constructor( 
    private integraService: IntegraService, 
    private alertaService: AlertaService, 
    private modalService: NgbModal, 
    private formBuilder: FormBuilder 
  ) { }

  dataArea: IComboBase1[] = [];
  dataSubArea: SubAreaCombo[] = [];
  dataCategoriaPrograma: IComboBase1[] = [];
  private dataParametroSeo: IComboBase1[] = [];

  gridTagPrograma = new KendoGrid();
  gridListaAsociarTags = new KendoGrid();
  idsAsociarTag : IComboBase1[] = [];   
  loaderModal: boolean = false; 
  listaAsociarTags: DatosTag[] = [];
  listaSinAsicuarTags: any[] = [];
  btnActualizarTagDisabled: boolean = false;
  isDisabledSubArea = true;
  esNuevo: boolean = false;
  modalReferencia: NgbModalRef = null;
  dataItemTemp: any;
  dataItemdDatosTagTemp: DatosTag;
  dataItemParametroTemp: TodoParametroSEO;
  comboParametroSEO: TodoParametroSEO[] = [];
  isDisabled = false;

  cantidadItems: PageSizeItem[] = [ 
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
 
  formFiltro: FormGroup = this.formBuilder.group({ 
    idArea: null, 
    idSubArea: null, 
    idCategoria: null, 
  }); 

  public distinctAreaPrimitive(fieldName: string) { 
    let items = distinct(this.gridTagPrograma.data, fieldName).map(item => item[fieldName]) 
    console.log('distinctAreaPrimitive') 
    let filtroCombo = this.dataArea.filter(x => items.includes(x.id)) 
    return filtroCombo; 
  } 
   
  modalRef: NgbModalRef = null; 
 
  virtual: VirtualizationSettings = { 
    itemHeight: 28, 
  }; 

  btnBuscarDisabled: boolean = false; 
 
  filterSettings: DropDownFilterSettings = { 
    caseSensitive: false, 
    operator: 'contains', 
  }; 
 
  area = false
  subArea = false
  listaOriginalReporte: any[] = []
  private listaSubArea: SubAreaCombo[] = []

  ngOnInit(): void {
    this.gridTagPrograma.gridState.skip = 0;
    this.gridTagPrograma.gridState.take = 15;
    this.obtenerCombosModulo();
    this.obtener();
    this.obtenerReporte();
  }
 
  ngOnDestroy(): void {
  }

  //COMBOS - OBTENER - REPORTE

  obtenerCombosModulo() {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.AsociarTagProgramaObtenerCombosModulo}`
      )
      .subscribe({
        next: (resp: HttpResponse<ComboModulo>) => {
          this.dataArea = resp.body.area;
          this.listaSubArea = resp.body.subArea;
          this.dataCategoriaPrograma = resp.body.categoriaPrograma;
          this.dataParametroSeo = resp.body.parametroSeo;
        },
      });
  }

  obtener(){ 
    this.gridTagPrograma.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.AsociarTagProgramaObtenerProgramas)
      .subscribe({
        next: (resp: HttpResponse<AsociarTags[]>) => {
          this.gridTagPrograma.loading = false;
          resp.body.forEach((e) => {
            e.nombreArea = this.dataArea.find(a => a.id === e.idArea)?
            this.dataArea.find(a => a.id == e.idArea).nombre:"Sin Área"
            e.nombreSubArea = this.listaSubArea.find(s => s.id === e.idSubArea)?
            this.listaSubArea.find(s => s.id === e.idSubArea).nombre:"Sin SubÁrea"
          })
          let stringData = JSON.stringify(resp.body)
          this.gridTagPrograma.data = JSON.parse(stringData)
          this.gridTagPrograma.loadView()
          this.listaOriginalReporte = JSON.parse(stringData)
          this.gridTagPrograma.gridState.skip = 0;
          if (resp.body.length)
            this.alertaService.notificationSuccessBotom("Reporte generado exitosamente.");
          else
            this.alertaService.notificationSuccessBotom("Reporte sin datos.");
        },
        error: (error) => {
          console.log(error);
          this.gridTagPrograma.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerReporte(){
    if(this.area == true && this.subArea == true){
      this.area = false
      this.subArea = false
      this.obtener()
    }
  }
  
  obtenerPorIdListaTagSinAsociar(modal: any, idTipoTag: number) {
    this.gridTagPrograma.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.AsociarTagProgramaObtenerTagSinAsociar}/${idTipoTag}`
      )
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.modalRef = this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
          console.log("response.body",response.body);
          this.listaSinAsicuarTags = response.body;
          this.gridTagPrograma.loading = false;
        },
        error: (error) => {
          this.gridTagPrograma.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerPorIdListaTagAsociados(idPGeneral: number) {
    this.gridListaAsociarTags.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.AsociarTagProgramaObtenerTodoTagPorPrograma}/${idPGeneral}` 
      )
      .subscribe({ 
        next: (response: HttpResponse<DatosTag[]>) => {
          console.log("LISTA TAGS", response.body);
          this.listaAsociarTags = response.body;
          this.gridListaAsociarTags.loading = false;
        }, 
        error: (error) => { 
          this.gridListaAsociarTags.loading = false; 
          let mensaje = this.alertaService.getMessageErrorService(error); 
          this.alertaService.notificationWarning(mensaje); 
        }, 
      }); 
  }

  obtenerParametrosContenido(idTag: number) {
    this.btnActualizarTagDisabled = true;
    this.gridTagPrograma.loading = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.AsociarTagProgramaObtenerTodoParametroContenido}/${idTag}`
      )
      .subscribe({
        next: (response: HttpResponse<TodoParametroSEO[]>) => {
          this.btnActualizarTagDisabled = false;
          this.gridTagPrograma.loading = false;
          this.formDatosTag.get('parametroSeoAsociados').setValue(response.body);
        },
        error: (e: any) => {
          this.btnActualizarTagDisabled = false;
          this.gridTagPrograma.loading = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        },
      });
  }

  generarReporte(){
    const dataForm: IFormFiltro = this.formFiltro.getRawValue();
    this.gridTagPrograma.gridState.skip = 0;
    this.obtenerPorIdListaTagAsociados(0);
    if(dataForm.idArea == null && dataForm.idSubArea == null && dataForm.idCategoria == null) {
      this.gridTagPrograma.data = this.listaOriginalReporte.slice()
      this.gridTagPrograma.loadView()
    }
    else {
      let dataTemp = []
      if(dataForm.idArea != null)
        dataTemp = this.listaOriginalReporte.filter(e => e.idArea === dataForm.idArea)
      if(dataForm.idSubArea != null) {
        if(dataTemp.length > 0) {
          dataTemp = dataTemp.filter(e => e.idSubArea === dataForm.idSubArea)
        }
        else
          dataTemp = this.listaOriginalReporte.filter(e => e.idSubArea === dataForm.idSubArea)
      }
      if(dataForm.idCategoria != null)
      if(dataTemp.length > 0) {
        dataTemp = dataTemp.filter(e => e.idCategoria === dataForm.idCategoria)
      }
      else
        dataTemp = this.listaOriginalReporte.filter(e => e.idCategoria === dataForm.idCategoria)
      this.gridTagPrograma.data = dataTemp.slice()
      this.gridTagPrograma.loadView()
    }
  }

  //FUNCIONES PRINCIPALES

  asociarTagPrograma(): void {
    let data = this.formControlIdsAsociarTag.value as IComboBase1[]
    let ids = data.map(x => x.id)
    this.loaderModal = true;
    this.integraService
      .postJsonResponse(
        `${constApiPlanificacion.AsociarTagProgramaAsociarTag}/${this.dataItemTemp.id}`,
        JSON.stringify(ids)
      )
      .subscribe({ 
        next: (response: HttpResponse<boolean>) => {
          this.loaderModal = false;
          Swal.fire(
            '¡Actualizado!',
            'Tag Asociado Correctamente.',
            'success' 
          );
          this.alertaService.notificationSuccessBotom("Tag Asociado Correctamente.");
          this.obtenerPorIdListaTagAsociados(this.dataItemTemp.id);
          this.modalRef.close();
        },
        error: (error) => {
          this.loaderModal = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  desasociarTag(dataItem: AsociarTagPrograma) {
    this.gridListaAsociarTags.loading = true;
    this.integraService
      .deleteJsonResponse(
        `${constApiPlanificacion.AsociarTagProgramaDesasociarTag}/${this.dataItemTemp.id}/${dataItem.id}`
      )
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          console.log(response.body);
          this.gridListaAsociarTags.loading = false;
          this.alertaService.notificationSuccessBotom("Tag Desasociado Correctamente.");
          this.obtenerPorIdListaTagAsociados(this.dataItemTemp.id);
        },
        error: (error) => {
          this.gridListaAsociarTags.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje); 
        },
      });
  }

  insertarTag() {
    this.btnActualizarTagDisabled = true;
    if (this.formDatosTag.valid) {
      let data = this.objetoEnviar();
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.AsociarTagProgramaInsertarTagAsociar,
          JSON.stringify(data)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.btnActualizarTagDisabled = false;
            this.loaderModal = false;
            Swal.fire(
              '¡Actualizado!',
              'El registro ha sido creado y asociado correctamente.',
              'success'
            );
            this.obtenerPorIdListaTagAsociados(this.dataItemTemp.id);
            this.modalRef.close();
          },
          error: (e: any) => {
            this.btnActualizarTagDisabled = false;
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          },
        });
    }
  }
  
  actualizarTag(): void {
    this.btnActualizarTagDisabled = true;
    if (this.formDatosTag.valid) {
      let data = this.objetoEnviar();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.AsociarTagProgramaActualizarTag,
          JSON.stringify(data)
        )
        .subscribe({
          next: (response: HttpResponse<Tags>) => {
            this.btnActualizarTagDisabled = false;
            this.loaderModal = false;
            Swal.fire(
              '¡Actualizado!',
              'El registro ha sido actualizado correctamente.',
              'success'
            );
            this.obtenerPorIdListaTagAsociados(this.dataItemTemp.id);
            this.modalRef.close();
          },
          error: (e: any) => {
            this.btnActualizarTagDisabled = false;
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          },
        });
    }
  }

  eliminarTag(dataItem: any) {
    console.log("DataItem",dataItem)
    this.alertaService.swalFireOptions({
      title: '¿Está seguro de Eliminar Tag?',
      text: 'Se eliminarán todas las asociaciones.',
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
            `${constApiPlanificacion.AsociarTagProgramaEliminarTag}/${dataItem.id}`
          )
          .subscribe({
            next: (response: HttpResponse<IComboBase1[]>) => {
              console.log(response.body);
              this.loaderModal = false;
              this.obtenerPorIdListaTagAsociados(this.dataItemTemp.id);
            },
            error: (error) => {
              this.loaderModal = false;
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje); 
            },
          });
      }
    });
  }

  //MODALES

  abrirModalAsociarTag(modal:any, dataItem: AsociarTagPrograma) {
    this.dataItemTemp = dataItem;
    this.formControlIdsAsociarTag.reset();
    this.obtenerPorIdListaTagSinAsociar(modal, dataItem.id); 
  }
  
  abrirModalEditarTag(modal:any, dataItem?: DatosTag) {
    this.formDatosTag.reset();
    this.comboParametroSEO = this.dataParametroSeo.map(x => {
      let item: TodoParametroSEO = {
        id: 0,
        idTag: 0,
        idParametroSeo: x.id,
        nombreParametroSeo: x.nombre,
        contenido: ''
      }
      return item
    });
    if (dataItem != null) {
      this.esNuevo = false;
      this.dataItemdDatosTagTemp = dataItem;
      this.obtenerParametrosContenido(dataItem.id);
      this.formDatosTag.get('nombre').setValue(dataItem.nombre);
      this.formDatosTag.get('descripcion').setValue(dataItem.descripcion);
      this.modalRef = this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
    } else {
      this.dataItemdDatosTagTemp = null;
      this.esNuevo = true;
      this.modalRef = this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
    }
  }

  abrirModalEditarContenido(modal: any, dataItem: TodoParametroSEO) {
    this.dataItemParametroTemp = dataItem;
    console.log("DATAITEM EDITAR", dataItem);
    this.formControlContenido.setValue(dataItem.contenido);
    this.modalReferencia = this.modalService.open(modal, { size: 'm', backdrop: 'static' });
  }

  //OTROS

  objetoEnviar(): Tags {
    let formPrincipal: {
      nombre: string,
      descripcion: string,
      parametroSeoAsociados: TodoParametroSEO[]
    } = this.formDatosTag.getRawValue();
    
    let tagDescripcion  = formPrincipal.descripcion
    let tagPrincipal: TagPw = {
      id: this.esNuevo ? 0 : this.dataItemdDatosTagTemp.id,
      nombre: formPrincipal.nombre,
      descripcion: tagDescripcion != null ? tagDescripcion : '',
      tagWebId: 0,
      codigo: ''
    }

    let parametros = formPrincipal.parametroSeoAsociados
    let datos: Tags = {
      idPGeneral: this.dataItemTemp.id,
      objetoTag: tagPrincipal,
      listaParametro:parametros != null ? parametros.map ( x => { 
        return {
          id: x.idParametroSeo,
          nombre: x.nombreParametroSeo,
          contenido: x.contenido,
        }
      }):[]
    }
    return datos
  }

  eventoClick(event: any) {
    console.log("Evento", event)
    if(event.column.field){
      this.dataItemTemp = event.dataItem
      this.obtenerPorIdListaTagAsociados(event.dataItem.id);
    }
  }
  
  filtroSubArea(idArea: number) {
    console.log("idArea", idArea)
    this.formFiltro.get('idSubArea').setValue(null)
    if (idArea == null) {
      this.isDisabledSubArea = true;
      this.dataSubArea = [];
    }
    else {
      this.isDisabledSubArea = false;
      this.dataSubArea = this.listaSubArea.filter(
        (s) => s.idAreaCapacitacion === idArea
      );
    }
  }

  llenarContenido() {
    this.dataItemParametroTemp.contenido = this.formControlContenido.value;
    this.modalReferencia.close();
  }
} 
 
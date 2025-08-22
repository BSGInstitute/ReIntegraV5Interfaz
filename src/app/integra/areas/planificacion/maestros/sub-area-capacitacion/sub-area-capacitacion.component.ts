import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApiGlobal, constApiPlanificacion, constApiMarketing } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

interface areaCapacitacion {
  id: number;
  nombre: string;
  descripcion: string;
  imgPortada: string;
  imgSecundaria: string;
  imgPortadaAlt: string;
  imgSecundariaAlt: string;
  esVisibleWeb: boolean;
  idArea: number;
  esWeb: boolean;
  descripcionHtml: string;
  idAreaCapacitacionFacebook: number;
}

interface subAreaCapacitacionVisual {
  nombre: string;
  codigo: string;
  descripcion: string;
  nombreArea: string;
  estado: string;
}

interface subAreaCapacitacion {
  id: number;
  nombre: string;
  descripcion: string;
  idAreaCapacitacion: number;
  nombreAreaCapacitacion: string;
  esVisibleWeb: boolean;
  idSubArea: number;
  descripcionHtml: string;
}

interface parametroSEOContenido{
  id: number;
  nombre: string;
  numeroCaracteres: number;
  contenido?: string;
}

interface parametroSEOContenidoModificar {
  id: number;
  contenido: string;
}

@Component({
  selector: 'app-sub-area-capacitacion',
  templateUrl: './sub-area-capacitacion.component.html',
  styleUrls: ['./sub-area-capacitacion.component.scss']
})
export class SubAreaCapacitacionComponent implements OnInit {

  @ViewChild('modalSubAreaCapacitacionEditar') modalSubAreaCapacitacionEditar: any;
  @ViewChild('modalSubAreaCapacitacionVisualizador') modalSubAreaCapacitacionVisualizador: any;
  @ViewChild('modalSubAreaCapacitacionEditarContenido') modalSubAreaCapacitacionEditarContenido: any;
  
  gridSubAreaCategorias: KendoGrid = new KendoGrid();
  gridParametrosSeo: KendoGrid = new KendoGrid();

  listaAreas: areaCapacitacion[] = [];
  listaParametroSeo: parametroSEOContenido[] = [];

  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;

  cantidadItems: PageSizeItem[] = [
    {text: '5', value: 5},
    {text: '10', value: 10},
    {text: '20', value: 20},
    {text: 'All', value : 'all'}
  ]

  listaEstados: any = [
    { nombre: "Activo", id: 1 },
    { nombre: "Inactivo", id: 0 }
  ]

  modalRefEditar: NgbModalRef = null;
  modalRefEditarContenido: NgbModalRef = null;

  formContenidoModificado: FormGroup = this.formBuilder.group({
    id: [],
    contenido: []
  });
  formSubAreaEditar: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [
      Validators.required]
    ],
    codigo: ['', [
      Validators.required]
    ],
    descripcion: ['', [
      Validators.required]
    ],
    idArea: [0, [
      Validators.required]],
    idEstado: [0, [
        Validators.required]],
    idsParametroSEO: []
  });
  formDataVisual: subAreaCapacitacionVisual;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) { }

  ngOnInit(): void {
    this.obtenerAreasCapacitacion();
    this.obtenerSubAreasCapacitacion();
    this.obtenerTodoParametroSEO();
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerAreasCapacitacion(): void {
    this.loaderModal = true;
    this.integraService.getJsonResponse(constApiPlanificacion.AreaCapacitacionObtener).subscribe({
      next: (response: HttpResponse<areaCapacitacion[]>) => {
        this.loaderModal = false;
        this.listaAreas = response.body;
      },
      error: (e:any) => {
        this.loaderModal = false;
        this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
      }
    })
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerTodoParametroSEO(): void {
    this.loaderModal = true;
    this.integraService.getJsonResponse(constApiPlanificacion.ParametroSeoPwObtenerCombo).subscribe({
      next: (response: HttpResponse<parametroSEOContenido[]>) => {
        let contenidoLimpio = response.body.map((e: parametroSEOContenido) => {
          return {
            id: e.id,
            nombre: e.nombre,
            contenido: "",
            numeroCaracteres: e.numeroCaracteres
          }
        })
        this.listaParametroSeo = contenidoLimpio;
        this.loaderModal = false;
      },
      error: (e:any) => {
        this.loaderModal = false;
        this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
      }
    })
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerParametroSEO(id: number): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(`${constApiPlanificacion.SubAreaCapacitacionObtenerParametroContenidoPorIdSubAreaCapacitacion}/${id}`)
      .subscribe({
        next: (response: HttpResponse<parametroSEOContenido[]>) => {
          if(response.body.length > 0) {
            this.gridParametrosSeo.data = response.body;
            let parametroSEOContenido = response.body.map((x: parametroSEOContenido) => {
              return {
                id: x.id,
                nombre: x.nombre,
                contenido: x.contenido,
                numeroCaracteres: x.numeroCaracteres
              };
            });
            parametroSEOContenido.forEach((x: parametroSEOContenido) => {
              this.listaParametroSeo.map((e: parametroSEOContenido) => {
                if(x.id == e.id) { e.contenido = x.contenido }
              });
            });
            this.formSubAreaEditar.patchValue({idsParametroSEO: parametroSEOContenido});
          } else {
            this.gridParametrosSeo.data = [];
            this.formSubAreaEditar.patchValue({idsParametroSEO: []});
          }
          this.loaderModal = false;
        },
        error: (e:any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
        }
      })
  }
  
  /**
   * @author Christian A. Quispe Mamani
   */
  obtenerSubAreasCapacitacion(): void {
    this.gridSubAreaCategorias.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.SubAreaCapacitacionObtener)
      .subscribe({
        next: (response: HttpResponse<subAreaCapacitacion[]>) => {
          this.gridSubAreaCategorias.data = response.body;
          this.gridSubAreaCategorias.loading = false;
        },
        error: (e:any) => {
          this.gridSubAreaCategorias.loading = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
        }
      })
  }
  
  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalle(dataSource: subAreaCapacitacion) {
    this.nuevoRegistro = false;
    this.formDataVisual = {
      nombre: dataSource.nombre,
      codigo: dataSource.descripcion,
      descripcion: (dataSource.descripcionHtml != null) ? dataSource.descripcionHtml : "",
      nombreArea: dataSource.nombreAreaCapacitacion,
      estado: (dataSource.esVisibleWeb) ? "Activo" : "Inactivo"
    };
    this.modalService.open(this.modalSubAreaCapacitacionVisualizador, { size: 'md', backdrop: 'static' });
    this.loaderModal = false;
  }
  
  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formSubAreaEditar.reset();
    this.gridParametrosSeo.data = [];
    this.formSubAreaEditar.get('id').setValue(0);
    this.formSubAreaEditar.get('idEstado').setValue(1);
    this.listaParametroSeo.map((e: parametroSEOContenido) => { e.contenido = "" })
    this.modalRefEditar = this.modalService.open(this.modalSubAreaCapacitacionEditar, { size: 'lg', backdrop: 'static' });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleActualizar(dataSource: subAreaCapacitacion) {
    this.nuevoRegistro = false;
    this.formSubAreaEditar.setValue({
      id: dataSource.id,
      nombre: dataSource.nombre,
      codigo: dataSource.descripcion,
      descripcion: (dataSource.descripcionHtml != null) ? dataSource.descripcionHtml : "",
      idArea: dataSource.idAreaCapacitacion,
      idEstado: (dataSource.esVisibleWeb) ? 1 : 0,
      idsParametroSEO: []
    });
    this.listaParametroSeo.map((e: parametroSEOContenido) => { e.contenido = "" })
    this.obtenerParametroSEO(dataSource.id);
    this.modalRefEditar = this.modalService.open(this.modalSubAreaCapacitacionEditar, { size: 'lg', backdrop: 'static' });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  abrirModalDetalleContenidoActualizar(dataSource: parametroSEOContenidoModificar): void {
    this.formContenidoModificado.setValue({
      id: dataSource.id,
      contenido: dataSource.contenido
    });
    this.modalRefEditarContenido = this.modalService.open(this.modalSubAreaCapacitacionEditarContenido, { size: 'md', backdrop: 'static' });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  eliminar(dataSource: subAreaCapacitacion) {
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
          .deleteJsonResponse(`${constApiPlanificacion.SubAreaCapacitacionEliminar}/${dataSource.id}`)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if(response.body) {
                let idIndice = this.gridSubAreaCategorias.data.indexOf(dataSource);
                this.gridSubAreaCategorias.data.splice(idIndice, 1);
                this.gridSubAreaCategorias.loadData();
                Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
              } else {
                Swal.fire('Error', 'Surgio un error al eliminar el registro.', 'error');
              }
              this.loaderModal = false;
            },
            error: (e:any) => {
              this.loaderModal = false;
              this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
            }
          })
      }
    });
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  insertar(): void {
    if(this.formSubAreaEditar.valid) {
      let dataCompleta = this.formSubAreaEditar.getRawValue();
      let dataEnviada = {
        nombre: dataCompleta.nombre,
        descripcionHtml: dataCompleta.descripcion,
        descripcion: dataCompleta.codigo,
        idAreaCapacitacion: dataCompleta.idArea,
        esVisibleWeb: (dataCompleta.idEstado == 1) ? true : false,
        listaParametro: this.gridParametrosSeo.data.map((x: parametroSEOContenido) => {
          return {
            id: x.id,
            nombre: x.nombre,
            descripcion: x.contenido
          }
        })
      }
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(constApiPlanificacion.SubAreaCapacitacionInsertar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<subAreaCapacitacion>) => {
            let nuevaFila: subAreaCapacitacion = {
              id: response.body.id,
              nombre: response.body.nombre, 
              descripcion: response.body.descripcion,
              idAreaCapacitacion: response.body.idAreaCapacitacion,
              nombreAreaCapacitacion: response.body.nombreAreaCapacitacion,
              esVisibleWeb: response.body.esVisibleWeb,
              idSubArea: response.body.idSubArea,
              descripcionHtml: response.body.descripcionHtml
            };
            this.gridSubAreaCategorias.data.unshift(nuevaFila);
            this.gridSubAreaCategorias.loadData();
            this.loaderModal = false;
            this.limpiarCamposForm();
            Swal.fire('¡Registrado!', 'El registro ha sido creado correctamente.', 'success');
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
          }
        });
    }
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  actualizar(): void {
    if(this.formSubAreaEditar.valid) {
      let dataCompleta = this.formSubAreaEditar.getRawValue();
      let dataEnviada = {
        id: dataCompleta.id,
        nombre: dataCompleta.nombre,
        descripcionHtml: dataCompleta.descripcion,
        descripcion: dataCompleta.codigo,
        idAreaCapacitacion: dataCompleta.idArea,
        esVisibleWeb: (dataCompleta.idEstado == 1) ? true : false,
        listaParametro: this.gridParametrosSeo.data.map((x: parametroSEOContenido) => {
          return {
            id: x.id,
            nombre: x.nombre,
            descripcion: x.contenido
          }
        })
      }
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(constApiPlanificacion.SubAreaCapacitacionActualizar, dataEnviada)
        .subscribe({
          next: (response: HttpResponse<subAreaCapacitacion>) => {
            let data = this.gridSubAreaCategorias.data.find((x: subAreaCapacitacion) => x.id == dataCompleta.id);
            let index = this.gridSubAreaCategorias.data.indexOf(data);

            this.gridSubAreaCategorias.data[index].id = response.body.id;
            this.gridSubAreaCategorias.data[index].nombre = response.body.nombre;
            this.gridSubAreaCategorias.data[index].descripcion = response.body.descripcion;
            this.gridSubAreaCategorias.data[index].idAreaCapacitacion = response.body.idAreaCapacitacion;
            this.gridSubAreaCategorias.data[index].nombreAreaCapacitacion = response.body.nombreAreaCapacitacion;
            this.gridSubAreaCategorias.data[index].esVisibleWeb = response.body.esVisibleWeb;
            this.gridSubAreaCategorias.data[index].idSubArea = response.body.idSubArea;
            this.gridSubAreaCategorias.data[index].descripcionHtml = response.body.descripcionHtml;
            this.gridSubAreaCategorias.loadData();
            this.loaderModal = false;
            this.limpiarCamposForm();
            Swal.fire('¡Actualizado!', 'El registro ha sido actualizado correctamente.', 'success')
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e.error.title}`);
          }
        });
    }
  }
  
  /**
   * @author Christian A. Quispe Mamani
   */
  actualizarContenido(): void {
    let datosModificar = this.formContenidoModificado.getRawValue();
    let dataActualGrid = this.gridParametrosSeo.data.find((x: parametroSEOContenido) => x.id == datosModificar.id);
    let index = this.gridParametrosSeo.data.indexOf(dataActualGrid);
    this.gridParametrosSeo.data[index].contenido = datosModificar.contenido;
    this.modalRefEditarContenido.close();
    this.limpiarCamposFormContenido();
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  insertarParametroSEO(dataSource: any): void {
    this.gridParametrosSeo.data = dataSource;  
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  limpiarCamposForm(): void {
    if(this.modalRefEditar != null) {
      this.modalRefEditar.close();;
      this.modalRefEditar = null;
    }
    this.formSubAreaEditar.reset();
    this.loaderModal = false;
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  limpiarCamposFormContenido(): void {
    if(this.modalRefEditarContenido != null){
      this.modalRefEditarContenido.close();
      this.modalRefEditarContenido = null;
    }
    this.formContenidoModificado.reset();
    this.loaderModal = false;
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  getErrorMessageEditar(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El campo se encuentra vacio'
      },
      codigo: {
        required: 'El campo se encuentra vacio'
      },
      idArea: {
        required: 'El campo se encuentra vacio'
      },
      idEstado: {
        required: 'El campo se encuentra vacio'
      }
    };
    let formControl: FormControl = this.formSubAreaEditar.get(controlName) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    }
    return errorMessage;
  }

  /**
   * @author Christian A. Quispe Mamani
   */
  extraerLongitudContenido(contenido: string): number {
    let contenidoSinEtiquetas: string = contenido.replace( /(<([^>]+)>)/ig, '');
    return contenidoSinEtiquetas.length;
  }
}

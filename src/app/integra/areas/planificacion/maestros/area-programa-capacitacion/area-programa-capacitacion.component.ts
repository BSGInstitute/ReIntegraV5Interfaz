import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder,FormControl,FormGroup,Validators,} from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';

interface IAreaProgramaCapacitacion {
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
interface AreaCapacitacionVisual {
  nombre: string;
  descripcion: string;
  descripcionHtml: string;
  imgPortada: string;
  imgSecundaria: string;
  imgPortadaAlt: string;
  imgSecundariaAlt: string;
  estado: string;
}

interface AreaCapacitacion {
  id: number;
  nombre: string;
  descripcion: string;
  descripcionHtml: string;
  imgPortada: string;
  imgSecundaria: string;
  imgPortadaAlt: string;
  imgSecundariaAlt: string;
  esVisibleWeb: boolean;
}

interface parametroSEOContenido {
  id: number;
  nombre: string;
  numeroCaracteres: number;
  contenido?: string;
}
interface parametroSEOContenidoModificar {
  id: number;
  contenido: string;
}
/**
 * @module PlanificacionModule
 * @description Componente de Area Programa de Capacitacion
 * @author Klebert Layme.
 * @version 1.0.0
 * @history
 * * 04/05/2023 Implementacion de Crud de Area Programa de Capacitacion
 * * 04/05/2023 Creacion de Grilla
 */
@Component({
  selector: 'app-area-programa-capacitacion',
  templateUrl: './area-programa-capacitacion.component.html',
  styleUrls: ['./area-programa-capacitacion.component.scss'],
})
export class AreaProgramaCapacitacionComponent implements OnInit {
  @ViewChild('modalAreaCapacitacionEditar') modalAreaCapacitacionEditar: any;
  @ViewChild('modalAreaCapacitacionVisualizador')modalAreaCapacitacionVisualizador: any;
  @ViewChild('modalAreaCapacitacionEditarContenido')modalAreaCapacitacionEditarContenido: any;

  gridAreaProgramaCapacitacion = new KendoGrid();
  gridParametrosSeo: KendoGrid = new KendoGrid();

  listaAreas: IAreaProgramaCapacitacion[] = [];
  listaParametroSeo: parametroSEOContenido[] = [];

  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  listaEstados: any = [
    { nombre: 'Activo', id: 1 },
    { nombre: 'Inactivo', id: 0 },
  ];

  modalRefEditar: NgbModalRef = null;
  modalRefEditarContenido: NgbModalRef = null;

  formContenidoModificado: FormGroup = this.formBuilder.group({
    id: [],
    contenido: [],
  });
  formAreaEditar: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    descripcionHtml: ['', [Validators.required]],
    imgPortada: ['', []],
    imgPortadaAlt: ['', []],
    imgSecundaria: ['', []],
    imgSecundariaAlt: ['', []],
    idEstado: [0, [Validators.required]],
    idsParametroSEO: [],
  });
  formDataVisual: AreaCapacitacionVisual;

  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.obtenerAreasCapacitacion();
    this.obtenerComboParametroSEO();
    this.userService.userData;
  }
  ngOnDestroy(): void {}
  /**
   * @author Klebert Layme
   */
  obtenerAreasCapacitacion() {
    this.gridAreaProgramaCapacitacion.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.AreaCapacitacionObtener)
      .subscribe({
        next: (resp: HttpResponse<IAreaProgramaCapacitacion[]>) => {
          this.gridAreaProgramaCapacitacion.loading = false;
          console.log(resp.body);
          this.gridAreaProgramaCapacitacion.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridAreaProgramaCapacitacion.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**
   * @author Klebert Layme
   */
  obtenerComboParametroSEO(): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.ParametroSeoPwObtenerCombo)
      .subscribe({
        next: (
          response: HttpResponse<parametroSEOContenido[]
          >
        ) => {
          this.listaParametroSeo = response.body.map(x => ({
            ...x,
            contenido: '',
          }));
          this.loaderModal = false;
        },
        error: (e: any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(
            `Surgio un error: ${e.error.title}`
          );
        },
      });
  }

  /**
   * @author Klebert Layme
   * @param {number} idAreaCapacitacion
   */
  obtenerParametroSEO(idAreaCapacitacion: number): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.ParametroSeoPwObtenerTodoParametroContenidoIdAreaCapacitacion}/${idAreaCapacitacion}`
      )
      .subscribe({
        next: (response: HttpResponse<parametroSEOContenido[]>) => {
          if (response.body.length > 0) {
            this.gridParametrosSeo.data = response.body;

            response.body.forEach((x) => {
              this.listaParametroSeo.find((z) => z.id == x.id).contenido =
                x.contenido;
            });
            this.formAreaEditar.get('idsParametroSEO').setValue(response.body);
          } else {
            this.gridParametrosSeo.data = [];
            this.formAreaEditar.patchValue({ idsParametroSEO: [] });
          }
          this.loaderModal = false;
        },
        error: (error) => {
          this.loaderModal = false;
          let mensaje = this.alertaService.getMessageErrorService(error)
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  /**
   * @author Klebert Layme
   */
  abrirModalDetalle(dataSource: AreaCapacitacion) {
    this.nuevoRegistro = false;
    this.formDataVisual = {
      nombre: dataSource.nombre,
      descripcion: dataSource.descripcion,
      descripcionHtml:
        dataSource.descripcionHtml != null ? dataSource.descripcionHtml : '',
      imgPortada: dataSource.imgPortada,
      imgSecundaria: dataSource.imgSecundaria,
      imgPortadaAlt: dataSource.imgPortadaAlt,
      imgSecundariaAlt: dataSource.imgSecundariaAlt,
      estado: dataSource.esVisibleWeb ? 'Activo' : 'Inactivo',
    };
    this.modalService.open(this.modalAreaCapacitacionVisualizador, {
      size: 'md',
      backdrop: 'static',
    });
    this.loaderModal = false;
  }
  /**
   * @author Klebert Layme
   */
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formAreaEditar.reset();
    this.gridParametrosSeo.data = [];
    this.formAreaEditar.get('id').setValue(0);
    this.formAreaEditar.get('idEstado').setValue(1);
    this.listaParametroSeo.map((e: parametroSEOContenido) => {
      e.contenido = '';
    });
    this.modalRefEditar = this.modalService.open(
      this.modalAreaCapacitacionEditar,
      { size: 'lg', backdrop: 'static' }
    );
  }

  /**
   * @author Klebert Layme
   */
  abrirModalDetalleActualizar(dataSource: AreaCapacitacion) {
    this.nuevoRegistro = false;
    this.formAreaEditar.setValue({
      id: dataSource.id,
      nombre: dataSource.nombre,
      descripcion: dataSource.descripcion,
      descripcionHtml:
        dataSource.descripcionHtml != null ? dataSource.descripcionHtml : '',
      imgPortada: dataSource.imgPortada,
      imgSecundaria: dataSource.imgSecundaria,
      imgPortadaAlt: dataSource.imgPortadaAlt,
      imgSecundariaAlt: dataSource.imgSecundariaAlt,
      idEstado: dataSource.esVisibleWeb ? 1 : 0,
      idsParametroSEO: [],
    });
    this.listaParametroSeo.map((e: parametroSEOContenido) => {
      e.contenido = '';
    });
    this.obtenerParametroSEO(dataSource.id);
    this.modalRefEditar = this.modalService.open(
      this.modalAreaCapacitacionEditar,
      { size: 'lg', backdrop: 'static' }
    );
  }
  /**
   * @author Klebert Layme
   */
  abrirModalDetalleContenidoActualizar(
    dataSource: parametroSEOContenidoModificar
  ): void {
    this.formContenidoModificado.setValue({
      id: dataSource.id,
      contenido: dataSource.contenido,
    });
    this.modalRefEditarContenido = this.modalService.open(
      this.modalAreaCapacitacionEditarContenido,
      { size: 'md', backdrop: 'static' }
    );
  }
  /**
   * @author Klebert Layme
   */
  insertar(): void {
    if (this.formAreaEditar.valid) {
      let dataCompleta = this.formAreaEditar.getRawValue();
      let dataEnviada = {
        areaCapacitacion: {
          nombre: dataCompleta.nombre,
          descripcionHtml: dataCompleta.descripcionHtml,
          descripcion: dataCompleta.descripcion,
          imgSecundaria: dataCompleta.imgSecundaria,
          imgPortada: dataCompleta.imgPortada,
          imgPortadaAlt: dataCompleta.imgPortadaAlt,
          imgSecundariaAlt: dataCompleta.imgSecundariaAlt,
          esVisibleWeb: dataCompleta.idEstado == 1 ? true : false,
        },
        listaParametro: this.gridParametrosSeo.data,
      };
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.AreaCapacitacionInsertar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<AreaCapacitacion>) => {
            let nuevaFila: AreaCapacitacion = {
              id: response.body.id,
              nombre: response.body.nombre,
              descripcion: response.body.descripcion,
              descripcionHtml: response.body.descripcionHtml,
              imgPortada: response.body.imgPortada,
              imgSecundaria: response.body.imgSecundaria,
              imgPortadaAlt: response.body.imgPortadaAlt,
              imgSecundariaAlt: response.body.imgSecundariaAlt,
              esVisibleWeb: response.body.esVisibleWeb,
            };
            this.gridAreaProgramaCapacitacion.data.unshift(nuevaFila);
            this.gridAreaProgramaCapacitacion.loadData();
            this.loaderModal = false;
            Swal.fire(
              '¡Registrado!',
              'El registro ha sido creado correctamente.',
              'success'
            );
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(
              `Surgio un error: ${e.error.title}`
            );
          },
        });
      this.limpiarCamposForm();
    }
  }

  /**
   * @author Klebert Layme
   */
  actualizar(): void {
    if (this.formAreaEditar.valid) {
      let dataCompleta = this.formAreaEditar.getRawValue();
      let dataEnviada = {
        areaCapacitacion: {
          id: dataCompleta.id,
          nombre: dataCompleta.nombre,
          descripcionHtml: dataCompleta.descripcionHtml,
          descripcion: dataCompleta.descripcion,
          imgSecundaria: dataCompleta.imgSecundaria,
          imgPortada: dataCompleta.imgPortada,
          imgPortadaAlt: dataCompleta.imgPortadaAlt,
          imgSecundariaAlt: dataCompleta.imgSecundariaAlt,
          esVisibleWeb: dataCompleta.idEstado == 1 ? true : false,
        },
        listaParametro: this.gridParametrosSeo.data,
      };
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.AreaCapacitacionActualizar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<AreaCapacitacion>) => {
            let data = this.gridAreaProgramaCapacitacion.data.find(
              (x: AreaCapacitacion) => x.id == dataCompleta.id
            );
            let index = this.gridAreaProgramaCapacitacion.data.indexOf(data);

            this.gridAreaProgramaCapacitacion.data[index].id = response.body.id;
            this.gridAreaProgramaCapacitacion.data[index].nombre =
              response.body.nombre;
            this.gridAreaProgramaCapacitacion.data[index].descripcion =
              response.body.descripcion;
            this.gridAreaProgramaCapacitacion.data[index].descripcionHtml =
              response.body.descripcionHtml;
            this.gridAreaProgramaCapacitacion.data[index].esVisibleWeb =
              response.body.esVisibleWeb;
            this.gridAreaProgramaCapacitacion.data[index].imgSecundaria =
              response.body.imgSecundaria;
            this.gridAreaProgramaCapacitacion.data[index].imgPortada =
              response.body.imgSecundaria;
            this.gridAreaProgramaCapacitacion.data[index].imgPortadaAlt =
              response.body.imgPortadaAlt;
            this.gridAreaProgramaCapacitacion.data[index].imgSecundariaAlt =
              response.body.imgSecundariaAlt;
            this.gridAreaProgramaCapacitacion.loadData();
            this.loaderModal = false;
            Swal.fire(
              '¡Actualizado!',
              'El registro ha sido actualizado correctamente.',
              'success'
            );
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(
              `Surgio un error: ${e.error.title}`
            );
          },
        });
      this.limpiarCamposForm();
    }
  }

  /**
   * @author Klebert Layme
   */
  eliminar(dataSource: AreaCapacitacion) {
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
            `${constApiPlanificacion.AreaCapacitacionEliminar}/${dataSource.id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if (response.body) {
                let idIndice =
                  this.gridAreaProgramaCapacitacion.data.indexOf(dataSource);
                this.gridAreaProgramaCapacitacion.data.splice(idIndice, 1);
                this.gridAreaProgramaCapacitacion.loadData();
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
              this.alertaService.notificationWarning(
                `Surgio un error: ${e.error.title}`
              );
            },
          });
      }
    });
  }

  /**
   * @author Klebert Layme
   */
  insertarParametroSEO(dataSource: any): void {
    this.gridParametrosSeo.data = dataSource;
  }
  /**
   * @author Klebert Layme
   */
  actualizarContenido(): void {
    let datosModificar = this.formContenidoModificado.getRawValue();
    let dataActualGrid = this.gridParametrosSeo.data.find(
      (x: parametroSEOContenido) => x.id == datosModificar.id
    );
    let index = this.gridParametrosSeo.data.indexOf(dataActualGrid);
    this.gridParametrosSeo.data[index].contenido = datosModificar.contenido;
    this.modalRefEditarContenido.close();
    this.limpiarCamposFormContenido();
  }

  /**
   * @author Klebert Layme
   */
  limpiarCamposForm(): void {
    if (this.modalRefEditar != null) {
      this.modalRefEditar.close();
      this.modalRefEditar = null;
    }
    this.formAreaEditar.reset();
    this.loaderModal = false;
  }
  /**
   * @author Klebert Layme
   */
  limpiarCamposFormContenido(): void {
    if (this.modalRefEditarContenido != null) {
      this.modalRefEditarContenido.close();
      this.modalRefEditarContenido = null;
    }
    this.formContenidoModificado.reset();
    this.loaderModal = false;
  }
  /**
   * @author Klebert Layme
   */

  getErrorMessageEditar(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'El campo se encuentra vacio',
      },
      descripcion: {
        required: 'El campo se encuentra vacio',
      },
      descripcionHtml: {
        required: 'El campo se encuentra vacio',
      },
      imgPortada: {
      },
      imgPortadaAlt: {
      },
      imgSecundaria: {
      },
      imgSecundariaAlt: {
      },
      idEstado: {
        required: 'El campo se encuentra vacio',
      },
    };
    let formControl: FormControl = this.formAreaEditar.get(
      controlName
    ) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    }
    return errorMessage;
  }
}

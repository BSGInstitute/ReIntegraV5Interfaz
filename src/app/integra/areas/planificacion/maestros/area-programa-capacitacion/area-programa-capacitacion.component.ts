import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  colorArea?: string | null;
  urlIconoArea?: string | null;
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
  colorArea?: string | null;
  urlIconoArea?: string | null;
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
 * @author ...
 */
@Component({
  selector: 'app-area-programa-capacitacion',
  templateUrl: './area-programa-capacitacion.component.html',
  styleUrls: ['./area-programa-capacitacion.component.scss'],
})
export class AreaProgramaCapacitacionComponent implements OnInit {
  @ViewChild('modalAreaCapacitacionEditar') modalAreaCapacitacionEditar: any;
  @ViewChild('modalAreaCapacitacionVisualizador') modalAreaCapacitacionVisualizador: any;
  @ViewChild('modalAreaCapacitacionEditarContenido') modalAreaCapacitacionEditarContenido: any;

  gridAreaProgramaCapacitacion = new KendoGrid();
  gridParametrosSeo: KendoGrid = new KendoGrid();

  listaAreas: IAreaProgramaCapacitacion[] = [];
  listaParametroSeo: parametroSEOContenido[] = [];

  nuevoRegistro = false;
  loaderModal = false;

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

  modalRefEditar: NgbModalRef | null = null;
  modalRefEditarContenido: NgbModalRef | null = null;

  formContenidoModificado: FormGroup = this.formBuilder.group({
    id: [],
    contenido: [],
  });

  formAreaEditar: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    descripcionHtml: ['', [Validators.required]],
    imgPortada: [''],
    imgPortadaAlt: [''],
    imgSecundaria: [''],
    imgSecundariaAlt: [''],
    idEstado: [0, [Validators.required]],
    idsParametroSEO: [],
    // Permite vacío o #RGB/#RRGGBB/#RRGGBBAA
    colorArea: [
      null,
      [Validators.pattern(/^$|^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/)],
    ],
    urlIconoArea: [null],
  });

  formDataVisual!: AreaCapacitacionVisual;

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

  obtenerAreasCapacitacion() {
    this.gridAreaProgramaCapacitacion.loading = true;
    this.integraService.getJsonResponse(constApiPlanificacion.AreaCapacitacionObtener).subscribe({
      next: (resp: HttpResponse<IAreaProgramaCapacitacion[]>) => {
        this.gridAreaProgramaCapacitacion.loading = false;
        this.gridAreaProgramaCapacitacion.data = resp.body ?? [];
      },
      error: (error) => {
        this.gridAreaProgramaCapacitacion.loading = false;
        const mensaje = this.alertaService.getMessageErrorService(error);
        this.alertaService.notificationWarning(mensaje);
      },
    });
  }

  obtenerComboParametroSEO(): void {
    this.loaderModal = true;
    this.integraService.getJsonResponse(constApiPlanificacion.ParametroSeoPwObtenerCombo).subscribe({
      next: (response: HttpResponse<parametroSEOContenido[]>) => {
        const body = response.body ?? [];
        this.listaParametroSeo = body.map((x) => ({ ...x, contenido: '' }));
        this.loaderModal = false;
      },
      error: (e: any) => {
        this.loaderModal = false;
        this.alertaService.notificationWarning(`Surgio un error: ${e.error?.title ?? 'Desconocido'}`);
      },
    });
  }

  obtenerParametroSEO(idAreaCapacitacion: number): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.ParametroSeoPwObtenerTodoParametroContenidoIdAreaCapacitacion}/${idAreaCapacitacion}`
      )
      .subscribe({
        next: (response: HttpResponse<parametroSEOContenido[]>) => {
          const body = response.body ?? [];
          if (body.length > 0) {
            this.gridParametrosSeo.data = body;
            body.forEach((x) => {
              const destino = this.listaParametroSeo.find((z) => z.id == x.id);
              if (destino) destino.contenido = x.contenido;
            });
            this.formAreaEditar.get('idsParametroSEO')!.setValue(body);
          } else {
            this.gridParametrosSeo.data = [];
            // sin patchValue: setValue del control directamente
            this.formAreaEditar.get('idsParametroSEO')!.setValue([]);
          }
          this.loaderModal = false;
        },
        error: (error) => {
          this.loaderModal = false;
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  abrirModalDetalle(dataSource: AreaCapacitacion) {
    this.nuevoRegistro = false;
    this.formDataVisual = {
      nombre: dataSource.nombre,
      descripcion: dataSource.descripcion,
      descripcionHtml: dataSource.descripcionHtml ?? '',
      imgPortada: dataSource.imgPortada,
      imgSecundaria: dataSource.imgSecundaria,
      imgPortadaAlt: dataSource.imgPortadaAlt,
      imgSecundariaAlt: dataSource.imgSecundariaAlt,
      estado: dataSource.esVisibleWeb ? 'Activo' : 'Inactivo',
      colorArea: dataSource.colorArea ?? null,
      urlIconoArea: dataSource.urlIconoArea ?? null,
    };
    this.modalService.open(this.modalAreaCapacitacionVisualizador, {
      size: 'md',
      backdrop: 'static',
    });
    this.loaderModal = false;
  }

  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formAreaEditar.reset();
    this.gridParametrosSeo.data = [];
    this.formAreaEditar.get('id')!.setValue(0);
    this.formAreaEditar.get('idEstado')!.setValue(1);
    this.listaParametroSeo.forEach((e) => (e.contenido = ''));
    this.modalRefEditar = this.modalService.open(this.modalAreaCapacitacionEditar, {
      size: 'lg',
      backdrop: 'static',
    });
  }

  abrirModalDetalleActualizar(dataSource: AreaCapacitacion) {
    this.nuevoRegistro = false;

    this.formAreaEditar.setValue({
      id: dataSource.id,
      nombre: dataSource.nombre ?? '',
      descripcion: dataSource.descripcion ?? '',
      descripcionHtml: dataSource.descripcionHtml ?? '',
      imgPortada: dataSource.imgPortada ?? '',
      imgSecundaria: dataSource.imgSecundaria ?? '',
      imgPortadaAlt: dataSource.imgPortadaAlt ?? '',
      imgSecundariaAlt: dataSource.imgSecundariaAlt ?? '',
      idEstado: dataSource.esVisibleWeb ? 1 : 0,
      idsParametroSEO: [],
      colorArea: dataSource.colorArea ?? null,
      urlIconoArea: dataSource.urlIconoArea ?? null,
    });

    this.listaParametroSeo.forEach((e) => (e.contenido = ''));
    this.obtenerParametroSEO(dataSource.id);

    this.modalRefEditar = this.modalService.open(this.modalAreaCapacitacionEditar, {
      size: 'lg',
      backdrop: 'static',
    });
  }

  abrirModalDetalleContenidoActualizar(dataSource: parametroSEOContenidoModificar): void {
    this.formContenidoModificado.setValue({
      id: dataSource.id,
      contenido: dataSource.contenido,
    });
    this.modalRefEditarContenido = this.modalService.open(this.modalAreaCapacitacionEditarContenido, {
      size: 'md',
      backdrop: 'static',
    });
  }

  insertar(): void {
    if (this.formAreaEditar.valid) {
      const dataCompleta = this.formAreaEditar.getRawValue();
      const dataEnviada = {
        areaCapacitacion: {
          nombre: dataCompleta.nombre,
          descripcionHtml: dataCompleta.descripcionHtml,
          descripcion: dataCompleta.descripcion,
          imgSecundaria: dataCompleta.imgSecundaria,
          imgPortada: dataCompleta.imgPortada,
          imgPortadaAlt: dataCompleta.imgPortadaAlt,
          imgSecundariaAlt: dataCompleta.imgSecundariaAlt,
          esVisibleWeb: dataCompleta.idEstado == 1,
          urlIconoArea: dataCompleta.urlIconoArea,
          colorArea: dataCompleta.colorArea,
        },
        listaParametro: this.gridParametrosSeo.data,
      };

      this.loaderModal = true;
      this.integraService.postJsonResponse(constApiPlanificacion.AreaCapacitacionInsertar, dataEnviada).subscribe({
        next: (response: HttpResponse<AreaCapacitacion>) => {
          const r = response.body!;
          const nuevaFila: AreaCapacitacion = {
            id: r.id,
            nombre: r.nombre,
            descripcion: r.descripcion,
            descripcionHtml: r.descripcionHtml,
            imgPortada: r.imgPortada,
            imgSecundaria: r.imgSecundaria,
            imgPortadaAlt: r.imgPortadaAlt,
            imgSecundariaAlt: r.imgSecundariaAlt,
            esVisibleWeb: r.esVisibleWeb,
            urlIconoArea: r.urlIconoArea ?? null,
            colorArea: r.colorArea ?? null,
          };
          this.gridAreaProgramaCapacitacion.data.unshift(nuevaFila);
          this.gridAreaProgramaCapacitacion.loadData();
          this.loaderModal = false;
          Swal.fire('¡Registrado!', 'El registro ha sido creado correctamente.', 'success');
        },
        error: (e: any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e.error?.title ?? 'Desconocido'}`);
        },
      });

      this.limpiarCamposForm();
    }
  }

  actualizar(): void {
    if (this.formAreaEditar.valid) {
      const dataCompleta = this.formAreaEditar.getRawValue();
      const dataEnviada = {
        areaCapacitacion: {
          id: dataCompleta.id,
          nombre: dataCompleta.nombre,
          descripcionHtml: dataCompleta.descripcionHtml,
          descripcion: dataCompleta.descripcion,
          imgSecundaria: dataCompleta.imgSecundaria,
          imgPortada: dataCompleta.imgPortada,
          imgPortadaAlt: dataCompleta.imgPortadaAlt,
          imgSecundariaAlt: dataCompleta.imgSecundariaAlt,
          esVisibleWeb: dataCompleta.idEstado == 1,
          urlIconoArea: dataCompleta.urlIconoArea,
          colorArea: dataCompleta.colorArea,
        },
        listaParametro: this.gridParametrosSeo.data,
      };

      this.loaderModal = true;
      this.integraService.putJsonResponse(constApiPlanificacion.AreaCapacitacionActualizar, dataEnviada).subscribe({
        next: (response: HttpResponse<AreaCapacitacion>) => {
          const r = response.body!;
          const data = this.gridAreaProgramaCapacitacion.data.find((x: AreaCapacitacion) => x.id == dataCompleta.id)!;
          const index = this.gridAreaProgramaCapacitacion.data.indexOf(data);

          this.gridAreaProgramaCapacitacion.data[index].id = r.id;
          this.gridAreaProgramaCapacitacion.data[index].nombre = r.nombre;
          this.gridAreaProgramaCapacitacion.data[index].descripcion = r.descripcion;
          this.gridAreaProgramaCapacitacion.data[index].descripcionHtml = r.descripcionHtml;
          this.gridAreaProgramaCapacitacion.data[index].esVisibleWeb = r.esVisibleWeb;
          this.gridAreaProgramaCapacitacion.data[index].imgSecundaria = r.imgSecundaria;
          this.gridAreaProgramaCapacitacion.data[index].imgPortada = r.imgPortada; // <- corregido
          this.gridAreaProgramaCapacitacion.data[index].imgPortadaAlt = r.imgPortadaAlt;
          this.gridAreaProgramaCapacitacion.data[index].imgSecundariaAlt = r.imgSecundariaAlt;
          (this.gridAreaProgramaCapacitacion.data[index] as any).colorArea = r.colorArea ?? null;
          (this.gridAreaProgramaCapacitacion.data[index] as any).urlIconoArea = r.urlIconoArea ?? null;

          this.gridAreaProgramaCapacitacion.loadData();
          this.loaderModal = false;
          Swal.fire('¡Actualizado!', 'El registro ha sido actualizado correctamente.', 'success');
        },
        error: (e: any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e.error?.title ?? 'Desconocido'}`);
        },
      });

      this.limpiarCamposForm();
    }
  }

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
          .deleteJsonResponse(`${constApiPlanificacion.AreaCapacitacionEliminar}/${dataSource.id}`)
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if (response.body) {
                const idIndice = this.gridAreaProgramaCapacitacion.data.indexOf(dataSource);
                this.gridAreaProgramaCapacitacion.data.splice(idIndice, 1);
                this.gridAreaProgramaCapacitacion.loadData();
                Swal.fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
              } else {
                Swal.fire('Error', 'Surgio un error al eliminar el registro.', 'error');
              }
              this.loaderModal = false;
            },
            error: (e: any) => {
              this.loaderModal = false;
              this.alertaService.notificationWarning(`Surgio un error: ${e.error?.title ?? 'Desconocido'}`);
            },
          });
      }
    });
  }

  insertarParametroSEO(dataSource: any): void {
    this.gridParametrosSeo.data = dataSource;
  }

  actualizarContenido(): void {
    const datosModificar = this.formContenidoModificado.getRawValue();
    const dataActualGrid = this.gridParametrosSeo.data.find(
      (x: parametroSEOContenido) => x.id == datosModificar.id
    )!;
    const index = this.gridParametrosSeo.data.indexOf(dataActualGrid);
    this.gridParametrosSeo.data[index].contenido = datosModificar.contenido;
    this.modalRefEditarContenido!.close();
    this.limpiarCamposFormContenido();
  }

  limpiarCamposForm(): void {
    if (this.modalRefEditar != null) {
      this.modalRefEditar.close();
      this.modalRefEditar = null;
    }
    this.formAreaEditar.reset();
    this.loaderModal = false;
  }

  limpiarCamposFormContenido(): void {
    if (this.modalRefEditarContenido != null) {
      this.modalRefEditarContenido.close();
      this.modalRefEditarContenido = null;
    }
    this.formContenidoModificado.reset();
    this.loaderModal = false;
  }

  getErrorMessageEditar(controlName: string): string | null {
    const erroMsj: any = {
      nombre: { required: 'El campo se encuentra vacio' },
      descripcion: { required: 'El campo se encuentra vacio' },
      descripcionHtml: { required: 'El campo se encuentra vacio' },
      imgPortada: {},
      imgPortadaAlt: {},
      imgSecundaria: {},
      imgSecundariaAlt: {},
      idEstado: { required: 'El campo se encuentra vacio' },
    };
    const formControl: FormControl = this.formAreaEditar.get(controlName) as FormControl;
    let errorMessage: string | null = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName]?.required ?? null;
    }
    return errorMessage;
  }
}

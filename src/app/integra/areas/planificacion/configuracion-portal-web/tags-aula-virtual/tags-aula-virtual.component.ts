import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1, IComboBase2 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
interface ParametroSeo {
  id: number;
  nombre: string;
  numeroCaracteres: string;
}
interface ParametroSeoContenido {
  id: number;
  idParametroSeo: number;
  nombreParametroSeo: string;
  descripcion: string;
}
interface TagsAula {
  codigo: string;
  descripcion: string;
  id: number;
  nombre: string;
  tagWebId: number;
  parametroSeoAsociados: IComboBase1;
}
@Component({
  selector: 'app-tags-aula-virtual',
  templateUrl: './tags-aula-virtual.component.html',
  styleUrls: ['./tags-aula-virtual.component.scss'],
})
export class TagsAulaVirtualComponent implements OnInit {
  @ViewChild('modalTagsContenido') modalTagsContenido: any;
  @ViewChild('modalTags') modalTags: any;

  gridTagsAulaVirtual: KendoGrid = new KendoGrid();
  gridParametrosSeo: KendoGrid = new KendoGrid();
  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;

  listaParametroSeo: ParametroSeoContenido[];
  listaParametroSeoReseteo: ParametroSeoContenido[];

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  modalRefEditar: NgbModalRef = null;
  modalRefEditarContenido: NgbModalRef = null;

  formContenidoModificado: FormGroup = this.formBuilder.group({
    id: [0],
    nombreParametro: [''],
    descripcion: [[]],
  });
  formTagsAulaVirtual: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: ['', [Validators.required]],
    codigo: [''],
    descripcion: [''],
    parametroSeoAsociados: [[]],
  });

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtenerTags();
    this.obtenerCombos();
  }

  obtenerTags(): void {
    this.gridTagsAulaVirtual.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.TagPwObtener)
      .subscribe({
        next: (response: HttpResponse<TagsAula[]>) => {
          this.gridTagsAulaVirtual.data = response.body;
          this.gridTagsAulaVirtual.loading = false;
        },
        error: (e: any) => {
          this.gridTagsAulaVirtual.loading = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        },
      });
  }
  obtenerParametrosSeo(id: number): Observable<ParametroSeoContenido[]> {
    return new Observable<ParametroSeoContenido[]>((observer) => {
      this.integraService
        .getJsonResponse(
          `${constApiPlanificacion.TagPwObtenerParametroSeo}/${id}`
        )
        .subscribe({
          next: (response: HttpResponse<ParametroSeoContenido[]>) => {
            if (response.body) {
              observer.next(response.body);
            } else {
              observer.next(null);
            }
            observer.complete();
            observer.unsubscribe();
          },
        });
    });
  }
  obtenerCombos(): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.ParametroSeoPwObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<ParametroSeo[]>) => {
          this.listaParametroSeo = response.body.map((x: ParametroSeo) => {
            return {
              id: 0,
              idParametroSeo: x.id,
              nombreParametroSeo: x.nombre,
              descripcion: '',
            };
          });
          this.loaderModal = false;
        },
        error: (e: any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        },
      });
  }
  abrirModalDetalleContenido(dataSource: ParametroSeoContenido): void {
    this.formContenidoModificado.setValue({
      id: dataSource.idParametroSeo,
      nombreParametro: dataSource.nombreParametroSeo,
      descripcion: dataSource.descripcion,
    });
    this.modalRefEditarContenido = this.modalService.open(
      this.modalTagsContenido,
      {
        size: 'md',
        backdrop: 'static',
      }
    );
  }
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formTagsAulaVirtual.reset();
    this.gridParametrosSeo.data = [];
    this.listaParametroSeo = this.reestablecerParametroSeo();
    this.modalRefEditar = this.modalService.open(this.modalTags, {
      size: 'lg',
      backdrop: 'static',
    });
  }
  abrirModalDetalleActualizar(dataSource: TagsAula): void {
    this.nuevoRegistro = false;
    let parametrosSeo = this.obtenerParametrosSeo(dataSource.id);
    parametrosSeo.subscribe({
      next: (res) => {
        this.listaParametroSeo = this.reestablecerParametroSeo();
        let idParametroSeoExistentes:number[] = res.map(x => x.idParametroSeo);
        this.listaParametroSeo = this.listaParametroSeo.filter(x => !idParametroSeoExistentes.includes(x.idParametroSeo))
        this.listaParametroSeo = this.listaParametroSeo.concat(res);
        this.formTagsAulaVirtual.setValue({
          id: dataSource.id,
          nombre: dataSource.nombre,
          codigo: dataSource.codigo,
          descripcion: dataSource.descripcion,
          parametroSeoAsociados: res,
        });
        this.gridParametrosSeo.data = res != null && res.length > 0 ? res : [];
      },
    });
    this.modalRefEditar = this.modalService.open(this.modalTags, {
      size: 'lg',
      backdrop: 'static',
    });
  }
  insertar(): void {
    if (this.formTagsAulaVirtual.valid) {
      let dataEnviada = this.formatearObjetoEnviar();
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.TagPwInsertar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<TagsAula[]>) => {
            this.gridTagsAulaVirtual.data = response.body;
            this.gridTagsAulaVirtual.loadData();
            this.loaderModal = false;
            Swal.fire(
              '¡Registrado!',
              'El registro ha sido creado correctamente.',
              'success'
            );
            this.limpiarCamposForm();
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          },
        });
    }
  }
  actualizar(): void {
    if (this.formTagsAulaVirtual.valid) {
      let dataEnviada = this.formatearObjetoEnviar();
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.TagPwActualizar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<TagsAula[]>) => {
            this.gridTagsAulaVirtual.data = response.body;
            this.gridTagsAulaVirtual.loadData();
            this.loaderModal = false;
            Swal.fire(
              '¡Actualizado!',
              'El registro ha sido actualizado correctamente.',
              'success'
            );
            this.limpiarCamposForm();
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(`Surgio un error: ${e}`);
          },
        });
    }
  }
  eliminar(dataSource: TagsAula): void {
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
            `${constApiPlanificacion.TagPwEliminar}/${dataSource.id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if (response.body) {
                let idIndice =
                  this.gridTagsAulaVirtual.data.indexOf(dataSource);
                this.gridTagsAulaVirtual.data.splice(idIndice, 1);
                this.gridTagsAulaVirtual.loadData();
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
  actualizarContenido(): void {
    let datosModificar = this.formContenidoModificado.getRawValue();
    let dataActualGrid = this.gridParametrosSeo.data.find(
      (x: ParametroSeoContenido) =>
        x.idParametroSeo == datosModificar.id &&
        x.nombreParametroSeo == datosModificar.nombreParametro
    );
    let index = this.gridParametrosSeo.data.indexOf(dataActualGrid);
    this.gridParametrosSeo.data[index].descripcion = datosModificar.descripcion;
    this.modalRefEditarContenido.close();
    this.limpiarCamposFormContenido();
  }
  adjuntarRegistro(item: any): void {
    this.gridParametrosSeo.data = item;
  }
  generarCodigo(nombre: string): void {
    let codigoGenerado: string = nombre.trim();
    codigoGenerado = codigoGenerado
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    codigoGenerado = codigoGenerado.replace(/[^a-zA-Z0-9]/g, ' ');
    codigoGenerado = codigoGenerado.replace(/(\s+)/g, '-');
    this.formTagsAulaVirtual.get('codigo').setValue(codigoGenerado);
  }
  limpiarCamposForm(): void {
    if (this.modalRefEditar != null) {
      this.modalRefEditar.close();
      this.modalRefEditar = null;
    }
    this.formTagsAulaVirtual.reset();
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
  formatearObjetoEnviar(): any {
    let formPrincipal = this.formTagsAulaVirtual.getRawValue();
    return {
      id: (formPrincipal.id != null) ? formPrincipal.id : 0,
      nombre: formPrincipal.nombre,
      codigo: formPrincipal.codigo,
      descripcion: formPrincipal.descripcion,
      parametroSeoAsociados: this.gridParametrosSeo.data.map(x => {
        return {
          id: x.id,
          idParametroSEOPW: x.idParametroSeo,
          descripcion: x.descripcion
        }
      })
    };
  }
  reestablecerParametroSeo(): ParametroSeoContenido[] {
    return this.listaParametroSeo.map(
      (x: ParametroSeoContenido) => {
        return {
          id: 0,
          idParametroSeo: x.idParametroSeo,
          nombreParametroSeo: x.nombreParametroSeo,
          descripcion: '',
        };
      }
    );
  }
}

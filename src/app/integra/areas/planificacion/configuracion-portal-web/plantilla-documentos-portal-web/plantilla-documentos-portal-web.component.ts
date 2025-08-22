import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
interface PlantillaPw {
  id: number;
  descripcion: string;
  idPlantillaMaestroPw: number;
  nombreMaestroPw: string;
  idRevisionPw: number;
  nombre: string;
}
interface PlantillaMaestroPw {
  id: number;
  nombre: string;
  repeticion: number;
}
interface RevisionoPw {
  id: number;
  nombre: string;
  descripcion: string;
}
interface PaisPlantillaPw {
  id: number;
  nombrePais: string;
  codigoISO: string;
}
interface ColeccionDataModulo {
  pais: IComboBase1[];
  plantillaMaestroPw: PlantillaMaestroPw[];
  plantillaPw: PlantillaPw[];
  revisionPw: RevisionoPw[];
  seccionTipoContenidoPw: IComboBase1[];
}
interface SeccionesTipoContenido {
  id: number;
  idSeccionPw: number;
  idSeccionTipoContenido: number;
  nombreTitulo: string;
}
interface SeccionPlantillaPw {
  id: number;
  nombre: string;
  descripcion: string;
  contenido: string;
  idPlantillaPw: number;
  idPlantilla: number;
  idSeccionMaestraPw: number;
  visibleWeb: boolean;
  zonaWeb: number;
  ordenEeb: number;
  titulo: string;
  posicion: number;
  tipo: number;
  idSeccionTipoContenido: number;
  nombreSeccionTipoContenido: string;
  rowVersion: any;
  seccionTipoDetallePw: SeccionesTipoContenido[];
}
@Component({
  selector: 'app-plantilla-documentos-portal-web',
  templateUrl: './plantilla-documentos-portal-web.component.html',
  styleUrls: ['./plantilla-documentos-portal-web.component.scss'],
})
export class PlantillaDocumentosPortalWebComponent implements OnInit {
  @ViewChild('modalEdicionPlantilla') modalEdicionPlantilla: any;
  @ViewChild('modalSeccionPlantilla') modalSeccionPlantilla: any;

  gridPlantillasPw: KendoGrid = new KendoGrid();
  gridPlantillasEdicionPw: KendoGrid = new KendoGrid();
  gridPlantillasEdicionSeccionPw: KendoGrid = new KendoGrid();
  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;

  configuracionSecciones: SeccionPlantillaPw;
  nuevaConfiguracionSecciones: SeccionPlantillaPw;

  listaCombos: ColeccionDataModulo;

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  modalRefEditar: NgbModalRef = null;
  modalSeccionRefEditar: NgbModalRef = null;

  formPlantillaPw: FormGroup = this.formBuilder.group({
    id: 0,
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noEndSpace,
        TextValidator.noStartSpace,
      ],
    ],
    descripcion: [''],
    idPaisPlantilla: [0],
    idPlantillaMaestro: [0],
  });

  formPlantillaSeccionPw: FormGroup = this.formBuilder.group({
    nombre: [''],
    ordenSeccion: [0],
    idTipo: [2],
    descripcion: [[]],
    ordenWeb: [0],
    visibleWeb: [false],
  });

  formPlantillaSeccionGrillaPw: FormGroup = this.formBuilder.group({
    nombre: [''],
    idTipo: [''],
  });

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}

  ngOnInit(): void {
    this.obtenerPlantillasPw();
  }
  obtenerPlantillasPw(): void {
    this.gridPlantillasPw.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.PlantillaPwObtenerCombosModulo)
      .subscribe({
        next: (response: HttpResponse<ColeccionDataModulo>) => {
          this.listaCombos = response.body;
          this.gridPlantillasPw.data = this.mapearContenidoGrilla(response.body.plantillaPw);
          this.gridPlantillasPw.loading = false;
        },
        error: (e: any) => {
          this.gridPlantillasPw.loading = false;
          this.alertaService.notificationWarning(`Surgio un error: ${e}`);
        },
      });
  }
  obtenerDetalleConfiguracionMaterial(
    id: number
  ): Observable<SeccionPlantillaPw[]> {
    return new Observable<SeccionPlantillaPw[]>((observer) => {
      this.integraService
        .getJsonResponse(
          `${constApiPlanificacion.PlantillaPwObtenerSeccionesPlantillaPorIdPlantillaPW}/${id}`
        )
        .subscribe({
          next: (response: HttpResponse<SeccionPlantillaPw[]>) => {
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
  obtenerPaisPorPlantilla(id: number): Observable<PaisPlantillaPw[]> {
    return new Observable<PaisPlantillaPw[]>((observer) => {
      this.integraService
        .getJsonResponse(
          `${constApiPlanificacion.PlantillaPwObtenerPaisesPorIdPlantillaPw}/${id}`
        )
        .subscribe({
          next: (response: HttpResponse<PaisPlantillaPw[]>) => {
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
  abrirModalDetalleSeccionInsertar(): void {
    this.formPlantillaSeccionPw.reset();
    this.formPlantillaSeccionPw.setValue({
      nombre: '',
      ordenSeccion: 0,
      idTipo: 3,
      descripcion: '',
      ordenWeb: 0,
      visibleWeb: false,
    });
    this.configuracionSecciones = null;
    this.gridPlantillasEdicionSeccionPw.data = [];

    this.nuevaConfiguracionSecciones = {
      nombre: "",
      descripcion: "",
      zonaWeb: 0,
      idSeccionTipoContenido: 0,
      nombreSeccionTipoContenido: "",
      ordenEeb: 0,
      visibleWeb: false,
      seccionTipoDetallePw: [],

      idPlantillaPw: 0,
      idPlantilla: 0,
      idSeccionMaestraPw: 0,
      contenido: '<vacio>',
      rowVersion: '',
      posicion: 0,
      titulo: '',
      tipo: 0,
      id: 0,
    };
    this.modalSeccionRefEditar = this.modalService.open(
      this.modalSeccionPlantilla,
      { size: 'lg', backdrop: 'static' }
    );
  }
  abrirModalDetalleSeccionActualizar(dataSource: SeccionPlantillaPw): void {
    this.configuracionSecciones = dataSource;
    this.formPlantillaSeccionPw.setValue({
      nombre: dataSource.nombre,
      ordenSeccion: dataSource.zonaWeb,
      idTipo: dataSource.idSeccionTipoContenido,
      descripcion: dataSource.descripcion,
      ordenWeb: dataSource.ordenEeb,
      visibleWeb: dataSource.visibleWeb,
    });
    if (
      dataSource.idSeccionTipoContenido == 1      
    ) {
      this.gridPlantillasEdicionSeccionPw.data =
        dataSource.seccionTipoDetallePw.map((x: SeccionesTipoContenido) => {
          return {
            ...x,
            nombreSeccionTipoContenido:
              this.listaCombos.seccionTipoContenidoPw.find(
                (y) => y.id == x.idSeccionTipoContenido
              ).nombre,
          };
        });
    } else {
      this.gridPlantillasEdicionSeccionPw.data = [];
    }
    this.modalSeccionRefEditar = this.modalService.open(
      this.modalSeccionPlantilla,
      { size: 'lg', backdrop: 'static' }
    );
  }
  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formPlantillaPw.reset();
    this.formPlantillaPw.get('id').setValue(0);
    this.gridPlantillasEdicionPw.data = [];

    this.modalRefEditar = this.modalService.open(this.modalEdicionPlantilla, {
      size: 'xl',
      backdrop: 'static',
    });
  }
  abrirModalDetalleActualizar(dataSource: PlantillaPw): void {
    this.nuevoRegistro = false;
    let paisPorPlantilla = this.obtenerPaisPorPlantilla(dataSource.id);
    let detalleConfiguracionCondicion =
      this.obtenerDetalleConfiguracionMaterial(dataSource.id);
    paisPorPlantilla.subscribe({
      next: (resPais) =>
        this.formPlantillaPw.get('idPaisPlantilla').setValue(resPais[0].id),
    });
    detalleConfiguracionCondicion.subscribe({
      next: (res) => {
        this.formPlantillaPw.patchValue({
          id: dataSource.id,
          nombre: dataSource.nombre,
          descripcion: dataSource.descripcion,
          idPlantillaMaestro: dataSource.idPlantillaMaestroPw,
        });
        this.gridPlantillasEdicionPw.data = res;

        this.modalRefEditar = this.modalService.open(
          this.modalEdicionPlantilla,
          { size: 'xl', backdrop: 'static' }
        );
      },
    });
  }
  insertar(): void {
    if (this.formPlantillaPw.valid) {
      let dataEnviada = this.formatearObjetoEnviar();
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.PlantillaPwInsertar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<PlantillaPw[]>) => {
            this.gridPlantillasPw.data = this.mapearContenidoGrilla(response.body);
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
            this.alertaService.notificationWarning(
              `Surgio un error: ${e.error.title}`
            );
          },
        });
    }
  }
  insertarActualizarConfiguracion(): void {
    let dataFormSeccion = this.formPlantillaSeccionPw.getRawValue();
    let index = this.gridPlantillasEdicionPw.data.indexOf(
      this.configuracionSecciones
    );
    let nombreTipo = this.listaCombos.seccionTipoContenidoPw.find(
      (y) => y.id == dataFormSeccion.idTipo
    ).nombre;
    if (index != -1) {
      this.configuracionSecciones.nombre = dataFormSeccion.nombre;
      this.configuracionSecciones.descripcion = dataFormSeccion.descripcion;
      this.configuracionSecciones.zonaWeb = dataFormSeccion.ordenSeccion;
      this.configuracionSecciones.idSeccionTipoContenido = dataFormSeccion.idTipo;
      (this.configuracionSecciones.nombreSeccionTipoContenido = nombreTipo),
        (this.configuracionSecciones.ordenEeb = dataFormSeccion.ordenWeb);
      this.configuracionSecciones.visibleWeb = dataFormSeccion.visibleWeb;
      if (
        dataFormSeccion.idTipo == 1 &&
        this.gridPlantillasEdicionSeccionPw.data.length > 0
      )
        this.configuracionSecciones.seccionTipoDetallePw =
          this.gridPlantillasEdicionSeccionPw.data;

      this.gridPlantillasEdicionPw.data[index] = this.configuracionSecciones;
    } else {
      this.nuevaConfiguracionSecciones.nombre = dataFormSeccion.nombre,
      this.nuevaConfiguracionSecciones.descripcion = dataFormSeccion.descripcion,
      this.nuevaConfiguracionSecciones.zonaWeb = dataFormSeccion.ordenSeccion,
      this.nuevaConfiguracionSecciones.idSeccionTipoContenido = dataFormSeccion.idTipo,
      this.nuevaConfiguracionSecciones.nombreSeccionTipoContenido = nombreTipo,
      this.nuevaConfiguracionSecciones.ordenEeb = dataFormSeccion.ordenWeb,
      this.nuevaConfiguracionSecciones.visibleWeb = dataFormSeccion.visibleWeb,
      this.nuevaConfiguracionSecciones.seccionTipoDetallePw =
        dataFormSeccion.idTipo == 1 &&
        this.gridPlantillasEdicionSeccionPw.data.length > 0
          ? this.gridPlantillasEdicionSeccionPw.data
          : [],
      this.gridPlantillasEdicionPw.data.push(this.nuevaConfiguracionSecciones);
    }
    this.gridPlantillasEdicionPw.loadData();
    console.log(this.gridPlantillasEdicionPw.data)
    this.limpiarCamposSeccionForm();
  }
  actualizar(): void {
    if (this.formPlantillaPw.valid) {
      let dataEnviada = this.formatearObjetoEnviar();
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.PlantillaPwActualizar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<PlantillaPw[]>) => {
            this.gridPlantillasPw.data = this.mapearContenidoGrilla(response.body);
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
            this.alertaService.notificationWarning(
              `Surgio un error: ${e.error.title}`
            );
          },
        });
    }
  }
  eliminar(dataSource: PlantillaPw): void {
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
            `${constApiPlanificacion.PlantillaPwEliminar}/${dataSource.id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if (response.body) {
                let idIndice = this.gridPlantillasPw.data.indexOf(dataSource);
                this.gridPlantillasPw.data.splice(idIndice, 1);
                this.gridPlantillasPw.loadData();
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
  mapearContenidoGrilla(dataGrilla: PlantillaPw[]): PlantillaPw[] {
    return dataGrilla.map(
      (x: PlantillaPw) => {
        return {
          ...x,
          nombreMaestroPw: this.listaCombos.plantillaMaestroPw.find(
            (y) => y.id == x.idPlantillaMaestroPw
          ).nombre,
        };
      }
    );
  }
  formatearObjetoEnviar(): any {
    let formPrincipal = this.formPlantillaPw.getRawValue();
    return {
      plantillaPw: {
        id: formPrincipal.id,
        nombre: formPrincipal.nombre,
        descripcion: formPrincipal.descripcion,
        idPlantillaMaestroPw: formPrincipal.idPlantillaMaestro,
        idRevisionPw: 0,
      },
      paises: [formPrincipal.idPaisPlantilla],
      seccionPw: this.gridPlantillasEdicionPw.data.map(
        (x: SeccionPlantillaPw) => {
          return {
            id: x.id,
            nombre: x.nombre,
            descripcion: x.descripcion,
            contenido: x.contenido,
            idPlantillaPw: x.idPlantillaPw,
            visibleWeb: x.visibleWeb,
            zonaWeb: x.zonaWeb,
            ordenEeb: x.ordenEeb,
            idSeccionTipoContenido: x.idSeccionTipoContenido,
            seccionTipoDetallePw: (x.seccionTipoDetallePw.length > 0 && x.seccionTipoDetallePw[0].id != null &&
                                   x.seccionTipoDetallePw[0].nombreTitulo != null && x.seccionTipoDetallePw[0].idSeccionTipoContenido != null) ?
              x.seccionTipoDetallePw.map((y: SeccionesTipoContenido) => {
                return {
                  id: y.id,
                  idSeccionPw: y.idSeccionPw,
                  nombreTitulo: y.nombreTitulo,
                  idSeccionTipoContenido: y.idSeccionTipoContenido,
                };
              }) : []
          };
        }
      ),
    };
  }
  limpiarCamposForm(): void {
    if (this.modalRefEditar != null) {
      this.modalRefEditar.close();
      this.modalRefEditar = null;
    }
    this.formPlantillaPw.reset();
    this.loaderModal = false;
  }
  limpiarCamposSeccionForm(): void {
    if (this.modalSeccionRefEditar != null) {
      this.modalSeccionRefEditar.close();
      this.modalSeccionRefEditar = null;
    }
    this.formPlantillaSeccionGrillaPw.reset();
    this.formPlantillaSeccionPw.reset();
  }
  identificarTipoGrilla(): boolean {
    let campoTipo = this.formPlantillaSeccionPw.get('idTipo').value;
    return campoTipo != null && campoTipo == 1 ? true : false;
  }
  insertarItemTipoGrilla(): void {
    let formData = this.formPlantillaSeccionGrillaPw.getRawValue();
    if (
      formData.nombre != '' &&
      formData.idTipo != null &&
      formData.idTipo != '' &&
      formData.idTipo != 0
    ) {
      let dataSubSeccionTipo = this.listaCombos.seccionTipoContenidoPw.find(
        (x) => x.id == formData.idTipo
      );
      this.gridPlantillasEdicionSeccionPw.data.push({
        id: 0,
        idSeccionPw: 0,
        nombreTitulo: formData.nombre,
        idSeccionTipoContenido: dataSubSeccionTipo.id,
        nombreSeccionTipoContenido: dataSubSeccionTipo.nombre,
      });
      this.formPlantillaSeccionGrillaPw.reset();
    } else {
      Swal.fire('Campo invalido', 'Uno de los campos no es validos', 'warning');
    }
  }
  eliminarConfiguracionSeccionGrilla(dataSource: any): void {
    let idIndice = this.gridPlantillasEdicionSeccionPw.data.indexOf(dataSource);
    Swal.fire({
      title: '¿Está seguro de quitar el registro?',
      text: '¡Se perdera la informacion!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.gridPlantillasEdicionSeccionPw.data.splice(idIndice, 1)
        this.gridPlantillasEdicionSeccionPw.loadData()
      };
    });
  }
  eliminarConfiguracion(dataSource: any): void {
    let idIndice = this.gridPlantillasEdicionPw.data.indexOf(dataSource);
    Swal.fire({
      title: '¿Está seguro de quitar el registro?',
      text: '¡Se perdera la informacion!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.gridPlantillasEdicionPw.data.splice(idIndice, 1)
        this.gridPlantillasEdicionPw.data = (this.gridPlantillasEdicionPw.data.length > 0) ? this.gridPlantillasEdicionPw.data : []
        this.gridPlantillasEdicionPw.loadData();
      };
    });
  }
}

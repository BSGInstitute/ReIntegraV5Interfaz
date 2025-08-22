import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { constApiMarketing } from '@environments/constApi';

/**
 * @module MarketingModule
 * @description Componente de Programa Critico  .
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 12/10/2022 Creacion de interfaces Grupo Filtro Programa Critico
 * * 13/10/2022 Implementaccion de funciones logicas
 */
@Component({
  selector: 'app-grupo-filtro-programa-critico',
  templateUrl: './grupo-filtro-programa-critico.component.html',
  styleUrls: ['./grupo-filtro-programa-critico.component.scss'],
})
export class GrupoFiltroProgramaCriticoComponent implements OnInit {
  @ViewChild('modalGrupoFiltroFormulario') modalGrupoFiltroFormulario: any;
  @ViewChild('detallemodalGrupoFiltroFormulario')
  detallemodalGrupoFiltroFormulario: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal
  ) {}

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal
  loaderGeneral=false;
  loaderGrid=false
  loaderModal: boolean = false;
  isNew: boolean = false;
  modalRef: any;
  carga = false;
  dataEditTemporal: any = {}; //data original
  listaSeleccion:any[]=[]
  dataAsociadosTemporal: any[];
  pageSizes: any = [5, 10, 20, 'All'];

  dataEstadoPrograma: Array<{
    id: number;
    nombre: string;
  }> = [
    { nombre: 'Activo', id: 0 },
    { nombre: 'Inactivo', id: 1 },
  ];

  cargarSubAreas(idArea: any) {
    this.comboSubArea = this.todoSubAreas.filter(
      (e: any) => e.idAreaCapacitacion == idArea
    );
  }

  changeFiltroForm(event: any, esArea: boolean) {
    console.log(event);
    if (esArea) {
      this.cargarSubAreas(event.id);
    }
    let dataForm: any = this.formAsociar.getRawValue();
    let filterArea: string =
      dataForm.area?.id != null ? dataForm.area.nombre : null;
    let filterSubArea: string =
      dataForm.subArea?.id != null ? dataForm.subArea.nombre : null;
    let filterEstado: string =
      dataForm.estadoPrograma?.id != null
        ? dataForm.estadoPrograma.nombre
        : null;
    let filtros: any[] = [];

    if (filterArea != null) {
      filtros.push({
        field: 'nombreAreaCapacitacion',
        operator: 'contains',
        value: filterArea,
      });
    }
    if (filterSubArea != null) {
      filtros.push({
        field: 'nombreSubAreaCapacitacion',
        operator: 'contains',
        value: filterSubArea,
      });
    }
    if (filterEstado != null) {
      filtros.push({
        field: 'estadoPGeneral',
        operator: 'contains',
        value: filterEstado,
      });
    }
    this.gridNoAsociado.filter = {
      logic: 'and',
      filters: filtros,
    };
  }

  gridNoAsociado: KendoGrid = new KendoGrid();
  gridAsociado: KendoGrid = new KendoGrid();
  gridGrupoFiltroPrograma: KendoGrid = new KendoGrid();

  formGrupoFiltroPrograma: FormGroup = this.formBuilder.group({
    id: [0],
    //NombreCompleto:[null],
    nombre: [''],

    descripcion: [''],
    asesores: '',
  });

  filtroFormularioRespuesta: any = {
    filtro: [],
  };

  comboPersonal: any[] = [];

  formAsociar: FormGroup = this.formBuilder.group({
    area: [null],
    subArea: [null],
    estadoPrograma: [null],
  });

  formNoAsociador: FormGroup = this.formBuilder.group({
    nombre: [null],
    nombreSubAreaCapacitacion: [null],
    nombreAreaCapacitacion: [null],
  });

  comboArea: any[] = [];
  comboSubArea: any[] = [];
  todoSubAreas: any[] = [];
  comboAsesor: any[] = [];

  ngOnInit(): void {
    this.cargarGrilla();
    this.obtenerCombos();
    this.ObtenerGrupoFIltroProgramaCritico();
    this.cargarGridNoAsociado();
    this.cargarGridAsociado();
    this.ObtenerFiltroPersonal2();
  }
  abrirModal(isNew: boolean, dataItem?: any) {
    console.log(isNew);
    this.isNew = isNew;
    this.formGrupoFiltroPrograma.reset();
    this.formGrupoFiltroPrograma.get('asesores').setValue([]);
    if (isNew) {
      // this.formGrupoFiltroPrograma.reset();
    } else {
      console.log(dataItem);
      this.loaderModal = false;
      this.dataEditTemporal = dataItem;
      this.formGrupoFiltroPrograma.patchValue(dataItem);
      this.ObtenerFiltroPersonal(dataItem.id);
    }

    this.modalRef = this.modalService.open(this.modalGrupoFiltroFormulario, {
      backdrop: 'static'
    });
  }

  guardarAsociacion(){
    this.loaderGeneral= true;
    let data: any = this.gridAsociado.data;
    let jsonEnvio = {
      listaPGeneral: data,
      usuario: this.usuario.userName,
      idGrupo: this.dataEditTemporal.id
    }
    console.log(jsonEnvio);
    this.integraService.postJsonResponse(constApiMarketing.GrupoFiltroProgramaGuardarAsociacion, JSON.stringify(jsonEnvio)).subscribe({
      next: (resp: any) => {
        this.alertaService.swalFire(
          'Guardado!',
          'Los datos se Procesaron Correctamente',
          'success'
        );
        this.loaderGeneral= false;
        console.log(resp.body)
      },
      error: (error) => {
        this.loaderGeneral= false;
        console.log(error);
        this.alertaService.notificationError(error.message);


      },

    });
  }

  abrirModal2(isNew: boolean, dataItem: any) {
    console.log(dataItem);
    this.loaderModal = false;
    this.isNew = isNew;
    this.dataEditTemporal = dataItem;
    //this.modalRef = this.modalService.open(this.detallemodalGrupoFiltroFormulario);
    this.modalService.open(this.detallemodalGrupoFiltroFormulario, {
      backdrop: 'static',
      size: 'xl',
    });
    this.obtenerPGeneralAsociado();
    this.obtenerAsociados();

  }
  obtenerPGeneralAsociado() {
    this.loaderGeneral= true;

    this.integraService
      .getJsonResponse(
        `${constApiMarketing.GrupoFiltroProgramaCriticoObtenerPGeneralAsociado}/${this.dataEditTemporal.id}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response);
          let stringData =JSON.stringify(response.body.listaPGeneral)
          this.gridNoAsociado.data = JSON.parse(stringData);
          this.dataAsociadosTemporal = JSON.parse(stringData);


         //this.gridAsociado.data = response.body.listaPGeneralPorGrupo;

         this.loaderGeneral= false;
        },

        error: (error) => {
          this.loaderGeneral= false;
          this.alertaService.notificationError(error.error);
        },
        complete: () => {},
      });
  }



  obtenerAsociados() {
    this.gridAsociado.loading = true;

    this.integraService
      .getJsonResponse(
        `${constApiMarketing.GrupoFiltroProgramaCriticoObtenerPGeneralAsociado}/${this.dataEditTemporal.id}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log("correcto",response);

          this.gridAsociado.data = response.body.listaPGeneralPorGrupo;
          this.gridAsociado.loading = false;
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
        complete: () => {},
      });
  }

  ObtenerFiltroPersonal(id: number) {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.GrupoFiltroProgramaObtenerAsesoresPorGrupoId}/${id}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          //this.gridGrupoFiltroPrograma.data= response.body;
          let datos = response.body;
          let ids: number[] = [];
          datos.forEach((e: any) => {
            ids.push(e.id);
          });
          this.formGrupoFiltroPrograma.get('asesores').setValue(ids);
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
        complete: () => {},
      });
  }
  ObtenerFiltroPersonal2() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.GrupoFiltroProgramaObtenerComboGrupoFiltroProgramaCritico}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.comboPersonal = response.body;
          //this.gridGrupoFiltroPrograma.data= response.body;
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
        complete: () => {},
      });
  }

  //obtenemos datos para la grilla
  ObtenerGrupoFIltroProgramaCritico() {
    this.loaderGrid= true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.GrupoFiltroProgramaCriticoObtenerTodo}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.gridGrupoFiltroPrograma.data = response.body;
          this.loaderGrid = false;
        },
        error: (error) => {
          this.loaderGrid=false;
          this.alertaService.notificationError(error.error);
        },
        complete: () => {},
      });
  }

  obtenerCombos() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.GrupoFiltroProgramaObtenerCombosAreaSubArea}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          let data = response.body;
          this.comboArea = data.listaAreaCapacitacion;
          this.comboSubArea = data.listaSubAreaCapacitacion;
          this.todoSubAreas = data.listaSubAreaCapacitacion;
        },

        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
      });
  }
  obtenerEstadoPGeneral() {}

  validFormGrupoFiltroPrograma(): boolean {
    if (this.formGrupoFiltroPrograma.invalid) {
      this.formGrupoFiltroPrograma.markAllAsTouched();
      return false;
    }
    return true;
  }
  crearGrupoFiltro() {
    console.log(this.formGrupoFiltroPrograma.getRawValue());
    if (this.validFormGrupoFiltroPrograma()) {
      // this.loaderModal = true;
      let datosFormulario = this.formGrupoFiltroPrograma.getRawValue();
      console.log(datosFormulario);

      let fechaActual = new Date();
      //todo: REGULARIZAR
      let jsonEnvio: any = {
        grupoFiltroProgramaCritico: {
          id: 0,
          nombre: datosFormulario.nombre,
          descripcion: datosFormulario.descripcion,
          // estado: true,
          // usuarioCreacion: 'margiory',
          // usuarioModificacion: 'margiory',
          // fechaCreacion: datePipeTransform(fechaActual),
          // fechaModificacion: datePipeTransform(fechaActual),
        },
        grupoFiltroProgramaCriticoPorAsesor: datosFormulario.asesores,
        usuario:this.usuario.userName,
        idGrupo: 0,
      };

      // let combo: any[] = [];

      // let jsonEnvio: any = {
      //   formulario: grupofiltro,

      // };

      console.log(JSON.stringify(jsonEnvio));

      this.integraService
        .insertar(
          constApiMarketing.GrupoFiltroProgramaObtenerInsertarGrupoFiltro,
          jsonEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response);

            this.ObtenerGrupoFIltroProgramaCritico();
            // this.ObtenerFiltroPersonal();

            this.gridGrupoFiltroPrograma.loadView();
            // this.listaFormularioSolicitud.unshift(formularioSolicitud);
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.alertaService.notificationError(error.error);
          },
          complete: () => {
            this.modalRef.close('submitted');
            this.alertaService.mensajeExitoso();
          },
        });
    } else this.formGrupoFiltroPrograma.markAllAsTouched();
  }

  ActualizarGrupoFiltro() {

    console.log(this.formGrupoFiltroPrograma.getRawValue());
    if (this.validFormGrupoFiltroPrograma()) {
      // this.loaderModal = true;
      let dataOriginal = this.dataEditTemporal;
      let datosFormulario = this.formGrupoFiltroPrograma.getRawValue();
      let fechaActual = new Date();
      // este es el que tiene los datos
      let formGrupoFiltroPrograma: any = {
        grupoFiltroProgramaCritico: {
          id: dataOriginal.id,
          nombre: datosFormulario.nombre,
          descripcion: datosFormulario.descripcion
        },
        grupoFiltroProgramaCriticoPorAsesor: datosFormulario.asesores,
        usuario: this.usuario.userName,
        idGrupo: dataOriginal.id,
      };

      let jsonEnvio: any = {
        formulario: formGrupoFiltroPrograma,
      };
      console.log(jsonEnvio);
      console.log(JSON.stringify(formGrupoFiltroPrograma));
      // resultado

      this.integraService
        .actualizar(
          constApiMarketing.GrupoFiltroProgramaObtenerActualizarGrupo,
          formGrupoFiltroPrograma
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response);

            this.ObtenerGrupoFIltroProgramaCritico();

            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.alertaService.notificationError(error.error);
          },
          complete: () => {
            this.modalRef.close('submitted');
            this.alertaService.mensajeExitoso();
          },
        });
    } else {
      this.formGrupoFiltroPrograma.markAllAsTouched();
    }
  }
  eliminarGrupo(dataItem: any) {
    //this.loaderGrid = true;

    console.log(dataItem);
    let index = this.gridGrupoFiltroPrograma.data.findIndex(
      (e: any) => e.id == dataItem.id
    );
    console.log(index);

    let formGrupoFiltroPrograma: any = {
      grupoFiltroProgramaCritico: {
        id: dataItem.id,
        nombre: dataItem.nombre,
        descripcion: dataItem.descripcion,
      },
      grupoFiltroProgramaCriticoPorAsesor: [],
      usuario:this.usuario.userName,
      idGrupo: dataItem.id,
    };
    console.log(formGrupoFiltroPrograma);

    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.gridGrupoFiltroPrograma.loading = true;
        this.integraService
          .deleteJsonResponse(
            constApiMarketing.GrupoFiltroProgramaObtenerEliminarGrupo,
            JSON.stringify(formGrupoFiltroPrograma)
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              this.gridGrupoFiltroPrograma.loading = false;
              if (response.body == true) {
                // this.listaFormulario.splice(index, 1);
                this.gridGrupoFiltroPrograma.data.splice(index, 1);
                this.gridGrupoFiltroPrograma.loadView()
                this.ObtenerGrupoFIltroProgramaCritico();
                this.alertaService.swalFire(
                  '¡Eliminado!',
                  'El registro ha sido eliminado.',
                  'success'
                );
              } else {
                this.alertaService.swalFire(
                  'Error!',
                  'Ocurrio un problema al eliminar.',
                  'warning'
                );
              }
            },
            error: (error) => {
              this.alertaService.notificationError(error.error);
            },
            complete: () => {},
          });
      }
    });
  }

  cargarGridNoAsociado() {
    this.gridNoAsociado.selectable = true;
    this.gridNoAsociado.sortable = true;
    this.gridNoAsociado.resizable = true;
    this.gridNoAsociado.filterable = 'menu';

    this.gridNoAsociado.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridNoAsociado.gridState = {
      skip: 0,
      take: 15,
    };

    this.gridNoAsociado.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridNoAsociado.gridState = resp.gridState;

        this.obtenerAsociados();
      },
    });
  }
  cargarGridAsociado() {
    this.gridAsociado.selectable = true;
    this.gridAsociado.sortable = true;
    this.gridAsociado.resizable = true;
    this.gridAsociado.filterable = 'menu';

    this.gridAsociado.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridAsociado.gridState = {
      skip: 0,
      take: 15,
    };
    this.gridAsociado.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridAsociado.gridState = resp.gridState;

        this.obtenerPGeneralAsociado();
      },
    });
  }

  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formGrupoFiltroPrograma.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formGrupoFiltroPrograma.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }

  agregarAsociado(dataItem: any){

    console.log(dataItem)
    // let index = this.gridNoAsociado.data.findIndex((e: any) => e.id  == dataItem.id)
    var datita=dataItem;
    datita.asignaVenta=false;
    this.gridNoAsociado.data = this.gridNoAsociado.data.filter((e: any) => e.id  != dataItem.id)
    this.gridAsociado.data = this.gridAsociado.data.concat([dataItem])
    // this.gridAsociado.data = this.gridAsociado.data
    // this.gridNoAsociado.data = this.gridNoAsociado.data
  }
  removerAsociado(dataItem: any){
    console.log(dataItem)
    // this.gridNoAsociado.data.push(dataItem);
    // let index = this.gridAsociado.data.findIndex((e: any) => e.id == dataItem.id)
    // this.gridAsociado.data.splice(index, 1);

    this.gridAsociado.data = this.gridAsociado.data.filter((e: any) => e.id  != dataItem.id)
    this.gridNoAsociado.data = this.gridNoAsociado.data.concat([dataItem])

    // this.gridAsociado.data = this.gridAsociado.data
    // this.gridNoAsociado.data = this.gridNoAsociado.data
  }
  //argamos la grilla y agregamos el paginado
  cargarGrilla() {
    this.gridGrupoFiltroPrograma.selectable = true;
    this.gridGrupoFiltroPrograma.sortable = true;
    this.gridGrupoFiltroPrograma.resizable = true;
    this.gridGrupoFiltroPrograma.filterable = 'menu';

    this.gridGrupoFiltroPrograma.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridGrupoFiltroPrograma.gridState = {
      skip: 0,
      take: 15,
    };

    this.gridGrupoFiltroPrograma.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridGrupoFiltroPrograma.gridState = resp.gridState;

        this.ObtenerGrupoFIltroProgramaCritico();
      },
    });
  }
}

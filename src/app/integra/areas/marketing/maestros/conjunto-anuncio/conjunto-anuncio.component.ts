import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ConjuntoAnuncio,
  ConjuntoAnuncioEnvio,
  ConjuntoAnuncioEnvio2,
} from '@integra/models/conjunto-anuncio';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';

import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';
import { constApiComercial, constApiMarketing } from '@environments/constApi';
import { Parametro } from '@shared/models/parametro';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { anyChanged } from '@progress/kendo-angular-common';
import {
  ProgramaGeneral,
  ProgramaGeneralObtenerComboUrl,
} from '@integra/models/programasGenerales';
import { LEADING_TRIVIA_CHARS } from '@angular/compiler/src/render3/view/template';

const pipe = new DatePipe('en-US');
const formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';

@Component({
  selector: 'app-conjunto-anuncio',
  templateUrl: './conjunto-anuncio.component.html',
  styleUrls: ['./conjunto-anuncio.component.scss'],
})
export class ConjuntoAnuncioComponent implements OnInit {
  @ViewChild('modalConjuntoAnuncio') modalConjuntoAnuncio: any;
  @ViewChild('modalVerConjuntoAnuncio') modalVerConjuntoAnuncio: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
  ) {}

  //varables
  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal


  gridConjuntoAnuncio: KendoGrid = new KendoGrid();
  successIcon: string = iconInputValidation;
  ConjuntoAnuncioTemp: any;
  modalRefTCOrigen: any;
  loaderGrid: boolean = false; //GRID SPINNER
  loaderModal: boolean = true; //MODAL SPINNER
  isNew: boolean = false;
  listaConjuntoAnuncio: ConjuntoAnuncio[] = [];
  listaCategoriaOrigen: any[] = [];
  listaProgramaGeneral: ProgramaGeneralObtenerComboUrl[] = [];
  cargaURL: ConjuntoAnuncio;
  labelUrl: string = '';
  idProveedor: number = 0;
  filtrosCategoriaOrigen: any = {
    filtroTipoCategoriaTodo: [],
  };
  url:string
  public data: Array<string>;
  public listaProgramas: any[] = [];
  public listaFiltradaProgramas: any[] = [];


  formConjuntoAnuncio: FormGroup = this.formBuilder.group({
    id: [0],
    nombre: [
      '',
      [
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    idConjuntoAnuncio_Facebook: [''],
    nombreCategoria: ['', [Validators.required]],
  });

  /*init*/

  ngOnInit(): void {
    this.cargarGrilla();
    this.obtenerConjuntoAnuncio(this.getFiltro());
    this.obtenerCategoriaOrigen();
    this.obtenerProgramaGeneral();
  }

  /*grilla*/

  getFiltro() {
    let filter: any = null;

    if (this.gridConjuntoAnuncio.gridState.filter != null) {
      filter = this.gridConjuntoAnuncio.gridState.filter.filters[0];
    }
    let page =
      (this.gridConjuntoAnuncio.gridState.skip +
        this.gridConjuntoAnuncio.gridState.take) /
      this.gridConjuntoAnuncio.gridState.take;
    let filtro: any = {
      page: page,
      pageSize: this.gridConjuntoAnuncio.gridState.take,
      skip: this.gridConjuntoAnuncio.gridState.skip,
      take: this.gridConjuntoAnuncio.gridState.take,
      filtroKendo: filter,
    };
    return filtro;
  }

  cargarGrilla() {
    this.gridConjuntoAnuncio.selectable = true;
    this.gridConjuntoAnuncio.sortable = true;
    this.gridConjuntoAnuncio.resizable = true;
    this.gridConjuntoAnuncio.filterable = 'menu';

    this.gridConjuntoAnuncio.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridConjuntoAnuncio.gridState = {
      skip: 0,
      take: 15,
    };

    this.gridConjuntoAnuncio.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridConjuntoAnuncio.gridState = resp.gridState;
        console.log(this.getFiltro());
        this.obtenerConjuntoAnuncio(this.getFiltro());
      },
    });
  }

  /*obtener*/

  obtenerConjuntoAnuncio(filtro?: any) {
    console.log('obtenerConjuntoAnuncio');
    this.gridConjuntoAnuncio.loading = true;
    this.gridConjuntoAnuncio.view.data = [];
    this.gridConjuntoAnuncio.view.total = 0;
    this.integraService
      .postJsonResponse(
        constApiMarketing.ConjuntoAnuncioListarConjuntoAnuncios,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          response.body.data = response.body.data.map((e: any) => ({
            ...e,
            fechaCreacionCampania: new Date(e.fechaCreacionCampania),
          }));
          this.gridConjuntoAnuncio.view = response.body;
          this.gridConjuntoAnuncio.loading = false;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
          this.gridConjuntoAnuncio.loading = false;
        },
        complete: () => {},
      });
  }

  obtenerNombreCategoriaOrigen(idProveedor: number) {
    let data = this.listaCategoriaOrigen.find((e: any) => e.id == idProveedor);
    if (data) {
      return data.nombre;
    } else {
      return '';
    }
  }

  obtenerCategoriaOrigen() {
    this.integraService
      .obtenerTodo(constApiMarketing.CategoriaOrigenObtenerCombo)
      .subscribe({
        next: (
          response: HttpResponse<
            {
              id: number;
              nombre: string;
            }[]
          >
        ) => {
          console.log(response.body);
          this.listaCategoriaOrigen = response.body;
          this.data = this.listaCategoriaOrigen;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  obtenerProgramaGeneral2() {
    this.integraService
      .obtenerTodo(constApiComercial.ProgramaGeneralObtenerComboUrl)
      .subscribe({
        next: (
          response: HttpResponse<
            {
              id: number;
              nombre: string;
              urlVersion: string;
            }[]
          >
        ) => {
          console.log(response.body);
          this.listaProgramaGeneral = response.body;
        },
        error: (error) => {
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }
  filterChangeFormulario(filtro: string) {
    if (!filtro) {
        this.listaFiltradaProgramas = [...this.listaProgramaGeneral];
        return;
    }

    this.listaFiltradaProgramas = this.listaProgramaGeneral.filter(programa =>
        programa.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    console.log("Filtro aplicado:", this.listaFiltradaProgramas);
}



obtenerProgramaGeneral() {
  this.integraService.getJsonResponse(constApiComercial.ProgramaGeneralObtenerComboUrl).subscribe({
      next: (response: HttpResponse<{ id: number; nombre: string; urlVersion: string; }[]>) => {
          console.log("Respuesta de la API:", response.body);

          if (!response.body || response.body.length === 0) {
              console.error("La API no devolvió datos");
              return;
          }

          this.listaProgramaGeneral = response.body;
          this.listaFiltradaProgramas = [...this.listaProgramaGeneral];
          console.log("Datos cargados correctamente", this.listaFiltradaProgramas);
      },
      error: (error) => {
          console.error(" Error al obtener programas", error);
          this.alertaService.mensajeError(error);
      },
      complete: () => {},
  });
}


  /*Programa General*/

  imprimir(e: any) {
    console.log(e);
   if (e.urlVersion != null) {
    this.url =
      e.urlVersion +
      '?idcategoriadato=' +
      this.idProveedor +
      '&id_campania=' +
      this.cargaURL.id;
    this.labelUrl = this.url;
  } else {
    this.labelUrl = '';
    Swal.fire('Informacion', 'No se encontro la url', 'warning');
  }



//   console.log(e);
//   if (e.urlVersion != null) {
//    this.integraService
//    .obtener(
//      constApiMarketing.ConjuntoAnuncioUrl + '/'+ e.id
//    )
//    .subscribe({
//      next: (response: HttpResponse<any>) => {
//        console.log(response.body);

//      },
//      error: (error) => {
//        this.mostrarMensajeError(error);
//      },
//      complete: () => {},
//    });
//  } else {
//    this.labelUrl = '';
//    Swal.fire('Informacion', 'No se encontro la url', 'warning');
//  }

  }

  borrarUrl(){
    this.labelUrl =''
    this.url = ''
  }

  /*Datos*/

  setDataConjuntoAnuncio(
    item: ConjuntoAnuncio,
    itemValue: ConjuntoAnuncioEnvio
  ): ConjuntoAnuncio {
    if (itemValue != null) {
      item.id = itemValue.id;
      item.nombre = itemValue.nombre;
      item.fechaCreacionCampania = new Date(itemValue.fechaCreacionCampania);
      item.idConjuntoAnuncio_Facebook = itemValue.idConjuntoAnuncio_Facebook;
      item.nombreCategoria = itemValue.nombreCategoria;
      item.idCategoriaOrigen = itemValue.idCategoriaOrigen;
    }
    return item;
  }

  procesarDataConjuntoAnuncio(
    dataItem: ConjuntoAnuncio,
    isNew: boolean
  ): ConjuntoAnuncioEnvio {
    let fechaActual = pipe.transform(new Date(), formatoFecha);
    let fechaCreacionCampania = isNew
      ? fechaActual
      : pipe.transform(dataItem.fechaCreacionCampania, formatoFecha);
    let fechaModificacion = fechaActual;

    let ConjuntoAnuncioEnvio: any = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      fechaCreacionCampania: dataItem.fechaCreacionCampania,
      idConjuntoAnuncio_Facebook: dataItem.idConjuntoAnuncio_Facebook,
      nombreCategoria: dataItem.nombreCategoria,
      idCategoriaOrigen: dataItem.idCategoriaOrigen,
    };
    return ConjuntoAnuncioEnvio;
  }

  procesarData2(dataItem: any, isNew: boolean) {
    console.log('Datos form', dataItem);
    let ConjuntoAnuncioEnvio: ConjuntoAnuncioEnvio2 = {
      id: isNew ? 0 : dataItem.id,
      nombre: dataItem.nombre,
      idCategoriaOrigen: dataItem.nombreCategoria,
      nombreCategoria: dataItem.nombreCategoria,
      idConjuntoAnuncio_Facebook: dataItem.idConjuntoAnuncio_Facebook,
      usuario: this.usuario.userName,
    };
    return ConjuntoAnuncioEnvio;
  }

  validFormConjuntoAnuncio(): boolean {
    if (this.formConjuntoAnuncio.invalid) {
      this.formConjuntoAnuncio.markAllAsTouched();
      return false;
    }
    return true;
  }

  /*Mensajes*/

  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false,
    });
  }

  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formConjuntoAnuncio.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }

  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formConjuntoAnuncio.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }

  mostrarMensajeExitoso() {
    this.loaderGrid = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute',
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 1600,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Guardado con exito',
    });
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese Nombre de la Campaña',
        noStartSpace: 'El Nombre no puede empezar con espacio',
        noEndSpace: 'El Nombre no puede terminar con espacio',
      },
      idConjuntoAnuncio_Facebook: {
        required: 'Ingrese un id',
      },
      nombreCategoria: {
        required: 'Seleccione una categoria',
      },
    };

    let formControl: FormControl = this.formConjuntoAnuncio.get(
      controlName
    ) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }

    return null;
  }

  mostrarMensajeEliminar(dataItem: any, index: number) {
    // Swal.fire({
    //   title: '¿Está seguro de eliminar el registro?',
    //   text: '¡No podrás revertir esto!',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonColor: '#4C5FC0',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: '¡Si, Eliminalo!',
    //   allowOutsideClick: false
    // }).then((result) => {
    //   if (result.isConfirmed) {
    //     this.eliminarConjuntoAnuncio(param.dataItem, param.index);
    //   }
    // });

    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.eliminarConjuntoAnuncio(dataItem.id, index);
        this.gridConjuntoAnuncio.loading = false;
      }
    });
  }

  cargarTipoInteraccion(event: any): void {
    this.filtrosCategoriaOrigen = [];
    // this.filtrosCategoriaOrigen = this.filtrosCategoriaOrigen.filtroTipoInteraccion.filter((x: any)=>x.id==event)
  }

  /*Funciones*/

  crearConjuntoAnuncio() {
    if (this.validFormConjuntoAnuncio()) {
      this.loaderModal = true;


      let dataFormConjuntoAnuncio = this.formConjuntoAnuncio.getRawValue();

      let ConjuntoAnuncioEnvio: ConjuntoAnuncioEnvio2 = this.procesarData2(
        dataFormConjuntoAnuncio,
        true
      );

      console.log(this.formConjuntoAnuncio.getRawValue())
      console.log(ConjuntoAnuncioEnvio);

      this.integraService
        .insertar(
          constApiMarketing.ConjuntoAnuncioInsertar,
          ConjuntoAnuncioEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);

            let categoria = this.listaCategoriaOrigen.find(
              (e) => e.id == response.body.idCategoriaOrigen
            );

            console.log(categoria);
            let respuesta: ConjuntoAnuncio = {
              id: response.body.id,
              nombre: response.body.nombre,
              idConjuntoAnuncio_Facebook:
                response.body.idConjuntoAnuncio_Facebook,
              fechaCreacionCampania: response.body.fechaCreacionCampania,
              nombreCategoria: categoria.nombre,
              idCategoriaOrigen: categoria.id,
            };
            this.obtenerConjuntoAnuncio(this.getFiltro());
            //this.ConjuntoAnuncioTemp = this.setDataConjuntoAnuncio(ConjuntoAnuncio, response.body);
          },
          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRefTCOrigen.close();
            this.alertaService.mensajeExitoso();
          },
        });
    } else this.formConjuntoAnuncio.markAllAsTouched();
  }

  actualizarConjuntoAnuncio() {
    if (this.validFormConjuntoAnuncio()) {
      this.loaderModal = true;

      let dataFormConjuntoAnuncio = this.formConjuntoAnuncio.getRawValue();

      let ConjuntoAnuncioEnvio: ConjuntoAnuncioEnvio2 = this.procesarData2(
        dataFormConjuntoAnuncio,
        false
      );
      console.log(ConjuntoAnuncioEnvio);

      this.integraService
        .actualizar(
          constApiMarketing.ConjuntoAnuncioActualizar,
          ConjuntoAnuncioEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log('Datos respuesta', response.body);
            let categoria = this.listaCategoriaOrigen.find(
              (e) => e.id == response.body.idCategoriaOrigen
            );

            let conjuntoAnuncio: ConjuntoAnuncio = Object.assign(
              this.ConjuntoAnuncioTemp,
              {
                id: response.body.id,
                nombre: response.body.nombre,
                idConjuntoAnuncio_Facebook:
                  response.body.idConjuntoAnuncio_Facebook,
                fechaCreacionCampania: new Date(
                  response.body.fechaCreacionCampania
                ),
                nombreCategoria: categoria.nombre,
                idCategoriaOrigen: categoria.id,
              }
            );
            this.ConjuntoAnuncioTemp = this.setDataConjuntoAnuncio(
              conjuntoAnuncio,
              response.body
            );

            this.obtenerConjuntoAnuncio(this.getFiltro());
            this.gridConjuntoAnuncio.view.data.forEach((data: any) => {
              if (data.id == response.body.id) {
                (data.nombre = response.body.nombre),
                  (data.idConjuntoAnuncio_Facebook =
                    response.body.idConjuntoAnuncioFacebook),
                  (data.fechaCreacionCampania = new Date(
                    response.body.fechaCreacionCampania
                  ));

                data.idCategoriaOrigen = response.body.idCategoriaOrigen;
                data.idProveedor = response.body.idCategoriaOrigen;
              }
            });
          },
          error: (error) => {
            this.loaderModal = false;
            console.log(error);
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModal = true;
            this.modalRefTCOrigen.close();
            this.mostrarMensajeExitoso();
          },
        });
    } else this.formConjuntoAnuncio.markAllAsTouched();
  }



  eliminarConjuntoAnuncio(id: number, index: number) {
    this.gridConjuntoAnuncio.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    console.log(params);
    this.integraService
      .eliminarPorPathParams(constApiMarketing.ConjuntoAnuncioEliminar, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.loaderGrid = false;
          if (response.body == true) {
            // this.listaConjuntoAnuncio.splice(index, 1);
            this.gridConjuntoAnuncio.data.splice(index, 1);
            this.gridConjuntoAnuncio.loading = false;
            this.obtenerConjuntoAnuncio(this.getFiltro());
            Swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
          }
        },
        error: (error) => {
          this.loaderGrid = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.gridConjuntoAnuncio.loading = false;
        },
      });
  }

  reloadConjuntoAnuncio() {
    this.obtenerConjuntoAnuncio(this.getFiltro());
  }

  /*Modales*/

  VerModalConjuntoAnuncio(
    isNew: boolean,
    dataItem?: ConjuntoAnuncio,
    index?: number
  ) {
    console.log(dataItem)
    this.cargaURL = dataItem;
    this.loaderModal = false;
    // this.tipoInteraccionPorFormulario = [];
    this.isNew = isNew;
    this.modalRefTCOrigen = this.modalService.open(
      this.modalVerConjuntoAnuncio
    );
    if (dataItem != null) {
      this.ConjuntoAnuncioTemp = dataItem;
      this.idProveedor = dataItem.idProveedor;
      this.formConjuntoAnuncio.patchValue(this.ConjuntoAnuncioTemp);
      console.log(dataItem.id);

      // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
    }
  }

  abrirModalConjuntoAnuncio(
    isNew: boolean,
    dataItem?: ConjuntoAnuncio,
    index?: number
  ) {
    console.log(dataItem);
    this.loaderModal = false;
    this.formConjuntoAnuncio.reset();
    // this.tipoInteraccionPorFormulario = [];
    this.isNew = isNew;
    if (dataItem != null) {
      this.ConjuntoAnuncioTemp = dataItem;
      this.formConjuntoAnuncio.patchValue(this.ConjuntoAnuncioTemp);
      this.formConjuntoAnuncio
        .get('nombreCategoria')
        .setValue(dataItem.idProveedor);
      console.log(dataItem.idCategoriaOrigen);
      console.log(dataItem.idProveedor);
      // this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
    }
    this.modalRefTCOrigen = this.modalService.open(this.modalConjuntoAnuncio);
  }

  abrirModalVerDatos(data: any) {
    this.ConjuntoAnuncioTemp = data;
    this.modalService.open(this.modalVerConjuntoAnuncio);
  }

  gridEventsConjuntoAnuncio(e: any): void {
    console.log(e);
    switch (e.action) {
      case 'edit':
        this.abrirModalConjuntoAnuncio(e.isNew, e.dataItem, e.index);
        break;
      case 'ver':
        this.abrirModalVerDatos(e.dataItem);
        break;
      case 'add':
        this.abrirModalConjuntoAnuncio(e.isNew, e);
        break;
      case 'remove':
        this.mostrarMensajeEliminar(e.dataItem, e.index);
        break;
      case 'reload':
        this.reloadConjuntoAnuncio();
        break;
    }
  }

  handleFilter(value:any) {
    console.log(value)
    this.data = this.listaCategoriaOrigen.filter(
      (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  changeCategoria(value:any){
    console.log(value)
  }
}

import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiMarketing, constApiPlanificacion } from '@environments/constApi';
import {
  campoContacto,
  FormularioSolicitud,
  FormularioSolicitudEnvio,
} from '@integra/models/formulario-solicitud';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Parametro } from '@shared/models/parametro';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-formulario-solicitud',
  templateUrl: './formulario-solicitud.component.html',
  styleUrls: ['./formulario-solicitud.component.scss'],
})
export class FormularioSolicitudComponent implements OnInit {
  @ViewChild('modalFormularioSolicitud') modalFormularioSolicitud: any;

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


  successIcon: string = iconInputValidation;

  formFormularioSolicitud: FormGroup = this.formBuilder.group({
    id: [0],
    idFormularioRespuesta: ['', [Validators.required]],
    campania: ['', [Validators.required]],
    proveedor: [null],
    codigo: [null],
    idFormularioSolicitudTextoBoton: ['', [Validators.required]],
    campos: [null],
  });

  modalRef: any;
  loaderModal: boolean = false;
  isNew: boolean = false;

  filtrosGenerales: any = {
    textoBoton: [],
    campoContacto: [],
    categoriaOrigen: [],
    formularioRespueta: [],
    campoContactoTodo: [],
  };
  listaCampo: campoContacto[] = [];

  //FILTROS
  dataFormularioRespuesta: any[] = []; //data filtrada
  sourceFormularioRespuesta: any[] = []; //data original
  dataCampania: any[] = []; //data filtrada
  sourceCampania: any[] = []; //data original
  dataEditTemporal: any = {}; //data original

  gridFormularioSolicitud: KendoGrid = new KendoGrid();
  gridCampoFormulario: KendoGrid = new KendoGrid();

  ngOnInit(): void {
    this.cargarGrilla();
    this.obtenerFormularioSolicitud();
    this.obtenerFiltros();
  }

  obtenerFiltros() {
    this.integraService
      .getJsonResponse(`${constApiMarketing.FormularioSolicitudObtenerFiltros}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.filtrosGenerales = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }

  getNombreTextoBoton(id: number) {
    let data = this.filtrosGenerales.textoBoton.find((e: any) => e.id === id);
    return data != null ? data.textoBoton : '';
  }

  getShowSuccessIcon(controlName: string): boolean {
    let formControl: FormControl = this.formFormularioSolicitud.get(
      controlName
    ) as FormControl;
    return (
      !this.getValidControl(controlName) &&
      formControl.value != null &&
      formControl.value != ''
    );
  }
  getValidControl(controlName: string): boolean {
    let formControl: FormControl = this.formFormularioSolicitud.get(
      controlName
    ) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true;
    }
    return false;
  }

  getErrorMessage(controlName: string): string {
    let erroMsj: any = {
      idFormularioRespuesta: {
        required: 'Formulario Respuesta es Obligatorio',
      },
      campania: { required: 'Proveedor es Obligatorio' },

      idFormularioSolicitudTextoBoton: {
        required: 'Texto Boton es Obligatorio',
      },
    };
    let formControl: FormControl = this.formFormularioSolicitud.get(
      controlName
    ) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }

    return null;
  }

  /**
   * Funcion que permitira cargar y obtener los  de datos Formulario respuesta.
   */

  filtroFormularioRespuesta(value: string, context: DropDownListComponent) {
    if (value.length >= 4) {
      context.loading = true;
      this.integraService
        .postJsonResponse(
          constApiMarketing.FormularioSolicitudObtenerFormularioRespuestaFiltro,
          JSON.stringify({ valor: value })
        )
        .subscribe({
          next: (response: any) => {
            context.loading = false;
            console.log(response.body);
            this.sourceFormularioRespuesta = response.body.slice();
            this.dataFormularioRespuesta = response.body.slice();
          },
        });
    } else if (value.length >= 1) {
      this.dataFormularioRespuesta = [];
    } else {
      this.dataFormularioRespuesta = this.sourceFormularioRespuesta;
    }
  }

  /**
   * Funcion que permitira cargar y obtener datos fiitro  Campania.
   */

  filtroCampania(value: string, context: DropDownListComponent) {
    if (value.length >= 4) {
      context.loading = true;
      this.integraService
        .postJsonResponse(
          constApiMarketing.FormularioSolicitudObtenerConjuntoAnuncioFiltro,
          JSON.stringify({ valor: value })
        )
        .subscribe({
          next: (response: any) => {
            context.loading = false;
            console.log(response.body);
            this.sourceCampania = response.body.slice();
            this.dataCampania = response.body.slice();
          },
        });
    } else if (value.length >= 1) {
      this.dataCampania = [];
    } else {
      this.dataCampania = this.sourceCampania;
    }
  }

  /**
   * Funcion que permitira  pasar y cargar datos(proveedor, codigo) de campania .
   */

  cambioCampania(dataCampania: any) {
    // [valuePrimitive] = true solo captura el valueField="id"
    //  solo captura todo el objeto
    console.log(dataCampania);
    // console.log(this.formFormularioSolicitud);
    this.formFormularioSolicitud
      .get('proveedor')
      .setValue(dataCampania.nombreProveedor);
    if (dataCampania.codigo !== 'Vacio') {
      this.formFormularioSolicitud.get('codigo').setValue(dataCampania.codigo);
    } else {
      this.formFormularioSolicitud.get('codigo').setValue('');
    }
  }

  setDataFormularioSolicitud(
    item: FormularioSolicitud,
    itemValue: any
  ): FormularioSolicitud {
    console.log(itemValue);
    // if (itemValue != null) {
    //   this.jsonEnvio.id = itemValue.id;
    //   this.jsonEnvio.nombre = itemValue.nombre;
    //   //this.jsonEnvio.formularioRespuesta = itemValue.formularioRespuesta;
    //   this.jsonEnvio.codigo = itemValue.codigo;
    //   this.jsonEnvio.nombreCampania = itemValue.nombreCampania;
    //   this.jsonEnvio.idCampania = itemValue.idCampania;
    //   this.jsonEnvio.proveedor = itemValue.proveedor;
    //   this.jsonEnvio.tipoSegmento = itemValue.tipoSegmento;
    //   this.jsonEnvio.codigoSegmento = itemValue.codigoSegmento;
    //   this.jsonEnvio.tipoEvento = itemValue.tipoEvento;
    //   this.jsonEnvio.uRLBotonInvitacionPagina = itemValue.uRLBotonInvitacionPagina;

    //   console.log(this.gridCampoFormulario)
    //   console.log(this.gridCampoFormulario.data.length);
    //   this.gridCampoFormulario.data.forEach((element:any) => {
    //     var cc:campoContacto={
    //       id:element.idCampoContacto,
    //       nombre:element.nombre,
    //       nroVisitas:element.nroVisitas,
    //       siempre:element.siempre,
    //       inteligente:element.inteligente,
    //       probabilida:element.probabilidad,
    //     }
    //     this.jsonEnvio.Campo.push(cc);
    //   });
    // }
    return item;
  }

  /**
   * Funcion que permitira cargar datos CampoContacto segun sus campos requeridos.
   */

  procesarFormularioSolicitud(dataItem: any, isNew: boolean) {
    console.log(dataItem);
    if (dataItem != null) {
      console.log(this.gridCampoFormulario);
      console.log(this.gridCampoFormulario.data.length);
      var campo: Array<campoContacto> = [];
      this.gridCampoFormulario.data.forEach((element: any) => {
        var cc: campoContacto = {
          Id: element.idCampoContacto,
          Nombre: element.nombre,
          NroVisitas: 0,
          Siempre: element.siempre,
          Inteligente: element.inteligente,
          Probabilidad: element.probabilidad,
        };
        campo.push(cc);
      });
      // this.jsonenvio.formulario = this.formulario;
      // this.jsonenvio.campo = campo;
    }
  }

  changeCampo(dataCampo: any) {
    console.log(dataCampo);
    if (dataCampo.length == 0) {
      this.gridCampoFormulario.data = [];
    }
    if (dataCampo.length > 0) {
      console.log(this.gridCampoFormulario.dataItemEditTemp?.campos);
      const camposOriginal =
        this.gridCampoFormulario.dataItemEditTemp?.campos != null
          ? this.gridCampoFormulario.dataItemEditTemp?.campos
          : [];

      for (let i = 0; i < this.gridCampoFormulario.data.length; i++) {
        const campo = this.gridCampoFormulario.data[i];
        let index = dataCampo.findIndex((e: any) => e == campo.idCampoContacto);
        if (index == -1) {
          this.gridCampoFormulario.data.splice(i, 1);
        }
      }

      dataCampo.forEach((element: any) => {
        let campo = this.filtrosGenerales.campoContacto.find(
          (e: any) => e.id == element
        );
        let dataItemGrid = this.gridCampoFormulario.data.findIndex(
          (e: any) => e.idCampoContacto == element
        );
        if (campo != -1 && dataItemGrid == -1) {
          let campoOriginal = camposOriginal.find(
            (e: any) => e.idCampoContacto == campo.id
          );
          let campoNuevo: any = {
            id: 0,
            idFormularioSolicitud: 0,
            idCampoContacto: campo.id,
            nroVisitas: '',
            codigo: '',
            estado: null,
            nombre: campo.nombre,
            siempre: false,
            inteligente: false,
            probabilidad: false,
          };
          if (campoOriginal != -1) {
            campoNuevo = Object.assign(campoNuevo, campoOriginal);
          }
          this.gridCampoFormulario.data.push(campoNuevo);
        }
      });
      console.log(this.gridCampoFormulario);
    }
  }


  /**
   * Funcion que permitira  crear nuevo registro en el mmodal.
   */

  crearFormularioSolicitud() {
    console.log(this.formFormularioSolicitud.getRawValue());
    if (this.validFormFormularioSolicitud()) {
      // this.loaderModal = true;
      let datosFormulario = this.formFormularioSolicitud.getRawValue();
      let formularioSolicitud: any = {
        id: 0,
        idFormularioRespuesta: datosFormulario.idFormularioRespuesta,
        nombre: datosFormulario.codigo,
        codigo: datosFormulario.codigo,
        nombreCampania: datosFormulario.campania?.nombre,
        idCampania: datosFormulario.campania?.id,
        proveedor: datosFormulario.proveedor,
        idFormularioSolicitudTextoBoton:
        datosFormulario.idFormularioSolicitudTextoBoton,
        tipoSegmento: 0,
        codigoSegmento: 'FRLPG',
        tipoEvento: 0,
        usuario:this.usuario.userName,
      };
      let campos: any[] = [];
      let contador: number = 0;
      this.gridCampoFormulario.data.forEach((e: any) => {
        campos.push({
          id: e.idCampoContacto,
          nombre: e.nombre,
          nroVisitas: ++contador,
          siempre: e.siempre,
          inteligente: e.inteligente,
          probabilidad: e.probabilidad,
        });
      });

      let jsonEnvio: any = {
        formulario: formularioSolicitud,
        campo: campos,
      };

      console.log(jsonEnvio);
      this.integraService
        .insertar(
          constApiMarketing.FormularioSolicitudInsertarFormularioSolicitud,
          jsonEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response);

            this.obtenerFormularioSolicitud();
            this.gridFormularioSolicitud.loadView();
            // this.listaFormularioSolicitud.unshift(formularioSolicitud);
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.modalRef.close('submitted');
            this.alertaService.mensajeExitoso();
          },
        });
    } else this.formFormularioSolicitud.markAllAsTouched();
  }

  /**
   * Funcion que permitira  actulizr data nueve  y antigua de
   * grilla priciapal y grilla modal.
   */

  actualizarFormularioSolicitud() {
    console.log(this.formFormularioSolicitud.getRawValue());
    if (this.validFormFormularioSolicitud()) {
      // this.loaderModal = true;
      let dataOriginal = this.dataEditTemporal;
      let datosFormulario = this.formFormularioSolicitud.getRawValue();
      let formularioSolicitud: any = {
        id: dataOriginal.id,
        idFormularioRespuesta: datosFormulario.idFormularioRespuesta,
        nombre: datosFormulario.codigo,
        codigo: datosFormulario.codigo,
        nombreCampania: datosFormulario.campania?.nombre,
        idCampania: datosFormulario.campania?.id,
        proveedor: datosFormulario.proveedor,
        idFormularioSolicitudTextoBoton:
          datosFormulario.idFormularioSolicitudTextoBoton,
        tipoSegmento: dataOriginal.tipoSegmento,
        codigoSegmento: dataOriginal.codigoSegmento,
        tipoEvento: dataOriginal.tipoEvento,
        usuario:this.usuario.userName,
      };
      let campos: any[] = [];
      let contador: number = 0;
      this.gridCampoFormulario.data.forEach((e: any) => {
        campos.push({
          id: e.idCampoContacto,
          nombre: e.nombre,
          nroVisitas: ++contador,
          siempre: e.siempre,
          inteligente: e.inteligente,
          probabilidad: e.probabilidad,
        });
      });

      let jsonEnvio: any = {
        formulario: formularioSolicitud,
        campo: campos,
      };

      console.log(jsonEnvio);
      this.integraService
        .actualizar(
          constApiMarketing.FormularioSolicitudActualizarFormularioSolicitud,
          jsonEnvio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response);
            // this.gridFormularioSolicitud.assignValues(this.dataEditTemporal, datosFormulario)
            this.obtenerFormularioSolicitud();
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.modalRef.close('submitted');
            this.alertaService.mensajeExitoso();
          },
        });
    } else this.formFormularioSolicitud.markAllAsTouched();
  }





  /**
   * Funcion que permitira  Eleminar datos de grilla.
   */
  eliminarFormularioSolicitud(dataItem: FormularioSolicitud, index: number) {
    //this.loaderGrid = true;
    this.gridFormularioSolicitud.loading = false;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },
      { clave: 'usuario', valor: this.usuario.userName },
    ];
    this.integraService
      .eliminarPorPathParams(
        constApiMarketing.FormularioSolicitudEliminar,
        params
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          //this.loaderGrid = false;
          if (response.body == true) {
            // this.listaFormulario.splice(index, 1);
            this.gridFormularioSolicitud.data.splice(index, 1);
            this.gridFormularioSolicitud.loading = false;
            this.obtenerFormularioSolicitud();
            //this.gridFormularioSolicitud.loadView()
            // this. .splice(index, 1);

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
          // this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

  /**
   * Funcion que permitira  obtener datos para llenar Grilla.
   */
  obtenerFormularioSolicitud(filtroGrid?: any) {
    this.gridFormularioSolicitud.loading = true;
    let filtro: any;
    if (filtroGrid != null) {
      filtro = filtroGrid;
    } else {
      filtro = {
        paginador: {
          page: 1,
          pageSize: this.gridFormularioSolicitud.gridState.take,
          skip: this.gridFormularioSolicitud.gridState.skip,
          take: this.gridFormularioSolicitud.gridState.take,
        },
      };
    }
    this.integraService
      .postJsonResponse(
        `${constApiMarketing.FormularioSolicitudObtenerFormularioSolicitud}`,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (
          response: HttpResponse<{ data: FormularioSolicitud[]; total: number }>
        ) => {
          this.gridFormularioSolicitud.view = response.body;

          this.gridFormularioSolicitud.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }

  /**
   * Funcion que permitira  peremite llenar grilla, realiza proceso de paginacion
   *  implememtacion de comlomnas con los cmapos formulrio solicitud.
   */

  cargarGrilla() {
    this.gridFormularioSolicitud.getRemoveEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.alertaService.mensajeEliminar().then((result) => {
          if (result.isConfirmed) {
            this.eliminarFormularioSolicitud(resp.dataItem, resp.index);
            alert('se elimino');
          }
        });
      },
    });
    this.gridFormularioSolicitud.getDataStateChance$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridFormularioSolicitud.gridState = resp.gridState;
        let filter: any = null;
        if (resp.gridState.filter != null) {
          filter = resp.gridState.filter.filters[0];
        }
        let filtro = {
          paginador: {
            page:
              (resp.gridState.skip + resp.gridState.take) / resp.gridState.take,
            pageSize: this.gridFormularioSolicitud.gridState.take,
            skip: this.gridFormularioSolicitud.gridState.skip,
            take: this.gridFormularioSolicitud.gridState.take,
          },
          filter: filter,
        };
        console.log(filtro);
        this.obtenerFormularioSolicitud(filtro);
      },
    });
    this.gridFormularioSolicitud.filterable = 'menu';
    this.gridFormularioSolicitud.resizable = true;
    this.gridFormularioSolicitud.sortable = true;
    this.gridFormularioSolicitud.gridState = {
      skip: 0,
      take: 15,
      sort: [
        {
          field: 'fechaModificacion',
          dir: 'desc',
        },
      ],
    };
    this.gridFormularioSolicitud.pageable = {
      buttonCount: 5,
      info: true,
      type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom',
    };
    this.gridFormularioSolicitud.columns = [
      {
        title: 'Formulario Respuesta',
        field: 'formularioRespuesta',
        width: 300,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Nombre',
        field: 'nombre',
        width: 300,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Codigo',
        field: 'codigo',
        width: 200,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Campaña',
        field: 'nombreCampania',
        width: 100,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Proveedor',
        field: 'proveedor',
        width: 80,
        filterable: true,
        headerClass: 'header-grid-integra',
      },
      {
        title: 'Texto Boton',
        field: 'idFormularioSolicitudTextoBoton',
        width: 200,
        filterable: false,
        headerClass: 'header-grid-integra',
      },
    ];

    this.gridCampoFormulario.formGroup = this.formBuilder.group({
      idFormularioRespuesta: '',
      nombre: '',
      siempre: '',
      inteligente: '',
      probabilidad: '',
    });
    this.gridCampoFormulario.getCellCloseEvent$().subscribe({
      next: (resp: any) => {
        this.gridCampoFormulario.assignValues(
          resp.dataItem,
          resp.formGroup.value
        );
      },
    });
  }

  validFormFormularioSolicitud(): boolean {
    if (this.formFormularioSolicitud.invalid) {
      this.formFormularioSolicitud.markAllAsTouched();
      return false;
    }
    return true;
  }

  /**
   * Funcion que permitira  Abrir modal  dende se mostraran los imputs.
   */

  abrirModal(isNew?: boolean, dataItem?: any) {
    this.gridCampoFormulario.data = [];
    this.dataCampania = [];
    this.dataFormularioRespuesta = [];
    this.formFormularioSolicitud.reset();
    let data = { dataItem: dataItem, isNew: isNew };
    console.log({ dataItem: dataItem, isNew: isNew });
    this.dataEditTemporal = dataItem;
    // alert(`se abrio el modal ${JSON.stringify(data)}`);
    this.isNew = isNew;
    if (!isNew) {
      this.gridCampoFormulario.dataItemEditTemp = dataItem;
      this.integraService
        .getJsonResponse(
          `${constApiMarketing.FormularioSolicitudObtenerCampoFormularioPorIdFormularioSolicitud}/${dataItem.id}`
        )
        .subscribe({
          next: (response: any) => {
            console.log(response);
            this.gridCampoFormulario.data = response.body;
            let idsCampos: number[] = [];
            response.body.forEach((element: any) => {
              idsCampos.push(element.idCampoContacto);
            });

            const formularioRespuesta = {
              id: dataItem.idFormularioRespuesta,
              nombre: dataItem.formularioRespuesta,
            };
            this.dataFormularioRespuesta.push(formularioRespuesta);

            this.formFormularioSolicitud.patchValue(dataItem);
            const campania = {
              id: dataItem.idCampania,
              nombre: dataItem.nombreCampania,
            };
            this.dataCampania.push(campania);
            this.formFormularioSolicitud.get('campania').setValue(campania);
            this.formFormularioSolicitud.get('campos').setValue(idsCampos);

            this.gridCampoFormulario.dataItemEditTemp.campos = response.body;
          },
        });
    } else {
      this.gridCampoFormulario.dataItemEditTemp = null;
      let idsCampos: number[] = [];
      this.filtrosGenerales.campoContacto.forEach((element: any) => {
        idsCampos.push(element.id);
        let campoNuevo: any = {
          id: 0,
          idFormularioSolicitud: 0,
          idCampoContacto: element.id,
          nroVisitas: '',
          codigo: '',
          estado: null,
          nombre: element.nombre,
          siempre: false,
          inteligente: false,
          probabilidad: false,
        };
        this.gridCampoFormulario.data.push(campoNuevo);
      });
      this.formFormularioSolicitud.get('campos').setValue(idsCampos);
    }
    this.modalRef = this.modalService.open(this.modalFormularioSolicitud, {
      backdrop: 'static',
      size: 'lg',
    });
  }

  industriaCombo: any[] = [];
  cargoCombo: any[] = [];
  areaTrabajoCombo: any[] = [];
  areaFormacionCombo: any[] = [];

  // Obtener Industria Combo
  obtenerIndustriaCombo() {
    this.integraService
      .getJsonResponse(constApiPlanificacion.IndustriaObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.industriaCombo = response.body;
        },
        error: () => {
          this.alertaService.mensajeError("Error al cargar Industria");
        },
      });
  }

  // Obtener Cargo Combo
  obtenerCargoCombo() {
    this.integraService
      .getJsonResponse(constApiPlanificacion.CargoObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.cargoCombo = response.body;
        },
        error: () => {
          this.alertaService.mensajeError("Error al cargar Cargo");
        },
      });
  }

  // Obtener Area Trabajo Combo
  obtenerAreaTrabajoCombo() {
    this.integraService
      .getJsonResponse(constApiPlanificacion.AreaTrabajoObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.areaTrabajoCombo = response.body;
        },
        error: () => {
          this.alertaService.mensajeError("Error al cargar Area de Trabajo");
        },
      });
  }

  // Obtener Area Formacion Combo
  obtenerAreaFormacionCombo() {
    this.integraService
      .getJsonResponse(constApiPlanificacion.AreaFormacionObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.areaFormacionCombo = response.body;
        },
        error: () => {
          this.alertaService.mensajeError("Error al cargar Area de Formación");
        },
      });
  }


}

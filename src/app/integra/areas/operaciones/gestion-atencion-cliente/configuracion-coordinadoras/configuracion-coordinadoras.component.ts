import { anyChanged } from '@progress/kendo-angular-common';
import { Parametro } from '@shared/models/parametro';
import {
  SubEstadoMatriculaFiltroConfiguracionCoordinadora,
  FiltroConfiguracionCoordinadoraEstadoMatricula,
  CentroCostoPadreCentroCostoIndividual,
  Ipersonal,
  IInsertarConfiguracionCoordinadorEnvio,
  IAprobarMaterialVersion,
  ICentroCostoAsignado,
} from './../../models/configuracion-coordinadoraas';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { constApiOperaciones } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { KendoGrid } from '@shared/models/kendo-grid';
import {
  IConfiguracionCentroCostoCoordinador,
  IObtenerCombosConfiguracionCoordinador,
} from '../../models/configuracion-coordinadoraas';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { UserService } from '@shared/services/user.service';
@Component({
  selector: 'app-configuracion-coordinadoras',
  templateUrl: './configuracion-coordinadoras.component.html',
  styleUrls: ['./configuracion-coordinadoras.component.scss'],
})
export class ConfiguracionCoordinadorasComponent implements OnInit {
  constructor(
    public modalService: NgbModal,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private userService:UserService
  ) {}

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  gridConfiguracionCoordinadoras: KendoGrid = new KendoGrid();
  gridCentroCostoSinAsignar: KendoGrid = new KendoGrid();
  gridAgregarConfiguracion: KendoGrid = new KendoGrid();
  _gridDatos: KendoGrid = new KendoGrid();
  modalRef: any;
  loading: boolean = false;
  esEditar: boolean = false;
  agregarCentroCosto: any;
  coordinadorasData: Ipersonal[] = [];
  centroCostosData: CentroCostoPadreCentroCostoIndividual[] = [];
  estadoData: FiltroConfiguracionCoordinadoraEstadoMatricula[] = [];
  subEstadoData: SubEstadoMatriculaFiltroConfiguracionCoordinadora[] = [];
  inputEstadoMatricula: any;
  inputSubestadoMatricula: any;
  dataEstadoMatricula: any;
  dataSubestadoMatricula: any;
  filtroMoneda: any[] = [];

  @ViewChild('modalConfiguracion') modalConfiguracion: any;
  @ViewChild('modalConfiguracionEditar') modalEdicion: any;
  formFiltroDetalles: FormGroup = this.formBuilder.group({
    id: 0,
    idCoordinador: [],
    idcentroCosto: [],
    idEstadoMatricula: [],
    idSubEstadoMatricula: [[]],
  });

  formResumenProgramas: FormGroup = this.formBuilder.group({
    idArea: [[]],
    idSubArea: [[]],
  });

  ngOnInit(): void {
    this.obtenerDataGrilla();
    this.obtenerDataGrillaCombo();
    this.eventasGrid();
    this.cargarGrillas()
  }

  obtenerDataGrilla() {
    this.loading = true;
    this.integraService
      .postJsonResponse(
        constApiOperaciones.ConfiguracionCoordinadoresObtenerConfiguracionCoordinadores,
        null
      )
      .subscribe({
        next: (
          response: HttpResponse<IConfiguracionCentroCostoCoordinador>
        ) => {
          this.gridCentroCostoSinAsignar.data =
            response.body.centroCostoNoAsignado;
          this.gridConfiguracionCoordinadoras.data =
            response.body.centroCostoAsignado;
          console.log('dataCargada',response);
          this.loading = false;
        },
      });
  }
  inputSubestadoAux:any
  obtenerDataGrillaCombo() {
    this.integraService
      .postJsonResponse(
        constApiOperaciones.ConfiguracionCoordinadoresObtenerCombosConfiguracionCoordinador,
        null
      )
      .subscribe({
        next: (
          response: HttpResponse<IObtenerCombosConfiguracionCoordinador>
        ) => {
          console.log(response);

          this.coordinadorasData = response.body.personal;
          this.sourceAsesores=  response.body.personal;
          this.asesoresFiltro = response.body.personal;
          this.sourceCentroCostoSinAsignar = response.body.centroCosto
          this.centroCostosData = response.body.centroCosto;
          this.estadoData = response.body.estadoMatricula
          this.dataEstadoMatricula  = response.body.estadoMatricula;
          this.subEstadoData = response.body.subEstadoMatricula;
          this.inputSubestadoAux =response.body.subEstadoMatricula;
          this.inputSubestadoAux.forEach((element:any) => {
            if(element.idEstadoMatricula == 0)
              element.idEstadoMatricula = 1;
          });
        },
      });
  }
  onEstadoMatriculaSelectionChange(dataMarcada:any){
   // let dataMarcada = this.gridAgregarConfiguracion.loadData();
    console.log('seleccionado',dataMarcada)
    if (dataMarcada.length > 0) {
      this.subEstadoData = this.inputSubestadoAux.filter((item:any) => dataMarcada.includes(item.idEstadoMatricula));
    } else {
      this.subEstadoData = [];
    }
  }
  editar(dataItem: ICentroCostoAsignado) {
    console.log('abrir editar')
    this.esEditar = true;
    console.log(dataItem);
    let datos;
    let data: IInsertarConfiguracionCoordinadorEnvio = {
      listaPersonal: [dataItem.idPersonal],
      listaCentroCosto: dataItem.detalleCentroCosto.map((x) => x.idCentroCosto),
      listaEstadoMatricula: dataItem.detalleEstadoMatricula.map(
        (x) => x.idEstadoMatricula
      ),
      listaSubEstadoMatricula: dataItem.detalleSubEstadoMatricula.map(
        (x) => x.idSubEstadoMatricula
      ),
      usuario: ''
    };
    this.gridAgregarConfiguracion.data = []
    this.gridAgregarConfiguracion.data.push(data);
    this.modalRef = this.modalService.open(this.modalConfiguracion, {
      size: 'xl',
    });
    console.log(dataItem);
  }
  newEliminar(e: any) {
    console.log(e);
    Swal.fire({
      title: '¿Desea Eliminar Configuracion Personal?',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        let parametro: IAprobarMaterialVersion = {
          id: e.idPersonal,
          nombreUsuario: this.userService.userName,
        };

        this.integraService
          .postJsonResponse(
            constApiOperaciones.ConfiguracionCoordinadoresEliminarConfiguracion,
            parametro
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              console.log(response);
              this.modalService.dismissAll();
              this.gridAgregarConfiguracion.data=[]
            },
          });
      }
    });
  }
  asesoresFiltro: any;
  sourceAsesores: any;
  filterAsesores(value: any) {
    let data = this.sourceAsesores
    console.log('letra',value)
    if (value.length >= 1) {
      this.coordinadorasData = this.sourceAsesores.filter(
        (s:any) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );

      //this.coordinadorasData = this.sourceAsesores.filter((s:any) => s.nombre.toLowerCase().indexOf(value.toLowerCase))
      // this.multiselectPerAsignado.toggle(true);

  }
  else{
    this.coordinadorasData = this.sourceAsesores
  }
}
sourceCentroCostoSinAsignar:any
filterCentroCosto(value: any) {
  let data = this.sourceAsesores
  console.log('letra',value)
  if (value.length >= 1) {

    this.centroCostosData = this.sourceCentroCostoSinAsignar.filter(
      (s:any) => s.centroCosto.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );

    //this.coordinadorasData = this.sourceAsesores.filter((s:any) => s.nombre.toLowerCase().indexOf(value.toLowerCase))
    // this.multiselectPerAsignado.toggle(true);

}
else{
  this.centroCostosData =this.sourceCentroCostoSinAsignar
}
}
  //ABRE EL MODAL
  _newNuevo() {
    this.esEditar = false;
    this.gridAgregarConfiguracion.data=[]
    this.modalRef = this.modalService.open(this.modalConfiguracion, {
      size: 'xl',
    });
  }


  newInsert() {


    this.loading=true
      console.log(this.gridAgregarConfiguracion.data)
      let datosEnvio =this.gridAgregarConfiguracion.data[0]

      let parametro: any[] = [
        {
          listaPersonal: datosEnvio.listaPersonal,
          listaCentroCosto: datosEnvio.listaCentroCosto,
          listaEstadoMatricula: datosEnvio.listaEstadoMatricula,
          listaSubEstadoMatricula: datosEnvio.listaSubEstadoMatricula,
          usuario: this.userService.userName,
        },
      ];

      this.integraService
        .postJsonResponse(
          constApiOperaciones.ConfiguracionCoordinadoresInsertarConfiguracion,
          parametro
        )
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            console.log(response);
            this.loading=false
            this.modalService.dismissAll();
            this.obtenerDataGrilla();
            this.obtenerDataGrillaCombo();
          },
          error:(error)=>{
            this.loading=false
            this.alertaService.notificationError(error.message)
          }
        });

  }

  newUpdate() {
    // this.gridAgregarConfiguracion.data =
    //   this.gridConfiguracionCoordinadoras.data;
    this.loading=true
      console.log(this.gridAgregarConfiguracion.data)
      let datosEnvio =this.gridAgregarConfiguracion.data[0]

      let parametro: any[] = [
        {
          listaPersonal: datosEnvio.listaPersonal,
          listaCentroCosto: datosEnvio.listaCentroCosto,
          listaEstadoMatricula: datosEnvio.listaEstadoMatricula,
          listaSubEstadoMatricula: datosEnvio.listaSubEstadoMatricula,
          usuario:this.userService.userName,
        },
      ];

      this.integraService
        .postJsonResponse(
          constApiOperaciones.ConfiguracionCoordinadoresActualizarConfiguracion,
          parametro
        )
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            console.log(response);
            this.loading=false
            this.modalService.dismissAll();
            this.obtenerDataGrilla();
            this.obtenerDataGrillaCombo();
          },
          error:(error)=>{
            this.loading=false
            this.alertaService.notificationError(error.message)
          }
        });
  }
  clearFieldsForm() {
    this.modalService.dismissAll();
  }

  eventasGrid() {
    this.gridAgregarConfiguracion.formGroup = this.formBuilder.group({
      listaPersonal: [[]],
      listaCentroCosto: [[]],
      listaEstadoMatricula: [[]],
      listaSubEstadoMatricula: [[]],
    });
    this.gridAgregarConfiguracion.getRemoveEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.gridAgregarConfiguracion.data.splice(resp.index, 1);
        this.gridAgregarConfiguracion.loadData();
      },
    });
    this.gridAgregarConfiguracion.getCellCloseEvent$().subscribe({
      next: (resp: any) => {
        console.log(resp);
        console.log('hola aqui', resp.dataItem);
        console.log('hola aqui2', resp.formGroupValue);
        this.gridAgregarConfiguracion.assignValues(
          resp.dataItem,
          resp.formGroupValue
        );
      },
    });
  }

  agregarDato() {
    this.gridAgregarConfiguracion.data.push({
      listaPersonal: [],
      listaCentroCosto: [],
      listaEstadoMatricula: [],
      listaSubEstadoMatricula: [],
    });
    this.gridAgregarConfiguracion.loadData();
  }
  setDetalle() {
    console.log(this.gridAgregarConfiguracion.data);
    let lista: string = '<ul>';
    let registros = this.gridAgregarConfiguracion.data;
    registros.forEach((element) => {
      lista +=
        '<li>' +
        this.obtenerCoordinador(element.idPersonal) +
        ' : ' +
        this.obtenerCentroCosto(element.detalleCentroCosto) +
        ' ' +
        this.obtenerEstado(element.idEstadoMatricula) +
        '</li>' +
        this.obtenerSubEstado(element.idSubEstadoMatricula);
      element.idPais = 0;
    });
    lista += '</ul>';
    this.formFiltroDetalles.patchValue({
      listaPaises: lista,
      listaIdPaises: this.gridAgregarConfiguracion.data,
    });
    console.log(this.formFiltroDetalles.value);
    let data = this.formFiltroDetalles.value;
    data.subestados = data.subestados.toString();
    data.estados = data.estados.toString();
    console.log(data);
    this._gridDatos.data.push(data);
  }

  obtenerCoordinador(a: number) {
    console.log(a);
    if (a == null) {
      return 'Seleccione Coordinador';
    } else {
      let data = this.coordinadorasData.find((x) => x.id == a);
      return data?.nombre;
    }
  }

  obtenerCentroCosto(a: number) {
    console.log(a);
    if (a == null) {
      return 'Seleccione Centro Costo';
    } else {
      let data = this.centroCostosData.find((x) => x.idCentroCosto == a);
      return data?.centroCosto;
    }
  }

  obtenerEstado(a: any) {
    console.log(a);
    if (a == null) {
      return 'Seleccione Estado';
    } else {
      let data = this.estadoData.find((x: any) => x.idEstadoMatricula == a);
      return data?.estadoMatricula;
    }
  }
  obtenerSubEstado(a: number) {
    console.log(a);
    if (a == null) {
      return 'Seleccione SubEstado';
    } else {
      let data = this.subEstadoData.find(
        (x: any) => x.idSubEstadoMatricula == a
      );
      return data?.subEstadoMatricula;
    }
  }
  cargarGrillas(){
    this.gridConfiguracionCoordinadoras.resizable = true;
    this.gridConfiguracionCoordinadoras.filterable = true;
    this.gridConfiguracionCoordinadoras.pageSize = 5;
    this.gridConfiguracionCoordinadoras.pageable = {
      buttonCount: 10,
    info: true,
    type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom'
    };
    this.gridConfiguracionCoordinadoras.gridState = {
      skip: 0,
      take: 10,
      sort: [],
    };
    //MODAL
    this.gridAgregarConfiguracion.resizable = true;
    this.gridAgregarConfiguracion.filterable = true;
    this.gridAgregarConfiguracion.pageSize = 5;
    this.gridAgregarConfiguracion.pageable = {
      buttonCount: 10,
    info: true,
    type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom'
    };
    this.gridAgregarConfiguracion.gridState = {
      skip: 0,
      take: 10,
      sort: [],
    };
    //Grid sin Asinar
    this.gridCentroCostoSinAsignar.resizable = true;
    this.gridCentroCostoSinAsignar.filterable = true;
    this.gridCentroCostoSinAsignar.pageSize = 5;
    this.gridCentroCostoSinAsignar.pageable = {
      buttonCount: 10,
    info: true,
    type: 'numeric',
      pageSizes: true,
      previousNext: true,
      position: 'bottom'
    };
    this.gridCentroCostoSinAsignar.gridState = {
      skip: 0,
      take: 10,
      sort: [],
    };

  }


}

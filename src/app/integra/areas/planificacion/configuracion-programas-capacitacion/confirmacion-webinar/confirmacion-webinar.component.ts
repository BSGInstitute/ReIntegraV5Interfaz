import { identifierName } from '@angular/compiler/public_api';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { HttpResponse } from '@angular/common/http';
import { constApiPlanificacion } from '@environments/constApi';
import {
  DropDownFilterSettings,
  VirtualizationSettings,
} from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-treelist';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';
import { distinct } from '@progress/kendo-data-query';
import { datePipeTransform } from '@shared/functions/date-pipe';

interface ConfirmacionWebinar {
  idPEspecificoSesion: number;
  confirmo: boolean;
}
interface CancelarWebinar {
  idPEspespecifico: number;
  idPEspecificoSesion: number;
  comentarioCancelacion: string;
  confirmo: boolean;
}
interface WebinarDetalleSesion {
  idPEspecificoSesion: number;
  estadoSesion: string;
  fecha: string;
  hora: string;
  nombrePrograma: string;
  nombreWebinar: string;
  esWebinarConfirmado: string;
  esCancelado: string;
  idCentroCosto: number;
  centroCosto: string;
  configuracion: string;
  estadoEnvioCorreo: string;
  estadoEnvioWhatsApp: string;
}
interface IPgenerales {
  id: number;
  nombre: string;
  idTipoPrograma: number;
}
interface ICombos {
  pGenerals: IPgenerales[];
  pespecificos: IComboBase1[];
  centroCostos: IComboBase1[];
}
interface IEstadoSesion {
  valor: string;
  texto: string;
}
interface IdataEnviada {
  ListaPGeneral: number[] | string[];
  ListaPEspecifico: number[] | null;
  FechaInicio: string | null;
  FechaFin: string | null;
  FechaPorDefecto?: string;
  CodigoMatricula?: string;
}
interface WebinarFiltro{
    listaPGeneral?:number[] ;
    listaPEspecifico?:number[];
    estadoSesion?:string ;
    fecha?:string ;
    fechaInicio?:string ;
    fechaFin?:string ;
    fechaPorDefecto?:string ;
    codigoMatricula?:string ;
    idCentroCosto?:number ;
}
interface FormFiltro{
  idPgeneral: number[],
  idPespecifico: number[],
  idEstadoSesion: string,
  codigoMatricula: string,
  fechaPorDefecto: string,
  fechaInicio: Date,
  fechaFin: Date,
}
@Component({
  selector: 'app-confirmacion-webinar',
  templateUrl: './confirmacion-webinar.component.html',
  styleUrls: ['./confirmacion-webinar.component.scss'],
})
export class ConfirmacionWebinarComponent implements OnInit {
  @ViewChild('modalDescuentoAsociar') modalDescuentoAsociar: any;
  gridTodo = new KendoGrid();
  combos: ICombos = {
    pGenerals: [],
    pespecificos: [],
    centroCostos: [],
  };
  gridPrograma = new KendoGrid();
  sourcePGeneral: WebinarDetalleSesion[];
  formComentario = new FormControl('');
  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;
  idPEspecificoSesionTemp: number;
  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  modalRefEditar: NgbModalRef = null;
  modalRef: NgbModalRef = null;

  dataPespecifico: IComboBase1[];
  filtroPespecifico: IComboBase1[] = [];

  estadoSesion: IEstadoSesion[];
  fechaPorDefecto: IEstadoSesion[];
  public defaultItem: { codigo: string; id: number } = {
    codigo: 'Seleccionar',
    id: null,
  };

  codigoMatricula: string;
  currentDate = new Date();
  // Calculate the date 30 days ago
  thirtyDaysAgo = new Date();

  formFiltro: FormGroup = this.formBuilder.group({
    idPgeneral: [null],
    idPespecifico: [null],
    idEstadoSesion: [null],
    codigoMatricula: null,
    fechaPorDefecto: '1',
    fechaInicio: [new Date()],
    fechaFin: [new Date()],
  });
  virtual: VirtualizationSettings = {
    itemHeight: 28,
  };
  dataEnviada: WebinarFiltro = {};

  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
  }
  get obtenerFechaActual() {
    return new Date();
  }

  ngOnInit(): void {
    this.estadoSesion = [
      { texto: 'Proxima', valor: '1' },
      { texto: 'Pasada', valor: '2' },
    ];
    this.fechaPorDefecto = [
      { texto: 'Últimos 30 días', valor: '1' },
      { texto: 'Personalizado', valor: '2' },
    ];
    // this.dataEnviada = {
    //   ListaPGeneral: [],
    //   ListaPEspecifico: null,
    //   FechaInicio: null,
    //   FechaFin: null,
    //   FechaPorDefecto: '',
    //   CodigoMatricula: '',
    // };
    this.obtenerCombos();
    this.obtener();
  }

  filtrarProgramas() {
    this.gridPrograma.loading = true;
    let datosFiltro = this.formFiltro.getRawValue() as FormFiltro;
    this.dataEnviada = {
      estadoSesion: datosFiltro.idEstadoSesion,
      listaPGeneral: datosFiltro.idPgeneral,
      listaPEspecifico: datosFiltro.idPespecifico,
      fechaInicio: datePipeTransform(datosFiltro.fechaInicio),
      fechaFin: datePipeTransform(datosFiltro.fechaFin),
      fechaPorDefecto: datosFiltro.fechaPorDefecto,
      codigoMatricula: datosFiltro.codigoMatricula,
    };
    this.gridPrograma.loading = false;
    this.obtener();
  }

  obtener(): void {
    this.gridPrograma.loading = true;
    this.integraService
      .postJsonResponse(constApiPlanificacion.InformacionWebinarObtenerWebinarPorFiltro, JSON.stringify(this.dataEnviada))
      .subscribe({
        next: (resp: HttpResponse<WebinarDetalleSesion[]>) => {
          this.gridPrograma.loading = false;
          console.log(resp.body);
          this.gridPrograma.data = resp.body;
        },
        error: (error) => {
          this.gridPrograma.loading = false;

          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  private obtenerCombos() {
    this.integraService
      .getJsonResponse(constApiPlanificacion.InformacionWebinarObtenerCombos)
      .subscribe({
        next: (resp: HttpResponse<ICombos>) => {
          this.combos = resp.body;
        },
        error: (error) => {
          console.log(error);
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  abrirModalCancelar(context: any, idPEspecificoSesion?: number) {
    this.modalRef = this.modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
    // console.log("aqui",dataItem);
    this.idPEspecificoSesionTemp = idPEspecificoSesion;
  }

  confirmarWebinar(id: number) {
    console.log(id);
    let dataEnviada: ConfirmacionWebinar = {
      idPEspecificoSesion: id,
      confirmo: true,
    };
    // this.loaderModal = true;
    this.gridPrograma.loading = true;
    this.integraService
      .postJsonResponse(constApiPlanificacion.InformacionWebinarConfirmarWebinar, dataEnviada)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          //  this.loaderModal = false;
          this.gridPrograma.loading = false;
          Swal.fire(
            '!Operación exitosa¡',
            'El Webinar fue confirmado exitosamente!.',
            'success'
          );
          this.obtener();
          //this.modalRef.close();
        },
        error: (error) => {
          this.gridPrograma.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  cancelarWebinar() {
    let dataEnviada: CancelarWebinar = {
      idPEspespecifico: null,
      comentarioCancelacion: this.formComentario.value,
      idPEspecificoSesion: this.idPEspecificoSesionTemp,
      confirmo: false,
    };

    this.gridPrograma.loading = true;
    this.integraService
      .postJsonResponse(constApiPlanificacion.InformacionWebinarCancelarWebinar, dataEnviada)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.gridPrograma.loading = false;
          Swal.fire(
            '!Operación exitosa¡',
            'El Webinar fue cancelado exitosamente!.',
            'success'
          );
          this.obtener();
        },
        error: (error) => {
          this.gridPrograma.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerPespecificoPorPgeneral(idPgeneral: number) {
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.InformacionWebinarObtenerPespecifico}/${idPgeneral}`
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          //        this.filtroPespecifico = this.filtroPespecifico.concat(resp.body);
          this.filtroPespecifico = [...this.filtroPespecifico, ...resp.body];
        },
      });
  }

  cargarPespecificos(idsPGeneral: number[]) {
    this.formFiltro.get('idPespecifico').setValue([]);
    this.filtroPespecifico = [];

    if (idsPGeneral.length > 0) {
      idsPGeneral.forEach((element) => {
        this.obtenerPespecificoPorPgeneral(element);
      });
      this.formFiltro.get('idPespecifico').enable();
    } else {
      this.filtroPespecifico = [];
      this.formFiltro.get('idPespecifico').disable();
    }
  }

  limpiarCamposForm(): void {
    if (this.modalRef != null) {
      this.modalRef.close();
      this.modalRef = null;
    }
    this.formComentario.reset();
    this.loaderModal = false;
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@shared/services/user.service';
import { constApiComercial } from '@environments/constApi';
import { ComboPersonalAsignado } from '@shared/models/interfaces/ipersonal';
import { CombosReporte } from '@comercial/models/interfaces/iseguimiento-oportunidad-3cx';
import { KendoGrid } from '@shared/models/kendo-grid';
import {
  datePipeTransform,
  getFechaFin,
  getFechaInicio,
} from '@shared/functions/date-pipe';
import {
  DropDownFilterSettings,
} from '@progress/kendo-angular-dropdowns';

export interface ChatAsistenteVirtualResponse {
  idPersonal: number;
  personal: string;
  idHiloChat: number;
  mensaje: string;
  usuario: string;
  fechaMensaje: string;
  fechaChat: string;
}

export interface MensajeChat {
  mensaje: string;
  usuario: string;
  fechaMensaje: string;
}

export interface ChatAgrupado {
  idPersonal: number;
  personal: string;
  idHiloChat: number;
  fechaChat: string;
  mensajes: MensajeChat[];
}

@Component({
  selector: 'app-reporte-chat-asistente-virtual',
  templateUrl: './reporte-chat-asistente-virtual.component.html',
  styleUrls: ['./reporte-chat-asistente-virtual.component.scss'],
})
export class ReporteChatAsistenteVirtualComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private userService: UserService
  ) {}

  gridChatAsistente: KendoGrid = new KendoGrid();
  buttonDisable: boolean = true;

  formFiltro: FormGroup = this.formBuilder.group({
    asesores: [[]],
    estadoPersonal: [null],
    fechaInicio: [getFechaInicio()],
    fechaFin: [getFechaFin()],
  });

  dataAsesores: ComboPersonalAsignado[] = [];
  dataAsesoresFiltro: ComboPersonalAsignado[] = [];
  estadoAsesores = [
    { id: true, nombre: 'Activos' },
    { id: false, nombre: 'Inactivos' },
  ];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  modalRef: NgbModalRef;
  mensajesSeleccionados: MensajeChat[] = [];
  personalSeleccionado: string = '';

  get fechaActual(): Date {
    return new Date();
  }

  ngOnInit(): void {
    this.obtenerCombos();
  }

  obtenerCombos() {
    this.integraService
      .getJsonResponse(
        `${constApiComercial.ReporteSeguimientoOportunidadesObtenerCombosReporte}`
      )
      .subscribe({
        next: (resp: HttpResponse<CombosReporte>) => {
          this.dataAsesores = resp.body.asesores;
          this.dataAsesoresFiltro = resp.body.asesores;
          this.buttonDisable = false;
        },
      });
  }

  filterEstadosAsesores(value: boolean) {
    if (value == null) {
      this.dataAsesoresFiltro = this.dataAsesores.slice();
    } else {
      this.dataAsesoresFiltro = this.dataAsesores.filter(
        (x) => x.activo == value
      );
      let asesoresActuales = this.formFiltro.getRawValue().asesores as number[];
      let filtro = asesoresActuales.filter((x) =>
        this.dataAsesoresFiltro.map((a) => a.id).includes(x)
      );
      this.formFiltro.get('asesores').setValue(filtro);
    }
  }

  generarReporte() {
    let datosFormFiltro = this.formFiltro.getRawValue();

    const idPersonal = this.userService.userData.idPersonal;
    let asesores: number[] = [];
    let filtroPersonal = [
      213,5276,5895,6007,5878,5895,201,6044,5726,5739,109,4659,6108,135,6634,6589,5564
    ];

    if (datosFormFiltro.asesores.length == 0) {
      if (!filtroPersonal.includes(idPersonal))
        asesores = this.dataAsesoresFiltro.map((x) => x.id);
    } else {
      asesores = datosFormFiltro.asesores;
    }

    const filtro = {
      asesores: asesores,
      fechaInicio:
        datePipeTransform(datosFormFiltro.fechaInicio, 'yyyy-MM-dd') +
        'T00:00:00.000',
      fechaFin:
        datePipeTransform(datosFormFiltro.fechaFin, 'yyyy-MM-dd') +
        'T00:00:00.000',
    };

    if (new Date(filtro.fechaFin) < new Date(filtro.fechaInicio)) {
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido',
      });
      return;
    }

    this.gridChatAsistente.loading = true;
    this.buttonDisable = true;

    this.integraService
      .postJsonResponse(
        constApiComercial.ReporteActividadesRealizadasTresCxGenerarReporteChatAsistenteVirtual,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<ChatAsistenteVirtualResponse[]>) => {
          this.gridChatAsistente.data = this.agruparData(resp.body);
          this.gridChatAsistente.loading = false;
          this.buttonDisable = false;
        },
        error: (error) => {
          this.gridChatAsistente.loading = false;
          this.buttonDisable = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          if (mensaje) this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  agruparData(data: ChatAsistenteVirtualResponse[]): ChatAgrupado[] {
    const mapa = new Map<string, ChatAgrupado>();

    data.forEach((item) => {
      const key = `${item.idPersonal}-${item.idHiloChat}-${item.fechaChat}`;
      if (!mapa.has(key)) {
        mapa.set(key, {
          idPersonal: item.idPersonal,
          personal: item.personal,
          idHiloChat: item.idHiloChat,
          fechaChat: item.fechaChat,
          mensajes: [],
        });
      }
      mapa.get(key).mensajes.push({
        mensaje: item.mensaje,
        usuario: item.usuario,
        fechaMensaje: item.fechaMensaje,
      });
    });

    const resultado = Array.from(mapa.values());
    resultado.forEach((grupo) => {
      grupo.mensajes.sort(
        (a, b) =>
          new Date(a.fechaMensaje).getTime() -
          new Date(b.fechaMensaje).getTime()
      );
    });

    return resultado;
  }

  abrirChat(dataItem: ChatAgrupado, modal: any) {
    this.mensajesSeleccionados = dataItem.mensajes;
    this.personalSeleccionado = dataItem.personal;
    this.modalRef = this.modalService.open(modal, {
      size: 'lg',
      centered: true,
      scrollable: true,
    });
  }

  cerrarModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }
}

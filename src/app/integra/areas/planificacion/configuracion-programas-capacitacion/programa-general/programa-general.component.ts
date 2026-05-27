import { ModalContentPgeneralHistorialMontoPagoComponent } from './modal-content-pgeneral-historial-monto-pago/modal-content-pgeneral-historial-monto-pago.component';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CursoRelacionado,
  Pgeneral,
  PgeneralProyectoAplicacionAnexo,
  PlantillaDocumentoAsociado,
  PlantillaDocumentoNoAsociado,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { ModalContentAsociarProgramasComponent } from './modal-content-asociar-programas/modal-content-asociar-programas.component';
import { ModalContentPgeneralConfiguracionesComponent } from './modal-content-pgeneral-configuraciones/modal-content-pgeneral-configuraciones.component';
import { constApiPlanificacion } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { ModalContentAsociarDocumentosComponent } from './modal-content-asociar-documentos/modal-content-asociar-documentos.component';
import { ModalContentAnexoProyectoAplicacionComponent } from './modal-content-anexo-proyecto-aplicacion/modal-content-anexo-proyecto-aplicacion.component';
import { ModalContentDatosPgeneralComponent } from './modal-content-datos-pgeneral/modal-content-datos-pgeneral.component';
import { ModalContentPgeneralCursosComponent } from './modal-content-pgeneral-cursos/modal-content-pgeneral-cursos.component';

interface FormFiltro {
  area: number[];
  subArea: number[];
  pgeneral: number[];
  partner: number[];
}
/**
 * @module PgeneralModule
 * @description Componente de Programas Generales
 * @author Flavio R. Mamani Fabian
 * @version 1.2.0
 * @history
 * * 16/07/2023 Implementacion de componente
 **/
@Component({
  providers: [PgeneralService],
  selector: 'app-programa-general',
  templateUrl: './programa-general.component.html',
  styleUrls: ['./programa-general.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgramaGeneralComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _pgeneralService: PgeneralService,
    private _alertaService: AlertaService
  ) {}

  formFiltro: FormGroup = this._formBuilder.group({
    area: [[]],
    subArea: [[]],
    pgeneral: [[]],
    partner: [[]],
  });
  gridProgramaGeneral = new KendoGrid<Pgeneral>();
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  subAreasCapacitacion: any[];

  habilitadoBsgTentoActual: boolean | null = null;
  dataItemBsgTento: any = null;
  bsgTentoMap: { [key: number]: boolean | null } = {};

  ngOnInit(): void {
    this._pgeneralService.ready();
    this.formFiltro.get('subArea').disable();
    this.obtenerProgramasGenerales();
  }
  initSubscribeObserbables() {
    this._pgeneralService.addNuevoPgeneral$.subscribe((item) => {
      let pgeneral = this.gridProgramaGeneral.data.find((x) => x.id == item.id);
      if (pgeneral == null) {
        this.gridProgramaGeneral.data = [
          item,
          ...this.gridProgramaGeneral.data,
        ];
      }
    });
  }
  obtenerProgramasGenerales() {
    let jsonEnvio: {
      idPgeneral: string;
      idArea: string;
      idSubArea: string;
      idPartner: string;
    } = {
      idPgeneral: null,
      idArea: null,
      idSubArea: null,
      idPartner: null,
    };
    let datosFormFiltro = this.dataFormFiltro;
    if (datosFormFiltro.area != null && datosFormFiltro.area.length > 0) {
      jsonEnvio.idArea = this.dataFormFiltro.area.join(',');
    }
    if (datosFormFiltro.subArea != null && datosFormFiltro.subArea.length > 0) {
      jsonEnvio.idSubArea = this.dataFormFiltro.subArea.join(',');
    }
    if (
      datosFormFiltro.pgeneral != null &&
      datosFormFiltro.pgeneral.length > 0
    ) {
      jsonEnvio.idPgeneral = this.dataFormFiltro.pgeneral.join(',');
    }
    if (datosFormFiltro.partner != null && datosFormFiltro.partner.length > 0) {
      jsonEnvio.idPartner = this.dataFormFiltro.partner.join(',');
    }
    this._pgeneralService
      .obtenerProgramasGeneral$(JSON.stringify(jsonEnvio))
      .subscribe({
        next: (resp) => {
          this.gridProgramaGeneral.data = resp.body;
          console.log(resp.body);
          this.cargarEstadosBsgTento();
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  get dataFormFiltro() {
    return this.formFiltro.getRawValue() as FormFiltro;
  }
  get combosModulo() {
    return this._pgeneralService.combosModulo;
  }
  getNombreArea(idArea: number) {
    return this._pgeneralService.getNombreArea(idArea);
  }
  getNombreSubArea(idArea: number) {
    return this._pgeneralService.getNombreSubArea(idArea);
  }
  getNombrePartner(idPartner: number) {
    return this._pgeneralService.getNombrePartner(idPartner);
  }
  getNombreTipoPrograma(idArea: number) {
    return this._pgeneralService.getNombreTipoPrograma(idArea);
  }
  cargarSubAreas(idsArea: number[]) {
    if (idsArea.length > 0) {
      this.subAreasCapacitacion = this.combosModulo.subAreaCapacitacion.filter(
        (x) => idsArea.includes(x.idAreaCapacitacion)
      );
      let filtro = this.dataFormFiltro.subArea.filter((x) =>
        this.subAreasCapacitacion.map((s) => s.id).includes(x)
      );
      this.formFiltro.get('subArea').enable();
      this.formFiltro.get('subArea').setValue(filtro);
    } else {
      this.subAreasCapacitacion = [];
      this.formFiltro.get('subArea').disable();
      this.formFiltro.get('subArea').setValue([]);
    }
  }
  abrirModalDatosPgeneral(dataItem?: Pgeneral) {
    this._pgeneralService.readyAlterno();

    this._pgeneralService.dataItemPgeneral = dataItem;
    this._pgeneralService.isNewPgeneral = dataItem == null;
    if (dataItem != null) {
      this._pgeneralService.initModalDatosPgeneral();
    }
    const modalRef = this._modalService.open(
      ModalContentDatosPgeneralComponent,
      {
        size: 'xxl',
        backdrop: 'static',
        keyboard: false,
      }
    );
    modalRef.componentInstance.pgeneralService = this._pgeneralService;
  }
  abrirModalCursosPgeneral(dataItem: Pgeneral) {
    this._pgeneralService.readyAlterno();
    this._pgeneralService.dataItemPgeneral = dataItem;
    const modalRef = this._modalService.open(
      ModalContentPgeneralCursosComponent,
      {
        size: 'xl',
        backdrop: 'static',
        keyboard: false,
      }
    );
    modalRef.componentInstance.pgeneralService = this._pgeneralService;
  }
  abrirModalPerfilContactoPgeneral(dataItem: Pgeneral) {
    this._pgeneralService.readyAlterno();
    this._pgeneralService.dataItemPgeneral = dataItem;
    const modalRef = this._modalService.open(
      ModalContentAsociarProgramasComponent,
      {
        size: 'xl',
        backdrop: 'static',
        keyboard: false,
      }
    );
    modalRef.componentInstance.pgeneralService = this._pgeneralService;
  }
  abrirModalModeloPredictivoPgeneral(dataItem: Pgeneral) {
    this._pgeneralService.readyAlterno();
    this._pgeneralService.dataItemPgeneral = dataItem;
    const modalRef = this._modalService.open(
      ModalContentAsociarProgramasComponent,
      {
        size: 'xl',
        backdrop: 'static',
        keyboard: false,
      }
    );
    modalRef.componentInstance.pgeneralService = this._pgeneralService;
  }
  abrirModalCongiguracionPgeneral(dataItem: Pgeneral) {
    this._pgeneralService.readyAlterno();
    this._pgeneralService.dataItemPgeneral = dataItem;
    this._pgeneralService.obtenerInformacionConfiguracionCliente();
    const modalRef = this._modalService.open(
      ModalContentPgeneralConfiguracionesComponent,
      {
        size: 'xl',
        backdrop: 'static',
        keyboard: false,
      }
    );
    modalRef.componentInstance.pgeneralService = this._pgeneralService;
  }
  abrirModalAnexoProyectoAplicacionPgeneral(dataItem: Pgeneral) {
    this._pgeneralService.readyAlterno();
    this._pgeneralService.dataItemPgeneral = dataItem;
    this.gridProgramaGeneral.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.PgeneralProyectoAplicacionAnexoObtenerListaPgeneralProyectoAplicacionAnexo}/${dataItem.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<PgeneralProyectoAplicacionAnexo[]>) => {
          this.gridProgramaGeneral.loading = false;
          const modalRef = this._modalService.open(
            ModalContentAnexoProyectoAplicacionComponent,
            {
              size: 'xxl',
              backdrop: 'static',
              keyboard: false,
            }
          );
          modalRef.componentInstance.pgeneralService = this._pgeneralService;
          modalRef.componentInstance.pgeneralProyectoAplicacionAnexo =
            resp.body;
        },
        error: (error) => {
          this.gridProgramaGeneral.loading = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener los anexos del programa!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  abrirModalAsociarDocumentoPgeneral(dataItem: Pgeneral) {
    this._pgeneralService.readyAlterno();
    this._pgeneralService.dataItemPgeneral = dataItem;
    this.gridProgramaGeneral.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerDocumentosAsociadosYNoAsociados}/${dataItem.id}`
      )
      .subscribe({
        next: (
          resp: HttpResponse<{
            plantillaDocumentoAsociado: PlantillaDocumentoAsociado[];
            plantillaDocumentoNoAsociado: PlantillaDocumentoNoAsociado[];
          }>
        ) => {
          console.log('obtener documentos', resp);
          this.gridProgramaGeneral.loading = false;
          const modalRef = this._modalService.open(
            ModalContentAsociarDocumentosComponent,
            {
              size: 'xxl',
              backdrop: 'static',
              keyboard: false,
            }
          );
          console.log('modalRef', modalRef);
          modalRef.componentInstance.pgeneralService = this._pgeneralService;
          modalRef.componentInstance.documentosRelacionados =
            resp.body.plantillaDocumentoAsociado;
          modalRef.componentInstance.documentosNoRelacionados =
            resp.body.plantillaDocumentoNoAsociado;
        },
        error: (error) => {
          this.gridProgramaGeneral.loading = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener los documentos!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }
  abrirModalAsociarProgramaPgeneral(dataItem: Pgeneral) {
    this._pgeneralService.readyAlterno();
    this._pgeneralService.dataItemPgeneral = dataItem;
    this.gridProgramaGeneral.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.ProgramaGeneralObtenerRelacionCursos}/${dataItem.id}`
      )
      .subscribe({
        next: (
          resp: HttpResponse<{
            cursosRelacionados: CursoRelacionado[];
            cursosNoRelacionados: IComboBase1[];
          }>
        ) => {
          this.gridProgramaGeneral.loading = false;
          const modalRef = this._modalService.open(
            ModalContentAsociarProgramasComponent,
            {
              size: 'xxl',
              backdrop: 'static',
              keyboard: false,
            }
          );
          modalRef.componentInstance.pgeneralService = this._pgeneralService;
          modalRef.componentInstance.cursosRelacionados =
            resp.body.cursosRelacionados;
          modalRef.componentInstance.cursosNoRelacionados =
            resp.body.cursosNoRelacionados;
        },
        error: (error) => {
          this.gridProgramaGeneral.loading = false;
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener los cursos relacionados!',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        },
      });
  }

  abrirModalHistorialMontoPago(dataItem: Pgeneral) {
    this._pgeneralService.readyAlterno();
    this._pgeneralService.dataItemPgeneral = dataItem;

    const modalRef = this._modalService.open(
      ModalContentPgeneralHistorialMontoPagoComponent,
      {
        size: 'xxl',
        backdrop: 'static',
        keyboard: false,
      }
    );
    modalRef.componentInstance.pgeneralService = this._pgeneralService;
  }

  cargarEstadosBsgTento(): void {
    this._integraService
      .getJsonResponse(constApiPlanificacion.ProgramaGeneralObtenerTodosHabilitadoBsgTento)
      .subscribe({
        next: (resp: any) => {
          this.bsgTentoMap = {};
          (resp.body || []).forEach((item: any) => {
            this.bsgTentoMap[item.id] = item.habilitadoBsgTento;
          });
        },
        error: () => {} // silencioso — es información visual auxiliar
      });
  }

  toggleBsgTento(dataItem: any): void {
    this.dataItemBsgTento = dataItem;
    this._integraService
      .getJsonResponse(`${constApiPlanificacion.ProgramaGeneralObtenerHabilitadoBsgTento}/${dataItem.id}`)
      .subscribe({
        next: (resp: any) => {
          const estadoActual: boolean = resp.body ?? false;
          const nuevoEstado = !estadoActual;
          const accion = nuevoEstado ? 'habilitar' : 'deshabilitar';
          this._alertaService.swalFireOptions({
            icon: 'question',
            title: `¿Desea ${accion} BSG Tento para este programa?`,
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No',
          }).then((result: any) => {
            if (result.isConfirmed) {
              this._integraService
                .putJsonResponse(`${constApiPlanificacion.ProgramaGeneralActualizarHabilitadoBsgTento}/${dataItem.id}/${nuevoEstado}`, {})
                .subscribe({
                  next: () => {
                    this.bsgTentoMap[dataItem.id] = nuevoEstado;
                    this.dataItemBsgTento = null;
                    this.habilitadoBsgTentoActual = null;
                    this._alertaService.swalFireOptions({
                      icon: 'success',
                      title: `BSG Tento ${nuevoEstado ? 'habilitado' : 'deshabilitado'}`,
                      timer: 1500,
                      showConfirmButton: false,
                    });
                  },
                  error: (error: any) => {
                    let resp = this._alertaService.getErrorResponse(error);
                    this._alertaService.swalFireOptions({
                      icon: 'error',
                      title: 'No se pudo actualizar',
                      text: `${resp.titulo}: ${resp.mensaje}`,
                    });
                  }
                });
            }
          });
        },
        error: (error: any) => {
          let resp = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: 'No se pudo obtener el estado BSG Tento',
            text: `${resp.titulo}: ${resp.mensaje}`,
          });
        }
      });
  }
}

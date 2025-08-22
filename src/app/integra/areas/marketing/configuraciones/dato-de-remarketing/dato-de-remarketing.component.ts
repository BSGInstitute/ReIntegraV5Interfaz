import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { constApiMarketing } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { HttpResponse } from '@angular/common/http';
import { Parametro } from '@shared/models/parametro';
import Swal from 'sweetalert2';
import { datePipeTransform } from '@shared/functions/date-pipe';
const iconInputValidation: string =
  'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MargioryModule
 * @description Componente de Reporte de Incidencias, Arbol de Ocurrencias, Reprogramaciones
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 16/10/2022 Implementacion de  Interfaz Modulo Categoria Origen
 * * 19/10/2022 Creacion  de Funciones Logicas
 */
@Component({
  selector: 'app-dato-de-remarketing',
  templateUrl: './dato-de-remarketing.component.html',
  styleUrls: ['./dato-de-remarketing.component.scss'],
})
export class DatoDeRemarketingComponent implements OnInit {
  @ViewChild('modalDataRemarketing') modalDataRemarketing: any;
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
  loaderGrid: boolean = false;
  modalRef: any;
  loaderModal: boolean = false;
  isNew: boolean = false;
  datoRemarketingTemp: any;
  dataEditTemporal: any;

  formDatoRemarketing: FormGroup = this.formBuilder.group({
    tab: [null],
    tipo: [null],
    grupo: [null],
    categoria: [null],
    probabilidad: [null],
    fechaInicio: [null],
    fechaFin: [null],
  });

  gridDatoRemarketing: KendoGrid = new KendoGrid();
  gridCampoFormulario: KendoGrid = new KendoGrid();

  ngOnInit(): void {
   // this.cargarGrilla();
    this.obtenerCombos();
    this.obtenertDatoRemarketing();
  }

  dataAgendaTab: any[] = [];
  dataTipoDato: any[] = [];
  dataTipoCategoriaOrigen: any[] = [];
  dataCategoriaOrigen: any[] = [];
  dataProbabilidadRegistro: any[] = [];
/**
 * Obtiene data para el llenado de data principal
 */
  obtenerCombos() {
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ConfiguracionDatoRemarketingObtenerCombosParaConfiguracionDatoRemarketing}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          let data = response.body;
          this.dataAgendaTab =
            data.listaComboConfiguracionDatoRemarketingAgendaTab;
          this.dataTipoDato =
            data.listaComboConfiguracionDatoRemarketingTipoDato;
          this.dataTipoCategoriaOrigen =
            data.listaComboConfiguracionDatoRemarketingTipoCategoriaOrigen;
          this.dataCategoriaOrigen =
            data.listaComboConfiguracionDatoRemarketingCategoriaOrigen;
          this.dataProbabilidadRegistro =
            data.listaComboConfiguracionDatoRemarketingProbabilidadRegistroPw;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }/**
   * Despliega modal para registro de datos
   * @param isNew
   * @param dataItem
   * @autor Margiory Ramirez
   */

  abrirModal(isNew: boolean, dataItem?: any) {
    console.log(dataItem);
    this.loaderModal = false;
    this.establecerDataPorDefecto();
    this.isNew = isNew;
    this.dataEditTemporal = null;
    if (dataItem != null) {
      this.dataEditTemporal = dataItem;
      this.formDatoRemarketing.get('tab').setValue(dataItem.idAgendaTab);
      this.formDatoRemarketing
        .get('tipo')
        .setValue(dataItem.listaTipoDato.map((x: any) => x.idTipoDato));
      this.formDatoRemarketing
        .get('grupo')
        .setValue(
          dataItem.listaTipoCategoriaOrigen.map(
            (x: any) => x.idTipoCategoriaOrigen
          )
        );
      this.formDatoRemarketing
        .get('categoria')
        .setValue(
          dataItem.listaCategoriaOrigen.map((x: any) => x.idCategoriaOrigen)
        );
      this.formDatoRemarketing
        .get('probabilidad')
        .setValue(
          dataItem.listaProbabilidadRegistroPw.map(
            (x: any) => x.idProbabilidadRegistroPw
          )
        );
      this.formDatoRemarketing
        .get('fechaInicio')
        .setValue(new Date(dataItem.fechaInicio));
      this.formDatoRemarketing
        .get('fechaFin')
        .setValue(new Date(dataItem.fechaFin));
    }

    this.modalRef = this.modalService.open(this.modalDataRemarketing);
  }

  abrirModal2() {}

  establecerDataPorDefecto() {
    this.formDatoRemarketing.reset();
    let agendaTab = this.dataAgendaTab.find((x: any) => x.idAgendaTab == 11);
    if (agendaTab) {
      this.formDatoRemarketing.get('tab').setValue(agendaTab.idAgendaTab);
    }
    let fechaActual = new Date();
    this.formDatoRemarketing.get('tipo').setValue([]);
    this.formDatoRemarketing.get('grupo').setValue([]);
    this.formDatoRemarketing.get('categoria').setValue([]);
    this.formDatoRemarketing.get('probabilidad').setValue([]);
    this.formDatoRemarketing.get('fechaFin').setValue(fechaActual);
    this.formDatoRemarketing.get('fechaInicio').setValue(fechaActual);
  }

  obtenertDatoRemarketing() {
    this.loaderGrid= true;
    this.integraService
      .getJsonResponse(
        `${constApiMarketing.ConfiguracionDatoRemarketingObtenerListaConfiguracionesDatoRemarketing}`
      )
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.gridDatoRemarketing.data = response.body;

          console.log(this.gridDatoRemarketing)
          this.loaderGrid= false;
        },
        error: (error) => {
          this.loaderGrid= false;
          this.alertaService.mensajeError(error);
        },
        complete: () => {},

      });
  }
/**
   * @description Funciones de validacion
   * @autor Margiory Ramirez
   * @param {boolean}
   */
  validFormDatoMarketing(): boolean {
    if (this.formDatoRemarketing.invalid) {
      this.formDatoRemarketing.markAllAsTouched();
      return false;
    }
    return true;
  }

  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: 'error',
      html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    })
  }

  /**
   * Inserta Data Nueva con los campos requeridos
   */
  crearDatoRemaketing() {
    console.log(this.formDatoRemarketing.getRawValue());
    if (this.validFormDatoMarketing()) {
      // this.loaderModal = true;
      let datosForm = this.formDatoRemarketing.getRawValue();
      let jsonEnvio: any = {
        id: this.dataEditTemporal != null ? this.dataEditTemporal.id : 0,
        idAgendaTab: datosForm.tab,
        fechaInicio: datePipeTransform(datosForm.fechaInicio, 'yyyy-MM-dd'),
        fechaFin: datePipeTransform(datosForm.fechaFin, 'yyyy-MM-dd'),
        usuario: this.usuario.userName,
        listaIdTipoDato: datosForm.tipo,
        listaIdTipoCategoriaOrigen: datosForm.grupo,
        listaCategoriaOrigen: datosForm.categoria,
        listaProbabilidadRegistro: datosForm.probabilidad,
      };
      if (datosForm.fechaFin < datosForm.fechaInicio) {
        this.alertaService.notificationWarning(
          'La fecha de fin debe ser mayor a la fecha de inicio'
        );
      }

      console.log(JSON.stringify(jsonEnvio));
      console.log(jsonEnvio);

      this.integraService
        .postJsonResponse(
          constApiMarketing.ConfiguracionDatoRemarketingActualizarConfiguracionDatoRemarketing,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response);
            // this.gridFormularioSolicitud.assignValues(this.dataEditTemporal, datosFormulario)
            this.obtenertDatoRemarketing();
            this.loaderModal = false;
          },
          error: (error) => {
            this.loaderModal = false;
            this.alertaService.mensajeError(error);
          },
          complete: () => {
            this.loaderModal = false;
            this.modalRef.close('submitted');
            this.alertaService.mensajeExitoso();
          },
        });
    } else this.formDatoRemarketing.markAllAsTouched();
  }

/**
 * Actuliza la Data inseratada Anteriomente
 */
  actualizarDatoRemarketing() {
    console.log(this.formDatoRemarketing.getRawValue());
    if (this.validFormDatoMarketing()) {
      // this.loaderModal = true;
      let datosForm = this.formDatoRemarketing.getRawValue();
      let jsonEnvio: any = {
        id: this.dataEditTemporal != null ? this.dataEditTemporal.id : 0,
        idAgendaTab: datosForm.tab,
        fechaInicio: datePipeTransform(datosForm.fechaInicio, 'yyyy-MM-dd'),
        fechaFin: datePipeTransform(datosForm.fechaFin, 'yyyy-MM-dd'),
        usuario: this.usuario.userName,
        listaIdTipoDato: datosForm.tipo,
        listaIdTipoCategoriaOrigen: datosForm.grupo,
        listaCategoriaOrigen: datosForm.categoria,
        listaProbabilidadRegistro: datosForm.probabilidad,
      };
      if (datosForm.fechaFin < datosForm.fechaInicio) {
        this.alertaService.notificationWarning(
          'La fecha de fin debe ser mayor a la fecha de inicio'
        );
      }

      console.log(JSON.stringify(jsonEnvio));
      console.log(jsonEnvio);

      this.integraService
        .postJsonResponse(
          constApiMarketing.ConfiguracionDatoRemarketingActualizarConfiguracionDatoRemarketing,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response);
            // this.gridFormularioSolicitud.assignValues(this.dataEditTemporal, datosFormulario)
            this.obtenertDatoRemarketing();
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
    } else this.formDatoRemarketing.markAllAsTouched();
  }

  eliminarDatoRemarketing(dataItem: any, index: number) {
    this.loaderGrid = true;
    let params: Parametro[] = [
      { clave: 'id', valor: dataItem.id },

    ];
    this.integraService
      .eliminarPorPathParams(constApiMarketing.ConfiguracionDatoRemarketingEliminarConfiguracionDatoRemarketing, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
         this.loaderGrid = false;
          if ((response.body == true)) {
            this.gridDatoRemarketing.data.splice(index, 1);
            this.gridDatoRemarketing.loadView()
            this.obtenertDatoRemarketing();
            this.loaderGrid = false;

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
          this.mostrarMensajeError(error);
        },
        complete: () => {},
      });
  }

 }

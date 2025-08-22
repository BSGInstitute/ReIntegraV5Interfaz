import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import Swal from 'sweetalert2';

interface IFeedback {
  id: number;
  idFeedbackConfigurar: number;
  nombre: string;
}
interface IFeedbackEnvio {
  id: number
  idFeedbackConfigurar: number
  configuracionFeedbackProgramaGeneral: number[]
  configuracionProgramaEspecifico: number[]
}
interface Combo {
  programasGenerales: IComboBase1[];
  programasEspecificos: IProgramasEspecificos[];
  feedbackConfigurados: IFeedback[];
}
interface IProgramasEspecificos {
  id: number;
  nombre: string;
  idProgramaGeneral: number;
}
interface IFormFiltro {
  idsProgramaGenerales: number[];
  idsProgramaEspecifico: number[];
  idFeedbackConfigurar: number;
}
/**
 * @module PlanificacionModule
 * @description Componente de Asociar Feedback Programas
 * @author Klebert Layme.
 * @version 1.0.0
 * @history
 * * 16/05/2023 Implementacion de Crud de Lista Asociar Feedback Programas
 * * 16/05/2023 Creacion de Grilla
 */
@Component({
  selector: 'app-asociar-feedback-programas',
  templateUrl: './asociar-feedback-programas.component.html',
  styleUrls: ['./asociar-feedback-programas.component.scss'],
})
export class AsociarFeedbackProgramasComponent implements OnInit {
  @ViewChild('modalAsociarFeedbackEditar') modalAsociarFeedbackEditar: any;

  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  

  gridFeedbackPrograma = new KendoGrid();

  nuevoRegistro: boolean = false;
  loaderModal: boolean = false;

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  modalRefEditar: NgbModalRef = null;

  formAreaEditar: FormGroup = this.formBuilder.group({
    idsProgramaGenerales: [null],
    idsProgramaEspecifico: [null],
    idFeedbackConfigurar: [null],
  });

  dataProgramasGenerales: IComboBase1[] = [];
  dataProgramasEspecificos: IProgramasEspecificos[] = [];
  sourceProgramasEspecificosFiltrado: IProgramasEspecificos[] = [];
  dataFeedbackConfigurados: IFeedback[] = [];

  ngOnInit(): void {
    this.obtenerFeedbacks();
    this.obtenerComboFeedback();
    this.userService.userData;
  }

  obtenerFeedbacks() {
    this.gridFeedbackPrograma.loading = true;
    this.integraService
      .getJsonResponse(
        constApiPlanificacion.FeedbackConfigurarGrupoPreguntaObtener
      )
      .subscribe({
        next: (resp: HttpResponse<IFeedback[]>) => {
          this.gridFeedbackPrograma.loading = false;
          console.log(resp.body);
          this.gridFeedbackPrograma.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridFeedbackPrograma.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerComboFeedback(): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(
        constApiPlanificacion.FeedbackConfigurarGrupoPreguntaObtenerCombo
      )
      .subscribe({
        next: (response: HttpResponse<Combo>) => {
          this.dataProgramasGenerales = response.body.programasGenerales;
          this.dataProgramasEspecificos = response.body.programasEspecificos;
          this.sourceProgramasEspecificosFiltrado =
            response.body.programasEspecificos;
          this.dataFeedbackConfigurados = response.body.feedbackConfigurados;
          this.loaderModal = false;
        },
        error: (e: any) => {
          this.loaderModal = false;
          this.alertaService.notificationWarning(
            `Surgio un error: ${e.error.title}`
          );
        },
      });
  }

  obtenerFeedbackId(idFeedbackConfigurar: number): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.FeedbackConfigurarGrupoPreguntaObtenerProgramasSelecionados}/${idFeedbackConfigurar}`
      )
      .subscribe({
        next: (
          response: HttpResponse<{
            programasGenerales: number[];
            programasEspecificos: number[];
          }>
        ) => {
          if (response.body != null) {
            this.formAreaEditar
              .get('idsProgramaGenerales')
              .setValue(response.body.programasGenerales);
            this.formAreaEditar
              .get('idsProgramaEspecifico')
              .setValue(response.body.programasEspecificos);
          }
          this.cargarPespecificos(response.body.programasGenerales);
          this.loaderModal = false;
          
          // this.modalRefEditar = this.modalService.open(
          //   this.modalAsociarFeedbackEditar,
          //   { size: 'md', backdrop: 'static' }
          // );
        },
        error: (error) => {
          this.loaderModal = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  cargarPespecificos(idsPgeneral: number[]): void {
    this.dataProgramasEspecificos = this.sourceProgramasEspecificosFiltrado.filter((x) =>
      idsPgeneral.includes(x.idProgramaGeneral)
    );
    console.log(this.dataProgramasEspecificos);
    console.log(idsPgeneral);
  }

  insertar(): void {
    if (this.formAreaEditar.valid) {
      let dataCompleta = this.formAreaEditar.getRawValue() as IFormFiltro;
      let dataEnviada: IFeedbackEnvio = {
        id: 0,
        idFeedbackConfigurar: dataCompleta.idFeedbackConfigurar,
        configuracionFeedbackProgramaGeneral: dataCompleta.idsProgramaGenerales,
        configuracionProgramaEspecifico: dataCompleta.idsProgramaEspecifico,
      };
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.FeedbackConfigurarGrupoPreguntaInsertar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<IFeedback>) => {
            this.gridFeedbackPrograma.data.unshift(response.body);
            this.loaderModal = false;
            this.limpiarCamposForm();
            Swal.fire(
              '¡Registrado!',
              'El registro ha sido creado correctamente.',
              'success'
            );
            this.obtenerFeedbacks();
          },
          error: (error) => {
            this.loaderModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });
    }else{
      this.formAreaEditar.markAllAsTouched();
    }
  }

  actualizar(): void {
    if (this.formAreaEditar.valid) {
      let dataCompleta = this.formAreaEditar.getRawValue() as IFormFiltro;
      let dataEnviada: IFeedbackEnvio = {
        id: this.dataItemTemp.id,
        idFeedbackConfigurar: dataCompleta.idFeedbackConfigurar,
        configuracionFeedbackProgramaGeneral: dataCompleta.idsProgramaGenerales,
        configuracionProgramaEspecifico: dataCompleta.idsProgramaEspecifico,
      };
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.FeedbackConfigurarGrupoPreguntaActualizar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<IFeedback>) => {
            this.dataItemTemp.id = response.body.id;
            this.dataItemTemp.nombre = response.body.nombre;
            this.dataItemTemp.idFeedbackConfigurar = response.body.id;
            this.limpiarCamposForm();
            this.loaderModal = false;
            Swal.fire(
              '¡Actualizado!',
              'El registro ha sido actualizado correctamente.',
              'success'
            );
            this.obtenerFeedbacks();
          },
          error: (error) => {
            this.loaderModal = false;
            let mensaje = this.alertaService.getMessageErrorService(error);
            this.alertaService.notificationWarning(mensaje);
          },
        });
    }else{
      this.formAreaEditar.markAllAsTouched();
    }
  }
  /**
   * @author Klebert Layme
   */
  eliminar(dataSource: IFeedback): void {
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
            `${constApiPlanificacion.FeedbackConfigurarGrupoPreguntaEliminar}/${dataSource.id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if (response.body) {
                let idIndice =
                  this.gridFeedbackPrograma.data.indexOf(dataSource);
                this.gridFeedbackPrograma.data.splice(idIndice, 1);
                this.gridFeedbackPrograma.loadData();
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
            error: (error) => {
              this.loaderModal = false;
              let mensaje = this.alertaService.getMessageErrorService(error);
              this.alertaService.notificationWarning(mensaje);
            },
          });
      }
    });
  }

  abrirModalDetalleInsertar(): void {
    this.nuevoRegistro = true;
    this.formAreaEditar.reset();
    this.modalRefEditar = this.modalService.open(
      this.modalAsociarFeedbackEditar,
      { size: 'mg', backdrop: 'static' }
    );
  }
  dataItemTemp: IFeedback;

  abrirModalDetalleActualizar(dataItem: IFeedback) {
    this.dataItemTemp = dataItem;
    this.nuevoRegistro = false;
    this.formAreaEditar.setValue({
      idsProgramaGenerales: [],
      idsProgramaEspecifico: [],
      idFeedbackConfigurar: this.dataItemTemp.idFeedbackConfigurar,
    });
    this.obtenerFeedbackId(dataItem.id);
    this.modalRefEditar = this.modalService.open(
      this.modalAsociarFeedbackEditar,
      { size: 'mg', backdrop: 'static' }
    );
  }

  limpiarCamposForm(): void {
    if (this.modalRefEditar != null) {
      this.modalRefEditar.close();
      this.modalRefEditar = null;
    }
    this.formAreaEditar.reset();
    this.loaderModal = false;
  }

  getErrorMessageEditar(controlName: string): string {
    let erroMsj: any = {
      codigo: {
        required: 'El campo se encuentra vacio',
      },
      descripcion: {
        required: 'El campo se encuentra vacio',
      },
      porcentajeGeneral: {
        required: 'El campo se encuentra vacio',
      },
    };
    let formControl: FormControl = this.formAreaEditar.get(
      controlName
    ) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName].required;
    }
    return errorMessage;
  }
}

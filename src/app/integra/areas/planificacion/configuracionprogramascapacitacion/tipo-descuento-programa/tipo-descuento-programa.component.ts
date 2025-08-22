import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiPlanificacion,constApiGlobal } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { data } from 'jquery';
import Swal from 'sweetalert2';

interface ITipoDescuento {
  id: number;
  codigo: string;
  descripcion: string;
  formula: number;
  porcentajeGeneral: number;
  porcentajeMatricula: number;
  fraccionesMatricula: number;
  porcentajeCuotas: number;
  cuotasAdicionales: number;
}
interface coordinadorContenido {
  id: number;
  tipo: string;
}
interface Combo{
  tiposUsuario : IComboBase1[];
  formulaTipoDescuentos: IComboBase1[];
  programasGeneral:IComboBase1[];
}

/**
 * @module PlanificacionModule
 * @description Componente de Tipo de Descuento Programa
 * @author Klebert Layme.
 * @version 1.0.0
 * @history
 * * 16/05/2023 Implementacion de Crud de Lista Tipo de Descuento
 * * 16/05/2023 Creacion de Grilla
 */
@Component({
  selector: 'app-tipo-descuento-programa',
  templateUrl: './tipo-descuento-programa.component.html',
  styleUrls: ['./tipo-descuento-programa.component.scss'],
})
export class TipoDescuentoProgramaComponent implements OnInit {
  @ViewChild('modalTipoDescuentoEditar') modalTipoDescuentoEditar: any;
  @ViewChild('modalTipoDescuentoAsociar') modalTipoDescuentoAsociar: any;

  gridTipoDescuentoPrograma = new KendoGrid();

  idsAsesorCoordinador: coordinadorContenido[] = [];
 
  dataAgendaTipoUsuario: IComboBase1[]=[];
  dataFormulaTipoDescuento: IComboBase1[]=[];
  dataProgramaGeneral:IComboBase1[]=[];
  listaPGeneral:any[] = [];

  isNew: boolean = false;
  loaderModal: boolean = false;

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];


  modalRef: NgbModalRef = null;

  formAreaEditar: FormGroup = this.formBuilder.group({
    id: [0],
    codigo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    formula: [null],
    porcentajeGeneral: [0],
    porcentajeMatricula: [0],
    fraccionesMatricula: [0],
    porcentajeCuotas: [0],
    cuotasAdicionales: [0],
    idsAsesorCoordinador: [null],
  });
  // formAreaEditarAsociar: FormGroup = this.formBuilder.group({
  //   id: [0],
  //   idsPGeneral: [null],
  // });
  formControlIdsPgeneral: FormControl = new FormControl('')

  dataItemTemp: ITipoDescuento;
  idTipoDescuentoTemp: number;
  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  dataPGeneral : IComboBase1 [] = [];

  ngOnInit(): void {
    this.obtenerTipoDescuento();
    this.obtenerCombos();
    this.obtenerPGeneral();
    this.userService.userData;
  }
  ngOnDestroy(): void {}
  /**
   * @author Klebert Layme
   */
  obtenerTipoDescuento() {
    this.gridTipoDescuentoPrograma.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.TipoDescuentoObtener)
      .subscribe({
        next: (resp: HttpResponse<ITipoDescuento[]>) => {
          this.gridTipoDescuentoPrograma.loading = false;
          console.log(resp.body);
          this.gridTipoDescuentoPrograma.data = resp.body;
        },
        error: (error) => {
          console.log(error);
          this.gridTipoDescuentoPrograma.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerCombos(): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.TipoDescuentoObtenerCombosModulo)
      .subscribe({
        next: (response: HttpResponse<Combo>) => {
          this.dataAgendaTipoUsuario = response.body.tiposUsuario;
          this.dataFormulaTipoDescuento = response.body.formulaTipoDescuentos;
          this.dataProgramaGeneral = response.body.programasGeneral;
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

  obtenerPGeneral(){
    this.integraService
    .getJsonResponse(
      `${constApiGlobal.ProgramaGeneralObtenerCombo}`
    )
    .subscribe({
      next: (resp: HttpResponse<IComboBase1[]>) => {
        this.dataPGeneral = resp.body;
      },
    });
  }
  /**
   * @author Klebert Layme
   */

  obtenerTiposPorIdTipoDescuento(idTipoDescuento: number): void {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.TipoDescuentoObtenerTiposPorIdTipoDescuento}/${idTipoDescuento}`
      )
      .subscribe({
        next: (response: HttpResponse<string[]>) => {
          if (response.body.length > 0) {
            this.formAreaEditar
              .get('idsAsesorCoordinador')
              .setValue(response.body);
          } else {
            this.formAreaEditar.get('idsAsesorCoordinador').setValue([]);
          }
          this.loaderModal = false;

          this.modalRef = this.modalService.open(
            this.modalTipoDescuentoEditar,
            { size: 'mg', backdrop: 'static' }
          );
        },
        error: (error) => {
          this.loaderModal = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**
   * @author Klebert Layme
   */
  obtenerTipoDescuentoAsociar(idTipoDescuento: number) {
    this.loaderModal = true;
    this.integraService
      .getJsonResponse(
        `${constApiPlanificacion.PGeneralTipoDescuentoObtenerProgramaPorDescuento}/${idTipoDescuento}`
      )
      .subscribe({
        next: (response: HttpResponse<number[]>) => {
          if (response.body.length > 0) {
            this.formControlIdsPgeneral.setValue(response.body);
            
          } else {
            this.formControlIdsPgeneral.setValue([]);
          }
          this.loaderModal = false;
          this.modalRef = this.modalService.open(
            this.modalTipoDescuentoAsociar,
            { size: 'mg', backdrop: 'static' }
          );
        },
        error: (error) => {
          this.loaderModal = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  /**
   * @author Klebert Layme
   */
  abrirModalDetalleInsertar(): void {
    this.isNew = true;
    this.formAreaEditar.reset();
    this.formAreaEditar.get('id').setValue(0);
    this.modalRef = this.modalService.open(
      this.modalTipoDescuentoEditar,
      { size: 'mg', backdrop: 'static' }
    );
  }

  /**
   * @author Klebert Layme
   */
  abrirModalDetalleActualizar(dataItem: ITipoDescuento) {
    this.isNew = false;
    this.dataItemTemp = dataItem;
    this.formAreaEditar.setValue({
      id: dataItem.id,
      codigo: dataItem.codigo,
      descripcion: dataItem.descripcion,
      formula: dataItem.formula,
      porcentajeGeneral: dataItem.porcentajeGeneral ?? 0,
      porcentajeMatricula: dataItem.porcentajeMatricula ?? 0,
      fraccionesMatricula: dataItem.fraccionesMatricula ?? 0,
      porcentajeCuotas: dataItem.porcentajeCuotas ?? 0,
      cuotasAdicionales: dataItem.cuotasAdicionales ?? 0,
      idsAsesorCoordinador: [],
    });
    this.obtenerTiposPorIdTipoDescuento(dataItem.id);
  }
  /**
   * @author Klebert Layme
   */
  abrirModalAsociarPrograma(idTipoDescuento: number) {
    this.idTipoDescuentoTemp = idTipoDescuento;
    this.formControlIdsPgeneral.setValue([this.formControlIdsPgeneral]);
    this.obtenerTipoDescuentoAsociar(idTipoDescuento);
  }

  /**
   * @author Klebert Layme
   */
  insertar(): void {
    if (this.formAreaEditar.valid) {
      let dataCompleta = this.formAreaEditar.getRawValue();
      let dataEnviada = {
        codigo: dataCompleta.codigo,
        descripcion: dataCompleta.descripcion,
        formula: dataCompleta.formula,
        porcentajeGeneral: dataCompleta.porcentajeGeneral,
        porcentajeMatricula: dataCompleta.porcentajeMatricula,
        fraccionesMatricula: dataCompleta.fraccionesMatricula,
        porcentajeCuotas: dataCompleta.porcentajeCuotas,
        cuotasAdicionales: dataCompleta.cuotasAdicionales,

        TipoDescuentoAsesorCoordinadorPw: dataCompleta.idsAsesorCoordinador,
      };
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.TipoDescuentoInsertar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<ITipoDescuento>) => {
            let nuevaFila: ITipoDescuento = {
              id: response.body.id,
              codigo: response.body.codigo,
              descripcion: response.body.descripcion,
              formula: response.body.formula,
              porcentajeGeneral: response.body.porcentajeGeneral,
              porcentajeMatricula: response.body.porcentajeMatricula,
              fraccionesMatricula: response.body.fraccionesMatricula,
              porcentajeCuotas: response.body.porcentajeCuotas,
              cuotasAdicionales: response.body.cuotasAdicionales,
            };
            this.gridTipoDescuentoPrograma.data.unshift(nuevaFila);
            this.gridTipoDescuentoPrograma.loadData();
            this.obtenerTipoDescuento();
            this.loaderModal = false;
            Swal.fire(
              '¡Registrado!',
              'El registro ha sido creado correctamente.',
              'success'
            );
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(
              `Surgio un error: ${e.error.title}`
            );
          },
        });
      this.limpiarCamposForm();
    }
  }
  /**
   * @author Klebert Layme
   */
  actualizar(): void {
    if (this.formAreaEditar.valid) {
      let dataCompleta = this.formAreaEditar.getRawValue();
      let dataEnviada = {
        id: dataCompleta.id,
        codigo: dataCompleta.codigo,
        descripcion: dataCompleta.descripcion,
        formula: dataCompleta.formula,
        porcentajeGeneral: dataCompleta.porcentajeGeneral,
        porcentajeMatricula: dataCompleta.porcentajeMatricula,
        fraccionesMatricula: dataCompleta.fraccionesMatricula,
        porcentajeCuotas: dataCompleta.porcentajeCuotas,
        cuotasAdicionales: dataCompleta.cuotasAdicionales,

        tipoDescuentoAsesorCoordinadorPw: dataCompleta.idsAsesorCoordinador,
      };
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.TipoDescuentoActualizar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<ITipoDescuento>) => {
            
            this.dataItemTemp.codigo = response.body.codigo;
            this.dataItemTemp.descripcion = response.body.descripcion;
            this.dataItemTemp.formula = response.body.formula;
            this.dataItemTemp.porcentajeGeneral = response.body.porcentajeGeneral;
            this.dataItemTemp.porcentajeMatricula = response.body.porcentajeMatricula;
            this.dataItemTemp.fraccionesMatricula = response.body.fraccionesMatricula;
            this.dataItemTemp.porcentajeCuotas = response.body.porcentajeCuotas;
            this.dataItemTemp.cuotasAdicionales = response.body.cuotasAdicionales;

            this.loaderModal = false;
            Swal.fire(
              '¡Actualizado!',
              'El registro ha sido actualizado correctamente.',
              'success'
            );
          },
          error: (e: any) => {
            this.loaderModal = false;
            this.alertaService.notificationWarning(
              `Surgio un error: ${e.error.title}`
            );
          },
        });
      this.limpiarCamposForm();
    }else{
      this.formAreaEditar.markAllAsTouched();
    }
  }

  /**
   * @author Klebert Layme
   */
  actualizarAsociar(): void {
    let dataEnviada: { idTipoDescuento: number; idPgeneral: number[] } = {
      idTipoDescuento: this.idTipoDescuentoTemp,
      idPgeneral: this.formControlIdsPgeneral.value as number[]
    };
    this.loaderModal = true;
    this.integraService
      .putJsonResponse(
        constApiPlanificacion.PGeneralTipoDescuentoAsociarPrograma,
        dataEnviada
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          this.obtenerTipoDescuento();
          this.loaderModal = false;
          this.modalRef.close();
          Swal.fire(
            '¡Actualizado!',
            'El registro ha sido actualizado correctamente.',
            'success'
          );
        },
        error: (error) => {
          this.loaderModal = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  /**
   * @author Klebert Layme
   */
  eliminar(dataSource: ITipoDescuento) {
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
            `${constApiPlanificacion.TipoDescuentoEliminar}/${dataSource.id}`
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              if (response.body) {
                let idIndice =
                  this.gridTipoDescuentoPrograma.data.indexOf(dataSource);
                this.gridTipoDescuentoPrograma.data.splice(idIndice, 1);
                this.gridTipoDescuentoPrograma.loadData();
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
              this.alertaService.notificationWarning(
                `Surgio un error: ${e.error.title}`
              );
            },
          });
      }
    });
  }

  /**
   * @author Klebert Layme
   */
  limpiarCamposForm(): void {
    if (this.modalRef != null) {
      this.modalRef.close();
      this.modalRef = null;
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

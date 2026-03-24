import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';

interface IDescuento {
  id: number;
  codigo: string;
  descripcion: string;
  formula: number;
  nombreFormula: string;
  porcentajeGeneral: number;
  porcentajeMatricula: number;
  fraccionesMatricula: number;
  porcentajeCuotas: number;
  cuotasAdicionales: number;
  idTipoDescuentoNivelAprobacion: number;
  nombreNivelAprobacion: string;
  activo: boolean;
  aplicaProgramaCompleto: boolean;
}

interface Combo {
  formulaTipoDescuentos: IComboBase1[];
  aplicaA: IComboBase1[];
  tiposUsuario: IComboBase1[];
  programasGeneral: IComboBase1[];
}

const FORMULA_CATALOG: Record<number, { name: string; visibleFields: string[] }> = {
  1: { name: 'Sin descuento', visibleFields: [] },
  2: { name: 'Matricula', visibleFields: ['porcentajeMatricula', 'fraccionesMatricula'] },
  3: { name: 'Cuotas', visibleFields: ['porcentajeCuotas', 'cuotasAdicionales'] },
  4: { name: 'Ambos', visibleFields: ['porcentajeMatricula', 'fraccionesMatricula', 'porcentajeCuotas', 'cuotasAdicionales'] },
  5: { name: 'General', visibleFields: ['porcentajeGeneral'] },
  6: { name: 'Contado Normal', visibleFields: [] },
};

const APLICA_A_OPTIONS = [
  { id: 0, nombre: 'Curso' },
  { id: 1, nombre: 'Programa completo' },
];

/**
 * @module PlanificacionModule
 * @description Componente de Modulo de Descuentos
 * @version 2.0.0
 */
@Component({
  selector: 'app-modulo-descuentos',
  templateUrl: './modulo-descuentos.component.html',
  styleUrls: ['./modulo-descuentos.component.scss'],
})
export class ModuloDescuentosComponent implements OnInit, OnDestroy {
  @ViewChild('modalDescuentoEditar') modalDescuentoEditar: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [
    'codigo',
    'descripcion',
    'nombreFormula',
    'activo',
    'aplicaProgramaCompleto',
    'nombreNivelAprobacion',
    'acciones',
  ];

  dataSource = new MatTableDataSource<IDescuento>([]);
  loading: boolean = false;

  dataFormulaTipoDescuento: IComboBase1[] = [];
  dataNivelTipoDescuento: IComboBase1[] = [];
  aplicaAOptions = APLICA_A_OPTIONS;

  isNew: boolean = false;
  loaderModal: boolean = false;

  modalRef: NgbModalRef = null;

  formAreaEditar: FormGroup = this.formBuilder.group({
    id: [0],
    codigo: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    formula: [null],
    porcentajeGeneral: [null],
    porcentajeMatricula: [null],
    fraccionesMatricula: [null],
    porcentajeCuotas: [null],
    cuotasAdicionales: [null],
    activo: [true],
    aplicaProgramaCompleto: [null],
    idNivelTipoDescuento: [null],
  });

  dataItemTemp: IDescuento;

  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.obtenerDescuentos();
    this.obtenerCombos();
    this.obtenerNivelesAprobacion();
  }

  ngOnDestroy(): void {}

  private setupTableFeatures(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  obtenerDescuentos(): void {
    this.loading = true;
    this.integraService
      .getJsonResponse(constApiPlanificacion.ObtenerTipoDescuentoConNivelAprobacion)
      .subscribe({
        next: (resp: HttpResponse<IDescuento[]>) => {
          this.loading = false;
          this.dataSource.data = resp.body;
          setTimeout(() => this.setupTableFeatures());
        },
        error: (error) => {
          this.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerCombos(): void {
    this.integraService
      .getJsonResponse(constApiPlanificacion.TipoDescuentoObtenerCombosModulo)
      .subscribe({
        next: (response: HttpResponse<Combo>) => {
          this.dataFormulaTipoDescuento = response.body.formulaTipoDescuentos;
        },
        error: (e: any) => {
          this.alertaService.notificationWarning(
            `Surgio un error: ${e.error?.title || e.message}`
          );
        },
      });
  }

  obtenerNivelesAprobacion(): void {
    this.integraService
      .getJsonResponse(constApiPlanificacion.ObtenerNivelesAprobacion)
      .subscribe({
        next: (response: HttpResponse<IComboBase1[]>) => {
          this.dataNivelTipoDescuento = response.body;
        },
        error: (e: any) => {
          this.alertaService.notificationWarning(
            `Surgio un error al cargar los niveles de aprobacion: ${e.error?.title || e.message}`
          );
        },
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getFormulaName(formulaId: number): string {
    return FORMULA_CATALOG[formulaId]?.name ?? 'Desconocido';
  }

  getNivelName(idNivel: number): string {
    const nivel = this.dataNivelTipoDescuento.find((n) => n.id === idNivel);
    return nivel?.nombre ?? 'Desconocido';
  }

  getAplicaAText(aplicaProgramaCompleto: boolean): string {
    return aplicaProgramaCompleto ? 'Programa completo' : 'Curso';
  }

  isFieldVisible(fieldName: string): boolean {
    const formulaId = this.formAreaEditar.get('formula')?.value;
    if (!formulaId) return false;
    return FORMULA_CATALOG[formulaId]?.visibleFields.includes(fieldName) ?? false;
  }

  onFormulaChange(formulaId: number): void {
    const allDynamicFields = [
      'porcentajeGeneral',
      'porcentajeMatricula',
      'fraccionesMatricula',
      'porcentajeCuotas',
      'cuotasAdicionales',
    ];
    const visibleFields = FORMULA_CATALOG[formulaId]?.visibleFields ?? [];

    allDynamicFields.forEach((field) => {
      const control = this.formAreaEditar.get(field);
      if (!visibleFields.includes(field)) {
        control.setValue(null);
        control.clearValidators();
      }
      control.updateValueAndValidity();
    });
  }

  abrirModalInsertar(): void {
    this.isNew = true;
    this.formAreaEditar.reset();
    this.formAreaEditar.get('id').setValue(0);
    this.formAreaEditar.get('activo').setValue(true);
    this.modalRef = this.modalService.open(
      this.modalDescuentoEditar,
      { size: 'lg', backdrop: 'static' }
    );
  }

  abrirModalActualizar(dataItem: IDescuento): void {
    this.isNew = false;
    this.dataItemTemp = dataItem;
    this.formAreaEditar.setValue({
      id: dataItem.id,
      codigo: dataItem.codigo,
      descripcion: dataItem.descripcion,
      formula: dataItem.formula,
      porcentajeGeneral: dataItem.porcentajeGeneral ?? null,
      porcentajeMatricula: dataItem.porcentajeMatricula ?? null,
      fraccionesMatricula: dataItem.fraccionesMatricula ?? null,
      porcentajeCuotas: dataItem.porcentajeCuotas ?? null,
      cuotasAdicionales: dataItem.cuotasAdicionales ?? null,
      activo: dataItem.activo ?? true,
      aplicaProgramaCompleto: dataItem.aplicaProgramaCompleto ? 1 : 0,
      idNivelTipoDescuento: dataItem.idTipoDescuentoNivelAprobacion ?? null,
    });
    this.onFormulaChange(dataItem.formula);
    this.modalRef = this.modalService.open(
      this.modalDescuentoEditar,
      { size: 'lg', backdrop: 'static' }
    );
  }

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
        idTipoDescuentoNivelAprobacion: dataCompleta.idNivelTipoDescuento,
        activo: dataCompleta.activo ?? true,
        aplicaProgramaCompleto: dataCompleta.aplicaProgramaCompleto === 1,
        TipoDescuentoAsesorCoordinadorPw: [] as number[],
      };
      this.loaderModal = true;
      this.integraService
        .postJsonResponse(
          constApiPlanificacion.TipoDescuentoInsertar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.obtenerDescuentos();
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
              `Surgio un error: ${e.error?.title || e.message}`
            );
          },
        });
      this.limpiarCamposForm();
    }
  }

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
        idTipoDescuentoNivelAprobacion: dataCompleta.idNivelTipoDescuento,
        activo: dataCompleta.activo ?? true,
        aplicaProgramaCompleto: dataCompleta.aplicaProgramaCompleto === 1,
        TipoDescuentoAsesorCoordinadorPw: [] as number[],
      };
      this.loaderModal = true;
      this.integraService
        .putJsonResponse(
          constApiPlanificacion.TipoDescuentoActualizar,
          dataEnviada
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.dataItemTemp.codigo = response.body.codigo;
            this.dataItemTemp.descripcion = response.body.descripcion;
            this.dataItemTemp.formula = response.body.formula;
            this.dataItemTemp.nombreFormula = response.body.nombreFormula;
            this.dataItemTemp.porcentajeGeneral = response.body.porcentajeGeneral;
            this.dataItemTemp.porcentajeMatricula = response.body.porcentajeMatricula;
            this.dataItemTemp.fraccionesMatricula = response.body.fraccionesMatricula;
            this.dataItemTemp.porcentajeCuotas = response.body.porcentajeCuotas;
            this.dataItemTemp.cuotasAdicionales = response.body.cuotasAdicionales;
            this.dataItemTemp.idTipoDescuentoNivelAprobacion = response.body.idTipoDescuentoNivelAprobacion;
            this.dataItemTemp.nombreNivelAprobacion = response.body.nombreNivelAprobacion;
            this.dataItemTemp.activo = response.body.activo;
            this.dataItemTemp.aplicaProgramaCompleto = response.body.aplicaProgramaCompleto;
            // Refresh the table data
            this.dataSource.data = [...this.dataSource.data];
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
              `Surgio un error: ${e.error?.title || e.message}`
            );
          },
        });
      this.limpiarCamposForm();
    } else {
      this.formAreaEditar.markAllAsTouched();
    }
  }

  eliminar(dataSource: IDescuento): void {
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
                this.dataSource.data = this.dataSource.data.filter(
                  (item) => item.id !== dataSource.id
                );
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
                `Surgio un error: ${e.error?.title || e.message}`
              );
            },
          });
      }
    });
  }

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
    };
    let formControl: FormControl = this.formAreaEditar.get(
      controlName
    ) as FormControl;
    let errorMessage = null;
    if (formControl.hasError('required')) {
      errorMessage = erroMsj[controlName]?.required;
    }
    return errorMessage;
  }
}

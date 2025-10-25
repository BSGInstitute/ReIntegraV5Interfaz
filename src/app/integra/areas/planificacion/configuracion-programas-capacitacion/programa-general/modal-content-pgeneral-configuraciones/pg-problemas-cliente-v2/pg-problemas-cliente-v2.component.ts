import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';

import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormService } from '@shared/services/form.service';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { constApiPlanificacion } from '@environments/constApi';
import { CompuestoProblemaModalidadAlternoDTO } from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { F } from '@angular/cdk/keycodes';

export interface IProblemaClienteSolucion {
  problema: IProblemaCliente;
  solucion: IProblemaSolucion;
}

interface IProblemaCliente {
  problemaId: number;
  nombre: string;
  detalleId: number;
  detalle: string;
  detalleTituloId: string;
  titulo: string;
}
interface SubSolucionDTO {
  id: number;
  idProgramaGeneralProblemaFactorSolucion: number | null;
  solucion: string;
  orden: number;
  nivel: number;
}

interface IProblemaSolucion {
  solucionDescripcionId: number;
  descripcion: string;
  solucionTituloId: number;
  titulo: string;
  subTituloId: number;
  subTitulo: string;
  subSoluciones: IProblemaSubSolucion[];
}

interface IProblemaSubSolucion {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-pg-problemas-cliente-v2',
  templateUrl: './pg-problemas-cliente-v2.component.html',
  styleUrls: ['./pg-problemas-cliente-v2.component.scss'],
})
export class PgProblemasClienteV2Component implements OnInit {
  constructor(
    private integraService: IntegraService,
    public activeModal: NgbActiveModal,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    private formService: FormService
  ) {}

  @Input() pgeneralService!: PgeneralService;

  mostrarModal = false;
  mdSubSoluciones = false;
  mdEliminar = false;
  registroAEliminar: IProblemaClienteSolucion | null = null;
  esNuevo = true;
  dataSeleccionada: IProblemaClienteSolucion | null = null;
  gridProblemasCliente: IProblemaClienteSolucion[] = [];
  gridProblemasClienteSubSoluciones: IProblemaSolucion =
    {} as IProblemaSolucion;

  // ===== Ciclo de vida =====
  ngOnInit(): void {
    this.cargarGrid();
    this.obtenerSubSoluciones();
  }

  // ===== Grid =====
  cargarGrid() {
    this.integraService
      .getJsonResponse(
        constApiPlanificacion.ProgramaGeneralProblemaFactorObtenerCombos
      )
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          const combos = resp.body;
          this.integraService
            .getJsonResponse(
              `/ProgramaGeneralProblemaDetalle/Obtener/${
                this.dataItemPgeneral!.id
              }`
            )
            .subscribe({
              next: (resp: HttpResponse<any>) => {
                const programas = resp.body;
                const resultado = this.transformarData(programas, combos);
                console.log('resultado', resultado);
                this.gridProblemasCliente = resultado;
              },
              error: (error) => {
                const mensaje =
                  this.alertaService.getMessageErrorService(error);
                this.alertaService.notificationWarning(mensaje);
              },
            });
        },
        error: (error) => {
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  ProblemaFactorSubSolucion: SubSolucionDTO[] = [];
  obtenerSubSoluciones(): void {
    this.integraService
      .getJsonResponse(
        constApiPlanificacion.ProgramageneralproblemaFactorSubSolucionObtener
      )
      .subscribe({
        next: (resp: HttpResponse<SubSolucionDTO[]>) => {
          this.ProblemaFactorSubSolucion = resp.body ?? [];
        },
        error: (error) => {
          const mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  transformarData(programas: any, combos: any) {
    const resultado = programas.map((p: any) => {
      const factor = combos.problemaFactor.find(
        (f: any) => f.id === p.idProgramaGeneralProblemaFactor
      );
      const detalle = combos.problemaFactorDetalle.find(
        (d: any) => d.id === p.idProgramaGeneralProblemaFactorDetalle
      );
      const solucion = combos.problemaFactorSolucion.find(
        (s: any) => s.id === p.idProgramaGeneralProblemaFactorSolucion
      );

      return {
        ...p,
        factor,
        detalle,
        solucion,
      };
    });
    return resultado;
  }

  get dataItemPgeneral() {
    return this.pgeneralService.dataItemPgeneral;
  }
  abrirModal(data: IProblemaClienteSolucion, esNuevo: boolean) {
    this.dataSeleccionada = data;
    this.esNuevo = esNuevo;
    this.mostrarModal = true;
  }

  modalSubGridData: Array<{ idSubSolucion: number; solucion: string }> = [];
  abrirModalSubSoluciones(data: any) {
    // limpia estado
    this.modalSubGridData = [];
    this.gridProblemasClienteSubSoluciones = {
      solucionDescripcionId: null as any,
      descripcion: '',
      solucionTituloId: null as any,
      titulo: '',
      subTituloId: null as any,
      subTitulo: '',
      subSoluciones: [],
    } as IProblemaSolucion;

    let ids: number[] = [];

    if (Array.isArray(data)) {
      // Recibiste directamente el array de subSoluciones
      ids = data
        .map((x: any) =>
          Number(
            x?.idProgramaGeneralProblemaFactorSubSolucion ??
              x?.id ?? // fallback por si viniera con otra forma
              x
          )
        )
        .filter((n) => Number.isFinite(n));
      // Cabecera vacía (no tenemos info de descripción/título)
    } else if (data) {
      // Recibiste la fila completa
      const sol = data.solucion ?? {};
      this.gridProblemasClienteSubSoluciones = {
        solucionDescripcionId: sol.solucionDescripcionId ?? null,
        descripcion: sol.descripcion ?? '',
        solucionTituloId: sol.solucionTituloId ?? null,
        titulo: sol.titulo ?? '',
        subTituloId: sol.subTituloId ?? null,
        subTitulo: sol.subTitulo ?? '',
        subSoluciones: [],
      } as IProblemaSolucion;

      const arr = data.subSoluciones ?? sol.subSoluciones ?? [];
      ids = (Array.isArray(arr) ? arr : [])
        .map((x: any) =>
          Number(
            x?.idProgramaGeneralProblemaFactorSubSolucion ??
              x?.id ?? // fallback
              x
          )
        )
        .filter((n) => Number.isFinite(n));
    }

    // Arma el datasource visible (id + nombre resuelto)
    this.modalSubGridData = ids.map((id) => ({
      idSubSolucion: id,
      solucion: this.getNombreSubSolucion(id),
    }));

    this.mdSubSoluciones = true;
  }
  private getNombreSubSolucion(id: number): string {
    const item = this.ProblemaFactorSubSolucion.find((s) => s.id === id);
    return (item?.solucion ?? '').trim() || '(Sin nombre)';
  }

  cerrarModal(cerrado: boolean) {
    this.mostrarModal = !cerrado;
  }

  // ======== Abrir modal de eliminación ========
  abrirModalEliminar(dataItem: IProblemaClienteSolucion) {
    this.registroAEliminar = dataItem;
    this.mdEliminar = true;
  }

  // ======== Cerrar modal de eliminación ========
  cerrarModalEliminar(refrescar: boolean = false) {
    this.mdEliminar = false;
    this.registroAEliminar = null;

    if (refrescar) {
      this.cargarGrid(); // opcional, si quisieras refrescar los datos luego de eliminar
    }
  }

  // ======== Confirmar eliminación ========
  confirmarEliminar() {
    if (!this.registroAEliminar) return;

    const id = this.registroAEliminar.problema.problemaId;
    this.gridProblemasCliente = this.gridProblemasCliente.filter(
      (x) => x.problema.problemaId !== id
    );

    this.cerrarModalEliminar();
  }
}

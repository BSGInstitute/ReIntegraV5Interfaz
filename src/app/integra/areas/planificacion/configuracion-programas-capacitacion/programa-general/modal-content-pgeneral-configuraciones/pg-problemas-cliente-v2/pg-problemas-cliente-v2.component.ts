import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpResponse } from '@angular/common/http';

import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormService } from '@shared/services/form.service';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { constApiPlanificacion } from '@environments/constApi';

interface SubSolucionDTO {
  id: number;
  idProgramaGeneralProblemaFactorSolucion: number | null;
  solucion: string;
  orden: number;
  nivel: number;
}

interface IProblemaSubSolucion {
  id: number;
  nombre: string;
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
  registroAEliminar: any = null;
  esNuevo = true;
  dataSeleccionada: any = null;
  gridProblemasCliente: any[] = [];
  gridProblemasClienteSubSoluciones: IProblemaSolucion =
    {} as IProblemaSolucion;

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
        subSoluciones: p.subSoluciones ?? [],
      };
    });
    return resultado;
  }

  get dataItemPgeneral() {
    return this.pgeneralService.dataItemPgeneral;
  }

  onModalCerrado(refrescar: boolean) {
    this.mostrarModal = false;
    if (refrescar) {
      this.cargarGrid(); 
    }
  }
  abrirModal(data: any, esNuevo: boolean) {
    this.dataSeleccionada = data;
    this.esNuevo = esNuevo;
    this.mostrarModal = true;
  }

  modalSubGridData: Array<{ idSubSolucion: number; solucion: string }> = [];
  abrirModalSubSoluciones(data: any) {
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
      ids = data
        .map((x: any) =>
          Number(x?.idProgramaGeneralProblemaFactorSubSolucion ?? x?.id ?? x)
        )
        .filter((n) => Number.isFinite(n));
    } else if (data) {
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
          Number(x?.idProgramaGeneralProblemaFactorSubSolucion ?? x?.id ?? x)
        )
        .filter((n) => Number.isFinite(n));
    }

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

  abrirModalEliminar(dataItem: any) {
    this.registroAEliminar = dataItem;
    this.mdEliminar = true;
  }

  cerrarModalEliminar(refrescar: boolean = false) {
    this.mdEliminar = false;
    this.registroAEliminar = null;
    if (refrescar) this.cargarGrid();
  }

  confirmarEliminar() {
    if (!this.registroAEliminar) return;
    const id =
      this.registroAEliminar.problema?.problemaId ??
      this.registroAEliminar.idProgramaGeneralProblemaFactor;

    this.gridProblemasCliente = this.gridProblemasCliente.filter(
      (x: any) =>
        (x.problema?.problemaId ?? x.idProgramaGeneralProblemaFactor) !== id
    );

    this.cerrarModalEliminar();
  }
}

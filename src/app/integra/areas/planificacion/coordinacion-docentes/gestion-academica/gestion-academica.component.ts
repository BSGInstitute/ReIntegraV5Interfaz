import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

interface GestionAcademicaGrid {
  id: number;
  nombre: string;
  fechaAsignacion: string;
}

interface FormGestionAcademica {
  idDocente: number;
  idCurso: number;
}

@Component({
  selector: 'app-gestion-academica',
  templateUrl: './gestion-academica.component.html',
  styleUrls: ['./gestion-academica.component.scss'],
})
export class GestionAcademicaComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
  ) {}

  gridGestionAcademica: KendoGrid = new KendoGrid();
  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  dataItemTemp: GestionAcademicaGrid;
  isNew: boolean = false;

  listaDocentes: IComboBase1[] = [];
  listaCursos: IComboBase1[] = [];
  cursosAsignados: IComboBase1[] = [];

  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  formGestionAcademica: FormGroup = this._formBuilder.group({
    idDocente: [null, Validators.required],
    idCurso: [null],
  });

  ngOnInit(): void {
    this.obtener();
  }

  obtener() {
    this.gridGestionAcademica.loading = true;
    this._integraService
      .getJsonResponse(constApiPlanificacion.ProveedorObtenerActivoPEspecifico)
      .subscribe({
        next: (resp: HttpResponse<GestionAcademicaGrid[]>) => {
          this.gridGestionAcademica.data = resp.body;
          this.gridGestionAcademica.loading = false;
        },
        error: (error) => {
          this.gridGestionAcademica.loading = false;
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerDocentes() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.ProveedorObtenerDocentesActivos)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.listaDocentes = resp.body;
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerCursos() {
    this._integraService
      .getJsonResponse(constApiPlanificacion.PEspecificoObtener)
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.listaCursos = resp.body;
        },
        error: (error) => {
          const mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  abrirModal(context: any, isNew: boolean, dataItem?: GestionAcademicaGrid) {
    this.isNew = isNew;
    this.formGestionAcademica.reset();
    this.enProcesoSolicitud = false;
    this.cursosAsignados = [];
    if (!isNew) {
      this.dataItemTemp = dataItem;
      this.formGestionAcademica.get('idDocente').setValue(dataItem.id);
    } else {
      this.dataItemTemp = null;
    }
    this.obtenerDocentes();
    this.obtenerCursos();
    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  agregarCurso() {
    const idCurso = this.formGestionAcademica.get('idCurso').value;
    if (idCurso) {
      const curso = this.listaCursos.find((c) => c.id === idCurso);
      if (curso && !this.cursosAsignados.find((c) => c.id === curso.id)) {
        this.cursosAsignados = [...this.cursosAsignados, curso];
        this.formGestionAcademica.get('idCurso').setValue(null);
      }
    }
  }

  eliminarCursoAsignado(id: number) {
    this.cursosAsignados = this.cursosAsignados.filter((c) => c.id !== id);
  }

  get GestionAcademicaForm(): FormGestionAcademica {
    return this.formGestionAcademica.getRawValue() as FormGestionAcademica;
  }

  guardar() {
    if (this.formGestionAcademica.get('idDocente').valid) {
      // TODO: llamar endpoint para guardar
      this.enProcesoSolicitud = false;
      this.modalRef.close();
      this.obtener();
      this._alertaService.mensajeExitoso();
    } else {
      this.formGestionAcademica.markAllAsTouched();
      this._alertaService.mensajeIcon('Complete por favor los campos obligatorios!');
    }
  }

  actualizar() {
    if (this.formGestionAcademica.get('idDocente').valid) {
      // TODO: llamar endpoint para actualizar
      this.enProcesoSolicitud = false;
      this.modalRef.close();
      this.obtener();
      this._alertaService.mensajeExitoso();
    } else {
      this.formGestionAcademica.markAllAsTouched();
      this._alertaService.mensajeIcon('Complete por favor los campos obligatorios!');
    }
  }
}

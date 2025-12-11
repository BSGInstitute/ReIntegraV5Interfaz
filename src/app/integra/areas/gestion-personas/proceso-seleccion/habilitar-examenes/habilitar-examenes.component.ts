import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiGestionPersonal } from '@environments/dist/constApi';
import { ExamenGroup, ListaExamenes, PostulantesInscritos } from '@gestionPersonas/models/Postulante';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpansionPanelComponent } from '@progress/kendo-angular-layout';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';


@Component({
  selector: 'app-habilitar-examenes',
  templateUrl: './habilitar-examenes.component.html',
  styleUrls: ['./habilitar-examenes.component.scss']
})
export class HabilitarExamenesComponent implements OnInit {
  @ViewChildren(ExpansionPanelComponent)
  panels: QueryList<ExpansionPanelComponent>;

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private cdRef: ChangeDetectorRef,
    private alertaService2: AlertaService
  ) { }

  ngOnInit(): void {
    this.obtenerTodo();
  }

  // variables
  gridHabilitarExamenes: KendoGrid = new KendoGrid();
  mostrarExamenes = false;
  postulanteSeleccionado: PostulantesInscritos = null;
  items: ExamenGroup[] = [];
  data: {
    IdPostulante: number,
    IdProcesoSeleccion: number
  }

  estadoSeleccionado: number | null = null;

  obtenerTodo() {
    this.gridHabilitarExamenes.loading = true
    this._integraService.getJsonResponse(
      constApiGestionPersonal.PostualantesInscritosConProceso
    ).subscribe({
      next: (response: HttpResponse<PostulantesInscritos[]>) => {
        this.gridHabilitarExamenes.data = response.body;
        this.gridHabilitarExamenes.loading = false
      },
      error: (e) => {
        this.gridHabilitarExamenes.loading = false
        let mensaje = this._alertaService.getMessageErrorService(e);
        this._alertaService.notificationWarning(mensaje);
      }
    })
  }

  obtenerExamenesPostulante(postulante: PostulantesInscritos) {
    this.postulanteSeleccionado = postulante
    this.mostrarExamenes = true
    let body = {
      IdPostulante: postulante.idPostulante,
      IdProcesoSeleccion: postulante.idProcesoSeleccion
    }
    this.data = body;
    this._integraService.postJsonResponse(
      constApiGestionPersonal.mostrarExamenesPostulante,
      body
    ).subscribe({
      next: (response: HttpResponse<ExamenGroup[]>) => {
        this.items = response.body
        this._alertaService.addSuccess('Exito', 'Examenes encontrados')
      },
      error: (e) => {
        let mensaje = this._alertaService.getMessageErrorService(e);
        this._alertaService.notificationWarning(mensaje);
      }
    })
  }

  habilitarPaquete(paquete: ExamenGroup) {
    let datos = this.data
    let body = {
      IdPostulante: datos.IdPostulante,
      IdEvaluacion: paquete.idEvaluacion,
      IdProcesoSeleccion: datos.IdProcesoSeleccion
    }
    this._integraService.postJsonResponse(
      constApiGestionPersonal.HabilitarExamenesPostulante,
      body
    ).subscribe({
      next: (response: HttpResponse<[]>) => {
        this._alertaService.addSuccess('Exito', 'Se habilito el paquete correctamente')
        this.obtenerExamenesPostulante(this.postulanteSeleccionado);

      },
      error: (e) => {
        console.log('error habilitar paquete', e);
        let mensaje = this._alertaService.getMessageErrorService(e);
        this._alertaService.notificationWarning(mensaje);
      }
    })
  }

  habilitarExamen(examen: ListaExamenes) {
    let datos = this.data;
    let body = {
      IdExamen: examen.idExamen,
      IdPostulante: datos.IdPostulante,
      IdProcesoSeleccion: datos.IdProcesoSeleccion
    }

    this._integraService.postJsonResponse(
      constApiGestionPersonal.HabilitarExamenesPostulante,
      body
    ).subscribe({
      next: (response: HttpResponse<[]>) => {
        this._alertaService.addSuccess('Exito', 'Se actualizo el examen correctamente');
        this.obtenerExamenesPostulante(this.postulanteSeleccionado);
      },
      error: (e) => {
        console.log('Error al habilitar examen', e);
        let mensaje = this._alertaService.getMessageErrorService(e);
        this._alertaService.notificationWarning(mensaje);
      }
    })
  }


  public onAction(index: number): void {
    this.panels.forEach((panel, idx) => {
      if (idx !== index && panel.expanded) {
        panel.toggle();
      }
    });
  }

  estadoProceso(items : ExamenGroup){
    let estadoActual = items.listaExamenes?.some(examen => !examen.estadoExamen);
    return estadoActual;
  }

  estadoProcesoExamen(examen : ListaExamenes){
    let estadoActualExamen = !examen.estadoExamen;
    return estadoActualExamen;
  }
}



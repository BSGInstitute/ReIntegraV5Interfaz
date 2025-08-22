import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '../../../../../../shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Component, Input, OnInit } from '@angular/core';
import { KendoGrid } from '@shared/models/kendo-grid';
import { constApiPlanificacion } from '@environments/constApi';
import { PageSizeItem } from '@progress/kendo-angular-treelist';

//*Gretel Canasa*//

export interface DetalleSesionesAlumnos {
  idPGeneral: number;
  idAlumno: number;
  idPEspecifico: number;
  idSesion: number;
  idCoordinadoraAcademica: number;
  nombreCoordinadoraAcademica: string;
  idMatriculaCabecera: number;
  codigoMatricula: string;
  nombreAlumno: string;
  centroCosto: string;
  estadoMatricula: string;
  confirmo: string;
  email: string;
  nombrePais: string;
  zonaHoraria: string;
  envioCorreo: string;
  envioWhatsApp: string;
}

@Component({
  selector: 'app-confirmacion-webinar-alumnos',
  templateUrl: './confirmacion-webinar-alumnos.component.html'
})
export class ConfirmacionWebinarAlumnosComponent implements OnInit {
  gridAlumnos = new KendoGrid();

  @Input() public idSesion: number;
  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  constructor(
    private alertaService: AlertaService,
    private IntegraService: IntegraService
  ) {}

  ngOnInit(): void {
    this.obtener()
  }

  obtener(): void {
    this.gridAlumnos.loading = true;
    this.IntegraService.postJsonResponse(
      constApiPlanificacion.ProgramaEspecificoSesionDetalleSesionesPorAlumnosFiltrado,
      JSON.stringify({ idSesion: this.idSesion})
    ).subscribe({
      next: (resp: HttpResponse<DetalleSesionesAlumnos[]>) => {
        this.gridAlumnos.loading = false;
        this.gridAlumnos.data = resp.body;
      },
      error: (error) => {
        this.gridAlumnos.loading = false;
        let mensaje = this.alertaService.getMessageErrorService(error);
        this.alertaService.notificationWarning(mensaje);
      },
    });
  }
}

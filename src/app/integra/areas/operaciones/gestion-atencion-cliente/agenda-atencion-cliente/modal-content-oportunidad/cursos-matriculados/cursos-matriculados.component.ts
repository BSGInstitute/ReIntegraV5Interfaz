import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { LocalizationPaginatorIntl } from '@shared/models/localization-mat-paginator';


import Swal from 'sweetalert2';
export interface MatriculaPespecificoAlumnoDTO {
  nombre: string;
  id: number;
  duracion: string | null;
  tipo: string;
}
@Component({
  selector: 'app-cursos-matriculados',
  templateUrl: './cursos-matriculados.component.html',
  styleUrls: ['./cursos-matriculados.component.scss'],
providers: [{provide: MatPaginatorIntl, useClass: LocalizationPaginatorIntl}]
})
export class CursosMatriculadosComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  esCoordinadora: boolean = true;
  gridCursoMatriculado: MatTableDataSource<MatriculaPespecificoAlumnoDTO>;
  columnsToDisplayCursosMatriculados = [
    'nombreCurso',
    'duracion',
    'tipo',
    'acciones',
  ];
  isLoading = false;

  constructor(  private alertaService: AlertaService) {}

  ngOnInit(): void {
    this.gridCursoMatriculado = new MatTableDataSource<MatriculaPespecificoAlumnoDTO>([]);
  }
  ngAfterViewInit() {
    this.obtener();
  }

  obtener() {
    this.isLoading = true;
    this.agendaService.esCoordinadora$.subscribe(
      (resp) => (this.esCoordinadora = resp)
    );
    console.log('escordi', this.esCoordinadora);
    this.agendaService.agendaInicializarOperacionesService.cursosMatriculados$.subscribe(
      {
        next: (resp: MatriculaPespecificoAlumnoDTO[]) => {
          console.log('GRID cursosmatriculados', resp);
          this.gridCursoMatriculado.data = resp;
          this.gridCursoMatriculado.paginator = this.paginator;
          this.isLoading = false;
        },
        error: (error: any) => {
          this.alertaService.notificationError(
            `Error: ${error}`,
            'right',
            'bottom'
          );
          this.isLoading = false;
        },
      }
    );
  }

  desmatricularCurso(dataItem: any) {
    Swal.fire({
      text: '¿Desea eliminar la matricula?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Aceptar',
      cancelButtonText: "Cancelar",
      buttonsStyling: false,
      customClass:{
        confirmButton: "sweetAlert2-customConfirmButtonSwal",
        cancelButton: "sweetAlert2-customDenyButton"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        console.log(dataItem, 'desmatricular');
        this.agendaService.agendaInicializarOperacionesService
          .desmatriculaAlumno$(dataItem.id)
          .subscribe({
            next: (response: any) => {
              if ((response.body = true)) {
                this.notificacionEnvioExitoso();
                this.agendaService.agendaInicializarOperacionesService.cargarCursosMatriculados();
                this.isLoading = false;
              }
            },
          });
      }
    });
  }

  notificacionEnvioExitoso() {
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Se Desmatriculo Con exito',
    });
  }
}

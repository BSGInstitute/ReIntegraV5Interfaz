import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { MatDialog } from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';

@Component({
  selector: 'app-gestion-de-fechas',
  templateUrl: './gestion-de-fechas.component.html',
  styleUrls: ['./gestion-de-fechas.component.scss'],
})
export class GestionDeFechasComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}

  @Input() datosActualizar: any;

  loading: any;
  listaFrecuencia: any;
  FechaFinMatriculaAlumno: any = null;
  FechaInicioMatriculaAlumno: any = null;
  tiempo: any = null;
  cantidad: any = null;

  ngOnInit(): void {
    this.ObtenerFrecuenciaTiempo();
  }

  ObtenerFrecuenciaTiempo() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerFrecuenciaTiempo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaFrecuencia = response.body;


          if (this.datosActualizar != undefined) {

            if (this.datosActualizar.fechaFinMatriculaAlumno != null) {
              this.FechaFinMatriculaAlumno = new Date(
                this.datosActualizar.fechaFinMatriculaAlumno
              );
            } else {
              this.FechaFinMatriculaAlumno = null;
            }
  
            if (this.datosActualizar.fechaInicioMatriculaAlumno != null) {
              this.FechaInicioMatriculaAlumno = new Date(
                this.datosActualizar.fechaInicioMatriculaAlumno
              );
            } else {
              this.FechaInicioMatriculaAlumno = null;
            }
  
            this.tiempo =
              this.datosActualizar.idTiempoFrecuenciaMatriculaAlumno;
            this.cantidad = this.datosActualizar.cantidadTiempoMatriculaAlumno;
          }
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { constApiMarketing } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { AgregarPrioridadExcelComponent } from '../agregar-prioridad-excel/agregar-prioridad-excel.component';
import { HttpResponse } from '@angular/common/http';
import { AgregarConfiguracionComponent } from './agregar-configuracion/agregar-configuracion.component';

@Component({
  selector: 'app-modal-configuracion-prioridad',
  templateUrl: './modal-configuracion-prioridad.component.html',
  styleUrls: ['./modal-configuracion-prioridad.component.scss'],
})
export class ModalConfiguracionPrioridadComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    public dialogRef: MatDialogRef<AgregarPrioridadExcelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loading = true;
    console.log(this.data);
    this.ObtenerDias();
  }

  cantidadContactos: any;
  cantidadadContactos30: any;
  listaAsesores: any = [];
  listaGrilla: any = [];
  listaDetalle: any = [];
  loading:any = false
  dias:any = 0

  Agregar() {
    const dialogRef = this.dialog.open(AgregarConfiguracionComponent, {
      width: '1400px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: [this.listaDetalle, this.dias]
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ObtenerDato();
    });
  }

  ObtenerDato() {
    var jsonEnvio = {
      id: this.data.idCampaniaGeneralDetalleWhatsApp,
      Dias: this.dias.dias
    };
    this.integraService
      .postJsonResponse(
        constApiMarketing.ObtenerCampaniaGeneralDetalleResponsablePorPrioridad,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log(response.body);
          this.listaDetalle = response.body;
          this.cantidadContactos = this.listaDetalle.cantidadBase;
          this.cantidadadContactos30 = this.listaDetalle.cantidadDisponible;
          this.listaGrilla =
            this.listaDetalle.obtenerCampaniaGeneralDetalleResponsablePorPrioridadLista;
          console.log(this.listaGrilla);
          console.log(this.cantidadContactos)
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;

        },
        complete: () => {
          this.loading = false;

        },
      });
  }

  ObtenerDias(){
    
    var jsonEnvio = {
      id: this.data.idCampaniaGeneralDetalleWhatsApp,
    };
    this.integraService
      .postJsonResponse(
        constApiMarketing.ObtenerDiasPorPrioridadWhatsapp,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log(response.body);
          this.dias = response.body;
          console.log(this.dias);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;

        },
        complete: () => {
          this.loading = false;
          this.ObtenerDato();

        },
      });
  }

  Eliminar(e: any) {
    var jsonEnvio = {
      idCampaniaGeneralDetalleResponsableWhatsApp:
        e.idCampaniaGeneralDetalleResponsableWhatsApp,
      usuario: '',
    };

    console.log(jsonEnvio)
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .postJsonResponse(
            constApiMarketing.EliminarCampaniaGeneralDetalleResponsableWhatsApp,
            jsonEnvio
          )
          .subscribe({
            next: (response: HttpResponse<boolean>) => {
              console.log(response);
            },
            error: (error) => {
              this.alertaService.mensajeError(error);
            },
            complete: () => {
              Swal.fire('Success!', 'Registro Eliminado', 'success');
              this.dialogRef.close();
            },
          });
      }
    });
  }
}

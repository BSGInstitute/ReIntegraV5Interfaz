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
import { HttpResponse } from '@angular/common/http';
import { AgregarPrioridadExcelSmsComponent } from '../agregar-prioridad-excel-sms/agregar-prioridad-excel-sms.component';
import { AgregarConfiguracionSmsComponent } from './agregar-configuracion-sms/agregar-configuracion-sms.component';

@Component({
  selector: 'app-modal-configuracion-prioridad-sms',
  templateUrl: './modal-configuracion-prioridad-sms.component.html',
  styleUrls: ['./modal-configuracion-prioridad-sms.component.scss']
})
export class ModalConfiguracionPrioridadSmsComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    public dialogRef: MatDialogRef<AgregarPrioridadExcelSmsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loading = true;
    console.log(this.data);
    this.ObtenerDato();
  }

  cantidadContactos: any;
  cantidadadContactos30: any;
  listaAsesores: any = [];
  listaGrilla: any = [];
  listaDetalle: any = [];
  loading:any = false

  Agregar( ){
    
    const dialogRef = this.dialog.open(AgregarConfiguracionSmsComponent, {
      width: '1400px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      data: this.listaDetalle,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      this.ObtenerDato();
    });
  }

  ObtenerDato() {
    var jsonEnvio = {
      id: this.data.idCampaniaGeneralDetalleSms,
    };
    this.integraService
      .postJsonResponse(
        constApiMarketing.ObtenerCampaniaGeneralDetalleResponsablePorPrioridadSms,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log(response.body);
          this.listaDetalle = response.body;
          this.cantidadContactos = this.listaDetalle.cantidadBase;
          this.cantidadadContactos30 = this.listaDetalle.cantidadDisponible;
          this.listaGrilla =
            this.listaDetalle.obtenerCampaniaGeneralDetalleResponsablePorPrioridadListaSms;
          console.log(this.listaGrilla);
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

  Eliminar(e: any) {
    var jsonEnvio = {
      idCampaniaGeneralDetalleResponsableSms:
        e.idCampaniaGeneralDetalleResponsableSms,
      usuario: '',
    };

    console.log(jsonEnvio)
    this.alertaService.mensajeEliminar().then((result) => {
      if (result.isConfirmed) {
        this.integraService
          .postJsonResponse(
            constApiMarketing.EliminarCampaniaGeneralDetalleResponsableSms,
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

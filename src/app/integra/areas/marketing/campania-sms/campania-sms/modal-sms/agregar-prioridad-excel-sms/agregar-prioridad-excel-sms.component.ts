import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import {
  constApiFinanzas,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';


@Component({
  selector: 'app-agregar-prioridad-excel-sms',
  templateUrl: './agregar-prioridad-excel-sms.component.html',
  styleUrls: ['./agregar-prioridad-excel-sms.component.scss']
})
export class AgregarPrioridadExcelSmsComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    public dialogRef: MatDialogRef<AgregarPrioridadExcelSmsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    for (let i = 0; i < 25; i++) {
      let obj: any = {};
      obj.Id = i + 1;
      obj.Nombre = 'Prioridad ' + (i + 1);

          this.prioridades.push(obj);

    }
    console.log(this.data)
  }

  nombrePrioridadExcel:any
  prioridades:any = []
  numeroPrioridadExcel:any

  crearPrioridad(){
    var jsonEnvio = {
      nombre: this.nombrePrioridadExcel,
      idCampaniaGeneralSms: this.data,
      prioridad: this.numeroPrioridadExcel,
      usuario: '',
    };

    if(this.nombrePrioridadExcel != '' && this.numeroPrioridadExcel != ''){
      this.integraService
      .postJsonResponse(
        constApiMarketing.InsertarCampaniaGeneralDetalleExcelSms,
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
          Swal.fire('Success!', 'Registro Creado', 'success');
          this.dialogRef.close();
        },
      });
    }
    else{
        Swal.fire('Error!', 'Llene todos los campos', 'warning');
      }
  }

  Cancelar(){
    this.dialogRef.close()

  }
}

import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import {
  constApiFinanzas,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-agregar-prioridad-sms',
  templateUrl: './agregar-prioridad-sms.component.html',
  styleUrls: ['./agregar-prioridad-sms.component.scss']
})
export class AgregarPrioridadSmsComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AgregarPrioridadSmsComponent>
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    for (let i = 0; i < 25; i++) {
      let obj: any = {};
      obj.Id = i + 1;
      obj.Nombre = 'Prioridad ' + (i + 1);

          this.prioridades.push(obj);

    }
  }

  nombrePrioridad:any
  prioridades:any = []
  prioridad:any

  crearPrioridad(){
    var jsonEnvio = {
      nombre: this.nombrePrioridad,
      idCampaniaGeneralSms: this.data,
      prioridad: this.prioridad,
      usuario: '',
    };

    if(this.nombrePrioridad != '' && this.prioridad != ''){
      this.integraService
      .postJsonResponse(
        constApiMarketing.InsertarCampaniaGeneralDetalleSms,
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
}

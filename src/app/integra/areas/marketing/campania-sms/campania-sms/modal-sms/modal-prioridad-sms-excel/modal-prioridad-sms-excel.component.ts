import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import * as XLSX from 'xlsx';
import {
  constApiFinanzas,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';


@Component({
  selector: 'app-modal-prioridad-sms-excel',
  templateUrl: './modal-prioridad-sms-excel.component.html',
  styleUrls: ['./modal-prioridad-sms-excel.component.scss']
})
export class ModalPrioridadSmsExcelComponent implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    public dialogRef: MatDialogRef<ModalPrioridadSmsExcelComponent>
  ) { }

  ngOnInit(): void {
    for (let i = 0; i < 25; i++) {
      let obj: any = {};
      obj.Id = i + 1;
      obj.Nombre = 'Prioridad ' + (i + 1);

      this.prioridades.push(obj);
    }
    console.log(this.data);
    this.nombrePrioridadExcel = this.data.nombre;
    this.numeroPrioridadExcel = this.data.prioridad;
  }

  listaPrioridades: any = [];
  selectedFile: File;
  numeroPrioridadExcel: any;
  nombrePrioridadExcel: any;
  prioridades: any = [];
  loading:any = false

   //--------- Excel ----------------//

   onFileInputClick(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile != undefined) {
      this.onSubmit();
    }
  }

  onSubmit(): void {
    this.loading = true
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(this.selectedFile);

    fileReader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const idAlumnos = jsonData.map((item: any) => item.IdAlumno);
      const idAlumnosString = idAlumnos.join(',');
      console.log(idAlumnosString);

      var jsonEnvio = {
        // nombre: this.nombrePrioridadExcel,
        idCampaniaGeneralDetalleSms:
          this.data.idCampaniaGeneralDetalleSms,
        // prioridad: this.numeroPrioridadExcel,
        listaDeAlumnos: idAlumnosString,
        usuario: '',
      };

      this.integraService
        .postJsonResponse(constApiMarketing.ProcesarExcelSms, jsonEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log(response.body);
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
            this.loading = false

          },
          complete: () => {
            this.dialogRef.close();
            this.loading = false

          },
        });
    };
  }

  //------------ Funciones---------------//

  Modificar() {
    var jsonEnvio = {
      nombre: this.nombrePrioridadExcel,
      IdCampaniaGeneralDetalleSms:
        this.data.idCampaniaGeneralDetalleSms,
      prioridad: this.numeroPrioridadExcel,
      usuario: '',
    };

    this.integraService
      .postJsonResponse(
        constApiMarketing.ActualizarCamposCampaniaGeneralDetalleSms,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {
          this.dialogRef.close();
        },
      });
  }
}
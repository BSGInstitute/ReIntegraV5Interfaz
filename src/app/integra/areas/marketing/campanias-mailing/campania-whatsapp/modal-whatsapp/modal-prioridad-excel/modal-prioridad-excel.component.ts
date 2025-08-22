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
  selector: 'app-modal-prioridad-excel',
  templateUrl: './modal-prioridad-excel.component.html',
  styleUrls: ['./modal-prioridad-excel.component.scss'],
})
export class ModalPrioridadExcelComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    public dialogRef: MatDialogRef<ModalPrioridadExcelComponent>
  ) {}

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
    this.ObtenerDias();
  }

  listaPrioridades: any = [];
  selectedFile: File;
  numeroPrioridadExcel: any;
  nombrePrioridadExcel: any;
  prioridades: any = [];
  loading:any = false
  dias:any

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
        idCampaniaGeneralDetalleWhatsApp:
          this.data.idCampaniaGeneralDetalleWhatsApp,
        // prioridad: this.numeroPrioridadExcel,
        listaDeAlumnos: idAlumnosString,
        usuario: '',
        dias: this.dias
      };

      this.integraService
        .postJsonResponse(constApiMarketing.ProcesarExcel, jsonEnvio)
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
      IdCampaniaGeneralDetalleWhatsApp:
        this.data.idCampaniaGeneralDetalleWhatsApp,
      prioridad: this.numeroPrioridadExcel,
      usuario: '',
    };

    this.integraService
      .postJsonResponse(
        constApiMarketing.ActualizarCamposCampaniaGeneralDetalleWhatsApp,
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
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          var respuesta = response.body
          this.dias = respuesta.dias;
          console.log(this.dias);
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

}

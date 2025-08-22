import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { constApiGestionPersonal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

@Component({
  selector: 'app-importar-marcacion-personal',
  templateUrl: './importar-marcacion-personal.component.html',
  styleUrls: ['./importar-marcacion-personal.component.scss']
})
export class ImportarMarcacionPersonalComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertService:AlertaService,
    public finanzasService:FinanzasServiceService
  ) {}

  @ViewChild('fileInput') fileInput: any;
  file: File | null = null;
  listaCSV:any[]=[]
  loadeCargarDatar=false
  listaCSVExample:any[]=[]

  ngOnInit(): void {
    this.listaCSVExample.push({
      dni:"Ejemplo : 12345678",
      fechaMarcacion:"dd/MM/aaaa",
      m1:"HH:mm:ss",
      m2:"HH:mm:ss",
      m3:"HH:mm:ss",
      m4:"HH:mm:ss",
      m5:"HH:mm:ss",
      m6:"HH:mm:ss"
    })
  }

   //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------
  CargarDataCSV(){//carga datos del CSV
    if(this.file)
    {
      if(this.file.type=='text/csv')
      {
        this.MostrarDatosCSV(this.file);
      }
      else 
      {
        this.alertService.swalFire(
          '¡Solo se permiten archivos (*.csv)!',
          'Seleccione un archivo correcto.',
          'error'
        );
      }
    }
    else{
      this.alertService.swalFire(
        '¡Sin archivo!',
        'Seleccione un archivo tipo (*.csv).',
        'warning'
      );
    }
    
  }


  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de input FILE ------------------------------------------------------------------
  onClickFileInputButton(): void {//activa el evento de mostrar el seleccionador de archivos.
    this.fileInput.nativeElement.click();
  }

  onChangeFileInput(): void {//modifica el archivo selccionado
    const files: { [key: string]: File } = this.fileInput.nativeElement.files;
    this.file = files[0];
  }

  MostrarDatosCSV(csv:File){//Procesa el archivo .CSV para el llenado de la grilla secundaria.
    this.loadeCargarDatar= true;
    var ArchivoExcel = new FormData();
    ArchivoExcel.append('ArchivoExcel', csv);
      this.integraService
        .postFormDataResponse(
          `${constApiGestionPersonal.ProcesarExcelRegistroMarcacion}`,ArchivoExcel
        )
        .subscribe({
          next: (response: any) => {
            this.loadeCargarDatar= false;
            this.listaCSV=response
            this.alertService.swalFire(
              '¡Precesado correctamente!',
              'Los registros fueron procesados correctamente.',
              'success'
            );
            
          },
          error: (error) => {
            console.log("ERROR CSV",error)
            this.loadeCargarDatar= false;
            this.finanzasService.MensajeDeError(error,"CARGAR CSV")
          },
          complete: () => {},
        });
  }

  importarMarcacionPersonal(){
    if(this.listaCSV.length>0){
      this.loadeCargarDatar= true;
      const JsonString = JSON.stringify(this.listaCSV);
      const ObjectEnvio ={
        valor:JsonString
      }
      this.integraService
      .postJsonResponse(
        `${constApiGestionPersonal.InsertarMarcacionPersonal}`,ObjectEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loadeCargarDatar= false;
          this.listaCSV = []
          this.alertService.swalFire(
            '¡Procesado correctamente!',
            'Los registros fueron importados correctamente.',
            'success'
          );
          
        },
        error: (error) => {
          this.loadeCargarDatar= false;
          this.finanzasService.MensajeDeError(error,"importar registros marcacion")
        },
        complete: () => {},
      });

    }
    else this.alertService.swalFire(
      '¡Lista de datos vacia!',
      'Carga registros para importar al sistema.',
      'warning'
    );
  }

}

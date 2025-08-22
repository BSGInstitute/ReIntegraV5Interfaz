import { HttpResponse } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  constApiFinanzas,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-plantilla-conjunto-lista',
  templateUrl: './agregar-plantilla-conjunto-lista.component.html',
  styleUrls: ['./agregar-plantilla-conjunto-lista.component.scss']
})
export class AgregarPlantillaConjuntoListaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<AgregarPlantillaConjuntoListaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    console.log(this.data)
    this.obtenerPlantilla();
  }

  listaConjuntoLista:any = []
  nombreConjuntoLista: any
  idPlantilla: any 
  listaPlantilla:any = []
  id: any = 0



  obtenerPlantilla() {
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerPlantillaPanel}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaPlantilla = response.body;
          console.log(response.body);

        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.ObtenerDatosConjuntoLista()
        }
      });
  }

    
  ObtenerDatosConjuntoLista() {
    this.integraService
      .obtener(constApiMarketing.ObtenerDatosConjuntoLista + '/' + this.data)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaConjuntoLista = response.body[0];
          this.nombreConjuntoLista = this.listaConjuntoLista.nombre
          this.idPlantilla = this.listaConjuntoLista.idPlantilla
          this.id = this.listaConjuntoLista.id
          console.log(response.body);
    
        },
        error: (error) => {
          this.alertaService.mensajeError(error);

        },
      });
  }

  InsertarConfiguracionEnvioMailing(){
    if(this.id == null){
      this.id=0
    }
    var jsonEnvio = {

      id: this.id,
      nombre: this.listaConjuntoLista.nombre,
      descripcion: this.listaConjuntoLista.nombre,
      idConjuntoListaDetalle:  this.listaConjuntoLista.idConjuntoListaDetalle,
      idPlantilla: this.idPlantilla
    }

    this.integraService
    .postJsonResponse(constApiMarketing.InsertarConfiguracionEnvioMailing, jsonEnvio)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        this.listaPlantilla = response.body;
        console.log(response.body);
        this.dialogRef.close();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: "contains",
  };

  public changeFilterOperator(operator: "startsWith" | "contains"): void {
    this.filterSettings.operator = operator;
  }

}

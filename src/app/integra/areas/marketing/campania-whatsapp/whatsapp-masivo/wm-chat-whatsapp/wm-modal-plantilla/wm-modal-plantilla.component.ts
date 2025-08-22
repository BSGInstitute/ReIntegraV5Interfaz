import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IntegraService } from '@shared/services/integra.service';
import { constApiMarketing } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { AlertaService } from '@shared/services/alerta.service';

@Component({
  selector: 'app-wm-modal-plantilla',
  templateUrl: './wm-modal-plantilla.component.html',
  styleUrls: ['./wm-modal-plantilla.component.scss'],
})
export class WmModalPlantillaComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    public dialogRef: MatDialogRef<WmModalPlantillaComponent>,
    private alertaService: AlertaService
  ) {}

  loader: any = false;

  idPlantilla: any;
  idCentroCosto: any;
  celular: any;
  celularEmpresa: any;
  listaPlantilla: any = [];
  listaCentroCosto: any = [];
  listaIdAlumnos: any = [];
  listacombos: any = [];
  listaPais: any = [];
  idPais: any;
  idAlumno: any;

  ngOnInit(): void {
    this.loader = true;
    this.data.listaAlumnosPorCelular.forEach((e: any) => {
      this.listaIdAlumnos.push(e.idAlumno);
    });
    this.celular = this.data.celularUM;

    this.obtenerCombos();
  }

  //--------- Funciones -----------//

  obtenerCombos() {
    this.integraService
      .obtener(`${constApiMarketing.CombosPlantilla}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loader = false;
          this.listacombos = response.body;
          this.listaPlantilla = this.listacombos.idPlantilla;
          this.listaCentroCosto = this.listacombos.idCentroCosto;
          this.listaPais = this.listacombos.idPaisDTO;
        },
        error: (error) => {
          console.log(error);
          this.loader = false;
        },
        complete: () => {
          this.loader = false;
          this.idPais = this.data.idPaisEmpresa;
        },
      });
  }

  selectionChangePlantilla(e: any) {
    console.log(e);
  }

  selectionChangeCentroCosto(e: any) {
    console.log(e);
  }

  selectionChangePais(e: any) {
    console.log(e);
  }

  selectionChangeIdAlumno(e: any) {
    console.log(e);
  }

  Enviar() {
    this.loader = true;
    console.log(this.idPlantilla);
    console.log(this.idCentroCosto);
    console.log(this.celular);
    console.log(this.idPais);
    console.log(this.idPlantilla);
    console.log(this.idAlumno);

    var jsonEnvio = {
      idPlantilla: this.idPlantilla,
      idCentroCosto: this.idCentroCosto,
      celularWhatsApp: this.celular,
      idPais: this.idPais,
      idAlumno: this.idAlumno,
      idPersonal: 0,
      usuario: '',
    };
    this.integraService
      .postJsonResponse(constApiMarketing.EnvioPlantillas, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loader = false;
          if (!response.body) {
            this.alertaService.swalFireOptions({
              icon: 'error',
              title: 'Revise que la plantilla seleccionada sea valida o exista',
            });
          }
        },
        error: (error) => {
          console.log(error);
          this.loader = false;
        },
        complete: () => {
          this.loader = false;
          this.dialogRef.close();
        },
      });
  }

  //------------- filtro --------------//

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }
}

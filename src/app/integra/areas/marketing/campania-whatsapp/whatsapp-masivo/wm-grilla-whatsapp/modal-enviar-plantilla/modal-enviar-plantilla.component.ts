import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { constApiGlobal, constApiMarketing } from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';
import { HttpResponse } from '@angular/common/http';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { AlertaService } from '@shared/services/alerta.service';

interface Alumno {
  celularWhatsApp: number;
  idPais: number;
  idAlumno: number;
}
interface Request {
  idPlantilla: number;
  idCentroCosto: number;
  idPersonal: number;
  usuario: string;
  alumnos: Alumno[];
}

@Component({
  selector: 'app-modal-enviar-plantilla',
  templateUrl: './modal-enviar-plantilla.component.html',
  styleUrls: ['./modal-enviar-plantilla.component.scss'],
})
export class ModalEnviarPlantillaComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ModalEnviarPlantillaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private alertaService: AlertaService
  ) {}

  idPlantilla: number;
  idCentroCosto: number;
  loader = true;
  listaPlantilla: any = [];
  listaCentroCosto: any = [];
  listacombos: any = [];
  jsonRequest: Request = {
    idPlantilla: 0,
    idCentroCosto: 0,
    idPersonal: 0,
    usuario: '',
    alumnos: [],
  };
  listPaises: any = [];

  ngOnInit(): void {
    this.loader = true;
    this.getPaises();

    this.obtenerCombos();
  }

  getPaises() {
    this.integraService
      .obtenerTodo(constApiGlobal.PaisObtenerPaisCombo)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listPaises = response.body;

          //Construccion del json para enviar con atributos de alumnos
          this.jsonRequest = {
            idPlantilla: 0,
            idCentroCosto: 0,
            idPersonal: 0,
            usuario: '',
            alumnos: [],
          };
          this.data.forEach((element: any) => {
            const alumno: Alumno = {
              idAlumno: element.idAlumno,
              celularWhatsApp: element.celular,
              idPais: this.getPaisIdByNombre(element.pais),
            };
            this.jsonRequest.alumnos.push(alumno);
          });
        },
        error: (error) => {
          this.alertaService.notificationError(error.error);
        },
        complete: () => {},
      });
  }
  getPaisIdByNombre(nombrePais: string): number | null {
    if (!nombrePais || !this.listPaises?.length) return null;

    const paisEncontrado = this.listPaises.find(
      (p: any) =>
        p.nombrePais.toLowerCase().trim() === nombrePais.toLowerCase().trim()
    );

    return paisEncontrado?.id ?? null;
  }

  obtenerCombos() {
    this.integraService
      .obtener(`${constApiMarketing.CombosPlantilla}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loader = false;
          this.listacombos = response.body;
          this.listaPlantilla = this.listacombos.idPlantilla;
          this.listaCentroCosto = this.listacombos.idCentroCosto;
        },
        error: (error) => {
          console.log(error);
          this.loader = false;
        },
        complete: () => {
          this.loader = false;
        },
      });
  }

  selectionChangePlantilla(e: any) {
    console.log(e);
  }
  selectionChangeCentroCosto(e: any) {
    console.log(e);
  }

  Enviar() {
    this.loader = true;
    this.jsonRequest.idPlantilla = this.idPlantilla;
    this.jsonRequest.idCentroCosto = this.idCentroCosto;
    this.integraService
      .postJsonResponse(
        constApiMarketing.EnvioPlantillasPorLista,
        this.jsonRequest
      )
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

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }
}

import { Component, Inject, OnInit, ViewChild } from '@angular/core';
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
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
@Component({
  selector: 'app-campania-adwords',
  templateUrl: './campania-adwords.component.html',
  styleUrls: ['./campania-adwords.component.scss'],
})
export class CampaniaAdwordsComponent implements OnInit {
  @ViewChild('modalAdwords') modalAdwords: any;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.Combos();
    this.ObtenerCampaniasAdwords();
    this.limpiarDatos();
  }

  //----------- Variables ----------//

  listaCentroCosto: any = [];
  listaCombos: any = [];
  listaCampaniaGeneralAdwords: any = [];
  datosCampania: any;
  loading: any;

  idCentroCosto: any;
  esRemarketing: any = false;
  claveFormulario: any;
  nombreFormulario: any;
  nombreCampania: any;
  campaniaGoogleId: any;
  validador: any;
  idCampania: any;

  //-------- Obtencion de Datos --------------//

  Combos() {
    this.loading = true;
    this.integraService
      .obtener(
        constApiMarketing.ObtenerComboCampaniaGeneralDetalleResponsableWhatsApp
      )
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log(response.body);
          this.listaCombos = response.body;
          this.listaCentroCosto = this.listaCombos.idCentroCosto;
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

  ObtenerCampaniasAdwords() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerTodoCampaniaAdwords)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log(response.body);
          this.listaCampaniaGeneralAdwords = response.body;
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

  ObtenerCampaniasAdwordsPorId(id: any) {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerCampaniaAdwords + '/' + id)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log(response.body);
          this.datosCampania = response.body;
          (this.campaniaGoogleId = this.datosCampania.campaniaGoogleId),
            (this.nombreCampania = this.datosCampania.nombreCampania),
            (this.nombreFormulario = this.datosCampania.nombreFormulario),
            (this.claveFormulario = this.datosCampania.claveFormulario),
            (this.idCentroCosto = this.datosCampania.idCentroCosto),
            (this.esRemarketing = this.datosCampania.esRemarketing);
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

  InsertarCampaniaAdwords() {
    this.loading = true;

    var jsonEnvio = {
      CampaniaGoogleId: this.campaniaGoogleId,
      NombreCampania: this.nombreCampania,
      NombreFormulario: this.nombreFormulario,
      claveFormulario: this.claveFormulario,
      IdCentroCosto: this.idCentroCosto,
      EsRemarketing: this.esRemarketing,
      Estado: true,
      Usuario: '',
    };

    console.log(jsonEnvio)
    console.log(this.esRemarketing)
    this.integraService
      .postJsonResponse(constApiMarketing.InsertarCampaniaAdwords, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          Swal.fire('Error!', 'Hubo un error', 'error');
          this.loading = false;
          this.dialog.closeAll();
        },
        complete: () => {
          this.loading = false;
          Swal.fire('Success!', 'Registro Creado', 'success');
          this.ObtenerCampaniasAdwords();
          this.dialog.closeAll();
        },
      });
  }

  ActualizarCampaniaAdwords() {
    this.loading = true;

    var jsonEnvio = {
      Id: this.idCampania,
      CampaniaGoogleId: this.campaniaGoogleId,
      NombreCampania: this.nombreCampania,
      NombreFormulario: this.nombreFormulario,
      claveFormulario: this.claveFormulario,
      IdCentroCosto: this.idCentroCosto,
      EsRemarketing: this.esRemarketing,
      Usuario: '',
    };
    this.integraService
      .postJsonResponse(constApiMarketing.ActualizarCampaniaAdwords, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          console.log(response.body);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
          Swal.fire('Error!', 'Hubo un error', 'error');
          this.dialog.closeAll();
        },
        complete: () => {
          this.loading = false;
          this.ObtenerCampaniasAdwords();
          Swal.fire('Success!', 'Registro actualizado', 'success');
          this.dialog.closeAll();
        },
      });
  }

  setAll(event: any) {
    console.log(event);
  }

  selectionChangeCentro(e: any) {
    console.log(e);
  }

  crearCampania() {}

  Cancelar() {
    this.dialog.closeAll();
  }

  abrirModalCrearCampania(val: any, data: any) {
    this.limpiarDatos();
    console.log(val);
    console.log(data);
    this.validador = val;

    if (val == false) {
      this.idCampania = data.id;

      this.ObtenerCampaniasAdwordsPorId(data.id);
      const dialogRef = this.dialog.open(this.modalAdwords, {
        maxWidth: '90%',
        maxHeight: '100vh',
        panelClass: 'custom-dialog-container',
      });
    }
    if (val == true) {
      const dialogRef = this.dialog.open(this.modalAdwords, {
        maxWidth: '90%',
        maxHeight: '100vh',
        panelClass: 'custom-dialog-container',
      });
    }
  }

  deleteAdowrds(id: any) {
    this.alertaService.mensajeEliminar().then((result) => {
      this.integraService
        .obtener(constApiMarketing.EliminarCampaniaAdwords + '/' + id)
        .subscribe({
          next: (response: HttpResponse<boolean>) => {
            console.log(response.body);
            this.datosCampania = response.body;
          },
          error: (error) => {
            this.alertaService.mensajeError(error);
            this.loading = false;
            Swal.fire('Error!', 'Hubo un error', 'error');
            this.ObtenerCampaniasAdwords();

          },
          complete: () => {
            this.loading = false;
            Swal.fire('Success!', 'Se elimino correctamente', 'success');
            this.ObtenerCampaniasAdwords();

          },
        });
    });
  }

  //--------- Limpiar datos -----------//

  limpiarDatos(): void {
    this.idCentroCosto = null;
    this.esRemarketing = false;
    this.claveFormulario = null;
    this.nombreFormulario = null;
    this.nombreCampania = null;
    this.campaniaGoogleId = null;
    this.idCampania = null;
  }

  //------- Filtro ----------//

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }
}

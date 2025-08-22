import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import {
  constApiFinanzas,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { SendinBlueService } from '@shared/services/sendin-blue.service';
import Swal from 'sweetalert2';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
@Component({
  selector: 'app-modal-prioridades',
  templateUrl: './modal-prioridades.component.html',
  styleUrls: ['./modal-prioridades.component.scss'],
})
export class ModalPrioridadesComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private _sendinblueService: SendinBlueService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalPrioridadesComponent>
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    for (let i = 0; i < 25; i++) {
      let obj: any = {};
      obj.Id = i + 1;
      obj.Nombre = 'Prioridad ' + (i + 1);

      this.prioridades.push(obj);
    }
    this.prioridad = this.data.prioridad;
    this.ObtenerComboCampaniasSendinBlue();
    this.ObtenerDias();
  }

  nombrePrioridad: any = '';
  prioridad: any;
  campanias: any = [];
  campania: any;
  prioridades: any = [];
  listaConfiguracion: any = [];
  idCampaniaGeneral: any;
  idCampaniaGeneralDetalle: any;

  listaCampania: any;
  listaPrioridades: any = [];
  idFiltroSegmentoTipoContacto: any;
  filteredOptions: Array<any>;
  nroPrioridad: any = 0;

  listaCombos: any = [];

  loading = false;
  ida: any;
  idPrioridad: any;

  dias: any = 0;

  //--------- Filtros -------------//

  campaniaFilter: any;
  filteredListaCampania: any = [];

  prioridadFilter: any;
  filteredListaPrioridad: any = [];

  Obtener() {
    var jsonEnvio = {
      id: this.data.idCampaniaGeneralDetalleWhatsApp,
    };
    this.integraService
      .postJsonResponse(
        constApiMarketing.ObtenerConfiguracionCampaniaGeneralDetalleWhatsApp,
        jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);

          this.listaConfiguracion = response.body;
          this.nombrePrioridad = this.listaConfiguracion.nombre;
          // this.prioridad = this.listaConfiguracion.prioridad
          this.ida = this.listaConfiguracion.idCampaniaGeneral;
          this.idPrioridad = this.listaConfiguracion.idCampaniaGeneralDetalle;

          this.filteredListaPrioridad = this.listaPrioridades.filter(
            (item: any) => item.idCampaniaGeneral === this.ida
          );
          console.log(this.filteredListaPrioridad);
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
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

  ObtenerComboCampaniasSendinBlue() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerComboCampaniasSendinBlue)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaCombos = response.body;
          this.listaCampania = this.listaCombos.idCampaniaGeneral;
          this.listaPrioridades = this.listaCombos.idCampaniaGeneralDetalle;
          this.loading = false;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
          this.loading = false;
        },
        complete: () => {
          this.Obtener();
        },
      });
  }

  //------------ Funciones ----------------//

  ProcesarPrioridades() {
    this.loading = true;
    var jsonEnvio = {
      idCampaniaGeneral: this.ida,
      idCampaniaGeneralDetalle: this.idPrioridad,
      IdCampaniaGeneralDetalleWhatsApp:
        this.data.idCampaniaGeneralDetalleWhatsApp,
      Dias: this.dias,
      usuario: '',
    };

    this.integraService
      .postJsonResponse(constApiMarketing.ProcesarPrioridades, jsonEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
        },
        error: (error) => {
          console.log('error');
          this.loading = false;
        },
        complete: () => {
          Swal.fire('Success!', 'Se agrego la prioridad', 'success');
          this.dialogRef.close();
          this.loading = false;
        },
      });
  }

  ActualizarCamposCampaniaGeneralDetalleWhatsApp() {
    this.loading = true;
    var jsonEnvio = {
      nombre: this.nombrePrioridad,
      IdCampaniaGeneralDetalleWhatsApp:
        this.data.idCampaniaGeneralDetalleWhatsApp,
      prioridad: this.prioridad,
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
          console.log('error');
          this.loading = false;
        },
        complete: () => {
          Swal.fire('Success!', 'Se actualizo la prioridad', 'success');
          this.loading = false;
        },
      });
  }

  //---------- Filtro ---------------//

  valueChange(e: any) {
    this.idPrioridad = null;
    console.log(e);
    this.ida = e.idCampaniaGeneral;

    console.log(this.idPrioridad);
    this.filteredListaPrioridad = this.listaPrioridades.filter(
      (item: any) => item.idCampaniaGeneral === this.ida
    );

    console.log(this.filteredListaPrioridad);
  }

  selectionChange(e: any) {
    console.log(e);
    this.idPrioridad = e.idCampaniaGeneralDetalle;
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }
}

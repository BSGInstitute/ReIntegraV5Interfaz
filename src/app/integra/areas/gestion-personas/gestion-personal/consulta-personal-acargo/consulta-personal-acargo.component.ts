import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
import { FormService } from '@shared/services/form.service';
import { constApiGestionPersonal } from '@environments/constApi';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
interface FormFiltro {
  listaPersonal?: number[];
  listaAreaTrabajo?: number;
  estado?: number;
}
interface FiltroEnvio {
  listaPersonal?: number[];
  listaAreaTrabajo?: number;
  estado?: number;
}

interface PersonalJefaturaDTO {
  idPersonal: number;
  personal: string;
  puestoTrabajo: string;
  personalACargo: PersonalJefaturaDTO[];
}
@Component({
  selector: 'app-consulta-personal-acargo',
  templateUrl: './consulta-personal-acargo.component.html',
  styleUrls: ['./consulta-personal-acargo.component.scss'],
})
export class ConsultaPersonalACargoComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private formService: FormService
  ) {}

  enProcesoSolicitud: boolean = false;
  gridPersonalTotal: KendoGrid = new KendoGrid();
  gridPersonalACargo: KendoGrid = new KendoGrid();
  gridPersonalActivo: PersonalJefaturaDTO[] = [];
  dataPersonalFiltro: any[] = [];
  DataAreaTrabajo: IComboBase1[] = [];
  dataPersonal: any[] = [];
  formFiltro: FormGroup = this._formBuilder.group({
    listaPersonal: [[]],
    estado: null,
    listaAreaTrabajo: null,
  });
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  estadoPersonal = [
    { id: 1, nombre: 'Activos' },
    { id: 0, nombre: 'Inactivos' },
  ];
  ngOnInit(): void {
    this.obtenerCombos();
    this.ObtenerPersonalActivo();
  }

  onDetailExpand(event: any): void {
    const nombreSeleccionado = event.dataItem.id;

    // Filtra los datos para el segundo grid basándose en 'nombre'
    this.gridPersonalACargo.data = this.gridPersonalACargo.data.filter(
      (item: any) => item.idEvaluacion === nombreSeleccionado
    );
  }
  generarReporte() {
    let datosFormFiltro = this.formFiltro.getRawValue() as FormFiltro;
    console.log("Datos de Form Filtro : ",datosFormFiltro)
    let filtro: FiltroEnvio = {
      listaPersonal: datosFormFiltro.listaPersonal ?? [],
      listaAreaTrabajo: datosFormFiltro.listaAreaTrabajo ?? null,
      estado: datosFormFiltro.estado?? null,
    };
    console.log("Datos de  Filtro : ",filtro)
    console.log('Datos de Filtro : ', filtro);
    this.gridPersonalTotal.loading = true;
    this._integraService
      .postJsonResponse(
        constApiGestionPersonal.PersonalObtenerReporteTodoPersonal,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<any[]>) => {
          this.gridPersonalTotal.data = resp.body;
          this.gridPersonalTotal.loading = false;
        },
        error: (error) => {
          console.log('aqui entro error');
          this.gridPersonalTotal.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  obtenerCombos() {
    this._integraService
      .getJsonResponse(constApiGestionPersonal.PersonalObtenerCombosJefatura)
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          this.DataAreaTrabajo = resp.body;
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }


  selectedPersonal: number[] = [];

  obtenerPersonalFiltro(valor: string): void {
    if (valor.length >= 3) {
      const body = { valor };

      this._integraService
        .postJsonResponse(
          `${constApiGestionPersonal.PersonalCargarPersonalAutoComplete}`,
          body
        )
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            this.dataPersonalFiltro = resp.body || [];

            this.selectedPersonal = this.selectedPersonal.filter((id) =>
              this.dataPersonalFiltro.some((p) => p.Id === id)
            );
          },
          error: (error) => {
            console.log('Error al obtener personal:', error);
          },
        });
    }
  }

  ObtenerPersonalActivo() {
    this._integraService
      .getJsonResponse(constApiGestionPersonal.PersonalObtenergenerarReportePersonalActivo)
      .subscribe({
        next: (resp: HttpResponse<PersonalJefaturaDTO>) => {
          console.log("Respuesta del servicio: ", resp.body);
          if (resp.body && resp.body.personalACargo) {
            this.gridPersonalActivo = this.formatearDatos([resp.body]);
            console.log("Data asignada a la grilla: ", this.gridPersonalActivo);
          } else {
            console.warn("⚠️ El servicio no retornó datos.");
          }
        },
        error: (error) => {
          console.log('Error al obtener datos');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  private formatearDatos(data: PersonalJefaturaDTO[]): PersonalJefaturaDTO[] {
    return data.map(persona => ({
      idPersonal: persona.idPersonal,
      personal: persona.personal === 'BS_GRUPO_ADAPTAR_JERARQUIA' ? 'BSG Institute' : persona.personal,
      puestoTrabajo: persona.puestoTrabajo || 'Sin puesto registrado',
      personalACargo: persona.personalACargo ? this.formatearDatos(persona.personalACargo) : []
    }));
  }

  // Métodos de formateo para la vista
  formatPersonal(personal: string): string {
    return personal === 'BS_GRUPO_ADAPTAR_JERARQUIA' ? 'BSG Institute' : (personal || 'Sin Personal');
  }

  formatPuestoTrabajo(puestoTrabajo: string | null): string {
    return puestoTrabajo ? puestoTrabajo : 'Sin Puesto Registrado';
  }

  formatCantidad(dataItem: PersonalJefaturaDTO): number {
    return dataItem.personalACargo ? dataItem.personalACargo.length : 0;
  }

  public showOnlyBeveragesDetails(dataItem: any): boolean {
    return dataItem?.personalACargo != null && dataItem?.personalACargo.length > 0;
  }
}

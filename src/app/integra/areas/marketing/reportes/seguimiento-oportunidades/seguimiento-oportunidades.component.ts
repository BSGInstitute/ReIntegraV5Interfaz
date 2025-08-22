import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  constApiGlobal,
  constApiMarketing,
  constApiComercial,
} from '@environments/constApi';
import { IntegraService } from '@shared/services/integra.service';

import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-seguimiento-oportunidades',
  templateUrl: './seguimiento-oportunidades.component.html',
  styleUrls: ['./seguimiento-oportunidades.component.scss'],
})
export class SeguimientoOportunidadesComponent implements OnInit {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dialog: MatDialog
  ) {}

  formulario: FormGroup;
  listaAsesores: any = [];
  listaCentroCostos: any = [];
  listaFaseOportunidad: any = [];
  listaTipoFecha = [
    { id: 1, nombre: 'Creacion Oportunidad' },
    { id: 2, nombre: 'Creacion Registro' },
  ];
  listaReporte: any = [];
  loader: any;
  fechaActual = new Date();

  ngOnInit(): void {
    this.ObtenerCombosReporte();

    this.formulario = this.formBuilder.group({
      asesores: [[]],
      centroC: [[]],
      faseO: [[]],
      fec: [1],
      fechaInicio: [this.fechaActual],
      fechaFin: [this.fechaActual],
    });
    
  }

  ObtenerCombosReporte() {
    this.loader = true;
    this.integraService
      .obtener(
        constApiComercial.ReporteSeguimientoOportunidadesObtenerCombosSeguimiento +
          '/' +
          213
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaAsesores = response.body.asesores;
          this.listaCentroCostos = response.body.centroCostos;
          this.listaFaseOportunidad = response.body.faseOportunidades;
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  buscar() {
    this.loader = true;
    if (this.formulario.valid) {
      const formValues = this.formulario.value;
      console.log(formValues);

      var jsonEnvio = {
        CentroCostos: this.formulario.value.centroC,
        Asesores : this.formulario.value.asesores,
        FasesOportunidad : this.formulario.value.faseO,
        FechaInicio : this.formulario.value.fechaInicio,
        FechaFin : this.formulario.value.fechaFin,
        TipoFecha : this.formulario.value.fec,
        OpcionFase: 0,
        FaseOportunidadOrigen: [] as any,
        FaseOportunidadDestino: [] as any ,
      }

      this.integraService
      .postJsonResponse(
        constApiMarketing.GenerarReporteFechaCreacionRegistro, jsonEnvio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body);
          this.listaReporte = response.body
          this.loader = false;
        },
        error: (error) => {
          console.log(error);
          this.loader = false;
        },
      });

    }
  }

  gridEventsResponse(event: any) {
    console.log(event);
  }

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }
}

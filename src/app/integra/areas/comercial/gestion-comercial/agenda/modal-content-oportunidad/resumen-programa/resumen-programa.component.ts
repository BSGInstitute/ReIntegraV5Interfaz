import { Subscription } from 'rxjs';

import {
  IInformacionProgramaV1,
  IAgendaConfiguracion,
} from '@integra/areas/comercial/models/interfaces/iagenda-informacion-actividad-oportunidad';
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { IAlumnoInformacion } from '@comercial/models/interfaces/iagenda-datos-alumno';

/**
  Modulo ResumenProgramaComponent ***
  @autor Miguel Quiñones ***
 * @version 1.0.1
  History
 * 15/111/2022 Migracion Modulo de V4
 */
@Component({
  selector: 'app-resumen-programa',
  templateUrl: './resumen-programa.component.html',
  styleUrls: ['./resumen-programa.component.scss'],
})
export class ResumenProgramaComponent implements OnInit, OnDestroy {
  areasCapacitacion: any[] = [];
  programasGenerales: any[] = [];
  subAreasCapacitacion: any[] = [];
  subAreasCapacitacionPorArea: any[] = [];

  areasCapacitacionFiltro: any[] = [];
  subAreasCapacitacionFiltro: any[] = [];

  resumenProgramaTab: any = null;
  loader: boolean = false;
  codigoPais: number;
  formResumenProgramas: FormGroup = this._formBuilder.group({
    idArea: [[]],
    idSubArea: [[]],
  });
  gridTabResumenPrograma: KendoGrid = new KendoGrid();
  private _subscriptions$: Subscription = new Subscription();
  @Input() agendaService: AgendaService;
  constructor(private _formBuilder: FormBuilder) {}
  gridResumenPrograma: KendoGrid = new KendoGrid();
  _alumno: IAlumnoInformacion;
  ngOnInit(): void {
    this.initSubcribeObservable();
  }
  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }
  private initSubcribeObservable() {
    let sub1$ = this.agendaService.agendaAlumnoService.alumno$.subscribe(
      (resp) => {
        if (resp != null) {
          this._alumno = resp;
        }
      }
    );
    let sub2$ =
      this.agendaService.agendaInformacionActividadOportunidadService.agendaConfiguraciones$.subscribe(
        {
          next: (response: IAgendaConfiguracion) => {
            if (response != null) {
              this.areasCapacitacion = response.areasCapacitacion;
              this.areasCapacitacionFiltro = response.areasCapacitacion;
              this.programasGenerales = response.programasGenerales;
              this.subAreasCapacitacion = response.subAreasCapacitacion;
              this.gridResumenPrograma.loading = true;
              let sub$ =
                this.agendaService.agendaInformacionActividadOportunidadService.informacionProgramaV1$.subscribe(
                  {
                    next: (resp: IInformacionProgramaV1) => {
                      if (resp != null) {
                        this.gridResumenPrograma.data =
                          resp.respuesta.resumenProgramasV2;
                        this.gridResumenPrograma.loading = false;
                        let selected = resp.respuesta.resumenProgramasV2[0];
                        if (this.areasCapacitacionFiltro.length > 0) {
                          this.formResumenProgramas
                            .get('idArea')
                            .setValue([selected.idArea]);
                          this.changeAreaResumenPrograma(
                            this.formResumenProgramas.get('idArea').value
                          );
                          if (this.subAreasCapacitacion.length > 0) {
                            let subAreaSelect = this.subAreasCapacitacion.find(
                              (e) => e.id == selected.idSubArea
                            );
                            this.formResumenProgramas
                              .get('idSubArea')
                              .setValue([subAreaSelect]);
                          }
                        }
                      }
                      this.gridResumenPrograma.loading = false;
                    },
                  }
                );
              this._subscriptions$.add(sub$);
            }
          },
        }
      );
    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
  }
  changeAreaResumenPrograma(event: any) {
    if (event.length >= 0) {
      this.subAreasCapacitacionFiltro = [];
      this.subAreasCapacitacionFiltro = this.subAreasCapacitacion.filter(
        (e: any) => event.includes(e.idAreaCapacitacion)
      );
      this.subAreasCapacitacionPorArea = this.subAreasCapacitacionFiltro;
    } else {
      this.subAreasCapacitacionPorArea = [];
      this.subAreasCapacitacionFiltro = [];
    }
  }
  filterAreas(value: string) {
    if (value.length >= 1) {
      this.areasCapacitacionFiltro = this.areasCapacitacion.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.areasCapacitacionFiltro = this.areasCapacitacion;
    }
  }
  filtroSubAreaResumen(value: any) {
    if (value.length >= 1) {
      this.subAreasCapacitacionFiltro = this.subAreasCapacitacionPorArea.filter(
        (s) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
      );
    } else {
      this.subAreasCapacitacionFiltro = this.subAreasCapacitacionPorArea;
    }
  }
  removeAreaResumenPrograma(event: any) {
    let idArea = event.dataItem.id;
    let lista = this.formResumenProgramas.get('idSubArea').value;
    let dataFinal = lista.filter((e: any) => e.idAreaCapacitacion != idArea);
    this.formResumenProgramas.get('idSubArea').setValue(dataFinal);
  }

  _generarResumen() {
    let lista: any[] = [];
    let listaEnvio: any[] = [];
    this.formResumenProgramas.get('idSubArea').value.forEach((element: any) => {
      lista.push(element.id);
    });
    let data;
    if (lista.length > 0) {
      listaEnvio = lista;
      data = {
        idArea: this.formResumenProgramas.get('idArea').value.join(','),
        codigoPais: this._alumno.idCodigoPais.toString(), //falta
        idsubarea: lista.join(','),
      };
    } else {
      listaEnvio = null;
      data = {
        idArea: this.formResumenProgramas.get('idArea').value.join(','),
        codigoPais: this._alumno.idCodigoPais.toString(), //falta
        idsubarea: null,
      };
    }
    this.gridResumenPrograma.loading = true;
    this.agendaService.agendaInformacionActividadOportunidadService
      .setDataResumenProgramasByAreaV2(data)
      .subscribe({
        next: (Response: HttpResponse<any>) => {
          if (Response != null) {
            this.gridResumenPrograma.data = Response.body;
            this.gridResumenPrograma.loading = false;
          }
        },
      });
  }
}

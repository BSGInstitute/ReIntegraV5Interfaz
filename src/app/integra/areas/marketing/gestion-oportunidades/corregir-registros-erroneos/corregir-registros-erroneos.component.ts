import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormGroup,FormBuilder,FormControl } from '@angular/forms';
import { constApiMarketing } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { AsignacionAutomaticaService } from '../../services/asignacion-automatica.service';
import { TabStripScrollButtonsVisibility } from '@progress/kendo-angular-layout';
import { AsignacionAutomaticaFiltro } from '@integra/models/asignacion-automatica';
import { DatePipe } from '@angular/common';
const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-dd HH:mm:ss';
@Component({
  selector: 'app-corregir-registros-erroneos',
  templateUrl: './corregir-registros-erroneos.component.html',
  styleUrls: ['./corregir-registros-erroneos.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class CorregirRegistrosErroneosComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    private _asignacionAutomaticaService: AsignacionAutomaticaService

  ) {}
  tabsAsignacionAutomatica: any = this._asignacionAutomaticaService.tabsAsignacionAutomatica;
  tabSeleccionado: any ={};
  indexActual=0;
  formFiltroBusqueda: FormGroup = this.formBuilder.group({
    IdCentroCosto: 0,
    IdCategoriaDato: 0,
    IdPais: 0,
    IdProbabilidad: 0,
    IdIndustria: 0,
    IdCargo: 0,
    IdAreaTrabajo: 0,
    IdAreaFormacion: 0,
    FechaInicio:'',
    FechaFin:''
  });
  filtrosGenerales: any = {
    listaCentroCosto: [],
    listaCategoriaDato: [],
    listaPais: [],
    listaCiudad: [],
    listaProbabilidad: [],
    listaIndustria: [],
    listaCargo: [],
    listaAreaTrabajo: [],
    listaAreaFormacion: [],
  };
  buttons: TabStripScrollButtonsVisibility = 'auto';
  ListaFiltro: AsignacionAutomaticaFiltro={
    IdCentroCosto:'',
    IdCategoriaDato:'',
    IdPais: '',
    IdProbabilidad: '',
    IdIndustria: '',
    IdCargo: '',
    IdAreaTrabajo: '',
    IdAreaFormacion: '',
    FechaInicio:pipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), 1), formatoFecha),
    FechaFin:pipe.transform(new Date(), formatoFecha),
  }
  public FechaInicio=new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  public FechaFin=new Date()

  ngOnInit(): void {
    this.formFiltroBusqueda.get('FechaInicio').setValue(this.FechaInicio);
    this.formFiltroBusqueda.get('FechaFin').setValue(this.FechaFin);
    this.tabSeleccionado = this.tabsAsignacionAutomatica[0];
    let eventFake:any={};
    eventFake.index=this.tabsAsignacionAutomatica[0].indexTab;
    eventFake.prevented=false;
    eventFake.title=this.tabsAsignacionAutomatica[0].titleTab;
    this.onSelectTabAsignacionAutomatica(eventFake);
    this.obtenerFiltrosCombos();
  }
  onSelectTabAsignacionAutomatica(event: any) {
    this.tabsAsignacionAutomatica.forEach((element: any) => {
      element.selected = false;
    });
    this.tabsAsignacionAutomatica[event.index].indexTab = event.index;
    this.tabsAsignacionAutomatica[event.index].selected = true;
    this.tabSeleccionado = this.tabsAsignacionAutomatica[event.index];
    this.indexActual=this.tabSeleccionado.indexTab;
  }
  get asignacionAutomaticaService(): AsignacionAutomaticaService{
    return this._asignacionAutomaticaService
  }
  obtenerFiltrosCombos() {
    this.integraService
      .getJsonResponse(`${constApiMarketing.AsignacionAutomaticaObtenerFiltros}`)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.filtrosGenerales = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
      });
  }
  InicializarFiltros(){
    this.ListaFiltro={
      IdCentroCosto:'',
      IdCategoriaDato:'',
      IdPais: '',
      IdProbabilidad: '',
      IdIndustria: '',
      IdCargo: '',
      IdAreaTrabajo: '',
      IdAreaFormacion: '',
      FechaInicio:pipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), 1), formatoFecha),
      FechaFin:pipe.transform(new Date(), formatoFecha),
    };
  }
  BuscarFiltros(){
    this.InicializarFiltros();
    this.ListaFiltro.IdCentroCosto =this.formFiltroBusqueda.get('IdCentroCosto').value?
      this.formFiltroBusqueda.get('IdCentroCosto').value.join(',') :'';
    this.ListaFiltro.IdCategoriaDato =this.formFiltroBusqueda.get('IdCategoriaDato').value?
      this.formFiltroBusqueda.get('IdCategoriaDato').value.join(',') :'';
    this.ListaFiltro.IdPais =this.formFiltroBusqueda.get('IdPais').value?
      this.formFiltroBusqueda.get('IdPais').value.join(',') :'';
    this.ListaFiltro.IdProbabilidad =this.formFiltroBusqueda.get('IdProbabilidad').value?
      this.formFiltroBusqueda.get('IdProbabilidad').value.join(',') :'';
    this.ListaFiltro.IdIndustria =this.formFiltroBusqueda.get('IdIndustria').value?
      this.formFiltroBusqueda.get('IdIndustria').value.join(',') :'';
    this.ListaFiltro.IdCargo =this.formFiltroBusqueda.get('IdCargo').value?
      this.formFiltroBusqueda.get('IdCargo').value.join(',') :'';
    this.ListaFiltro.IdAreaTrabajo =this.formFiltroBusqueda.get('IdAreaTrabajo').value?
      this.formFiltroBusqueda.get('IdAreaTrabajo').value.join(',') :'';
    this.ListaFiltro.IdAreaFormacion = this.formFiltroBusqueda.get('IdAreaFormacion').value?
      this.formFiltroBusqueda.get('IdAreaFormacion').value.join(',') :'';
    this.ListaFiltro.FechaInicio = pipe.transform(this.formFiltroBusqueda.get('FechaInicio').value, formatoFecha);
    this.ListaFiltro.FechaFin = pipe.transform(this.formFiltroBusqueda.get('FechaFin').value, formatoFecha);
    this.indexActual=this.tabSeleccionado.indexTab;
  }
}

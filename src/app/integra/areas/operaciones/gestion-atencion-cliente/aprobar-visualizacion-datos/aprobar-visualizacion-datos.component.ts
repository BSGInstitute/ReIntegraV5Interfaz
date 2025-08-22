import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiOperaciones } from '@environments/constApi';
import { Asesores, FaseOportunidad, Aprobado, Asesores_CentroCosto_Estado_Fase, CentroCosto, Estado, Oportunidad } from '@integra/areas/comercial/models/interfaces/iaprobar-visualizacion';
import { AgendaService } from '@integra/areas/comercial/services/agenda/agenda.service';
import { ExcelModule, GridComponent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aprobar-visualizacion-datos',
  templateUrl: './aprobar-visualizacion-datos.component.html',
  styleUrls: ['./aprobar-visualizacion-datos.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AprobarVisualizacionDatosComponent implements OnInit {
  @ViewChild('kendoGridSolicitudVisualizacion') kendoGridSolicitudVisualizacion:GridComponent;
  gridSolicitudVisualizacion:KendoGrid = new KendoGrid();
  
  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) { }

  flagParaFiltro:number = 0;
  listaFaseOportunidad:FaseOportunidad[] = null;

  listaAsesores:Asesores[] = null;
  listaAsesoresTemp:Asesores[] = null;

  listaCentroCostos:CentroCosto[] = null;
  listaCentroCostosTemp:CentroCosto[] = null;
  listaCentroCostoPorAsesor:CentroCosto[] = null;

  listaEstados:Estado[] = null;
  
  skipPage:number = 0;

  ngOnInit(): void {
    this.gridSolicitudVisualizacion.pageable = true;
    this.gridSolicitudVisualizacion.pageSize = 15;
    this.gridSolicitudVisualizacion.sortable = true;
    this.gridSolicitudVisualizacion.skip = 0;
    this.ready();
  }

  formFiltro: FormGroup = this.formBuilder.group({
    asesores: [],
    centroCosto: null,
    faseOportunidad: [],
  });

  idPersonalGlobal: number = 0

  ready() {
    let idPersonal = this.userService.userData.idPersonal;
    if (idPersonal === 4264 || idPersonal === 4845 || idPersonal === 15 || idPersonal === 74 || idPersonal === 4734) {
      this.idPersonalGlobal = 213;
    } else {
      this.idPersonalGlobal = idPersonal;
    }
    this.integraService
      .getJsonResponse(`${constApiOperaciones.SolicitudOperacionesObtenerCombosOperaciones}/${this.idPersonalGlobal}`)
        .subscribe({
          next: (response: HttpResponse<Asesores_CentroCosto_Estado_Fase>) => {
            this.listaFaseOportunidad = response.body.faseOportunidades;

            this.listaAsesores = response.body.asesores;
            this.listaAsesoresTemp = response.body.asesores;

            this.listaCentroCostos = response.body.centroCostos;
            this.listaCentroCostosTemp = response.body.centroCostos;

            this.listaEstados = response.body.estados;
            this.formFiltro.get('faseOportunidad').setValue([5, 23, 25])
          }
        })
  }

  filtrarAsesores(value:string) {
    this.listaAsesores = this.listaAsesoresTemp.filter(
      (s:Asesores) => s.nombres.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  filtrarCentroCosto(value:string) {
    if (value.length >= 1) {
      this.listaCentroCostos = (this.flagParaFiltro != 1) ? this.filtrarCentroCostoOriginal(value) : this.filtrarPorCentroCostoAsesor(value);
    } else {
      this.listaCentroCostos = (this.flagParaFiltro != 1) ? this.listaCentroCostosTemp : this.listaCentroCostoPorAsesor;
    }
  }

  filtrarPorCentroCostoAsesor(value:string) {
    return this.listaCentroCostoPorAsesor.filter(
      (s:CentroCosto) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  filtrarCentroCostoOriginal(value:string) {
    return this.listaCentroCostosTemp.filter(
      (s:CentroCosto) => s.nombre.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
  }

  prepararFiltros() {
    let params = this.formFiltro.getRawValue();
    let objetoEnvio = {
      centroCostos: (params.centroCosto != null) ? [params.centroCosto] : [],
      asesores: (params.asesores != null) ? params.asesores : [],
      fasesOportunidad: (params.faseOportunidad != null) ? params.faseOportunidad : []
    }
    return objetoEnvio;
  }

  seleccionAsesor(data:any) {
    this.formFiltro.get('centroCosto').setValue(null);
    let idsAsesores = {"ids": data}
    if(data.length == 0){
      this.flagParaFiltro = 0;
      this.listaCentroCostos = this.listaCentroCostosTemp;
    } else {
      this.flagParaFiltro = 1;
      this.integraService
        .postJsonResponse(`${constApiOperaciones.SolicitudOperacionesObtenerCentroCostoPorPersonal}`, idsAsesores)
          .subscribe({
            next: (response: HttpResponse<CentroCosto[]>) => {
              this.listaCentroCostoPorAsesor = response.body;
              this.listaCentroCostos = response.body
            }
          })
    }
  }

  aprobar(dataItem:any) {
    Swal.fire({
      title: 'Realmente desea Aprobar la Solicitud?',
      icon: 'warning',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        let objetoAprobacion:any = {
          idOportunidad: dataItem.id,
          idPersonalSolicitante: dataItem.idPersonalSolicitante,
          usuario: this.userService.userData.userName,
          idSolicitudVisualizacion: dataItem.idSolicitudVisualizacion
        }
        this.integraService
          .postJsonResponse(`${constApiOperaciones.SolicitudOperacionesAprobarSolicitudVisualizacion}/`, objetoAprobacion)
            .subscribe({
              next: (response: HttpResponse<Aprobado>) => {
                this.generarReporteCobertura();
                Swal.fire('Aprobacion Exitosa!', '', 'success')
              },
              error: (err:any) => {
                console.log("Surgio un error inesperado verificar Consola")
              },
            })
      }
    })
  }

  generarReporteCobertura() {
    this.gridSolicitudVisualizacion.loading = true;
    this.integraService
      .postJsonResponse(`${constApiOperaciones.SolicitudOperacionesGenerarReporteSolicitudes}`, this.prepararFiltros())
        .subscribe({
          next: (response: HttpResponse<Oportunidad[]>) => {
            this.gridSolicitudVisualizacion.skip = 0;
            this.gridSolicitudVisualizacion.data = response.body;
            // this.kendoGridSolicitudVisualizacion.skip=0;            
            // this.kendoGridSolicitudVisualizacion.pageSize=15;
            let p :PageChangeEvent={
              skip: 0,
              take: 15
            } 
            this.kendoGridSolicitudVisualizacion.pageChange.emit(p)
                        
            this.gridSolicitudVisualizacion.loading = false;
          },
          error: (err:any) => {
            this.gridSolicitudVisualizacion.loading = false;
          },
        })
  }
}

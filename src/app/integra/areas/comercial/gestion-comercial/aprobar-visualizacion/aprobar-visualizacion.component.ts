import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiComercial, constApiOperaciones } from '@environments/constApi';
import { Aprobado, Asesores, Asesores_CentroCosto_Estado_Fase, CentroCosto, Estado, FaseOportunidad, Oportunidad } from '@integra/areas/operaciones/models/aprobacion-visualizacion-datos';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';
import { AgendaService } from '../../services/agenda/agenda.service';

@Component({
  selector: 'app-aprobar-visualizacion',
  templateUrl: './aprobar-visualizacion.component.html',
  styleUrls: ['./aprobar-visualizacion.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AprobarVisualizacionComponent implements OnInit {

  gridSolicitudVisualizacion:KendoGrid = new KendoGrid();

  constructor(
    private integraService: IntegraService,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) { }

  flagParaFiltro:number = 0;
  listaFaseOportunidad:FaseOportunidad[] = null;
  listaFaseOportunidadTemp:FaseOportunidad[] = null;

  listaAsesores:Asesores[] = null;
  listaAsesoresTemp:Asesores[] = null;

  listaCentroCostos:CentroCosto[] = null;
  listaCentroCostosTemp:CentroCosto[] = null;
  listaCentroCostoPorAsesor:CentroCosto[] = null;

  listaEstados:Estado[] = null;

  ngOnInit(): void {
    this.gridSolicitudVisualizacion.pageable = true;
    this.gridSolicitudVisualizacion.pageSize = 15;
    this.gridSolicitudVisualizacion.sortable = true;
    this.ready();
  }

  formFiltro: FormGroup = this.formBuilder.group({
    asesores: [],
    centroCosto: null,
    faseOportunidad: [],
  });

  idPersonalGlobal: number = 0

  ready() {
    this.idPersonalGlobal = this.userService.userData.idPersonal;

    this.integraService
      .getJsonResponse(`${constApiComercial.ReporteSeguimientoOportunidadesObtenerCombosSeguimiento}/${this.idPersonalGlobal}`)
        .subscribe({
          next: (response: HttpResponse<Asesores_CentroCosto_Estado_Fase>) => {
            this.listaFaseOportunidad = response.body.faseOportunidades;
            this.listaFaseOportunidadTemp = response.body.faseOportunidades;

            this.listaAsesores = response.body.asesores;
            this.listaAsesoresTemp = response.body.asesores;

            this.listaCentroCostos = response.body.centroCostos;
            this.listaCentroCostosTemp = response.body.centroCostos;

            this.listaEstados = response.body.estados;
          }
        })
  }

  filtrarFase(value:string) {
    this.listaFaseOportunidad = this.listaFaseOportunidadTemp.filter(
      (s:FaseOportunidad) => s.codigo.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );
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
      CentroCostos: (params.centroCosto != null) ? [params.centroCosto] : [],
      Asesores: (params.asesores != null) ? params.asesores : [],
      FasesOportunidad: (params.faseOportunidad != null) ? params.faseOportunidad : []
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
          IdOportunidad: dataItem.id,
          IdPersonalSolicitante: dataItem.idPersonalSolicitante,
          Usuario: this.userService.userData.userName,
          IdSolicitudVisualizacion: dataItem.idSolicitudVisualizacion
        }
        this.integraService
          .postJsonResponse(`${constApiOperaciones.SolicitudOperacionesAprobarSolicitudVisualizacion}`, objetoAprobacion)
            .subscribe({
              next: (response: HttpResponse<Aprobado>) => {
                console.log(response.body)
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
      .postJsonResponse(`${constApiComercial.ReporteSeguimientoOportunidadesGenerarReporteSolicitudesVisualizacion}`, this.prepararFiltros())
      .subscribe({
        next: (response: HttpResponse<Oportunidad[]>) => {
          console.log("grid",response.body)
          this.gridSolicitudVisualizacion.data = response.body;
          this.gridSolicitudVisualizacion.loading = false;
        },
        error: (err:any) => {
          this.gridSolicitudVisualizacion.loading = false;
        },
      })
  }
}

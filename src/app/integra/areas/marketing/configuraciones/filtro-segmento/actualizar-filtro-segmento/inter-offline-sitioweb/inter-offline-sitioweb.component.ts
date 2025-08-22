import { EstadoPago } from '@integra/models/filtro-segmento';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { MatDialog } from '@angular/material/dialog';
import {
  constApi,
  constApiComercial,
  constApiGlobal,
  constApiMarketing,
} from '@environments/constApi';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER, I } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-inter-offline-sitioweb',
  templateUrl: './inter-offline-sitioweb.component.html',
  styleUrls: ['./inter-offline-sitioweb.component.scss'],
})
export class InterOfflineSitiowebComponent implements OnInit, OnChanges {
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertaService: AlertaService,
    public dialog: MatDialog
  ) {}
  ngOnChanges(): void {
    if (this.datosActualizar != undefined) {

      this.datos = this.datosActualizar.considerarInteraccionSitioWeb

      if(this.datosActualizar.fechaInicioInteraccionSitioWeb != null){
        this.FechaInicioInteraccionSitioWeb =
        new Date(this.datosActualizar.fechaInicioInteraccionSitioWeb);
      }
      else{
        this.FechaInicioInteraccionSitioWeb = null
      }

      if(this.datosActualizar.fechaFinInteraccionSitioWeb != null){
        this.FechaFinInteraccionSitioWeb =
        new Date(this.datosActualizar.fechaFinInteraccionSitioWeb);
      }
      else{
        this.FechaFinInteraccionSitioWeb = null
      }

      this.IdOperadorComparacionTiempoVisualizacionTotalSitioWeb =
        this.datosActualizar.idOperadorComparacionTiempoVisualizacionTotalSitioWeb;
      this.TiempoVisualizacionTotalSitioWeb =
        this.datosActualizar.tiempoVisualizacionTotalSitioWeb;
      this.IdOperadorComparacionNroClickEnlaceTodoSitioWeb =
        this.datosActualizar.idOperadorComparacionNroClickEnlaceTodoSitioWeb;
      this.NroClickEnlaceTodoSitioWeb =
        this.datosActualizar.nroClickEnlaceTodoSitioWeb;
      this.IdOperadorComparacionTiempoVisualizacionTotalPaginaPrograma =
        this.datosActualizar.idOperadorComparacionTiempoVisualizacionTotalPaginaPrograma;
      this.TiempoVisualizacionTotalPaginaPrograma =
        this.datosActualizar.tiempoVisualizacionTotalPaginaPrograma;
      this.IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas =
        this.datosActualizar.idOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas;
      this.TiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas =
        this.datosActualizar.tiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas;
      this.IdOperadorComparacionNroClickEnlacePaginaPrograma =
        this.datosActualizar.idOperadorComparacionNroClickEnlacePaginaPrograma;
      this.NroClickEnlacePaginaPrograma =
        this.datosActualizar.nroClickEnlacePaginaPrograma;
      this.ConsiderarVisualizacionVideoVistaPreviaPaginaPrograma =
        this.datosActualizar.considerarVisualizacionVideoVistaPreviaPaginaPrograma;
      this.ConsiderarClickBotonMatricularmePaginaPrograma =
        this.datosActualizar.considerarClickBotonMatricularmePaginaPrograma;
      this.ConsiderarClickBotonVersionPruebaPaginaPrograma =
        this.datosActualizar.considerarClickBotonVersionPruebaPaginaPrograma; //
      this.IdOperadorComparacionTiempoVisualizacionTotalPaginaBscampus =
        this.datosActualizar.idOperadorComparacionTiempoVisualizacionTotalPaginaBscampus;
      this.TiempoVisualizacionTotalPaginaBscampus =
        this.datosActualizar.tiempoVisualizacionTotalPaginaBscampus;
      this.IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus =
        this.datosActualizar.idOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus;
      this.TiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus =
        this.datosActualizar.tiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus;
      this.IdOperadorComparacionNroVisitasDirectorioTagAreaSubArea =
        this.datosActualizar.idOperadorComparacionNroVisitasDirectorioTagAreaSubArea;
      this.NroVisitasDirectorioTagAreaSubArea =
        this.datosActualizar.nroVisitasDirectorioTagAreaSubArea;
      this.IdOperadorComparacionTiempoVisualizacionTotalDirectorioTagAreaSubArea =
        this.datosActualizar.idOperadorComparacionTiempoVisualizacionTotalDirectorioTagAreaSubArea;
      this.TiempoVisualizacionTotalDirectorioTagAreaSubArea =
        this.datosActualizar.tiempoVisualizacionTotalDirectorioTagAreaSubArea;
      this.IdOperadorComparacionNroClickEnlaceDirectorioTagAreaSubArea =
        this.datosActualizar.idOperadorComparacionNroClickEnlaceDirectorioTagAreaSubArea;
      this.NroClickEnlaceDirectorioTagAreaSubArea =
        this.datosActualizar.nroClickEnlaceDirectorioTagAreaSubArea;
      this.IdOperadorComparacionNroVisitasPaginaMisCursos =
        this.datosActualizar.idOperadorComparacionNroVisitasPaginaMisCursos;
      this.NroVisitasPaginaMisCursos =
        this.datosActualizar.nroVisitasPaginaMisCursos;
      this.IdOperadorComparacionTiempoVisualizacionTotalPaginaMisCursos =
        this.datosActualizar.idOperadorComparacionTiempoVisualizacionTotalPaginaMisCursos;
      this.TiempoVisualizacionTotalPaginaMisCursos =
        this.datosActualizar.tiempoVisualizacionTotalPaginaMisCursos;
      this.IdOperadorComparacionNroClickEnlacePaginaMisCursos =
        this.datosActualizar.idOperadorComparacionNroClickEnlacePaginaMisCursos;
      this.NroClickEnlacePaginaMisCursos =
        this.datosActualizar.nroClickEnlacePaginaMisCursos; //
      this.IdOperadorComparacionNroVisitaPaginaCursoDiplomado =
        this.datosActualizar.idOperadorComparacionNroVisitaPaginaCursoDiplomado;
      this.NroVisitaPaginaCursoDiplomado =
        this.datosActualizar.nroVisitaPaginaCursoDiplomado;
      this.IdOperadorComparacionTiempoVisualizacionTotalPaginaCursoDiplomado =
        this.datosActualizar.idOperadorComparacionTiempoVisualizacionTotalPaginaCursoDiplomado;
      this.TiempoVisualizacionTotalPaginaCursoDiplomado =
        this.datosActualizar.tiempoVisualizacionTotalPaginaCursoDiplomado;
      this.IdOperadorComparacionNroClicksEnlacePaginaCursoDiplomado =
        this.datosActualizar.idOperadorComparacionNroClicksEnlacePaginaCursoDiplomado;
      this.NroClicksEnlacePaginaCursoDiplomado =
        this.datosActualizar.nroClicksEnlacePaginaCursoDiplomado;
      this.ConsiderarClickFiltroPaginaCursoDiplomado =
        this.datosActualizar.considerarClickFiltroPaginaCursoDiplomado; //
    }
  }

  @Input() datosActualizar: any;

  ngOnInit(): void {
    this.obtenerOperador();

  }

  datos = false;
  loading: any;
  listaOperadores: any;
  FechaInicioInteraccionSitioWeb :any = null;
  FechaFinInteraccionSitioWeb : any = null;

  IdOperadorComparacionTiempoVisualizacionTotalSitioWeb : any = null;
  TiempoVisualizacionTotalSitioWeb : any = null;
  IdOperadorComparacionNroClickEnlaceTodoSitioWeb : any = null;
  NroClickEnlaceTodoSitioWeb : any = null;
  IdOperadorComparacionTiempoVisualizacionTotalPaginaPrograma : any = null;
  TiempoVisualizacionTotalPaginaPrograma : any = null;
  IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas : any = null;
  TiempoVisualizacionMaximaEnUnaPaginaWebPaginaProgramas : any = null;
  IdOperadorComparacionNroClickEnlacePaginaPrograma : any = null;
  NroClickEnlacePaginaPrograma : any = null;
  ConsiderarVisualizacionVideoVistaPreviaPaginaPrograma = false;
  ConsiderarClickBotonMatricularmePaginaPrograma = false;
  ConsiderarClickBotonVersionPruebaPaginaPrograma = false; //
  IdOperadorComparacionTiempoVisualizacionTotalPaginaBscampus : any = null;
  TiempoVisualizacionTotalPaginaBscampus : any = null;
  IdOperadorComparacionTiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus : any = null;
  TiempoVisualizacionMaximaEnUnaPaginaWebPaginaBscampus : any = null; //
  IdOperadorComparacionNroVisitasDirectorioTagAreaSubArea : any = null;
  NroVisitasDirectorioTagAreaSubArea : any = null;
  IdOperadorComparacionTiempoVisualizacionTotalDirectorioTagAreaSubArea : any = null;
  TiempoVisualizacionTotalDirectorioTagAreaSubArea : any = null;
  IdOperadorComparacionNroClickEnlaceDirectorioTagAreaSubArea : any = null;
  NroClickEnlaceDirectorioTagAreaSubArea : any = null; //
  IdOperadorComparacionNroVisitasPaginaMisCursos : any = null;
  NroVisitasPaginaMisCursos : any = null;
  IdOperadorComparacionTiempoVisualizacionTotalPaginaMisCursos : any = null;
  TiempoVisualizacionTotalPaginaMisCursos : any = null;
  IdOperadorComparacionNroClickEnlacePaginaMisCursos : any = null;
  NroClickEnlacePaginaMisCursos : any = null; //
  IdOperadorComparacionNroVisitaPaginaCursoDiplomado : any = null;
  NroVisitaPaginaCursoDiplomado : any = null;
  IdOperadorComparacionTiempoVisualizacionTotalPaginaCursoDiplomado : any = null;
  TiempoVisualizacionTotalPaginaCursoDiplomado : any = null;
  IdOperadorComparacionNroClicksEnlacePaginaCursoDiplomado : any = null;
  NroClicksEnlacePaginaCursoDiplomado : any = null;
  ConsiderarClickFiltroPaginaCursoDiplomado = false; //

  setAll(e: any) {
    this.datos = e;
  }

  //-------------------Funciones Obtener ---------------------//

  obtenerOperador() {
    this.loading = true;
    this.integraService
      .obtener(constApiMarketing.ObtenerOperadorCombo)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loading = false;
          this.listaOperadores = response.body;
        },
        error: (error) => {
          this.alertaService.mensajeError(error);
        },
        complete: () => {},
      });
  }
}

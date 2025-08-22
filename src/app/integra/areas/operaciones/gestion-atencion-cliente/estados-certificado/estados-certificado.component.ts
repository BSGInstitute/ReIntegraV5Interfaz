import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { constApiGlobal, constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { PGeneralCombo } from './models/pgeneral-combo';
import { AlertaService } from '@shared/services/alerta.service';
import {
  Combo,
  CombosConfiguracionPlantilla,
  PlantilaCertificadoConstancia,
  SubEstadoMatricula,
} from './models/combos-configuracion-plantilla';
import { ConfiguracionPlantilla, ConfiguracionPlantillaDetalle } from './models/configuracion-plantilla';

@Component({
  selector: 'app-estados-certificado',
  templateUrl: './estados-certificado.component.html',
  styleUrls: ['./estados-certificado.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EstadosCertificadoComponent implements OnInit {
  @ViewChild('modalConfiguracionPlantilla') modalConfiguracionPlantilla: any;
  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal,
    private alertaService: AlertaService
  ) {}

  gridConfiguracion = new KendoGrid<ConfiguracionPlantillaDetalle>();
  comboPlantillaConstancia: PlantilaCertificadoConstancia[] = [];
  comboModalidad: Combo[] = [];
  comboEstadoMatricula: Combo[] = [];
  comboOperadorComparacion: Combo[] = [];
  comboSubEstadoMatricula: SubEstadoMatricula[] = [];
  comboPais: Combo[] = [];
  comboPgeneral: PGeneralCombo[] = [];

  dataGrid: ConfiguracionPlantilla[];
  loading: boolean = false;

  virtual = {
    itemHeight: 28,
  };

  fcProgramaGeneral = new FormControl(null);

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };
  filterSettings2: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  ngOnInit(): void {
    this.obtenerComboPgeneral();
    this.obtenerCombosConfiguracionPlantillaAsync();
  }
  obtenerComboPgeneral() {
    this.integraService
      .getJsonResponse(constApiGlobal.ProgramaGeneralObtenerCombo)
      .subscribe({
        next: (response: HttpResponse<PGeneralCombo[]>) => {
          this.comboPgeneral = response.body;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }
  private obtenerCombosConfiguracionPlantillaAsync() {
    this.integraService
      .getJsonResponse(
        constApiPlanificacion.ProgramaGeneralObtenerCombosConfiguracionPlantillaAsync
      )
      .subscribe({
        next: (resp: HttpResponse<CombosConfiguracionPlantilla>) => {
          this.comboPlantillaConstancia =
            resp.body.plantilaCertificadoConstancia.filter(
              (x) => x.idPlantillaBase == 12
            );
          this.comboModalidad = resp.body.modalidadCurso;
          this.comboEstadoMatricula = resp.body.estadoMatricula;
          this.comboOperadorComparacion = resp.body.operadorComparacion;
          this.comboSubEstadoMatricula = resp.body.subEstadoMatricula;
          this.comboPais = resp.body.pais;
        },
        error: (error) => {
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  obtenerConfiguracionPlantillas() {
    this.loading = true;
    let idPgeneral = this.fcProgramaGeneral.value;
    this.integraService
      .getJsonResponse(
        `${constApiGlobal.ProgramaGeneralObtenerConfiguracionPlantillas}/${idPgeneral}`
      )
      .subscribe({
        next: (response: HttpResponse<ConfiguracionPlantilla[]>) => {
          this.dataGrid = response.body.filter((x) => x.idPlantillaBase == 12);
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          let mensaje = this.alertaService.getMessageErrorService(error);
          this.alertaService.notificationWarning(mensaje);
        },
      });
  }

  verConfiguracion(dataItem: ConfiguracionPlantilla) {
    this.gridConfiguracion.data = dataItem.detalle;
    this.modalService.open(this.modalConfiguracionPlantilla, {
      windowClass: 'my-custom-modal',
      size: 'xl',
    });
  }

  getNombreModalidad(idModalidad: number) {
    let item = this.comboModalidad.find((x) => x.id == idModalidad);
    if (item != null) return item.nombre;
    else return '<Sin Modalidad>';
  }
  getNombrePlantilla(idPlantilla: number) {
    let item = this.comboPlantillaConstancia.find((x) => x.id == idPlantilla);
    if (item != null) return item.nombre;
    else return '<Sin Plantilla>';
  }
  getNombreEstadoMatricula(idEstadoMatricula: number) {
    let item = this.comboEstadoMatricula.find((x) => x.id == idEstadoMatricula);
    if (item != null) return item.nombre;
    else return '<Sin Estado Matricula>';
  }
  getNombreSubEstadoMatricula(idSubEstadoMatricula: number) {
    let item = this.comboSubEstadoMatricula.find((x) => x.id == idSubEstadoMatricula);
    if (item != null) return item.nombre;
    else return '<Sin SubEstado Matricula>';
  }
  getNombreOperadorComparacion(idOperadorComparacion: number) {
    let item = this.comboOperadorComparacion.find((x) => x.id == idOperadorComparacion);
    if (item != null) return item.nombre;
    else return '<Sin Operador Comparación>';
  }
}

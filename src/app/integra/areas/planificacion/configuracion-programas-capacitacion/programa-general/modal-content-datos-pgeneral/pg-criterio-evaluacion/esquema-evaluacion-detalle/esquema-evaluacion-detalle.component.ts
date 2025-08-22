import { HttpResponse } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  DetalleEsquemaAsignado,
  EsquemaEvaluacionDetalleCompuesto,
  EsquemaEvaluacionPgeneralDetalleCompuesto,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

interface FormGrid {
  nombre: string;
  file: File;
}
/**
 * @module PlanificacionModule
 * @description Componente Esquema Evaluacion Detalle
 * @author Flavio R. Mamani Fabian
 * @version 1.1.0
 * @history
 * * 28/02/2024 Implementacion de componente
 **/
@Component({
  selector: 'app-esquema-evaluacion-detalle',
  templateUrl: './esquema-evaluacion-detalle.component.html',
  styleUrls: ['./esquema-evaluacion-detalle.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EsquemaEvaluacionDetalleComponent implements OnInit {
  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  @Input() pgeneralService: PgeneralService;
  @Input() detalleEsquemaAsignado: DetalleEsquemaAsignado;
  @Input() idsModalidades: number[];

  @Output() getEsquemaEvaluacionDetalle = new EventEmitter<
    EsquemaEvaluacionPgeneralDetalleCompuesto[]
  >();

  comboDocentes: IComboBase1[] = [];
  fcDocente: FormControl = new FormControl(null);
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  gridCriterioEvaluacionDetalle = new KendoGrid();
  ngOnInit(): void {
    this.comboDocentes = this.pgeneralService.comboProveedor;
    if (
      this.detalleEsquemaAsignado.detalle != null &&
      this.detalleEsquemaAsignado.detalle.length > 0
    ) {
      this.fcDocente.setValue(
        this.detalleEsquemaAsignado.detalle[0].idProveedor
      );
    }
    this.configuracioGrid();
    this.pgeneralService.obtenerDetalleEsquemaAsignado$.subscribe(() => {
      let data = this.gridCriterioEvaluacionDetalle.data.map(
        (x: EsquemaEvaluacionPgeneralDetalleCompuesto) => {
          let item: EsquemaEvaluacionPgeneralDetalleCompuesto = {
            id: x.id,
            idCriterioEvaluacion: x.idCriterioEvaluacion,
            nombre: x.nombre,
            urlArchivoInstrucciones: x.urlArchivoInstrucciones,
            idProveedor: this.showDocentes ? this.fcDocente.value : undefined,
          };
          return item;
        }
      );
      this.getEsquemaEvaluacionDetalle.emit(data);
    });
  }
  get showDocentes(): boolean {
    if (this.idsModalidades != null && this.idsModalidades.length > 0) {
      return this.idsModalidades.includes(1);
    }
    return false;
  }
  configuracioGrid() {
    this.gridCriterioEvaluacionDetalle.data =
      this.detalleEsquemaAsignado.detalle ?? [];
    this.gridCriterioEvaluacionDetalle.formGroup = this._formBuilder.group({
      nombre: null,
      file: null,
    });
    this.gridCriterioEvaluacionDetalle.removeEvent$.subscribe((resp) => {
      this.gridCriterioEvaluacionDetalle.data.splice(resp.index, 1);
      this.gridCriterioEvaluacionDetalle.data = [
        ...this.gridCriterioEvaluacionDetalle.data,
      ];
    });
    this.gridCriterioEvaluacionDetalle.updateEvent$.subscribe((resp) => {
      this.guardarCriterioEvaluacionDetalle(resp.dataForm, resp.dataItem);
    });
  }
  private guardarCriterioEvaluacionDetalle(
    dataForm: FormGrid,
    dataItem: EsquemaEvaluacionPgeneralDetalleCompuesto
  ) {
    this.gridCriterioEvaluacionDetalle.loading = true;
    dataItem.nombre = dataForm.nombre;
    let formData = new FormData();
    if (dataForm.file != null) {
      formData.append('archivos', dataForm.file);
    }
    this._integraService
      .insertarFormData(
        constApiPlanificacion.EsquemaEvaluacionSubirArchivo,
        formData
      )
      .subscribe({
        next: (resp: HttpResponse<string>) => {
          dataItem.urlArchivoInstrucciones = resp.body;
          this.gridCriterioEvaluacionDetalle.loading = false;
        },
        error: (error: any) => {
          this.gridCriterioEvaluacionDetalle.loading = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: 'Error subir el archivo',
            text: mensaje,
          });
        },
      });
  }
  generarItemDetalle() {
    let contador = this.gridCriterioEvaluacionDetalle.data.length + 1;
    let item: EsquemaEvaluacionPgeneralDetalleCompuesto = {
      id: 0,
      idCriterioEvaluacion: this.detalleEsquemaAsignado.idCriterioEvaluacion,
      nombreCriterioEvaluacion:
        this.detalleEsquemaAsignado.nombreCriterioEvaluacion,
      nombre: `${this.detalleEsquemaAsignado.nombreCriterioEvaluacion} ${contador}`,
      urlArchivoInstrucciones: null,
      idProveedor: this.fcDocente.value,
    };
    this.gridCriterioEvaluacionDetalle.data = [
      ...this.gridCriterioEvaluacionDetalle.data,
      item,
    ];
  }
  onFileSelected(event: any, formGroup: FormGroup) {
    const file: File = event.target.files[0];
    if (file) {
      formGroup.get('file').setValue(file);
    } else {
      formGroup.get('file').setValue(null);
    }
  }
}

import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiPlanificacion } from '@environments/constApi';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import {
  Pgeneral,PEspecificoByPGeneral
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { TestimonioDTO, TestimonioGuardar } from '@planificacion/models/interfaces/testimonio';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
interface FormularioComentario {
  id?: number;
  idRespuetas: number[];
  comentarioPw: string;
}
interface IFormFiltro {
  idPEspecifico: number;
  idModalidad?: number;
}
@Component({
  selector: 'app-pg-testimonio',
  templateUrl: './pg-testimonio.component.html',
  styleUrls: ['./pg-testimonio.component.scss']
})
export class PgTestimonioComponent implements OnInit {
  combosPEspecifico: PEspecificoByPGeneral[] = [];
  formFiltro: FormGroup = this._formBuilder.group({
    idPEspecifico: [null, Validators.required],
    idModalidad: [null, Validators.required]
  });
  gridTestimonio = new KendoGrid();
  isNew: boolean = false;
  dataVersion: IComboBase1[] = [];
  dataItemTemp: TestimonioDTO;
  modalRef: NgbModalRef = null;
  enProcesoSolicitud: boolean = false;
  idPGeneral: Pgeneral;
  DataModalidad = [
    {
      id: 1,
      nombre: 'Sincronica',
    },
    {
      id: 2,
      nombre: 'Asincronica',
    },
  ];

  dataRespuestasAsociadas: IComboBase1[] = [];
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  formComentarioTestimonio: FormGroup = this._formBuilder.group({
    idRespuesta: [null, Validators.required],
    testimonio: [null],
    visiblePW: [null],
  });
  @Input() pgeneralService: PgeneralService;
  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) { }

  ngOnInit(): void {
    this.idPGeneral = this.pgeneralService.dataItemPgeneral;
    this.obtenerPEspecificoByPGeneral();
  }
 

  /* ---------------- Abrir Modal--------------------- */

  abrirModalTestimonio(context: any, dataItem?: TestimonioDTO) {
    this.formComentarioTestimonio.reset();
    this.enProcesoSolicitud = false;
    this.ObtenerRespuestasSeleccionadas(dataItem.idRespuestasAsociada, dataItem.versionEncuesta);
    this.dataItemTemp = dataItem;

    this.modalRef = this._modalService.open(context, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
    });
  }

  obtenerPEspecificoByPGeneral() {
    this._integraService
      .getJsonResponse(
        constApiPlanificacion.PEspecificoObtenerPEspecificoByPGeneral +
        '/' +
        this.idPGeneral.id
      )
      .subscribe({
        next: (resp: HttpResponse<PEspecificoByPGeneral[]>) => {
          this.combosPEspecifico = resp.body;
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }
  get FiltroForm(): IFormFiltro {
    return this.formFiltro.getRawValue() as IFormFiltro;
  }
  generarReporte() {
    if (this.formFiltro.valid) {
      this.gridTestimonio.loading = true;
      const filtro = {
        idPEspecifico: this.FiltroForm.idPEspecifico,
        modalidad: this.FiltroForm.idModalidad,
      };
        this._integraService
          .postJsonResponse(
            constApiPlanificacion.ReporteEncuestaGenerarReporteTestimonioPorModalidad,
            JSON.stringify(filtro)
          )
          .subscribe({
            next: (resp: any) => {
              console.log('ResultadoReporte', resp);
              this.gridTestimonio.data = resp.body;
              this.gridTestimonio.loading = false;
              if (resp.body.length) {
                this._alertaService.notificationSuccessBotom(
                  'Reporte generado exitosamente'
                );
              } else {
                this._alertaService.notificationSuccessBotom('Reporte sin datos.');
              }
            },
            error: (error) => {
              this.gridTestimonio.loading = false;
              let mensaje = this._alertaService.getMessageErrorService(error);
              if (mensaje) this._alertaService.notificationWarning(mensaje);
            },
          });
    }
    else {
      Swal.fire({
        icon: 'warning',
        title: 'Campos Incompletos',
        text: 'Debe completar todos los campos obligatorios antes de generar el reporte.',
        confirmButtonText: 'Entendido'
      });
      return;
    }
  }

  
  ObtenerRespuestasSeleccionadas(idRespuestasAsociada: string, version: number) {
    let modalidad;;
    if (version == 2 || version == 3 || version == 7 || version == 8) {
      modalidad = 1;
    }
    else {
      if (version == 109 || version == 105) {
        modalidad = 2;
      }
    }
    const filtro = {
      IdRespuestasAsociada: idRespuestasAsociada,
      Version: modalidad,
    };
    this._integraService
      .postJsonResponse(
        constApiPlanificacion.ReporteEncuestaObtenerRespuestaEncuestaCombo,
        JSON.stringify(filtro)
      )
      .subscribe({
        next: (resp: HttpResponse<IComboBase1[]>) => {
          this.dataRespuestasAsociadas = resp.body;
          this.asignarValoresToForm(this.dataItemTemp);
        },
        error: (error) => {
          console.log('aqui entro error');
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
    return true;
  }

  get testimonioForm(): TestimonioGuardar {
    return this.formComentarioTestimonio.getRawValue() as TestimonioGuardar;
  }
  procesarTestimonios(): TestimonioGuardar {
    let modalidad;
    if (this.dataItemTemp.versionEncuesta == 2 || this.dataItemTemp.versionEncuesta == 3 || this.dataItemTemp.versionEncuesta == 7 || this.dataItemTemp.versionEncuesta == 8) {
      modalidad = 1;
    }
    else {
      if (this.dataItemTemp.versionEncuesta == 109 || this.dataItemTemp.versionEncuesta == 105) {
        modalidad = 2;
      }
    }
    let testimonio: TestimonioGuardar = {
      idRespuesta: this.testimonioForm.idRespuesta,
      testimonio: this.testimonioForm.testimonio,
      visiblePW: this.testimonioForm.visiblePW ? 1 : 0,
      modalidad: modalidad,
      listaRespuestas: this.dataRespuestasAsociadas,
    };
    return testimonio;
  }


  Guardar() {
    console.log(this.formComentarioTestimonio.value);
    if (this.formComentarioTestimonio.valid) {
      let jsonEnvio = this.procesarTestimonios();
      this.gridTestimonio.loading = true;

      this.enProcesoSolicitud = true;
      this._integraService
        .postJsonResponse(
          constApiPlanificacion.ReporteEncuestaGuardarTestimonio,
          JSON.stringify(jsonEnvio)
        )
        .subscribe({
          next: (resp: HttpResponse<TestimonioGuardar>) => {
            this.gridTestimonio.loading = false;

            this.enProcesoSolicitud = false;
            this.generarReporte();
            this.modalRef.close();
            this._alertaService.mensajeExitoso();
          },
          error: (error) => {
            this.gridTestimonio.loading = false;
            this.enProcesoSolicitud = false;
            this._alertaService.notificationWarning(error.message);
            this._alertaService.swalFireOptions({
              icon: 'error',
              text: 'No se pudo guardar el Registro',
            });

          },
        });
    } else {
      this.formComentarioTestimonio.markAllAsTouched();
      this.gridTestimonio.loading = false;
      this.enProcesoSolicitud = false;
      this._alertaService.mensajeIcon(
        'Complete por favor los campos obligatorios!'
      );
    }
  }

  asignarValoresToForm(dataItem: TestimonioDTO) {
    // Convertir el string en un array de números
    let idRespuestasArray = dataItem.idRespuestasTestimonio
      .split(',')
      .map(id => parseInt(id.trim(), 10))

      .filter(id => !isNaN(id));

    let respuestasFiltradas = this.dataRespuestasAsociadas.filter(item =>
      idRespuestasArray.includes(item.id)
    );

    // Asignar valores al formulario
    this.formComentarioTestimonio.get('idRespuesta').setValue(respuestasFiltradas);
    this.formComentarioTestimonio.get('testimonio').setValue(dataItem.testimonio);
    this.formComentarioTestimonio.get('visiblePW').setValue(dataItem.visiblePW);

  }


}

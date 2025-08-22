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
  PEspecificoByPGeneral,
  Pgeneral,
} from '@planificacion/models/interfaces/pgeneral/pgeneral';
import { envioJsonVisible, ValoracionesDTO } from '@planificacion/models/interfaces/valoracion';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { IComboBase1 } from '@shared/models/interfaces/iglobal';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';

interface IFormFiltro {
  idPEspecifico: number;
}
@Component({
  selector: 'app-pg-valoraciones',
  templateUrl: './pg-valoraciones.component.html',
  styleUrls: ['./pg-valoraciones.component.scss'],
})
export class PgValoracionesComponent implements OnInit {
  @Input() pgeneralService: PgeneralService;
  constructor(
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal,
    private _integraService: IntegraService,
    private _alertaService: AlertaService
  ) {}

  combosPEspecifico: PEspecificoByPGeneral[] = [];
  formFiltro: FormGroup = this._formBuilder.group({
    idPEspecifico: null,
  });
  isNew: boolean = false;
  gridValoracion = new KendoGrid();
  modalRef: NgbModalRef = null;
  enProcesoSolicitud: boolean = false;
  idPGeneral: Pgeneral;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  ngOnInit(): void {
    this.idPGeneral = this.pgeneralService.dataItemPgeneral;
    this.generarReporte();
    this.obtenerPEspecificoByPGeneral();
   
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
      this.gridValoracion.loading = true;
      const filtro = {
        idPEspecifico: this.FiltroForm.idPEspecifico,
        idPGeneral: this.idPGeneral.id
      };
      console.log('Filtro: ', filtro);

      this._integraService
        .postJsonResponse(
          constApiPlanificacion.ReporteEncuestaGenerarReporteValoracionTotal,
          JSON.stringify(filtro)
        )
        .subscribe({
          next: (resp: HttpResponse<ValoracionesDTO[]>) => {
            this.gridValoracion.data = resp.body;
            this.gridValoracion.loading = false;
            if (resp.body.length) {
              this._alertaService.notificationSuccessBotom(
                'Reporte generado exitosamente'
              );
            } else {
              this._alertaService.notificationSuccessBotom(
                'Reporte sin datos.'
              );
            }
          },
          error: (error) => {
            this.gridValoracion.loading = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            if (mensaje) this._alertaService.notificationWarning(mensaje);
          },
        });
    }
  }

  toggleEstado(dataItem: ValoracionesDTO, nuevoEstado: boolean): void {
    console.log("DataItem : ", dataItem)
    dataItem.visiblePw = nuevoEstado;

    let idRespuestas: number[] = [];
    const convertirCSVaArray = (csv: string): number[] =>
      csv.split(',').map(id => parseInt(id, 10));

    if (dataItem.idsPromedio1) {
      idRespuestas = idRespuestas.concat(convertirCSVaArray(dataItem.idsPromedio1));
    }
    if (dataItem.idsPromedio2) {
      idRespuestas = idRespuestas.concat(convertirCSVaArray(dataItem.idsPromedio2));
    }
    if (dataItem.idsPromedio3) {
      idRespuestas = idRespuestas.concat(convertirCSVaArray(dataItem.idsPromedio3));
    }
    if (dataItem.idsPromedio4) {
      idRespuestas = idRespuestas.concat(convertirCSVaArray(dataItem.idsPromedio4));
    }
    if (dataItem.idsPromedio5) {
      idRespuestas = idRespuestas.concat(convertirCSVaArray(dataItem.idsPromedio5));
    }
    
    let valoraciones: envioJsonVisible = {
      idRespuestas: idRespuestas,
      modalidad: dataItem.modalidad,
      visiblePw: dataItem.visiblePw ? 1 : 0,
    };

    this.Actualizar(valoraciones)
    console.log("valoraciones que enviara a servicios :", valoraciones);
  }

  Actualizar(valoraciones: envioJsonVisible) {
    this.gridValoracion.loading = true;
    this.enProcesoSolicitud = true;
    this._integraService
      .putJsonResponse(
        constApiPlanificacion.ReporteEncuestaActualizarValoracionVisiblePw,
        JSON.stringify(valoraciones)
      )
      .subscribe({
        next: (resp: HttpResponse<boolean>) => {
          if (resp) {
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 500,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });

            let mensaje =
              'Se actualizo el registro correctamente'
            Toast.fire({
              icon: 'success',
              title: mensaje,
            });
            this.gridValoracion.loading = false;
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getMessageErrorService(error);
          this.gridValoracion.loading = false;
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: 'Error en la solicitud',
            text: mensaje,
          });
        },
      });

  }
}

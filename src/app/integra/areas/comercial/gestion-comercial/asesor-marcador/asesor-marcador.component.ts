import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';

import { AsesorMarcado,NombresPersonal } from '@integra/areas/comercial/models/interfaces/asesormarcador';
import Swal from 'sweetalert2';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { constApiComercial,constApiGlobal } from '@environments/constApi';
@Component({
  selector: 'app-asesor-marcador',
  templateUrl: './asesor-marcador.component.html',
  styleUrls: ['./asesor-marcador.component.scss'],
})
export class AsesorMarcadorComponent implements OnInit {
  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private _modalService: NgbModal
  ) {}

  enProcesoSolicitud: boolean = false;
  modalRef: NgbModalRef = null;
  isNew: boolean = false;
  gridAsesorMarcado: KendoGrid = new KendoGrid();
  DataPersonal:NombresPersonal[];
  pageSizes: (number | PageSizeItem)[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];
  ngOnInit(): void {
    this.obtener();
    this.obtenerNombrePersonal();
  }
 
  toggleEstado(dataItem: any, nuevoEstado: boolean): void {
    // Actualizar el valor de marcadorActivo
    dataItem.marcadorActivo = nuevoEstado;
    this.actualizarCriterioObservacionMatricula(dataItem);
    // Lógica adicional (puedes enviar el nuevo estado al backend si es necesario)
    console.log(
      `Estado del marcador actualizado: ${dataItem.marcadorActivo ? 'Activo' : 'Inactivo'}`
    );
  }
  obtener() {
      this.gridAsesorMarcado.loading = true;
      this._integraService
        .getJsonResponse(constApiComercial.AsesorMarcadoObtener)
        .subscribe({
          next: (resp: HttpResponse<AsesorMarcado[]>) => {
            this.gridAsesorMarcado.data = resp.body;
            this.gridAsesorMarcado.loading = false;
          },
          error: (error) => {
            this.gridAsesorMarcado.loading = false;
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }


    obtenerNombrePersonal()
    {
      this.gridAsesorMarcado.loading = true;
      this._integraService
        .getJsonResponse(constApiGlobal.PersonalObtenerCombo)
        .subscribe({
          next: (resp: HttpResponse<NombresPersonal[]>) => {
            this.DataPersonal =  resp.body || [];  
          },
          error: (error) => {
            let mensaje = this._alertaService.getMessageErrorService(error);
            this._alertaService.notificationWarning(mensaje);
          },
        });
    }

    obtenerNombrePorId(id: number): string {
      if (!this.DataPersonal || this.DataPersonal.length === 0) {
        return 'Cargando...';
      }
  
      // Buscar el nombre en la lista
      const persona = this.DataPersonal.find((p) => p.id === id);
      
      return persona ? persona.nombres : 'Desconocido';
    }

    eliminar(id: number) {
      // Usar SweetAlert para mostrar un mensaje de confirmación
      this.enProcesoSolicitud = true;
      Swal.fire({
        title: '¿Estás seguro de eliminar el Registro?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          let index = this.gridAsesorMarcado.data.findIndex(
            (x) => x.id === id
          );
          if (index != -1) {
          }
          this.gridAsesorMarcado.loading = true;
          this._integraService
            .deleteJsonResponse(
              `${constApiComercial.AsesorMarcadoEliminar}/${id}`
            )
            .subscribe({
              next: (response: HttpResponse<boolean>) => {
                this.gridAsesorMarcado.loading = false;
                if (response.body === true) {
                  this.gridAsesorMarcado.data.splice(index, 1);
                  this.gridAsesorMarcado.loadView();
                  this._alertaService.mensajeIcon(
                    '¡Eliminado!',
                    'El registro ha sido eliminado.',
                    'success'
                  );
                  this.obtener();
                  this.enProcesoSolicitud = false;
                } else {
                  this._alertaService.mensajeIcon(
                    'Error!',
                    'Ocurrió un problema al eliminar.',
                    'warning'
                  );
                }
              },
              error: (error) => {
                console.log(error);
                this.gridAsesorMarcado.loading = false;
                let mensaje = this._alertaService.getMessageErrorService(error);
                this._alertaService.notificationWarning(mensaje);
              },
            });
        }
      });
    }
    actualizarCriterioObservacionMatricula(
        dataItem: AsesorMarcado
      ) {
        this.gridAsesorMarcado.loading = true;
        let valorActual: boolean;
        let endpoint: string;
        let jsonEnvio: {
          marcadorActivo: boolean;
          id:number;
          idPersonal:number;
        } = {
          marcadorActivo: dataItem.marcadorActivo,
          id: dataItem.id,
          idPersonal: dataItem.idPersonal,
        };
          valorActual = dataItem.marcadorActivo;
          endpoint =
            constApiComercial.AsesorMarcadoActualizar;
          jsonEnvio;
        
        
            this._integraService.putJsonResponse(endpoint, jsonEnvio).subscribe({
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
                  this.gridAsesorMarcado.loading = false;
                }
              },
              error: (error) => {
                let mensaje = this._alertaService.getMessageErrorService(error);
                this.gridAsesorMarcado.loading = false;
                this._alertaService.swalFireOptions({
                  icon: 'error',
                  title: 'Error en la solicitud',
                  text: mensaje,
                });
              },
            });
        
      }
}

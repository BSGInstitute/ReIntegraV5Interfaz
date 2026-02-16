import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CrearEditarCampaniaComponent } from './crear-editar-campania/crear-editar-campania.component';
import { constApiMarketing } from '@environments/constApi';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { CampaniaRemarketingGeneral } from '@marketing/models/interfaces/campania-remarketing-general';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-campania-remarketing-general',
  templateUrl: './campania-remarketing-general.component.html',
  styleUrls: ['./campania-remarketing-general.component.scss'],
})
export class CampaniaRemarketingGeneralComponent implements OnInit {
  listadoRemarketingGeneral: CampaniaRemarketingGeneral[] = [];
  isLoading: boolean = true;

  selectedCampanias: number[] = [];
  showRendimientoModal = false;

  showDetalleModal = false;
  detalleCampaniaId: number | null = null;
  detallecampaniaIdLlamadaIA: string | null = null;

  constructor(
    private integraService: IntegraService,
    private _alertaService: AlertaService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ObtenerListadoRemarketingGeneral();
  }

  ObtenerListadoRemarketingGeneral() {
    this.isLoading = true;
    this.integraService
      .getJsonResponse(`${constApiMarketing.ObtenerListadoRemarketingGeneral}`)
      .subscribe({
        next: (data: any) => {
          this.listadoRemarketingGeneral =
            data.body as CampaniaRemarketingGeneral[];
          this.isLoading = false;
          this.selectedCampanias = [];
        },
        error: (err) => {
          console.error('Error fetching :', err);
          this._alertaService.notificationError('Error al obtener datos');
          this.isLoading = false;
        },
      });
    // Paginacion
  }

  CrearNuevaCampania() {
    const dialogRef = this.dialog.open(CrearEditarCampaniaComponent, {
      width: '70vw',
      data: {
        modo: 'crear',
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.ObtenerListadoRemarketingGeneral();
      }
    });
  }

  ActualizarCampania(id: number) {
    const dialogRef = this.dialog.open(CrearEditarCampaniaComponent, {
      width: '70vw',
      data: {
        modo: 'editar',
        id,
      },
      disableClose: true,
    });

     dialogRef.afterClosed().subscribe((result) => {
      if (result === 'refresh') {
        this.ObtenerListadoRemarketingGeneral();
      }
    });
  }

  VerRendimiento() {
    this.showRendimientoModal = true;
  }
  cerrarRendimientoModal() {
    this.showRendimientoModal = false;
  }

  VerDetalleCampania(id: number, identificadorLlamadaIA: string) {
    this.showDetalleModal = true;
    this.detalleCampaniaId = id;
    this.detallecampaniaIdLlamadaIA = identificadorLlamadaIA;

  }
  cerrarDetalleModal() {
    this.showDetalleModal = false;
    this.detalleCampaniaId = null;
    this.detallecampaniaIdLlamadaIA = null;
  }

  EliminarCampania(id: number) {
    Swal.fire({
      title: '¿Desea eliminar esta campaña?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true
        this.integraService
          .postJsonResponse(
            `${constApiMarketing.EliminarCampaniaRemarketing}`,
            id
          )
          .subscribe({
            next: (data: any) => {
              this._alertaService.mensajeIcon(
                '¡Eliminado!',
                'El registro ha sido eliminado.',
                'success'
              );
              this.ObtenerListadoRemarketingGeneral();
            },
            error: (err) => {
              console.error('Error fetching :', err);
              this._alertaService.notificationError(
                'Error al eliminar campaña'
              );
              this.isLoading = false;
            },
          });
      }
    });
  }

  toggleCampania(id: number, checked: boolean) {
    if (checked) {
      if (!this.selectedCampanias.includes(id)) {
        this.selectedCampanias.push(id);
      }
    } else {
      this.selectedCampanias = this.selectedCampanias.filter((x) => x !== id);
    }
  }

  isAllSelected(): boolean {
    return (
      this.listadoRemarketingGeneral.length > 0 &&
      this.selectedCampanias.length === this.listadoRemarketingGeneral.length
    );
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selectedCampanias = [];
    } else {
      this.selectedCampanias = this.listadoRemarketingGeneral.map((x) => x.idRemarketingCampaniaGeneral);
    }
  }
}

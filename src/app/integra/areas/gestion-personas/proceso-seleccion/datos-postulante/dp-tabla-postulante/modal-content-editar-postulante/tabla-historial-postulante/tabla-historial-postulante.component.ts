import { ComboPostulante } from './../../../../../models/DatosPostulante';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { constApiGestionPersonal } from '@environments/constApi';
import { HistorialPostulante } from '@gestionPersonas/models/DatosPostulante';
import { HttpResponse } from '@angular/common/http';
import { IntegraService } from '@shared/services/integra.service';
import { AlertaService } from '@shared/services/alerta.service';
import { Subscription } from 'rxjs';
import { KendoGrid } from '@shared/models/kendo-grid';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';

@Component({
  selector: 'app-tabla-historial-postulante',
  templateUrl: './tabla-historial-postulante.component.html',
  styleUrls: ['./tabla-historial-postulante.component.scss'],
})
export class TablaHistorialPostulanteComponent implements OnInit {
  @Input() idPostulante!: number;
  @Input() clave!: string;
  DataHistorialPostulante: HistorialPostulante[];
  ComboPostulante: ComboPostulante;

  gridHistorialPostulante = new KendoGrid<HistorialPostulante>();

  private _subscriptions$ = new Subscription();

  constructor(
    private _integraService: IntegraService,
    private _alertaService: AlertaService,
    private _datosPostulanteService: DatosDelPostulanteService,
    public cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.traerComboPostulante();
    this.obtenerHistorial(this.idPostulante, this.clave);
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  llenarDatosCorrectos(valor: string, clave: string) {
    //const valor = data.clave;
    const esNumero = !isNaN(Number(valor));
    if (!esNumero) {
      return valor;
    }

    if (valor === null) {
      this.gridHistorialPostulante.data = [];
      this.cdr.detectChanges();
      return null;
    }

    switch (clave) {
      case 'IdPais':
        const pais = this.ComboPostulante?.pais?.find(
          (response) => response.id === Number.parseInt(valor)
        );
        return pais.nombre;

      case 'IdCiudad':
        const ciudad = this.ComboPostulante?.ciudad?.find(
          (response) => response.id === Number.parseInt(valor)
        );
        return ciudad.nombre;

      case 'IdSexo':
        const sexo = this.ComboPostulante?.sexo?.find(
          (response) => response.id === Number.parseInt(valor)
        );

        if (sexo) {
          return sexo.nombre;
        } else {
          this.gridHistorialPostulante.data = [];
          this.cdr.detectChanges();
          return null;
        }

      default:
        return valor;
    }
  }

  // const ciudad = this.comboPostulante?.ciudad?.find(
  //   (element) => element.id === id
  // );

  traerComboPostulante() {
    this._datosPostulanteService.getComboPostulante().subscribe({
      next: (data) => {
        this.ComboPostulante = data;
      },
    });
  }

  obtenerHistorial(idPostulante: number, clave: string) {
    this.gridHistorialPostulante.loading = true;
    const sub$ = this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.ObtenerHistorialPostulante}/${idPostulante}/${clave}`
      )
      .subscribe({
        next: (response: HttpResponse<HistorialPostulante[]>) => {
          this.gridHistorialPostulante.data = response.body;
          this.gridHistorialPostulante.loading = false;
        },
        error: (error: any) => {
          this.gridHistorialPostulante.loading = false;
          let mensaje = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener los registros!',
            text: `${mensaje.titulo}: ${mensaje.mensaje}`,
          });
        },
      });
    this._subscriptions$.add(sub$);
  }
}

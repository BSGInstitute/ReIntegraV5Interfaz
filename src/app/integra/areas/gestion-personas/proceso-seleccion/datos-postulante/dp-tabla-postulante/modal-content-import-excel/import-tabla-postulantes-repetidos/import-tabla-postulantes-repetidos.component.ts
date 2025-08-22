import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ComboPostulante, ListaPostulante } from '@gestionPersonas/models/DatosPostulante';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { AlertaService } from '@shared/services/alerta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-import-tabla-postulantes-repetidos',
  templateUrl: './import-tabla-postulantes-repetidos.component.html',
  styleUrls: ['./import-tabla-postulantes-repetidos.component.scss']
})
export class ImportTablaPostulantesRepetidosComponent implements OnInit {

  @Input() datosPostulanteService: DatosDelPostulanteService;

  datosPostulanteImportadoRepetido: ListaPostulante[];
  comboPostulante: ComboPostulante;
  nregistrosRepetido: number = 0;

  public gridView: any[] = [];
  public pageSize = 5;
  public buttonCount = 2;
  public sizes = [10, 20, 50];

  private _subscriptions$ = new Subscription();

  public colorColumnasEstaticas: { [Key: string]: string } = {
    'border-left-width': '0',
    'background-color': '#1274AC',
    'text-align': 'center',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private _alertaService: AlertaService
  ) {}

  traerComboPostulante() {
    const datosCombo = this.datosPostulanteService.getComboPostulante().subscribe({
      next: (data) => {
        this.comboPostulante = data;
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
    this._subscriptions$.add(datosCombo)
  }

  //Función para llenar la columna de Tipo Doc...
  obtenerTipoDocumentoPorID(id: number) {
    //if (!this.comboPostulante) return 'Cargando...';
    const tipoDoc = this.comboPostulante?.documento?.find(
      (element) => element.id === id
    );
    return tipoDoc ? tipoDoc.nombre : 'Seleccion Tipo Documento';
  }

  //Función para llenar la columna de Pais...
  obtenerNombrePaisPorId(id: number) {
    const pais = this.comboPostulante?.pais?.find(
      (element) => element.id === id
    );
    return pais ? pais.nombre : 'Seleccione Pais';
  }

  //Función para llenar la columna de Ciudad...
  obtenerNombreCiudadPorId(id: number) {
    const ciudad = this.comboPostulante?.ciudad?.find(
      (element) => element.id === id
    );
    return ciudad ? ciudad.nombre : 'Seleccione Ciudad';
  }

  //Función para llenar la columna de Estado Etapa Proceso Seleccion...
  obtenerNombreEstadoEtapaProcesoSeleccionPorId(id: number) {
    const estadoEtapaPS = this.comboPostulante?.listaEstadoEtapas?.find(
      (element) => element.id === id
    );
    return estadoEtapaPS ? estadoEtapaPS.nombre : 'Seleccione Estado Etapa';
  }

  //Función para llenar la columna de Estado Etapa Proceso Seleccion...
  // obtenerNombreFactorDesaprobatorioPorId(id: number) {
  //   const estadoEtapaPS =
  //     this.comboPostulante?.listaRespuestaDesaprobatoria?.find(
  //       (element) => element.idRespuestaDesaprovatoria === id
  //     );
  //   return estadoEtapaPS
  //     ? estadoEtapaPS.nombre
  //     : 'Seleccione Factor Desaprobatorio';
  // }

  //Función para llenar la columna de Potencial Prceos Seleccion...
  obtenerNombrePotencialProcesoSeleccionPorId(id: number) {
    const PotencialPS = this.comboPostulante?.listaNivelPotencial?.find(
      (element) => element.id === id
    );
    return PotencialPS ? PotencialPS.nombre : 'Seleccione Potencial';
  }

  traerDatosImportacionNuevosPostulantes() {
    const datosPostulante = this.datosPostulanteService.getPostulanteImportacion().subscribe({
      next: (data) => {
        this.datosPostulanteImportadoRepetido = data.listaPostulanteRepetido;
        this.nregistrosRepetido = data.nregistrosRepetido;
        console.log(this.datosPostulanteImportadoRepetido);
        console.log(this.nregistrosRepetido);
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
    this._subscriptions$.add(datosPostulante)
  }

  ngOnInit(): void {
    this.traerComboPostulante();
    this.traerDatosImportacionNuevosPostulantes()
  }

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
    this.datosPostulanteImportadoRepetido = []
  }

}

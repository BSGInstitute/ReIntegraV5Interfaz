import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AlertaService } from '@shared/services/alerta.service';
import {
  ComboPostulante,
  ListaPostulante,
} from '@gestionPersonas/models/DatosPostulante';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-import-tabla-postulantes',
  templateUrl: './import-tabla-postulantes.component.html',
  styleUrls: ['./import-tabla-postulantes.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImportTablaPostulantesComponent implements OnInit {
  @Input() datosPostulanteService: DatosDelPostulanteService;

  datosPostulanteImportado: ListaPostulante[];
  comboPostulante: ComboPostulante;
  nregistrosNuevo: number = 0;

  private _subscriptions$ = new Subscription();

  public gridView: any[] = [];
  public pageSize = 5;
  public buttonCount = 2;
  public sizes = [10, 20, 50];

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
        this.datosPostulanteImportado = data.listaPostulante;
        this.nregistrosNuevo = data.nregistrosNuevo;
        console.log(this.datosPostulanteImportado);
        console.log(this.nregistrosNuevo);
        this.datosPostulanteService.setPostulantesParaInsercionMasiva(this.datosPostulanteImportado);
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
    this._subscriptions$.add(datosPostulante)
  }

  eliminarPostulante(postulante: ListaPostulante) {
    console.log("Postulante a descartar", postulante)
    this.datosPostulanteImportado = this.datosPostulanteImportado.filter(item =>
      item.nroDocumento !== postulante.nroDocumento ||
      item.nombre !== postulante.nombre
    );
    this.nregistrosNuevo = this.datosPostulanteImportado.length;
    this._alertaService.notificationSuccessBotom('Postulante descartado correctamente.');
    this.datosPostulanteService.setPostulantesParaInsercionMasiva(this.datosPostulanteImportado);
  }



  ngOnInit(): void {
    this.traerComboPostulante();
    this.traerDatosImportacionNuevosPostulantes()
  }

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }
}

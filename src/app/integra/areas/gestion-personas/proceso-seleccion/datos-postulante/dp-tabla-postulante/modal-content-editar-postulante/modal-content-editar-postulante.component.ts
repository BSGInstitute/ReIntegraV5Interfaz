import { DatosPostulanteFormulario } from './../../../../models/DatosPostulante';
import { DatosDelPostulanteService } from './../../../../services/datos-del-postulante.service';
import { UserService } from './../../../../../../../shared/services/user.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  ComboPostulante,
  ComboAreaFormacionExperiencia,
  DatosPostulante,
  ListaCodigoConvocatorum,
  Mensaje,
  PostulanteExperiencia,
  PostulanteFormacion,
} from '../../../../models/DatosPostulante';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '../../../../../../../shared/services/alerta.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IntegraService } from '../../../../../../../shared/services/integra.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-modal-content-editar-postulante',
  templateUrl: './modal-content-editar-postulante.component.html',
  styleUrls: ['./modal-content-editar-postulante.component.scss'],
})
export class ModalContentEditarPostulanteComponent implements OnInit {
  @Input() datosPostulanteService: DatosDelPostulanteService;
  @Input() postulante: DatosPostulante;

  codigoConvocatoriaFiltrado: ListaCodigoConvocatorum[] = [];
  estadoEtapaProcesoSeleccionFiltrado: any[] = [];

  comboPostulante: ComboPostulante;
  comboAreaFormacionExperiencia: ComboAreaFormacionExperiencia;
  postulanteExperiencia: PostulanteExperiencia[];
  postulanteFormacion: PostulanteFormacion[];

  datosPostulante: any;
  procesoSeleccion: any;

  private _subscriptions$ = new Subscription();
  loadingPanelVisible = false;
  controlBotton = false;
  mensaje: Mensaje;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  constructor(
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService,
    private cdr: ChangeDetectorRef,
    private _userService: UserService
  ) {}

  traerListaFormacion(){
    this.datosPostulanteService.ObtenerCentroEstudios()
  }

  traerComboPostulante() {
    const combo$ = this.datosPostulanteService.getComboPostulante().subscribe({
      next: (data) => {
        this.comboPostulante = data;
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
    this._subscriptions$.add(combo$);
  }

  traerComboAreaFormacionExperiencia(){
    const combo$ = this.datosPostulanteService.getComboAreaFormacionExperiencia().subscribe({
      next: (data) => {
        this.comboAreaFormacionExperiencia = data;
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
    this._subscriptions$.add(combo$);
  }

  traerDatosPostulante() {
    const postulante$ = this.datosPostulanteService
      .getDatosPostulante()
      .subscribe({
        next: (data) => {
          this.datosPostulante = data;
        },
        error: (error) => {
          this._alertaService.mensajeError(error);
        },
      });

    const procesoSeleccion$ = this.datosPostulanteService
      .getProcesoSeleccion()
      .subscribe({
        next: (data) => {
          this.procesoSeleccion = data;
        },
        error: (error) => {
          this._alertaService.mensajeError(error);
        },
      });

    this._subscriptions$.add(postulante$);
    this._subscriptions$.add(procesoSeleccion$);
  }

  habilitarBTN() {
    const loading$ = this.datosPostulanteService.getBoton().subscribe({
      next: (data) => {
        this.controlBotton = data;
      },
    });
    this._subscriptions$.add(loading$);
  }

  cargando() {
    const loading$ = this.datosPostulanteService.getLoading().subscribe({
      next: (data) => {
        this.loadingPanelVisible = data;
      },
    });
    this._subscriptions$.add(loading$);
  }

  actualizarPostulante() {
    this.habilitarBTN();
    this.cargando();
    this.traerDatosPostulante();
    const usuario = this._userService.userData.userName;
    const jsonData = {
      DatosPostulanteFormulario: {
        ...this.datosPostulante,
        ...this.procesoSeleccion,
      },
      Usuario: usuario,
    };
    console.log(jsonData);
    this.datosPostulanteService.actualizarDatosPostulante(jsonData);
    this.habilitarBTN();
  }

  ngOnInit(): void {
    this.traerListaFormacion()
    console.log(this.postulante);
    this.datosPostulanteService.postulanteInsertado$.subscribe((success) => {
      if (success) {
        this.cerrarModal();
        this.datosPostulanteService.postulanteInsertado$.next(false);
      }
    });
  }

  cerrarModal() {
    this.activeModal.close();
  }

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }
}

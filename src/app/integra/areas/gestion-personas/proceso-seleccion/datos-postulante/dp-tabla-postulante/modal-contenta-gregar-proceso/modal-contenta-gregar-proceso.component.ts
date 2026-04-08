import { data } from 'jquery';
import {
  ComparacionProcesosSeleccion,
  DatosPostulante,
  ProcesoSeleccion,
  ProcesoSeleccionTotal,
} from './../../../../models/DatosPostulante';
import { ComboPostulante } from '@gestionPersonas/models/DatosPostulante';
import { AlertaService } from '@shared/services/alerta.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@shared/services/user.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { IntegraService } from '@shared/services/integra.service';
import { constApiGestionPersonal } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { KendoGrid } from '@shared/models/kendo-grid';

@Component({
  selector: 'app-modal-contenta-gregar-proceso',
  templateUrl: './modal-contenta-gregar-proceso.component.html',
  styleUrls: ['./modal-contenta-gregar-proceso.component.scss'],
})
export class ModalContentaGregarProcesoComponent implements OnInit {
  @Input() datosPostulanteService: DatosDelPostulanteService;
  @Input() postulante: DatosPostulante;

  comboPostulante: ComboPostulante;
  nombreCompleto: string;
  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  mySelection: number[] = [];

  filtroProceso: ProcesoSeleccionTotal[] = [];

  public colorColumnasEstaticas: { [Key: string]: string } = {
    'border-left-width': '0',
    'background-color': '#4584a7',
    'text-align': 'center',
  };

  gridComparacionProcesosSeleccion =
    new KendoGrid<ComparacionProcesosSeleccion>();

  private _subscriptions$ = new Subscription();

  loadingPanelVisible = false;
  controlBotton = false;

  mostrarTabla = false;

  formNuevoProceso: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _alertaService: AlertaService,
    private _integraService: IntegraService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.initSuscripcions();
    this.iniciarForm();
    this.setearNombre();
    this.configurarCampos();
    this.datosPostulanteService.cambioProceso$.subscribe((success) => {
      if (success) {
        this.cerrarModal();
        this.datosPostulanteService.cambioProceso$.next(false);
      }
    });
  }

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }

  cerrarModal() {
    this.activeModal.close();
  }

  setearNombre() {
    this.nombreCompleto = `${this.postulante.nombre} ${this.postulante.apellidoPaterno} ${this.postulante.apellidoMaterno}`;
  }

  cargando() {
    const loading$ = this.datosPostulanteService.getLoading().subscribe({
      next: (data) => {
        this.loadingPanelVisible = data;
      },
    });
    this._subscriptions$.add(loading$);
  }

  habilitarBTN() {
    const loading$ = this.datosPostulanteService.getBoton().subscribe({
      next: (data) => {
        this.controlBotton = data;
      },
    });
    this._subscriptions$.add(loading$);
  }

  initSuscripcions() {
    const sub1$ = this.datosPostulanteService.getComboPostulante().subscribe({
      next: (data) => {
        this.comboPostulante = data;
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });

    const sub2$ = this.datosPostulanteService.getLoading().subscribe({
      next: (data) => {
        this.loadingPanelVisible = data;
      },
    });

    const sub3$ = this.datosPostulanteService.mensajeEnviado$.subscribe(
      (success) => {
        if (success) {
          this.cerrarModal();
          this.datosPostulanteService.mensajeEnviado$.next(false);
        }
      }
    );

    this._subscriptions$.add(sub1$);
    this._subscriptions$.add(sub2$);
    this._subscriptions$.add(sub3$);
  }

  iniciarForm() {
    this.formNuevoProceso = this._formBuilder.group({
      IdPostulante: [this.postulante.idPostulante],
      IdProcesoSeleccionDestino: [null, Validators.required],
      ProcesoAnterior: [false],
      IdProcesoSeleccionOrigen: [
        this.postulante.idProcesoSeleccion,
        [Validators.required],
      ],
    });
    const procesoFiltrado = this.comboPostulante.procesoSeleccionTotal.find(
      (valor) => valor.id === this.postulante.idProcesoSeleccion
    );
    this.filtroProceso.push(procesoFiltrado);
  }

  get ProcesoSeleccionDestinoFormControl(): AbstractControl {
    return this.formNuevoProceso.get('IdProcesoSeleccionDestino');
  }
  get ProcesoAnteriorFormControl(): AbstractControl {
    return this.formNuevoProceso.get('ProcesoAnterior');
  }
  get ProcesoSeleccionOrigenFormControl(): AbstractControl {
    return this.formNuevoProceso.get('IdProcesoSeleccionOrigen');
  }

  configurarCampos() {
    const ControlValorProceso = this.ProcesoAnteriorFormControl;
    const ControlProcesoDestino = this.ProcesoSeleccionDestinoFormControl;
    const ControlProcesoOrigen = this.ProcesoSeleccionOrigenFormControl;

    ControlProcesoOrigen.disable();

    ControlValorProceso?.valueChanges.subscribe((ValorProceso) => {
      if (!ControlProcesoDestino.value) {
        ControlValorProceso.setValue(false, { emitEvent: false });
        ControlProcesoOrigen.disable();
        this.mostrarTabla = false;
        this.cdr.detectChanges();
        return;
      }

      if (ValorProceso) {
        ControlProcesoOrigen.enable();
        this.cdr.detectChanges();
        const ProcesoOrigen = ControlProcesoOrigen.value;
        const ProcesoDestino = ControlProcesoDestino.value;

        console.log('Activando la comparación de procesos.');
        this.CompararProcesosSeleccion(
          this.postulante.idPostulante,
          ProcesoOrigen,
          ProcesoDestino
        );
        this.mostrarTabla = true;
      } else {
        console.log('Desactivando la comparación de procesos.');
        ControlProcesoOrigen.disable();
        this.mostrarTabla = false;
        this.controlBotton = false;
      }
    });

    // Suscribirse al cambio del dropdownlist de ControlProcesoDestino
    ControlProcesoDestino?.valueChanges.subscribe((ProcesoDestino) => {
      if (ControlValorProceso.value && ProcesoDestino) {
        const ProcesoOrigen = ControlProcesoOrigen.value;

        console.log(
          'Cambio en el destino, activando la comparación de procesos.'
        );
        this.CompararProcesosSeleccion(
          this.postulante.idPostulante,
          ProcesoOrigen,
          ProcesoDestino
        );
      }
    });
  }

  CompararProcesosSeleccion(
    idPostulante: number,
    ProcesoOrigen: number,
    ProcesoDestino: number
  ) {
    this.loadingPanelVisible = true;
    this.gridComparacionProcesosSeleccion.loading = true;
    this._integraService
      .getJsonResponse(
        `${constApiGestionPersonal.CompararProcesosSeleccion}/${idPostulante}/${ProcesoOrigen}/${ProcesoDestino}`
      )
      .subscribe({
        next: (response: HttpResponse<ComparacionProcesosSeleccion[]>) => {
          this.gridComparacionProcesosSeleccion.data = response.body;

          if (!response.body || response.body.length === 0) {
            this._alertaService.notificationWarning(
              'No se encontraron evaluaciones que coincidan en el proceso seleccionado. No se podra cambiar el proceso',
              true
            );
            this.controlBotton = true;
            this.loadingPanelVisible = false;
          }
          this.loadingPanelVisible = false;
          this.gridComparacionProcesosSeleccion.loading = false;
        },
        error: (error: any) => {
          console.log(error);
          this.gridComparacionProcesosSeleccion.loading = false;
          this.loadingPanelVisible = false;
          let mensaje = this._alertaService.getMessageErrorService(error);
          this._alertaService.notificationWarning(mensaje);
        },
      });
  }

  guardar() {
    this.habilitarBTN();
    this.cargando();
    if (this.formNuevoProceso.invalid) {
      this.habilitarBTN();
      this.formNuevoProceso.markAllAsTouched();
      this._alertaService.mensajeWarning('Completa los campos requeridos');
    } else {
      const data = this.formNuevoProceso.getRawValue();
      let idsEtapas: number[] = [];
      if (this.mySelection.length > 0) {
        idsEtapas = this.mySelection;
      }
      const usuario = this._userService.userData.userName;
      const IdPersonal = this._userService.userData.idPersonal;
      const JsonData = {
        ...data,
        IdsProcesoSeleccionEtapa: idsEtapas,
        Usuario: usuario,
        IdPersonal: IdPersonal,
      };

      const url = constApiGestionPersonal.CambiarProcesoSeleccionPostulanteAlterno;
      this.datosPostulanteService.cambiarProceso(JsonData, url);
      this.habilitarBTN();

      console.log(JsonData);
    }
  }
}

import { constApiGestionPersonal } from '@environments/constApi';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComboPostulante, Mensaje, ComboPlantillas } from '@gestionPersonas/models/DatosPostulante';
import { Postulante } from '@gestionPersonas/models/reporte-evaluacion-postulante';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { AlertaService } from '@shared/services/alerta.service';
import { UserService } from '@shared/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-content-contacto',
  templateUrl: './modal-content-contacto.component.html',
  styleUrls: ['./modal-content-contacto.component.scss'],
})
export class ModalContentContactoComponent implements OnInit {
  @Input() datosPostulanteService: DatosDelPostulanteService;
  @Input() tipoContacto: string;
  @Input() param: number | number[];

  ulrWhatssapp = '/Postulante/EnviarMensajeWhatsAppPostulante';
  urlEmail = '/Postulante/EnviarPlantillaEmailMasivo';

  comboPostulante: ComboPostulante;
  comboPlantillas: ComboPlantillas;
  plantilla:any[]

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  public format: FormatSettings = {
    displayFormat: 'dd/MM/yyyy HH:mm',
    inputFormat: 'dd/MM/yyyy HH:mm',
  };

  tipoEnvio : string = ''
  tipoPlantilla : string = ''

  private _subscriptions$ = new Subscription();
  loadingPanelVisible = false;
  controlBotton = false;
  mensaje: Mensaje;

  formContactoEnvio: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _alertaService: AlertaService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private _userService: UserService
  ) {}

  cargarFormulario(){
    this.formContactoEnvio = this._formBuilder.group({
      idPlantilla: [null, Validators.required],
      Fecha: [null, Validators.required]
    });
  }

  traerComboPlantillas() {
    this.datosPostulanteService.getComboPlantillas().subscribe({
      next: (data) => {
        this.comboPlantillas = data;
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
  }

  configurarDropDown() {
    switch (this.tipoContacto) {
      case 'email':
        this.tipoPlantilla = "E-mail"
        this.tipoEnvio = "Correo"
        this.plantilla = this.comboPlantillas.plantillaEmail
        break;
      case 'whatsapp':
        this.tipoPlantilla = "WhatsApp"
        this.tipoEnvio = " WhatsApp"
        this.plantilla = this.comboPlantillas.plantillaWhatsApp
        break;
      default:
        break;
    }
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

  // enviar(){
  //   this.habilitarBTN();
  //   this.cargando();
  //   if (this.formContactoEnvio.invalid) {
  //     this.formContactoEnvio.markAllAsTouched();
  //     this._alertaService.mensajeWarning('Llena los campos requeridos');
  //   }else{
  //     const idsProcesoSeleccion = Array.isArray(this.param) ? this.param : [this.param];
  //     const datos = this.formContactoEnvio.getRawValue();
  //     const usuario = this._userService.userData.userName;
  //     const jsonData = {
  //       ListaIdPostulanteProcesoSeleccion:idsProcesoSeleccion,
  //       ...datos,
  //       Usuario: usuario,
  //     }
  //     switch (this.tipoContacto) {
  //       case 'email':
  //         this.datosPostulanteService.EnviarCorreoOWhatsApp(jsonData, constApiGestionPersonal.EnviarPlantillaEmailMasivo);
  //         this.habilitarBTN();
  //         break;
  //       case 'whatsapp':
  //         this.datosPostulanteService.EnviarCorreoOWhatsApp(jsonData, constApiGestionPersonal.EnviarMensajeWhatsAppPostulante);
  //         this.habilitarBTN();
  //         break;
  //     }
  //     console.log(jsonData)
  //   }
  // }

  enviar() {
    this.habilitarBTN();
    this.cargando();
    if (this.formContactoEnvio.invalid) {
      this.formContactoEnvio.markAllAsTouched();
      this._alertaService.mensajeWarning('Llena los campos requeridos');
    } else {
      const idsProcesoSeleccion = Array.isArray(this.param) ? this.param : [this.param];
      const datos = this.formContactoEnvio.getRawValue();
      const usuario = this._userService.userData.userName;

      // Obtén la plantilla seleccionada para extraer la descripción
      const plantillaSeleccionada = this.plantilla.find(
        (item) => item.idPlantilla === datos.idPlantilla
      );

      const jsonData = {
        ListaIdPostulanteProcesoSeleccion: idsProcesoSeleccion,
        ...datos,
        Usuario: usuario,
        DescripcionPlantilla: plantillaSeleccionada?.descripcion || '', // Nueva propiedad
      };

      switch (this.tipoContacto) {
        case 'email':
          this.datosPostulanteService.EnviarCorreoOWhatsApp(
            jsonData,
            constApiGestionPersonal.EnviarPlantillaEmailMasivo
          );
          this.habilitarBTN();
          break;
        case 'whatsapp':
          this.datosPostulanteService.EnviarCorreoOWhatsApp(
            jsonData,
            constApiGestionPersonal.EnviarMensajeMasivoWhatsAppPostulante
          );
          this.habilitarBTN();
          break;
      }
      console.log(jsonData);
    }
  }

  cerrarModal() {
    this.activeModal.close();
  }

  ngOnInit(): void {
    this.cargarFormulario()
    this.traerComboPlantillas();
    this.configurarDropDown();

    this.datosPostulanteService.mensajeEnviado$.subscribe((success) => {
      if (success) {
        this.cerrarModal();
        this.datosPostulanteService.mensajeEnviado$.next(false);
      }
    });
  }

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }
}

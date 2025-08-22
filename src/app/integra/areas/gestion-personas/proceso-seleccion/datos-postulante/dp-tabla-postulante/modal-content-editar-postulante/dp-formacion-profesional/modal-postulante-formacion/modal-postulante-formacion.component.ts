import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { constApiGestionPersonal } from '@environments/constApi';
import {
  CentroEstudio,
  ComboAreaFormacionExperiencia,
  ComboCentroEstudio,
  ComboPostulante,
  DatosPostulante,
  PostulanteFormacion,
} from '@gestionPersonas/models/DatosPostulante';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { TextValidator } from '@shared/validators/text.validator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-postulante-formacion',
  templateUrl: './modal-postulante-formacion.component.html',
  styleUrls: ['./modal-postulante-formacion.component.scss'],
})
export class ModalPostulanteFormacionComponent
  implements OnInit, AfterViewInit
{
  @Input() datosPostulanteService: DatosDelPostulanteService;
  @Input() datosFormacion: PostulanteFormacion;
  @Input() tipoAccion: string;
  @Input() postulante: DatosPostulante;
  @Input() comboPostulante: ComboPostulante;
  @Input() comboAreaFormacionExperiencia: ComboAreaFormacionExperiencia;
  @Input() centroEstudios: ComboCentroEstudio[];

  private _subscriptions$ = new Subscription();
  loadingPanelVisible = false;
  controlBotton = false;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  public format: FormatSettings = {
    displayFormat: 'dd/MM/yyyy',
    inputFormat: 'dd/MM/yyyy',
  };

  formPostulanteFormacion: FormGroup;
  valoresIniciales: any;

  constructor(
    private _integraService: IntegraService,
    private _userService: UserService,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  llenarFormulario() {
    if (this.datosFormacion) {
      this.formPostulanteFormacion = this._formBuilder.group({
        Id: [this.datosFormacion.id],
        IdPostulante: [this.postulante?.idPostulante],
        idPais: [this.datosFormacion.idPais],
        IdCentroEstudio: [
          this.datosFormacion.idCentroEstudio,
          [Validators.required],
        ],
        OtraInstitucion: [
          this.datosFormacion.otraInstitucion,
          [
            Validators.required,
            Validators.maxLength(600),
            TextValidator.noStartSpace,
            TextValidator.noEndSpace,
            ,
          ],
        ],
        IdTipoEstudio: [this.datosFormacion.idTipoEstudio],
        IdEstadoEstudio: [this.datosFormacion.idEstadoEstudio],
        IdAreaFormacion: [
          this.datosFormacion.idAreaFormacion,
          [Validators.required],
        ],
        OtraCarrera: [
          this.datosFormacion.otraCarrera,
          [
            Validators.required,
            Validators.maxLength(600),
            TextValidator.noStartSpace,
            TextValidator.noEndSpace,
            ,
          ],
        ],
        FechaInicio: [
          new Date(this.datosFormacion.fechaInicio),
          [Validators.required],
        ],
        FechaFin: [
          new Date(this.datosFormacion.fechaFin),
          [Validators.required],
        ],
        TurnoEstudio: [this.datosFormacion.turnoEstudio],
        AlaActualidad: [this.datosFormacion.alaActualidad],
      });
      this.valoresIniciales = this.formPostulanteFormacion.getRawValue();
      this.cdr.detectChanges();
    } else {
      this.formPostulanteFormacion = this._formBuilder.group({
        Id: [0],
        IdPostulante: [this.postulante?.idPostulante],
        idPais: [null],
        IdCentroEstudio: [null, [Validators.required]],
        OtraInstitucion: [
          '',
          [
            Validators.required,
            Validators.maxLength(600),
            TextValidator.noStartSpace,
            TextValidator.noEndSpace,
            ,
          ],
        ],
        IdTipoEstudio: [null],
        IdEstadoEstudio: [null],
        IdAreaFormacion: [null, [Validators.required]],
        OtraCarrera: [
          '',
          [
            Validators.required,
            Validators.maxLength(600),
            TextValidator.noStartSpace,
            TextValidator.noEndSpace,
            ,
          ],
        ],
        FechaInicio: [null, [Validators.required]],
        FechaFin: [null, [Validators.required]],
        TurnoEstudio: [''],
        AlaActualidad: [false],
      });
    }

    this.configurandoDependenciaDeCampos();
  }

  get OtraInstitucionFormControl(): AbstractControl {
    return this.formPostulanteFormacion.get('OtraInstitucion');
  }
  get OtraCarreraEstudioFormControl(): AbstractControl {
    return this.formPostulanteFormacion.get('OtraCarrera');
  }

  configurandoDependenciaDeCampos() {
    const ControlOtraIntitucion =
      this.formPostulanteFormacion.get('OtraInstitucion');
    const ControlIdCentroEstudio =
      this.formPostulanteFormacion.get('IdCentroEstudio');

    const ControlOtraCarrera = this.formPostulanteFormacion.get('OtraCarrera');
    const ControlIdAreaFormacion =
      this.formPostulanteFormacion.get('IdAreaFormacion');

    if (this.datosFormacion) {
      if (ControlIdCentroEstudio.value !== null && ControlIdCentroEstudio.value !== 0) {
        console.log("ControlIdCentroEstudio")
        ControlOtraIntitucion.disable({ emitEvent: false });
      }
      if (ControlOtraIntitucion.value !== '') {
        console.log("ControlOtraIntitucion")
        ControlIdCentroEstudio.disable({ emitEvent: false });
      }

      if (ControlIdAreaFormacion.value !== null && ControlIdAreaFormacion.value !== 0) {
        ControlOtraCarrera.disable({ emitEvent: false });
      }
      if (ControlOtraCarrera.value !== '') {
        ControlIdAreaFormacion.disable({ emitEvent: false });
      }
    }

    //Controlando los cambios de `IdCentroEstudio`
    ControlIdCentroEstudio?.valueChanges.subscribe((valor) => {
      if (valor) {
        ControlOtraIntitucion?.disable({ emitEvent: false });
      } else {
        ControlOtraIntitucion?.enable({ emitEvent: false });
      }
    });

    //Controlando los cambios de `OtraInstitucion`
    ControlOtraIntitucion?.valueChanges.subscribe((valor) => {
      if (valor) {
        ControlIdCentroEstudio?.disable({ emitEvent: false });
      } else {
        ControlIdCentroEstudio?.enable({ emitEvent: false });
      }
    });

    //Controlando los cambios de `ControlIdAreaFormacion`
    ControlOtraCarrera?.valueChanges.subscribe((valor) => {
      if (valor) {
        ControlIdAreaFormacion?.disable({ emitEvent: false });
      } else {
        ControlIdAreaFormacion?.enable({ emitEvent: false });
      }
    });

    //Controlando los cambios de `ControlOtraCarrera`
    ControlIdAreaFormacion?.valueChanges.subscribe((valor) => {
      if (valor) {
        ControlOtraCarrera?.disable({ emitEvent: false });
      } else {
        ControlOtraCarrera?.enable({ emitEvent: false });
      }
    });
  }

  traerComboPostulante() {
    this.datosPostulanteService.getComboPostulante().subscribe({
      next: (data) => {
        this.comboPostulante = data;
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
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

  ngOnInit(): void {
    //this.traerComboPostulante();
    this.llenarFormulario();
    this.cdr.detectChanges();
    this.datosPostulanteService.postulanteFormacionInsertado$.subscribe(
      (success) => {
        if (success) {
          this.cerrarModal();
          this.datosPostulanteService.postulanteFormacionInsertado$.next(false);
        }
      }
    );
  }

  GuardarCambios() {
    this.cargando();

    const datos = this.formPostulanteFormacion.getRawValue();
    const usuario = this._userService.userData.userName;
    const jsonData = {
      FormacionPostulante: datos,
      Usuario: usuario,
    };

    //Comparando datos cambiados
    const HuboCambios =
      JSON.stringify(datos) !== JSON.stringify(this.valoresIniciales);

    if (!HuboCambios) {
      this._alertaService.notificationWarning(
        'No se realizo ningun cambio',
        true
      );
      return;
    }

    const formulario = this.formPostulanteFormacion;

    if (formulario.valid) {
      switch (this.tipoAccion) {
        case 'Registrar':
          this.datosPostulanteService.guardarCambiosPostulanteFormacion(
            jsonData,
            constApiGestionPersonal.RegistrarPostulanteFormacion
          );
          this.habilitarBTN();
          break;
        case 'Editar':
          this.datosPostulanteService.guardarCambiosPostulanteFormacion(
            jsonData,
            constApiGestionPersonal.ActualizarPostulanteFormacion
          );
          this.habilitarBTN();
          break;
      }
    } else {
      formulario.markAllAsTouched();
      this._alertaService.mensajeWarning('Completa los campos requeridos');
    }
  }

  cerrarModal() {
    this.activeModal.close();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }
}

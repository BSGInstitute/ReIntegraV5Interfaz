import { HttpResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  constApiGestionPersonal,
  constApiPlanificacion,
} from '@environments/constApi';
import {
  ComboAreaFormacionExperiencia,
  ComboPostulante,
  DatosPostulante,
  ListaEmpresa,
  PostulanteExperiencia,
} from '@gestionPersonas/models/DatosPostulante';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import {
  DropDownFilterSettings,
  DropDownListComponent,
} from '@progress/kendo-angular-dropdowns';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { TextValidator } from '@shared/validators/text.validator';
import { error } from 'console';
import { data } from 'jquery';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal-postulante-experiencia',
  templateUrl: './modal-postulante-experiencia.component.html',
  styleUrls: ['./modal-postulante-experiencia.component.scss'],
})
export class ModalPostulanteExperienciaComponent implements OnInit {
  @ViewChild('dropDownListEmpresa') dropDownListEmpresa: DropDownListComponent;
  dataEmpresa: ListaEmpresa[] = [];
  sourceEmpresa: ListaEmpresa[] = []; // Cache de todas las empresas

  @Input() datosPostulanteService: DatosDelPostulanteService;
  @Input() datosExperiencia: PostulanteExperiencia;
  @Input() tipoAccion: string;
  @Input() postulante: DatosPostulante;
  @Input() comboPostulante: ComboPostulante;
  @Input() comboAreaFormacionExperiencia: ComboAreaFormacionExperiencia;

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

  formPostulanteExperiencia: FormGroup;
  valoresIniciales: any;

  constructor(
    private _integraService: IntegraService,
    private _userService: UserService,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.llenarFormulario();
    this.cdr.detectChanges();
    this.datosPostulanteService.postulanteExperienciaInsertado$.subscribe(
      (success) => {
        if (success) {
          this.cerrarModal();
          this.datosPostulanteService.postulanteExperienciaInsertado$.next(
            false
          );
        }
      }
    );
  }

  cerrarModal() {
    this.activeModal.close();
  }

  ngAfterViewInit(): void {}

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }

  traerDatoEmpresa() {
    const datosEmprsa$ = this._integraService
      .getJsonResponse(
        `${constApiPlanificacion.EmpresaObtenerEmpresaPorId}/${this.datosExperiencia.idEmpresa}`
      )
      .subscribe({
        next: (response: HttpResponse<ListaEmpresa>) => {
          if (response !== null) {
            const dataEmpresa = response.body;
            this.dataEmpresa.push(dataEmpresa);
            this.formPostulanteExperiencia
              .get('IdEmpresa')
              ?.setValue(dataEmpresa.id);
          } else {
            this._alertaService.notificationInfo(
              'Error al traer la empresa, verifique la lista de empresas disponibles'
            );
          }
        },
        error: (error) => {
          let mensaje = this._alertaService.getErrorResponse(error);
          this._alertaService.swalFireOptions({
            icon: 'error',
            title: '¡Ocurrio un problema al obtener los registros!',
            text: `${mensaje.titulo}: ${mensaje.mensaje}`,
          });
        },
      });

    this._subscriptions$.add(datosEmprsa$);
  }

  llenarFormulario() {
    if (this.datosExperiencia) {
      this.formPostulanteExperiencia = this._formBuilder.group({
        Id: [this.datosExperiencia.id],
        IdPostulante: [this.postulante?.idPostulante],
        IdEmpresa: [this.datosExperiencia.idEmpresa, Validators.required],
        OtraEmpresa: [
          this.datosExperiencia.otraEmpresa,
          [
            Validators.required,
            Validators.maxLength(600),
            TextValidator.noStartSpace,
            TextValidator.noEndSpace,
          ],
        ],
        IdCargo: [this.datosExperiencia.idCargo],
        IdAreaTrabajo: [this.datosExperiencia.idAreaTrabajo],
        IdIndustria: [this.datosExperiencia.idIndustria],
        Salario: [
          this.datosExperiencia.salario,
          [Validators.required, Validators.min(0), Validators.max(99999)],
        ],
        SalarioComision: [
          this.datosExperiencia.salarioComision,
          [Validators.min(0), Validators.max(99999)],
        ],
        IdMoneda: [this.datosExperiencia.idMoneda],
        FechaInicio: [
          new Date(this.datosExperiencia.fechaInicio),
          [Validators.required],
        ],
        FechaFin: [
          new Date(this.datosExperiencia.fechaFin),
          [Validators.required],
        ],
        NombreJefe: [
          this.datosExperiencia.nombreJefe,
          [
            Validators.required,
            Validators.maxLength(100),
            TextValidator.noStartSpace,
            TextValidator.noEndSpace,
          ],
        ],
        NumeroJefe: [
          Number(this.datosExperiencia.numeroJefe),
          [Validators.maxLength(15)],
        ],
        Funcion: [
          this.datosExperiencia.funcion,
          [
            Validators.maxLength(600),
            TextValidator.noStartSpace,
            TextValidator.noEndSpace,
          ],
        ],
        EsUltimoEmpleo: [this.datosExperiencia.esUltimoEmpleo],
        AlaActualidad: [this.datosExperiencia.alaActualidad],
      });
      if (this.datosExperiencia.idEmpresa !== null) {
        console.log('llendando data :v');
        this.traerDatoEmpresa();
      }
      this.valoresIniciales = this.formPostulanteExperiencia.getRawValue();
      this.cdr.detectChanges();
    } else {
      this.formPostulanteExperiencia = this._formBuilder.group({
        Id: [0],
        IdPostulante: [this.postulante?.idPostulante],
        IdEmpresa: [null, [Validators.required]],
        OtraEmpresa: [
          '',
          [
            Validators.required,
            Validators.maxLength(600),
            TextValidator.noStartSpace,
            TextValidator.noEndSpace,
          ],
        ],
        IdCargo: [null],
        IdIndustria: [null],
        IdAreaTrabajo: [null],
        Salario: [
          0,
          [Validators.required, Validators.min(0), Validators.max(99999)],
        ],
        SalarioComision: [0, [Validators.min(0), Validators.max(99999)]],
        IdMoneda: [null],
        FechaInicio: [null, [Validators.required]],
        FechaFin: [null, [Validators.required]],
        EsUltimoEmpleo: [false],
        AlaActualidad: [false],
        NombreJefe: [
          '',
          [
            Validators.required,
            Validators.maxLength(100),
            TextValidator.noStartSpace,
            TextValidator.noEndSpace,
          ],
        ],
        NumeroJefe: ['', [Validators.maxLength(15)]],
        Funcion: ['', [Validators.maxLength(600)]],
      });
    }

    this.configurandoDependenciaDeCampos();
  }

  get IdEmpresaFormControl(): AbstractControl {
    return this.formPostulanteExperiencia.get('IdEmpresa');
  }
  get OtraEmpresaFormControl(): AbstractControl {
    return this.formPostulanteExperiencia.get('OtraEmpresa');
  }
  get SalarioFormControl(): AbstractControl {
    return this.formPostulanteExperiencia.get('Salario');
  }
  get FechaInicioFormControl(): AbstractControl {
    return this.formPostulanteExperiencia.get('FechaInicio');
  }
  get FechaFinFormControl(): AbstractControl {
    return this.formPostulanteExperiencia.get('FechaFin');
  }
  get NombreJefeFormControl(): AbstractControl {
    return this.formPostulanteExperiencia.get('NombreJefe');
  }
  get NumeroJefeFormControl(): AbstractControl {
    return this.formPostulanteExperiencia.get('NumeroJefe');
  }

  get FuncionFormControl(): AbstractControl {
    return this.formPostulanteExperiencia.get('Funcion');
  }

  configurandoDependenciaDeCampos() {
    const ControlIdEmpresa = this.IdEmpresaFormControl;
    const ControlOtraEmpresa = this.OtraEmpresaFormControl;

    if (this.datosExperiencia) {
      //console.log('VAAAAAAAAAlor Empresa', ControlIdEmpresa.value);
      if (ControlIdEmpresa.value !== null && ControlIdEmpresa.value !== 0) {
        ControlOtraEmpresa.disable({ emitEvent: false });
        console.log('ControlOTRAEmpresaaaaa DESSShabilidar');
        //ControlIdEmpresa.setValue(this.datosExperiencia.idEmpresa);
      }

      if (ControlOtraEmpresa.value !== '' && ControlOtraEmpresa.value !== null) {
        console.log(ControlOtraEmpresa.value)
        console.log('ControlIdEmpresaaaaaaaaaaaaaaaaaa DEShabilidar');
        ControlIdEmpresa.disable({ emitEvent: false });
      }
    }

    ControlIdEmpresa.valueChanges.subscribe((valor) => {
      valor
        ? ControlOtraEmpresa.disable({ emitEvent: false })
        : ControlOtraEmpresa.enable({ emitEvent: false });
    });

    ControlOtraEmpresa.valueChanges.subscribe((valor) => {
      valor
        ? ControlIdEmpresa.disable({ emitEvent: false })
        : ControlIdEmpresa.enable({ emitEvent: false });
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

  GuardarCambios() {
    this.cargando();

    const datos = this.formPostulanteExperiencia.getRawValue();
    const usuario = this._userService.userData.userName;
    const jsonData = {
      ExperienciaPostulante: {
        ...datos,
        NumeroJefe: String(this.NumeroJefeFormControl.value),
      },
      Usuario: usuario,
    };

    //Comparando datos cambiados
    const HuboCambios =
      JSON.stringify(datos) !== JSON.stringify(this.valoresIniciales);

    console.log('Datos iniciales', this.valoresIniciales);
    console.log('Datos Cambiados', datos);

    if (!HuboCambios) {
      this._alertaService.notificationWarning(
        'No se realizo ningun cambio',
        true
      );
      return;
    }

    //Valida el estado de cada campo del formulario
    Object.keys(this.formPostulanteExperiencia.controls).forEach((campo) => {
      const control = this.formPostulanteExperiencia.get(campo);
      console.log(campo, control?.status);
    });

    const formulario = this.formPostulanteExperiencia;

    console.log(jsonData);
    if (formulario.valid) {
      switch (this.tipoAccion) {
        case 'Registrar':
          this.datosPostulanteService.guardarCambiosPostulanteExperiencia(
            jsonData,
            constApiGestionPersonal.RegistrarPostulanteExperiencia
          );
          this.habilitarBTN();
          break;
        case 'Editar':
          this.datosPostulanteService.guardarCambiosPostulanteExperiencia(
            jsonData,
            constApiGestionPersonal.ActualizarPostulanteExperiencia
          );
          this.habilitarBTN();
          break;
      }
    } else {
      formulario.markAllAsTouched();
      this._alertaService.mensajeWarning('Completa los campos requeridos');
    }
  }

  filterEmpresa(value: string): void {
    console.log(value);
    if (value.length >= 3) {
      this.dropDownListEmpresa.loading = true;

      this.datosPostulanteService
        .obtenerEmpresaAutocomplete(value) // Llama al método de tu servicio
        .subscribe({
          next: (response: HttpResponse<ListaEmpresa[]>) => {
            console.log(response.body);
            this.dataEmpresa = response.body; // Actualiza el dropdown
            this.sourceEmpresa = response.body; // Cachea la respuesta
            this.dropDownListEmpresa.loading = false;
          },
          error: () => {
            this.dropDownListEmpresa.loading = false;
          },
        });
    } else if (value.length >= 1) {
      this.dataEmpresa = []; // Limpia los datos si no hay suficientes caracteres
    } else {
      this.dataEmpresa = this.sourceEmpresa; // Restaura el caché si no hay filtro
    }
  }

  cambioEmpresa(value: any): void {
    console.log('Empresa seleccionada:', value);
  }
}

import { HttpResponse } from '@angular/common/http';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import {
  ComboPostulante,
  ListaCodigoConvocatorum,
  ListaRespuestaDesaprobatoria,
  ListaRespuestaDesaprobatorum,
  Mensaje,
} from './../../../../models/DatosPostulante';
import { TextValidator } from '@shared/validators/text.validator';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PgeneralService } from '@planificacion/services/pgeneral.service';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { Subscription } from 'rxjs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { UserService } from '@shared/services/user.service';
import { setTimeout } from 'timers';

@Component({
  selector: 'app-modal-content-agregar-postulante',
  templateUrl: './modal-content-agregar-postulante.component.html',
  styleUrls: ['./modal-content-agregar-postulante.component.scss'],
})
export class ModalContentAgregarPostulanteComponent
  implements OnInit, AfterViewInit
{
  comboPostulante: ComboPostulante;
  ciudadesFiltradas: any[] = [];
  codigoConvocatoriaFiltrado: ListaCodigoConvocatorum[] = [];
  estadoEtapaProcesoSeleccionFiltrado: any[] = [];

  @Input() datosPostulanteService: DatosDelPostulanteService;
  //@Input()comboPostulantes : ComboPostulante;
  private _subscriptions$ = new Subscription();
  loadingPanelVisible = false;
  controlBotton = false;
  mensaje: Mensaje;

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  constructor(
    private _integraService: IntegraService,
    private _userService: UserService,
    public activeModal: NgbActiveModal,
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  formInsertarPostulante: FormGroup = this._formBuilder.group({
    Id: [0],
    Nombre: ['', Validators.required],
    ApellidoPaterno: ['', Validators.required],
    ApellidoMaterno: ['', Validators.required],
    IdTipoDocumento: [null, Validators.required],
    NroDocumento: ['', Validators.required],
    Email: ['', [Validators.required, Validators.email]],
    Celular: [''],
    IdPais: [null, Validators.required],
    IdCiudad: [null, Validators.required],
    IdProcesoSeleccion: [null, Validators.required],
    IdEstadoProcesoSeleccion: [null],
    IdProcesoSeleccionEtapa: [null],
    IdEstadoEtapaProcesoSeleccion: [null],
    //SE comento por peticion de GP
    //ListaRespuestaDesaprobatoria: [null],
    IdPostulanteNivelPotencial: [null],
    IdPersonalOperadorProceso: [null],
    IdPaginaReclutadoraPersonal: [null],
    IdConvocatoriaPersonal: [null],
  });

  ngOnInit(): void {
    this.traerComboPostulante();
    this.configurarFiltroCiudades();
    this.configurarFiltroProcesoSeleccion();
    //this.traerMensaje()
    //this.cdr.detectChanges();
    //this.traerComboPostulante();
    this.datosPostulanteService.postulanteInsertado$.subscribe((success) => {
      if (success) {
        this.cerrarModal();
        this.datosPostulanteService.postulanteInsertado$.next(false);
      }
    });
  }

  ngAfterViewInit(): void {}

  //Configuracion para el dropdown de ciudades
  configurarFiltroCiudades() {
    this.formInsertarPostulante.get('IdCiudad')?.disable();
    this.formInsertarPostulante
      .get('IdPais')
      ?.valueChanges.subscribe((idPais: number) => {
        if (idPais) {
          // Filtra las ciudades en función del país seleccionado
          this.ciudadesFiltradas = this.comboPostulante.ciudad.filter(
            (ciudad) => ciudad.idPais === idPais
          );

          // Habilita el campo IdCiudad y lo limpia para una nueva selección
          this.formInsertarPostulante.get('IdCiudad')?.enable();
          this.formInsertarPostulante.get('IdCiudad')?.setValue(null);
        } else {
          // Si no hay país seleccionado, limpia y deshabilita el campo IdCiudad
          this.ciudadesFiltradas = [];
          this.formInsertarPostulante.get('IdCiudad')?.setValue(null);
          this.formInsertarPostulante.get('IdCiudad')?.disable();
        }
      });
  }

  //Configuracion para los dropdown asociados a IdProcesoSeleccion
  configurarFiltroProcesoSeleccion() {
    this.formInsertarPostulante.get('IdEstadoProcesoSeleccion')?.disable();
    this.formInsertarPostulante.get('IdProcesoSeleccionEtapa')?.disable();
    this.formInsertarPostulante.get('IdEstadoEtapaProcesoSeleccion')?.disable();
    //Codigo Convocatoria
    this.formInsertarPostulante.get('IdConvocatoriaPersonal')?.disable();

    this.formInsertarPostulante
      .get('IdProcesoSeleccion')
      ?.valueChanges.subscribe((IdProcesoSeleccion: number) => {
        if (IdProcesoSeleccion) {
          //Estado Proceso Seleccion
          this.formInsertarPostulante.get('IdEstadoProcesoSeleccion')?.enable();
          this.formInsertarPostulante
            .get('IdEstadoProcesoSeleccion')
            ?.setValue(3);
          console.log(IdProcesoSeleccion);

          //Etapa Proceso Seleccion hay etapas para cada diferente proceso selección
          this.estadoEtapaProcesoSeleccionFiltrado =
            this.comboPostulante.listaEtapasProcesoSeleccion.filter(
              (etapas) => etapas.idProcesoSeleccion === IdProcesoSeleccion
            );
          this.formInsertarPostulante.get('IdProcesoSeleccionEtapa')?.enable();
          this.formInsertarPostulante
            .get('IdProcesoSeleccionEtapa')
            ?.valueChanges.subscribe((IdProcesoSeleccionEtapa: number) => {
              if (IdProcesoSeleccionEtapa) {
                //Estado Proceso Seleccion
                this.formInsertarPostulante
                  .get('IdEstadoEtapaProcesoSeleccion')
                  ?.enable();
                this.formInsertarPostulante
                  .get('IdEstadoEtapaProcesoSeleccion')
                  ?.setValue(3);
              } else {
                this.formInsertarPostulante
                  .get('IdEstadoEtapaProcesoSeleccion')
                  ?.setValue(null);
                this.formInsertarPostulante
                  .get('IdEstadoEtapaProcesoSeleccion')
                  ?.disable();
              }
            });

          //Codigo Convocatoria hay un codigo de convocatoria para cada proceso selección
          this.codigoConvocatoriaFiltrado =
            this.comboPostulante.listaCodigoConvocatoria.filter(
              (convocatoria) =>
                convocatoria.idProcesoSeleccion === IdProcesoSeleccion
            );
          this.formInsertarPostulante.get('IdConvocatoriaPersonal')?.enable();
          this.formInsertarPostulante
            .get('IdConvocatoriaPersonal')
            ?.setValue(null);
          this.formInsertarPostulante
            .get('IdEstadoProcesoSeleccion')
            ?.setValue(3);
          console.log(this.codigoConvocatoriaFiltrado);
        } else {
          this.codigoConvocatoriaFiltrado = [];
          this.formInsertarPostulante
            .get('IdConvocatoriaPersonal')
            ?.setValue(null);
          this.formInsertarPostulante.get('IdConvocatoriaPersonal')?.disable();
          this.formInsertarPostulante
            .get('IdEstadoProcesoSeleccion')
            ?.disable();
        }
        this.cdr.detectChanges();
      });

    this.formInsertarPostulante
      .get('IdProcesoSeleccionEtapa')
      ?.valueChanges.subscribe((IdProcesoSeleccionEtapa: number) => {
        if (IdProcesoSeleccionEtapa) {
          //Estado Proceso Seleccion
          this.formInsertarPostulante
            .get('IdEstadoEtapaProcesoSeleccion')
            ?.enable();
          this.formInsertarPostulante
            .get('IdEstadoEtapaProcesoSeleccion')
            ?.setValue(3);
        } else {
          this.formInsertarPostulante
            .get('IdEstadoEtapaProcesoSeleccion')
            ?.disable();
          this.formInsertarPostulante
            .get('IdEstadoEtapaProcesoSeleccion')
            ?.setValue(null);
        }
      });
  }

  traerComboPostulante() {
    const combo$ = this.datosPostulanteService.getComboPostulante().subscribe({
      next: (data) => {
        this.comboPostulante = data;
        //console.log('Datos de comboPostulante:', this.comboPostulante);
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
    this._subscriptions$.add(combo$);
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

  traerMensaje() {
    const loading$ = this.datosPostulanteService.getMensaje().subscribe({
      next: (data) => {
        this.mensaje = data;
        console.log(this.mensaje.valor);
      },
    });
    this._subscriptions$.add(loading$);
  }

  //SE comento por peticion de GP
  // construirListaRespuestaDesaprobatoria(): ListaRespuestaDesaprobatoria[] {
  //   const idsSeleccionados: number[] =
  //     this.formInsertarPostulante.get('ListaRespuestaDesaprobatoria').value ||
  //     [];
  //   return this.comboPostulante.listaRespuestaDesaprobatoria
  //     .filter((item) =>
  //       idsSeleccionados.includes(item.idRespuestaDesaprovatoria)
  //     )
  //     .map((item) => ({
  //       idRespuestaDesaprobatoria: item.idRespuestaDesaprovatoria,
  //       nombre: item.nombre,
  //     }));
  // }


  //Insercion del postulante
  insertarPostulante() {
    this.habilitarBTN();
    this.cargando();
    if (this.formInsertarPostulante.invalid) {
      this.habilitarBTN();
      this.formInsertarPostulante.markAllAsTouched();
      this._alertaService.mensajeWarning('Completa los campos requeridos');
    } else {
      this.habilitarBTN();
      //this.formInsertarPostulante.markAllAsTouched();
      const datosFormulario = this.formInsertarPostulante.getRawValue();
      const usuario = this._userService.userData.userName;

      const jsonData = {
        DatosPostulanteFormulario: {
          ...datosFormulario,
          // ListaRespuestaDesaprobatoria:
          //   this.construirListaRespuestaDesaprobatoria(),
        },
        Usuario: usuario,
      };
      this.datosPostulanteService.insertarPostulanteNuevo(jsonData);
      this.habilitarBTN();
    }
  }

  cerrarModal(){
    this.activeModal.close();
  }

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }
}

//Valida el estado de cada campo del formulario
// Object.keys(this.formInsertarPostulante.controls).forEach((campo) => {
//   const control = this.formInsertarPostulante.get(campo);
//   console.log(campo, control?.status);
// });

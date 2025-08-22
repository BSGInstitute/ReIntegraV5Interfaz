import { ChangeDetectorRef, Component, Input, OnInit, QueryList, ViewChildren, ViewContainerRef } from '@angular/core';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import { DatosDelPostulanteService } from '../../../../../services/datos-del-postulante.service';
import {
  ComboPostulante,
  DatosPostulante,
  ListaCodigoConvocatorum,
  ListaRespuestaDesaprobatoria,
} from '../../../../../models/DatosPostulante';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaService } from '../../../../../../../../shared/services/alerta.service';
import { Subscription } from 'rxjs';
import { TablaHistorialPostulanteComponent } from '../tabla-historial-postulante/tabla-historial-postulante.component';
@Component({
  selector: 'app-dp-proceso-seleccion',
  templateUrl: './dp-proceso-seleccion.component.html',
  styleUrls: ['./dp-proceso-seleccion.component.scss'],
})
export class DpProcesoSeleccionComponent implements OnInit {
  @ViewChildren(
    'HistorialProcesoSeleccion, HistorialCodigoConvocatoria, HistorialEstadoProcesoSeleccion, HistorialEtapaProcesoSeleccion, HistorialEstadoEtapaProcesoSeleccion, HistorialRespuestaDesaprovatoria, HistorialPotencialProcesoSeleccion, HistorialPersonalOperadorProceso, HistorialPaginaReclutadoraPersonal',
    {
      read: ViewContainerRef,
    }
  )
  containers!: QueryList<ViewContainerRef>;

  @Input() datosPostulanteService: DatosDelPostulanteService;
  @Input() postulante: DatosPostulante;
  @Input() filterSettings: DropDownFilterSettings;

  comboPostulante: ComboPostulante;
  formEditarPostulante: FormGroup;

  codigoConvocatoriaFiltrado: ListaCodigoConvocatorum[] = [];
  estadoEtapaProcesoSeleccionFiltrado: any[] = [];
  IdsRespuestas: number[];

  public format: FormatSettings = {
    displayFormat: 'dd/MM/yyyy',
    inputFormat: 'dd/MM/yy',
  };

  private _subscriptions$ = new Subscription();

  constructor(
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  LlenarFormulario() {
    if (this.postulante) {
      this.formEditarPostulante = this._formBuilder.group({
        IdProcesoSeleccion: [
          this.postulante.idProcesoSeleccion,
          Validators.required,
        ],
        IdConvocatoriaPersonal: [
          this.postulante.idConvocatoriaPersonal
        ],
        IdEstadoProcesoSeleccion: [
          this.postulante.idEstadoProcesoSeleccion
        ],
        IdProcesoSeleccionEtapa: [
          this.postulante.idProcesoSeleccionEtapa
        ],
        IdEstadoEtapaProcesoSeleccion: [
          this.postulante.idEstadoEtapaProcesoSeleccion
        ],
        //SE comento por peticion de GP
        // ListaRespuestaDesaprobatoria: [
        //   this.convertirCadenaInt(
        //     this.postulante.idRespuestas ? this.postulante.idRespuestas : ''
        //   ),
        //],
        IdPostulanteNivelPotencial: [
          this.postulante.idPostulanteNivelPotencial
        ],
        IdPaginaReclutadoraPersonal: [
          this.postulante.idProveedor
        ],
        IdPersonalOperadorProceso: [
          this.postulante.idPersonal_OperadorProceso
        ],
      });
    }
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

  convertirCadenaInt(ides: string): number[] {
    const IdsRespuestas = ides
      ? ides.split(',').map((id) => parseInt(id.trim()))
      : [];
    return IdsRespuestas;
  }

  configurarFiltroProcesoSeleccion() {
    this.formEditarPostulante.get('IdEstadoProcesoSeleccion')?.disable();
    this.formEditarPostulante.get('IdProcesoSeleccionEtapa')?.disable();
    this.formEditarPostulante.get('IdEstadoEtapaProcesoSeleccion')?.disable();
    //Codigo Convocatoria
    this.formEditarPostulante.get('IdConvocatoriaPersonal')?.disable();
    const idProcesoSeleccion =
      this.formEditarPostulante.get('IdProcesoSeleccion')?.value;

    if (idProcesoSeleccion != null) {
      //asignar el estado proceso seleccion
      this.formEditarPostulante.get('IdProcesoSeleccion')?.disable();
      this.formEditarPostulante.get('IdEstadoProcesoSeleccion')?.enable();
      this.formEditarPostulante
        .get('IdEstadoProcesoSeleccion')
        ?.setValue(this.postulante.idEstadoProcesoSeleccion);

      //Codigo convocatoria:
      this.codigoConvocatoriaFiltrado =
        this.comboPostulante.listaCodigoConvocatoria.filter(
          (convocatoria) =>
            convocatoria.idProcesoSeleccion === idProcesoSeleccion
        );
      const idCodigoConvocatoria = this.formEditarPostulante.get(
        'IdConvocatoriaPersonal'
      )?.value;
      this.formEditarPostulante.get('IdConvocatoriaPersonal')?.enable();
      this.formEditarPostulante
        .get('IdConvocatoriaPersonal')
        ?.setValue(idCodigoConvocatoria);

      //Etapa Proceso Seleccion hay etapas para cada diferente proceso selección
      this.estadoEtapaProcesoSeleccionFiltrado =
        this.comboPostulante.listaEtapasProcesoSeleccion.filter(
          (etapas) => etapas.idProcesoSeleccion === idProcesoSeleccion
        );
      //habilidatando etpas
      this.formEditarPostulante.get('IdProcesoSeleccionEtapa')?.enable();
      this.formEditarPostulante.get('IdEstadoEtapaProcesoSeleccion')?.enable();
    }

    this.formEditarPostulante
      .get('IdProcesoSeleccion')
      ?.valueChanges.subscribe((IdProcesoSeleccion: number) => {
        if (IdProcesoSeleccion) {
          //Estado Proceso Seleccion
          this.formEditarPostulante.get('IdEstadoProcesoSeleccion')?.enable();
          this.formEditarPostulante
            .get('IdEstadoProcesoSeleccion')
            ?.setValue(3);
          console.log(IdProcesoSeleccion);

          //Etapa Proceso Seleccion hay etapas para cada diferente proceso selección
          this.estadoEtapaProcesoSeleccionFiltrado =
            this.comboPostulante.listaEtapasProcesoSeleccion.filter(
              (etapas) => etapas.idProcesoSeleccion === IdProcesoSeleccion
            );
          this.formEditarPostulante.get('IdProcesoSeleccionEtapa')?.enable();
          this.formEditarPostulante
            .get('IdProcesoSeleccionEtapa')
            ?.valueChanges.subscribe((IdProcesoSeleccionEtapa: number) => {
              if (IdProcesoSeleccionEtapa) {
                //Estado Proceso Seleccion
                this.formEditarPostulante
                  .get('IdEstadoEtapaProcesoSeleccion')
                  ?.enable();
                this.formEditarPostulante
                  .get('IdEstadoEtapaProcesoSeleccion')
                  ?.setValue(3);
              } else {
                this.formEditarPostulante
                  .get('IdEstadoEtapaProcesoSeleccion')
                  ?.setValue(null);
                this.formEditarPostulante
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
          this.formEditarPostulante.get('IdConvocatoriaPersonal')?.enable();
          this.formEditarPostulante
            .get('IdConvocatoriaPersonal')
            ?.setValue(null);
          this.formEditarPostulante
            .get('IdEstadoProcesoSeleccion')
            ?.setValue(3);
          console.log(this.codigoConvocatoriaFiltrado);
        } else {
          this.codigoConvocatoriaFiltrado = [];
          this.formEditarPostulante
            .get('IdConvocatoriaPersonal')
            ?.setValue(null);
          this.formEditarPostulante.get('IdConvocatoriaPersonal')?.disable();
          this.formEditarPostulante.get('IdEstadoProcesoSeleccion')?.disable();
        }
        this.cdr.detectChanges();
      });

    this.formEditarPostulante
      .get('IdProcesoSeleccionEtapa')
      ?.valueChanges.subscribe((IdProcesoSeleccionEtapa: number) => {
        if (IdProcesoSeleccionEtapa) {
          //Estado Proceso Seleccion
          this.formEditarPostulante
            .get('IdEstadoEtapaProcesoSeleccion')
            ?.enable();
          this.formEditarPostulante
            .get('IdEstadoEtapaProcesoSeleccion')
            ?.setValue(3);
        } else {
          this.formEditarPostulante
            .get('IdEstadoEtapaProcesoSeleccion')
            ?.disable();
          this.formEditarPostulante
            .get('IdEstadoEtapaProcesoSeleccion')
            ?.setValue(null);
        }
      });
  }

  //Se comento por peticion de GP
  // construirListaRespuestaDesaprobatoria(): ListaRespuestaDesaprobatoria[] {
  //   const idsSeleccionados: number[] =
  //     this.formEditarPostulante.get('ListaRespuestaDesaprobatoria')?.value ||
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

  actualizarDatos() {
    if (this.formEditarPostulante.invalid) {
      this.formEditarPostulante.markAllAsTouched();
      this._alertaService.mensajeWarning('Completa los campos requeridos');
    } else {
      const datosFormulario = this.formEditarPostulante.getRawValue();
      const jsonProcesoSeleccion = {
        ...datosFormulario
        // ListaRespuestaDesaprobatoria:
        //   this.construirListaRespuestaDesaprobatoria(),
      };

      this.datosPostulanteService.setProcesoSeleccion(jsonProcesoSeleccion);
      console.log(jsonProcesoSeleccion);
    }
  }

  onCheckboxChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const clave = checkbox.getAttribute('clave');

    const flechaHTML = document.getElementById(clave);

    const componente = `Historial${clave}`;

    if (!this.containers || this.containers.length === 0) {
      console.warn('No hay contenedores disponibles.');
      return;
    }
    const nombreContainer = this.containers.toArray();

    const contenedor = nombreContainer.find((container) => {
      const id = container.element.nativeElement.getAttribute('id');
      return id === componente;
    });

    if (checkbox.checked) {
      console.log(`${clave} esta activado`);
      flechaHTML.classList.add('rotate');
      if (contenedor) {
        contenedor.clear();
        const factory = contenedor.createComponent(
          TablaHistorialPostulanteComponent
        );
        factory.instance.idPostulante = this.postulante.idPostulante;
        factory.instance.clave = clave;
        this.cdr.detectChanges();
      } else {
        console.warn(`Contenedor no encontrado para clave: ${componente}`);
      }
    } else {
      console.log(`${clave} esta desactivado`);
      flechaHTML.classList.remove('rotate');
      contenedor.clear();
    }
  }

  ngOnInit(): void {
    this.LlenarFormulario();
    this.traerComboPostulante();
    this.configurarFiltroProcesoSeleccion();
    this.actualizarDatos();
    console.log(this.postulante);
  }

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }
}

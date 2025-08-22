import { TablaHistorialPostulanteComponent } from './../tabla-historial-postulante/tabla-historial-postulante.component';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { AlertaService } from './../../../../../../../../shared/services/alerta.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatosDelPostulanteService } from './../../../../../services/datos-del-postulante.service';
import {
  ComboPostulante,
  DatosPostulante,
} from './../../../../../models/DatosPostulante';
import { FormatSettings } from '@progress/kendo-angular-dateinputs';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dp-datos-postulante',
  templateUrl: './dp-datos-postulante.component.html',
  styleUrls: ['./dp-datos-postulante.component.scss'],
})
export class DpDatosPostulanteComponent implements OnInit, AfterViewInit {
  //Para mostrar el historial:
  @ViewChildren(
    'HistorialNombre, HistorialApellidoPaterno, HistorialApellidoMaterno, HistorialIdTipoDocumento, HistorialNroDocumento, HistorialIdPais, HistorialIdCiudad, HistorialCelular, HistorialEmail, HistorialFechaNacimiento, HistorialIdSexo, HistorialTieneHijo, HistorialCantidadHijo, HistorialUrlPerfilFacebook, HistorialUrlPerfilLinkedin',
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
  ciudadesFiltradas: any[] = [];
  private _subscriptions$ = new Subscription();

  public min: Date = new Date(1917, 0, 1);
  public miliSegundos = 1000 * 60 * 60 * 24 * 6570;
  public hoy = new Date();
  public resta = this.hoy.getTime() - this.miliSegundos;
  public max: Date = new Date(this.resta);

  public format: FormatSettings = {
    displayFormat: 'dd/MM/yyyy',
    inputFormat: 'dd/MM/yyyy',
  };

  constructor(
    private _alertaService: AlertaService,
    private _formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {}

  LlenarFormulario() {
    if (this.postulante) {
      this.formEditarPostulante = this._formBuilder.group({
        Id: [this.postulante.idPostulante],
        Nombre: [this.postulante.nombre, Validators.required],
        ApellidoPaterno: [this.postulante.apellidoPaterno, Validators.required],
        ApellidoMaterno: [this.postulante.apellidoMaterno, Validators.required],
        IdTipoDocumento: [
          this.postulante.idTipoDocumento,
          Validators.required,
        ],
        NroDocumento: [this.postulante.nroDocumento, Validators.required],
        IdPais: [
          this.postulante.idPais,
          Validators.required,
        ],
        IdCiudad: [this.postulante.idCiudad, Validators.required],
        Celular: [this.postulante.celular],
        Email: [this.postulante.email, [Validators.required, Validators.email]],
        FechaNacimiento: [
          this.postulante.fechaNacimiento
            ? new Date(this.postulante.fechaNacimiento)
            : null,
        ],
        IdSexo: [this.postulante.idSexo],
        TieneHijo: [
          this.postulante.tieneHijo !== null ? this.postulante.tieneHijo : false
        ],
        CantidadHijo: [
          this.postulante.cantidadHijo
        ],
        UrlPerfilFacebook: [
          this.postulante.urlPerfilFacebook
        ],
        UrlPerfilLinkedin: [
          this.postulante.urlPerfilLinkedin
        ],
        Edad: [this.postulante.edad]
      });
    }
  }

  //Configuracion para el dropdown de ciudades
  configurarFiltroCiudades() {
    this.formEditarPostulante.get('IdCiudad')?.disable();
    if (this.formEditarPostulante.get('IdPais')?.value != null) {
      this.ciudadesFiltradas = this.comboPostulante.ciudad.filter(
        (ciudad) =>
          ciudad.idPais === this.formEditarPostulante.get('IdPais')?.value
      );
      this.formEditarPostulante.get('IdCiudad')?.enable();
      this.formEditarPostulante
        .get('IdCiudad')
        ?.setValue(this.postulante.idCiudad);
      //this.cdr.detectChanges();
    }
    this.formEditarPostulante
      .get('IdPais')
      ?.valueChanges.subscribe((idPais: number) => {
        if (idPais) {
          this.ciudadesFiltradas = this.comboPostulante.ciudad.filter(
            (ciudad) => ciudad.idPais === idPais
          );

          this.formEditarPostulante.get('IdCiudad')?.enable();
          this.formEditarPostulante.get('IdCiudad')?.setValue(null);
          this.cdr.detectChanges();
        } else {
          this.ciudadesFiltradas = [];
          this.formEditarPostulante.get('IdCiudad')?.setValue(null);
          this.formEditarPostulante.get('IdCiudad')?.disable();
          this.cdr.detectChanges();
        }
      });
  }

  //Configuracion campo de hijos
  configuracionHijos() {
    this.formEditarPostulante.get('CantidadHijo')?.disable();
    if (this.postulante.tieneHijo !== null) {
      this.formEditarPostulante.get('CantidadHijo')?.enable();
      this.cdr.detectChanges();
    }
    if (this.postulante.tieneHijo === true) {
      this.formEditarPostulante.get('CantidadHijo')?.disable();
      this.cdr.detectChanges();
    }
    this.formEditarPostulante
      .get('TieneHijo')
      ?.valueChanges.subscribe((valor: boolean) => {
        if (valor) {
          this.formEditarPostulante.get('CantidadHijo')?.enable();
        } else {
          this.formEditarPostulante.get('CantidadHijo')?.disable();
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

  actualizarDatos() {
    if (this.formEditarPostulante.invalid) {
      this.formEditarPostulante.markAllAsTouched();
      this._alertaService.mensajeWarning('Completa los campos requeridos');
    } else {
      const datosFormulario = this.formEditarPostulante.getRawValue();

      const jsonDatosPostulante = datosFormulario;

      this.datosPostulanteService.setDatosPostulante(jsonDatosPostulante);
      console.log(jsonDatosPostulante);
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
    this.configurarFiltroCiudades();
    this.configuracionHijos();
  }

  ngAfterViewInit(): void {
    this.actualizarDatos();
  }

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }
}

import { CentroEstudioComponent } from '@gestionPersonas/maestro/centro-estudio/centro-estudio.component';
import { ModalPostulanteFormacionComponent } from './modal-postulante-formacion/modal-postulante-formacion.component';
import { Component, Input, OnInit } from '@angular/core';
import {
  CentroEstudio,
  ComboAreaFormacionExperiencia,
  ComboCentroEstudio,
  ComboPostulante,
  DatosPostulante,
  HistorialPostulanteFormacion,
  PostulanteFormacion,
} from '@gestionPersonas/models/DatosPostulante';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataItem } from '@progress/kendo-angular-grid';
import { PageSizeItem } from '@progress/kendo-angular-treelist';
import { KendoGrid } from '@shared/models/kendo-grid';
import { AlertaService } from '@shared/services/alerta.service';
import { UserService } from '@shared/services/user.service';
import { error } from 'console';
import { Subscription } from 'rxjs';
import { ModalHistorialPostulanteFormacionComponent } from './modal-historial-postulante-formacion/modal-historial-postulante-formacion.component';

@Component({
  selector: 'app-dp-formacion-profesional',
  templateUrl: './dp-formacion-profesional.component.html',
  styleUrls: ['./dp-formacion-profesional.component.scss'],
})
export class DpFormacionProfesionalComponent implements OnInit {
  @Input() datosPostulanteService: DatosDelPostulanteService;
  @Input() postulante: DatosPostulante;

  comboPostulante: ComboPostulante;
  comboAreaFormacionExperiencia: ComboAreaFormacionExperiencia;
  centroEstudios: ComboCentroEstudio[];

  //historialPostulanteFormacion: HistorialPostulanteFormacion[];
  gridHistorialPostulanteFormacion: HistorialPostulanteFormacion[];

  gridFormacionPostulante = new KendoGrid<PostulanteFormacion>();

  public pageSize = 5;
  public buttonCount = 2;
  public sizes = [10, 20, 50];

  private _subscriptions$ = new Subscription();

  constructor(
    private _modalService: NgbModal,
    private _alertaService: AlertaService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.traerComboPostulante();
    this.traerComboAreaFormacionExperiencia();
    this.recargaDeDatos();
    this.traerListaFormacionPostulante();
    this.loadingTabla();
    this.traerCentroDeEstudios();
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
  }

  traerCentroDeEstudios() {
    const comboCentroEstudios = this.datosPostulanteService
      .getCentroEstudios()
      .subscribe({
        next: (data) => {
          this.centroEstudios = data;
        },
        error: (error) => {
          this._alertaService.mensajeError(error);
        },
      });
    this._subscriptions$.add(comboCentroEstudios);
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

  traerComboPostulante() {
    const comboPost = this.datosPostulanteService
      .getComboPostulante()
      .subscribe({
        next: (data) => {
          this.comboPostulante = data;
        },
        error: (error) => {
          this._alertaService.mensajeError(error);
        },
      });
    this._subscriptions$.add(comboPost);
  }

  traerListaFormacionPostulante() {
    const lista$ = this.datosPostulanteService
      .getPostulanteFormacion()
      .subscribe({
        next: (data) => {
          this.gridFormacionPostulante.data = data;
        },
        error: (error) => {
          this._alertaService.mensajeError(error);
        },
      });
    this._subscriptions$.add(lista$);
  }

  loadingTabla() {
    const loading$ = this.datosPostulanteService.getLoadingTabla$().subscribe({
      next: (success) => {
        this.gridFormacionPostulante.loading = success;
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
    this._subscriptions$.add(loading$);
  }

  //Función para llenar la columna de Pais...
  obtenerNombrePaisPorId(id: number) {
    const pais = this.comboPostulante?.pais?.find(
      (element) => element.id === id
    );
    return pais ? pais.nombre : 'Seleccione Pais';
  }

  //Funcion para llenar la columna de Centro Formación
  obtenerNombreInstitucionPorId(id: number) {
    const pais = this.centroEstudios?.find((element) => element.id === id);
    return pais ? pais.nombre : 'Seleccione Intitucion';
  }

  //Funcion para llenar la columna de Nivel Estudio
  obtenerNombreNivelPorId(id: number) {
    const pais = this.comboAreaFormacionExperiencia?.nivel?.find(
      (element) => element.id === id
    );
    return pais ? pais.nombre : 'Seleccione Nivel';
  }

  //Funcion para llenar la columna de Estado Estudio
  obtenerNombreEstadoPorId(id: number) {
    const pais = this.comboAreaFormacionExperiencia?.estadoEstudio?.find(
      (element) => element.id === id
    );
    return pais ? pais.nombre : 'Seleccione Nivel';
  }

  //Funcion para llenar la columna de Nivel
  obtenerNombreAreaFormacionPorId(id: number) {
    const pais = this.comboAreaFormacionExperiencia?.areaFormacion?.find(
      (element) => element.id === id
    );
    return pais ? pais.nombre : 'Seleccione Area Formacion';
  }

  abrirModalPostulanteFormacion(tipoAccion: string): void;
  abrirModalPostulanteFormacion(
    datosFormacion: PostulanteFormacion,
    tipoAccion: string
  ): void;

  abrirModalPostulanteFormacion(
    parametroEditar: string | PostulanteFormacion,
    parametroTipoAccion?: string
  ) {
    let datosFormacion: PostulanteFormacion | undefined;
    let tipoAccion: string;

    // Determinar los valores según los parámetros recibidos
    if (typeof parametroEditar === 'string') {
      tipoAccion = parametroEditar;
    } else {
      datosFormacion = parametroEditar;
      tipoAccion = parametroTipoAccion!;
    }

    const modalRef = this._modalService.open(
      ModalPostulanteFormacionComponent,
      {
        size: '250',
        backdrop: 'static',
        keyboard: false,
      }
    );
    // Asignar datos al componente del modal
    modalRef.componentInstance.datosPostulanteService =
      this.datosPostulanteService;
    modalRef.componentInstance.tipoAccion = tipoAccion;
    modalRef.componentInstance.postulante = this.postulante;
    modalRef.componentInstance.comboPostulante = this.comboPostulante;
    modalRef.componentInstance.comboAreaFormacionExperiencia = this.comboAreaFormacionExperiencia;
    modalRef.componentInstance.centroEstudios = this.centroEstudios;

    if (datosFormacion) {
      console.log(datosFormacion);
      modalRef.componentInstance.datosFormacion = datosFormacion;
    }
    // console.log(`Modal abierto con tipo de acción: ${tipoAccion}`);
    // if (datosFormacion) {
    //   console.log(`Datos de formación:`, datosFormacion);
    // }
  }

  recargaDeDatos() {
    this.datosPostulanteService.postulanteFormacionInsertado$.subscribe(
      (success) => {
        if (success) {
          this.datosPostulanteService.ObtenerPostulanteFormacion(
            this.postulante.idPostulante
          );
        }
      }
    );
    this.datosPostulanteService.postulanteFormacionInsertado$.subscribe(
      (succes) => {
        if (succes) {
          this.datosPostulanteService.ObtenerCentroEstudios();
        }
      }
    );
  }

  agregarNuevaFormacion() {
    console.log('Creando una formacion postulante');
    this.abrirModalPostulanteFormacion('Registrar');
  }

  editarFormacionPostulante(datosFormacion: PostulanteFormacion) {
    console.log('Editando una formacion postulante');
    this.abrirModalPostulanteFormacion(datosFormacion, 'Editar');
  }

  eliminarFormacionPostulante(id: number) {
    const usuario = this._userService.userData.userName;

    const JsonEliminar = {
      Id: id,
      NombreUsuario: usuario,
    };

    this._alertaService.mensajeEliminar().then((resultado) => {
      if (resultado.value) {
        console.log(`Se eliminara la formacion del postulante con id ${id}`);
        this.datosPostulanteService.EliminarPostulanteFormacion(JsonEliminar);
        //this.recargaDeDatos();
      } else {
        console.log(`Ya no Se eliminara el postulante con id ${id}`);
      }
    });
  }

  ObtenerHistorialPostulanteFormacion() {
    this.datosPostulanteService.ObtenerHistorialPostulanteFormacion(
      this.postulante.idPostulante
    );
    const modalRef = this._modalService.open(
      ModalHistorialPostulanteFormacionComponent,
      {
        size: 'xl',
      }
    );
    modalRef.componentInstance.datosPostulanteService =
      this.datosPostulanteService;
    modalRef.componentInstance.comboPostulante = this.comboPostulante;
    modalRef.componentInstance.centroEstudios = this.centroEstudios;
  }

  AgregarNuevoCentroEstudios(context: any) {
    this._modalService.open(context, { size: 'xl', backdrop: 'static' });
  }
}

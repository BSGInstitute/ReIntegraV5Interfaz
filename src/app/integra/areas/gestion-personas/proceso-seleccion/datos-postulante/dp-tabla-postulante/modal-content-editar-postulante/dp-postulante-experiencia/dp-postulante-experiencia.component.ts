import { ModalPostulanteExperienciaComponent } from './modal-postulante-experiencia/modal-postulante-experiencia.component';
import { ModalHistorialPostulanteExperienciaComponent } from './modal-historial-postulante-experiencia/modal-historial-postulante-experiencia.component';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import { Component, Input, OnInit } from '@angular/core';
import {
  ComboAreaFormacionExperiencia,
  ComboPostulante,
  DatosPostulante,
  HistorialPostulanteExperiencia,
  PostulanteExperiencia,
} from '@gestionPersonas/models/DatosPostulante';
import { KendoGrid } from '@shared/models/kendo-grid';
import { Subscription } from 'rxjs';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-dp-postulante-experiencia',
  templateUrl: './dp-postulante-experiencia.component.html',
  styleUrls: ['./dp-postulante-experiencia.component.scss'],
})
export class DpPostulanteExperienciaComponent implements OnInit {
  @Input() datosPostulanteService: DatosDelPostulanteService;
  @Input() postulante: DatosPostulante;

  comboPostulante: ComboPostulante;
  comboAreaFormacionExperiencia: ComboAreaFormacionExperiencia;

  gridHistorialPostulanteFormacion: HistorialPostulanteExperiencia[];

  gridPostulanteExperiencia = new KendoGrid<PostulanteExperiencia>();

  public pageSize = 5;
  public buttonCount = 2;
  public sizes = [10, 20, 50];

  private _subscriptions$ = new Subscription();

  constructor(
    private _modalService: NgbModal,
    private _alertaService: AlertaService,
    public activeModal: NgbActiveModal,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    //Provisional
    this.traerComboPostulante();
    this.traerComboAreaFormacionExperiencia();
    this.recargaDeDatos();
    this.traerListaPostulanteExperiencia();
    this.loadingTabla();
    //this.traerCentroDeEstudios();
  }

  ngOnDestroy(): void {
    this._subscriptions$.unsubscribe();
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

  traerListaPostulanteExperiencia() {
    const lista$ = this.datosPostulanteService
      .getPostulanteExperiencia()
      .subscribe({
        next: (data) => {
          this.gridPostulanteExperiencia.data = data;
          console.log("dAtosExperienciaaaaa", data)
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
        this.gridPostulanteExperiencia.loading = success;
      },
      error: (error) => {
        this._alertaService.mensajeError(error);
      },
    });
    this._subscriptions$.add(loading$);
  }

  recargaDeDatos() {
    this.datosPostulanteService.postulanteExperienciaInsertado$.subscribe(
      (success) => {
        if (success) {
          this.datosPostulanteService.ObtenerPostulanteExperiencia(
            this.postulante.idPostulante
          );
        }
      }
    );
  }

  //Función para llenar la columna de Nombre Empresa
  obtenerNombreEmpresaPorId(id: number) {
    const nombre = this.comboAreaFormacionExperiencia?.listaEmpresa.find(
      (element) => element.id === id
    );
    return nombre ? nombre.nombre : 'Seleccione Empresa';
  }

  //Función para llenar la columna de Cargo
  obtenerNombreCargoPorId(id: number) {
    const nombre = this.comboAreaFormacionExperiencia?.cargo.find(
      (element) => element.id === id
    );
    return nombre ? nombre.nombre : 'Seleccione Cargo';
  }

  //Función para llenar la columna de Area Trabajo
  obtenerNombreAreaTrabajoPorId(id: number) {
    const nombre = this.comboAreaFormacionExperiencia?.areaTrabajo.find(
      (element) => element.id === id
    );
    return nombre ? nombre.nombre : 'Seleccione Area';
  }

  //Función para llenar la columna de Tipo Industria
  obtenerNombreIndustriaPorId(id: number) {
    const nombre = this.comboAreaFormacionExperiencia?.industria.find(
      (element) => element.id === id
    );
    return nombre ? nombre.nombre : 'Seleccione Industria';
  }

  //Función para llenar la columna de Tipo Moneda
  obtenerNombreMonedaPorId(id: number) {
    const nombre = this.comboAreaFormacionExperiencia?.moneda.find(
      (element) => element.id === id
    );
    return nombre ? nombre.nombre : 'Seleccione Moneda';
  }

  abrirModalPostulanteExperiencia(tipoAccion: string): void;
  abrirModalPostulanteExperiencia(
    datosExperiencia: PostulanteExperiencia,
    tipoAccion: string
  ): void;

  abrirModalPostulanteExperiencia(
    parametroEditar: string | PostulanteExperiencia,
    parametroTipoAccion?: string
  ) {
    let datosExperiencia: PostulanteExperiencia | undefined;
    let tipoAccion: string;

    // Determinar los valores según los parámetros recibidos
    if (typeof parametroEditar === 'string') {
      tipoAccion = parametroEditar;
    } else {
      datosExperiencia = parametroEditar;
      tipoAccion = parametroTipoAccion!;
    }

    const modalRef = this._modalService.open(
      ModalPostulanteExperienciaComponent,
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

    if (datosExperiencia) {
      console.log("Datos de experiencia llegando",datosExperiencia);
      modalRef.componentInstance.datosExperiencia = datosExperiencia;
    }
    // console.log(`Modal abierto con tipo de acción: ${tipoAccion}`);
    // if (datosExperiencia) {
    //   console.log(`Datos de formación:`, datosExperiencia);
    // }
  }

  agregarNuevaExperiencia() {
    console.log('Creando una formacion postulante');
    this.abrirModalPostulanteExperiencia('Registrar');
  }

  editarPostulanteExperiencia(datosExperiencia: PostulanteExperiencia) {
    console.log('Editando una formacion postulante');
    this.abrirModalPostulanteExperiencia(datosExperiencia, 'Editar');
  }

  eliminarPostulanteExperiencia(id: number) {
    const usuario = this._userService.userData.userName;

    const JsonEliminar = {
      Id: id,
      NombreUsuario: usuario,
    };

    this._alertaService.mensajeEliminar().then((resultado) => {
      if (resultado.value) {
        console.log(`Se eliminara la formacion del postulante con id ${id}`);
        this.datosPostulanteService.EliminarPostulanteExperiencia(JsonEliminar);
        //this.recargaDeDatos();
      } else {
        console.log(`Ya no Se eliminara el postulante con id ${id}`);
      }
    });
  }

  abrirModuloEmpresa(context: any) {
    this._modalService.open(context, { size: 'xl', backdrop: 'static' });
  }

  ObtenerHistorialPostulanteExperiencia() {
    this.datosPostulanteService.ObtenerHistorialPostulanteExperiencia(
      this.postulante.idPostulante
    );
    const modalRef = this._modalService.open(
      ModalHistorialPostulanteExperienciaComponent,
      {
        size: 'xl',
      }
    );
    modalRef.componentInstance.datosPostulanteService =
      this.datosPostulanteService;
    modalRef.componentInstance.comboPostulante = this.comboPostulante;
  }
}

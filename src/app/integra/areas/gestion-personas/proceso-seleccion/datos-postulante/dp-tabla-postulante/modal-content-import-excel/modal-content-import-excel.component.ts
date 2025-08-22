import { formatDate } from '@angular/common';
import { FileRestrictions } from '@progress/kendo-angular-upload';
import { UserService } from '@shared/services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';
import {
  ComboPostulante,
  ListaCodigoConvocatorum,
  ListaPostulante,
  Mensaje,
  ResultadoImportacion,
} from '@gestionPersonas/models/DatosPostulante';
import { Subscription } from 'rxjs';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'app-modal-content-import-excel',
  templateUrl: './modal-content-import-excel.component.html',
  styleUrls: ['./modal-content-import-excel.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ModalContentImportExcelComponent implements OnInit {
  @Input() datosPostulanteService: DatosDelPostulanteService;

  comboPostulante: ComboPostulante;
  resultadoImportacion: ResultadoImportacion;
  ListaPostulantesParaInsercion: ListaPostulante[];

  importado = false;

  private _subscriptions$ = new Subscription();
  loadingPanelVisible = false;
  controlBotton = false;
  mensaje: Mensaje;

  codigoConvocatoriaFiltrado: ListaCodigoConvocatorum[] = [];
  estadoEtapaProcesoSeleccionFiltrado: any[] = [];

  filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'startsWith',
  };

  public myRestrictions: FileRestrictions = {
    allowedExtensions: ['.csv'],
  };

  FormImportExcel: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _alertaService: AlertaService,
    public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private _userService: UserService
  ) {}

  cargarFormulario() {
    this.FormImportExcel = this._formBuilder.group({
      files: [null, Validators.required],
      IdProcesoSeleccion: [null, Validators.required],
      IdProcesoSeleccionEtapa: [null, Validators.required],
      IdPersonalOperadorProceso: [null, Validators.required],
      IdPaginaReclutadoraPersonal: [null, Validators.required],
      IdConvocatoriaPersonal: [null, Validators.required],
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

  //Configuracion para los dropdown asociados a IdProcesoSeleccion
  configurarFiltroProcesoSeleccion() {
    this.FormImportExcel.get('IdProcesoSeleccionEtapa')?.disable();
    //Codigo Convocatoria
    this.FormImportExcel.get('IdConvocatoriaPersonal')?.disable();
    this.FormImportExcel.get('IdProcesoSeleccion')?.valueChanges.subscribe(
      (IdProcesoSeleccion: number) => {
        if (IdProcesoSeleccion) {
          //Etapa Proceso Seleccion hay etapas para cada diferente proceso selección
          this.estadoEtapaProcesoSeleccionFiltrado =
            this.comboPostulante.listaEtapasProcesoSeleccion.filter(
              (etapas) => etapas.idProcesoSeleccion === IdProcesoSeleccion
            );
          this.FormImportExcel.get('IdProcesoSeleccionEtapa')?.enable();

          //Codigo Convocatoria hay un codigo de convocatoria para cada proceso selección
          this.codigoConvocatoriaFiltrado =
            this.comboPostulante.listaCodigoConvocatoria.filter(
              (convocatoria) =>
                convocatoria.idProcesoSeleccion === IdProcesoSeleccion
            );
          this.FormImportExcel.get('IdConvocatoriaPersonal')?.enable();
          this.FormImportExcel.get('IdConvocatoriaPersonal')?.setValue(null);
        } else {
          this.codigoConvocatoriaFiltrado = [];
          this.FormImportExcel.get('IdConvocatoriaPersonal')?.setValue(null);
          this.FormImportExcel.get('IdConvocatoriaPersonal')?.disable();
        }
        this.cdr.detectChanges();
      }
    );
  }

  importarDeExcel() {
    this.habilitarTab();
    this.habilitarBTN();
    this.cargando();
    if (this.FormImportExcel.get('files')?.invalid) {
      this.FormImportExcel.get('files')?.markAllAsTouched;
      this._alertaService.mensajeWarning('Completa los campos requeridos');
    } else {
      this.habilitarBTN();
      const formData = new FormData();
      const files: FileList = this.FormImportExcel.get('files')?.value;

      Array.prototype.forEach.call(files, (file, File) => {
        formData.append('files', file);
      });
      this.datosPostulanteService.importarPostulantesExcel(formData);
      this.habilitarBTN();
    }
  }

  habilitarBTN() {
    const btn$ = this.datosPostulanteService.getBoton().subscribe({
      next: (data) => {
        this.controlBotton = data;
      },
    });
    this._subscriptions$.add(btn$);
  }

  cargando() {
    const loading$ = this.datosPostulanteService.getLoading().subscribe({
      next: (data) => {
        this.loadingPanelVisible = data;
      },
    });
    this._subscriptions$.add(loading$);
  }

  traerImportacion() {
    const datosImportacion$ = this.datosPostulanteService
      .getPostulanteImportacion()
      .subscribe({
        next: (data) => {
          this.resultadoImportacion = data;
          console.log(this.resultadoImportacion);
        },
      });
    this._subscriptions$.add(datosImportacion$);
  }

  habilitarTab() {
    const tab$ = this.datosPostulanteService.getHabilitarTab().subscribe({
      next: (data) => {
        this.importado = data;
      },
    });
    this._subscriptions$.add(tab$);
  }

  traerListaPostulantesParaInsercion() {
    const lista$ = this.datosPostulanteService
      .getPostulantesParaInsercionMasiva()
      .subscribe({
        next: (data) => {
          this.ListaPostulantesParaInsercion = data;
          console.log(this.ListaPostulantesParaInsercion)
        },
      });
  }

  insertarPostulantes(){
    this.habilitarTab();
    this.habilitarBTN();
    this.cargando();
    if (this.FormImportExcel.invalid) {
      this.FormImportExcel.markAllAsTouched();
      this._alertaService.mensajeWarning('Completa los campos requeridos');
    } else {
      this.habilitarBTN();
      const data = this.FormImportExcel.getRawValue();
      const usuario = this._userService.userData.userName;
      const JsonData = {
        listaPostulante: this.ListaPostulantesParaInsercion,
        ...data,
        Usuario: usuario
      }

      console.log(JsonData)
      this.datosPostulanteService.insertarPostulanteMasivamente(JsonData);
      this.habilitarBTN();
    }
  }

  cerrarModal() {
    this.activeModal.close();
  }

  ngOnInit(): void {
    this.traerImportacion();
    this.cargarFormulario();
    this.traerComboPostulante();
    this.configurarFiltroProcesoSeleccion();
    this.traerListaPostulantesParaInsercion();
    this.datosPostulanteService.postulanteInsertado$.subscribe((success) => {
      if (success) {
        this.cerrarModal();
        this.datosPostulanteService.postulanteInsertado$.next(false);
      }
    });
  }

  ngOnDestroy() {
    this._subscriptions$.unsubscribe();
  }
}

import {
  Component,
  inject,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  HttpErrorResponse,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IntegraService } from '@shared/services/integra.service';
import { constApiGestionPersonal } from '@environments/constApi';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { AlertaService } from '@shared/services/alerta.service';
import { PaisCombo } from '@integra/models/pais';
import { ComboCiudad } from '@integra/models/ciudad';
import { DatosDelPostulanteService } from '@gestionPersonas/services/datos-del-postulante.service';

interface CentroEstudio {
  id: number;
  nombre: string;
  idPais: number;
  pais: string;
  idCiudad: number;
  ciudad: string;
  idTipoCentroEstudio: number;
  tipoCentroEstudio: string;
}

interface CentroEstudioCombo {
  listaPais: PaisCombo[];
  listaCiudad: ComboCiudad[];
  listaTipoCentroEstudio: TipoCentroEstudio[];
}

interface TipoCentroEstudio {
  id: number;
  nombre: string;
}

enum FormAction {
  Crear = 'Crear',
  Actualizar = 'Actualizar',
}

@Component({
  selector: 'app-centro-estudio',
  templateUrl: './centro-estudio.component.html',
  styleUrls: ['./centro-estudio.component.scss'],
})

/**
 * @module GestionPersonasModule
 * @description Componente Centro Estudio para el Modulo Maestro 'Instituciones Educativas'
 * @author Juan Diego Huanaco Quispe
 * @version 1.0.0
 * @history
   08/04/2024 Implementación de CRUD básico
 */
export class CentroEstudioComponent implements OnInit {
  @ViewChild('modalCentroEstudio') modalCentroEstudio: any;
  @ViewChild('modalEliminar') modalEliminar: any;

  public get formActionEnum(): typeof FormAction {
    return FormAction;
  }

  comboData: CentroEstudioCombo;
  filtroListaCiudad: ComboCiudad[];
  dataParaEliminar: any;
  isDisabledComboCiudad = true;
  formAction: FormAction;

  paisSeleccionado(){
    this.formCentroEstudio.get('ciudad').reset()
    if(this.formCentroEstudio.get("pais").value === undefined){
      this.isDisabledComboCiudad = true;
    }else{
      this.filtroListaCiudad = this.comboData.listaCiudad.filter(x=>x.idPais == this.formCentroEstudio.get("pais").value.id);
      this.isDisabledComboCiudad = false;
    }
  }

  isPageLoading = false;

  formCentroEstudio: FormGroup = this._formBuilder.group({
    id: 0,
    nombre: [
      '',
      [
        Validators.required,
        Validators.maxLength(600),
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
    pais: [{}, [Validators.required]],
    ciudad: [{}, [Validators.required]],
    tipoCentroEstudio: [{}, [Validators.required]],
  });

  get nombreFormControl(): AbstractControl {
    return this.formCentroEstudio.get('nombre');
  }
  get paisFormControl(): AbstractControl {
    return this.formCentroEstudio.get('pais');
  }
  get ciudadFormControl(): AbstractControl {
    return this.formCentroEstudio.get('ciudad');
  }
  get tipoCentroEstudioFormControl(): AbstractControl {
    return this.formCentroEstudio.get('tipoCentroEstudio');
  }

  gridCentroEstudio: KendoGrid<CentroEstudio> = new KendoGrid<CentroEstudio>();

  cantidadItems: PageSizeItem[] = [
    { text: '5', value: 5 },
    { text: '10', value: 10 },
    { text: '15', value: 15 },
    { text: '20', value: 20 },
    { text: 'All', value: 'all' },
  ];

  constructor(
    private _integraService: IntegraService,
    private _modalService: NgbModal,
    private _formBuilder: FormBuilder,
    private _alertaService: AlertaService,
    private datosPostulanteService:DatosDelPostulanteService
  ) {}

  ngOnInit(): void {
    this.obtener();
    this.obtenerCombos();
    this.formCentroEstudio.reset();
  }

  obtener(): void {
    this.gridCentroEstudio.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerListaCentroEstudio)
      .subscribe({
        next: (resp: HttpResponse<CentroEstudio[]>) => {
          this.gridCentroEstudio.data = resp.body;
          this.gridCentroEstudio.loading = false;
        },
        error: (err) => {
          this.gridCentroEstudio.loading = false;
          this.gridCentroEstudio.data = null;
          this.mostrarMensajeError(err);
        },
      });
  }

  obtenerCombos(): void {
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerCombosCentroEstudio)
      .subscribe({
        next: (resp: HttpResponse<CentroEstudioCombo>) => {
          this.comboData = resp.body;
          this.filtroListaCiudad = this.comboData.listaCiudad;
        },
        error: (err) => {
          this.mostrarMensajeError(err);
        },
      });
  }

  abrirModalInsertar() {
    this.formAction = FormAction.Crear;
    this._modalService.open(this.modalCentroEstudio, {
      backdrop: 'static',
    });
  }

  abrirModalActualizar(dataItem: any) {
    this.formAction = FormAction.Actualizar;
    this._modalService.open(this.modalCentroEstudio, {
      backdrop: 'static',
    });
    this.formCentroEstudio.controls['id'].setValue(dataItem.id);
    this.formCentroEstudio.controls['nombre'].setValue(dataItem.nombre);
    this.formCentroEstudio.controls['pais'].setValue(
      this.comboData.listaPais.find((x) => x.id == dataItem.idPais)
    );
    this.isDisabledComboCiudad = false;
    this.filtroListaCiudad = this.comboData.listaCiudad.filter(
      (x) => x.idPais == dataItem.idPais
    );
    this.formCentroEstudio.controls['ciudad'].setValue(
      this.comboData.listaCiudad.find((x) => x.id == dataItem.idCiudad)
    );
    this.formCentroEstudio.controls['tipoCentroEstudio'].setValue(
      this.comboData.listaTipoCentroEstudio.find(
        (x) => x.id == dataItem.idTipoCentroEstudio
      )
    );
  }

  limpiarForm() {
    this.formCentroEstudio.reset();
    this.isDisabledComboCiudad = true;
  }

  private mostrarMensajeError(err: HttpErrorResponse) {
    let msgError = this._alertaService.getMessageErrorService(err);
    if (err.status == 0)
      msgError =
        'No pudimos conectarnos al servidor, revisa tu conexión a internet.';

    Swal.fire({
      title: 'Ocurrió un problema',
      text: msgError,
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: '#4C5FC0',
      confirmButtonText: 'Ok',
      allowOutsideClick: false,
    });
  }

  abrirModalEliminar(dataItem: CentroEstudio) {
    this.dataParaEliminar = dataItem;
    Swal.fire({
      title: 'Confirmación',
      html: `¿Seguro que quieres eliminar la formación <b>"${this.dataParaEliminar.nombre}"?</b>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarCentroEstudio();
      }
    });
  }

  private actualizarCentroEstudio(cerrarModalFunc: Function) {
    this.isPageLoading = true;

    this._integraService
      .putJsonResponse(constApiGestionPersonal.ActualizarCentroEstudio, {
        id: this.formCentroEstudio.controls['id'].value,
        nombre: this.formCentroEstudio.controls['nombre'].value,
        idPais: this.formCentroEstudio.controls['pais'].value.id,
        idCiudad: this.formCentroEstudio.controls['ciudad'].value.id,
        idTipoCentroEstudio:
          this.formCentroEstudio.controls['tipoCentroEstudio'].value.id,
      })
      .subscribe({
        next: (resp: HttpResponse<CentroEstudio>) => {
          this.isPageLoading = false;
          cerrarModalFunc();
          this.limpiarForm();
          this.obtener();
          this.mostrarMensajeExito('Registro actualizado exitosamente');
        },
        error: (err) => {
          this.isPageLoading = false;
          this.mostrarMensajeError(err);
        },
      });
  }

  private insertarCentroEstudio(cerrarModalFunc: Function) {
    this.isPageLoading = true;
    this.datosPostulanteService.setCentroEstudiosConfirmación(false);

    this._integraService
      .postJsonResponse(constApiGestionPersonal.InsertarCentroEstudio, {
        nombre: this.formCentroEstudio.controls['nombre'].value,
        idPais: this.formCentroEstudio.controls['pais'].value.id,
        idCiudad: this.formCentroEstudio.controls['ciudad'].value.id,
        idTipoCentroEstudio:
          this.formCentroEstudio.controls['tipoCentroEstudio'].value.id,
      })
      .subscribe({
        next: (resp: HttpResponse<CentroEstudio>) => {
          this.isPageLoading = false;
          cerrarModalFunc();
          this.limpiarForm();
          this.obtener();
          this.datosPostulanteService.setCentroEstudiosConfirmación(true);
          this.mostrarMensajeExito('Registro creado exitosamente');
        },
        error: (err) => {
          this.isPageLoading = false;
          this.mostrarMensajeError(err);
        },
      });
  }

  private mostrarMensajeExito(mensaje: string) {
    Swal.fire({
      text: mensaje,
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#4C5FC0',
      confirmButtonText: 'Ok',
      allowOutsideClick: true,
    });
  }

  private eliminarCentroEstudio() {
    this._integraService
      .deleteJsonResponse(
        `${constApiGestionPersonal.EliminarCentroEstudio}/${this.dataParaEliminar.id}`
      )
      .subscribe({
        next: (resp: HttpResponse<CentroEstudio>) => {
          this.obtener();
          this.obtenerCombos();
          this.mostrarMensajeExito('Registro eliminado exitosamente');
        },
        error: (err) => {
          this.mostrarMensajeError(err);
        },
      });
  }

  enviarFormulario(cerrarModalFunc: Function) {
    if (this.formCentroEstudio.invalid) {
      this.formCentroEstudio.markAllAsTouched();
      return;
    }
    if (this.formAction == FormAction.Crear)
      this.insertarCentroEstudio(cerrarModalFunc);
    else this.actualizarCentroEstudio(cerrarModalFunc);
  }

  headerStyle ={ 'background-color': '#4584a7', 'color': 'white'}

}

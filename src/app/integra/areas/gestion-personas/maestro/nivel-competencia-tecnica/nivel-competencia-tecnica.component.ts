import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KendoGrid } from '@shared/models/kendo-grid';
import { PageSizeItem } from '@progress/kendo-angular-grid';
import { IntegraService } from '@shared/services/integra.service';
import { constApiGestionPersonal } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { AlertaService } from '@shared/services/alerta.service';

interface NivelCompetenciaTecnica {
  id: number;
  nombre: string;
}

enum FormAction {
  Crear = "Crear",
  Actualizar = "Actualizar"
}

@Component({
  selector: 'app-nivel-competencia-tecnica',
  templateUrl: './nivel-competencia-tecnica.component.html',
  styleUrls: ['./nivel-competencia-tecnica.component.scss']
})

/**
 * @module GestionPersonasModule
 * @description Componente Nivel Competencia Tecnica para el Modulo Maestro 'Nivel Curso Complementario'
 * @author Juan Diego Huanaco Quispe
 * @version 1.0.0
 * @history
   06/04/2024 Implementación de CRUD básico
 */
export class NivelCompetenciaTecnicaComponent implements OnInit {

  

  @ViewChild('modalNivelCompetenciaTecnica') modalNivelCompetenciaTecnica: any;
  @ViewChild('modalEliminar') modalEliminar: any;

  public get formActionEnum(): typeof FormAction {
    return FormAction; 
  }

  dataParaEliminar: any;

  formAction: FormAction;

  isPageLoading = false;

  formNivelCompetenciaTecnica: FormGroup = this._formBuilder.group({
    id: 0,
    nombre: [
      '',
      [
        Validators.required,
        Validators.maxLength(50),
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ],
    ],
  });
  
  get nombreForm(): AbstractControl {
    return this.formNivelCompetenciaTecnica.get('nombre');
  }

  gridNivelCompetenciaTecnica: KendoGrid<NivelCompetenciaTecnica> = new KendoGrid<NivelCompetenciaTecnica>();

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
    private _alertaService: AlertaService
    ) {}



  ngOnInit(): void {  
    this.obtener();
  }
  obtener(): void {
    this.gridNivelCompetenciaTecnica.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerListaNivelCompetenciaTecnica)
      .subscribe({
        next: (resp: HttpResponse<NivelCompetenciaTecnica[]>) => {
          this.gridNivelCompetenciaTecnica.data = resp.body;
          this.gridNivelCompetenciaTecnica.loading = false;
        },
        error: (err) => {
          this.gridNivelCompetenciaTecnica.loading = false;
          this.gridNivelCompetenciaTecnica.data = null;
          this.mostrarMensajeError(err);
        },
      });
  }

  abrirModalInsertar(){
    this.formAction = FormAction.Crear;
    this._modalService.open(this.modalNivelCompetenciaTecnica, {
      backdrop: 'static',
    });
  }

  abrirModalActualizar(dataItem: any){
    this.formAction = FormAction.Actualizar;
    this._modalService.open(this.modalNivelCompetenciaTecnica, {
      backdrop: 'static'
    });
    this.formNivelCompetenciaTecnica.controls['id'].setValue(dataItem.id);
    this.formNivelCompetenciaTecnica.controls['nombre'].setValue(dataItem.nombre);
    
  }

  limpiarForm(){
    this.formNivelCompetenciaTecnica.reset();
    console.log('form limpiado');
  }

  private mostrarMensajeError(err: HttpErrorResponse){
    let msgError = this._alertaService.getMessageErrorService(err);
    if(err.status == 0)
      msgError = "No pudimos conectarnos al servidor, revisa tu conexión a internet.";

    Swal.fire({
      title: 'Ocurrió un problema',
      text: msgError,
      icon: 'error',
      showCancelButton: false,
      confirmButtonColor: '#4C5FC0',
      confirmButtonText: 'Ok',
      allowOutsideClick: false
    });
  }

  abrirModalEliminar(dataItem: NivelCompetenciaTecnica){
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
        this.eliminarNivelCompetenciaTecnica();
      }
    });
  }

  


  private actualizarNivelCompetenciaTecnica(cerrarModalFunc: Function){
    this.isPageLoading = true;
    
    this._integraService
      .putJsonResponse(constApiGestionPersonal.ActualizarNivelCompetenciaTecnica, 
        {
          id: this.formNivelCompetenciaTecnica.controls['id'].value,
          nombre: this.formNivelCompetenciaTecnica.controls['nombre'].value,
        })
      .subscribe({
        next: (resp: HttpResponse<NivelCompetenciaTecnica>) => {
          this.isPageLoading = false;
          cerrarModalFunc()
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

  private insertarNivelCompetenciaTecnica(cerrarModalFunc: Function){
    this.isPageLoading = true;
    
    this._integraService
      .postJsonResponse(constApiGestionPersonal.InsertarNivelCompetenciaTecnica, 
        {
          nombre: this.formNivelCompetenciaTecnica.controls['nombre'].value,
        })
      .subscribe({
        next: (resp: HttpResponse<NivelCompetenciaTecnica>) => {
          this.isPageLoading = false;
          cerrarModalFunc()
          this.limpiarForm();
          this.obtener();
          this.mostrarMensajeExito('Registro creado exitosamente');
        },
        error: (err) => {
          this.isPageLoading = false;
          this.mostrarMensajeError(err);
        },
      });
  }


  private mostrarMensajeExito(mensaje: string){
    Swal.fire({
      text: mensaje,
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#4C5FC0',
      confirmButtonText: 'Ok',
      allowOutsideClick: true
    });
  }

  private eliminarNivelCompetenciaTecnica(){

    this._integraService
      .deleteJsonResponse(`${constApiGestionPersonal.EliminarNivelCompetenciaTecnica}/${this.dataParaEliminar.id}`)
      .subscribe({
        next: (resp: HttpResponse<NivelCompetenciaTecnica>) => {
          this.obtener();
          this.mostrarMensajeExito('Registro eliminado exitosamente');
        },
        error: (err) => {
          this.mostrarMensajeError(err);
        },
      });
  }

  enviarFormulario(cerrarModalFunc: Function){
    if(this.formNivelCompetenciaTecnica.invalid) {
      this.formNivelCompetenciaTecnica.markAllAsTouched();
      return;
    }
    if(this.formAction == FormAction.Crear)
       this.insertarNivelCompetenciaTecnica(cerrarModalFunc)
    else
       this.actualizarNivelCompetenciaTecnica(cerrarModalFunc)
  }

  headerStyle ={ 'background-color': '#4584a7', 'color': 'white'}
}

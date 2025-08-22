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


interface GradoEstudio {
  id: number;
  nombre: string;
}

enum FormAction {
  Crear = "Crear",
  Actualizar = "Actualizar"
}

@Component({
  selector: 'app-grado-estudio',
  templateUrl: './grado-estudio.component.html',
  styleUrls: ['./grado-estudio.component.scss']
})

/**
 * @module GestionPersonasModule
 * @description Componente Grado Estudio para el Modulo Maestro 'Estado Formación'
 * @author Juan Diego Huanaco Quispe
 * @version 1.0.0
 * @history
   04/04/2024 Implementación de CRUD básico
 */
export class GradoEstudioComponent implements OnInit {

  @ViewChild('modalGradoEstudio') modalGradoEstudio: any;
  @ViewChild('modalEliminar') modalEliminar: any;

  public get formActionEnum(): typeof FormAction {
    return FormAction; 
  }

  dataParaEliminar: any;

  formAction: FormAction;

  isPageLoading = false;

  formGradoEstudio: FormGroup = this._formBuilder.group({
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
    return this.formGradoEstudio.get('nombre');
  }

  gridGradoEstudio: KendoGrid<GradoEstudio> = new KendoGrid<GradoEstudio>();

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
    this.gridGradoEstudio.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerListaGradoEstudio)
      .subscribe({
        next: (resp: HttpResponse<GradoEstudio[]>) => {
          this.gridGradoEstudio.data = resp.body;
          this.gridGradoEstudio.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.gridGradoEstudio.loading = false;
          this.gridGradoEstudio.data = null;
          this.mostrarMensajeError(err);
        },
      });
  }

  abrirModalInsertar(){
    this.formAction = FormAction.Crear;
    this._modalService.open(this.modalGradoEstudio, {
      backdrop: 'static',
    });
  }

  abrirModalActualizar(dataItem: any){
    this.formAction = FormAction.Actualizar;
    this._modalService.open(this.modalGradoEstudio, {
      backdrop: 'static'
    });
    this.formGradoEstudio.controls['id'].setValue(dataItem.id);
    this.formGradoEstudio.controls['nombre'].setValue(dataItem.nombre);
    
  }

  limpiarForm(){
    this.formGradoEstudio.reset();
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

  abrirModalEliminar(dataItem: GradoEstudio){
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
        this.eliminarGradoEstudio();
      }
    });
  }

  


  private actualizarGradoEstudio(cerrarModalFunc: Function){
    this.isPageLoading = true;
    
    this._integraService
      .putJsonResponse(constApiGestionPersonal.ActualizarGradoEstudio, 
        {
          id: this.formGradoEstudio.controls['id'].value,
          nombre: this.formGradoEstudio.controls['nombre'].value,
        })
      .subscribe({
        next: (resp: HttpResponse<GradoEstudio>) => {
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

  private insertarGradoEstudio(cerrarModalFunc: Function){
    this.isPageLoading = true;
    
    this._integraService
      .postJsonResponse(constApiGestionPersonal.InsertarGradoEstudio, 
        {
          nombre: this.formGradoEstudio.controls['nombre'].value,
        })
      .subscribe({
        next: (resp: HttpResponse<GradoEstudio>) => {
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

  private eliminarGradoEstudio(){

    this._integraService
      .deleteJsonResponse(`${constApiGestionPersonal.EliminarGradoEstudio}/${this.dataParaEliminar.id}`)
      .subscribe({
        next: (resp: HttpResponse<GradoEstudio>) => {
          this.obtener();
          this.mostrarMensajeExito('Registro eliminado exitosamente');
        },
        error: (err) => {
          this.mostrarMensajeError(err);
        },
      });
  }

  enviarFormulario(cerrarModalFunc: Function){
    if(this.formGradoEstudio.invalid) {
      this.formGradoEstudio.markAllAsTouched();
      return;
    }
    if(this.formAction == FormAction.Crear)
       this.insertarGradoEstudio(cerrarModalFunc)
    else
       this.actualizarGradoEstudio(cerrarModalFunc)
  }

  headerStyle ={ 'background-color': '#4584a7', 'color': 'white'}
}

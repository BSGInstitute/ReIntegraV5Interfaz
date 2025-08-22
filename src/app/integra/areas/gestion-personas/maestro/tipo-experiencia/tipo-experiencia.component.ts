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


  interface TipoExperiencia {
    id: number;
    nombre: string;
  }
  
  enum FormAction {
    Crear = "Crear",
    Actualizar = "Actualizar"
  }

@Component({
  selector: 'app-tipo-experiencia',
  templateUrl: './tipo-experiencia.component.html',
  styleUrls: ['./tipo-experiencia.component.scss']
})

/**
 * @module GestionPersonasModule
 * @description Componente Tipo Experiencia para el Modulo Maestro 'Tipo Experiencia'
 * @author Juan Diego Huanaco Quispe
 * @version 1.0.0
 * @history
   09/04/2024 Implementación de CRUD básico
 */
export class TipoExperienciaComponent implements OnInit {

  @ViewChild('modalTipoExperiencia') modalTipoExperiencia: any;
  @ViewChild('modalEliminar') modalEliminar: any;

  public get formActionEnum(): typeof FormAction {
    return FormAction; 
  }

  dataParaEliminar: any;

  formAction: FormAction;

  isPageLoading = false;

  formTipoExperiencia: FormGroup = this._formBuilder.group({
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
    return this.formTipoExperiencia.get('nombre');
  }

  gridTipoExperiencia: KendoGrid<TipoExperiencia> = new KendoGrid<TipoExperiencia>();

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
    this.gridTipoExperiencia.loading = true;
    this._integraService
      .getJsonResponse(constApiGestionPersonal.ObtenerListaTipoExperiencia)
      .subscribe({
        next: (resp: HttpResponse<TipoExperiencia[]>) => {
          this.gridTipoExperiencia.data = resp.body;
          this.gridTipoExperiencia.loading = false;
        },
        error: (err) => {
          this.gridTipoExperiencia.loading = false;
          this.gridTipoExperiencia.data = null;
          this.mostrarMensajeError(err);
        },
      });
  }

  abrirModalInsertar(){
    this.formAction = FormAction.Crear;
    this._modalService.open(this.modalTipoExperiencia, {
      backdrop: 'static',
    });
  }

  abrirModalActualizar(dataItem: any){
    this.formAction = FormAction.Actualizar;
    this._modalService.open(this.modalTipoExperiencia, {
      backdrop: 'static'
    });
    this.formTipoExperiencia.controls['id'].setValue(dataItem.id);
    this.formTipoExperiencia.controls['nombre'].setValue(dataItem.nombre);
    
  }

  limpiarForm(){
    this.formTipoExperiencia.reset();
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

  abrirModalEliminar(dataItem: TipoExperiencia){
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
        this.eliminarTipoExperiencia();
      }
    });
  }

  


  private actualizarTipoExperiencia(cerrarModalFunc: Function){
    this.isPageLoading = true;
    
    this._integraService
      .putJsonResponse(constApiGestionPersonal.ActualizarTipoExperiencia, 
        {
          id: this.formTipoExperiencia.controls['id'].value,
          nombre: this.formTipoExperiencia.controls['nombre'].value,
        })
      .subscribe({
        next: (resp: HttpResponse<TipoExperiencia>) => {
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

  private insertarTipoExperiencia(cerrarModalFunc: Function){
    this.isPageLoading = true;
    
    this._integraService
      .postJsonResponse(constApiGestionPersonal.InsertarTipoExperiencia, 
        {
          nombre: this.formTipoExperiencia.controls['nombre'].value,
        })
      .subscribe({
        next: (resp: HttpResponse<TipoExperiencia>) => {
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

  private eliminarTipoExperiencia(){

    this._integraService
      .deleteJsonResponse(`${constApiGestionPersonal.EliminarTipoExperiencia}/${this.dataParaEliminar.id}`)
      .subscribe({
        next: (resp: HttpResponse<TipoExperiencia>) => {
          this.obtener();
          this.mostrarMensajeExito('Registro eliminado exitosamente');
        },
        error: (err) => {
          this.mostrarMensajeError(err);
        },
      });
  }

  enviarFormulario(cerrarModalFunc: Function){
    if(this.formTipoExperiencia.invalid) {
      this.formTipoExperiencia.markAllAsTouched();
      return;
    }
    if(this.formAction == FormAction.Crear)
       this.insertarTipoExperiencia(cerrarModalFunc)
    else
       this.actualizarTipoExperiencia(cerrarModalFunc)
  }

  headerStyle = { 'background-color': '#4584a7', 'color': 'white'}
}

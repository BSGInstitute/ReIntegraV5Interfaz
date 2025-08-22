import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiGestionPersonal, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.scss']
})
export class ExperienciaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private finanzasService:FinanzasServiceService
  ) {}
  // Variables usadas en el componente ------------------------------------------------------------------
  @ViewChild('modalExperiencia') modalExperiencia: any;


  loaderGrid=false
  loaderModal=false
  nombreModal=""
  btnModal=""
  indexRow=0

  pageSizes: any = [5, 10, 20, 'All'];

  listaExperiencia:any[]=[]
  listaAreas:any[]=[]
  itemArea:any[]=[]

  formExperiencia= this.formBuilder.group({
    id:null,
    idAreaTrabajo:[null,Validators.required],
    nombre:[null,[
      Validators.required,
      TextValidator.noEndSpace,
      TextValidator.noStartSpace
    ]],
    
  });
  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.obtenerComboAreas()
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------
  ObtenerListaExperiencia(){
    this.loaderGrid=true
    this.integraService.obtenerTodo(constApiGestionPersonal.ObtenerComboExperiencia).subscribe({
      next: (response: HttpResponse<any[]>) => {
        response.body.forEach((e:any)=>{
          e.nombreArea = this.listaAreas.find(la=>la.id==e.idAreaTrabajo)==null?
          "":this.listaAreas.find(la=>la.id==e.idAreaTrabajo).nombre
        })
        this.listaExperiencia=response.body
        this.loaderGrid=false
        },
        error: (error) => {
          this.loaderGrid=false
          this.finanzasService.MensajeDeError(error,"OBtener Lista Experiencia");
        },
        complete: () => {
          
        },
    });
  }
  obtenerComboAreas(){
    this.integraService.getJsonResponse(constApiGestionPersonal.PersonalAreaTrabajoObtenerCombo).subscribe({
      next: (response: HttpResponse<
        {readonly id:number, 
        readonly nombre:string}[]>) => {
        this.listaAreas=response.body
        this.itemArea=response.body
        this.ObtenerListaExperiencia()
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,'Combo Areas');
        },
        complete: () => {},
    });
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------
  abrirModalExperiencia(isNew:boolean,dataItem?:any,rowIndex?:number){//abre el modal para Nuevo,Editar en la grilla principal
    this.indexRow=rowIndex
    this.formExperiencia.reset()
    this.btnModal="Guardar"
    this.nombreModal="Nuevo Registro de Experiencia"
    if(!isNew)
    {
      dataItem.idAreaTrabajo = this.listaAreas.find(la=>la.id==dataItem.idAreaTrabajo)==null?
      null:dataItem.idAreaTrabajo 
      this.nombreModal="Editar Registro de Experiencia"
      this.btnModal="Actualizar"
      this.formExperiencia.patchValue(dataItem)
    }
    this.modalService.open(this.modalExperiencia);
  }

  accionModal(){//Control de acciones del modal
    if(this.formExperiencia.valid){
      let dataForm = this.formExperiencia.getRawValue()
      this.loaderModal=true
      switch(this.btnModal)
      {
        case "Guardar":
          this.insertarExperiencia(dataForm)
          break;
        case "Actualizar":
          this.editarExperiencia(dataForm)
          break;
        default:
            break;
      }
    }
    else this.formExperiencia.markAllAsTouched()
    
  }
  msgEliminar(dataItem:any): void {//muestra el cuadro de dialogo para eliminar un registro
    Swal.fire({
      title: '¿Está seguro de querer eliminar este registro de Tipo de Experiencia?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarExperiencia(dataItem);
      }
    });
  }
  filtroArea(event:string){
    event= event.trim()
      if(event.length>=1)
        this.itemArea = this.listaAreas.filter(
          (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      else this.itemArea=this.listaAreas
  }
  //--------------------------------------------------------------------------------------------------------
  // Funcion para el control de GRIlla------------------------------------------------------------------
  gridControl(action:string,dataItem?:any,rowIndex?:any){// Funcion de control para la grilla principal
    switch(action){
      case 'add':
        this.abrirModalExperiencia(true)
        break;
      case 'update':
        this.abrirModalExperiencia(false,dataItem,rowIndex)
        break;
      case 'reload':
        this.ObtenerListaExperiencia()
        break;
      case 'delete':
        this.msgEliminar(dataItem)
        break;
    }
  }
  //--------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------
  insertarExperiencia(dataForm:any){
    dataForm.id=0
    this.integraService
      .postJsonResponse(
        `${constApiGestionPersonal.InsertarExperiencia}`,dataForm
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaExperiencia.unshift({
            id:response.body.id,
            nombre:dataForm.nombre,
            nombreArea:this.listaAreas.find(la=>la.id==dataForm.idAreaTrabajo).nombre,
            idAreaTrabajo:dataForm.idAreaTrabajo
          })
          this.listaExperiencia = this.listaExperiencia.slice()

          this.modalService.dismissAll(this.modalExperiencia)
          Swal.fire(
            '¡Guardado con éxito!',
            'El nuevo registro ha sido guardado.',
            'success'
          );
          this.loaderModal=false
        },
        error: (error) => {
          this.loaderModal=false
          this.finanzasService.MensajeDeError(error,"NUEVa experiencia")
          
        },
        complete: () => {},
      });
  }
  editarExperiencia(dataForm:any){
     this.integraService
      .putJsonResponse(
        `${constApiGestionPersonal.ActualizarExperiencia}`,dataForm
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaExperiencia = this.listaExperiencia.filter((e:any)=>e.id!==dataForm.id)
          this.listaExperiencia.unshift({
            id:response.body.id,
            nombre:dataForm.nombre,
            nombreArea:this.listaAreas.find(la=>la.id==dataForm.idAreaTrabajo).nombre,
            idAreaTrabajo:dataForm.idAreaTrabajo
          })
          this.listaExperiencia = this.listaExperiencia.slice()
          
          this.modalService.dismissAll(this.modalExperiencia)
          Swal.fire(
            '¡Guardado con éxito!',
            'El registro ha sido actualizado.',
            'success'
          );
          this.loaderModal=false
        },
        error: (error) => {
          this.loaderModal=false
          this.finanzasService.MensajeDeError(error,"actualizar experiencia")
          
        },
        complete: () => {},
      });
  }

  eliminarExperiencia(dataItem:any){
    this.loaderGrid=true
    this.integraService
    .deleteJsonResponse(
      constApiGestionPersonal.EliminarExperiencia+"/"+dataItem.id,
    )
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        this.loaderGrid=false
        if (response.body == true) {
          this.listaExperiencia = this.listaExperiencia.filter((e:any)=>e.id!==dataItem.id);
          Swal.fire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
        } else {
          Swal.fire(
            'Error!',
            'Ocurrio un problema al eliminar.',
            'warning'
          );
        }
      },
      error: (error) => {
        this.loaderGrid=false
        this.finanzasService.MensajeDeError(error,"ELIMINAR comprobante");
      },
      complete: () => {},
    });
  }
}

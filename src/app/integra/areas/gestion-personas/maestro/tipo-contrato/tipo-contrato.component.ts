import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { constApiGestionPersonal, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComboPaisDTO } from '@shared/models/combo';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-tipo-contrato',
  templateUrl: './tipo-contrato.component.html',
  styleUrls: ['./tipo-contrato.component.scss']
})
export class TipoContratoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private finanzasService:FinanzasServiceService
  ) {}
  // Variables usadas en el componente ------------------------------------------------------------------
  @ViewChild('modalContrato') modalContrato: any;


  loaderGrid=false
  loaderModal=false
  nombreModal=""
  btnModal=""
  indexRow=0

  pageSizes: any = [5, 10, 20, 'All'];

  listaContrato:any[]=[]
  listaPais:ComboPaisDTO[]=[]
  itemPais:ComboPaisDTO[]=[]

  formTipoContrato= this.formBuilder.group({
    id:null,
    idPais:[null,Validators.required],
    comentario:[null,[
      Validators.required,
      TextValidator.noEndSpace,
      TextValidator.noStartSpace
    ]], 
    nombre:[null,[
      Validators.required,
      TextValidator.noEndSpace,
      TextValidator.noStartSpace
    ]],
    
  });
  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.obtenerComboPais()
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------
  ObtenerListaContrato(){
    this.loaderGrid=true
    this.integraService.obtenerTodo(constApiGestionPersonal.ObtenerListaTipoContrato).subscribe({
      next: (response: HttpResponse<any[]>) => {
        response.body.forEach((e:any)=>{
          e.nombrePais = this.listaPais.find(la=>la.id==e.idPais)==null?
          "":this.listaPais.find(la=>la.id==e.idPais).nombrePais
        })
        this.listaContrato=response.body
        this.loaderGrid=false
        },
        error: (error) => {
          this.loaderGrid=false
          this.finanzasService.MensajeDeError(error,"OBtener Lista Contrato");
        },
        complete: () => {
          
        },
    });
  }
  obtenerComboPais(){
    this.integraService.getJsonResponse(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (response: HttpResponse<ComboPaisDTO[]>) => {
        this.listaPais=response.body
        this.itemPais=response.body
        this.ObtenerListaContrato()
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
  abrirModalContrato(isNew:boolean,dataItem?:any,rowIndex?:number){//abre el modal para Nuevo,Editar en la grilla principal
    this.indexRow=rowIndex
    this.formTipoContrato.reset()
    this.btnModal="Guardar"
    this.nombreModal="Nuevo Registro de Contrato"
    if(!isNew)
    {
      dataItem.idPais = this.listaPais.find(la=>la.id==dataItem.idPais)==null?
      null:dataItem.idPais 
      this.nombreModal="Editar Registro de Contrato"
      this.btnModal="Actualizar"
      this.formTipoContrato.patchValue(dataItem)
    }
    this.modalService.open(this.modalContrato);
  }

  accionModal(){//Control de acciones del modal
    if(this.formTipoContrato.valid){
      let dataForm = this.formTipoContrato.getRawValue()
      this.loaderModal=true
      switch(this.btnModal)
      {
        case "Guardar":
          this.insertarContrato(dataForm)
          break;
        case "Actualizar":
          this.editarContrato(dataForm)
          break;
        default:
            break;
      }
    }
    else this.formTipoContrato.markAllAsTouched()
    
  }
  msgEliminar(dataItem:any): void {//muestra el cuadro de dialogo para eliminar un registro
    Swal.fire({
      title: '¿Está seguro de querer eliminar este registro de Tipo de Contrato?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarContrato(dataItem);
      }
    });
  }
  filtroPais(event:string){
    event= event.trim()
      if(event.length>=1)
        this.itemPais = this.listaPais.filter(
          (s) => s.nombrePais.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      else this.itemPais=this.listaPais
  }
  //--------------------------------------------------------------------------------------------------------
  // Funcion para el control de GRIlla------------------------------------------------------------------
  gridControl(action:string,dataItem?:any,rowIndex?:any){// Funcion de control para la grilla principal
    switch(action){
      case 'add':
        this.abrirModalContrato(true)
        break;
      case 'update':
        this.abrirModalContrato(false,dataItem,rowIndex)
        break;
      case 'reload':
        this.ObtenerListaContrato()
        break;
      case 'delete':
        this.msgEliminar(dataItem)
        break;
    }
  }
  //--------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------
  insertarContrato(dataForm:any){
    dataForm.id=0
    this.integraService
      .postJsonResponse(
        `${constApiGestionPersonal.InsertarTipoContrato}`,dataForm
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaContrato.unshift({
            id:response.body.id,
            nombre:dataForm.nombre,
            comentario:dataForm.comentario,
            nombrePais:this.listaPais.find(la=>la.id==dataForm.idPais).nombrePais,
            idPais:dataForm.idPais
          })
          this.listaContrato = this.listaContrato.slice()

          this.modalService.dismissAll(this.modalContrato)
          Swal.fire(
            '¡Guardado con éxito!',
            'El nuevo registro ha sido guardado.',
            'success'
          );
          this.loaderModal=false
        },
        error: (error) => {
          this.loaderModal=false
          this.finanzasService.MensajeDeError(error,"NUEVa Contrato")
          
        },
        complete: () => {},
      });
  }
  editarContrato(dataForm:any){
     this.integraService
      .putJsonResponse(
        `${constApiGestionPersonal.ActualizarTipoContrato}`,dataForm
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaContrato = this.listaContrato.filter((e:any)=>e.id!==dataForm.id)
          this.listaContrato.unshift({
            id:response.body.id,
            nombre:dataForm.nombre,
            comentario:dataForm.comentario,
            nombrePais:this.listaPais.find(la=>la.id==dataForm.idPais).nombrePais,
            idPais:dataForm.idPais
          })
          this.listaContrato = this.listaContrato.slice()
          
          this.modalService.dismissAll(this.modalContrato)
          Swal.fire(
            '¡Guardado con éxito!',
            'El registro ha sido actualizado.',
            'success'
          );
          this.loaderModal=false
        },
        error: (error) => {
          this.loaderModal=false
          this.finanzasService.MensajeDeError(error,"actualizar Contrato")
          
        },
        complete: () => {},
      });
  }

  eliminarContrato(dataItem:any){
    this.loaderGrid=true
    this.integraService
    .deleteJsonResponse(
      constApiGestionPersonal.EliminarTipoContrato+"/"+dataItem.id,
    )
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        this.loaderGrid=false
        if (response.body == true) {
          this.listaContrato = this.listaContrato.filter((e:any)=>e.id!==dataItem.id);
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


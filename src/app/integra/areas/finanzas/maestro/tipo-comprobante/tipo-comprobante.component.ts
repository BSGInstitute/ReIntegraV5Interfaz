import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { PaisCombo } from '@integra/models/pais';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-comprobante',
  templateUrl: './tipo-comprobante.component.html',
  styleUrls: ['./tipo-comprobante.component.scss']
})
export class TipoComprobanteComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    private finanzasService:FinanzasServiceService
  ) {}

  // Variables usadas en el componente ------------------------------------------------------------------
  @ViewChild('modalComprobantePago') modalComprobantePago: any;

  listaComprobantes:any
  loaderComprobante=false
  loaderModal=false
  nombreModal=""
  btnModal=""
  indexRow=0
  pageSizes: any = [5, 10, 20, 'All'];
  listaPais :PaisCombo[]=[]
  
  formComprobante= this.formBuilder.group({
    id:'',
    idPais:[null,Validators.required],
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
  obtenerComboPais(){//obtiene los paises para combo
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (response: HttpResponse<PaisCombo[]>) => {
        this.listaPais=response.body
        this.ObtenerListaComprobante()
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"combo país");
        },
        complete: () => {
          
        },
    });
  }

  ObtenerListaComprobante(){//obtiene datos de los comprobantes
    this.loaderComprobante=true
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerListaTipoComprobante}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loaderComprobante=false
          this.listaComprobantes=response.body;
        },
        error: (error) => {
          this.loaderComprobante=false
          this.finanzasService.MensajeDeError(error,"data comprobante de pago")
        },
        complete: () => {},
      });
    }
  //------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------
    paisTemplate(idpais:any)// obtiene el nombre del periodo para el mostrado en la grilla
    {
      if(typeof idpais=="number")
      {
        return this.listaPais.find((e:any)=>e.id==idpais).nombrePais
      }
      else return "Sin pais"
    }
    
  //------------------------------------------------------------------------------------------------------
    
  // Funciones para el control de Interfaz ------------------------------------------------------------------

  abrirModalComprobante(isNew:boolean,dataItem?:any,rowIndex?:number){//abre el modal para Nuevo,Editar en la grilla principal
    this.indexRow=rowIndex
    this.formComprobante.reset()
    this.btnModal="Guardar"
    this.nombreModal="Nuevo Comprobante de Pago"
    if(!isNew)
    {
      this.nombreModal="Editar Comprobante de Pago"
      this.btnModal="Actualizar"
      this.formComprobante.patchValue(dataItem)
    }
    this.modalService.open(this.modalComprobantePago);
  }
  getErrorMessage(controlName: string): string {//Mensajes de error para los Campos del formulario
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese el nombre del comprobante, es necesario!',
        noStartSpace: 'El nombre del comprobante no puede empezar con espacio',
        noEndSpace: 'El nombre del comprobante no puede terminar con espacio'
      },
      
    };
    let formControl: FormControl = this.formComprobante.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }
    return null;
  }
  validForm(): boolean {//Activa los errores segun el formulario sea invalido/valido
    if(this.formComprobante.invalid){
      this.formComprobante.markAllAsTouched();
      return false;
    }
    return true;
  }
  accionModal(){//Control de acciones del modal
    switch(this.btnModal)
    {
      case "Guardar":
        this.nuevoComprobante()
        break;
      case "Actualizar":
        this.editarComprobante()
        break;
      default:
          break;
    }
  }
  msgEliminar(dataItem:any): void {//muestra el cuadro de dialogo para eliminar un registro
    Swal.fire({
      title: '¿Está seguro de querer eliminar este registro de Tipo Comprobante de Pago?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarComprobante(dataItem);
      }
    });
  }
  //--------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------
  
  nuevoComprobante(){//Guarda el nuevo comprobante de pago
    if(this.validForm())
    {
      this.loaderModal=true
      let dataForm = this.formComprobante.getRawValue();
      dataForm.id=0
      dataForm.usuario="userName"
      this.integraService
        .postJsonResponse(
          `${constApiFinanzas.InsertarTipoComprobantePago}`,dataForm
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.ObtenerListaComprobante()
            this.modalService.dismissAll(this.modalComprobantePago)
            this.alertService.swalFire(
              '¡Guardado con éxito!',
              'El nuevo registro ha sido guardado.',
              'success'
            );
            this.loaderModal=false
          },
          error: (error) => {
            this.loaderModal=false
            this.finanzasService.MensajeDeError(error,"NUEVO comprobante")
            
          },
          complete: () => {},
        });
    }
  }

  editarComprobante(){//actualiza el nuevo comprobante de pago
    if(this.validForm())
    {
      this.loaderModal=true
      let dataForm = this.formComprobante.getRawValue();
      dataForm.usuario="userName"
      this.integraService
        .putJsonResponse(
          `${constApiFinanzas.ActualizarTipoComprobantePago}`,dataForm
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.listaComprobantes[this.indexRow].nombre = dataForm.nombre
            this.listaComprobantes[this.indexRow].idPais = dataForm.idPais
            this.modalService.dismissAll(this.modalComprobantePago)
            this.alertService.swalFire(
              '¡Guardado con éxito!',
              'El registro ha sido midificado.',
              'success'
            );
            this.loaderModal=false
          },
          error: (error) => {
            this.loaderModal=false
            this.finanzasService.MensajeDeError(error,"Actualizar comprobante")
            
          },
          complete: () => {},
        });
    }
  }
  eliminarComprobante(dataItem:any){
    this.loaderComprobante=true
    this.integraService
    .deleteJsonResponse(
      constApiFinanzas.EliminarTipoComprobantePago+"/"+dataItem.id+"/"+"userName",
    )
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        this.loaderComprobante=false
        if (response.body == true) {
          this.listaComprobantes = this.listaComprobantes.filter((e:any)=>e.id!==dataItem.id);
          this.alertService.swalFire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
        } else {
          this.alertService.swalFire(
            'Error!',
            'Ocurrio un problema al eliminar.',
            'warning'
          );
        }
      },
      error: (error) => {
        this.loaderComprobante=false
        this.finanzasService.MensajeDeError(error,"ELIMINAR comprobante");
      },
      complete: () => {},
    });
  }
  
  //--------------------------------------------------------------------------------------------------------

  // Funcion para el control de GRIlla------------------------------------------------------------------
  gridControl(action:string,dataItem?:any,rowIndex?:any){// Funcion de control para la grilla principal
    switch(action){
      case 'add':
        this.abrirModalComprobante(true)
        break;
      case 'update':
        this.abrirModalComprobante(false,dataItem,rowIndex)
        break;
      case 'reload':
        this.ObtenerListaComprobante()
        break;
      case 'delete':
        this.msgEliminar(dataItem)
        break;
    }
  }
  //------------------------------------------------------------------------------------------------------------------------------------

}

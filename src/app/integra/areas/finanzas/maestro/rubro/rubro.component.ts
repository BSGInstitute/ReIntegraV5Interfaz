import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { constApi,constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { State } from '@progress/kendo-data-query';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rubro',
  templateUrl: './rubro.component.html',
  styleUrls: ['./rubro.component.scss']
})
export class RubroComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    private finanzasService:FinanzasServiceService
  ) {}

  // Variables usadas en el componente ------------------------------------------------------------------
  @ViewChild('modalRubro') modalRubro: any;

  listaRubro:any[]=[]
  loaderRubro=false
  loaderModal=false
  nombreModal=""
  btnModal=""
  indexRow=0
  pageSizes: any = [5, 10, 20, 'All'];

  formRubro= this.formBuilder.group({
    id:'',
    nombre:[null,[
      Validators.required,
      TextValidator.noEndSpace,
      TextValidator.noStartSpace
    ]],
    descripcion:[null,[
      Validators.required,
      TextValidator.noEndSpace,
      TextValidator.noStartSpace
    ]],

  });

  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal

  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.ObtenerRubros();
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------


  ObtenerRubros(){//obtiene datos de los Rubros
    this.loaderRubro=true
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerListaRubro}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loaderRubro=false
          this.listaRubro=response.body;
        },
        error: (error) => {
          this.loaderRubro=false
          this.finanzasService.MensajeDeError(error,"data Rubro de pago")
        },
        complete: () => {},
      });
    }

  //------------------------------------------------------------------------------------------------------

  // Funciones para el control de Interfaz ------------------------------------------------------------------

  abrirModalRubro(isNew:boolean,dataItem?:any,rowIndex?:number){//abre el modal para Nuevo,Editar en la grilla principal
    this.indexRow=rowIndex
    this.formRubro.reset()
    this.btnModal="Guardar"
    this.nombreModal="Nuevo Rubro"
    if(!isNew)
    {
      this.nombreModal="Editar Rubro"
      this.btnModal="Actualizar"
      this.formRubro.patchValue(dataItem)
    }
    this.modalService.open(this.modalRubro);
  }
  getErrorMessage(controlName: string): string {//Mensajes de error para los Campos del formulario
    let erroMsj: any = {
      nombre: {
        required: 'Ingrese el nombre del Rubro, es necesario!',
        noStartSpace: 'El nombre del Rubro no puede empezar con espacio',
        noEndSpace: 'El nombre del Rubro no puede terminar con espacio'
      },
      descripcion: {
        required: 'Ingrese la descripcion del Rubro, es necesario!',
        noStartSpace: 'La descripcion del Rubro no puede empezar con espacio',
        noEndSpace: 'La descripcion del Rubro no puede terminar con espacio'
      },
    };
    let formControl: FormControl = this.formRubro.get(controlName) as FormControl;
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
    if(this.formRubro.invalid){
      this.formRubro.markAllAsTouched();
      return false;
    }
    return true;
  }
  accionModal(){//Control de acciones del modal
    switch(this.btnModal)
    {
      case "Guardar":
        this.nuevoRubro()
        break;
      case "Actualizar":
        this.editarRubro()
        break;
      default:
          break;
    }
  }
  msgEliminar(dataItem:any): void {//muestra el cuadro de dialogo para eliminar un registro
    Swal.fire({
      title: '¿Está seguro de querer eliminar este registro Rubro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarRubro(dataItem);
      }
    });
  }
  //--------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------

  nuevoRubro(){//Guarda el nuevo Rubro de pago
    if(this.validForm())
    {
      this.loaderModal=true
      let dataForm = this.formRubro.getRawValue();
      this.integraService
        .postJsonResponse(
          `${constApiFinanzas.InsertarRubro}`,dataForm
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.ObtenerRubros()
            this.modalService.dismissAll(this.modalRubro)
            this.alertService.swalFire(
              '¡Guardado con éxito!',
              'El nuevo registro ha sido guardado.',
              'success'
            );
            this.loaderModal=false
          },
          error: (error) => {
            this.loaderModal=false
            this.finanzasService.MensajeDeError(error,"NUEVO Rubro")

          },
          complete: () => {},
        });
    }
  }

  editarRubro(){//actualiza el nuevo Rubro de pago
    if(this.validForm())
    {
      this.loaderModal=true
      let dataForm = this.formRubro.getRawValue();
      this.integraService
        .putJsonResponse(
          `${constApiFinanzas.ActualizarRubro}`,dataForm
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.ObtenerRubros()
            this.modalService.dismissAll(this.modalRubro)
            this.alertService.swalFire(
              '¡Guardado con éxito!',
              'El registro ha sido midificado.',
              'success'
            );
            this.loaderModal=false
          },
          error: (error) => {
            this.loaderModal=false
            this.finanzasService.MensajeDeError(error,"Actualizar Rubro")

          },
          complete: () => {},
        });
    }
  }
  eliminarRubro(dataItem:any){
    this.loaderRubro=true
    this.integraService
    .deleteJsonResponse(
      constApiFinanzas.EliminarRubro+"/"+dataItem.id,
    )
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        this.loaderRubro=false
        if (response.body == true) {
          this.listaRubro = this.listaRubro.filter((e:any)=>e.id!==dataItem.id);
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
        this.loaderRubro=false
        this.finanzasService.MensajeDeError(error,"ELIMINAR Rubro");
      },
      complete: () => {},
    });
  }

  //--------------------------------------------------------------------------------------------------------

  // Funcion para el control de GRIlla------------------------------------------------------------------
  gridControl(action:string,dataItem?:any,rowIndex?:any){// Funcion de control para la grilla principal
    switch(action){
      case 'add':
        this.abrirModalRubro(true)
        break;
      case 'update':
        this.abrirModalRubro(false,dataItem,rowIndex)
        break;
      case 'reload':
        this.ObtenerRubros()
        break;
      case 'delete':
        this.msgEliminar(dataItem)
        break;
    }
  }
  gridState: State = {
    sort: [
      {
        field: 'id',
        dir: 'desc', 
      },
    ],
  };
  //------------------------------------------------------------------------------------------------------------------------------------

}

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApiFinanzas, constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { CajaCombo } from '@integra/models/caja';
import { MonedaCombo } from '@integra/models/moneda';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-solicitud-efectivo',
  templateUrl: './solicitud-efectivo.component.html',
  styleUrls: ['./solicitud-efectivo.component.scss']
})
export class SolicitudEfectivoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private finanzasService:FinanzasServiceService,
    private userService: UserService,
    private alertService:AlertaService,
  ) {}
  // Variables usadas en el componente ------------------------------------------------------------------
  @ViewChild('modalSolicitud') modalSolicitud: any;
  @ViewChild('modalMontosTotales') modalMontosTotales: any;
  loaderSolicitud=false
  montoEnvioTotal=0
  furTemp:any
  listaSeleccion:any[]=[]
  loaderModalSolicitud=false
  nombreModal=""
  btnModal = ""
  listaMoneda :MonedaCombo[]=[]
  listaResponsable:CajaCombo[]=[]
  listaMontosTotales:{
    idMoneda:number,
    nombreMoneda:string,
    total:number
  }[]=[]
  listaFur:any[]=[];
  maxlength:number = 250;
  charachtersCount:number=0;
  counter:string;
  limitFUR=0
  valueMonto=0
  listaSolicitud:any
  dataUsuario:any
  usuario = JSON.parse(localStorage.getItem('userData'))
  //this.usuario.userName
  //this.usuario.areaTrabajo
  //this.usuario.idRol
  //this.usuario.idPersonal
  formSolicitud :FormGroup = this.formBuilder.group({
    id: [0],
    nombrePersonalSolicitante:['',[Validators.required]],
    idPersonalResponsable:['',[Validators.required]],
    fechaEntregaNueva:['',[Validators.required]],
    idFur:['',[Validators.required]],
    descripcion:['',[Validators.required]],
    totalEfectivo:['',[Validators.required]],
    idMoneda:['',[Validators.required]],
  });

  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.loaderSolicitud=true
    this.userService.dataPersonal$.subscribe({
      next: (response) => {
        if(response != null){
         console.log("USUARIO : ",response,this.usuario)
         this.dataUsuario = response.datosPersonal
         this.obtenerComboMoneda()
         this.obtenerCajaResponsable()
         this.ObtenerCajasPorRendirSolitudEfectivo(this.dataUsuario.id)
        }
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"USUARIO INVALIDO")
      },
    })
    
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------
  ObtenerCajasPorRendirSolitudEfectivo(IdUsuario:number){//obtiene datos para la grilla solicitud PR
    this.loaderSolicitud= true;
      this.integraService
        .getJsonResponse(
          constApiFinanzas.ObtenerCajasPorRendirSolitudEfectivo+"/"+IdUsuario
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log("DATOS PR : ",response.body)
            this.loaderSolicitud= false;
            this.listaSolicitud=response.body
          },
          error: (error) => {
            this.loaderSolicitud= false;
            this.finanzasService.MensajeDeError(error,"DATA SOLICITUD")
          },
          complete: () => {},
        });
  }
  obtenerComboMoneda(){//Obtiene el combo de monedas
    this.integraService.obtenerTodo(constApiGlobal.MonedaObtenerCombo).subscribe({
      next: (response: HttpResponse<MonedaCombo[]>) => {
        this.listaMoneda=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENERA COMBO MONEDA");
        },
        complete: () => {},
    });
  }
  obtenerCajaResponsable(){//Obtiene el combo de responsalbes de caja
    this.integraService.obtenerTodo(constApiFinanzas.CajaObtenerResponsable).subscribe({
      next: (response: HttpResponse<CajaCombo[]>) => {
        console.log("REPONSABLE :", response.body)
        this.listaResponsable=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENERA COMBO RESPOnsable de caja");
        },
        complete: () => {},
    });
  }
  ObtenerDatosFurSolicitudEfectivo(fur:string){//Obtiene el combo de FURS
    this.integraService
    .getJsonResponse(
      `${constApiFinanzas.ObtenerDatosFurSolicitudEfectivo}`+"/"+fur
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log("FUR : ",response.body)
        this.listaFur=response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"MODAL - OBTENER FUR")
      },
      complete: () => {},
    });
  }
  ObtenerFURmontoLimite(idfur:number){//obtiene el monto limite del fur
    this.loaderModalSolicitud=true
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.CajaPorRendirObtenerLimiteFurSolicitud}`+"/"+idfur
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if(response.body<=0)
          { 
            Swal.fire(
              "!Advertencia¡",
              "Este FUR ya ha sido rendido en su totalidad!",
              "warning"
            )
          }
          this.limitFUR=response.body
          this.valueMonto=response.body
          this.formSolicitud.get('idMoneda').setValue(this.furTemp.idMonedaPagoReal)
          this.formSolicitud.get('descripcion').setValue(this.furTemp.detalle)
          this.formSolicitud.get('totalEfectivo').setValue(response.body)
          this.loaderModalSolicitud=false
        },
        error: (error) => {
          this.loaderModalSolicitud=false
          this.finanzasService.MensajeDeError(error,"MODAL - OBTENER MONTO LIMITE FUR")
        },
        complete: () => {},
      });
  }
  ParaEditObtenerFURmontoLimite(data:any){//obtiene el monto limite del fur
    this.loaderModalSolicitud=true
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.CajaPorRendirObtenerLimiteFurSolicitud}`+"/"+data.idFur
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response.body)
          this.limitFUR=response.body
          this.valueMonto=data.totalEfectivo
          this.loaderModalSolicitud=false
        },
        error: (error) => {
          this.loaderModalSolicitud=false
          this.finanzasService.MensajeDeError(error,"MODAL - OBTENER MONTO LIMITE FUR")
        },
        complete: () => {},
      });
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones Template ---------------------------------------------------------------------------------
  fechaTemplate(fecha:any)// obtiene la fecha formateada para el mostrado en la grilla
   {
     if(typeof fecha=="string")
     {
       return datePipeTransform(new Date(fecha),'dd-MM-yyyy', 'en-US')
     }
     else if(fecha!=null || fecha!=undefined)
     {
       return datePipeTransform(fecha,'dd-MM-yyyy', 'en-US')
     }
     else return fecha
  }
  //--------------------------------------------------------------------------------------------------------

  // Funciones para el control de Interfaz ------------------------------------------------------------------
  accionModal(){//acciones del modal Soliciutd Editar/Nuevo
    switch(this.btnModal)
    {
      case 'Actualizar':
        this.actualizarSolicitud()
        break;
      case 'Guardar':
        this.insertarNuevaSolicitud()
        break;
      default:
        break
    }
  }
  validForm(): boolean {//Activa los errores segun el formulario sea invalido/valido
    if(this.formSolicitud.invalid){
      this.formSolicitud.markAllAsTouched();
      return false;
    }
    return true;
  }
  BuscarFur(event:string){//Buscar el fur po codigo
    event = event.trim()
    if(event.length>5){
      this. ObtenerDatosFurSolicitudEfectivo(event)
    }
  }
  ObtenerDatosFUR(data:any){//llena los mas inputs del Comprobante
    console.log("OBTENER DATOS FUR",data)
    if(typeof data.id=="number")
    {
      this.furTemp=data
      this.ObtenerFURmontoLimite(data.id)
      this.onValueChange(data.detalle)
    }
  }

  onValueChange(ev: string): void {//evento del TExtArea para mostar cantidad de caracteres
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }
  abrilModalMontosTotales(){
    this.procesarDataTotales()
    this.modalService.open(this.modalMontosTotales)
  }

  abrirModalDetallePR(isNew:boolean,data?:any,){//abre el modal Crear/Editar Solicitud
    this.listaFur=[]
    this.formSolicitud.reset()
    this.formSolicitud.get('nombrePersonalSolicitante').setValue(this.dataUsuario.apellidos +", "+ this.dataUsuario.nombres)
    this.onValueChange("")
    this.btnModal="Guardar"
    this.nombreModal="Nueva Solicitud de Efectivo"
    if(!isNew)
    {
      var furAntiguo={
        id:data.idFur,
        codigo:data.codigoFur
      }
      this.listaFur.push(furAntiguo)
      // this.ObtenerDatosFurSolicitudEfectivo(data.codigoFur)
      this.ParaEditObtenerFURmontoLimite(data)
      this.onValueChange(data.descripcion)
      this.formSolicitud.get('fechaEntregaNueva').setValue(new Date(data.fechaEntregaEfectivo))
      this.formSolicitud.patchValue(data)
      this.btnModal="Actualizar"
      this.nombreModal="Editar Solicitud de Efectivo"
    }
    this.modalService.open(this.modalSolicitud);
  }
  msgEliminar(dataItem:any): void {//muestra el cuadro de dialogo para eliminar un registro
    Swal.fire({
      title: '¿Está seguro de querer eliminar este registro de Solicitud?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarSolicitud(dataItem);
      }
    });
  }

  msgEnviarSolicitud(): void {//muestra el cuadro de dialogo para eliminar un registro
    Swal.fire({
      title: '¿Está seguro de querer enviar los registros de Solicitud seleccionados?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Continuar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.enviarSolicitud()
      }
    });
  }

  limpiarSeleccion(){//Limpia la seleccion de Solicitudes
    this.listaSeleccion=[]
  }

  iniciarEnviarSolicitud(){//Inicia el proceso de Envio de Solicitud
    if(this.listaSeleccion.length>0)
    {
      this.msgEnviarSolicitud()
    }
    else{
      this.alertService.swalFire(
        "!Sin registros a enviar¡",
        "No se han seleccionado los registros a enviar, selecciona"+
        " uno o más registros de solicitudes",
        "warning"
      )
    }
  }

  procesarDataTotales(){
    this.listaMontosTotales=[]
    this.listaSolicitud.forEach((e:any) => {
      var index = this.listaMontosTotales.findIndex((data) => data.idMoneda === e.idMoneda);
      if(index==-1)
      {
        let nuevo={
          idMoneda:e.idMoneda,
          nombreMoneda:e.nombreMoneda,
          total:e.totalEfectivo
        }
        this.listaMontosTotales.push(nuevo)
      }
      else{
        let total= this.listaMontosTotales[index].total
        total = total + e.totalEfectivo
        this.listaMontosTotales[index].total =total
      }
    });
  }

  //--------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------

  insertarNuevaSolicitud(){// Crea una nueva solicitud
    if(this.validForm())
    {
      this.loaderModalSolicitud=true
      let dataForm = this.formSolicitud.getRawValue()
      let envio = {
        descripcion:dataForm.descripcion,
        fechaEntregaEfectivo:dataForm.fechaEntregaNueva,
        id:0,
        idFur:dataForm.idFur,
        idMoneda:dataForm.idMoneda,
        idPersonalResponsable:dataForm.idPersonalResponsable,
        idPersonalSolicitante:this.dataUsuario.id,
        totalEfectivo:dataForm.totalEfectivo,
        usuarioModificacion:this.usuario.userName
      }
      
      this.integraService
      .postJsonResponse(
        `${constApiFinanzas.InsertarCajaPorRendir}`,envio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          if(response.body==true)
          {
            
            this.ObtenerCajasPorRendirSolitudEfectivo(this.dataUsuario.id)
            this.loaderModalSolicitud=false
            this.alertService.swalFire(
              '¡Guardado con éxito!',
              'La solicitud se ha guardado correctamente.',
              'success'
            );
            
          }
          else{
            this.alertService.swalFire(
              '¡Ocurrio un error inesperado!',
              'No se guardaron los datos.',
              'warning'
            );
          }
          this.modalService.dismissAll(this.modalSolicitud)
          
          
        },
        error: (error) => {
          this.loaderModalSolicitud=false
          this.finanzasService.MensajeDeError(error,"GUARDAR NUEVa solicitud")
          
        },
        complete: () => {
        },
      });
    }
  }
  actualizarSolicitud(){// Actualiza una nueva solicitud
    if(this.validForm())
    {
      this.loaderModalSolicitud=true
      let dataForm = this.formSolicitud.getRawValue()
      let envio = {
        descripcion:dataForm.descripcion,
        fechaEntregaEfectivo:dataForm.fechaEntregaNueva,
        id:dataForm.id,
        idFur:dataForm.idFur,
        idMoneda:dataForm.idMoneda,
        idPersonalResponsable:dataForm.idPersonalResponsable,
        idPersonalSolicitante:this.dataUsuario.id,
        totalEfectivo:dataForm.totalEfectivo,
        usuarioModificacion:this.usuario.userName
      }
      this.integraService
      .putJsonResponse(
        `${constApiFinanzas.ActualizarCajaPorRendir}`,envio
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.ObtenerCajasPorRendirSolitudEfectivo(this.dataUsuario.id)
          if(response.body==true)
          {
            this.loaderModalSolicitud=false
            this.alertService.swalFire(
              'Actualizado con éxito!',
              'La solicitud se ha actualizado correctamente.',
              'success'
            );
            
          }
          else{
            this.alertService.swalFire(
              '¡Ocurrio un error inesperado!',
              'No se actualizaron los datos.',
              'warning'
            );
          }
          this.modalService.dismissAll(this.modalSolicitud)
          
          
        },
        error: (error) => {
          this.loaderModalSolicitud=false
          this.finanzasService.MensajeDeError(error,"ACTualizar NUEVa solicitud")
          
        },
        complete: () => {
        },
      });
    }
  }

  eliminarSolicitud(dataItem:any){//Eliminar un registro de solicitud
    this.loaderSolicitud=true
    this.integraService
    .deleteJsonResponse(
      constApiFinanzas.CajaPorRendirEliminarSolicitud+
      "/"+dataItem.id+"/"+dataItem.idFur+"/"+this.usuario.userName,
    )
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        this.loaderSolicitud=false
        if (response.body == true) {
          this.listaSolicitud = this.listaSolicitud.filter((e:any)=>e.id!==dataItem.id);
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
        this.loaderSolicitud=false
        this.finanzasService.MensajeDeError(error,"ELIMINAR solicitud");
      },
      complete: () => {},
    });
  }

  enviarSolicitud(){//Envia los registros de solicitud
    let envio={
      listaIds:this.listaSeleccion,
      usuario:this.usuario.userName
    }
    this.loaderSolicitud=true
    this.integraService
    .putJsonResponse(
      `${constApiFinanzas.ActualizarCajaPorRendirPonerEnviado}`,envio
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        this.limpiarSeleccion()
        this.ObtenerCajasPorRendirSolitudEfectivo(this.dataUsuario.id)
        if(response.body==true)
        {
          this.alertService.swalFire(
            'Solicitudes enviadas!',
            'Las solicitudes han sido enviada correctamente.',
            'success'
          );
          
        }
        else{
          this.alertService.swalFire(
            '¡Ocurrio un error inesperado!',
            'No se pudo enviar las solicitudes.',
            'warning'
          );
        }
        this.loaderSolicitud=false
        
      },
      error: (error) => {
        this.loaderSolicitud=false
        this.finanzasService.MensajeDeError(error,"Enviar solicitud")
        
      },
      complete: () => {
      },
    });
  }

  //--------------------------------------------------------------------------------------------------------


}

import { HttpResponse } from '@angular/common/http';
import { Component, OnInit ,ViewChild} from '@angular/core';
import { constApiFinanzas,constApi,constApiGlobal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MonedaCombo } from '@integra/models/moneda';
import { CuentaBancariaCombo } from '@integra/models/cuenta-bancaria';
import { PagosPorFur, RegistrarPagoFur } from '@integra/models/registrar-pago-fur';
import { ComprobanteAsociadoFur, ComprobantePagoEnvio, ComprobantePorFur, ComprobantPagoNoAsociado, DocumentoSunatCombo } from '@integra/models/comprobante-pago';
import { proveedorComboEgreso } from '@integra/models/proveedor';
import { TipoImpuestoCombo } from '@integra/models/tipo-impuesto';
import { RetencionCombo } from '@integra/models/retencion';
import { DetraccionCombo } from '@integra/models/detraccion';
import { ComboPaisDTO } from '@shared/models/combo';
import Swal from 'sweetalert2';
import { UserService } from '@shared/services/user.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-rendicion-efectivo',
  templateUrl: './rendicion-efectivo.component.html',
  styleUrls: ['./rendicion-efectivo.component.scss']
})
export class RendicionEfectivoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    private finanzasService:FinanzasServiceService,
    private userService: UserService,
  ) {}

  // Variables usadas en el componente ------------------------------------------------------------------
  @ViewChild('modalDetallePR') modalDetallePR: any;
  @ViewChild('modalAnadirComprobante') modalAnadirComprobante: any;
  @ViewChild('modalNuevaRendicion') modalNuevaRendicion: any;

  loaderRendicion = false
  idComprobante=new FormControl(null,Validators.required);
  idFur=new FormControl(null,Validators.required);
  inputidMoneda=new FormControl(null,Validators.required);
  detalleRendicion=new FormControl(null,Validators.required);
  montoRendicion=new FormControl(0,Validators.required);
  montoRegistrado=""
  montoRendido=""
  montoDisponible=""
  idCabeceraCajaPR:number=0
  prPrincipalTemp:any
  modalRef:any
  loadeGrillaPR=false
  loaderModalRendicion=false
  comprobanteTemp:any
  listaPR:any
  listaDetallePR:any
  listaRendicion :any[]=[]
  listaComprobante:any
  nombrePR:string
  montoPendiente:string
  cardRendicion=false
  maxlength:number = 250;
  charachtersCount:number=0;
  counter:string;
  nombreModal:string="";
  btnModal:string="";
  limitFUR=0
  montoEnvioTotal=0

  //Comprobante de Pago
  listaSede:any
  loaderModalComprobante:boolean=false
  listaMoneda :MonedaCombo[]=[]
  listaDocSunat :DocumentoSunatCombo[]=[];
  listaProveedor:proveedorComboEgreso[]=[]
  listaTipoImpuesto:TipoImpuestoCombo[]=[];
  listaRetencion:RetencionCombo[]=[];
  itemsRetencion:RetencionCombo[]=[];
  listaDetraccion:DetraccionCombo[]=[];
  itemsDetraccion:DetraccionCombo[]=[];
  listaPais:ComboPaisDTO[]
  listaFur:any[]=[];
  listaTipoPago:{
    id:number,
    nombre:string,
  }[]
  retencion:number=0

  //Comprobante de Pago

  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------
  ngOnInit(): void {
    this.ObtenerDatosPorRendir(this.userService.idPersonal)
    this.obtenerComboMoneda()
    this.obtenerComboDocumentoSunat()
    this.obtenerComboTipoImpuesto()
    this.obtenerComboRetencion()
    this.obtenerComboDetraccion()
    this.obtenerComboPais()
    this.obtenerComboSede()
  }
  // Funciones para la optencion de datos ------------------------------------------------------------------
  ObtenerDatosPorRendir(IdUsuario:number){//obtiene datos para la grilla PR
    this.listaPR=[]
    this.loaderRendicion= true;
      this.integraService
        .getJsonResponse(
          constApiFinanzas.ObtenerCajasPorRendirParaRendicion+"/"+IdUsuario
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            console.log("DATOS PR : ",response.body)
            this.loaderRendicion= false;
            this.listaPR=response.body
          },
          error: (error) => {
            this.loaderRendicion= false;
            this.finanzasService.MensajeDeError(error,"DATA POR RENDIR")
          },
          complete: () => {},
        });
  }

  ObtenerDetallePorRendir(data:any){//Obtiene detalles del PR para mostrar en el modal
    this.nombrePR = data.codigoPR
    this.loadeGrillaPR= true;
      this.integraService
        .getJsonResponse(
          constApiFinanzas.ObtenerCajasPorRendirPorIdPorRendirCabecera+"/"+data.idCajaPorRendirCabecera
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.abrirModalDetallePR()
            this.loadeGrillaPR= false;
            this.listaDetallePR=response.body
          },
          error: (error) => {
            this.loadeGrillaPR= false;
            this.finanzasService.MensajeDeError(error,"DETALLE POR RENDIR")
          },
          complete: () => {},
        });
  }

  ObtenerComprobantePorNro(NroDOC:string){//obtiene datos de los comprobantes
    
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerComprobantePorRuc}`+"/"+NroDOC
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log("Comprobante : ",response.body)
          this.listaComprobante=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"MODAL - OBTENER COMPROBANTE")
        },
        complete: () => {},
      });
  }

  ObtenerregistrosCajaEgreso(idCabeceraCajaPR:number){//obtiene datos de los registros de caja egreso
    this.loaderRendicion = true
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerRegistrosCajaEgreso}`+"/"+idCabeceraCajaPR
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaRendicion=response.body
          this.montoEnvioTotal=0
          if(response.body.length>0)
          {
            response.body.forEach((e:any) => {
              this.montoEnvioTotal= this.montoEnvioTotal +e.totalEfectivo
            });
          }
          this.loaderRendicion = false
        },
        error: (error) => {
          this.loaderRendicion = false
          this.finanzasService.MensajeDeError(error,"DATOS CAJA EGRESO")
        },
        complete: () => {
          this.loaderRendicion = false
        },
      });
  }

  ObtenerFURporCodigoIdCabeceraCajaPR(fur:string){//obtiene datos de los FUR's
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerDatosFurcajaEgreso}`+"/"+fur+"/"+this.idCabeceraCajaPR
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
    this.loaderModalRendicion=true
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.CajaPorRendirObtenerLimiteFur}`+"/"+idfur
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
          this.montoRendicion.setValue(this.limitFUR)
          this.loaderModalRendicion=false
        },
        error: (error) => {
          this.loaderModalRendicion=false
          this.finanzasService.MensajeDeError(error,"MODAL - OBTENER MONTO LIMITE FUR")
        },
        complete: () => {},
      });
  }

  ObtenerMontoUtilizadoComprobante(idComprobante:any){//Obtiene datos montos usados del comprobante
    this.loaderModalRendicion=true
    this.integraService
    .getJsonResponse(
      `${constApiFinanzas.ObtenerMontoUtilizadoComprobante}`+"/"+idComprobante
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log("MONTO usado Comprobante : ",response.body)
        if(response.body.length>0)
        {
          let data = response.body
          let montoUtilizado=0
          data.forEach((e:any)=>{
            montoUtilizado= montoUtilizado + e.montoUtilizado
          })
          this.VerificarMontosComprobante(montoUtilizado)
          
        }
        else this.VerificarMontosComprobante(0)
        this.loaderModalRendicion=false
      },
      error: (error) => {
        this.loaderModalRendicion=false
        this.finanzasService.MensajeDeError(error,"MODAL - OBTENER MONTO UTILIZADO COMPROBANTE")
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
  monedaTemplate(idmoneda:any)// obtiene elnombre de moenda para el mostrado en la grilla
  {
     if(typeof idmoneda=="number")
     {
      return this.listaMoneda.find((e:any)=> e.id == idmoneda).nombrePlural
     }
     return idmoneda
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------
  ObtenerDatosComprobante(data:any){//llena los mas inputs del Comprobante
    if(typeof data.id=="number")
    {
      this.comprobanteTemp=data
      this.ObtenerMontoUtilizadoComprobante(data.id)
    }

  }

  ObtenerDatosFUR(data:any){//llena los mas inputs del Comprobante
    if(typeof data.id=="number")
    {
      this.ObtenerFURmontoLimite(data.id)
      this.detalleRendicion.setValue(data.descripcion)
      this.onValueChange(data.descripcion)
    }

  }

  validarModal(){//valida el modal Editar/nueva rendicion
    if(this.idComprobante.valid &&
      this.idFur.valid &&
      this.inputidMoneda.valid &&
      this.detalleRendicion.valid &&
      this.montoRendicion.valid) return true
    else
    {
      this.idComprobante.markAllAsTouched()
      this.idFur.markAllAsTouched()
      this.inputidMoneda.markAllAsTouched()
      this.detalleRendicion.markAllAsTouched()
      this.montoRendicion.markAllAsTouched()
      return false
    }
  }

  resetModal(){//reinicia el modal Editar/nueva rendicion
    this.idComprobante.reset()
    this.montoDisponible=""
    this.montoRendido=""
    this.montoRegistrado=""
    this.montoRendicion.reset()
    this.idFur.reset()
    this.inputidMoneda.reset()
    this.detalleRendicion.reset()
  }

  VerificarMontosComprobante(montoUtilizado:number){//Verifica los montos del comprobante
    this.montoRendido = montoUtilizado.toString()
    this.montoRegistrado = this.comprobanteTemp.montoNeto.toString()
    let montoDis = (this.comprobanteTemp.montoNeto - montoUtilizado)
    this.montoDisponible=montoDis.toString()
    this.inputidMoneda.setValue(this.comprobanteTemp.idMoneda)
    if(montoDis<=0)
    {
      this.mensajeComprobanteSinFondo()
    }
  }

  mensajeComprobanteSinFondo(){//mensaje de comprobante sin fondo
    Swal.fire(
      "!Comprante sin monto disponible¡",
      "Seleccione otro comprobante",
      "warning"
    )
  }
  
  abrirModalDetallePR(){//abre el modal Detalle PR
    this.modalRef=this.modalService.open(this.modalDetallePR, { size: 'xl' });
  }
  abrirModalRendicion(isNew:boolean,data?:any){//Abre el modal para rendicion
    this.resetModal()
    this.btnModal="Guardar"
    this.nombreModal="Nueva "
    this.onValueChange("")
    if(!isNew)
    {
      this.btnModal="Actualizar"
      this.nombreModal="Editar "
    }
    this.modalService.open(this.modalNuevaRendicion,{size:'lg'});
  }
  accionModalRendicion(){//accion de insertar/editar registro rendicion
    switch(this.btnModal)
    {
      case "Guardar":
        this.insertarRendicion()
        break;
      case "Actualizar":
        break;
      default:
        break;
    }
  }

  BuscarComprobante(event:string){//Filtro de busqueda de comprobantes
    event = event.trim()
    if(event.length>4){
      this.ObtenerComprobantePorNro(event)
    }
  }

  BuscarFur(event:string){//Buscar el fur po codigo
    event = event.trim()
    if(event.length>4){
      this.ObtenerFURporCodigoIdCabeceraCajaPR(event)
    }
  }
  onValueChange(ev: string): void {//evento del TExtArea para mostar cantidad de caracteres
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }

  calcularEnvioRendicion(){
    this.montoEnvioTotal=0
    if(this.listaRendicion.length>0)
    {
      this.listaRendicion.forEach((e:any) => {
        this.montoEnvioTotal= this.montoEnvioTotal +e.totalEfectivo
      });
    }
    
  }

  msgEliminar(dataItem:any): void {//muestra el cuadro de dialogo para eliminar un registro
    Swal.fire({
      title: '¿Está seguro de querer eliminar este registro de Caja Egreso?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarCajaEgreso(dataItem);
      }
    });
  }
  msgEnviarRendicion(): void {//muestra el cuadro de dialogo para enviar a Caja Egreso
    Swal.fire({
      title: '¿Está seguro de querer enviar los registros a solicitud de Caja Egreso?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Continuar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.enviarREndicion();
      }
    });
  }

  refrescarGrillaRendicion(){//Refresca la grilla de Rendicion
    this.ObtenerregistrosCajaEgreso(this.idCabeceraCajaPR)
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones para el control del Modal Comprobante------------------------------------------------------------------
  obtenerComboSede(){//Obtiene el combo de monedas
    this.integraService.obtenerTodo(constApiGlobal.ObtenerComboSede)
    .pipe(
      map((resp: any) =>
        resp.body.map((item: any) => ({
            ...item,
            id: parseInt(item.idEmpresa.toString()+item.idCiudad.toString()),
          }
        ))
      )
    )
    .subscribe({
      next: (response: any[]) => {
        console.log(response)
        this.listaSede=response
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER COMBO SEDE");
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
          this.finanzasService.MensajeDeError(error,"OBTENER COMBO MONEDA");
        },
        complete: () => {},
    });
  }
  obtenerComboDocumentoSunat(){//Obtiene el combo Documento
    this.integraService.obtenerTodo(constApiFinanzas.ComprobantePagoDocumnetoSunat).subscribe({
      next: (response: HttpResponse<DocumentoSunatCombo[]>) => {
        this.listaDocSunat=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER COMBO DOC. SUNAT");
        },
        complete: () => {
          
        },
    });
  }

  obtenerComboTipoImpuesto(){//Obtiene el combo de tipo impuesto
    this.integraService.obtenerTodo(constApi.TipoImpuestoObtenerCombo).subscribe({
      next: (response: HttpResponse<TipoImpuestoCombo[]>) => {
        this.listaTipoImpuesto=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"OBTENER COMBO TIPO IMPUESTO");
        },
        complete: () => {
          
        },
    });
  }

  obtenerComboRetencion(){//obtiene el combo de Retencion
    this.integraService.obtenerTodo(constApi.RetencionObtenerCombo).subscribe({
      next: (response: HttpResponse<RetencionCombo[]>) => {
        this.listaRetencion=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"obtener combo retencion");
        },
        complete: () => {
          
        },
    });
  }
  obtenerComboDetraccion(){// obtiene el combo de detraccion
    this.integraService.obtenerTodo(constApi.DetraccionObtenerCombo).subscribe({
      next: (response: HttpResponse<DetraccionCombo[]>) => {
        this.listaDetraccion=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"obtener combo detraccion");
        },
        complete: () => {
          
        },
    });
  }
  obtenerComboPais(){//obtiene el combo Pais
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (response: HttpResponse<ComboPaisDTO[]>) => {
        this.listaPais=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"obtener combo pais");
        },
        complete: () => {
          
        },
    });
  }


  abrirCardRendicion(data:any){//Abre el Card para proceder con la rendición de efectivo
    this.prPrincipalTemp=data
    this.idCabeceraCajaPR=data.idCajaPorRendirCabecera
    this.ObtenerregistrosCajaEgreso(data.idCajaPorRendirCabecera)
    this.nombrePR=data.codigoPR
    this.montoPendiente=data.montoPendiente.toString()
    this.cardRendicion=true
  }


  openModalComprobante(nuevo:boolean){//Abre el Modal Comprobante de Pago
    this.modalService.open(this.modalAnadirComprobante);
  }

  //------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------
 insertarRendicion(){//inserta un nuevo registro en rendicion/CajaEgreso
  if(this.validarModal())
  {
    if(this.montoRendicion.value<=this.montoDisponible)
    {
      if(this.limitFUR>0)
      {
        if(this.montoRendicion.value>0)
        {
          this.loaderModalRendicion=true
          let envio={
            idCajaPorRendirCabecera: this.prPrincipalTemp.idCajaPorRendirCabecera,
            idCaja: this.prPrincipalTemp.idCaja,
            idComprobantePago: this.idComprobante.value,
            idFur: this.idFur.value,
            descripcion: this.detalleRendicion.value,
            idMoneda: this.inputidMoneda.value,
            totalEfectivo: this.montoRendicion.value,
            idPersonalSolicitante: this.userService.idPersonal,
            usuarioModificacion: this.userService.userName
          }
          this.integraService
          .postJsonResponse(
            `${constApiFinanzas.InsertarCajaEgreso}`,envio
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              this.ObtenerregistrosCajaEgreso(this.idCabeceraCajaPR)
              this.loaderModalRendicion=false
              this.modalService.dismissAll(this.modalNuevaRendicion)
            },
            error: (error) => {
              this.loaderModalRendicion=false
              this.finanzasService.MensajeDeError(error,"MODAL - INSERTAr nueva rendicion")
            },
            complete: () => {

            },
          });
        }
        else
        {
          Swal.fire(
            "!Advertencia¡",
            "El monto de rendición no puede ser 0!",
            "warning"
          )
        }
      }
      else
      {
        Swal.fire(
          "!Advertencia¡",
          "Este FUR ya ha sido rendido en su totalidad!",
          "warning"
        )
      }
    }
    else
    {
      Swal.fire(
        "!Advertencia¡",
        "El monto de rendición tiene que ser igual o menor al monto disponible del comprobante",
        "warning"
      )
    }
  }
 }

 eliminarCajaEgreso(data:any){// Elimina el registro de rendicion/CajaEgreso
  this.loaderRendicion=true
    this.integraService
    .deleteJsonResponse(
      constApiFinanzas.CajaEgresoEliminar+"/"+data.id+"/"+this.userService.userName,
    )
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        this.loaderRendicion=false
        if (response.body == true) {
          this.ObtenerregistrosCajaEgreso(this.idCabeceraCajaPR)
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
        this.loaderRendicion=false
        this.finanzasService.MensajeDeError(error,"ELIMINAR CAJA EGRESO");
      },
      complete: () => {},
    });
  }

  enviarREndicion(){//Envia todos los registros de rendicion / Caja Egreso
    if(this.montoEnvioTotal>0)
    {
      this.loaderRendicion=true
      this.integraService
        .putJsonResponse(
          `${constApiFinanzas.ActualizarCajaEgresoEstablecerRendido}/${this.userService.idPersonal}/${this.idCabeceraCajaPR}`,null
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            if(response.body==true)
            {
              this.ObtenerDatosPorRendir(this.userService.idPersonal)
              this.ObtenerregistrosCajaEgreso(this.idCabeceraCajaPR)
              this.alertService.swalFire(
                '¡Enviado con éxito!',
                'La rendición ha sido enviada y guardada correctamente.',
                'success'
              );
            }
            else
            {
              this.alertService.swalFire(
                '¡Ocurrio un error!',
                'Ocurrio un error inesperado.',
                'error'
              );
            }
            
            this.loaderRendicion=false
          },
          error: (error) => {
            this.loaderRendicion=false
            this.finanzasService.MensajeDeError(error,"EnVIAR rendicion")
            
          },
          complete: () => {},
        });
    }
    else
    {
      Swal.fire(
        "!Monto de envio 0¡",
        "Ingrese registros de rendición/Caja egreso!",
        "warning"
      )
    }
  }
}

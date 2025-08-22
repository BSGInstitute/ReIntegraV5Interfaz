import { HttpResponse } from '@angular/common/http';

import { Component, Input, OnInit,ViewEncapsulation } from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { IRowActual } from '@comercial/models/interfaces/iagenda';
import { constApiComercial, constApiGlobal, constApiOperaciones } from '@environments/constApi';
import { KendoGrid } from '@shared/models/kendo-grid';
import Swal from 'sweetalert2';
import { IntegraService } from '@shared/services/integra.service';
import { RowClassArgs } from "@progress/kendo-angular-grid";
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '@shared/services/user.service';
import * as signalR from '@microsoft/signalr';
import { MatExpansionModule } from '@angular/material/expansion/expansion-module';
import { IMensajesWhatsapp } from '@operaciones/models/interfaces/ihistorial-mensaje-recibido';
@Component({
  selector: 'app-estado-matriculado',
  templateUrl: './estado-matriculado.component.html',
  styleUrls: ['./estado-matriculado.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class EstadoMatriculadoComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {
    
  }
  panelOpenState = false;
  private rowActual: IRowActual;
  gridEstadoMatriculado:  KendoGrid = new KendoGrid();
  loadingCaracteristicas:boolean=false ;
  loadingCorreo:boolean=false ;
  loadingWhatsapp:boolean=false ;
  esEnvioCorrecto:boolean;
  plantillaEnvidaWhatsappDatosPortal:boolean
  plantillaEnvidaWhatsappDatosMoodle:boolean
  plantillaEnvidaCorreoDatPortal:boolean
  plantillaEnvidaCorreoAcessoMoodle:boolean
  plantillaEnvidaCorreoCondiciones:boolean
  plantillaSeleccionada:any
  tipoMensaje:string ='hsm'
  objetoPlantillasWhatsApp:any = null;
  numeroCelular:any
  nombreAsesor:any
  public hubConnection: signalR.HubConnection;
  ngOnInit(): void {
    this.conectar();
    this.userService.nombrePersonal$.subscribe({
      next: (resp: any) => {
        this.nombreAsesor = resp.valor;
      },
    });
    this.obtenerNumero()
    this.rowActual = this.agendaService.rowActual;
    this.agendaService.agendaActividadesOperacionesService.cargarEstadoMatriculado$()
    .subscribe({
      next: (resp: any) => {
        if (resp != null) {
          if (resp) {
            console.log('gridEstadoMatriculado')
            this.gridEstadoMatriculado.data = resp.body;
          } 
        }
      },
    });

   // /EstadoMatricula/ObtenerEstadoMatriculado
  }
  formEnviarWhatsapp: FormGroup = this.formBuilder.group({
    mensaje:'', 
    plantilla:'', 
    archivoAdjunto:[]
  })

  
  obtenerNumero(): string {
    let numero:string = 
    //this.alumno.celular;
     this.agendaService.rowActual.celular;
    switch(this.agendaService.rowActual.idCodigoPais) {
      case 51: {
        if (numero.startsWith("51")) {
          numero = `${numero}`;
      } 
      else{
         numero = `51${numero}`;
      }
        break }

      case 57: { 
        if (numero.startsWith("57")) {
          numero = `${numero}`;
      } 
      else{
         numero = `57${numero}`;
      }
        //numero = `57${numero}`;// Colombia
        break }
      case 591: {
        if (numero.startsWith("591")) {
          numero = `${numero}`;
      } 
      else{
        numero = `591${numero}`;
      }
        //numero = `591${numero}`;// Bolivia
        break }
      case 52: {
        // Mexico
        if (numero.startsWith('0')) {
          numero = numero.substring(4);
          numero = `521${numero}`;
        } 
        else if(numero.startsWith("52"))
        { 
          
          if(numero.startsWith("521"))
          {
            numero = numero
          }
          else{
          numero = numero.substring(2)
          numero = `521${numero}`
          }
        }
        break }
      default: {
        numero = numero
        break;
      }
    }
    this.numeroCelular=numero
    return numero;
  }
  enviarDatosMoodle() {
    Swal.fire({
      title: "¿Estás seguro de enviar el correo?",
      icon: "info",
      iconColor: "#f9c396",
      showDenyButton: true,
      width: 300,
      confirmButtonText: "Aceptar",
      denyButtonText: "Cancelar",
      buttonsStyling: false,
      customClass:{
        confirmButton: "sweetAlert2-customConfirmButtonSwal",
        denyButton: "sweetAlert2-customDenyButton"
      }
    }).then((result) => {
      if (result.isConfirmed) {
      this.plantillaEnvidaCorreoAcessoMoodle=true
      this.loadingCorreo=true
      let obj: any = new Object();
      obj.IdAlumno = this.rowActual.idAlumno;
      obj.IdPersonalAsignado = this.rowActual.idPersonal_Asignado;
      obj.IdOportunidad = this.rowActual.idOportunidad;
      obj.IdCentroCosto = this.rowActual.idCentroCosto;
      obj.EmailAsesor = this.agendaService.datosPersonal.email;
      obj.EmailAlumno = this.rowActual.email1;
      obj.CodigoAlumno = this.rowActual.codigoMatricula;
      obj.Usuario = this.agendaService.userName;
  
      let data = JSON.stringify(obj);
  
      this.agendaService.agendaActividadesOperacionesService
        .enviarDatosMoodle$(data)
        .subscribe({
          next: (resp: any) => {
            if (resp != null) {
              console.log(resp);
              console.log('EnviarAccesoPortalWebAlumno$');
              this.agendaService.agendaActividadesOperacionesService
                .PlantillaOperacionesEnvio$(resp.body.id)
                .subscribe({
                  next: (resp: any) => {
                    if (resp != null) {
                      
                      if (resp.body == true) {
                        this.plantillaEnvidaCorreoAcessoMoodle=true
                        this.notificacionEnvioExitoso()
                      } else {
                        this.notificacionEnvioFallido()
                        this.plantillaEnvidaCorreoAcessoMoodle=false
                      }
                    }
                    this.loadingCorreo=false
                  },
                  error: (error) =>{
                    this.loadingCorreo=false
                  }
                });
            }
          },
        });
      }
  

    });

 
  }
  async conectar() {
    //this.hubWhatsap = this.SignalRService.connection('hubIntegraHub',this.agendaService.idPersonal,this.agendaService.userName)
    this.hubConnection = new signalR.HubConnectionBuilder()
    //urlSignal:'https://integrav4-signalrcore.bsginstitute.com'
    //urlSignal:'https://integrav4-signalrcore.bsginstitute.com'
      .withUrl(`https://integrav4-signalrcore.bsginstitute.com/hubChatWhatsapp_Peru`+'?idUsuario='+this.agendaService.idPersonal+'&&usuarioNombre='+this.agendaService.userName
      +'&&rooms=' +
      '' +
      '')
      .build();
  
    this.hubConnection.serverTimeoutInMilliseconds = 36000000;
  
    try {
      await this.hubConnection.start();
      console.log('Connection Started');
    } catch (err) {
      console.error(err);
    }
  }

  

  enviarDatosPortalWhatsApp() {
    Swal.fire({
      title: "¿Estás seguro de enviar el mensaje?",
      icon: "info",
      iconColor: "#f9c396",
      showDenyButton: true,
      width: 300,
      confirmButtonText: "Aceptar",
      denyButtonText: "Cancelar",
      buttonsStyling: false,
      customClass:{
        confirmButton: "sweetAlert2-customConfirmButtonSwal",
        denyButton: "sweetAlert2-customDenyButton"
      }
    }).then((result) => {

      if (result.isConfirmed) {

      this.loadingWhatsapp=true
      this.plantillaEnvidaWhatsappDatosPortal=true
      let objeto:IDataEnvioWhatsapp;
  
      
      //this.loadingCargarPlantilla= true
      console.log('enviarmensaje')
      this.plantillaSeleccionada ={
        contenido : "{tAlumnos.nombre1}, te hago llegar tu usuario y clave de acceso a nuestro sitio web: URL: {Link.UrlPortalWeb} Usuario: {T_Alumno.UsuarioPortalWeb} Clave: {T_Alumno.ClavePortalWeb} Quedo a tu disposici&oacute;n para cualquier duda o consulta que puedas tener. Saludos. {tPersonal.PrimerNombreApellidoPaterno} Servicio de Atenci&oacute;n al Cliente BSG Institute",
        descripcion : "datos_accesos_portal_web",
        id : 1152,
        nombre : "Datos de Acceso Portal Web",
        tipoPlantilla : 8,
      }
      this.integraService.getJsonResponse(
      `${constApiComercial.AgendaGenerarPlantillaWhatsapp}/${this.agendaService.rowActual.idOportunidad}/${this.plantillaSeleccionada.id}`
      ).subscribe({
        next: (response: HttpResponse<any>) => {
          if (response.body && response.body != undefined) {
            this.formEnviarWhatsapp.get('mensaje').setValue(response.body.plantilla);
            this.tipoMensaje='hsm'
              this.formEnviarWhatsapp.get('mensaje').disable();
              response.body.objetoplantilla.forEach((e: any) => {
                if(e.texto == null)
                {
                  e.texto= ' '
                  console.log(e)
                }
              });
              this.objetoPlantillasWhatsApp = response.body.objetoplantilla;
        
          }
  
          objeto = {
            "Id": 0,
            "WaTo": this.numeroCelular,
            "WaType": "hsm",
            "WaTypeMensaje": 8,
            "WaRecipientType": "hsm",
            "WaBody": this.plantillaSeleccionada.descripcion,
            "WaCaption": this.formEnviarWhatsapp.get('mensaje').value,
            "IdPais": this.agendaService.rowActual.idCodigoPais,
            "EsMigracion": true,
            "IdMigracion": 0,
            "IdPersonal": this.userService.userData.idPersonal,
            "IdAlumno": this.agendaService.rowActual.idAlumno,
            "usuario": this.userService.userName,
            "datosPlantillaWhatsApp": this.objetoPlantillasWhatsApp
          };
        
          
      let param:IWhatsappNumeroValidado = {
        idAlumno: objeto.IdAlumno,
        numeroCelular: objeto.WaTo,
        idPais: objeto.IdPais,
        usuario: this.userService.userData.userName
      }
      this.integraService
        .postJsonResponse(constApiComercial.WhatsAppNumeroValidadoVerificarInsertarNumeroValidado, param)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            if(response.body) {
              if (objeto.WaTo == this.numeroCelular) {
                this.hubConnection.invoke('opSend', objeto)
                this.enviarMensaje(objeto)
                // this.notificacionEnvioExitoso()
                this.loadingWhatsapp=false
              } else {
                this.notificacionEnvioFallidoplantilla('error','El numero no es valido')
                this.loadingWhatsapp=false
                this.plantillaEnvidaWhatsappDatosPortal=true
              }
            } else {
              this.notificacionEnvioFallidoplantilla('error','Fallo la validacion del numero')
              this.loadingWhatsapp=false
              this.plantillaEnvidaWhatsappDatosPortal=true
            }
          }
        })
        },
        error: (error: any) => {
          this.notificacionEnvioFallido()
          this.notificacionEnvioFallidoplantilla('error','Fallo el obtener la plantilla')
          this.loadingWhatsapp=false
          this.plantillaEnvidaWhatsappDatosPortal=true
        }
      })
    }
    });

  };
  enviarMensaje(objeto: IDataEnvioWhatsapp) {
    let mensajeEnvido: any = null;
    let mensajeIndicador: IMensajesWhatsapp = null;
    mensajeEnvido = objeto.WaBody;
    if(objeto.IdPais !=51 && objeto.IdPais !=57 && objeto.IdPais !=591)
    {
      this.integraService
      .postJsonResponseWhatsapp(
        `${constApiOperaciones.WhatsAppMensajesWhatsAppMensajeApiGraph}`,
        objeto
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('llegadadewhatsapp', response.body);
          this.esEnvioCorrecto = response.body.estadoMensaje
          if(this.esEnvioCorrecto==true){
            this.notificacionEnvioExitoso();
          }else{
            this.notificacionEnvioFallidoplantilla('error', 'El mensaje no fue enviado');
          }
          mensajeIndicador = {
            numero: this.numeroCelular,
            tipo: 1,
            mensaje: response.body.mensaje,
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: this.nombreAsesor,
          };
          // this.historialMensajeRecibidosChat.push(mensajeIndicador);
        },
        error: (error: any) => {
          mensajeIndicador = {
            numero: this.numeroCelular,
            tipo: 1,
            mensaje: 'Problemas con el Servicio de whatsapp',
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: this.nombreAsesor,
          };
          // this.historialMensajeRecibidosChat.push(mensajeIndicador);
          this.notificacionEnvioFallidoplantilla('error', 'Fallo el servicio');
        },
      });

    }
    else{
      this.integraService
      .postJsonResponse(
        `${constApiOperaciones.WhatsAppMensajesWhatsAppMensaje}`,
        objeto
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log('llegadadewhatsapp', response.body);
          this.esEnvioCorrecto = response.body.estadoMensaje
          if(this.esEnvioCorrecto==true){
            this.notificacionEnvioExitoso ();
          }else{
            this.notificacionEnvioFallido();
          }
          mensajeIndicador = {
            numero: this.numeroCelular,
            tipo: 1,
            mensaje: response.body.mensaje,
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: this.nombreAsesor,
          };

          // this.historialMensajeRecibidosChat.push(mensajeIndicador);
        },
        error: (error: any) => {
          mensajeIndicador = {
            numero: this.numeroCelular,
            tipo: 1,
            mensaje: 'Problemas con el Servicio de whatsapp',
            idPersonal: null,
            fechaCreacion: new Date(),
            idAlumno: null,
            estadoMensaje: 1,
            nombrePersonal: this.nombreAsesor,
          };
          // this.historialMensajeRecibidosChat.push(mensajeIndicador);
          this.notificacionEnvioFallido();
        },
      });

    }

    // this.hubConnection.invoke('OpSend', ContenidoObjeto);
    // this.consultaBloqueoRedactar();
  }
  
  enviarDatosCondicionesCaracteristicas() {
    Swal.fire({
      title: "¿Estás seguro de enviar el correo?",
      icon: "info",
      iconColor: "#f9c396",
      showDenyButton: true,
      width: 300,
      confirmButtonText: "Aceptar",
      denyButtonText: "Cancelar",
      buttonsStyling: false,
      customClass:{
        confirmButton: "sweetAlert2-customConfirmButtonSwal",
        denyButton: "sweetAlert2-customDenyButton"
      }
    }).then((result) => {
      if (result.isConfirmed) {
      this.plantillaEnvidaCorreoCondiciones=true
    this.loadingCaracteristicas=true
    let obj: any = new Object();
    obj.IdAlumno = this.rowActual.idAlumno;
    obj.IdPersonalAsignado = this.rowActual.idPersonal_Asignado;
    obj.IdOportunidad = this.rowActual.idOportunidad;
    obj.IdCentroCosto = this.rowActual.idCentroCosto;
    //obj.EmailAsesor = EmailVista;
    obj.EmailAsesor = 'matriculas@bsginstitute.com';
    obj.EmailAlumno = this.rowActual.email1;
    obj.CodigoAlumno = this.rowActual.codigoMatricula;
    obj.Usuario = this.agendaService.userName;

    let data = JSON.stringify(obj);

    this.agendaService.agendaActividadesOperacionesService
      .enviarCondicionesCaracteristicas$(data)
      .subscribe({
        next: (resp: any) => {
          this.agendaService.agendaActividadesOperacionesService
            .PlantillaOperacionesEnvio$(resp.body.idPlantilla)
            .subscribe({
              next: (resp: any) => {
                if (resp != null) {
                  if (resp.body == true) {
                    this.plantillaEnvidaCorreoCondiciones=true
                    this.notificacionEnvioExitoso()
                    // NotificacionModule.showMensajeExitoso("Se envio el mensaje correctamente.");
                  } else {
                    this.notificacionEnvioFallido()
                    this.plantillaEnvidaCorreoCondiciones=false
                    //NotificacionModule.showMensajeExitoso("No se pudo enviar el mensaje.");
                  }
                }
                this.loadingCaracteristicas=false
              },
              error: (error) =>{
                this.loadingCaracteristicas=false
              }
            });
        },
      });
    }
    });


    
    // $.ajax({
    //     url: 'http://localhost:63048/api/Correo/EnviarCondicionesCaracteristicas',
    //     type: 'POST',
    //     data: data,
    //     contentType: "application/json; charset=utf-8",
    //     dataType: 'json',
    //     success: function (data) {
    //         if (data.IdPlantilla) {
    //             $.ajax({
    //                 url: 'http://localhost:63048/api/PlantillaOperaciones/Envio/' + obj.EmailAsesor + "/" + obj.CodigoAlumno + "/" + obj.EmailAlumno + "/" + data.IdPlantilla,
    //                 type: 'GET',
    //                 success: function (res) {
    //                     // $("#enviarDatosCondicionesCaracteristicas").removeClass("disabled");
    //                     if (res) {
    //                         NotificacionModule.showMensajeExitoso("Se envio el mensaje correctamente.");
    //                         //Registrar envio
    //                         $.ajax({
    //                             url: 'http://localhost:63048/api/AgendaInformacionActividad/InsertarEnvio/' + rowActual.IdOportunidad + "/" + UserName,
    //                             type: 'GET',
    //                             success: function (result) {
    //                                 let _fechaEnvioCondiciones_original = dict.get("TPW_DocumentoEnviadoWeb.FechaEnvio");
    //                                 if (_fechaEnvioCondiciones_original === "<span style='color: #ff0000;'>Fecha de envio no registrada</span></strong></span>") {
    //                                     _fechaEnvioCondiciones_original = "Fecha de envio no registrada";
    //                                 }
    //                                 let _fechaEnvioCondiciones_nuevo = formatStrinDate(result.FechaEnvio);
    //                                 //if (dict.has("TPW_DocumentoEnviadoWeb.FechaEnvio")) {
    //                                 //    dict.delete("TPW_DocumentoEnviadoWeb.FechaEnvio");
    //                                 //}
    //                                 dict.set('TPW_DocumentoEnviadoWeb.FechaEnvio', _fechaEnvioCondiciones_nuevo);
    //                                 while ($('#span_SpeechInicial:contains("' + _fechaEnvioCondiciones_original + '")').length > 0) {
    //                                     $("#span_SpeechInicial").html($("#span_SpeechInicial").html().replace(_fechaEnvioCondiciones_original, _fechaEnvioCondiciones_nuevo));
    //                                 }
    //                             },
    //                             error: function (error) {
    //                                 // NotificacionModule.showMensajeError(error, NotificacionId);
    //                             }
    //                         });
    //                     }
    //                     else {
    //                         // NotificacionModule.showMensajeExitoso("No se pudo enviar el mensaje.");
    //                     }
    //                 },
    //                 error: function (error) {
    //                     // $("#enviarDatosCondicionesCaracteristicas").removeClass("disabled");
    //                     // NotificacionModule.showMensajeError(error, NotificacionId);
    //                 }
    //             });
    //         } else {
    //             // $("#enviarDatosCondicionesCaracteristicas").removeClass("disabled");
    //             // NotificacionModule.showMensajeError("El alumno no es de Peru o Colombia.");
    //         }
    //     },
    //     error: function (error) {
    //         // $("#enviarDatosCondicionesCaracteristicas").removeClass("disabled");

    //     }
    // });
  }

  notificacionEnvioExitoso(){
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    Toast.fire({
      icon: 'success',
      title: 'Se Envio el mensaje'
    })
  }
  notificacionEnvioFallido(){
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    Toast.fire({
      icon: 'error',
      title: 'No Se Pudo enviar el Mensaje'
    })
  }


  notificacionEnvioFallidoplantilla(icono:any,title:any){
    let Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    Toast.fire({
      icon: icono, //'error',
      title: title,// 'No Se Pudo enviar el Mensaje'
    })
  }
  public rowCallbackInversion = (context: RowClassArgs) => {
    if (context.dataItem.codigoMatricula == this.agendaService.rowActual.codigoMatricula) {
      return { gold: true };
    }
    else {
      return { green: true };
    }
  }

  versionAlumno(dataItem:any){
    //console.log(dataItem,'versionesdelprograma')
    if (dataItem.versionPrograma == 1)
    {
      return " - Basica"
    }
    else if (dataItem.versionPrograma == 2)
    {
      return " - Profesional"
    }
    else if (dataItem.versionPrograma == 3)
    {
      return " - Gerencial"
    }
    else if (dataItem.versionPrograma == 4)
    {
      return " - sin versión"
    }
    else if (dataItem.versionPrograma == 0 || dataItem.versionPrograma == null )
    {
      return  " - sin versión"
    }
    return  " "
  }


}

interface IDataEnvioWhatsapp {
  Id: number;
  WaTo: string;
  WaId?: string;
  WaType: string;
  WaTypeMensaje?: number;
  WaRecipientType: string;
  WaBody: string;
  WaFile?: string;
  WaFileName?: string;
  WaMimeType?: string;
  WaSha256?: string;
  WaLink?: string;
  WaCaption?: string;
  IdPais: number;
  EsMigracion?: boolean;
  IdMigracion?: number;
  IdPersonal: number;
  IdAlumno: number;
  usuario: string;
  datosPlantillaWhatsApp?: IDatosPlantillaWhatsapp[];
}

interface IDatosPlantillaWhatsapp {
  codigo: string;
  texto: string;
}
interface IWhatsappNumeroValidado {
  idAlumno: number;
  numeroCelular: string;
  idPais: number;
  usuario: string;
}

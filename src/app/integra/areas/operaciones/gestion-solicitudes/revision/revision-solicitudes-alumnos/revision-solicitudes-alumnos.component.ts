import { Component, LOCALE_ID, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import Swal from 'sweetalert2';
import { UserService } from '@shared/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertaService } from '@shared/services/alerta.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KendoGrid } from '@shared/models/kendo-grid';
import { constApiGlobal, constApiOperaciones } from '@environments/constApi';
import { HttpResponse } from '@angular/common/http';
import { IFiltroEnvio, IFormReporte } from '@operaciones/models/interfaces/igestionReclamos';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';

/**
 * DTO del mensaje devuelto por /ChatDetalleIntegra/ObtenerChatBotWhatsAppAtcPorSolicitudAlumno.
 * Mismo contrato que ChatbotWhatsAppMensajeDTO del módulo calificacion-chat-bot.
 */
interface ChatMensajeAtcDTO {
  idHiloChatWhatsApp: number;
  idAlumno: number;
  esUsuario: boolean;
  contenido: string;
  tipoMensaje?: string | null;
  waFile?: string;
  waMimeType?: string;
  waFileName?: string;
  waCaption?: string;
  fechaCreacion: string;
  esBot: number;
  personal: string;
  waType: string;
}

@Component({
  selector: 'app-revision-solicitudes-alumnos',
  templateUrl: './revision-solicitudes-alumnos.component.html',
  styleUrls: ['./revision-solicitudes-alumnos.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [{ provide: LOCALE_ID, useValue: "es-ES" }],
})
export class RevisionSolicitudesAlumnosComponent implements OnInit {
  @ViewChild('modalDetalleSolicitud') modalDetalleSolicitud: any;
  @ViewChild('alumno')alumno: DropDownListComponent;
  @ViewChild('modalChatWhatsApp') modalChatWhatsApp: any;

  constructor(
    private sanitizer: DomSanitizer,
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private _date: DatePipe,
    private modalService: NgbModal,
    private userService: UserService,
  ) { }

  // carga las grillas
  gridGestionSolicitudAlumnos: KendoGrid = new KendoGrid();
  datepipe: DatePipe = new DatePipe('en-US')
  virtual = {
    itemHeight: 28,
  };

  //carga el drowdownList
  tipoBusquedaData: any = [
    {
      id: 1,
      nombre: 'Codigo de Alumno'
    },
    {
      id: 2,
      nombre: 'Solicitante'
    },
    {
      id: 3,
      nombre: 'Correo'
    },
    {
      id: 4,
      nombre: 'Estado'
    }
  ];

  estadosRevision: any = [
    {
      id: 2,
      nombre: 'Obsevar'
    },
    {
      id: 3,
      nombre: 'Asignar a Responsable'
    },
    {
      id: 4,
      nombre: 'Resuelto'
    },
    {
      id: 9,
      nombre: 'RCV por Revisor'
    },
       {
      id: 10,
      nombre: 'RC'
    },
  ];

  areaMapping: { [key: string]: string } = {
    'CO': 'Contabilidad',
    'GE': 'Gerencia',
    'OP': 'Atención al cliente',
    'MKT': 'Marketing',
    'GP': 'Gestión de Personas',
    'CLA': 'Calidad, Logística y Auditoría',
    'PL': 'Planificacion',
    'VE': 'Ventas',
    'FI': 'Finanzas',
    'LO': 'Logistica',
    'TI': 'Tecnologías de la Información',
    'PO': 'Planificación y Operaciones',
    'DO': 'Desarrollo Organizacional',
    'SO': 'Soporte de Operaciones',
    'OPA': 'Operaciones y Producción Audiovisual'
  };

  //variables que alamacenan los valores ingresados
  datoTipoBusqueda: any;
  dataContenido:any;
  datoContenidoBusqueda: any;
  hiddenInput:any;
  hiddenDropDownList1:any;
  hiddenDropDownList2:any;
  itemslistaPersonal:any;
  itemslistaEstado:any;
  dataContenidoEstados:any;
  modalRefTCOrigen:any;
  nombreArchivoSolicitado:any;
  nombreArchivoSolucion:any;
  descripcionSubCategoria: string = '';
  inputArchivoSolicitudAlumno:any;
  inputArchivoSolucionAlumno:any;
  inputDetalle:string="";
  datoContenidoBusquedaD1:any;
  datoContenidoBusquedaD2:any;
  idPersonal:any;
  idNuevoEstado:any;
  hiddenModal:boolean=true;
  loaderGrid:boolean=false;
  dataSolicitudesAlumno:any;
  busquedaNombre: boolean = false;
  disabled: boolean = true;
  listaAlumno: any;
  listaMatricula: any[] = [];
  listaPrograma:any;
  idMatriculaCabecera:any;
  idMatriculaCabeceraAlumno:any;
  isNew: boolean = false;
  loaderModal: boolean = true; //MODAL SPINNER
  sourceContacto: { id: number; nombreCompleto: string }[] = [];
  dataContacto: { id: number; nombreCompleto: string }[] = [];
  band :boolean=true;

  // Modal Chat WhatsApp ATC — render replicado de chat-messages para visualizar conversación
  // del alumno asociada a la solicitud actual.
  mensajesChatWhatsApp: ChatMensajeAtcDTO[] = [];
  loadingChatWhatsApp = false;
  modalRefChatWhatsApp: any;
  formCategoria: FormGroup = this.formBuilder.group({
    Id: ['',[Validators.required]],
    prioridad: ['', [Validators.required]],
    tipoReporte: ['',[Validators.required]],
    categoria: ['', [Validators.required]],
    subCategoria: ['',[Validators.required]],
    origenSolicitud: ['',[Validators.required]],
    solicitud: ['', [Validators.required]],
    areaSolicitante: ['',[Validators.required]],
    solicitante: ['', [Validators.required]],
    codigoAlumno: ['',[Validators.required]],
    nombreAlumno: ['', [Validators.required]],
    curso: ['',[Validators.required]],
    Prioridad: ['', [Validators.required]],
    programa: ['',[Validators.required]],
    centroCosto: ['', [Validators.required]],
    detalleSolicitud: ['',[Validators.required]],
    archivoSolicitante: [''],
    areaRevision: ['',[Validators.required]],
    personalRevision: ['', [Validators.required]],
    areaSolucion: ['',[Validators.required]],
    personalSolucion: ['', [Validators.required]],
    fechaRegistro: ['',[Validators.required]],
    comentario: ['', [Validators.required]],
    archivoSolucion: ['', [Validators.required]],
    estadoSolicitud: ['',[Validators.required]],
  });

  formSolicitudAlumno: FormGroup = this.formBuilder.group({
    alumno:[[]],
    estados: [[]],
    fechaInicio: [],//getFechaInicio(),
    fechaFin: [],//getFechaFin(),
    tipoBusqueda: [""],
    dataBusqueda: [""],
  });

  dataBusqueda: any[] = [
    { id: "CODIGO", nombre: "Código" },
    { id: "CORREO", nombre: "Correo Electrónico" },
    { id: "DNI", nombre: "Nro Documento" },
    { id: "NOMBRES", nombre: "Apellidos y Nombres" },
    { id: "CELULAR", nombre: "Número Teléfono" }
  ];

  EstadosSolicitud: any[] = [
    { id: 1, nombre: "Por Revisar" },
    { id: 10, nombre: "RC" },
    // { id: 4, nombre: "Resuelto por el R" },
  ];

  tipoBusquedaSelect: any;
  datoAlumno: string = "";
  dataEstados: any;

  ngOnInit(): void {
    console.log("1/2m")
    this.idPersonal=this.userService.userData.idPersonal
  }

      /**
   * @description Retorna los datos del formulario
   * @return {IFormReporte} IFormReporte
   */
      get dataFormFiltro(): IFormReporte {
        return this.formSolicitudAlumno.getRawValue() as IFormReporte;
      }

  get fechaActual(): Date {
    return new Date();
  }

  buscarAlumno() {
    this.loaderGrid = true;
    if(this.tipoBusquedaSelect!=null){
      switch (this.tipoBusquedaSelect) {
        case "CODIGO":
            if (this.datoAlumno !== "") {
              let params: any = [{ clave: "valor", valor: this.datoAlumno }];
              this.integraService
                .obtenerPorPathParams(constApiOperaciones.ObtenerMatriculaPorCodigo, params)
                .subscribe({
                  next: (response: HttpResponse<any>) => {
                    if (response.body != null) {
                      this.idMatriculaCabecera=response.body.id
                      this.buscarSolicitudesAlumno(response.body.id)
                      this.loaderGrid=false;
                    } else {
                      Swal.fire(
                        "Error!",
                        "No se encontraron datos asociados.",
                        "warning"
                      );
                      this.loaderGrid=false;
                    }
                  },
                  error: error => {
                    this.mostrarMensajeError(error);
                  },
                  complete: () => {}
                });
            } else {
                Swal.fire("Alerta!", "Ingrese un código de matrícula.", "warning");
                this.loaderGrid = false;
            }
            break;
        case "CORREO":
            if (this.datoAlumno !== "") {
              let params: any = [{ clave: "valor", valor: this.datoAlumno }];
              this.integraService
                .obtenerPorPathParams(constApiOperaciones.ObtenerMatriculaPorCorreo, params)
                .subscribe({
                  next: (response: HttpResponse<any>) => {
                    if (response.body != null) {
                      this.idMatriculaCabecera=response.body.idMatriculaCabecera
                      this.buscarSolicitudesAlumno(response.body.idMatriculaCabecera)
                      this.loaderGrid = false;
                    } else {
                      Swal.fire(
                        "Error!",
                        "No se encontraron datos asociados.",
                        "warning"
                      );
                      this.loaderGrid=false;
                    }
                  },
                  error: error => {
                    this.mostrarMensajeError(error);
                  },
                  complete: () => {}
                });
            } else {
                Swal.fire("Alerta!", "Ingrese un correo de alumno.", "warning");
                this.loaderGrid = false;
            }
            break;
        case "DNI":
            if (this.datoAlumno !== "") {
              console.log("TIPO", this.tipoBusquedaSelect);
              let params: any = [{ clave: "valor", valor: this.datoAlumno }];
              this.integraService
                .obtenerPorPathParams(constApiOperaciones.ObtenerMatriculaPorDNI, params)
                .subscribe({
                  next: (response: HttpResponse<any>) => {
                    if (response.body != null) {
                      this.idMatriculaCabecera=response.body.idMatriculaCabecera
                      this.buscarSolicitudesAlumno(response.body.idMatriculaCabecera)
                      this.loaderGrid = false;
                    } else {
                      Swal.fire(
                        "Alerta!",
                        "No se encontraron datos asociados.",
                        "warning"
                      );
                      this.loaderGrid=false;
                    }
                  },
                  error: error => {
                    this.mostrarMensajeError(error);
                  },
                  complete: () => {}
                });
            } else {
                Swal.fire("Alerta!", "Ingrese un número de documento.", "warning");
                this.loaderGrid = false;
            }
            break;
        case "CELULAR":
            if (this.datoAlumno !== "") {
              this.integraService
              .postJsonResponse(constApiOperaciones.ObtenerMatriculaPorCelular, { Valor: this.datoAlumno })
              .subscribe({
                next: response => {
                  if(response.body!=null){
                    this.listaMatricula = response.body;
                    this.idMatriculaCabecera=response.body.idMatriculaCabecera
                    this.buscarSolicitudesAlumno(response.body.idMatriculaCabecera)
                    this.loaderGrid=false;
                  }
                  else{
                    Swal.fire("Alerta!", "No se encontraron datos asociados", "warning");
                    this.loaderGrid = false;
                  }
                },
                error: error => {
                  Swal.fire("Alerta!", "No se encontraron datos asociados", "warning");
                  this.loaderGrid = false;
                },
                complete: () => {}
              });
            } else {
                Swal.fire("Alerta!", "Ingrese un número de celular.", "warning");
                this.loaderGrid = false;
            }
            break;
        case "NOMBRES":
            if (this.idMatriculaCabeceraAlumno != null) {
              this.buscarSolicitudesAlumno(this.idMatriculaCabeceraAlumno)
              this.loaderGrid=false
            } else {
                Swal.fire("Error!", "Debe ingresar un dato del alumno.", "warning");
                this.loaderGrid = false;
            }
            break;
        default:
            Swal.fire("Alerta!", "Seleccione un tipo de búsqueda válido.", "warning");
            this.loaderGrid = false;
            break;
      }
    }
    else {
      this.buscarSolicitudesAlumno(null);
    }
  }

  mostrarMensajeError(error: any): void {
    this.loaderGrid = false;
    Swal.fire({
      icon: "error",
      html: `<p class="text-start">${error.error}</p>
          <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    });
  }
  
  buscarSolicitudesAlumno(idMatriculaCabecera :any){
    const filtro: IFiltroEnvio = {
      idMatriculaCabecera: idMatriculaCabecera,
      idEstadoSolicitud: this.dataFormFiltro.estados,
      fechaInicio: this.dataFormFiltro.fechaInicio,
      fechaFin: this.dataFormFiltro.fechaFin,
      idUsuario:this.userService.userData.idPersonal
    };
    if(new Date(filtro.fechaFin) < new Date(filtro.fechaInicio)){
      this.alertaService.swalFireOptions({
        icon: 'warning',
        text: 'Rango de fechas no valido'
      });
      return;
    }
    this.integraService
      .obtenerPorFiltro(constApiOperaciones.obtenerSolicitudesPorAlumnoRevision, filtro)
      .subscribe({
        next: (response: any) => {
          if (response != null) {
            this.dataSolicitudesAlumno=response.body;
            this.alertaService.mensajeExitosoCarga();
            if(this.dataSolicitudesAlumno.length<=0){
              Swal.fire("Alerta!", "No se encontraron  registros", "success");
            }
            this.loaderGrid = false;
          }
        },
      });
  }

  tipoBusquedaChangue(e: any) {
    this.formSolicitudAlumno.get("dataBusqueda").setValue("");
    this.idMatriculaCabecera=0;
    if (e === "CORREO" || e === "DNI" || e === "CODIGO" || e==="CELULAR") {
      this.disabled = false;
      this.busquedaNombre = false;
    } else if (e === "NOMBRES") {
      this.formSolicitudAlumno.get("alumno").setValue(null);
      this.busquedaNombre = true;
    } else {
      this.disabled = true;
      this.busquedaNombre=false;
    }
  }

  filterContacto(value: string) {
    if (value.length >= 3) {
      this.alumno.loading = true;
      this.integraService
      .postJsonResponse(constApiOperaciones.ObtenerAlumnoPorValor, {valor: value})
      .subscribe({
          next: (resp) => {
            this.alumno.loading = false;
            this.sourceContacto = resp.body.slice();
            this.dataContacto = resp.body.slice();
          },
        });
    } else if (value.length >= 1) {
      this.dataContacto = [];
    } else {
      this.dataContacto = this.sourceContacto;
      this.alumno.toggle(false);
    }
  }
  
  CargarDataAlumno(event: any) {
    //Carga data restande del campo matricula en base al nombre del alumno
    if (typeof event == "object") {
      if (typeof event.id == "number" && event.id != -1) {
        this.ObtenerCodigoMatriculaPEspecificoPorAlumnos(event.id);
      }
    }
  }

  ObtenerCodigoMatriculaPEspecificoPorAlumnos(idAlumno: number) {
    this.integraService
      .getJsonResponse(
      constApiOperaciones.ObtenerCodigoMatriculaPEspecificoPorAlumnos + "/" + idAlumno)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          if (response.body.length > 0) {
            this.listaMatricula = [];
            this.listaPrograma = [];
            var i = 0;
            console.log("TIPO", this.tipoBusquedaSelect);
            let params: any = [
              { clave: "valor", valor: response.body[0].codigoMatricula }
            ];
            this.integraService
              .obtenerPorPathParams(constApiOperaciones.ObtenerMatriculaPorCodigo, params)
              .subscribe({
                next: (response: HttpResponse<any>) => {
                  if (response.body != null) {
                    this.idMatriculaCabecera=response.body.id
                    this.idMatriculaCabeceraAlumno=response.body.id
                  } else {
                    Swal.fire(
                      "Error!",
                      "No se encontraron datos asociados.",
                      "warning"
                    );
                  }
                },
                error: error => {
                  this.mostrarMensajeError(error);
                },
                complete: () => {}
              });
            console.log(this.listaPrograma);
          } else {
            Swal.fire(
              "Error!",
              "No se encontraron datos asociados.",
              "warning"
            );
          }
        },
        error: error => {
          this.mostrarMensajeError("Programa-código matrícula");
        },
        complete: () => {}
      });
  }

  cargarDropDownlist(e:any){
    if(e==1 || e==3){
      this.datoContenidoBusqueda=[]
      this.hiddenDropDownList1=true
      this.hiddenDropDownList2=true
      this.hiddenInput=false
    }
    if(e==2){
      this.hiddenInput=true
      this.hiddenDropDownList1=false
      this.hiddenDropDownList2=true
    }
    if(e==4){
      this.hiddenInput=true
      this.hiddenDropDownList1=true
      this.hiddenDropDownList2=false
    }
    this.band=false;
  }

  filterChangePersonal(event:any){
    if(event.length==0)
    {
      this.itemslistaPersonal=this.dataContenido.slice(0,200);
    }
    else
    {
      this.itemslistaPersonal= this.dataContenido.filter(
        (s:any) => s.nombres.toUpperCase().indexOf(event.toUpperCase()) !== -1
      );
    }
  }

  filterChangeEstado(event:any){
    if(event.length==0)
    {
      this.itemslistaEstado=this.dataContenidoEstados.slice(0,200);
    }
    else
    {
      this.itemslistaEstado= this.dataContenidoEstados.filter(
        (s:any) => s.nombre.toUpperCase().indexOf(event.toUpperCase()) !== -1
      );
    }
  }

  //metodo que carga la grilla con filtros
  buscarSolicitudesAlumnos() {
    //valida que no sea el campo vacio
    if (this.datoTipoBusqueda === 1) {
       console.log(this.datoTipoBusqueda,this.datoContenidoBusqueda)
       this.filtrarDatos(this.idPersonal,this.datoTipoBusqueda,null,this.datoContenidoBusqueda)
    }
    if (this.datoTipoBusqueda === 2) {
       console.log(this.datoTipoBusqueda,this.datoContenidoBusquedaD1)
       this.filtrarDatos(this.idPersonal,this.datoTipoBusqueda,this.datoContenidoBusquedaD1,null)
    }
    if (this.datoTipoBusqueda === 3) {
      console.log(this.datoTipoBusqueda,this.datoContenidoBusqueda)
      this.filtrarDatos(this.idPersonal,this.datoTipoBusqueda,null,this.datoContenidoBusqueda)
    }
    if (this.datoTipoBusqueda === 4) {
      console.log(this.datoTipoBusqueda,this.datoContenidoBusquedaD2)
      this.filtrarDatos(this.idPersonal,this.datoTipoBusqueda,this.datoContenidoBusquedaD2,null)
    }
  }

  filtrarDatos(idPersonal:any,tipoFiltro:any,Filtro1:any,Filtro2:any){
    let jsonEnvio : any = {
      IdPersonal: idPersonal,
      TipoFiltro: tipoFiltro,
      Filtro1: Filtro1,
      Filtro2: Filtro2,
    };
    console.log(jsonEnvio);
        this.integraService
          .postJsonResponse(constApiOperaciones.ObtenerSolicitudesPorFiltro, JSON.stringify(jsonEnvio))
          .subscribe({
            next: (response: HttpResponse<{ data: any; total: number }>) => {
              if (response.body !=null) {
                this.gridGestionSolicitudAlumnos.view = response.body;
                console.log(response.body)
              } else {
                this.alertaService.swalFire(
                  'Error!',
                  'Ocurrio un problema al filtrar.',
                  'warning'
                );
              }
            },
            error: (error) => {
              this.alertaService.notificationError(error.error);
            },
            complete: () => {},
    });
  }

  abrirModalDetalleSolicitud(e:any){
      let fechaRegistro=new  Date(e.fechaRegistro);
      let formattedDate = this.datepipe.transform(fechaRegistro, 'dd/MM/YYYY')
      this.formCategoria.get("Id").setValue(e.id);
      this.formCategoria.get("prioridad").setValue(e.prioridad);
      this.formCategoria.get("tipoReporte").setValue(e.tipo);
      this.formCategoria.get("categoria").setValue(e.nombreSolicitudCategoria);
      this.formCategoria.get("subCategoria").setValue(e.nombreSubCategoria);
      this.descripcionSubCategoria = e.tituloSubCategoria || '';
      this.formCategoria.get("origenSolicitud").setValue(e.controlSolicitudOrigen);
      this.formCategoria.get("solicitud").setValue(e.nombreSolicitud);
      if (e.areaSolicitante in this.areaMapping) {
        var areaS = this.areaMapping[e.areaSolicitante];
      } else {
        var areaS = 'Atención al Cliente';
      }
      this.formCategoria.get("areaSolicitante").setValue(areaS);
      this.formCategoria.get("solicitante").setValue(e.nombreSolicitante);
      this.formCategoria.get("codigoAlumno").setValue(e.codigoMatricula);
      this.formCategoria.get("nombreAlumno").setValue(e.nombreAlumno);
      this.formCategoria.get("curso").setValue(e.nombrePEspecifico);
      this.formCategoria.get("programa").setValue(e.pGeneral);
      this.formCategoria.get("centroCosto").setValue(e.centroCosto);
      this.formCategoria.get("detalleSolicitud").setValue(e.detalleSolicitud);
      this.formCategoria.get("areaRevision").setValue(e.areaRevision);
      this.formCategoria.get("personalRevision").setValue(e.personalRevision);
      this.formCategoria.get("areaSolucion").setValue(e.areaSolucion);
      this.formCategoria.get("personalSolucion").setValue(e.personalSolucion);
      this.formCategoria.get("fechaRegistro").setValue(formattedDate);
      this.formCategoria.get("comentario").setValue(e.comentarioSolucion);
      this.formCategoria.get("archivoSolucion").setValue(e.nombreArchivoSolucion);
      this.formCategoria.get("estadoSolicitud").setValue(e.estadoSolicitud);
      const estadoEncontrado = this.estadosRevision.find(
        (estado: any) => estado.nombre === e.estadoSolicitud
      );
      this.idNuevoEstado = estadoEncontrado ? estadoEncontrado.id : undefined;
      this.modalRefTCOrigen = this.modalService.open(this.modalDetalleSolicitud,{size:'lg'});
      this.nombreArchivoSolicitado=e.nombreArchivoSolicitante;
      this.nombreArchivoSolucion=e.nombreArchivoSolucion;
      this.loaderModal = false;
  }

  actualizarDatosSolicitudAlumno(){
    this.loaderModal=true;
    console.log(this.formCategoria.get("Id").value);
    var idSolicitudAlumno=this.formCategoria.get("Id").value;
    if((this.idNuevoEstado===undefined || this.idNuevoEstado==1) && this.inputDetalle!=""){
      this.alertaService.swalFire(
        'Error!',
        'Debe Elegir Un Nuevo Estado',
        'warning'
      );
    }
    if((this.inputDetalle===""|| this.inputDetalle===undefined)&& (this.idNuevoEstado!=undefined || this.idNuevoEstado!=1)){
      this.alertaService.swalFire(
        'Error!',
        'Debe Ingresar Comentario',
        'warning'
      );
    }
    if((this.inputDetalle===""|| this.inputDetalle===undefined)&& (this.idNuevoEstado===undefined || this.idNuevoEstado==1)){
      this.alertaService.swalFire(
        'Error!',
        'Debe Ingresar Comentario y Nuevo Estado',
        'warning'
      );
    }
    if(this.idNuevoEstado!=undefined && this.idNuevoEstado!=undefined && this.inputDetalle!=""){
      var usuario=this.userService.userData.userName;
      const formData = new FormData();
      formData.append('id', idSolicitudAlumno);
      formData.append('ComentarioSolucion', this.inputDetalle);
      formData.append('IdEstadoSolicitud', this.idNuevoEstado);
      formData.append('Usuario',usuario);
      if (this.inputArchivoSolucionAlumno == undefined) {
        console.log('no hay archivos');
      } else if (this.inputArchivoSolucionAlumno.length > 0) {
        for (let index = 0; index < this.inputArchivoSolucionAlumno.length; index++) {
          formData.append('Files', this.inputArchivoSolucionAlumno[index]);
        }
      }
      console.log(formData.getAll('Files'));
      console.log(idSolicitudAlumno,this.inputDetalle,this.idNuevoEstado)
      this.integraService
        .insertarFormData2(constApiOperaciones.RevisarSolicitudesAlumo, formData)
        .subscribe({
          next: (response: boolean) => {
            console.log(response);
            if (response!=null) {
              this.loaderModal=false;
              this.modalService.dismissAll(this.modalDetalleSolicitud);
              this.limpiarDatos();
              this.buscarAlumno();
              this.alertaService.swalFire(
                'Exitoso!',
                'Se actualizaron los datos correctamente',
                'success'
              );
            }
          },
          error: (error) => {
            this.mostrarshowError(error);
          },
          complete: () => {},
        });
    }
    else{
      this.loaderModal=false;
    }
  }

  limpiarDatos(){
    this.inputDetalle=""
    this.idNuevoEstado=[]
    this.inputArchivoSolucionAlumno=[]
  }

  descargarArchivoSolicitud(){
    if(this.nombreArchivoSolicitado===undefined || this.nombreArchivoSolicitado===null){
      this.alertaService.swalFireOptions({
        icon: 'error',
        text: 'Archivo no encontrado',
      });
    }
    else{
    let url='https://repositorioweb.blob.core.windows.net/repositorioweb/solicitudes/'+this.nombreArchivoSolicitado;
    window.open(url, 'EPrescription');}
  }

  mostrarshowError(error: any): void {
    Swal.fire({
      icon: 'error',
      html: `<p class='text-start'>${error.error}</p>
            <p class='text-start text-danger fs-6'>${error.message}</p>`,
      allowOutsideClick: false,
    });
  }

  // ============================================================
  // Modal Chat WhatsApp ATC
  // ============================================================

  /**
   * Abre el modal y consulta los mensajes del chat de WhatsApp ATC asociados a la solicitud
   * actualmente cargada en formCategoria. El endpoint devuelve el formato de
   * ChatbotWhatsAppMensajeDTO con las mismas categorías que chat-messages.component.
   */
  abrirModalChatWhatsApp(): void {
    const idSolicitud = this.formCategoria.get('Id').value;
    if (!idSolicitud) {
      this.alertaService.swalFireOptions({ icon: 'warning', text: 'No hay solicitud cargada' });
      return;
    }

    this.mensajesChatWhatsApp = [];
    this.loadingChatWhatsApp = true;
    this.modalRefChatWhatsApp = this.modalService.open(this.modalChatWhatsApp, { size: 'lg', backdrop: 'static' });

    this.integraService
      .postJsonResponse(constApiOperaciones.ObtenerChatBotWhatsAppAtcPorSolicitudAlumno, { idSolicitud })
      .subscribe({
        next: (response: HttpResponse<ChatMensajeAtcDTO[]>) => {
          this.mensajesChatWhatsApp = response.body || [];
          this.loadingChatWhatsApp = false;
        },
        error: () => {
          this.mensajesChatWhatsApp = [];
          this.loadingChatWhatsApp = false;
          this.alertaService.swalFireOptions({ icon: 'error', text: 'No se pudo cargar el chat' });
        }
      });
  }

  /** Mensaje del alumno/contacto (izquierda). */
  esDelAlumno(mensaje: ChatMensajeAtcDTO): boolean {
    return mensaje.esUsuario;
  }

  /** Mensaje del bot (derecha, púrpura). */
  esDelBot(mensaje: ChatMensajeAtcDTO): boolean {
    return mensaje.esBot === 1;
  }

  /**
   * Mensaje del asesor humano (derecha, verde). Los HSM (templates pre-aprobados) NO entran
   * acá — replica del comportamiento del componente origen para que no se rendericen.
   */
  esDelAsistente(mensaje: ChatMensajeAtcDTO): boolean {
    return !mensaje.esUsuario && mensaje.esBot === 0 && mensaje.waType !== 'hsm';
  }

  /** Formatea fecha del mensaje en es-ES con día, mes, año, hora y minutos. */
  formatFechaChat(fecha?: string): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

}

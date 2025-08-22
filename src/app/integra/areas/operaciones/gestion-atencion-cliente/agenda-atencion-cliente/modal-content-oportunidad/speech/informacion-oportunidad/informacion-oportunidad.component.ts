import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { constApiOperaciones } from '@environments/constApi';
import { constApi, constApiComercial } from '@environments/constApi';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { DropDownFilterSettings } from '@progress/kendo-angular-dropdowns';
import { KendoGrid } from '@shared/models/kendo-grid';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-informacion-oportunidad',
  templateUrl: './informacion-oportunidad.component.html',
  styleUrls: ['./informacion-oportunidad.component.scss']
})
export class InformacionOportunidadComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService
  rowActual: any;
  estadoMatricula: any;
  subEstadoMatricula:any;
  centroCosto:any;
  tarifario:any;
  categoriaAlumno:any;
  objetoCategoriaAlumno:any;
  colorRankingOperaciones:any;
  solicitudEsquemasEvaluacion:any;
  fechaFinalizacion:any;
  formSolicitudes: FormGroup = this.formBuilder.group({
    nuevaFechaFinalizacion: [null],
    idEstadoMatricula: [null],
    idCategoriaAlumno: [null],
    idSubEstadoMatricula: [null],
    idCentroCosto: [null],
    comentarioSolicitud: [null],
  });
  formEsquemaEvaluacion: FormGroup = this.formBuilder.group({
    esquemaEvaluacion: [null],
  });
  modalRef: any;

  filterSettings_estados: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  filterSettings_subEstado: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };
  verEstado=false;
  verSubEstado=false;
  verCentroCosto=false;
  verFechaFinalizacion=false;
  verCategoriaAlumno=false;
  verCambioVersion=false;
  verCambioGeneral=false;
  verAdjuntarComprobante=false;
  conSubEstado=false;
  textoSubEstado="";
  idTipoCambioOperacionesGeneral:any;
  tituloModalSolicitudCambio:any;
  dataEstadoMatricula:any;
  dataCentroCosto: any;
  disableBotonSolicitarCambio=false;
  dataSubEstadoMatricula:any[];
  dataComboSubEstadoMatricula:any;
  personal:any;
  esCordinadora:any;
  informacionCursoPrograma:any[];
  idPEspecificoGlobal:any;
  listaEsquemaEvaluacion:any[];
  verContenedorEsquemasPorPEspecifico=false;
  dataEsquemaEvalueacion:any;
  inputFormaCalculoNota:any;
  dataEsquemaEvaluacionAlumno:any;
  buttonSolicitud:boolean=false;
  @ViewChild('modalSolicitudCambio') modalSolicitudCambio: any;
  @ViewChild('modalEsquemaEvaluacion') modalEsquemaEvaluacion: any;

  gridEsquemaEvaluacion: KendoGrid = new KendoGrid();
  gridEsquemaEvaluacionAlumno: KendoGrid = new KendoGrid();


  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private integraService: IntegraService,
    private userService: UserService,
  ) {}

  ngOnInit(): void {
    this.rowActual=this.agendaService.rowActual;
    this.personal=this.agendaService.datosPersonal;
    this.agendaService.esCoordinadora$.subscribe({
      next:(response:any)=>{
        this.esCordinadora=response;
      }
    })
    this.obtenerCategoriaAlumno();
    this.agendaService.agendaAlumnoOperacionesService.estadosMatricula$.subscribe({
      next: (response: any) => {
        this.dataEstadoMatricula=response;
      }
    });
    this.agendaService.agendaAlumnoOperacionesService.subEstadoMatricula$.subscribe({
      next: (response: any) => {
        this.dataSubEstadoMatricula=response;
      }
    });
    this.cargarPantalla1();
  }

  cargarPantalla1(){
    this.estadoMatricula=this.rowActual.estadoMatricula;
    this.subEstadoMatricula=this.rowActual.subEstadoMatricula;
    this.centroCosto=this.rowActual.centroCosto;
    this.tarifario=this.rowActual.tarifario;
    this.obtenerFechaPagoCategoria(this.rowActual.idMatriculaCabecera);
    this.obtenerNombreEsquemaEvaluacionPorMatricula(this.rowActual.idMatriculaCabecera);
    this.obtenerfechafinalizacionMatricula();
    if (this.rowActual.fechaGrabacion !== null) {
      // $("#RankingOperaciones").css('background', '#088A08');//verde
      this.colorRankingOperaciones='#088A08'
    }
    else if (this.rowActual.fechaVerificacion !== null) {
       var fechaactual = new Date();
      if ((this.calcularDiferenciaDiasFecha(new Date(), new Date(this.rowActual.fechaVerificacion)))<7
      ) {
          //$("#RankingOperaciones").css('background', '#3379a4');//azul
          this.colorRankingOperaciones='#3379a4'
      }
      if ((this.calcularDiferenciaDiasFecha(new Date(), new Date(this.rowActual.fechaVerificacion)))>= 7) {
          // $("#RankingOperaciones").css('background', '#FF0000');//rojo
          this.colorRankingOperaciones='#FF0000'
      }
    }
    else {
      // $("#RankingOperaciones").css('background', '#FF0000');//rojo
      this.colorRankingOperaciones='#FF0000'
    }
    console.log("here")
  }
  obtenerFechaPagoCategoria(idMatriculaCabecera:any){
    //obtenerFechaPagoCategoria$
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerFechaPagoCategoria$(idMatriculaCabecera)
      .subscribe({
        next: (response: any) => {
          let data=response.body;
          console.log(response.body);
          var valEstado = data[0].idEstado_matricula;
            var valSubestado = data[0].idSubEstadoMatricul;
            var fechaven = data[0].fechaVencimiento;
            var fechapag = data[0].fechaPago;
            var idCategoriaAlumno = data[0].idCategoriaAlumno;
            if (idCategoriaAlumno != null) {
                var aux = this.objetoCategoriaAlumno[idCategoriaAlumno]["nombre"];
                this.categoriaAlumno=aux;
                return aux;
            }
            var fecha2;
            if (fechapag == null) {
                const fecha = new Date();
                // fecha2 = moment(fecha.toISOString());
                fecha2 = fecha.toISOString();

            }
            else {
                // fecha2 = moment(fechapag);
                fecha2 = new Date(fechapag);

            }
            // var fecha1 = moment(fechaven);
            let fecha1 = new Date(fechaven);
            // let diferencia = new Date(fechapag).getDay()-new Date(fechaven).getDay();
            let diferencia = this.calcularDiferenciaDiasFecha(fecha2,fecha1);
            if (diferencia >= 0) {
              this.categoriaAlumno="Estandar";
                return "Estandar";
            }

            
            var valdias = diferencia * -1;

            for (let clave in this.objetoCategoriaAlumno) {
                let nombre = this.objetoCategoriaAlumno[clave]["nombre"];
                let idEstado:any[] = this.objetoCategoriaAlumno[clave]["idEstados"].split(',').map(Number);
                let aux = this.objetoCategoriaAlumno[clave]["idSubEstados"]
                let vencimiento = this.objetoCategoriaAlumno[clave]["cantidadDiasVencimiento"];
                let a = idEstado.find(val => val == valEstado);
                if (aux == null) {
                    if (a != undefined) {
                        if (vencimiento <= valdias) {
                            this.categoriaAlumno=nombre;
                            return nombre;
                        }
                    }
                    else {
                        this.categoriaAlumno="No definido";
                        return "No definido";
                    }
                }
                var idSubestado:any[] = this.objetoCategoriaAlumno[clave]["idSubEstados"].split(',').map(Number);

                if (a != undefined) {

                    var b = idSubestado.find(val => val == valSubestado);
                    if (b != undefined) {
                        if (vencimiento <= valdias) {
                            this.categoriaAlumno=nombre;
                            return nombre;
                        }
                    }
                    if (vencimiento <= valdias) {
                        this.categoriaAlumno=nombre;
                        return nombre;

                    }
                }
            }
            this.categoriaAlumno="No definido";
            return "No definido";
        },
      })
  }
  obtenerCategoriaAlumno(){
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerCategoriaAlumno$()
      .subscribe({
        next: (response: any) => {
          let data=response.body;
          this.objetoCategoriaAlumno = data;
        },
      })
  }
  calcularDiferenciaDiasFecha(fechaIni:any, fechaFin:any){
    return Math.floor((Date.UTC(fechaIni.getFullYear(), fechaIni.getMonth(), fechaIni.getDate()) - Date.UTC(fechaFin.getFullYear(), fechaFin.getMonth(), fechaFin.getDate()) ) /(1000 * 60 * 60 * 24));
  }

  obtenerNombreEsquemaEvaluacionPorMatricula(idMatriculaCabecera:any){
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerNombreEsquemaEvaluacionPorMatricula$(idMatriculaCabecera)
    .subscribe({
      next: (response: any) => {
        console.log(response);
        let data=response.body;
        this.solicitudEsquemasEvaluacion = data;
      },
    })
  }

  obtenerfechafinalizacionMatricula(){
    this.agendaService.agendaAlumnoOperacionesService.fechaFinalizacionMatricula$.subscribe(
      {
        next:(response:any)=>{
          console.log(response);
          this.fechaFinalizacion=response.rptas;
        }
      }
    )
  }

  limpiarModalSolicitudCambio()
  {
    this.verEstado=false;
    this.verSubEstado=false;
    this.verCentroCosto=false;
    this.verFechaFinalizacion=false;
    this.verCategoriaAlumno=false;
    this.verCambioVersion=false;
    this.verCambioGeneral=false;
    this.verAdjuntarComprobante=false;
    this.formSolicitudes.get('idEstadoMatricula').setValue(null);
    this.formSolicitudes.get('idCategoriaAlumno').setValue(null);
    this.formSolicitudes.get('idSubEstadoMatricula').setValue(null);
    this.formSolicitudes.get('comentarioSolicitud').setValue("");
    this.modalRef.close();
  }

  abrirModalSolicitudCambio(idTipoSolicitudOperaciones: any) {
    
    if (idTipoSolicitudOperaciones === 1) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.tituloModalSolicitudCambio="Solicitar Cambio Centro Costo";
      this.verCentroCosto=true;

  }
  else if (idTipoSolicitudOperaciones === 3) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.tituloModalSolicitudCambio="Solicitar Cambio de Version";
      this.verCambioVersion=true;

  }
  else if (idTipoSolicitudOperaciones === 4) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.verSubEstado=false;

      this.tituloModalSolicitudCambio="Solicitar Cambio Estado";
      //$("#lblValorNuevo").text("Nuevo Estado");
      this.verEstado=true;

  }
  else if (idTipoSolicitudOperaciones === 5) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      let subestadoActual = this.rowActual.SubEstadoMatricula
      let dataItem = this.dataSubEstadoMatricula.filter(x => x.idEstadoMatricula === this.rowActual.idEstadoMatricula && x.nombre!==subestadoActual);
      this.dataComboSubEstadoMatricula=dataItem;

      if (dataItem.length === 0) {
        this.conSubEstado=false;
          this.textoSubEstado="El Sub Estado se  Genera Automaticamentes";
          this.disableBotonSolicitarCambio=true;
      }
      else {
        this.conSubEstado=true;
        this.textoSubEstado="";
        this.disableBotonSolicitarCambio=false;
      }

      this.tituloModalSolicitudCambio="Solicitar Cambio Sub Estado";
      //$("#lblValorNuevo").text("Nuevo Sub Estado");
      this.verSubEstado=true;
  }
  else if (idTipoSolicitudOperaciones === 6) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.tituloModalSolicitudCambio="Solicitar Cambio de AutoEvaluaciones";
      //$("#lblValorNuevo").text("AutoEvaluacion");
      this.verCambioGeneral=true;
  }
  else if (idTipoSolicitudOperaciones === 7) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.tituloModalSolicitudCambio="Solicitar Cambio de Fecha de Finalizacion";
      //$("#lblValorNuevo").text("AutoEvaluacion");
      this.verFechaFinalizacion=true;
  }
  else if (idTipoSolicitudOperaciones === 9) {
      this.idTipoCambioOperacionesGeneral = idTipoSolicitudOperaciones;
      this.tituloModalSolicitudCambio="Solicitar Cambio Categoria";
      this.verCategoriaAlumno=true;
  }
    this.modalRef = this.modalService.open(this.modalSolicitudCambio, {
      size: 'small',
      animation: true,
      backdrop: 'static',
    });
  }

  filterByCentroCosto(value: string) {
    if (value.length >= 4) {
      this.integraService
        .obtenerPorFiltro(constApiComercial.CentroCostoObtenerAutocompleteCentroCosto, {
          valor: value,
        })
        .subscribe({
          next: (response) => {
            this.dataCentroCosto = response.body;
          },
        });
    } else {
      this.dataCentroCosto = [];
    }
  }
  registrarSolicitudOperaciones() {
    this.buttonSolicitud=true;
    console.log('nomefunciona')
    let cantidadSubEstado=0;
    if(this.formSolicitudes.get('comentarioSolicitud').value == null){
      return Swal.fire({
        icon: 'warning',
        title: "Ingrese un comentario Por favor",
      });
    }
    if (this.idTipoCambioOperacionesGeneral === 2) {}
    else{
      let objeto:any = new Object();
      objeto.idTipoSolicitudOperaciones = this.idTipoCambioOperacionesGeneral;
      objeto.idOportunidad = this.rowActual.idOportunidad;
      if (!this.esCordinadora) {
        objeto.aprobado = false;
        objeto.idPersonalSolicitante = this.rowActual.idPersonal_Asignado;
        objeto.idPersonalAprobacion = this.personal.idJefe;
      }
      else {
          objeto.aprobado = true;
          // objeto.idPersonalAprobacion = this.rowActual.idPersonal_Asignado;
          objeto.idPersonalSolicitante = this.userService.idPersonal;
          objeto.idPersonalAprobacion = this.userService.idPersonal;

      }
      if (this.idTipoCambioOperacionesGeneral === 1)/*1: Centro Costo*/ {
          if(this.formSolicitudes.get('idCentroCosto').value == null){
            return Swal.fire({
              icon: 'warning',
              title: "Ingrese un Centro de Costo Por favor",
            });
          }
          objeto.valorAnterior = this.rowActual.centroCosto;
          objeto.valorNuevo =this.formSolicitudes.get('idCentroCosto').value.nombre ;
          objeto.comentarioSolicitante =this.formSolicitudes.get('comentarioSolicitud').value;
          objeto.usuario = this.agendaService.userName;
      }
      // else if (this.idTipoCambioOperacionesGeneral === 3)/*3: Version*/ {
      //     objeto.valorAnterior = ObjetoCronogramaFinanzas[0].VersionPrograma === 1 ? "Básica" : ObjetoCronogramaFinanzas[0].VersionPrograma === 2 ? "Profesional" : ObjetoCronogramaFinanzas[0].VersionPrograma === 3 ? "Gerencial" : "sin versión";
      //     objeto.valorNuevo = $('#inputValorVersion').data("kendoDropDownList").text();
      //     objeto.comentarioSolicitante = $("#inputComentarioSolicitante").val();
      //     objeto.usuario = UserName;
      // }
      else if (this.idTipoCambioOperacionesGeneral === 4)/*4: Estado*/ {
          let estado = this.formSolicitudes.get('idEstadoMatricula').value;
          // let subEstado = this.formSolicitudes.get('idSubEstadoMatricula').value;
          let subEstado = estado?.estadoMatricula == "ABANDONO" ?  {id: 20, nombre: 'Abandonado', idEstadoMatricula: 8}
          : this.formSolicitudes.get('idSubEstadoMatricula').value;
          if(
            this.dataComboSubEstadoMatricula?.length!==0 && 
            subEstado?.nombre == null &&
             estado?.estadoMatricula!=="REGULAR"
             ){
            Swal.fire({
              icon: 'warning',
              title: "Seleccione un Sub Estado",
            })
            return alert("Seleccione un Sub Estado");
          }
          if (this.conSubEstado) {
            cantidadSubEstado = this.dataComboSubEstadoMatricula.length;
          }
          
          objeto.valorAnterior = this.rowActual.estadoMatricula;
          objeto.valorNuevo = this.formSolicitudes.get('idEstadoMatricula').value.estadoMatricula;
          objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
          objeto.usuario = this.agendaService.userName;
          if (objeto.valorNuevo === 'ABANDONO' || (objeto.valorNuevo === 'REGULAR' && subEstado?.nombre != 'En Recuperación de Curso') )
          {
              cantidadSubEstado = 0;
          }
          else
          {
              objeto.valorNuevoSubestado = this.formSolicitudes.get('idSubEstadoMatricula').value.nombre;
          }
          
      }
      else if (this.idTipoCambioOperacionesGeneral === 5)/*5: SubEstado*/ {
          objeto.valorAnterior = this.rowActual.subEstadoMatricula === null ? "Sin SubEstado" : this.rowActual.subEstadoMatricula;
          objeto.valorNuevo = this.formSolicitudes.get('idSubEstadoMatricula').value.nombre;
          objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
          objeto.usuario = this.agendaService.userName;
      }
      // else if (this.idTipoCambioOperacionesGeneral === 6)/*6: Autoevaluaciones*/ {
      //     objeto.valorAnterior = this.rowActual.centroCosto;
      //     objeto.valorNuevo = $("#inputValor").val();
      //     objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
      //     objeto.usuario = this.agendaService.userName;
      // }
      else if (this.idTipoCambioOperacionesGeneral === 7)/*7: Fecha Finalizacion*/ {
          let datePipe = new DatePipe('en-US');
          objeto.valorAnterior = datePipe.transform(this.fechaFinalizacion, 'dd/MM/yyyy');
          objeto.valorNuevo =  datePipe.transform(this.formSolicitudes.get('nuevaFechaFinalizacion').value, 'dd/MM/yyyy');
          objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
          objeto.usuario = this.agendaService.userName;
      }
      else if (this.idTipoCambioOperacionesGeneral === 9)/*9: Categoria Alumno*/ {
          objeto.valorAnterior = this.categoriaAlumno;
          objeto.valorNuevo = this.formSolicitudes.get('idCategoriaAlumno').value.nombre;
          objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
          objeto.usuario = this.agendaService.userName;
      }
      
      //Insertar solicitud de operaciones
      this.agendaService.agendaInformacionActividadOportunidadOperacionesService.insertarSolicitudOperaciones$(objeto).subscribe({
        next:(response:any)=>{
          this.buttonSolicitud=false;
          console.log(response);
          let data=response;
          console.log("insercionsolicitudoperaciones");
          this.cargarHistorialSolicitudOperaciones()
          if(this.esCordinadora){
            this.aprobarSolicitudCoordinador(response);
            if(this.idTipoCambioOperacionesGeneral==4 && cantidadSubEstado!=0){
              objeto.idTipoSolicitudOperaciones=5;
              objeto.relacionEstadoSubEstado=data.id;
              objeto.valorAnterior=this.rowActual.subEstadoMatricula == null? "Sin SubEstado":this.rowActual.subEstadoMatricula;
              objeto.valorNuevo=this.formSolicitudes.get('idSubEstadoMatricula').value.nombre;
              objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
              objeto.idPersonalSolicitante
              this.agendaService.agendaInformacionActividadOportunidadOperacionesService.insertarSolicitudOperaciones$(objeto).subscribe({
                next:(response:any)=>{
                  this.cargarHistorialSolicitudOperaciones()
                  if(this.esCordinadora){
                    this.aprobarSolicitudCoordinador(response);
                  }
                  this.limpiarModalSolicitudCambio();
                  console.log("solicitudes");
                }
              });
            }
          }
          else{
            if(this.idTipoCambioOperacionesGeneral==4 && cantidadSubEstado!=0){
              objeto.idTipoSolicitudOperaciones=5;
              objeto.relacionEstadoSubEstado=data.id;
              objeto.valorAnterior=this.rowActual.subEstadoMatricula == null? "Sin SubEstado":this.rowActual.subEstadoMatricula;
              objeto.valorNuevo=this.formSolicitudes.get('idSubEstadoMatricula').value.nombre;
              objeto.comentarioSolicitante = this.formSolicitudes.get('comentarioSolicitud').value;
              this.agendaService.agendaInformacionActividadOportunidadOperacionesService.insertarSolicitudOperaciones$(objeto).subscribe({
                next:(response:any)=>{
                  this.cargarHistorialSolicitudOperaciones()
                }
              });
            }
          }
          this.limpiarModalSolicitudCambio();
        },
        error:(error:any)=>{
          Swal.fire({
            icon: 'error',
            title: error.error,
          })
        }
      });
    }
  }
  generarDataSubEstado(value: any){
    if(value.id!==8){
      let dataItem = this.dataSubEstadoMatricula.filter(x => x.idEstadoMatricula === value.id);
      this.dataComboSubEstadoMatricula=dataItem;
      if (dataItem.length === 0) {
          this.conSubEstado=false;
          this.textoSubEstado="El Sub Estado se  Genera Automaticamentes";
          this.disableBotonSolicitarCambio=true;
      }
      else {
        this.formSolicitudes.get('idSubEstadoMatricula').setValue(null); 
        this.conSubEstado=true;
        this.textoSubEstado="";
        this.disableBotonSolicitarCambio=false;
      }
    }
    else{
      this.conSubEstado=false;
      this.textoSubEstado="No hay sub estados Asociados";
      this.disableBotonSolicitarCambio=true;
    }
    this.verSubEstado=true;
  }
  mostrarModalEsquemasEvaluacion(){
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerEsquemaEvaluacionPorMatricula$(this.rowActual.idMatriculaCabecera).subscribe({
      next:(response:any)=>{
        console.log('esquemasJST');
        console.log(response.body);
        this.informacionCursoPrograma=response.body;
        this.cargarGrillaProgramasHijos(response.body);
        this.modalRef = this.modalService.open(this.modalEsquemaEvaluacion, {
          size: 'xl',
          animation: true,
          backdrop: 'static',
        });
      }
    });
  }

  aprobarSolicitudCoordinador(objRow:any){
    this.integraService.getJsonResponse(constApiOperaciones.SolicitudOperacionesAprobarSolicitudOperaciones + '/' + objRow.id  + '/' + this.userService.userData.userName + '/' + this.personal.id ).subscribe({
      next:(response:any)=>{
        console.log(response);
        if(response.body.idTipoSolicitudOperaciones == 4){
          this.estadoMatricula = response.body.valorNuevo;
        }
        else if (response.body.idTipoSolicitudOperaciones == 5){
          this.subEstadoMatricula = response.body.valorNuevo;
        }
        Swal.fire({
          icon: 'success',
          title: "Solicitud Aprobada Correctamente",
        })
      },
      error:(error:any)=>{
        Swal.fire({
          icon: 'error',
          title: "Error al aprobar la solicitud",
        })
      }
    });
    // if (objRow.idTipoSolicitudOperaciones === 1) {
    //   this.AprobarCambioCentroCosto(objRow);
    // }
    // else if (objRow.idTipoSolicitudOperaciones === 2) {
    //     AprobarExoneracionMora(objRow);
    // }
    // else if (objRow.idTipoSolicitudOperaciones === 3) {
    //     AprobarCambioVersion(objRow);
    // }
    // else if (objRow.idTipoSolicitudOperaciones === 4) {
    //     AprobarCambioEstado(objRow);
    // }
    // else if (objRow.idTipoSolicitudOperaciones === 5) {
    //     AprobarCambioSubEstado(objRow);
    // }
    // else if (objRow.idTipoSolicitudOperaciones === 6) {
    //     AprobarCambioEvaluacion(objRow);
    // }
    // else if (objRow.idTipoSolicitudOperaciones === 7) {
    //     AprobarCambioFechaFinalizacion(objRow);
    // }
    // else if (objRow.idTipoSolicitudOperaciones === 8) {
    //     AprobarSolicitudAccesoTemporal();
    // }
    // else if (objRow.idTipoSolicitudOperaciones === 9) {
    //     AprobarSolicitudCambioCategoria(objRow);
    // }
    this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudesRealizadas();
  }

  cargarHistorialSolicitudOperaciones(){
    this.agendaService.agendaInicializarOperacionesService.obtenerHistorialSolicitudes();
  }
  cargarGrillaProgramasHijos(data:any){
    this.gridEsquemaEvaluacion.data=data;
  }
  verEditarEsquemaEvaluacion(evento:any){
    console.log('ClickJST');
    console.log(evento.dataItem);
    let data=evento.dataItem;
    if (this.informacionCursoPrograma.length < 1) {
      //$("#inputEsquemaEvaluacion").prop("disabled", true);
    }
    this.idPEspecificoGlobal=data.idPEspecifico;
    this.listaEsquemaEvaluacion= this.informacionCursoPrograma.filter(x=>x.idPEspecifico==data.idPEspecifico);
    
    this.dataEsquemaEvalueacion=this.listaEsquemaEvaluacion[0].esquemasEvaluacion
    let temporal:any[]=this.listaEsquemaEvaluacion[0].esquemasEvaluacion;
    if (this.listaEsquemaEvaluacion[0].esquemasEvaluacion != null) {
      let esquemaEvaluacionSeleccionado = temporal.filter(x => x.idCongelamientoPEspecificoEsquemaEvaluacionMatriculaAlumno != 0);
      console.log(esquemaEvaluacionSeleccionado);
      if (esquemaEvaluacionSeleccionado[0].id != null) {
        this.formEsquemaEvaluacion.get('esquemaEvaluacion').setValue(esquemaEvaluacionSeleccionado[0].id); 
        let criteriosEvaluacion = esquemaEvaluacionSeleccionado[0].esquemasEvaluacionDetalle;
        this.cargarEsquemaEvaluacionAlumno(criteriosEvaluacion);
        this.inputFormaCalculoNota=esquemaEvaluacionSeleccionado[0].formaCalculoEvaluacion
      }
      this.verContenedorEsquemasPorPEspecifico=true;
    }
      else {
      this.verContenedorEsquemasPorPEspecifico=false;
    }
  }

  cargarEsquemaEvaluacionAlumno(criterios:any){
    this.gridEsquemaEvaluacionAlumno.data=criterios;
  }
  cambiarEsquemaEvaluacion(event:any){
    let temporal:any[]=this.listaEsquemaEvaluacion[0].esquemasEvaluacion;
    var esquemaSeleccionado = temporal.filter(x => x.Id == event);
    if (esquemaSeleccionado.length != 0) {
        var criteriosEvaluacion = esquemaSeleccionado[0].EsquemasEvaluacionDetalle;
        this.cargarEsquemaEvaluacionAlumno(criteriosEvaluacion)
    }
  }
  cerrarDetalleEsquemaEvaluacion() {
    this.verContenedorEsquemasPorPEspecifico=false;
    this.dataEsquemaEvaluacionAlumno=null;
    this.dataEsquemaEvalueacion= null;
    this.idPEspecificoGlobal = 0;
    this.modalRef.close();
  }
  actualizarEsquema(){
    this.gridEsquemaEvaluacion.loading=true;
    let objetoEsquema:any;
    objetoEsquema.idPEspecifico = this.idPEspecificoGlobal;
    objetoEsquema.idMatriculaCabecera = this.rowActual.idMatriculaCabecera;
    objetoEsquema.idEsquemaEvaluacionGeneral =this.formEsquemaEvaluacion.get('esquemaEvaluacion').value;
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.actualizarEsquema$(objetoEsquema).subscribe({
      next: (response: any) => {
        this.dataEstadoMatricula=response;
        this.cerrarDetalleEsquemaEvaluacion()
        this.gridEsquemaEvaluacion.loading=false;
        this.obtenerNombreEsquemaEvaluacionPorMatricula(this.rowActual.idMatriculaCabecera);
      }
    });
  }
}

import { IAlumnoInformacion } from './../../../../../../comercial/models/interfaces/iagenda-datos-alumno';
import { AgendaInicializarOperacionesService } from '@operaciones/services/agenda/agenda-inicializar-operaciones.service';
import { IntegraService } from '@shared/services/integra.service';
import { KendoGrid } from './../../../../../../../../shared/models/kendo-grid';
import { Component, Input, OnInit,ViewChild } from '@angular/core';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { AlertaService } from '@shared/services/alerta.service';
import { constApiOperaciones } from './../../../../../../../../../environments/constApi';
import Swal from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@shared/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-tasas-academicas-administrativas',
  templateUrl: './tasas-academicas-administrativas.component.html',
  styleUrls: ['./tasas-academicas-administrativas.component.scss'],
})
export class TasasAcademicasAdministrativasComponent implements OnInit {
  @Input() agendaService: AgendaOperacionesService;
  constructor(
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private integraService: IntegraService,
    private alertaService: AlertaService,
    private userService: UserService,
  ) {}
  
  @ViewChild('modalRepublicacionCertificado') modalRepublicacionCertificado:any;
  @ViewChild('modalAlertaCertificado') modalAlertaCertificado:any;
  @ViewChild('modalCertificadoFisico') modalCertificadoFisico:any;
  isRepublicacionCertificadoLoading: boolean = false;
  isLoading: boolean;
  modalRepublicacionCertificadoRef: NgbModalRef;
  private idPersonal: number;
  rowActualSolicitud: any;
  gridCostosAdmistrativos: MatTableDataSource<CostosAdministrativosDTO> = new MatTableDataSource();
  tieneSolicitud:boolean =false;
  private rowActual: any;
  checkDatosPersonales:boolean = false;
  retencion:number=0
  cargarGrillaCostosAdministrativos: any;
  idCertificado:number;
  alumno:IAlumnoInformacion
  objetoS:any = new Object();
  modalRefmodalCertificadoFisico:any;
  panelOpenState = false;
  colsToDisplayCostosAdministrativos = ['concepto','monto','fechaRegistro','documento','generar','republicacionCertificado','solicitarCertificadoFisico']


  objsolicitarCertificadoFisico:any = {};

  formDatosPersonalesCertificado:FormGroup =this.formBuilder.group({
    nombre: ['', Validators.required],
    duracion:'',
    fechaInicioCapacitacion:'',
    fechaFinCapacitacion:'',
    motivo:'',
    retencionChek:false,
  })

  formmodalCertificadoFisico:FormGroup = this.formBuilder.group({
    region: ['', Validators.required],
    distrito:  ['', Validators.required],
    ciudad:  ['', Validators.required],
    direccion:  ['', Validators.required],
    codigoPostal:  ['', Validators.required],
    referencia:  ['', Validators.required],
  })

  cardDatosPersonales:FormGroup =this.formBuilder.group({
    //nombre: ['', Validators.required],
    primerNombre:'',
    segundoNombre:'',
    apellidoPaterno:'',
    apellidoMaterno:'',
  })
  ngOnInit(): void {
    this.isLoading = true;
    this.agendaService.agendaInicializarOperacionesService.costosAdministrativos$.subscribe(
      {
        next: (resp) => {
          console.log('costosAdministrativos$');
          this.solicitudCertificado(resp)
          this.rowActualSolicitud = resp
          this.gridCostosAdmistrativos.data = resp;

          this.cargarGrillaCostosAdministrativos = resp;
          this.isLoading = false;
        },
      }
    );
    this.rowActual = this.agendaService.rowActual;
    this.idPersonal = this.agendaService.idPersonal;
  }
  habilitarSolicitar(dataItem: CostosAdministrativosDTO) {
    if (dataItem.solicitudCF === false) {
      /*si el certificado Digital no tiene solicitud de CF*/
      return false;
    } else {
      return true;
    }
  }

  notificacionAccesoCertificado(){
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
    title: 'No aplica regeneración'
  })
}
notificacionAccesoRepublicacionCertificado(){
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
    title: 'Tu supervisor(a) aun no aprueba la solicitud'
  })
}

notificacionSolictudCertificadoFisico(){
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
    title: 'El certificado físico ya fue solicitado'
  })
}

notificacionActualizacionDatos(){
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
    title: 'datos actualizados'
  })
}

  solicitudCertificado(datacostosadministrativos:any){

    let solicitudCertificado = datacostosadministrativos.filter((w:any) => w.idEstadoCertificadoFisico !== 0);/*Obtiene solicitudes de Certificado Fisicos*/
    if (solicitudCertificado.length > 0) {
        this.tieneSolicitud = true;
    }

  }
  buttonEnviarSolicitudRepublicar(){

    let datosPersonales = this.formDatosPersonalesCertificado.get('retencionChek').value ;
    
    
    let objetoNombre:any = {};
    if (datosPersonales == true) {
      objetoNombre.id = this.rowActual.idAlumno;
      objetoNombre.nombre1= this.cardDatosPersonales.get('primerNombre').value
      objetoNombre.nombre2= this.cardDatosPersonales.get('segundoNombre').value
      objetoNombre.apellidoPaterno= this.cardDatosPersonales.get('apellidoPaterno').value
      objetoNombre.apellidoMaterno = this.cardDatosPersonales.get('apellidoMaterno').value
      let obj = JSON.stringify(objetoNombre);
      console.log(obj);
      
      this.agendaService.agendaArbolOcurrenciaOperacionesService
      .actualizarNombreAlumno$(objetoNombre)
      .subscribe({
        next: (Response:any) => {
          this.notificacionActualizacionDatos();
        },
        error:(error:any) => {
          
        }
      })
    }
    let objetoS:any = {};

    objetoS.idMatriculaCabecera = this.rowActual.idMatriculaCabecera;
    objetoS.idCertificadoGeneradoAutomatico = this.idCertificado;
    
    objetoS.duracion =  this.formDatosPersonalesCertificado.get('duracion').value;
    objetoS.nombreCurso = this.formDatosPersonalesCertificado.get('nombre').value;
    objetoS.fechaInicio =  this.formDatosPersonalesCertificado.get('fechaInicioCapacitacion').value;    
    objetoS.fechaFinal = this.formDatosPersonalesCertificado.get('fechaFinCapacitacion').value;
    objetoS.mensaje = this.formDatosPersonalesCertificado.get('motivo').value;
    objetoS.usuario = this.userService.userData.userName;
    
    let obj = JSON.stringify(objetoS);
    console.log(obj);
    
    this.isRepublicacionCertificadoLoading = true;
    this.agendaService.agendaArbolOcurrenciaOperacionesService
    .InsertarCertificadoDatos$(objetoS)
    .subscribe({
      next: (Response:any) =>{
        this.notificacionActualizacionDatos();
        this.isRepublicacionCertificadoLoading = false;
        this.modalRepublicacionCertificadoRef.close();
      },
      error:(error:any) => {
        this.isRepublicacionCertificadoLoading = false;
        
      }
    })


  }

  habilitarGenerar(dataItem: any) {
    if (
      dataItem.gestionado == false &&
      ((dataItem.concepto.toUpperCase().includes('CONSTANCIA') && (dataItem.concepto.toUpperCase().includes('MATRÍCULA') || dataItem.concepto.toUpperCase().includes('MATRICULA'))) ||
        (dataItem.concepto.toUpperCase().includes('CONSTANCIA') && (dataItem.concepto.toUpperCase().includes('PARTICIPACION') || dataItem.concepto.toUpperCase().includes('PARTICIPACIÓN'))) ||
        (dataItem.concepto.toUpperCase().includes('CONSTANCIA') && dataItem.concepto.toUpperCase().includes('AVANCE')) ||
        (dataItem.concepto.toUpperCase().includes('CONSTANCIA') && dataItem.concepto.toUpperCase().includes('NOTA')))

    ) {
      return false;
    } else {
      return true;
    }
  }

  enRevision(e: any) {
    //console.log(e);
    if (e.gestionado == 1) {
      return true;
    }
    return false;
  }
  visualizarCertificado(dataItem: CostosAdministrativosDTO) {

    window.open(dataItem.urlDocumento,'_blank');
  }

  constancias(rowActualTAdmin: CostosAdministrativosDTO) {

    let concepto = rowActualTAdmin.concepto;

    let idplantilla;
    if ((concepto.toUpperCase().includes("CONSTANCIA")) && (concepto.toUpperCase().includes("MATRÍCULA") || concepto.toUpperCase().includes("MATRICULA"))) idplantilla = 1271;
    if ((concepto.toUpperCase().includes("CONSTANCIA")) && (concepto.toUpperCase().includes("PARTICIPACION") || concepto.toUpperCase().includes("PARTICIPACIÓN"))) idplantilla = 1272;
    if ((concepto.toUpperCase().includes("CONSTANCIA")) && (concepto.toUpperCase().includes("AVANCE"))) idplantilla = 1273;
    if ((concepto.toUpperCase().includes("CONSTANCIA")) && (concepto.toUpperCase().includes("NOTA"))) idplantilla = 1274;

    console.log(idplantilla);
    if (idplantilla != 0 || idplantilla != undefined) {
      this.isLoading = true;
      this.agendaService.agendaInicializarOperacionesService.constancias$(rowActualTAdmin.id,idplantilla).subscribe
      (
        {
          next: (resp:any) => {
            if (resp !=  null){
              //this.rowActualSolicitud = resp
              this.agendaService.agendaInicializarOperacionesService.cargarGrillaCostosAdministrativos();
              this.agendaService.agendaVentaCruzadaOperacionesService.actividadEjecutadaOperaciones(this.agendaService.rowActual.id);
              //VentaCruzadaModule.ActividadEjecutadaOperaciones(rowActual.Id);
              this.agendaService.agendaControlPantallaOperacionesService.closeModalPantalla2();
              this.agendaService.agendaControlPantallaOperacionesService.cerrarModalProgramarActividades();
            }
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        }
      )
    }
  }
  republicacionCertificado( data: any) {

    this.idCertificado = data.idCertificadoGeneradoAutomatico;
    if (data.concepto.toUpperCase().includes("PMI") || data.concepto.toUpperCase().includes("IRCA") || data.concepto.toUpperCase().includes("PARTNER")) {
      this.notificacionAccesoCertificado()
       // NotificacionModule.showMensajeError("No aplica regeneración");
    }
    //RecuperarDatos 
    else {
      
      this.isLoading = true;
      this.agendaService.agendaInicializarOperacionesService.republicacionCertificado$().subscribe
      (
        {
          next: (resp:any) => {
            if (resp !=  null){
              console.log(resp)
              if (resp.estadoCambioDatos > 0) {
                // this.notificacionAccesoRepublicacionCertificado
                this.modalService.open(this.modalAlertaCertificado, { size: 'lg' });
              } else {
                this.verdatosCertificados();
              }
            }
            this.isLoading = false;
          },
          error: () => {
            this.isLoading = false;
          }
        }
      )
    }
  }

  verdatosCertificados(){
    this.isLoading = true;
    this.agendaService.agendaInicializarOperacionesService.verdatosCertificados$().subscribe
    (
      {
        next: (resp:any) =>{
          if (resp != null){
            let data = resp.body[0];
            this.isLoading = false;
            this.rellenarDatosCertificados(data);
            this.modalRepublicacionCertificadoRef = this.modalService.open(this.modalRepublicacionCertificado, {
              size: 'xl'
            });
          }
        },
        error: () => {
          this.isLoading = false;
        }
      }
    )


  }

  rellenarDatosCertificados(data:any) {

    this.agendaService.agendaAlumnoOperacionesService.datosAlumno$.subscribe({
      next: (resp) => {
        if (resp) {
          this.alumno = resp.alumno;
          this.cardDatosPersonales.get('primerNombre').setValue(this.alumno.nombre1);
          this.cardDatosPersonales.get('segundoNombre').setValue(this.alumno.nombre2);
          this.cardDatosPersonales.get('apellidoPaterno').setValue(this.alumno.apellidoPaterno);
          this.cardDatosPersonales.get('apellidoMaterno').setValue(this.alumno.apellidoMaterno);

        }
      }
    })
    
    this.formDatosPersonalesCertificado.get('fechaInicioCapacitacion').setValue(new Date(data.fechaInicio));
    this.formDatosPersonalesCertificado.get('fechaFinCapacitacion').setValue(new Date(data.fechaFinal));

    this.formDatosPersonalesCertificado.get('nombre').setValue(data.nombreCurso);
    this.formDatosPersonalesCertificado.get('duracion').setValue(data.duracion);

}

  solicitarCertificadoFisico( e: any) {
    this.isLoading = true;
    this.agendaService.agendaInicializarOperacionesService.solicitarCertificadoFisico$(this.rowActual.idMatriculaCabecera).subscribe
    (
      {
        next: (response:any) =>{
          this.isLoading = false;
          let resp = response.body
          if (resp.length != 0){
            let idDatosEnvio 
            idDatosEnvio =resp.id
            this.formmodalCertificadoFisico.get('region').setValue(resp[0].region);
            this.formmodalCertificadoFisico.get('distrito').setValue(resp[0].distrito);
            this.formmodalCertificadoFisico.get('ciudad').setValue(resp[0].ciudad);
            this.formmodalCertificadoFisico.get('direccion').setValue(resp[0].direccion);
            this.formmodalCertificadoFisico.get('codigoPostal').setValue(resp[0].codigoPostal);
            this.formmodalCertificadoFisico.get('referencia').setValue(resp[0].referencia);
            this.modalRefmodalCertificadoFisico = this.modalService.open(this.modalCertificadoFisico, {
              size: 'xl'
            });

          
          }
          else{
            this.modalRefmodalCertificadoFisico = this.modalService.open(this.modalCertificadoFisico, {
              size: 'xl'
            });


          }


        },
        error: () => {
          this.isLoading = false;
        }
      }
    )

    this.objetoS.IdMatriculaCabecera = this.rowActual.idMatriculaCabecera;
    this.objetoS.IdPersonal = this.idPersonal;
   // this.objetoS.FechaSolicitud = new Date().toString();
    this.objetoS.IdEstadoCertificadoFisico = 1;/*1:Pendiente de Envio*/
    this.objetoS.IdCertificadoGeneradoAutomatico = e.idCertificadoGeneradoAutomatico;
    this.objetoS.Usuario = this.userService.userData.userName;
    this.objsolicitarCertificadoFisico = JSON.stringify(this.objetoS);

    

    

  }


  SolicitarCertificadoFisicoDatos(){

    let data:any ={};
    data.duracion =  this.formDatosPersonalesCertificado.get('duracion').value;
    this.agendaService.agendaInicializarOperacionesService.SolicitudCertificadoFisicoInsertar$(this.objetoS)

    this.agendaService.agendaInicializarOperacionesService.obtenerDatosSolicitudCertificadoFisico$(this.rowActual.idMatriculaCabecera).subscribe
    (
      {
        next: (response:any) =>{
          let resp = response.body
          if (resp.length != 0){
            console.log()
          let resp = response.body
          this.insertarDatosEnvio(resp.id)
          }
          else{

          }


        }
      }
    )


  }

  insertarDatosEnvio(id:number){
    let objetoS:any = {};


    objetoS.IdAlumno = this.rowActual.idAlumno;
    objetoS.IdMatriculaCabecera = this.rowActual.idMatriculaCabecera;
    objetoS.CodigoMatricula = this.rowActual.codigoMatricula;
    objetoS.Region = this.formmodalCertificadoFisico.get('region').value;
    objetoS.Ciudad = this.formmodalCertificadoFisico.get('ciudad').value;
    objetoS.Distrito = this.formmodalCertificadoFisico.get('distrito').value;
    objetoS.Referencia = this.formmodalCertificadoFisico.get('referencia').value;
    objetoS.DNI = this.rowActual.dni;
    objetoS.Nombre = this.rowActual.contacto;
    //objetoS.Apellido = rowActual.IdMatriculaCabecera;
    objetoS.Telefono = this.rowActual.celular;
    objetoS.IdSolicitudCertificadoFisico = id;
    objetoS.CodigoPostal = this.formmodalCertificadoFisico.get('codigoPostal').value;
    objetoS.Direccion = this.formmodalCertificadoFisico.get('direccion').value;
    // objetoS.DNI =this.formmodalCertificadoFisico.get('dni').value;;
    objetoS.Usuario = this.userService.userData.userName;
    // let obj = JSON.stringify(objetoS);
    
    this.agendaService.agendaInicializarOperacionesService.InsertarDatosEnvioOperaciones$(objetoS);
    this.modalRefmodalCertificadoFisico = this.modalService.dismissAll();
  }
}

interface CostosAdministrativosDTO {
  id: number,
  concepto: string,
  idMatriculaCabecera: number,
  moneda: string,
  gestionado: boolean,
  monto: number,
  fechaCreacion: Date,
  urlDocumento: string,
  fechaEntregaEstimada: string,
  fechaEntregaReal: string,
  solicitudCF: boolean | null,
  idEstadoCertificadoFisico: number | null,
  idCertificadoGeneradoAutomatico: number | null
}
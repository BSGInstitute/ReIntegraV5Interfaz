import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ICodigoMatriculaPespecifico } from '@comercial/models/interfaces/iagenda-cronograma-pago';
import { constApiComercial, constApiFinanzas, constApiOperaciones } from '@environments/constApi';
import { AgendaOperacionesService } from '@operaciones/services/agenda/agenda-operaciones.service';
import { IntegraService } from '@shared/services/integra.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { HttpResponse } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertaService } from '@shared/services/alerta.service';

interface IdentificadorMatriculaCombo {
  idMatriculaCabecera: number,
  codigoMatricula: string,
  idOportunidad: number,
  tipoModalidadPEspecifico: string,
  pEspecifico: string,
  versionPrograma: string
}

interface MetodoPagoPorIdMatricula {
  id: number,
  idMatriculaCabecera: number,
  activo: boolean,
  idMedioPago: number,
  usuarioCreacion: string
}

interface MetodoPago {
  id: number,
  idPais: number,
  idProveedor: number,
  nombre: string,
  prioridad: number 
}

const MY_DATE_FORMAT = {
  parse: {
    dateInput: 'DD/MM/YYYY', // this is how your date will be parsed from Input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // this is how your date will get displayed on the Input
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@Component({
  selector: 'app-cronograma-pagos',
  templateUrl: './cronograma-pagos.component.html',
  styleUrls: ['./cronograma-pagos.component.scss'],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: "es"},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMAT},
  ],
})
export class CronogramaPagosComponent implements OnInit {
  @ViewChild("modalTransaccionesPagos") modalTransaccionesPagos: any;

  modalRefTransaccionesPagos: any;
  grillaModalTransaccionesPagos:any;
  loaderModalTransPagos:boolean=false;

  @Input() agendaService: AgendaOperacionesService
  inputAdjuntarComprobante: any[];
  inputComentario: string;
  modalCompromiso_montoCompromiso: number;
  listaMetodoPago: MetodoPago[];
  metodoPagoSeleccionado: MetodoPago;
  categoriaAlumno: any;
  cuotaMensual: number;
  minDate = new Date();
  programaSeleccionado: IdentificadorMatriculaCombo;
  listaProgramasMatriculado: IdentificadorMatriculaCombo[];
  tableDataCronogramaPagos = new MatTableDataSource<CronogramaPagoDetalleFinal>();
  tableDataDetalleCompromisoPago = new MatTableDataSource<any>();
  adeudoTotal: number;
  mapDetallesCompromisosPago = new Map();
  fData: any = new FormData();
  buttonMetodoPagoDisabled: boolean;
  modalCompromiso_fechaCompromiso: moment.Moment;
  cuotaSeleccionada: any;
  modalOpened: any;
  esCoordinador: any;
  aportado: number;
  nroCuotasPagadas: number;
  nroCuotasTotales: number;
  proximoVencimiento: string;
  isGuardarCompromisoLoading: boolean;
  moneda: string;
  monedaSimboloMap = new Map();
  columnsToDisplayCronogramaTableFirstGroup = ['estado','nroCuota','subCuota','fechaVencimiento','fechaPago','monto','mora','costoCobranza','formaPago']
  columnsToDisplayCronogramaTableSecondGroup = ['agregar','ver','fechaUC','cumplioUC']
  columnsToDisplayHistorialCronogramaTable = ['historialCronograma-numero','historialCronograma-fechaRegistro','historialCronograma-fechaCompromiso','historialCronograma-monto','historialCronograma-cumplioCompromiso']
  Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  constructor(
    private integraService: IntegraService,
    private modalService: NgbModal,
    public datepipe: DatePipe,
    private sanitizer: DomSanitizer,
    private alertaService: AlertaService,
  ){ }

  ngOnInit(): void {
    this.monedaSimboloMap.set('soles', 'PEN');
    this.monedaSimboloMap.set('bolivianos', 'BOB');
    this.monedaSimboloMap.set('dolares', 'USD');
    this.monedaSimboloMap.set('pesos chilenos', 'CLP');
    this.monedaSimboloMap.set('pesos colombianos', 'COP');
    this.monedaSimboloMap.set('pesos mexicanos', 'MXN');
    this.agendaService.esCoordinadora$.subscribe({
      next: (response) => {
        this.esCoordinador = response;
      },
    });
    
    this.integraService.getJsonResponse(
      `${constApiOperaciones.MatriculaCabeceraObtenerIdentificadoresMatriculaComboPorAlumno}/${this.agendaService.rowActual.idAlumno}`
    ).subscribe({
      next: (resp: HttpResponse<IdentificadorMatriculaCombo[]>) => {
        this.listaProgramasMatriculado = resp.body;
        this.programaSeleccionado = this.listaProgramasMatriculado.find(x=>x.idMatriculaCabecera== this.agendaService.rowActual.idMatriculaCabecera);
        this.obtenerNuevoCronograma(this.programaSeleccionado);
      }
    });
  }

  private obtenerMetodoPagos(){
    this.agendaService.agendaCronogramaOperacionesService.listaMedioPago$.subscribe({
      next: (resp: MetodoPago[]) => {
        this.listaMetodoPago = resp;
        this.integraService.getJsonResponse(
          `${constApiComercial.MedioPagoMatriculaCronogramaObtenerMedioPagoPorIdMatricula}/${this.programaSeleccionado.idMatriculaCabecera}`
        ).subscribe({
          next: (response: HttpResponse<MetodoPagoPorIdMatricula>) => {
            if (response.body.idMedioPago != undefined)
              this.metodoPagoSeleccionado = this.listaMetodoPago.find((x) => x.id === response.body.idMedioPago);
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'No se pudo obtener los medios de pago',
            })
          }
    
        })
      }
    });
  }

  SolicitarExoneracionMora(element:any, modal:any){
    this.modalOpened=this.modalService.open(modal, { size: 'lg', backdrop: 'static' });
    this.fData.append("idTipoSolicitudOperaciones", 2);
    this.fData.append("idOportunidad", this.agendaService.rowActual.idOportunidad);
    this.fData.append("idPersonalSolicitante", this.agendaService.rowActual.idPersonal_Asignado);

    if (!this.esCoordinador){
      this.fData.append("Aprobado",false);
      this.fData.append("idPersonalAprobacion",this.agendaService.datosPersonal.idJefe);
    }
    else
    {
      this.fData.append("Aprobado",true);
      this.fData.append("IdPersonalAprobacion",this.agendaService.rowActual.idPersonal_Asignado);
    }

    this.fData.append("valorAnterior",element.moraCalculada);
    this.fData.append("valorNuevo","0");
    this.fData.append("comentarioSolicitante", element.nroCuota + "," + element.nroSubCuota + "," + element.version + "," + String(this.datepipe.transform(new Date(element.fechaVencimiento), "dd-MM-yyyy"))) ;
    let usuario = this.agendaService.datosPersonal.email.split('@')[0];
    this.fData.append("usuario", usuario);
  }

  cerrarSolicitud(){
    this.fData = new FormData();
    this.inputAdjuntarComprobante  = [];
    this.inputComentario = "";
    this.modalOpened.close();
  }

  crearCompromisoPago(element: any, modalAgregarCompromisoPago:any){
    this.modalCompromiso_fechaCompromiso = moment().startOf('day');
    this.modalCompromiso_montoCompromiso = 0.00;
    this.modalOpened = this.modalService.open(modalAgregarCompromisoPago, { backdrop: 'static' });
    this.cuotaSeleccionada = element;
  }

  GuardarFechaCompromiso(){
    if (this.modalCompromiso_fechaCompromiso === null || this.modalCompromiso_montoCompromiso === null) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Ingrese una fecha y monto compromiso'
      });
      return;
    }
    let currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    if (this.modalCompromiso_fechaCompromiso.toDate() < currentDate){
      this.Toast.fire({
        icon: 'warning',
        title: 'La fecha ingresada es inferior al dia actual'
      });
      return;
    }
    if (this.modalCompromiso_montoCompromiso <= 0){
      this.Toast.fire({
        icon: 'warning',
        title: 'El monto ingresado debe ser superior a 0.00'
      });
      return;
    }
    
      const obj:any = new Object();  
      obj.id = this.cuotaSeleccionada.id;
      obj.fechaCompromiso = this.modalCompromiso_fechaCompromiso.format('YYYY-MM-DDTHH:mm:ss');
      obj.idMatriculaCabecera = this.cuotaSeleccionada.idMatriculaCabecera;
      obj.nroCuota = this.cuotaSeleccionada.nroCuota;
      obj.nroSubCuota = this.cuotaSeleccionada.nroSubCuota;
      obj.Usuario = this.agendaService.datosPersonal.email.split('@')[0];
      obj.montoCompromiso = this.modalCompromiso_montoCompromiso;
      obj.version = this.cuotaSeleccionada.versionCompromiso + 1;
      if (this.cuotaSeleccionada.moneda == 'soles') {
          obj.idMoneda = 20;
      } else if (this.cuotaSeleccionada.moneda == 'dolares') {
          obj.idMoneda = 19;
      }
      else if (this.cuotaSeleccionada.moneda == 'bolivianos') {
         obj.idMoneda = 16;
      } 
      else if (this.cuotaSeleccionada.moneda == 'Pesos Colombianos') {
          obj.idMoneda = 10;
      }

      var dataAux = {
          "id": obj.id,
          "fechaCompromiso": obj.fechaCompromiso,
          "idMatriculaCabecera": obj.idMatriculaCabecera,
          "nroCuota": obj.nroCuota,
          "nroSubCuota": obj.nroSubCuota,
          "Usuario": obj.Usuario,
          "montoCompromiso": obj.montoCompromiso,
          "version": obj.version,
          "idMoneda": obj.idMoneda
      }
      this.isGuardarCompromisoLoading = true;
      this.integraService.postJsonResponse(constApiOperaciones.MatriculaCabeceraGuardarFechaCompromiso, dataAux).subscribe({
        next: (resp: any) => {
          this.isGuardarCompromisoLoading = false;
          if (resp.body.flag === true){
            this.Toast.fire({
              icon: 'success',
              title: 'Fecha compromiso creada'
            })
            this.modalOpened.close();
            this.obtenerNuevoCronograma(this.programaSeleccionado);
          }
          else{
            this.Toast.fire({
              icon: 'error',
              title: 'El alumno ya registra la cantidad maxima de compromisos'
            })
          }
        },
        error: (err: any) => {
          this.isGuardarCompromisoLoading = false;
          this.Toast.fire({
            icon: 'error',
            title: 'No se pudo actualizar la fecha compromiso'
          })
        }
      });
    
  }

  GenerarHTMLEstadoCuota(cuota: CronogramaPagoDetalleFinal): SafeHtml{
    let color = "";
    let estado = "";

    let fechaVencimiento = new Date(cuota.fechaVencimiento);
    let today = new Date();

    const fechaVencimientoYear = fechaVencimiento.getFullYear();
    const fechaVencimientoMonth = fechaVencimiento.getMonth();
    const fechaVencimientoDay = fechaVencimiento.getDate();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    
    fechaVencimiento = new Date(fechaVencimientoYear, fechaVencimientoMonth, fechaVencimientoDay);
    today = new Date(todayYear, todayMonth, todayDay);

    const timeDifference = Math.abs(fechaVencimiento.getTime() - today.getTime());
    const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

    //Validacion estado Pagado
    if (cuota.fechaPago != null){
      color = "#82c06c";
      estado = "Pagado";
    }
    //Validacion estado Vencido
    else if(today > fechaVencimiento){
      color = "red";
      estado = "Vencido";
    }
    else if (differenceInDays <= 5){
      color = "#d88ac6";
      estado = "Por vencer";
    }
    else {
      color = "#5ca3f6";
      estado = "Pendiente";
    }
    const htmlString = `<strong style="color: ${color}">${estado}</strong>`;
    return this.sanitizer.bypassSecurityTrustHtml(htmlString);
  }

  CerrarSolicitudFechaCompromiso(){
    this.modalOpened.close();
  }

  RegistrarSolicitudOperaciones(){
    if (this.inputComentario  === "" || this.inputComentario === undefined  ) {
        this.Toast.fire({
          icon: 'warning',
          title: 'Ingrese un comentario'
        })
        return;
    }
    if (this.inputAdjuntarComprobante  == null ) {
      this.Toast.fire({
        icon: 'warning',
        title: 'Adjunta un documento'
      })
      return;
    }
    
    if (this.fData.get("idTipoSolicitudOperaciones") === "2") {
      let comentariocomplementario = this.fData.get("comentarioSolicitante");
      this.fData.set("comentarioSolicitante", comentariocomplementario + ',' + this.inputComentario);
      for (var i = 0; i !== this.inputAdjuntarComprobante.length; i++) {
        this.fData.append("Files", this.inputAdjuntarComprobante[i]);
      }
      this.integraService.insertarFormData2(constApiOperaciones.SolicitudOperacionesInsertarSolicitudOperaciones, this.fData).subscribe({
        next: (resp: any) => {
          this.Toast.fire({
            icon: 'success',
            title: 'Solicitud enviada correctamente'
          })
          this.cerrarSolicitud();
        },
        error: (err: any) => {
          this.Toast.fire({
            icon: 'error',
            title: 'No se pudo enviar su solicitud'
          })
          this.cerrarSolicitud();
        }
      })  
    }
  }

  obtenerDetalleCompromisoPago(id:any){
    this.integraService
      .getJsonResponse(constApiOperaciones.MatriculaCabeceraObtenerAgendaAtcCompromiso +'/'+id)
      .subscribe({
        next: (resp: any) => {
          this.mapDetallesCompromisosPago.set(id, resp.body);
        },
      });
  }

  obtenerDetallesCompromiso(cronograma: any[]){
    cronograma.forEach(x=>this.obtenerDetalleCompromisoPago(x.id));
  }

  obtenerCuotaMensual(cuotas: CronogramaPagoDetalleFinal[]): number{
    if (cuotas == null || cuotas.length == 0)
      return 0;
    
    for(let i=0; i<cuotas.length;i++){
      if(cuotas.filter((x)=>x.nroCuota == cuotas[i].nroCuota).length == 1)
        return cuotas[i].cuota
    }
    return 0;
  }

  obtenerNuevoCronograma(programaSeleccionado: IdentificadorMatriculaCombo){
    this.integraService.getJsonResponse(constApiOperaciones.MontoPagoCronogramaObtenerOportunidadCronogramaFinanzasPorMatricula +'/'+ programaSeleccionado.codigoMatricula).subscribe({
      next: (resp: HttpResponse<CronogramaPagoDetalleFinal[]>) => {
        this.tableDataCronogramaPagos.data = resp.body;
        this.obtenerTotales(resp.body);
        this.obtenerDetallesCompromiso(resp.body);
        this.nroCuotasPagadas = this.tableDataCronogramaPagos.data.filter(x=>x.fechaPago != null).length;
        this.nroCuotasTotales = this.tableDataCronogramaPagos.data.length;
        this.obtenerCategoriaAlumno();
        this.obtenerMetodoPagos();
        let cuotas = this.tableDataCronogramaPagos.data.filter(x=>x.tipoCuota.toLowerCase() == "cuota");
        this.cuotaMensual = this.obtenerCuotaMensual(cuotas);
        this.moneda = this.tableDataCronogramaPagos.data[0]?.moneda;
        let proxVencimiento = this.tableDataCronogramaPagos.data.find(x=>x.fechaPago == undefined);
        if(proxVencimiento == undefined)
          this.proximoVencimiento = "No hay cuotas pendientes";
        else
          this.proximoVencimiento = this.datepipe.transform(new Date(proxVencimiento.fechaVencimiento), "dd/MM/yyyy"); 
      },
      error: (err: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'Error al obtener los datos',
        })
      }
    })
  }

  abrirModal(modal: any){
    this.modalOpened = this.modalService.open(modal, { size: 'lg', backdrop: 'static' }); 
  }


  setHistorialCompromisosPago(modal: any, cuota: any){
    this.cuotaSeleccionada = cuota;
    this.tableDataDetalleCompromisoPago.data = this.mapDetallesCompromisosPago.get(cuota.id);
    console.log(this.mapDetallesCompromisosPago.get(cuota.id));
    
    this.abrirModal(modal);
  }

  checkCumplioCompromiso2(fechaVencimientoCompromiso: any, cuotaFechaPago: any){
    if(cuotaFechaPago == null)
      return false;
    
    let diaVencimiento = new Date(this.datepipe.transform(fechaVencimientoCompromiso, 'dd/MM/yyyy'));
    let fechaPago = new Date(this.datepipe.transform(cuotaFechaPago, 'dd/MM/yyyy'));
    return fechaPago <= diaVencimiento;
  }

  /// Obtener el aporte realizado y el adeudo total (incluye mora)
  obtenerTotales(data: CronogramaPagoDetalleFinal[]) {
    // const adeudo = data.filter((x:any) => !x.cancelado);
    const aporte = data.filter((x) => x.cancelado);
    // const moneda = data[0]?.moneda;
  
    const obtenerTotal = (element: CronogramaPagoDetalleFinal) => element.cuota + element.moraCalculada;
  
    const adeudoTotal = data.reduce((total:any, element:any) => total + obtenerTotal(element), 0);
    this.adeudoTotal = adeudoTotal.toFixed(2) || null;
  
    const aporteTotal = aporte.reduce((total:any, element:any) => total + obtenerTotal(element), 0);
    this.aportado = aporteTotal.toFixed(2) || null;

  }

  // obtenerMora(dataItem:any){
  //   let porcentaje = 0.005;
  //   let mora:any = 0;

  //   if (dataItem.webMoneda === 0) //Soles
  //       porcentaje = 0.00015;
    
  //   else if (dataItem.webMoneda === 1) //Dolares
  //       porcentaje = 0.00005;
  //   else if (dataItem.webMoneda === 2) //Colombiano
  //       porcentaje = 0.000657;
  //   else 
  //       porcentaje = 0.00005;
    

  //   let NroDias = (moment(new Date())).diff(moment(dataItem.fechaVencimiento),'days');

  //   if (NroDias > 0 && dataItem.cancelado === false) {
  //     mora = dataItem.mora + ((dataItem.cuota + dataItem.mora) * porcentaje) * NroDias;
  //     mora = parseFloat(mora).toFixed(2);
  //   } 
  //   if (dataItem.webMoneda === 2)
  //     mora = parseFloat(mora).toFixed(2);   
  //   if (mora === undefined)
  //     return parseFloat(dataItem.mora).toFixed(2);
  //   else 
  //     return Number(mora);
  // }

  checkCumplioCompromiso(fechaVencimientoCompromiso: any){
    if(this.cuotaSeleccionada.fechaPago == null)
      return false;
    
    let diaVencimiento = new Date(this.datepipe.transform(fechaVencimientoCompromiso, 'dd/MM/yyyy'));
    let fechaPago = new Date(this.datepipe.transform(this.cuotaSeleccionada.fechaPago, 'dd/MM/yyyy'));
    return fechaPago <= diaVencimiento;
  }

  obtenerCostoGestionCobranza(dataItem:any){
    let NroDias = (moment(new Date())).diff(moment(dataItem.fechaVencimiento), 'days');
     if (NroDias > 5 && dataItem.cancelado === false && dataItem.moraTarifario!== null) 
         return parseFloat(dataItem.moraTarifario).toFixed(2);
     else 
         return parseFloat(String(0)).toFixed(2);
  }

  ActualizarMetodoPago(){
    if(this.metodoPagoSeleccionado === null || this.metodoPagoSeleccionado === undefined)
      return;
    
    var obj : any = new Object();
    obj.idMatriculaCabecera = this.programaSeleccionado.idMatriculaCabecera;
    obj.idMedioPago = this.metodoPagoSeleccionado.id;
    obj.activo = true;
    obj.usuario = this.agendaService.datosPersonal.email.split('@')[0];

    var data = JSON.stringify(obj);
    this.integraService.postJsonResponse(constApiOperaciones.PasarelaPagoPWRegistroMedioPagoMatriculaCronograma, data).subscribe({
      next: (resp: any) => {
        if (resp.body) {
          this.Toast.fire({
            icon: 'success',
            title: 'Se actualizó el método de pago.'
          }) 
        }
        else {
          this.Toast.fire({
            icon: 'warning',

            title: 'El método de pago ya se encuentra actualizado.'
          })
        }
      },
      error: (err: any) => {
        this.Toast.fire({
          icon: 'error',
          title: 'No se pudo actualizar el método de pago.'
        })
      }
    });

  }

  CargarNuevoPrograma(event: MatSelectChange){
    this.obtenerNuevoCronograma(event.value);
  }

  CategoriaAlumno(categorias: any[]){
    var fecha2;
    if (this.tableDataCronogramaPagos.data[0].fechaPago == null) {
        const fecha = new Date();
        fecha2 = new Date(fecha.toISOString());
    }
    else {
        fecha2 = new Date(this.tableDataCronogramaPagos.data[0].fechaPago);
    }
    var fecha1 = new Date(this.tableDataCronogramaPagos.data[0].fechaVencimiento);        
    
    let diff  = Math.abs((new Date(fecha2)).getTime() - (fecha1).getTime());
    let diffDays = Math.ceil(diff  / (1000 * 3600 * 24)); 
    let NroDias = diffDays;
    
    if (NroDias >= 0) {
        return ("Estándar")
    }
    
    var valEstado = this.tableDataCronogramaPagos.data[0].idEstadoMatricula;
    var valSubestado = this.tableDataCronogramaPagos.data[0].idSubEstadoMatricula;

    var valdias = NroDias * -1;
    for (let clave in categorias) {
        var nombre = categorias[clave]["nombre"];
        var idEstado = categorias[clave]["idEstados"].split(',').map(Number);
        var aux = categorias[clave]["idSubEstados"]
        var vencimiento = categorias[clave]["cantidadDiasVencimiento"];
        var a = idEstado.find((val:any) => val == valEstado);
        if (aux == null) {
            if (a != undefined)
                if (vencimiento <= valdias) 
                    return nombre;
            
            else return "No definido"; 
        }

        var idSubestado = categorias[clave]["idSubEstados"].split(',').map(Number);
      
        if (a != undefined) {
            var b = idSubestado.find((val:any) => val == valSubestado);
            if (b != undefined)
                if (vencimiento <= valdias)
                    return nombre;
                
            if (vencimiento <= valdias)
                return nombre;
        }
    }
    return "No definido";
  }

  obtenerCategoriaAlumno(){
    this.agendaService.agendaInformacionActividadOportunidadOperacionesService.obtenerCategoriaAlumno$()
      .subscribe({
        next: (response: any) => {
          this.categoriaAlumno = this.CategoriaAlumno(response.body);
        },
      })
  }

  abrirModalTransacciones(e: any) {
    this.modalRefTransaccionesPagos = this.modalService.open(this.modalTransaccionesPagos,{size:'xl'});
    this.loaderModalTransPagos = true;
    this.grillaModalTransaccionesPagos="";
    let params: any;
    params = {
      idMatriculaCabecera: e.idMatriculaCabecera,
      nroCuota: e.nroCuota,
      nroSubCuota: e.nroSubCuota,
      fechaPago: e.fechaPago
    };
    this.integraService
      .obtenerPorFiltro(constApiFinanzas.ObtenerDetalleCuotasTransaccionAuditoria, params)
      .subscribe({
        next: (response: any) => {
          console.log('Detalle Transacción:', response);
          this.grillaModalTransaccionesPagos=response.body
          this.loaderModalTransPagos = false;
        },
      });
  }

  mostrarMensajeTransacciones(cuota: CronogramaPagoDetalleFinal) {
    let estado = "";
    let fechaVencimiento = new Date(cuota.fechaVencimiento);
    let today = new Date();
    const fechaVencimientoYear = fechaVencimiento.getFullYear();
    const fechaVencimientoMonth = fechaVencimiento.getMonth();
    const fechaVencimientoDay = fechaVencimiento.getDate();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();
    fechaVencimiento = new Date(fechaVencimientoYear, fechaVencimientoMonth, fechaVencimientoDay);
    today = new Date(todayYear, todayMonth, todayDay);
    const timeDifference = Math.abs(fechaVencimiento.getTime() - today.getTime());
    const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    if(today > fechaVencimiento){
      estado = "Vencido";
    }
    else if (differenceInDays <= 5){
      estado = "Por vencer";
    }
    else {
      estado = "Pendiente";
    }

    this.alertaService.mensajeIcon(
      '',
      'El pago está ' + estado,
      null
    );
  }

}

interface CronogramaPagoDetalleFinal{
  id: number
  idMatriculaCabecera?: number
  idEstadoMatricula?: number
  idSubEstadoMatricula?: number
  nroCuota?: number
  nroSubCuota?: number
  fechaVencimiento?: string
  totalPagar?: number
  cuota?: number
  saldo?: number
  mora?: number
  moraCalculada?: number
  montoPagado?: number
  cancelado?: boolean
  tipoCuota?: string
  moneda?: string
  fechaPago?: string
  idFormaPago?: number
  nombreFormaPago?: string
  idCuenta?: number
  fechaPagoBanco?: string
  enviado?: boolean
  observaciones?: string
  idDocumentoPago?: number
  nroDocumento?: string
  monedaPago?: string
  tipoCambio?: number
  cuotaDolares?: number
  fechaProcesoPago?: string
  version?: number
  aprobado?: boolean
  fechaDeposito?: string
  webMoneda?: number
  webTipoCambio?: number
  moraTarifario?: number
  fechaCompromiso?: string
  versionCompromiso?: number
  montoCompromiso?: number
  fechaGeneradoCompromiso?: boolean
  fechaProcesoPagoReal?: string
  fechaIngresoEnCuenta?: string
  fechaEfectivoDisponible?: string
  fechaCompromiso1?: string
  fechaCompromiso2?: string
  fechaCompromiso3?: string
  fechaGeneracionCompromiso1?: string
  fechaGeneracionCompromiso2?: string
  fechaGeneracionCompromiso3?: string
  idPersonal_CoordinadorCobranza?: number
  usuarioCoordinadorAcademico?: string
  monedaMoraTarifario?: string
  usuarioCreacion?: string
  usuarioModificacion?: string
  fechaCreacion?: string
  fechaModificacion?: string
}

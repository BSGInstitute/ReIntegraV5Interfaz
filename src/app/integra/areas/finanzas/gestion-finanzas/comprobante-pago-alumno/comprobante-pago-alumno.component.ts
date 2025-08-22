import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { constApi, constApiComercial, constApiFinanzas, constApiGlobal } from './../../../../../../environments/constApi';
import { HttpResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { map } from 'rxjs/operators';
import { TextValidator } from '@shared/validators/text.validator';
import { UserService } from '@shared/services/user.service';

const pipe = new DatePipe('en-US');
@Component({
  selector: 'app-comprobante-pago-alumno',
  templateUrl: './comprobante-pago-alumno.component.html',
  styleUrls: ['./comprobante-pago-alumno.component.scss']
})
export class ComprobantePagoAlumnoComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    private finanzasService:FinanzasServiceService,
    private userService:UserService
  ) {}

  // Variables usadas en el componente ------------------------------------------------------------------
  @ViewChild('modalEditarComprobante') modalEditarComprobante: any;

  isPeriodo= new FormControl(false)
  nroDoc=""
  maxlength:number = 500;
  charachtersCount:number=0;
  counter:string;
  indexRow:number=0
  isFactura=false
  loaderPagosAlumnos=false
  loaderModalEditar=false
  formGroupFiltro = this.formBuilder.group({
    idFormaPago:null,
    codigoMatricula:null,
    alumno:null,
    centroCosto:null,
    comprobante:null,
    idPeriodo:null,
    fechaInicial:null,
    fechaFin:null,
  });

  formGroupComprobantePago = this.formBuilder.group({
    id:null,
    tipoComprobante:[null,Validators.required],
    nroDocumento:[null,[
      Validators.required,
      TextValidator.noEndSpace,
      TextValidator.noStartSpace
    ]],
    nombreRazonSocial:[null,[
      Validators.required,
      TextValidator.noEndSpace,
      TextValidator.noStartSpace
    ]],
    observacion:[null,[
      TextValidator.noEndSpace,
      TextValidator.noStartSpace
    ]],
  });

  listaMatricula:any
  listaFormaPago:any
  listaAlumno:any
  listaCentro:any
  listaPeriodo:any
  listaComprobante : any
  listaPagosAlumnos:any



  pageSizes: any = [5, 10, 20, 'All'];

  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------

  ngOnInit(): void {
    this.obtenerComboFormaPago()
    this.ObtenerComboPeriodo()
    this.ObtenerComboTipoComprobante()
    
  }
  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------

  ObtenerComboTipoComprobante(){//obtiene datos de los comprobantes
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerListaTipoComprobante}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaComprobante=response.body;
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"data comprobante de pago")
        },
        complete: () => {},
      });
    }

  ObtenerReporteComprobanteAlumno(){ // Genera el Reporte Comprobante pago Alumno
    let validarFecha=true
    if(this.isPeriodo.value==true)
    {
      validarFecha=false
      if(
        (this.formGroupFiltro.get('fechaInicial').value!=null &&
        this.formGroupFiltro.get('fechaFin').value!=null) ||
        (this.formGroupFiltro.get('fechaInicial').value==null &&
        this.formGroupFiltro.get('fechaFin').value==null)
        )
        {
          if(this.formGroupFiltro.get('fechaInicial').valid &&
          this.formGroupFiltro.get('fechaFin').valid)
            validarFecha=true
        }
      else{
        Swal.fire(
          "!Alerta¡",
          "Rango de fechas incompletas, ingresa una fecha Inicial y final!",
          "warning"
        )
      }
      
    }
    if(validarFecha){
      let dataFiltro = this.formGroupFiltro.getRawValue()
      let tipoFecha=0
      if(dataFiltro.idPeriodo!==null) tipoFecha=1 // periodo
      if(dataFiltro.fechaInicial!==null && dataFiltro.fechaFin!==null ) tipoFecha=2 // periodo
      let envio=
      {
        idFormaPago: dataFiltro.idFormaPago!=null?dataFiltro.idFormaPago.toString():"",
        codigoMatricula: dataFiltro.codigoMatricula!=null?dataFiltro.codigoMatricula.toString():"",
        alumno: dataFiltro.alumno!=null?dataFiltro.alumno.toString():"",
        centroCosto: dataFiltro.centroCosto!=null?dataFiltro.centroCosto.toString():"",
        comprobante: dataFiltro.comprobante!=null?dataFiltro.comprobante.toString():"",
        idPeriodo:  dataFiltro.idPeriodo!=null?dataFiltro.idPeriodo:0,
        fechaInicial:  dataFiltro.fechaInicial!=null?pipe.transform(dataFiltro.fechaInicial, 'yyyy-MM-ddTHH:mm:ss'):pipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
        fechaFin:  dataFiltro.fechaFin!=null?pipe.transform(dataFiltro.fechaFin, 'yyyy-MM-ddTHH:mm:ss'):pipe.transform(new Date(), 'yyyy-MM-ddTHH:mm:ss'),
        tipoFechaPago: tipoFecha
      }
      this.loaderPagosAlumnos=true
      this.integraService
        .postJsonResponse(
          `${constApiGlobal.ObtenerReporteComprobanteAlumno}`,envio
        )
        .pipe(
          map((resp: any) =>
            resp.body.map((item: any) => ({
                ...item,
                fechaPago: this.fechaTemplate(item.fechaPago),
                tipoComprobanteExcel : this.tipoComprobanteTemplate(item.tipoComprobante)
                
              }
            ))
          )
        )
        .subscribe({
          next: (response: any) => {
            this.loaderPagosAlumnos=false
            this.listaPagosAlumnos=response
          },
          error: (error) => {
            this.loaderPagosAlumnos=false
            this.finanzasService.MensajeDeError(error,"Generar Datos pagos alumno")
            
          },
          complete: () => {
          },
        });
      
    }
    
  }

  obtenerComboFormaPago(){//Obtiene el combo de Forma de pago
    this.integraService.obtenerTodo(constApiFinanzas.RegistrarpagoFurFormaPago).subscribe({
      next: (response: HttpResponse<{
        id:number,
        nombre:string
        }[]>) => {
        this.listaFormaPago=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"Combo forma de pago");
        },
        complete: () => {},
    });
   }

  ObtenerMatricula(codMat:string){//obtiene datos de las matriculas
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.AlumnoCongeladoObtenerMatricula}`+"/"+codMat
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          console.log("Matricula : ",response.body)
          this.listaMatricula=response.body.slice(0,150);
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"AUtocomplete - MATRICULA")
        },
        complete: () => {},
      });
    }

    ObtenerAlumnoAutoComplete(alumno:string){//Alumno Autocomplete
      this.integraService
      .postJsonResponse(constApiGlobal.AlumnoObtenerAutocomplete, 
        {valor: alumno,}
      )
      .subscribe({
        next: (response) => {
          this.listaAlumno = response.body.slice(0,150);
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"autocomplete - alumno")
        },
        complete: () => {},
      });
    }

    ObtenerCentroCostoAutoComplete(centroCosto:string){//Centro de Costo Autocomplete
      this.integraService
      .postJsonResponse(constApiComercial.CentroCostoObtenerFiltroAutocomplete, {
        valor: centroCosto,
      })
      .subscribe({
        next: (response) => {
          this.listaCentro = response.body.slice(0,150);
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"autocomplete - centro de costo")
        },
        complete: () => {},
      });
    }
    ObtenerComboPeriodo(){// Obtiene datos para el combo Periodo
        this.integraService
          .getJsonResponse(
            `${constApi.PeriodoObtenerCombo}`
          )
          .subscribe({
            next: (response: HttpResponse<any>) => {
              this.listaPeriodo=response.body
            },
            error: (error) => {
              this.finanzasService.MensajeDeError(error,"COMBO - PERIODO")
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

  tipoComprobanteTemplate(idComprobante:any)// obtiene la fecha formateada para el mostrado en la grilla
  {
    if(typeof idComprobante =="number")
    {
      return this.listaComprobante.find((e:any)=>e.id==idComprobante).nombre
    }
    else return "—"
  }

  textoTemplate(dato:string){// customiza el texto para el mostrado en la grilla
    if(typeof dato=="string" && dato.length>0)
    {
      return dato
    }
    else if(
      dato==null || dato==undefined ||
      (typeof dato=="string" && dato.length==0)
      )
    {
      return "—"
    }
    else return dato
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------
  onChangeFecha(e:any){//Switch de Fecha de pago al cambiar, reinicia las fechas y periodo
    this.formGroupFiltro.get('idPeriodo').reset()
    this.formGroupFiltro.get('fechaInicial').reset()
    this.formGroupFiltro.get('fechaFin').reset()
  }
  BuscarMatricula(event:string){//Filtro de busqueda de matricula
    event = event.trim()  
    if(event.length>4){
        this.ObtenerMatricula(event)
      }
  }
  BuscarAlumno(event:string){//Filtro de busqueda de matricula
    event = event.trim()
    if(event.length>5){
      this.ObtenerAlumnoAutoComplete(event)
    }
  }
  BuscarCentroCosto(event:string){//Filtro de busqueda de matricula
    event = event.trim()
    if(event.length>4){
      this.ObtenerCentroCostoAutoComplete(event)
    }
  }
  abrirModalEditar(dataItem:any,rowIndex:number){//abre el modal para Nuevo,Editar en la grilla principal
    this.indexRow=rowIndex
    this.formGroupComprobantePago.reset()
    console.log(dataItem)
    this.formGroupComprobantePago.patchValue(dataItem)
    this.onValueChange(dataItem.observacion?dataItem.observacion:"")
    if(dataItem.tipoComprobante==1) 
    {
      this.nroDoc="RUC"
      this.formGroupComprobantePago.get('nombreRazonSocial').setValue(dataItem.nombreRazonSocial)
      this.isFactura=true
    }
    else
    {
      this.nroDoc="DNI"
      this.formGroupComprobantePago.get('nombreRazonSocial').setValue("-")
      this.isFactura=false
    }
    this.modalService.open(this.modalEditarComprobante);

  }
  onValueChange(ev: string): void {//evento del TExtArea para mostar cantidad de caracteres
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }
  SelecctionDOC(ev:any){//evento que se dispara cuando selecciona un diferente tipo de comprobante
    this.formGroupComprobantePago.get('nombreRazonSocial').reset()
    if(ev.id==1) 
    {
      this.nroDoc="RUC"
      this.formGroupComprobantePago.get('nombreRazonSocial').setValue(null)
      this.isFactura=true
    }
    else
    {
      this.nroDoc="DNI"
      this.formGroupComprobantePago.get('nombreRazonSocial').setValue("-")
      this.isFactura=false
    }
    
  }
  validForm(): boolean {//Activa los errores segun el formulario sea invalido/valido
    if(this.formGroupComprobantePago.invalid){
      this.formGroupComprobantePago.markAllAsTouched();
      return false;
    }
    return true;
  }
  getErrorMessage(controlName: string): string {//Mensajes de error para los Campos del formulario
    let erroMsj: any = {
      nroDocumento: {
        required: 'Ingrese el número de documento, es necesario!',
        noStartSpace: 'El número de documento no puede empezar con espacio',
        noEndSpace: 'El número de documento no puede terminar con espacio'
      },
      nombreRazonSocial: {
        required: 'Ingrese la razón social, es necesario!',
        noStartSpace: 'La razón social no puede empezar con espacio',
        noEndSpace: 'La razón social no puede terminar con espacio'
      },
      observacion: {
        noStartSpace: 'La Observación no puede empezar con espacio',
        noEndSpace: 'La Observación no puede terminar con espacio'
      }
    };
    let formControl: FormControl = this.formGroupComprobantePago.get(controlName) as FormControl;
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

  //--------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------

  actualizarComprobantePagoAlumno(){//actualiza el comprobante de pago 
    if(this.validForm())
    {
      let envio = this.formGroupComprobantePago.getRawValue()
      envio.usuario = this.userService.userName
      envio.nombreRazonSocial = envio.nombreRazonSocial=="-"?"":envio.nombreRazonSocial
      envio.nroDocumento = envio.nroDocumento=="-"?"":envio.nroDocumento
      console.log(envio)
      this.loaderModalEditar=true
      this.integraService
        .putJsonResponse(
          `${constApiFinanzas.ActualizarComprobantePago}`,envio
        )
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.listaPagosAlumnos[this.indexRow].tipoComprobanteExcel = this.listaComprobante.find((e:any)=>e.id==envio.tipoComprobante).nombre
            this.listaPagosAlumnos[this.indexRow].nombreRazonSocial = envio.nombreRazonSocial
            this.listaPagosAlumnos[this.indexRow].observacion = envio.observacion
            this.listaPagosAlumnos[this.indexRow].nroDocumento = envio.nroDocumento
            this.modalService.dismissAll(this.modalEditarComprobante)
            this.alertService.swalFire(
              '¡Guardado con éxito!',
              'El registro ha sido modificado y guardado.',
              'success'
            );
            this.loaderModalEditar=false
          },
          error: (error) => {
            this.loaderModalEditar=false
            this.finanzasService.MensajeDeError(error,"EDITAR comprobante pago alumno")
            
          },
          complete: () => {},
        });
    }
  }

  //--------------------------------------------------------------------------------------------------------

}

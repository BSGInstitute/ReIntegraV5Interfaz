import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiGestionPersonal } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { proveedorComboEgreso } from '@integra/models/proveedor';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-convocatoria',
  templateUrl: './modal-convocatoria.component.html',
  styleUrls: ['./modal-convocatoria.component.scss']
})
export class ModalConvocatoriaComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    public finanzasService :FinanzasServiceService,
    private userService: UserService
  ){ }
  // Variables usadas en el componente ------------------------------------------------------------------
  @Output() resultadoEmit:EventEmitter<any>=new EventEmitter<any>();

  @Input() nombreModal:string=''
  @Input() modal:any
  @Input() nombreBTN:any
  @Input() data:any

  @Input() listaSede:any[]=[]
  @Input() listaArea:any[]=[]
  @Input() listaProveedor:any[]=[]
  @Input() listaEncargados:any[]=[]
  @Input() listaProceso:any[]=[]
  @Input() listaMoneda:any[]=[]
  @Input() listaGrupoCombo:any
  
  listaExperiencia:any[]=[]
  listaTipoContrato:any[]=[]

  itemSede:any[]=[]
  itemArea:any[]=[]
  itemProveedor:any[]=[]
  itemEncargado:any[]=[]
  itemProceso:any[]=[]
  itemMoneda:any[]=[]
  itemModalidadTrabajo:any[]=[]
  itemExperiencia:any[]=[]
  itemNivelEstudio:any[]=[]
  itemIdioma:any[]=[]
  itemTipoContrato:any[]=[]
  itemCategoriaAsignacion:any[]=[]

  loaderModal=false
  completa=true
  parcial=false
  porHoras=false
  tipoTemp=1



  formGroupConvotoria: FormGroup = this.formBuilder.group({
    id: [0],
    nombre:[null,[Validators.required,
      TextValidator.noStartSpace,TextValidator.noEndSpace]],
    codigo:[null,[Validators.required]],
    idEstadoConvocatoria:[null,[Validators.required]],
    fechaInicio:[null,[Validators.required]],
    fechaFin:[null,[Validators.required]],
    cuerpoConvocatoria:[null],
    urlAviso:[null,[Validators.required,
      TextValidator.noStartSpace,TextValidator.noEndSpace]],
    idArea:[null,[Validators.required]],
    idPersonal:[null,[Validators.required]],
    idSedeTrabajo:[null,[Validators.required]],
    idProcesoSeleccion:[null,[Validators.required]],
    idProveedor:[null,[Validators.required]],
    remIdMoneda:[null,[Validators.required]],
    bonoIdMoneda:null,
    comisionIdMoneda:null,
    nroVacantes:[null,[Validators.required]],
    idModalidadTrabajo:[null,[Validators.required]],
    // idCategoriaAsignacion:[null,[Validators.required]],
    verEnPortal:false,
    soloMatriculado:false,
    idExperiencia:[null],
    idNivelEstudio:[null],
    informacionAdicional:[null],
    idTipoContrato:[null,[Validators.required]],
    horaSemanal:[null,[Validators.required]],
    montoRemBruta:[null,[Validators.required]],
    idIdioma:[null],
    visualizarRem:false,
    aplicaBono:false,
    aplicaComision:false,
    montoDesdeBono:null,
    montoHastaBono:null,
    montoDesdeComision:null,
    montoHastaComision:null,
  });

  //--------------------------------------------------------------------------------------------------------
  // ngOnInit ----------------------------------------------------------------------------------------------
  ngOnInit(): void {
    console.log(this.listaGrupoCombo)
    console.log(this.data)
    this.itemSede=this.listaSede
    this.itemArea=this.listaArea
    this.itemProveedor=this.listaProveedor
    this.itemEncargado = this.listaEncargados
    this.itemProceso = this.listaProceso
    this.itemMoneda = this.listaMoneda
    this.itemModalidadTrabajo = this.listaGrupoCombo.comboModalidadTrabajo
    this.itemExperiencia = this.listaExperiencia = []
    this.itemIdioma=this.listaGrupoCombo.comboIdioma
    this.itemTipoContrato = this.listaTipoContrato = []
    this.itemCategoriaAsignacion = this.listaGrupoCombo.comboCategoriaAsignacion
    this.itemNivelEstudio = this.listaGrupoCombo.comboNivelEstudio
    this.tipoTemp=0; this.completa=false
    if(this.data!=null)
    {
      if(this.data.tipoJornada=="Completo") this.CambioJornadaLaboral(1)
      else if(this.data.tipoJornada=="Parcial") this.CambioJornadaLaboral(2)
      else if(this.data.tipoJornada=="Por Horas") this.CambioJornadaLaboral(3)
      else {this.tipoTemp=0; this.completa=false}

      let expe  =this.listaGrupoCombo.comboExperiencia.filter((e:any)=>
        e.idAreaTrabajo == this.data.idArea
      )
      this.itemExperiencia = expe
      this.listaExperiencia = expe
       
      let idPais = this.listaSede.find((e:any)=> e.id == this.data.idSedeTrabajo).idPais
      if(typeof idPais =="number") 
      {
        let contrato =this.listaGrupoCombo.comboTipoContrato.filter((e:any)=>
        e.idpais == idPais
        )
        this.itemTipoContrato = contrato
        this.listaTipoContrato = contrato
      }
      else this.itemTipoContrato = this.listaTipoContrato =[]

      if(typeof this.data.verEnPortal!="boolean")this.data.verEnPortal=false
      if(typeof this.data.soloMatriculado!="boolean")this.data.soloMatriculado=false
      if(typeof this.data.visualizarRem!="boolean")this.data.visualizarRem=false
      if(typeof this.data.aplicaBono!="boolean")this.data.aplicaBono=false
      if(typeof this.data.aplicaComision!="boolean")this.data.aplicaComision=false


      this.formGroupConvotoria.patchValue(this.data)

    }
  }

  //--------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de Datos------------------------------------------------------------------
  filtroSede(event:any)
  {
    if(typeof event=="string")
    {
      
      if(event.length>=3)
      {
        this.itemSede = this.listaSede.filter(
          (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemSede=this.listaSede
    }
  }
  filtroArea(event:any)
  {
    if(typeof event=="string")
    {
      
      if(event.length>=3)
      {
        this.itemArea = this.listaArea.filter(
          (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemArea=this.listaArea
    }
  }
  filtroProveedor(event:any)
  {
    if(typeof event=="string")
    {
      
      if(event.length>=3)
      {
        this.itemProveedor = this.listaProveedor.filter(
          (s) => s.razonSocial.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemProveedor=this.listaProveedor
    }
  }

  filtroEncargado(event:any)
  {
    if(typeof event=="string")
    {
      
      if(event.length>=3)
      {
        this.itemEncargado = this.listaEncargados.filter(
          (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemEncargado=this.listaEncargados
    }
  }
  filtroProceso(event:any)
  {
    if(typeof event=="string")
    {
      
      if(event.length>=3)
      {
        this.itemProceso = this.listaProceso.filter(
          (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemProceso=this.listaProceso
    }
  }
  filtroMoneda(event:any)
  {
    if(typeof event=="string")
    {
      
      if(event.length>=3)
      {
        this.itemMoneda = this.listaMoneda.filter(
          (s) => s.nombrePlural.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemMoneda=this.listaMoneda
    }
  }
  filtroModalidadTrabajo(event:any)
  {
    if(typeof event=="string")
    {
      
      if(event.length>=3)
      {
        this.itemModalidadTrabajo = this.listaGrupoCombo.comboModalidadTrabajo.filter(
          (s:any) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemModalidadTrabajo=this.listaGrupoCombo.comboModalidadTrabajo
    }
  }
  filtroExperiencia(event:any)
  {
    if(typeof event=="string")
    {
      if(event.length>=3)
      {
        this.itemExperiencia = this.listaExperiencia.filter(
          (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemExperiencia = this.listaExperiencia
    }
  }
  filtroIdioma(event:any)
  {
    if(typeof event=="string")
    {
      
      if(event.length>=3)
      {
        this.itemIdioma = this.listaGrupoCombo.comboIdioma.filter(
          (s:any) => s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemIdioma=this.listaGrupoCombo.comboIdioma
    }
  }
  filtroTipoContrato(event:any)
  {
    if(typeof event=="string")
    {
      if(event.length>=3)
      {
        this.itemTipoContrato = this.listaTipoContrato.filter(
          (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemTipoContrato=this.listaTipoContrato
    }
  }
  filtroNivelEstudios(event:any)
  {
    if(typeof event=="string")
    {
      
      if(event.length>=3)
      {
        this.itemNivelEstudio = this.listaGrupoCombo.comboNivelEstudio.filter(
          (s:any) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemNivelEstudio=this.listaGrupoCombo.comboNivelEstudio
    }
  }
  filtroCategoriaAsignacion(event:any)
  {
    if(typeof event=="string")
    {
      
      if(event.length>=3)
      {
        this.itemCategoriaAsignacion = this.listaGrupoCombo.comboCategoriaAsignacion.filter(
          (s:any) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      }
      else this.itemCategoriaAsignacion=this.listaGrupoCombo.comboCategoriaAsignacion
    }
  }
  //------------------------------------------------------------------------------------------------------
 
  // Funciones para el control de Interfaz ------------------------------------------------------------------
  ChangeArea(event:any){
    this.formGroupConvotoria.get('idExperiencia').reset()
    if(event!= null && typeof event.id=="number")
    {
      let expe = this.listaGrupoCombo.comboExperiencia.filter((e:any)=>
      e.idAreaTrabajo == event.id)
      this.itemExperiencia = expe
      this.listaExperiencia = expe
    }
    else {this.itemExperiencia = [];this.listaExperiencia = [] }
  }

  ChangeSede(event:any){
    this.formGroupConvotoria.get('idTipoContrato').reset()
    if(event!= null && typeof event.id=="number")
    {
      let idPais = this.listaSede.find((e:any)=> e.id == event.id).idPais
      if(typeof idPais=="number"){
        let contrato =this.listaGrupoCombo.comboTipoContrato.filter((e:any)=>
        e.idpais == idPais )
        this.itemTipoContrato =contrato
        this.listaTipoContrato = contrato
      }
      else {this.itemTipoContrato = [];this.listaTipoContrato =[]}
      
    }
    else {this.itemTipoContrato = [];this.listaTipoContrato =[]}
  }

  verificarFecha(tipoFecha:number){
    let FI = this.formGroupConvotoria.get('fechaInicio').value
    let FF = this.formGroupConvotoria.get('fechaFin').value

    if(FI!=null && FF!=null) 
    {
      if(FI.getTime()>=FF.getTime()) {
        Swal.fire(
          'Alerta de fecha Incorrecta',
          'validar el rango de fechas, la fecha inicio no puede ser mayor o igual a la fecha fin.',
          "warning"
        )
        if(tipoFecha==1) this.formGroupConvotoria.get('fechaInicio').setValue(null)
        else if (tipoFecha==2) this.formGroupConvotoria.get('fechaFin').setValue(null)
      }
      
    }

  }
  CambioJornadaLaboral(tipo:any){
    if(tipo!=this.tipoTemp)
    {
      this.tipoTemp=tipo
      if(typeof tipo=="number"){
        if(tipo==1){//jornada completa
          this.completa=true
          this.porHoras=this.parcial=false
        }
        else if(tipo==2){// parcial
          this.parcial=true
          this.porHoras=this.completa=false
        }
        else if(tipo==3){//por horas
          this.porHoras=true
          this.completa=this.parcial=false
        }
      }
    } else {
      this.tipoTemp=0
      if(tipo==1)this.completa=false
      else if(tipo==2)this.parcial=false
      else if(tipo==3)this.porHoras=false
    }
  }

  AccionBotonModal(){
    console.log(this.formGroupConvotoria.getRawValue())
    if(this.formGroupConvotoria.valid)
    {
      if(!(this.completa==false && this.parcial==false && this.porHoras==false))
      {
        let dataForm = this.formGroupConvotoria.getRawValue()

        let tipoJornada=""
        if(this.completa==true)tipoJornada="Completo"
        else if(this.parcial==true)tipoJornada="Parcial"
        else if(this.porHoras==true)tipoJornada="Por Horas"

        dataForm.tipoJornada = tipoJornada
        dataForm.fechaInicio= datePipeTransform(dataForm.fechaInicio,'yyyy-MM-ddT00:00:00','en-US')
        dataForm.fechaFin= datePipeTransform(dataForm.fechaFin,'yyyy-MM-ddT23:59:59','en-US')
        dataForm.idCategoriaAsignacion=11 //Categoria Tipo Carrera
        
        let dataIdioma:any[]=[]
        if(dataForm.idIdioma!=null && dataForm.idIdioma.length>0)
        {
          dataForm.idIdioma.forEach((e:any) => {
            let data = this.listaGrupoCombo.comboIdioma.find((el:any)=>el.id==e)
            dataIdioma.push(
              {
                idIdioma:data.idIdioma,
                idNivelIdioma:data.idNivelIdioma
              }
            )
          });
        }
        dataForm.idIdiomaInsert = dataIdioma
        console.log(dataForm)

        if(dataForm.id==0) this.InsertarAvisoLaboral(dataForm)
        else if(dataForm.id!=0)this.ActualizarAvisoLaboral(dataForm)
      }else {
        Swal.fire(
          "Jornada no seleccionada!",
          "Selecciona un tipo de jornada",
          "warning"
        )
      }
      
    }
    else this.formGroupConvotoria.markAllAsTouched()
    
  
  }

  generarCodigo(event:any){
    console.log(event)
    if(typeof event.id=="number"){
      if (event.detalleConvocatoria.length > 0) {
        this.formGroupConvotoria.get('codigo').setValue
        (event.codigo + "-" + (event.detalleConvocatoria[0].ultimaSecuencia + 1));
      }
      else {
        this.formGroupConvotoria.get('codigo').setValue(event.codigo + "-" + 1);
      }
    }
    else this.formGroupConvotoria.get('codigo').setValue(null)
  }

  ResetarBonoComision(tipo:number){
    if(tipo==1){
      this.formGroupConvotoria.get('bonoIdMoneda').reset()
      this.formGroupConvotoria.get('montoDesdeBono').reset()
      this.formGroupConvotoria.get('montoHastaBono').reset()
    }
    else if (tipo==2){
      this.formGroupConvotoria.get('comisionIdMoneda').reset()
      this.formGroupConvotoria.get('montoDesdeComision').reset()
      this.formGroupConvotoria.get('montoHastaComision').reset()
    }
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones CRUD------------------------------------------------------------------

  InsertarAvisoLaboral(dataForm : any){
    this.loaderModal=true
    this.integraService
    .postJsonResponse(constApiGestionPersonal.ConvocatoriaPersonalInsertar,dataForm)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        let jsonEmit={
          data:response.body,
          tipo:"insert"
        }
        this.resultadoEmit.emit(jsonEmit)
        this.loaderModal=false
        Swal.fire(
          "Operacion Exitosa!",
          "El registro fue guardado correctamente!",
          "success" 
          )
        this.modal.dismiss('Cross click')
        
      },
      error: (error) => {
        this.loaderModal=false
        this.finanzasService.MensajeDeError(error," insertar Aviso Laboral")
      },
      complete: () => {},
    });
  }

  ActualizarAvisoLaboral(dataForm:any){
    this.loaderModal=true
    this.integraService
    .putJsonResponse(constApiGestionPersonal.ConvocatoriaPersonalActualizar,dataForm)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        let jsonEmit={
          data:response.body,
          tipo:"update"
        }
        this.resultadoEmit.emit(jsonEmit)
        this.loaderModal=false
        Swal.fire(
          "Operacion Exitosa!",
          "El registro fue actualizado correctamente!",
          "success" 
          )
        this.modal.dismiss('Cross click')
      },
      error: (error) => {
        this.loaderModal=false
        this.finanzasService.MensajeDeError(error," actualizar Aviso Laboral")
      },
      complete: () => {},
    });
  }

}

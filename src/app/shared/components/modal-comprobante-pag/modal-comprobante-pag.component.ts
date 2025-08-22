import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { constApi, constApiFinanzas } from '@environments/constApi';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { ComprobantePagoEnvio, DocumentoSunatCombo } from '@integra/models/comprobante-pago';
import { DetraccionCombo } from '@integra/models/detraccion';
import { MonedaCombo } from '@integra/models/moneda';
import { proveedorComboEgreso } from '@integra/models/proveedor';
import { RetencionCombo } from '@integra/models/retencion';
import { TipoImpuestoCombo } from '@integra/models/tipo-impuesto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ComboPaisDTO } from '@shared/models/combo';
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { UserService } from '@shared/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-comprobante-pag',
  templateUrl: './modal-comprobante-pag.component.html',
  styleUrls: ['./modal-comprobante-pag.component.scss']
})
export class ModalComprobantePagComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    private finanzasService:FinanzasServiceService,
    private userService: UserService
  ) {}

  @Output() cargarData:EventEmitter<void>=new EventEmitter<void>();

  @Input() public modal: any;
  @Input() public nombreModal:string="";
  @Input() public nombreBTN:string="";
  @Input() public listaSede:any[]=[];
  @Input() public listaMoneda :MonedaCombo[]=[];
  @Input() public listaDocSunat :DocumentoSunatCombo[]=[];
  @Input() public listaTipoImpuesto:TipoImpuestoCombo[]=[];
  @Input() public listaRetencion:RetencionCombo[]=[];
  @Input() public listaDetraccion:DetraccionCombo[]=[];
  @Input() public listaPais:ComboPaisDTO[];
  @Input() public dataEditar: any;

  loaderModalComprobante:boolean=false
  
  
  listaProveedor:proveedorComboEgreso[]=[]
  itemsRetencion:RetencionCombo[]=[];
  itemsDetraccion:DetraccionCombo[] = [];
  itemsDocSunat :DocumentoSunatCombo[]=[];
  retencion:number=0

  formGroupComprobante: FormGroup = this.formBuilder.group({
    id: [0],
    idSede:[null,[
      Validators.required
    ]],
    idSunatDocumento:[null,[
      Validators.required
    ]],
    idProveedor:[null,[
      Validators.required
    ]],
    serie:[null,[
      Validators.required
    ]],
    nroComprobante:[null,[
      Validators.required
    ]],
    fechaEmision:[null,[
      Validators.required
    ]],
    fechaProgramacion:[null,[
      Validators.required
    ]],
    idPais:[null,[
      Validators.required
    ]],
    montoInafecto:null,
    montoBruto:[null,[
      Validators.required
    ]],
    otraTazaContribucion:null,
    ajusteMontoBruto:null,
    montoIgv:null,
    idTipoImpuesto:null,
    idRetencion:null,
    idDetraccion:null,
    idMoneda:[null,[
      Validators.required
    ]],
    porcentajeIgv:null,
    montoNeto:null,
    igvChek:false,
    detraccionChek:false,
    retencionChek:false,
  });

  ngOnInit(): void {
    this.itemsDocSunat=this.listaDocSunat
    if(this.dataEditar!=null)
    {
      this.seleccionPais({id:this.dataEditar.idPais})
      if(this.dataEditar.idTipoImpuesto!=null)
        this.formGroupComprobante.get('igvChek').setValue(true);
      if(this.dataEditar.idRetencion!=null)
        this.formGroupComprobante.get('retencionChek').setValue(true);
      if(this.dataEditar.idDetraccion!=null)
        this.formGroupComprobante.get('detraccionChek').setValue(true)
      let proveedor = this.dataEditar.razonSocial.substring(0,4)
      this.obtenerComboProvedorAutoComplete(proveedor)

      this.dataEditar.idSede = this.listaSede.find((e:any)=>e.id==this.dataEditar.idSede)!=null?
                               this.dataEditar.idSede:null

      this.formGroupComprobante.patchValue(this.dataEditar)
    }
  }

  obtenerComboProvedorAutoComplete(valor:string){//Obtiene el Proveedor
    this.integraService
    .getJsonResponse(
      constApi.ProveedorObtnerComboAutocomplete+"/"+valor
    )
    .subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log("Proveedor",response)
        this.listaProveedor=response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"MODAL - PROVEEDOR AUTOCOMPLETE")

      },
      complete: () => {},
    });
  }



  getErrorMessageComprobante(controlName: string): string {//Obtiene mensajes de error del Modal Comprobante de Pago
    let erroMsj: any = {
      idSunatDocumento: {required: 'Seleccione un documento, es necesario!'},
      idProveedor:{required: 'Seleccione un proveedor, es necesario!'},
      serie:{required: ''},
      nroComprobante:{required: ''},
      fechaEmision:{required: 'Ingrese una fecha,es necesario!'},
      fechaProgramacion:{required: 'Ingrese una fecha,es necesario!'},
      idPais:{required: 'Seleccione un pais, es necesario!'},
      montoBruto:{required: 'El monto afecto es necesario!'},
      idMoneda:{required: 'Seleccione una moneda,es necesario!'}
    };
    let formControl: FormControl = this.formGroupComprobante.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }
    if (formControl.hasError('validNumeroCuenta')) {
      return erroMsj[controlName].validNumeroCuenta;
    }
    return null;
  }

  filterChangeProvedor(event:any){//Busca el proveedor en el DropDownList Proveedor
    if(event.length>=4)
    {
      this.obtenerComboProvedorAutoComplete(event);
    }
  }

  filterChangeDocSunat(event:any){//Busca el documento de sunat
    if(event.length>=1)
    {
      this.itemsDocSunat= this.listaDocSunat.filter(
        (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    } else this.itemsDocSunat=this.listaDocSunat
  }
  
  seleccionPais(event:any){//Configuracion de Impuestos,Rentenciones y demas Pais

    let igv = this.listaTipoImpuesto.find(e=>e.idPais==event.id)
    this.itemsDetraccion = this.listaDetraccion.filter(e=>e.idPais==event.id)
    this.itemsRetencion = this.listaRetencion.filter(e=>e.idPais==event.id)
    this.formGroupComprobante.get('retencionChek').setValue(false)
    this.formGroupComprobante.get('idRetencion').setValue(null)
    this.retencion=0
    this.formGroupComprobante.get('detraccionChek').setValue(false)
    this.formGroupComprobante.get('idDetraccion').setValue(null)
    this.formGroupComprobante.get('igvChek').setValue(false)
    this.CalcularMontoNetoComprobante()
    if(igv) this.formGroupComprobante.get('porcentajeIgv').setValue(igv.nombre);
    else this.formGroupComprobante.get('porcentajeIgv').setValue("")
  }


  seleccionPreveedor(event:proveedorComboEgreso){//Configuracion de Impuestos, Retencion y  demas Proveedor
    this.formGroupComprobante.get('idPais').setValue(event.idPais);
    this.cargarImpuestoProveedor(event.idRetencion,event.idDetraccion,event.idTipoImpuesto);
    this.seleccionPais({id:event.idPais})

  }
  cargarImpuestoProveedor(retencion:any,detraccion:any,tipoImpuesto:any){//Cargar Impuesto ,Retencion por Proveedor
    if(typeof retencion=='number'&& retencion!=0) this.formGroupComprobante.get('retencionChek').setValue(true)
    if(typeof detraccion=='number'&& detraccion!=0) this.formGroupComprobante.get('detraccionChek').setValue(true)
    if(typeof tipoImpuesto=='number'&& tipoImpuesto!=0) this.formGroupComprobante.get('igvChek').setValue(true)
  }

  onBlurSerie(){//Autocomplete al salir del Objeto Serie
    var serie = (this.formGroupComprobante.get('serie').value)
    var nuevaSerie=""
    if(serie.length==0)
    {
      nuevaSerie="000000"
    }
    else{
      serie = serie.toUpperCase()
      let ceros=""
      for (let index = 0; index < 6 - serie.length; index++) {
        ceros+='0'
      }
      nuevaSerie = ceros+serie
    }
    this.formGroupComprobante.get('serie').setValue(nuevaSerie)
  }
  onBlurNumero(){//Autocomplete al salir del Objeto Numero
    var serie = (this.formGroupComprobante.get('nroComprobante').value)
    var nuevaSerie=""
    if(serie.length==0)
    {
      nuevaSerie="0000000000000"
    }
    else{
      serie = serie.toUpperCase()
      let ceros=""
      for (let index = 0; index < 13 - serie.length; index++) {
        ceros+='0'
      }
      nuevaSerie = ceros+serie
    }
    this.formGroupComprobante.get('nroComprobante').setValue(nuevaSerie)
  }

  CalcularMontoNetoComprobante(){//Calcula el monto Neto del Comprobante
    let Minafecto =  this.formGroupComprobante.get('montoInafecto').value
    let Mafecto =  this.formGroupComprobante.get('montoBruto').value
    let otraTazaContribucion=  this.formGroupComprobante.get('otraTazaContribucion').value
    let ajuste =  this.formGroupComprobante.get('ajusteMontoBruto').value
    let impuestoPais =  this.formGroupComprobante.get('idPais').value
    let detraccion =  this.formGroupComprobante.get('idDetraccion').value
    let igvCheck =  this.formGroupComprobante.get('igvChek').value
    let valorRetencion=0
    let valorDetraccion=0
    let valorImpuesto=0
    if(!(/^-?\d+$/.test(Minafecto)) && typeof Minafecto !=="number")Minafecto=0
    if(!(/^-?\d+$/.test(Mafecto)) && typeof Mafecto !=="number")Mafecto=0
    if(!(/^-?\d+$./.test(ajuste))&& typeof ajuste !=="number")ajuste=0
    if(!(/^-?\d+$./.test(otraTazaContribucion))&& typeof otraTazaContribucion !=="number")otraTazaContribucion=0
    if((/^-?\d+$/.test(impuestoPais)) && igvCheck==true)
    {
      let porcentajeImpuesto = this.listaTipoImpuesto.find(e=>e.idPais===impuestoPais).valor
      valorImpuesto=(Mafecto*porcentajeImpuesto)/100
    }
    if(this.retencion!==0){
      let porcentajeRetencion = this.listaRetencion.find(e=>e.id===this.retencion).valor
      valorRetencion = (Mafecto*porcentajeRetencion)/100
    }
    if((/^-?\d+$/.test(detraccion))){
      let porcentajeDetraccion = this.listaRetencion.find(e=>e.id===detraccion).valor
      valorDetraccion = (Mafecto*porcentajeDetraccion)/100
    }
    let finalMAfecto = Mafecto+valorImpuesto-valorRetencion+otraTazaContribucion;
    let ValorNeto= finalMAfecto+Minafecto+ajuste

    this.formGroupComprobante.get('montoNeto').setValue(ValorNeto);
  } 

  retencionChekEstado(event:any){//Configuracion de Retencion
    let Check =  this.formGroupComprobante.get('retencionChek').value
    this.retencion=0
    if(!Check) this.formGroupComprobante.get('idRetencion').setValue(null)
    this.CalcularMontoNetoComprobante()
  }

  detraccionChekEstado(event:any){//Configuracion de Detracción
    let Check =  this.formGroupComprobante.get('detraccionChek').value
    if(!Check) this.formGroupComprobante.get('idDetraccion').setValue(null)
    this.CalcularMontoNetoComprobante()
    
  }
  selectionChancge(event:RetencionCombo){//Configuracion al cambio de seleccion de retencion
    this.retencion=event.id
    this. CalcularMontoNetoComprobante()
  }

  validFormComprobante(): boolean {//Valida el Modal Comprobante
    if(this.formGroupComprobante.valid){
      return true;
    }
    else {
      this.formGroupComprobante.markAllAsTouched();
      return false;
    }
    
  }

  procesarDataComprobante(isNew:boolean,data:any):ComprobantePagoEnvio{//Procesa la data de Comprobante de pago para guardar
    console.log(this.listaSede)
    let Sede = this.listaSede.find((e:any)=>e.id==data.idSede)
    let igv
    if(data.igvChek==null) igv=false
    else igv=data.igvChek
    let tipoImpuesto = this.listaTipoImpuesto.find(e=>e.idPais===data.idPais)
    let procesado:any={
      id: isNew?0:data.id,
      idSunatDocumento: data.idSunatDocumento,
      idPais: data.idPais,
      idEmpresa:Sede.idEmpresa,
      idCiudad:Sede.idCiudad,
      idProveedor: data.idProveedor,
      serieComprobante: data.serie,
      numeroComprobante: data.nroComprobante,
      idMoneda: data.idMoneda,
      montoBruto: data.montoBruto,
      montoInafecto: data.montoInafecto,
      porcentajeIgv:igv? tipoImpuesto.valor: null,
      montoIgv:igv? (data.montoBruto*tipoImpuesto.valor)/100:null,
      ajusteMontoBruto: data.ajusteMontoBruto?data.ajusteMontoBruto:0,
      montoNeto:data.montoNeto,
      otraTazaContribucion: data.otraTazaContribucion,
      fechaEmision: data.fechaEmision,
      fechaProgramacion:  data.fechaProgramacion,
      idTipoImpuesto: igv? tipoImpuesto.id: null,
      idRetencion: data.idRetencion,
      idDetraccion: data.idDetraccion,
      usuario: this.userService.userName
    }
    return procesado
  }

  accionModalComprobante(){// accion del modal comprobar Nuevo
    if(this.dataEditar==null) this.crearComprobante()
    else this.actualizarComprobante()
  }


  crearComprobante(){//Inserta el Comprobante de Pago
    if(this.validFormComprobante())
    {
      this.loaderModalComprobante = true;
      let dataForm = this.formGroupComprobante.getRawValue();
      let dataEnvio= this.procesarDataComprobante(true,dataForm);
      console.log(dataEnvio);
      this.integraService
        .insertar(constApiFinanzas.ComprobantPagoInsertar, dataEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.cargarData.emit()
            Swal.fire(
              'Comprobante de pago!',
              'El comprobante de pago se ha creado exitosamente.',
              'success'
            );
          },
          error: (error) => {
            this.loaderModalComprobante = false;
            this.finanzasService.MensajeDeError(error,"MODAL - CREAR COMPROBANTE PAGO");
          },
          complete: () => {
            this.loaderModalComprobante = false;
            this.modal.close('Close click');

          },
      });
    }
  }

  actualizarComprobante(){
    if(this.validFormComprobante())
    {
      this.loaderModalComprobante = true;
      let dataForm = this.formGroupComprobante.getRawValue();
      let dataEnvio= this.procesarDataComprobante(false,dataForm);
      this.integraService
        .actualizar(constApiFinanzas.ComprobantpagoActualizar, dataEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.loaderModalComprobante = false;
            this.cargarData.emit()
            Swal.fire(
              'Comprobante de pago!',
              'El comprobante de pago se ha actualizado exitosamente.',
              'success'
            );
          },
          error: (error) => {
            this.loaderModalComprobante = false;
            this.finanzasService.MensajeDeError(error,"MODAL - EDITAR COMPROBANTE PAGO");
          },
          complete: () => {
            this.loaderModalComprobante = false;
            this.modal.close('Close click');
          },
      });
    }
  }


}

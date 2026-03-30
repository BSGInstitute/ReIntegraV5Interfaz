import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { constApi, constApiGlobal } from '@environments/constApi';
import { DetraccionCombo } from '@integra/models/detraccion';
import { EmpresaRegionCombo } from '@integra/models/empresa';
import { EntidadFinancieraCombo } from '@integra/models/entidad-financiera';
import { MonedaCombo } from '@integra/models/moneda';
import { PaisCombo } from '@integra/models/pais';
import {  ProveedorCalificacionEnvio, ProveedorCuentaBancaria, ProveedorEnvio } from '@integra/models/proveedor';
import { RetencionCombo } from '@integra/models/retencion';
import { TipoCuentaBancoCombo } from '@integra/models/tipo-cuenta-banco';
import { TipoImpuestoCombo } from '@integra/models/tipo-impuesto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Parametro } from '@shared/models/parametro';
import { IntegraService } from '@shared/services/integra.service';
import { TextValidator } from '@shared/validators/text.validator';
import Swal from 'sweetalert2';
import { GridProveedor } from './grid-proveedor';
import { GridProveedorCuentaBancaria } from './grid-proveedor-cuenta';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { UserService } from '@shared/services/user.service';

const pipe = new DatePipe('en-US');
const formatoFecha: string = 'yyyy-MM-ddTHH:mm:ss.SSS';
const iconInputValidation: string = 'k-input-validation-icon k-icon k-i-check text-valid-success';
@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.scss']
})
export class ProveedorComponent implements OnInit {

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private modalServiceCuenta: NgbModal,
    public finanzasService: FinanzasServiceService,
    private userService: UserService,

    ) {}
    
    formGroupProveedor: FormGroup = this.formBuilder.group({
      id: [0],
      idTipoContribuyente: ['', Validators.required],
      idDocumentoIdentidad: ['', Validators.required],
      nroDocumento:['',[
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
        this.validarNroDoc(this.retornarValor())
      ]],
      tipoContribuyente:'',
      razonSocial: ['',[
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      apePaterno: ['',[
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      apeMaterno: ['',[
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      nombre1: ['',[
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      nombre2 :['',[
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      descripcion : ['',[
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      direccion:['',[
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      idCiudad:['', Validators.required],
      idPais:['', Validators.required],
      telefono:['',[
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      celular1:['',[
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      celular2:['',[
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      email:['',[
        Validators.email,
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      contacto1:['',[
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      contacto2:['',[
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      idImpuesto:'',
      idPersonalAsignado:'',
      idRetencion:'',
      idDetraccion:'',
      idPrestacionRegistro:'',
      alias:['',[
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      esDocente: [false],
    });
    formGroupCuentaBancaria: FormGroup = this.formBuilder.group({
      id: [0],
      idEntidadFinanciera:['', Validators.required],
      idTipoCuentaBanco:['', Validators.required],
      nroCuenta:['',[
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      cuentaInterbancaria:['',[
        Validators.required,
        TextValidator.noStartSpace,
        TextValidator.noEndSpace,
      ]],
      idMoneda:['', Validators.required],
    })
    formGroupCalificacion: FormGroup = this.formBuilder.group({
      id1:['', Validators.required],
      id2:['', Validators.required],
      id3:['', Validators.required],
      id4:['', Validators.required],
      id5:['', Validators.required],
      total:'',
    })

    // Formulario para conversión de tipo contribuyente
    formGroupConversion: FormGroup = this.formBuilder.group({
      id: [0],
      idTipoContribuyente: ['', Validators.required],
      idDocumentoIdentidad: ['', Validators.required],
      nroDocumento: ['', [Validators.required, TextValidator.noStartSpace, TextValidator.noEndSpace]],
      razonSocial: ['', [TextValidator.noStartSpace, TextValidator.noEndSpace]],
      apePaterno: ['', [TextValidator.noStartSpace, TextValidator.noEndSpace]],
      apeMaterno: ['', [TextValidator.noStartSpace, TextValidator.noEndSpace]],
      nombre1: ['', [TextValidator.noStartSpace, TextValidator.noEndSpace]],
      nombre2: ['', [TextValidator.noStartSpace, TextValidator.noEndSpace]],
      direccion: ['', [TextValidator.noStartSpace, TextValidator.noEndSpace]],
      email: ['', [Validators.email, Validators.required, TextValidator.noStartSpace, TextValidator.noEndSpace]],
      telefono: ['', [TextValidator.noStartSpace, TextValidator.noEndSpace]],
      idPais: [''],
      idCiudad: [''],
    })

  ///-----------Variables:------------------
  nombreServicio:string='';
  nuevo:boolean=false;
  personaNatural:boolean=false;
  successIcon: string = iconInputValidation;
  loaderModal: boolean = false;
  loaderModalCalificacion: boolean = false;
  loaderModalProveedor: boolean = false;
  modalRefProveedor:any;
  modalRefCuenta:any;
  loader: boolean = false;
  btnModalNombre: string = '';
  nombreModal: string = '';
  total:number=0;
  vcriterio1:number=0;
  vcriterio2:number=0;
  vcriterio3:number=0;
  vcriterio4:number=0;
  vcriterio5:number=0;
  tipoPrestacion:boolean=true;
  cuentaEdit:boolean=false;
  cuentaTemp:ProveedorCuentaBancaria;
  idTipoDoc:number;

  proveedorBuscar =new FormControl('');
  tipoContribuyente =new FormControl('');
  itemsCuenta:ProveedorCuentaBancaria[]=[];
  itemsProveedor:any[]=[];
  ListaProveedorCombo:any[]=[]
  ListaTipoContribuyente:any[]=[]
  itemsProveedorCombo:any[]=[]
  listaTipoCuenta:TipoCuentaBancoCombo[]=[];
  listaMoneda:MonedaCombo[]=[];
  listaBanco:EntidadFinancieraCombo[]=[];
  ListaDocIdentidad:any[]=[];
  itemsDocIdentidad:any[]=[];
  listaPais:PaisCombo[]=[];
  listaPrestacionRegistro:any []=[];
  listaCiudad:EmpresaRegionCombo[]=[];
  itemsCiudad:EmpresaRegionCombo[]=[];
  listaCoordinadores:any[]=[];
  listaTipoImpuesto:TipoImpuestoCombo[]=[];
  itemsTipoImpuesto:TipoImpuestoCombo[]=[];
  listaRetencion:RetencionCombo[]=[];
  itemsRetencion:RetencionCombo[]=[];
  listaDetraccion:DetraccionCombo[]=[];
  itemsDetraccion:DetraccionCombo[]=[];
  itemSubCriteriosid1:any[]=[];
  itemSubCriteriosid2:any[]=[];
  itemSubCriteriosid3:any[]=[];
  itemSubCriteriosid4:any[]=[];
  itemSubCriteriosid5:any[]=[];

  // Variables para conversión de tipo contribuyente
  loaderModalConversion: boolean = false;
  modalRefSeleccionTipo: any;
  modalRefConversion: any;
  opcionesCambioTipo: any[] = [];
  tipoContribuyenteActual: string = '';
  tipoContribuyenteActualId: number = 0;
  nuevoTipoContribuyenteNombre: string = '';
  nuevoTipoContribuyenteId: number = 0;
  conversionANatural: boolean = false;
  conversionANoDomiciliada: boolean = false;
  itemsDocIdentidadConversion: any[] = [];
  proveedorOriginal: any = null;

  gridProveedor = new GridProveedor();
  gridProveedorCuenta = new GridProveedorCuentaBancaria();
  @ViewChild('modalProveedor') modalProveedor: any;
  @ViewChild('modalCuentaBancariaProveedor') modalCuentaBancariaProveedor: any;
  @ViewChild('modalCalificacion') modalCalificacion: any;
  @ViewChild('modalSeleccionTipo') modalSeleccionTipo: any;
  @ViewChild('modalConversion') modalConversion: any;
  


  ngOnInit(): void {
    this.loader=true
    this.ObtenerSubCriteriosCalificacion()
    this.ObtenerComboDetraccion()
    this.ObtenerComboRetencion()
    this.ObtenerComboCoordinadores()
    this.ObtenerPrestacionRegistro()
    this.ObtenerCiudadCombo()
    this.ObtenerComboPais()
    this.ObtenerDocumentoIdentidadObtenerCombo()
    this.ObtenerComboMoneda()
    this.ObtenerTipoCuentaBanco()
    this.ObtenerComboEntidadFinanciera()
    this.ObtenerProveedorObtenerTipoContribuyente()
    this.ObtenerProveedorRUC()

   
  }

  ObtenerProveedorRUC(){
    this.integraService.obtenerTodo(constApi.ProveedorObtenerProveedorRuc).subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response)
        this.ListaProveedorCombo = response.body;
        this.loader=false
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Proveedor RUC');
        this.loader=false
      },
      complete: () => {},
    });
  }


  ObtenerProveedorObtenerTipoContribuyente(){
    this.integraService.obtenerTodo(constApi.ProveedorObtenerTipoContribuyente).subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response)
        this.ListaTipoContribuyente = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Proveedor Tipo Contribuyente');
      },
      complete: () => {},
    });
  }

  ObtenerComboEntidadFinanciera(){
    this.integraService.obtenerTodo(constApi.EntidadFinancieraObtenerCombo).subscribe({
      next: (response: HttpResponse<EntidadFinancieraCombo[]>) => {
        this.listaBanco = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Combo Entidad Financiera');

      },
      complete: () => {},
    });
  }

  ObtenerTipoCuentaBanco(){
    this.integraService.obtenerTodo(constApi.TipoCuentaBancoObtenerCombo).subscribe({
      next: (response: HttpResponse<TipoCuentaBancoCombo[]>) => {
        this.listaTipoCuenta = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Tipo Cuenta Banco');

      },
      complete: () => {},
    });
  }

  ObtenerComboMoneda(){
    this.integraService.obtenerTodo(constApi.MonedaObtenerCombo).subscribe({
      next: (response: HttpResponse<MonedaCombo[]>) => {
        this.listaMoneda = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Combo Moneda');
      },
      complete: () => {},
    });
  }

  ObtenerDocumentoIdentidadObtenerCombo(){
    this.integraService.obtenerTodo(constApi.DocumentoIdentidadObtenerCombo).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.ListaDocIdentidad = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Documento Identidad Combo');
      },
      complete: () => {},
    });
  }

  ObtenerComboPais(){
    this.integraService.obtenerTodo(constApiGlobal.PaisObtenerPaisCombo).subscribe({
      next: (response: HttpResponse<PaisCombo[]>) => {
        this.listaPais = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Combo Pais');
      },
      complete: () => {},
    });
  }

  ObtenerCiudadCombo(){
    this.integraService.obtenerTodo(constApi.CiudadObtenerCombo).subscribe({
      next: (response: HttpResponse<EmpresaRegionCombo[]>) => {
        this.listaCiudad = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Ciudad Combo');
      },
      complete: () => {},
    });
  }

  ObtenerPrestacionRegistro(){
    this.integraService.obtenerTodo(constApi.ProveedorObtenerPrestacionRegistro).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaPrestacionRegistro = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Prestación Registro');
      },
      complete: () => {},
    });
  }

  ObtenerComboCoordinadores(){
    this.integraService.obtenerTodo(constApi.ProveedorObtenerCoordinadores).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.listaCoordinadores = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Combo Coordinadores');
      },
      complete: () => {},
    });
  }

  ObtenerComboTipoImpuesto(){
    this.integraService.obtenerTodo(constApi.TipoImpuestoObtenerCombo).subscribe({
      next: (response: HttpResponse<TipoImpuestoCombo[]>) => {
        this.listaTipoImpuesto = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Combo Tipo Impuesto')
      },
      complete: () => {},
    });
  }

  ObtenerComboRetencion(){
    this.integraService.obtenerTodo(constApi.RetencionObtenerCombo).subscribe({
      next: (response: HttpResponse<TipoImpuestoCombo[]>) => {
        this.listaRetencion = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Combo Retención')
      },
      complete: () => {},
    });
  }

  ObtenerComboDetraccion(){
    this.integraService.obtenerTodo(constApi.DetraccionObtenerCombo).subscribe({
      next: (response: HttpResponse<TipoImpuestoCombo[]>) => {
        this.listaDetraccion = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Combo Detraccion')
      },
      complete: () => {},
    });
  }

  ObtenerSubCriteriosCalificacion(){
    this.integraService.obtenerTodo(constApi.ProveedorObtenerSubCriteriosCalificacion).subscribe({
      next: (response: HttpResponse<any[]>) => {
        this.llenarCombosSubCriterio(response.body)
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,'Obtener Sub Criterios Calificacion')
      },
      complete: () => {},
    });
  }

  ///-----Funciones -----------------------

  retornarValor():number{
    return this.idTipoDoc
  }
  tipoDoc(e:any){
    if((/^-?\d+$/.test(e.id))) this.idTipoDoc=e.id;
    else this.idTipoDoc=-10
    console.log(this.idTipoDoc)
  }

  validarNroDoc (tipodoc: number): ValidatorFn {
  return function (control: AbstractControl): ValidationErrors| null {
    console.log(tipodoc)
    switch(tipodoc){
      case 1:
        if((/^-?\d+$/.test(control.value) && (control.value).length==8))
          return null;
        else return { validarNroDoc: true };
      default:
        break;
    }
    return null;
  }
}


  criterio5(e:any){
    
    if(!(/^-?\d+$/.test(e.puntaje))) this.vcriterio5=0;
    else this.vcriterio5=e.puntaje
    this.calcularTotal()
  }
  criterio4(e:any){
    if(!(/^-?\d+$/.test(e.puntaje))) this.vcriterio4=0;
    else this.vcriterio4=e.puntaje
    this.calcularTotal()
  }
  criterio3(e:any){
    if(!(/^-?\d+$/.test(e.puntaje))) this.vcriterio3=0;
    else this.vcriterio3=e.puntaje
    this.calcularTotal()
  }
  criterio2(e:any){
    if(!(/^-?\d+$/.test(e.puntaje))) this.vcriterio2=0;
    else this.vcriterio2=e.puntaje
    this.calcularTotal()
  }
  criterio1(e:any){
    if(!(/^-?\d+$/.test(e.puntaje))) this.vcriterio1=0;
    else this.vcriterio1=e.puntaje
    this.calcularTotal()
  }
  calcularTotal(){
    this.total= this.vcriterio5+this.vcriterio4+this.vcriterio3+this.vcriterio2+this.vcriterio1
    this.formGroupCalificacion.patchValue({total:(this.total.toString())})
  }

  getShowSuccessIconProveedor(controlName: string): boolean{
    let formControl: FormControl = this.formGroupProveedor.get(controlName) as FormControl;
    return !this.getValidControlProveedor(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControlProveedor(controlName: string): boolean {
    let formControl: FormControl = this.formGroupProveedor.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  getShowSuccessIconCuenta(controlName: string): boolean{
    let formControl: FormControl = this.formGroupCuentaBancaria.get(controlName) as FormControl;
    return !this.getValidControlCuenta(controlName) && formControl.value != null && formControl.value != '';
  }
  getValidControlCuenta(controlName: string): boolean {
    let formControl: FormControl = this.formGroupCuentaBancaria.get(controlName) as FormControl;
    if (formControl.invalid && (formControl.dirty || formControl.touched)) {
      return true
    }
    return false;
  }
  validFormProveedorCuenta(): boolean {
    if(this.formGroupCuentaBancaria.invalid){
      this.formGroupCuentaBancaria.markAllAsTouched();
      return false;
    }
    return true;
  }
  validFormProveedor(): boolean {
    if(this.formGroupProveedor.invalid){
      this.formGroupProveedor.markAllAsTouched();
      return false;
    }
    return true;
  }
  validFormCalificacion(): boolean {
    if(this.formGroupCalificacion.invalid){
      this.formGroupCalificacion.markAllAsTouched();
      return false;
    }
    return true;
  }

  llenarCombosSubCriterio(data:any){
    data.forEach((e:any) => {
      if(e.idCriterioCalificacion==1) this.itemSubCriteriosid1.push(e)
      if(e.idCriterioCalificacion==2) this.itemSubCriteriosid2.push(e)
      if(e.idCriterioCalificacion==3) this.itemSubCriteriosid3.push(e)
      if(e.idCriterioCalificacion==4) this.itemSubCriteriosid4.push(e)
      if(e.idCriterioCalificacion==5) this.itemSubCriteriosid5.push(e)
    });
  }

  getErrorMessageCalificacion(controlName: string): string {
    let erroMsj: any = {
      id5: {required: 'Seleccione una calificación!'},
      id4: {required: 'Seleccione una calificación!'},
      id3: {required: 'Seleccione una calificación!'},
      id2: {required: 'Seleccione una calificación!'},
      id1: {required: 'Seleccione una calificación!'},
    }
    let formControl: FormControl = this.formGroupCalificacion.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    return null;
  }
  getErrorMessageProveedorCuenta(controlName: string): string {
    let erroMsj: any = {
      idEntidadFinanciera: {
        required: 'Seleccione un banco!'},
      idTipoCuentaBanco: {
        required: 'Seleccione un tipo de cuenta!'},
      nroCuenta: {
        required: 'El número de cuenta es necesario!',
        noStartSpace: 'El número de cuenta no puede empezar con espacio!',
        noEndSpace: 'El número de cuenta no puede terminar con espacio!',},
      cuentaInterbancaria: {
        required: 'El número de cuenta interbancaria es necesario!',
        noStartSpace: 'El número de cuenta interbancaria no puede empezar con espacio!',
        noEndSpace: 'El número de cuenta interbancaria no puede terminar con espacio!',},
      idMoneda: {
        required: 'Seleccione un tipo de monedad!'},
    }
    let formControl: FormControl = this.formGroupCuentaBancaria.get(controlName) as FormControl;
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

  getErrorMessageProveedor(controlName: string): string {
    let erroMsj: any = {
      idDocumentoIdentidad: {
        required: 'Seleccione un tipo de documento!'},
      nroDocumento: {
        required: 'El número de documento es necesario!',
        noStartSpace: 'El número de documento no puede empezar con espacio!',
        noEndSpace: 'El número de documento no puede terminar con espacio!',
        validarNroDoc: 'El número de documento no es correcto!',},
      razonSocial: {
        required: 'La razón social es necesaria!',
        noStartSpace: 'La razón social no puede empezar con espacio!',
        noEndSpace: 'La razón social no puede terminar con espacio!'},
      apePaterno: {
        required: 'El apellido paterno es necesario!',
        noStartSpace: 'El apellido paterno no puede empezar con espacio!',
        noEndSpace: 'El apellido paterno no puede terminar con espacio!'},
      apeMaterno: {
        required: 'El apellido materno es necesario!',
        noStartSpace: 'El apellido materno no puede empezar con espacio!',
        noEndSpace: 'El apellido materno no puede terminar con espacio!'},
      nombre1: {
        required: 'El nombre es necesario!',
        noStartSpace: 'El nombre no puede empezar con espacio!',
        noEndSpace: 'El nombre no puede terminar con espacio!'},
      nombre2: {
        noStartSpace: 'El nombre no puede empezar con espacio!',
        noEndSpace: 'El nombre no puede terminar con espacio!',},
      direccion: {
        noStartSpace: 'La dirección no puede empezar con espacio!',
        noEndSpace: 'La dirección no puede terminar con espacio!',},
      descripcion: {
        noStartSpace: 'La descripción no puede empezar con espacio!',
        noEndSpace: 'La descripción no puede terminar con espacio!',},
      idPais: {
        required: 'Seleccione un pais!'},
      idCiudad: {
        required: 'Seleccione una ciudad!'},
      contacto1: {
        noStartSpace: 'El contacto no puede empezar con espacio!',
        noEndSpace: 'El contacto no puede terminar con espacio!',},
      contacto2: {
        noStartSpace: 'El contacto no puede empezar con espacio!',
        noEndSpace: 'El contacto no puede terminar con espacio!',},
      telefono: {
        noStartSpace: 'El contacto no puede empezar con espacio!',
        noEndSpace: 'El contacto no puede terminar con espacio!',},
      celular1: {
        noStartSpace: 'El celular no puede empezar con espacio!',
        noEndSpace: 'El celular no puede terminar con espacio!',},
      celular2: {
        noStartSpace: 'El celular no puede empezar con espacio!',
        noEndSpace: 'El celular no puede terminar con espacio!',},
      email: {
        required: 'El email es necesario!',
        noStartSpace: 'El email no puede empezar con espacio!',
        noEndSpace: 'El email no puede terminar con espacio!',
        email:'Ingrese un email valido'},
      alias: {
        noStartSpace: 'El alias no puede empezar con espacio!',
        noEndSpace: 'El alias no puede terminar con espacio!',},

    };
    let formControl: FormControl = this.formGroupProveedor.get(controlName) as FormControl;
    if (formControl.hasError('required')) {
      return erroMsj[controlName].required;
    }
    if (formControl.hasError('noStartSpace')) {
      return erroMsj[controlName].noStartSpace;
    }
    if (formControl.hasError('noEndSpace')) {
      return erroMsj[controlName].noEndSpace;
    }
    if (formControl.hasError('email')) {
      return erroMsj[controlName].email;
    }
    if (formControl.hasError('validarNroDoc')) {
      return erroMsj[controlName].validarNroDoc;
    }
    return null;
  }

  accionModal() {
    let accion = this.btnModalNombre;
    switch (accion) {
      case 'Nuevo':
        console.log(this.itemsCuenta)
        this.insertarProveedor();
        break;
      case 'Actualizar':
        this.editarProveedor();

        break;
    }
  }
  filterChangeProveedor(event:any){
    if(event.length>=2)
    {
      console.log(event)
      this.itemsProveedorCombo= this.ListaProveedorCombo.filter(
        (s) => s.nombre.toLowerCase().indexOf(event.toLowerCase()) !== -1
      );
    }
  }

  BuscarProveedor(){
    let idProveedor=this.proveedorBuscar.value;
    if(!(/^-?\d+$/.test(idProveedor))){
      Swal.fire(
        '¡Maestro Proveedor!',
        'Seleccione un registro para buscar!',
        'warning'
      );
    }else{
      this.ObtenerDatosGrillaProveedor(idProveedor)
    }
  }
  openModalCalificacion(){
    if(this.validFormProveedor)
    {
      let form=this.formGroupProveedor.getRawValue();
      let servicio= this.listaPrestacionRegistro.find(e=> e.id==form.idPrestacionRegistro)
      this.nombreServicio=servicio.nombre;
      this.formGroupCalificacion.reset()
      this.formGroupCalificacion.patchValue({total:'0'})
      this.vcriterio5=0
      this.vcriterio4=0
      this.vcriterio3=0
      this.vcriterio2=0
      this.vcriterio1=0
      this.modalService.open(this.modalCalificacion)
    }
    

  }
  openModalAgregar(){
    let idTipoContribuyente=this.tipoContribuyente.value;
    if(!(/^-?\d+$/.test(idTipoContribuyente))){
      Swal.fire(
        '¡Maestro Proveedor!',
        'Selecciona el tipo de contribuyente que deseas agregar!',
        'warning'
      );
    }else{
      this.nuevo=false;
      this.Modal(idTipoContribuyente,true)
    }
  }
Modal(id:number,isNew:boolean,data?:any){
    this.formGroupProveedor.reset()
    let nombreTC = this.ListaTipoContribuyente.find(e=>e.id==id)
    if(data)
    {
      this.formGroupProveedor.patchValue(data);
    }
    this.formGroupProveedor.patchValue({idTipoContribuyente:nombreTC.id,tipoContribuyente:nombreTC.nombre})
    if(isNew)this.itemsCuenta=[];
    this.btnModalNombre =isNew? 'Nuevo':'Actualizar'
    switch (id){
      case 1:
        this.nombreModal=this.btnModalNombre +' Proveedor Persona Natural';
        this.formGroupProveedor.patchValue({razonSocial:"-"});
        this.personaNatural=true;
        break;
      case 2:
        this.nombreModal=this.btnModalNombre +' Proveedor Persona Juridica';
        this.formGroupProveedor.patchValue({
          apePaterno:"-",
          apeMaterno:"-",
          nombre1:"-",
          nombre2:"",
        });
        this.personaNatural=false;
        break;
      case 3:
        this.nombreModal=this.btnModalNombre +' Proveedor Persona no Domiciliada';
        this.formGroupProveedor.patchValue({
          apePaterno:"-",
          apeMaterno:"-",
          nombre1:"-",
          nombre2:"",
        });
        this.personaNatural=false;
        break;
    }
    this.tipoDocumento(id)
    this.modalRefProveedor = this.modalService.open(this.modalProveedor, { size: 'lg' });
  }

  tipoDocumento(id:number)
  {
    this.itemsDocIdentidad=[];
    switch (id){
      case 1:
        this.ListaDocIdentidad.forEach(e => {
          if(e.id==1 || e.id==6 )
          this.itemsDocIdentidad.push(e)
        });
        break;
      case 2:
        this.ListaDocIdentidad.forEach(e => {
          if(e.id==6)
          this.itemsDocIdentidad.push(e)
        });
        break;
      case 3:
        this.ListaDocIdentidad.forEach(e => {
          if(e.id==0 || e.id==4 || e.id==7 )
          this.itemsDocIdentidad.push(e)
        });
        break;
    }

  }

  openModalBancaria(data?:any){
    if(this.validFormProveedor())
    {
      if(data)
      {
        this.cuentaEdit=true;
        this.cuentaTemp=data;
        this.formGroupCuentaBancaria.patchValue(data)
      }
      else 
      {
        this.cuentaEdit=false;
        this.formGroupCuentaBancaria.reset();
      }
      this.modalRefCuenta = this.modalServiceCuenta.open(this.modalCuentaBancariaProveedor);
    }
    else{console.log(this.formGroupProveedor.getRawValue())}
  }

  ObtenerDatosGrillaProveedor(Id:number){
    this.loader=true
    let params: Parametro[] = [
      { clave: 'IdProveedor', valor: Id}
    ];
    this.integraService.obtenerPorPathParams(constApi.ProveedorObtenerProveedorPorId,params).subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response.body)
        this.itemsProveedor=response.body;
        this.loader = false;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }

  ObtenerCuentasProveedor(Id:number){
    let params: Parametro[] = [
      { clave: 'IdProveedor', valor: Id}
    ];
    this.integraService.obtenerPorPathParams(constApi.ProveedorObtenerCuentasBancarias,params).subscribe({
      next: (response: HttpResponse<any[]>) => {
        console.log(response.body)
        this.itemsCuenta=response.body;
      },
      error: (error) => {
        this.mostrarMensajeError(error);
      },
      complete: () => {},
    });
  }
  mostrarMensajeError(error: any): void {
    this.loader = false;
    Swal.fire({
      icon: 'error',
      html: `<p class=text-start>${error.error}</p>
            <p class=text-start text-danger fs-6>${error.message}</p>`,
      allowOutsideClick: false
    })
  }
  public selectionChangePais(value: any): void {
    this.formGroupProveedor.patchValue({
      idCiudad:null,
      idImpuesto:null,
      idRetencion:null,
      idDetraccion:null,
    });
    this.llenarCombosPorPais(value.id)
  }

  llenarCombosPorPais(id:number){
    this.itemsCiudad=[];
    this.itemsDetraccion=[];
    this.itemsRetencion=[];
    this.itemsTipoImpuesto=[];

    this.itemsCiudad=this.listaCiudad.filter(e=>e.idPais==id)
    this.itemsDetraccion=this.listaDetraccion.filter(e=>e.idPais==id)
    this.itemsRetencion=this.listaRetencion.filter(e=>e.idPais==id)
    this.itemsTipoImpuesto=this.listaTipoImpuesto.filter(e=>e.idPais==id)

  }
  anadirCuenta(modal:any){
    if(this.validFormProveedorCuenta())
    {
      console.log(this.formGroupCuentaBancaria.getRawValue())
      var formCuentabancaria:ProveedorCuentaBancaria = this.formGroupCuentaBancaria.getRawValue()
      var banco = this.listaBanco.find(e=> e.id==formCuentabancaria.idEntidadFinanciera)
      var tipoCuentas = this.listaTipoCuenta.find(e=> e.id==formCuentabancaria.idTipoCuentaBanco)
      var monedas = this.listaMoneda.find(e=> e.id==formCuentabancaria.idMoneda)
      var cuenta:ProveedorCuentaBancaria={
        id:this.cuentaEdit? formCuentabancaria.id:0,
        idProveedor: 0,
        idEntidadFinanciera: formCuentabancaria.idEntidadFinanciera,
        nombreBanco:banco.nombre ,
        idTipoCuentaBanco: formCuentabancaria.idTipoCuentaBanco,
        tipoCuenta: tipoCuentas.nombre,
        nroCuenta: formCuentabancaria.nroCuenta,
        cuentaInterbancaria:formCuentabancaria.cuentaInterbancaria,
        idMoneda: formCuentabancaria.idMoneda,
        moneda: monedas.nombrePlural ,
        usuarioModificacion: this.userService.userName
      }
      if(this.cuentaEdit==true)
      {
        let index = this.itemsCuenta.findIndex(e=> e.id==this.cuentaTemp.id)
        this.itemsCuenta[index]=Object.assign(this.cuentaTemp,cuenta)
      }
      else if(this.cuentaEdit==false) this.itemsCuenta.push(cuenta);
      modal.close('Close click')
    }
  }
  eliminarCuenta(index:number){
    this.itemsCuenta.splice(index, 1);
  }

  procesarDataCalificacion(data:any,idProveedor:number,idPrestacion:number):ProveedorCalificacionEnvio{
    var arrayCriterio = 
    [
      parseInt(data.id1), 
      parseInt(data.id2), 
      parseInt(data.id3), 
      parseInt(data.id4), 
      parseInt(data.id5)
    ];
    let proveedorCali:ProveedorCalificacionEnvio;
    proveedorCali={
      idProveedor: idProveedor,
      listaIdSubCriterioCalificacion:arrayCriterio,
      idPrestacionRegistro: idPrestacion,
      usuarioModificacion: this.userService.userName
    }
    return proveedorCali
  }
  seleccionTipoPrestacion(e:any)
  {
    this.validTipoPrestacion(e.id)

  }
  validTipoPrestacion(id:any){
    if((/^-?\d+$/.test(id))) this.tipoPrestacion=false;
    else this.tipoPrestacion=true
  }
  mostrarMensajeExitoso(){
    this.loader = false;
    const Toast = Swal.mixin({
      toast: true,
      target: '#content-drawer-component',
      customClass: {
        container: 'position-absolute'
      },
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: false,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    });
    Toast.fire({
      icon: 'success',
      title: 'Guardado con exito'
    })
  }
  procesarDataProveedor(item:any, isNew: boolean):ProveedorEnvio{
    let dataEnvio:ProveedorEnvio={
      id: isNew? 0 : item.id,
      idTipoContribuyente: item.idTipoContribuyente,
      idDocumentoIdentidad: item.idDocumentoIdentidad,
      nroDocumento: item.nroDocumento,
      razonSocial: item.razonSocial=="-"?"":item.razonSocial,
      apePaterno: item.apePaterno=="-"?"":item.apePaterno,
      apeMaterno: item.apeMaterno=="-"?"":item.apeMaterno,
      nombre1: item.nombre1=="-"?"":item.nombre1,
      nombre2: item.nombre2=="-"?"":item.nombre2,
      descripcion: item.descripcion==null?"":item.descripcion,
      direccion: item.direccion==null?"":item.direccion,
      idCiudad: item.idCiudad,
      telefono: item.telefono==null?"":item.telefono,
      email: item.email,
      celular1: item.celular1==null?"":item.celular1,
      celular2: item.celular2==null?"":item.celular2,
      contacto1: item.contacto1==null?"":item.contacto1,
      contacto2: item.contacto2==null?"":item.contacto2,
      alias: item.alias==null?"":item.alias,
      esDocente: item.esDocente==null?false:item.esDocente,
      usuarioModificacion: this.userService.userName,
      idImpuesto: item.idImpuesto,
      idRetencion: item.idRetencion,
      idDetraccion: item.idDetraccion,
      idPersonalAsignado: item.idPersonalAsignado,
      idPrestacionRegistro: item.idPrestacionRegistro,
      listaProveedorTipoServicio: []
    }
    return dataEnvio
  }
  nombreProveedor(data:any):string{
    if( typeof data.nombre2!=='string')
    {
      data.nombre2=""
    }
    let nuevoProveedor:string='('+
      data.nroDocumento.trim()+") "+
      data.razonSocial.trim()+
      data.apePaterno.trim()+" "+
      data.apeMaterno.trim()+" "+
      data.nombre1.trim()+" "+
      data.nombre2.trim()
    return nuevoProveedor
  }
  msgEliminarCuentaBanco(dataItem:any,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar la Cuenta Bancaria del proveedor?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarProveedorCuentaBancaria(dataItem,index);
      }
    });
  }
  msgEliminarProveedor(dataItem:any,index: number): void {
    Swal.fire({
      title: '¿Está seguro de querer eliminar el proveedor y todas sus cuentas?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Eliminalo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarProveedor(dataItem,index);
      }
    });
  }

  //------------Acciones CRUD ProveedorCuentaBancaria--------------------
  eliminarProveedorCuentaBancaria(data:any,index:number){
    if(data.id==0)
    {
      this.itemsCuenta.splice(index, 1);
      Swal.fire(
        '¡Eliminado!',
        'El registro ha sido eliminado.',
        'success'
      );
    }
    else{
    this.loaderModalProveedor = true;
    let params: Parametro[] = [
      { clave: 'id', valor: data.id },
      { clave: 'usuario', valor: this.userService.userName },
    ];
    this.integraService
      .eliminarPorPathParams(constApi.ProveedorEliminarCuentaBanco, params)
      .subscribe({
        next: (response: HttpResponse<boolean>) => {
          if ((response.body == true)) {
            this.loaderModalProveedor = false;
            this.itemsCuenta.splice(index, 1);
            Swal.fire(
              '¡Eliminado!',
              'El registro ha sido eliminado.',
              'success'
            );
          } else {
            Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
          }
        },
        error: (error) => {
          this.loaderModalProveedor = false;
          this.mostrarMensajeError(error);
          console.log(error)
        },
        complete: () => { },
      });
    }
  }
  

 //------------------------- Acciones CRUD Calificacion ----------------------------------------------------------------
  insertarCalificacion(modal:any)
  {
    if(this.validFormCalificacion())
    {
      this.loaderModalCalificacion=true;
      let formCalificacion=this.formGroupCalificacion.getRawValue();
      let formProveedor=this.formGroupProveedor.getRawValue();
      let preoveedorCalifEnvio= this.procesarDataCalificacion(formCalificacion,formProveedor.id,formProveedor.idPrestacionRegistro)
      this.integraService
          .insertar(constApi.ProveedorInsertarSubCalificacion, preoveedorCalifEnvio)
          .subscribe({
            next: (response: HttpResponse<any>) => {
            },
            error: (error) => {
              this.mostrarMensajeError(error);
            },
            complete: () => {
              this.loaderModalCalificacion = false;
              modal.close('Close click')
              this.mostrarMensajeExitoso();
  
            },
        }); 
    } 
  }
  //------------------------- Acciones CRUD Proeveedor ----------------------------------------------------------------
 insertarProveedor(){
  if(this.validFormProveedor())
  {
    this.loaderModalProveedor = true;
    let formProveedor=this.formGroupProveedor.getRawValue();
    let proveedor=this.procesarDataProveedor(formProveedor,true)
    if(this.itemsCuenta.length!==0)
    {this.itemsCuenta.length!
      this.itemsCuenta.forEach(e => {
        e.idProveedor=proveedor.id 
        e.usuarioModificacion=this.userService.userName
      });
    }
    let nuevoProveedor = this.nombreProveedor(proveedor)
    let dataEnvio={
      listaCuentaBanco:this.itemsCuenta,
      proveedor:proveedor
    }
    console.log(nuevoProveedor,dataEnvio)

    this.integraService
        .insertar(constApi.ProveedorNuevo, dataEnvio)
        .subscribe({
          next: (response: HttpResponse<any>) => {
            this.loaderModalProveedor = false;
            let dataCombo = {
              id:response.body,
              nombre:nuevoProveedor,
              ruc:'0000'
            }
            console.log(dataCombo)
            this.ListaProveedorCombo.push(dataCombo)
            console.log(this.ListaProveedorCombo)
            
          },
          error: (error) => {
            this.loaderModalProveedor = false;
            this.mostrarMensajeError(error);
          },
          complete: () => {
            this.loaderModalProveedor = false;
            this.modalService.dismissAll(this.modalProveedor);
            this.mostrarMensajeExitoso();

          },
      });
  }
 }
 editarProveedor(){
  if(this.validFormProveedor())
  {
    this.loaderModalProveedor = true;
    let formProveedor=this.formGroupProveedor.getRawValue();
    let proveedor=this.procesarDataProveedor(formProveedor,false)
    if(this.itemsCuenta.length!==0)
    {
      this.itemsCuenta.forEach(e => {
        e.idProveedor=proveedor.id 
        e.usuarioModificacion=this.userService.userName
      });
    }
    let nuevoProveedor = this.nombreProveedor(proveedor)
    const indexCombo = this.itemsProveedorCombo.findIndex((e) => e.id === proveedor.id)
    const index = this.ListaProveedorCombo.findIndex((e) => e.id === proveedor.id)
    let dataEnvio={
      listaCuentaBanco:this.itemsCuenta,
      proveedor:proveedor
    }
    console.log(nuevoProveedor)
    console.log(dataEnvio)
    this.integraService
          .actualizar(constApi.ProveedorEditar, dataEnvio)
          .subscribe({
            next: (response: HttpResponse<any>) => {
              this.loaderModalProveedor = false;

              // Actualizar nombres en los combos sin perder la selección
              this.itemsProveedorCombo[indexCombo].nombre=nuevoProveedor;
              this.ListaProveedorCombo[index].nombre=nuevoProveedor;

              // Refrescar la grilla manteniendo el filtro actual
              this.ObtenerDatosGrillaProveedor(proveedor.id);
            },
            error: (error) => {
              this.loaderModalProveedor = false;

              this.mostrarMensajeError(error);
              console.log(error)
            },
            complete: () => {
              this.loaderModalProveedor = false;
              this.modalService.dismissAll(this.modalProveedor);
              this.mostrarMensajeExitoso();

            },
        }); 
    
  }
 }

 eliminarProveedor(dataItem: any, index: number){
  this.loader = true;
  let params: Parametro[] = [
    { clave: 'id', valor: dataItem.id },
    { clave: 'usuario', valor: this.userService.userName},
  ];
  const indexCombo = this.itemsProveedorCombo.findIndex((e) => e.id === dataItem.id)
  const indexLista= this.ListaProveedorCombo.findIndex((e) => e.id === dataItem.id)
  this.integraService
    .eliminarPorPathParams(constApi.ProveedorEliminar, params)
    .subscribe({
      next: (response: HttpResponse<boolean>) => {
        if ((response.body == true)) {
          this.ListaProveedorCombo.splice(indexLista, 1);
          this.itemsProveedorCombo.splice(indexCombo, 1);
          this.proveedorBuscar.reset();
          this.itemsProveedor=[];
          this.loader = false;
          Swal.fire(
            '¡Eliminado!',
            'El registro ha sido eliminado.',
            'success'
          );
        } else {
          Swal.fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
        }
      },
      error: (error) => {
        this.loader = false;
        this.mostrarMensajeError(error);
      },
      complete: () => {this.loader = false; },
    });
 }
  
  //------------------------- Finc Acciones CRUD Proeveedor ----------------------------------------------------------------
  //--------Grid Control -------------------
  gridEventsResponse(e: any): void {
    switch (e.action) {
      case 'edit':
        console.log(e.dataItem);
        this.nuevo=true;
        this.validTipoPrestacion(e.dataItem.idPrestacionRegistro)
        this.ObtenerCuentasProveedor(e.dataItem.id)
        this.llenarCombosPorPais(e.dataItem.idPais)

        this.Modal(e.dataItem.idTipoContribuyente,false,e.dataItem);
        break;
      case 'remove':
        console.log(e);
        this.msgEliminarProveedor(e.dataItem,e.rowIndex)
        break;
    }
  }
  gridEventsResponseCuenta(e: any): void {
    switch (e.action) {
      case 'remove':
        console.log(e);
        this.msgEliminarCuentaBanco(e.dataItem,e.rowIndex)
        break;
      case 'edit':
        this.openModalBancaria(e.dataItem)
        break;
    }
  }

  //------------------------- Conversión Tipo Contribuyente ----------------------------------------------------------------

  /**
   * Verifica si el proveedor actual puede cambiar de tipo de contribuyente
   * Solo se permite:
   * - Persona Natural (1) -> Persona Jurídica (2)
   * - Persona Jurídica (2) -> Persona Natural (1)
   * - Persona No Domiciliada (3) -> Persona Natural (1)
   */
  puedeConvertirTipo(): boolean {
    const idTipo = this.formGroupProveedor.get('idTipoContribuyente')?.value;
    return idTipo === 1 || idTipo === 2 || idTipo === 3;
  }

  /**
   * Abre el modal para seleccionar el nuevo tipo de contribuyente
   */
  abrirModalCambioTipo(): void {
    const idTipo = this.formGroupProveedor.get('idTipoContribuyente')?.value;
    this.tipoContribuyenteActualId = idTipo;
    this.tipoContribuyenteActual = this.formGroupProveedor.get('tipoContribuyente')?.value;

    // Guardar datos originales del proveedor
    this.proveedorOriginal = this.formGroupProveedor.getRawValue();

    // Definir opciones disponibles según el tipo actual
    this.opcionesCambioTipo = [];

    switch (idTipo) {
      case 1: // Persona Natural -> puede ir a Jurídica o No Domiciliada
        this.opcionesCambioTipo = [
          { id: 2, nombre: 'Persona Jurídica' },
          { id: 3, nombre: 'Persona No Domiciliada' }
        ];
        break;
      case 2: // Persona Jurídica -> puede ir a Natural o No Domiciliada
        this.opcionesCambioTipo = [
          { id: 1, nombre: 'Persona Natural' },
          { id: 3, nombre: 'Persona No Domiciliada' }
        ];
        break;
      case 3: // Persona No Domiciliada -> puede ir a Natural
        this.opcionesCambioTipo = [
          { id: 1, nombre: 'Persona Natural' }
        ];
        break;
    }

    this.modalRefSeleccionTipo = this.modalService.open(this.modalSeleccionTipo, { centered: true });
  }

  /**
   * Procesa la selección del nuevo tipo y abre el modal de conversión
   */
  seleccionarNuevoTipo(opcion: any, modal: any): void {
    modal.close();

    this.nuevoTipoContribuyenteId = opcion.id;
    this.nuevoTipoContribuyenteNombre = opcion.nombre;
    this.conversionANatural = (opcion.id === 1);
    this.conversionANoDomiciliada = (opcion.id === 3);

    // Preparar documentos de identidad según el nuevo tipo
    this.prepararDocumentosConversion(opcion.id);

    // Preparar el formulario de conversión con los datos existentes
    this.prepararFormConversion();

    // Abrir modal de conversión
    this.modalRefConversion = this.modalService.open(this.modalConversion, { size: 'lg' });
  }

  /**
   * Prepara los tipos de documento disponibles para el nuevo tipo de contribuyente
   */
  prepararDocumentosConversion(idTipo: number): void {
    this.itemsDocIdentidadConversion = [];
    switch (idTipo) {
      case 1: // Persona Natural
        this.ListaDocIdentidad.forEach(e => {
          if (e.id === 1 || e.id === 6)
            this.itemsDocIdentidadConversion.push(e);
        });
        break;
      case 2: // Persona Jurídica
        this.ListaDocIdentidad.forEach(e => {
          if (e.id === 6)
            this.itemsDocIdentidadConversion.push(e);
        });
        break;
      case 3: // Persona No Domiciliada
        this.ListaDocIdentidad.forEach(e => {
          if (e.id === 0 || e.id === 4 || e.id === 7)
            this.itemsDocIdentidadConversion.push(e);
        });
        break;
    }
  }

  /**
   * Prepara el formulario de conversión con los datos actuales del proveedor
   */
  prepararFormConversion(): void {
    this.formGroupConversion.reset();

    const datos = this.proveedorOriginal;

    // Copiar campos comunes
    this.formGroupConversion.patchValue({
      id: datos.id,
      idTipoContribuyente: this.nuevoTipoContribuyenteId,
      nroDocumento: datos.nroDocumento,
      direccion: datos.direccion,
      email: datos.email,
      telefono: datos.telefono,
      idPais: datos.idPais,
      idCiudad: datos.idCiudad,
    });

    // Si convierte a Natural, intentar llenar campos de nombre
    if (this.conversionANatural) {
      // Si viene de Jurídica o No Domiciliada, la razón social podría usarse como referencia
      // Los campos de nombre quedan vacíos para que el usuario los complete
      this.formGroupConversion.patchValue({
        apePaterno: '',
        apeMaterno: '',
        nombre1: '',
        nombre2: '',
      });

      // Agregar validadores requeridos para persona natural
      this.formGroupConversion.get('apePaterno')?.setValidators([Validators.required, TextValidator.noStartSpace, TextValidator.noEndSpace]);
      this.formGroupConversion.get('apeMaterno')?.setValidators([Validators.required, TextValidator.noStartSpace, TextValidator.noEndSpace]);
      this.formGroupConversion.get('nombre1')?.setValidators([Validators.required, TextValidator.noStartSpace, TextValidator.noEndSpace]);
      this.formGroupConversion.get('razonSocial')?.clearValidators();
    } else if (this.conversionANoDomiciliada) {
      // Si convierte a No Domiciliada, intentar llenar razón social con nombres o razón social existente
      let razonSocial = '';
      if (datos.razonSocial && datos.razonSocial !== '-') {
        razonSocial = datos.razonSocial;
      } else if (datos.apePaterno && datos.apePaterno !== '-') {
        razonSocial = `${datos.apePaterno} ${datos.apeMaterno || ''} ${datos.nombre1 || ''} ${datos.nombre2 || ''}`.trim();
      }
      this.formGroupConversion.patchValue({
        razonSocial: razonSocial,
      });

      // Agregar validador requerido para razón social
      this.formGroupConversion.get('razonSocial')?.setValidators([Validators.required, TextValidator.noStartSpace, TextValidator.noEndSpace]);
      this.formGroupConversion.get('apePaterno')?.clearValidators();
      this.formGroupConversion.get('apeMaterno')?.clearValidators();
      this.formGroupConversion.get('nombre1')?.clearValidators();
    } else {
      // Si convierte a Jurídica, intentar llenar razón social con nombres
      let razonSocial = '';
      if (datos.apePaterno && datos.apePaterno !== '-') {
        razonSocial = `${datos.apePaterno} ${datos.apeMaterno || ''} ${datos.nombre1 || ''} ${datos.nombre2 || ''}`.trim();
      }
      this.formGroupConversion.patchValue({
        razonSocial: razonSocial,
      });

      // Agregar validador requerido para razón social
      this.formGroupConversion.get('razonSocial')?.setValidators([Validators.required, TextValidator.noStartSpace, TextValidator.noEndSpace]);
      this.formGroupConversion.get('apePaterno')?.clearValidators();
      this.formGroupConversion.get('apeMaterno')?.clearValidators();
      this.formGroupConversion.get('nombre1')?.clearValidators();
    }

    // Actualizar validadores
    this.formGroupConversion.get('apePaterno')?.updateValueAndValidity();
    this.formGroupConversion.get('apeMaterno')?.updateValueAndValidity();
    this.formGroupConversion.get('nombre1')?.updateValueAndValidity();
    this.formGroupConversion.get('razonSocial')?.updateValueAndValidity();
  }

  /**
   * Valida el formulario de conversión
   */
  validFormConversion(): boolean {
    if (this.formGroupConversion.invalid) {
      this.formGroupConversion.markAllAsTouched();
      return false;
    }
    return true;
  }

  /**
   * Ejecuta la conversión del tipo de contribuyente
   */
  ejecutarConversion(modal: any): void {
    if (!this.validFormConversion()) {
      return;
    }

    Swal.fire({
      title: '¿Está seguro de cambiar el tipo de contribuyente?',
      text: `El proveedor pasará de "${this.tipoContribuyenteActual}" a "${this.nuevoTipoContribuyenteNombre}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, convertir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesarConversion(modal);
      }
    });
  }

  /**
   * Procesa la conversión y actualiza el proveedor
   */
  procesarConversion(modal: any): void {
    this.loaderModalConversion = true;

    const formConversion = this.formGroupConversion.getRawValue();

    // Preparar datos para envío
    let proveedor: ProveedorEnvio = {
      id: formConversion.id,
      idTipoContribuyente: this.nuevoTipoContribuyenteId,
      idDocumentoIdentidad: formConversion.idDocumentoIdentidad,
      nroDocumento: formConversion.nroDocumento,
      razonSocial: this.conversionANatural ? '' : formConversion.razonSocial,
      apePaterno: this.conversionANatural ? formConversion.apePaterno : '',
      apeMaterno: this.conversionANatural ? formConversion.apeMaterno : '',
      nombre1: this.conversionANatural ? formConversion.nombre1 : '',
      nombre2: this.conversionANatural ? (formConversion.nombre2 || '') : '',
      descripcion: this.proveedorOriginal.descripcion || '',
      direccion: formConversion.direccion || '',
      idCiudad: this.proveedorOriginal.idCiudad,
      telefono: formConversion.telefono || '',
      email: formConversion.email,
      celular1: this.proveedorOriginal.celular1 || '',
      celular2: this.proveedorOriginal.celular2 || '',
      contacto1: this.proveedorOriginal.contacto1 || '',
      contacto2: this.proveedorOriginal.contacto2 || '',
      alias: this.proveedorOriginal.alias || '',
      esDocente: this.proveedorOriginal.esDocente || false,
      usuarioModificacion: this.userService.userName,
      idImpuesto: this.proveedorOriginal.idImpuesto,
      idRetencion: this.proveedorOriginal.idRetencion,
      idDetraccion: this.proveedorOriginal.idDetraccion,
      idPersonalAsignado: this.proveedorOriginal.idPersonalAsignado,
      idPrestacionRegistro: this.proveedorOriginal.idPrestacionRegistro,
      listaProveedorTipoServicio: []
    };

    // Asignar usuarioModificacion a cada cuenta bancaria
    if (this.itemsCuenta.length > 0) {
      this.itemsCuenta.forEach(cuenta => {
        cuenta.idProveedor = proveedor.id;
        cuenta.usuarioModificacion = this.userService.userName;
      });
    }

    let dataEnvio = {
      listaCuentaBanco: this.itemsCuenta,
      proveedor: proveedor
    };

    this.integraService
      .actualizar(constApi.ProveedorEditar, dataEnvio)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.loaderModalConversion = false;

          // Cerrar modales
          modal.close();
          this.modalRefProveedor.close();

          // Refrescar la grilla
          this.ObtenerDatosGrillaProveedor(proveedor.id);

          // Actualizar combo de proveedores
          const nuevoNombre = this.nombreProveedor(proveedor);
          const indexCombo = this.itemsProveedorCombo.findIndex((e) => e.id === proveedor.id);
          const indexLista = this.ListaProveedorCombo.findIndex((e) => e.id === proveedor.id);

          if (indexCombo >= 0) this.itemsProveedorCombo[indexCombo].nombre = nuevoNombre;
          if (indexLista >= 0) this.ListaProveedorCombo[indexLista].nombre = nuevoNombre;
        },
        error: (error) => {
          this.loaderModalConversion = false;
          this.mostrarMensajeError(error);
        },
        complete: () => {
          this.loaderModalConversion = false;
          this.mostrarMensajeExitoso();
        },
      });
  }
}



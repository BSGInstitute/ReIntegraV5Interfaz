import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IntegraService } from '@shared/services/integra.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertaService } from '@shared/services/alerta.service';
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { constApi, constApiComercial, constApiFinanzas, constApiGlobal } from './../../../../../../environments/constApi';
import { HttpResponse } from '@angular/common/http';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { datePipeTransform } from '@shared/functions/date-pipe';
import { AddEvent, CellClickEvent, CellCloseEvent } from '@progress/kendo-angular-grid';
import { EMPTY } from 'rxjs';
import { UserService } from '@shared/services/user.service';

@Component({
  selector: 'app-cronograma-pago',
  templateUrl: './cronograma-pago.component.html',
  styleUrls: ['./cronograma-pago.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CronogramaPagoComponent implements OnInit {
  filtrarMoneda: boolean=true;
  paisMatricula: number;
  codigoDepartamento: number;
  codigoCiudad: number;
  customers: any[] = [];
  montoTipoCambioPesoColombiano: number;
  dialogRef: any;
  idCronogramaPagoDetalleFinal: number;
  nombreCentroCosto: string;

  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private alertService:AlertaService,
    public finanzasService:FinanzasServiceService,
    public userService:UserService
  ) {}

  @ViewChild('modalTasaAcademica') modalTasaAcademica: any;
  @ViewChild('modalEliminar') modalEliminar: any;
  @ViewChild('modalDocumentos') modalDocumentos: any;
  @ViewChild('modalPagarCuota') modalPagarCuota: any;
  @ViewChild('modalConsiderarMora') modalConsiderarMora: any;
  @ViewChild('modalGuardarCronograma') modalGuardarCronograma: any;
  @ViewChild('modalCrearFactSiigo') modalCrearFactSiigo: any;
  @ViewChild('modalCrearFacturaFacturama') modalCrearFacturaFacturama: any;


  usuario = JSON.parse(localStorage.getItem('userData'))

  tipoEliminacion=new FormControl(3,Validators.required)
  inputCuota=new FormControl(null,Validators.required)
  inputMontoPasar=new FormControl(null,Validators.required)

  inputSolicitante=new FormControl(null,Validators.required)
  inputAprobado=new FormControl(null,Validators.required)
  inputObservacion=new FormControl("")

  fun1=true;
  fun2=true;
  fun3=true;
  flagSinAprobar=false;

  public virtual: any = {
    itemHeight: 50,
  };

  idVendedor: number = 35943;

  dataTipoCliente: any[] = [
    {id: "Customer", nombre: "Cliente"}
  ]

  dataTipoPersona: any[] = [
    {id: "Person", nombre: "Persona"}
  ]

  dataTipoIdentificacion: any[] = [
    {id: "13", nombre: "Cédula"}
  ]

  dataPais: any[] = [
    {id: "CO", nombre: "Colombia"}
  ]

  dataDepartamentos: any[];
  dataCiudades: any[];

  dataTipoDocumento: any[] = [
    {id: 77639, nombre: "Factura electrónica de venta"}
  ]

  dataMedioPago: any[] = [
    {id: 10859, nombre: "Ventas clientes Openpay colombia"},
    {id: 10849, nombre: "Ventas clientes Payu"},
    {id: 10840, nombre: "Clientes Bancolombia"},
  ]
  listaMetodoPagoFacturama: any[] = [
    {clave: 'PPD', nombre: "PPD - Pago en parcialidades ó diferido"},
    {clave: 'PUE', nombre: "PUE - Pago en una sola exhibición"},

  ]
  listaExpedicion: any[] = [
    {clave: '01000', nombre: " Principal (01000)"},
  ]
  listaTipoCfdiType: any[] = [
    {clave: 'I', nombre: "Ingreso"},
  ]

  listaPrueba:any
  listaTasas:any[]=[]
  listaMatricula:any[]=[]
  listaConceptoTasa:any[]=[]
  listaResponsable:any[]=[]
  listaPrograma:any[]=[]
  listaAlumno:any[]=[]
  listaEstado:any[]=[]
  listaEstadoEliminacion:any[]
  listaPeriodo:any[]=[]
  listaAsesor:any[]=[]
  itemsAsesor:any[]=[]
  listaCordinador:any[]=[]
  itemsCordinador:any[]=[]
  listaBeneficios:any[]=[]
  listaFiltroPrograma:any[]=[]
  listaCronogramaOriginal:any[]=[]
  listaCronogramaActual:any[]=[]
  listaCronogramaEditable:any[]=[]
  listacambiosorden:any[]=[]
  listaDocumento:any[]=[]
  listaDocAlumno:any[]=[]
  listaSeleccionDoc:any[]=[]
  listaDocTemp:any[]=[]
  listaMoneda:any[]=[]
  listaMonedaTem:any[]=[]
  listaFormaPago:any[]=[]
  listaCuenta:any[]=[]
  listaDocumentoPago:any[]=[]
  listaSolicitante:any[]=[]
  itemSolicitante:any[]=[]
  listaNoPagados:any[]=[]
  listaCambiosCronograma:any[]=[]
  listaFacturmaRegimenFiscal : any [] =[]
  listaFacturmaUsoCfdi : any [] =[]
  listaFacturamaFormaPago: any []=[]

  listaVersion:any[]=
  [
    { text: "Versión Básica", value: 1 },
    { text: "Versión Profesional", value: 2 },
    { text: "Versión Gerencial", value: 3 },
    { text: "Sin versión", value: 4 },
    { text: "Sin versión", value: 5 },
  ]

  createdItems:any

  maxlength:number = 1000;
  charachtersCount:number=0;
  counter:string;

  nombreModalTasa=""
  btnModalTasa=""
  valorReal=0
  cronogramaActual:any

  loaderTasas=false
  loaderMatriculaFiltro=false
  loaderGeneral=false
  loaderModalTasa=false
  loaderModalEliminar=false
  loaderDocumento=false
  loaderBuscarDoc=false
  loaderModalPago=false
  loaderCronogramaActual=false
  loaderCronogramaEditable=false
  loaderCrearFactSiigo: boolean =false
  loaderCrearFacturaFacturama:Boolean = false

  sombra=true
  isMonedaDolaroSoles=false

  codigoMatriculaTemp=""
  cuotaTemp:any
  cuotaMoraTemp={
    id:0,
    codigoMatricula:"string",
    nroCuota:0,
    nroSubCuota:0,
    cuota:0,
    mora:0,
    version:0,
    montoAdelanto:0,
  }
  columTemp:any
  columTempEditable:any
  valorAnteriorEditable:any
  PagoMaximoSolesDolares=0
  montoPasar=0
  montoPasarMax=0

  formPago = this.formBuilder.group({
    nroCuota:null,
    nroSubCuota:null,
    monto:[null,Validators.required],
    tipoCambio:[null,Validators.required],
    idMoneda:[null,Validators.required],
    idformaPago:[null,Validators.required],
    idDocumneto:[null,Validators.required],
    nroCheque:[null,Validators.required],
    idCuenta:[null,Validators.required],
    fechaPago:[new Date(),Validators.required]
  })

  formTasaAcademica = this.formBuilder.group({
    idConcepto:[null,Validators.required],
    monto:[null,Validators.required],
    moneda:[null,Validators.required],
    fechaPago:[null,Validators.required],
  })

  formMatricula = this.formBuilder.group({
    codigoMat: null,
    alumno:null,
    idPrograma:null
  })

  formDatosMatricula = this.formBuilder.group({
    id: null,
    idPEspecifico: null,
    moneda: null,
    tipoCambio: null,
    totalAPagar: null,
    nroCuotas: null,
    estadoMatricula: null,
    periodo: null,
    programa: null,
    paquete: null,
    titulo: null,
    observaciones: null,
    empresaPagaForm: false,
    empresaNombre: null,
    idCoordinador: null,
    idAsesor:null,
    nuevaPrograma:null,
  })

  formCrearFacturaFacturama = this.formBuilder.group({
    // Datos generales
    CfdiType: ['I', Validators.required],
    PaymentForm: ['', Validators.required],
    PaymentMethod: ['', Validators.required],
    ExpeditionPlace: ['', Validators.required],

    // GlobalInformation
    // Periodicity: ['', Validators.required],
    // Months: ['', Validators.required],
    // Year: ['', Validators.required],

    // Receptor (Receiver)
    ReceiverName: ['', Validators.required],
    ReceiverRfc: ['', Validators.required],  // RFC del receptor de la factura
    Email: ['', [Validators.required, Validators.email]],
    CfdiUse: ['', Validators.required],
    FiscalRegime: ['', Validators.required],
    TaxZipCode: ['', Validators.required],

    // Dirección del cliente (Client Address)
    Street: ['', Validators.required],
    ExteriorNumber: ['', Validators.required],
    InteriorNumber: [''],
    Neighborhood: ['', Validators.required],
    Municipality: ['', Validators.required],
    State: ['', Validators.required],
    Country: ['MEX', Validators.required],
    ZipCode: ['', Validators.required],

    // RFC del cliente (en caso de ser distinto al RFC del receptor)
    clientRfc: ['', Validators.required], // Campo adicional para diferenciar RFC del cliente y del receptor

    // Detalle del producto (Items)
    ProductCode: ['', Validators.required],
    Description: ['', Validators.required],
    UnitCode: ['', Validators.required],
    Quantity: [1, Validators.required],
    UnitPrice: [0, Validators.required],
    Subtotal: [0, Validators.required],
    TaxObject: ['01', Validators.required],

    // Impuestos (Taxes)
    // TaxName: ['', Validators.required],
    // Base: [0, Validators.required],
    // Rate: [0, Validators.required],
    // IsRetention: [false],
    taxTotal: [0, Validators.required],

    // Total del producto
    ItemTotal: [0, Validators.required],
  });



formCrearClienteFacturama = this.formBuilder.group({
    rfc: ['', Validators.required],
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    fiscalRegime: ['616', Validators.required],
    cfdiUse: ['G03', Validators.required],
    address: this.formBuilder.group({
      street: ['', Validators.required],
      exteriorNumber: ['', Validators.required],
      interiorNumber: [''],
      neighborhood: ['', Validators.required],
      zipCode: ['', Validators.required],
      municipality: ['', Validators.required],
      state: ['', Validators.required],
      country: ['MEX']
    })
  });


  formCrearFactSiigo = this.formBuilder.group({
    tipoCliente:[null,Validators.required],
    tipoPersona:[null,Validators.required],
    tipoIdentificacion:[null,Validators.required],
    nroIdentificacion:[null, [Validators.required, Validators.maxLength(10)]],
    nombresAlumno:[null,Validators.required],
    apellidosAlumno:[null,Validators.required],
    direccionAlumno:[null,Validators.required],
    pais:[null,Validators.required],
    departamento:[null,Validators.required],
    ciudad:[null,Validators.required],
    indicativoTelefono:[null,Validators.required],
    numeroTelefono:[null,Validators.required],
    extensionTelefono:[null],
    responsabilidadFiscal:[null,Validators.required],
    nombresContacto:[null,Validators.required],
    apellidosContacto:[null,Validators.required],
    correoContacto:[null,Validators.required],
    tipoDocumento:[null,Validators.required],
    medioPago:[null,Validators.required],
    fechaDocumento:[new Date(),Validators.required],
    fechaVencimiento:[new Date(),Validators.required],
    valorTotal:[null,Validators.required],
    observaciones:[null,Validators.required],
    codigoItem:[null,Validators.required],
    descripcionItem:[null,Validators.required],
    cantidadItem:[null,Validators.required],
    precioItem:[null,Validators.required]
  })

  ngOnInit(): void {
    this.ObtenerTodoPersonal()
    this.TextBeneficioCounter("")
    this.ObtenerTodoEstadoMatricula()
    this.ObtenerComboPeriodo()
    this.ObtenerAsesorPorApellidosAutocomplete()
    this.ObtenerCoordinadorAutcomplete()
    this.ObtenerComboMoneda()
    this.ObtenerDatosPago()
    this.ReplicarValorTotalPrecio()

    this.formCrearFacturaFacturama.get('Quantity')?.valueChanges.subscribe(() => {
      this.calcularTotales();
    });

    this.formCrearFacturaFacturama.get('UnitPrice')?.valueChanges.subscribe(() => {
      this.calcularTotales();
    });
  }

  modalRefCrearFactSiigo: any;
  modalRefCrearFactFacturma: any;


  // Funciones Template ---------------------------------------------------------------------------------
  formaPagoTemplate(idFormaPago:any)
  {
    if(typeof idFormaPago=="number")
    {
      return this.listaFormaPago.find((e:any)=>e.id==idFormaPago).descripcion
    }
    else return idFormaPago
  }

  ObtenerListaDepartamentos(){
    this.integraService.getJsonResponse(constApiFinanzas.ObtenerDepartamentoPaiCombo)
      .subscribe({
        next: (resp: HttpResponse<any[]>) => {
          this.dataDepartamentos = resp.body;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ObtenerListaCiudades(){
    this.integraService.getJsonResponse(constApiFinanzas.ObtenerCiudadesDepartamentoPaiCombo)
      .subscribe({
        next: (resp: HttpResponse<any[]>) => {
          this.dataCiudades = resp.body;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  FiltraCiudadesPorPais(idDepartamentoPais: number) {
    this.dataCiudades = [];
    this.formCrearFactSiigo.get('ciudad')?.reset();
    if (!!idDepartamentoPais) {
      this.integraService.getJsonResponse(constApiFinanzas.ObtenerCiudadesDepartamentoPaiObtenerPorId + '/'+ idDepartamentoPais)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.dataCiudades = response.body;
        },
        error: error => {
          this.mostrarMensajeError(error);
        },
        complete: () => {}
      });
    }
    else{
      this.ObtenerListaCiudades();
    }
    this.ObtenerCodigoPais(idDepartamentoPais);
  }

  ObtenerCodigoPais(id: number){
    if (!!id) {
      this.integraService.getJsonResponse(constApiFinanzas.ObtenerCodigoDepartamentoPaiPorId + '/'+ id)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.codigoDepartamento = response.body.codigo;
        },
        error: error => {
          this.mostrarMensajeError(error);
        },
        complete: () => {}
      });
    }
  }

  ObtenerCodigoCiudad(id: number){
    if (!!id) {
      this.integraService.getJsonResponse(constApiFinanzas.ObtenerCodigoCiudadDepartamentoPaiPorId + '/'+ id)
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.codigoCiudad = response.body.codigo;
        },
        error: error => {
          this.mostrarMensajeError(error);
        },
        complete: () => {}
      });
    }
  }

  //------------------------------------------------------------------------------------------------------
  // Funciones para la optencion de datos ------------------------------------------------------------------
  ObtenerComboMoneda(){// Obtiene datos para el combo Moneda
    this.integraService
      .getJsonResponse(
        `${constApi.MonedaObtenerCombo}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaMonedaTem=response.body
          this.listaMoneda=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"MODAL - COMBO MONEDA")
        },
        complete: () => {},
      });
  }

  ObtenerDatosPago(){// Obtiene los combos de FormaPago,Documento,Cuenta para los pagos
    this.integraService
      .postJsonResponse(
        `${constApiFinanzas.ObtenerDatosPago}`,null
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaFormaPago=response.body.listaFormaPago
          this.listaCuenta=response.body.listadoCuentasCorrientesFinal
          this.listaDocumentoPago=response.body.listaDocumentoPago
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"MODAL - Combo datos pagos")
        },
        complete: () => {},
      });
  }

  ObtenerTodoPersonal(){// Obtiene todo el personal
    this.integraService
    .getJsonResponse(
      `${constApiFinanzas.ObtenerTodoPersonal}`
    )
    .subscribe({
      next: (response: HttpResponse<any>) => {
        this.itemSolicitante = response.body
        this.listaSolicitante = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"MODAL - COMBO solicitante personal")
      },
      complete: () => {},
    });
  }

  ObtenerMatriculaAutoComplete(alumno:string){//matricula Autocomplete
    this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerCodigoMatricula,
      {valor: alumno}
    )
    .subscribe({
      next: (response) => {
        this.listaMatricula = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - matricula")
      },
      complete: () => {},
    });
  }

  ObtenerConceptoTasa(concepto:string){//matricula Autocomplete
    this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerDetalleTasasAcademicas,
      {valor: concepto}
    )
    .subscribe({
      next: (response) => {
        this.listaConceptoTasa = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - Concepto tasa")
      },
      complete: () => {},
    });
  }

  ObtenerResponsable(apellido:string){//matricula Autocomplete
    this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerPersonalAprobadoPorApellido,
      {valor: apellido}
    )
    .subscribe({
      next: (response) => {
        this.listaResponsable = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - Concepto tasa")
      },
      complete: () => {},
    });
  }

  ObtenerProgramaAutoComplete(programa:string){//programa Autocomplete
    this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerPEspecificoPorCentroCosto,
      {filtro: programa}
    )
    .subscribe({
      next: (response) => {
        this.listaFiltroPrograma = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - programa")
      },
      complete: () => {},
    });
  }

  ObtenerAlumnoAutoComplete(alumno:string){//matricula Autocomplete
    this.integraService
    .postJsonResponse(constApiFinanzas.ObtenerAlumnoPorValor,
      {valor: alumno,}
    )
    .subscribe({
      next: (response) => {
        this.listaAlumno = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"autocomplete - alumno")
      },
      complete: () => {},
    });
  }

  ObtenerAlumnoProgramaPorMatricula(codMat:string){//Obtiene datos por matricula
    this.formMatricula.get('alumno').reset()
    this.formMatricula.get('idPrograma').reset()
    this.loaderMatriculaFiltro=true
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerAlumnoProgramaEspecifico+"/"+codMat)
    .subscribe({
      next: (response: HttpResponse<any[]>)=> {
        if(response.body.length>0)
        {
          this.listaPrograma=[]
          this.formMatricula.get('idPrograma').setValue(response.body[0].idPEspecifico)
          this.listaAlumno=[]
          this.listaAlumno.push({id:-1,nombreCompleto:response.body[0].nombreCompleto})
          this.formMatricula.get('alumno').setValue(-1)


        }
        this.listaPrograma=response.body
        this.ObtenerTipoCambioDolarPesoColombiano(this.listaPrograma[0].fechaMatricula);
        this.nombreCentroCosto = this.listaPrograma[0].nombreCentroCosto;
        this.loaderMatriculaFiltro=false
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"obtener Programa - alumno")
        this.loaderMatriculaFiltro=false
      },
      complete: () => {},
    });
  }

  ObtenerCodigoMatriculaPEspecificoPorAlumnos(idAlumno:number){//Oobtiene datos por id alumno
    this.formMatricula.get('idPrograma').reset()
    this.formMatricula.get('codigoMat').reset()
    this.loaderMatriculaFiltro=true
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerCodigoMatriculaPEspecificoPorAlumnos+"/"+idAlumno)
    .subscribe({
      next: (response: HttpResponse<any[]>)=> {
        if(response.body.length>0)
        {
          this.listaMatricula=[]
          this.listaPrograma=[]
          var i=0
          response.body.forEach((e:any)=>{
            this.listaMatricula.push({id:e.codigoMatricula})
            this.listaPrograma.push({idPEspecifico:i,pEspecifico:e.pEspecifico,codigoMatricula:e.codigoMatricula},)
            i++
          })
          console.log(this.listaPrograma)
        }
        this.loaderMatriculaFiltro=false
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"Programa-código matrícula")
        this.loaderMatriculaFiltro=false
      },
      complete: () => {},
    });
  }

  ObtenerCostosAdministrativosCodigoMatricula(codigoMat:string){//Obtiene las tasas academicas
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerCostosAdministrativosCodigoMatricula+"/"+codigoMat)
    .subscribe({
      next: (response: HttpResponse<any[]>)=> {
        this.fun1=true
        if(this.fun1 && this.fun2 && this.fun3) this.loaderGeneral=false
        this.listaTasas = response.body
      },
      error: (error) => {
        this.fun1=true
        if(this.fun1 && this.fun2 && this.fun3) this.loaderGeneral=false
        this.finanzasService.MensajeDeError(error,"obtener tasas academicas")
      },
      complete: () => {},
    });
  }

  ObtenerDatosMatriculaPorCodigoMatricula(codigoMat:string){//Obtiene lso datos de la matricula
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerDatosMatriculaPorCodigoMatricula+"/"+codigoMat)
    .subscribe({
      next: (response: HttpResponse<any>)=> {
        this.fun2=true
        if(response.body)
        {
          this.codigoMatriculaTemp = response.body.resultado[0].id
          this.sombra=
          response.body.resultado[0].estadoMatricula!='sindevolucion' &&
          response.body.resultado[0].estadoMatricula!='condevolucion'?false:true
          this.itemsAsesor=[]
          this.itemsCordinador=[]
          this.itemsAsesor.push({id:response.body.resultado[0].idAsesor,nombreCompleto:response.body.resultado[0].asesor})
          this.itemsCordinador.push({id:response.body.resultado[0].idCoordinador,nombreCompleto:response.body.resultado[0].coordinador})
          if(this.fun1 && this.fun2 && this.fun3) this.loaderGeneral=false
          this.listaBeneficios = response.body.beneficiosmatricula
          this.formDatosMatricula.patchValue(response.body.resultado[0])
          if(response.body.resultado[0].empresaPaga=="SI") this.formDatosMatricula.get('empresaPagaForm').setValue(true)
          else this.formDatosMatricula.get('empresaPagaForm').setValue(false)
          console.log(this.formDatosMatricula)
        }
        else {
          Swal.fire(
            "!Datos no encontrados¡",
            "No se encontraron datos para esta matricula!",
            "warning"
          )
        }

      },
      error: (error) => {
        this.fun2=true
        if(this.fun1 && this.fun2 && this.fun3) this.loaderGeneral=false
        this.finanzasService.MensajeDeError(error,"obtener tasas academicas")
      },
      complete: () => {},
    });
  }

  ObtenerCronograma(codigoMat:string){//Obtiene las tasas academicas
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerCronograma+"/"+codigoMat)
    .subscribe({
      next: (response: HttpResponse<any>)=> {
        this.listacambiosorden=[]
        this.fun3=true
        if(this.fun1 && this.fun2 && this.fun3) this.loaderGeneral=false
        this.flagSinAprobar=response.body.flagSinAprobar
        this.listaCronogramaOriginal = [].concat(response.body.cronogramaOriginal)
        this.cronogramaActual = JSON.stringify(response.body.cronogramaPagoDetalleFinal)
        this.listaCronogramaActual=JSON.parse(this.cronogramaActual);
        this.listaCronogramaEditable = JSON.parse(this.cronogramaActual);
        this.valorReal=0
        response.body.cronogramaPagoDetalleFinal.forEach((e:any)=>{
          this.valorReal+=e.cuota
          if(e.cancelado==false)
          {
            this.PagoMaximoSolesDolares += (e.mora + e.cuota)
          }
        });
      },
      error: (error) => {
        this.fun3=true
        if(this.fun1 && this.fun2 && this.fun3) this.loaderGeneral=false
        this.finanzasService.MensajeDeError(error,"obtener cronogramas")
      },
      complete: () => {},
    });
  }

  ObtenerPaisMatricula(codigoMatricula: string){
    this.integraService.getJsonResponse(constApiFinanzas.ObtenerPaisMatricula + '/' + codigoMatricula)
    .subscribe({
      next: (response: HttpResponse<any>)=> {
        this.paisMatricula = response.body.idPais
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"obtener país de matricula")
      },
      complete: () => {},
    });
  }

  ObtenerTipoCambioDolarPesoColombiano(fecha: Date){
    this.integraService.getJsonResponse(constApiFinanzas.ObtenerPesosDolaresTipoCambioColombia + '/' + fecha)
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          this.montoTipoCambioPesoColombiano = resp.body.pesosDolares;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  ObtenerTodoEstadoMatricula(){//Obtiene los estados de matricula
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerTodoEstadoMatricula)
    .subscribe({
      next: (response: HttpResponse<any>)=> {
        this.listaEstado=response.body
        this.listaEstadoEliminacion=response.body.filter((e:any)=>e.id== 3 || e.id== 4 )
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"obtener estados de matricula")
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

  ObtenerAsesorPorApellidosAutocomplete(){//asesor Autocomplete
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerAsesorPorApellidos)
    .subscribe({
      next: (response) => {
        this.listaAsesor = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo - asesor")
      },
      complete: () => {},
    });
  }

  ObtenerCoordinadorAutcomplete(){//asesor Autocomplete
    this.integraService
    .getJsonResponse(constApiFinanzas.ObtenerCoordinadorPorApellidos)
    .subscribe({
      next: (response) => {
        this.listaCordinador = response.body
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error,"combo - coordinador")
      },
      complete: () => {},
    });
  }

  ReplicarValorTotalPrecio(){
    this.formCrearFactSiigo.get('valorTotal')?.valueChanges.subscribe(value => {
      const precioItemControl = this.formCrearFactSiigo.get('precioItem');
      if (precioItemControl?.value !== value) {
        precioItemControl?.setValue(value, { emitEvent: false });
      }
    });
    this.formCrearFactSiigo.get('precioItem')?.valueChanges.subscribe(value => {
      const valorTotalControl = this.formCrearFactSiigo.get('valorTotal');
      if (valorTotalControl?.value !== value) {
        valorTotalControl?.setValue(value, { emitEvent: false });
      }
    });
  }


  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ,Grilla editable Cronograma Actual ------------------------------------------------------------------

   cellClickHandler({//click en la celda abrir editor
    sender,
    rowIndex,
    column,
    columnIndex,
    dataItem,
    isEdited,
  }: CellClickEvent): void {
    if (!isEdited && !this.isReadOnly(column.field)) {
      if(dataItem.cancelado==true)
      {
        this.columTemp = column.field
        sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
      }
    }
  }

   cellCloseHandler(args: CellCloseEvent): void {//evento cuando se cierra la celda
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) {
      // hace que la celda no se cierre mientras no sea valido.
      args.preventDefault();
    } else if (formGroup.dirty) {
      let columna=""
      switch (this.columTemp) {
        case 'idFormaPago':columna="Forma de Pago";break;
        case 'fechaPago':columna="Fecha de Pago";break;
        case 'fechaDeposito':columna="Fecha de Deposito";break;
        case 'moraTarifario':columna="Gestión de Cobranza";break;
        default:break;
      }
      Swal.fire({
        title: '¿Está seguro que quieres registar el cambio para '+columna+'?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Continuar!',
      }).then((result) => {
        if (result.isConfirmed)
        {
          this.assignValues(dataItem, formGroup.value);
          this.update(dataItem);
        }
      });

    }
  }
   isReadOnly(field: string): boolean {//fields de solo lectura
    const readOnlyColumns = [
      "cancelado", "nroCuota","nroSubCuota", "tipoCuota",
    "fechaVencimiento", "totalPagar","cuota", "mora",
    "saldo", "moneda"];
    return readOnlyColumns.indexOf(field) > -1;
  }
   createFormGroup(dataItem: any): FormGroup {// form group para las celdas editables
    return this.formBuilder.group({
      idFormaPago: [dataItem.idFormaPago, Validators.required],
      fechaPago: [
        typeof dataItem.fechaPago =="string" &&
        dataItem.fechaPago.length>1
        ? new Date(dataItem.fechaPago):dataItem.fechaPago,
        Validators.required],
      fechaDeposito:
      typeof dataItem.fechaDeposito =="string" &&
      dataItem.fechaDeposito.length>1
      ? new Date(dataItem.fechaDeposito):dataItem.fechaDeposito,
      moraTarifario:[dataItem.moraTarifario],
    });
  }
   assignValues(target: any, source: any): void {//asignar valores modificados
    Object.assign(target, source);
  }
   update(item: any): void {
    switch (this.columTemp) {
      case 'idFormaPago':
        this.guardarFormaPagoCuota(item.id,item.idFormaPago)
        break;
      case 'fechaPago':
        this.guardarFechaPagoCuota(
          item.id,
          datePipeTransform(item.fechaPago,'yyyy-MM-ddTHH:mm:ss','en-US')
          )
        break;
      case 'fechaDeposito':
        this.guardarFechaDepositoCuota(
          item.id,
          datePipeTransform(item.fechaDeposito,'yyyy-MM-ddTHH:mm:ss','en-US')
          )
        break;
      case 'moraTarifario':
        this.guardarGestionDeCobranza(item.id,item.moraTarifario)
        break;
      default:
        break;
    }
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ,Grilla editable Cronograma Actual ------------------------------------------------------------------

  cellClickHandlerEditable({//click en la celda abrir editor
    sender,
    rowIndex,
    column,
    columnIndex,
    dataItem,
    isEdited,
  }: CellClickEvent): void {
    if (!isEdited && !this.isReadOnlyEditable(column.field)) {
      if(dataItem.cancelado==false)
      {
        const fechaVencimiento = typeof dataItem.fechaVencimiento =="string"?new Date(dataItem.fechaVencimiento):dataItem.fechaVencimiento
        this.columTempEditable = {colum:column.field,index:rowIndex}
        this.valorAnteriorEditable = {monto:dataItem.cuota,fechaVencimiento:datePipeTransform(fechaVencimiento,'yyyy-MM-ddTHH:mm:ss','en-US')}
        sender.editCell(rowIndex, columnIndex, this.createFormGroupEditable(dataItem));
      }
    }
  }

   cellCloseHandlerEditable(args: CellCloseEvent): void {//evento cuando se cierra la celda
    const { formGroup, dataItem } = args;
    if (!formGroup.valid) args.preventDefault();
    else if (formGroup.dirty) {
      this.assignValuesEditable(dataItem, formGroup.value);
    }
  }
   isReadOnlyEditable(field: string): boolean {//fields de solo lectura
    const readOnlyColumns = [
      "cancelado", "nroCuota", "tipoCuota", "moneda","saldo","totalPagar"];
    return readOnlyColumns.indexOf(field) > -1;
  }
   createFormGroupEditable(dataItem: any): FormGroup {// form group para las celdas editables
    return this.formBuilder.group({
      nroSubCuota: [dataItem.nroSubCuota, Validators.required],
      fechaVencimiento: [
        typeof dataItem.fechaVencimiento =="string" &&
        dataItem.fechaVencimiento.length>1
        ? new Date(dataItem.fechaVencimiento):dataItem.fechaVencimiento,
        Validators.required],
      cuota: [dataItem.cuota, Validators.required],
      mora: [dataItem.mora, Validators.required]
    });
  }
   assignValuesEditable(target: any, source: any): void {//asignar valores modificados

    Object.assign(target, source);
    let dataItem = this.listaCronogramaEditable[this.columTempEditable.index]

    const FechaPeriodoCambio=datePipeTransform(new Date(),'yyyy-MM-ddTHH:mm:ss','en-US')
    if(this.columTempEditable.colum=="cuota"){
      const index = this.listaCambiosCronograma.findIndex(item => item.idDetalle === dataItem.id && item.antiguo==false && item.tipoModificacion=="MONTO");
      if(index==-1){
        const ObjectAntiguo ={
          codigoMatricula:this.formMatricula.get("codigoMat").value,
          FechaVencimientoCambio:this.valorAnteriorEditable.fechaVencimiento,
          montoCambio:-1*this.valorAnteriorEditable.monto,
          tipoModificacion:"MONTO",
          periodoCambio:FechaPeriodoCambio,
          antiguo:true,
          idDetalle:dataItem.id
        }
        this.listaCambiosCronograma.push(ObjectAntiguo)
        const ObjectNuevo ={
          codigoMatricula:this.formMatricula.get("codigoMat").value,
          FechaVencimientoCambio:this.valorAnteriorEditable.fechaVencimiento,
          montoCambio:dataItem.cuota,
          tipoModificacion:"MONTO",
          periodoCambio:FechaPeriodoCambio,
          antiguo:false,
          idDetalle:dataItem.id
        }
        this.listaCambiosCronograma.push(ObjectNuevo)
      }
      else{
        this.listaCambiosCronograma[index].montoCambio=dataItem.cuota,
        this.listaCambiosCronograma[index].periodoCambio=FechaPeriodoCambio
      }

    }
    if(this.columTempEditable.colum=="fechaVencimiento"){
      const index = this.listaCambiosCronograma.findIndex(item => item.idDetalle === dataItem.id && item.antiguo==false && item.tipoModificacion=="FECHA");
      if(index==-1){
        const ObjectAntiguo ={
          codigoMatricula:this.formMatricula.get("codigoMat").value,
          FechaVencimientoCambio:this.valorAnteriorEditable.fechaVencimiento,
          montoCambio:dataItem.cuota,
          tipoModificacion:"FECHA",
          periodoCambio:FechaPeriodoCambio,
          antiguo:true,
          idDetalle:dataItem.id
        }
        this.listaCambiosCronograma.push(ObjectAntiguo)
        const ObjectNuevo ={
          codigoMatricula:this.formMatricula.get("codigoMat").value,
          FechaVencimientoCambio:datePipeTransform(dataItem.fechaVencimiento,'yyyy-MM-ddTHH:mm:ss','en-US'),
          montoCambio:dataItem.cuota,
          tipoModificacion:"FECHA",
          periodoCambio:FechaPeriodoCambio,
          antiguo:false,
          idDetalle:dataItem.id
        }
        this.listaCambiosCronograma.push(ObjectNuevo)
      }
      else{
        this.listaCambiosCronograma[index].FechaVencimientoCambio=datePipeTransform(dataItem.fechaVencimiento,'yyyy-MM-ddTHH:mm:ss','en-US'),
        this.listaCambiosCronograma[index].periodoCambio=FechaPeriodoCambio
      }
    }
    //validamos si es de fraccion
    var esfraccion = this.listacambiosorden.filter((x:any)=>
      (x.cuota == dataItem.nroCuota && x.subCuota == dataItem.nroSubCuota && x.tipoCambio == "Fraccion") ||
      (x.id == dataItem.id && x.tipoCambio == "Fraccion" || x.cuota == dataItem.nroCuota && x.subCuota == dataItem.nroSubCuota && x.tipoCambio == "Agregar")
    );
    if(esfraccion.length==0) // si la lista esta vacia se procede, de lo contrario no se hace nada
    {
      var posicion = this.listacambiosorden.length == 0 ?
        1 : this.listacambiosorden[this.listacambiosorden.length - 1].orden + 1;

      if(this.columTempEditable.colum=="cuota"){
        //validamos si ya existe este cambio para esta cuota
        let repetida = this.listacambiosorden.filter((x:any) =>
          x.cuota == dataItem.nroCuota &&
          x.subCuota == dataItem.nroSubCuota &&
          x.id == dataItem.id &&
          x.tipoCambio == "Monto"
        )

        if (repetida.length == 0)//si no existe entonces la agregarmos
        {
          let objRow = {
            id : dataItem.id,
            tipoCambio : 'Monto',
            orden : posicion,
            cuota : dataItem.nroCuota,
            subCuota : dataItem.nroSubCuota
          }
          this.listacambiosorden.push(objRow);
        }
        else//si existe
        {
            var valororiginal = this.listaCronogramaActual.find(e=>e.id===dataItem.id)
            if (valororiginal.cuota == dataItem.cuota)//si es igual monto, lo eliminamos
            {
              this.listacambiosorden = this.listacambiosorden.filter(e=>
                (e.id.toString()+e.tipoCambio) !== (dataItem.id.toString()+'Monto'))
            }
        }
      }
      else if(this.columTempEditable.colum=="mora"){
        let repetida = this.listacambiosorden.filter((x:any)=>
          x.cuota == dataItem.nroCuota &&
          x.subCuota == dataItem.nroSubCuota &&
          x.id == dataItem.id &&
          x.tipoCambio == "Mora"
        );

        if (repetida.length == 0)//si no existe entonces la agregarmos
        {
          let objRow = {
            id : dataItem.id,
            tipoCambio : 'Mora',
            orden : posicion,
            cuota : dataItem.nroCuota,
            subCuota : dataItem.nroSubCuota
          }
          this.listacambiosorden.push(objRow);
        }
        else//si existe es repetida
        {
            var valororiginal = this.listaCronogramaActual.find(e=>e.id===dataItem.id)
            if (valororiginal.mora == dataItem.mora)//si es igual monto, lo eliminamos
            {
              this.listacambiosorden = this.listacambiosorden.filter(e=>
                (e.id.toString()+e.tipoCambio) !== (dataItem.id.toString()+'Mora'))
            }
        }
      }
      else if(this.columTempEditable.colum=="fechaVencimiento"){
        let repetida = this.listacambiosorden.filter((x:any)=>
            x.cuota == dataItem.nroCuota &&
            x.subCuota == dataItem.nroSubCuota &&
            x.id == dataItem.id &&
            x.tipoCambio == "Fecha"
         )

        if (repetida.length == 0)//si no existe entonces la agregarmos
        {
          let objRow = {
            id : dataItem.id,
            tipoCambio : 'Fecha',
            orden : posicion,
            cuota : dataItem.nroCuota,
            subCuota : dataItem.nroSubCuota
          }
          this.listacambiosorden.push(objRow);
        }
        else//si existe es repetida
        {
            if(typeof dataItem.fechaVencimiento !='string')
              dataItem.fechaVencimiento=datePipeTransform(dataItem.fechaVencimiento,'yyyy-MM-ddTHH:mm:ss','en-US')
            var valororiginal = this.listaCronogramaActual.find(e=>e.id===dataItem.id)
            if (valororiginal.fechaVencimiento == dataItem.fechaVencimiento)//si es igual monto, lo eliminamos
            {
              this.listacambiosorden = this.listacambiosorden.filter(e=>
                (e.id.toString()+e.tipoCambio) !== (dataItem.id.toString()+'Fecha'))
            }

        }
      }
    }
    console.log("CAMBIOS",this.listacambiosorden)
    this.calcularcronograma();
  }
  //------------------------------------------------------------------------------------------------------
  // Funciones para el control de Interfaz ------------------------------------------------------------------
  filterCodigoMat(event:any){//Autocomplete de Matricula
    event= event.trim()
    if(event.length>=4)this.ObtenerMatriculaAutoComplete(event)
    else this.listaMatricula=[]
  }

  filterResponsable(event:any){//Autocomplete de Responsable
    event= event.trim()
    if(event.length>=4)this.ObtenerResponsable(event)
    else this.listaResponsable=[]
  }
  filterMoneda(event:any){//Autocomplete de moneda
    if(this.filtrarMoneda)
    {
      event= event.trim()
      if(event.length>=1)
        this.listaMonedaTem = this.listaMoneda.filter(
          (s) => s.nombrePlural.toLowerCase().indexOf(event.toLowerCase()) !== -1)
      else this.listaMonedaTem=this.listaMoneda
    }
  }

  filterSolicitante(event:any){//Autocomplete de Solicitante
    event= event.trim()
    console.log(event)
    if(event.length>=4)
      this.itemSolicitante = this.listaSolicitante.filter(
         (s) => s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1)
    else this.itemSolicitante=this.listaSolicitante
  }

  filterPrograma(event:any){//Autocomplete de Matricula
    event= event.trim()
    if(event.length>=4)this.ObtenerProgramaAutoComplete(event)
    else this.listaFiltroPrograma=[]
  }
  filterAlumno(event:any){//Autocomplete de Alumno
    event= event.trim()
    if(event.length>=4)this.ObtenerAlumnoAutoComplete(event)
    else this.listaAlumno=[]
  }
  filterAsesor(event:any){//Autocomplete de Asesor
    event= event.trim()
    if(event.length>=4)this.itemsAsesor = this.listaAsesor.filter(
      (s) => s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1)
  }
  filterCordinador(event:any){//Autocomplete de Coordinador
    event= event.trim()
    if(event.length>=4)this.itemsCordinador = this.listaCordinador.filter(
      (s) => s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1)
  }
  filterConceptoTasa(event:any){//Autocomplete de Tasa
    event= event.trim()
    if(event.length>=4)this.ObtenerConceptoTasa(event)
    else this.listaConceptoTasa=[]
  }
  TextBeneficioCounter(ev: string): void {//evento del TExtArea para mostar cantidad de caracteres
    this.charachtersCount = ev.length;
    this.counter = `${this.charachtersCount}/${this.maxlength}`;
  }



  CargarDataMatricula(event:any){//Carga data restande del campo matricula en base al codigo de matricula
    if(event.id.length>=5)
    {
      this.codigoMatriculaTemp=""
      this.sombra=true
      this.formDatosMatricula.reset()
      this.listaCronogramaActual=[]
        this.listaCronogramaOriginal=[]
      this.ObtenerAlumnoProgramaPorMatricula(event.id)
    }
  }
  CargarDataAlumno(event:any){//Carga data restande del campo matricula en base al nombre del alumno
    if(typeof event=="object")
    {
      if(typeof event.id=="number" && event.id!=-1)
      {
        this.codigoMatriculaTemp=""
        this.sombra=true
        this.formDatosMatricula.reset()
        this.listaCronogramaActual=[]
        this.listaCronogramaOriginal=[]
        this.ObtenerCodigoMatriculaPEspecificoPorAlumnos(event.id)
      }
    }
  }

  cargarCodMat(event:any){//Carga data restande del campo matricula en base al programa
    if(event.idPEspecifico!=null)
    {
      this.codigoMatriculaTemp=""
      this.sombra=true
      this.formDatosMatricula.reset()
      this.listaCronogramaActual=[]
      this.listaCronogramaOriginal=[]
      this.formMatricula.get('codigoMat').setValue(event.codigoMatricula)
    }
  }

  cargarDatosMatricula()
  {//Carga los datos y detalles de l amatricula por codigo
    let codMat=this.formMatricula.get('codigoMat').value
    if(codMat!=null)
    {
      this.fun3=false
      this.fun1=false
      this.fun2=false
      this.loaderGeneral=true
      this.ObtenerCostosAdministrativosCodigoMatricula(codMat)
      this.ObtenerDatosMatriculaPorCodigoMatricula(codMat)
      this.ObtenerCronograma(codMat)
      this.ObtenerPaisMatricula(codMat)
    }
    else{
      Swal.fire(
        "!Código de Matrícula Requerido¡",
        "El código de matrícula es requerido para generar la busqueda!",
        "warning"
      )
    }

  }


  accionModalTasa(){//aciones del modal Tasa academica
    switch (this.btnModalTasa) {
      case "Actualizar":
        break;
      case "Guardar":
        this.guardarTasa()
        break;
      default:
        break;
    }
  }

  abrirModalTasa(isNew:boolean,data?:any){//abre el modal tasas academicas
    this.filtrarMoneda=true
    this.listaMonedaTem=this.listaMoneda
    this.formTasaAcademica.reset()
    this.btnModalTasa="Guardar"
    this.nombreModalTasa="Nueva Tasa Academica"
    if(!isNew)
    {
      this.nombreModalTasa="Editar Tasa Academica"
      this.btnModalTasa="Actualizar"
    }
    this.modalService.open(this.modalTasaAcademica);

  }
  abrirModalEliminar(){
    if(this.codigoMatriculaTemp.length>0)
    {
      if(this.sombra==false)
      {
        this.modalService.open(this.modalEliminar);
      }
      else{
        Swal.fire(
          "!Matrícula eliminada¡",
          "Esta matrícula ya ha sido eliminada, anteriormente!",
          "warning"
        )
      }

    }
    else{
      Swal.fire(
        "!Sin matrícula cargada¡",
        "Carga la matricula antes eliminar!",
        "warning"
      )
    }
  }
  BuscarDocumentos(){//Busca los documentos por matricula y IdProgramaEspecifico
    let codMat=this.formMatricula.get('codigoMat').value
    let idPEspecifico=this.formDatosMatricula.get('idPEspecifico').value
    if(codMat!=null && codMat!=undefined && idPEspecifico!=null && idPEspecifico!=undefined)
    {
      this.loaderBuscarDoc=true
      this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerDocumentosMatricula}/${this.codigoMatriculaTemp}/${idPEspecifico}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaDocumento=response.body.listaDocumentos
          this.listaDocAlumno=response.body.listaDocumentoAlumno
          this.modalService.open(this.modalDocumentos,{size:"lg"})
          this.loaderBuscarDoc=false
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"obtener documentos")
          this.loaderBuscarDoc=false
        },
        complete: () => {},
      });
    }
    else{
      Swal.fire(
        "!Datos imcompletos¡",
        "Verifique que todos los datos esten ingresados en la sección 'Matrícula Alumno' ",
        "warning"
      )
    }
  }

  public itemDisabled(itemArgs: { dataItem: any; index: number }) {
    return itemArgs.dataItem.estadoMatricula === 'sindevolucion'|| itemArgs.dataItem.estadoMatricula === 'condevolucion'; // disable the 3rd item
  }

  abrirModalPagar(data:any,index:number){
     if(data.cancelado==false)
     {
        if((this.listaCronogramaActual[index].nroCuota==1 &&
          this.listaCronogramaActual[index].nroSubCuota==1)  ||
          this.listaCronogramaActual[index-1].cancelado==true)
        {
          if(data.moneda.toLowerCase()=="dolares")
          {
            this.listaMonedaTem = this.listaMoneda
            this.filtrarMoneda=true
          }
          else
          {
            this.listaMonedaTem = this.listaMoneda.filter(e=> e.nombrePlural.toLowerCase()===data.moneda.toLowerCase()|| e.id===19)//19=dolar
            this.filtrarMoneda=false
          }
          this.formPago.reset()

          this.cuotaTemp=data
          this.formPago.patchValue(data)
          this.formPago.get('fechaPago').setValue(new Date())
          this.modalService.open(this.modalPagarCuota)
        }
        else{
          Swal.fire(
            "!Cuota anterior sin pagar¡",
            "Debes pagar la cuota anterior para poder pagar la siguiente.!",
            "info"
          )
        }
     }
     else
     {
      Swal.fire(
        "!Cuota Pagada¡",
        "La cuota seleccionada fue pagada anteriormente, selecciona una cuota que aún no este pagada!",
        "warning"
      )
     }
  }

  abrirModalCrearFactSiigo(data:any){
    if (data.enviadoSiigo !== true) {
      let montoCuota;
      this.loaderCrearFactSiigo = false;
      this.ObtenerListaDepartamentos();
      this.ObtenerListaCiudades();
      if (data.moneda == "dolares"){ //Si está en dólares, realiza conversión
        montoCuota = this.TipoCambioDolarPesoColombiano(data.cuota)
      }
      else{
        montoCuota = data.cuota
      }
      const datos: IDatosCrearFactSiigo = {
        tipoCliente: "Customer",
        tipoPersona: "Person",
        tipoIdentificacion: "13",
        nroIdentificacion: this.listaPrograma[0].dni,
        nombresAlumno: this.listaPrograma[0].nombresAlumno,
        apellidosAlumno: this.listaPrograma[0].apellidosAlumno,
        direccionAlumno: this.listaPrograma[0].direccionAlumno,
        pais: "CO",
        departamento: null,
        ciudad: null,
        indicativoTelefono: "57",
        numeroTelefono: this.listaPrograma[0].celularAlumno,
        extensionTelefono: "",
        responsabilidadFiscal: "R-99-PN",
        nombresContacto: this.listaPrograma[0].nombresAlumno,
        apellidosContacto: this.listaPrograma[0].apellidosAlumno,
        correoContacto: this.listaPrograma[0].correoAlumno,
        tipoDocumento: 77639,
        medioPago: 4440,
        fechaDocumento: new Date(),
        fechaVencimiento: new Date(),
        valorTotal: montoCuota,
        observaciones: "Nuestra Razón Social según RUT es - BS GRUPO COLOMBIA SAS - Somos del régimen ordinario No responsables de IVA, No somos grandes contribuyentes. No somos autorretenedores ni de renta ni de ICA, Actividad principal ICA 8551 9,66 * 1.000. Esta factura se asimila en todos sus efectos a la letra de cambio según Art. 774 del Código de Comercio. Es exigible a su vencimiento y causa un interés de mora mensual liquidado a la tasa máxima permitida de conformidad con los artículos 883 y 884. Cuenta habilitada para pagos BANCOLOMBIA, cuenta de ahorros No. 65231918412. Favor realizar el pago a nombre de BS Grupo Colombia S.A.S. No practicar retención de ICA fuera de Bogotá D.C.",
        codigoItem: "001",
        descripcionItem: "SERVICIOS EDUCATIVOS - " + this.nombreCentroCosto,
        cantidadItem: "1",
        precioItem: montoCuota
      };
      if(data.cancelado==true)
      {
        this.formCrearFactSiigo.reset();
        this.formCrearFactSiigo.patchValue(datos);
        this.idCronogramaPagoDetalleFinal = data.id
        this.modalRefCrearFactSiigo = this.modalService.open(this.modalCrearFactSiigo,{size:"lg"});
      }
      else
      {
      Swal.fire(
        "!Cuota Sin Pagar¡",
        "La cuota seleccionada no se encuentra pagada, selecciona una cuota pagada!",
        "warning")
      }
    }
    else{
      Swal.fire(
        "!Cuota Enviada¡",
        "La cuota ya fue enviada a Siigo!",
        "warning"
      )
    }
  }

  TipoCambioDolarPesoColombiano(monto: number){
    const rpta = Number((monto * this.montoTipoCambioPesoColombiano).toFixed(2));
    return rpta;
  }

  EnviarFacturaDeVentaSiigo(datosformulario: any){
    if (this.formCrearFactSiigo.valid){
      this.loaderCrearFactSiigo = true;
      const formatDate = (date: Date): string => {
        return date.toISOString().split('T')[0];
      };
      const factura: ICrearFacturaDeVentaSiigo = {
        documento: {
          id: datosformulario.tipoDocumento
        },
        fecha: formatDate(new Date(datosformulario.fechaDocumento)),
        cliente: {
          numeroIdentification: datosformulario.nroIdentificacion
        },
        vendedor: this.idVendedor,
        observaciones: datosformulario.observaciones,
        items: [
          {
            codigo: datosformulario.codigoItem,
            descripcion: datosformulario.descripcionItem,
            cantidad: datosformulario.cantidadItem,
            precio: datosformulario.precioItem
          }
        ],
        pagos: [
          {
            id: datosformulario.medioPago,
            valor: datosformulario.valorTotal,
            fechaVencimiento: formatDate(new Date(datosformulario.fechaVencimiento))
          }
        ]
      };
      const cliente: ICrearClienteSiigo = {
        tipoCliente: datosformulario.tipoCliente,
        tipoPersona: datosformulario.tipoPersona,
        tipoIdentificacion: datosformulario.tipoIdentificacion,
        identificacion: datosformulario.nroIdentificacion,
        nombres: [datosformulario.nombresAlumno, datosformulario.apellidosAlumno],
        codigosFiscal: [datosformulario.responsabilidadFiscal],
        direccion: datosformulario.direccionAlumno,
        codigoPais: datosformulario.pais,
        codigoDepartamento: this.codigoDepartamento.toString(),
        codigoCiudad: this.codigoCiudad.toString(),
        telefonoIndicativo: datosformulario.indicativoTelefono,
        telefonoNumero: datosformulario.numeroTelefono,
        telefonoExtension: datosformulario.extensionTelefono,
        contactoNombre: datosformulario.nombresContacto,
        contactoApellido: datosformulario.apellidosContacto,
        contactoEmail: datosformulario.correoContacto
      }
      const datosCompletos: DatosCompletosDTO = {
        factura: factura,
        cliente: cliente
      };
      this.integraService.postJsonResponse(constApiFinanzas.DatosCompletosSiigo, datosCompletos)
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            if (resp.body != null) {
              this.ActualizarCronogramaPagoDetalleFinalSiigo();
              this.loaderCrearFactSiigo = true;
              this.modalRefCrearFactSiigo.close();
              this.alertService.mensajeExitoso();
              let codMat=this.formMatricula.get('codigoMat').value
              this.ObtenerCronograma(codMat);
            }
          },
          error: (error) => {
            this.loaderCrearFactSiigo = false
            this.alertService.mensajeError(error);
          },
        });
      }
      else{
        this.formCrearFactSiigo.markAllAsTouched();
        Swal.fire("Error!", "Debe llenar los campos obligatorios.", "warning");
      }
  }

  ActualizarCronogramaPagoDetalleFinalSiigo(){
    this.integraService.putJsonResponse(constApiFinanzas.ActualizaEnviadoSiigo + '/' + this.idCronogramaPagoDetalleFinal)
    .subscribe(
      response => {
        console.log('Respuesta exitosa:', response);
      },
      error => {
        console.error('Error en la solicitud:', error);
      }
    );
  }

  simularPago(){ // simula los resultados de un pago.
    if(
      this.formPago.get('monto').valid &&
      this.formPago.get('tipoCambio').valid &&
      this.formPago.get('idMoneda').valid
    )
    {
      let icon:SweetAlertIcon
      let dataForm= this.formPago.getRawValue()
      console.log (dataForm)
      var montofinal:number;
      let monedabase = this.listaMoneda.find(e=> e.nombrePlural.toLowerCase()===this.cuotaTemp.moneda.toLowerCase()).id
      let monedaPago = this.listaMoneda.find(e=> e.id===dataForm.idMoneda).nombrePlural
      if (monedabase == dataForm.idMoneda)
          montofinal = dataForm.monto;
      else if (monedabase != 19 && dataForm.idMoneda == 19)//monto base soles y paga con dolares
          montofinal = dataForm.monto * dataForm.tipoCambio;
      else if (monedabase == 19 && dataForm.idMoneda != 19)//monto base dolares y paga con soles
           montofinal = dataForm.monto / dataForm.tipoCambio;
      montofinal = Math.round(montofinal*100)/100
      let cuotaBase:number= Math.round((this.cuotaTemp.cuota+this.cuotaTemp.mora)*100)/100
      let mensaje:string="Moneda Cronograma: "+this.cuotaTemp.moneda+"<br>"
      mensaje+="Moneda Pago      : "+monedaPago.toLowerCase()+"<br>"
      mensaje+="Monto Pago Real  : "+dataForm.monto+"<br>"
      mensaje+="Tasa de Cambio   : "+dataForm.tipoCambio+"<br><br>"
      mensaje+="Monto Cuota      : "+cuotaBase+"<br>"
      mensaje+="Monto Pago       : "+montofinal+"<br><br>"
      if (this.PagoMaximoSolesDolares<montofinal){
        mensaje+="El monto a pagar supera la suma total de las cuotas pendientes"
        mensaje+="<br><br> Resultado:<br> Pago no realizado"+
        " <span class='k-icon k-i-x-circle k-icon-30' style='color:rgb(179, 97, 90) ; font-size: medium;padding-bottom: 2px;' ></span>"
        icon='error'
      }
      else if(montofinal>cuotaBase)
      {
        //fraccionar
        mensaje += "Se cancelará la cuota ( "+dataForm.nroCuota+"-"+dataForm.nroSubCuota+" )<br>"
        let mensajeExtra=""
        let resto = montofinal-cuotaBase
        let resto1:number
        this.listaCronogramaActual.forEach((e:any)=>{
          if(e.cancelado==false)
          {
            if(resto>0)
            {
              if(this.cuotaTemp.nroCuota == e.nroCuota)
              {
                if(this.cuotaTemp.nroSubCuota != e.nroSubCuota)
                {
                  resto = resto - Math.round((e.cuota + e.mora)*100)/100
                  if(resto>=0)
                  {
                    mensaje +="Se cancelará la cuota ( "+e.nroCuota+"-"+e.nroSubCuota+" )<br>"
                    mensajeExtra ="Pagará mas de una cuota"
                  }
                  else if(resto<0)
                  {
                    mensaje +="Se pagará parcialmente la cuota  ( "+
                    e.nroCuota+"-"+e.nroSubCuota+" ) con el monto "+(Math.round(((e.cuota + e.mora)+resto)*100)/100).toString()
                    mensajeExtra ="Pago realizado y fraccionamiento de la cuota ( "+
                  e.nroCuota+"-"+e.nroSubCuota+" )"
                  }
                }
              }
              else if (this.cuotaTemp.nroCuota < e.nroCuota)
              {
                resto = resto - Math.round((e.cuota + e.mora)*100)/100
                if(resto>=0)
                {
                  mensaje +="Se cancelará la cuota ( "+e.nroCuota+"-"+e.nroSubCuota+" )<br>"
                  mensajeExtra ="Pagará mas de una cuota"
                }
                else if(resto<0)
                {
                  mensaje +="Se pagará parcialmente la cuota  ( "+
                  e.nroCuota+"-"+e.nroSubCuota+" ) con el monto "+(Math.round(((e.cuota + e.mora)+resto)*100)/100).toString()
                  mensajeExtra ="Pago realizado y fraccionamiento de la cuota ( "+
                  e.nroCuota+"-"+e.nroSubCuota+" )"
                }
              }
            }
          }

        })
        icon='warning'
        mensaje+="<br><br> Resultado:<br> "+mensajeExtra
        mensaje+=" <span class='k-icon k-i-exclamation-circle k-icon-30' style='color: rgb(175, 161, 74); font-size: medium;padding-bottom: 2px;' ></span>"
      }
      else if(montofinal<cuotaBase)
      {
        mensaje+="El monto a pagar no supera al monto cuota"
        mensaje+="<br><br> Resultado:<br> Pago no realizado"+
        " <span class='k-icon k-i-x-circle k-icon-30' style='color:rgb(179, 97, 90) ; font-size: medium;padding-bottom: 2px;' ></span>"
        icon='error'
      }
      else if(montofinal==cuotaBase)
      {
        mensaje+= "Se cancelará la cuota ( "+dataForm.nroCuota+"-"+dataForm.nroSubCuota+" )"
        mensaje+="<br><br> Resultado:<br> Pago realizado"+
        " <span class='k-icon k-i-check-outline k-icon-30' style='color: rgb(105, 185, 105); font-size: medium;padding-bottom: 2px;' ></span>"
        icon='success'
      }
      this.alertService.mensajeIcon

      Swal.fire({
        icon: icon,
        title: 'Resultados del Simulador',
        html: `
          <p >${mensaje}</p>
          `,
      })
    }
    else
    {
      this.formPago.get('monto').markAllAsTouched()
      this.formPago.get('tipoCambio').markAllAsTouched()
      this.formPago.get('idMoneda').markAllAsTouched()
    }
  }

  agregarCuota(){//agrega una cuota en el cronograma actual editable.
    var tamano = this.listaCronogramaEditable.length
    var ultimo = this.listaCronogramaEditable[tamano - 1];//trae el ultimo registro de la grilla
    this.listaCronogramaEditable.push(
        {
          id: 0,
          nroCuota: ultimo.nroCuota + 1,
          nroSubCuota: 1,
          moneda: ultimo.moneda,
          tipoCuota: ultimo.tipoCuota,
          cuota: 0,
          mora: 0,
          saldo: 0,
          totalPagar: 0,
          fechaVencimiento: ultimo.fechaVencimiento,
          cancelado: false
        }
    );
    var posicion = this.listacambiosorden.length == 0 ? 1 : this.listacambiosorden[this.listacambiosorden.length - 1].orden + 1;
    var nuevaCuota = {
      id : 0,
      tipoCambio : 'Agregar',
      orden : posicion,
      cuota : ultimo.nroCuota + 1,
      subCuota : 1
    }
    this.listacambiosorden.push(nuevaCuota);
  }

  cancelarCambios(){//cancela los cambios de la grilla editable y regresa a su version original

    let stringActual = JSON.stringify(this.listaCronogramaActual)
    let stringEditado = JSON.stringify(this.listaCronogramaEditable)
    let NoisEquals =true
    if(stringActual==stringEditado) NoisEquals=false
    if(this.listacambiosorden.length>0 || NoisEquals)
    {
      this.listaCambiosCronograma=[]
      this.listaCronogramaEditable = JSON.parse(this.cronogramaActual);
      this.listacambiosorden=[]
      Swal.fire(
        "!Cambios cancelados¡",
        "El cronograma fue revertido a su versión actual!",
        "success"
      )
      this.calcularcronograma()
    }
    else{
      Swal.fire(
        "!Sin cambios!",
        "El cronograma no tiene cambios!",
        "info"
      )
    }
  }

  fraccionarCuota(data:any,index:number){
  var repetida = this.listacambiosorden.filter( (x)=>
    x.tipoCambio == "Fecha" || x.tipoCambio == "Monto" || x.tipoCambio == "Mora"
  );
  //FlagEdicion
  if (data.cancelado==true)//si ya esta pagada
  {
    Swal.fire(
      "!Cuota Pagada¡",
      "Una cuota pagada no se puede fraccionar!",
      "warning"
    )
  }
  else {
      if (data.id != 0) {
          if (repetida.length > 0 || data.flagCancelado) {
            Swal.fire(
              "!Cambios en la cuota¡",
              "No puede fraccionar , tiene cambios de fecha , monto , mora o eliminacion pendientes!",
              "warning"
            )
          }
          else {
              //si hay algun de fraccion ay de esta cuota
              var repetidafraccion = this.listacambiosorden.filter((x:any)=>
                  x.id == data.id && x.tipoCambio == "Fraccion"
              );
              if (repetidafraccion.length > 0) {
                Swal.fire(
                  "!Cuota Fraccionada¡",
                  "No puede fraccionar 2 veces la misma cuota!",
                  "warning"
                )
              }
              else {
                  this.abrirModalFraccionar(index)
              }
          }
      }
      else {
        Swal.fire(
          "!Cuota no existente¡",
          "No puede Fraccionar una cuota que no aun no existe!",
          "warning"
        )
      }
  }
  }

  calcularcronograma() {
    //primero obtengo toda la suma de los montos
    var montototal = 0;
    this.valorReal=0
    this.listaCronogramaEditable.forEach((i:any)=>{
      montototal = montototal + (i.cuota == undefined ? 0 : i.cuota);
    })
    this.listaCronogramaEditable.forEach((i:any)=>{
        i.totalPagar= Math.round(montototal*100)/100;
        montototal = (montototal - i.cuota);
        i.saldo= Math.round(montototal*100)/100;
        i.cuota = Math.round(i.cuota*100)/100;
        this.valorReal +=i.cuota
    })
    this.valorReal = Math.round(this.valorReal*10000)/10000;
  }

  abrirModalFraccionar(index:number){
    Swal.fire({
      title: 'Fraccionar Cuota',
      text:"¿En cuántas cuotas quieres fraccionar la cuota actual?",
      input: 'number',
      inputAttributes: {
        min:'1',
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonColor:'#F44336',
      showLoaderOnConfirm: true,
    }).then((result) => {
      if (result.isConfirmed) {
        if(result.value.length>0)
        {
          let data = this.listaCronogramaEditable[index]
          let nroSubCuota = parseInt(result.value)
          var posicion = this.listacambiosorden.length == 0 ?
            1 :
            this.listacambiosorden[this.listacambiosorden.length - 1].orden + 1;
          var nroSubcuotaActual = data.nroSubCuota;
          var nroSubcuotaSigue = data.nroSubCuota;
          var validador = data.nroSubCuota;
          var totalnrocuotas = (nroSubCuota + 1);
          var montocuota = (data.cuota / totalnrocuotas);
          data.cuota= (Math.round(montocuota*100))/100 //actualizo el monto de la cuota que se fracciono
          data.enviado= false//actualizo el monto de la cuota que se fracciono
          this.listaCronogramaEditable.forEach( (d:any) =>{
            if (d.nroCuota == data.nroCuota && d.nroSubCuota == data.nroSubCuota)EMPTY;// mientras sea diferente al row actual // Se deshabilitan ////nada porque es igual
            else {
                // que no sea de agregar
                var esagregado = this.listacambiosorden.filter( (x:any)=>
                    x.cuota == d.nroCuota && x.subCuota == d.nroSubCuota && x.tipoCambio == "Agregar"
                );
                if (esagregado.length > 0)EMPTY;//si es un agregado // no le quito
                else {
                    var dataItem = this.listaCronogramaEditable.find((z:any)=>z.id===d.id);
                    dataItem.flagCancelado= true
                }

            }
          });
          //ahora agregamos como libres de edicion: FlagEdicion:false
          for (var i = 0; i < nroSubCuota; i++) {
            nroSubcuotaSigue = nroSubcuotaSigue + 1;//la que sigue
            var maximosubcuota = 0;
            var cont = 1;
            var flag = true;
            while (flag) {
                var existe = this.listaCronogramaEditable.filter((x:any) =>
                    x.nroCuota == data.nroCuota && x.nroSubCuota == (nroSubcuotaActual + cont)
                );
                if (existe.length > 0) {
                    flag = true;
                    cont = cont + 1;
                }
                else {
                    maximosubcuota = nroSubcuotaActual + cont;
                    flag = false;
                }
            }
            while (validador != maximosubcuota - 1) {
                var existe = this.listaCronogramaEditable.filter((x:any)=>
                    x.nroCuota == data.nroCuota && x.nroSubCuota == maximosubcuota - 1
                );
                if (existe.length > 0) {
                    var dataItem = this.listaCronogramaEditable.find((e:any)=>e.id==existe[0].id);
                    if (i == 0) {
                        //nuevo objeto de cambio
                        let objRow = {
                          id : dataItem.id,//el id del que vienen
                          tipoCambio : 'Fraccion Reemplazado',
                          orden : posicion,
                          cuota : dataItem.nroCuota,
                          subCuota : dataItem.nroSubCuota
                        }
                        this.listacambiosorden.push(objRow);//guardamos las cuotas afectadas
                    }
                    dataItem.nroSubCuota=maximosubcuota;
                    maximosubcuota = maximosubcuota - 1;
                }
            }
            index = index + 1;
            this.listaCronogramaEditable.push(
              {
                nroCuota: data.nroCuota,
                nroSubCuota: nroSubcuotaSigue,
                id: 0,
                flagCancelado: false,
                enviado: false,
                moneda: data.moneda,
                tipoCuota: data.tipoCuota,
                cuota: montocuota,
                fechaVencimiento: data.fechaVencimiento,
                mora: data.mora,
                cancelado: false
              }
            );

            //nuevo objeto de cambio
             let objRow = {
              id : data.id,//el id del que vienen
              tipoCambio : 'Fraccion',
              orden : posicion,
              cuota : data.nroCuota,
              subCuota : nroSubcuotaSigue
            }
            this.listacambiosorden.push(objRow);//guardamos el cambio(id de la cuota fraccionada,tipo,posiciondecambio,detalle cuotas creadas)

            nroSubcuotaActual = nroSubcuotaActual + 1;
            validador = validador + 1;
          }
          this.listaCronogramaEditable.sort((a, b) => a.nroCuota - b.nroCuota);
          this.calcularcronograma()
        }
        else{
          Swal.fire(
            "!Sin Nro. de Subcuotas¡",
            "Se necesita un número de subcuota a fraccionar!",
            "info"
          )
        }
      }
    })
  }

  abrirModalConsiderarMora(data:any){
    this.inputCuota.reset()
    this.montoPasar = data.mora
    this.montoPasarMax = data.mora
    this.inputCuota.setValue(this.listaNoPagados[0].id)
    this.modalService.open(this.modalConsiderarMora);
  }

  abrirModalGuardarCronograma(){
    if(this.listaCronogramaEditable.length>0)
    {
      if(this.listacambiosorden.length>0)
      {
        this.inputSolicitante.setValue(this.userService.idPersonal)
        this.inputAprobado.reset()
        this.inputObservacion.setValue("")
        this.modalService.open(this.modalGuardarCronograma)
      }
      else{
        Swal.fire(
          "!Sin cambios registrados¡",
          "El cronograma no tiene ningún cambio,el cambio de    sub-cuota se considera dentro de Eliminar!",
          "warning"
        )
      }
    }
    else{
      Swal.fire(
        "!El cronograma sin cuotas¡",
        "No se puede guardar un crongrama sin cuotas!",
        "warning"
      )
    }
  }

  //------------------------------------------------------------------------------------------------------
  //Funciones CRUD -------------------------------------------------------------------------------------------------------
  eliminarMatricula(){//cambia el estado de matricula a sin devolución o con devolucion (eliminacion comercial)
    this.loaderModalEliminar=true
    let codMat=this.formMatricula.get('codigoMat').value
    this.integraService
    .deleteJsonResponse(constApiFinanzas.EliminarMatricula
      +"/"+codMat+"/"+this.tipoEliminacion.value+"/"+this.userService.userName)
    .subscribe({
      next: (response: HttpResponse<any>) => {
        console.log(response.body )
        if(typeof response.body =="object")
        {
          this.loaderModalEliminar=false
          this.fun3=false
          this.fun1=false
          this.fun2=false
          this.loaderGeneral=true
          this.ObtenerCostosAdministrativosCodigoMatricula(codMat)
          this.ObtenerDatosMatriculaPorCodigoMatricula(codMat)
          this.ObtenerCronograma(codMat)
          this.modalService.dismissAll(this.modalEliminar)
          Swal.fire(
            "!Operación Exitosa¡",
            response.body.message,
            "success"
          )
        }
      },
      error: (error) => {
        this.loaderModalEliminar=false
        this.finanzasService.MensajeDeError(error,"eliminar matricula")
      },
      complete: () => {},
    });
  }

  guardarMatricula(){//guarda los cambios de la matricula
    Swal.fire({
      title: '¿Está seguro que quieres registar los cambios para esta matrícula?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4C5FC0',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, Continuar!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaderGeneral=true
        let dataForm =this.formDatosMatricula.getRawValue()
        console.log(dataForm)
        let envio={
          codigomatricula: this.codigoMatriculaTemp,
          estado: dataForm.estadoMatricula,
          periodo: dataForm.periodo==0?null:dataForm.periodo,
          programa: dataForm.idPEspecifico,
          asesor: dataForm.idAsesor,
          coordinador: dataForm.idCoordinador,
          observaciones: dataForm.observaciones,
          empresaPaga: dataForm.empresaPagaForm,
          empresaNombre: dataForm.empresaPagaForm==false?"":dataForm.empresaNombre,
          usuario: this.userService.userName
        }
        this.integraService
        .postJsonResponse(constApiFinanzas.ActualizarMatricula,envio)
        .subscribe({
          next: (response) => {
            this.loaderGeneral =false
            this.ObtenerDatosMatriculaPorCodigoMatricula(this.codigoMatriculaTemp)
            Swal.fire(
              "!Operación Exitosa¡",
              "Los datos fueron actualizados correctamente!",
              "success"
            )
          },
          error: (error) => {
            this.loaderGeneral =false
            this.finanzasService.MensajeDeError(error,"actualizar matricula")
          },
          complete: () => {},
        });

      }
    });

  }

  guardarDocumentos(){//guardar la modificacion en los documentos.
    this.loaderDocumento =true
    let codMat=this.formMatricula.get('codigoMat').value
    let listaDocumentos:any[]=[]
    this.listaDocumento.forEach((e:any) => {
        let doc={
          idCriterioDocs:e.idCriterioDocs,
          ingresar:e.estado==1||e.estado==true?true:false,
          usuario:this.userService.userName
        }
        listaDocumentos.push(doc)
    });

    let envio={
      listaDocumentos:listaDocumentos,
      matricula: codMat
    }
    this.integraService
    .postJsonResponse(constApiFinanzas.ActualizarEntregaControlDocs,envio)
    .subscribe({
      next: (response) => {
        this.loaderDocumento =false
        this.modalService.dismissAll(this.modalDocumentos)
        Swal.fire(
          "!Operación Exitosa¡",
          "Los documentos fueron actualizados correctamente!",
          "success"
        )
      },
      error: (error) => {
        this.loaderDocumento =false
        this.finanzasService.MensajeDeError(error,"actualizar Documentos")
      },
      complete: () => {},
    });
  }

  guardarTasa(){//guarda las tasas academicas
    if(this.formTasaAcademica.valid)
    {
      this.loaderModalTasa=true
      let dataForm = this.formTasaAcademica.getRawValue()
      let envio={
        codigoMatricula: this.codigoMatriculaTemp,
        idConcepto: dataForm.idConcepto,
        monto: dataForm.monto,
        moneda: this.listaMoneda.find(e=>e.id==dataForm.moneda).nombrePlural,
        usuario: this.userService.userName,
        fechaPago: datePipeTransform(dataForm.fechaPago,'yyyy-MM-ddTHH:mm:ss','en-US')
      }
      this.integraService
    .postJsonResponse(constApiFinanzas.AgregarTasasAcademicas,envio)
    .subscribe({
      next: (response) => {
        this.ObtenerCostosAdministrativosCodigoMatricula(this.codigoMatriculaTemp)
        this.loaderModalTasa=false
        this.modalService.dismissAll(this.modalTasaAcademica)
        Swal.fire(
          "!Operación Exitosa¡",
          "La tasa academica se guardo correctamente!",
          "success"
        )
      },
      error: (error) => {
        this.loaderModalTasa =false
        this.finanzasService.MensajeDeError(error,"guardar tasa administrativa")
      },
      complete: () => {},
    });
    }
    else this.formTasaAcademica.markAllAsTouched()
  }
  guardarFormaPagoCuota(idCuota:number,idFormaPago:number){//Guarda la forma de pago para la cuota
    this.loaderCronogramaActual=true
    this.integraService
    .putJsonResponse(constApiFinanzas.ActualizarFormaPago+"/"+idCuota+"/"+idFormaPago+"/"+this.userService.userName,null)
    .subscribe({
    next: (response) => {
      this.ObtenerCronograma(this.codigoMatriculaTemp)
      Swal.fire(
        "!Operación Exitosa¡",
        response.body.message,
        "success"
      )
      this.loaderCronogramaActual=false
    },
    error: (error) => {
      this.ObtenerCronograma(this.codigoMatriculaTemp)
      this.loaderCronogramaActual=false
      this.finanzasService.MensajeDeError(error,"cronograma actual - guardar forma pago")
    },
    complete: () => {},
    });
  }

  guardarFechaPagoCuota(idCuota:number,fechaPago:string){//Guarda la fecha de pago para la cuota
    this.loaderCronogramaActual=true
        let envio={
          idCuota: idCuota,
          fechaPago: fechaPago,
          usuario: this.userService.userName
        }
        this.integraService
        .putJsonResponse(constApiFinanzas.ActualizarFechaPago,envio)
        .subscribe({
        next: (response) => {
          this.ObtenerCronograma(this.codigoMatriculaTemp)
          Swal.fire(
            "!Operación Exitosa¡",
            response.body.message,
            "success"
          )
          this.loaderCronogramaActual=false
        },
        error: (error) => {
          this.ObtenerCronograma(this.codigoMatriculaTemp)
          this.loaderCronogramaActual=false
          this.finanzasService.MensajeDeError(error,"cronograma actual - guardar forma pago")
        },
        complete: () => {},
        });
  }

  guardarFechaDepositoCuota(idCuota:number,fechaDeposito:string){//Guarda la fecha de deposito para la cuota
    this.loaderCronogramaActual=true
    let envio={
      idCuota: idCuota,
      fechaDeposito: fechaDeposito,
      usuario: this.userService.userName
    }
    this.integraService
    .putJsonResponse(constApiFinanzas.ActualizarFechaDeposito,envio)
    .subscribe({
    next: (response) => {
      this.ObtenerCronograma(this.codigoMatriculaTemp)
      Swal.fire(
        "!Operación Exitosa¡",
        response.body.message,
        "success"
      )
      this.loaderCronogramaActual=false
    },
    error: (error) => {
      this.ObtenerCronograma(this.codigoMatriculaTemp)
      this.loaderCronogramaActual=false
      this.finanzasService.MensajeDeError(error,"cronograma actual - guardar forma pago")
    },
    complete: () => {},
    });
  }

  guardarPagoCuota(){//Guarda el pago de una/varias cuota(s)
    if(this.formPago.valid)
    {
      Swal.fire({
        title: '¿Está seguro que quieres realizar el pago?',
        text: '¡No podrás revertir esto, recuerda validarlo con el boton Simular!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Continuar!',
      }).then((result) => {
        if (result.isConfirmed)
        {
          let dataForm= this.formPago.getRawValue()
          var montofinal:number;
          let monedabase = this.listaMoneda.find(e=> e.nombrePlural.toLowerCase()===this.cuotaTemp.moneda.toLowerCase()).id
          if (monedabase == dataForm.idMoneda)
              montofinal = dataForm.monto;
          else if (monedabase != 19 && dataForm.idMoneda == 19)//monto base soles y paga con dolares
              montofinal = dataForm.monto * dataForm.tipoCambio;
          else if (monedabase == 19 && dataForm.idMoneda != 19)//monto base dolares y paga con soles
              montofinal = dataForm.monto / dataForm.tipoCambio;
          montofinal = Math.round(montofinal*100)/100
          let cuotaBase:number= Math.round((this.cuotaTemp.cuota+this.cuotaTemp.mora)*100)/100
          if(montofinal>=cuotaBase)
          {
            this.loaderModalPago=true
            dataForm.nroCheque =(dataForm.nroCheque).toString()
            let envio={
              codigoMatricula: this.codigoMatriculaTemp,
              nroCuota: dataForm.nroCuota,
              nroSubCuota: dataForm.nroSubCuota,
              montoBase: this.cuotaTemp.cuota,
              mora: this.cuotaTemp.mora,
              montoPago: dataForm.monto,
              monedaBase: (this.cuotaTemp.moneda).toLowerCase(),
              monedaPago: (this.listaMoneda.find(e=> e.id=== dataForm.idMoneda).nombrePlural).toLowerCase(),
              tipoCambio: dataForm.tipoCambio,
              formaPago: dataForm.idformaPago,
              documento: dataForm.idDocumneto,
              nroDocumento: dataForm.nroCheque,
              nroCuenta: dataForm.idCuenta,
              nroCheque: dataForm.nroCheque,
              fecha: datePipeTransform(dataForm.fechaPago,'yyyy-MM-ddTHH:mm:ss','en-US'),
              nroDeposito: dataForm.nroCheque,
              usuario: this.userService.userName
            }
            this.integraService
            .postJsonResponse(constApiFinanzas.GuardarPago,envio)
            .subscribe({
            next: (response) => {
              this.ObtenerCronograma(this.codigoMatriculaTemp)
              Swal.fire(
                "!Operación Exitosa¡",
                "El pago se ha realizado correctamente",
                "success"
              )
              this.modalService.dismissAll(this.modalPagarCuota)
              this.loaderModalPago=false
            },
            error: (error) => {
              this.ObtenerCronograma(this.codigoMatriculaTemp)
              this.loaderModalPago=false
              this.finanzasService.MensajeDeError(error,"cronograma actual - guardar pago")
            },
            complete: () => {},
            });
          }
          else
          {
            Swal.fire(
              "!Pago no realizado¡",
              "Revisa los resultados del simulador!",
              "error"
            )
          }

        }
      });
    }
    else this.formPago.markAllAsTouched()
  }

  guardarGestionDeCobranza(idCuota:number,moraTarifario:number){//Guarda la gestion de cobranza
    this.loaderCronogramaActual=true
        let envio={
          idCuota: idCuota,
          moraTarifario: moraTarifario,
          usuario: this.userService.userName
        }
        this.integraService
        .putJsonResponse(constApiFinanzas.ActualizarGestionDeCobranza,envio)
        .subscribe({
        next: (response) => {
          this.ObtenerCronograma(this.codigoMatriculaTemp)
          Swal.fire(
            "!Operación Exitosa¡",
            response.body.message,
            "success"
          )
          this.loaderCronogramaActual=false
        },
        error: (error) => {
          this.ObtenerCronograma(this.codigoMatriculaTemp)
          this.loaderCronogramaActual=false
          this.finanzasService.MensajeDeError(error,"cronograma actual - guardar gestion de cobranza")
        },
        complete: () => {},
        });
  }

  eliminarCuota(data:any,index:number){//Elimina uan cuota del cronograma
    if(data.cancelado==false)
    {
      var cambiosanteriores = this.listacambiosorden.filter((x:any)=>
        x.tipoCambio == 'Fraccion' ||
        x.tipoCambio == 'Fraccion Reemplazado' ||
        x.tipoCambio == 'Monto' ||
        x.tipoCambio == 'Fecha' ||
        x.tipoCambio == 'Mora'
      );
      if(cambiosanteriores.length==0)
      {
        Swal.fire({
          title: '¿Está seguro que quieres eliminar la cuota?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#4C5FC0',
          cancelButtonColor: '#d33',
          confirmButtonText: '¡Si, Continuar!',
        }).then((result) => {
          if (result.isConfirmed)
          {
              this.listaCronogramaEditable.splice(index,1)
              this.listaCronogramaEditable = this.listaCronogramaEditable.slice()
              this.listaCronogramaEditable.forEach((d:any) =>{//Inhabilitamos todas
                d.flagCancelado= true;
              });

              //para terminar añadimos un nuevo cambio como eliminado
              var posicion = this.listacambiosorden.length == 0 ?
              1 : this.listacambiosorden[this.listacambiosorden.length - 1].orden + 1;
              //objeto de cambio
              let objRow = {
                id : data.id,//el id del que vienen
                tipoCambio : 'Eliminado',
                orden : posicion,
                cuota : data.nroCuota,
                subCuota : data.nroSubCuota
              }
              this.listacambiosorden.push(objRow)
              this.calcularcronograma()
          }
        })

      }
      else{
          Swal.fire(
            "!Cambios Pendientes¡",
            "No se puede eliminar esta cuota, porque tienes cambios de fecha , monto , mora o fraccionamiento pendientes!",
            "warning"
          )
      }
    }
    else{
      Swal.fire(
        "!Cuota Pagada¡",
        "No se puede eliminar esta cuota, porque ya esta pagada!",
        "warning"
      )
    }
  }

  consideraMora(data:any,index:number){//considera la mora como pago de cuota
    if(data.cancelado==true)
    {
      if(data.mora>0)
      {
        this.loaderCronogramaEditable =true
        this.integraService
        .getJsonResponse(
          constApiFinanzas.ObtenerCuotasNoPagadas+"/"+this.codigoMatriculaTemp+"/"+data.version
          )
        .subscribe({
        next: (response) => {
          if(response.body!=null && response.body.length>0)
          {
            this.listaNoPagados=response.body
            this.loaderCronogramaEditable =false
            this.abrirModalConsiderarMora(data)

            this.cuotaMoraTemp.codigoMatricula = this.codigoMatriculaTemp
            this.cuotaMoraTemp.nroCuota = data.nroCuota;
            this.cuotaMoraTemp.nroSubCuota = data.nroSubCuota;
            this.cuotaMoraTemp.cuota = data.cuota;
            this.cuotaMoraTemp.mora = data.mora;
            this.cuotaMoraTemp.version = data.version;
          }
          else{
            this.loaderCronogramaEditable =false
            Swal.fire(
              "!Cuotas Pagadas¡",
              "No se puede considerar la mora porque todas las cuotas ya estan pagadas!",
              "warning"
            )
          }
        },
        error: (error) => {
          this.loaderCronogramaEditable =false
          this.finanzasService.MensajeDeError(error,"cronograma editable - obtener cuotas no pagadas")
        },
        complete: () => {},
        });
      }
      else{
        Swal.fire(
          "!Cuota con mora 0¡",
          "No se puede considerar la mora como adelanto de una cuota con el monto mora 0!",
          "warning"
        )
      }

    }
    else{
      Swal.fire(
        "!Cuota no Pagada¡",
        "No se puede considerar la mora como adelanto de una cuota no pagada!",
        "warning"
      )
    }
  }

  guardarConsiderarMora(){//guardar la mora considerada
    if(this.inputMontoPasar.valid)
    {

      this.cuotaMoraTemp.montoAdelanto = this.inputMontoPasar.value
      this.cuotaMoraTemp.id = this.inputCuota.value
      this.listaCronogramaEditable.forEach((e:any)=>{
        if (e.nroCuota == this.cuotaMoraTemp.nroCuota && e.nroSubCuota == this.cuotaMoraTemp.nroSubCuota) {
          e.cuota = e.cuota + Math.round(this.cuotaMoraTemp.montoAdelanto*100)/100
          e.mora = e.mora -  Math.round(this.cuotaMoraTemp.montoAdelanto*100)/100
        }
        if (e.id == this.cuotaMoraTemp.id) {
          e.cuota = e.cuota - Math.round(this.cuotaMoraTemp.montoAdelanto*100)/100
        }
      })
      let envio = {
        listaCronograma:this.listaCronogramaEditable,
        objeto:this.cuotaMoraTemp,
        usuario:this.userService.userName
      }

      this.loaderModalEliminar=true
      this.integraService
      .postJsonResponse(constApiFinanzas.ActualizarMoraCAdelanto,envio)
      .subscribe({
      next: (response) => {
        this.ObtenerCronograma(this.codigoMatriculaTemp)
        this.loaderModalEliminar=false
        Swal.fire(
          "¡Operación Exitosa!",
          "La mora fue considerada en la cuota ( "+this.cuotaMoraTemp.nroCuota+"-"+this.cuotaMoraTemp.nroSubCuota+" )!",
          "success"
        )
      },
      error: (error) => {
        this.loaderModalEliminar=false
        this.finanzasService.MensajeDeError(error,"cronograma editable - considerar mora")
      },
      complete: () => {
        this.modalService.dismissAll(this.modalConsiderarMora)
      },
      });
    }
    else this.inputMontoPasar.markAllAsTouched()
  }

  guardarCronogramaModificado(){//guardar cronograma modificado
    if(this.inputAprobado.valid && this.inputSolicitante.valid)
    {
      Swal.fire({
        title: '¿Estás seguro que quieres guardar los cambios para este cronograma?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4C5FC0',
        cancelButtonColor: '#d33',
        confirmButtonText: '¡Si, Continuar!',
      }).then((result) => {
        if (result.isConfirmed)
        {
          let objeto= {
            codigoMatricula : this.codigoMatriculaTemp,
            aprobadoPorId: this.inputAprobado.value,
            solicitadoPorId: this.inputSolicitante.value,
            comentario: this.inputObservacion.value
          }
          let envio = {
            objeto:objeto,
            listaCambiosOrden:this.listacambiosorden,
            listaCronograma:this.listaCronogramaEditable,
            usuario:this.userService.userName
          }

          this.listacambiosorden.forEach((e: any) => {
            if (e.tipoCambio === 'Fecha') {
              const index = envio.listaCronograma.findIndex((c: any) => c.id === e.id);
              if (index !== -1) {
                envio.listaCronograma[index].fechaVencimiento = datePipeTransform(
                  envio.listaCronograma[index].fechaVencimiento, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
              }
            }
          });
          this.loaderModalEliminar=true
          this.integraService
          .postJsonResponse(
            constApiFinanzas.GuardarCronograma,envio
            )
          .subscribe({
          next: (response) => {
            this.insertarReporteCambios()
            this.loaderModalEliminar =false
            this.ObtenerCronograma(this.codigoMatriculaTemp)
            this.modalService.dismissAll(this.modalGuardarCronograma)
            Swal.fire(
              "¡Operación Exitosa!",
              "Los cambios se guardaron de manera correcta!",
              "success"
            )
          },
          error: (error) => {
            this.loaderModalEliminar =false
            this.finanzasService.MensajeDeError(error,"cronograma editable - guardar cambios")
          },
          complete: () => {},
          });

        }
      })
    }
    else
    {
      this.inputAprobado.markAllAsTouched()
      this.inputSolicitante.markAllAsTouched()
    }

  }

  insertarReporteCambios(){
    if(this.listaCambiosCronograma.length>0){
      this.integraService
      .postJsonResponse(constApiFinanzas.InsertarCambiosPeriodo, this.listaCambiosCronograma)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          this.listaCambiosCronograma=[]
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, 'El cronograma modificado fue guardado exitosamente, pero el reporte de cambios no se ha podido guardar, comunicar el error a TI.');
        },
        complete: () => {
        },
      });
    }
  }

  mostrarMensajeError(error: any): void {
    Swal.fire({
      icon: "error",
      html: `<p class="text-start">${error.error}</p>
          <p class="text-start text-danger fs-6">${error.message}</p>`,
      allowOutsideClick: false
    });
  }

  onKeyDownNumero(event: KeyboardEvent): void {
    const validKeys = ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const isNumber = (key: string) => /^[0-9]$/.test(key);
    if (!validKeys.includes(event.key) && !isNumber(event.key)) {
      event.preventDefault();
    }
  }

  onKeyDownMonto(event: KeyboardEvent): void {
    const validKeys = ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
    const isNumber = (key: string) => /^[0-9]$/.test(key);
    if (!validKeys.includes(event.key) && !isNumber(event.key)) {
      event.preventDefault();
    }
  }




  abrirModalFacturama(dataItem: any): void {
     // Validar si el campo `cancelado` está en `true`
  if (dataItem.cancelado === true) {
    // Validar si ya fue enviado previamente
    if (dataItem.facturamaEnvio !== true) {
      // Guardar el ID del registro seleccionado
      this.idCronogramaPagoDetalleFinal = dataItem.id
    this.ObtenerListaFormaPagoFacturama()
    this.ObtenerListaUsoCfdiFacturama()
    this.ObtenerListaRegimenFiscalFacturama()
    this.calcularTotales(); // Forzar el cálculo al abrir el modal


    this.formCrearFacturaFacturama.patchValue({
      // Datos Generales
      CfdiType: dataItem.CfdiType || null,
      PaymentForm: dataItem.PaymentForm || null,
      PaymentMethod: dataItem.PaymentMethod || null,
      ExpeditionPlace:'01000',

      // Datos del Receptor
      ReceiverRfc: dataItem.ReceiverRfc || null,
      // ReceiverName: dataItem.listaPrograma || null,
      //ReceiverName: this.datosAlumno?.nombreCompleto || '',
      ReceiverName: this.listaPrograma[0].nombreCompleto,
      Email: this.listaPrograma[0].correoAlumno,
      CfdiUse: dataItem.CfdiUse || null,
      FiscalRegime: dataItem.FiscalRegime || null,
      TaxZipCode: dataItem.TaxZipCode || null,
      // Dirección del Cliente
      Street: dataItem.Street || null,
      ExteriorNumber: dataItem.ExteriorNumber || null,
      InteriorNumber: dataItem.InteriorNumber || null,
      Neighborhood: dataItem.Neighborhood || null,
      Municipality: dataItem.Municipality || null,
      State: dataItem.State || null,
      Country: dataItem.Country || 'MEX', // Default México si no se envía otro valor

      // Detalle del Producto
      ProductCode:'01010101',
      Description:"SERVICIOS EDUCATIVOS - " + this.nombreCentroCosto,
      Quantity: 1,
      UnitPrice: dataItem.UnitPrice || null,
      Subtotal: dataItem.Subtotal || null,

      // Impuestos
      // TaxName:'IVa',
      // Base: dataItem.Base || null,
      // Rate: dataItem.Rate || null,
      // IsRetention: dataItem.IsRetention || false,
      taxTotal: dataItem.taxTotal || null,

      // Total del Producto
      ItemTotal: dataItem.ItemTotal || null,
    });

    // Abrir modal
    this.modalRefCrearFactFacturma = this.modalService.open(this.modalCrearFacturaFacturama, {
      size: "xl", // Modal más ancho
      backdrop: 'static', // Evita cerrar el modal al hacer clic afuera (opcional)
    });
  } else {

    Swal.fire(
      '¡Factura ya enviada!',
      'La factura seleccionada ya fue enviada a Facturama.',
      'warning'
    );
  }

} else {
  // Alerta si el campo `cancelado` es falso
  Swal.fire(
    '¡Cuota sin pagar!',
    'La cuota seleccionada no está cancelada. Selecciona una cuota pagada.',
    'warning'
  );
}
}



  datosAlumno: any; // Variable para guardar los datos del alumno
  argarDatosAlumno(): void {
    this.integraService
      .getJsonResponse(`${constApiFinanzas.ObtenerAlumnoProgramaEspecifico}`)
      .subscribe({
        next: (response: any) => {
          this.datosAlumno = response[0];
        },
        error: (error) => {
          console.error('Error al cargar los datos del alumno', error);
        },
      });
  }

  // Función para enviar factura a Facturama


  CrearClienteFacturama(): void {
    const datosFormulario = this.formCrearClienteFacturama.value;

    const cliente = {
      Rfc: datosFormulario.rfc,
      Name: datosFormulario.name,
      Email: datosFormulario.email,
      FiscalRegime: datosFormulario.fiscalRegime,
      CfdiUse: datosFormulario.cfdiUse,
      Address: {
        Street: datosFormulario.address.street,
        ExteriorNumber: datosFormulario.address.exteriorNumber,
        InteriorNumber: datosFormulario.address.interiorNumber,
        Neighborhood: datosFormulario.address.neighborhood,
        ZipCode: datosFormulario.address.zipCode,
        Municipality: datosFormulario.address.municipality,
        State: datosFormulario.address.state,
        Country: datosFormulario.address.country || 'MEX'  // Por defecto MEX
      }
    };

    console.log('Datos del Cliente JSON:', cliente);

    this.integraService.postJsonResponse('ruta/api/crearClienteFacturama', cliente)
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          console.log('Cliente creado:', resp);
          if (resp.status === 201) {
            this.alertService.mensajeExitoso('Cliente creado correctamente');
            this.modalService.dismissAll();  // Cierra el modal si es exitoso
          } else {
            console.warn('Respuesta inesperada:', resp.body);
          }
        },
        error: (error) => {
          console.error('Error en la solicitud:', error);
          this.alertService.mensajeError('Ocurrió un error al crear el cliente: ' + error.message);
        }
      });
  }

  ObtenerListaRegimenFiscalFacturama(){
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerListaRegimenFiscal}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaFacturmaRegimenFiscal=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"Lista - Regimen Fiscal")
        },
        complete: () => {},
      });
  }

  ObtenerListaUsoCfdiFacturama(){
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerListaUsoCfdi}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaFacturmaUsoCfdi=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"Lista - Regimen Fiscal")
        },
        complete: () => {},
      });
  }

  ObtenerListaFormaPagoFacturama(){
    this.integraService
      .getJsonResponse(
        `${constApiFinanzas.ObtenerFormapagoFacturama}`
      )
      .subscribe({
        next: (response: HttpResponse<any>) => {
          this.listaFacturamaFormaPago=response.body
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error,"Lista - Regimen Fiscal")
        },
        complete: () => {},
      });
  }
  EnviarFacturaYCliente(): void {
    // Obtener datos del formulario
    const datosFormulario = this.formCrearFacturaFacturama.value;
    const usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');

    const usuarioModificacion = usuarioData.userName;

    // Validar datos obligatorios
    if (!datosFormulario.ReceiverRfc || !datosFormulario.ReceiverName) {
      this.alertService.mensajeError('El RFC y el Nombre del receptor son obligatorios.');
      return;
    }

    const datosCompletos = {
      factura: {
        CfdiType: datosFormulario.CfdiType,
        PaymentForm: datosFormulario.PaymentForm,
        PaymentMethod: datosFormulario.PaymentMethod,
        ExpeditionPlace: datosFormulario.ExpeditionPlace || '01000',
        GlobalInformation: datosFormulario.Periodicity
          ? {
              Periodicity: datosFormulario.Periodicity,
              Months: datosFormulario.Months,
              Year: datosFormulario.Year?.toString() || ''
            }
          : null,
        Receiver: {
          Rfc: datosFormulario.ReceiverRfc,
          CfdiUse: datosFormulario.CfdiUse,
          Name: datosFormulario.ReceiverName,
          FiscalRegime: datosFormulario.FiscalRegime,
          TaxZipCode: datosFormulario.TaxZipCode
        },
        Items: [
          {
            ProductCode: datosFormulario.ProductCode || '01010101',
            Description: datosFormulario.Description,
            UnitCode: datosFormulario.UnitCode || 'ACT',
            Quantity: datosFormulario.Quantity || 0,
            UnitPrice: datosFormulario.UnitPrice || 0,
            Subtotal: (datosFormulario.Quantity || 0) * (datosFormulario.UnitPrice || 0),
            TaxObject: datosFormulario.TaxObject || '01',
            Total:
              ((datosFormulario.Quantity || 0) * (datosFormulario.UnitPrice || 0)).toFixed(2)
          }
        ]
      },
      cliente: {
        Rfc: datosFormulario.ReceiverRfc,
        Name: datosFormulario.ReceiverName,
        Email: datosFormulario.Email || '',
        FiscalRegime: datosFormulario.FiscalRegime,
        CfdiUse: datosFormulario.CfdiUse,
        Address: {
          Street: datosFormulario.Street || '',
          ExteriorNumber: datosFormulario.ExteriorNumber || '',
          InteriorNumber: datosFormulario.InteriorNumber || '',
          Neighborhood: datosFormulario.Neighborhood || '',
          ZipCode: datosFormulario.TaxZipCode || '',
          Municipality: datosFormulario.Municipality || '',
          State: datosFormulario.State || '',
          Country: datosFormulario.Country || 'MEX'
        }
      }
    };

    console.log('Datos completos enviados desde el formulario:', datosCompletos);

    this.integraService.postJsonResponse(constApiFinanzas.CrearFacturaFacturama, datosCompletos).subscribe({
      next: (response: HttpResponse<any>) => {
        console.log('Respuesta del servidor:', response);
        if (response.status === 201 || response.status === 200) {
          this.actualizarEstadoFacturamaEnvio(this.idCronogramaPagoDetalleFinal,usuarioModificacion ); // Envía el ID aquí

          this.alertService.mensajeExitoso('Factura y cliente enviados correctamente.');


          this.modalService.dismissAll(); // Cerrar el modal


          let codMat=this.formMatricula.get('codigoMat').value
          this.ObtenerCronograma(codMat);
        } else {
          console.warn('Respuesta inesperada:', response.body);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.alertService.mensajeError('Ocurrió un error al enviar los datos: ' + error.message);
      }
    });
  }

  EnviarFacturaYCliente9(): void {
    // Validar formulario
    if (this.formCrearFacturaFacturama.valid) {
        this.loaderCrearFacturaFacturama = true;

        // Obtener los datos del formulario
        const datosFormulario = this.formCrearFacturaFacturama.value;

        // Preparar datos completos
        const datosCompletos = {
            factura: {
                CfdiType: datosFormulario.CfdiType,
                PaymentForm: datosFormulario.PaymentForm,
                PaymentMethod: datosFormulario.PaymentMethod,
                ExpeditionPlace: datosFormulario.ExpeditionPlace || '01000',
                Receiver: {
                    Rfc: datosFormulario.ReceiverRfc,
                    CfdiUse: datosFormulario.CfdiUse,
                    Name: datosFormulario.ReceiverName,
                    FiscalRegime: datosFormulario.FiscalRegime,
                    TaxZipCode: datosFormulario.TaxZipCode
                },
                Items: [
                    {
                        ProductCode: datosFormulario.ProductCode || '01010101',
                        Description: datosFormulario.Description,
                        UnitCode: datosFormulario.UnitCode || 'ACT',
                        Quantity: datosFormulario.Quantity || 0,
                        UnitPrice: datosFormulario.UnitPrice || 0,
                        Subtotal: (datosFormulario.Quantity || 0) * (datosFormulario.UnitPrice || 0),
                        TaxObject: datosFormulario.TaxObject || '01',
                        Total: ((datosFormulario.Quantity || 0) * (datosFormulario.UnitPrice || 0)).toFixed(2)
                    }
                ]
            },
            cliente: {
                Rfc: datosFormulario.ReceiverRfc,
                Name: datosFormulario.ReceiverName,
                Email: datosFormulario.Email || '',
                FiscalRegime: datosFormulario.FiscalRegime,
                CfdiUse: datosFormulario.CfdiUse,
                Address: {
                    Street: datosFormulario.Street || '',
                    ExteriorNumber: datosFormulario.ExteriorNumber || '',
                    InteriorNumber: datosFormulario.InteriorNumber || '',
                    Neighborhood: datosFormulario.Neighborhood || '',
                    ZipCode: datosFormulario.TaxZipCode || '',
                    Municipality: datosFormulario.Municipality || '',
                    State: datosFormulario.State || '',
                    Country: datosFormulario.Country || 'MEX'
                }
            }
        };

        // Llamada al servicio de Facturama
        this.integraService.postJsonResponse(constApiFinanzas.CrearFacturaFacturama, datosCompletos).subscribe({
            next: (response: HttpResponse<any>) => {
                if (response.status === 201 || response.status === 200) {

                    this.alertService.mensajeExitoso('Factura y cliente enviados correctamente.');
                    this.modalService.dismissAll();
                } else {
                    console.warn('Respuesta inesperada:', response.body);
                    this.alertService.mensajeError('Hubo un problema en el envío.');
                }
                this.loaderCrearFacturaFacturama = false;
            },
            error: (error) => {
                console.error('Error en la solicitud:', error);
                this.loaderCrearFacturaFacturama = false;
                this.alertService.mensajeError('Ocurrió un error al enviar los datos: ' + error.message);
            }
        });
    } else {
        this.formCrearFacturaFacturama.markAllAsTouched();
        Swal.fire('Error!', 'Debe llenar los campos obligatorios.', 'warning');
    }
}

// Función para actualizar la tabla con FacturamaEnvio = 1

  // Función para actualizar el estado FacturamaEnvio
  actualizarEstadoFacturamaEnvio(id: number,usuarioModificacion: string) {
    if (!id) {
      console.error('ID no definido, no se puede realizar la actualización.');
      return;
    }

    if (!usuarioModificacion) {
      console.error('UsuarioModificacion no definido, no se puede realizar la actualización.');
      return;
    }

    const url = `${constApiFinanzas.ActualizarFacturamaEnvio}/${id}/${usuarioModificacion}`;
    console.log('URL generada:', url);

    this.integraService.putJsonResponse(url)
      .subscribe({
        next: (response) => {
          console.log('Respuesta exitosa:', response);
        },
        error: (error) => {
          console.error('Error en la solicitud:', error);
        }
      });
  }



calcularTotales(): void {
  const quantity = this.formCrearFacturaFacturama.get('Quantity')?.value || 0;
  const unitPrice = this.formCrearFacturaFacturama.get('UnitPrice')?.value || 0;

  const subtotal = quantity * unitPrice;


  const total = subtotal;

  this.formCrearFacturaFacturama.patchValue({
    Subtotal: subtotal,
    ItemTotal: total,
  });
}

}
interface IDatosCrearFactSiigo{
  tipoCliente: string,
  tipoPersona: string,
  tipoIdentificacion: string,
  nroIdentificacion: string,
  nombresAlumno: string,
  apellidosAlumno: string,
  direccionAlumno: string,
  pais: string,
  departamento: number,
  ciudad: number,
  indicativoTelefono: string,
  numeroTelefono: string,
  extensionTelefono: string,
  responsabilidadFiscal: string,
  nombresContacto: string,
  apellidosContacto: string,
  correoContacto: string,
  tipoDocumento: number,
  medioPago: number,
  fechaDocumento: Date,
  fechaVencimiento: Date,
  valorTotal: number,
  observaciones: string,
  codigoItem: string,
  descripcionItem: string,
  cantidadItem: string,
  precioItem: number
}

interface DatosCompletosDTO{
  factura: ICrearFacturaDeVentaSiigo,
  cliente: ICrearClienteSiigo
}
interface ICrearFacturaDeVentaSiigo {
  documento: IDocumentoDTO,
  fecha: string,
  cliente: IClienteDTO,
  vendedor: number,
  observaciones: string,
  items: ItemDTO[],
  pagos: IPagoDTO[]
}

interface IDocumentoDTO{
  id: number
}

interface IClienteDTO{
  numeroIdentification: string
}
interface ItemDTO{
  codigo: string,
  descripcion: string,
  cantidad: number,
  precio: number
}
interface IPagoDTO{
  id: number,
  valor: number,
  fechaVencimiento: string
}

interface ICrearClienteSiigo{
  tipoCliente: string,
  tipoPersona: string,
  tipoIdentificacion: string,
  identificacion: string,
  nombres: string[],
  codigosFiscal: string[],
  direccion: string,
  codigoPais: string,
  codigoDepartamento: string,
  codigoCiudad: string,
  telefonoIndicativo: string,
  telefonoNumero: string,
  telefonoExtension: string,
  contactoNombre: string,
  contactoApellido: string,
  contactoEmail: string
}

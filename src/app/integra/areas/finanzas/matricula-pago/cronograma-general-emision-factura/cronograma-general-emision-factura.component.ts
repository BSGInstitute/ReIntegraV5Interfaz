import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { Component, type OnInit, type TemplateRef, ViewChild } from "@angular/core"
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { constApiFinanzas } from "@environments/constApi"
import { FinanzasServiceService } from '@finanzas/services/finanzas-service.service';
import { HttpClient } from '@angular/common/http';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { datePipeTransform } from "@shared/functions/date-pipe"
import { AlertaService } from '@shared/services/alerta.service';
import { IntegraService } from '@shared/services/integra.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: "app-cronograma-general-emision-factura",
  templateUrl: "./cronograma-general-emision-factura.component.html",
  styleUrls: ["./cronograma-general-emision-factura.component.scss"],
})
export class CronogramaGeneralEmisionFacturaComponent implements OnInit {
  @ViewChild("modalFactura") modalFactura!: TemplateRef<any>
  @ViewChild("modalDetallesFactura") modalDetallesFactura!: TemplateRef<any>
  @ViewChild("modalFacturacionMasiva") modalFacturacionMasiva!: TemplateRef<any>
  @ViewChild("modalConfirmacionMasiva") modalConfirmacionMasiva!: TemplateRef<any>
  @ViewChild("modalFacturaGlobal") modalFacturaGlobal!: TemplateRef<any>
  @ViewChild("modalResultadoFactura") modalResultadoFactura!: TemplateRef<any>
  @ViewChild("modalNuevoCliente") modalNuevoCliente!: TemplateRef<any>
  @ViewChild("modalEditarCliente") modalEditarCliente!: TemplateRef<any>
  @ViewChild('modalCrearFactSiigo') modalCrearFactSiigo: any;
  @ViewChild("modalFacturacionMasivaSiigo") modalFacturacionMasivaSiigo!: TemplateRef<any>
  // Variables existentes

  filtrarMoneda = true
  paisMatricula: number
  codigoDepartamento: number
  codigoCiudad: number
  customers: any[] = []
  montoTipoCambioPesoColombiano: number
  dialogRef: any
  idCronogramaPagoDetalleFinal: number
  nombreCentroCosto: string
  paisesPorMatricula: { [codigoMatricula: string]: number } = {}
  expandedRowCodigo: string | null = null
  estudiantesConfiguradosCompletos: any[] = [];
  // Variables para facturación
  facturasPendientes: any[] = [];
  paises: string[] = ['Colombia', 'México'];
  paisSeleccionado: string = '';


  estudiantesOriginal: any[] = [];

loader = false;

  estudianteSeleccionado: any
  tipoFactura: "normal" | "global" = "normal"
  formDetallesFactura: FormGroup
  listaPrograma:any[]=[]
  listaAlumno:any[]=[]
  formMatricula = this.formBuilder.group({
    codigoMat: null,
    alumno:null,
    idPrograma:null
  })
  //lista
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

  // Metodo para formatear input en mayúsculas y sin tildes
  formatInput(event: Event, form: FormGroup, controlName: string): void {
    const input = event.target as HTMLInputElement;
    let value = input.value || '';

    const accentMap: { [key: string]: string } = {
      'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
      'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
      'ü': 'u', 'Ü': 'U'
    };
    let processedValue = '';
    for (const char of value) {
      processedValue += accentMap[char] || char;
    }

    processedValue = processedValue.toUpperCase();

    form.get(controlName)?.setValue(processedValue, { emitEvent: false });
    input.value = processedValue;
  }

  // Metodo para eliminar los espacios antes, después y mas de 2 en medio del contenido
  eliminarEspaciosFormulario(formulario: any): any {
    if (Array.isArray(formulario)) {
      return formulario.map(item => this.eliminarEspaciosFormulario(item)); 
    } else if (formulario !== null && typeof formulario === 'object') {
      const resultado: Record<string, any> = {}; 
      for (const clave in formulario) {
        if (formulario.hasOwnProperty(clave)) {
          resultado[clave] = typeof formulario[clave] === 'string'
            ? formulario[clave].trim().replace(/\s+/g, ' ') // Elimina los espacios antes y después, y reemplaza los múltiples espacios por uno solo
            : this.eliminarEspaciosFormulario(formulario[clave]); 
        }
      }
      return resultado;
    }
    return formulario;
  }

  //real
  formCrearFacturaFacturama = this.formBuilder.group({
    // Datos generales
    CfdiType: ['I', Validators.required],
    PaymentForm: ['', Validators.required],
    PaymentMethod: ['', Validators.required],
    ExpeditionPlace: ['', Validators.required],
    Date: ['', Validators.required],

    // GlobalInformation
    // Periodicity: ['', Validators.required],
    // Months: ['', Validators.required],
    // Year: ['', ValF
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
    State: ['CDMX', Validators.required],
    Country: ['MEX', Validators.required],
    ZipCode: ['', Validators.required],

    // RFC del cliente (en caso de ser distinto al RFC del receptor)
    clientRfc: ['', Validators.required],

    // Detalle del producto (Items)
    ProductCode: ['', Validators.required],
    Description: ['', Validators.required],
    UnitCode: ['', Validators.required],
    Quantity: [1, Validators.required],
    UnitPrice: [0, Validators.required],
    Subtotal: [0, Validators.required],
    TaxObject: ['01', Validators.required],
    productoSeleccionado: [''],

    // Impuestos (Taxes)
    // TaxName: ['', Validators.required],
    // Base: [0, Validators.required],
    // Rate: [0, Validators.required],
    // IsRetention: [false],
    taxTotal: [0, Validators.required],

    // Total del producto
    ItemTotal: [0, Validators.required],
  });

  formFacturaGlobal = this.formBuilder.group({
    // Datos generales
    CfdiType: ['I', Validators.required],
    PaymentForm: ['', Validators.required],
    PaymentMethod: ['', Validators.required],
    ExpeditionPlace: ['', Validators.required],
    Date: ['', Validators.required],

    Periodicity: ['', Validators.required],
    Months: ['', Validators.required],
    Year: [new Date().getFullYear(), Validators.required],

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
    clientRfc: ['', Validators.required],

    // Detalle del producto (Items)
    ProductCode: ['', Validators.required],
    Description: ['', Validators.required],
    UnitCode: ['', Validators.required],
    Quantity: [1, Validators.required],
    UnitPrice: [0, Validators.required],
    Subtotal: [0, Validators.required],
    TaxObject: ['01', Validators.required],
    productoSeleccionado: [''],


    taxTotal: [0, Validators.required],

    // Total del producto
    ItemTotal: [0, Validators.required],
  });






  // Variables para facturación masiva
  estudiantesSeleccionadosMasivos: string[] = []
  procesandoMasivo = false
  progresoMasivo = 0
  lotes: any[][] = []
  loteActual = 0
  sesionActiva = false
  resultadosMasivos: { [key: string]: "pendiente" | "exito" | "error" } = {}
  estudiantesConfigurados: any[] = []

  // Variables existentes
  listaFacturmaRegimenFiscal: any[] = [];
  listaFacturmaUsoCfdi: any[] = [];
  listaFacturamaFormaPago: any[] = [];

  listaPeriodicidad = [
    { clave: '01', nombre: 'Diario' },
    { clave: '02', nombre: 'Semanal' },
    { clave: '03', nombre: 'Quincenal' },
    { clave: '04', nombre: 'Mensual' },
    { clave: '05', nombre: 'Bimestral' },
  ];

  listaMeses = [
    { clave: '01', nombre: 'Enero' },
    { clave: '02', nombre: 'Febrero' },
    { clave: '03', nombre: 'Marzo' },
    { clave: '04', nombre: 'Abril' },
    { clave: '05', nombre: 'Mayo' },
    { clave: '06', nombre: 'Junio' },
    { clave: '07', nombre: 'Julio' },
    { clave: '08', nombre: 'Agosto' },
    { clave: '09', nombre: 'Septiembre' },
    { clave: '10', nombre: 'Octubre' },
    { clave: '11', nombre: 'Noviembre' },
    { clave: '12', nombre: 'Diciembre' },
  ];

  listaFechasdeEmision: { value: string, label: string }[] = [];

  dataDepartamentos: any[];
  dataCiudades: any[];

  listaFormaPago: any[] = []
  listaCuenta: any[] = []
  listaDocumentoPago: any[] = []
  dataPeriodo: any[] = []
  dataCodigoMatricula: any[] = []

  dataCentroCosto: any[] = []
  sourceFiltros: any
  alumnos: any[] = []
  listaGrilla: any = []
  listacambiosorden: any[] = []
  listaCronogramaOriginal: any[] = []
  listaCronogramaActual: any[] = []
  cronogramaActual: any
  listaCronogramaEditable: any[] = []
  valorReal = 0
  PagoMaximoSolesDolares = 0

  fun1 = true
  fun2 = true
  fun3 = true
  loaderGeneral = false
  flagSinAprobar = false

  formFiltro: FormGroup = this.formBuilder.group({
    fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    fechaFin: new Date(),
    codigoMatricula: [null],
    idCodigoPais: [null],

  })
  currentYear = new Date().getFullYear();
  loading = false
  cronogramasPorAlumno: { [codigoMatricula: string]: any[] } = {}
  loadingDetalle: { [codigoMatricula: string]: boolean } = {}
  gridPageStatePorAlumno: { [codigoMatricula: string]: { skip: number; take: number } } = {}

  // Variables para el modal de factura global
 // formFacturaGlobal: FormGroup
  mostrarOpcionesAdicionales = false
  productosAgregados: any[] = []
  subtotalGeneral = 0
  totalGeneral = 0

  // Variables para el resultado de la factura
  emitiendo = false
  resultadoFactura: any = null
  errorFactura: string = null
    // Agregar nuevas propiedades para el formulario de cliente
    formCliente: FormGroup
    clienteSeleccionado: any = null
    mostrarDatosOpcionales = false

///siigo


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

  dataTipoCliente: any[] = [
    {id: "Customer", nombre: "Cliente"}
  ]
  dataTipoDocumento: any[] = [
    {id: 77639, nombre: "Factura electrónica de venta"}
  ]
  dataMedioPago: any[] = [
    {id: 10859, nombre: "Ventas clientes Openpay colombia"},
    {id: 10849, nombre: "Ventas clientes Payu"},
    {id: 10840, nombre: "Clientes Bancolombia"},
  ]
  dataTipoIdentificacion: any[] = [
    {id: "13", nombre: "Cédula"}
  ]
  dataTipoPersona: any[] = [
    {id: "Person", nombre: "Persona"}
  ]
  dataPais: any[] = [
    {id: "CO", nombre: "Colombia"}
  ]
loaderCrearFactSiigo: boolean =false
modalRefCrearFactSiigo: any;
idVendedor: number = 35943;


  constructor(
    private integraService: IntegraService,
    private formBuilder: FormBuilder,
    private alertaService: AlertaService,
    private modalService: NgbModal,
    public finanzasService: FinanzasServiceService,
    public dialog: MatDialog,
    private http: HttpClient,
  ) {

  }


  ngOnInit(): void {
    // Cargar datos iniciales
    this.inicializarFormularios()
    this.inicializarFormularioCliente()
    this.obtenerListaFormaPagoFacturama()
    this.obtenerListaRegimenFiscalFacturama()
    this.obtenerListaUsoCfdiFacturama()
    this.ObtenerListaCiudades()
    this.ObtenerListaCiudades()
    this.ReplicarValorTotalPrecio()
  }

  generarFechasDeEmision() {
    const today = new Date();
    const oneHourBefore = new Date(today);
    oneHourBefore.setHours(today.getHours() - 1);

    const oneDayBefore = new Date(today);
    oneDayBefore.setDate(today.getDate() - 1);

    const twoDaysBefore = new Date(today);
    twoDaysBefore.setDate(today.getDate() - 2);

    this.listaFechasdeEmision = [
      { value: oneHourBefore.toISOString(), label: 'Fecha actual' },
      { value: oneDayBefore.toISOString(), label: '1 día antes' },
      { value: twoDaysBefore.toISOString(), label: '2 días antes' }
    ];
  }

  
  inicializarFormularios(): void {
    this.formFiltro = this.formBuilder.group({
      fechaInicio: [null],
      fechaFin: [null],
      codigoMatricula: [null],
      idCodigoPais: [null],
     // centroCosto: ["<Todos>"],

    })
  }

  seleccionarEstudiante(estudiante: any): void {
    this.estudianteSeleccionado = estudiante
  }

  // Actualizar lista de estudiantes configurados
  private actualizarEstudiantesConfigurados(): void {
    this.estudiantesConfigurados = this.listaGrilla.filter(
      (e: { configuradoParaFactura: boolean }) => e.configuradoParaFactura,
    )
  }

  // Método existente
  obtenerGrilaCronogramaGeneralFactura() {
     this.loader = true;
    const filtro = this.formFiltro.value

    const payload = {
      FechaInicio: datePipeTransform(filtro.fechaInicio, "yyyy-MM-ddT00:00:00"),
      FechaFin: datePipeTransform(filtro.fechaFin, "yyyy-MM-ddT23:59:59"),
      CodigoMatricula: filtro.codigoMatricula?.trim() || null,
      IdCodigoPais: filtro.idCodigoPais || null ,

    }

    this.integraService.postJsonResponse(constApiFinanzas.ObtenerResumenMatriculas, JSON.stringify(payload)).subscribe({
      next: (resp: HttpResponse<any>) => {
              this.loader = false;
        console.log(resp.body)
        this.listaGrilla = resp.body
        this.actualizarEstudiantesConfigurados()
         this.loader = false;
      },
      error: (error) => {
         this.loader = false;
        this.alertaService.notificationError(error.message)
      },
    })
  }

  // Método para expandir/colapsar filas
  toggleRow(codigo: string): void {
    if (this.expandedRowCodigo === codigo) {
      this.expandedRowCodigo = null
    } else {
      this.expandedRowCodigo = codigo
      if (!this.cronogramasPorAlumno[codigo]) {
        this.obtenerCronogramaEstudiante(codigo)
      }
    }
  }

  obtenerCronogramaEstudiante(codigo: string): void {
    this.loadingDetalle[codigo] = true

    this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerCronogramaFacturacion}/${codigo}`).subscribe({
      next: (resp: HttpResponse<any>) => {
        this.cronogramasPorAlumno[codigo] = resp.body?.cronogramaPagoDetalleFinal ?? []
        this.gridPageStatePorAlumno[codigo] = { skip: 0, take: 10 } // si estás usando paginación
      },
      error: (err) => {
        this.alertaService.mensajeError(`Error al obtener cronograma: ${err.message}`)
      },
      complete: () => {
        this.loadingDetalle[codigo] = false
      },
    })
  }

  // Método existente
  ObtenerPaisMatricula(codigoMatricula: string, callback: (idPais: number) => void) {
    this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerPaisMatricula}/${codigoMatricula}`).subscribe({
      next: (response: HttpResponse<any>) => {
        const idPais = response.body?.idPais
        this.paisesPorMatricula[codigoMatricula] = idPais
        callback(idPais)
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error, "obtener país de matrícula")
      },
    })
  }


abrirModalFactura(dataItem: any, idCronograma?: number): void {
  console.log('📌 Recibiendo:', dataItem, idCronograma);

  if (!idCronograma) {
    const codigo = dataItem.codigoMatricula;
    const cronograma = this.cronogramasPorAlumno[codigo];
    if (cronograma?.length > 0) {
      idCronograma = cronograma[0].id;
    }
  }

  if (!idCronograma) {
    this.alertaService.mensajeError("No se pudo determinar el ID del cronograma.");
    return;
  }

  this.estudianteSeleccionado = dataItem;
  this.tipoFactura = dataItem.configuradoParaFactura ? dataItem.datosFacturacion.tipoFactura : '';
  this.idCronogramaPagoDetalleFinal = idCronograma;

  this.dialog.open(this.modalFactura, {
    width: '450px',
    panelClass: 'custom-dialog'
  });
}




 setearValoresPorDefectoFacturaGlobal(): void {
  setTimeout(() => {


    this.formFacturaGlobal.patchValue({
      CfdiType: "I",
      PaymentForm: "01",
      PaymentMethod: "PUE",
      ExpeditionPlace: "03800",
      Periodicity: "04",
      Months: (new Date().getMonth() + 1).toString().padStart(2, '0'),
      Year: new Date().getFullYear().toString(),
      Date: this.listaFechasdeEmision[0].value,
      //: "PÚBLICO EN GENERAL",
      ReceiverRfc: "XAXX010101000",
      CfdiUse: "S01",
      FiscalRegime: "616",
      TaxZipCode: "03800",
      Street: "CALLE GENERAL",
      ExteriorNumber: "S/N",
      InteriorNumber: "S/N",
      Neighborhood: "CENTRO",
      Municipality: "CDMX",
      State: "CDMX",
      Country: "MEX",
      ZipCode: "03800",
      clientRfc: "XAXX010101000",
     //productoSeleccionado: "Producto Genérico"

    });
  }, 200);
}


setearValoresPorDefectoFacturaGlobalApi(): void {
  setTimeout(() => {


    this.formFacturaGlobal.patchValue({
      CfdiType: "I",
      PaymentForm: "01",
      PaymentMethod: "PUE",
      ExpeditionPlace: "03800",
      Periodicity: "04",
      Months: (new Date().getMonth() + 1).toString().padStart(2, '0'),
      Year: new Date().getFullYear().toString(),
      Date: this.listaFechasdeEmision[0].value,
      //: "PÚBLICO EN GENERAL",
      ReceiverRfc: "XAXX010101000",
      CfdiUse: "S01",
      FiscalRegime: "616",
      TaxZipCode: "03800",
      // Street: "CALLE GENERAL",
      // ExteriorNumber: "S/N",
      // InteriorNumber: "S/N",
      // Neighborhood: "CENTRO",
      // Municipality: "CDMX",
      State: "CDMX",
      Country: "MEX",
      ZipCode: "03800",
      clientRfc: "XAXX010101000",
     //productoSeleccionado: "Producto Genérico"

    });
  }, 200);
}

  continuarADetallesV1(): void {
    this.dialog.closeAll();
    const codigo = this.estudianteSeleccionado.codigoMatricula;

    if (this.tipoFactura === "global") {
       // ⚙️ Asignar valores por defecto para factura global
       this.productosAgregados = [];
       this.calcularTotalesGenerales();
       this.dialog.open(this.modalFacturaGlobal, {
         width: "90%",
         maxWidth: "1200px",
         disableClose: true,
         panelClass: "factura-global-dialog",
       });

       this.setearValoresPorDefectoFacturaGlobal();




    } else {
      this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerFacturaPorCodigoMatricula}/${codigo}`)
        .subscribe({
          next: (resp: HttpResponse<any>) => {
            const data = resp.body;
            console.log("🔍 Datos recibidos de la BD:", data);

            const cliente = data?.cliente || {};
            const direccion = cliente.address || {};
            const factura = data?.factura || {};

            // Llenar formulario, usando fallback a ''
            this.formCrearFacturaFacturama.patchValue({
              ReceiverRfc: cliente.rfc || '',
              ReceiverName: cliente.name || '',
              Email: cliente.email || '',
              CfdiUse: cliente.cfdiUse || '',
              FiscalRegime: cliente.fiscalRegime || '',
              TaxZipCode: direccion.zipCode || '',
              Street: direccion.street || '',
              ExteriorNumber: direccion.exteriorNumber || '',
              InteriorNumber: direccion.interiorNumber || '',
              Neighborhood: direccion.neighborhood || '',
              Municipality: direccion.municipality || '',
              State: direccion.state || '',
              Country: direccion.country || 'MEX',
              PaymentForm: factura.paymentForm || '',
              PaymentMethod: factura.paymentMethod || '',
              ExpeditionPlace: factura.expeditionPlace || '',
              codigoMat: codigo,
              Date: this.listaFechasdeEmision[0].value,
            });

            // Llenar productos si hay
            this.productosAgregados = (factura.items || []).map((item: any) => ({
              cantidad: item.quantity || 1,
              claveProducto: item.productCode || '',
              claveUnidad: item.unitCode || '',
              unit: item.unit || '',
              descripcion: item.description || '',
              precio: item.unitPrice || 0,
              subtotal: item.subtotal || 0,
              taxObject: item.taxObject || '',
              total: item.total || 0,
              iva: item.taxes?.reduce((sum: number, t: any) => sum + (t.total || 0), 0) || 0
            }));

            this.calcularTotalesGenerales();

            setTimeout(() => {
              this.dialog.open(this.modalDetallesFactura, {
                width: "90%",
                maxWidth: "1200px",
                disableClose: true,
                panelClass: "factura-global-dialog",
              });
            }, 100);
          },
          error: () => {
            this.alertaService.mensajeError("Error al obtener datos de la factura");
          }
        });
    }
  }
  limpiarFormularioFacturaGlobal(): void {
  this.formFacturaGlobal.reset();
  this.formCrearFacturaFacturama.reset();
   // Restaurar solo los campos que me interesa preservar
 const valoresPrevios = {
  State: this.formCrearFacturaFacturama.get('State')?.value,
  Country: this.formCrearFacturaFacturama.get('Country')?.value,
  CfdiType : this.formCrearFacturaFacturama.get('CfdiType ')?.value,
  //Country: this.formCrearFacturaFacturama.get('Country')?.value
};

this.formCrearFacturaFacturama.patchValue({
  State: valoresPrevios.State || 'CDMX',
  Country: valoresPrevios.Country || 'MEX',
  CfdiType : valoresPrevios.State || 'I',

});

}


continuarADetalles(): void {
  this.dialog.closeAll();
  this.limpiarFormularioFacturaGlobal();
  this.generarFechasDeEmision();

  const codigo = this.estudianteSeleccionado.codigoMatricula;
  const idCronograma = this.idCronogramaPagoDetalleFinal;

  console.log("🚀 Continuando con ID Cronograma:", idCronograma);

  if (this.tipoFactura === "global") {
    this.prepararFacturaGlobal();
  //  this.productosAgregados = [];
   // this.calcularTotalesGenerales();
  } else {
    this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerFacturaPorCodigoMatricula}/${codigo}`)
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          const data = resp.body;
          const cliente = data?.cliente;
          const direccion = cliente?.address;
          const factura = data?.factura;
          const idCronogramaSP = data?.idCronogramaPagoDetalleFinal;

          const detalleActual = this.cronogramasPorAlumno[codigo]?.find(d => d.id === idCronograma);
          const mismoCronograma = Number(idCronogramaSP) === Number(idCronograma);

          this.formCrearFacturaFacturama.patchValue({
              Date: this.listaFechasdeEmision[0].value,
            });

          if (cliente && factura) {
            this.formCrearFacturaFacturama.patchValue({
              ReceiverRfc: cliente.rfc || '',
              ReceiverName: cliente.name || '',
              Email: cliente.email || '',
              CfdiUse: cliente.cfdiUse || '',
              FiscalRegime: cliente.fiscalRegime || '',
              TaxZipCode: direccion?.zipCode || '',
              Street: direccion?.street || '',
              ExteriorNumber: direccion?.exteriorNumber || '',
              InteriorNumber: direccion?.interiorNumber || '',
              Neighborhood: direccion?.neighborhood || '',
              Municipality: direccion?.municipality || '',
              State: direccion?.state?.trim() || 'CDMX',
              Country: direccion?.country?.trim() || 'MEX',
              PaymentForm: factura.paymentForm || '',
              PaymentMethod: factura.paymentMethod || '',
              ExpeditionPlace: factura.expeditionPlace || '',
              codigoMat: codigo
            });

            if (factura.items?.length > 0 && detalleActual?.facturamaEnvio === true && mismoCronograma) {
              this.productosAgregados = factura.items.map((item: any) => ({
                cantidad: item.quantity || 1,
                claveProducto: item.productCode || '',
                claveUnidad: item.unitCode || '',
                unit: item.unit || '',
                descripcion: item.description || '',
                precio: item.unitPrice || 0,
                subtotal: item.subtotal || 0,
                taxObject: item.taxObject || '',
                total: item.total || 0,
                iva: item.taxes?.reduce((sum: number, t: any) => sum + (t.total || 0), 0) || 0
              }));
            } else {
              const cuota = parseFloat(detalleActual?.cuota || 0);
              const mora = parseFloat(detalleActual?.mora || 0);
              const suma = cuota + mora;

              const precioUnitario = +(suma / 1.16).toFixed(2);
              const subtotal = +(precioUnitario).toFixed(2);
              const iva = +(subtotal * 0.16).toFixed(2);
              const total = +(subtotal + iva).toFixed(2);

              this.productosAgregados = [{
                cantidad: 1,
                claveProducto: '86111500',
                claveUnidad: 'E48',
                unit: 'Unidad de servicio',
                descripcion: `SERVICIOS EDUCATIVOS - ${cliente.name || ''}`,
                precio: precioUnitario,
                subtotal,
                taxObject: '02',
                total,
                iva,
                identificacionProducto: "PROD" + new Date().getTime(),
                esCalculadoDesdeCronograma: true
              }];
            }

            this.calcularTotalesGenerales();

            setTimeout(() => {
              this.dialog.open(this.modalDetallesFactura, {
                width: "90%",
                maxWidth: "1200px",
                disableClose: true,
                panelClass: "factura-global-dialog",
              });
            }, 100);
          } else {
            const detalle = this.cronogramasPorAlumno[codigo]?.find(d => d.id === idCronograma);
            if (!detalle) {
              this.alertaService.mensajeError("No se encontró un cronograma asociado.");
              return;
            }

            this.ObtenerAlumnoProgramaPorMatricula(codigo, () => {
              const alumno = this.listaPrograma[0];
              if (!alumno) {
                this.alertaService.mensajeError("No se encontraron datos del alumno.");
                return;
              }

              this.nombreCentroCosto = alumno.nombreCentroCosto;

              this.formCrearFacturaFacturama.patchValue({
                ReceiverName: alumno.nombreCompleto,
                Email: alumno.correoAlumno,
                Description: `SERVICIOS EDUCATIVOS - ${alumno.nombreCentroCosto}`,
                codigoMat: codigo
              });

              this.formCrearFacturaFacturama.get("productoSeleccionado")?.setValue("Producto Generico");

              const cuota = parseFloat(detalle?.cuota || 0);
              const mora = parseFloat(detalle?.mora || 0);
              const suma = cuota + mora;
              const precioUnitario = +(suma / 1.16).toFixed(2);
              const subtotal = +(precioUnitario).toFixed(2);
              const iva = +(subtotal * 0.16).toFixed(2);
              const total = +(subtotal + iva).toFixed(2);

              this.productosAgregados = [{
                cantidad: 1,
                claveProducto: '86111500',
                claveUnidad: 'E48',
                unit: 'Unidad de servicio',
                descripcion: `SERVICIOS EDUCATIVOS - ${alumno.nombreCentroCosto}`,
                precio: precioUnitario,
                subtotal,
                taxObject: '02',
                total,
                iva,
                identificacionProducto: "PROD" + new Date().getTime(),
                esCalculadoDesdeCronograma: true
              }];

              this.calcularTotalesGenerales();

              setTimeout(() => {
                this.dialog.open(this.modalDetallesFactura, {
                  width: "90%",
                  maxWidth: "1200px",
                  disableClose: true,
                  panelClass: "factura-global-dialog",
                });
              }, 100);
            });
          }
        },
        error: () => {
          this.alertaService.mensajeError("Error al obtener datos de la factura.");
        }
      });
  }
}

validarYGuardar(): void {
  const id = this.idCronogramaPagoDetalleFinal;
  this.integraService.getJsonResponse(`${constApiFinanzas.ValidarFacturaGuardada}?idCronogramaPagoDetalleFinal=${id}`)
    .subscribe({
      next: (resp: HttpResponse<boolean>) => {
        const existe = resp.body;
        if (existe) {
          Swal.fire("Atención", "Ya existe una factura configurada para este cronograma.", "warning");
        } else {
          this.guardarFacturaInterna();
        }
      },
      error: (err) => {
        this.alertaService.mensajeError("No se pudo validar si ya existe factura: " + err.message);
      }
    });
}



  guardarFacturaInterna(): void {
    const dataFormulario = this.formCrearFacturaFacturama.value;
    const codigo = this.estudianteSeleccionado.codigoMatricula;
    const idCronograma = this.idCronogramaPagoDetalleFinal;

    const datosFormulario = this.eliminarEspaciosFormulario(dataFormulario);

    const jsonGuardar = {
      factura: {
        CfdiType: datosFormulario.CfdiType,
        PaymentForm: datosFormulario.PaymentForm,
        PaymentMethod: datosFormulario.PaymentMethod,
        Currency: "MXN",
        Date: datosFormulario.Date,
        ExpeditionPlace: datosFormulario.ExpeditionPlace || '',
        Receiver: {
          Name: datosFormulario.ReceiverName,
          Rfc: datosFormulario.ReceiverRfc,
          CfdiUse: datosFormulario.CfdiUse,
          FiscalRegime: datosFormulario.FiscalRegime,
          TaxZipCode: datosFormulario.TaxZipCode
        },
        Items: this.productosAgregados.map(producto => {
          const cantidad = producto.cantidad || 1;
          const precioUnitario = producto.precio || 0;
          const subtotal = cantidad * precioUnitario;
          const ivaTotal = subtotal * 0.16;
          const totalFinal = subtotal + ivaTotal;

          return {
            Quantity: cantidad,
            ProductCode: producto.claveProducto || '86111500',
            UnitCode: producto.claveUnidad || 'E48',
            Unit: producto.unit || 'Unidad de servicio',
            Description: producto.descripcion || 'Producto Genérico',
            IdentificationNumber: producto.identificacionProducto || '',
            UnitPrice: precioUnitario,
            Subtotal: subtotal,
            TaxObject: producto.taxObject || '02',
            Taxes: [{
              Name: "IVA",
              Rate: 0.16,
              Total: ivaTotal,
              Base: subtotal,
              IsRetention: false,
              IsFederalTax: true
            }],
            Total: totalFinal
          };
        })
      },
      cliente: {
        Rfc: datosFormulario.ReceiverRfc || '',
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

    // this.integraService.postJsonResponse(`${constApiFinanzas.GuardarFacturaInterna}?codigoMatricula=${codigo}`, jsonGuardar)
    this.integraService.postJsonResponse(
  `${constApiFinanzas.GuardarFacturaInterna}?codigoMatricula=${codigo}&idCronogramaPagoDetalleFinal=${idCronograma}`,
  jsonGuardar
)  .subscribe({
        next: () => {
          Swal.fire("¡Guardado!", "Los datos fueron almacenados correctamente.", "success");
         this.cerrarModalDetalles();

        },
        error: (err) => {
          this.alertaService.mensajeError("Error al guardar los datos internos: " + err.message);
        }
      });
  }

prepararFacturaGlobal(): void {
  this.limpiarFormularioFacturaGlobal();
  const codigo = this.estudianteSeleccionado.codigoMatricula;
  const idCronograma = this.idCronogramaPagoDetalleFinal;
  const detalle = this.cronogramasPorAlumno[codigo]?.find(d => d.id === idCronograma);

  if (!detalle) {
    this.alertaService.mensajeError("No se encontró cronograma para esta matrícula.");
    return;
  }

  // 1. Obtener posibles datos guardados (solo algunos campos)
  this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerFacturaPorCodigoMatricula}/${codigo}`)
    .subscribe({
      next: (resp: HttpResponse<any>) => {
        const data = resp.body;
        const direccion = data?.cliente?.address;

        // 2. Si hay dirección, setear solo los 5 campos permitidos
        if (direccion) {
          this.formFacturaGlobal.patchValue({
            Street: direccion.street || 'CALLE GENERAL',
            ExteriorNumber: direccion.exteriorNumber || 'S/N',
            InteriorNumber: direccion.interiorNumber || 'S/N',
            Neighborhood: direccion.neighborhood || 'CENTRO',
            Municipality: direccion.municipality || 'CDMX'
          });
        }

        // 3. Setear SIEMPRE los valores por defecto para el resto
        this.setearValoresPorDefectoFacturaGlobalApi();

        // 4. Luego obtener los datos del alumno + calcular producto
        this.ObtenerAlumnoProgramaPorMatricula(codigo, () => {
          const alumno = this.listaPrograma[0];
          if (!alumno) {
            this.alertaService.mensajeError("No se encontraron datos del alumno.");
            return;
          }

          this.nombreCentroCosto = alumno.nombreCentroCosto;

          this.formFacturaGlobal.patchValue({
            ReceiverName: alumno.nombreCompleto,
            Email: alumno.correoAlumno,
            Description: `SERVICIOS EDUCATIVOS - ${alumno.nombreCentroCosto}`,
            productoSeleccionado: "Producto Generico"
          });

          const cuota = parseFloat(detalle?.cuota || 0);
          const mora = parseFloat(detalle?.mora || 0);
          const suma = cuota + mora;
          const precioUnitario = +(suma / 1.16).toFixed(2);
          const subtotal = +(precioUnitario).toFixed(2);
          const iva = +(subtotal * 0.16).toFixed(2);
          const total = +(subtotal + iva).toFixed(2);

          this.productosAgregados = [{
            cantidad: 1,
            claveProducto: '86111500',
            claveUnidad: 'E48',
            unit: 'Unidad de servicio',
            descripcion: `SERVICIOS EDUCATIVOS - ${alumno.nombreCentroCosto}`,
            precio: precioUnitario,
            subtotal,
            taxObject: '02',
            total,
            iva,
            identificacionProducto: "PROD" + new Date().getTime(),
            esCalculadoDesdeCronograma: true
          }];

          this.calcularTotalesGenerales();

          this.dialog.open(this.modalFacturaGlobal, {
            width: "90%",
            maxWidth: "1200px",
            disableClose: true,
            panelClass: "factura-global-dialog"
          });
        });
      },
      error: () => {
        // Si falló la consulta → setear valores por defecto y continuar igual
        this.setearValoresPorDefectoFacturaGlobal();

        this.ObtenerAlumnoProgramaPorMatricula(codigo, () => {
          const alumno = this.listaPrograma[0];
          if (!alumno) {
            this.alertaService.mensajeError("No se encontraron datos del alumno.");
            return;
          }

          this.nombreCentroCosto = alumno.nombreCentroCosto;

          this.formFacturaGlobal.patchValue({
            ReceiverName: alumno.nombreCompleto,
            Email: alumno.correoAlumno,
            Description: `SERVICIOS EDUCATIVOS - ${alumno.nombreCentroCosto}`,
            productoSeleccionado: "Producto Generico"
          });

          const cuota = parseFloat(detalle?.cuota || 0);
          const mora = parseFloat(detalle?.mora || 0);
          const suma = cuota + mora;
          const precioUnitario = +(suma / 1.16).toFixed(2);
          const subtotal = +(precioUnitario).toFixed(2);
          const iva = +(subtotal * 0.16).toFixed(2);
          const total = +(subtotal + iva).toFixed(2);

          this.productosAgregados = [{
            cantidad: 1,
            claveProducto: '86111500',
            claveUnidad: 'E48',
            unit: 'Unidad de servicio',
            descripcion: `SERVICIOS EDUCATIVOS - ${alumno.nombreCentroCosto}`,
            precio: precioUnitario,
            subtotal,
            taxObject: '02',
            total,
            iva,
            identificacionProducto: "PROD" + new Date().getTime(),
            esCalculadoDesdeCronograma: true
          }];

          this.calcularTotalesGenerales();

          this.dialog.open(this.modalFacturaGlobal, {
            width: "90%",
            maxWidth: "1200px",
            disableClose: true,
            panelClass: "factura-global-dialog"
          });
        });
      }
    });
}



  // Método para cerrar modal de factura
  cerrarModalFactura(): void {
    this.dialog.closeAll()
  }

  // Método para cerrar modal de detalles
  cerrarModalDetalles(): void {
    this.dialog.closeAll()
  }


  // Método para abrir modal de facturación masiva
  abrirModalFacturacionMasiva(): void {
    this.obtenerFacturasPendientesEnvio(); // ← Esta función ya está perfecta
    this.dialog.open(this.modalFacturacionMasiva, {
      width: "1100px",
    });
  }

    abrirModalFacturacionMasivaSiigo(): void {
    this.btenerFacturasPendientesEnvioSiigo(); // ← Esta función ya está perfecta
    this.dialog.open(this.modalFacturacionMasivaSiigo, {
      width: "1100px",
    });
  }


  emitirFactura(): void {
  if (this.formCrearFacturaFacturama.invalid) {
    this.formCrearFacturaFacturama.markAllAsTouched();
    return;
  }

  if (this.productosAgregados.length === 0) {
    this.alertaService.mensajeError("Debe agregar al menos un producto a la factura");
    return;
  }

  // Guardar configuración
  this.estudianteSeleccionado.configuradoParaFactura = true;
  this.estudianteSeleccionado.datosFacturacion = {
    tipoFactura: this.tipoFactura,
    rfc: this.formCrearFacturaFacturama.get("ReceiverRfc").value,
    razonSocial: this.formCrearFacturaFacturama.get("ReceiverName").value,
    regimenFiscal: this.formCrearFacturaFacturama.get("FiscalRegime").value,
    usoCFDI: this.formCrearFacturaFacturama.get("CfdiUse").value,
    metodoPago: this.formCrearFacturaFacturama.get("PaymentMethod").value,
    formaPago: this.formCrearFacturaFacturama.get("PaymentForm").value,
    Street: this.formCrearFacturaFacturama.get("Street").value,
    ExteriorNumber: this.formCrearFacturaFacturama.get("ExteriorNumber").value,
    InteriorNumber: this.formCrearFacturaFacturama.get("InteriorNumber").value,
    Neighborhood: this.formCrearFacturaFacturama.get("Neighborhood").value,
    Municipality: this.formCrearFacturaFacturama.get("Municipality").value,
    State: this.formCrearFacturaFacturama.get("State").value,
    Country: this.formCrearFacturaFacturama.get("Country").value
  };

  // Actualizar lista de configurados
  this.actualizarEstudiantesConfigurados();

  // Llamar a la función de envío
  this.EnviarFacturaYCliente();
}



toggleSeleccionIndividual(id: string, checked: boolean): void {
  if (checked) {
    if (!this.estudiantesSeleccionadosMasivos.includes(id)) {
      this.estudiantesSeleccionadosMasivos.push(id);
    }
  } else {
    this.estudiantesSeleccionadosMasivos = this.estudiantesSeleccionadosMasivos.filter(val => val !== id);
  }
}


filtrarPorPais(pais: string) {
  this.paisSeleccionado = pais;

  const paisCodigo = pais === 'México' ? 'MEX' :
                     pais === 'Colombia' ? 'CO' : '';

  this.estudiantesSeleccionadosMasivos = [];

  let listaFiltrada = paisCodigo === ''
    ? this.estudiantesOriginal
    : this.estudiantesOriginal.filter(est => est.pais === paisCodigo);

  this.estudiantesConfigurados = listaFiltrada.map(f => ({
    codigoMatricula: f.codigoMatricula,
    alumno: f.nombre,
    nombrePais: f.pais,
    idCliente: f.idCliente,
    api: f.apiDestino,
    datosFacturacion: {
      tipoFactura: 'normal',
      rfc: f.identificador
    },
    monto: f.monto,
    configuradoParaFactura: true
  }));
}
obtenerFacturasPendientesEnvio(): void {
  this.integraService.getJsonResponse(`${constApiFinanzas.ListarPendientesEnvio}`).subscribe({
    next: (resp: HttpResponse<any>) => {
      this.facturasPendientes = resp.body || [];
      this.estudiantesOriginal = [...this.facturasPendientes];
      this.filtrarPorPais(this.paisSeleccionado);
    },
    error: (error) => {
      this.alertaService.mensajeError("Error al obtener facturas pendientes: " + error.message);
    }
  });
}



btenerFacturasPendientesEnvioSiigo(): void {
  this.integraService.getJsonResponse(`${constApiFinanzas.ListarPendientesEnvioSiigo}`).subscribe({
    next: (resp: HttpResponse<any>) => {
      this.facturasPendientes = resp.body || [];
      this.estudiantesOriginal = [...this.facturasPendientes];
      this.filtrarPorPais(this.paisSeleccionado);
    },
    error: (error) => {
      this.alertaService.mensajeError("Error al obtener facturas pendientes: " + error.message);
    }
  });
}




toggleSeleccionarTodos(checked: boolean): void {
  if (checked) {
    this.estudiantesSeleccionadosMasivos = this.estudiantesConfigurados.map((item, index) =>
      item.codigoMatricula + '_' + index
    );
  } else {
    this.estudiantesSeleccionadosMasivos = [];
  }
}


  cerrarModalFacturacionMasiva(): void {
    this.dialog.closeAll()
  }


  cerrarModalFacturacionMasivaSiigo(): void {
    this.dialog.closeAll()
  }
  // Método para emitir facturas masivas
  emitirFacturasMasivas(): void {
    if (this.estudiantesSeleccionadosMasivos.length === 0) return;
this.loader= true;
    const usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
    const usuario = usuarioData.userName;


const idsFacturas = this.estudiantesSeleccionadosMasivos
  .map(compuesto => {
    const [codigo, index] = compuesto.split('_');
    return this.facturasPendientes.find(f =>
      f.codigoMatricula === codigo &&
      this.facturasPendientes.indexOf(f) === parseInt(index, 10)
    )?.idFactura;
  })
  .filter(id => !!id);

  const payload = {
    idsFacturas,
    usuario
  };

    this.integraService.postJsonResponse(`${constApiFinanzas.EnviarFacturasMasivasLote}`, payload).subscribe({
      next: () => {
        this.alertaService.mensajeExitoso("Facturación masiva iniciada correctamente.");
         this.loader = false;
        this.cerrarModalFacturacionMasiva();
        this.obtenerFacturasPendientesEnvio();

      },
      error: (error) => {
         this.loader = false;
        console.error("❌ Error al enviar facturas masivas:", error);
        this.alertaService.mensajeError("Error al enviar facturas masivas: " + error.message);
      }
    });
  }

obtenerIdCodigoPais(pais: string): number | null {
  switch (pais) {
    case "Mexico": return 52;
    case "Colombia": return 57;
    case "Peru": return 51;
    default: return null;
  }
}

  // Método para buscar
  buscar(): void {
     this.loader = true
    // Implementar lógica de búsqueda
    console.log("Buscando con fechas:", this.formFiltro.value.fechaInicio, this.formFiltro.value.fechaFin)
    this.obtenerGrilaCronogramaGeneralFactura()
  }

  // Método para formatear forma de pago
  ObtenerDatosPago() {
    // Obtiene los combos de FormaPago,Documento,Cuenta para los pagos
    this.integraService.postJsonResponse(`${constApiFinanzas.ObtenerDatosPago}`, null).subscribe({
      next: (response: HttpResponse<any>) => {
        this.listaFormaPago = response.body.listaFormaPago
        this.listaCuenta = response.body.listadoCuentasCorrientesFinal
        this.listaDocumentoPago = response.body.listaDocumentoPago
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error, "MODAL - Combo datos pagos")
      },
      complete: () => {},
    })
  }

  formaPagoTemplate(idFormaPago: any): string {
    const id = Number.parseInt(idFormaPago) // Asegura que se compara como número
    const item = this.listaFormaPago.find((e: any) => e.id === id)
    return item?.descripcion ?? "Sin descripción"
  }

  obtenerChecked(event: Event): boolean {
    return (event.target as HTMLInputElement).checked
  }

  getCheckedValue(event: Event): boolean {
    return (event.target as HTMLInputElement).checked
  }

  getControl(nombre: string): FormControl {
    return this.formFiltro.get(nombre) as FormControl
  }

  abrirModalFacturaGlobal(): void {
    const dialogRef = this.dialog.open(this.modalFacturaGlobal, {
      width: "90%",
      maxWidth: "1200px",
      disableClose: true,
      panelClass: "factura-global-dialog",
    })
  }

  cerrarModalFacturaGlobal(): void {
    this.dialog.closeAll()
  }

  toggleOpcionesAdicionales(): void {
    this.mostrarOpcionesAdicionales = !this.mostrarOpcionesAdicionales
  }
  onProductoSeleccionado(): void {
    const formularioActual = this.tipoFactura === 'global' ? this.formFacturaGlobal : this.formCrearFacturaFacturama;
    //const productoSeleccionado = formularioActual.get("productoSeleccionado")?.value;

    console.log("Producto seleccionado:", formularioActual.get("productoSeleccionado")?.value);
  }



  agregarProducto(): void {
  const formularioActual = this.tipoFactura === 'global'
    ? this.formFacturaGlobal
    : this.formCrearFacturaFacturama;

  const productoSeleccionado = formularioActual.get("productoSeleccionado")?.value;
  if (!productoSeleccionado) {
    this.alertaService.mensajeError("Debe seleccionar un producto");
    return;
  }

  const codigo = this.estudianteSeleccionado.codigoMatricula;
  const cronograma = this.cronogramasPorAlumno[codigo] || [];
  const detalle = cronograma.find(d => d.id === this.idCronogramaPagoDetalleFinal);

  let precioUnitario = 0;
  if (detalle) {
    const cuota = parseFloat(detalle.cuota || 0);
    const mora = parseFloat(detalle.mora || 0);
    const suma = cuota + mora;
    precioUnitario = +(suma / 1.16).toFixed(2);
  }

  const cantidad = 1;
  const subtotal = +(cantidad * precioUnitario).toFixed(2);
  const iva = +(subtotal * 0.16).toFixed(2);
  const total = +(subtotal + iva).toFixed(2);

  const nuevoProducto = {
    cantidad,
    claveProducto: '86111500',
    claveUnidad: 'E48',
    unit: 'Unidad de servicio',
    descripcion: productoSeleccionado,
    descripcionAdicional: '',
    precio: precioUnitario,
    subtotal,
    tipoDescuento: "-",
    valorDescuento: 0,
    taxObject: '02',
    total,
    iva,
    esGenerico: productoSeleccionado === 'Producto Generico',
    identificacionProducto: "PROD" + new Date().getTime(),
    esCalculadoDesdeCronograma: true
  };

  this.productosAgregados.push(nuevoProducto);
  this.calcularTotalesGenerales();
  formularioActual.get("productoSeleccionado")?.setValue("");
}



  calcularTotales(index: number): void {
    const producto = this.productosAgregados[index];
    const cantidad = producto.cantidad || 0;


    const precioOriginal = producto.precio || 0;
    const precioSinIgv = producto.esCalculadoDesdeCronograma
  ? precioOriginal
  : +(precioOriginal / 1.16).toFixed(4);

    producto.precio = precioSinIgv;

  // Solo reasignar si no viene del cronograma
  if (!producto.esCalculadoDesdeCronograma) {
    producto.precio = precioSinIgv;
  }
    // Subtotal sin impuestos
    producto.subtotal = +(cantidad * precioSinIgv).toFixed(2);

    // Descuento
    let total = producto.subtotal;
    if (producto.tipoDescuento === "%") {
      total -= (producto.subtotal * producto.valorDescuento) / 100;
    } else if (producto.tipoDescuento === "$") {
      total -= producto.valorDescuento;
    }

    // IVA
    let iva = 0;
    if (producto.taxObject === '02') {
      iva = +(total * 0.16).toFixed(2);
    }

    producto.iva = iva;
    producto.total = +(total + iva).toFixed(2);

    this.calcularTotalesGenerales();
  }


  editarProducto(index: number): void {
    console.log("Editando producto en índice:", index)
    // Aquí iría la lógica para editar un producto
  }
  eliminarProducto(index: number): void {
    this.productosAgregados.splice(index, 1);
    this.calcularTotalesGenerales();
  }

  calcularTotalesGenerales(): void {
    this.subtotalGeneral = this.productosAgregados.reduce((acc, p) => acc + (p.subtotal || 0), 0);
    this.totalGeneral = this.productosAgregados.reduce((acc, p) => acc + (p.total || 0), 0);
  }

  vistaPrevia(): void {
    console.log("Generando vista previa de la factura")

  }

  crearFactura(): void {
    console.log("Creando factura con datos:", {
      datosFactura: this.formFacturaGlobal.value,
      productos: this.productosAgregados,
      totales: {
        subtotal: this.subtotalGeneral,
        total: this.totalGeneral,
      },
    })


    this.dialog.closeAll()
  }

  // Método para emitir factura global con Facturama
  emitirFacturaGlobal(): void {
    this.emitiendo = true
    this.resultadoFactura = null
    this.errorFactura = null

    // Preparar el JSON para Facturama
    const facturaData = {
      NameId: 34,
      Date: "2025-04-24T16:00:00",
      Serie: 'null',
      Folio: "G002",
      ExpeditionPlace: "01000",
      Exportation: "01",
      CfdiType: "I",
      PaymentForm: "01",
      PaymentMethod: "PUE",
      Currency: "MXN",
      GlobalInformation: {
        Periodicity: "01",
        Months: "04",
        Year: 2025,
      },
      Receiver: {
        Rfc: "XAXX010101000",
        Name: "PÚBLICO EN GENERAL",
        CfdiUse: "S01",
        FiscalRegime: "616",
        TaxZipCode: "01000",
      },
      Items: [
        {
          ProductCode: "01010101",
          IdentificationNumber: "VENTA20250424",
          Description: "Venta diaria al público general prueba 2",
          Unit: "PIEZA",
          UnitCode: "H87",
          Quantity: 1,
          UnitPrice: 300.0,
          Subtotal: 300.0,
          TaxObject: "02",
          Taxes: [
            {
              Name: "IVA",
              Base: 300.0,
              Rate: 0.16,
              Total: 48.0,
              IsRetention: false,
              IsFederalTax: true,
            },
          ],
          Total: 348.0,
        },
      ],
    }

  const httpOptions = {
    headers: new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Basic " + btoa("tu_usuario:tu_contraseña")
    })
  };

  this.http.post("https://api.facturama.mx/3/cfdis", facturaData, httpOptions).subscribe(
    (response: any) => {
      this.emitiendo = false;
      this.resultadoFactura = response;
      this.mostrarResultadoFactura();
    },
    (error) => {
      this.emitiendo = false;
      this.errorFactura = error.message || "Error al emitir la factura";
      this.mostrarResultadoFactura();
    }
  );
}
formatearFechaFactura(): string {
  const fecha = this.resultadoFactura?.date ? new Date(this.resultadoFactura.date) : new Date();
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(fecha);
}



  mostrarResultadoFactura(): void {
    const dialogRef = this.dialog.open(this.modalResultadoFactura, {
      width: "500px",
      disableClose: false,
    })
  }

  cerrarModalResultado(): void {
    this.dialog.closeAll()
  }

  descargarFactura(): void {
    if (this.resultadoFactura && this.resultadoFactura.id) {
      window.open(`https://api.facturama.mx/Cfdi?id=${this.resultadoFactura.id}&format=pdf`, "_blank")
    }
  }


  // Agregar esta función después de inicializarFormularios()
  inicializarFormularioCliente(): void {
    this.formCliente = this.formBuilder.group({
      nombreRazonSocial: ["", Validators.required],
      rfc: ["", [Validators.required, Validators.minLength(12), Validators.maxLength(13)]],
      usoCfdi: ["", Validators.required],
      regimenFiscal: ["", Validators.required],
      email: ["", [Validators.email]],
      emailOpcional1: ["", [Validators.email]],
      emailOpcional2: ["", [Validators.email]],
      codigoPostal: ["", [Validators.pattern(/^\d{5}$/)]],
       // Campos opcionales adicionales
       calle: [""],
       noExterior: [""],
       noInterior: [""],
       colonia: [""],
       localidad: [""],
       municipio: [""],
       estado: [""],
       pais: ["MEXICO"],
    })
  }

  // Agregar estas funciones para manejar los modales de cliente
  abrirModalNuevoCliente(): void {
    this.formCliente.reset()
    this.formCliente.patchValue({
      pais: "MEXICO",
    })
    this.mostrarDatosOpcionales = false
    this.dialog.open(this.modalNuevoCliente, {
      width: "600px",
      disableClose: true,
      panelClass: "cliente-dialog",
      autoFocus: false,
    })
  }

  abrirModalEditarCliente(): void {
    // Obtener el cliente seleccionado del dropdown
    const clienteSeleccionado = this.formFacturaGlobal.get("cliente").value
    this.clienteSeleccionado = {
      nombreRazonSocial: "CABRERA CASAS FATIMA ADRIANA",
      rfc: "XAXX010101000",
      usoCfdi: "S01 - Sin efectos fiscales",
      regimenFiscal: "616 - Sin obligaciones fiscales",
      email: "fatima15ccf@hotmail.com",
      emailOpcional1: "",
      emailOpcional2: "",
      codigoPostal: "00000",
       // Datos opcionales adicionales
       calle: "AV. INSURGENTES SUR",
       noExterior: "1602",
       noInterior: "PISO 4",
       colonia: "CRÉDITO CONSTRUCTOR",
       localidad: "BENITO JUÁREZ",
       municipio: "CIUDAD DE MÉXICO",
       estado: "CIUDAD DE MÉXICO",
       pais: "MEXICO",
    }

    // Cargar datos en el formulario
    this.formCliente.patchValue({
      nombreRazonSocial: this.clienteSeleccionado.nombreRazonSocial,
      rfc: this.clienteSeleccionado.rfc,
      usoCfdi: this.clienteSeleccionado.usoCfdi,
      regimenFiscal: this.clienteSeleccionado.regimenFiscal,
      email: this.clienteSeleccionado.email,
      emailOpcional1: this.clienteSeleccionado.emailOpcional1,
      emailOpcional2: this.clienteSeleccionado.emailOpcional2,
      codigoPostal: this.clienteSeleccionado.codigoPostal,
       // Datos opcionales adicionales
       calle: this.clienteSeleccionado.calle,
       noExterior: this.clienteSeleccionado.noExterior,
       noInterior: this.clienteSeleccionado.noInterior,
       colonia: this.clienteSeleccionado.colonia,
       localidad: this.clienteSeleccionado.localidad,
       municipio: this.clienteSeleccionado.municipio,
       estado: this.clienteSeleccionado.estado,
       pais: this.clienteSeleccionado.pais,
    })

    this.dialog.open(this.modalEditarCliente, {
      width: "600px",
      disableClose: true,
      panelClass: "cliente-dialog",
      autoFocus: false,
    })
  }

  toggleDatosOpcionales(): void {
    this.mostrarDatosOpcionales = !this.mostrarDatosOpcionales
  }

  guardarCliente(): void {
    if (this.formCliente.invalid) {
      this.formCliente.markAllAsTouched()
      return
    }


    this.alertaService.mensajeExitoso("Cliente guardado correctamente")
    this.dialog.closeAll()

    // Cerrar solo el diálogo actual
    const currentDialog = this.dialog.openDialogs[this.dialog.openDialogs.length - 1]
    if (currentDialog) {
      currentDialog.close()
    }

    // Actualizar el dropdown de clientes (simulado)
    // En un caso real, recargarías la lista de clientes desde el servidor
    setTimeout(() => {
      // Seleccionar el cliente recién creado en el dropdown
      this.formFacturaGlobal.get("cliente").setValue(this.formCliente.get("nombreRazonSocial").value)
    }, 500)
  }

  cerrarModalCliente(): void {
    // Obtener la referencia al diálogo actual (el último en la pila de diálogos)
    const currentDialog = this.dialog.openDialogs[this.dialog.openDialogs.length - 1]
    if (currentDialog) {
      currentDialog.close()
    }
  }


  obtenerListaRegimenFiscalFacturama() {
    this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerListaRegimenFiscal}`).subscribe({
      next: (response: HttpResponse<any>) => {
        this.listaFacturmaRegimenFiscal = response.body;
        this.listaFiltradaRegimenFiscal = [...this.listaFacturmaRegimenFiscal];

      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error, "Lista - Régimen Fiscal");
      }
    });
  }

  obtenerListaUsoCfdiFacturama() {
    this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerListaUsoCfdi}`).subscribe({
      next: (response: HttpResponse<any>) => {
        this.listaFacturmaUsoCfdi = response.body;
      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error, "Lista - Uso CFDI");
      }
    });
  }

  obtenerListaFormaPagoFacturama() {
    this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerFormapagoFacturama}`).subscribe({
      next: (response: HttpResponse<any>) => {
        this.listaFacturamaFormaPago = response.body;
        this.listaFiltradaFormaPago = [...this.listaFacturamaFormaPago]; // copio aquí

      },
      error: (error) => {
        this.finanzasService.MensajeDeError(error, "Lista - Forma Pago");
      }
    });
  }
  listaFiltradaFormaPago: any[] = [];
  listaFiltradaRegimenFiscal: any[] = [];
  filtrarFormaPago(valor: string): void {
    const filtro = valor.toLowerCase();
    this.listaFiltradaFormaPago = this.listaFacturamaFormaPago.filter(fp =>
      (`${fp.valor} - ${fp.descripcion}`).toLowerCase().includes(filtro)
    );
  }

  filtrarRegimenFiscal(valor: string): void {
    const filtro = valor.toLowerCase();
    this.listaFiltradaRegimenFiscal = this.listaFacturmaRegimenFiscal.filter(rf =>
      (`${rf.clave} - ${rf.descripcion}`).toLowerCase().includes(filtro)
    );
  }
  EnviarFacturaYCliente(): void {
    const datosFormulario = this.formCrearFacturaFacturama.value;
    const usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
    const usuarioModificacion = usuarioData.userName;

    if (!datosFormulario.ReceiverRfc || !datosFormulario.ReceiverName) {
      this.alertaService.mensajeError('El RFC y el Nombre del receptor son obligatorios.');
      return;
    }

    const datosCompletos = {
      factura: {
        CfdiType: datosFormulario.CfdiType,
        PaymentForm: datosFormulario.PaymentForm,
        PaymentMethod: datosFormulario.PaymentMethod,
        Currency: "MXN",
        ExpeditionPlace: datosFormulario.ExpeditionPlace || '01000',
        //: "01",

        Receiver: {
          Name: datosFormulario.ReceiverName,
          Rfc: datosFormulario.ReceiverRfc,
          CfdiUse: datosFormulario.CfdiUse,
          FiscalRegime: datosFormulario.FiscalRegime,
          TaxZipCode: datosFormulario.TaxZipCode
        },
        Items: this.productosAgregados.map(producto => {
          const cantidad = producto.cantidad || 1;
          const precioUnitario = producto.precio || 0;
          const subtotal = cantidad * precioUnitario;
          const ivaTotal = subtotal * 0.16;
          const totalFinal = subtotal + ivaTotal;

          return {
            Quantity: cantidad,
            ProductCode: producto.claveProducto || '86111500',
            UnitCode: producto.claveUnidad || 'E48',
            Unit: producto.unit || 'Unidad de servicio',
            Description: producto.descripcion || 'Producto Generico',
            IdentificationNumber: producto.identificacionProducto || '',
            UnitPrice: precioUnitario,
            Subtotal: subtotal,
            TaxObject: producto.taxObject || '02',
            Taxes: [
              {
                Name: "IVA",
                Rate: 0.16,
                Total: ivaTotal,
                Base: subtotal,
                IsRetention: false,
                IsFederalTax: true
              }
            ],
            Total: totalFinal
          };
        })
      },
      cliente: {
        Rfc: datosFormulario.ReceiverRfc ||'',
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

    console.log('Datos completos enviados:', datosCompletos);

    this.integraService.postJsonResponse(constApiFinanzas.CrearFacturaFacturama, datosCompletos).subscribe({
      next: (response: HttpResponse<any>) => {
        if (response.status === 201 || response.status === 200) {
          this.actualizarEstadoFacturamaEnvio(this.idCronogramaPagoDetalleFinal, usuarioModificacion);
          Swal.fire({
            title: '¡Éxito!',
            text: 'Factura y cliente enviados correctamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6'
          }).then(() => {
            this.dialog.closeAll();
            const codigo = this.estudianteSeleccionado.codigoMatricula;
            this.obtenerCronogramaEstudiante(codigo);
          });


          const codigo = this.estudianteSeleccionado.codigoMatricula; // <-- Este es el correcto

          this.obtenerCronogramaEstudiante(codigo);
        } else {
          console.warn('Respuesta inesperada:', response.body);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud:', error);
        this.alertaService.mensajeError('Ocurrió un error al enviar los datos: ' + error.message);
      }
    });
  }


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

  enviarFacturaDesdeBD(): void {
    const codigo = this.estudianteSeleccionado.codigoMatricula;
    const usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
    const usuario = usuarioData.userName;

    this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerIdFacturaPorCodigo}/${codigo}`).subscribe({
      next: (resp: HttpResponse<any>) => {
        const idFactura = resp.body?.idFactura;
        if (!idFactura) {
          this.alertaService.mensajeError("No se encontró una factura asociada a la matrícula.");
          return;
        }

        const payload = { idFactura, usuario };

        this.integraService.postJsonResponse(`${constApiFinanzas.EnviarFacturaApi}`, payload).subscribe({
          next: (response: HttpResponse<any>) => {
            if (response.status === 200 || response.status === 201) {
              this.actualizarEstadoFacturamaEnvio(this.idCronogramaPagoDetalleFinal, usuario);

              Swal.fire({
                title: '¡Éxito!',
                text: 'Factura enviada correctamente a Facturama.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6'
              }).then(() => {
                this.dialog.closeAll();
                this.obtenerCronogramaEstudiante(codigo);
              });
            } else {
              console.warn("Respuesta inesperada:", response);
            }
          },
          error: (err) => {
            this.alertaService.mensajeError("Error al enviar la factura: " + err.message);
          }
        });
      },
      error: () => {
        this.alertaService.mensajeError("No se pudo obtener el ID de la factura.");
      }
    });
  }


validarYGuardarFacturaGlobal(): void {
  const id = this.idCronogramaPagoDetalleFinal;

  this.integraService.getJsonResponse(
    `${constApiFinanzas.ValidarFacturaGuardada}?idCronogramaPagoDetalleFinal=${id}`
  )
  .subscribe({
    next: (resp: HttpResponse<boolean>) => {
      const existe = resp.body;
      if (existe) {
        Swal.fire("Atención", "Ya existe una factura global configurada para este cronograma.", "warning");
      } else {
        this.guardarFacturaInternaGlobal();
      }
    },
    error: (err) => {
      this.alertaService.mensajeError("No se pudo validar si ya existe factura: " + err.message);
    }
  });
}

  //factura global
  guardarFacturaInternaGlobal(): void {
    const dataFormulario = this.formFacturaGlobal.value;
    const codigo = this.estudianteSeleccionado.codigoMatricula;
    const idCronograma = this.idCronogramaPagoDetalleFinal;

    const datosFormulario = this.eliminarEspaciosFormulario(dataFormulario);

    const jsonGuardar = {
      factura: {
        CfdiType: datosFormulario.CfdiType,
        PaymentForm: datosFormulario.PaymentForm,
        PaymentMethod: datosFormulario.PaymentMethod,
        Currency: "MXN",
        Date: datosFormulario.Date,
        ExpeditionPlace: datosFormulario.ExpeditionPlace || '03800',
        GlobalInformation: {
          Periodicity: datosFormulario.Periodicity,
          Months: datosFormulario.Months,
          Year: datosFormulario.Year
        },
        Receiver: {
          Name: datosFormulario.ReceiverName,
          Rfc: datosFormulario.ReceiverRfc,
          CfdiUse: datosFormulario.CfdiUse,
          FiscalRegime: datosFormulario.FiscalRegime,
          TaxZipCode: datosFormulario.TaxZipCode
        },
        Items: this.productosAgregados.map(producto => {
          const cantidad = producto.cantidad || 1;
          const precioUnitario = producto.precio || 0;
          const subtotal = cantidad * precioUnitario;
          const ivaTotal = subtotal * 0.16;
          const totalFinal = subtotal + ivaTotal;

          return {
            Quantity: cantidad,
            ProductCode: producto.claveProducto || '86111500',
            UnitCode: producto.claveUnidad || 'E48',
            Unit: producto.unit || 'Unidad de servicio',
            Description: producto.descripcion || 'Producto Genérico',
            IdentificationNumber: producto.identificacionProducto || '',
            UnitPrice: precioUnitario,
            Subtotal: subtotal,
            TaxObject: producto.taxObject || '02',
            Taxes: [{
              Name: "IVA",
              Rate: 0.16,
              Total: ivaTotal,
              Base: subtotal,
              IsRetention: false,
              IsFederalTax: true
            }],
            Total: totalFinal
          };
        })
      },
      cliente: {
        Rfc: datosFormulario.ReceiverRfc,
        Name: datosFormulario.ReceiverName,
        Email: datosFormulario.Email || '',
        FiscalRegime: datosFormulario.FiscalRegime,
        CfdiUse: datosFormulario.CfdiUse,
        Address: {
          Street: datosFormulario.Street,
          ExteriorNumber: datosFormulario.ExteriorNumber,
          InteriorNumber: datosFormulario.InteriorNumber,
          Neighborhood: datosFormulario.Neighborhood,
          ZipCode: datosFormulario.TaxZipCode,
          Municipality: datosFormulario.Municipality,
          State: datosFormulario.State,
          Country: datosFormulario.Country || 'MEX'
        }
      }
    };


   // this.integraService.postJsonResponse(`${constApiFinanzas.GuardarFacturaGlobalInterna}?codigoMatricula=${codigo}`, jsonGuardar)
this.integraService.postJsonResponse(
  `${constApiFinanzas.GuardarFacturaGlobalInterna}?codigoMatricula=${codigo}&idCronogramaPagoDetalleFinal=${idCronograma}`,
  jsonGuardar
)

    .subscribe({
      next: () => {
        Swal.fire("¡Guardado!", "Factura global guardada correctamente.", "success");
      },
      error: (err) => {
        this.alertaService.mensajeError("Error al guardar la factura global: " + err.message);
        this.cerrarModalFacturacionMasiva();

      }
    });
  }


  enviarFacturaGlobalDesdeBD(): void {
    const usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
    const usuario = usuarioData.userName;

    this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerIdFacturaGlobal}`).subscribe({
      next: (resp: HttpResponse<any>) => {
        const idFactura = resp.body?.idFactura;
        if (!idFactura) {
          this.alertaService.mensajeError("No se encontró una factura global pendiente.");
          return;
        }

        const payload = { idFactura, usuario };

        this.integraService.postJsonResponse(`${constApiFinanzas.EnviarFacturaGlobalApi}`, payload).subscribe({
          next: () => {
            Swal.fire("¡Éxito!", "Factura Global enviada correctamente.", "success");
            this.dialog.closeAll();
          },
          error: (err) => {
            this.alertaService.mensajeError("Error al enviar factura global: " + err.message);
          }
        });
      },
      error: () => {
        this.alertaService.mensajeError("No se pudo obtener el ID de la factura global.");
      }
    });
  }
// FACTRURA SIIGO

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

  TipoCambioDolarPesoColombiano(monto: number): number {
    const tipo = Number(this.montoTipoCambioPesoColombiano || 0);
    return Number((monto * tipo).toFixed(2));
  }

  ObtenerTipoCambioDolarPesoColombiano(fecha: Date, callback?: () => void): void {
    this.integraService.getJsonResponse(constApiFinanzas.ObtenerPesosDolaresTipoCambioColombia + '/' + fecha)
      .subscribe({
        next: (resp: HttpResponse<any>) => {
          this.montoTipoCambioPesoColombiano = resp.body.pesosDolares;
        },
        error: (error) => {
          console.log(error);
          this.montoTipoCambioPesoColombiano = 0;
        },
        complete: () => {
          if (callback) callback(); //
        }
      });
  }


  ObtenerAlumnoProgramaPorMatriculaFacturma(codMat: string, callback?: () => void): void {
    this.formMatricula.get('alumno')?.reset();
    this.formMatricula.get('idPrograma')?.reset();

    this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerAlumnoProgramaEspecifico}/${codMat}`)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          if (response.body.length > 0) {
            this.listaPrograma = response.body;
            this.formMatricula.get('idPrograma')?.setValue(response.body[0].idPEspecifico);
            this.listaAlumno = [{ id: -1, nombreCompleto: response.body[0].nombreCompleto }];
            this.formMatricula.get('alumno')?.setValue(-1);
            this.nombreCentroCosto = response.body[0].nombreCentroCosto;
            this.ObtenerTipoCambioDolarPesoColombiano(response.body[0].fechaMatricula);
            if (callback) callback();
          }
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, "obtener Programa - alumno");
        }
      });
  }

  ObtenerAlumnoProgramaPorMatricula(codMat: string, callback?: () => void): void {
    this.formMatricula.get('alumno')?.reset();
    this.formMatricula.get('idPrograma')?.reset();

    this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerAlumnoProgramaEspecifico}/${codMat}`)
      .subscribe({
        next: (response: HttpResponse<any[]>) => {
          if (response.body.length > 0) {
            this.listaPrograma = response.body;
            this.formMatricula.get('idPrograma')?.setValue(response.body[0].idPEspecifico);
            this.listaAlumno = [{ id: -1, nombreCompleto: response.body[0].nombreCompleto }];
            this.formMatricula.get('alumno')?.setValue(-1);
            this.nombreCentroCosto = response.body[0].nombreCentroCosto;
            this.ObtenerTipoCambioDolarPesoColombiano(response.body[0].fechaMatricula);
            if (callback) callback();
          }
        },
        error: (error) => {
          this.finanzasService.MensajeDeError(error, "obtener Programa - alumno");
        }
      });
  }


  abrirFacturaSiigo(item: any, detalle: any): void {
    this.estudianteSeleccionado = item;
    this.idCronogramaPagoDetalleFinal = detalle.id;

    const codigo = item.codigoMatricula;

    if (!detalle.cuota || isNaN(detalle.cuota) || detalle.cuota <= 0) {
      const cronograma = this.cronogramasPorAlumno?.[codigo];
      if (cronograma?.length > 0) {
        const fila = cronograma.find(x => x.id === detalle.id);
        detalle.cuota = fila?.cuota ?? fila?.totalPagar ?? 0;
      } else {
        detalle.cuota = 0;
      }
    }

    this.ObtenerAlumnoProgramaPorMatricula(codigo, () => {
      this.ObtenerTipoCambioDolarPesoColombiano(detalle.fechaPago, () => {
        this.cargarFormularioSiigoConDetalle(detalle);
        this.abrirModalCrearFactSiigo(detalle);
      });
    });
  }


  cargarFormularioSiigoConDetalle(detalle: any): void {
    this.formCrearFactSiigo.patchValue({
      fechaDocumento: detalle.fechaPago || new Date(),
      fechaVencimiento: detalle.fechaVencimiento || new Date(),
      valorTotal: detalle.totalPagar || 0,
      descripcionItem: detalle.tipoCuota || 'Cuota',
      cantidadItem: 1,
      precioItem: detalle.totalPagar || 0,
      codigoItem: detalle.id || 'N/A'
    });
  }

  abrirModalCrearFactSiigo(data: any) {
    if (data.enviadoSiigo !== true) {

      let montoCuota = 0;
      this.ObtenerListaDepartamentos();
      this.ObtenerListaCiudades();
      if (data.moneda === "dolares" && data.cuota != null && !isNaN(data.cuota)) {
        montoCuota = this.TipoCambioDolarPesoColombiano(data.cuota);
      } else if (!isNaN(data.cuota)) {
        montoCuota = data.cuota;
      }

      // Seguridad extrema
      if (isNaN(montoCuota)) {
        montoCuota = 0;
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

      this.formCrearFactSiigo.reset();
      this.formCrearFactSiigo.patchValue(datos);
      this.idCronogramaPagoDetalleFinal = data.id;
      this.modalRefCrearFactSiigo = this.modalService.open(this.modalCrearFactSiigo, { size: "lg" });
    } else {
      Swal.fire(
        "!Cuota Enviada¡",
        "La cuota ya fue enviada a Siigo!",
        "warning"
      );
    }
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


    enviarFacturaSiigoDesdeBD(): void {
    const codigo = this.estudianteSeleccionado.codigoMatricula;
    const idCronograma = this.idCronogramaPagoDetalleFinal;
    const usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
    const usuario = usuarioData.userName;

    this.integraService.getJsonResponse(`${constApiFinanzas.ObtenerIdFacturaPorCodigoSiigo}/${idCronograma}`).subscribe({
      next: (resp: HttpResponse<any>) => {
        const idFactura = resp.body?.idFactura;
        if (!idFactura) {
          this.alertaService.mensajeError("No se encontró una factura asociada a la matrícula.");
          return;
        }

        const payload = { idFactura, usuario };

        this.integraService.postJsonResponse(`${constApiFinanzas.EnviarSiigoFacturaApi}`, payload).subscribe({
          next: (response: HttpResponse<any>) => {
            if (response.status === 200 || response.status === 201) {
             this.ActualizarCronogramaPagoDetalleFinalSiigo();
              Swal.fire({
                title: '¡Éxito!',
                text: 'Factura enviada correctamente a Facturama.',
                icon: 'success',
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6'
              }).then(() => {
                this.dialog.closeAll();
                this.obtenerCronogramaEstudiante(codigo);
              });
            } else {
              console.warn("Respuesta inesperada:", response);
            }
          },
          error: (err) => {
            this.alertaService.mensajeError("Error al enviar la factura: " + err.message);
          }
        });
      },
      error: () => {
        this.alertaService.mensajeError("No se pudo obtener el ID de la factura.");
      }
    });
  }
guardarFacturaInternaSiigo(): void {

    const datosFormulario = this.formCrearFactSiigo.value;
    //const codigo = this.estudianteSeleccionado?.codigoMatricula || this.formMatricula.get('codigoMat')?.value;
    const codigo = this.estudianteSeleccionado.codigoMatricula;
    const idCronograma = this.idCronogramaPagoDetalleFinal;


    if (!codigo) {
      this.alertaService.mensajeError("No se encontró el código de matrícula.");
      return;
    }

    const formatDate = (date: Date): string => {
      return date.toISOString().split('T')[0];
    };
    const jsonGuardar = {
      factura: {
        documento: { id: datosFormulario.tipoDocumento },
        fecha: formatDate(new Date(datosFormulario.fechaDocumento)),
        cliente: { numeroIdentification: datosFormulario.nroIdentificacion },
        vendedor: this.idVendedor,
        observaciones: datosFormulario.observaciones,
        items: [{
          codigo: datosFormulario.codigoItem,
          descripcion: datosFormulario.descripcionItem,
          cantidad: parseInt(datosFormulario.cantidadItem),
          precio: parseFloat(datosFormulario.precioItem)
        }],
        pagos: [{
          id: datosFormulario.medioPago,
          valor: parseFloat(datosFormulario.valorTotal),
          fechaVencimiento: formatDate(new Date(datosFormulario.fechaVencimiento))
        }]
      },
      cliente: {
        tipoCliente: datosFormulario.tipoCliente,
        tipoPersona: datosFormulario.tipoPersona,
        tipoIdentificacion: datosFormulario.tipoIdentificacion,
        identificacion: datosFormulario.nroIdentificacion,
        nombres: [datosFormulario.nombresAlumno, datosFormulario.apellidosAlumno],
        codigosFiscal: [datosFormulario.responsabilidadFiscal],
        direccion: datosFormulario.direccionAlumno,
        codigoPais: datosFormulario.pais,
        codigoDepartamento: this.codigoDepartamento.toString(),
        codigoCiudad: this.codigoCiudad.toString(),
        telefonoIndicativo: datosFormulario.indicativoTelefono,
        telefonoNumero: datosFormulario.numeroTelefono,
        telefonoExtension: datosFormulario.extensionTelefono,
        contactoNombre: datosFormulario.nombresContacto,
        contactoApellido: datosFormulario.apellidosContacto,
        contactoEmail: datosFormulario.correoContacto
      }
    };

    this.integraService.postJsonResponse(
      `${constApiFinanzas.GuardarFacturaInternaSiigo}?codigoMatricula=${codigo}&idCronogramaPagoDetalleFinal=${idCronograma}`, jsonGuardar)
        .subscribe({
          next: () => {
            Swal.fire("¡Guardado!", "Los datos fueron almacenados correctamente.", "success");
          },
          error: (err) => {
            this.alertaService.mensajeError("Error al guardar los datos internos: " + err.message);
          }
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
 emitirFacturasMasivasSiigo(): void {
    if (this.estudiantesSeleccionadosMasivos.length === 0) return;
this.loader= true;
    const usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
    const usuario = usuarioData.userName;


const idsFacturas = this.estudiantesSeleccionadosMasivos
  .map(compuesto => {
    const [codigo, index] = compuesto.split('_');
    return this.facturasPendientes.find(f =>
      f.codigoMatricula === codigo &&
      this.facturasPendientes.indexOf(f) === parseInt(index, 10)
    )?.idFactura;
  })
  .filter(id => !!id);

  const payload = {
    idsFacturas,
    usuario
  };

    this.integraService.postJsonResponse(`${constApiFinanzas.EnviarSiigoMasivasLote}`, payload).subscribe({
      next: () => {
        this.alertaService.mensajeExitoso("Facturación masiva iniciada correctamente.");
         this.loader = false;
        this.cerrarModalFacturacionMasivaSiigo();
        this.btenerFacturasPendientesEnvioSiigo();

      },
      error: (error) => {
         this.loader = false;
        console.error("❌ Error al enviar facturas masivas:", error);
        this.alertaService.mensajeError("Error al enviar facturas masivas: " + error.message);
      }
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

  onKeyDownNumero(event: KeyboardEvent): void {
    const validKeys = ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const isNumber = (key: string) => /^[0-9]$/.test(key);
    if (!validKeys.includes(event.key) && !isNumber(event.key)) {
      event.preventDefault();
    }
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
  mostrarMensajeError(error: any): void {
      Swal.fire({
        icon: "error",
        html: `<p class="text-start">${error.error}</p>
            <p class="text-start text-danger fs-6">${error.message}</p>`,
        allowOutsideClick: false
      });
    }
    onKeyDownMonto(event: KeyboardEvent): void {
      const validKeys = ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
      const isNumber = (key: string) => /^[0-9]$/.test(key);
      if (!validKeys.includes(event.key) && !isNumber(event.key)) {
        event.preventDefault();
      }
    }

    //Metodo para eliminar listado de facturas seleccionadas
    eliminarFacturas(){
      Swal.fire({
            title: '¿Está seguro(a) de eliminar las facturas seleccionadas?',
            icon: 'warning',
            showCancelButton: true,
            reverseButtons: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
          }).then((result) => {
            if (result.isConfirmed && this.estudiantesSeleccionadosMasivos.length>0) {
              this.loader= true;
              const idsFacturas = this.estudiantesSeleccionadosMasivos
                .map((compuesto) => {
                  const [codigo, index] = compuesto.split("_");
                  return this.facturasPendientes.find(
                    (f) =>
                      f.codigoMatricula === codigo &&
                      this.facturasPendientes.indexOf(f) === parseInt(index, 10),
                  )?.idFactura;
                })
                .filter((id) => !!id);
              const request = {
                idsFacturas,
              };

              this.integraService.postJsonResponse(`${constApiFinanzas.EliminarFacturasPendientesFacturama}`, request).subscribe({
                next: () => {
                  Swal.fire({
                        title: "Eliminadas Correctamente!", 
                        icon: "success"
                      });
                  this.loader = false;

                  this.obtenerFacturasPendientesEnvio();
                },
                error: (error) => {
                  this.loader = false;
                  console.error("Error al enviar facturas masivas:", error);
                  Swal.fire({
                        title: "Error al eliminar facturas",
                        icon: "error"
                      });
                }
              });
            }
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



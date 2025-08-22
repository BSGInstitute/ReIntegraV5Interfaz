"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.CronogramaGeneralEmisionFacturaComponent = void 0;
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var date_pipe_1 = require("@shared/functions/date-pipe");
var CronogramaGeneralEmisionFacturaComponent = /** @class */ (function () {
    function CronogramaGeneralEmisionFacturaComponent(integraService, formBuilder, alertaService, modalService, finanzasService, dialog, http) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.modalService = modalService;
        this.finanzasService = finanzasService;
        this.dialog = dialog;
        this.http = http;
        // Variables existentes
        this.filtrarMoneda = true;
        this.customers = [];
        this.paisesPorMatricula = {};
        this.expandedRowCodigo = null;
        this.estudiantesConfiguradosCompletos = [];
        // Variables para facturación
        this.facturasPendientes = [];
        this.paises = ['Colombia', 'México'];
        this.paisSeleccionado = '';
        this.estudiantesOriginal = [];
        this.loader = false;
        this.tipoFactura = "normal";
        this.listaPrograma = [];
        this.listaAlumno = [];
        this.formMatricula = this.formBuilder.group({
            codigoMat: null,
            alumno: null,
            idPrograma: null
        });
        //lista
        this.listaMetodoPagoFacturama = [
            { clave: 'PPD', nombre: "PPD - Pago en parcialidades ó diferido" },
            { clave: 'PUE', nombre: "PUE - Pago en una sola exhibición" },
        ];
        this.listaExpedicion = [
            { clave: '01000', nombre: " Principal (01000)" },
        ];
        this.listaTipoCfdiType = [
            { clave: 'I', nombre: "Ingreso" },
        ];
        //real
        this.formCrearFacturaFacturama = this.formBuilder.group({
            // Datos generales
            CfdiType: ['I', forms_1.Validators.required],
            PaymentForm: ['', forms_1.Validators.required],
            PaymentMethod: ['', forms_1.Validators.required],
            ExpeditionPlace: ['', forms_1.Validators.required],
            // GlobalInformation
            // Periodicity: ['', Validators.required],
            // Months: ['', Validators.required],
            // Year: ['', ValF
            // Receptor (Receiver)
            ReceiverName: ['', forms_1.Validators.required],
            ReceiverRfc: ['', forms_1.Validators.required],
            Email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            CfdiUse: ['', forms_1.Validators.required],
            FiscalRegime: ['', forms_1.Validators.required],
            TaxZipCode: ['', forms_1.Validators.required],
            // Dirección del cliente (Client Address)
            Street: ['', forms_1.Validators.required],
            ExteriorNumber: ['', forms_1.Validators.required],
            InteriorNumber: [''],
            Neighborhood: ['', forms_1.Validators.required],
            Municipality: ['', forms_1.Validators.required],
            State: ['CDMX', forms_1.Validators.required],
            Country: ['MEX', forms_1.Validators.required],
            ZipCode: ['', forms_1.Validators.required],
            // RFC del cliente (en caso de ser distinto al RFC del receptor)
            clientRfc: ['', forms_1.Validators.required],
            // Detalle del producto (Items)
            ProductCode: ['', forms_1.Validators.required],
            Description: ['', forms_1.Validators.required],
            UnitCode: ['', forms_1.Validators.required],
            Quantity: [1, forms_1.Validators.required],
            UnitPrice: [0, forms_1.Validators.required],
            Subtotal: [0, forms_1.Validators.required],
            TaxObject: ['01', forms_1.Validators.required],
            productoSeleccionado: [''],
            // Impuestos (Taxes)
            // TaxName: ['', Validators.required],
            // Base: [0, Validators.required],
            // Rate: [0, Validators.required],
            // IsRetention: [false],
            taxTotal: [0, forms_1.Validators.required],
            // Total del producto
            ItemTotal: [0, forms_1.Validators.required]
        });
        this.formFacturaGlobal = this.formBuilder.group({
            // Datos generales
            CfdiType: ['I', forms_1.Validators.required],
            PaymentForm: ['', forms_1.Validators.required],
            PaymentMethod: ['', forms_1.Validators.required],
            ExpeditionPlace: ['', forms_1.Validators.required],
            Periodicity: ['', forms_1.Validators.required],
            Months: ['', forms_1.Validators.required],
            Year: [new Date().getFullYear(), forms_1.Validators.required],
            ReceiverName: ['', forms_1.Validators.required],
            ReceiverRfc: ['', forms_1.Validators.required],
            Email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            CfdiUse: ['', forms_1.Validators.required],
            FiscalRegime: ['', forms_1.Validators.required],
            TaxZipCode: ['', forms_1.Validators.required],
            // Dirección del cliente (Client Address)
            Street: ['', forms_1.Validators.required],
            ExteriorNumber: ['', forms_1.Validators.required],
            InteriorNumber: [''],
            Neighborhood: ['', forms_1.Validators.required],
            Municipality: ['', forms_1.Validators.required],
            State: ['', forms_1.Validators.required],
            Country: ['MEX', forms_1.Validators.required],
            ZipCode: ['', forms_1.Validators.required],
            // RFC del cliente (en caso de ser distinto al RFC del receptor)
            clientRfc: ['', forms_1.Validators.required],
            // Detalle del producto (Items)
            ProductCode: ['', forms_1.Validators.required],
            Description: ['', forms_1.Validators.required],
            UnitCode: ['', forms_1.Validators.required],
            Quantity: [1, forms_1.Validators.required],
            UnitPrice: [0, forms_1.Validators.required],
            Subtotal: [0, forms_1.Validators.required],
            TaxObject: ['01', forms_1.Validators.required],
            productoSeleccionado: [''],
            taxTotal: [0, forms_1.Validators.required],
            // Total del producto
            ItemTotal: [0, forms_1.Validators.required]
        });
        // Variables para facturación masiva
        this.estudiantesSeleccionadosMasivos = [];
        this.procesandoMasivo = false;
        this.progresoMasivo = 0;
        this.lotes = [];
        this.loteActual = 0;
        this.sesionActiva = false;
        this.resultadosMasivos = {};
        this.estudiantesConfigurados = [];
        // Variables existentes
        this.listaFacturmaRegimenFiscal = [];
        this.listaFacturmaUsoCfdi = [];
        this.listaFacturamaFormaPago = [];
        this.listaPeriodicidad = [
            { clave: '01', nombre: 'Diario' },
            { clave: '02', nombre: 'Semanal' },
            { clave: '03', nombre: 'Quincenal' },
            { clave: '04', nombre: 'Mensual' },
            { clave: '05', nombre: 'Bimestral' },
        ];
        this.listaMeses = [
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
        this.listaFormaPago = [];
        this.listaCuenta = [];
        this.listaDocumentoPago = [];
        this.dataPeriodo = [];
        this.dataCodigoMatricula = [];
        this.dataCentroCosto = [];
        this.alumnos = [];
        this.listaGrilla = [];
        this.listacambiosorden = [];
        this.listaCronogramaOriginal = [];
        this.listaCronogramaActual = [];
        this.listaCronogramaEditable = [];
        this.valorReal = 0;
        this.PagoMaximoSolesDolares = 0;
        this.fun1 = true;
        this.fun2 = true;
        this.fun3 = true;
        this.loaderGeneral = false;
        this.flagSinAprobar = false;
        this.formFiltro = this.formBuilder.group({
            fechaInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            fechaFin: new Date(),
            codigoMatricula: [null],
            idCodigoPais: [null]
        });
        this.currentYear = new Date().getFullYear();
        this.loading = false;
        this.cronogramasPorAlumno = {};
        this.loadingDetalle = {};
        this.gridPageStatePorAlumno = {};
        // Variables para el modal de factura global
        // formFacturaGlobal: FormGroup
        this.mostrarOpcionesAdicionales = false;
        this.productosAgregados = [];
        this.subtotalGeneral = 0;
        this.totalGeneral = 0;
        // Variables para el resultado de la factura
        this.emitiendo = false;
        this.resultadoFactura = null;
        this.errorFactura = null;
        this.clienteSeleccionado = null;
        this.mostrarDatosOpcionales = false;
        ///siigo
        this.formCrearFactSiigo = this.formBuilder.group({
            tipoCliente: [null, forms_1.Validators.required],
            tipoPersona: [null, forms_1.Validators.required],
            tipoIdentificacion: [null, forms_1.Validators.required],
            nroIdentificacion: [null, [forms_1.Validators.required, forms_1.Validators.maxLength(10)]],
            nombresAlumno: [null, forms_1.Validators.required],
            apellidosAlumno: [null, forms_1.Validators.required],
            direccionAlumno: [null, forms_1.Validators.required],
            pais: [null, forms_1.Validators.required],
            departamento: [null, forms_1.Validators.required],
            ciudad: [null, forms_1.Validators.required],
            indicativoTelefono: [null, forms_1.Validators.required],
            numeroTelefono: [null, forms_1.Validators.required],
            extensionTelefono: [null],
            responsabilidadFiscal: [null, forms_1.Validators.required],
            nombresContacto: [null, forms_1.Validators.required],
            apellidosContacto: [null, forms_1.Validators.required],
            correoContacto: [null, forms_1.Validators.required],
            tipoDocumento: [null, forms_1.Validators.required],
            medioPago: [null, forms_1.Validators.required],
            fechaDocumento: [new Date(), forms_1.Validators.required],
            fechaVencimiento: [new Date(), forms_1.Validators.required],
            valorTotal: [null, forms_1.Validators.required],
            observaciones: [null, forms_1.Validators.required],
            codigoItem: [null, forms_1.Validators.required],
            descripcionItem: [null, forms_1.Validators.required],
            cantidadItem: [null, forms_1.Validators.required],
            precioItem: [null, forms_1.Validators.required]
        });
        this.dataTipoCliente = [
            { id: "Customer", nombre: "Cliente" }
        ];
        this.dataTipoDocumento = [
            { id: 77639, nombre: "Factura electrónica de venta" }
        ];
        this.dataMedioPago = [
            { id: 10859, nombre: "Ventas clientes Openpay colombia" },
            { id: 10849, nombre: "Ventas clientes Payu" },
            { id: 10840, nombre: "Clientes Bancolombia" },
        ];
        this.dataTipoIdentificacion = [
            { id: "13", nombre: "Cédula" }
        ];
        this.dataTipoPersona = [
            { id: "Person", nombre: "Persona" }
        ];
        this.dataPais = [
            { id: "CO", nombre: "Colombia" }
        ];
        this.loaderCrearFactSiigo = false;
        this.idVendedor = 35943;
        this.listaFiltradaFormaPago = [];
        this.listaFiltradaRegimenFiscal = [];
    }
    CronogramaGeneralEmisionFacturaComponent.prototype.ngOnInit = function () {
        // Cargar datos iniciales
        this.inicializarFormularios();
        this.inicializarFormularioCliente();
        this.obtenerListaFormaPagoFacturama();
        this.obtenerListaRegimenFiscalFacturama();
        this.obtenerListaUsoCfdiFacturama();
        this.ObtenerListaCiudades();
        this.ObtenerListaCiudades();
        this.ReplicarValorTotalPrecio();
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.inicializarFormularios = function () {
        this.formFiltro = this.formBuilder.group({
            fechaInicio: [null],
            fechaFin: [null],
            codigoMatricula: [null],
            idCodigoPais: [null]
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.seleccionarEstudiante = function (estudiante) {
        this.estudianteSeleccionado = estudiante;
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.cargarEstudiantesConfigurados = function () {
        this.estudiantesConfigurados = [
            {
                codigoMatricula: "12345",
                nombre: "Juan Perez",
                configuradoParaFactura: true,
                datosFacturacion: {
                    tipoFactura: "individual",
                    rfc: "XAXX010101000",
                    razonSocial: "Juan Perez SA de CV",
                    regimenFiscal: "601",
                    usoCFDI: "G03",
                    metodoPago: "PUE",
                    formaPago: "01"
                }
            },
            {
                codigoMatricula: "67890",
                nombre: "Maria Gomez",
                configuradoParaFactura: false,
                datosFacturacion: null
            },
        ];
    };
    // Actualizar lista de estudiantes configurados
    CronogramaGeneralEmisionFacturaComponent.prototype.actualizarEstudiantesConfigurados = function () {
        this.estudiantesConfigurados = this.listaGrilla.filter(function (e) { return e.configuradoParaFactura; });
    };
    // Método existente
    CronogramaGeneralEmisionFacturaComponent.prototype.obtenerGrilaCronogramaGeneralFactura = function () {
        var _this = this;
        var _a;
        this.loader = true;
        var filtro = this.formFiltro.value;
        var payload = {
            FechaInicio: date_pipe_1.datePipeTransform(filtro.fechaInicio, "yyyy-MM-ddT00:00:00"),
            FechaFin: date_pipe_1.datePipeTransform(filtro.fechaFin, "yyyy-MM-ddT23:59:59"),
            CodigoMatricula: ((_a = filtro.codigoMatricula) === null || _a === void 0 ? void 0 : _a.trim()) || null,
            IdCodigoPais: filtro.idCodigoPais || null
        };
        this.integraService.postJsonResponse(constApi_1.constApiFinanzas.ObtenerResumenMatriculas, JSON.stringify(payload)).subscribe({
            next: function (resp) {
                _this.loader = false;
                console.log(resp.body);
                _this.listaGrilla = resp.body;
                _this.actualizarEstudiantesConfigurados();
                _this.loader = false;
            },
            error: function (error) {
                _this.loader = false;
                _this.alertaService.notificationError(error.message);
            }
        });
    };
    // Método para expandir/colapsar filas
    CronogramaGeneralEmisionFacturaComponent.prototype.toggleRow = function (codigo) {
        if (this.expandedRowCodigo === codigo) {
            this.expandedRowCodigo = null;
        }
        else {
            this.expandedRowCodigo = codigo;
            if (!this.cronogramasPorAlumno[codigo]) {
                this.obtenerCronogramaEstudiante(codigo);
            }
        }
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.obtenerCronogramaEstudiante = function (codigo) {
        var _this = this;
        this.loadingDetalle[codigo] = true;
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerCronogramaFacturacion + "/" + codigo).subscribe({
            next: function (resp) {
                var _a, _b;
                _this.cronogramasPorAlumno[codigo] = (_b = (_a = resp.body) === null || _a === void 0 ? void 0 : _a.cronogramaPagoDetalleFinal) !== null && _b !== void 0 ? _b : [];
                _this.gridPageStatePorAlumno[codigo] = { skip: 0, take: 10 }; // si estás usando paginación
            },
            error: function (err) {
                _this.alertaService.mensajeError("Error al obtener cronograma: " + err.message);
            },
            complete: function () {
                _this.loadingDetalle[codigo] = false;
            }
        });
    };
    // Método existente
    CronogramaGeneralEmisionFacturaComponent.prototype.ObtenerPaisMatricula = function (codigoMatricula, callback) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerPaisMatricula + "/" + codigoMatricula).subscribe({
            next: function (response) {
                var _a;
                var idPais = (_a = response.body) === null || _a === void 0 ? void 0 : _a.idPais;
                _this.paisesPorMatricula[codigoMatricula] = idPais;
                callback(idPais);
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "obtener país de matrícula");
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.abrirModalFactura = function (dataItem, idCronograma) {
        console.log('📌 Recibiendo:', dataItem, idCronograma);
        if (!idCronograma) {
            var codigo = dataItem.codigoMatricula;
            var cronograma = this.cronogramasPorAlumno[codigo];
            if ((cronograma === null || cronograma === void 0 ? void 0 : cronograma.length) > 0) {
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
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.setearValoresPorDefectoFacturaGlobal = function () {
        var _this = this;
        setTimeout(function () {
            _this.formFacturaGlobal.patchValue({
                CfdiType: "I",
                PaymentForm: "01",
                PaymentMethod: "PUE",
                ExpeditionPlace: "03800",
                Periodicity: "04",
                Months: (new Date().getMonth() + 1).toString().padStart(2, '0'),
                Year: new Date().getFullYear().toString(),
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
                clientRfc: "XAXX010101000"
            });
        }, 200);
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.setearValoresPorDefectoFacturaGlobalApi = function () {
        var _this = this;
        setTimeout(function () {
            _this.formFacturaGlobal.patchValue({
                CfdiType: "I",
                PaymentForm: "01",
                PaymentMethod: "PUE",
                ExpeditionPlace: "03800",
                Periodicity: "04",
                Months: (new Date().getMonth() + 1).toString().padStart(2, '0'),
                Year: new Date().getFullYear().toString(),
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
                clientRfc: "XAXX010101000"
            });
        }, 200);
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.continuarADetallesV1 = function () {
        var _this = this;
        this.dialog.closeAll();
        var codigo = this.estudianteSeleccionado.codigoMatricula;
        if (this.tipoFactura === "global") {
            // ⚙️ Asignar valores por defecto para factura global
            this.productosAgregados = [];
            this.calcularTotalesGenerales();
            this.dialog.open(this.modalFacturaGlobal, {
                width: "90%",
                maxWidth: "1200px",
                disableClose: true,
                panelClass: "factura-global-dialog"
            });
            this.setearValoresPorDefectoFacturaGlobal();
        }
        else {
            this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerFacturaPorCodigoMatricula + "/" + codigo)
                .subscribe({
                next: function (resp) {
                    var data = resp.body;
                    console.log("🔍 Datos recibidos de la BD:", data);
                    var cliente = (data === null || data === void 0 ? void 0 : data.cliente) || {};
                    var direccion = cliente.address || {};
                    var factura = (data === null || data === void 0 ? void 0 : data.factura) || {};
                    // Llenar formulario, usando fallback a ''
                    _this.formCrearFacturaFacturama.patchValue({
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
                        codigoMat: codigo
                    });
                    // Llenar productos si hay
                    _this.productosAgregados = (factura.items || []).map(function (item) {
                        var _a;
                        return ({
                            cantidad: item.quantity || 1,
                            claveProducto: item.productCode || '',
                            claveUnidad: item.unitCode || '',
                            unit: item.unit || '',
                            descripcion: item.description || '',
                            precio: item.unitPrice || 0,
                            subtotal: item.subtotal || 0,
                            taxObject: item.taxObject || '',
                            total: item.total || 0,
                            iva: ((_a = item.taxes) === null || _a === void 0 ? void 0 : _a.reduce(function (sum, t) { return sum + (t.total || 0); }, 0)) || 0
                        });
                    });
                    _this.calcularTotalesGenerales();
                    setTimeout(function () {
                        _this.dialog.open(_this.modalDetallesFactura, {
                            width: "90%",
                            maxWidth: "1200px",
                            disableClose: true,
                            panelClass: "factura-global-dialog"
                        });
                    }, 100);
                },
                error: function () {
                    _this.alertaService.mensajeError("Error al obtener datos de la factura");
                }
            });
        }
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.limpiarFormularioFacturaGlobal = function () {
        var _a, _b, _c;
        this.formFacturaGlobal.reset();
        this.formCrearFacturaFacturama.reset();
        // Restaurar solo los campos que me interesa preservar
        var valoresPrevios = {
            State: (_a = this.formCrearFacturaFacturama.get('State')) === null || _a === void 0 ? void 0 : _a.value,
            Country: (_b = this.formCrearFacturaFacturama.get('Country')) === null || _b === void 0 ? void 0 : _b.value,
            CfdiType: (_c = this.formCrearFacturaFacturama.get('CfdiType ')) === null || _c === void 0 ? void 0 : _c.value
        };
        this.formCrearFacturaFacturama.patchValue({
            State: valoresPrevios.State || 'CDMX',
            Country: valoresPrevios.Country || 'MEX',
            CfdiType: valoresPrevios.State || 'I'
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.continuarADetalles = function () {
        var _this = this;
        this.dialog.closeAll();
        this.limpiarFormularioFacturaGlobal();
        var codigo = this.estudianteSeleccionado.codigoMatricula;
        var idCronograma = this.idCronogramaPagoDetalleFinal;
        console.log("🚀 Continuando con ID Cronograma:", idCronograma);
        if (this.tipoFactura === "global") {
            this.prepararFacturaGlobal();
            //  this.productosAgregados = [];
            // this.calcularTotalesGenerales();
        }
        else {
            // this.dialog.open(this.modalFacturaGlobal, {
            //   width: "90%",
            //   maxWidth: "1200px",
            //   disableClose: true,
            //   panelClass: "factura-global-dialog",
            // });
            //this.setearValoresPorDefectoFacturaGlobal();
            this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerFacturaPorCodigoMatricula + "/" + codigo)
                .subscribe({
                next: function (resp) {
                    var _a, _b, _c, _d, _e;
                    var data = resp.body;
                    var cliente = data === null || data === void 0 ? void 0 : data.cliente;
                    var direccion = cliente === null || cliente === void 0 ? void 0 : cliente.address;
                    var factura = data === null || data === void 0 ? void 0 : data.factura;
                    var idCronogramaSP = data === null || data === void 0 ? void 0 : data.idCronogramaPagoDetalleFinal;
                    var detalleActual = (_a = _this.cronogramasPorAlumno[codigo]) === null || _a === void 0 ? void 0 : _a.find(function (d) { return d.id === idCronograma; });
                    var mismoCronograma = Number(idCronogramaSP) === Number(idCronograma);
                    if (cliente && factura) {
                        _this.formCrearFacturaFacturama.patchValue({
                            ReceiverRfc: cliente.rfc || '',
                            ReceiverName: cliente.name || '',
                            Email: cliente.email || '',
                            CfdiUse: cliente.cfdiUse || '',
                            FiscalRegime: cliente.fiscalRegime || '',
                            TaxZipCode: (direccion === null || direccion === void 0 ? void 0 : direccion.zipCode) || '',
                            Street: (direccion === null || direccion === void 0 ? void 0 : direccion.street) || '',
                            ExteriorNumber: (direccion === null || direccion === void 0 ? void 0 : direccion.exteriorNumber) || '',
                            InteriorNumber: (direccion === null || direccion === void 0 ? void 0 : direccion.interiorNumber) || '',
                            Neighborhood: (direccion === null || direccion === void 0 ? void 0 : direccion.neighborhood) || '',
                            Municipality: (direccion === null || direccion === void 0 ? void 0 : direccion.municipality) || '',
                            State: ((_b = direccion === null || direccion === void 0 ? void 0 : direccion.state) === null || _b === void 0 ? void 0 : _b.trim()) || 'CDMX',
                            Country: ((_c = direccion === null || direccion === void 0 ? void 0 : direccion.country) === null || _c === void 0 ? void 0 : _c.trim()) || 'MEX',
                            PaymentForm: factura.paymentForm || '',
                            PaymentMethod: factura.paymentMethod || '',
                            ExpeditionPlace: factura.expeditionPlace || '',
                            codigoMat: codigo
                        });
                        if (((_d = factura.items) === null || _d === void 0 ? void 0 : _d.length) > 0 && (detalleActual === null || detalleActual === void 0 ? void 0 : detalleActual.facturamaEnvio) === true && mismoCronograma) {
                            _this.productosAgregados = factura.items.map(function (item) {
                                var _a;
                                return ({
                                    cantidad: item.quantity || 1,
                                    claveProducto: item.productCode || '',
                                    claveUnidad: item.unitCode || '',
                                    unit: item.unit || '',
                                    descripcion: item.description || '',
                                    precio: item.unitPrice || 0,
                                    subtotal: item.subtotal || 0,
                                    taxObject: item.taxObject || '',
                                    total: item.total || 0,
                                    iva: ((_a = item.taxes) === null || _a === void 0 ? void 0 : _a.reduce(function (sum, t) { return sum + (t.total || 0); }, 0)) || 0
                                });
                            });
                        }
                        else {
                            var cuota = parseFloat((detalleActual === null || detalleActual === void 0 ? void 0 : detalleActual.cuota) || 0);
                            var mora = parseFloat((detalleActual === null || detalleActual === void 0 ? void 0 : detalleActual.mora) || 0);
                            var suma = cuota + mora;
                            var precioUnitario = +(suma / 1.16).toFixed(2);
                            var subtotal = +(precioUnitario).toFixed(2);
                            var iva = +(subtotal * 0.16).toFixed(2);
                            var total = +(subtotal + iva).toFixed(2);
                            _this.productosAgregados = [{
                                    cantidad: 1,
                                    claveProducto: '86111500',
                                    claveUnidad: 'E48',
                                    unit: 'Unidad de servicio',
                                    descripcion: "SERVICIOS EDUCATIVOS - " + (cliente.name || ''),
                                    precio: precioUnitario,
                                    subtotal: subtotal,
                                    taxObject: '02',
                                    total: total,
                                    iva: iva,
                                    identificacionProducto: "PROD" + new Date().getTime(),
                                    esCalculadoDesdeCronograma: true
                                }];
                        }
                        _this.calcularTotalesGenerales();
                        setTimeout(function () {
                            _this.dialog.open(_this.modalDetallesFactura, {
                                width: "90%",
                                maxWidth: "1200px",
                                disableClose: true,
                                panelClass: "factura-global-dialog"
                            });
                        }, 100);
                    }
                    else {
                        var detalle_1 = (_e = _this.cronogramasPorAlumno[codigo]) === null || _e === void 0 ? void 0 : _e.find(function (d) { return d.id === idCronograma; });
                        if (!detalle_1) {
                            _this.alertaService.mensajeError("No se encontró un cronograma asociado.");
                            return;
                        }
                        _this.ObtenerAlumnoProgramaPorMatricula(codigo, function () {
                            var _a;
                            var alumno = _this.listaPrograma[0];
                            if (!alumno) {
                                _this.alertaService.mensajeError("No se encontraron datos del alumno.");
                                return;
                            }
                            _this.nombreCentroCosto = alumno.nombreCentroCosto;
                            _this.formCrearFacturaFacturama.patchValue({
                                ReceiverName: alumno.nombreCompleto,
                                Email: alumno.correoAlumno,
                                Description: "SERVICIOS EDUCATIVOS - " + alumno.nombreCentroCosto,
                                codigoMat: codigo
                            });
                            (_a = _this.formCrearFacturaFacturama.get("productoSeleccionado")) === null || _a === void 0 ? void 0 : _a.setValue("Producto Generico");
                            var cuota = parseFloat((detalle_1 === null || detalle_1 === void 0 ? void 0 : detalle_1.cuota) || 0);
                            var mora = parseFloat((detalle_1 === null || detalle_1 === void 0 ? void 0 : detalle_1.mora) || 0);
                            var suma = cuota + mora;
                            var precioUnitario = +(suma / 1.16).toFixed(2);
                            var subtotal = +(precioUnitario).toFixed(2);
                            var iva = +(subtotal * 0.16).toFixed(2);
                            var total = +(subtotal + iva).toFixed(2);
                            _this.productosAgregados = [{
                                    cantidad: 1,
                                    claveProducto: '86111500',
                                    claveUnidad: 'E48',
                                    unit: 'Unidad de servicio',
                                    descripcion: "SERVICIOS EDUCATIVOS - " + alumno.nombreCentroCosto,
                                    precio: precioUnitario,
                                    subtotal: subtotal,
                                    taxObject: '02',
                                    total: total,
                                    iva: iva,
                                    identificacionProducto: "PROD" + new Date().getTime(),
                                    esCalculadoDesdeCronograma: true
                                }];
                            _this.calcularTotalesGenerales();
                            setTimeout(function () {
                                _this.dialog.open(_this.modalDetallesFactura, {
                                    width: "90%",
                                    maxWidth: "1200px",
                                    disableClose: true,
                                    panelClass: "factura-global-dialog"
                                });
                            }, 100);
                        });
                    }
                },
                error: function () {
                    _this.alertaService.mensajeError("Error al obtener datos de la factura.");
                }
            });
        }
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.validarYGuardar = function () {
        var _this = this;
        var id = this.idCronogramaPagoDetalleFinal;
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ValidarFacturaGuardada + "?idCronogramaPagoDetalleFinal=" + id)
            .subscribe({
            next: function (resp) {
                var existe = resp.body;
                if (existe) {
                    sweetalert2_1["default"].fire("Atención", "Ya existe una factura configurada para este cronograma.", "warning");
                }
                else {
                    _this.guardarFacturaInterna();
                }
            },
            error: function (err) {
                _this.alertaService.mensajeError("No se pudo validar si ya existe factura: " + err.message);
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.guardarFacturaInterna = function () {
        var _this = this;
        var datosFormulario = this.formCrearFacturaFacturama.value;
        var codigo = this.estudianteSeleccionado.codigoMatricula;
        var idCronograma = this.idCronogramaPagoDetalleFinal;
        var jsonGuardar = {
            factura: {
                CfdiType: datosFormulario.CfdiType,
                PaymentForm: datosFormulario.PaymentForm,
                PaymentMethod: datosFormulario.PaymentMethod,
                Currency: "MXN",
                ExpeditionPlace: datosFormulario.ExpeditionPlace || '',
                Receiver: {
                    Name: datosFormulario.ReceiverName,
                    Rfc: datosFormulario.ReceiverRfc,
                    CfdiUse: datosFormulario.CfdiUse,
                    FiscalRegime: datosFormulario.FiscalRegime,
                    TaxZipCode: datosFormulario.TaxZipCode
                },
                Items: this.productosAgregados.map(function (producto) {
                    var cantidad = producto.cantidad || 1;
                    var precioUnitario = producto.precio || 0;
                    var subtotal = cantidad * precioUnitario;
                    var ivaTotal = subtotal * 0.16;
                    var totalFinal = subtotal + ivaTotal;
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
        this.integraService.postJsonResponse(constApi_1.constApiFinanzas.GuardarFacturaInterna + "?codigoMatricula=" + codigo + "&idCronogramaPagoDetalleFinal=" + idCronograma, jsonGuardar).subscribe({
            next: function () {
                sweetalert2_1["default"].fire("¡Guardado!", "Los datos fueron almacenados correctamente.", "success");
                _this.cerrarModalDetalles();
            },
            error: function (err) {
                _this.alertaService.mensajeError("Error al guardar los datos internos: " + err.message);
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.prepararFacturaGlobal = function () {
        var _this = this;
        var _a;
        this.limpiarFormularioFacturaGlobal();
        var codigo = this.estudianteSeleccionado.codigoMatricula;
        var idCronograma = this.idCronogramaPagoDetalleFinal;
        var detalle = (_a = this.cronogramasPorAlumno[codigo]) === null || _a === void 0 ? void 0 : _a.find(function (d) { return d.id === idCronograma; });
        if (!detalle) {
            this.alertaService.mensajeError("No se encontró cronograma para esta matrícula.");
            return;
        }
        // 1. Obtener posibles datos guardados (solo algunos campos)
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerFacturaPorCodigoMatricula + "/" + codigo)
            .subscribe({
            next: function (resp) {
                var _a;
                var data = resp.body;
                var direccion = (_a = data === null || data === void 0 ? void 0 : data.cliente) === null || _a === void 0 ? void 0 : _a.address;
                // 2. Si hay dirección, setear solo los 5 campos permitidos
                if (direccion) {
                    _this.formFacturaGlobal.patchValue({
                        Street: direccion.street || 'CALLE GENERAL',
                        ExteriorNumber: direccion.exteriorNumber || 'S/N',
                        InteriorNumber: direccion.interiorNumber || 'S/N',
                        Neighborhood: direccion.neighborhood || 'CENTRO',
                        Municipality: direccion.municipality || 'CDMX'
                    });
                }
                // 3. Setear SIEMPRE los valores por defecto para el resto
                _this.setearValoresPorDefectoFacturaGlobalApi();
                // 4. Luego obtener los datos del alumno + calcular producto
                _this.ObtenerAlumnoProgramaPorMatricula(codigo, function () {
                    var alumno = _this.listaPrograma[0];
                    if (!alumno) {
                        _this.alertaService.mensajeError("No se encontraron datos del alumno.");
                        return;
                    }
                    _this.nombreCentroCosto = alumno.nombreCentroCosto;
                    _this.formFacturaGlobal.patchValue({
                        ReceiverName: alumno.nombreCompleto,
                        Email: alumno.correoAlumno,
                        Description: "SERVICIOS EDUCATIVOS - " + alumno.nombreCentroCosto,
                        productoSeleccionado: "Producto Generico"
                    });
                    var cuota = parseFloat((detalle === null || detalle === void 0 ? void 0 : detalle.cuota) || 0);
                    var mora = parseFloat((detalle === null || detalle === void 0 ? void 0 : detalle.mora) || 0);
                    var suma = cuota + mora;
                    var precioUnitario = +(suma / 1.16).toFixed(2);
                    var subtotal = +(precioUnitario).toFixed(2);
                    var iva = +(subtotal * 0.16).toFixed(2);
                    var total = +(subtotal + iva).toFixed(2);
                    _this.productosAgregados = [{
                            cantidad: 1,
                            claveProducto: '86111500',
                            claveUnidad: 'E48',
                            unit: 'Unidad de servicio',
                            descripcion: "SERVICIOS EDUCATIVOS - " + alumno.nombreCentroCosto,
                            precio: precioUnitario,
                            subtotal: subtotal,
                            taxObject: '02',
                            total: total,
                            iva: iva,
                            identificacionProducto: "PROD" + new Date().getTime(),
                            esCalculadoDesdeCronograma: true
                        }];
                    _this.calcularTotalesGenerales();
                    _this.dialog.open(_this.modalFacturaGlobal, {
                        width: "90%",
                        maxWidth: "1200px",
                        disableClose: true,
                        panelClass: "factura-global-dialog"
                    });
                });
            },
            error: function () {
                // Si falló la consulta → setear valores por defecto y continuar igual
                _this.setearValoresPorDefectoFacturaGlobal();
                _this.ObtenerAlumnoProgramaPorMatricula(codigo, function () {
                    var alumno = _this.listaPrograma[0];
                    if (!alumno) {
                        _this.alertaService.mensajeError("No se encontraron datos del alumno.");
                        return;
                    }
                    _this.nombreCentroCosto = alumno.nombreCentroCosto;
                    _this.formFacturaGlobal.patchValue({
                        ReceiverName: alumno.nombreCompleto,
                        Email: alumno.correoAlumno,
                        Description: "SERVICIOS EDUCATIVOS - " + alumno.nombreCentroCosto,
                        productoSeleccionado: "Producto Generico"
                    });
                    var cuota = parseFloat((detalle === null || detalle === void 0 ? void 0 : detalle.cuota) || 0);
                    var mora = parseFloat((detalle === null || detalle === void 0 ? void 0 : detalle.mora) || 0);
                    var suma = cuota + mora;
                    var precioUnitario = +(suma / 1.16).toFixed(2);
                    var subtotal = +(precioUnitario).toFixed(2);
                    var iva = +(subtotal * 0.16).toFixed(2);
                    var total = +(subtotal + iva).toFixed(2);
                    _this.productosAgregados = [{
                            cantidad: 1,
                            claveProducto: '86111500',
                            claveUnidad: 'E48',
                            unit: 'Unidad de servicio',
                            descripcion: "SERVICIOS EDUCATIVOS - " + alumno.nombreCentroCosto,
                            precio: precioUnitario,
                            subtotal: subtotal,
                            taxObject: '02',
                            total: total,
                            iva: iva,
                            identificacionProducto: "PROD" + new Date().getTime(),
                            esCalculadoDesdeCronograma: true
                        }];
                    _this.calcularTotalesGenerales();
                    _this.dialog.open(_this.modalFacturaGlobal, {
                        width: "90%",
                        maxWidth: "1200px",
                        disableClose: true,
                        panelClass: "factura-global-dialog"
                    });
                });
            }
        });
    };
    // Método para cerrar modal de factura
    CronogramaGeneralEmisionFacturaComponent.prototype.cerrarModalFactura = function () {
        this.dialog.closeAll();
    };
    // Método para cerrar modal de detalles
    CronogramaGeneralEmisionFacturaComponent.prototype.cerrarModalDetalles = function () {
        this.dialog.closeAll();
    };
    // Método para abrir modal de facturación masiva
    CronogramaGeneralEmisionFacturaComponent.prototype.abrirModalFacturacionMasiva = function () {
        this.obtenerFacturasPendientesEnvio(); // ← Esta función ya está perfecta
        this.dialog.open(this.modalFacturacionMasiva, {
            width: "1100px",
            maxHeight: "90vh",
            panelClass: "custom-dialog"
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.abrirModalFacturacionMasivaSiigo = function () {
        this.btenerFacturasPendientesEnvioSiigo(); // ← Esta función ya está perfecta
        this.dialog.open(this.modalFacturacionMasivaSiigo, {
            width: "1100px",
            maxHeight: "90vh",
            panelClass: "custom-dialog"
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.emitirFactura = function () {
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
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.toggleSeleccionIndividual = function (id, checked) {
        if (checked) {
            if (!this.estudiantesSeleccionadosMasivos.includes(id)) {
                this.estudiantesSeleccionadosMasivos.push(id);
            }
        }
        else {
            this.estudiantesSeleccionadosMasivos = this.estudiantesSeleccionadosMasivos.filter(function (val) { return val !== id; });
        }
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.filtrarPorPais = function (pais) {
        this.paisSeleccionado = pais;
        var paisCodigo = pais === 'México' ? 'MEX' :
            pais === 'Colombia' ? 'CO' : '';
        this.estudiantesSeleccionadosMasivos = [];
        var listaFiltrada = paisCodigo === ''
            ? this.estudiantesOriginal
            : this.estudiantesOriginal.filter(function (est) { return est.pais === paisCodigo; });
        this.estudiantesConfigurados = listaFiltrada.map(function (f) { return ({
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
        }); });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.obtenerFacturasPendientesEnvio = function () {
        var _this = this;
        this.integraService.getJsonResponse("" + constApi_1.constApiFinanzas.ListarPendientesEnvio).subscribe({
            next: function (resp) {
                _this.facturasPendientes = resp.body || [];
                _this.estudiantesOriginal = __spreadArrays(_this.facturasPendientes);
                _this.filtrarPorPais(_this.paisSeleccionado);
            },
            error: function (error) {
                _this.alertaService.mensajeError("Error al obtener facturas pendientes: " + error.message);
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.btenerFacturasPendientesEnvioSiigo = function () {
        var _this = this;
        this.integraService.getJsonResponse("" + constApi_1.constApiFinanzas.ListarPendientesEnvioSiigo).subscribe({
            next: function (resp) {
                _this.facturasPendientes = resp.body || [];
                _this.estudiantesOriginal = __spreadArrays(_this.facturasPendientes);
                _this.filtrarPorPais(_this.paisSeleccionado);
            },
            error: function (error) {
                _this.alertaService.mensajeError("Error al obtener facturas pendientes: " + error.message);
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.toggleSeleccionarTodos = function (checked) {
        if (checked) {
            this.estudiantesSeleccionadosMasivos = this.estudiantesConfigurados.map(function (item, index) {
                return item.codigoMatricula + '_' + index;
            });
        }
        else {
            this.estudiantesSeleccionadosMasivos = [];
        }
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.cerrarModalFacturacionMasiva = function () {
        this.dialog.closeAll();
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.cerrarModalFacturacionMasivaSiigo = function () {
        this.dialog.closeAll();
    };
    // Método para emitir facturas masivas
    CronogramaGeneralEmisionFacturaComponent.prototype.emitirFacturasMasivas = function () {
        var _this = this;
        if (this.estudiantesSeleccionadosMasivos.length === 0)
            return;
        this.loader = true;
        var usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
        var usuario = usuarioData.userName;
        var idsFacturas = this.estudiantesSeleccionadosMasivos
            .map(function (compuesto) {
            var _a;
            var _b = compuesto.split('_'), codigo = _b[0], index = _b[1];
            return (_a = _this.facturasPendientes.find(function (f) {
                return f.codigoMatricula === codigo &&
                    _this.facturasPendientes.indexOf(f) === parseInt(index, 10);
            })) === null || _a === void 0 ? void 0 : _a.idFactura;
        })
            .filter(function (id) { return !!id; });
        var payload = {
            idsFacturas: idsFacturas,
            usuario: usuario
        };
        this.integraService.postJsonResponse("" + constApi_1.constApiFinanzas.EnviarFacturasMasivasLote, payload).subscribe({
            next: function () {
                _this.alertaService.mensajeExitoso("Facturación masiva iniciada correctamente.");
                _this.loader = false;
                _this.cerrarModalFacturacionMasiva();
                _this.obtenerFacturasPendientesEnvio();
            },
            error: function (error) {
                _this.loader = false;
                console.error("❌ Error al enviar facturas masivas:", error);
                _this.alertaService.mensajeError("Error al enviar facturas masivas: " + error.message);
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.obtenerIdCodigoPais = function (pais) {
        switch (pais) {
            case "Mexico": return 52;
            case "Colombia": return 57;
            case "Peru": return 51;
            default: return null;
        }
    };
    // Método para buscar
    CronogramaGeneralEmisionFacturaComponent.prototype.buscar = function () {
        this.loader = true;
        // Implementar lógica de búsqueda
        console.log("Buscando con fechas:", this.formFiltro.value.fechaInicio, this.formFiltro.value.fechaFin);
        this.obtenerGrilaCronogramaGeneralFactura();
    };
    // Método para formatear forma de pago
    CronogramaGeneralEmisionFacturaComponent.prototype.ObtenerDatosPago = function () {
        var _this = this;
        // Obtiene los combos de FormaPago,Documento,Cuenta para los pagos
        this.integraService.postJsonResponse("" + constApi_1.constApiFinanzas.ObtenerDatosPago, null).subscribe({
            next: function (response) {
                _this.listaFormaPago = response.body.listaFormaPago;
                _this.listaCuenta = response.body.listadoCuentasCorrientesFinal;
                _this.listaDocumentoPago = response.body.listaDocumentoPago;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "MODAL - Combo datos pagos");
            },
            complete: function () { }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.formaPagoTemplate = function (idFormaPago) {
        var _a;
        var id = Number.parseInt(idFormaPago); // Asegura que se compara como número
        var item = this.listaFormaPago.find(function (e) { return e.id === id; });
        return (_a = item === null || item === void 0 ? void 0 : item.descripcion) !== null && _a !== void 0 ? _a : "Sin descripción";
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.obtenerChecked = function (event) {
        return event.target.checked;
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.getCheckedValue = function (event) {
        return event.target.checked;
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.getControl = function (nombre) {
        return this.formFiltro.get(nombre);
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.abrirModalFacturaGlobal = function () {
        var dialogRef = this.dialog.open(this.modalFacturaGlobal, {
            width: "90%",
            maxWidth: "1200px",
            disableClose: true,
            panelClass: "factura-global-dialog"
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.cerrarModalFacturaGlobal = function () {
        this.dialog.closeAll();
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.toggleOpcionesAdicionales = function () {
        this.mostrarOpcionesAdicionales = !this.mostrarOpcionesAdicionales;
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.onProductoSeleccionado = function () {
        var _a;
        var formularioActual = this.tipoFactura === 'global' ? this.formFacturaGlobal : this.formCrearFacturaFacturama;
        //const productoSeleccionado = formularioActual.get("productoSeleccionado")?.value;
        console.log("Producto seleccionado:", (_a = formularioActual.get("productoSeleccionado")) === null || _a === void 0 ? void 0 : _a.value);
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.agregarProducto = function () {
        var _this = this;
        var _a, _b;
        var formularioActual = this.tipoFactura === 'global'
            ? this.formFacturaGlobal
            : this.formCrearFacturaFacturama;
        var productoSeleccionado = (_a = formularioActual.get("productoSeleccionado")) === null || _a === void 0 ? void 0 : _a.value;
        if (!productoSeleccionado) {
            this.alertaService.mensajeError("Debe seleccionar un producto");
            return;
        }
        var codigo = this.estudianteSeleccionado.codigoMatricula;
        var cronograma = this.cronogramasPorAlumno[codigo] || [];
        var detalle = cronograma.find(function (d) { return d.id === _this.idCronogramaPagoDetalleFinal; });
        var precioUnitario = 0;
        if (detalle) {
            var cuota = parseFloat(detalle.cuota || 0);
            var mora = parseFloat(detalle.mora || 0);
            var suma = cuota + mora;
            precioUnitario = +(suma / 1.16).toFixed(2);
        }
        var cantidad = 1;
        var subtotal = +(cantidad * precioUnitario).toFixed(2);
        var iva = +(subtotal * 0.16).toFixed(2);
        var total = +(subtotal + iva).toFixed(2);
        var nuevoProducto = {
            cantidad: cantidad,
            claveProducto: '86111500',
            claveUnidad: 'E48',
            unit: 'Unidad de servicio',
            descripcion: productoSeleccionado,
            descripcionAdicional: '',
            precio: precioUnitario,
            subtotal: subtotal,
            tipoDescuento: "-",
            valorDescuento: 0,
            taxObject: '02',
            total: total,
            iva: iva,
            esGenerico: productoSeleccionado === 'Producto Generico',
            identificacionProducto: "PROD" + new Date().getTime(),
            esCalculadoDesdeCronograma: true
        };
        this.productosAgregados.push(nuevoProducto);
        this.calcularTotalesGenerales();
        (_b = formularioActual.get("productoSeleccionado")) === null || _b === void 0 ? void 0 : _b.setValue("");
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.calcularTotales = function (index) {
        var producto = this.productosAgregados[index];
        var cantidad = producto.cantidad || 0;
        var precioOriginal = producto.precio || 0;
        var precioSinIgv = producto.esCalculadoDesdeCronograma
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
        var total = producto.subtotal;
        if (producto.tipoDescuento === "%") {
            total -= (producto.subtotal * producto.valorDescuento) / 100;
        }
        else if (producto.tipoDescuento === "$") {
            total -= producto.valorDescuento;
        }
        // IVA
        var iva = 0;
        if (producto.taxObject === '02') {
            iva = +(total * 0.16).toFixed(2);
        }
        producto.iva = iva;
        producto.total = +(total + iva).toFixed(2);
        this.calcularTotalesGenerales();
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.editarProducto = function (index) {
        console.log("Editando producto en índice:", index);
        // Aquí iría la lógica para editar un producto
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.eliminarProducto = function (index) {
        this.productosAgregados.splice(index, 1);
        this.calcularTotalesGenerales();
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.calcularTotalesGenerales = function () {
        this.subtotalGeneral = this.productosAgregados.reduce(function (acc, p) { return acc + (p.subtotal || 0); }, 0);
        this.totalGeneral = this.productosAgregados.reduce(function (acc, p) { return acc + (p.total || 0); }, 0);
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.vistaPrevia = function () {
        console.log("Generando vista previa de la factura");
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.crearFactura = function () {
        console.log("Creando factura con datos:", {
            datosFactura: this.formFacturaGlobal.value,
            productos: this.productosAgregados,
            totales: {
                subtotal: this.subtotalGeneral,
                total: this.totalGeneral
            }
        });
        this.dialog.closeAll();
    };
    // Método para emitir factura global con Facturama
    CronogramaGeneralEmisionFacturaComponent.prototype.emitirFacturaGlobal = function () {
        var _this = this;
        this.emitiendo = true;
        this.resultadoFactura = null;
        this.errorFactura = null;
        // Preparar el JSON para Facturama
        var facturaData = {
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
                Year: 2025
            },
            Receiver: {
                Rfc: "XAXX010101000",
                Name: "PÚBLICO EN GENERAL",
                CfdiUse: "S01",
                FiscalRegime: "616",
                TaxZipCode: "01000"
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
                            IsFederalTax: true
                        },
                    ],
                    Total: 348.0
                },
            ]
        };
        var httpOptions = {
            headers: new http_1.HttpHeaders({
                "Content-Type": "application/json",
                Authorization: "Basic " + btoa("tu_usuario:tu_contraseña")
            })
        };
        this.http.post("https://api.facturama.mx/3/cfdis", facturaData, httpOptions).subscribe(function (response) {
            _this.emitiendo = false;
            _this.resultadoFactura = response;
            _this.mostrarResultadoFactura();
        }, function (error) {
            _this.emitiendo = false;
            _this.errorFactura = error.message || "Error al emitir la factura";
            _this.mostrarResultadoFactura();
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.formatearFechaFactura = function () {
        var _a;
        var fecha = ((_a = this.resultadoFactura) === null || _a === void 0 ? void 0 : _a.date) ? new Date(this.resultadoFactura.date) : new Date();
        return new Intl.DateTimeFormat('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        }).format(fecha);
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.mostrarResultadoFactura = function () {
        var dialogRef = this.dialog.open(this.modalResultadoFactura, {
            width: "500px",
            disableClose: false
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.cerrarModalResultado = function () {
        this.dialog.closeAll();
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.descargarFactura = function () {
        if (this.resultadoFactura && this.resultadoFactura.id) {
            window.open("https://api.facturama.mx/Cfdi?id=" + this.resultadoFactura.id + "&format=pdf", "_blank");
        }
    };
    // Agregar esta función después de inicializarFormularios()
    CronogramaGeneralEmisionFacturaComponent.prototype.inicializarFormularioCliente = function () {
        this.formCliente = this.formBuilder.group({
            nombreRazonSocial: ["", forms_1.Validators.required],
            rfc: ["", [forms_1.Validators.required, forms_1.Validators.minLength(12), forms_1.Validators.maxLength(13)]],
            usoCfdi: ["", forms_1.Validators.required],
            regimenFiscal: ["", forms_1.Validators.required],
            email: ["", [forms_1.Validators.email]],
            emailOpcional1: ["", [forms_1.Validators.email]],
            emailOpcional2: ["", [forms_1.Validators.email]],
            codigoPostal: ["", [forms_1.Validators.pattern(/^\d{5}$/)]],
            // Campos opcionales adicionales
            calle: [""],
            noExterior: [""],
            noInterior: [""],
            colonia: [""],
            localidad: [""],
            municipio: [""],
            estado: [""],
            pais: ["MEXICO"]
        });
    };
    // Agregar estas funciones para manejar los modales de cliente
    CronogramaGeneralEmisionFacturaComponent.prototype.abrirModalNuevoCliente = function () {
        this.formCliente.reset();
        this.formCliente.patchValue({
            pais: "MEXICO"
        });
        this.mostrarDatosOpcionales = false;
        this.dialog.open(this.modalNuevoCliente, {
            width: "600px",
            disableClose: true,
            panelClass: "cliente-dialog",
            autoFocus: false
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.abrirModalEditarCliente = function () {
        // Obtener el cliente seleccionado del dropdown
        var clienteSeleccionado = this.formFacturaGlobal.get("cliente").value;
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
            pais: "MEXICO"
        };
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
            pais: this.clienteSeleccionado.pais
        });
        this.dialog.open(this.modalEditarCliente, {
            width: "600px",
            disableClose: true,
            panelClass: "cliente-dialog",
            autoFocus: false
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.toggleDatosOpcionales = function () {
        this.mostrarDatosOpcionales = !this.mostrarDatosOpcionales;
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.guardarCliente = function () {
        var _this = this;
        if (this.formCliente.invalid) {
            this.formCliente.markAllAsTouched();
            return;
        }
        this.alertaService.mensajeExitoso("Cliente guardado correctamente");
        this.dialog.closeAll();
        // Cerrar solo el diálogo actual
        var currentDialog = this.dialog.openDialogs[this.dialog.openDialogs.length - 1];
        if (currentDialog) {
            currentDialog.close();
        }
        // Actualizar el dropdown de clientes (simulado)
        // En un caso real, recargarías la lista de clientes desde el servidor
        setTimeout(function () {
            // Seleccionar el cliente recién creado en el dropdown
            _this.formFacturaGlobal.get("cliente").setValue(_this.formCliente.get("nombreRazonSocial").value);
        }, 500);
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.cerrarModalCliente = function () {
        // Obtener la referencia al diálogo actual (el último en la pila de diálogos)
        var currentDialog = this.dialog.openDialogs[this.dialog.openDialogs.length - 1];
        if (currentDialog) {
            currentDialog.close();
        }
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.obtenerListaRegimenFiscalFacturama = function () {
        var _this = this;
        this.integraService.getJsonResponse("" + constApi_1.constApiFinanzas.ObtenerListaRegimenFiscal).subscribe({
            next: function (response) {
                _this.listaFacturmaRegimenFiscal = response.body;
                _this.listaFiltradaRegimenFiscal = __spreadArrays(_this.listaFacturmaRegimenFiscal);
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "Lista - Régimen Fiscal");
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.obtenerListaUsoCfdiFacturama = function () {
        var _this = this;
        this.integraService.getJsonResponse("" + constApi_1.constApiFinanzas.ObtenerListaUsoCfdi).subscribe({
            next: function (response) {
                _this.listaFacturmaUsoCfdi = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "Lista - Uso CFDI");
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.obtenerListaFormaPagoFacturama = function () {
        var _this = this;
        this.integraService.getJsonResponse("" + constApi_1.constApiFinanzas.ObtenerFormapagoFacturama).subscribe({
            next: function (response) {
                _this.listaFacturamaFormaPago = response.body;
                _this.listaFiltradaFormaPago = __spreadArrays(_this.listaFacturamaFormaPago); // copio aquí
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "Lista - Forma Pago");
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.filtrarFormaPago = function (valor) {
        var filtro = valor.toLowerCase();
        this.listaFiltradaFormaPago = this.listaFacturamaFormaPago.filter(function (fp) {
            return (fp.valor + " - " + fp.descripcion).toLowerCase().includes(filtro);
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.filtrarRegimenFiscal = function (valor) {
        var filtro = valor.toLowerCase();
        this.listaFiltradaRegimenFiscal = this.listaFacturmaRegimenFiscal.filter(function (rf) {
            return (rf.clave + " - " + rf.descripcion).toLowerCase().includes(filtro);
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.EnviarFacturaYCliente = function () {
        var _this = this;
        var datosFormulario = this.formCrearFacturaFacturama.value;
        var usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
        var usuarioModificacion = usuarioData.userName;
        if (!datosFormulario.ReceiverRfc || !datosFormulario.ReceiverName) {
            this.alertaService.mensajeError('El RFC y el Nombre del receptor son obligatorios.');
            return;
        }
        var datosCompletos = {
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
                Items: this.productosAgregados.map(function (producto) {
                    var cantidad = producto.cantidad || 1;
                    var precioUnitario = producto.precio || 0;
                    var subtotal = cantidad * precioUnitario;
                    var ivaTotal = subtotal * 0.16;
                    var totalFinal = subtotal + ivaTotal;
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
        console.log('Datos completos enviados:', datosCompletos);
        this.integraService.postJsonResponse(constApi_1.constApiFinanzas.CrearFacturaFacturama, datosCompletos).subscribe({
            next: function (response) {
                if (response.status === 201 || response.status === 200) {
                    _this.actualizarEstadoFacturamaEnvio(_this.idCronogramaPagoDetalleFinal, usuarioModificacion);
                    sweetalert2_1["default"].fire({
                        title: '¡Éxito!',
                        text: 'Factura y cliente enviados correctamente.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#3085d6'
                    }).then(function () {
                        _this.dialog.closeAll();
                        var codigo = _this.estudianteSeleccionado.codigoMatricula;
                        _this.obtenerCronogramaEstudiante(codigo);
                    });
                    var codigo = _this.estudianteSeleccionado.codigoMatricula; // <-- Este es el correcto
                    _this.obtenerCronogramaEstudiante(codigo);
                }
                else {
                    console.warn('Respuesta inesperada:', response.body);
                }
            },
            error: function (error) {
                console.error('Error en la solicitud:', error);
                _this.alertaService.mensajeError('Ocurrió un error al enviar los datos: ' + error.message);
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.actualizarEstadoFacturamaEnvio = function (id, usuarioModificacion) {
        if (!id) {
            console.error('ID no definido, no se puede realizar la actualización.');
            return;
        }
        if (!usuarioModificacion) {
            console.error('UsuarioModificacion no definido, no se puede realizar la actualización.');
            return;
        }
        var url = constApi_1.constApiFinanzas.ActualizarFacturamaEnvio + "/" + id + "/" + usuarioModificacion;
        console.log('URL generada:', url);
        this.integraService.putJsonResponse(url)
            .subscribe({
            next: function (response) {
                console.log('Respuesta exitosa:', response);
            },
            error: function (error) {
                console.error('Error en la solicitud:', error);
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.enviarFacturaDesdeBD = function () {
        var _this = this;
        var codigo = this.estudianteSeleccionado.codigoMatricula;
        var usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
        var usuario = usuarioData.userName;
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerIdFacturaPorCodigo + "/" + codigo).subscribe({
            next: function (resp) {
                var _a;
                var idFactura = (_a = resp.body) === null || _a === void 0 ? void 0 : _a.idFactura;
                if (!idFactura) {
                    _this.alertaService.mensajeError("No se encontró una factura asociada a la matrícula.");
                    return;
                }
                var payload = { idFactura: idFactura, usuario: usuario };
                _this.integraService.postJsonResponse("" + constApi_1.constApiFinanzas.EnviarFacturaApi, payload).subscribe({
                    next: function (response) {
                        if (response.status === 200 || response.status === 201) {
                            _this.actualizarEstadoFacturamaEnvio(_this.idCronogramaPagoDetalleFinal, usuario);
                            sweetalert2_1["default"].fire({
                                title: '¡Éxito!',
                                text: 'Factura enviada correctamente a Facturama.',
                                icon: 'success',
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#3085d6'
                            }).then(function () {
                                _this.dialog.closeAll();
                                _this.obtenerCronogramaEstudiante(codigo);
                            });
                        }
                        else {
                            console.warn("Respuesta inesperada:", response);
                        }
                    },
                    error: function (err) {
                        _this.alertaService.mensajeError("Error al enviar la factura: " + err.message);
                    }
                });
            },
            error: function () {
                _this.alertaService.mensajeError("No se pudo obtener el ID de la factura.");
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.validarYGuardarFacturaGlobal = function () {
        var _this = this;
        var id = this.idCronogramaPagoDetalleFinal;
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ValidarFacturaGuardada + "?idCronogramaPagoDetalleFinal=" + id)
            .subscribe({
            next: function (resp) {
                var existe = resp.body;
                if (existe) {
                    sweetalert2_1["default"].fire("Atención", "Ya existe una factura global configurada para este cronograma.", "warning");
                }
                else {
                    _this.guardarFacturaInternaGlobal();
                }
            },
            error: function (err) {
                _this.alertaService.mensajeError("No se pudo validar si ya existe factura: " + err.message);
            }
        });
    };
    //factura global
    CronogramaGeneralEmisionFacturaComponent.prototype.guardarFacturaInternaGlobal = function () {
        var _this = this;
        var datosFormulario = this.formFacturaGlobal.value;
        var codigo = this.estudianteSeleccionado.codigoMatricula;
        var idCronograma = this.idCronogramaPagoDetalleFinal;
        var jsonGuardar = {
            factura: {
                CfdiType: datosFormulario.CfdiType,
                PaymentForm: datosFormulario.PaymentForm,
                PaymentMethod: datosFormulario.PaymentMethod,
                Currency: "MXN",
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
                Items: this.productosAgregados.map(function (producto) {
                    var cantidad = producto.cantidad || 1;
                    var precioUnitario = producto.precio || 0;
                    var subtotal = cantidad * precioUnitario;
                    var ivaTotal = subtotal * 0.16;
                    var totalFinal = subtotal + ivaTotal;
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
        this.integraService.postJsonResponse(constApi_1.constApiFinanzas.GuardarFacturaGlobalInterna + "?codigoMatricula=" + codigo + "&idCronogramaPagoDetalleFinal=" + idCronograma, jsonGuardar)
            .subscribe({
            next: function () {
                sweetalert2_1["default"].fire("¡Guardado!", "Factura global guardada correctamente.", "success");
            },
            error: function (err) {
                _this.alertaService.mensajeError("Error al guardar la factura global: " + err.message);
                _this.cerrarModalFacturacionMasiva();
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.enviarFacturaGlobalDesdeBD = function () {
        var _this = this;
        var usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
        var usuario = usuarioData.userName;
        this.integraService.getJsonResponse("" + constApi_1.constApiFinanzas.ObtenerIdFacturaGlobal).subscribe({
            next: function (resp) {
                var _a;
                var idFactura = (_a = resp.body) === null || _a === void 0 ? void 0 : _a.idFactura;
                if (!idFactura) {
                    _this.alertaService.mensajeError("No se encontró una factura global pendiente.");
                    return;
                }
                var payload = { idFactura: idFactura, usuario: usuario };
                _this.integraService.postJsonResponse("" + constApi_1.constApiFinanzas.EnviarFacturaGlobalApi, payload).subscribe({
                    next: function () {
                        sweetalert2_1["default"].fire("¡Éxito!", "Factura Global enviada correctamente.", "success");
                        _this.dialog.closeAll();
                    },
                    error: function (err) {
                        _this.alertaService.mensajeError("Error al enviar factura global: " + err.message);
                    }
                });
            },
            error: function () {
                _this.alertaService.mensajeError("No se pudo obtener el ID de la factura global.");
            }
        });
    };
    // FACTRURA SIIGO
    CronogramaGeneralEmisionFacturaComponent.prototype.ObtenerListaDepartamentos = function () {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerDepartamentoPaiCombo)
            .subscribe({
            next: function (resp) {
                _this.dataDepartamentos = resp.body;
            },
            error: function (error) {
                console.log(error);
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.ObtenerListaCiudades = function () {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerCiudadesDepartamentoPaiCombo)
            .subscribe({
            next: function (resp) {
                _this.dataCiudades = resp.body;
            },
            error: function (error) {
                console.log(error);
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.TipoCambioDolarPesoColombiano = function (monto) {
        var tipo = Number(this.montoTipoCambioPesoColombiano || 0);
        return Number((monto * tipo).toFixed(2));
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.ObtenerTipoCambioDolarPesoColombiano = function (fecha, callback) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerPesosDolaresTipoCambioColombia + '/' + fecha)
            .subscribe({
            next: function (resp) {
                _this.montoTipoCambioPesoColombiano = resp.body.pesosDolares;
            },
            error: function (error) {
                console.log(error);
                _this.montoTipoCambioPesoColombiano = 0;
            },
            complete: function () {
                if (callback)
                    callback(); //
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.ObtenerAlumnoProgramaPorMatriculaFacturma = function (codMat, callback) {
        var _this = this;
        var _a, _b;
        (_a = this.formMatricula.get('alumno')) === null || _a === void 0 ? void 0 : _a.reset();
        (_b = this.formMatricula.get('idPrograma')) === null || _b === void 0 ? void 0 : _b.reset();
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerAlumnoProgramaEspecifico + "/" + codMat)
            .subscribe({
            next: function (response) {
                var _a, _b;
                if (response.body.length > 0) {
                    _this.listaPrograma = response.body;
                    (_a = _this.formMatricula.get('idPrograma')) === null || _a === void 0 ? void 0 : _a.setValue(response.body[0].idPEspecifico);
                    _this.listaAlumno = [{ id: -1, nombreCompleto: response.body[0].nombreCompleto }];
                    (_b = _this.formMatricula.get('alumno')) === null || _b === void 0 ? void 0 : _b.setValue(-1);
                    _this.nombreCentroCosto = response.body[0].nombreCentroCosto;
                    _this.ObtenerTipoCambioDolarPesoColombiano(response.body[0].fechaMatricula);
                    if (callback)
                        callback();
                }
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "obtener Programa - alumno");
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.ObtenerAlumnoProgramaPorMatricula = function (codMat, callback) {
        var _this = this;
        var _a, _b;
        (_a = this.formMatricula.get('alumno')) === null || _a === void 0 ? void 0 : _a.reset();
        (_b = this.formMatricula.get('idPrograma')) === null || _b === void 0 ? void 0 : _b.reset();
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerAlumnoProgramaEspecifico + "/" + codMat)
            .subscribe({
            next: function (response) {
                var _a, _b;
                if (response.body.length > 0) {
                    _this.listaPrograma = response.body;
                    (_a = _this.formMatricula.get('idPrograma')) === null || _a === void 0 ? void 0 : _a.setValue(response.body[0].idPEspecifico);
                    _this.listaAlumno = [{ id: -1, nombreCompleto: response.body[0].nombreCompleto }];
                    (_b = _this.formMatricula.get('alumno')) === null || _b === void 0 ? void 0 : _b.setValue(-1);
                    _this.nombreCentroCosto = response.body[0].nombreCentroCosto;
                    _this.ObtenerTipoCambioDolarPesoColombiano(response.body[0].fechaMatricula);
                    if (callback)
                        callback();
                }
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "obtener Programa - alumno");
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.abrirFacturaSiigo = function (item, detalle) {
        var _this = this;
        var _a, _b, _c;
        this.estudianteSeleccionado = item;
        this.idCronogramaPagoDetalleFinal = detalle.id;
        var codigo = item.codigoMatricula;
        if (!detalle.cuota || isNaN(detalle.cuota) || detalle.cuota <= 0) {
            var cronograma = (_a = this.cronogramasPorAlumno) === null || _a === void 0 ? void 0 : _a[codigo];
            if ((cronograma === null || cronograma === void 0 ? void 0 : cronograma.length) > 0) {
                var fila = cronograma.find(function (x) { return x.id === detalle.id; });
                detalle.cuota = (_c = (_b = fila === null || fila === void 0 ? void 0 : fila.cuota) !== null && _b !== void 0 ? _b : fila === null || fila === void 0 ? void 0 : fila.totalPagar) !== null && _c !== void 0 ? _c : 0;
            }
            else {
                detalle.cuota = 0;
            }
        }
        this.ObtenerAlumnoProgramaPorMatricula(codigo, function () {
            _this.ObtenerTipoCambioDolarPesoColombiano(detalle.fechaPago, function () {
                _this.cargarFormularioSiigoConDetalle(detalle);
                _this.abrirModalCrearFactSiigo(detalle);
            });
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.cargarFormularioSiigoConDetalle = function (detalle) {
        this.formCrearFactSiigo.patchValue({
            fechaDocumento: detalle.fechaPago || new Date(),
            fechaVencimiento: detalle.fechaVencimiento || new Date(),
            valorTotal: detalle.totalPagar || 0,
            descripcionItem: detalle.tipoCuota || 'Cuota',
            cantidadItem: 1,
            precioItem: detalle.totalPagar || 0,
            codigoItem: detalle.id || 'N/A'
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.abrirModalCrearFactSiigo = function (data) {
        if (data.enviadoSiigo !== true) {
            var montoCuota = 0;
            this.ObtenerListaDepartamentos();
            this.ObtenerListaCiudades();
            if (data.moneda === "dolares" && data.cuota != null && !isNaN(data.cuota)) {
                montoCuota = this.TipoCambioDolarPesoColombiano(data.cuota);
            }
            else if (!isNaN(data.cuota)) {
                montoCuota = data.cuota;
            }
            // Seguridad extrema
            if (isNaN(montoCuota)) {
                montoCuota = 0;
            }
            var datos = {
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
        }
        else {
            sweetalert2_1["default"].fire("!Cuota Enviada¡", "La cuota ya fue enviada a Siigo!", "warning");
        }
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.ReplicarValorTotalPrecio = function () {
        var _this = this;
        var _a, _b;
        (_a = this.formCrearFactSiigo.get('valorTotal')) === null || _a === void 0 ? void 0 : _a.valueChanges.subscribe(function (value) {
            var precioItemControl = _this.formCrearFactSiigo.get('precioItem');
            if ((precioItemControl === null || precioItemControl === void 0 ? void 0 : precioItemControl.value) !== value) {
                precioItemControl === null || precioItemControl === void 0 ? void 0 : precioItemControl.setValue(value, { emitEvent: false });
            }
        });
        (_b = this.formCrearFactSiigo.get('precioItem')) === null || _b === void 0 ? void 0 : _b.valueChanges.subscribe(function (value) {
            var valorTotalControl = _this.formCrearFactSiigo.get('valorTotal');
            if ((valorTotalControl === null || valorTotalControl === void 0 ? void 0 : valorTotalControl.value) !== value) {
                valorTotalControl === null || valorTotalControl === void 0 ? void 0 : valorTotalControl.setValue(value, { emitEvent: false });
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.enviarFacturaSiigoDesdeBD = function () {
        var _this = this;
        var codigo = this.estudianteSeleccionado.codigoMatricula;
        var idCronograma = this.idCronogramaPagoDetalleFinal;
        var usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
        var usuario = usuarioData.userName;
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerIdFacturaPorCodigoSiigo + "/" + idCronograma).subscribe({
            next: function (resp) {
                var _a;
                var idFactura = (_a = resp.body) === null || _a === void 0 ? void 0 : _a.idFactura;
                if (!idFactura) {
                    _this.alertaService.mensajeError("No se encontró una factura asociada a la matrícula.");
                    return;
                }
                var payload = { idFactura: idFactura, usuario: usuario };
                _this.integraService.postJsonResponse("" + constApi_1.constApiFinanzas.EnviarSiigoFacturaApi, payload).subscribe({
                    next: function (response) {
                        if (response.status === 200 || response.status === 201) {
                            _this.ActualizarCronogramaPagoDetalleFinalSiigo();
                            sweetalert2_1["default"].fire({
                                title: '¡Éxito!',
                                text: 'Factura enviada correctamente a Facturama.',
                                icon: 'success',
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#3085d6'
                            }).then(function () {
                                _this.dialog.closeAll();
                                _this.obtenerCronogramaEstudiante(codigo);
                            });
                        }
                        else {
                            console.warn("Respuesta inesperada:", response);
                        }
                    },
                    error: function (err) {
                        _this.alertaService.mensajeError("Error al enviar la factura: " + err.message);
                    }
                });
            },
            error: function () {
                _this.alertaService.mensajeError("No se pudo obtener el ID de la factura.");
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.guardarFacturaInternaSiigo = function () {
        var _this = this;
        var datosFormulario = this.formCrearFactSiigo.value;
        //const codigo = this.estudianteSeleccionado?.codigoMatricula || this.formMatricula.get('codigoMat')?.value;
        var codigo = this.estudianteSeleccionado.codigoMatricula;
        var idCronograma = this.idCronogramaPagoDetalleFinal;
        if (!codigo) {
            this.alertaService.mensajeError("No se encontró el código de matrícula.");
            return;
        }
        var formatDate = function (date) {
            return date.toISOString().split('T')[0];
        };
        var jsonGuardar = {
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
        this.integraService.postJsonResponse(constApi_1.constApiFinanzas.GuardarFacturaInternaSiigo + "?codigoMatricula=" + codigo + "&idCronogramaPagoDetalleFinal=" + idCronograma, jsonGuardar)
            .subscribe({
            next: function () {
                sweetalert2_1["default"].fire("¡Guardado!", "Los datos fueron almacenados correctamente.", "success");
            },
            error: function (err) {
                _this.alertaService.mensajeError("Error al guardar los datos internos: " + err.message);
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.ObtenerCronograma = function (codigoMat) {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.ObtenerCronograma + "/" + codigoMat)
            .subscribe({
            next: function (response) {
                _this.listacambiosorden = [];
                _this.fun3 = true;
                if (_this.fun1 && _this.fun2 && _this.fun3)
                    _this.loaderGeneral = false;
                _this.flagSinAprobar = response.body.flagSinAprobar;
                _this.listaCronogramaOriginal = [].concat(response.body.cronogramaOriginal);
                _this.cronogramaActual = JSON.stringify(response.body.cronogramaPagoDetalleFinal);
                _this.listaCronogramaActual = JSON.parse(_this.cronogramaActual);
                _this.listaCronogramaEditable = JSON.parse(_this.cronogramaActual);
                _this.valorReal = 0;
                response.body.cronogramaPagoDetalleFinal.forEach(function (e) {
                    _this.valorReal += e.cuota;
                    if (e.cancelado == false) {
                        _this.PagoMaximoSolesDolares += (e.mora + e.cuota);
                    }
                });
            },
            error: function (error) {
                _this.fun3 = true;
                if (_this.fun1 && _this.fun2 && _this.fun3)
                    _this.loaderGeneral = false;
                _this.finanzasService.MensajeDeError(error, "obtener cronogramas");
            },
            complete: function () { }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.ActualizarCronogramaPagoDetalleFinalSiigo = function () {
        this.integraService.putJsonResponse(constApi_1.constApiFinanzas.ActualizaEnviadoSiigo + '/' + this.idCronogramaPagoDetalleFinal)
            .subscribe(function (response) {
            console.log('Respuesta exitosa:', response);
        }, function (error) {
            console.error('Error en la solicitud:', error);
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.emitirFacturasMasivasSiigo = function () {
        var _this = this;
        if (this.estudiantesSeleccionadosMasivos.length === 0)
            return;
        this.loader = true;
        var usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
        var usuario = usuarioData.userName;
        var idsFacturas = this.estudiantesSeleccionadosMasivos
            .map(function (compuesto) {
            var _a;
            var _b = compuesto.split('_'), codigo = _b[0], index = _b[1];
            return (_a = _this.facturasPendientes.find(function (f) {
                return f.codigoMatricula === codigo &&
                    _this.facturasPendientes.indexOf(f) === parseInt(index, 10);
            })) === null || _a === void 0 ? void 0 : _a.idFactura;
        })
            .filter(function (id) { return !!id; });
        var payload = {
            idsFacturas: idsFacturas,
            usuario: usuario
        };
        this.integraService.postJsonResponse("" + constApi_1.constApiFinanzas.EnviarSiigoMasivasLote, payload).subscribe({
            next: function () {
                _this.alertaService.mensajeExitoso("Facturación masiva iniciada correctamente.");
                _this.loader = false;
                _this.cerrarModalFacturacionMasivaSiigo();
                _this.btenerFacturasPendientesEnvioSiigo();
            },
            error: function (error) {
                _this.loader = false;
                console.error("❌ Error al enviar facturas masivas:", error);
                _this.alertaService.mensajeError("Error al enviar facturas masivas: " + error.message);
            }
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.FiltraCiudadesPorPais = function (idDepartamentoPais) {
        var _this = this;
        var _a;
        this.dataCiudades = [];
        (_a = this.formCrearFactSiigo.get('ciudad')) === null || _a === void 0 ? void 0 : _a.reset();
        if (!!idDepartamentoPais) {
            this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerCiudadesDepartamentoPaiObtenerPorId + '/' + idDepartamentoPais)
                .subscribe({
                next: function (response) {
                    _this.dataCiudades = response.body;
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                },
                complete: function () { }
            });
        }
        else {
            this.ObtenerListaCiudades();
        }
        this.ObtenerCodigoPais(idDepartamentoPais);
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.ObtenerCodigoCiudad = function (id) {
        var _this = this;
        if (!!id) {
            this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerCodigoCiudadDepartamentoPaiPorId + '/' + id)
                .subscribe({
                next: function (response) {
                    _this.codigoCiudad = response.body.codigo;
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                },
                complete: function () { }
            });
        }
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.onKeyDownNumero = function (event) {
        var validKeys = ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Delete'];
        var isNumber = function (key) { return /^[0-9]$/.test(key); };
        if (!validKeys.includes(event.key) && !isNumber(event.key)) {
            event.preventDefault();
        }
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.ObtenerCodigoPais = function (id) {
        var _this = this;
        if (!!id) {
            this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerCodigoDepartamentoPaiPorId + '/' + id)
                .subscribe({
                next: function (response) {
                    _this.codigoDepartamento = response.body.codigo;
                },
                error: function (error) {
                    _this.mostrarMensajeError(error);
                },
                complete: function () { }
            });
        }
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.mostrarMensajeError = function (error) {
        sweetalert2_1["default"].fire({
            icon: "error",
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    CronogramaGeneralEmisionFacturaComponent.prototype.onKeyDownMonto = function (event) {
        var validKeys = ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
        var isNumber = function (key) { return /^[0-9]$/.test(key); };
        if (!validKeys.includes(event.key) && !isNumber(event.key)) {
            event.preventDefault();
        }
    };
    __decorate([
        core_1.ViewChild("modalFactura")
    ], CronogramaGeneralEmisionFacturaComponent.prototype, "modalFactura");
    __decorate([
        core_1.ViewChild("modalDetallesFactura")
    ], CronogramaGeneralEmisionFacturaComponent.prototype, "modalDetallesFactura");
    __decorate([
        core_1.ViewChild("modalFacturacionMasiva")
    ], CronogramaGeneralEmisionFacturaComponent.prototype, "modalFacturacionMasiva");
    __decorate([
        core_1.ViewChild("modalConfirmacionMasiva")
    ], CronogramaGeneralEmisionFacturaComponent.prototype, "modalConfirmacionMasiva");
    __decorate([
        core_1.ViewChild("modalFacturaGlobal")
    ], CronogramaGeneralEmisionFacturaComponent.prototype, "modalFacturaGlobal");
    __decorate([
        core_1.ViewChild("modalResultadoFactura")
    ], CronogramaGeneralEmisionFacturaComponent.prototype, "modalResultadoFactura");
    __decorate([
        core_1.ViewChild("modalNuevoCliente")
    ], CronogramaGeneralEmisionFacturaComponent.prototype, "modalNuevoCliente");
    __decorate([
        core_1.ViewChild("modalEditarCliente")
    ], CronogramaGeneralEmisionFacturaComponent.prototype, "modalEditarCliente");
    __decorate([
        core_1.ViewChild('modalCrearFactSiigo')
    ], CronogramaGeneralEmisionFacturaComponent.prototype, "modalCrearFactSiigo");
    __decorate([
        core_1.ViewChild("modalFacturacionMasivaSiigo")
    ], CronogramaGeneralEmisionFacturaComponent.prototype, "modalFacturacionMasivaSiigo");
    CronogramaGeneralEmisionFacturaComponent = __decorate([
        core_1.Component({
            selector: "app-cronograma-general-emision-factura",
            templateUrl: "./cronograma-general-emision-factura.component.html",
            styleUrls: ["./cronograma-general-emision-factura.component.scss"]
        })
    ], CronogramaGeneralEmisionFacturaComponent);
    return CronogramaGeneralEmisionFacturaComponent;
}());
exports.CronogramaGeneralEmisionFacturaComponent = CronogramaGeneralEmisionFacturaComponent;

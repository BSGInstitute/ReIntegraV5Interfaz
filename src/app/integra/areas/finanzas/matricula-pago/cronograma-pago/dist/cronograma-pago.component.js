"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CronogramaPagoComponent = void 0;
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var constApi_1 = require("./../../../../../../environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var date_pipe_1 = require("@shared/functions/date-pipe");
var rxjs_1 = require("rxjs");
var CronogramaPagoComponent = /** @class */ (function () {
    function CronogramaPagoComponent(integraService, formBuilder, modalService, alertService, finanzasService, userService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertService = alertService;
        this.finanzasService = finanzasService;
        this.userService = userService;
        this.filtrarMoneda = true;
        this.customers = [];
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        this.tipoEliminacion = new forms_1.FormControl(3, forms_1.Validators.required);
        this.inputCuota = new forms_1.FormControl(null, forms_1.Validators.required);
        this.inputMontoPasar = new forms_1.FormControl(null, forms_1.Validators.required);
        this.inputSolicitante = new forms_1.FormControl(null, forms_1.Validators.required);
        this.inputAprobado = new forms_1.FormControl(null, forms_1.Validators.required);
        this.inputObservacion = new forms_1.FormControl("");
        this.fun1 = true;
        this.fun2 = true;
        this.fun3 = true;
        this.flagSinAprobar = false;
        this.virtual = {
            itemHeight: 50
        };
        this.idVendedor = 35943;
        this.dataTipoCliente = [
            { id: "Customer", nombre: "Cliente" }
        ];
        this.dataTipoPersona = [
            { id: "Person", nombre: "Persona" }
        ];
        this.dataTipoIdentificacion = [
            { id: "13", nombre: "Cédula" }
        ];
        this.dataPais = [
            { id: "CO", nombre: "Colombia" }
        ];
        this.dataTipoDocumento = [
            { id: 77639, nombre: "Factura electrónica de venta" }
        ];
        this.dataMedioPago = [
            { id: 10859, nombre: "Ventas clientes Openpay colombia" },
            { id: 10849, nombre: "Ventas clientes Payu" },
            { id: 10840, nombre: "Clientes Bancolombia" },
        ];
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
        this.listaTasas = [];
        this.listaMatricula = [];
        this.listaConceptoTasa = [];
        this.listaResponsable = [];
        this.listaPrograma = [];
        this.listaAlumno = [];
        this.listaEstado = [];
        this.listaPeriodo = [];
        this.listaAsesor = [];
        this.itemsAsesor = [];
        this.listaCordinador = [];
        this.itemsCordinador = [];
        this.listaBeneficios = [];
        this.listaFiltroPrograma = [];
        this.listaCronogramaOriginal = [];
        this.listaCronogramaActual = [];
        this.listaCronogramaEditable = [];
        this.listacambiosorden = [];
        this.listaDocumento = [];
        this.listaDocAlumno = [];
        this.listaSeleccionDoc = [];
        this.listaDocTemp = [];
        this.listaMoneda = [];
        this.listaMonedaTem = [];
        this.listaFormaPago = [];
        this.listaCuenta = [];
        this.listaDocumentoPago = [];
        this.listaSolicitante = [];
        this.itemSolicitante = [];
        this.listaNoPagados = [];
        this.listaCambiosCronograma = [];
        this.listaFacturmaRegimenFiscal = [];
        this.listaFacturmaUsoCfdi = [];
        this.listaFacturamaFormaPago = [];
        this.listaVersion = [
            { text: "Versión Básica", value: 1 },
            { text: "Versión Profesional", value: 2 },
            { text: "Versión Gerencial", value: 3 },
            { text: "Sin versión", value: 4 },
            { text: "Sin versión", value: 5 },
        ];
        this.maxlength = 1000;
        this.charachtersCount = 0;
        this.nombreModalTasa = "";
        this.btnModalTasa = "";
        this.valorReal = 0;
        this.loaderTasas = false;
        this.loaderMatriculaFiltro = false;
        this.loaderGeneral = false;
        this.loaderModalTasa = false;
        this.loaderModalEliminar = false;
        this.loaderDocumento = false;
        this.loaderBuscarDoc = false;
        this.loaderModalPago = false;
        this.loaderCronogramaActual = false;
        this.loaderCronogramaEditable = false;
        this.loaderCrearFactSiigo = false;
        this.loaderCrearFacturaFacturama = false;
        this.sombra = true;
        this.isMonedaDolaroSoles = false;
        this.codigoMatriculaTemp = "";
        this.cuotaMoraTemp = {
            id: 0,
            codigoMatricula: "string",
            nroCuota: 0,
            nroSubCuota: 0,
            cuota: 0,
            mora: 0,
            version: 0,
            montoAdelanto: 0
        };
        this.PagoMaximoSolesDolares = 0;
        this.montoPasar = 0;
        this.montoPasarMax = 0;
        this.formPago = this.formBuilder.group({
            nroCuota: null,
            nroSubCuota: null,
            monto: [null, forms_1.Validators.required],
            tipoCambio: [null, forms_1.Validators.required],
            idMoneda: [null, forms_1.Validators.required],
            idformaPago: [null, forms_1.Validators.required],
            idDocumneto: [null, forms_1.Validators.required],
            nroCheque: [null, forms_1.Validators.required],
            idCuenta: [null, forms_1.Validators.required],
            fechaPago: [new Date(), forms_1.Validators.required]
        });
        this.formTasaAcademica = this.formBuilder.group({
            idConcepto: [null, forms_1.Validators.required],
            monto: [null, forms_1.Validators.required],
            moneda: [null, forms_1.Validators.required],
            fechaPago: [null, forms_1.Validators.required]
        });
        this.formMatricula = this.formBuilder.group({
            codigoMat: null,
            alumno: null,
            idPrograma: null
        });
        this.formDatosMatricula = this.formBuilder.group({
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
            idAsesor: null,
            nuevaPrograma: null
        });
        this.formCrearFacturaFacturama = this.formBuilder.group({
            // Datos generales
            CfdiType: ['I', forms_1.Validators.required],
            PaymentForm: ['', forms_1.Validators.required],
            PaymentMethod: ['', forms_1.Validators.required],
            ExpeditionPlace: ['', forms_1.Validators.required],
            // GlobalInformation
            // Periodicity: ['', Validators.required],
            // Months: ['', Validators.required],
            // Year: ['', Validators.required],
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
            // Impuestos (Taxes)
            // TaxName: ['', Validators.required],
            // Base: [0, Validators.required],
            // Rate: [0, Validators.required],
            // IsRetention: [false],
            taxTotal: [0, forms_1.Validators.required],
            // Total del producto
            ItemTotal: [0, forms_1.Validators.required]
        });
        this.formCrearClienteFacturama = this.formBuilder.group({
            rfc: ['', forms_1.Validators.required],
            name: ['', forms_1.Validators.required],
            email: ['', [forms_1.Validators.required, forms_1.Validators.email]],
            fiscalRegime: ['616', forms_1.Validators.required],
            cfdiUse: ['G03', forms_1.Validators.required],
            address: this.formBuilder.group({
                street: ['', forms_1.Validators.required],
                exteriorNumber: ['', forms_1.Validators.required],
                interiorNumber: [''],
                neighborhood: ['', forms_1.Validators.required],
                zipCode: ['', forms_1.Validators.required],
                municipality: ['', forms_1.Validators.required],
                state: ['', forms_1.Validators.required],
                country: ['MEX']
            })
        });
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
    }
    CronogramaPagoComponent.prototype.ngOnInit = function () {
        var _this = this;
        var _a, _b;
        this.ObtenerTodoPersonal();
        this.TextBeneficioCounter("");
        this.ObtenerTodoEstadoMatricula();
        this.ObtenerComboPeriodo();
        this.ObtenerAsesorPorApellidosAutocomplete();
        this.ObtenerCoordinadorAutcomplete();
        this.ObtenerComboMoneda();
        this.ObtenerDatosPago();
        this.ReplicarValorTotalPrecio();
        (_a = this.formCrearFacturaFacturama.get('Quantity')) === null || _a === void 0 ? void 0 : _a.valueChanges.subscribe(function () {
            _this.calcularTotales();
        });
        (_b = this.formCrearFacturaFacturama.get('UnitPrice')) === null || _b === void 0 ? void 0 : _b.valueChanges.subscribe(function () {
            _this.calcularTotales();
        });
    };
    // Funciones Template ---------------------------------------------------------------------------------
    CronogramaPagoComponent.prototype.formaPagoTemplate = function (idFormaPago) {
        if (typeof idFormaPago == "number") {
            return this.listaFormaPago.find(function (e) { return e.id == idFormaPago; }).descripcion;
        }
        else
            return idFormaPago;
    };
    CronogramaPagoComponent.prototype.ObtenerListaDepartamentos = function () {
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
    CronogramaPagoComponent.prototype.ObtenerListaCiudades = function () {
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
    CronogramaPagoComponent.prototype.FiltraCiudadesPorPais = function (idDepartamentoPais) {
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
    CronogramaPagoComponent.prototype.ObtenerCodigoPais = function (id) {
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
    CronogramaPagoComponent.prototype.ObtenerCodigoCiudad = function (id) {
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
    //------------------------------------------------------------------------------------------------------
    // Funciones para la optencion de datos ------------------------------------------------------------------
    CronogramaPagoComponent.prototype.ObtenerComboMoneda = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApi.MonedaObtenerCombo)
            .subscribe({
            next: function (response) {
                _this.listaMonedaTem = response.body;
                _this.listaMoneda = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "MODAL - COMBO MONEDA");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerDatosPago = function () {
        var _this = this;
        this.integraService
            .postJsonResponse("" + constApi_1.constApiFinanzas.ObtenerDatosPago, null)
            .subscribe({
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
    CronogramaPagoComponent.prototype.ObtenerTodoPersonal = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.ObtenerTodoPersonal)
            .subscribe({
            next: function (response) {
                _this.itemSolicitante = response.body;
                _this.listaSolicitante = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "MODAL - COMBO solicitante personal");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerMatriculaAutoComplete = function (alumno) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.ObtenerCodigoMatricula, { valor: alumno })
            .subscribe({
            next: function (response) {
                _this.listaMatricula = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "autocomplete - matricula");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerConceptoTasa = function (concepto) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.ObtenerDetalleTasasAcademicas, { valor: concepto })
            .subscribe({
            next: function (response) {
                _this.listaConceptoTasa = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "autocomplete - Concepto tasa");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerResponsable = function (apellido) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.ObtenerPersonalAprobadoPorApellido, { valor: apellido })
            .subscribe({
            next: function (response) {
                _this.listaResponsable = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "autocomplete - Concepto tasa");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerProgramaAutoComplete = function (programa) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.ObtenerPEspecificoPorCentroCosto, { filtro: programa })
            .subscribe({
            next: function (response) {
                _this.listaFiltroPrograma = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "autocomplete - programa");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerAlumnoAutoComplete = function (alumno) {
        var _this = this;
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.ObtenerAlumnoPorValor, { valor: alumno })
            .subscribe({
            next: function (response) {
                _this.listaAlumno = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "autocomplete - alumno");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerAlumnoProgramaPorMatricula = function (codMat) {
        var _this = this;
        this.formMatricula.get('alumno').reset();
        this.formMatricula.get('idPrograma').reset();
        this.loaderMatriculaFiltro = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.ObtenerAlumnoProgramaEspecifico + "/" + codMat)
            .subscribe({
            next: function (response) {
                if (response.body.length > 0) {
                    _this.listaPrograma = [];
                    _this.formMatricula.get('idPrograma').setValue(response.body[0].idPEspecifico);
                    _this.listaAlumno = [];
                    _this.listaAlumno.push({ id: -1, nombreCompleto: response.body[0].nombreCompleto });
                    _this.formMatricula.get('alumno').setValue(-1);
                }
                _this.listaPrograma = response.body;
                _this.ObtenerTipoCambioDolarPesoColombiano(_this.listaPrograma[0].fechaMatricula);
                _this.nombreCentroCosto = _this.listaPrograma[0].nombreCentroCosto;
                _this.loaderMatriculaFiltro = false;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "obtener Programa - alumno");
                _this.loaderMatriculaFiltro = false;
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerCodigoMatriculaPEspecificoPorAlumnos = function (idAlumno) {
        var _this = this;
        this.formMatricula.get('idPrograma').reset();
        this.formMatricula.get('codigoMat').reset();
        this.loaderMatriculaFiltro = true;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.ObtenerCodigoMatriculaPEspecificoPorAlumnos + "/" + idAlumno)
            .subscribe({
            next: function (response) {
                if (response.body.length > 0) {
                    _this.listaMatricula = [];
                    _this.listaPrograma = [];
                    var i = 0;
                    response.body.forEach(function (e) {
                        _this.listaMatricula.push({ id: e.codigoMatricula });
                        _this.listaPrograma.push({ idPEspecifico: i, pEspecifico: e.pEspecifico, codigoMatricula: e.codigoMatricula });
                        i++;
                    });
                    console.log(_this.listaPrograma);
                }
                _this.loaderMatriculaFiltro = false;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "Programa-código matrícula");
                _this.loaderMatriculaFiltro = false;
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerCostosAdministrativosCodigoMatricula = function (codigoMat) {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.ObtenerCostosAdministrativosCodigoMatricula + "/" + codigoMat)
            .subscribe({
            next: function (response) {
                _this.fun1 = true;
                if (_this.fun1 && _this.fun2 && _this.fun3)
                    _this.loaderGeneral = false;
                _this.listaTasas = response.body;
            },
            error: function (error) {
                _this.fun1 = true;
                if (_this.fun1 && _this.fun2 && _this.fun3)
                    _this.loaderGeneral = false;
                _this.finanzasService.MensajeDeError(error, "obtener tasas academicas");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerDatosMatriculaPorCodigoMatricula = function (codigoMat) {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.ObtenerDatosMatriculaPorCodigoMatricula + "/" + codigoMat)
            .subscribe({
            next: function (response) {
                _this.fun2 = true;
                if (response.body) {
                    _this.codigoMatriculaTemp = response.body.resultado[0].id;
                    _this.sombra =
                        response.body.resultado[0].estadoMatricula != 'sindevolucion' &&
                            response.body.resultado[0].estadoMatricula != 'condevolucion' ? false : true;
                    _this.itemsAsesor = [];
                    _this.itemsCordinador = [];
                    _this.itemsAsesor.push({ id: response.body.resultado[0].idAsesor, nombreCompleto: response.body.resultado[0].asesor });
                    _this.itemsCordinador.push({ id: response.body.resultado[0].idCoordinador, nombreCompleto: response.body.resultado[0].coordinador });
                    if (_this.fun1 && _this.fun2 && _this.fun3)
                        _this.loaderGeneral = false;
                    _this.listaBeneficios = response.body.beneficiosmatricula;
                    _this.formDatosMatricula.patchValue(response.body.resultado[0]);
                    if (response.body.resultado[0].empresaPaga == "SI")
                        _this.formDatosMatricula.get('empresaPagaForm').setValue(true);
                    else
                        _this.formDatosMatricula.get('empresaPagaForm').setValue(false);
                    console.log(_this.formDatosMatricula);
                }
                else {
                    sweetalert2_1["default"].fire("!Datos no encontrados¡", "No se encontraron datos para esta matricula!", "warning");
                }
            },
            error: function (error) {
                _this.fun2 = true;
                if (_this.fun1 && _this.fun2 && _this.fun3)
                    _this.loaderGeneral = false;
                _this.finanzasService.MensajeDeError(error, "obtener tasas academicas");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerCronograma = function (codigoMat) {
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
    CronogramaPagoComponent.prototype.ObtenerPaisMatricula = function (codigoMatricula) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerPaisMatricula + '/' + codigoMatricula)
            .subscribe({
            next: function (response) {
                _this.paisMatricula = response.body.idPais;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "obtener país de matricula");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerTipoCambioDolarPesoColombiano = function (fecha) {
        var _this = this;
        this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerPesosDolaresTipoCambioColombia + '/' + fecha)
            .subscribe({
            next: function (resp) {
                _this.montoTipoCambioPesoColombiano = resp.body.pesosDolares;
            },
            error: function (error) {
                console.log(error);
            }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerTodoEstadoMatricula = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.ObtenerTodoEstadoMatricula)
            .subscribe({
            next: function (response) {
                _this.listaEstado = response.body;
                _this.listaEstadoEliminacion = response.body.filter(function (e) { return e.id == 3 || e.id == 4; });
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "obtener estados de matricula");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerComboPeriodo = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApi.PeriodoObtenerCombo)
            .subscribe({
            next: function (response) {
                _this.listaPeriodo = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "COMBO - PERIODO");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerAsesorPorApellidosAutocomplete = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.ObtenerAsesorPorApellidos)
            .subscribe({
            next: function (response) {
                _this.listaAsesor = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "combo - asesor");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerCoordinadorAutcomplete = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiFinanzas.ObtenerCoordinadorPorApellidos)
            .subscribe({
            next: function (response) {
                _this.listaCordinador = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "combo - coordinador");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ReplicarValorTotalPrecio = function () {
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
    //------------------------------------------------------------------------------------------------------
    // Funciones para el control de Interfaz ,Grilla editable Cronograma Actual ------------------------------------------------------------------
    CronogramaPagoComponent.prototype.cellClickHandler = function (_a) {
        var //click en la celda abrir editor
        sender = _a.sender, rowIndex = _a.rowIndex, column = _a.column, columnIndex = _a.columnIndex, dataItem = _a.dataItem, isEdited = _a.isEdited;
        if (!isEdited && !this.isReadOnly(column.field)) {
            if (dataItem.cancelado == true) {
                this.columTemp = column.field;
                sender.editCell(rowIndex, columnIndex, this.createFormGroup(dataItem));
            }
        }
    };
    CronogramaPagoComponent.prototype.cellCloseHandler = function (args) {
        var _this = this;
        var formGroup = args.formGroup, dataItem = args.dataItem;
        if (!formGroup.valid) {
            // hace que la celda no se cierre mientras no sea valido.
            args.preventDefault();
        }
        else if (formGroup.dirty) {
            var columna = "";
            switch (this.columTemp) {
                case 'idFormaPago':
                    columna = "Forma de Pago";
                    break;
                case 'fechaPago':
                    columna = "Fecha de Pago";
                    break;
                case 'fechaDeposito':
                    columna = "Fecha de Deposito";
                    break;
                case 'moraTarifario':
                    columna = "Gestión de Cobranza";
                    break;
                default: break;
            }
            sweetalert2_1["default"].fire({
                title: '¿Está seguro que quieres registar el cambio para ' + columna + '?',
                text: '¡No podrás revertir esto!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4C5FC0',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, Continuar!'
            }).then(function (result) {
                if (result.isConfirmed) {
                    _this.assignValues(dataItem, formGroup.value);
                    _this.update(dataItem);
                }
            });
        }
    };
    CronogramaPagoComponent.prototype.isReadOnly = function (field) {
        var readOnlyColumns = [
            "cancelado", "nroCuota", "nroSubCuota", "tipoCuota",
            "fechaVencimiento", "totalPagar", "cuota", "mora",
            "saldo", "moneda"
        ];
        return readOnlyColumns.indexOf(field) > -1;
    };
    CronogramaPagoComponent.prototype.createFormGroup = function (dataItem) {
        return this.formBuilder.group({
            idFormaPago: [dataItem.idFormaPago, forms_1.Validators.required],
            fechaPago: [
                typeof dataItem.fechaPago == "string" &&
                    dataItem.fechaPago.length > 1
                    ? new Date(dataItem.fechaPago) : dataItem.fechaPago,
                forms_1.Validators.required
            ],
            fechaDeposito: typeof dataItem.fechaDeposito == "string" &&
                dataItem.fechaDeposito.length > 1
                ? new Date(dataItem.fechaDeposito) : dataItem.fechaDeposito,
            moraTarifario: [dataItem.moraTarifario]
        });
    };
    CronogramaPagoComponent.prototype.assignValues = function (target, source) {
        Object.assign(target, source);
    };
    CronogramaPagoComponent.prototype.update = function (item) {
        switch (this.columTemp) {
            case 'idFormaPago':
                this.guardarFormaPagoCuota(item.id, item.idFormaPago);
                break;
            case 'fechaPago':
                this.guardarFechaPagoCuota(item.id, date_pipe_1.datePipeTransform(item.fechaPago, 'yyyy-MM-ddTHH:mm:ss', 'en-US'));
                break;
            case 'fechaDeposito':
                this.guardarFechaDepositoCuota(item.id, date_pipe_1.datePipeTransform(item.fechaDeposito, 'yyyy-MM-ddTHH:mm:ss', 'en-US'));
                break;
            case 'moraTarifario':
                this.guardarGestionDeCobranza(item.id, item.moraTarifario);
                break;
            default:
                break;
        }
    };
    //------------------------------------------------------------------------------------------------------
    // Funciones para el control de Interfaz ,Grilla editable Cronograma Actual ------------------------------------------------------------------
    CronogramaPagoComponent.prototype.cellClickHandlerEditable = function (_a) {
        var //click en la celda abrir editor
        sender = _a.sender, rowIndex = _a.rowIndex, column = _a.column, columnIndex = _a.columnIndex, dataItem = _a.dataItem, isEdited = _a.isEdited;
        if (!isEdited && !this.isReadOnlyEditable(column.field)) {
            if (dataItem.cancelado == false) {
                var fechaVencimiento = typeof dataItem.fechaVencimiento == "string" ? new Date(dataItem.fechaVencimiento) : dataItem.fechaVencimiento;
                this.columTempEditable = { colum: column.field, index: rowIndex };
                this.valorAnteriorEditable = { monto: dataItem.cuota, fechaVencimiento: date_pipe_1.datePipeTransform(fechaVencimiento, 'yyyy-MM-ddTHH:mm:ss', 'en-US') };
                sender.editCell(rowIndex, columnIndex, this.createFormGroupEditable(dataItem));
            }
        }
    };
    CronogramaPagoComponent.prototype.cellCloseHandlerEditable = function (args) {
        var formGroup = args.formGroup, dataItem = args.dataItem;
        if (!formGroup.valid)
            args.preventDefault();
        else if (formGroup.dirty) {
            this.assignValuesEditable(dataItem, formGroup.value);
        }
    };
    CronogramaPagoComponent.prototype.isReadOnlyEditable = function (field) {
        var readOnlyColumns = [
            "cancelado", "nroCuota", "tipoCuota", "moneda", "saldo", "totalPagar"
        ];
        return readOnlyColumns.indexOf(field) > -1;
    };
    CronogramaPagoComponent.prototype.createFormGroupEditable = function (dataItem) {
        return this.formBuilder.group({
            nroSubCuota: [dataItem.nroSubCuota, forms_1.Validators.required],
            fechaVencimiento: [
                typeof dataItem.fechaVencimiento == "string" &&
                    dataItem.fechaVencimiento.length > 1
                    ? new Date(dataItem.fechaVencimiento) : dataItem.fechaVencimiento,
                forms_1.Validators.required
            ],
            cuota: [dataItem.cuota, forms_1.Validators.required],
            mora: [dataItem.mora, forms_1.Validators.required]
        });
    };
    CronogramaPagoComponent.prototype.assignValuesEditable = function (target, source) {
        Object.assign(target, source);
        var dataItem = this.listaCronogramaEditable[this.columTempEditable.index];
        var FechaPeriodoCambio = date_pipe_1.datePipeTransform(new Date(), 'yyyy-MM-ddTHH:mm:ss', 'en-US');
        if (this.columTempEditable.colum == "cuota") {
            var index = this.listaCambiosCronograma.findIndex(function (item) { return item.idDetalle === dataItem.id && item.antiguo == false && item.tipoModificacion == "MONTO"; });
            if (index == -1) {
                var ObjectAntiguo = {
                    codigoMatricula: this.formMatricula.get("codigoMat").value,
                    FechaVencimientoCambio: this.valorAnteriorEditable.fechaVencimiento,
                    montoCambio: -1 * this.valorAnteriorEditable.monto,
                    tipoModificacion: "MONTO",
                    periodoCambio: FechaPeriodoCambio,
                    antiguo: true,
                    idDetalle: dataItem.id
                };
                this.listaCambiosCronograma.push(ObjectAntiguo);
                var ObjectNuevo = {
                    codigoMatricula: this.formMatricula.get("codigoMat").value,
                    FechaVencimientoCambio: this.valorAnteriorEditable.fechaVencimiento,
                    montoCambio: dataItem.cuota,
                    tipoModificacion: "MONTO",
                    periodoCambio: FechaPeriodoCambio,
                    antiguo: false,
                    idDetalle: dataItem.id
                };
                this.listaCambiosCronograma.push(ObjectNuevo);
            }
            else {
                this.listaCambiosCronograma[index].montoCambio = dataItem.cuota,
                    this.listaCambiosCronograma[index].periodoCambio = FechaPeriodoCambio;
            }
        }
        if (this.columTempEditable.colum == "fechaVencimiento") {
            var index = this.listaCambiosCronograma.findIndex(function (item) { return item.idDetalle === dataItem.id && item.antiguo == false && item.tipoModificacion == "FECHA"; });
            if (index == -1) {
                var ObjectAntiguo = {
                    codigoMatricula: this.formMatricula.get("codigoMat").value,
                    FechaVencimientoCambio: this.valorAnteriorEditable.fechaVencimiento,
                    montoCambio: dataItem.cuota,
                    tipoModificacion: "FECHA",
                    periodoCambio: FechaPeriodoCambio,
                    antiguo: true,
                    idDetalle: dataItem.id
                };
                this.listaCambiosCronograma.push(ObjectAntiguo);
                var ObjectNuevo = {
                    codigoMatricula: this.formMatricula.get("codigoMat").value,
                    FechaVencimientoCambio: date_pipe_1.datePipeTransform(dataItem.fechaVencimiento, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
                    montoCambio: dataItem.cuota,
                    tipoModificacion: "FECHA",
                    periodoCambio: FechaPeriodoCambio,
                    antiguo: false,
                    idDetalle: dataItem.id
                };
                this.listaCambiosCronograma.push(ObjectNuevo);
            }
            else {
                this.listaCambiosCronograma[index].FechaVencimientoCambio = date_pipe_1.datePipeTransform(dataItem.fechaVencimiento, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
                    this.listaCambiosCronograma[index].periodoCambio = FechaPeriodoCambio;
            }
        }
        //validamos si es de fraccion
        var esfraccion = this.listacambiosorden.filter(function (x) {
            return (x.cuota == dataItem.nroCuota && x.subCuota == dataItem.nroSubCuota && x.tipoCambio == "Fraccion") ||
                (x.id == dataItem.id && x.tipoCambio == "Fraccion" || x.cuota == dataItem.nroCuota && x.subCuota == dataItem.nroSubCuota && x.tipoCambio == "Agregar");
        });
        if (esfraccion.length == 0) // si la lista esta vacia se procede, de lo contrario no se hace nada
         {
            var posicion = this.listacambiosorden.length == 0 ?
                1 : this.listacambiosorden[this.listacambiosorden.length - 1].orden + 1;
            if (this.columTempEditable.colum == "cuota") {
                //validamos si ya existe este cambio para esta cuota
                var repetida = this.listacambiosorden.filter(function (x) {
                    return x.cuota == dataItem.nroCuota &&
                        x.subCuota == dataItem.nroSubCuota &&
                        x.id == dataItem.id &&
                        x.tipoCambio == "Monto";
                });
                if (repetida.length == 0) //si no existe entonces la agregarmos
                 {
                    var objRow = {
                        id: dataItem.id,
                        tipoCambio: 'Monto',
                        orden: posicion,
                        cuota: dataItem.nroCuota,
                        subCuota: dataItem.nroSubCuota
                    };
                    this.listacambiosorden.push(objRow);
                }
                else //si existe
                 {
                    var valororiginal = this.listaCronogramaActual.find(function (e) { return e.id === dataItem.id; });
                    if (valororiginal.cuota == dataItem.cuota) //si es igual monto, lo eliminamos
                     {
                        this.listacambiosorden = this.listacambiosorden.filter(function (e) {
                            return (e.id.toString() + e.tipoCambio) !== (dataItem.id.toString() + 'Monto');
                        });
                    }
                }
            }
            else if (this.columTempEditable.colum == "mora") {
                var repetida = this.listacambiosorden.filter(function (x) {
                    return x.cuota == dataItem.nroCuota &&
                        x.subCuota == dataItem.nroSubCuota &&
                        x.id == dataItem.id &&
                        x.tipoCambio == "Mora";
                });
                if (repetida.length == 0) //si no existe entonces la agregarmos
                 {
                    var objRow = {
                        id: dataItem.id,
                        tipoCambio: 'Mora',
                        orden: posicion,
                        cuota: dataItem.nroCuota,
                        subCuota: dataItem.nroSubCuota
                    };
                    this.listacambiosorden.push(objRow);
                }
                else //si existe es repetida
                 {
                    var valororiginal = this.listaCronogramaActual.find(function (e) { return e.id === dataItem.id; });
                    if (valororiginal.mora == dataItem.mora) //si es igual monto, lo eliminamos
                     {
                        this.listacambiosorden = this.listacambiosorden.filter(function (e) {
                            return (e.id.toString() + e.tipoCambio) !== (dataItem.id.toString() + 'Mora');
                        });
                    }
                }
            }
            else if (this.columTempEditable.colum == "fechaVencimiento") {
                var repetida = this.listacambiosorden.filter(function (x) {
                    return x.cuota == dataItem.nroCuota &&
                        x.subCuota == dataItem.nroSubCuota &&
                        x.id == dataItem.id &&
                        x.tipoCambio == "Fecha";
                });
                if (repetida.length == 0) //si no existe entonces la agregarmos
                 {
                    var objRow = {
                        id: dataItem.id,
                        tipoCambio: 'Fecha',
                        orden: posicion,
                        cuota: dataItem.nroCuota,
                        subCuota: dataItem.nroSubCuota
                    };
                    this.listacambiosorden.push(objRow);
                }
                else //si existe es repetida
                 {
                    if (typeof dataItem.fechaVencimiento != 'string')
                        dataItem.fechaVencimiento = date_pipe_1.datePipeTransform(dataItem.fechaVencimiento, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
                    var valororiginal = this.listaCronogramaActual.find(function (e) { return e.id === dataItem.id; });
                    if (valororiginal.fechaVencimiento == dataItem.fechaVencimiento) //si es igual monto, lo eliminamos
                     {
                        this.listacambiosorden = this.listacambiosorden.filter(function (e) {
                            return (e.id.toString() + e.tipoCambio) !== (dataItem.id.toString() + 'Fecha');
                        });
                    }
                }
            }
        }
        console.log("CAMBIOS", this.listacambiosorden);
        this.calcularcronograma();
    };
    //------------------------------------------------------------------------------------------------------
    // Funciones para el control de Interfaz ------------------------------------------------------------------
    CronogramaPagoComponent.prototype.filterCodigoMat = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.ObtenerMatriculaAutoComplete(event);
        else
            this.listaMatricula = [];
    };
    CronogramaPagoComponent.prototype.filterResponsable = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.ObtenerResponsable(event);
        else
            this.listaResponsable = [];
    };
    CronogramaPagoComponent.prototype.filterMoneda = function (event) {
        if (this.filtrarMoneda) {
            event = event.trim();
            if (event.length >= 1)
                this.listaMonedaTem = this.listaMoneda.filter(function (s) { return s.nombrePlural.toLowerCase().indexOf(event.toLowerCase()) !== -1; });
            else
                this.listaMonedaTem = this.listaMoneda;
        }
    };
    CronogramaPagoComponent.prototype.filterSolicitante = function (event) {
        event = event.trim();
        console.log(event);
        if (event.length >= 4)
            this.itemSolicitante = this.listaSolicitante.filter(function (s) { return s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1; });
        else
            this.itemSolicitante = this.listaSolicitante;
    };
    CronogramaPagoComponent.prototype.filterPrograma = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.ObtenerProgramaAutoComplete(event);
        else
            this.listaFiltroPrograma = [];
    };
    CronogramaPagoComponent.prototype.filterAlumno = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.ObtenerAlumnoAutoComplete(event);
        else
            this.listaAlumno = [];
    };
    CronogramaPagoComponent.prototype.filterAsesor = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.itemsAsesor = this.listaAsesor.filter(function (s) { return s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1; });
    };
    CronogramaPagoComponent.prototype.filterCordinador = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.itemsCordinador = this.listaCordinador.filter(function (s) { return s.nombreCompleto.toLowerCase().indexOf(event.toLowerCase()) !== -1; });
    };
    CronogramaPagoComponent.prototype.filterConceptoTasa = function (event) {
        event = event.trim();
        if (event.length >= 4)
            this.ObtenerConceptoTasa(event);
        else
            this.listaConceptoTasa = [];
    };
    CronogramaPagoComponent.prototype.TextBeneficioCounter = function (ev) {
        this.charachtersCount = ev.length;
        this.counter = this.charachtersCount + "/" + this.maxlength;
    };
    CronogramaPagoComponent.prototype.CargarDataMatricula = function (event) {
        if (event.id.length >= 5) {
            this.codigoMatriculaTemp = "";
            this.sombra = true;
            this.formDatosMatricula.reset();
            this.listaCronogramaActual = [];
            this.listaCronogramaOriginal = [];
            this.ObtenerAlumnoProgramaPorMatricula(event.id);
        }
    };
    CronogramaPagoComponent.prototype.CargarDataAlumno = function (event) {
        if (typeof event == "object") {
            if (typeof event.id == "number" && event.id != -1) {
                this.codigoMatriculaTemp = "";
                this.sombra = true;
                this.formDatosMatricula.reset();
                this.listaCronogramaActual = [];
                this.listaCronogramaOriginal = [];
                this.ObtenerCodigoMatriculaPEspecificoPorAlumnos(event.id);
            }
        }
    };
    CronogramaPagoComponent.prototype.cargarCodMat = function (event) {
        if (event.idPEspecifico != null) {
            this.codigoMatriculaTemp = "";
            this.sombra = true;
            this.formDatosMatricula.reset();
            this.listaCronogramaActual = [];
            this.listaCronogramaOriginal = [];
            this.formMatricula.get('codigoMat').setValue(event.codigoMatricula);
        }
    };
    CronogramaPagoComponent.prototype.cargarDatosMatricula = function () {
        var codMat = this.formMatricula.get('codigoMat').value;
        if (codMat != null) {
            this.fun3 = false;
            this.fun1 = false;
            this.fun2 = false;
            this.loaderGeneral = true;
            this.ObtenerCostosAdministrativosCodigoMatricula(codMat);
            this.ObtenerDatosMatriculaPorCodigoMatricula(codMat);
            this.ObtenerCronograma(codMat);
            this.ObtenerPaisMatricula(codMat);
        }
        else {
            sweetalert2_1["default"].fire("!Código de Matrícula Requerido¡", "El código de matrícula es requerido para generar la busqueda!", "warning");
        }
    };
    CronogramaPagoComponent.prototype.accionModalTasa = function () {
        switch (this.btnModalTasa) {
            case "Actualizar":
                break;
            case "Guardar":
                this.guardarTasa();
                break;
            default:
                break;
        }
    };
    CronogramaPagoComponent.prototype.abrirModalTasa = function (isNew, data) {
        this.filtrarMoneda = true;
        this.listaMonedaTem = this.listaMoneda;
        this.formTasaAcademica.reset();
        this.btnModalTasa = "Guardar";
        this.nombreModalTasa = "Nueva Tasa Academica";
        if (!isNew) {
            this.nombreModalTasa = "Editar Tasa Academica";
            this.btnModalTasa = "Actualizar";
        }
        this.modalService.open(this.modalTasaAcademica);
    };
    CronogramaPagoComponent.prototype.abrirModalEliminar = function () {
        if (this.codigoMatriculaTemp.length > 0) {
            if (this.sombra == false) {
                this.modalService.open(this.modalEliminar);
            }
            else {
                sweetalert2_1["default"].fire("!Matrícula eliminada¡", "Esta matrícula ya ha sido eliminada, anteriormente!", "warning");
            }
        }
        else {
            sweetalert2_1["default"].fire("!Sin matrícula cargada¡", "Carga la matricula antes eliminar!", "warning");
        }
    };
    CronogramaPagoComponent.prototype.BuscarDocumentos = function () {
        var _this = this;
        var codMat = this.formMatricula.get('codigoMat').value;
        var idPEspecifico = this.formDatosMatricula.get('idPEspecifico').value;
        if (codMat != null && codMat != undefined && idPEspecifico != null && idPEspecifico != undefined) {
            this.loaderBuscarDoc = true;
            this.integraService
                .getJsonResponse(constApi_1.constApiFinanzas.ObtenerDocumentosMatricula + "/" + this.codigoMatriculaTemp + "/" + idPEspecifico)
                .subscribe({
                next: function (response) {
                    _this.listaDocumento = response.body.listaDocumentos;
                    _this.listaDocAlumno = response.body.listaDocumentoAlumno;
                    _this.modalService.open(_this.modalDocumentos, { size: "lg" });
                    _this.loaderBuscarDoc = false;
                },
                error: function (error) {
                    _this.finanzasService.MensajeDeError(error, "obtener documentos");
                    _this.loaderBuscarDoc = false;
                },
                complete: function () { }
            });
        }
        else {
            sweetalert2_1["default"].fire("!Datos imcompletos¡", "Verifique que todos los datos esten ingresados en la sección 'Matrícula Alumno' ", "warning");
        }
    };
    CronogramaPagoComponent.prototype.itemDisabled = function (itemArgs) {
        return itemArgs.dataItem.estadoMatricula === 'sindevolucion' || itemArgs.dataItem.estadoMatricula === 'condevolucion'; // disable the 3rd item
    };
    CronogramaPagoComponent.prototype.abrirModalPagar = function (data, index) {
        if (data.cancelado == false) {
            if ((this.listaCronogramaActual[index].nroCuota == 1 &&
                this.listaCronogramaActual[index].nroSubCuota == 1) ||
                this.listaCronogramaActual[index - 1].cancelado == true) {
                if (data.moneda.toLowerCase() == "dolares") {
                    this.listaMonedaTem = this.listaMoneda;
                    this.filtrarMoneda = true;
                }
                else {
                    this.listaMonedaTem = this.listaMoneda.filter(function (e) { return e.nombrePlural.toLowerCase() === data.moneda.toLowerCase() || e.id === 19; }); //19=dolar
                    this.filtrarMoneda = false;
                }
                this.formPago.reset();
                this.cuotaTemp = data;
                this.formPago.patchValue(data);
                this.formPago.get('fechaPago').setValue(new Date());
                this.modalService.open(this.modalPagarCuota);
            }
            else {
                sweetalert2_1["default"].fire("!Cuota anterior sin pagar¡", "Debes pagar la cuota anterior para poder pagar la siguiente.!", "info");
            }
        }
        else {
            sweetalert2_1["default"].fire("!Cuota Pagada¡", "La cuota seleccionada fue pagada anteriormente, selecciona una cuota que aún no este pagada!", "warning");
        }
    };
    CronogramaPagoComponent.prototype.abrirModalCrearFactSiigo = function (data) {
        if (data.enviadoSiigo !== true) {
            var montoCuota = void 0;
            this.loaderCrearFactSiigo = false;
            this.ObtenerListaDepartamentos();
            this.ObtenerListaCiudades();
            if (data.moneda == "dolares") { //Si está en dólares, realiza conversión
                montoCuota = this.TipoCambioDolarPesoColombiano(data.cuota);
            }
            else {
                montoCuota = data.cuota;
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
            if (data.cancelado == true) {
                this.formCrearFactSiigo.reset();
                this.formCrearFactSiigo.patchValue(datos);
                this.idCronogramaPagoDetalleFinal = data.id;
                this.modalRefCrearFactSiigo = this.modalService.open(this.modalCrearFactSiigo, { size: "lg" });
            }
            else {
                sweetalert2_1["default"].fire("!Cuota Sin Pagar¡", "La cuota seleccionada no se encuentra pagada, selecciona una cuota pagada!", "warning");
            }
        }
        else {
            sweetalert2_1["default"].fire("!Cuota Enviada¡", "La cuota ya fue enviada a Siigo!", "warning");
        }
    };
    CronogramaPagoComponent.prototype.TipoCambioDolarPesoColombiano = function (monto) {
        var rpta = Number((monto * this.montoTipoCambioPesoColombiano).toFixed(2));
        return rpta;
    };
    CronogramaPagoComponent.prototype.EnviarFacturaDeVentaSiigo = function (datosformulario) {
        var _this = this;
        if (this.formCrearFactSiigo.valid) {
            this.loaderCrearFactSiigo = true;
            var formatDate = function (date) {
                return date.toISOString().split('T')[0];
            };
            var factura = {
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
            var cliente = {
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
            };
            var datosCompletos = {
                factura: factura,
                cliente: cliente
            };
            this.integraService.postJsonResponse(constApi_1.constApiFinanzas.DatosCompletosSiigo, datosCompletos)
                .subscribe({
                next: function (resp) {
                    if (resp.body != null) {
                        _this.ActualizarCronogramaPagoDetalleFinalSiigo();
                        _this.loaderCrearFactSiigo = true;
                        _this.modalRefCrearFactSiigo.close();
                        _this.alertService.mensajeExitoso();
                        var codMat = _this.formMatricula.get('codigoMat').value;
                        _this.ObtenerCronograma(codMat);
                    }
                },
                error: function (error) {
                    _this.loaderCrearFactSiigo = false;
                    _this.alertService.mensajeError(error);
                }
            });
        }
        else {
            this.formCrearFactSiigo.markAllAsTouched();
            sweetalert2_1["default"].fire("Error!", "Debe llenar los campos obligatorios.", "warning");
        }
    };
    CronogramaPagoComponent.prototype.ActualizarCronogramaPagoDetalleFinalSiigo = function () {
        this.integraService.putJsonResponse(constApi_1.constApiFinanzas.ActualizaEnviadoSiigo + '/' + this.idCronogramaPagoDetalleFinal)
            .subscribe(function (response) {
            console.log('Respuesta exitosa:', response);
        }, function (error) {
            console.error('Error en la solicitud:', error);
        });
    };
    CronogramaPagoComponent.prototype.simularPago = function () {
        var _this = this;
        if (this.formPago.get('monto').valid &&
            this.formPago.get('tipoCambio').valid &&
            this.formPago.get('idMoneda').valid) {
            var icon = void 0;
            var dataForm_1 = this.formPago.getRawValue();
            console.log(dataForm_1);
            var montofinal;
            var monedabase = this.listaMoneda.find(function (e) { return e.nombrePlural.toLowerCase() === _this.cuotaTemp.moneda.toLowerCase(); }).id;
            var monedaPago = this.listaMoneda.find(function (e) { return e.id === dataForm_1.idMoneda; }).nombrePlural;
            if (monedabase == dataForm_1.idMoneda)
                montofinal = dataForm_1.monto;
            else if (monedabase != 19 && dataForm_1.idMoneda == 19) //monto base soles y paga con dolares
                montofinal = dataForm_1.monto * dataForm_1.tipoCambio;
            else if (monedabase == 19 && dataForm_1.idMoneda != 19) //monto base dolares y paga con soles
                montofinal = dataForm_1.monto / dataForm_1.tipoCambio;
            montofinal = Math.round(montofinal * 100) / 100;
            var cuotaBase = Math.round((this.cuotaTemp.cuota + this.cuotaTemp.mora) * 100) / 100;
            var mensaje_1 = "Moneda Cronograma: " + this.cuotaTemp.moneda + "<br>";
            mensaje_1 += "Moneda Pago      : " + monedaPago.toLowerCase() + "<br>";
            mensaje_1 += "Monto Pago Real  : " + dataForm_1.monto + "<br>";
            mensaje_1 += "Tasa de Cambio   : " + dataForm_1.tipoCambio + "<br><br>";
            mensaje_1 += "Monto Cuota      : " + cuotaBase + "<br>";
            mensaje_1 += "Monto Pago       : " + montofinal + "<br><br>";
            if (this.PagoMaximoSolesDolares < montofinal) {
                mensaje_1 += "El monto a pagar supera la suma total de las cuotas pendientes";
                mensaje_1 += "<br><br> Resultado:<br> Pago no realizado" +
                    " <span class='k-icon k-i-x-circle k-icon-30' style='color:rgb(179, 97, 90) ; font-size: medium;padding-bottom: 2px;' ></span>";
                icon = 'error';
            }
            else if (montofinal > cuotaBase) {
                //fraccionar
                mensaje_1 += "Se cancelará la cuota ( " + dataForm_1.nroCuota + "-" + dataForm_1.nroSubCuota + " )<br>";
                var mensajeExtra_1 = "";
                var resto_1 = montofinal - cuotaBase;
                var resto1 = void 0;
                this.listaCronogramaActual.forEach(function (e) {
                    if (e.cancelado == false) {
                        if (resto_1 > 0) {
                            if (_this.cuotaTemp.nroCuota == e.nroCuota) {
                                if (_this.cuotaTemp.nroSubCuota != e.nroSubCuota) {
                                    resto_1 = resto_1 - Math.round((e.cuota + e.mora) * 100) / 100;
                                    if (resto_1 >= 0) {
                                        mensaje_1 += "Se cancelará la cuota ( " + e.nroCuota + "-" + e.nroSubCuota + " )<br>";
                                        mensajeExtra_1 = "Pagará mas de una cuota";
                                    }
                                    else if (resto_1 < 0) {
                                        mensaje_1 += "Se pagará parcialmente la cuota  ( " +
                                            e.nroCuota + "-" + e.nroSubCuota + " ) con el monto " + (Math.round(((e.cuota + e.mora) + resto_1) * 100) / 100).toString();
                                        mensajeExtra_1 = "Pago realizado y fraccionamiento de la cuota ( " +
                                            e.nroCuota + "-" + e.nroSubCuota + " )";
                                    }
                                }
                            }
                            else if (_this.cuotaTemp.nroCuota < e.nroCuota) {
                                resto_1 = resto_1 - Math.round((e.cuota + e.mora) * 100) / 100;
                                if (resto_1 >= 0) {
                                    mensaje_1 += "Se cancelará la cuota ( " + e.nroCuota + "-" + e.nroSubCuota + " )<br>";
                                    mensajeExtra_1 = "Pagará mas de una cuota";
                                }
                                else if (resto_1 < 0) {
                                    mensaje_1 += "Se pagará parcialmente la cuota  ( " +
                                        e.nroCuota + "-" + e.nroSubCuota + " ) con el monto " + (Math.round(((e.cuota + e.mora) + resto_1) * 100) / 100).toString();
                                    mensajeExtra_1 = "Pago realizado y fraccionamiento de la cuota ( " +
                                        e.nroCuota + "-" + e.nroSubCuota + " )";
                                }
                            }
                        }
                    }
                });
                icon = 'warning';
                mensaje_1 += "<br><br> Resultado:<br> " + mensajeExtra_1;
                mensaje_1 += " <span class='k-icon k-i-exclamation-circle k-icon-30' style='color: rgb(175, 161, 74); font-size: medium;padding-bottom: 2px;' ></span>";
            }
            else if (montofinal < cuotaBase) {
                mensaje_1 += "El monto a pagar no supera al monto cuota";
                mensaje_1 += "<br><br> Resultado:<br> Pago no realizado" +
                    " <span class='k-icon k-i-x-circle k-icon-30' style='color:rgb(179, 97, 90) ; font-size: medium;padding-bottom: 2px;' ></span>";
                icon = 'error';
            }
            else if (montofinal == cuotaBase) {
                mensaje_1 += "Se cancelará la cuota ( " + dataForm_1.nroCuota + "-" + dataForm_1.nroSubCuota + " )";
                mensaje_1 += "<br><br> Resultado:<br> Pago realizado" +
                    " <span class='k-icon k-i-check-outline k-icon-30' style='color: rgb(105, 185, 105); font-size: medium;padding-bottom: 2px;' ></span>";
                icon = 'success';
            }
            this.alertService.mensajeIcon;
            sweetalert2_1["default"].fire({
                icon: icon,
                title: 'Resultados del Simulador',
                html: "\n          <p >" + mensaje_1 + "</p>\n          "
            });
        }
        else {
            this.formPago.get('monto').markAllAsTouched();
            this.formPago.get('tipoCambio').markAllAsTouched();
            this.formPago.get('idMoneda').markAllAsTouched();
        }
    };
    CronogramaPagoComponent.prototype.agregarCuota = function () {
        var tamano = this.listaCronogramaEditable.length;
        var ultimo = this.listaCronogramaEditable[tamano - 1]; //trae el ultimo registro de la grilla
        this.listaCronogramaEditable.push({
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
        });
        var posicion = this.listacambiosorden.length == 0 ? 1 : this.listacambiosorden[this.listacambiosorden.length - 1].orden + 1;
        var nuevaCuota = {
            id: 0,
            tipoCambio: 'Agregar',
            orden: posicion,
            cuota: ultimo.nroCuota + 1,
            subCuota: 1
        };
        this.listacambiosorden.push(nuevaCuota);
    };
    CronogramaPagoComponent.prototype.cancelarCambios = function () {
        var stringActual = JSON.stringify(this.listaCronogramaActual);
        var stringEditado = JSON.stringify(this.listaCronogramaEditable);
        var NoisEquals = true;
        if (stringActual == stringEditado)
            NoisEquals = false;
        if (this.listacambiosorden.length > 0 || NoisEquals) {
            this.listaCambiosCronograma = [];
            this.listaCronogramaEditable = JSON.parse(this.cronogramaActual);
            this.listacambiosorden = [];
            sweetalert2_1["default"].fire("!Cambios cancelados¡", "El cronograma fue revertido a su versión actual!", "success");
            this.calcularcronograma();
        }
        else {
            sweetalert2_1["default"].fire("!Sin cambios!", "El cronograma no tiene cambios!", "info");
        }
    };
    CronogramaPagoComponent.prototype.fraccionarCuota = function (data, index) {
        var repetida = this.listacambiosorden.filter(function (x) {
            return x.tipoCambio == "Fecha" || x.tipoCambio == "Monto" || x.tipoCambio == "Mora";
        });
        //FlagEdicion
        if (data.cancelado == true) //si ya esta pagada
         {
            sweetalert2_1["default"].fire("!Cuota Pagada¡", "Una cuota pagada no se puede fraccionar!", "warning");
        }
        else {
            if (data.id != 0) {
                if (repetida.length > 0 || data.flagCancelado) {
                    sweetalert2_1["default"].fire("!Cambios en la cuota¡", "No puede fraccionar , tiene cambios de fecha , monto , mora o eliminacion pendientes!", "warning");
                }
                else {
                    //si hay algun de fraccion ay de esta cuota
                    var repetidafraccion = this.listacambiosorden.filter(function (x) {
                        return x.id == data.id && x.tipoCambio == "Fraccion";
                    });
                    if (repetidafraccion.length > 0) {
                        sweetalert2_1["default"].fire("!Cuota Fraccionada¡", "No puede fraccionar 2 veces la misma cuota!", "warning");
                    }
                    else {
                        this.abrirModalFraccionar(index);
                    }
                }
            }
            else {
                sweetalert2_1["default"].fire("!Cuota no existente¡", "No puede Fraccionar una cuota que no aun no existe!", "warning");
            }
        }
    };
    CronogramaPagoComponent.prototype.calcularcronograma = function () {
        var _this = this;
        //primero obtengo toda la suma de los montos
        var montototal = 0;
        this.valorReal = 0;
        this.listaCronogramaEditable.forEach(function (i) {
            montototal = montototal + (i.cuota == undefined ? 0 : i.cuota);
        });
        this.listaCronogramaEditable.forEach(function (i) {
            i.totalPagar = Math.round(montototal * 100) / 100;
            montototal = (montototal - i.cuota);
            i.saldo = Math.round(montototal * 100) / 100;
            i.cuota = Math.round(i.cuota * 100) / 100;
            _this.valorReal += i.cuota;
        });
        this.valorReal = Math.round(this.valorReal * 10000) / 10000;
    };
    CronogramaPagoComponent.prototype.abrirModalFraccionar = function (index) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: 'Fraccionar Cuota',
            text: "¿En cuántas cuotas quieres fraccionar la cuota actual?",
            input: 'number',
            inputAttributes: {
                min: '1',
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonColor: '#F44336',
            showLoaderOnConfirm: true
        }).then(function (result) {
            if (result.isConfirmed) {
                if (result.value.length > 0) {
                    var data_1 = _this.listaCronogramaEditable[index];
                    var nroSubCuota = parseInt(result.value);
                    var posicion = _this.listacambiosorden.length == 0 ?
                        1 :
                        _this.listacambiosorden[_this.listacambiosorden.length - 1].orden + 1;
                    var nroSubcuotaActual = data_1.nroSubCuota;
                    var nroSubcuotaSigue = data_1.nroSubCuota;
                    var validador = data_1.nroSubCuota;
                    var totalnrocuotas = (nroSubCuota + 1);
                    var montocuota = (data_1.cuota / totalnrocuotas);
                    data_1.cuota = (Math.round(montocuota * 100)) / 100; //actualizo el monto de la cuota que se fracciono
                    data_1.enviado = false; //actualizo el monto de la cuota que se fracciono
                    _this.listaCronogramaEditable.forEach(function (d) {
                        if (d.nroCuota == data_1.nroCuota && d.nroSubCuota == data_1.nroSubCuota)
                            rxjs_1.EMPTY; // mientras sea diferente al row actual // Se deshabilitan ////nada porque es igual
                        else {
                            // que no sea de agregar
                            var esagregado = _this.listacambiosorden.filter(function (x) {
                                return x.cuota == d.nroCuota && x.subCuota == d.nroSubCuota && x.tipoCambio == "Agregar";
                            });
                            if (esagregado.length > 0)
                                rxjs_1.EMPTY; //si es un agregado // no le quito
                            else {
                                var dataItem = _this.listaCronogramaEditable.find(function (z) { return z.id === d.id; });
                                dataItem.flagCancelado = true;
                            }
                        }
                    });
                    //ahora agregamos como libres de edicion: FlagEdicion:false
                    for (var i = 0; i < nroSubCuota; i++) {
                        nroSubcuotaSigue = nroSubcuotaSigue + 1; //la que sigue
                        var maximosubcuota = 0;
                        var cont = 1;
                        var flag = true;
                        while (flag) {
                            var existe = _this.listaCronogramaEditable.filter(function (x) {
                                return x.nroCuota == data_1.nroCuota && x.nroSubCuota == (nroSubcuotaActual + cont);
                            });
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
                            var existe = _this.listaCronogramaEditable.filter(function (x) {
                                return x.nroCuota == data_1.nroCuota && x.nroSubCuota == maximosubcuota - 1;
                            });
                            if (existe.length > 0) {
                                var dataItem = _this.listaCronogramaEditable.find(function (e) { return e.id == existe[0].id; });
                                if (i == 0) {
                                    //nuevo objeto de cambio
                                    var objRow_1 = {
                                        id: dataItem.id,
                                        tipoCambio: 'Fraccion Reemplazado',
                                        orden: posicion,
                                        cuota: dataItem.nroCuota,
                                        subCuota: dataItem.nroSubCuota
                                    };
                                    _this.listacambiosorden.push(objRow_1); //guardamos las cuotas afectadas
                                }
                                dataItem.nroSubCuota = maximosubcuota;
                                maximosubcuota = maximosubcuota - 1;
                            }
                        }
                        index = index + 1;
                        _this.listaCronogramaEditable.push({
                            nroCuota: data_1.nroCuota,
                            nroSubCuota: nroSubcuotaSigue,
                            id: 0,
                            flagCancelado: false,
                            enviado: false,
                            moneda: data_1.moneda,
                            tipoCuota: data_1.tipoCuota,
                            cuota: montocuota,
                            fechaVencimiento: data_1.fechaVencimiento,
                            mora: data_1.mora,
                            cancelado: false
                        });
                        //nuevo objeto de cambio
                        var objRow = {
                            id: data_1.id,
                            tipoCambio: 'Fraccion',
                            orden: posicion,
                            cuota: data_1.nroCuota,
                            subCuota: nroSubcuotaSigue
                        };
                        _this.listacambiosorden.push(objRow); //guardamos el cambio(id de la cuota fraccionada,tipo,posiciondecambio,detalle cuotas creadas)
                        nroSubcuotaActual = nroSubcuotaActual + 1;
                        validador = validador + 1;
                    }
                    _this.listaCronogramaEditable.sort(function (a, b) { return a.nroCuota - b.nroCuota; });
                    _this.calcularcronograma();
                }
                else {
                    sweetalert2_1["default"].fire("!Sin Nro. de Subcuotas¡", "Se necesita un número de subcuota a fraccionar!", "info");
                }
            }
        });
    };
    CronogramaPagoComponent.prototype.abrirModalConsiderarMora = function (data) {
        this.inputCuota.reset();
        this.montoPasar = data.mora;
        this.montoPasarMax = data.mora;
        this.inputCuota.setValue(this.listaNoPagados[0].id);
        this.modalService.open(this.modalConsiderarMora);
    };
    CronogramaPagoComponent.prototype.abrirModalGuardarCronograma = function () {
        if (this.listaCronogramaEditable.length > 0) {
            if (this.listacambiosorden.length > 0) {
                this.inputSolicitante.setValue(this.userService.idPersonal);
                this.inputAprobado.reset();
                this.inputObservacion.setValue("");
                this.modalService.open(this.modalGuardarCronograma);
            }
            else {
                sweetalert2_1["default"].fire("!Sin cambios registrados¡", "El cronograma no tiene ningún cambio,el cambio de    sub-cuota se considera dentro de Eliminar!", "warning");
            }
        }
        else {
            sweetalert2_1["default"].fire("!El cronograma sin cuotas¡", "No se puede guardar un crongrama sin cuotas!", "warning");
        }
    };
    //------------------------------------------------------------------------------------------------------
    //Funciones CRUD -------------------------------------------------------------------------------------------------------
    CronogramaPagoComponent.prototype.eliminarMatricula = function () {
        var _this = this;
        this.loaderModalEliminar = true;
        var codMat = this.formMatricula.get('codigoMat').value;
        this.integraService
            .deleteJsonResponse(constApi_1.constApiFinanzas.EliminarMatricula
            + "/" + codMat + "/" + this.tipoEliminacion.value + "/" + this.userService.userName)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                if (typeof response.body == "object") {
                    _this.loaderModalEliminar = false;
                    _this.fun3 = false;
                    _this.fun1 = false;
                    _this.fun2 = false;
                    _this.loaderGeneral = true;
                    _this.ObtenerCostosAdministrativosCodigoMatricula(codMat);
                    _this.ObtenerDatosMatriculaPorCodigoMatricula(codMat);
                    _this.ObtenerCronograma(codMat);
                    _this.modalService.dismissAll(_this.modalEliminar);
                    sweetalert2_1["default"].fire("!Operación Exitosa¡", response.body.message, "success");
                }
            },
            error: function (error) {
                _this.loaderModalEliminar = false;
                _this.finanzasService.MensajeDeError(error, "eliminar matricula");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.guardarMatricula = function () {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Está seguro que quieres registar los cambios para esta matrícula?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Continuar!'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.loaderGeneral = true;
                var dataForm = _this.formDatosMatricula.getRawValue();
                console.log(dataForm);
                var envio = {
                    codigomatricula: _this.codigoMatriculaTemp,
                    estado: dataForm.estadoMatricula,
                    periodo: dataForm.periodo == 0 ? null : dataForm.periodo,
                    programa: dataForm.idPEspecifico,
                    asesor: dataForm.idAsesor,
                    coordinador: dataForm.idCoordinador,
                    observaciones: dataForm.observaciones,
                    empresaPaga: dataForm.empresaPagaForm,
                    empresaNombre: dataForm.empresaPagaForm == false ? "" : dataForm.empresaNombre,
                    usuario: _this.userService.userName
                };
                _this.integraService
                    .postJsonResponse(constApi_1.constApiFinanzas.ActualizarMatricula, envio)
                    .subscribe({
                    next: function (response) {
                        _this.loaderGeneral = false;
                        _this.ObtenerDatosMatriculaPorCodigoMatricula(_this.codigoMatriculaTemp);
                        sweetalert2_1["default"].fire("!Operación Exitosa¡", "Los datos fueron actualizados correctamente!", "success");
                    },
                    error: function (error) {
                        _this.loaderGeneral = false;
                        _this.finanzasService.MensajeDeError(error, "actualizar matricula");
                    },
                    complete: function () { }
                });
            }
        });
    };
    CronogramaPagoComponent.prototype.guardarDocumentos = function () {
        var _this = this;
        this.loaderDocumento = true;
        var codMat = this.formMatricula.get('codigoMat').value;
        var listaDocumentos = [];
        this.listaDocumento.forEach(function (e) {
            var doc = {
                idCriterioDocs: e.idCriterioDocs,
                ingresar: e.estado == 1 || e.estado == true ? true : false,
                usuario: _this.userService.userName
            };
            listaDocumentos.push(doc);
        });
        var envio = {
            listaDocumentos: listaDocumentos,
            matricula: codMat
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiFinanzas.ActualizarEntregaControlDocs, envio)
            .subscribe({
            next: function (response) {
                _this.loaderDocumento = false;
                _this.modalService.dismissAll(_this.modalDocumentos);
                sweetalert2_1["default"].fire("!Operación Exitosa¡", "Los documentos fueron actualizados correctamente!", "success");
            },
            error: function (error) {
                _this.loaderDocumento = false;
                _this.finanzasService.MensajeDeError(error, "actualizar Documentos");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.guardarTasa = function () {
        var _this = this;
        if (this.formTasaAcademica.valid) {
            this.loaderModalTasa = true;
            var dataForm_2 = this.formTasaAcademica.getRawValue();
            var envio = {
                codigoMatricula: this.codigoMatriculaTemp,
                idConcepto: dataForm_2.idConcepto,
                monto: dataForm_2.monto,
                moneda: this.listaMoneda.find(function (e) { return e.id == dataForm_2.moneda; }).nombrePlural,
                usuario: this.userService.userName,
                fechaPago: date_pipe_1.datePipeTransform(dataForm_2.fechaPago, 'yyyy-MM-ddTHH:mm:ss', 'en-US')
            };
            this.integraService
                .postJsonResponse(constApi_1.constApiFinanzas.AgregarTasasAcademicas, envio)
                .subscribe({
                next: function (response) {
                    _this.ObtenerCostosAdministrativosCodigoMatricula(_this.codigoMatriculaTemp);
                    _this.loaderModalTasa = false;
                    _this.modalService.dismissAll(_this.modalTasaAcademica);
                    sweetalert2_1["default"].fire("!Operación Exitosa¡", "La tasa academica se guardo correctamente!", "success");
                },
                error: function (error) {
                    _this.loaderModalTasa = false;
                    _this.finanzasService.MensajeDeError(error, "guardar tasa administrativa");
                },
                complete: function () { }
            });
        }
        else
            this.formTasaAcademica.markAllAsTouched();
    };
    CronogramaPagoComponent.prototype.guardarFormaPagoCuota = function (idCuota, idFormaPago) {
        var _this = this;
        this.loaderCronogramaActual = true;
        this.integraService
            .putJsonResponse(constApi_1.constApiFinanzas.ActualizarFormaPago + "/" + idCuota + "/" + idFormaPago + "/" + this.userService.userName, null)
            .subscribe({
            next: function (response) {
                _this.ObtenerCronograma(_this.codigoMatriculaTemp);
                sweetalert2_1["default"].fire("!Operación Exitosa¡", response.body.message, "success");
                _this.loaderCronogramaActual = false;
            },
            error: function (error) {
                _this.ObtenerCronograma(_this.codigoMatriculaTemp);
                _this.loaderCronogramaActual = false;
                _this.finanzasService.MensajeDeError(error, "cronograma actual - guardar forma pago");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.guardarFechaPagoCuota = function (idCuota, fechaPago) {
        var _this = this;
        this.loaderCronogramaActual = true;
        var envio = {
            idCuota: idCuota,
            fechaPago: fechaPago,
            usuario: this.userService.userName
        };
        this.integraService
            .putJsonResponse(constApi_1.constApiFinanzas.ActualizarFechaPago, envio)
            .subscribe({
            next: function (response) {
                _this.ObtenerCronograma(_this.codigoMatriculaTemp);
                sweetalert2_1["default"].fire("!Operación Exitosa¡", response.body.message, "success");
                _this.loaderCronogramaActual = false;
            },
            error: function (error) {
                _this.ObtenerCronograma(_this.codigoMatriculaTemp);
                _this.loaderCronogramaActual = false;
                _this.finanzasService.MensajeDeError(error, "cronograma actual - guardar forma pago");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.guardarFechaDepositoCuota = function (idCuota, fechaDeposito) {
        var _this = this;
        this.loaderCronogramaActual = true;
        var envio = {
            idCuota: idCuota,
            fechaDeposito: fechaDeposito,
            usuario: this.userService.userName
        };
        this.integraService
            .putJsonResponse(constApi_1.constApiFinanzas.ActualizarFechaDeposito, envio)
            .subscribe({
            next: function (response) {
                _this.ObtenerCronograma(_this.codigoMatriculaTemp);
                sweetalert2_1["default"].fire("!Operación Exitosa¡", response.body.message, "success");
                _this.loaderCronogramaActual = false;
            },
            error: function (error) {
                _this.ObtenerCronograma(_this.codigoMatriculaTemp);
                _this.loaderCronogramaActual = false;
                _this.finanzasService.MensajeDeError(error, "cronograma actual - guardar forma pago");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.guardarPagoCuota = function () {
        var _this = this;
        if (this.formPago.valid) {
            sweetalert2_1["default"].fire({
                title: '¿Está seguro que quieres realizar el pago?',
                text: '¡No podrás revertir esto, recuerda validarlo con el boton Simular!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4C5FC0',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, Continuar!'
            }).then(function (result) {
                if (result.isConfirmed) {
                    var dataForm_3 = _this.formPago.getRawValue();
                    var montofinal;
                    var monedabase = _this.listaMoneda.find(function (e) { return e.nombrePlural.toLowerCase() === _this.cuotaTemp.moneda.toLowerCase(); }).id;
                    if (monedabase == dataForm_3.idMoneda)
                        montofinal = dataForm_3.monto;
                    else if (monedabase != 19 && dataForm_3.idMoneda == 19) //monto base soles y paga con dolares
                        montofinal = dataForm_3.monto * dataForm_3.tipoCambio;
                    else if (monedabase == 19 && dataForm_3.idMoneda != 19) //monto base dolares y paga con soles
                        montofinal = dataForm_3.monto / dataForm_3.tipoCambio;
                    montofinal = Math.round(montofinal * 100) / 100;
                    var cuotaBase = Math.round((_this.cuotaTemp.cuota + _this.cuotaTemp.mora) * 100) / 100;
                    if (montofinal >= cuotaBase) {
                        _this.loaderModalPago = true;
                        dataForm_3.nroCheque = (dataForm_3.nroCheque).toString();
                        var envio = {
                            codigoMatricula: _this.codigoMatriculaTemp,
                            nroCuota: dataForm_3.nroCuota,
                            nroSubCuota: dataForm_3.nroSubCuota,
                            montoBase: _this.cuotaTemp.cuota,
                            mora: _this.cuotaTemp.mora,
                            montoPago: dataForm_3.monto,
                            monedaBase: (_this.cuotaTemp.moneda).toLowerCase(),
                            monedaPago: (_this.listaMoneda.find(function (e) { return e.id === dataForm_3.idMoneda; }).nombrePlural).toLowerCase(),
                            tipoCambio: dataForm_3.tipoCambio,
                            formaPago: dataForm_3.idformaPago,
                            documento: dataForm_3.idDocumneto,
                            nroDocumento: dataForm_3.nroCheque,
                            nroCuenta: dataForm_3.idCuenta,
                            nroCheque: dataForm_3.nroCheque,
                            fecha: date_pipe_1.datePipeTransform(dataForm_3.fechaPago, 'yyyy-MM-ddTHH:mm:ss', 'en-US'),
                            nroDeposito: dataForm_3.nroCheque,
                            usuario: _this.userService.userName
                        };
                        _this.integraService
                            .postJsonResponse(constApi_1.constApiFinanzas.GuardarPago, envio)
                            .subscribe({
                            next: function (response) {
                                _this.ObtenerCronograma(_this.codigoMatriculaTemp);
                                sweetalert2_1["default"].fire("!Operación Exitosa¡", "El pago se ha realizado correctamente", "success");
                                _this.modalService.dismissAll(_this.modalPagarCuota);
                                _this.loaderModalPago = false;
                            },
                            error: function (error) {
                                _this.ObtenerCronograma(_this.codigoMatriculaTemp);
                                _this.loaderModalPago = false;
                                _this.finanzasService.MensajeDeError(error, "cronograma actual - guardar pago");
                            },
                            complete: function () { }
                        });
                    }
                    else {
                        sweetalert2_1["default"].fire("!Pago no realizado¡", "Revisa los resultados del simulador!", "error");
                    }
                }
            });
        }
        else
            this.formPago.markAllAsTouched();
    };
    CronogramaPagoComponent.prototype.guardarGestionDeCobranza = function (idCuota, moraTarifario) {
        var _this = this;
        this.loaderCronogramaActual = true;
        var envio = {
            idCuota: idCuota,
            moraTarifario: moraTarifario,
            usuario: this.userService.userName
        };
        this.integraService
            .putJsonResponse(constApi_1.constApiFinanzas.ActualizarGestionDeCobranza, envio)
            .subscribe({
            next: function (response) {
                _this.ObtenerCronograma(_this.codigoMatriculaTemp);
                sweetalert2_1["default"].fire("!Operación Exitosa¡", response.body.message, "success");
                _this.loaderCronogramaActual = false;
            },
            error: function (error) {
                _this.ObtenerCronograma(_this.codigoMatriculaTemp);
                _this.loaderCronogramaActual = false;
                _this.finanzasService.MensajeDeError(error, "cronograma actual - guardar gestion de cobranza");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.eliminarCuota = function (data, index) {
        var _this = this;
        if (data.cancelado == false) {
            var cambiosanteriores = this.listacambiosorden.filter(function (x) {
                return x.tipoCambio == 'Fraccion' ||
                    x.tipoCambio == 'Fraccion Reemplazado' ||
                    x.tipoCambio == 'Monto' ||
                    x.tipoCambio == 'Fecha' ||
                    x.tipoCambio == 'Mora';
            });
            if (cambiosanteriores.length == 0) {
                sweetalert2_1["default"].fire({
                    title: '¿Está seguro que quieres eliminar la cuota?',
                    text: '¡No podrás revertir esto!',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#4C5FC0',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '¡Si, Continuar!'
                }).then(function (result) {
                    if (result.isConfirmed) {
                        _this.listaCronogramaEditable.splice(index, 1);
                        _this.listaCronogramaEditable = _this.listaCronogramaEditable.slice();
                        _this.listaCronogramaEditable.forEach(function (d) {
                            d.flagCancelado = true;
                        });
                        //para terminar añadimos un nuevo cambio como eliminado
                        var posicion = _this.listacambiosorden.length == 0 ?
                            1 : _this.listacambiosorden[_this.listacambiosorden.length - 1].orden + 1;
                        //objeto de cambio
                        var objRow = {
                            id: data.id,
                            tipoCambio: 'Eliminado',
                            orden: posicion,
                            cuota: data.nroCuota,
                            subCuota: data.nroSubCuota
                        };
                        _this.listacambiosorden.push(objRow);
                        _this.calcularcronograma();
                    }
                });
            }
            else {
                sweetalert2_1["default"].fire("!Cambios Pendientes¡", "No se puede eliminar esta cuota, porque tienes cambios de fecha , monto , mora o fraccionamiento pendientes!", "warning");
            }
        }
        else {
            sweetalert2_1["default"].fire("!Cuota Pagada¡", "No se puede eliminar esta cuota, porque ya esta pagada!", "warning");
        }
    };
    CronogramaPagoComponent.prototype.consideraMora = function (data, index) {
        var _this = this;
        if (data.cancelado == true) {
            if (data.mora > 0) {
                this.loaderCronogramaEditable = true;
                this.integraService
                    .getJsonResponse(constApi_1.constApiFinanzas.ObtenerCuotasNoPagadas + "/" + this.codigoMatriculaTemp + "/" + data.version)
                    .subscribe({
                    next: function (response) {
                        if (response.body != null && response.body.length > 0) {
                            _this.listaNoPagados = response.body;
                            _this.loaderCronogramaEditable = false;
                            _this.abrirModalConsiderarMora(data);
                            _this.cuotaMoraTemp.codigoMatricula = _this.codigoMatriculaTemp;
                            _this.cuotaMoraTemp.nroCuota = data.nroCuota;
                            _this.cuotaMoraTemp.nroSubCuota = data.nroSubCuota;
                            _this.cuotaMoraTemp.cuota = data.cuota;
                            _this.cuotaMoraTemp.mora = data.mora;
                            _this.cuotaMoraTemp.version = data.version;
                        }
                        else {
                            _this.loaderCronogramaEditable = false;
                            sweetalert2_1["default"].fire("!Cuotas Pagadas¡", "No se puede considerar la mora porque todas las cuotas ya estan pagadas!", "warning");
                        }
                    },
                    error: function (error) {
                        _this.loaderCronogramaEditable = false;
                        _this.finanzasService.MensajeDeError(error, "cronograma editable - obtener cuotas no pagadas");
                    },
                    complete: function () { }
                });
            }
            else {
                sweetalert2_1["default"].fire("!Cuota con mora 0¡", "No se puede considerar la mora como adelanto de una cuota con el monto mora 0!", "warning");
            }
        }
        else {
            sweetalert2_1["default"].fire("!Cuota no Pagada¡", "No se puede considerar la mora como adelanto de una cuota no pagada!", "warning");
        }
    };
    CronogramaPagoComponent.prototype.guardarConsiderarMora = function () {
        var _this = this;
        if (this.inputMontoPasar.valid) {
            this.cuotaMoraTemp.montoAdelanto = this.inputMontoPasar.value;
            this.cuotaMoraTemp.id = this.inputCuota.value;
            this.listaCronogramaEditable.forEach(function (e) {
                if (e.nroCuota == _this.cuotaMoraTemp.nroCuota && e.nroSubCuota == _this.cuotaMoraTemp.nroSubCuota) {
                    e.cuota = e.cuota + Math.round(_this.cuotaMoraTemp.montoAdelanto * 100) / 100;
                    e.mora = e.mora - Math.round(_this.cuotaMoraTemp.montoAdelanto * 100) / 100;
                }
                if (e.id == _this.cuotaMoraTemp.id) {
                    e.cuota = e.cuota - Math.round(_this.cuotaMoraTemp.montoAdelanto * 100) / 100;
                }
            });
            var envio = {
                listaCronograma: this.listaCronogramaEditable,
                objeto: this.cuotaMoraTemp,
                usuario: this.userService.userName
            };
            this.loaderModalEliminar = true;
            this.integraService
                .postJsonResponse(constApi_1.constApiFinanzas.ActualizarMoraCAdelanto, envio)
                .subscribe({
                next: function (response) {
                    _this.ObtenerCronograma(_this.codigoMatriculaTemp);
                    _this.loaderModalEliminar = false;
                    sweetalert2_1["default"].fire("¡Operación Exitosa!", "La mora fue considerada en la cuota ( " + _this.cuotaMoraTemp.nroCuota + "-" + _this.cuotaMoraTemp.nroSubCuota + " )!", "success");
                },
                error: function (error) {
                    _this.loaderModalEliminar = false;
                    _this.finanzasService.MensajeDeError(error, "cronograma editable - considerar mora");
                },
                complete: function () {
                    _this.modalService.dismissAll(_this.modalConsiderarMora);
                }
            });
        }
        else
            this.inputMontoPasar.markAllAsTouched();
    };
    CronogramaPagoComponent.prototype.guardarCronogramaModificado = function () {
        var _this = this;
        if (this.inputAprobado.valid && this.inputSolicitante.valid) {
            sweetalert2_1["default"].fire({
                title: '¿Estás seguro que quieres guardar los cambios para este cronograma?',
                text: '¡No podrás revertir esto!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4C5FC0',
                cancelButtonColor: '#d33',
                confirmButtonText: '¡Si, Continuar!'
            }).then(function (result) {
                if (result.isConfirmed) {
                    var objeto = {
                        codigoMatricula: _this.codigoMatriculaTemp,
                        aprobadoPorId: _this.inputAprobado.value,
                        solicitadoPorId: _this.inputSolicitante.value,
                        comentario: _this.inputObservacion.value
                    };
                    var envio_1 = {
                        objeto: objeto,
                        listaCambiosOrden: _this.listacambiosorden,
                        listaCronograma: _this.listaCronogramaEditable,
                        usuario: _this.userService.userName
                    };
                    _this.listacambiosorden.forEach(function (e) {
                        if (e.tipoCambio === 'Fecha') {
                            var index = envio_1.listaCronograma.findIndex(function (c) { return c.id === e.id; });
                            if (index !== -1) {
                                envio_1.listaCronograma[index].fechaVencimiento = date_pipe_1.datePipeTransform(envio_1.listaCronograma[index].fechaVencimiento, 'yyyy-MM-ddTHH:mm:ss', 'en-US');
                            }
                        }
                    });
                    _this.loaderModalEliminar = true;
                    _this.integraService
                        .postJsonResponse(constApi_1.constApiFinanzas.GuardarCronograma, envio_1)
                        .subscribe({
                        next: function (response) {
                            _this.insertarReporteCambios();
                            _this.loaderModalEliminar = false;
                            _this.ObtenerCronograma(_this.codigoMatriculaTemp);
                            _this.modalService.dismissAll(_this.modalGuardarCronograma);
                            sweetalert2_1["default"].fire("¡Operación Exitosa!", "Los cambios se guardaron de manera correcta!", "success");
                        },
                        error: function (error) {
                            _this.loaderModalEliminar = false;
                            _this.finanzasService.MensajeDeError(error, "cronograma editable - guardar cambios");
                        },
                        complete: function () { }
                    });
                }
            });
        }
        else {
            this.inputAprobado.markAllAsTouched();
            this.inputSolicitante.markAllAsTouched();
        }
    };
    CronogramaPagoComponent.prototype.insertarReporteCambios = function () {
        var _this = this;
        if (this.listaCambiosCronograma.length > 0) {
            this.integraService
                .postJsonResponse(constApi_1.constApiFinanzas.InsertarCambiosPeriodo, this.listaCambiosCronograma)
                .subscribe({
                next: function (response) {
                    _this.listaCambiosCronograma = [];
                },
                error: function (error) {
                    _this.finanzasService.MensajeDeError(error, 'El cronograma modificado fue guardado exitosamente, pero el reporte de cambios no se ha podido guardar, comunicar el error a TI.');
                },
                complete: function () {
                }
            });
        }
    };
    CronogramaPagoComponent.prototype.mostrarMensajeError = function (error) {
        sweetalert2_1["default"].fire({
            icon: "error",
            html: "<p class=\"text-start\">" + error.error + "</p>\n          <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    CronogramaPagoComponent.prototype.onKeyDownNumero = function (event) {
        var validKeys = ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Delete'];
        var isNumber = function (key) { return /^[0-9]$/.test(key); };
        if (!validKeys.includes(event.key) && !isNumber(event.key)) {
            event.preventDefault();
        }
    };
    CronogramaPagoComponent.prototype.onKeyDownMonto = function (event) {
        var validKeys = ['Backspace', 'Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'Delete', '.'];
        var isNumber = function (key) { return /^[0-9]$/.test(key); };
        if (!validKeys.includes(event.key) && !isNumber(event.key)) {
            event.preventDefault();
        }
    };
    CronogramaPagoComponent.prototype.abrirModalFacturama = function (dataItem) {
        // Validar si el campo `cancelado` está en `true`
        if (dataItem.cancelado === true) {
            // Validar si ya fue enviado previamente
            if (dataItem.facturamaEnvio !== true) {
                // Guardar el ID del registro seleccionado
                this.idCronogramaPagoDetalleFinal = dataItem.id;
                this.ObtenerListaFormaPagoFacturama();
                this.ObtenerListaUsoCfdiFacturama();
                this.ObtenerListaRegimenFiscalFacturama();
                this.calcularTotales(); // Forzar el cálculo al abrir el modal
                this.formCrearFacturaFacturama.patchValue({
                    // Datos Generales
                    CfdiType: dataItem.CfdiType || null,
                    PaymentForm: dataItem.PaymentForm || null,
                    PaymentMethod: dataItem.PaymentMethod || null,
                    ExpeditionPlace: '01000',
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
                    Country: dataItem.Country || 'MEX',
                    // Detalle del Producto
                    ProductCode: '01010101',
                    Description: "SERVICIOS EDUCATIVOS - " + this.nombreCentroCosto,
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
                    ItemTotal: dataItem.ItemTotal || null
                });
                // Abrir modal
                this.modalRefCrearFactFacturma = this.modalService.open(this.modalCrearFacturaFacturama, {
                    size: "xl",
                    backdrop: 'static'
                });
            }
            else {
                sweetalert2_1["default"].fire('¡Factura ya enviada!', 'La factura seleccionada ya fue enviada a Facturama.', 'warning');
            }
        }
        else {
            // Alerta si el campo `cancelado` es falso
            sweetalert2_1["default"].fire('¡Cuota sin pagar!', 'La cuota seleccionada no está cancelada. Selecciona una cuota pagada.', 'warning');
        }
    };
    CronogramaPagoComponent.prototype.argarDatosAlumno = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.ObtenerAlumnoProgramaEspecifico)
            .subscribe({
            next: function (response) {
                _this.datosAlumno = response[0];
            },
            error: function (error) {
                console.error('Error al cargar los datos del alumno', error);
            }
        });
    };
    // Función para enviar factura a Facturama
    CronogramaPagoComponent.prototype.CrearClienteFacturama = function () {
        var _this = this;
        var datosFormulario = this.formCrearClienteFacturama.value;
        var cliente = {
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
                Country: datosFormulario.address.country || 'MEX' // Por defecto MEX
            }
        };
        console.log('Datos del Cliente JSON:', cliente);
        this.integraService.postJsonResponse('ruta/api/crearClienteFacturama', cliente)
            .subscribe({
            next: function (resp) {
                console.log('Cliente creado:', resp);
                if (resp.status === 201) {
                    _this.alertService.mensajeExitoso('Cliente creado correctamente');
                    _this.modalService.dismissAll(); // Cierra el modal si es exitoso
                }
                else {
                    console.warn('Respuesta inesperada:', resp.body);
                }
            },
            error: function (error) {
                console.error('Error en la solicitud:', error);
                _this.alertService.mensajeError('Ocurrió un error al crear el cliente: ' + error.message);
            }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerListaRegimenFiscalFacturama = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.ObtenerListaRegimenFiscal)
            .subscribe({
            next: function (response) {
                _this.listaFacturmaRegimenFiscal = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "Lista - Regimen Fiscal");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerListaUsoCfdiFacturama = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.ObtenerListaUsoCfdi)
            .subscribe({
            next: function (response) {
                _this.listaFacturmaUsoCfdi = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "Lista - Regimen Fiscal");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.ObtenerListaFormaPagoFacturama = function () {
        var _this = this;
        this.integraService
            .getJsonResponse("" + constApi_1.constApiFinanzas.ObtenerFormapagoFacturama)
            .subscribe({
            next: function (response) {
                _this.listaFacturamaFormaPago = response.body;
            },
            error: function (error) {
                _this.finanzasService.MensajeDeError(error, "Lista - Regimen Fiscal");
            },
            complete: function () { }
        });
    };
    CronogramaPagoComponent.prototype.EnviarFacturaYCliente = function () {
        var _this = this;
        var _a;
        // Obtener datos del formulario
        var datosFormulario = this.formCrearFacturaFacturama.value;
        var usuarioData = JSON.parse(localStorage.getItem('userData') || '{}');
        var usuarioModificacion = usuarioData.userName;
        // Validar datos obligatorios
        if (!datosFormulario.ReceiverRfc || !datosFormulario.ReceiverName) {
            this.alertService.mensajeError('El RFC y el Nombre del receptor son obligatorios.');
            return;
        }
        var datosCompletos = {
            factura: {
                CfdiType: datosFormulario.CfdiType,
                PaymentForm: datosFormulario.PaymentForm,
                PaymentMethod: datosFormulario.PaymentMethod,
                ExpeditionPlace: datosFormulario.ExpeditionPlace || '01000',
                GlobalInformation: datosFormulario.Periodicity
                    ? {
                        Periodicity: datosFormulario.Periodicity,
                        Months: datosFormulario.Months,
                        Year: ((_a = datosFormulario.Year) === null || _a === void 0 ? void 0 : _a.toString()) || ''
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
        console.log('Datos completos enviados desde el formulario:', datosCompletos);
        this.integraService.postJsonResponse(constApi_1.constApiFinanzas.CrearFacturaFacturama, datosCompletos).subscribe({
            next: function (response) {
                console.log('Respuesta del servidor:', response);
                if (response.status === 201 || response.status === 200) {
                    _this.actualizarEstadoFacturamaEnvio(_this.idCronogramaPagoDetalleFinal, usuarioModificacion); // Envía el ID aquí
                    _this.alertService.mensajeExitoso('Factura y cliente enviados correctamente.');
                    _this.modalService.dismissAll(); // Cerrar el modal
                    var codMat = _this.formMatricula.get('codigoMat').value;
                    _this.ObtenerCronograma(codMat);
                }
                else {
                    console.warn('Respuesta inesperada:', response.body);
                }
            },
            error: function (error) {
                console.error('Error en la solicitud:', error);
                _this.alertService.mensajeError('Ocurrió un error al enviar los datos: ' + error.message);
            }
        });
    };
    CronogramaPagoComponent.prototype.EnviarFacturaYCliente9 = function () {
        var _this = this;
        // Validar formulario
        if (this.formCrearFacturaFacturama.valid) {
            this.loaderCrearFacturaFacturama = true;
            // Obtener los datos del formulario
            var datosFormulario = this.formCrearFacturaFacturama.value;
            // Preparar datos completos
            var datosCompletos = {
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
            this.integraService.postJsonResponse(constApi_1.constApiFinanzas.CrearFacturaFacturama, datosCompletos).subscribe({
                next: function (response) {
                    if (response.status === 201 || response.status === 200) {
                        _this.alertService.mensajeExitoso('Factura y cliente enviados correctamente.');
                        _this.modalService.dismissAll();
                    }
                    else {
                        console.warn('Respuesta inesperada:', response.body);
                        _this.alertService.mensajeError('Hubo un problema en el envío.');
                    }
                    _this.loaderCrearFacturaFacturama = false;
                },
                error: function (error) {
                    console.error('Error en la solicitud:', error);
                    _this.loaderCrearFacturaFacturama = false;
                    _this.alertService.mensajeError('Ocurrió un error al enviar los datos: ' + error.message);
                }
            });
        }
        else {
            this.formCrearFacturaFacturama.markAllAsTouched();
            sweetalert2_1["default"].fire('Error!', 'Debe llenar los campos obligatorios.', 'warning');
        }
    };
    // Función para actualizar la tabla con FacturamaEnvio = 1
    // Función para actualizar el estado FacturamaEnvio
    CronogramaPagoComponent.prototype.actualizarEstadoFacturamaEnvio = function (id, usuarioModificacion) {
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
    CronogramaPagoComponent.prototype.calcularTotales = function () {
        var _a, _b;
        var quantity = ((_a = this.formCrearFacturaFacturama.get('Quantity')) === null || _a === void 0 ? void 0 : _a.value) || 0;
        var unitPrice = ((_b = this.formCrearFacturaFacturama.get('UnitPrice')) === null || _b === void 0 ? void 0 : _b.value) || 0;
        var subtotal = quantity * unitPrice;
        var total = subtotal;
        this.formCrearFacturaFacturama.patchValue({
            Subtotal: subtotal,
            ItemTotal: total
        });
    };
    __decorate([
        core_1.ViewChild('modalTasaAcademica')
    ], CronogramaPagoComponent.prototype, "modalTasaAcademica");
    __decorate([
        core_1.ViewChild('modalEliminar')
    ], CronogramaPagoComponent.prototype, "modalEliminar");
    __decorate([
        core_1.ViewChild('modalDocumentos')
    ], CronogramaPagoComponent.prototype, "modalDocumentos");
    __decorate([
        core_1.ViewChild('modalPagarCuota')
    ], CronogramaPagoComponent.prototype, "modalPagarCuota");
    __decorate([
        core_1.ViewChild('modalConsiderarMora')
    ], CronogramaPagoComponent.prototype, "modalConsiderarMora");
    __decorate([
        core_1.ViewChild('modalGuardarCronograma')
    ], CronogramaPagoComponent.prototype, "modalGuardarCronograma");
    __decorate([
        core_1.ViewChild('modalCrearFactSiigo')
    ], CronogramaPagoComponent.prototype, "modalCrearFactSiigo");
    __decorate([
        core_1.ViewChild('modalCrearFacturaFacturama')
    ], CronogramaPagoComponent.prototype, "modalCrearFacturaFacturama");
    CronogramaPagoComponent = __decorate([
        core_1.Component({
            selector: 'app-cronograma-pago',
            templateUrl: './cronograma-pago.component.html',
            styleUrls: ['./cronograma-pago.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], CronogramaPagoComponent);
    return CronogramaPagoComponent;
}());
exports.CronogramaPagoComponent = CronogramaPagoComponent;

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DocumentoLegalComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var text_validator_1 = require("@shared/validators/text.validator");
var sweetalert2_1 = require("sweetalert2");
var grid_documento_legal_1 = require("./grid-documento-legal");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss.SSS';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var DocumentoLegalComponent = /** @class */ (function () {
    function DocumentoLegalComponent(integraService, formBuilder, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.formGroupDocumentoLegal = this.formBuilder.group({
            id: [0],
            nombre: ['',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace
                ]
            ],
            descripcion: ['',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace
                ]
            ],
            paises: ['', forms_1.Validators.required],
            url: ['',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace
                ]
            ],
            areas: ['', forms_1.Validators.required],
            roles: ['', forms_1.Validators.required],
            visualizarAgenda: '',
            descargarAgenda: '',
            probar: ''
        });
        // .----------------------- Variables  --------------------
        this.successIcon = iconInputValidation;
        this.loaderModal = false;
        this.loader = false;
        this.btnModalNombre = '';
        this.nombreModal = '';
        this.maxlength = 1000;
        this.listaDocumentoLegal = [];
        this.listaPaises = [];
        this.listaAreaAgenda = [];
        this.listaRoles = [
            { Text: "ASESOR/ASISTENTE", Value: "Asesor" },
            { Text: "COORDINADOR", Value: "Coordinador" }
        ];
        this.gridDocumentoLegal = new grid_documento_legal_1.GridDocumentoLegal();
    }
    DocumentoLegalComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loader = true;
        this.integraService.obtenerTodo(constApi_1.constApiGlobal.PaisObtenerPaisCombo)
            .subscribe({
            next: function (response) {
                _this.listaPaises = response.body;
                console.log(response.body);
                _this.integraService.obtenerTodo(constApi_1.constApi.AreaTrabajoObtenerAreaAgenda)
                    .subscribe({
                    next: function (response) {
                        _this.listaAreaAgenda = response.body;
                        console.log(response.body);
                        _this.obtenerListaDocumentoLegal();
                    },
                    error: function (error) {
                        _this.mostrarMensajeError(error);
                    },
                    complete: function () { }
                });
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    // FUNCIONES ------------------------------------------------
    DocumentoLegalComponent.prototype.convertirPais = function (data) {
        console.log(data);
        var listaIdPais = [];
        data.forEach(function (e) {
            listaIdPais.push(e.idPais);
        });
        this.formGroupDocumentoLegal.get('paises').setValue(listaIdPais);
    };
    DocumentoLegalComponent.prototype.EliminarAreasRepetidas = function (data) {
        console.log("repetida: ", data);
        var lista = [];
        data.forEach(function (e) {
            if (!(lista.includes(e))) {
                lista.push(e);
            }
        });
        console.log("Lista no repetida: ", lista);
        return lista;
    };
    DocumentoLegalComponent.prototype.onValueChange = function (ev) {
        this.charachtersCount = ev.length;
        this.counter = this.charachtersCount + "/" + this.maxlength;
    };
    DocumentoLegalComponent.prototype.openModalDocumentoLegal = function (isNew, data) {
        if (!isNew) {
            this.tempDocumentoLegal = data;
            this.charachtersCount = data.url.length;
            this.counter = this.charachtersCount + "/" + this.maxlength;
            this.formGroupDocumentoLegal.reset();
            data.areas = this.EliminarAreasRepetidas(data.areas);
            if (typeof data.roles === "string")
                data.roles = data.roles.split(',', 2);
            this.formGroupDocumentoLegal.patchValue(data);
            this.convertirPais(data.paisesBD);
            console.log(this.formGroupDocumentoLegal.getRawValue());
        }
        else {
            this.formGroupDocumentoLegal.reset();
        }
        this.modalRef = this.modalService.open(this.modalDocumentoLegal);
    };
    DocumentoLegalComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'El nombre del documento es necesario!',
                noStartSpace: 'El nombre del documento no puede empezar con espacio!',
                noEndSpace: 'El nombre del documento no puede terminar con espacio!'
            },
            descripcion: {
                required: 'La descripción del documento es necesario!',
                noStartSpace: 'La descripción del documento no puede empezar con espacio!',
                noEndSpace: 'La descripción del documento no puede terminar con espacio!'
            },
            paises: {
                required: 'Seleccione uno o más paises, es necesario!'
            },
            url: {
                required: 'La URL del documento es necesario!',
                noStartSpace: 'La URL del documento no puede empezar con espacio!',
                noEndSpace: 'La URL del documento no puede terminar con espacio!'
            },
            areas: {
                required: 'Seleccione uno o más áreas, es necesario!'
            },
            roles: {
                required: 'Seleccione uno o más roles, es necesario!'
            }
        };
        var formControl = this.formGroupDocumentoLegal.get(controlName);
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
    };
    DocumentoLegalComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formGroupDocumentoLegal.get(controlName);
        return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
    };
    DocumentoLegalComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formGroupDocumentoLegal.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    DocumentoLegalComponent.prototype.accionModal = function () {
        var accion = this.btnModalNombre;
        switch (accion) {
            case 'Nuevo':
                this.insertarDocumentoLegal();
                break;
            case 'Actualizar':
                console.log(this.formGroupDocumentoLegal.getRawValue());
                this.actualizarDocumentoLegal();
                break;
        }
    };
    DocumentoLegalComponent.prototype.filtroPais = function (data) {
        var _this = this;
        var paises = "";
        if (data) {
            data.forEach(function (e) {
                if ((/^-?\d+$/.test(e.idPais))) {
                    var pais = _this.listaPaises.find(function (a) { return a.id == e.idPais; });
                    paises = paises + pais.nombrePais + " - ";
                }
            });
            paises = paises.substring(0, paises.length - 2);
        }
        return paises;
    };
    DocumentoLegalComponent.prototype.obtenerListaDocumentoLegal = function () {
        var _this = this;
        this.listaDocumentoLegal = [];
        this.loader = true;
        this.integraService.obtenerTodo(constApi_1.constApi.DocumentoLegalObtener).subscribe({
            next: function (response) {
                console.log(response.body);
                _this.listaDocumentoLegal = response.body;
                _this.loader = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    DocumentoLegalComponent.prototype.mostrarMensajeError = function (error) {
        this.loader = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    DocumentoLegalComponent.prototype.convertirRolesGuardar = function (data) {
        var roles = "";
        data.forEach(function (e) {
            roles = roles + e + ",";
        });
        roles = roles.substring(0, roles.length - 1);
        return roles;
    };
    DocumentoLegalComponent.prototype.validFormDocumentoLegal = function () {
        if (this.formGroupDocumentoLegal.invalid) {
            this.formGroupDocumentoLegal.markAllAsTouched();
            return false;
        }
        return true;
    };
    DocumentoLegalComponent.prototype.procesarDataDocumentoLegal = function (item, isNew) {
        var rol = this.convertirRolesGuardar(item.roles);
        var DocumentoLegalEnvio = {
            id: isNew ? 0 : item.id,
            nombre: item.nombre,
            descripcion: item.descripcion,
            idPais: 51,
            pais: "",
            url: item.url,
            area: 0,
            areas: item.areas,
            paises: item.paises,
            roles: rol,
            visualizarAgenda: item.visualizarAgenda,
            descargarAgenda: item.descargarAgenda,
            usuario: "--",
            documentoByte: ""
        };
        return DocumentoLegalEnvio;
    };
    DocumentoLegalComponent.prototype.setDataDocumentoLegal = function (itemValue) {
        var paisesEnvio = [];
        itemValue.paises.forEach(function (e) {
            var paisBD = {
                id: 0,
                idDocumentoLegal: itemValue.id,
                idPais: e,
                usuarioCreacion: "",
                usuarioModificacion: "",
                fechaCreacion: "",
                fechaModificacion: ""
            };
            paisesEnvio.push(paisBD);
        });
        var DocumentoLegal;
        if (itemValue != null) {
            DocumentoLegal = {
                id: itemValue.id,
                nombre: itemValue.nombre,
                idPais: itemValue.idPais,
                pais: "",
                paises: "",
                area: 0,
                descripcion: itemValue.descripcion,
                url: itemValue.url,
                areas: itemValue.areas,
                paisesBD: paisesEnvio,
                roles: itemValue.roles,
                visualizarAgenda: itemValue.visualizarAgenda,
                descargarAgenda: itemValue.descargarAgenda,
                usuario: "--",
                documentoByte: ""
            };
        }
        ;
        return DocumentoLegal;
    };
    DocumentoLegalComponent.prototype.mostrarMensajeExitoso = function () {
        this.loader = false;
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            target: '#content-drawer-component',
            customClass: {
                container: 'position-absolute'
            },
            position: 'top-right',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: false,
            didOpen: function (toast) {
                toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
            }
        });
        Toast.fire({
            icon: 'success',
            title: 'Guardado con exito'
        });
    };
    DocumentoLegalComponent.prototype.msgEliminar = function (dataItem, index) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Está seguro de querer eliminar el Documento Legal?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Eliminalo!'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.eliminarDocumentoLegal(dataItem, index);
            }
        });
    };
    // ---------------------- Acciones CRUD Documento Legal ------------------------------------------------
    DocumentoLegalComponent.prototype.insertarDocumentoLegal = function () {
        var _this = this;
        if (this.validFormDocumentoLegal()) {
            this.loaderModal = true;
            var datosFormularioDocumentoLegal = this.formGroupDocumentoLegal.getRawValue();
            var DocumentoLegalEnvio_1;
            DocumentoLegalEnvio_1 = this.procesarDataDocumentoLegal(datosFormularioDocumentoLegal, true);
            var DocumentoLegal_1;
            DocumentoLegal_1 = this.setDataDocumentoLegal(DocumentoLegalEnvio_1);
            this.integraService
                .insertar(constApi_1.constApi.DocumentoLegalInsertar, DocumentoLegalEnvio_1)
                .subscribe({
                next: function (response) {
                    DocumentoLegal_1.id = response.body;
                    _this.listaDocumentoLegal.unshift(DocumentoLegal_1);
                    _this.loaderModal = true;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalService.dismissAll(_this.modalDocumentoLegal);
                    _this.mostrarMensajeExitoso();
                }
            });
        }
    };
    DocumentoLegalComponent.prototype.actualizarDocumentoLegal = function () {
        var _this = this;
        if (this.validFormDocumentoLegal()) {
            this.loaderModal = true;
            var datosFormDocumentoLegal = this.formGroupDocumentoLegal.getRawValue();
            var DocumentoLegalEnvio_2 = this.procesarDataDocumentoLegal(datosFormDocumentoLegal, false);
            var DocumentoLegal_2;
            DocumentoLegal_2 = this.setDataDocumentoLegal(DocumentoLegalEnvio_2);
            var index_1 = this.listaDocumentoLegal.findIndex(function (e) { return e.id === DocumentoLegal_2.id; });
            this.integraService
                .actualizar(constApi_1.constApi.DocumentoLegalActualizar, DocumentoLegalEnvio_2)
                .subscribe({
                next: function (response) {
                    _this.listaDocumentoLegal[index_1] = Object.assign(_this.tempDocumentoLegal, DocumentoLegal_2);
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalService.dismissAll(_this.modalDocumentoLegal);
                    _this.mostrarMensajeExitoso();
                }
            });
        }
    };
    DocumentoLegalComponent.prototype.eliminarDocumentoLegal = function (dataItem, index) {
        var _this = this;
        this.loader = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: '--' },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApi.DocumentoLegalEliminar, params)
            .subscribe({
            next: function (response) {
                if ((response.body == true)) {
                    _this.listaDocumentoLegal.splice(index, 1);
                    _this.loader = false;
                    sweetalert2_1["default"].fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                }
                else {
                    sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                }
            },
            error: function (error) {
                _this.loader = false;
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    // ------------------------ ----Control Grid ------------------------------------
    DocumentoLegalComponent.prototype.gridEventsResponse = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.nombreModal = 'Editar Documento Legal';
                this.btnModalNombre = 'Actualizar';
                this.openModalDocumentoLegal(false, e.dataItem);
                break;
            case 'remove':
                this.msgEliminar(e.dataItem, e.index);
                break;
            case 'add':
                this.tempDocumentoLegal = null;
                this.counter = 0 + "/" + this.maxlength;
                this.nombreModal = 'Nueva Documento Legal';
                this.btnModalNombre = 'Nuevo';
                this.openModalDocumentoLegal(true, e);
                break;
            case 'reload':
                this.obtenerListaDocumentoLegal();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalDocumentoLegal')
    ], DocumentoLegalComponent.prototype, "modalDocumentoLegal");
    DocumentoLegalComponent = __decorate([
        core_1.Component({
            selector: 'app-documento-legal',
            templateUrl: './documento-legal.component.html',
            styleUrls: ['./documento-legal.component.scss']
        })
    ], DocumentoLegalComponent);
    return DocumentoLegalComponent;
}());
exports.DocumentoLegalComponent = DocumentoLegalComponent;

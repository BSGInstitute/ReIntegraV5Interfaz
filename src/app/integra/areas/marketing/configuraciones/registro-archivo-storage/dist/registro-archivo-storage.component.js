"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RegistroArchivoStorageComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var text_validator_1 = require("@shared/validators/text.validator");
var grid_registro_archivo_storage_1 = require("./grid-registro-archivo-storage");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var RegistroArchivoStorageComponent = /** @class */ (function () {
    function RegistroArchivoStorageComponent(integraService, formBuilder, modalService, alertaService, formService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.formService = formService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.btnGuardarDisable = false;
        this.successIcon = iconInputValidation;
        this.formFiltroBusqueda = this.formBuilder.group({
            nombreArchivo: '',
            idContenedor: 0
        });
        this.formRegistroArchivoStorage = this.formBuilder.group({
            id: [0],
            idContenedor: [0],
            idSubContenedor: [0],
            tipoArchivo: [0],
            nombreArchivo: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ],
            archivos: [null, forms_1.Validators.required],
            archivoBol: null,
            archivoCol: null,
            archivoInt: null,
            archivoPeLima: null,
            archivoPeAqp: null
        });
        this.loaderModal = false;
        this.loaderGrid = false;
        this.isNew = false;
        this.listaRegistroArchivoStorage = [];
        this.registroArchivoCombos = {
            listadoContenedores: [],
            listadoSubContenedores: [],
            listadoTipoSubContenedores: []
        };
        this.aplicaSubcontenedor = false;
        this.aplicaSubidaMultiple = false;
        this.aplicaValidacion = false;
        this.listadoContenedores = [];
        this.listadoSubContenedores = [];
        this.listadoTipoSubContenedores = [];
        this.gridRegistroArchivoStorage = grid_registro_archivo_storage_1.gridRegistroArchivoStorage; //grilla
        this.myRestrictions = {
            allowedExtensions: ['.pdf', '.jpg', '.png', '.png']
        };
        this.idPersonal = '4264';
        this.idUrlBlockStorageFiltro = 2;
        this.nombreArchivoFiltro = '-9999';
        this.rutaArchivo = '';
        this.nombreArchivo = '';
        this.urlArchivo = 0;
    }
    RegistroArchivoStorageComponent.prototype.ngOnInit = function () {
        if (this.idPersonal == '213' ||
            this.idPersonal == '243' ||
            this.idPersonal == '68') {
            this.idPersonal = '2663';
        }
        this.obtenerTodoPorPermisosArchivoStorage(this.idPersonal, this.idUrlBlockStorageFiltro, this.nombreArchivoFiltro); //valores
        this.obtenerRegistroArchivoCombos(this.idPersonal);
    };
    RegistroArchivoStorageComponent.prototype.guardarRegistroArchivo = function () {
        var _this = this;
        console.log(this.formRegistroArchivoStorage.getRawValue());
        var archivoPrincipal = this.formRegistroArchivoStorage.get('archivos').value;
        if (!archivoPrincipal) {
            sweetalert2_1["default"].fire('Error!', 'Seleccione un archivo principal antes de agregar archivos específicos.', 'error');
            this.formRegistroArchivoStorage.get('archivos').setValue(null);
            return;
        }
        var contenedor = this.formRegistroArchivoStorage.get('idContenedor').value;
        this.btnGuardarDisable = true;
        var rutaCompleta = '';
        var rutaBlob = '';
        var formData = new FormData();
        console.log(this.formRegistroArchivoStorage.getRawValue());
        var dataFormulario = this.formRegistroArchivoStorage.getRawValue();
        this.integraService
            .obtenerPorPathParams(constApi_1.constApiMarketing.UrlSubContenedorObtenerRutaSubContenedor, [{ clave: 'idSubContenedor', valor: dataFormulario.idSubContenedor }])
            .subscribe({
            next: function (response) {
                console.log(response.body);
                rutaCompleta = response.body[0].rutaCompleta.replace(/%20/g, ' ');
                rutaBlob = response.body[0].rutaBlob.replace(/%20/g, ' ');
                // let rutaBanderaCompleta = 'https://repositorioweb.blob.core.windows.net/repositorioweb/flags/'
                // let rutaBanderaBlob = 'repositorioweb/flags/'
                // let rutaIconoCompleta = 'https://repositorioweb.blob.core.windows.net/repositorioweb/FlagIcons/'
                // let rutaIconoBlob = 'repositorioweb/FlagIcons/'
                var contenedorSeleccionado = _this.registroArchivoCombos.listadoContenedores.find(function (e) { return dataFormulario.idContenedor; });
                var tipoArchivoSeleccionado = _this.registroArchivoCombos.listadoTipoSubContenedores.find(function (e) { return dataFormulario.tipoArchivo; });
                if (contenedorSeleccionado.aplicaValidacion) {
                    rutaCompleta = rutaCompleta.concat(tipoArchivoSeleccionado.ruta);
                    rutaBlob = rutaBlob.concat(tipoArchivoSeleccionado.ruta);
                }
                if (dataFormulario.archivos != null &&
                    dataFormulario.archivos.length > 0)
                    formData.append('archivos', dataFormulario.archivos[0]);
                formData.append('idUrlSubContenedor', dataFormulario.idSubContenedor);
                formData.append('nombreArchivo', dataFormulario.nombreArchivo);
                formData.append('nombreUsuario', _this.usuario.userName);
                formData.append('rutaCompleta', rutaCompleta);
                formData.append('rutaBlob', rutaBlob);
                if (dataFormulario.archivoBol != null &&
                    dataFormulario.archivoBol.length > 0)
                    formData.append('archivoBol', dataFormulario.archivoBol[0]);
                if (dataFormulario.archivoCol != null &&
                    dataFormulario.archivoCol.length > 0)
                    formData.append('archivoCol', dataFormulario.archivoCol[0]);
                if (dataFormulario.archivoInt != null &&
                    dataFormulario.archivoInt.length > 0)
                    formData.append('archivoInt', dataFormulario.archivoInt[0]);
                if (dataFormulario.archivoPeLima != null &&
                    dataFormulario.archivoPeLima.length > 0)
                    formData.append('archivoPeLima', dataFormulario.archivoPeLima[0]);
                if (dataFormulario.archivoPeAqp != null &&
                    dataFormulario.archivoPeAqp.length > 0)
                    formData.append('archivoPeAqp', dataFormulario.archivoPeAqp[0]);
                // if (validator.validate()) {
                //   displayLoading($('#modalArchivoCreacion'));
                console.log('insertarFormData');
                _this.integraService
                    .insertarFormData(constApi_1.constApiMarketing.RegistroArchivoStorageRegistroArchivoStorageSubirArchivo, formData)
                    .subscribe({
                    next: function (resp) {
                        console.log(resp);
                        _this.modalRefRegistro.close();
                        _this.formFiltroBusqueda
                            .get('idContenedor')
                            .setValue(contenedor);
                        _this.formFiltroBusqueda.get('nombreArchivo').setValue('');
                        _this.obtenerTodoPorPermisosArchivoStorage(_this.idPersonal, contenedor, '-9999'); //valores
                        // hideLoading($('#modalArchivoCreacion'));
                        // NotificacionModule.showMensajeExitoso(
                        //   'Se subio exitosamente el archivo'
                        // );
                        // _recargarGridMain();
                        // _clearFieldsForm();
                    },
                    error: function (error) {
                        _this.alertaService.mensajeError(error);
                    },
                    complete: function () {
                        _this.mostrarMensajeExitoso();
                    }
                });
            }
        });
    };
    RegistroArchivoStorageComponent.prototype.mostrarMensajeExitoso = function () {
        this.loaderGrid = false;
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            target: '#content-drawer-component',
            customClass: {
                container: 'position-absolute'
            },
            position: 'top-right',
            showConfirmButton: false,
            timer: 1600,
            timerProgressBar: false,
            didOpen: function (toast) {
                toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
            }
        });
        Toast.fire({
            icon: 'success',
            title: 'Se Subio Exitosamenete'
        });
    };
    RegistroArchivoStorageComponent.prototype.cargarNombrearchivo = function (e) {
        // console.log(e.files[0].name)
        var maxFileSize = 15 * 1024 * 1024; // 15 MB en bytes
        var selectedFile = e.files[0];
        if (selectedFile && selectedFile.size > maxFileSize) {
            sweetalert2_1["default"].fire('Error!', 'El archivo excede el tamaño máximo permitido (15 MB).', 'error');
            this.formRegistroArchivoStorage.get('archivos').setValue(null);
        }
        else {
            this.formRegistroArchivoStorage.get('nombreArchivo').setValue(selectedFile ? selectedFile.name : '');
        }
        this.formRegistroArchivoStorage
            .get('nombreArchivo')
            .setValue(e.files[0].name);
    };
    RegistroArchivoStorageComponent.prototype.getErrorMessage = function (controlName) {
        this.formService.erroMsj = {
            nombreArchivo: {
                required: 'Ingrese un nombre al archivo',
                maxLength: 'El nombre del archivo debe ser menos de 60'
            },
            Archivos: {
                required: 'Seleccion un archivo'
            }
        };
        return this.formService.errorMessage(this.formRegistroArchivoStorage.get(controlName), controlName);
    };
    RegistroArchivoStorageComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formRegistroArchivoStorage.get(controlName);
        return (!this.getValidControl(controlName) &&
            formControl.value != null &&
            formControl.value != '');
    };
    RegistroArchivoStorageComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formRegistroArchivoStorage.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    RegistroArchivoStorageComponent.prototype.validFormRegistroArchivoStoragePermisos = function () {
        if (this.formRegistroArchivoStorage.invalid) {
            this.formRegistroArchivoStorage.markAllAsTouched();
            return false;
        }
        return true;
    };
    RegistroArchivoStorageComponent.prototype.obtenerRegistroArchivoCombos = function (idPersonal) {
        var _this = this;
        this.integraService
            .obtenerPorPathParams(constApi_1.constApiMarketing.RegistroArchivoStorageObtenerCombos, [{ clave: 'idPersonal', valor: idPersonal }])
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.registroArchivoCombos = response.body;
                if (_this.registroArchivoCombos.listadoContenedores.length > 0) {
                    _this.formFiltroBusqueda
                        .get('idContenedor')
                        .setValue(_this.registroArchivoCombos.listadoContenedores[0].idContenedor);
                    _this.formRegistroArchivoStorage
                        .get('idContenedor')
                        .setValue(_this.registroArchivoCombos.listadoContenedores[0].idContenedor);
                }
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    RegistroArchivoStorageComponent.prototype.obtenerTodoPorPermisosArchivoStorage = function (idPersonal, idUrlBlockStorage, nombreArchivo) {
        var _this = this;
        if (nombreArchivo == null || nombreArchivo.trim() == '') {
            nombreArchivo = '-9999';
        }
        this.loaderGrid = true;
        this.integraService
            .obtenerPorPathParams(constApi_1.constApiMarketing.RegistroArchivoStorageObtenerTodoPorPermisosRegistroArchivoStorage, [
            { clave: 'idPersonal', valor: idPersonal },
            { clave: 'idUrlBlockStorage', valor: idUrlBlockStorage },
            { clave: 'nombreArchivo', valor: nombreArchivo },
        ])
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.listaRegistroArchivoStorage = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
            },
            complete: function () { }
        });
    };
    RegistroArchivoStorageComponent.prototype.obtenerValidarTodoPorPermisosArchivoStorage = function (idPersonal, idUrlBlockStorage, nombreArchivo) {
        var _this = this;
        this.integraService
            .obtenerPorPathParams(constApi_1.constApiMarketing.RegistroArchivoStorageObtenerTodoPorPermisosRegistroArchivoStorage, [
            { clave: 'idPersonal', valor: idPersonal },
            { clave: 'idUrlBlockStorage', valor: idUrlBlockStorage },
            { clave: 'nombreArchivo', valor: nombreArchivo },
        ])
            .subscribe({
            next: function (response) {
                console.log(response.body);
                var respuesta = response.body;
                if (respuesta.length >= 1) {
                    _this.modalService.open(_this.modalValidacion, { size: 'lg' });
                    _this.urlArchivo = respuesta[0].ruta;
                }
                else {
                    sweetalert2_1["default"].fire({
                        title: 'No existe el archivo',
                        text: 'Se creará un nuevo archivo',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#0B5394',
                        allowOutsideClick: false
                    });
                }
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () {
            }
        });
    };
    RegistroArchivoStorageComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class='text-start'>" + error.error + "</p>\n          <p class='text-start text-danger fs-6'>" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    RegistroArchivoStorageComponent.prototype.changeValueContenedor = function (idContenedor) {
        this.listadoSubContenedores =
            this.registroArchivoCombos.listadoSubContenedores.filter(function (e) { return e.idContenedor == idContenedor; });
        var contenedorSeleccionado = this.registroArchivoCombos.listadoContenedores.find(function (e) { return e.idContenedor == idContenedor; });
        this.changeValueSubContenedor(this.listadoSubContenedores[0].idSubcontenedor);
        this.formRegistroArchivoStorage
            .get('idSubContenedor')
            .setValue(this.listadoSubContenedores[0].idSubcontenedor);
        if (contenedorSeleccionado &&
            contenedorSeleccionado.aplicaSubcontenedores == true) {
            this.aplicaSubcontenedor = true;
        }
        else {
            this.aplicaSubcontenedor = false;
            this.listadoSubContenedores = [];
        }
        if (contenedorSeleccionado &&
            contenedorSeleccionado.aplicaSubidaMultiple == true) {
            this.aplicaSubidaMultiple = true;
        }
        else {
            this.aplicaSubidaMultiple = false;
        }
        if (contenedorSeleccionado &&
            contenedorSeleccionado.aplicaValidacion == true) {
            this.aplicaValidacion = true;
        }
        else {
            this.aplicaValidacion = false;
            this.listadoTipoSubContenedores = [];
        }
    };
    RegistroArchivoStorageComponent.prototype.changeValueSubContenedor = function (idUrlSubContenedor) {
        this.listadoTipoSubContenedores =
            this.registroArchivoCombos.listadoTipoSubContenedores.filter(function (e) { return e.idUrlSubContenedor == idUrlSubContenedor; });
        this.formRegistroArchivoStorage
            .get('tipoArchivo')
            .setValue(this.listadoTipoSubContenedores[0].id);
    };
    RegistroArchivoStorageComponent.prototype.abrirModalRegistroArchivoStorage = function () {
        this.btnGuardarDisable = false;
        this.loaderModal = false;
        this.formRegistroArchivoStorage.reset();
        this.formRegistroArchivoStorage.get('idContenedor').setValue(2);
        this.changeValueContenedor(2);
        this.modalRefRegistro = this.modalService.open(this.modalRegistroArchivoStorage, { backdrop: 'static', size: 'lg' });
    };
    RegistroArchivoStorageComponent.prototype.verDetalleArchivo = function (e) {
        this.archivoModalTemp = e.dataItem;
        this.modalService.open(this.modaDetalleArchivo, { size: 'lg' });
    };
    RegistroArchivoStorageComponent.prototype.validarArchivo = function () {
        var dataFormulario = this.formRegistroArchivoStorage.getRawValue();
        this.nombreArchivo = dataFormulario.nombreArchivo;
        this.rutaArchivo = dataFormulario.idContenedor;
        console.log(this.nombreArchivo);
        if (this.nombreArchivo == '' || this.nombreArchivo == null) {
            sweetalert2_1["default"].fire('Error!', 'Elija un archivo.', 'warning');
        }
        else {
            this.obtenerValidarTodoPorPermisosArchivoStorage(this.idPersonal, this.rutaArchivo, this.nombreArchivo);
        }
    };
    RegistroArchivoStorageComponent.prototype.gridEventsArchivos = function (e) {
        console.log(e);
        switch (e.action) {
            case 'add':
                this.abrirModalRegistroArchivoStorage();
                break;
            case 'verDetalle':
                this.verDetalleArchivo(e);
                break;
            case 'reload':
                this.obtenerTodoPorPermisosArchivoStorage(4264, 2, '-9999');
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalRegistroArchivoStorage')
    ], RegistroArchivoStorageComponent.prototype, "modalRegistroArchivoStorage");
    __decorate([
        core_1.ViewChild('modaDetalleArchivo')
    ], RegistroArchivoStorageComponent.prototype, "modaDetalleArchivo");
    __decorate([
        core_1.ViewChild('modalValidacion')
    ], RegistroArchivoStorageComponent.prototype, "modalValidacion");
    RegistroArchivoStorageComponent = __decorate([
        core_1.Component({
            selector: 'app-registro-archivo-storage',
            templateUrl: './registro-archivo-storage.component.html',
            styleUrls: ['./registro-archivo-storage.component.scss']
        })
    ], RegistroArchivoStorageComponent);
    return RegistroArchivoStorageComponent;
}());
exports.RegistroArchivoStorageComponent = RegistroArchivoStorageComponent;

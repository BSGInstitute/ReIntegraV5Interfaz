"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreacionOportunidadMasivaComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var text_validator_1 = require("@shared/validators/text.validator");
var sweetalert2_1 = require("sweetalert2");
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var CreacionOportunidadMasivaComponent = /** @class */ (function () {
    function CreacionOportunidadMasivaComponent(integraService, formBuilder, modalService, alertaService, formService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.formService = formService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        this.formRegistroArchivoStorageOportunidad = this.formBuilder.group({
            archivos: [null, forms_1.Validators.required],
            nombreArchivo: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ]
        });
        this.loaderModal = false;
        this.loaderGrid = false;
        this.isNew = false;
        this.idPersonal = '4264';
        this.idUrlBlockStorageFiltro = 2;
        this.nombreArchivoFiltro = '-9999';
        this.rutaArchivo = '';
        this.nombreArchivo = '';
        this.urlArchivo = 0;
        this.isUploading = false;
    }
    CreacionOportunidadMasivaComponent.prototype.ngOnInit = function () {
        this.obtenerHistorialArchivos();
        this.obtenerOportunidadesGeneradas();
    };
    CreacionOportunidadMasivaComponent.prototype.subirArchivo = function () {
        var _this = this;
        this.isUploading = true;
        if (!this.formRegistroArchivoStorageOportunidad.valid) {
            sweetalert2_1["default"].fire('⚠️ Error', 'Seleccione un archivo antes de enviarlo.', 'error');
            return;
        }
        // Obtener el archivo seleccionado
        var archivoSeleccionado = this.formRegistroArchivoStorageOportunidad.get('archivos').value;
        if (!archivoSeleccionado) {
            sweetalert2_1["default"].fire('⚠️ Error', 'No se ha seleccionado un archivo válido.', 'error');
            this.isUploading = false;
            return;
        }
        var formData = new FormData();
        formData.append('archivo', archivoSeleccionado[0]);
        formData.append('nombreArchivo', archivoSeleccionado[0].name);
        formData.append('usuario', this.usuario.userName);
        // Enviar a la API
        this.integraService.insertarFormData(constApi_1.constApiMarketing.SubirArchivoOportunidadMasiva, formData)
            .subscribe({
            next: function (resp) {
                console.log('✅ Archivo subido correctamente:', resp);
                //Swal.fire('✅ Éxito', 'El archivo se ha subido correctamente.', 'success');
                _this.procesarOportunidadesMasivas(archivoSeleccionado[0]);
                // Desactivar loader al terminar
            },
            error: function (error) {
                console.error('❌ Error al subir archivo:', error);
                sweetalert2_1["default"].fire('❌ Error', 'Hubo un problema al subir el archivo.', 'error');
                _this.isUploading = false; // Desactivar loader al terminar
            }
        });
    };
    CreacionOportunidadMasivaComponent.prototype.cargarNombrearchivo2 = function (e) {
        var _this = this;
        var maxFileSize = 15 * 1024 * 1024;
        var allowedExtensions = ['xlsx', 'xls', 'csv'];
        var selectedFile = e.files[0];
        if (selectedFile) {
            var fileExtension = selectedFile.name.split('.').pop().toLowerCase();
            if (selectedFile.size > maxFileSize) {
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'El archivo excede el tamaño máximo permitido (15 MB).',
                    confirmButtonText: 'OK'
                }).then(function () {
                    _this.formRegistroArchivoStorageOportunidad.get('archivos').setValue(null);
                });
                return;
            }
            // Validar tipo de archivo
            if (!allowedExtensions.includes(fileExtension)) {
                sweetalert2_1["default"].fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Formato de archivo no permitido. Solo se aceptan archivos .xlsx, .xls y .csv',
                    confirmButtonText: 'OK'
                }).then(function () {
                    _this.formRegistroArchivoStorageOportunidad.get('archivos').setValue(null);
                });
                return;
            }
            this.formRegistroArchivoStorageOportunidad.get('nombreArchivo').setValue(selectedFile.name);
        }
    };
    CreacionOportunidadMasivaComponent.prototype.obtenerHistorialArchivos = function () {
        var _this = this;
        // this.loaderGrid = true;
        this.integraService.getJsonResponse("" + constApi_1.constApiMarketing.ObtenerArchivosOportunidad)
            .subscribe({
            next: function (response) {
                _this.listaHistorialArchivos = response.body;
                console.log('✅ Archivos obtenidos:', _this.listaHistorialArchivos);
                // this.loaderGrid = false;
            },
            error: function (error) {
                console.error('❌ Error al obtener archivos:', error);
                _this.loaderGrid = false;
            }
        });
    };
    CreacionOportunidadMasivaComponent.prototype.descargarArchivo = function (dataItem) {
        if (!dataItem || !dataItem.nombreArchivo) {
            sweetalert2_1["default"].fire('⚠️ Error', 'No se encontró el nombre del archivo.', 'error');
            return;
        }
        var jsonEnvio = { nombreArchivo: dataItem.nombreArchivo };
        console.log("Enviando JSON:", jsonEnvio);
        this.integraService.postJsonResponse(constApi_1.constApiMarketing.DescargarArchivoOportunidadMasiva, jsonEnvio).subscribe({
            next: function (response) {
                if (response.body && response.body.url) {
                    // Descargar el archivo
                    var link = document.createElement('a');
                    link.href = response.body.url;
                    link.setAttribute('download', dataItem.nombreArchivo);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                else {
                    sweetalert2_1["default"].fire('⚠️ Archivo no encontrado', 'El archivo no existe en el servidor.', 'warning');
                }
            },
            error: function (error) {
                console.error('🚨 Error al descargar archivo:', error);
                sweetalert2_1["default"].fire('❌ Error', 'No se pudo descargar el archivo.', 'error');
            }
        });
    };
    CreacionOportunidadMasivaComponent.prototype.procesarOportunidadesMasivas = function (file) {
        var _this = this;
        if (!file) {
            sweetalert2_1["default"].fire('⚠️ Error', 'No se ha seleccionado un archivo válido.', 'error');
            return;
        }
        var formData = new FormData();
        formData.append('file', file);
        formData.append('usuario', this.usuario.userName);
        // Enviar la solicitud al backend
        this.integraService.insertarFormData(constApi_1.constApiMarketing.ProcesarOportunidadedMasiva, formData)
            .subscribe({
            next: function (response) {
                console.log('✅ Oportunidades procesadas:', response.body);
                _this.listaOportunidadGenerada = response.body;
                sweetalert2_1["default"].fire('✅ Éxito', 'Las oportunidades se han procesado correctamente.', 'success');
                _this.formRegistroArchivoStorageOportunidad.get('archivos').setValue(null);
                _this.formRegistroArchivoStorageOportunidad.get('nombreArchivo').setValue('');
                _this.isUploading = false;
                _this.obtenerOportunidadesGeneradas();
                _this.obtenerHistorialArchivos();
            },
            error: function (error) {
                console.error('❌ Error al procesar oportunidades:', error);
                sweetalert2_1["default"].fire('❌ Error', 'Hubo un problema al procesar el archivo.', 'error');
                _this.isUploading = false;
            }
        });
    };
    CreacionOportunidadMasivaComponent.prototype.obtenerOportunidadesGeneradas = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService.getJsonResponse("" + constApi_1.constApiMarketing.ObtenerOportunidadesMasivas)
            .subscribe({
            next: function (response) {
                _this.listaOportunidadGenerada = response.body;
                console.log('✅ Oportunidades generadas:', _this.listaOportunidadGenerada);
                _this.loaderGrid = false;
            },
            error: function (error) {
                console.error('❌ Error al obtener oportunidades generadas:', error);
                _this.loaderGrid = false;
            }
        });
    };
    __decorate([
        core_1.ViewChild('modalRegistroArchivoStorage')
    ], CreacionOportunidadMasivaComponent.prototype, "modalRegistroArchivoStorage");
    __decorate([
        core_1.ViewChild('modaDetalleArchivo')
    ], CreacionOportunidadMasivaComponent.prototype, "modaDetalleArchivo");
    __decorate([
        core_1.ViewChild('modalValidacion')
    ], CreacionOportunidadMasivaComponent.prototype, "modalValidacion");
    __decorate([
        core_1.ViewChild('fileUpload')
    ], CreacionOportunidadMasivaComponent.prototype, "fileUpload");
    CreacionOportunidadMasivaComponent = __decorate([
        core_1.Component({
            selector: 'app-creacion-oportunidad-masiva',
            templateUrl: './creacion-oportunidad-masiva.component.html',
            styleUrls: ['./creacion-oportunidad-masiva.component.scss']
        })
    ], CreacionOportunidadMasivaComponent);
    return CreacionOportunidadMasivaComponent;
}());
exports.CreacionOportunidadMasivaComponent = CreacionOportunidadMasivaComponent;

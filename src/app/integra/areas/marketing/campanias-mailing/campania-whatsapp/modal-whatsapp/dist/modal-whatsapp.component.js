"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.ModalWhatsappComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var modal_prioridades_component_1 = require("./modal-prioridades/modal-prioridades.component");
var XLSX = require("xlsx");
var agregar_prioridad_component_1 = require("./agregar-prioridad/agregar-prioridad.component");
var agregar_prioridad_excel_component_1 = require("./agregar-prioridad-excel/agregar-prioridad-excel.component");
var modal_prioridad_excel_component_1 = require("./modal-prioridad-excel/modal-prioridad-excel.component");
var modal_configuracion_prioridad_component_1 = require("./modal-configuracion-prioridad/modal-configuracion-prioridad.component");
var ModalWhatsappComponent = /** @class */ (function () {
    function ModalWhatsappComponent(data, integraService, formBuilder, alertaService, dialog, dialogRef) {
        this.data = data;
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.dialog = dialog;
        this.dialogRef = dialogRef;
        this.nombrePrioridadExcel = '';
        this.listaPrioridades = [];
        this.prioridades = [];
        this.numeroPrioridadExcel = 0;
        this.nombrePrioridad = '';
        this.listaIds = [];
        this.reporte = [];
        this.sumaProgramados = 0;
        this.sumaEnviados = 0;
        this.sumaEntregados = 0;
        this.sumaLeidos = 0;
        this.sumaChatsV = 0;
        this.sumaChatsI = 0;
        this.sumaOportunidad = 0;
    }
    ModalWhatsappComponent.prototype.ngOnInit = function () {
        if (this.data != undefined || this.data != null) {
            this.loader = true;
            console.log(this.data);
            this.idCampania = this.data;
            this.ObtenerDetalle(this.data);
            this.ObtenerReporteInteraccionCampaniaGeneralDetalle(this.data);
            var _loop_1 = function (i) {
                var obj = {};
                obj.Id = i + 1;
                obj.Nombre = 'Prioridad ' + (i + 1);
                if (this_1.data[1] != undefined) {
                    existe = false;
                    this_1.data[1].forEach(function (p) {
                        if (p.prioridad == (i + 1)) {
                            existe = true;
                        }
                    });
                    if (existe == false) {
                        this_1.prioridades.push(obj);
                    }
                }
                else {
                    this_1.prioridades.push(obj);
                }
            };
            var this_1 = this, existe;
            for (var i = 0; i < 25; i++) {
                _loop_1(i);
            }
        }
        var date = new Date();
        var hours = this.formatNumber(date.getHours());
        var minutes = this.formatNumber(date.getMinutes());
        var seconds = this.formatNumber(date.getSeconds());
        // Establecer el valor predeterminado en la variable horaEnvio
        this.horaEnvio = hours + ":" + minutes + ":" + seconds;
    };
    ModalWhatsappComponent.prototype.formatNumber = function (num) {
        return num < 10 ? "0" + num : num.toString();
    };
    //------- Funciones --------------//
    ModalWhatsappComponent.prototype.Eliminar = function (id) {
        var _this = this;
        console.log(id);
        var jsonEnvio = {
            idCampaniaGeneralDetalleWhatsApp: id.idCampaniaGeneralDetalleWhatsApp,
            usuario: ''
        };
        this.alertaService.mensajeEliminar().then(function (result) {
            if (result.isConfirmed) {
                _this.integraService
                    .postJsonResponse(constApi_1.constApiMarketing.EliminarCampaniaGeneralDetalleWhatsApp, jsonEnvio)
                    .subscribe({
                    next: function (response) {
                        console.log(response);
                    },
                    error: function (error) {
                        _this.alertaService.mensajeError(error);
                        _this.ObtenerDetalle(_this.data);
                    },
                    complete: function () {
                        _this.ObtenerDetalle(_this.data);
                        sweetalert2_1["default"].fire('Success!', 'Registro eliminado', 'success');
                    }
                });
            }
        });
    };
    ModalWhatsappComponent.prototype.Modificar = function () {
        var _this = this;
        this.loader = true;
        var fecha = new Date(this.horaEnvio);
        console.log(this.horaEnvio);
        var fecha = new Date(this.fechaInicioEnvio);
        var year = fecha.getFullYear();
        var month = (fecha.getMonth() + 1).toString().padStart(2, '0');
        var day = fecha.getDate().toString().padStart(2, '0');
        var fechaFormateada = year + '-' + month + '-' + day;
        console.log(fechaFormateada);
        var jsonEnvio = {
            nombre: this.nombreCampania,
            horaEnvio: this.horaEnvio,
            fechaInicioEnvioWhatsapp: fechaFormateada,
            id: this.idCampaniaDetalle,
            usuario: ''
        };
        console.log(jsonEnvio);
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ActualizarCampaniaGeneralWhatsapp, jsonEnvio)
            .subscribe({
            next: function (response) {
                console.log(response.body);
            },
            error: function (error) {
                console.log(error.message);
                _this.alertaService.mensajeError(error);
                sweetalert2_1["default"].fire('Success!', 'Registro Actualizado', 'success');
                _this.loader = false;
            },
            complete: function () {
                sweetalert2_1["default"].fire('Success!', 'Registro Actualizado', 'success');
                _this.loader = false;
            }
        });
    };
    ModalWhatsappComponent.prototype.onFileInputClick = function () {
        if (this.fileInput) {
            this.fileInput.nativeElement.click();
        }
    };
    ModalWhatsappComponent.prototype.onFileChange = function (event) {
        this.selectedFile = event.target.files[0];
        if (this.selectedFile != undefined) {
            this.onSubmit();
        }
    };
    ModalWhatsappComponent.prototype.onSubmit = function () {
        var fileReader = new FileReader();
        fileReader.readAsBinaryString(this.selectedFile);
        fileReader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, { type: 'binary' });
            var worksheet = workbook.Sheets[workbook.SheetNames[0]];
            var jsonData = XLSX.utils.sheet_to_json(worksheet);
            var idAlumnos = jsonData.map(function (item) { return item.IdAlumno; });
            var idAlumnosString = idAlumnos.join(', ');
            console.log(idAlumnosString);
        };
    };
    //------------ Obtener Detalle -----------//
    ModalWhatsappComponent.prototype.ObtenerDetalle = function (data) {
        var _this = this;
        var jsonEnvio = {
            id: data
        };
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ObtenerCammpaniaGeneralDetalle, jsonEnvio)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.listaDetalle = response.body[0];
                _this.nombreCampania = _this.listaDetalle.nombreCampaniaGeneralWhatsApp;
                _this.fechaInicioEnvio = _this.listaDetalle.fechaInicioEnvioWhatsapp;
                _this.horaEnvio = _this.listaDetalle.horaEnvio;
                _this.idCampaniaDetalle = _this.listaDetalle.id;
                _this.listaPrioridades =
                    _this.listaDetalle.obtenerCampaniaGeneralDetallePrioridadWhatsApp;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    ModalWhatsappComponent.prototype.ObtenerReporteInteraccionCampaniaGeneralDetalle = function (data) {
        var _this = this;
        var jsonEnvio = {
            id: data
        };
        console.log(jsonEnvio);
        this.integraService
            .postJsonResponse(constApi_1.constApiMarketing.ReporteInteraccionCampaniaGeneralDetalle, jsonEnvio)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.reporte = response.body;
                _this.loader = false;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
                _this.loader = false;
            },
            complete: function () {
                _this.sumaProgramados = _this.reporte.reduce(function (total, item) { return total + item.programados; }, 0);
                _this.sumaEnviados = _this.reporte.reduce(function (total, item) { return total + item.enviados; }, 0);
                _this.sumaEntregados = _this.reporte.reduce(function (total, item) { return total + item.entregados; }, 0);
                _this.sumaLeidos = _this.reporte.reduce(function (total, item) { return total + item.leidos; }, 0);
                _this.sumaChatsV = _this.reporte.reduce(function (total, item) { return total + item.chatsValidos; }, 0);
                _this.sumaChatsI = _this.reporte.reduce(function (total, item) { return total + item.chatsInvalidos; }, 0);
                _this.sumaOportunidad = _this.reporte.reduce(function (total, item) { return total + item.oportunidadesCreadas; }, 0);
                console.log(_this.sumaProgramados);
            }
        });
    };
    //---------- Modales -----------------//
    ModalWhatsappComponent.prototype.abrirPrioridades = function () {
        var _this = this;
        var dialogRef = this.dialog.open(agregar_prioridad_component_1.AgregarPrioridadComponent, {
            width: '1400px',
            maxHeight: '90vh',
            panelClass: 'custom-dialog-container',
            data: this.idCampania
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.ObtenerDetalle(_this.idCampania);
            _this.ObtenerReporteInteraccionCampaniaGeneralDetalle(_this.idCampania);
        });
    };
    ModalWhatsappComponent.prototype.crearExcel = function () {
        var _this = this;
        var dialogRef = this.dialog.open(agregar_prioridad_excel_component_1.AgregarPrioridadExcelComponent, {
            width: '1400px',
            maxHeight: '90vh',
            panelClass: 'custom-dialog-container',
            data: this.idCampania
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.ObtenerDetalle(_this.idCampania);
            _this.ObtenerReporteInteraccionCampaniaGeneralDetalle(_this.idCampania);
        });
    };
    ModalWhatsappComponent.prototype.editar = function (data) {
        var _this = this;
        var nombre = data.nombreCampaniaOrigen.toLowerCase();
        if (nombre.includes('excel')) {
            var dialogRef = this.dialog.open(modal_prioridad_excel_component_1.ModalPrioridadExcelComponent, {
                width: '1400px',
                maxHeight: '90vh',
                panelClass: 'custom-dialog-container',
                data: data
            });
            dialogRef.afterClosed().subscribe(function (result) {
                _this.ObtenerDetalle(_this.idCampania);
                _this.ObtenerReporteInteraccionCampaniaGeneralDetalle(_this.idCampania);
            });
        }
        else {
            var dialogRef = this.dialog.open(modal_prioridades_component_1.ModalPrioridadesComponent, {
                width: '1400px',
                maxHeight: '90vh',
                panelClass: 'custom-dialog-container',
                data: data
            });
            dialogRef.afterClosed().subscribe(function (result) {
                _this.ObtenerDetalle(_this.idCampania);
                _this.ObtenerReporteInteraccionCampaniaGeneralDetalle(_this.idCampania);
            });
        }
    };
    ModalWhatsappComponent.prototype.Detalle = function (data) {
        var _this = this;
        var dialogRef = this.dialog.open(modal_configuracion_prioridad_component_1.ModalConfiguracionPrioridadComponent, {
            width: '1400px',
            maxHeight: '90vh',
            panelClass: 'custom-dialog-container',
            data: data
        });
        dialogRef.afterClosed().subscribe(function (result) {
            _this.ObtenerDetalle(_this.idCampania);
            _this.ObtenerReporteInteraccionCampaniaGeneralDetalle(_this.idCampania);
        });
    };
    //-------------- Aparte----------------//
    ModalWhatsappComponent.prototype.parseTime = function (timeString) {
        if (typeof timeString === 'string' && timeString.indexOf(':') !== -1) {
            var _a = timeString.split(':'), hours = _a[0], minutes = _a[1];
            var date = new Date();
            date.setHours(Number(hours));
            date.setMinutes(Number(minutes));
            date.setSeconds(0);
            return date;
        }
        return new Date();
    };
    ModalWhatsappComponent.prototype.toggleActivarMasivo = function (e, dataItem) {
        var _this = this;
        this.loader = true;
        console.log(dataItem);
        console.log(e);
        if (e == true) {
            var jsonEnvio = {
                idCampaniaGeneralDetalleWhatsApp: dataItem.idCampaniaGeneralDetalleWhatsApp,
                activarMasivo: true,
                usuario: ''
            };
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.ActualizarActivarMasivoPorCampania, jsonEnvio)
                .subscribe({
                next: function (response) {
                    console.log(response.body);
                },
                error: function (error) {
                    _this.alertaService.mensajeError(error);
                    _this.loader = false;
                },
                complete: function () {
                    _this.loader = false;
                }
            });
        }
        else {
            var jsonEnvio = {
                idCampaniaGeneralDetalleWhatsApp: dataItem.idCampaniaGeneralDetalleWhatsApp,
                activarMasivo: false,
                usuario: ''
            };
            this.integraService
                .postJsonResponse(constApi_1.constApiMarketing.ActualizarActivarMasivoPorCampania, jsonEnvio)
                .subscribe({
                next: function (response) {
                    console.log(response.body);
                },
                error: function (error) {
                    _this.alertaService.mensajeError(error);
                    _this.loader = false;
                },
                complete: function () {
                    sweetalert2_1["default"].fire('Succes!', 'Campaña actualizada', 'success');
                    _this.loader = false;
                }
            });
        }
    };
    ModalWhatsappComponent.prototype.getCellStyle = function (dataItem) {
        return dataItem.enviados > 0 ? 'borde-azul' : '';
    };
    ModalWhatsappComponent.prototype.getCellTitle = function (dataItem) {
        return dataItem.enviados > 0 ? 'Texto en azul' : '';
    };
    ModalWhatsappComponent.prototype.EjecutarCampania = function () {
        var _this = this;
        this.integraService
            .getJsonResponse(constApi_1.constApiMarketing.EjecutarCampaniaGeneralEnvioWhatsAppBoton)
            .subscribe({
            next: function (response) {
                console.log('Campaña iniciada:', response.body);
                sweetalert2_1["default"].fire('✅ ¡Éxito!', '🚀 Masivo en ejecución', 'success');
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            }
        });
    };
    __decorate([
        core_1.ViewChild('fileInput')
    ], ModalWhatsappComponent.prototype, "fileInput");
    ModalWhatsappComponent = __decorate([
        core_1.Component({
            selector: 'app-modal-whatsapp',
            templateUrl: './modal-whatsapp.component.html',
            styleUrls: ['./modal-whatsapp.component.scss'],
            encapsulation: core_1.ViewEncapsulation.None
        }),
        __param(0, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], ModalWhatsappComponent);
    return ModalWhatsappComponent;
}());
exports.ModalWhatsappComponent = ModalWhatsappComponent;

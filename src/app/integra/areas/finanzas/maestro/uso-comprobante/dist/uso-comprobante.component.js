"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UsoComprobanteComponent = void 0;
var core_1 = require("@angular/core");
var paginator_1 = require("@angular/material/paginator");
var sort_1 = require("@angular/material/sort");
var animations_1 = require("@angular/animations");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var UsoComprobanteComponent = /** @class */ (function () {
    function UsoComprobanteComponent(integraService, formBuilder, alertaService, cd, dialog) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.alertaService = alertaService;
        this.cd = cd;
        this.dialog = dialog;
        this.displayedColumns = ['codigo', 'descripcion', 'usuarioMod', 'fechaMod', 'acciones'];
        this.dataSource = [];
        this.showModal = false;
        this.nuevoCodigo = '';
        this.nuevaDescripcion = '';
        //usuario = 'pruebita';
        this.filtroCodigo = '';
        this.filtroDescripcion = '';
        this.filtroUsuario = '';
        this.filtroFecha = '';
        this.errorCodigo = '';
        this.errorDescripcion = '';
        this.modalVisible = false;
        this.animacionEstado = 'abierto';
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        this.esEditar = false;
        this.registroEditando = null;
        this.idRegistroEditando = null;
        this.loading = false;
        this.listaListaUsoComprobante = [];
    }
    UsoComprobanteComponent.prototype.ngOnInit = function () {
        this.ObtenerUsoComprobante();
    };
    UsoComprobanteComponent.prototype.ObtenerUsoComprobante = function () {
        var _this = this;
        this.loading = true;
        this.integraService
            .obtener(constApi_1.constApiFinanzas.ObtenerUsoComprobante)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.listaListaUsoComprobante = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
                _this.loading = false;
            },
            complete: function () {
                _this.loading = false;
            }
        });
    };
    UsoComprobanteComponent.prototype.abrirModal = function (esEdicion, data) {
        this.esEditar = esEdicion;
        this.modalVisible = true;
        this.animacionEstado = 'abierto';
        if (esEdicion && data) {
            this.registroEditando = data;
            this.nuevoCodigo = data.cfdiUse;
            this.nuevaDescripcion = data.descripcion;
            this.idRegistroEditando = data.id;
        }
        else {
            this.registroEditando = null;
            this.nuevoCodigo = '';
            this.nuevaDescripcion = '';
            this.idRegistroEditando = 0;
        }
    };
    UsoComprobanteComponent.prototype.cancelar = function () {
        this.animacionEstado = 'cerrando';
    };
    UsoComprobanteComponent.prototype.editar = function (row) {
        this.abrirModal(true, row);
    };
    UsoComprobanteComponent.prototype.cuandoTerminaAnimacion = function (event) {
        if (event.toState === 'cerrando') {
            this.modalVisible = false;
        }
    };
    UsoComprobanteComponent.prototype.validarFormulario = function () {
        this.errorCodigo = '';
        this.errorDescripcion = '';
        var esValido = true;
        if (!this.nuevoCodigo || this.nuevoCodigo.trim() === '') {
            this.errorCodigo = 'El campo Código es obligatorio';
            esValido = false;
        }
        if (!this.nuevaDescripcion || this.nuevaDescripcion.trim() === '') {
            this.errorDescripcion = 'El campo Descripción es obligatorio';
            esValido = false;
        }
        if (!esValido) {
            this.alertaService.mensajeError('⚠️ Debe completar todos los campos antes de continuar.');
        }
        this.cd.detectChanges();
        return esValido;
    };
    UsoComprobanteComponent.prototype.insertarUsoComprobante = function () {
        var _this = this;
        if (!this.validarFormulario())
            return;
        this.loading = true;
        var datos = {
            Clave: this.nuevoCodigo,
            Descripcion: this.nuevaDescripcion,
            UsuarioCreacion: this.usuario.userName
        };
        console.log('📤 Enviando JSON:', datos);
        this.integraService.postJsonResponse(constApi_1.constApiFinanzas.InsertarUsoComprobante, datos)
            .subscribe({
            next: function (resp) {
                if (resp.status === 200) {
                    _this.alertaService.mensajeExitoso('Registro insertado correctamente');
                    _this.ObtenerUsoComprobante();
                    _this.modalVisible = false;
                }
                else {
                    console.warn(' Respuesta inesperada:', resp.body);
                }
            },
            error: function (error) {
                console.error('❌ Error:', error);
                _this.alertaService.mensajeError('Error al insertar: ' + error.message);
            },
            complete: function () {
                _this.loading = false;
            }
        });
    };
    UsoComprobanteComponent.prototype.actualizarUsoComprobante = function () {
        var _this = this;
        this.loading = true;
        var datos = {
            Id: this.idRegistroEditando,
            Clave: this.nuevoCodigo,
            Descripcion: this.nuevaDescripcion,
            UsuarioModificacion: this.usuario.userName
        };
        console.log('📤 Enviando JSON para actualizar:', datos);
        this.integraService.postJsonResponse(constApi_1.constApiFinanzas.ActualizarUsoComprobante, datos)
            .subscribe({
            next: function (resp) {
                if (resp.status === 200) {
                    _this.alertaService.mensajeExitoso('Registro actualizado correctamente');
                    _this.ObtenerUsoComprobante();
                    _this.modalVisible = false;
                }
                else {
                    console.warn(' Respuesta inesperada:', resp.body);
                }
            },
            error: function (error) {
                console.error(' Error al actualizar:', error);
                _this.alertaService.mensajeError('Error al actualizar: ' + error.message);
            },
            complete: function () {
                _this.loading = false;
            }
        });
    };
    UsoComprobanteComponent.prototype.eliminarUsoComprobante = function (row) {
        var _this = this;
        this.loading = true;
        var datos = {
            Id: row.id,
            UsuarioModificacion: this.usuario.userName
        };
        sweetalert2_1["default"].fire({
            title: '¿Estás seguro?',
            text: 'Este registro será marcado como inactivo.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.loading = true;
                _this.integraService.postJsonResponse(constApi_1.constApiFinanzas.EliminarUsoComprobante, datos)
                    .subscribe({
                    next: function () {
                        _this.alertaService.mensajeExitoso('Registro eliminado correctamente');
                        _this.ObtenerUsoComprobante();
                    },
                    error: function (error) {
                        _this.alertaService.mensajeError('❌ Error al eliminar: ' + error.message);
                    },
                    complete: function () {
                        _this.loading = false;
                    }
                });
            }
        });
    };
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator)
    ], UsoComprobanteComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(sort_1.MatSort)
    ], UsoComprobanteComponent.prototype, "sort");
    UsoComprobanteComponent = __decorate([
        core_1.Component({
            selector: 'app-uso-comprobante',
            templateUrl: './uso-comprobante.component.html',
            styleUrls: ['./uso-comprobante.component.scss'],
            animations: [
                animations_1.trigger('modalAnimado', [
                    animations_1.transition('void => abierto', [
                        animations_1.style({ transform: 'translateY(-20%)', opacity: 0 }),
                        animations_1.animate('300ms ease-out', animations_1.style({ transform: 'translateY(0)', opacity: 1 }))
                    ]),
                    animations_1.transition('abierto => cerrando', [
                        animations_1.animate('200ms ease-in', animations_1.style({ transform: 'translateY(-10%)', opacity: 0 }))
                    ])
                ])
            ]
        })
    ], UsoComprobanteComponent);
    return UsoComprobanteComponent;
}());
exports.UsoComprobanteComponent = UsoComprobanteComponent;

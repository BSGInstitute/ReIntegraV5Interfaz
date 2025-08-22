"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AlertaService = void 0;
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var AlertaService = /** @class */ (function () {
    function AlertaService(notificationService, snackBar) {
        this.notificationService = notificationService;
        this.snackBar = snackBar;
    }
    AlertaService.prototype.mensajeEliminar = function () {
        return sweetalert2_1["default"].fire({
            title: '¿Está seguro de eliminar el registro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
        });
    };
    AlertaService.prototype.mensajeEliminarTemporal = function () {
        return sweetalert2_1["default"].fire({
            title: '¿Está seguro de eliminar el registro?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
        });
    };
    AlertaService.prototype.mensajeError = function (error) {
        return sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    AlertaService.prototype.mensajeExitosoWhatsapp = function (mensaje) {
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            target: '#content-drawer-message',
            // customClass: {
            //   container: 'swal2-container-integra',
            // },
            position: 'top-left',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: false,
            didOpen: function (toast) {
                toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
            }
        });
        return Toast.fire({
            icon: 'success',
            title: mensaje != null ? mensaje : 'Se envio el mensaje con exito'
        });
    };
    AlertaService.prototype.mensajeExitoso = function (mensaje) {
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            target: '#content-drawer-component',
            customClass: {
                container: 'swal2-container-integra'
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
        return Toast.fire({
            icon: 'success',
            title: mensaje != null ? mensaje : 'Guardado con exito'
        });
    };
    AlertaService.prototype.mensajeExitosoPrueba = function (mensaje) {
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            target: '#content-drawer-component',
            customClass: {
                container: 'swal2-container-integra'
            },
            position: 'top-right',
            showConfirmButton: false,
            timer: 80000,
            timerProgressBar: false,
            didOpen: function (toast) {
                toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
            }
        });
        return Toast.fire({
            icon: 'success',
            title: mensaje != null ? mensaje : 'Guardado con exito'
        });
    };
    AlertaService.prototype.mensajeCorreoExitoso = function () {
        return sweetalert2_1["default"].fire({
            title: 'Mensaje Enviado',
            icon: 'success',
            confirmButtonColor: '#4C5FC0',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false
        });
    };
    AlertaService.prototype.mensajeCorreoEnviado = function () {
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            target: '#content-drawer-component',
            customClass: {
                container: 'position-absolute'
            },
            position: 'top-right',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: false,
            didOpen: function (toast) {
                toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
            }
        });
        return Toast.fire({
            icon: 'success',
            title: 'Enviado con exito'
        });
    };
    AlertaService.prototype.mensajeWarning = function (text) {
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: function (toast) {
                toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
                toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
            }
        });
        Toast.fire({
            icon: 'warning',
            title: text
        });
    };
    AlertaService.prototype.customMensaje = function (options) {
        return sweetalert2_1["default"].fire(options);
    };
    AlertaService.prototype.swalFireOptions = function (options) {
        return sweetalert2_1["default"].fire(options);
    };
    AlertaService.prototype.swalFire = function (titulo, html, icon) {
        return sweetalert2_1["default"].fire(titulo, html, icon);
    };
    AlertaService.prototype.swal = function (titulo) {
        return sweetalert2_1["default"].fire(titulo);
    };
    AlertaService.prototype.mensajeIcon = function (title, html, icon) {
        return sweetalert2_1["default"].fire({
            title: title,
            text: html,
            icon: icon,
            allowOutsideClick: false
        });
    };
    AlertaService.prototype.notificationDefault = function (content, viewContainerRef) {
        this.notificationService.show({
            appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
            content: content,
            hideAfter: 2000,
            position: { horizontal: 'right', vertical: 'top' },
            animation: { type: 'fade', duration: 400 },
            type: { style: 'none', icon: false }
        });
    };
    AlertaService.prototype.notificationSuccess = function (content, viewContainerRef) {
        this.notificationService.show({
            appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
            content: content,
            hideAfter: 2000,
            closable: false,
            position: { horizontal: 'right', vertical: 'top' },
            animation: { type: 'fade', duration: 400 },
            type: { style: 'success', icon: true }
        });
    };
    AlertaService.prototype.notificationWarning = function (content, closable, viewContainerRef) {
        if (closable === void 0) { closable = false; }
        this.notificationService.show({
            appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
            content: content,
            hideAfter: 2000,
            closable: closable,
            position: { horizontal: 'right', vertical: 'bottom' },
            animation: { type: 'fade', duration: 400 },
            type: { style: 'warning', icon: true }
        });
    };
    AlertaService.prototype.notificationInfo = function (content, closable, viewContainerRef) {
        if (closable === void 0) { closable = false; }
        this.notificationService.show({
            appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
            content: content,
            hideAfter: 2000,
            closable: closable,
            position: { horizontal: 'right', vertical: 'bottom' },
            animation: { type: 'fade', duration: 400 },
            type: { style: 'info', icon: true }
        });
    };
    AlertaService.prototype.notificationError = function (content, horizontal, vertical, viewContainerRef) {
        if (horizontal === void 0) { horizontal = 'right'; }
        if (vertical === void 0) { vertical = 'bottom'; }
        console.log(content);
        console.log(viewContainerRef);
        console.log(this.contentDrawer);
        this.notificationService.show({
            appendTo: viewContainerRef ? viewContainerRef : this.contentDrawer,
            content: content,
            hideAfter: 2000,
            closable: false,
            cssClass: 'button-notification',
            position: { horizontal: horizontal, vertical: vertical },
            animation: { type: 'fade', duration: 400 },
            type: { style: 'error', icon: true }
        });
    };
    AlertaService.prototype.openSnackBarComponent = function (component, durationInSeconds) {
        this.snackBar.openFromComponent(component, {
            duration: durationInSeconds * 1000
        });
    };
    AlertaService.prototype.openSnackBar = function (message, action, config) {
        if (config != null) {
            this.snackBar.open(message, action, config);
        }
        else {
            this.snackBar.open(message, action, config);
        }
    };
    __decorate([
        core_1.ViewChild('contentDrawer', { read: core_1.ViewContainerRef })
    ], AlertaService.prototype, "contentDrawer");
    AlertaService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], AlertaService);
    return AlertaService;
}());
exports.AlertaService = AlertaService;

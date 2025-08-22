"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OrigenDatosComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var text_validator_1 = require("@shared/validators/text.validator");
var sweetalert2_1 = require("sweetalert2");
var grid_origen_datos_1 = require("./grid-origen-datos");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente de Origen Dato.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 27/08/2022 Creacion de interfaces de Grupos Origen Datos,
 * * 28/08/2022 Implementaccion de funciones logicas
 */
var OrigenDatosComponent = /** @class */ (function () {
    function OrigenDatosComponent(integraService, formBuilder, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        /**
         * Variables
         */
        this.successIcon = iconInputValidation;
        this.formOrigenDato = this.formBuilder.group({
            id: [0],
            nombre: ['', [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace
                ]
            ],
            descripcion: ['', forms_1.Validators.required],
            prioridad: ['', [forms_1.Validators.required, forms_1.Validators.min(1)]]
        });
        this.loaderGrid = false;
        this.loaderModal = false;
        this.isNew = false;
        this.listaOrigenDato = [];
        this.gridOrigenDato = new grid_origen_datos_1.GridOrigenDato();
    }
    /**
     * Acciones
     */
    OrigenDatosComponent.prototype.ngOnInit = function () {
        this.obtenerOrigenDato();
    };
    /**
     * @description Funciones de validacion
     * @autor Margiory Ramirez
     * @param {string} controlName
     */
    OrigenDatosComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formOrigenDato.get(controlName);
        return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
    };
    OrigenDatosComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formOrigenDato.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    /**
      * @description Funciones de validacion de Formulario para cada campo
      * @autor Margiory Ramirez
      * @param {string} controlName
      */
    OrigenDatosComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'Ingrese Nombre de Origen Tato',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            descripcion: { required: 'Ingrese una descripcion' },
            prioridad: { required: 'Prioridad es obligatorio', min: 'El Valor de Meta no es valido' }
        };
        var formControl = this.formOrigenDato.get(controlName);
        if (formControl.hasError('required')) {
            return erroMsj[controlName].required;
        }
        if (formControl.hasError('noStartSpace')) {
            return erroMsj[controlName].noStartSpace;
        }
        if (formControl.hasError('noEndSpace')) {
            return erroMsj[controlName].noEndSpace;
        }
        if (formControl.hasError('min')) {
            return erroMsj[controlName].min;
        }
        return null;
    };
    OrigenDatosComponent.prototype.validformOrigenDato = function () {
        if (this.formOrigenDato.invalid) {
            this.formOrigenDato.markAllAsTouched();
            return false;
        }
        return true;
    };
    /**
     * Crea un objeto de  envio Origen Dato
     * @autor Margiory Ramirez
     */
    OrigenDatosComponent.prototype.setDataOrigenDato = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.nombre = itemValue.nombre;
            item.descripcion = itemValue.descripcion;
            item.idTipodato = itemValue.idTipodato;
            item.prioridad = itemValue.prioridad;
            item.idCategoriaOrigen = itemValue.idCategoriaOrigen;
            item.estado = itemValue.estado;
            item.usuarioCreacion = itemValue.usuarioCreacion;
            item.usuarioModificacion = itemValue.usuarioModificacion;
            item.fechaModificacion = itemValue.fechaModificacion;
            item.fechaCreacion = itemValue.fechaCreacion;
        }
        return item;
    };
    OrigenDatosComponent.prototype.procesarDataOrigenDato = function (dataItem, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
        var fechaModificacion = fechaActual;
        var OrigenDatoEnvio = {
            id: isNew ? 0 : dataItem.id,
            nombre: dataItem.nombre,
            fechaCreacion: fechaCreacion,
            fechaModificacion: fechaModificacion,
            estado: true,
            usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
            usuarioModificacion: this.usuario.userName,
            descripcion: dataItem.descripcion,
            idTipodato: dataItem.idTipodato,
            idCategoriaOrigen: dataItem.idCategoriaOrigen,
            prioridad: dataItem.prioridad
        };
        return OrigenDatoEnvio;
    };
    /**
       * Obtiene data  Origen Dato Origen para el llenado de  grilla princial
       * @autor Margiory Ramirez
       */
    OrigenDatosComponent.prototype.obtenerOrigenDato = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.OrigenObtenerOrigen)
            .subscribe({
            next: function (response) {
                _this.listaOrigenDato = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
       * @description Creacion del objeto  origen dato
       * @autor Margiory Ramirez
       */
    OrigenDatosComponent.prototype.crearOrigenDato = function () {
        var _this = this;
        if (this.validformOrigenDato()) {
            this.loaderModal = true;
            var datosFormulario = this.formOrigenDato.getRawValue();
            var origenDato_1 = Object.assign({}, datosFormulario);
            var origenDatoEnvio = void 0;
            origenDatoEnvio = this.procesarDataOrigenDato(origenDato_1, true);
            this.integraService
                .insertar(constApi_1.constApiMarketing.OrigenIsertar, origenDatoEnvio)
                .subscribe({
                next: function (response) {
                    origenDato_1 = _this.setDataOrigenDato(origenDato_1, response.body);
                    _this.listaOrigenDato.unshift(origenDato_1);
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRefTCOrigen.close('submitted');
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formOrigenDato.markAllAsTouched();
    };
    /**
       * @description Actualiza el  objeto  de Origen Dato
       */
    OrigenDatosComponent.prototype.actualizarOrigenDato = function () {
        var _this = this;
        if (this.validformOrigenDato()) {
            ;
            this.loaderModal = true;
            var origenDato_2 = Object.assign(this.origenDatoTemp, this.formOrigenDato.getRawValue());
            var origenDatoEnvio = this.procesarDataOrigenDato(origenDato_2, false);
            this.integraService
                .actualizar(constApi_1.constApiMarketing.OrigenActualizar, origenDatoEnvio)
                .subscribe({
                next: function (response) {
                    _this.origenDatoTemp = _this.setDataOrigenDato(origenDato_2, response.body);
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalRefTCOrigen.close();
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formOrigenDato.markAllAsTouched();
    };
    /**
       * @description Elimina  el  objeto  de  Origen Dato  en la grilla principal por Id
       * @autor Margiory Ramirez
       */
    OrigenDatosComponent.prototype.eliminarOrigenDato = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.OrigenEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if ((response.body == true)) {
                    _this.listaOrigenDato.splice(index, 1);
                    // this.listaGruposCategoriaOrigen = this.listaGruposCategoriaOrigen.slice();
                    sweetalert2_1["default"].fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                }
                else {
                    sweetalert2_1["default"].fire('Error!', 'Ocurrio un problema al eliminar.', 'warning');
                }
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
     * Despliega de notificacion en validacion
     * @autor Margiory Ramirez
     */
    OrigenDatosComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    OrigenDatosComponent.prototype.mostrarMensajeExitoso = function () {
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
            title: 'Guardado con exito'
        });
    };
    OrigenDatosComponent.prototype.mostrarMensajeEliminar = function (param) {
        var _this = this;
        sweetalert2_1["default"].fire({
            title: '¿Está seguro de eliminar el registro?',
            text: '¡No podrás revertir esto!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4C5FC0',
            cancelButtonColor: '#d33',
            confirmButtonText: '¡Si, Eliminalo!',
            allowOutsideClick: false
        }).then(function (result) {
            if (result.isConfirmed) {
                _this.eliminarOrigenDato(param.dataItem, param.index);
            }
        });
    };
    OrigenDatosComponent.prototype.abrirModalOrigenDato = function (isNew, dataItem, index) {
        this.loaderModal = false;
        this.formOrigenDato.reset();
        this.isNew = isNew;
        if (dataItem != null) {
            this.origenDatoTemp = dataItem;
            this.formOrigenDato.patchValue(this.origenDatoTemp);
        }
        this.modalRefTCOrigen = this.modalService.open(this.modalOrigenDato);
    };
    OrigenDatosComponent.prototype.abrirModalVerDatos = function (data) {
        this.origenDatoTemp = data;
        this.modalService.open(this.modalVerOrigenDato);
    };
    /**
       * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
       * @autor Margiory Ramirez
       */
    OrigenDatosComponent.prototype.gridEventsOrigenDato = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.abrirModalOrigenDato(e.isNew, e.dataItem, e.index);
                break;
            case 'add':
                this.abrirModalOrigenDato(e.isNew, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e);
                break;
            case 'ver':
                this.abrirModalVerDatos(e.dataItem);
                break;
            case 'reload':
                this.obtenerOrigenDato();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalOrigenDato')
    ], OrigenDatosComponent.prototype, "modalOrigenDato");
    __decorate([
        core_1.ViewChild('modalVerOrigenDato')
    ], OrigenDatosComponent.prototype, "modalVerOrigenDato");
    OrigenDatosComponent = __decorate([
        core_1.Component({
            selector: 'app-origen-datos',
            templateUrl: './origen-datos.component.html',
            styleUrls: ['./origen-datos.component.scss']
        })
    ], OrigenDatosComponent);
    return OrigenDatosComponent;
}());
exports.OrigenDatosComponent = OrigenDatosComponent;

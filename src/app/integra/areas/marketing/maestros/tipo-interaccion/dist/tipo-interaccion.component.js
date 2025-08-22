"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TipoInteraccionComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var text_validator_1 = require("@shared/validators/text.validator");
var sweetalert2_1 = require("sweetalert2");
var grid_tipo_interaccion_1 = require("./grid-tipo-interaccion");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
* @module MarketingModule
* @description Componente de tipo Interaccion.
* @author Margiory Ramirez
* @version 1.0.1
* @history
* * 10/08/2022 Creacion de interfaces de Tipo Interaccion  ,
* * 11/08/2022 Implementaccion de funciones Logicas
*/
var TipoInteraccionComponent = /** @class */ (function () {
    function TipoInteraccionComponent(integraService, formBuilder, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.listaCanal = ['chat', 'correo', 'formulario', 'Interaccion', 'pagina'];
        //comboCanal:TipoInteraccion [] = [];
        this.successIcon = iconInputValidation;
        this.formTipoInteraccion = this.formBuilder.group({
            id: [0],
            nombre: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ],
            canal: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ]
        });
        this.loaderGrid = false;
        this.loaderModal = false;
        this.isNew = false;
        this.listaTipoInteraccion = [];
        this.gridTipoInteracccion = new grid_tipo_interaccion_1.GridTipoInteraccion();
    }
    /**
     * Acciones
     */
    TipoInteraccionComponent.prototype.ngOnInit = function () {
        this.obtenerTipoInteraccion();
    };
    /**
       * @description Funciones de validacion
       * @autor Margiory Ramirez
       * @param {string} controlName
       */
    TipoInteraccionComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formTipoInteraccion.get(controlName);
        return (!this.getValidControl(controlName) &&
            formControl.value != null &&
            formControl.value != '');
    };
    TipoInteraccionComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formTipoInteraccion.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    TipoInteraccionComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'Ingrese Nombre de Origen Tato',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            canal: {
                required: 'Ingrese Nombre de Origen Tato',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            }
        };
        var formControl = this.formTipoInteraccion.get(controlName);
        if (formControl.hasError('required')) {
            return erroMsj[controlName].required;
        }
        if (formControl.hasError('noStartSpace')) {
            return erroMsj[controlName].noStartSpace;
        }
        if (formControl.hasError('noEndSpace')) {
            return erroMsj[controlName].noEndSpace;
        }
        return null;
    };
    TipoInteraccionComponent.prototype.validformTipoInteraccion = function () {
        if (this.formTipoInteraccion.invalid) {
            this.formTipoInteraccion.markAllAsTouched();
            return false;
        }
        return true;
    };
    TipoInteraccionComponent.prototype.setDataTipoInteraccion = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.nombre = itemValue.nombre;
            item.canal = itemValue.canal;
            item.estado = itemValue.estado;
            item.usuarioCreacion = itemValue.usuarioCreacion;
            item.usuarioModificacion = itemValue.usuarioModificacion;
            item.fechaModificacion = itemValue.fechaModificacion;
            item.fechaCreacion = itemValue.fechaCreacion;
        }
        return item;
    };
    /**
     * Crea un objeto de envio de Tipo Interaccion
     * @param dataItem
     * @param isNew
     * @returns
     */
    TipoInteraccionComponent.prototype.procesarDataTipoInteraccion = function (dataItem, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacion = isNew
            ? fechaActual
            : pipe.transform(dataItem.fechaCreacion, formatoFecha);
        var fechaModificacion = fechaActual;
        var tipoInteraccionEnvio = {
            id: isNew ? 0 : dataItem.id,
            nombre: dataItem.nombre,
            fechaCreacion: fechaCreacion,
            fechaModificacion: fechaModificacion,
            estado: true,
            canal: dataItem.canal,
            usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
            usuarioModificacion: this.usuario.userName
        };
        return tipoInteraccionEnvio;
    };
    TipoInteraccionComponent.prototype.obtenerTipoInteraccion = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.TipoInteraccionObtenerTipoInteraccion)
            .subscribe({
            next: function (response) {
                _this.listaTipoInteraccion = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    TipoInteraccionComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    /**
     * Inserta  data de tipo ieteraccion
     */
    TipoInteraccionComponent.prototype.crearTipoInteraccion = function () {
        var _this = this;
        if (this.validformTipoInteraccion()) {
            this.loaderModal = true;
            var datosFormulario = this.formTipoInteraccion.getRawValue();
            var tipoCaInteraccion_1 = Object.assign({}, datosFormulario);
            var tipoInteraccionEnvio = void 0;
            tipoInteraccionEnvio = this.procesarDataTipoInteraccion(tipoCaInteraccion_1, true);
            this.integraService
                .insertar(constApi_1.constApiMarketing.TipoInteraccionInsertar, tipoInteraccionEnvio)
                .subscribe({
                next: function (response) {
                    tipoCaInteraccion_1 = _this.setDataTipoInteraccion(tipoCaInteraccion_1, response.body);
                    _this.listaTipoInteraccion.unshift(tipoCaInteraccion_1);
                    // this.listaGruposCategoriaOrigen = this.listaGruposCategoriaOrigen.slice();
                    // this.listaGruposCategoriaOrigen.push(response.body); //insetar
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRefTTipoInteraccion.close('submitted');
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formTipoInteraccion.markAllAsTouched();
    };
    /**
       * @description Actualiza el  objeto  de  tipo Interaccion
       * @autor Margiory Ramirez
       */
    TipoInteraccionComponent.prototype.actualizarTipoInteraccion = function () {
        var _this = this;
        if (this.validformTipoInteraccion()) {
            this.loaderModal = true;
            var tipoInteraccion_1 = Object.assign(this.tipoInteracciontemp, this.formTipoInteraccion.getRawValue());
            var tipoInteraccionEnvio = this.procesarDataTipoInteraccion(tipoInteraccion_1, false);
            this.integraService
                .actualizar(constApi_1.constApiMarketing.TipoInteraccionActualizar, tipoInteraccionEnvio)
                .subscribe({
                next: function (response) {
                    _this.tipoInteracciontemp = _this.setDataTipoInteraccion(tipoInteraccion_1, response.body);
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalRefTTipoInteraccion.close();
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formTipoInteraccion.markAllAsTouched();
    };
    /**
     * @description Elimina data inersertada
     * @param dataItem
     * @param index
     * @autor Margiory Ramirez
     */
    TipoInteraccionComponent.prototype.eliminarTipoInteraccion = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.TipoInteraccionEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if (response.body == true) {
                    _this.listaTipoInteraccion.splice(index, 1);
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
    TipoInteraccionComponent.prototype.mostrarMensajeExitoso = function () {
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
    TipoInteraccionComponent.prototype.mostrarMensajeEliminar = function (param) {
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
                _this.eliminarTipoInteraccion(param.dataItem, param.index);
            }
        });
    };
    TipoInteraccionComponent.prototype.abrirModalTipoInteracciones = function (isNew, dataItem, index) {
        this.loaderModal = false;
        this.formTipoInteraccion.reset();
        this.isNew = isNew;
        if (dataItem != null) {
            this.tipoInteracciontemp = dataItem;
            this.formTipoInteraccion.patchValue(this.tipoInteracciontemp);
        }
        this.modalRefTTipoInteraccion = this.modalService.open(this.modalTipoInteraccion);
    };
    TipoInteraccionComponent.prototype.obtnerCanal = function () {
        this.listaTipoInteraccion;
    };
    /**
     * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
     * @autor Margiory Ramirez
     */
    TipoInteraccionComponent.prototype.gridEventsTipoInteraccion = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.abrirModalTipoInteracciones(e.isNew, e.dataItem, e.index);
                break;
            case 'add':
                this.abrirModalTipoInteracciones(e.isNew, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e);
                break;
            case 'reload':
                this.obtenerTipoInteraccion();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalTipoInteraccion')
    ], TipoInteraccionComponent.prototype, "modalTipoInteraccion");
    TipoInteraccionComponent = __decorate([
        core_1.Component({
            selector: 'app-tipo-interaccion',
            templateUrl: './tipo-interaccion.component.html',
            styleUrls: ['./tipo-interaccion.component.scss']
        })
    ], TipoInteraccionComponent);
    return TipoInteraccionComponent;
}());
exports.TipoInteraccionComponent = TipoInteraccionComponent;

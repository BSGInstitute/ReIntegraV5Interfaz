"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TipoDatoComponent = void 0;
var core_1 = require("@angular/core");
var grid_tipo_dato_1 = require("./grid-tipo-dato");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var text_validator_1 = require("@shared/validators/text.validator");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente tipo Dato, modulo maestro.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 01/09/2022 Implementacion de interfaz
 * * 02/09/2022 Creacion de funciones Logicas
 */
var TipoDatoComponent = /** @class */ (function () {
    function TipoDatoComponent(integraService, formBuilder, modalService) {
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
        this.formTipoDato = this.formBuilder.group({
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
        this.listaTipoDato = [];
        this.gridTipoDato = new grid_tipo_dato_1.GridTipoDato();
    }
    TipoDatoComponent.prototype.ngOnInit = function () {
        this.obtenerTipoDato();
    };
    /**
     *
     * @param controlName
     * @returns
     */
    TipoDatoComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formTipoDato.get(controlName);
        return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
    };
    TipoDatoComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formTipoDato.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    TipoDatoComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'Ingrese Nombre de Tipo Dato',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            descripcion: { required: 'Ingrese una descripcion' },
            prioridad: { required: 'Prioridad es obligatorio', min: 'El Valor de Prioridad no es valido' }
        };
        var formControl = this.formTipoDato.get(controlName);
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
    TipoDatoComponent.prototype.validFormTipoDato = function () {
        if (this.formTipoDato.invalid) {
            this.formTipoDato.markAllAsTouched();
            return false;
        }
        return true;
    };
    /**
     *
     * @param item
     * @param itemValue
     * @returns
     */
    TipoDatoComponent.prototype.setDataTipoData = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.nombre = itemValue.nombre;
            item.descripcion = itemValue.descripcion;
            item.prioridad = itemValue.prioridad;
            item.estado = itemValue.estado;
            item.usuarioCreacion = itemValue.usuarioCreacion;
            item.usuarioModificacion = itemValue.usuarioModificacion;
            item.fechaCreacion = itemValue.fechaCreacion;
            item.fechaModificacion = itemValue.fechaModificacion;
        }
        return item;
    };
    TipoDatoComponent.prototype.procesarDataTipoDato = function (dataItem, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
        var fechaModificacion = fechaActual;
        var tipoDatoEnvio = {
            id: isNew ? 0 : dataItem.id,
            nombre: dataItem.nombre,
            descripcion: dataItem.descripcion,
            prioridad: dataItem.prioridad,
            fechaCreacion: fechaCreacion,
            fechaModificacion: fechaModificacion,
            estado: true,
            usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
            usuarioModificacion: this.usuario.userName
        };
        return tipoDatoEnvio;
    };
    /**
     * Obtiene  data principal para el llenado  de griila
     * @autor Margiory Ramirez
     */
    TipoDatoComponent.prototype.obtenerTipoDato = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.TipoDatoObtenerTipoDato)
            .subscribe({
            next: function (response) {
                _this.listaTipoDato = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
     * @description Creacion del objeto Tipo Dato
     * @autor Margiory Ramirez
     */
    TipoDatoComponent.prototype.crearTipoDato = function () {
        var _this = this;
        if (this.validFormTipoDato()) {
            // this.modalRefTCOrigen.close('submitted');
            this.loaderModal = true;
            var datosFormulario = this.formTipoDato.getRawValue();
            var tipoDato_1 = Object.assign({}, datosFormulario);
            var tipoDatoEnvio = void 0;
            tipoDatoEnvio = this.procesarDataTipoDato(tipoDato_1, true);
            this.integraService
                .insertar(constApi_1.constApiMarketing.TipoDatoInsertarTipoDato, tipoDatoEnvio)
                .subscribe({
                next: function (response) {
                    tipoDato_1 = _this.setDataTipoData(tipoDato_1, response.body);
                    _this.listaTipoDato.unshift(tipoDato_1);
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRefTipoDato.close('submitted');
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formTipoDato.markAllAsTouched();
    };
    /**
       * @description Actualiza el  objeto  de Tipo Dato
       * @autor Margiory Ramirez
       */
    TipoDatoComponent.prototype.actualizarTipoDato = function () {
        var _this = this;
        if (this.validFormTipoDato()) {
            ;
            this.loaderModal = true;
            var tipoDato_2 = Object.assign(this.tipoDatoTemp, this.formTipoDato.getRawValue());
            var tipoDatoEnvio = this.procesarDataTipoDato(tipoDato_2, false);
            this.integraService
                .actualizar(constApi_1.constApiMarketing.TipoDatoActualizarTipoDato, tipoDatoEnvio)
                .subscribe({
                next: function (response) {
                    // this.listaGruposCategoriaOrigen.splice(index, 1);
                    _this.tipoDatoTemp = _this.setDataTipoData(tipoDato_2, response.body);
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalRefTipoDato.close();
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formTipoDato.markAllAsTouched();
    };
    /**
     * @description Elimina  el  objeto  de tipo Dato  en la grilla principal por Id
     * @autor Margiory Ramirez
     */
    TipoDatoComponent.prototype.eliminarTipoDato = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.TipoDatoEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if ((response.body == true)) {
                    _this.listaTipoDato.splice(index, 1);
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
    TipoDatoComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    TipoDatoComponent.prototype.mostrarMensajeExitoso = function () {
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
    TipoDatoComponent.prototype.mostrarMensajeEliminar = function (param) {
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
                _this.eliminarTipoDato(param.dataItem, param.index);
            }
        });
    };
    /**
       * Despliega modal para registro de datos
       * @autor Margiory Ramirez
       */
    TipoDatoComponent.prototype.abrirModalTipoDato = function (isNew, dataItem, index) {
        this.loaderModal = false;
        this.formTipoDato.reset();
        this.isNew = isNew;
        if (dataItem != null) {
            this.tipoDatoTemp = dataItem;
            this.formTipoDato.patchValue(this.tipoDatoTemp);
        }
        this.modalRefTipoDato = this.modalService.open(this.modalTipoDato);
    };
    /**
    * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
    * @autor Margiory Ramirez
    */
    TipoDatoComponent.prototype.gridEventsTipoDato = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.abrirModalTipoDato(e.isNew, e.dataItem, e.index);
                break;
            case 'add':
                this.abrirModalTipoDato(e.isNew, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e);
                break;
            case 'reload':
                this.obtenerTipoDato();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalTipoDato')
    ], TipoDatoComponent.prototype, "modalTipoDato");
    TipoDatoComponent = __decorate([
        core_1.Component({
            selector: 'app-tipo-dato',
            templateUrl: './tipo-dato.component.html',
            styleUrls: ['./tipo-dato.component.scss']
        })
    ], TipoDatoComponent);
    return TipoDatoComponent;
}());
exports.TipoDatoComponent = TipoDatoComponent;

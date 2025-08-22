"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FormularioRespuestaComponent = void 0;
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var text_validator_1 = require("@shared/validators/text.validator");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var grid_formulario_respuesta_1 = require("./grid-formulario-respuesta");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente de Formulario Respuesta modulo maestro
 * @author Margiory Ramirez Neyra
 * @version 1.0.1
 * @history
 * * 06/08/2022 Implementacion de creacion de Formulario Respuesta
 * * 06/08/2022 Creacion de interfaces de Formulario Respuesta
 */
var FormularioRespuestaComponent = /** @class */ (function () {
    function FormularioRespuestaComponent(integraService, formBuilder, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        /**
         * Variables
         * @autor Margiory Ramirez Neyra
         */
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.successIcon = iconInputValidation;
        this.formFormularioRespuesta = this.formBuilder.group({
            id: [0],
            nombre: ['', [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace
                ]
            ],
            codigo: ['', forms_1.Validators.required],
            idPgeneral: []
        });
        this.loaderGrid = false;
        this.loaderModal = false;
        this.isNew = false;
        this.listaFormularioRespuesta = [];
        this.gridFormularioRespuesta = new grid_formulario_respuesta_1.GridFormularioRespuesta();
        this.filtroFormularioRespuesta = {
            filtroProgramGeneral: []
        };
    }
    FormularioRespuestaComponent.prototype.ngOnInit = function () {
        this.ObtenerFormularioRespuesta();
        this.ObtenerProgramaGenereal();
    };
    /**
      * @description validaciones de usuario  para funciones principales.
      * @autor Margiory Ramirez
      * @param {boolean} controlName
      */
    FormularioRespuestaComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formFormularioRespuesta.get(controlName);
        return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
    };
    FormularioRespuestaComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formFormularioRespuesta.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    FormularioRespuestaComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'Ingrese Nombre de Formulario Respuesta',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            codigo: { required: 'Ingrese Codigo Formulario Respuesta' },
            idPgeneral: { required: 'Programa genral es Requerido' }
        };
        var formControl = this.formFormularioRespuesta.get(controlName);
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
    FormularioRespuestaComponent.prototype.validFormFormularioTextoBoton = function () {
        if (this.formFormularioRespuesta.invalid) {
            this.formFormularioRespuesta.markAllAsTouched();
            return false;
        }
        return true;
    };
    /**
     * Envia la data para  el Formulario Respueta
     * @autor Margiory Ramirez Neyra
     */
    FormularioRespuestaComponent.prototype.setDataFormularioRespuesta = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.idPgeneral = itemValue.idPgeneral;
            item.nombre = itemValue.nombre;
            item.programaGeneral = itemValue.programaGeneral;
            item.codigo = itemValue.codigo;
        }
        return item;
    };
    FormularioRespuestaComponent.prototype.procesarDataFormularioRespuesta = function (dataItem, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaModificacion = fechaActual;
        var programa = this.filtro.filter(function (e) { return e.idPgeneral == dataItem.idPgeneral; });
        console.log(programa);
        var formularioRespuestaEnvio = {
            id: isNew ? 0 : dataItem.id,
            idPgeneral: dataItem.idPgeneral,
            nombre: dataItem.nombre,
            codigo: dataItem.codigo,
            programaGeneral: programa[0].nombre,
            fechaModificacion: fechaModificacion,
            usuarioModificacion: this.usuario.userName
        };
        return formularioRespuestaEnvio;
    };
    /**
      * Obtiene la Data para llenado de grilla principal
      * @autor Margiory Ramirez
      */
    FormularioRespuestaComponent.prototype.ObtenerFormularioRespuesta = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.FormularioRespuestaObtenerFormularioRespueta)
            .subscribe({
            next: function (response) {
                _this.listaFormularioRespuesta = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
     * Obtiene la Data de Programa General
     * @autor Margiory Ramirez
     */
    FormularioRespuestaComponent.prototype.ObtenerProgramaGenereal = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.FormularioRespuestaObtenerComboDato)
            .subscribe({
            next: function (response) {
                _this.filtro = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
    * @description Creacion del objeto formulario respueta
    * @autor Margiory Ramirez
    */
    FormularioRespuestaComponent.prototype.crearFormularioRespuesta = function () {
        var _this = this;
        if (this.validFormFormularioTextoBoton()) {
            // this.modalRefTCOrigen.close('submitted');
            this.loaderModal = true;
            var datosFormulario = this.formFormularioRespuesta.getRawValue();
            var formularioRespuesta_1 = Object.assign({}, datosFormulario);
            var formularioRespuestaEnvio = void 0;
            formularioRespuestaEnvio = this.procesarDataFormularioRespuesta(datosFormulario, true);
            console.log(formularioRespuestaEnvio);
            this.integraService
                .insertar(constApi_1.constApiMarketing.FormularioRespuestaInsertar, formularioRespuestaEnvio)
                .subscribe({
                next: function (response) {
                    formularioRespuesta_1 = _this.setDataFormularioRespuesta(formularioRespuesta_1, response.body);
                    _this.listaFormularioRespuesta.unshift(formularioRespuesta_1);
                    // this.listaGruposCategoriaOrigen = this.listaGruposCategoriaOrigen.slice();
                    // this.listaGruposCategoriaOrigen.push(response.body); //insetar
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRefFormularioRespuesta.close('submitted');
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formFormularioRespuesta.markAllAsTouched();
    };
    /**
      * @description Actuliza del objeto formulario respueta
      * @autor Margiory Ramirez
      */
    FormularioRespuestaComponent.prototype.actualizarFormularioRespuesta = function () {
        var _this = this;
        if (this.validFormFormularioTextoBoton()) {
            ;
            this.loaderModal = true;
            var formularioRespuesta_2 = Object.assign(this.formularioRespuestaTemp, this.formFormularioRespuesta.getRawValue());
            var FormularioRespuestaEnvio_1 = this.procesarDataFormularioRespuesta(formularioRespuesta_2, false);
            this.integraService
                .actualizar(constApi_1.constApiMarketing.FormularioRespuestaActualizar, FormularioRespuestaEnvio_1)
                .subscribe({
                next: function (response) {
                    _this.formularioRespuestaTemp = _this.setDataFormularioRespuesta(formularioRespuesta_2, response.body);
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalRefFormularioRespuesta.close();
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formFormularioRespuesta.markAllAsTouched();
    };
    /**
     * Proceso ejecutado al finalizar  el guardo de Datos Formulario Respuesta.
     * @autor Margiory Ramirez
     */
    FormularioRespuestaComponent.prototype.mostrarMensajeExitoso = function () {
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
    FormularioRespuestaComponent.prototype.mostrarMensajeError = function (error) {
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n      <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    /**
     *  Elimina y Limpia valores del formulario Respuesta
     * @autor Margiory Ramirez
     */
    FormularioRespuestaComponent.prototype.eliminarFormularioRespuesta = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.FormularioRespuestaEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if ((response.body == true)) {
                    _this.listaFormularioRespuesta.splice(index, 1);
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
      * Despliega de notificacion en validacion(eliminado)
      * @autor Margiory Ramirez
      */
    FormularioRespuestaComponent.prototype.mostrarMensajeEliminar = function (param) {
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
                _this.eliminarFormularioRespuesta(param.dataItem, param.index);
            }
        });
    };
    /**
      * Carga los datos iniciales al abri el formulario respuesta
      * @autor Margiory Ramirez
      */
    FormularioRespuestaComponent.prototype.abrirModalFormularioRespuesta = function (isNew, dataItem, index) {
        this.loaderModal = false;
        this.formFormularioRespuesta.reset();
        this.isNew = isNew;
        if (dataItem != null) {
            this.formularioRespuestaTemp = dataItem;
            this.formFormularioRespuesta.patchValue(this.formularioRespuestaTemp);
        }
        this.modalRefFormularioRespuesta = this.modalService.open(this.modalFormularioRespuesta);
    };
    /**
    * Eventos Grid  editar , anadir,eliminar, refrescar
    * @autor Margiory Ramirez
    */
    FormularioRespuestaComponent.prototype.gridEventsFormularioRespuesta = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.abrirModalFormularioRespuesta(e.isNew, e.dataItem, e.index);
                break;
            case 'add':
                this.abrirModalFormularioRespuesta(e.isNew, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e);
                break;
            case 'reload':
                this.ObtenerFormularioRespuesta();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalFormularioRespuesta')
    ], FormularioRespuestaComponent.prototype, "modalFormularioRespuesta");
    FormularioRespuestaComponent = __decorate([
        core_1.Component({
            selector: 'app-formulario-respuesta',
            templateUrl: './formulario-respuesta.component.html',
            styleUrls: ['./formulario-respuesta.component.scss']
        })
    ], FormularioRespuestaComponent);
    return FormularioRespuestaComponent;
}());
exports.FormularioRespuestaComponent = FormularioRespuestaComponent;

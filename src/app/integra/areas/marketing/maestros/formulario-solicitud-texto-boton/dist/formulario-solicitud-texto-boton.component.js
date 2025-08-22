"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FormularioSolicitudTextoBotonComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var text_validator_1 = require("@shared/validators/text.validator");
var sweetalert2_1 = require("sweetalert2");
var grid_formulario_solicitud_texto_boton_1 = require("./grid-formulario-solicitud-texto-boton");
/**
 * @module MarketingModule
 * @description Componente de Modulo Maestro ,Creacion de Categoria Origen
 * @author Margiory Ramirez Neyra
 * @version 1.0.1
 * @history
 * * 07/08/2022 Creacion de interfaces formulario Texto Boton, implementacion nuevos registros
 */
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var FormularioSolicitudTextoBotonComponent = /** @class */ (function () {
    function FormularioSolicitudTextoBotonComponent(integraService, formBuilder, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        /**
       * Varibles
       * */
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.successIcon = iconInputValidation;
        this.formFormularioTextoBoton = this.formBuilder.group({
            id: [0],
            textoBoton: ['', [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace
                ]
            ],
            descripcion: ['', forms_1.Validators.required],
            porDefecto: [true]
        });
        this.loaderGrid = false;
        this.loaderModal = false;
        this.isNew = false;
        this.listaFormularioSolicitudTextoBoton = [];
        this.gridFormularioSolicitudTextoBoton = new grid_formulario_solicitud_texto_boton_1.GridFormularioSolicitudTextoBoton();
    }
    FormularioSolicitudTextoBotonComponent.prototype.ngOnInit = function () {
        this.obtenerFormularioSolicitudTextoBoton();
    };
    /**
     * Validaciones
     * @autor margioy Ramirez
     */
    FormularioSolicitudTextoBotonComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formFormularioTextoBoton.get(controlName);
        return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
    };
    FormularioSolicitudTextoBotonComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formFormularioTextoBoton.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    FormularioSolicitudTextoBotonComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            textoBoton: {
                required: 'Ingrese Nombre de Formulario Texto Boton',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            descripcion: { required: 'Ingrese una Descripcion' }
        };
        var formControl = this.formFormularioTextoBoton.get(controlName);
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
    FormularioSolicitudTextoBotonComponent.prototype.validFormFormulariotextoBoton = function () {
        if (this.formFormularioTextoBoton.invalid) {
            this.formFormularioTextoBoton.markAllAsTouched();
            return false;
        }
        return true;
    };
    /**
      * Crea un objeto de envio para el formulario
      * @autor Margirory Ramirez
      */
    FormularioSolicitudTextoBotonComponent.prototype.setDataFormularioSolicitudTextoBoton = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.textoBoton = itemValue.textoBoton;
            item.descripcion = itemValue.descripcion;
            item.porDefecto = itemValue.porDefecto;
            item.estado = itemValue.estado;
            item.usuarioCreacion = itemValue.usuarioCreacion;
            item.usuarioModificacion = itemValue.usuarioModificacion;
            item.fechaCreacion = itemValue.fechaCreacion;
            item.fechaModificacion = itemValue.fechaModificacion;
        }
        return item;
    };
    FormularioSolicitudTextoBotonComponent.prototype.procesarFormularioSolicitudTextoBoton = function (dataItem, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
        var fechaModificacion = fechaActual;
        var formularioSolicitudTextoBotonEnvio = {
            id: isNew ? 0 : dataItem.id,
            textoBoton: dataItem.textoBoton,
            descripcion: dataItem.descripcion,
            porDefecto: dataItem.porDefecto,
            fechaCreacion: fechaCreacion,
            fechaModificacion: fechaModificacion,
            estado: dataItem.estado,
            usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
            usuarioModificacion: this.usuario.userName
        };
        return formularioSolicitudTextoBotonEnvio;
    };
    /**
     * Obtiene la data principal par la grilla
     * @autor Margiory Ramirez
     */
    FormularioSolicitudTextoBotonComponent.prototype.obtenerFormularioSolicitudTextoBoton = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.FormularioSolicitudTextoBotonObtenerFormularioSolicitudTexto)
            .subscribe({
            next: function (response) {
                _this.listaFormularioSolicitudTextoBoton = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
       * Inserta data nueva en formulario solicitud
       * @autor Margiory Ramirez
       */
    FormularioSolicitudTextoBotonComponent.prototype.crearFormularioSolicitudTextoBoton = function () {
        var _this = this;
        if (this.validFormFormulariotextoBoton()) {
            // this.modalRefTCOrigen.close('submitted');
            this.loaderModal = true;
            var datosFormulario = this.formFormularioTextoBoton.getRawValue();
            var formularioSolicitudTextoBoton_1 = Object.assign({}, datosFormulario);
            var formularioSolicitudTextoBotonEnvio = void 0;
            formularioSolicitudTextoBotonEnvio = this.procesarFormularioSolicitudTextoBoton(formularioSolicitudTextoBoton_1, true);
            this.integraService
                .insertar(constApi_1.constApiMarketing.FormularioSolicitudTextoBotonInsertar, formularioSolicitudTextoBotonEnvio)
                .subscribe({
                next: function (response) {
                    formularioSolicitudTextoBoton_1 = _this.setDataFormularioSolicitudTextoBoton(formularioSolicitudTextoBoton_1, response.body);
                    _this.listaFormularioSolicitudTextoBoton.unshift(formularioSolicitudTextoBoton_1);
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRefFormulariotextoBoton.close('submitted');
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formFormularioTextoBoton.markAllAsTouched();
    };
    /**
       * Actulizacion del objeto FOrmulario texto Boton
       * @autor Margiory Ramirez
       */
    FormularioSolicitudTextoBotonComponent.prototype.actualizarFormularioSolicitudTextoBoton = function () {
        var _this = this;
        if (this.validFormFormulariotextoBoton()) {
            ;
            this.loaderModal = true;
            var formularioSolicitudTextoBoton_2 = Object.assign(this.formularioTextoBotonTemp, this.formFormularioTextoBoton.getRawValue());
            var formularioSolicitudTextoBotonEnvio = this.procesarFormularioSolicitudTextoBoton(formularioSolicitudTextoBoton_2, false);
            this.integraService
                .actualizar(constApi_1.constApiMarketing.FormularioSolicitudTextoBotonActualizar, formularioSolicitudTextoBotonEnvio)
                .subscribe({
                next: function (response) {
                    // this.listaGruposCategoriaOrigen.splice(index, 1);
                    _this.formularioTextoBotonTemp = _this.setDataFormularioSolicitudTextoBoton(formularioSolicitudTextoBoton_2, response.body);
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalRefFormulariotextoBoton.close();
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formFormularioTextoBoton.markAllAsTouched();
    };
    FormularioSolicitudTextoBotonComponent.prototype.eliminarFormularioTextoBoton = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.FormularioSolicitudTextoBotonEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if ((response.body == true)) {
                    _this.listaFormularioSolicitudTextoBoton.splice(index, 1);
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
    FormularioSolicitudTextoBotonComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    /**
     * Despliega  notificacion  de validacion
     * @autor Margiory Ramirez
     */
    FormularioSolicitudTextoBotonComponent.prototype.mostrarMensajeExitoso = function () {
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
    FormularioSolicitudTextoBotonComponent.prototype.mostrarMensajeEliminar = function (param) {
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
                _this.eliminarFormularioTextoBoton(param.dataItem, param.index);
            }
        });
    };
    /**
      * Obtiene la plantilla de Formulario Texto Boton
      * @autor Margiory Ramirez
      */
    FormularioSolicitudTextoBotonComponent.prototype.abrirModalFormularioTextoBoton = function (isNew, dataItem, index) {
        this.loaderModal = false;
        this.formFormularioTextoBoton.reset();
        this.formFormularioTextoBoton.get('porDefecto').setValue(true);
        this.isNew = isNew;
        if (dataItem != null) {
            this.formularioTextoBotonTemp = dataItem;
            this.formFormularioTextoBoton.patchValue(this.formularioTextoBotonTemp);
        }
        this.modalRefFormulariotextoBoton = this.modalService.open(this.modalFormularioSolicitudTextoBoton);
    };
    /**
       * Procesa las operaciones de insertar , agregar,editar,elimina,reFrescar
       * @autor Margiory Ramirez
       */
    FormularioSolicitudTextoBotonComponent.prototype.gridEventsFormularioTextoBoton = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.abrirModalFormularioTextoBoton(e.isNew, e.dataItem, e.index);
                break;
            case 'add':
                this.abrirModalFormularioTextoBoton(e.isNew, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e);
                break;
            case 'reload':
                this.obtenerFormularioSolicitudTextoBoton();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalFormularioSolicitudTextoBoton')
    ], FormularioSolicitudTextoBotonComponent.prototype, "modalFormularioSolicitudTextoBoton");
    FormularioSolicitudTextoBotonComponent = __decorate([
        core_1.Component({
            selector: 'app-formulario-solicitud-texto-boton',
            templateUrl: './formulario-solicitud-texto-boton.component.html',
            styleUrls: ['./formulario-solicitud-texto-boton.component.scss']
        })
    ], FormularioSolicitudTextoBotonComponent);
    return FormularioSolicitudTextoBotonComponent;
}());
exports.FormularioSolicitudTextoBotonComponent = FormularioSolicitudTextoBotonComponent;

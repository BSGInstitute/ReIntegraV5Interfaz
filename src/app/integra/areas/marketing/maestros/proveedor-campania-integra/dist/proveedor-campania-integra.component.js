"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProveedorCampaniaIntegraComponent = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var sweetalert2_1 = require("sweetalert2");
var grid_proveedor_campania_integra_1 = require("./grid-proveedor-campania-integra");
var text_validator_1 = require("@shared/validators/text.validator");
var constApi_1 = require("@environments/constApi");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente de  Proveedor Campania .
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 27/08/2022 Creacion de interfaces de Proveedor Campania Integra  ,
 * * 29/08/2022 Implementaccion de funciones logicas
 */
var ProveedorCampaniaIntegraComponent = /** @class */ (function () {
    function ProveedorCampaniaIntegraComponent(integraService, formBuilder, modalService) {
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
          * */
        this.successIcon = iconInputValidation;
        this.formProveedorCampaniaIntegra = this.formBuilder.group({
            id: [0],
            nombre: ['', [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace
                ]
            ],
            porDefecto: [true]
        });
        this.loaderGrid = false;
        this.loaderModal = false;
        this.isNew = false;
        this.listaProveedorCamapaniaIntegra = [];
        this.gridProveedorCamapaniaIntegra = new grid_proveedor_campania_integra_1.GridProveedorCamapaniaIntegra();
    }
    /**
       * Acciones
       * */
    ProveedorCampaniaIntegraComponent.prototype.ngOnInit = function () {
        this.obtenerProveedorCampaniaIntegra();
    };
    /**
       * @description Funciones de validacion
       * @autor Margiory Ramirez
       * @param {string} controlName
       */
    ProveedorCampaniaIntegraComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formProveedorCampaniaIntegra.get(controlName);
        return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
    };
    ProveedorCampaniaIntegraComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formProveedorCampaniaIntegra.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    ProveedorCampaniaIntegraComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'Ingrese Nombre ',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            }
        };
        var formControl = this.formProveedorCampaniaIntegra.get(controlName);
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
    ProveedorCampaniaIntegraComponent.prototype.validFormProveedorcampaniaIntegra = function () {
        if (this.formProveedorCampaniaIntegra.invalid) {
            this.formProveedorCampaniaIntegra.markAllAsTouched();
            return false;
        }
        return true;
    };
    /**
       * Crea un objeto de  envio  Proveedor Campania Integra
       * @autor Margiory Ramirez
       */
    ProveedorCampaniaIntegraComponent.prototype.setDataProveedorCampaniaIntegra = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.nombre = itemValue.nombre;
            item.estado = itemValue.estado;
            item.usuarioCreacion = itemValue.usuarioCreacion;
            item.usuarioModificacion = itemValue.usuarioModificacion;
            item.fechaCreacion = itemValue.fechaCreacion;
            item.fechaModificacion = itemValue.fechaModificacion;
            item.porDefecto = itemValue.porDefecto;
        }
        return item;
    };
    ProveedorCampaniaIntegraComponent.prototype.procesarProveedorCampaniaIntegra = function (dataItem, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
        var fechaModificacion = fechaActual;
        var proveedorCampaniaIntegraEnvio = {
            id: isNew ? 0 : dataItem.id,
            nombre: dataItem.nombre,
            estado: dataItem.estado,
            fechaCreacion: fechaCreacion,
            fechaModificacion: fechaModificacion,
            usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
            usuarioModificacion: this.usuario.userName,
            porDefecto: dataItem.porDefecto
        };
        return proveedorCampaniaIntegraEnvio;
    };
    /**
       * Obtiene data  proveedor  campania integra para la grilla principal
       * @autor Margiory Ramirez
       */
    ProveedorCampaniaIntegraComponent.prototype.obtenerProveedorCampaniaIntegra = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.ProveedorCampaniaIntegraObtenerProveedorCampaniaIntegra)
            .subscribe({
            next: function (response) {
                _this.listaProveedorCamapaniaIntegra = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
     * @description Inserta un nuevo Registro para campania Integra
     * @autor Margiory Ramirez
     */
    ProveedorCampaniaIntegraComponent.prototype.crearProveedorCampaniaIntegra = function () {
        var _this = this;
        if (this.validFormProveedorcampaniaIntegra()) {
            this.loaderModal = true;
            var datosFormulario = this.formProveedorCampaniaIntegra.getRawValue();
            var proveedorCampaniaIntegra = Object.assign({}, datosFormulario);
            var proveedorCampaniaIntegraEnvio = void 0;
            proveedorCampaniaIntegraEnvio = this.procesarProveedorCampaniaIntegra(proveedorCampaniaIntegra, true);
            this.integraService
                .insertar(constApi_1.constApiMarketing.ProveedorCampaniaIntegraInsertar, proveedorCampaniaIntegraEnvio)
                .subscribe({
                next: function (response) {
                    proveedorCampaniaIntegra = _this.setDataProveedorCampaniaIntegra(proveedorCampaniaIntegra, response.body);
                    _this.listaProveedorCamapaniaIntegra.unshift(proveedorCampaniaIntegra);
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
            this.formProveedorCampaniaIntegra.markAllAsTouched();
    };
    /**
       * @description Inserta un nuevo Registro para campania Integra
       * @autor Margiory Ramirez
       */
    ProveedorCampaniaIntegraComponent.prototype.actualizarProveedorCampaniaIntegra = function () {
        var _this = this;
        if (this.validFormProveedorcampaniaIntegra()) {
            ;
            this.loaderModal = true;
            var proveedorCampaniaIntegra_1 = Object.assign(this.proveedorcampaniaIntegraTemp, this.formProveedorCampaniaIntegra.getRawValue());
            var proveedorCampaniaIntegraEnvio = this.procesarProveedorCampaniaIntegra(proveedorCampaniaIntegra_1, false);
            this.integraService
                .actualizar(constApi_1.constApiMarketing.ProveedorCampaniaIntegraActualizar, proveedorCampaniaIntegraEnvio)
                .subscribe({
                next: function (response) {
                    _this.proveedorcampaniaIntegraTemp = _this.setDataProveedorCampaniaIntegra(proveedorCampaniaIntegra_1, response.body);
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
            this.formProveedorCampaniaIntegra.markAllAsTouched();
    };
    /**
       * @description Elimina  el  objeto  de Proveedor Campania en la grilla principal por Id
       * @autor Margiory Ramirez
       */
    ProveedorCampaniaIntegraComponent.prototype.eliminarProveedorCampaniaIntegra = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.ProveedorCampaniaIntegraEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if ((response.body == true)) {
                    _this.listaProveedorCamapaniaIntegra.splice(index, 1);
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
    ProveedorCampaniaIntegraComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    ProveedorCampaniaIntegraComponent.prototype.mostrarMensajeExitoso = function () {
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
    ProveedorCampaniaIntegraComponent.prototype.mostrarMensajeEliminar = function (param) {
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
                _this.eliminarProveedorCampaniaIntegra(param.dataItem, param.index);
            }
        });
    };
    /**
     * Despliega modal para la cargar  datos
     * @autor Margiory Ramirez
     */
    ProveedorCampaniaIntegraComponent.prototype.abrirModalProveedorCampaniaIntegra = function (isNew, dataItem, index) {
        this.loaderModal = false;
        this.formProveedorCampaniaIntegra.reset();
        this.formProveedorCampaniaIntegra.get('porDefecto').setValue(true);
        this.isNew = isNew;
        if (dataItem != null) {
            this.proveedorcampaniaIntegraTemp = dataItem;
            this.formProveedorCampaniaIntegra.patchValue(this.proveedorcampaniaIntegraTemp);
        }
        this.modalRefTCOrigen = this.modalService.open(this.modalProveedorCampaniaIntegra);
    };
    /**
    * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
    * @autor Margiory Ramirez
    */
    ProveedorCampaniaIntegraComponent.prototype.gridEventsProveedorCampaniaIntegra = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.abrirModalProveedorCampaniaIntegra(e.isNew, e.dataItem, e.index);
                break;
            case 'add':
                this.abrirModalProveedorCampaniaIntegra(e.isNew, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e);
                break;
            case 'reload':
                this.obtenerProveedorCampaniaIntegra();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalProveedorCampaniaIntegra')
    ], ProveedorCampaniaIntegraComponent.prototype, "modalProveedorCampaniaIntegra");
    ProveedorCampaniaIntegraComponent = __decorate([
        core_1.Component({
            selector: 'app-proveedor-campania-integra',
            templateUrl: './proveedor-campania-integra.component.html',
            styleUrls: ['./proveedor-campania-integra.component.scss']
        })
    ], ProveedorCampaniaIntegraComponent);
    return ProveedorCampaniaIntegraComponent;
}());
exports.ProveedorCampaniaIntegraComponent = ProveedorCampaniaIntegraComponent;

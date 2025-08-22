"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GruposCategoriaOrigenComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var grid_grupos_categoria_origen_1 = require("./grid-grupos-categoria-origen");
var text_validator_1 = require("@shared/validators/text.validator");
var sweetalert2_1 = require("sweetalert2");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente de grupo Categoria Origen.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 10/08/2022 Creacion de interfaces de Grupos categoria Origen,
 * * 11/08/2022 Implementaccion de funciones logicas
 */
var GruposCategoriaOrigenComponent = /** @class */ (function () {
    function GruposCategoriaOrigenComponent(integraService, formBuilder, modalService) {
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
        this.formGrupoCategoriaOrigen = this.formBuilder.group({
            id: [0],
            nombre: ['', [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace
                ]
            ],
            descripcion: ['', forms_1.Validators.required],
            meta: ['', [forms_1.Validators.required, forms_1.Validators.min(1)]]
        });
        this.loaderGrid = false;
        this.loaderModal = false;
        this.isNew = false;
        this.listaGruposCategoriaOrigen = [];
        this.gridGruposCategoriaOrigen = new grid_grupos_categoria_origen_1.GridCategoriaOrigen();
    }
    /**
     * Acciones
     * */
    GruposCategoriaOrigenComponent.prototype.ngOnInit = function () {
        this.obtenerGrupoCategoriaOrigen();
    };
    /**
       * @description Funciones de validacion
       * @autor Margiory Ramirez
       * @param {string} controlName
       */
    GruposCategoriaOrigenComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formGrupoCategoriaOrigen.get(controlName);
        return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
    };
    GruposCategoriaOrigenComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formGrupoCategoriaOrigen.get(controlName);
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
    GruposCategoriaOrigenComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'Ingrese Nombre de Tipo Categoria Origen',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            descripcion: { required: 'Ingrese una descripcion' },
            meta: { required: 'Meta es obligatorio', min: 'El Valor de Meta no es valido' }
        };
        var formControl = this.formGrupoCategoriaOrigen.get(controlName);
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
    GruposCategoriaOrigenComponent.prototype.validFormGrupoCategoriaOrigen = function () {
        if (this.formGrupoCategoriaOrigen.invalid) {
            this.formGrupoCategoriaOrigen.markAllAsTouched();
            return false;
        }
        return true;
    };
    /**
       * Crea un objeto de  envio TipoCategoriaOrigen
       * @autor Margiory Ramirez
       */
    GruposCategoriaOrigenComponent.prototype.setDataTipoCategoriaOrigen = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.nombre = itemValue.nombre;
            item.descripcion = itemValue.descripcion;
            item.meta = itemValue.meta;
            item.orden = itemValue.orden;
            item.oportunidadMaxima = itemValue.oportunidadMaxima;
            item.estado = itemValue.estado;
            item.usuarioCreacion = itemValue.usuarioCreacion;
            item.usuarioModificacion = itemValue.usuarioModificacion;
            item.fechaCreacion = itemValue.fechaCreacion;
            item.fechaModificacion = itemValue.fechaModificacion;
        }
        return item;
    };
    GruposCategoriaOrigenComponent.prototype.procesarDataTipoCategoriaOrigen = function (dataItem, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
        var fechaModificacion = fechaActual;
        var tipoCategoriaOrigenEnvio = {
            id: isNew ? 0 : dataItem.id,
            nombre: dataItem.nombre,
            fechaCreacion: fechaCreacion,
            fechaModificacion: fechaModificacion,
            estado: true,
            usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
            usuarioModificacion: this.usuario.userName,
            descripcion: dataItem.descripcion,
            meta: dataItem.meta,
            orden: 0,
            oportunidadMaxima: Math.round(1.0 / (dataItem.meta / 100.0))
        };
        return tipoCategoriaOrigenEnvio;
    };
    /**
       * Obtiene data  grupo Tipo Categoria Origen para el llenado de  grilla princial
       * @autor Margiory Ramirez
       */
    GruposCategoriaOrigenComponent.prototype.obtenerGrupoCategoriaOrigen = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.TipoCateriaOrigenObtenerTipoCategoriaOrigen)
            .subscribe({
            next: function (response) {
                _this.listaGruposCategoriaOrigen = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
       * @description Creacion del objeto  Grupos  Categoria Origen
       * @autor Margiory Ramirez
       */
    GruposCategoriaOrigenComponent.prototype.crearGrupoCategoriaOrigen = function () {
        var _this = this;
        if (this.validFormGrupoCategoriaOrigen()) {
            this.loaderModal = true;
            var datosFormulario = this.formGrupoCategoriaOrigen.getRawValue();
            var tipoCategoriaOrigen_1 = Object.assign({}, datosFormulario);
            var tipoCategoriaOrigenEnvio = void 0;
            tipoCategoriaOrigenEnvio = this.procesarDataTipoCategoriaOrigen(tipoCategoriaOrigen_1, true);
            this.integraService
                .insertar(constApi_1.constApiMarketing.TipoCateriaOrigenInsertar, tipoCategoriaOrigenEnvio)
                .subscribe({
                next: function (response) {
                    tipoCategoriaOrigen_1 = _this.setDataTipoCategoriaOrigen(tipoCategoriaOrigen_1, response.body);
                    _this.listaGruposCategoriaOrigen.unshift(tipoCategoriaOrigen_1);
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
            this.formGrupoCategoriaOrigen.markAllAsTouched();
    };
    /**
       * @description Actualiza el  objeto  de Categoria Origen
       * @autor Margiory Ramirez
       */
    GruposCategoriaOrigenComponent.prototype.actualizarGrupoCategoriaOrigen = function () {
        var _this = this;
        if (this.validFormGrupoCategoriaOrigen()) {
            ;
            this.loaderModal = true;
            var tipoCategoriaOrigen_2 = Object.assign(this.tipoCategoriaOrigenTemp, this.formGrupoCategoriaOrigen.getRawValue());
            var tipoCategoriaOrigenEnvio = this.procesarDataTipoCategoriaOrigen(tipoCategoriaOrigen_2, false);
            this.integraService
                .actualizar(constApi_1.constApiMarketing.TipoCateriaOrigenActualizar, tipoCategoriaOrigenEnvio)
                .subscribe({
                next: function (response) {
                    _this.tipoCategoriaOrigenTemp = _this.setDataTipoCategoriaOrigen(tipoCategoriaOrigen_2, response.body);
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
            this.formGrupoCategoriaOrigen.markAllAsTouched();
        '';
    };
    /**
       * @description Elimina  el  objeto  de Categoria Origen  en la grilla principal por Id
       * @autor Margiory Ramirez
       */
    GruposCategoriaOrigenComponent.prototype.eliminarGrupoCategoriaOrigen = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.TipoCateriaOrigenEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if ((response.body == true)) {
                    _this.listaGruposCategoriaOrigen.splice(index, 1);
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
    GruposCategoriaOrigenComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    GruposCategoriaOrigenComponent.prototype.mostrarMensajeExitoso = function () {
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
    GruposCategoriaOrigenComponent.prototype.mostrarMensajeEliminar = function (param) {
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
                _this.eliminarGrupoCategoriaOrigen(param.dataItem, param.index);
            }
        });
    };
    /**
      * Despliega modal para registro de datos
      * @autor Margiory Ramirez
      */
    GruposCategoriaOrigenComponent.prototype.abrirModalTipoCategoriaOrigen = function (isNew, dataItem, index) {
        this.loaderModal = false;
        this.formGrupoCategoriaOrigen.reset();
        this.isNew = isNew;
        if (dataItem != null) {
            this.tipoCategoriaOrigenTemp = dataItem;
            this.formGrupoCategoriaOrigen.patchValue(this.tipoCategoriaOrigenTemp);
        }
        this.modalRefTCOrigen = this.modalService.open(this.modalGrupoCategoriaOrigen);
    };
    GruposCategoriaOrigenComponent.prototype.abrirModalVerDatos = function (data) {
        this.tipoCategoriaOrigenTemp = data;
        this.modalService.open(this.modalVerGrupoCategoriaOrigen);
    };
    /**
    * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
    * @autor Margiory Ramirez
    */
    GruposCategoriaOrigenComponent.prototype.gridEventsGrupoCategoriaOrigen = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.abrirModalTipoCategoriaOrigen(e.isNew, e.dataItem, e.index);
                break;
            case 'add':
                this.abrirModalTipoCategoriaOrigen(e.isNew, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e);
                break;
            case 'ver':
                this.abrirModalVerDatos(e.dataItem);
                break;
            case 'reload':
                this.obtenerGrupoCategoriaOrigen();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalGrupoCategoriaOrigen')
    ], GruposCategoriaOrigenComponent.prototype, "modalGrupoCategoriaOrigen");
    __decorate([
        core_1.ViewChild('modalVerGrupoCategoriaOrigen')
    ], GruposCategoriaOrigenComponent.prototype, "modalVerGrupoCategoriaOrigen");
    GruposCategoriaOrigenComponent = __decorate([
        core_1.Component({
            selector: 'app-grupos-categoria-origen',
            templateUrl: './grupos-categoria-origen.component.html',
            styleUrls: ['./grupos-categoria-origen.component.scss']
        })
    ], GruposCategoriaOrigenComponent);
    return GruposCategoriaOrigenComponent;
}());
exports.GruposCategoriaOrigenComponent = GruposCategoriaOrigenComponent;

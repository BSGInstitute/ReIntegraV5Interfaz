"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CampoContactoComponent = void 0;
var grid_campo_contacto_1 = require("./grid-campo-contacto");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var text_validator_1 = require("@shared/validators/text.validator");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente de grupo Campo Contacto.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 10/08/2022 Creacion de interfaces de Campo Contacto,
 * * 11/08/2022 Implementaccion de funciones logicas
 */
var CampoContactoComponent = /** @class */ (function () {
    function CampoContactoComponent(integraService, formBuilder, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.successIcon = iconInputValidation;
        this.formCampoContacto = this.formBuilder.group({
            id: [0],
            nombre: ['', [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace
                ]
            ],
            tipoControl: ['', forms_1.Validators.required],
            procedimiento: ['', [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace
                ]
            ]
        });
        this.loaderGrid = false;
        this.loaderModal = false;
        this.isNew = false;
        this.listaCampoContacto = [];
        this.gridCampoContacto = new grid_campo_contacto_1.GridCampoContacto();
    }
    /**
     * Funciones
     */
    CampoContactoComponent.prototype.ngOnInit = function () {
        this.ObtenerCampoContacto();
    };
    /**
       * @description Funciones de validacion
       * @autor Margiory Ramirez
       * @param {string} controlName
       */
    CampoContactoComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formCampoContacto.get(controlName);
        return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
    };
    CampoContactoComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formCampoContacto.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    CampoContactoComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'Ingrese Nombre de Tipo Categoria Origen',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            tipoControl: { required: 'Ingrese una descripcion' },
            procedimiento: {
                required: 'Ingrese Nombre de Tipo Categoria Origen',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            }
            //valoresPreEstablecidos: { required: 'Meta es obligatorio', min: 'El Valor de Meta no es valido' },
        };
        var formControl = this.formCampoContacto.get(controlName);
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
    CampoContactoComponent.prototype.validCampoContacto = function () {
        if (this.formCampoContacto.invalid) {
            this.formCampoContacto.markAllAsTouched();
            return false;
        }
        return true;
    };
    /**
     * Crea un objeto de  envio  de  Campo Contacto
     * @param item
     * @param itemValue
     * @returns
     */
    CampoContactoComponent.prototype.setDataCampoContacto = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.nombre = itemValue.nombre;
            item.tipoControl = itemValue.tipoControl;
            item.valoresPreEstablecidos = itemValue.valoresPreEstablecidos;
            item.procedimiento = itemValue.procedimiento;
            item.estado = itemValue.estado;
            item.usuarioCreacion = itemValue.usuarioCreacion;
            item.usuarioModificacion = itemValue.usuarioModificacion;
            item.fechaCreacion = itemValue.fechaCreacion;
            item.fechaModificacion = itemValue.fechaModificacion;
        }
        return item;
    };
    CampoContactoComponent.prototype.procesarDataCampoContacto = function (dataItem, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
        var fechaModificacion = fechaActual;
        var campoContactoEnvio = {
            id: isNew ? 0 : dataItem.id,
            nombre: dataItem.nombre,
            tipoControl: dataItem.tipoControl,
            valoresPreEstablecidos: dataItem.valoresPreEstablecidos,
            procedimiento: dataItem.procedimiento,
            estado: true,
            fechaCreacion: fechaCreacion,
            fechaModificacion: fechaModificacion,
            usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
            usuarioModificacion: this.usuario.userName
        };
        return campoContactoEnvio;
    };
    /**
     * Obtiene data principal para llenado de Grilla
     * @autor Margiory Ramirez
     */
    CampoContactoComponent.prototype.ObtenerCampoContacto = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.CampoContactoObtenerCampoContacto)
            .subscribe({
            next: function (response) {
                _this.listaCampoContacto = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
            },
            complete: function () { }
        });
    };
    /**
       * @description Inserta un nuevo objeto Campo Contacto
       * @autor Margiory Ramirez
       */
    CampoContactoComponent.prototype.crearCampoContacto = function () {
        var _this = this;
        if (this.validCampoContacto()) {
            // this.modalRefTCOrigen.close('submitted');
            this.loaderModal = true;
            var datosFormulario = this.formCampoContacto.getRawValue();
            var campoContacto_1 = Object.assign({}, datosFormulario);
            var campoContactoEnvio = void 0;
            campoContactoEnvio = this.procesarDataCampoContacto(campoContacto_1, true);
            this.integraService
                .insertar(constApi_1.constApiMarketing.CampoContactoInsertar, campoContactoEnvio)
                .subscribe({
                next: function (response) {
                    campoContacto_1 = _this.setDataCampoContacto(campoContacto_1, response.body);
                    _this.listaCampoContacto.unshift(campoContacto_1);
                    // this.listaGruposCategoriaOrigen = this.listaGruposCategoriaOrigen.slice();
                    // this.listaGruposCategoriaOrigen.push(response.body); //insetar
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRefTCampoContacto.close('submitted');
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formCampoContacto.markAllAsTouched();
    };
    /**
       * @description Actualiza un nuevo objeto Campo Contacto
       * @autor Margiory Ramirez
       */
    CampoContactoComponent.prototype.actualizarCampoContacto = function () {
        var _this = this;
        if (this.validCampoContacto()) {
            ;
            this.loaderModal = true;
            var campoContacto_2 = Object.assign(this.campoContactoTemp, this.formCampoContacto.getRawValue());
            var campoContactoEnvio = this.procesarDataCampoContacto(campoContacto_2, false);
            this.integraService
                .actualizar(constApi_1.constApiMarketing.CampoContactoActualizar, campoContactoEnvio)
                .subscribe({
                next: function (response) {
                    _this.campoContactoTemp = _this.setDataCampoContacto(campoContacto_2, response.body);
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalRefTCampoContacto.close();
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formCampoContacto.markAllAsTouched();
    };
    /**
       * @description Elimina  el  objeto  de Campo Contacto  en la grilla principal por Id
       * @autor Margiory Ramirez
       */
    CampoContactoComponent.prototype.eliminarCampoContacto = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.CampoContactoEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if ((response.body == true)) {
                    _this.listaCampoContacto.splice(index, 1);
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
    CampoContactoComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    CampoContactoComponent.prototype.mostrarMensajeExitoso = function () {
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
    CampoContactoComponent.prototype.mostrarMensajeEliminar = function (param) {
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
                _this.eliminarCampoContacto(param.dataItem, param.index);
            }
        });
    };
    /**
       * Despliega modal para registro de datos
       * @autor Margiory Ramirez
       */
    CampoContactoComponent.prototype.abrirModalCampoContacto = function (isNew, dataItem, index) {
        this.loaderModal = false;
        this.formCampoContacto.reset();
        this.isNew = isNew;
        if (dataItem != null) {
            this.campoContactoTemp = dataItem;
            this.formCampoContacto.patchValue(this.campoContactoTemp);
        }
        this.modalRefTCampoContacto = this.modalService.open(this.modalCampoContacto);
    };
    /**
     * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
     * @autor Margiory Ramirez
     */
    CampoContactoComponent.prototype.gridEventscampoContacto = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.abrirModalCampoContacto(e.isNew, e.dataItem, e.index);
                break;
            case 'add':
                this.abrirModalCampoContacto(e.isNew, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e);
                break;
            case 'reload':
                this.ObtenerCampoContacto();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalCampoContacto')
    ], CampoContactoComponent.prototype, "modalCampoContacto");
    CampoContactoComponent = __decorate([
        core_1.Component({
            selector: 'app-campo-contacto',
            templateUrl: './campo-contacto.component.html',
            styleUrls: ['./campo-contacto.component.scss']
        })
    ], CampoContactoComponent);
    return CampoContactoComponent;
}());
exports.CampoContactoComponent = CampoContactoComponent;

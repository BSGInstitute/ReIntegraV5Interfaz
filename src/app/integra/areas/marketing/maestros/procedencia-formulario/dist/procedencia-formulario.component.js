"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProcedenciaFormularioComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var constApi_1 = require("@environments/constApi");
var text_validator_1 = require("@shared/validators/text.validator");
var sweetalert2_1 = require("sweetalert2");
var grid_procedencia_formulario_1 = require("./grid-procedencia-formulario");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente de Pais.
 * @author Margiory Ramirez
 * @version 1.0.1
 * @history
 * * 23/08/2022 Creacion de interfaces de procedencia formulario,
 * * 25/08/2022 Implementaccion de funciones logicas
 */
var ProcedenciaFormularioComponent = /** @class */ (function () {
    function ProcedenciaFormularioComponent(integraService, formBuilder, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        /**
        * Varibles
        * */
        this.successIcon = iconInputValidation;
        this.formProcedenciaFormulario = this.formBuilder.group({
            id: [0],
            tipoInteraccion: [''],
            nombre: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ],
            descripcion: ['', forms_1.Validators.required]
        });
        this.listaProcedenciaFormulario = [];
        this.listaTipoInteraccion = [];
        this.loaderGrid = false;
        this.loaderModal = false;
        this.isNew = false;
        this.gridProcedenciaFormulario = new grid_procedencia_formulario_1.GridProcedenciaFormulario();
    }
    /**
     *  Acciones
     * */
    ProcedenciaFormularioComponent.prototype.ngOnInit = function () {
        var _this = this;
        // this.formProcedenciaFormulario.get('nombre').disable();
        this.obtenerProcedenciaFormulario();
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.TipoInteraccionObtenerCombo)
            .subscribe({
            next: function (response) {
                _this.listaTipoInteraccion = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
     * @description Funciones de validacion
     * @autor Margiory Ramirez
     * @param {string} controlName
     */
    ProcedenciaFormularioComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formProcedenciaFormulario.get(controlName);
        return (!this.getValidControl(controlName) &&
            formControl.value != null &&
            formControl.value != '');
    };
    ProcedenciaFormularioComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formProcedenciaFormulario.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    ProcedenciaFormularioComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'Ingrese Nombre de Tipo Categoria Origen',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            descripcion: { required: 'Ingrese una descripcion' }
        };
        var formControl = this.formProcedenciaFormulario.get(controlName);
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
    ProcedenciaFormularioComponent.prototype.validFormProcedenciaFormulario = function () {
        if (this.formProcedenciaFormulario.invalid) {
            this.formProcedenciaFormulario.markAllAsTouched();
            return false;
        }
        return true;
    };
    ProcedenciaFormularioComponent.prototype.setValueProcedenciaFormulario = function (procedenciaFormulario, procedenciaFormularioEnvio) {
        if (procedenciaFormularioEnvio != null) {
            procedenciaFormulario.id = procedenciaFormularioEnvio.id;
            procedenciaFormulario.nombre = procedenciaFormularioEnvio.nombre;
            procedenciaFormulario.descripcion = procedenciaFormularioEnvio.descripcion;
            procedenciaFormulario.estado = procedenciaFormularioEnvio.estado;
            procedenciaFormulario.usuarioCreacion = procedenciaFormularioEnvio.usuarioCreacion;
            procedenciaFormulario.usuarioModificacion = procedenciaFormularioEnvio.usuarioModificacion;
            procedenciaFormulario.fechaCreacion = procedenciaFormularioEnvio.fechaCreacion;
            procedenciaFormulario.fechaModificacion = procedenciaFormularioEnvio.fechaModificacion;
        }
        return procedenciaFormulario;
    };
    /**
   * Crea un objeto de  envio TipoCategoriaOrigen
   * @autor Margiory Ramirez
   */
    ProcedenciaFormularioComponent.prototype.procesarProcedenciaFormularioEnvio = function (dataItem, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacion = isNew
            ? fechaActual
            : pipe.transform(dataItem.fechaCreacion, formatoFecha);
        var fechaModificacion = fechaActual;
        var procedenciaFormularioEnvio = {
            id: isNew ? 0 : dataItem.id,
            nombre: dataItem.nombre,
            descripcion: dataItem.descripcion,
            fechaCreacion: fechaCreacion,
            fechaModificacion: fechaModificacion,
            estado: true,
            usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
            usuarioModificacion: this.usuario.userName
        };
        return procedenciaFormularioEnvio;
    };
    ProcedenciaFormularioComponent.prototype.procesarProcedenciaFormularioDetalleEnvio = function (ids, procedenciaFormulario) {
        var _this = this;
        if (ids === void 0) { ids = []; }
        var procedenciaFormularioDetalleEnvio = [];
        if (ids != null && ids.length > 0) {
            ids.forEach(function (idInteraccion) {
                var index = -1;
                if (!_this.isNew) {
                    index = _this.procedenciaFormularioDetalleTemp.findIndex(function (e) { return e.idTipoInteraccion == idInteraccion; });
                }
                if (index == -1) {
                    var detalle = {
                        id: 0,
                        idProcedenciaFormulario: procedenciaFormulario.id,
                        idTipoInteraccion: idInteraccion,
                        estado: true,
                        usuarioCreacion: _this.usuario.userName,
                        usuarioModificacion: _this.usuario.userName,
                        fechaCreacion: procedenciaFormulario.fechaModificacion,
                        fechaModificacion: procedenciaFormulario.fechaModificacion
                    };
                    procedenciaFormularioDetalleEnvio.push(detalle);
                }
            });
        }
        return procedenciaFormularioDetalleEnvio;
    };
    /**
       * Obtiene data  grupo procedencia formulario el llenado de  grilla princial
       * @autor Margiory Ramirez
       */
    ProcedenciaFormularioComponent.prototype.obtenerProcedenciaFormulario = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.ProcedenciaFormularioObtenerProcedenciaFormulario)
            .subscribe({
            next: function (response) {
                _this.listaProcedenciaFormulario = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    /**
     * Obtiene  data tipo Interacion con idProcedenciaFormulario
     * @autor Margiory Ramirez
     */
    ProcedenciaFormularioComponent.prototype.obtenerTipoInteraccion = function (idProcedenciaFormulario) {
        var _this = this;
        this.integraService
            .obtenerPorPathParams(constApi_1.constApiMarketing.ObtenerProcedenciaFormularioDetallePorIdProcedenciaFormulario, [{ clave: 'idProcedenciaFormulario', valor: idProcedenciaFormulario }])
            .subscribe({
            next: function (response) {
                // this.listaProcedenciaFormularioDetalle = response.body;
                var idInteraccion = [];
                response.body.forEach(function (element) {
                    idInteraccion.push(Number(element.idTipoInteraccion));
                });
                _this.procedenciaFormularioDetalleTemp = response.body;
                _this.formProcedenciaFormulario
                    .get('tipoInteraccion')
                    .setValue(idInteraccion);
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
    ProcedenciaFormularioComponent.prototype.crearProcedenciaFormulario = function () {
        var _this = this;
        if (this.validFormProcedenciaFormulario()) {
            this.loaderModal = true;
            var datosFormulario = this.formProcedenciaFormulario.getRawValue();
            var procedenciaFormulario_1 = {
                nombre: datosFormulario.nombre,
                descripcion: datosFormulario.descripcion
            };
            var procedenciaFormularioEnvio = void 0;
            procedenciaFormularioEnvio = this.procesarProcedenciaFormularioEnvio(procedenciaFormulario_1, true);
            var procedenciaFormularioDetalleEnvio_1 = this.procesarProcedenciaFormularioDetalleEnvio(datosFormulario.tipoInteraccion, procedenciaFormularioEnvio);
            this.integraService
                .insertar(constApi_1.constApiMarketing.ProcedenciaFormularioInsertar, procedenciaFormularioEnvio)
                .subscribe({
                next: function (response) {
                    procedenciaFormulario_1 = _this.setValueProcedenciaFormulario(procedenciaFormulario_1, response.body);
                    _this.loaderModal = false;
                    procedenciaFormularioDetalleEnvio_1.forEach(function (element) {
                        element.idProcedenciaFormulario = response.body.id;
                    });
                    _this.integraService
                        .insertarLista(constApi_1.constApiMarketing.ProcedenciaFormularioDetalleInsertarLista, procedenciaFormularioDetalleEnvio_1)
                        .subscribe({
                        next: function (response) {
                            console.log(response.body);
                        },
                        error: function (error) {
                            _this.loaderModal = false;
                            _this.mostrarMensajeError(error);
                        },
                        complete: function () {
                            _this.loaderModal = false;
                            _this.modalRefProcedenciaFormulario.close();
                            _this.mostrarMensajeExitoso();
                        }
                    });
                    _this.listaProcedenciaFormulario.unshift(procedenciaFormulario_1);
                    _this.loaderModal = false;
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.modalRefProcedenciaFormulario.close('submitted');
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formProcedenciaFormulario.markAllAsTouched();
    };
    /**
       * @description Actualiza el  objeto   de Procedentcia Formulario
       * @autor Margiory Ramirez
       */
    ProcedenciaFormularioComponent.prototype.actualizarProcedenciaFormulario = function () {
        var _this = this;
        if (this.validFormProcedenciaFormulario()) {
            var datosFormulario_1 = this.formProcedenciaFormulario.getRawValue();
            this.procedenciaFormularioTemp.nombre = datosFormulario_1.nombre;
            this.procedenciaFormularioTemp.descripcion = datosFormulario_1.descripcion;
            var procedenciaFormularioEnvio = this.procesarProcedenciaFormularioEnvio(this.procedenciaFormularioTemp, false);
            var procedenciaFormularioDetalleEnvio_2 = this.procesarProcedenciaFormularioDetalleEnvio(datosFormulario_1.tipoInteraccion, procedenciaFormularioEnvio);
            var idInteraccionEliminado_1 = [];
            this.procedenciaFormularioDetalleTemp.forEach(function (element) {
                var index = datosFormulario_1.tipoInteraccion.findIndex(function (e) { return e == element.idTipoInteraccion; });
                if (index == -1) {
                    idInteraccionEliminado_1.push(element.id);
                }
            });
            this.integraService
                .actualizar(constApi_1.constApiMarketing.ProcedenciaFormularioActualizar, procedenciaFormularioEnvio)
                .subscribe({
                next: function (response) {
                    console.log(response.body);
                    _this.integraService
                        .insertarLista(constApi_1.constApiMarketing.ProcedenciaFormularioDetalleInsertarLista, procedenciaFormularioDetalleEnvio_2)
                        .subscribe({
                        next: function (response2) {
                            _this.integraService
                                .eliminarListadoPorPathParams(constApi_1.constApiMarketing.ProcedenciaFormularioDetalleElimarninarListado, [{ clave: 'usuario', valor: _this.usuario.userName }], idInteraccionEliminado_1)
                                .subscribe({
                                next: function (response3) {
                                    // this.mostrarMensajeExitoso();
                                },
                                error: function (error) {
                                    _this.loaderModal = false;
                                    // this.mostrarMensajeError(error);
                                },
                                complete: function () {
                                    _this.loaderModal = false;
                                }
                            });
                        },
                        error: function (error) {
                            _this.loaderModal = false;
                            _this.mostrarMensajeError(error);
                        },
                        complete: function () {
                            _this.loaderModal = false;
                            _this.modalRefProcedenciaFormulario.close();
                        }
                    });
                },
                error: function (error) {
                    _this.loaderModal = false;
                    _this.mostrarMensajeError(error);
                },
                complete: function () {
                    _this.loaderModal = false;
                    _this.modalRefProcedenciaFormulario.close();
                    _this.mostrarMensajeExitoso();
                }
            });
        }
        else
            this.formProcedenciaFormulario.markAllAsTouched();
    };
    /**
       * @description Elimina el  objeto   de Procedentcia Formulario de grilla pruncipal.
       * @autor Margiory Ramirez
       */
    ProcedenciaFormularioComponent.prototype.eliminarProcedenciaFormulario = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.ProcedenciaFormularioEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if (response.body == true) {
                    _this.listaProcedenciaFormulario.splice(index, 1);
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
    ProcedenciaFormularioComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    ProcedenciaFormularioComponent.prototype.mostrarMensajeExitoso = function () {
        this.loaderGrid = false;
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            target: '#content-drawer-component',
            customClass: {
                container: 'position-absolute'
            },
            position: 'top-right',
            showConfirmButton: false,
            timer: 5000,
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
    ProcedenciaFormularioComponent.prototype.mostrarMensajeEliminar = function (param) {
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
                _this.eliminarProcedenciaFormulario(param.dataItem, param.index);
            }
        });
    };
    /**
       * Despliega modal para registro de datos
       * @autor Margiory Ramirez
       */
    ProcedenciaFormularioComponent.prototype.abrirModalFormularioProcedencia = function (isNew, dataItem, index) {
        this.loaderModal = false;
        this.formProcedenciaFormulario.reset();
        this.isNew = isNew;
        if (dataItem != null && isNew == false) {
            this.procedenciaFormularioTemp = dataItem;
            this.formProcedenciaFormulario.patchValue(this.procedenciaFormularioTemp);
            this.obtenerTipoInteraccion(dataItem.id);
        }
        this.modalRefProcedenciaFormulario = this.modalService.open(this.modalProcedenciaFormulario);
    };
    ProcedenciaFormularioComponent.prototype.abrirModalVerDatos = function (data) {
        this.procedenciaFormularioTemp = data;
        this.modalService.open(this.modalVerProcedenciaFormulario);
    };
    /**
       * Procesa las operaciones de insertar , agregar,editar,elimina,refrescar
       * @autor Margiory Ramirez
       */
    ProcedenciaFormularioComponent.prototype.gridEventsProcedenciaFormulario = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.abrirModalFormularioProcedencia(false, e.dataItem, e.index);
                break;
            case 'add':
                this.abrirModalFormularioProcedencia(true, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e);
                break;
            case 'ver':
                this.abrirModalVerDatos(e.dataItem);
                break;
            case 'reload':
                this.obtenerProcedenciaFormulario();
                break;
            case 'verTipoInteraccion':
                this.obtenerTipoInteraccion(e.dataItem.id);
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalProcedenciaFormulario')
    ], ProcedenciaFormularioComponent.prototype, "modalProcedenciaFormulario");
    __decorate([
        core_1.ViewChild('modalVerProcedenciaFormulario')
    ], ProcedenciaFormularioComponent.prototype, "modalVerProcedenciaFormulario");
    ProcedenciaFormularioComponent = __decorate([
        core_1.Component({
            selector: 'app-procedencia-formulario',
            templateUrl: './procedencia-formulario.component.html',
            styleUrls: ['./procedencia-formulario.component.scss']
        })
    ], ProcedenciaFormularioComponent);
    return ProcedenciaFormularioComponent;
}());
exports.ProcedenciaFormularioComponent = ProcedenciaFormularioComponent;

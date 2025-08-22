"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PaisComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var text_validator_1 = require("@shared/validators/text.validator");
var constApi_1 = require("@environments/constApi");
var sweetalert2_1 = require("sweetalert2");
var grid_pais_1 = require("./grid-pais");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
var PaisComponent = /** @class */ (function () {
    function PaisComponent(integraService, formBuilder, modalService) {
        this.integraService = integraService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.usuario = JSON.parse(localStorage.getItem('userData'));
        //this.usuario.userName
        //this.usuario.areaTrabajo
        //this.usuario.idRol
        //this.usuario.idPersonal
        this.successIcon = iconInputValidation;
        /**
         * Variables
         * */
        this.formPais = this.formBuilder.group({
            id: [0],
            codigoPais: ['', [forms_1.Validators.required, forms_1.Validators.min(1)]],
            codigoIso: ['', forms_1.Validators.required],
            nombrePais: [
                '',
                [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ],
            ],
            moneda: ['', forms_1.Validators.required],
            zonaHoraria: ['', [forms_1.Validators.required, forms_1.Validators.min(1)]],
            estadoPublicacion: ['', [forms_1.Validators.required, forms_1.Validators.min(1)]],
            fileBandera: null,
            fileIcono: null
        });
        this.loaderGrid = false;
        this.loaderModal = false;
        this.isNew = false;
        this.listaPais = [];
        this.gridPais = new grid_pais_1.GridPais();
        this.paisIcono = "https://upload.wikimedia.org/wikipedia/commons/c/cf/Flag_of_Peru.svg";
        this.showFileBandera = false;
        this.showFileIcono = false;
        this.showNameBandera = false;
        this.showNameIcono = false;
    }
    //Acciones
    PaisComponent.prototype.ngOnInit = function () {
        this.obtenerPais();
    };
    /**
     * @description Funciones de validacion
     * @autor Margiory Ramirez
     * @param {string} controlName
     */
    PaisComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formPais.get(controlName);
        return (!this.getValidControl(controlName) &&
            formControl.value != null &&
            formControl.value != '');
    };
    PaisComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formPais.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    PaisComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            codigoPais: {
                required: 'Codigo Pais es obligatorio',
                min: 'El Valor de Codigo no es valido'
            },
            codigoIso: { required: 'Ingrese Codigo Iso' },
            nombrePais: {
                required: 'Ingrese Nombre de Pais',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            moneda: { required: 'Ingrese Moneda' },
            zonaHoraria: {
                required: 'Zona Horaria es obligatorio',
                min: 'El Valor de Zona Horaria no es valido'
            },
            estadoPublicacion: {
                required: 'Estado Publicacion es obligatorio',
                min: 'El Valor de Estado Publicacion no es valido'
            }
        };
        var formControl = this.formPais.get(controlName);
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
    PaisComponent.prototype.validFormPais = function () {
        if (this.formPais.invalid) {
            this.formPais.markAllAsTouched();
            return false;
        }
        return true;
    };
    /**
     * Obtiene lista general  de pais en la grilla principal
     * @autor Margiory Ramirez
     */
    PaisComponent.prototype.obtenerPais = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService.obtenerTodo(constApi_1.constApiGlobal.PaisObtenerPais).subscribe({
            next: function (response) {
                _this.listaPais = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    PaisComponent.prototype.registrarCambiosPais = function (isNew) {
        var _this = this;
        if (this.validFormPais()) {
            // this.modalRefTCOrigen.close('submitted');
            this.loaderModal = true;
            var datosFormulario_1 = this.formPais.getRawValue();
            this.integraService
                .obtener(constApi_1.constApiGlobal.PaisObtenerRutaUrlBlockStoragePais)
                .subscribe({
                next: function (response) {
                    console.log(response.body.rutaBandera.rutaCompleta);
                    var rutaBanderaCompleta = response.body.rutaBandera.rutaCompleta;
                    var rutaBanderaBlob = response.body.rutaBandera.rutaBlob;
                    var rutaIconoCompleta = response.body.rutaIcono.rutaCompleta;
                    var rutaIconoBlob = response.body.rutaIcono.rutaBlob;
                    var formData = new FormData();
                    formData.append('id', isNew ? 0 : datosFormulario_1.id);
                    formData.append('codigoPais', datosFormulario_1.codigoPais);
                    formData.append('codigoIso', datosFormulario_1.codigoIso);
                    formData.append('nombrePais', datosFormulario_1.nombrePais);
                    formData.append('moneda', datosFormulario_1.moneda);
                    formData.append('zonaHoraria', datosFormulario_1.zonaHoraria);
                    formData.append('estadoPublicacion', datosFormulario_1.estadoPublicacion);
                    formData.append('RutaCompletaBandera', rutaBanderaCompleta);
                    formData.append('RutaBlobBandera', rutaBanderaBlob);
                    formData.append('RutaCompletaIcono', rutaIconoCompleta);
                    formData.append('RutaBlobIcono', rutaIconoBlob);
                    if (datosFormulario_1.fileBandera != null && datosFormulario_1.fileBandera.length > 0)
                        formData.append('Bandera', datosFormulario_1.fileBandera[0]);
                    if (datosFormulario_1.fileIcono != null && datosFormulario_1.fileIcono.length > 0)
                        formData.append('Icono', datosFormulario_1.fileIcono[0]);
                    formData.append('usuario', _this.usuario.userName);
                    _this.integraService
                        .insertarFormData2(constApi_1.constApiGlobal.PaisRegistrarPais, formData)
                        .subscribe({
                        next: function (response) {
                            console.log(response);
                            if (isNew) {
                                _this.listaPais.unshift(response);
                            }
                            else {
                                _this.paisTem = response;
                            }
                            _this.obtenerPais();
                            _this.loaderModal = false;
                        },
                        error: function (error) {
                            _this.loaderModal = false;
                            _this.mostrarMensajeError(error);
                            console.log(error);
                        },
                        complete: function () {
                            _this.modalRefTCOrigen.close('submitted');
                            _this.mostrarMensajeExitoso();
                        }
                    });
                }
            });
        }
        else
            this.formPais.markAllAsTouched();
    };
    PaisComponent.prototype.toggleFileBandera = function () {
        this.showFileBandera = !this.showFileBandera;
        if (!this.showFileBandera) {
            this.formPais.get('fileBandera').setValue(null);
        }
    };
    PaisComponent.prototype.toggleFileIcono = function () {
        this.showFileIcono = !this.showFileIcono;
        if (!this.showFileIcono) {
            this.formPais.get('fileIcono').setValue(null);
        }
    };
    /**
       * @description Actualiza el  objeto   de Pais
       * @autor Margiory Ramirez
       */
    PaisComponent.prototype.actulizarPaises = function () {
        var _this = this;
        if (this.validFormPais()) {
            this.loaderModal = true;
            var paises_1 = Object.assign(this.paisTem, this.formPais.getRawValue());
            var paisEnvio = this.procesarDataPais(paises_1, false);
            this.integraService
                .actualizar(constApi_1.constApiGlobal.PaisActualizar, paisEnvio)
                .subscribe({
                next: function (response) {
                    _this.paisTem = _this.setDataPais(paises_1, response.body);
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
            this.formPais.markAllAsTouched();
    };
    /**
       * @description Elimina  el  objeto  de Pais en la grilla principal por Id
       * @autor Margiory Ramirez
       */
    PaisComponent.prototype.eliminarPais = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiGlobal.PaisEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if (response.body == true) {
                    _this.listaPais.splice(index, 1);
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
     * Proceso insercion de ruta en el repositorio  para guardar la ruta url
     * @autor Margiory Ramirez
     */
    PaisComponent.prototype.guardaRutaBandera = function () {
        var rutaBandera = '';
        console.log(this.formPais.getRawValue());
        var dataFormulario = this.formPais.getRawValue();
        this.integraService.obtenerTodo(constApi_1.constApiGlobal.PaisObtenerPais).subscribe({
            next: function (response) {
                console.log(response.body);
                rutaBandera = response.body[0].rutaBandera.replace(/%20/g, ' ');
                rutaBandera =
                    'https://repositorioweb.blob.core.windows.net/repositorioweb/flags/';
                // let rutaBanderaBlob = 'repositorioweb/flags/'
                //let rutaIconoCompleta = 'https://repositorioweb.blob.core.windows.net/repositorioweb/FlagIcons/'
                //let rutaIconoBlob = 'repositorioweb/FlagIcons/'
            }
        });
    };
    /**
      * Despliega de notificacion en validacion
      * @autor Margiory Ramirez
      */
    PaisComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    PaisComponent.prototype.mostrarMensajeExitoso = function () {
        this.loaderGrid = false;
        var Toast = sweetalert2_1["default"].mixin({
            toast: true,
            target: '#content-drawer-component',
            customClass: {
                container: 'position-absolute'
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
        Toast.fire({
            icon: 'success',
            title: 'Guardado con exito'
        });
    };
    PaisComponent.prototype.mostrarMensajeEliminar = function (param) {
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
                _this.eliminarPais(param.dataItem, param.index);
            }
        });
    };
    /**
   * Obtiene la plantilla delo formulario Pais  cuando es nuevo
   * @autor Margiory Ramirez
   */
    PaisComponent.prototype.abrirModalPais = function (isNew, dataItem, index) {
        this.loaderModal = false;
        this.formPais.reset();
        this.isNew = isNew;
        if (!this.isNew) {
            this.paisTem = dataItem;
            this.showNameBandera = true;
            this.showNameIcono = true;
            this.showFileBandera = false;
            this.showFileIcono = false;
            this.formPais.patchValue(this.paisTem);
        }
        else {
            this.showNameBandera = false;
            this.showNameIcono = false;
            this.showFileBandera = true;
            this.showFileIcono = true;
        }
        this.modalRefTCOrigen = this.modalService.open(this.modalPaises);
    };
    PaisComponent.prototype.extraerNombreArchivoUrl = function (url, tipo) {
        if (url != null) {
            var index = url.lastIndexOf('/') + 1;
            return url.substring(index);
        }
        else {
            if (tipo == 'bandera') {
                this.showNameBandera = false;
                this.showFileBandera = true;
            }
            else if (tipo == 'icono') {
                this.showFileIcono = true;
                this.showNameIcono = false;
            }
            return '';
        }
    };
    PaisComponent.prototype.setDataPais = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.codigoPais = item.codigoPais;
            item.codigoIso = item.codigoIso;
            item.nombrePais = item.nombrePais;
            item.moneda = item.moneda;
            item.zonaHoraria = item.zonaHoraria;
            (item.estadoPublicacion = item.estadoPublicacion),
                (item.estado = itemValue.estado),
                (item.rutaBandera = itemValue.rutaBandera),
                (item.usuarioCreacion = item.usuarioCreacion);
            item.usuarioModificacion = item.usuarioModificacion;
            item.fechaCreacion = item.fechaCreacion;
            item.fechaModificacion = item.fechaModificacion;
        }
        return item;
    };
    PaisComponent.prototype.procesarDataPais = function (dataItem, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        //let fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
        var fechaModificacion = fechaActual;
        var paisEnvio = {
            id: isNew ? 0 : dataItem.id,
            codigoPais: dataItem.codigoPais,
            codigoIso: dataItem.codigoIso,
            nombrePais: dataItem.nombrePais,
            moneda: dataItem.moneda,
            zonaHoraria: dataItem.zonaHoraria,
            estadoPublicacion: dataItem.estadoPublicacion,
            estado: true,
            rutaBandera: dataItem.rutaBandera,
            usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
            usuarioModificacion: this.usuario.userName,
            fechaCreacion: fechaActual,
            fechaModificacion: fechaActual
        };
        return paisEnvio;
    };
    /**
    * Procesa las operaciones de insertar , agregar,editar,eliminar,refrescar
    * @autor Margiory Ramirez
    */
    PaisComponent.prototype.gridEventsPais = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.paisIcono = e.dataItem.rutaBandera;
                console.log();
                this.abrirModalPais(e.isNew, e.dataItem, e.index);
                break;
            case 'add':
                this.abrirModalPais(e.isNew, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e);
                break;
            case 'reload':
                this.obtenerPais();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalPaises')
    ], PaisComponent.prototype, "modalPaises");
    PaisComponent = __decorate([
        core_1.Component({
            selector: 'app-pais',
            templateUrl: './pais.component.html',
            styleUrls: ['./pais.component.scss']
        })
    ], PaisComponent);
    return PaisComponent;
}());
exports.PaisComponent = PaisComponent;

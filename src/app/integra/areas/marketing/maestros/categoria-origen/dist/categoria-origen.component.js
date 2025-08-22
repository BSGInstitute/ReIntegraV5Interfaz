"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CategoriaOrigenComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var text_validator_1 = require("@shared/validators/text.validator");
var grid_categoria_origen_1 = require("./grid-categoria-origen");
var sweetalert2_1 = require("sweetalert2");
var constApi_1 = require("@environments/constApi");
var pipe = new common_1.DatePipe('en-US');
var formatoFecha = 'yyyy-MM-ddTHH:mm:ss';
var iconInputValidation = 'k-input-validation-icon k-icon k-i-check text-valid-success';
/**
 * @module MarketingModule
 * @description Componente de Modulo Maestro ,Creacion de Categoria Origen
 * @author Margiory Ramirez Neyra
 * @version 1.0.1
 * @history
 * * 07/08/2022 Creacion de interfaces decategoria Origen, implementacion nuevos registros
 */
var CategoriaOrigenComponent = /** @class */ (function () {
    function CategoriaOrigenComponent(integraService, formBuilder, modalService) {
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
        this.formCategoriaOrigen = this.formBuilder.group({
            id: [0],
            nombre: ['', [
                    forms_1.Validators.required,
                    text_validator_1.TextValidator.noStartSpace,
                    text_validator_1.TextValidator.noEndSpace,
                ]],
            descripcion: ['', forms_1.Validators.required],
            meta: ['', [forms_1.Validators.required, forms_1.Validators.min(1)]],
            idTipoDato: ['', [forms_1.Validators.required]],
            idTipoCategoriaOrigen: ['', [forms_1.Validators.required]],
            idProveedorCampaniaIntegra: ['', [forms_1.Validators.required]],
            considerar: [true],
            codigoOrigen: ['', [forms_1.Validators.required]],
            idFormularioProcedencia: ['', [forms_1.Validators.required]]
            // oportunidadMaxima: '',
            // estado: '',
            // usuarioModificacion: '',
            // fechaModificacion: '',
            // usuarioCreacion: '',
            // fechaCreacion: '',
        });
        this.loaderGrid = false; //GRID SPINNER
        this.loaderModal = false; //MODAL SPINNER
        this.isNew = false;
        this.listaCategoriaOrigen = [];
        this.filtrosCategoriaOrigen = {
            filtroTipoDato: [],
            filtroProveedorCampania: [],
            filtroTipoInteraccion: [],
            filtroProcedenciaformulario: [],
            filtroTipoCategoriaOrigen: [],
            filtroTipoCategoriaOrigenTodo: []
        };
        this.gridCategoriaOrigen = new grid_categoria_origen_1.GridCategoriaOrigen();
        this.tipoInteraccionPorFormulario = [];
    }
    CategoriaOrigenComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.obtenerCategoriaOrigen();
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.CategoriaOrigenObtenerFiltros)
            .subscribe({
            next: function (response) {
                console.log(response.body);
                _this.filtrosCategoriaOrigen = response.body;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    CategoriaOrigenComponent.prototype.getShowSuccessIcon = function (controlName) {
        var formControl = this.formCategoriaOrigen.get(controlName);
        return !this.getValidControl(controlName) && formControl.value != null && formControl.value != '';
    };
    CategoriaOrigenComponent.prototype.getValidControl = function (controlName) {
        var formControl = this.formCategoriaOrigen.get(controlName);
        if (formControl.invalid && (formControl.dirty || formControl.touched)) {
            return true;
        }
        return false;
    };
    CategoriaOrigenComponent.prototype.selectionChangeFormulario = function (event) {
        // this.tipoInteraccionPorFormulario = [];
        // this.tipoInteraccionPorFormulario = this.filtrosCategoriaOrigen.filtroTipoInteraccion.filter((x: any)=>x.id==event.id)
    };
    CategoriaOrigenComponent.prototype.cargarTipoInteraccion = function (event) {
        this.tipoInteraccionPorFormulario = [];
        this.tipoInteraccionPorFormulario = this.filtrosCategoriaOrigen.filtroTipoInteraccion.filter(function (x) { return x.id == event; });
    };
    CategoriaOrigenComponent.prototype.getErrorMessage = function (controlName) {
        var erroMsj = {
            nombre: {
                required: 'Ingrese Nombre de  Categoria Origen',
                noStartSpace: 'El Nombre no puede empezar con espacio',
                noEndSpace: 'El Nombre no puede terminar con espacio'
            },
            descripcion: { required: 'Ingrese una descripcion' },
            meta: {
                required: 'Meta es obligatorio',
                min: 'El Valor de Meta no es valido'
            },
            idTipoDato: {
                required: 'Tipo de Dato es obligatorio'
            },
            idTipoCategoriaOrigen: {
                required: 'Tipo Categoria Origen es obligatorio'
            },
            idProveedorCampaniaIntegra: {
                required: 'Proveedor Campaña es obligatorio'
            },
            codigoOrigen: {
                required: 'Codigo Origen es obligatorio'
            },
            idFormularioProcedencia: {
                required: 'Formulario Procedencia es obligatorio'
            }
        };
        var formControl = this.formCategoriaOrigen.get(controlName);
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
    CategoriaOrigenComponent.prototype.validFormCategoriaOrigen = function () {
        if (this.formCategoriaOrigen.invalid) {
            this.formCategoriaOrigen.markAllAsTouched();
            return false;
        }
        return true;
    };
    /**
   * Funciones CRUD Cabecera-
   * */
    CategoriaOrigenComponent.prototype.setDataCategoriaOrigen = function (item, itemValue) {
        if (itemValue != null) {
            item.id = itemValue.id;
            item.nombre = itemValue.nombre;
            item.descripcion = itemValue.descripcion;
            item.idTipoDato = itemValue.idTipoDato;
            item.idTipoCategoriaOrigen = itemValue.idTipoCategoriaOrigen;
            item.meta = itemValue.meta;
            item.idProveedorCampaniaIntegra = itemValue.idProveedorCampaniaIntegra;
            item.idFormularioProcedencia = itemValue.idFormularioProcedencia;
            item.considerar = itemValue.considerar;
            item.codigoOrigen = itemValue.codigoOrigen;
            item.estado = itemValue.estado;
            item.usuarioCreacion = itemValue.usuarioCreacion;
            item.usuarioModificacion = itemValue.usuarioModificacion;
            item.fechaCreacion = itemValue.fechaCreacion;
            item.fechaModificacion = itemValue.fechaModificacion;
            item.codigoPublicidad = itemValue.codigoPublicidad;
        }
        return item;
    };
    CategoriaOrigenComponent.prototype.procesarDataCategoriaOrigen = function (dataItem, isNew) {
        var fechaActual = pipe.transform(new Date(), formatoFecha);
        var fechaCreacion = isNew ? fechaActual : pipe.transform(dataItem.fechaCreacion, formatoFecha);
        var fechaModificacion = fechaActual;
        var CategoriaOrigenEnvio = {
            id: isNew ? 0 : dataItem.id,
            nombre: dataItem.nombre,
            descripcion: dataItem.descripcion,
            idTipoDato: dataItem.idTipoDato,
            idTipoCategoriaOrigen: dataItem.idTipoCategoriaOrigen,
            meta: dataItem.meta,
            idProveedorCampaniaIntegra: dataItem.idProveedorCampaniaIntegra,
            idFormularioProcedencia: dataItem.idFormularioProcedencia,
            considerar: dataItem.considerar,
            codigoOrigen: dataItem.codigoOrigen,
            fechaCreacion: fechaCreacion,
            fechaModificacion: fechaModificacion,
            estado: true,
            usuarioCreacion: isNew ? this.usuario.userName : dataItem.usuarioCreacion,
            usuarioModificacion: this.usuario.userName,
            codigoPublicidad: dataItem.codigoPublicidad
        };
        return CategoriaOrigenEnvio;
    };
    CategoriaOrigenComponent.prototype.obtenerCategoriaOrigen = function () {
        var _this = this;
        this.loaderGrid = true;
        this.integraService
            .obtenerTodo(constApi_1.constApiMarketing.CategoriaOrigenObtenerCategoriaOrigen)
            .subscribe({
            next: function (response) {
                _this.listaCategoriaOrigen = response.body;
                _this.loaderGrid = false;
            },
            error: function (error) {
                _this.mostrarMensajeError(error);
            },
            complete: function () { }
        });
    };
    CategoriaOrigenComponent.prototype.crearCategoriaOrigen = function () {
        var _this = this;
        if (this.validFormCategoriaOrigen()) {
            // this.modalRefTCOrigen.close('submitted');
            this.loaderModal = true;
            var datosFormulario = this.formCategoriaOrigen.getRawValue();
            var CategoriaOrigen_1 = Object.assign({}, datosFormulario);
            var CategoriaOrigenEnvio_1;
            CategoriaOrigenEnvio_1 = this.procesarDataCategoriaOrigen(CategoriaOrigen_1, true);
            this.integraService
                .insertar(constApi_1.constApiMarketing.CategoriaOrigenInsertar, CategoriaOrigenEnvio_1)
                .subscribe({
                next: function (response) {
                    CategoriaOrigen_1 = _this.setDataCategoriaOrigen(CategoriaOrigen_1, response.body);
                    _this.listaCategoriaOrigen.unshift(CategoriaOrigen_1);
                    // this.listaGruposCategoriaOrigen = this.listaGruposCategoriaOrigen.slice();
                    // this.listaGruposCategoriaOrigen.push(response.body); //insetar
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
            this.formCategoriaOrigen.markAllAsTouched();
    };
    /**
       * @description Actualiza el  objeto  de Categoria Origen
       * @autor Margiory Ramirez
       */
    CategoriaOrigenComponent.prototype.actualizarCategoriaOrigen = function () {
        var _this = this;
        if (this.validFormCategoriaOrigen()) {
            ;
            this.loaderModal = true;
            var CategoriaOrigen_2 = Object.assign(this.categoriaOrigenTemp, this.formCategoriaOrigen.getRawValue());
            var CategoriaOrigenEnvio_2 = this.procesarDataCategoriaOrigen(CategoriaOrigen_2, false);
            this.integraService
                .actualizar(constApi_1.constApiMarketing.CategoriaOrigenActualizar, CategoriaOrigenEnvio_2)
                .subscribe({
                next: function (response) {
                    _this.categoriaOrigenTemp = _this.setDataCategoriaOrigen(CategoriaOrigen_2, response.body);
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
            this.formCategoriaOrigen.markAllAsTouched();
    };
    /**
       * @description Elimina el  objeto  de Categoria Origen
       * @autor Margiory Ramirez
       */
    CategoriaOrigenComponent.prototype.eliminarCategoriaOrigen = function (dataItem, index) {
        var _this = this;
        this.loaderGrid = true;
        var params = [
            { clave: 'id', valor: dataItem.id },
            { clave: 'usuario', valor: this.usuario.userName },
        ];
        this.integraService
            .eliminarPorPathParams(constApi_1.constApiMarketing.CategoriaOrigenEliminar, params)
            .subscribe({
            next: function (response) {
                _this.loaderGrid = false;
                if ((response.body == true)) {
                    _this.listaCategoriaOrigen.splice(index, 1);
                    //this.listaCategoriaOrigen = this.listaCategoriaOrigen.slice();
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
    CategoriaOrigenComponent.prototype.mostrarMensajeError = function (error) {
        this.loaderGrid = false;
        sweetalert2_1["default"].fire({
            icon: 'error',
            html: "<p class=\"text-start\">" + error.error + "</p>\n            <p class=\"text-start text-danger fs-6\">" + error.message + "</p>",
            allowOutsideClick: false
        });
    };
    CategoriaOrigenComponent.prototype.mostrarMensajeExitoso = function () {
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
    CategoriaOrigenComponent.prototype.mostrarMensajeEliminar = function (param) {
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
                _this.eliminarCategoriaOrigen(param.dataItem, param.index);
            }
        });
    };
    /**
      * Despliega modal para registro de datos
      * @autor Margiory Ramirez
      */
    CategoriaOrigenComponent.prototype.abrirModalCategoriaOrigen = function (isNew, dataItem, index) {
        this.loaderModal = false;
        this.formCategoriaOrigen.reset();
        this.formCategoriaOrigen.get('considerar').setValue(true);
        this.tipoInteraccionPorFormulario = [];
        this.isNew = isNew;
        if (dataItem != null) {
            this.categoriaOrigenTemp = dataItem;
            this.formCategoriaOrigen.patchValue(this.categoriaOrigenTemp);
            this.cargarTipoInteraccion(dataItem.idFormularioProcedencia);
        }
        this.modalRefTCOrigen = this.modalService.open(this.modalCategoriaOrigen);
    };
    /**
    * Obtiene los filtros de categoria Origen por id de cada campo
    * @autor Margiory Ramirez Neyra
    */
    CategoriaOrigenComponent.prototype.obtenerNombrePorIdFiltro = function (id, field) {
        var filtro = [];
        switch (field) {
            case 'idTipoDato':
                filtro = this.filtrosCategoriaOrigen.filtroTipoDato;
                break;
            case 'idTipoCategoriaOrigen':
                filtro = this.filtrosCategoriaOrigen.filtroTipoCategoriaOrigen;
                break;
            case 'idProveedorCampaniaIntegra':
                filtro = this.filtrosCategoriaOrigen.filtroProveedorCampania;
                break;
        }
        if (id != null) {
            var dataTipoData = filtro.find(function (e) { return e.id == id; });
            return (dataTipoData != null) ? dataTipoData.nombre : '';
        }
        else {
            return '';
        }
    };
    /**
    * Procesa las operaciones de insertar , agregar,editar,elimina,reFrescar
    * @autor Margiory Ramirez
    */
    CategoriaOrigenComponent.prototype.gridEventsCategoriaOrigen = function (e) {
        console.log(e);
        switch (e.action) {
            case 'edit':
                this.abrirModalCategoriaOrigen(e.isNew, e.dataItem, e.index);
                break;
            case 'add':
                this.abrirModalCategoriaOrigen(e.isNew, e);
                break;
            case 'remove':
                this.mostrarMensajeEliminar(e);
                break;
            case 'reload':
                this.obtenerCategoriaOrigen();
                break;
        }
    };
    __decorate([
        core_1.ViewChild('modalCategoriaOrigen')
    ], CategoriaOrigenComponent.prototype, "modalCategoriaOrigen");
    __decorate([
        core_1.ViewChild('modalVerCategoriaOrigen')
    ], CategoriaOrigenComponent.prototype, "modalVerCategoriaOrigen");
    CategoriaOrigenComponent = __decorate([
        core_1.Component({
            selector: 'app-categoria-origen',
            templateUrl: './categoria-origen.component.html',
            styleUrls: ['./categoria-origen.component.scss']
        })
    ], CategoriaOrigenComponent);
    return CategoriaOrigenComponent;
}());
exports.CategoriaOrigenComponent = CategoriaOrigenComponent;

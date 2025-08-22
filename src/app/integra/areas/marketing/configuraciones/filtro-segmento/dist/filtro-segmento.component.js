"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FiltroSegmentoComponent = void 0;
var core_1 = require("@angular/core");
var nuevo_filtro_segmento_component_1 = require("./nuevo-filtro-segmento/nuevo-filtro-segmento.component");
var resultados_filtro_segmento_component_1 = require("./resultados-filtro-segmento/resultados-filtro-segmento.component");
var constApi_1 = require("@environments/constApi");
var paginator_1 = require("@angular/material/paginator");
var sort_1 = require("@angular/material/sort");
var sweetalert2_1 = require("sweetalert2");
var FiltroSegmentoComponent = /** @class */ (function () {
    function FiltroSegmentoComponent(integraService, integraReplicaService, formBuilder, modalService, alertaService, dialog, http) {
        this.integraService = integraService;
        this.integraReplicaService = integraReplicaService;
        this.formBuilder = formBuilder;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this.dialog = dialog;
        this.http = http;
        this.displayedColumns = [
            'nombre',
            'tipoContacto',
            'filtroEjecutado',
            'fechaCreacion',
            'fechaModificacion',
            'usuarioCreacion',
            'usuarioModificacion',
            'acciones',
        ];
        this.Lengt = 0;
        this.idFiltroSegmentoFuncion = 0;
        this.actualizar = 0;
    }
    FiltroSegmentoComponent.prototype.ngOnInit = function () {
        this.obtenerTipoContacto();
        this.obtenerFiltroSegmento();
        this.obtenerUsuario();
    };
    //--- Obtener Usuario ---/
    FiltroSegmentoComponent.prototype.obtenerUsuario = function () {
        var _this = this;
        this.loading = true;
        this.integraService.obtener(constApi_1.constApiMarketing.UsuarioLogeado).subscribe({
            next: function (response) {
                console.log(response.body);
                _this.usuarioLog = response.body.usuario;
                console.log(_this.usuarioLog);
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    FiltroSegmentoComponent.prototype.abrirModal = function (validar) {
        var _this = this;
        if ((this.contacto == null || this.contacto == 0) && validar == true) {
            this.alertaService.mensajeIcon('Debe Elegir un tipo de contacto', 'Seleccione un tipo para continuar', 'error');
        }
        else {
            var crear = 'crear';
            var dialogRef = this.dialog.open(nuevo_filtro_segmento_component_1.NuevoFiltroSegmentoComponent, {
                width: '1450px',
                maxHeight: '90vh',
                panelClass: 'dialog-gestor',
                data: [this.contacto, this.actualizar, this.idFiltroSegmentoFuncion],
                disableClose: true
            });
            dialogRef.afterClosed().subscribe(function (result) {
                _this.actualizar = 0;
                _this.idFiltroSegmentoFuncion = 0;
                _this.obtenerFiltroSegmento();
            });
        }
    };
    FiltroSegmentoComponent.prototype.ObservarModal = function (id, idFiltroSegmentoTipoContacto) {
        var _this = this;
        this.idFiltroSegmento = id;
        this.idFiltroSegmentoTipoContacto = idFiltroSegmentoTipoContacto;
        var dialogRef = this.dialog.open(resultados_filtro_segmento_component_1.ResultadosFiltroSegmentoComponent, {
            width: '1450px',
            maxHeight: '90vh',
            panelClass: 'dialog-gestor',
            data: [this.idFiltroSegmento, this.idFiltroSegmentoTipoContacto],
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result != undefined) {
                _this.obtenerFiltroSegmento();
            }
        });
    };
    //-----------------------Metodos Obtener----------------------------------//
    FiltroSegmentoComponent.prototype.obtenerTipoContacto = function () {
        var _this = this;
        this.loading = true;
        this.integraService
            .obtener(constApi_1.constApiMarketing.ObtenerFiltroSegmentoTipoContacto)
            .subscribe({
            next: function (response) {
                _this.loading = false;
                _this.listaContacto = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
            },
            complete: function () { }
        });
    };
    FiltroSegmentoComponent.prototype.Paginador = function (a) {
        this.current = a.pageIndex;
    };
    FiltroSegmentoComponent.prototype.obtenerFiltroSegmento = function () {
        var _this = this;
        this.loading = true;
        this.integraService
            .obtener(constApi_1.constApiMarketing.ObtenerFIltroSegmentoPanel)
            .subscribe({
            next: function (response) {
                _this.dataSourceEP = response.body;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
                _this.loading = false;
            },
            complete: function () {
                _this.loading = false;
            }
        });
    };
    FiltroSegmentoComponent.prototype.EjecutarFiltroSegmento = function (id) {
        var _this = this;
        this.loading = true;
        //this.integraReplicaService
        this.integraService
            .post(constApi_1.constApiMarketing.FiltroSegmentoEjecutar + '/' + id + '/' + this.usuarioLog)
            .subscribe({
            next: function (response) { },
            error: function (error) {
                _this.alertaService.mensajeError(error);
                _this.loading = false;
            },
            complete: function () {
                _this.loading = false;
                sweetalert2_1["default"].fire('Filtro!', 'El registro se esta filtrando, espere el correo de confirmaciòn.', 'success');
                _this.obtenerFiltroSegmento();
            }
        });
    };
    // EjecutarFiltroSegmento(id: number) {
    //   this.loading = true;
    //   const mtkur = `http://52.168.26.131:8084/api/FiltroSegmento/EjecutarFiltro/${id}/${this.usuarioLog}`;
    //   this.http.post(mtkur, {}).subscribe({
    //     next: (response) => {
    //       console.log('Respuesta recibida:', response);
    //       Swal.fire(
    //         'Filtro!',
    //         'El registro se está filtrando, espere el correo de confirmación.',
    //         'success'
    //       );
    //       this.obtenerFiltroSegmento();
    //     },
    //     error: (error) => {
    //       console.error("❌ Error en la petición:", error);
    //       this.alertaService.mensajeError(error);
    //     },
    //     complete: () => {
    //       this.loading = false;
    //     }
    //   });
    // }
    FiltroSegmentoComponent.prototype.EliminarFiltroSegmento = function (id) {
        var _this = this;
        this.alertaService.mensajeEliminar().then(function (result) {
            _this.loading = true;
            if (result.isConfirmed) {
                _this.integraService
                    .post(constApi_1.constApiMarketing.FiltroSegmentoEliminar + '/' + id)
                    .subscribe({
                    next: function (response) {
                        _this.loading = false;
                    },
                    error: function (error) {
                        _this.alertaService.mensajeError(error);
                        _this.loading = false;
                    },
                    complete: function () {
                        sweetalert2_1["default"].fire('¡Eliminado!', 'El registro ha sido eliminado.', 'success');
                        _this.obtenerFiltroSegmento();
                    }
                });
            }
        });
    };
    FiltroSegmentoComponent.prototype.DuplicarFiltroSegmento = function (id) {
        var _this = this;
        this.loading = true;
        this.integraService
            .post(constApi_1.constApiMarketing.FiltroSegmentoDuplicar + '/' + id)
            .subscribe({
            next: function (response) {
                _this.loading = false;
            },
            error: function (error) {
                _this.alertaService.mensajeError(error);
                _this.loading = false;
            },
            complete: function () {
                sweetalert2_1["default"].fire('¡Duplicado!', 'El registro ha sido duplicado.', 'success');
                _this.obtenerFiltroSegmento();
            }
        });
    };
    //---------------------CONTROL GRID ---------------------------------------------
    FiltroSegmentoComponent.prototype.gridEventsResponse = function (action, dataItem, rowIndex) {
        switch (action) {
            case 'observar':
                this.ObservarModal(dataItem.id, dataItem.idFiltroSegmentoTipoContacto);
                break;
            case 'ejecutar':
                this.EjecutarFiltroSegmento(dataItem.id);
                break;
            case 'editar':
                this.idFiltroSegmentoFuncion = dataItem.id;
                this.actualizar = 1;
                this.abrirModal(false);
                break;
            case 'eliminar':
                this.EliminarFiltroSegmento(dataItem.id);
                break;
            case 'duplicar':
                this.DuplicarFiltroSegmento(dataItem.id);
                break;
        }
    };
    __decorate([
        core_1.ViewChild(paginator_1.MatPaginator)
    ], FiltroSegmentoComponent.prototype, "paginator");
    __decorate([
        core_1.ViewChild(sort_1.MatSort)
    ], FiltroSegmentoComponent.prototype, "sort");
    FiltroSegmentoComponent = __decorate([
        core_1.Component({
            selector: 'app-filtro-segmento',
            templateUrl: './filtro-segmento.component.html',
            styleUrls: ['./filtro-segmento.component.scss']
        })
    ], FiltroSegmentoComponent);
    return FiltroSegmentoComponent;
}());
exports.FiltroSegmentoComponent = FiltroSegmentoComponent;

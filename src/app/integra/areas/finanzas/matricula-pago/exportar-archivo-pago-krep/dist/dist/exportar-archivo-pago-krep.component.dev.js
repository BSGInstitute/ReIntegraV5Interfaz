"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.ExportarArchivoPagoKrepComponent = void 0;

var core_1 = require("@angular/core");

var constApi_1 = require("@environments/constApi");

var kendo_grid_1 = require("@shared/models/kendo-grid");

var ExportarArchivoPagoKrepComponent =
/** @class */
function () {
  function ExportarArchivoPagoKrepComponent(integraService, formBuilder, modalService, alertaService, finanzasService) {
    this.integraService = integraService;
    this.formBuilder = formBuilder;
    this.modalService = modalService;
    this.alertaService = alertaService;
    this.finanzasService = finanzasService;
    this.gridExportarCrep = new kendo_grid_1.KendoGrid();
    this.listaAlumno = [];
    this.listaCodigoAlumno = [];
    this.listaPrograma = [];
    this.loaderTasas = false;
    this.loaderMatriculaFiltro = false;
    this.loaderGeneral = false;
    this.loaderModalTasa = false;
    this.sombra = true;
    this.nombreModalTasa = "";
    this.btnModalTasa = "";
    this.formMatriculaAlumno = this.formBuilder.group({
      codigoMat: null,
      alumno: null,
      idPrograma: null,
      asignacion: [2],
      estado: [1]
    });
    this.dataAsigancion = [{
      clave: 'Manual',
      valor: 1
    }, {
      clave: 'Automatica',
      valor: 2
    }];
    this.dataEstado = [{
      clave: 'Actualizar',
      valor: 1
    }, {
      clave: 'Eliminar',
      valor: 2
    }];
  }

  ExportarArchivoPagoKrepComponent.prototype.ngOnInit = function () {};

  ExportarArchivoPagoKrepComponent.prototype.ObtenerMatriculaAutoComplete = function (alumno) {
    var _this = this;

    this.integraService.postJsonResponse(constApi_1.constApiFinanzas.ObtenerCodigoMatricula, {
      valor: alumno
    }).subscribe({
      next: function next(response) {
        console.log("MAT-AUTOCOMPLETE", response);
        _this.listaCodigoAlumno = response.body;
      },
      error: function error(_error) {
        _this.finanzasService.MensajeDeError(_error, "autocomplete - matricula");
      },
      complete: function complete() {}
    });
  };

  ExportarArchivoPagoKrepComponent.prototype.ObtenerAlumnoAutoComplete = function (alumno) {
    var _this = this;

    this.integraService.postJsonResponse(constApi_1.constApiFinanzas.ObtenerAlumnoPorValor, {
      valor: alumno
    }).subscribe({
      next: function next(response) {
        _this.listaAlumno = response.body;
      },
      error: function error(_error2) {
        _this.finanzasService.MensajeDeError(_error2, "autocomplete - alumno");
      },
      complete: function complete() {}
    });
  };

  ExportarArchivoPagoKrepComponent.prototype.ObtenerProgramaespecifio = function (programa) {
    var _this = this;

    this.integraService.postJsonResponse(constApi_1.constApiFinanzas.ObtenerProgramaespecifioEspecificoAutocomplete, {
      valor: programa
    }).subscribe({
      next: function next(response) {
        _this.listaPrograma = response.body;
      },
      error: function error(_error3) {
        _this.finanzasService.MensajeDeError(_error3, "autocomplete - Programa");
      },
      complete: function complete() {}
    });
  };

  ExportarArchivoPagoKrepComponent.prototype.ObtenerAlumnoProgramaPorMatricula = function (codMat) {
    var _this = this;

    this.formMatriculaAlumno.get('alumno').reset();
    this.formMatriculaAlumno.get('idPrograma').reset();
    this.loaderMatriculaFiltro = true;
    this.integraService.getJsonResponse(constApi_1.constApiFinanzas.ObtenerAlumnoProgramaEspecifico + "/" + codMat).subscribe({
      next: function next(response) {
        if (response.body.length > 0) {
          _this.listaPrograma = [];

          _this.formMatriculaAlumno.get('idPrograma').setValue(response.body[0].idPEspecifico);

          _this.listaAlumno = [];

          _this.listaAlumno.push({
            id: response.body[0].idAlumno,
            nombreCompleto: response.body[0].nombreCompleto
          });

          _this.formMatriculaAlumno.get('alumno').setValue(response.body[0].idAlumno);
        }

        _this.listaPrograma = response.body;
        _this.loaderMatriculaFiltro = false;
      },
      error: function error(_error4) {
        _this.finanzasService.MensajeDeError(_error4, "obtener Programa - alumno");

        _this.loaderMatriculaFiltro = false;
      },
      complete: function complete() {}
    });
  };

  Object.defineProperty(ExportarArchivoPagoKrepComponent.prototype, "dataFormFiltro", {
    get: function get() {
      return this.formMatriculaAlumno.getRawValue();
    },
    enumerable: false,
    configurable: true
  });

  ExportarArchivoPagoKrepComponent.prototype.ObtenerListaMatriculaAlumno = function () {
    var _this = this;

    console.log('hola');
    this.gridExportarCrep.loading = true;
    var idPrograma = this.dataFormFiltro.idPrograma;
    var idAlumno = this.dataFormFiltro.alumno;
    var tipo = 0;
    var codigoMatricula = this.dataFormFiltro.codigoMat;

    if (idPrograma != null) {
      idPrograma = idPrograma;
      idAlumno = 0;
      tipo = 1;
    } else if (idAlumno != null) //alumno por alumno
      {
        idPrograma = 0;
        idAlumno = idAlumno;
        codigoMatricula = '';
        tipo = 2;
      } else if (codigoMatricula != null) {
      idPrograma = idPrograma;
      idAlumno = idAlumno;
      codigoMatricula = codigoMatricula;
      tipo = 3;
    }

    this.integraService.postJsonResponse(constApi_1.constApiFinanzas.CronogromaObtenerListadoAlumnosMatricula + "/" + idPrograma + "/" + idAlumno + "/" + tipo + "/" + codigoMatricula, null).subscribe({
      next: function next(response) {
        _this.gridExportarCrep.data = response.body;
        _this.gridExportarCrep.loading = false;
        console.log(response.body);
      },
      error: function error(_error5) {
        _this.alertaService.notificationError(_error5.error);
      },
      complete: function complete() {}
    });
  };

  ExportarArchivoPagoKrepComponent.prototype.CargarDataMatricula = function (event) {
    if (event.id.length >= 5) {
      this.ObtenerAlumnoProgramaPorMatricula(event.id);
    }
  };

  ExportarArchivoPagoKrepComponent.prototype.filterCodigoMat = function (event) {
    if (event.length >= 4) this.ObtenerMatriculaAutoComplete(event);else this.listaCodigoAlumno = [];
  };

  ExportarArchivoPagoKrepComponent.prototype.filterAlumno = function (event) {
    if (event.length >= 4) this.ObtenerAlumnoAutoComplete(event);else this.listaAlumno = [];
  };

  ExportarArchivoPagoKrepComponent.prototype.filterPrograma = function (event) {
    if (event.length >= 4) this.ObtenerProgramaespecifio(event);else this.listaPrograma = [];
  };

  ExportarArchivoPagoKrepComponent.prototype.cargarCodMat = function (event) {
    if (event.id != null) {
      this.formMatriculaAlumno.get('codigoMat').setValue(event.codigoMatricula);
    }
  };

  ExportarArchivoPagoKrepComponent = __decorate([core_1.Component({
    selector: 'app-exportar-archivo-pago-krep',
    templateUrl: './exportar-archivo-pago-krep.component.html',
    styleUrls: ['./exportar-archivo-pago-krep.component.scss']
  })], ExportarArchivoPagoKrepComponent);
  return ExportarArchivoPagoKrepComponent;
}();

exports.ExportarArchivoPagoKrepComponent = ExportarArchivoPagoKrepComponent;
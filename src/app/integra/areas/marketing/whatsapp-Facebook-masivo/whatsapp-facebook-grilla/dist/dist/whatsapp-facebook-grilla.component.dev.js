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
exports.WhatsappFacebookGrillaComponent = void 0;

var core_1 = require("@angular/core");

var constApi_1 = require("@environments/constApi");

var whatsapp_facebook_oportunidad_component_1 = require("../whatsapp-facebook-oportunidad/whatsapp-facebook-oportunidad.component");

var WhatsappFacebookGrillaComponent =
/** @class */
function () {
  function WhatsappFacebookGrillaComponent(integraService, formBuilder, alertaService, modalService, dialog) {
    this.integraService = integraService;
    this.formBuilder = formBuilder;
    this.alertaService = alertaService;
    this.modalService = modalService;
    this.dialog = dialog;
    this.grilla = [];
    this.selectedRowIndex = null;
    this.dias = [{
      Value: 0,
      View: 'Hoy'
    }, {
      Value: 1,
      View: 'Ayer'
    }, {
      Value: 2,
      View: 'Hace 2 días'
    }, {
      Value: 3,
      View: 'Hace 3 días'
    }, {
      Value: 4,
      View: 'Hace 4 días'
    }, {
      Value: 5,
      View: 'Hace 5 días'
    }, {
      Value: 6,
      View: 'Hace 6 días'
    }];

    this.rowCallback = function (context) {
      if (context.dataItem.tipo == 1) {
        return {
          gold: true
        };
      } else {
        return {
          green: true
        };
      }
    };

    this.diaDrop = this.dias[0];
  }

  WhatsappFacebookGrillaComponent.prototype.ngOnInit = function () {
    console.log(this.tab, this.dia);
    this.obtenerGrilla();
  };

  WhatsappFacebookGrillaComponent.prototype.obtenerGrilla = function () {
    var _this = this;

    this.integraService.getJsonResponse("" + (constApi_1.constApiMarketing.ObtenerWhatsappFacebookMasivo + '/' + this.tab + '/' + this.diaDrop.Value)).subscribe({
      next: function next(response) {
        _this.grilla = response.body;
        console.log(response.body);
      },
      error: function error(_error) {
        console.log(_error);
      }
    });
  };

  WhatsappFacebookGrillaComponent.prototype.verWhats = function (dataItem) {
    var _this = this;

    var dialogRef = this.dialog.open(whatsapp_facebook_oportunidad_component_1.WhatsappFacebookOportunidadComponent, {
      maxWidth: '90%',
      minWidth: '90%',
      maxHeight: '1900px',
      panelClass: 'dialog-gestor',
      data: [dataItem, false]
    });
    dialogRef.afterClosed().subscribe(function (result) {
      _this.obtenerGrilla();
    });
  };

  WhatsappFacebookGrillaComponent.prototype.selectionChange = function (e) {
    console.log(e);
    this.diaDrop = e;
    console.log(this.diaDrop);
    this.obtenerGrilla();
  };

  WhatsappFacebookGrillaComponent.prototype.Eliminar = function (data) {};

  __decorate([core_1.Input()], WhatsappFacebookGrillaComponent.prototype, "tab");

  __decorate([core_1.Input()], WhatsappFacebookGrillaComponent.prototype, "dia");

  WhatsappFacebookGrillaComponent = __decorate([core_1.Component({
    selector: 'app-whatsapp-facebook-grilla',
    templateUrl: './whatsapp-facebook-grilla.component.html',
    styleUrls: ['./whatsapp-facebook-grilla.component.scss'],
    encapsulation: core_1.ViewEncapsulation.None
  })], WhatsappFacebookGrillaComponent);
  return WhatsappFacebookGrillaComponent;
}();

exports.WhatsappFacebookGrillaComponent = WhatsappFacebookGrillaComponent;
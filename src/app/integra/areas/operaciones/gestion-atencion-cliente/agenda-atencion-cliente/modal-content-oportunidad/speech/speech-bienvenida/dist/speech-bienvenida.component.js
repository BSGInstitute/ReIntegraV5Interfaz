"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SpeechBienvenidaComponent = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var SpeechBienvenidaComponent = /** @class */ (function () {
    function SpeechBienvenidaComponent(formBuilder, crmService, modalService, alertaService, _sanitizer) {
        this.formBuilder = formBuilder;
        this.crmService = crmService;
        this.modalService = modalService;
        this.alertaService = alertaService;
        this._sanitizer = _sanitizer;
        this.speechBienvenida = null;
        this.subscriptions = new rxjs_1.Subscription();
    }
    SpeechBienvenidaComponent.prototype.ngOnInit = function () {
        this.cargarSpeechBienvenidaDespedida();
    };
    SpeechBienvenidaComponent.prototype.ngOnDestroy = function () {
        this.subscriptions.unsubscribe();
    };
    SpeechBienvenidaComponent.prototype.cargarSpeechBienvenidaDespedida = function () {
        var _this = this;
        console.log('cargarSpeechBienvenidaDespedida');
        this.speechBienvenida = 'Cargando speech...';
        var sub1$ = this.agendaService.agendaActividadesOperacionesService.speechBienvenidaDespedida$.subscribe({
            next: function (response) {
                if (response != null) {
                    var speechBienvenida = response.plantillaPorFase.filter(function (item) {
                        return response.speech.data.idPlantillaBienvenida == item.idPlantilla;
                    });
                    _this.agendaService.agendaValorEtiquetaOperacionesService.valoresEtiquetas();
                    var speech = _this.agendaService.agendaValorEtiquetaOperacionesService.cargarValoresEtiqueta(speechBienvenida);
                    if ((speech === null || speech === void 0 ? void 0 : speech.length) > 0) {
                        _this.speechBienvenida =
                            "<div style='margin-left:0px ;width: 80%;'class='col-md'>" +
                                speech[0].valor +
                                "</div><div><img src='https://integrav4.bsginstitute.com/Content/Img/muneco-speech-grande.png'  style='align-items: center;justify-content: center;display: flex;width: 180px;'></div>";
                        // this.speechBienvenida = speech[0].valor;
                    }
                    speech = [];
                }
            }
        });
        console.log('this.speechBienvenida', this.speechBienvenida);
        this.subscriptions.add(sub1$);
    };
    __decorate([
        core_1.Input()
    ], SpeechBienvenidaComponent.prototype, "agendaService");
    SpeechBienvenidaComponent = __decorate([
        core_1.Component({
            selector: 'app-speech-bienvenida',
            templateUrl: './speech-bienvenida.component.html',
            styleUrls: ['./speech-bienvenida.component.scss']
        })
    ], SpeechBienvenidaComponent);
    return SpeechBienvenidaComponent;
}());
exports.SpeechBienvenidaComponent = SpeechBienvenidaComponent;

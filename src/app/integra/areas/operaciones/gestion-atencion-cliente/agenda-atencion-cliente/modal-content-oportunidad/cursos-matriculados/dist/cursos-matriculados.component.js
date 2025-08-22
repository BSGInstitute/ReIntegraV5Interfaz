// "use strict";
// var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
//     var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
//     if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
//     else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
//     return c > 3 && r && Object.defineProperty(target, key, r), r;
// };
// exports.__esModule = true;
// exports.CursosMatriculadosComponent = void 0;
// var core_1 = require("@angular/core");
// var kendo_grid_1 = require("@shared/models/kendo-grid");
// var sweetalert2_1 = require("sweetalert2");
// var CursosMatriculadosComponent = /** @class */ (function () {
//     function CursosMatriculadosComponent() {
//         this.gridCursoMatriculado = new kendo_grid_1.KendoGrid();
//         this.esCoordinadora = true;
//     }
//     CursosMatriculadosComponent.prototype.ngOnInit = function () {
//         var _this = this;
//         this.agendaService.esCoordinadora$.subscribe(function (resp) { return (_this.esCoordinadora = resp); });
//         console.log('escordi', this.esCoordinadora);
//         this.agendaService.agendaInicializarOperacionesService.cursosMatriculados$.subscribe({
//             next: function (resp) {
//                 _this.gridCursoMatriculado.data = resp;
//                 console.log(_this.gridCursoMatriculado, 'cursosmatriculados');
//             }
//         });
//     };
//     CursosMatriculadosComponent.prototype.desmatricularCurso = function (dataItem) {
//         var _this = this;
//         sweetalert2_1["default"].fire({
//             text: "Desmatricular Curso",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonColor: '#3085d6',
//             cancelButtonColor: '#d33',
//             confirmButtonText: 'Eliminar'
//         }).then(function (result) {
//             if (result.isConfirmed) {
//                 _this.gridCursoMatriculado.loading = true;
//                 console.log(dataItem, 'desmatricular');
//                 _this.agendaService.agendaInicializarOperacionesService
//                     .desmatriculaAlumno$(dataItem.id)
//                     .subscribe({
//                     next: function (response) {
//                         if ((response.body = true)) {
//                             _this.notificacionEnvioExitoso();
//                             _this.agendaService.agendaInicializarOperacionesService.cargarCursosMatriculados();
//                             _this.gridCursoMatriculado.loading = false;
//                         }
//                     }
//                 });
//             }
//         });
//     };
//     CursosMatriculadosComponent.prototype.notificacionEnvioExitoso = function () {
//         var Toast = sweetalert2_1["default"].mixin({
//             toast: true,
//             position: 'top-end',
//             showConfirmButton: false,
//             timer: 3000,
//             timerProgressBar: true,
//             didOpen: function (toast) {
//                 toast.addEventListener('mouseenter', sweetalert2_1["default"].stopTimer);
//                 toast.addEventListener('mouseleave', sweetalert2_1["default"].resumeTimer);
//             }
//         });
//         Toast.fire({
//             icon: 'success',
//             title: 'Se Desmatriculo Con exito'
//         });
//     };
//     __decorate([
//         core_1.Input()
//     ], CursosMatriculadosComponent.prototype, "agendaService");
//     CursosMatriculadosComponent = __decorate([
//         core_1.Component({
//             selector: 'app-cursos-matriculados',
//             templateUrl: './cursos-matriculados.component.html',
//             styleUrls: ['./cursos-matriculados.component.scss']
//         })
//     ], CursosMatriculadosComponent);
//     return CursosMatriculadosComponent;
// }());
// exports.CursosMatriculadosComponent = CursosMatriculadosComponent;

import { KendoAngularModule } from '@modules/kendo-angular.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferenciaElementoDirective } from './directives/referencia-elemento.directive';
import { KTextBoxComponent } from './utils/k-text-box/k-text-box.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoaderComponent } from './components/loader/loader.component';
import { MenuComponent } from './components/menu/menu.component';
import { IniciarSesionComponent } from './components/cuenta/iniciar-sesion/iniciar-sesion.component';
import { RegistrarComponent } from './components/cuenta/registrar/registrar.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { KGridEditComponent } from './utils/k-grid-edit/k-grid-edit.component';
import { TabContentLoadOnDemanDirective } from './directives/tab-content-load-on-deman.directive';
import { InputValidSpaceDirective } from './directives/input-valid-space.directive';
import { KGridComponent } from './utils/k-grid/k-grid.component';
import { GridTemplateComponent } from './templates/grid-template/grid-template.component';
import { RatingComponent } from './templates/rating/rating.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TokenService } from './services/token.service';
import { AngularMaterialModule } from '@modules/angular-material.module';
import { ReproductorComponent } from './components/reproductor/reproductor.component';
import { KGridFilterMenuComponent } from './utils/k-grid-filter-menu/k-grid-filter-menu.component';
import { KLoadingComponent } from './utils/k-loading/k-loading.component';
import { SendinBlueService } from './services/sendin-blue.service';


import { KGridVerComponent } from './utils/k-grid-ver/k-grid-ver.component';
import { MenuPruebaComponent } from './components/menu-prueba/menu-prueba.component';
import { DropdownFilterDirective } from './directives/dropdown-filter.directive';
import { FichaAlumnoAgendaComponent } from './components/ficha-alumno-agenda/ficha-alumno-agenda.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { FichaAlumnoAgendaOperacionesComponent } from './components/ficha-alumno-agenda-operaciones/ficha-alumno-agenda-operaciones.component';
import { ModalComprobantePagComponent } from './components/modal-comprobante-pag/modal-comprobante-pag.component';
import { ModalPagosIvrComponent } from './components/modal-pagos-ivr/modal-pagos-ivr.component';
import { CustomDropDownListFilterComponent } from './utils/custom-drop-down-list-filter/custom-drop-down-list-filter.component';
import { SafeHtmlPipe } from './Pipes/safe-html.pipe';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ConfiguracionAgrupacionMatriculaComponent } from './components/configuracion-agrupacion-matricula/configuracion-agrupacion-matricula.component';
import { KwComentarioAgendaComponent } from './components/kw-comentario-agenda/kw-comentario-agenda.component';
import { UrlService } from './services/url.service';

@NgModule({
  declarations: [
    ReferenciaElementoDirective,
    FooterComponent,
    HeaderComponent,
    LoaderComponent,
    MenuComponent,
    IniciarSesionComponent,
    RegistrarComponent,
    KTextBoxComponent,
    KGridEditComponent,
    TabContentLoadOnDemanDirective,
    InputValidSpaceDirective,
    KGridComponent,
    GridTemplateComponent,
    RatingComponent,
    ReproductorComponent,
    KGridFilterMenuComponent,
    KLoadingComponent,
    KGridVerComponent,
    MenuPruebaComponent,
    DropdownFilterDirective,
    FichaAlumnoAgendaComponent,
    PageNotFoundComponent,
    FichaAlumnoAgendaOperacionesComponent,
    ModalComprobantePagComponent,
    ModalPagosIvrComponent
,    CustomDropDownListFilterComponent,
    SafeHtmlPipe,
    ConfiguracionAgrupacionMatriculaComponent,
    KwComentarioAgendaComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    FontAwesomeModule,
    CommonModule,
    KendoAngularModule,
    AngularMaterialModule,
    SweetAlert2Module.forRoot(),
    CKEditorModule
  ],
  providers:[
    TokenService,
    SendinBlueService,
    UrlService
  ],
  exports: [
    ReferenciaElementoDirective,
    KTextBoxComponent,
    KGridEditComponent,
    KGridVerComponent,
    FooterComponent,
    HeaderComponent,
    LoaderComponent,
    MenuComponent,
    IniciarSesionComponent,
    RegistrarComponent,
    TabContentLoadOnDemanDirective,
    InputValidSpaceDirective,
    KGridComponent,
    MatCheckboxModule,
    KLoadingComponent,
    MenuPruebaComponent,
    DropdownFilterDirective,
    FichaAlumnoAgendaComponent,
    FichaAlumnoAgendaOperacionesComponent,
    ModalComprobantePagComponent,
    ConfiguracionAgrupacionMatriculaComponent,
    ModalPagosIvrComponent,
    CustomDropDownListFilterComponent,
    SafeHtmlPipe,
    CKEditorModule,
    KwComentarioAgendaComponent
  ],
})
export class SharedModule {}

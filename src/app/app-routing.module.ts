import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrmComponent } from '@integra/softphone/crm/crm.component';
import { IniciarSesionComponent } from '@shared/components/cuenta/iniciar-sesion/iniciar-sesion.component';
import { GridTemplateComponent } from '@shared/templates/grid-template/grid-template.component';
import { AuthGuard } from './Auth/auth.guard';
import { LoginGuard } from './Auth/login.guard';
import { IntegraComponent } from '@integra/integra.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./integra/integra.module').then((m) => m.IntegraModule),
  },
  { path: 'template', component: GridTemplateComponent },
  {
    path: 'IniciarSesion',
    canActivate: [LoginGuard],
    component: IniciarSesionComponent,
  },
  { path: '**', component: IntegraComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

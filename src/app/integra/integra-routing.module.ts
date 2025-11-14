import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntegraComponent } from './integra.component';
import { ModuloGuard } from '../guards/modulo.guard';

const routes: Routes = [
  {
    path: '',
    component: IntegraComponent,
    children: [
      {
        path: 'Planificacion',
        canActivateChild: [ModuloGuard],
        loadChildren: () =>
          import('@integra/areas/planificacion/planificacion.module').then(
            (m) => m.PlanificacionModule
          ),
      },
      {
        path: 'GestionPersonas',
        canActivateChild: [ModuloGuard],
        loadChildren: () =>
          import(
            '@integra/areas/gestion-personas/gestion-personas.module'
          ).then((m) => m.GestionPersonasModule),
      },
      {
        path: 'Comercial',
        canActivateChild: [ModuloGuard],
        loadChildren: () =>
          import('@integra/areas/comercial/comercial.module').then(
            (m) => m.ComercialModule
          ),
      },
      {
        path: 'Marketing',
        // canActivateChild: [ModuloGuard],
        loadChildren: () =>
          import('@integra/areas/marketing/marketing.module').then(
            (m) => m.MarketingModule
          ),
      },
      {
        path: 'Finanzas',
        canActivateChild: [ModuloGuard],
        loadChildren: () =>
          import('@integra/areas/finanzas/finanzas.module').then(
            (m) => m.FinanzasModule
          ),
      },
      {
        path: 'Operaciones',
        canActivateChild: [ModuloGuard],
        loadChildren: () =>
          import('@integra/areas/operaciones/operaciones.module').then(
            (m) => m.OperacionesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntegraRoutingModule {}

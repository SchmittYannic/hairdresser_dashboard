import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/auth.guard';
import { SpinnerComponent } from 'app/shared/components/spinner';
import { RefreshDoneGuard } from 'app/auth/refresh-done.guard';
import { DashboardLayoutComponent } from 'app/layout/dashboard-layout/dashboard-layout.component';

const routes: Routes = [
  {
    path: '',
    component: SpinnerComponent
  },
  {
    path: 'signin',
    loadChildren: () =>
      import('./auth/auth.module').then(m => m.AuthModule),
    canActivate: [RefreshDoneGuard],
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    data: { breadcrumb: 'Dashboard' },
    canActivate: [AuthGuard],
    children: [
      {
        path: '', loadComponent: () =>
          import('./dashboard-pages/home/home.component').then(m => m.HomeComponent),
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'schedule', loadComponent: () =>
          import('./dashboard-pages/schedule/schedule.component').then(m => m.ScheduleComponent),
        data: { breadcrumb: 'Termine' },
      },
      {
        path: 'customers', loadComponent: () =>
          import('./dashboard-pages/customers/customers.component').then(m => m.CustomersComponent),
        data: { breadcrumb: 'Kunden' },
      },
    ]
  },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

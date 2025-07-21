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
        path: '',
        loadChildren: () =>
          import('./dashboard-pages/home/home.module').then(m => m.HomeModule),
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'schedule',
        loadChildren: () =>
          import('./dashboard-pages/schedule/schedule.module').then(m => m.ScheduleModule),
        data: { breadcrumb: 'Termine' },
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./dashboard-pages/users/users.component').then(m => m.UsersComponent),
        data: { breadcrumb: 'Nutzer' },
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

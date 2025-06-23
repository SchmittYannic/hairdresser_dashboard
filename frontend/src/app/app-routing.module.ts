import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/auth.guard';
import { SpinnerComponent } from 'app/shared/components/spinner';
import { RefreshDoneGuard } from './auth/refresh-done.guard';

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
    loadChildren: () =>
      import('./dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

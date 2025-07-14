import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleComponent } from './schedule.component';
import { DayViewComponent } from './day-view/day-view.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'day',
      },
      {
        path: 'day',
        component: DayViewComponent,
        data: { breadcrumb: 'Tagesansicht' },
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleRoutingModule { }

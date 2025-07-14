import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleComponent } from './schedule.component';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { CardComponent } from '@app/shared/components/card/card.component';
import { DayViewComponent } from './day-view/day-view.component';

@NgModule({
  declarations: [
    ScheduleComponent,
    DayViewComponent,
  ],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    CardComponent,
  ],
  exports: [ScheduleComponent]
})
export class ScheduleModule { }

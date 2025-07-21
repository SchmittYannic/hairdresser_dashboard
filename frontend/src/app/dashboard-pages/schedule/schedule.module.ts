import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_LOCALE } from '@danielmoncada/angular-datetime-picker';

import { ScheduleComponent } from './schedule.component';
import { ScheduleRoutingModule } from './schedule-routing.module';
import { CardComponent } from '@app/shared/components/card/card.component';
import { DayViewComponent } from './day-view/day-view.component';
import { ScheduleStore } from './schedule.store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownComponent } from 'app/shared/components/dropdown/dropdown';
import { WeekViewComponent } from './week-view/week-view.component';
import { MonthViewComponent } from './month-view/month-view.component';

@NgModule({
  declarations: [
    ScheduleComponent,
    DayViewComponent,
    WeekViewComponent,
    MonthViewComponent,
  ],
  imports: [
    CommonModule,
    ScheduleRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CardComponent,
    DropdownComponent,
  ],
  providers: [
    ScheduleStore,
    { provide: OWL_DATE_TIME_LOCALE, useValue: 'de' },
  ],
  exports: [ScheduleComponent]
})
export class ScheduleModule { }

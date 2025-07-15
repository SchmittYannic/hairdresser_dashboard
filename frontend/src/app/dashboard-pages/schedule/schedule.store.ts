import { Injectable } from '@angular/core';
import { Appointment } from '@app/shared/models/appointment.model';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { startOfWeek, endOfWeek } from 'date-fns';
import { ScheduleService } from './schedule.service';
import { filter, switchMap } from 'rxjs';

export type ViewMode = 'day' | 'week' | 'month';

export interface ScheduleState {
  viewMode: ViewMode;
  selectedDate: Date; // for day view
  dateRange: { start: Date; end: Date }; // for week/month view
  employeeId: string | null;
  groupedAppointments: Map<string, Appointment[]>;
}

@Injectable()
export class ScheduleStore extends ComponentStore<ScheduleState> {
  constructor(
    private readonly scheduleService: ScheduleService,
  ) {
    super({
      viewMode: 'day',
      selectedDate: new Date(),
      dateRange: getWeekRange(new Date()),
      employeeId: null,
      groupedAppointments: new Map(),
    });

    this.loadAppointmentsEffect();
  }

  readonly loadAppointmentsEffect = this.effect(() =>
    this.select(state => ({
      viewMode: state.viewMode,
      selectedDate: state.selectedDate,
      dateRange: state.dateRange,
      employeeId: state.employeeId,
    })).pipe(
      // Only run when employeeId is present
      filter(({ employeeId }) => !!employeeId),
      switchMap(({ viewMode, selectedDate, dateRange, employeeId }) => {
        if (viewMode === 'day') {
          return this.scheduleService.getGroupedAppointments({
            employeeId: employeeId!,
            dates: [selectedDate],
          });
        } else {
          return this.scheduleService.getGroupedAppointments({
            employeeId: employeeId!,
            start: dateRange.start,
            end: dateRange.end,
          });
        }
      }),
      tapResponse({
        next: (grouped) => this.patchState({ groupedAppointments: grouped }),
        error: (err) => console.error('Failed to load appointments', err),
      })
    )
  );

  readonly setViewMode = this.updater<ViewMode>((state, viewMode) => ({
    ...state,
    viewMode,
  }));

  readonly setSelectedDate = this.updater<Date>((state, selectedDate) => ({
    ...state,
    selectedDate,
    dateRange: getWeekRange(selectedDate),
  }));

  readonly setEmployeeId = this.updater<string>((state, employeeId) => ({
    ...state,
    employeeId,
  }));

  readonly viewMode$ = this.select(s => s.viewMode);
  readonly selectedDate$ = this.select(s => s.selectedDate);
  readonly dateRange$ = this.select(s => s.dateRange);
  readonly employeeId$ = this.select(s => s.employeeId);

  readonly groupedAppointments$ = this.select(s => s.groupedAppointments);

  readonly appointmentsForSelectedDate$ = this.select(
    this.selectedDate$,
    this.groupedAppointments$,
    (date, grouped) => {
      const key = date.toISOString().split('T')[0];
      return grouped.get(key) || [];
    }
  );
}

function getWeekRange(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: 1 }); // Monday start
  const end = endOfWeek(date, { weekStartsOn: 1 });     // Sunday end
  return { start, end };
}

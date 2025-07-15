import { Injectable } from '@angular/core';
import { Appointment } from '@app/shared/models/appointment.model';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';
import { startOfWeek, endOfWeek } from 'date-fns';
import { ScheduleService } from './schedule.service';
import { distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { User } from '@app/shared/models/user.model';
import { AuthStoreService } from '@app/store/auth-store.service';

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
    private readonly authStore: AuthStoreService,
  ) {
    super({
      viewMode: 'day',
      selectedDate: new Date(),
      dateRange: getWeekRange(new Date()),
      employeeId: null,
      groupedAppointments: new Map(),
    });

    this.userProfileEffect(this.authStore.userProfile$);
    //this.loadAppointmentsEffect();
  }

  readonly userProfileEffect = this.effect<User | null>(userProfile$ =>
    userProfile$.pipe(
      tap(profile => {
        if (profile?.id) {
          this.setEmployeeId(profile.id);
        } else {
          this.setEmployeeId(null);
        }
      })
    )
  );

  // readonly loadAppointmentsEffect = this.effect(() =>
  //   this.select(({ viewMode, selectedDate, dateRange, employeeId }) => ({
  //     viewMode,
  //     selectedDate,
  //     dateRange,
  //     employeeId,
  //   })).pipe(
  //     filter(({ employeeId }) => !!employeeId),
  //     switchMap(({ viewMode, selectedDate, dateRange, employeeId }) => {
  //       if (viewMode === 'day') {
  //         return this.scheduleService.getGroupedAppointments({
  //           employeeId: employeeId!,
  //           dates: [selectedDate],
  //         });
  //       } else {
  //         return this.scheduleService.getGroupedAppointments({
  //           employeeId: employeeId!,
  //           start: dateRange.start,
  //           end: dateRange.end,
  //         });
  //       }
  //     }),
  //     tapResponse({
  //       next: (grouped) => this.patchState({ groupedAppointments: grouped }),
  //       error: (err) => console.error('Failed to load appointments', err),
  //     })
  //   )
  // );

  readonly setViewMode = this.updater<ViewMode>((state, viewMode) => ({
    ...state,
    viewMode,
  }));

  readonly setSelectedDate = this.updater<Date>((state, selectedDate) => ({
    ...state,
    selectedDate,
    dateRange: getWeekRange(selectedDate),
  }));

  readonly setEmployeeId = this.updater<string | null>((state, employeeId) => ({
    ...state,
    employeeId,
  }));

  readonly viewMode$ = this.select((s) => s.viewMode);
  readonly selectedDate$ = this.select((s) => s.selectedDate);
  readonly dateRange$ = this.select((s) => s.dateRange);
  readonly employeeId$ = this.select(state => state.employeeId).pipe(distinctUntilChanged());

  readonly groupedAppointments$ = this.select((s) => s.groupedAppointments);

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
  const end = endOfWeek(date, { weekStartsOn: 1 }); // Sunday end
  return { start, end };
}

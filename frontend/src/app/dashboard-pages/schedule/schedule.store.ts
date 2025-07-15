import { Injectable } from '@angular/core';
import { tapResponse } from '@ngrx/operators';
import { Appointment } from '@app/shared/models/appointment.model';
import { ComponentStore } from '@ngrx/component-store';
import { startOfWeek, endOfWeek } from 'date-fns';
import { ScheduleService } from './schedule.service';
import { distinctUntilChanged, filter, switchMap, tap, withLatestFrom } from 'rxjs';
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
    this.loadAppointments();
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

  private readonly setAppointments = this.updater<Map<string, Appointment[]>>((state, groupedAppointments) => ({
    ...state,
    groupedAppointments,
    error: null,
  }));

  readonly loadAppointments = this.effect((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.select(s => s)),
      switchMap(([_, state]) => {
        if (!state.employeeId) {
          this.setAppointments(new Map());
          return [];
        }

        //this.setLoading(true);

        const { employeeId, viewMode, selectedDate, dateRange } = state;
        const dates = viewMode === 'day' ? [selectedDate] : undefined;
        const start = viewMode !== 'day' ? dateRange.start : undefined;
        const end = viewMode !== 'day' ? dateRange.end : undefined;

        return this.scheduleService.getGroupedAppointments({ employeeId, dates, start, end }).pipe(
          tapResponse(
            (data) => {
              this.setAppointments(data);
              //this.setLoading(false);
            },
            (error: any) => {
              //this.setError(error.message || 'Failed to load appointments');
            }
          )
        );
      })
    )
  );

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

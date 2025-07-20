import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { startOfWeek, addDays, format } from 'date-fns';
import { ScheduleStore } from 'app/dashboard-pages/schedule/schedule.store';
import { Appointment } from 'app/shared/models/appointment.model';
import { getAppointmentTop, generateTimeLabels } from '@app/shared/utils/time-utils';

@Component({
  selector: 'app-week-view',
  standalone: false,
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss'],
})
export class WeekViewComponent implements OnInit {
  times: string[] = [];
  selectedDate$: Observable<Date>;
  weekDays$: Observable<Date[]>;
  appointmentsByDate$: Observable<Map<string, Appointment[]>>;

  constructor(private readonly store: ScheduleStore) {
    this.selectedDate$ = this.store.selectedDate$;

    this.weekDays$ = this.selectedDate$.pipe(
      map((selected) => {
        const start = startOfWeek(selected, { weekStartsOn: 1 });
        return Array.from({ length: 7 }, (_, i) => addDays(start, i));
      })
    );

    this.appointmentsByDate$ = this.store.select(state => state.groupedAppointments);
  }

  ngOnInit(): void {
    this.times = generateTimeLabels();
  }

  getAppointmentTopFromString(dateString: string): string {
    const date = new Date(dateString);
    return getAppointmentTop({ appointmentStart: date, unitPerMinute: 2 });
  }

  getAppointmentHeight(duration: number): string {
    return `${duration * 2}px`;
  }

  getDateKey(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  isSameDay(d1: Date, d2: Date | null): boolean {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  }
}

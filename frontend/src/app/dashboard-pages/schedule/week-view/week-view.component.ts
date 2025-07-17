import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { startOfWeek, addDays, format } from 'date-fns';
import { ScheduleStore } from 'app/dashboard-pages/schedule/schedule.store';
import { Appointment } from 'app/shared/models/appointment.model';

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
    this.generateTimeLabels();
  }

  generateTimeLabels(): void {
    const startHour = 8;
    const endHour = 18;
    for (let minutes = startHour * 60; minutes <= endHour * 60; minutes += 30) {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const label = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      this.times.push(label);
    }
  }

  getAppointmentTopFromString(dateString: string): string {
    const date = new Date(dateString);
    return this.getAppointmentTop(date);
  }

  getAppointmentTop(start: Date): string {
    const minutes = start.getHours() * 60 + start.getMinutes();
    const dayStart = 7 * 60;
    return `${(minutes - dayStart) * 2}px`;
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

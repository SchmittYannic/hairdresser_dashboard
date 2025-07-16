import { Component } from '@angular/core';
import { Appointment } from '@app/shared/models/appointment.model';
import { Observable } from 'rxjs';
import { format } from 'date-fns';
import { ScheduleStore } from '../schedule.store';

@Component({
  selector: 'app-day-view',
  standalone: false,
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss'
})
export class DayViewComponent {
  appointments$: Observable<Appointment[]>;
  selectedDate$: Observable<Date>;

  times: string[] = [];

  constructor(private readonly store: ScheduleStore) {
    this.selectedDate$ = this.store.selectedDate$;

    this.appointments$ = this.store.select(state => {
      const key = format(state.selectedDate, 'yyyy-MM-dd');
      return state.groupedAppointments?.get(key) ?? [];
    });
  }

  ngOnInit(): void {
    this.generateTimeLabels();
  }

  generateTimeLabels(): void {
    const startHour = 7;
    const endHour = 19;
    this.times = [];

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
    const dayStart = 7 * 60; // 7:00 AM
    return `${(minutes - dayStart) * 2}px`; // 2px per minute
  }

  getAppointmentHeight(duration: number): string {
    return `${duration * 2}px`; // 2px per minute
  }
}

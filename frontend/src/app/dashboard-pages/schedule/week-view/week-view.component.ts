import { Component, OnInit } from '@angular/core';
import { ScheduleStore } from '../schedule.store';
import { Appointment } from '@app/shared/models/appointment.model';
import { Observable, map } from 'rxjs';
import { startOfWeek, addDays, format } from 'date-fns';

@Component({
  selector: 'app-week-view',
  standalone: false,
  templateUrl: './week-view.component.html',
  styleUrls: ['./week-view.component.scss'],
})
export class WeekViewComponent implements OnInit {
  times: string[] = [];
  weekDays: Date[] = [];
  appointmentsByDate$: Observable<Map<string, Appointment[]>>;

  constructor(private readonly store: ScheduleStore) {
    this.appointmentsByDate$ = this.store.select(state => state.groupedAppointments);
  }

  ngOnInit(): void {
    this.generateTimeLabels();
    this.generateWeekDays();
  }

  generateTimeLabels(): void {
    const startHour = 7;
    const endHour = 19;
    for (let minutes = startHour * 60; minutes <= endHour * 60; minutes += 30) {
      const hrs = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const label = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      this.times.push(label);
    }
  }

  generateWeekDays(): void {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday
    this.weekDays = Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }

  getAppointmentTopFromString(dateString: string): string {
    const date = new Date(dateString);
    return this.getAppointmentTop(date);
  }

  getAppointmentTop(start: Date): string {
    const minutes = start.getHours() * 60 + start.getMinutes();
    const dayStart = 7 * 60;
    return `${(minutes - dayStart) * 1}px`;
  }

  getAppointmentHeight(duration: number): string {
    return `${duration * 1}px`;
  }

  getDateKey(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }
}

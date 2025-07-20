import { Component } from '@angular/core';
import { Appointment } from '@app/shared/models/appointment.model';
import { Observable } from 'rxjs';
import { format } from 'date-fns';
import { ScheduleStore } from '../schedule.store';
import { getAppointmentTop, generateTimeLabels } from '@app/shared/utils/time-utils';

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
    this.times = generateTimeLabels();
  }

  getAppointmentTopFromString(dateString: string): string {
    const date = new Date(dateString);
    return getAppointmentTop({ appointmentStart: date });
  }

  getAppointmentHeight(duration: number): string {
    return `${duration * 1}px`;
  }
}

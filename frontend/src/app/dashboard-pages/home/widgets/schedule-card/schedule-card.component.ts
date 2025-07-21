import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '@app/shared/services/schedule.service';
import { Appointment } from '@app/shared/models/appointment.model';
import { AuthStoreService } from '@app/store/auth-store.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { format } from 'date-fns';
import { generateTimeLabels, getAppointmentTop } from '@app/shared/utils/time-utils';

@Component({
  selector: 'app-schedule-card',
  standalone: false,
  templateUrl: './schedule-card.component.html',
  styleUrl: './schedule-card.component.scss'
})
export class ScheduleCardComponent implements OnInit {
  appointments$: Observable<Appointment[]> = of([]);
  today = new Date();
  times: string[] = [];

  constructor(
    private authStore: AuthStoreService,
    private scheduleService: ScheduleService
  ) {

  }

  ngOnInit(): void {
    this.times = generateTimeLabels();
    this.appointments$ = this.authStore.userProfile$.pipe(
      switchMap(profile => {
        if (!profile?.id) return of([])
        const groupedAppointments = this.scheduleService.getGroupedAppointments({ employeeId: profile.id, dates: [this.today] }).pipe(
          map(grouped => {
            const todayKey = format(this.today, 'yyyy-MM-dd');
            return grouped.get(todayKey) ?? [];
          })
        );
        return groupedAppointments;
      })
    );
  }

  getAppointmentTopFromString(dateString: string): string {
    const date = new Date(dateString);
    return getAppointmentTop({ appointmentStart: date });
  }

  getAppointmentHeight(duration: number): string {
    return `${duration * 1}px`;
  }
}

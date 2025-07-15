import { Component, OnInit } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { ScheduleStore, ViewMode } from './schedule.store';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';
import { Appointment } from '@app/shared/models/appointment.model';

@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {
  viewMode$!: Observable<ViewMode>;
  selectedDate$!: Observable<Date>;
  // appointments$!: Observable<Appointment[]>;

  cardLabel: Record<string, string> = {
    day: 'Tagesansicht',
    week: 'Wochenansicht',
    month: 'Monatsansicht'
  };

  dropdownLabel: Record<string, string> = {
    day: 'Tag',
    week: 'Woche',
    month: 'Monat'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scheduleStore: ScheduleStore,
  ) {
    this.viewMode$ = this.scheduleStore.viewMode$;
    this.selectedDate$ = this.scheduleStore.selectedDate$;
    // this.appointments$ = this.scheduleStore.appointmentsForSelectedDate$;
  }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route.firstChild?.snapshot?.url[0]?.path || 'day'),
      )
      .subscribe(path => {
        if (['day', 'week', 'month'].includes(path)) {
          this.scheduleStore.setViewMode(path as ViewMode);
        }
      });

    const initialPath = this.route.firstChild?.snapshot?.url[0]?.path || 'day';
    if (['day', 'week', 'month'].includes(initialPath)) {
      this.scheduleStore.setViewMode(initialPath as ViewMode);
    }
  }

  handleDateChange(date: Date) {
    this.scheduleStore.setSelectedDate(date);
  }

  handleViewModeChange(dropdown: DropdownComponent, viewMode: ViewMode) {
    dropdown.close();
    this.router.navigate(['/dashboard/schedule', viewMode]);
  }
}

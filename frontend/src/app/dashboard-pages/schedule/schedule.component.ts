import { Component, OnInit } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { de } from 'date-fns/locale';
import { ScheduleStore, ViewMode } from './schedule.store';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';

@Component({
  selector: 'app-schedule',
  standalone: false,
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent implements OnInit {
  viewMode$!: Observable<ViewMode>;
  selectedDate$!: Observable<Date>;

  dropdownLabel: Record<string, string> = {
    day: 'Tagesansicht',
    week: 'Wochenansicht',
    month: 'Monatsansicht'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private scheduleStore: ScheduleStore,
  ) {
    this.viewMode$ = this.scheduleStore.viewMode$;
    this.selectedDate$ = this.scheduleStore.selectedDate$;
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

  handleChangeDay(offset: number): void {
    const current = this.scheduleStore.getSelectedDate();
    const updated = new Date(current);
    updated.setDate(current.getDate() + offset);
    this.scheduleStore.setSelectedDate(updated);
  }

  getFormattedDate(date: Date | null): string {
    if (!date) return "SELECTED_DATE_EQUALS_NULL"
    return format(date, 'EEEE, d. MMMM yyyy', { locale: de });
  }

  getWeekViewTitle(date: Date): string {
    const weekStart = startOfWeek(date, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(date, { weekStartsOn: 1 });

    const formattedStart = format(weekStart, 'd. MMMM', { locale: de });
    const formattedEnd = format(weekEnd, 'd. MMMM yyyy', { locale: de });

    return `${formattedStart} - ${formattedEnd}`;
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleComponent } from './schedule.component';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { ScheduleStore, ViewMode } from './schedule.store';

describe('ScheduleComponent', () => {
  let component: ScheduleComponent;
  let fixture: ComponentFixture<ScheduleComponent>;

  const routerEvents$ = new Subject<any>();
  const routerMock = {
    events: routerEvents$.asObservable(),
    navigate: jasmine.createSpy('navigate')
  };

  const activatedRouteMock = {
    firstChild: {
      snapshot: {
        url: [{ path: 'day' }]
      }
    }
  };

  const scheduleStoreMock = jasmine.createSpyObj('ScheduleStore', [
    'setViewMode',
    'setSelectedDate',
    'getSelectedDate'
  ], {
    viewMode$: of('day' as ViewMode),
    selectedDate$: of(new Date())
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: ScheduleStore, useValue: scheduleStoreMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial view mode based on route snapshot in ngOnInit', () => {
    activatedRouteMock.firstChild.snapshot.url = [{ path: 'week' }];
    component.ngOnInit();
    expect(scheduleStoreMock.setViewMode).toHaveBeenCalledWith('week');
  });

  it('should listen to router NavigationEnd events and update view mode', () => {
    component.ngOnInit();

    activatedRouteMock.firstChild.snapshot.url = [{ path: 'month' }];
    routerEvents$.next(new NavigationEnd(1, '/dashboard/schedule/month', '/dashboard/schedule/month'));

    expect(scheduleStoreMock.setViewMode).toHaveBeenCalledWith('month');
  });

  it('should ignore invalid paths in router events', () => {
    component.ngOnInit();

    activatedRouteMock.firstChild.snapshot.url = [{ path: 'invalid' }];
    routerEvents$.next(new NavigationEnd(1, '/dashboard/schedule/invalid', '/dashboard/schedule/invalid'));

    expect(scheduleStoreMock.setViewMode).not.toHaveBeenCalledWith('invalid');
  });

  it('handleDateChange should call scheduleStore.setSelectedDate', () => {
    const date = new Date(2025, 6, 15);
    component.handleDateChange(date);
    expect(scheduleStoreMock.setSelectedDate).toHaveBeenCalledWith(date);
  });

  it('handleViewModeChange should close dropdown and navigate', () => {
    const dropdownMock = jasmine.createSpyObj('DropdownComponent', ['close']);
    const viewMode: ViewMode = 'week';

    component.handleViewModeChange(dropdownMock, viewMode);

    expect(dropdownMock.close).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard/schedule', viewMode]);
  });

  it('handleChangeDay should update selectedDate with offset', () => {
    const baseDate = new Date(2025, 6, 10);
    scheduleStoreMock.getSelectedDate.and.returnValue(baseDate);

    component.handleChangeDay(3);

    const expectedDate = new Date(baseDate);
    expectedDate.setDate(baseDate.getDate() + 3);

    expect(scheduleStoreMock.setSelectedDate).toHaveBeenCalledWith(expectedDate);
  });

  it('getFormattedDate returns formatted string for valid date', () => {
    const date = new Date(2025, 6, 20);
    const formatted = component.getFormattedDate(date);
    expect(formatted).toContain('Juli');
  });

  it('getFormattedDate returns fallback string for null', () => {
    const result = component.getFormattedDate(null);
    expect(result).toBe('SELECTED_DATE_EQUALS_NULL');
  });

  it('getWeekViewTitle returns correct week range string', () => {
    const date = new Date(2025, 6, 20);
    const title = component.getWeekViewTitle(date);

    // Erwartet Format: "14. Juli - 20. Juli 2025"
    expect(title).toMatch(/\d{1,2}\. Juli - \d{1,2}\. Juli 2025/);
  });
});

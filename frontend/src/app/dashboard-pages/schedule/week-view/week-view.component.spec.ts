import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeekViewComponent } from './week-view.component';
import { ScheduleStore } from 'app/dashboard-pages/schedule/schedule.store';
import { of } from 'rxjs';
import { Appointment } from 'app/shared/models/appointment.model';
import { format, startOfWeek, addDays } from 'date-fns';

describe('WeekViewComponent', () => {
  let component: WeekViewComponent;
  let fixture: ComponentFixture<WeekViewComponent>;
  let storeMock: jasmine.SpyObj<ScheduleStore>;

  const mockDate = new Date(2024, 6, 17);
  const startOfWeekDate = startOfWeek(mockDate, { weekStartsOn: 1 });

  const mockAppointments = new Map<string, Appointment[]>([
    [format(mockDate, 'yyyy-MM-dd'), [
      {
        id: '1',
        start: new Date(2024, 6, 17, 10, 0).toISOString(),
        duration: 60,
      } as Appointment]
    ]
  ]);

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('ScheduleStore', ['select'], {
      selectedDate$: of(mockDate),
    });

    storeMock.select.and.returnValue(of(mockAppointments));

    await TestBed.configureTestingModule({
      declarations: [WeekViewComponent],
      providers: [{ provide: ScheduleStore, useValue: storeMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(WeekViewComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize time labels on ngOnInit', () => {
    component.ngOnInit();
    expect(component.times.length).toBeGreaterThan(0);
    expect(component.times[0]).toBe('08:00');
    expect(component.times.at(-1)).toBe('18:00');
  });

  it('should expose selectedDate$ from the store', (done) => {
    component.selectedDate$.subscribe(date => {
      expect(date).toEqual(mockDate);
      done();
    });
  });

  it('should expose appointmentsByDate$ from the store', (done) => {
    component.appointmentsByDate$.subscribe(appointmentsMap => {
      const key = format(mockDate, 'yyyy-MM-dd');
      expect(appointmentsMap.get(key)?.length).toBe(1);
      done();
    });
  });

  it('should calculate correct weekDays$ array', (done) => {
    component.weekDays$.subscribe(weekDays => {
      expect(weekDays.length).toBe(7);
      expect(weekDays[0]).toEqual(startOfWeekDate);
      expect(weekDays[6]).toEqual(addDays(startOfWeekDate, 6));
      done();
    });
  });

  it('getAppointmentTopFromString should return correct pixel value with scaling', () => {
    const px = component.getAppointmentTopFromString('2024-07-17T09:15:00');
    expect(px).toBe('150px'); // (9*60 + 15) - (8*60) = 75 * 2 = 150px
  });

  it('getAppointmentHeight should return scaled height string', () => {
    const result = component.getAppointmentHeight(30);
    expect(result).toBe('60px');
  });

  it('getDateKey should return correctly formatted string', () => {
    const result = component.getDateKey(mockDate);
    expect(result).toBe('2024-07-17');
  });

  it('isSameDay should return true for same day', () => {
    const other = new Date(2024, 6, 17);
    expect(component.isSameDay(mockDate, other)).toBeTrue();
  });

  it('isSameDay should return false for different days', () => {
    const other = new Date(2024, 6, 18);
    expect(component.isSameDay(mockDate, other)).toBeFalse();
  });

  it('isSameDay should return false if either date is null', () => {
    expect(component.isSameDay(mockDate, null)).toBeFalse();
    expect(component.isSameDay(null as any, mockDate)).toBeFalse();
  });
});

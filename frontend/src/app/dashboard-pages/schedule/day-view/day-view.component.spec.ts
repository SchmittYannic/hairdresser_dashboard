import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DayViewComponent } from './day-view.component';
import { ScheduleStore } from '../schedule.store';
import { of } from 'rxjs';
import { Appointment } from '@app/shared/models/appointment.model';
import { format } from 'date-fns';

describe('DayViewComponent', () => {
  let component: DayViewComponent;
  let fixture: ComponentFixture<DayViewComponent>;
  let storeMock: jasmine.SpyObj<ScheduleStore>;

  const mockDate = new Date(2024, 6, 20);
  const mockAppointments: Appointment[] = [
    {
      id: '1',
      start: new Date(2024, 6, 20, 9, 0).toISOString(),
      duration: 60
    } as Appointment
  ];

  beforeEach(async () => {
    storeMock = jasmine.createSpyObj('ScheduleStore', ['select'], {
      selectedDate$: of(mockDate),
    });

    storeMock.select.and.callFake((...args: any[]) => {
      if (args.length === 1 && typeof args[0] === 'function') {
        const selectorFn = args[0];
        const mockState = {
          selectedDate: mockDate,
          groupedAppointments: new Map<string, Appointment[]>([
            [format(mockDate, 'yyyy-MM-dd'), mockAppointments]
          ]),
        };
        return of(selectorFn(mockState));
      } else if (Array.isArray(args[0]) && typeof args[1] === 'function') {
        const projector = args[1];
        return of(projector(mockDate, new Map([
          [format(mockDate, 'yyyy-MM-dd'), mockAppointments]
        ])));
      }

      return of();
    });

    await TestBed.configureTestingModule({
      declarations: [DayViewComponent],
      providers: [{ provide: ScheduleStore, useValue: storeMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(DayViewComponent);
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

  it('should expose appointmentsForSelectedDate$ from the store', (done) => {
    component.appointments$.subscribe(appointments => {
      expect(appointments.length).toBe(1);
      done();
    });
  });

  it('getAppointmentTopFromString should return correct pixel value', () => {
    const offset = component.getAppointmentTopFromString('2024-07-20T09:30:00');
    expect(offset).toBe('90px');
  });

  it('getAppointmentHeight should return correct pixel height', () => {
    const height = component.getAppointmentHeight(45);
    expect(height).toBe('45px');
  });
});

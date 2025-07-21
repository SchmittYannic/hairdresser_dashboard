import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleCardComponent } from './schedule-card.component';
import { AuthStoreService } from '@app/store/auth-store.service';
import { ScheduleService } from '@app/shared/services/schedule.service';
import { of } from 'rxjs';
import { Appointment } from '@app/shared/models/appointment.model';
import { format } from 'date-fns';
import { CardComponent } from '@app/shared/components/card/card.component';

describe('ScheduleCardComponent', () => {
  let component: ScheduleCardComponent;
  let fixture: ComponentFixture<ScheduleCardComponent>;
  let authStoreMock: jasmine.SpyObj<AuthStoreService>;
  let scheduleServiceMock: jasmine.SpyObj<ScheduleService>;

  const mockDate = new Date(2025, 7, 20);
  const dateKey = format(mockDate, 'yyyy-MM-dd');

  const mockAppointments: Appointment[] = [
    {
      id: '1',
      start: new Date(2024, 6, 20, 10, 0).toISOString(),
      duration: 30,
    } as Appointment
  ];

  beforeEach(async () => {
    authStoreMock = jasmine.createSpyObj('AuthStoreService', [], {
      userProfile$: of({ id: '123' })
    });

    scheduleServiceMock = jasmine.createSpyObj('ScheduleService', ['getGroupedAppointments']);
    scheduleServiceMock.getGroupedAppointments.and.returnValue(
      of(new Map([[dateKey, mockAppointments]]))
    );

    await TestBed.configureTestingModule({
      declarations: [ScheduleCardComponent],
      imports: [
        CardComponent,
      ],
      providers: [
        { provide: AuthStoreService, useValue: authStoreMock },
        { provide: ScheduleService, useValue: scheduleServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleCardComponent);
    component = fixture.componentInstance;
    component.today = mockDate;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize time labels in ngOnInit', () => {
    component.ngOnInit();
    expect(component.times.length).toBeGreaterThan(0);
    expect(component.times[0]).toBe('08:00');
    expect(component.times.at(-1)).toBe('18:00');
  });

  it('should load appointments for today from the schedule service', (done) => {
    component.ngOnInit();

    component.appointments$.subscribe(appointments => {
      expect(scheduleServiceMock.getGroupedAppointments).toHaveBeenCalledWith({
        employeeId: '123',
        dates: [component.today]
      });

      expect(appointments.length).toBe(1);
      done();
    });
  });

  it('should return correct appointment top from string', () => {
    const top = component.getAppointmentTopFromString('2024-07-20T09:15:00');
    expect(top).toBe('75px');
  });

  it('should return correct appointment height', () => {
    const height = component.getAppointmentHeight(30);
    expect(height).toBe('30px');
  });

  it('should return empty list if user profile is missing', async () => {
    const localAuthStoreMock = jasmine.createSpyObj('AuthStoreService', [], {
      userProfile$: of(null)
    });

    await TestBed.resetTestingModule()
      .configureTestingModule({
        declarations: [ScheduleCardComponent],
        imports: [CardComponent],
        providers: [
          { provide: AuthStoreService, useValue: localAuthStoreMock },
          { provide: ScheduleService, useValue: scheduleServiceMock }
        ]
      })
      .compileComponents();

    const localFixture = TestBed.createComponent(ScheduleCardComponent);
    const localComponent = localFixture.componentInstance;
    localComponent.today = mockDate;

    localComponent.ngOnInit();

    localComponent.appointments$.subscribe(appointments => {
      expect(appointments).toEqual([]);
    });
  });
});

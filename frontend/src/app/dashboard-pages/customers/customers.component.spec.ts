import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, BehaviorSubject } from 'rxjs';
import { CustomersComponent } from './customers.component';
import { UserService } from '@app/shared/services/user.service';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';

describe('CustomersComponent', () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let queryParamMap$: BehaviorSubject<any>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const usersResponse = {
      users: [
        {
          email: 'john@example.com',
          roles: ['role'],
          title: 'Mr.',
          lastname: 'Doe',
          firstname: 'John',
          birthday: '1990-01-01',
          phonenumber: '1234567890',
          validated: true,
          reminderemail: false,
          birthdayemail: false,
          newsletter: true,
          createdAt: new Date().toISOString()
        }
      ],
      total: 1
    };

    mockUserService = jasmine.createSpyObj('UserService', ['getUsers']);
    mockUserService.getUsers.and.returnValue(of(usersResponse));

    queryParamMap$ = new BehaviorSubject(
      convertToParamMap({
        offset: '0',
        limit: '10',
        sortField: 'lastname',
        sortOrder: 'asc',
        lastname: '',
        firstname: '',
        roles: []
      })
    );

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CustomersComponent],
      providers: [
        { provide: UserService, useValue: mockUserService },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamMap$.asObservable()
          }
        },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
  });

  it('should fetch users on init with correct params', () => {
    component.ngOnInit();

    expect(mockUserService.getUsers).toHaveBeenCalledWith(
      0,
      10,
      'lastname',
      'asc',
      '',
      '',
      []
    );

    expect(component.users.length).toBe(1);
    expect(component.users[0].firstname).toBe('John');
    expect(component.totalItems).toBe(1);
  });

  it('should react to queryParamMap changes', () => {
    component.ngOnInit();

    queryParamMap$.next(convertToParamMap({
      offset: '10',
      limit: '5',
      sortField: 'firstname',
      sortOrder: 'desc',
      lastname: 'Smith',
      firstname: 'Jane',
      roles: ['Admin', 'User']
    }));

    expect(mockUserService.getUsers).toHaveBeenCalledWith(
      10,
      5,
      'firstname',
      'desc',
      'Smith',
      'Jane',
      ['Admin', 'User']
    );
  });
});

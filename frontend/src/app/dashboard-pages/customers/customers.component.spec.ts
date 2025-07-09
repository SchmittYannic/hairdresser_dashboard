import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomersComponent } from './customers.component';
import { UserService } from '@app/shared/services/user.service';
import { User } from '@app/shared/models/user.model';

describe('CustomersComponent', () => {
  let component: CustomersComponent;
  let fixture: ComponentFixture<CustomersComponent>;

  const mockUserService = {
    getUsers: jasmine.createSpy('getUsers').and.returnValue(of({
      users: [
        {
          id: '1',
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com',
          roles: ['employee']
        }
      ],
      total: 1
    }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomersComponent],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersComponent);
    component = fixture.componentInstance;
  });

  it('should fetch users on init', () => {
    component.ngOnInit();

    expect(mockUserService.getUsers).toHaveBeenCalledWith(0, 10, 'lastname', 'asc');
    expect(component.users.length).toBe(1);
    expect(component.users[0].firstname).toBe('John');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { SigninComponent } from './signin.component';
import { AuthService } from '../auth.service';
import { AuthStoreService } from 'app/store/auth-store.service';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;
  let mockAuthService: any;
  let mockAuthStoreService: any;
  let mockRouter: any;

  const mockUser = {
    id: '23423hhhjf',
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(async () => {
    mockAuthService = {
      signin: jasmine.createSpy('signin'),
      loadUserProfile: jasmine.createSpy('loadUserProfile')
    };

    mockAuthStoreService = {
      setToken: jasmine.createSpy('setToken')
    };

    mockRouter = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [SigninComponent],
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: AuthStoreService, useValue: mockAuthStoreService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid when form is empty', () => {
    component.signinForm.setValue({
      email: '',
      password: '',
      saveDetails: true
    });
    expect(component.signinForm.invalid).toBeTrue();
  });

  it('should call signin and loadUserProfile and navigate on success', () => {
    component.signinForm.setValue({
      email: 'test@example.com',
      password: '123456',
      saveDetails: true
    });

    mockAuthService.signin.and.returnValue(of({ accessToken: 'abc123' }));
    mockAuthService.loadUserProfile.and.returnValue(of(mockUser));

    component.onSubmit();

    expect(mockAuthService.signin).toHaveBeenCalledWith('test@example.com', '123456', true);
    expect(mockAuthStoreService.setToken).toHaveBeenCalledWith('abc123');
    expect(mockAuthService.loadUserProfile).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should set error message on 401 error', () => {
    mockAuthService.signin.and.returnValue(throwError(() => ({ status: 401 })));

    component.signinForm.setValue({
      email: 'test@example.com',
      password: 'wrongpassword',
      saveDetails: true
    });

    component.onSubmit();

    expect(component.error).toBe('Login failed. Please check your credentials.');
  });

  it('should set error message on 403 error', () => {
    mockAuthService.signin.and.returnValue(throwError(() => ({ status: 403 })));

    component.signinForm.setValue({
      email: 'test@example.com',
      password: 'noaccess',
      saveDetails: true
    });

    component.onSubmit();

    expect(component.error).toBe('Access denied: not an employee or admin');
  });

  it('should set generic error message on unknown error', () => {
    mockAuthService.signin.and.returnValue(throwError(() => ({ status: 500 })));

    component.signinForm.setValue({
      email: 'test@example.com',
      password: 'servererror',
      saveDetails: true
    });

    component.onSubmit();

    expect(component.error).toBe('An error occurred. Try again later or contact support.');
  });

  it('should mark form fields as touched if form is invalid', () => {
    spyOn(component.signinForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.signinForm.markAllAsTouched).toHaveBeenCalled();
  });
});

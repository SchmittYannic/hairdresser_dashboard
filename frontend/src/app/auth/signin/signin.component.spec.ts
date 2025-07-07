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

  beforeEach(async () => {
    mockAuthService = {
      signin: jasmine.createSpy('signin')
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

  it('should call AuthService and navigate on success', () => {
    component.signinForm.setValue({
      email: 'test@example.com',
      password: '123456',
      saveDetails: true
    });

    mockAuthService.signin.and.returnValue(of({ accessToken: 'abc123' }));

    component.onSubmit();

    expect(mockAuthService.signin).toHaveBeenCalledWith('test@example.com', '123456', true);
    expect(mockAuthStoreService.setToken).toHaveBeenCalledWith('abc123');
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

  it('should mark form fields as touched if form is invalid', () => {
    spyOn(component.signinForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.signinForm.markAllAsTouched).toHaveBeenCalled();
  });
});

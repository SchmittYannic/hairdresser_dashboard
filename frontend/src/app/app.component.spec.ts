import { fakeAsync, tick, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { AuthStoreService } from './store/auth-store.service';
import { provideRouter, Routes, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({ standalone: true, template: 'dummy' })
class DummyComponent { }

const testRoutes: Routes = [
  { path: '', component: DummyComponent },
  { path: 'dashboard', component: DummyComponent },
  { path: 'signin', component: DummyComponent }
];

describe('AppComponent', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let authStoreSpy: jasmine.SpyObj<AuthStoreService>;
  let router: Router;

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
    authServiceSpy = jasmine.createSpyObj('AuthService', ['refreshToken', 'loadUserProfile']);
    authStoreSpy = jasmine.createSpyObj('AuthStoreService', [
      'setIsRefreshLoading',
      'setToken',
      'clearToken'
    ]);

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterOutlet],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: AuthStoreService, useValue: authStoreSpy },
        provideRouter(testRoutes)
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    spyOn(router, 'navigate');
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have the "Hairdresser Dashboard" title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toBe('Hairdresser Dashboard');
  });

  it('should refresh token, load user profile, and redirect to /dashboard if initial path is /', fakeAsync(() => {
    const tokenResponse = { accessToken: 'test-token' };
    authServiceSpy.refreshToken.and.returnValue(of(tokenResponse));
    authServiceSpy.loadUserProfile.and.returnValue(of(mockUser));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    (app as any).initialPath = '/';

    fixture.detectChanges();
    tick();

    expect(authStoreSpy.setIsRefreshLoading).toHaveBeenCalledWith(true);
    expect(authServiceSpy.refreshToken).toHaveBeenCalled();
    expect(authStoreSpy.setToken).toHaveBeenCalledWith('test-token');
    expect(authServiceSpy.loadUserProfile).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    expect(authStoreSpy.setIsRefreshLoading).toHaveBeenCalledWith(false);
  }));

  it('should refresh token, load user profile, and redirect to preserved initialPath if not "/"', fakeAsync(() => {
    const tokenResponse = { accessToken: 'test-token' };
    authServiceSpy.refreshToken.and.returnValue(of(tokenResponse));
    authServiceSpy.loadUserProfile.and.returnValue(of(mockUser));

    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    (app as any).initialPath = '/some-feature';

    fixture.detectChanges();
    tick();

    expect(authStoreSpy.setIsRefreshLoading).toHaveBeenCalledWith(true);
    expect(authServiceSpy.refreshToken).toHaveBeenCalled();
    expect(authStoreSpy.setToken).toHaveBeenCalledWith('test-token');
    expect(authServiceSpy.loadUserProfile).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/some-feature');
    expect(authStoreSpy.setIsRefreshLoading).toHaveBeenCalledWith(false);
  }));

  it('should handle refreshToken error and navigate to /signin', fakeAsync(() => {
    authServiceSpy.refreshToken.and.returnValue(throwError(() => new Error('fail')));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();

    expect(authStoreSpy.setIsRefreshLoading).toHaveBeenCalledWith(true);
    expect(authServiceSpy.refreshToken).toHaveBeenCalled();
    expect(authStoreSpy.clearToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
    expect(authStoreSpy.setIsRefreshLoading).toHaveBeenCalledWith(false);
  }));

  it('should handle loadUserProfile error and navigate to /signin', fakeAsync(() => {
    const tokenResponse = { accessToken: 'test-token' };
    authServiceSpy.refreshToken.and.returnValue(of(tokenResponse));
    authServiceSpy.loadUserProfile.and.returnValue(throwError(() => new Error('fail')));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();

    expect(authServiceSpy.refreshToken).toHaveBeenCalled();
    expect(authServiceSpy.loadUserProfile).toHaveBeenCalled();
    expect(authStoreSpy.clearToken).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
    expect(authStoreSpy.setIsRefreshLoading).toHaveBeenCalledWith(false);
  }));
});

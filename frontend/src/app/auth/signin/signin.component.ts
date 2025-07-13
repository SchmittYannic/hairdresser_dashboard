import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { AuthStoreService } from 'app/store/auth-store.service';
import { finalize, switchMap } from 'rxjs';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  signinForm: FormGroup;
  error: string | null = null;
  signinRequestLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: AuthStoreService,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      saveDetails: [true]
    });
  }

  get email() {
    return this.signinForm.get('email');
  }

  get password() {
    return this.signinForm.get('password');
  }

  get saveDetails() {
    return this.signinForm.get('saveDetails');
  }

  onSubmit() {
    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }

    const { email, password, saveDetails } = this.signinForm.value;
    this.signinRequestLoading = true;

    this.authService.signin(email, password, saveDetails).pipe(
      switchMap((res) => {
        this.store.setToken(res.accessToken);
        return this.authService.loadUserProfile();
      }),
      finalize(() => {
        this.signinRequestLoading = false;
      })
    ).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status === 403) {
          this.error = 'Access denied: not an employee or admin';
        } else if (err.status === 401) {
          this.error = 'Login failed. Please check your credentials.';
        } else {
          this.error = 'An error occurred. Try again later or contact support.';
        }
      }
    });
  }
}

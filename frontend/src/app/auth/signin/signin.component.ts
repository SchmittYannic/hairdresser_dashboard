import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { AuthStoreService } from '../../store/auth-store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: false,
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
  signinForm: FormGroup;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private store: AuthStoreService,
    private router: Router
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signinForm.valid) {
      const { email, password } = this.signinForm.value;

      this.authService.signin(email, password).subscribe({
        next: (res) => {
          this.store.setToken(res.accessToken);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Login failed', err);
          this.error = 'Login failed. Please check your credentials.';
        }
      });
    }
  }
}

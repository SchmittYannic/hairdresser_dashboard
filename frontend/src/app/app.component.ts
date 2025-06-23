import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './auth/auth.service';
import { AuthStoreService } from './store/auth-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(
    private authService: AuthService,
    private store: AuthStoreService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.refreshToken().subscribe({
      next: (res) => {
        this.store.setToken(res.accessToken);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.store.clearToken();
        this.router.navigate(['/signin']);
      }
    });
  }
}

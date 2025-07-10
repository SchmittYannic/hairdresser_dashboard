import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AuthService } from './auth/auth.service';
import { AuthStoreService } from './store/auth-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
  styles: [`
    .loading-screen {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100dvh;
      font-size: 1.5rem;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'frontend';
  private initialPath: string = '/';

  constructor(
    private authService: AuthService,
    private store: AuthStoreService,
    private router: Router,
    private location: Location
  ) {
    this.initialPath = this.location.path() || '/';
  }

  ngOnInit(): void {
    this.store.setIsRefreshLoading(true);
    this.authService.refreshToken().subscribe({
      next: (res) => {
        this.store.setToken(res.accessToken);
        this.router.navigateByUrl(this.initialPath);
        this.store.setIsRefreshLoading(false);
      },
      error: () => {
        this.store.clearToken();
        this.router.navigate(['/signin']);
        this.store.setIsRefreshLoading(false);
      }
    });
  }
}

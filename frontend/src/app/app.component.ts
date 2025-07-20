import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { finalize, switchMap } from 'rxjs';

import { AuthService } from './auth/auth.service';
import { AuthStoreService } from './store/auth-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent implements OnInit {
  title = 'Hairdresser Dashboard';
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

    this.authService.refreshToken().pipe(
      switchMap((res) => {
        this.store.setToken(res.accessToken);
        return this.authService.loadUserProfile();
      }),
      finalize(() => {
        this.store.setIsRefreshLoading(false);
      })
    ).subscribe({
      next: () => {
        const redirectPath = this.initialPath === '' || this.initialPath === '/'
          ? '/dashboard'
          : this.initialPath;
        this.router.navigateByUrl(redirectPath);
      },
      error: () => {
        this.store.clearToken();
        this.router.navigate(['/signin']);
      }
    });
  }
}

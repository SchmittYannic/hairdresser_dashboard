import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthStoreService } from 'app/store/auth-store.service';
import { environment } from 'environments/environment';
import { User } from '@app/shared/models/user.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private store: AuthStoreService,
    private router: Router
  ) { }

  signin(email: string, password: string, saveDetails: boolean) {
    return this.http.post<{ accessToken: string }>(
      `${this.apiUrl}/signin`,
      { email, password, saveDetails },
      { withCredentials: true }
    );
  }

  refreshToken() {
    return this.http.post<{ accessToken: string }>(
      `${this.apiUrl}/refresh`,
      {},
      { withCredentials: true }
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true });
  }

  loadUserProfile(): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/users/me`, { withCredentials: true }).pipe(
      tap({
        next: profile => this.store.setUserProfile(profile),
        error: _ => console.error('Error loading profile')
      })
    );
  }

  get currentUserProfile(): User | null {
    return this.store.getUserProfile();
  }
}

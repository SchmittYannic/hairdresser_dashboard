import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthStoreService } from 'app/store/auth-store.service';
import { environment } from 'environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private store: AuthStoreService,
    private router: Router
  ) { }

  signin(email: string, password: string, saveDetails: boolean) {
    console.log("saveDetails: ", saveDetails)
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

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.store.clearToken();
      this.router.navigate(['/signin']);
    });
  }
}

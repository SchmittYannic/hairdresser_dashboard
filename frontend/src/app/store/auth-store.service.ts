import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  accessToken$ = this.accessTokenSubject.asObservable();

  setToken(token: string) {
    this.accessTokenSubject.next(token);
  }

  getToken(): string | null {
    return this.accessTokenSubject.getValue();
  }

  clearToken() {
    this.accessTokenSubject.next(null);
  }
}

import { Injectable } from '@angular/core';
import { User } from '@app/shared/models/user.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
  private isRefreshLoadingSubject = new BehaviorSubject<boolean>(false);
  isRefreshLoading$ = this.isRefreshLoadingSubject.asObservable();
  private accessTokenSubject = new BehaviorSubject<string | null>(null);
  accessToken$ = this.accessTokenSubject.asObservable();
  private userProfileSubject = new BehaviorSubject<User | null>(null);
  userProfile$ = this.userProfileSubject.asObservable();

  setToken(token: string) {
    this.accessTokenSubject.next(token);
  }

  getToken(): string | null {
    return this.accessTokenSubject.getValue();
  }

  clearToken() {
    this.accessTokenSubject.next(null);
  }

  setIsRefreshLoading(isLoading: boolean) {
    this.isRefreshLoadingSubject.next(isLoading);
  }

  getIsRefreshLoading(): boolean {
    return this.isRefreshLoadingSubject.getValue()
  }

  setUserProfile(profile: User) {
    this.userProfileSubject.next(profile);
  }

  getUserProfile(): User | null {
    return this.userProfileSubject.getValue();
  }

  clearUserProfile() {
    this.userProfileSubject.next(null);
  }
}

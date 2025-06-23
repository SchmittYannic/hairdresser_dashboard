import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthStoreService } from '../store/auth-store.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store: AuthStoreService, private router: Router) { }

  canActivate(): boolean {
    if (this.store.getToken()) return true;

    this.router.navigate(['/signin']);
    return false;
  }
}

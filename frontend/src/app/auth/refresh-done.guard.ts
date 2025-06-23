import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthStoreService } from 'app/store/auth-store.service';
import { Observable } from 'rxjs';
import { map, filter, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RefreshDoneGuard implements CanActivate {
  constructor(private store: AuthStoreService) { }

  canActivate(): Observable<boolean> {
    return this.store.isRefreshLoading$.pipe(
      filter(loading => loading === false), // only continue when refresh has finished
      take(1),
      map(() => true)
    );
  }
}

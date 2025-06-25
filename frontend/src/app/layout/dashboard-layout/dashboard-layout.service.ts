import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardLayoutService {
  private isSidebarFixed = new BehaviorSubject<boolean>(true); // Sidebar is fixed or overlay
  private isSidebarCollapsed = new BehaviorSubject<boolean>(false); // True when collapsed

  isSidebarFixed$ = this.isSidebarFixed.asObservable();
  isSidebarCollapsed$ = this.isSidebarCollapsed.asObservable();

  getIsSidebarFixed(): boolean {
    return this.isSidebarFixed.getValue();
  }

  getIsSidebarCollapsed(): boolean {
    return this.isSidebarCollapsed.getValue();
  }

  toggleSidebarCollapse(): void {
    this.isSidebarCollapsed.next(!this.isSidebarCollapsed.value);
  }

  toggleSidebarFixed(): void {
    this.isSidebarFixed.next(!this.isSidebarFixed.value);
  }

  setSidebarCollapse(value: boolean): void {
    this.isSidebarCollapsed.next(value);
  }

  setSidebarFixed(value: boolean): void {
    this.isSidebarFixed.next(value);
  }
}

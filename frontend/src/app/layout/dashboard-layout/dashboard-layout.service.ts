import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardLayoutService {
  private isSidebarFixed = new BehaviorSubject<boolean>(true); // Sidebar is fixed or overlay
  private isSidebarCollapsed = new BehaviorSubject<boolean>(false); // True when collapsed
  private isNotificationsOpen = new BehaviorSubject<boolean>(false);
  private isUserDropdownOpen = new BehaviorSubject<boolean>(false);

  isSidebarFixed$ = this.isSidebarFixed.asObservable();
  isSidebarCollapsed$ = this.isSidebarCollapsed.asObservable();
  isNotificationsOpen$ = this.isNotificationsOpen.asObservable();
  isUserDropdownOpen$ = this.isUserDropdownOpen.asObservable();

  getIsSidebarFixed(): boolean {
    return this.isSidebarFixed.getValue();
  }

  getIsSidebarCollapsed(): boolean {
    return this.isSidebarCollapsed.getValue();
  }

  getisNotificationsOpen(): boolean {
    return this.isNotificationsOpen.getValue();
  }

  getisUserDropdownOpen(): boolean {
    return this.isUserDropdownOpen.getValue();
  }

  toggleSidebarCollapse(): void {
    this.isSidebarCollapsed.next(!this.isSidebarCollapsed.value);
  }

  toggleSidebarFixed(): void {
    this.isSidebarFixed.next(!this.isSidebarFixed.value);
  }

  toggleNotificationsOpen(): void {
    this.isNotificationsOpen.next(!this.isNotificationsOpen.value);
  }

  toggleUserDropdownOpen(): void {
    this.isUserDropdownOpen.next(!this.isUserDropdownOpen.value);
  }

  setSidebarCollapse(value: boolean): void {
    this.isSidebarCollapsed.next(value);
  }

  setSidebarFixed(value: boolean): void {
    this.isSidebarFixed.next(value);
  }

  setNotificationsOpen(value: boolean): void {
    this.isNotificationsOpen.next(value);
  }

  setUserDropdownOpen(value: boolean): void {
    this.isUserDropdownOpen.next(value);
  }
}

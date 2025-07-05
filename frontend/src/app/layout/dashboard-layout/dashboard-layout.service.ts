import { Injectable, ElementRef, OnDestroy } from '@angular/core';
import { BehaviorSubject, debounceTime, fromEvent, Subscription, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardLayoutService implements OnDestroy {
  private isMobile = new BehaviorSubject<boolean>(false);
  readonly MOBILE_BREAKPOINT = 991;
  private resizeSubscription!: Subscription;
  private isSidebarFixed = new BehaviorSubject<boolean>(true);
  private isSidebarCollapsed = new BehaviorSubject<boolean>(false);
  private isNotificationsOpen = new BehaviorSubject<boolean>(false);
  private isUserDropdownOpen = new BehaviorSubject<boolean>(false);
  private isMobileSidebarCollapsed = new BehaviorSubject<boolean>(true);
  private isMobileHeaderSwitched = new BehaviorSubject<boolean>(false);
  private sidebarElement?: ElementRef;

  isMobile$ = this.isMobile.asObservable();
  isSidebarFixed$ = this.isSidebarFixed.asObservable();
  isSidebarCollapsed$ = this.isSidebarCollapsed.asObservable();
  isNotificationsOpen$ = this.isNotificationsOpen.asObservable();
  isUserDropdownOpen$ = this.isUserDropdownOpen.asObservable();
  isMobileSidebarCollapsed$ = this.isMobileSidebarCollapsed.asObservable();
  isMobileHeaderSwitched$ = this.isMobileHeaderSwitched.asObservable();

  constructor() {
    this.checkMobile(window.innerWidth);
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(
        debounceTime(150),
        map(() => window.innerWidth)
      )
      .subscribe(width => this.checkMobile(width));
  }

  private checkMobile(width: number) {
    this.isMobile.next(width <= this.MOBILE_BREAKPOINT);
    if (width <= this.MOBILE_BREAKPOINT) {
      this.isSidebarFixed.next(true);
      this.isSidebarCollapsed.next(false);
    }
  }

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

  getIsMobileSidebarCollapsed(): boolean {
    return this.isMobileSidebarCollapsed.getValue();
  }

  getIsMobileHeaderSwitched(): boolean {
    return this.isMobileHeaderSwitched.getValue();
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

  toggleMobileSidebarCollapsed(): void {
    this.isMobileSidebarCollapsed.next(!this.isMobileSidebarCollapsed.value);

    if (this.isMobileSidebarCollapsed) {
      setTimeout(() => {
        document.addEventListener('click', this.handleOutsideMobileSidebarClicked);
      });
    } else {
      document.removeEventListener('click', this.handleOutsideMobileSidebarClicked);
    }
  }

  toggleMobileHeaderSwitched(): void {
    this.isMobileHeaderSwitched.next(!this.isMobileHeaderSwitched.value);
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

  setMobileSidebarCollapsed(value: boolean): void {
    this.isMobileSidebarCollapsed.next(value);
  }

  setMobileHeaderSwitched(value: boolean): void {
    this.isMobileHeaderSwitched.next(value);
  }

  setSidebarElement(ref: ElementRef) {
    this.sidebarElement = ref;
  }

  handleOutsideMobileSidebarClicked = (event: MouseEvent): void => {
    const sidebarEl = this.sidebarElement?.nativeElement;

    const clickedInsideSidebar = sidebarEl.contains(event.target);

    if (!clickedInsideSidebar) {
      this.setMobileSidebarCollapsed(true);
      document.removeEventListener('click', this.handleOutsideMobileSidebarClicked);
    }
  };

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
  }
}

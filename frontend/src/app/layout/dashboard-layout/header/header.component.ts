import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { DashboardLayoutService } from 'app/layout/dashboard-layout/dashboard-layout.service';
import { AuthService } from 'app/auth/auth.service';
import { AuthStoreService } from 'app/store/auth-store.service';
import { DropdownComponent } from 'app/shared/components/dropdown/dropdown.component';
import { User } from 'app/shared/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    CommonModule,
    DropdownComponent,
  ]
})
export class HeaderComponent implements OnInit {
  userProfile$!: Observable<User | null>;

  isMobile = false;
  isFullscreen = false;
  isMobileSidebarCollapsed = true;
  isMobileHeaderSwitched = false;

  constructor(
    public layout: DashboardLayoutService,
    private authService: AuthService,
    private store: AuthStoreService,
    private router: Router,
  ) { }

  toggleFullscreen(): void {
    const elem = document.documentElement as any;

    if (!this.isFullscreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      const doc = document as any;
      if (doc.exitFullscreen) {
        doc.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  }

  handleMobileCollapseClicked(event: MouseEvent): void {
    event.preventDefault();
    this.layout.toggleMobileSidebarCollapsed();
  }

  handleMobileHeaderSwitchClicked(event: MouseEvent): void {
    event.preventDefault();
    this.layout.toggleMobileHeaderSwitched();
  }

  handleLogoutClicked(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.store.clearToken();
        this.router.navigate(['/signin']);
      },
      error: (_) => {
        console.error('Logout failed');
        this.store.clearToken();
        this.router.navigate(['/signin']);
      }
    });
  }

  ngOnInit(): void {
    this.userProfile$ = this.store.userProfile$;

    this.layout.isMobile$.subscribe(val => this.isMobile = val);
    this.layout.isMobileSidebarCollapsed$.subscribe(val => this.isMobileSidebarCollapsed = val);
    this.layout.isMobileHeaderSwitched$.subscribe(val => this.isMobileHeaderSwitched = val);
  }

  @HostListener('document:fullscreenchange')
  onFullScreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
  }
}

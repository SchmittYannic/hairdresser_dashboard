import { Component, OnInit, HostListener } from '@angular/core';
import { DashboardLayoutService } from '../dashboard-layout.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    CommonModule,
  ]
})
export class HeaderComponent implements OnInit {
  isNotificationsOpen = false;
  isUserDropdownOpen = false;
  isFullscreen = false;
  isMobileSidebarCollapsed = true;

  constructor(public layout: DashboardLayoutService) { }

  handleNotificationToggleClick(event: MouseEvent) {
    event.preventDefault();
    this.layout.toggleNotificationsOpen();
    this.layout.setUserDropdownOpen(false);
  }

  handleUserDropdownToggleClick(event: MouseEvent) {
    event.preventDefault();
    this.layout.toggleUserDropdownOpen();
    this.layout.setNotificationsOpen(false);
  }

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

  ngOnInit(): void {
    this.layout.isNotificationsOpen$.subscribe(val => this.isNotificationsOpen = val);
    this.layout.isUserDropdownOpen$.subscribe(val => this.isUserDropdownOpen = val);
    this.layout.isMobileSidebarCollapsed$.subscribe(val => this.isMobileSidebarCollapsed = val);
  }

  @HostListener('document:fullscreenchange')
  onFullScreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
  }
}

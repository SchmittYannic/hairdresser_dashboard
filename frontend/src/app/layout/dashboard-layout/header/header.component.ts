import { Component, OnInit } from '@angular/core';
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

  ngOnInit(): void {
    this.layout.isNotificationsOpen$.subscribe(val => this.isNotificationsOpen = val);
    this.layout.isUserDropdownOpen$.subscribe(val => this.isUserDropdownOpen = val)
  }
}

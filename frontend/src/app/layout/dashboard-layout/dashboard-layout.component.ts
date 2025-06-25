import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
import { DashboardLayoutService } from './dashboard-layout.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
  imports: [
    RouterModule,
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    CommonModule
  ]
})
export class DashboardLayoutComponent implements OnInit {
  isFixed = false;
  isCollapsed = false;

  constructor(public layout: DashboardLayoutService) { }

  ngOnInit(): void {
    this.layout.isSidebarFixed$.subscribe(val => this.isFixed = val);
    this.layout.isSidebarCollapsed$.subscribe(val => this.isCollapsed = val);
  }
}

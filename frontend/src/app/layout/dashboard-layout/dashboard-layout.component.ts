import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DashboardLayoutService } from './dashboard-layout.service';
import { SidebarModule } from './sidebar/sidebar.module';
import { BreadcrumbComponent } from '@app/shared/components/breadcrumb/';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
  imports: [
    RouterModule,
    CommonModule,
    SidebarModule,
    HeaderComponent,
    FooterComponent,
    BreadcrumbComponent,
  ]
})
export class DashboardLayoutComponent implements OnInit {
  isFixed = false;
  isCollapsed = false;
  isMobileSidebarCollapsed = true;

  @ViewChild('sidebar', { read: ElementRef }) sidebarRef!: ElementRef;

  constructor(public layout: DashboardLayoutService) { }

  ngOnInit(): void {
    this.layout.isSidebarFixed$.subscribe(val => this.isFixed = val);
    this.layout.isSidebarCollapsed$.subscribe(val => this.isCollapsed = val);
    this.layout.isMobileSidebarCollapsed$.subscribe(val => this.isMobileSidebarCollapsed = val);
  }

  ngAfterViewInit(): void {
    this.layout.setSidebarElement(this.sidebarRef);
  }
}

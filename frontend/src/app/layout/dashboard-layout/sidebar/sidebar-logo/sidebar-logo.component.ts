import { Component } from '@angular/core';
import { DashboardLayoutService } from '../../dashboard-layout.service';

@Component({
  selector: 'app-sidebar-logo',
  standalone: false,
  templateUrl: './sidebar-logo.component.html',
  styleUrl: './sidebar-logo.component.scss'
})
export class SidebarLogoComponent {

  isFixed = false;

  constructor(public layoutService: DashboardLayoutService) { }

  handleCollapseClick(event: MouseEvent) {
    event.preventDefault();
    this.layoutService.toggleSidebarFixed();
    //this.layoutService.toggleSidebarCollapse();
  }

  ngOnInit(): void {
    this.layoutService.isSidebarFixed$.subscribe(val => this.isFixed = val);
  }
}

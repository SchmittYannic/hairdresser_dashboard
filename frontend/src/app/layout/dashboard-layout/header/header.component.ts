import { Component, OnInit, HostListener } from '@angular/core';
import { DashboardLayoutService } from '../dashboard-layout.service';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '@app/shared/components/dropdown/dropdown.component';

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
  isMobile = false;
  isFullscreen = false;
  isMobileSidebarCollapsed = true;
  isMobileHeaderSwitched = false;

  constructor(public layout: DashboardLayoutService) { }

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

  ngOnInit(): void {
    this.layout.isMobile$.subscribe(val => this.isMobile = val);
    this.layout.isMobileSidebarCollapsed$.subscribe(val => this.isMobileSidebarCollapsed = val);
    this.layout.isMobileHeaderSwitched$.subscribe(val => this.isMobileHeaderSwitched = val);
  }

  @HostListener('document:fullscreenchange')
  onFullScreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
  }
}

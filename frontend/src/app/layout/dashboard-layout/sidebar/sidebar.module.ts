import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from './sidebar.component';
import { SidebarLogoComponent } from './sidebar-logo/sidebar-logo.component';
import { SidebarContentComponent } from './sidebar-content/sidebar-content.component';

@NgModule({
  declarations: [
    SidebarComponent,
    SidebarLogoComponent,
    SidebarContentComponent,
  ],
  imports: [CommonModule],
  exports: [SidebarComponent]
})
export class SidebarModule { }

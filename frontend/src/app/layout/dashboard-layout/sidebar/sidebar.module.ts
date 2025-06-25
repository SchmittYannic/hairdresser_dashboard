import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SidebarComponent } from './sidebar.component';
import { SidebarLogoComponent } from './sidebar-logo/sidebar-logo.component';

@NgModule({
  declarations: [
    SidebarComponent,
    SidebarLogoComponent,
  ],
  imports: [CommonModule],
  exports: [SidebarComponent]
})
export class SidebarModule { }

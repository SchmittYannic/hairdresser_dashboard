import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from './sidebar.component';
import { SidebarLogoComponent } from './sidebar-logo/sidebar-logo.component';
import { SidebarContentComponent } from './sidebar-content/sidebar-content.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SidebarGroupComponent } from './sidebar-group/sidebar-group.component';
import { SidebarItemComponent } from './sidebar-item/sidebar-item.component';

@NgModule({
  declarations: [
    SidebarComponent,
    SidebarLogoComponent,
    SidebarContentComponent,
    SidebarGroupComponent,
    SidebarItemComponent,
  ],
  imports: [
    CommonModule,
    NgScrollbarModule,
    RouterModule,
  ],
  exports: [SidebarComponent]
})
export class SidebarModule { }

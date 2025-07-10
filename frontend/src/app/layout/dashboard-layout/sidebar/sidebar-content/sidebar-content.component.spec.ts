import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SidebarContentComponent } from './sidebar-content.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SidebarGroupComponent } from '../sidebar-group/sidebar-group.component';
import { SidebarItemComponent } from '../sidebar-item/sidebar-item.component';

describe('SidebarContentComponent', () => {
  let component: SidebarContentComponent;
  let fixture: ComponentFixture<SidebarContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SidebarContentComponent,
        SidebarGroupComponent,
        SidebarItemComponent,
      ],
      imports: [
        NgScrollbarModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

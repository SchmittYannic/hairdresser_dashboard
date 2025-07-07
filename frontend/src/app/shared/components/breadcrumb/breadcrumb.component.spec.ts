import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { of, Subject } from 'rxjs';
import { BreadcrumbComponent } from './breadcrumb.component';
import { Component } from '@angular/core';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let routerEvents$: Subject<any>;
  let mockRouter: any;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    routerEvents$ = new Subject();

    mockRouter = {
      events: routerEvents$.asObservable(),
      navigate: jasmine.createSpy('navigate')
    };

    mockActivatedRoute = {
      root: {
        children: []
      }
    };

    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize breadcrumbs on ngOnInit', () => {
    spyOn(component as any, 'buildBreadcrumbs').and.returnValue([{ label: 'Home', url: '/home' }]);
    component.ngOnInit();
    expect(component.breadcrumbs).toEqual([{ label: 'Home', url: '/home' }]);
  });

  it('should update breadcrumbs on NavigationEnd event', () => {
    spyOn(component as any, 'buildBreadcrumbs').and.returnValue([{ label: 'Dashboard', url: '/dashboard' }]);
    component.ngOnInit();
    routerEvents$.next(new NavigationEnd(1, '/dashboard', '/dashboard'));
    expect(component.breadcrumbs).toEqual([{ label: 'Dashboard', url: '/dashboard' }]);
  });

  it('should return the current page title', () => {
    component.breadcrumbs = [
      { label: 'Home', url: '/home' },
      { label: 'Profile', url: '/home/profile' }
    ];
    expect(component.currentPageTitle).toBe('Profile');
  });

  it('should return empty string if no breadcrumbs', () => {
    component.breadcrumbs = [];
    expect(component.currentPageTitle).toBe('');
  });

  it('buildBreadcrumbs should return empty array if no children', () => {
    const result = (component as any).buildBreadcrumbs({ children: [] });
    expect(result).toEqual([]);
  });

  it('buildBreadcrumbs should build breadcrumbs recursively', () => {
    const mockRoute = {
      children: [
        {
          snapshot: {
            url: [{ path: 'section' }],
            data: { breadcrumb: 'Section' }
          },
          children: [
            {
              snapshot: {
                url: [{ path: 'sub' }],
                data: { breadcrumb: 'Subsection' }
              },
              children: []
            }
          ]
        }
      ]
    };
    const result = (component as any).buildBreadcrumbs(mockRoute);
    expect(result).toEqual([
      { label: 'Section', url: '/section' },
      { label: 'Subsection', url: '/section/sub' }
    ]);
  });

  it('buildBreadcrumbs should use routeURL as label if breadcrumb data is missing', () => {
    const mockRoute = {
      children: [
        {
          snapshot: {
            url: [{ path: 'foo' }],
            data: {}
          },
          children: []
        }
      ]
    };
    const result = (component as any).buildBreadcrumbs(mockRoute);
    expect(result).toEqual([{ label: 'foo', url: '/foo' }]);
  });
});

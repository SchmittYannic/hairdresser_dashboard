import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-item',
  standalone: false,
  templateUrl: './sidebar-item.component.html',
  styleUrl: './sidebar-item.component.scss'
})
export class SidebarItemComponent {
  @Input() links!: string[];

  constructor(public router: Router) { }

  isActive(): boolean {
    return this.links.some(link => {
      const tree = this.router.createUrlTree([link]);
      return this.router.isActive(tree, {
        paths: 'exact',
        queryParams: 'ignored',
        matrixParams: 'ignored',
        fragment: 'ignored'
      });
    });
  }
}

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  @Input() cardTitle: string = '';
  @Input() headerLink: string = '';

  hasHeaderLink(): boolean {
    return !!this.headerLink?.trim();
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() pageSize: number = 10;
  @Input() pageIndex: number = 0;
  @Output() pageChange = new EventEmitter<number>();

  get paginationPages(): number[] {
    const totalPages = this.totalPages; // total number of pages
    const current = this.pageIndex;     // 0-based
    const maxVisible = 5;
    const pages: number[] = [];

    let start = Math.max(0, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end >= totalPages) {
      end = totalPages - 1;
      start = Math.max(0, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages && page !== this.pageIndex) {
      this.pageChange.emit(page);
    }
  }
}

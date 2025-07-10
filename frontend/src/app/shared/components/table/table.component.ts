import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import {
  createAngularTable,
  ColumnDef,
  getCoreRowModel,
  Column,
} from '@tanstack/angular-table';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T> implements OnChanges {
  @Input() data: T[] = [];
  @Input() columns: ColumnDef<T, any>[] = [];

  @Input() pagination = { pageIndex: 0, pageSize: 10 };
  @Input() sorting = { sortField: '', sortOrder: 'asc' };
  @Input() totalItems = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortingChange = new EventEmitter<{ field: string; order: 'asc' | 'desc' }>();

  table = {} as ReturnType<typeof createAngularTable<T>>;

  private createTable() {
    this.table = createAngularTable<T>(() => ({
      data: this.data,
      columns: this.columns,
      getCoreRowModel: getCoreRowModel(),
    }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['columns']) {
      this.createTable();
    }
  }

  onHeaderClick(column: Column<T>) {
    const isColumnSortedCurrently = column.id === this.sorting.sortField;
    const currentSortOrder = this.sorting.sortOrder;
    const nextOrder = !isColumnSortedCurrently ? 'asc' : currentSortOrder === 'asc' ? 'desc' : 'asc';
    this.sortingChange.emit({ field: column.id, order: nextOrder });
  }

  onPreviousPage() {
    if (this.pagination.pageIndex > 0) {
      this.pageChange.emit(this.pagination.pageIndex - 1);
    }
  }

  onNextPage() {
    const maxPages = Math.ceil(this.totalItems / this.pagination.pageSize);
    if (this.pagination.pageIndex + 1 < maxPages) {
      this.pageChange.emit(this.pagination.pageIndex + 1);
    }
  }
}

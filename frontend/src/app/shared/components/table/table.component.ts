import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import {
  createAngularTable,
  ColumnDef,
  getCoreRowModel,
  Column,
  FlexRenderDirective,
} from '@tanstack/angular-table';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    NgScrollbarModule,
    FlexRenderDirective
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T> implements OnChanges {
  @Input() isLoading: boolean = false;
  @Input() data: T[] = [];
  @Input() columns: ColumnDef<T, any>[] = [];

  @Input() pagination = { pageIndex: 0, pageSize: 10 };
  @Input() sorting = { sortField: '', sortOrder: 'asc' };
  @Input() totalItems = 0;

  @Output() sortingChange = new EventEmitter<{ sortField: string; sortOrder: 'asc' | 'desc' }>();

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
    this.sortingChange.emit({ sortField: column.id, sortOrder: nextOrder });
  }
}

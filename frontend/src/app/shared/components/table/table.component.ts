import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {
  createAngularTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from '@tanstack/angular-table';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T> implements OnChanges {

  @Input() data: T[] = [];
  @Input() columns: ColumnDef<T, any>[] = [];
  @Input() pageSize = 10;

  sorting: SortingState = [];
  pagination = {
    pageIndex: 0,
    pageSize: this.pageSize,
  };

  table = {} as ReturnType<typeof createAngularTable<T>>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['columns']) {
      this.createTable();
    }
  }

  private createTable() {
    this.table = createAngularTable<T>(() => ({
      data: this.data,
      columns: this.columns,
      state: {
        sorting: this.sorting,
        pagination: this.pagination,
      },
      onSortingChange: updater => {
        this.sorting = typeof updater === 'function' ? updater(this.sorting) : updater;
        this.setTableState();
      },
      onPaginationChange: updater => {
        this.pagination = typeof updater === 'function' ? updater(this.pagination) : updater;
        this.setTableState();
      },
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
    }));
  }

  private setTableState() {
    this.table.setOptions(prev => ({
      ...prev,
      data: this.data,
      columns: this.columns,
      state: {
        ...prev.state,
        sorting: this.sorting,
        pagination: this.pagination,
      }
    }));
  }

  onPreviousPage() {
    if (this.pagination.pageIndex > 0) {
      this.pagination.pageIndex--;
      this.setTableState();
    }
  }

  onNextPage() {
    if ((this.pagination.pageIndex + 1) * this.pagination.pageSize < this.data.length) {
      this.pagination.pageIndex++;
      this.setTableState();
    }
  }
}

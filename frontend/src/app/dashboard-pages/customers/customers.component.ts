import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColumnDef } from '@tanstack/angular-table';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, startWith, takeUntil, Subject } from 'rxjs';
import { TableComponent } from '@app/shared/components/table/table.component';
import { User } from '@app/shared/models/user.model';
import { UserService } from '@app/shared/services/user.service';
import { CardComponent } from '@app/shared/components/card/card.component';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    CardComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit, OnDestroy {
  users: User[] = [];
  totalItems: number = 0;

  lastnameFilter = new FormControl('');
  firstnameFilter = new FormControl('');
  private destroy$ = new Subject<void>();

  roles: string[] = ['User', 'Employee', 'Admin'];
  selectedRoles: Set<string> = new Set();

  pagination = {
    pageIndex: 0,
    pageSize: 10
  };

  sorting = {
    sortField: 'lastname',
    sortOrder: 'asc'
  };

  columns: ColumnDef<User, any>[] = [
    {
      header: 'Nachname',
      accessorKey: 'lastname'
    },
    {
      header: 'Vorname',
      accessorKey: 'firstname',
    },
    {
      header: 'Telefonnummer',
      accessorKey: 'phonenumber',
    }
  ];

  constructor(private userService: UserService) { }

  fetchUsers() {
    const { pageIndex, pageSize } = this.pagination;
    const { sortField, sortOrder } = this.sorting;
    const offset = pageIndex * pageSize;
    const lastname = this.lastnameFilter.value ?? '';
    const firstname = this.firstnameFilter.value ?? '';
    const roles = Array.from(this.selectedRoles);

    this.userService
      .getUsers(offset, pageSize, sortField, sortOrder, lastname, firstname, roles)
      .subscribe(response => {
        this.users = response.users;
        this.totalItems = response.total;
      });
  }

  onPageChange(pageIndex: number) {
    this.pagination.pageIndex = pageIndex;
    this.fetchUsers();
  }

  onSortingChange(sortField: string, sortOrder: 'asc' | 'desc') {
    this.sorting = { sortField, sortOrder };
    this.pagination.pageIndex = 0;
    this.fetchUsers();
  }

  toggleRole(role: string) {
    if (this.selectedRoles.has(role)) {
      this.selectedRoles.delete(role);
    } else {
      this.selectedRoles.add(role);
    }
    this.pagination.pageIndex = 0;
    this.fetchUsers();
  }

  isRoleSelected(role: string): boolean {
    return this.selectedRoles.has(role);
  }

  ngOnInit() {
    combineLatest([
      this.lastnameFilter.valueChanges.pipe(startWith('')),
      this.firstnameFilter.valueChanges.pipe(startWith(''))
    ])
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.pagination.pageIndex = 0;
        this.fetchUsers();
      });

    this.fetchUsers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

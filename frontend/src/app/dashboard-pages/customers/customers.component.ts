import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ColumnDef } from '@tanstack/angular-table';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, startWith, takeUntil, Subject, skip } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
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

  roleLabels: Record<string, string> = {
    User: 'Nutzer',
    Employee: 'Mitarbeiter',
    Admin: 'Admin'
  };

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
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Erstellt',
      accessorKey: 'createdAt',
    }
  ];

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

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
    this.updateQueryParams();
  }

  onSortingChange(sortField: string, sortOrder: 'asc' | 'desc') {
    this.sorting = { sortField, sortOrder };
    this.pagination.pageIndex = 0;
    this.updateQueryParams();
  }

  toggleRole(role: string) {
    if (this.selectedRoles.has(role)) {
      this.selectedRoles.delete(role);
    } else {
      this.selectedRoles.add(role);
    }
    this.pagination.pageIndex = 0;
    this.updateQueryParams();
  }

  isRoleSelected(role: string): boolean {
    return this.selectedRoles.has(role);
  }

  private updateQueryParams() {
    const queryParams: any = {
      offset: this.pagination.pageIndex * this.pagination.pageSize,
      limit: this.pagination.pageSize,
      sortField: this.sorting.sortField,
      sortOrder: this.sorting.sortOrder,
      lastname: this.lastnameFilter.value || null,
      firstname: this.firstnameFilter.value || null,
    };

    if (this.selectedRoles.size > 0) {
      queryParams.roles = Array.from(this.selectedRoles);
    } else {
      queryParams.roles = null;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private setupFilterListeners() {
    combineLatest([
      this.lastnameFilter.valueChanges.pipe(startWith(this.lastnameFilter.value)),
      this.firstnameFilter.valueChanges.pipe(startWith(this.firstnameFilter.value))
    ])
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        skip(1),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.pagination.pageIndex = 0;
        this.updateQueryParams();
      });
  }

  ngOnInit() {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.pagination.pageIndex = +params.get('offset')! / (+params.get('limit')! || 10) || 0;
        this.pagination.pageSize = +params.get('limit')! || 10;

        this.sorting.sortField = params.get('sortField') || 'lastname';
        this.sorting.sortOrder = (params.get('sortOrder') as 'asc' | 'desc') || 'asc';

        this.lastnameFilter.setValue(params.get('lastname') || '', { emitEvent: false });
        this.firstnameFilter.setValue(params.get('firstname') || '', { emitEvent: false });

        const rolesParam = params.getAll('roles');
        this.selectedRoles = new Set(rolesParam);

        this.fetchUsers();
      });

    this.setupFilterListeners();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

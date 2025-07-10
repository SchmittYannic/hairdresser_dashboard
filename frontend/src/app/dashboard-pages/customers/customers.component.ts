import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ColumnDef } from '@tanstack/angular-table';
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
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  users: User[] = [];
  totalItems: number = 0;

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

    this.userService
      .getUsers(offset, pageSize, sortField, sortOrder)
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

  ngOnInit() {
    this.userService.getUsers(0, 10, 'lastname', 'asc').subscribe(response => {
      this.users = response.users;
      this.totalItems = response.total;
      console.log('Users:', response.users);
      console.log('Total users:', response.total);
    });
  }
}

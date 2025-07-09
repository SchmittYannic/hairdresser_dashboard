import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ColumnDef } from '@tanstack/angular-table';
import { TableComponent } from '@app/shared/components/table/table.component';
import { User } from '@app/shared/models/user.model';
import { UserService } from '@app/shared/services/user.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
  ],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
  users: User[] = [];

  columns: ColumnDef<User, any>[] = [
    {
      header: 'First Name',
      accessorKey: 'firstname',
    },
    {
      header: 'Lastname',
      accessorKey: 'lastname'
    },
    {
      header: 'Email',
      accessorKey: 'email',
    }
  ];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers(0, 10, 'lastname', 'asc').subscribe(response => {
      this.users = response.users;
      console.log('Users:', response.users);
      console.log('Total users:', response.total);
    });
  }
}

import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { UsersService } from '../../../../services/users';
import { User } from '../../../../models/user';
import { Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-list-users',
  imports: [ CommonModule,MatTableModule,MatPaginatorModule,MatButtonModule],
  templateUrl: './list-users.html',
  styleUrl: './list-users.scss',
})
export class ListUsers {

  @Input() search: string = '';

users: User[] = [];
  displayedColumns: string[] = [
    'name',
    'username',
    'email',
    'role',
    'points',
    'createdAt',
    'actions'
  ];

  currentPage = 1;
  totalPages = 1;
  totalUsers = 0;
  pageSize = 5;
  dataSource = new MatTableDataSource<User>();
  constructor(private userService: UsersService,private cdr: ChangeDetectorRef) {}



  ngOnChanges(changes: SimpleChanges) {
  if (changes['search']) {
    this.currentPage = 1; // reset paginación
    console.log('el searche es', this.search)
    this.loadUsers();
  }

  }


  ngOnInit() {
    this.loadUsers();
  }

loadUsers() {
  this.userService
    .getUsers(this.currentPage, this.pageSize, this.search)
    .subscribe(res => {
      this.dataSource.data = res.data;
      this.totalUsers = res.totalUsers;
    });
}

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  editUser(user: any) {
    console.log('Editar usuario:', user);

    // Ejemplo navegación:
    // this.router.navigate(['/edit-user', user._id]);
  }
}

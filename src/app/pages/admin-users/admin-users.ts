import { ChangeDetectorRef, Component } from '@angular/core';
import { Header } from '../../shared/header/header';
import { Toolbar } from '../../shared/toolbar/toolbar';
import { MenuLateral } from '../../shared/menu-lateral/menu-lateral';
import { CommonModule } from '@angular/common';
import { PaginatedUsers, User } from '../../models/user';
import { UsersService } from '../../services/users';
import { PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ListUsers } from "./components/list-users/list-users";
import { SearchUser } from './components/search-user/search-user';


@Component({
  selector: 'app-admin-users',
  imports: [SearchUser,Toolbar, Header, MenuLateral, CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule, ListUsers],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.scss',
})
export class AdminUSers {
  
  constructor() {}


searchTerm: string = '';

onSearch(term: string) {
  this.searchTerm = term;
}

}

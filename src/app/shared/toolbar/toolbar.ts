import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-toolbar',
  imports: [MatIconModule, MatMenuModule],
  templateUrl: './toolbar.html',
  styleUrl: './toolbar.scss',
})
export class Toolbar {



  constructor( private auth:AuthService
  ) {

  }

  ngOnInit() {

  }



  logOut() {
    this.auth.logout();
  }
}

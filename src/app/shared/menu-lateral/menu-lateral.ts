import { Component } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MenuService } from '../../services/menu-service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-menu-lateral',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './menu-lateral.html',
  styleUrl: './menu-lateral.scss',
})
export class MenuLateral {

  constructor(
    public menuService: MenuService,
    private router: Router
  ) {}

  showCashRegisterSubMenu = false;
  showBlogSubMenu = false;

  ngOnInit() {

    this.updateMenuState(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateMenuState(event.urlAfterRedirects);
      });

  }

  toggleCashRegisterSubmenu() {
    this.showCashRegisterSubMenu = !this.showCashRegisterSubMenu;
  }

  toggleBlog() {
    this.showBlogSubMenu = !this.showBlogSubMenu;
  }

  updateMenuState(url: string) {

    this.showCashRegisterSubMenu =
      url.includes('races') ||
      url.includes('cashregister-history');

    this.showBlogSubMenu =
      url.includes('blog') ||
      url.includes('list-news');

  }

}
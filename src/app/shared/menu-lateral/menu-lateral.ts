import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuService } from '../../services/menu-service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';



@Component({
  selector: 'app-menu-lateral',
  imports: [RouterModule,CommonModule,MatButtonModule,MatIconModule],
  templateUrl: './menu-lateral.html',
  styleUrl: './menu-lateral.scss',
})
export class MenuLateral {
    constructor(public menuService:MenuService) { }

     showRecetasSubmenu = false;
  showCashRegisterSubMenu = false;

  ngOnInit(){
  }


  toggleRecetasSubmenu() {
    this.showRecetasSubmenu = !this.showRecetasSubmenu;
  }


  toggleCashRegisterSubmenu(){
    this.showCashRegisterSubMenu = !this.showCashRegisterSubMenu
  }
}

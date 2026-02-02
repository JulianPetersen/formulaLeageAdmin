import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MenuService } from '../../services/menu-service';

@Component({
  selector: 'app-header',
  imports: [MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {

  constructor(public menuService:MenuService){

  }

    openMenu(){
    if(this.menuService.menuView == false){
      this.menuService.menuView = true;
    }else{
      this.menuService.menuView = false;
    }
  }
}

import { Component } from '@angular/core';
import { MenuLateral } from "../../shared/menu-lateral/menu-lateral";
import { Header } from "../../shared/header/header";
import { CommonModule } from '@angular/common';
import { Toolbar } from "../../shared/toolbar/toolbar";

@Component({
  selector: 'app-admin',
  imports: [MenuLateral, Header, CommonModule, Toolbar],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class Admin {

}

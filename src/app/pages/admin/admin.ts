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

  topUsers:any[] = [
    {name:'julian', points:'100'},
    {name:'Rocco', points:'100'},
    {name:'Analia', points:'100'},
    {name:'Daniel', points:'100'},
    {name:'Daiana', points:'100'}

  ]
}

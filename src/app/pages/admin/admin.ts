import { Component } from '@angular/core';
import { MenuLateral } from "../../shared/menu-lateral/menu-lateral";
import { Header } from "../../shared/header/header";
import { CommonModule } from '@angular/common';
import { Toolbar } from "../../shared/toolbar/toolbar";
import { AuthService } from '../../services/auth';
import { UsersService } from '../../services/users';
import { GlobalService } from '../../services/global-service';

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


  constructor( private user:UsersService, private auth:AuthService,private global:GlobalService){
     this.getInfoUser()
     
  }

  ngOnInit(){
    this.getVisitsPage()
  }

  getInfoUser(){
    this.user.getUserById()
      .subscribe({
        next :((res) => {
          console.log(res)
        }),
        error: (err) => {
          console.log(err)
          if(err.status == 401){  
            this.auth.logout()
          }
        }
      })
  }


  getVisitsPage(){
    this.global.getVisitsPage('HOME')
      .subscribe({
        next: ((res) => {
          console.log(res)
        }),
        error : (err)  => {
          console.log(err)
        }
      })
  }
}

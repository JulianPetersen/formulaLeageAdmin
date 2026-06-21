import { Component } from '@angular/core';
import { GlobalService } from '../../services/global-service';
import { VisitsPageModel } from '../../models/visits-page';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(private global:GlobalService){

  }


  ngOnInit(){
    this.registerPage()
  }

  registerPage(){
    let data = {
      count:1,
      page:"HOME"
    }
    this.global.registerVisitPage(data)
      .subscribe({
        next: ((res:VisitsPageModel) => {
          console.log(res)
        }),
        error: (err) => {
          console.log(err.message)
        }
      })
  }

click(){
    let data = {
      count: 1,
      page:"DESCARGA"
    }
    this.global.registerVisitPage(data)
    .subscribe({
        next: ((res:VisitsPageModel) => {
          console.log(res)
        }),
        error: (err) => {
          console.log(err.message)
        }
      })
  }
}

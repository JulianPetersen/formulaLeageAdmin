import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  imports: [MatDialogContent,MatDialogActions,MatButton,MatDialogClose],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class AlertComponent {
  
  constructor(@Inject(MAT_DIALOG_DATA) public data:any){}

  titile:string="Titulo"
  content:string="content messagge"

  ngOnInit(){
    console.log(this.data)
  }
}

import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent } from '@angular/material/dialog';


@Component({
  selector: 'app-delete-dialog',
  imports: [MatDialogContent,MatDialogActions,MatButton,MatDialogClose],
  templateUrl: './delete-dialog.html',
  styleUrl: './delete-dialog.scss',
})
export class DeleteDialog {
  constructor( @Inject(MAT_DIALOG_DATA) public data:any){
  }


  ngOnInit(){
    console.log('ID EN DIALOG',this.data)
  }
}

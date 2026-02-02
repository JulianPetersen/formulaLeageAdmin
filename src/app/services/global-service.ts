import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../shared/ui/alert/alert';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor(public dialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object) {

  }

  showAlertWhitFunction(title: string, content: string, afterCloseCallback?: () => void) {
    const dialogRef = this.dialog.open(AlertComponent, {
      data: { title, content },
      width: '250px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res == true) {
        afterCloseCallback?.();
        dialogRef.close()
      }
    });
  }
}

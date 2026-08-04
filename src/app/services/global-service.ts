import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from '../shared/ui/alert/alert';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VisitsPageModel } from '../models/visits-page';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {


  //Desarrollo
  // public api = 'http://localhost:4000';

  //produccion
  public api = 'https://formulaleague.site';


  constructor(public dialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object,private http:HttpClient) {

  }

    getToken(): string | null {

    return localStorage.getItem('token');
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


  registerVisitPage(data:VisitsPageModel) {
    return this.http.post<VisitsPageModel>(`${this.api}/api/visitspage`, data);
  }

  getVisitsPage(page:string) {
        const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get<VisitsPageModel>(`${this.api}/api/visitspage/${page}`, {headers});
  }

}

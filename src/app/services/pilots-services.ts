import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global-service';
import { PilotsModel } from '../models/pilots';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PilotsServices {

  constructor(private http: HttpClient, public global:GlobalService){}

    private pilotsAddedSource = new Subject<void>();
    pilotsAdded$ = this.pilotsAddedSource.asObservable(); // <-- observable público


    getToken(): string | null {

    return localStorage.getItem('token');
  }


  createPilot(formData: FormData) {

    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.post(`${this.global.api}/api/pilot`, formData, { headers });
  }

    getAllPilots() {
      const token = this.getToken();
      const headers = new HttpHeaders({
        'authorization': `Bearer ${token}` || '',
      });
      return this.http.get<PilotsModel[]>(`${this.global.api}/api/pilot`, { headers });
    }
  

    
  deletePilot(id: string) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.delete(`${this.global.api}/api/pilot/${id}`, { headers })
  }

    notifyManagmentAdded() {
    this.pilotsAddedSource.next();
  }

  
  updatePilot(formData: FormData, id: string) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.patch(`${this.global.api}/api/pilot/${id}`, formData, { headers });
  }

}

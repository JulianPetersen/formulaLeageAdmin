import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TeamsModel } from '../models/teams';
import { Subject } from 'rxjs';
import { GlobalService } from './global-service';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {



  constructor(private http: HttpClient, private global:GlobalService) { }

  private teamsAddedSource = new Subject<void>();
  teamsAdded$ = this.teamsAddedSource.asObservable(); // <-- observable público

  getToken(): string | null {

    return localStorage.getItem('token');
  }


  createTeam(formData: FormData) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.post(`${this.global.api}/api/teams`, formData, { headers });
  }

  getAllTeams() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get<TeamsModel[]>(`${this.global.api}/api/teams`, { headers });
  }

  deleteTeam(id: string) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.delete(`${this.global.api}/api/teams/${id}`, { headers })
  }

  updateTeam(formData: FormData, id: string) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.patch(`${this.global.api}/api/teams/${id}`, formData, { headers });
  }

  notifyManagmentAdded() {
    this.teamsAddedSource.next();
  }
}

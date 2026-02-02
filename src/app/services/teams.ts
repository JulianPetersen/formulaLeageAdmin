import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Teams } from '../pages/teams/teams';
import { TeamsModel } from '../models/teams';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {

  private api = 'http://localhost:4000';

  constructor(private http: HttpClient) { }

  getToken(): string | null {

    return localStorage.getItem('token');
  }


  createTeam(formData: FormData) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.post(`${this.api}/api/teams`, formData, { headers });
  }

  getAllTeams() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get<TeamsModel[]>(`${this.api}/api/teams`, { headers });
  }

  deleteTeam(id: string) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.delete(`${this.api}/api/teams/${id}`, { headers })
  }

  updateTeam(formData: FormData,id:string){
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.patch(`${this.api}/api/teams/${id}`, formData, { headers });
  }
}

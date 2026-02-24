import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global-service';
import { RaceModel } from '../models/race';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RacesService {


  constructor(private http: HttpClient, public global: GlobalService) { }

  private racesAddedSource = new Subject<void>();
  racesAdded$ = this.racesAddedSource.asObservable(); // <-- observable público



  getToken(): string | null {

    return localStorage.getItem('token');
  }


  createRace(formData: FormData) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.post(`${this.global.api}/api/race`, formData, { headers });
  }

  getAllRaces() {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'authorization': `Bearer ${token}` || '',
    });
    return this.http.get<RaceModel[]>(`${this.global.api}/api/race`, { headers });
  }

  closeRace(raceId: string, result: { pilot: string; position: number }[]) {
    const token = this.getToken();

    const headers = new HttpHeaders({
      authorization: `Bearer ${token}`
    });

    return this.http.put(
      `${this.global.api}/api/race/${raceId}/close`,
      { result },
      { headers }
    );
  }

  notifyManagmentAdded() {
    this.racesAddedSource.next();
  }

  updateRaceStatus(id: string, status: string): Observable<RaceModel> {
        const token = this.getToken();

    const headers = new HttpHeaders({
      authorization: `Bearer ${token}`
    });

    return this.http.patch<RaceModel>(`${this.global.api}/api/race/${id}`, { status },{ headers });
  }
}
